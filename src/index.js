import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./style/styles.css";
import { Provider } from 'react-redux';
import Store from './store';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={Store}>
    <React.StrictMode>
      {/* <head>
        {linkElement}
      </head> */}
      <App />
    </React.StrictMode>
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
