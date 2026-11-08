import uploadOnCloudinary from "../config/cloudinary.js"
import Course from "../models/courseModel.js"
import Lecture from "../models/lectureModel.js"
import Review from "../models/reviewModel.js"
import User from "../models/userModel.js"


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
        const courses = await Course.find({ isPublished: true }).populate("lectures reviews")
        if (!courses) {
            return res.status(404).json({ message: "Courses is not found" })
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

        let course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" }) // Changed to 404
        }

        if (String(course.creator) !== String(req.userId)) {
            return res.status(403).json({ message: "Not allowed" })
        }

        // Ensure thumbnail is only updated if a new file is uploaded
        let thumbnail = course.thumbnail
        if (req.file) {
            thumbnail = await uploadOnCloudinary(req.file.path)
        }

        // Explicitly parse "isPublished" string into a real Boolean
        const parsedIsPublished = isPublished === "true" || isPublished === true;

        const updateData = {
            title,
            subTitle,
            description,
            category,
            level,
            isPublished: parsedIsPublished,
            price,
            thumbnail
        }

        const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, { new: true })

        return res.status(200).json({
            course: updatedCourse,
            message: "Course updated successfully"
        })
    } catch (error) {
        return res.status(500).json({ message: `Failed to edit Course: ${error.message}` })
    }
}


export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params
        let course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course is not found" })
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
        if (String(course.creator) !== String(req.userId)) {
            return res.status(403).json({ message: "Not allowed" })
        }

        if (course.enrolledStudents?.length > 0) {
            return res.status(409).json({
                message: "This course has enrolled students and can't be deleted. Unpublish it instead."
            })
        }

        await Lecture.deleteMany({ _id: { $in: course.lectures } })
        await Review.deleteMany({ course: courseId })
        await Course.findByIdAndDelete(courseId)

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
            return res.status(400).json({ message: "LectureTitle or courseId is required" })
        }

        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }

        if (String(course.creator) !== String(req.userId)) {
            return res.status(403).json({ message: "You can't add lectures to this course" })
        }

        const lecture = await Lecture.create({ lectureTitle })
        course.lectures.push(lecture._id)
        await course.save()

        return res.status(201).json({ lecture })
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

        const isCreator = String(course.creator) === String(req.userId)
        const isEnrolled = course.enrolledStudents?.some(id => String(id) === String(req.userId))
        if (!isCreator && !isEnrolled) {
            return res.status(403).json({ message: "Not allowed" })
        }

        await course.populate("lectures")
        return res.status(200).json(course)

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
            return res.status(404).json({ message: "Lecture is not found" })
        }

        //Ownership checks
        const course = await Course.findOne({ lectures: lectureId })
        if (!course || String(course.creator) !== String(req.userId)) {
            return res.status(403).json({ message: "Not allowed" })
        }

        let videoUrl
        if (req.file) {
            videoUrl = await uploadOnCloudinary(req.file.path)
            lecture.videoUrl = videoUrl
        }

        if (lectureTitle) {
            lecture.lectureTitle = lectureTitle
        }

        lecture.isPreviewFree = isPreviewFree === "true" || isPreviewFree === true
        await lecture.save()
        return res.status(200).json(lecture)

    } catch (error) {
        return res.status(500).json({ message: `Failed to edit Lecture ${error}` })
    }
}

export const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params

        const course = await Course.findOne({ lectures: lectureId })
        if (!course) {
            return res.status(404).json({ message: "Lecture is not found" })
        }
        if (String(course.creator) !== String(req.userId)) {
            return res.status(403).json({ message: "Not allowed" })
        }

        await Lecture.findByIdAndDelete(lectureId)
        await Course.updateOne({ _id: course._id }, { $pull: { lectures: lectureId } })

        return res.status(200).json({ message: "Lecture removed" })
    } catch (error) {
        return res.status(500).json({ message: `Failed to remove Lecture ${error}` })
    }
}

//get creator

export const getCreatorById = async (req, res) => {
    try {
        const { userId } = req.body

        const user = await User.findById(userId).select("name description photoUrl email role")

        if (!user) {
            return res.status(404).json({ message: "User is not found" })
        }

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `Failed to get Creator ${error}` })
    }
}