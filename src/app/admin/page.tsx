import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { groupsData, urgentAlerts, activityFeed } from '../../data/mockData';

export const AdminMonitoringPage: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'progress' | 'school' | 'overdue'>('default');

  const filteredGroups = groupsData
    .filter((g) => {
      const matchSearch =
        g.schoolName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        g.leaderName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        g.number.includes(searchFilter);
      const matchSchool = !selectedSchool || g.schoolName.toLowerCase().includes(selectedSchool.toLowerCase());
      const matchStatus = !selectedStatus || g.status === selectedStatus;
      const matchStage = !selectedStage || String(g.currentStep) === selectedStage;
      return matchSearch && matchSchool && matchStatus && matchStage;
    })
    .sort((a, b) => {
      if (sortBy === 'progress') return a.progressPercent - b.progressPercent;
      if (sortBy === 'school') return a.schoolName.localeCompare(b.schoolName);
      if (sortBy === 'overdue') {
        if (a.status === 'overdue' && b.status !== 'overdue') return -1;
        if (b.status === 'overdue' && a.status !== 'overdue') return 1;
      }
      return 0;
    });

  return (
    <div className="w-full min-h-screen bg-[#f9f9f9] text-slate-800 font-sans flex flex-row antialiased overflow-x-hidden">
      {/* ================= LEFT PERSISTENT SIDEBAR ================= */}
      <aside className="w-64 shrink-0 bg-white border-r border-slate-200 min-h-screen p-5 flex flex-col justify-between sticky top-0 h-screen z-30 select-none">
        <div className="flex flex-col space-y-5">
          {/* Top Brand */}
          <div className="flex flex-col gap-1 pb-4 border-b border-slate-100">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer text-left">
              <span className="text-[17px] uppercase tracking-tight text-slate-900 font-extrabold italic">
                #SKOMDA MENGAJAR
              </span>
              <span className="inline-block bg-[#e20113] text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase -rotate-3">
                ADMIN
              </span>
            </button>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              #IMPACT2026 / SMK TELKOM SIDOARJO
            </span>
          </div>

          {/* Filter / Status Pill */}
          <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-medium text-slate-700">Periode 2026</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aktif</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 text-[13px] font-medium">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#b4000c] text-white shadow-sm font-semibold text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                <span>Ringkasan Monitoring</span>
              </div>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>

            <button
              onClick={() => {
                setSortBy('default');
                showToast('Menampilkan seluruh 24 kelompok terdaftar', 'info');
              }}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">groups</span>
                <span>Kelompok</span>
              </div>
              <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                24
              </span>
            </button>

            <button
              onClick={() => navigate('/admin/kelompok/03')}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">verified</span>
                <span>Review Berkas</span>
              </div>
              <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                04
              </span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('feedback-panel');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">rate_review</span>
                <span>Feedback & Respon</span>
              </div>
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                4.6
              </span>
            </button>

            <button
              onClick={() => showToast('Pemberitahuan resmi: Briefing Teknis Sabtu, 10 Feb di Aula Skomda', 'info')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">campaign</span>
              <span>Pengumuman</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">public</span>
              <span>Lihat Beranda Publik</span>
            </button>
          </nav>
        </div>

        {/* Bottom User Profile */}
        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#b4000c] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              AD
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-900 truncate">Admin Kurikulum</span>
              <span className="text-[10px] text-slate-400 truncate">admin@telkomsda.sch.id</span>
            </div>
          </div>
          <button
            onClick={() => {
              navigate('/login');
              showToast('Keluar dari sesi Admin', 'info');
            }}
            className="p-1.5 text-slate-400 hover:text-[#b4000c] hover:bg-white rounded-lg transition-colors cursor-pointer"
            title="Keluar"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN VIEWPORT CONTAINER ================= */}
      <div className="flex-1 min-w-0 flex flex-col bg-[#f9f9f9] min-h-screen overflow-y-auto">
        {/* Top Sticky Utility Header */}
        <header className="w-full bg-white border-b border-slate-200 px-8 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Beranda</span>
            </button>
            <span className="text-slate-300">/</span>
            <nav className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="text-slate-400">KONSOL</span>
              <span className="text-slate-300">/</span>
              <span className="font-bold text-slate-900 uppercase">RINGKASAN PANTAU KELOMPOK</span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-slate-600 text-xs font-mono border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Sistem Terhubung</span>
            </div>
            <button
              onClick={() => showToast('Mempersiapkan berkas rekap ZIP untuk 24 kelompok...', 'info')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-[#b4000c] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">folder_zip</span>
              <span>Unduh Rekap Berkas</span>
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="w-full max-w-[1400px] mx-auto p-8 space-y-8">
          {/* Header Context & Search / Filter Controls */}
          <header className="flex flex-col gap-6 pb-6 border-b border-slate-200">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="inline-block bg-[#e20113] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase -rotate-2 origin-left tracking-wider">
                    MONITORING PROGRAM TAHUNAN
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                    KONSOL AKADEMIK 2026
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline gap-4 mt-1">
                  <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                    Pantau Kelompok
                  </h1>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-light text-slate-400 tracking-tighter">24</span>
                    <span className="text-sm text-slate-500 font-semibold">kelompok terdaftar</span>
                  </div>
                </div>
              </div>

              {/* Action & Export */}
              <div className="flex items-center gap-3 relative">
                <div className="relative inline-block text-left">
                  <button
                    onClick={() => setIsExportOpen(!isExportOpen)}
                    className="h-10 px-4 bg-white border border-slate-300 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">ios_share</span>
                    <span>Ekspor Data</span>
                    <span className="material-symbols-outlined text-[18px]">expand_more</span>
                  </button>

                  {isExportOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 text-xs">
                      <button
                        onClick={() => {
                          setIsExportOpen(false);
                          showToast('Mengunduh data rekap kelompok CSV...', 'success');
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-slate-700 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px] text-slate-400">table_view</span>
                        <span>Unduh CSV (.csv)</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsExportOpen(false);
                          showToast('Membuat Ringkasan Laporan PDF...', 'success');
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-slate-700 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px] text-slate-400">picture_as_pdf</span>
                        <span>Ringkasan PDF (.pdf)</span>
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => showToast('Membuka modal broadcast pesan pengingat ke 24 ketua...', 'info')}
                  className="h-10 px-4 bg-[#b4000c] text-white text-xs font-bold rounded-lg flex items-center gap-2 hover:bg-slate-900 transition-colors shadow-xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  <span>Broadcast Pesan</span>
                </button>
              </div>
            </div>

            {/* Search & Filters Toolbar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
              <div className="md:col-span-5 relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </span>
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Cari kelompok, ketua, atau mitra SMP..."
                  className="w-full h-11 pl-10 pr-4 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 transition-colors"
                />
              </div>

              <div className="md:col-span-3 relative">
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 appearance-none focus:outline-none focus:border-slate-800 cursor-pointer pr-10"
                >
                  <option value="">Semua SMP (12 Lokasi)</option>
                  <option value="Buduran">SMPN 1 Buduran</option>
                  <option value="Sidoarjo">SMPN 1 Sidoarjo</option>
                  <option value="Candi">SMPN 2 Candi</option>
                  <option value="Telkom">SMP Telkom Sidoarjo</option>
                  <option value="Porong">SMPN 3 Porong</option>
                  <option value="Sedati">SMPN 1 Sedati</option>
                  <option value="Waru">SMPN 1 Waru</option>
                </select>
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </span>
              </div>

              <div className="md:col-span-2 relative">
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 appearance-none focus:outline-none focus:border-slate-800 cursor-pointer pr-10"
                >
                  <option value="">Semua Tahap</option>
                  <option value="1">01 Pembentukan</option>
                  <option value="2">02 Penugasan Ketua</option>
                  <option value="3">03 Silabus & Modul</option>
                  <option value="4">04 Desain & Promosi</option>
                  <option value="5">05 Praktik Mengajar</option>
                  <option value="6">06 Laporan Akhir</option>
                </select>
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </span>
              </div>

              <div className="md:col-span-2 relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 appearance-none focus:outline-none focus:border-slate-800 cursor-pointer pr-10"
                >
                  <option value="">Semua Status</option>
                  <option value="ontrack">Sesuai Jadwal</option>
                  <option value="review">Menunggu Review</option>
                  <option value="revisi">Perlu Revisi</option>
                  <option value="overdue">Terlambat</option>
                </select>
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </span>
              </div>
            </div>
          </header>

          {/* 4 Summary KPI Tiles */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Tile 1: Status Operasional */}
            <div className="p-5 bg-white border border-slate-200 rounded-xl flex flex-col justify-between hover:border-slate-400 transition-colors shadow-2xs min-h-[160px]">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Status Operasional
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <div className="my-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-light text-emerald-600">16</span>
                  <span className="text-xs text-slate-400">dari 24 kelompok</span>
                </div>
                <p className="text-base font-bold text-slate-900 mt-1">Sesuai Jadwal</p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="truncate">66% tim bergerak lancar tanpa hambatan</span>
              </div>
            </div>

            {/* Tile 2: Kritis / Overdue */}
            <div className="p-5 bg-white border-2 border-[#b4000c] rounded-xl flex flex-col justify-between shadow-2xs min-h-[160px]">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#b4000c]">
                  Kritis / Overdue
                </span>
                <span className="material-symbols-outlined text-[20px] text-[#b4000c]">schedule</span>
              </div>
              <div className="my-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-light text-[#b4000c]">03</span>
                  <span className="text-xs text-slate-400">kelompok menunggak</span>
                </div>
                <p className="text-base font-bold text-[#b4000c] mt-1">Terlambat</p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="truncate">Perlu intervensi pembimbing</span>
                <button
                  onClick={() => {
                    setSelectedStatus('overdue');
                    showToast('Menyaring kelompok dengan status terlambat', 'info');
                  }}
                  className="font-bold text-[#b4000c] hover:underline shrink-0 ml-2 cursor-pointer"
                >
                  Tindak →
                </button>
              </div>
            </div>

            {/* Tile 3: Antrean Review */}
            <div className="p-5 bg-white border border-slate-200 rounded-xl flex flex-col justify-between hover:border-slate-400 transition-colors shadow-2xs min-h-[160px]">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Antrean Dosen/Guru
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              </div>
              <div className="my-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-light text-amber-500">04</span>
                  <span className="text-xs text-slate-400">berkas masuk</span>
                </div>
                <p className="text-base font-bold text-slate-900 mt-1">Menunggu Review</p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="truncate">Modul & X-Banner</span>
                <button
                  onClick={() => navigate('/admin/kelompok/03')}
                  className="font-bold text-slate-900 underline hover:text-[#b4000c] transition-colors shrink-0 ml-2 cursor-pointer"
                >
                  Buka Review →
                </button>
              </div>
            </div>

            {/* Tile 4: Perlu Revisi */}
            <div className="p-5 bg-white border border-slate-200 rounded-xl flex flex-col justify-between hover:border-slate-400 transition-colors shadow-2xs min-h-[160px]">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Perbaikan Tim
                </span>
                <span className="material-symbols-outlined text-[20px] text-orange-500">warning</span>
              </div>
              <div className="my-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-light text-orange-500">01</span>
                  <span className="text-xs text-slate-400">catatan revisi aktif</span>
                </div>
                <p className="text-base font-bold text-slate-900 mt-1">Perlu Revisi</p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
                <span className="truncate font-semibold">Kel. 05 (SMPN 2 Candi)</span>
              </div>
            </div>
          </section>

          {/* Funnel Kemajuan 6 Langkah */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold uppercase tracking-tight text-slate-900">
                  Alur Kemajuan 6 Langkah
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Distribusi kelompok di sepanjang tahapan wajib program Skomda Mengajar #IMPACT2026
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#b4000c]"></span>
                <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                  Tahap Aktif: Langkah 04
                </span>
              </div>
            </div>

            {/* Funnel Track */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between min-h-[130px]">
                <div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-mono font-bold text-slate-600">01</span>
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 mt-2 leading-tight">Bentuk Kelompok</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-light text-slate-900">24</span>
                    <span className="text-xs text-slate-400">tuntas</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-3">
                  <div className="bg-emerald-500 h-full w-full"></div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between min-h-[130px]">
                <div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-mono font-bold text-slate-600">02</span>
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 mt-2 leading-tight">Pilih Ketua</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-light text-slate-900">24</span>
                    <span className="text-xs text-slate-400">tuntas</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-3">
                  <div className="bg-emerald-500 h-full w-full"></div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between min-h-[130px]">
                <div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-mono font-bold text-slate-600">03</span>
                    <span className="text-xs font-mono font-bold text-slate-500">83%</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 mt-2 leading-tight">Susun Materi</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-light text-slate-900">20</span>
                    <span className="text-xs text-slate-400">tuntas</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-3">
                  <div className="bg-emerald-500 h-full w-[83%]"></div>
                </div>
              </div>

              <div className="p-4 bg-white border-2 border-[#b4000c] rounded-lg flex flex-col justify-between min-h-[130px] relative shadow-xs">
                <span className="absolute -top-2.5 right-2 bg-[#b4000c] text-white text-[9px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                  FOKUS MINGGU INI
                </span>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#b4000c]">04</span>
                    <span className="text-xs font-mono font-bold text-[#b4000c]">58%</span>
                  </div>
                  <p className="text-xs font-bold text-[#b4000c] mt-2 leading-tight">Siapkan Desain</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-light text-slate-900">14</span>
                    <span className="text-xs text-slate-400">berjalan</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-3">
                  <div className="bg-[#b4000c] h-full w-[58%]"></div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between min-h-[130px] opacity-75">
                <div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-mono font-bold text-slate-400">05</span>
                    <span className="material-symbols-outlined text-[16px] text-slate-400">lock</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mt-2 leading-tight">Mengajar di SMP</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-light text-slate-400">00</span>
                    <span className="text-xs text-slate-400">tim</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-3 font-mono">Mulai 22 Feb</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between min-h-[130px] opacity-75">
                <div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-mono font-bold text-slate-400">06</span>
                    <span className="material-symbols-outlined text-[16px] text-slate-400">lock</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mt-2 leading-tight">Laporan & Evaluasi</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-light text-slate-400">00</span>
                    <span className="text-xs text-slate-400">tim</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-3 font-mono">Mulai 01 Mar</p>
              </div>
            </div>
          </section>

          {/* Main Monitoring Workspace (Split 72% / 28%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Column A: Matrix Table */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-extrabold uppercase tracking-tight text-slate-900">
                    Matriks Progres Kelompok
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Peta status per langkah kurikulum 24 kelompok binaan SMK Telkom Sidoarjo
                  </p>
                </div>

                {/* Sorting Pills */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                  <button
                    onClick={() => setSortBy('progress')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                      sortBy === 'progress' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Progres Terendah
                  </button>
                  <button
                    onClick={() => setSortBy('school')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                      sortBy === 'school' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Sekolah
                  </button>
                  <button
                    onClick={() => setSortBy('overdue')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                      sortBy === 'overdue' ? 'bg-white text-[#b4000c] shadow-2xs' : 'text-[#b4000c] hover:bg-white'
                    }`}
                  >
                    Terlambat Pertama
                  </button>
                </div>
              </div>

              {/* Status Legend */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap items-center gap-4 text-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  LEGENDA STATUS:
                </span>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-3 h-3 rounded-xs bg-[#cbd5e1]"></span>
                  <span>Belum</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-3 h-3 rounded-xs bg-[#F2B33D]"></span>
                  <span>Menunggu Review</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-3 h-3 rounded-xs bg-[#FF8A5B]"></span>
                  <span>Perlu Revisi</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-3 h-3 rounded-xs bg-[#3DBE7A]"></span>
                  <span>Disetujui / Selesai</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#b4000c]">
                  <span className="w-3 h-3 rounded-xs border-2 border-[#b4000c] bg-white flex items-center justify-center">
                    <span className="w-1 h-1 rounded-full bg-[#b4000c]"></span>
                  </span>
                  <span className="font-semibold">Terlambat (Overdue)</span>
                </div>
              </div>

              {/* Matrix Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4 min-w-[210px]">Kelompok & Sekolah</th>
                        <th className="py-3 px-2 text-center w-12" title="01 Bentuk Kelompok">01</th>
                        <th className="py-3 px-2 text-center w-12" title="02 Pilih Ketua">02</th>
                        <th className="py-3 px-2 text-center w-12" title="03 Susun Materi">03</th>
                        <th className="py-3 px-2 text-center w-12" title="04 Siapkan Desain">04</th>
                        <th className="py-3 px-2 text-center w-12" title="05 Mengajar di SMP">05</th>
                        <th className="py-3 px-2 text-center w-12" title="06 Laporan Akhir">06</th>
                        <th className="py-3 px-4 text-right min-w-[120px]">Total Progres</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredGroups.map((g) => {
                        const isKel03 = g.number === '03';
                        const isOverdue = g.status === 'overdue';

                        return (
                          <tr
                            key={g.id}
                            onClick={() => {
                              if (isKel03) {
                                navigate('/admin/kelompok/03');
                              } else {
                                showToast(`Membuka pengawasan Kelompok ${g.number} (${g.schoolName})`, 'info');
                              }
                            }}
                            className={`transition-colors cursor-pointer group ${
                              isKel03
                                ? 'bg-red-50/40 hover:bg-red-50/70 border-l-3 border-l-[#b4000c]'
                                : isOverdue
                                ? 'bg-red-50/20 hover:bg-red-50/40'
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="py-3.5 px-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-900 group-hover:text-[#b4000c] transition-colors flex items-center gap-1.5">
                                  <span>Kel. {g.number} • {g.schoolName}</span>
                                  {isKel03 && (
                                    <span className="bg-[#b4000c] text-white text-[9px] px-1.5 py-0.2 rounded font-bold">
                                      REVIEW
                                    </span>
                                  )}
                                  {isOverdue && (
                                    <span className="material-symbols-outlined text-[14px] text-[#b4000c]">
                                      schedule
                                    </span>
                                  )}
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  Ketua: {g.leaderName} • {g.memberCount} Anggota
                                </span>
                              </div>
                            </td>

                            {/* Step 1 */}
                            <td className="py-3.5 px-2 text-center">
                              <span className="inline-flex w-7 h-7 rounded bg-[#3DBE7A] text-white items-center justify-center">
                                <span className="material-symbols-outlined text-[16px]">check</span>
                              </span>
                            </td>

                            {/* Step 2 */}
                            <td className="py-3.5 px-2 text-center">
                              <span className="inline-flex w-7 h-7 rounded bg-[#3DBE7A] text-white items-center justify-center">
                                <span className="material-symbols-outlined text-[16px]">check</span>
                              </span>
                            </td>

                            {/* Step 3 */}
                            <td className="py-3.5 px-2 text-center">
                              {g.steps.step3 === 'done' ? (
                                <span className="inline-flex w-7 h-7 rounded bg-[#3DBE7A] text-white items-center justify-center">
                                  <span className="material-symbols-outlined text-[16px]">check</span>
                                </span>
                              ) : g.steps.step3 === 'review' ? (
                                <span className="inline-flex w-7 h-7 rounded bg-[#F2B33D] text-white items-center justify-center">
                                  <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                                </span>
                              ) : g.steps.step3 === 'revisi' ? (
                                <span className="inline-flex w-7 h-7 rounded bg-[#FF8A5B] text-white items-center justify-center">
                                  <span className="material-symbols-outlined text-[16px]">priority_high</span>
                                </span>
                              ) : (
                                <span className="inline-flex w-7 h-7 rounded border-2 border-[#b4000c] text-[#b4000c] items-center justify-center">
                                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                                </span>
                              )}
                            </td>

                            {/* Step 4 */}
                            <td className="py-3.5 px-2 text-center">
                              {g.steps.step4 === 'done' ? (
                                <span className="inline-flex w-7 h-7 rounded bg-[#3DBE7A] text-white items-center justify-center">
                                  <span className="material-symbols-outlined text-[16px]">check</span>
                                </span>
                              ) : g.steps.step4 === 'review' ? (
                                <span className="inline-flex w-7 h-7 rounded bg-[#F2B33D] text-white items-center justify-center animate-pulse">
                                  <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                                </span>
                              ) : g.steps.step4 === 'overdue' ? (
                                <span className="inline-flex w-7 h-7 rounded border-2 border-[#b4000c] text-[#b4000c] items-center justify-center">
                                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                                </span>
                              ) : g.steps.step4 === 'in_progress' ? (
                                <span className="inline-flex w-7 h-7 rounded bg-amber-100 text-amber-800 items-center justify-center">
                                  <span className="material-symbols-outlined text-[14px]">edit_note</span>
                                </span>
                              ) : (
                                <span className="inline-flex w-7 h-7 rounded bg-slate-100 text-slate-400 items-center justify-center">
                                  <span className="material-symbols-outlined text-[14px]">remove</span>
                                </span>
                              )}
                            </td>

                            {/* Step 5 */}
                            <td className="py-3.5 px-2 text-center">
                              <span className="inline-flex w-7 h-7 rounded bg-slate-100 text-slate-400 items-center justify-center">
                                <span className="material-symbols-outlined text-[14px]">lock</span>
                              </span>
                            </td>

                            {/* Step 6 */}
                            <td className="py-3.5 px-2 text-center">
                              <span className="inline-flex w-7 h-7 rounded bg-slate-100 text-slate-400 items-center justify-center">
                                <span className="material-symbols-outlined text-[14px]">lock</span>
                              </span>
                            </td>

                            {/* Total Progress */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span
                                  className={`font-bold ${
                                    isOverdue
                                      ? 'text-[#b4000c]'
                                      : g.progressPercent >= 60
                                      ? 'text-emerald-700'
                                      : 'text-slate-700'
                                  }`}
                                >
                                  {g.progressPercent}%
                                </span>
                                <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${
                                      isOverdue
                                        ? 'bg-[#b4000c]'
                                        : g.progressPercent >= 60
                                        ? 'bg-emerald-500'
                                        : 'bg-slate-700'
                                    }`}
                                    style={{ width: `${g.progressPercent}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="py-3 px-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
                  <p>
                    Menampilkan <strong className="text-slate-800 font-bold">{filteredGroups.length}</strong> dari{' '}
                    <strong className="text-slate-800 font-bold">24</strong> kelompok binaan
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate('/admin/kelompok/03')}
                      className="text-[#b4000c] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Buka Evaluasi Khusus Kelompok 03 SMPN 1 Buduran</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Column B: Urgent Attention & Live Activity Feed */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Card 1: Perlu Perhatian Segera */}
              <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-[#b4000c]">error</span>
                    <h3 className="text-sm font-bold uppercase tracking-tight text-slate-900">
                      Perlu Perhatian
                    </h3>
                  </div>
                  <span className="bg-[#b4000c] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    5 ITEM
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {urgentAlerts.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (item.groupName.includes('03')) {
                          navigate('/admin/kelompok/03');
                        } else {
                          showToast(`Memproses ${item.groupName}`, 'info');
                        }
                      }}
                      className="py-3 flex items-start gap-3 group cursor-pointer hover:bg-slate-50/80 -mx-2 px-2 rounded-lg transition-colors"
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                          item.severity === 'danger'
                            ? 'bg-[#b4000c]'
                            : item.severity === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-orange-500'
                        }`}
                      />
                      <div className="flex flex-col text-xs min-w-0">
                        <span className="font-bold text-slate-900 group-hover:text-[#b4000c] transition-colors truncate">
                          {item.groupName}
                        </span>
                        <p className="text-slate-600 mt-0.5 font-medium leading-snug">{item.issue}</p>
                        <span className="text-[10px] text-slate-400 mt-0.5 font-mono">{item.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate('/admin/kelompok/03')}
                  className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold text-center transition-colors cursor-pointer"
                >
                  Buka Antrean Tindakan Kelompok 03 →
                </button>
              </div>

              {/* Card 2: Aktivitas Terbaru (Audit Feed) */}
              <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-slate-600">history</span>
                    <h3 className="text-sm font-bold uppercase tracking-tight text-slate-900">
                      Aktivitas Terbaru
                    </h3>
                  </div>
                </div>

                <div className="space-y-4 relative">
                  <div className="absolute left-3.5 top-2 bottom-2 w-px bg-slate-200"></div>
                  {activityFeed.map((evt) => (
                    <div key={evt.id} className="flex items-start gap-3 relative text-xs">
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 z-10 text-[10px] font-bold text-slate-800">
                        {evt.groupId}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <p className="font-bold text-slate-900 leading-tight">{evt.title}</p>
                        <span className="text-[11px] text-slate-500 mt-0.5">{evt.subtitle}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 font-mono">{evt.timeAgo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Editorial Panels: Feedback & Calendar */}
          <section id="feedback-panel" className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 pb-12">
            {/* Feedback Masuk */}
            <div className="md:col-span-6 p-6 bg-white border border-slate-200 rounded-xl flex flex-col justify-between shadow-xs">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    SURVEI & KEPUASAN MITRA
                  </span>
                  <h3 className="text-base font-extrabold uppercase tracking-tight text-slate-900 mt-1">
                    Feedback Masuk
                  </h3>
                </div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                  142 RESPONDEN
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 py-6 items-center">
                <div className="sm:col-span-5 flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-light text-[#b4000c] tracking-tight">4,6</span>
                    <span className="text-base text-slate-400 font-light">/ 5.0</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#b4000c] mt-2">
                    <span className="material-symbols-outlined text-[20px] text-amber-500">star</span>
                    <span className="material-symbols-outlined text-[20px] text-amber-500">star</span>
                    <span className="material-symbols-outlined text-[20px] text-amber-500">star</span>
                    <span className="material-symbols-outlined text-[20px] text-amber-500">star</span>
                    <span className="material-symbols-outlined text-[20px] text-amber-500">star_half</span>
                  </div>
                  <span className="text-xs text-slate-500 mt-1">Indeks kepuasan mitra SMP</span>
                </div>

                <div className="sm:col-span-7 flex flex-col gap-3 text-xs">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-800">Guru Pamong SMP</span>
                      <span className="font-mono font-bold text-slate-900">4.8 / 5.0</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#b4000c] h-full w-[96%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-800">Siswa SMP Peserta</span>
                      <span className="font-mono font-bold text-slate-900">4.5 / 5.0</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-slate-800 h-full w-[90%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-800">Guru Pembimbing</span>
                      <span className="font-mono font-bold text-slate-900">4.7 / 5.0</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-slate-500 h-full w-[94%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Survei modul & kesiapan pra-mengajar</span>
                <button
                  onClick={() => showToast('Rubrik penilaian MGMP versi lengkap disiapkan', 'info')}
                  className="font-bold text-slate-900 underline hover:text-[#b4000c] cursor-pointer"
                >
                  Pelajari Rubrik & Respon →
                </button>
              </div>
            </div>

            {/* Deadline Terdekat */}
            <div className="md:col-span-6 p-6 bg-white border border-slate-200 rounded-xl flex flex-col justify-between shadow-xs">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    KALENDER AKADEMIK
                  </span>
                  <h3 className="text-base font-extrabold uppercase tracking-tight text-slate-900 mt-1">
                    Deadline Terdekat
                  </h3>
                </div>
                <span className="material-symbols-outlined text-[20px] text-slate-400">event_upcoming</span>
              </div>

              <div className="flex flex-col gap-3 py-3">
                <div className="p-3 bg-red-50/70 border border-red-200 rounded-lg flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-red-300 rounded-lg flex flex-col items-center justify-center shrink-0">
                    <span className="text-[9px] text-[#b4000c] font-bold uppercase leading-none">FEB</span>
                    <span className="text-lg font-extrabold text-[#b4000c] leading-tight">15</span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 truncate">
                        Batas Akhir Tahap 04 (Desain & X-Banner)
                      </span>
                      <span className="bg-[#b4000c] text-white text-[9px] px-2 py-0.2 rounded-full font-bold uppercase">
                        4 HARI LAGI
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      10 dari 24 kelompok masih dalam proses revisi atau unggah draf.
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center shrink-0">
                    <span className="text-[9px] text-slate-500 font-bold uppercase leading-none">FEB</span>
                    <span className="text-lg font-extrabold text-slate-900 leading-tight">22</span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0 text-xs">
                    <span className="font-bold text-slate-900 truncate">
                      Kickoff Mengajar Serentak di SMP Sesi 1
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      12 SMP Mitra Sidoarjo, 48 Jam Pelajaran berlangsung.
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center shrink-0">
                    <span className="text-[9px] text-slate-500 font-bold uppercase leading-none">MAR</span>
                    <span className="text-lg font-extrabold text-slate-900 leading-tight">01</span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0 text-xs">
                    <span className="font-bold text-slate-900 truncate">
                      Pengumpulan LPJ & Rubrik Penilaian Akhir
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      Tahap akhir 06 untuk evaluasi portofolio siswa relawan.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Sinkronisasi otomatis dengan Google Calendar</span>
                <button
                  onClick={() => showToast('Sinkronisasi kalender akademik aktif', 'success')}
                  className="font-bold text-slate-900 underline hover:text-[#b4000c] cursor-pointer"
                >
                  Buka Jadwal Lengkap →
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* Clean Footer */}
        <footer className="w-full bg-white border-t border-slate-200 py-6 mt-auto">
          <div className="max-w-[1400px] mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© 2026 Skomda Mengajar • SMK Telkom Sidoarjo. Panel Monitoring Pembimbing & Admin Kurikulum.</p>
            <div className="flex items-center gap-6">
              <a href="#panduan" onClick={(e) => { e.preventDefault(); showToast('Panduan Admin: Versi 2026.2', 'info'); }} className="hover:text-slate-700 transition-colors">
                Panduan Admin
              </a>
              <button onClick={() => navigate('/admin/kelompok/03')} className="hover:text-slate-700 transition-colors cursor-pointer">
                Review Kelompok 03
              </button>
              <button onClick={() => navigate('/workspace')} className="hover:text-slate-700 transition-colors cursor-pointer">
                Workspace Siswa
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
