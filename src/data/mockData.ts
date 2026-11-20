export interface TeamRosterMember {
  id: string;
  nis: string;
  name: string;
  role: string;
  isLeader: boolean;
}

export const generateMockMembers = (groupNumber: string, leaderName: string, isLeaderAssigned: boolean): TeamRosterMember[] => {
  if (groupNumber === '00') {
    return [
      { id: '00-1', nis: '000000', name: 'Ketua Uji Coba', role: 'Ketua Kelompok', isLeader: true },
      { id: '00-2', nis: '000001', name: 'Anggota Simulasi 1', role: 'Sekretaris & Notulen', isLeader: false },
      { id: '00-3', nis: '000002', name: 'Anggota Simulasi 2', role: 'Bendahara / Logistik', isLeader: false },
      { id: '00-4', nis: '000003', name: 'Anggota Simulasi 3', role: 'Anggota Tim', isLeader: false },
      { id: '00-5', nis: '000004', name: 'Anggota Simulasi 4', role: 'Anggota Tim', isLeader: false },
    ];
  }

  const num = parseInt(groupNumber, 10) || 1;
  const baseNis = 54124100 + num * 10;

  const studentPool = [
    'Ahmad Rizky Pratama',
    'Nabila Putri Ramadhani',
    'Dimas Bagus Wicaksono',
    'Siti Nurhaliza',
    'Bagus Pratama Putra',
    'Kevin Alamsyah',
    'Fahri Ramadhan',
    'Rian Hidayat',
    'Dewi Maharani',
    'Putri Ayu Wandira',
    'Zidan Maulana',
    'Aulia Rahman',
    'Anisa Rahmawati',
    'Rizal Fauzi',
    'Doni Firmansyah',
    'Fandi Ahmad',
    'Hendra Setiawan',
    'Indra Djati',
    'Joko Anwar',
    'Kiki Narendra'
  ];

  const members: TeamRosterMember[] = [];
  const count = num % 2 === 0 ? 8 : 7;
  const hasAssignedLeader = Boolean(isLeaderAssigned && leaderName && !leaderName.includes('Belum'));

  for (let i = 0; i < count; i++) {
    const isFirst = i === 0;
    const name = isFirst && hasAssignedLeader ? leaderName : studentPool[(num * 3 + i) % studentPool.length];
    const role = isFirst && hasAssignedLeader ? 'Ketua Kelompok' : i === 1 ? 'Sekretaris & Notulen' : i === 2 ? 'Bendahara / Logistik' : 'Anggota Tim';

    members.push({
      id: `${groupNumber}-${i + 1}`,
      nis: (baseNis + i).toString(),
      name,
      role,
      isLeader: Boolean(isFirst && hasAssignedLeader),
    });
  }

  return members;
};

export interface Member {
  id: string;
  name: string;
  role: string;
  instagramUrl?: string;
  status: 'valid' | 'pending';
  initials: string;
}

export interface Group {
  id: string;
  number: string;
  schoolName: string;
  schoolAddress: string;
  district: string;
  leaderName: string;
  mentorName: string;
  memberCount: number;
  featuredModule: string;
  status: 'ontrack' | 'review' | 'revisi' | 'overdue';
  statusLabel: string;
  targetDate: string;
  progressPercent: number;
  currentStep: number;
  steps: {
    step1: 'done';
    step2: 'done';
    step3: 'done' | 'review' | 'revisi' | 'overdue' | 'locked';
    step4: 'done' | 'review' | 'revisi' | 'overdue' | 'in_progress' | 'locked';
    step5: 'locked';
    step6: 'locked';
  };
  notes?: string;
  hasLeader?: boolean;
  isLeaderLocked?: boolean;
  leaderNis?: string;
  leaderEmail?: string;
}

export interface SprintTask {
  id: string;
  title: string;
  column: 'todo' | 'in_progress' | 'done';
  priority?: 'high' | 'medium' | 'low';
  assignee: string;
  assigneeInitials: string;
  dueDate: string;
  subtext: string;
  isOverdue?: boolean;
}

export interface ActivityEvent {
  id: string;
  groupId: string;
  title: string;
  subtitle: string;
  timeAgo: string;
  author: string;
}

export interface UrgentAlert {
  id: string;
  groupName: string;
  issue: string;
  deadline: string;
  severity: 'danger' | 'warning' | 'info';
}

export const initialMembersKelompok03: Member[] = [
  { id: '01', name: 'Ahmad Rizky', role: 'Ketua Regu', instagramUrl: 'instagram.com/p/C3D8a9mKx1', status: 'valid', initials: 'AR' },
  { id: '02', name: 'Nabila Putri R.', role: 'Notulen & Koord.', instagramUrl: 'instagram.com/p/C3E1b2nPq4', status: 'valid', initials: 'NP' },
  { id: '03', name: 'Rafi Fadillah', role: 'Desain Grafis', instagramUrl: 'instagram.com/p/C3E9x7tLw8', status: 'valid', initials: 'RF' },
  { id: '04', name: 'Dinda Salsabila', role: 'Koord. Materi', instagramUrl: 'instagram.com/p/C3F3y5vRz0', status: 'valid', initials: 'DS' },
  { id: '05', name: 'M. Arya Bima', role: 'Dokumentasi', instagramUrl: 'instagram.com/p/C3G0m1sTy2', status: 'valid', initials: 'AB' },
  { id: '06', name: 'Siti Aisyah', role: 'Logistik', status: 'pending', initials: 'SA' },
  { id: '07', name: 'Bagas Pratama', role: 'Anggota', status: 'pending', initials: 'BP' },
  { id: '08', name: 'Zahra Amelia', role: 'Anggota', status: 'pending', initials: 'ZA' },
];

