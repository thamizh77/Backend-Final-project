import Comment from '../models/Comment.js'
import Project from '../models/Project.js'


export const createComment = async (req, res) => {
try {
const { projectId, text } = req.body
if (!projectId || !text) return res.status(400).json({ message: 'projectId and text required' })


const project = await Project.findById(projectId)
if (!project) return res.status(404).json({ message: 'Project not found' })


const c = new Comment({ project: projectId, authorUid: req.user.uid, authorName: req.user.name, text })
await c.save()
res.status(201).json(c)
} catch (err) {
console.error(err)
res.status(500).json({ message: 'Server error' })
}
}


export const getCommentsForProject = async (req, res) => {
try {
const { projectId } = req.params
const comments = await Comment.find({ project: projectId }).sort({ createdAt: -1 }).lean()
res.json({ comments })
} catch (err) {
console.error(err)
res.status(500).json({ message: 'Server error' })
}
}