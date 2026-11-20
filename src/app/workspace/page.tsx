"use client";

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  LogOut,
  Upload,
  Users,
  X,
  AlertCircle,
  Lock,
  MessageSquare,
  ArrowRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface StageCardData {
  number: number;
  code: string;
  title: string;
  fullName: string;
  progress: number;
  metric: string;
  status: 'completed' | 'active' | 'locked';
  locked: boolean;
  deliverables: string[];
}

export const WorkspacePage: React.FC = () => {
  const {
    navigate,
    currentUser,
    activeGroup,
    members,
    toggleMemberStatus,
    bannerStatus,
    bannerFeedback,
    submitGroupFile,
    supervisorMemo,
    showToast,
    logout,
    getGroupRoster,
  } = useApp();

  const currentGroup = activeGroup;
  const activeStageNumber = currentGroup.currentStep || 4;
  const groupNumberStr = currentGroup.number || '03';

  // 8 Members of this group roster
  const groupMembers = useMemo(() => {
    return getGroupRoster(groupNumberStr);
  }, [getGroupRoster, groupNumberStr]);

  // State: Filter tabs for stages
  const [stageTabFilter, setStageTabFilter] = useState<'all' | 'active' | 'completed' | 'locked'>('all');

  // State: Timeline filters
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'urgent' | 'completed'>('all');

  // State: Calendar
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number>(15);

  // State: Modals & Drawers
  const [selectedStageDrawer, setSelectedStageDrawer] = useState<StageCardData | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAdvisorDrawer, setShowAdvisorDrawer] = useState(false);
  const [showMembersDrawer, setShowMembersDrawer] = useState(false);

  // Upload modal inputs
  const [uploadDeliverableName, setUploadDeliverableName] = useState('Desain X-Banner 60×160 cm & Poster A3');
  const [uploadFileUrl, setUploadFileUrl] = useState('');
  const [uploadNotes, setUploadNotes] = useState('');
  const [isSubmittingFile, setIsSubmittingFile] = useState(false);

  // Stages Definition
  const stages: StageCardData[] = useMemo(() => [
    {
      number: 1,
      code: `KEL-${groupNumberStr} • TAHAP 01`,
      title: 'Bentuk Tim Relawan',
      fullName: 'Tahap 01: Pembentukan Tim & Pemetaan Roster',
      progress: 100,
      metric: '8/8 Anggota Lengkap',
      status: 'completed',
      locked: false,
      deliverables: ['Struktur Organisasi Tim', 'Daftar Kontak & Roster Siswa', 'Kesepakatan Jadwal Koordinasi'],
    },
    {
      number: 2,
      code: `KEL-${groupNumberStr} • TAHAP 02`,
      title: 'Pilih & Tetapkan Ketua',
      fullName: 'Tahap 02: Penetapan & Verifikasi Ketua Regu',
      progress: 100,
      metric: 'Akun Terverifikasi',
      status: 'completed',
      locked: false,
      deliverables: ['Berita Acara Pemilihan Ketua', 'Aktivasi Kredensial Tunggal', 'Sinkronisasi Surat Mandat'],
    },
    {
      number: 3,
      code: `KEL-${groupNumberStr} • TAHAP 03`,
      title: 'Susun Modul & Materi',
      fullName: 'Tahap 03: Penyusunan Modul Praktikum Lab',
      progress: 100,
      metric: 'Disetujui Kurikulum',
      status: 'completed',
      locked: false,
      deliverables: ['Silabus Praktikum 6 JP', 'Modul Canva & Literasi AI', 'Lembar Kerja Siswa SMP'],
    },
    {
      number: 4,
      code: `KEL-${groupNumberStr} • TAHAP 04`,
      title: 'Siapkan Desain & Banner',
      fullName: 'Tahap 04: Finalisasi Slide & Cetak X-Banner',
      progress: bannerStatus === 'approved' ? 100 : 67,
      metric: bannerStatus === 'approved' ? 'Disetujui' : bannerStatus === 'pending' ? 'Review Kurikulum' : '4/6 Tugas Selesai',
      status: 'active',
      locked: false,
      deliverables: [
        'Desain X-Banner 60×160 cm Resmi',
        'Slide Presentasi Interaktif Canva',
        'Layout Feed Instagram Publikasi',
        'Simulasi Uji Presentasi Tim',
      ],
    },
    {
      number: 5,
      code: `KEL-${groupNumberStr} • TAHAP 05`,
      title: 'Mengajar di SMP Mitra',
      fullName: 'Tahap 05: Pelaksanaan Praktikum Lapangan SMP',
      progress: 0,
      metric: 'Tenggat 22 Feb',
      status: 'locked',
      locked: true,
      deliverables: ['Presensi Kehadiran Siswa SMP', 'Foto & Video Dokumentasi Praktikum', 'Berita Acara Tatap Muka'],
    },
    {
      number: 6,
      code: `KEL-${groupNumberStr} • TAHAP 06`,
      title: 'Laporan Akhir & Evaluasi',
      fullName: 'Tahap 06: Penilaian Akhir & Laporan Pertanggungjawaban',
      progress: 0,
      metric: 'Tenggat 28 Feb',
      status: 'locked',
      locked: true,
      deliverables: ['Laporan Akhir Pelaksanaan', 'Kumpulan Karya Digital Siswa', 'Penilaian Mandiri Tim'],
    },
  ], [groupNumberStr, bannerStatus]);

  // Filtered Stages
  const filteredStages = useMemo(() => {
    if (stageTabFilter === 'active') return stages.filter((s) => s.status === 'active');
    if (stageTabFilter === 'completed') return stages.filter((s) => s.status === 'completed');
    if (stageTabFilter === 'locked') return stages.filter((s) => s.status === 'locked');
    return stages;
  }, [stages, stageTabFilter]);

  // Timeline Deliverables synced with context
  const timelineDeliverables = useMemo(() => {
    return [
      {
        id: 'deliv-1',
        title: 'Desain X-Banner 60×160 cm & Poster Promosi',
        stage: 'Tahap 04',
        deadlineDate: '15 Feb 2026',
        dayNumber: 15,
        countdown: '4 hari lagi',
        isUrgent: true,
        status:
          bannerStatus === 'approved'
            ? 'Disetujui'
            : bannerStatus === 'pending'
            ? 'Menunggu Review'
            : 'Perlu Pengunggahan',
        statusCode: bannerStatus,
      },
      {
        id: 'deliv-2',
        title: 'Slide Presentasi Interaktif Canva & Modul Lab Siswa',
        stage: 'Tahap 04',
        deadlineDate: '18 Feb 2026',
        dayNumber: 18,
        countdown: '7 hari lagi',
        isUrgent: false,
        status: 'Sedang Disusun',
        statusCode: 'in_progress',
      },
      {
        id: 'deliv-3',
        title: 'Simulasi Tatap Muka Praktikum dengan Guru Pembimbing',
        stage: 'Tahap 05',
        deadlineDate: '20 Feb 2026',
        dayNumber: 20,
        countdown: '9 hari lagi',
        isUrgent: false,
        status: 'Terjadwal',
        statusCode: 'scheduled',
      },
      {
        id: 'deliv-4',
        title: 'Pelaksanaan Mengajar di Lab Komputer SMP Mitra',
        stage: 'Tahap 05',
        deadlineDate: '22 Feb 2026',
        dayNumber: 22,
        countdown: '11 hari lagi',
        isUrgent: false,
        status: 'Terkunci',
        statusCode: 'locked',
      },
    ];
  }, [bannerStatus]);

  const filteredTimeline = useMemo(() => {
    if (timelineFilter === 'urgent') return timelineDeliverables.filter((d) => d.isUrgent);
    if (timelineFilter === 'completed') return timelineDeliverables.filter((d) => d.status === 'Disetujui');
    return timelineDeliverables;
  }, [timelineDeliverables, timelineFilter]);

  // Deadline days set for calendar dots
  const deadlineDays = [15, 18, 20, 22, 25, 28];

  // Calendar dates matrix for February 2026
  // Feb 1, 2026 was a Sunday
  const calendarDays = useMemo(() => {
    const days: { date: number; isCurrentMonth: boolean; hasDeadline: boolean }[] = [];
    // Pad previous month days (Mon start: 6 padding days from previous Jan)
    for (let p = 26; p <= 31; p++) {
      days.push({ date: p, isCurrentMonth: false, hasDeadline: false });
    }
    // Feb days 1 - 28
    for (let d = 1; d <= 28; d++) {
      days.push({
        date: d,
        isCurrentMonth: true,
        hasDeadline: deadlineDays.includes(d),
      });
    }
    // Next month pad
    for (let n = 1; n <= 8; n++) {
      days.push({ date: n, isCurrentMonth: false, hasDeadline: false });
    }
    return days;
  }, []);

  // Selected date details
  const selectedDateEvents = useMemo(() => {
    return timelineDeliverables.filter((t) => t.dayNumber === selectedCalendarDate);
  }, [selectedCalendarDate, timelineDeliverables]);

  // Handle submit file
  const handleSubmitFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileUrl.trim()) {
      showToast('Masukkan URL tautan berkas (Google Drive/Canva/Figma)', 'warning');
      return;
    }
    setIsSubmittingFile(true);
    setTimeout(() => {
      submitGroupFile(groupNumberStr, uploadFileUrl.trim(), uploadNotes.trim() || undefined);
      setIsSubmittingFile(false);
      setShowUploadModal(false);
      setUploadFileUrl('');
      setUploadNotes('');
      showToast('Berkas berhasil diserahkan ke Pembimbing!', 'success');
    }, 600);
  };

  const handleLogoutSession = async () => {
    await logout('/login');
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] text-[#141416] font-sans antialiased selection:bg-[#E50914]/10 selection:text-[#E50914] flex flex-col">
      {/* ══════════════════════════════════════════════════════════════════════════
          1. CLEAN TOP NAVIGATION BAR (MINIMALIST LMS STYLE)
      ══════════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Brand Badge & Main Tabs */}
          <div className="flex items-center gap-6 sm:gap-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E50914] text-white flex items-center justify-center font-black text-xs shadow-xs">
                SM
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-[#141416]">#SKOMDA</span>
                <span className="bg-[#E50914]/10 text-[#E50914] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#E50914]/20">
                  2026
                </span>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => navigate('/dashboard/ketua')}
                className="relative px-3.5 py-1.5 text-xs font-bold text-[#141416] transition-colors cursor-pointer"
              >
                <span>Dashboard</span>
                <span className="absolute bottom-0 left-3.5 right-3.5 h-[2.5px] bg-[#E50914] rounded-full" />
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-500 hover:text-[#141416] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <span>Beranda Utama</span>
              </button>
              <button
                onClick={() => navigate('/kelompok')}
                className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-medium text-slate-500 hover:text-[#141416] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <span>Direktori Tim</span>
              </button>
            </nav>
          </div>

          {/* Right: Group Badge, Profile & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Notification Bell */}
            <button
              onClick={() => setShowAdvisorDrawer(true)}
              title="Arahan & Notifikasi Pembimbing"
              className="relative p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E50914] ring-2 ring-white" />
            </button>

            {/* Group Badge Pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-extrabold text-[#141416] text-[11px]">
                KEL-{groupNumberStr} • {currentGroup.schoolName}
              </span>
            </div>

            {/* Leader Avatar & Profile Info */}
            <div className="flex items-center gap-2.5 pl-2 sm:border-l sm:border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#141416] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'NP'}
              </div>
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-bold text-[#141416] leading-tight max-w-[130px] truncate">
                  {currentUser?.name || currentGroup.leaderName}
                </span>
                <span className="block text-[10px] text-slate-400 font-medium">Ketua Kelompok</span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogoutSession}
              title="Keluar dari akun ketua"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-[#E50914] hover:bg-rose-50 transition-colors cursor-pointer ml-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. SPACIOUS 2-COLUMN ASYMMETRIC MAIN CONTENT CANVAS
      ══════════════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ────────────────────────────────────────────────────────────────────
              LEFT COLUMN (lg:col-span-8): TIMELINE, ADVISOR NOTE, 6-STAGE GRID
          ──────────────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-8">

            {/* ─── A. TIMELINE SECTION (SUBMISSION REMINDERS) ─── */}
            <section className="space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#141416] tracking-tight">Timeline</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Daftar tenggat pengumpulan berkas wajib kelompok Anda</p>
                </div>

                {/* Filter Selector */}
                <div className="flex items-center gap-2">
                  <div className="flex bg-slate-200/70 p-0.5 rounded-xl text-xs">
                    {(['all', 'urgent', 'completed'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setTimelineFilter(tab)}
                        className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          timelineFilter === tab ? 'bg-white text-[#141416] shadow-2xs' : 'text-slate-600 hover:text-[#141416]'
                        }`}
                      >
                        {tab === 'all' ? 'Semua' : tab === 'urgent' ? 'Mendesak' : 'Selesai'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timeline Container Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs divide-y divide-slate-100">
                {filteredTimeline.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    Tidak ada tenggat yang sesuai dengan filter.
                  </div>
                ) : (
                  filteredTimeline.map((item) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Date Badge & Title */}
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">FEB</span>
                          <span className="text-base font-black text-[#141416] leading-none mt-0.5">{item.dayNumber}</span>
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-bold text-[#E50914] bg-rose-50 px-2 py-0.5 rounded-md">
                              {item.stage}
                            </span>
                            {item.isUrgent && (
                              <span className="text-[10px] font-extrabold uppercase text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                                {item.countdown}
                              </span>
                            )}
                            <span className="text-xs text-slate-400 font-medium">Tenggat: {item.deadlineDate}</span>
                          </div>
                          <h4 className="text-sm font-bold text-[#141416] mt-1 leading-snug">{item.title}</h4>
                        </div>
                      </div>

                      {/* Right: Status Pill & Action */}
                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                            item.statusCode === 'approved'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : item.statusCode === 'pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          {item.status}
                        </span>

                        <button
                          onClick={() => {
                            setUploadDeliverableName(item.title);
                            setShowUploadModal(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#141416] hover:bg-[#E50914] text-white transition-colors cursor-pointer shadow-2xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Unggah Berkas</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* ─── B. ARAHAN & PENGUMUMAN PEMBIMBING ─── */}
            <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs relative overflow-hidden">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#E50914]/10 text-[#E50914] flex items-center justify-center shrink-0 font-black text-sm">
                    GP
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#141416]">
                        {currentGroup.mentorName}
                      </h3>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        Guru Pembimbing
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-2xl">
                      "{supervisorMemo || 'Pastikan file X-Banner 60×160 cm sudah disesuaikan dengan template resmi sekolah mitra dan modul Scratch dipersiapkan untuk 40 siswa lab.'}"
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAdvisorDrawer(true)}
                  className="shrink-0 text-xs font-bold text-[#E50914] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Riwayat Feedback</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </section>

            {/* ─── C. PROGRES & TAHAPAN KELOMPOK (3-COLUMN BENTO GRID) ─── */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#141416] tracking-tight">Progres &amp; Tahapan Kelompok</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Alur penyelesaian 6 tahap resmi Skomda Mengajar 2026</p>
                </div>

                {/* Underline Tabs */}
                <div className="flex items-center gap-4 text-xs font-bold border-b border-slate-200 pb-1">
                  {(['all', 'active', 'completed', 'locked'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setStageTabFilter(tab)}
                      className={`pb-1 transition-all cursor-pointer ${
                        stageTabFilter === tab
                          ? 'text-[#E50914] border-b-2 border-[#E50914]'
                          : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      {tab === 'all'
                        ? 'Semua Tahap'
                        : tab === 'active'
                        ? 'Sedang Berjalan'
                        : tab === 'completed'
                        ? 'Selesai'
                        : 'Terkunci'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3-Column Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {filteredStages.map((stg) => {
                  const isActive = stg.status === 'active';
                  const isDone = stg.status === 'completed';
                  const isLocked = stg.status === 'locked';

                  return (
                    <div
                      key={stg.number}
                      onClick={() => !isLocked && setSelectedStageDrawer(stg)}
                      className={`group relative bg-white rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-200 ${
                        isLocked
                          ? 'border-slate-200/60 opacity-70 cursor-not-allowed'
                          : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md cursor-pointer hover:-translate-y-0.5'
                      }`}
                    >
                      {/* Geometric SVG Header Pattern */}
                      <div
                        className={`h-24 w-full relative overflow-hidden flex items-end p-4 ${
                          isActive
                            ? 'bg-gradient-to-br from-[#E50914] to-[#99050D] text-white'
                            : isDone
                            ? 'bg-gradient-to-br from-slate-800 to-slate-900 text-white'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {/* Background SVG Motif */}
                        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <pattern id={`pattern-${stg.number}`} width="20" height="20" patternUnits="userSpaceOnUse">
                              <circle cx="2" cy="2" r="1.5" fill="currentColor" />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill={`url(#pattern-${stg.number})`} />
                        </svg>

                        {/* Top-Right Status Badge */}
                        <div className="absolute top-3 right-3">
                          {isDone ? (
                            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          ) : isActive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-[#E50914] text-[10px] font-extrabold uppercase shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-ping" />
                              Aktif
                            </span>
                          ) : (
                            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
                              <Lock className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>

                        {/* Code Chip */}
                        <span className="relative z-10 text-[10px] font-mono font-bold tracking-wider uppercase opacity-90">
                          {stg.code}
                        </span>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-[#141416] group-hover:text-[#E50914] transition-colors leading-snug">
                            {stg.title}
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{stg.metric}</p>
                        </div>

                        {/* Bottom Slim Progress Bar */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-100">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                            <span>Progres</span>
                            <span className="font-bold text-slate-700">{stg.progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 rounded-full ${
                                isActive ? 'bg-[#E50914]' : isDone ? 'bg-emerald-500' : 'bg-slate-300'
                              }`}
                              style={{ width: `${stg.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>

          {/* ────────────────────────────────────────────────────────────────────
              RIGHT SIDEBAR (lg:col-span-4): CALENDAR & ROSTER WIDGETS
          ──────────────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-4 space-y-6">

            {/* ─── WIDGET 1: KALENDER TENGGAT ─── */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-[#E50914]" />
                  <h3 className="text-sm font-extrabold text-[#141416]">Kalender Tenggat</h3>
                </div>
                <span className="text-xs font-bold text-slate-700">Februari 2026</span>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase">
                <span>Min</span>
                <span>Sen</span>
                <span>Sel</span>
                <span>Rab</span>
                <span>Kam</span>
                <span>Jum</span>
                <span>Sab</span>
              </div>

              {/* Days Matrix */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {calendarDays.map((d, idx) => {
                  const isSelected = d.isCurrentMonth && d.date === selectedCalendarDate;
                  const isToday = d.isCurrentMonth && d.date === 11; // Feb 11 example active

                  return (
                    <button
                      key={idx}
                      onClick={() => d.isCurrentMonth && setSelectedCalendarDate(d.date)}
                      disabled={!d.isCurrentMonth}
                      className={`relative h-8 rounded-lg flex items-center justify-center transition-all ${
                        !d.isCurrentMonth
                          ? 'text-slate-300 cursor-default'
                          : isSelected
                          ? 'bg-[#E50914] text-white font-extrabold shadow-xs'
                          : isToday
                          ? 'bg-rose-50 text-[#E50914] font-bold border border-rose-200'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{d.date}</span>

                      {/* Small Red Indicator Dot for Deadlines */}
                      {d.hasDeadline && !isSelected && (
                        <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#E50914]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected Date Events Info Box */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                  Agenda Tanggal {selectedCalendarDate} Februari:
                </span>
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDateEvents.map((evt) => (
                      <div key={evt.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#141416]">{evt.title}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                          <span>{evt.stage}</span>
                          <span className="text-[#E50914] font-bold">{evt.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Tidak ada tenggat berkas wajib pada tanggal ini.</p>
                )}
              </div>
            </div>

            {/* ─── WIDGET 2: ANGGOTA TIM KELOMPOK ─── */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#E50914]" />
                  <h3 className="text-sm font-extrabold text-[#141416]">Anggota Tim Kelompok</h3>
                </div>
                <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                  {groupMembers.length} Relawan
                </span>
              </div>

              {/* Roster List */}
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {groupMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          member.isLeader ? 'bg-[#E50914] text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <span className="block text-xs font-bold text-[#141416] truncate">{member.name}</span>
                        <span className="block text-[10px] text-slate-400 font-mono">NIS: {member.nis}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          member.isLeader
                            ? 'bg-rose-50 text-[#E50914] border border-rose-200'
                            : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        {member.role}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" title="Aktif" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. SLIDE-OVER DRAWER: STAGE DETAILS & CHECKLIST
      ══════════════════════════════════════════════════════════════════════════ */}
      {selectedStageDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#E50914] uppercase tracking-wider">
                  {selectedStageDrawer.code}
                </span>
                <h3 className="text-base font-extrabold text-[#141416] mt-0.5">
                  {selectedStageDrawer.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedStageDrawer(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#141416] hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Daftar Berkas &amp; Capaian Tahap:
                </span>
                <div className="space-y-2.5">
                  {selectedStageDrawer.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                      <span className="font-semibold text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Notice */}
              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 space-y-1">
                <span className="text-xs font-bold text-[#E50914] block">Status Verifikasi Kurikulum</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedStageDrawer.number === 4
                    ? bannerStatus === 'approved'
                      ? 'Berkas telah ditinjau dan disetujui penuh oleh Pembimbing Kurikulum.'
                      : 'Berkas aktif dan dapat diperbarui sebelum batas waktu verifikasi lapangan.'
                    : 'Tahap ini telah diselesaikan dan tersimpan dalam arsip digital.'}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setSelectedStageDrawer(null);
                  setShowUploadModal(true);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#E50914] hover:bg-[#b4000c] text-white transition-colors cursor-pointer text-center shadow-xs"
              >
                Unggah Berkas Baru
              </button>
              <button
                onClick={() => setSelectedStageDrawer(null)}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          4. MODAL: UNGGAH BERKAS STAGE
      ══════════════════════════════════════════════════════════════════════════ */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold text-[#E50914] uppercase tracking-wider">
                  Penyerahan Berkas • KEL-{groupNumberStr}
                </span>
                <h3 className="text-base font-extrabold text-[#141416] mt-0.5">Unggah Berkas ke Pembimbing</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitFile} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Berkas Deliverable</label>
                <input
                  type="text"
                  value={uploadDeliverableName}
                  onChange={(e) => setUploadDeliverableName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E50914] focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tautan File (Google Drive / Canva / Figma)
                </label>
                <input
                  type="url"
                  placeholder="https://canva.com/design/... atau https://drive.google.com/..."
                  value={uploadFileUrl}
                  onChange={(e) => setUploadFileUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E50914] focus:bg-white"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Pastikan izin akses tautan diatur ke "Siapa saja dengan tautan dapat melihat".</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Tambahan untuk Pembimbing</label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan catatan progres atau revisi yang telah diperbaiki..."
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#E50914] focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingFile}
                  className="px-5 py-2 text-xs font-bold bg-[#E50914] hover:bg-[#b4000c] text-white rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingFile ? 'Mengirim...' : 'Kirim Berkas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          5. DRAWER: RIWAYAT MASUKAN & ARAHAN PEMBIMBING
      ══════════════════════════════════════════════════════════════════════════ */}
      {showAdvisorDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-bold text-[#E50914] uppercase tracking-wider">
                  Koordinasi Pembimbing
                </span>
                <h3 className="text-base font-extrabold text-[#141416] mt-0.5">Catatan &amp; Evaluasi Lapangan</h3>
              </div>
              <button
                onClick={() => setShowAdvisorDrawer(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#141416]">{currentGroup.mentorName}</span>
                  <span className="text-slate-400 text-[11px]">Baru saja</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {supervisorMemo || 'Silakan lanjutkan penyempurnaan desain standing banner dan siapkan simulasi internal kelompok bersama seluruh relawan.'}
                </p>
              </div>

              {bannerFeedback && (
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/70 space-y-2">
                  <span className="text-xs font-bold text-[#E50914] block">Masukan Berkas Terakhir</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{bannerFeedback}</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowAdvisorDrawer(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
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
