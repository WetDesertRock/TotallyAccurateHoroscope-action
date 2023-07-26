import dotenv from 'dotenv'
import { Configuration, OpenAIApi } from "openai"

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateHoroscope(prompt) {
  const openai = new OpenAIApi(configuration)
  const chat_completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    functions: [{
      "name": "writeHoroscope",
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
      { role: "user", content: prompt }
    ],
    max_tokens: 1000,
    function_call: { "name": "writeHoroscope" },
    presence_penalty: 0.23,
    frequency_penalty: 0.23
  })

  console.log(chat_completion.data)
  console.log("Usage", chat_completion.data.usage)
  let choice = chat_completion.data.choices[0]
  console.log(choice)
  let args = JSON.parse(choice.message.function_call.arguments)
  return args
}

export { generateHoroscope }