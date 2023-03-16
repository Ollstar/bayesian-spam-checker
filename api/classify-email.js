const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const completion = await openai.createChatCompletion({
    model: "gpt-4",
    temperature: 0.0,
    messages: [{ role: "user", content: `Use your skills to decipher if this email is spam or not, based on if you think its spam say TRUE if you think it is not spam say FALSE, do not include anything else in response-- email: ${email}` }],
  });

  res.json({ classification: completion.data.choices[0].message.content });
};
