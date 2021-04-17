const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Post = require("../../models/Post");

// create post
router.post(
  "/",
  [check("text", "Text is required").not().isEmpty()],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text } = req.body;
    try {
      let user = await User.findById(req.user.id);

      let post = new Post({
        user: user.id,
        text,
        name: user.name,
        avatar: user.avatar,
        likes: [],
        comments: [],
      });

      const newpost = await post.save();
      res.json({ newpost });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
    }
  }
);

// get all posts
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// get post by id
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.json({ post });
  } catch (error) {
    console.log(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server error");
  }
});

// get posts by user id
router.get("/user/:id", auth, async (req, res) => {
  try {
    const posts = await Post.find({user: req.params.id}).sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});


// post delete
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized access" });
    }

    await post.remove();

    res.json({ msg: "Post deleted" });
  } catch (error) {
    console.log(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server error");
  }
});

// Like/unlike
router.put("/likes/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    const likeIndex = post.likes.findIndex(
      (like) => like.user == req.user.id.toString()
    );
    if (likeIndex == -1) {
      post.likes.unshift({ user: req.user.id });
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();

    res.json(post.likes);
  } catch (error) {
    console.log(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server error");
  }
});

// Comment add
router.post(
  "/comments/:id",
  [check("text", "Comment is required").not().isEmpty()],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: "Bad request" });
    }
    let { text } = req.body;
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }

      const user = await User.findById(req.user.id);

      let comment = {
        text,
        user: req.user.id,
        name: user.name,
        avatar: user.avatar,
      };

      post.comments.unshift(comment);

      await post.save();

      res.json(post.comments);
    } catch (error) {
      console.log(error.message);
      if (error.kind === "ObjectId") {
        return res.status(404).json({ msg: "Post not found" });
      }
      res.status(500).send("Server error");
    }
  }
);

router.delete("/comments/:id/:commentId", auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: "Bad request" });
  }
  let { text } = req.body;
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    const commentIndex = post.comments.findIndex(
      (comment) =>
        comment.user == req.user.id.toString() &&
        comment.id == req.params.commentId
    );
    if (commentIndex !== -1) {
      post.comments.splice(commentIndex, 1);
    }

    await post.save();

    res.json(post.comments);
  } catch (error) {
    console.log(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server error");
  }
});

module.exports = router;
