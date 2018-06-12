import React, { Component } from 'react';
import ResizeDetector from 'react-resize-detector';

const s = {
  wrapper: {
    display: 'flex',
    height: '100%',
  },
  leftColumn: {
    flexBasis: '200px',
    backgroundColor: '#EAEAEA',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexBasis: '1000px',
    position: 'relative',
    flexGrow: 1,
    backgroundColor: '#D9DBFF',
    fontSize: '30px',
    textAlign: 'center',
  },
  toggleLeftColumnBtn: {
    position: 'absolute',
    top: '5px',
    left: '5px',
    fontSize: '14px',
  },
  dimensions: {
    fontSize: '18px',
  },
};

class App extends Component {
  state = {
    leftPanel: true,
    count: 0,
    width: undefined,
    height: undefined,
  };

  onResize = (width, height) => this.setState({ count: this.state.count + 1, width, height });

  hideLeftPanel = () => this.setState({ leftPanel: !this.state.leftPanel });

  render() {
    const { count, width, height } = this.state;
    return (
      <div style={s.wrapper}>
        {this.state.leftPanel && <div style={s.leftColumn} />}
        <div style={s.rightColumn}>
          <div style={s.toggleLeftColumnBtn}>
            <button onClick={this.hideLeftPanel}>Toggle left panel</button>
            <br />or resize window.
          </div>

          <div>Main div resized {count} times</div>
          <div style={s.dimensions}>
            Width: {width}, Height: {height}
          </div>

          <ResizeDetector handleWidth handleHeight onResize={this.onResize} />
        </div>
      </div>
    );
  }
}

export default App;
