import express from "express";
import { findRestaurantInGoogleApiByName } from "../controller/googleApiController";

const router = express.Router();

router.post("/", findRestaurantInGoogleApiByName);

export default router;
