export function randomWeighted(arr, weights) {
  const totalWeight = weights.reduce((acc, weight) => acc + weight, 0)

  const accWeights = weights.reduce(
    (acc, weight) => acc.concat([(acc.length > 0 ? acc[acc.length - 1] : 0) + weight]),
    [],
  )
  const threshold = Math.random() * totalWeight
  let total = 0
  for (let i = 0; i < accWeights.length; i += 1) {
    total += accWeights[i]
    if (total > threshold) return arr[i]
  }

  throw new RangeError(`Random value:${threshold} is over the total Weight:${arr[arr.length - 1]}`)
}

export function randomInteger(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
