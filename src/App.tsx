/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HomePage } from './app/page';
import { LoginPage } from './app/login/page';
import { AdminMonitoringPage } from './app/admin/page';
import { AdminKelompokDetailPage } from './app/admin/kelompok/[id]/page';
import { WorkspacePage } from './app/workspace/page';
import { BannerPreviewModal } from './components/BannerPreviewModal';
import { RouteSwitcherBar } from './components/RouteSwitcherBar';

const AppRouter: React.FC = () => {
  const { currentPath } = useApp();

  return (
    <div className="relative min-h-screen bg-[#f9f9f9] text-[#1a1c1c] flex flex-col font-sans">
      {/* Dynamic View based on Next.js Route */}
      {currentPath === '/' && <HomePage />}
      {currentPath === '/login' && <LoginPage />}
      {currentPath === '/admin' && <AdminMonitoringPage />}
      {currentPath === '/admin/kelompok/03' && <AdminKelompokDetailPage />}
      {currentPath === '/workspace' && <WorkspacePage />}

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
