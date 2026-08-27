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
    <div className="flex flex-col justify-between h-full bg-[#0B0F17] text-slate-100">
      <div>
        {/* SVEC Admin Brand */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 p-1 flex items-center justify-center shrink-0">
              <img src="/svec_logo.png" alt="SVEC Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="font-display font-bold text-slate-100 text-sm leading-tight">
                SVEC Club Portal
              </h2>
              <span className="text-[10px] text-indigo-400 uppercase tracking-wider block font-semibold">
                Administration
              </span>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Export */}
        <div className="px-4 py-3.5 border-b border-slate-800">
          <button
            onClick={() => {
              setMobileOpen(false);
              handleExport();
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 text-indigo-400 hover:bg-slate-800 border border-slate-800 text-xs font-semibold transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
            Export Excel (.xlsx)
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-300 font-semibold border-l-2 border-indigo-500'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
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
      <div className="p-4 border-t border-slate-800">
        <div className="mb-3 px-3 py-2 bg-slate-900/80 rounded-lg border border-slate-800">
          <div className="text-xs font-semibold text-slate-200 truncate">{user?.name || user?.email}</div>
          <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg border border-red-900/40 text-red-400 hover:bg-red-950/30 text-xs font-semibold transition"
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
      <div className="lg:hidden sticky top-0 z-40 bg-[#0B0F17] border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/svec_logo.png" alt="SVEC Logo" className="w-8 h-8 object-contain" />
          <div>
            <span className="font-display font-bold text-slate-100 text-xs block">SVEC Club Portal</span>
            <span className="text-[10px] text-indigo-400 font-semibold block">Administration</span>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
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
        className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#0B0F17] border-r border-slate-800 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#0B0F17] text-slate-100 min-h-screen border-r border-slate-800 flex-col shrink-0">
        {sidebarContent}
      </aside>
    </>
  );
};
