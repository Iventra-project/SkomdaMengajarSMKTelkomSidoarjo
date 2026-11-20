"use client";
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from '../components/BrandLogo';
import {
  groupsData,
  showcaseProjects,
  documentaryStories,
  heroSchoolSpotlights,
  ShowcaseProject,
  DocumentaryMoment,
} from '../data/mockData';

// ─── Status Configurations ──────────────────────────────────────────────────
const STATUS_CFG: Record<string, { dot: string; text: string; badge: string }> = {
  ontrack: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
  },
  review: {
    dot: 'bg-amber-400',
    text: 'text-amber-700',
    badge: 'bg-amber-50 text-amber-700 border-amber-200/70',
  },
  overdue: {
    dot: 'bg-rose-500',
    text: 'text-rose-700',
    badge: 'bg-rose-50 text-rose-700 border-rose-200/70',
  },
  revisi: {
    dot: 'bg-orange-400',
    text: 'text-orange-700',
    badge: 'bg-orange-50 text-orange-700 border-orange-200/70',
  },
};

const STEPS = [
  {
    num: 1,
    icon: 'groups',
    label: 'Bentuk kelompok',
    subtitle: 'Penentuan anggota tim',
    date: '12 Jan',
    desc: 'Pemetaan 24 kelompok relawan siswa kelas XII (RPL & TKJ) ke 12 SMP mitra.',
  },
  {
    num: 2,
    icon: 'person',
    label: 'Pilih ketua',
    subtitle: 'Koordinator lapangan',
    date: '15 Jan',
    desc: 'Penetapan ketua regu dan guru pembimbing lapangan serta koordinasi awal.',
  },
  {
    num: 3,
    icon: 'menu_book',
    label: 'Susun materi',
    subtitle: 'Modul & silabus ajar',
    date: '28 Jan',
    desc: 'Penyusunan RPP 2 pertemuan berbasis Fase D Informatika Kurikulum Merdeka.',
  },
  {
    num: 4,
    icon: 'palette',
    label: 'Siapkan desain',
    subtitle: 'Media visual & slide',
    date: '15 Feb',
    desc: 'Finalisasi slide materi presentasi dan X-Banner publikasi 60×160 cm.',
  },
  {
    num: 5,
    icon: 'school',
    label: 'Mengajar di SMP',
    subtitle: 'Sesi kelas interaktif',
    date: '18–25 Feb',
    desc: 'Penerjunan siswa relawan ke laboratorium komputer sekolah mitra.',
  },
  {
    num: 6,
    icon: 'task_alt',
    label: 'Laporan & feedback',
    subtitle: 'Refleksi & publikasi',
    date: '28 Feb',
    desc: 'Gelar karya siswa SMP, pengumpulan artefak, evaluasi akhir, dan publikasi.',
  },
];

