"use client";
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  groupsData,
  showcaseProjects,
  documentaryStories,
  heroSchoolSpotlights,
  ShowcaseProject,
  DocumentaryMoment,
} from '../data/mockData';
import {
  Users,
  Star,
  BookOpen,
  Pencil,
  GraduationCap,
  Award,
  Check,
  ArrowRight,
  ArrowDown,
  Download,
  Loader2,
  ExternalLink,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Headphones,
  ShieldCheck,
  Clock,
  Instagram,
  Youtube,
  Send,
  ArrowUp,
  Sparkles,
} from 'lucide-react';

// Fallback SVG generator to prevent any broken images
const createFallbackImage = (text: string) => {
  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='450' viewBox='0 0 600 450'><rect width='600' height='450' fill='%23F8FAFC'/><rect x='20' y='20' width='560' height='410' rx='16' fill='%23EDF2F7'/><text x='50%25' y='50%25' font-family='sans-serif' font-weight='600' font-size='16' fill='%2364748B' text-anchor='middle'>${encodeURIComponent(text)}</text></svg>`;
};

// ─── Status Configurations for Pre-Login Group Cards ────────────────────────
const STATUS_CFG: Record<string, { dot: string; text: string; badge: string }> = {
  ontrack: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  },
  review: {
    dot: 'bg-amber-400',
    text: 'text-amber-700',
    badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
  },
  overdue: {
    dot: 'bg-rose-500',
    text: 'text-rose-700',
    badge: 'bg-rose-50 text-rose-700 border-rose-200/80',
  },
  revisi: {
    dot: 'bg-orange-400',
    text: 'text-orange-700',
    badge: 'bg-orange-50 text-orange-700 border-orange-200/80',
  },
};

// ─── 6 Official Stages ──────────────────────────────────────────────────────
const STEPS = [
  { num: 1, icon: Users, label: 'Bentuk Tim', date: '12 Jan', done: true, desc: 'Pemetaan 24 kelompok relawan siswa kelas XII (RPL & TKJ).' },
  { num: 2, icon: Star, label: 'Pilih Ketua', date: '15 Jan', done: true, desc: 'Penetapan ketua regu dan guru pembimbing lapangan.' },
  { num: 3, icon: BookOpen, label: 'Susun Modul', date: '28 Jan', done: true, desc: 'Penyusunan RPP 2 pertemuan berbasis Fase D Informatika.' },
  { num: 4, icon: Pencil, label: 'Siapkan Desain', date: '15 Feb', done: false, active: true, desc: 'Tahap aktif: Finalisasi slide materi dan X-Banner 60×160 cm.' },
  { num: 5, icon: GraduationCap, label: 'Mengajar SMP', date: '18–25 Feb', done: false, desc: 'Penerjunan siswa relawan ke laboratorium sekolah mitra.' },
  { num: 6, icon: Award, label: 'Evaluasi & Nilai', date: '28 Feb', done: false, desc: 'Gelar karya siswa SMP, pengumpulan artefak, dan laporan.' },
];

export const HomePage: React.FC = () => {
  const { navigate, showToast, openGroupWorkspace } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ready' | 'leader'>('all');
  const [selectedStep, setSelectedStep] = useState<number>(1);

  // Hero Spotlight Autoplay state
  const [activeSpotlight, setActiveSpotlight] = useState(0);
  const [isSpotlightPaused, setIsSpotlightPaused] = useState(false);
  const [spotlightProgress, setSpotlightProgress] = useState(0);

    if (!matchesSearch) return false;
    if (selectedFilter === 'ready') return group.status === 'ontrack' || group.status === 'review';
    if (selectedFilter === 'leader') return !group.leaderName.includes('Belum');
    return true;
  }).sort((a, b) => a.number.localeCompare(b.number));

  return (
    <div className="w-full min-h-screen bg-white text-[#0B1B3A] font-['Plus_Jakarta_Sans',sans-serif] antialiased selection:bg-[#D7141F] selection:text-white">
      {/* ─── Top Scroll Progress Bar ────────────────────────────────────────── */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-[#D7141F] z-[1000] transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ══════════════════════════════════════════════════════════════════════════
          0. FLOATING PILL NAVBAR
      ══════════════════════════════════════════════════════════════════════════ */}
      <div className="sticky top-4 z-[900] w-full flex justify-center px-5 pointer-events-none">
        <header
          className={`pointer-events-auto w-full max-w-[1200px] rounded-full border border-slate-200/90 transition-all duration-300 flex items-center justify-between px-4 sm:px-6 ${
            isNavScrolled
              ? 'h-14 bg-white/95 backdrop-blur-md shadow-[0_4px_24px_rgba(11,27,58,0.08)]'
              : 'h-16 bg-white/90 backdrop-blur-sm shadow-[0_2px_12px_rgba(11,27,58,0.04)]'
          }`}
        >
          {/* Brand */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-[#D7141F] text-white flex items-center justify-center font-extrabold text-xs shadow-xs group-hover:bg-[#B80F1A] transition-colors">
              SM
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-[#0B1B3A]">
                Skomda Mengajar <span className="text-[#D7141F] font-bold text-xs ml-1">2026</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">SMK Telkom Sidoarjo</span>
            </div>
          </button>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-50 p-1 rounded-full border border-slate-200/80 text-xs font-semibold text-slate-600">
            <a href="#hero" className="px-4 py-1.5 rounded-full hover:text-[#0B1B3A] transition-colors">
              Beranda
            </a>
            <a href="#alur" className="px-4 py-1.5 rounded-full hover:text-[#0B1B3A] transition-colors">
              Alur
            </a>
            {isLoggedIn ? (
              <>
                <a href="#galeri" className="px-4 py-1.5 rounded-full hover:text-[#0B1B3A] transition-colors">
                  Galeri
                </a>
                <a href="#karya" className="px-4 py-1.5 rounded-full hover:text-[#0B1B3A] transition-colors">
                  Karya
                </a>
                <a href="#pedoman" className="px-4 py-1.5 rounded-full hover:text-[#0B1B3A] transition-colors">
                  Pedoman
                </a>
              </>
            ) : (
              <a href="#kelompok" className="px-4 py-1.5 rounded-full hover:text-[#0B1B3A] transition-colors">
                Kelompok
              </a>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin')}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#b4000c]">monitoring</span>
              <span>Panel Admin</span>
            </button>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center justify-center bg-[#e20113] hover:bg-slate-900 text-white font-bold text-xs uppercase px-4 h-9 rounded-lg transition-colors tracking-wider shadow-none cursor-pointer"
            >
              Masuk
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="w-full pt-16 flex-1">
        {/* ================= HERO SECTION ================= */}
        <section className="relative w-full max-w-7xl mx-auto px-6 md:px-12 pt-12 md:pt-16 overflow-hidden">
          {/* Subtle Ambient Red Glows */}
          <div className="absolute -top-10 left-1/4 w-[500px] h-[500px] bg-red-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-1/3 -right-20 w-[420px] h-[420px] bg-red-50/50 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-6 flex flex-col items-start relative">
              <div className="absolute -bottom-8 -left-4 pointer-events-none select-none text-[84px] md:text-[110px] font-extrabold text-slate-900/[0.03] leading-none tracking-tighter whitespace-nowrap z-0">
                SKOMDA 2026
              </div>

              <div className="relative z-10 flex flex-col items-start">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#e20113] animate-pulse"></span>
                  <span className="text-[11px] text-slate-600 tracking-wider font-bold uppercase">
                    SKOMDA MENGAJAR 2026 • GERAKAN LITERASI & TEKNOLOGI
                  </span>
                </div>

                <div className="flex items-center flex-wrap gap-2 mb-2 select-none">
                  <span className="text-2xl font-extrabold tracking-tight transform -rotate-2 origin-bottom-left text-slate-900 italic">
                    #SKOMDA
                  </span>
                  <span className="bg-[#e20113] text-white text-xs uppercase px-2 py-0.5 rounded-sm transform -rotate-2 origin-center tracking-widest font-extrabold">
                    MENGAJAR
                  </span>
                  <span className="ml-2 text-xs font-semibold text-slate-400 tracking-widest uppercase">
                    #Impact2026
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08] text-left mb-4 mt-1">
                  Kembali Mengajar, <br />
                  <span className="text-[#e20113]">Menginspirasi Nyata.</span>
                </h1>

                <p className="text-base md:text-lg text-slate-600 max-w-lg mb-8 leading-relaxed font-normal">
                  Gerakan kolaboratif literasi digital siswa SMK Telkom Sidoarjo untuk sekolah menengah pertama asal se-Kabupaten Sidoarjo.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="#kelompok"
                    className="inline-flex items-center gap-2 bg-[#e20113] text-white hover:bg-slate-900 transition-colors text-xs font-bold px-6 h-12 rounded-full tracking-wider uppercase group shadow-none"
                  >
                    <span>Daftar Kelompok</span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </a>
                  <a
                    href="#jejak-2025"
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-[#e20113] transition-colors px-5 h-12 rounded-full border border-slate-200 hover:border-[#e20113] bg-white"
                  >
                    <span className="material-symbols-outlined text-[#e20113] text-[20px]">play_circle</span>
                    <span>Tonton Dokumentasi</span>
                  </a>
                  <button
                    onClick={() => navigate('/workspace')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#b4000c] hover:bg-red-50 transition-colors px-4 h-12 rounded-full border border-red-200 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">engineering</span>
                    <span>Workspace Tim (Langkah 04)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Stack */}
            <div className="lg:col-span-6 relative flex items-center justify-center min-h-[440px] md:min-h-[490px] mt-8 lg:mt-0 select-none">
              <div className="relative z-10 w-[270px] sm:w-[350px] md:w-[390px] h-[300px] sm:h-[350px] md:h-[390px] bg-white rounded-2xl p-2 border border-slate-200 shadow-xl overflow-hidden">
                <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt="Kelas interaktif siswa SMK Telkom di ruang komputer SMP"
                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-white/95 backdrop-blur-sm text-slate-900 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                        Kelas Live
                      </span>
                      <span className="text-white text-xs drop-shadow font-semibold">SMP Telkom Sidoarjo</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Smaller overlapping mentor photo */}
              <div className="absolute z-20 -bottom-6 -right-2 sm:right-0 w-[190px] sm:w-[240px] md:w-[260px] h-[240px] sm:h-[290px] bg-white rounded-2xl p-2 border border-slate-200 shadow-xl overflow-hidden">
                <div className="w-full h-full bg-slate-100 rounded-xl overflow-hidden relative">
                  <img
                    className="w-full h-full object-cover"
                    alt="Mentor siswa SMK Telkom presentasi di depan kelas"
                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent flex flex-col justify-end p-3">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e20113] inline-block animate-pulse"></span>
                      <span className="text-[9px] text-white font-bold uppercase tracking-wider">Mentor Utama</span>
                    </div>
                    <span className="text-[11px] text-white font-medium mt-0.5">UI/UX & Web Dev</span>
                  </div>
                </div>
              </div>

              {/* Top Participation Badge */}
              <div className="absolute -top-3 left-0 sm:left-4 z-30 bg-[#e20113] text-white rounded-xl p-3 flex items-center gap-2 shadow-lg">
                <span className="material-symbols-outlined text-[22px]">trending_up</span>
                <div className="flex flex-col text-left pr-2">
                  <span className="text-xl font-extrabold leading-none">100%</span>
                  <span className="text-[10px] text-white/90 font-bold tracking-wider uppercase mt-0.5">
                    Tingkat Partisipasi
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Metrics Strip */}
          <div className="w-full mt-16 pt-6">
            <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 relative overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                <div className="flex flex-col items-center md:items-start text-center md:text-left border-r border-slate-200 last:border-r-0 pr-4">
                  <span className="text-4xl md:text-5xl font-light text-[#e20113] leading-none">12</span>
                  <span className="text-xs font-bold text-slate-900 mt-2 uppercase tracking-wider">SMP Mitra</span>
                  <span className="text-xs text-slate-500 mt-0.5">Sidoarjo & sekitarnya</span>
                </div>
                <div className="flex flex-col items-center md:items-start text-center md:text-left border-r border-slate-200 last:border-r-0 pr-4">
                  <span className="text-4xl md:text-5xl font-light text-slate-900 leading-none">24</span>
                  <span className="text-xs font-bold text-slate-900 mt-2 uppercase tracking-wider">Kelompok Tim</span>
                  <span className="text-xs text-slate-500 mt-0.5">Terbuka untuk kolaborasi</span>
                </div>
                <div className="flex flex-col items-center md:items-start text-center md:text-left border-r border-slate-200 last:border-r-0 pr-4">
                  <span className="text-4xl md:text-5xl font-light text-slate-900 leading-none">180</span>
                  <span className="text-xs font-bold text-slate-900 mt-2 uppercase tracking-wider">Siswa Relawan</span>
                  <span className="text-xs text-slate-500 mt-0.5">Berdedikasi</span>
                </div>
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <span className="text-4xl md:text-5xl font-light text-[#e20113] leading-none">30</span>
                  <span className="text-xs font-bold text-slate-900 mt-2 uppercase tracking-wider">
                    Hari Menuju Kickoff
                  </span>
                  <span className="text-xs text-slate-500 mt-0.5">Penyusunan modul tuntas</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 01: ALUR SKOMDA MENGAJAR ================= */}
        <section className="w-full bg-white py-20 mt-12" id="alur">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                01 / PERJALANAN
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
                Alur Skomda Mengajar
              </h2>
              <p className="text-sm text-slate-500 mt-2.5 leading-relaxed">
                Tahapan terstruktur dari pembentukan tim hingga evaluasi luaran nyata di sekolah mitra.
              </p>
            </div>

            {/* 6-Node Wavy Serpentine Track */}
            <div className="w-full relative pt-14 pb-6 overflow-x-auto select-none">
              <div className="min-w-[920px] relative px-4">
                {/* Dashed Wave Connector SVG */}
                <svg
                  className="absolute inset-x-4 top-0 w-[calc(100%-2rem)] h-[120px] pointer-events-none z-0"
                  viewBox="0 0 1000 120"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 83 34 C 166 34, 166 74, 250 74 C 333 74, 333 34, 417 34 C 500 34, 500 74, 583 74 C 667 74, 667 34, 750 34 C 833 34, 833 74, 917 74"
                    fill="none"
                    stroke="#475569"
                    strokeWidth="1.6"
                    strokeDasharray="4 5"
                  />
                </svg>

                <div className="grid grid-cols-6 gap-4 relative z-10 items-start">
                  {[
                    {
                      step: 1,
                      num: '01',
                      icon: 'group_add',
                      title: 'Bentuk kelompok',
                      subtitle: 'Penentuan anggota tim',
                      shiftDown: false,
                    },
                    {
                      step: 2,
                      num: '02',
                      icon: 'person_check',
                      title: 'Pilih ketua',
                      subtitle: 'Koordinator lapangan',
                      shiftDown: true,
                    },
                    {
                      step: 3,
                      num: '03',
                      icon: 'menu_book',
                      title: 'Susun materi',
                      subtitle: 'Modul & silabus ajar',
                      shiftDown: false,
                    },
                    {
                      step: 4,
                      num: '04',
                      icon: 'palette',
                      title: 'Siapkan desain',
                      subtitle: 'Media visual & slide',
                      shiftDown: true,
                    },
                    {
                      step: 5,
                      num: '05',
                      icon: 'school',
                      title: 'Mengajar di SMP',
                      subtitle: 'Sesi kelas interaktif',
                      shiftDown: false,
                    },
                    {
                      step: 6,
                      num: '06',
                      icon: 'check_circle',
                      title: 'Laporan & feedback',
                      subtitle: 'Refleksi & publikasi',
                      shiftDown: true,
                      isFinish: true,
                    },
                  ].map((item) => {
                    const isActive = selectedStep === item.step;
                    return (
                      <div
                        key={item.step}
                        onClick={() => {
                          setSelectedStep(item.step);
                          if (item.step === 4) {
                            navigate('/workspace');
                          }
                        }}
                        className={`flex flex-col items-center text-center cursor-pointer group relative ${
                          item.shiftDown ? 'mt-10' : 'mt-0'
                        }`}
                      >
                        {item.isFinish && (
                          <span className="absolute -top-6 right-1/2 translate-x-9 bg-[#e20113] text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-xs transform -rotate-6 shadow-xs">
                            FINISH
                          </span>
                        )}

                        <div
                          className={`w-[68px] h-[68px] rounded-2xl flex flex-col items-center justify-center mb-3.5 transition-all ${
                            isActive
                              ? 'bg-[#e20113] text-white shadow-lg shadow-red-500/20 border border-[#e20113]'
                              : 'bg-white text-slate-800 border border-slate-200/90 shadow-xs group-hover:border-slate-300'
                          }`}
                        >
                          <span
                            className={`text-[10px] font-semibold leading-none mb-1 ${
                              isActive ? 'text-white/90' : 'text-slate-400'
                            }`}
                          >
                            {item.num}
                          </span>
                          <span
                            className={`material-symbols-outlined text-[20px] leading-none ${
                              isActive ? 'text-white' : 'text-slate-800'
                            }`}
                          >
                            {item.icon}
                          </span>
                        </div>

                        <span className="text-xs font-extrabold text-slate-900">{item.title}</span>
                        <span className="text-[11px] text-slate-400 mt-0.5">{item.subtitle}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </button>
          </div>
        </header>
      </div>

        {/* ================= SECTION 02: PEMBAGIAN KELOMPOK ================= */}
        <section className="w-full bg-[#f9f9f9] py-20 border-b border-slate-200" id="kelompok">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  02 / ORGANISASI TIM
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
                  Pembagian Kelompok
                </h2>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari SMP atau anggota.."
                    className="h-10 pl-9 pr-4 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#e20113] w-56 shadow-2xs"
                  />
                  <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-slate-400 text-[18px]">
                    search
                  </span>
                </div>

                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`h-10 px-4 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    selectedFilter === 'all'
                      ? 'bg-[#e20113] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setSelectedFilter('leader')}
                  className={`h-10 px-4 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    selectedFilter === 'leader'
                      ? 'bg-[#e20113] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  Ketua sudah ada
                </button>
              </div>
            </div>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {filteredGroups.map((group) => (
                <div
                  key={group.id}
                  className="group bg-white rounded-2xl p-6 border border-slate-200/90 transition-all flex flex-col justify-between shadow-xs hover:shadow-md hover:border-slate-300"
                >
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <span className="bg-[#e20113] text-white text-[10px] font-extrabold tracking-wider px-2.5 py-1 uppercase inline-block transform -rotate-2 group-hover:rotate-0 transition-transform shadow-2xs">
                        KELOMPOK {group.number}
                      </span>
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              group.status === 'ontrack'
                                ? 'bg-emerald-500'
                                : group.status === 'review'
                                ? 'bg-amber-500'
                                : group.status === 'overdue'
                                ? 'bg-[#b4000c]'
                                : 'bg-orange-500'
                            }`}
                          />
                          {group.statusLabel}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 block">Sedang Aktif</span>
                      </div>

                      {/* Stat 3: 5 Siswa */}
                      <div className="border-l border-slate-200/80 pl-4 sm:pl-6 card-smooth p-2 rounded-xl hover:bg-white/80">
                        <span className="text-xl sm:text-2xl font-extrabold text-[#0B1B3A] tracking-tight block leading-tight">
                          5 Siswa
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 block">Relawan Regu</span>
                      </div>

                      {/* Stat 4: 18-25 Feb */}
                      <div className="border-l border-slate-200/80 pl-4 sm:pl-6 card-smooth p-2 rounded-xl hover:bg-white/80">
                        <span className="text-xl sm:text-2xl font-extrabold text-[#0B1B3A] tracking-tight block leading-tight">
                          18–25 Feb
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 block">Jadwal Mengajar</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="card-smooth p-2 rounded-xl hover:bg-white/80">
                        <span className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight block">12</span>
                        <span className="text-xs font-semibold text-slate-500 mt-0.5 block">SMP Mitra</span>
                      </div>
                      <div className="card-smooth p-2 rounded-xl hover:bg-white/80">
                        <span className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight block">24</span>
                        <span className="text-xs font-semibold text-slate-500 mt-0.5 block">Kelompok</span>
                      </div>
                      <div className="card-smooth p-2 rounded-xl hover:bg-white/80">
                        <span className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight block">180</span>
                        <span className="text-xs font-semibold text-slate-500 mt-0.5 block">Relawan Siswa</span>
                      </div>
                      <div className="card-smooth p-2 rounded-xl hover:bg-white/80">
                        <span className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight block">1.4k+</span>
                        <span className="text-xs font-semibold text-slate-500 mt-0.5 block">Siswa SMP</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Right Column: Interactive School Collage with Glass Panel */}
              <div
                className="lg:col-span-5 relative"
                onMouseEnter={() => setIsSpotlightPaused(true)}
                onMouseLeave={() => setIsSpotlightPaused(false)}
              >
                {/* School Switcher Tabs with Animated Progress Line */}
                <div className="flex items-center gap-1 mb-3 bg-white/80 backdrop-blur-xs border border-slate-200/80 p-1 rounded-full w-fit relative overflow-hidden shadow-2xs">
                  {heroSchoolSpotlights.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectSpotlight(idx)}
                      className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                        activeSpotlight === idx
                          ? 'bg-[#D7141F] text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
                      }`}
                    >
                      Kel. {item.groupNumber}
                    </button>
                  ))}
                  <div
                    className="absolute bottom-0 left-0 h-0.5 bg-[#D7141F] transition-all duration-75"
                    style={{ width: `${spotlightProgress}%` }}
                  />
                </div>

                {/* Main Card */}
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200/80 group card-hover-modern bg-white">
                  <img
                    src={spot.image}
                    alt={spot.schoolName}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = createFallbackImage(`Foto Kegiatan ${spot.schoolName}`);
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Glassmorphism Bottom Panel */}
                  <div className="absolute inset-x-3 bottom-3 bg-white/92 backdrop-blur-md border border-white/90 rounded-2xl p-4 shadow-lg transition-transform duration-300 group-hover:-translate-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#D7141F] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-2xs">
                        Kel. {spot.groupNumber}
                      </span>
                      <span className="text-xs text-slate-700 font-bold">{spot.schoolName}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-extrabold text-[#0B1B3A] line-clamp-1">
                      {spot.moduleTitle}
                    </h3>

                    <div className="mt-2 pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Ketua: {spot.leaderName}</span>
                      <button
                        onClick={() => openGroupWorkspace(group.number)}
                        className="text-xs font-bold text-[#b4000c] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Buka Workspace</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════
            2. ALUR SECTION (6 STAGES, PENCIL ICON FOR ACTIVE, SINGLE MERGED CARD)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section className="w-full bg-gradient-to-b from-white via-slate-50/50 to-white py-16 md:py-20 border-t border-slate-200/80 relative" id="alur">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-dot-red opacity-[0.03] pointer-events-none" />

          <div className="max-w-[1200px] mx-auto px-5 sm:px-6 relative z-10">
            {!isLoggedIn ? (
              /* ─── A. PRA-LOGIN ALUR: HANYA TAHAP 1 & 2 ─── */
              <div>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200/80">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#D7141F]">
                      01 / TAHAP PERSIAPAN AWAL
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight mt-1">
                      Alur Pembagian Kelompok & Pembentukan Ketua
                    </h2>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-bold shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Tahap 01 & 02 Selesai Ditetapkan</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-8">
                  <div className="p-6 bg-white border border-slate-200/90 rounded-2xl card-hover-modern flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-[#D7141F] text-white text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded shadow-2xs">
                          Tahap 01
                        </span>
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <Check className="w-4 h-4 text-emerald-600" />
                          Selesai (12 Jan)
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-extrabold text-[#0B1B3A] group-hover:text-[#D7141F] transition-colors">
                        Pembagian Kelompok Mengajar
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                        180 siswa kelas XII RPL & TKJ telah dipetakan ke dalam 24 kelompok untuk 12 SMP di Kabupaten Sidoarjo.
                      </p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Lihat nama anggota:</span>
                      <a href="#kelompok" className="font-bold text-[#D7141F] hover:underline flex items-center gap-1 group/btn">
                        <span>Cek Daftar Kelompok</span>
                        <ArrowDown className="w-3.5 h-3.5 group-hover/btn:translate-y-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>

                  <div className="p-6 bg-white border border-slate-200/90 rounded-2xl card-hover-modern flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-[#D7141F] text-white text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded shadow-2xs">
                          Tahap 02
                        </span>
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <Check className="w-4 h-4 text-emerald-600" />
                          Selesai (15 Jan)
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-extrabold text-[#0B1B3A] group-hover:text-[#D7141F] transition-colors">
                        Pembentukan Ketua Regu & Pembimbing
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                        Penetapan 24 ketua regu siswa serta pendampingan guru pembimbing lapangan untuk memulai koordinasi kurikulum.
                      </p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Akses ketua regu:</span>
                      <button
                        onClick={() => navigate('/login')}
                        className="font-bold text-[#D7141F] hover:underline flex items-center gap-1 cursor-pointer group/btn"
                      >
                        <span>Masuk Akun Ketua</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ─── B. LOGGED IN ALUR: 6 TAHAP LENGKAP DENGAN IKON PENSIL & SINGLE CARD ─── */
              <div>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200/80">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#D7141F]">
                      01 / ALUR RESMI
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight mt-1">
                      Alur Skomda Mengajar 2026
                    </h2>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-50 border border-red-200 text-[#D7141F] rounded-full text-xs font-bold shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#D7141F] animate-pulse" />
                    <span>Minggu ke-4 • Tahap Desain Berjalan</span>
                  </div>
                </div>

                {/* 6 Stages Stepper Rail (Active Stage uses Pencil icon, NEVER cross!) */}
                <div className="pt-10 pb-6 overflow-x-auto select-none">
                  <div className="min-w-[760px] grid grid-cols-6 gap-3 relative">
                    {STEPS.map((step) => {
                      const IconComp = step.icon;
                      return (
                        <div
                          key={step.num}
                          className="flex flex-col items-center text-center p-3.5 relative group card-smooth rounded-2xl hover:bg-white border border-transparent hover:border-slate-200/80 cursor-pointer"
                        >
                          {/* Active Stage Pulsing Pill */}
                          {step.active && (
                            <span className="absolute -top-3 bg-[#D7141F] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-xs animate-bounce">
                              Sedang berjalan
                            </span>
                          )}

                          {/* Stepper Circle */}
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs mb-3 transition-all duration-300 ${
                              step.done
                                ? 'bg-emerald-500 text-white shadow-xs group-hover:scale-105'
                                : step.active
                                ? 'bg-[#D7141F] text-white ring-4 ring-red-100 shadow-md group-hover:scale-110'
                                : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'
                            }`}
                          >
                            {step.done ? (
                              <Check className="w-5 h-5 text-white stroke-[2.5]" />
                            ) : (
                              <IconComp className="w-5 h-5" />
                            )}
                          </div>

                          <h4 className="text-xs font-bold text-[#0B1B3A] leading-tight line-clamp-1 group-hover:text-[#D7141F] transition-colors">
                            {step.label}
                          </h4>
                          <span className="text-[11px] text-slate-400 mt-1 font-medium">{step.date}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ─── SINGLE MERGED CARD: POSISI KELOMPOKMU WITH ACCENT BORDER & GLOW ─── */}
                <div className="mt-6 p-[1px] bg-gradient-to-r from-red-500/25 via-slate-200/80 to-red-500/15 rounded-3xl shadow-[0_12px_36px_-8px_rgba(11,27,58,0.08)] card-hover-modern">
                  <div className="p-6 sm:p-8 bg-white rounded-[23px] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                    {/* Ambient subtle decorative glow inside card */}
                    <div className="absolute -right-16 -top-16 w-52 h-52 bg-red-50/60 rounded-full blur-2xl pointer-events-none" />

                    {/* Left: Dynamic Circular Progress Ring (67% from 4/6 tasks) */}
                    <div className="flex items-center gap-5 relative z-10">
                      <div className="relative w-16 h-16 shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="3.5" />
                          <circle
                            cx="18"
                            cy="18"
                            r="14"
                            fill="none"
                            stroke="#D7141F"
                            strokeWidth="3.5"
                            strokeDasharray="88"
                            strokeDashoffset={88 - (88 * 67) / 100}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-[#D7141F]">
                          67%
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold shadow-2xs">
                            Sesuai jadwal
                          </span>
                          <span className="text-xs text-slate-400 font-medium">Tenggat: 15 Feb (4 hari lagi)</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-extrabold text-[#0B1B3A]">
                          Tahap 04 — Siapkan Desain: Finalisasi Slide Materi & X-Banner 60×160 cm
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed max-w-xl">
                          Kelompokmu telah menyelesaikan 4 dari 6 tugas sprint. Satu berkas lagi sebelum diverifikasi oleh guru pembimbing.
                        </p>
                      </div>
                    </div>

                    {/* Right: EXACTLY ONE Action Button */}
                    <div className="shrink-0 w-full md:w-auto relative z-10">
                      <button
                        onClick={() => navigate('/workspace')}
                        className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-7 h-12 bg-[#D7141F] hover:bg-[#B80F1A] text-white font-bold text-xs uppercase tracking-wider rounded-full btn-primary-glow cursor-pointer group"
                      >
                        <span>Buka Lembar Kerja</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════
            3. PEMBAGIAN KELOMPOK (HANYA MUNCUL DI SEBELUM LOGIN)
        ══════════════════════════════════════════════════════════════════════════ */}
        {!isLoggedIn && (
          <section className="w-full bg-gradient-to-b from-slate-50/80 via-rose-50/20 to-slate-50/70 py-16 md:py-20 border-t border-slate-200/80 relative" id="kelompok">
            <div className="absolute inset-0 bg-grid-slate opacity-25 pointer-events-none" />

            <div className="max-w-[1200px] mx-auto px-5 sm:px-6 relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b border-slate-200/80">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D7141F]">
                    02 / ORGANISASI TIM
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight mt-1">
                    Pembagian Kelompok Mengajar 2026
                  </h2>
                </div>

                {/* Filter & Search */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari sekolah, ketua, kecamatan..."
                      className="h-9 pl-9 pr-7 text-xs bg-white border border-slate-200 rounded-full text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#D7141F] w-64 shadow-2xs transition-all focus:ring-2 focus:ring-red-100"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>

                  <div className="flex bg-slate-200/80 rounded-full p-1 gap-1 shadow-2xs">
                    {([
                      ['all', 'Semua'],
                      ['ontrack', 'Sesuai Jadwal'],
                      ['review', 'Review'],
                      ['overdue', 'Perhatian'],
                    ] as const).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedFilter(key as any)}
                        className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                          selectedFilter === key
                            ? 'bg-white text-[#D7141F] shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid 4 Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                {shownGroups.map((group) => {
                  const cfg = STATUS_CFG[group.status] ?? STATUS_CFG.ontrack;
                  return (
                    <div
                      key={group.id}
                      className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between card-hover-modern group hover:border-red-200/90 shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="bg-[#D7141F] text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-2xs">
                            Kel. {group.number}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                            {group.statusLabel}
                          </span>
                        </div>
                        <h4 className="font-bold text-[#0B1B3A] group-hover:text-[#D7141F] transition-colors">{group.schoolName}</h4>
                        <span className="text-[11px] text-slate-400">Kec. {group.district}</span>

                        <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-1.5 text-slate-600">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Ketua:</span>
                            <span className="font-bold text-slate-800">{group.leaderName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Target:</span>
                            <span className="font-medium text-slate-700">{group.targetDate}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (group.number === '03') handleQuickDemoLogin();
                          else navigate('/login');
                        }}
                        className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-[#D7141F] hover:underline flex items-center justify-between cursor-pointer group/link"
                      >
                        <span>Akses Modul</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {filteredGroups.length > 4 && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => setIsGroupsExpanded(!isGroupsExpanded)}
                    className="px-6 py-2.5 bg-white border border-slate-200 text-xs font-bold rounded-full btn-secondary-smooth hover:border-[#D7141F] hover:text-[#D7141F] cursor-pointer shadow-xs"
                  >
                    {isGroupsExpanded ? 'Tampilkan Lebih Sedikit' : `Lihat Semua Kelompok (+${filteredGroups.length - 4})`}
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════════════
            4. GALERI SECTION (BENTO GRID 12 COLS & LIGHTBOX MODAL WITH ACCENTS)
        ══════════════════════════════════════════════════════════════════════════ */}
        {isLoggedIn && (
          <section className="w-full bg-gradient-to-b from-white via-slate-50/40 to-white py-16 md:py-20 border-t border-slate-200/80 relative" id="galeri">
            <div className="absolute top-1/4 -right-16 w-80 h-80 bg-red-50/40 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-[1200px] mx-auto px-5 sm:px-6 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200/80">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D7141F]">
                    02 / GALERI
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight mt-1">
                    Rekam Jejak 2025
                  </h2>
                </div>
                <span className="text-xs font-bold bg-white border border-slate-200 text-slate-700 px-3.5 py-1.5 rounded-full shadow-2xs">
                  100% Selesai & Terverifikasi
                </span>
              </div>

              {/* Bento Grid 12 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-8">
                {documentaryStories.slice(0, 4).map((story, idx) => {
                  const isWide = idx === 0 || idx === 3;
                  return (
                    <div
                      key={story.id}
                      onClick={() => handleOpenLightbox(idx)}
                      className={`${
                        isWide ? 'md:col-span-7' : 'md:col-span-5'
                      } h-72 md:h-80 relative overflow-hidden rounded-3xl cursor-pointer group border border-slate-200/80 card-hover-modern shadow-[0_4px_20px_rgba(11,27,58,0.06)]`}
                    >
                      <img
                        src={story.image}
                        alt={story.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = createFallbackImage(story.title);
                        }}
                        className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700"
                      />
                      <div className="absolute inset-x-3 bottom-3 bg-white/92 backdrop-blur-md border border-white/95 rounded-2xl p-4 shadow-md group-hover:-translate-y-1.5 transition-transform duration-300">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-[#D7141F] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-2xs">
                            {story.category}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">{story.date}</span>
                        </div>
                        <h4 className="text-sm sm:text-base font-extrabold text-[#0B1B3A] line-clamp-1 group-hover:text-[#D7141F] transition-colors">
                          {story.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{story.school}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => handleOpenLightbox(0)}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-xs font-bold rounded-full btn-secondary-smooth hover:border-[#D7141F] hover:text-[#D7141F] cursor-pointer shadow-xs inline-flex items-center gap-2"
                >
                  <span>Buka +3 Foto Arsip Lainnya</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════════════
            5. KARYA SECTION (FILTER & 4-COLUMN CARDS WITH NO BROKEN IMAGES & GLOW)
        ══════════════════════════════════════════════════════════════════════════ */}
        {isLoggedIn && (
          <section className="w-full bg-gradient-to-b from-white via-rose-50/20 to-white py-16 md:py-20 border-t border-slate-200/80 relative" id="karya">
            <div className="absolute inset-0 bg-dot-red opacity-[0.025] pointer-events-none" />

            <div className="max-w-[1200px] mx-auto px-5 sm:px-6 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200/80">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D7141F]">
                    03 / KARYA
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight mt-1">
                    Karya Nyata Siswa SMP
                  </h2>
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-slate-100/90 p-1 rounded-full text-xs font-bold shadow-2xs border border-slate-200/60">
                  {(['all', 'PELATIHAN', 'WEBSITE', 'DESAIN', 'LITERASI DIGITAL'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setKaryaFilter(cat)}
                      className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                        karyaFilter === cat ? 'bg-white text-[#D7141F] shadow-xs' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {cat === 'all' ? 'Semua' : cat.charAt(0) + cat.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4 Cards Grid with Image Fallbacks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-8">
                {shownProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden card-hover-modern hover:border-red-200/80 flex flex-col justify-between group"
                  >
                    <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = createFallbackImage(proj.title);
                        }}
                        className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700"
                      />
                      <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#0B1B3A] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-2xs">
                        {proj.tag}
                      </span>
                    </div>

                    <div className="p-5 flex flex-col justify-between flex-1">
                      <div>
                        <h4 className="text-sm sm:text-base font-extrabold text-[#0B1B3A] group-hover:text-[#D7141F] transition-colors line-clamp-2 leading-snug">
                          {proj.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">{proj.desc}</p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium truncate max-w-[130px]">{proj.school}</span>
                        <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#D7141F] text-slate-600 group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {showcaseProjects.length > 4 && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
                    className="px-6 py-2.5 bg-white border border-slate-200 text-xs font-bold rounded-full btn-secondary-smooth hover:border-[#D7141F] hover:text-[#D7141F] cursor-pointer shadow-xs"
                  >
                    {isProjectsExpanded ? 'Ringkas Karya' : `+${showcaseProjects.length - 4} Karya Lainnya`}
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════════════
            6. PEDOMAN SECTION (2 EQUAL COLUMNS & REALISTIC DOWNLOAD INTERACTION)
        ══════════════════════════════════════════════════════════════════════════ */}
        {isLoggedIn && (
          <section className="w-full bg-gradient-to-b from-slate-50/70 via-white to-slate-50/80 py-16 md:py-20 border-t border-slate-200/80 relative" id="pedoman">
            <div className="max-w-[1200px] mx-auto px-5 sm:px-6 relative z-10">
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-[#D7141F]">
                  04 / PEDOMAN
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3A] tracking-tight mt-1">
                  Pedoman & Standar Kurikulum
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                {/* Left Column: 2x2 Bento Tiles */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: ShieldCheck, label: 'Disahkan MGMP', sub: 'Informatika Kab. Sidoarjo', color: 'bg-red-50 text-[#D7141F]' },
                    { icon: Clock, label: 'Struktur 6 JP', sub: '30% Teori, 70% Praktik Lab', color: 'bg-amber-50 text-amber-700' },
                    { icon: Award, label: 'Rubrik Penilaian', sub: 'Kreativitas & Kemandirian', color: 'bg-emerald-50 text-emerald-700' },
                    { icon: BookOpen, label: 'Kurikulum Merdeka', sub: 'Capaian Fase D SMP', color: 'bg-blue-50 text-blue-700' },
                  ].map((item) => {
                    const TileIcon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="p-5 bg-white border border-slate-200/80 rounded-2xl flex flex-col justify-between card-smooth hover:border-red-200/80 group shadow-2xs"
                      >
                        <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0 mb-4 transition-transform duration-300 group-hover:scale-110`}>
                          <TileIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-[#0B1B3A] group-hover:text-[#D7141F] transition-colors">{item.label}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{item.sub}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right Column: Downloadable Files with Micro-Interaction */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-2xs card-smooth">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                      <span className="text-xs font-bold text-[#0B1B3A] uppercase">
                        Paket Dokumen Resmi Guru & Tim
                      </span>
                      <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full uppercase shadow-2xs">
                        Terverifikasi
                      </span>
                    </div>

                    <div className="space-y-3 mt-4">
                      {[
                        { id: 'doc-1', name: 'Buku Panduan Mentor Skomda v4.2', size: 'PDF • 4.8 MB' },
                        { id: 'doc-2', name: 'Format RPP & Berita Acara Tatap Muka', size: 'DOCX • 1.2 MB' },
                        { id: 'doc-3', name: 'Rubrik Penilaian Akhir Siswa SMP', size: 'XLSX • 850 KB' },
                      ].map((doc) => {
                        const isDownloading = downloadingDoc === doc.id;
                        const isDone = downloadedDocs[doc.id];

                        return (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl hover:border-red-200 hover:bg-red-50/25 hover:translate-x-1.5 transition-all duration-300 shadow-2xs group"
                          >
                            <div>
                              <p className="text-xs font-bold text-[#0B1B3A] group-hover:text-[#D7141F] transition-colors">{doc.name}</p>
                              <p className="text-[11px] text-slate-400">{doc.size}</p>
                            </div>

                            <button
                              onClick={() => handleSimulateDownload(doc.id, doc.name)}
                              disabled={isDownloading}
                              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs ${
                                isDone
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : isDownloading
                                  ? 'bg-slate-100 text-slate-400'
                                  : 'bg-red-50 hover:bg-red-100 text-[#D7141F] border border-red-200 btn-secondary-smooth'
                              }`}
                            >
                              {isDownloading ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span>Mengunduh...</span>
                                </>
                              ) : isDone ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Terunduh</span>
                                </>
                              ) : (
                                <>
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Unduh</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-4">
                    Sinkronisasi dokumen otomatis diperbarui per 12 Februari 2026.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════════════
            7. FLOATING CTA BANNER WITH AMBIENT PARTICLES
        ══════════════════════════════════════════════════════════════════════════ */}
        <section className="py-16 relative overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-6 relative z-10">
            <div className="bg-gradient-to-br from-[#E11D2E] via-[#D7141F] to-[#B80F1A] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_20px_48px_-12px_rgba(184,15,26,0.35)] relative overflow-hidden card-hover-modern">
              {/* Decorative light glow orbs */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none" />

              <div className="max-w-xl text-center md:text-left relative z-10">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-red-200 block mb-1">
                  Pendampingan resmi
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Butuh bantuan perizinan atau kurikulum?
                </h3>
                <p className="text-xs sm:text-sm text-red-100 mt-2 font-normal leading-relaxed">
                  Tim kurikulum dan kemitraan SMK Telkom Sidoarjo siap mendampingi kelompokmu langsung di sekolah tujuan.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 justify-center shrink-0 relative z-10">
                <button
                  onClick={() => navigate('/workspace')}
                  className="inline-flex items-center gap-2 px-6 h-12 bg-white text-[#D7141F] font-bold text-xs uppercase tracking-wider rounded-full hover:bg-slate-100 transition-all cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Masuk Workspace</span>
                </button>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 h-12 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-full border border-white/30 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Headphones className="w-4 h-4" />
                  <span>Hubungi Koordinator</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ══════════════════════════════════════════════════════════════════════════
          8. ELEVATED LIGHT THEME FOOTER WITH SOFT ACCENT GRADIENT
      ══════════════════════════════════════════════════════════════════════════ */}
      <footer className="w-full bg-gradient-to-b from-white via-slate-50/60 to-slate-100/50 border-t border-slate-200/80 pt-16 pb-12 relative">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-200/80">
            {/* Col 1: Brand & Description */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#D7141F] text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
                  SM
                </div>
                <span className="font-extrabold text-sm text-[#0B1B3A]">SKOMDA MENGAJAR 2026</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                Inisiatif Pengabdian Masyarakat SMK Telkom Sidoarjo melatih keterampilan teknologi aplikatif dan etika digital di 12 SMP mitra se-Kabupaten Sidoarjo.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <a
                  href="#"
                  className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-white hover:bg-[#D7141F] hover:border-[#D7141F] card-smooth hover:-translate-y-1 cursor-pointer shadow-2xs"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-white hover:bg-[#D7141F] hover:border-[#D7141F] card-smooth hover:-translate-y-1 cursor-pointer shadow-2xs"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/6281234567890"
                  className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-white hover:bg-[#D7141F] hover:border-[#D7141F] card-smooth hover:-translate-y-1 cursor-pointer shadow-2xs"
                  aria-label="WhatsApp"
                >
                  <Send className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="md:col-span-2 space-y-3">
              <h5 className="text-xs font-bold text-[#0B1B3A] uppercase tracking-wider">Navigasi</h5>
              <div className="flex flex-col space-y-2 text-xs text-slate-500 font-medium">
                <a href="#hero" className="hover:text-[#D7141F] hover:translate-x-1 transition-all duration-200">Beranda</a>
                <a href="#alur" className="hover:text-[#D7141F] hover:translate-x-1 transition-all duration-200">Alur Pelaksanaan</a>
                <a href="#galeri" className="hover:text-[#D7141F] hover:translate-x-1 transition-all duration-200">Galeri 2025</a>
                <a href="#karya" className="hover:text-[#D7141F] hover:translate-x-1 transition-all duration-200">Karya Nyata Siswa</a>
                <a href="#pedoman" className="hover:text-[#D7141F] hover:translate-x-1 transition-all duration-200">Pedoman Kurikulum</a>
              </div>
            </div>

            {/* Col 3: Resources */}
            <div className="md:col-span-2 space-y-3">
              <h5 className="text-xs font-bold text-[#0B1B3A] uppercase tracking-wider">Sumber Daya</h5>
              <div className="flex flex-col space-y-2 text-xs text-slate-500 font-medium">
                <button onClick={() => navigate('/workspace')} className="text-left hover:text-[#D7141F] hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  Workspace Kelompok
                </button>
                <button onClick={() => navigate('/admin')} className="text-left hover:text-[#D7141F] hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  Panel Guru Pembimbing
                </button>
                <a href="#pedoman" className="hover:text-[#D7141F] hover:translate-x-1 transition-all duration-200">Unduh Dokumen RPP</a>
                <a href="mailto:skomda@smktelkom-sda.sch.id" className="hover:text-[#D7141F] hover:translate-x-1 transition-all duration-200">Pusat Bantuan</a>
              </div>
            </div>

            {/* Col 4: Secretariat Contact */}
            <div className="md:col-span-3 space-y-3">
              <h5 className="text-xs font-bold text-[#0B1B3A] uppercase tracking-wider">Sekretariat</h5>
              <p className="text-xs text-slate-500 leading-relaxed">
                SMK Telkom Sidoarjo<br />
                Jl. Raya Pecantingan, Sekardangan, Sidoarjo, Jawa Timur 61215
              </p>
              <p className="text-xs text-slate-500">
                Email: <span className="text-[#D7141F] font-bold">skomda@smktelkom-sda.sch.id</span>
              </p>
            </div>
          </div>

          {/* Bottom Bar with Back to Top Button */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <span>© 2026 Skomda Mengajar — SMK Telkom Sidoarjo. Seluruh hak cipta dilindungi.</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-[#D7141F] hover:border-[#D7141F] card-smooth hover:-translate-y-1 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span className="text-[11px] font-bold">Kembali ke atas</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════════════════════════
          9. FULLSCREEN LIGHTBOX MODAL
      ══════════════════════════════════════════════════════════════════════════ */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/10] bg-slate-100 relative">
              <img
                src={activeStory.image}
                alt={activeStory.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = createFallbackImage(activeStory.title);
                }}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 flex items-center justify-between border-t border-slate-100">
              <div>
                <span className="bg-[#D7141F] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {activeStory.category}
                </span>
                <h4 className="text-base font-extrabold text-[#0B1B3A] mt-1">{activeStory.title}</h4>
                <p className="text-xs text-slate-500">{activeStory.school} • {activeStory.date}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevLightbox}
                  className="p-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextLightbox}
                  className="p-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
