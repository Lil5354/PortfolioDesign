import React from 'react'
import './index.css'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './lib/AuthContext.jsx'
import App from './portfolio_system.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
