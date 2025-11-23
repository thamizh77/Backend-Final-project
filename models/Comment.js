import mongoose from 'mongoose'
const { Schema } = mongoose


const CommentSchema = new Schema({
project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
authorUid: String,
authorName: String,
text: { type: String, required: true },
createdAt: { type: Date, default: Date.now }
})


export default mongoose.model('Comment', CommentSchema)

