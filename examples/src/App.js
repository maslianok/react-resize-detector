import React, { Component } from 'react';
import ResizeDetector from 'react-resize-detector';

const s = {
  wrapper: {
    display: 'flex',
    height: '100vh'
  },
  leftColumn: {
    flexBasis: '200px',
    backgroundColor: '#EAEAEA'
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
    textAlign: 'center'
  },
  toggleLeftColumnBtn: {
    position: 'absolute',
    top: '5px',
    left: '5px',
    fontSize: '14px'
  },
  dimensions: {
    fontSize: '18px'
  }
};

class App extends Component {
  constructor() {
    super();
    this.parentRef = React.createRef();
  }

  state = {
    leftPanel: true,
    mainFrame: true,
    count: 0,
    width: undefined,
    height: undefined
  };

  onResize = (width, height) => this.setState(prevState => ({ count: prevState.count + 1, width, height }));

  hideLeftPanel = () => this.setState(prevState => ({ leftPanel: !prevState.leftPanel }));

  toggleMainFrame = () => this.setState(prevState => ({ mainFrame: !prevState.mainFrame }));

  render() {
    const { count, width, height, mainFrame, leftPanel } = this.state;

    return (
      <div style={s.wrapper}>
        {leftPanel && (
          <div style={s.leftColumn}>
            <button onClick={this.toggleMainFrame} type="button">
              Toggle main frame
            </button>
          </div>
        )}
        {mainFrame && (
          <div style={s.rightColumn} ref={this.parentRef}>
            <div style={s.toggleLeftColumnBtn}>
              <button onClick={this.hideLeftPanel} type="button">
                Toggle left panel
              </button>
              <p>or resize window.</p>
            </div>

            <div>{`Main div resized ${count} times`}</div>
            <div style={s.dimensions}>{`Width: ${width}, Height: ${height}`}</div>

            <ResizeDetector handleWidth handleHeight onResize={this.onResize} targetDomEl={this.parentRef.current} />
          </div>
        )}
      </div>
    );
  }
}

export default App;
