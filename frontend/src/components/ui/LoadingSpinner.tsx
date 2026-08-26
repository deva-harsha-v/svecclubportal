import React from 'react';

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Loading portal...' }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-10 h-10 border-4 border-slate-200 border-t-gold rounded-full animate-spin"></div>
    <p className="mt-4 font-mono text-xs text-slate-500 tracking-wider uppercase">{label}</p>
  </div>
);
