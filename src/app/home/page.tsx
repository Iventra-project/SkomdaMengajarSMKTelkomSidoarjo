"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useApp, formatGroupNumber } from '../../context/AppContext';
import { SkomdaJourneyTrack } from '../../components/SkomdaJourneyTrack';
import { Navbar } from '../../components/Navbar';
import {
  groupsData,
  showcaseProjects,
  documentaryStories,
  ShowcaseProject,
  DocumentaryMoment,
} from '../../data/mockData';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80';

export const PostLoginHomePage: React.FC = () => {
  const { navigate, currentUser, logout, showToast, groups } = useApp();

  // Route protection
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (currentUser.role === 'admin') {
      navigate('/admin');
    }
  }, [currentUser, navigate]);

  // User Group Resolution
  const userGroupNum = currentUser?.groupNumber ? formatGroupNumber(currentUser.groupNumber) : '03';
  const allGroups = groups && groups.length > 0 ? groups : groupsData;
  const userGroup =
    allGroups.find((g) => formatGroupNumber(g.number) === userGroupNum) ||
    groupsData.find((g) => formatGroupNumber(g.number) === userGroupNum) ||
    groupsData[2];

  const userCurrentStage = userGroup?.currentStep || 4;
  const userProgress = userGroup?.progressPercent || 67;

  // Track & Selection State
  const [selectedStep, setSelectedStep] = useState<number>(userCurrentStage);

  const [isProjectsExpanded, setIsProjectsExpanded] = useState<boolean>(false);
  const [isDocExpanded, setIsDocExpanded] = useState<boolean>(false);

  // Modals State
  const [selectedProject, setSelectedProject] = useState<ShowcaseProject | null>(null);
  const [selectedStory, setSelectedStory] = useState<DocumentaryMoment | null>(null);

  const shownProjects = isProjectsExpanded ? showcaseProjects : showcaseProjects.slice(0, 4);
  const shownStories = isDocExpanded ? documentaryStories : documentaryStories.slice(0, 4);

  const getStageTitle = (stage: number) => {
    switch (stage) {
      case 1:
        return 'Fase Aktif: Pembentukan Kelompok Relawan (Tahap 01)';
      case 2:
        return 'Fase Aktif: Pembentukan Ketua Tim (Tahap 02)';
      case 3:
        return 'Fase Aktif: Susun RPP & Modul Ajar (Tahap 03)';
      case 4:
        return 'Fase Aktif: Siapkan Desain & X-Banner (Tahap 04)';
      case 5:
        return 'Fase Aktif: Penerjunan & Mengajar di SMP (Tahap 05)';
      case 6:
        return 'Fase Aktif: Laporan Akhir & Gelar Karya (Tahap 06)';
      default:
        return `Fase Aktif: Tahap 0${stage}`;
    }
  };

  const handleLogout = () => {
    void logout();
  };

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 antialiased selection:bg-[#e20113] selection:text-white">
      {/* ══════════════════════════════════════════════════════════════════════════
          1. FLOATING DARK PILL NAVBAR (UNIFIED SKOMDA CAPSULE)
      ══════════════════════════════════════════════════════════════════════════ */}
      <Navbar variant="home" />

      <main className="w-full">
        {/* ══════════════════════════════════════════════════════════════════════════
            2. HERO SECTION (100% IDENTICAL VISUAL ARCHITECTURE TO `/`)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section id="hero" className="relative w-full bg-white border-b border-slate-100 overflow-hidden">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10 py-12 sm:py-16 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Typography, Actions, 4 Horizontal Metrics */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
                {/* Active Session Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-50/80 border border-red-200/70 rounded-full mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
                  <span className="text-xs font-bold tracking-wider text-[#E50914] uppercase">
                    Sesi Aktif: Kelompok {userGroupNum}
                  </span>
                  <span className="text-red-300">•</span>
                  <span className="text-xs font-medium text-slate-600">
                    {userGroup?.schoolName || 'SMPN 1 Buduran'}
                  </span>
                </div>

                {/* Main Headline (Identical to `/`) */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold text-slate-950 tracking-tight leading-[1.08] mb-4">
                  Inspirasi Nyata, <br />
                  <span className="text-[#e20113]">Siswa SMK Mengajar SMP.</span>
                </h1>

                {/* Subtitle (Identical to `/`) */}
                <p className="text-base sm:text-lg text-slate-500 font-normal leading-relaxed mb-8 max-w-lg">
                  180 siswa relawan SMK Telkom Sidoarjo mengajar teknologi aplikatif dan etika digital di 12 SMP Sidoarjo.
                </p>

                {/* Action Buttons: Primary CTA replaced with "Buka Dashboard Kelompok →" */}
                <div className="flex flex-wrap items-center gap-3.5 mb-10">
                  <button
                    onClick={() => navigate('/dashboard/ketua')}
                    className="inline-flex items-center gap-2.5 px-6 h-12 bg-[#E50914] hover:bg-[#b4000c] text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer group"
                  >
                    <span>Buka Dashboard Kelompok</span>
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </span>
                  </button>
                  <a
                    href="#alur"
                    className="inline-flex items-center gap-2 px-5 h-12 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200 font-bold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-slate-500">list_alt</span>
                    <span>Lihat Alur Pelaksanaan</span>
                  </a>
                </div>

                {/* 4 Horizontal Stat Metrics (Exact as `/`) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-100 w-full max-w-xl">
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight block">12</span>
                    <span className="text-xs font-semibold text-slate-500 mt-0.5 block">SMP Mitra</span>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight block">24</span>
                    <span className="text-xs font-semibold text-slate-500 mt-0.5 block">Kelompok</span>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight block">180</span>
                    <span className="text-xs font-semibold text-slate-500 mt-0.5 block">Relawan</span>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight block">1.4k+</span>
                    <span className="text-xs font-semibold text-slate-500 mt-0.5 block">Siswa SMP</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Teaching Photo Card (Exact as `/`) */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl shadow-slate-200/60 border border-slate-100 group">
                  <img
                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1000&auto=format&fit=crop&q=80"
                    alt="Aksi Nyata Siswa SMK Telkom Sidoarjo Mengajar di SMP Mitra"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                  />

                  {/* Soft Gradient Scrim at Bottom Only */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-6 text-white flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-[#e20113] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                        Aksi Nyata Relawan
                      </span>
                      <span className="text-xs text-slate-200 font-semibold">180 Siswa • 12 SMP Sidoarjo</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                      Siswa SMK Telkom Sidoarjo Berbagi Ilmu & Literasi Digital di Sekolah Mitra
                    </h3>

                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
                      Program pengabdian masyarakat terstruktur: mengajarkan dasar pemrograman, etika digital, dan media kreatif interaktif.
                    </p>
                  </div>
                </div>

                {/* Subtle Meta Indicator below photo */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-medium px-1">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-500 text-[15px]">verified</span>
                    Fase D Kurikulum Merdeka Informatika
                  </span>
                  <span>Disahkan MGMP Sidoarjo</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════
            3. ALUR SECTION (ADAPTATION 2: DYNAMIC SINUSOIDAL JOURNEY TRACK)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section className="w-full bg-[#f8f9fa] py-14 sm:py-16 md:py-20 border-b border-slate-200/80" id="alur">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10">
            <div className="space-y-6">
              <SkomdaJourneyTrack
                currentActiveStep={userCurrentStage}
                selectedStep={selectedStep}
                onSelectStep={(step) => setSelectedStep(step)}
                activePhaseTitle={
                  selectedStep === userCurrentStage
                    ? getStageTitle(userCurrentStage)
                    : `Fase Terpilih: Tahap 0${selectedStep}`
                }
              />

              {/* ─── KARTU TERPADU STATUS KELOMPOK DI TAHAP AKTIF ─── */}
              <div className="mt-8 p-6 sm:p-8 bg-white border border-[#E8ECF2] rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2.5 mb-3">
                      <span className="bg-[#D7141F] text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full">
                        Kelompok {userGroupNum} · {userGroup?.schoolName || 'SMPN 1 Buduran'}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Sesuai Jadwal
                      </span>
                      <span className="text-xs text-slate-400 font-medium">Tenggat: {userGroup?.targetDate || '15 Feb 2026'}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B1B3A] tracking-tight">
                      {selectedStep === 4
                        ? 'Tahap 04: Siapkan Desain Slide & X-Banner 60×160 cm'
                        : selectedStep === 3
                        ? 'Tahap 03: Penyusunan RPP & Modul Ajar Fase D'
                        : selectedStep === 2
                        ? 'Tahap 02: Penetapan Ketua & Pembimbing Lapangan'
                        : selectedStep === 1
                        ? 'Tahap 01: Pembentukan Kelompok Relawan Siswa'
                        : selectedStep === 5
                        ? 'Tahap 05: Penerjunan & Sesi Mengajar di Lab Komputer SMP'
                        : 'Tahap 06: Refleksi, Laporan Akhir & Gelar Karya Artefak'}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                      {selectedStep === 4
                        ? 'Fokus regu Anda saat ini adalah memfinalisasi slide presentasi interaktif dan tata letak banner promosi SMP mitra. 4 dari 6 tugas sprint telah selesai diverifikasi oleh pembimbing.'
                        : 'Pantau target pelaksanaan, pembagian tugas anggota regu, serta koordinasi berkas dengan guru pembimbing lapangan untuk memastikan kelancaran kegiatan.'}
                    </p>

                    {/* Mini checklist badges */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50/70 border border-emerald-200/50 px-2.5 py-1 rounded-lg">
                        <span className="material-symbols-outlined text-[14px]">check</span> Layout Canva Disetujui
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50/70 border border-emerald-200/50 px-2.5 py-1 rounded-lg">
                        <span className="material-symbols-outlined text-[14px]">check</span> Aset Logo Terverifikasi
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50/70 border border-amber-200/50 px-2.5 py-1 rounded-lg">
                        <span className="material-symbols-outlined text-[14px]">pending</span> Review X-Banner Cetak
                      </span>
                    </div>
                  </div>

                  {/* Progress Circle & Action Button */}
                  <div className="shrink-0 flex sm:flex-row lg:flex-col items-center lg:items-end justify-between gap-5 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 flex items-center justify-center">
                        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
                          <circle cx="24" cy="24" r="20" stroke="#F1F5F9" strokeWidth="4" fill="none" />
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="#D7141F"
                            strokeWidth="4"
                            strokeDasharray="125.6"
                            strokeDashoffset={125.6 - (125.6 * userProgress) / 100}
                            strokeLinecap="round"
                            fill="none"
                          />
                        </svg>
                        <span className="absolute text-xs font-black text-[#0B1B3A]">{userProgress}%</span>
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Progres Sprint</span>
                        <span className="text-xs font-bold text-slate-700">4 dari 6 Tugas Selesai</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/dashboard/ketua')}
                      className="inline-flex items-center justify-center gap-2 px-6 h-12 bg-[#D7141F] hover:bg-[#B80F1A] text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer group"
                    >
                      <span>Buka Lembar Kerja Tahap 0{selectedStep}</span>
                      <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════
            4. REKAM JEJAK PELAKSANAAN 2025 (UNIFORM SYMMETRIC PHOTO GRID)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section className="w-full bg-[#f8f9fa] py-16 md:py-20 border-b border-slate-200/80" id="jejak">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#e20113]">
                  02 / REKAM JEJAK
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Rekam Pelaksanaan & Galeri 2025
                </h2>
              </div>
              <span className="text-xs font-bold bg-white border border-slate-200 text-slate-700 px-3.5 py-1.5 rounded-xl shadow-2xs">
                100% Selesai & Terverifikasi
              </span>
            </div>

            {/* Uniform Symmetric Photo Grid (grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6) */}
            <div className="pt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {shownStories.map((story) => (
                  <div
                    key={story.id}
                    onClick={() => setSelectedStory(story)}
                    className="bg-white rounded-2xl overflow-hidden cursor-pointer group border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      <img
                        src={story.image}
                        alt={story.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="bg-[#e20113] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md shadow-xs">
                          {story.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-white/95 text-slate-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                          Baca
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1.5">
                          <span>{story.school}</span>
                          <span>{story.date}</span>
                        </div>
                        <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#e20113] transition-colors leading-snug line-clamp-2">
                          {story.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                          {story.caption}
                        </p>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] font-semibold text-slate-400">Dokumentasi 2025</span>
                        <span className="font-bold text-[#e20113] group-hover:underline">Baca Selengkapnya →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expand / Collapse Button for Stories */}
            {documentaryStories.length > 4 && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setIsDocExpanded(!isDocExpanded)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-[#e20113] hover:text-[#e20113] text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-2xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[17px]">
                    {isDocExpanded ? 'expand_less' : 'photo_library'}
                  </span>
                  <span>{isDocExpanded ? 'Ringkas Galeri' : `+${documentaryStories.length - 4} Foto Arsip Lainnya`}</span>
                </button>
              </div>
            )}

            {/* ══════════════ SUBSECTION: PROJEK YANG DIBUAT (4 CARDS) ══════════════ */}
            <div className="mt-14 pt-10 border-t border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#e20113]">
                    ARTEFAK PEMBELAJARAN
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">Karya Nyata Siswa SMP</h3>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {shownProjects.length}/{showcaseProjects.length} Artefak
                </span>
              </div>

              {/* 4 Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {shownProjects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProject(proj)}
                    className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden cursor-pointer group hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-slate-900 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-2xs">
                        {proj.tag}
                      </span>
                    </div>

                    <div className="p-4 flex flex-col justify-between flex-1">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-[#e20113] transition-colors line-clamp-1">
                          {proj.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 leading-snug line-clamp-2">{proj.desc}</p>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium truncate max-w-[130px]">{proj.school}</span>
                        <span className="font-bold text-[#e20113] group-hover:underline">Lihat Rincian</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Expand / Collapse Button for Projects */}
              {showcaseProjects.length > 4 && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-[#e20113] hover:text-[#e20113] text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-2xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[17px]">
                      {isProjectsExpanded ? 'expand_less' : 'grid_view'}
                    </span>
                    <span>{isProjectsExpanded ? 'Ringkas Projek' : `+${showcaseProjects.length - 4} Projek Lainnya`}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════
            6. STANDAR KURIKULUM & BERKAS
        ══════════════════════════════════════════════════════════════════════════ */}
        <section className="w-full bg-white py-16 md:py-20 border-b border-slate-200/80" id="kurikulum">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Left Column: Accreditation Points */}
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#e20113]">
                  04 / STANDAR PEDOMAN
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 mb-6">
                  Pedoman & Standar Kurikulum
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: 'verified_user', label: 'Disahkan MGMP', sub: 'Informatika Kab. Sidoarjo' },
                    { icon: 'menu_book', label: 'Struktur 6 JP', sub: '30% Teori, 70% Praktik Lab' },
                    { icon: 'fact_check', label: 'Rubrik Penilaian', sub: 'Kreativitas & Kemandirian' },
                    { icon: 'emoji_events', label: 'Kurikulum Merdeka', sub: 'Capaian Fase D SMP' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3 hover:border-slate-300 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                        <span className="material-symbols-outlined text-[20px] text-[#e20113]">{item.icon}</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{item.label}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Downloadable Files */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 flex flex-col gap-3 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-900 uppercase">Paket Dokumen Resmi Guru & Tim</span>
                  <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 uppercase">
                    Terverifikasi
                  </span>
                </div>

                {[
                  { icon: 'picture_as_pdf', color: 'text-rose-500', name: 'Buku Panduan Mentor Skomda v4.2', size: 'PDF • 4.8 MB' },
                  { icon: 'description', color: 'text-blue-500', name: 'Format RPP & Berita Acara Tatap Muka', size: 'DOCX • 1.2 MB' },
                  { icon: 'table_chart', color: 'text-emerald-500', name: 'Rubrik Penilaian Akhir Siswa SMP', size: 'XLSX • 850 KB' },
                ].map((doc) => (
                  <div
                    key={doc.name}
                    className="flex items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-xl hover:border-slate-300 transition-colors shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-[22px] ${doc.color}`}>{doc.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{doc.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{doc.size}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => showToast(`Mengunduh berkas ${doc.name}...`, 'info')}
                      className="text-xs font-bold text-[#e20113] hover:underline px-3 py-1 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer"
                    >
                      Unduh
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════════
            7. CALL-TO-ACTION (Floating Red Banner with Parallax Feel)
        ══════════════════════════════════════════════════════════════════════════ */}
        <section className="py-16 px-5 sm:px-8 md:px-10 bg-white">
          <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-[#E11D2E] via-[#D7141F] to-[#B80F1A] text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-red-200 bg-black/15 px-3 py-1 rounded-full mb-3">
                  Saluran Pendampingan Resmi
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                  Ketua Regu? Butuh bantuan perizinan atau kurikulum?
                </h3>
                <p className="text-xs sm:text-sm text-red-100 mt-2 font-normal leading-relaxed">
                  Tim kurikulum dan kemitraan SMK Telkom Sidoarjo siap mendampingi proses koordinasi dengan pihak sekolah mitra secara cepat dan responsif.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => navigate('/dashboard/ketua')}
                  className="inline-flex items-center gap-2 px-6 h-12 bg-white hover:bg-slate-50 text-[#0B1B3A] font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#D7141F]">dashboard</span>
                  <span>Buka Dashboard Kelompok</span>
                </button>
                <button
                  onClick={() => showToast('Menghubungkan ke helpdesk kurikulum...', 'info')}
                  className="inline-flex items-center gap-2 px-6 h-12 bg-black/20 hover:bg-black/30 text-white font-bold text-xs uppercase tracking-wider rounded-full border border-white/25 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">support_agent</span>
                  <span>Hubungi Koordinator</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ══════════════════════════════════════════════════════════════════════════
          8. FOOTER (EDITORIAL LIGHT THEME)
      ══════════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-white text-slate-600 border-t border-[#E8ECF2] pt-14 pb-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#E8ECF2]">
            {/* Col 1: Identity */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#D7141F] text-white flex items-center justify-center font-black text-xs shadow-xs">
                  SM
                </div>
                <div>
                  <span className="text-sm font-black text-[#0B1B3A] tracking-tight block">SKOMDA MENGAJAR 2026</span>
                  <span className="text-[11px] text-slate-400 font-medium">SMK Telkom Sidoarjo</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Inisiatif vokasi dan pengabdian masyarakat untuk mendampingi literasi digital, komputasi kreatif, dan teknologi tepat guna di 12 SMP Kabupaten Sidoarjo.
              </p>
            </div>

            {/* Col 2: Navigasi */}
            <div className="md:col-span-2 space-y-2.5 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B1B3A] block">Akses Cepat</span>
              <ul className="space-y-2 text-slate-500">
                <li><a href="#alur" className="hover:text-[#D7141F] transition-colors">Alur Pelaksanaan</a></li>
                <li><a href="#jejak" className="hover:text-[#D7141F] transition-colors">Rekam Jejak 2025</a></li>
                <li><a href="#kurikulum" className="hover:text-[#D7141F] transition-colors">Standar Kurikulum</a></li>
                <li><button onClick={() => navigate('/dashboard/ketua')} className="hover:text-[#D7141F] transition-colors cursor-pointer">Dashboard Kelompok</button></li>
              </ul>
            </div>

            {/* Col 3: Berkas */}
            <div className="md:col-span-2 space-y-2.5 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B1B3A] block">Dokumen</span>
              <ul className="space-y-2 text-slate-500">
                <li><a href="#kurikulum" className="hover:text-[#D7141F] transition-colors">Buku Panduan 2026</a></li>
                <li><a href="#kurikulum" className="hover:text-[#D7141F] transition-colors">Format RPP Fase D</a></li>
                <li><a href="#kurikulum" className="hover:text-[#D7141F] transition-colors">Rubrik Penilaian</a></li>
              </ul>
            </div>

            {/* Col 4: Kontak & Lokasi */}
            <div className="md:col-span-3 space-y-2.5 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B1B3A] block">Sekretariat</span>
              <p className="text-slate-500 text-xs leading-relaxed">
                Jl. Raya Pecantingan, Sekardangan, Sidoarjo, Jawa Timur 61215
              </p>
              <p className="text-slate-500 text-xs">
                Email: <a href="mailto:skomda@telkomsda.sch.id" className="text-[#D7141F] font-semibold hover:underline">skomda@telkomsda.sch.id</a>
              </p>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© 2026 SMK Telkom Sidoarjo. Hak Cipta Dilindungi Undang-Undang.</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#D7141F] font-semibold transition-colors cursor-pointer"
              >
                <span>Kembali ke Atas</span>
                <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════════════════════════
          9. MODALS (Project Showcase, Story Detail & Roster Modal)
      ══════════════════════════════════════════════════════════════════════════ */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-slate-900">{selectedProject.title}</span>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-[#e20113] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {selectedProject.tag}
                </span>
                <span className="text-xs text-slate-500 font-semibold">{selectedProject.school}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedProject.fullDesc ?? selectedProject.desc}
              </p>
              {selectedProject.tools && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedProject.tools.map((t) => (
                    <span key={t} className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Durasi:</span>
                  <span className="font-bold text-slate-800">{selectedProject.duration ?? '2 Pertemuan (6 JP)'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Siswa Terdampak:</span>
                  <span className="font-bold text-slate-800">{selectedProject.studentsTrained ?? 40} Siswa SMP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-slate-900">{selectedStory.category}</span>
              <button
                onClick={() => setSelectedStory(null)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={selectedStory.image}
                  alt={selectedStory.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2 text-xs text-slate-500 font-semibold">
                <span>{selectedStory.school}</span>
                <span>•</span>
                <span>{selectedStory.date}</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">{selectedStory.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedStory.caption}</p>
              {selectedStory.quote && (
                <div className="p-3.5 bg-slate-50 border-l-2 border-[#e20113] rounded-r-xl">
                  <p className="text-xs text-slate-700 italic">"{selectedStory.quote.text}"</p>
                  <p className="text-xs font-bold text-slate-900 mt-2">— {selectedStory.quote.author}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
