# react-dust-effect

Image dust effect for react.

[![npm](https://img.shields.io/npm/v/react-dust-effect.svg)](https://www.npmjs.com/package/react-dust-effect)
[![Build Status](https://api.travis-ci.com/jiggum/react-dust-effect.svg?branch=master)](https://travis-ci.com/jiggum/react-dust-effect)
[![min](https://img.shields.io/bundlephobia/min/react-dust-effect.svg)](https://www.npmjs.com/package/react-dust-effect)
[![minzip](https://img.shields.io/bundlephobia/minzip/react-dust-effect.svg)](https://www.npmjs.com/package/react-dust-effect)

[![effect start](http://thanos.jiggum.s3.amazonaws.com/assets/dust-effect-start.gif)]()
[![effect restore](http://thanos.jiggum.s3.amazonaws.com/assets/dust-effect-restore.gif)]()

## Installation

yarn:
```bash
yarn add react-dust-effect
```

npm:
```bash
npm install --save react-dust-effect
```

## Usage

```js
import DustEffect from 'react-dust-effect'
...
const dustEffectRef = useRef()
...
const handleEffectStart = () => {
  if (dustEffect.current) dustEffect.current.start()
}

const handleEffectStart = () => {
  if (dustEffect.current) dustEffect.current.restore()
}
...
<DustEffect src="smaple/image.png" ref={dustEffectRef} />
...
```

## Props

#### src: (required, string)
- Target Image's src

#### imgClassName: (optional, string, default: null)
- Inner <img> element's class name

## Ref
#### start(): void
- Start dust effect's animation 

#### restore(): void
- Restore dust effect's animation
