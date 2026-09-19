import User from "../models/userModel"
import validator from "validator"
import bcrypt from "bcrypt"
import genToken from "../utils/genToken"

export const signup = async (req,res) => {
    try {
        const {name,email,password, role} = req.body
        let existUser = await User.findOne({email})
        if(existUser){
            return res.status(400).json({message:"User already exist"})
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({message:"Enter valid email"})
        }
        if(password.length < 8){
            return res.status(400).json({message:"Enter strong password"})
        }
        let hashPassword = await bcrypt.hash(password,10)
        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role
        })
        let token = await genToken(user._id)
         res.cookie("token", token, {
            httpOnly:true,
            secure:false,
            sameSite:"strict",
            maxAge: 7*24*60*60*1000
        })
         
        res.status(201).json({message:"User created successfully", user})
    } catch (error) {
        return res.status(500).json({message:`Internal server ${error}`})
    }
}

export const login = async (req,res) => {
    try {
        const {email,password} = req.body
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"User does not exist"})
        }
        let isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"})
        }
        let token = await genToken(user._id)
         res.cookie("token", token, {
            httpOnly:true,
            secure:false,
            sameSite:"strict",
            maxAge: 7*24*60*60*1000
        })
         
        res.status(200).json({message:"Login successful", user})
    } catch (error) {
        return res.status(500).json({message:`Login error ${error}`})
    }
}

export const logout = async (req,res) => {
    try {
        await res.clearCookie("token")
        res.status(200).json({message:"Logout successful"})
    } catch (error) {
        return res.status(500).json({message:`Logout error ${error}`})
    }
}
