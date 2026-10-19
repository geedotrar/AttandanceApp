import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export default upload;

//////////////////////////////////////
//multer.js
// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "../server/uploads"));
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images are allowed!"), false);
//   }
// };

// const upload = multer({ storage, fileFilter });

// export default upload;

/////////
