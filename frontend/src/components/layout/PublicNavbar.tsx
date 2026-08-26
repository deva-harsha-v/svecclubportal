import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/club-head');

  if (isAdmin) return null;

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-b from-[#010030]/95 via-[#010030]/75 to-transparent backdrop-blur-md transition-all duration-300">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* SVEC College Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#160078]/60 border border-[rgba(135,245,245,0.2)] p-1 flex items-center justify-center shrink-0 group-hover:scale-105 transition-all shadow-md">
            <img
              src="/svec_logo.png"
              alt="Sri Vasavi Engineering College Logo"
              className="w-full h-full object-contain drop-shadow"
            />
          </div>
          <div>
            <span className="font-display font-bold text-base sm:text-xl tracking-tight block text-[#FFE5F1] group-hover:text-white transition-colors">
              SVEC CLUB PORTAL
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] font-semibold text-[#87F5F5] tracking-wider uppercase block -mt-0.5">
              Sri Vasavi Engineering College
            </span>
          </div>
        </Link>

        {/* Action Button: Compact icon on mobile, full outlined button on desktop */}
        <div className="flex items-center gap-2">
          <Link
            to="/admin/login"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#F042FF]/40 bg-[#F042FF]/10 text-[#FFE5F1] text-xs font-mono font-semibold hover:bg-[#F042FF]/20 hover:border-[#F042FF] hover:shadow-magentaGlow transition-all duration-200"
          >
            <ShieldCheck className="w-4 h-4 text-[#F042FF]" />
            <span>Admin Login</span>
          </Link>

          <Link
            to="/admin/login"
            className="sm:hidden p-2 rounded-full border border-[#F042FF]/40 bg-[#F042FF]/10 text-[#FFE5F1] hover:bg-[#F042FF]/20 transition"
            title="Admin Login"
          >
            <ShieldCheck className="w-4 h-4 text-[#F042FF]" />
          </Link>
        </div>
      </div>
    </header>
  );
};
