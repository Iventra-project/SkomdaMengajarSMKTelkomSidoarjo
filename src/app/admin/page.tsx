"use client";
import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { groupsData, Group } from '../../data/mockData';
import {
  Download,
  Megaphone,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
  Send,
  ArrowRight,
  ChevronRight,
  Star,
  FileText,
  Check,
  Lock,
  X,
  ExternalLink,
  Users,
  Calendar,
  Layers,
  ChevronDown,
  Building2,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export const AdminMonitoringPage: React.FC = () => {
  const { navigate, showToast } = useApp();

  // ─── Filter & View States ──────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'action' | 'matrix'>('action');
  const [selectedKpiFilter, setSelectedKpiFilter] = useState<'all' | 'ontrack' | 'overdue' | 'review' | 'revisi'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('ALL');

  // Modals & Popups
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [broadcastAudience, setBroadcastAudience] = useState<'action' | 'all'>('action');
  const [broadcastTitle, setBroadcastTitle] = useState('Pengingat Draf Desain & X-Banner Tahap 04');
  const [broadcastMessage, setBroadcastMessage] = useState(
    'Halo Ketua Regu! Mohon segera finalisasi berkas desain X-Banner dan slide materi sebelum batas waktu 15 Februari 2026. Terima kasih.'
  );

  // ─── KPI Aggregations ──────────────────────────────────────────────────────
  const kpiStats = useMemo(() => {
    const ontrack = groupsData.filter((g) => g.status === 'ontrack').length;
    const overdue = groupsData.filter((g) => g.status === 'overdue').length;
    const review = groupsData.filter((g) => g.status === 'review').length;
    const revisi = groupsData.filter((g) => g.status === 'revisi').length;
    const actionRequired = overdue + review + revisi;
    return { ontrack, overdue, review, revisi, actionRequired, total: groupsData.length };
  }, []);

  // ─── Distinct Schools for Dropdown ─────────────────────────────────────────
  const schoolOptions = useMemo(() => {
    const schools = Array.from(new Set(groupsData.map((g) => g.schoolName))).sort();
    return schools;
  }, []);

  // ─── Filter Logic ──────────────────────────────────────────────────────────
  const filteredActionGroups = useMemo(() => {
    return groupsData.filter((g) => {
      // Must require action unless a specific KPI is selected
      const isAction = g.status === 'review' || g.status === 'overdue' || g.status === 'revisi';
      if (selectedKpiFilter === 'ontrack') {
        // If user specifically clicked ontrack, show ontrack
        if (g.status !== 'ontrack') return false;
      } else if (selectedKpiFilter !== 'all') {
        if (g.status !== selectedKpiFilter) return false;
      } else {
        if (!isAction) return false;
      }

      // Search match
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        g.schoolName.toLowerCase().includes(q) ||
        g.leaderName.toLowerCase().includes(q) ||
        g.district.toLowerCase().includes(q) ||
        g.number.includes(q) ||
        g.featuredModule.toLowerCase().includes(q);

      // School match
      const matchSchool = selectedSchool === 'ALL' || g.schoolName === selectedSchool;

      return matchSearch && matchSchool;
    });
  }, [selectedKpiFilter, searchQuery, selectedSchool]);

  const filteredAllGroups = useMemo(() => {
    return groupsData.filter((g) => {
      if (selectedKpiFilter !== 'all' && g.status !== selectedKpiFilter) return false;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        g.schoolName.toLowerCase().includes(q) ||
        g.leaderName.toLowerCase().includes(q) ||
        g.district.toLowerCase().includes(q) ||
        g.number.includes(q) ||
        g.featuredModule.toLowerCase().includes(q);

      const matchSchool = selectedSchool === 'ALL' || g.schoolName === selectedSchool;

      return matchSearch && matchSchool;
    });
  }, [selectedKpiFilter, searchQuery, selectedSchool]);

  // Handle KPI Click Toggle
  const handleKpiClick = (filter: 'ontrack' | 'overdue' | 'review' | 'revisi') => {
    if (selectedKpiFilter === filter) {
      setSelectedKpiFilter('all');
    } else {
      setSelectedKpiFilter(filter);
      // Auto switch tab if user clicked ontrack
      if (filter === 'ontrack') {
        setActiveTab('matrix');
      } else {
        setActiveTab('action');
      }
    }
  };

  // Broadcast Submission
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBroadcastOpen(false);
    const targetText = broadcastAudience === 'action' ? '8 Ketua Regu (Butuh Tindakan)' : 'seluruh 24 Ketua Regu';
    showToast(`Pesan broadcast berhasil dikirim ke ${targetText} via WhatsApp & Portal Workspace!`, 'success');
  };

  // Export Trigger
  const handleExport = (format: 'CSV' | 'PDF' | 'Excel') => {
    setIsExportOpen(false);
    showToast(`Mengekspor data monitoring kelompok dalam format ${format}...`, 'info');
  };

  // Reminder Trigger
  const handleSendReminder = (group: Group) => {
    showToast(`Pengingat tenggat berhasil dikirim ke WhatsApp Ketua ${group.leaderName} (Kel. ${group.number})`, 'success');
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-row antialiased selection:bg-red-600 selection:text-white">
      {/* ══════════════════════════════════════════════════════════════════════════
          LEFT PERSISTENT SIDEBAR
      ══════════════════════════════════════════════════════════════════════════ */}
      <aside className="w-64 shrink-0 bg-white border-r border-gray-200 min-h-screen p-5 flex flex-col justify-between sticky top-0 h-screen z-30 select-none hidden lg:flex">
        <div className="flex flex-col space-y-6">
          {/* Top Brand Identity */}
          <div className="flex flex-col gap-1.5 pb-4 border-b border-gray-100">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer text-left group">
              <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-xs shadow-xs group-hover:bg-red-700 transition-colors">
                SM
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold tracking-tight text-gray-900">
                    SKOMDA MENGAJAR
                  </span>
                  <span className="bg-red-50 text-red-600 text-[10px] font-bold px-1.5 py-0.2 rounded border border-red-200">
                    ADMIN
                  </span>
                </div>
                <span className="text-[10px] font-medium text-gray-400 block">SMK Telkom Sidoarjo</span>
              </div>
            </button>
          </div>

          {/* Status Badge */}
          <div className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-gray-700">Tahun Ajaran 2026</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Aktif
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab('action');
                setSelectedKpiFilter('all');
              }}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-left cursor-pointer ${
                activeTab === 'action'
                  ? 'bg-red-600 text-white shadow-xs font-bold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>Pantau Kelompok</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === 'action' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                24
              </span>
            </button>

            <button
              onClick={() => navigate('/dashboard/admin/review')}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-amber-500" />
                <span>Review Berkas</span>
              </div>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                {kpiStats.review} Baru
              </span>
            </button>

            <button
              onClick={() => navigate('/workspace')}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <ExternalLink className="w-4 h-4 text-gray-400" />
                <span>Workspace Tim</span>
              </div>
              <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                Siswa
              </span>
            </button>
          </nav>
        </div>

        {/* Bottom User Profile */}
        <div className="p-3 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              AK
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-gray-900 truncate">Admin Kurikulum</span>
              <span className="text-[10px] text-gray-400 truncate">admin@telkomsda.sch.id</span>
            </div>
          </div>
          <button
            onClick={() => {
              navigate('/');
              showToast('Kembali ke beranda utama', 'info');
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
            title="Kembali ke Beranda"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════════════════
          MAIN VIEWPORT (NO MORE ENDLESS SCROLLING)
      ══════════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 min-w-0 flex flex-col bg-gray-50 min-h-screen">
        {/* Sticky Utility Header */}
        <header className="w-full bg-white border-b border-gray-200 px-6 sm:px-8 h-16 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              <span>Beranda</span>
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Konsol Akademik
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full text-gray-600 text-xs font-mono border border-gray-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sinkronisasi Otomatis</span>
            </div>
            <button
              onClick={() => navigate('/workspace')}
              className="inline-flex items-center gap-1.5 px-3 h-8.5 rounded-xl border border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-100 text-xs font-bold transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              <span>Buka Workspace</span>
            </button>
          </div>
        </header>

        {/* Dashboard Main Canvas */}
        <main className="w-full max-w-[1440px] mx-auto p-5 sm:p-7 md:p-8 space-y-6">
          {/* ══════════════════════════════════════════════════════════════════════
              1. TOP HEADER & ACTION BAR
          ══════════════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200/80">
            {/* Left Title & Subtle Badge */}
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Pantau Kelompok
              </h1>
              <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full border border-gray-200">
                24 Kelompok Terdaftar
              </span>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-3 relative">
              {/* Secondary Outline Button: Ekspor Data */}
              <div className="relative">
                <button
                  onClick={() => setIsExportOpen(!isExportOpen)}
                  className="h-10 px-4 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
                >
                  <Download className="w-4 h-4 text-gray-500" />
                  <span>Ekspor Data</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {isExportOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg p-1.5 z-40 text-xs animate-in fade-in duration-150">
                    <button
                      onClick={() => handleExport('CSV')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 font-medium text-gray-700 flex items-center justify-between cursor-pointer"
                    >
                      <span>Ekspor Format CSV</span>
                      <span className="text-[10px] text-gray-400">.csv</span>
                    </button>
                    <button
                      onClick={() => handleExport('Excel')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 font-medium text-gray-700 flex items-center justify-between cursor-pointer"
                    >
                      <span>Ekspor Format Excel</span>
                      <span className="text-[10px] text-gray-400">.xlsx</span>
                    </button>
                    <button
                      onClick={() => handleExport('PDF')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 font-medium text-gray-700 flex items-center justify-between cursor-pointer"
                    >
                      <span>Ekspor Ringkasan PDF</span>
                      <span className="text-[10px] text-gray-400">.pdf</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Primary Red Button: Broadcast Pesan */}
              <button
                onClick={() => setIsBroadcastOpen(true)}
                className="h-10 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-xs hover:shadow-sm cursor-pointer"
              >
                <Megaphone className="w-4 h-4" />
                <span>Broadcast Pesan</span>
              </button>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              2. INTERACTIVE 4-CARD KPI SUMMARY (CLICKABLE FILTERS)
          ══════════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Sesuai Jadwal */}
            <div
              onClick={() => handleKpiClick('ontrack')}
              className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs hover:shadow-md ${
                selectedKpiFilter === 'ontrack'
                  ? 'border-emerald-500 ring-2 ring-emerald-100 bg-emerald-50/20'
                  : 'border-gray-200/90 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-600">Sesuai Jadwal</span>
                <span className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight leading-none">
                  {String(kpiStats.ontrack).padStart(2, '0')}
                </span>
                <span className="text-xs font-semibold text-gray-400">Kelompok</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-emerald-700 font-medium">
                <span>Pelaksanaan on-track</span>
                {selectedKpiFilter === 'ontrack' && <span className="font-bold">Aktif ✓</span>}
              </div>
            </div>

            {/* Card 2: Terlambat / Kritis */}
            <div
              onClick={() => handleKpiClick('overdue')}
              className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs hover:shadow-md ${
                selectedKpiFilter === 'overdue'
                  ? 'border-red-600 ring-2 ring-red-100 bg-red-50/20'
                  : 'border-gray-200/90 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-600">Terlambat / Kritis</span>
                <span className="w-8 h-8 rounded-xl bg-red-50 border border-red-200/60 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-red-600 tracking-tight leading-none">
                  {String(kpiStats.overdue).padStart(2, '0')}
                </span>
                <span className="text-xs font-semibold text-gray-400">Kelompok</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-red-600 font-medium">
                <span>Butuh pengingat segera</span>
                {selectedKpiFilter === 'overdue' && <span className="font-bold">Aktif ✓</span>}
              </div>
            </div>

            {/* Card 3: Menunggu Review */}
            <div
              onClick={() => handleKpiClick('review')}
              className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs hover:shadow-md ${
                selectedKpiFilter === 'review'
                  ? 'border-amber-500 ring-2 ring-amber-100 bg-amber-50/20'
                  : 'border-gray-200/90 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-600">Menunggu Review</span>
                <span className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-amber-600" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-amber-600 tracking-tight leading-none">
                  {String(kpiStats.review).padStart(2, '0')}
                </span>
                <span className="text-xs font-semibold text-gray-400">Berkas</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-amber-700 font-medium">
                <span>Draf X-Banner & RPP</span>
                {selectedKpiFilter === 'review' && <span className="font-bold">Aktif ✓</span>}
              </div>
            </div>

            {/* Card 4: Perlu Revisi */}
            <div
              onClick={() => handleKpiClick('revisi')}
              className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs hover:shadow-md ${
                selectedKpiFilter === 'revisi'
                  ? 'border-orange-500 ring-2 ring-orange-100 bg-orange-50/20'
                  : 'border-gray-200/90 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-600">Perlu Revisi</span>
                <span className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-orange-600 tracking-tight leading-none">
                  {String(kpiStats.revisi).padStart(2, '0')}
                </span>
                <span className="text-xs font-semibold text-gray-400">Kelompok</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-orange-700 font-medium">
                <span>Menunggu perbaikan draf</span>
                {selectedKpiFilter === 'revisi' && <span className="font-bold">Aktif ✓</span>}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              3. 2-COLUMN WORKSPACE (70% Left Main Area, 30% Right Sidebar)
          ══════════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ──────────────────────────────────────────────────────────────────
                A. LEFT COLUMN (70% Width — Tabbed Workspace)
            ────────────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {/* Tabs Bar & Search / Filter Controls Header */}
              <div className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Shadcn-like Tab Buttons */}
                <div className="flex bg-gray-100/90 rounded-xl p-1 gap-1 self-start sm:self-auto border border-gray-200/70">
                  <button
                    onClick={() => {
                      setActiveTab('action');
                      if (selectedKpiFilter === 'ontrack') setSelectedKpiFilter('all');
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      activeTab === 'action'
                        ? 'bg-white text-gray-900 shadow-xs'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <span>Butuh Tindakan</span>
                    <span className="bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold">
                      {kpiStats.actionRequired}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('matrix')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      activeTab === 'matrix'
                        ? 'bg-white text-gray-900 shadow-xs'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <span>Matriks Keseluruhan</span>
                    <span className="bg-gray-200 text-gray-700 px-1.5 py-0.2 rounded-full text-[10px]">
                      {kpiStats.total}
                    </span>
                  </button>
                </div>

                {/* Compact Search & Dropdown Filter */}
                <div className="flex items-center gap-2.5">
                  {/* Search Input */}
                  <div className="relative flex-1 sm:w-56">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari kelompok, ketua, SMP..."
                      className="w-full pl-8 pr-7 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-red-600 focus:bg-white transition-all shadow-2xs"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-2 text-gray-400 hover:text-gray-700 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Dropdown Filter: Semua SMP */}
                  <div className="relative">
                    <select
                      value={selectedSchool}
                      onChange={(e) => setSelectedSchool(e.target.value)}
                      className="py-1.5 pl-3 pr-8 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-semibold focus:outline-none focus:border-red-600 appearance-none cursor-pointer shadow-2xs"
                    >
                      <option value="ALL">Semua SMP</option>
                      {schoolOptions.map((sch) => (
                        <option key={sch} value={sch}>
                          {sch}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Active Filter Indicator Tag */}
              {(selectedKpiFilter !== 'all' || selectedSchool !== 'ALL' || searchQuery) && (
                <div className="flex items-center gap-2 px-1 text-xs text-gray-500">
                  <span className="font-medium">Filter aktif:</span>
                  {selectedKpiFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-gray-200/80 text-gray-800 text-[11px] font-bold px-2 py-0.5 rounded-md">
                      Status: {selectedKpiFilter.toUpperCase()}
                      <button onClick={() => setSelectedKpiFilter('all')} className="hover:text-red-600 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedSchool !== 'ALL' && (
                    <span className="inline-flex items-center gap-1 bg-gray-200/80 text-gray-800 text-[11px] font-bold px-2 py-0.5 rounded-md">
                      {selectedSchool}
                      <button onClick={() => setSelectedSchool('ALL')} className="hover:text-red-600 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 bg-gray-200/80 text-gray-800 text-[11px] font-bold px-2 py-0.5 rounded-md">
                      "{searchQuery}"
                      <button onClick={() => setSearchQuery('')} className="hover:text-red-600 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSelectedKpiFilter('all');
                      setSelectedSchool('ALL');
                      setSearchQuery('');
                    }}
                    className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer ml-auto"
                  >
                    Reset Semua Filter
                  </button>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────────────
                  TAB 1: BUTUH TINDAKAN (Purely actionable tasks)
              ──────────────────────────────────────────────────────────────── */}
              {activeTab === 'action' && (
                <div className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs">
                  <div className="p-4 bg-gray-50/70 border-b border-gray-200/80 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        Daftar Kelompok Perlu Intervensi Segera
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Menampilkan hanya kelompok yang memerlukan persetujuan berkas atau pengingat batas waktu.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-gray-500 bg-white border border-gray-200 px-2.5 py-1 rounded-lg">
                      {filteredActionGroups.length} Kelompok
                    </span>
                  </div>

                  {filteredActionGroups.length === 0 ? (
                    <div className="py-16 text-center text-gray-400">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                      <p className="text-sm font-bold text-gray-800">Tidak ada tindakan mendesak</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Semua kelompok pada kriteria ini telah on-track atau tidak ada data yang cocok.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-gray-50/50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                            <th className="py-3 px-4">Kelompok & SMP</th>
                            <th className="py-3 px-4">Tahap & Berkas</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Aksi Tindakan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium">
                          {filteredActionGroups.map((group) => {
                            return (
                              <tr
                                key={group.id}
                                className="hover:bg-gray-50/80 transition-colors group"
                              >
                                {/* Column 1: Kelompok & SMP */}
                                <td className="py-3.5 px-4">
                                  <div className="flex items-start gap-2.5">
                                    <span className="bg-gray-100 text-gray-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-gray-200 shrink-0 mt-0.5">
                                      Kel. {group.number}
                                    </span>
                                    <div>
                                      <h4 className="font-extrabold text-gray-900 leading-tight">
                                        {group.schoolName}
                                      </h4>
                                      <p className="text-[11px] text-gray-500 mt-0.5">
                                        Ketua: <span className="font-semibold text-gray-700">{group.leaderName}</span> • Kec. {group.district}
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                {/* Column 2: Tahap & Berkas */}
                                <td className="py-3.5 px-4">
                                  <div className="flex flex-col gap-0.5">
                                    <span className="font-bold text-gray-900">
                                      Tahap 0{group.currentStep} • {group.featuredModule}
                                    </span>
                                    <span className="text-[11px] text-gray-500 line-clamp-1">
                                      {group.notes || 'Draf modul dan perlengkapan mengajar'}
                                    </span>
                                  </div>
                                </td>

                                {/* Column 3: Status Color Badge */}
                                <td className="py-3.5 px-4">
                                  {group.status === 'review' && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                      <Clock className="w-3 h-3 text-amber-600" />
                                      <span>Menunggu Review</span>
                                    </span>
                                  )}
                                  {group.status === 'overdue' && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                                      <AlertCircle className="w-3 h-3 text-red-600" />
                                      <span>{group.statusLabel}</span>
                                    </span>
                                  )}
                                  {group.status === 'revisi' && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-50 text-orange-800 border border-orange-200">
                                      <AlertTriangle className="w-3 h-3 text-orange-600" />
                                      <span>Perlu Revisi</span>
                                    </span>
                                  )}
                                  {group.status === 'ontrack' && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      <span>Sesuai Jadwal</span>
                                    </span>
                                  )}
                                </td>

                                {/* Column 4: Direct Action Button */}
                                <td className="py-3.5 px-4 text-right">
                                  {group.status === 'review' && (
                                    <button
                                      onClick={() => navigate('/dashboard/admin/review')}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                                    >
                                      <span>Review Berkas</span>
                                      <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {group.status === 'overdue' && (
                                    <button
                                      onClick={() => handleSendReminder(group)}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-300 hover:border-red-400 text-red-700 hover:bg-red-50 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                                    >
                                      <Send className="w-3.5 h-3.5" />
                                      <span>Kirim Pengingat</span>
                                    </button>
                                  )}
                                  {group.status === 'revisi' && (
                                    <button
                                      onClick={() => navigate('/dashboard/admin/review')}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:border-gray-400 text-gray-800 hover:bg-gray-50 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                                    >
                                      <FileText className="w-3.5 h-3.5 text-gray-500" />
                                      <span>Cek Catatan</span>
                                    </button>
                                  )}
                                  {group.status === 'ontrack' && (
                                    <button
                                      onClick={() => navigate('/dashboard/admin/review')}
                                      className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-red-600 cursor-pointer"
                                    >
                                      <span>Detail</span>
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ────────────────────────────────────────────────────────────────
                  TAB 2: MATRIKS KESELURUHAN (24 KELOMPOK)
              ──────────────────────────────────────────────────────────────── */}
              {activeTab === 'matrix' && (
                <div className="space-y-4">
                  {/* Top Section: Compact horizontal 6-Step Progress Overview */}
                  <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-extrabold text-gray-900">
                          Alur Kemajuan 6 Langkah Program Skomda Mengajar
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Status penyelesaian tahapan seluruh 24 kelompok relawan siswa kelas XII.
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                        Tahap 04 Sedang Berjalan
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                      {[
                        { step: '01', title: 'Bentuk Kelompok', count: '24/24', status: 'Selesai', color: 'emerald', done: true },
                        { step: '02', title: 'Pilih Ketua', count: '24/24', status: 'Selesai', color: 'emerald', done: true },
                        { step: '03', title: 'Susun Materi', count: '22/24', status: 'Selesai', color: 'emerald', done: true },
                        { step: '04', title: 'Siapkan Desain', count: '16/24', status: 'Aktif Berjalan', color: 'red', active: true },
                        { step: '05', title: 'Mengajar di SMP', count: '0/24', status: '22 Feb 2026', color: 'gray', locked: true },
                        { step: '06', title: 'Laporan & LPJ', count: '0/24', status: 'Terkunci', color: 'gray', locked: true },
                      ].map((item) => (
                        <div
                          key={item.step}
                          className={`p-3 rounded-xl border flex flex-col justify-between ${
                            item.active
                              ? 'bg-red-50/40 border-red-200'
                              : item.done
                              ? 'bg-emerald-50/20 border-emerald-100'
                              : 'bg-gray-50 border-gray-200/80 text-gray-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                                item.active
                                  ? 'bg-red-600 text-white'
                                  : item.done
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              T{item.step}
                            </span>
                            <span className="text-[11px] font-bold text-gray-800">{item.count}</span>
                          </div>
                          <div className="mt-2">
                            <p className="text-xs font-bold text-gray-900 leading-tight">{item.title}</p>
                            <span className="text-[10px] font-semibold text-gray-500 block mt-0.5">
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Section: Full 24-Group Progress Matrix Table */}
                  <div className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs">
                    <div className="p-4 bg-gray-50/70 border-b border-gray-200/80 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">
                          Matriks Kemajuan 24 Kelompok
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Menampilkan status setiap tahapan 01 hingga 06 untuk seluruh sekolah mitra.
                        </p>
                      </div>
                      <span className="text-xs font-bold text-gray-500 bg-white border border-gray-200 px-2.5 py-1 rounded-lg">
                        {filteredAllGroups.length} Kelompok Ditampilkan
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-gray-50/50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                            <th className="py-3 px-4">Kelompok & SMP</th>
                            <th className="py-3 px-2 text-center">T01</th>
                            <th className="py-3 px-2 text-center">T02</th>
                            <th className="py-3 px-2 text-center">T03</th>
                            <th className="py-3 px-2 text-center">T04</th>
                            <th className="py-3 px-2 text-center">T05</th>
                            <th className="py-3 px-2 text-center">T06</th>
                            <th className="py-3 px-4">Kemajuan</th>
                            <th className="py-3 px-4 text-right">Rincian</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium">
                          {filteredAllGroups.map((group) => {
                            return (
                              <tr
                                key={group.id}
                                className="hover:bg-gray-50/80 transition-colors"
                              >
                                {/* Column 1: Info */}
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <span className="bg-gray-100 text-gray-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-gray-200 shrink-0">
                                      K{group.number}
                                    </span>
                                    <div>
                                      <h4 className="font-bold text-gray-900 truncate max-w-[150px]">
                                        {group.schoolName}
                                      </h4>
                                      <p className="text-[11px] text-gray-400 truncate max-w-[150px]">
                                        {group.leaderName}
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                {/* Step 01 */}
                                <td className="py-3 px-2 text-center">
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600">
                                    <Check className="w-3.5 h-3.5" />
                                  </span>
                                </td>

                                {/* Step 02 */}
                                <td className="py-3 px-2 text-center">
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600">
                                    <Check className="w-3.5 h-3.5" />
                                  </span>
                                </td>

                                {/* Step 03 */}
                                <td className="py-3 px-2 text-center">
                                  {group.steps.step3 === 'done' ? (
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600">
                                      <Check className="w-3.5 h-3.5" />
                                    </span>
                                  ) : group.steps.step3 === 'revisi' ? (
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-50 text-orange-600" title="Perlu Revisi">
                                      <AlertTriangle className="w-3.5 h-3.5" />
                                    </span>
                                  ) : group.steps.step3 === 'overdue' ? (
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-50 text-red-600" title="Terlambat">
                                      <AlertCircle className="w-3.5 h-3.5" />
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 text-amber-600" title="Review">
                                      <Clock className="w-3.5 h-3.5" />
                                    </span>
                                  )}
                                </td>

                                {/* Step 04 */}
                                <td className="py-3 px-2 text-center">
                                  {group.steps.step4 === 'done' ? (
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600">
                                      <Check className="w-3.5 h-3.5" />
                                    </span>
                                  ) : group.steps.step4 === 'review' ? (
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 text-amber-600" title="Menunggu Review">
                                      <Clock className="w-3.5 h-3.5" />
                                    </span>
                                  ) : group.steps.step4 === 'overdue' ? (
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-50 text-red-600" title="Terlambat">
                                      <AlertCircle className="w-3.5 h-3.5" />
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400">
                                      <Clock className="w-3 h-3" />
                                    </span>
                                  )}
                                </td>

                                {/* Step 05 */}
                                <td className="py-3 px-2 text-center">
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-50 text-gray-300">
                                    <Lock className="w-3 h-3" />
                                  </span>
                                </td>

                                {/* Step 06 */}
                                <td className="py-3 px-2 text-center">
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-50 text-gray-300">
                                    <Lock className="w-3 h-3" />
                                  </span>
                                </td>

                                {/* Progress */}
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-20 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full rounded-full ${
                                          group.status === 'overdue'
                                            ? 'bg-red-600'
                                            : group.status === 'review'
                                            ? 'bg-amber-500'
                                            : 'bg-emerald-500'
                                        }`}
                                        style={{ width: `${group.progressPercent}%` }}
                                      />
                                    </div>
                                    <span className="font-mono text-[11px] font-bold text-gray-700">
                                      {group.progressPercent}%
                                    </span>
                                  </div>
                                </td>

                                {/* Action */}
                                <td className="py-3 px-4 text-right">
                                  <button
                                    onClick={() => navigate('/dashboard/admin/review')}
                                    className="font-bold text-red-600 hover:text-red-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>Detail</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ──────────────────────────────────────────────────────────────────
                B. RIGHT COLUMN (30% Width — Compact Info Sidebar)
            ────────────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              {/* Card 1: Deadline Terdekat */}
              <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-600" />
                    <h3 className="text-sm font-extrabold text-gray-900">Deadline Terdekat</h3>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Jadwal Resmi
                  </span>
                </div>

                <div className="space-y-3 pt-3.5">
                  {[
                    {
                      day: '15',
                      month: 'FEB',
                      title: 'Batas Akhir Tahap 04: Desain & X-Banner',
                      sub: '3 hari lagi • Wajib acc sebelum cetak lab',
                      urgent: true,
                    },
                    {
                      day: '22',
                      month: 'FEB',
                      title: 'Kickoff Mengajar Serentak',
                      sub: 'Laboratorium komputer 12 SMP mitra Sidoarjo',
                      urgent: false,
                    },
                    {
                      day: '01',
                      month: 'MAR',
                      title: 'Pengumpulan LPJ & Portofolio Akhir',
                      sub: 'Gelar karya siswa & berita acara tatap muka',
                      urgent: false,
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      {/* Date Box */}
                      <div
                        className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 border ${
                          item.urgent
                            ? 'bg-red-50 text-red-600 border-red-200'
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                      >
                        <span className="text-sm font-black leading-none">{item.day}</span>
                        <span className="text-[9px] font-extrabold uppercase mt-0.5 tracking-wider">
                          {item.month}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 leading-snug line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Rekap Feedback SMP */}
              <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-extrabold text-gray-900">Rekap Feedback SMP</h3>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    142 Responden
                  </span>
                </div>

                <div className="pt-4 flex flex-col gap-4">
                  {/* Overall Satisfaction Score Box */}
                  <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200/70">
                    <div>
                      <span className="text-[11px] font-semibold text-gray-500 block">
                        Skor Kepuasan Keseluruhan
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-2xl font-black text-gray-900">4.6</span>
                        <span className="text-xs font-semibold text-gray-400">/ 5.0</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">Sangat Memuaskan</span>
                    </div>
                  </div>

                  {/* 3 Horizontal Progress Bars */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between font-semibold text-gray-700 mb-1">
                        <span>Guru Pamong SMP</span>
                        <span className="font-bold text-gray-900">4.8 (96%)</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '96%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold text-gray-700 mb-1">
                        <span>Siswa SMP Mitra</span>
                        <span className="font-bold text-gray-900">4.5 (90%)</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-red-600 h-full rounded-full" style={{ width: '90%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold text-gray-700 mb-1">
                        <span>Guru Pembimbing SMK</span>
                        <span className="font-bold text-gray-900">4.7 (94%)</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '94%' }} />
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 italic bg-gray-50/50 p-2.5 rounded-lg border border-gray-100">
                    "Materi literasi AI dan etika digital dinilai sangat relevan dengan kebutuhan siswa fase D."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          BROADCAST MESSAGE MODAL
      ══════════════════════════════════════════════════════════════════════════ */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-red-600" />
                <span className="text-xs font-bold text-gray-900 uppercase">Broadcast Pesan Admin</span>
              </div>
              <button
                onClick={() => setIsBroadcastOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSendBroadcast} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Target Penerima:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBroadcastAudience('action')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                      broadcastAudience === 'action'
                        ? 'border-red-600 bg-red-50 text-red-600'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  >
                    8 Kelompok Butuh Tindakan
                  </button>
                  <button
                    type="button"
                    onClick={() => setBroadcastAudience('all')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                      broadcastAudience === 'all'
                        ? 'border-red-600 bg-red-50 text-red-600'
                        : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  >
                    Semua 24 Kelompok
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Judul Pengumuman:</label>
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:border-red-600"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Isi Pesan:</label>
                <textarea
                  rows={4}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:border-red-600 leading-relaxed"
                  required
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-[11px] text-gray-500">
                <span>Saluran Pengiriman:</span>
                <span className="font-bold text-gray-800">WhatsApp & Portal Workspace</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBroadcastOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
