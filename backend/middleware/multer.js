import multer from "multer"
import fs from "fs"
import path from "path"

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Create an absolute path to the public folder
        const uploadDir = path.join(process.cwd(), "public")
        
        // Dynamically create the directory on Render if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }
        
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })
export default upload
