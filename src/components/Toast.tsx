import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-[#0F382C] text-white border border-emerald-700/50 shadow-lg',
    error: 'bg-rose-950 text-rose-100 border border-rose-800 shadow-lg',
    info: 'bg-slate-900 text-slate-100 border border-slate-700 shadow-lg',
  }[toast.type];

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }[toast.type];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-bottom-5 duration-200 pointer-events-auto">
      <div className={`flex items-start gap-3 p-4 rounded-xl ${bgStyles}`}>
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${toast.type === 'success' ? 'text-lime-400' : 'text-slate-300'}`} />
        <div className="flex-1 text-sm">
          <p className="font-semibold text-white">{toast.title}</p>
          {toast.message && <p className="text-slate-200 mt-0.5 text-xs leading-relaxed">{toast.message}</p>}
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
