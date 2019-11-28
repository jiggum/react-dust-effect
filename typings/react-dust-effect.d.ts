import React from 'react'

export default function DustEffect(props: DustEffectProps): JSX.Element

interface DustEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  show: boolean
  src: string
  imgClassName?: string
  option?: {
    canvasNum?: number,
    baseDuration?: number,
    outerTimeoutDelay?: number,
    innerTimeoutDelay?: number,
    translateX?: number,
    translateY?: number,
    rotateMin?: number,
    rotateMax?: number,
    blur?: number,
    distributionFunc?: (hPos: number, vPos: number, canvasIndex: number, canvasNum: number) => number,
  }
}
