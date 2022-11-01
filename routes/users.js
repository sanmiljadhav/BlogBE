import express from "express"
const router = express.Router()

import {addPost} from '../controllers/post.js'

router.get('/test',addPost)


export default router