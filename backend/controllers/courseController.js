import uploadOnCloudinary from "../config/cloudinary.js"
import Course from "../models/courseModel.js"
import Lecture from "../models/lectureModel.js"


export const createCourse = async (req, res) => {
    try {
        const { title, category } = req.body
        if (!title || !category) {
            return res.status(400).json({ message: "Title or Category is required" })
        }

        const course = await Course.create({
            title,
            category,
            creator: req.userId
        })

        return res.status(201).json(course)
    } catch (error) {
        return res.status(500).json({ message: `CreateCourse error ${error}` })
    }
}

export const getPublishedCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true })
        if (!courses) {
            return res.status(400).json({ message: "Courses is not found" })
        }

        return res.status(200).json(courses)
    } catch (error) {
        return res.status(500).json({ message: `Failed to get isPublished courses ${error}` })
    }
}

export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.userId
        const courses = await Course.find({ creator: userId })
        if (!courses) {
            return res.status(400).json({ message: "Courses are not found" })
        }

        return res.status(200).json(courses)
    } catch (error) {
        return res.status(500).json({ message: `Failed to get Creator Courses ${error}` })
    }
}

export const editCourse = async (req, res) => {
    try {
        const { courseId } = req.params
        const { title, subTitle, description, category, level, isPublished, price } = req.body
        let thumbnail
        if (req.file) {
            thumbnail = await uploadOnCloudinary(req.file.path)
        }
        let course = await Course.findById(courseId)
        if (!course) {
            return res.status(400).json({ message: "Course is not found" })
        }
        const updateData = { title, subTitle, description, category, level, isPublished, price, thumbnail }
        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true })

        return res.status(200).json(course)
    } catch (error) {
        return res.status(500).json({ message: `Failed to edit Course ${error}` })
    }
}

export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params
        let course = await Course.findById(courseId)
        if (!course) {
            return res.status(400).json({ message: "Course is not found" })
        }
        return res.status(200).json(course)

    } catch (error) {
        return res.status(500).json({ message: `Failed to get Course by Id ${error}` })
    }
}

export const removeCourse = async (req, res) => {
    try {
        const { courseId } = req.params
        let course = await Course.findById(courseId)
        if (!course) {
            return res.status(400).json({ message: "Course is not found" })
        }
        course = await Course.findByIdAndDelete(courseId, { new: true })

        return res.status(200).json({ message: "Course removed" })

    } catch (error) {
        return res.status(500).json({ message: `Failed to delete Course by Id ${error}` })
    }
}

//for Lecture

export const createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body
        const { courseId } = req.params
        if (!lectureTitle || !courseId) {
            return res.status(400).json({ message: "LectureTilte or courseId is required" })
        }

        const lecture = await Lecture.create({ lectureTitle })
        const course = await Course.findById(courseId)
        if (course) {
            course.lectures.push(lecture._id)
        }
        await course.populate("lectures")
        await course.save()
        return res.status(201).json({ lecture, course })

    } catch (error) {
        return res.status(500).json({ message: `Failed to create Lecture ${error}` })
    }
}

export const getCourseLecture = async (req, res) => {
    try {
        const { courseId } = req.params
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course is not found" })
        }

        await course.populate("lectures")
        await course.save()
        return res.status(201).json(course)

    } catch (error) {
        return res.status(500).json({ message: `Failed to get Course Lecture ${error}` })
    }
}

export const editLecture = async (req, res) => {
    try {
        const { lectureId } = req.params
        const { isPreviewFree, lectureTitle } = req.body
        const lecture = await Lecture.findById(lectureId)
        if (!lecture) {
            return res.status(400).json({ message: "Lecture is not found" })
        }

        let videoUrl
        if (req.file) {
            videoUrl = await uploadOnCloudinary(req.file.path)
            lecture.videoUrl = videoUrl
        }

        if (lectureTitle) {
            lecture.lectureTitle = lectureTitle
        }

        lecture.isPreviewFree = isPreviewFree

        await lecture.save()
        return res.status(200).json(lecture)

    } catch (error) {
        return res.status(500).json({ message: `Failed to edit Lecture ${error}` })
    }
}

export const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params
        const lecture = await Lecture.findByIdAndDelete(lectureId)
        if (lecture) {
            return res.status(404).json({ message: "Lecture is not found" })
        }
        await Course.updateOne({ lectures: lectureId }, { $pull: { lectures: lectureId } })

        return res.status(200).json({ message: "Lecture removed" })
    } catch (error) {
        return res.status(500).json({ message: `Failed to remove Lecture ${error}` })
    }
} 