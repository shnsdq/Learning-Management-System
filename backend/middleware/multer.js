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
       const ext = path.extname(file.originalname)
       cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`) //for unique name
   }
})

   const upload = multer({
       storage,
       limits: { fileSize: 500 * 1024 * 1024 },   // 500 MB; adjust accord to Cloudinary plan
       fileFilter: (req, file, cb) => {
           if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
               cb(null, true)
           } else {
               cb(new Error('Only image and video files are allowed'))
           }
       }
   })

export default upload
