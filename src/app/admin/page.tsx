"use client";
import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  X,
  Check,
  Search,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Home,
  LayoutDashboard,
  Users,
  MessageSquare,
  Calendar,
  LogOut,
  Bell,
} from 'lucide-react';

import { BrandLogo } from '../../components/BrandLogo';
import {
  ActionRowItem,
  GroupProgressRow,
  INITIAL_GROUPS,
  INITIAL_WAITING_ADMIN,
  INITIAL_WAITING_GROUP,
  SIX_STAGES,
} from '../../data/adminMockData';

export type { ActionRowItem, GroupProgressRow };
export { SIX_STAGES };

export const AdminMonitoringPage: React.FC = () => {
  const { navigate, showToast, submitBannerDecision, updateGroupLeader, resetGroupLeader, logoutAdmin, currentUser } = useApp();

  // Navigation: 'beranda' | 'kelompok' | 'feedback' | 'pengaturan'
  const [activeScreen, setActiveScreen] = useState<'beranda' | 'kelompok' | 'feedback' | 'pengaturan'>('beranda');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Groups and Action Data State
  const [groupsList, setGroupsList] = useState<GroupProgressRow[]>(INITIAL_GROUPS);
  const [waitingAdminItems, setWaitingAdminItems] = useState<ActionRowItem[]>(INITIAL_WAITING_ADMIN);
  const [waitingGroupItems, setWaitingGroupItems] = useState<ActionRowItem[]>(INITIAL_WAITING_GROUP);

  // Screen 1: Whose turn it is tab ('admin' | 'kelompok')
  const [turnTab, setTurnTab] = useState<'admin' | 'kelompok'>('admin');
  const [showAllActions, setShowAllActions] = useState(false);

  // Screen 1: Progres Kelompok Search & Chips & Pagination (10 per page)
  const [progressSearch, setProgressSearch] = useState('');
  const [progressChip, setProgressChip] = useState<'all' | 'attention' | 'done'>('all');
  const [progressPage, setProgressPage] = useState<number>(1);
  const [kelompokPage, setKelompokPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 10;

  // Screen 2: Slide-over Review Panel
  const [reviewQueue, setReviewQueue] = useState<GroupProgressRow[]>([]);
  const [currentReviewIdx, setCurrentReviewIdx] = useState<number>(0);
  const [isReviewPanelOpen, setIsReviewPanelOpen] = useState(false);
  const [isAllReviewsFinished, setIsAllReviewsFinished] = useState(false);
  const [isRevisionBoxOpen, setIsRevisionBoxOpen] = useState(false);
  const [revisionComment, setRevisionComment] = useState('');

  // Screen 3: "Kelompok" Impor CSV 3-Step Dialog
  const [isImportCsvOpen, setIsImportCsvOpen] = useState(false);
  const [importCsvStep, setImportCsvStep] = useState<1 | 2 | 3>(1);

  // Screen 3: Tandai Ketua Dialog
  const [assignLeaderGroup, setAssignLeaderGroup] = useState<GroupProgressRow | null>(null);
  const [selectedLeaderMember, setSelectedLeaderMember] = useState<string>('');
  const [createdCredentials, setCreatedCredentials] = useState<{
    name: string;
    groupNum: string;
    username: string;
    pass: string;
  } | null>(null);

  // Clipboard reminder helper note indicator
  const [copiedReminderId, setCopiedReminderId] = useState<string | null>(null);

  // Count groups with leader (persiapan phase)
  const groupsWithLeaderCount = useMemo(() => {
    return groupsList.filter((g) => g.hasLeader).length;
  }, [groupsList]);

  // Is "Persiapan" unfinished?
  const isPersiapanUnfinished = groupsWithLeaderCount < groupsList.length;

  // Filtered Progres Kelompok Rows
  const filteredProgressRows = useMemo(() => {
    return groupsList.filter((g) => {
      if (progressChip === 'attention') {
        const needsAttention =
          g.urgentStatus === 'review' || g.urgentStatus === 'overdue' || g.urgentStatus === 'revisi';
        if (!needsAttention) return false;
      }
      if (progressChip === 'done') {
        if (g.urgentStatus !== 'approved') return false;
      }

      const q = progressSearch.toLowerCase().trim();
      if (!q) return true;
      return (
        g.number.includes(q) ||
        g.schoolName.toLowerCase().includes(q) ||
        g.leaderName.toLowerCase().includes(q) ||
        g.currentStage.toLowerCase().includes(q)
      );
    });
  }, [groupsList, progressChip, progressSearch]);

  const totalProgressPages = Math.max(1, Math.ceil(filteredProgressRows.length / ITEMS_PER_PAGE));
  const safeProgressPage = Math.min(progressPage, totalProgressPages);
  const paginatedProgressRows = useMemo(() => {
    const start = (safeProgressPage - 1) * ITEMS_PER_PAGE;
    return filteredProgressRows.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProgressRows, safeProgressPage]);

  const totalKelompokPages = Math.max(1, Math.ceil(groupsList.length / ITEMS_PER_PAGE));
  const safeKelompokPage = Math.min(kelompokPage, totalKelompokPages);
  const paginatedKelompokRows = useMemo(() => {
    const start = (safeKelompokPage - 1) * ITEMS_PER_PAGE;
    return groupsList.slice(start, start + ITEMS_PER_PAGE);
  }, [groupsList, safeKelompokPage]);

  const renderPaginationBar = (
    currentPage: number,
    totalPages: number,
    totalItems: number,
    onPageChange: (page: number) => void
  ) => {
    if (totalItems <= ITEMS_PER_PAGE) return null;
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endIdx = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);
    return (
      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <span className="text-slate-600 font-medium">
          Menampilkan <strong className="text-slate-900">{startIdx}–{endIdx}</strong> dari{' '}
          <strong className="text-slate-900">{totalItems}</strong> kelompok
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-100 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            ← Sebelumnya
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 rounded-lg font-bold transition-colors cursor-pointer ${
                pageNum === currentPage
                  ? 'bg-[#E50914] text-white shadow-2xs'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-100 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            Berikutnya →
          </button>
        </div>
      </div>
    );
  };

  const renderActionItemGrid = (item: ActionRowItem) => (
    <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2.5 flex-1 min-w-0">
      <div className="sm:col-span-3 min-w-0">
        <span className="text-sm font-extrabold text-slate-900 block truncate">
          {item.groupNumber}
        </span>
        <span className="text-xs text-slate-500 block truncate">
          Ketua: {item.leaderName}
        </span>
      </div>
      <div className="sm:col-span-4 min-w-0">
        <span className="text-sm font-semibold text-slate-800 block truncate">
          {item.schoolName}
        </span>
        <span className="text-xs text-slate-500 block truncate">
          {item.stageName}
        </span>
      </div>
      <div className="sm:col-span-5 min-w-0">
        <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 inline-block max-w-full truncate">
          {item.itemName}
        </span>
      </div>
    </div>
  );

  // ─── HANDLER: Copy Reminder ───────────────────────────────────────────────
  const handleCopyReminder = (item: ActionRowItem) => {
    const text = `Halo Ketua ${item.groupNumber} (${item.schoolName}), mohon segera mengunggah berkas "${item.itemName}" untuk program Skomda Mengajar. Terima kasih.`;
    navigator.clipboard?.writeText(text);
    setCopiedReminderId(item.id);
    showToast('Teks pengingat disalin, tinggal tempel di WhatsApp.', 'success');
  };

  // ─── HANDLER: Open Review Panel ───────────────────────────────────────────
  const handleOpenReview = (groupId?: string) => {
    const clickedGroup = groupId ? groupsList.find((g) => g.id === groupId) : undefined;
    const pendingReviews = groupsList.filter((g) => g.urgentStatus === 'review');

    let queue: GroupProgressRow[] = pendingReviews;
    if (clickedGroup && !pendingReviews.some((g) => g.id === clickedGroup.id)) {
      queue = [clickedGroup, ...pendingReviews];
    }

    if (queue.length === 0) {
      showToast('Semua review sudah selesai.', 'info');
      return;
    }
    setReviewQueue(queue);

    // Find requested group index, or default to 0
    let targetIdx = 0;
    if (groupId) {
      const idx = queue.findIndex((g) => g.id === groupId);
      if (idx !== -1) targetIdx = idx;
    }
    setCurrentReviewIdx(targetIdx);
    setIsAllReviewsFinished(false);
    setIsRevisionBoxOpen(false);
    setRevisionComment('');
    setIsReviewPanelOpen(true);
  };

  // ─── HANDLER: Approve and Next in Review Panel ────────────────────────────
  const handleApproveAndNext = () => {
    const currentGroup = reviewQueue[currentReviewIdx];
    if (!currentGroup) return;

    // Synchronize to AppContext
    submitBannerDecision(
      'approved',
      'Semua berkas tahap ini sudah diperiksa dan disetujui resmi oleh Kurikulum.',
      currentGroup.number
    );

    // Mark current group as approved
    setGroupsList((prev) =>
      prev.map((g) =>
        g.id === currentGroup.id
          ? {
            ...g,
            urgentStatus: 'approved',
            urgentStatusLabel: 'Disetujui',
            urgentStatusHint: 'Semua berkas tahap ini sudah diperiksa dan disetujui',
            approvedItemsText: '4 dari 5 disetujui',
          }
          : g
      )
    );

    // Remove from waitingAdminItems
    setWaitingAdminItems((prev) => prev.filter((item) => item.groupId !== currentGroup.id));

    // Move to next review or finish
    if (currentReviewIdx + 1 < reviewQueue.length) {
      setCurrentReviewIdx(currentReviewIdx + 1);
      setIsRevisionBoxOpen(false);
      setRevisionComment('');
    } else {
      setIsAllReviewsFinished(true);
    }
  };

  // ─── HANDLER: Submit Revision in Review Panel ─────────────────────────────
  const handleSubmitRevision = () => {
    const currentGroup = reviewQueue[currentReviewIdx];
    if (!currentGroup) return;
    if (!revisionComment.trim()) {
      showToast('Tulis catatan revisi sebelum mengirim.', 'warning');
      return;
    }

    // Synchronize to AppContext
    submitBannerDecision('revision', revisionComment.trim(), currentGroup.number);

    // Update group to revisi
    setGroupsList((prev) =>
      prev.map((g) =>
        g.id === currentGroup.id
          ? {
            ...g,
            urgentStatus: 'revisi',
            urgentStatusLabel: 'Perlu revisi',
            urgentStatusHint: 'Catatan revisi sudah dikirim, kelompok belum mengunggah ulang',
          }
          : g
      )
    );

    // Remove from waitingAdminItems and add to waitingGroupItems
    setWaitingAdminItems((prev) => prev.filter((item) => item.groupId !== currentGroup.id));
    setWaitingGroupItems((prev) => [
      ...prev,
      {
        id: `revisi-${currentGroup.id}`,
        groupId: currentGroup.id,
        groupNumber: `Kelompok ${currentGroup.number}`,
        schoolName: currentGroup.schoolName,
        itemName: 'X-Banner v2 (Revisi)',
        stageName: currentGroup.currentStage,
        status: 'revisi',
        statusLabel: 'Perlu revisi',
        statusHint: 'Menunggu ketua mengunggah ulang draf revisi',
        ageText: 'Revisi belum diunggah ulang',
        leaderName: currentGroup.leaderName,
        memberCount: currentGroup.members.length,
      },
    ]);

    // Move to next or finish
    if (currentReviewIdx + 1 < reviewQueue.length) {
      setCurrentReviewIdx(currentReviewIdx + 1);
      setIsRevisionBoxOpen(false);
      setRevisionComment('');
    } else {
      setIsAllReviewsFinished(true);
    }
  };

  // ─── HANDLER: Confirm Leader Assignment (Screen 3) ─────────────────────────
  const handleConfirmLeaderAssignment = () => {
    if (!assignLeaderGroup || !selectedLeaderMember) return;
    const memberObj = assignLeaderGroup.members.find((m) => m.name === selectedLeaderMember);
    const nis = memberObj?.nis || `2024.11.${assignLeaderGroup.number}01`;
    const randomInitialPass = `skm-${Math.floor(1000 + Math.random() * 9000)}`;

    // Synchronize with AppContext so / and /home see the newly assigned leader
    updateGroupLeader(assignLeaderGroup.number, selectedLeaderMember);

    setGroupsList((prev) =>
      prev.map((g) =>
        g.id === assignLeaderGroup.id
          ? {
            ...g,
            hasLeader: true,
            leaderName: selectedLeaderMember,
            currentStage: 'Tahap 2: Rancang materi',
            completedStages: 1,
            currentStageIndex: 2,
            urgentStatus: 'waiting',
            urgentStatusLabel: 'Belum dikumpulkan',
            urgentStatusHint: 'Ketua sudah ditetapkan, menunggu penyusunan materi',
          }
          : g
      )
    );

    setCreatedCredentials({
      name: selectedLeaderMember,
      groupNum: assignLeaderGroup.number,
      username: nis,
      pass: randomInitialPass,
    });
    setAssignLeaderGroup(null);
    setSelectedLeaderMember('');
  };

  const currentReviewGroup = reviewQueue[currentReviewIdx];
  const reviewPendingCount = useMemo(
    () => groupsList.filter((g) => g.urgentStatus === 'review').length,
    [groupsList]
  );
  const lateOrRevisionCount = useMemo(
    () => groupsList.filter((g) => g.urgentStatus === 'overdue' || g.urgentStatus === 'revisi').length,
    [groupsList]
  );
  const approvedCount = useMemo(
    () => groupsList.filter((g) => g.urgentStatus === 'approved').length,
    [groupsList]
  );
  const noLeaderCount = useMemo(
    () => groupsList.filter((g) => !g.hasLeader).length,
    [groupsList]
  );

  return (
    <div className="min-h-screen lg:h-screen w-full lg:overflow-hidden overflow-x-hidden bg-[#F0F2F5] text-slate-900 font-sans p-3 sm:p-5 lg:p-6 flex flex-col lg:flex-row gap-5 items-start antialiased selection:bg-[#E50914] selection:text-white">
      {/* ══════════════════════════════════════════════════════════════════════════
          1. FLOATING LEFT SIDEBAR (LOCKED / NON-SCROLLING ON DESKTOP)
      ══════════════════════════════════════════════════════════════════════════ */}
      <aside className="w-full lg:w-56 shrink-0 bg-white rounded-[28px] shadow-sm p-4 flex flex-col justify-between z-30 border border-slate-200/70 lg:h-full overflow-hidden select-none">
        <div className="space-y-5">
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Workspace Admin • 2026
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
              Menu Utama
            </span>

            <button
              onClick={() => setActiveScreen('beranda')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeScreen === 'beranda'
                  ? 'bg-[#E50914] text-white shadow-md shadow-red-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#F0F2F5]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Pantau Progres</span>
              </div>
              {waitingAdminItems.length > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                    activeScreen === 'beranda'
                      ? 'bg-white text-[#E50914]'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {waitingAdminItems.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveScreen('kelompok')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeScreen === 'kelompok'
                  ? 'bg-[#E50914] text-white shadow-md shadow-red-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#F0F2F5]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 shrink-0" />
                <span>Data Kelompok</span>
              </div>
              {noLeaderCount > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                    activeScreen === 'kelompok'
                      ? 'bg-white text-[#E50914]'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {noLeaderCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveScreen('feedback')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeScreen === 'feedback'
                  ? 'bg-[#E50914] text-white shadow-md shadow-red-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#F0F2F5]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>Feedback SMP</span>
              </div>
            </button>

            <button
              onClick={() => setActiveScreen('pengaturan')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeScreen === 'pengaturan'
                  ? 'bg-[#E50914] text-white shadow-md shadow-red-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#F0F2F5]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Jadwal & Tahap</span>
              </div>
            </button>
          </div>

          {/* Quick Review Button in Sidebar */}
          <div className="p-3.5 rounded-2xl bg-[#F0F2F5] border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800">Antrean Review</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold">
                {waitingAdminItems.length} berkas
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Periksa berkas X-Banner & modul yang baru diunggah ketua.
            </p>
            <button
              onClick={() => handleOpenReview()}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-[#E50914] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              Buka Panel Review →
            </button>
          </div>
        </div>

        {/* Bottom Profile & Back to Landing Page */}
        <div className="pt-3 mt-4 border-t border-slate-100 space-y-1.5">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-[#F0F2F5] transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Lihat Landing Page</span>
          </button>

          <button
            onClick={async () => {
              await logoutAdmin();
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Keluar Sesi Admin</span>
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. MAIN WORKSPACE AREA (SCROLLABLE CONTENT PANEL, SIDEBAR LOCKED)
      ══════════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 min-w-0 w-full lg:h-full lg:overflow-y-auto overflow-x-hidden flex flex-col gap-5 pr-0.5">
        {/* ─── FLOATING TOP HEADER PILL (COMPACT, NO HORIZONTAL SCROLLBAR) ─── */}
        <header className="w-full bg-white rounded-3xl lg:rounded-full px-4 sm:px-5 py-2.5 shadow-sm border border-slate-200/60 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Current Active Section & Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E50914] bg-red-50 px-3 py-1 rounded-full border border-red-200 whitespace-nowrap">
              Panel Guru Pembimbing
            </span>
            <span className="text-[11px] font-bold text-slate-700 bg-[#F0F2F5] px-2.5 py-1 rounded-full whitespace-nowrap">
              {groupsList.length} Kelompok
            </span>
          </div>

          {/* Center: Compact 6-Stage Navigator Pill (Fits without horizontal scroll) */}
          <div className="hidden md:flex items-center bg-[#F0F2F5] p-1 rounded-full text-[11px] font-bold gap-1">
            {SIX_STAGES.map((stgName, idx) => {
              const stgNum = idx + 1;
              const isPast = stgNum < 3;
              const isCurrent = stgNum === 3;
              return (
                <div
                  key={stgNum}
                  className={`px-2.5 py-1 rounded-full flex items-center gap-1 whitespace-nowrap transition-all ${
                    isPast
                      ? 'text-emerald-700 bg-white/70'
                      : isCurrent
                        ? 'bg-[#E50914] text-white shadow-xs font-extrabold px-3'
                        : 'text-slate-400'
                  }`}
                  title={`Tahap 0${stgNum}: ${stgName}`}
                >
                  {isPast && <Check className="w-3 h-3 text-emerald-600 shrink-0" />}
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />}
                  <span>
                    {isCurrent ? `Tahap 0${stgNum}: ${stgName}` : `0${stgNum}`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right: Notification & Admin Avatar */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleOpenReview()}
              className="w-8 h-8 rounded-full bg-[#F0F2F5] hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer relative shrink-0"
              title="Antrean Review Berkas"
            >
              <Bell className="w-4 h-4" />
              {waitingAdminItems.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#E50914] absolute top-1.5 right-1.5 border border-white" />
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 pl-0.5 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                title="Menu Guru Pembimbing"
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-slate-200 shadow-xs shrink-0">
                  GP
                </div>
                <div className="hidden xl:block text-left">
                  <span className="text-xs font-extrabold text-slate-900 block leading-tight whitespace-nowrap">
                    {currentUser?.name || 'Guru Pembimbing'}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 block whitespace-nowrap">
                    Koordinator Kurikulum
                  </span>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <div className="text-xs font-extrabold text-slate-900">{currentUser?.name || 'Guru Pembimbing'}</div>
                    <div className="text-[10px] text-slate-500">{currentUser?.email || 'admin@smktelkom-sda.sch.id'}</div>
                    <span className="inline-block mt-1 text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Sesi Kurikulum Aktif
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <Home className="w-3.5 h-3.5 text-slate-400" />
                    <span>Lihat Landing Page</span>
                  </button>
                  <button
                    onClick={async () => {
                      setIsProfileDropdownOpen(false);
                      await logoutAdmin();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Keluar Sesi Admin</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ─── MAIN BENTO CONTENT CONTAINER ─── */}
        <main className="w-full space-y-6">
        {/* ────────────────────────────────────────────────────────────────────
            SCREEN 1: BERANDA (ADMIN HOME)
        ──────────────────────────────────────────────────────────────────── */}
        {activeScreen === 'beranda' && (
          <div className="space-y-8">
            {/* Persiapan Panel: While Persiapan is unfinished, sits above everything */}
            {isPersiapanUnfinished && (
              <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">
                      Tahap Persiapan Belum Selesai
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    {/* Item 1: Impor data (done) */}
                    <div className="flex items-center gap-2 text-slate-800 font-medium">
                      <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <span>1. Impor data kelompok (Selesai)</span>
                    </div>

                    <span className="text-amber-300">•</span>

                    {/* Item 2: Tandai ketua (current count) */}
                    <div className="flex items-center gap-2 text-slate-900 font-semibold">
                      <span className="w-5 h-5 rounded-md bg-amber-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                        2
                      </span>
                      <span>
                        Tentukan Ketua Kelompok ({groupsWithLeaderCount} dari {groupsList.length} kelompok sudah memiliki ketua)
                      </span>
                    </div>
                  </div>
                </div>

                {/* The single primary button on Screen 1 while Persiapan is unfinished */}
                <button
                  onClick={() => setActiveScreen('kelompok')}
                  className="px-4 py-2.5 bg-[#E20113] hover:bg-[#b4000c] text-white text-sm font-bold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  Tentukan Ketua ({noLeaderCount} Belum)
                </button>
              </div>
            )}

            {/* Header: Title with mandatory one sentence opening */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-slate-200">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Dashboard Pemantauan Kelompok
                </h1>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Pantau antrean berkas yang perlu direview hari ini serta kelompok yang terlambat mengumpulkan tugas.
                </p>
              </div>

              {/* One line stage info & Clear 6-Part Progress Line */}
              <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex flex-col gap-2 shrink-0 shadow-2xs">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Tahap Aktif: 3 dari 6 (Buat Desain)
                  </span>
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                    Tenggat: 15 Feb (4 hari lagi)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 w-72 h-2.5">
                  <span className="h-full flex-1 bg-emerald-500 rounded-sm" title="Tahap 1: Atur peran (Selesai)" />
                  <span className="h-full flex-1 bg-emerald-500 rounded-sm" title="Tahap 2: Rancang materi (Selesai)" />
                  <span className="h-full flex-1 bg-blue-600 rounded-sm ring-2 ring-blue-200" title="Tahap 3: Buat desain (Sedang berjalan)" />
                  <span className="h-full flex-1 bg-slate-200 rounded-sm" title="Tahap 4: Pelaksanaan di SMP" />
                  <span className="h-full flex-1 bg-slate-200 rounded-sm" title="Tahap 5: Kumpulkan laporan" />
                  <span className="h-full flex-1 bg-slate-200 rounded-sm" title="Tahap 6: Terima feedback" />
                </div>
              </div>
            </div>

            {/* Summary KPI Cards for Fast Scanning */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => {
                  setTurnTab('admin');
                  setProgressChip('attention');
                }}
                className="bg-white border border-amber-200 rounded-xl p-4 shadow-2xs hover:border-amber-400 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    Perlu Review Anda
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">{waitingAdminItems.length}</span>
                  <span className="text-xs font-semibold text-amber-700">berkas menunggu</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Klik untuk memeriksa berkas yang diajukan ketua</p>
              </div>

              <div
                onClick={() => {
                  setTurnTab('kelompok');
                  setProgressChip('attention');
                }}
                className="bg-white border border-rose-200 rounded-xl p-4 shadow-2xs hover:border-rose-400 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                    Terlambat & Revisi
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">{lateOrRevisionCount}</span>
                  <span className="text-xs font-semibold text-rose-700">kelompok tertahan</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Perlu dikirim pengingat WhatsApp ke ketua</p>
              </div>

              <div
                onClick={() => setProgressChip('done')}
                className="bg-white border border-emerald-200 rounded-xl p-4 shadow-2xs hover:border-emerald-400 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Disetujui & Lancar
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">{approvedCount}</span>
                  <span className="text-xs font-semibold text-emerald-700">kelompok aman</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Sudah menyelesaikan berkas Tahap 3</p>
              </div>

              <div
                onClick={() => setProgressChip('all')}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-slate-400 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Total Kelompok
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">{groupsList.length}</span>
                  <span className="text-xs font-semibold text-slate-600">
                    ({groupsWithLeaderCount} sudah ada ketua)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Tersebar di SMP wilayah Sidoarjo</p>
              </div>
            </div>

            {/* Block 1: Perlu Tindakan */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Antrean Perlu Tindakan Segera</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pilih tab di kanan untuk melihat berkas yang menunggu review Anda atau kelompok yang belum mengumpulkan.
                  </p>
                </div>

                {/* Two tabs that say whose turn it is */}
                <div className="flex items-center gap-2 text-sm bg-slate-200/70 p-1 rounded-xl">
                  <button
                    onClick={() => setTurnTab('admin')}
                    className={`px-4 py-2 rounded-lg transition-all cursor-pointer font-semibold flex items-center gap-2 ${
                      turnTab === 'admin'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Menunggu Review Anda</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        turnTab === 'admin'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-300/70 text-slate-700'
                      }`}
                    >
                      {waitingAdminItems.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setTurnTab('kelompok')}
                    className={`px-4 py-2 rounded-lg transition-all cursor-pointer font-semibold flex items-center gap-2 ${
                      turnTab === 'kelompok'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Menunggu Kelompok</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        turnTab === 'kelompok'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-slate-300/70 text-slate-700'
                      }`}
                    >
                      {waitingGroupItems.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Rows List */}
              <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200 shadow-2xs overflow-hidden">
                {turnTab === 'admin' ? (
                  /* ─── TAB: Menunggu Anda ─── */
                  waitingAdminItems.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-600 space-y-1">
                      <p className="font-bold text-slate-900 text-base">Semua berkas sudah direview!</p>
                      <p>Tidak ada pengajuan yang tertunda. Anda bisa memeriksa tabel seluruh kelompok di bawah.</p>
                    </div>
                  ) : (
                    (showAllActions ? waitingAdminItems : waitingAdminItems.slice(0, 5)).map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 sm:px-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                      >
                        {renderActionItemGrid(item)}

                        {/* Status chip, Age, and Review Button */}
                        <div className="flex flex-wrap items-center gap-2.5 text-xs shrink-0 self-end lg:self-center">
                          <span
                            className="px-2.5 py-1 rounded-md bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold cursor-help whitespace-nowrap"
                            title={item.statusHint}
                          >
                            {item.statusLabel}
                          </span>

                          <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                            {item.ageText}
                          </span>

                          <button
                            onClick={() => handleOpenReview(item.groupId)}
                            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-[#E20113] text-white font-semibold text-xs transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                          >
                            Periksa & Review
                          </button>
                        </div>
                      </div>
                    ))
                  )
                ) : (
                  /* ─── TAB: Menunggu kelompok ─── */
                  waitingGroupItems.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-600 space-y-1">
                      <p className="font-bold text-slate-900 text-base">Semua kelompok sesuai jadwal.</p>
                      <p>Tidak ada keterlambatan pengumpulan atau revisi yang tertunda.</p>
                    </div>
                  ) : (
                    (showAllActions ? waitingGroupItems : waitingGroupItems.slice(0, 5)).map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 sm:px-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                      >
                        {renderActionItemGrid(item)}

                        {/* Status chip, Lateness / Revision state, and Button: Salin pengingat */}
                        <div className="flex flex-wrap items-center gap-2.5 text-xs shrink-0 self-end lg:self-center">
                          {item.status === 'revisi' ? (
                            <span
                              className="px-2.5 py-1 rounded-md bg-orange-100 border border-orange-300 text-orange-900 text-xs font-bold cursor-help whitespace-nowrap"
                              title={item.statusHint}
                            >
                              Perlu Revisi
                            </span>
                          ) : (
                            <span
                              className="px-2.5 py-1 rounded-md bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold cursor-help whitespace-nowrap"
                              title={item.statusHint}
                            >
                              Belum Dikumpulkan
                            </span>
                          )}

                          {/* Lateness text with clock */}
                          <div className="text-xs text-slate-600 whitespace-nowrap">
                            {item.isLate ? (
                              <span className="inline-flex items-center justify-end gap-1 text-rose-700 font-bold">
                                <Clock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                <span>{item.ageText}</span>
                              </span>
                            ) : (
                              <span className="font-medium text-orange-800">{item.ageText}</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyReminder(item)}
                              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap"
                            >
                              {copiedReminderId === item.id ? 'Teks Disalin ✓' : 'Salin Pengingat WA'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )
                )}
              </div>

              {/* Five rows initial and "Lihat semua" link */}
              {((turnTab === 'admin' && waitingAdminItems.length > 5) ||
                (turnTab === 'kelompok' && waitingGroupItems.length > 5)) && (
                <div className="pt-1">
                  <button
                    onClick={() => setShowAllActions(!showAllActions)}
                    className="text-sm font-semibold text-slate-700 hover:text-slate-900 underline cursor-pointer"
                  >
                    {showAllActions ? 'Tampilkan 5 baris saja' : 'Lihat semua antrean'}
                  </button>
                </div>
              )}
            </section>

            {/* Block 2: Progres Kelompok */}
            <section className="space-y-4 pt-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Tabel Progres Seluruh Kelompok ({filteredProgressRows.length})
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-1.5">
                    <span className="font-semibold text-slate-700">Keterangan Warna Tahap:</span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-xs bg-emerald-500 inline-block" />
                      <span>Selesai</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-xs bg-amber-400 inline-block" />
                      <span>Menunggu Review</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-xs bg-rose-500 inline-block" />
                      <span>Terlambat / Revisi</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-xs bg-blue-500 inline-block" />
                      <span>Sedang Berjalan</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-xs bg-slate-200 inline-block" />
                      <span>Belum Mulai</span>
                    </span>
                  </div>
                </div>

                {/* Search field and Filter Chips */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={progressSearch}
                      onChange={(e) => {
                        setProgressSearch(e.target.value);
                        setProgressPage(1);
                      }}
                      placeholder="Cari kelompok, ketua, atau SMP..."
                      className="pl-9 pr-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 w-64 shadow-2xs"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 text-xs">
                    {(['all', 'attention', 'done'] as const).map((key) => {
                      const labels = {
                        all: `Semua (${groupsList.length})`,
                        attention: `Perlu Perhatian (${reviewPendingCount + lateOrRevisionCount})`,
                        done: `Disetujui (${approvedCount})`,
                      };
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            setProgressChip(key);
                            setProgressPage(1);
                          }}
                          className={`px-3.5 py-2 rounded-lg border transition-colors cursor-pointer font-semibold ${
                            progressChip === key
                              ? 'bg-slate-900 border-slate-900 text-white shadow-2xs'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {labels[key]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Progress Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 text-xs uppercase tracking-wider font-bold">
                      <th className="py-3.5 px-5">Kelompok & SMP Tujuan</th>
                      <th className="py-3.5 px-4">Ketua Kelompok</th>
                      <th className="py-3.5 px-4">Tahap Sekarang</th>
                      <th className="py-3.5 px-4">Progres 6 Tahap</th>
                      <th className="py-3.5 px-4">Kelengkapan Berkas</th>
                      <th className="py-3.5 px-5 text-right">Status & Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredProgressRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-slate-500">
                          <p className="font-bold text-slate-900 text-base">Tidak ada kelompok pada filter ini.</p>
                          <p className="mt-1 text-xs">Ubah kata kunci pencarian atau pilih filter "Semua".</p>
                        </td>
                      </tr>
                    ) : (
                      paginatedProgressRows.map((row) => (
                        <tr
                          key={row.id}
                          onClick={() => handleOpenReview(row.id)}
                          className="hover:bg-slate-50/90 transition-colors cursor-pointer"
                        >
                          {/* Kelompok (name and SMP asal) */}
                          <td className="py-4 px-5">
                            <div>
                              <span className="font-extrabold text-slate-900 text-sm block">
                                KEL-{row.number}
                              </span>
                              <span className="text-xs font-medium text-slate-600 mt-0.5 block">
                                {row.schoolName}
                              </span>
                            </div>
                          </td>

                          {/* Ketua */}
                          <td className="py-4 px-4 text-slate-800 font-medium">
                            {row.hasLeader ? (
                              <div>
                                <span className="block font-semibold text-slate-900">{row.leaderName}</span>
                                <span className="text-xs text-slate-500">{row.members.length} anggota</span>
                              </div>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                                Belum ditentukan
                              </span>
                            )}
                          </td>

                          {/* Tahap sekarang */}
                          <td className="py-4 px-4 text-slate-900 font-semibold">
                            {row.currentStage}
                          </td>

                          {/* Progres: Six clear solid blocks with numbers 1..6 */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5">
                              {[1, 2, 3, 4, 5, 6].map((stg) => {
                                const isCompleted = stg <= row.completedStages;
                                const isCurrent = stg === row.currentStageIndex && !isCompleted;

                                let boxStyle = 'bg-slate-100 text-slate-400 border border-slate-200';
                                if (isCompleted) {
                                  boxStyle = 'bg-emerald-500 text-white font-bold shadow-2xs';
                                } else if (isCurrent) {
                                  if (row.urgentStatus === 'review') {
                                    boxStyle = 'bg-amber-400 text-slate-950 font-extrabold ring-2 ring-amber-200';
                                  } else if (row.urgentStatus === 'overdue' || row.urgentStatus === 'revisi') {
                                    boxStyle = 'bg-rose-500 text-white font-extrabold ring-2 ring-rose-200';
                                  } else {
                                    boxStyle = 'bg-blue-600 text-white font-bold ring-2 ring-blue-200';
                                  }
                                }

                                return (
                                  <span
                                    key={stg}
                                    className={`w-7 h-7 rounded-md flex items-center justify-center text-xs transition-transform ${boxStyle}`}
                                    title={`Tahap ${stg}: ${SIX_STAGES[stg - 1]}`}
                                  >
                                    {isCompleted ? '✓' : stg}
                                  </span>
                                );
                              })}
                            </div>
                          </td>

                          {/* Item */}
                          <td className="py-4 px-4 text-slate-700 font-medium text-xs">
                            {row.approvedItemsText}
                          </td>

                          {/* Status Chip (Most urgent state first) */}
                          <td className="py-4 px-5 text-right">
                            {row.urgentStatus === 'review' && (
                              <span
                                className="px-3 py-1 rounded-md bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold cursor-help inline-block"
                                title={row.urgentStatusHint}
                              >
                                Menunggu Review
                              </span>
                            )}
                            {row.urgentStatus === 'overdue' && (
                              <span
                                className="px-3 py-1 rounded-md bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold cursor-help inline-flex items-center gap-1.5"
                                title={row.urgentStatusHint}
                              >
                                <Clock className="w-3.5 h-3.5 text-rose-700" />
                                <span>{row.urgentStatusLabel}</span>
                              </span>
                            )}
                            {row.urgentStatus === 'revisi' && (
                              <span
                                className="px-3 py-1 rounded-md bg-orange-100 border border-orange-300 text-orange-900 text-xs font-bold cursor-help inline-block"
                                title={row.urgentStatusHint}
                              >
                                Perlu Revisi
                              </span>
                            )}
                            {row.urgentStatus === 'approved' && (
                              <span
                                className="px-3 py-1 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold cursor-help inline-block"
                                title={row.urgentStatusHint}
                              >
                                Disetujui ✓
                              </span>
                            )}
                            {row.urgentStatus === 'waiting' && (
                              <span
                                className="px-3 py-1 rounded-md bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold cursor-help inline-block"
                                title={row.urgentStatusHint}
                              >
                                Belum Dikumpulkan
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {renderPaginationBar(
                  safeProgressPage,
                  totalProgressPages,
                  filteredProgressRows.length,
                  setProgressPage
                )}
              </div>
            </section>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────────
            SCREEN 3: KELOMPOK (SETUP DATA & KETUA)
        ──────────────────────────────────────────────────────────────────── */}
        {activeScreen === 'kelompok' && (
          <div className="space-y-6">
            {/* Header: Opens with required sentence */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-slate-200">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Data Kelompok & Penentuan Ketua
                </h1>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Siapkan data kelompok dan tentukan ketua. Hanya ketua kelompok yang memiliki akun login.
                </p>
              </div>

              {/* Indicator & The Single Red Primary Button on Screen 3: "Impor CSV" */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Two-item Persiapan indicator */}
                <div className="flex items-center gap-2.5 text-sm">
                  <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>1. Impor data</span>
                  </span>
                  <span className="text-slate-300">/</span>
                  <span className="font-bold text-slate-900 bg-white border border-slate-300 px-3 py-1 rounded-lg shadow-2xs">
                    2. Ketua terpilih ({groupsWithLeaderCount} dari {groupsList.length})
                  </span>
                </div>

                {/* Primary button on Screen 3: Signal Red */}
                <button
                  onClick={() => {
                    setIsImportCsvOpen(true);
                    setImportCsvStep(1);
                  }}
                  className="px-4 py-2.5 bg-[#E20113] hover:bg-[#b4000c] text-white text-sm font-bold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  Impor Data CSV
                </button>
              </div>
            </div>

            {/* Table: Kelompok, SMP asal, Anggota, Ketua */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 text-xs uppercase tracking-wider font-bold">
                    <th className="py-3.5 px-5">Kelompok</th>
                    <th className="py-3.5 px-4">SMP Tujuan</th>
                    <th className="py-3.5 px-4">Jumlah Anggota</th>
                    <th className="py-3.5 px-5 text-right">Ketua Kelompok & Akun</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {paginatedKelompokRows.map((grp) => (
                    <tr key={grp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-5 font-extrabold text-slate-900">
                        KEL-{grp.number}
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800">
                        {grp.schoolName}
                      </td>
                      <td className="py-4 px-4 text-slate-600 font-medium">
                        {grp.members.length} siswa
                      </td>
                      <td className="py-4 px-5 text-right">
                        {grp.hasLeader ? (
                          <div className="flex items-center justify-end gap-4">
                            <span className="font-bold text-slate-900">{grp.leaderName}</span>
                            <button
                              onClick={() => {
                                const nis = grp.members[0]?.nis || `2024.11.${grp.number}01`;
                                const newPass = `skm-${Math.floor(1000 + Math.random() * 9000)}`;
                                setCreatedCredentials({
                                  name: grp.leaderName,
                                  groupNum: grp.number,
                                  username: nis,
                                  pass: newPass,
                                });
                              }}
                              className="px-2.5 py-1 rounded-md border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                            >
                              Reset Kata Sandi
                            </button>
                            <button
                              onClick={() => {
                                resetGroupLeader(grp.number);
                                setGroupsList((prev) =>
                                  prev.map((g) =>
                                    g.id === grp.id
                                      ? {
                                          ...g,
                                          hasLeader: false,
                                          leaderName: 'Belum ditentukan',
                                        }
                                      : g
                                  )
                                );
                              }}
                              className="text-xs text-red-600 hover:text-red-700 hover:underline cursor-pointer font-medium"
                              title="Buka kunci agar kelompok dapat diklaim kembali"
                            >
                              Reset Akses Ketua
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-3">
                            <span className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                              Belum ada ketua
                            </span>
                            <button
                              onClick={() => {
                                setAssignLeaderGroup(grp);
                                setSelectedLeaderMember(grp.members[0]?.name || '');
                              }}
                              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-[#E20113] text-white text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Pilih Ketua
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {renderPaginationBar(
                safeKelompokPage,
                totalKelompokPages,
                groupsList.length,
                setKelompokPage
              )}
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────────
            FEEDBACK TAB
        ──────────────────────────────────────────────────────────────────── */}
        {activeScreen === 'feedback' && (
          <div className="space-y-6">
            <div className="pb-5 border-b border-slate-200">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Evaluasi & Feedback SMP
              </h1>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                Evaluasi dan masukan langsung dari guru pamong serta siswa SMP setelah sesi mengajar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Kepuasan Guru Pamong
                </span>
                <span className="text-3xl font-extrabold text-slate-900 mt-2 block">4.8 / 5.0</span>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  "Siswa SMK sangat siap dengan modul Canva dan tata krama mengajar yang baik."
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Respons Siswa SMP
                </span>
                <span className="text-3xl font-extrabold text-slate-900 mt-2 block">4.5 / 5.0</span>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  "Penyampaian materi ramah dan mudah dipahami adik kelas."
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Relevansi Kurikulum
                </span>
                <span className="text-3xl font-extrabold text-slate-900 mt-2 block">4.7 / 5.0</span>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  "Sangat sesuai dengan capaian Fase D mata pelajaran Informatika."
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────────
            PENGATURAN TAB
        ──────────────────────────────────────────────────────────────────── */}
        {activeScreen === 'pengaturan' && (
          <div className="space-y-6">
            <div className="pb-5 border-b border-slate-200">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Jadwal & Tahapan Program
              </h1>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                Jadwal resmi enam tahap program Skomda Mengajar untuk panduan semua kelompok.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200 text-sm shadow-2xs overflow-hidden">
              {[
                { stage: 'Tahap 1: Atur peran', date: '12 Jan 2026', status: 'Selesai', tone: 'emerald' },
                { stage: 'Tahap 2: Rancang materi', date: '28 Jan 2026', status: 'Selesai', tone: 'emerald' },
                { stage: 'Tahap 3: Buat desain', date: '15 Feb 2026', status: 'Aktif berjalan', tone: 'blue' },
                { stage: 'Tahap 4: Pelaksanaan di SMP', date: '18–25 Feb 2026', status: 'Mendatang', tone: 'slate' },
                { stage: 'Tahap 5: Kumpulkan laporan', date: '28 Feb 2026', status: 'Mendatang', tone: 'slate' },
                { stage: 'Tahap 6: Terima feedback', date: '05 Mar 2026', status: 'Mendatang', tone: 'slate' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 sm:px-5 flex items-center justify-between hover:bg-slate-50">
                  <span className="font-bold text-slate-900">{item.stage}</span>
                  <div className="flex items-center gap-4 text-slate-600">
                    <span className="font-medium">Tenggat: {item.date}</span>
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-bold border ${
                        item.tone === 'emerald'
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                          : item.tone === 'blue'
                            ? 'bg-blue-100 border-blue-300 text-blue-900'
                            : 'bg-slate-100 border-slate-300 text-slate-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </main>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          SCREEN 2: REVIEW PANEL (RIGHT-SIDE SLIDE-OVER OVER SCREEN 1)
      ══════════════════════════════════════════════════════════════════════════ */}
      {isReviewPanelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white h-full border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-200 shadow-2xl">
            {/* Top Line: "Review 1 dari 4" and "Tutup" button */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="text-sm font-extrabold text-slate-900">
                {!isAllReviewsFinished
                  ? `Panel Review Berkas (${currentReviewIdx + 1} dari ${reviewQueue.length})`
                  : 'Review Selesai'}
              </span>
              <button
                onClick={() => setIsReviewPanelOpen(false)}
                className="px-3 py-1 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Tutup ✕
              </button>
            </div>

            {/* When all reviews are done */}
            {isAllReviewsFinished ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Semua Berkas Telah Direview
                  </h3>
                  <p className="text-sm text-slate-600 mt-1 max-w-xs leading-relaxed">
                    Semua berkas kelompok dalam antrean review telah selesai Anda periksa.
                  </p>
                </div>
                <button
                  onClick={() => setIsReviewPanelOpen(false)}
                  className="px-5 py-2.5 bg-[#E20113] hover:bg-[#b4000c] text-white text-sm font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Kembali ke Beranda
                </button>
              </div>
            ) : currentReviewGroup ? (
              <>
                {/* Panel Header Info: Group, SMP asal, Ketua */}
                <div className="px-6 py-4 border-b border-slate-200 bg-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-extrabold text-slate-900">
                      Kelompok {currentReviewGroup.number}
                    </h2>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                      {currentReviewGroup.schoolName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm font-medium text-slate-600">
                      Ketua Kelompok: <strong className="text-slate-900">{currentReviewGroup.leaderName || 'Belum ditentukan'}</strong>
                    </p>
                    {currentReviewGroup.leaderName && !currentReviewGroup.leaderName.includes('Belum') && (
                      <button
                        onClick={() => {
                          resetGroupLeader(currentReviewGroup.number);
                          currentReviewGroup.leaderName = 'Belum ditentukan';
                          setGroupsList((prev) =>
                            prev.map((g) =>
                              g.number === currentReviewGroup.number
                                ? { ...g, hasLeader: false, leaderName: 'Belum ditentukan' }
                                : g
                            )
                          );
                        }}
                        className="text-xs text-red-600 hover:text-red-700 hover:underline cursor-pointer font-medium"
                      >
                        Reset Akses Ketua
                      </button>
                    )}
                  </div>
                </div>

                {/* Panel Body: Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
                  {/* Six-Stage Timeline with Waiting Item Open */}
                  <div>
                    <h3 className="font-extrabold text-slate-900 mb-3">Progres Tahapan Kelompok</h3>
                    <div className="space-y-2.5 border border-slate-200 rounded-xl p-4 bg-slate-50">
                      {SIX_STAGES.map((stgName, idx) => {
                        const stgNum = idx + 1;
                        const isOpen = stgNum === 3;
                        return (
                          <div key={stgNum} className="space-y-2">
                            <div className="flex items-center justify-between py-1">
                              <span
                                className={`text-sm ${
                                  isOpen ? 'font-extrabold text-slate-900' : 'font-medium text-slate-600'
                                }`}
                              >
                                Tahap {stgNum}: {stgName}
                              </span>
                              {stgNum < 3 && (
                                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold">
                                  Disetujui ✓
                                </span>
                              )}
                              {stgNum === 3 && (
                                <span className="px-2.5 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
                                  Menunggu Review
                                </span>
                              )}
                              {stgNum > 3 && (
                                <span className="px-2.5 py-0.5 rounded-md bg-slate-200/70 text-slate-700 text-xs font-semibold">
                                  Belum Dikumpulkan
                                </span>
                              )}
                            </div>

                            {/* Open Stage 3 Details */}
                            {isOpen && (
                              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-4 my-2 shadow-2xs">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="font-extrabold text-slate-900 text-sm block">
                                      X-Banner Publikasi v2 (60 × 160 cm)
                                    </span>
                                    <span className="text-xs text-slate-500">
                                      Versi 2 • Diunggah 45 menit lalu
                                    </span>
                                  </div>
                                  <button
                                    onClick={() =>
                                      showToast('Membuka file X-Banner v2 di tab baru...', 'info')
                                    }
                                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                                  >
                                    <span>Buka File</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Ticked Checklist */}
                                <div className="space-y-2 pt-1">
                                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                                    Daftar Periksa Desain:
                                  </span>
                                  {[
                                    'Ukuran cetak sesuai standar 60 × 160 cm',
                                    'Resolusi berkas tajam dan siap cetak (CMYK 300 DPI)',
                                    'Memuat logo SMK Telkom Sidoarjo dan SMP tujuan',
                                    'Mencantumkan nama guru pembimbing',
                                  ].map((chk, cIdx) => (
                                    <div
                                      key={cIdx}
                                      className="flex items-center gap-2.5 text-slate-800 text-xs font-medium"
                                    >
                                      <span className="w-4 h-4 rounded-sm bg-emerald-600 text-white flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3" />
                                      </span>
                                      <span>{chk}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* Earlier Comments */}
                                <div className="pt-3 border-t border-slate-200">
                                  <span className="text-xs font-bold text-slate-900 block">
                                    Catatan Review Sebelumnya:
                                  </span>
                                  <p className="text-xs text-slate-700 mt-1.5 leading-relaxed bg-slate-50 border border-slate-200 p-3 rounded-lg">
                                    "Perbaiki kontras teks judul agar terbaca dari jarak 2 meter, dan pastikan logo sekolah tidak terpotong margin atas."
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Anggota List with Roles */}
                  <div>
                    <h3 className="font-extrabold text-slate-900 mb-2.5">
                      Daftar Anggota ({currentReviewGroup.members.length} Siswa)
                    </h3>
                    <div className="border border-slate-200 rounded-xl divide-y divide-slate-200 overflow-hidden">
                      {currentReviewGroup.members.map((m, mIdx) => (
                        <div
                          key={mIdx}
                          className="p-3 flex items-center justify-between text-xs bg-white"
                        >
                          <span className="font-bold text-slate-900">{m.name}</span>
                          <span className="text-slate-600 font-medium bg-slate-100 px-2.5 py-0.5 rounded-md">
                            {m.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sticky Bottom Bar */}
                <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
                  {isRevisionBoxOpen && (
                    <div className="space-y-2.5 animate-in fade-in duration-150">
                      <label className="text-xs font-bold text-slate-900 block">
                        Tulis Catatan Revisi untuk Ketua Kelompok
                      </label>
                      <textarea
                        rows={3}
                        value={revisionComment}
                        onChange={(e) => setRevisionComment(e.target.value)}
                        placeholder="Tulis bagian yang perlu diperbaiki kelompok..."
                        className="w-full p-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
                      />
                      <p className="text-xs text-slate-500">
                        Kelompok akan melihat catatan ini dan diminta mengunggah ulang.
                      </p>
                      <div className="flex justify-end gap-2.5 pt-1">
                        <button
                          onClick={() => setIsRevisionBoxOpen(false)}
                          className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          onClick={handleSubmitRevision}
                          className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold cursor-pointer"
                        >
                          Kirim Catatan Revisi
                        </button>
                      </div>
                    </div>
                  )}

                  {!isRevisionBoxOpen && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleApproveAndNext}
                          className="px-5 py-2.5 rounded-lg bg-[#E20113] hover:bg-[#b4000c] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                        >
                          Setujui & Lanjut
                        </button>

                        <button
                          onClick={() => setIsRevisionBoxOpen(true)}
                          className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Minta Revisi
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-slate-500">
                        Sisa {reviewQueue.length - currentReviewIdx} antrean
                      </span>
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          SCREEN 3: 3-STEP DIALOG "IMPOR CSV"
      ══════════════════════════════════════════════════════════════════════════ */}
      {isImportCsvOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25">
          <div className="bg-white border border-[#E6E2DE] rounded-[4px] max-w-md w-full p-5 space-y-4">
            {/* Dialog Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#E6E2DE]">
              <div>
                <h3 className="text-sm font-extrabold text-[#21201E]">
                  Impor data kelompok dari CSV
                </h3>
                <p className="text-xs text-[#6B6560] mt-0.5">
                  Langkah {importCsvStep} dari 3
                </p>
              </div>
              <button
                onClick={() => setIsImportCsvOpen(false)}
                className="text-[#6B6560] hover:text-[#21201E] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step 1: Pilih file */}
            {importCsvStep === 1 && (
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-[#21201E] mb-1">Pilih file</h4>
                  <p className="text-[#6B6560]">
                    Unggah berkas spreadsheet CSV berisi daftar siswa dan pembagian kelompok.
                  </p>
                </div>

                <div className="border border-dashed border-[#21201E]/40 p-6 rounded-[4px] text-center bg-[#F7F5F2]/40 space-y-2">
                  <FileText className="w-8 h-8 text-[#6B6560] mx-auto" />
                  <div>
                    <span className="font-medium text-[#21201E] block">
                      daftar_kelompok_skomda_2026.csv
                    </span>
                    <span className="text-[11px] text-[#6B6560]">Ukuran: 42 KB • 180 baris siswa</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() =>
                      showToast('Mengunduh berkas template_data_kelompok.csv...', 'info')
                    }
                    className="text-xs text-[#6B6560] hover:text-[#21201E] underline cursor-pointer"
                  >
                    Unduh contoh CSV
                  </button>
                  <button
                    onClick={() => setImportCsvStep(2)}
                    className="px-4 py-1.5 bg-[#E20113] hover:bg-[#b4000c] text-white text-xs font-semibold rounded-[4px] cursor-pointer"
                  >
                    Lanjut: Cek hasil
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Cek hasil */}
            {importCsvStep === 2 && (
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-[#21201E] mb-1">Cek hasil</h4>
                  <p className="text-[#6B6560]">
                    Pemeriksaan format baris dan validasi data sebelum disimpan ke sistem.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 p-3 bg-[#F7F5F2] border border-[#E6E2DE] rounded-[4px] text-center">
                  <div>
                    <span className="text-lg font-extrabold text-[#21201E] block">180</span>
                    <span className="text-[11px] text-[#6B6560]">Siswa</span>
                  </div>
                  <div>
                    <span className="text-lg font-extrabold text-[#21201E] block">24</span>
                    <span className="text-[11px] text-[#6B6560]">Kelompok</span>
                  </div>
                  <div>
                    <span className="text-lg font-extrabold text-[#3DBE7A] block">0</span>
                    <span className="text-[11px] text-[#6B6560]">Baris bermasalah</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-[#3DBE7A]/10 border border-[#3DBE7A]/30 rounded-[4px] text-[#21201E]">
                  <Check className="w-4 h-4 text-[#3DBE7A] shrink-0" />
                  <span className="text-[11px]">
                    Semua kolom (NIS, Nama, Kelompok, SMP) terdeteksi lengkap dan siap diterapkan.
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => setImportCsvStep(1)}
                    className="text-xs text-[#6B6560] hover:text-[#21201E] underline cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={() => setImportCsvStep(3)}
                    className="px-4 py-1.5 bg-[#E20113] hover:bg-[#b4000c] text-white text-xs font-semibold rounded-[4px] cursor-pointer"
                  >
                    Lanjut: Konfirmasi
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Konfirmasi */}
            {importCsvStep === 3 && (
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-[#21201E] mb-1">Konfirmasi</h4>
                  <p className="text-[#6B6560]">
                    Simpan dan terapkan data 180 siswa ke 24 kelompok Skomda Mengajar.
                  </p>
                </div>

                <p className="text-[#6B6560] bg-[#F7F5F2] p-3 rounded-[4px] leading-relaxed">
                  Setelah konfirmasi, Anda dapat melanjutkan langkah kedua yaitu menentukan ketua untuk masing-masing kelompok agar akun login dapat segera dibagikan.
                </p>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => setImportCsvStep(2)}
                    className="text-xs text-[#6B6560] hover:text-[#21201E] underline cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={() => {
                      setIsImportCsvOpen(false);
                      showToast('Data CSV berhasil diimpor ke sistem kelompok.', 'success');
                    }}
                    className="px-4 py-1.5 bg-[#E20113] hover:bg-[#b4000c] text-white text-xs font-semibold rounded-[4px] cursor-pointer"
                  >
                    Konfirmasi dan simpan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          SCREEN 3: DIALOG "PILIH KETUA UNTUK KELOMPOK XX"
      ══════════════════════════════════════════════════════════════════════════ */}
      {assignLeaderGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25">
          <div className="bg-white border border-[#E6E2DE] rounded-[4px] max-w-sm w-full p-5 space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-[#21201E]">
                Pilih ketua untuk Kelompok {assignLeaderGroup.number}
              </h3>
              <p className="text-xs text-[#6B6560] mt-0.5">
                {assignLeaderGroup.schoolName}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-[#21201E] block mb-1.5">
                Daftar anggota kelompok:
              </label>
              <select
                value={selectedLeaderMember}
                onChange={(e) => setSelectedLeaderMember(e.target.value)}
                className="w-full p-2 text-xs border border-[#E6E2DE] rounded-[4px] bg-white text-[#21201E] focus:outline-none focus:border-[#21201E]"
              >
                {assignLeaderGroup.members.map((m, idx) => (
                  <option key={idx} value={m.name}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#6B6560] mt-1.5">
                Akun login dibuat untuk siswa ini.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E6E2DE]">
              <button
                onClick={() => setAssignLeaderGroup(null)}
                className="px-3 py-1.5 rounded-[4px] border border-[#E6E2DE] text-[#6B6560] text-xs font-medium cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmLeaderAssignment}
                className="px-4 py-1.5 rounded-[4px] bg-[#E20113] hover:bg-[#b4000c] text-white text-xs font-semibold cursor-pointer"
              >
                Tetapkan ketua
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          SCREEN 3: DIALOG KREDENSIAL KETUA (ONE-TIME DIALOG WITH "SALIN")
      ══════════════════════════════════════════════════════════════════════════ */}
      {createdCredentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25">
          <div className="bg-white border border-[#E6E2DE] rounded-[4px] max-w-sm w-full p-5 space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-[#21201E]">
                Akun ketua Kelompok {createdCredentials.groupNum}
              </h3>
              <p className="text-xs text-[#6B6560] mt-0.5">
                Ketua terpilih: {createdCredentials.name}
              </p>
            </div>

            <div className="p-3 bg-[#F7F5F2] border border-[#E6E2DE] rounded-[4px] space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#6B6560]">Username (NIS):</span>
                <span className="font-bold text-[#21201E]">{createdCredentials.username}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6B6560]">Kata sandi awal:</span>
                <span className="font-bold text-[#21201E]">{createdCredentials.pass}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#6B6560]">
              Berikan ke ketua. Kata sandi hanya tampil sekali.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E6E2DE]">
              <button
                onClick={() => {
                  const text = `Akun Ketua Kelompok ${createdCredentials.groupNum} Skomda Mengajar\nNama: ${createdCredentials.name}\nUsername (NIS): ${createdCredentials.username}\nKata sandi: ${createdCredentials.pass}`;
                  navigator.clipboard?.writeText(text);
                  showToast('Akun berhasil disalin ke clipboard!', 'success');
                  setCreatedCredentials(null);
                }}
                className="px-4 py-1.5 rounded-[4px] bg-[#E20113] hover:bg-[#b4000c] text-white text-xs font-semibold cursor-pointer"
              >
                Salin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
