import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'leaflet/dist/leaflet.css'
import './index.css'
// The import is now a default import, which is less error-prone
import AuthProvider from './AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)