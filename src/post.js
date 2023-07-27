import { writeFile } from 'node:fs/promises'
import { DateTime } from "luxon"
import { generatePrompt } from "./promptgenerator.js"
import { generateHoroscope } from './chatgpt.js'
import { randomChoice } from './randomUtil.js'
import zodiacInfo from './zodiac.js'

export class Post {
  constructor(templateFile, outputDir, localRun) {
    this.templateFile = templateFile
    this.outputDir = outputDir
    this.localRun = localRun
    this.date = DateTime.utc()
  }

  async generateFakeHoroscope() {
    let horo = {}
    for (let zodiac of zodiacInfo) {
      let confience = randomChoice(["will", "might", "possibly", "probably will not", "will not", "definitely won't"])
      horo[zodiac.name] = `You ${confience} have a good day`
    }

    return horo
  }

  async create() {
    let prompt = await generatePrompt(this.date)
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
    let outputStr = ""
    for (let zodiac of zodiacInfo) {
      let zodiacHoroscope = horoscope[zodiac.name]
      outputStr += `
### ${zodiac.name}{.horoheader}

*~${zodiac.approximate_start_date} - ${zodiac.approximate_end_date}*
{.horodate}

${zodiacHoroscope}

`
    }

    await writeFile(outputPath, outputStr)
  }
}