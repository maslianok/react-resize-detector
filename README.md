# Handle element resizes like it's 2018!

Nowadays browsers have started supporting element resize handling natively using [ResizeObservers](https://wicg.github.io/ResizeObserver/). We use this feature (with a [polyfill](https://github.com/que-etc/resize-observer-polyfill)) to help you handle element resizes in React.

#### ⚠️ This change was introduced in v2.0.0

For older implementations please check out this branch [v1.1.0](https://github.com/maslianok/react-resize-detector/tree/4fef26243ae4b3aeb386cca8bd829d3299a4a494)

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

### Callback Pattern
```javascript
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

### Child Function Pattern

```javascript
import React, { PureComponent } from 'react';
import { render } from 'react-dom';
import ReactResizeDetector from 'react-resize-detector';

class App extends PureComponent {
  render() {
    return (
      <div>
        ...
        <ReactResizeDetector handleWidth handleHeight>
          {(width, height) => <div>{`${width}x${height}`}</div>}
        </ReactResizeDetector>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
```

### Child Component Pattern

```javascript
import React, { PureComponent } from 'react';
import { render } from 'react-dom';
import ReactResizeDetector from 'react-resize-detector';

const CustomComponent = ({ width, height }) => (
  <div>{`${width}x${height}`}</div>
);

class App extends PureComponent {
  render() {
    return (
      <div>
        ...
        <ReactResizeDetector handleWidth handleHeight>
          <CustomComponent />
        </ReactResizeDetector>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
```

### It's also possible to have everything at once! ;)

```javascript
import React, { PureComponent } from 'react';
import { render } from 'react-dom';
import ReactResizeDetector from 'react-resize-detector';

const CustomComponent = ({ width, height }) => (<div>{`${width}x${height}`}</div>);

class App extends PureComponent {
  render() {
    return (
      <div>
        ...
        <ReactResizeDetector handleWidth handleHeight onResize={this.onResize}>
          {(width, height) => (<div>{`${width}x${height}`}</div>)}
          <CustomComponent />
        </ReactResizeDetector>
      </div>
    );
  }

  onResize = () => {
    ...
  }
}

render(<App />, document.getElementById('root'));
```

## API

| Prop               | Type   | Description                                                                                                                                                                                            | Default     |
| ------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| onResize           | Func   | Function that will be invoked with `width` and `height` arguments                                                                                                                                      | n/a         |
| handleWidth        | Bool   | Trigger `onResize` on width change                                                                                                                                                                     | `false`     |
| handleHeight       | Bool   | Trigger `onResize` on height change                                                                                                                                                                    | `false`     |
| skipOnMount        | Bool   | Do not trigger onResize when a component mounts                                                                                                                                                        | `false`     |
| resizableElementId | String | Id of the element we want to observe. If none provided, parentElement of the component will be used                                                                                                  | `undefined` |
| refreshMode        | String | Possible values: `throttle` and `debounce` See [lodash docs](https://lodash.com/docs#debounce) for more information. `undefined` - means that callback will be fired as often as ResizeObserver allows | `undefined` |
| refreshRate        | Number | Only makes sense when `refreshMode` is set. Important! It's a numeric prop so set it accordingly, e.g. `refreshRate={500}`                                                                                 | `1000`      |

## License

MIT
