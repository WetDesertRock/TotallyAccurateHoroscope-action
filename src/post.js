import { readFile, writeFile } from 'node:fs/promises'
import { DateTime } from "luxon"
import { generatePrompt } from "./promptgenerator.js"
import { generateHoroscope } from './chatgpt.js'
import { randomChoice } from './randomUtil.js'
import zodiacInfo from './zodiac.js'
import log4js from 'log4js';

const logger = log4js.getLogger();

const AUTHORS = [
  "Sage Thompson",
  "Luna Williams",
  "Seraphina Hayes",
  "Orion Blackwood",
  "Isabella Moon",
  "Jasper Nightingale",
  "Astrid Rivers",
  "Gabriel Wolfe",
  "Amara Phoenix",
  "Phoenix Steele",
  "Mystic Rose",
  "Astral Brooks",
  "Zara Starling",
  "Celeste Morgan",
  "Atlas Silver",
  "Willow Dawn",
  "Mystic Reed",
  "Luna Westwood",
  "Orion Stone",
  "Aurora Blake"
]

export class Post {
  constructor(templateFile, outputDir, localRun) {
    this.templateFile = templateFile
    this.outputDir = outputDir
    this.localRun = localRun
    this.date = DateTime.utc()
  }

  async generateFakeHoroscope() {
    logger.log('Generating fake horoscope')
    let horo = {}
    for (let zodiac of zodiacInfo) {
      let confience = randomChoice(["will", "might", "possibly", "probably will not", "will not", "definitely won't"])
      horo[zodiac.name] = `You ${confience} have a good day`
    }

    return horo
  }

  async create() {
    let prompt = await generatePrompt(this.date)
    logger.log('Prompt used: ' + prompt)
    let horoscope = undefined
    if (this.localRun) {
      horoscope = await this.generateFakeHoroscope()
    } else {
      horoscope = await generateHoroscope(prompt)
    }

    await this.writePostFile(horoscope)
  }

  async writePostFile(horoscope) {
    let fileName = this.date.toFormat('yyyy-MM-dd') + '.md'
    let outputPath = `${this.outputDir}/${fileName}`
    let contentStr = ""
    for (let zodiac of zodiacInfo) {
      let zodiacHoroscope = horoscope[zodiac.name]
      contentStr += `
### ${zodiac.name}{.horoheader}

*~${zodiac.approximate_start_date} - ${zodiac.approximate_end_date}*
{.horodate}

${zodiacHoroscope}

`
    }

    let tags = ['accurate']
    let template = await readFile(this.templateFile, { encoding: 'utf8' })
    template = template.replace(/\{\{\s*\.Title\s*\}\}/g, this.date.toFormat('LLLL d y'))
    template = template.replace(/\{\{\s*\.Date\s*\}\}/g, this.date.toISO())
    template = template.replace(/\{\{\s*\.Tags\s*\}\}/g, JSON.stringify(tags))
    template = template.replace(/\{\{\s*\.Author\s*\}\}/g, randomChoice(AUTHORS))
    template = template.replace(/\{\{\s*\.Content\s*\}\}/g, contentStr)
    template = template.replace(".Content", contentStr)
    console.log(typeof template)

    logger.log(`Saving horoscope to ${outputPath}`)
    await writeFile(outputPath, template)
  }
}