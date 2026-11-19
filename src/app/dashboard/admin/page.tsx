"use client";

import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { groupsData } from '../../../data/mockData';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Bell,
  Upload,
  Download,
  Check,
  X,
  FileCheck,
  Send,
  QrCode,
  Star,
  ExternalLink,
  Edit3,
  UserPlus,
  ArrowRight,
  Layers
} from 'lucide-react';

export const AdminDashboardWorkspace: React.FC = () => {
  const { navigate, showToast } = useApp();

  // Selected Group for Drill-down detail view (null = Master Table view)
  const [selectedGroupDetail, setSelectedGroupDetail] = useState<typeof groupsData[0] | null>(null);

  // Group Detail Tabs
  const [groupDetailTab, setGroupDetailTab] = useState<'anggota' | 'berkas' | 'qr'>('berkas');

  // Slide-over Quick Review Drawer State
  const [reviewDrawerGroup, setReviewDrawerGroup] = useState<typeof groupsData[0] | null>(null);
  const [reviewComment, setReviewComment] = useState('');

  // Setup / Assign Leader Modal State
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [assignLeaderGroupNum, setAssignLeaderGroupNum] = useState('23');
  const [newLeaderName, setNewLeaderName] = useState('');

  // Master Table Filters & Search
  const [statusTab, setStatusTab] = useState<'all' | 'review' | 'late' | 'no-leader'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Active Admin Groups with mutable state
  const [groupsList, setGroupsList] = useState(() => {
    return groupsData.map((g) => {
      const num = parseInt(g.number, 10);
      const isNoLeader = num === 23 || num === 24 || g.leaderName.includes('Belum');
      return {
        ...g,
        hasLeader: !isNoLeader,
        leaderName: isNoLeader ? 'Belum Ada Ketua' : g.leaderName,
        currentStage: g.currentStep || (num % 2 === 0 ? 3 : 4),
        reviewStatus:
          isNoLeader
            ? 'belumKetua'
            : num === 3 || num === 2 || num === 6 || num === 12
            ? 'review'
            : num === 7 || num === 4
            ? 'terlambat'
            : num === 5
            ? 'revisi'
            : 'disetujui',
      };
    });
  });

  // Filtered Groups
  const filteredGroups = useMemo(() => {
    return groupsList.filter((g) => {
      if (statusTab === 'review' && g.reviewStatus !== 'review') return false;
      if (statusTab === 'late' && g.reviewStatus !== 'terlambat' && g.reviewStatus !== 'revisi') return false;
      if (statusTab === 'no-leader' && g.hasLeader) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSchool = g.schoolName.toLowerCase().includes(q);
        const matchesNum = `kelompok ${g.number}`.toLowerCase().includes(q) || `kel-${g.number}`.toLowerCase().includes(q);
        const matchesLeader = g.leaderName.toLowerCase().includes(q);
        const matchesDist = g.district.toLowerCase().includes(q);
        return matchesSchool || matchesNum || matchesLeader || matchesDist;
      }
      return true;
    });
  }, [groupsList, statusTab, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage) || 1;
  const paginatedGroups = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredGroups.slice(start, start + itemsPerPage);
  }, [filteredGroups, currentPage]);

  // Handle Quick Review Action
  const handleReviewDecision = (decision: 'approved' | 'revision') => {
    if (!reviewDrawerGroup) return;
    const targetId = reviewDrawerGroup.id;
    setGroupsList((prev) =>
      prev.map((g) =>
        g.id === targetId ? { ...g, reviewStatus: decision === 'approved' ? 'disetujui' : 'revisi' } : g
      )
    );
    showToast(
      decision === 'approved'
        ? `Berkas ${reviewDrawerGroup.schoolName} berhasil Disetujui.`
        : `Revisi dikirim ke Ketua ${reviewDrawerGroup.schoolName}.`,
      decision === 'approved' ? 'success' : 'info'
    );
    setReviewDrawerGroup(null);
    setReviewComment('');
  };

  // Handle Assign Leader
  const handleAssignLeaderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeaderName.trim()) return;
    setGroupsList((prev) =>
      prev.map((g) =>
        g.number === assignLeaderGroupNum
          ? { ...g, leaderName: newLeaderName.trim(), hasLeader: true, reviewStatus: 'disetujui' }
          : g
      )
    );
    showToast(`Ketua untuk Kelompok ${assignLeaderGroupNum} berhasil ditetapkan: ${newLeaderName}`, 'success');
    setNewLeaderName('');
    setIsSetupModalOpen(false);
  };

  const pendingCount = groupsList.filter((g) => g.reviewStatus === 'review').length;
  const lateCount = groupsList.filter((g) => g.reviewStatus === 'terlambat' || g.reviewStatus === 'revisi').length;
  const noLeaderCount = groupsList.filter((g) => !g.hasLeader).length;

  return (
    <div className="w-full min-h-screen bg-[#F4F4F5] text-slate-900 font-sans antialiased selection:bg-red-500 selection:text-white flex flex-col">
      
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-black text-slate-900 tracking-tight">#SKOMDA</span>
            <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
              ADMIN PANEL
            </span>
            <span className="hidden sm:inline-block text-xs font-semibold text-slate-400 border-l border-slate-200 pl-3">
              Monitoring 24 Kelompok SMP
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3.5 py-1.5 rounded-full text-xs text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-red-600" />
              <span>Tahap 3/6 • Tenggat 15 Feb</span>
            </div>

            <button
              onClick={() => navigate('/')}
              className="text-xs font-semibold text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition cursor-pointer"
            >
              Lihat Publik
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-xs">
                PI
              </div>
              <div className="hidden sm:block text-left text-xs">
                <div className="font-bold text-slate-800">Pak Indra</div>
                <div className="text-[10px] text-slate-400">Koordinator</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col md:flex-row gap-6">
        
        {/* ================= LEFT PILL SIDEBAR ================= */}
        <aside className="w-full md:w-60 shrink-0 space-y-2">
          <div className="bg-white rounded-[24px] border border-slate-200/80 p-2.5 shadow-xs space-y-1">
            <button
              onClick={() => { setSelectedGroupDetail(null); setStatusTab('all'); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs transition cursor-pointer ${
                !selectedGroupDetail && statusTab === 'all'
                  ? 'bg-red-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 font-semibold'
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Semua Kelompok</span>
              </div>
              <span className="text-[10px] font-bold">24</span>
            </button>

            <button
              onClick={() => { setSelectedGroupDetail(null); setStatusTab('review'); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs transition cursor-pointer ${
                !selectedGroupDetail && statusTab === 'review'
                  ? 'bg-red-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 font-semibold'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Antrean Review</span>
              </div>
              {pendingCount > 0 && (
                <span className="px-2 py-0.2 rounded-full bg-amber-500 text-white font-black text-[10px]">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsSetupModalOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs text-slate-600 hover:bg-slate-100 font-semibold transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                <span>Persiapan & Ketua</span>
              </div>
              {noLeaderCount > 0 && (
                <span className="px-2 py-0.2 rounded-full bg-red-100 text-red-700 font-black text-[10px]">
                  {noLeaderCount}
                </span>
              )}
            </button>

            <button
              onClick={() => showToast('Membuka rekap Feedback & Evaluasi SMP...', 'info')}
              className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-full text-xs text-slate-600 hover:bg-slate-100 font-semibold transition cursor-pointer"
            >
              <Star className="w-4 h-4" />
              <span>Feedback SMP</span>
            </button>

            <button
              onClick={() => showToast('Mengekspor rekap program ke Excel...', 'success')}
              className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-full text-xs text-slate-600 hover:bg-slate-100 font-semibold transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Laporan & Ekspor</span>
            </button>
          </div>
        </aside>

        {/* ================= RIGHT MAIN VIEW ================= */}
        <main className="flex-1 min-w-0">
          
          {/* ================= VIEW A: MASTER TABLE ================= */}
          {!selectedGroupDetail && (
            <div className="space-y-6">
              
              {/* Top Greeting Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Halo, Pak Indra 👋</span>
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pantau progres dan kelola seluruh kelompok Skomda Mengajar.
                  </p>
                </div>

                {noLeaderCount > 0 && (
                  <div
                    onClick={() => setIsSetupModalOpen(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold cursor-pointer hover:bg-amber-100 transition"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>{noLeaderCount} kelompok belum memiliki ketua (KEL-23 & 24)</span>
                    <span className="text-red-600 underline ml-1">Tandai Ketua →</span>
                  </div>
                )}
              </div>

              {/* Sub-Navigation Underline Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
                {[
                  { id: 'all', label: `Semua Kelompok (${groupsList.length})` },
                  { id: 'review', label: `Menunggu Review (${pendingCount})`, badge: pendingCount },
                  { id: 'late', label: `Terlambat / Revisi (${lateCount})` },
                  { id: 'no-leader', label: `Belum Ada Ketua (${noLeaderCount})` },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setStatusTab(t.id as any); setCurrentPage(1); }}
                    className={`px-3 py-1.5 rounded-full transition cursor-pointer ${
                      statusTab === t.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Pill Action & Search Bar */}
              <div className="bg-white/90 backdrop-blur-xs rounded-full border border-slate-200/80 p-2 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                <button
                  onClick={() => setIsSetupModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer transition"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Tandai Ketua / Impor</span>
                </button>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari kelompok, SMP, atau ketua..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Rounded White Data Table Card */}
              <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-100 rounded-full text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-4 rounded-l-full">ID Kelompok</th>
                        <th className="py-3 px-3">SMP Tujuan</th>
                        <th className="py-3 px-3">Ketua Kelompok</th>
                        <th className="py-3 px-3">Tahap & Progres</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-4 text-right rounded-r-full">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedGroups.map((g) => {
                        const isPending = g.reviewStatus === 'review';
                        const isLate = g.reviewStatus === 'terlambat';
                        const isRev = g.reviewStatus === 'revisi';
                        const isNoLead = g.reviewStatus === 'belumKetua';

                        return (
                          <tr
                            key={g.id}
                            onClick={() => setSelectedGroupDetail(g)}
                            className="hover:bg-slate-50/80 transition cursor-pointer group"
                          >
                            <td className="py-3.5 px-4 font-black text-slate-900 group-hover:text-red-600 transition">
                              KEL-{g.number}
                            </td>

                            <td className="py-3.5 px-3">
                              <div className="font-bold text-slate-900">{g.schoolName}</div>
                              <div className="text-[11px] text-slate-400">{g.district}</div>
                            </td>

                            <td className="py-3.5 px-3">
                              <div className={`font-semibold ${isNoLead ? 'text-amber-700 italic' : 'text-slate-700'}`}>
                                {g.leaderName}
                              </div>
                            </td>

                            <td className="py-3.5 px-3">
                              <div className="font-bold text-slate-800">
                                Tahap {g.currentStage} • 3/5 Berkas
                              </div>
                              <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    isPending ? 'bg-amber-500 w-3/5' : isLate ? 'bg-red-500 w-2/5' : 'bg-emerald-500 w-4/5'
                                  }`}
                                />
                              </div>
                            </td>

                            <td className="py-3.5 px-3">
                              {isPending ? (
                                <span className="font-bold text-amber-600">Menunggu Review</span>
                              ) : isLate ? (
                                <span className="font-bold text-red-600">Terlambat 2 Hari</span>
                              ) : isRev ? (
                                <span className="font-bold text-orange-600">Perlu Revisi</span>
                              ) : isNoLead ? (
                                <span className="font-bold text-slate-400">Belum Ada Ketua</span>
                              ) : (
                                <span className="font-bold text-emerald-600">Disetujui</span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              {isPending ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setReviewDrawerGroup(g);
                                  }}
                                  className="px-3.5 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer transition"
                                >
                                  Review
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedGroupDetail(g);
                                  }}
                                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
                                >
                                  Detail →
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Pill Bar */}
                <div className="pt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                  <div>
                    Menampilkan <strong>{paginatedGroups.length}</strong> dari <strong>{filteredGroups.length}</strong> kelompok
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        onClick={() => setCurrentPage(pg)}
                        className={`w-7 h-7 rounded-full font-bold text-xs cursor-pointer ${
                          currentPage === pg ? 'bg-red-600 text-white' : 'border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {pg}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= VIEW B: PER-GROUP DETAIL & CUSTOMIZATION ================= */}
          {selectedGroupDetail && (
            <div className="space-y-6">
              
              {/* Top Back Action & Group Header */}
              <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-4">
                <button
                  onClick={() => setSelectedGroupDetail(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-full transition cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>← Kembali ke Daftar Kelompok</span>
                </button>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-[10px] uppercase">
                        KELOMPOK {selectedGroupDetail.number}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {selectedGroupDetail.district}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      {selectedGroupDetail.schoolName}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Ketua: <strong className="text-slate-800">{selectedGroupDetail.leaderName}</strong> • Pembimbing: <strong className="text-slate-800">{selectedGroupDetail.mentorName}</strong>
                    </p>
                  </div>

                  {/* Manual Stage Adjustment Dropdown */}
                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-600">Sesuaikan Tahap:</span>
                    <select
                      value={selectedGroupDetail.currentStage}
                      onChange={(e) => {
                        const newStage = parseInt(e.target.value, 10);
                        setSelectedGroupDetail({ ...selectedGroupDetail, currentStage: newStage });
                        setGroupsList((prev) =>
                          prev.map((g) => (g.id === selectedGroupDetail.id ? { ...g, currentStage: newStage } : g))
                        );
                        showToast(`Tahap Kelompok ${selectedGroupDetail.number} diubah ke Tahap ${newStage}`, 'info');
                      }}
                      className="bg-white border border-slate-200 text-xs font-bold rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
                    >
                      <option value={1}>Tahap 01: Bentuk Tim</option>
                      <option value={2}>Tahap 02: Pilih Ketua</option>
                      <option value={3}>Tahap 03: Susun Modul</option>
                      <option value={4}>Tahap 04: Siapkan Desain</option>
                      <option value={5}>Tahap 05: Mengajar di SMP</option>
                      <option value={6}>Tahap 06: Evaluasi & LPJ</option>
                    </select>
                  </div>
                </div>

                {/* Sub Tabs */}
                <div className="flex gap-2 border-t border-slate-100 pt-4 text-xs font-bold">
                  {[
                    { id: 'berkas', label: '5 Berkas Wajib' },
                    { id: 'anggota', label: 'Anggota & Peran' },
                    { id: 'qr', label: 'QR Code & Feedback SMP' },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setGroupDetailTab(sub.id as any)}
                      className={`px-4 py-2 rounded-full transition cursor-pointer ${
                        groupDetailTab === sub.id
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* TAB 1: 5 BERKAS WAJIB */}
              {groupDetailTab === 'berkas' && (
                <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Validasi Berkas Wajib Kelompok</h3>
                  <div className="divide-y divide-slate-100 text-xs">
                    {[
                      { name: 'RPP & Silabus Pembelajaran', file: 'RPP_Modul_v2.pdf', status: 'Disetujui', color: 'emerald' },
                      { name: 'Slide Presentasi PPT Canva', file: 'Slide_Materi_Canva.pptx', status: 'Perlu Revisi', color: 'orange' },
                      { name: 'Desain X-Banner 60x160 cm', file: 'X-Banner_v2.pdf', status: 'Menunggu Review', color: 'amber' },
                      { name: 'Aset Feed Instagram (1:1)', file: 'Feed_Anggota_8_Siswa.zip', status: 'Disetujui', color: 'emerald' },
                      { name: 'Laporan Akhir Pengajaran', file: 'Draf_Belum_Submit', status: 'Belum Dikumpulkan', color: 'slate' },
                    ].map((doc, i) => (
                      <div key={i} className="py-3.5 flex items-center justify-between gap-4">
                        <div>
                          <div className="font-bold text-slate-900">{doc.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">{doc.file}</div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-0.5 rounded-full font-bold text-[11px] ${
                              doc.color === 'emerald'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : doc.color === 'amber'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : doc.color === 'orange'
                                ? 'bg-orange-50 text-orange-700 border border-orange-200'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {doc.status}
                          </span>

                          <button
                            onClick={() => showToast(`Memperbarui status berkas ${doc.name}...`, 'info')}
                            className="text-xs font-semibold text-slate-600 hover:text-red-600 border border-slate-200 px-3 py-1 rounded-full cursor-pointer hover:bg-slate-50"
                          >
                            Ubah Status
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: ANGGOTA & PERAN */}
              {groupDetailTab === 'anggota' && (
                <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Daftar Anggota Tim & Manajemen Akses</h3>
                    <span className="text-xs text-slate-500">8 Siswa Terdaftar</span>
                  </div>

                  <div className="divide-y divide-slate-100 text-xs">
                    {[
                      { name: selectedGroupDetail.leaderName, role: 'Ketua Kelompok', isLeader: true, nis: '54124101' },
                      { name: 'Nabila Putri R.', role: 'Notulen & Sekretaris', nis: '54124102' },
                      { name: 'Rafi Fadillah', role: 'Desain Grafis', nis: '54124103' },
                      { name: 'Dinda Salsabila', role: 'Koord. Materi', nis: '54124104' },
                      { name: 'M. Arya Bima', role: 'Dokumentasi', nis: '54124105' },
                      { name: 'Siti Aisyah', role: 'Logistik', nis: '54124106' },
                      { name: 'Bagas Pratama', role: 'Logistik', nis: '54124107' },
                      { name: 'Zahra Amelia', role: 'Dokumentasi', nis: '54124108' },
                    ].map((m, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{m.name}</span>
                            {m.isLeader && (
                              <span className="text-[10px] font-extrabold bg-red-600 text-white px-2 py-0.2 rounded-full">
                                KETUA AKTIF
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">NIS: {m.nis}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md">
                            {m.role}
                          </span>
                          {!m.isLeader && (
                            <button
                              onClick={() => {
                                setSelectedGroupDetail({ ...selectedGroupDetail, leaderName: m.name });
                                showToast(`Akses ketua dialihkan ke ${m.name}`, 'success');
                              }}
                              className="text-[11px] text-red-600 font-bold hover:underline cursor-pointer"
                            >
                              Jadikan Ketua
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: QR CODE & FEEDBACK SMP */}
              {groupDetailTab === 'qr' && (
                <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-4 text-center p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <QrCode className="w-32 h-32 mx-auto text-slate-800" />
                      <div className="text-xs font-bold text-slate-700">QR Code Resmi {selectedGroupDetail.schoolName}</div>
                      <button
                        onClick={() => showToast('Mengunduh QR Code PNG...', 'success')}
                        className="w-full py-2 bg-red-600 text-white text-xs font-bold rounded-full cursor-pointer"
                      >
                        Unduh QR Code
                      </button>
                    </div>

                    <div className="md:col-span-8 space-y-3">
                      <h4 className="font-bold text-slate-900 text-sm">Masukan dari Guru & Siswa SMP Mitra</h4>
                      <div className="space-y-2 text-xs">
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">Pak Hendro, S.Pd. (Kepala Lab Komputer)</span>
                            <span className="text-amber-500 font-bold">★★★★★</span>
                          </div>
                          <p className="text-slate-600 text-[11px]">
                            "Siswa SMK Telkom sangat komunikatif dan santun. Pembelajaran Scratch sangat menarik untuk siswa kami."
                          </p>
                        </div>

                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">Siswa Kelas 8B SMPN 1 Buduran</span>
                            <span className="text-amber-500 font-bold">★★★★★</span>
                          </div>
                          <p className="text-slate-600 text-[11px]">
                            "Kakak-kakaknya asyik banget, kuis berhadiahnya seru!"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </main>
      </div>

      {/* ================= QUICK REVIEW SLIDE-OVER DRAWER ================= */}
      {reviewDrawerGroup && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-[10px] uppercase">
                    Review Berkas KEL-{reviewDrawerGroup.number}
                  </span>
                  <h3 className="font-black text-base text-slate-900 mt-1">
                    {reviewDrawerGroup.schoolName}
                  </h3>
                </div>
                <button
                  onClick={() => setReviewDrawerGroup(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* File Info */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-800">X-Banner_{reviewDrawerGroup.district}_v2.pdf</div>
                <div className="text-slate-500 text-[11px]">14.8 MB • Diajukan oleh {reviewDrawerGroup.leaderName}</div>
                <div className="text-slate-600 text-[11px] pt-1 border-t border-slate-200">
                  Resolusi: 300 DPI • Bleed: 1 cm • CMYK Ready
                </div>
              </div>

              {/* Advisor Notes Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Catatan Masukan Pembimbing</label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Ketik catatan perbaikan jika meminta revisi..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Decision Buttons */}
            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => handleReviewDecision('revision')}
                className="flex-1 py-2.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs cursor-pointer transition"
              >
                Minta Revisi
              </button>
              <button
                onClick={() => handleReviewDecision('approved')}
                className="flex-1 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer transition"
              >
                Setujui Berkas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SETUP / ASSIGN LEADER MODAL ================= */}
      {isSetupModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base">Tandai Ketua / Impor Data</h3>
              <button
                onClick={() => setIsSetupModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Tentukan ketua untuk kelompok yang belum memilikinya agar akun login mereka aktif.
            </p>

            <form onSubmit={handleAssignLeaderSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pilih Kelompok</label>
                <select
                  value={assignLeaderGroupNum}
                  onChange={(e) => setAssignLeaderGroupNum(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="23">Kelompok 23 (SMPN 2 Sedati)</option>
                  <option value="24">Kelompok 24 (SMPN 4 Sidoarjo)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Ketua Baru</label>
                <input
                  type="text"
                  required
                  value={newLeaderName}
                  onChange={(e) => setNewLeaderName(e.target.value)}
                  placeholder="misal: Fiona Anggraeni"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSetupModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-red-600 text-white font-bold"
                >
                  Simpan & Aktivasi Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
