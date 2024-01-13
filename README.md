# Handle element resizes like it's 2024!

<img src="https://img.shields.io/npm/dm/react-resize-detector?style=flat-square"> <img src="https://badgen.net/bundlephobia/minzip/react-resize-detector?style=flat-square"> <img src="https://badgen.net/bundlephobia/tree-shaking/react-resize-detector?style=flat-square">

#### [Live demo](http://maslianok.github.io/react-resize-detector/)

Modern browsers now have native support for detecting element size changes through [ResizeObservers](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver). This library utilizes ResizeObservers to facilitate managing element size changes in React applications.

🐥 Tiny <a href="https://bundlephobia.com/result?p=react-resize-detector" target="__blank">~2kb</a>

🐼 Written in TypeScript

🐠 Used by <a href="https://github.com/maslianok/react-resize-detector/network/dependents" target="__blank">160k repositories</a>

🦄 Produces <a href="https://npmtrends.com/react-resize-detector" target="__blank">100 million downloads annually</a>

No `window.resize` listeners! No timeouts! 

## Is it necessary for you to use this library?

Container queries now work in [all major browsers](https://caniuse.com/css-container-queries). It's very likely you can solve your task using [pure CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries).

<details><summary>Example</summary>

```html
<div class="post">
  <div class="card">
    <h2>Card title</h2>
    <p>Card content</p>
  </div>
</div>
```

```css
.post {
  container-type: inline-size;
}

/* Default heading styles for the card title */
.card h2 {
  font-size: 1em;
}

/* If the container is larger than 700px */
@container (min-width: 700px) {
  .card h2 {
    font-size: 2em;
  }
}
```

</details>

## Installation

```ssh
npm i react-resize-detector
// OR
yarn add react-resize-detector
```

## Example

```jsx
import { useResizeDetector } from 'react-resize-detector';

const CustomComponent = () => {
  const { width, height, ref } = useResizeDetector();
  return <div ref={ref}>{`${width}x${height}`}</div>;
};
```

#### With props

```js
import { useResizeDetector } from 'react-resize-detector';

const CustomComponent = () => {
  const onResize = useCallback(() => {
    // on resize logic
  }, []);

  const { width, height, ref } = useResizeDetector({
    handleHeight: false,
    refreshMode: 'debounce',
    refreshRate: 1000,
    onResize
  });

  return <div ref={ref}>{`${width}x${height}`}</div>;
};
```

#### With custom ref

_It's not advised to use this approach, as dynamically mounting and unmounting the observed element could lead to unexpected behavior._

```js
import { useResizeDetector } from 'react-resize-detector';

const CustomComponent = () => {
  const targetRef = useRef();
  const { width, height } = useResizeDetector({ targetRef });
  return <div ref={targetRef}>{`${width}x${height}`}</div>;
};
```

## API

| Prop            | Type   | Description                                                                                                                                                                                    | Default     |
| --------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| onResize        | Func   | Function that will be invoked with `width` and `height` arguments                                                                                                                              | `undefined` |
| handleWidth     | Bool   | Trigger `onResize` on width change                                                                                                                                                             | `true`      |
| handleHeight    | Bool   | Trigger `onResize` on height change                                                                                                                                                            | `true`      |
| skipOnMount     | Bool   | Do not trigger onResize when a component mounts                                                                                                                                                | `false`     |
| refreshMode     | String | Possible values: `throttle` and `debounce` See [lodash docs](https://lodash.com/docs#debounce) for more information. `undefined` - callback will be fired for every frame                      | `undefined` |
| refreshRate     | Number | Use this in conjunction with `refreshMode`. Important! It's a numeric prop so set it accordingly, e.g. `refreshRate={500}`                                                                     | `1000`      |
| refreshOptions  | Object | Use this in conjunction with `refreshMode`. An object in shape of `{ leading: bool, trailing: bool }`. Please refer to [lodash's docs](https://lodash.com/docs/4.17.11#throttle) for more info | `undefined` |
| observerOptions | Object | These options will be used as a second parameter of [`resizeObserver.observe`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/observe) method.                                | `undefined` |
| targetRef       | Ref    | Use this prop to pass a reference to the element you want to attach resize handlers to. It must be an instance of `React.useRef` or `React.createRef` functions                                | `undefined` |

## Testing with Enzyme and Jest

Thanks to [@Primajin](https://github.com/Primajin) for posting this [snippet](https://github.com/maslianok/react-resize-detector/issues/145)

```jsx
const { ResizeObserver } = window;

beforeEach(() => {
  delete window.ResizeObserver;
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  }));

  wrapper = mount(<MyComponent />);
});

afterEach(() => {
  window.ResizeObserver = ResizeObserver;
  jest.restoreAllMocks();
});

it('should do my test', () => {
  // [...]
});
```

## License

MIT

## ❤️

Show us some love and STAR ⭐ the project if you find it useful
