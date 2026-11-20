"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Navbar } from '../../components/Navbar';
import { BrandLogo } from '../../components/BrandLogo';

export const LoginPage: React.FC = () => {
  const { navigate, currentUser, showToast, groups, login, claimGroupLeader } = useApp();

  // Tab State: 'login' (Masuk Ketua) vs 'claim' (Aktivasi Ketua Baru)
  const [activeTab, setActiveTab] = useState<'login' | 'claim'>('login');

  // Tab 1: Masuk Ketua State
  const [selectedLoginGroup, setSelectedLoginGroup] = useState('03');
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Tab 2: Aktivasi Ketua Baru State
  const selectableGroups = useMemo(() => {
    return groups
      .filter((g) => g.number !== '00')
      .sort((a, b) => parseInt(a.number, 10) - parseInt(b.number, 10));
  }, [groups]);

  // First unassigned group as initial selection, or '23'
  const firstUnassignedGroup = useMemo(() => {
    const unassigned = selectableGroups.find((g) => !g.hasLeader);
    return unassigned ? unassigned.number : '23';
  }, [selectableGroups]);

  const [selectedGroup, setSelectedGroup] = useState(firstUnassignedGroup);
  const [claimNis, setClaimNis] = useState('');
  const [claimPassword, setClaimPassword] = useState('');
  const [showClaimPassword, setShowClaimPassword] = useState(false);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [claimErrorMessage, setClaimErrorMessage] = useState('');

  // Keep selectedGroup synced if firstUnassignedGroup changes
  useEffect(() => {
    if (!selectedGroup) {
      setSelectedGroup(firstUnassignedGroup);
    }
  }, [firstUnassignedGroup, selectedGroup]);

  // Auto-redirect if user already has an active session
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    }
  }, [currentUser, navigate]);

  // Handle Tab 1: Masuk Ketua Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedIdentity = identity.trim();
    const trimmedPassword = password.trim();

    if (!trimmedIdentity || !trimmedPassword) {
      setErrorMessage('NIS/Email dan kata sandi wajib diisi.');
      showToast('NIS/Email dan kata sandi wajib diisi.', 'warning');
      return;
    }

    // Check for Admin identity attempted on Student Login
    const lower = trimmedIdentity.toLowerCase();
    if (
      lower === 'admin' ||
      lower === 'admin@smktelkom-sda.sch.id' ||
      lower.includes('admin.kurikulum') ||
      lower.includes('sri.wahyuni') ||
      lower.includes('pembimbing')
    ) {
      const adminReject = 'Akun Admin tidak dapat masuk di sini. Silakan gunakan Portal Khusus Guru Pembimbing.';
      setErrorMessage(adminReject);
      showToast(adminReject, 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(trimmedIdentity, trimmedPassword, selectedLoginGroup);
      if (!res.ok) {
        setErrorMessage(res.error || 'NIS/Email atau kata sandi tidak sesuai.');
        showToast(res.error || 'NIS/Email atau kata sandi tidak sesuai.', 'warning');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Tab 2: Aktivasi Ketua Baru Submit
  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClaimErrorMessage('');

    if (!selectedGroup) {
      setClaimErrorMessage('Silakan pilih kelompok yang akan diaktivasi.');
      return;
    }
    if (!claimNis.trim() || !claimPassword.trim()) {
      setClaimErrorMessage('NIS dan kata sandi baru wajib diisi.');
      return;
    }

    setIsClaimLoading(true);
    try {
      const res = await claimGroupLeader(selectedGroup, claimNis.trim(), claimPassword.trim());
      if (!res.ok) {
        setClaimErrorMessage(res.error || 'Gagal mengaktivasi akun ketua.');
        showToast(res.error || 'Gagal mengaktivasi akun ketua.', 'warning');
      }
    } finally {
      setIsClaimLoading(false);
    }
  };

  return (
    <div className="w-full bg-white font-sans text-slate-800 antialiased min-h-screen flex flex-col justify-between">
      {/* ══════════════════════════════════════════════════════════════════════════
          FLOATING DARK PILL NAVBAR (LOGIN MINIMALIST)
      ══════════════════════════════════════════════════════════════════════════ */}
      <Navbar variant="login" />

      {/* Main Login Workspace */}
      <main className="flex-1 w-full flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-6xl mx-auto py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Editorial Visual Card */}
            <div className="lg:col-span-6 relative flex flex-col justify-between overflow-hidden bg-slate-50 rounded-2xl p-8 lg:p-10 min-h-[540px] border border-slate-200 shadow-xs">
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="bg-[#e20113] text-white text-[11px] font-bold uppercase px-3 py-0.5 rounded-full tracking-wider transform -rotate-3">
                    #Impact2026
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    Arsip • Inisiatif Sosial
                  </span>
                </div>

                <div className="pt-2">
                  <BrandLogo size="lg" />
                  <p className="text-sm text-slate-600 mt-3 max-w-md leading-relaxed">
                    Ruang koordinasi resmi bagi ketua kelompok relawan Skomda Mengajar angkatan 2026 dan guru pembimbing lapangan SMK Telkom Sidoarjo.
                  </p>
                </div>
              </div>

              {/* Photo Frame Module with Archival Caption */}
              <div className="relative z-10 mt-8 flex flex-col gap-2">
                <div className="relative w-full h-[240px] sm:h-[260px] bg-slate-200 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                  <img
                    className="w-full h-full object-cover"
                    alt="Dokumentasi Pembelajaran SMP"
                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                    <div className="flex items-center gap-2 text-white">
                      <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                      <span className="text-[10px] font-bold tracking-wider uppercase opacity-95">
                        Dokumentasi Mengajar Siswa SMK di SMP Mitra
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e20113]"></span>
                    Penerjunan relawan pengabdian masyarakat — Laboratorium Komputer SMP
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">REF: SKD-2026-REG</span>
                </div>
              </div>
            </div>

            {/* Right Column: Authentication Card with Tab Switcher */}
            <div className="lg:col-span-6 flex flex-col justify-center px-4 sm:px-8 py-4">
              <div className="w-full max-w-md mx-auto flex flex-col">
                {/* Header Title */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2.5 h-2.5 bg-[#e20113] rounded-full"></span>
                    <span className="text-[10px] uppercase tracking-widest text-[#e20113] font-bold">
                      Portal Autentikasi
                    </span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {activeTab === 'login' ? 'Masuk Portal' : 'Aktivasi Ketua Regu'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    {activeTab === 'login'
                      ? 'Gunakan NIS ketua atau email institusi terdaftar.'
                      : 'Klaim penugasan ketua kelompok untuk pertama kali.'}
                  </p>
                </div>

                {/* Clean Pill Tab Switcher */}
                <div className="flex p-1 bg-slate-100 rounded-xl mb-6 border border-slate-200/80 select-none">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setErrorMessage('');
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeTab === 'login'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Masuk Ketua
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('claim');
                      setClaimErrorMessage('');
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeTab === 'claim'
                        ? 'bg-white text-[#e20113] shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Aktivasi Ketua Baru
                  </button>
                </div>

                {/* ══════════════════════════════════════════════════════════════
                    TAB 1: MASUK KETUA (EXISTING LEADERS & ADMIN)
                ══════════════════════════════════════════════════════════════ */}
                {activeTab === 'login' && (
                  <>
                    {/* Error Alert Banner */}
                    {errorMessage && (
                      <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2.5 animate-in fade-in duration-200">
                        <span className="material-symbols-outlined text-red-600 text-[20px] shrink-0">error</span>
                        <span className="font-semibold leading-relaxed">{errorMessage}</span>
                      </div>
                    )}

                    <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                      {/* Pilih Kelompok Mengajar */}
                      <div className="flex flex-col">
                        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1" htmlFor="login-group">
                          Pilih Kelompok Mengajar
                        </label>
                        <div className="relative flex items-center">
                          <select
                            id="login-group"
                            value={selectedLoginGroup}
                            onChange={(e) => {
                              setSelectedLoginGroup(e.target.value);
                              if (errorMessage) setErrorMessage('');
                            }}
                            className="w-full py-2.5 px-3 bg-white border border-slate-300 focus:border-[#e20113] rounded-lg text-slate-900 text-xs focus:outline-none transition-colors appearance-none cursor-pointer pr-10"
                          >
                            {selectableGroups.map((g) => (
                              <option key={g.number} value={g.number}>
                                KEL-{g.number} — {g.schoolName}
                              </option>
                            ))}
                          </select>
                          <span className="material-symbols-outlined text-slate-400 absolute right-3 pointer-events-none text-[18px]">
                            expand_more
                          </span>
                        </div>
                      </div>

                      {/* NIS / Email */}
                      <div className="flex flex-col">
                        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1" htmlFor="identity">
                          NIS atau Email Institusi
                        </label>
                        <div className="relative flex items-center">
                          <input
                            id="identity"
                            type="text"
                            value={identity}
                            onChange={(e) => {
                              setIdentity(e.target.value);
                              if (errorMessage) setErrorMessage('');
                            }}
                            placeholder="Masukkan NIS atau Email Institusi"
                            required
                            className="w-full py-2.5 px-3 bg-white border border-slate-300 focus:border-[#e20113] rounded-lg text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none transition-colors"
                          />
                          <span className="material-symbols-outlined text-slate-400 absolute right-3 pointer-events-none text-[18px]">
                            alternate_email
                          </span>
                        </div>
                      </div>

                      {/* Password */}
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider" htmlFor="password">
                            Kata Sandi
                          </label>
                        </div>
                        <div className="relative flex items-center">
                          <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              if (errorMessage) setErrorMessage('');
                            }}
                            placeholder="••••••••"
                            required
                            className="w-full py-2.5 px-3 pr-10 bg-white border border-slate-300 focus:border-[#e20113] rounded-lg text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 text-slate-400 hover:text-slate-800 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {showPassword ? 'visibility' : 'visibility_off'}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Remember me & forgot password */}
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="rounded border-slate-300 text-[#e20113] focus:ring-[#e20113]"
                          />
                          <span className="text-slate-600 font-medium">Ingat saya</span>
                        </label>
                        <a
                          href="#lupa"
                          onClick={(e) => {
                            e.preventDefault();
                            showToast('Silakan hubungi Guru Pembimbing atau Koordinator IT.', 'info');
                          }}
                          className="text-slate-500 hover:text-[#e20113] transition-colors"
                        >
                          Lupa kata sandi?
                        </a>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-2 h-11 bg-[#e20113] hover:bg-[#b4000c] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-70"
                      >
                        {isLoading ? (
                          <>
                            <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                            <span>Memverifikasi...</span>
                          </>
                        ) : (
                          <>
                            <span>Masuk Sekarang</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}

                {/* ══════════════════════════════════════════════════════════════
                    TAB 2: AKTIVASI KETUA BARU (ONE-LEADER-PER-GROUP CLAIM)
                ══════════════════════════════════════════════════════════════ */}
                {activeTab === 'claim' && (
                  <>
                    {/* Security Notice */}
                    <div className="mb-4 p-3 bg-amber-50/80 border border-amber-200 text-amber-800 text-[11px] rounded-xl flex items-start gap-2">
                      <span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0 mt-0.5">verified_user</span>
                      <p className="leading-snug">
                        <strong>Aturan Sistem:</strong> Satu kelompok hanya memiliki 1 akun Ketua. Masukkan NIS Anda untuk verifikasi daftar anggota resmi.
                      </p>
                    </div>

                    {/* Claim Error Alert Banner */}
                    {claimErrorMessage && (
                      <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2.5 animate-in fade-in duration-200">
                        <span className="material-symbols-outlined text-red-600 text-[20px] shrink-0">error</span>
                        <span className="font-semibold leading-relaxed">{claimErrorMessage}</span>
                      </div>
                    )}

                    <form onSubmit={handleClaimSubmit} className="flex flex-col gap-4">
                      {/* Dropdown: Pilih Kelompok (KEL-01 to KEL-24) */}
                      <div className="flex flex-col">
                        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1" htmlFor="select-group">
                          Pilih Kelompok
                        </label>
                        <select
                          id="select-group"
                          value={selectedGroup}
                          onChange={(e) => {
                            setSelectedGroup(e.target.value);
                            if (claimErrorMessage) setClaimErrorMessage('');
                          }}
                          required
                          className="w-full py-2.5 px-3 bg-white border border-slate-300 focus:border-[#e20113] rounded-lg text-slate-900 text-xs focus:outline-none transition-colors"
                        >
                          {selectableGroups.map((g) => {
                            const isClaimed = Boolean(g.hasLeader);
                            return (
                              <option
                                key={g.number}
                                value={g.number}
                                disabled={isClaimed}
                                className={isClaimed ? 'text-slate-400 bg-slate-50' : 'text-slate-900 font-semibold'}
                              >
                                {isClaimed
                                  ? `KEL-${g.number} — ${g.schoolName} (Ketua Sudah Terdaftar)`
                                  : `KEL-${g.number} — ${g.schoolName} (Tersedia untuk Aktivasi)`}
                              </option>
                            );
                          })}
                        </select>
                        <span className="text-[10px] text-slate-400 mt-1">
                          Kelompok dengan tanda (Ketua Sudah Terdaftar) terkunci permanen.
                        </span>
                      </div>

                      {/* Input: Masukkan NIS Anda */}
                      <div className="flex flex-col">
                        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1" htmlFor="claim-nis">
                          Masukkan NIS Anda
                        </label>
                        <div className="relative flex items-center">
                          <input
                            id="claim-nis"
                            type="text"
                            value={claimNis}
                            onChange={(e) => {
                              setClaimNis(e.target.value);
                              if (claimErrorMessage) setClaimErrorMessage('');
                            }}
                            placeholder="Contoh: 54124330"
                            required
                            className="w-full py-2.5 px-3 bg-white border border-slate-300 focus:border-[#e20113] rounded-lg text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none transition-colors"
                          />
                          <span className="material-symbols-outlined text-slate-400 absolute right-3 pointer-events-none text-[18px]">
                            badge
                          </span>
                        </div>
                      </div>

                      {/* Input: Buat Kata Sandi Baru */}
                      <div className="flex flex-col">
                        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1" htmlFor="claim-password">
                          Buat Kata Sandi Baru
                        </label>
                        <div className="relative flex items-center">
                          <input
                            id="claim-password"
                            type={showClaimPassword ? 'text' : 'password'}
                            value={claimPassword}
                            onChange={(e) => {
                              setClaimPassword(e.target.value);
                              if (claimErrorMessage) setClaimErrorMessage('');
                            }}
                            placeholder="Minimal 6 karakter"
                            required
                            minLength={6}
                            className="w-full py-2.5 px-3 pr-10 bg-white border border-slate-300 focus:border-[#e20113] rounded-lg text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowClaimPassword(!showClaimPassword)}
                            className="absolute right-3 text-slate-400 hover:text-slate-800 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {showClaimPassword ? 'visibility' : 'visibility_off'}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Submit Claim Button */}
                      <button
                        type="submit"
                        disabled={isClaimLoading}
                        className="w-full mt-2 h-11 bg-[#e20113] hover:bg-[#b4000c] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-70"
                      >
                        {isClaimLoading ? (
                          <>
                            <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                            <span>Memverifikasi Roster...</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[18px]">key</span>
                            <span>Aktivasi Akun Ketua Sekarang</span>
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}

                {/* Footer notes */}
                <div className="mt-8 pt-6 border-t border-slate-200 text-center sm:text-left space-y-2">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Siswa anggota kelompok yang bukan ketua? Pantau pembaruan dan pengumuman sprint langsung di{' '}
                    <span
                      onClick={() => navigate('/')}
                      className="text-slate-800 font-semibold underline cursor-pointer"
                    >
                      beranda publik
                    </span>.
                  </p>
                  <p className="text-xs text-slate-500 pt-1">
                    Guru Pembimbing atau Koordinator?{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/admin/login')}
                      className="text-[#e20113] hover:text-[#b4000c] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Masuk melalui Portal Admin →</span>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 py-4 px-6 md:px-12 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>SMK Telkom Sidoarjo • Inisiatif Pengabdian Masyarakat 2026</span>
        <span>Bantuan IT & Kendala: helpdesk@smktelkom-sda.sch.id</span>
      </footer>
    </div>
  );
};
