import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../../App'
import { setLectureData } from '../../redux/lectureSlice'
import { toast } from 'react-toastify'
import { FaEdit } from "react-icons/fa";

const CreateLecture = () => {
    const {courseId} = useParams()
    const navigate = useNavigate()
    const [lectureTitle,setLectureTitle] = useState("")
    const [loading,setLoading] = useState(false)
    const dispatch = useDispatch()
    const {lectureData} = useSelector(state=>state.lecture)

    const handleCreatelecture = async () => {
        setLoading(true)
        try {
            const result  = await axios.post(serverUrl + `/api/course/createlecture/${courseId}`,{lectureTitle},{withCredentials:true})
            setLoading(false)
            dispatch(setLectureData([...lectureData, result.data.lecture]))
            toast.success("Lecture Added")
            setLectureTitle("")
        } catch (error) {
            setLoading(false)
            toast.error(error.response.data.message)
        }
    }

    useEffect(()=>{
      const getCourseLecture = async () => {
        try {
            const result = await axios.get(serverUrl + `/api/course/courselecture/${courseId}`, {withCredentials:true})
            dispatch(setLectureData(result.data.lectures))
        } catch (error) {
            
        }
      }
      getCourseLecture()
    },[])

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
    <div className='bg-white shadow-xl rounded-xl w-full max-w-2xl p-6'>
        {/* header */}
        <div className='mb-6'>
            <h1 className='text-2xl font-semibold text-gray-800 mb-1'>
                Let's Add a Lecture
            </h1>
            <p className='text-sm text-gray-500'>Enter the title and add your video lectures to enhance your course content.</p>
        </div>

        {/* input Area */}
        <input type="text" className='w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black mb-4' placeholder='e.g. Intriduction to MERN Stack' onChange={(e)=>setLectureTitle(e.target.value)} value={lectureTitle}/>

        {/* Button */}
        <div className='flex gap-4 mb-6'>
         <button className='flex items-center gap-2 px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-sm font-medium' onClick={()=>navigate(`/editcourse/${courseId}`)}><FaArrowLeftLong/> Back to Course</button>
         <button className='px-5 py-2 rounded-md bg-[black] text-white hover:bg-gray-600 transition-all text-sm font-medium shadow ' onClick={handleCreatelecture}>{loading ? <ClipLoader size={30} disabled={loading} />:"+ Create Lecture"}</button>
        </div>
        {/* Lecture list */}
        <div className='space-y-2'>
         {
            lectureData?.map((lecture,index)=>(
             <div key={index} className='bg-gray-100 rounded-md flex justify-between items-center p-3 text-sm font-medium text-gray-700'>
                <span>Lecture - {index + 1} : {lecture.lectureTitle} </span>
                <FaEdit className='' />

             </div>
            ))
         }
        </div>
    </div>
    </div>
  )
}

export default CreateLecture