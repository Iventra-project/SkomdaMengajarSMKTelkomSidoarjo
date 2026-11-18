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
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Download,
  Copy,
  Plus,
  Users,
  QrCode,
  Star,
  MessageSquare,
  Send,
  Eye,
  RefreshCw,
  SlidersHorizontal,
  Filter,
  Sparkles,
  FileSpreadsheet,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  GraduationCap,
  ChevronLeft,
  LayoutGrid,
  MoreHorizontal,
  Bell,
  Moon,
  Sun,
  HelpCircle,
  CheckCheck,
  PhoneCall,
  Share2,
  FileCheck2,
  UserPlus,
} from 'lucide-react';

// ─── DATA MODELS ──────────────────────────────────────────────────────────────
export interface MemberItem {
  id: string;
  nis: string;
  name: string;
  role: string;
}

export interface DeliverableItem {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  updatedAt: string;
  status: 'approved' | 'review' | 'revision' | 'pending';
  statusLabel: string;
  version: string;
}

export interface FeedbackItem {
  id: string;
  author: string;
  role: 'Guru Pamong SMP' | 'Siswa SMP' | 'Kepala Lab';
  rating: number;
  date: string;
  comment: string;
}

export interface GroupItem {
  id: string;
  number: string;
  schoolName: string;
  district: string;
  leaderName: string;
  leaderPhone: string;
  hasLeader: boolean;
  currentStage: string;
  currentStageIndex: number; // 1..6
  completedStages: number;
  approvedItemsCount: number;
  totalItemsCount: number;
  statusKey: 'review' | 'overdue' | 'safe' | 'unassigned';
  statusLabel: string;
  lateDays?: number;
  members: MemberItem[];
  deliverables: DeliverableItem[];
  feedbackList: FeedbackItem[];
}

export interface ReviewQueueItem {
  id: string;
  groupId: string;
  groupNumber: string;
  schoolName: string;
  itemName: string;
  status: 'review' | 'overdue' | 'revision';
  statusLabel: string;
  ageText: string;
  isLate?: boolean;
  lateDays?: number;
  reminderText?: string;
  deliverableId: string;
  version: string;
  fileSize: string;
  fileName: string;
  studentNotes?: string;
}

export const SIX_STAGES = [
  'Tahap 1: Atur peran',
  'Tahap 2: Rancang materi',
  'Tahap 3: Buat desain',
  'Tahap 4: Pelaksanaan di SMP',
  'Tahap 5: Kumpulkan laporan',
  'Tahap 6: Terima feedback',
];