export const initialSprintTasks: SprintTask[] = [
  {
    id: 'task-1',
    title: 'Cetak fisik X-Banner di percetakan rekanan SMK Telkom Sidoarjo',
    column: 'todo',
    priority: 'high',
    assignee: 'Nabila Putri',
    assigneeInitials: 'NP',
    dueDate: '14 Feb',
    subtext: 'Menunggu acc kurikulum'
  },
  {
    id: 'task-2',
    title: 'Verifikasi layout feed Instagram dari 3 siswa tersisa',
    column: 'in_progress',
    priority: 'medium',
    assignee: 'Clara Anggita',
    assigneeInitials: 'CA',
    dueDate: '13 Feb',
    subtext: 'PIC: Siti, Bagas, Zahra'
  },
  {
    id: 'task-3',
    title: 'Pengambilan foto survei lab komputer SMPN 1 Buduran',
    column: 'done',
    assignee: 'Dimas Aditya',
    assigneeInitials: 'DA',
    dueDate: '08 Feb',
    subtext: '08 Feb 2026 · Arsip tersimpan'
  }
];

export const rawGroupsData: Group[] = [
  // ─── 4 Menunggu Review ──────────────────────────────────────────────────
  {
    id: '03',
    number: '03',
    schoolName: 'SMPN 1 Buduran',
    schoolAddress: 'Jl. Raya Buduran No. 42, Sidoarjo (3.4 km dari SMK Telkom)',
    district: 'Buduran',
    leaderName: 'Nabila Putri Ramadhani',
    mentorName: 'Pak Budi Hartono, S.Kom',
    memberCount: 8,
    featuredModule: 'Literasi Visual AI & Canva',
    status: 'review',
    statusLabel: 'Menunggu Review',
    targetDate: '18 Feb 2026',
    progressPercent: 67,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'review', step5: 'locked', step6: 'locked' },
    notes: 'Tahap 04 • Draf X-Banner 60x160cm & Poster A3 diajukan 45 menit lalu.'
  },
  {
    id: '02',
    number: '02',
    schoolName: 'SMPN 1 Waru',
    schoolAddress: 'Jl. Jend. S. Parman No. 2, Waru, Sidoarjo',
    district: 'Waru',
    leaderName: 'Dimas Bagus Wicaksono',
    mentorName: 'Siti Aminah, M.Kom',
    memberCount: 8,
    featuredModule: 'Computational Thinking dengan Scratch',
    status: 'review',
    statusLabel: 'Menunggu Review',
    targetDate: '19 Feb 2026',
    progressPercent: 60,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'review', step5: 'locked', step6: 'locked' },
    notes: 'Tahap 04 • Modul Animasi Scratch & Desain X-Banner diajukan.'
  },
  {
    id: '06',
    number: '06',
    schoolName: 'SMPN 1 Tulangan',
    schoolAddress: 'Jl. Kenanga No. 8, Tulangan, Sidoarjo',
    district: 'Tulangan',
    leaderName: 'Bagus Pratama Putra',
    mentorName: 'Lilik Rahayu, S.Pd',
    memberCount: 8,
    featuredModule: 'Desain Komunikasi Visual & Infografis',
    status: 'review',
    statusLabel: 'Menunggu Review',
    targetDate: '21 Feb 2026',
    progressPercent: 62,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'review', step5: 'locked', step6: 'locked' },
    notes: 'Tahap 04 • Draf Desain Roll Banner & Materi Infografis.'
  },
  {
    id: '12',
    number: '12',
    schoolName: 'SMPN 2 Taman',
    schoolAddress: 'Jl. Raya Bebekan No. 10, Taman, Sidoarjo',
    district: 'Taman',
    leaderName: 'Kevin Alamsyah',
    mentorName: 'Dra. Endang Purwanti',
    memberCount: 7,
    featuredModule: 'Literasi AI & Pemanfaatan Chatbot Edukatif',
    status: 'review',
    statusLabel: 'Menunggu Review',
    targetDate: '20 Feb 2026',
    progressPercent: 65,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'review', step5: 'locked', step6: 'locked' },
    notes: 'Tahap 04 • Draf Slide Presentasi & X-Banner Lab Komputer.'
  },

  // ─── 3 Terlambat / Kritis ───────────────────────────────────────────────
  {
    id: '07',
    number: '07',
    schoolName: 'SMP Telkom Sidoarjo',
    schoolAddress: 'Jl. Raya Pecantingan, Sekardangan, Sidoarjo',
    district: 'Sidoarjo',
    leaderName: 'Fahri Ramadhan',
    mentorName: 'Bambang Irawan, M.Kom',
    memberCount: 8,
    featuredModule: 'Dasar Robotika & Mikrokontroler IoT',
    status: 'overdue',
    statusLabel: 'Terlambat 2 Hari',
    targetDate: '14 Feb 2026',
    progressPercent: 50,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'overdue', step5: 'locked', step6: 'locked' },
    notes: 'Tahap 04 • Terlambat unggah desain poster dan draf X-Banner fisik.'
  },
  {
    id: '04',
    number: '04',
    schoolName: 'SMPN 2 Krian',
    schoolAddress: 'Jl. Setiabudi No. 12, Krian, Sidoarjo',
    district: 'Krian',
    leaderName: 'Siti Nurhaliza',
    mentorName: 'Achmad Fauzi, S.T',
    memberCount: 7,
    featuredModule: 'Literasi Keamanan Digital & Anti-Bullying',
    status: 'overdue',
    statusLabel: 'Terlambat 1 Hari',
    targetDate: '15 Feb 2026',
    progressPercent: 48,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'overdue', step5: 'locked', step6: 'locked' },
    notes: 'Tahap 04 • Berkas slide presentasi belum diunggah melewati deadline.'
  },
  {
    id: '09',
    number: '09',
    schoolName: 'SMPN 1 Taman',
    schoolAddress: 'Jl. Ngelom No. 4, Taman, Sidoarjo',
    district: 'Taman',
    leaderName: 'Rian Hidayat',
    mentorName: 'Eko Wahyudi, S.Kom',
    memberCount: 7,
    featuredModule: 'Etika Bermedia Sosial & Cek Fakta Hoaks',
    status: 'overdue',
    statusLabel: 'Terlambat 3 Hari',
    targetDate: '13 Feb 2026',
    progressPercent: 35,
    currentStep: 3,
    steps: { step1: 'done', step2: 'done', step3: 'overdue', step4: 'locked', step5: 'locked', step6: 'locked' },
    notes: 'Tahap 03 • Revisi RPP Lab dan modul praktikum belum diajukan kembali.'
  },

  // ─── 1 Perlu Revisi ─────────────────────────────────────────────────────
  {
    id: '05',
    number: '05',
    schoolName: 'SMPN 2 Candi',
    schoolAddress: 'Jl. Raya Candi, Sepande, Sidoarjo',
    district: 'Candi',
    leaderName: 'Dewi Maharani',
    mentorName: 'Nurul Hidayati, S.Pd',
    memberCount: 7,
    featuredModule: 'Keamanan Gadget & Medsos Remaja',
    status: 'revisi',
    statusLabel: 'Perlu Revisi',
    targetDate: '19 Feb 2026',
    progressPercent: 40,
    currentStep: 3,
    steps: { step1: 'done', step2: 'done', step3: 'revisi', step4: 'locked', step5: 'locked', step6: 'locked' },
    notes: 'Tahap 03 • Perbaikan RPP Pertemuan 2 perlu penyesuaian alokasi durasi lab.'
  },

  // ─── 16 Sesuai Jadwal (On Track) ─────────────────────────────────────────
  {
    id: '01',
    number: '01',
    schoolName: 'SMPN 1 Sidoarjo',
    schoolAddress: 'Jl. Ponti, Magersari, Sidoarjo',
    district: 'Sidoarjo',
    leaderName: 'Raffi Akbar Pratama',
    mentorName: 'Agus Setiawan, S.T',
    memberCount: 8,
    featuredModule: 'Web Dasar HTML/CSS & Hosting',
    status: 'ontrack',
    statusLabel: 'Sesuai Jadwal',
    targetDate: '18 Feb 2026',
    progressPercent: 66,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'done', step5: 'locked', step6: 'locked' },
    notes: 'Desain banner telah dicetak. Siap kickoff mengajar.'
  },
  {
    id: '08',
    number: '08',
    schoolName: 'SMPN 2 Sukodono',
    schoolAddress: 'Jl. Raya Sukodono No. 15, Sidoarjo',
    district: 'Sukodono',
    leaderName: 'Putri Ayu Wandira',
    mentorName: 'Rudi Hartono, M.Pd',
    memberCount: 8,
    featuredModule: 'Dasar Pemrograman Web Sederhana',
    status: 'ontrack',
    statusLabel: 'Sesuai Jadwal',
    targetDate: '22 Feb 2026',
    progressPercent: 66,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'done', step5: 'locked', step6: 'locked' }
  },
  {
    id: '10',
    number: '10',
    schoolName: 'SMP Hang Tuah 5',
    schoolAddress: 'Jl. Candi Pari No. 9, Sidoarjo',
    district: 'Candi',
    leaderName: 'Kevin Sanjaya',
    mentorName: 'Tri Wulandari, S.Pd',
    memberCount: 8,
    featuredModule: 'Desain Stiker Promosi Kreatif',
    status: 'ontrack',
    statusLabel: 'Sesuai Jadwal',
    targetDate: '22 Feb 2026',
    progressPercent: 65,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'done', step5: 'locked', step6: 'locked' }
  },
  {
    id: '11',
    number: '11',
    schoolName: 'SMPN 3 Porong',
    schoolAddress: 'Jl. Glagaharum, Porong, Sidoarjo',
    district: 'Porong',
    leaderName: 'Zidan Maulana',
    mentorName: 'Endah Sulistyo, S.Pd',
    memberCount: 8,
    featuredModule: 'Pembuatan Konten Edukasi Kreatif TikTok',
    status: 'ontrack',
    statusLabel: 'Sesuai Jadwal',
    targetDate: '20 Feb 2026',
    progressPercent: 66,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'done', step5: 'locked', step6: 'locked' }
  },
  {
    id: '13',
    number: '13',
    schoolName: 'SMPN 1 Wonoayu',
    schoolAddress: 'Jl. Raya Wonoayu No. 25, Sidoarjo',
    district: 'Wonoayu',
    leaderName: 'Ferry Ardiansyah',
    mentorName: 'Drs. Supriyadi, M.Pd',
    memberCount: 8,
    featuredModule: 'Dasar Animasi 2D & Motion Graphic',
    status: 'ontrack',
    statusLabel: 'Sesuai Jadwal',
    targetDate: '22 Feb 2026',
    progressPercent: 66,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'done', step5: 'locked', step6: 'locked' }
  },
  {
    id: '14',
    number: '14',
    schoolName: 'SMPN 1 Sedati',
    schoolAddress: 'Jl. Pulungan, Sedati, Sidoarjo',
    district: 'Sedati',
    leaderName: 'Anisa Rahmawati',
    mentorName: 'Hendra Kurnia, M.Pd',
    memberCount: 7,
    featuredModule: 'Public Speaking & Presentasi Interaktif',
    status: 'ontrack',
    statusLabel: 'Sesuai Jadwal',
    targetDate: '21 Feb 2026',
    progressPercent: 66,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'done', step5: 'locked', step6: 'locked' }
  },
  {
    id: '15',
    number: '15',
    schoolName: 'SMPN 1 Candi',
    schoolAddress: 'Jl. Raya Gelam No. 8, Candi, Sidoarjo',
    district: 'Candi',
    leaderName: 'Bayu Saputra',
    mentorName: 'Sri Wahyuni, M.Pd',
    memberCount: 8,
    featuredModule: 'Literasi Keuangan Digital Siswa',
    status: 'ontrack',
    statusLabel: 'Sesuai Jadwal',
    targetDate: '23 Feb 2026',
    progressPercent: 66,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'done', step5: 'locked', step6: 'locked' }
  },
  {
    id: '16',
    number: '16',
    schoolName: 'SMPN 2 Waru',
    schoolAddress: 'Jl. Tropodo II No. 14, Waru, Sidoarjo',
    district: 'Waru',
    leaderName: 'Nadya Safira',
    mentorName: 'Wahyu Hidayat, S.Kom',
    memberCount: 8,
    featuredModule: 'Logika Algoritma Game Sederhana',
    status: 'ontrack',
    statusLabel: 'Sesuai Jadwal',
    targetDate: '23 Feb 2026',
    progressPercent: 66,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'done', step5: 'locked', step6: 'locked' }
  },
  {
    id: '17',
    number: '17',
    schoolName: 'SMPN 1 Prambon',
    schoolAddress: 'Jl. Raya Prambon No. 17, Sidoarjo',
    district: 'Prambon',
    leaderName: 'Gilang Ramadhan',
    mentorName: 'Dra. Siti Masitoh',
    memberCount: 7,
    featuredModule: 'Fotografi Ponsel & Editing Konten',
    status: 'ontrack',
    statusLabel: 'Sesuai Jadwal',
    targetDate: '24 Feb 2026',
    progressPercent: 66,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'done', step5: 'locked', step6: 'locked' }
  },
  {
    id: '18',
    number: '18',
    schoolName: 'SMPN 1 Tarik',
    schoolAddress: 'Jl. Raya Tarik No. 5, Sidoarjo',
    district: 'Tarik',
    leaderName: 'Ilham Kurniawan',
    mentorName: 'Budi Santoso, S.Pd',
    memberCount: 8,
    featuredModule: 'Desain UI Aplikasi Mobile Sederhana',
    status: 'ontrack',
    statusLabel: 'Sesuai Jadwal',
    targetDate: '24 Feb 2026',
    progressPercent: 66,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'done', step5: 'locked', step6: 'locked' }
  },
  {
    id: '19',
    number: '19',
    schoolName: 'SMPN 1 Krembung',
    schoolAddress: 'Jl. Raya Krembung No. 22, Sidoarjo',
    district: 'Krembung',
    leaderName: 'Melati Indah',
    mentorName: 'Dwi Astuti, M.Pd',
    memberCount: 7,
    featuredModule: 'Keamanan Akun & Password Proteksi',
    status: 'ontrack',
    statusLabel: 'Sesuai Jadwal',
    targetDate: '24 Feb 2026',
    progressPercent: 66,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'done', step5: 'locked', step6: 'locked' }
  },
  {
    id: '20',
    number: '20',
    schoolName: 'SMPN 1 Tanggulangin',
    schoolAddress: 'Jl. Raya Kludan No. 3, Tanggulangin',
    district: 'Tanggulangin',
    leaderName: 'Rizky Pratama',
    mentorName: 'H. Suwandi, M.Kom',
    memberCount: 8,
    featuredModule: 'E-Commerce Sederhana & Toko Online',
    status: 'ontrack',
    statusLabel: 'Sesuai Jadwal',
    targetDate: '25 Feb 2026',
    progressPercent: 66,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'done', step5: 'locked', step6: 'locked' }
  },
  {
    id: '21',
    number: '21',
    schoolName: 'SMPN 2 Buduran',
    schoolAddress: 'Jl. Prasung, Buduran, Sidoarjo',
    district: 'Buduran',
    leaderName: 'Syifa Nur Aini',
    mentorName: 'Rina Marlina, S.T',
    memberCount: 7,
    featuredModule: 'Pemanfaatan Google Workspace Siswa',
    status: 'ontrack',
    statusLabel: 'Sesuai Jadwal',
    targetDate: '25 Feb 2026',
    progressPercent: 66,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'done', step5: 'locked', step6: 'locked' }
  },
  {
    id: '22',
    number: '22',
    schoolName: 'SMPN 3 Sidoarjo',
    schoolAddress: 'Jl. Raya Sidoarjo No. 88, Sidoarjo',
    district: 'Sidoarjo',
    leaderName: 'Doni Firmansyah',
    mentorName: 'Ahmad Basuki, M.Pd',
    memberCount: 8,
    featuredModule: 'Podcast Kreatif & Rekaman Audio Edukasi',
    status: 'ontrack',
    statusLabel: 'Sesuai Jadwal',
    targetDate: '25 Feb 2026',
    progressPercent: 66,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'done', step5: 'locked', step6: 'locked' }
  },
  {
    id: '23',
    number: '23',
    schoolName: 'SMPN 2 Sedati',
    schoolAddress: 'Jl. Betro No. 12, Sedati, Sidoarjo',
    district: 'Sedati',
    leaderName: 'Fiona Anggraeni',
    mentorName: 'Sri Mulyani, S.Pd',
    memberCount: 7,
    featuredModule: 'Dasar Desain 3D Sederhana TinkerCAD',
    status: 'ontrack',
    statusLabel: 'Sesuai Jadwal',
    targetDate: '26 Feb 2026',
    progressPercent: 66,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'done', step5: 'locked', step6: 'locked' }
  },
  {
    id: '24',
    number: '24',
    schoolName: 'SMPN 4 Sidoarjo',
    schoolAddress: 'Jl. Sungon No. 4, Sidoarjo',
    district: 'Sidoarjo',
    leaderName: 'Tegar Wicaksono',
    mentorName: 'Drs. Mochammad Sholeh',
    memberCount: 8,
    featuredModule: 'Video Editing CapCut untuk Pelajar',
    status: 'ontrack',
    statusLabel: 'Sesuai Jadwal',
    targetDate: '26 Feb 2026',
    progressPercent: 66,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'done', step5: 'locked', step6: 'locked' }
  }
];

