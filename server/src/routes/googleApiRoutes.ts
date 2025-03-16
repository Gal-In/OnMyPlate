import express from "express";
import {
  findRestaurantInGoogleApiByName,
  generateRestaurtDescriptionWithGeminiAi,
} from "../controller/googleApiController";

const router = express.Router();

router.post("/restaurantApi", findRestaurantInGoogleApiByName);
router.post("/generateDescription", generateRestaurtDescriptionWithGeminiAi);

export default router;
