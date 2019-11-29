# React Dust Effect

Convert your React components into dust!

[![npm](https://img.shields.io/npm/v/react-dust-effect.svg)](https://www.npmjs.com/package/react-dust-effect)
[![Build Status](https://api.travis-ci.com/jiggum/react-dust-effect.svg?branch=master)](https://travis-ci.com/jiggum/react-dust-effect)
[![min](https://img.shields.io/bundlephobia/min/react-dust-effect.svg)](https://www.npmjs.com/package/react-dust-effect)
[![minzip](https://img.shields.io/bundlephobia/minzip/react-dust-effect.svg)](https://www.npmjs.com/package/react-dust-effect)

[![effect start](http://thanos.jiggum.s3.amazonaws.com/assets/dust-effect-start.gif)]()
[![effect restore](http://thanos.jiggum.s3.amazonaws.com/assets/dust-effect-restore.gif)]()

## Installation

#### Yarn
```bash
yarn add react-dust-effect
```

#### NPM
```bash
npm install --save react-dust-effect
```

## Usage
```js
import React, { useState } from 'react';
import DustEffect from 'react-dust-effect'

function App() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <DustEffect src="smaple/image.png" show={show} />
      <button onClick={() => setShow(!show)}>Effect!️</button>
    </div>
  );
}
```

## Props

#### src: (required, string)
- Target Image's src

#### show: (required, boolean)
- Showing state. Effect will trigger when this prop is changed

#### imgProps: (optional, object, default: {}})
- Inner img element's props

#### option: (optional, object, default: {})

##### option.canvasNum: (number, default: 25)

##### option.baseDuration: (number, default: 800)

##### option.outerTimeoutDelay: (number, default: 70)

##### option.innerTimeoutDelay: (number, default: 110)

##### option.translateX: (number, default: 100)

##### option.translateY: (number, default: -100)

##### option.rotateMin: (number, default: -15)

##### option.rotateMax: (number, default: 15)

##### option.blur: (number, default: 1)

##### option.distributionFunc: (hPos: number, vPos: number, canvasIndex: number, canvasNum: number) => number,

## Reference
[redstapler](https://redstapler.co/thanos-snap-effect-javascript-tutorial/)
