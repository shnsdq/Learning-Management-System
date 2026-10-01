import React from 'react'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import img from "../../assets/empty.jpg"
import { FaEdit } from "react-icons/fa";
import { useSelector } from 'react-redux';

const Courses = () => {
  const navigate = useNavigate()
  const { creatorCourseData } = useSelector(state => state.course)

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <div className='w-[100%] min-h-screen p-4 sm:p-6 bg-gray-100 '>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:utems-center mb-6 gap-3'>

          <div className='flex items-center justify-center gap-3'>
            <FaArrowLeftLong className='w-[22px] h-[22px] cursor-pointer' onClick={() => navigate('/dashboard')} />
            <h1 className='text-2xl font-semibold'>Courses</h1>
          </div>

          <button className='px-4 py-2 bg-black text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500' onClick={() => navigate('/createcourse')}>
            Create Course
          </button>
        </div>

        {/* for large screen table*/}
        <div className='hidden md:block bg-white rounded-xl shadow p-4 overflow-x-auto'>
          <table className='min-w-full text-sm'>
            <thead className='border-b bg-gray-50'>
              <tr>
                <th className='text-left py-3 px-4'>Courses</th>
                <th className='text-left py-3 px-4'>Price</th>
                <th className='text-left py-3 px-4'>Status</th>
                <th className='text-left py-3 px-4'>Action</th>
              </tr>
            </thead>

            <tbody>

              {creatorCourseData?.map((course, index) => (


                <tr key={index} className='border-b hover:bg-gray-5 transition-duration-200'>
                  <td className='py-3 px-4 flex items-center gap-4'>
                    {course?.thumbnail ? <img src={course?.thumbnail} alt="" className='w-25 h-14 object-cover rounded-md' /> : <img src={img} alt="" className='w-25 h-14 object-cover rounded-md' />}<span>{course?.title}</span>
                  </td>

                 {course?.price ?  <td className='px-4 py-3'>{course?.price} </td>
                  : <td className='px-4 py-3'>₹ NA</td>}

                  <td className='px-4 py-3'><span className={`px-3 py-1 rounded-full text-xs ${course.isPublished ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"} `}>{course.isPublished ? "Published":"Draft"}</span> </td>
                  <td className='px-4 py-3'>
                    <FaEdit className='text-gray-600 hover:text-blue-600 cursor-pointer' />
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
          <p className='text-center text-sm text-gray-400 mt-6'>A list of your recent courses</p>

        </div>


        {/* for small screen table */}
        <div className='md:hidden space-y-4'>
          <div className='bg-white rounded-lg shadow p-4 flex flex-col gap-3'>
            <div className='flex ga-4 items-center'>
              <img src={img} alt="" className='w-16 rounded-md object-cover' />
              <div className='flex-1'>
                <h2 className='font-medium text-sm'>title</h2>
                <p className='text-gray-600 text-xs mt-1'>₹ NA</p>
              </div>
              <FaEdit className='text-gray-600 hover:text-blue-600 cursor-pointer' />
            </div>
            <span className='w-fit px-3 py-2 text-xs rounded-full bg-red-100 text-red-600'>Draft</span>
          </div>
          <p className='text-center text-sm text-gray-400 mt-4 '>A list of your recent courses</p>
        </div>
      </div>
    </div>
  )
}

export default Courses