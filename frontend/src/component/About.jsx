import React from 'react'
import about from '../assets/about.jpg'
//import video from '../assets/video.mp4'

const About = () => {
  return (
    <div className='w-[100vw] lg:h-[70vh] min-h-[50vh] flex flex-wrap items-center  justify-center gap-2 mb-[30px] '>
     {/* for image */}
     <div className='lg:w-[40%] md:w-[80%] w-[100%] h-[100%] flex items-center justify-center relative '>
        <img src={about} alt=""  className='w-[80%] h-[90%] rounded-lg '/>
        {/* <div className='max-w-[350px] mx-auto p-4 absolute top-[55%] left-[50%] '>

        <video src={video} className='w-full rounded-xl shadow-lg border-2 border-white' controls autoPlay loop />
        </div> */}

     </div>


     {/* for about */}
     <div className='lg:w-[50%] md:w-[70%] w-[100%] h-[100%] flex items-start justify-center flex-col px-[35px] md:px-[80px] '></div>

    </div>

  )
}

export default About