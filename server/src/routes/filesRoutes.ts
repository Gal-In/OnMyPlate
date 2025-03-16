import express from "express";
import { uploadFile, uploadMultipleFiles } from "../controller/filesController";

const router = express.Router();

router.post("/profilePicture", uploadFile, (req, res) => {
  res.status(200).send({ url: req.file?.path });
});

router.post("/postPictures/:postId", uploadMultipleFiles, (req, res) => {
  res.status(200).send({ urls: req.files });
});

export default router;
