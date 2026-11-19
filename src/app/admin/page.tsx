"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';

export interface AdminGroupItem {
  id: string;
  number: string;
  smp: string;
  kecamatan: string;
  ketua: string;
  wa: string;
  jumlahSiswa: number;
  tahap: number;
  tahapName: string;
  tugasSelesai: number;
  tugasTotal: number;
  status: 'menunggu' | 'terlambat' | 'berjalan' | 'selesai' | 'belumKetua';
  menungguSejak: string;
  menungguHari: number;
  berkas: Array<{ nama: string; ukuran: string; waktu: string; versi: string }>;
  diperbaruiPada: string;
}

const STAGES_LIST = [
  { id: 1, no: '01', name: 'Bentuk Tim' },
  { id: 2, no: '02', name: 'Pilih Ketua' },
  { id: 3, no: '03', name: 'Susun Modul' },
  { id: 4, no: '04', name: 'Siapkan Desain' },
  { id: 5, no: '05', name: 'Mengajar SMP' },
  { id: 6, no: '06', name: 'Evaluasi & Nilai' },
];

const INITIAL_GROUPS: AdminGroupItem[] = [
  {
    id: 'KEL-03',
    number: '03',
    smp: 'SMPN 1 Buduran',
    kecamatan: 'Buduran',
    ketua: 'Nabila Putri Ramadhani',
    wa: '6281234567890',
    jumlahSiswa: 5,
    tahap: 4,
    tahapName: '04 Siapkan Desain',
    tugasSelesai: 4,
    tugasTotal: 6,
    status: 'menunggu',
    menungguSejak: '2 jam lalu',
    menungguHari: 0,
    berkas: [{ nama: 'X-Banner_SMPN1Buduran_v2.pdf', ukuran: '14.8 MB', waktu: '45 menit lalu', versi: 'v2' }],
    diperbaruiPada: 'Hari ini, 13:45',
  },
  {
    id: 'KEL-02',
    number: '02',
    smp: 'SMPN 1 Waru',
    kecamatan: 'Waru',
    ketua: 'Dimas Bagus Wicaksono',
    wa: '6281388991122',
    jumlahSiswa: 6,
    tahap: 3,
    tahapName: '03 Susun Modul',
    tugasSelesai: 5,
    tugasTotal: 5,
    status: 'menunggu',
    menungguSejak: '2 hari lalu',
    menungguHari: 2,
    berkas: [{ nama: 'RPP_Informatika_Waru.pdf', ukuran: '2.1 MB', waktu: '2 hari lalu', versi: 'v2' }],
    diperbaruiPada: 'Kemarin, 11:20',
  },
  {
    id: 'KEL-06',
    number: '06',
    smp: 'SMPN 1 Tulangan',
    kecamatan: 'Tulangan',
    ketua: 'Bagus Pratama Putra',
    wa: '6282144556677',
    jumlahSiswa: 6,
    tahap: 4,
    tahapName: '04 Siapkan Desain',
    tugasSelesai: 3,
    tugasTotal: 6,
    status: 'menunggu',
    menungguSejak: '3 hari lalu',
    menungguHari: 3,
    berkas: [{ nama: 'Draf_Infografis_Materi.pptx', ukuran: '7.5 MB', waktu: '3 hari lalu', versi: 'v2' }],
    diperbaruiPada: '15 Feb 2026',
  },
  {
    id: 'KEL-12',
    number: '12',
    smp: 'SMPN 2 Taman',
    kecamatan: 'Taman',
    ketua: 'Kevin Alamsyah',
    wa: '6285733221100',
    jumlahSiswa: 6,
    tahap: 4,
    tahapName: '04 Siapkan Desain',
    tugasSelesai: 2,
    tugasTotal: 6,
    status: 'menunggu',
    menungguSejak: '4 hari lalu',
    menungguHari: 4,
    berkas: [{ nama: 'Slide_Canva_WebDasar.pdf', ukuran: '9.3 MB', waktu: '4 hari lalu', versi: 'v2' }],
    diperbaruiPada: '14 Feb 2026',
  },
  {
    id: 'KEL-04',
    number: '04',
    smp: 'SMPN 2 Krian',
    kecamatan: 'Krian',
    ketua: 'Siti Nurhaliza',
    wa: '6282233445566',
    jumlahSiswa: 5,
    tahap: 3,
    tahapName: '03 Susun Modul',
    tugasSelesai: 2,
    tugasTotal: 5,
    status: 'terlambat',
    menungguSejak: '4 hari lalu',
    menungguHari: 4,
    berkas: [],
    diperbaruiPada: '14 Feb 2026',
  },
  {
    id: 'KEL-07',
    number: '07',
    smp: 'SMP Telkom Sidoarjo',
    kecamatan: 'Sidoarjo',
    ketua: 'Fahri Ramadhan',
    wa: '6281977889900',
    jumlahSiswa: 6,
    tahap: 4,
    tahapName: '04 Siapkan Desain',
    tugasSelesai: 2,
    tugasTotal: 6,
    status: 'terlambat',
    menungguSejak: '2 hari lalu',
    menungguHari: 2,
    berkas: [],
    diperbaruiPada: '16 Feb 2026',
  },
  {
    id: 'KEL-09',
    number: '09',
    smp: 'SMPN 1 Taman',
    kecamatan: 'Taman',
    ketua: 'Rian Hidayat',
    wa: '6285611223344',
    jumlahSiswa: 5,
    tahap: 3,
    tahapName: '03 Susun Modul',
    tugasSelesai: 1,
    tugasTotal: 5,
    status: 'terlambat',
    menungguSejak: '5 hari lalu',
    menungguHari: 5,
    berkas: [],
    diperbaruiPada: '13 Feb 2026',
  },
  {
    id: 'KEL-05',
    number: '05',
    smp: 'SMPN 2 Candi',
    kecamatan: 'Candi',
    ketua: 'Dewi Maharani',
    wa: '6287855667788',
    jumlahSiswa: 5,
    tahap: 3,
    tahapName: '03 Susun Modul',
    tugasSelesai: 2,
    tugasTotal: 5,
    status: 'terlambat',
    menungguSejak: '1 hari lalu',
    menungguHari: 1,
    berkas: [],
    diperbaruiPada: 'Kemarin',
  },
  {
    id: 'KEL-23',
    number: '23',
    smp: 'SMPN 2 Sedati',
    kecamatan: 'Sedati',
    ketua: '—',
    wa: '',
    jumlahSiswa: 6,
    tahap: 2,
    tahapName: '02 Pilih Ketua',
    tugasSelesai: 0,
    tugasTotal: 3,
    status: 'belumKetua',
    menungguSejak: '6 hari lalu',
    menungguHari: 6,
    berkas: [],
    diperbaruiPada: '12 Feb 2026',
  },
  {
    id: 'KEL-24',
    number: '24',
    smp: 'SMPN 4 Sidoarjo',
    kecamatan: 'Sidoarjo',
    ketua: '—',
    wa: '',
    jumlahSiswa: 6,
    tahap: 2,
    tahapName: '02 Pilih Ketua',
    tugasSelesai: 0,
    tugasTotal: 3,
    status: 'belumKetua',
    menungguSejak: '6 hari lalu',
    menungguHari: 6,
    berkas: [],
    diperbaruiPada: '12 Feb 2026',
  },
  {
    id: 'KEL-01',
    number: '01',
    smp: 'SMPN 1 Sidoarjo',
    kecamatan: 'Sidoarjo',
    ketua: 'Raffi Akbar Pratama',
    wa: '6281122334455',
    jumlahSiswa: 5,
    tahap: 4,
    tahapName: '04 Siapkan Desain',
    tugasSelesai: 5,
    tugasTotal: 6,
    status: 'berjalan',
    menungguSejak: 'Kemarin',
    menungguHari: 1,
    berkas: [],
    diperbaruiPada: 'Kemarin',
  },
  {
    id: 'KEL-08',
    number: '08',
    smp: 'SMPN 2 Sukodono',
    kecamatan: 'Sukodono',
    ketua: 'Putri Ayu Wandira',
    wa: '6281377665544',
    jumlahSiswa: 5,
    tahap: 4,
    tahapName: '04 Siapkan Desain',
    tugasSelesai: 5,
    tugasTotal: 6,
    status: 'berjalan',
    menungguSejak: 'Kemarin',
    menungguHari: 1,
    berkas: [],
    diperbaruiPada: 'Kemarin',
  },
  {
    id: 'KEL-10',
    number: '10',
    smp: 'SMP Hang Tuah 5',
    kecamatan: 'Candi',
    ketua: 'Kevin Sanjaya',
    wa: '6285299887766',
    jumlahSiswa: 5,
    tahap: 4,
    tahapName: '04 Siapkan Desain',
    tugasSelesai: 4,
    tugasTotal: 6,
    status: 'berjalan',
    menungguSejak: 'Kemarin',
    menungguHari: 1,
    berkas: [],
    diperbaruiPada: 'Kemarin',
  },
  {
    id: 'KEL-11',
    number: '11',
    smp: 'SMPN 3 Porong',
    kecamatan: 'Porong',
    ketua: 'Zidan Maulana',
    wa: '6282311447788',
    jumlahSiswa: 5,
    tahap: 4,
    tahapName: '04 Siapkan Desain',
    tugasSelesai: 4,
    tugasTotal: 6,
    status: 'berjalan',
    menungguSejak: 'Kemarin',
    menungguHari: 1,
    berkas: [],
    diperbaruiPada: 'Kemarin',
  },
  {
    id: 'KEL-13',
    number: '13',
    smp: 'SMP Proklamasi Porong',
    kecamatan: 'Porong',
    ketua: 'Aulia Rahman',
    wa: '6289533445566',
    jumlahSiswa: 5,
    tahap: 4,
    tahapName: '04 Siapkan Desain',
    tugasSelesai: 4,
    tugasTotal: 6,
    status: 'berjalan',
    menungguSejak: 'Kemarin',
    menungguHari: 1,
    berkas: [],
    diperbaruiPada: 'Kemarin',
  },
  {
    id: 'KEL-14',
    number: '14',
    smp: 'SMPN 1 Sedati',
    kecamatan: 'Sedati',
    ketua: 'Anisa Rahmawati',
    wa: '6281277882233',
    jumlahSiswa: 5,
    tahap: 5,
    tahapName: '05 Mengajar SMP',
    tugasSelesai: 1,
    tugasTotal: 4,
    status: 'berjalan',
    menungguSejak: 'Kemarin',
    menungguHari: 1,
    berkas: [],
    diperbaruiPada: 'Kemarin',
  },
  {
    id: 'KEL-15',
    number: '15',
    smp: 'SMPN 2 Gedangan',
    kecamatan: 'Gedangan',
    ketua: 'Rizal Fauzi',
    wa: '6281344559900',
    jumlahSiswa: 5,
    tahap: 5,
    tahapName: '05 Mengajar SMP',
    tugasSelesai: 2,
    tugasTotal: 4,
    status: 'berjalan',
    menungguSejak: 'Kemarin',
    menungguHari: 1,
    berkas: [],
    diperbaruiPada: 'Kemarin',
  },
  {
    id: 'KEL-16',
    number: '16',
    smp: 'SMP PGRI 1 Buduran',
    kecamatan: 'Buduran',
    ketua: 'Doni Firmansyah',
    wa: '6285866778899',
    jumlahSiswa: 5,
    tahap: 5,
    tahapName: '05 Mengajar SMP',
    tugasSelesai: 2,
    tugasTotal: 4,
    status: 'berjalan',
    menungguSejak: 'Kemarin',
    menungguHari: 1,
    berkas: [],
    diperbaruiPada: 'Kemarin',
  },
  {
    id: 'KEL-17',
    number: '17',
    smp: 'SMPN 1 Krembung',
    kecamatan: 'Krembung',
    ketua: 'Fandi Ahmad',
    wa: '6281299001122',
    jumlahSiswa: 5,
    tahap: 5,
    tahapName: '05 Mengajar SMP',
    tugasSelesai: 3,
    tugasTotal: 4,
    status: 'berjalan',
    menungguSejak: 'Kemarin',
    menungguHari: 1,
    berkas: [],
    diperbaruiPada: 'Kemarin',
  },
  {
    id: 'KEL-18',
    number: '18',
    smp: 'SMPN 2 Porong',
    kecamatan: 'Porong',
    ketua: 'Hendra Setiawan',
    wa: '6282133448899',
    jumlahSiswa: 5,
    tahap: 6,
    tahapName: '06 Evaluasi & Nilai',
    tugasSelesai: 4,
    tugasTotal: 4,
    status: 'selesai',
    menungguSejak: '2 hari lalu',
    menungguHari: 2,
    berkas: [],
    diperbaruiPada: '16 Feb 2026',
  },
  {
    id: 'KEL-19',
    number: '19',
    smp: 'SMPN 1 Tarik',
    kecamatan: 'Tarik',
    ketua: 'Indra Djati',
    wa: '6285744332211',
    jumlahSiswa: 5,
    tahap: 6,
    tahapName: '06 Evaluasi & Nilai',
    tugasSelesai: 4,
    tugasTotal: 4,
    status: 'selesai',
    menungguSejak: '3 hari lalu',
    menungguHari: 3,
    berkas: [],
    diperbaruiPada: '15 Feb 2026',
  },
  {
    id: 'KEL-20',
    number: '20',
    smp: 'SMPN 2 Prambon',
    kecamatan: 'Prambon',
    ketua: 'Joko Anwar',
    wa: '6281322119988',
    jumlahSiswa: 5,
    tahap: 3,
    tahapName: '03 Susun Modul',
    tugasSelesai: 4,
    tugasTotal: 5,
    status: 'berjalan',
    menungguSejak: 'Kemarin',
    menungguHari: 1,
    berkas: [],
    diperbaruiPada: 'Kemarin',
  },
  {
    id: 'KEL-21',
    number: '21',
    smp: 'SMP Muhammadiyah 1',
    kecamatan: 'Sidoarjo',
    ketua: 'Kiki Narendra',
    wa: '6287811224455',
    jumlahSiswa: 5,
    tahap: 3,
    tahapName: '03 Susun Modul',
    tugasSelesai: 4,
    tugasTotal: 5,
    status: 'berjalan',
    menungguSejak: 'Kemarin',
    menungguHari: 1,
    berkas: [],
    diperbaruiPada: 'Kemarin',
  },
  {
    id: 'KEL-22',
    number: '22',
    smp: 'SMP YPM 1 Taman',
    kecamatan: 'Taman',
    ketua: 'Lukman Sardi',
    wa: '6281244668800',
    jumlahSiswa: 5,
    tahap: 4,
    tahapName: '04 Siapkan Desain',
    tugasSelesai: 3,
    tugasTotal: 6,
    status: 'berjalan',
    menungguSejak: 'Kemarin',
    menungguHari: 1,
    berkas: [],
    diperbaruiPada: 'Kemarin',
  },
];

