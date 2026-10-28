import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { groupsData, showcaseProjects } from '../data/mockData';

export const HomePage: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ready' | 'leader'>('all');
  const [selectedStep, setSelectedStep] = useState<number>(4);

  const filteredGroups = groupsData.filter((group) => {
    const matchesSearch =
      group.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.leaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.district.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedFilter === 'ready') return group.status === 'ontrack' || group.status === 'review';
    if (selectedFilter === 'leader') return !group.leaderName.includes('Belum');
    return true;
  });

  return (
    <div className="w-full bg-[#ffffff] text-[#1a1c1c] antialiased min-h-screen flex flex-col">
      {/* Top Fixed Header */}
      <header className="fixed top-0 inset-x-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="h-16 w-full max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 cursor-pointer text-left"
            >
              <span className="text-lg font-extrabold text-slate-900 tracking-tight transform -rotate-3 origin-bottom-left select-none italic">
                #SKOMDA
              </span>
              <span className="bg-[#e20113] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full transform -rotate-3 origin-center inline-block tracking-widest shadow-none select-none">
                MENGAJAR
              </span>
            </button>
            <div className="hidden sm:flex items-center gap-1.5 border-l border-slate-200 pl-3 ml-2 text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              <span>#Impact2026</span>
              <span>/</span>
              <span>SMK Telkom Sidoarjo</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <a href="#alur" className="hover:text-slate-900 transition-colors">
              Alur
            </a>
            <a href="#kelompok" className="hover:text-slate-900 transition-colors">
              Kelompok
            </a>
            <a href="#jejak-2025" className="hover:text-slate-900 transition-colors">
              Jejak 2025
            </a>
            <a href="#kurikulum" className="hover:text-slate-900 transition-colors">
              Kurikulum
            </a>
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
        <section className="w-full bg-white py-20 border-b border-slate-200 mt-16" id="alur">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#e20113]">01 / PERJALANAN</span>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Alur Skomda Mengajar</h2>
                <p className="text-sm text-slate-600 max-w-2xl mt-1">
                  Tahapan terstruktur dari pembentukan tim hingga evaluasi luaran nyata. Klik setiap tahap untuk membuka aksi dan kontrol progres.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e20113] animate-pulse"></span>
                <span>Tahap Berjalan: Minggu ke-4</span>
              </div>
            </div>

            {/* 6-Node Horizontal Interactive Serpentine Track */}
            <div className="w-full relative py-12 overflow-x-auto select-none">
              <div className="min-w-[960px] grid grid-cols-6 gap-6 relative z-10 items-center px-4">
                {/* Step 1 */}
                <div
                  onClick={() => setSelectedStep(1)}
                  className={`flex flex-col items-center text-center cursor-pointer group transition-transform ${
                    selectedStep === 1 ? 'scale-105' : ''
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-[#e20113] text-white flex flex-col items-center justify-center mb-2 shadow-sm group-hover:ring-4 group-hover:ring-red-100 transition-all">
                    <span className="text-xs font-light">01</span>
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">Bentuk Kelompok</span>
                  <span className="text-[11px] text-[#e20113] font-semibold mt-0.5">Selesai • 12 Jan</span>
                </div>

                {/* Step 2 */}
                <div
                  onClick={() => setSelectedStep(2)}
                  className={`flex flex-col items-center text-center cursor-pointer group transition-transform ${
                    selectedStep === 2 ? 'scale-105' : ''
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-[#e20113] text-white flex flex-col items-center justify-center mb-2 shadow-sm group-hover:ring-4 group-hover:ring-red-100 transition-all">
                    <span className="text-xs font-light">02</span>
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">Pilih Ketua</span>
                  <span className="text-[11px] text-[#e20113] font-semibold mt-0.5">Selesai • 15 Jan</span>
                </div>

                {/* Step 3 */}
                <div
                  onClick={() => setSelectedStep(3)}
                  className={`flex flex-col items-center text-center cursor-pointer group transition-transform ${
                    selectedStep === 3 ? 'scale-105' : ''
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-[#e20113] text-white flex flex-col items-center justify-center mb-2 shadow-sm group-hover:ring-4 group-hover:ring-red-100 transition-all">
                    <span className="text-xs font-light">03</span>
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">Susun Materi</span>
                  <span className="text-[11px] text-[#e20113] font-semibold mt-0.5">Selesai • 28 Jan</span>
                </div>

                {/* Step 4: Active */}
                <div
                  onClick={() => {
                    setSelectedStep(4);
                    navigate('/workspace');
                  }}
                  className="flex flex-col items-center text-center cursor-pointer group relative scale-105"
                >
                  <div className="absolute -top-3.5 bg-[#e20113] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase -rotate-2">
                    Tahap Aktif
                  </div>
                  <div className="w-16 h-16 rounded-full bg-[#e20113] text-white ring-4 ring-red-200 flex flex-col items-center justify-center mb-2 shadow-md">
                    <span className="text-xs font-extrabold">04</span>
                    <span className="material-symbols-outlined text-[18px]">design_services</span>
                  </div>
                  <span className="text-xs font-bold text-[#e20113] underline underline-offset-4">
                    Siapkan Desain
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold mt-0.5">Batas: 15 Feb</span>
                </div>

                {/* Step 5 */}
                <div
                  onClick={() => setSelectedStep(5)}
                  className="flex flex-col items-center text-center cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                >
                  <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex flex-col items-center justify-center mb-2 text-slate-400">
                    <span className="text-xs">05</span>
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-600">Mengajar di SMP</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">Mulai: 18 Feb</span>
                </div>

                {/* Step 6 */}
                <div
                  onClick={() => setSelectedStep(6)}
                  className="flex flex-col items-center text-center cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                >
                  <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex flex-col items-center justify-center mb-2 text-slate-400">
                    <span className="text-xs">06</span>
                    <span className="material-symbols-outlined text-[18px]">flag</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-600">Laporan & Feedback</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">Batas: 28 Feb</span>
                </div>
              </div>

              <div className="w-full flex justify-center mt-8">
                <button
                  onClick={() => navigate('/workspace')}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#e20113] hover:text-slate-900 transition-colors cursor-pointer bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full border border-red-200"
                >
                  <span className="w-2 h-2 rounded-full bg-[#e20113] animate-ping"></span>
                  <span>Buka Lembar Kerja Tahap Aktif (04 Siapkan Desain) →</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 02: PEMBAGIAN KELOMPOK ================= */}
        <section className="w-full bg-[#f9f9f9] py-20 border-b border-slate-200" id="kelompok">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#e20113]">02 / ORGANISASI TIM</span>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Pembagian Kelompok Mengajar
                </h2>
                <p className="text-sm text-slate-600 max-w-2xl mt-1">
                  Daftar 24 kelompok SMK Telkom Sidoarjo yang ditempatkan di sekolah rujukan se-Kabupaten Sidoarjo.
                </p>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari SMP atau nama ketua..."
                    className="h-10 pl-9 pr-4 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#e20113] w-64 shadow-xs"
                  />
                  <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-slate-400 text-[18px]">
                    search
                  </span>
                </div>

                <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-white shadow-xs">
                  <button
                    onClick={() => setSelectedFilter('all')}
                    className={`px-3 py-1.5 text-xs font-bold uppercase rounded-md transition-colors cursor-pointer ${
                      selectedFilter === 'all'
                        ? 'bg-[#e20113] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setSelectedFilter('ready')}
                    className={`px-3 py-1.5 text-xs font-bold uppercase rounded-md transition-colors cursor-pointer ${
                      selectedFilter === 'ready'
                        ? 'bg-[#e20113] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Siap Ajar
                  </button>
                  <button
                    onClick={() => setSelectedFilter('leader')}
                    className={`px-3 py-1.5 text-xs font-bold uppercase rounded-md transition-colors cursor-pointer ${
                      selectedFilter === 'leader'
                        ? 'bg-[#e20113] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Ketua Ada
                  </button>
                </div>
              </div>
            </div>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
              {filteredGroups.map((group) => {
                const isSelectedGroup03 = group.number === '03';
                return (
                  <div
                    key={group.id}
                    className={`bg-white rounded-xl p-6 border transition-all flex flex-col justify-between shadow-xs hover:border-slate-400 ${
                      isSelectedGroup03 ? 'border-2 border-[#b4000c] ring-2 ring-red-50' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#b4000c] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            Kelompok {group.number}
                          </span>
                          {isSelectedGroup03 && (
                            <span className="bg-red-50 text-[#b4000c] text-[10px] font-extrabold px-1.5 py-0.2 rounded border border-red-200">
                              Regu Utama
                            </span>
                          )}
                        </div>
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
                      </div>

                      <div className="pt-4">
                        <h3 className="text-base font-extrabold text-slate-900">{group.schoolName}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{group.schoolAddress}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Ketua Kelompok:</span>
                          <span className="text-slate-900 font-bold">{group.leaderName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Guru Pembimbing:</span>
                          <span className="text-slate-700 font-medium">{group.mentorName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Jumlah Relawan:</span>
                          <span className="text-slate-900 font-semibold">{group.memberCount} Siswa</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Modul Unggulan:</span>
                          <span className="text-slate-800 font-medium text-right truncate max-w-[180px]">
                            {group.featuredModule}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">Target: {group.targetDate}</span>
                      <button
                        onClick={() => {
                          if (group.number === '03') {
                            navigate('/admin/kelompok/03');
                          } else {
                            navigate('/admin');
                            showToast(`Membuka ringkasan pengawasan Kelompok ${group.number}`, 'info');
                          }
                        }}
                        className="text-xs font-bold text-[#b4000c] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Lihat Detail</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= SECTION 03: JEJAK PELAKSANAAN 2025 ================= */}
        <section className="w-full bg-white py-20 border-b border-slate-200" id="jejak-2025">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#e20113]">03 / ARSIP DAMPAK</span>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Jejak Pelaksanaan 2025
                </h2>
                <p className="text-sm text-slate-600 max-w-2xl mt-1">
                  Dokumentasi faktual dedikasi siswa Skomda pada edisi sebelumnya: melatih 1.400+ siswa SMP menciptakan karya nyata berbasis teknologi.
                </p>
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold uppercase px-3 py-1 rounded-md">
                  Edisi Katalis III • 100% Tuntas
                </span>
              </div>
            </div>

            {/* Asymmetric Editorial Photo Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-8">
              <div className="md:col-span-7 h-80 bg-slate-100 rounded-xl overflow-hidden relative group border border-slate-200">
                <img
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  alt="Workshop Literasi Komputasi"
                  src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80"
                />
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950/80 to-transparent text-white">
                  <span className="text-[10px] uppercase font-bold text-red-300 tracking-wider">
                    Dokumentasi Utama 2025
                  </span>
                  <p className="text-base font-bold">Workshop Literasi Komputasi di SMPN 2 Sidoarjo</p>
                </div>
              </div>

              <div className="md:col-span-5 h-80 bg-slate-100 rounded-xl overflow-hidden relative group border border-slate-200">
                <img
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  alt="Simulasi Presentasi Proyek Akhir"
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
                />
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950/80 to-transparent text-white">
                  <span className="text-[10px] uppercase font-bold text-red-300 tracking-wider">Hasil Belajar</span>
                  <p className="text-sm font-bold">Simulasi Presentasi Proyek Akhir Siswa</p>
                </div>
              </div>

              <div className="md:col-span-4 h-52 bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200">
                <img
                  className="w-full h-full object-cover"
                  alt="Penyusunan Materi Terbimbing"
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80"
                />
                <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-white/90 rounded text-xs font-semibold text-slate-800">
                  Penyusunan Materi Terbimbing
                </div>
              </div>

              <div className="md:col-span-4 h-52 bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200">
                <img
                  className="w-full h-full object-cover"
                  alt="Serah Terima Sertifikat"
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80"
                />
                <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-white/90 rounded text-xs font-semibold text-slate-800">
                  Serah Terima Sertifikat Kemitraan
                </div>
              </div>

              <div className="md:col-span-4 h-52 bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200">
                <img
                  className="w-full h-full object-cover"
                  alt="Penutupan Skomda Mengajar"
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80"
                />
                <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-white/90 rounded text-xs font-semibold text-slate-800">
                  Penutupan Skomda Mengajar III
                </div>
              </div>
            </div>

            {/* Projects Showcase Cards */}
            <div className="mt-16 pt-8 border-t border-slate-200">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#e20113] font-bold">
                    ARTEFAK PEMBELAJARAN
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">Projek yang dibuat</h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">Semua projek (30) →</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {showcaseProjects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between hover:border-slate-400 transition-colors shadow-2xs"
                  >
                    <div className="w-full h-36 bg-slate-100 relative overflow-hidden">
                      <img className="w-full h-full object-cover" alt={proj.title} src={proj.image} />
                      <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-slate-900 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded">
                        {proj.tag}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col justify-between flex-1">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{proj.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">{proj.desc}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100 font-medium">
                        {proj.school}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 04: STANDAR KURIKULUM ================= */}
        <section className="w-full bg-[#f9f9f9] py-20 border-b border-slate-200" id="kurikulum">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#e20113]">04 / PEDOMAN AJAR</span>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Standar Kurikulum Skomda Mengajar
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Setiap modul dirancang selaras dengan Capaian Pembelajaran Informatika Fase D (SMP), membekali siswa SMP dengan pemikiran komputasional mandiri dan etika digital beradab.
                </p>
                <div className="pt-2 flex flex-col gap-2 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#e20113] text-[18px]">verified_user</span>
                    <span>Disahkan oleh Musyawarah Guru Mata Pelajaran (MGMP) Informatika Sidoarjo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#e20113] text-[18px]">menu_book</span>
                    <span>Dilengkapi Rencana Pelaksanaan Pembelajaran (RPP) 2 Pertemuan Tatap Muka</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 flex flex-col justify-between gap-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase text-slate-900">Paket Berkas Ketua Kelompok 03</span>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Lengkap
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    <span className="font-semibold text-slate-800">1. Buku Panduan Mentor Skomda v4.2.pdf</span>
                    <button
                      onClick={() => showToast('Mengunduh Buku Panduan Mentor Skomda v4.2.pdf...', 'info')}
                      className="text-[#e20113] hover:underline font-bold cursor-pointer"
                    >
                      Unduh
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    <span className="font-semibold text-slate-800">2. Formulir Presensi & Berita Acara SMPN 1.docx</span>
                    <button
                      onClick={() => showToast('Mengunduh Formulir Presensi & Berita Acara.docx...', 'info')}
                      className="text-[#e20113] hover:underline font-bold cursor-pointer"
                    >
                      Unduh
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    <span className="font-semibold text-slate-800">3. Rubrik Penilaian Progres Akhir Siswa.xlsx</span>
                    <button
                      onClick={() => showToast('Mengunduh Rubrik Penilaian Progres Akhir Siswa.xlsx...', 'info')}
                      className="text-[#e20113] hover:underline font-bold cursor-pointer"
                    >
                      Unduh
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= RED CALL-TO-ACTION BANNER ================= */}
        <section className="w-full bg-[#b4000c] text-white py-12 px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-1 text-center md:text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                SALURAN RESMI PENDAMPINGAN
              </span>
              <h3 className="text-xl md:text-2xl font-extrabold text-white">
                Ketua Kelompok? Butuh bantuan koordinasi guru pembimbing?
              </h3>
              <p className="text-xs md:text-sm text-white/90 max-w-xl">
                Tim koordinator kurikulum dan kemitraan siap mendampingi proses birokrasi izin sekolah dan kendala berkas.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center justify-center bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs uppercase px-6 h-12 rounded-lg transition-colors tracking-wider shadow-md gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">support_agent</span>
                <span>Hubungi Koordinator</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 italic">#SKOMDA MENGAJAR</span>
            <span className="text-slate-300">/</span>
            <span>SMK Telkom Sidoarjo • Inisiatif Pengabdian 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/admin')} className="hover:text-slate-900 cursor-pointer">
              Panduan Admin
            </button>
            <button onClick={() => navigate('/workspace')} className="hover:text-slate-900 cursor-pointer">
              Workspace Ketua
            </button>
            <a href="mailto:helpdesk@skomda.sch.id" className="hover:text-slate-900">
              Pusat Bantuan
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
