import React from 'react';
import { User, UserRole } from '../context/AppContext';

interface ProtectedRouteProps {
  currentUser: User | null;
  allowedRoles: UserRole[];
  requiredGroupId?: string;
  onUnauthorized: () => void;
  children: React.ReactNode;
}

/**
 * Frontend Route Guard:
 * 1. Memastikan pengguna sudah login dan memiliki role yang diizinkan.
 * 2. Untuk role 'mentor', memverifikasi ID kelompok yang diakses berada pada `assignedGroupIds`.
 * 3. Untuk role 'user' / 'leader', memverifikasi ID kelompok sama dengan `groupNumber` miliknya.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  currentUser,
  allowedRoles,
  requiredGroupId,
  onUnauthorized,
  children,
}) => {
  const hasAllowedRole = Boolean(currentUser && allowedRoles.includes(currentUser.role));

  let hasGroupAccess = true;
  if (currentUser && requiredGroupId) {
    if (currentUser.role === 'mentor') {
      hasGroupAccess = Boolean(currentUser.assignedGroupIds?.includes(requiredGroupId));
    } else if (currentUser.role === 'user' || currentUser.role === 'leader') {
      hasGroupAccess = currentUser.groupNumber === requiredGroupId;
    }
  }

  if (!hasAllowedRole || !hasGroupAccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-3 shadow-sm">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-rose-50 text-[#E50914] font-black text-lg">
            !
          </span>
          <h2 className="text-lg font-extrabold text-slate-900">Akses Ditolak</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {!hasAllowedRole
              ? 'Anda tidak memiliki hak akses untuk membuka halaman ini.'
              : `Kelompok ${requiredGroupId} bukan merupakan kelompok bimbingan Anda.`}
          </p>
          <button
            onClick={onUnauthorized}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#E50914] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Kembali ke Dashboard Anda
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