export const groupsData: Group[] = [
  ...[...rawGroupsData]
    .filter((g) => g.number !== '00')
    .sort((a, b) => parseInt(a.number, 10) - parseInt(b.number, 10))
    .map((g) => {
    const num = parseInt(g.number, 10);
    const isUnassigned = num === 23 || num === 24 || g.leaderName.includes('Belum');
    return {
      ...g,
      hasLeader: !isUnassigned,
      isLeaderLocked: !isUnassigned,
      leaderName: isUnassigned ? 'Belum Ditentukan' : g.leaderName,
      leaderNis: isUnassigned
        ? undefined
        : g.number === '03'
        ? '54124130'
        : (54124100 + num * 10).toString(),
      leaderEmail: isUnassigned
        ? undefined
        : g.number === '03'
        ? 'nabila.putri@smktelkom-sda.sch.id'
        : `${g.leaderName.toLowerCase().replace(/[^a-z]/g, '.')}@smktelkom-sda.sch.id`,
    };
  }),
  {
    id: '00',
    number: '00',
    schoolName: 'SMP Mitra Simulasi',
    schoolAddress: 'Lab Simulasi Vokasi, SMK Telkom Sidoarjo',
    district: 'Sidoarjo',
    leaderName: 'Ketua Uji Coba',
    hasLeader: true,
    isLeaderLocked: true,
    leaderNis: '000000',
    leaderEmail: 'uji.ketua@smktelkom-sda.sch.id',
    mentorName: 'Guru Pembimbing Simulasi',
    memberCount: 5,
    featuredModule: 'Sandbox Workspace Uji Coba',
    status: 'ontrack',
    statusLabel: 'Sesuai Jadwal',
    targetDate: '28 Feb 2026',
    progressPercent: 75,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'done', step5: 'locked', step6: 'locked' },
    notes: 'Akun sandbox terisolasi untuk simulasi dan pengujian sistem.',
  },
];

