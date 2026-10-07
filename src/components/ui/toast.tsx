import { useState, useEffect, useCallback, type ReactNode } from 'react';

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, duration = 2000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-fade-in-up">
      <div className="bg-primary text-primary-foreground px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2">
        <span>❤️</span>
        <span>{message}</span>
      </div>
    </div>
  );
}

interface UseToastReturn {
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

export function useToast(): UseToastReturn {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  return { toastMessage, showToast };
}
