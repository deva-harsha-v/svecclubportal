import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Instagram, Globe } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/club-head');

  if (isAdmin) return null;

  const INSTAGRAM_URL = "https://www.instagram.com/sves_official_info?igsi=MW80ZXQzZzNoY24zaQ==";
  const WEBSITE_URL = "https://srivasaviengg.ac.in/";

  return (
    <footer className="w-full bg-[#090D16] border-t border-slate-800/80 py-5 sm:py-7 px-4 sm:px-8 mt-4 sm:mt-6 text-slate-400">
      <div className="w-full max-w-[1600px] mx-auto space-y-4">
        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-between gap-6 pb-4 border-b border-slate-800/80">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-slate-900 border border-slate-800 p-0.5 flex items-center justify-center">
              <img src="/svec_logo.png" alt="SVEC Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-display font-bold text-sm text-slate-200 block leading-none">SVEC Club Portal</span>
              <span className="text-[11px] font-medium text-slate-400">Sri Vasavi Engineering College</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-xs font-medium">
            <Link to="/" className="hover:text-indigo-400 transition">Clubs</Link>
            <Link to="/register" className="hover:text-indigo-400 transition">Registration</Link>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-indigo-400 transition"
            >
              <Instagram className="w-3.5 h-3.5 text-indigo-400" /> Instagram
            </a>
            <a
              href={WEBSITE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-indigo-400 transition"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" /> College Website
            </a>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="sm:hidden text-center space-y-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center justify-center gap-2">
            <img src="/svec_logo.png" alt="SVEC Logo" className="w-6 h-6 object-contain" />
            <span className="font-display font-bold text-sm text-slate-200">SVEC Club Portal</span>
          </div>
          <p className="text-[11px] font-medium text-slate-400">
            Sri Vasavi Engineering College
          </p>

          <div className="flex items-center justify-center gap-2.5 pt-1">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-200 hover:border-slate-700 transition"
            >
              <Instagram className="w-3 h-3 text-indigo-400" /> Instagram
            </a>
            <a
              href={WEBSITE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-200 hover:border-slate-700 transition"
            >
              <Globe className="w-3 h-3 text-sky-400" /> Website
            </a>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left text-[11px] font-medium text-slate-400 gap-1">
          <span>© 2026 Sri Vasavi Engineering College — Student Clubs</span>
          <span>SVEC Club Discovery Portal</span>
        </div>
      </div>
    </footer>
  );
};
