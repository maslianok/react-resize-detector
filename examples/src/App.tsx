import React, { ReactElement, useEffect, useState } from 'react';
import { useRef } from 'react';
import { createRef } from 'react';
import { RefObject } from 'react';
import ReactResizeDetector, { useResizeDetector, withResizeDetector } from 'react-resize-detector/build/withPolyfill';

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

type MainFramePropsType = {
  onHideLeftPanel: () => void;
  width?: number;
  height?: number;
};

// #### 1. React hook (new in v6.0.0)
const MainFrame = ({ onHideLeftPanel }: MainFramePropsType) => {
  const [count, setCount] = useState(0);
  const { width, height, ref } = useResizeDetector<HTMLDivElement>();
  // { refreshMode: 'debounce', refreshRate: 2000, skipOnMount: true }

  useEffect(() => {
    if (width || height) {
      setCount(count => count + 1);
    }
  }, [width, height]);

  return (
    <div style={s.rightColumn as React.CSSProperties} ref={ref}>
      <div style={s.toggleLeftColumnBtn as React.CSSProperties}>
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

const App = () => {
  const [isLeftPanelVisible, setLeftPanelVisibility] = useState(true);

  return (
    <div style={s.wrapper}>
      {isLeftPanelVisible && <div style={s.leftColumn as React.CSSProperties}>Left panel content</div>}
      <MainFrame onHideLeftPanel={() => setLeftPanelVisibility(isVisible => !isVisible)} />
    </div>
  );
};

// #### 2. HOC pattern

// const MainFrameInner = ({ onHideLeftPanel, width, height }: MainFramePropsType) => {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     if (width || height) {
//       setCount(count => count + 1);
//     }
//   }, [width, height, setCount]);

//   return (
//     <div style={s.rightColumn as React.CSSProperties}>
//       <div style={s.toggleLeftColumnBtn as React.CSSProperties}>
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

// const App = () => {
//   const [isLeftPanelVisible, setLeftPanelVisibility] = useState(true);

//   return (
//     <div style={s.wrapper}>
//       {isLeftPanelVisible && <div style={s.leftColumn as React.CSSProperties}>Left panel content</div>}
//       <MainFrame
//         onHideLeftPanel={() => {
//           setLeftPanelVisibility(isVisible => !isVisible);
//         }}
//       />
//     </div>
//   );
// };

// #### 3. Child Function Pattern

// const MainFrameInner = ({ onHideLeftPanel, width, height }: MainFramePropsType) => {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     if (width || height) {
//       setCount(count => count + 1);
//     }
//   }, [width, height, setCount]);

//   return (
//     <div style={s.rightColumn as React.CSSProperties}>
//       <div style={s.toggleLeftColumnBtn as React.CSSProperties}>
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

// const App = () => {
//   const [isLeftPanelVisible, setLeftPanelVisibility] = useState(true);

//   return (
//     <div style={s.wrapper}>
//       {isLeftPanelVisible && <div style={s.leftColumn as React.CSSProperties}>Left panel content</div>}
//       <ReactResizeDetector handleWidth handleHeight skipOnMount>
//         {({ width, height }) => (
//           <MainFrameInner
//             width={width}
//             height={height}
//             onHideLeftPanel={() => setLeftPanelVisibility(isVisible => !isVisible)}
//           />
//         )}
//       </ReactResizeDetector>
//     </div>
//   );
// };

export default App;
