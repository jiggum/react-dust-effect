import React, { useRef, useCallback, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  randomInteger,
  createBlankImageData,
  putCanvasFromImageData,
  weightedRandomDistrib,
  updateStyle,
} from './util'
import styles from './DustEffect.scss'

const IMAGE_CHANNEL = 4 // r,g,b,a

const defaultDistribution = (hPos, vPos, canvasIndex, canvasNum) =>
  (canvasNum - Math.abs(vPos * canvasNum - canvasIndex)) ** 3

const defaultOption = {
  canvasNum: 25,
  baseDuration: 800,
  outerTimeoutDelay: 70,
  innerTimeoutDelay: 110,
  translateX: 100,
  translateY: -100,
  rotateMin: -15,
  rotateMax: 15,
  blur: 1,
  distributionFunc: defaultDistribution,
}

function updatePartialCanvas(canvas, partialCanvas, distribution) {
  const canvasNum = partialCanvas.length
  const context = canvas.getContext('2d')
  const { width, height } = canvas
  const imageData = context.getImageData(0, 0, width, height)
  const pixelArr = imageData.data
  const imageDataArray = createBlankImageData(imageData, canvasNum)
  for (let i = 0; i < pixelArr.length; i += IMAGE_CHANNEL) {
    // find the highest probability canvas the pixel should be in
    const pixelPos = Math.floor(i / IMAGE_CHANNEL)
    const hPos = ((pixelPos % width) + 1) / width
    const vPos = (Math.floor(pixelPos / width) + 1) / height
    const targetCanvas = imageDataArray[weightedRandomDistrib(hPos, vPos, canvasNum, distribution)]
    for (let k = 0; k < IMAGE_CHANNEL; k += 1) {
      targetCanvas[i + k] = pixelArr[i + k]
    }
  }
  partialCanvas.forEach((partialCanvasRef, i) => {
    putCanvasFromImageData(partialCanvasRef.current, imageDataArray[i], width, height)
  })
}

function DustEffect({ src, show, option, imgProps, ...props }) {
  option = {
    ...defaultOption,
    ...option,
  }
  const [converted, setConverted] = useState(false)
  const wrapperRef = useRef(null)
  const canvasRef = useRef(null)
  const imageRef = useRef(null)
  const partialCanvas = useRef(Array.from({ length: option.canvasNum }, () => React.createRef()))

  const handleStart = useCallback(() => {
    if (imageRef.current) {
      updateStyle(imageRef.current, {
        transition: [
          `opacity ${option.baseDuration}ms cubic-bezier(0.55, 0.085, 0.68, 0.53)`,
          `filter ${option.baseDuration}ms cubic-bezier(0.55, 0.085, 0.68, 0.53)`,
        ],
        filter: `blur(${option.blur}px)`,
        opacity: '0',
        pointerEvents: 'none',
      })
    }
    partialCanvas.current.forEach((pc, i) => {
      const delay = option.outerTimeoutDelay * i
      const j = option.canvasNum - i - 1

      if (pc.current) {
        updateStyle(pc.current, {
          transition: [
            `filter ${option.baseDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
            `transform ${option.baseDuration +
              option.innerTimeoutDelay * i}ms cubic-bezier(0.55, 0.085, 0.68, 0.53) ${delay}ms`,
            `opacity ${option.baseDuration +
              option.innerTimeoutDelay * i}ms cubic-bezier(0.755, 0.05, 0.855, 0.06) ${delay}ms`,
          ],
          filter: `blur(${option.blur}px)`,
          opacity: '0',
          transform: `rotate(${randomInteger(
            option.rotateMax * (j / (option.canvasNum - 1)) ** 0.5,
            option.rotateMin * (j / (option.canvasNum - 1)) ** 0.5,
          )}deg) translate(${option.translateX}px, ${option.translateY}px)`,
        })
      }
    })
  }, [
    option.baseDuration,
    option.innerTimeoutDelay,
    option.outerTimeoutDelay,
    option.innerTimeoutDelay,
  ])

  const handleRestore = useCallback(() => {
    if (imageRef.current) {
      const delay = option.innerTimeoutDelay * (option.canvasNum - 1)
      updateStyle(imageRef.current, {
        transition: [
          `opacity ${option.baseDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
          `filter ${option.baseDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
        ],
        filter: '',
        opacity: '1',
        pointerEvents: 'auto',
      })
    }
    partialCanvas.current.forEach((pc, i) => {
      const j = option.canvasNum - i - 1
      if (pc.current) {
        updateStyle(pc.current, {
          transition: [
            `filter ${
              option.baseDuration
            }ms cubic-bezier(0.55, 0.085, 0.68, 0.53) ${option.innerTimeoutDelay * j +
              (option.innerTimeoutDelay - option.outerTimeoutDelay) * i}ms`,
            `transform ${option.baseDuration +
              (option.innerTimeoutDelay - option.outerTimeoutDelay) *
                i}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${option.innerTimeoutDelay * j}ms`,
            `opacity ${option.baseDuration +
              (option.innerTimeoutDelay - option.outerTimeoutDelay) *
                i}ms cubic-bezier(0.23, 1, 0.32, 1) ${option.innerTimeoutDelay * j}ms`,
          ],
          filter: '',
          opacity: '1',
          transform: '',
        })
      }
    })
  }, [
    option.baseDuration,
    option.innerTimeoutDelay,
    option.outerTimeoutDelay,
    option.innerTimeoutDelay,
  ])

  const handleImageLoad = useCallback(
    e => {
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = e.target.clientWidth
        canvas.height = e.target.clientHeight
        const context = canvas.getContext('2d')
        context.drawImage(e.target, 0, 0, canvas.width, canvas.height)
        updatePartialCanvas(canvas, partialCanvas.current, option.distributionFunc)
        setConverted(true)
      }
      if (imgProps.onLoad) imgProps.onLoad(e)
    },
    [imgProps.onLoad],
  )

  useEffect(() => {
    if (converted) {
      if (!show) handleStart()
      else handleRestore()
    }
  }, [show])

  /* eslint-disable react/no-array-index-key */
  return (
    <>
      <div className={styles.wrapper} ref={wrapperRef} {...props}>
        <img
          src={src}
          crossOrigin="Anonymous"
          ref={imageRef}
          alt="DustEffectBaseImage"
          {...imgProps}
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

DustEffect.defaultProps = {
  imgProps: {},
  option: defaultOption,
}

DustEffect.propTypes = {
  show: PropTypes.bool.isRequired,
  src: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  imgProps: PropTypes.object,
  option: PropTypes.shape({
    canvasNum: PropTypes.number,
    baseDuration: PropTypes.number,
    outerTimeoutDelay: PropTypes.number,
    innerTimeoutDelay: PropTypes.number,
    translateX: PropTypes.number,
    translateY: PropTypes.number,
    rotateMin: PropTypes.number,
    rotateMax: PropTypes.number,
    blur: PropTypes.number,
    distributionFunc: PropTypes.func,
  }),
}

export default DustEffect
