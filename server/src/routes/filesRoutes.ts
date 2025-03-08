import express from "express";
import { uploadFile } from "../controller/filesController";

const router = express.Router();

router.post("/profilePicture", uploadFile, (req, res) => {
  res.status(200).send({ url: req.file?.path });
});

export default router;
