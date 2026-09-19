import React from 'react'
import logo from '../assets/logo.jpg'

const Signup = () => {
  return (
    <div className='bg-[#dddbdb] w-[100vw] h-[100vh] flex justify-center items-center'>
      <form className='w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex ' >
        {/* left div */}
        <div className='md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3 '>
         <div>

          <h1 className='text-2xl font-semibold text-[black] '>let's get started</h1>
          <h2 className='text-[#999797] text-[18px] '>Create your account</h2>
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