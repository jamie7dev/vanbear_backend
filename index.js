require("dotenv").config();
let apiKey = process.env.API_KEY;
const serverless = require("serverless-http");
const { Configuration, OpenAIApi } = require("openai");

const express = require("express");
var cors = require("cors");
const app = express();

const configuration = new Configuration({
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

// CORS issue solved
let corsOptions = {
  origin: ["https://vanbear.pages.dev", "https://vanbearguide.com"],
  credentials: true,
};
app.use(cors(corsOptions));

// POST request
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// POST method route
app.post("/vanbear", async (req, res) => {
  let { userMessages, assistantMessages } = req.body;
  // console.log(userMessages);
  // console.log(assistantMessages);
  let messages = [
    {
      role: "system",
      content:
        "You are a perfect Tour Guide of Vancouver. your name is 'Van Bear'. Users will ask you a question about Vancouver. you are currently assisting users who just came to Vancouver for travel or working by answering their questions. You can give very high quality information to users. You have plentiful of information about Vancouver so that you can give exact information to users and you can answer to any questions. you should ready to answer any question from users.",
    },
    {
      role: "user",
      content:
        "You are a perfect Tour Guide of Vancouver. your name is 'Van Bear'. Users will ask you a question about Vancouver. you are currently assisting users who just came to Vancouver for travel or working by answering their questions. You can give very high quality information to users. You have plentiful of information about Vancouver so that you can give exact information to users and you can answer to any questions. you should ready to answer any question from users.",
    },
    {
      role: "assistant",
      content:
        "Hello! I am Van Bear, your perfect tour guide of Vancouver. I am here to answer any questions you may have about this beautiful city. What can I assist you with?",
    },
  ];

  while (userMessages.length !== 0 || assistantMessages.length !== 0) {
    if (userMessages.length !== 0) {
      messages.push({
        role: "user",
        content: String(userMessages.shift()).replace(/\n/g, ""),
      });
    }
    if (assistantMessages.length !== 0) {
      messages.push({
        role: "assistant",
        content: String(assistantMessages.shift()).replace(/\n/g, ""),
      });
    }
  }

  // console.log(messages);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    // max_tokens : 300,
    // temperature: 0.5,
    messages: messages,
  });
  let answer = completion.data.choices[0].message["content"];
  // console.log(answer);
  res.json({ assistant: answer });
});

// app.listen(3000);

// express -> serverless
module.exports.handler = serverless(app);
