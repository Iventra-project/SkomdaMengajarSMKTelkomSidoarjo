"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { groupsData } from '../../data/mockData';
import {
  Users,
  Search,
  Check,
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
  LayoutDashboard,
  Pencil,
  FileText,
  Clock,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';

const generateMockMembers = (groupNumber: string, leaderName: string, isLeaderAssigned: boolean) => {
  const num = parseInt(groupNumber, 10) || 1;
  const baseNis = 54124100 + num * 10;

  const studentPool = [
    'Raffi Akbar Pratama',
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
  const count = 8;

  for (let i = 0; i < count; i++) {
    const isFirst = i === 0;
    const name = isFirst && isLeaderAssigned ? leaderName : studentPool[(num * 3 + i) % studentPool.length];
    const role =
      isFirst && isLeaderAssigned
        ? 'Ketua Kelompok'
        : i === 1
        ? 'Notulen & Sekretaris'
        : i === 2
        ? 'Desain Grafis'
        : i === 3
        ? 'Koord. Materi'
        : i === 4
        ? 'Dokumentasi'
        : 'Logistik';

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

  // Active user info (Default to Raffi Akbar Pratama if previewing)
  const activeLeaderName = currentUser?.name || 'Raffi Akbar Pratama';
  const userGroupNum = currentUser?.groupNumber ? String(currentUser.groupNumber).padStart(2, '0') : '01';

  // Filter & Search State
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Animated circular progress state
  const [progressLoaded, setProgressLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setProgressLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // Modal State for Other Groups Member Preview
  const [selectedGroupModal, setSelectedGroupModal] = useState<typeof groupsData[0] | null>(null);

  // Group items with region, status, and PINNING the user's own group to position 1
  const enrichedGroups = useMemo(() => {
    const mapped = groupsData.map((g) => {
      const num = parseInt(g.number, 10);
      const isNoLeader = num === 23 || num === 24 || g.leaderName.includes('Belum');
      const districtLower = g.district.toLowerCase();

      let regionCategory = 'other';
      if (districtLower.includes('sidoarjo') || districtLower.includes('candi')) {
        regionCategory = 'sidoarjo-candi';
      } else if (districtLower.includes('buduran') || districtLower.includes('sedati')) {
        regionCategory = 'buduran-sedati';
      } else if (districtLower.includes('waru') || districtLower.includes('taman')) {
        regionCategory = 'waru-taman';
      } else if (
        districtLower.includes('porong') ||
        districtLower.includes('krian') ||
        districtLower.includes('tarik') ||
        districtLower.includes('prambon')
      ) {
        regionCategory = 'porong-krian';
      }

      const isMyGroup = g.number === userGroupNum;

      return {
        ...g,
        isLeaderPending: isNoLeader,
        regionCategory,
        isMyGroup,
        displayLeader: isMyGroup ? activeLeaderName : isNoLeader ? 'Belum Ditentukan' : g.leaderName,
      };
    });

    // Sort: user's own group always comes FIRST!
    return mapped.sort((a, b) => {
      if (a.isMyGroup) return -1;
      if (b.isMyGroup) return 1;
      return a.number.localeCompare(b.number);
    });
  }, [userGroupNum, activeLeaderName]);

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

  // SVG circular ring calculations (radius 28 -> circumference ~175.9)
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = 67;
  const strokeOffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="w-full bg-[#FFFFFF] text-[#475569] antialiased min-h-screen flex flex-col font-sans selection:bg-[#D7141F] selection:text-white">
      
      {/* ================= 1. FLOATING / STICKY TOP WELCOME BANNER ================= */}
      <div className="sticky top-0 z-50 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="bg-[#FFF1F2] rounded-full px-4 sm:px-6 py-2 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_2px_8px_rgba(215,20,31,0.06)]">
            <div className="flex items-center gap-2.5 text-xs text-[#0B1B3A] text-center sm:text-left">
              <span className="w-2 h-2 rounded-full bg-[#D7141F] animate-pulse shrink-0" />
              <span>
                Selamat Datang, <strong className="font-extrabold text-[#0B1B3A]">{activeLeaderName}</strong> — Anda login sebagai Ketua Kelompok {userGroupNum} (SMPN 1 Sidoarjo).
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => navigate('/dashboard/ketua')}
                className="inline-flex items-center gap-1.5 bg-[#D7141F] hover:bg-[#B80F1A] active:scale-95 text-white font-bold text-xs px-4 py-1.5 rounded-full shadow-[0_2px_8px_rgba(215,20,31,0.25)] transition-all duration-200 cursor-pointer"
              >
                <span>Buka Dashboard Tim</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleLogout}
                title="Keluar Akun"
                className="w-7 h-7 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-[#D7141F] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Viewport */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 space-y-12">
        
        {/* ================= 2. COMPACT HERO SECTION ================= */}
        <section className="bg-[#FFFFFF] rounded-[24px] p-6 sm:p-8 lg:p-10 shadow-[0_1px_3px_rgba(11,27,58,0.04),0_12px_32px_-8px_rgba(11,27,58,0.08)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF1F2] text-[#D7141F] text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Portal Resmi Pelaksanaan 2026</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0B1B3A] tracking-tight leading-[1.15]">
                Kembali Mengajar, <br className="hidden sm:inline" />
                Menginspirasi Nyata.
              </h1>
              
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-xl font-medium">
                Pusat orkestrasi pengajaran SMK Telkom Sidoarjo. Validasi modul digital, koordinasikan 8 anggota tim Anda, dan tuntaskan misi di sekolah mitra.
              </p>
            </div>

            {/* Right: 4 Ultra-Clean Stat Pills */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
              {[
                { icon: School, label: 'SMP Tujuan', val: '12' },
                { icon: Layers, label: 'Kelompok', val: '24' },
                { icon: GraduationCap, label: 'Siswa Mengajar', val: '180' },
                { icon: Calendar, label: 'Hari Program', val: '30' },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="bg-[#FFFFFF] p-4 rounded-[20px] shadow-[0_1px_2px_rgba(11,27,58,0.04),0_8px_20px_-4px_rgba(11,27,58,0.06)] hover:-translate-y-1 transition-transform duration-200 flex items-center gap-3.5"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-[#FFF1F2] text-[#D7141F] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-[#0B1B3A] tracking-tight leading-none">
                        {stat.val}
                      </div>
                      <div className="text-xs font-semibold text-slate-400 mt-1">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* ================= 3. ALUR & PROGRES SKOMDA MENGAJAR (6-STEP TRACKER) ================= */}
        <section className="bg-[#FFFFFF] rounded-[24px] p-6 sm:p-8 lg:p-10 shadow-[0_1px_3px_rgba(11,27,58,0.04),0_12px_32px_-8px_rgba(11,27,58,0.08)] space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0B1B3A] tracking-tight">
                Alur & Progres Skomda Mengajar
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
                Pantau tahap pengerjaan berjalan dari pembagian regu hingga penyerahan laporan akhir.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1F2] text-[#D7141F] text-xs font-bold self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-[#D7141F] animate-pulse" />
              <span>Fase Aktif: 04. Siapkan Desain</span>
            </div>
          </div>

          {/* Stepper Steps (Step 01-03 Completed, Step 04 Active, Step 05-06 Locked) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 relative">
            {[
              {
                step: '01',
                title: 'Bentuk Kelompok',
                sub: 'Selesai 20 Jan',
                type: 'completed',
              },
              {
                step: '02',
                title: 'Pilih Ketua',
                sub: 'Selesai 28 Jan',
                type: 'completed',
              },
              {
                step: '03',
                title: 'Susun Materi',
                sub: 'Selesai 05 Feb',
                type: 'completed',
              },
              {
                step: '04',
                title: 'Siapkan Desain',
                sub: 'Tenggat 15 Feb',
                type: 'active',
              },
              {
                step: '05',
                title: 'Mengajar di SMP',
                sub: 'Mulai 18 Feb',
                type: 'locked',
              },
              {
                step: '06',
                title: 'Laporan & LPJ',
                sub: 'Batas 28 Feb',
                type: 'locked',
              },
            ].map((st, idx) => {
              const isCompleted = st.type === 'completed';
              const isActive = st.type === 'active';
              const isLocked = st.type === 'locked';

              return (
                <div
                  key={st.step}
                  className={`p-4 rounded-[20px] transition-all duration-200 flex flex-col justify-between space-y-3 ${
                    isActive
                      ? 'bg-[#FFFFFF] shadow-[0_1px_3px_rgba(215,20,31,0.08),0_12px_24px_-6px_rgba(215,20,31,0.12)] ring-2 ring-[#D7141F]'
                      : isCompleted
                      ? 'bg-slate-50/70 shadow-xs'
                      : 'bg-slate-50/40 opacity-70'
                  }`}
                >
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-center justify-between">
                    {/* Circle Node Icon */}
                    {isCompleted && (
                      <div className="w-8 h-8 rounded-full bg-[#D7141F] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}

                    {isActive && (
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-white text-[#D7141F] border-2 border-[#D7141F] flex items-center justify-center shadow-[0_0_0_6px_rgba(215,20,31,0.15)] animate-pulse">
                          <Pencil className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      </div>
                    )}

                    {isLocked && (
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold">
                        {st.step}
                      </div>
                    )}

                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700'
                          : isActive
                          ? 'bg-[#D7141F] text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isCompleted ? 'Tuntas' : isActive ? 'Aktif' : 'Terkunci'}
                    </span>
                  </div>

                  {/* Title & Deadline */}
                  <div>
                    <h3
                      className={`text-xs font-bold leading-tight ${
                        isActive ? 'text-[#0B1B3A] font-extrabold' : 'text-slate-800'
                      }`}
                    >
                      {st.step}. {st.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                      {st.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= 4. PEMBAGIAN KELOMPOK (CATEGORY FILTERS & 6-CARD GRID) ================= */}
        <section className="space-y-6">
          
          {/* Header & Filter Controls Bar */}
          <div className="bg-[#FFFFFF] rounded-[24px] p-6 shadow-[0_1px_3px_rgba(11,27,58,0.04),0_12px_32px_-8px_rgba(11,27,58,0.08)] space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0B1B3A] tracking-tight">
                  Pembagian Kelompok
                </h2>
                <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
                  Posisi tim Anda disematkan di kartu utama. Telusuri kelompok sekolah mitra lainnya.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama SMP, kelompok, ketua..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 rounded-full border-0 focus:ring-2 focus:ring-[#D7141F]/30 text-[#0B1B3A] placeholder-slate-400 transition"
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

            {/* Category Filter Pills (Active: solid #0B1B3A) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
              {[
                { id: 'all', label: `Semua (${enrichedGroups.length})` },
                { id: 'sidoarjo-candi', label: 'Sidoarjo & Candi' },
                { id: 'buduran-sedati', label: 'Buduran & Sedati' },
                { id: 'waru-taman', label: 'Waru & Taman' },
                { id: 'porong-krian', label: 'Porong & Krian' },
                {
                  id: 'no-leader',
                  label: `Belum Ada Ketua (${enrichedGroups.filter((g) => g.isLeaderPending).length})`,
                },
              ].map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleCategoryChange(tab.id)}
                    className={`px-4 py-2 rounded-full font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#0B1B3A] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6-Card Grid (3 Columns x 2 Rows) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedGroups.map((group, idx) => {
              const isMyGroup = group.isMyGroup;
              const isPending = group.isLeaderPending;

              // ================= CARD 1: PINNED LOGGED-IN USER GROUP =================
              if (isMyGroup) {
                return (
                  <div
                    key={group.id}
                    className="bg-[#FFFFFF] rounded-[24px] p-6 shadow-[0_1px_3px_rgba(11,27,58,0.06),0_16px_36px_-8px_rgba(215,20,31,0.12)] border-t-4 border-[#D7141F] flex flex-col justify-between space-y-5 hover:-translate-y-1 transition-all duration-300 relative"
                  >
                    {/* Header */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-3 py-0.5 rounded-full bg-[#FFF1F2] text-[#D7141F] font-extrabold text-[11px] tracking-wide">
                          KELOMPOK {group.number} • {group.district}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                          Posisi Kelompokmu
                        </span>
                      </div>

                      <h3 className="text-xl font-extrabold text-[#0B1B3A] tracking-tight">
                        {group.schoolName}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        Pembimbing: <strong className="text-slate-700">{group.mentorName.split(',')[0]}</strong>
                      </p>
                    </div>

                    {/* Middle: Integrated SVG Circular Progress Ring */}
                    <div className="p-4 rounded-[20px] bg-slate-50/80 flex items-center gap-4">
                      {/* SVG Circular Ring */}
                      <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                          {/* Track */}
                          <circle
                            cx="32"
                            cy="32"
                            r={radius}
                            stroke="#E2E8F0"
                            strokeWidth="5"
                            fill="transparent"
                          />
                          {/* Animated Progress Stroke */}
                          <circle
                            cx="32"
                            cy="32"
                            r={radius}
                            stroke="#D7141F"
                            strokeWidth="5"
                            strokeLinecap="round"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={progressLoaded ? strokeOffset : circumference}
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center font-extrabold text-xs text-[#0B1B3A]">
                          67%
                        </div>
                      </div>

                      {/* Text info next to ring */}
                      <div>
                        <div className="text-xs font-extrabold text-[#0B1B3A]">
                          Tahap 4/6 Selesai
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Desain X-Banner & RPP siap review.
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Solid Brand Red Pill Button */}
                    <button
                      onClick={() => navigate('/dashboard/ketua')}
                      className="w-full bg-[#D7141F] hover:bg-[#B80F1A] active:scale-98 text-white font-bold text-xs py-3 rounded-full transition-all duration-200 shadow-[0_4px_14px_rgba(215,20,31,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Buka Dashboard Kelompok</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              }

              // ================= CARDS 2 TO 6: OTHER GROUPS (READ-ONLY) =================
              return (
                <div
                  key={group.id}
                  onClick={() => setSelectedGroupModal(group)}
                  className="bg-[#FFFFFF] rounded-[24px] p-6 shadow-[0_1px_3px_rgba(11,27,58,0.04),0_8px_24px_-6px_rgba(11,27,58,0.06)] hover:shadow-[0_4px_20px_rgba(11,27,58,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer group"
                >
                  {/* Top */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-extrabold text-[11px]">
                        KELOMPOK {group.number}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {group.district}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#0B1B3A] group-hover:text-[#D7141F] transition-colors">
                      {group.schoolName}
                    </h3>
                  </div>

                  {/* Middle Meta */}
                  <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Pembimbing:</span>
                      <span className="font-semibold text-[#0B1B3A] truncate max-w-[160px]">
                        {group.mentorName.split(',')[0]}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Status Ketua:</span>
                      {isPending ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full text-[11px]">
                          <UserX className="w-3 h-3 text-amber-600" />
                          Belum Ditentukan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full text-[11px]">
                          <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                          Sudah Terpilih
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Link */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">
                      {group.memberCount} Siswa terdaftar
                    </span>
                    <span className="inline-flex items-center gap-1 text-[#D7141F] font-bold text-[11px] group-hover:translate-x-1 transition-transform">
                      <span>Lihat 8 Anggota</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="bg-[#FFFFFF] rounded-[24px] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-[0_1px_3px_rgba(11,27,58,0.04),0_8px_20px_-6px_rgba(11,27,58,0.06)]">
              <span className="text-slate-500 font-medium">
                Menampilkan{' '}
                <strong className="text-[#0B1B3A]">
                  {(currentPage - 1) * itemsPerPage + 1}–
                  {Math.min(currentPage * itemsPerPage, totalItems)}
                </strong>{' '}
                dari <strong className="text-[#0B1B3A]">{totalItems}</strong> kelompok
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
                    className={`w-8 h-8 rounded-full font-bold transition cursor-pointer text-xs ${
                      currentPage === page
                        ? 'bg-[#0B1B3A] text-white shadow-xs'
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

      {/* ================= 5. ELEVATED LIGHT THEME FOOTER (NO HARSH BLACK) ================= */}
      <footer className="mt-16 bg-[#FFFFFF] border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 4 Structured Columns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-100">
            {/* Col 1: Brand Info */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-[#0B1B3A] tracking-tight">
                  #SKOMDA
                </span>
                <span className="bg-[#D7141F] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow-xs">
                  MENGAJAR
                </span>
                <span className="text-xs font-bold text-slate-400">#Impact2026</span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed max-w-sm">
                Inisiatif pedagogis terapan & pengabdian digital siswa SMK Telkom Sidoarjo untuk sekolah menengah pertama mitra di Kabupaten Sidoarjo.
              </p>
              <div className="text-[11px] text-slate-400 font-medium">
                Penyelenggara: SMK Telkom Sidoarjo • Yayasan Pendidikan Telkom
              </div>
            </div>

            {/* Col 2: Alur Program */}
            <div className="md:col-span-3 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1B3A]">
                Alur Program
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-500">
                <li className="hover:text-[#D7141F] cursor-pointer transition">01. Pembagian Kelompok (Selesai)</li>
                <li className="hover:text-[#D7141F] cursor-pointer transition">02. Pembentukan Ketua (Selesai)</li>
                <li className="hover:text-[#D7141F] cursor-pointer transition">03. Modul Pembelajaran (Selesai)</li>
                <li className="text-[#D7141F] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D7141F]" />
                  04. Siapkan Desain (Tahap Aktif)
                </li>
                <li className="hover:text-[#D7141F] cursor-pointer transition">05. Mengajar di SMP</li>
                <li className="hover:text-[#D7141F] cursor-pointer transition">06. Laporan & LPJ</li>
              </ul>
            </div>

            {/* Col 3: Panduan & Dokumen */}
            <div className="md:col-span-2 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1B3A]">
                Dokumen & Aset
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-500">
                <li className="hover:text-[#D7141F] cursor-pointer transition">Buku Panduan Siswa</li>
                <li className="hover:text-[#D7141F] cursor-pointer transition">Template X-Banner</li>
                <li className="hover:text-[#D7141F] cursor-pointer transition">Format RPP Kurikulum</li>
                <li className="hover:text-[#D7141F] cursor-pointer transition">Paket Logo & Twibbon</li>
              </ul>
            </div>

            {/* Col 4: Narahubung */}
            <div className="md:col-span-2 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1B3A]">
                Narahubung
              </h4>
              <div className="space-y-1 text-xs text-slate-500">
                <div>Ruang Kurikulum SMK Telkom</div>
                <div>Jl. Raya Pecantingan, Sekardangan</div>
                <a
                  href="mailto:panitia@skomda.sch.id"
                  className="text-[#D7141F] font-semibold hover:underline block pt-1"
                >
                  panitia@skomda.sch.id
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Hairline Signoff */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div>
              © 2026 Skomda Mengajar. Hak cipta dilindungi undang-undang.
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Edisi Katalis IV</span>
              <span>•</span>
              <span>Sidoarjo, Jawa Timur</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Member preview modal for other groups */}
      {selectedGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1B3A]/40 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D7141F] text-white font-extrabold text-[10px] uppercase">
                  KELOMPOK {selectedGroupModal.number}
                </span>
                <h3 className="text-xl font-bold text-[#0B1B3A] mt-1.5">
                  {selectedGroupModal.schoolName}
                </h3>
                <p className="text-xs text-slate-500">
                  Pembimbing: {selectedGroupModal.mentorName}
                </p>
              </div>
              <button
                onClick={() => setSelectedGroupModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-2">
              <div className="divide-y divide-slate-100 rounded-2xl overflow-hidden text-xs">
                {generateMockMembers(
                  selectedGroupModal.number,
                  selectedGroupModal.leaderName,
                  !selectedGroupModal.leaderName.includes('Belum')
                ).map((m, idx) => (
                  <div key={m.id} className="p-3 flex items-center justify-between hover:bg-slate-50/80">
                    <div>
                      <span className="font-bold text-[#0B1B3A]">{idx + 1}. {m.name}</span>
                      <div className="text-[11px] text-slate-400">NIS: {m.nis}</div>
                    </div>
                    <span className="text-[11px] text-slate-500 font-semibold">{m.role}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedGroupModal(null)}
                className="px-5 py-2 bg-[#0B1B3A] text-white rounded-full text-xs font-bold cursor-pointer"
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
