"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { Navbar } from '../../../components/Navbar';
import { BrandLogo } from '../../../components/BrandLogo';

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

  // References for 6-digit PIN input boxes
  const pinInputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  // Handle PIN character change in 6 separate boxes
  const handlePinChange = (index: number, value: string) => {
    // Only accept numeric digits
    const cleanChar = value.replace(/\D/g, '').slice(-1);
    const pinArray = authorizationPin.padEnd(6, ' ').split('');

    if (cleanChar) {
      pinArray[index] = cleanChar;
      const newPin = pinArray.join('').trimEnd();
      setAuthorizationPin(newPin);
      if (errorMessage) setErrorMessage('');

      // Auto-focus next input
      if (index < 5) {
        pinInputRefs.current[index + 1]?.focus();
      }
    } else {
      pinArray[index] = ' ';
      setAuthorizationPin(pinArray.join('').trimEnd());
    }
  };

  // Handle Backspace navigation across PIN boxes
  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const pinArray = authorizationPin.padEnd(6, ' ').split('');
      if (!pinArray[index] || pinArray[index] === ' ') {
        if (index > 0) {
          pinInputRefs.current[index - 1]?.focus();
          const prevArray = authorizationPin.padEnd(6, ' ').split('');
          prevArray[index - 1] = ' ';
          setAuthorizationPin(prevArray.join('').trimEnd());
        }
      } else {
        pinArray[index] = ' ';
        setAuthorizationPin(pinArray.join('').trimEnd());
      }
    }
  };

  // Handle paste full PIN
  const handlePinPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      setAuthorizationPin(pastedData);
      const nextIndex = Math.min(pastedData.length, 5);
      pinInputRefs.current[nextIndex]?.focus();
      if (errorMessage) setErrorMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsStudentBlocked(false);

    const trimmedIdentity = identity.trim();
    const trimmedPassword = password.trim();
    const trimmedPin = authorizationPin.trim();

    if (!trimmedIdentity || !trimmedPassword || !trimmedPin) {
      setErrorMessage('Email/NIP, kata sandi, dan PIN 6 digit wajib diisi.');
      showToast('Lengkapi seluruh data verifikasi pembimbing.', 'warning');
      return;
    }

    if (trimmedPin.length !== 6) {
      setErrorMessage('Kode PIN Otorisasi wajib terdiri dari 6 digit angka.');
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
          setErrorMessage(res.error || 'Identitas atau kata sandi tidak sesuai.');
          showToast(res.error || 'Verifikasi gagal.', 'warning');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#FAF9F6] font-sans text-slate-800 antialiased min-h-screen flex flex-col justify-between selection:bg-[#e20113]/10 selection:text-[#e20113]">
      {/* ══════════════════════════════════════════════════════════════════════════
          FLOATING DARK PILL NAVBAR
      ══════════════════════════════════════════════════════════════════════════ */}
      <Navbar variant="login" />

      {/* Main Admin Login Workspace */}
      <main className="flex-1 w-full flex items-center justify-center p-4 sm:p-6 md:p-10 my-auto">
        <div className="w-full max-w-5xl mx-auto">
          {/* Main Card Container with Subtle Shadow and Pure Clean Aesthetic */}
          <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.06)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 p-3 sm:p-4 gap-4">
            
            {/* ──────────────────────────────────────────────────────────────────
                LEFT COLUMN: BRIGHT, ELEGANT VISUAL SHOWCASE
            ────────────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-6 relative flex flex-col justify-between overflow-hidden rounded-[22px] bg-gradient-to-br from-slate-50 via-rose-50/30 to-slate-100/60 p-6 sm:p-8 border border-slate-200/70">
              
              {/* Subtle ambient decorative blur background */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#e20113]/8 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Top Header Information */}
              <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white border border-slate-200/80 text-slate-700 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#e20113]" />
                    Portal Guru &amp; Kurikulum
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono tracking-wider">SKOMDA-2026</span>
                </div>

                <div className="pt-2">
                  <BrandLogo size="lg" />
                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 max-w-md leading-relaxed">
                    Sistem kendali terpadu untuk validasi modul ajar, supervisi mengajar di 12 SMP mitra, dan monitoring relawan.
                  </p>
                </div>
              </div>

              {/* Main Visual: Framed High-Res Editorial Photography with Overlapping Badges */}
              <div className="relative z-10 my-6">
                <div className="relative w-full h-[220px] sm:h-[250px] rounded-2xl overflow-hidden shadow-sm border border-white">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    alt="Supervisi Pembimbing Skomda Mengajar"
                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  {/* Subtle Gradient Shade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent flex items-end p-4">
                    <span className="text-white text-xs font-medium tracking-wide flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-emerald-400">verified</span>
                      Supervisi Lapangan &amp; Pembimbingan Modul SMP
                    </span>
                  </div>
                </div>

                {/* Floating Glass Pill 1: Status Validasi */}
                <div className="absolute -bottom-3 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-100 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[15px]">check_circle</span>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-800">24 Modul Lapangan</div>
                    <div className="text-[9px] text-slate-400">Terjadwal &amp; Terverifikasi</div>
                  </div>
                </div>
              </div>

              {/* Bottom Metrics Pill Bar */}
              <div className="relative z-10 grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60">
                <div className="text-center bg-white/70 backdrop-blur-xs py-2 px-1 rounded-xl border border-slate-200/50">
                  <div className="text-sm font-bold text-slate-900">12 SMP</div>
                  <div className="text-[10px] text-slate-500">Mitra Sidoarjo</div>
                </div>
                <div className="text-center bg-white/70 backdrop-blur-xs py-2 px-1 rounded-xl border border-slate-200/50">
                  <div className="text-sm font-bold text-slate-900">24 Tim</div>
                  <div className="text-[10px] text-slate-500">Relawan Aktif</div>
                </div>
                <div className="text-center bg-white/70 backdrop-blur-xs py-2 px-1 rounded-xl border border-slate-200/50">
                  <div className="text-sm font-bold text-emerald-600">100%</div>
                  <div className="text-[10px] text-slate-500">Aman &amp; Terdata</div>
                </div>
              </div>
            </div>

            {/* ──────────────────────────────────────────────────────────────────
                RIGHT COLUMN: CLEAN, ELEGANT & MINIMALIST 3FA AUTHENTICATION FORM
            ────────────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-6 flex flex-col justify-center px-4 sm:px-8 py-6 sm:py-8">
              <div className="w-full max-w-sm sm:max-w-md mx-auto flex flex-col">
                
                {/* Header Title */}
                <div className="mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    Masuk Guru Pembimbing
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                    Akses panel verifikasi modul dan monitoring kelompok siswa.
                  </p>
                </div>

                {/* Rejection Alert for Students attempting Admin login */}
                {isStudentBlocked && (
                  <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200/90 text-rose-900 text-xs space-y-2.5 animate-in fade-in duration-200">
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-[18px] text-[#e20113] shrink-0 mt-0.5">
                        lock
                      </span>
                      <div className="flex-1">
                        <span className="font-bold block text-slate-900 mb-0.5">
                          Akses Khusus Guru &amp; Pembimbing
                        </span>
                        <p className="text-slate-600 leading-normal">
                          Akun siswa ketua kelompok silakan masuk melalui halaman login ketua.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="w-full py-2 bg-[#e20113] hover:bg-[#c40110] text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Masuk ke Login Ketua</span>
                      <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                    </button>
                  </div>
                )}

                {/* Error message */}
                {errorMessage && !isStudentBlocked && (
                  <div className="mb-5 p-3.5 bg-red-50 border border-red-200/80 rounded-xl text-red-700 text-xs flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#e20113]">info</span>
                    <span className="font-medium">{errorMessage}</span>
                  </div>
                )}

                {/* Clean, Simple Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Field 1: Email Institusi / NIP */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5" htmlFor="identity">
                      Email Institusi / NIP Pembimbing
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="identity"
                        type="text"
                        value={identity}
                        onChange={(e) => {
                          setIdentity(e.target.value);
                          if (errorMessage) setErrorMessage('');
                          if (isStudentBlocked) setIsStudentBlocked(false);
                        }}
                        placeholder="admin@smktelkom-sda.sch.id atau NIP"
                        required
                        className="w-full h-11 sm:h-12 px-3.5 sm:px-4 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#e20113] focus:ring-3 focus:ring-[#e20113]/10 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200"
                      />
                      <span className="material-symbols-outlined text-slate-400 absolute right-3.5 pointer-events-none text-[18px]">
                        alternate_email
                      </span>
                    </div>
                  </div>

                  {/* Field 2: Kata Sandi */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5" htmlFor="password">
                      Kata Sandi
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errorMessage) setErrorMessage('');
                        }}
                        placeholder="Masukkan kata sandi akun"
                        required
                        className="w-full h-11 sm:h-12 px-3.5 sm:px-4 pr-10 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#e20113] focus:ring-3 focus:ring-[#e20113]/10 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                        title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showPassword ? 'visibility' : 'visibility_off'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Field 3: 6-Digit PIN Otorisasi (Clean Segmented Luxury Look) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        PIN Otorisasi Kurikulum
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        {showPin ? 'Sembunyikan' : 'Tampilkan'}
                      </button>
                    </div>

                    {/* 6 Clean Input Boxes */}
                    <div className="grid grid-cols-6 gap-2">
                      {[0, 1, 2, 3, 4, 5].map((idx) => {
                        const digit = authorizationPin[idx] || '';
                        return (
                          <input
                            key={idx}
                            ref={(el) => {
                              pinInputRefs.current[idx] = el;
                            }}
                            type={showPin ? 'text' : 'password'}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handlePinChange(idx, e.target.value)}
                            onKeyDown={(e) => handlePinKeyDown(idx, e)}
                            onPaste={handlePinPaste}
                            placeholder="•"
                            className="w-full h-11 sm:h-12 text-center text-sm sm:text-base font-bold font-mono rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:border-[#e20113] focus:ring-3 focus:ring-[#e20113]/10 text-slate-900 placeholder:text-slate-300 outline-none transition-all duration-200"
                          />
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5">
                      PIN 6 digit diterbitkan oleh Koordinator Kurikulum.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-[#e20113] hover:bg-[#c40110] active:scale-[0.99] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(226,1,19,0.22)] hover:shadow-[0_6px_18px_rgba(226,1,19,0.3)] disabled:opacity-60"
                    >
                      {isLoading ? (
                        <>
                          <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                          <span>Memverifikasi Otorisasi...</span>
                        </>
                      ) : (
                        <>
                          <span>Masuk ke Panel Pembimbing</span>
                          <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Footer Notes & Student Redirect */}
                <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col gap-2 text-center sm:text-left">
                  <p className="text-xs text-slate-500">
                    Siswa Ketua Kelompok?{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="text-[#e20113] hover:text-[#b4000c] font-medium hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Masuk di Login Ketua →</span>
                    </button>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Bantuan otorisasi: helpdesk@smktelkom-sda.sch.id
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 py-4 px-6 md:px-12 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 bg-white">
        <span>SMK Telkom Sidoarjo • Direktorat Kurikulum 2026</span>
        <span>helpdesk.kurikulum@smktelkom-sda.sch.id</span>
      </footer>
    </div>
  );
};
