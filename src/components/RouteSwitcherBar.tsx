import React from 'react';
import { useApp } from '../context/AppContext';

export const RouteSwitcherBar: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    /* Toast Alert */
    <div className="fixed top-18 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-xs font-semibold animate-in slide-in-from-top-4 duration-300 border bg-white text-slate-800 border-slate-200">
      <span
        className={`w-2.5 h-2.5 rounded-full ${
          toast.type === 'success'
            ? 'bg-emerald-500'
            : toast.type === 'warning'
            ? 'bg-amber-500'
            : 'bg-blue-500'
        }`}
      />
      <span>{toast.message}</span>
    </div>
  );
};
