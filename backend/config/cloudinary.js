import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

const removeLocalFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    } catch (e) {
        console.log("Could not delete temp file:", e)
    }
}

const uploadOnCloudinary = async (filePath) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })

    if (!filePath) return null

    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, { resource_type: 'auto' })
        return uploadResult.secure_url
    } catch (error) {
        console.log("Cloudinary upload failed:", error)
        throw error                      // let the controller return a real error
    } finally {
        removeLocalFile(filePath)        // runs on success and failure
    }
}

export default uploadOnCloudinary