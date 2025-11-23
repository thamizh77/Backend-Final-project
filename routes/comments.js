import express from 'express'
import * as C from '../controllers/comments.js'
import { verifyFirebaseToken } from '../middleware/authFirebase.js'


const router = express.Router()


router.post('/', verifyFirebaseToken, C.createComment)
router.get('/project/:projectId', C.getCommentsForProject)


export default router