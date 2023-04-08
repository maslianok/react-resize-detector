import React from 'react';
import * as ReactDOMClient from 'react-dom/client';

import './index.css';
import App from './App';

const root = ReactDOMClient.createRoot(document.getElementById('root') as HTMLElement);

root.render(<App />);

// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
