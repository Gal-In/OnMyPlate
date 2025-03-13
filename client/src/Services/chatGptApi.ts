import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPEN_AI_API_KEY,
});

const chatGptApi = async (restaurantName: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo", // "gpt-4-turbo" - porbably needed for images
    max_tokens: 1000,
    messages: [
      { role: "system", content: "אתה עוזר שמדבר תמיד בעברית." },
      {
        role: "user",
        content: `You are writing short and engaging posts for a restaurant recommendations website. I will give you the name of a restaurant, and you will write a single paragraph describing the restaurant in a positive and inviting way to encourage people to visit. The paragraph should be light, flowing, and mention the food, atmosphere, or something unique. The paragraph must not exceed 400 characters.

Restaurant name: ${restaurantName}

`,
      },
    ],
  });

  console.log({ response });

  const reply = response.choices[0]?.message?.content;
  console.log({ reply });
  return reply;
};

export default chatGptApi;
