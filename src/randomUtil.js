export function shuffleArray(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
}

export function randomChoice(arr) {
  var i = Math.floor(Math.random() * arr.length)
  return arr[i]
}