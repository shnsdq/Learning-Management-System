import React, { useState } from 'react'
import logo from '../assets/logo.jpg'
import google from '../assets/google.jpg'
import { IoEyeOutline } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';


const Login = () => {

  const [show,setShow] = useState(false)
  const navigate = useNavigate()

   return (
     <div className='bg-[#dddbdb] w-screen h-[100vh] flex justify-center items-center'>
       <form className='w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex ' >
         {/* left div */}
         <div className='md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3 '>
          <div>
 
           <h1 className='text-2xl font-semibold text-[black] '>Welcome back</h1>
           <h2 className='text-[#999797] text-[18px] '>Login to your account</h2>
          </div>
 
          <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
           <label htmlFor="email" className='font-semibold'>Email</label>
           <input id='email' type="text" placeholder='Your Email' className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px] '/>
          </div>
 
          <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative'>
           <label htmlFor="password" className='font-semibold'>Password</label>
           <input id='password' type={show ? "text" : "password"} placeholder='Password' className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px] '/>
           {!show ?  
           <IoEyeOutline onClick={() => setShow(prev => !prev)} className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]'/>
           : <IoEye onClick={() => setShow(prev => !prev)} className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]' /> }
          </div>
 
 
          <button className='w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px] '>Login</button>

          <span className=''>Forget Passsword ?</span>

          <div className='w-[80%] flex gap-2 items-center justify-center'>
           <div className='w-[25%] h-[0.5px] bg-[#c4c4c4] '></div>
           <div className='w-[50%] text-[15px] text-[#6f6f6f] flex items-center justify-center '>or continue</div>
           <div className='w-[25%] h-[0.5px] bg-[#c4c4c4] '></div>
          </div>
 
           <div className='w-[80%] h-[40px] border-1 border-[black] cursor-pointer flex items-center justify-center rounded-[5px] '>
             <img src={google} className='w-[25px] ' alt="Google" />
             <span className='text-[18px] text-gray-500 '>oogle</span>
           </div>
            <div className='text-[#6f6f6f] '>Create account
          <span onClick={() => navigate('/signup')} className='underline underline-offset-1 text-[black] '>Signup</span>
          </div>
 
         </div>
         {/* right div */}
         <div className='w-[50%] h-[100%] rounded-r-2xl bg-[black] md:flex flex-col items-center justify-center hidden'>
        <img src={logo} alt="Logo" className='w-30 shadow-2xl'/>
        <span className='text-white text-2xl'>VIRTUAL COURSES</span>
         </div>
       </form>
 
     </div>
   )
 }
export default Login