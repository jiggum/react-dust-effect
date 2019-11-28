export function randomWeighted(weights) {
  const totalWeight = weights.reduce((acc, weight) => acc + weight, 0)

  const threshold = Math.random() * totalWeight
  let total = 0
  for (let i = 0; i < weights.length; i += 1) {
    total += weights[i]
    if (total > threshold) return i
  }

  throw new RangeError(`Random value:${threshold} is over the total Weight:${total}`)
}

export function randomInteger(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function createBlankImageData(imageData, canvasNum) {
  const imageDataArray = []
  for (let i = 0; i < canvasNum; i += 1) {
    const arr = new Uint8ClampedArray(imageData.data)
    for (let j = 0; j < arr.length; j += 1) {
      arr[j] = 0
    }
    imageDataArray.push(arr)
  }
  return imageDataArray
}

export function putCanvasFromImageData(canvas, imageDataArray, width, height) {
  if (canvas) {
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    context.putImageData(new window.ImageData(imageDataArray, width, height), 0, 0)
  }
}

export function weightedRandomDistrib(hPos, vPos, canvasNum, destribution) {
  const prob = Array.from(Array(canvasNum).keys()).map(canvasIndex =>
    destribution(hPos, vPos, canvasIndex, canvasNum),
  )
  return randomWeighted(prob)
}

export function updateStyle(elem, style) {
  Object.entries(style).forEach(([attr, value]) => {
    if (Array.isArray(value)) elem.style[attr] = value.join(', ')
    else elem.style[attr] = value
  })
}
