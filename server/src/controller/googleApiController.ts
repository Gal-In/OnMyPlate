import { GoogleGenerativeAI } from "@google/generative-ai";
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

export const generateRestaurtDescriptionWithGeminiAi = async (
  req: Request,
  res: Response
) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_AI_KEY as string);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  try {
    const { restaurantName, images } = req.body;
    images.map((image: string) => ({
      inlineData: {
        data: image,
        minType: "image/jpeg",
      },
    }));

    const prompt = `Imagine you are a regular person who visited a restaurant. You want to write a short and friendly post for a website where people share their experiences and opinions about restaurants.
    I will give you the name of the restaurant, and you will see the images from the place (food, atmosphere, etc.). Based on these, write a short description in Hebrew about the restaurant — as if you are recommending it to friends. 
    The description should:
    - Be natural, flowing, and inviting.
    - Mention what kind of food and atmosphere there is, based on the images.
    - Feel personal and authentic — like something a real person would write.
    - Not be longer than 400 characters.
    - Be only in Hebrew, and do not say you are an AI, no icons just regular charcters.
    Here are the details: שם המסעדה: ${restaurantName} תכתוב רק את הפסקה בעברית. בלי שום דבר נוסף.`;

    const result = await model.generateContent([prompt, ...images]);

    res.status(200).send({ description: result.response.text() });
  } catch (error) {
    res.status(500).send(error);
  }
};
