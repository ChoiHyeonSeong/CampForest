import React from 'react';
import { createRoot } from 'react-dom/client';
import '@styles/index.css';
import App from './App';
import axios from 'axios';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from '@store/store';
import { BrowserRouter } from 'react-router-dom';
import { WebSocketProvider } from 'Context/WebSocketContext';

function loadNaverMapScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.REACT_APP_NAVERMAP_API_KEY}&submodules=geocoder`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Naver Map script'));
    document.head.appendChild(script);
  });
}

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;
axios.defaults.withCredentials = true;

const container = document.getElementById('root');
const root = createRoot(container!);

loadNaverMapScript().then(() => {
  root.render(
    // <React.StrictMode>
      <Provider store={store}>
          <BrowserRouter>
            <WebSocketProvider>
              <App />
            </WebSocketProvider>
          </BrowserRouter>  
      </Provider>
    // </React.StrictMode>
  );
}).catch((error) => {
  console.error(error);
});


serviceWorkerRegistration.register();

reportWebVitals();
