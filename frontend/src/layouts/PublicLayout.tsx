import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { PublicFooter } from '../components/layout/PublicFooter';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#010030] text-[#FFE5F1]">
      <PublicNavbar />
      <main className="flex-1 pb-2">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};
