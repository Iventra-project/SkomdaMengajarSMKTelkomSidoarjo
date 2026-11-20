"use client";
import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { groupsData, Group, generateMockMembers } from '../../data/mockData';

export const DaftarKelompokPage: React.FC = () => {
  const { navigate, groups } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'sidoarjo-candi' | 'buduran-sedati' | 'waru-taman' | 'has-leader' | 'pending-leader'
  >('all');
  const [selectedRosterGroup, setSelectedRosterGroup] = useState<Group | null>(null);

  const activeGroupList = (groups && groups.length > 0 ? groups : groupsData).filter(
    (g) => g.number !== '00'
  );

  const filteredGroups = useMemo(() => {
    return activeGroupList.filter((g) => {
      const q = searchQuery.toLowerCase().trim();
      const num = parseInt(g.number, 10);
      const isPending = !g.hasLeader || num === 23 || num === 24 || g.leaderName.includes('Belum');
      const districtLower = g.district.toLowerCase();

      const hit =
        !q ||
        g.schoolName.toLowerCase().includes(q) ||
        g.leaderName.toLowerCase().includes(q) ||
        g.mentorName.toLowerCase().includes(q) ||
        g.district.toLowerCase().includes(q) ||
        g.number.includes(q);
      if (!hit) return false;

      if (selectedFilter === 'sidoarjo-candi')
        return districtLower.includes('sidoarjo') || districtLower.includes('candi');
      if (selectedFilter === 'buduran-sedati')
        return districtLower.includes('buduran') || districtLower.includes('sedati');
      if (selectedFilter === 'waru-taman')
        return districtLower.includes('waru') || districtLower.includes('taman');
      if (selectedFilter === 'has-leader') return !isPending;
      if (selectedFilter === 'pending-leader') return isPending;
      return true;
    });
  }, [activeGroupList, searchQuery, selectedFilter]);

  // Statistics counters
  const totalCount = activeGroupList.length;
  const claimedCount = activeGroupList.filter(
    (g) => g.hasLeader && !g.leaderName.includes('Belum')
  ).length;

  return (
    <div className="relative w-full min-h-screen bg-[#FAF9F6] text-slate-900 antialiased flex flex-col justify-between overflow-x-hidden selection:bg-[#E50914]/10 selection:text-[#E50914]">
      {/* Subtle Architectural Dot Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#E50914]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* ══════════════════════════════════════════════════════════════════════════
          TOP FLOATING NAVIGATION PILL
      ══════════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-5 z-40 w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-full bg-[#141416]/95 backdrop-blur-md border border-white/10 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.28)] px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between transition-all">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-300 hover:text-white transition-colors cursor-pointer group"
          >
            <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover:-translate-x-0.5 transition-transform">
              <span className="material-symbols-outlined text-[16px] text-zinc-300 group-hover:text-white">
                arrow_back
              </span>
            </span>
            <span className="uppercase text-[11px] sm:text-xs font-bold">Kembali ke Beranda</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-white text-xs font-extrabold tracking-tight">#SKOMDA</span>
              <span className="bg-[#E50914] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                2026
              </span>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="px-4 py-1.5 bg-[#E50914] hover:bg-[#c90812] text-white text-xs font-bold rounded-full transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Masuk Portal</span>
              <span className="material-symbols-outlined text-[14px]">login</span>
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════════
          MAIN CONTENT AREA (AIRY, UNCLUTTERED, ELEGANT)
      ══════════════════════════════════════════════════════════════════════════ */}
      <main className="relative z-10 w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-16">
        
        {/* Hero Title & Refined Inline Stats */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-2 h-2 rounded-full bg-[#E50914]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#E50914]">
              Direktori Resmi Organisasi Tim
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Skomda Mengajar 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Pembagian Kelompok Mengajar
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mt-2.5 max-w-2xl leading-relaxed">
            Daftar lengkap penempatan 24 kelompok relawan siswa SMK Telkom Sidoarjo di 12 SMP mitra se-Kabupaten Sidoarjo, didampingi guru pembimbing lapangan dan jadwal kegiatan resmi.
          </p>

          {/* Refined Minimalist Stats Pill Strip (Replaces bulky rectangular KPI boxes) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200/80 rounded-full text-xs font-semibold text-slate-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#E50914]" />
              <span><strong>24</strong> Kelompok Relawan</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200/80 rounded-full text-xs font-semibold text-slate-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span><strong>12</strong> SMP Mitra Sidoarjo</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200/80 rounded-full text-xs font-semibold text-slate-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span><strong>{claimedCount}</strong> Ketua Terdaftar</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200/80 rounded-full text-xs font-semibold text-slate-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span><strong>100%</strong> Tersinkronisasi MGMP</span>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            SEARCH & FILTER CONTROLS (SEAMLESS & SPACIOUS, NO BOX FATIGUE)
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input - Clean Pill */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari sekolah, ketua, kecamatan..."
              className="h-11 w-full pl-10 pr-9 text-xs sm:text-sm bg-white border border-slate-200 rounded-full text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#E50914] focus:ring-3 focus:ring-[#E50914]/10 shadow-2xs transition-all"
            />
            <span className="material-symbols-outlined absolute left-3.5 top-3 text-slate-400 text-[18px]">
              search
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Region / Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {(
              [
                ['all', 'Semua'],
                ['sidoarjo-candi', 'Sidoarjo & Candi'],
                ['buduran-sedati', 'Buduran & Sedati'],
                ['waru-taman', 'Waru & Taman'],
                ['has-leader', 'Ketua Terpilih'],
                ['pending-leader', 'Belum Ada Ketua'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedFilter(key)}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  selectedFilter === key
                    ? 'bg-[#141416] text-white shadow-xs'
                    : 'bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Counter and Status Strip */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6 pb-3 border-b border-slate-200/70">
          <span className="font-medium text-slate-700">
            Menampilkan <strong className="text-slate-900">{filteredGroups.length}</strong> dari {totalCount} kelompok
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Sinkronisasi data sekolah &amp; kelompok resmi Skomda Mengajar 2026
          </span>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            GRID OF KELOMPOK CARDS (CLEAN, AIRY & SPACIOUS)
        ══════════════════════════════════════════════════════════════════════ */}
        {filteredGroups.length === 0 ? (
          <div className="py-20 text-center text-slate-400 bg-white rounded-3xl border border-slate-200 shadow-2xs">
            <span className="material-symbols-outlined text-4xl block mb-2 text-slate-300">
              search_off
            </span>
            <p className="text-sm font-bold text-slate-700">Tidak ada kelompok yang sesuai</p>
            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter wilayah.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredGroups.map((group) => {
              const num = parseInt(group.number, 10);
              const isPending = !group.hasLeader || num === 23 || num === 24 || group.leaderName.includes('Belum');

              return (
                <div
                  key={group.id}
                  className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col justify-between transition-all duration-300 group"
                >
                  {/* Subtle Top Indicator Accent */}
                  <div className={`h-1 w-full ${isPending ? 'bg-amber-400' : 'bg-emerald-500'}`} />

                  <div className="p-5 flex flex-col gap-3 flex-1">
                    {/* Header: Kelompok Tag & Status */}
                    <div className="flex items-center justify-between">
                      <span className="bg-slate-100 group-hover:bg-[#E50914] text-slate-900 group-hover:text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider font-mono transition-colors">
                        KEL. {group.number}
                      </span>
                      {isPending ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Belum Ada Ketua
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Ketua Terpilih
                        </span>
                      )}
                    </div>

                    {/* School Title & District */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#E50914] transition-colors leading-snug">
                        {group.schoolName}
                      </h3>
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        <span>Kec. {group.district}</span>
                      </span>
                    </div>

                    {/* Metadata Details Table */}
                    <div className="flex flex-col gap-2 text-xs text-slate-600 mt-auto pt-3.5 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[11px]">Ketua:</span>
                        <span className="font-semibold text-slate-800 truncate max-w-[140px]">
                          {isPending ? 'Belum Ditentukan' : group.leaderName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[11px]">Pembimbing:</span>
                        <span className="font-medium text-slate-700 truncate max-w-[140px]">
                          {group.mentorName.split(',')[0]}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[11px]">Jadwal:</span>
                        <span className="text-slate-700 font-medium">{group.targetDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Action */}
                  <div className="p-3 bg-slate-50/60 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedRosterGroup(group)}
                      className="w-full py-2.5 px-3 bg-white hover:bg-[#141416] text-slate-700 hover:text-white border border-slate-200 hover:border-[#141416] rounded-xl text-xs font-semibold transition-all duration-200 inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">group</span>
                      <span>Lihat Anggota Tim</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ══════════════════════════════════════════════════════════════════════════
          TEAM ROSTER MODAL
      ══════════════════════════════════════════════════════════════════════════ */}
      {selectedRosterGroup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedRosterGroup(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#E50914] text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    Kelompok {selectedRosterGroup.number}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Kec. {selectedRosterGroup.district}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {selectedRosterGroup.schoolName}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Pembimbing: <span className="font-semibold text-slate-700">{selectedRosterGroup.mentorName}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedRosterGroup(null)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Body: Student Roster List */}
            <div className="p-6 overflow-y-auto space-y-2.5 flex-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider pb-1 border-b border-slate-100">
                <span>Daftar Siswa Relawan SMK</span>
                <span>Peran Tim</span>
              </div>

              {generateMockMembers(
                selectedRosterGroup.number,
                selectedRosterGroup.leaderName,
                !selectedRosterGroup.leaderName.includes('Belum') && parseInt(selectedRosterGroup.number, 10) < 23
              ).map((member, idx) => (
                <div
                  key={member.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                    member.isLeader
                      ? 'bg-red-50/50 border-red-200/80'
                      : 'bg-white border-slate-200/70'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        member.isLeader
                          ? 'bg-[#E50914] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="truncate min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {member.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        NIS: {member.nis}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 ${
                      member.isLeader
                        ? 'bg-[#E50914] text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {member.role}
                  </span>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">
                Data resmi MGMP &amp; Skomda Mengajar 2026
              </span>
              <button
                onClick={() => setSelectedRosterGroup(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════════════ */}
      <footer className="relative z-10 w-full border-t border-slate-200/80 py-5 px-6 md:px-12 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 bg-white/80 backdrop-blur-xs">
        <span>SMK Telkom Sidoarjo • Direktorat Kurikulum &amp; Kesiswaan 2026</span>
        <span>Bantuan &amp; Helpdesk: helpdesk@smktelkom-sda.sch.id</span>
      </footer>
    </div>
  );
};
