"use client";
import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { BrandLogo } from '../../../components/BrandLogo';
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  School,
  FileCheck2,
  Sparkles,
  Users,
  Award,
  Layers,
  HelpCircle,
  Building2,
  Check,
} from 'lucide-react';

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80';

export const AdminLoginPage: React.FC = () => {
  const { navigate, currentUser, showToast, loginAdmin } = useApp();

  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [authorizationPin, setAuthorizationPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isStudentBlocked, setIsStudentBlocked] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsStudentBlocked(false);

    const trimmedIdentity = identity.trim();
    const trimmedPassword = password.trim();
    const trimmedPin = authorizationPin.trim();

    if (!trimmedIdentity || !trimmedPassword || !trimmedPin) {
      setErrorMessage('Semua field wajib diisi (Email/NIP, Kata Sandi, dan Kode PIN 6 Digit).');
      showToast('Lengkapi ketiga faktor verifikasi pembimbing.', 'warning');
      return;
    }

    if (trimmedPin.length !== 6) {
      setErrorMessage('Kode Otorisasi Kurikulum wajib terdiri dari 6 digit.');
      showToast('PIN wajib 6 digit.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginAdmin(trimmedIdentity, trimmedPassword, trimmedPin);
      if (!res.ok) {
        if (res.isStudentAttempt) {
          setIsStudentBlocked(true);
        } else {
          setErrorMessage(res.error || 'Verifikasi gagal. Periksa kembali data Anda.');
          showToast(res.error || 'Verifikasi gagal.', 'warning');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#F8F9FA] font-sans text-slate-800 antialiased min-h-screen flex flex-col justify-between selection:bg-[#E50914] selection:text-white relative overflow-x-hidden">
      {/* Decorative Soft Ambient Radial Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/6 w-[450px] h-[450px] bg-slate-200/60 rounded-full blur-3xl pointer-events-none" />

      {/* ══════════════════════════════════════════════════════════════════════════
          1. FLOATING DARK PILL NAVBAR
      ══════════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-4 z-50 w-full max-w-5xl mx-auto px-4">
        <div className="rounded-full bg-[#141416]/95 backdrop-blur-md border border-white/10 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.25)] px-5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between transition-all">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-300 hover:text-white transition-colors cursor-pointer group"
          >
            <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:-translate-x-0.5 transition-transform">
              <ArrowLeft className="w-3.5 h-3.5 text-zinc-300 group-hover:text-white" />
            </span>
            <span className="uppercase text-[11px] sm:text-xs">Beranda Utama</span>
          </button>

          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              Portal Guru &amp; Kurikulum
            </span>
            <div className="w-7 h-7 rounded-full bg-[#E50914] text-white flex items-center justify-center font-black text-xs shadow-[0_0_12px_rgba(229,9,20,0.5)]">
              GP
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. MAIN WORKSPACE: TWO-COLUMN CRISP BENTO CARD LAYOUT
      ══════════════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 w-full flex items-center justify-center p-4 sm:p-6 md:p-10 relative z-10">
        <div className="w-full max-w-6xl mx-auto py-4 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* ──────────────────────────────────────────────────────────────────
                LEFT COLUMN (lg:col-span-6): RICH VISUAL SHOWCASE & AUTHORITY HUB
            ────────────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-6 flex flex-col justify-between bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-200/60 relative overflow-hidden">
              {/* Subtle top red glow bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E50914] via-[#D7141F] to-[#b4000c]" />

              <div className="space-y-5">
                {/* Brand & Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <BrandLogo size="md" />
                  <span className="bg-red-50 text-[#E50914] border border-red-200/80 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#E50914]" />
                    OTORISASI RESMI KURIKULUM
                  </span>
                </div>

                {/* Editorial Title & Subtitle */}
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                    Portal Otorisasi Guru Pembimbing &amp; Admin Kurikulum
                  </h1>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Pusat kendali dan supervisi terpusat untuk memverifikasi modul ajar, meninjau rancangan X-Banner, memantau 24 kelompok relawan, serta mengesahkan luaran di 12 SMP mitra.
                  </p>
                </div>

                {/* ─── VISUAL SHOWCASE MODULE: EDITORIAL PHOTO FRAME WITH FLOATING PILLS ─── */}
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm group">
                  <img
                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1000&auto=format&fit=crop&q=80"
                    alt="Sesi Bimbingan & Supervisi Guru Skomda Mengajar"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_PHOTO;
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-4 flex flex-col justify-between">
                    {/* Top Floating Pill */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Sesi Supervisi Lapangan Aktif
                      </span>
                      <span className="text-[10px] font-extrabold text-white/90 bg-red-600 px-2 py-0.5 rounded-full">
                        2026
                      </span>
                    </div>

                    {/* Bottom Floating Card */}
                    <div className="p-3 rounded-xl bg-white/95 backdrop-blur-md border border-white/40 shadow-lg text-slate-900 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E50914] flex items-center justify-center font-black text-xs shrink-0">
                          SM
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-black text-slate-900 truncate">
                            SMK Telkom Sidoarjo Mengajar
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            12 SMP Mitra • 24 Kelompok Terbimbing
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
                        Terkonfirmasi
                      </span>
                    </div>
                  </div>
                </div>

                {/* ─── 3-FACTOR VISUAL INFOGRAPHIC PROGRESSION ─── */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    PROTOKOL VERIFIKASI 3-FAKTOR (3FA)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* Step 1 */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between gap-1.5">
                      <div className="flex items-center justify-between">
                        <div className="w-6 h-6 rounded-lg bg-red-100 text-[#E50914] flex items-center justify-center">
                          <School className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] font-mono font-extrabold text-slate-400">
                          01
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          NIP / Email
                        </div>
                        <div className="text-[10px] text-slate-500 leading-tight">
                          Identitas resmi pendidik
                        </div>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between gap-1.5">
                      <div className="flex items-center justify-between">
                        <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] font-mono font-extrabold text-slate-400">
                          02
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Kata Sandi
                        </div>
                        <div className="text-[10px] text-slate-500 leading-tight">
                          Enkripsi sesi berlapis
                        </div>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between gap-1.5">
                      <div className="flex items-center justify-between">
                        <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                          <KeyRound className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] font-mono font-extrabold text-slate-400">
                          03
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          PIN Kurikulum
                        </div>
                        <div className="text-[10px] text-slate-500 leading-tight">
                          Otorisasi 6 digit aktif
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Authority Micro-Metrics */}
              <div className="pt-4 mt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-50/70 border border-slate-100">
                  <div className="text-sm font-black text-slate-900">12 SMP</div>
                  <div className="text-[10px] text-slate-500">Sekolah Mitra</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50/70 border border-slate-100">
                  <div className="text-sm font-black text-slate-900">24 Tim</div>
                  <div className="text-[10px] text-slate-500">Relawan Terpantau</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50/70 border border-slate-100">
                  <div className="text-sm font-black text-emerald-700">100%</div>
                  <div className="text-[10px] text-slate-500">Terenkripsi SSL</div>
                </div>
              </div>
            </div>

            {/* ──────────────────────────────────────────────────────────────────
                RIGHT COLUMN (lg:col-span-6): CRISP 3-FACTOR VERIFICATION FORM
            ────────────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-6 flex flex-col justify-center bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-xl shadow-slate-200/60 relative">
              {/* Prominent Student Rejection Warning Banner */}
              {isStudentBlocked && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#E50914] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-black text-rose-900 uppercase tracking-wider">
                        Akses Dilarang: Portal Khusus Guru &amp; Kurikulum
                      </h4>
                      <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                        Halaman ini khusus Guru Pembimbing &amp; Koordinator Kurikulum. Siswa wajib masuk melalui halaman Login Ketua.
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E50914] hover:bg-[#b4000c] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                      >
                        <span>Kembali ke Login Ketua</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Title & Badge */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#E50914] text-[10px] font-extrabold uppercase tracking-wider border border-red-200 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  3-Factor Authentication Gateway
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Masuk Sesi Guru Pembimbing
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Masukkan NIP / Email institusi, kata sandi, dan PIN Otorisasi Kurikulum 6 digit.
                </p>
              </div>

              {/* Generic Error message */}
              {errorMessage && !isStudentBlocked && (
                <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Factor 1: Email / NIP */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider" htmlFor="admin-identity">
                      Email Institusi / NIP Pembimbing
                    </label>
                    <span className="text-[10px] font-semibold text-slate-400">
                      Faktor 1
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      id="admin-identity"
                      type="text"
                      value={identity}
                      onChange={(e) => {
                        setIdentity(e.target.value);
                        if (errorMessage) setErrorMessage('');
                        if (isStudentBlocked) setIsStudentBlocked(false);
                      }}
                      placeholder="admin@smktelkom-sda.sch.id atau NIP"
                      required
                      className="w-full py-3 px-3.5 pl-10 bg-slate-50/70 border border-slate-300 focus:border-[#E50914] focus:bg-white rounded-xl text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Factor 2: Kata Sandi */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider" htmlFor="admin-password">
                      Kata Sandi
                    </label>
                    <span className="text-[10px] font-semibold text-slate-400">
                      Faktor 2
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="Masukkan kata sandi akun pembimbing"
                      required
                      className="w-full py-3 px-3.5 pl-10 pr-10 bg-slate-50/70 border border-slate-300 focus:border-[#E50914] focus:bg-white rounded-xl text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Factor 3: PIN Otorisasi Kurikulum 6 Digit */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider" htmlFor="admin-pin">
                      Kode Otorisasi Kurikulum (PIN 6 Digit)
                    </label>
                    <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                      <KeyRound className="w-3 h-3" />
                      Wajib 6 Angka
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      id="admin-pin"
                      type={showPin ? 'text' : 'password'}
                      value={authorizationPin}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setAuthorizationPin(val);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="••••••"
                      maxLength={6}
                      required
                      className="w-full py-3 px-3.5 pl-10 pr-10 bg-amber-50/40 border border-amber-300 focus:border-amber-500 focus:bg-white rounded-xl text-slate-900 text-xs tracking-widest font-mono font-bold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-100 transition-all"
                    />
                    <KeyRound className="w-4 h-4 text-amber-600 absolute left-3.5 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 leading-normal">
                    PIN 6 Digit diterbitkan resmi oleh Koordinator Kurikulum Skomda Mengajar.
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-3 h-12 bg-[#E50914] hover:bg-[#b4000c] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/35 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Memverifikasi Otorisasi 3FA...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verifikasi &amp; Buka Panel Admin</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Switcher to Student Leader Login */}
              <div className="mt-8 pt-5 border-t border-slate-100 text-center sm:text-left space-y-2">
                <p className="text-xs text-slate-500">
                  Siswa Ketua Kelompok yang ingin mengelola tim?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-[#E50914] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Masuk melalui Login Ketua →</span>
                  </button>
                </p>
                <p className="text-[11px] text-slate-400">
                  Butuh bantuan PIN otorisasi kurikulum? Hubungi Divisi IT SMK Telkom Sidoarjo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. CLEAN INSTITUTIONAL FOOTER
      ══════════════════════════════════════════════════════════════════════════ */}
      <footer className="w-full border-t border-slate-200/80 bg-white/60 backdrop-blur-xs py-4 px-6 md:px-12 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">SMK Telkom Sidoarjo</span>
          <span>•</span>
          <span>Direktorat Kurikulum &amp; Pengabdian Masyarakat 2026</span>
        </div>
        <div className="font-mono text-[11px] text-slate-400">
          helpdesk.kurikulum@smktelkom-sda.sch.id
        </div>
      </footer>
    </div>
  );
};
