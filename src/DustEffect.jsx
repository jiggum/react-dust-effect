/* eslint-disable no-param-reassign */
import React, { useRef, useCallback, useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import { randomWeighted, randomInteger } from './util'
import styles from './DustEffect.scss'

const CANVAS_NUM = 30
const BASE_DURATION = 800
const OUTER_TIMEOUT_DELAY = 70
const INNER_TIMEOUT_DELAY = 110
const START_DELAY = 1000

function weightedRandomDistrib(peak) {
  const prob = []
  const seq = []
  for (let i = 0; i < CANVAS_NUM; i += 1) {
    prob.push((CANVAS_NUM - Math.abs(peak - i)) ** 2)
    seq.push(i)
  }
  return randomWeighted(seq, prob)
}

function createBlankImageData(imageData, imageDataArray) {
  for (let i = 0; i < CANVAS_NUM; i += 1) {
    const arr = new Uint8ClampedArray(imageData.data)
    for (let j = 0; j < arr.length; j += 1) {
      arr[j] = 0
    }
    imageDataArray.push(arr)
  }
}

function putCanvasFromImageData(canvas, imageDataArray, width, height) {
  if (canvas) {
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    context.putImageData(new window.ImageData(imageDataArray, width, height), 0, 0)
  }
}

function ac(canvas, partialCanvas) {
  const imageDataArray = []
  const context = canvas.getContext('2d')
  const { width, height } = canvas
  const imageData = context.getImageData(0, 0, width, height)
  const pixelArr = imageData.data
  createBlankImageData(imageData, imageDataArray)
  for (let i = 0; i < pixelArr.length; i += 4) {
    // find the highest probability canvas the pixel should be in
    const p = Math.floor((i / pixelArr.length) * partialCanvas.length)
    for (let j = 0; j < 1; j += 1) {
      const a = imageDataArray[weightedRandomDistrib(p)]
      for (let k = 0; k < 4; k += 1) {
        a[i + k] = pixelArr[i + k]
      }
    }
  }
  for (let i = 0; i < partialCanvas.length; i += 1) {
    putCanvasFromImageData(partialCanvas[i].current, imageDataArray[i], width, height)
  }
}

function BaseDustEffect({ src, imgClassName, ...props }, ref) {
  const [converted, setConverted] = useState(false)
  const wrapperRef = useRef(null)
  const canvasRef = useRef(null)
  const imageRef = useRef(null)
  const partialCanvas = useRef(Array.from({ length: CANVAS_NUM }, () => React.createRef()))

  const handleStart = useCallback(() => {
    if (imageRef.current) {
      imageRef.current.style.transition = `opacity ${START_DELAY}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
      imageRef.current.style.opacity = '0'
    }
    partialCanvas.current.forEach((pc, i) => {
      setTimeout(() => {
        if (pc.current) {
          pc.current.style.transition = `filter ${BASE_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform ${BASE_DURATION +
            INNER_TIMEOUT_DELAY *
              i}ms cubic-bezier(0.55, 0.085, 0.68, 0.53), opacity ${BASE_DURATION +
            (INNER_TIMEOUT_DELAY - OUTER_TIMEOUT_DELAY) *
              i}ms cubic-bezier(0.755, 0.05, 0.855, 0.06)`
          pc.current.style.filter = `blur(0.8px)`
          pc.current.style.opacity = '0'
          pc.current.style.transform = `rotate(${randomInteger(
            10,
            -10,
          )}deg) translate(${100}px, ${-100}px)`
        }
      }, OUTER_TIMEOUT_DELAY * i + START_DELAY)
    })
  }, [])

  const handleRestore = useCallback(() => {
    if (imageRef.current) {
      imageRef.current.style.transition = `opacity 5s cubic-bezier(0.165, 0.84, 0.44, 1) ${BASE_DURATION +
        (INNER_TIMEOUT_DELAY + OUTER_TIMEOUT_DELAY) * (partialCanvas.current.length - 1)}ms`
      imageRef.current.style.opacity = '1'
    }
    partialCanvas.current.forEach((pc, i) => {
      const j = partialCanvas.current.length - i - 1
      setTimeout(() => {
        if (pc.current) {
          pc.current.style.transition = `filter ${BASE_DURATION}ms cubic-bezier(0.55, 0.085, 0.68, 0.53) ${INNER_TIMEOUT_DELAY *
            (i + j)}ms, transform ${BASE_DURATION +
            INNER_TIMEOUT_DELAY * i}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${INNER_TIMEOUT_DELAY *
            j}ms, opacity ${BASE_DURATION +
            (INNER_TIMEOUT_DELAY - OUTER_TIMEOUT_DELAY) *
              i}ms cubic-bezier(0.23, 1, 0.32, 1) ${OUTER_TIMEOUT_DELAY * i +
            INNER_TIMEOUT_DELAY * j}ms`
          pc.current.style.filter = ''
          pc.current.style.opacity = '1'
          pc.current.style.transform = ''
        }
      }, OUTER_TIMEOUT_DELAY * j)
    })
  }, [])

  const handleImageLoad = useCallback(e => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = e.target.clientWidth
      canvas.height = e.target.clientHeight
      const context = canvas.getContext('2d')
      context.drawImage(e.target, 0, 0, canvas.width, canvas.height)
      ac(canvas, partialCanvas.current)
      setConverted(true)
    }
  }, [])

  useImperativeHandle(ref, () => ({
    start: handleStart,
    restore: handleRestore,
  }))

  /* eslint-disable react/no-array-index-key */
  return (
    <>
      <div className={styles.wrapper} ref={wrapperRef} {...props}>
        <img
          className={imgClassName ? `${styles.image} ${imgClassName}` : styles.image}
          src={src}
          ref={imageRef}
          alt="DustEffectBaseImage"
          onLoad={handleImageLoad}
        />
        {!converted && <canvas ref={canvasRef} className={styles.hide} />}
        {partialCanvas.current.map((partialCanvasRef, i) => (
          <canvas
            className={styles.partialCanvas}
            key={`partialCavans${i}`}
            ref={partialCanvasRef}
          />
        ))}
      </div>
    </>
  )
}

const DustEffect = React.forwardRef(BaseDustEffect)

DustEffect.defaultProps = {
  imgClassName: null,
}

DustEffect.propTypes = {
  src: PropTypes.string.isRequired,
  imgClassName: PropTypes.string,
}

export default DustEffect
