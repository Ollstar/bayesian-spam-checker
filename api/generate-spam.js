const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateRandomEmail(prompt) {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    return completion.data.choices[0].message.content.trim();
  } catch (error) {
    console.error(error);
    return "";
  }
}

module.exports = async (req, res) => {
  const email = await generateRandomEmail("Generate a random spam email maximum 100 words:");
  res.json({ email });
};
