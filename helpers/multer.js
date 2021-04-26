const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const { CloudinaryStorage } = require("multer-storage-cloudinary");

// const {
//   CLOUDINARY_HOST,
//   "127324837821196",
//   CLOUDINARY_API_SECRET,
// } = process.env;

cloudinary.config({
  cloud_name: "strictlysocial",
  api_key: "127324837821196",
  api_secret: "B0fifvRldmHP6zMELXKABNJqABY",
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
    //   folder: "sample",
    //   format: async () => "jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF",
    //   public_id: (req, file) => file.filename,
    //   quality_analysis: 60
        transformation: {quality: 60}
    },
  });
  
// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'uploads/');
//     },

//     // By default, multer removes file extensions so let's add them back
//     filename: function(req, file, cb) {
//         cb(null, Date.now() + file.originalname);
//     }
// });

const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(('Only image files are allowed!'), false);
    }
    cb(null, true);
};

module.exports = {storage ,imageFilter};