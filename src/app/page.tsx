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
  const { navigate, showToast, currentUser, setCurrentUser } = useApp();
  const isLoggedIn = !!currentUser;

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ontrack' | 'review' | 'overdue'>('all');
  const [karyaFilter, setKaryaFilter] = useState<'all' | 'PELATIHAN' | 'WEBSITE' | 'DESAIN' | 'LITERASI DIGITAL'>('all');
  const [isGroupsExpanded, setIsGroupsExpanded] = useState(false);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(false);

  // Hero Spotlight Autoplay state
  const [activeSpotlight, setActiveSpotlight] = useState(0);
  const [isSpotlightPaused, setIsSpotlightPaused] = useState(false);
  const [spotlightProgress, setSpotlightProgress] = useState(0);

  // Scroll & Nav state
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lightbox Modal state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(0);

  // Download simulation state
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);
  const [downloadedDocs, setDownloadedDocs] = useState<Record<string, boolean>>({});

  // ─── Autoplay Hero School Switcher (6 seconds) ─────────────────────────────
  useEffect(() => {
    if (isSpotlightPaused) return;

    const interval = 60; // ms
    const step = (interval / 6000) * 100;

    const timer = setInterval(() => {
      setSpotlightProgress((prev) => {
        if (prev >= 100) {
          setActiveSpotlight((s) => (s + 1) % heroSchoolSpotlights.length);
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isSpotlightPaused]);

  // Reset progress when manual tab clicked
  const handleSelectSpotlight = (index: number) => {
    setActiveSpotlight(index);
    setSpotlightProgress(0);
  };

  // ─── Scroll Spy & Progress Bar ─────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      setScrollProgress(progress);
      setIsNavScrolled(scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Filtered Data ────────────────────────────────────────────────────────
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

  const filteredProjects = useMemo(() => {
    if (karyaFilter === 'all') return showcaseProjects;
    return showcaseProjects.filter((p) => p.tag === karyaFilter);
  }, [karyaFilter]);

  const shownGroups = isGroupsExpanded ? filteredGroups : filteredGroups.slice(0, 4);
  const shownProjects = isProjectsExpanded ? filteredProjects : filteredProjects.slice(0, 4);

  const spot = heroSchoolSpotlights[activeSpotlight] ?? heroSchoolSpotlights[0];

  // Quick Demo Login Handler
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

  // Download simulation handler
  const handleSimulateDownload = (docId: string, docName: string) => {
    setDownloadingDoc(docId);
    setTimeout(() => {
      setDownloadingDoc(null);
      setDownloadedDocs((prev) => ({ ...prev, [docId]: true }));
      showToast(`Berkas ${docName} berhasil diunduh.`, 'success');
      setTimeout(() => {
        setDownloadedDocs((prev) => ({ ...prev, [docId]: false }));
      }, 2500);
    }, 850);
  };

  // Lightbox navigation
  const handleOpenLightbox = (index: number) => {
    setActiveLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleNextLightbox = () => {
    setActiveLightboxIndex((prev) => (prev + 1) % documentaryStories.length);
  };

  const handlePrevLightbox = () => {
    setActiveLightboxIndex((prev) => (prev - 1 + documentaryStories.length) % documentaryStories.length);
  };

  const activeStory = documentaryStories[activeLightboxIndex] || documentaryStories[0];

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

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={handleQuickDemoLogin}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 h-9 text-xs font-bold text-[#D7141F] bg-red-50 hover:bg-red-100 border border-red-200 rounded-full transition-all cursor-pointer"
                  title="Masuk sebagai Ketua Kelompok 03"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D7141F]" />
                  <span>Demo: Masuk sbg Ketua</span>
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center px-5 h-9 text-xs font-bold uppercase tracking-wider bg-[#D7141F] hover:bg-[#B80F1A] text-white rounded-full transition-all shadow-xs cursor-pointer"
                >
                  Masuk
                </button>
              </>
            ) : (
              <>
                {/* Active Leader Avatar Chip */}
                <div className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-50 border border-slate-200/80 rounded-full text-xs">
                  <div className="w-6 h-6 rounded-full bg-red-100 text-[#D7141F] flex items-center justify-center font-extrabold text-[10px]">
                    NP
                  </div>
                  <span className="font-bold text-[#0B1B3A] hidden sm:inline">Nabila P. R.</span>
                </div>

                {/* Single Primary Workspace Button */}
                <button
                  onClick={() => navigate('/workspace')}
                  className="inline-flex items-center gap-1.5 px-4 h-9 text-xs font-bold text-white bg-[#D7141F] hover:bg-[#B80F1A] rounded-full transition-all shadow-xs cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Workspace</span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 h-9 w-9 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all border border-slate-200 cursor-pointer flex items-center justify-center"
                  title="Keluar Akun"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle Menu"
            >
              <div className="w-4 h-4 flex flex-col justify-around">
                <span className="w-full h-0.5 bg-slate-700 rounded-full"></span>
                <span className="w-full h-0.5 bg-slate-700 rounded-full"></span>
                <span className="w-full h-0.5 bg-slate-700 rounded-full"></span>
              </div>
            </button>
          </div>
        </header>
      </div>

      <main className="w-full">
        {/* ══════════════════════════════════════════════════════════════════════════
            1. HERO SECTION (2 COLUMNS, NO CLUTTER, LIVING STATS WITH AMBIENT GLOW)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section className="relative w-full pt-10 pb-20 overflow-hidden bg-hero-glow" id="hero">
          {/* Subtle architectural background accents */}
          <div className="absolute inset-0 bg-grid-slate opacity-40 pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-100/35 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
          <div className="absolute top-1/3 -right-24 w-80 h-80 bg-sky-100/30 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-[1200px] mx-auto px-5 sm:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
              {/* Left Column: Typography, Single Action, Single Line Stats */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
                {/* Active Session Chip */}
                {isLoggedIn ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50/90 border border-emerald-200 rounded-full mb-6 text-xs font-semibold text-emerald-800 shadow-2xs hover:bg-emerald-100/80 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Sesi aktif • Kelompok 03 • SMPN 1 Buduran</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-50/90 border border-red-200 rounded-full mb-6 text-xs font-semibold text-[#D7141F] shadow-2xs hover:bg-red-100/80 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-[#D7141F] animate-pulse" />
                    <span>Inisiatif Vokasi 2026 • 12 SMP Mitra</span>
                  </div>
                )}

                {/* H1 Headline: Only key phrase is red */}
                {isLoggedIn ? (
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold text-[#0B1B3A] tracking-tight leading-[1.08] mb-4">
                    Fokus Progres Tim, <br />
                    <span className="text-[#D7141F]">Siap Mengajar SMP Mitra.</span>
                  </h1>
                ) : (
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold text-[#0B1B3A] tracking-tight leading-[1.08] mb-4">
                    Inspirasi Nyata, <br />
                    <span className="text-[#D7141F]">Siswa SMK Mengajar SMP.</span>
                  </h1>
                )}

                {/* Subtext: Maximum 2 lines */}
                {isLoggedIn ? (
                  <p className="text-base sm:text-lg text-slate-500 font-normal leading-relaxed mb-8 max-w-lg">
                    Halo, <strong>Nabila</strong>! Kelompokmu ada di <strong>Tahap 04: Desain Slide & X-Banner</strong>. Selesaikan artefak visual sebelum penerjunan.
                  </p>
                ) : (
                  <p className="text-base sm:text-lg text-slate-500 font-normal leading-relaxed mb-8 max-w-lg">
                    180 siswa relawan SMK Telkom Sidoarjo melatih literasi digital, desain grafis, dan web aplikatif untuk adik kelas di 12 SMP Sidoarjo.
                  </p>
                )}

                {/* Actions: Exactly 1 primary CTA + 1 text link */}
                <div className="flex flex-wrap items-center gap-4 mb-10">
                  {isLoggedIn ? (
                    <>
                      <button
                        onClick={() => navigate('/workspace')}
                        className="inline-flex items-center gap-2.5 px-7 h-12 bg-[#D7141F] hover:bg-[#B80F1A] text-white font-bold text-xs uppercase tracking-wider rounded-full btn-primary-glow cursor-pointer group"
                      >
                        <span>Buka Workspace</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <a
                        href="#alur"
                        className="inline-flex items-center gap-1.5 px-4 h-12 text-xs font-bold text-[#0B1B3A] hover:text-[#D7141F] btn-secondary-smooth rounded-full"
                      >
                        <span>Lihat alur</span>
                        <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                      </a>
                    </>
                  ) : (
                    <>
                      <a
                        href="#kelompok"
                        className="inline-flex items-center gap-2.5 px-7 h-12 bg-[#D7141F] hover:bg-[#B80F1A] text-white font-bold text-xs uppercase tracking-wider rounded-full btn-primary-glow cursor-pointer group"
                      >
                        <span>Cari Kelompok Saya</span>
                        <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                      </a>
                      <button
                        onClick={() => navigate('/login')}
                        className="inline-flex items-center gap-2 px-5 h-12 text-xs font-bold text-[#0B1B3A] hover:text-[#D7141F] btn-secondary-smooth rounded-full cursor-pointer"
                      >
                        <span>Masuk ke Akun</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </>
                  )}
                </div>

                {/* Single Line Stats Strip with Hairline Dividers & Progress Ring */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 border-t border-slate-200/90 w-full max-w-xl">
                  {isLoggedIn ? (
                    <>
                      {/* Stat 1: 67% Progress with SVG circular ring */}
                      <div className="flex items-center gap-3 card-smooth p-2 rounded-xl hover:bg-white/80">
                        <div className="relative w-10 h-10 shrink-0">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                            <circle
                              cx="18"
                              cy="18"
                              r="14"
                              fill="none"
                              stroke="#D7141F"
                              strokeWidth="3"
                              strokeDasharray="88"
                              strokeDashoffset={88 - (88 * 67) / 100}
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="text-xl sm:text-2xl font-extrabold text-[#D7141F] tracking-tight block leading-tight">
                            67%
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500 block">Progres</span>
                        </div>
                      </div>

                      {/* Stat 2: Tahap 04 */}
                      <div className="border-l border-slate-200/80 pl-4 sm:pl-6 card-smooth p-2 rounded-xl hover:bg-white/80">
                        <span className="text-xl sm:text-2xl font-extrabold text-[#0B1B3A] tracking-tight block leading-tight">
                          Tahap 04
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
                        onClick={() => {
                          if (isLoggedIn) navigate('/workspace');
                          else navigate('/login');
                        }}
                        className="text-[#D7141F] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer group/link"
                      >
                        <span>{isLoggedIn ? 'Buka Workspace' : 'Lihat Regu'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Meta Indicator Below Photo */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-medium px-2">
                  <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Fase D Kurikulum Merdeka
                  </span>
                  <span>Disahkan MGMP Informatika</span>
                </div>
              </div>
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
