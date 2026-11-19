/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HomePage } from './app/page';
import { PostLoginHomePage } from './app/home/page';
import { LoginPage } from './app/login/page';
import { KetuaDashboardPage } from './app/dashboard/ketua/page';
import { AdminDashboardWorkspace } from './app/dashboard/admin/page';
import { AdminKelompokDetailPage } from './app/admin/kelompok/[id]/page';
import { WorkspacePage } from './app/workspace/page';
import { BannerPreviewModal } from './components/BannerPreviewModal';
import { RouteSwitcherBar } from './components/RouteSwitcherBar';

const AppRouter: React.FC = () => {
  const { currentPath, currentUser, isAuthReady, navigate, showToast } = useApp();

  const isAdminRoute =
    currentPath === '/admin' ||
    currentPath === '/admin/kelompok/03' ||
    currentPath === '/dashboard/admin' ||
    currentPath === '/dashboard/admin/review';

  const isKetuaRoute =
    currentPath === '/home' ||
    currentPath === '/dashboard/ketua' ||
    currentPath === '/workspace';

  const isProtectedRoute = isAdminRoute || isKetuaRoute;

  useEffect(() => {
    if (!isAuthReady) return;

    if (isProtectedRoute && !currentUser) {
      showToast('Silakan login terlebih dahulu untuk mengakses halaman ini.', 'warning');
      navigate('/login');
      return;
    }

    if (isAdminRoute && currentUser && currentUser.role !== 'admin') {
      showToast('Akses ditolak: Halaman ini khusus role Admin.', 'warning');
      navigate('/home');
      return;
    }

    if (isKetuaRoute && currentUser && currentUser.role === 'admin') {
      // Allow admin to view if desired, or redirect
    }
  }, [isAuthReady, isProtectedRoute, isAdminRoute, isKetuaRoute, currentUser, navigate, showToast]);

  return (
    <div className="relative min-h-screen bg-[#F4F4F5] text-slate-900 flex flex-col font-sans">
      {/* 1. Public Pre-Login Landing Page */}
      {currentPath === '/' && <HomePage />}

      {/* 2. Login & Role Simulation */}
      {currentPath === '/login' && <LoginPage />}

      {/* 3. Post-Login Home Page (Bridging familiar layout with pinned own group) */}
      {currentPath === '/home' && <PostLoginHomePage />}

      {/* 4. Multi-Page Ketua Dashboard (6 Modular Sub-Pages) */}
      {currentPath === '/dashboard/ketua' && <KetuaDashboardPage />}
      {currentPath === '/workspace' && <KetuaDashboardPage />}

      {/* 5. Pill-Based Admin Workspace */}
      {(currentPath === '/dashboard/admin' ||
        currentPath === '/dashboard/admin/review' ||
        currentPath === '/admin') && <AdminDashboardWorkspace />}
      {currentPath === '/admin/kelompok/03' && <AdminKelompokDetailPage />}

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
