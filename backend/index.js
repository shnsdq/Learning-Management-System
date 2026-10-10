import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/connectDB.js'
import cookieParser from 'cookie-parser'
import authRouter from './routes/authRoute.js'
dotenv.config()
import cors from 'cors'
import userRouter from './routes/userRoute.js'
import courseRouter from './routes/courseRoute.js'
import paymentRouter from './routes/paymentRoute.js'

const port =process.env.PORT
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/course", courseRouter)
app.use("/api/order", paymentRouter)

app.get("/",(req,res)=>{
    res.send("Hello from server")
})

app.listen(port, ()=>{
    console.log(`Server started at ${port}`)
    connectDb()
})