// ─────────────────────────────────────────────────────────────
// src/main.jsx — updated for phase 8
// Imports i18n before anything else
// ─────────────────────────────────────────────────────────────
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './i18n'; // must be imported before App
import './index.css'; // global styles + dark theme
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
