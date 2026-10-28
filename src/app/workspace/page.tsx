"use client";
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const WorkspacePage: React.FC = () => {
  const {
    navigate,
    members,
    toggleMemberStatus,
    sprintTasks,
    moveTaskColumn,
    addTask,
    bannerStatus,
    supervisorMemo,
    showMemoToLeader,
    setIsBannerModalOpen,
    showToast
  } = useApp();

  const [reminderSent, setReminderSent] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [photosList, setPhotosList] = useState([
    {
      id: 'p1',
      title: 'Ruang Lab Komputer',
      tag: '01 Lab Komp',
      subtext: 'Kapasitas 36 Siswa',
      img: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'p2',
      title: 'Gerbang Utama SMPN 1',
      tag: '02 Gerbang',
      subtext: 'Titik Pasang Banner',
      img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'p3',
      title: 'Ruang Guru & Koordinasi',
      tag: '03 R. Guru',
      subtext: 'Ruang Transit Pemateri',
      img: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&auto=format&fit=crop&q=80'
    }
  ]);

  const validCount = members.filter((m) => m.status === 'valid').length;
  const pendingCount = members.length - validCount;

  const handleSendReminder = () => {
    setReminderSent(true);
    showToast(`Pesan pengingat otomatis telah dikirim ke ${pendingCount} anggota via WhatsApp!`, 'success');
    setTimeout(() => setReminderSent(false), 3000);
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl) return;
    setPhotosList([
      ...photosList,
      {
        id: `p-${Date.now()}`,
        title: 'Dokumentasi Tambahan',
        tag: `0${photosList.length + 1} Foto Baru`,
        subtext: 'Verifikasi Tim',
        img: newPhotoUrl
      }
    ]);
    setNewPhotoUrl('');
    setShowAddPhotoModal(false);
    showToast('Foto dokumentasi survei berhasil ditambahkan!', 'success');
  };

  return (
    <div className="w-full min-h-screen bg-[#f9f9f9] text-[#1a1c1c] font-sans antialiased flex h-screen overflow-hidden">
      {/* ================= 1. PERSISTENT LEFT SIDEBAR (~260px) ================= */}
      <aside className="w-64 shrink-0 h-screen bg-white border-r border-slate-200 flex flex-col justify-between z-30 select-none">
        <div className="flex flex-col min-h-0">
          {/* Brand Lockup */}
          <div className="p-5 border-b border-slate-200 space-y-2">
            <button onClick={() => navigate('/')} className="block text-left cursor-pointer">
              <span className="text-[17px] font-extrabold uppercase tracking-tight text-slate-900 hover:text-[#b4000c] transition-colors italic">
                #SKOMDA MENGAJAR
              </span>
            </button>
            <div className="inline-block -rotate-2 origin-left">
              <span className="bg-[#e20113] text-white text-[10px] uppercase px-2 py-0.5 rounded-full font-bold tracking-wider">
                #IMPACT2026 / TELKOM SIDOARJO
              </span>
            </div>
          </div>

          {/* Group Info Card */}
          <div className="p-3.5 mx-3 mt-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#b4000c] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                03
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase font-extrabold text-slate-900 truncate">Kelompok 03</p>
                <p className="text-[11px] text-slate-500 truncate">SMPN 1 Buduran</p>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono uppercase">Status:</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-[#b4000c] font-bold uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b4000c] animate-pulse"></span>
                Fase Aktif
              </span>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-xs uppercase tracking-wider font-semibold text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-slate-400">grid_view</span>
              <span>Beranda Publik</span>
            </button>

            {/* Alur Pelaksanaan (ACTIVE) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-red-50 text-[#b4000c] text-xs uppercase tracking-wider font-bold border-l-[3px] border-[#b4000c]">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px]">alt_route</span>
                  <span>Alur Pelaksanaan</span>
                </div>
                <span className="text-[9px] bg-[#b4000c] text-white px-1.5 py-0.2 rounded font-bold">04</span>
              </div>

              {/* Sub-steps drawer indicator */}
              <div className="ml-4 pl-4 border-l border-slate-200 py-1 space-y-1 text-[11px]">
                <div className="flex items-center gap-2 text-slate-400 py-0.5">
                  <span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span>
                  <span className="line-through">01 Bentuk Kelompok</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 py-0.5">
                  <span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span>
                  <span className="line-through">02 Pilih Ketua</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 py-0.5">
                  <span className="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span>
                  <span className="line-through">03 Susun Materi</span>
                </div>
                <div className="flex items-center gap-2 text-[#b4000c] font-bold py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b4000c]"></span>
                  <span>04 Siapkan Desain</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 opacity-60 py-0.5">
                  <span className="material-symbols-outlined text-[13px]">lock</span>
                  <span>05 Mengajar di SMP</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 opacity-60 py-0.5">
                  <span className="material-symbols-outlined text-[13px]">lock</span>
                  <span>06 Evaluasi & LPJ</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => showToast('Membuka Ruang Diskusi Kelompok 03', 'info')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-xs uppercase tracking-wider font-semibold text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-slate-400">workspaces</span>
              <span>Ruang Kerja Kelompok</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('instagram-members-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-xs uppercase tracking-wider font-semibold text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px] text-slate-400">groups</span>
                <span>Anggota Tim</span>
              </div>
              <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-bold">
                {members.length}
              </span>
            </button>

            <button
              onClick={() => navigate('/admin')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-xs uppercase tracking-wider font-semibold text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-slate-400">monitoring</span>
              <span>Lihat Panel Admin</span>
            </button>
          </nav>
        </div>

        {/* Bottom Profile */}
        <div className="p-3.5 border-t border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#b4000c] flex items-center justify-center text-white text-xs font-bold shrink-0">
                NP
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-900 font-bold truncate">Nabila Putri</p>
                <p className="text-[10px] text-slate-400 truncate">Ketua Kelompok 03</p>
              </div>
            </div>
            <button
              onClick={() => {
                navigate('/login');
                showToast('Keluar dari sesi ketua', 'info');
              }}
              className="p-1.5 rounded hover:bg-slate-200 text-slate-400 hover:text-[#b4000c] transition-colors shrink-0 cursor-pointer"
              title="Keluar"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ================= 2. MAIN VIEWPORT ================= */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-slate-50/50">
        {/* Top Bar */}
        <header className="h-16 shrink-0 bg-white border-b border-slate-200 px-6 lg:px-8 flex items-center justify-between gap-4 z-20">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-[#b4000c] transition-colors text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Alur Utama</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">Pelaksanaan</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs uppercase tracking-wider text-slate-900 font-bold truncate">
              Tahap 04: Siapkan Desain
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px] text-[#b4000c]">hourglass_top</span>
              <span className="text-slate-800">4 Hari Tersisa</span>
              <span className="text-slate-400 text-[11px]">(Tenggat: 15 Feb)</span>
            </div>

            <button
              onClick={() => showToast('Tidak ada notifikasi mendesak baru', 'info')}
              className="relative p-2 rounded-lg hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#b4000c]"></span>
            </button>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b4000c] animate-pulse"></span>
              <span className="text-[10px] text-[#b4000c] uppercase font-bold tracking-wider">
                Tahap Aktif
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-6 lg:px-10 py-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-20">
            {/* Step Header Section */}
            <section className="pb-6 border-b border-slate-200">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="flex items-start gap-5 max-w-3xl">
                  <div className="shrink-0 select-none">
                    <span className="text-6xl md:text-8xl font-light text-slate-300 leading-none">04</span>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 uppercase tracking-tight">
                        Siapkan Desain
                      </h1>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b4000c] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b4000c]"></span>
                        </span>
                        <span className="text-[10px] text-[#b4000c] uppercase font-bold tracking-widest">
                          Tahap Aktif
                        </span>
                      </div>
                      <span className="bg-[#b4000c] text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                        Wajib Cetak
                      </span>
                    </div>

                    <p className="text-sm md:text-base text-slate-600 font-medium">
                      Kelompok 3 • SMPN 1 Buduran{' '}
                      <span className="mx-2 text-slate-300">/</span>
                      <span className="text-slate-500 text-xs">Pembimbing: Dra. Sri Wahyuni, M.Pd</span>
                    </p>
                  </div>
                </div>

                {/* Right side: Countdown Ring & Metrics */}
                <div className="flex items-center gap-5 self-start lg:self-end bg-white px-5 py-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
                      <circle cx="24" cy="24" fill="none" r="20" stroke="#f1f5f9" strokeWidth="4"></circle>
                      <circle
                        cx="24"
                        cy="24"
                        fill="none"
                        r="20"
                        stroke="#b4000c"
                        strokeDasharray="125.6"
                        strokeDashoffset="62.8"
                        strokeLinecap="round"
                        strokeWidth="4"
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xs font-bold text-slate-900 leading-none">4H</span>
                      <span className="text-[8px] text-slate-400 font-mono uppercase mt-0.5">Sisa</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[10px] font-mono uppercase text-slate-400">Tenggat Waktu:</span>
                      <span className="text-xs font-bold text-slate-900">15 Feb 2026</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#b4000c] rounded-full" style={{ width: '50%' }}></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 uppercase">Item: 2/4 (50%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Stepper horizontal line */}
            <section className="py-4 bg-white border border-slate-200 rounded-xl p-5 overflow-x-auto shadow-2xs">
              <div className="min-w-[760px] flex items-center justify-between relative px-4">
                <div className="absolute top-4 left-8 right-8 h-[2px] bg-slate-100 -z-0"></div>
                <div className="absolute top-4 left-8 w-[55%] h-[2px] bg-[#b4000c] -z-0"></div>

                <div className="flex flex-col items-center gap-2 z-10">
                  <div className="w-8 h-8 rounded-full bg-[#b4000c] text-white flex items-center justify-center text-xs">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 uppercase">01 Bentuk Kelompok</span>
                </div>

                <div className="flex flex-col items-center gap-2 z-10">
                  <div className="w-8 h-8 rounded-full bg-[#b4000c] text-white flex items-center justify-center text-xs">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 uppercase">02 Pilih Ketua</span>
                </div>

                <div className="flex flex-col items-center gap-2 z-10">
                  <div className="w-8 h-8 rounded-full bg-[#b4000c] text-white flex items-center justify-center text-xs">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 uppercase">03 Susun Materi</span>
                </div>

                <div className="flex flex-col items-center gap-2 z-10">
                  <div className="w-8 h-8 rounded-full bg-[#b4000c] text-white ring-4 ring-red-100 flex items-center justify-center text-xs font-bold">
                    04
                  </div>
                  <span className="text-[10px] font-extrabold text-[#b4000c] uppercase">04 Siapkan Desain</span>
                </div>

                <div className="flex flex-col items-center gap-2 z-10 opacity-60">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs">
                    <span className="material-symbols-outlined text-[15px]">lock</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 uppercase">05 Mengajar di SMP</span>
                </div>

                <div className="flex flex-col items-center gap-2 z-10 opacity-60">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs">
                    <span className="material-symbols-outlined text-[15px]">flag</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 uppercase">06 Evaluasi & LPJ</span>
                </div>
              </div>
            </section>

            {/* Main Content Grid 8:4 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT COLUMN (8) */}
              <div className="lg:col-span-8 flex flex-col gap-8">
                {/* Berkas 01: X-Banner Publikasi */}
                <div className="p-6 md:p-8 rounded-xl bg-white border border-slate-200 flex flex-col gap-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#b4000c] font-bold uppercase">BERKAS 01</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">PUBLIKASI OFFLINE</span>
                      </div>
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-1">
                        X-Banner Publikasi (60×160 cm)
                      </h2>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg self-start">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          bannerStatus === 'approved'
                            ? 'bg-emerald-500'
                            : bannerStatus === 'revision'
                            ? 'bg-amber-500'
                            : 'bg-amber-400'
                        }`}
                      />
                      <span className="text-[10px] font-bold uppercase text-slate-800">
                        {bannerStatus === 'approved'
                          ? 'Telah Disetujui Admin'
                          : bannerStatus === 'revision'
                          ? 'Perlu Revisi Desain'
                          : 'Menunggu Finalisasi'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Thumbnail Frame */}
                    <div className="md:col-span-4 flex justify-center">
                      <div
                        onClick={() => setIsBannerModalOpen(true)}
                        className="relative w-36 h-72 bg-slate-100 border border-slate-300 rounded-lg overflow-hidden flex flex-col items-center justify-between p-3 group cursor-pointer shadow-inner hover:ring-2 hover:ring-[#b4000c] transition-all"
                      >
                        <div className="w-full flex items-center justify-between text-[8px] font-bold">
                          <span className="text-[#b4000c]">#SKOMDA</span>
                          <span className="text-slate-400">VOL.03</span>
                        </div>

                        <div className="text-center space-y-1 my-auto">
                          <div className="w-12 h-12 mx-auto rounded-full bg-red-100 flex items-center justify-center text-[#b4000c] mb-2">
                            <span className="material-symbols-outlined text-[24px]">school</span>
                          </div>
                          <p className="text-[10px] text-slate-900 uppercase font-extrabold leading-tight">
                            SMPN 1 BUDURAN
                          </p>
                          <p className="text-[8px] text-slate-500">Workshop Literasi AI</p>
                        </div>

                        <div className="w-full pt-2 border-t border-slate-200 text-center">
                          <span className="text-[7px] text-slate-400 uppercase tracking-widest font-mono">
                            KELOMPOK 03 • 2026
                          </span>
                        </div>

                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-xs text-white font-bold uppercase tracking-wider underline">
                            Pratinjau Full
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Specs, Progress & Trigger */}
                    <div className="md:col-span-8 flex flex-col gap-4">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-xs">
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                          Spesifikasi Percetakan:
                        </span>
                        <p className="text-slate-700 font-medium leading-relaxed">
                          Format cetak: TIFF / PDF High-Res 300 DPI, Ruang Warna CMYK, Bleed 1 cm keliling untuk mata ayam.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 uppercase font-mono text-[10px]">
                            Status Kelayakan Layout
                          </span>
                          <span className="text-xs font-bold text-[#b4000c]">75% Selesai</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#b4000c] rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono">
                          Terakhir diubah oleh Nabila Putri • Hari ini, 10:14 WIB
                        </p>
                      </div>

                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            showToast('Membuka dialog unggah file PDF/TIFF X-Banner...', 'info');
                          }}
                          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[#b4000c] text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-900 transition-colors cursor-pointer shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                          <span>Unggah Desain Banner</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            showToast('Mengunduh template resmi (.AI & .PSD) Skomda Mengajar...', 'info');
                          }}
                          className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">download</span>
                          <span>Unduh Template (.AI / .PSD)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Berkas 02: Feed Instagram */}
                <div id="instagram-members-section" className="p-6 md:p-8 rounded-xl bg-white border border-slate-200 flex flex-col gap-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#b4000c] font-bold uppercase">BERKAS 02</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">PUBLIKASI DIGITAL RESMI</span>
                      </div>
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-1">
                        Feed Instagram / Poster Mandiri
                      </h2>
                    </div>
                    <span className="text-xs font-bold uppercase px-3 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200">
                      {validCount} dari {members.length} Anggota Siap
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Setiap anggota diwajibkan mengunggah teaser kampanye individual berformat carousel rasio 4:5 pada akun media sosial masing-masing dengan tag resmi panitia.
                  </p>

                  {/* 8 Members Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
                    {members.map((m) => {
                      const isValid = m.status === 'valid';
                      return (
                        <div
                          key={m.id}
                          onClick={() => toggleMemberStatus(m.id)}
                          className={`p-3 rounded-lg border flex items-center gap-3 transition-colors cursor-pointer ${
                            isValid
                              ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                              : 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                          }`}
                          title="Klik untuk ubah status verifikasi"
                        >
                          <div className="relative shrink-0">
                            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs">
                              {m.initials}
                            </div>
                            <span
                              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                isValid ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{m.name}</p>
                            <span
                              className={`text-[10px] font-semibold uppercase ${
                                isValid ? 'text-emerald-700' : 'text-amber-800'
                              }`}
                            >
                              {isValid ? 'Diunggah' : 'Menunggu'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 flex items-center justify-between flex-wrap gap-4 border-t border-slate-100">
                    <p className="text-[11px] text-slate-400">
                      Pengingat otomatis via WhatsApp dikirimkan tiap 24 jam sebelum batas pengumpulan.
                    </p>
                    {pendingCount > 0 && (
                      <button
                        type="button"
                        onClick={handleSendReminder}
                        className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-slate-900 hover:bg-[#b4000c] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {reminderSent ? 'check' : 'notifications_active'}
                        </span>
                        <span>{reminderSent ? 'Pengingat Terkirim!' : `Beri Pengingat ${pendingCount} Anggota`}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Referensi Fisik: Dokumentasi Lokasi */}
                <div className="p-6 md:p-8 rounded-xl bg-white border border-slate-200 flex flex-col gap-6 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#b4000c] font-bold uppercase">
                          REFERENSI FISIK
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">VERIFIKASI LAPANGAN</span>
                      </div>
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-1">
                        Dokumentasi Survei Lokasi (SMPN 1 Buduran)
                      </h2>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>Terverifikasi Guru</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {photosList.map((item) => (
                      <div key={item.id} className="flex flex-col gap-2 group">
                        <div className="aspect-[4/3] rounded-lg border border-slate-200 overflow-hidden relative bg-slate-100">
                          <img
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            alt={item.title}
                            src={item.img}
                          />
                          <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur text-white px-1.5 py-0.5 rounded text-[9px] font-mono uppercase">
                            {item.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-800 font-bold truncate">{item.title}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{item.subtext}</span>
                      </div>
                    ))}

                    {/* Add Photo Button */}
                    <button
                      type="button"
                      onClick={() => setShowAddPhotoModal(true)}
                      className="aspect-[4/3] rounded-lg border-2 border-dashed border-slate-300 hover:border-[#b4000c] flex flex-col items-center justify-center gap-1.5 p-3 text-center transition-colors group cursor-pointer bg-slate-50 hover:bg-red-50/20"
                    >
                      <span className="material-symbols-outlined text-[24px] text-slate-400 group-hover:text-[#b4000c]">
                        add_photo_alternate
                      </span>
                      <span className="text-xs uppercase tracking-wider text-slate-700 group-hover:text-[#b4000c] font-bold">
                        + Tambah Foto
                      </span>
                      <span className="text-[9px] text-slate-400">JPG/PNG maks. 5MB</span>
                    </button>
                  </div>
                </div>

                {/* Task Board: Papan Kerja Langkah 04 */}
                <div className="p-6 md:p-8 rounded-xl bg-white border border-slate-200 flex flex-col gap-6 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-mono text-[#b4000c] font-bold uppercase">
                        MANAJEMEN TUGAS INTERNAL
                      </span>
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-1">
                        Papan Kerja Langkah 04
                      </h2>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                      {sprintTasks.length} TUGAS TERJADWAL
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Todo Column */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="text-xs uppercase font-bold text-slate-800">
                          Akan Dikerjakan ({sprintTasks.filter((t) => t.column === 'todo').length})
                        </span>
                        <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                      </div>

                      <div className="space-y-3">
                        {sprintTasks
                          .filter((t) => t.column === 'todo')
                          .map((task) => (
                            <div
                              key={task.id}
                              className="p-3.5 bg-white rounded-lg border border-slate-200 flex flex-col gap-2.5 shadow-2xs"
                            >
                              <span className="text-[9px] text-[#b4000c] font-bold uppercase tracking-wider">
                                Prioritas Tinggi
                              </span>
                              <p className="text-xs font-bold text-slate-800 leading-snug">{task.title}</p>
                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                                <span className="font-semibold text-slate-600">{task.assignee}</span>
                                <button
                                  onClick={() => moveTaskColumn(task.id, 'in_progress')}
                                  className="text-xs text-[#b4000c] font-bold hover:underline cursor-pointer"
                                >
                                  Mulai →
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* In Progress Column */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="text-xs uppercase font-bold text-amber-800">
                          Dalam Proses ({sprintTasks.filter((t) => t.column === 'in_progress').length})
                        </span>
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      </div>

                      <div className="space-y-3">
                        {sprintTasks
                          .filter((t) => t.column === 'in_progress')
                          .map((task) => (
                            <div
                              key={task.id}
                              className="p-3.5 bg-white rounded-lg border border-slate-200 flex flex-col gap-2.5 shadow-2xs"
                            >
                              <span className="text-[9px] text-amber-700 font-bold uppercase tracking-wider">
                                Sedang Direview
                              </span>
                              <p className="text-xs font-bold text-slate-800 leading-snug">{task.title}</p>
                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                                <span className="font-semibold text-slate-600">{task.assignee}</span>
                                <button
                                  onClick={() => moveTaskColumn(task.id, 'done')}
                                  className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
                                >
                                  Tandai Selesai ✓
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Done Column */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="text-xs uppercase font-bold text-emerald-800">
                          Selesai ({sprintTasks.filter((t) => t.column === 'done').length})
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      </div>

                      <div className="space-y-3">
                        {sprintTasks
                          .filter((t) => t.column === 'done')
                          .map((task) => (
                            <div
                              key={task.id}
                              className="p-3.5 bg-white rounded-lg border border-slate-200 flex flex-col gap-2.5 shadow-2xs opacity-80"
                            >
                              <span className="text-[9px] text-emerald-700 font-bold uppercase tracking-wider">
                                Tuntas
                              </span>
                              <p className="text-xs font-semibold text-slate-500 line-through leading-snug">
                                {task.title}
                              </p>
                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                                <span>{task.assignee}</span>
                                <span className="font-mono text-emerald-700 font-bold">10 Feb</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDEBAR COLUMN (4) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {/* Announcement Card */}
                <div className="p-6 rounded-xl bg-white border border-slate-200 flex flex-col gap-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-red-100 text-[#b4000c] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">campaign</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#b4000c] font-bold uppercase">PENGUMUMAN PUSAT</span>
                      <p className="text-xs font-bold text-slate-900 uppercase">Briefing Teknis Mengajar</p>
                    </div>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
                    Sabtu, 10 Feb 2026 pukul 08.30 WIB di Aula Lt. 3 Skomda. Dihadiri seluruh ketua kelompok dan divisi kurikulum.
                  </div>
                  <button
                    onClick={() => showToast('Membuka detail pengumuman briefing', 'info')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#b4000c] hover:underline uppercase tracking-wider cursor-pointer"
                  >
                    <span>Lihat detail pengumuman</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>

                {/* Supervisor Memo (Real-time sync from admin!) */}
                {showMemoToLeader && supervisorMemo && (
                  <div className="p-6 rounded-xl bg-red-50/70 border border-red-200 flex flex-col gap-3 shadow-xs">
                    <div className="flex items-center justify-between border-b border-red-200 pb-2">
                      <span className="text-xs font-bold uppercase text-[#b4000c] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                        <span>Memo Khusus dari Admin Kurikulum</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed italic">
                      "{supervisorMemo}"
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono text-right">
                      Sinkronisasi otomatis dengan panel admin
                    </span>
                  </div>
                )}

                {/* Project Assets Downloads */}
                <div className="p-6 rounded-xl bg-white border border-slate-200 flex flex-col gap-4 shadow-sm">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Aset Resmi Proyek
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">VERSI 2026.2</span>
                  </div>

                  <div className="flex flex-col gap-2.5 text-xs">
                    <button
                      onClick={() => showToast('Mengunduh Template Slide PPTX (14.2 MB)...', 'info')}
                      className="p-3 rounded-lg border border-slate-200 hover:border-slate-400 bg-slate-50 flex items-center justify-between transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-500 text-[20px]">slideshow</span>
                        <div>
                          <p className="font-bold text-slate-900">Template Slide PPTX</p>
                          <span className="text-[10px] text-slate-400">Rasio 16:9 (14.2 MB)</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Unduh ↓</span>
                    </button>

                    <button
                      onClick={() => showToast('Mengunduh Logo Vektor Skomda (.SVG & .PNG)...', 'info')}
                      className="p-3 rounded-lg border border-slate-200 hover:border-slate-400 bg-slate-50 flex items-center justify-between transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-500 text-[20px]">palette</span>
                        <div>
                          <p className="font-bold text-slate-900">Logo Vektor Skomda</p>
                          <span className="text-[10px] text-slate-400">.SVG & .PNG Transparan</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Unduh ↓</span>
                    </button>

                    <button
                      onClick={() => showToast('Mengunduh Standar Visual Cetak PDF (4.8 MB)...', 'info')}
                      className="p-3 rounded-lg border border-slate-200 hover:border-slate-400 bg-slate-50 flex items-center justify-between transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-500 text-[20px]">menu_book</span>
                        <div>
                          <p className="font-bold text-slate-900">Standar Visual Cetak</p>
                          <span className="text-[10px] text-slate-400">Pedoman PDF (4.8 MB)</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Unduh ↓</span>
                    </button>
                  </div>
                </div>

                {/* Mentor Feedback Speech Bubble */}
                <div className="p-6 rounded-xl bg-white border border-slate-200 flex flex-col gap-4 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Catatan Pembimbing
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#b4000c]"></span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-800 shrink-0">
                      SW
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Dra. Sri Wahyuni, M.Pd</p>
                      <span className="text-[10px] text-slate-400">Guru Pendamping Kelompok 03</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed italic">
                    “Pastikan logo Tut Wuri Handayani dan logo SMPN 1 Buduran posisinya sejajar di bagian header banner. Untuk materi presentasi jangan terlalu padat teks, prioritaskan studi kasus visual.”
                  </div>
                  <span className="text-[10px] text-slate-400 text-right font-mono">Ditinjau kemarin pada 16.45 WIB</span>
                </div>

                {/* SMP Coordinator info */}
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                    Koordinator Lokasi SMP:
                  </span>
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>Bpk. Suhartono, S.Kom</span>
                    <a href="tel:+681234908812" className="text-[#b4000c] hover:underline font-mono">
                      +6812-3490-XXXX
                    </a>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Silakan konfirmasi teknis penataan sound & proyektor H-2 sebelum hari pelaksanaan.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Step Nav */}
            <section className="py-6 mt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => showToast('Kembali ke arsip Langkah 03 (Susun Materi)', 'info')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span>Langkah sebelumnya (03 Susun Materi)</span>
              </button>

              <button
                disabled
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg border border-slate-200 text-slate-400 font-bold text-xs uppercase tracking-wider opacity-60 cursor-not-allowed bg-slate-100"
              >
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>Langkah berikutnya (05 Mengajar di SMP) →</span>
              </button>
            </section>
          </div>
        </main>
      </div>

      {/* Modal Add Photo */}
      {showAddPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Tambah Foto Dokumentasi Lapangan</h3>
              <button
                onClick={() => setShowAddPhotoModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form onSubmit={handleAddPhoto} className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL Gambar / Foto</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:border-[#b4000c] focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPhotoModal(false)}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#b4000c] hover:bg-slate-900 text-white font-bold cursor-pointer"
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
