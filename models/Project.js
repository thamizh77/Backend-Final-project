import mongoose from 'mongoose'
const { Schema } = mongoose


const ProjectSchema = new Schema({
title: { type: String, required: true },
description: { type: String },
tags: [{ type: String }],
githubLink: { type: String },
liveDemo: { type: String },
author: {
uid: String,
displayName: String,
email: String,
ref: { type: Schema.Types.ObjectId, ref: 'User' }
},
favorites: [{ type: String }], // array of user uids
ratings: [{ uid: String, rating: Number }],
createdAt: { type: Date, default: Date.now },
updatedAt: { type: Date }
})


export default mongoose.model('Project', ProjectSchema)