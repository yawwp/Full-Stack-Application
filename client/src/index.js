import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/styles/reset.css';
import '../src/styles/global.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <UserProvider>
        <App />
    </UserProvider>
  </BrowserRouter>

);