export const HomePage: React.FC = () => {
  const { navigate, showToast, currentUser, setCurrentUser } = useApp();
  const isLoggedIn = !!currentUser;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ontrack' | 'review' | 'overdue'>('all');
  const [isGroupsExpanded, setIsGroupsExpanded] = useState(false);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(false);
  const [isDocExpanded, setIsDocExpanded] = useState(false);
  const [activeSpotlight, setActiveSpotlight] = useState(0);
  const [selectedStep, setSelectedStep] = useState(4);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ShowcaseProject | null>(null);
  const [selectedStory, setSelectedStory] = useState<DocumentaryMoment | null>(null);

  const filteredGroups = useMemo(() => {
    return groupsData.filter((g) => {
      const q = searchQuery.toLowerCase().trim();
      const hit =
        !q ||
        g.schoolName.toLowerCase().includes(q) ||
        g.leaderName.toLowerCase().includes(q) ||
        g.mentorName.toLowerCase().includes(q) ||
        g.district.toLowerCase().includes(q) ||
        g.number.includes(q);
      if (!hit) return false;
      if (selectedFilter === 'ontrack') return g.status === 'ontrack';
      if (selectedFilter === 'review') return g.status === 'review';
      if (selectedFilter === 'overdue') return g.status === 'overdue' || g.status === 'revisi';
      return true;
    });
  }, [searchQuery, selectedFilter]);

  const shownGroups = isGroupsExpanded ? filteredGroups : filteredGroups.slice(0, 4);
  const shownProjects = isProjectsExpanded ? showcaseProjects : showcaseProjects.slice(0, 4);
  const shownStories = isDocExpanded ? documentaryStories : documentaryStories.slice(0, 4);

  const spot = heroSchoolSpotlights[activeSpotlight] ?? heroSchoolSpotlights[0];
  const activeStepData = STEPS.find((s) => s.num === selectedStep) || STEPS[3];

  const handleQuickDemoLogin = () => {
    setCurrentUser({
      name: 'Nabila Putri Ramadhani',
      role: 'leader',
      email: 'nabila.putri@smktelkom-sda.sch.id',
      groupNumber: '03',
      schoolName: 'SMPN 1 Buduran',
    });
    showToast('Masuk sebagai Ketua Kelompok 03 (SMPN 1 Buduran)', 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Anda telah keluar. Halaman kembali ke mode sebelum login.', 'info');
  };

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 antialiased selection:bg-[#e20113] selection:text-white">
      {/* ══════════════════════════════════════════════════════════════════════════
          1. TOP NAVIGATION BAR
      ══════════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/70 transition-all">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10 h-16 flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center cursor-pointer group shrink-0 text-left"
          >
            <BrandLogo size="md" />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <a href="#alur" className="hover:text-[#e20113] transition-colors">
              {isLoggedIn ? 'Alur Pelaksanaan' : 'Alur Awal'}
            </a>
            {!isLoggedIn ? (
              <a href="#kelompok" className="hover:text-[#e20113] transition-colors">
                Pembagian Kelompok
              </a>
            ) : (
              <>
                <a href="#jejak" className="hover:text-[#e20113] transition-colors">
                  Jejak 2025
                </a>
                <a href="#kurikulum" className="hover:text-[#e20113] transition-colors">
                  Kurikulum
                </a>
              </>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            {!isLoggedIn ? (
              <>
                {/* Demo quick toggle button for easy instant testing */}
                <button
                  onClick={handleQuickDemoLogin}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 h-9 text-xs font-bold text-[#e20113] bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all cursor-pointer"
                  title="Klik untuk langsung mencoba mode setelah login sebagai ketua kelompok"
                >
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  <span>Demo: Masuk sbg Ketua</span>
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center px-4 h-9 text-xs font-bold uppercase tracking-wider bg-[#e20113] hover:bg-[#b4000c] text-white rounded-xl transition-all shadow-xs hover:shadow-sm cursor-pointer"
                >
                  Masuk
                </button>
              </>
            ) : (
              <>
                {/* User info chip */}
                <div className="hidden sm:flex items-center gap-2 pl-3 pr-2 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  <div className="w-6 h-6 rounded-lg bg-[#e20113] text-white flex items-center justify-center font-extrabold text-[10px]">
                    {currentUser?.groupNumber ? `K${currentUser.groupNumber}` : 'AD'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                      {currentUser?.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {currentUser?.role === 'admin' ? 'Admin Kurikulum' : `Kel. ${currentUser?.groupNumber || '03'}`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/workspace')}
                  className="inline-flex items-center gap-1.5 px-3.5 h-9 text-xs font-bold text-white bg-[#e20113] hover:bg-[#b4000c] rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[17px]">terminal</span>
                  <span>Workspace</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center p-2 h-9 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all border border-slate-200 cursor-pointer"
                  title="Keluar dari Akun (Kembali ke mode sebelum login)"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                </button>
              </>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle Navigation"
            >
              <span className="material-symbols-outlined text-[22px]">{mobileOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-6 py-4 flex flex-col gap-3 shadow-md animate-in slide-in-from-top-2 duration-200">
            <a
              href="#alur"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-semibold text-slate-700 hover:text-[#e20113] py-1"
            >
              {isLoggedIn ? 'Alur Pelaksanaan' : 'Alur Awal'}
            </a>
            {!isLoggedIn ? (
              <a
                href="#kelompok"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold text-slate-700 hover:text-[#e20113] py-1"
              >
                Pembagian Kelompok
              </a>
            ) : (
              <>
                <a
                  href="#jejak"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold text-slate-700 hover:text-[#e20113] py-1"
                >
                  Rekam Jejak 2025
                </a>
                <a
                  href="#kurikulum"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold text-slate-700 hover:text-[#e20113] py-1"
                >
                  Standar Kurikulum
                </a>
              </>
            )}
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleQuickDemoLogin();
                    }}
                    className="flex-1 py-2 text-xs font-semibold text-[#e20113] bg-red-50 rounded-lg text-center border border-red-200 cursor-pointer"
                  >
                    Demo Ketua
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate('/login');
                    }}
                    className="flex-1 py-2 text-xs font-semibold text-white bg-[#e20113] rounded-lg text-center cursor-pointer"
                  >
                    Masuk
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate('/workspace');
                    }}
                    className="flex-1 py-2 text-xs font-semibold text-white bg-[#e20113] rounded-lg text-center cursor-pointer"
                  >
                    Buka Workspace
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg text-center cursor-pointer"
                  >
                    Keluar
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="w-full">
        {/* ══════════════════════════════════════════════════════════════════════════
            2. HERO SECTION (ADAPTIVE: SEBELUM LOGIN VS SETELAH LOGIN)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section className="relative w-full bg-white border-b border-slate-100 overflow-hidden">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10 py-12 sm:py-16 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Typography, Actions, Minimal Stats */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
                {/* Live Badge */}
                {!isLoggedIn ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-50/80 border border-red-200/70 rounded-full mb-6">
                    <span className="w-2 h-2 rounded-full bg-[#e20113] animate-pulse" />
                    <span className="text-xs font-bold tracking-wider text-[#e20113] uppercase">
                      Inisiatif Vokasi 2026
                    </span>
                    <span className="text-red-300">•</span>
                    <span className="text-xs font-medium text-slate-600">
                      Tahap 04 (Desain & X-Banner)
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-full mb-6">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase">
                      Sesi Aktif: Kelompok {currentUser?.groupNumber || '03'}
                    </span>
                    <span className="text-emerald-300">•</span>
                    <span className="text-xs font-medium text-slate-600">
                      {currentUser?.schoolName || 'SMPN 1 Buduran'}
                    </span>
                  </div>
                )}

                {/* Main Headline */}
                {!isLoggedIn ? (
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold text-slate-950 tracking-tight leading-[1.08] mb-4">
                    Inspirasi Nyata, <br />
                    <span className="text-[#e20113]">Siswa SMK Mengajar SMP.</span>
                  </h1>
                ) : (
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold text-slate-950 tracking-tight leading-[1.08] mb-4">
                    Fokus Progres Tim, <br />
                    <span className="text-[#e20113]">Siap Mengajar SMP Mitra.</span>
                  </h1>
                )}

                {/* Subtitle (Short, light & punchy) */}
                {!isLoggedIn ? (
                  <p className="text-base sm:text-lg text-slate-500 font-normal leading-relaxed mb-8 max-w-lg">
                    180 siswa relawan SMK Telkom Sidoarjo mengajar teknologi aplikatif dan etika digital di 12 SMP Sidoarjo.
                  </p>
                ) : (
                  <p className="text-base sm:text-lg text-slate-500 font-normal leading-relaxed mb-8 max-w-lg">
                    Selamat datang kembali, <strong className="text-slate-800">{currentUser?.name}</strong>! Kelompok Anda aktif di Tahap 04 (Desain Slide & X-Banner). Pantau tugas sprint dan koordinasi guru pembimbing.
                  </p>
                )}

                {/* Action Buttons (Pill-shaped, modern & clean) */}
                <div className="flex flex-wrap items-center gap-3.5 mb-10">
                  {!isLoggedIn ? (
                    <>
                      <a
                        href="#kelompok"
                        className="inline-flex items-center gap-2.5 px-6 h-12 bg-[#e20113] hover:bg-[#b4000c] text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer group"
                      >
                        <span>Cari Kelompok Saya</span>
                        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                          <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                        </span>
                      </a>
                      <button
                        onClick={() => navigate('/login')}
                        className="inline-flex items-center gap-2 px-5 h-12 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200 font-bold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px] text-[#e20113]">login</span>
                        <span>Masuk ke Workspace</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => navigate('/workspace')}
                        className="inline-flex items-center gap-2.5 px-6 h-12 bg-[#e20113] hover:bg-[#b4000c] text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer group"
                      >
                        <span>Buka Workspace Kelompok {currentUser?.groupNumber || '03'}</span>
                        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </span>
                      </button>
                      <a
                        href="#alur"
                        className="inline-flex items-center gap-2 px-5 h-12 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200 font-bold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px] text-slate-500">list_alt</span>
                        <span>Lihat Alur Pelaksanaan</span>
                      </a>
                    </>
                  )}
                </div>

                {/* Minimal Counters Bar */}
                {!isLoggedIn ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-100 w-full max-w-xl">
                    <div>
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight block">12</span>
                      <span className="text-xs font-semibold text-slate-500 mt-0.5 block">SMP Mitra</span>
                    </div>
                    <div>
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight block">24</span>
                      <span className="text-xs font-semibold text-slate-500 mt-0.5 block">Kelompok</span>
                    </div>
                    <div>
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight block">180</span>
                      <span className="text-xs font-semibold text-slate-500 mt-0.5 block">Relawan</span>
                    </div>
                    <div>
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight block">1.4k+</span>
                      <span className="text-xs font-semibold text-slate-500 mt-0.5 block">Siswa SMP</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-100 w-full max-w-xl">
                    <div>
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#e20113] tracking-tight block">65%</span>
                      <span className="text-xs font-semibold text-slate-500 mt-0.5 block">Progres Sprint</span>
                    </div>
                    <div>
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight block">Tahap 04</span>
                      <span className="text-xs font-semibold text-slate-500 mt-0.5 block">Aktif (Desain)</span>
                    </div>
                    <div>
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight block">5 Siswa</span>
                      <span className="text-xs font-semibold text-slate-500 mt-0.5 block">Relawan Regu</span>
                    </div>
                    <div>
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight block">18–25 Feb</span>
                      <span className="text-xs font-semibold text-slate-500 mt-0.5 block">Jadwal Mengajar</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Visual Photo Card */}
              <div className="lg:col-span-5 relative">
                {/* School Switcher Tabs (Only if public/not logged in, or focused) */}
                <div className="flex items-center gap-1.5 mb-3 bg-slate-100/80 p-1 rounded-xl w-fit">
                  {heroSchoolSpotlights.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSpotlight(idx)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeSpotlight === idx
                        ? 'bg-white text-[#e20113] shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                      Kel. {item.groupNumber}
                    </button>
                  ))}
                </div>

                {/* Clean Photo Container */}
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl shadow-slate-200/60 border border-slate-100 group">
                  <img
                    src={spot.image}
                    alt={spot.schoolName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                  />

                  {/* Soft Gradient Scrim at Bottom Only */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent p-5 text-white flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#e20113] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                        Kel. {spot.groupNumber}
                      </span>
                      <span className="text-xs text-slate-200 font-semibold">{spot.schoolName}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug line-clamp-1">
                      {spot.moduleTitle}
                    </h3>

                    <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">Ketua: {spot.leaderName}</span>
                      <button
                        onClick={() => {
                          if (isLoggedIn) {
                            navigate('/workspace');
                          } else if (spot.groupNumber === '03') {
                            navigate('/admin/kelompok/03');
                          } else {
                            navigate('/login');
                            showToast(`Silakan masuk untuk mengakses modul Kelompok ${spot.groupNumber}`, 'info');
                          }
                        }}
                        className="inline-flex items-center gap-1 text-white font-bold hover:underline cursor-pointer"
                      >
                        <span>{isLoggedIn ? 'Buka Workspace' : 'Lihat Regu'}</span>
                        <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subtle Meta Indicator below photo */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-medium px-1">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-500 text-[15px]">verified</span>
                    Fase D Kurikulum Merdeka
                  </span>
                  <span>Disahkan MGMP Informatika</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════
            3. ALUR SECTION (ADAPTIVE: PRA-LOGIN VS SETELAH LOGIN)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section className="w-full bg-[#f8f9fa] py-14 sm:py-16 md:py-20 border-b border-slate-200/80" id="alur">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10">
            {!isLoggedIn ? (
              /* ─── A. ALUR PRA-LOGIN: WAVY SERPENTINE TRACK PERSIS SEPERTI GAMBAR ─── */
              <div className="space-y-6">
                <div className="bg-white border border-[#E8ECF2] rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-100/80">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-[#0B1B3A] tracking-tight">
                        Alur & Progres Skomda Mengajar
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                        Tahapan terstruktur dari pembentukan tim hingga evaluasi luaran nyata di sekolah mitra.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-200 bg-red-50/70 text-[#D7141F] text-xs font-bold shrink-0 self-start sm:self-auto shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-[#D7141F] animate-pulse" />
                      <span>Fase Aktif: Pembentukan Ketua Tim</span>
                    </div>
                  </div>

                  {/* Wavy Sinusoidal Track Container */}
                  <div className="pt-8 pb-4 overflow-x-auto select-none">
                    <div className="min-w-[860px] relative h-[255px]">
                      {/* Background SVG Dashed Track */}
                      <svg
                        className="absolute top-0 left-0 w-full h-[190px] pointer-events-none"
                        viewBox="0 0 1000 190"
                        preserveAspectRatio="none"
                        fill="none"
                      >
                        {/* Segment 0 (Step 1 to 2): Red Dashed Line */}
                        <path
                          d="M 83.3 50 C 166.6 50, 166.6 124, 250 124"
                          stroke="#D7141F"
                          strokeWidth="2.5"
                          strokeDasharray="6 6"
                        />
                        {/* Segment 1 (Step 2 to 3): Gray Dashed Line */}
                        <path
                          d="M 250 124 C 333.3 124, 333.3 50, 416.7 50"
                          stroke="#CBD5E1"
                          strokeWidth="2.5"
                          strokeDasharray="6 6"
                        />
                        {/* Segment 2 (Step 3 to 4): Gray Dashed Line */}
                        <path
                          d="M 416.7 50 C 500 50, 500 124, 583.3 124"
                          stroke="#CBD5E1"
                          strokeWidth="2.5"
                          strokeDasharray="6 6"
                        />
                        {/* Segment 3 (Step 4 to 5): Gray Dashed Line */}
                        <path
                          d="M 583.3 124 C 666.6 124, 666.6 50, 750 50"
                          stroke="#CBD5E1"
                          strokeWidth="2.5"
                          strokeDasharray="6 6"
                        />
                        {/* Segment 4 (Step 5 to 6): Gray Dashed Line */}
                        <path
                          d="M 750 50 C 833.3 50, 833.3 124, 916.7 124"
                          stroke="#CBD5E1"
                          strokeWidth="2.5"
                          strokeDasharray="6 6"
                        />
                      </svg>

                      {/* 6 Grid Nodes */}
                      <div className="absolute inset-0 grid grid-cols-6 w-full">
                        {STEPS.map((step, idx) => {
                          const isCompleted = step.num === 1;
                          const isActive = step.num === 2;
                          const isEven = idx % 2 === 1; // 1, 3, 5 are lower offset
                          const isFinish = step.num === 6;

                          return (
                            <div
                              key={step.num}
                              className={`flex flex-col items-center text-center cursor-pointer group transition-all ${isEven ? 'pt-[74px]' : 'pt-[16px]'
                                }`}
                            >
                              {/* Card Box */}
                              <div
                                className={`w-[68px] h-[68px] rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300 group-hover:-translate-y-1 ${isCompleted
                                  ? 'bg-[#D7141F] text-white shadow-lg shadow-red-500/25'
                                  : isActive
                                    ? 'bg-white border-2 border-[#D7141F] text-[#D7141F] shadow-lg shadow-red-500/15 ring-4 ring-red-50'
                                    : 'bg-white border border-slate-200/90 text-slate-400 shadow-2xs hover:border-slate-300'
                                  }`}
                              >
                                {/* Tilted Finish Badge for Step 6 */}
                                {isFinish && (
                                  <span className="absolute -top-3 -right-2 bg-[#D7141F] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-xs rotate-[-8deg] pointer-events-none">
                                    FINISH
                                  </span>
                                )}

                                {/* Step Number */}
                                <span
                                  className={`text-[11px] font-black tracking-wider leading-none mb-1 ${isCompleted
                                    ? 'text-white/90'
                                    : isActive
                                      ? 'text-[#D7141F]'
                                      : 'text-slate-400'
                                    }`}
                                >
                                  0{step.num}
                                </span>

                                {/* Icon */}
                                <span
                                  className={`material-symbols-outlined text-[24px] ${isCompleted
                                    ? 'text-white'
                                    : isActive
                                      ? 'text-[#D7141F]'
                                      : 'text-slate-400 group-hover:text-slate-600 transition-colors'
                                    }`}
                                >
                                  {step.icon}
                                </span>
                              </div>

                              {/* Labels below card */}
                              <div className="mt-3 px-2">
                                <h4
                                  className={`text-xs sm:text-sm font-extrabold leading-tight transition-colors ${isActive ? 'text-[#D7141F]' : 'text-[#0B1B3A] group-hover:text-[#D7141F]'
                                    }`}
                                >
                                  {step.label}
                                </h4>
                                <p className="text-[11px] text-slate-400 mt-1 font-medium leading-snug">
                                  {step.subtitle}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Callout Notice for Leaders */}
                <div className="mt-6 p-4 sm:p-5 bg-white border border-red-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-[#e20113] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[22px]">lock_open</span>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        Ketua Regu yang telah ditetapkan?
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Silakan masuk ke akun Anda untuk membuka lembar kerja 6 tahapan pelaksanaan proyek dan mengelola tugas sprint kelompok.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/login')}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#e20113] hover:bg-[#b4000c] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
                  >
                    <span>Masuk ke Akun</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ) : (
              /* ─── B. ALUR SETELAH LOGIN: FULL 6 TAHAPAN + INTEGRASI BUKA PROGRES KELOMPOK ─── */
              <div className="space-y-6">
                {/* ─── ALUR & PROGRES SKOMDA MENGAJAR (WAVY SERPENTINE TRACK) ─── */}
                <div className="bg-white border border-[#E8ECF2] rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 sm:pb-10 border-b border-slate-100/80">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-[#0B1B3A] tracking-tight">
                        Alur & Progres Skomda Mengajar
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                        Tahapan terstruktur dari pembentukan tim hingga evaluasi luaran nyata di sekolah mitra.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-200 bg-red-50/70 text-[#D7141F] text-xs font-bold shrink-0 self-start sm:self-auto shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-[#D7141F] animate-pulse" />
                      <span>
                        Fase Aktif: {selectedStep === 2 ? 'Pembentukan Ketua Tim' : activeStepData.label}
                      </span>
                    </div>
                  </div>

                  {/* Wavy Sinusoidal Track Container */}
                  <div className="pt-8 pb-4 overflow-x-auto select-none">
                    <div className="min-w-[860px] relative h-[255px]">
                      {/* Background SVG Dashed Track */}
                      <svg
                        className="absolute top-0 left-0 w-full h-[190px] pointer-events-none"
                        viewBox="0 0 1000 190"
                        preserveAspectRatio="none"
                        fill="none"
                      >
                        {/* Segment 0 (Step 1 to 2) */}
                        <path
                          d="M 83.3 50 C 166.6 50, 166.6 124, 250 124"
                          stroke={selectedStep >= 2 ? '#D7141F' : '#CBD5E1'}
                          strokeWidth="2.5"
                          strokeDasharray="6 6"
                        />
                        {/* Segment 1 (Step 2 to 3) */}
                        <path
                          d="M 250 124 C 333.3 124, 333.3 50, 416.7 50"
                          stroke={selectedStep >= 3 ? '#D7141F' : '#CBD5E1'}
                          strokeWidth="2.5"
                          strokeDasharray="6 6"
                        />
                        {/* Segment 2 (Step 3 to 4) */}
                        <path
                          d="M 416.7 50 C 500 50, 500 124, 583.3 124"
                          stroke={selectedStep >= 4 ? '#D7141F' : '#CBD5E1'}
                          strokeWidth="2.5"
                          strokeDasharray="6 6"
                        />
                        {/* Segment 3 (Step 4 to 5) */}
                        <path
                          d="M 583.3 124 C 666.6 124, 666.6 50, 750 50"
                          stroke={selectedStep >= 5 ? '#D7141F' : '#CBD5E1'}
                          strokeWidth="2.5"
                          strokeDasharray="6 6"
                        />
                        {/* Segment 4 (Step 5 to 6) */}
                        <path
                          d="M 750 50 C 833.3 50, 833.3 124, 916.7 124"
                          stroke={selectedStep >= 6 ? '#D7141F' : '#CBD5E1'}
                          strokeWidth="2.5"
                          strokeDasharray="6 6"
                        />
                      </svg>

                      {/* 6 Grid Nodes */}
                      <div className="absolute inset-0 grid grid-cols-6 w-full">
                        {STEPS.map((step, idx) => {
                          const isSelected = selectedStep === step.num;
                          const isCompleted = step.num < selectedStep;
                          const isEven = idx % 2 === 1; // 1, 3, 5 are lower offset
                          const isFinish = step.num === 6;

                          return (
                            <div
                              key={step.num}
                              onClick={() => setSelectedStep(step.num)}
                              className={`flex flex-col items-center text-center cursor-pointer group transition-all ${isEven ? 'pt-[74px]' : 'pt-[16px]'
                                }`}
                            >
                              {/* Card Box */}
                              <div
                                className={`w-[68px] h-[68px] rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300 group-hover:-translate-y-1 ${isCompleted
                                  ? 'bg-[#D7141F] text-white shadow-lg shadow-red-500/25'
                                  : isSelected
                                    ? 'bg-white border-2 border-[#D7141F] text-[#D7141F] shadow-lg shadow-red-500/15 ring-4 ring-red-50'
                                    : 'bg-white border border-slate-200/90 text-slate-400 shadow-2xs hover:border-slate-300'
                                  }`}
                              >
                                {/* Tilted Finish Badge for Step 6 */}
                                {isFinish && (
                                  <span className="absolute -top-3 -right-2 bg-[#D7141F] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-xs rotate-[-8deg] pointer-events-none">
                                    FINISH
                                  </span>
                                )}

                                {/* Step Number */}
                                <span
                                  className={`text-[11px] font-black tracking-wider leading-none mb-1 ${isCompleted
                                    ? 'text-white/90'
                                    : isSelected
                                      ? 'text-[#D7141F]'
                                      : 'text-slate-400'
                                    }`}
                                >
                                  0{step.num}
                                </span>

                                {/* Icon */}
                                <span
                                  className={`material-symbols-outlined text-[24px] ${isCompleted
                                    ? 'text-white'
                                    : isSelected
                                      ? 'text-[#D7141F]'
                                      : 'text-slate-400 group-hover:text-slate-600 transition-colors'
                                    }`}
                                >
                                  {step.icon}
                                </span>
                              </div>

                              {/* Labels below card */}
                              <div className="mt-3 px-2">
                                <h4
                                  className={`text-xs sm:text-sm font-extrabold leading-tight transition-colors ${isSelected ? 'text-[#D7141F]' : 'text-[#0B1B3A] group-hover:text-[#D7141F]'
                                    }`}
                                >
                                  {step.label}
                                </h4>
                                <p className="text-[11px] text-slate-400 mt-1 font-medium leading-snug">
                                  {step.subtitle}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─── KARTU TUNGGAL TERPADU: POSISI KELOMPOKMU DI TAHAP 04 ─── */}
                <div className="mt-8 p-6 sm:p-8 bg-white border border-[#E8ECF2] rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2.5 mb-3">
                        <span className="bg-[#D7141F] text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full">
                          Kelompok {currentUser?.groupNumber || '03'} · {currentUser?.schoolName || 'SMPN 1 Buduran'}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Sesuai Jadwal
                        </span>
                        <span className="text-xs text-slate-400 font-medium">Tenggat: 15 Feb 2026 (3 hari tersisa)</span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B1B3A] tracking-tight">
                        Tahap 04: Siapkan Desain Slide & X-Banner 60×160 cm
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                        Fokus regu Anda saat ini adalah memfinalisasi slide presentasi interaktif dan tata letak banner promosi SMP mitra. 4 dari 6 tugas sprint telah selesai diverifikasi oleh pembimbing.
                      </p>

                      {/* Mini checklist badges */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50/70 border border-emerald-200/50 px-2.5 py-1 rounded-lg">
                          <span className="material-symbols-outlined text-[14px]">check</span> Layout Canva Disetujui
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50/70 border border-emerald-200/50 px-2.5 py-1 rounded-lg">
                          <span className="material-symbols-outlined text-[14px]">check</span> Aset Logo Terverifikasi
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50/70 border border-amber-200/50 px-2.5 py-1 rounded-lg">
                          <span className="material-symbols-outlined text-[14px]">pending</span> Review X-Banner Cetak
                        </span>
                      </div>
                    </div>

                    {/* Progress Circle & Single Action Button */}
                    <div className="shrink-0 flex sm:flex-row lg:flex-col items-center lg:items-end justify-between gap-5 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 flex items-center justify-center">
                          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
                            <circle cx="24" cy="24" r="20" stroke="#F1F5F9" strokeWidth="4" fill="none" />
                            <circle cx="24" cy="24" r="20" stroke="#D7141F" strokeWidth="4" strokeDasharray="125.6" strokeDashoffset="41.45" strokeLinecap="round" fill="none" />
                          </svg>
                          <span className="absolute text-xs font-black text-[#0B1B3A]">67%</span>
                        </div>
                        <div className="text-left">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Progres Sprint</span>
                          <span className="text-xs font-bold text-slate-700">4 dari 6 Tugas</span>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate('/workspace')}
                        className="inline-flex items-center justify-center gap-2 px-6 h-12 bg-[#D7141F] hover:bg-[#B80F1A] text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer group"
                      >
                        <span>Buka Lembar Kerja Tahap 04</span>
                        <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                          arrow_forward
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════
            4. PEMBAGIAN KELOMPOK (HANYA MUNCUL DI SEBELUM LOGIN)
        ══════════════════════════════════════════════════════════════════════════ */}
        {!isLoggedIn && (
          <section className="w-full bg-white py-16 md:py-20 border-b border-slate-200/80" id="kelompok">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10">
              {/* Header & Filter Controls */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#e20113]">
                    02 / ORGANISASI TIM
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                    Pembagian Kelompok Mengajar 2026
                  </h2>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari sekolah, ketua, kecamatan..."
                      className="h-9 pl-9 pr-7 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#e20113] focus:bg-white w-64 shadow-2xs"
                    />
                    <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-slate-400 text-[17px]">
                      search
                    </span>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    )}
                  </div>

                  <div className="flex bg-slate-100 rounded-xl p-0.5 gap-0.5 border border-slate-200/80">
                    {([
                      ['all', 'Semua'],
                      ['ontrack', 'Sesuai Jadwal'],
                      ['review', 'Review'],
                      ['overdue', 'Perhatian'],
                    ] as const).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedFilter(key as any)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${selectedFilter === key
                          ? 'bg-white text-[#e20113] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                          }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Display Counter */}
              <div className="py-4 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-800">
                  Menampilkan {shownGroups.length} dari {filteredGroups.length} kelompok
                </span>
                <span className="text-[11px] text-slate-400">Sinkronisasi kurikulum otomatis</span>
              </div>

              {/* 4 Cards Grid */}
              {shownGroups.length === 0 ? (
                <div className="py-16 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="material-symbols-outlined text-4xl block mb-2 text-slate-300">search_off</span>
                  <p className="text-sm font-bold text-slate-700">Tidak ada kelompok yang cocok</p>
                  <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci atau filter status.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {shownGroups.map((group) => {
                    const cfg = STATUS_CFG[group.status] ?? STATUS_CFG.ontrack;
                    const isMain = group.number === '03';

                    return (
                      <div
                        key={group.id}
                        className={`bg-white rounded-2xl border overflow-hidden flex flex-col justify-between transition-all hover:shadow-md ${isMain ? 'border-2 border-[#e20113] shadow-2xs' : 'border-slate-200/90 hover:border-slate-300'
                          }`}
                      >
                        {/* Top Accent Strip */}
                        <div className={`h-1.5 w-full ${isMain ? 'bg-[#e20113]' : cfg.dot}`} />

                        <div className="p-4 flex flex-col gap-3 flex-1">
                          {/* Header: Number & Status */}
                          <div className="flex items-center justify-between">
                            <span className="bg-[#e20113] text-white text-[11px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                              Kel. {group.number}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cfg.badge}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                              {group.statusLabel}
                            </span>
                          </div>

                          {/* School Info */}
                          <div>
                            <h3 className="font-bold text-slate-900 leading-snug">{group.schoolName}</h3>
                            <span className="text-[11px] font-semibold text-slate-400 block mt-0.5">
                              Kec. {group.district}
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div>
                            <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                              <span>Langkah {group.currentStep}/6</span>
                              <span className="text-slate-800">{group.progressPercent}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${isMain ? 'bg-[#e20113]' : 'bg-slate-800'
                                  }`}
                                style={{ width: `${group.progressPercent}%` }}
                              />
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex flex-col gap-1.5 text-xs text-slate-600 mt-auto pt-2 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-[11px]">Ketua:</span>
                              <span className="font-bold text-slate-800 truncate max-w-[130px]">{group.leaderName}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-[11px]">Modul:</span>
                              <span className="font-semibold text-slate-700 truncate max-w-[130px]">
                                {group.featuredModule}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-[11px]">Target:</span>
                              <span className="text-slate-700 font-medium">{group.targetDate}</span>
                            </div>
                          </div>
                        </div>

                        {/* Footer Action */}
                        <div className="border-t border-slate-100 px-4 py-2.5 flex justify-end bg-slate-50/60">
                          <button
                            onClick={() => {
                              if (group.number === '03') {
                                handleQuickDemoLogin();
                              } else {
                                navigate('/login');
                                showToast(`Silakan masuk untuk mengakses modul Kelompok ${group.number}`, 'info');
                              }
                            }}
                            className="text-xs font-bold text-[#e20113] hover:underline inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>Akses Kelompok</span>
                            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Show More / Show Less Button */}
              {filteredGroups.length > 4 && (
                <div className="mt-8 flex flex-col items-center gap-2">
                  <button
                    onClick={() => setIsGroupsExpanded(!isGroupsExpanded)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 hover:border-[#e20113] hover:text-[#e20113] text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-2xs cursor-pointer group"
                  >
                    <span className="material-symbols-outlined text-[17px] group-hover:translate-y-0.5 transition-transform">
                      {isGroupsExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                    <span>
                      {isGroupsExpanded
                        ? 'Tampilkan Lebih Sedikit (4 Kelompok)'
                        : `Lihat Semua Kelompok (+${filteredGroups.length - 4} Lainnya)`}
                    </span>
                  </button>
                  {!isGroupsExpanded && (
                    <span className="text-[11px] text-slate-400 font-medium">
                      {filteredGroups.length - 4} kelompok disembunyikan agar halaman tetap rapi
                    </span>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════════════
            5. KONTEN KHUSUS SETELAH LOGIN (JEJAK 2025, KARYA, KURIKULUM, CTA)
            * Pada halaman sebelum login, pembagian kelompok langsung bertemu footer
        ══════════════════════════════════════════════════════════════════════════ */}
        {isLoggedIn && (
          <>
            {/* 5. REKAM JEJAK PELAKSANAAN 2025 (4 Displayed Initially + Show More) */}
            <section className="w-full bg-[#f8f9fa] py-16 md:py-20 border-b border-slate-200/80" id="jejak">
              <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#e20113]">
                      03 / REKAM JEJAK
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                      Rekam Pelaksanaan & Galeri 2025
                    </h2>
                  </div>
                  <span className="text-xs font-bold bg-white border border-slate-200 text-slate-700 px-3.5 py-1.5 rounded-xl shadow-2xs">
                    100% Selesai & Terverifikasi
                  </span>
                </div>

                {/* Photo Editorial Grid — 4 items initial */}
                <div className="pt-8 flex flex-col gap-3">
                  {/* Row 1: Spotlight (7 col) + Medium (5 col) */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    {shownStories[0] && (
                      <div
                        onClick={() => setSelectedStory(shownStories[0])}
                        className="md:col-span-7 h-72 md:h-80 relative overflow-hidden rounded-2xl cursor-pointer group border border-slate-200 shadow-2xs"
                      >
                        <img
                          src={shownStories[0].image}
                          alt={shownStories[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-5 text-white">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="bg-[#e20113] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md">
                              {shownStories[0].category}
                            </span>
                            <span className="text-xs text-slate-300 font-semibold">{shownStories[0].date}</span>
                          </div>
                          <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug line-clamp-2">
                            {shownStories[0].title}
                          </h3>
                          <p className="text-xs text-slate-300 mt-1 line-clamp-1">{shownStories[0].school}</p>
                        </div>
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="bg-white/95 text-slate-800 text-xs font-extrabold px-3 py-1 rounded-lg flex items-center gap-1 shadow-xs">
                            <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                            Baca
                          </span>
                        </div>
                      </div>
                    )}

                    {shownStories[1] && (
                      <div
                        onClick={() => setSelectedStory(shownStories[1])}
                        className="md:col-span-5 h-72 md:h-80 relative overflow-hidden rounded-2xl cursor-pointer group border border-slate-200 shadow-2xs"
                      >
                        <img
                          src={shownStories[1].image}
                          alt={shownStories[1].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-5 text-white">
                          <span className="bg-[#e20113] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md self-start mb-1.5 inline-block">
                            {shownStories[1].category}
                          </span>
                          <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug line-clamp-2">
                            {shownStories[1].title}
                          </h3>
                          <p className="text-xs text-slate-300 mt-1 line-clamp-1">{shownStories[1].school}</p>
                        </div>
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="bg-white/95 text-slate-800 text-xs font-extrabold px-3 py-1 rounded-lg flex items-center gap-1 shadow-xs">
                            <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                            Baca
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Row 2: 2 balanced cards (6 col each) */}
                  {shownStories.length >= 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {shownStories.slice(2, 4).map((story) => (
                        <div
                          key={story.id}
                          onClick={() => setSelectedStory(story)}
                          className="h-56 relative overflow-hidden rounded-2xl cursor-pointer group border border-slate-200 shadow-2xs"
                        >
                          <img
                            src={story.image}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-4 text-white">
                            <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md self-start mb-1.5 border border-white/30 inline-block">
                              {story.category}
                            </span>
                            <h4 className="text-sm font-extrabold text-white leading-snug line-clamp-1">{story.title}</h4>
                            <p className="text-xs text-slate-300 mt-0.5">
                              {story.school} · {story.date}
                            </p>
                          </div>
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="bg-white/95 text-slate-800 text-xs font-extrabold px-3 py-1 rounded-lg flex items-center gap-1 shadow-xs">
                              <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                              Baca
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Row 3: Expanded Stories (3 col grid) */}
                  {isDocExpanded && documentaryStories.length > 4 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-in fade-in duration-300">
                      {documentaryStories.slice(4).map((story) => (
                        <div
                          key={story.id}
                          onClick={() => setSelectedStory(story)}
                          className="h-56 relative overflow-hidden rounded-2xl cursor-pointer group border border-slate-200 shadow-2xs"
                        >
                          <img
                            src={story.image}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-4 text-white">
                            <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md self-start mb-1.5 border border-white/30 inline-block">
                              {story.category}
                            </span>
                            <h4 className="text-sm font-extrabold text-white leading-snug line-clamp-1">{story.title}</h4>
                            <p className="text-xs text-slate-300 mt-0.5">{story.school}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Expand / Collapse Button for Stories */}
                {documentaryStories.length > 4 && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => setIsDocExpanded(!isDocExpanded)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-[#e20113] hover:text-[#e20113] text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-2xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[17px]">
                        {isDocExpanded ? 'expand_less' : 'photo_library'}
                      </span>
                      <span>{isDocExpanded ? 'Ringkas Galeri' : `+${documentaryStories.length - 4} Foto Arsip Lainnya`}</span>
                    </button>
                  </div>
                )}

                {/* ══════════════ SUBSECTION: PROJEK YANG DIBUAT (4 CARDS) ══════════════ */}
                <div className="mt-14 pt-10 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#e20113]">
                        ARTEFAK PEMBELAJARAN
                      </span>
                      <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">Karya Nyata Siswa SMP</h3>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                      {shownProjects.length}/{showcaseProjects.length} Artefak
                    </span>
                  </div>

                  {/* 4 Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {shownProjects.map((proj) => (
                      <div
                        key={proj.id}
                        onClick={() => setSelectedProject(proj)}
                        className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden cursor-pointer group hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                          <img
                            src={proj.image}
                            alt={proj.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-slate-900 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-2xs">
                            {proj.tag}
                          </span>
                        </div>

                        <div className="p-4 flex flex-col justify-between flex-1">
                          <div>
                            <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-[#e20113] transition-colors line-clamp-1">
                              {proj.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 leading-snug line-clamp-2">{proj.desc}</p>
                          </div>

                          <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-medium truncate max-w-[130px]">{proj.school}</span>
                            <span className="font-bold text-[#e20113] group-hover:underline">Lihat Rincian</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Expand / Collapse Button for Projects */}
                  {showcaseProjects.length > 4 && (
                    <div className="mt-8 flex justify-center">
                      <button
                        onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-[#e20113] hover:text-[#e20113] text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-2xs cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[17px]">
                          {isProjectsExpanded ? 'expand_less' : 'grid_view'}
                        </span>
                        <span>{isProjectsExpanded ? 'Ringkas Projek' : `+${showcaseProjects.length - 4} Projek Lainnya`}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════════════
            6. STANDAR KURIKULUM & BERKAS
        ══════════════════════════════════════════════════════════════════════════ */}
            <section className="w-full bg-white py-16 md:py-20 border-b border-slate-200/80" id="kurikulum">
              <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  {/* Left Column: Accreditation Points */}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#e20113]">
                      04 / STANDAR PEDOMAN
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 mb-6">
                      Pedoman & Standar Kurikulum
                    </h2>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: 'verified_user', label: 'Disahkan MGMP', sub: 'Informatika Kab. Sidoarjo' },
                        { icon: 'menu_book', label: 'Struktur 6 JP', sub: '30% Teori, 70% Praktik Lab' },
                        { icon: 'fact_check', label: 'Rubrik Penilaian', sub: 'Kreativitas & Kemandirian' },
                        { icon: 'emoji_events', label: 'Kurikulum Merdeka', sub: 'Capaian Fase D SMP' },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3 hover:border-slate-300 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                            <span className="material-symbols-outlined text-[20px] text-[#e20113]">{item.icon}</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{item.label}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{item.sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Downloadable Files */}
                  <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 flex flex-col gap-3 shadow-2xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-900 uppercase">Paket Dokumen Resmi Guru & Tim</span>
                      <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 uppercase">
                        Terverifikasi
                      </span>
                    </div>

                    {[
                      { icon: 'picture_as_pdf', color: 'text-rose-500', name: 'Buku Panduan Mentor Skomda v4.2', size: 'PDF • 4.8 MB' },
                      { icon: 'description', color: 'text-blue-500', name: 'Format RPP & Berita Acara Tatap Muka', size: 'DOCX • 1.2 MB' },
                      { icon: 'table_chart', color: 'text-emerald-500', name: 'Rubrik Penilaian Akhir Siswa SMP', size: 'XLSX • 850 KB' },
                    ].map((doc) => (
                      <div
                        key={doc.name}
                        className="flex items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-xl hover:border-slate-300 transition-colors shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`material-symbols-outlined text-[22px] ${doc.color}`}>{doc.icon}</span>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{doc.name}</p>
                            <p className="text-[11px] text-slate-400 font-medium">{doc.size}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => showToast(`Mengunduh berkas ${doc.name}...`, 'info')}
                          className="text-xs font-bold text-[#e20113] hover:underline px-3 py-1 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer"
                        >
                          Unduh
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════════════
            7. CALL-TO-ACTION (Floating Red Banner with Parallax Feel)
        ══════════════════════════════════════════════════════════════════════════ */}
            <section className="py-16 px-5 sm:px-8 md:px-10 bg-white">
              <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-[#E11D2E] via-[#D7141F] to-[#B80F1A] text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="max-w-2xl">
                    <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-red-200 bg-black/15 px-3 py-1 rounded-full mb-3">
                      Saluran Pendampingan Resmi
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                      Ketua Regu? Butuh bantuan perizinan atau kurikulum?
                    </h3>
                    <p className="text-xs sm:text-sm text-red-100 mt-2 font-normal leading-relaxed">
                      Tim kurikulum dan kemitraan SMK Telkom Sidoarjo siap mendampingi proses koordinasi dengan pihak sekolah mitra secara cepat dan responsif.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      onClick={() => navigate('/workspace')}
                      className="inline-flex items-center gap-2 px-6 h-12 bg-white hover:bg-slate-50 text-[#0B1B3A] font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-md cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#D7141F]">terminal</span>
                      <span>Buka Workspace</span>
                    </button>
                    <button
                      onClick={() => showToast('Menghubungkan ke helpdesk kurikulum...', 'info')}
                      className="inline-flex items-center gap-2 px-6 h-12 bg-black/20 hover:bg-black/30 text-white font-bold text-xs uppercase tracking-wider rounded-full border border-white/25 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">support_agent</span>
                      <span>Hubungi Koordinator</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* ══════════════════════════════════════════════════════════════════════════
          8. FOOTER (EDITORIAL LIGHT THEME)
      ══════════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-white text-slate-600 border-t border-[#E8ECF2] pt-14 pb-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#E8ECF2]">
            {/* Col 1: Identity */}
            <div className="md:col-span-5 space-y-3">
              <div>
                <BrandLogo size="md" />
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Inisiatif vokasi dan pengabdian masyarakat untuk mendampingi literasi digital, komputasi kreatif, dan teknologi tepat guna di 12 SMP Kabupaten Sidoarjo.
              </p>
            </div>

            {/* Col 2: Navigasi */}
            <div className="md:col-span-2 space-y-2.5 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B1B3A] block">Akses Cepat</span>
              <ul className="space-y-2 text-slate-500">
                <li><a href="#alur" className="hover:text-[#D7141F] transition-colors">Alur Pelaksanaan</a></li>
                <li><a href="#jejak" className="hover:text-[#D7141F] transition-colors">Rekam Jejak 2025</a></li>
                <li><a href="#kurikulum" className="hover:text-[#D7141F] transition-colors">Standar Kurikulum</a></li>
                <li><button onClick={() => navigate('/workspace')} className="hover:text-[#D7141F] transition-colors cursor-pointer">Workspace Tim</button></li>
              </ul>
            </div>

            {/* Col 3: Berkas */}
            <div className="md:col-span-2 space-y-2.5 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B1B3A] block">Dokumen</span>
              <ul className="space-y-2 text-slate-500">
                <li><a href="#kurikulum" className="hover:text-[#D7141F] transition-colors">Buku Panduan 2026</a></li>
                <li><a href="#kurikulum" className="hover:text-[#D7141F] transition-colors">Format RPP Fase D</a></li>
                <li><a href="#kurikulum" className="hover:text-[#D7141F] transition-colors">Rubrik Penilaian</a></li>
                <li><button onClick={() => navigate('/admin')} className="hover:text-[#D7141F] transition-colors cursor-pointer">Portal Guru</button></li>
              </ul>
            </div>

            {/* Col 4: Kontak & Lokasi */}
            <div className="md:col-span-3 space-y-2.5 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B1B3A] block">Sekretariat</span>
              <p className="text-slate-500 text-xs leading-relaxed">
                Jl. Raya Pecantingan, Sekardangan, Sidoarjo, Jawa Timur 61215
              </p>
              <p className="text-slate-500 text-xs">
                Email: <a href="mailto:skomda@telkomsda.sch.id" className="text-[#D7141F] font-semibold hover:underline">skomda@telkomsda.sch.id</a>
              </p>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© 2026 SMK Telkom Sidoarjo. Hak Cipta Dilindungi Undang-Undang.</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#D7141F] font-semibold transition-colors cursor-pointer"
              >
                <span>Kembali ke Atas</span>
                <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════════════════════════
          9. MODALS (Project & Story Detail)
      ══════════════════════════════════════════════════════════════════════════ */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-slate-900">{selectedProject.title}</span>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100">
                <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-[#e20113] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {selectedProject.tag}
                </span>
                <span className="text-xs text-slate-500 font-semibold">{selectedProject.school}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedProject.fullDesc ?? selectedProject.desc}
              </p>
              {selectedProject.tools && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedProject.tools.map((t) => (
                    <span key={t} className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Durasi:</span>
                  <span className="font-bold text-slate-800">{selectedProject.duration ?? '2 Pertemuan (6 JP)'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Siswa Terdampak:</span>
                  <span className="font-bold text-slate-800">{selectedProject.studentsTrained ?? 40} Siswa SMP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-slate-900">{selectedStory.category}</span>
              <button
                onClick={() => setSelectedStory(null)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100">
                <img src={selectedStory.image} alt={selectedStory.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-2 text-xs text-slate-500 font-semibold">
                <span>{selectedStory.school}</span>
                <span>•</span>
                <span>{selectedStory.date}</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">{selectedStory.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedStory.caption}</p>
              {selectedStory.quote && (
                <div className="p-3.5 bg-slate-50 border-l-2 border-[#e20113] rounded-r-xl">
                  <p className="text-xs text-slate-700 italic">"{selectedStory.quote.text}"</p>
                  <p className="text-xs font-bold text-slate-900 mt-2">— {selectedStory.quote.author}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
