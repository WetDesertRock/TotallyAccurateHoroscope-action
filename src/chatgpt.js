import { Configuration, OpenAIApi } from "openai"
import zodiacInfo from './zodiac.js'
import log4js from 'log4js';

const logger = log4js.getLogger();

export async function generateHoroscope(openaiAPIKey, prompt) {
  let funcParamProperties = {}
  for (let zodiac of zodiacInfo) {
    funcParamProperties[zodiac.name] = { "type": "string" }
  }
  const configuration = new Configuration({
    apiKey: openaiAPIKey,
  })

  const openai = new OpenAIApi(configuration)
  const chat_completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    functions: [{
      "name": "writeHoroscope",
      "description": "Takes horoscope and writes it",
      "parameters": {
        "type": "object",
        "properties": funcParamProperties,
      },
    }],
    messages: [
      { role: "user", content: prompt }
    ],
    // max_tokens: 1000, // Removed to prevent JSON output from being cut off. Hopefully prompt encourages short enough responses.
    function_call: { "name": "writeHoroscope" },
    presence_penalty: 0.23,
    frequency_penalty: 0.23
  })

  logger.trace('ChatGPT Response data: ' + JSON.stringify(chat_completion.data))

  let usage = chat_completion.data.usage
  logger.info(`ChatGPT token usage info: Prompt: ${usage.prompt_tokens}, Completion: ${usage.completion_tokens}, Total: ${usage.total_tokens}`)

  let choice = chat_completion.data.choices[0]
  let args = JSON.parse(choice.message.function_call.arguments)
  return args
}
