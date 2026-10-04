import React, { useState } from 'react'
import Nav from '../component/Nav'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import ai from '../assets/SearchAi.png'
import { useSelector } from 'react-redux'

const AllCourses = () => {
    const navigate = useNavigate()
    const {courseData} = useSelector(state=>state.course)
const [category,setCategory] = useState([])
const [filterCourses,setFilterCourses] = useState([])

const toggleCategory = (e)=>{
    if(category.includes(e.target.value)){

    }
}


  return (
    <div className='flex min-h-screen bg-gray-50'>
    <Nav/>

    {/* sidebar */}

    <aside className='w-[260px] h-screen overflow-y-auto bg-black fixed top-0 left-0 p-6 py-[130px] border-r border-gray-200 shadow-md transition-transform durration-300 z-5 '>
        <h2 className='text-xl font-bold flex items-center justify-center gap-2 text-gray-50 mb-6'> <FaArrowLeftLong className='text-white' onClick={()=>navigate('/')}/>Filter by Category</h2>

        <form action=""  onSubmit={(e)=>e.preventDefault()} className='space-y-4 text-sm bg-gray-600 border-white text-[white] border p-[20px] rounded-2xl '>

            <button className='px-[10px] py-[10px] bg-black text-white rounded-[10px] text-[15px] font-light flex items-center justify-center gap-2 cursor-pointer '>Search with AI <img src={ai} alt="" className='w-[30px] h-[30px] rounded-full '/></button>

            <label htmlFor="" className='flex items-center gap-3 cursor-pointer hover:text-gray-200 transition'>
                <input type="checkbox"  className='accent-black w-4 h-4 rounded-md'/>App Development
            </label>
            <label htmlFor="" className='flex items-center gap-3 cursor-pointer hover:text-gray-200 transition'>
                <input type="checkbox"  className='accent-black w-4 h-4 rounded-md'/>AI/ML
            </label>
            <label htmlFor="" className='flex items-center gap-3 cursor-pointer hover:text-gray-200 transition'>
                <input type="checkbox"  className='accent-black w-4 h-4 rounded-md'/>AI Tools
            </label>
            <label htmlFor="" className='flex items-center gap-3 cursor-pointer hover:text-gray-200 transition'>
                <input type="checkbox"  className='accent-black w-4 h-4 rounded-md'/>Data Science
            </label>
            <label htmlFor="" className='flex items-center gap-3 cursor-pointer hover:text-gray-200 transition'>
                <input type="checkbox"  className='accent-black w-4 h-4 rounded-md'/>Data Analytics
            </label>
            <label htmlFor="" className='flex items-center gap-3 cursor-pointer hover:text-gray-200 transition'>
                <input type="checkbox"  className='accent-black w-4 h-4 rounded-md'/>Ethical Hacking
            </label>
            <label htmlFor="" className='flex items-center gap-3 cursor-pointer hover:text-gray-200 transition'>
                <input type="checkbox"  className='accent-black w-4 h-4 rounded-md'/>Ui Ux Designing
            </label>
            <label htmlFor="" className='flex items-center gap-3 cursor-pointer hover:text-gray-200 transition'>
                <input type="checkbox"  className='accent-black w-4 h-4 rounded-md'/>Web Development
            </label>
            <label htmlFor="" className='flex items-center gap-3 cursor-pointer hover:text-gray-200 transition'>
                <input type="checkbox"  className='accent-black w-4 h-4 rounded-md'/>Others
            </label>

        </form>

    </aside>

    <main className='w-full transition-all duration-300 py-[130px] md:pl-[300px] flex items-start justify-center md:justify-start flex-wrap gap-6 px-[10px] '>
     
    </main>
    </div>
  )
}

export default AllCourses