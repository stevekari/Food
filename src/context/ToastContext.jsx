import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Overlay Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const isSuccess = toast.type === 'success';
            const isError = toast.type === 'error';
            const isCredit = toast.type === 'credit';

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 30, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                className={`pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
                  isSuccess
                    ? 'bg-stone-900/95 border-emerald-500/40 text-emerald-100 shadow-emerald-950/40'
                    : isError
                    ? 'bg-stone-900/95 border-rose-500/40 text-rose-100 shadow-rose-950/40'
                    : isCredit
                    ? 'bg-stone-900/95 border-amber-500/50 text-amber-100 shadow-amber-950/40'
                    : 'bg-stone-900/95 border-stone-700 text-stone-200 shadow-stone-950/40'
                }`}
              >
                <div className="flex-shrink-0">
                  {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
                  {isCredit && <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />}
                  {!isSuccess && !isError && !isCredit && <Info className="w-5 h-5 text-sky-400" />}
                </div>

                <div className="flex-1 text-sm font-medium pr-2">
                  {toast.message}
                </div>

                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-stone-400 hover:text-stone-100 transition-colors p-1 rounded-lg hover:bg-white/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

