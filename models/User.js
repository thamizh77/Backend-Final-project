import mongoose from 'mongoose'
const { Schema } = mongoose


const UserSchema = new Schema({
uid: { type: String, unique: true },
email: String,
displayName: String,
bio: String,
createdAt: { type: Date, default: Date.now }
})


export default mongoose.model('User', UserSchema)