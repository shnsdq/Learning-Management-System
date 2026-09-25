import User from "../models/userModel.js"
import validator from "validator"
import bcrypt from "bcryptjs"
import genToken from "../config/token.js"

export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body
        let existUser = await User.findOne({ email })
        if (existUser) {
            return res.status(400).json({ message: "User already exist" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Enter valid email" })
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Enter strong password" })
        }
        let hashPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role
        })
        let token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(201).json({ message: "User created successfully", user })
    } catch (error) {
        return res.status(500).json({ message: `Internal server ${error}` })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User does not exist" })
        }
        let isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        let token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({ message: "Login successful", user })
    } catch (error) {
        return res.status(500).json({ message: `Login error ${error}` })
    }
}

export const logout = async (req, res) => {
    try {
        await res.clearCookie("token")
        res.status(200).json({ message: "Logout successful" })
    } catch (error) {
        return res.status(500).json({ message: `Logout error ${error}` })
    }
}

export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User does not exist" })
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString()

        user.resetOtp = otp
        user.otpExpires = Date.now() + 5 * 60 * 1000 // OTP expires in 5 minutes
        user.isOtpVerified = false

        await user.save()
        await sendMail(email, otp)

        return res.status(200).json({ message: "OTP sent successfully" })
    } catch (error) {
        return res.status(500).json({ message: `Send OTP error ${error}` })
    }
}

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body
        const user = await User.findOne({ email })
        if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" })
        }

        user.isOtpVerified = true
        user.resetOtp = undefined
        user.otpExpires = undefined

        await user.save()

        return res.status(200).json({ message: "OTP verified successfully" })
    } catch (error) {
        return res.status(500).json({ message: `Verify OTP error ${error}` })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User does not exist" })
        }
        if (!user.isOtpVerified) {
            return res.status(400).json({ message: "Please verify your OTP first" })
        }
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(newPassword, salt)
        user.isOtpVerified = false
        await user.save()
        return res.status(200).json({ message: "Password reset successfully" })
    } catch (error) {
        return res.status(500).json({ message: `Reset password error ${error}` })
    }
}

export const googleAuth = async (req, res) => {
    try {
        const { name, email, role } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            const newUser = await User.create({
                name,
                email,
                role
            })
        }
        let token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `Internal server ${error}` })
    }
}