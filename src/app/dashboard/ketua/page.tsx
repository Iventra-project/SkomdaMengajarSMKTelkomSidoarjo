"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Check,
  Pencil,
  ArrowRight,
  Download,
  Calendar,
  Layers,
  GraduationCap,
  Sparkles,
  School,
  FileText,
  Clock,
  ArrowUp,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Users,
  Eye,
  LogOut,
  FolderDown,
  LayoutDashboard,
  Filter
} from 'lucide-react';

// Fallback image function using clean SVG Data URIs
const createFallbackImage = (text: string, bg1 = '#0B1B3A', bg2 = '#D7141F') => {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${encodeURIComponent(
    bg1
  )}"/><stop offset="100%" stop-color="${encodeURIComponent(
    bg2
  )}"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g)"/><text x="50%" y="46%" font-family="sans-serif" font-weight="900" font-size="24" fill="%23ffffff" text-anchor="middle">SKOMDA MENGAJAR 2026</text><text x="50%" y="58%" font-family="sans-serif" font-weight="600" font-size="16" fill="%23ffffff" opacity="0.8" text-anchor="middle">${encodeURIComponent(
    text
  )}</text></svg>`;
};

export const KetuaDashboardPage: React.FC = () => {
  const { navigate, currentUser, logout, showToast } = useApp();

  const userName = currentUser?.name || 'Nabila Putri Ramadhani';
  const groupNumber = currentUser?.groupNumber ? String(currentUser.groupNumber).padStart(2, '0') : '03';
  const schoolName = currentUser?.schoolName || 'SMPN 1 Buduran';

  // 1. Scroll progress & back to top state
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolledNav, setIsScrolledNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const current = window.scrollY;
      setScrollProgress(totalScroll > 0 ? (current / totalScroll) * 100 : 0);
      setIsScrolledNav(current > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 2. Animated count-up statistics
  const [stats, setStats] = useState({ progress: 0, students: 0, schedule: 0 });
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const stepTime = 20;
    const steps = duration / stepTime;
    const incProgress = 67 / steps;
    const incStudents = 5 / steps;
    const incSchedule = 25 / steps;

    const timer = setInterval(() => {
      start++;
      setStats({
        progress: Math.min(67, Math.round(start * incProgress)),
        students: Math.min(5, Math.round(start * incStudents)),
        schedule: Math.min(25, Math.round(start * incSchedule)),
      });
      if (start >= steps) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  // 3. Carousel state for Hero Activities
  const heroSlides = [
    {
      title: 'Pelatihan Literasi Visual & Canva',
      desc: 'Siswa kelas 8 SMPN 1 Buduran antusias mendesain poster edukatif.',
      img: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80',
      tag: 'Lab Komputer SMPN 1 Buduran',
    },
    {
      title: 'Praktik Logika Game Scratch',
      desc: 'Simulasi coding interaktif berbasis balok logika untuk pemula.',
      img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80',
      tag: 'Sesi Praktik Interaktif',
    },
    {
      title: 'Presentasi Proyek Kreatif',
      desc: 'Apresiasi hasil karya desain siswa oleh mentor SMK Telkom Sidoarjo.',
      img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80',
      tag: 'Evaluasi & Refleksi',
    },
  ];
  const [activeSlide, setActiveSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  useEffect(() => {
    if (isCarouselPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isCarouselPaused, heroSlides.length]);

  // 4. Category filter for "Karya Nyata Siswa SMP"
  const [karyaFilter, setKaryaFilter] = useState<'all' | 'desain' | 'coding' | 'presentasi'>('all');

  const karyaList = [
    {
      id: 1,
      title: 'Poster Edukasi Bijak Medsos',
      author: 'Alya Rahma • Kelas 8B',
      school: 'SMPN 1 Buduran',
      category: 'desain',
      badge: 'Desain Canva',
      img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      title: 'Game Kuis Tebak Kata Logika',
      author: 'Dimas Satria • Kelas 8A',
      school: 'SMPN 1 Buduran',
      category: 'coding',
      badge: 'Scratch Game',
      img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 3,
      title: 'Slide Presentasi AI untuk Pelajar',
      author: 'Farhan & Tim • Kelas 8C',
      school: 'SMPN 1 Buduran',
      category: 'presentasi',
      badge: 'Slide Interaktif',
      img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 4,
      title: 'Infografis Pengolahan Sampah Digital',
      author: 'Nabila Safira • Kelas 8D',
      school: 'SMPN 1 Buduran',
      category: 'desain',
      badge: 'Infografis',
      img: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 5,
      title: 'Animasi Tata Surya 2D',
      author: 'Bagas Aditya • Kelas 8B',
      school: 'SMPN 1 Buduran',
      category: 'coding',
      badge: 'Scratch Animasi',
      img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 6,
      title: 'Pitching Gagasan Duta Literasi',
      author: 'Regu Melati • Kelas 8A',
      school: 'SMPN 1 Buduran',
      category: 'presentasi',
      badge: 'Public Speaking',
      img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const filteredKarya = karyaList.filter(
    (item) => karyaFilter === 'all' || item.category === karyaFilter
  );

  // 5. Download document states (transforming to spinner then checkmark)
  const [downloadStates, setDownloadStates] = useState<{ [key: string]: 'idle' | 'loading' | 'done' }>({});

  const handleDownloadDoc = (docId: string, filename: string) => {
    setDownloadStates((prev) => ({ ...prev, [docId]: 'loading' }));
    setTimeout(() => {
      setDownloadStates((prev) => ({ ...prev, [docId]: 'done' }));
      showToast(`Berkas "${filename}" berhasil diunduh.`, 'success');
      setTimeout(() => {
        setDownloadStates((prev) => ({ ...prev, [docId]: 'idle' }));
      }, 2500);
    }, 1200);
  };

  // Stepper definition
  const stepperSteps = [
    { no: '01', title: 'Bentuk Kelompok', sub: '20 Jan', status: 'completed' },
    { no: '02', title: 'Pilih Ketua', sub: '28 Jan', status: 'completed' },
    { no: '03', title: 'Susun Materi', sub: '05 Feb', status: 'completed' },
    { no: '04', title: 'Siapkan Desain', sub: 'Batas 15 Feb', status: 'active' },
    { no: '05', title: 'Mengajar di SMP', sub: '18-25 Feb', status: 'locked' },
    { no: '06', title: 'Laporan & LPJ', sub: '28 Feb', status: 'locked' },
  ];

  return (
    <div className="w-full bg-[#FFFFFF] text-[#475569] min-h-screen flex flex-col font-sans antialiased selection:bg-[#D7141F] selection:text-white">
      
      {/* Scroll Progress Bar (Top hairline 3px red) */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-[#D7141F] z-50 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Floating / Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolledNav
            ? 'bg-[#FFFFFF]/90 backdrop-blur-md shadow-[0_2px_12px_rgba(11,27,58,0.06)] py-3'
            : 'bg-[#FFFFFF] py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#D7141F] bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-full transition cursor-pointer"
            >
              <span>← Beranda</span>
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black text-[#0B1B3A] tracking-tight">#SKOMDA</span>
              <span className="bg-[#D7141F] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow-xs">
                MENGAJAR
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1F2] text-[#D7141F] text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#D7141F] animate-pulse" />
              <span>Kelompok {groupNumber} • {schoolName}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#D7141F] text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                NP
              </div>
              <span className="text-xs font-bold text-[#0B1B3A] hidden md:inline-block">
                {userName}
              </span>
            </div>

            <button
              onClick={logout}
              title="Keluar"
              className="p-1.5 text-slate-400 hover:text-[#D7141F] transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 flex-1">
        
        {/* ================= 1. TOP HERO SECTION ================= */}
        <section className="space-y-6">
          {/* Floating Pill Banner */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#FFF1F2] border border-[#D7141F]/15 text-[#D7141F] text-xs font-bold tracking-wide shadow-xs animate-in fade-in duration-500">
            <span className="w-2 h-2 rounded-full bg-[#D7141F] animate-ping shrink-0" />
            <span>SELAMAT DATANG KEMBALI, {userName.toUpperCase()}</span>
          </div>

          {/* Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FFFFFF] rounded-[24px] p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_rgba(11,27,58,0.06)]">
            
            {/* Left Column: Headline & Action */}
            <div className="lg:col-span-6 space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0B1B3A] tracking-tight leading-[1.15]">
                Fokus Progres Tim, Siap Mengajar SMP Mitra.
              </h1>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed font-medium max-w-lg">
                Koordinasikan 5 anggota kelompokmu di {schoolName}. Selesaikan desain X-Banner & finalisasi modul pembelajaran sebelum batas waktu 15 Februari 2026.
              </p>
              
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="#alur-pelaksanaan"
                  className="inline-flex items-center gap-2 bg-[#D7141F] hover:bg-[#B80F1A] active:scale-95 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-[0_4px_16px_rgba(215,20,31,0.25)] transition-all duration-200 cursor-pointer"
                >
                  <span>Lihat Alur & Unggah Desain</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#kurikulum"
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm px-5 py-3 rounded-full transition cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#D7141F]" />
                  <span>Pedoman & Kurikulum</span>
                </a>
              </div>
            </div>

            {/* Right Column: Crossfading Carousel */}
            <div
              className="lg:col-span-6 relative rounded-[20px] overflow-hidden shadow-md group h-72 sm:h-80"
              onMouseEnter={() => setIsCarouselPaused(true)}
              onMouseLeave={() => setIsCarouselPaused(false)}
            >
              {heroSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <img
                    src={slide.img}
                    alt={slide.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = createFallbackImage(slide.title);
                    }}
                    className="w-full h-full object-cover rounded-[20px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3A]/90 via-[#0B1B3A]/40 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#D7141F] self-start mb-2">
                      {slide.tag}
                    </span>
                    <h3 className="font-extrabold text-lg text-white leading-tight">
                      {slide.title}
                    </h3>
                    <p className="text-xs text-slate-200 mt-1 line-clamp-2">
                      {slide.desc}
                    </p>
                  </div>
                </div>
              ))}

              {/* Carousel Indicators */}
              <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      i === activeSlide ? 'w-6 bg-[#D7141F]' : 'w-2 bg-white/60 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Bottom 4 Number Stats (Count-up animation) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#FFFFFF] p-5 rounded-[20px] shadow-[0_4px_24px_rgba(11,27,58,0.06)] flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF1F2] text-[#D7141F] flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[#0B1B3A] tracking-tight">
                  {stats.progress}%
                </div>
                <div className="text-xs font-semibold text-slate-400">Progres Tim</div>
              </div>
            </div>

            <div className="bg-[#FFFFFF] p-5 rounded-[20px] shadow-[0_4px_24px_rgba(11,27,58,0.06)] flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF1F2] text-[#D7141F] flex items-center justify-center shrink-0">
                <Pencil className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[#D7141F] tracking-tight">
                  Tahap 04
                </div>
                <div className="text-xs font-semibold text-slate-400">Fase Aktif Saat Ini</div>
              </div>
            </div>

            <div className="bg-[#FFFFFF] p-5 rounded-[20px] shadow-[0_4px_24px_rgba(11,27,58,0.06)] flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF1F2] text-[#D7141F] flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[#0B1B3A] tracking-tight">
                  {stats.students} Siswa
                </div>
                <div className="text-xs font-semibold text-slate-400">Anggota Terdaftar</div>
              </div>
            </div>

            <div className="bg-[#FFFFFF] p-5 rounded-[20px] shadow-[0_4px_24px_rgba(11,27,58,0.06)] flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF1F2] text-[#D7141F] flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[#0B1B3A] tracking-tight">
                  15–{stats.schedule} Feb
                </div>
                <div className="text-xs font-semibold text-slate-400">Jadwal Pelaksanaan</div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 2. ALUR PELAKSANAAN SKOMDA MENGAJAR 2026 (SERPENTINE STEPPER) ================= */}
        <section id="alur-pelaksanaan" className="space-y-6">
          <div className="bg-[#FFFFFF] rounded-[24px] p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_rgba(11,27,58,0.06)] space-y-8">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1B3A] tracking-tight">
                  Alur Pelaksanaan Skomda Mengajar 2026
                </h2>
                <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
                  Ikuti alur terstruktur dari awal pendaftaran hingga evaluasi dan pelaporan akhir.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1F2] text-[#D7141F] text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-[#D7141F] animate-pulse" />
                <span>Tahap 04 Sedang Berjalan</span>
              </div>
            </div>

            {/* Serpentine Stepper Layout */}
            <div className="w-full relative py-6 overflow-x-auto select-none scrollbar-none">
              <div className="min-w-[860px] relative h-48 flex items-center">
                
                {/* SVG Smooth Connecting Line */}
                <svg
                  className="w-full h-full absolute inset-0 pointer-events-none"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 1100 160"
                >
                  {/* Gray upcoming line (Step 04 to 06) */}
                  <path
                    d="M 50,70 C 150,20 230,120 330,60 C 430,10 510,120 610,65 C 710,15 790,125 890,70 C 970,25 1020,80 1060,60"
                    stroke="#E2E8F0"
                    strokeWidth="3"
                    style={{
                      clipPath: 'polygon(64% 0%, 100% 0%, 100% 100%, 64% 100%)',
                    }}
                  />
                  
                  {/* Solid Red Completed/Active line (Step 01 to 04) */}
                  <path
                    d="M 50,70 C 150,20 230,120 330,60 C 430,10 510,120 610,65 C 710,15 790,125 890,70 C 970,25 1020,80 1060,60"
                    stroke="#D7141F"
                    strokeWidth="3.5"
                    style={{
                      clipPath: 'polygon(0% 0%, 64% 0%, 64% 100%, 0% 100%)',
                    }}
                  />
                </svg>

                {/* 6 Nodes across the wave */}
                <div className="w-full grid grid-cols-6 gap-2 relative z-10 items-center">
                  
                  {/* Step 01 (Completed) */}
                  <div className="flex flex-col items-center text-center transform -translate-y-4">
                    <div className="w-14 h-14 rounded-[16px] bg-[#D7141F] text-white flex flex-col items-center justify-center mb-2 shadow-md shadow-[#D7141F]/20">
                      <span className="text-[10px] font-bold text-white/80 leading-none mb-1">01</span>
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <span className="text-xs font-bold text-[#0B1B3A]">Bentuk Kelompok</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">20 Jan 2026</span>
                  </div>

                  {/* Step 02 (Completed) */}
                  <div className="flex flex-col items-center text-center transform translate-y-6">
                    <div className="w-14 h-14 rounded-[16px] bg-[#D7141F] text-white flex flex-col items-center justify-center mb-2 shadow-md shadow-[#D7141F]/20">
                      <span className="text-[10px] font-bold text-white/80 leading-none mb-1">02</span>
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <span className="text-xs font-bold text-[#0B1B3A]">Pilih Ketua</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">28 Jan 2026</span>
                  </div>

                  {/* Step 03 (Completed) */}
                  <div className="flex flex-col items-center text-center transform -translate-y-6">
                    <div className="w-14 h-14 rounded-[16px] bg-[#D7141F] text-white flex flex-col items-center justify-center mb-2 shadow-md shadow-[#D7141F]/20">
                      <span className="text-[10px] font-bold text-white/80 leading-none mb-1">03</span>
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <span className="text-xs font-bold text-[#0B1B3A]">Susun Materi</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">05 Feb 2026</span>
                  </div>

                  {/* Step 04 (ACTIVE - Pencil Icon + Pulsing Ring) */}
                  <div className="flex flex-col items-center text-center transform translate-y-5">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-[16px] bg-white border-2 border-[#D7141F] text-[#D7141F] flex flex-col items-center justify-center mb-2 shadow-[0_0_0_8px_rgba(215,20,31,0.15)] animate-pulse">
                        <span className="text-[10px] font-black text-[#D7141F] leading-none mb-1">04</span>
                        <Pencil className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-[#D7141F]">Siapkan Desain</span>
                    <span className="text-[11px] font-semibold text-[#D7141F] mt-0.5">Batas: 15 Feb</span>
                  </div>

                  {/* Step 05 (Locked) */}
                  <div className="flex flex-col items-center text-center transform -translate-y-4 opacity-70">
                    <div className="w-14 h-14 rounded-[16px] bg-slate-100 text-slate-400 flex flex-col items-center justify-center mb-2">
                      <span className="text-[10px] font-medium leading-none mb-1">05</span>
                      <School className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">Mengajar di SMP</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">18–25 Feb</span>
                  </div>

                  {/* Step 06 (Locked with Finish Tag) */}
                  <div className="flex flex-col items-center text-center transform translate-y-4 opacity-70 relative">
                    <div className="absolute -top-3 right-6 bg-[#D7141F] text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-sm transform -rotate-6">
                      FINISH
                    </div>
                    <div className="w-14 h-14 rounded-[16px] bg-slate-100 text-slate-400 flex flex-col items-center justify-center mb-2">
                      <span className="text-[10px] font-medium leading-none mb-1">06</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">Laporan & LPJ</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">28 Feb</span>
                  </div>

                </div>
              </div>
            </div>

            {/* SINGLE PREMIUM ACTIVE CARD: "Progres Kelompok: Tahap 04" (No Nested Boxes) */}
            <div className="p-6 rounded-[20px] bg-gradient-to-r from-slate-50 via-white to-red-50/40 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full bg-[#D7141F] text-white font-extrabold text-[10px] uppercase">
                    Tahap 04 Aktif
                  </span>
                  <span className="text-xs font-bold text-[#0B1B3A]">
                    Siapkan Desain Web & X-Banner 60x160 cm
                  </span>
                </div>
                
                <p className="text-xs text-[#475569] leading-relaxed max-w-xl">
                  Kelompok {groupNumber} ({schoolName}) sedang dalam proses finalisasi layout X-Banner percetakan dan postingan Instagram tim.
                </p>

                {/* Linear progress bar filling to 67% */}
                <div className="space-y-1 pt-1 max-w-md">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">Kelengkapan Berkas</span>
                    <span className="text-[#D7141F]">67% Selesai (4 dari 6 Item)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#D7141F] h-full rounded-full transition-all duration-1000 ease-out w-[67%]" />
                  </div>
                </div>
              </div>

              {/* Countdown badge & CTA */}
              <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
                <div className="text-center sm:text-right px-4 py-2 rounded-2xl bg-white shadow-xs border border-slate-100">
                  <div className="text-xs font-bold text-slate-400">Sisa Waktu</div>
                  <div className="text-sm font-extrabold text-[#0B1B3A] flex items-center gap-1 justify-center sm:justify-end">
                    <Clock className="w-3.5 h-3.5 text-[#D7141F]" />
                    <span>4 Hari Lagi</span>
                  </div>
                </div>

                <button
                  onClick={() => showToast('Membuka laci unggah berkas X-Banner...', 'info')}
                  className="px-5 py-3 rounded-full bg-[#D7141F] hover:bg-[#B80F1A] text-white font-bold text-xs shadow-[0_4px_12px_rgba(215,20,31,0.25)] transition cursor-pointer"
                >
                  Unggah Berkas Desain →
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* ================= 3. REKAM PELAKSANAAN & GALERI 2026 (PHOTO GRID) ================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1B3A] tracking-tight">
                Rekam Pelaksanaan & Galeri 2026
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
                Dokumentasi kegiatan interaktif siswa SMK Telkom Sidoarjo saat mengajar di sekolah mitra.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3.5 py-1 rounded-full self-start">
              Arsip Resmi Kegiatan
            </span>
          </div>

          {/* 3D Card Hover Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Survei Laboratorium Komputer',
                sub: 'SMPN 1 Buduran • Ruang Lab 2',
                img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
                date: '08 Feb 2026',
              },
              {
                title: 'Briefing Modul dengan Pembimbing',
                sub: 'Dra. Sri Wahyuni, M.Pd.',
                img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
                date: '10 Feb 2026',
              },
              {
                title: 'Simulasi Microteaching',
                sub: 'Persiapan Praktik Mengajar',
                img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
                date: '12 Feb 2026',
              },
              {
                title: 'Pemeriksaan Hasil Cetak Banner',
                sub: 'X-Banner 60x160 Siap Pasang',
                img: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=600&q=80',
                date: '13 Feb 2026',
              },
            ].map((p, i) => (
              <div
                key={i}
                className="group relative bg-[#FFFFFF] rounded-[24px] overflow-hidden shadow-[0_4px_24px_rgba(11,27,58,0.06)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
              >
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = createFallbackImage(p.title);
                    }}
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 space-y-1">
                  <div className="text-[10px] font-bold text-[#D7141F] uppercase tracking-wide">
                    {p.date}
                  </div>
                  <h4 className="text-xs font-bold text-[#0B1B3A] leading-tight group-hover:text-[#D7141F] transition-colors">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {p.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 4. KARYA NYATA SISWA SMP (FILTERABLE CARD GRID) ================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1B3A] tracking-tight">
                Karya Nyata Siswa SMP Mitra
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
                Portofolio orisinal luaran nyata yang dihasilkan siswa setelah sesi pengajaran selesai.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full text-xs font-bold self-start sm:self-auto">
              {[
                { id: 'all', label: 'Semua Karya' },
                { id: 'desain', label: 'Desain Grafis' },
                { id: 'coding', label: 'Scratch Coding' },
                { id: 'presentasi', label: 'Presentasi' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setKaryaFilter(btn.id as any)}
                  className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                    karyaFilter === btn.id
                      ? 'bg-[#0B1B3A] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredKarya.map((item) => (
              <div
                key={item.id}
                className="bg-[#FFFFFF] rounded-[24px] p-5 shadow-[0_4px_24px_rgba(11,27,58,0.06)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="w-full h-40 rounded-2xl overflow-hidden mb-3 relative">
                    <img
                      src={item.img}
                      alt={item.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = createFallbackImage(item.title);
                      }}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 right-2.5 bg-[#0B1B3A]/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#0B1B3A] leading-snug">
                    {item.title}
                  </h3>
                  <div className="text-xs text-slate-500 mt-1">{item.author}</div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">{item.school}</span>
                  <button
                    onClick={() => showToast(`Membuka portofolio ${item.title}...`, 'info')}
                    className="text-[#D7141F] font-bold text-[11px] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Buka Karya</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 5. PEDOMAN & STANDAR KURIKULUM (DOCUMENT LIST WITH INTERACTIVE BUTTONS) ================= */}
        <section id="kurikulum" className="space-y-6">
          <div className="bg-[#FFFFFF] rounded-[24px] p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_rgba(11,27,58,0.06)] space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1B3A] tracking-tight">
                Pedoman & Standar Kurikulum
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
                Unduh berkas acuan pengajaran resmi dari SMK Telkom Sidoarjo untuk panduan di kelas.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {[
                {
                  id: 'doc1',
                  title: 'Buku Panduan Pelaksanaan Skomda Mengajar 2026',
                  desc: 'SOP kegiatan, tata tertib berpakaian, kode etik komunikasi, dan jadwal pembimbingan.',
                  file: 'Panduan_SkomdaMengajar_2026.pdf (3.4 MB)',
                },
                {
                  id: 'doc2',
                  title: 'Standar RPP & Modul Ajar Informatika 90 Menit',
                  desc: 'Format penyusunan silabus rencana pengajaran, pembagian durasi, dan rubrik kuis.',
                  file: 'Template_RPP_Kurikulum_SDA.docx (1.2 MB)',
                },
                {
                  id: 'doc3',
                  title: 'Pedoman Desain X-Banner & Publikasi Cetak',
                  desc: 'Ketentuan resolusi 300 DPI, format CMYK, batas bleed 1 cm, dan penempatan logo resmi.',
                  file: 'Spesifikasi_Cetak_XBanner.pdf (850 KB)',
                },
                {
                  id: 'doc4',
                  title: 'Format Lembar Evaluasi & Laporan LPJ Kelompok',
                  desc: 'Instrumen refleksi kepuasan sekolah mitra dan format rekap dokumentasi pengajaran.',
                  file: 'Format_LPJ_Akhir_Kelompok.docx (980 KB)',
                },
              ].map((doc) => {
                const state = downloadStates[doc.id] || 'idle';
                return (
                  <div
                    key={doc.id}
                    className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 p-2 rounded-xl transition"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#FFF1F2] text-[#D7141F] flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-[#0B1B3A]">
                          {doc.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
                          {doc.desc}
                        </p>
                        <span className="text-[11px] font-mono text-slate-400 mt-1 inline-block">
                          {doc.file}
                        </span>
                      </div>
                    </div>

                    {/* Interactive Download Button */}
                    <button
                      onClick={() => handleDownloadDoc(doc.id, doc.title)}
                      disabled={state === 'loading'}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all cursor-pointer shrink-0 ${
                        state === 'done'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : state === 'loading'
                          ? 'bg-slate-200 text-slate-500 cursor-wait'
                          : 'bg-slate-900 hover:bg-[#D7141F] text-white shadow-xs'
                      }`}
                    >
                      {state === 'loading' ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Mengunduh...</span>
                        </>
                      ) : state === 'done' ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Terunduh!</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh Berkas</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= 6. BOTTOM CTA BANNER ================= */}
        <section className="bg-gradient-to-r from-[#D7141F] to-[#B80F1A] rounded-[24px] p-8 sm:p-10 text-white shadow-[0_8px_32px_rgba(215,20,31,0.25)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-0.5 rounded-full inline-block">
              Siap Bergerak & Menginspirasi
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Butuh Konsultasi Modul dengan Pembimbing?
            </h3>
            <p className="text-xs sm:text-sm text-white/90 max-w-xl">
              Hubungi pembimbing kelompok Anda di ruang guru SMK Telkom Sidoarjo atau ajukan sesi revisi berkas secara online.
            </p>
          </div>

          <a
            href="mailto:panitia@skomda.sch.id"
            className="shrink-0 bg-white hover:bg-slate-100 text-[#D7141F] font-extrabold text-xs sm:text-sm px-6 py-3 rounded-full transition shadow-md cursor-pointer"
          >
            Hubungi Panitia & Mentor →
          </a>
        </section>

      </main>

      {/* ================= ELEVATED LIGHT THEME FOOTER ================= */}
      <footer className="mt-16 bg-[#FFFFFF] border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-100">
            {/* Col 1: Brand Info */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-[#0B1B3A] tracking-tight">#SKOMDA</span>
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

            {/* Col 3: Dokumen & Aset */}
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

      {/* Floating Back-To-Top Pill */}
      {isScrolledNav && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 bg-[#0B1B3A] hover:bg-[#D7141F] text-white p-3 rounded-full shadow-lg transition-all duration-200 cursor-pointer"
          title="Kembali ke Atas"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

    </div>
  );
};
