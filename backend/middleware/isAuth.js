import jwt from "jsonwebtoken"

const isAuth = async (req,res,next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({message:"Access denied"})
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({message:"Invalid token"})
        }
        req.userId = decoded.userId
        next()
        
    } catch (error) {
        return res.status(500).json({message:`Authentication error ${error}`})
    }
}

export default isAuth