import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Info, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[90] flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderColor = 'border-border';
        let iconColor = 'text-orbit';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderColor = 'border-safe/40';
          iconColor = 'text-safe';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderColor = 'border-warning/40';
          iconColor = 'text-warning';
        } else if (toast.type === 'alert') {
          Icon = AlertOctagon;
          borderColor = 'border-critical/40';
          iconColor = 'text-critical';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-white border ${borderColor} p-3.5 rounded-md shadow-md flex items-start gap-3 text-xs animate-in slide-in-from-bottom-2 fade-in duration-150`}
          >
            <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-primary font-medium leading-snug">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-secondary hover:text-primary p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
