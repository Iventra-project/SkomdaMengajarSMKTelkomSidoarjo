"use client";
import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  School,
  ShieldCheck,
  Users,
  AlertTriangle,
} from 'lucide-react';
import { formatGroupNumber, useApp } from '../../context/AppContext';
import { BrandLogo } from '../../components/BrandLogo';

export const MentorDashboardPage: React.FC = () => {
  const {
    currentPath,
    currentUser,
    groups,
    mentors,
    navigate,
    logout,
    showToast,
    getGroupStages,
    fetchGroupStages,
    reviewStageProgress,
  } = useApp();

  // Filtered groups: ONLY groups assigned by Admin to this mentor
  const assignedGroupIds = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin') {
      return groups.filter((g) => g.number !== '00').map((g) => g.number);
    }
    const liveMentor = mentors.find(
      (m) => m.email.toLowerCase() === currentUser.email.toLowerCase() || m.id === currentUser.id
    );
    return liveMentor?.assignedGroupIds || currentUser.assignedGroupIds || [];
  }, [currentUser, groups, mentors]);

  const myGroups = useMemo(() => {
    return groups
      .filter((g) => assignedGroupIds.includes(g.number))
      .sort((a, b) => Number(a.number) - Number(b.number));
  }, [groups, assignedGroupIds]);

  // Parse requested group from URL hash if present (e.g. #/mentor/kelompok/03)
  const requestedUrlGroup = useMemo(() => {
    const match = currentPath.match(/^\/mentor\/kelompok\/(\d+)$/i);
    return match ? formatGroupNumber(match[1]) : null;
  }, [currentPath]);

  const [selectedGroupId, setSelectedGroupId] = useState<string>(() => {
    if (requestedUrlGroup && assignedGroupIds.includes(requestedUrlGroup)) {
      return requestedUrlGroup;
    }
    return myGroups[0]?.number || '';
  });

  // Guard: If URL specifies a group that does NOT belong to this mentor, block it
  const isForbiddenGroupUrl = Boolean(
    requestedUrlGroup &&
      currentUser?.role === 'mentor' &&
      !assignedGroupIds.includes(requestedUrlGroup)
  );

  useEffect(() => {
    if (requestedUrlGroup && assignedGroupIds.includes(requestedUrlGroup)) {
      setSelectedGroupId(requestedUrlGroup);
    } else if (!selectedGroupId && myGroups.length > 0) {
      setSelectedGroupId(myGroups[0].number);
    }
  }, [requestedUrlGroup, assignedGroupIds, myGroups, selectedGroupId]);

  useEffect(() => {
    if (selectedGroupId && !isForbiddenGroupUrl) {
      void fetchGroupStages(selectedGroupId);
    }
  }, [selectedGroupId, isForbiddenGroupUrl]);

  const selectedGroup = useMemo(
    () => myGroups.find((g) => g.number === selectedGroupId) || myGroups[0] || null,
    [myGroups, selectedGroupId]
  );

  const stages = useMemo(
    () => (selectedGroup ? getGroupStages(selectedGroup.number) : []),
    [selectedGroup, getGroupStages]
  );

  const [stageNotes, setStageNotes] = useState<Record<number, string>>({});
  const [submittingStage, setSubmittingStage] = useState<number | null>(null);

  const handleSelectGroup = (groupNum: string) => {
    setSelectedGroupId(groupNum);
    navigate(`/mentor/kelompok/${groupNum}`);
  };

  const handleReviewAction = async (stageNumber: number, decision: 'approved' | 'revision') => {
    if (!selectedGroup) return;
    const note = stageNotes[stageNumber] ?? '';
    if (decision === 'revision' && !note.trim()) {
      showToast('Tulis catatan revisi singkat agar kelompok tahu bagian yang harus diperbaiki.', 'warning');
      return;
    }

    setSubmittingStage(stageNumber);
    try {
      const res = await reviewStageProgress(
        selectedGroup.number,
        stageNumber,
        decision,
        note.trim() || (decision === 'approved' ? 'Disetujui oleh Guru Pembimbing.' : '')
      );
      if (!res.ok) {
        showToast(res.error || 'Gagal menyimpan keputusan.', 'warning');
      } else {
        setStageNotes((prev) => ({ ...prev, [stageNumber]: '' }));
      }
    } finally {
      setSubmittingStage(null);
    }
  };

  const approvedCount = stages.filter((s) => s.accStatus === 'approved').length;
  const submittedCount = stages.filter((s) => s.accStatus === 'submitted').length;
  const revisionCount = stages.filter((s) => s.accStatus === 'revision').length;

  return (
    <div className="min-h-screen lg:h-screen w-full lg:overflow-hidden overflow-x-hidden bg-[#F0F2F5] text-slate-900 font-sans p-3 sm:p-5 lg:p-6 flex flex-col lg:flex-row gap-5 items-start antialiased selection:bg-[#E50914] selection:text-white">
      {/* ══════════════════════════════════════════════════════════════════════════
          1. FLOATING LEFT SIDEBAR (HANYA KELOMPOK BIMBINGAN GURU INI)
      ══════════════════════════════════════════════════════════════════════════ */}
      <aside className="w-full lg:w-64 shrink-0 bg-white rounded-[28px] shadow-sm p-4 flex flex-col justify-between z-30 border border-slate-200/70 lg:h-full overflow-hidden select-none">
        <div className="space-y-5 overflow-y-auto pr-0.5">
          {/* Top Brand Identity */}
          <div className="flex items-center justify-between lg:flex-col lg:items-start gap-2 pb-3.5 border-b border-slate-100">
            <button
              onClick={() => navigate('/')}
              className="flex items-center cursor-pointer text-left"
              title="Kembali ke Landing Page"
            >
              <BrandLogo size="sm" />
            </button>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Portal Guru Pembimbing
              </span>
            </div>
          </div>

          {/* Mentor Assigned Groups Quick Navigation */}
          <div className="space-y-1.5">
            <div className="px-2 flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Kelompok Bimbingan Anda
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold">
                {myGroups.length}
              </span>
            </div>

            {myGroups.length === 0 ? (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                Belum ada kelompok yang di-plotting oleh Admin untuk Anda.
              </div>
            ) : (
              <div className="space-y-1">
                {myGroups.map((grp) => {
                  const isActive = selectedGroup?.number === grp.number;
                  return (
                    <button
                      key={grp.number}
                      onClick={() => handleSelectGroup(grp.number)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer text-left ${
                        isActive
                          ? 'bg-[#E50914] text-white shadow-md shadow-red-500/20'
                          : 'text-slate-700 hover:bg-[#F0F2F5]'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="block font-extrabold">KEL-{grp.number}</span>
                        <span
                          className={`block text-[11px] truncate ${
                            isActive ? 'text-white/85 font-medium' : 'text-slate-500 font-normal'
                          }`}
                        >
                          {grp.schoolName}
                        </span>
                      </div>
                      <LayoutDashboard className="w-3.5 h-3.5 shrink-0 opacity-80" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 mt-4 border-t border-slate-100 space-y-1.5 shrink-0">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-[#F0F2F5] transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Lihat Landing Page</span>
          </button>

          <button
            onClick={() => void logout('/login?role=admin')}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. MAIN WORKSPACE AREA
      ══════════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 min-w-0 w-full lg:h-full lg:overflow-y-auto overflow-x-hidden flex flex-col gap-5 pr-0.5">
        {/* ─── FLOATING TOP HEADER PILL WITH GROUP SELECTOR DROPDOWN ─── */}
        <header className="w-full bg-white rounded-3xl lg:rounded-full px-4 sm:px-6 py-3 shadow-sm border border-slate-200/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#E50914] bg-red-50 px-3 py-1 rounded-full border border-red-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Guru Pembimbing</span>
            </span>
            <span className="text-xs font-bold text-slate-700 hidden sm:inline">
              {currentUser?.name}
            </span>
          </div>

          {/* Dropdown Seleksi Kelompok Bimbingan */}
          {myGroups.length > 0 && (
            <div className="flex items-center gap-2 bg-[#F0F2F5] px-3 py-1.5 rounded-full">
              <span className="text-xs font-bold text-slate-600 whitespace-nowrap">
                Pindah Kelompok:
              </span>
              <select
                value={selectedGroup?.number || ''}
                onChange={(e) => handleSelectGroup(e.target.value)}
                className="bg-white border border-slate-300 rounded-full px-3 py-1 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-[#E50914] cursor-pointer"
              >
                {myGroups.map((g) => (
                  <option key={g.number} value={g.number}>
                    KEL-{g.number} — {g.schoolName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </header>

        {/* ─── ROUTE GUARD BLOCK IF MENTOR TRIES TO ACCESS UNASSIGNED GROUP VIA URL ─── */}
        {isForbiddenGroupUrl ? (
          <div className="bg-white border border-rose-200 rounded-3xl p-8 text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-[#E50914] flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Akses Ditolak (403 Forbidden)
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Kelompok <strong>KEL-{requestedUrlGroup}</strong> tidak termasuk dalam daftar kelompok bimbingan yang ditetapkan Admin untuk Anda.
            </p>
            <button
              onClick={() => navigate('/mentor')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-[#E50914] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Kembali ke Kelompok Bimbingan Saya
            </button>
          </div>
        ) : !selectedGroup ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-3 shadow-sm">
            <Users className="w-10 h-10 text-slate-400 mx-auto" />
            <h2 className="text-lg font-extrabold text-slate-900">Belum Ada Kelompok Bimbingan</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Admin Kurikulum belum menugaskan kelompok ke akun Anda. Hubungi Admin untuk melakukan plotting kelompok.
            </p>
          </div>
        ) : (
          <main className="space-y-6 pb-8">
            {/* Selected Group Summary Card */}
            <section className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-extrabold">
                    KEL-{selectedGroup.number}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                    <School className="w-3.5 h-3.5 text-[#E50914]" />
                    <span>{selectedGroup.schoolName}</span>
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Monitoring & ACC Tahapan Kelompok {selectedGroup.number}
                </h1>
                <p className="text-sm text-slate-600">
                  Ketua Regu: <strong className="text-slate-900">{selectedGroup.leaderName || 'Belum ditentukan'}</strong> •{' '}
                  {selectedGroup.memberCount} anggota • Modul: {selectedGroup.featuredModule}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2.5 shrink-0">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 text-center">
                  <span className="text-2xl font-extrabold text-emerald-700 block">{approvedCount}</span>
                  <span className="text-[11px] font-bold text-emerald-800">Sudah Di-ACC</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-center">
                  <span className="text-2xl font-extrabold text-amber-700 block">{submittedCount}</span>
                  <span className="text-[11px] font-bold text-amber-800">Menunggu ACC</span>
                </div>
                <div className="bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 text-center">
                  <span className="text-2xl font-extrabold text-rose-700 block">{revisionCount}</span>
                  <span className="text-[11px] font-bold text-rose-800">Perlu Revisi</span>
                </div>
              </div>
            </section>

            {/* 6 Stages ACC List */}
            <section className="space-y-3">
              <h2 className="text-base font-extrabold text-slate-900 px-1">
                Daftar 6 Tahapan Pengerjaan & Status ACC
              </h2>

              <div className="space-y-3">
                {stages.map((stg) => {
                  const isApproved = stg.accStatus === 'approved';
                  const isSubmitted = stg.accStatus === 'submitted';
                  const isRevision = stg.accStatus === 'revision';

                  return (
                    <div
                      key={stg.stageNumber}
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold ${
                                isApproved
                                  ? 'bg-emerald-500 text-white'
                                  : isSubmitted
                                    ? 'bg-amber-400 text-slate-950'
                                    : isRevision
                                      ? 'bg-rose-500 text-white'
                                      : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {isApproved ? <Check className="w-4 h-4" /> : stg.stageNumber}
                            </span>
                            <h3 className="text-base font-extrabold text-slate-900">
                              Tahap 0{stg.stageNumber}: {stg.title}
                            </h3>
                          </div>

                          {stg.submissionUrl ? (
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 pl-9">
                              <a
                                href={stg.submissionUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:underline"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>{stg.submissionUrl}</span>
                              </a>
                              {stg.submissionNote && (
                                <span className="text-slate-500">• "{stg.submissionNote}"</span>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 pl-9">
                              Kelompok belum mengunggah berkas progres pada tahap ini.
                            </p>
                          )}
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0 self-start md:self-center">
                          {isApproved && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-extrabold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Sudah Di-ACC</span>
                            </span>
                          )}
                          {isSubmitted && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-extrabold">
                              <Clock className="w-3.5 h-3.5 text-amber-700" />
                              <span>Menunggu ACC Anda</span>
                            </span>
                          )}
                          {isRevision && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-900 text-xs font-extrabold">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                              <span>Perlu Revisi</span>
                            </span>
                          )}
                          {stg.accStatus === 'pending' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-600 text-xs font-bold">
                              Belum Diunggah
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Existing reviewer note */}
                      {stg.reviewerNote && (
                        <div className="ml-0 sm:ml-9 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-900 block">
                              Catatan Pembimbing{stg.reviewerName ? ` (${stg.reviewerName})` : ''}:
                            </span>
                            <span>{stg.reviewerNote}</span>
                          </div>
                        </div>
                      )}

                      {/* Approval / ACC & Revision Action Bar */}
                      <div className="ml-0 sm:ml-9 pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                        <input
                          type="text"
                          value={stageNotes[stg.stageNumber] ?? ''}
                          onChange={(e) =>
                            setStageNotes((prev) => ({ ...prev, [stg.stageNumber]: e.target.value }))
                          }
                          placeholder="Tulis catatan ACC atau bagian yang perlu direvisi..."
                          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900"
                        />
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            disabled={submittingStage === stg.stageNumber}
                            onClick={() => void handleReviewAction(stg.stageNumber, 'approved')}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>ACC Tahapan</span>
                          </button>
                          <button
                            disabled={submittingStage === stg.stageNumber}
                            onClick={() => void handleReviewAction(stg.stageNumber, 'revision')}
                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer"
                          >
                            Minta Revisi
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </main>
        )}
      </div>
    </div>
  );
};
