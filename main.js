// import { writeFile } from 'node:fs/promises';
import { generateHoroscope } from './src/chatgpt.js';
import { Post } from './src/post.js';
import { generatePrompt } from './src/promptgenerator.js';


async function writeHoroscope(path, horoscope) {
  // Format tbd
  await writeFile(path, JSON.stringify(horoscope));
}

async function main() {
  let post = new Post("unused", "./", true)
  await post.create()
  // console.log(await generatePrompt())
  // let horoscope = await generateHoroscope()
}

main()