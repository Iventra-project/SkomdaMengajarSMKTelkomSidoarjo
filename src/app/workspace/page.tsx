"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';

interface ChecklistTask {
  id: number;
  title: string;
  status: 'selesai' | 'sekarang' | 'berikutnya';
}

const STAGES = [
  { id: 1, no: '01', name: 'Bentuk Kelompok' },
  { id: 2, no: '02', name: 'Pilih Ketua' },
  { id: 3, no: '03', name: 'Susun Materi' },
  { id: 4, no: '04', name: 'Siapkan Desain' },
  { id: 5, no: '05', name: 'Mengajar di SMP' },
  { id: 6, no: '06', name: 'Evaluasi & LPJ' },
];

export const WorkspacePage: React.FC = () => {
  const {
    navigate,
    currentUser,
    activeGroup,
    logout,
    members,
    toggleMemberStatus,
    supervisorMemo,
    setIsBannerModalOpen,
  } = useApp();

  const userDisplayName = currentUser?.name || activeGroup.leaderName;
  const userInitials = userDisplayName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] || '')
    .join('')
    .toUpperCase();

  const mentorInitials = activeGroup.mentorName
    .replace(/^(Pak|Bu|Dra\.|Drs\.|Ir\.)\s+/i, '')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] || '')
    .join('')
    .toUpperCase();

  const schoolSlug = activeGroup.schoolName.replace(/\s+/g, '');

  // Sidebar & navigation state
  const [isRail, setIsRail] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<'pipeline' | 'workspace' | 'members'>('pipeline');
  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4 | 5 | 6>(4);

  // Per-stage interactive state (Stages 1, 2, 3, 5, 6)
  const [leaderPhone, setLeaderPhone] = useState('0812-3456-7890');
  const [leaderClass, setLeaderClass] = useState('XII RPL 2');
  const [rppFileName, setRppFileName] = useState(`RPP_${schoolSlug}_v2.pdf`);
  const [slideFileName, setSlideFileName] = useState(`Slide_${schoolSlug}_Final.pptx`);
  const [syllabusNotes, setSyllabusNotes] = useState(
    `1. Pembukaan & Pengenalan SMK Telkom (15 menit)\n2. Praktik Inti ${activeGroup.featuredModule} (60 menit)\n3. Kuis Interaktif & Refleksi Siswa SMP (15 menit)`
  );
  const [teachingDate, setTeachingDate] = useState('2026-02-19');
  const [teachingRoom, setTeachingRoom] = useState(`Lab Komputer ${activeGroup.schoolName}`);
  const [attendedStudents, setAttendedStudents] = useState(34);
  const [fieldNotes, setFieldNotes] = useState(
    `Siswa kelas 8 ${activeGroup.schoolName} sangat antusias mengikuti sesi praktik ${activeGroup.featuredModule}.`
  );
  const [stage5Submitted, setStage5Submitted] = useState(false);
  const [lpjFileName, setLpjFileName] = useState<string | null>(null);
  const [reflectionNotes, setReflectionNotes] = useState(
    `Seluruh rangkaian kegiatan mengajar di ${activeGroup.schoolName} berjalan lancar sesuai RPP dan mendapat apresiasi positif dari kepala laboratorium.`
  );
  const [stage6Submitted, setStage6Submitted] = useState(false);

  // Notifications & Accordions
  const [unreadBell, setUnreadBell] = useState(true);
  const [unreadMemo, setUnreadMemo] = useState(true);
  const [openBriefing, setOpenBriefing] = useState(true);
  const [openMemo, setOpenMemo] = useState(false);

  // Modals & Drawers
  const [bleedModalOpen, setBleedModalOpen] = useState(false);
  const [versionDrawerOpen, setVersionDrawerOpen] = useState(false);

  // Dropzone & Preflight state
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadAttempt, setUploadAttempt] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [fileStatus, setFileStatus] = useState<'none' | 'review' | 'approved'>('none');
  const [localToast, setLocalToast] = useState<{ id: number; message: string; withUndo: boolean } | null>(null);

  // Checklist tasks (data-driven per group)
  const [checklistTasks, setChecklistTasks] = useState<ChecklistTask[]>([
    { id: 1, title: `Finalisasi slide materi ${activeGroup.featuredModule}`, status: 'selesai' },
    { id: 2, title: `Persetujuan draf modul oleh ${activeGroup.mentorName}`, status: 'selesai' },
    { id: 3, title: `Konsep visual dan copy teks X-Banner ${activeGroup.schoolName}`, status: 'selesai' },
    { id: 4, title: 'Layout draf X-Banner di Canva / Photoshop', status: 'selesai' },
    { id: 5, title: 'Unggah desain X-Banner final siap cetak', status: 'sekarang' },
    { id: 6, title: 'Validasi dan persetujuan oleh admin kurikulum', status: 'berikutnya' },
  ]);

  useEffect(() => {
    setChecklistTasks([
      { id: 1, title: `Finalisasi slide materi ${activeGroup.featuredModule}`, status: 'selesai' },
      { id: 2, title: `Persetujuan draf modul oleh ${activeGroup.mentorName}`, status: 'selesai' },
      { id: 3, title: `Konsep visual dan copy teks X-Banner ${activeGroup.schoolName}`, status: 'selesai' },
      { id: 4, title: 'Layout draf X-Banner di Canva / Photoshop', status: 'selesai' },
      {
        id: 5,
        title: 'Unggah desain X-Banner final siap cetak',
        status: fileStatus === 'review' ? 'selesai' : 'sekarang',
      },
      { id: 6, title: 'Validasi dan persetujuan oleh admin kurikulum', status: 'berikutnya' },
    ]);
  }, [activeGroup.number, activeGroup.featuredModule, activeGroup.mentorName, activeGroup.schoolName, fileStatus]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dropzoneRef = useRef<HTMLDivElement | null>(null);
  const membersSectionRef = useRef<HTMLDivElement | null>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentStageMeta = useMemo(() => {
    const map: Record<
      1 | 2 | 3 | 4 | 5 | 6,
      {
        title: string;
        chipText: string;
        chipColor: 'done' | 'active' | 'upcoming';
        daysLeft: number;
        deadlineText: string;
        tasks: ChecklistTask[];
      }
    > = {
      1: {
        title: 'Bentuk Kelompok',
        chipText: 'Selesai Disetujui',
        chipColor: 'done',
        daysLeft: 0,
        deadlineText: '12 Jan 2026 (Tuntas)',
        tasks: [
          { id: 1, title: 'Registrasi anggota kelompok di portal Skomda Mengajar', status: 'selesai' },
          { id: 2, title: `Penentuan sekolah mitra tujuan (${activeGroup.schoolName})`, status: 'selesai' },
          { id: 3, title: 'Pembagian peran inti (Materi, Desain, Dokumentasi, Logistik)', status: 'selesai' },
          { id: 4, title: 'Verifikasi NIS & publikasi profil anggota tim', status: 'selesai' },
          { id: 5, title: `Pengesahan formasi tim oleh ${activeGroup.mentorName}`, status: 'selesai' },
        ],
      },
      2: {
        title: 'Pilih Ketua',
        chipText: 'Selesai Disetujui',
        chipColor: 'done',
        daysLeft: 0,
        deadlineText: '18 Jan 2026 (Tuntas)',
        tasks: [
          { id: 1, title: 'Musyawarah internal pemilihan ketua kelompok', status: 'selesai' },
          { id: 2, title: `Penetapan ${userDisplayName} sebagai Ketua KEL-${activeGroup.number}`, status: 'selesai' },
          { id: 3, title: 'Verifikasi kontak WhatsApp aktif koordinator lapangan', status: 'selesai' },
          { id: 4, title: `Penerbitan Surat Tugas & Pengantar ke ${activeGroup.schoolName}`, status: 'selesai' },
        ],
      },
      3: {
        title: 'Susun Materi',
        chipText: 'Selesai Disetujui',
        chipColor: 'done',
        daysLeft: 0,
        deadlineText: '31 Jan 2026 (Tuntas)',
        tasks: [
          { id: 1, title: `Penentuan topik modul (${activeGroup.featuredModule})`, status: 'selesai' },
          { id: 2, title: 'Penyusunan dokumen RPP & alokasi waktu (2 x 45 menit)', status: 'selesai' },
          { id: 3, title: 'Pembuatan slide presentasi interaktif & modul praktik', status: 'selesai' },
          { id: 4, title: `Review substansi materi bersama ${activeGroup.mentorName}`, status: 'selesai' },
          { id: 5, title: 'Persetujuan akhir silabus ajar oleh kurikulum', status: 'selesai' },
        ],
      },
      4: {
        title: 'Siapkan Desain',
        chipText: 'Sedang berjalan',
        chipColor: 'active',
        daysLeft: 4,
        deadlineText: activeGroup.targetDate,
        tasks: checklistTasks,
      },
      5: {
        title: 'Mengajar di SMP',
        chipText: stage5Submitted ? 'Tuntas Dilaporkan' : 'Tahap Pelaksanaan',
        chipColor: stage5Submitted ? 'done' : 'active',
        daysLeft: 7,
        deadlineText: '25 Feb 2026',
        tasks: [
          { id: 1, title: `Pemasangan X-Banner & persiapan lab di ${activeGroup.schoolName}`, status: 'selesai' },
          { id: 2, title: 'Sesi pembukaan & pengenalan profil SMK Telkom Sidoarjo', status: 'selesai' },
          { id: 3, title: `Penyampaian materi & praktik ${activeGroup.featuredModule}`, status: 'selesai' },
          {
            id: 4,
            title: 'Unggah foto dokumentasi kelas & Berita Acara mengajar',
            status: stage5Submitted ? 'selesai' : 'sekarang',
          },
          {
            id: 5,
            title: `Verifikasi laporan pelaksanaan oleh ${activeGroup.mentorName}`,
            status: stage5Submitted ? 'selesai' : 'berikutnya',
          },
        ],
      },
      6: {
        title: 'Evaluasi & LPJ',
        chipText: stage6Submitted ? 'LPJ Terkirim' : 'Tahap Akhir',
        chipColor: stage6Submitted ? 'done' : 'active',
        daysLeft: 10,
        deadlineText: '28 Feb 2026',
        tasks: [
          { id: 1, title: `Rekapitulasi kuesioner feedback dari ${activeGroup.schoolName}`, status: 'selesai' },
          { id: 2, title: 'Verifikasi kelengkapan tautan publikasi Instagram anggota', status: 'selesai' },
          { id: 3, title: 'Penyusunan dokumen Laporan Pertanggungjawaban (LPJ)', status: 'selesai' },
          {
            id: 4,
            title: 'Unggah berkas LPJ final (PDF) ke portal Skomda Mengajar',
            status: stage6Submitted ? 'selesai' : 'sekarang',
          },
          {
            id: 5,
            title: 'Penerbitan sertifikat pengabdian masyarakat 2026',
            status: stage6Submitted ? 'selesai' : 'berikutnya',
          },
        ],
      },
    };
    return map[activeStage];
  }, [activeStage, activeGroup, userDisplayName, checklistTasks, stage5Submitted, stage6Submitted]);

  const activeStageTasks = currentStageMeta.tasks;
  const completedCount = activeStageTasks.filter((t) => t.status === 'selesai').length;
  const totalCount = activeStageTasks.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  const diffDays = currentStageMeta.daysLeft;
  const radialOffset = diffDays === 0 ? 0 : 175 - (diffDays / 14) * 175;

  const triggerWorkspaceToast = (message: string, withUndo = false) => {
    const id = Date.now();
    setLocalToast({ id, message, withUndo });
    setTimeout(() => {
      setLocalToast((prev) => (prev?.id === id ? null : prev));
    }, 5000);
  };

  const triggerConfetti = () => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#D7141F', '#0F9D58', '#2563EB', '#F59E0B', '#9333EA'];
    const particles = Array.from({ length: 60 }, () => ({
      x: canvas.width / 2,
      y: canvas.height * 0.4,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.8) * 14,
      size: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      gravity: 0.35,
      life: 60,
    }));

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.life--;
        if (p.life > 0) alive = true;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      if (alive) {
        requestAnimationFrame(update);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    requestAnimationFrame(update);
  };

  const handleFileUpload = (fileName: string) => {
    const nextAttempt = uploadAttempt + 1;
    setUploadAttempt(nextAttempt);
    setUploadedFileName(fileName);
    if (nextAttempt >= 2) {
      triggerWorkspaceToast('Seluruh spesifikasi cetak banner lolos kelayakan!', false);
    }
  };

  const handleSubmitForReview = () => {
    setFileStatus('review');
    triggerConfetti();
    triggerWorkspaceToast('Berkas banner berhasil dikirim ke admin kurikulum!', true);
  };

  const handleUndoSubmit = () => {
    setFileStatus('none');
    setLocalToast(null);
    triggerWorkspaceToast('Pengiriman berkas dibatalkan.', false);
  };

  const isSecondAttempt = uploadAttempt >= 2;
  const preflightCriteria = [
    { label: 'Ukuran Kanvas 60 x 160 cm', pass: true },
    { label: 'Resolusi Gambar 300 DPI Siap Cetak', pass: true },
    { label: 'Mode Warna Cetak CMYK', pass: true },
    {
      label: 'Bleed 1 cm di Setiap Sisi',
      pass: isSecondAttempt,
      failNote:
        'File berukuran 60x160 cm tanpa bleed lebihan. Tambahkan 1 cm pada tiap sisi (menjadi 62x162 cm) agar potongan mata ayam rapi.',
    },
  ];

  return (
    <div className="tahap04-root">
      <style>{`
        .tahap04-root {
          --bg-canvas: #FFFFFF;
          --bg-subtle: #F8FAFC;
          --bg-hover: #F1F5F9;
          --bg-active: #E2E8F0;
          --border-hairline: #E8ECF2;
          --border-focus: #D7141F;
          --color-brand: #D7141F;
          --color-brand-hover: #B80F1A;
          --color-brand-active: #9A0D16;
          --color-brand-tint: #FFF1F2;
          --color-brand-border: #FFE4E6;
          --text-ink: #0B1B3A;
          --text-body: #475569;
          --text-muted: #64748B;
          --text-white: #FFFFFF;
          --stage-done: #0F9D58;
          --stage-done-tint: #ECFDF3;
          --stage-done-border: #A7F3D0;
          --stage-active: #D7141F;
          --stage-active-tint: #FFF1F2;
          --stage-locked: #CBD5E1;
          --stage-locked-bg: #F8FAFC;
          --status-review-bg: #FFF7E6;
          --status-review-text: #92400E;
          --status-review-dot: #D97706;
          --radius-sm: 8px;
          --radius-md: 12px;
          --radius-card: 16px;
          --radius-pill: 9999px;
          --shadow-sm: 0 1px 2px rgba(11, 27, 58, 0.04);
          --shadow-hover: 0 4px 14px rgba(11, 27, 58, 0.06);
          --shadow-modal: 0 20px 40px -8px rgba(11, 27, 58, 0.16), 0 0 0 1px rgba(232, 236, 242, 0.8);
          --shadow-toast: 0 12px 28px -4px rgba(11, 27, 58, 0.16);
          --ease-standard: cubic-bezier(0.22, 1, 0.36, 1);
          --duration-fast: 160ms;
          --duration-normal: 260ms;
          --sidebar-width: 248px;
          --sidebar-rail-width: 72px;
          --topbar-height: 64px;

          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: var(--text-body);
          background-color: var(--bg-canvas);
          min-height: 100vh;
        }
        .tahap04-root *, .tahap04-root *::before, .tahap04-root *::after {
          box-sizing: border-box;
        }
        .tahap04-root button {
          background: none;
          border: none;
          cursor: pointer;
          user-select: none;
          font: inherit;
        }
        .tahap04-root .tabular-nums {
          font-variant-numeric: tabular-nums;
        }
        .tahap04-root .eyebrow-label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          line-height: 1.2;
        }
        .tahap04-root .app-shell {
          display: flex;
          min-height: 100vh;
          background-color: var(--bg-canvas);
        }
        .tahap04-root .app-sidebar {
          width: var(--sidebar-width);
          flex-shrink: 0;
          background-color: var(--bg-canvas);
          border-right: 1px solid var(--border-hairline);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          z-index: 40;
          transition: width var(--duration-normal) var(--ease-standard);
        }
        .tahap04-root .app-sidebar.is-rail {
          width: var(--sidebar-rail-width);
        }
        .tahap04-root .sidebar-brand-row {
          height: var(--topbar-height);
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-hairline);
        }
        .tahap04-root .brand-logo-group {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
          white-space: nowrap;
          cursor: pointer;
        }
        .tahap04-root .brand-logo-box {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          background-color: var(--color-brand);
          color: #FFFFFF;
          font-weight: 800;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .tahap04-root .brand-text-wrap {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        .tahap04-root .app-sidebar.is-rail .brand-text-wrap {
          display: none;
        }
        .tahap04-root .brand-title {
          font-weight: 700;
          font-size: 14px;
          color: var(--text-ink);
        }
        .tahap04-root .brand-program {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 500;
        }
        .tahap04-root .btn-toggle-rail {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          border: 1px solid var(--border-hairline);
          background-color: #FFFFFF;
          transition: all var(--duration-fast);
          flex-shrink: 0;
        }
        .tahap04-root .btn-toggle-rail:hover {
          background-color: var(--bg-subtle);
          color: var(--text-ink);
        }
        .tahap04-root .sidebar-team-badge {
          margin: 12px 14px 6px 14px;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-hairline);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .tahap04-root .app-sidebar.is-rail .sidebar-team-badge {
          display: none;
        }
        .tahap04-root .sidebar-team-title {
          font-size: 12px;
          font-weight: 800;
          color: var(--color-brand);
        }
        .tahap04-root .sidebar-team-sub {
          font-size: 11.5px;
          font-weight: 600;
          color: var(--text-ink);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tahap04-root .sidebar-nav-list {
          flex: 1;
          padding: 10px;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin: 0;
        }
        .tahap04-root .nav-item-link {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 12px;
          border-radius: var(--radius-md);
          color: var(--text-body);
          font-size: 13px;
          font-weight: 600;
          position: relative;
          transition: all var(--duration-fast);
          cursor: pointer;
          text-align: left;
        }
        .tahap04-root .nav-item-link:hover {
          background-color: var(--bg-subtle);
          color: var(--text-ink);
        }
        .tahap04-root .nav-item-link.is-active {
          background-color: var(--color-brand-tint);
          color: var(--color-brand);
          font-weight: 700;
        }
        .tahap04-root .nav-item-link.is-active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 6px;
          bottom: 6px;
          width: 3px;
          border-radius: 0 3px 3px 0;
          background-color: var(--color-brand);
        }
        .tahap04-root .nav-item-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .tahap04-root .nav-icon {
          width: 18px;
          height: 18px;
          stroke-width: 1.75;
          flex-shrink: 0;
        }
        .tahap04-root .app-sidebar.is-rail .nav-label,
        .tahap04-root .app-sidebar.is-rail .nav-badge-pill {
          display: none;
        }
        .tahap04-root .nav-badge-pill {
          font-size: 11px;
          font-weight: 700;
          padding: 1px 7px;
          border-radius: var(--radius-pill);
          background-color: var(--bg-hover);
          color: var(--text-muted);
        }
        .tahap04-root .sidebar-footer {
          padding: 14px;
          border-top: 1px solid var(--border-hairline);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          background-color: var(--bg-canvas);
        }
        .tahap04-root .user-pill-row {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .tahap04-root .user-avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-pill);
          background-color: var(--color-brand);
          color: #FFFFFF;
          font-weight: 700;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .tahap04-root .user-details-col {
          display: flex;
          flex-direction: column;
          line-height: 1.25;
          overflow: hidden;
        }
        .tahap04-root .app-sidebar.is-rail .user-details-col {
          display: none;
        }
        .tahap04-root .user-name-text {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-ink);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .tahap04-root .user-role-text {
          font-size: 11px;
          color: var(--text-muted);
        }
        .tahap04-root .app-main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .tahap04-root .app-topbar {
          height: var(--topbar-height);
          position: sticky;
          top: 0;
          z-index: 30;
          background-color: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-hairline);
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .tahap04-root .topbar-breadcrumb-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .tahap04-root .btn-mobile-menu {
          display: none;
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          align-items: center;
          justify-content: center;
          color: var(--text-ink);
          border: 1px solid var(--border-hairline);
        }
        .tahap04-root .breadcrumb-text {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .tahap04-root .breadcrumb-text strong {
          color: var(--text-ink);
          font-weight: 700;
        }
        .tahap04-root .topbar-actions-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .tahap04-root .topbar-icon-button {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-body);
          border: 1px solid var(--border-hairline);
          background-color: var(--bg-canvas);
          position: relative;
          transition: all var(--duration-fast);
        }
        .tahap04-root .topbar-icon-button:hover {
          background-color: var(--bg-subtle);
          color: var(--text-ink);
        }
        .tahap04-root .notification-dot {
          position: absolute;
          top: 7px;
          right: 7px;
          width: 8px;
          height: 8px;
          border-radius: var(--radius-pill);
          background-color: var(--color-brand);
          border: 1.5px solid #FFFFFF;
        }
        .tahap04-root .page-content-wrapper {
          padding: 24px 32px 64px 32px;
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .tahap04-root .stage-hero-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          padding-bottom: 4px;
        }
        .tahap04-root .hero-title-group h1 {
          font-size: 34px;
          font-weight: 800;
          color: var(--text-ink);
          letter-spacing: -0.6px;
          line-height: 1.15;
          margin: 3px 0;
        }
        .tahap04-root .hero-meta-subtitle {
          font-size: 13.5px;
          color: var(--text-muted);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .tahap04-root .chip-live-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: var(--color-brand);
          background-color: var(--color-brand-tint);
          border: 1px solid var(--color-brand-border);
          padding: 4px 10px;
          border-radius: var(--radius-pill);
          white-space: nowrap;
        }
        .tahap04-root .pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: var(--radius-pill);
          background-color: var(--color-brand);
          animation: pulseAnim 1.8s infinite;
        }
        @keyframes pulseAnim {
          0% { box-shadow: 0 0 0 0 rgba(215, 20, 31, 0.5); }
          70% { box-shadow: 0 0 0 7px rgba(215, 20, 31, 0); }
          100% { box-shadow: 0 0 0 0 rgba(215, 20, 31, 0); }
        }
        .tahap04-root .stage-stepper-card {
          background-color: var(--bg-canvas);
          border: 1px solid var(--border-hairline);
          border-radius: var(--radius-card);
          padding: 16px 20px;
          position: relative;
        }
        .tahap04-root .stepper-nodes-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          position: relative;
        }
        .tahap04-root .stepper-track-underlay {
          position: absolute;
          top: 15px;
          left: 24px;
          right: 24px;
          height: 2px;
          background-color: var(--border-hairline);
          z-index: 1;
        }
        .tahap04-root .stepper-track-fill {
          position: absolute;
          top: 15px;
          left: 24px;
          width: 60%;
          height: 2px;
          background-color: var(--stage-done);
          z-index: 2;
        }
        .tahap04-root .step-node-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 3;
          flex: 1;
          cursor: pointer;
        }
        .tahap04-root .step-circle {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-pill);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 800;
          background-color: #FFFFFF;
          transition: all var(--duration-fast);
        }
        .tahap04-root .step-node-col.is-completed .step-circle {
          background-color: var(--stage-done);
          color: #FFFFFF;
          box-shadow: 0 2px 4px rgba(15, 157, 88, 0.25);
        }
        .tahap04-root .step-node-col.is-active .step-circle {
          background-color: var(--color-brand);
          color: #FFFFFF;
          box-shadow: 0 0 0 4px var(--color-brand-tint);
        }
        .tahap04-root .step-node-col.is-locked .step-circle {
          background-color: var(--stage-locked-bg);
          border: 1px solid var(--stage-locked);
          color: var(--text-muted);
          cursor: not-allowed;
        }
        .tahap04-root .step-node-label {
          margin-top: 6px;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--text-muted);
          line-height: 1.25;
          max-width: 110px;
        }
        .tahap04-root .step-node-col.is-active .step-node-label {
          color: var(--text-ink);
          font-weight: 700;
        }
        .tahap04-root .stage-workspace-grid {
          display: grid;
          grid-template-columns: 8fr 4fr;
          gap: 24px;
          align-items: start;
        }
        .tahap04-root .primary-deliverable-card {
          background-color: var(--bg-canvas);
          border: 1px solid var(--border-hairline);
          border-radius: var(--radius-card);
          padding: 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .tahap04-root .deliverable-header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .tahap04-root .deliverable-title-box h2 {
          font-size: 19px;
          font-weight: 700;
          color: var(--text-ink);
          margin-top: 3px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tahap04-root .tag-mandatory {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: var(--radius-sm);
          background-color: #FEF2F2;
          color: #B42318;
          border: 1px solid #FECACA;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .tahap04-root .status-chip-file {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: var(--radius-pill);
          font-size: 12px;
          font-weight: 700;
          background-color: var(--bg-subtle);
          color: var(--text-muted);
          border: 1px solid var(--border-hairline);
        }
        .tahap04-root .status-chip-file.is-review {
          background-color: var(--status-review-bg);
          color: var(--status-review-text);
          border-color: #FDE68A;
        }
        .tahap04-root .deliverable-body-layout {
          display: grid;
          grid-template-columns: 190px 1fr;
          gap: 22px;
        }
        .tahap04-root .banner-preview-box {
          width: 100%;
          aspect-ratio: 3 / 8;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-hairline);
          background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          cursor: zoom-in;
          position: relative;
          transition: transform var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast);
        }
        .tahap04-root .banner-preview-box:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: var(--shadow-hover);
        }
        .tahap04-root .preview-magnify-hint {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 26px;
          height: 26px;
          border-radius: var(--radius-pill);
          background-color: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-ink);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .tahap04-root .deliverable-actions-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
          justify-content: space-between;
        }
        .tahap04-root .specs-chips-row {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .tahap04-root .spec-item-chip {
          font-size: 11.5px;
          font-weight: 700;
          color: var(--text-body);
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-hairline);
          padding: 4px 9px;
          border-radius: var(--radius-pill);
        }
        .tahap04-root .link-bleed-popover {
          font-size: 11.5px;
          font-weight: 700;
          color: var(--color-brand);
          text-decoration: underline;
          cursor: pointer;
          margin-left: 2px;
        }
        .tahap04-root .dropzone-container {
          border: 2px dashed #CBD5E1;
          border-radius: var(--radius-card);
          padding: 24px 20px;
          text-align: center;
          background-color: var(--bg-subtle);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          position: relative;
          transition: all var(--duration-fast) var(--ease-standard);
        }
        .tahap04-root .dropzone-container:hover, .tahap04-root .dropzone-container.is-dragover {
          border-color: var(--color-brand);
          background-color: var(--color-brand-tint);
          transform: scale(1.008);
        }
        .tahap04-root .dropzone-icon-circle {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-pill);
          background-color: #FFFFFF;
          border: 1px solid var(--border-hairline);
          color: var(--color-brand);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
        }
        .tahap04-root .dropzone-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-ink);
        }
        .tahap04-root .dropzone-subtitle {
          font-size: 12px;
          color: var(--text-muted);
        }
        .tahap04-root .btn-upload-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: var(--color-brand);
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 700;
          padding: 9px 18px;
          border-radius: var(--radius-md);
          transition: all var(--duration-fast);
          margin-top: 4px;
          box-shadow: 0 2px 6px rgba(215, 20, 31, 0.25);
        }
        .tahap04-root .btn-upload-primary:hover {
          background-color: var(--color-brand-hover);
          transform: translateY(-1px);
        }
        .tahap04-root .preflight-panel {
          border: 1px solid var(--border-hairline);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          background-color: #FFFFFF;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .tahap04-root .preflight-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .tahap04-root .preflight-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-ink);
        }
        .tahap04-root .preflight-ring-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-ink);
        }
        .tahap04-root .preflight-checklist {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin: 0;
          padding: 0;
        }
        .tahap04-root .preflight-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 12.5px;
          line-height: 1.4;
        }
        .tahap04-root .check-icon-node {
          width: 18px;
          height: 18px;
          border-radius: var(--radius-pill);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .tahap04-root .check-icon-node.is-pass {
          background-color: #ECFDF3;
          color: #0F9D58;
        }
        .tahap04-root .check-icon-node.is-fail {
          background-color: #FEF2F2;
          color: #B42318;
        }
        .tahap04-root .preflight-error-hint {
          margin-top: 4px;
          font-size: 11.5px;
          color: #B42318;
          background-color: #FEF2F2;
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid #FECACA;
        }
        .tahap04-root .preflight-actions-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-top: 6px;
          border-top: 1px solid var(--border-hairline);
          flex-wrap: wrap;
        }
        .tahap04-root .btn-submit-review {
          flex: 1;
          height: 40px;
          border-radius: var(--radius-md);
          background-color: var(--color-brand);
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all var(--duration-fast);
        }
        .tahap04-root .btn-submit-review:disabled {
          background-color: #E2E8F0;
          color: #94A3B8;
          cursor: not-allowed;
        }
        .tahap04-root .deliverable-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          color: var(--text-muted);
          border-top: 1px solid var(--border-hairline);
          padding-top: 12px;
        }
        .tahap04-root .link-version-history {
          font-weight: 600;
          color: var(--color-brand);
          cursor: pointer;
        }
        .tahap04-root .link-version-history:hover {
          text-decoration: underline;
        }
        .tahap04-root .stage-checklist-card {
          background-color: var(--bg-canvas);
          border: 1px solid var(--border-hairline);
          border-radius: var(--radius-card);
          padding: 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .tahap04-root .checklist-rows-container {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border-hairline);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .tahap04-root .checklist-row-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 16px;
          background-color: #FFFFFF;
          border-bottom: 1px solid var(--border-hairline);
          font-size: 13.5px;
        }
        .tahap04-root .checklist-row-item:last-child {
          border-bottom: none;
        }
        .tahap04-root .checklist-row-item.is-current {
          background-color: var(--color-brand-tint);
          cursor: pointer;
        }
        .tahap04-root .checklist-left-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .tahap04-root .task-status-symbol {
          width: 22px;
          height: 22px;
          border-radius: var(--radius-pill);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .tahap04-root .task-status-symbol.is-done {
          background-color: #ECFDF3;
          color: #0F9D58;
        }
        .tahap04-root .task-status-symbol.is-active-ring {
          border: 2px solid var(--color-brand);
          background-color: #FFFFFF;
          color: var(--color-brand);
        }
        .tahap04-root .task-status-symbol.is-pending-dot {
          background-color: #E2E8F0;
          color: #64748B;
        }
        .tahap04-root .task-title-text {
          color: var(--text-ink);
          font-weight: 500;
        }
        .tahap04-root .checklist-row-item.is-current .task-title-text {
          font-weight: 700;
          color: var(--color-brand);
        }
        .tahap04-root .badge-task-now {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          padding: 2px 7px;
          border-radius: var(--radius-pill);
          background-color: var(--color-brand);
          color: #FFFFFF;
        }
        .tahap04-root .right-widgets-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: sticky;
          top: 88px;
        }
        .tahap04-root .summary-stage-card {
          background-color: var(--bg-canvas);
          border: 1px solid var(--border-hairline);
          border-radius: var(--radius-card);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .tahap04-root .countdown-radial-box {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .tahap04-root .radial-svg-wrap {
          width: 68px;
          height: 68px;
          position: relative;
          flex-shrink: 0;
        }
        .tahap04-root .radial-svg-wrap svg {
          transform: rotate(-90deg);
        }
        .tahap04-root .radial-center-number {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 800;
          color: var(--text-ink);
        }
        .tahap04-root .countdown-text-col {
          display: flex;
          flex-direction: column;
        }
        .tahap04-root .countdown-days-big {
          font-size: 17px;
          font-weight: 800;
          color: var(--text-ink);
        }
        .tahap04-root .countdown-deadline-sub {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .tahap04-root .single-progress-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .tahap04-root .progress-bar-track {
          width: 100%;
          height: 6px;
          border-radius: var(--radius-pill);
          background-color: var(--border-hairline);
          overflow: hidden;
        }
        .tahap04-root .progress-bar-fill {
          height: 100%;
          border-radius: var(--radius-pill);
          background-color: var(--color-brand);
          transition: width var(--duration-normal) var(--ease-standard);
        }
        .tahap04-root .progress-bar-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-ink);
        }
        .tahap04-root .supervisor-pill-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid var(--border-hairline);
        }
        .tahap04-root .supervisor-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .tahap04-root .supervisor-avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-pill);
          background-color: var(--bg-hover);
          color: var(--text-ink);
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tahap04-root .supervisor-name {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--text-ink);
          line-height: 1.2;
        }
        .tahap04-root .supervisor-role {
          font-size: 11px;
          color: var(--text-muted);
        }
        .tahap04-root .btn-wa-round {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-pill);
          background-color: #ECFDF3;
          color: #0F9D58;
          border: 1px solid #A7F3D0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tahap04-root .info-accordion-card {
          background-color: var(--bg-canvas);
          border: 1px solid var(--border-hairline);
          border-radius: var(--radius-card);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .tahap04-root .accordion-item-row {
          border-bottom: 1px solid var(--border-hairline);
        }
        .tahap04-root .accordion-item-row:last-child {
          border-bottom: none;
        }
        .tahap04-root .accordion-trigger-btn {
          width: 100%;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-ink);
        }
        .tahap04-root .accordion-trigger-btn:hover {
          background-color: var(--bg-subtle);
        }
        .tahap04-root .accordion-left-tag {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .tahap04-root .accordion-content-panel {
          padding: 0 18px 14px 18px;
          font-size: 12.5px;
          color: var(--text-body);
          line-height: 1.5;
        }
        .tahap04-root .new-indicator-dot {
          width: 6px;
          height: 6px;
          border-radius: var(--radius-pill);
          background-color: #D97706;
          display: inline-block;
          margin-left: 4px;
        }
        .tahap04-root .support-footer-row {
          font-size: 12px;
          color: var(--text-muted);
          text-align: center;
          padding: 4px;
        }
        .tahap04-root .support-footer-row a {
          color: var(--text-ink);
          font-weight: 600;
          text-decoration: underline;
        }
        .tahap04-root .popover-modal-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(11, 27, 58, 0.4);
          backdrop-filter: blur(4px);
          z-index: 60;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .tahap04-root .popover-card-box {
          background-color: #FFFFFF;
          border-radius: var(--radius-card);
          max-width: 440px;
          width: 100%;
          padding: 22px;
          box-shadow: var(--shadow-modal);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .tahap04-root .version-drawer-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(11, 27, 58, 0.4);
          z-index: 65;
        }
        .tahap04-root .version-drawer-panel {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 360px;
          max-width: 90vw;
          background-color: #FFFFFF;
          z-index: 66;
          box-shadow: -8px 0 28px rgba(11, 27, 58, 0.15);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .tahap04-root .toast-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 70;
        }
        .tahap04-root .toast-card {
          background-color: var(--text-ink);
          color: #FFFFFF;
          border-radius: var(--radius-md);
          padding: 12px 18px;
          box-shadow: var(--shadow-toast);
          display: flex;
          align-items: center;
          gap: 14px;
          font-size: 13px;
          font-weight: 600;
          position: relative;
          overflow: hidden;
        }
        .tahap04-root .toast-undo-action {
          color: #F87171;
          font-weight: 700;
          font-size: 12px;
          text-transform: uppercase;
          cursor: pointer;
        }
        .tahap04-root .toast-progress-line {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background-color: var(--color-brand);
          width: 100%;
          animation: toastProgress 5s linear forwards;
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
        @media (max-width: 1024px) {
          .tahap04-root .stage-workspace-grid {
            grid-template-columns: 1fr;
          }
          .tahap04-root .right-widgets-column {
            position: static;
          }
        }
        @media (max-width: 768px) {
          .tahap04-root .app-sidebar {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            transform: translateX(-100%);
            width: 250px !important;
            box-shadow: var(--shadow-modal);
          }
          .tahap04-root .app-sidebar.mobile-open {
            transform: translateX(0);
          }
          .tahap04-root .btn-mobile-menu {
            display: flex;
          }
          .tahap04-root .page-content-wrapper {
            padding: 16px 16px 80px 16px;
          }
          .tahap04-root .deliverable-body-layout {
            grid-template-columns: 1fr;
          }
          .tahap04-root .banner-preview-box {
            max-width: 200px;
            margin: 0 auto;
          }
        }
      `}</style>

      {/* Confetti Canvas */}
      <canvas
        ref={confettiCanvasRef}
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99 }}
      />

      <div className="app-shell">
        {/* ─── SIDEBAR (248px / RAIL 72px) ──────────────────────────────────── */}
        <aside
          className={`app-sidebar ${isRail ? 'is-rail' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}
          aria-label="Navigasi Siswa"
        >
          <div className="sidebar-brand-row">
            <div className="brand-logo-group" onClick={() => navigate('/')}>
              <div className="brand-logo-box">SM</div>
              <div className="brand-text-wrap">
                <span className="brand-title">Skomda Mengajar</span>
                <span className="brand-program">Tahun Ajaran 2026</span>
              </div>
            </div>
            <button
              className="btn-toggle-rail"
              onClick={() => setIsRail(!isRail)}
              title="Ciutkan Sidebar"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          </div>

          {/* Dynamic Team Badge Card for Logged-in Group */}
          <div className="sidebar-team-badge">
            <span className="sidebar-team-title">KEL-{activeGroup.number}</span>
            <span className="sidebar-team-sub">{activeGroup.schoolName}</span>
          </div>

          {/* Menu Items */}
          <ul className="sidebar-nav-list">
            <li>
              <button
                type="button"
                className="nav-item-link"
                onClick={() => navigate('/')}
              >
                <div className="nav-item-left">
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span className="nav-label">Beranda Publik</span>
                </div>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-item-link ${activeNav === 'pipeline' ? 'is-active' : ''}`}
                onClick={() => {
                  setActiveNav('pipeline');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="nav-item-left">
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  <span className="nav-label">Alur Pelaksanaan</span>
                </div>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-item-link ${activeNav === 'workspace' ? 'is-active' : ''}`}
                onClick={() => {
                  setActiveNav('workspace');
                  dropzoneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
              >
                <div className="nav-item-left">
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                  <span className="nav-label">Ruang Kerja Kelompok</span>
                </div>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`nav-item-link ${activeNav === 'members' ? 'is-active' : ''}`}
                onClick={() => {
                  setActiveNav('members');
                  membersSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                <div className="nav-item-left">
                  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span className="nav-label">Anggota Tim</span>
                </div>
                <span className="nav-badge-pill tabular-nums">{members.length}</span>
              </button>
            </li>
          </ul>

          {/* User Card Footer with Logout */}
          <div className="sidebar-footer">
            <div className="user-pill-row">
              <div className="user-avatar-circle">{userInitials}</div>
              <div className="user-details-col">
                <span className="user-name-text">{userDisplayName}</span>
                <span className="user-role-text">Ketua Kelompok {activeGroup.number}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void logout()}
              title="Keluar Sesi"
              style={{
                padding: '6px',
                borderRadius: '8px',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </aside>

        {/* ─── MAIN VIEWPORT ────────────────────────────────────────────────── */}
        <main className="app-main">
          {/* Sticky Topbar */}
          <header className="app-topbar">
            <div className="topbar-breadcrumb-wrap">
              <button
                type="button"
                className="btn-mobile-menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Buka Navigasi"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <div className="breadcrumb-text">
                <span>Alur Pelaksanaan</span>
                <span>&gt;</span>
                <strong>
                  Tahap 0{activeStage}: {currentStageMeta.title} — KEL-{activeGroup.number}
                </strong>
              </div>
            </div>

            <div className="topbar-actions-wrap">
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="topbar-icon-button"
                  onClick={() => {
                    setUnreadBell(false);
                    setUnreadMemo(false);
                    triggerWorkspaceToast('Pengumuman briefing teknis & memo kurikulum ditandai sudah dibaca.');
                  }}
                  title="Notifikasi Pengumuman & Memo"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                  {unreadBell && <span className="notification-dot" />}
                </button>
              </div>

              <div
                className="user-avatar-circle"
                style={{ width: 34, height: 34, fontSize: 12 }}
                title={`${userDisplayName} (KEL-${activeGroup.number})`}
              >
                {userInitials}
              </div>
            </div>
          </header>

          {/* Main Scrollable Content */}
          <div className="page-content-wrapper">
            {/* ─── 1) HEADER RINGKAS ────────────────────────────────────────── */}
            <section className="stage-hero-header">
              <div className="hero-title-group">
                <span className="eyebrow-label">Tahap {activeStage} dari 6</span>
                <h1>{currentStageMeta.title}</h1>
                <div className="hero-meta-subtitle">
                  <span style={{ fontWeight: 700, color: 'var(--color-brand)' }}>KEL-{activeGroup.number}</span>
                  <span>•</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-ink)' }}>{activeGroup.schoolName}</span>
                  <span>•</span>
                  <span>Pembimbing: {activeGroup.mentorName}</span>
                </div>
              </div>

              <div
                className="chip-live-status"
                style={
                  currentStageMeta.chipColor === 'done'
                    ? {
                        backgroundColor: 'var(--stage-done-tint)',
                        borderColor: 'var(--stage-done-border)',
                        color: 'var(--stage-done)',
                      }
                    : undefined
                }
              >
                <span
                  className="pulse-dot"
                  style={
                    currentStageMeta.chipColor === 'done'
                      ? { backgroundColor: 'var(--stage-done)', animation: 'none' }
                      : undefined
                  }
                />
                <span>{currentStageMeta.chipText}</span>
              </div>
            </section>

            {/* ─── 2) STEPPER RINGKAS (6 TAHAP INTERAKTIF) ──────────────────── */}
            <section className="stage-stepper-card" aria-label="Alur 6 Tahap Skomda Mengajar">
              <div className="stepper-nodes-row">
                <div className="stepper-track-underlay" />
                <div
                  className="stepper-track-fill"
                  style={{ width: `${Math.round(((activeStage - 1) / 5) * 92)}%` }}
                />

                {STAGES.map((stg) => {
                  const isCompleted =
                    stg.id < 4 ||
                    (stg.id === 4 && fileStatus === 'review') ||
                    (stg.id === 5 && stage5Submitted) ||
                    (stg.id === 6 && stage6Submitted);
                  const isActive = stg.id === activeStage;

                  return (
                    <div
                      key={stg.id}
                      onClick={() => setActiveStage(stg.id as 1 | 2 | 3 | 4 | 5 | 6)}
                      className={`step-node-col ${
                        isActive ? 'is-active' : isCompleted ? 'is-completed' : ''
                      }`}
                      title={`Klik untuk membuka Tahap ${stg.no}: ${stg.name}`}
                    >
                      <div
                        className="step-circle tabular-nums"
                        style={
                          !isActive && !isCompleted
                            ? {
                                backgroundColor: '#F8FAFC',
                                border: '1.5px solid #CBD5E1',
                                color: '#475569',
                              }
                            : undefined
                        }
                      >
                        {isCompleted && !isActive ? (
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          stg.id
                        )}
                      </div>
                      <span className="step-node-label">{stg.name}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ─── 3 & 4) WORKSPACE GRID (KIRI 8 / KANAN 4) ─────────────────── */}
            <div className="stage-workspace-grid">
              {/* KOLOM KIRI: PEKERJAAN */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* ─── TAHAP 01: BENTUK KELOMPOK ─────────────────────────────── */}
                {activeStage === 1 && (
                  <div className="primary-deliverable-card">
                    <div className="deliverable-header-row">
                      <div className="deliverable-title-box">
                        <span className="eyebrow-label">Berkas 01 — Formasi &amp; Pembagian Peran Tim</span>
                        <h2>
                          <span>Susunan Tim &amp; Penempatan ({activeGroup.schoolName})</span>
                          <span
                            className="tag-mandatory"
                            style={{ backgroundColor: '#ECFDF3', color: '#0F9D58', borderColor: '#A7F3D0' }}
                          >
                            Tervalidasi
                          </span>
                        </h2>
                      </div>
                      <div className="status-chip-file is-approved">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Disetujui Kurikulum</span>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: 12,
                        padding: 16,
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-hairline)',
                      }}
                    >
                      <div>
                        <span className="eyebrow-label" style={{ fontSize: 10 }}>Sekolah Mitra Tujuan</span>
                        <div style={{ fontWeight: 800, color: 'var(--text-ink)', fontSize: 15, marginTop: 2 }}>
                          {activeGroup.schoolName}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {activeGroup.schoolAddress}
                        </div>
                      </div>
                      <div>
                        <span className="eyebrow-label" style={{ fontSize: 10 }}>Kecamatan &amp; Kuota</span>
                        <div style={{ fontWeight: 800, color: 'var(--text-ink)', fontSize: 15, marginTop: 2 }}>
                          Kec. {activeGroup.district}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {members.length} Siswa Relawan Terdaftar
                        </div>
                      </div>
                      <div>
                        <span className="eyebrow-label" style={{ fontSize: 10 }}>Guru Pembimbing</span>
                        <div style={{ fontWeight: 800, color: 'var(--text-ink)', fontSize: 15, marginTop: 2 }}>
                          {activeGroup.mentorName}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          SK Penugasan #SKD-2026-{activeGroup.number}
                        </div>
                      </div>
                    </div>

                    <div className="deliverable-meta-row">
                      <span>Formasi tim telah dikunci bersama {activeGroup.mentorName}</span>
                      <button
                        type="button"
                        className="link-version-history"
                        onClick={() =>
                          membersSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }
                      >
                        Lihat Daftar {members.length} Anggota ↓
                      </button>
                    </div>
                  </div>
                )}

                {/* ─── TAHAP 02: PILIH KETUA ─────────────────────────────────── */}
                {activeStage === 2 && (
                  <div className="primary-deliverable-card">
                    <div className="deliverable-header-row">
                      <div className="deliverable-title-box">
                        <span className="eyebrow-label">Berkas 02 — Mandat &amp; Koordinator Lapangan</span>
                        <h2>
                          <span>Penetapan Ketua Kelompok &amp; Surat Tugas</span>
                          <span
                            className="tag-mandatory"
                            style={{ backgroundColor: '#ECFDF3', color: '#0F9D58', borderColor: '#A7F3D0' }}
                          >
                            SK Terbit
                          </span>
                        </h2>
                      </div>
                      <div className="status-chip-file is-approved">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Ketua Aktif</span>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 14,
                        padding: 18,
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-hairline)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div
                          className="user-avatar-circle"
                          style={{ width: 48, height: 48, fontSize: 16 }}
                        >
                          {userInitials}
                        </div>
                        <div>
                          <span className="eyebrow-label" style={{ fontSize: 10, color: 'var(--color-brand)' }}>
                            Ketua Koordinator KEL-{activeGroup.number}
                          </span>
                          <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-ink)' }}>
                            {userDisplayName}
                          </div>
                          <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                            Penanggung Jawab Lapangan • {activeGroup.schoolName}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: 12,
                          paddingTop: 12,
                          borderTop: '1px solid var(--border-hairline)',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-ink)' }}>
                            Nomor WhatsApp Koordinator
                          </label>
                          <input
                            type="text"
                            value={leaderPhone}
                            onChange={(e) => setLeaderPhone(e.target.value)}
                            style={{
                              height: 38,
                              padding: '0 12px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-hairline)',
                              backgroundColor: '#FFFFFF',
                              fontSize: 13,
                            }}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-ink)' }}>
                            Kelas &amp; Jurusan Ketua
                          </label>
                          <input
                            type="text"
                            value={leaderClass}
                            onChange={(e) => setLeaderClass(e.target.value)}
                            style={{
                              height: 38,
                              padding: '0 12px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-hairline)',
                              backgroundColor: '#FFFFFF',
                              fontSize: 13,
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, paddingTop: 4 }}>
                        <button
                          type="button"
                          className="btn-upload-primary"
                          onClick={() =>
                            triggerWorkspaceToast(
                              `Data kontak Ketua KEL-${activeGroup.number} (${leaderPhone}) berhasil diperbarui!`
                            )
                          }
                        >
                          Simpan Kontak Ketua
                        </button>
                        <button
                          type="button"
                          className="btn-upload-primary"
                          style={{
                            backgroundColor: '#FFFFFF',
                            color: 'var(--text-ink)',
                            border: '1px solid var(--border-hairline)',
                            boxShadow: 'none',
                          }}
                          onClick={() =>
                            triggerWorkspaceToast(
                              `Mengunduh Surat_Tugas_KEL-${activeGroup.number}_${schoolSlug}.pdf...`
                            )
                          }
                        >
                          Unduh Surat Tugas &amp; Pengantar SMP (PDF)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── TAHAP 03: SUSUN MATERI ────────────────────────────────── */}
                {activeStage === 3 && (
                  <div className="primary-deliverable-card">
                    <div className="deliverable-header-row">
                      <div className="deliverable-title-box">
                        <span className="eyebrow-label">Berkas 03 — Kurikulum &amp; Silabus Ajar</span>
                        <h2>
                          <span>RPP &amp; Modul: {activeGroup.featuredModule}</span>
                          <span className="tag-mandatory">2 x 45 Menit</span>
                        </h2>
                      </div>
                      <div className="status-chip-file is-approved">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Modul Disetujui</span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                      <div
                        style={{
                          padding: 14,
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-hairline)',
                          backgroundColor: 'var(--bg-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                        }}
                      >
                        <span className="eyebrow-label" style={{ fontSize: 10, color: 'var(--stage-done)' }}>
                          Dokumen 01 • RPP &amp; Silabus
                        </span>
                        <div style={{ fontWeight: 700, color: 'var(--text-ink)', fontSize: 13.5 }}>
                          {rppFileName}
                        </div>
                        <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                          PDF • 2.4 MB • Disetujui oleh {activeGroup.mentorName}
                        </span>
                        <button
                          type="button"
                          className="link-version-history"
                          style={{ textAlign: 'left', marginTop: 4 }}
                          onClick={() => {
                            setRppFileName(`RPP_${schoolSlug}_v3_Revisi.pdf`);
                            triggerWorkspaceToast('Versi terbaru dokumen RPP berhasil diunggah!');
                          }}
                        >
                          Perbarui File RPP
                        </button>
                      </div>

                      <div
                        style={{
                          padding: 14,
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-hairline)',
                          backgroundColor: 'var(--bg-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                        }}
                      >
                        <span className="eyebrow-label" style={{ fontSize: 10, color: 'var(--stage-done)' }}>
                          Dokumen 02 • Slide Presentasi Kelas
                        </span>
                        <div style={{ fontWeight: 700, color: 'var(--text-ink)', fontSize: 13.5 }}>
                          {slideFileName}
                        </div>
                        <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                          PPTX / Canva • 8.6 MB • Siap Tayang di Lab
                        </span>
                        <button
                          type="button"
                          className="link-version-history"
                          style={{ textAlign: 'left', marginTop: 4 }}
                          onClick={() => {
                            setSlideFileName(`Slide_${schoolSlug}_v3_Final.pptx`);
                            triggerWorkspaceToast('Slide presentasi berhasil diperbarui!');
                          }}
                        >
                          Perbarui Slide Materi
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-ink)' }}>
                        Rancangan Susunan Sesi Mengajar di {activeGroup.schoolName}
                      </label>
                      <textarea
                        value={syllabusNotes}
                        onChange={(e) => setSyllabusNotes(e.target.value)}
                        rows={3}
                        style={{
                          width: '100%',
                          padding: 12,
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-hairline)',
                          fontSize: 13,
                          color: 'var(--text-ink)',
                        }}
                      />
                      <div>
                        <button
                          type="button"
                          className="btn-upload-primary"
                          onClick={() =>
                            triggerWorkspaceToast('Rancangan sesi & silabus mengajar berhasil disimpan!')
                          }
                        >
                          Simpan Catatan Silabus
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── TAHAP 04: SIAPKAN DESAIN (X-BANNER) ───────────────────── */}
                {activeStage === 4 && (
                <div className="primary-deliverable-card">
                  <div className="deliverable-header-row">
                    <div className="deliverable-title-box">
                      <span className="eyebrow-label">Berkas 01 — Publikasi Offline</span>
                      <h2>
                        <span>X-Banner Publikasi (60x160 cm)</span>
                        <span className="tag-mandatory">Wajib Cetak</span>
                      </h2>
                    </div>
                    <div className={`status-chip-file ${fileStatus === 'review' ? 'is-review' : ''}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span>{fileStatus === 'review' ? 'Menunggu review' : 'Belum diunggah'}</span>
                    </div>
                  </div>

                  {/* Body: 2 Kolom (Preview Banner 3:8 & Dropzone) */}
                  <div className="deliverable-body-layout">
                    {/* Kiri: Banner Preview SVG 3:8 */}
                    <div
                      className="banner-preview-box"
                      onClick={() => setIsBannerModalOpen(true)}
                      title="Klik untuk pratinjau besar"
                    >
                      <div className="preview-magnify-hint">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          <line x1="11" y1="8" x2="11" y2="14" />
                          <line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                      </div>
                      <svg width="100%" height="100%" viewBox="0 0 300 800" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#D7141F" />
                            <stop offset="60%" stopColor="#9A0D16" />
                            <stop offset="100%" stopColor="#0B1B3A" />
                          </linearGradient>
                        </defs>
                        <rect width="300" height="800" fill="url(#bgGrad)" />
                        <circle cx="50" cy="50" r="22" fill="#FFFFFF" />
                        <text
                          x="50"
                          y="55"
                          fontSize="14"
                          fontWeight="bold"
                          fill="#D7141F"
                          textAnchor="middle"
                          fontFamily="'Plus Jakarta Sans'"
                        >
                          SM
                        </text>
                        <text x="82" y="48" fontSize="11" fontWeight="700" fill="#FFFFFF" fontFamily="'Plus Jakarta Sans'">
                          SKOMDA MENGAJAR
                        </text>
                        <text
                          x="82"
                          y="60"
                          fontSize="9"
                          fill="rgba(255,255,255,0.7)"
                          fontFamily="'Plus Jakarta Sans'"
                        >
                          #IMPACT2026 • VOL.{activeGroup.number}
                        </text>
                        <circle cx="20" cy="20" r="6" fill="none" stroke="#FFFFFF" strokeWidth="2" />
                        <circle cx="280" cy="20" r="6" fill="none" stroke="#FFFFFF" strokeWidth="2" />
                        <circle cx="20" cy="780" r="6" fill="none" stroke="#FFFFFF" strokeWidth="2" />
                        <circle cx="280" cy="780" r="6" fill="none" stroke="#FFFFFF" strokeWidth="2" />
                        <text
                          x="150"
                          y="245"
                          fontSize="26"
                          fontWeight="800"
                          fill="#FFFFFF"
                          textAnchor="middle"
                          fontFamily="'Plus Jakarta Sans'"
                        >
                          WORKSHOP
                        </text>
                        <text
                          x="150"
                          y="285"
                          fontSize="18"
                          fontWeight="800"
                          fill="#FBBF24"
                          textAnchor="middle"
                          fontFamily="'Plus Jakarta Sans'"
                        >
                          {activeGroup.featuredModule.slice(0, 22).toUpperCase()}
                        </text>
                        <rect x="30" y="380" width="240" height="42" rx="8" fill="rgba(255,255,255,0.15)" />
                        <text
                          x="150"
                          y="406"
                          fontSize="13"
                          fontWeight="700"
                          fill="#FFFFFF"
                          textAnchor="middle"
                          fontFamily="'Plus Jakarta Sans'"
                        >
                          {activeGroup.schoolName.toUpperCase()}
                        </text>
                        <text
                          x="150"
                          y="580"
                          fontSize="13"
                          fill="#FFFFFF"
                          textAnchor="middle"
                          fontFamily="'Plus Jakarta Sans'"
                        >
                          18 — 25 Februari 2026
                        </text>
                        <text
                          x="150"
                          y="602"
                          fontSize="11"
                          fill="rgba(255,255,255,0.7)"
                          textAnchor="middle"
                          fontFamily="'Plus Jakarta Sans'"
                        >
                          Lab Komputer {activeGroup.schoolName}
                        </text>
                        <rect x="0" y="730" width="300" height="70" fill="rgba(11,27,58,0.6)" />
                        <text
                          x="150"
                          y="760"
                          fontSize="10"
                          fill="#FFFFFF"
                          textAnchor="middle"
                          fontFamily="'Plus Jakarta Sans'"
                        >
                          SMK TELKOM SIDOARJO
                        </text>
                      </svg>
                    </div>

                    {/* Kanan: Spesifikasi, Dropzone, & Preflight Panel */}
                    <div className="deliverable-actions-col" ref={dropzoneRef}>
                      {/* 5 Spesifikasi Cetak */}
                      <div className="specs-chips-row">
                        <span className="spec-item-chip">60x160 cm</span>
                        <span className="spec-item-chip">300 DPI</span>
                        <span className="spec-item-chip">CMYK</span>
                        <span className="spec-item-chip">Bleed 1 cm</span>
                        <span className="spec-item-chip">TIFF / PDF</span>
                        <button
                          type="button"
                          className="link-bleed-popover"
                          onClick={() => setBleedModalOpen(true)}
                        >
                          Apa itu bleed?
                        </button>
                      </div>

                      {/* Dropzone atau Preflight Panel */}
                      {uploadAttempt === 0 ? (
                        <div
                          className={`dropzone-container ${isDragOver ? 'is-dragover' : ''}`}
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragOver(true);
                          }}
                          onDragLeave={() => setIsDragOver(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDragOver(false);
                            if (e.dataTransfer.files.length > 0) {
                              handleFileUpload(e.dataTransfer.files[0].name);
                            }
                          }}
                        >
                          <div className="dropzone-icon-circle">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                          </div>
                          <span className="dropzone-title">Seret file ke sini atau pilih file</span>
                          <span className="dropzone-subtitle">
                            Format TIFF atau PDF siap cetak, maksimal 50 MB
                          </span>
                          <button
                            type="button"
                            className="btn-upload-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span>Unggah Desain Banner</span>
                          </button>
                        </div>
                      ) : (
                        <div className="preflight-panel">
                          <div className="preflight-top-row">
                            <span className="preflight-title">
                              Cek Kelayakan File Cetak {uploadedFileName ? `(${uploadedFileName})` : ''}
                            </span>
                            <div className="preflight-ring-badge">
                              <span>{isSecondAttempt ? '4 dari 4 terpenuhi' : '3 dari 4 terpenuhi'}</span>
                              <span
                                style={{
                                  color: isSecondAttempt ? 'var(--stage-done)' : 'var(--color-brand)',
                                  fontWeight: 800,
                                }}
                              >
                                {isSecondAttempt ? '(100%)' : '(75%)'}
                              </span>
                            </div>
                          </div>

                          <ul className="preflight-checklist">
                            {preflightCriteria.map((crit, idx) => (
                              <li key={idx} className="preflight-item">
                                <div className={`check-icon-node ${crit.pass ? 'is-pass' : 'is-fail'}`}>
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                  >
                                    {crit.pass ? (
                                      <polyline points="20 6 9 17 4 12" />
                                    ) : (
                                      <>
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                      </>
                                    )}
                                  </svg>
                                </div>
                                <div style={{ flex: 1 }}>
                                  <span style={{ fontWeight: 600, color: 'var(--text-ink)' }}>
                                    {crit.label}
                                  </span>
                                  {!crit.pass && crit.failNote && (
                                    <div className="preflight-error-hint">{crit.failNote}</div>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>

                          <div className="preflight-actions-row">
                            <button
                              type="button"
                              className="btn-submit-review"
                              disabled={!isSecondAttempt || fileStatus === 'review'}
                              onClick={handleSubmitForReview}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                              </svg>
                              <span>
                                {fileStatus === 'review'
                                  ? 'Terkirim — Menunggu Review'
                                  : 'Kirim untuk Review'}
                              </span>
                            </button>

                            {!isSecondAttempt && (
                              <button
                                type="button"
                                className="btn-upload-primary"
                                style={{
                                  backgroundColor: 'var(--bg-hover)',
                                  color: 'var(--text-ink)',
                                  boxShadow: 'none',
                                  marginTop: 0,
                                }}
                                onClick={() =>
                                  handleFileUpload(`X-Banner_${schoolSlug}_v2_BleedFixed.pdf`)
                                }
                              >
                                Unggah Ulang File Perbaikan
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.tiff,.tif"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleFileUpload(e.target.files[0].name);
                          }
                        }}
                      />

                      {/* Meta Satu Baris */}
                      <div className="deliverable-meta-row">
                        <span>Terakhir diubah oleh {userDisplayName} — Hari ini, 10:14 WIB</span>
                        <button
                          type="button"
                          className="link-version-history"
                          onClick={() => setVersionDrawerOpen(true)}
                        >
                          Riwayat versi (2)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                )}

                {/* ─── TAHAP 05: MENGAJAR DI SMP ─────────────────────────────── */}
                {activeStage === 5 && (
                  <div className="primary-deliverable-card">
                    <div className="deliverable-header-row">
                      <div className="deliverable-title-box">
                        <span className="eyebrow-label">Berkas 05 — Pelaksanaan &amp; Dokumentasi Lapangan</span>
                        <h2>
                          <span>Jurnal Mengajar &amp; Presensi ({activeGroup.schoolName})</span>
                          <span className="tag-mandatory">Wajib Dokumentasi</span>
                        </h2>
                      </div>
                      <div className={`status-chip-file ${stage5Submitted ? 'is-approved' : 'is-review'}`}>
                        <span>{stage5Submitted ? 'Laporan Terkirim' : 'Siap Pelaksanaan'}</span>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: 12,
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-ink)' }}>
                          Tanggal Pelaksanaan
                        </label>
                        <input
                          type="date"
                          value={teachingDate}
                          onChange={(e) => setTeachingDate(e.target.value)}
                          style={{
                            height: 38,
                            padding: '0 12px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-hairline)',
                            fontSize: 13,
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-ink)' }}>
                          Lokasi Ruang / Lab SMP
                        </label>
                        <input
                          type="text"
                          value={teachingRoom}
                          onChange={(e) => setTeachingRoom(e.target.value)}
                          style={{
                            height: 38,
                            padding: '0 12px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-hairline)',
                            fontSize: 13,
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-ink)' }}>
                          Jumlah Siswa SMP Hadir
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={200}
                          value={attendedStudents}
                          onChange={(e) => setAttendedStudents(Number(e.target.value))}
                          style={{
                            height: 38,
                            padding: '0 12px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-hairline)',
                            fontSize: 13,
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-ink)' }}>
                        Catatan Jurnal &amp; Antusiasme Kelas
                      </label>
                      <textarea
                        rows={3}
                        value={fieldNotes}
                        onChange={(e) => setFieldNotes(e.target.value)}
                        style={{
                          width: '100%',
                          padding: 12,
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-hairline)',
                          fontSize: 13,
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                      <button
                        type="button"
                        className="btn-upload-primary"
                        onClick={() => {
                          setStage5Submitted(true);
                          triggerConfetti();
                          triggerWorkspaceToast(
                            `Dokumentasi & Berita Acara mengajar di ${activeGroup.schoolName} berhasil dikirim!`
                          );
                        }}
                      >
                        {stage5Submitted
                          ? 'Terkirim — Perbarui Laporan Mengajar'
                          : 'Kirim Berita Acara & Dokumentasi'}
                      </button>
                    </div>
                  </div>
                )}

                {/* ─── TAHAP 06: EVALUASI & LPJ ──────────────────────────────── */}
                {activeStage === 6 && (
                  <div className="primary-deliverable-card">
                    <div className="deliverable-header-row">
                      <div className="deliverable-title-box">
                        <span className="eyebrow-label">Berkas 06 — Evaluasi Akhir &amp; Sertifikat</span>
                        <h2>
                          <span>Laporan Pertanggungjawaban (LPJ) &amp; Feedback SMP</span>
                          <span className="tag-mandatory">Tahap Final</span>
                        </h2>
                      </div>
                      <div className={`status-chip-file ${stage6Submitted ? 'is-approved' : 'is-review'}`}>
                        <span>{stage6Submitted ? 'LPJ Disetujui' : 'Menunggu LPJ'}</span>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: 16,
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: '#ECFDF3',
                        border: '1px solid #A7F3D0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 12,
                      }}
                    >
                      <div>
                        <span className="eyebrow-label" style={{ fontSize: 10, color: '#0F9D58' }}>
                          Hasil Feedback Sekolah Mitra ({activeGroup.schoolName})
                        </span>
                        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-ink)', marginTop: 2 }}>
                          Rating Kepuasan Siswa &amp; Guru Pamong: 4.9 / 5.0 ★
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-body)', marginTop: 2 }}>
                          "Materi {activeGroup.featuredModule} disampaikan dengan sangat interaktif dan mudah dipahami."
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-ink)' }}>
                        Ringkasan Evaluasi &amp; Refleksi Kelompok {activeGroup.number}
                      </label>
                      <textarea
                        rows={3}
                        value={reflectionNotes}
                        onChange={(e) => setReflectionNotes(e.target.value)}
                        style={{
                          width: '100%',
                          padding: 12,
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-hairline)',
                          fontSize: 13,
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
                      <button
                        type="button"
                        className="btn-upload-primary"
                        onClick={() => {
                          setLpjFileName(`LPJ_Final_KEL-${activeGroup.number}_${schoolSlug}.pdf`);
                          setStage6Submitted(true);
                          triggerConfetti();
                          triggerWorkspaceToast(
                            `Selamat! LPJ Final KEL-${activeGroup.number} berhasil dikirim & sertifikat siap diunduh.`
                          );
                        }}
                      >
                        {stage6Submitted
                          ? `LPJ Terkirim (${lpjFileName || 'PDF'})`
                          : 'Unggah & Kirim LPJ Final (PDF)'}
                      </button>

                      {stage6Submitted && (
                        <button
                          type="button"
                          className="btn-upload-primary"
                          style={{
                            backgroundColor: 'var(--stage-done)',
                            boxShadow: 'none',
                          }}
                          onClick={() =>
                            triggerWorkspaceToast(
                              `Mengunduh Sertifikat_SkomdaMengajar_KEL-${activeGroup.number}.pdf...`
                            )
                          }
                        >
                          Unduh Sertifikat Tim
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* 3b. KARTU CHECKLIST TAHAP (DINAMIS SESUAI TAHAP 01-06) */}
                <div className="stage-checklist-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span className="eyebrow-label">Checklist Pekerjaan</span>
                      <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-ink)' }}>
                        Langkah Pelaksanaan Tahap 0{activeStage} ({currentStageMeta.title}) — KEL-{activeGroup.number}
                      </h3>
                    </div>
                    <span
                      className="tabular-nums"
                      style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}
                    >
                      {completedCount} dari {totalCount} tuntas
                    </span>
                  </div>

                  <div className="checklist-rows-container">
                    {activeStageTasks.map((task) => {
                      const isDone = task.status === 'selesai';
                      const isCurrent = task.status === 'sekarang';

                      return (
                        <div
                          key={task.id}
                          className={`checklist-row-item ${isCurrent ? 'is-current' : ''}`}
                          onClick={() => {
                            if (isCurrent && activeStage === 4) {
                              dropzoneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                          }}
                        >
                          <div className="checklist-left-group">
                            {isDone ? (
                              <div className="task-status-symbol is-done">
                                <svg
                                  width="13"
                                  height="13"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </div>
                            ) : isCurrent ? (
                              <div className="task-status-symbol is-active-ring">
                                <span
                                  style={{
                                    width: 7,
                                    height: 7,
                                    borderRadius: 999,
                                    background: '#D7141F',
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="task-status-symbol is-pending-dot">
                                <span
                                  style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: 999,
                                    background: '#64748B',
                                  }}
                                />
                              </div>
                            )}
                            <span className="task-title-text">{task.title}</span>
                          </div>
                          {isCurrent && <span className="badge-task-now">Sekarang</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigasi Antar Tahap (01 s/d 06) */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: 10,
                      borderTop: '1px solid var(--border-hairline)',
                    }}
                  >
                    <button
                      type="button"
                      disabled={activeStage === 1}
                      onClick={() =>
                        setActiveStage((prev) => Math.max(1, prev - 1) as 1 | 2 | 3 | 4 | 5 | 6)
                      }
                      style={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: activeStage === 1 ? 'var(--text-muted)' : 'var(--text-ink)',
                        opacity: activeStage === 1 ? 0.45 : 1,
                        cursor: activeStage === 1 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      ← Tahap Sebelumnya
                    </button>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                      Tahap 0{activeStage} dari 06
                    </span>
                    <button
                      type="button"
                      disabled={activeStage === 6}
                      onClick={() =>
                        setActiveStage((prev) => Math.min(6, prev + 1) as 1 | 2 | 3 | 4 | 5 | 6)
                      }
                      style={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: activeStage === 6 ? 'var(--text-muted)' : 'var(--color-brand)',
                        opacity: activeStage === 6 ? 0.45 : 1,
                        cursor: activeStage === 6 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Tahap Berikutnya →
                    </button>
                  </div>
                </div>

                {/* 3c. KARTU ANGGOTA TIM KELOMPOK */}
                <div className="stage-checklist-card" ref={membersSectionRef}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span className="eyebrow-label">Anggota Tim & Publikasi</span>
                      <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-ink)' }}>
                        Relawan KEL-{activeGroup.number} ({activeGroup.schoolName})
                      </h3>
                    </div>
                    <span
                      className="tabular-nums"
                      style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}
                    >
                      {members.filter((m) => m.status === 'valid').length} / {members.length} Terverifikasi
                    </span>
                  </div>

                  <div className="checklist-rows-container">
                    {members.map((member) => (
                      <div key={member.id} className="checklist-row-item">
                        <div className="checklist-left-group">
                          <div
                            className="user-avatar-circle"
                            style={{
                              width: 28,
                              height: 28,
                              fontSize: 11,
                              backgroundColor:
                                member.status === 'valid' ? 'var(--stage-done)' : 'var(--text-muted)',
                            }}
                          >
                            {member.initials}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}>
                            <span className="task-title-text" style={{ fontWeight: 700 }}>
                              {member.name}
                            </span>
                            <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                              {member.role} {member.instagramUrl ? `• ${member.instagramUrl}` : ''}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleMemberStatus(member.id)}
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: 999,
                            backgroundColor:
                              member.status === 'valid' ? 'var(--stage-done-tint)' : 'var(--status-review-bg)',
                            color:
                              member.status === 'valid' ? 'var(--stage-done)' : 'var(--status-review-text)',
                            border: '1px solid',
                            borderColor:
                              member.status === 'valid' ? 'var(--stage-done-border)' : '#FDE68A',
                          }}
                        >
                          {member.status === 'valid' ? 'Valid' : 'Verifikasi'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* KOLOM KANAN: STICKY WIDGETS */}
              <div className="right-widgets-column">
                {/* 4a. Kartu Ringkasan Tahap */}
                <div className="summary-stage-card">
                  <span className="eyebrow-label">Tenggat Waktu Tahap</span>

                  <div className="countdown-radial-box">
                    <div className="radial-svg-wrap">
                      <svg width="68" height="68">
                        <circle cx="34" cy="34" r="28" fill="none" stroke="#E8ECF2" strokeWidth="5" />
                        <circle
                          cx="34"
                          cy="34"
                          r="28"
                          fill="none"
                          stroke="#D7141F"
                          strokeWidth="5"
                          strokeDasharray="175"
                          strokeDashoffset={radialOffset}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="radial-center-number tabular-nums">
                        {diffDays === 0 ? '✓' : diffDays}
                      </div>
                    </div>
                    <div className="countdown-text-col">
                      <span className="countdown-days-big">
                        {diffDays === 0 ? 'Tahap Tuntas' : `${diffDays} hari lagi`}
                      </span>
                      <span className="countdown-deadline-sub">
                        Batas: <strong>{currentStageMeta.deadlineText}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Bar Progres Tunggal */}
                  <div className="single-progress-wrap">
                    <div className="progress-bar-label-row">
                      <span>Progres Tahap Ini</span>
                      <span className="tabular-nums">{progressPct}%</span>
                    </div>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
                    </div>
                    <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                      {completedCount} dari {totalCount} tugas selesai
                    </span>
                  </div>

                  {/* Baris Pembimbing */}
                  <div className="supervisor-pill-row">
                    <div className="supervisor-left">
                      <div className="supervisor-avatar">{mentorInitials}</div>
                      <div>
                        <div className="supervisor-name">{activeGroup.mentorName}</div>
                        <div className="supervisor-role">Guru Pembimbing</div>
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                        `Halo ${activeGroup.mentorName}, saya ${userDisplayName} dari Kelompok ${activeGroup.number} (${activeGroup.schoolName})...`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-wa-round"
                      title="WhatsApp Pembimbing"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* 4b. Kartu Info Accordion */}
                <div className="info-accordion-card">
                  <div className="accordion-item-row">
                    <button
                      type="button"
                      className="accordion-trigger-btn"
                      onClick={() => setOpenBriefing(!openBriefing)}
                    >
                      <div className="accordion-left-tag">
                        <span className="eyebrow-label" style={{ fontSize: 10, color: 'var(--color-brand)' }}>
                          Pengumuman Pusat
                        </span>
                        <span>Briefing Teknis Mengajar</span>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {openBriefing && (
                      <div className="accordion-content-panel">
                        Kamis, 12 Feb 2026, pukul 08.30 WIB di Aula Lt. 3 Skomda. Dihadiri seluruh ketua
                        kelompok dan divisi kurikulum.
                      </div>
                    )}
                  </div>

                  <div className="accordion-item-row">
                    <button
                      type="button"
                      className="accordion-trigger-btn"
                      onClick={() => {
                        setOpenMemo(!openMemo);
                        setUnreadMemo(false);
                      }}
                    >
                      <div className="accordion-left-tag">
                        <span className="eyebrow-label" style={{ fontSize: 10, color: '#D97706' }}>
                          Catatan Pembimbing
                          {unreadMemo && <span className="new-indicator-dot" />}
                        </span>
                        <span>Penataan Roll Banner di {activeGroup.schoolName}</span>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {openMemo && (
                      <div className="accordion-content-panel">
                        {activeGroup.notes || supervisorMemo}
                      </div>
                    )}
                  </div>
                </div>

                {/* 4c. Baris Bantuan Ringkas */}
                <div className="support-footer-row">
                  Butuh bantuan?{' '}
                  <a
                    href="#panduan"
                    onClick={(e) => {
                      e.preventDefault();
                      setBleedModalOpen(true);
                    }}
                  >
                    Panduan cetak X-Banner
                  </a>{' '}
                  •{' '}
                  <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer">
                    Hubungi koordinator
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ─── POPOVER "APA ITU BLEED?" ─────────────────────────────────────────── */}
      {bleedModalOpen && (
        <div
          className="popover-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setBleedModalOpen(false);
          }}
        >
          <div className="popover-card-box" role="dialog" aria-modal="true">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-ink)' }}>
                Spesifikasi Bleed &amp; Mata Ayam
              </h3>
              <button
                type="button"
                onClick={() => setBleedModalOpen(false)}
                style={{ color: 'var(--text-muted)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: 14,
                textAlign: 'center',
              }}
            >
              <svg width="100%" height="160" viewBox="0 0 320 160">
                <rect
                  x="20"
                  y="10"
                  width="280"
                  height="140"
                  fill="#FFF1F2"
                  stroke="#D7141F"
                  strokeWidth="2"
                  strokeDasharray="4"
                />
                <text
                  x="30"
                  y="26"
                  fontSize="9"
                  fontWeight="700"
                  fill="#D7141F"
                  fontFamily="'Plus Jakarta Sans'"
                >
                  BLEED 1 CM (Area Potong Lebih)
                </text>
                <rect x="36" y="24" width="248" height="112" fill="#FFFFFF" stroke="#0B1B3A" strokeWidth="1.5" />
                <text
                  x="46"
                  y="40"
                  fontSize="9"
                  fontWeight="700"
                  fill="#0B1B3A"
                  fontFamily="'Plus Jakarta Sans'"
                >
                  UKURAN BERSIH: 60 x 160 CM
                </text>
                <rect x="52" y="38" width="216" height="84" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
                <text
                  x="160"
                  y="85"
                  fontSize="11"
                  fontWeight="700"
                  fill="#475569"
                  textAnchor="middle"
                  fontFamily="'Plus Jakarta Sans'"
                >
                  Area Aman Teks &amp; Logo
                </text>
                <circle cx="48" cy="36" r="5" fill="#CBD5E1" stroke="#0B1B3A" strokeWidth="1.5" />
                <circle cx="272" cy="36" r="5" fill="#CBD5E1" stroke="#0B1B3A" strokeWidth="1.5" />
                <circle cx="48" cy="124" r="5" fill="#CBD5E1" stroke="#0B1B3A" strokeWidth="1.5" />
                <circle cx="272" cy="124" r="5" fill="#CBD5E1" stroke="#0B1B3A" strokeWidth="1.5" />
              </svg>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-body)', lineHeight: 1.5 }}>
              <strong>Bleed 1 cm</strong> adalah area lebihan di luar ukuran bersih agar tidak timbul tepi
              putih saat banner dipotong oleh mesin percetakan.
            </p>
            <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              <strong>Mata ayam</strong> adalah lubang cincin besi di 4 sudut banner untuk dikaitkan ke
              tiang penyangga. Pastikan teks dan logo tidak diletakkan terlalu mepet ke sudut (beri jarak
              aman 3 cm).
            </p>

            <button
              type="button"
              className="btn-upload-primary"
              onClick={() => setBleedModalOpen(false)}
              style={{ justifyContent: 'center', marginTop: 4 }}
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}

      {/* ─── RIWAYAT VERSI DRAWER ─────────────────────────────────────────────── */}
      {versionDrawerOpen && (
        <>
          <div className="version-drawer-backdrop" onClick={() => setVersionDrawerOpen(false)} />
          <aside className="version-drawer-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-ink)' }}>
                Riwayat Versi Berkas
              </h3>
              <button
                type="button"
                onClick={() => setVersionDrawerOpen(false)}
                style={{ color: 'var(--text-muted)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
              <div
                style={{
                  padding: 12,
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-hairline)',
                  backgroundColor: 'var(--bg-subtle)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 700,
                    fontSize: 13,
                    color: 'var(--text-ink)',
                  }}
                >
                  <span>Versi 2 (Aktif)</span>
                  <span style={{ color: 'var(--color-brand)' }}>Terbaru</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  X-Banner_{schoolSlug}_v2.pdf • 14.8 MB
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-body)', marginTop: 6 }}>
                  Perbaikan ukuran margin bleed dan logo SMK Telkom.
                </div>
              </div>

              <div
                style={{
                  padding: 12,
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-hairline)',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 700,
                    fontSize: 13,
                    color: 'var(--text-ink)',
                  }}
                >
                  <span>Versi 1</span>
                  <span style={{ color: 'var(--text-muted)' }}>9 Feb 2026</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  Draf_Banner_{schoolSlug}.pdf • 12.1 MB
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-body)', marginTop: 6 }}>
                  Draf awal konsep materi {activeGroup.featuredModule}.
                </div>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* ─── TOAST NOTIFICATION DENGAN 5s UNDO ────────────────────────────────── */}
      {localToast && (
        <div className="toast-container">
          <div className="toast-card">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F9D58" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span style={{ flex: 1 }}>{localToast.message}</span>
            {localToast.withUndo && (
              <>
                <button type="button" className="toast-undo-action" onClick={handleUndoSubmit}>
                  Urungkan
                </button>
                <div className="toast-progress-line" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspacePage;
