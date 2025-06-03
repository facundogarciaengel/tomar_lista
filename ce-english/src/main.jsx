import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Bootstrap opcional (quitar si no lo usás)
import 'bootstrap/dist/css/bootstrap.min.css';
// Orden: variables/reset → globales mínimos
import './styles/_base.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);