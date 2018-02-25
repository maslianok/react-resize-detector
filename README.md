# Handle element resizes like it's 2018!

Nowadays browsers start supporting element resize handling natively using [ResizeObserver](https://wicg.github.io/ResizeObserver/). And we use this feature (with [polyfill](resize-observer-polyfill)) to help you handle element resizes in React.

#### ⚠️ This change intriduced in v.2.0.0

For older implementations please checkout this branch [v.1.1.0](https://github.com/maslianok/react-resize-detector/tree/4fef26243ae4b3aeb386cca8bd829d3299a4a494)

## Demo

#### [Live demo](http://maslianok.github.io/react-resize-detector/)

Local demo:

```
git clone https://github.com/maslianok/react-resize-detector.git
cd react-resize-detector/example
npm i && npm start
```

## Installation

```
npm i react-resize-detector
// OR
yarn add react-resize-detector
```

## Example

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

## API

#### onResize

(Func) Function that will be invoked with `width` and `height` arguments.

#### handleWidth

(Bool) Trigger `onResize` on width change. Default: `false`.

#### handleHeight

(Bool) Trigger `onResize` on height change. Default: `false`.

#### skipOnMount

(Bool) Do not trigger onResize when a component mounts. Default: `false`.

## License

MIT
