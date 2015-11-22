import React, {Component} from 'react';
import ResizeDetector from 'react-resize-detector';

const s = {
  wrapper: {
    display: 'flex',
    height: '100%'
  },
  leftColumn: {
    flexBasis: '200px',
    backgroundColor: '#EAEAEA'

  },
  rightColumn: {
    display: 'flex',
    alignItems: 'center',
    flexBasis: '1000px',
    position: 'relative',
    flexGrow: 1,
    backgroundColor: '#D9DBFF',
    fontSize: '30px',
    textAlign: 'center'
  },
  toggleLeftColumnBtn: {
    alignSelf: 'baseline',
    fontSize: '14px'
  },
  text: {
    flexGrow: 1
  }
}

class App extends Component {
  constructor(props) {
    super();

    this.state = {
      leftPanel: true,
      count: 0
    };
  }

  render() {
    return (
      <div style={s.wrapper}>
        {(() => {
          if (this.state.leftPanel) {
            return <div style={s.leftColumn}></div>
          }
        })()}

        <div style={s.rightColumn}>
          <div style={s.toggleLeftColumnBtn}>
            <button onClick={this._hideLeftPanel.bind(this)}>Toggle left panel</button>
            <br/>or resize window
          </div>

          <div style={s.text}>Main div resized {this.state.count} times</div>

          <ResizeDetector handleWidth handleHeight onResize={this._onResize.bind(this)} />
        </div>

      </div>
    );
  }

  _onResize() {
    this.setState({
      count: this.state.count + 1
    });
  }

  _hideLeftPanel() {
    this.setState({
      leftPanel: !this.state.leftPanel
    });
  }
}

export default App;
