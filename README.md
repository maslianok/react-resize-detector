# Handle element resizes like it's 2021!

<img src="https://img.shields.io/npm/dy/react-resize-detector?style=flat-square"> <img src="https://img.shields.io/npm/dm/react-resize-detector?style=flat-square"> <img src="https://badgen.net/bundlephobia/minzip/react-resize-detector?style=flat-square"> <img src="https://badgen.net/bundlephobia/tree-shaking/react-resize-detector?style=flat-square">

#### [Live demo](http://maslianok.github.io/react-resize-detector/)

Nowadays browsers support element resize handling natively using [ResizeObservers](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver). The library uses these observers to help you handle element resizes in React.

🐥 Tiny [~3kb](https://bundlephobia.com/result?p=react-resize-detector)

🐼 Written in TypeScript

🦁 Supports Function and Class Components

🐠 Trusted by [many different projects](https://www.npmjs.com/browse/depended/react-resize-detector)

No `window.resize` listeners! No timeouts! No 👑 viruses! :)

<i>TypeScript-lovers notice: starting from v6.0.0 you may safely remove `@types/react-resize-detector` from you deps list.</i>

## Installation

```ssh
npm i react-resize-detector
// OR
yarn add react-resize-detector
```

and

```jsx
import ResizeObserver from 'react-resize-detector';

// or, in case you need IE support and ready to load extra kilobytes
import ResizeObserver from 'react-resize-detector/withPolyfill';
```

## Examples

Starting from v6.0.0 there are 3 recommended ways to work with `resize-detector` library:

#### 1. React hook (new in v6.0.0)

```jsx
import { useResizeDetector } from 'react-resize-detector';

const CustomComponent = () => {
  const { width, height, ref } = useResizeDetector();
  return <div ref={ref}>{`${width}x${height}`}</div>;
};
```

you can pass props as an object to useResizeDetector. For example, `useResizeDetector({ refreshMode: 'debounce', refreshRate: 1000 })`

#### 2. HOC pattern

```jsx
import { withResizeDetector } from 'react-resize-detector';

const CustomComponent = ({ width, height }) => <div>{`${width}x${height}`}</div>;

export default withResizeDetector(CustomComponent);
```

#### 3. Child Function Pattern

```jsx
import ReactResizeDetector from 'react-resize-detector';

// ...

<ReactResizeDetector handleWidth handleHeight>
  {({ width, height }) => <div>{`${width}x${height}`}</div>}
</ReactResizeDetector>;
```

<details><summary>Full example (Class Component)</summary>

```jsx
import React, { Component } from 'react';
import { withResizeDetector } from 'react-resize-detector';

const containerStyles = {
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

class AdaptiveComponent extends Component {
  state = {
    color: 'red'
  };

  componentDidUpdate(prevProps) {
    const { width } = this.props;

    if (width !== prevProps.width) {
      this.setState({
        color: width > 500 ? 'coral' : 'aqua'
      });
    }
  }

  render() {
    const { width, height } = this.props;
    const { color } = this.state;
    return <div style={{ backgroundColor: color, ...containerStyles }}>{`${width}x${height}`}</div>;
  }
}

const AdaptiveWithDetector = withResizeDetector(AdaptiveComponent);

const App = () => {
  return (
    <div>
      <p>The rectangle changes color based on its width</p>
      <AdaptiveWithDetector />
    </div>
  );
};

export default App;
```

</details>

<details><summary>Full example (Functional Component)</summary>

```jsx
import React, { useState, useEffect } from 'react';
import { withResizeDetector } from 'react-resize-detector';

const containerStyles = {
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const AdaptiveComponent = ({ width, height }) => {
  const [color, setColor] = useState('red');

  useEffect(() => {
    setColor(width > 500 ? 'coral' : 'aqua');
  }, [width]);

  return <div style={{ backgroundColor: color, ...containerStyles }}>{`${width}x${height}`}</div>;
};

const AdaptiveWithDetector = withResizeDetector(AdaptiveComponent);

const App = () => {
  return (
    <div>
      <p>The rectangle changes color based on its width</p>
      <AdaptiveWithDetector />
    </div>
  );
};

export default App;
```

</details>

<br/>

We still support [other ways](https://github.com/maslianok/react-resize-detector/tree/v4.2.1#examples) to work with this library, but in the future consider using the ones described above. Please let me know if the examples above don't fit your needs.

## Refs

The library is trying to be smart and to not add any extra DOM elements to not break your layouts. That's why we use [`findDOMNode`](https://reactjs.org/docs/react-dom.html#finddomnode) method to find and attach listeners to the existing DOM elements. Unfortunately, this method has been deprecated and throws a warning in StrictMode.

For those who wants to avoid this warning we are introducing an additional property `targetRef`. You have to set this prop as a `ref` of your target DOM element and the library will use this reference instead of serching the DOM element with help of `findDOMNode`

<details><summary>HOC pattern example</summary>

```jsx
import { withResizeDetector } from 'react-resize-detector';

const CustomComponent = ({ width, height, targetRef }) => <div ref={targetRef}>{`${width}x${height}`}</div>;

export default withResizeDetector(CustomComponent);
```

</details>

<details><summary>Child Function Pattern example</summary>

```jsx
import ReactResizeDetector from 'react-resize-detector';

// ...

<ReactResizeDetector handleWidth handleHeight>
  {({ width, height, targetRef }) => <div ref={targetRef}>{`${width}x${height}`}</div>}
</ReactResizeDetector>;
```

</details>

## API

| Prop           | Type   | Description                                                                                                                                                                                    | Default     |
| -------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| onResize       | Func   | Function that will be invoked with `width` and `height` arguments                                                                                                                              | `undefined` |
| handleWidth    | Bool   | Trigger `onResize` on width change                                                                                                                                                             | `true`      |
| handleHeight   | Bool   | Trigger `onResize` on height change                                                                                                                                                            | `true`      |
| skipOnMount    | Bool   | Do not trigger onResize when a component mounts                                                                                                                                                | `false`     |
| refreshMode    | String | Possible values: `throttle` and `debounce` See [lodash docs](https://lodash.com/docs#debounce) for more information. `undefined` - callback will be fired for every frame                      | `undefined` |
| refreshRate    | Number | Use this in conjunction with `refreshMode`. Important! It's a numeric prop so set it accordingly, e.g. `refreshRate={500}`                                                                     | `1000`      |
| refreshOptions | Object | Use this in conjunction with `refreshMode`. An object in shape of `{ leading: bool, trailing: bool }`. Please refer to [lodash's docs](https://lodash.com/docs/4.17.11#throttle) for more info | `undefined` |
| targetRef      | Ref    | Use this prop to pass a reference to the element you want to attach resize handlers to. It must be an instance of `React.useRef` or `React.createRef` functions                                | `undefined` |

## License

MIT

## ❤️

Show us some love and STAR ⭐ the project if you find it useful
