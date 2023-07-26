// import { writeFile } from 'node:fs/promises';
import { generateHoroscope } from './src/chatgpt.js';
import { generatePrompt } from './src/promptgenerator.js';


async function writeHoroscope(path, horoscope) {
  // Format tbd
  await writeFile(path, JSON.stringify(horoscope));
}

async function main() {
  console.log(await generatePrompt())
  // let horoscope = await generateHoroscope()
}

main()