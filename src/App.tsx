/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HomePage } from './app/page';
import { LoginPage } from './app/login/page';
import { PostLoginHomePage } from './app/home/page';
import { AdminMonitoringPage } from './app/admin/page';
import { AdminKelompokDetailPage } from './app/admin/kelompok/[id]/page';
import { WorkspacePage } from './app/workspace/page';
import { BannerPreviewModal } from './components/BannerPreviewModal';
import { RouteSwitcherBar } from './components/RouteSwitcherBar';

const AppRouter: React.FC = () => {
  const { currentPath, currentUser, navigate, showToast } = useApp();

  // Central Strict Route Guards
  useEffect(() => {
    // 1. Unauthenticated users cannot access protected routes
    if (!currentUser) {
      if (currentPath !== '/' && currentPath !== '/login') {
        navigate('/login');
      }
      return;
    }

    // 2. Role-based routing restrictions
    if (currentUser.role === 'admin') {
      if (currentPath === '/workspace' || currentPath === '/dashboard/ketua' || currentPath === '/home') {
        navigate('/admin');
      }
    } else if (currentUser.role === 'leader' || currentUser.role === 'user') {
      if (
        currentPath === '/admin' ||
        currentPath === '/dashboard/admin' ||
        currentPath === '/admin/kelompok/03' ||
        currentPath === '/dashboard/admin/review'
      ) {
        showToast('Akses ditolak: Area khusus Admin Kurikulum.', 'warning');
        navigate('/home');
      }
    }
  }, [currentUser, currentPath, navigate, showToast]);

  return (
    <div className="relative min-h-screen bg-[#f9f9f9] text-[#1a1c1c] flex flex-col font-sans overflow-x-hidden">
      {/* Public Pages */}
      {currentPath === '/' && <HomePage />}
      {currentPath === '/login' && <LoginPage />}

      {/* Protected Ketua/User Routes (Blocked for Admin & Unauthenticated) */}
      {currentPath === '/home' && currentUser && currentUser.role !== 'admin' && <PostLoginHomePage />}
      {(currentPath === '/workspace' || currentPath === '/dashboard/ketua') &&
        currentUser &&
        currentUser.role !== 'admin' && <WorkspacePage />}

      {/* Protected Admin Routes (Blocked for Ketua/User & Unauthenticated) */}
      {(currentPath === '/admin' || currentPath === '/dashboard/admin') &&
        currentUser &&
        currentUser.role === 'admin' && <AdminMonitoringPage />}
      {(currentPath === '/admin/kelompok/03' || currentPath === '/dashboard/admin/review') &&
        currentUser &&
        currentUser.role === 'admin' && <AdminKelompokDetailPage />}

      {/* Unauthenticated Access Fallback */}
      {!currentUser && currentPath !== '/' && currentPath !== '/login' && <LoginPage />}

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
