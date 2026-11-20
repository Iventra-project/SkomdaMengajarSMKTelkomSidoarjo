"use client";
import React, { useEffect } from 'react';
import { useApp } from '../../../context/AppContext';

export const AdminLoginPage: React.FC = () => {
  const { navigate } = useApp();

  useEffect(() => {
    navigate('/login?role=admin');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
      <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
        <span className="material-symbols-outlined animate-spin text-[#E50914] text-[20px]">sync</span>
        <span>Mengalihkan ke Portal Login Terpadu...</span>
      </div>
    </div>
  );
};
