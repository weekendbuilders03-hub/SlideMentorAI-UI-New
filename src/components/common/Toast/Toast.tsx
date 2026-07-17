import React, { createContext, useCallback, useContext, useState } from 'react';
import { cn } from '../../../utils/cn';

interface ToastItem {
  id: number;
  message: string;
  variant: 'teal' | 'muted';
  icon?: string;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastItem['variant'], icon?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};

let _id = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (message: string, variant: ToastItem['variant'] = 'teal', icon?: string) => {
      const id = ++_id;
      setToasts((prev) => [...prev, { id, message, variant, icon }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={cn('toast', t.variant)}>
            {t.icon && <span>{t.icon}</span>}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
