"use client";
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DarkStagePillSwitcher } from '../../components/Navbar';
import {
  Home,
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  MapPin,
  Bell,
  AlertCircle,
  ArrowRight,
  Download,
  Upload,
  Plus,
  Check,
  Clock,
  ExternalLink,
  Presentation,
  Layers,
  Printer,
  BookOpen,
  ChevronRight,
  X,
  Sparkles,
  Share2,
  Calendar,
  CheckCircle2,
  ListTodo,
  Lock,
  QrCode,
  FileCheck,
  Award,
  Copy,
  CheckCheck,
  LogOut
} from 'lucide-react';

const IMAGE_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23f1f5f9'/%3E%3Ccircle cx='300' cy='180' r='40' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='65%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='15' font-weight='600' fill='%2394a3b8'%3EDokumentasi Skomda Mengajar%3C/text%3E%3C/svg%3E";

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
    setIsBannerModalOpen,
    showToast,
    logout
  } = useApp();

  // Scoped to the authenticated user's actual group
  const currentGroup = activeGroup;
  const activeStage = currentGroup.currentStep || 4;
  const [viewStage, setViewStage] = useState<number>(activeStage);

  // Sync active stage if group data updates
  useEffect(() => {
    setViewStage(activeStage);
  }, [activeStage]);

  // Modals & Drawers state
  const [showKanbanModal, setShowKanbanModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [uploadFileUrl, setUploadFileUrl] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [copiedSurvey, setCopiedSurvey] = useState(false);

  // Photo list state
  const [photosList, setPhotosList] = useState([
    {
      id: 'p1',
      title: 'Ruang Lab Komputer',
      tag: 'Lab Komp',
      subtext: 'Kapasitas 36 Siswa',
      img: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'p2',
      title: `Gerbang Utama ${currentGroup.schoolName}`,
      tag: 'Gerbang Depan',
      subtext: 'Titik Roll Banner',
      img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80'
    }
  ]);

  // Calculations for Stage Gating
  const isArchiveMode = viewStage < activeStage;
  const isActiveStage = viewStage === activeStage;

  const validCount = members.filter((m) => m.status === 'valid').length;
  const totalMembers = members.length || 8;
  const igProgressPercent = Math.round((validCount / totalMembers) * 100);

  const todoTasks = sprintTasks.filter((t) => t.column === 'todo');
  const inProgressTasks = sprintTasks.filter((t) => t.column === 'in_progress');
  const doneTasks = sprintTasks.filter((t) => t.column === 'done');

  // Copy survey link simulation
  const handleCopySurvey = () => {
    setCopiedSurvey(true);
    showToast(`Link kuesioner feedback ${currentGroup.schoolName} berhasil disalin!`, 'success');
    setTimeout(() => setCopiedSurvey(false), 2500);
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl) return;
    setPhotosList([
      ...photosList,
      {
        id: `p-${Date.now()}`,
        title: 'Foto Survei Baru',
        tag: 'Dokumentasi',
        subtext: 'Terverifikasi',
        img: newPhotoUrl
      }
    ]);
    setNewPhotoUrl('');
    setShowAddPhotoModal(false);
    showToast('Foto dokumentasi berhasil ditambahkan!', 'success');
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileUrl.trim()) return;
    submitGroupFile(
      currentGroup.number,
      uploadFileUrl.trim(),
      `Berkas Tahap 0${viewStage} diunggah oleh ${currentUser?.name || currentGroup.leaderName}`
    );
    setShowUploadModal(false);
    setUploadFileUrl('');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle.trim(), 'medium', currentUser?.name || currentGroup.leaderName);
    setNewTaskTitle('');
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-slate-900 font-sans p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 justify-center items-start overflow-x-hidden">
      {/* ══════════════════════════════════════════════════════════════════════════
          1. FLOATING LEFT ICON SIDEBAR (SLIM PILL, NO TEXT)
      ══════════════════════════════════════════════════════════════════════════ */}
      <aside className="hidden lg:flex w-16 shrink-0 bg-white rounded-full shadow-sm flex-col items-center py-6 gap-6 sticky top-8 z-30">
        <button
          onClick={() => navigate('/home')}
          className="w-10 h-10 rounded-full bg-[#E50914] text-white flex items-center justify-center font-black text-xs shadow-md shadow-red-500/20 hover:scale-105 transition-transform cursor-pointer"
          title="Beranda Komunitas Skomda Mengajar"
        >
          SM
        </button>

        <div className="w-8 h-[1px] bg-slate-100" />

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => navigate('/home')}
            className="w-11 h-11 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
            title="Kembali ke Beranda"
          >
            <Home className="w-5 h-5" />
          </button>

          <button
            className="w-11 h-11 rounded-full flex items-center justify-center bg-[#E50914] text-white shadow-md shadow-red-500/25 transition-all cursor-pointer"
            title="Bento Workspace (Aktif)"
          >
            <LayoutDashboard className="w-5 h-5" />
          </button>

          <button
            onClick={() => showToast('Membuka Berkas & Aset Resmi', 'info')}
            className="w-11 h-11 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
            title="Berkas & Aset"
          >
            <FileText className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowMembersModal(true)}
            className="w-11 h-11 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer relative"
            title="Anggota Regu"
          >
            <Users className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-[#E50914] absolute top-2.5 right-2.5" />
          </button>

          <button
            onClick={() => logout()}
            className="w-11 h-11 rounded-full flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
            title="Keluar Akun"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════════════════
          MAIN WORKSPACE AREA
      ══════════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 max-w-[1400px] w-full flex flex-col gap-5 overflow-x-hidden">
        {/* ─── FLOATING TOP HEADER ─── */}
        <header className="w-full bg-white rounded-full px-5 sm:px-6 py-3.5 shadow-sm flex flex-col xl:flex-row items-center justify-between gap-4">
          {/* Left Brand & Group Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="font-black text-sm tracking-tight text-slate-900 hover:text-[#E50914] transition-colors"
            >
              SKOMDA<span className="text-[#E50914]">.</span>
            </button>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Kelompok {currentGroup.number}
            </span>
          </div>

          {/* Center: Stage Navigator Pill (Tahap 01 to Tahap 06 Dark Pill Capsule) */}
          <DarkStagePillSwitcher
            activeStage={activeStage}
            viewStage={viewStage}
            onSelectStage={(stageNum) => {
              setViewStage(stageNum);
              if (stageNum < activeStage) {
                showToast(`Membuka arsip Tahap 0${stageNum} (Mode Lihat & Unduh)`, 'info');
              }
            }}
          />

          {/* Right Controls: School Badge, Notification Bell, User Avatar */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#E50914]" />
              <span className="truncate max-w-[150px]">{currentGroup.schoolName}</span>
            </div>

            <button
              onClick={() => showToast(`Status Kelompok: ${currentGroup.statusLabel || 'Sesuai Jadwal'}`, 'info')}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer relative"
              title="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              {bannerStatus === 'revision' && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 absolute top-2 right-2 border-2 border-white animate-ping" />
              )}
            </button>

            <div
              className="flex items-center gap-2 pl-1 cursor-pointer"
              onClick={() => showToast(`Ketua Regu: ${currentGroup.leaderName} (Kel. ${currentGroup.number})`, 'info')}
            >
              <div className="w-9 h-9 rounded-full bg-[#E50914] text-white flex items-center justify-center font-bold text-xs ring-2 ring-red-100 shadow-sm">
                {currentGroup.leaderName.charAt(0)}
              </div>
              <span className="hidden sm:inline-block text-xs font-bold text-slate-800 truncate max-w-[120px]">
                {currentGroup.leaderName.split(' ')[0]}
              </span>
            </div>
          </div>
        </header>

        {/* ─── ARCHIVE MODE BANNER (WHEN BROWSING COMPLETED STAGE) ─── */}
        {isArchiveMode && (
          <div className="w-full bg-emerald-50 border border-emerald-200/90 rounded-2xl px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-900 shadow-2xs animate-in fade-in duration-300">
            <div className="flex items-center gap-2.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Tahap 0{viewStage} Selesai • Mode Arsip & Unduh Dokumen</span>
              <span className="hidden md:inline font-normal text-emerald-700">
                (Seluruh berkas telah disahkan oleh pembimbing lapangan)
              </span>
            </div>
            <button
              onClick={() => setViewStage(activeStage)}
              className="px-4 py-1.5 bg-white hover:bg-emerald-100/60 text-emerald-800 font-extrabold rounded-full border border-emerald-300 transition-colors cursor-pointer shrink-0"
            >
              Kembali ke Tahap Aktif (0{activeStage}) →
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            2. UNIFIED BENTO GRID (DYNAMICALLY ADAPTED PER STAGE)
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
          {/* ══════════════════════════════════════════════════════════════════════
              BENTO CARD 1: THE HERO (Col span 7, Row span 2)
              (DYNAMIC CONTENT WITH ISOMETRIC PERSPECTIVE & EDGE BLEED)
          ══════════════════════════════════════════════════════════════════════ */}
          <div className="md:col-span-7 md:row-span-2 bg-white rounded-[32px] p-8 sm:p-10 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-500 relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[410px] group">
            {/* Organic Glowing Radial Background Gradient */}
            <div className="absolute -right-20 -bottom-20 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-red-200/60 via-rose-100/40 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute right-16 top-6 w-72 h-72 rounded-full bg-gradient-to-tr from-amber-100/35 via-red-100/30 to-transparent blur-2xl pointer-events-none" />

            {/* Content (Left ~60%) */}
            <div className="relative z-10 w-full md:w-[58%] flex flex-col justify-between h-full space-y-6">
              <div>
                {/* Status Pill with Synchronized Live Status */}
                {isArchiveMode ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200 mb-4 shadow-2xs">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Telah Disahkan & Disetujui</span>
                  </div>
                ) : bannerStatus === 'approved' ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200 mb-4 shadow-2xs">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Disetujui Admin Kurikulum</span>
                  </div>
                ) : bannerStatus === 'revision' ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 text-xs font-extrabold border border-amber-200 mb-4 shadow-2xs">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Perlu Revisi Pembimbing</span>
                  </div>
                ) : bannerStatus === 'pending' ? (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-[#E50914] text-xs font-extrabold border border-red-100/80 mb-4 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
                    <span>Menunggu Review Kurikulum</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-[#E50914] text-xs font-extrabold border border-red-100/80 mb-4 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
                    <span>{viewStage === 4 ? 'Menunggu Finalisasi Desain' : viewStage === 5 ? 'Sesi Mengajar Berlangsung' : 'Tahap Aktif Berjalan'}</span>
                  </div>
                )}

                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Tahap 0{viewStage} • {currentGroup.schoolName}
                </span>

                {/* Dynamic Title per Stage */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {viewStage === 1 || viewStage === 2
                    ? 'Struktur & Peran Tim'
                    : viewStage === 3
                    ? 'Modul Ajar & Slide PPT'
                    : viewStage === 4
                    ? 'X-Banner (60x160 cm)'
                    : viewStage === 5
                    ? 'Pelaksanaan & QR Feedback'
                    : 'Laporan Akhir & Publikasi'}
                </h2>

                {/* Dynamic Description per Stage */}
                <p className="text-xs sm:text-sm text-slate-500 mt-3 leading-relaxed">
                  {isArchiveMode
                    ? 'Seluruh artefak berkas pada tahap ini telah rampung, diverifikasi, dan diarsipkan untuk kebutuhan pertanggungjawaban.'
                    : bannerStatus === 'revision'
                    ? bannerFeedback || 'Catatan dari Guru Pembimbing: Mohon periksa catatan revisi dan unggah perbaikan.'
                    : bannerStatus === 'approved'
                    ? 'Berkas telah disetujui resmi oleh Admin Kurikulum. Desain siap untuk dicetak fisik dan dipasang di sekolah mitra.'
                    : bannerStatus === 'pending'
                    ? 'Berkas telah berhasil dikirimkan ke Admin Kurikulum. Sedang dalam antrean verifikasi teknis.'
                    : (viewStage === 4
                      ? 'Media promosi visual utama yang dipajang di gerbang aula SMP mitra saat kedatangan regu relawan SMK Telkom Sidoarjo.'
                      : viewStage === 5
                      ? 'Pendampingan langsung di laboratorium komputer sekolah mitra. Siswa dan guru SMP memindai QR code evaluasi kepuasan.'
                      : 'Kompilasi dokumentasi, rekap skor kepuasan siswa SMP, bukti karya digital, dan lembar pertanggungjawaban program.')}
                </p>

                {/* Meta details */}
                <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-500 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#E50914]" />
                    {viewStage <= 2 ? '15 Jan 2026' : viewStage === 3 ? '28 Jan 2026' : viewStage === 4 ? '15 Feb 2026' : viewStage === 5 ? '18–25 Feb 2026' : '28 Feb 2026'}
                  </span>
                  <span>•</span>
                  <span className="text-slate-400">
                    {viewStage === 4 ? 'Standar Cetak 300 DPI' : viewStage === 5 ? 'Laboratorium Komputer' : 'Fase D Kurikulum'}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Adapts to Active vs Archive Mode */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                {isArchiveMode || bannerStatus === 'approved' ? (
                  <>
                    <button
                      onClick={() => showToast(`Mengunduh berkas resmi Tahap 0${viewStage} yang telah disahkan...`, 'success')}
                      className="px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh Berkas Disetujui</span>
                    </button>
                    {viewStage === 4 && (
                      <button
                        onClick={() => setIsBannerModalOpen(true)}
                        className="text-xs font-bold text-slate-600 hover:text-[#E50914] transition-colors flex items-center gap-1.5 cursor-pointer py-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Pratinjau Desain Cetak</span>
                      </button>
                    )}
                  </>
                ) : bannerStatus === 'revision' ? (
                  <>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="px-7 py-3.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Unggah Revisi</span>
                    </button>
                    {viewStage === 4 && (
                      <button
                        onClick={() => setIsBannerModalOpen(true)}
                        className="text-xs font-bold text-slate-600 hover:text-[#E50914] transition-colors flex items-center gap-1.5 cursor-pointer py-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Lihat Berkas Sebelumnya</span>
                      </button>
                    )}
                  </>
                ) : bannerStatus === 'pending' ? (
                  <>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="px-7 py-3.5 rounded-full bg-[#E50914] hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Unggah Versi Baru</span>
                    </button>
                    {viewStage === 4 && (
                      <button
                        onClick={() => setIsBannerModalOpen(true)}
                        className="text-xs font-bold text-slate-600 hover:text-[#E50914] transition-colors flex items-center gap-1.5 cursor-pointer py-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Pratinjau Berkas</span>
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="px-7 py-3.5 rounded-full bg-[#E50914] hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md shadow-red-500/25 flex items-center gap-2 cursor-pointer group/btn"
                    >
                      <Upload className="w-4 h-4 group-hover/btn:-translate-y-0.5 transition-transform" />
                      <span>
                        {viewStage === 4 ? 'Unggah Desain' : viewStage === 5 ? 'Unggah Berita Acara' : 'Unggah Dokumen'}
                      </span>
                    </button>

                    {viewStage === 5 ? (
                      <button
                        onClick={handleCopySurvey}
                        className="text-xs font-bold text-slate-600 hover:text-[#E50914] transition-colors flex items-center gap-1.5 cursor-pointer py-2"
                      >
                        {copiedSurvey ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedSurvey ? 'Tersalin!' : 'Salin Link Kuesioner'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => showToast(`Mengunduh template resmi Tahap 0${viewStage}...`, 'info')}
                        className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5 cursor-pointer py-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Unduh Template</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 3. Visual Element (Right ~40%) - Dynamic Isometric Perspective & Edge Bleed */}
            <div className="relative w-full md:w-[42%] h-72 md:h-full flex items-center justify-center md:justify-end pointer-events-none select-none mt-6 md:mt-0 overflow-hidden">
              <div
                className="relative w-48 sm:w-60 md:w-72 h-[320px] sm:h-[370px] md:h-[390px] transition-transform duration-700 ease-out group-hover:scale-105"
                style={{
                  perspective: '1200px',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Ambient Shadow */}
                <div
                  className="absolute inset-0 rounded-[28px] bg-red-950/20 blur-2xl transform translate-x-10 translate-y-14 scale-90 -rotate-6"
                  style={{ opacity: 0.6 }}
                />

                {/* ─── DYNAMIC ISOMETRIC CARD MOCKUP ─── */}
                <div
                  className="relative w-full h-full rounded-[26px] bg-gradient-to-b from-[#E50914] via-[#B80F1A] to-[#18181B] text-white p-5 flex flex-col justify-between shadow-2xl border border-white/20 overflow-hidden"
                  style={{
                    transform: 'perspective(1000px) rotateY(-18deg) rotateX(10deg) rotateZ(3deg) skewY(-3deg) translate(16px, 32px)',
                    boxShadow: '0 25px 50px -12px rgba(184, 15, 26, 0.4), 0 12px 24px -8px rgba(0,0,0,0.3)',
                  }}
                >
                  {/* Top metallic bar */}
                  <div className="absolute top-0 inset-x-0 h-3.5 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 border-b border-black/20 flex items-center justify-center">
                    <div className="w-12 h-1 bg-slate-400/60 rounded-full" />
                  </div>

                  {/* Glossy light reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

                  {/* Header */}
                  <div className="pt-2 relative z-10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/30">
                        SKOMDA 2026
                      </span>
                      <span className="text-[9px] font-mono tracking-wider opacity-80 bg-black/30 px-2 py-0.5 rounded">
                        TAHAP 0{viewStage}
                      </span>
                    </div>

                    <div className="pt-1">
                      <span className="text-[9px] font-bold text-red-200 tracking-wider uppercase block truncate">
                        {currentGroup.schoolName}
                      </span>
                      <h3 className="text-base sm:text-lg font-black leading-tight tracking-tight text-white drop-shadow-sm">
                        {viewStage <= 2
                          ? 'DIVISI RELAWAN TIM'
                          : viewStage === 3
                          ? 'MODUL FASE D INFORMATIKA'
                          : viewStage === 4
                          ? 'LITERASI DIGITAL & KREATIF'
                          : viewStage === 5
                          ? 'QR FEEDBACK SISWA SMP'
                          : 'LEMBAR LPJ RESMI 2026'}
                      </h3>
                    </div>
                  </div>

                  {/* Mid Mockup Visual: Dynamic per stage */}
                  <div className="relative z-10 my-auto py-2">
                    {viewStage === 5 ? (
                      /* Live QR Code Scanner Visual */
                      <div className="w-full h-28 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 p-3 flex items-center justify-between relative overflow-hidden">
                        <div className="w-20 h-20 bg-white rounded-xl p-1.5 shadow-md flex items-center justify-center">
                          <QrCode className="w-full h-full text-slate-900" />
                        </div>
                        <div className="flex-1 pl-3 text-left space-y-1">
                          <span className="text-[9px] font-bold text-yellow-300 block">Pindai Evaluasi</span>
                          <p className="text-[10px] text-white/90 leading-tight">Google Form Siswa</p>
                          <span className="text-[8px] text-emerald-300 font-mono block">Aktif di Lab</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 p-3 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/15 rounded-full blur-md" />
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-red-100">
                            {viewStage <= 2 ? 'Struktur Organisasi' : viewStage === 3 ? 'Slide Master 16:9' : viewStage === 4 ? 'Banner 60×160' : 'Sertifikasi Akhir'}
                          </span>
                          <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                        </div>
                        <p className="text-[10px] text-white/90 font-medium leading-snug">
                          {viewStage <= 2
                            ? `${members.length} Siswa Relawan Terdaftar`
                            : viewStage === 3
                            ? 'Silabus Komputasi Kreatif'
                            : viewStage === 4
                            ? 'Desain DKV & Panduan Cetak'
                            : 'Dokumentasi & Rekap Skor 4.8/5'}
                        </p>
                        <div className="flex items-center gap-1 text-[8px] text-white/70">
                          <span>SMK Telkom Sidoarjo</span>
                          <span>•</span>
                          <span>Informatika</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom details */}
                  <div className="relative z-10 pt-2 border-t border-white/15 flex items-center justify-between text-[9px] font-mono opacity-90">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{isArchiveMode ? 'Arsip Terverifikasi' : 'Fase Berjalan'}</span>
                    </div>
                    <span>Kelompok {currentGroup.number}</span>
                  </div>

                  {/* Bottom roll base */}
                  <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 border-t border-black/30 flex items-center justify-center">
                    <div className="w-16 h-1.5 bg-slate-500/70 rounded-full" />
                  </div>
                </div>

                {/* Tripod Stand Legs */}
                <div
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-6 flex justify-between pointer-events-none"
                  style={{
                    transform: 'perspective(1000px) rotateY(-18deg) rotateX(10deg) rotateZ(3deg) translate(16px, 32px)',
                  }}
                >
                  <div className="w-1.5 h-6 bg-slate-500 rounded-full transform -rotate-25 shadow-md" />
                  <div className="w-2 h-6 bg-slate-600 rounded-full shadow-md" />
                  <div className="w-1.5 h-6 bg-slate-500 rounded-full transform rotate-25 shadow-md" />
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              BENTO CARD 2: ADVISOR NOTES (Col span 5, Row span 1)
              (DYNAMIC FEEDBACK & INSTRUCTIONS PER STAGE)
          ══════════════════════════════════════════════════════════════════════ */}
          <div className="md:col-span-5 bg-white rounded-[32px] p-6 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-50 text-[#E50914] flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Catatan Pembimbing
                  </h3>
                  <span className="text-[10px] text-slate-400">Tahap 0{viewStage} Arahan</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Terverifikasi</span>
            </div>

            <div className="my-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100/80">
              <p className="text-xs text-slate-700 italic leading-relaxed">
                {bannerFeedback ? `"${bannerFeedback}"` : supervisorMemo ? `"${supervisorMemo}"` : '"Harap perhatikan seluruh ketentuan teknis modul dan koordinasi aktif bersama guru pembimbing lapangan."'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E50914] text-white flex items-center justify-center font-bold text-[11px] shadow-2xs">
                  BH
                </div>
                <div>
                  <p className="font-bold text-slate-900 leading-none">{currentGroup.mentorName}</p>
                  <span className="text-[10px] text-slate-400">Guru Pembimbing Lapangan</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                Disahkan
              </span>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              BENTO CARD 3: QUICK ASSETS ACTION GRID (Col span 5, Row span 1)
              (DYNAMIC PER STAGE ASSETS)
          ══════════════════════════════════════════════════════════════════════ */}
          <div className="md:col-span-5 bg-white rounded-[32px] p-6 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Aset Resmi Tahap 0{viewStage}
              </h3>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-bold">
                EDISI 2026
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-2">
              <button
                onClick={() => showToast('Mengunduh berkas aset utama...', 'info')}
                className="p-3.5 rounded-2xl bg-[#F0F2F5] hover:bg-red-50 hover:text-[#E50914] group flex flex-col justify-between h-20 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <Presentation className="w-4 h-4 text-slate-500 group-hover:text-[#E50914] transition-colors" />
                  <Download className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-800 group-hover:text-[#E50914] block leading-none">
                    {viewStage <= 2 ? 'SK Tim' : viewStage === 3 ? 'Slide PPTX' : viewStage === 4 ? 'Slide PPTX' : viewStage === 5 ? 'Presensi SMP' : 'Format LPJ'}
                  </span>
                  <span className="text-[10px] text-slate-400">Format Resmi</span>
                </div>
              </button>

              <button
                onClick={() => showToast('Mengunduh logo & grafis...', 'info')}
                className="p-3.5 rounded-2xl bg-[#F0F2F5] hover:bg-red-50 hover:text-[#E50914] group flex flex-col justify-between h-20 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <Layers className="w-4 h-4 text-slate-500 group-hover:text-[#E50914] transition-colors" />
                  <Download className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-800 group-hover:text-[#E50914] block leading-none">
                    {viewStage <= 2 ? 'Form Kontak' : viewStage === 3 ? 'Silabus Fase D' : viewStage === 4 ? 'Logo Vektor' : viewStage === 5 ? 'Berita Acara' : 'Rubrik Nilai'}
                  </span>
                  <span className="text-[10px] text-slate-400">Vektor & Form</span>
                </div>
              </button>

              <button
                onClick={() => showToast('Mengunduh standar acuan...', 'info')}
                className="p-3.5 rounded-2xl bg-[#F0F2F5] hover:bg-red-50 hover:text-[#E50914] group flex flex-col justify-between h-20 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <Printer className="w-4 h-4 text-slate-500 group-hover:text-[#E50914] transition-colors" />
                  <Download className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-800 group-hover:text-[#E50914] block leading-none">
                    {viewStage <= 2 ? 'Jadwal Briefing' : viewStage === 3 ? 'Rubrik Kuis' : viewStage === 4 ? 'Standar Cetak' : viewStage === 5 ? 'Form Feedback' : 'Surat Tugas'}
                  </span>
                  <span className="text-[10px] text-slate-400">PDF Acuan</span>
                </div>
              </button>

              <button
                onClick={() => showToast('Membuka modul panduan...', 'info')}
                className="p-3.5 rounded-2xl bg-[#F0F2F5] hover:bg-red-50 hover:text-[#E50914] group flex flex-col justify-between h-20 transition-all text-left cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <BookOpen className="w-4 h-4 text-slate-500 group-hover:text-[#E50914] transition-colors" />
                  <Download className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-800 group-hover:text-[#E50914] block leading-none">
                    {viewStage <= 2 ? 'Buku Saku' : viewStage === 3 ? 'Panduan Ajar' : viewStage === 4 ? 'Panduan DKV' : viewStage === 5 ? 'ID Card Tamu' : 'Sertifikat'}
                  </span>
                  <span className="text-[10px] text-slate-400">Pedoman Tim</span>
                </div>
              </button>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              BENTO CARD 4: TEAM / PROGRESS CARD (Col span 4, Row span 1)
              (DARK CONTRAST CARD #18181B)
          ══════════════════════════════════════════════════════════════════════ */}
          <div className="md:col-span-4 bg-[#18181B] text-white rounded-[32px] p-6 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-white/10 px-3 py-1 rounded-full">
                {viewStage <= 2 ? 'Verifikasi Relawan' : viewStage === 3 ? 'Penyusunan Modul' : viewStage === 4 ? 'Status Feed IG' : viewStage === 5 ? 'Kehadiran Siswa' : 'Skor Kepuasan SMP'}
              </span>
              <Share2 className="w-4 h-4 text-slate-400" />
            </div>

            <div className="my-3 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {viewStage <= 2
                    ? `${totalMembers} / ${totalMembers} Valid`
                    : viewStage === 3
                    ? '4 / 4 Bab Siap'
                    : viewStage === 4
                    ? `${validCount} / ${totalMembers} Siap`
                    : viewStage === 5
                    ? `${totalMembers} / ${totalMembers} Hadir`
                    : '4.8 / 5.0 Sangat Puas'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {viewStage <= 2 ? 'Verifikasi dapodik siswa' : viewStage === 4 ? 'Twibbon publikasi feed IG' : viewStage === 5 ? 'Presensi tepat waktu' : 'Rata-rata rating 40 siswa'}
                </p>

                {/* Overlapping Avatar Group */}
                <div className="flex items-center -space-x-2 mt-3">
                  {members.slice(0, 5).map((m) => (
                    <div
                      key={m.id}
                      className="w-7 h-7 rounded-full bg-slate-800 border-2 border-[#18181B] text-[10px] font-bold flex items-center justify-center text-white"
                      title={m.name}
                    >
                      {m.name.charAt(0)}
                    </div>
                  ))}
                  {members.length > 5 && (
                    <div className="w-7 h-7 rounded-full bg-[#E50914] border-2 border-[#18181B] text-[10px] font-bold flex items-center justify-center text-white">
                      +{members.length - 5}
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Ring */}
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" stroke="#27272A" strokeWidth="4.5" fill="none" />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke={viewStage === 4 ? '#E50914' : '#10B981'}
                    strokeWidth="4.5"
                    strokeDasharray="125.6"
                    strokeDashoffset={viewStage === 4 ? 125.6 - (125.6 * igProgressPercent) / 100 : 0}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <span className="absolute text-xs font-black text-white">
                  {viewStage === 4 ? `${igProgressPercent}%` : '100%'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowMembersModal(true)}
              className="text-xs font-bold text-red-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer w-fit group"
            >
              <span>{viewStage === 4 ? 'Lihat Detail' : 'Kelola Anggota'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              BENTO CARD 5: LOCATION / PHOTO CARD (Col span 4, Row span 1)
              (DYNAMIC DOCUMENTATION PER STAGE)
          ══════════════════════════════════════════════════════════════════════ */}
          <div className="md:col-span-4 bg-white rounded-[32px] p-6 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  {viewStage <= 2 ? 'Foto Briefing Awal' : viewStage === 5 ? 'Dokumentasi Mengajar' : viewStage === 6 ? 'Galeri Karya Terbaik' : 'Dokumentasi Survei'}
                </h3>
                <span className="text-[10px] text-slate-400">{currentGroup.schoolName}</span>
              </div>
              <MapPin className="w-4 h-4 text-[#E50914]" />
            </div>

            <div className="grid grid-cols-3 gap-2.5 my-3">
              {photosList.slice(0, 2).map((photo) => (
                <div
                  key={photo.id}
                  className="relative aspect-square rounded-2xl overflow-hidden group/thumb border border-slate-100"
                >
                  <img
                    src={photo.img}
                    alt={photo.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = IMAGE_FALLBACK;
                    }}
                    className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2 text-white">
                    <span className="text-[9px] font-bold leading-tight truncate">
                      {photo.tag}
                    </span>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setShowAddPhotoModal(true)}
                className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#E50914] hover:bg-red-50 text-slate-400 hover:text-[#E50914] flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
                title="Tambah Foto Dokumentasi"
              >
                <Plus className="w-5 h-5" />
                <span className="text-[10px] font-bold">+ Tambah</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span className="text-[11px] font-medium">{photosList.length} Foto Dokumentasi</span>
              <button
                onClick={() => setShowAddPhotoModal(true)}
                className="text-xs font-bold text-[#E50914] hover:underline cursor-pointer"
              >
                Kelola Foto
              </button>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              BENTO CARD 6: TASK BOARD SUMMARY (Col span 4, Row span 1)
              (SOFT RED CARD BG-RED-50)
          ══════════════════════════════════════════════════════════════════════ */}
          <div className="md:col-span-4 bg-red-50 border border-red-100 rounded-[32px] p-6 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-red-100/60">
              <div className="flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-[#E50914]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Papan Kerja
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#E50914] uppercase">Tahap 0{viewStage}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-3">
              <div className="bg-white/80 rounded-2xl p-3 border border-red-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  To Do
                </span>
                <span className="text-xl font-black text-[#E50914]">
                  {isArchiveMode ? '0 Prioritas' : `${todoTasks.length || 1} Prioritas`}
                </span>
              </div>
              <div className="bg-white/80 rounded-2xl p-3 border border-red-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  In Progress
                </span>
                <span className="text-xl font-black text-amber-600">
                  {isArchiveMode ? '0 Proses' : `${inProgressTasks.length || 1} Proses`}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500 font-medium">
                {isArchiveMode ? 'Semua Tugas Selesai' : `${doneTasks.length || 4} Tugas Selesai`}
              </span>
              <button
                onClick={() => setShowKanbanModal(true)}
                className="px-4 py-2 rounded-full bg-[#E50914] hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>Buka Kanban</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          MODAL 1: KANBAN SPRINT BOARD (INTERACTIVE FULL VIEW)
      ══════════════════════════════════════════════════════════════════════════ */}
      {showKanbanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-4xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E50914]">
                  Tahap 0{viewStage} • Papan Kanban Kelompok {currentGroup.number}
                </span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Manajemen Tugas & Sprint Tim
                </h3>
              </div>
              <button
                onClick={() => setShowKanbanModal(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!isArchiveMode && (
              <form onSubmit={handleCreateTask} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tambahkan tugas sprint baru..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:border-[#E50914]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#E50914] text-white font-bold text-xs rounded-2xl hover:bg-red-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah</span>
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between font-bold text-xs text-slate-700 pb-2 border-b border-slate-200">
                  <span>To Do</span>
                  <span className="bg-red-100 text-[#E50914] px-2 py-0.5 rounded-full text-[10px]">
                    {todoTasks.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {todoTasks.map((t) => (
                    <div key={t.id} className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                      <p className="text-xs font-bold text-slate-800">{t.title}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{t.assignee}</span>
                        {!isArchiveMode && (
                          <button
                            onClick={() => moveTaskColumn(t.id, 'in_progress')}
                            className="text-[#E50914] font-bold hover:underline cursor-pointer"
                          >
                            Mulai →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {todoTasks.length === 0 && (
                    <div className="py-6 text-center text-xs text-slate-400 font-medium">
                      Tidak ada tugas to do
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between font-bold text-xs text-slate-700 pb-2 border-b border-slate-200">
                  <span>Dalam Proses</span>
                  <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px]">
                    {inProgressTasks.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {inProgressTasks.map((t) => (
                    <div key={t.id} className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                      <p className="text-xs font-bold text-slate-800">{t.title}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{t.assignee}</span>
                        {!isArchiveMode && (
                          <button
                            onClick={() => moveTaskColumn(t.id, 'done')}
                            className="text-emerald-600 font-bold hover:underline cursor-pointer"
                          >
                            Selesai ✓
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {inProgressTasks.length === 0 && (
                    <div className="py-6 text-center text-xs text-slate-400 font-medium">
                      Tidak ada tugas dalam proses
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between font-bold text-xs text-slate-700 pb-2 border-b border-slate-200">
                  <span>Selesai</span>
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px]">
                    {doneTasks.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {doneTasks.map((t) => (
                    <div key={t.id} className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1 opacity-90">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <p className="text-xs font-bold text-slate-700 line-through">{t.title}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 block pl-5">{t.assignee}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          MODAL 2: DETAIL ANGGOTA TIM & VERIFIKASI
      ══════════════════════════════════════════════════════════════════════════ */}
      {showMembersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-lg p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E50914]">
                  Kelompok {currentGroup.number} • {currentGroup.schoolName}
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Anggota Regu & Status Verifikasi
                </h3>
              </div>
              <button
                onClick={() => setShowMembersModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {members.map((m) => {
                const isValid = m.status === 'valid';
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      if (!isArchiveMode) {
                        toggleMemberStatus(m.id);
                      }
                    }}
                    className={`p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between transition-colors ${
                      !isArchiveMode ? 'hover:border-slate-300 cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${isValid ? 'bg-emerald-600' : 'bg-slate-400'}`}>
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{m.name}</p>
                        <span className="text-[10px] text-slate-400">{m.role || 'Siswa Relawan'}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${isValid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {isValid ? 'Terverifikasi ✓' : 'Belum Unggah'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowMembersModal(false)}
                className="px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          MODAL 3: UNGGAH DOKUMEN / DESAIN
      ══════════════════════════════════════════════════════════════════════════ */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-md p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                Unggah Berkas Tahap 0{viewStage}
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Tautan File (Google Drive / Cloud Storage)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/..."
                  value={uploadFileUrl}
                  onChange={(e) => setUploadFileUrl(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-2xl focus:border-[#E50914] focus:outline-none"
                />
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-[11px] leading-relaxed">
                💡 Berkas akan otomatis masuk ke Antrean Review Admin Kurikulum & Guru Pembimbing untuk verifikasi teknis.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#E50914] hover:bg-red-700 text-white font-bold cursor-pointer"
                >
                  Kirim Berkas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          MODAL 4: TAMBAH FOTO DOKUMENTASI
      ══════════════════════════════════════════════════════════════════════════ */}
      {showAddPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Tambah Foto Dokumentasi Lapangan</h3>
              <button
                onClick={() => setShowAddPhotoModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddPhoto} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">URL Gambar / Foto Dokumentasi</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-2xl focus:border-[#E50914] focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPhotoModal(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#E50914] hover:bg-red-700 text-white font-bold cursor-pointer"
                >
                  Simpan Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
