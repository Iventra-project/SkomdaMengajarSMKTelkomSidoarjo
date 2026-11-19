"use client";

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { groupsData } from '../data/mockData';
import {
  Users,
  Search,
  CheckCircle2,
  Lock,
  ChevronRight,
  ChevronLeft,
  X,
  UserCheck,
  UserX,
  School,
  GraduationCap,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

// Static members generator for preview modal
const generateMockMembers = (groupNumber: string, leaderName: string, isLeaderAssigned: boolean) => {
  const num = parseInt(groupNumber, 10) || 1;
  const baseNis = 54124100 + num * 10;
  
  const studentPool = [
    'Ahmad Rizky Pratama',
    'Nabila Putri Ramadhani',
    'Dimas Bagus Wicaksono',
    'Siti Nurhaliza',
    'Bagus Pratama Putra',
    'Kevin Alamsyah',
    'Fahri Ramadhan',
    'Rian Hidayat',
    'Dewi Maharani',
    'Putri Ayu Wandira',
    'Zidan Maulana',
    'Aulia Rahman',
    'Anisa Rahmawati',
    'Rizal Fauzi',
    'Doni Firmansyah',
    'Fandi Ahmad',
    'Hendra Setiawan',
    'Indra Djati',
    'Joko Anwar',
    'Kiki Narendra'
  ];

  const members = [];
  const count = num % 2 === 0 ? 8 : 7;

  for (let i = 0; i < count; i++) {
    const isFirst = i === 0;
    const name = isFirst && isLeaderAssigned ? leaderName : studentPool[(num * 3 + i) % studentPool.length];
    const role = isFirst && isLeaderAssigned ? 'Ketua Kelompok' : i === 1 ? 'Sekretaris & Notulen' : i === 2 ? 'Bendahara / Logistik' : 'Anggota Tim';
    
    members.push({
      id: `${groupNumber}-${i + 1}`,
      nis: (baseNis + i).toString(),
      name,
      role,
      isLeader: isFirst && isLeaderAssigned,
    });
  }

  return members;
};

export const HomePage: React.FC = () => {
  const { navigate } = useApp();

  // Filter & Search State
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Modal State for Group Members
  const [selectedGroupModal, setSelectedGroupModal] = useState<typeof groupsData[0] | null>(null);

  // Group items with region and status determination
  const enrichedGroups = useMemo(() => {
    return groupsData.map((g) => {
      const num = parseInt(g.number, 10);
      const isLeaderPending = num === 23 || num === 24 || g.leaderName.includes('Belum');
      const districtLower = g.district.toLowerCase();

      let regionCategory = 'other';
      if (districtLower.includes('sidoarjo') || districtLower.includes('candi')) {
        regionCategory = 'sidoarjo-candi';
      } else if (districtLower.includes('buduran') || districtLower.includes('sedati')) {
        regionCategory = 'buduran-sedati';
      } else if (districtLower.includes('waru') || districtLower.includes('taman')) {
        regionCategory = 'waru-taman';
      } else if (districtLower.includes('porong') || districtLower.includes('krian') || districtLower.includes('tarik') || districtLower.includes('prambon')) {
        regionCategory = 'porong-krian';
      }

      return {
        ...g,
        isLeaderPending,
        regionCategory,
        displayLeader: isLeaderPending ? 'Belum Ditentukan' : g.leaderName,
      };
    });
  }, []);

  // Filter Logic
  const filteredGroups = useMemo(() => {
    return enrichedGroups.filter((g) => {
      // Category Filter
      if (activeCategory === 'sidoarjo-candi' && g.regionCategory !== 'sidoarjo-candi') return false;
      if (activeCategory === 'buduran-sedati' && g.regionCategory !== 'buduran-sedati') return false;
      if (activeCategory === 'waru-taman' && g.regionCategory !== 'waru-taman') return false;
      if (activeCategory === 'porong-krian' && g.regionCategory !== 'porong-krian') return false;
      if (activeCategory === 'no-leader' && !g.isLeaderPending) return false;

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSchool = g.schoolName.toLowerCase().includes(query);
        const matchesNum = `kelompok ${g.number}`.toLowerCase().includes(query) || `kel-${g.number}`.toLowerCase().includes(query);
        const matchesDistrict = g.district.toLowerCase().includes(query);
        const matchesLeader = g.displayLeader.toLowerCase().includes(query);
        return matchesSchool || matchesNum || matchesDistrict || matchesLeader;
      }

      return true;
    });
  }, [enrichedGroups, activeCategory, searchQuery]);

  // Pagination calculation
  const totalItems = filteredGroups.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedGroups = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredGroups.slice(start, start + itemsPerPage);
  }, [filteredGroups, currentPage]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Stepper data definitions
  const steps = [
    {
      step: '01',
      title: 'Pembagian Kelompok',
      status: 'completed',
      badge: 'Selesai',
      sub: 'Penetapan 24 Tim & SMP',
    },
    {
      step: '02',
      title: 'Pembentukan Ketua Tim',
      status: 'active',
      badge: 'Sedang Berjalan',
      sub: 'Musyawarah & Aktivasi Akun',
    },
    {
      step: '03',
      title: 'Susun Materi',
      status: 'locked',
      badge: 'Terkunci',
      sub: 'RPP & Modul Digital',
    },
    {
      step: '04',
      title: 'Siapkan Desain',
      status: 'locked',
      badge: 'Terkunci',
      sub: 'X-Banner & Feed IG',
    },
    {
      step: '05',
      title: 'Mengajar di SMP',
      status: 'locked',
      badge: 'Terkunci',
      sub: 'Pelaksanaan 30 Hari',
    },
    {
      step: '06',
      title: 'Laporan & Evaluasi',
      status: 'locked',
      badge: 'Terkunci',
      sub: 'Nilai & Rekap LPJ',
    },
  ];

  return (
    <div className="w-full bg-[#FAFAFA] text-slate-900 antialiased min-h-screen flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* ================= 1. MINIMAL NAVBAR ================= */}
      <header className="sticky top-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="h-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span className="text-xl font-black text-slate-950 tracking-tight select-none">
                #SKOMDA
              </span>
              <span className="bg-red-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider shadow-sm select-none">
                MENGAJAR
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-3 text-[11px] font-semibold text-slate-400">
              <span className="text-red-600 font-bold">#Impact2026</span>
              <span>•</span>
              <span>SMK Telkom Sidoarjo</span>
            </div>
          </div>

          {/* Right Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Login Ketua / Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content (Compact & Breathable) */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 space-y-8">
        {/* ================= COMPACT HERO STRIP ================= */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold border border-red-100">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                Fase Publik: Penentuan Ketua Tim
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Kembali Mengajar, Menginspirasi Nyata.
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                Cek pembagian kelompok SMP asalmu dan segera tentukan ketua tim untuk memulai program.
              </p>
            </div>

            {/* Right Stat Pills */}
            <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-100/70 text-red-600 flex items-center justify-center shrink-0">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900 leading-none">12</div>
                  <div className="text-[11px] font-medium text-slate-500 mt-0.5">SMP Tujuan</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-100/70 text-red-600 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900 leading-none">24</div>
                  <div className="text-[11px] font-medium text-slate-500 mt-0.5">Kelompok</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-100/70 text-red-600 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900 leading-none">180</div>
                  <div className="text-[11px] font-medium text-slate-500 mt-0.5">Siswa</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-100/70 text-red-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900 leading-none">30</div>
                  <div className="text-[11px] font-medium text-slate-500 mt-0.5">Hari Program</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 2. PROGRAM PROGRESS TRACKER ================= */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Alur & Progres Skomda Mengajar</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tahapan resmi program dari pembagian tim hingga pelaksanaan mengajar di SMP.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span>Fase Aktif: Pembentukan Ketua Tim</span>
            </div>
          </div>

          {/* Stepper Grid / Horizontal List */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 relative">
            {steps.map((st, idx) => {
              const isStep1 = idx === 0;
              const isStep2 = idx === 1;
              const isLocked = idx >= 2;

              return (
                <div
                  key={st.step}
                  className={`relative flex flex-col p-3.5 rounded-xl transition-all duration-200 ${
                    isStep1
                      ? 'bg-red-50/40 border border-red-200'
                      : isStep2
                      ? 'border-2 border-red-600 bg-red-50/70 shadow-xs'
                      : 'bg-slate-50/80 border border-slate-200/60 opacity-80'
                  }`}
                >
                  {/* Top Row with Number/Icon and Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                        isStep1
                          ? 'bg-red-700 text-white ring-4 ring-red-100'
                          : isStep2
                          ? 'bg-red-600 text-white font-extrabold shadow-xs'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isStep1 ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : isLocked ? (
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        st.step
                      )}
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isStep1
                          ? 'bg-red-100 text-red-800'
                          : isStep2
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {st.badge}
                    </span>
                  </div>

                  {/* Title and Subtitle */}
                  <div className="space-y-0.5">
                    <h3
                      className={`text-xs font-bold leading-tight ${
                        isStep1
                          ? 'text-red-700 font-extrabold'
                          : isStep2
                          ? 'text-red-700 font-bold'
                          : 'text-slate-600'
                      }`}
                    >
                      {st.step}. {st.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      {st.sub}
                    </p>
                  </div>

                  {/* Progress Line Step 1 -> Step 2 */}
                  {isStep1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-1 bg-red-600 z-10 rounded-full" />
                  )}
                  {isStep2 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-0.5 bg-slate-300 z-10" />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= 3. LIGHTWEIGHT GROUP FINDER ================= */}
        <section className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            {/* Header & Description */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Pembagian Kelompok</h2>
                <p className="text-xs text-slate-500">
                  Klik kartu kelompok untuk melihat daftar anggota tim.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama SMP atau kelompok..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-800 placeholder-slate-400 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none text-xs">
              {[
                { id: 'all', label: `Semua (${enrichedGroups.length})` },
                { id: 'sidoarjo-candi', label: 'Sidoarjo & Candi' },
                { id: 'buduran-sedati', label: 'Buduran & Sedati' },
                { id: 'waru-taman', label: 'Waru & Taman' },
                { id: 'porong-krian', label: 'Porong & Krian' },
                {
                  id: 'no-leader',
                  label: `Belum Ada Ketua (${enrichedGroups.filter((g) => g.isLeaderPending).length})`,
                  special: true,
                },
              ].map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleCategoryChange(tab.id)}
                    className={`px-3.5 py-1.5 rounded-full font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-red-600 text-white shadow-xs'
                        : tab.special
                        ? 'bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group Cards Grid: Strictly 6 Cards per view (3 cols x 2 rows) */}
          {paginatedGroups.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">Tidak ada kelompok yang cocok</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Silakan ubah kata kunci pencarian atau pilih filter kategori lainnya.
              </p>
              <button
                onClick={() => { setActiveCategory('all'); setSearchQuery(''); setCurrentPage(1); }}
                className="text-xs text-red-600 font-semibold hover:underline cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedGroups.map((group) => {
                const isPending = group.isLeaderPending;

                return (
                  <div
                    key={group.id}
                    onClick={() => setSelectedGroupModal(group)}
                    className="group bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-red-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
                  >
                    {/* Top Row: Group Badge + Region */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 font-extrabold text-[11px] tracking-wide border border-red-100">
                          KELOMPOK {group.number}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                          {group.district}
                        </span>
                      </div>

                      {/* School Title */}
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                        {group.schoolName}
                      </h3>
                    </div>

                    {/* Meta Rows */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center justify-between text-slate-500">
                        <span>Pembimbing:</span>
                        <span className="font-semibold text-slate-700 truncate max-w-[170px]">
                          {group.mentorName.split(',')[0]}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Status Ketua:</span>
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full text-[11px]">
                            <UserX className="w-3 h-3 text-amber-600" />
                            Belum Ditentukan
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                            <UserCheck className="w-3 h-3 text-emerald-600" />
                            Sudah Terpilih
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">
                        {group.memberCount} Siswa terdaftar
                      </span>
                      <span className="inline-flex items-center gap-1 text-red-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                        <span>Lihat {group.memberCount} Anggota</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
              <span className="text-slate-500 font-medium">
                Menampilkan{' '}
                <strong className="text-slate-800">
                  {(currentPage - 1) * itemsPerPage + 1}–
                  {Math.min(currentPage * itemsPerPage, totalItems)}
                </strong>{' '}
                dari <strong className="text-slate-800">{totalItems}</strong> kelompok
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full font-bold transition cursor-pointer text-xs ${
                      currentPage === page
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* ================= 4. ULTRA-MINIMAL FOOTER ================= */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            © 2026 Skomda Mengajar • SMK Telkom Sidoarjo
          </div>
          <div>
            <a
              href="mailto:panitia@skomda.sch.id"
              className="text-slate-600 hover:text-red-600 font-medium transition-colors"
            >
              Bantuan & Kontak Panitia
            </a>
          </div>
        </div>
      </footer>

      {/* ================= MEMBER PREVIEW MODAL (DIALOG) ================= */}
      {selectedGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-[10px] tracking-wider uppercase">
                    KELOMPOK {selectedGroupModal.number}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {selectedGroupModal.district}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedGroupModal.schoolName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Guru Pembimbing: <strong className="text-slate-700">{selectedGroupModal.mentorName}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedGroupModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Members List */}
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Daftar Anggota Kelompok ({selectedGroupModal.memberCount} Siswa)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    SMK Telkom Sidoarjo
                  </span>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden">
                  {generateMockMembers(
                    selectedGroupModal.number,
                    selectedGroupModal.leaderName,
                    !selectedGroupModal.leaderName.includes('Belum') &&
                    parseInt(selectedGroupModal.number, 10) !== 23 &&
                    parseInt(selectedGroupModal.number, 10) !== 24
                  ).map((m, index) => (
                    <div
                      key={m.id}
                      className={`p-3 flex items-center justify-between text-xs ${
                        m.isLeader ? 'bg-red-50/40' : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-[11px] font-bold text-slate-400 w-4">
                          {index + 1}.
                        </span>
                        <div>
                          <div className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span>{m.name}</span>
                            {m.isLeader && (
                              <span className="text-[10px] font-extrabold bg-red-600 text-white px-2 py-0.5 rounded-full">
                                KETUA
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            NIS: {m.nis}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] font-medium text-slate-500">
                          {m.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note / Callout */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <span>💡 Sudah sepakat memilih ketua?</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Hubungi guru pembimbing Anda ({selectedGroupModal.mentorName.split(',')[0]}) untuk aktivasi akun login ketua dan memulai penyusunan materi.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500">
                Akses internal modul terkunci hingga tahap login dibuka.
              </span>
              <button
                onClick={() => setSelectedGroupModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-full text-xs font-semibold cursor-pointer transition"
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
