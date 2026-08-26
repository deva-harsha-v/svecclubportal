import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';

import { HomePage } from './pages/HomePage';
import { ClubDetailsPage } from './pages/ClubDetailsPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { SuccessPage } from './pages/SuccessPage';

import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { ClubManagementPage } from './pages/admin/ClubManagementPage';
import { ClubEditorPage } from './pages/admin/ClubEditorPage';
import { RegistrationManagementPage } from './pages/admin/RegistrationManagementPage';
import { StudentManagementPage } from './pages/admin/StudentManagementPage';
import { ClubHeadsPage } from './pages/admin/ClubHeadsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';

import { ClubHeadDashboardPage } from './pages/club_head/ClubHeadDashboardPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/clubs/:slug" element={<ClubDetailsPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/success" element={<SuccessPage />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="clubs" element={<ClubManagementPage />} />
          <Route path="clubs/new" element={<ClubEditorPage />} />
          <Route path="clubs/:slug/edit" element={<ClubEditorPage />} />
          <Route path="registrations" element={<RegistrationManagementPage />} />
          <Route path="students" element={<StudentManagementPage />} />
          <Route path="club-heads" element={<ClubHeadsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
        </Route>

        {/* Club Head Protected Routes */}
        <Route path="/club-head" element={<AdminLayout />}>
          <Route index element={<Navigate to="/club-head/dashboard" replace />} />
          <Route path="dashboard" element={<ClubHeadDashboardPage />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
