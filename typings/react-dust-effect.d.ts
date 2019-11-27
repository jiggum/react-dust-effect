import React from 'react'

export default function DustEffect(
  props: DustEffectProps & React.RefAttributes<DustEffectRef>,
): JSX.Element

interface DustEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string
}

export interface DustEffectRef {
  start(): void
  restore(): void
}