export const urgentAlerts: UrgentAlert[] = [
  { id: '1', groupName: 'Kel. 07 (SMP Telkom)', issue: 'Terlambat 2 hari: Unggah X-Banner & Poster', deadline: 'Tenggat: 10 Feb 2026, 23:59', severity: 'danger' },
  { id: '2', groupName: 'Kel. 09 (SMPN 1 Taman)', issue: 'Terlambat 1 hari: Revisi Draf Materi Modul', deadline: 'Tenggat: 11 Feb 2026, 17:00', severity: 'danger' },
  { id: '3', groupName: 'Kel. 03 (SMPN 1 Buduran)', issue: 'Draf X-Banner menunggu persetujuan admin', deadline: 'Diajukan 45 menit lalu oleh Nabila', severity: 'warning' },
  { id: '4', groupName: 'Kel. 06 (SMPN 1 Tulangan)', issue: 'Modul presentasi menunggu review akhir', deadline: 'Diajukan 2 jam lalu oleh Bagus', severity: 'warning' },
  { id: '5', groupName: 'Kel. 05 (SMPN 2 Candi)', issue: 'Revisi RPP belum disubmit ulang', deadline: 'Catatan revisi dikirim 1 hari lalu', severity: 'info' }
];

export const activityFeed: ActivityEvent[] = [
  { id: 'a1', groupId: '05', title: 'Kel. 05 mengunggah Draf materi v2', subtitle: 'Dewi Maharani memperbarui modul RPP', timeAgo: '12 menit lalu', author: 'Dewi Maharani' },
  { id: 'a2', groupId: '03', title: 'Kel. 03 menyelesaikan Langkah 03', subtitle: 'Disetujui otomatis oleh sistem kurikulum', timeAgo: '45 menit lalu', author: 'Sistem Otomatis' },
  { id: 'a3', groupId: '01', title: 'Dra. Sri Wahyuni menyetujui Modul Kel. 01', subtitle: 'Catatan: "Lengkap dan sangat interaktif"', timeAgo: '2 jam lalu', author: 'Dra. Sri Wahyuni' },
  { id: 'a4', groupId: '11', title: 'Kel. 11 memperbarui Feed Instagram (5/8)', subtitle: 'Siswa mengunggah teaser kampanye resmi', timeAgo: '3 jam lalu', author: 'Desain Grafis' }
];

