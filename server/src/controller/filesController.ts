import multer from "multer";

const profilePictureStorage = multer.diskStorage({
  destination: "media/profile/",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const postPictureStorage = multer.diskStorage({
  destination: "media/posts/",
  filename: function (req, file, cb) {
    cb(null, req.params.postId + "_" + file.originalname);
  },
});

const uploadFile = multer({ storage: profilePictureStorage }).single("file");

const uploadMultipleFiles = multer({ storage: postPictureStorage }).array(
  "files"
);

export { uploadFile, uploadMultipleFiles };
