const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { authenticateToken } = require('../config/auth');
const xlsx = require('node-xlsx');
var multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  },
});
const upload = multer({ storage: storage });

//get all posts
router.get('/', authenticateToken, async (req, res) => {
  try {
    const post = await Post.find();
    res.json(post);
  } catch (error) {
    res.send({ message: error });
  }
});

// submit posts
router.post('/', authenticateToken, upload.single('file'), async (req, res) => {
  console.log(req.file);
  const post = new Post({
    user: req.user.user._id,
    title: req.body.title,
    description: req.body.description,
  });

  try {
    const data = await post.save();
    res.json(data);
  } catch (error) {
    res.json({ message: error });
  }
});

// get post by ID
router.get('/:postId', authenticateToken, async (req, res) => {
  try {
    const data = await Post.findById(req.params.postId);
    res.json(data);
  } catch (error) {
    res.json({ message: error });
  }
});

// delete post
router.delete('/:postId', authenticateToken, async (req, res) => {
  try {
    const result = await Post.findOne({ _id: req.params.postId });
    if (JSON.stringify(result.user) !== JSON.stringify(req.user.user._id)) {
      return res.sendStatus(401);
    }
    const data = await Post.deleteOne({ _id: req.params.postId });
    res.send(data);
  } catch (error) {
    res.json({ message: error });
  }
});

//update post
router.patch('/:postId', authenticateToken, async (req, res) => {
  try {
    const data = await Post.updateOne(
      { _id: req.params.postId },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          user: req.user.user._id,
        },
      }
    );
    res.json(data);
  } catch (error) {
    res.json({ message: error });
  }
});

module.exports = router;