export interface ShowcaseProject {
  id: string;
  tag: string;
  title: string;
  desc: string;
  fullDesc?: string;
  school: string;
  image: string;
  tools?: string[];
  duration?: string;
  studentsTrained?: number;
}

export interface DocumentaryMoment {
  id: string;
  title: string;
  category: string;
  school: string;
  date: string;
  participants: string;
  caption: string;
  image: string;
  quote?: {
    text: string;
    author: string;
    role: string;
  };
}

export interface HeroSpotlight {
  id: string;
  schoolName: string;
  groupNumber: string;
  district: string;
  moduleTitle: string;
  mentorName: string;
  leaderName: string;
  studentsCount: number;
  status: string;
  image: string;
  quote: string;
  tags: string[];
}

export const showcaseProjects: ShowcaseProject[] = [
  {
    id: 'proj-01',
    tag: 'PELATIHAN',
    title: 'Public Speaking & Pitching Siswa',
    desc: 'Pelatihan komunikasi publik & presentasi interaktif untuk pengurus OSIS.',
    fullDesc: 'Program pembekalan komprehensif bagi 45 pengurus OSIS dalam menyusun narasi presentasi persuasif, teknik vokal, body language, serta pembuatan slide visual ringkas untuk sidang perwakilan kelas.',
    school: 'SMPN 1 Sidoarjo',
    image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=600&auto=format&fit=crop&q=80',
    tools: ['Canva', 'Google Slides', 'Microphone Pro'],
    duration: '2 Pertemuan (6 JP)',
    studentsTrained: 45
  },
  {
    id: 'proj-02',
    tag: 'WEBSITE',
    title: 'Portal Berita OSIS & Mading Digital',
    desc: 'Portal berita dan mading daring responsif berbasis web modern tanpa coding rumit.',
    fullDesc: 'Pendampingan pembuatan platform media publikasi sekolah berbasis Tailwind CSS sederhana yang memungkinkan tim jurnalis sekolah mempublikasikan liputan kegiatan, cerpen, dan pengumuman secara mandiri.',
    school: 'SMPN 2 Candi',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80',
    tools: ['HTML5', 'Tailwind', 'GitHub Pages'],
    duration: '2 Pertemuan (6 JP)',
    studentsTrained: 38
  },
  {
    id: 'proj-03',
    tag: 'DESAIN',
    title: 'Poster Edukasi Ekologi & Sanitasi',
    desc: 'Desain kampanye visual ramah lingkungan dan sanitasi sekolah dengan prinsip DKV.',
    fullDesc: 'Pelatihan desain komunikasi visual terpadu menggunakan Canva Education, mengajarkan teori warna, kontras tipografi, dan hierarki visual untuk kampanye hemat plastik dan pemilahan sampah di lingkungan sekolah.',
    school: 'SMPN 1 Buduran',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    tools: ['Canva Edu', 'Figma Basics', 'Pinterest'],
    duration: '2 Pertemuan (6 JP)',
    studentsTrained: 52
  },
  {
    id: 'proj-04',
    tag: 'LITERASI DIGITAL',
    title: 'Buku Saku Digital Cek Hoaks & Cyber Safety',
    desc: 'Modul praktis verifikasi kebenaran informasi dan etika cerdas bermedia sosial.',
    fullDesc: 'Workshop investigasi fakta berbasis browser: membekali siswa SMP cara melakukan reverse image search, mengenali indikasi deepfake dan phishing, serta menjaga privasi data pribadi di platform TikTok dan Instagram.',
    school: 'SMP Telkom Sidoarjo',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    tools: ['Google Fact Check', 'Canva PDF', 'Browser DevTools'],
    duration: '2 Pertemuan (6 JP)',
    studentsTrained: 40
  },
  {
    id: 'proj-05',
    tag: 'CODING',
    title: 'Game Kuis Logika Komputasi',
    desc: 'Game komputasi edukatif interaktif dengan Scratch & pemikiran logika algoritma.',
    fullDesc: 'Pembelajaran Computational Thinking (CT) lewat pemrograman blok visual Scratch 3.0. Siswa membuat permainan teka-teki logika matematika sains yang diujicobakan bersama teman sekelas.',
    school: 'SMPN 1 Sedati',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80',
    tools: ['Scratch 3.0', 'Blockly', 'Logic Trees'],
    duration: '2 Pertemuan (6 JP)',
    studentsTrained: 36
  },
  {
    id: 'proj-06',
    tag: 'MULTIMEDIA',
    title: 'Reels Video Profil Ekstrakurikuler',
    desc: 'Produksi video pendek kreatif dengan teknik framing, cut-to-beat, dan color grading.',
    fullDesc: 'Bimbingan produksi video kreatif smartphone: dari pembuatan naskah video 60 detik, pencahayaan alami, hingga editing visual transisi menggunakan CapCut Desktop.',
    school: 'SMPN 3 Porong',
    image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&auto=format&fit=crop&q=80',
    tools: ['CapCut', 'VN Editor', 'Lighting Kit'],
    duration: '2 Pertemuan (6 JP)',
    studentsTrained: 32
  },
  {
    id: 'proj-07',
    tag: 'ROBOTIKA',
    title: 'Pengenalan Sensor Cerdas IoT',
    desc: 'Dasar otomatisasi sederhana dengan mikrokontroler sensor gerak dan alarm buzzer.',
    fullDesc: 'Siswa SMP diajak merakit prototype pendeteksi jarak menggunakan modul sensor ultrasonik dan Arduino Uno tanpa solder dengan breadboard ramah pemula.',
    school: 'SMP Hang Tuah 5',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
    tools: ['Arduino Uno', 'Tinkercad', 'Ultrasonic Sensor'],
    duration: '2 Pertemuan (6 JP)',
    studentsTrained: 28
  },
  {
    id: 'proj-08',
    tag: 'DESAIN',
    title: 'Identitas Visual Logo Kelas & Merchandise',
    desc: 'Eksplorasi prinsip dasar branding, makna warna, dan desain stiker merchandise.',
    fullDesc: 'Workshop mini pembuatan stiker kelas bertema persatuan. Siswa belajar membuat layout vektor, memahami resolusi ekspor cetak, dan mencetak stiker vinyl secara langsung.',
    school: 'SMPN 1 Tulangan',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80',
    tools: ['Inkscape', 'Vector Editor', 'Vinyl Cutter'],
    duration: '2 Pertemuan (6 JP)',
    studentsTrained: 35
  }
];

