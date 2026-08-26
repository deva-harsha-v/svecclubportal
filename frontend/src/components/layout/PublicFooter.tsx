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
    <footer className="w-full bg-[#010030] border-t border-[rgba(135,245,245,0.14)] py-4 sm:py-6 px-4 sm:px-8 mt-6 text-[#FFE5F1]/80">
      <div className="w-full max-w-[1600px] mx-auto space-y-4">
        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-between gap-6 pb-4 border-b border-[rgba(135,245,245,0.1)]">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img src="/svec_logo.png" alt="SVEC Logo" className="w-7 h-7 object-contain" />
            <div>
              <span className="font-display font-bold text-base text-[#FFE5F1] block leading-none">SVEC CLUB PORTAL</span>
              <span className="font-mono text-[10px] text-[rgba(255,229,241,0.68)]">Sri Vasavi Engineering College</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 font-mono text-xs">
            <Link to="/" className="hover:text-[#F042FF] transition">Clubs</Link>
            <Link to="/register" className="hover:text-[#F042FF] transition">Registration</Link>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#F042FF] transition"
            >
              <Instagram className="w-3.5 h-3.5 text-[#F042FF]" /> Instagram
            </a>
            <a
              href={WEBSITE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#F042FF] transition"
            >
              <Globe className="w-3.5 h-3.5 text-[#87F5F5]" /> College Website
            </a>
          </div>
        </div>

        {/* Mobile Layout (Compact stacked) */}
        <div className="sm:hidden text-center space-y-2.5 pb-3 border-b border-[rgba(135,245,245,0.1)]">
          <div className="flex items-center justify-center gap-2">
            <img src="/svec_logo.png" alt="SVEC Logo" className="w-6 h-6 object-contain" />
            <span className="font-display font-bold text-sm text-[#FFE5F1]">SVEC CLUB PORTAL</span>
          </div>
          <p className="font-mono text-[10px] text-[rgba(255,229,241,0.68)]">
            Sri Vasavi Engineering College
          </p>

          <div className="flex items-center justify-center gap-2.5 pt-1">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#160078]/60 border border-[rgba(135,245,245,0.2)] text-[11px] font-mono text-[#FFE5F1] hover:border-[#F042FF] transition"
            >
              <Instagram className="w-3 h-3 text-[#F042FF]" /> Instagram
            </a>
            <a
              href={WEBSITE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#160078]/60 border border-[rgba(135,245,245,0.2)] text-[11px] font-mono text-[#FFE5F1] hover:border-[#87F5F5] transition"
            >
              <Globe className="w-3 h-3 text-[#87F5F5]" /> Website
            </a>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left font-mono text-[10px] text-[rgba(255,229,241,0.45)] gap-1">
          <span>© 2026 Sri Vasavi Engineering College — Student Clubs</span>
          <span className="text-[#87F5F5]/70">SVEC Club Discovery Portal</span>
        </div>
      </div>
    </footer>
  );
};
