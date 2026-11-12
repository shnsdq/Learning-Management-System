import razorpay from 'razorpay'
import crypto from 'crypto'
import dotenv from 'dotenv'
import Course from '../models/courseModel.js'
import User from '../models/userModel.js'
dotenv.config()

const RazorPayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

export const RazorpayOrder = async (req, res) => {
    try {
        const { courseId } = req.body
        const userId = req.userId

        const course = await Course.findById(courseId)
        if (!course || !course.isPublished) {
            return res.status(404).json({ message: "Course not found" })
        }
        if (!course.price || course.price < 1) {
            return res.status(400).json({ message: "This course has no valid price" })
        }
        if (course.enrolledStudents.some(id => String(id) === String(userId))) {
            return res.status(400).json({ message: "You are already enrolled in this course" })
        }

        const order = await RazorPayInstance.orders.create({
            amount: Math.round(course.price * 100),          // paise, must be an integer
            currency: 'INR',
            receipt: `c_${String(courseId).slice(-10)}_${Date.now()}`,
            notes: { courseId: String(courseId), userId: String(userId) }
        })
        return res.status(200).json(order)
    } catch (error) {
        return res.status(500).json({ message: `Failed to create Razorpay Order ${error}` })
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
        const userId = req.userId

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: "Missing payment details" })
        }

        // check the signature
        const expected = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex')
        const given = String(razorpay_signature)
        const validSignature =
            expected.length === given.length &&
            crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(given))
        if (!validSignature) {
            return res.status(400).json({ message: "Invalid payment signature" })
        }

        // check the order is paid and belongs to this user
        const orderInfo = await RazorPayInstance.orders.fetch(razorpay_order_id)
        if (orderInfo.status !== 'paid') {
            return res.status(400).json({ message: "Payment failed" })
        }
        if (orderInfo.notes?.userId !== String(userId)) {
            return res.status(403).json({ message: "This payment belongs to another user" })
        }
        const courseId = orderInfo.notes?.courseId
        if (!courseId) {
            return res.status(400).json({ message: "Order is not linked to a course" })
        }

        // enroll, atomically and without duplicates
        await User.updateOne({ _id: userId }, { $addToSet: { enrolledCourses: courseId } })
        await Course.updateOne({ _id: courseId }, { $addToSet: { enrolledStudents: userId } })

        return res.status(200).json({ message: "Payment verified and enrollment successful" })
    } catch (error) {
        return res.status(500).json({ message: `Internal server error during payment verification ${error}` })
    }
}