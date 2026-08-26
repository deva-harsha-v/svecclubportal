import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/layout/AdminSidebar';
import { authService } from '../services/auth';

export const AdminLayout: React.FC = () => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-bgDark text-slate-100 font-sans overflow-x-hidden">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-10 min-w-0 w-full max-w-[1600px] mx-auto overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