const RECENT_ACTIVITIES = [
  { group: 'KEL-03', text: 'mengunggah X-Banner v2', time: '45m lalu', icon: 'file' },
  { group: 'KEL-02', text: 'mengajukan RPP modul ajar', time: '2j lalu', icon: 'file' },
  { group: 'KEL-06', text: 'memperbarui draf infografis', time: '3j lalu', icon: 'file' },
  { group: 'KEL-12', text: 'mengunggah slide Canva', time: '4j lalu', icon: 'file' },
  { group: 'Pak Indra', text: 'menyetujui modul KEL-01', time: 'Kemarin', icon: 'check' },
];

type TabKey = 'semua' | 'review' | 'overdue' | 'unassigned';
type SortColumn = 'id' | 'ketua' | 'tahap' | 'menungguHari';

export const AdminMonitoringPage: React.FC = () => {
  const { navigate, currentUser, authToken, logout, setIsBannerModalOpen, submitBannerDecision } = useApp();

  const adminDisplayName =
    currentUser?.name && currentUser.name !== 'Admin Kurikulum'
      ? currentUser.name
      : 'Pak Indra';
  const adminInitials = adminDisplayName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] || '')
    .join('')
    .toUpperCase();

  // Sidebar & navigation state
  const [isRail, setIsRail] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarRoute, setSidebarRoute] = useState<string>('kelompok');

  // Master groups state
  const [groups, setGroups] = useState<AdminGroupItem[]>(INITIAL_GROUPS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentTab, setCurrentTab] = useState<TabKey>('semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState<number | null>(null);
  const [sortCol, setSortCol] = useState<SortColumn>('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'matrix'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sync chip state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncText, setSyncText] = useState('Tersinkron 2 menit lalu');

  // Drawer state
  const [drawerGroupId, setDrawerGroupId] = useState<string | null>(null);
  const [drawerNotes, setDrawerNotes] = useState('');

  // Command palette state
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState('');

  // CRUD Modal State (Create / Edit / Delete)
  const [crudModalOpen, setCrudModalOpen] = useState(false);
  const [crudMode, setCrudMode] = useState<'create' | 'edit'>('create');
  const [editingOriginalId, setEditingOriginalId] = useState<string | null>(null);
  const [crudForm, setCrudForm] = useState<{
    number: string;
    smp: string;
    kecamatan: string;
    ketua: string;
    wa: string;
    jumlahSiswa: number;
    tahap: number;
    tugasSelesai: number;
    tugasTotal: number;
    status: AdminGroupItem['status'];
  }>({
    number: '25',
    smp: '',
    kecamatan: 'Sidoarjo',
    ketua: '',
    wa: '',
    jumlahSiswa: 6,
    tahap: 1,
    tugasSelesai: 0,
    tugasTotal: 6,
    status: 'berjalan',
  });
  const [deleteConfirmGroup, setDeleteConfirmGroup] = useState<AdminGroupItem | null>(null);

  // Local Toast with 5s Undo
  const [adminToast, setAdminToast] = useState<{
    id: number;
    message: string;
    undoFn?: () => void;
  } | null>(null);

  const tableSectionRef = useRef<HTMLElement | null>(null);

  const triggerAdminToast = (message: string, undoFn?: () => void) => {
    const id = Date.now();
    setAdminToast({ id, message, undoFn });
    setTimeout(() => {
      setAdminToast((prev) => (prev?.id === id ? null : prev));
    }, 5000);
  };

  // Global Ctrl+K / Escape listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
      } else if (e.key === 'Escape') {
        setPaletteOpen(false);
        setDrawerGroupId(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const currentDateIndo = useMemo(() => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  }, []);

  // KPI Counts
  const totalCount = groups.length;
  const reviewCount = groups.filter((g) => g.status === 'menunggu').length;
  const overdueCount = groups.filter((g) => g.status === 'terlambat').length;
  const unassignedCount = groups.filter((g) => g.status === 'belumKetua').length;

  // Filtered & Sorted Groups
  const filteredGroups = useMemo(() => {
    const list = groups.filter((grp) => {
      if (currentTab === 'review' && grp.status !== 'menunggu') return false;
      if (currentTab === 'overdue' && grp.status !== 'terlambat') return false;
      if (currentTab === 'unassigned' && grp.status !== 'belumKetua') return false;
      if (filterStage !== null && grp.tahap !== filterStage) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const match =
          grp.id.toLowerCase().includes(q) ||
          grp.smp.toLowerCase().includes(q) ||
          grp.kecamatan.toLowerCase().includes(q) ||
          grp.ketua.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });

    list.sort((a, b) => {
      const valA = a[sortCol];
      const valB = b[sortCol];
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDir === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return sortDir === 'asc'
        ? Number(valA) - Number(valB)
        : Number(valB) - Number(valA);
    });
    return list;
  }, [groups, currentTab, filterStage, searchTerm, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredGroups.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * rowsPerPage;
  const paginatedGroups = filteredGroups.slice(startIndex, startIndex + rowsPerPage);

  const activeDrawerGroup = useMemo(
    () => (drawerGroupId ? groups.find((g) => g.id === drawerGroupId) || null : null),
    [groups, drawerGroupId]
  );

  const handleSort = (col: SortColumn) => {
    if (sortCol === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  const toggleRowSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredGroups.length && filteredGroups.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredGroups.map((g) => g.id)));
    }
  };

  const handleDrawerDecision = (decision: 'approved' | 'revision') => {
    if (!activeDrawerGroup) return;
    const grpId = activeDrawerGroup.id;
    const prevStatus = activeDrawerGroup.status;
    const prevTugas = activeDrawerGroup.tugasSelesai;
    const nextStatus = decision === 'approved' ? 'selesai' : 'terlambat';

    setGroups((prev) =>
      prev.map((g) =>
        g.id === grpId
          ? {
              ...g,
              status: nextStatus,
              tugasSelesai:
                decision === 'approved' ? Math.min(g.tugasTotal, g.tugasSelesai + 1) : g.tugasSelesai,
            }
          : g
      )
    );

    if (grpId === 'KEL-03') {
      submitBannerDecision(decision, drawerNotes);
    }

    setDrawerGroupId(null);
    setDrawerNotes('');

    triggerAdminToast(
      decision === 'approved'
        ? `Berkas ${grpId} berhasil disetujui!`
        : `Catatan revisi dikirim ke ketua ${grpId}.`,
      () => {
        setGroups((prev) =>
          prev.map((g) =>
            g.id === grpId ? { ...g, status: prevStatus, tugasSelesai: prevTugas } : g
          )
        );
        triggerAdminToast(`Status ${grpId} dikembalikan.`);
      }
    );
  };

  const handleBulkApprove = () => {
    const count = selectedIds.size;
    if (count === 0) return;
    setGroups((prev) =>
      prev.map((g) => (selectedIds.has(g.id) ? { ...g, status: 'selesai' } : g))
    );
    setSelectedIds(new Set());
    triggerAdminToast(`${count} berkas kelompok disetujui sekaligus!`);
  };

  // ─── CRUD HANDLERS (CREATE, UPDATE, DELETE) ─────────────────────────────────
  const openCreateModal = () => {
    const maxNum = groups.reduce((max, g) => {
      const n = Number.parseInt(g.number, 10);
      return Number.isNaN(n) ? max : Math.max(max, n);
    }, 0);
    const nextNum = String(maxNum + 1).padStart(2, '0');
    setCrudMode('create');
    setEditingOriginalId(null);
    setCrudForm({
      number: nextNum,
      smp: '',
      kecamatan: 'Sidoarjo',
      ketua: '',
      wa: '',
      jumlahSiswa: 6,
      tahap: 1,
      tugasSelesai: 0,
      tugasTotal: 6,
      status: 'berjalan',
    });
    setCrudModalOpen(true);
  };

  const openEditModal = (grp: AdminGroupItem) => {
    setCrudMode('edit');
    setEditingOriginalId(grp.id);
    setCrudForm({
      number: grp.number,
      smp: grp.smp,
      kecamatan: grp.kecamatan,
      ketua: grp.ketua === '—' ? '' : grp.ketua,
      wa: grp.wa,
      jumlahSiswa: grp.jumlahSiswa,
      tahap: grp.tahap,
      tugasSelesai: grp.tugasSelesai,
      tugasTotal: grp.tugasTotal,
      status: grp.status,
    });
    setCrudModalOpen(true);
  };

  const handleSaveCrudForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = String(Number.parseInt(crudForm.number.trim() || '1', 10) || 1).padStart(2, '0');
    const newId = `KEL-${cleanNum}`;
    const stageObj = STAGES_LIST.find((s) => s.id === Number(crudForm.tahap)) || STAGES_LIST[0];
    const tahapName = `${stageObj.no} ${stageObj.name}`;
    const leaderVal = crudForm.ketua.trim() || '—';
    const finalStatus: AdminGroupItem['status'] =
      leaderVal === '—' && crudForm.status !== 'belumKetua' ? 'belumKetua' : crudForm.status;

    if (crudMode === 'create') {
      if (groups.some((g) => g.id === newId || g.number === cleanNum)) {
        triggerAdminToast(`Gagal: ${newId} sudah terdaftar!`);
        return;
      }
      const createdItem: AdminGroupItem = {
        id: newId,
        number: cleanNum,
        smp: crudForm.smp.trim(),
        kecamatan: crudForm.kecamatan.trim() || 'Sidoarjo',
        ketua: leaderVal,
        wa: crudForm.wa.trim().replace(/^\+/, ''),
        jumlahSiswa: Number(crudForm.jumlahSiswa) || 5,
        tahap: stageObj.id,
        tahapName,
        tugasSelesai: Number(crudForm.tugasSelesai) || 0,
        tugasTotal: Math.max(1, Number(crudForm.tugasTotal) || 6),
        status: finalStatus,
        menungguSejak: 'Baru saja',
        menungguHari: 0,
        berkas: [],
        diperbaruiPada: 'Baru saja',
      };
      setGroups((prev) => [createdItem, ...prev]);
      setCrudModalOpen(false);
      triggerAdminToast(`${newId} (${createdItem.smp}) berhasil ditambahkan!`);

      if (authToken) {
        try {
          await fetch('/api/groups', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              number: cleanNum,
              schoolName: createdItem.smp,
              district: createdItem.kecamatan,
              leaderName: createdItem.ketua,
              memberCount: createdItem.jumlahSiswa,
              currentStep: createdItem.tahap,
              status:
                finalStatus === 'menunggu'
                  ? 'review'
                  : finalStatus === 'terlambat'
                  ? 'overdue'
                  : 'ontrack',
              statusLabel:
                finalStatus === 'menunggu'
                  ? 'Menunggu Review'
                  : finalStatus === 'terlambat'
                  ? 'Terlambat'
                  : 'Sesuai Jadwal',
            }),
          });
        } catch {
          // Local state already updated
        }
      }
    } else {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === editingOriginalId
            ? {
                ...g,
                id: newId,
                number: cleanNum,
                smp: crudForm.smp.trim(),
                kecamatan: crudForm.kecamatan.trim() || 'Sidoarjo',
                ketua: leaderVal,
                wa: crudForm.wa.trim().replace(/^\+/, ''),
                jumlahSiswa: Number(crudForm.jumlahSiswa) || 5,
                tahap: stageObj.id,
                tahapName,
                tugasSelesai: Number(crudForm.tugasSelesai) || 0,
                tugasTotal: Math.max(1, Number(crudForm.tugasTotal) || 6),
                status: finalStatus,
                diperbaruiPada: 'Baru saja',
              }
            : g
        )
      );
      if (drawerGroupId === editingOriginalId) {
        setDrawerGroupId(newId);
      }
      setCrudModalOpen(false);
      triggerAdminToast(`Data ${newId} (${crudForm.smp.trim()}) berhasil diperbarui!`);

      if (authToken) {
        try {
          await fetch(`/api/groups/${cleanNum}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              schoolName: crudForm.smp.trim(),
              district: crudForm.kecamatan.trim(),
              leaderName: leaderVal,
              memberCount: Number(crudForm.jumlahSiswa) || 5,
              currentStep: stageObj.id,
              status:
                finalStatus === 'menunggu'
                  ? 'review'
                  : finalStatus === 'terlambat'
                  ? 'overdue'
                  : 'ontrack',
            }),
          });
        } catch {
          // Local state already updated
        }
      }
    }
  };

  const handleConfirmDeleteGroup = async (grp: AdminGroupItem) => {
    const deletedSnapshot = grp;
    setGroups((prev) => prev.filter((g) => g.id !== grp.id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(grp.id);
      return next;
    });
    if (drawerGroupId === grp.id) {
      setDrawerGroupId(null);
    }
    setDeleteConfirmGroup(null);

    if (authToken) {
      try {
        await fetch(`/api/groups/${grp.number}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authToken}` },
        });
      } catch {
        // Local state already updated
      }
    }

    triggerAdminToast(`${grp.id} (${grp.smp}) telah dihapus.`, () => {
      setGroups((prev) => [deletedSnapshot, ...prev]);
      triggerAdminToast(`Penghapusan ${deletedSnapshot.id} dibatalkan.`);
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    const removedItems = groups.filter((g) => selectedIds.has(g.id));
    const count = removedItems.length;
    setGroups((prev) => prev.filter((g) => !selectedIds.has(g.id)));
    setSelectedIds(new Set());

    if (authToken) {
      for (const item of removedItems) {
        void fetch(`/api/groups/${item.number}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authToken}` },
        });
      }
    }

    triggerAdminToast(`${count} kelompok telah dihapus.`, () => {
      setGroups((prev) => [...removedItems, ...prev]);
      triggerAdminToast(`${count} kelompok dikembalikan.`);
    });
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'SMP', 'Kecamatan', 'Ketua', 'Tahap', 'Progres', 'Status'];
    const rows = filteredGroups.map((g) => [
      g.id,
      g.smp,
      g.kecamatan,
      g.ketua,
      g.tahapName,
      `${g.tugasSelesai}/${g.tugasTotal}`,
      g.status,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Rekap_Kelompok_Skomda_Mengajar_2026.csv';
    link.click();
    URL.revokeObjectURL(url);
    triggerAdminToast('File CSV rekapitulasi kelompok berhasil diunduh!');
  };

  const paletteMatches = useMemo(() => {
    const q = paletteQuery.toLowerCase().trim();
    return groups
      .filter(
        (g) =>
          !q ||
          g.id.toLowerCase().includes(q) ||
          g.smp.toLowerCase().includes(q) ||
          g.ketua.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [groups, paletteQuery]);

  return (
    <div className="admin2026-root">
      <style>{`
        .admin2026-root {
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
          --status-review-bg: #FFF7E6;
          --status-review-text: #92400E;
          --status-review-dot: #D97706;
          --status-overdue-bg: #FEF2F2;
          --status-overdue-text: #B42318;
          --status-overdue-dot: #DC2626;
          --status-done-bg: #ECFDF3;
          --status-done-text: #067647;
          --status-done-dot: #16A34A;
          --status-progress-bg: #EFF6FF;
          --status-progress-text: #1D4ED8;
          --status-progress-dot: #2563EB;
          --status-unassigned-bg: #F1F5F9;
          --status-unassigned-text: #475569;
          --status-unassigned-dot: #94A3B8;
          --radius-sm: 8px;
          --radius-md: 10px;
          --radius-lg: 12px;
          --radius-card: 16px;
          --radius-pill: 9999px;
          --shadow-sm: 0 1px 2px rgba(11, 27, 58, 0.04);
          --shadow-hover: 0 4px 12px rgba(11, 27, 58, 0.06);
          --shadow-elevation: 0 20px 40px -8px rgba(11, 27, 58, 0.12), 0 0 0 1px rgba(232, 236, 242, 0.8);
          --shadow-toast: 0 12px 28px -4px rgba(11, 27, 58, 0.16);
          --ease-standard: cubic-bezier(0.22, 1, 0.36, 1);
          --duration-fast: 150ms;
          --duration-normal: 250ms;
          --sidebar-width: 248px;
          --sidebar-rail-width: 72px;
          --topbar-height: 64px;

          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: var(--text-body);
          background-color: var(--bg-canvas);
          min-height: 100vh;
        }
        .admin2026-root *, .admin2026-root *::before, .admin2026-root *::after {
          box-sizing: border-box;
        }
        .admin2026-root button {
          background: none;
          border: none;
          cursor: pointer;
          user-select: none;
          font: inherit;
        }
        .admin2026-root .tabular-nums {
          font-variant-numeric: tabular-nums;
        }
        .admin2026-root .app-shell {
          display: flex;
          min-height: 100vh;
          background-color: var(--bg-canvas);
        }
        .admin2026-root .app-sidebar {
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
        .admin2026-root .app-sidebar.is-rail {
          width: var(--sidebar-rail-width);
        }
        .admin2026-root .sidebar-header {
          height: var(--topbar-height);
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-hairline);
        }
        .admin2026-root .brand-mark {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
          white-space: nowrap;
          cursor: pointer;
        }
        .admin2026-root .brand-logo-box {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-md);
          background-color: var(--color-brand);
          color: #FFFFFF;
          font-weight: 800;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .admin2026-root .brand-details {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        .admin2026-root .app-sidebar.is-rail .brand-details {
          display: none;
        }
        .admin2026-root .brand-name {
          font-weight: 700;
          font-size: 14px;
          color: var(--text-ink);
        }
        .admin2026-root .brand-badge {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 500;
        }
        .admin2026-root .btn-collapse-sidebar {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          border: 1px solid var(--border-hairline);
          background-color: var(--bg-canvas);
        }
        .admin2026-root .sidebar-nav-container {
          flex: 1;
          padding: 16px 10px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .admin2026-root .nav-group-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: var(--text-muted);
          padding: 0 10px 4px 10px;
        }
        .admin2026-root .app-sidebar.is-rail .nav-group-title {
          display: none;
        }
        .admin2026-root .nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin: 0;
          padding: 0;
        }
        .admin2026-root .nav-item-link {
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
        .admin2026-root .nav-item-link:hover {
          background-color: var(--bg-subtle);
          color: var(--text-ink);
        }
        .admin2026-root .nav-item-link.is-active {
          background-color: var(--color-brand-tint);
          color: var(--color-brand);
          font-weight: 700;
        }
        .admin2026-root .nav-item-link.is-active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 6px;
          bottom: 6px;
          width: 3px;
          border-radius: 0 3px 3px 0;
          background-color: var(--color-brand);
        }
        .admin2026-root .nav-left-content {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }
        .admin2026-root .nav-icon {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          stroke-width: 1.75;
        }
        .admin2026-root .app-sidebar.is-rail .nav-label,
        .admin2026-root .app-sidebar.is-rail .nav-badge {
          display: none;
        }
        .admin2026-root .nav-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 1px 7px;
          border-radius: var(--radius-pill);
          background-color: var(--bg-hover);
          color: var(--text-muted);
        }
        .admin2026-root .nav-badge.badge-amber {
          background-color: var(--status-review-bg);
          color: var(--status-review-text);
        }
        .admin2026-root .sidebar-footer {
          padding: 12px 14px;
          border-top: 1px solid var(--border-hairline);
          display: flex;
          flex-direction: column;
          gap: 8px;
          background-color: var(--bg-canvas);
        }
        .admin2026-root .user-profile-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 6px 4px;
        }
        .admin2026-root .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-pill);
          background-color: var(--text-ink);
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
        }
        .admin2026-root .user-avatar::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 8px;
          height: 8px;
          border-radius: var(--radius-pill);
          background-color: #10B981;
          border: 1.5px solid #FFFFFF;
        }
        .admin2026-root .user-info {
          display: flex;
          flex-direction: column;
          line-height: 1.25;
          overflow: hidden;
        }
        .admin2026-root .app-sidebar.is-rail .user-info {
          display: none;
        }
        .admin2026-root .user-name {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-ink);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .admin2026-root .user-role {
          font-size: 11px;
          color: var(--text-muted);
        }
        .admin2026-root .btn-return-home {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 600;
          padding: 6px 4px;
          border-radius: var(--radius-sm);
        }
        .admin2026-root .btn-return-home:hover {
          color: var(--color-brand);
        }
        .admin2026-root .app-sidebar.is-rail .btn-return-home span {
          display: none;
        }
        .admin2026-root .app-main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-canvas);
        }
        .admin2026-root .app-topbar {
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
          gap: 24px;
        }
        .admin2026-root .topbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 180px;
        }
        .admin2026-root .mobile-nav-toggle {
          display: none;
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          align-items: center;
          justify-content: center;
          color: var(--text-ink);
          border: 1px solid var(--border-hairline);
        }
        .admin2026-root .breadcrumb {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .admin2026-root .breadcrumb strong {
          color: var(--text-ink);
          font-weight: 700;
        }
        .admin2026-root .topbar-center {
          flex: 1;
          max-width: 480px;
        }
        .admin2026-root .global-search-btn {
          width: 100%;
          height: 40px;
          border: 1px solid var(--border-hairline);
          border-radius: var(--radius-lg);
          background-color: var(--bg-subtle);
          padding: 0 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: var(--text-muted);
          font-size: 13px;
        }
        .admin2026-root .global-search-btn:hover {
          background-color: #FFFFFF;
          border-color: #CBD5E1;
          color: var(--text-body);
        }
        .admin2026-root .search-left-hint {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .admin2026-root .search-kbd-hint {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: var(--radius-sm);
          background-color: #FFFFFF;
          border: 1px solid var(--border-hairline);
          color: var(--text-muted);
        }
        .admin2026-root .topbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .admin2026-root .sync-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-hairline);
          padding: 6px 10px;
          border-radius: var(--radius-pill);
        }
        .admin2026-root .btn-refresh-sync.is-spinning svg {
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        .admin2026-root .topbar-icon-btn {
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
        }
        .admin2026-root .icon-badge-dot {
          position: absolute;
          top: 7px;
          right: 7px;
          width: 8px;
          height: 8px;
          border-radius: var(--radius-pill);
          background-color: var(--color-brand);
          border: 1.5px solid #FFFFFF;
        }
        .admin2026-root .dashboard-content {
          padding: 32px;
          max-width: 1440px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .admin2026-root .welcome-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .admin2026-root .welcome-title-group h1 {
          font-size: 28px;
          font-weight: 800;
          color: var(--text-ink);
          letter-spacing: -0.6px;
          line-height: 1.2;
          margin: 0;
        }
        .admin2026-root .welcome-meta {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .admin2026-root .welcome-meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-weight: 700;
          color: var(--status-review-text);
          background-color: var(--status-review-bg);
          padding: 2px 8px;
          border-radius: var(--radius-pill);
          font-size: 12px;
        }
        .admin2026-root .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: var(--color-brand);
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 700;
          padding: 10px 18px;
          border-radius: var(--radius-md);
          transition: all var(--duration-fast) var(--ease-standard);
          box-shadow: 0 2px 4px rgba(215, 20, 31, 0.2);
        }
        .admin2026-root .btn-primary:hover {
          background-color: var(--color-brand-hover);
          transform: translateY(-1px);
        }
        .admin2026-root .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .admin2026-root .kpi-card {
          background-color: var(--bg-canvas);
          border: 1px solid var(--border-hairline);
          border-radius: var(--radius-card);
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-standard);
        }
        .admin2026-root .kpi-card:hover {
          transform: translateY(-2px);
          border-color: #CBD5E1;
          box-shadow: var(--shadow-hover);
        }
        .admin2026-root .kpi-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .admin2026-root .kpi-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .admin2026-root .kpi-card.kpi-total .kpi-icon-wrap { background-color: #EFF6FF; color: #1D4ED8; }
        .admin2026-root .kpi-card.kpi-review .kpi-icon-wrap { background-color: var(--status-review-bg); color: var(--status-review-dot); }
        .admin2026-root .kpi-card.kpi-overdue .kpi-icon-wrap { background-color: var(--status-overdue-bg); color: var(--status-overdue-dot); }
        .admin2026-root .kpi-card.kpi-unassigned .kpi-icon-wrap { background-color: var(--status-unassigned-bg); color: var(--status-unassigned-dot); }
        .admin2026-root .kpi-sparkline {
          width: 64px;
          height: 24px;
        }
        .admin2026-root .kpi-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
        }
        .admin2026-root .kpi-number-wrap {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }
        .admin2026-root .kpi-number {
          font-size: 32px;
          font-weight: 800;
          color: var(--text-ink);
          line-height: 1;
        }
        .admin2026-root .kpi-subtext {
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 500;
        }
        .admin2026-root .row-pipeline-widgets {
          display: grid;
          grid-template-columns: 8fr 4fr;
          gap: 20px;
        }
        .admin2026-root .dashboard-card {
          background-color: var(--bg-canvas);
          border: 1px solid var(--border-hairline);
          border-radius: var(--radius-card);
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
        }
        .admin2026-root .card-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }
        .admin2026-root .card-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-ink);
          margin: 0;
        }
        .admin2026-root .card-subtitle-small {
          font-size: 12px;
          color: var(--text-muted);
        }
        .admin2026-root .pipeline-container {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          position: relative;
          padding-top: 10px;
          gap: 8px;
        }
        .admin2026-root .pipeline-track-line {
          position: absolute;
          top: 32px;
          left: 36px;
          right: 36px;
          height: 2px;
          background-color: var(--border-hairline);
          z-index: 1;
        }
        .admin2026-root .pipeline-step-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 2;
          flex: 1;
          cursor: pointer;
          transition: transform var(--duration-fast);
        }
        .admin2026-root .pipeline-step-node:hover {
          transform: translateY(-2px);
        }
        .admin2026-root .step-circle-badge {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-pill);
          background-color: #FFFFFF;
          border: 2px solid var(--border-hairline);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 800;
          color: var(--text-ink);
          box-shadow: 0 2px 4px rgba(11, 27, 58, 0.04);
        }
        .admin2026-root .pipeline-step-node.is-active .step-circle-badge,
        .admin2026-root .pipeline-step-node:hover .step-circle-badge {
          border-color: var(--color-brand);
          color: var(--color-brand);
        }
        .admin2026-root .pipeline-step-node.is-active .step-circle-badge {
          background-color: var(--color-brand-tint);
        }
        .admin2026-root .step-index-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          margin-top: 8px;
        }
        .admin2026-root .step-name-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-ink);
          line-height: 1.3;
          margin-top: 2px;
          max-width: 100px;
        }
        .admin2026-root .step-mini-bars {
          width: 60px;
          height: 4px;
          border-radius: var(--radius-pill);
          background-color: var(--border-hairline);
          margin-top: 8px;
          overflow: hidden;
          display: flex;
        }
        .admin2026-root .bar-seg-done { background-color: var(--status-done-dot); height: 100%; }
        .admin2026-root .bar-seg-progress { background-color: var(--status-progress-dot); height: 100%; }
        .admin2026-root .bar-seg-overdue { background-color: var(--status-overdue-dot); height: 100%; }
        .admin2026-root .widgets-stack {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .admin2026-root .deadline-card {
          background: linear-gradient(135deg, #FFF1F2 0%, #FFFFFF 100%);
          border: 1px solid var(--color-brand-border);
          border-radius: var(--radius-card);
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .admin2026-root .deadline-tag-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .admin2026-root .deadline-chip {
          font-size: 11px;
          font-weight: 700;
          color: var(--color-brand);
          background-color: #FFFFFF;
          border: 1px solid var(--color-brand-border);
          padding: 2px 8px;
          border-radius: var(--radius-pill);
        }
        .admin2026-root .deadline-title {
          font-size: 15px;
          font-weight: 800;
          color: var(--text-ink);
          margin: 0;
        }
        .admin2026-root .deadline-date-info {
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 500;
        }
        .admin2026-root .activity-feed-card {
          background-color: var(--bg-canvas);
          border: 1px solid var(--border-hairline);
          border-radius: var(--radius-card);
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .admin2026-root .activity-feed-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 0;
          padding: 0;
        }
        .admin2026-root .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 12px;
          line-height: 1.4;
        }
        .admin2026-root .activity-dot-icon {
          width: 20px;
          height: 20px;
          border-radius: var(--radius-pill);
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-hairline);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
          color: var(--text-muted);
        }
        .admin2026-root .activity-text-wrap {
          flex: 1;
          color: var(--text-body);
        }
        .admin2026-root .activity-text-wrap strong {
          color: var(--text-ink);
          font-weight: 700;
        }
        .admin2026-root .activity-timestamp {
          color: var(--text-muted);
          font-size: 11px;
          white-space: nowrap;
        }
        .admin2026-root .groups-master-card {
          background-color: var(--bg-canvas);
          border: 1px solid var(--border-hairline);
          border-radius: var(--radius-card);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .admin2026-root .master-toolbar {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-hairline);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .admin2026-root .table-tabs-nav {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .admin2026-root .tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
          padding: 8px 4px 10px 4px;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          white-space: nowrap;
        }
        .admin2026-root .tab-btn.is-active {
          color: var(--text-ink);
          font-weight: 700;
          border-bottom-color: var(--color-brand);
        }
        .admin2026-root .tab-counter-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: var(--radius-pill);
          background-color: var(--bg-hover);
          color: var(--text-muted);
        }
        .admin2026-root .tab-btn.is-active .tab-counter-badge {
          background-color: var(--text-ink);
          color: #FFFFFF;
        }
        .admin2026-root .toolbar-actions-group {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .admin2026-root .view-segmented-toggle {
          display: flex;
          align-items: center;
          padding: 3px;
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-hairline);
          border-radius: var(--radius-md);
        }
        .admin2026-root .view-toggle-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          border-radius: 6px;
        }
        .admin2026-root .view-toggle-btn.is-active {
          background-color: #FFFFFF;
          color: var(--text-ink);
          font-weight: 700;
          box-shadow: 0 1px 2px rgba(11, 27, 58, 0.06);
        }
        .admin2026-root .input-search-wrap {
          position: relative;
          width: 220px;
        }
        .admin2026-root .input-search-wrap input {
          width: 100%;
          height: 36px;
          padding: 0 12px 0 32px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-hairline);
          background-color: var(--bg-canvas);
          font-size: 13px;
          color: var(--text-ink);
        }
        .admin2026-root .input-search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }
        .admin2026-root .btn-secondary {
          height: 36px;
          padding: 0 12px;
          border: 1px solid var(--border-hairline);
          border-radius: var(--radius-md);
          background-color: var(--bg-canvas);
          color: var(--text-body);
          font-size: 12px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .admin2026-root .btn-secondary:hover {
          background-color: var(--bg-subtle);
          color: var(--text-ink);
        }
        .admin2026-root .active-filter-chips-bar {
          padding: 8px 20px;
          background-color: var(--bg-subtle);
          border-bottom: 1px solid var(--border-hairline);
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .admin2026-root .filter-chip-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #FFFFFF;
          border: 1px solid var(--border-hairline);
          padding: 3px 8px;
          border-radius: var(--radius-pill);
          font-size: 12px;
          color: var(--text-body);
          font-weight: 600;
        }
        .admin2026-root .table-responsive-wrapper {
          width: 100%;
          overflow-x: auto;
        }
        .admin2026-root .master-data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .admin2026-root .master-data-table tr {
          height: 64px;
        }
        .admin2026-root .master-data-table thead th {
          background-color: var(--bg-subtle);
          color: var(--text-muted);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 0 16px;
          text-align: left;
          border-bottom: 1px solid var(--border-hairline);
          user-select: none;
        }
        .admin2026-root .master-data-table thead th.is-sortable {
          cursor: pointer;
        }
        .admin2026-root .th-sort-inner {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .admin2026-root .master-data-table tbody tr {
          border-bottom: 1px solid var(--border-hairline);
          cursor: pointer;
        }
        .admin2026-root .master-data-table tbody tr:hover {
          background-color: var(--bg-subtle);
        }
        .admin2026-root .master-data-table tbody td {
          padding: 0 16px;
          vertical-align: middle;
        }
        .admin2026-root .custom-checkbox {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 1.5px solid var(--border-hairline);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background-color: #FFFFFF;
        }
        .admin2026-root .custom-checkbox.is-checked {
          background-color: var(--color-brand);
          border-color: var(--color-brand);
          color: #FFFFFF;
        }
        .admin2026-root .group-ident {
          display: flex;
          flex-direction: column;
          line-height: 1.25;
        }
        .admin2026-root .group-code {
          font-weight: 800;
          color: var(--text-ink);
          font-size: 13px;
        }
        .admin2026-root .group-school {
          color: var(--text-body);
          font-size: 13px;
          font-weight: 600;
        }
        .admin2026-root .group-students-sub {
          color: var(--text-muted);
          font-size: 11px;
        }
        .admin2026-root .leader-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .admin2026-root .leader-avatar {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-pill);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: #FFFFFF;
          flex-shrink: 0;
        }
        .admin2026-root .leader-name-wrap {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        .admin2026-root .leader-name-text {
          font-weight: 600;
          color: var(--text-ink);
        }
        .admin2026-root .btn-wa-round {
          width: 24px;
          height: 24px;
          border-radius: var(--radius-pill);
          background-color: #ECFDF3;
          color: #067647;
          border: 1px solid #A7F3D0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .admin2026-root .stage-progress-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .admin2026-root .stepper-dots-row {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .admin2026-root .mini-stepper-dot {
          width: 6px;
          height: 6px;
          border-radius: var(--radius-pill);
          background-color: #E2E8F0;
        }
        .admin2026-root .mini-stepper-dot.is-completed { background-color: var(--status-done-dot); }
        .admin2026-root .mini-stepper-dot.is-current { background-color: var(--text-ink); transform: scale(1.2); }
        .admin2026-root .stage-title-text {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-ink);
        }
        .admin2026-root .stage-tasks-text {
          font-size: 11px;
          color: var(--text-muted);
        }
        .admin2026-root .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: var(--radius-pill);
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }
        .admin2026-root .status-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: var(--radius-pill);
        }
        .admin2026-root .badge-review { background-color: var(--status-review-bg); color: var(--status-review-text); }
        .admin2026-root .badge-review .status-badge-dot { background-color: var(--status-review-dot); }
        .admin2026-root .badge-overdue { background-color: var(--status-overdue-bg); color: var(--status-overdue-text); }
        .admin2026-root .badge-overdue .status-badge-dot { background-color: var(--status-overdue-dot); }
        .admin2026-root .badge-done { background-color: var(--status-done-bg); color: var(--status-done-text); }
        .admin2026-root .badge-done .status-badge-dot { background-color: var(--status-done-dot); }
        .admin2026-root .badge-progress { background-color: var(--status-progress-bg); color: var(--status-progress-text); }
        .admin2026-root .badge-progress .status-badge-dot { background-color: var(--status-progress-dot); }
        .admin2026-root .badge-unassigned { background-color: var(--status-unassigned-bg); color: var(--status-unassigned-text); }
        .admin2026-root .badge-unassigned .status-badge-dot { background-color: var(--status-unassigned-dot); }
        .admin2026-root .row-actions-cell {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
        }
        .admin2026-root .btn-row-action {
          height: 32px;
          padding: 0 12px;
          border-radius: var(--radius-sm);
          font-size: 12px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .admin2026-root .btn-row-action.btn-review-outline {
          border: 1px solid var(--text-ink);
          color: var(--text-ink);
        }
        .admin2026-root .btn-row-action.btn-review-outline:hover {
          background-color: var(--color-brand);
          border-color: var(--color-brand);
          color: #FFFFFF;
        }
        .admin2026-root .btn-row-action.btn-view-ghost {
          border: 1px solid var(--border-hairline);
          color: var(--text-body);
        }
        .admin2026-root .table-footer {
          padding: 12px 20px;
          border-top: 1px solid var(--border-hairline);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          font-size: 12px;
          color: var(--text-muted);
          flex-wrap: wrap;
        }
        .admin2026-root .pager-controls {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .admin2026-root .btn-pager {
          width: 30px;
          height: 30px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-hairline);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: var(--text-body);
        }
        .admin2026-root .btn-pager.is-current {
          background-color: var(--text-ink);
          color: #FFFFFF;
          border-color: var(--text-ink);
        }
        .admin2026-root .btn-pager:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .admin2026-root .matrix-wrapper {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          overflow-x: auto;
        }
        .admin2026-root .matrix-legend {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 12px;
          color: var(--text-muted);
          flex-wrap: wrap;
        }
        .admin2026-root .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .admin2026-root .legend-box {
          width: 14px;
          height: 14px;
          border-radius: 4px;
        }
        .admin2026-root .matrix-grid-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 680px;
        }
        .admin2026-root .matrix-grid-table th {
          padding: 10px 12px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border-hairline);
          text-align: center;
        }
        .admin2026-root .matrix-grid-table th:first-child {
          text-align: left;
          width: 180px;
        }
        .admin2026-root .matrix-grid-table td {
          padding: 9px 12px;
          border-bottom: 1px solid var(--border-hairline);
          text-align: center;
        }
        .admin2026-root .matrix-grid-table td:first-child {
          text-align: left;
          font-weight: 700;
          color: var(--text-ink);
        }
        .admin2026-root .matrix-cell-node {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 26px;
          border-radius: 7px;
          cursor: pointer;
          font-size: 10.5px;
          font-weight: 800;
          font-variant-numeric: tabular-nums;
          transition: transform var(--duration-fast), box-shadow var(--duration-fast);
        }
        .admin2026-root .matrix-cell-node:hover {
          transform: scale(1.12);
          z-index: 5;
        }
        .admin2026-root .matrix-cell-done {
          background-color: #10B981;
          border: 1px solid #059669;
          color: #FFFFFF;
          box-shadow: 0 1px 3px rgba(16, 185, 129, 0.3);
        }
        .admin2026-root .matrix-cell-progress {
          background-color: #2563EB;
          border: 1px solid #1D4ED8;
          color: #FFFFFF;
          box-shadow: 0 1px 3px rgba(37, 99, 235, 0.3);
        }
        .admin2026-root .matrix-cell-review {
          background-color: #F59E0B;
          border: 1px solid #D97706;
          color: #FFFFFF;
          box-shadow: 0 1px 3px rgba(245, 158, 11, 0.32);
        }
        .admin2026-root .matrix-cell-overdue {
          background-color: #E11D48;
          border: 1px solid #BE123C;
          color: #FFFFFF;
          box-shadow: 0 1px 3px rgba(225, 29, 72, 0.32);
        }
        .admin2026-root .matrix-cell-empty {
          background-color: #CBD5E1;
          border: 1px solid #94A3B8;
          color: #475569;
        }
        .admin2026-root .drawer-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(11, 27, 58, 0.4);
          backdrop-filter: blur(4px);
          z-index: 50;
        }
        .admin2026-root .detail-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 480px;
          max-width: 100vw;
          background-color: var(--bg-canvas);
          z-index: 51;
          box-shadow: -10px 0 30px rgba(11, 27, 58, 0.15);
          display: flex;
          flex-direction: column;
        }
        .admin2026-root .drawer-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-hairline);
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }
        .admin2026-root .drawer-title-group h2 {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-ink);
          margin: 0;
        }
        .admin2026-root .drawer-school-sub {
          font-size: 13px;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .admin2026-root .drawer-body-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .admin2026-root .drawer-section-heading {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted);
          margin-bottom: 10px;
        }
        .admin2026-root .drawer-leader-card {
          padding: 14px 16px;
          border-radius: var(--radius-md);
          background-color: var(--bg-subtle);
          border: 1px solid var(--border-hairline);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .admin2026-root .drawer-stepper-vert {
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
        }
        .admin2026-root .drawer-step-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .admin2026-root .drawer-step-circle {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-pill);
          background-color: #FFFFFF;
          border: 2px solid var(--border-hairline);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
        }
        .admin2026-root .drawer-step-item.is-completed .drawer-step-circle {
          border-color: var(--status-done-dot);
          background-color: #ECFDF3;
          color: var(--status-done-dot);
        }
        .admin2026-root .drawer-step-item.is-current .drawer-step-circle {
          border-color: var(--color-brand);
          background-color: var(--color-brand-tint);
          color: var(--color-brand);
        }
        .admin2026-root .drawer-deliverable-card {
          padding: 14px 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-hairline);
          background-color: #FFFFFF;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .admin2026-root .deliverable-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .admin2026-root .deliverable-name {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-ink);
        }
        .admin2026-root .deliverable-meta {
          font-size: 12px;
          color: var(--text-muted);
        }
        .admin2026-root .drawer-feedback-textarea {
          width: 100%;
          height: 90px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-hairline);
          padding: 10px 12px;
          font-size: 13px;
          color: var(--text-ink);
          resize: vertical;
        }
        .admin2026-root .drawer-footer-sticky {
          padding: 16px 24px;
          border-top: 1px solid var(--border-hairline);
          background-color: var(--bg-canvas);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .admin2026-root .btn-approve-solid {
          flex: 1;
          height: 42px;
          border-radius: var(--radius-md);
          background-color: var(--status-done-dot);
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .admin2026-root .btn-revision-outline {
          flex: 1;
          height: 42px;
          border-radius: var(--radius-md);
          border: 1px solid #CBD5E1;
          color: var(--text-body);
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .admin2026-root .bulk-action-bar {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background-color: var(--text-ink);
          color: #FFFFFF;
          padding: 10px 20px;
          border-radius: var(--radius-pill);
          box-shadow: var(--shadow-toast);
          display: flex;
          align-items: center;
          gap: 16px;
          z-index: 45;
          font-size: 13px;
          font-weight: 600;
        }
        .admin2026-root .bulk-btn {
          color: #FFFFFF;
          font-size: 12px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: var(--radius-pill);
          background-color: rgba(255, 255, 255, 0.12);
        }
        .admin2026-root .palette-modal-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(11, 27, 58, 0.45);
          backdrop-filter: blur(4px);
          z-index: 60;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 15vh;
        }
        .admin2026-root .palette-container {
          width: 560px;
          max-width: 90vw;
          background-color: #FFFFFF;
          border-radius: var(--radius-card);
          box-shadow: var(--shadow-elevation);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .admin2026-root .palette-input-wrap {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-hairline);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .admin2026-root .palette-search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-ink);
        }
        .admin2026-root .palette-results-list {
          max-height: 320px;
          overflow-y: auto;
          padding: 8px;
          list-style: none;
          margin: 0;
        }
        .admin2026-root .palette-group-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted);
          padding: 8px 12px 4px 12px;
        }
        .admin2026-root .palette-result-item {
          padding: 10px 12px;
          border-radius: var(--radius-md);
          font-size: 13px;
          font-weight: 600;
          color: var(--text-ink);
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }
        .admin2026-root .palette-result-item:hover {
          background-color: var(--bg-subtle);
        }
        .admin2026-root .toast-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 70;
        }
        .admin2026-root .toast-card {
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
        .admin2026-root .toast-undo-btn {
          color: #F87171;
          font-weight: 700;
          font-size: 12px;
          text-transform: uppercase;
          cursor: pointer;
        }
        .admin2026-root .toast-progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background-color: var(--color-brand);
          width: 100%;
          animation: undoProgress 5s linear forwards;
        }
        @keyframes undoProgress {
          0% { width: 100%; }
          100% { width: 0%; }
        }
        @media (max-width: 1200px) {
          .admin2026-root .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .admin2026-root .row-pipeline-widgets {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .admin2026-root .app-sidebar {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            transform: translateX(-100%);
            width: 260px !important;
            box-shadow: var(--shadow-elevation);
          }
          .admin2026-root .app-sidebar.mobile-open {
            transform: translateX(0);
          }
          .admin2026-root .mobile-nav-toggle {
            display: flex;
          }
          .admin2026-root .topbar-center {
            display: none;
          }
          .admin2026-root .dashboard-content {
            padding: 16px;
          }
          .admin2026-root .kpi-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="app-shell">
        {/* ─── SIDEBAR (248px COLLAPSIBLE TO 72px RAIL) ───────────────────────── */}
        <aside
          className={`app-sidebar ${isRail ? 'is-rail' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
          aria-label="Navigasi Utama"
        >
          <div className="sidebar-header">
            <div className="brand-mark" onClick={() => navigate('/')}>
              <div className="brand-logo-box">SM</div>
              <div className="brand-details">
                <span className="brand-name">Skomda Mengajar</span>
                <span className="brand-badge">Admin Panel</span>
              </div>
            </div>
            <button
              type="button"
              className="btn-collapse-sidebar"
              onClick={() => setIsRail(!isRail)}
              title="Ciutkan Sidebar"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <polyline points={isRail ? '9 18 15 12 9 6' : '15 18 9 12 15 6'} />
              </svg>
            </button>
          </div>

          <div className="sidebar-nav-container">
            <div>
              <div className="nav-group-title">Utama</div>
              <ul className="nav-list">
                <li>
                  <button
                    type="button"
                    className={`nav-item-link ${sidebarRoute === 'dashboard' ? 'is-active' : ''}`}
                    onClick={() => {
                      setSidebarRoute('dashboard');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="nav-left-content">
                      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect width="7" height="7" x="3" y="3" rx="1" />
                        <rect width="7" height="7" x="14" y="3" rx="1" />
                        <rect width="7" height="7" x="14" y="14" rx="1" />
                        <rect width="7" height="7" x="3" y="14" rx="1" />
                      </svg>
                      <span className="nav-label">Dashboard</span>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`nav-item-link ${sidebarRoute === 'kelompok' ? 'is-active' : ''}`}
                    onClick={() => {
                      setSidebarRoute('kelompok');
                      setCurrentTab('semua');
                      tableSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <div className="nav-left-content">
                      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <span className="nav-label">Kelompok</span>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`nav-item-link ${sidebarRoute === 'review' ? 'is-active' : ''}`}
                    onClick={() => {
                      setSidebarRoute('review');
                      setCurrentTab('review');
                      tableSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <div className="nav-left-content">
                      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                        <path d="m9 15 2 2 4-4" />
                      </svg>
                      <span className="nav-label">Review Berkas</span>
                    </div>
                    <span className="nav-badge badge-amber">{reviewCount}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`nav-item-link ${sidebarRoute === 'persiapan' ? 'is-active' : ''}`}
                    onClick={() => {
                      setSidebarRoute('persiapan');
                      setCurrentTab('unassigned');
                      tableSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <div className="nav-left-content">
                      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                        <path d="M12 8v4" />
                        <path d="M12 16h.01" />
                      </svg>
                      <span className="nav-label">Persiapan &amp; Ketua</span>
                    </div>
                    <span className="nav-badge">{unassignedCount}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`nav-item-link ${sidebarRoute === 'feedback' ? 'is-active' : ''}`}
                    onClick={() => {
                      setSidebarRoute('feedback');
                      setDrawerGroupId('KEL-03');
                    }}
                  >
                    <div className="nav-left-content">
                      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <span className="nav-label">Feedback SMP</span>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="nav-item-link"
                    onClick={handleExportCsv}
                  >
                    <div className="nav-left-content">
                      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                        <path d="M8 13h2" />
                        <path d="M14 13h2" />
                        <path d="M8 17h2" />
                        <path d="M14 17h2" />
                      </svg>
                      <span className="nav-label">Laporan &amp; Ekspor</span>
                    </div>
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="nav-group-title">Sistem</div>
              <ul className="nav-list">
                <li>
                  <button
                    type="button"
                    className="nav-item-link"
                    onClick={() => triggerAdminToast('Pengaturan sinkronisasi kurikulum aktif.')}
                  >
                    <div className="nav-left-content">
                      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                      <span className="nav-label">Pengaturan</span>
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="nav-item-link"
                    onClick={() => triggerAdminToast('Bantuan: Tekan Ctrl+K untuk pencarian cepat.')}
                  >
                    <div className="nav-left-content">
                      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <path d="M12 17h.01" />
                      </svg>
                      <span className="nav-label">Bantuan</span>
                    </div>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="sidebar-footer">
            <div className="user-profile-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <div className="user-avatar" title={adminDisplayName}>
                  {adminInitials}
                </div>
                <div className="user-info">
                  <span className="user-name">{adminDisplayName}</span>
                  <span className="user-role">Koordinator Guru</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => void logout()}
                title="Keluar Sesi Admin"
                style={{ color: 'var(--text-muted)', padding: 4 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
            <button
              type="button"
              className="btn-return-home"
              onClick={() => navigate('/')}
              title="Kembali ke Beranda Utama"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Kembali ke Beranda</span>
            </button>
          </div>
        </aside>

        {/* ─── MAIN VIEWPORT ──────────────────────────────────────────────────── */}
        <main className="app-main">
          <header className="app-topbar">
            <div className="topbar-left">
              <button
                type="button"
                className="mobile-nav-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Buka Menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <div className="breadcrumb">
                <span>Skomda Mengajar</span>
                <span>/</span>
                <strong>Dashboard Admin</strong>
              </div>
            </div>

            <div className="topbar-center">
              <button
                type="button"
                className="global-search-btn"
                onClick={() => setPaletteOpen(true)}
                title="Buka Pencarian Cepat (Ctrl+K)"
              >
                <div className="search-left-hint">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span>Cari kelompok, SMP, ketua...</span>
                </div>
                <kbd className="search-kbd-hint">Ctrl K</kbd>
              </button>
            </div>

            <div className="topbar-right">
              <div className="sync-chip">
                <span>{syncText}</span>
                <button
                  type="button"
                  className={`btn-refresh-sync ${isSyncing ? 'is-spinning' : ''}`}
                  onClick={() => {
                    setIsSyncing(true);
                    setSyncText('Menyinkronkan...');
                    setTimeout(() => {
                      setIsSyncing(false);
                      setSyncText('Baru saja tersinkron');
                      triggerAdminToast('Data kelompok berhasil disinkronkan dengan database!');
                    }, 900);
                  }}
                  title="Sinkronkan Data"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M8 16H3v5" />
                  </svg>
                </button>
              </div>

              <button
                type="button"
                className="topbar-icon-btn"
                onClick={() => triggerAdminToast('Tenggat Tahap 04 (Siapkan Desain): Sabtu, 21 Februari 2026.')}
                title="Tenggat Jadwal Milestones"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </button>

              <button
                type="button"
                className="topbar-icon-btn"
                onClick={() => {
                  const firstReview = groups.find((g) => g.status === 'menunggu');
                  if (firstReview) setDrawerGroupId(firstReview.id);
                  else triggerAdminToast('Tidak ada berkas baru yang menunggu review.');
                }}
                title={`Notifikasi Pengajuan (${reviewCount})`}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                {reviewCount > 0 && <span className="icon-badge-dot" />}
              </button>
            </div>
          </header>

          {/* Dashboard Body Content */}
          <div className="dashboard-content">
            {/* ─── 1) SAMBUTAN & PRIMARY ACTION ───────────────────────────────── */}
            <section className="welcome-header">
              <div className="welcome-title-group">
                <h1>Selamat datang, {adminDisplayName}</h1>
                <div className="welcome-meta">
                  <span>{currentDateIndo}</span>
                  <span>•</span>
                  <span className="welcome-meta-pill">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{reviewCount} berkas menunggu review</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  const firstReview = groups.find((g) => g.status === 'menunggu');
                  if (firstReview) {
                    setDrawerGroupId(firstReview.id);
                  } else {
                    triggerAdminToast('Semua pengajuan telah tuntas direview!');
                  }
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Mulai Review ({reviewCount})</span>
              </button>
            </section>

            {/* ─── 2) 4 KPI CARDS ─────────────────────────────────────────────── */}
            <section className="kpi-grid" aria-label="Ringkasan Kinerja Kelompok">
              <div
                className="kpi-card kpi-total"
                onClick={() => {
                  setCurrentTab('semua');
                  tableSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="kpi-card-top">
                  <div className="kpi-icon-wrap">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <svg className="kpi-sparkline" viewBox="0 0 64 24" fill="none">
                    <path d="M2 18 L16 14 L30 16 L44 8 L62 4" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div className="kpi-label">Total Kelompok</div>
                  <div className="kpi-number-wrap">
                    <span className="kpi-number tabular-nums">{totalCount}</span>
                    <span className="kpi-subtext">kelompok</span>
                  </div>
                </div>
                <span className="kpi-subtext">24 SMP mitra di Sidoarjo</span>
              </div>

              <div
                className="kpi-card kpi-review"
                onClick={() => {
                  setCurrentTab('review');
                  tableSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="kpi-card-top">
                  <div className="kpi-icon-wrap">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <svg className="kpi-sparkline" viewBox="0 0 64 24" fill="none">
                    <path d="M2 20 L20 18 L38 10 L50 8 L62 4" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div className="kpi-label">Menunggu Review</div>
                  <div className="kpi-number-wrap">
                    <span className="kpi-number tabular-nums">{reviewCount}</span>
                    <span className="kpi-subtext">berkas</span>
                  </div>
                </div>
                <span className="kpi-subtext" style={{ color: 'var(--status-review-text)', fontWeight: 600 }}>
                  Terlama 4 hari lalu
                </span>
              </div>

              <div
                className="kpi-card kpi-overdue"
                onClick={() => {
                  setCurrentTab('overdue');
                  tableSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="kpi-card-top">
                  <div className="kpi-icon-wrap">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <svg className="kpi-sparkline" viewBox="0 0 64 24" fill="none">
                    <path d="M2 8 L22 14 L40 12 L52 18 L62 20" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div className="kpi-label">Terlambat / Revisi</div>
                  <div className="kpi-number-wrap">
                    <span className="kpi-number tabular-nums">{overdueCount}</span>
                    <span className="kpi-subtext">kelompok</span>
                  </div>
                </div>
                <span className="kpi-subtext" style={{ color: 'var(--status-overdue-text)', fontWeight: 600 }}>
                  Butuh tindak lanjut WA
                </span>
              </div>

              <div
                className="kpi-card kpi-unassigned"
                onClick={() => {
                  setCurrentTab('unassigned');
                  tableSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="kpi-card-top">
                  <div className="kpi-icon-wrap">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="17" y1="8" x2="23" y2="14" />
                      <line x1="23" y1="8" x2="17" y2="14" />
                    </svg>
                  </div>
                  <svg className="kpi-sparkline" viewBox="0 0 64 24" fill="none">
                    <path d="M2 12 L20 12 L40 12 L62 12" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div className="kpi-label">Belum Ada Ketua</div>
                  <div className="kpi-number-wrap">
                    <span className="kpi-number tabular-nums">{unassignedCount}</span>
                    <span className="kpi-subtext">kelompok</span>
                  </div>
                </div>
                <span className="kpi-subtext">Masih di Tahap 02</span>
              </div>
            </section>

            {/* ─── 3) ROW 2: PIPELINE 6 TAHAP & WIDGETS ───────────────────────── */}
            <section className="row-pipeline-widgets">
              <div className="dashboard-card">
                <div className="card-header-row">
                  <div>
                    <h2 className="card-title">Posisi Kelompok per Tahap</h2>
                    <span className="card-subtitle-small">
                      Klik pada tahap untuk menyaring daftar kelompok di bawah
                    </span>
                  </div>
                  <span className="badge-progress status-badge">
                    <span className="status-badge-dot" />
                    <span>Alur Aktif 2026</span>
                  </span>
                </div>

                <div className="pipeline-container">
                  <div className="pipeline-track-line" />
                  {STAGES_LIST.map((stg) => {
                    const inStage = groups.filter((g) => g.tahap === stg.id);
                    const count = inStage.length;
                    const countDone = inStage.filter((g) => g.status === 'selesai').length;
                    const countOverdue = inStage.filter((g) => g.status === 'terlambat').length;
                    const countProg = inStage.filter(
                      (g) => g.status === 'berjalan' || g.status === 'menunggu'
                    ).length;

                    const pctDone = count > 0 ? (countDone / count) * 100 : 0;
                    const pctProg = count > 0 ? (countProg / count) * 100 : 0;
                    const pctOver = count > 0 ? (countOverdue / count) * 100 : 0;

                    return (
                      <div
                        key={stg.id}
                        className={`pipeline-step-node ${filterStage === stg.id ? 'is-active' : ''}`}
                        onClick={() => {
                          setFilterStage((prev) => (prev === stg.id ? null : stg.id));
                          setCurrentPage(1);
                        }}
                        title={`${stg.no} ${stg.name}: ${count} kelompok`}
                      >
                        <div className="step-circle-badge tabular-nums">{count}</div>
                        <span className="step-index-label">{stg.no}</span>
                        <span className="step-name-label">{stg.name}</span>
                        <div className="step-mini-bars">
                          <div className="bar-seg-done" style={{ width: `${pctDone}%` }} />
                          <div className="bar-seg-progress" style={{ width: `${pctProg}%` }} />
                          <div className="bar-seg-overdue" style={{ width: `${pctOver}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="widgets-stack">
                <div className="deadline-card">
                  <div className="deadline-tag-row">
                    <span className="deadline-chip">Tenggat Terdekat</span>
                    <span className="status-badge badge-overdue" style={{ padding: '2px 8px', fontSize: 11 }}>
                      3 hari lagi
                    </span>
                  </div>
                  <h3 className="deadline-title">Tahap 04 - Siapkan Desain</h3>
                  <div className="deadline-date-info">
                    Batas akhir: <strong>Sabtu, 21 Februari 2026</strong>
                  </div>
                </div>

                <div className="activity-feed-card">
                  <h3 className="card-title" style={{ fontSize: 14 }}>
                    Aktivitas Terbaru
                  </h3>
                  <ul className="activity-feed-list">
                    {RECENT_ACTIVITIES.map((act, idx) => (
                      <li key={idx} className="activity-item">
                        <div className="activity-dot-icon">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {act.icon === 'check' ? (
                              <polyline points="20 6 9 17 4 12" />
                            ) : (
                              <>
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                              </>
                            )}
                          </svg>
                        </div>
                        <div className="activity-text-wrap">
                          <strong>{act.group}</strong> {act.text}
                        </div>
                        <span className="activity-timestamp">{act.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* ─── 4) KARTU UTAMA "DAFTAR KELOMPOK" (TABEL & MATRIKS) ─────────── */}
            <section className="groups-master-card" ref={tableSectionRef}>
              <div className="master-toolbar">
                <div className="table-tabs-nav">
                  {(
                    [
                      { key: 'semua', label: 'Semua Kelompok', count: totalCount },
                      { key: 'review', label: 'Menunggu Review', count: reviewCount },
                      { key: 'overdue', label: 'Terlambat / Revisi', count: overdueCount },
                      { key: 'unassigned', label: 'Belum Ada Ketua', count: unassignedCount },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      className={`tab-btn ${currentTab === t.key ? 'is-active' : ''}`}
                      onClick={() => {
                        setCurrentTab(t.key);
                        setCurrentPage(1);
                      }}
                    >
                      <span>{t.label}</span>
                      <span className="tab-counter-badge tabular-nums">{t.count}</span>
                    </button>
                  ))}
                </div>

                <div className="toolbar-actions-group">
                  <div className="view-segmented-toggle">
                    <button
                      type="button"
                      className={`view-toggle-btn ${viewMode === 'table' ? 'is-active' : ''}`}
                      onClick={() => setViewMode('table')}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="8" y1="6" x2="21" y2="6" />
                        <line x1="8" y1="12" x2="21" y2="12" />
                        <line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" />
                        <line x1="3" y1="12" x2="3.01" y2="12" />
                        <line x1="3" y1="18" x2="3.01" y2="18" />
                      </svg>
                      <span>Tabel</span>
                    </button>
                    <button
                      type="button"
                      className={`view-toggle-btn ${viewMode === 'matrix' ? 'is-active' : ''}`}
                      onClick={() => setViewMode('matrix')}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M3 9h18" />
                        <path d="M3 15h18" />
                        <path d="M9 3v18" />
                        <path d="M15 3v18" />
                      </svg>
                      <span>Matriks</span>
                    </button>
                  </div>

                  <div className="input-search-wrap">
                    <svg className="input-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Cari nama, SMP, ketua..."
                      aria-label="Cari di tabel"
                    />
                  </div>

                  <button type="button" className="btn-secondary" onClick={handleExportCsv}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Ekspor</span>
                  </button>

                  <button
                    type="button"
                    className="btn-primary"
                    style={{ padding: '8px 14px', fontSize: 12 }}
                    onClick={openCreateModal}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Tambah Kelompok</span>
                  </button>
                </div>
              </div>

              {/* Active Filter Chips */}
              {(filterStage !== null || searchTerm.trim() !== '') && (
                <div className="active-filter-chips-bar">
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Filter Aktif:
                  </span>
                  {filterStage !== null && (
                    <div className="filter-chip-item">
                      <span>
                        Tahap: {STAGES_LIST.find((s) => s.id === filterStage)?.no}{' '}
                        {STAGES_LIST.find((s) => s.id === filterStage)?.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFilterStage(null)}
                        style={{ color: 'var(--text-muted)', fontWeight: 700 }}
                      >
                        &times;
                      </button>
                    </div>
                  )}
                  {searchTerm.trim() !== '' && (
                    <div className="filter-chip-item">
                      <span>Pencarian: "{searchTerm}"</span>
                      <button
                        type="button"
                        onClick={() => setSearchTerm('')}
                        style={{ color: 'var(--text-muted)', fontWeight: 700 }}
                      >
                        &times;
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ height: 24, padding: '0 8px', fontSize: 11, marginLeft: 'auto' }}
                    onClick={() => {
                      setFilterStage(null);
                      setSearchTerm('');
                    }}
                  >
                    Reset Semua Filter
                  </button>
                </div>
              )}

              {/* TABLE VIEW */}
              {viewMode === 'table' ? (
                <div className="table-responsive-wrapper">
                  {filteredGroups.length === 0 ? (
                    <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-ink)' }}>
                        Tidak ada kelompok yang cocok
                      </h3>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                        Coba ubah kata kunci pencarian atau sesuaikan opsi filter.
                      </p>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ marginTop: 14 }}
                        onClick={() => {
                          setCurrentTab('semua');
                          setFilterStage(null);
                          setSearchTerm('');
                        }}
                      >
                        Reset Filter
                      </button>
                    </div>
                  ) : (
                    <table className="master-data-table">
                      <thead>
                        <tr>
                          <th style={{ width: 44, textAlign: 'center' }}>
                            <div
                              className={`custom-checkbox ${
                                selectedIds.size === filteredGroups.length && filteredGroups.length > 0
                                  ? 'is-checked'
                                  : ''
                              }`}
                              onClick={toggleSelectAll}
                              title="Pilih Semua"
                            >
                              {selectedIds.size === filteredGroups.length && filteredGroups.length > 0 && (
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </div>
                          </th>
                          <th className="is-sortable" onClick={() => handleSort('id')}>
                            <div className="th-sort-inner">
                              <span>Kelompok</span>
                            </div>
                          </th>
                          <th className="is-sortable" onClick={() => handleSort('ketua')}>
                            <div className="th-sort-inner">
                              <span>Ketua Kelompok</span>
                            </div>
                          </th>
                          <th className="is-sortable" onClick={() => handleSort('tahap')}>
                            <div className="th-sort-inner">
                              <span>Tahap &amp; Progres</span>
                            </div>
                          </th>
                          <th className="is-sortable" onClick={() => handleSort('menungguHari')}>
                            <div className="th-sort-inner">
                              <span>Menunggu Sejak</span>
                            </div>
                          </th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedGroups.map((grp) => {
                          const isSelected = selectedIds.has(grp.id);
                          const isMenunggu = grp.status === 'menunggu';
                          const isOverdue = grp.status === 'terlambat';
                          const isBelumKetua = grp.status === 'belumKetua';
                          const isSelesai = grp.status === 'selesai';

                          let statusBadgeClass = 'badge-progress';
                          let statusLabel = 'Berjalan';
                          if (isMenunggu) {
                            statusBadgeClass = 'badge-review';
                            statusLabel = 'Menunggu Review';
                          } else if (isOverdue) {
                            statusBadgeClass = 'badge-overdue';
                            statusLabel = 'Terlambat';
                          } else if (isBelumKetua) {
                            statusBadgeClass = 'badge-unassigned';
                            statusLabel = 'Belum Ada Ketua';
                          } else if (isSelesai) {
                            statusBadgeClass = 'badge-done';
                            statusLabel = 'Selesai';
                          }

                          const initial =
                            grp.ketua && grp.ketua !== '—'
                              ? grp.ketua
                                  .split(' ')
                                  .map((n) => n[0])
                                  .slice(0, 2)
                                  .join('')
                                  .toUpperCase()
                              : '—';
                          const avatarBg = isMenunggu
                            ? '#D97706'
                            : isOverdue
                            ? '#DC2626'
                            : isBelumKetua
                            ? '#94A3B8'
                            : '#2563EB';

                          return (
                            <tr
                              key={grp.id}
                              onClick={() => setDrawerGroupId(grp.id)}
                              style={{ backgroundColor: isSelected ? '#F8FAFC' : undefined }}
                            >
                              <td
                                style={{ textAlign: 'center' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRowSelection(grp.id);
                                }}
                              >
                                <div className={`custom-checkbox ${isSelected ? 'is-checked' : ''}`}>
                                  {isSelected && (
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="group-ident">
                                  <span className="group-code">{grp.id}</span>
                                  <span className="group-school">{grp.smp}</span>
                                  <span className="group-students-sub">
                                    {grp.jumlahSiswa} siswa • {grp.kecamatan}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div className="leader-cell">
                                  <div className="leader-avatar" style={{ backgroundColor: avatarBg }}>
                                    {initial}
                                  </div>
                                  <div className="leader-name-wrap">
                                    <span className="leader-name-text">{grp.ketua}</span>
                                    {grp.wa ? (
                                      <span
                                        className="tabular-nums"
                                        style={{ fontSize: 11, color: 'var(--text-muted)' }}
                                      >
                                        +{grp.wa}
                                      </span>
                                    ) : (
                                      <span style={{ fontSize: 11, color: 'var(--status-review-text)' }}>
                                        Belum ditentukan
                                      </span>
                                    )}
                                  </div>
                                  {grp.wa && (
                                    <a
                                      href={`https://wa.me/${grp.wa}?text=${encodeURIComponent(
                                        `Halo Ketua ${grp.id} (${grp.smp})...`
                                      )}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="btn-wa-round"
                                      onClick={(e) => e.stopPropagation()}
                                      title={`WhatsApp Ketua (${grp.wa})`}
                                    >
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                      </svg>
                                    </a>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="stage-progress-cell">
                                  <div className="stepper-dots-row">
                                    {[1, 2, 3, 4, 5, 6].map((stgNo) => (
                                      <span
                                        key={stgNo}
                                        className={`mini-stepper-dot ${
                                          stgNo < grp.tahap
                                            ? 'is-completed'
                                            : stgNo === grp.tahap
                                            ? 'is-current'
                                            : ''
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="stage-title-text">{grp.tahapName}</span>
                                  <span className="stage-tasks-text tabular-nums">
                                    {grp.tugasSelesai}/{grp.tugasTotal} tugas selesai
                                  </span>
                                </div>
                              </td>
                              <td
                                style={{
                                  color: grp.menungguHari > 3 ? 'var(--status-overdue-dot)' : undefined,
                                  fontWeight: grp.menungguHari > 3 ? 700 : undefined,
                                }}
                              >
                                <span className="tabular-nums">{grp.menungguSejak}</span>
                              </td>
                              <td>
                                <span className={`status-badge ${statusBadgeClass}`}>
                                  <span className="status-badge-dot" />
                                  <span>{statusLabel}</span>
                                </span>
                              </td>
                              <td onClick={(e) => e.stopPropagation()}>
                                <div className="row-actions-cell">
                                  <button
                                    type="button"
                                    className={`btn-row-action ${
                                      isMenunggu ? 'btn-review-outline' : 'btn-view-ghost'
                                    }`}
                                    onClick={() => setDrawerGroupId(grp.id)}
                                  >
                                    {isMenunggu ? 'Review' : 'Lihat'}
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-row-action btn-view-ghost"
                                    onClick={() => openEditModal(grp)}
                                    title={`Edit ${grp.id}`}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-row-action btn-view-ghost"
                                    style={{ color: 'var(--status-overdue-dot)', borderColor: '#FECACA' }}
                                    onClick={() => setDeleteConfirmGroup(grp)}
                                    title={`Hapus ${grp.id}`}
                                  >
                                    Hapus
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              ) : (
                /* MATRIX VIEW */
                <div className="matrix-wrapper">
                  <div className="matrix-legend">
                    <div className="legend-item">
                      <div className="legend-box matrix-cell-done" />
                      <span>Selesai</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-box matrix-cell-progress" />
                      <span>Berjalan</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-box matrix-cell-review" />
                      <span>Menunggu Review</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-box matrix-cell-overdue" />
                      <span>Terlambat / Revisi</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-box matrix-cell-empty" />
                      <span>Belum Mulai</span>
                    </div>
                  </div>
                  <table className="matrix-grid-table">
                    <thead>
                      <tr>
                        <th>Kelompok</th>
                        <th>01 Bentuk Tim</th>
                        <th>02 Pilih Ketua</th>
                        <th>03 Susun Modul</th>
                        <th>04 Siapkan Desain</th>
                        <th>05 Mengajar SMP</th>
                        <th>06 Evaluasi &amp; Nilai</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGroups.map((grp) => (
                        <tr key={grp.id}>
                          <td>
                            <strong>{grp.id}</strong>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{grp.smp}</div>
                          </td>
                          {[1, 2, 3, 4, 5, 6].map((stgNo) => {
                            let cellClass = 'matrix-cell-empty';
                            let isDoneCell = false;
                            let isCurrentCell = false;
                            if (stgNo < grp.tahap) {
                              cellClass = 'matrix-cell-done';
                              isDoneCell = true;
                            } else if (stgNo === grp.tahap) {
                              isCurrentCell = true;
                              if (grp.status === 'menunggu') cellClass = 'matrix-cell-review';
                              else if (grp.status === 'terlambat') cellClass = 'matrix-cell-overdue';
                              else if (grp.status === 'selesai') {
                                cellClass = 'matrix-cell-done';
                                isDoneCell = true;
                              } else cellClass = 'matrix-cell-progress';
                            }
                            return (
                              <td key={stgNo}>
                                <div
                                  className={`matrix-cell-node ${cellClass}`}
                                  onClick={() => setDrawerGroupId(grp.id)}
                                  title={`${grp.id} — Tahap 0${stgNo}`}
                                >
                                  {isDoneCell ? (
                                    <svg
                                      width="13"
                                      height="13"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="3"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  ) : isCurrentCell ? (
                                    <span>
                                      {grp.tugasSelesai}/{grp.tugasTotal}
                                    </span>
                                  ) : (
                                    <span style={{ opacity: 0.7 }}>—</span>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Table Footer & Pagination */}
              {viewMode === 'table' && filteredGroups.length > 0 && (
                <div className="table-footer">
                  <div>
                    Menampilkan {startIndex + 1}-
                    {Math.min(startIndex + rowsPerPage, filteredGroups.length)} dari{' '}
                    {filteredGroups.length} kelompok
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>Baris per halaman:</span>
                      <select
                        value={rowsPerPage}
                        onChange={(e) => {
                          setRowsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        style={{
                          border: '1px solid var(--border-hairline)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '3px 6px',
                          fontSize: 12,
                          background: '#fff',
                        }}
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                    </div>
                    {totalPages > 1 && (
                      <div className="pager-controls">
                        <button
                          type="button"
                          className="btn-pager"
                          disabled={safePage === 1}
                          onClick={() => setCurrentPage(safePage - 1)}
                        >
                          &lt;
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                          <button
                            key={p}
                            type="button"
                            className={`btn-pager ${p === safePage ? 'is-current' : ''}`}
                            onClick={() => setCurrentPage(p)}
                          >
                            {p}
                          </button>
                        ))}
                        <button
                          type="button"
                          className="btn-pager"
                          disabled={safePage === totalPages}
                          onClick={() => setCurrentPage(safePage + 1)}
                        >
                          &gt;
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      {/* ─── 5) DRAWER DETAIL KELOMPOK (480px SLIDE OVER) ─────────────────────── */}
      {activeDrawerGroup && (
        <>
          <div className="drawer-backdrop" onClick={() => setDrawerGroupId(null)} />
          <aside className="detail-drawer" aria-label="Detail Kelompok">
            <div className="drawer-header">
              <div className="drawer-title-group">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h2>{activeDrawerGroup.id}</h2>
                  <span
                    className={`status-badge ${
                      activeDrawerGroup.status === 'menunggu'
                        ? 'badge-review'
                        : activeDrawerGroup.status === 'terlambat'
                        ? 'badge-overdue'
                        : 'badge-progress'
                    }`}
                  >
                    {activeDrawerGroup.status === 'menunggu'
                      ? 'Menunggu Review'
                      : activeDrawerGroup.status === 'terlambat'
                      ? 'Terlambat / Revisi'
                      : 'Berjalan'}
                  </span>
                </div>
                <div className="drawer-school-sub">
                  {activeDrawerGroup.smp} • {activeDrawerGroup.kecamatan}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ height: 30, padding: '0 10px', fontSize: 11 }}
                  onClick={() => openEditModal(activeDrawerGroup)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{
                    height: 30,
                    padding: '0 10px',
                    fontSize: 11,
                    color: 'var(--status-overdue-dot)',
                    borderColor: '#FECACA',
                  }}
                  onClick={() => setDeleteConfirmGroup(activeDrawerGroup)}
                >
                  Hapus
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerGroupId(null)}
                  style={{ color: 'var(--text-muted)', padding: 4 }}
                  aria-label="Tutup Panel"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="drawer-body-scroll">
              <div>
                <div className="drawer-section-heading">Ketua Kelompok &amp; Kontak</div>
                <div className="drawer-leader-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="leader-avatar" style={{ backgroundColor: '#D7141F' }}>
                      {activeDrawerGroup.ketua !== '—'
                        ? activeDrawerGroup.ketua
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')
                        : '—'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-ink)' }}>
                        {activeDrawerGroup.ketua}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }} className="tabular-nums">
                        {activeDrawerGroup.wa ? `+${activeDrawerGroup.wa}` : 'Belum ditentukan'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {activeDrawerGroup.wa && (
                      <a
                        href={`https://wa.me/${activeDrawerGroup.wa}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-wa-round"
                        title="Hubungi via WhatsApp"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </a>
                    )}
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ height: 26, padding: '0 8px', fontSize: 11 }}
                      onClick={() => {
                        if (activeDrawerGroup.wa) {
                          void navigator.clipboard?.writeText(`+${activeDrawerGroup.wa}`);
                          triggerAdminToast('Nomor WhatsApp ketua disalin!');
                        }
                      }}
                    >
                      Salin
                    </button>
                  </div>
                </div>
              </div>

              {activeDrawerGroup.berkas.length > 0 && (
                <div>
                  <div className="drawer-section-heading">Berkas Menunggu Validasi</div>
                  <div className="drawer-deliverable-card">
                    <div className="deliverable-top">
                      <span className="deliverable-name">{activeDrawerGroup.berkas[0].nama}</span>
                      <span
                        className="badge-review status-badge"
                        style={{ padding: '2px 6px', fontSize: 10 }}
                      >
                        {activeDrawerGroup.berkas[0].versi}
                      </span>
                    </div>
                    <div className="deliverable-meta">
                      {activeDrawerGroup.berkas[0].ukuran} • {activeDrawerGroup.berkas[0].waktu}
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: 'var(--text-body)',
                        background: 'var(--bg-subtle)',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-sm)',
                        marginTop: 4,
                      }}
                    >
                      "Revisi tata letak logo SMK Telkom Sidoarjo dan QR Code pendaftaran siswa SMP sudah
                      diperbaiki sesuai panduan."
                    </p>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ marginTop: 6, justifyContent: 'center' }}
                      onClick={() => setIsBannerModalOpen(true)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>Pratinjau Berkas</span>
                    </button>
                  </div>
                </div>
              )}

              <div>
                <div className="drawer-section-heading">Catatan Evaluasi Guru Pembimbing</div>
                <textarea
                  className="drawer-feedback-textarea"
                  value={drawerNotes}
                  onChange={(e) => setDrawerNotes(e.target.value)}
                  placeholder="Tulis instruksi revisi atau apresiasi berkas..."
                />
              </div>

              <div>
                <div className="drawer-section-heading">Alur 6 Tahap Pelaksanaan</div>
                <div className="drawer-stepper-vert">
                  {STAGES_LIST.map((stg) => {
                    const isCompleted = stg.id < activeDrawerGroup.tahap;
                    const isCurrent = stg.id === activeDrawerGroup.tahap;
                    return (
                      <div
                        key={stg.id}
                        className={`drawer-step-item ${
                          isCompleted ? 'is-completed' : isCurrent ? 'is-current' : ''
                        }`}
                      >
                        <div className="drawer-step-circle tabular-nums">{stg.no}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-ink)' }}>
                            {stg.name}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {isCompleted
                              ? 'Tuntas disetujui'
                              : isCurrent
                              ? `${activeDrawerGroup.tugasSelesai}/${activeDrawerGroup.tugasTotal} tugas tuntas`
                              : 'Belum dimulai'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="drawer-footer-sticky">
              <button
                type="button"
                className="btn-revision-outline"
                onClick={() => handleDrawerDecision('revision')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
                <span>Minta Revisi</span>
              </button>
              <button
                type="button"
                className="btn-approve-solid"
                onClick={() => handleDrawerDecision('approved')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Setujui Berkas</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* ─── 6) FLOATING BULK ACTION BAR ──────────────────────────────────────── */}
      {selectedIds.size > 0 && (
        <div className="bulk-action-bar">
          <span>{selectedIds.size} kelompok dipilih</span>
          <button type="button" className="bulk-btn" onClick={handleBulkApprove}>
            Setujui Semua
          </button>
          <button
            type="button"
            className="bulk-btn"
            onClick={() =>
              triggerAdminToast(`Pengingat WhatsApp dikirim ke ${selectedIds.size} ketua kelompok!`)
            }
          >
            Kirim Pengingat WA
          </button>
          <button type="button" className="bulk-btn" onClick={handleExportCsv}>
            Ekspor
          </button>
          <button
            type="button"
            className="bulk-btn"
            style={{ backgroundColor: '#DC2626' }}
            onClick={handleBulkDelete}
          >
            Hapus Terpilih
          </button>
          <button
            type="button"
            className="bulk-btn"
            style={{ background: 'none', textDecoration: 'underline' }}
            onClick={() => setSelectedIds(new Set())}
          >
            Batal
          </button>
        </div>
      )}

      {/* ─── 7) COMMAND PALETTE MODAL (CTRL+K) ────────────────────────────────── */}
      {paletteOpen && (
        <div
          className="palette-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPaletteOpen(false);
          }}
        >
          <div className="palette-container" role="dialog" aria-modal="true">
            <div className="palette-input-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                autoFocus
                className="palette-search-input"
                value={paletteQuery}
                onChange={(e) => setPaletteQuery(e.target.value)}
                placeholder="Ketik nomor kelompok (contoh: KEL-03) atau nama SMP..."
              />
              <kbd className="search-kbd-hint">ESC</kbd>
            </div>
            <ul className="palette-results-list">
              <li className="palette-group-label">Kelompok Terkait</li>
              {paletteMatches.length === 0 ? (
                <li
                  style={{
                    padding: 12,
                    fontSize: 13,
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                  }}
                >
                  Tidak ada kelompok ditemukan
                </li>
              ) : (
                paletteMatches.map((grp) => (
                  <li
                    key={grp.id}
                    className="palette-result-item"
                    onClick={() => {
                      setPaletteOpen(false);
                      setDrawerGroupId(grp.id);
                    }}
                  >
                    <div>
                      <strong>{grp.id}</strong> — {grp.smp}
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {grp.ketua} • {grp.tahapName}
                      </div>
                    </div>
                    <span
                      className={`status-badge ${
                        grp.status === 'menunggu' ? 'badge-review' : 'badge-progress'
                      }`}
                      style={{ fontSize: 10 }}
                    >
                      {grp.status === 'menunggu' ? 'Review' : 'Detail'}
                    </span>
                  </li>
                ))
              )}
              <li className="palette-group-label" style={{ marginTop: 8 }}>
                Aksi Cepat
              </li>
              <li
                className="palette-result-item"
                onClick={() => {
                  setPaletteOpen(false);
                  setCurrentTab('review');
                }}
              >
                <div>Tampilkan {reviewCount} Berkas Menunggu Review</div>
                <kbd className="search-kbd-hint">R</kbd>
              </li>
              <li
                className="palette-result-item"
                onClick={() => {
                  setPaletteOpen(false);
                  handleExportCsv();
                }}
              >
                <div>Ekspor Laporan Kelompok ke CSV</div>
                <kbd className="search-kbd-hint">E</kbd>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* ─── 8) CRUD MODAL: TAMBAH / EDIT KELOMPOK ────────────────────────────── */}
      {crudModalOpen && (
        <div
          className="palette-modal-backdrop"
          style={{ alignItems: 'center', paddingTop: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setCrudModalOpen(false);
          }}
        >
          <div className="palette-container" style={{ width: 520, padding: 24 }} role="dialog" aria-modal="true">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-brand)', textTransform: 'uppercase' }}>
                  {crudMode === 'create' ? 'Create Data' : `Update Data • ${editingOriginalId}`}
                </span>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-ink)', margin: '2px 0 0 0' }}>
                  {crudMode === 'create' ? 'Tambah Kelompok Baru' : 'Edit Data Kelompok'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCrudModalOpen(false)}
                style={{ color: 'var(--text-muted)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={(e) => void handleSaveCrudForm(e)} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-ink)' }}>No. Kelompok</label>
                  <input
                    type="text"
                    required
                    value={crudForm.number}
                    onChange={(e) => setCrudForm({ ...crudForm, number: e.target.value })}
                    placeholder="25"
                    style={{
                      height: 38,
                      padding: '0 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-hairline)',
                      fontSize: 13,
                      color: 'var(--text-ink)',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-ink)' }}>Nama SMP Mitra</label>
                  <input
                    type="text"
                    required
                    value={crudForm.smp}
                    onChange={(e) => setCrudForm({ ...crudForm, smp: e.target.value })}
                    placeholder="Contoh: SMPN 3 Sidoarjo"
                    style={{
                      height: 38,
                      padding: '0 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-hairline)',
                      fontSize: 13,
                      color: 'var(--text-ink)',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-ink)' }}>Kecamatan</label>
                  <input
                    type="text"
                    required
                    value={crudForm.kecamatan}
                    onChange={(e) => setCrudForm({ ...crudForm, kecamatan: e.target.value })}
                    placeholder="Sidoarjo"
                    style={{
                      height: 38,
                      padding: '0 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-hairline)',
                      fontSize: 13,
                      color: 'var(--text-ink)',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-ink)' }}>Jumlah Siswa Relawan</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    required
                    value={crudForm.jumlahSiswa}
                    onChange={(e) => setCrudForm({ ...crudForm, jumlahSiswa: Number(e.target.value) })}
                    style={{
                      height: 38,
                      padding: '0 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-hairline)',
                      fontSize: 13,
                      color: 'var(--text-ink)',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-ink)' }}>
                    Nama Ketua (Kosongkan jika belum ada)
                  </label>
                  <input
                    type="text"
                    value={crudForm.ketua}
                    onChange={(e) => setCrudForm({ ...crudForm, ketua: e.target.value })}
                    placeholder="Contoh: Budi Santoso"
                    style={{
                      height: 38,
                      padding: '0 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-hairline)',
                      fontSize: 13,
                      color: 'var(--text-ink)',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-ink)' }}>No. WhatsApp Ketua</label>
                  <input
                    type="text"
                    value={crudForm.wa}
                    onChange={(e) => setCrudForm({ ...crudForm, wa: e.target.value })}
                    placeholder="6281234567890"
                    style={{
                      height: 38,
                      padding: '0 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-hairline)',
                      fontSize: 13,
                      color: 'var(--text-ink)',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-ink)' }}>Tahap Saat Ini</label>
                  <select
                    value={crudForm.tahap}
                    onChange={(e) => setCrudForm({ ...crudForm, tahap: Number(e.target.value) })}
                    style={{
                      height: 38,
                      padding: '0 10px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-hairline)',
                      fontSize: 13,
                      color: 'var(--text-ink)',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    {STAGES_LIST.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.no} — {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-ink)' }}>Status Kelompok</label>
                  <select
                    value={crudForm.status}
                    onChange={(e) =>
                      setCrudForm({ ...crudForm, status: e.target.value as AdminGroupItem['status'] })
                    }
                    style={{
                      height: 38,
                      padding: '0 10px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-hairline)',
                      fontSize: 13,
                      color: 'var(--text-ink)',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <option value="berjalan">Berjalan</option>
                    <option value="menunggu">Menunggu Review</option>
                    <option value="terlambat">Terlambat / Revisi</option>
                    <option value="selesai">Selesai</option>
                    <option value="belumKetua">Belum Ada Ketua</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-ink)' }}>Tugas Selesai</label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={crudForm.tugasSelesai}
                    onChange={(e) => setCrudForm({ ...crudForm, tugasSelesai: Number(e.target.value) })}
                    style={{
                      height: 38,
                      padding: '0 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-hairline)',
                      fontSize: 13,
                      color: 'var(--text-ink)',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-ink)' }}>Total Tugas Tahap Ini</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={crudForm.tugasTotal}
                    onChange={(e) => setCrudForm({ ...crudForm, tugasTotal: Number(e.target.value) })}
                    style={{
                      height: 38,
                      padding: '0 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-hairline)',
                      fontSize: 13,
                      color: 'var(--text-ink)',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8, paddingTop: 14, borderTop: '1px solid var(--border-hairline)' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setCrudModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn-primary">
                  <span>{crudMode === 'create' ? 'Simpan Kelompok Baru' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── 9) MODAL KONFIRMASI HAPUS KELOMPOK ───────────────────────────────── */}
      {deleteConfirmGroup && (
        <div
          className="palette-modal-backdrop"
          style={{ alignItems: 'center', paddingTop: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteConfirmGroup(null);
          }}
        >
          <div className="palette-container" style={{ width: 420, padding: 24 }} role="dialog" aria-modal="true">
            <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-ink)', margin: 0 }}>
              Hapus {deleteConfirmGroup.id}?
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-body)', marginTop: 8, lineHeight: 1.5 }}>
              Anda yakin ingin menghapus data <strong>{deleteConfirmGroup.id} ({deleteConfirmGroup.smp})</strong>?
              Anda masih dapat mengurungkan penghapusan dalam 5 detik setelah dihapus.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setDeleteConfirmGroup(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{ backgroundColor: '#DC2626' }}
                onClick={() => void handleConfirmDeleteGroup(deleteConfirmGroup)}
              >
                Ya, Hapus Kelompok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 10) TOAST CONTAINER WITH UNDO ────────────────────────────────────── */}
      {adminToast && (
        <div className="toast-container">
          <div className="toast-card">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span style={{ flex: 1 }}>{adminToast.message}</span>
            {adminToast.undoFn && (
              <>
                <button
                  type="button"
                  className="toast-undo-btn"
                  onClick={() => {
                    adminToast.undoFn?.();
                  }}
                >
                  Urungkan
                </button>
                <div className="toast-progress-bar" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMonitoringPage;
