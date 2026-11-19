"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { groupsData } from '../../data/mockData';
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Mail,
  School,
  ShieldCheck,
  UserCheck,
  Users,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { navigate, login, currentUser, logout, showToast } = useApp();

  // Controlled form state
  const [identity, setIdentity] = useState('raffi.01@telkomsda.sch.id');
  const [password, setPassword] = useState('user123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Manual Login Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await login(identity, password);
      setIsLoading(false);
      if (!res.ok) {
        setErrorMsg(res.error || 'Email / NIP / NIS atau kata sandi tidak valid.');
        return;
      }
      showToast('Login berhasil! Mengalihkan...', 'success');
      if (res.user?.role === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/home');
      }
    } catch {
      setIsLoading(false);
      setErrorMsg('Terjadi kesalahan koneksi.');
    }
  };

  // One-click quick login presets
  const handleQuickLogin = async (type: 'kel01' | 'kel03' | 'admin') => {
    setErrorMsg(null);
    setIsLoading(true);

    let targetEmail = '';
    let targetPass = '';
    let targetRedirect: '/home' | '/dashboard/admin' = '/home';

    if (type === 'kel01') {
      targetEmail = 'raffi.01@telkomsda.sch.id';
      targetPass = 'user123';
      targetRedirect = '/home';
    } else if (type === 'kel03') {
      targetEmail = 'nabila.03@telkomsda.sch.id';
      targetPass = 'user123';
      targetRedirect = '/home';
    } else {
      targetEmail = 'admin@telkomsda.sch.id';
      targetPass = 'admin123';
      targetRedirect = '/dashboard/admin';
    }

    setIdentity(targetEmail);
    setPassword(targetPass);

    try {
      const res = await login(targetEmail, targetPass);
      setIsLoading(false);
      if (res.ok) {
        showToast(
          type === 'admin'
            ? 'Masuk sebagai Admin (Pak Indra)'
            : `Masuk sebagai Ketua ${type === 'kel01' ? 'KEL-01' : 'KEL-03'}`,
          'success'
        );
        navigate(targetRedirect);
      } else {
        setErrorMsg(res.error || 'Login demo gagal.');
      }
    } catch {
      setIsLoading(false);
      setErrorMsg('Koneksi login demo gagal.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F4F4F5] flex flex-col justify-between selection:bg-red-500 selection:text-white font-sans">
      {/* Top Bar Navigation */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-red-600 transition-colors bg-white px-4 py-2 rounded-full border border-slate-200/80 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Publik</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-lg font-black text-slate-900 tracking-tight">#SKOMDA</span>
          <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
            MENGAJAR
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-5xl mx-auto px-4 py-6 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-[28px] border border-slate-200/80 shadow-sm overflow-hidden">
          
          {/* Left Hero & Role Simulation Presets (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Ambient Red Glow */}
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-red-600/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulasi Role Sekali Klik</span>
              </div>

              <h2 className="text-2xl font-black tracking-tight leading-tight">
                Pilih Role untuk Langsung Menguji Sistem
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Anda dapat langsung masuk ke dashboard tanpa mengetik kata sandi secara manual menggunakan tombol preset di bawah ini:
              </p>

              {/* Quick Login Presets */}
              <div className="space-y-2.5 pt-2">
                {/* Preset 1: KEL-01 */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('kel01')}
                  disabled={isLoading}
                  className="w-full text-left p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/50 transition-all duration-150 group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                      Ketua KEL-01
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="font-bold text-xs text-white">Raffi Akbar Pratama</div>
                  <div className="text-[11px] text-slate-400">SMPN 1 Sidoarjo • 8 Siswa</div>
                </button>

                {/* Preset 2: KEL-03 */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('kel03')}
                  disabled={isLoading}
                  className="w-full text-left p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/50 transition-all duration-150 group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                      Ketua KEL-03
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="font-bold text-xs text-white">Nabila Putri Ramadhani</div>
                  <div className="text-[11px] text-slate-400">SMPN 1 Buduran • 8 Siswa</div>
                </button>

                {/* Preset 3: Admin */}
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  disabled={isLoading}
                  className="w-full text-left p-3.5 rounded-2xl bg-red-950/40 hover:bg-red-900/40 border border-red-500/40 hover:border-red-500 transition-all duration-150 group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-600 text-white">
                      Admin / Pembimbing
                    </span>
                    <ArrowRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="font-bold text-xs text-white">Pak Indra, S.Pd.</div>
                  <div className="text-[11px] text-red-200">Akses Pengawasan 24 Kelompok</div>
                </button>
              </div>
            </div>

            <div className="relative z-10 pt-6 text-[11px] text-slate-500 border-t border-white/10 flex items-center justify-between">
              <span>Skomda Mengajar 2026</span>
              <span>SMK Telkom Sidoarjo</span>
            </div>
          </div>

          {/* Right Manual Form (7 Cols) */}
          <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto space-y-6">
              
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Masuk Akun
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Masukkan NIP / NIS atau akun surel resmi yang telah didaftarkan panitia.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Identity / Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Email / NIS / NIP
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={identity}
                      onChange={(e) => setIdentity(e.target.value)}
                      placeholder="contoh: raffi.01@telkomsda.sch.id"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Kata Sandi</label>
                    <span className="text-[11px] text-slate-400">Default: user123 / admin123</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember & Help */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                    />
                    <span>Ingat saya</span>
                  </label>
                  <a
                    href="mailto:panitia@skomda.sch.id"
                    className="text-red-600 hover:underline font-semibold"
                  >
                    Lupa sandi?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs sm:text-sm py-3 rounded-full transition-all shadow-md shadow-red-600/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span>Memproses...</span>
                  ) : (
                    <>
                      <span>Masuk ke Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center text-xs text-slate-400">
                Belum punya akun ketua? Musyawarahkan dengan tim Anda lalu hubungi guru pembimbing.
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer minimal */}
      <footer className="w-full text-center py-4 text-xs text-slate-400">
        © 2026 Skomda Mengajar • SMK Telkom Sidoarjo
      </footer>
    </div>
  );
};
