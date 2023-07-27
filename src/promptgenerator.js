import { readFile } from 'node:fs/promises';

/*
Write a horoscope for all 12 months inspired by plants in the style of a romance novel. Each horoscope should be 1-4 sentences in length
Write a horoscope for all 12 months inspired by <object> in the style of a <style>. Each horoscope should be 1-4 sentences in length

Stopped at medicine
*/
let focusLists = [
  "src/data/focuses.json",
  "src/data/goofyFocuses.json",
]

let moodLists = [
  "src/data/moods.json",
  "src/data/emotions.json",
]

let styleLists = [
  "src/data/customstyles.json",
  "src/data/styles.json"
]

let wordLists = [
  "src/data/misc_words.json"
]

function shuffleArray(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
}

function randomChoice(arr) {
  var i = Math.floor(Math.random() * arr.length)
  return arr[i]
}

async function loadDataList(path) {
  let data = JSON.parse(await readFile(path))
  return data
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

export async function generatePrompt() {
  let dataLists = await DataLists.getInstance()

  let style = dataLists.randomStyle()
  let mood = dataLists.randomMood()

  let focusCount = 12
  let focuses = dataLists.randomFocuses(focusCount)
  let focusString = '- ' + focuses.join('\n- ')

  let wordCount = 12
  let words = dataLists.randomWords(wordCount)
  let wordString = '- ' + words.join('\n- ')

  return `Write a horoscope for all 12 signs for July 26th 2023 inspired by a different focus for each. Ensure you do not include the focus in the response::
${focusString}
The horoscopes should be in the style of ${style} and the mood of ${mood}
Each horoscope should be 1-4 sentences in length.
Your response should include these words at least once:
${wordString}`
}
