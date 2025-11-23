import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import projectsRouter from './routes/projects.js'
import commentsRouter from './routes/comments.js'
import usersRouter from './routes/users.js'


dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())


app.use('/api/projects', projectsRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/users', usersRouter)


app.get('/', (req, res) => res.json({ ok: true }))


const PORT = process.env.PORT || 4000


mongoose.connect(process.env.MONGO_URI, { dbName: 'peerprojecthub' })
.then(() => {
console.log('MongoDB connected')
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
.catch(err => {
console.error('MongoDB connection error:', err)
process.exit(1)
})