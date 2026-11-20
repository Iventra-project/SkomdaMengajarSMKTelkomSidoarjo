"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../../components/BrandLogo';
import {
  Home,
  LayoutDashboard,
  FileText,
  Users,
  Search,
  Bell,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Download,
  Upload,
  Plus,
  Check,
  Clock,
  ExternalLink,
  ChevronRight,
  X,
  Sparkles,
  Calendar,
  CheckCircle2,
  ListTodo,
  Lock,
  MessageSquare,
  ShieldAlert,
  Send,
  Eye,
  FolderOpen,
  HelpCircle,
  LogOut,
  Layers,
  MapPin,
  CheckSquare,
  Square,
  BadgeAlert,
  GraduationCap,
} from 'lucide-react';

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  status: 'Terkonfirmasi' | 'Terjadwal';
  location: string;
}

export const WorkspacePage: React.FC = () => {
  const {
    navigate,
    currentUser,
    activeGroup,
    members,
    toggleMemberStatus,
    sprintTasks,
    moveTaskColumn,
    addTask,
    bannerStatus,
    bannerFeedback,
    submitGroupFile,
    supervisorMemo,
    showToast,
    logout,
  } = useApp();

  // Current active group (locked strictly to authenticated leader's group)
  const currentGroup = activeGroup;
  const activeStageNumber = currentGroup.currentStep || 4;
  const [selectedStage, setSelectedStage] = useState<number>(activeStageNumber);

  // Sync selected stage if activeStageNumber changes
  useEffect(() => {
    setSelectedStage(activeStageNumber);
  }, [activeStageNumber]);

  // Mobile drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Filter tabs for stage hero
  const [stageFilter, setStageFilter] = useState<'all' | 'active' | 'archive'>('all');

  // Modals & Drawers state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAdvisorModal, setShowAdvisorModal] = useState(false);
  const [showMembersDrawer, setShowMembersDrawer] = useState(false);
  const [showAssetsModal, setShowAssetsModal] = useState(false);
  const [showAllSchedulesModal, setShowAllSchedulesModal] = useState(false);

  // Upload modal inputs
  const [uploadFileUrl, setUploadFileUrl] = useState('');
  const [uploadFileName, setUploadFileName] = useState('X-Banner 60×160 cm v3 Final');
  const [uploadNotes, setUploadNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Inline Quick Task input
  const [quickTaskText, setQuickTaskText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // 6 Stages Data definition
  const stagesData = useMemo(() => {
    return [
      {
        number: 1,
        code: '01 TIM',
        title: 'Bentuk Tim',
        fullName: 'Tahap 01: Pembentukan Tim & Roster',
        progress: 100,
        metric: '8/8 Anggota',
        metricSub: 'Lengkap & Terdaftar',
        status: 'completed',
        locked: false,
      },
      {
        number: 2,
        code: '02 KETUA',
        title: 'Pilih Ketua',
        fullName: 'Tahap 02: Penetapan & Aktivasi Ketua',
        progress: 100,
        metric: '1/1 Ketua',
        metricSub: 'Akun Terverifikasi',
        status: 'completed',
        locked: false,
      },
      {
        number: 3,
        code: '03 MATERI',
        title: 'Susun Materi',
        fullName: 'Tahap 03: Penyusunan Modul & Silabus',
        progress: 100,
        metric: '4/4 Berkas',
        metricSub: 'Disetujui Kurikulum',
        status: 'completed',
        locked: false,
      },
      {
        number: 4,
        code: '04 DESAIN',
        title: 'Siapkan Desain',
        fullName: 'Tahap 04: Publikasi Desain & Banner',
        progress: 67,
        metric: '2/3 Desain',
        metricSub: '1 Menunggu Review',
        status: 'active',
        locked: false,
      },
      {
        number: 5,
        code: '05 SMP',
        title: 'Mengajar SMP',
        fullName: 'Tahap 05: Implementasi Kelas SMP Mitra',
        progress: 0,
        metric: '0/3 Kelas',
        metricSub: 'Terkunci',
        status: 'locked',
        locked: true,
      },
      {
        number: 6,
        code: '06 LPJ',
        title: 'Laporan Akhir',
        fullName: 'Tahap 06: Refleksi & Laporan LPJ',
        progress: 0,
        metric: '0/2 Laporan',
        metricSub: 'Terkunci',
        status: 'locked',
        locked: true,
      },
    ];
  }, []);

  // Filtered stages for hero card
  const filteredStages = useMemo(() => {
    if (stageFilter === 'active') {
      return stagesData.filter((s) => s.number === activeStageNumber);
    }
    if (stageFilter === 'archive') {
      return stagesData.filter((s) => s.number < activeStageNumber);
    }
    return stagesData;
  }, [stagesData, stageFilter, activeStageNumber]);

  // Stage click handler
  const handleStageSelect = (stageNum: number) => {
    if (stageNum > activeStageNumber) {
      showToast(`Tahap 0${stageNum} masih terkunci. Selesaikan Tahap 0${activeStageNumber} terlebih dahulu.`, 'warning');
      return;
    }
    setSelectedStage(stageNum);
    if (stageNum < activeStageNumber) {
      showToast(`Membuka arsip Tahap 0${stageNum} (Mode Baca & Unduh Dokumen)`, 'info');
    }
  };

  // Upload handler
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileUrl.trim()) {
      showToast('Masukkan link URL Google Drive atau berkas desain.', 'warning');
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      submitGroupFile(
        currentGroup.number,
        uploadFileUrl.trim(),
        uploadNotes.trim() || `${uploadFileName} diserahkan oleh ${currentUser?.name || currentGroup.leaderName}`
      );
      setIsUploading(false);
      setShowUploadModal(false);
      setUploadFileUrl('');
      setUploadNotes('');
      showToast('Berkas berhasil diserahkan untuk peninjauan Pembimbing & Kurikulum!', 'success');
    }, 600);
  };

  // Add quick task handler
  const handleAddQuickTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskText.trim()) return;
    addTask(quickTaskText.trim(), 'medium', currentUser?.name || currentGroup.leaderName);
    setQuickTaskText('');
    showToast('Tugas anggota berhasil ditambahkan!', 'success');
  };

  // Schedules mock data
  const scheduleItems: ScheduleItem[] = [
    {
      id: 'sc-1',
      time: '09:00 WIB',
      title: 'Briefing Desain X-Banner & Feed IG Tim',
      status: 'Terkonfirmasi',
      location: 'Ruang Diskusi Lantai 2',
    },
    {
      id: 'sc-2',
      time: '13:30 WIB',
      title: 'Konsultasi Dra. Sri Wahyuni (Review Banner v2)',
      status: 'Terjadwal',
      location: 'Ruang Guru Pembimbing',
    },
    {
      id: 'sc-3',
      time: '15:00 WIB',
      title: 'Survei Lab Komputer SMPN 1 Buduran',
      status: 'Terkonfirmasi',
      location: 'Lab Komputer SMPN 1 Buduran',
    },
    {
      id: 'sc-4',
      time: '16:30 WIB',
      title: 'Cek Kesiapan Akun Siswa Scratch & Canva',
      status: 'Terjadwal',
      location: 'Online via Google Meet',
    },
  ];

  // Deliverables status for Card 3A
  const deliverables = [
    {
      id: 'del-1',
      name: 'Desain Feed IG Tim',
      tag: 'Publikasi Digital',
      status: 'Belum diunggah',
      statusColor: 'text-rose-600 bg-rose-50 border-rose-200',
      action: 'upload',
    },
    {
      id: 'del-2',
      name: 'Final X-Banner 60×160',
      tag: 'Cetak Promosi',
      status: bannerStatus === 'approved' ? 'Disetujui' : 'Menunggu Review',
      statusColor:
        bannerStatus === 'approved'
          ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
          : 'text-amber-700 bg-amber-50 border-amber-200',
      action: bannerStatus === 'approved' ? 'done' : 'check',
    },
    {
      id: 'del-3',
      name: 'Modul Sesi 1 & 2',
      tag: 'Materi Literasi',
      status: 'Disetujui Kurikulum',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      action: 'done',
    },
  ];

  const isArchiveMode = selectedStage < activeStageNumber;

  return (
    <div className="min-h-screen bg-[#F6F6F4] text-[#141416] font-sans antialiased flex flex-col lg:flex-row overflow-x-hidden selection:bg-[#E50914] selection:text-white">
      {/* ══════════════════════════════════════════════════════════════════════════
          1. LEFT FIXED SIDEBAR (w-[250px] DESKTOP, COLLAPSIBLE DRAWER ON MOBILE)
      ══════════════════════════════════════════════════════════════════════════ */}
      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 w-[250px] bg-white border-r border-slate-200/80 z-50 flex flex-col justify-between py-5 px-4 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Area: Brand & Group Selector Card */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-1">
          {/* Header & Logo Badge */}
          <div className="flex items-center justify-between pb-1">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 cursor-pointer group text-left"
            >
              <BrandLogo size="md" />
            </button>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Locked Group Selector Card */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black tracking-wider uppercase text-slate-400">
                Kelompok Anda
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-100 text-[#E50914]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse" />
                Fase Aktif
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#E50914] text-white flex items-center justify-center font-black text-xs shrink-0">
                {currentGroup.number}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-black text-[#141416] truncate">
                  KEL-{currentGroup.number} • {currentGroup.schoolName}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  Ketua: {currentUser?.name || currentGroup.leaderName}
                </div>
              </div>
            </div>
          </div>

          {/* Primary Active Pill: Dashboard */}
          <button
            onClick={() => {
              setSelectedStage(activeStageNumber);
              setIsMobileSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#141416] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4 text-white shrink-0" />
            <span>Dashboard</span>
            <span className="ml-auto w-2 h-2 rounded-full bg-[#E50914]" />
          </button>

          {/* Navigation Group 1: ALUR TAHAPAN */}
          <div className="space-y-1.5 pt-2">
            <span className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              ALUR TAHAPAN
            </span>
            <div className="space-y-1">
              {stagesData.map((stg) => {
                const isCurrentActive = selectedStage === stg.number;
                const isPast = stg.number < activeStageNumber;
                const isLocked = stg.locked;

                return (
                  <button
                    key={stg.number}
                    onClick={() => {
                      handleStageSelect(stg.number);
                      setIsMobileSidebarOpen(false);
                    }}
                    disabled={isLocked}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isCurrentActive
                        ? 'bg-red-50 text-[#E50914] font-bold border border-red-200'
                        : isLocked
                        ? 'text-slate-400 cursor-not-allowed opacity-60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[11px] font-bold">
                        0{stg.number}
                      </span>
                      <span className="truncate">{stg.title}</span>
                    </div>

                    <div className="shrink-0 flex items-center">
                      {isPast && (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      {stg.number === activeStageNumber && (
                        <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-[#E50914] text-white">
                          67%
                        </span>
                      )}
                      {isLocked && <Lock className="w-3 h-3 text-slate-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Group 2: WORKSPACE */}
          <div className="space-y-1.5 pt-2">
            <span className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              WORKSPACE
            </span>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setShowMembersDrawer(true);
                  setIsMobileSidebarOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>Anggota Tim</span>
                </div>
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                  {members.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setShowUploadModal(true);
                  setIsMobileSidebarOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Unggah Berkas</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#E50914]" />
              </button>

              <button
                onClick={() => {
                  setShowAssetsModal(true);
                  setIsMobileSidebarOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <FolderOpen className="w-4 h-4 text-slate-500" />
                <span>Aset & Template</span>
              </button>

              <button
                onClick={() => {
                  navigate('/home');
                  setIsMobileSidebarOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4 text-slate-500" />
                <span>Rekam Jejak</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Sidebar: Highlight Card & Profile */}
        <div className="pt-3 border-t border-slate-100 space-y-2.5">
          {/* Soft Crimson Highlight Card */}
          <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-rose-800 tracking-wider">
                Status Pembimbing
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-rose-200 text-rose-900">
                Aktif
              </span>
            </div>
            <div className="text-[11px] font-bold text-slate-900">
              Dra. Sri Wahyuni, M.Pd
            </div>
            <button
              onClick={() => {
                setShowAdvisorModal(true);
                setIsMobileSidebarOpen(false);
              }}
              className="w-full py-1.5 px-2.5 rounded-lg bg-white hover:bg-rose-50 text-[10px] font-extrabold text-[#E50914] border border-[#FECDD3] flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>1 berkas menunggu review</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* User Profile Pill & Logout */}
          <div className="flex items-center justify-between px-1">
            <div className="min-w-0 pr-2">
              <div className="text-xs font-extrabold text-[#141416] truncate">
                {currentUser?.name || currentGroup.leaderName}
              </div>
              <div className="text-[10px] text-slate-400">
                Ketua KEL-{currentGroup.number}
              </div>
            </div>
            <button
              onClick={() => logout('/login')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Keluar Sesi"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. MAIN CONTENT AREA (OFFSET lg:ml-[250px] TO PRESERVE FIXED SIDEBAR)
      ══════════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 lg:ml-[250px] min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* ─── TOP HEADER BAR ─── */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Dynamic Greeting */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
              title="Buka Menu"
            >
              <Layers className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-[#141416] tracking-tight font-display">
                Selamat bekerja, {(currentUser?.name || currentGroup.leaderName).split(' ')[0]}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelompok {currentGroup.number} • {currentGroup.schoolName} • Tahap 0{activeStageNumber}: Siapkan Desain & Cetak
              </p>
            </div>
          </div>

          {/* Center-Right: Search Pill, Status Badge, Bell, and Primary CTA */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Search Pill */}
            <div className="hidden sm:flex items-center gap-2 bg-white border border-slate-200/80 rounded-full px-3.5 py-1.5 text-xs text-slate-500 shadow-2xs">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berkas atau tugas..."
                className="bg-transparent border-none outline-none text-xs text-slate-800 placeholder:text-slate-400 w-36 lg:w-44"
              />
            </div>

            {/* Group Status Pill */}
            <div className="px-3.5 py-1.5 rounded-full bg-red-50 text-[#E50914] text-xs font-bold border border-red-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
              <span>Tahap 0{activeStageNumber} Aktif</span>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setShowAdvisorModal(true)}
              className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200/80 shadow-2xs transition-colors cursor-pointer relative"
              title="Notifikasi & Catatan Pembimbing"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#E50914] absolute top-2 right-2 border-2 border-white" />
            </button>

            {/* Primary Dark CTA Button */}
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-[#141416] hover:bg-[#28292d] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:scale-[1.02] cursor-pointer"
            >
              <span>&gt; Unggah Berkas</span>
            </button>
          </div>
        </header>

        {/* ─── ARCHIVE NOTICE (IF BROWSING PREVIOUS COMPLETED STAGE) ─── */}
        {isArchiveMode && (
          <div className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-900 shadow-2xs">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Tahap 0{selectedStage} Selesai • Mode Arsip &amp; Unduh Dokumen</span>
              <span className="hidden md:inline font-normal text-emerald-700">
                (Seluruh dokumen tahap ini telah disahkan oleh pembimbing lapangan)
              </span>
            </div>
            <button
              onClick={() => setSelectedStage(activeStageNumber)}
              className="px-3.5 py-1 bg-white hover:bg-emerald-100/60 text-emerald-800 font-extrabold rounded-full border border-emerald-300 transition-colors cursor-pointer shrink-0"
            >
              Kembali ke Tahap Aktif (0{activeStageNumber}) →
            </button>
          </div>
        )}

        {/* ─── 7-CARD MINI KPI STRIP ─── */}
        <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* Card 1: Anggota Tim */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Anggota Tim
            </div>
            <div className="text-2xl font-black text-[#141416] mt-1">
              8/8
            </div>
            <div className="text-[11px] font-extrabold text-emerald-600 mt-1 flex items-center gap-1">
              <span>↗ Lengkap</span>
            </div>
          </div>

          {/* Card 2: Berkas Disetujui */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Berkas Disetujui
            </div>
            <div className="text-2xl font-black text-[#141416] mt-1">
              4
            </div>
            <div className="text-[11px] font-extrabold text-emerald-600 mt-1 flex items-center gap-1">
              <span>↗ Tahap 1-3</span>
            </div>
          </div>

          {/* Card 3: Menunggu Review */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Menunggu Review
            </div>
            <div className="text-2xl font-black text-[#141416] mt-1">
              1
            </div>
            <div className="text-[11px] font-extrabold text-amber-600 mt-1 flex items-center gap-1">
              <span>X-Banner</span>
            </div>
          </div>

          {/* Card 4: Perlu Revisi */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Perlu Revisi
            </div>
            <div className="text-2xl font-black text-[#141416] mt-1">
              0
            </div>
            <div className="text-[11px] font-extrabold text-slate-500 mt-1 flex items-center gap-1">
              <span>Aman</span>
            </div>
          </div>

          {/* Card 5: Sisa Waktu */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Sisa Waktu
            </div>
            <div className="text-2xl font-black text-[#141416] mt-1">
              12
            </div>
            <div className="text-[11px] font-extrabold text-slate-500 mt-1 flex items-center gap-1">
              <span>Hari lagi</span>
            </div>
          </div>

          {/* Card 6: Materi & Modul */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-2xs flex flex-col justify-between">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Materi &amp; Modul
            </div>
            <div className="text-2xl font-black text-[#141416] mt-1">
              100%
            </div>
            <div className="text-[11px] font-extrabold text-emerald-600 mt-1 flex items-center gap-1">
              <span>Siap</span>
            </div>
          </div>

          {/* Card 7: Progres Total (CRIMSON RED HIGHLIGHT CARD) */}
          <div className="bg-[#E50914] text-white rounded-2xl p-4 shadow-sm border border-red-600 flex flex-col justify-between">
            <div className="text-[11px] font-bold text-red-100 uppercase tracking-wider">
              Progres Total
            </div>
            <div className="text-2xl font-black text-white mt-1">
              67%
            </div>
            <div className="text-[11px] font-extrabold text-red-100 mt-1 flex items-center gap-1">
              <span>↗ Tahap 04</span>
            </div>
          </div>
        </section>

        {/* ─── 3. CENTER HERO CARD: ALUR & PROGRES KELOMPOK (6-STAGE PIPELINE) ─── */}
        <section className="bg-white rounded-[24px] p-6 border border-slate-200/70 shadow-sm">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-[#141416] tracking-tight">
                Alur &amp; Progres Kelompok
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tahapan terstruktur dari pembentukan tim hingga publikasi luaran di SMP mitra
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full text-xs font-bold">
              <button
                onClick={() => setStageFilter('all')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  stageFilter === 'all'
                    ? 'bg-white text-[#141416] shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Semua Tahap
              </button>
              <button
                onClick={() => setStageFilter('active')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  stageFilter === 'active'
                    ? 'bg-white text-[#141416] shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Tahap Aktif
              </button>
              <button
                onClick={() => setStageFilter('archive')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  stageFilter === 'archive'
                    ? 'bg-white text-[#141416] shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Arsip
              </button>
            </div>
          </div>

          {/* 6-Column Horizontal Stage Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 mt-5">
            {filteredStages.map((stg) => {
              const isSelected = selectedStage === stg.number;
              const isActive = stg.number === activeStageNumber;
              const isPast = stg.number < activeStageNumber;
              const isLocked = stg.locked;

              return (
                <div
                  key={stg.number}
                  onClick={() => handleStageSelect(stg.number)}
                  className={`rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between min-h-[148px] ${
                    isSelected
                      ? 'border-[#E50914] bg-red-50/20 shadow-xs ring-1 ring-[#E50914]/30'
                      : isLocked
                      ? 'border-slate-200/60 bg-slate-50/70 opacity-60 cursor-not-allowed'
                      : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  {/* Top Row: Stage Code Badge + Completion % */}
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-[#E50914] text-white shadow-2xs'
                          : isPast
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {stg.code}
                    </span>

                    <span
                      className={`text-[11px] font-black ${
                        isActive
                          ? 'text-[#E50914]'
                          : isPast
                          ? 'text-emerald-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {stg.progress}%
                    </span>
                  </div>

                  {/* Middle Visual: Diagonal Hatched Pattern Container with Solid Crimson Red Fill */}
                  <div className="my-3 space-y-1">
                    <div
                      className="w-full h-3 rounded-full overflow-hidden p-0.5 border border-slate-200"
                      style={{
                        background:
                          'repeating-linear-gradient(45deg, #f1f5f9, #f1f5f9 6px, #e2e8f0 6px, #e2e8f0 12px)',
                      }}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isPast
                            ? 'bg-emerald-500'
                            : isActive
                            ? 'bg-[#E50914]'
                            : 'bg-transparent'
                        }`}
                        style={{ width: `${stg.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Bottom Metric: Large bold counter with sub-label */}
                  <div>
                    <div className="text-sm font-black text-[#141416]">
                      {stg.metric}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {stg.metricSub}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── 4. BOTTOM 3-COLUMN OPERATIONAL BENTO GRID ─── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          {/* ══════════════════════════════════════════════════════════════════════
              COLUMN 1: AGENDA & JADWAL TIM
          ══════════════════════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-slate-200/70 shadow-sm flex flex-col justify-between gap-4">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-[#141416] flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#141416]">
                      Agenda &amp; Jadwal Tim
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Rangkaian kegiatan Skomda Mengajar
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAllSchedulesModal(true)}
                  className="text-xs font-bold text-[#E50914] hover:underline cursor-pointer"
                >
                  Semua jadwal &gt;
                </button>
              </div>

              {/* Time-slotted schedule rows */}
              <div className="divide-y divide-slate-100 mt-3 space-y-1">
                {scheduleItems.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold text-slate-400 font-mono">
                        {item.time}
                      </div>
                      <div className="text-xs font-bold text-[#141416] mt-0.5 leading-snug">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-slate-400" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        item.status === 'Terkonfirmasi'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom summary note */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>4 agenda terjadwal minggu ini di {currentGroup.schoolName}</span>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              COLUMN 2: CATATAN & REVIEW PEMBIMBING
          ══════════════════════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-slate-200/70 shadow-sm flex flex-col justify-between gap-4">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-[#E50914] flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-[#E50914]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#141416]">
                      Catatan &amp; Review Pembimbing
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Arahan resmi dosen / guru pendamping
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-50 text-[#E50914] border border-red-200">
                  1 menunggu
                </span>
              </div>

              {/* Advisor Info Bar */}
              <div className="flex items-center gap-2.5 mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  SW
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#141416] truncate">
                    Dra. Sri Wahyuni, M.Pd
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Guru Pembimbing Kelompok {currentGroup.number}
                  </div>
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 shrink-0">
                  Prioritas Tinggi
                </span>
              </div>

              {/* Feedback Quote Bubble */}
              <div className="mt-3 p-3.5 bg-rose-50/50 border border-rose-200/60 rounded-2xl relative">
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  &ldquo;Pastikan logo Tut Wuri Handayani dan logo SMPN 1 Buduran posisinya sejajar di bagian header banner. Untuk materi presentasi jangan terlalu padat teks, prioritaskan studi kasus visual.&rdquo;
                </p>
                <div className="text-[10px] font-semibold text-slate-400 mt-2 flex items-center justify-between">
                  <span>Ditinjau 12 menit lalu</span>
                  <span className="text-slate-600 font-bold">X-Banner 60×160 v2</span>
                </div>
              </div>
            </div>

            {/* Interactive Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setShowAdvisorModal(true)}
                className="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Periksa Detail
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="py-2.5 px-3 rounded-xl bg-[#E50914] hover:bg-[#b4000c] text-white text-xs font-bold transition-all shadow-xs cursor-pointer text-center flex items-center justify-center gap-1"
              >
                <span>Unggah Revisi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              COLUMN 3: 3 STACKED COMPACT ACTION CARDS
          ══════════════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col gap-4">
            {/* Card 3A: Berkas Belum Lengkap */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#141416]">
                  <AlertCircle className="w-3.5 h-3.5 text-[#E50914]" />
                  <span>Berkas Belum Lengkap</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500">
                  2/3 Terkumpul
                </span>
              </div>

              <div className="space-y-1.5">
                {deliverables.map((del) => (
                  <div
                    key={del.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-[#141416] truncate text-[11px]">
                        {del.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {del.tag}
                      </div>
                    </div>
                    {del.action === 'upload' ? (
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="px-2.5 py-1 rounded-lg bg-[#E50914] hover:bg-[#b4000c] text-white font-bold text-[10px] transition-colors cursor-pointer shrink-0"
                      >
                        Unggah
                      </button>
                    ) : (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${del.statusColor}`}>
                        {del.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3B: Tenggat Terdekat */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-2xs space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#141416]">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Tenggat Terdekat</span>
                </div>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.2 rounded-full">
                  Kritis
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-700 text-[11px]">Pengumpulan Desain Final</span>
                  <span className="font-extrabold text-[#E50914] text-[10px] bg-red-50 px-2 py-0.5 rounded-md">
                    4 hari lagi
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-700 text-[11px]">Simulasi Mengajar Lab</span>
                  <span className="font-bold text-amber-700 text-[10px] bg-amber-50 px-2 py-0.5 rounded-md">
                    9 hari lagi
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-700 text-[11px]">Hari Pertama di SMP Mitra</span>
                  <span className="font-bold text-slate-600 text-[10px] bg-slate-100 px-2 py-0.5 rounded-md">
                    12 hari lagi
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3C: Tugas Anggota Hari Ini */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/70 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#141416]">
                  <ListTodo className="w-3.5 h-3.5 text-[#E50914]" />
                  <span>Tugas Anggota Hari Ini</span>
                </div>
                <span className="text-[10px] font-extrabold text-slate-500">
                  {sprintTasks.filter((t) => t.column === 'done').length}/{sprintTasks.length} Selesai
                </span>
              </div>

              {/* Tasks List */}
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {sprintTasks.slice(0, 4).map((task) => {
                  const isDone = task.column === 'done';
                  return (
                    <div
                      key={task.id}
                      onClick={() =>
                        moveTaskColumn(task.id, isDone ? 'in_progress' : 'done')
                      }
                      className={`flex items-start gap-2 p-2 rounded-xl border transition-all cursor-pointer ${
                        isDone
                          ? 'bg-emerald-50/40 border-emerald-200 text-slate-400'
                          : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <button type="button" className="mt-0.5 shrink-0 text-slate-500">
                        {isDone ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                      <div className="min-w-0 flex-1">
                        <div
                          className={`text-[11px] font-bold leading-tight ${
                            isDone ? 'line-through text-slate-400' : 'text-slate-800'
                          }`}
                        >
                          {task.title}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {task.assignee}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Inline Quick Add Task */}
              <form onSubmit={handleAddQuickTask} className="flex items-center gap-1.5 pt-1">
                <input
                  type="text"
                  value={quickTaskText}
                  onChange={(e) => setQuickTaskText(e.target.value)}
                  placeholder="+ Tambah tugas baru..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#E50914]"
                />
                <button
                  type="submit"
                  disabled={!quickTaskText.trim()}
                  className="px-2.5 py-1.5 rounded-lg bg-[#141416] hover:bg-[#2e2f34] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          MODAL 1: UNGGAH BERKAS MODAL
      ══════════════════════════════════════════════════════════════════════════ */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#E50914] flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#141416]">
                    Unggah Berkas Tahap 0{selectedStage}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Kelompok {currentGroup.number} • {currentGroup.schoolName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Nama Berkas / Item Desain
                </label>
                <input
                  type="text"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder="Contoh: X-Banner 60×160 cm v3 Final"
                  required
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 focus:border-[#E50914] rounded-xl text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Link Google Drive / Cloud File
                </label>
                <input
                  type="url"
                  value={uploadFileUrl}
                  onChange={(e) => setUploadFileUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  required
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 focus:border-[#E50914] rounded-xl text-xs text-slate-900 outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Pastikan akses link diatur ke &ldquo;Anyone with link can view&rdquo;.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Catatan Revisi untuk Pembimbing
                </label>
                <textarea
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  placeholder="Contoh: Revisi perataan logo dan penyesuaian font sesuai arahan Dra. Sri Wahyuni."
                  rows={3}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 focus:border-[#E50914] rounded-xl text-xs text-slate-900 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl bg-[#E50914] hover:bg-[#b4000c] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {isUploading ? (
                    <span>Mengirim...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Berkas Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          MODAL 2: ADVISOR FEEDBACK DRAWER/MODAL
      ══════════════════════════════════════════════════════════════════════════ */}
      {showAdvisorModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  SW
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#141416]">
                    Catatan Pembimbing Lapangan
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Dra. Sri Wahyuni, M.Pd • Koordinator Kelompok {currentGroup.number}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAdvisorModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#E50914] text-white">
                Review Tahap 04: Desain Banner
              </span>
              <p className="text-xs text-slate-800 leading-relaxed pt-1">
                &ldquo;Pastikan logo Tut Wuri Handayani dan logo SMPN 1 Buduran posisinya sejajar di bagian header banner. Untuk materi presentasi jangan terlalu padat teks, prioritaskan studi kasus visual.&rdquo;
              </p>
              <div className="text-[10px] text-slate-400 pt-2 border-t border-rose-200/60 flex items-center justify-between">
                <span>Catatan dikirim via Portal Kurikulum</span>
                <span className="font-semibold text-rose-800">Status: Menunggu Revisi</span>
              </div>
            </div>

            {supervisorMemo && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                <span className="font-bold block text-[11px] text-slate-500 mb-1">
                  Memo Tambahan:
                </span>
                {supervisorMemo}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAdvisorModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setShowAdvisorModal(false);
                  setShowUploadModal(true);
                }}
                className="px-5 py-2 rounded-xl bg-[#E50914] hover:bg-[#b4000c] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                Unggah Revisi Sekarang →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          MODAL 3: ANGGOTA TIM ROSTER DRAWER
      ══════════════════════════════════════════════════════════════════════════ */}
      {showMembersDrawer && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#141416]">
                    Roster Anggota Tim Kelompok {currentGroup.number}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {members.length} Relawan Terdaftar di {currentGroup.schoolName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMembersDrawer(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold text-[#141416] truncate">
                        {member.name}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                        <span>Role: {member.role}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700">{member.initials || 'SKD'}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      member.status === 'valid'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {member.status === 'valid' ? 'Terverifikasi' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => setShowMembersDrawer(false)}
                className="px-5 py-2 rounded-xl bg-[#141416] text-white text-xs font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          MODAL 4: ASET & TEMPLATE RESMI
      ══════════════════════════════════════════════════════════════════════════ */}
      {showAssetsModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
                  <FolderOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#141416]">
                    Aset &amp; Template Resmi
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Standar materi dan publikasi Skomda Mengajar 2026
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAssetsModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              <a
                href="#download-banner"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('Mengunduh Template X-Banner 60×160 cm (.AI & PSD)...', 'success');
                }}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-100 text-[#E50914] flex items-center justify-center font-bold text-xs">
                    AI
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#141416]">Template X-Banner 60×160 cm</div>
                    <div className="text-[10px] text-slate-500">Format CMYK 300 DPI Siap Cetak</div>
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-500" />
              </a>

              <a
                href="#download-logo"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('Mengunduh Paket Logo Vektor Skomda (.SVG & PNG)...', 'success');
                }}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    SVG
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#141416]">Logo Vektor Skomda Mengajar</div>
                    <div className="text-[10px] text-slate-500">Transparan High-Res & Tut Wuri Handayani</div>
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-500" />
              </a>

              <a
                href="#download-modul"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('Membuka Silabus & Modul Pembelajaran SMP (.PDF)...', 'info');
                }}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#141416]">Pedoman Kurikulum &amp; Silabus</div>
                    <div className="text-[10px] text-slate-500">Disahkan MGMP Informatika Sidoarjo</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500" />
              </a>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowAssetsModal(false)}
                className="px-5 py-2 rounded-xl bg-[#141416] text-white text-xs font-bold"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          MODAL 5: SEMUA JADWAL MODAL
      ══════════════════════════════════════════════════════════════════════════ */}
      {showAllSchedulesModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#E50914]" />
                <div>
                  <h3 className="text-sm font-black text-[#141416]">
                    Agenda Pelaksanaan Lengkap
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Kelompok {currentGroup.number} • {currentGroup.schoolName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAllSchedulesModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {scheduleItems.map((item) => (
                <div key={item.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-extrabold text-[#E50914]">
                      {item.time}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {item.status}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">{item.title}</div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{item.location}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowAllSchedulesModal(false)}
                className="px-5 py-2 rounded-xl bg-[#141416] text-white text-xs font-bold"
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
