import axios from "axios";
import { Request, Response } from "express";

const GOOGLE_MAPS_API_PATH =
  "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?";

export const findRestaurantInGoogleApiByName = async (
  req: Request,
  res: Response
) => {
  const { inputType, language, fields, input } = req.body;

  const response = await axios.get(
    `${GOOGLE_MAPS_API_PATH}inputtype=${inputType}&key=${process.env.GOOGLE_API_KEY}&language=${language}&fields=${fields}&input=${input}`
  );

  res.status(200).send(response.data.candidates);
};
