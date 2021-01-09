import React, { useEffect, useState } from 'react';
import { useResizeDetector, withResizeDetector } from './build';

const s = {
  wrapper: {
    display: 'flex',
    height: '100vh'
  },
  leftColumn: {
    display: 'flex',
    width: '200px',
    backgroundColor: 'aqua',
    padding: '10px',
    boxSizing: 'border-box'
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexGrow: 1,
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

const MainFrame = ({ onHideLeftPanel }) => {
  const [count, setCount] = useState(0);
  const { width, height, ref } = useResizeDetector();
  // { refreshMode: 'debounce', refreshRate: 2000, skipOnMount: true }

  useEffect(() => {
    if (width || height) {
      setCount(count => count + 1);
    }
  }, [width, height]);

  return (
    <div style={s.rightColumn} ref={ref}>
      <div style={s.toggleLeftColumnBtn}>
        <button onClick={onHideLeftPanel} type="button">
          Toggle left panel
        </button>
        <span> or resize window.</span>
      </div>

      <div>{`Main div resized ${count} times`}</div>
      <div style={s.dimensions}>{`Width: ${width}, Height: ${height}`}</div>
    </div>
  );
};

// const MainFrameInner = ({ onHideLeftPanel, width, height }) => {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     if (width || height) {
//       setCount(count => count + 1);
//     }
//   }, [width, height, setCount]);

//   return (
//     <div style={s.rightColumn}>
//       <div style={s.toggleLeftColumnBtn}>
//         <button onClick={onHideLeftPanel} type="button">
//           Toggle left panel
//         </button>
//         <span> or resize window.</span>
//       </div>

//       <div>{`Main div resized ${count} times`}</div>
//       <div style={s.dimensions}>{`Width: ${width}, Height: ${height}`}</div>
//     </div>
//   );
// };

// const MainFrame = withResizeDetector(MainFrameInner);

const App = () => {
  const [isLeftPanelVisible, setLeftPanelVisibility] = useState(true);

  return (
    <div style={s.wrapper}>
      {isLeftPanelVisible && <div style={s.leftColumn}>Left panel content</div>}
      <MainFrame onHideLeftPanel={() => setLeftPanelVisibility(isVisible => !isVisible)} />
    </div>
  );
};

export default App;
