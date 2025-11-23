// server/routes/users.js
import express from 'express'
import { getUserProfile, createUser } from '../controllers/users.js'

const router = express.Router()

// Create user on signup/login
router.post('/', createUser)

// Fetch profile + projects
router.get('/:uid', getUserProfile)

export default router
