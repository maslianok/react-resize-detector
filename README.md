#React resize detector

##Event-based Element Resize Detection
This implementation does NOT use an internal timer to detect size changes (as most implementations do). It uses scroll events.
Inspired by this article [Cross-Browser, Event-based, Element Resize Detection](http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/) written by [Back Alley Coder](http://www.backalleycoder.com/)

##Demo
//todo

##Installation
`npm install react-resize-detector`

##Example
```javascript
import React, {Component} from 'react';
import {render} from 'react-dom';
import ReactResizeDetector from 'react-resize-detector';

class App extends Component {
  render() {
    return (
      <div>
        ...
        <ReactResizeDetector handleWidth handleHeight onResize={this._onResize.bind(this)} />
      </div>
    );
  }

  _onResize() {
    this.setState({
      count: this.state.count + 1
    });
  }
}

render(<App />, document.getElementById('root'));

```

##API
####handleWidth
(Bool) Trigger `onResize` on width change

####handleHeight
(Bool) Trigger `onResize` on height change

####onResize
Function that will be invoked

## License
MIT
