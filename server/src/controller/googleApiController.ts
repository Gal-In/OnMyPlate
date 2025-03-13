import axios from "axios";
import { Request, Response } from "express";
import OpenAI from "openai";

const GOOGLE_MAPS_API_PATH =
  "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?";

const findRestaurantInGoogleApiByName = async (req: Request, res: Response) => {
  const { inputType, language, fields, input } = req.body;

  const response = await axios.get(
    `${GOOGLE_MAPS_API_PATH}inputtype=${inputType}&key=${process.env.GOOGLE_API_KEY}&language=${language}&fields=${fields}&input=${input}`
  );

  res.status(200).send(response.data.candidates);
};

const chatGptApi = async (req: Request, res: Response) => {
  const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
  });

  const { restaurantName } = req.body;

  const response = await openai.chat.completions.create({
    model: "gpt-4o", // "gpt-4-turbo" - porbably needed for images
    max_tokens: 1000,
    messages: [
      { role: "system", content: "אתה עוזר שמדבר תמיד בעברית." },
      {
        role: "user",
        content: `You are writing short and engaging posts for a restaurant recommendations website. I will give you the name of a restaurant, and you will write a single paragraph describing the restaurant in a positive and inviting way to encourage people to visit. The paragraph should be light, flowing, and mention the food, atmosphere, or something unique. The paragraph must not exceed 400 characters.
            Restaurant name: ${restaurantName}`,
      },
    ],
  });

  console.log({ response });

  const reply = response.choices[0]?.message?.content;
  console.log({ reply });
  res.status(200).send(reply);
};

export { findRestaurantInGoogleApiByName, chatGptApi };
