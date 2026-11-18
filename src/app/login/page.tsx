"use client";
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { groupsData } from '../../data/mockData';

const sortedGroups = [...groupsData].sort((a, b) => a.number.localeCompare(b.number));

export const LoginPage: React.FC = () => {
  const { navigate, login, register, currentUser, logout, showToast } = useApp();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login state
  const [identity, setIdentity] = useState('raffi.01@telkomsda.sch.id');
  const [password, setPassword] = useState('user123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<'user' | 'admin'>('user');
  const [regGroupNumber, setRegGroupNumber] = useState('01');
  const [regSchoolName, setRegSchoolName] = useState('SMPN 1 Sidoarjo');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    if (authMode === 'login') {
      const result = await login(identity, password);
      setIsLoading(false);
      if (!result.ok) {
        setErrorMsg(result.error || 'Email atau kata sandi salah.');
      }
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setIsLoading(false);
      setErrorMsg('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    const result = await register({
      name: regName,
      email: regEmail,
      password: regPassword,
      role: regRole,
      groupNumber: regRole === 'user' ? regGroupNumber : undefined,
      schoolName: regRole === 'user' ? regSchoolName : undefined,
    });
    setIsLoading(false);
    if (!result.ok) {
      setErrorMsg(result.error || 'Registrasi gagal.');
    }
  };

  const handleQuickLogin = async (preset: 'user01' | 'user03' | 'admin') => {
    setErrorMsg(null);
    setAuthMode('login');
    setIsLoading(true);
    const demoEmail =
      preset === 'user01'
        ? 'raffi.01@telkomsda.sch.id'
        : preset === 'user03'
        ? 'nabila.03@telkomsda.sch.id'
        : 'admin@telkomsda.sch.id';
    const demoPass = preset === 'admin' ? 'admin123' : 'user123';
    setIdentity(demoEmail);
    setPassword(demoPass);
    const result = await login(demoEmail, demoPass);
    setIsLoading(false);
    if (!result.ok) {
      setErrorMsg(result.error || 'Login demo gagal.');
    }
  };

  return (
    <div className="w-full bg-white font-sans text-slate-800 antialiased min-h-screen flex flex-col justify-between">
      {/* Top Header */}
      <header className="w-full border-b border-slate-200 bg-white">
        <div className="h-16 max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/')} className="flex items-center gap-1.5 cursor-pointer">
              <span className="text-lg font-extrabold text-slate-900 tracking-tight transform -rotate-3 origin-bottom-left select-none italic">
                #SKOMDA
              </span>
              <span className="bg-[#e20113] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full transform -rotate-3 origin-center">
                MENGAJAR
              </span>
            </button>
            <span className="text-xs text-slate-400 font-medium ml-2 hidden sm:inline">
              / Portal Akses Siswa & Mentor
            </span>
          </div>

          <button
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 uppercase tracking-wider cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Kembali ke Beranda</span>
          </button>
        </div>
      </header>

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
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight transform -rotate-3 origin-bottom-left select-none italic">
                      #SKOMDA
                    </span>
                    <span className="bg-[#e20113] text-white text-base uppercase px-3 py-1 rounded-lg transform -rotate-3 origin-center font-extrabold shadow-xs">
                      MENGAJAR
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-3 max-w-md leading-relaxed">
                    Ruang koordinasi resmi bagi ketua kelompok Skomda Mengajar angkatan 2026 dan guru pembimbing lapangan.
                  </p>
                </div>
              </div>

              {/* Photo Frame Module with Archival Caption */}
              <div className="relative z-10 mt-8 flex flex-col gap-2">
                <div className="relative w-full h-[240px] sm:h-[260px] bg-slate-200 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                  <img
                    className="w-full h-full object-cover"
                    alt="Dokumentasi Angkatan 2025"
                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                    <div className="flex items-center gap-2 text-white">
                      <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                      <span className="text-[10px] font-bold tracking-wider uppercase opacity-95">
                        Dokumentasi Angkatan 2025
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e20113]"></span>
                    Dokumentasi angkatan sebelumnya — Ruang kelas SMPN 1 Sidoarjo
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">REF: SKD-2025-09</span>
                </div>
              </div>
            </div>

            {/* Right Column: Authentication Form */}
            <div className="lg:col-span-6 flex flex-col justify-center px-4 sm:px-8 py-4">
              <div className="w-full max-w-md mx-auto flex flex-col">
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2.5 h-2.5 bg-[#e20113] rounded-full"></span>
                    <span className="text-[10px] uppercase tracking-widest text-[#e20113] font-bold">
                      Autentikasi Internal
                    </span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {authMode === 'login' ? 'Masuk' : 'Daftar Akun'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    {authMode === 'login'
                      ? 'Khusus user kelompok relawan dan admin pembimbing sekolah.'
                      : 'Buat akun baru sebagai User Kelompok atau Admin Kurikulum.'}
                  </p>
                </div>

                {/* Active Session Banner if already logged in */}
                {currentUser && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-2 text-xs">
                    <div className="min-w-0">
                      <div className="font-bold text-emerald-900 truncate">
                        Aktif: {currentUser.name} ({currentUser.role.toUpperCase()})
                      </div>
                      <div className="text-[11px] text-emerald-700 truncate">{currentUser.email}</div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => navigate(currentUser.role === 'admin' ? '/admin' : '/workspace')}
                        className="px-2.5 py-1.5 bg-emerald-700 text-white rounded-lg font-semibold cursor-pointer"
                      >
                        Buka
                      </button>
                      <button
                        type="button"
                        onClick={() => void logout()}
                        className="px-2.5 py-1.5 bg-white border border-emerald-300 text-emerald-800 rounded-lg font-semibold cursor-pointer"
                      >
                        Keluar
                      </button>
                    </div>
                  </div>
                )}

                {/* Login / Register Tab Switcher */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl mb-5">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setErrorMsg(null);
                    }}
                    className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      authMode === 'login'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Masuk (Login)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setErrorMsg(null);
                    }}
                    className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      authMode === 'register'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Daftar (Register)
                  </button>
                </div>

                {/* Quick Access Switcher Buttons (Login mode) */}
                {authMode === 'login' && (
                  <div className="mb-5 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Masuk Cepat Akun Demo:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => void handleQuickLogin('user01')}
                        className="px-2.5 py-2 bg-white hover:bg-red-50 text-slate-800 hover:text-[#b4000c] border border-slate-200 hover:border-red-200 rounded-lg text-xs font-semibold text-left transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#e20113] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          01
                        </div>
                        <div className="truncate min-w-0">
                          <div className="font-bold truncate text-[11px]">User Kel. 01</div>
                          <div className="text-[9px] text-slate-400 truncate">SMPN 1 SDA</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => void handleQuickLogin('user03')}
                        className="px-2.5 py-2 bg-white hover:bg-red-50 text-slate-800 hover:text-[#b4000c] border border-slate-200 hover:border-red-200 rounded-lg text-xs font-semibold text-left transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#b4000c] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          03
                        </div>
                        <div className="truncate min-w-0">
                          <div className="font-bold truncate text-[11px]">User Kel. 03</div>
                          <div className="text-[9px] text-slate-400 truncate">SMPN 1 Buduran</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => void handleQuickLogin('admin')}
                        className="px-2.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold text-left transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          AD
                        </div>
                        <div className="truncate min-w-0">
                          <div className="font-bold truncate text-[11px]">Role Admin</div>
                          <div className="text-[9px] text-slate-400 truncate">SMK Telkom</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {authMode === 'register' ? (
                    <>
                      <div className="flex flex-col">
                        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1" htmlFor="regName">
                          Nama Lengkap
                        </label>
                        <input
                          id="regName"
                          type="text"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Contoh: Ahmad Rizky"
                          required
                          className="w-full py-2.5 px-3 bg-white border border-slate-300 focus:border-[#e20113] rounded-lg text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1" htmlFor="regEmail">
                          Email Institusi
                        </label>
                        <input
                          id="regEmail"
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="nama@telkomsda.sch.id"
                          required
                          className="w-full py-2.5 px-3 bg-white border border-slate-300 focus:border-[#e20113] rounded-lg text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col">
                          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1" htmlFor="regRole">
                            Role Akun
                          </label>
                          <select
                            id="regRole"
                            value={regRole}
                            onChange={(e) => setRegRole(e.target.value as 'user' | 'admin')}
                            className="w-full py-2.5 px-3 bg-white border border-slate-300 focus:border-[#e20113] rounded-lg text-slate-900 text-xs focus:outline-none transition-colors"
                          >
                            <option value="user">User (Kelompok)</option>
                            <option value="admin">Admin (Pembimbing)</option>
                          </select>
                        </div>

                        {regRole === 'user' && (
                          <div className="flex flex-col">
                            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1" htmlFor="regGroup">
                              Pilih Kelompok
                            </label>
                            <select
                              id="regGroup"
                              value={regGroupNumber}
                              onChange={(e) => {
                                const num = e.target.value;
                                setRegGroupNumber(num);
                                const found = sortedGroups.find((g) => g.number === num);
                                if (found) setRegSchoolName(found.schoolName);
                              }}
                              className="w-full py-2.5 px-3 bg-white border border-slate-300 focus:border-[#e20113] rounded-lg text-slate-900 text-xs focus:outline-none transition-colors"
                            >
                              {sortedGroups.map((g) => (
                                <option key={g.id} value={g.number}>
                                  Kel. {g.number} — {g.schoolName}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>

                      {regRole === 'user' && (
                        <div className="flex flex-col">
                          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1" htmlFor="regSchool">
                            Sekolah Tujuan
                          </label>
                          <input
                            id="regSchool"
                            type="text"
                            value={regSchoolName}
                            onChange={(e) => setRegSchoolName(e.target.value)}
                            placeholder="SMPN 1 Buduran"
                            className="w-full py-2.5 px-3 bg-white border border-slate-300 focus:border-[#e20113] rounded-lg text-slate-900 text-xs focus:outline-none transition-colors"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col">
                          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1" htmlFor="regPassword">
                            Kata Sandi
                          </label>
                          <input
                            id="regPassword"
                            type="password"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="Min. 6 karakter"
                            minLength={6}
                            required
                            className="w-full py-2.5 px-3 bg-white border border-slate-300 focus:border-[#e20113] rounded-lg text-slate-900 text-xs focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1" htmlFor="regConfirmPassword">
                            Konfirmasi
                          </label>
                          <input
                            id="regConfirmPassword"
                            type="password"
                            value={regConfirmPassword}
                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                            placeholder="Ulangi kata sandi"
                            minLength={6}
                            required
                            className="w-full py-2.5 px-3 bg-white border border-slate-300 focus:border-[#e20113] rounded-lg text-slate-900 text-xs focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Email */}
                      <div className="flex flex-col">
                        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1" htmlFor="identity">
                          Email Institusi
                        </label>
                        <div className="relative flex items-center">
                          <input
                            id="identity"
                            type="email"
                            value={identity}
                            onChange={(e) => setIdentity(e.target.value)}
                            placeholder="nama@telkomsda.sch.id"
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
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
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
                          <span className="text-slate-600">Ingat saya</span>
                        </label>
                        <a
                          href="#lupa"
                          onClick={(e) => {
                            e.preventDefault();
                            showToast('Silakan hubungi koordinator IT SMK Telkom Sidoarjo.', 'info');
                          }}
                          className="text-slate-500 hover:text-[#e20113] transition-colors"
                        >
                          Lupa kata sandi?
                        </a>
                      </div>
                    </>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 h-11 bg-[#e20113] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <>
                        <span>{authMode === 'login' ? 'Masuk Sekarang' : 'Daftar & Masuk'}</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-200 text-center sm:text-left space-y-2">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Belum terdaftar sebagai ketua? Hubungi{' '}
                    <span className="text-slate-800 font-semibold underline cursor-pointer">
                      koordinator guru pendamping
                    </span>{' '}
                    untuk verifikasi SK penugasan.
                  </p>
                  <div>
                    <button
                      onClick={() => navigate('/')}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-[#e20113] uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                      <span>Kembali ke beranda publik</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 py-4 px-6 md:px-12 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>SMK Telkom Sidoarjo • Inisiatif Pengabdian Masyarakat 2026</span>
        <span>Bantuan IT & Kendala: helpdesk@skomda.sch.id</span>
      </footer>
    </div>
  );
};
