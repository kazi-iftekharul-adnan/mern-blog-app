const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  images: [{ type: String }], // URLs to images
  reactions: { type: Map, of: Number, default: {} }, // e.g., { "like": 5, "love": 2 }
  comments: [{ userId: Schema.Types.ObjectId, text: String, createdAt: Date }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);