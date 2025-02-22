import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "media/profile/",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/profilePicture", upload.single("file"), (req, res) => {
  res.status(200).send({ url: req.file?.path });
});

export default router;
