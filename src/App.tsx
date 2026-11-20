/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HomePage } from './app/page';
import { ProtectedRoute } from './components/ProtectedRoute';
import { BannerPreviewModal } from './components/BannerPreviewModal';
import { RouteSwitcherBar } from './components/RouteSwitcherBar';

const DaftarKelompokPage = lazy(() =>
  import('./app/kelompok/page').then((m) => ({ default: m.DaftarKelompokPage }))
);
const LoginPage = lazy(() =>
  import('./app/login/page').then((m) => ({ default: m.LoginPage }))
);
const AdminLoginPage = lazy(() =>
  import('./app/admin/login/page').then((m) => ({ default: m.AdminLoginPage }))
);
const PostLoginHomePage = lazy(() =>
  import('./app/home/page').then((m) => ({ default: m.PostLoginHomePage }))
);
const AdminMonitoringPage = lazy(() =>
  import('./app/admin/page').then((m) => ({ default: m.AdminMonitoringPage }))
);
const AdminKelompokDetailPage = lazy(() =>
  import('./app/admin/kelompok/[id]/page').then((m) => ({ default: m.AdminKelompokDetailPage }))
);
const MentorDashboardPage = lazy(() =>
  import('./app/mentor/page').then((m) => ({ default: m.MentorDashboardPage }))
);
const WorkspacePage = lazy(() =>
  import('./app/workspace/page').then((m) => ({ default: m.WorkspacePage }))
);

const AppRouter: React.FC = () => {
  const { currentPath, currentUser, navigate, showToast } = useApp();

  // Central Strict Route Guards
  useEffect(() => {
    // 1. Unauthenticated users cannot access protected routes
    if (!currentUser) {
      if (
        currentPath.startsWith('/admin') ||
        currentPath.startsWith('/dashboard/admin') ||
        currentPath.startsWith('/mentor')
      ) {
        navigate('/login?role=admin');
        return;
      }
      if (currentPath !== '/' && currentPath !== '/kelompok' && currentPath !== '/login') {
        navigate('/login');
        return;
      }
      return;
    }

    // 2. Role-based routing restrictions
    if (currentUser.role === 'admin') {
      if (
        currentPath === '/workspace' ||
        currentPath.startsWith('/dashboard/ketua') ||
        currentPath === '/home' ||
        currentPath === '/login' ||
        currentPath.startsWith('/admin/login')
      ) {
        navigate('/admin');
      }
    } else if (currentUser.role === 'mentor') {
      if (
        currentPath.startsWith('/admin') ||
        currentPath.startsWith('/dashboard/admin') ||
        currentPath === '/workspace' ||
        currentPath.startsWith('/dashboard/ketua') ||
        currentPath === '/home' ||
        currentPath === '/login'
      ) {
        if (currentPath.startsWith('/admin') || currentPath.startsWith('/dashboard/admin')) {
          showToast('Akses ditolak: Anda login sebagai Guru Pembimbing (hanya akses kelompok bimbingan).', 'warning');
        }
        navigate('/mentor');
      }
    } else if (currentUser.role === 'leader' || currentUser.role === 'user') {
      if (
        currentPath.startsWith('/admin') ||
        currentPath.startsWith('/dashboard/admin') ||
        currentPath.startsWith('/mentor')
      ) {
        showToast('Akses ditolak: Area khusus Guru Pembimbing & Admin Kurikulum.', 'warning');
        navigate('/dashboard/ketua');
      } else if (currentPath === '/login') {
        navigate('/dashboard/ketua');
      }
    }
  }, [currentUser, currentPath, navigate, showToast]);

  const fallbackRoute =
    currentUser?.role === 'admin'
      ? '/admin'
      : currentUser?.role === 'mentor'
        ? '/mentor'
        : '/dashboard/ketua';

  return (
    <div className="relative min-h-screen bg-[#f9f9f9] text-[#1a1c1c] flex flex-col font-sans overflow-x-hidden">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-xs font-semibold text-slate-500">
            Memuat halaman...
          </div>
        }
      >
        {/* Public / Auth Pages */}
        {currentPath === '/' && <HomePage />}
        {currentPath === '/kelompok' && <DaftarKelompokPage />}
        {currentPath === '/login' && <LoginPage />}
        {currentPath === '/admin/login' && <AdminLoginPage />}

        {/* Protected Ketua/User Routes (Blocked for Admin, Mentor & Unauthenticated) */}
        {currentPath === '/home' && currentUser && (currentUser.role === 'user' || currentUser.role === 'leader') && (
          <PostLoginHomePage />
        )}
        {(currentPath === '/workspace' || currentPath === '/dashboard/ketua') &&
          currentUser &&
          (currentUser.role === 'user' || currentUser.role === 'leader') && <WorkspacePage />}

        {/* Protected Guru Pembimbing Routes */}
        {(currentPath === '/mentor' || currentPath.startsWith('/mentor/')) && currentUser && (
          <ProtectedRoute
            currentUser={currentUser}
            allowedRoles={['mentor', 'admin']}
            onUnauthorized={() => navigate(fallbackRoute)}
          >
            <MentorDashboardPage />
          </ProtectedRoute>
        )}

        {/* Protected Admin Routes */}
        {(currentPath === '/admin' || currentPath === '/dashboard/admin') && currentUser && (
          <ProtectedRoute
            currentUser={currentUser}
            allowedRoles={['admin']}
            onUnauthorized={() => navigate(fallbackRoute)}
          >
            <AdminMonitoringPage />
          </ProtectedRoute>
        )}
        {(currentPath === '/admin/kelompok/03' || currentPath === '/dashboard/admin/review') && currentUser && (
          <ProtectedRoute
            currentUser={currentUser}
            allowedRoles={['admin']}
            onUnauthorized={() => navigate(fallbackRoute)}
          >
            <AdminKelompokDetailPage />
          </ProtectedRoute>
        )}
      </Suspense>

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
