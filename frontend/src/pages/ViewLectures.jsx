import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { FaPlayCircle } from "react-icons/fa";

const ViewLectures = () => {
    const { courseId } = useParams()
    const [creatorData, setCreatorData] = useState(null)
    const [course, setCourse] = useState(null)
    const [selectedLecture, setSelectedLecture] = useState(course?.lectures?.[0] || null)
    const navigate = useNavigate()

    useEffect(() => {
        const load = async () => {
            try {
                const res = await axios.get(serverUrl + `/api/course/createlecture/${courseId}`, { withCredentials: true })
                setCourse(res.data)
            } catch (error) {
                navigate(`/viewcourse/${courseId}`, { replace: true })   // 403 or not found
            }
        }
        load()
    }, [courseId])

    //Keep the video player and selected lecture updated when fresh data arrives
    useEffect(() => {
        if (course?.lectures?.length > 0) {
            // Set the first lecture if nothing is selected yet, or keep the currently selected one
            if (!selectedLecture) {
                setSelectedLecture(course.lectures[0])
            } else {
                // If a new lecture was added, make sure it syncs up in the state
                const currentStillExists = course.lectures.find(l => l._id === selectedLecture._id)
                if (!currentStillExists) {
                    setSelectedLecture(course.lectures[0])
                }
            }
        }
    }, [course, selectedLecture])

    useEffect(() => {

        const handleCreator = async () => {
            if (course?.creator) {
                try {
                    const result = await axios.post(serverUrl + "/api/course/creator", { userId: course.creator }, { withCredentials: true })

                    setCreatorData(result.data)
                } catch (error) {

                }
            }
        }

        handleCreator()
    }, [course])

    if ( !course ) return null

    return (
        <div className='min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6'>

            {/* left or top */}
            <div className='w-full md:w-2/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200 '>
                <div className='mb-6'>

                    <h2 className='text-2xl font-bold flex items-center justify-start gap-[20px] text-gray-800 '><FaArrowLeftLong className='text-black w-[22px] h-[22px] cursor-pointer ' onClick={() => navigate(`/viewcourse/${courseId}`)} />{course?.title} </h2>

                    <div className='mt-2 flex gap-4 text-sm text-gray-500 font-medium'>
                        <span>Category : {course?.category} </span>
                        <span>Level : {course?.level}</span>
                    </div>

                </div>

                {/* video player */}
                <div className='aspect-video bg-black rounded-xl overflow-hidden mb-4 border border-gray-300'>
                    {selectedLecture?.videoUrl
                        ? <video className='w-full h-full object-cover' src={selectedLecture?.videoUrl} controls />
                        : <div className='flex items-center justify-center h-full text-white'>Select a lecture to start watching</div>}

                </div>

                <div className='mt-2'>
                    <h2 className='text-xl font-semibold text-gray-800'>{selectedLecture?.lectureTitle} </h2>
                </div>
            </div>

            {/* right side */}
            <div className='w-full md:w-1/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200 h-fit'>
                <h2 className='text-xl font-bold mb-4 text-gray-800'>All Lectures</h2>
                <div className='flex flex-col gap-3 mb-6'>
                    {course?.lectures?.length > 0

                        ? (course?.lectures?.map((lecture, index) => (

                            <button key={index} className={`flex items-center justify-between p-3 rounded-lg border transition text-left ${selectedLecture?._id === lecture._id ? 'bg-gray-200 border-gray-500' : 'hover:bg-gray-50 border-gray-300'}`} onClick={() => setSelectedLecture(lecture)} ><h2 className='text-sm font-semibold text-gray-800'> {lecture.lectureTitle}</h2> <FaPlayCircle className='text-lg text-black' />
                            </button>
                        )))
                        : (<p>No lectures available</p>)}
                </div>

                {/* educator info */}
                {creatorData &&
                    <div className='mt-4 border-t pt-4'>
                        <h3 className='text-md font-semibold text-gray-700 mb-3'>Educator</h3>
                        <div className='flex items-center gap-4 '><img src={creatorData?.photoUrl} alt="" className='w-14 h-14 rounded-full object-cover' /> </div>

                        <div>
                            <h2 className='text-base font-medium text-gray-800'>{creatorData?.name} </h2>
                            <p className='text-sm text-gray-600'>{creatorData?.description} </p>
                            <p className='text-sm text-gray-600'>{creatorData?.email} </p>

                        </div>
                    </div>}

            </div>

        </div>
    )
}

export default ViewLectures