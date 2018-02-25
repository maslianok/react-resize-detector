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
    alignItems: 'center',
    flexBasis: '1000px',
    position: 'relative',
    flexGrow: 1,
    backgroundColor: '#D9DBFF',
    fontSize: '30px',
    textAlign: 'center',
  },
  toggleLeftColumnBtn: {
    alignSelf: 'baseline',
    fontSize: '14px',
  },
  text: {
    flexGrow: 1,
  },
};

class App extends Component {
  state = {
    leftPanel: true,
    count: 0,
  };

  componentDidMount() {
    setTimeout(() => {
      console.log('CHANGE!');
      this.setState({
        handleWidth: true,
      });
    }, 10000);
  }

  onResize = () => this.setState({ count: this.state.count + 1 });

  hideLeftPanel = () => this.setState({ leftPanel: !this.state.leftPanel });

  render() {
    return (
      <div style={s.wrapper}>
        {this.state.leftPanel && <div style={s.leftColumn} />}
        <div style={s.rightColumn}>
          <div style={s.toggleLeftColumnBtn}>
            <button onClick={this.hideLeftPanel}>Toggle left panel</button>
            <br />or resize window
          </div>

          <div style={s.text}>Main div resized {this.state.count} times</div>

          <ResizeDetector handleWidth={this.state.handleWidth} skipOnMount onResize={this.onResize} />
        </div>
      </div>
    );
  }
}

export default App;
