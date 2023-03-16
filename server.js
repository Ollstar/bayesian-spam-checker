const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public", { extensions: ["html", "js", "css"] }));

app.post("/classify-email", async (req, res) => {
  const { email } = req.body;
  // console.log(email);
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const completion = await openai.createChatCompletion({
    model: "gpt-4",
    temperature: 0.0,
    messages: [{ role: "user", content: `Use your skills to decipher if this email is spam or not, based on if you think its spam say TRUE if you think it is not spam say FALSE, do not include anything else in response-- email: ${email}` }],
  });
  // console.log(completion.data.choices[0].message.content);
  res.json({ classification: completion.data.choices[0].message.content });
});

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

app.get("/generate-spam", async (req, res) => {
  const email = await generateRandomEmail("Generate a random spam email maximum 100 words:");
  res.json({ email });
});

app.get("/generate-not-spam", async (req, res) => {
  const email = await generateRandomEmail("Generate a random non-spam email maximum 100 words:");
  res.json({ email });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});