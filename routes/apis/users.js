const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const upload = require("../../middleware/multer");
const ObjectId = require("mongoose").Types.ObjectId;
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const auth = require("../../middleware/auth");
const Post = require("../../models/Post");
const Notification = require("../../models/Notification");
const transporter = require("../../helpers/smtpConfig");
const multerConfig = require("../../helpers/multer");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        email,
        avatar,
        password,
        following: ["608438c33383641df099002a"],
      });

      const salt = await bcrypt.genSaltSync(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtsecret"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            name,
            email,
            avatar,
            _id: user.id,
            following: user.following,
            followers: user.followers,
            bio: user.bio,
          });
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
    }
  }
);

// most followed people
router.get("/popular", auth, async (req, res) => {
  try {
    await User.find()
      .sort({ followers: -1 })
      .limit(5)
      .exec((err, result) => {
        if (err) return res.status(500).send("Server error");
        res.json(result);
      });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// most followed people
router.get("/notifications", auth, async (req, res) => {
  try {
    let notifications = await Notification.find({receiver: req.user.id})
    .sort({date: -1})
    .populate({path: "sender", select: '_id, name'})
    .populate({path: "post", select: '_id, text'});
    res.json(notifications);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

router.post(
  "/forgot",
  [check("email", "Please enter a valid email").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send("Please enter a valid email");
    }
    try {
      const user = await User.findOne({ email: req.body.email });
      console.log(user);
      if (!user) {
        return res
          .status(400)
          .send("No account with that email address exists.");
      }

      let buf = await crypto.randomBytes(20);
      var token = await buf.toString("hex");
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      await user.save();

      var mailOptions = {
        to: user.email,
        from: "strictlysocial2021@gmail.com",
        subject: "Password Reset",
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://${req.headers.host}/reset/${token}\n\n"
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) throw error;
        res.send("Password reset link has been sent to your email!");
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
    }
  }
);

router.get("/:id", auth, async (req, res) => {
  try {
    let user;
    if (ObjectId.isValid(req.params.id)) {
      user = await User.findById(req.params.id)
        .populate("following", "-password")
        .populate("followers", "-password")
        .select("-password");
    } else {
      user = await User.findOne({ email: { $regex: req.params.id + ".*" } })
        .populate("following", "-password")
        .populate("followers", "-password")
        .select("-password");
    }
    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// search
router.get("/search/:searchQuery", auth, async (req, res) => {
  try {
    await User.find({
      $or: [
        { name: { $regex: req.params.searchQuery, $options: "i" } },
        { email: { $regex: req.params.searchQuery, $options: "i" } },
      ],
    })
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

// update user
router.post("/", auth, async (req, res) => {
  let upload = multer({
    storage: multerConfig.storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: multerConfig.imageFilter,
  }).single("imageData");
  try {
    let user = await User.findById(req.user.id);
      new Promise((resolve, reject) => {
        upload(req, res, function (err) {
          // req.file contains information of uploaded file
          // req.body contains information of text fields, if there were any
          console.log(err)
          if (req.fileValidationError) {
            return res.status(500).send(req.fileValidationError);
          } else if (err instanceof multer.MulterError) {
            return res.status(500).send(err);
          } else if (err) {
            return res.status(500).send(err);
          }
      
          // Display uploaded image for user validation
          resolve()
        });
      }).then(async () => {
        if(!req.body.text){
          return res.status(500).send("Bio can't be blank");
        }
        user.bio = req.body.text;
        if(req.file){
          if(user.imageName != "none"){
            try {
              await cloudinary.uploader.destroy(user.imageName);
            } catch (error) {
              console.log(error.message);
            }
          }
          user.imageName = req.file.filename;
          user.imageData = req.file.path;
        }
        await user.save();
        
        // if(req.file){
        //   const filter = { user: user._id.toString() };
        //   const update = { avatar: "/" + req.file.path };
      
        //   let doc = await Post.updateMany(filter, update);
        // }
        res.json(user);
      })
   
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

router.post(
  "/updateProfilePic",
  upload.single("imageData"),
  auth,
  async (req, res) => {
    try {
      let user = await User.findById(req.user.id);
      (user.imageName = req.body.imageName),
        (user.imageData = req.file.path),
        await user.save();
      res.json(user);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
    }
  }
);

router.get("/reset/:token", async function (req, res) {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({
      errors: [{ msg: "Password reset token is invalid or has expired." }],
    });
  }
  res.json(user);
});

router.post(
  "/reset/:token",
  [
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        errors: [{ msg: "Password reset token is invalid or has expired." }],
      });
    }
    let { password } = req.body;
    const salt = await bcrypt.genSaltSync(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.send("Password is updated successfully!");
  }
);
router.put("/follow/:id", auth, async (req, res) => {
  try {
    let user = await User.findById(req.params.id)
      .populate("followers", "-password")
      .select("-password");

    let currentUser = await User.findById(req.user.id).select("-password");

    if (!user || !currentUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    const followerIndex = user.followers.findIndex(
      (follower) => follower._id == req.user.id.toString()
    );
    if (followerIndex == -1) {
      user.followers.unshift(req.user.id);
    } else {
      user.followers.splice(followerIndex, 1);
    }

    const followingIndex = currentUser.following.findIndex(
      (flng) => flng._id == req.params.id
    );
    if (followingIndex == -1) {
      currentUser.following.unshift(req.params.id);
      const notification = new Notification({
        sender: req.user.id,
        receiver: req.params.id,
        action: "follow"
      })
      await notification.save();
    } else {
      currentUser.following.splice(followingIndex, 1);
    }

    await user.save();
    await currentUser.save();

    currentUser = await User.findById(req.user.id)
      .populate("following", "-password")
      .select("-password");

    user = await User.findById(req.params.id)
      .populate("followers", "-password")
      .select("-password");

    res.json({ followers: user.followers, following: currentUser.following });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
