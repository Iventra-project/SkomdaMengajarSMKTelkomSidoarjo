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
} from 'lucide-react';

// ─── TYPES & INTERFACES ───────────────────────────────────────────────────────
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
  hasLeader: boolean;
  currentStage: string;
  currentStageIndex: number; // 1..6
  completedStages: number;
  approvedItemsCount: number;
  totalItemsCount: number;
  urgentStatus: 'review' | 'overdue' | 'revisi' | 'approved' | 'waiting';
  urgentStatusLabel: string;
  lateDays?: number;
  members: MemberItem[];
  deliverables: DeliverableItem[];
  feedbackList: FeedbackItem[];
}

export interface ActionQueueItem {
  id: string;
  groupId: string;
  groupNumber: string;
  schoolName: string;
  itemName: string;
  status: 'review' | 'overdue' | 'revisi';
  statusLabel: string;
  ageText: string;
  isLate?: boolean;
  lateDays?: number;
  reminderText?: string;
  deliverableId: string;
}

export const SIX_STAGES = [
  'Tahap 1: Atur peran',
  'Tahap 2: Rancang materi',
  'Tahap 3: Buat desain',
  'Tahap 4: Pelaksanaan di SMP',
  'Tahap 5: Kumpulkan laporan',
  'Tahap 6: Terima feedback',
];

