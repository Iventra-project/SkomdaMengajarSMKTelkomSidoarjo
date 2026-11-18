/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HomePage } from './app/page';
import { LoginPage } from './app/login/page';
import { AdminMonitoringPage } from './app/admin/page';
import { AdminKelompokDetailPage } from './app/admin/kelompok/[id]/page';
import { WorkspacePage } from './app/workspace/page';
import { BannerPreviewModal } from './components/BannerPreviewModal';
import { RouteSwitcherBar } from './components/RouteSwitcherBar';

const AppRouter: React.FC = () => {
  const { currentPath, currentUser, isAuthReady, navigate, showToast } = useApp();

  const isAdminRoute = currentPath === '/admin' || currentPath === '/admin/kelompok/03';
  const isUserRoute = currentPath === '/workspace';
  const isProtectedRoute = isAdminRoute || isUserRoute;

  useEffect(() => {
    if (!isAuthReady) return;

    if (isProtectedRoute && !currentUser) {
      showToast('Silakan login terlebih dahulu untuk mengakses halaman ini.', 'warning');
      navigate('/login');
      return;
    }

    if (isAdminRoute && currentUser && currentUser.role !== 'admin') {
      showToast('Akses ditolak: Halaman ini khusus role Admin.', 'warning');
      navigate('/workspace');
      return;
    }

    if (isUserRoute && currentUser && currentUser.role !== 'user') {
      showToast('Halaman Workspace khusus untuk User Kelompok. Mengalihkan ke Panel Admin.', 'info');
      navigate('/admin');
    }
  }, [isAuthReady, isProtectedRoute, isAdminRoute, isUserRoute, currentUser, navigate, showToast]);

  const canRenderCurrentRoute =
    !isProtectedRoute ||
    (currentUser !== null &&
      ((isAdminRoute && currentUser.role === 'admin') ||
        (isUserRoute && currentUser.role === 'user')));

  return (
    <div className="relative min-h-screen bg-[#f9f9f9] text-[#1a1c1c] flex flex-col font-sans">
      {/* Dynamic View based on Route & Role Guard */}
      {currentPath === '/' && <HomePage />}
      {currentPath === '/login' && <LoginPage />}
      {canRenderCurrentRoute && currentPath === '/admin' && <AdminMonitoringPage />}
      {canRenderCurrentRoute && currentPath === '/admin/kelompok/03' && <AdminKelompokDetailPage />}
      {canRenderCurrentRoute && currentPath === '/workspace' && <WorkspacePage />}

      {/* Global Interactive Modals & Route Switcher */}
      <BannerPreviewModal />
      <RouteSwitcherBar />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
