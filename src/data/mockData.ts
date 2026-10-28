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

export const groupsData: Group[] = [
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
    notes: 'Draf X-Banner telah diajukan. Komposisi logo SMPN 1 Buduran dan SMK Telkom presisi.'
  },
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
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'done', step5: 'locked', step6: 'locked' }
  },
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
    notes: 'Perbaikan RPP Pertemuan 2 perlu penyesuaian durasi lab.'
  },
  {
    id: '07',
    number: '07',
    schoolName: 'SMP Telkom Sidoarjo',
    schoolAddress: 'Jl. Raya Pecantingan, Sekardangan',
    district: 'Sidoarjo',
    leaderName: 'Fahri Ramadhan',
    mentorName: 'Bambang Irawan, M.Kom',
    memberCount: 8,
    featuredModule: 'Dasar Robotika & Mikrokontroler IoT',
    status: 'overdue',
    statusLabel: 'Terlambat 2 Hari',
    targetDate: '18 Feb 2026',
    progressPercent: 50,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'overdue', step5: 'locked', step6: 'locked' },
    notes: 'Terlambat unggah desain poster dan X-banner fisik.'
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
    progressPercent: 58,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'in_progress', step5: 'locked', step6: 'locked' }
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
    id: '02',
    number: '02',
    schoolName: 'SMPN 1 Waru',
    schoolAddress: 'Jl. Jend. S. Parman No. 2, Waru',
    district: 'Waru',
    leaderName: 'Dimas Bagus Wicaksono',
    mentorName: 'Siti Aminah, M.Kom',
    memberCount: 8,
    featuredModule: 'Computational Thinking dengan Scratch',
    status: 'review',
    statusLabel: 'Menunggu Review Modul',
    targetDate: '19 Feb 2026',
    progressPercent: 42,
    currentStep: 3,
    steps: { step1: 'done', step2: 'done', step3: 'review', step4: 'locked', step5: 'locked', step6: 'locked' }
  },
  {
    id: '04',
    number: '04',
    schoolName: 'SMPN 2 Krian',
    schoolAddress: 'Jl. Setiabudi No. 12, Krian',
    district: 'Krian',
    leaderName: 'Siti Nurhaliza',
    mentorName: 'Achmad Fauzi, S.T',
    memberCount: 7,
    featuredModule: 'Literasi Keamanan Digital & Cyberbullying',
    status: 'overdue',
    statusLabel: 'Terlambat 1 Hari',
    targetDate: '20 Feb 2026',
    progressPercent: 50,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'overdue', step5: 'locked', step6: 'locked' }
  },
  {
    id: '06',
    number: '06',
    schoolName: 'SMPN 1 Tulangan',
    schoolAddress: 'Jl. Kenanga No. 8, Tulangan',
    district: 'Tulangan',
    leaderName: 'Bagus Pratama Putra',
    mentorName: 'Lilik Rahayu, S.Pd',
    memberCount: 8,
    featuredModule: 'Desain Komunikasi Visual & Infografis',
    status: 'review',
    statusLabel: 'Menunggu Review Banner',
    targetDate: '21 Feb 2026',
    progressPercent: 58,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'review', step5: 'locked', step6: 'locked' }
  },
  {
    id: '08',
    number: '08',
    schoolName: 'SMPN 2 Sukodono',
    schoolAddress: 'Jl. Raya Sukodono No. 15',
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
    id: '09',
    number: '09',
    schoolName: 'SMPN 1 Taman',
    schoolAddress: 'Jl. Ngelom No. 4, Taman',
    district: 'Taman',
    leaderName: 'Rian Hidayat',
    mentorName: 'Eko Wahyudi, S.Kom',
    memberCount: 7,
    featuredModule: 'Etika Bermedia Sosial & Cek Fakta',
    status: 'overdue',
    statusLabel: 'Terlambat Revisi',
    targetDate: '20 Feb 2026',
    progressPercent: 35,
    currentStep: 3,
    steps: { step1: 'done', step2: 'done', step3: 'overdue', step4: 'locked', step5: 'locked', step6: 'locked' }
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
    progressPercent: 58,
    currentStep: 4,
    steps: { step1: 'done', step2: 'done', step3: 'done', step4: 'in_progress', step5: 'locked', step6: 'locked' }
  }
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

export const showcaseProjects = [
  {
    tag: 'PELATIHAN',
    title: 'Public Speaking 101',
    desc: 'Pelatihan komunikasi publik & presentasi untuk pengurus OSIS.',
    school: 'SMPN 1 Sidoarjo',
    image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=600&auto=format&fit=crop&q=80'
  },
  {
    tag: 'WEBSITE',
    title: 'Portal Berita OSIS',
    desc: 'Portal berita dan mading daring responsif berbasis web modern.',
    school: 'SMPN 2 Candi',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80'
  },
  {
    tag: 'DESAIN',
    title: 'Poster Edukasi Ekologi',
    desc: 'Desain kampanye visual ramah lingkungan dan sanitasi sekolah.',
    school: 'SMPN 1 Buduran',
    image: 'https://images.unsplash.com/photo-1572945281869-847250e70498?w=600&auto=format&fit=crop&q=80'
  },
  {
    tag: 'LITERASI DIGITAL',
    title: 'Panduan Cek Hoaks',
    desc: 'Modul praktis verifikasi kebenaran informasi di media sosial.',
    school: 'SMP Telkom',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
  },
  {
    tag: 'CODING',
    title: 'Game Kuis Logika',
    desc: 'Game komputasi edukatif interaktif dengan Scratch & Blockly.',
    school: 'SMPN 1 Sedati',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80'
  }
];
