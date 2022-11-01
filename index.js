import express from "express"
import postRoutes from './routes/posts.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express()
app.use(express.json())

const corsOptions = {
    origin: true, //included origin as true
    credentials: true, //included credentials as true
};

app.use(cors(corsOptions))
app.use(cookieParser())

app.use("/api/auth",authRoutes)
app.use('/api/users',userRoutes)
app.use('/api/posts',postRoutes)

app.listen(8800,()=>{
    console.log("connected")
})