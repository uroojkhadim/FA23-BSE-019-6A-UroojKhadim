import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from './hooks/useAuth'
import { ToastProvider, ToastContainer } from './components/layout/Toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        <App />
        <ToastContainer />
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>
)
