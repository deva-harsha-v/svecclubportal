import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Building2,
  Settings,
  LogOut,
  FileSpreadsheet,
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';
import { authService } from '../../services/auth';
import { api } from '../../services/api';

export const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    authService.clearSession();
    navigate('/admin/login');
  };

  const handleExport = async () => {
    try {
      await api.exportExcel();
    } catch (e: any) {
      alert(e.message || 'Failed to download Excel file.');
    }
  };

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/clubs', label: 'Clubs', icon: Building2 },
    { to: '/admin/registrations', label: 'Registrations', icon: ClipboardList },
    { to: '/admin/students', label: 'Students', icon: Users },
    { to: '/admin/settings', label: 'System Settings', icon: Settings },
    { to: '/admin/audit-logs', label: 'Audit Logs', icon: ShieldAlert },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* SVEC Admin Brand */}
        <div className="p-5 border-b border-[rgba(135,245,245,0.1)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black/40 border border-[rgba(135,245,245,0.15)] p-1 flex items-center justify-center shrink-0 shadow">
              <img src="/svec_logo.png" alt="SVEC Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="font-display font-bold text-[#FFE5F1] text-sm leading-tight">
                SVEC CLUB PORTAL
              </h2>
              <span className="font-mono text-[9px] text-[#87F5F5] tracking-widest uppercase block mt-0.5">
                ADMINISTRATION
              </span>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-[rgba(255,229,241,0.45)] hover:text-[#FFE5F1]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Export */}
        <div className="px-4 py-4 border-b border-[rgba(135,245,245,0.1)]">
          <button
            onClick={() => {
              setMobileOpen(false);
              handleExport();
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[rgba(135,245,245,0.1)] text-[#87F5F5] hover:bg-[rgba(135,245,245,0.2)] border border-[rgba(135,245,245,0.2)] text-xs font-mono font-semibold transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#87F5F5]" />
            Export Excel (.xlsx)
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition border-l-2 ${
                    isActive
                      ? 'border-l-[#F042FF] bg-[rgba(114,38,255,0.22)] text-[#FFE5F1] font-bold shadow-md'
                      : 'border-l-transparent text-[rgba(255,229,241,0.68)] hover:text-[#FFE5F1] hover:bg-[rgba(114,38,255,0.12)]'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Admin Profile */}
      <div className="p-4 border-t border-[rgba(135,245,245,0.1)]">
        <div className="mb-3 px-3 py-2 bg-[rgba(22,0,120,0.4)] rounded-xl border border-[rgba(135,245,245,0.12)]">
          <div className="text-xs font-semibold text-[#FFE5F1] truncate">{user?.name || user?.email}</div>
          <div className="text-[10px] font-mono text-[rgba(255,229,241,0.45)] truncate">{user?.email}</div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Navigation Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#010030] border-b border-[rgba(135,245,245,0.1)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/svec_logo.png" alt="SVEC Logo" className="w-8 h-8 object-contain" />
          <div>
            <span className="font-display font-bold text-[#FFE5F1] text-xs block">SVEC CLUB PORTAL</span>
            <span className="font-mono text-[9px] text-[#87F5F5] block">ADMINISTRATION</span>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl bg-[#160078]/60 border border-[rgba(135,245,245,0.15)] text-[#FFE5F1]"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#010030] border-r border-[rgba(135,245,245,0.1)] transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar (Permanent Translucent) */}
      <aside className="hidden lg:flex w-64 bg-[rgba(22,0,120,0.35)] text-[#FFE5F1] min-h-screen border-r border-[rgba(135,245,245,0.1)] flex-col shrink-0">
        {sidebarContent}
      </aside>
    </>
  );
};
