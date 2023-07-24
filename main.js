require('dotenv').config()

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

async function write_horoscope(path, horoscope) {

}

async function main() {
  const openai = new OpenAIApi(configuration);
  const chat_completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    functions: [{
      "name": "write_horoscope",
      "description": "Takes horoscope and writes it",
      "parameters": {
        "type": "object",
        "properties": {
          "Aries": { "type": "string" },
          "Taurus": { "type": "string" },
          "Gemini": { "type": "string" },
          "Cancer": { "type": "string" },
          "Leo": { "type": "string" },
          "Virgo": { "type": "string" },
          "Libra": { "type": "string" },
          "Scorpius": { "type": "string" },
          "Sagittarius": { "type": "string" },
          "Capricornus": { "type": "string" },
          "Aquarius": { "type": "string" },
          "Pisces": { "type": "string" }
        },
      },
    }],
    messages: [
      { role: "user", content: "Write a horoscope for all 12 months inspired by plants in the style of a romance novel. Each horoscope should be 1-4 sentences in length" }
    ],
    max_tokens: 1000,
    function_call: { "name": "write_horoscope" }
  });
  // const chat_completion = await openai.createChatCompletion({
  //   model: "gpt-3.5-turbo",
  //   messages: [
  //     { role: "system", content: "Write in the style of a romance novel. Output should be formatted as markdown with each sign a new header" },
  //     { role: "user", content: "Write a horoscope for all 12 months inspired by plants. Each horoscope should be 1-4 sentences in length" }
  //   ],
  //   max_tokens: 1000
  // });

  console.log(chat_completion.data)
  console.log("Usage", chat_completion.data.usage)
  let choice = chat_completion.data.choices[0]
  console.log(choice)
  console.log(JSON.parse(choice.message.function_call.arguments))
}

main()