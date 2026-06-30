import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// Official Google Auth Provider
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Aapki exact Google Client ID yahan configure kar di hai */}
    <GoogleOAuthProvider clientId="996022316929-8g0ov183hp224kg68cps575s9o507jac.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)