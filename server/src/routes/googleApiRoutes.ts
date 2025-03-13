import express from "express";
import {
  findRestaurantInGoogleApiByName,
  chatGptApi,
} from "../controller/googleApiController";

const router = express.Router();

router.post("/", findRestaurantInGoogleApiByName);
router.post("/chatGpt", chatGptApi);

export default router;
