# React resize detector

### Your feedback is highly appreciated! 

Please, file an issue if something went wrong or let me know via Twitter @maslianok

---

## Event-based Element Resize Detection
This implementation does NOT use an internal timer to detect size changes (as most implementations do). It uses scroll events.
Inspired by this article [Cross-Browser, Event-based, Element Resize Detection](http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/) written by [Back Alley Coder](http://www.backalleycoder.com/)

## Demo
#### [Live demo](http://maslianok.github.io/react-resize-detector/)

Local demo:
```
git clone https://github.com/maslianok/react-resize-detector.git
cd react-resize-detector/example
npm i && npm start
```

## Installation
`npm i react-resize-detector`

## Running the tests
`npm t`

## Example
```javascript
import React, {Component} from 'react';
import {render} from 'react-dom';
import ReactResizeDetector from 'react-resize-detector';

class App extends Component {
  render() {
    return (
      <div>
        ...
        <ReactResizeDetector handleWidth handleHeight onResize={this._onResize} />
      </div>
    );
  }

  _onResize = () => {
    ...
  }
}

render(<App />, document.getElementById('root'));

```

## API
#### handleWidth
(Bool) Trigger `onResize` on width change

#### handleHeight
(Bool) Trigger `onResize` on height change

#### onResize
(Func) Function that will be invoked with `width` and `height` arguments. When handling only one of dimensions, other argument will be `undefined`.

## License
MIT
