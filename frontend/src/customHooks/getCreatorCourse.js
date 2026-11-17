import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setCreatorCourseData } from '../redux/courseSlice'
import { toast } from 'react-toastify'

const getCreatorCourse = () => {
    const dispatch = useDispatch()
    const {userData} = useSelector(state=>state.user)

  return (
    useEffect(() => {
        if (userData?.role !== "educator") return
        const creatorCourses = async () => {
            try {
                const result = await axios.get(serverUrl + '/api/course/getcreator', {withCredentials:true} )
                 dispatch(setCreatorCourseData(result.data))

            } catch (error) {
                toast.error(error?.response?.data?.message || "Failed to load courses")   
            }
        }
        creatorCourses()
    },[userData])
  )
}

export default getCreatorCourse