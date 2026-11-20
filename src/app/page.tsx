"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SkomdaJourneyTrack } from '../components/SkomdaJourneyTrack';
import { Navbar } from '../components/Navbar';
import {
  groupsData,
  Group,
  generateMockMembers,
  showcaseProjects,
  documentaryStories,
  ShowcaseProject,
  DocumentaryMoment,
} from '../data/mockData';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80';

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
  const { navigate, showToast, currentUser, logout, groups } = useApp();
  const isLoggedIn = !!currentUser;

  // Auto-redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    }
  }, [currentUser, navigate]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'sidoarjo-candi' | 'buduran-sedati' | 'waru-taman' | 'has-leader' | 'pending-leader'>('all');
  const [isGroupsExpanded, setIsGroupsExpanded] = useState(false);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(false);
  const [isDocExpanded, setIsDocExpanded] = useState(false);
  const [selectedStep, setSelectedStep] = useState(4);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ShowcaseProject | null>(null);
  const [selectedStory, setSelectedStory] = useState<DocumentaryMoment | null>(null);
  const [selectedRosterGroup, setSelectedRosterGroup] = useState<Group | null>(null);

  const activeGroupList = (groups && groups.length > 0 ? groups : groupsData).filter((g) => g.number !== '00');

  const filteredGroups = useMemo(() => {
    return activeGroupList.filter((g) => {
      const q = searchQuery.toLowerCase().trim();
      const num = parseInt(g.number, 10);
      const isPending = !g.hasLeader || num === 23 || num === 24 || g.leaderName.includes('Belum');
      const districtLower = g.district.toLowerCase();

      const hit =
        !q ||
        g.schoolName.toLowerCase().includes(q) ||
        g.leaderName.toLowerCase().includes(q) ||
        g.mentorName.toLowerCase().includes(q) ||
        g.district.toLowerCase().includes(q) ||
        g.number.includes(q);
      if (!hit) return false;

      if (selectedFilter === 'sidoarjo-candi') return districtLower.includes('sidoarjo') || districtLower.includes('candi');
      if (selectedFilter === 'buduran-sedati') return districtLower.includes('buduran') || districtLower.includes('sedati');
      if (selectedFilter === 'waru-taman') return districtLower.includes('waru') || districtLower.includes('taman');
      if (selectedFilter === 'has-leader') return !isPending;
      if (selectedFilter === 'pending-leader') return isPending;
      return true;
    });
  }, [searchQuery, selectedFilter]);

  const shownGroups = filteredGroups.slice(0, 4);
  const shownProjects = isProjectsExpanded ? showcaseProjects : showcaseProjects.slice(0, 4);
  const shownStories = isDocExpanded ? documentaryStories : documentaryStories.slice(0, 4);

  const activeStepData = STEPS.find((s) => s.num === selectedStep) || STEPS[3];

  const handleLogout = () => {
    void logout();
  };

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 antialiased selection:bg-[#e20113] selection:text-white">
      {/* ══════════════════════════════════════════════════════════════════════════
          1. FLOATING DARK PILL NAVBAR (UNIFIED SKOMDA CAPSULE)
      ══════════════════════════════════════════════════════════════════════════ */}
      <Navbar variant="public" />

      <main className="w-full">
        {/* ══════════════════════════════════════════════════════════════════════════
            2. HERO SECTION (ADAPTIVE: SEBELUM LOGIN VS SETELAH LOGIN)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section id="hero" className="relative w-full bg-white border-b border-slate-100 overflow-hidden">
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
                        <span>Login Ketua / Admin</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => navigate('/home')}
                        className="inline-flex items-center gap-2.5 px-6 h-12 bg-[#e20113] hover:bg-[#b4000c] text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer group"
                      >
                        <span>Buka Dashboard Ketua</span>
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
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#e20113] tracking-tight block">67%</span>
                      <span className="text-xs font-semibold text-slate-500 mt-0.5 block">Progres Tim</span>
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

              {/* Right Column: Inspiring Showcase Photo (SMK Telkom Sidoarjo Teaching Activities) */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl shadow-slate-200/60 border border-slate-100 group">
                  <img
                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1000&auto=format&fit=crop&q=80"
                    alt="Aksi Nyata Siswa SMK Telkom Sidoarjo Mengajar di SMP Mitra"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                  />

                  {/* Soft Gradient Scrim at Bottom Only */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-6 text-white flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-[#e20113] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                        Aksi Nyata Relawan
                      </span>
                      <span className="text-xs text-slate-200 font-semibold">180 Siswa • 12 SMP Sidoarjo</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                      Siswa SMK Telkom Sidoarjo Berbagi Ilmu & Literasi Digital di Sekolah Mitra
                    </h3>

                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
                      Program pengabdian masyarakat terstruktur: mengajarkan dasar pemrograman, etika digital, dan media kreatif interaktif.
                    </p>
                  </div>
                </div>

                {/* Subtle Meta Indicator below photo */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-medium px-1">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-500 text-[15px]">verified</span>
                    Fase D Kurikulum Merdeka Informatika
                  </span>
                  <span>Disahkan MGMP Sidoarjo</span>
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
                <SkomdaJourneyTrack
                  currentActiveStep={2}
                  activePhaseTitle="Fase Aktif: Pembentukan Ketua Tim"
                />

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
                <SkomdaJourneyTrack
                  currentActiveStep={4}
                  selectedStep={selectedStep}
                  onSelectStep={(step) => setSelectedStep(step)}
                  activePhaseTitle={selectedStep === 2 ? 'Fase Aktif: Pembentukan Ketua Tim' : `Fase Terpilih: Tahap 0${selectedStep}`}
                />

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

                  <div className="flex bg-slate-100 rounded-xl p-0.5 gap-0.5 border border-slate-200/80 overflow-x-auto">
                    {([
                      ['all', 'Semua'],
                      ['sidoarjo-candi', 'Sidoarjo & Candi'],
                      ['buduran-sedati', 'Buduran & Sedati'],
                      ['waru-taman', 'Waru & Taman'],
                      ['has-leader', 'Ketua Terpilih'],
                      ['pending-leader', 'Belum Ada Ketua'],
                    ] as const).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedFilter(key as any)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                          selectedFilter === key
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
                <span className="text-[11px] text-slate-400">Sinkronisasi data sekolah & kelompok resmi</span>
              </div>

              {/* 4 Cards Grid - Public Safe: Zero Workspace Leaks */}
              {shownGroups.length === 0 ? (
                <div className="py-16 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="material-symbols-outlined text-4xl block mb-2 text-slate-300">search_off</span>
                  <p className="text-sm font-bold text-slate-700">Tidak ada kelompok yang cocok</p>
                  <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci atau filter wilayah.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {shownGroups.map((group) => {
                    const num = parseInt(group.number, 10);
                    const isPending = num === 23 || num === 24 || group.leaderName.includes('Belum');

                    return (
                      <div
                        key={group.id}
                        className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 overflow-hidden flex flex-col justify-between transition-all hover:shadow-md"
                      >
                        {/* Top Accent Strip */}
                        <div className={`h-1.5 w-full ${isPending ? 'bg-amber-400' : 'bg-emerald-500'}`} />

                        <div className="p-4 flex flex-col gap-3 flex-1">
                          {/* Header: Number & Status Ketua */}
                          <div className="flex items-center justify-between">
                            <span className="bg-[#e20113] text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                              Kel. {group.number}
                            </span>
                            {isPending ? (
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200/70">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                Belum Ditentukan
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200/70">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Ketua Terpilih
                              </span>
                            )}
                          </div>

                          {/* School Info */}
                          <div>
                            <h3 className="font-bold text-slate-900 leading-snug">{group.schoolName}</h3>
                            <span className="text-[11px] font-semibold text-slate-400 block mt-0.5">
                              Kec. {group.district}
                            </span>
                          </div>

                          {/* Public Safe Details - Zero Internal Workspace Leaks */}
                          <div className="flex flex-col gap-1.5 text-xs text-slate-600 mt-auto pt-3 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-[11px]">Ketua:</span>
                              <span className="font-bold text-slate-800 truncate max-w-[130px]">
                                {isPending ? 'Belum Ditentukan' : group.leaderName}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-[11px]">Pembimbing:</span>
                              <span className="font-semibold text-slate-700 truncate max-w-[130px]">
                                {group.mentorName.split(',')[0]}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-[11px]">Jadwal:</span>
                              <span className="text-slate-700 font-medium">{group.targetDate}</span>
                            </div>
                          </div>
                        </div>

                        {/* Footer Action: View Team Roster Modal */}
                        <div className="border-t border-slate-100 px-4 py-2.5 bg-slate-50/60">
                          <button
                            onClick={() => setSelectedRosterGroup(group)}
                            className="w-full py-2 px-3 bg-white hover:bg-red-50 text-slate-700 hover:text-[#e20113] border border-slate-200 hover:border-red-200 rounded-xl text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <span className="material-symbols-outlined text-[16px]">group</span>
                            <span>Lihat Anggota Tim</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Navigate to Dedicated All-Groups Page */}
              <div className="mt-8 flex flex-col items-center gap-2.5">
                <button
                  onClick={() => navigate('/kelompok')}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#141416] hover:bg-[#e20113] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer group"
                >
                  <span>Lihat Semua 24 Kelompok di Halaman Khusus</span>
                  <span className="material-symbols-outlined text-[17px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
                <span className="text-[11px] text-slate-400 font-medium">
                  Menampilkan 4 dari 24 kelompok resmi. Buka direktori lengkap untuk pencarian seluruh sekolah dan daftar anggota tim.
                </span>
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════════════
            5. REKAM JEJAK PELAKSANAAN 2025 (UNIFORM GRID)
        ══════════════════════════════════════════════════════════════════════════ */}
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

            {/* Uniform Symmetric Photo Grid (grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6) */}
            <div className="pt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {shownStories.map((story) => (
                  <div
                    key={story.id}
                    onClick={() => setSelectedStory(story)}
                    className="bg-white rounded-2xl overflow-hidden cursor-pointer group border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      <img
                        src={story.image}
                        alt={story.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="bg-[#e20113] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md shadow-xs">
                          {story.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-white/95 text-slate-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                          Baca
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1.5">
                          <span>{story.school}</span>
                          <span>{story.date}</span>
                        </div>
                        <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#e20113] transition-colors leading-snug line-clamp-2">
                          {story.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                          {story.caption}
                        </p>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] font-semibold text-slate-400">Dokumentasi 2025</span>
                        <span className="font-bold text-[#e20113] group-hover:underline">Baca Selengkapnya →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
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
      </main>

      {/* ══════════════════════════════════════════════════════════════════════════
          6. FOOTER (EDITORIAL LIGHT THEME WITH SMOOTH SCROLL BACK TO TOP)
      ══════════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-white text-slate-600 border-t border-slate-200/80 pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-200/80">
            {/* Col 1: Identity */}
            <div className="md:col-span-5 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E50914] text-white flex items-center justify-center font-black text-xs shadow-xs">
                  SM
                </div>
                <div>
                  <span className="text-sm font-black text-[#141416] tracking-tight block">SKOMDA MENGAJAR 2026</span>
                  <span className="text-[11px] text-slate-400 font-medium">SMK Telkom Sidoarjo</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Inisiatif vokasi dan pengabdian masyarakat untuk mendampingi literasi digital, komputasi kreatif, dan teknologi tepat guna di 12 SMP Kabupaten Sidoarjo.
              </p>
              <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>MGMP Informatika &amp; Kurikulum Terakreditasi</span>
              </div>
            </div>

            {/* Col 2: Navigasi */}
            <div className="md:col-span-2 space-y-3 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#141416] block">Akses Cepat</span>
              <ul className="space-y-2.5 text-slate-500">
                <li><a href="#alur" className="hover:text-[#E50914] hover:underline transition-colors">Alur Pelaksanaan</a></li>
                <li><a href="#jejak" className="hover:text-[#E50914] hover:underline transition-colors">Rekam Jejak 2025</a></li>
                <li><button onClick={() => navigate('/kelompok')} className="hover:text-[#E50914] hover:underline transition-colors cursor-pointer text-left">Direktori Kelompok</button></li>
                <li><button onClick={() => navigate(isLoggedIn ? '/workspace' : '/login')} className="hover:text-[#E50914] hover:underline transition-colors cursor-pointer text-left">Workspace Tim</button></li>
              </ul>
            </div>

            {/* Col 3: Berkas */}
            <div className="md:col-span-2 space-y-3 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#141416] block">Dokumen</span>
              <ul className="space-y-2.5 text-slate-500">
                <li><button onClick={() => showToast('Membuka Buku Panduan Skomda 2026...', 'info')} className="hover:text-[#E50914] hover:underline transition-colors cursor-pointer text-left">Buku Panduan 2026</button></li>
                <li><button onClick={() => showToast('Membuka Format RPP Fase D...', 'info')} className="hover:text-[#E50914] hover:underline transition-colors cursor-pointer text-left">Format RPP Fase D</button></li>
                <li><button onClick={() => showToast('Membuka Rubrik Penilaian...', 'info')} className="hover:text-[#E50914] hover:underline transition-colors cursor-pointer text-left">Rubrik Penilaian</button></li>
                <li><button onClick={() => navigate('/login?role=admin')} className="hover:text-[#E50914] hover:underline transition-colors cursor-pointer text-left">Portal Guru &amp; Admin</button></li>
              </ul>
            </div>

            {/* Col 4: Kontak & Lokasi */}
            <div className="md:col-span-3 space-y-3 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#141416] block">Sekretariat</span>
              <p className="text-slate-500 text-xs leading-relaxed">
                Jl. Raya Pecantingan, Sekardangan, Sidoarjo, Jawa Timur 61215
              </p>
              <p className="text-slate-500 text-xs">
                Email: <a href="mailto:skomda@smktelkom-sda.sch.id" className="text-[#E50914] font-semibold hover:underline">skomda@smktelkom-sda.sch.id</a>
              </p>
              <p className="text-[11px] text-slate-400">
                Telepon: (031) 8941234 • Helpdesk IT MGMP
              </p>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© 2026 SMK Telkom Sidoarjo. Hak Cipta Dilindungi Undang-Undang.</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-1.5 text-slate-700 hover:text-[#E50914] font-semibold transition-colors cursor-pointer"
              >
                <span>Kembali ke Atas ↑</span>
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
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
                  className="w-full h-full object-cover"
                />
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
                <img
                  src={selectedStory.image}
                  alt={selectedStory.title}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
                  className="w-full h-full object-cover"
                />
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

      {/* ══════════════════════════════════════════════════════════════════════════
          MODAL: DAFTAR ANGGOTA TIM SISWA (READ-ONLY PUBLIC ROSTER)
      ══════════════════════════════════════════════════════════════════════════ */}
      {selectedRosterGroup && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/60">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#e20113] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Kelompok {selectedRosterGroup.number}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Kec. {selectedRosterGroup.district}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {selectedRosterGroup.schoolName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Guru Pembimbing: <strong className="text-slate-700">{selectedRosterGroup.mentorName}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedRosterGroup(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors border border-slate-200 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Body: Student Roster List */}
            <div className="p-6 overflow-y-auto space-y-2.5 flex-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider pb-1 border-b border-slate-100">
                <span>Daftar Siswa Relawan SMK</span>
                <span>Peran Tim</span>
              </div>

              {generateMockMembers(
                selectedRosterGroup.number,
                selectedRosterGroup.leaderName,
                !selectedRosterGroup.leaderName.includes('Belum') && parseInt(selectedRosterGroup.number, 10) < 23
              ).map((member, idx) => (
                <div
                  key={member.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                    member.isLeader
                      ? 'bg-red-50/50 border-red-200/80'
                      : 'bg-white border-slate-200/70'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        member.isLeader
                          ? 'bg-[#e20113] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="truncate min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {member.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        NIS: {member.nis}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${
                      member.isLeader
                        ? 'bg-[#e20113] text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {member.role}
                  </span>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">
                Data resmi MGMP & Skomda Mengajar 2026
              </span>
              <button
                onClick={() => setSelectedRosterGroup(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
