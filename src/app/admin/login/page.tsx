"use client";
import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { Navbar } from '../../../components/Navbar';
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
} from 'lucide-react';

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
    <div className="w-full bg-[#0d0e11] font-sans text-slate-100 antialiased min-h-screen flex flex-col justify-between selection:bg-[#E50914] selection:text-white">
      {/* ══════════════════════════════════════════════════════════════════════════
          FLOATING DARK PILL NAVBAR (ADMIN PORTAL)
      ══════════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-4 z-50 w-full max-w-5xl mx-auto px-4">
        <div className="rounded-full bg-[#141416]/95 backdrop-blur-md border border-white/10 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.5)] px-5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between transition-all">
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
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              Portal Guru & Kurikulum
            </span>
            <div className="w-7 h-7 rounded-full bg-[#E50914] text-white flex items-center justify-center font-black text-xs shadow-[0_0_12px_rgba(229,9,20,0.6)]">
              GP
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Login Workspace */}
      <main className="flex-1 w-full flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-5xl mx-auto py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Column: Authoritative Editorial Panel */}
            <div className="lg:col-span-5 relative flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#18191f] to-[#121316] rounded-3xl p-8 lg:p-10 border border-white/10 shadow-2xl">
              {/* Crimson Glow Accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#E50914]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-2.5">
                  <span className="bg-[#E50914] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-widest shadow-sm">
                    OTORISASI RESMI
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    DIREKTORAT KURIKULUM
                  </span>
                </div>

                <div>
                  <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
                    PORTAL OTORISASI GURU PEMBIMBING & ADMIN KURIKULUM
                  </h1>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    Sistem kendali verifikasi modul, monitoring 24 kelompok relawan, review banner, dan penilaian lapangan Skomda Mengajar 2026.
                  </p>
                </div>

                {/* Verification Factors Checklist */}
                <div className="pt-2 space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-[#E50914]/20 text-[#E50914] flex items-center justify-center shrink-0">
                      <School className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">NIP / Email Institusi</div>
                      <div className="text-[11px] text-zinc-400">Verifikasi identitas resmi tenaga pendidik</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Kredensial Sandi</div>
                      <div className="text-[11px] text-zinc-400">Enkripsi sesi berlapis sesuai standar sekolah</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">PIN Kurikulum 6 Digit</div>
                      <div className="text-[11px] text-zinc-400">Kode otorisasi delegasi surat tugas aktif</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Footnote */}
              <div className="relative z-10 pt-8 mt-6 border-t border-white/10 text-[11px] text-zinc-500 flex items-center justify-between">
                <span>SMK Telkom Sidoarjo</span>
                <span className="font-mono text-zinc-400">v2.6-SECURED</span>
              </div>
            </div>

            {/* Right Column: 3-Factor Verification Card */}
            <div className="lg:col-span-7 flex flex-col justify-center bg-[#14151a] rounded-3xl p-8 lg:p-10 border border-white/10 shadow-2xl relative">
              {/* Prominent Student Rejection Warning Banner */}
              {isStudentBlocked && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border-2 border-rose-500/60 shadow-[0_0_24px_rgba(225,29,72,0.3)] animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-black text-rose-200 uppercase tracking-wider">
                        Akses Dilarang: Portal Khusus Guru & Kurikulum
                      </h4>
                      <p className="text-xs text-rose-300 mt-1 leading-relaxed">
                        Halaman ini khusus Guru Pembimbing & Koordinator Kurikulum. Siswa wajib masuk melalui halaman Login Ketua.
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                      >
                        <span>Kembali ke Login Ketua</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Header Title */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[#E50914] text-[10px] font-extrabold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-3 h-3" />
                  3-Factor Authentication
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Masuk Sesi Guru Pembimbing
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Masukkan NIP/Email institusi, kata sandi, dan PIN Otorisasi Kurikulum 6 digit.
                </p>
              </div>

              {/* Generic Error message */}
              {errorMessage && !isStudentBlocked && (
                <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Factor 1: Email / NIP */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5" htmlFor="admin-identity">
                    Email Institusi / NIP Pembimbing
                  </label>
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
                      className="w-full py-2.5 sm:py-3 px-3.5 pl-10 bg-white/5 border border-white/15 focus:border-[#E50914] rounded-xl text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#E50914] transition-colors"
                    />
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Factor 2: Kata Sandi */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5" htmlFor="admin-password">
                    Kata Sandi
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="Masukkan kata sandi akun"
                      required
                      className="w-full py-2.5 sm:py-3 px-3.5 pl-10 pr-10 bg-white/5 border border-white/15 focus:border-[#E50914] rounded-xl text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#E50914] transition-colors"
                    />
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Factor 3: PIN Otorisasi Kurikulum 6 Digit */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider" htmlFor="admin-pin">
                      Kode Otorisasi Kurikulum (PIN 6 Digit)
                    </label>
                    <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
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
                      className="w-full py-2.5 sm:py-3 px-3.5 pl-10 pr-10 bg-white/5 border border-amber-500/30 focus:border-amber-400 rounded-xl text-white text-xs tracking-widest font-mono placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                    />
                    <KeyRound className="w-4 h-4 text-amber-400/80 absolute left-3.5 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3.5 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[11px] text-zinc-500 mt-1 leading-normal">
                    PIN 6 Digit diterbitkan resmi oleh Koordinator Kurikulum Skomda Mengajar.
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-3 h-12 bg-[#E50914] hover:bg-[#b4000c] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_20px_rgba(229,9,20,0.35)] hover:shadow-[0_4px_24px_rgba(229,9,20,0.55)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Memverifikasi Otorisasi...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verifikasi & Buka Panel Admin</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Switcher to Student Leader Login */}
              <div className="mt-8 pt-5 border-t border-white/10 text-center sm:text-left space-y-2">
                <p className="text-xs text-zinc-400">
                  Siswa Ketua Kelompok yang ingin mengelola tim?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-[#E50914] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Masuk melalui Login Ketua →</span>
                  </button>
                </p>
                <p className="text-[11px] text-zinc-500">
                  Butuh bantuan PIN otorisasi kurikulum? Hubungi Divisi IT SMK Telkom Sidoarjo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-4 px-6 md:px-12 text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>Direktorat Kurikulum • SMK Telkom Sidoarjo 2026</span>
        <span>helpdesk.kurikulum@smktelkom-sda.sch.id</span>
      </footer>
    </div>
  );
};
