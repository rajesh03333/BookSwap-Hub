// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'; // <-- Import AuthProvider
import { BrowserRouter } from 'react-router-dom'; // <-- Import BrowserRouter

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap BrowserRouter around AuthProvider if navigation used within context */}
    <BrowserRouter>
      <AuthProvider> {/* <-- Wrap App with AuthProvider */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)