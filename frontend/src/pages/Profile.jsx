import React from 'react'
import { useSelector } from 'react-redux'

const Profile = () => {
  const { userData } = useSelector(state => state.user)
  return (
    <div className='min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center'>
      <div className='bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full relative'>
        <div className='flex flex-col items-center text-center'>
          {userData?.photoUrl ? <img src={userData?.photoUrl} className='w-24 h-24 rounded-full object-cover border-4 border-[black]' alt="" /> :
            <div className='w-24 h-24 rounded-full text-white flex items-center justify-center text-[30px] border-2 bg-[black] border-white'>

            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Profile