import React from 'react'
import logo from '../assets/logo.jpg'
import { IoPersonCircle } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUserData } from '../redux/userSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import { serverUrl } from '../App';

const Nav = () => {
  const { userData } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {
      const response = await axios.get(serverUrl + '/api/auth/logout', { withCredentials: true });
      dispatch(setUserData(null))
      toast.success(response.data.message);
      
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  return (
    <div>
      <div className='w-[100%] h-[70px] fixed top-0 px-[20px] py-[10px] flex items-center justify-between bg-[#00000047] z-10 '>
        <div className='w-[40%] lg:w-[20%] lg:pl-[50px] '>
          <img src={logo} alt="" className='w-[60px] rounded-[5px] border-2 border-white ' />
        </div>

        <div className='w-[30%] lg:flex items-center justify-center gap-4'>
          {!userData && <IoPersonCircle className='w-[50px] h-[50px] fill-black cursor-pointer' />
          }
          
          {userData && <div className="w-[50px] h-[50px] rounded-full text-white flex items-center justify-center text-[20px] border-2 bg-black border-white cursor-pointer ">
            {userData?.name?.charAt(0).toUpperCase()}
           </div>}

          {userData?.role === "educator" && <div className='px-[20px] py-[10px] border-2 border-white text-white bg-[black] rounded-[10px] text-[18px] font-light cursor-pointer '>Dashboard</div>}

         

          {!userData
            ? <span className='px-[20px] py-[10px] border-2 border-white text-white bg-[#000000d5] rounded-[10px] text-[18px] font-light cursor-pointer' onClick={() => navigate('/login')}>Login</span>
            : <span className='px-[20px] py-[10px] border-2 border-white text-black bg-white rounded-[10px] shadow-sm shadow-black text-[18px] cursor-pointer' onClick={handleLogout} > LogOut </span>
          }
        </div>
      </div>
    </div>
  )
}

export default Nav