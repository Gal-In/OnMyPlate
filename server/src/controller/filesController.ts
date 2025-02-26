import multer from "multer";

const storage = multer.diskStorage({
  destination: "media/profile/",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadFile = multer({ storage: storage }).single("file");

export { uploadFile };
