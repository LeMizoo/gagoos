// Vérifiez que c'est bien comme ça :
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'  // ✅ Chemin correct
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)