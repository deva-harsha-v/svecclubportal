import React from 'react';

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-9 h-9 border-3 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></div>
    <p className="mt-3.5 text-xs font-medium text-slate-400">{label}</p>
  </div>
);
