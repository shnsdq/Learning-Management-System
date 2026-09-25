import React, { useState } from 'react'
import logo from '../assets/logo.jpg'
import google from '../assets/google.jpg'
import { IoEyeOutline } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/firebase';

const Signup = () => {
  const [show,setShow] = useState(false)
  const navigate = useNavigate()
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [role,setRole] = useState("student") // Default role is student
  const [loading, setLoading] = useState(false); // State to track loading status
  const dispatch = useDispatch()

  const handleSignup = async () => {
    setLoading(true); // Set loading to true when signup is initiated
    try {
      const result = await axios.post(serverUrl + "/api/auth/signup", {
        name,
        email,
        password,
        role
      },{withCredentials:true});

      dispatch(setUserData(result.data)); // Update Redux store with user data
      setLoading(false)
      navigate('/')
      toast.success("Signup successful.");
      
    } catch (error) {
      toast.error(response.data.message);
    }
  }

  const googleSignUp = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      let user = response.user;
      let name = user.displayName
      let email = user.email
      const result = await axios.post(serverUrl + "/api/auth/googleauth", {
        name,email,role}, { withCredentials: true });

      dispatch(setUserData(result.data)); // Update Redux store with user data
      navigate('/')
      toast.success("Signup successful.");

  }catch (error) {
toast.error(response.data.message);
  }
}

  return (
    <div className='bg-[#dddbdb] w-screen h-[100vh] flex justify-center items-center'>
      <form className='w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex ' onSubmit={(e)=>e.preventDefault()}  >
        {/* left div */}
        <div className='md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3 '>
         <div>

          <h1 className='text-2xl font-semibold text-[black] '>Let's get started</h1>
          <h2 className='text-[#999797] text-[18px] '>Create your account</h2>
         </div>

         <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
          <label htmlFor="name" className='font-semibold'>Name</label>
          <input id='name' type="text" placeholder='Name' className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]' onChange={(e) => setName(e.target.value)} value={name} />
         </div>

         <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
          <label htmlFor="email" className='font-semibold'>Email</label>
          <input id='email' type="text" placeholder='Your Email' className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]' onChange={(e) => setEmail(e.target.value)} value={email} />
         </div>

         <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative'>
          <label htmlFor="password" className='font-semibold'>Password</label>
          <input id='password' type={show ? "text" : "password"} placeholder='Password' className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]' onChange={(e) => setPassword(e.target.value)} value={password} />
          {!show ?  
          <IoEyeOutline onClick={() => setShow(prev => !prev)} className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]'/>
          : <IoEye onClick={() => setShow(prev => !prev)} className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]' /> }
         </div>

         <div className='flex md:w-[50%] w-[70%] items-center justify-between'>
          <span className={`px-[10px] py-[5px] border-[2px] border-[#e7e6e6] rounded-xl cursor-pointer hover:border-black ${role === "student" ? "border-black" : "border-[#646464]"}`} onClick={() => setRole("student")}>Student</span>

          <span className={`px-[10px] py-[5px] border-[2px] border-[#e7e6e6] rounded-xl cursor-pointer hover:border-black ${role === "educator" ? "border-black" : "border-[#646464]"}`} onClick={() => setRole("educator")}>Educator</span>
         </div>

         <button className='w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px]' onClick={handleSignup} disabled={loading}>{loading ? <ClipLoader size={30} color='white'/>  :"SignUp"}</button>
         <div className='w-[80%] flex gap-2 items-center justify-center'>
          <div className='w-[25%] h-[0.5px] bg-[#c4c4c4] '></div>
          <div className='w-[50%] text-[15px] text-[#6f6f6f] flex items-center justify-center '>or continue</div>
          <div className='w-[25%] h-[0.5px] bg-[#c4c4c4] '></div>
         </div>

          <div className='w-[80%] h-[40px] border-1 border-[black] cursor-pointer flex items-center justify-center rounded-[5px] ' onClick={googleSignUp}>
            <img src={google} className='w-[25px] ' alt="Google" />
            <span className='text-[18px] text-gray-500 '>oogle</span>
          </div>

          <div className='text-[#6f6f6f] '>already have an account
          <span onClick={() => navigate('/login')} className='underline underline-offset-1 text-[black] '>Login</span>
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

export default Signup