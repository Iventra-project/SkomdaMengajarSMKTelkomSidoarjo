import React, { useState } from 'react';
import { useApp } from '../../../../context/AppContext';

export const AdminKelompokDetailPage: React.FC = () => {
  const {
    navigate,
    members,
    toggleMemberStatus,
    sprintTasks,
    moveTaskColumn,
    bannerStatus,
    bannerFeedback,
    submitBannerDecision,
    supervisorMemo,
    showMemoToLeader,
    saveSupervisorMemo,
    setIsBannerModalOpen,
    showToast
  } = useApp();

  const [decision, setDecision] = useState<'approved' | 'revision'>('approved');
  const [feedbackText, setFeedbackText] = useState(
    bannerFeedback || 'Komposisi dan resolusi desain sudah memenuhi standar percetakan resmi Skomda Mengajar.'
  );
  const [memoInput, setMemoInput] = useState(supervisorMemo);
  const [shareMemo, setShareMemo] = useState(showMemoToLeader);

  const validMembersCount = members.filter((m) => m.status === 'valid').length;
  const pendingMembersCount = members.length - validMembersCount;

  const handleSendDecision = () => {
    submitBannerDecision(decision, feedbackText);
  };

  const handleSaveMemo = () => {
    saveSupervisorMemo(memoInput, shareMemo);
  };

  return (
    <div className="w-full min-h-screen bg-[#f9f9f9] text-slate-800 font-sans flex flex-row antialiased overflow-x-hidden">
      {/* LEFT PERSISTENT SIDEBAR */}
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

          {/* Filter Pill */}
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span>Ringkasan Monitoring</span>
            </button>

            <button
              onClick={() => navigate('/admin')}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#b4000c] text-white shadow-xs font-semibold text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">groups</span>
                <span>Kelompok</span>
              </div>
              <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">03</span>
            </button>

            <button
              onClick={() => showToast('Membuka antrean 04 berkas masuk', 'info')}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">verified</span>
                <span>Review Berkas</span>
              </div>
              <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-bold">04</span>
            </button>

            <button
              onClick={() => {
                navigate('/admin');
              }}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">rate_review</span>
                <span>Feedback & Respon</span>
              </div>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">4.6</span>
            </button>

            <button
              onClick={() => navigate('/workspace')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">workspaces</span>
              <span>Workspace Ketua (Siswa)</span>
            </button>
          </nav>
        </div>

        {/* User Card */}
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
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT CONTAINER */}
      <div className="flex-1 min-w-0 flex flex-col bg-[#f9f9f9] min-h-screen overflow-y-auto">
        {/* Top Sticky Utility Bar */}
        <header className="w-full bg-white border-b border-slate-200 px-8 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Semua kelompok</span>
            </button>
            <span className="text-slate-300">/</span>
            <nav className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="text-slate-400">Admin</span>
              <span className="text-slate-300">/</span>
              <button onClick={() => navigate('/admin')} className="hover:text-slate-800 transition-colors cursor-pointer">
                Kelompok
              </button>
              <span className="text-slate-300">/</span>
              <span className="font-bold text-slate-900">Kelompok 03 • SMPN 1 Buduran</span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-slate-600 text-xs font-mono border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>ID: KLP-2026-03</span>
            </div>
            <button
              onClick={() => showToast('Mengunduh bundel rekap berkas Kelompok 03 (38 MB)...', 'info')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-[#b4000c] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">folder_zip</span>
              <span>Unduh Rekap Berkas</span>
            </button>
          </div>
        </header>

        {/* Page Body Grid */}
        <main className="w-full max-w-[1400px] mx-auto p-8 space-y-6">
          <div className="grid grid-cols-12 gap-8 items-start w-full">
            {/* LEFT 8-COLUMN MAIN REVIEW REGION */}
            <div className="col-span-12 lg:col-span-8 space-y-6 min-w-0">
              {/* CARD: Kelompok 03 Header Profile Banner */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  {/* Left: Monogram and Metadata */}
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    <div className="relative shrink-0 w-16 h-16 bg-slate-50 flex items-center justify-center rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-2xl font-extrabold text-slate-800 tracking-tight">B1</span>
                      <span className="absolute -bottom-2 -right-1 bg-[#b4000c] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                        SMPN 1
                      </span>
                    </div>

                    <div className="flex flex-col space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                          Kelompok 03 — SMPN 1 Buduran
                        </h1>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Aktif - Sesuai Jadwal
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[15px] text-slate-700">school</span>
                          <span>Pembimbing: <strong className="text-slate-800 font-semibold">Pak Budi Hartono, S.Kom</strong></span>
                        </span>
                        <span className="hidden sm:inline text-slate-300">•</span>
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[15px] text-slate-700">person</span>
                          <span>Ketua: <strong className="text-slate-800 font-semibold">Ahmad Rizky (XII RPL 2)</strong></span>
                        </span>
                        <span className="hidden sm:inline text-slate-300">•</span>
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[15px] text-slate-700">groups</span>
                          <span>8 Siswa Relawan</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Progress Indicator */}
                  <div className="flex items-center gap-3.5 shrink-0 pt-3 sm:pt-0 sm:pl-5 sm:border-l border-slate-100">
                    <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" fill="none" r="28" stroke="#f1f5f9" strokeWidth="5"></circle>
                        <circle
                          cx="32"
                          cy="32"
                          fill="none"
                          r="28"
                          stroke="#b4000c"
                          strokeDasharray="175.9"
                          strokeDashoffset="58"
                          strokeLinecap="round"
                          strokeWidth="5"
                        ></circle>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-sm font-extrabold text-slate-900 leading-none">67%</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800">4 dari 6 Selesai</span>
                      <span className="text-[11px] text-slate-400">Tahap Review Aktif</span>
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="w-2.5 h-2.5 rounded bg-emerald-500" title="01 Selesai"></span>
                        <span className="w-2.5 h-2.5 rounded bg-emerald-500" title="02 Selesai"></span>
                        <span className="w-2.5 h-2.5 rounded bg-emerald-500" title="03 Selesai"></span>
                        <span className="w-2.5 h-2.5 rounded bg-[#b4000c] ring-2 ring-red-200" title="04 Sedang Berjalan"></span>
                        <span className="w-2.5 h-2.5 rounded bg-slate-200" title="05 Belum"></span>
                        <span className="w-2.5 h-2.5 rounded bg-slate-200" title="06 Belum"></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action Row */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => showToast('Membuka jalur chat koordinasi WhatsApp Ketua...', 'info')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px] text-slate-500">chat</span>
                      <span>Hubungi Tim</span>
                    </button>
                    <button
                      onClick={() => {
                        const el = document.getElementById('supervisor-memo-box');
                        el?.focus();
                        showToast('Silakan tulis catatan internal di kolom kanan', 'info');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px] text-slate-500">edit_note</span>
                      <span>Beri Catatan</span>
                    </button>
                    <button
                      onClick={() => showToast('Tautan reset kata sandi telah dikirim ke email ketua!', 'success')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px] text-slate-500">lock_reset</span>
                      <span>Reset Kata Sandi Akun</span>
                    </button>
                  </div>
                  <span className="text-slate-400 text-xs font-medium">Terakhir disunting: Hari ini, 10:14 WIB</span>
                </div>
              </div>

              {/* STEPPER 6 LANGKAH */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[15px]">check</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[9px] uppercase font-bold text-emerald-700">Langkah 01</span>
                      <span className="text-[11px] font-semibold text-slate-800 truncate">Bentuk Kelompok</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[15px]">check</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[9px] uppercase font-bold text-emerald-700">Langkah 02</span>
                      <span className="text-[11px] font-semibold text-slate-800 truncate">Pilih Ketua</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[15px]">check</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[9px] uppercase font-bold text-emerald-700">Langkah 03</span>
                      <span className="text-[11px] font-semibold text-slate-800 truncate">Susun Materi</span>
                    </div>
                  </div>

                  {/* 04 Aktif */}
                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-red-50 border-2 border-[#b4000c] shadow-2xs">
                    <div className="w-7 h-7 rounded-full bg-[#b4000c] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      04
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[9px] uppercase font-extrabold text-[#b4000c]">Review Aktif</span>
                      <span className="text-[11px] font-bold text-slate-900 truncate">Siapkan Desain</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200 opacity-60">
                    <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[14px]">lock</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[9px] uppercase font-semibold text-slate-400">Langkah 05</span>
                      <span className="text-[11px] font-semibold text-slate-700 truncate">Mengajar SMP</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200 opacity-60">
                    <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[14px]">lock</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[9px] uppercase font-semibold text-slate-400">Langkah 06</span>
                      <span className="text-[11px] font-semibold text-slate-700 truncate">Laporan Akhir</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MODUL FOKUS REVIEW AKTIF (LANGKAH 04) */}
              <section className="bg-white border-2 border-[#b4000c] rounded-xl p-6 shadow-sm space-y-6 relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="inline-block bg-[#b4000c] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                        FOKUS EVALUASI
                      </span>
                      <h2 className="text-base font-extrabold text-slate-900">
                        Langkah 04: Siapkan Desain Publikasi
                      </h2>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Validasi desain X-Banner cetak (60 × 160 cm) dan kepatuhan publikasi Instagram siswa sebelum pelaksanaan.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 text-[#b4000c] border border-red-100 shrink-0 text-xs font-medium">
                    <span className="material-symbols-outlined text-[18px]">event</span>
                    <span>Batas Pengesahan: <strong className="font-bold">15 Feb 2026</strong></span>
                  </div>
                </div>

                {/* Sub-grid for Banner Review */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">
                        A
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">
                        Desain X-Banner Publikasi Resmi (60 × 160 cm)
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">Format: PDF / CMYK 300 DPI</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-50 rounded-xl border border-slate-200">
                    {/* Left: Mockup Card */}
                    <div className="flex flex-col items-center justify-between bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
                      <div className="relative w-full max-w-[210px] aspect-[9/16] bg-slate-100 rounded border border-slate-200 overflow-hidden shadow-inner flex flex-col justify-between p-3">
                        <div className="flex items-center justify-between text-[8px] font-bold text-slate-500">
                          <span>#SKOMDA</span>
                          <span>VOL.03</span>
                        </div>

                        <div className="my-auto text-center space-y-1">
                          <div className="w-10 h-10 mx-auto rounded-full bg-red-100 text-[#b4000c] flex items-center justify-center font-bold text-xs">
                            <span className="material-symbols-outlined text-[20px]">school</span>
                          </div>
                          <p className="text-[10px] font-extrabold text-slate-900 uppercase">SMPN 1 BUDURAN</p>
                          <p className="text-[8px] text-slate-500">Workshop Literasi AI & Canva</p>
                        </div>

                        <div className="pt-2 border-t border-slate-200 text-center text-[7px] text-slate-400 uppercase font-mono">
                          Kelompok 03 • 2026
                        </div>

                        <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                          Rasio 60:160
                        </div>
                        <div className="absolute bottom-2 left-2 bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                          CMYK 300 DPI
                        </div>

                        {bannerStatus === 'approved' && (
                          <div className="absolute inset-0 bg-emerald-900/40 flex items-center justify-center">
                            <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow">
                              Disetujui
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-4 w-full">
                        <button
                          onClick={() => setIsBannerModalOpen(true)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                          <span>Lihat Full</span>
                        </button>
                        <button
                          onClick={() => setIsBannerModalOpen(true)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-900 hover:bg-[#b4000c] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">download</span>
                          <span>Unduh PDF Cetak</span>
                        </button>
                      </div>
                    </div>

                    {/* Right: File Spec & Evaluation Decision Form */}
                    <div className="flex flex-col justify-between space-y-4">
                      {/* File Spec */}
                      <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <span className="text-xs font-bold text-slate-800">X-Banner_Kelompok03_Final.pdf</span>
                          <span className="text-[11px] text-slate-400 font-mono">28.4 MB</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                          <div><span className="text-slate-400">Dimensi:</span> 60 cm × 160 cm</div>
                          <div><span className="text-slate-400">Palet Warna:</span> CMYK (Presisi)</div>
                          <div><span className="text-slate-400">Tipografi:</span> Poppins Headline</div>
                          <div>
                            <span className="text-slate-400">Status Validasi:</span>{' '}
                            <span
                              className={`font-bold ${
                                bannerStatus === 'approved'
                                  ? 'text-emerald-700'
                                  : bannerStatus === 'revision'
                                  ? 'text-amber-700'
                                  : 'text-amber-600'
                              }`}
                            >
                              {bannerStatus === 'approved'
                                ? 'Disetujui'
                                : bannerStatus === 'revision'
                                ? 'Perlu Revisi'
                                : 'Menunggu Review'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Feedback Pembimbing */}
                      <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-xs space-y-1">
                        <div className="flex items-center justify-between text-amber-800 font-bold">
                          <span>Catatan Pembimbing (Pak Budi Hartono):</span>
                          <span className="text-[10px] text-amber-700 font-normal">Kemarin 14:20</span>
                        </div>
                        <p className="text-slate-700 text-[11px] italic">
                          "Komposisi warna merah Telkom dan logo SMPN 1 Buduran sudah proporsional. Siap diajukan ke admin kurikulum."
                        </p>
                      </div>

                      {/* Decision Form */}
                      <div className="space-y-2.5">
                        <label className="block text-xs font-bold text-slate-800">Form Keputusan Evaluasi:</label>
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-700">
                          <label className="inline-flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="decision_radio"
                              checked={decision === 'approved'}
                              onChange={() => setDecision('approved')}
                              className="text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="font-semibold text-emerald-700">Setujui Banner</span>
                          </label>
                          <label className="inline-flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="decision_radio"
                              checked={decision === 'revision'}
                              onChange={() => setDecision('revision')}
                              className="text-red-600 focus:ring-red-500"
                            />
                            <span className="font-semibold text-[#b4000c]">Minta Revisi Desain</span>
                          </label>
                        </div>

                        <textarea
                          rows={3}
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="Tuliskan catatan perbaikan atau feedback resmi untuk regu..."
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-[#b4000c] focus:ring-1 focus:ring-[#b4000c] text-slate-800"
                        />

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={handleSendDecision}
                            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">task_alt</span>
                            <span>Kirim Keputusan Evaluasi</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-section B: Instagram Checklist Table */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">
                        B
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">
                        Kepatuhan Publikasi Instagram Feed ({members.length} Siswa)
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">
                        Progres: <strong className="text-emerald-600 font-bold">{validMembersCount} dari {members.length} Terunggah</strong>
                      </span>
                      {pendingMembersCount > 0 && (
                        <button
                          onClick={() =>
                            showToast(`Pengingat WhatsApp berhasil dikirim ke ${pendingMembersCount} siswa!`, 'success')
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px] text-emerald-600">send</span>
                          <span>Kirim Reminder WA ({pendingMembersCount} Siswa)</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                            <th className="py-2.5 px-3">#</th>
                            <th className="py-2.5 px-3">Nama Anggota</th>
                            <th className="py-2.5 px-3">Peran Regu</th>
                            <th className="py-2.5 px-3">Tautan Instagram</th>
                            <th className="py-2.5 px-3 text-center">Status</th>
                            <th className="py-2.5 px-3 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {members.map((m, index) => {
                            const isPending = m.status === 'pending';
                            return (
                              <tr
                                key={m.id}
                                className={`transition-colors ${
                                  isPending ? 'bg-amber-50/30 hover:bg-amber-50/50' : 'hover:bg-slate-50'
                                }`}
                              >
                                <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                                  {String(index + 1).padStart(2, '0')}
                                </td>
                                <td className="py-2.5 px-3 font-semibold text-slate-900">{m.name}</td>
                                <td className="py-2.5 px-3 text-slate-500">{m.role}</td>
                                <td className="py-2.5 px-3">
                                  {m.instagramUrl ? (
                                    <a
                                      href={`https://${m.instagramUrl}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-blue-600 hover:underline flex items-center gap-1 font-mono text-[11px]"
                                    >
                                      <span>{m.instagramUrl.slice(0, 24)}...</span>
                                      <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                                    </a>
                                  ) : (
                                    <span className="text-slate-400 italic">Belum diserahkan</span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <button
                                    onClick={() => toggleMemberStatus(m.id)}
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-transform hover:scale-105 ${
                                      m.status === 'valid'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                                    }`}
                                  >
                                    {m.status === 'valid' ? 'Valid' : 'Menunggu'}
                                  </button>
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  {isPending ? (
                                    <button
                                      onClick={() =>
                                        showToast(`Peringatan WhatsApp dikirim ke ${m.name}`, 'warning')
                                      }
                                      className="text-amber-700 hover:underline font-semibold text-xs cursor-pointer"
                                    >
                                      Peringatkan
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => toggleMemberStatus(m.id)}
                                      className="text-slate-400 hover:text-slate-700 text-xs font-medium cursor-pointer"
                                    >
                                      Ubah
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>

              {/* RIWAYAT LANGKAH SEBELUMNYA */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-slate-500">history</span>
                  <span>Arsip Langkah Sebelumnya yang Telah Disetujui</span>
                </h3>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Langkah 03: Susun & Validasi Modul Ajar</h4>
                        <span className="text-[11px] text-slate-500">
                          Disetujui pada 02 Feb 2026 • Modul Literasi AI & Computational Thinking.pptx (14.2 MB)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        Disetujui
                      </span>
                      <button
                        onClick={() => showToast('Mengunduh Modul Ajar Kelompok 03 (14.2 MB)...', 'info')}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">download</span>
                        <span>Unduh Modul</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          Langkah 02: Pemilihan Ketua & Akreditasi Tim
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          Disetujui pada 20 Jan 2026 • Ahmad Rizky terpilih sebagai Ketua Tim
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold shrink-0">
                      Disetujui
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          Langkah 01: Pembentukan Regu (8 Siswa Relawan)
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          Berkas fakta integritas dan surat izin orang tua lengkap 8/8 siswa
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold shrink-0">
                      Lengkap (8/8)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT 4-COLUMN INSPECTION SIDEBAR PANEL */}
            <div className="col-span-12 lg:col-span-4 space-y-6 min-w-0">
              {/* CARD 1: SPRINT BOARD TAHAP 04 */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#b4000c]">view_kanban</span>
                    <h3 className="text-sm font-bold text-slate-900">Sprint Board Tahap 04</h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-0.5 rounded">
                    {sprintTasks.length} Tugas
                  </span>
                </div>

                <div className="space-y-3">
                  {sprintTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border space-y-1.5 transition-colors ${
                        task.column === 'todo'
                          ? 'bg-slate-50 border-slate-200'
                          : task.column === 'in_progress'
                          ? 'bg-amber-50/70 border-amber-200'
                          : 'bg-emerald-50/60 border-emerald-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                        <span
                          className={
                            task.column === 'todo'
                              ? 'text-slate-500'
                              : task.column === 'in_progress'
                              ? 'text-amber-800'
                              : 'text-emerald-700'
                          }
                        >
                          {task.column === 'todo'
                            ? 'Akan Dikerjakan'
                            : task.column === 'in_progress'
                            ? 'Dalam Proses Review'
                            : 'Telah Selesai'}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            task.column === 'todo'
                              ? 'bg-slate-400'
                              : task.column === 'in_progress'
                              ? 'bg-amber-500 animate-pulse'
                              : 'bg-emerald-500'
                          }`}
                        />
                      </div>

                      <p
                        className={`text-xs font-semibold leading-snug ${
                          task.column === 'done' ? 'line-through text-slate-500' : 'text-slate-800'
                        }`}
                      >
                        {task.title}
                      </p>

                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                        <span>{task.subtext}</span>
                        <div className="flex items-center gap-1">
                          {task.column !== 'todo' && (
                            <button
                              onClick={() => moveTaskColumn(task.id, 'todo')}
                              className="hover:text-slate-900 cursor-pointer"
                              title="Pindah ke Todo"
                            >
                              ← Todo
                            </button>
                          )}
                          {task.column !== 'done' && (
                            <button
                              onClick={() => moveTaskColumn(task.id, 'done')}
                              className="text-emerald-700 font-bold hover:underline cursor-pointer"
                              title="Tandai Selesai"
                            >
                              ✓ Selesai
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 2: CATATAN SUPERVISI INTERNAL */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-slate-700">edit_note</span>
                    <h3 className="text-sm font-bold text-slate-900">Catatan Supervisi Internal</h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded">
                    Khusus Admin
                  </span>
                </div>

                <div className="space-y-3">
                  <textarea
                    id="supervisor-memo-box"
                    rows={3}
                    value={memoInput}
                    onChange={(e) => setMemoInput(e.target.value)}
                    placeholder="Tuliskan memo koordinasi internal pembimbing dan admin kurikulum..."
                    className="w-full text-xs p-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-[#b4000c] focus:ring-1 focus:ring-[#b4000c] text-slate-800 placeholder:text-slate-400"
                  />
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={shareMemo}
                      onChange={(e) => setShareMemo(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#b4000c] focus:ring-[#b4000c]"
                    />
                    <span className="text-xs text-slate-600 leading-snug">
                      Tampilkan catatan ini ke Ketua Kelompok di Berandanya
                    </span>
                  </label>
                  <button
                    onClick={handleSaveMemo}
                    className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-[#b4000c] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    <span>Simpan Memo Internal</span>
                  </button>
                </div>
              </div>

              {/* CARD 3: KONTAK MITRA & PEMBIMBING */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-slate-700">contact_phone</span>
                    <h3 className="text-sm font-bold text-slate-900">Kontak Mitra & Pembimbing</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* PIC SMP */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase font-bold text-[#b4000c] tracking-wider">
                        PIC SMPN 1 BUDURAN
                      </span>
                      <span className="material-symbols-outlined text-[15px] text-slate-400">domain</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">Bu Sri Wahyuni, M.Pd</div>
                    <div className="text-[11px] text-slate-500">Waka Kurikulum & Guru Pamong</div>
                    <div className="pt-1">
                      <a
                        href="tel:+6281234908812"
                        className="text-xs text-[#b4000c] hover:underline font-semibold inline-flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">call</span>
                        <span>+62 812-3490-8812</span>
                      </a>
                    </div>
                  </div>

                  {/* Guru Pembimbing Skomda */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                        GURU PEMBIMBING SKOMDA
                      </span>
                      <span className="material-symbols-outlined text-[15px] text-slate-400">school</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">Pak Budi Hartono, S.Kom</div>
                    <div className="text-[11px] text-slate-500">NIP. 19850312 201001 1 018</div>
                    <div className="pt-1">
                      <a
                        href="tel:+6281122334455"
                        className="text-xs text-slate-800 hover:underline font-semibold inline-flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">call</span>
                        <span>+62 811-2233-4455</span>
                      </a>
                    </div>
                  </div>

                  {/* School Location & Schedule */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-[#b4000c] shrink-0 mt-0.5">
                      location_on
                    </span>
                    <div className="flex flex-col text-xs">
                      <span className="font-bold text-slate-800">SMP Negeri 1 Buduran</span>
                      <span className="text-[11px] text-slate-500 mt-0.5">
                        Jl. Raya Buduran No. 42, Sidoarjo (3.4 km dari SMK Telkom)
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold mt-1">
                        Jadwal Mengajar: Kamis, 22 Feb 2026 (08:00 WIB)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
