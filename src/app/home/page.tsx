"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useApp, formatGroupNumber } from '../../context/AppContext';
import { SkomdaJourneyTrack } from '../../components/SkomdaJourneyTrack';
import { Navbar } from '../../components/Navbar';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  UploadCloud,
  FileText,
  Sparkles,
} from 'lucide-react';
import {
  groupsData,
  showcaseProjects,
  documentaryStories,
  ShowcaseProject,
  DocumentaryMoment,
} from '../../data/mockData';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80';

export const PostLoginHomePage: React.FC = () => {
  const { navigate, currentUser, logout, showToast, groups, bannerStatus } = useApp();

  // Route protection
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (currentUser.role === 'admin') {
      navigate('/admin');
    }
  }, [currentUser, navigate]);

  // User Group Resolution
  const userGroupNum = currentUser?.groupNumber ? formatGroupNumber(currentUser.groupNumber) : '03';
  const allGroups = groups && groups.length > 0 ? groups : groupsData;
  const userGroup =
    allGroups.find((g) => formatGroupNumber(g.number) === userGroupNum) ||
    groupsData.find((g) => formatGroupNumber(g.number) === userGroupNum) ||
    groupsData[2];

  const userCurrentStage = userGroup?.currentStep || 4;
  const userProgress = userGroup?.progressPercent || 67;

  // Track & Selection State
  const [selectedStep, setSelectedStep] = useState<number>(userCurrentStage);

  const [isProjectsExpanded, setIsProjectsExpanded] = useState<boolean>(false);
  const [isDocExpanded, setIsDocExpanded] = useState<boolean>(false);

  // Modals State
  const [selectedProject, setSelectedProject] = useState<ShowcaseProject | null>(null);
  const [selectedStory, setSelectedStory] = useState<DocumentaryMoment | null>(null);

  // ─── TIMELINE & CALENDAR STATE & COMPUTATION ───
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'urgent' | 'completed'>('all');
  const [calendarYear, setCalendarYear] = useState<number>(2026);
  const [calendarMonth, setCalendarMonth] = useState<number>(1); // 0 = Jan, 1 = Feb
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number>(15);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  // Synchronized Deliverable Timeline Items (Connected directly to AppContext bannerStatus & stage)
  const timelineItems = useMemo(() => {
    const bannerState =
      bannerStatus === 'approved'
        ? 'Disetujui'
        : bannerStatus === 'pending'
        ? 'Menunggu Review'
        : 'Belum Diunggah';

    return [
      {
        id: 'deliv-1',
        title: 'Desain X-Banner 60×160 cm Siap Cetak',
        stage: 'Tahap 04',
        stageNum: 4,
        date: '15 Feb',
        fullDate: '15 Februari 2026',
        dayNumber: 15,
        month: 1, // Feb
        year: 2026,
        time: '23:59 WIB',
        countdown: bannerState === 'Disetujui' ? 'Selesai' : '4 hari lagi',
        isUrgent: bannerState !== 'Disetujui',
        status: bannerState,
        statusColor:
          bannerState === 'Disetujui'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : bannerState === 'Menunggu Review'
            ? 'bg-amber-50 text-amber-700 border-amber-200'
            : 'bg-rose-50 text-rose-700 border-rose-200',
        category: 'Desain & Publikasi',
      },
      {
        id: 'deliv-2',
        title: 'Desain Feed Instagram & Dokumentasi Tim',
        stage: 'Tahap 04',
        stageNum: 4,
        date: '17 Feb',
        fullDate: '17 Februari 2026',
        dayNumber: 17,
        month: 1,
        year: 2026,
        time: '23:59 WIB',
        countdown: '6 hari lagi',
        isUrgent: true,
        status: 'Belum Diunggah',
        statusColor: 'bg-rose-50 text-rose-700 border-rose-200',
        category: 'Media Sosial',
      },
      {
        id: 'deliv-3',
        title: 'Simulasi Mengajar Lab Komputer Bersama Pembimbing',
        stage: 'Tahap 04',
        stageNum: 4,
        date: '20 Feb',
        fullDate: '20 Februari 2026',
        dayNumber: 20,
        month: 1,
        year: 2026,
        time: '13:30 WIB',
        countdown: '9 hari lagi',
        isUrgent: false,
        status: 'Terjadwal',
        statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
        category: 'Bimbingan Lapangan',
      },
      {
        id: 'deliv-4',
        title: 'Pelaksanaan Hari Pertama Mengajar di SMP Mitra',
        stage: 'Tahap 05',
        stageNum: 5,
        date: '23 Feb',
        fullDate: '23 Februari 2026',
        dayNumber: 23,
        month: 1,
        year: 2026,
        time: '08:00 WIB',
        countdown: '12 hari lagi',
        isUrgent: false,
        status: 'Tahap 05',
        statusColor: 'bg-slate-100 text-slate-700 border-slate-200',
        category: 'Kelas Interaktif',
      },
      {
        id: 'deliv-5',
        title: 'Pengesahan Modul Ajar & Silabus Fase D',
        stage: 'Tahap 03',
        stageNum: 3,
        date: '10 Feb',
        fullDate: '10 Februari 2026',
        dayNumber: 10,
        month: 1,
        year: 2026,
        time: '17:00 WIB',
        countdown: 'Selesai',
        isUrgent: false,
        status: 'Disetujui',
        statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        category: 'Kurikulum Merdeka',
      },
      {
        id: 'deliv-6',
        title: 'Penetapan & Aktivasi Akun Ketua Kelompok',
        stage: 'Tahap 02',
        stageNum: 2,
        date: '05 Feb',
        fullDate: '05 Februari 2026',
        dayNumber: 5,
        month: 1,
        year: 2026,
        time: '12:00 WIB',
        countdown: 'Selesai',
        isUrgent: false,
        status: 'Disetujui',
        statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        category: 'Organisasi Tim',
      },
    ];
  }, [bannerStatus]);

  const filteredTimeline = useMemo(() => {
    if (timelineFilter === 'urgent') {
      return timelineItems.filter((item) => item.isUrgent);
    }
    if (timelineFilter === 'completed') {
      return timelineItems.filter((item) => item.status === 'Disetujui');
    }
    return timelineItems;
  }, [timelineItems, timelineFilter]);

  const selectedDateAgenda = useMemo(() => {
    return timelineItems.find(
      (item) =>
        item.dayNumber === selectedCalendarDate &&
        item.month === calendarMonth &&
        item.year === calendarYear
    );
  }, [timelineItems, selectedCalendarDate, calendarMonth, calendarYear]);

  // Calendar cells matrix generator (Monday first)
  const calendarCells = useMemo(() => {
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const offset = (firstDay + 6) % 7;
    const totalDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const cells: { day: number | null }[] = [];
    for (let i = 0; i < offset; i++) cells.push({ day: null });
    for (let d = 1; d <= totalDays; d++) cells.push({ day: d });
    return cells;
  }, [calendarYear, calendarMonth]);

  const shownProjects = isProjectsExpanded ? showcaseProjects : showcaseProjects.slice(0, 4);
  const shownStories = isDocExpanded ? documentaryStories : documentaryStories.slice(0, 4);

  const getStageTitle = (stage: number) => {
    switch (stage) {
      case 1:
        return 'Fase Aktif: Pembentukan Kelompok Relawan (Tahap 01)';
      case 2:
        return 'Fase Aktif: Pembentukan Ketua Tim (Tahap 02)';
      case 3:
        return 'Fase Aktif: Susun RPP & Modul Ajar (Tahap 03)';
      case 4:
        return 'Fase Aktif: Siapkan Desain & X-Banner (Tahap 04)';
      case 5:
        return 'Fase Aktif: Penerjunan & Mengajar di SMP (Tahap 05)';
      case 6:
        return 'Fase Aktif: Laporan Akhir & Gelar Karya (Tahap 06)';
      default:
        return `Fase Aktif: Tahap 0${stage}`;
    }
  };

  const handleLogout = () => {
    void logout();
  };

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 antialiased selection:bg-[#e20113] selection:text-white">
      {/* ══════════════════════════════════════════════════════════════════════════
          1. FLOATING DARK PILL NAVBAR (UNIFIED SKOMDA CAPSULE)
      ══════════════════════════════════════════════════════════════════════════ */}
      <Navbar variant="home" />

      <main className="w-full">
        {/* ══════════════════════════════════════════════════════════════════════════
            2. HERO SECTION (100% IDENTICAL VISUAL ARCHITECTURE TO `/`)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section id="hero" className="relative w-full bg-white border-b border-slate-100 overflow-hidden">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10 py-12 sm:py-16 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Typography, Actions, 4 Horizontal Metrics */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
                {/* Active Session Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-50/80 border border-red-200/70 rounded-full mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
                  <span className="text-xs font-bold tracking-wider text-[#E50914] uppercase">
                    Sesi Aktif: Kelompok {userGroupNum}
                  </span>
                  <span className="text-red-300">•</span>
                  <span className="text-xs font-medium text-slate-600">
                    {userGroup?.schoolName || 'SMPN 1 Buduran'}
                  </span>
                </div>

                {/* Main Headline (Identical to `/`) */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold text-slate-950 tracking-tight leading-[1.08] mb-4">
                  Inspirasi Nyata, <br />
                  <span className="text-[#e20113]">Siswa SMK Mengajar SMP.</span>
                </h1>

                {/* Subtitle (Identical to `/`) */}
                <p className="text-base sm:text-lg text-slate-500 font-normal leading-relaxed mb-8 max-w-lg">
                  180 siswa relawan SMK Telkom Sidoarjo mengajar teknologi aplikatif dan etika digital di 12 SMP Sidoarjo.
                </p>

                {/* Action Buttons: Primary CTA replaced with "Buka Dashboard Kelompok →" */}
                <div className="flex flex-wrap items-center gap-3.5 mb-10">
                  <button
                    onClick={() => navigate('/dashboard/ketua')}
                    className="inline-flex items-center gap-2.5 px-6 h-12 bg-[#E50914] hover:bg-[#b4000c] text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer group"
                  >
                    <span>Buka Dashboard Kelompok</span>
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
                </div>

                {/* 4 Horizontal Stat Metrics (Exact as `/`) */}
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
              </div>

              {/* Right Column: Editorial Teaching Photo Card (Exact as `/`) */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl shadow-slate-200/60 border border-slate-100 group">
                  <img
                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1000&auto=format&fit=crop&q=80"
                    alt="Aksi Nyata Siswa SMK Telkom Sidoarjo Mengajar di SMP Mitra"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
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
            3. ALUR SECTION (ADAPTATION 2: DYNAMIC SINUSOIDAL JOURNEY TRACK)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section className="w-full bg-[#f8f9fa] py-14 sm:py-16 md:py-20 border-b border-slate-200/80" id="alur">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10">
            <div className="space-y-6">
              <SkomdaJourneyTrack
                currentActiveStep={userCurrentStage}
                selectedStep={selectedStep}
                onSelectStep={(step) => setSelectedStep(step)}
                activePhaseTitle={
                  selectedStep === userCurrentStage
                    ? getStageTitle(userCurrentStage)
                    : `Fase Terpilih: Tahap 0${selectedStep}`
                }
              />

              {/* ─── KARTU TERPADU STATUS KELOMPOK DI TAHAP AKTIF ─── */}
              <div className="mt-8 p-6 sm:p-8 bg-white border border-[#E8ECF2] rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2.5 mb-3">
                      <span className="bg-[#D7141F] text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full">
                        Kelompok {userGroupNum} · {userGroup?.schoolName || 'SMPN 1 Buduran'}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Sesuai Jadwal
                      </span>
                      <span className="text-xs text-slate-400 font-medium">Tenggat: {userGroup?.targetDate || '15 Feb 2026'}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B1B3A] tracking-tight">
                      {selectedStep === 4
                        ? 'Tahap 04: Siapkan Desain Slide & X-Banner 60×160 cm'
                        : selectedStep === 3
                        ? 'Tahap 03: Penyusunan RPP & Modul Ajar Fase D'
                        : selectedStep === 2
                        ? 'Tahap 02: Penetapan Ketua & Pembimbing Lapangan'
                        : selectedStep === 1
                        ? 'Tahap 01: Pembentukan Kelompok Relawan Siswa'
                        : selectedStep === 5
                        ? 'Tahap 05: Penerjunan & Sesi Mengajar di Lab Komputer SMP'
                        : 'Tahap 06: Refleksi, Laporan Akhir & Gelar Karya Artefak'}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                      {selectedStep === 4
                        ? 'Fokus regu Anda saat ini adalah memfinalisasi slide presentasi interaktif dan tata letak banner promosi SMP mitra. 4 dari 6 tugas sprint telah selesai diverifikasi oleh pembimbing.'
                        : 'Pantau target pelaksanaan, pembagian tugas anggota regu, serta koordinasi berkas dengan guru pembimbing lapangan untuk memastikan kelancaran kegiatan.'}
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

                  {/* Progress Circle & Action Button */}
                  <div className="shrink-0 flex sm:flex-row lg:flex-col items-center lg:items-end justify-between gap-5 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 flex items-center justify-center">
                        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
                          <circle cx="24" cy="24" r="20" stroke="#F1F5F9" strokeWidth="4" fill="none" />
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="#D7141F"
                            strokeWidth="4"
                            strokeDasharray="125.6"
                            strokeDashoffset={125.6 - (125.6 * userProgress) / 100}
                            strokeLinecap="round"
                            fill="none"
                          />
                        </svg>
                        <span className="absolute text-xs font-black text-[#0B1B3A]">{userProgress}%</span>
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Progres Sprint</span>
                        <span className="text-xs font-bold text-slate-700">4 dari 6 Tugas Selesai</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/dashboard/ketua')}
                      className="inline-flex items-center justify-center gap-2 px-6 h-12 bg-[#D7141F] hover:bg-[#B80F1A] text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer group"
                    >
                      <span>Buka Lembar Kerja Tahap 0{selectedStep}</span>
                      <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════
            4. DEADLINE CALENDAR & SUBMISSION REMINDER TIMELINE
        ══════════════════════════════════════════════════════════════════════════ */}
        <section className="w-full bg-white py-14 sm:py-16 md:py-20 border-b border-slate-200/80" id="kalender">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10">
            {/* Section Tag & Heading */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#E50914] flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>JADWAL &amp; TENGGAT PENGUMPULAN</span>
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141416] tracking-tight mt-1.5">
                  Timeline Pengingat &amp; Kalender Berkas
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                  Pantau seluruh tenggat wajib pengumpulan desain, modul ajar, dan jadwal asistensi lapangan bersama guru pembimbing.
                </p>
              </div>

              {/* Status pill summary */}
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-red-50 text-[#E50914] text-xs font-bold border border-red-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
                  <span>Tenggat Terdekat: 15 Feb 2026</span>
                </span>
              </div>
            </div>

            {/* Two-Column Bento Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-start">
              {/* ─── LEFT COLUMN (lg:col-span-7): TIMELINE PENGINGAT ─── */}
              <div className="lg:col-span-7 bg-white rounded-[24px] p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  {/* Card Header & Filter Pills */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-extrabold text-[#141416] tracking-tight">
                        Timeline Pengingat Pengumpulan
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Daftar tenggat berkas &amp; jadwal wajib kelompok Anda
                      </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full text-xs font-bold self-start sm:self-auto">
                      <button
                        onClick={() => setTimelineFilter('all')}
                        className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                          timelineFilter === 'all'
                            ? 'bg-white text-[#141416] shadow-2xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Semua
                      </button>
                      <button
                        onClick={() => setTimelineFilter('urgent')}
                        className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                          timelineFilter === 'urgent'
                            ? 'bg-white text-[#141416] shadow-2xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Mendesak
                      </button>
                      <button
                        onClick={() => setTimelineFilter('completed')}
                        className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                          timelineFilter === 'completed'
                            ? 'bg-white text-[#141416] shadow-2xs'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        Selesai
                      </button>
                    </div>
                  </div>

                  {/* Timeline Rows */}
                  <div className="divide-y divide-slate-100 mt-2">
                    {filteredTimeline.map((item) => {
                      const isComplete = item.status === 'Disetujui';
                      return (
                        <div
                          key={item.id}
                          className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 p-2.5 rounded-2xl transition-colors"
                        >
                          {/* Left: Date Badge + Info */}
                          <div className="flex items-start gap-3.5 min-w-0">
                            {/* Date Badge */}
                            <div
                              className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-bold shrink-0 border ${
                                item.isUrgent
                                  ? 'bg-red-50 text-[#E50914] border-red-200'
                                  : isComplete
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              <span className="text-sm font-black leading-none">
                                {item.dayNumber}
                              </span>
                              <span className="text-[10px] font-bold uppercase mt-0.5 leading-none">
                                Feb
                              </span>
                            </div>

                            {/* Details */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                  {item.stage}
                                </span>
                                <span className="text-[11px] text-slate-400">•</span>
                                <span className="text-[11px] font-semibold text-slate-500">
                                  {item.category}
                                </span>
                              </div>

                              <h4 className="text-sm font-bold text-[#141416] mt-1 leading-snug">
                                {item.title}
                              </h4>

                              <div className="flex items-center gap-2 mt-1.5 text-[11px] flex-wrap">
                                <span className="text-slate-400 flex items-center gap-1 font-mono">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  Tenggat: {item.time}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span
                                  className={`font-bold px-2 py-0.2 rounded-full text-[10px] border ${
                                    item.countdown === 'Selesai'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : item.isUrgent
                                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                                      : 'bg-slate-100 text-slate-600 border-slate-200'
                                  }`}
                                >
                                  {item.countdown}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Action: Status Pill + Button */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${item.statusColor}`}
                            >
                              {item.status}
                            </span>

                            <button
                              onClick={() => navigate('/dashboard/ketua')}
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#E50914] hover:text-[#b4000c] hover:underline cursor-pointer"
                            >
                              <span>{isComplete ? 'Lihat di Workspace →' : 'Unggah →'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom sync status note */}
                <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Sinkron otomatis dengan Lembar Kerja Kelompok {userGroupNum}
                  </span>
                  <button
                    onClick={() => navigate('/dashboard/ketua')}
                    className="font-bold text-[#E50914] hover:underline cursor-pointer"
                  >
                    Buka Dashboard →
                  </button>
                </div>
              </div>

              {/* ─── RIGHT COLUMN (lg:col-span-5): KALENDER PENGUMPULAN ─── */}
              <div className="lg:col-span-5 bg-white rounded-[24px] p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  {/* Calendar Header with Month/Year Navigation */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-red-50 text-[#E50914] flex items-center justify-center font-bold">
                        <CalendarIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-[#141416]">
                          {monthNames[calendarMonth]} {calendarYear}
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Jadwal Kurikulum 2026
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={handlePrevMonth}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Bulan Sebelumnya"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNextMonth}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Bulan Berikutnya"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Day Names Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] text-slate-400 mt-4 mb-2 uppercase tracking-wider">
                    <span>Sen</span>
                    <span>Sel</span>
                    <span>Rab</span>
                    <span>Kam</span>
                    <span>Jum</span>
                    <span>Sab</span>
                    <span className="text-[#E50914]">Min</span>
                  </div>

                  {/* Calendar Days Matrix */}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {/* Calendar Day Cells */}
                    {calendarCells.map((cell, idx) => {
                      if (!cell.day) {
                        return <div key={`empty-${idx}`} className="h-9 w-full" />;
                      }

                      const dayNum = cell.day;
                      const isToday =
                        dayNum === 11 && calendarMonth === 1 && calendarYear === 2026;
                      const isSelected = dayNum === selectedCalendarDate;
                      const hasDeadline = timelineItems.some(
                        (item) =>
                          item.dayNumber === dayNum &&
                          item.month === calendarMonth &&
                          item.year === calendarYear
                      );

                      return (
                        <button
                          key={`day-${dayNum}`}
                          onClick={() => setSelectedCalendarDate(dayNum)}
                          className={`relative h-10 w-full rounded-xl flex flex-col items-center justify-center text-xs font-semibold transition-all cursor-pointer ${
                            isToday
                              ? 'bg-[#E50914] text-white font-bold shadow-xs'
                              : isSelected
                              ? 'bg-red-50 text-[#E50914] font-bold ring-2 ring-[#E50914]'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span>{dayNum}</span>

                          {/* Crimson Red Dot Indicator for Deadlines */}
                          {hasDeadline && !isToday && (
                            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#E50914]" />
                          )}
                          {hasDeadline && isToday && (
                            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ─── AGENDA TANGGAL TERPILIH CARD ─── */}
                <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                      Agenda: {selectedCalendarDate} {monthNames[calendarMonth]} {calendarYear}
                    </span>
                    {selectedDateAgenda && (
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.2 rounded-full border ${selectedDateAgenda.statusColor}`}>
                        {selectedDateAgenda.status}
                      </span>
                    )}
                  </div>

                  {selectedDateAgenda ? (
                    <div>
                      <h4 className="text-xs font-bold text-[#141416]">
                        {selectedDateAgenda.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {selectedDateAgenda.stage} • Waktu: {selectedDateAgenda.time} ({selectedDateAgenda.countdown})
                      </p>
                      <button
                        onClick={() => navigate('/dashboard/ketua')}
                        className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141416] hover:bg-[#28292d] text-white text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        <span>Buka Tugas →</span>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-slate-600">
                        Tidak ada tenggat pengumpulan berkas wajib pada tanggal ini.
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Gunakan waktu ini untuk koordinasi internal dan persiapan materi tim.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════
            5. REKAM JEJAK PELAKSANAAN 2025 (UNIFORM SYMMETRIC PHOTO GRID)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section className="w-full bg-[#f8f9fa] py-16 md:py-20 border-b border-slate-200/80" id="jejak">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#e20113]">
                  02 / REKAM JEJAK
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
              <div className="mt-8 flex justify-center">
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
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
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
                <li><button onClick={() => navigate('/dashboard/ketua')} className="hover:text-[#E50914] hover:underline transition-colors cursor-pointer text-left">Dashboard Kelompok</button></li>
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
          9. MODALS (Project Showcase, Story Detail & Roster Modal)
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
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
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
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
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
    </div>
  );
};
