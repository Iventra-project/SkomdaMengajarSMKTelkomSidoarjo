"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../../components/BrandLogo';

export const LoginPage: React.FC = () => {
  const {
    navigate,
    currentUser,
    showToast,
    groups,
    login,
    loginAdmin,
    claimGroupLeader,
  } = useApp();

  // Role Tab State: 'leader' (Ketua Kelompok) vs 'admin' (Guru Pembimbing / Admin)
  const [activeRole, setActiveRole] = useState<'leader' | 'admin'>('leader');

  // Sub-mode for Leader Tab: 'login' (Masuk Ketua) vs 'claim' (Aktivasi Ketua Baru)
  const [leaderMode, setLeaderMode] = useState<'login' | 'claim'>('login');

  // ────────────────────────────────────────────────────────────────────────────
  // TAB 1: KETUA KELOMPOK STATE
  // ────────────────────────────────────────────────────────────────────────────
  const [selectedLoginGroup, setSelectedLoginGroup] = useState('03');
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLeaderLoading, setIsLeaderLoading] = useState(false);
  const [leaderErrorMessage, setLeaderErrorMessage] = useState('');

  // Claim Mode (Aktivasi Ketua Baru) State
  const selectableGroups = useMemo(() => {
    return groups
      .filter((g) => g.number !== '00')
      .sort((a, b) => parseInt(a.number, 10) - parseInt(b.number, 10));
  }, [groups]);

  const firstUnassignedGroup = useMemo(() => {
    const unassigned = selectableGroups.find((g) => !g.hasLeader);
    return unassigned ? unassigned.number : '23';
  }, [selectableGroups]);

  const [claimGroup, setClaimGroup] = useState(firstUnassignedGroup);
  const [claimNis, setClaimNis] = useState('');
  const [claimPassword, setClaimPassword] = useState('');
  const [showClaimPassword, setShowClaimPassword] = useState(false);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [claimErrorMessage, setClaimErrorMessage] = useState('');

  // ────────────────────────────────────────────────────────────────────────────
  // TAB 2: GURU PEMBIMBING / ADMIN STATE (2-FIELD FORM ONLY, NO PIN!)
  // ────────────────────────────────────────────────────────────────────────────
  const [adminIdentity, setAdminIdentity] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [adminErrorMessage, setAdminErrorMessage] = useState('');
  const [isAdminStudentBlocked, setIsAdminStudentBlocked] = useState(false);

  // ────────────────────────────────────────────────────────────────────────────
  // DETECT ?role=admin FROM URL PARAMETER OR HASH
  // ────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const checkRoleParam = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash;
      const hashQuery = hash.includes('?') ? hash.split('?')[1] : '';
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(hashQuery);

      if (searchParams.get('role') === 'admin' || hashParams.get('role') === 'admin') {
        setActiveRole('admin');
      }
    };

    checkRoleParam();
    window.addEventListener('hashchange', checkRoleParam);
    return () => window.removeEventListener('hashchange', checkRoleParam);
  }, []);

  // Auto-redirect if user already has an active session
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard/ketua');
      }
    }
  }, [currentUser, navigate]);

  // Keep claimGroup synced if firstUnassignedGroup changes
  useEffect(() => {
    if (!claimGroup) {
      setClaimGroup(firstUnassignedGroup);
    }
  }, [firstUnassignedGroup, claimGroup]);

  // ────────────────────────────────────────────────────────────────────────────
  // TAB 1 SUBMIT: KETUA KELOMPOK
  // ────────────────────────────────────────────────────────────────────────────
  const handleLeaderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeaderErrorMessage('');

    const trimmedIdentity = identity.trim();
    const trimmedPassword = password.trim();

    if (!trimmedIdentity || !trimmedPassword) {
      setLeaderErrorMessage('NIS/Email dan kata sandi wajib diisi.');
      showToast('NIS/Email dan kata sandi wajib diisi.', 'warning');
      return;
    }

    // Check for Admin credentials entered in student tab
    const lower = trimmedIdentity.toLowerCase();
    if (
      lower === 'admin' ||
      lower === 'admin@smktelkom-sda.sch.id' ||
      lower.includes('admin.kurikulum') ||
      lower.includes('sri.wahyuni') ||
      lower.includes('pembimbing')
    ) {
      const adminReject =
        'Akun Guru Pembimbing/Admin silakan masuk melalui tab Guru Pembimbing / Admin.';
      setLeaderErrorMessage(adminReject);
      showToast(adminReject, 'warning');
      return;
    }

    setIsLeaderLoading(true);
    try {
      const res = await login(trimmedIdentity, trimmedPassword, selectedLoginGroup);
      if (!res.ok) {
        setLeaderErrorMessage(res.error || 'NIS/Email atau kata sandi tidak sesuai.');
        showToast(res.error || 'NIS/Email atau kata sandi tidak sesuai.', 'warning');
      }
    } finally {
      setIsLeaderLoading(false);
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // TAB 1 SUBMIT: AKTIVASI KETUA BARU
  // ────────────────────────────────────────────────────────────────────────────
  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClaimErrorMessage('');

    if (!claimGroup) {
      setClaimErrorMessage('Silakan pilih kelompok yang akan diaktivasi.');
      return;
    }
    if (!claimNis.trim() || !claimPassword.trim()) {
      setClaimErrorMessage('NIS dan kata sandi baru wajib diisi.');
      return;
    }

    setIsClaimLoading(true);
    try {
      const res = await claimGroupLeader(claimGroup, claimNis.trim(), claimPassword.trim());
      if (!res.ok) {
        setClaimErrorMessage(res.error || 'Gagal mengaktivasi akun ketua.');
        showToast(res.error || 'Gagal mengaktivasi akun ketua.', 'warning');
      }
    } finally {
      setIsClaimLoading(false);
    }
  };

  // ────────────────────────────────────────────────────────────────────────────
  // TAB 2 SUBMIT: GURU PEMBIMBING / ADMIN (2-FIELD FORM, NO PIN)
  // ────────────────────────────────────────────────────────────────────────────
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminErrorMessage('');
    setIsAdminStudentBlocked(false);

    const trimmedIdentity = adminIdentity.trim();
    const trimmedPassword = adminPassword.trim();

    if (!trimmedIdentity || !trimmedPassword) {
      setAdminErrorMessage('Email Institusi/NIP dan kata sandi wajib diisi.');
      showToast('Lengkapi identitas dan kata sandi pembimbing.', 'warning');
      return;
    }

    setIsAdminLoading(true);
    try {
      const res = await loginAdmin(trimmedIdentity, trimmedPassword);
      if (!res.ok) {
        if (res.isStudentAttempt) {
          setIsAdminStudentBlocked(true);
        } else {
          setAdminErrorMessage(res.error || 'Identitas atau kata sandi pembimbing tidak sesuai.');
          showToast(res.error || 'Autentikasi gagal.', 'warning');
        }
      }
    } finally {
      setIsAdminLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full font-sans text-slate-800 antialiased flex flex-col justify-between overflow-x-hidden selection:bg-[#E50914]/10 selection:text-[#E50914]"
      style={{
        background:
          'radial-gradient(circle at 12% 15%, rgba(229,9,20,0.06), transparent 45%), radial-gradient(circle at 88% 85%, rgba(15,23,42,0.05), transparent 45%), #FAFAFA',
      }}
    >
      {/* ══════════════════════════════════════════════════════════════════════════
          NON-PLAIN MODERN ACCENTED BACKGROUND CANVAS (GPU COMPOSITED)
      ══════════════════════════════════════════════════════════════════════════ */}
      {/* Subtle Architectural Dot-Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-65 pointer-events-none transform-gpu" />

      {/* ══════════════════════════════════════════════════════════════════════════
          TOP-LEFT NAVIGATION: PROMINENT PILL BUTTON (NO NAVBAR)
      ══════════════════════════════════════════════════════════════════════════ */}
      <header className="relative z-20 w-full px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-[#141416] hover:border-[#E50914] hover:text-[#E50914] rounded-full text-xs font-semibold shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Kembali ke Beranda</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-[#E50914]" />
          <span>Sistem Informasi Terpadu • Skomda Mengajar 2026</span>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════════
          MAIN UNIFIED AUTHENTICATION CARD
      ══════════════════════════════════════════════════════════════════════════ */}
      <main className="relative z-10 flex-1 w-full flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-5xl mx-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-[28px] border border-slate-200/80 shadow-[0_16px_50px_-12px_rgba(0,0,0,0.06)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 p-3 sm:p-4 gap-4">

            {/* ──────────────────────────────────────────────────────────────────
                LEFT COLUMN: ELEGANT EDITORIAL SHOWCASE
            ────────────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-6 relative flex flex-col justify-between overflow-hidden rounded-[22px] bg-gradient-to-br from-slate-50 via-rose-50/20 to-slate-100/60 p-6 sm:p-8 border border-slate-200/70">

              {/* Header Info */}
              <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white border border-slate-200/80 text-slate-700 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#E50914]" />
                    Portal Masuk Terpadu
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono tracking-wider">#Impact2026</span>
                </div>

                <div className="pt-1">
                  <BrandLogo size="lg" />
                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 max-w-md leading-relaxed">
                    Akses koordinasi tunggal bagi ketua kelompok relawan siswa dan guru pembimbing lapangan SMK Telkom Sidoarjo di 12 SMP mitra.
                  </p>
                </div>
              </div>

              {/* Main Visual: Framed Photography with Dynamic Overlays */}
              <div className="relative z-10 my-6">
                <div className="relative w-full h-[210px] sm:h-[240px] rounded-2xl overflow-hidden shadow-sm border border-white">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    alt="Dokumentasi Mengajar Skomda di SMP"
                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent flex items-end p-4">
                    <div className="flex items-center gap-2 text-white text-xs font-medium">
                      <span className="material-symbols-outlined text-[17px] text-emerald-400">verified</span>
                      <span>Laboratorium Komputer &amp; Kelas SMP Mitra</span>
                    </div>
                  </div>
                </div>

                {/* Floating Glass Pill: Status Verifikasi */}
                <div className="absolute -bottom-3 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-100 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-rose-50 text-[#E50914] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[15px]">school</span>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-800">12 SMP Mitra</div>
                    <div className="text-[9px] text-slate-400">Terjadwal di Sidoarjo</div>
                  </div>
                </div>
              </div>

              {/* Bottom Metrics Pill Bar */}
              <div className="relative z-10 grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60">
                <div className="text-center bg-white/70 backdrop-blur-xs py-2 px-1 rounded-xl border border-slate-200/50">
                  <div className="text-sm font-bold text-slate-900">24 Tim</div>
                  <div className="text-[10px] text-slate-500">Relawan Siswa</div>
                </div>
                <div className="text-center bg-white/70 backdrop-blur-xs py-2 px-1 rounded-xl border border-slate-200/50">
                  <div className="text-sm font-bold text-slate-900">12 SMP</div>
                  <div className="text-[10px] text-slate-500">Mitra Lapangan</div>
                </div>
                <div className="text-center bg-white/70 backdrop-blur-xs py-2 px-1 rounded-xl border border-slate-200/50">
                  <div className="text-sm font-bold text-emerald-600">1 Portal</div>
                  <div className="text-[10px] text-slate-500">Terpadu &amp; Aman</div>
                </div>
              </div>
            </div>

            {/* ──────────────────────────────────────────────────────────────────
                RIGHT COLUMN: ROLE SWITCHER TABS & AUTHENTICATION FORMS
            ────────────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-6 flex flex-col justify-center px-4 sm:px-8 py-5 sm:py-7">
              <div className="w-full max-w-sm sm:max-w-md mx-auto flex flex-col">

                {/* ══════════════════════════════════════════════════════════════
                    PROMINENT ROLE SWITCHER PILL TABS
                ══════════════════════════════════════════════════════════════ */}
                <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-6 border border-slate-200/80 select-none">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveRole('leader');
                      setLeaderErrorMessage('');
                      setAdminErrorMessage('');
                    }}
                    className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeRole === 'leader'
                        ? 'bg-white text-[#141416] shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[17px]">groups</span>
                    <span>Ketua Kelompok</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveRole('admin');
                      setLeaderErrorMessage('');
                      setAdminErrorMessage('');
                      setIsAdminStudentBlocked(false);
                    }}
                    className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeRole === 'admin'
                        ? 'bg-white text-[#E50914] shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[17px]">shield_person</span>
                    <span>Guru Pembimbing / Admin</span>
                  </button>
                </div>

                {/* ══════════════════════════════════════════════════════════════
                    ROLE TAB 1: KETUA KELOMPOK (STUDENT LEADER)
                ══════════════════════════════════════════════════════════════ */}
                {activeRole === 'leader' && (
                  <div className="flex flex-col">
                    {/* Header */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                          {leaderMode === 'login' ? 'Masuk Ketua Kelompok' : 'Aktivasi Ketua Baru'}
                        </h1>
                        <button
                          type="button"
                          onClick={() => {
                            setLeaderMode(leaderMode === 'login' ? 'claim' : 'login');
                            setLeaderErrorMessage('');
                            setClaimErrorMessage('');
                          }}
                          className="text-[11px] text-[#E50914] hover:underline font-semibold cursor-pointer"
                        >
                          {leaderMode === 'login' ? 'Aktivasi Ketua Baru →' : 'Kembali ke Masuk →'}
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {leaderMode === 'login'
                          ? 'Pilih kelompok dan masukkan kredensial ketua terdaftar.'
                          : 'Klaim penugasan ketua kelompok untuk pertama kali.'}
                      </p>
                    </div>

                    {/* Mode A: Masuk Ketua Kelompok */}
                    {leaderMode === 'login' && (
                      <>
                        {leaderErrorMessage && (
                          <div className="mb-4 p-3.5 bg-red-50 border border-red-200/80 text-red-700 text-xs rounded-xl flex items-center gap-2.5 animate-in fade-in duration-200">
                            <span className="material-symbols-outlined text-red-600 text-[18px] shrink-0">error</span>
                            <span className="font-semibold leading-relaxed">{leaderErrorMessage}</span>
                          </div>
                        )}

                        <form onSubmit={handleLeaderSubmit} className="space-y-3.5">
                          {/* Pilih Kelompok Mengajar */}
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="login-group">
                              Pilih Kelompok Mengajar
                            </label>
                            <div className="relative flex items-center">
                              <select
                                id="login-group"
                                value={selectedLoginGroup}
                                onChange={(e) => {
                                  setSelectedLoginGroup(e.target.value);
                                  if (leaderErrorMessage) setLeaderErrorMessage('');
                                }}
                                className="w-full h-11 px-3.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#E50914] focus:ring-3 focus:ring-[#E50914]/10 rounded-xl text-xs sm:text-sm text-slate-900 outline-none transition-all duration-200 appearance-none cursor-pointer pr-10"
                              >
                                {selectableGroups.map((g) => (
                                  <option key={g.number} value={g.number}>
                                    KEL-{g.number} — {g.schoolName} {g.hasLeader ? '(Ketua Terdaftar)' : ''}
                                  </option>
                                ))}
                              </select>
                              <span className="material-symbols-outlined text-slate-400 absolute right-3 pointer-events-none text-[18px]">
                                expand_more
                              </span>
                            </div>
                          </div>

                          {/* NIS atau Email */}
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="identity">
                              NIS atau Email Institusi
                            </label>
                            <div className="relative flex items-center">
                              <input
                                id="identity"
                                type="text"
                                value={identity}
                                onChange={(e) => {
                                  setIdentity(e.target.value);
                                  if (leaderErrorMessage) setLeaderErrorMessage('');
                                }}
                                placeholder="Masukkan NIS atau Email Institusi"
                                required
                                className="w-full h-11 px-3.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#E50914] focus:ring-3 focus:ring-[#E50914]/10 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200"
                              />
                              <span className="material-symbols-outlined text-slate-400 absolute right-3 pointer-events-none text-[18px]">
                                person
                              </span>
                            </div>
                          </div>

                          {/* Kata Sandi */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs font-medium text-slate-700" htmlFor="password">
                                Kata Sandi
                              </label>
                              <a
                                href="#lupa"
                                onClick={(e) => {
                                  e.preventDefault();
                                  showToast('Silakan hubungi Guru Pembimbing atau Koordinator IT.', 'info');
                                }}
                                className="text-[11px] text-slate-400 hover:text-[#E50914] transition-colors"
                              >
                                Lupa sandi?
                              </a>
                            </div>
                            <div className="relative flex items-center">
                              <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => {
                                  setPassword(e.target.value);
                                  if (leaderErrorMessage) setLeaderErrorMessage('');
                                }}
                                placeholder="••••••••"
                                required
                                className="w-full h-11 px-3.5 pr-10 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#E50914] focus:ring-3 focus:ring-[#E50914]/10 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  {showPassword ? 'visibility' : 'visibility_off'}
                                </span>
                              </button>
                            </div>
                          </div>

                          {/* Remember me */}
                          <div className="flex items-center justify-between pt-0.5 text-xs">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="rounded border-slate-300 text-[#E50914] focus:ring-[#E50914]"
                              />
                              <span className="text-slate-600 font-medium">Ingat sesi saya</span>
                            </label>
                          </div>

                          {/* Submit Leader */}
                          <div className="pt-2">
                            <button
                              type="submit"
                              disabled={isLeaderLoading}
                              className="w-full h-11 sm:h-12 bg-[#141416] hover:bg-black active:scale-[0.99] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md disabled:opacity-60"
                            >
                              {isLeaderLoading ? (
                                <>
                                  <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                                  <span>Memverifikasi Ketua...</span>
                                </>
                              ) : (
                                <>
                                  <span>Masuk sebagai Ketua Kelompok</span>
                                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      </>
                    )}

                    {/* Mode B: Aktivasi Ketua Baru */}
                    {leaderMode === 'claim' && (
                      <>
                        <div className="mb-3.5 p-3 bg-amber-50/80 border border-amber-200 text-amber-800 text-[11px] rounded-xl flex items-start gap-2">
                          <span className="material-symbols-outlined text-amber-600 text-[17px] shrink-0 mt-0.5">verified_user</span>
                          <p className="leading-snug">
                            <strong>Aturan Sistem:</strong> Satu kelompok hanya memiliki 1 akun Ketua. Masukkan NIS Anda untuk verifikasi daftar anggota resmi kelompok.
                          </p>
                        </div>

                        {claimErrorMessage && (
                          <div className="mb-4 p-3 bg-red-50 border border-red-200/80 text-red-700 text-xs rounded-xl flex items-center gap-2">
                            <span className="material-symbols-outlined text-red-600 text-[18px] shrink-0">error</span>
                            <span className="font-semibold leading-relaxed">{claimErrorMessage}</span>
                          </div>
                        )}

                        <form onSubmit={handleClaimSubmit} className="space-y-3.5">
                          {/* Dropdown Kelompok */}
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="select-group">
                              Pilih Kelompok yang Belum Terdaftar
                            </label>
                            <select
                              id="select-group"
                              value={claimGroup}
                              onChange={(e) => {
                                setClaimGroup(e.target.value);
                                if (claimErrorMessage) setClaimErrorMessage('');
                              }}
                              required
                              className="w-full h-11 px-3.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#E50914] focus:ring-3 focus:ring-[#E50914]/10 rounded-xl text-xs sm:text-sm text-slate-900 outline-none transition-all duration-200 cursor-pointer"
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
                                      ? `KEL-${g.number} — ${g.schoolName} (Ketua Terdaftar)`
                                      : `KEL-${g.number} — ${g.schoolName} (Tersedia)`}
                                  </option>
                                );
                              })}
                            </select>
                          </div>

                          {/* NIS */}
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="claim-nis">
                              NIS Anda
                            </label>
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
                              className="w-full h-11 px-3.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#E50914] focus:ring-3 focus:ring-[#E50914]/10 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200"
                            />
                          </div>

                          {/* Password Baru */}
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="claim-password">
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
                                className="w-full h-11 px-3.5 pr-10 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#E50914] focus:ring-3 focus:ring-[#E50914]/10 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200"
                              />
                              <button
                                type="button"
                                onClick={() => setShowClaimPassword(!showClaimPassword)}
                                className="absolute right-3 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  {showClaimPassword ? 'visibility' : 'visibility_off'}
                                </span>
                              </button>
                            </div>
                          </div>

                          {/* Submit Claim */}
                          <div className="pt-2">
                            <button
                              type="submit"
                              disabled={isClaimLoading}
                              className="w-full h-11 sm:h-12 bg-[#E50914] hover:bg-[#c90812] active:scale-[0.99] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-60"
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
                          </div>
                        </form>
                      </>
                    )}
                  </div>
                )}

                {/* ══════════════════════════════════════════════════════════════
                    ROLE TAB 2: GURU PEMBIMBING / ADMIN (NO 6-DIGIT PIN!)
                ══════════════════════════════════════════════════════════════ */}
                {activeRole === 'admin' && (
                  <div className="flex flex-col">
                    {/* Header */}
                    <div className="mb-5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#E50914] uppercase tracking-wider mb-1">
                        <span className="w-2 h-2 rounded-full bg-[#E50914]" />
                        <span>Portal Otorisasi Kurikulum</span>
                      </div>
                      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Masuk Guru Pembimbing
                      </h1>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Masukkan Email Institusi atau NIP pembimbing dan kata sandi resmi.
                      </p>
                    </div>

                    {/* Student Rejection Alert */}
                    {isAdminStudentBlocked && (
                      <div className="mb-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-2.5 animate-in fade-in duration-200">
                        <div className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-[18px] text-[#E50914] shrink-0 mt-0.5">
                            lock
                          </span>
                          <div className="flex-1">
                            <span className="font-bold block text-slate-900 mb-0.5">
                              Akses ditolak: Akun siswa tidak terdaftar sebagai Guru Pembimbing/Admin.
                            </span>
                            <p className="text-slate-600 leading-normal">
                              Siswa Ketua Kelompok silakan gunakan tab Ketua Kelompok di sebelah kiri.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveRole('leader');
                            setIsAdminStudentBlocked(false);
                          }}
                          className="w-full py-2 bg-[#141416] hover:bg-black text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Beralih ke Tab Ketua Kelompok</span>
                          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                        </button>
                      </div>
                    )}

                    {/* Admin Generic Error */}
                    {adminErrorMessage && !isAdminStudentBlocked && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200/80 rounded-xl text-red-700 text-xs flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[#E50914]">error</span>
                        <span className="font-medium">{adminErrorMessage}</span>
                      </div>
                    )}

                    {/* Simple 2-Field Form (NO PIN!) */}
                    <form onSubmit={handleAdminSubmit} className="space-y-4">
                      {/* Field 1: Email Institusi / NIP Pembimbing */}
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="admin-identity">
                          Email Institusi / NIP Pembimbing
                        </label>
                        <div className="relative flex items-center">
                          <input
                            id="admin-identity"
                            type="text"
                            value={adminIdentity}
                            onChange={(e) => {
                              setAdminIdentity(e.target.value);
                              if (adminErrorMessage) setAdminErrorMessage('');
                              if (isAdminStudentBlocked) setIsAdminStudentBlocked(false);
                            }}
                            placeholder="admin@smktelkom-sda.sch.id atau NIP"
                            required
                            className="w-full h-11 sm:h-12 px-3.5 sm:px-4 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#E50914] focus:ring-3 focus:ring-[#E50914]/10 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200"
                          />
                          <span className="material-symbols-outlined text-slate-400 absolute right-3.5 pointer-events-none text-[18px]">
                            alternate_email
                          </span>
                        </div>
                      </div>

                      {/* Field 2: Kata Sandi */}
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="admin-password">
                          Kata Sandi
                        </label>
                        <div className="relative flex items-center">
                          <input
                            id="admin-password"
                            type={showAdminPassword ? 'text' : 'password'}
                            value={adminPassword}
                            onChange={(e) => {
                              setAdminPassword(e.target.value);
                              if (adminErrorMessage) setAdminErrorMessage('');
                            }}
                            placeholder="Masukkan kata sandi pembimbing"
                            required
                            className="w-full h-11 sm:h-12 px-3.5 sm:px-4 pr-10 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#E50914] focus:ring-3 focus:ring-[#E50914]/10 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={() => setShowAdminPassword(!showAdminPassword)}
                            className="absolute right-3.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {showAdminPassword ? 'visibility' : 'visibility_off'}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Information Note */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-[11px] text-slate-600 flex items-start gap-2">
                        <span className="material-symbols-outlined text-[16px] text-slate-400 shrink-0 mt-0.5">info</span>
                        <div className="space-y-1">
                          <span className="block">
                            Portal khusus <strong>Admin Kurikulum</strong> &amp; <strong>Guru Pembimbing</strong> SMK Telkom Sidoarjo.
                          </span>
                          <span className="block text-[10px] text-slate-500">
                            • Admin: <code>admin@smktelkom-sda.sch.id</code><br />
                            • Pembimbing: <code>sri.wahyuni@smktelkom-sda.sch.id</code> / <code>budi.hartono@smktelkom-sda.sch.id</code> (<code>Skomda2026!</code>)
                          </span>
                        </div>
                      </div>

                      {/* Submit Admin Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isAdminLoading}
                          className="w-full h-11 sm:h-12 bg-[#E50914] hover:bg-[#c90812] active:scale-[0.99] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(229,9,20,0.2)] hover:shadow-[0_6px_18px_rgba(229,9,20,0.3)] disabled:opacity-60"
                        >
                          {isAdminLoading ? (
                            <>
                              <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                              <span>Memverifikasi Otorisasi...</span>
                            </>
                          ) : (
                            <>
                              <span>Masuk Portal Pembimbing</span>
                              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* ══════════════════════════════════════════════════════════════
                    SHARED FOOTER NOTES
                ══════════════════════════════════════════════════════════════ */}
                <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col gap-1.5 text-center sm:text-left">
                  <p className="text-xs text-slate-500">
                    Siswa anggota kelompok yang bukan ketua? Pantau kegiatan dan dokumentasi di{' '}
                    <span
                      onClick={() => navigate('/')}
                      className="text-[#E50914] hover:underline font-semibold cursor-pointer"
                    >
                      Beranda Publik →
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Kendala akses akun? Hubungi helpdesk@smktelkom-sda.sch.id
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════════════ */}
      <footer className="relative z-10 w-full border-t border-slate-200/70 py-4 px-6 md:px-12 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 bg-white/70 backdrop-blur-xs">
        <span>SMK Telkom Sidoarjo • Direktorat Kurikulum &amp; Kesiswaan 2026</span>
        <span>Bantuan &amp; Helpdesk: helpdesk@smktelkom-sda.sch.id</span>
      </footer>
    </div>
  );
};
