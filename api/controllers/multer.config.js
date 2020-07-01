const multer = require('multer')
const path = require('path')

// const feedStorage = multer.diskStorage({
//   destination: "./uploads/feeds/",
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   }
// });
const feedStorage = multer.diskStorage({
  destination: './uploads/feed/',
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    )
  }
})

const bannerPicStorage = multer.diskStorage({
  destination: './uploads/banner/',
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    )
  }
})

exports.bannerPicUpload = multer({
  storage: bannerPicStorage
  // fileFilter: (req, file, cb) => {
  //     checkIsImg(file, cb);
  // }
})

exports.feedUpload = multer({
  storage: feedStorage
})

// exports.bannerUpload = multer({
//   storage: bannerStorage
// })
