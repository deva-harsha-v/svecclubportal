import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/club-head');

  if (isAdmin) return null;

  return (
    <header className="sticky top-0 z-40 bg-[#090D16]/90 border-b border-slate-800/80 backdrop-blur-md transition-all duration-300">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* SVEC College Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-800/80 border border-slate-700 p-1 flex items-center justify-center shrink-0 group-hover:border-slate-600 transition-all">
            <img
              src="/svec_logo.png"
              alt="Sri Vasavi Engineering College Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="font-display font-bold text-base sm:text-lg tracking-tight block text-slate-100 group-hover:text-indigo-400 transition-colors">
              SVEC Club Portal
            </span>
            <span className="text-[11px] font-medium text-slate-400 block -mt-0.5">
              Sri Vasavi Engineering College
            </span>
          </div>
        </Link>

        {/* Action Button: Clean admin entry */}
        <div className="flex items-center gap-2">
          <Link
            to="/admin/login"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/60 text-slate-200 text-xs font-medium hover:bg-slate-800 hover:border-slate-600 transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Admin Portal</span>
          </Link>

          <Link
            to="/admin/login"
            className="sm:hidden p-2 rounded-lg border border-slate-700 bg-slate-800/60 text-slate-200 hover:bg-slate-800 transition"
            title="Admin Portal"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </Link>
        </div>
      </div>
    </header>
  );
};
