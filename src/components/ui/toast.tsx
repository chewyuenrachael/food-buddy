'use client';

import * as React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (type: ToastType, message: string) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const showToast = React.useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(2);
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };

  const backgrounds = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border p-4 shadow-lg animate-in slide-in-from-right',
        backgrounds[toast.type]
      )}
    >
      {icons[toast.type]}
      <p className="text-sm font-medium text-gray-900">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-2 rounded-full p-1 hover:bg-black/5"
      >
        <X className="h-4 w-4 text-gray-500" />
      </button>
    </div>
  );
}
