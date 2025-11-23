// server/routes/projects.js
import express from 'express'
import * as C from '../controllers/projects.js'
import { verifyFirebaseToken } from '../middleware/authFirebase.js'

const router = express.Router()

router.get('/', C.listProjects)
router.get('/:id', C.getProject)

// create (no auth in dev mode)
router.post('/', C.createProject)

// protected routes
router.put('/:id', verifyFirebaseToken, C.updateProject)
router.delete('/:id', C.deleteProject)
router.post('/:id/favorite', verifyFirebaseToken, C.toggleFavorite)
router.post('/:id/rate', verifyFirebaseToken, C.rateProject)

export default router
