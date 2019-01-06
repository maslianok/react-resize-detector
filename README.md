# Handle element resizes like it's 2019!

Nowadays browsers have started to support element resize handling natively using [ResizeObservers](https://wicg.github.io/ResizeObserver/). We use this feature (with a [polyfill](https://github.com/que-etc/resize-observer-polyfill)) to help you handle element resizes in React.

## Demo

#### [Live demo](http://maslianok.github.io/react-resize-detector/)

Local demo:

```
git clone https://github.com/maslianok/react-resize-detector.git
cd react-resize-detector/examples
npm i && npm start
```

## Installation

```
npm i react-resize-detector
// OR
yarn add react-resize-detector
```

## Examples

#### 1. Callback Pattern

```jsx
import React, { PureComponent } from 'react';
import { render } from 'react-dom';
import ReactResizeDetector from 'react-resize-detector';

class App extends PureComponent {
  render() {
    return (
      <div>
        ...
        <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />
      </div>
    );
  }

  onResize = () => {
    ...
  }
}

render(<App />, document.getElementById('root'));
```

#### 2. Child Function Pattern

```jsx
<ReactResizeDetector handleWidth handleHeight>
  {(width, height) => <div>{`${width}x${height}`}</div>}
</ReactResizeDetector>
```

#### 3. Child Component Pattern

```jsx
const CustomComponent = ({ width, height }) => <div>{`${width}x${height}`}</div>;

// ...

<ReactResizeDetector handleWidth handleHeight>
  <CustomComponent />
</ReactResizeDetector>;
```

#### 4. HOC pattern

```jsx
import { withResizeDetector } from 'react-resize-detector';

const CustomComponent = ({ width, height }) => <div>{`${width}x${height}`}</div>;

export default withResizeDetector(CustomComponent);
```

#### 5. Render prop pattern

```jsx
<ResizeDetector
  handleWidth
  handleHeight
  render={({ width, height }) => (
    <div>
      Width:{width}, Height:{height}
    </div>
  )}
/>
```

## API

| Prop               | Type   | Description                                                                                                                                                                                            | Default     |
| ------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| onResize           | Func   | Function that will be invoked with `width` and `height` arguments                                                                                                                                      | n/a         |
| handleWidth        | Bool   | Trigger `onResize` on width change                                                                                                                                                                     | `false`     |
| handleHeight       | Bool   | Trigger `onResize` on height change                                                                                                                                                                    | `false`     |
| nodeType           | node   | Set resize-detector's node type. You can pass any valid React node: string with node's name or element. Can be useful when you need to handle table's or paragraph's resizes                           | `div`       |
| skipOnMount        | Bool   | Do not trigger onResize when a component mounts                                                                                                                                                        | `false`     |
| resizableElementId | String | Id of the element we want to observe. If none provided, parentElement of the component will be used                                                                                                    | `undefined` |
| refreshMode        | String | Possible values: `throttle` and `debounce` See [lodash docs](https://lodash.com/docs#debounce) for more information. `undefined` - means that callback will be fired as often as ResizeObserver allows | `undefined` |
| refreshRate        | Number | Only makes sense when `refreshMode` is set. Important! It's a numeric prop so set it accordingly, e.g. `refreshRate={500}`                                                                             | `1000`      |
| refreshOptions     | Object | Only makes sense when `refreshMode` is set. An object in shape of { leading: bool, trailing: bool }. Please refer to [lodash's docs](https://lodash.com/docs/4.17.11#throttle) for more info           | `undefined` |

## License

MIT
