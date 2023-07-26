import { readFile } from 'node:fs/promises';

/*
Write a horoscope for all 12 months inspired by plants in the style of a romance novel. Each horoscope should be 1-4 sentences in length
Write a horoscope for all 12 months inspired by <object> in the style of a <style>. Each horoscope should be 1-4 sentences in length

Stopped at medicine
*/
// Object types are split by category, to ensure one category isn't overrepresented
let objectLists = {
  "Animals": [ // Animals
    { path: "corpora/data/animals/common.json", jsonElem: "animals" }
  ],
  "Misc": [ // Misc random things
    { path: "corpora/data/foods/menuItems.json", jsonElem: "menuItems" },
    { path: "corpora/data/materials/packaging.json", jsonElem: "packaging" },
  ],
  "PopCulture": [ // Movies/pop culture
    { path: "corpora/data/film-tv/extended-netflix-categories.json", jsonElem: "data" },
    { path: "corpora/data/film-tv/popular-movies.json", jsonElem: "popular-movies" },
    { path: "corpora/data/humans/famousDuos.json", jsonElem: "famousDuos" },
  ],
  "Geology": [ // Geology
    { path: "corpora/data/geography/anthropogenic_features.json", jsonElem: "entries" },
    { path: "corpora/data/geography/geographic_features.json", jsonElem: "entries" },
    { path: "corpora/data/geography/environmental_hazards.json", jsonElem: "entries" },
  ],
  "Concepts and stuff": [ // Concepts and stuff
    { path: "corpora/data/humans/human_universals.json", jsonElem: "universals" },
  ]
}

let styleLists = [
  { path: "corpora/data/books/academic_subjects.json", jsonElem: "subjects" },
  { path: "corpora/data/art/isms.json", jsonElem: "isms" },
  { path: "corpora/data/governments/governmentForms.json", jsonElem: "governmentForms" },
  { path: "corpora/data/humans/moods.json", jsonElem: "moods" },
  { path: "corpora/data/humans/occupations.json", jsonElem: "occupations" },
]

let additiveLists = [
  { path: "corpora/data/foods/verbs.json", jsonElem: "verbs" },
  { path: "corpora/data/humans/descriptions.json", jsonElem: "descriptions" },
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

async function loadDataList(path, jsonElem) {
  let data = JSON.parse(await readFile(path))
  return data[jsonElem]
}

class DataLists {
  objects = {}
  styles = []
  additives = []
  hasInit = false

  async init() {
    if (this.hasInit) {
      return;
    }

    let promises = []

    // Load our objects
    for (let category of Object.keys(objectLists)) {
      let categoryLists = objectLists[category]
      this.objects[category] = []

      for (let categoryFile of categoryLists) {
        promises.push((async () => {
          let dataList = await loadDataList(categoryFile.path, categoryFile.jsonElem)
          this.objects[category].push(...dataList)
        })())
      }
    }

    for (let styleFile of styleLists) {
      promises.push((async () => {
        let dataList = await loadDataList(styleFile.path, styleFile.jsonElem)
        this.styles.push(dataList)
      })())
    }

    for (let additiveList of additiveLists) {
      promises.push((async () => {
        let dataList = await loadDataList(additiveList.path, additiveList.jsonElem)
        this.additives.push(...dataList)
      })())
    }

    await Promise.all(promises)
  }

  randomObject(includeAdditive) {
    let objectList = randomChoice(Object.values(this.objects))
    let obj = randomChoice(objectList)

    if (includeAdditive) {
      obj = this.randomAdditive() + " " + obj
    }

    return obj
  }
  randomObjects(includeAdditive, count) {
    let objs = []
    for (let i = 0; i < count; i++) {
      objs.push(this.randomObject(includeAdditive))
    }
    return objs
  }

  randomStyle() {
    let styleList = randomChoice(this.styles)
    return randomChoice(styleList)
  }
  randomStyles(count) {
    let styles = []
    for (let i = 0; i < count; i++) {
      styles.push(this.randomStyle())
    }
    return styles
  }

  randomAdditive() {
    return randomChoice(this.additives)
  }
  randomAdditives(count) {
    let additives = []
    for (let i = 0; i < count; i++) {
      additives.push(this.randomAdditive())
    }
    return additives
  }
}


async function generatePrompt() {
  let dataLists = new DataLists()
  await dataLists.init()

  let style = dataLists.randomAdditive() + " " + dataLists.randomStyle()

  let objectCount = 4
  let objects = dataLists.randomObjects(true, objectCount)
  let objectString = '- ' + objects.join('\n- ')

  return `Write a horoscope for all 12 signs using a different theme for each selecting one of these themes:
${objectString}
Do not repeat the theme verbatim in the response.
The horoscopes should be in the style of ${style}. Do not use "${style}" verbatim in your response.
Each horoscope should be 1-4 sentences in length`
}

export { generatePrompt }

