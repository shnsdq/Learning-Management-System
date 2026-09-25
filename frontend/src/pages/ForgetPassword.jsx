import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'

const ForgetPassword = () => {
    const [step, setStep] = useState(1)
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [conPassword, setConPassword] = useState("")
    const [loading, setLoading] = useState(false)

    // for step
    const sendOtp = async () => {
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/v1/auth/sendotp", { email }, { withCredentials: true }
            )
            setLoading(false)
            setStep(2)
            toast.success(result.data.message)

        } catch (error) {
            setLoading(false)
            toast.error(error.response.data.message)
        }
    }

    //for step 2
    const verifyOtp = async () => {
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/v1/auth/verifyotp", { email, otp }, { withCredentials: true })
            setLoading(false)
            setStep(3)
            toast.success(result.data.message)
        } catch (error) {

            toast.error(error.response.data.message)
            setLoading(false)
        }
    }

    // for step 3
    const resetPassword = async () => {
        setLoading(true)
        try {
            if (newPassword !== conPassword) {
                setLoading(false)
                toast.error("Passwords do not match")
                return
            }

            const result = await axios.post(serverUrl + "/api/v1/auth/resetpassword", { email, password: newPassword },
                { withCredentials: true })
            setLoading(false)
            toast.success(result.data.message)
            navigate("/login")
        } catch (error) {
            setLoading(false)
            toast.error(error.response.data.message)
        }
    }


    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
            {/* step 1 */}
            {step == 1 && <div className='bg-white shadow-md rounded-xl p-8 max-w-md w-full'>
                <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>Forget Your Password</h2>
                <form className='space-y-4' onSubmit={(e) => { e.preventDefault() }}>
                    <div>
                        <label htmlFor="email" className='block text-sm text-gray-700 font-medium'>Enter your Email</label>
                        <input id='email' type="email" placeholder='Enter your email' className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[black]' required onChange={(e) => setEmail(e.target.value)} value={email} />
                    </div>
                    <button className='w-full bg-[black] text-white py-2 px-4 rounded-md hover:bg-[#4b4b4b] font-medium cursor-pointer' disabled={loading} onClick={sendOtp}>{loading ? <Clipboard size={30} color='white' /> : "Send OTP"}</button>
                </form>
                <div className='text-sm text-center mt-4 cursor-pointer' onClick={() => navigate("/login")}>Back to Login</div>

            </div>}

            {/* step 2 */}
            {step == 2 && <div className='bg-white shadow-md rounded-xl p-8 max-w-md w-full'>
                <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>Enter OTP</h2>
                <form className='space-y-4' onSubmit={(e) => { e.preventDefault() }}>
                    <div>
                        <label htmlFor="otp" className='block text-sm text-gray-700 font-medium'>Please enter the 4 digit code sent to your email</label>
                        <input id='otp' type="text" placeholder='* * * *' className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[black]' required onChange={(e) => setOtp(e.target.value)} value={otp} />
                    </div>
                    <button className='w-full bg-[black] text-white py-2 px-4 rounded-md hover:bg-[#4b4b4b] font-medium cursor-pointer' disabled={loading} onClick={verifyOtp} >
                        {loading ? <ClipLoader size={30} color='white' /> : "Verify OTP"}
                    </button>
                </form>
                <div className='text-sm text-center mt-4 cursor-pointer' onClick={() => navigate("/login")}>Back to Login</div>

            </div>}

            {/* step 3 */}
            {step == 3 && <div className='bg-white shadow-md rounded-xl p-8 max-w-md w-full'>
                <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>Reset your password</h2>
                <p className='text-sm text-gray-500text-center mb-6'>Please enter your new password below to regain access to your account</p>
                <form className='space-y-4' onSubmit={(e) => { e.preventDefault() }}>
                    <div>
                        <label htmlFor="password" className='block text-sm text-gray-700 font-medium'>New Password</label>
                        <input id='password' type="password" placeholder='********' className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[black]' required onChange={(e) => setNewPassword(e.target.value)} value={newPassword} />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className='block text-sm text-gray-700 font-medium'>Confirm Password</label>
                        <input id='confirmPassword' type="password" placeholder='********' className='mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[black]' required onChange={(e) => setConPassword(e.target.value)} value={conPassword} />
                    </div>
                    <button className='w-full bg-[black] text-white py-2 px-4 rounded-md hover:bg-[#4b4b4b] font-medium cursor-pointer' onClick={resetPassword} disabled={loading} >
                        {loading ? <ClipLoader size={30} color='white' /> : "Reset Password"}
                    </button>
                </form>
                <div className='text-sm text-center mt-4 cursor-pointer' onClick={() => navigate("/login")}>Back to Login</div>

            </div>}

        </div>
    )
}

export default ForgetPassword