// Initial 24 Groups Roster (Authentic Sidoarjo SMP Schools & Students)
const INITIAL_24_GROUPS: GroupItem[] = [
  {
    id: '03',
    number: '03',
    schoolName: 'SMPN 1 Buduran',
    district: 'Buduran',
    leaderName: 'Nabila Putri Ramadhani',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 3,
    totalItemsCount: 5,
    urgentStatus: 'review',
    urgentStatusLabel: 'Menunggu review',
    members: [
      { id: 'm-301', nis: '2024.11.0301', name: 'Nabila Putri Ramadhani', role: 'Ketua kelompok' },
      { id: 'm-302', nis: '2024.11.0302', name: 'Ahmad Rizky Pratama', role: 'Notulen & koordinasi' },
      { id: 'm-303', nis: '2024.11.0303', name: 'Rafi Fadillah', role: 'Desain grafis' },
      { id: 'm-304', nis: '2024.11.0304', name: 'Dinda Salsabila', role: 'Koordinator materi' },
      { id: 'm-305', nis: '2024.11.0305', name: 'M. Arya Bima', role: 'Dokumentasi' },
      { id: 'm-306', nis: '2024.11.0306', name: 'Siti Aisyah', role: 'Logistik' },
      { id: 'm-307', nis: '2024.11.0307', name: 'Bagas Pratama', role: 'Pengajar lab' },
    ],
    deliverables: [
      { id: 'd-1', title: 'RPP / Modul Ajar', fileName: 'RPP_Informatika_SMPN1Buduran.pdf', fileSize: '1.4 MB', updatedAt: 'Kemarin, 14:20', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-2', title: 'Slide Presentasi (PPT)', fileName: 'Slide_Materi_Canva_v1.pptx', fileSize: '8.2 MB', updatedAt: '12 Feb, 10:15', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-3', title: 'Desain X-Banner', fileName: 'X-Banner_SMPN1Buduran_v2.pdf', fileSize: '14.8 MB', updatedAt: '45 menit lalu', status: 'review', statusLabel: 'Menunggu review', version: 'v2 (Terbaru)' },
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
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 3,
    totalItemsCount: 5,
    urgentStatus: 'review',
    urgentStatusLabel: 'Menunggu review',
    members: [
      { id: 'm-201', nis: '2024.11.0201', name: 'Dimas Bagus Wicaksono', role: 'Ketua kelompok' },
      { id: 'm-202', nis: '2024.11.0202', name: 'Arum Sekar Wangi', role: 'Materi Scratch' },
      { id: 'm-203', nis: '2024.11.0203', name: 'Candra Wijaya', role: 'Desain modul' },
      { id: 'm-204', nis: '2024.11.0204', name: 'Dwi Prasetyo', role: 'Notulen & koordinasi' },
      { id: 'm-205', nis: '2024.11.0205', name: 'Fitriani Lestari', role: 'Dokumentasi' },
      { id: 'm-206', nis: '2024.11.0206', name: 'Galih Rakasiwi', role: 'Pengajar lab' },
    ],
    deliverables: [
      { id: 'd-1', title: 'RPP / Modul Ajar', fileName: 'RPP_pertemuan_2_dan_modul_Scratch.pdf', fileSize: '2.1 MB', updatedAt: '2 jam lalu', status: 'review', statusLabel: 'Menunggu review', version: 'v2 (Terbaru)' },
      { id: 'd-2', title: 'Slide Presentasi (PPT)', fileName: 'Slide_Scratch_Game.pptx', fileSize: '6.4 MB', updatedAt: 'Kemarin', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-3', title: 'Desain X-Banner', fileName: 'Banner_SMPN1Waru.pdf', fileSize: '12.0 MB', updatedAt: 'Kemarin', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-4', title: 'Desain Feed Instagram', fileName: 'Feed_SMPN1Waru.png', fileSize: '2.8 MB', updatedAt: '12 Feb', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-5', title: 'Laporan Akhir (Ekspor PDF)', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
    ],
    feedbackList: [
      { id: 'f-21', author: 'Budi Santoso, S.Pd', role: 'Guru Pamong SMP', rating: 5, date: '15 Feb 2026', comment: 'Modul terstruktur dan siswa dibimbing satu per satu.' },
    ],
  },
  {
    id: '06',
    number: '06',
    schoolName: 'SMPN 1 Tulangan',
    district: 'Tulangan',
    leaderName: 'Bagus Pratama Putra',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 3,
    totalItemsCount: 5,
    urgentStatus: 'review',
    urgentStatusLabel: 'Menunggu review',
    members: [
      { id: 'm-601', nis: '2024.11.0601', name: 'Bagus Pratama Putra', role: 'Ketua kelompok' },
      { id: 'm-602', nis: '2024.11.0602', name: 'Citra Dewi', role: 'Desain grafis' },
      { id: 'm-603', nis: '2024.11.0603', name: 'Farhan Ali', role: 'Koordinator materi' },
      { id: 'm-604', nis: '2024.11.0604', name: 'Gita Safitri', role: 'Dokumentasi' },
      { id: 'm-605', nis: '2024.11.0605', name: 'Hafiz Maulana', role: 'Pengajar lab' },
      { id: 'm-606', nis: '2024.11.0606', name: 'Ilham Kusuma', role: 'Logistik' },
    ],
    deliverables: [
      { id: 'd-1', title: 'RPP / Modul Ajar', fileName: 'RPP_Literasi_Digital.pdf', fileSize: '1.8 MB', updatedAt: '13 Feb', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-2', title: 'Slide Presentasi (PPT)', fileName: 'Draf_infografis_materi.pptx', fileSize: '7.5 MB', updatedAt: '3 jam lalu', status: 'review', statusLabel: 'Menunggu review', version: 'v2 (Terbaru)' },
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
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 3,
    totalItemsCount: 5,
    urgentStatus: 'review',
    urgentStatusLabel: 'Menunggu review',
    members: [
      { id: 'm-1201', nis: '2024.11.1201', name: 'Kevin Alamsyah', role: 'Ketua kelompok' },
      { id: 'm-1202', nis: '2024.11.1202', name: 'Laila Zahra', role: 'Koordinator materi' },
      { id: 'm-1203', nis: '2024.11.1203', name: 'Muhammad Fikri', role: 'Desain grafis' },
      { id: 'm-1204', nis: '2024.11.1204', name: 'Nadya Amanda', role: 'Dokumentasi' },
      { id: 'm-1205', nis: '2024.11.1205', name: 'Oki Pratama', role: 'Pengajar lab' },
      { id: 'm-1206', nis: '2024.11.1206', name: 'Putri Ayu', role: 'Logistik' },
    ],
    deliverables: [
      { id: 'd-1', title: 'RPP / Modul Ajar', fileName: 'RPP_Taman_WebDasar.pdf', fileSize: '1.9 MB', updatedAt: '13 Feb', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-2', title: 'Slide Presentasi (PPT)', fileName: 'Slide_presentasi_Canva.pdf', fileSize: '9.3 MB', updatedAt: '4 jam lalu', status: 'review', statusLabel: 'Menunggu review', version: 'v2 (Terbaru)' },
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
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 2,
    totalItemsCount: 5,
    urgentStatus: 'overdue',
    urgentStatusLabel: 'Terlambat 2 hari',
    lateDays: 2,
    members: [
      { id: 'm-701', nis: '2024.11.0701', name: 'Fahri Ramadhan', role: 'Ketua kelompok' },
      { id: 'm-702', nis: '2024.11.0702', name: 'Gading Marten', role: 'Desain grafis' },
      { id: 'm-703', nis: '2024.11.0703', name: 'Hana Safira', role: 'Notulen & koordinasi' },
      { id: 'm-704', nis: '2024.11.0704', name: 'Indra Bekti', role: 'Pengajar lab' },
      { id: 'm-705', nis: '2024.11.0705', name: 'Jihan Audy', role: 'Logistik' },
      { id: 'm-706', nis: '2024.11.0706', name: 'Kurnia Meiga', role: 'Dokumentasi' },
    ],
    deliverables: [
      { id: 'd-1', title: 'RPP / Modul Ajar', fileName: 'RPP_Telkom_SDA.pdf', fileSize: '2.0 MB', updatedAt: '10 Feb', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-2', title: 'Slide Presentasi (PPT)', fileName: 'Slide_Telkom.pptx', fileSize: '5.6 MB', updatedAt: '11 Feb', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-3', title: 'Desain X-Banner', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
      { id: 'd-4', title: 'Desain Feed Instagram', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
      { id: 'd-5', title: 'Laporan Akhir (Ekspor PDF)', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
    ],
    feedbackList: [],
  },
  {
    id: '04',
    number: '04',
    schoolName: 'SMPN 2 Krian',
    district: 'Krian',
    leaderName: 'Siti Nurhaliza',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 2,
    totalItemsCount: 5,
    urgentStatus: 'overdue',
    urgentStatusLabel: 'Terlambat 1 hari',
    lateDays: 1,
    members: [
      { id: 'm-401', nis: '2024.11.0401', name: 'Siti Nurhaliza', role: 'Ketua kelompok' },
      { id: 'm-402', nis: '2024.11.0402', name: 'Bambang Tri', role: 'Koordinator materi' },
      { id: 'm-403', nis: '2024.11.0403', name: 'Cindy Claudia', role: 'Desain grafis' },
      { id: 'm-404', nis: '2024.11.0404', name: 'Doni Salman', role: 'Pengajar lab' },
      { id: 'm-405', nis: '2024.11.0405', name: 'Eka Kurnia', role: 'Dokumentasi' },
      { id: 'm-406', nis: '2024.11.0406', name: 'Fani Oktavia', role: 'Logistik' },
    ],
    deliverables: [
      { id: 'd-1', title: 'RPP / Modul Ajar', fileName: 'RPP_Krian_v1.pdf', fileSize: '1.6 MB', updatedAt: '9 Feb', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-2', title: 'Slide Presentasi (PPT)', fileName: 'Slide_Krian.pptx', fileSize: '4.8 MB', updatedAt: '10 Feb', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-3', title: 'Desain X-Banner', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
      { id: 'd-4', title: 'Desain Feed Instagram', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
      { id: 'd-5', title: 'Laporan Akhir (Ekspor PDF)', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
    ],
    feedbackList: [],
  },
  {
    id: '09',
    number: '09',
    schoolName: 'SMPN 1 Taman',
    district: 'Taman',
    leaderName: 'Rian Hidayat',
    hasLeader: true,
    currentStage: 'Tahap 2: Rancang materi',
    currentStageIndex: 2,
    completedStages: 1,
    approvedItemsCount: 1,
    totalItemsCount: 5,
    urgentStatus: 'overdue',
    urgentStatusLabel: 'Terlambat 3 hari',
    lateDays: 3,
    members: [
      { id: 'm-901', nis: '2024.11.0901', name: 'Rian Hidayat', role: 'Ketua kelompok' },
      { id: 'm-902', nis: '2024.11.0902', name: 'Salsa Bila', role: 'Notulen & koordinasi' },
      { id: 'm-903', nis: '2024.11.0903', name: 'Taufik Hidayat', role: 'Koordinator materi' },
      { id: 'm-904', nis: '2024.11.0904', name: 'Umi Kalsum', role: 'Desain grafis' },
      { id: 'm-905', nis: '2024.11.0905', name: 'Vino Bastian', role: 'Pengajar lab' },
      { id: 'm-906', nis: '2024.11.0906', name: 'Winda Sari', role: 'Dokumentasi' },
    ],
    deliverables: [
      { id: 'd-1', title: 'RPP / Modul Ajar', fileName: 'RPP_Taman1.pdf', fileSize: '1.4 MB', updatedAt: '8 Feb', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-2', title: 'Slide Presentasi (PPT)', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
      { id: 'd-3', title: 'Desain X-Banner', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
      { id: 'd-4', title: 'Desain Feed Instagram', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
      { id: 'd-5', title: 'Laporan Akhir (Ekspor PDF)', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
    ],
    feedbackList: [],
  },
  {
    id: '05',
    number: '05',
    schoolName: 'SMPN 2 Candi',
    district: 'Candi',
    leaderName: 'Dewi Maharani',
    hasLeader: true,
    currentStage: 'Tahap 2: Rancang materi',
    currentStageIndex: 2,
    completedStages: 1,
    approvedItemsCount: 2,
    totalItemsCount: 5,
    urgentStatus: 'revisi',
    urgentStatusLabel: 'Perlu revisi',
    members: [
      { id: 'm-501', nis: '2024.11.0501', name: 'Dewi Maharani', role: 'Ketua kelompok' },
      { id: 'm-502', nis: '2024.11.0502', name: 'Gilang Dirga', role: 'Koordinator materi' },
      { id: 'm-503', nis: '2024.11.0503', name: 'Helena Putri', role: 'Desain grafis' },
      { id: 'm-504', nis: '2024.11.0504', name: 'Irfan Hakim', role: 'Notulen & koordinasi' },
      { id: 'm-505', nis: '2024.11.0505', name: 'Jovita Karen', role: 'Pengajar lab' },
      { id: 'm-506', nis: '2024.11.0506', name: 'Krisna Mukti', role: 'Dokumentasi' },
    ],
    deliverables: [
      { id: 'd-1', title: 'RPP / Modul Ajar', fileName: 'RPP_Candi_Revisi1.pdf', fileSize: '2.3 MB', updatedAt: 'Kemarin', status: 'revision', statusLabel: 'Perlu revisi', version: 'v1' },
      { id: 'd-2', title: 'Slide Presentasi (PPT)', fileName: 'Slide_Candi.pptx', fileSize: '5.1 MB', updatedAt: '12 Feb', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-3', title: 'Desain X-Banner', fileName: 'Banner_Candi.pdf', fileSize: '10.2 MB', updatedAt: '13 Feb', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-4', title: 'Desain Feed Instagram', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
      { id: 'd-5', title: 'Laporan Akhir (Ekspor PDF)', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
    ],
    feedbackList: [],
  },
  // Approved groups 01, 08, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22
  {
    id: '01',
    number: '01',
    schoolName: 'SMPN 1 Sidoarjo',
    district: 'Sidoarjo',
    leaderName: 'Rafli Akbar Pratama',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    members: [
      { id: 'm-101', nis: '2024.11.0101', name: 'Rafli Akbar Pratama', role: 'Ketua kelompok' },
      { id: 'm-102', nis: '2024.11.0102', name: 'Anisa Rahmawati', role: 'Notulen & koordinasi' },
      { id: 'm-103', nis: '2024.11.0103', name: 'Bagas Aditya', role: 'Desain grafis' },
      { id: 'm-104', nis: '2024.11.0104', name: 'Cahya Lestari', role: 'Koordinator materi' },
      { id: 'm-105', nis: '2024.11.0105', name: 'Diki Wahyudi', role: 'Pengajar lab' },
      { id: 'm-106', nis: '2024.11.0106', name: 'Elsa Febriani', role: 'Dokumentasi' },
    ],
    deliverables: [
      { id: 'd-1', title: 'RPP / Modul Ajar', fileName: 'RPP_SMPN1SDA.pdf', fileSize: '1.9 MB', updatedAt: '12 Feb', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-2', title: 'Slide Presentasi (PPT)', fileName: 'Slide_SMPN1SDA.pptx', fileSize: '6.4 MB', updatedAt: '12 Feb', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-3', title: 'Desain X-Banner', fileName: 'X_Banner_SMPN1SDA.pdf', fileSize: '11.8 MB', updatedAt: '13 Feb', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-4', title: 'Desain Feed Instagram', fileName: 'Feed_SMPN1SDA.png', fileSize: '2.9 MB', updatedAt: '13 Feb', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-5', title: 'Laporan Akhir (Ekspor PDF)', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
    ],
    feedbackList: [],
  },
  {
    id: '08',
    number: '08',
    schoolName: 'SMPN 2 Sukodono',
    district: 'Sukodono',
    leaderName: 'Putri Ayu Wandira',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    members: [
      { id: 'm-801', nis: '2024.11.0801', name: 'Putri Ayu Wandira', role: 'Ketua kelompok' },
      { id: 'm-802', nis: '2024.11.0802', name: 'Rangga Sasana', role: 'Koordinator materi' },
      { id: 'm-803', nis: '2024.11.0803', name: 'Shinta Dewi', role: 'Desain grafis' },
      { id: 'm-804', nis: '2024.11.0804', name: 'Teddy Syah', role: 'Pengajar lab' },
      { id: 'm-805', nis: '2024.11.0805', name: 'Utami Rahayu', role: 'Dokumentasi' },
      { id: 'm-806', nis: '2024.11.0806', name: 'Vicky Nitinegoro', role: 'Logistik' },
    ],
    deliverables: [
      { id: 'd-1', title: 'RPP / Modul Ajar', fileName: 'RPP_Sukodono.pdf', fileSize: '1.7 MB', updatedAt: '11 Feb', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-2', title: 'Slide Presentasi (PPT)', fileName: 'Slide_Sukodono.pptx', fileSize: '5.2 MB', updatedAt: '12 Feb', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-3', title: 'Desain X-Banner', fileName: 'Banner_Sukodono.pdf', fileSize: '12.4 MB', updatedAt: '12 Feb', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-4', title: 'Desain Feed Instagram', fileName: 'Feed_Sukodono.png', fileSize: '3.0 MB', updatedAt: '13 Feb', status: 'approved', statusLabel: 'Disetujui', version: 'v1' },
      { id: 'd-5', title: 'Laporan Akhir (Ekspor PDF)', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
    ],
    feedbackList: [],
  },
  {
    id: '10',
    number: '10',
    schoolName: 'SMP Hang Tuah 5',
    district: 'Candi',
    leaderName: 'Kevin Sanjaya',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    members: [{ id: 'm-1001', nis: '2024.11.1001', name: 'Kevin Sanjaya', role: 'Ketua kelompok' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '11',
    number: '11',
    schoolName: 'SMPN 3 Porong',
    district: 'Porong',
    leaderName: 'Zidan Maulana',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    members: [{ id: 'm-1101', nis: '2024.11.1101', name: 'Zidan Maulana', role: 'Ketua kelompok' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '13',
    number: '13',
    schoolName: 'SMP Proklamasi Porong',
    district: 'Porong',
    leaderName: 'Aulia Rahman',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    members: [{ id: 'm-1301', nis: '2024.11.1301', name: 'Aulia Rahman', role: 'Ketua kelompok' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '14',
    number: '14',
    schoolName: 'SMPN 1 Sedati',
    district: 'Sedati',
    leaderName: 'Anisa Rahmawati',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    members: [{ id: 'm-1401', nis: '2024.11.1401', name: 'Anisa Rahmawati', role: 'Ketua kelompok' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '15',
    number: '15',
    schoolName: 'SMPN 2 Gedangan',
    district: 'Gedangan',
    leaderName: 'Rizal Fauzi',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    members: [{ id: 'm-1501', nis: '2024.11.1501', name: 'Rizal Fauzi', role: 'Ketua kelompok' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '16',
    number: '16',
    schoolName: 'SMP PGRI 1 Buduran',
    district: 'Buduran',
    leaderName: 'Doni Firmansyah',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    members: [{ id: 'm-1601', nis: '2024.11.1601', name: 'Doni Firmansyah', role: 'Ketua kelompok' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '17',
    number: '17',
    schoolName: 'SMPN 1 Krembung',
    district: 'Krembung',
    leaderName: 'Fandi Ahmad',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    members: [{ id: 'm-1701', nis: '2024.11.1701', name: 'Fandi Ahmad', role: 'Ketua kelompok' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '18',
    number: '18',
    schoolName: 'SMPN 2 Porong',
    district: 'Porong',
    leaderName: 'Hendra Setiawan',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    members: [{ id: 'm-1801', nis: '2024.11.1801', name: 'Hendra Setiawan', role: 'Ketua kelompok' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '19',
    number: '19',
    schoolName: 'SMPN 1 Tarik',
    district: 'Tarik',
    leaderName: 'Indra Djati',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    members: [{ id: 'm-1901', nis: '2024.11.1901', name: 'Indra Djati', role: 'Ketua kelompok' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '20',
    number: '20',
    schoolName: 'SMPN 2 Prambon',
    district: 'Prambon',
    leaderName: 'Joko Anwar',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    members: [{ id: 'm-2001', nis: '2024.11.2001', name: 'Joko Anwar', role: 'Ketua kelompok' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '21',
    number: '21',
    schoolName: 'SMP Muhammadiyah 1',
    district: 'Sidoarjo',
    leaderName: 'Kiki Narendra',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    members: [{ id: 'm-2101', nis: '2024.11.2101', name: 'Kiki Narendra', role: 'Ketua kelompok' }],
    deliverables: [],
    feedbackList: [],
  },
  {
    id: '22',
    number: '22',
    schoolName: 'SMP YPM 1 Taman',
    district: 'Taman',
    leaderName: 'Lukman Sardi',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    currentStageIndex: 3,
    completedStages: 2,
    approvedItemsCount: 4,
    totalItemsCount: 5,
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    members: [{ id: 'm-2201', nis: '2024.11.2201', name: 'Lukman Sardi', role: 'Ketua kelompok' }],
    deliverables: [],
    feedbackList: [],
  },
  // Two groups without leader
  {
    id: '23',
    number: '23',
    schoolName: 'SMPN 2 Sedati',
    district: 'Sedati',
    leaderName: '',
    hasLeader: false,
    currentStage: 'Tahap 1: Atur peran',
    currentStageIndex: 1,
    completedStages: 0,
    approvedItemsCount: 0,
    totalItemsCount: 5,
    urgentStatus: 'waiting',
    urgentStatusLabel: 'Belum dikumpulkan',
    members: [
      { id: 'm-2301', nis: '2024.11.2301', name: 'Ahmad Fauzi', role: 'Anggota' },
      { id: 'm-2302', nis: '2024.11.2302', name: 'Bella Saphira', role: 'Anggota' },
      { id: 'm-2303', nis: '2024.11.2303', name: 'Cahyo Utomo', role: 'Anggota' },
      { id: 'm-2304', nis: '2024.11.2304', name: 'Dian Sastro', role: 'Anggota' },
      { id: 'm-2305', nis: '2024.11.2305', name: 'Eko Patrio', role: 'Anggota' },
      { id: 'm-2306', nis: '2024.11.2306', name: 'Febri Haryadi', role: 'Anggota' },
    ],
    deliverables: [
      { id: 'd-1', title: 'RPP / Modul Ajar', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
      { id: 'd-2', title: 'Slide Presentasi (PPT)', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
      { id: 'd-3', title: 'Desain X-Banner', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
      { id: 'd-4', title: 'Desain Feed Instagram', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
      { id: 'd-5', title: 'Laporan Akhir (Ekspor PDF)', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
    ],
    feedbackList: [],
  },
  {
    id: '24',
    number: '24',
    schoolName: 'SMPN 4 Sidoarjo',
    district: 'Sidoarjo',
    leaderName: '',
    hasLeader: false,
    currentStage: 'Tahap 1: Atur peran',
    currentStageIndex: 1,
    completedStages: 0,
    approvedItemsCount: 0,
    totalItemsCount: 5,
    urgentStatus: 'waiting',
    urgentStatusLabel: 'Belum dikumpulkan',
    members: [
      { id: 'm-2401', nis: '2024.11.2401', name: 'Salsa Bila Ramadhani', role: 'Anggota' },
      { id: 'm-2402', nis: '2024.11.2402', name: 'Gunawan Dwi', role: 'Anggota' },
      { id: 'm-2403', nis: '2024.11.2403', name: 'Hesti Purwadinata', role: 'Anggota' },
      { id: 'm-2404', nis: '2024.11.2404', name: 'Iwan Fals', role: 'Anggota' },
      { id: 'm-2405', nis: '2024.11.2405', name: 'Julia Perez', role: 'Anggota' },
      { id: 'm-2406', nis: '2024.11.2406', name: 'Katon Bagaskara', role: 'Anggota' },
    ],
    deliverables: [
      { id: 'd-1', title: 'RPP / Modul Ajar', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
      { id: 'd-2', title: 'Slide Presentasi (PPT)', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
      { id: 'd-3', title: 'Desain X-Banner', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
      { id: 'd-4', title: 'Desain Feed Instagram', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
      { id: 'd-5', title: 'Laporan Akhir (Ekspor PDF)', fileName: '—', fileSize: '—', updatedAt: 'Belum diunggah', status: 'pending', statusLabel: 'Belum dikumpulkan', version: '—' },
    ],
    feedbackList: [],
  },
];

// Initial Action Queue Items
const INITIAL_WAITING_ADMIN: ActionQueueItem[] = [
  {
    id: 'act-1',
    groupId: '03',
    groupNumber: 'Kelompok 03',
    schoolName: 'SMPN 1 Buduran',
    itemName: 'X-Banner v2',
    status: 'review',
    statusLabel: 'Menunggu review',
    ageText: 'diajukan 45 menit lalu',
    deliverableId: 'd-3',
  },
  {
    id: 'act-2',
    groupId: '02',
    groupNumber: 'Kelompok 02',
    schoolName: 'SMPN 1 Waru',
    itemName: 'RPP pertemuan 2 & modul Scratch',
    status: 'review',
    statusLabel: 'Menunggu review',
    ageText: 'diajukan 2 jam lalu',
    deliverableId: 'd-1',
  },
  {
    id: 'act-3',
    groupId: '06',
    groupNumber: 'Kelompok 06',
    schoolName: 'SMPN 1 Tulangan',
    itemName: 'Draf infografis materi',
    status: 'review',
    statusLabel: 'Menunggu review',
    ageText: 'diajukan 3 jam lalu',
    deliverableId: 'd-2',
  },
  {
    id: 'act-4',
    groupId: '12',
    groupNumber: 'Kelompok 12',
    schoolName: 'SMPN 2 Taman',
    itemName: 'Slide presentasi Canva',
    status: 'review',
    statusLabel: 'Menunggu review',
    ageText: 'diajukan 4 jam lalu',
    deliverableId: 'd-2',
  },
];

const INITIAL_WAITING_GROUP: ActionQueueItem[] = [
  {
    id: 'act-5',
    groupId: '07',
    groupNumber: 'Kelompok 07',
    schoolName: 'SMP Telkom Sidoarjo',
    itemName: 'Desain X-Banner',
    status: 'overdue',
    statusLabel: 'Terlambat 2 hari',
    ageText: 'terlambat 2 hari',
    isLate: true,
    lateDays: 2,
    deliverableId: 'd-3',
    reminderText: 'Halo Fahri (Ketua Kelompok 07)! Desain X-Banner 60x160cm Anda terlambat 2 hari dari tenggat 15 Feb. Mohon segera diunggah hari ini ke portal Skomda Mengajar.',
  },
  {
    id: 'act-6',
    groupId: '04',
    groupNumber: 'Kelompok 04',
    schoolName: 'SMPN 2 Krian',
    itemName: 'Draf modul pembelajaran',
    status: 'overdue',
    statusLabel: 'Terlambat 1 hari',
    ageText: 'terlambat 1 hari',
    isLate: true,
    lateDays: 1,
    deliverableId: 'd-1',
    reminderText: 'Halo Siti (Ketua Kelompok 04)! Draf modul pembelajaran Anda telah melewati tenggat 1 hari. Mohon finalisasi draf dan ajukan verifikasi guru pembimbing.',
  },
  {
    id: 'act-7',
    groupId: '09',
    groupNumber: 'Kelompok 09',
    schoolName: 'SMPN 1 Taman',
    itemName: 'Slide presentasi materi',
    status: 'overdue',
    statusLabel: 'Terlambat 3 hari',
    ageText: 'terlambat 3 hari',
    isLate: true,
    lateDays: 3,
    deliverableId: 'd-2',
    reminderText: 'Halo Rian (Ketua Kelompok 09)! Slide presentasi materi masih belum diunggah (terlambat 3 hari). Segera koordinasi dengan anggota regu Anda.',
  },
  {
    id: 'act-8',
    groupId: '05',
    groupNumber: 'Kelompok 05',
    schoolName: 'SMPN 2 Candi',
    itemName: 'Revisi RPP Tatap Muka',
    status: 'revisi',
    statusLabel: 'Perlu revisi',
    ageText: 'revisi belum diunggah ulang',
    deliverableId: 'd-1',
    reminderText: 'Halo Dewi (Ketua Kelompok 05)! Catatan revisi RPP tatap muka dari guru pembimbing belum direspons. Silakan perbaiki alokasi waktu JP dan unggah ulang.',
  },
];

export const AdminMonitoringPage: React.FC = () => {
  const { navigate, showToast, currentPath } = useApp();

  // ─── MASTER STATE ─────────────────────────────────────────────────────────
  const [groups, setGroups] = useState<GroupItem[]>(INITIAL_24_GROUPS);
  const [waitingAdmin, setWaitingAdmin] = useState<ActionQueueItem[]>(INITIAL_WAITING_ADMIN);
  const [waitingGroup, setWaitingGroup] = useState<ActionQueueItem[]>(INITIAL_WAITING_GROUP);

  // View Navigation State: null = View 1 (Main Dashboard), string = View 4 (Group Detail for that groupId)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(() => {
    if (currentPath && currentPath.startsWith('/admin/kelompok/')) {
      const parts = currentPath.split('/');
      return parts[parts.length - 1] || null;
    }
    return null;
  });

  // Action Queue Filter Tab: 'admin' (Menunggu Anda) vs 'kelompok' (Menunggu kelompok)
  const [actionTab, setActionTab] = useState<'admin' | 'kelompok'>('admin');
  const [copiedReminderId, setCopiedReminderId] = useState<string | null>(null);

  // Master Table Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPill, setFilterPill] = useState<'all' | 'attention' | 'done'>('all');

  // VIEW 2: Setup Modal State
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [setupModalTab, setSetupModalTab] = useState<'leader' | 'import'>('leader');
  const [leaderFilter, setLeaderFilter] = useState<'unassigned' | 'all'>('unassigned');
  const [selectedLeaderMap, setSelectedLeaderMap] = useState<Record<string, string>>({
    '23': 'Ahmad Fauzi',
    '24': 'Salsa Bila Ramadhani',
  });
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{ group: string; user: string; pass: string } | null>(null);

  // VIEW 3: Quick Review Drawer/Modal State
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewItem, setReviewItem] = useState<{
    groupId: string;
    groupNumber: string;
    schoolName: string;
    itemName: string;
    fileName: string;
    fileSize: string;
    version: string;
    deliverableId: string;
  } | null>(null);
  const [reviewVersion, setReviewVersion] = useState<'v2' | 'v1'>('v2');
  const [reviewNotes, setReviewNotes] = useState('');
  const [checkImageRes, setCheckImageRes] = useState(true);
  const [checkBranding, setCheckBranding] = useState(true);
  const [checkLayout, setCheckLayout] = useState(true);

  // VIEW 4: Group Detail Active Sub-Tab
  const [groupDetailTab, setGroupDetailTab] = useState<'members' | 'deliverables' | 'feedback'>('members');
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentNIS, setNewStudentNIS] = useState('');
  const [newStudentRole, setNewStudentRole] = useState('Anggota');
  const [moveStudentTarget, setMoveStudentTarget] = useState<string | null>(null);
  const [moveTargetGroup, setMoveTargetGroup] = useState('01');
  const [newFeedbackComment, setNewFeedbackComment] = useState('');
  const [newFeedbackRating, setNewFeedbackRating] = useState(5);
  const [newFeedbackAuthor, setNewFeedbackAuthor] = useState('');

  // ─── DERIVED VALUES ───────────────────────────────────────────────────────
  const groupsWithLeaderCount = useMemo(() => {
    return groups.filter((g) => g.hasLeader).length;
  }, [groups]);

  const isPersiapanUnfinished = groupsWithLeaderCount < groups.length;

  // Filtered Master Table Rows
  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        g.number.toLowerCase().includes(query) ||
        g.schoolName.toLowerCase().includes(query) ||
        g.district.toLowerCase().includes(query) ||
        (g.leaderName && g.leaderName.toLowerCase().includes(query));

      if (!matchSearch) return false;

      // Filter pill match
      if (filterPill === 'attention') {
        return g.urgentStatus === 'overdue' || g.urgentStatus === 'revisi' || !g.hasLeader;
      }
      if (filterPill === 'done') {
        return g.urgentStatus === 'approved' || g.approvedItemsCount >= 4;
      }
      return true;
    });
  }, [groups, searchQuery, filterPill]);

  // Selected Group for View 4
  const activeGroup = useMemo(() => {
    if (!selectedGroupId) return null;
    return groups.find((g) => g.id === selectedGroupId) || groups[0];
  }, [groups, selectedGroupId]);

  // ─── HANDLERS ─────────────────────────────────────────────────────────────

  // Open View 3 (Review Modal)
  const handleOpenReview = (item: ActionQueueItem) => {
    const grp = groups.find((g) => g.id === item.groupId);
    const del = grp?.deliverables.find((d) => d.id === item.deliverableId) || {
      fileName: `${item.itemName.replace(/\s+/g, '_')}.pdf`,
      fileSize: '12.4 MB',
      version: 'v2 (Terbaru)',
    };

    setReviewItem({
      groupId: item.groupId,
      groupNumber: item.groupNumber,
      schoolName: item.schoolName,
      itemName: item.itemName,
      fileName: del.fileName,
      fileSize: del.fileSize,
      version: del.version,
      deliverableId: item.deliverableId,
    });
    setReviewVersion('v2');
    setReviewNotes('');
    setCheckImageRes(true);
    setCheckBranding(true);
    setCheckLayout(true);
    setIsReviewOpen(true);
  };

  // Approve Deliverable (Setujui Berkas)
  const handleApproveSubmission = () => {
    if (!reviewItem) return;

    // 1. Update Group deliverables & counters
    setGroups((prev) =>
      prev.map((grp) => {
        if (grp.id === reviewItem.groupId) {
          const nextCount = Math.min(5, grp.approvedItemsCount + 1);
          const nextDeliverables = grp.deliverables.map((d) =>
            d.id === reviewItem.deliverableId
              ? { ...d, status: 'approved' as const, statusLabel: 'Disetujui', updatedAt: 'Baru saja disetujui' }
              : d
          );
          return {
            ...grp,
            approvedItemsCount: nextCount,
            urgentStatus: 'approved' as const,
            urgentStatusLabel: 'Disetujui',
            deliverables: nextDeliverables,
          };
        }
        return grp;
      })
    );

    // 2. Remove from waitingAdmin queue
    setWaitingAdmin((prev) => prev.filter((it) => !(it.groupId === reviewItem.groupId && it.deliverableId === reviewItem.deliverableId)));

    showToast(`Berkas "${reviewItem.itemName}" Kelompok ${reviewItem.groupNumber} berhasil disetujui!`, 'success');
    setIsReviewOpen(false);
  };

  // Request Revision (Minta Revisi)
  const handleRequestRevision = () => {
    if (!reviewItem) return;
    const note = reviewNotes.trim() || 'Perlu perbaikan tata letak dan penyesuaian logo sesuai pedoman kurikulum.';

    // 1. Update Group status
    setGroups((prev) =>
      prev.map((grp) => {
        if (grp.id === reviewItem.groupId) {
          const nextDeliverables = grp.deliverables.map((d) =>
            d.id === reviewItem.deliverableId
              ? { ...d, status: 'revision' as const, statusLabel: 'Perlu revisi', updatedAt: 'Diminta revisi hari ini' }
              : d
          );
          return {
            ...grp,
            urgentStatus: 'revisi' as const,
            urgentStatusLabel: 'Perlu revisi',
            deliverables: nextDeliverables,
          };
        }
        return grp;
      })
    );

    // 2. Remove from waitingAdmin, add to waitingGroup
    setWaitingAdmin((prev) => prev.filter((it) => !(it.groupId === reviewItem.groupId && it.deliverableId === reviewItem.deliverableId)));
    setWaitingGroup((prev) => [
      ...prev,
      {
        id: `act-rev-${Date.now()}`,
        groupId: reviewItem.groupId,
        groupNumber: reviewItem.groupNumber,
        schoolName: reviewItem.schoolName,
        itemName: reviewItem.itemName,
        status: 'revisi' as const,
        statusLabel: 'Perlu revisi',
        ageText: 'revisi belum diunggah ulang',
        deliverableId: reviewItem.deliverableId,
        reminderText: `Catatan pembimbing: "${note}". Mohon segera perbaiki berkas ${reviewItem.itemName} dan unggah ulang.`,
      },
    ]);

    showToast(`Catatan revisi telah dikirimkan ke ${reviewItem.groupNumber}.`, 'info');
    setIsReviewOpen(false);
  };

  // Copy Reminder to Clipboard
  const handleCopyReminder = (item: ActionQueueItem) => {
    const text =
      item.reminderText ||
      `Halo ${item.groupNumber} (${item.schoolName})! Berkas ${item.itemName} Anda memerlukan perhatian segera. Silakan akses portal Skomda Mengajar untuk pembaruan.`;

    navigator.clipboard?.writeText(text);
    setCopiedReminderId(item.id);
    showToast('Teks pengingat otomatis disalin ke clipboard!', 'success');
    setTimeout(() => setCopiedReminderId(null), 3000);
  };

  // Activate / Assign Leader in View 2
  const handleActivateLeader = (groupId: string) => {
    const chosenStudent = selectedLeaderMap[groupId] || 'Ahmad Fauzi';

    setGroups((prev) =>
      prev.map((grp) => {
        if (grp.id === groupId) {
          const updatedMembers = grp.members.map((m) =>
            m.name === chosenStudent ? { ...m, role: 'Ketua kelompok' } : m.role === 'Ketua kelompok' ? { ...m, role: 'Anggota' } : m
          );
          return {
            ...grp,
            hasLeader: true,
            leaderName: chosenStudent,
            members: updatedMembers,
            urgentStatus: 'approved' as const,
            urgentStatusLabel: 'Disetujui',
          };
        }
        return grp;
      })
    );

    const email = `${chosenStudent.toLowerCase().replace(/\s+/g, '.')}@smktelkom-sda.sch.id`;
    setCreatedCredentials({
      group: `Kelompok ${groupId}`,
      user: email,
      pass: 'Skomda2026!#' + groupId,
    });

    showToast(`Ketua ${chosenStudent} berhasil ditetapkan untuk Kelompok ${groupId}!`, 'success');
  };

  // Simulate Bulk CSV Import in View 2
  const handleRunImport = () => {
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
      setImportSuccess(true);
      showToast('180 Siswa & 24 Sekolah Mitra berhasil disinkronkan dari CSV!', 'success');
    }, 1200);
  };

  // View 4: Change Stage Override
  const handleStageOverride = (groupId: string, newStage: string) => {
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
    showToast(`Tahap kerja Kelompok ${groupId} disesuaikan ke "${newStage}".`, 'info');
  };

  // View 4: Change Member Role
  const handleChangeRole = (groupId: string, memberId: string, newRole: string) => {
    setGroups((prev) =>
      prev.map((grp) => {
        if (grp.id === groupId) {
          let newLeaderName = grp.leaderName;
          const updated = grp.members.map((m) => {
            if (m.id === memberId) {
              if (newRole === 'Ketua kelompok') {
                newLeaderName = m.name;
              }
              return { ...m, role: newRole };
            }
            if (newRole === 'Ketua kelompok' && m.role === 'Ketua kelompok') {
              return { ...m, role: 'Anggota' };
            }
            return m;
          });
          return {
            ...grp,
            leaderName: newLeaderName,
            hasLeader: Boolean(newLeaderName),
            members: updated,
          };
        }
        return grp;
      })
    );
    showToast('Peran siswa berhasil diperbarui.', 'success');
  };

  // View 4: Add New Student
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGroup || !newStudentName.trim()) return;

    const newMember: MemberItem = {
      id: `m-new-${Date.now()}`,
      nis: newStudentNIS.trim() || `2024.11.${activeGroup.number}${activeGroup.members.length + 1}`,
      name: newStudentName.trim(),
      role: newStudentRole,
    };

    setGroups((prev) =>
      prev.map((grp) => (grp.id === activeGroup.id ? { ...grp, members: [...grp.members, newMember] } : grp))
    );

    setNewStudentName('');
    setNewStudentNIS('');
    setIsAddStudentOpen(false);
    showToast(`Siswa "${newMember.name}" berhasil ditambahkan ke regu.`, 'success');
  };

  // View 4: Move Student to Another Group
  const handleMoveStudent = (studentId: string, targetGroupId: string) => {
    if (!activeGroup) return;
    const targetStudent = activeGroup.members.find((m) => m.id === studentId);
    if (!targetStudent) return;

    setGroups((prev) =>
      prev.map((grp) => {
        if (grp.id === activeGroup.id) {
          return { ...grp, members: grp.members.filter((m) => m.id !== studentId) };
        }
        if (grp.id === targetGroupId) {
          return { ...grp, members: [...grp.members, { ...targetStudent, role: 'Anggota' }] };
        }
        return grp;
      })
    );

    setMoveStudentTarget(null);
    showToast(`Siswa "${targetStudent.name}" dipindahkan ke Kelompok ${targetGroupId}.`, 'info');
  };

  // View 4: Submit New External Feedback
  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGroup || !newFeedbackComment.trim()) return;

    const newFb: FeedbackItem = {
      id: `fb-${Date.now()}`,
      author: newFeedbackAuthor.trim() || 'Guru Pendamping SMP',
      role: 'Guru Pamong SMP',
      rating: newFeedbackRating,
      date: 'Hari ini',
      comment: newFeedbackComment.trim(),
    };

    setGroups((prev) =>
      prev.map((grp) => (grp.id === activeGroup.id ? { ...grp, feedbackList: [newFb, ...grp.feedbackList] } : grp))
    );

    setNewFeedbackComment('');
    setNewFeedbackAuthor('');
    showToast('Feedback dari pihak SMP berhasil dicatat!', 'success');
  };

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER: VIEW 4 (GROUP DETAIL & CUSTOMIZATION WORKSPACE)
  // ════════════════════════════════════════════════════════════════════════════
  if (selectedGroupId && activeGroup) {
    return (
      <div className="w-full min-h-screen bg-[#F7F5F2] text-[#21201E] font-['Poppins'] antialiased selection:bg-[#E20113] selection:text-white pb-20">
        {/* Top Header */}
        <header className="w-full bg-white border-b border-[#E6E2DE] sticky top-0 z-30 shadow-2xs">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedGroupId(null);
                  navigate('/admin');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-[#21201E] text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Pantau kelompok</span>
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-bold text-slate-800">
                Kelompok {activeGroup.number} — {activeGroup.schoolName}
              </span>
            </div>

            {/* Stage Override Selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#6B6560] font-medium hidden sm:inline">
                Sesuaikan Tahap Kelompok:
              </span>
              <div className="relative">
                <select
                  value={activeGroup.currentStage}
                  onChange={(e) => handleStageOverride(activeGroup.id, e.target.value)}
                  className="h-9 pl-3 pr-8 text-xs font-semibold bg-white border border-[#21201E] rounded-[4px] text-[#21201E] focus:outline-none cursor-pointer appearance-none shadow-2xs"
                >
                  {SIX_STAGES.map((stg) => (
                    <option key={stg} value={stg}>
                      {stg}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-3 text-[#21201E] pointer-events-none" />
              </div>
            </div>
          </div>
        </header>

        {/* Workspace Body */}
        <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          {/* Group Overview Banner Card */}
          <div className="bg-white border border-[#E6E2DE] rounded-[4px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-[3px] bg-[#E20113] text-white text-[10px] font-extrabold uppercase tracking-wider">
                  Kelompok {activeGroup.number}
                </span>
                <span className="text-xs font-semibold text-slate-600">Kec. {activeGroup.district}</span>
                <span className="text-slate-300">•</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-[4px] ${
                    activeGroup.urgentStatus === 'approved'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : activeGroup.urgentStatus === 'review'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : activeGroup.urgentStatus === 'overdue'
                      ? 'bg-red-50 text-red-800 border border-red-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {activeGroup.urgentStatusLabel}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-[#21201E] tracking-tight">
                {activeGroup.schoolName}
              </h1>
              <p className="text-xs text-[#6B6560]">
                Ketua Regu:{' '}
                <strong className="text-[#21201E]">
                  {activeGroup.hasLeader ? activeGroup.leaderName : 'Belum Ditentukan'}
                </strong>{' '}
                • Total Anggota: <strong className="text-[#21201E]">{activeGroup.members.length} Siswa</strong>
              </p>
            </div>

            <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-[#E6E2DE] pt-4 md:pt-0 md:pl-6">
              <div>
                <span className="text-[11px] text-[#6B6560] block font-medium">Status Item</span>
                <span className="text-xl font-extrabold text-[#21201E] mt-0.5 block">
                  {activeGroup.approvedItemsCount} dari {activeGroup.totalItemsCount}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">Telah Disetujui</span>
              </div>

              <div>
                <span className="text-[11px] text-[#6B6560] block font-medium">Tahap Berjalan</span>
                <span className="text-sm font-bold text-[#E20113] mt-0.5 block">
                  Tahap 0{activeGroup.currentStageIndex}
                </span>
                <span className="text-[10px] text-[#6B6560]">Tenggat 15 Feb</span>
              </div>
            </div>
          </div>

          {/* 3 Interactive Sub-Tabs */}
          <div className="flex items-center border-b border-[#E6E2DE] gap-6 text-xs font-semibold">
            <button
              onClick={() => setGroupDetailTab('members')}
              className={`pb-3 transition-colors cursor-pointer flex items-center gap-2 ${
                groupDetailTab === 'members'
                  ? 'border-b-2 border-[#21201E] text-[#21201E]'
                  : 'text-[#6B6560] hover:text-[#21201E]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>1. Anggota & Peran ({activeGroup.members.length})</span>
            </button>

            <button
              onClick={() => setGroupDetailTab('deliverables')}
              className={`pb-3 transition-colors cursor-pointer flex items-center gap-2 ${
                groupDetailTab === 'deliverables'
                  ? 'border-b-2 border-[#21201E] text-[#21201E]'
                  : 'text-[#6B6560] hover:text-[#21201E]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>2. 5 Item Wajib & Berkas ({activeGroup.approvedItemsCount}/5)</span>
            </button>

            <button
              onClick={() => setGroupDetailTab('feedback')}
              className={`pb-3 transition-colors cursor-pointer flex items-center gap-2 ${
                groupDetailTab === 'feedback'
                  ? 'border-b-2 border-[#21201E] text-[#21201E]'
                  : 'text-[#6B6560] hover:text-[#21201E]'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>3. QR Code & Feedback SMP</span>
            </button>
          </div>

          {/* ─── TAB 1: ANGGOTA & PERAN ─── */}
          {groupDetailTab === 'members' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#21201E]">Kustomisasi Peran & Roster Siswa</h3>
                  <p className="text-xs text-[#6B6560]">
                    Ubah peran siswa, tetapkan ketua regu baru, atau tambahkan siswa ke dalam kelompok ini.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddStudentOpen(true)}
                  className="px-3.5 py-1.5 bg-[#21201E] hover:bg-slate-800 text-white rounded-[4px] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Siswa</span>
                </button>
              </div>

              <div className="bg-white border border-[#E6E2DE] rounded-[4px] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E6E2DE] text-[#6B6560] font-medium bg-[#F7F5F2]/40">
                      <th className="py-2.5 px-4 font-medium w-12">No</th>
                      <th className="py-2.5 px-4 font-medium">NIS Siswa</th>
                      <th className="py-2.5 px-4 font-medium">Nama Lengkap Siswa</th>
                      <th className="py-2.5 px-4 font-medium">Peran / Tugas Regu</th>
                      <th className="py-2.5 px-4 font-medium text-right">Aksi Manajemen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E2DE]">
                    {activeGroup.members.map((mbr, idx) => (
                      <tr key={mbr.id} className="hover:bg-[#F7F5F2]/40 transition-colors">
                        <td className="py-3 px-4 text-[#6B6560] font-mono">{idx + 1}</td>
                        <td className="py-3 px-4 font-mono text-[#6B6560]">{mbr.nis}</td>
                        <td className="py-3 px-4 font-bold text-[#21201E]">
                          {mbr.name}
                          {mbr.role === 'Ketua kelompok' && (
                            <span className="ml-2 px-1.5 py-0.5 rounded-[2px] bg-[#E20113] text-white text-[9px] font-extrabold uppercase">
                              Ketua
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={mbr.role}
                            onChange={(e) => handleChangeRole(activeGroup.id, mbr.id, e.target.value)}
                            className="h-8 px-2.5 text-xs bg-white border border-[#E6E2DE] rounded-[4px] text-[#21201E] focus:outline-none focus:border-[#21201E] cursor-pointer"
                          >
                            <option value="Ketua kelompok">Ketua kelompok</option>
                            <option value="Notulen & koordinasi">Notulen & koordinasi</option>
                            <option value="Desain grafis">Desain grafis</option>
                            <option value="Koordinator materi">Koordinator materi</option>
                            <option value="Dokumentasi">Dokumentasi</option>
                            <option value="Pengajar lab">Pengajar lab</option>
                            <option value="Logistik">Logistik</option>
                            <option value="Anggota">Anggota</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {mbr.role !== 'Ketua kelompok' && (
                              <button
                                onClick={() => handleChangeRole(activeGroup.id, mbr.id, 'Ketua kelompok')}
                                className="px-2 py-1 text-[11px] font-semibold text-[#E20113] border border-red-200 hover:bg-red-50 rounded-[4px] cursor-pointer"
                              >
                                Jadikan Ketua
                              </button>
                            )}
                            <button
                              onClick={() => setMoveStudentTarget(mbr.id)}
                              className="px-2 py-1 text-[11px] font-semibold text-[#6B6560] border border-[#E6E2DE] hover:bg-slate-50 rounded-[4px] cursor-pointer"
                            >
                              Pindah Kelompok
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── TAB 2: 5 ITEM WAJIB & BERKAS ─── */}
          {groupDetailTab === 'deliverables' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#21201E]">Daftar 5 Artefak Wajib Kurikulum</h3>
                <p className="text-xs text-[#6B6560]">
                  Setiap kelompok wajib menyelesaikan kelima berkas ini untuk verifikasi kelulusan program Skomda Mengajar.
                </p>
              </div>

              <div className="bg-white border border-[#E6E2DE] rounded-[4px] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E6E2DE] text-[#6B6560] font-medium bg-[#F7F5F2]/40">
                      <th className="py-2.5 px-4 font-medium">Artefak Wajib</th>
                      <th className="py-2.5 px-4 font-medium">Nama Berkas & Ukuran</th>
                      <th className="py-2.5 px-4 font-medium">Terakhir Diperbarui</th>
                      <th className="py-2.5 px-4 font-medium">Status Verifikasi</th>
                      <th className="py-2.5 px-4 font-medium text-right">Tindakan Pembimbing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E2DE]">
                    {activeGroup.deliverables.map((del) => (
                      <tr key={del.id} className="hover:bg-[#F7F5F2]/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#21201E]">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <span>{del.title}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-[#6B6560]">
                          <div>{del.fileName}</div>
                          <span className="text-[10px] text-slate-400">{del.fileSize}</span>
                        </td>
                        <td className="py-3.5 px-4 text-[#6B6560]">{del.updatedAt}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-[4px] text-[11px] font-semibold ${
                              del.status === 'approved'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : del.status === 'review'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : del.status === 'revision'
                                ? 'bg-red-50 text-red-800 border border-red-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {del.statusLabel}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {del.status !== 'pending' && (
                              <button
                                onClick={() => {
                                  setReviewItem({
                                    groupId: activeGroup.id,
                                    groupNumber: `Kelompok ${activeGroup.number}`,
                                    schoolName: activeGroup.schoolName,
                                    itemName: del.title,
                                    fileName: del.fileName,
                                    fileSize: del.fileSize,
                                    version: del.version,
                                    deliverableId: del.id,
                                  });
                                  setIsReviewOpen(true);
                                }}
                                className="px-3 py-1 rounded-[4px] border border-[#21201E] text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer inline-flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Lihat / Review</span>
                              </button>
                            )}

                            {del.status === 'approved' ? (
                              <button
                                onClick={() => {
                                  setGroups((prev) =>
                                    prev.map((g) =>
                                      g.id === activeGroup.id
                                        ? {
                                            ...g,
                                            deliverables: g.deliverables.map((d) =>
                                              d.id === del.id ? { ...d, status: 'revision', statusLabel: 'Perlu revisi' } : d
                                            ),
                                          }
                                        : g
                                    )
                                  );
                                  showToast(`Status "${del.title}" diubah menjadi Perlu Revisi.`, 'info');
                                }}
                                className="px-2 py-1 text-[11px] text-[#6B6560] hover:text-[#E20113] cursor-pointer"
                              >
                                Batal Disetujui
                              </button>
                            ) : del.status !== 'pending' ? (
                              <button
                                onClick={() => {
                                  setGroups((prev) =>
                                    prev.map((g) =>
                                      g.id === activeGroup.id
                                        ? {
                                            ...g,
                                            deliverables: g.deliverables.map((d) =>
                                              d.id === del.id ? { ...d, status: 'approved', statusLabel: 'Disetujui' } : d
                                            ),
                                          }
                                        : g
                                    )
                                  );
                                  showToast(`Status "${del.title}" disetujui langsung.`, 'success');
                                }}
                                className="px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 rounded-[4px] cursor-pointer"
                              >
                                Setujui Langsung
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── TAB 3: QR CODE & FEEDBACK SMP ─── */}
          {groupDetailTab === 'feedback' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Card: QR Code Evaluasi */}
              <div className="lg:col-span-5 bg-white border border-[#E6E2DE] rounded-[4px] p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-[#E20113]" />
                  <h4 className="text-sm font-bold text-[#21201E]">QR Code Evaluasi SMP</h4>
                </div>
                <p className="text-xs text-[#6B6560] leading-relaxed">
                  Guru Pamong & siswa di {activeGroup.schoolName} dapat memindai QR code ini tanpa login untuk memberikan penilaian langsung.
                </p>

                {/* Styled SVG QR Code */}
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center">
                  <div className="w-44 h-44 bg-white p-3 rounded-lg border border-slate-300 shadow-xs flex items-center justify-center relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-[#21201E]">
                      {/* Corner 1 */}
                      <rect x="5" y="5" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="4" />
                      <rect x="11" y="11" width="14" height="14" fill="currentColor" />
                      {/* Corner 2 */}
                      <rect x="69" y="5" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="4" />
                      <rect x="75" y="11" width="14" height="14" fill="currentColor" />
                      {/* Corner 3 */}
                      <rect x="5" y="69" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="4" />
                      <rect x="11" y="75" width="14" height="14" fill="currentColor" />
                      {/* Random Matrix Pattern */}
                      <rect x="36" y="8" width="6" height="6" fill="currentColor" />
                      <rect x="46" y="14" width="8" height="6" fill="currentColor" />
                      <rect x="58" y="8" width="6" height="8" fill="currentColor" />
                      <rect x="36" y="24" width="10" height="6" fill="currentColor" />
                      <rect x="50" y="24" width="14" height="6" fill="currentColor" />
                      <rect x="8" y="36" width="6" height="10" fill="currentColor" />
                      <rect x="18" y="44" width="8" height="6" fill="currentColor" />
                      <rect x="8" y="56" width="12" height="6" fill="currentColor" />
                      <rect x="36" y="36" width="28" height="28" fill="#E20113" rx="4" />
                      <text x="50" y="54" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">
                        SMK
                      </text>
                      <rect x="68" y="36" width="8" height="14" fill="currentColor" />
                      <rect x="80" y="42" width="12" height="8" fill="currentColor" />
                      <rect x="72" y="54" width="16" height="6" fill="currentColor" />
                      <rect x="36" y="70" width="12" height="6" fill="currentColor" />
                      <rect x="52" y="76" width="8" height="14" fill="currentColor" />
                      <rect x="64" y="70" width="10" height="8" fill="currentColor" />
                      <rect x="78" y="74" width="14" height="16" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 mt-3">
                    ID: SKD-2026-KEL{activeGroup.number}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(`https://skomda.id/eval/kelompok-${activeGroup.number}`);
                      showToast('Tautan feedback berhasil disalin ke clipboard!', 'success');
                    }}
                    className="flex-1 py-2 bg-white border border-[#21201E] rounded-[4px] text-xs font-semibold hover:bg-slate-50 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Link Feedback</span>
                  </button>
                  <button
                    onClick={() => showToast('QR Code siap cetak diunduh (PNG)', 'success')}
                    className="py-2 px-3 border border-slate-300 rounded-[4px] hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Unduh file QR Code"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-700" />
                  </button>
                </div>
              </div>

              {/* Right Card: Live Feedback Roster & Summary */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white border border-[#E6E2DE] rounded-[4px] p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E2DE]">
                    <div>
                      <h4 className="text-sm font-bold text-[#21201E]">Ringkasan Evaluasi Mitra</h4>
                      <p className="text-xs text-[#6B6560]">Tercatat secara langsung dari form SMP</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-[#F2B33D]">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-lg font-extrabold text-[#21201E]">4.8</span>
                          <span className="text-xs text-slate-400">/ 5.0</span>
                        </div>
                        <span className="text-[10px] text-[#6B6560]">Dari 18 Responden</span>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Comments Stream */}
                  <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                    {activeGroup.feedbackList.length === 0 ? (
                      <p className="text-xs text-[#6B6560] py-4 text-center italic">
                        Belum ada tanggapan masuk untuk kelompok ini. Sebarkan tautan QR di atas.
                      </p>
                    ) : (
                      activeGroup.feedbackList.map((fb) => (
                        <div key={fb.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#21201E]">{fb.author}</span>
                            <div className="flex items-center text-[#F2B33D] gap-0.5">
                              {Array.from({ length: fb.rating }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-current" />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <span>{fb.role}</span>
                            <span>•</span>
                            <span>{fb.date}</span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed italic">"{fb.comment}"</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Form to simulate incoming feedback */}
                  <form onSubmit={handleAddFeedback} className="pt-4 border-t border-[#E6E2DE] space-y-3">
                    <span className="text-xs font-bold text-[#21201E] block">
                      Catat Evaluasi Luring (Input Pembimbing):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <input
                        type="text"
                        value={newFeedbackAuthor}
                        onChange={(e) => setNewFeedbackAuthor(e.target.value)}
                        placeholder="Nama Guru Pamong / Penilai"
                        className="sm:col-span-8 h-8 px-3 text-xs bg-white border border-[#E6E2DE] rounded-[4px] text-[#21201E] focus:outline-none"
                      />
                      <select
                        value={newFeedbackRating}
                        onChange={(e) => setNewFeedbackRating(Number(e.target.value))}
                        className="sm:col-span-4 h-8 px-2 text-xs bg-white border border-[#E6E2DE] rounded-[4px] text-[#21201E] focus:outline-none"
                      >
                        <option value={5}>5 Bintang (Sempurna)</option>
                        <option value={4}>4 Bintang (Sangat Baik)</option>
                        <option value={3}>3 Bintang (Cukup)</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newFeedbackComment}
                        onChange={(e) => setNewFeedbackComment(e.target.value)}
                        placeholder="Ketik ringkasan evaluasi lisan..."
                        className="flex-1 h-8 px-3 text-xs bg-white border border-[#E6E2DE] rounded-[4px] text-[#21201E] focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-3 h-8 bg-[#21201E] text-white rounded-[4px] text-xs font-semibold cursor-pointer inline-flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Kirim</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Modal: Tambah Siswa Baru */}
        {isAddStudentOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white max-w-md w-full rounded-[4px] border border-[#E6E2DE] p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-[#E6E2DE]">
                <h4 className="text-sm font-bold text-[#21201E]">Tambah Siswa ke Kelompok {activeGroup.number}</h4>
                <button onClick={() => setIsAddStudentOpen(false)} className="cursor-pointer text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap Siswa</label>
                  <input
                    type="text"
                    required
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="Contoh: Muhammad Haidar"
                    className="w-full h-9 px-3 border border-[#E6E2DE] rounded-[4px] focus:outline-none focus:border-[#21201E]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">NIS Siswa</label>
                  <input
                    type="text"
                    value={newStudentNIS}
                    onChange={(e) => setNewStudentNIS(e.target.value)}
                    placeholder="2024.11.xxxx (opsional)"
                    className="w-full h-9 px-3 border border-[#E6E2DE] rounded-[4px] focus:outline-none focus:border-[#21201E]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Peran Awal</label>
                  <select
                    value={newStudentRole}
                    onChange={(e) => setNewStudentRole(e.target.value)}
                    className="w-full h-9 px-3 border border-[#E6E2DE] rounded-[4px] focus:outline-none focus:border-[#21201E]"
                  >
                    <option value="Anggota">Anggota</option>
                    <option value="Notulen & koordinasi">Notulen & koordinasi</option>
                    <option value="Koordinator materi">Koordinator materi</option>
                    <option value="Desain grafis">Desain grafis</option>
                    <option value="Pengajar lab">Pengajar lab</option>
                    <option value="Dokumentasi">Dokumentasi</option>
                  </select>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-[#E6E2DE]">
                  <button
                    type="button"
                    onClick={() => setIsAddStudentOpen(false)}
                    className="px-3 py-1.5 border border-[#E6E2DE] rounded-[4px] text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#E20113] hover:bg-[#b4000c] text-white font-semibold rounded-[4px] cursor-pointer"
                  >
                    Simpan Siswa
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Pindah Kelompok */}
        {moveStudentTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white max-w-sm w-full rounded-[4px] border border-[#E6E2DE] p-6 space-y-4 shadow-xl text-xs">
              <h4 className="text-sm font-bold text-[#21201E]">Pindahkan Siswa ke Kelompok Lain</h4>
              <p className="text-slate-600">Pilih nomor kelompok SMP tujuan untuk transfer anggota ini:</p>

              <select
                value={moveTargetGroup}
                onChange={(e) => setMoveTargetGroup(e.target.value)}
                className="w-full h-9 px-3 border border-[#E6E2DE] rounded-[4px] focus:outline-none focus:border-[#21201E] font-medium"
              >
                {groups
                  .filter((g) => g.id !== activeGroup.id)
                  .map((g) => (
                    <option key={g.id} value={g.id}>
                      Kelompok {g.number} — {g.schoolName}
                    </option>
                  ))}
              </select>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMoveStudentTarget(null)}
                  className="px-3 py-1.5 border border-[#E6E2DE] rounded-[4px] text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveStudent(moveStudentTarget, moveTargetGroup)}
                  className="px-4 py-1.5 bg-[#21201E] text-white font-semibold rounded-[4px] cursor-pointer"
                >
                  Pindahkan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER: VIEW 1 (MAIN ADMIN DASHBOARD "Pantau kelompok")
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="w-full min-h-screen bg-[#F7F5F2] text-[#21201E] font-['Poppins'] antialiased selection:bg-[#E20113] selection:text-white pb-24">
      {/* ─── Top Bar: Wordmark, Nav Links, Role Chip, Keluar ─── */}
      <header className="w-full bg-white border-b border-[#E6E2DE] sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer text-left">
              <span className="text-sm font-extrabold tracking-tight text-[#21201E]">Skomda Mengajar</span>
              <span className="bg-[#E20113] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-[2px] -rotate-3 inline-block">
                #Skomda
              </span>
            </button>

            <nav className="flex items-center gap-5 text-xs font-medium">
              <span className="py-1 text-[#21201E] font-semibold border-b-2 border-[#21201E] cursor-default">
                Beranda
              </span>
              <button
                onClick={() => setIsSetupModalOpen(true)}
                className="py-1 text-[#6B6560] hover:text-[#21201E] transition-colors cursor-pointer"
              >
                Kelompok
              </button>
              <button
                onClick={() => {
                  setSelectedGroupId('03');
                  setGroupDetailTab('feedback');
                }}
                className="py-1 text-[#6B6560] hover:text-[#21201E] transition-colors cursor-pointer"
              >
                Feedback
              </button>
              <button
                onClick={() => showToast('Pengaturan sistem perizinan & kurikulum', 'info')}
                className="py-1 text-[#6B6560] hover:text-[#21201E] transition-colors cursor-pointer"
              >
                Pengaturan
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="bg-[#E6E2DE]/60 text-[#21201E] px-2.5 py-1 rounded-[4px] font-medium text-[11px]">
              Guru pembimbing
            </span>
            <button
              onClick={() => {
                navigate('/');
                showToast('Keluar dari sesi guru pembimbing.', 'info');
              }}
              className="text-[#6B6560] hover:text-[#21201E] transition-colors cursor-pointer font-medium"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Content Canvas ─── */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* 1. Top Preparation Banner Card (disappears or updates when all leaders are assigned) */}
        {isPersiapanUnfinished && (
          <div className="bg-white border border-[#E6E2DE] rounded-[4px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#6B6560] uppercase tracking-wider block">
                TAHAP PERSIAPAN
              </span>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                {/* 1. Impor data */}
                <div className="flex items-center gap-1.5 text-[#21201E] font-medium">
                  <span className="w-4 h-4 rounded-[2px] bg-[#3DBE7A] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  <span>1. Impor data</span>
                </div>

                <span className="text-[#E6E2DE]">•</span>

                {/* 2. Tandai ketua */}
                <div className="flex items-center gap-1.5 text-[#21201E] font-medium">
                  <span className="w-4 h-4 rounded-[2px] border border-[#21201E] text-[#21201E] flex items-center justify-center shrink-0 text-[10px] font-bold">
                    2
                  </span>
                  <span>
                    2. Tandai ketua ({groupsWithLeaderCount} dari {groups.length} kelompok sudah punya ketua)
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSetupModalTab('leader');
                setIsSetupModalOpen(true);
              }}
              className="px-4 py-2 bg-[#E20113] hover:bg-[#b4000c] text-white text-xs font-semibold rounded-[4px] transition-colors cursor-pointer shrink-0"
            >
              Tandai ketua
            </button>
          </div>
        )}

        {/* 2. Page Header: Title, sentence, stage milestone & progress line */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E6E2DE]">
          <div>
            <h1 className="text-2xl font-extrabold text-[#21201E] tracking-tight">Pantau kelompok</h1>
            <p className="text-xs text-[#6B6560] mt-1 leading-relaxed">
              Ini yang perlu Anda tindak hari ini dan kelompok mana yang tertinggal.
            </p>
          </div>

          <div className="flex flex-col md:items-end gap-1.5 shrink-0">
            <span className="text-xs text-[#6B6560] font-medium">
              Tahap 3 dari 6: Buat desain, tenggat 15 Feb (4 hari lagi)
            </span>
            {/* 6-segment mini progress line */}
            <div className="flex items-center gap-1 w-56 h-1.5">
              <span className="h-full flex-1 bg-[#21201E] rounded-[2px]" title="Tahap 1: Atur peran (Selesai)" />
              <span className="h-full flex-1 bg-[#21201E] rounded-[2px]" title="Tahap 2: Rancang materi (Selesai)" />
              <span
                className="h-full flex-1 border border-[#21201E] bg-white rounded-[2px]"
                title="Tahap 3: Buat desain (Aktif)"
              />
              <span className="h-full flex-1 bg-[#E6E2DE] rounded-[2px]" title="Tahap 4: Pelaksanaan di SMP" />
              <span className="h-full flex-1 bg-[#E6E2DE] rounded-[2px]" title="Tahap 5: Kumpulkan laporan" />
              <span className="h-full flex-1 bg-[#E6E2DE] rounded-[2px]" title="Tahap 6: Terima feedback" />
            </div>
          </div>
        </div>

        {/* 3. Section 1: "Perlu tindakan" (Action Queue Card) */}
        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-sm font-extrabold text-[#21201E]">Perlu tindakan</h2>

            {/* Two Tabs: Menunggu Anda vs Menunggu kelompok */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setActionTab('admin')}
                className={`px-3 py-1 rounded-[4px] border transition-colors cursor-pointer font-medium ${
                  actionTab === 'admin'
                    ? 'bg-white border-[#21201E] text-[#21201E] font-semibold'
                    : 'bg-white border-[#E6E2DE] text-[#6B6560] hover:text-[#21201E]'
                }`}
              >
                Menunggu Anda {waitingAdmin.length}
              </button>
              <button
                onClick={() => setActionTab('kelompok')}
                className={`px-3 py-1 rounded-[4px] border transition-colors cursor-pointer font-medium ${
                  actionTab === 'kelompok'
                    ? 'bg-white border-[#21201E] text-[#21201E] font-semibold'
                    : 'bg-white border-[#E6E2DE] text-[#6B6560] hover:text-[#21201E]'
                }`}
              >
                Menunggu kelompok {waitingGroup.length}
              </button>
            </div>
          </div>

          {/* Action Rows List (Plain rows with hairline dividers) */}
          <div className="bg-white border border-[#E6E2DE] rounded-[4px] divide-y divide-[#E6E2DE]">
            {actionTab === 'admin' ? (
              waitingAdmin.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#6B6560]">
                  <p className="font-semibold text-[#21201E]">Semua pengajuan telah direview.</p>
                  <p className="mt-0.5">Tidak ada berkas yang tertunda saat ini.</p>
                </div>
              ) : (
                waitingAdmin.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F7F5F2]/60 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <span className="text-xs font-bold text-[#21201E] shrink-0 w-28">
                        {item.groupNumber}
                      </span>
                      <span className="text-xs text-[#6B6560] shrink-0 w-36 truncate">
                        {item.schoolName}
                      </span>
                      <span className="text-xs font-medium text-[#21201E] truncate max-w-xs">
                        {item.itemName}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs shrink-0 self-end sm:self-center">
                      <span className="px-2.5 py-0.5 rounded-[4px] bg-[#F2B33D]/25 text-[#21201E] text-[11px] font-medium">
                        {item.statusLabel}
                      </span>
                      <span className="text-[11px] text-[#6B6560] w-36 text-right">{item.ageText}</span>
                      <button
                        onClick={() => handleOpenReview(item)}
                        className="px-3.5 py-1 rounded-[4px] border border-[#21201E] text-[#21201E] hover:bg-[#21201E]/5 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ))
              )
            ) : waitingGroup.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#6B6560]">
                <p className="font-semibold text-[#21201E]">Semua kelompok berjalan sesuai jadwal.</p>
                <p className="mt-0.5">Tidak ada keterlambatan tugas yang perlu diingatkan.</p>
              </div>
            ) : (
              waitingGroup.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F7F5F2]/60 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="text-xs font-bold text-[#21201E] shrink-0 w-28">
                      {item.groupNumber}
                    </span>
                    <span className="text-xs text-[#6B6560] shrink-0 w-36 truncate">
                      {item.schoolName}
                    </span>
                    <span className="text-xs font-medium text-[#21201E] truncate max-w-xs">
                      {item.itemName}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs shrink-0 self-end sm:self-center">
                    {item.status === 'revisi' ? (
                      <span className="px-2.5 py-0.5 rounded-[4px] bg-[#FF8A5B]/25 text-[#21201E] text-[11px] font-medium">
                        Perlu revisi
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-[4px] bg-[#FF8A5B]/20 text-[#21201E] text-[11px] font-medium inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#E20113]" />
                        <span>{item.statusLabel}</span>
                      </span>
                    )}

                    <span className="text-[11px] text-[#6B6560] w-36 text-right">{item.ageText}</span>

                    <button
                      onClick={() => handleCopyReminder(item)}
                      className="px-3.5 py-1 rounded-[4px] border border-[#21201E] text-[#21201E] hover:bg-[#21201E]/5 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      {copiedReminderId === item.id ? 'Disalin ✓' : 'Kirim Pengingat'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 4. Section 2: "Progres kelompok" (Master Interactive Table) */}
        <section className="space-y-3 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-sm font-extrabold text-[#21201E]">Progres kelompok</h2>

            {/* Search Input, Filter Pills, and Export Button */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#6B6560] absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari kelompok, ketua, atau SM..."
                  className="pl-8 pr-3 py-1 text-xs bg-white border border-[#E6E2DE] rounded-[4px] text-[#21201E] placeholder:text-[#6B6560] focus:outline-none focus:border-[#21201E] w-56"
                />
              </div>

              <div className="flex items-center gap-1 text-xs">
                {(['all', 'attention', 'done'] as const).map((key) => {
                  const labels = {
                    all: 'Semua',
                    attention: 'Perlu perhatian',
                    done: 'Selesai',
                  };
                  return (
                    <button
                      key={key}
                      onClick={() => setFilterPill(key)}
                      className={`px-2.5 py-1 rounded-[4px] border transition-colors cursor-pointer font-medium ${
                        filterPill === key
                          ? 'bg-white border-[#21201E] text-[#21201E] font-semibold'
                          : 'bg-white border-[#E6E2DE] text-[#6B6560] hover:text-[#21201E]'
                      }`}
                    >
                      {labels[key]}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  showToast('Mengunduh Laporan Progres Kelompok (Excel .xlsx)...', 'success');
                }}
                className="px-2.5 py-1 bg-white border border-[#E6E2DE] hover:border-[#21201E] text-[#21201E] text-xs font-semibold rounded-[4px] transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Ekspor Excel</span>
              </button>
            </div>
          </div>

          {/* Master Table */}
          <div className="bg-white border border-[#E6E2DE] rounded-[4px] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E6E2DE] text-[#6B6560] font-medium bg-[#F7F5F2]/40">
                  <th className="py-2.5 px-4 font-medium">Kelompok</th>
                  <th className="py-2.5 px-4 font-medium">Ketua</th>
                  <th className="py-2.5 px-4 font-medium">Tahap sekarang</th>
                  <th className="py-2.5 px-4 font-medium">Progres</th>
                  <th className="py-2.5 px-4 font-medium">Item</th>
                  <th className="py-2.5 px-4 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E2DE]">
                {filteredGroups.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#6B6560]">
                      <p className="font-semibold text-[#21201E]">Tidak ada kelompok pada filter ini.</p>
                      <p className="mt-0.5">Ubah kata kunci pencarian atau pilih pill "Semua".</p>
                    </td>
                  </tr>
                ) : (
                  filteredGroups.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedGroupId(row.id)}
                      className="hover:bg-[#F7F5F2]/70 transition-colors cursor-pointer group"
                    >
                      {/* Column 1: Kelompok */}
                      <td className="py-3 px-4">
                        <div>
                          <span className="font-bold text-[#21201E] block group-hover:text-[#E20113] transition-colors">
                            Kelompok {row.number}
                          </span>
                          <span className="text-[11px] text-[#6B6560] block">{row.schoolName}</span>
                        </div>
                      </td>

                      {/* Column 2: Ketua */}
                      <td className="py-3 px-4 text-[#21201E]">
                        {row.hasLeader ? (
                          <span className="font-medium">{row.leaderName}</span>
                        ) : (
                          <span className="text-[#6B6560] italic">Belum ditentukan</span>
                        )}
                      </td>

                      {/* Column 3: Tahap sekarang */}
                      <td className="py-3 px-4 text-[#21201E] font-medium">{row.currentStage}</td>

                      {/* Column 4: Progres (6-box mini step indicator) */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 6 }).map((_, stepIdx) => {
                            const isCompleted = stepIdx < row.completedStages;
                            const isActive = stepIdx === row.currentStageIndex - 1;
                            return (
                              <span
                                key={stepIdx}
                                className={`w-2.5 h-2.5 rounded-[1.5px] ${
                                  isCompleted
                                    ? 'bg-[#21201E]'
                                    : isActive
                                    ? 'border border-[#21201E] bg-white'
                                    : 'bg-[#E6E2DE]'
                                }`}
                                title={`Tahap ${stepIdx + 1}`}
                              />
                            );
                          })}
                        </div>
                      </td>

                      {/* Column 5: Item */}
                      <td className="py-3 px-4 text-[#6B6560] font-medium">
                        {row.approvedItemsCount} dari {row.totalItemsCount} disetujui
                      </td>

                      {/* Column 6: Status */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          <span
                            className={`px-2.5 py-0.5 rounded-[4px] text-[11px] font-medium ${
                              row.urgentStatus === 'approved'
                                ? 'bg-[#3DBE7A]/20 text-[#21201E]'
                                : row.urgentStatus === 'review'
                                ? 'bg-[#F2B33D]/25 text-[#21201E]'
                                : row.urgentStatus === 'overdue'
                                ? 'bg-[#FF8A5B]/20 text-[#21201E] inline-flex items-center gap-1'
                                : row.urgentStatus === 'revisi'
                                ? 'bg-[#FF8A5B]/25 text-[#21201E]'
                                : 'bg-[#8A8582]/15 text-[#21201E]'
                            }`}
                          >
                            {row.urgentStatus === 'overdue' && <Clock className="w-3 h-3 text-[#E20113]" />}
                            <span>{row.urgentStatusLabel}</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#21201E] group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* ══════════════════════════════════════════════════════════════════════════
          VIEW 2: SETUP MODAL ("Impor Data & Tandai Ketua")
      ══════════════════════════════════════════════════════════════════════════ */}
      {isSetupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-2xl w-full rounded-[4px] border border-[#E6E2DE] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#E6E2DE] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#21201E]">Pengaturan Persiapan Skomda Mengajar</h3>
                <p className="text-xs text-[#6B6560]">
                  Sinkronisasi data master siswa dan aktivasi akun ketua kelompok 2026.
                </p>
              </div>
              <button
                onClick={() => setIsSetupModalOpen(false)}
                className="cursor-pointer text-slate-400 hover:text-slate-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-[#E6E2DE] px-5 gap-6 text-xs font-semibold bg-[#F7F5F2]/40">
              <button
                onClick={() => setSetupModalTab('leader')}
                className={`py-3 transition-colors cursor-pointer border-b-2 ${
                  setupModalTab === 'leader'
                    ? 'border-[#E20113] text-[#E20113]'
                    : 'border-transparent text-[#6B6560] hover:text-[#21201E]'
                }`}
              >
                1. Tandai Ketua Kelompok ({groups.length - groupsWithLeaderCount} Belum Ada)
              </button>
              <button
                onClick={() => setSetupModalTab('import')}
                className={`py-3 transition-colors cursor-pointer border-b-2 ${
                  setupModalTab === 'import'
                    ? 'border-[#E20113] text-[#E20113]'
                    : 'border-transparent text-[#6B6560] hover:text-[#21201E]'
                }`}
              >
                2. Impor Data Siswa (CSV / Excel)
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {setupModalTab === 'leader' ? (
                <div className="space-y-4">
                  {/* Filter Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#6B6560]">Pilih kelompok untuk menunjuk ketua:</span>
                    <div className="flex items-center gap-1 text-xs">
                      <button
                        onClick={() => setLeaderFilter('unassigned')}
                        className={`px-2.5 py-1 rounded-[4px] border font-medium cursor-pointer ${
                          leaderFilter === 'unassigned'
                            ? 'bg-white border-[#21201E] text-[#21201E] font-semibold'
                            : 'border-[#E6E2DE] text-[#6B6560]'
                        }`}
                      >
                        Belum Punya Ketua ({groups.filter((g) => !g.hasLeader).length})
                      </button>
                      <button
                        onClick={() => setLeaderFilter('all')}
                        className={`px-2.5 py-1 rounded-[4px] border font-medium cursor-pointer ${
                          leaderFilter === 'all'
                            ? 'bg-white border-[#21201E] text-[#21201E] font-semibold'
                            : 'border-[#E6E2DE] text-[#6B6560]'
                        }`}
                      >
                        Semua Kelompok ({groups.length})
                      </button>
                    </div>
                  </div>

                  {/* Group Leader Assignment List */}
                  <div className="border border-[#E6E2DE] rounded-[4px] divide-y divide-[#E6E2DE]">
                    {groups
                      .filter((g) => (leaderFilter === 'unassigned' ? !g.hasLeader : true))
                      .map((grp) => (
                        <div
                          key={grp.id}
                          className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white"
                        >
                          <div>
                            <span className="text-xs font-bold text-[#21201E]">
                              Kelompok {grp.number} — {grp.schoolName}
                            </span>
                            <span className="text-[11px] text-[#6B6560] block mt-0.5">
                              {grp.hasLeader ? (
                                <>
                                  Ketua Saat Ini: <strong className="text-[#21201E]">{grp.leaderName}</strong>
                                </>
                              ) : (
                                <span className="text-[#E20113] font-semibold">⚠️ Belum ada ketua ditetapkan</span>
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              value={selectedLeaderMap[grp.id] || (grp.members[0]?.name ?? '')}
                              onChange={(e) =>
                                setSelectedLeaderMap((prev) => ({ ...prev, [grp.id]: e.target.value }))
                              }
                              className="h-8 px-2.5 text-xs bg-white border border-[#E6E2DE] rounded-[4px] text-[#21201E] focus:outline-none cursor-pointer max-w-[200px]"
                            >
                              {grp.members.map((m) => (
                                <option key={m.id} value={m.name}>
                                  {m.name} ({m.nis})
                                </option>
                              ))}
                            </select>

                            <button
                              onClick={() => handleActivateLeader(grp.id)}
                              className="px-3 py-1.5 bg-[#E20113] hover:bg-[#b4000c] text-white text-xs font-semibold rounded-[4px] transition-colors cursor-pointer shrink-0"
                            >
                              Aktifkan Akun Ketua
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Generated Credentials Callout */}
                  {createdCredentials && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-[4px] space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Akun Login Ketua Telah Aktif ({createdCredentials.group})</span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-700 bg-white p-2.5 rounded border border-emerald-200 space-y-0.5">
                        <p>
                          Username (Email): <strong>{createdCredentials.user}</strong>
                        </p>
                        <p>
                          Password Awal: <strong>{createdCredentials.pass}</strong>
                        </p>
                      </div>
                      <p className="text-[10px] text-emerald-700">
                        Kredensial ini otomatis dikirim via WhatsApp ke siswa bersangkutan.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Tab 2: Impor Data Siswa */
                <div className="space-y-4">
                  <div className="p-8 border-2 border-dashed border-[#E6E2DE] hover:border-[#21201E] rounded-xl flex flex-col items-center justify-center text-center transition-colors bg-slate-50/50">
                    <div className="w-12 h-12 rounded-full bg-red-50 text-[#E20113] flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-[#21201E]">Unggah Berkas Master Roster Siswa</h4>
                    <p className="text-xs text-[#6B6560] max-w-sm mt-1">
                      Tarik dan lepas file Excel (.xlsx) atau CSV (.csv) berisi NIS, Nama Siswa, dan SMP Penempatan.
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={handleRunImport}
                        disabled={isImporting}
                        className="px-4 py-2 bg-[#21201E] hover:bg-slate-800 text-white text-xs font-semibold rounded-[4px] cursor-pointer inline-flex items-center gap-2"
                      >
                        {isImporting ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Memproses Impor...</span>
                          </>
                        ) : (
                          <>
                            <FileSpreadsheet className="w-3.5 h-3.5" />
                            <span>Pilih Berkas & Impor (180 Siswa)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#6B6560] pt-2">
                    <span>Format yang didukung: XLSX, CSV (maksimal 10 MB)</span>
                    <button
                      onClick={() => showToast('Template_Skomda_2026.csv berhasil diunduh.', 'success')}
                      className="text-[#E20113] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh Template Format (.CSV)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E6E2DE] bg-slate-50 flex items-center justify-between text-xs">
              <span className="text-[#6B6560]">
                Perubahan langsung disinkronkan ke portal workspace ketua siswa.
              </span>
              <button
                onClick={() => setIsSetupModalOpen(false)}
                className="px-4 py-1.5 border border-[#21201E] rounded-[4px] text-xs font-semibold hover:bg-slate-100 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          VIEW 3: QUICK REVIEW DRAWER / MODAL ("Review Berkas")
      ══════════════════════════════════════════════════════════════════════════ */}
      {isReviewOpen && reviewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-4xl w-full rounded-[4px] border border-[#E6E2DE] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-[#E6E2DE] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#E20113] uppercase tracking-wider block">
                  REVIEW BERKAS TAHAP 03
                </span>
                <h3 className="text-base font-extrabold text-[#21201E]">
                  {reviewItem.groupNumber} — {reviewItem.schoolName}
                </h3>
              </div>
              <button
                onClick={() => setIsReviewOpen(false)}
                className="cursor-pointer text-slate-400 hover:text-slate-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body: Split Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto divide-y md:divide-y-0 md:divide-x divide-[#E6E2DE]">
              {/* Left Column: Visual Simulated File Preview */}
              <div className="md:col-span-6 p-6 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{reviewItem.itemName}</span>
                  {/* Version Selector */}
                  <div className="flex items-center gap-1 bg-white border border-[#E6E2DE] rounded-[4px] p-0.5">
                    <button
                      onClick={() => setReviewVersion('v2')}
                      className={`px-2 py-0.5 rounded-[2px] font-bold text-[10px] ${
                        reviewVersion === 'v2' ? 'bg-[#21201E] text-white' : 'text-slate-600'
                      }`}
                    >
                      v2 (Terbaru)
                    </button>
                    <button
                      onClick={() => setReviewVersion('v1')}
                      className={`px-2 py-0.5 rounded-[2px] font-bold text-[10px] ${
                        reviewVersion === 'v1' ? 'bg-[#21201E] text-white' : 'text-slate-600'
                      }`}
                    >
                      v1
                    </button>
                  </div>
                </div>

                {/* Simulated Visual Document Canvas */}
                <div className="aspect-[4/5] bg-white rounded-lg border border-slate-300 p-4 shadow-sm flex flex-col justify-between relative overflow-hidden">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-[10px] font-bold text-[#E20113] uppercase tracking-wider">
                        SKOMDA MENGAJAR 2026
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">SMPN 1 BUDURAN</span>
                    </div>

                    <div className="h-28 bg-gradient-to-br from-red-600 to-red-800 rounded-md p-3 text-white flex flex-col justify-between">
                      <span className="text-[8px] font-bold uppercase tracking-wider opacity-80">
                        Inisiatif Vokasi
                      </span>
                      <p className="text-xs font-extrabold leading-snug">
                        Literasi Digital & Pemrograman Web Aplikatif Siswa SMP
                      </p>
                      <span className="text-[8px] opacity-75">18–25 Februari 2026</span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-2 bg-slate-100 rounded w-full"></div>
                      <div className="h-2 bg-slate-100 rounded w-5/6"></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                    <span>UKURAN: 60 × 160 CM • 300 DPI • CMYK</span>
                    <span>STATUS: VALIDASI</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#6B6560]">
                  <span>Berkas: {reviewItem.fileName}</span>
                  <span>{reviewItem.fileSize}</span>
                </div>
              </div>

              {/* Right Column: Verification Checklist & Decision */}
              <div className="md:col-span-6 p-6 space-y-5 bg-white">
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#21201E] uppercase tracking-wider block">
                    Checklist Verifikasi Standar
                  </span>

                  <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkImageRes}
                      onChange={(e) => setCheckImageRes(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-[#E20113]"
                    />
                    <span>Resolusi desain tajam (minimal 300 DPI untuk cetak mata ayam)</span>
                  </label>

                  <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkBranding}
                      onChange={(e) => setCheckBranding(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-[#E20113]"
                    />
                    <span>Logo resmi SMK Telkom & SMP mitra terpasang proporsional</span>
                  </label>

                  <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkLayout}
                      onChange={(e) => setCheckLayout(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-[#E20113]"
                    />
                    <span>Hierarki tipografi dan jadwal pelaksanaan terbaca dengan jelas</span>
                  </label>
                </div>

                {/* Notes Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#21201E] block">
                    Catatan / Instruksi Pembimbing (Opsional):
                  </label>
                  <textarea
                    rows={3}
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Tuliskan catatan revisi jika ada bagian yang perlu disesuaikan oleh siswa..."
                    className="w-full p-3 text-xs bg-white border border-[#E6E2DE] rounded-[4px] text-[#21201E] focus:outline-none focus:border-[#21201E]"
                  />
                </div>

                {/* Decision Buttons */}
                <div className="pt-4 border-t border-[#E6E2DE] flex items-center justify-end gap-3">
                  <button
                    onClick={handleRequestRevision}
                    className="px-4 py-2 border border-[#FF8A5B] text-[#FF8A5B] hover:bg-orange-50 text-xs font-semibold rounded-[4px] transition-colors cursor-pointer"
                  >
                    Minta Revisi
                  </button>

                  <button
                    onClick={handleApproveSubmission}
                    className="px-5 py-2 bg-[#3DBE7A] hover:bg-emerald-600 text-white text-xs font-bold rounded-[4px] transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Setujui Berkas</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMonitoringPage;