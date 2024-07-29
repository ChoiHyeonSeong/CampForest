import React from 'react';
import ReactDOM from 'react-dom/client';
import '@styles/index.css';
import App from './App';
import axios from 'axios';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from '@store/store';
import { BrowserRouter } from 'react-router-dom';

axios.defaults.baseURL = 'http://192.168.100.203:8080/'
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  // </React.StrictMode>
);


serviceWorkerRegistration.register();

reportWebVitals();
