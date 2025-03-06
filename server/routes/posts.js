const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const router = express.Router();

// Create Post
router.post('/', auth, async (req, res) => {
  const { content, images } = req.body;
  try {
    const post = new Post({ userId: req.userId, content, images });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('userId', 'name');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.userId.toString() !== req.userId) return res.status(403).json({ msg: 'Unauthorized' });
    await post.remove();
    res.json({ msg: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// React to Post
router.post('/:id/react', auth, async (req, res) => {
  const { reaction } = req.body; // e.g., "like", "love"
  try {
    const post = await Post.findById(req.params.id);
    const reactions = post.reactions || new Map();
    reactions.set(reaction, (reactions.get(reaction) || 0) + 1);
    post.reactions = reactions;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Comment on Post
router.post('/:id/comment', auth, async (req, res) => {
  const { text } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    post.comments.push({ userId: req.userId, text, createdAt: new Date() });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;