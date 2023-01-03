const multer = require("multer");
const fs = require("fs");

// const date = new Date().toISOString().substring(0, 10) + "_";
// const maxsize = 1024 * 1024 * 5;

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    loc = `./upload/profileImage`;
    fs.mkdirSync(loc, { recursive: true });
    cb(null, loc);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// let fileFilter = (req, file, cb) => {
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
//     cb(null, true);
//   } else {
//     cb("File Format only support jpeg/jpg", false);
//   }
// };

let upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: maxsize,
  // },
  // fileFilter: fileFilter,
});

module.exports = upload;
