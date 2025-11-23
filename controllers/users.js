// server/controllers/users.js
import User from '../models/User.js'
import Project from '../models/Project.js'

/**
 * GET /api/users/:uid
 * Returns { user, projects }
 */
export const getUserProfile = async (req, res) => {
  try {
    const { uid } = req.params
    if (!uid) return res.status(400).json({ message: 'Missing uid param' })

    const user = await User.findOne({ uid }).lean()
    if (!user) return res.status(404).json({ message: 'User not found' })

    const projects = await Project.find({ 'author.uid': uid })
      .sort({ createdAt: -1 })
      .lean()

    return res.json({ user, projects })
  } catch (err) {
    console.error('getUserProfile error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * POST /api/users
 * Create or update user record from auth info
 */
export const createUser = async (req, res) => {
  try {
    const { uid, email, displayName } = req.body
    if (!uid || !email) {
      return res.status(400).json({ message: 'uid and email are required' })
    }

    // Create if not exists, otherwise keep existing
    const user = await User.findOneAndUpdate(
      { uid },
      {
        $setOnInsert: {
          uid,
          email,
          displayName,
        },
      },
      { upsert: true, new: true }
    ).lean()

    return res.json({ user })
  } catch (err) {
    console.error('createUser error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * Utility: create/update a user record from Firebase auth info
 * (can be used by auth middleware if needed)
 */
export const upsertUserFromAuth = async (uid, email, displayName) => {
  try {
    if (!uid) throw new Error('upsertUserFromAuth: missing uid')
    await User.updateOne(
      { uid },
      { $set: { email, displayName } },
      { upsert: true }
    )
  } catch (err) {
    console.error('upsertUserFromAuth error:', err)
  }
}

// alias for backwards compatibility
export const getUser = getUserProfile

export default {
  getUserProfile,
  createUser,
  upsertUserFromAuth,
  getUser,
}
