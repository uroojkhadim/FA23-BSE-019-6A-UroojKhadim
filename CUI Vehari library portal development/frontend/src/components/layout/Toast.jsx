import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev.slice(-2), { id, message, type }]) // max 3
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
    warning: (msg) => addToast(msg, 'warning')
  }

  return (
    <ToastContext.Provider value={{ toast, toasts, setToasts }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}

export function ToastContainer() {
  const { toasts, setToasts } = useToast()

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />
  }

  const bgs = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-amber-50 border-amber-200'
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-start p-4 rounded-lg border shadow-sm animate-in slide-in-from-top-right fade-in duration-300 ${bgs[t.type]}`}>
          <div className="shrink-0 mr-3">{icons[t.type]}</div>
          <div className="flex-1 text-sm font-medium text-slate-800">{t.message}</div>
          <button onClick={() => removeToast(t.id)} className="shrink-0 ml-4 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
