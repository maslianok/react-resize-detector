# Handle element resizes like it's 2018!

Nowadays browsers start supporting element resize handling natively using [ResizeObserver](https://wicg.github.io/ResizeObserver/). And we use this feature (with [polyfill](resize-observer-polyfill)) to help you handle element resizes in React.

<details>
  <summary>*This change intriduced in v.2.0.0. Versions < 2.0.0 use the different approach to handle element resizes*</summary><p>
```
This implementation does NOT use an internal timer to detect size changes (as most implementations do). It uses scroll events.
Inspired by this article [Cross-Browser, Event-based, Element Resize Detection](http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/) written by [Back Alley Coder](http://www.backalleycoder.com/)
```
</p></details>

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
