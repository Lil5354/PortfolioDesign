import React from 'react'
import './index.css'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './lib/AuthContext.jsx'
import { TranslationProvider } from './lib/i18n.jsx'
import App from './portfolio_system.jsx'

const originalFetch = window.fetch;
window.fetch = async (...args) => {
  let [resource, config] = args;
  if (typeof resource === 'string' && resource.startsWith('/api')) {
    config = config || {};
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
    }
    if (config.credentials === 'include') {
      config.credentials = 'omit';
    }
  }
  return originalFetch(resource, config);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <TranslationProvider>
        <App />
      </TranslationProvider>
    </AuthProvider>
  </React.StrictMode>,
)
