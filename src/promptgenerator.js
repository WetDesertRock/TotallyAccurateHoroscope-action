import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { shuffleArray, randomChoice } from './randomUtil.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let focusLists = [
  "data/focuses.json",
  "data/goofyFocuses.json",
]

let moodLists = [
  "data/moods.json",
  "data/emotions.json",
]

let styleLists = [
  "data/customstyles.json",
  "data/styles.json"
]

let wordLists = [
  "data/misc_words.json"
]

async function loadDataList(listPath) {
  let data = await readFile(path.join(__dirname, listPath))
  return JSON.parse(data)
}

class DataLists {
  static _singletonInstance
  styles = []
  moods = []
  focuses = []
  words = []
  hasInit = false

  async init() {
    if (this.hasInit) {
      return;
    }

    let promises = []

    // Load our objects
    for (let list of focusLists) {
      promises.push((async () => {
        let dataList = await loadDataList(list)
        this.focuses.push(...dataList)
      })())
    }
    for (let list of styleLists) {
      promises.push((async () => {
        let dataList = await loadDataList(list)
        this.styles.push(...dataList)
      })())
    }
    for (let list of moodLists) {
      promises.push((async () => {
        let dataList = await loadDataList(list)
        this.moods.push(...dataList)
      })())
    }
    for (let list of wordLists) {
      promises.push((async () => {
        let dataList = await loadDataList(list)
        this.words.push(...dataList)
      })())
    }

    await Promise.all(promises)
  }

  randomFocus() {
    return randomChoice(Object.values(this.focuses))
  }
  randomFocuses(count) {
    shuffleArray(this.focuses)
    return this.focuses.slice(0, count)
  }

  randomStyle() {
    return randomChoice(this.styles)
  }
  randomStyles(count) {
    shuffleArray(this.styles)
    return this.styles.slice(0, count)
  }

  randomMood() {
    return randomChoice(this.moods)
  }
  randomMoods(count) {
    shuffleArray(this.moods)
    return this.moods.slice(0, count)
  }

  randomWord() {
    return randomChoice(this.words)
  }
  randomWords(count) {
    shuffleArray(this.words)
    return this.words.slice(0, count)
  }

  static async getInstance() {
    if (!DataLists._singletonInstance) {
      DataLists._singletonInstance = new DataLists()
      await DataLists._singletonInstance.init()
    }

    return DataLists._singletonInstance
  }
}

export async function generatePrompt(datetime) {
  let dataLists = await DataLists.getInstance()

  let style = dataLists.randomStyle()
  let mood = dataLists.randomMood()

  let focusCount = 12
  let focuses = dataLists.randomFocuses(focusCount)
  let focusString = '- ' + focuses.join('\n- ')

  let wordCount = 12
  let words = dataLists.randomWords(wordCount)
  let wordString = '- ' + words.join('\n- ')

  let formattedDate = datetime.toFormat('LLLL dd yy')

  return `Write a horoscope for all 12 signs for ${formattedDate} inspired by a different focus for each. Ensure you do not include the focus in the response:
${focusString}
The horoscopes should be in the style of ${style} and the mood of ${mood}
Each horoscope should be 1-4 sentences in length.
Your response should include these words at least once:
${wordString}`
}