export const documentaryStories: DocumentaryMoment[] = [
  {
    id: 'doc-01',
    title: 'Workshop Literasi Komputasi & Pemrograman Web',
    category: 'Sesi Praktik Lab',
    school: 'SMPN 1 Sidoarjo',
    date: '14 Feb 2025',
    participants: '42 Siswa & 2 Guru Pendamping',
    caption: 'Siswa SMPN 1 Sidoarjo antusias merangkai tag HTML pertama mereka di laboratorium komputer sekolah dengan pendampingan mentor SMK Telkom.',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
    quote: {
      text: 'Kakak-kakak SMK Telkom menjelaskannya seru sekali, tidak kaku seperti buku teks biasa!',
      author: 'Aulia Rahma',
      role: 'Siswa Kelas VIII SMPN 1 Sidoarjo'
    }
  },
  {
    id: 'doc-02',
    title: 'Simulasi Presentasi Proyek Akhir Siswa',
    category: 'Gelar Karya',
    school: 'SMPN 2 Candi',
    date: '18 Feb 2025',
    participants: '38 Siswa Perwakilan Kelas',
    caption: 'Tiap kelompok siswa mempresentasikan poster kampanye digital dan prototype mading daring di hadapan dewan guru dan teman sebaya.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    quote: {
      text: 'Kepercayaan diri anak-anak meningkat drastis saat memegang mikrofon dan memaparkan karya mereka sendiri.',
      author: 'Dra. Sri Wahyuni',
      role: 'Guru Pamong SMPN 2 Candi'
    }
  },
  {
    id: 'doc-03',
    title: 'Bimbingan Personal & Problem Solving di Lab',
    category: 'Pendampingan 1-on-1',
    school: 'SMPN 1 Buduran',
    date: '16 Feb 2025',
    participants: '34 Siswa Terbimbing',
    caption: 'Mentor SMK Telkom mendampingi satu per satu siswa dalam mengatasi kendala tata letak desain visual dan palet warna.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    quote: {
      text: 'Pendekatan sebaya (peer learning) membuat siswa tidak ragu bertanya ketika mengalami kendala teknis.',
      author: 'Ahmad Rizky',
      role: 'Ketua Regu 03 Skomda'
    }
  },
  {
    id: 'doc-04',
    title: 'Penyerahan Sertifikat Kemitraan & Modul Ajar MGMP',
    category: 'Kemitraan Formal',
    school: 'SMP Telkom Sidoarjo',
    date: '24 Feb 2025',
    participants: 'Kepala Sekolah & Guru MGMP',
    caption: 'Penyerahan resmi paket modul kurikulum merdeka fase D dari pihak SMK Telkom Sidoarjo kepada perwakilan sekolah mitra.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'doc-05',
    title: 'Gelar Apresiasi & Penutupan Skomda Mengajar Edisi 2025',
    category: 'Penutupan Edisi',
    school: 'Aula Utama SMK Telkom Sidoarjo',
    date: '28 Feb 2025',
    participants: '180 Siswa Relawan & Dosen Pendamping',
    caption: 'Refleksi pencapaian bersama setelah sukses menjangkau 1.400+ siswa SMP di seluruh penjuru Kabupaten Sidoarjo.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'doc-06',
    title: 'Pelatihan Logika Algoritma Game dengan Scratch',
    category: 'Sesi Coding Kreatif',
    school: 'SMPN 1 Sedati',
    date: '20 Feb 2025',
    participants: '30 Siswa Ekstrakurikuler Komputer',
    caption: 'Menciptakan animasi interaktif dan game edukatif komputasi dasar dengan antarmuka blok yang ramah anak.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'doc-07',
    title: 'Praktik Pembuatan Video Edukasi Medsos Remaja',
    category: 'Edukasi Media',
    school: 'SMPN 3 Porong',
    date: '21 Feb 2025',
    participants: '36 Siswa Penggiat Jurnalistik',
    caption: 'Siswa belajar teknik pengambilan angle video smartphone dan penyuntingan konten bermanfaat bebas hoaks.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80'
  }
];

