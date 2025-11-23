// server/controllers/projects.js
import Project from '../models/Project.js'

// GET /api/projects
export const listProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, tag, q } = req.query
    const filter = {}

    if (tag) filter.tags = tag
    if (q) {
      filter.$or = [
        { title: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
      ]
    }

    const skip = (Number(page) - 1) * Number(limit)
    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean()
    const total = await Project.countDocuments(filter)

    return res.json({ projects, total })
  } catch (err) {
    console.error('listProjects error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/projects/:id
export const getProject = async (req, res) => {
  try {
    const { id } = req.params
    const project = await Project.findById(id).lean()
    if (!project) return res.status(404).json({ message: 'Not found' })
    return res.json({ project })
  } catch (err) {
    console.error('getProject error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

// POST /api/projects
export const createProject = async (req, res) => {
  try {
    console.log('👉 createProject body =>', req.body)

    const { title, description, tags, githubLink, liveDemo, author } = req.body

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title required' })
    }

    // build author info if present in body
    let authorInfo = null
    if (author) {
      authorInfo = {
        uid: author.uid,
        displayName: author.displayName,
        email: author.email,
        ref: author.ref,
      }
    }

    const project = await Project.create({
      title: title.trim(),
      description: (description || '').trim(),
      tags: Array.isArray(tags) ? tags : [],
      githubLink,
      liveDemo,
      author: authorInfo,
      createdAt: new Date(),
    })

    console.log('✅ created project id =>', project._id)

    return res.status(201).json({ project })
  } catch (err) {
    console.error('❌ createProject error =>', err)
    return res
      .status(500)
      .json({ message: 'Server error', error: err.message })
  }
}

// PUT /api/projects/:id
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params
    const project = await Project.findById(id)
    if (!project) return res.status(404).json({ message: 'Not found' })

    if (project.author?.uid && req.user && project.author.uid !== req.user.uid) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const updates = req.body
    Object.assign(project, updates, { updatedAt: new Date() })
    await project.save()
    return res.json(project)
  } catch (err) {
    console.error('updateProject error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

// DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params
    const project = await Project.findById(id)
    if (!project) return res.status(404).json({ message: 'Not found' })

    if (project.author?.uid && req.user && project.author.uid !== req.user.uid) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    await project.deleteOne()
    return res.json({ ok: true })
  } catch (err) {
    console.error('deleteProject error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

// POST /api/projects/:id/favorite
export const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params
    const uid = req.user?.uid
    if (!uid) return res.status(401).json({ message: 'Unauthorized' })

    const project = await Project.findById(id)
    if (!project) return res.status(404).json({ message: 'Not found' })

    const idx = project.favorites.indexOf(uid)
    let isFavorited = false

    if (idx === -1) {
      project.favorites.push(uid)
      isFavorited = true
    } else {
      project.favorites.splice(idx, 1)
      isFavorited = false
    }

    await project.save()
    return res.json({ favoritesCount: project.favorites.length, isFavorited })
  } catch (err) {
    console.error('toggleFavorite error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

// POST /api/projects/:id/rate
export const rateProject = async (req, res) => {
  try {
    const { id } = req.params
    const { rating } = req.body
    if (typeof rating !== 'number') {
      return res.status(400).json({ message: 'rating must be a number' })
    }

    const project = await Project.findById(id)
    if (!project) return res.status(404).json({ message: 'Not found' })

    const existing = project.ratings.find((r) => r.uid === req.user?.uid)
    if (existing) existing.rating = rating
    else project.ratings.push({ uid: req.user?.uid, rating })

    await project.save()
    const avg =
      project.ratings.reduce((s, r) => s + r.rating, 0) /
      project.ratings.length

    return res.json({ avg, count: project.ratings.length })
  } catch (err) {
    console.error('rateProject error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}
