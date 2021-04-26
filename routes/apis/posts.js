const express = require("express");
const request = require("request");
const fs = require("fs");
const cheerio = require("cheerio");
const path = require("path");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Post = require("../../models/Post");
const multerConfig = require("../../helpers/multer");
const multer = require("multer");
const sharp = require("sharp");
const cloudinary = require("cloudinary").v2;

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
      let resObj = {};
      if (text.match(/(https?:\/\/[^\s]+)/g)) {
        let [url] = text.match(/(https?:\/\/[^\s]+)/g);
        await request(url, async function (error, response, responseHtml) {
          //set a reference to the document that came back
          let $ = cheerio.load(responseHtml),
            //create a reference to the meta elements
            $title = $("head title").text(),
            $desc = $('meta[name="description"]').attr("content"),
            $kwd = $('meta[name="keywords"]').attr("content"),
            $ogTitle = $('meta[property="og:title"]').attr("content"),
            $ogImage = $('meta[property="og:image"]').attr("content"),
            $ogkeywords = $('meta[property="og:keywords"]').attr("content"),
            $images = $("img");
            
          resObj.url = url;

          if ($title) {
            resObj.title = $title;
          }

          if ($desc) {
            resObj.description = $desc;
          }

          if ($kwd) {
            resObj.keywords = $kwd;
          }

          if ($ogImage && $ogImage.length) {
            resObj.ogImage = $ogImage;
          }

          if ($ogTitle && $ogTitle.length) {
            resObj.ogTitle = $ogTitle;
          }

          if ($ogkeywords && $ogkeywords.length) {
            resObj.ogkeywords = $ogkeywords;
          }

          if ($images && $images.length) {
            resObj.images = [];

            for (var i = 0; i < $images.length; i++) {
              resObj.images.push($($images[i]).attr("src"));
            }
          }
          let post = new Post({
            user: user.id,
            text,
            name: user.name,
            avatar: user.imageData ? user.imageData : user.avatar,
            likes: [],
            comments: [],
            imageName: "none",
            imageData: "",
            linkData: resObj,
          });
    
          const newpost = await post.save();
          res.json({ newpost });
        });
      } else {
        let post = new Post({
          user: user.id,
          text,
          name: user.name,
          avatar: user.imageData ? user.imageData : user.avatar,
          likes: [],
          comments: [],
          imageName: "none",
          imageData: "",
          linkData: resObj,
        });
  
        const newpost = await post.save();
        res.json({ newpost });
      }


    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
    }
  }
);

router.get("/share/:id", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    if (!user) {
      return res.status(403).json({ msg: "Unauthorized access" });
    }
    const { text, imageName, imageData } = post;
    let anewpost = new Post({
      text,
      imageName,
      imageData,
      likes: [],
      comments: [],
      avatar: user.imageData ? user.imageData : user.avatar,
      name: user.name,
      owner: post.user,
      user: user._id,
    });

    let newpost = await anewpost.save();
    res.json({
      newpost: { ...newpost._doc, owner: { _id: post.user, name: post.name } },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// get all posts
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const fowls = user.following.map((f) => f.toString());
    fowls.push(req.user.id);

    // const posts = await Post.find().sort({ date: -1 });
    const posts = await Post.find({ user: { $in: fowls } })
      .populate("owner", "name")
      .sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// get most liked posts
router.get("/popular", auth, async (req, res) => {
  try {
    await Post.find()
      .where("text")
      .ne("")
      .populate("owner", "name")
      .sort({ likes: -1 })
      .limit(5)
      .exec(function (err, result) {
        if (err) return res.status(500).send("Server error");
        res.json(result);
      });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// search
router.get("/search/:searchQuery", auth, async (req, res) => {
  try {
    await Post.find({
      $or: [
        { text: { $regex: req.params.searchQuery, $options: "i" } },
        { name: { $regex: req.params.searchQuery, $options: "i" } },
      ],
    })
      .populate("owner", "name")
      .limit(10)
      .exec(function (err, result) {
        if (err) return res.status(500).send("Server error");
        res.json(result);
      });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// create post with image
router.post(
  "/uploadImage",
  auth,
  async (req, res) => {
    let upload = multer({
      storage: multerConfig.storage,
      fileFilter: multerConfig.imageFilter,
    }).single("imageData");
    try {
      new Promise((resolve, reject) => {
        upload(req, res, async function (err) {
          if (req.fileValidationError) {
            return res.status(500).send(req.fileValidationError);
          } else if (err instanceof multer.MulterError) {
            return res.status(500).send(err);
          } else if (err) {
            return res.status(500).send(err);
          }
         
          resolve()
        });
      }).then(async () => {
        // Display uploaded image for user validation
        let user = await User.findById(req.user.id);
        console.log(req.file);
        const text = "";
        let post = new Post({
          user: user.id,
          text,
          name: user.name,
          avatar: user.imageData ? user.imageData : user.avatar,
          likes: [],
          comments: [],
          imageName: req.file.filename,
          imageData: req.file.path,
        });

        const newpost = await post.save();
        res.json({ newpost });
      })
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
    }
  }
);

// get post by id
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("owner", "name");
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
    const posts = await Post.find({ user: req.params.id })
      .populate("owner", "name")
      .sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// post delete
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("owner", "name");
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized access" });
    }
    if(post.imageName != "none"){
      try {
        await cloudinary.uploader.destroy(post.imageName);
      } catch (error) {
        console.log(error.message)
      }
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
    const post = await Post.findById(req.params.id).populate("owner", "name");
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
      const post = await Post.findById(req.params.id).populate("owner", "name");

      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }

      const user = await User.findById(req.user.id);

      let comment = {
        text,
        user: req.user.id,
        name: user.name,
        avatar: user.imageData ? user.imageData : user.avatar,
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

// delte comment
router.delete("/comments/:id/:commentId", auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: "Bad request" });
  }
  let { text } = req.body;
  try {
    const post = await Post.findById(req.params.id).populate("owner", "name");

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
