"use client";

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { groupsData } from '../../data/mockData';
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
  ArrowRight,
  BookOpen,
  Palette,
  LogOut,
  Sparkles,
  LayoutDashboard
} from 'lucide-react';

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

export const PostLoginHomePage: React.FC = () => {
  const { navigate, currentUser, logout, showToast } = useApp();

  // Filter & Search State
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Modal State for Other Groups Member Preview
  const [selectedGroupModal, setSelectedGroupModal] = useState<typeof groupsData[0] | null>(null);

  const userGroupNum = currentUser?.groupNumber ? String(currentUser.groupNumber).padStart(2, '0') : '01';

  // Group items with region, status, and PINNING the user's own group to position 1
  const enrichedGroups = useMemo(() => {
    const mapped = groupsData.map((g) => {
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

      const isMyGroup = g.number === userGroupNum;

      return {
        ...g,
        isLeaderPending,
        regionCategory,
        isMyGroup,
        displayLeader: isLeaderPending ? 'Belum Ditentukan' : g.leaderName,
      };
    });

    // Sort: user's own group always comes FIRST!
    return mapped.sort((a, b) => {
      if (a.isMyGroup) return -1;
      if (b.isMyGroup) return 1;
      return a.number.localeCompare(b.number);
    });
  }, [userGroupNum]);

  // Filter Logic
  const filteredGroups = useMemo(() => {
    return enrichedGroups.filter((g) => {
      if (activeCategory === 'sidoarjo-candi' && g.regionCategory !== 'sidoarjo-candi') return false;
      if (activeCategory === 'buduran-sedati' && g.regionCategory !== 'buduran-sedati') return false;
      if (activeCategory === 'waru-taman' && g.regionCategory !== 'waru-taman') return false;
      if (activeCategory === 'porong-krian' && g.regionCategory !== 'porong-krian') return false;
      if (activeCategory === 'no-leader' && !g.isLeaderPending) return false;

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

  const handleLogout = async () => {
    await logout();
    showToast('Berhasil keluar dari akun.', 'info');
    navigate('/');
  };

  return (
    <div className="w-full bg-[#FAFAFA] text-slate-900 antialiased min-h-screen flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* ================= 1. POST-LOGIN NAVBAR ================= */}
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

          {/* Right Action: Logged In User Pill + Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-800">{currentUser?.name || 'Ketua Kelompok'}</span>
              <span className="text-slate-400">•</span>
              <span className="font-bold text-red-600">KEL-{userGroupNum}</span>
            </div>

            <button
              onClick={() => navigate('/dashboard/ketua')}
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-full transition shadow-xs cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Kelompok</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-full transition cursor-pointer"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content (Identical Familiar Layout to Public Page) */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 space-y-8">

        {/* User Welcome Alert Banner */}
        <div className="p-4 rounded-2xl bg-red-50/80 border border-red-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-sm shrink-0">
              {userGroupNum}
            </div>
            <div>
              <div className="text-xs font-bold text-red-700 uppercase tracking-wider">
                Selamat Datang, {currentUser?.name}
              </div>
              <div className="text-sm font-bold text-slate-900">
                Anda login sebagai Ketua Kelompok {userGroupNum} ({enrichedGroups.find(g => g.isMyGroup)?.schoolName}).
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard/ketua')}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer"
          >
            <span>Buka Dashboard Tim</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ================= COMPACT HERO STRIP ================= */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold border border-red-100">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                Skomda Mengajar 2026: Fase Aktif
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Kembali Mengajar, Menginspirasi Nyata.
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                Kelola berkas modul, koordinasi anggota tim, dan pantau progres kelompok SMP Anda melalui sistem terpadu.
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

        {/* ================= 2. PROGRAM PROGRESS TRACKER (SERPENTINE PATH) ================= */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Alur & Progres Skomda Mengajar
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tahapan terstruktur dari pembentukan tim hingga evaluasi luaran nyata di sekolah mitra.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span>Fase Aktif: Pembentukan Ketua Tim</span>
            </div>
          </div>

          <div className="w-full relative py-6 sm:py-8 overflow-x-auto select-none scrollbar-none">
            <div className="min-w-[860px] relative h-48 flex items-center">
              <svg
                className="w-full h-full absolute inset-0 pointer-events-none"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 1100 160"
              >
                <path
                  id="journey-full-path"
                  d="M 50,70 C 150,20 230,120 330,60 C 430,10 510,120 610,65 C 710,15 790,125 890,70 C 970,25 1020,80 1060,60"
                  stroke="#CBD5E1"
                  strokeDasharray="4 6"
                  strokeWidth="2"
                  style={{
                    clipPath: 'polygon(27% 0%, 100% 0%, 100% 100%, 27% 100%)',
                  }}
                />
                <path
                  d="M 50,70 C 150,20 230,120 330,60 C 430,10 510,120 610,65 C 710,15 790,125 890,70 C 970,25 1020,80 1060,60"
                  stroke="#DC2626"
                  strokeWidth="2.5"
                  strokeDasharray="4 6"
                  style={{
                    clipPath: 'polygon(0% 0%, 27% 0%, 27% 100%, 0% 100%)',
                  }}
                />
              </svg>

              <div className="w-full grid grid-cols-6 gap-2 relative z-10 items-center">
                <div className="flex flex-col items-center text-center transform -translate-y-4 group">
                  <div className="w-16 h-16 rounded-2xl bg-red-600 text-white flex flex-col items-center justify-center mb-2 shadow-lg shadow-red-600/25 transition-transform group-hover:scale-105">
                    <span className="text-[10px] font-bold text-white/90 leading-none mb-1">01</span>
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-extrabold text-slate-900 leading-tight">Bentuk kelompok</span>
                  <span className="text-[11px] text-slate-500 mt-0.5 leading-tight">Penentuan anggota tim</span>
                </div>

                <div className="flex flex-col items-center text-center transform translate-y-6 group">
                  <div className="w-16 h-16 rounded-2xl bg-white border-2 border-red-500/80 text-red-600 shadow-md shadow-red-500/10 flex flex-col items-center justify-center mb-2 transition-transform group-hover:scale-105">
                    <span className="text-[10px] font-bold text-red-500 leading-none mb-1">02</span>
                    <UserCheck className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 leading-tight">Pilih ketua</span>
                  <span className="text-[11px] text-slate-500 mt-0.5 leading-tight">Koordinator lapangan</span>
                </div>

                <div className="flex flex-col items-center text-center transform -translate-y-6 group opacity-85 hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:border-slate-400 flex flex-col items-center justify-center mb-2 shadow-xs transition-transform group-hover:scale-105">
                    <span className="text-[10px] font-medium text-slate-400 leading-none mb-1">03</span>
                    <BookOpen className="w-5 h-5 text-slate-700" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 leading-tight">Susun materi</span>
                  <span className="text-[11px] text-slate-500 mt-0.5 leading-tight">Modul & silabus ajar</span>
                </div>

                <div className="flex flex-col items-center text-center transform translate-y-5 group opacity-85 hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:border-slate-400 flex flex-col items-center justify-center mb-2 shadow-xs transition-transform group-hover:scale-105">
                    <span className="text-[10px] font-medium text-slate-400 leading-none mb-1">04</span>
                    <Palette className="w-5 h-5 text-slate-700" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 leading-tight">Siapkan desain</span>
                  <span className="text-[11px] text-slate-500 mt-0.5 leading-tight">Media visual & slide</span>
                </div>

                <div className="flex flex-col items-center text-center transform -translate-y-4 group opacity-85 hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:border-slate-400 flex flex-col items-center justify-center mb-2 shadow-xs transition-transform group-hover:scale-105">
                    <span className="text-[10px] font-medium text-slate-400 leading-none mb-1">05</span>
                    <GraduationCap className="w-5 h-5 text-slate-700" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 leading-tight">Mengajar di SMP</span>
                  <span className="text-[11px] text-slate-500 mt-0.5 leading-tight">Sesi kelas interaktif</span>
                </div>

                <div className="flex flex-col items-center text-center transform translate-y-4 group opacity-85 hover:opacity-100 transition-opacity relative">
                  <div className="absolute -top-3.5 right-6 sm:right-8 bg-red-600 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-sm transform -rotate-6 origin-center shadow-xs">
                    FINISH
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:border-slate-400 flex flex-col items-center justify-center mb-2 shadow-xs transition-transform group-hover:scale-105">
                    <span className="text-[10px] font-medium text-slate-400 leading-none mb-1">06</span>
                    <CheckCircle2 className="w-5 h-5 text-slate-700" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 leading-tight">Laporan & feedback</span>
                  <span className="text-[11px] text-slate-500 mt-0.5 leading-tight">Refleksi & publikasi</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3. GROUP FINDER WITH PINNED OWN GROUP ================= */}
        <section className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Pembagian Kelompok</h2>
                <p className="text-xs text-slate-500">
                  Kelompok Anda disematkan di posisi teratas. Klik untuk membuka dashboard tim Anda.
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
                    className={`px-3.5 py-1.5 rounded-full font-semibold transition-all duration-150 whitespace-nowrap cursor-pointer ${isActive
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

          {/* Group Cards Grid: 6 cards per view */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedGroups.map((group) => {
              const isMyGroup = group.isMyGroup;
              const isPending = group.isLeaderPending;

              if (isMyGroup) {
                // PINNED LEADER'S OWN GROUP CARD
                return (
                  <div
                    key={group.id}
                    onClick={() => navigate('/dashboard/ketua')}
                    className="bg-white rounded-2xl border-2 border-red-600 p-5 shadow-md shadow-red-600/10 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden"
                  >
                    {/* Corner Ribbon */}
                    <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                      Kelompok Anda
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-[11px] tracking-wide">
                          KELOMPOK {group.number}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500 bg-red-50 px-2 py-0.5 rounded-md">
                          {group.district}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-slate-900">
                        {group.schoolName}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Pembimbing: <strong className="text-slate-700">{group.mentorName.split(',')[0]}</strong>
                      </p>
                    </div>

                    {/* Live Progress Bar for Own Group */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-red-600">Tahap 4/6 • Siapkan Desain</span>
                        <span className="font-bold text-slate-700">67% Selesai</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-red-600 h-full rounded-full w-2/3" />
                      </div>
                    </div>

                    {/* Prominent Action Button */}
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/dashboard/ketua');
                        }}
                        className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs py-2.5 rounded-full transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Buka Dashboard Kelompok</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              }

              // Standard card for other groups (Read-only member preview modal)
              return (
                <div
                  key={group.id}
                  onClick={() => setSelectedGroupModal(group)}
                  className="group bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-red-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 font-extrabold text-[11px] tracking-wide border border-red-100">
                        KELOMPOK {group.number}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                        {group.district}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                      {group.schoolName}
                    </h3>
                  </div>

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
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full font-bold transition cursor-pointer text-xs ${currentPage === page
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
                  className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/90 bg-white py-6 text-center text-xs text-slate-500">
        © 2026 Skomda Mengajar • SMK Telkom Sidoarjo. Dashboard Ketua Kelompok.
      </footer>

      {/* Member preview modal for other groups */}
      {selectedGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-[10px] uppercase">
                  KELOMPOK {selectedGroupModal.number}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedGroupModal.schoolName}
                </h3>
                <p className="text-xs text-slate-500">
                  Pembimbing: {selectedGroupModal.mentorName}
                </p>
              </div>
              <button
                onClick={() => setSelectedGroupModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-2">
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                {generateMockMembers(
                  selectedGroupModal.number,
                  selectedGroupModal.leaderName,
                  !selectedGroupModal.leaderName.includes('Belum')
                ).map((m, idx) => (
                  <div key={m.id} className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">{idx + 1}. {m.name}</span>
                      <div className="text-[11px] text-slate-400">NIS: {m.nis}</div>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">{m.role}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedGroupModal(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-full text-xs font-semibold cursor-pointer"
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