// Initial 24 Groups Roster (Authentic SMP schools across Sidoarjo)
const INITIAL_24_GROUPS: GroupItem[] = [
  {
    id: '03',
    number: '03',
    schoolName: 'SMPN 1 Buduran',
    district: 'Buduran',
    leaderName: 'Nabila Putri Ramadhani',
    leaderPhone: '+62 812-3456-7890',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 3,
    totalItemsCount: 5,
    statusKey: 'review',
    statusLabel: 'Menunggu Review',
    members: [
      { id: 'm-301', nis: '2024.11.0301', name: 'Nabila Putri Ramadhani', role: 'Ketua' },
      { id: 'm-302', nis: '2024.11.0302', name: 'Ahmad Rizky Pratama', role: 'Notulen' },
      { id: 'm-303', nis: '2024.11.0303', name: 'Rafi Fadillah', role: 'Desain' },
      { id: 'm-304', nis: '2024.11.0304', name: 'Dinda Salsabila', role: 'Materi' },
      { id: 'm-305', nis: '2024.11.0305', name: 'M. Arya Bima', role: 'Dokumentasi' },
      { id: 'm-306', nis: '2024.11.0306', name: 'Siti Aisyah', role: 'Logistik' },
      { id: 'm-307', nis: '2024.11.0307', name: 'Bagas Pratama', role: 'Pengajar lab' },
    ],
    deliverables: [
      { id: 'd-1', title: 'RPP / Modul Ajar', fileName: 'RPP_Informatika_SMPN1Buduran.pdf', fileSize: '1.4 MB', updatedAt: 'Kemarin, 14:20', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-2', title: 'Slide Presentasi (PPT)', fileName: 'Slide_Materi_Canva_v1.pptx', fileSize: '8.2 MB', updatedAt: '12 Feb, 10:15', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-3', title: 'Desain X-Banner', fileName: 'X-Banner_SMPN1Buduran_v2.pdf', fileSize: '14.8 MB', updatedAt: '45 menit lalu', status: 'review', statusLabel: 'Menunggu review', version: 'v2' },
      { id: 'd-4', title: 'Desain Feed Instagram', fileName: 'Feed_Carousel_Teaser.png', fileSize: '3.6 MB', updatedAt: 'Kemarin, 19:40', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-5', title: 'Laporan Akhir (Ekspor PDF)', fileName: 'Draf_Laporan_Akhir.pdf', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
    ],
    feedbackList: [
      { id: 'f-1', author: 'Dra. Endang Purwanti', role: 'Guru Pamong SMP', rating: 5, date: '16 Feb 2026', comment: 'Siswa SMK Telkom sangat santun, komunikatif, dan siswa kelas 8 kami sangat antusias saat praktik membuat desain Canva.' },
      { id: 'f-2', author: 'M. Reyhan (Kelas 8B)', role: 'Siswa SMP', rating: 5, date: '16 Feb 2026', comment: 'Kakak pengajarnya asik banget, diajarin bikin game animasi Scratch sampai bisa!' },
      { id: 'f-3', author: 'Haryono, S.Kom', role: 'Kepala Lab', rating: 5, date: '15 Feb 2026', comment: 'Instalasi software lab dan kebersihan ruang lab komputer dijaga dengan sangat rapi.' },
    ],
  },
  {
    id: '02',
    number: '02',
    schoolName: 'SMPN 1 Waru',
    district: 'Waru',
    leaderName: 'Dimas Bagus Wicaksono',
    leaderPhone: '+62 813-8899-1122',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 3,
    totalItemsCount: 5,
    statusKey: 'review',
    statusLabel: 'Menunggu Review',
    members: [
      { id: 'm-201', nis: '2024.11.0201', name: 'Dimas Bagus Wicaksono', role: 'Ketua' },
      { id: 'm-202', nis: '2024.11.0202', name: 'Arum Sekar Wangi', role: 'Materi' },
      { id: 'm-203', nis: '2024.11.0203', name: 'Candra Wijaya', role: 'Desain' },
      { id: 'm-204', nis: '2024.11.0204', name: 'Dwi Prasetyo', role: 'Notulen' },
      { id: 'm-205', nis: '2024.11.0205', name: 'Fitriani Lestari', role: 'Dokumentasi' },
      { id: 'm-206', nis: '2024.11.0206', name: 'Galih Rakasiwi', role: 'Pengajar lab' },
    ],
    deliverables: [
      { id: 'd-1', title: 'RPP / Modul Ajar', fileName: 'RPP_pertemuan_2_dan_modul_Scratch.pdf', fileSize: '2.1 MB', updatedAt: '2 jam lalu', status: 'review', statusLabel: 'Menunggu review', version: 'v2' },
      { id: 'd-2', title: 'Slide Presentasi (PPT)', fileName: 'Slide_Scratch_Game.pptx', fileSize: '6.4 MB', updatedAt: 'Kemarin', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-3', title: 'Desain X-Banner', fileName: 'Banner_SMPN1Waru.pdf', fileSize: '12.0 MB', updatedAt: 'Kemarin', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-4', title: 'Desain Feed Instagram', fileName: 'Feed_SMPN1Waru.png', fileSize: '2.8 MB', updatedAt: '12 Feb', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-5', title: 'Laporan Akhir (Ekspor PDF)', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
    ],
    feedbackList: [],
  },
  {
    id: '06',
    number: '06',
    schoolName: 'SMPN 1 Tulangan',
    district: 'Tulangan',
    leaderName: 'Bagus Pratama Putra',
    leaderPhone: '+62 821-4455-6677',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 3,
    totalItemsCount: 5,
    statusKey: 'review',
    statusLabel: 'Menunggu Review',
    members: [
      { id: 'm-601', nis: '2024.11.0601', name: 'Bagus Pratama Putra', role: 'Ketua' },
      { id: 'm-602', nis: '2024.11.0602', name: 'Citra Dewi', role: 'Desain' },
      { id: 'm-603', nis: '2024.11.0603', name: 'Farhan Ali', role: 'Materi' },
      { id: 'm-604', nis: '2024.11.0604', name: 'Gita Safitri', role: 'Dokumentasi' },
      { id: 'm-605', nis: '2024.11.0605', name: 'Hafiz Maulana', role: 'Pengajar lab' },
      { id: 'm-606', nis: '2024.11.0606', name: 'Ilham Kusuma', role: 'Logistik' },
    ],
    deliverables: [
      { id: 'd-1', title: 'RPP / Modul Ajar', fileName: 'RPP_Literasi_Digital.pdf', fileSize: '1.8 MB', updatedAt: '13 Feb', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-2', title: 'Slide Presentasi (PPT)', fileName: 'Draf_infografis_materi.pptx', fileSize: '7.5 MB', updatedAt: '3 jam lalu', status: 'review', statusLabel: 'Menunggu review', version: 'v2' },
      { id: 'd-3', title: 'Desain X-Banner', fileName: 'Banner_Tulangan.pdf', fileSize: '11.5 MB', updatedAt: '12 Feb', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-4', title: 'Desain Feed Instagram', fileName: 'Feed_Tulangan.png', fileSize: '3.1 MB', updatedAt: '11 Feb', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-5', title: 'Laporan Akhir (Ekspor PDF)', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
    ],
    feedbackList: [],
  },
  {
    id: '12',
    number: '12',
    schoolName: 'SMPN 2 Taman',
    district: 'Taman',
    leaderName: 'Kevin Alamsyah',
    leaderPhone: '+62 857-3322-1100',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 3,
    totalItemsCount: 5,
    statusKey: 'review',
    statusLabel: 'Menunggu Review',
    members: [
      { id: 'm-1201', nis: '2024.11.1201', name: 'Kevin Alamsyah', role: 'Ketua' },
      { id: 'm-1202', nis: '2024.11.1202', name: 'Laila Zahra', role: 'Materi' },
      { id: 'm-1203', nis: '2024.11.1203', name: 'Muhammad Fikri', role: 'Desain' },
      { id: 'm-1204', nis: '2024.11.1204', name: 'Nadya Amanda', role: 'Dokumentasi' },
      { id: 'm-1205', nis: '2024.11.1205', name: 'Oki Pratama', role: 'Pengajar lab' },
      { id: 'm-1206', nis: '2024.11.1206', name: 'Putri Ayu', role: 'Logistik' },
    ],
    deliverables: [
      { id: 'd-1', title: 'RPP / Modul Ajar', fileName: 'RPP_Taman_WebDasar.pdf', fileSize: '1.9 MB', updatedAt: '13 Feb', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-2', title: 'Slide Presentasi (PPT)', fileName: 'Slide_presentasi_Canva.pdf', fileSize: '9.3 MB', updatedAt: '4 jam lalu', status: 'review', statusLabel: 'Menunggu review', version: 'v2' },
      { id: 'd-3', title: 'Desain X-Banner', fileName: 'X_Banner_Taman.pdf', fileSize: '13.2 MB', updatedAt: 'Kemarin', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-4', title: 'Desain Feed Instagram', fileName: 'Feed_Taman.png', fileSize: '2.5 MB', updatedAt: 'Kemarin', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-5', title: 'Laporan Akhir (Ekspor PDF)', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
    ],
    feedbackList: [],
  },
  {
    id: '07',
    number: '07',
    schoolName: 'SMP Telkom Sidoarjo',
    district: 'Sidoarjo',
    leaderName: 'Fahri Ramadhan',
    leaderPhone: '+62 819-7788-9900',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 2,
    totalItemsCount: 5,
    statusKey: 'overdue',
    statusLabel: 'Terlambat 2 Hari',
    lateDays: 2,
    members: [
      { id: 'm-701', nis: '2024.11.0701', name: 'Fahri Ramadhan', role: 'Ketua' },
      { id: 'm-702', nis: '2024.11.0702', name: 'Gading Marten', role: 'Desain' },
      { id: 'm-703', nis: '2024.11.0703', name: 'Hana Safira', role: 'Notulen' },
      { id: 'm-704', nis: '2024.11.0704', name: 'Indra Bekti', role: 'Pengajar lab' },
      { id: 'm-705', nis: '2024.11.0705', name: 'Jihan Audy', role: 'Logistik' },
      { id: 'm-706', nis: '2024.11.0706', name: 'Kurnia Meiga', role: 'Dokumentasi' },
    ],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '04',
    number: '04',
    schoolName: 'SMPN 2 Krian',
    district: 'Krian',
    leaderName: 'Siti Nurhaliza',
    leaderPhone: '+62 822-3344-5566',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 2,
    totalItemsCount: 5,
    statusKey: 'overdue',
    statusLabel: 'Terlambat 1 Hari',
    lateDays: 1,
    members: [
      { id: 'm-401', nis: '2024.11.0401', name: 'Siti Nurhaliza', role: 'Ketua' },
      { id: 'm-402', nis: '2024.11.0402', name: 'Bambang Tri', role: 'Materi' },
      { id: 'm-403', nis: '2024.11.0403', name: 'Cindy Claudia', role: 'Desain' },
    ],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '09',
    number: '09',
    schoolName: 'SMPN 1 Taman',
    district: 'Taman',
    leaderName: 'Rian Hidayat',
    leaderPhone: '+62 856-1122-3344',
    hasLeader: true,
    currentStage: 'Tahap 2: Rancang materi',
    currentStageIndex: 2,
    completedStages: 1,
    approvedItemsCount: 1,
    totalItemsCount: 5,
    statusKey: 'overdue',
    statusLabel: 'Terlambat 3 Hari',
    lateDays: 3,
    members: [{ id: 'm-901', nis: '2024.11.0901', name: 'Rian Hidayat', role: 'Ketua' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '05',
    number: '05',
    schoolName: 'SMPN 2 Candi',
    district: 'Candi',
    leaderName: 'Dewi Maharani',
    leaderPhone: '+62 878-5566-7788',
    hasLeader: true,
    currentStage: 'Tahap 2: Rancang materi',
    currentStageIndex: 2,
    completedStages: 1,
    approvedItemsCount: 2,
    totalItemsCount: 5,
    statusKey: 'overdue',
    statusLabel: 'Perlu Revisi',
    members: [{ id: 'm-501', nis: '2024.11.0501', name: 'Dewi Maharani', role: 'Ketua' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '01',
    number: '01',
    schoolName: 'SMPN 1 Sidoarjo',
    district: 'Sidoarjo',
    leaderName: 'Rafli Akbar Pratama',
    leaderPhone: '+62 811-2233-4455',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    statusKey: 'safe',
    statusLabel: 'Disetujui',
    members: [{ id: 'm-101', nis: '2024.11.0101', name: 'Rafli Akbar Pratama', role: 'Ketua' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '08',
    number: '08',
    schoolName: 'SMPN 2 Sukodono',
    district: 'Sukodono',
    leaderName: 'Putri Ayu Wandira',
    leaderPhone: '+62 813-7766-5544',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    statusKey: 'safe',
    statusLabel: 'Disetujui',
    members: [{ id: 'm-801', nis: '2024.11.0801', name: 'Putri Ayu Wandira', role: 'Ketua' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '10',
    number: '10',
    schoolName: 'SMP Hang Tuah 5',
    district: 'Candi',
    leaderName: 'Kevin Sanjaya',
    leaderPhone: '+62 852-9988-7766',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    statusKey: 'safe',
    statusLabel: 'Disetujui',
    members: [{ id: 'm-1001', nis: '2024.11.1001', name: 'Kevin Sanjaya', role: 'Ketua' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '11',
    number: '11',
    schoolName: 'SMPN 3 Porong',
    district: 'Porong',
    leaderName: 'Zidan Maulana',
    leaderPhone: '+62 823-1144-7788',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    statusKey: 'safe',
    statusLabel: 'Disetujui',
    members: [{ id: 'm-1101', nis: '2024.11.1101', name: 'Zidan Maulana', role: 'Ketua' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '13',
    number: '13',
    schoolName: 'SMP Proklamasi Porong',
    district: 'Porong',
    leaderName: 'Aulia Rahman',
    leaderPhone: '+62 895-3344-5566',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    statusKey: 'safe',
    statusLabel: 'Disetujui',
    members: [{ id: 'm-1301', nis: '2024.11.1301', name: 'Aulia Rahman', role: 'Ketua' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '14',
    number: '14',
    schoolName: 'SMPN 1 Sedati',
    district: 'Sedati',
    leaderName: 'Anisa Rahmawati',
    leaderPhone: '+62 812-7788-2233',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    statusKey: 'safe',
    statusLabel: 'Disetujui',
    members: [{ id: 'm-1401', nis: '2024.11.1401', name: 'Anisa Rahmawati', role: 'Ketua' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '15',
    number: '15',
    schoolName: 'SMPN 2 Gedangan',
    district: 'Gedangan',
    leaderName: 'Rizal Fauzi',
    leaderPhone: '+62 813-4455-9900',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    statusKey: 'safe',
    statusLabel: 'Disetujui',
    members: [{ id: 'm-1501', nis: '2024.11.1501', name: 'Rizal Fauzi', role: 'Ketua' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '16',
    number: '16',
    schoolName: 'SMP PGRI 1 Buduran',
    district: 'Buduran',
    leaderName: 'Doni Firmansyah',
    leaderPhone: '+62 858-6677-8899',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    statusKey: 'safe',
    statusLabel: 'Disetujui',
    members: [{ id: 'm-1601', nis: '2024.11.1601', name: 'Doni Firmansyah', role: 'Ketua' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '17',
    number: '17',
    schoolName: 'SMPN 1 Krembung',
    district: 'Krembung',
    leaderName: 'Fandi Ahmad',
    leaderPhone: '+62 812-9900-1122',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    statusKey: 'safe',
    statusLabel: 'Disetujui',
    members: [{ id: 'm-1701', nis: '2024.11.1701', name: 'Fandi Ahmad', role: 'Ketua' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '18',
    number: '18',
    schoolName: 'SMPN 2 Porong',
    district: 'Porong',
    leaderName: 'Hendra Setiawan',
    leaderPhone: '+62 821-3344-8899',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    statusKey: 'safe',
    statusLabel: 'Disetujui',
    members: [{ id: 'm-1801', nis: '2024.11.1801', name: 'Hendra Setiawan', role: 'Ketua' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '19',
    number: '19',
    schoolName: 'SMPN 1 Tarik',
    district: 'Tarik',
    leaderName: 'Indra Djati',
    leaderPhone: '+62 857-4433-2211',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    statusKey: 'safe',
    statusLabel: 'Disetujui',
    members: [{ id: 'm-1901', nis: '2024.11.1901', name: 'Indra Djati', role: 'Ketua' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '20',
    number: '20',
    schoolName: 'SMPN 2 Prambon',
    district: 'Prambon',
    leaderName: 'Joko Anwar',
    leaderPhone: '+62 813-2211-9988',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    statusKey: 'safe',
    statusLabel: 'Disetujui',
    members: [{ id: 'm-2001', nis: '2024.11.2001', name: 'Joko Anwar', role: 'Ketua' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '21',
    number: '21',
    schoolName: 'SMP Muhammadiyah 1',
    district: 'Sidoarjo',
    leaderName: 'Kiki Narendra',
    leaderPhone: '+62 878-1122-4455',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    statusKey: 'safe',
    statusLabel: 'Disetujui',
    members: [{ id: 'm-2101', nis: '2024.11.2101', name: 'Kiki Narendra', role: 'Ketua' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '22',
    number: '22',
    schoolName: 'SMP YPM 1 Taman',
    district: 'Taman',
    leaderName: 'Lukman Sardi',
    leaderPhone: '+62 812-4466-8800',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    statusKey: 'safe',
    statusLabel: 'Disetujui',
    members: [{ id: 'm-2201', nis: '2024.11.2201', name: 'Lukman Sardi', role: 'Ketua' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '23',
    number: '23',
    schoolName: 'SMPN 2 Sedati',
    district: 'Sedati',
    leaderName: '',
    leaderPhone: '—',
    hasLeader: false,
    currentStage: 'Tahap 1: Atur peran',
    currentStageIndex: 1,
    completedStages: 0,
    approvedItemsCount: 0,
    totalItemsCount: 5,
    statusKey: 'unassigned',
    statusLabel: 'Belum Ada Ketua',
    members: [
      { id: 'm-2301', nis: '2024.11.2301', name: 'Ahmad Fauzi', role: 'Anggota' },
      { id: 'm-2302', nis: '2024.11.2302', name: 'Bella Safitri', role: 'Anggota' },
      { id: 'm-2303', nis: '2024.11.2303', name: 'Danu Pratama', role: 'Anggota' },
      { id: 'm-2304', nis: '2024.11.2304', name: 'Eka Nuraini', role: 'Anggota' },
      { id: 'm-2305', nis: '2024.11.2305', name: 'Fikri Haikal', role: 'Anggota' },
      { id: 'm-2306', nis: '2024.11.2306', name: 'Gani Maulana', role: 'Anggota' },
    ],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '24',
    number: '24',
    schoolName: 'SMPN 4 Sidoarjo',
    district: 'Sidoarjo',
    leaderName: '',
    leaderPhone: '—',
    hasLeader: false,
    currentStage: 'Tahap 1: Atur peran',
    currentStageIndex: 1,
    completedStages: 0,
    approvedItemsCount: 0,
    totalItemsCount: 5,
    statusKey: 'unassigned',
    statusLabel: 'Belum Ada Ketua',
    members: [
      { id: 'm-2401', nis: '2024.11.2401', name: 'Salsa Bila Ramadhani', role: 'Anggota' },
      { id: 'm-2402', nis: '2024.11.2402', name: 'Bima Satria', role: 'Anggota' },
      { id: 'm-2403', nis: '2024.11.2403', name: 'Cahya Ramadhan', role: 'Anggota' },
      { id: 'm-2404', nis: '2024.11.2404', name: 'Dian Permata', role: 'Anggota' },
      { id: 'm-2405', nis: '2024.11.2405', name: 'Erwin Prasetya', role: 'Anggota' },
      { id: 'm-2406', nis: '2024.11.2406', name: 'Fitra Ramadhan', role: 'Anggota' },
    ],
    deliverables: [],
    feedbackList: [],
  },
];

// Initial 4 Review Queue items
const INITIAL_REVIEW_QUEUE: ReviewQueueItem[] = [
  {
    id: 'rq-1',
    groupId: '03',
    groupNumber: 'Kelompok 03',
    schoolName: 'SMPN 1 Buduran',
    itemName: 'X-Banner v2',
    status: 'review',
    statusLabel: 'Menunggu review',
    ageText: 'diajukan 45 menit lalu',
    deliverableId: 'd-3',
    version: 'v2',
    fileSize: '14.8 MB',
    fileName: 'X-Banner_SMPN1Buduran_v2.pdf',
    studentNotes:
      'Kami sudah memperbaiki logo SMK Telkom Sidoarjo di pojok kanan atas, mengubah ukuran tagline sesuai panduan, dan menambahkan QR code pendaftaran siswa SMP.',
  },
  {
    id: 'rq-2',
    groupId: '02',
    groupNumber: 'Kelompok 02',
    schoolName: 'SMPN 1 Waru',
    itemName: 'RPP pertemuan 2 & modul Scratch',
    status: 'review',
    statusLabel: 'Menunggu review',
    ageText: 'diajukan 2 jam lalu',
    deliverableId: 'd-1',
    version: 'v2',
    fileSize: '2.1 MB',
    fileName: 'RPP_pertemuan_2_dan_modul_Scratch.pdf',
    studentNotes:
      'Sudah disesuaikan dengan kurikulum informatika SMP kelas 8, alokasi waktu praktik 2 JP di laboratorium komputer.',
  },
  {
    id: 'rq-3',
    groupId: '06',
    groupNumber: 'Kelompok 06',
    schoolName: 'SMPN 1 Tulangan',
    itemName: 'Draf infografis materi',
    status: 'review',
    statusLabel: 'Menunggu review',
    ageText: 'diajukan 3 jam lalu',
    deliverableId: 'd-2',
    version: 'v2',
    fileSize: '7.5 MB',
    fileName: 'Draf_infografis_materi.pptx',
    studentNotes:
      'Desain infografis keamanan digital untuk dibagikan saat sesi interaktif di kelas.',
  },
  {
    id: 'rq-4',
    groupId: '12',
    groupNumber: 'Kelompok 12',
    schoolName: 'SMPN 2 Taman',
    itemName: 'Slide presentasi Canva',
    status: 'review',
    statusLabel: 'Menunggu review',
    ageText: 'diajukan 4 jam lalu',
    deliverableId: 'd-2',
    version: 'v2',
    fileSize: '9.3 MB',
    fileName: 'Slide_presentasi_Canva.pdf',
    studentNotes:
      'Slide materi pengenalan Web Dasar HTML/CSS dengan analogi rumah dan dekorasi agar mudah dipahami adik-adik SMP.',
  },
];

export function AdminMonitoringPage() {
  const { navigate, showToast } = useApp();

  // ─── STATE MANAGEMENT ───────────────────────────────────────────────────────
  const [groups, setGroups] = useState<GroupItem[]>(INITIAL_24_GROUPS);
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueItem[]>(INITIAL_REVIEW_QUEUE);

  // Active navigation in floating sidebar
  const [activeNav, setActiveNav] = useState<
    'kelompok' | 'fokus' | 'review' | 'persiapan' | 'feedback' | 'laporan' | 'pengaturan' | 'bantuan'
  >('kelompok');

  // Sub-navigation underline tab
  const [activeUnderlineTab, setActiveUnderlineTab] = useState<
    'semua' | 'review' | 'terlambat' | 'unassigned'
  >('semua');

  // Search & Filter Pill State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Pagination state (8 groups per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected Group for Detailed Workspace View
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [groupWorkspaceSubTab, setGroupWorkspaceSubTab] = useState<'members' | 'deliverables' | 'feedback'>('members');

  // Slide-over Review Drawer (Sheet)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeReviewItem, setActiveReviewItem] = useState<ReviewQueueItem | null>(null);
  const [drawerNotes, setDrawerNotes] = useState('');

  // Setup & Assign Leader Modal (Dialog)
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [setupModalTab, setSetupModalTab] = useState<'assign' | 'import'>('assign');
  const [selectedLeaderMap, setSelectedLeaderMap] = useState<Record<string, string>>({
    '23': 'Ahmad Fauzi',
    '24': 'Salsa Bila Ramadhani',
  });
  const [isImporting, setIsImporting] = useState(false);

  // Popovers (Calendar & Notifications)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // ─── DERIVED FILTERING & PAGINATION ─────────────────────────────────────────
  const filteredGroups = useMemo(() => {
    return groups.filter((grp) => {
      // 1. Underline tab filter
      if (activeUnderlineTab === 'review' && grp.statusKey !== 'review') return false;
      if (activeUnderlineTab === 'terlambat' && grp.statusKey !== 'overdue') return false;
      if (activeUnderlineTab === 'unassigned' && grp.hasLeader) return false;

      // 2. Status dropdown filter
      if (selectedStatusFilter !== 'all') {
        if (selectedStatusFilter === 'review' && grp.statusKey !== 'review') return false;
        if (selectedStatusFilter === 'overdue' && grp.statusKey !== 'overdue') return false;
        if (selectedStatusFilter === 'safe' && grp.statusKey !== 'safe') return false;
        if (selectedStatusFilter === 'unassigned' && grp.hasLeader) return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          grp.number.toLowerCase().includes(q) ||
          grp.schoolName.toLowerCase().includes(q) ||
          grp.district.toLowerCase().includes(q) ||
          (grp.leaderName && grp.leaderName.toLowerCase().includes(q)) ||
          grp.leaderPhone.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [groups, activeUnderlineTab, selectedStatusFilter, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredGroups.length / itemsPerPage));
  const paginatedGroups = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredGroups.slice(start, start + itemsPerPage);
  }, [filteredGroups, currentPage]);

  // Selected Group details
  const activeDetailGroup = useMemo(() => {
    if (!selectedGroupId) return null;
    return groups.find((g) => g.id === selectedGroupId) || null;
  }, [groups, selectedGroupId]);

  // ─── ACTION HANDLERS ────────────────────────────────────────────────────────

  // Open Drawer for Review
  const handleOpenReview = (item: ReviewQueueItem) => {
    setActiveReviewItem(item);
    setDrawerNotes('');
    setIsDrawerOpen(true);
  };

  // Open Drawer from Group Row
  const handleOpenReviewFromGroup = (grp: GroupItem) => {
    const queueMatch = reviewQueue.find((q) => q.groupId === grp.id);
    if (queueMatch) {
      handleOpenReview(queueMatch);
    } else {
      // Find first deliverable in review or draft
      const targetDel = grp.deliverables.find((d) => d.status === 'review') || grp.deliverables[0];
      const mockItem: ReviewQueueItem = {
        id: `rq-${grp.id}`,
        groupId: grp.id,
        groupNumber: `Kelompok ${grp.number}`,
        schoolName: grp.schoolName,
        itemName: targetDel ? targetDel.title : 'Berkas Tahap 3',
        status: 'review',
        statusLabel: 'Menunggu review',
        ageText: 'Baru saja dibuka',
        deliverableId: targetDel ? targetDel.id : 'd-custom',
        version: targetDel ? targetDel.version : 'v1',
        fileSize: targetDel ? targetDel.fileSize : '3.4 MB',
        fileName: targetDel ? targetDel.fileName : `Berkas_${grp.schoolName.replace(/\s+/g, '_')}.pdf`,
        studentNotes: 'Siswa telah melengkapi format berkas mengajar untuk ditinjau pembimbing.',
      };
      handleOpenReview(mockItem);
    }
  };

  // Approve Deliverable in Drawer
  const handleApproveDrawer = () => {
    if (!activeReviewItem) return;

    setGroups((prev) =>
      prev.map((grp) => {
        if (grp.id === activeReviewItem.groupId) {
          const nextCount = Math.min(5, grp.approvedItemsCount + 1);
          return {
            ...grp,
            approvedItemsCount: nextCount,
            statusKey: 'safe' as const,
            statusLabel: 'Disetujui',
            deliverables: grp.deliverables.map((d) =>
              d.id === activeReviewItem.deliverableId
                ? { ...d, status: 'approved' as const, statusLabel: 'Disetujui', updatedAt: 'Baru saja disetujui' }
                : d
            ),
          };
        }
        return grp;
      })
    );

    setReviewQueue((prev) => prev.filter((it) => it.id !== activeReviewItem.id));
    setIsDrawerOpen(false);
    showToast(`Berkas ${activeReviewItem.itemName} (${activeReviewItem.groupNumber}) berhasil disetujui!`, 'success');
  };

  // Request Revision in Drawer
  const handleRequestRevisionDrawer = () => {
    if (!activeReviewItem) return;
    const note = drawerNotes.trim() || 'Perbaiki tata letak dan sesuaikan dengan format pedoman kurikulum SMK.';

    setGroups((prev) =>
      prev.map((grp) => {
        if (grp.id === activeReviewItem.groupId) {
          return {
            ...grp,
            statusKey: 'overdue' as const,
            statusLabel: 'Perlu Revisi',
            deliverables: grp.deliverables.map((d) =>
              d.id === activeReviewItem.deliverableId
                ? { ...d, status: 'revision' as const, statusLabel: 'Perlu revisi', updatedAt: 'Diminta revisi' }
                : d
            ),
          };
        }
        return grp;
      })
    );

    setReviewQueue((prev) => prev.filter((it) => it.id !== activeReviewItem.id));
    setIsDrawerOpen(false);
    showToast(`Catatan revisi telah dikirim ke ${activeReviewItem.groupNumber}.`, 'info');
  };

  // Assign Leader in Setup Modal
  const handleAssignLeader = (groupId: string) => {
    const leaderName = selectedLeaderMap[groupId];
    if (!leaderName) return;

    setGroups((prev) =>
      prev.map((grp) => {
        if (grp.id === groupId) {
          const updatedMembers = grp.members.map((m) =>
            m.name === leaderName ? { ...m, role: 'Ketua' } : m.role === 'Ketua' ? { ...m, role: 'Anggota' } : m
          );
          return {
            ...grp,
            hasLeader: true,
            leaderName: leaderName,
            leaderPhone: '+62 812-7700-8811',
            statusKey: 'safe' as const,
            statusLabel: 'Disetujui',
            members: updatedMembers,
          };
        }
        return grp;
      })
    );

    showToast(`Ketua ${leaderName} berhasil ditetapkan untuk Kelompok ${groupId}!`, 'success');
  };

  // Override Group Stage
  const handleOverrideStage = (groupId: string, newStage: string) => {
    const idx = SIX_STAGES.indexOf(newStage) + 1;
    setGroups((prev) =>
      prev.map((grp) =>
        grp.id === groupId
          ? {
              ...grp,
              currentStage: newStage,
              currentStageIndex: idx > 0 ? idx : 3,
              completedStages: Math.max(0, idx - 1),
            }
          : grp
      )
    );
    showToast(`Tahap kerja kelompok disesuaikan ke "${newStage}".`, 'info');
  };

  // Change Student Role
  const handleChangeMemberRole = (groupId: string, memberId: string, newRole: string) => {
    setGroups((prev) =>
      prev.map((grp) => {
        if (grp.id === groupId) {
          let updatedLeader = grp.leaderName;
          const updatedMembers = grp.members.map((m) => {
            if (m.id === memberId) {
              if (newRole === 'Ketua') updatedLeader = m.name;
              return { ...m, role: newRole };
            }
            if (newRole === 'Ketua' && m.role === 'Ketua') {
              return { ...m, role: 'Anggota' };
            }
            return m;
          });
          return {
            ...grp,
            leaderName: updatedLeader,
            hasLeader: Boolean(updatedLeader),
            members: updatedMembers,
          };
        }
        return grp;
      })
    );
    showToast('Peran anggota berhasil diperbarui.', 'success');
  };

  // Toggle Deliverable Status directly in group detail
  const handleToggleDeliverableStatus = (groupId: string, deliverableId: string) => {
    setGroups((prev) =>
      prev.map((grp) => {
        if (grp.id === groupId) {
          const updatedDel = grp.deliverables.map((del) => {
            if (del.id === deliverableId) {
              const nextStatus = del.status === 'approved' ? 'revision' : 'approved';
              return {
                ...del,
                status: nextStatus as any,
                statusLabel: nextStatus === 'approved' ? 'Disetujui' : 'Perlu Revisi',
                updatedAt: 'Baru saja diubah',
              };
            }
            return del;
          });
          const approvedCount = updatedDel.filter((d) => d.status === 'approved').length;
          return {
            ...grp,
            approvedItemsCount: approvedCount,
            deliverables: updatedDel,
          };
        }
        return grp;
      })
    );
    showToast('Status berkas berhasil diubah.', 'info');
  };

  return (
    <div className="w-full min-h-screen bg-[#EAEAEA] text-slate-900 font-sans antialiased selection:bg-[#E50914] selection:text-white p-4 sm:p-6 lg:p-8 relative overflow-x-hidden">
      {/* Ambient background glow highlights */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(229,9,20,0.06),rgba(255,255,255,0))]" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-25 bg-[radial-gradient(circle,rgba(229,9,20,0.05),transparent_70%)]" />

      {/* Main 2-Column Shell Matching Starline Reference UI */}
      <div className="max-w-[1560px] mx-auto flex flex-col lg:flex-row gap-6 relative z-10">
        {/* ══════════════════════════════════════════════════════════════════════════
            LEFT SIDEBAR: STACK OF INDIVIDUAL FLOATING PILLS (NOT A SOLID BOX!)
        ══════════════════════════════════════════════════════════════════════════ */}
        <aside className="w-full lg:w-[230px] shrink-0 flex flex-col gap-2.5">
          {/* Top Brand Logo & Title */}
          <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-base shadow-sm">
              ★
            </div>
            <div className="leading-tight">
              <span className="text-base font-extrabold tracking-tight text-slate-900 block">Skomda</span>
              <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block">#Impact2026</span>
            </div>
          </div>

          {/* Vertical Stack of Floating Pills */}
          <nav className="flex flex-col gap-2">
            {/* Dashboard / Fokus Hari Ini */}
            <button
              onClick={() => {
                setActiveNav('fokus');
                setSelectedGroupId(null);
                setActiveUnderlineTab('review');
              }}
              className={`rounded-full px-5 py-3 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer shadow-2xs ${
                activeNav === 'fokus'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/50 backdrop-blur-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
              {reviewQueue.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#E50914] text-white text-[9px] font-bold flex items-center justify-center">
                  {reviewQueue.length}
                </span>
              )}
            </button>

            {/* Kelompok (ACTIVE RED PILL in Skomda Brand) */}
            <button
              onClick={() => {
                setActiveNav('kelompok');
                setSelectedGroupId(null);
                setActiveUnderlineTab('semua');
              }}
              className={`rounded-full px-5 py-3 text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                activeNav === 'kelompok'
                  ? 'bg-[#E50914] text-white shadow-md shadow-red-600/30'
                  : 'bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/50 shadow-2xs'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Kelompok</span>
            </button>

            {/* Review Berkas */}
            <button
              onClick={() => {
                setActiveNav('review');
                setSelectedGroupId(null);
                setActiveUnderlineTab('review');
                if (reviewQueue.length > 0) {
                  handleOpenReview(reviewQueue[0]);
                } else {
                  showToast('Semua antrean review telah selesai disetujui!', 'info');
                }
              }}
              className={`rounded-full px-5 py-3 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer shadow-2xs ${
                activeNav === 'review'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileCheck2 className="w-4 h-4" />
                <span>Review Berkas</span>
              </div>
              <span className="text-[10px] bg-red-100 text-[#E50914] font-bold px-1.5 py-0.2 rounded-full">
                4
              </span>
            </button>

            {/* Persiapan & Ketua */}
            <button
              onClick={() => {
                setActiveNav('persiapan');
                setIsSetupModalOpen(true);
              }}
              className={`rounded-full px-5 py-3 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer shadow-2xs ${
                activeNav === 'persiapan'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4" />
                <span>Persiapan & Ketua</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            </button>

            {/* Feedback SMP */}
            <button
              onClick={() => {
                setActiveNav('feedback');
                setSelectedGroupId('03');
                setGroupWorkspaceSubTab('feedback');
              }}
              className={`rounded-full px-5 py-3 text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer shadow-2xs ${
                activeNav === 'feedback'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/50'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Feedback SMP</span>
            </button>

            {/* Laporan & Ekspor */}
            <button
              onClick={() => {
                showToast('Menyiapkan rekapitulasi data 24 kelompok untuk diekspor ke Excel...', 'info');
              }}
              className="rounded-full px-5 py-3 text-xs font-semibold flex items-center gap-3 bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/50 shadow-2xs transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Laporan & Ekspor</span>
            </button>

            {/* Pengaturan */}
            <button
              onClick={() => {
                showToast('Halaman pengaturan sistem pembimbing.', 'info');
              }}
              className="rounded-full px-5 py-3 text-xs font-semibold flex items-center gap-3 bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/50 shadow-2xs transition-all cursor-pointer mt-4"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Pengaturan</span>
            </button>

            {/* Bantuan */}
            <button
              onClick={() => {
                showToast('Pusat bantuan & panduan SOP Skomda Mengajar.', 'info');
              }}
              className="rounded-full px-5 py-3 text-xs font-semibold flex items-center gap-3 bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/50 shadow-2xs transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Bantuan</span>
            </button>
          </nav>

          {/* Quick Return to Public Site */}
          <div className="mt-auto pt-6 px-2">
            <button
              onClick={() => navigate('/')}
              className="text-[11px] font-medium text-slate-400 hover:text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda Utama</span>
            </button>
          </div>
        </aside>

        {/* ══════════════════════════════════════════════════════════════════════════
            RIGHT COLUMN: MAIN CONTENT AREA
        ══════════════════════════════════════════════════════════════════════════ */}
        <main className="flex-1 min-w-0 flex flex-col gap-5">
          {/* TOP HEADER BAR: GREETING ON LEFT, FLOATING PILL TOOLBAR ON RIGHT */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            {/* Left Greeting */}
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Welcome, Pak Indra</span>
                <span className="text-xl">👋</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Pantau progres 24 kelompok & validasi berkas mengajar hari ini.
              </p>
            </div>

            {/* Right Floating White Pill Toolbar */}
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white px-4 py-2 shadow-xs border border-slate-200/70 flex items-center gap-3.5 backdrop-blur-sm">
                {/* Search Quick Action */}
                <button
                  onClick={() => {
                    const el = document.getElementById('tableSearchInput');
                    el?.focus();
                  }}
                  className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Cari"
                >
                  <Search className="w-4 h-4" />
                </button>

                {/* Dark / Light Toggle */}
                <button
                  onClick={() => {
                    showToast('Mode tema terang aktif.', 'info');
                  }}
                  className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Mode Tampilan"
                >
                  <Moon className="w-4 h-4" />
                </button>

                {/* Notifications Bell with Counter Badge */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer relative"
                    title="Notifikasi"
                  >
                    <Bell className="w-4 h-4" />
                    {reviewQueue.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#E50914] text-white text-[8px] font-bold flex items-center justify-center">
                        {reviewQueue.length}
                      </span>
                    )}
                  </button>

                  {/* Notification Popover */}
                  {isNotificationOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-900">Notifikasi Masuk (4)</span>
                        <button
                          onClick={() => setIsNotificationOpen(false)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                        {reviewQueue.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setIsNotificationOpen(false);
                              handleOpenReview(item);
                            }}
                            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer text-left"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">{item.groupNumber}</span>
                              <span className="text-[10px] text-amber-600 font-semibold">Review</span>
                            </div>
                            <p className="text-[11px] text-slate-600 truncate mt-0.5">{item.itemName}</p>
                            <span className="text-[10px] text-slate-400 block mt-1">{item.ageText}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Deadline Calendar */}
                <div className="relative">
                  <button
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                    title="Jadwal Tenggat"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>

                  {/* Calendar Popover */}
                  {isCalendarOpen && (
                    <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-900">Jadwal Skomda Mengajar</span>
                        <button
                          onClick={() => setIsCalendarOpen(false)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="mt-2.5 space-y-2 text-xs">
                        <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-900">
                          <span className="font-bold block">Tahap 3: Buat Desain</span>
                          <span className="text-[10px] text-red-700">Tenggat: 15 Februari 2026</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 text-slate-700">
                          <span className="font-semibold block">Tahap 4: Pelaksanaan di SMP</span>
                          <span className="text-[10px] text-slate-400">18 - 25 Februari 2026</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 text-slate-700">
                          <span className="font-semibold block">Tahap 5: Kumpulkan Laporan</span>
                          <span className="text-[10px] text-slate-400">28 Februari 2026</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Avatar with Online Indicator */}
                <div className="relative pl-1 border-l border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">
                    PI
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                </div>
              </div>
            </div>
          </header>

          {/* SUB-NAVIGATION UNDERLINE TABS (MATCHING REFERENCE UI) */}
          <nav className="flex items-center gap-6 border-b border-slate-300/70 pb-1 text-xs font-semibold text-slate-500 overflow-x-auto scrollbar-none">
            <button
              onClick={() => {
                setActiveUnderlineTab('semua');
                setSelectedGroupId(null);
                setCurrentPage(1);
              }}
              className={`pb-2.5 transition-all cursor-pointer whitespace-nowrap ${
                activeUnderlineTab === 'semua' && !selectedGroupId
                  ? 'border-b-2 border-slate-900 text-slate-900 font-bold -mb-[5px]'
                  : 'hover:text-slate-900'
              }`}
            >
              Semua Kelompok ({groups.length})
            </button>

            <button
              onClick={() => {
                setActiveUnderlineTab('review');
                setSelectedGroupId(null);
                setCurrentPage(1);
              }}
              className={`pb-2.5 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeUnderlineTab === 'review' && !selectedGroupId
                  ? 'border-b-2 border-[#E50914] text-[#E50914] font-bold -mb-[5px]'
                  : 'hover:text-slate-900'
              }`}
            >
              <span>Menunggu Review</span>
              <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center">
                {reviewQueue.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveUnderlineTab('terlambat');
                setSelectedGroupId(null);
                setCurrentPage(1);
              }}
              className={`pb-2.5 transition-all cursor-pointer whitespace-nowrap ${
                activeUnderlineTab === 'terlambat' && !selectedGroupId
                  ? 'border-b-2 border-red-600 text-red-600 font-bold -mb-[5px]'
                  : 'hover:text-slate-900'
              }`}
            >
              Terlambat / Revisi (4)
            </button>

            <button
              onClick={() => {
                setActiveUnderlineTab('unassigned');
                setSelectedGroupId(null);
                setCurrentPage(1);
              }}
              className={`pb-2.5 transition-all cursor-pointer whitespace-nowrap ${
                activeUnderlineTab === 'unassigned' && !selectedGroupId
                  ? 'border-b-2 border-slate-900 text-slate-900 font-bold -mb-[5px]'
                  : 'hover:text-slate-900'
              }`}
            >
              Belum Ada Ketua (2)
            </button>
          </nav>

          {/* ══════════════════════════════════════════════════════════════════════════
              VIEW CONTENT: EITHER DATA TABLE OR DETAILED GROUP WORKSPACE
          ══════════════════════════════════════════════════════════════════════════ */}
          {!selectedGroupId ? (
            <>
              {/* ACTION & SEARCH PILL BAR (FLOATING BUTTONS ABOVE TABLE) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                {/* Left: Add New Order + (In our case: + Tandai Ketua / Impor) */}
                <button
                  onClick={() => setIsSetupModalOpen(true)}
                  className="rounded-full bg-white hover:bg-slate-50 border border-slate-200/80 px-4 py-2 text-xs font-semibold text-slate-800 shadow-xs flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.01] w-fit"
                >
                  <span>+ Tandai Ketua / Impor</span>
                </button>

                {/* Right: Search Pill & Status Dropdown */}
                <div className="flex items-center gap-2.5">
                  {/* Search Pill Input */}
                  <div className="rounded-full bg-white border border-slate-200/80 px-3.5 py-1.5 text-xs shadow-xs flex items-center gap-2 w-full sm:w-64 focus-within:ring-2 focus-within:ring-red-500/20">
                    <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      id="tableSearchInput"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Cari kelompok, SMP, ketua..."
                      className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 text-xs"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Status Dropdown Pill */}
                  <div className="relative">
                    <button
                      onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                      className="rounded-full bg-white border border-slate-200/80 px-4 py-2 text-xs font-medium text-slate-700 shadow-xs flex items-center gap-2 cursor-pointer hover:bg-slate-50"
                    >
                      <span>
                        {selectedStatusFilter === 'all'
                          ? 'Status ∨'
                          : selectedStatusFilter === 'review'
                          ? 'Menunggu Review'
                          : selectedStatusFilter === 'overdue'
                          ? 'Terlambat / Revisi'
                          : selectedStatusFilter === 'safe'
                          ? 'Disetujui'
                          : 'Belum Ada Ketua'}
                      </span>
                    </button>

                    {isStatusDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-slate-200 py-1.5 z-40">
                        {[
                          { id: 'all', label: 'Semua Status' },
                          { id: 'review', label: 'Menunggu Review' },
                          { id: 'overdue', label: 'Terlambat / Perlu Revisi' },
                          { id: 'safe', label: 'Disetujui' },
                          { id: 'unassigned', label: 'Belum Ada Ketua' },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => {
                              setSelectedStatusFilter(opt.id);
                              setIsStatusDropdownOpen(false);
                              setCurrentPage(1);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                              selectedStatusFilter === opt.id
                                ? 'bg-red-50 text-[#E50914] font-bold'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ══════════════════════════════════════════════════════════════════════════
                  MAIN DATA TABLE CARD: LARGE ROUNDED CONTAINER (rounded-[28px])
              ══════════════════════════════════════════════════════════════════════════ */}
              <div className="rounded-[28px] bg-white p-5 sm:p-6 shadow-sm border border-slate-200/60 overflow-hidden">
                {/* Table Header Pill Bar */}
                <div className="rounded-full bg-slate-100/90 text-[11px] font-semibold text-slate-500 py-3 px-6 grid grid-cols-12 items-center tracking-wider mb-2">
                  <div className="col-span-2">ID KELOMPOK</div>
                  <div className="col-span-2">SMP TUJUAN</div>
                  <div className="col-span-2">KETUA KELOMPOK</div>
                  <div className="col-span-2">TAHAP & PROGRES</div>
                  <div className="col-span-2">KONTAK KETUA</div>
                  <div className="col-span-1 text-center sm:text-left">STATUS</div>
                  <div className="col-span-1 text-right">AKSI</div>
                </div>

                {/* Table Rows Body */}
                <div className="divide-y divide-slate-100">
                  {paginatedGroups.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-sm font-semibold text-slate-700">Tidak ada kelompok yang cocok</p>
                      <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter status.</p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedStatusFilter('all');
                          setActiveUnderlineTab('semua');
                        }}
                        className="mt-3 px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                      >
                        Reset Filter
                      </button>
                    </div>
                  ) : (
                    paginatedGroups.map((grp) => {
                      const isReview = grp.statusKey === 'review';
                      const isOverdue = grp.statusKey === 'overdue';
                      const isUnassigned = !grp.hasLeader;

                      return (
                        <div
                          key={grp.id}
                          onClick={() => setSelectedGroupId(grp.id)}
                          className="py-3.5 px-6 grid grid-cols-12 items-center rounded-2xl hover:bg-slate-50/80 transition-all cursor-pointer group text-xs"
                        >
                          {/* Col 1: ID Kelompok */}
                          <div className="col-span-2 font-bold text-slate-900 flex items-center gap-2">
                            <span>KEL-{grp.number}</span>
                          </div>

                          {/* Col 2: SMP Tujuan */}
                          <div className="col-span-2 pr-2">
                            <span className="font-semibold text-slate-900 block truncate">{grp.schoolName}</span>
                            <span className="text-[10px] text-slate-400 block">{grp.district}</span>
                          </div>

                          {/* Col 3: Ketua Kelompok */}
                          <div className="col-span-2 pr-2">
                            {grp.hasLeader ? (
                              <span className="font-medium text-slate-800 block truncate">{grp.leaderName}</span>
                            ) : (
                              <span className="font-semibold text-amber-600 block text-[11px]">
                                — Belum ditentukan
                              </span>
                            )}
                          </div>

                          {/* Col 4: Tahap & Progres */}
                          <div className="col-span-2 pr-2">
                            <span className="text-[11px] font-medium text-slate-700 block truncate">
                              {grp.currentStage}
                            </span>
                            {/* 5-bar progress dots */}
                            <div className="flex items-center gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map((step) => (
                                <div
                                  key={step}
                                  className={`h-1.5 rounded-full transition-all ${
                                    step <= grp.approvedItemsCount
                                      ? 'w-3.5 bg-emerald-500'
                                      : step === grp.currentStageIndex
                                      ? 'w-3.5 bg-slate-400'
                                      : 'w-2 bg-slate-200'
                                  }`}
                                  title={`Langkah ${step}`}
                                />
                              ))}
                              <span className="text-[10px] text-slate-400 ml-1">
                                {grp.approvedItemsCount}/5
                              </span>
                            </div>
                          </div>

                          {/* Col 5: Kontak Ketua */}
                          <div className="col-span-2 font-mono text-[11px] text-slate-600">
                            {grp.leaderPhone}
                          </div>

                          {/* Col 6: Status (Clean borderless colored text matching reference!) */}
                          <div className="col-span-1">
                            {isReview ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenReviewFromGroup(grp);
                                }}
                                className="font-semibold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer text-left block"
                                title="Klik untuk membuka slide review"
                              >
                                Menunggu Review
                              </button>
                            ) : isOverdue ? (
                              <span className="font-semibold text-[#E50914] block">
                                {grp.statusLabel}
                              </span>
                            ) : isUnassigned ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsSetupModalOpen(true);
                                }}
                                className="font-semibold text-slate-500 hover:text-slate-800 hover:underline cursor-pointer block text-left"
                              >
                                Belum Ada Ketua
                              </button>
                            ) : (
                              <span className="font-semibold text-emerald-600 block">
                                Disetujui
                              </span>
                            )}
                          </div>

                          {/* Col 7: Aksi (...) */}
                          <div className="col-span-1 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedGroupId(grp.id);
                              }}
                              className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 inline-flex items-center justify-center transition-colors cursor-pointer"
                              title="Kelola Kelompok"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* ══════════════════════════════════════════════════════════════════════════
                  BOTTOM FLOATING PAGINATION PILL BAR (MATCHING REFERENCE UI)
              ══════════════════════════════════════════════════════════════════════════ */}
              <div className="flex items-center justify-center pt-2 pb-6">
                <div className="rounded-full bg-white/90 backdrop-blur-md px-4 py-2 shadow-xs border border-slate-200/80 flex items-center gap-2 text-xs font-medium text-slate-600">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-[#E50914] text-white shadow-xs'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    ›
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* ══════════════════════════════════════════════════════════════════════════
                DETAILED GROUP WORKSPACE VIEW (WHEN A ROW IS CLICKED)
            ══════════════════════════════════════════════════════════════════════════ */
            activeDetailGroup && (
              <div className="rounded-[28px] bg-white p-6 sm:p-8 shadow-sm border border-slate-200/70 space-y-6">
                {/* Header with Back Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedGroupId(null)}
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                      title="Kembali"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#E50914]">
                          Kelompok {activeDetailGroup.number}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500 font-medium">
                          {activeDetailGroup.district}
                        </span>
                      </div>
                      <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        {activeDetailGroup.schoolName}
                      </h2>
                    </div>
                  </div>

                  {/* Stage Override Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium hidden sm:inline">Tahap Aktif:</span>
                    <select
                      value={activeDetailGroup.currentStage}
                      onChange={(e) => handleOverrideStage(activeDetailGroup.id, e.target.value)}
                      className="rounded-full bg-slate-100 border border-slate-200/80 px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                    >
                      {SIX_STAGES.map((stg) => (
                        <option key={stg} value={stg}>
                          {stg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Group Workspace Sub-tabs */}
                <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-full w-fit">
                  <button
                    onClick={() => setGroupWorkspaceSubTab('members')}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      groupWorkspaceSubTab === 'members'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Anggota & Peran ({activeDetailGroup.members.length})
                  </button>

                  <button
                    onClick={() => setGroupWorkspaceSubTab('deliverables')}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      groupWorkspaceSubTab === 'deliverables'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    5 Berkas Wajib ({activeDetailGroup.approvedItemsCount}/5)
                  </button>

                  <button
                    onClick={() => setGroupWorkspaceSubTab('feedback')}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      groupWorkspaceSubTab === 'feedback'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    QR Code & Feedback SMP
                  </button>
                </div>

                {/* Sub-tab 1: Anggota & Peran */}
                {groupWorkspaceSubTab === 'members' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500">
                      Anda dapat mengubah peran masing-masing siswa jika diperlukan penyesuaian tim di lapangan.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activeDetailGroup.members.map((mbr) => (
                        <div
                          key={mbr.id}
                          className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                              {mbr.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <span className="text-xs font-bold text-slate-900 block">{mbr.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">NIS {mbr.nis}</span>
                            </div>
                          </div>

                          <select
                            value={mbr.role}
                            onChange={(e) =>
                              handleChangeMemberRole(activeDetailGroup.id, mbr.id, e.target.value)
                            }
                            className={`text-xs font-bold px-2.5 py-1 rounded-full outline-none cursor-pointer border ${
                              mbr.role === 'Ketua'
                                ? 'bg-red-50 text-[#E50914] border-red-200'
                                : 'bg-white text-slate-700 border-slate-200'
                            }`}
                          >
                            <option value="Ketua">Ketua</option>
                            <option value="Notulen">Notulen</option>
                            <option value="Desain">Desain</option>
                            <option value="Materi">Materi</option>
                            <option value="Dokumentasi">Dokumentasi</option>
                            <option value="Logistik">Logistik</option>
                            <option value="Pengajar lab">Pengajar lab</option>
                            <option value="Anggota">Anggota</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-tab 2: 5 Berkas Wajib */}
                {groupWorkspaceSubTab === 'deliverables' && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500">
                      Daftar 5 berkas wajib program Skomda Mengajar 2026. Klik berkas untuk validasi atau unduh.
                    </p>
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                      {activeDetailGroup.deliverables.length === 0 ? (
                        <div className="p-8 text-center text-xs text-slate-400">
                          Belum ada berkas yang diunggah oleh kelompok ini.
                        </div>
                      ) : (
                        activeDetailGroup.deliverables.map((del) => (
                          <div
                            key={del.id}
                            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-900 block">{del.title}</span>
                                <span className="text-[11px] text-slate-400">
                                  {del.fileName} • {del.fileSize} • {del.updatedAt}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                                  del.status === 'approved'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : del.status === 'review'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : del.status === 'revision'
                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {del.statusLabel}
                              </span>

                              <button
                                onClick={() => handleToggleDeliverableStatus(activeDetailGroup.id, del.id)}
                                className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                              >
                                {del.status === 'approved' ? 'Ubah ke Revisi' : 'Setujui Langsung'}
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Sub-tab 3: QR Code & Feedback SMP */}
                {groupWorkspaceSubTab === 'feedback' && (
                  <div className="space-y-6">
                    {/* QR Code Card */}
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-center gap-6">
                      <div className="w-28 h-28 bg-white rounded-xl p-2 flex items-center justify-center shrink-0">
                        <QrCode className="w-24 h-24 text-slate-900" />
                      </div>
                      <div className="space-y-2 text-center sm:text-left">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded-full inline-block">
                          QR Penilaian SMP
                        </span>
                        <h3 className="text-base font-bold">
                          Scan Formulir Feedback {activeDetailGroup.schoolName}
                        </h3>
                        <p className="text-xs text-slate-300 max-w-lg">
                          Guru Pamong dan siswa SMP dapat memindai QR code ini di hari pelaksanaan untuk memberikan evaluasi performa mengajar siswa SMK Telkom.
                        </p>
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(
                              `https://skomda-mengajar.sch.id/feedback/kelompok-${activeDetailGroup.number}`
                            );
                            showToast('Tautan feedback berhasil disalin ke clipboard!', 'success');
                          }}
                          className="px-4 py-1.5 rounded-full bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Tautan Feedback</span>
                        </button>
                      </div>
                    </div>

                    {/* Feedback List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Ulasan Diterima ({activeDetailGroup.feedbackList.length})
                      </h4>
                      {activeDetailGroup.feedbackList.length === 0 ? (
                        <div className="p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                          Belum ada feedback dari sekolah mitra untuk kelompok ini.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {activeDetailGroup.feedbackList.map((fb) => (
                            <div
                              key={fb.id}
                              className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-900">{fb.author}</span>
                                <span className="text-[10px] bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded-full">
                                  {fb.role}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 italic">"{fb.comment}"</p>
                              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                                <div className="flex items-center gap-1 text-amber-500">
                                  {Array.from({ length: fb.rating }).map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-amber-500" />
                                  ))}
                                </div>
                                <span>{fb.date}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </main>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          SLIDE-OVER REVIEW DRAWER (SHEET)
      ══════════════════════════════════════════════════════════════════════════ */}
      {isDrawerOpen && activeReviewItem && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#E50914] block">
                    Review Berkas Siswa
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    {activeReviewItem.groupNumber}
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">{activeReviewItem.schoolName}</span>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Document Metadata Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{activeReviewItem.itemName}</span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    {activeReviewItem.version}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {activeReviewItem.fileName} • {activeReviewItem.fileSize}
                </div>
                <span className="text-[10px] text-slate-400 block">{activeReviewItem.ageText}</span>
              </div>

              {/* Student Submission Notes */}
              {activeReviewItem.studentNotes && (
                <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#E50914] block">
                    Catatan dari Ketua Siswa:
                  </span>
                  <p className="text-xs text-slate-700 italic">"{activeReviewItem.studentNotes}"</p>
                </div>
              )}

              {/* Teacher Feedback Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 block">
                  Catatan Evaluasi Guru Pembimbing:
                </label>
                <textarea
                  rows={4}
                  value={drawerNotes}
                  onChange={(e) => setDrawerNotes(e.target.value)}
                  placeholder="Tulis instruksi revisi atau apresiasi berkas di sini..."
                  className="w-full rounded-2xl border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={handleRequestRevisionDrawer}
                className="flex-1 py-2.5 rounded-full border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                Minta Revisi
              </button>
              <button
                onClick={handleApproveDrawer}
                className="flex-1 py-2.5 rounded-full bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all cursor-pointer"
              >
                Setujui Berkas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          SETUP & ASSIGN LEADER MODAL (DIALOG)
      ══════════════════════════════════════════════════════════════════════════ */}
      {isSetupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsSetupModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-[28px] shadow-2xl p-6 sm:p-8 space-y-6 z-10 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E50914] block">
                  Tahap Persiapan
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Tandai Ketua & Impor Data
                </h3>
              </div>
              <button
                onClick={() => setIsSetupModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-full w-full">
              <button
                onClick={() => setSetupModalTab('assign')}
                className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer text-center ${
                  setupModalTab === 'assign'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Tandai Ketua Cepat
              </button>
              <button
                onClick={() => setSetupModalTab('import')}
                className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer text-center ${
                  setupModalTab === 'import'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Impor Data Excel / CSV
              </button>
            </div>

            {/* Tab 1: Tandai Ketua */}
            {setupModalTab === 'assign' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">
                  Terdapat 2 kelompok yang belum memiliki ketua. Pilih nama siswa untuk ditetapkan sebagai ketua kelompok:
                </p>

                {/* Group 23 */}
                <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Kelompok 23</span>
                    <span className="text-[10px] text-slate-400">SMPN 2 Sedati</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedLeaderMap['23'] || 'Ahmad Fauzi'}
                      onChange={(e) =>
                        setSelectedLeaderMap((prev) => ({ ...prev, '23': e.target.value }))
                      }
                      className="text-xs font-semibold px-2.5 py-1.5 rounded-full border border-slate-300 bg-white outline-none cursor-pointer"
                    >
                      <option value="Ahmad Fauzi">Ahmad Fauzi</option>
                      <option value="Bella Safitri">Bella Safitri</option>
                      <option value="Danu Pratama">Danu Pratama</option>
                    </select>
                    <button
                      onClick={() => handleAssignLeader('23')}
                      className="px-3 py-1.5 rounded-full bg-[#E50914] text-white text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      Tandai
                    </button>
                  </div>
                </div>

                {/* Group 24 */}
                <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Kelompok 24</span>
                    <span className="text-[10px] text-slate-400">SMPN 4 Sidoarjo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedLeaderMap['24'] || 'Salsa Bila Ramadhani'}
                      onChange={(e) =>
                        setSelectedLeaderMap((prev) => ({ ...prev, '24': e.target.value }))
                      }
                      className="text-xs font-semibold px-2.5 py-1.5 rounded-full border border-slate-300 bg-white outline-none cursor-pointer"
                    >
                      <option value="Salsa Bila Ramadhani">Salsa Bila Ramadhani</option>
                      <option value="Bima Satria">Bima Satria</option>
                      <option value="Cahya Ramadhan">Cahya Ramadhan</option>
                    </select>
                    <button
                      onClick={() => handleAssignLeader('24')}
                      className="px-3 py-1.5 rounded-full bg-[#E50914] text-white text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      Tandai
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Impor Data Excel */}
            {setupModalTab === 'import' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">
                  Unggah berkas rekap kelompok dalam format `.xlsx` atau `.csv` dari kurikulum sekolah.
                </p>
                <div
                  onClick={() => {
                    setIsImporting(true);
                    setTimeout(() => {
                      setIsImporting(false);
                      showToast('Data 24 kelompok & 168 siswa berhasil diperbarui dari berkas!', 'success');
                      setIsSetupModalOpen(false);
                    }, 1200);
                  }}
                  className="p-8 rounded-2xl border-2 border-dashed border-slate-300 hover:border-red-500 bg-slate-50 hover:bg-red-50/20 text-center transition-all cursor-pointer space-y-2"
                >
                  <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  <span className="text-xs font-bold text-slate-800 block">
                    {isImporting ? 'Sedang memproses berkas...' : 'Klik atau seret berkas ke area ini'}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Mendukung format .XLSX, .XLS, .CSV</span>
                </div>
              </div>
            )}

            {/* Close Button */}
            <div className="pt-4 border-t border-slate-100 text-right">
              <button
                onClick={() => setIsSetupModalOpen(false)}
                className="px-5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMonitoringPage;
