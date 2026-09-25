import React, { useState } from 'react'
import logo from '../assets/logo.jpg'
import google from '../assets/google.jpg'
import { IoEyeOutline } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/firebase';


const Login = () => {

  const [show, setShow] = useState(false)
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogin = async () => {
    setLoading(true); // Set loading to true when signup is initiated
    try {
      const result = await axios.post(serverUrl + "/api/auth/login", { email, password }, { withCredentials: true });

       dispatch(setUserData(result.data));
      setLoading(false)
      toast.success("Login successful.");
      navigate('/')

    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  const googleLogin = async () => {
      try {
        const response = await signInWithPopup(auth, provider);
        let user = response.user;
        let name = user.displayName
        let email = user.email
        let role = ""
        const result = await axios.post(serverUrl + "/api/auth/googleauth", {
          name,email,role}, { withCredentials: true });
  
        dispatch(setUserData(result.data)); // Update Redux store with user data
        navigate('/')
        toast.success("Login successful.");
  
    }catch (error) {
  toast.error(response.data.message);
    }
  }

  return (
    <div className='bg-[#dddbdb] w-screen h-[100vh] flex justify-center items-center'>
      <form className='w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex' onSubmit={(e) => { e.preventDefault() }}  >
        {/* left div */}
        <div className='md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3 '>
          <div>

            <h1 className='text-2xl font-semibold text-[black] '>Welcome back</h1>
            <h2 className='text-[#999797] text-[18px] '>Login to your account</h2>
          </div>

          <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
            <label htmlFor="email" className='font-semibold'>Email</label>
            <input id='email' type="text" placeholder='Your Email' className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]' onChange={(e) => setEmail(e.target.value)} value={email}  />
          </div>

          <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative'>
            <label htmlFor="password" className='font-semibold'>Password</label>
            <input id='password' type={ show ? "text" : "password"} placeholder='Password' className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]' onChange={(e) => setPassword(e.target.value)} value={password} />
           { !show  
           ? (<IoEyeOutline onClick={() => setShow(prev => !prev)} className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]' />)
            :( <IoEye onClick={() => setShow(prev => !prev)} className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]' /> )
              }
          </div>


          <button className='w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px] cursor-pointer' onClick={handleLogin} disabled={loading}>
            {loading ? <ClipLoader size={30} color='white' /> : "Login"}
          </button>

          <span className='text-[13px] cursor-pointer text-[#585757] ' onClick={()=>navigate('/forget')}>Forget your Passsword ?</span>

          <div className='w-[80%] flex gap-2 items-center justify-center'>
            <div className='w-[25%] h-[0.5px] bg-[#c4c4c4] '></div>
            <div className='w-[50%] text-[15px] text-[#6f6f6f] flex items-center justify-center '>or continue</div>
            <div className='w-[25%] h-[0.5px] bg-[#c4c4c4] '></div>
          </div>

          <div className='w-[80%] h-[40px] border-1 border-[black] cursor-pointer flex items-center justify-center rounded-[5px] ' onClick={googleLogin} >
            <img src={google} className='w-[25px] ' alt="Google" />
            <span className='text-[18px] text-gray-500 '>oogle</span>
          </div>
          <div className='text-[#6f6f6f] '>Create account
            <span onClick={() => navigate('/signup')} className='underline underline-offset-1 text-[black] '>Signup</span>
          </div>

        </div>
        {/* right div */}
        <div className='w-[50%] h-[100%] rounded-r-2xl bg-[black] md:flex flex-col items-center justify-center hidden'>
          <img src={logo} alt="Logo" className='w-30 shadow-2xl' />
          <span className='text-white text-2xl'>VIRTUAL COURSES</span>
        </div>
      </form>

    </div>
  )
}
export default Login