export const heroSchoolSpotlights: HeroSpotlight[] = [
  {
    id: 'spotlight-03',
    schoolName: 'SMPN 1 Buduran',
    groupNumber: '03',
    district: 'Buduran',
    moduleTitle: 'Literasi Visual AI & Canva Kreatif',
    mentorName: 'Pak Budi Hartono, S.Kom',
    leaderName: 'Nabila Putri Ramadhani (XII RPL 2)',
    studentsCount: 34,
    status: 'Draf X-Banner Disetujui',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    quote: 'Melihat adik-adik SMP langsung bisa membuat poster kampanye digital sendiri dalam 90 menit adalah kebanggaan terbesar kami sebagai siswa vokasi.',
    tags: ['Canva Edu', 'Literasi AI', 'Fase D']
  },
  {
    id: 'spotlight-01',
    schoolName: 'SMPN 1 Sidoarjo',
    groupNumber: '01',
    district: 'Sidoarjo Kota',
    moduleTitle: 'Web Dasar HTML/CSS & Hosting Gratis',
    mentorName: 'Agus Setiawan, S.T',
    leaderName: 'Raffi Akbar Pratama (XII RPL 1)',
    studentsCount: 42,
    status: 'RPP & Lab Terverifikasi',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
    quote: 'Membangun antusiasme adik-adik saat teks kode pertama berubah jadi tampilan website adalah momen magis yang tak terlupakan.',
    tags: ['Web Dasar', 'Tailwind', 'Koding Pemula']
  },
  {
    id: 'spotlight-07',
    schoolName: 'SMP Telkom Sidoarjo',
    groupNumber: '07',
    district: 'Sekardangan',
    moduleTitle: 'Dasar Robotika & Mikrokontroler IoT',
    mentorName: 'Bambang Irawan, M.Kom',
    leaderName: 'Fahri Ramadhan (XII TKJ 2)',
    studentsCount: 30,
    status: 'Siap Kit Sensor & Lab',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    quote: 'Siswa SMP sangat penasaran bagaimana sensor ultrasonik bisa mendeteksi tangan dan membunyikan alarm otomatis.',
    tags: ['IoT Cerdas', 'Sensor Praktis', 'STEM']
  },
  {
    id: 'spotlight-05',
    schoolName: 'SMPN 2 Candi',
    groupNumber: '05',
    district: 'Candi',
    moduleTitle: 'Keamanan Gadget & Medsos Remaja',
    mentorName: 'Nurul Hidayati, S.Pd',
    leaderName: 'Dewi Maharani (XII TKJ 1)',
    studentsCount: 36,
    status: 'Modul Reviu Akhir',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    quote: 'Kami mengajari adik-adik cara mengamankan akun dan mengenali jebakan phishing dengan studi kasus yang dekat dengan keseharian mereka.',
    tags: ['Cyber Safety', 'Anti Bullying', 'Etika Medsos']
  }
];
