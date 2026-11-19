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
} from 'lucide-react';

// ─── Data Structures ────────────────────────────────────────────────────────
export interface ActionRowItem {
  id: string;
  groupId: string;
  groupNumber: string;
  schoolName: string;
  itemName: string;
  stageName: string;
  status: 'review' | 'overdue' | 'revisi';
  statusLabel: string;
  statusHint: string;
  ageText: string;
  isLate?: boolean;
  lateDays?: number;
  leaderName: string;
  memberCount: number;
  reminderNote?: string;
}

export interface GroupProgressRow {
  id: string;
  number: string;
  schoolName: string;
  leaderName: string;
  hasLeader: boolean;
  currentStage: string;
  completedStages: number; // 0..6
  currentStageIndex: number; // 1..6
  approvedItemsText: string;
  urgentStatus: 'review' | 'overdue' | 'revisi' | 'approved' | 'waiting';
  urgentStatusLabel: string;
  urgentStatusHint: string;
  lateDays?: number;
  members: { name: string; role: string; nis?: string }[];
}

export const SIX_STAGES = [
  'Atur peran',
  'Rancang materi',
  'Buat desain',
  'Pelaksanaan di SMP',
  'Kumpulkan laporan',
  'Terima feedback',
];

// Initial 24 Groups Data (Realistic Indonesian Names, strictly zero "mitra", "binaan", "konsol", "tuntas")
const INITIAL_GROUPS: GroupProgressRow[] = [
  {
    id: '03',
    number: '03',
    schoolName: 'SMPN 1 Buduran',
    leaderName: 'Nabila Putri Ramadhani',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    completedStages: 2,
    currentStageIndex: 3,
    approvedItemsText: '3 dari 5 disetujui',
    urgentStatus: 'review',
    urgentStatusLabel: 'Menunggu review',
    urgentStatusHint: 'Berkas baru diunggah dan menunggu persetujuan Anda',
    members: [
      { name: 'Nabila Putri Ramadhani', role: 'Ketua kelompok', nis: '2024.11.0301' },
      { name: 'Ahmad Rizky', role: 'Notulen & koordinasi', nis: '2024.11.0302' },
      { name: 'Rafi Fadillah', role: 'Desain grafis', nis: '2024.11.0303' },
      { name: 'Dinda Salsabila', role: 'Koordinator materi', nis: '2024.11.0304' },
      { name: 'M. Arya Bima', role: 'Dokumentasi', nis: '2024.11.0305' },
      { name: 'Siti Aisyah', role: 'Logistik', nis: '2024.11.0306' },
      { name: 'Bagas Pratama', role: 'Pengajar lab', nis: '2024.11.0307' },
      { name: 'Zahra Amelia', role: 'Pengajar lab', nis: '2024.11.0308' },
    ],
  },
  {
    id: '02',
    number: '02',
    schoolName: 'SMPN 1 Waru',
    leaderName: 'Dimas Bagus Wicaksono',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    completedStages: 2,
    currentStageIndex: 3,
    approvedItemsText: '3 dari 5 disetujui',
    urgentStatus: 'review',
    urgentStatusLabel: 'Menunggu review',
    urgentStatusHint: 'Berkas baru diunggah dan menunggu persetujuan Anda',
    members: [
      { name: 'Dimas Bagus Wicaksono', role: 'Ketua kelompok', nis: '2024.11.0201' },
      { name: 'Arum Sekar', role: 'Materi Scratch', nis: '2024.11.0202' },
      { name: 'Candra Wijaya', role: 'Desain modul', nis: '2024.11.0203' },
      { name: 'Dwi Prasetyo', role: 'Anggota', nis: '2024.11.0204' },
      { name: 'Fitriani', role: 'Anggota', nis: '2024.11.0205' },
      { name: 'Galih Rakasiwi', role: 'Anggota', nis: '2024.11.0206' },
      { name: 'Helmi Yahya', role: 'Anggota', nis: '2024.11.0207' },
      { name: 'Intan Permata', role: 'Anggota', nis: '2024.11.0208' },
    ],
  },
  {
    id: '06',
    number: '06',
    schoolName: 'SMPN 1 Tulangan',
    leaderName: 'Bagus Pratama Putra',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    completedStages: 2,
    currentStageIndex: 3,
    approvedItemsText: '3 dari 5 disetujui',
    urgentStatus: 'review',
    urgentStatusLabel: 'Menunggu review',
    urgentStatusHint: 'Berkas baru diunggah dan menunggu persetujuan Anda',
    members: [
      { name: 'Bagus Pratama Putra', role: 'Ketua kelompok', nis: '2024.11.0601' },
      { name: 'Vina Panduwinata', role: 'Desain infografis', nis: '2024.11.0602' },
      { name: 'Wahyu Hidayat', role: 'Materi visual', nis: '2024.11.0603' },
      { name: 'Xena Putri', role: 'Anggota', nis: '2024.11.0604' },
      { name: 'Yoga Pratama', role: 'Anggota', nis: '2024.11.0605' },
      { name: 'Zulham Zamrun', role: 'Anggota', nis: '2024.11.0606' },
      { name: 'Anindya Kusuma', role: 'Anggota', nis: '2024.11.0607' },
      { name: 'Bayu Gatra', role: 'Anggota', nis: '2024.11.0608' },
    ],
  },
  {
    id: '12',
    number: '12',
    schoolName: 'SMPN 2 Taman',
    leaderName: 'Kevin Alamsyah',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    completedStages: 2,
    currentStageIndex: 3,
    approvedItemsText: '3 dari 5 disetujui',
    urgentStatus: 'review',
    urgentStatusLabel: 'Menunggu review',
    urgentStatusHint: 'Berkas baru diunggah dan menunggu persetujuan Anda',
    members: [
      { name: 'Kevin Alamsyah', role: 'Ketua kelompok', nis: '2024.11.1201' },
      { name: 'Ika Putri', role: 'Materi presentasi', nis: '2024.11.1202' },
      { name: 'Junaedi', role: 'Desain banner', nis: '2024.11.1203' },
      { name: 'Kurniawan', role: 'Anggota', nis: '2024.11.1204' },
      { name: 'Lestari Indah', role: 'Anggota', nis: '2024.11.1205' },
      { name: 'Mulyadi', role: 'Anggota', nis: '2024.11.1206' },
      { name: 'Nurul Huda', role: 'Anggota', nis: '2024.11.1207' },
    ],
  },
  {
    id: '07',
    number: '07',
    schoolName: 'SMP Telkom Sidoarjo',
    leaderName: 'Fahri Ramadhan',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    completedStages: 2,
    currentStageIndex: 3,
    approvedItemsText: '2 dari 5 disetujui',
    urgentStatus: 'overdue',
    urgentStatusLabel: 'Terlambat 2 hari',
    urgentStatusHint: 'Batas waktu pengumpulan draf desain sudah lewat 2 hari',
    lateDays: 2,
    members: [
      { name: 'Fahri Ramadhan', role: 'Ketua kelompok', nis: '2024.11.0701' },
      { name: 'Aldi Firmansyah', role: 'Materi robotika', nis: '2024.11.0702' },
      { name: 'Rani Maharani', role: 'Desain banner', nis: '2024.11.0703' },
      { name: 'Budi Santoso', role: 'Dokumentasi', nis: '2024.11.0704' },
      { name: 'Eka Lestari', role: 'Anggota', nis: '2024.11.0705' },
      { name: 'Gilang Pratama', role: 'Anggota', nis: '2024.11.0706' },
      { name: 'Hana Safitri', role: 'Anggota', nis: '2024.11.0707' },
      { name: 'Ilham Jaya', role: 'Anggota', nis: '2024.11.0708' },
    ],
  },
  {
    id: '04',
    number: '04',
    schoolName: 'SMPN 2 Krian',
    leaderName: 'Siti Nurhaliza',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    completedStages: 2,
    currentStageIndex: 3,
    approvedItemsText: '2 dari 5 disetujui',
    urgentStatus: 'overdue',
    urgentStatusLabel: 'Terlambat 1 hari',
    urgentStatusHint: 'Batas waktu pengumpulan draf poster sudah lewat 1 hari',
    lateDays: 1,
    members: [
      { name: 'Siti Nurhaliza', role: 'Ketua kelompok', nis: '2024.11.0401' },
      { name: 'Joko Susilo', role: 'Desain poster', nis: '2024.11.0402' },
      { name: 'Kartika Sari', role: 'Materi etika', nis: '2024.11.0403' },
      { name: 'Lukman Hakim', role: 'Anggota', nis: '2024.11.0404' },
      { name: 'Maya Indah', role: 'Anggota', nis: '2024.11.0405' },
      { name: 'Nanang Qosim', role: 'Anggota', nis: '2024.11.0406' },
      { name: 'Okta Viana', role: 'Anggota', nis: '2024.11.0407' },
    ],
  },
  {
    id: '09',
    number: '09',
    schoolName: 'SMPN 1 Taman',
    leaderName: 'Rian Hidayat',
    hasLeader: true,
    currentStage: 'Tahap 2: Rancang materi',
    completedStages: 1,
    currentStageIndex: 2,
    approvedItemsText: '1 dari 5 disetujui',
    urgentStatus: 'overdue',
    urgentStatusLabel: 'Terlambat 3 hari',
    urgentStatusHint: 'Batas waktu modul lab lewat 3 hari',
    lateDays: 3,
    members: [
      { name: 'Rian Hidayat', role: 'Ketua kelompok', nis: '2024.11.0901' },
      { name: 'Citra Kirana', role: 'Modul literasi', nis: '2024.11.0902' },
      { name: 'Dodi Sudrajat', role: 'Desain', nis: '2024.11.0903' },
      { name: 'Erna Sari', role: 'Anggota', nis: '2024.11.0904' },
      { name: 'Fandi Ahmad', role: 'Anggota', nis: '2024.11.0905' },
      { name: 'Gita Gutawa', role: 'Anggota', nis: '2024.11.0906' },
      { name: 'Heri Kiswanto', role: 'Anggota', nis: '2024.11.0907' },
    ],
  },
  {
    id: '05',
    number: '05',
    schoolName: 'SMPN 2 Candi',
    leaderName: 'Dewi Maharani',
    hasLeader: true,
    currentStage: 'Tahap 2: Rancang materi',
    completedStages: 1,
    currentStageIndex: 2,
    approvedItemsText: '2 dari 5 disetujui',
    urgentStatus: 'revisi',
    urgentStatusLabel: 'Perlu revisi',
    urgentStatusHint: 'Catatan revisi sudah dikirim, kelompok belum mengunggah perbaikan',
    members: [
      { name: 'Dewi Maharani', role: 'Ketua kelompok', nis: '2024.11.0501' },
      { name: 'Pandu Dewanata', role: 'Modul praktikum', nis: '2024.11.0502' },
      { name: 'Qori Sandioriva', role: 'Desain slide', nis: '2024.11.0503' },
      { name: 'Rendra Karno', role: 'Anggota', nis: '2024.11.0504' },
      { name: 'Siska Dewi', role: 'Anggota', nis: '2024.11.0505' },
      { name: 'Taufik Hidayat', role: 'Anggota', nis: '2024.11.0506' },
      { name: 'Umar Bakri', role: 'Anggota', nis: '2024.11.0507' },
    ],
  },
  {
    id: '01',
    number: '01',
    schoolName: 'SMPN 1 Sidoarjo',
    leaderName: 'Raffi Akbar Pratama',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    completedStages: 3,
    currentStageIndex: 3,
    approvedItemsText: '4 dari 5 disetujui',
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    urgentStatusHint: 'Semua berkas tahap ini sudah diperiksa dan disetujui',
    members: [
      { name: 'Raffi Akbar Pratama', role: 'Ketua kelompok', nis: '2024.11.0101' },
      { name: 'Bambang Pamungkas', role: 'Materi HTML', nis: '2024.11.0102' },
      { name: 'Chairul Tanjung', role: 'Desain web', nis: '2024.11.0103' },
      { name: 'Dewi Sandra', role: 'Anggota', nis: '2024.11.0104' },
      { name: 'Eko Patrio', role: 'Anggota', nis: '2024.11.0105' },
      { name: 'Fatin Shidqia', role: 'Anggota', nis: '2024.11.0106' },
      { name: 'Giring Ganesha', role: 'Anggota', nis: '2024.11.0107' },
      { name: 'Hesti Purwadinata', role: 'Anggota', nis: '2024.11.0108' },
    ],
  },
  {
    id: '08',
    number: '08',
    schoolName: 'SMPN 2 Sukodono',
    leaderName: 'Putri Ayu Wandira',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    completedStages: 3,
    currentStageIndex: 3,
    approvedItemsText: '4 dari 5 disetujui',
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    urgentStatusHint: 'Semua berkas tahap ini sudah diperiksa dan disetujui',
    members: [
      { name: 'Putri Ayu Wandira', role: 'Ketua kelompok', nis: '2024.11.0801' },
      { name: 'Indra Bekti', role: 'Desain', nis: '2024.11.0802' },
      { name: 'Judika Sihotang', role: 'Materi', nis: '2024.11.0803' },
      { name: 'Krisdayanti', role: 'Anggota', nis: '2024.11.0804' },
      { name: 'Luna Maya', role: 'Anggota', nis: '2024.11.0805' },
      { name: 'Mulan Jameela', role: 'Anggota', nis: '2024.11.0806' },
      { name: 'Najwa Shihab', role: 'Anggota', nis: '2024.11.0807' },
      { name: 'Olla Ramlan', role: 'Anggota', nis: '2024.11.0808' },
    ],
  },
  {
    id: '10',
    number: '10',
    schoolName: 'SMP Hang Tuah 5',
    leaderName: 'Kevin Sanjaya',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    completedStages: 3,
    currentStageIndex: 3,
    approvedItemsText: '4 dari 5 disetujui',
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    urgentStatusHint: 'Semua berkas tahap ini sudah diperiksa dan disetujui',
    members: [
      { name: 'Kevin Sanjaya', role: 'Ketua kelompok', nis: '2024.11.1001' },
      { name: 'Marcus Gideon', role: 'Materi', nis: '2024.11.1002' },
      { name: 'Anthony Ginting', role: 'Desain', nis: '2024.11.1003' },
      { name: 'Jonatan Christie', role: 'Anggota', nis: '2024.11.1004' },
      { name: 'Fajar Alfian', role: 'Anggota', nis: '2024.11.1005' },
      { name: 'Rian Ardianto', role: 'Anggota', nis: '2024.11.1006' },
      { name: 'Hendra Setiawan', role: 'Anggota', nis: '2024.11.1007' },
      { name: 'Mohammad Ahsan', role: 'Anggota', nis: '2024.11.1008' },
    ],
  },
  {
    id: '11',
    number: '11',
    schoolName: 'SMPN 3 Porong',
    leaderName: 'Zidan Maulana',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    completedStages: 3,
    currentStageIndex: 3,
    approvedItemsText: '4 dari 5 disetujui',
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    urgentStatusHint: 'Semua berkas tahap ini sudah diperiksa dan disetujui',
    members: [
      { name: 'Zidan Maulana', role: 'Ketua kelompok', nis: '2024.11.1101' },
      { name: 'Rizky Febian', role: 'Materi etika', nis: '2024.11.1102' },
      { name: 'Tiara Andini', role: 'Desain', nis: '2024.11.1103' },
      { name: 'Lyodra Ginting', role: 'Anggota', nis: '2024.11.1104' },
      { name: 'Ziva Magnolya', role: 'Anggota', nis: '2024.11.1105' },
      { name: 'Mahalini Raharja', role: 'Anggota', nis: '2024.11.1106' },
      { name: 'Keisya Levronka', role: 'Anggota', nis: '2024.11.1107' },
      { name: 'Novia Bachmid', role: 'Anggota', nis: '2024.11.1108' },
    ],
  },
  {
    id: '13',
    number: '13',
    schoolName: 'SMP Proklamasi Porong',
    leaderName: 'Aulia Rahman',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    completedStages: 3,
    currentStageIndex: 3,
    approvedItemsText: '4 dari 5 disetujui',
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    urgentStatusHint: 'Semua berkas tahap ini sudah diperiksa dan disetujui',
    members: [
      { name: 'Aulia Rahman', role: 'Ketua kelompok', nis: '2024.11.1301' },
      { name: 'Bayu Saputra', role: 'Materi', nis: '2024.11.1302' },
      { name: 'Cinta Laura', role: 'Desain', nis: '2024.11.1303' },
      { name: 'Desta Mahendra', role: 'Anggota', nis: '2024.11.1304' },
      { name: 'Enzy Storia', role: 'Anggota', nis: '2024.11.1305' },
      { name: 'Fero Walandouw', role: 'Anggota', nis: '2024.11.1306' },
      { name: 'Gading Marten', role: 'Anggota', nis: '2024.11.1307' },
    ],
  },
  {
    id: '14',
    number: '14',
    schoolName: 'SMPN 1 Sedati',
    leaderName: 'Anisa Rahmawati',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    completedStages: 3,
    currentStageIndex: 3,
    approvedItemsText: '4 dari 5 disetujui',
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    urgentStatusHint: 'Semua berkas tahap ini sudah diperiksa dan disetujui',
    members: [
      { name: 'Anisa Rahmawati', role: 'Ketua kelompok', nis: '2024.11.1401' },
      { name: 'Bambang Soesatyo', role: 'Materi', nis: '2024.11.1402' },
      { name: 'Cucun Syamsurijal', role: 'Desain', nis: '2024.11.1403' },
      { name: 'Doli Kurnia', role: 'Anggota', nis: '2024.11.1404' },
      { name: 'Edhie Baskoro', role: 'Anggota', nis: '2024.11.1405' },
      { name: 'Fadli Zon', role: 'Anggota', nis: '2024.11.1406' },
      { name: 'Grace Natalie', role: 'Anggota', nis: '2024.11.1407' },
    ],
  },
  {
    id: '15',
    number: '15',
    schoolName: 'SMPN 2 Gedangan',
    leaderName: 'Rizal Fauzi',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    completedStages: 3,
    currentStageIndex: 3,
    approvedItemsText: '4 dari 5 disetujui',
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    urgentStatusHint: 'Semua berkas tahap ini sudah diperiksa dan disetujui',
    members: [
      { name: 'Rizal Fauzi', role: 'Ketua kelompok', nis: '2024.11.1501' },
      { name: 'Hafiz Prasetyo', role: 'Materi', nis: '2024.11.1502' },
      { name: 'Indah Kusuma', role: 'Desain', nis: '2024.11.1503' },
      { name: 'Jihan Audy', role: 'Anggota', nis: '2024.11.1504' },
      { name: 'Koko Ardiansyah', role: 'Anggota', nis: '2024.11.1505' },
      { name: 'Lia Ananta', role: 'Anggota', nis: '2024.11.1506' },
      { name: 'Mirza Malik', role: 'Anggota', nis: '2024.11.1507' },
    ],
  },
  {
    id: '16',
    number: '16',
    schoolName: 'SMP PGRI 1 Buduran',
    leaderName: 'Doni Firmansyah',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    completedStages: 3,
    currentStageIndex: 3,
    approvedItemsText: '4 dari 5 disetujui',
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    urgentStatusHint: 'Semua berkas tahap ini sudah diperiksa dan disetujui',
    members: [
      { name: 'Doni Firmansyah', role: 'Ketua kelompok', nis: '2024.11.1601' },
      { name: 'Nadia Saphira', role: 'Materi', nis: '2024.11.1602' },
      { name: 'Oscar Lawalata', role: 'Desain', nis: '2024.11.1603' },
      { name: 'Pevita Pearce', role: 'Anggota', nis: '2024.11.1604' },
      { name: 'Qausar Harta', role: 'Anggota', nis: '2024.11.1605' },
      { name: 'Reza Rahadian', role: 'Anggota', nis: '2024.11.1606' },
      { name: 'Sherina Munaf', role: 'Anggota', nis: '2024.11.1607' },
    ],
  },
  {
    id: '17',
    number: '17',
    schoolName: 'SMPN 1 Krembung',
    leaderName: 'Fandi Ahmad',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    completedStages: 3,
    currentStageIndex: 3,
    approvedItemsText: '4 dari 5 disetujui',
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    urgentStatusHint: 'Semua berkas tahap ini sudah diperiksa dan disetujui',
    members: [
      { name: 'Fandi Ahmad', role: 'Ketua kelompok', nis: '2024.11.1701' },
      { name: 'Titi Kamal', role: 'Materi', nis: '2024.11.1702' },
      { name: 'Uus Wijaksana', role: 'Desain', nis: '2024.11.1703' },
      { name: 'Vino Bastian', role: 'Anggota', nis: '2024.11.1704' },
      { name: 'Wulan Guritno', role: 'Anggota', nis: '2024.11.1705' },
      { name: 'Yayan Ruhian', role: 'Anggota', nis: '2024.11.1706' },
      { name: 'Zaskia Adya Mecca', role: 'Anggota', nis: '2024.11.1707' },
    ],
  },
  {
    id: '18',
    number: '18',
    schoolName: 'SMPN 2 Porong',
    leaderName: 'Hendra Setiawan',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    completedStages: 3,
    currentStageIndex: 3,
    approvedItemsText: '4 dari 5 disetujui',
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    urgentStatusHint: 'Semua berkas tahap ini sudah diperiksa dan disetujui',
    members: [
      { name: 'Hendra Setiawan', role: 'Ketua kelompok', nis: '2024.11.1801' },
      { name: 'Agung Hercules', role: 'Materi', nis: '2024.11.1802' },
      { name: 'Baim Wong', role: 'Desain', nis: '2024.11.1803' },
      { name: 'Cut Tari', role: 'Anggota', nis: '2024.11.1804' },
      { name: 'Deddy Mizwar', role: 'Anggota', nis: '2024.11.1805' },
      { name: 'Epy Kusnandar', role: 'Anggota', nis: '2024.11.1806' },
      { name: 'Ferry Maryadi', role: 'Anggota', nis: '2024.11.1807' },
    ],
  },
  {
    id: '19',
    number: '19',
    schoolName: 'SMPN 1 Tarik',
    leaderName: 'Indra Sjafri',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    completedStages: 3,
    currentStageIndex: 3,
    approvedItemsText: '4 dari 5 disetujui',
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    urgentStatusHint: 'Semua berkas tahap ini sudah diperiksa dan disetujui',
    members: [
      { name: 'Indra Sjafri', role: 'Ketua kelompok', nis: '2024.11.1901' },
      { name: 'Gilang Dirga', role: 'Materi', nis: '2024.11.1902' },
      { name: 'Hesti Purwadinata', role: 'Desain', nis: '2024.11.1903' },
      { name: 'Irfan Bachdim', role: 'Anggota', nis: '2024.11.1904' },
      { name: 'Julie Estelle', role: 'Anggota', nis: '2024.11.1905' },
      { name: 'Kunto Aji', role: 'Anggota', nis: '2024.11.1906' },
      { name: 'Luna Maya', role: 'Anggota', nis: '2024.11.1907' },
    ],
  },
  {
    id: '20',
    number: '20',
    schoolName: 'SMPN 2 Prambon',
    leaderName: 'Joko Anwar',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    completedStages: 3,
    currentStageIndex: 3,
    approvedItemsText: '4 dari 5 disetujui',
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    urgentStatusHint: 'Semua berkas tahap ini sudah diperiksa dan disetujui',
    members: [
      { name: 'Joko Anwar', role: 'Ketua kelompok', nis: '2024.11.2001' },
      { name: 'Marsha Timothy', role: 'Materi', nis: '2024.11.2002' },
      { name: 'Nicholas Saputra', role: 'Desain', nis: '2024.11.2003' },
      { name: 'Oka Antara', role: 'Anggota', nis: '2024.11.2004' },
      { name: 'Prisia Nasution', role: 'Anggota', nis: '2024.11.2005' },
      { name: 'Rio Dewanto', role: 'Anggota', nis: '2024.11.2006' },
      { name: 'Slamet Rahardjo', role: 'Anggota', nis: '2024.11.2007' },
    ],
  },
  {
    id: '21',
    number: '21',
    schoolName: 'SMP Muhammadiyah 1',
    leaderName: 'Kiki Narendra',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    completedStages: 3,
    currentStageIndex: 3,
    approvedItemsText: '4 dari 5 disetujui',
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    urgentStatusHint: 'Semua berkas tahap ini sudah diperiksa dan disetujui',
    members: [
      { name: 'Kiki Narendra', role: 'Ketua kelompok', nis: '2024.11.2101' },
      { name: 'Tara Basro', role: 'Materi', nis: '2024.11.2102' },
      { name: 'Upi Avianto', role: 'Desain', nis: '2024.11.2103' },
      { name: 'Vanesha Prescilla', role: 'Anggota', nis: '2024.11.2104' },
      { name: 'Wafda Saifan', role: 'Anggota', nis: '2024.11.2105' },
      { name: 'Yayu Unru', role: 'Anggota', nis: '2024.11.2106' },
      { name: 'Zara Adhisty', role: 'Anggota', nis: '2024.11.2107' },
    ],
  },
  {
    id: '22',
    number: '22',
    schoolName: 'SMP YPM 1 Taman',
    leaderName: 'Lukman Sardi',
    hasLeader: true,
    currentStage: 'Tahap 3: Buat desain',
    completedStages: 3,
    currentStageIndex: 3,
    approvedItemsText: '4 dari 5 disetujui',
    urgentStatus: 'approved',
    urgentStatusLabel: 'Disetujui',
    urgentStatusHint: 'Semua berkas tahap ini sudah diperiksa dan disetujui',
    members: [
      { name: 'Lukman Sardi', role: 'Ketua kelompok', nis: '2024.11.2201' },
      { name: 'Abimana Aryasatya', role: 'Materi', nis: '2024.11.2202' },
      { name: 'Bront Palarae', role: 'Desain', nis: '2024.11.2203' },
      { name: 'Christine Hakim', role: 'Anggota', nis: '2024.11.2204' },
      { name: 'Dian Sastrowardoyo', role: 'Anggota', nis: '2024.11.2205' },
      { name: 'Eva Celia', role: 'Anggota', nis: '2024.11.2206' },
      { name: 'Fachri Albar', role: 'Anggota', nis: '2024.11.2207' },
    ],
  },
  {
    id: '23',
    number: '23',
    schoolName: 'SMPN 2 Sedati',
    leaderName: '',
    hasLeader: false,
    currentStage: 'Tahap 1: Atur peran',
    completedStages: 0,
    currentStageIndex: 1,
    approvedItemsText: '0 dari 5 disetujui',
    urgentStatus: 'waiting',
    urgentStatusLabel: 'Belum dikumpulkan',
    urgentStatusHint: 'Belum ada berkas yang dikumpulkan karena ketua belum ditentukan',
    members: [
      { name: 'Fiona Anggraeni', role: 'Calon ketua', nis: '2024.11.2301' },
      { name: 'Genta Buana', role: 'Anggota', nis: '2024.11.2302' },
      { name: 'Hesti Wulandari', role: 'Anggota', nis: '2024.11.2303' },
      { name: 'Irfan Hakim', role: 'Anggota', nis: '2024.11.2304' },
      { name: 'Jihan Fahira', role: 'Anggota', nis: '2024.11.2305' },
      { name: 'Kiki Amalia', role: 'Anggota', nis: '2024.11.2306' },
      { name: 'Lucky Hakim', role: 'Anggota', nis: '2024.11.2307' },
    ],
  },
  {
    id: '24',
    number: '24',
    schoolName: 'SMPN 4 Sidoarjo',
    leaderName: '',
    hasLeader: false,
    currentStage: 'Tahap 1: Atur peran',
    completedStages: 0,
    currentStageIndex: 1,
    approvedItemsText: '0 dari 5 disetujui',
    urgentStatus: 'waiting',
    urgentStatusLabel: 'Belum dikumpulkan',
    urgentStatusHint: 'Belum ada berkas yang dikumpulkan karena ketua belum ditentukan',
    members: [
      { name: 'Tegar Wicaksono', role: 'Calon ketua', nis: '2024.11.2401' },
      { name: 'Umi Kalsum', role: 'Anggota', nis: '2024.11.2402' },
      { name: 'Vicky Prasetyo', role: 'Anggota', nis: '2024.11.2403' },
      { name: 'Wulan Guritno', role: 'Anggota', nis: '2024.11.2404' },
      { name: 'Xaverius', role: 'Anggota', nis: '2024.11.2405' },
      { name: 'Yeyen Lidya', role: 'Anggota', nis: '2024.11.2406' },
      { name: 'Zaskia Gotik', role: 'Anggota', nis: '2024.11.2407' },
      { name: 'Arman Maulana', role: 'Anggota', nis: '2024.11.2408' },
    ],
  },
];

// Initial Items for Tab "Menunggu Anda" (4 items)
const INITIAL_WAITING_ADMIN: ActionRowItem[] = [
  {
    id: 'act-1',
    groupId: '03',
    groupNumber: 'Kelompok 03',
    schoolName: 'SMPN 1 Buduran',
    itemName: 'X-Banner v2',
    stageName: 'Tahap 3: Buat desain',
    status: 'review',
    statusLabel: 'Menunggu review',
    statusHint: 'Diajukan 45 menit lalu oleh Nabila Putri Ramadhani',
    ageText: 'diajukan 45 menit lalu',
    leaderName: 'Nabila Putri Ramadhani',
    memberCount: 8,
  },
  {
    id: 'act-3',
    groupId: '02',
    groupNumber: 'Kelompok 02',
    schoolName: 'SMPN 1 Waru',
    itemName: 'RPP pertemuan 2 & modul Scratch',
    stageName: 'Tahap 3: Buat desain',
    status: 'review',
    statusLabel: 'Menunggu review',
    statusHint: 'Diajukan 2 jam lalu oleh Dimas Bagus Wicaksono',
    ageText: 'diajukan 2 jam lalu',
    leaderName: 'Dimas Bagus Wicaksono',
    memberCount: 8,
  },
  {
    id: 'act-6',
    groupId: '06',
    groupNumber: 'Kelompok 06',
    schoolName: 'SMPN 1 Tulangan',
    itemName: 'Draf infografis materi',
    stageName: 'Tahap 3: Buat desain',
    status: 'review',
    statusLabel: 'Menunggu review',
    statusHint: 'Diajukan 3 jam lalu oleh Bagus Pratama Putra',
    ageText: 'diajukan 3 jam lalu',
    leaderName: 'Bagus Pratama Putra',
    memberCount: 8,
  },
  {
    id: 'act-8',
    groupId: '12',
    groupNumber: 'Kelompok 12',
    schoolName: 'SMPN 2 Taman',
    itemName: 'Slide presentasi Canva',
    stageName: 'Tahap 3: Buat desain',
    status: 'review',
    statusLabel: 'Menunggu review',
    statusHint: 'Diajukan 4 jam lalu oleh Kevin Alamsyah',
    ageText: 'diajukan 4 jam lalu',
    leaderName: 'Kevin Alamsyah',
    memberCount: 7,
  },
];

// Initial Items for Tab "Menunggu kelompok" (4 items: 3 late + 1 revisi)
const INITIAL_WAITING_GROUP: ActionRowItem[] = [
  {
    id: 'grp-1',
    groupId: '07',
    groupNumber: 'Kelompok 07',
    schoolName: 'SMP Telkom Sidoarjo',
    itemName: 'Draf X-Banner fisik',
    stageName: 'Tahap 3: Buat desain',
    status: 'overdue',
    statusLabel: 'Belum dikumpulkan',
    statusHint: 'Batas pengumpulan lewat 2 hari',
    ageText: 'Terlambat 2 hari',
    isLate: true,
    lateDays: 2,
    leaderName: 'Fahri Ramadhan',
    memberCount: 8,
  },
  {
    id: 'grp-2',
    groupId: '04',
    groupNumber: 'Kelompok 04',
    schoolName: 'SMPN 2 Krian',
    itemName: 'Draf poster materi',
    stageName: 'Tahap 3: Buat desain',
    status: 'overdue',
    statusLabel: 'Belum dikumpulkan',
    statusHint: 'Batas pengumpulan lewat 1 hari',
    ageText: 'Terlambat 1 hari',
    isLate: true,
    lateDays: 1,
    leaderName: 'Siti Nurhaliza',
    memberCount: 7,
  },
  {
    id: 'grp-3',
    groupId: '09',
    groupNumber: 'Kelompok 09',
    schoolName: 'SMPN 1 Taman',
    itemName: 'Revisi lembar kerja lab',
    stageName: 'Tahap 2: Rancang materi',
    status: 'overdue',
    statusLabel: 'Belum dikumpulkan',
    statusHint: 'Batas pengumpulan lewat 3 hari',
    ageText: 'Terlambat 3 hari',
    isLate: true,
    lateDays: 3,
    leaderName: 'Rian Hidayat',
    memberCount: 7,
  },
  {
    id: 'grp-4',
    groupId: '05',
    groupNumber: 'Kelompok 05',
    schoolName: 'SMPN 2 Candi',
    itemName: 'Revisi RPP alokasi lab',
    stageName: 'Tahap 2: Rancang materi',
    status: 'revisi',
    statusLabel: 'Perlu revisi',
    statusHint: 'Catatan dikirim kemarin, menunggu unggahan ulang',
    ageText: 'Revisi belum diunggah ulang',
    leaderName: 'Dewi Maharani',
    memberCount: 7,
  },
];

export const AdminMonitoringPage: React.FC = () => {
  const { navigate, showToast } = useApp();

  // Navigation: 'beranda' | 'kelompok' | 'feedback' | 'pengaturan'
  const [activeScreen, setActiveScreen] = useState<'beranda' | 'kelompok' | 'feedback' | 'pengaturan'>('beranda');

  // Groups and Action Data State
  const [groupsList, setGroupsList] = useState<GroupProgressRow[]>(INITIAL_GROUPS);
  const [waitingAdminItems, setWaitingAdminItems] = useState<ActionRowItem[]>(INITIAL_WAITING_ADMIN);
  const [waitingGroupItems, setWaitingGroupItems] = useState<ActionRowItem[]>(INITIAL_WAITING_GROUP);

  // Screen 1: Whose turn it is tab ('admin' | 'kelompok')
  const [turnTab, setTurnTab] = useState<'admin' | 'kelompok'>('admin');
  const [showAllActions, setShowAllActions] = useState(false);

  // Screen 1: Progres Kelompok Search & Chips
  const [progressSearch, setProgressSearch] = useState('');
  const [progressChip, setProgressChip] = useState<'all' | 'attention' | 'done'>('all');

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

  // ─── HANDLER: Copy Reminder ───────────────────────────────────────────────
  const handleCopyReminder = (item: ActionRowItem) => {
    const text = `Halo Ketua ${item.groupNumber} (${item.schoolName}), mohon segera mengunggah berkas "${item.itemName}" untuk program Skomda Mengajar. Terima kasih.`;
    navigator.clipboard?.writeText(text);
    setCopiedReminderId(item.id);
    showToast('Teks pengingat disalin, tinggal tempel di WhatsApp.', 'success');
  };

  // ─── HANDLER: Open Review Panel ───────────────────────────────────────────
  const handleOpenReview = (groupId?: string) => {
    // Collect all pending review groups
    const pendingReviews = groupsList.filter((g) => g.urgentStatus === 'review');
    if (pendingReviews.length === 0) {
      showToast('Semua review sudah selesai.', 'info');
      return;
    }
    setReviewQueue(pendingReviews);

    // Find requested group index, or default to 0
    let targetIdx = 0;
    if (groupId) {
      const idx = pendingReviews.findIndex((g) => g.id === groupId);
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

    showToast(`Berkas Kelompok ${currentGroup.number} disetujui.`, 'success');

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

    showToast(`Catatan revisi dikirim ke Ketua Kelompok ${currentGroup.number}.`, 'info');

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

  return (
    <div className="w-full min-h-screen bg-[#F7F5F2] text-[#21201E] font-['Poppins'] antialiased selection:bg-[#E20113] selection:text-white">
      {/* ══════════════════════════════════════════════════════════════════════════
          TOP BAR (NO SIDEBAR, PLAIN INDONESIAN, GURU PEMBIMBING)
      ══════════════════════════════════════════════════════════════════════════ */}
      <header className="w-full bg-white border-b border-[#E6E2DE] sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo & Tilted Motif */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                setActiveScreen('beranda');
                navigate('/admin');
              }}
              className="flex items-center gap-2 cursor-pointer text-left"
            >
              <span className="text-sm font-extrabold tracking-tight text-[#21201E]">
                Skomda Mengajar
              </span>
              <span className="bg-[#E20113] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-[2px] -rotate-3 inline-block">
                #Skomda
              </span>
            </button>

            {/* Top Navigation Links */}
            <nav className="flex items-center gap-5 text-xs font-medium">
              <button
                onClick={() => setActiveScreen('beranda')}
                className={`py-1 transition-colors cursor-pointer ${
                  activeScreen === 'beranda'
                    ? 'text-[#21201E] font-semibold border-b-2 border-[#21201E]'
                    : 'text-[#6B6560] hover:text-[#21201E]'
                }`}
              >
                Beranda
              </button>
              <button
                onClick={() => setActiveScreen('kelompok')}
                className={`py-1 transition-colors cursor-pointer ${
                  activeScreen === 'kelompok'
                    ? 'text-[#21201E] font-semibold border-b-2 border-[#21201E]'
                    : 'text-[#6B6560] hover:text-[#21201E]'
                }`}
              >
                Kelompok
              </button>
              <button
                onClick={() => setActiveScreen('feedback')}
                className={`py-1 transition-colors cursor-pointer ${
                  activeScreen === 'feedback'
                    ? 'text-[#21201E] font-semibold border-b-2 border-[#21201E]'
                    : 'text-[#6B6560] hover:text-[#21201E]'
                }`}
              >
                Feedback
              </button>
              <button
                onClick={() => setActiveScreen('pengaturan')}
                className={`py-1 transition-colors cursor-pointer ${
                  activeScreen === 'pengaturan'
                    ? 'text-[#21201E] font-semibold border-b-2 border-[#21201E]'
                    : 'text-[#6B6560] hover:text-[#21201E]'
                }`}
              >
                Pengaturan
              </button>
            </nav>
          </div>

          {/* Right Role Chip & Keluar */}
          <div className="flex items-center gap-3 text-xs">
            <span
              className="bg-[#E6E2DE]/60 text-[#21201E] px-2.5 py-1 rounded-[4px] font-medium text-[11px]"
              title="Peran login Anda saat ini"
            >
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

      {/* ══════════════════════════════════════════════════════════════════════════
          MAIN CONTENT AREA
      ══════════════════════════════════════════════════════════════════════════ */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* ────────────────────────────────────────────────────────────────────
            SCREEN 1: BERANDA (ADMIN HOME)
        ──────────────────────────────────────────────────────────────────── */}
        {activeScreen === 'beranda' && (
          <div className="space-y-6">
            {/* Persiapan Panel: While Persiapan is unfinished, sits above everything */}
            {isPersiapanUnfinished && (
              <div className="bg-white border border-[#E6E2DE] rounded-[4px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#6B6560] uppercase tracking-wider block">
                    Tahap Persiapan
                  </span>
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    {/* Item 1: Impor data (done) */}
                    <div className="flex items-center gap-1.5 text-[#21201E] font-medium">
                      <span className="w-4 h-4 rounded-[2px] bg-[#3DBE7A] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                      <span>1. Impor data</span>
                    </div>

                    <span className="text-[#E6E2DE]">•</span>

                    {/* Item 2: Tandai ketua (current count) */}
                    <div className="flex items-center gap-1.5 text-[#21201E] font-medium">
                      <span className="w-4 h-4 rounded-[2px] border border-[#21201E] text-[#21201E] flex items-center justify-center shrink-0 text-[10px] font-bold">
                        2
                      </span>
                      <span>
                        Tandai ketua ({groupsWithLeaderCount} dari {groupsList.length} kelompok sudah punya ketua)
                      </span>
                    </div>
                  </div>
                </div>

                {/* The single primary button on Screen 1 while Persiapan is unfinished */}
                <button
                  onClick={() => setActiveScreen('kelompok')}
                  className="px-4 py-2 bg-[#E20113] hover:bg-[#b4000c] text-white text-xs font-semibold rounded-[4px] transition-colors cursor-pointer shrink-0"
                >
                  Tandai ketua
                </button>
              </div>
            )}

            {/* Header: Title with mandatory one sentence opening */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E6E2DE]">
              <div>
                <h1 className="text-2xl font-extrabold text-[#21201E] tracking-tight">
                  Pantau kelompok
                </h1>
                <p className="text-xs text-[#6B6560] mt-1 leading-relaxed">
                  Ini yang perlu Anda tindak hari ini dan kelompok mana yang tertinggal.
                </p>
              </div>

              {/* One line stage info & Thin 6-Part Progress Line */}
              <div className="flex flex-col md:items-end gap-1.5 shrink-0">
                <span className="text-xs text-[#6B6560] font-medium">
                  Tahap 3 dari 6: Buat desain, tenggat 15 Feb (4 hari lagi)
                </span>
                <div className="flex items-center gap-1 w-56 h-1.5">
                  <span className="h-full flex-1 bg-[#21201E] rounded-[2px]" title="Tahap 1: Atur peran (Selesai)" />
                  <span className="h-full flex-1 bg-[#21201E] rounded-[2px]" title="Tahap 2: Rancang materi (Selesai)" />
                  <span className="h-full flex-1 border border-[#21201E] bg-white rounded-[2px]" title="Tahap 3: Buat desain (Aktif berjalan)" />
                  <span className="h-full flex-1 bg-[#E6E2DE] rounded-[2px]" title="Tahap 4: Pelaksanaan di SMP" />
                  <span className="h-full flex-1 bg-[#E6E2DE] rounded-[2px]" title="Tahap 5: Kumpulkan laporan" />
                  <span className="h-full flex-1 bg-[#E6E2DE] rounded-[2px]" title="Tahap 6: Terima feedback" />
                </div>
              </div>
            </div>

            {/* Block 1: Perlu Tindakan */}
            <section className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-sm font-extrabold text-[#21201E]">Perlu tindakan</h2>

                {/* Two tabs that say whose turn it is */}
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    onClick={() => setTurnTab('admin')}
                    className={`px-3 py-1 rounded-[4px] border transition-colors cursor-pointer font-medium ${
                      turnTab === 'admin'
                        ? 'bg-white border-[#21201E] text-[#21201E] font-semibold'
                        : 'bg-white border-[#E6E2DE] text-[#6B6560] hover:text-[#21201E]'
                    }`}
                  >
                    Menunggu Anda {waitingAdminItems.length}
                  </button>
                  <button
                    onClick={() => setTurnTab('kelompok')}
                    className={`px-3 py-1 rounded-[4px] border transition-colors cursor-pointer font-medium ${
                      turnTab === 'kelompok'
                        ? 'bg-white border-[#21201E] text-[#21201E] font-semibold'
                        : 'bg-white border-[#E6E2DE] text-[#6B6560] hover:text-[#21201E]'
                    }`}
                  >
                    Menunggu kelompok {waitingGroupItems.length}
                  </button>
                </div>
              </div>

              {/* Rows List (Plain rows, not cards) */}
              <div className="bg-white border border-[#E6E2DE] rounded-[4px] divide-y divide-[#E6E2DE]">
                {turnTab === 'admin' ? (
                  /* ─── TAB: Menunggu Anda ─── */
                  waitingAdminItems.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#6B6560] space-y-1">
                      <p className="font-semibold text-[#21201E]">Semua berkas sudah direview.</p>
                      <p>Tidak ada pengajuan yang tertunda. Anda bisa memeriksa tabel progres kelompok di bawah.</p>
                    </div>
                  ) : (
                    (showAllActions ? waitingAdminItems : waitingAdminItems.slice(0, 5)).map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F7F5F2]/60 transition-colors"
                      >
                        {/* Group, SMP, and Item */}
                        <div className="flex items-start sm:items-center gap-3">
                          <span className="text-xs font-bold text-[#21201E] shrink-0 w-24">
                            {item.groupNumber}
                          </span>
                          <span className="text-xs text-[#6B6560] shrink-0 w-36 truncate">
                            {item.schoolName}
                          </span>
                          <span className="text-xs font-medium text-[#21201E]">
                            {item.itemName}
                          </span>
                        </div>

                        {/* Status chip, Age, and Exactly One Button: Outlined Charcoal */}
                        <div className="flex items-center gap-4 text-xs shrink-0 self-end sm:self-center">
                          <span
                            className="px-2 py-0.5 rounded-[4px] bg-[#F2B33D]/25 text-[#21201E] text-[11px] font-medium cursor-help"
                            title={item.statusHint}
                          >
                            {item.statusLabel}
                          </span>

                          <span className="text-[11px] text-[#6B6560] w-36 text-right">
                            {item.ageText}
                          </span>

                          <button
                            onClick={() => handleOpenReview(item.groupId)}
                            className="px-3 py-1 rounded-[4px] border border-[#21201E] text-[#21201E] hover:bg-[#21201E]/5 font-medium text-xs transition-colors cursor-pointer"
                          >
                            Review
                          </button>
                        </div>
                      </div>
                    ))
                  )
                ) : (
                  /* ─── TAB: Menunggu kelompok ─── */
                  waitingGroupItems.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#6B6560] space-y-1">
                      <p className="font-semibold text-[#21201E]">Semua kelompok sesuai jadwal.</p>
                      <p>Tidak ada keterlambatan pengumpulan atau revisi yang tertunda.</p>
                    </div>
                  ) : (
                    (showAllActions ? waitingGroupItems : waitingGroupItems.slice(0, 5)).map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F7F5F2]/60 transition-colors"
                      >
                        {/* Group, SMP, and Item */}
                        <div className="flex items-start sm:items-center gap-3">
                          <span className="text-xs font-bold text-[#21201E] shrink-0 w-24">
                            {item.groupNumber}
                          </span>
                          <span className="text-xs text-[#6B6560] shrink-0 w-36 truncate">
                            {item.schoolName}
                          </span>
                          <span className="text-xs font-medium text-[#21201E]">
                            {item.itemName}
                          </span>
                        </div>

                        {/* Status chip, Lateness / Revision state, and Button: Salin pengingat */}
                        <div className="flex items-center gap-4 text-xs shrink-0 self-end sm:self-center">
                          {item.status === 'revisi' ? (
                            <span
                              className="px-2 py-0.5 rounded-[4px] bg-[#FF8A5B]/25 text-[#21201E] text-[11px] font-medium cursor-help"
                              title={item.statusHint}
                            >
                              Perlu revisi
                            </span>
                          ) : (
                            <span
                              className="px-2 py-0.5 rounded-[4px] bg-[#8A8582]/15 text-[#21201E] text-[11px] font-medium cursor-help"
                              title={item.statusHint}
                            >
                              Belum dikumpulkan
                            </span>
                          )}

                          {/* Lateness text with small coral clock */}
                          <div className="text-[11px] text-[#6B6560] w-44 text-right">
                            {item.isLate ? (
                              <span className="inline-flex items-center justify-end gap-1 text-[#21201E] font-medium">
                                <Clock className="w-3 h-3 text-[#FF8A5B]" />
                                <span>{item.ageText}</span>
                              </span>
                            ) : (
                              <span>{item.ageText}</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyReminder(item)}
                              className="px-3 py-1 rounded-[4px] border border-[#21201E] text-[#21201E] hover:bg-[#21201E]/5 font-medium text-xs transition-colors cursor-pointer"
                            >
                              Salin pengingat
                            </button>
                            {copiedReminderId === item.id && (
                              <span className="text-[11px] text-[#6B6560] italic hidden md:inline">
                                Teks disalin
                              </span>
                            )}
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
                    className="text-xs font-medium text-[#6B6560] hover:text-[#21201E] underline cursor-pointer"
                  >
                    {showAllActions ? 'Tampilkan 5 saja' : 'Lihat semua'}
                  </button>
                </div>
              )}
            </section>

            {/* Block 2: Progres Kelompok */}
            <section className="space-y-3 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-sm font-extrabold text-[#21201E]">Progres kelompok</h2>

                {/* Search field and Filter Chips */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#6B6560] absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={progressSearch}
                      onChange={(e) => setProgressSearch(e.target.value)}
                      placeholder="Cari kelompok, ketua, atau SMP"
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
                          onClick={() => setProgressChip(key)}
                          className={`px-2.5 py-1 rounded-[4px] border transition-colors cursor-pointer font-medium ${
                            progressChip === key
                              ? 'bg-white border-[#21201E] text-[#21201E] font-semibold'
                              : 'bg-white border-[#E6E2DE] text-[#6B6560] hover:text-[#21201E]'
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
              <div className="bg-white border border-[#E6E2DE] rounded-[4px] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E6E2DE] text-[#6B6560] font-medium">
                      <th className="py-2.5 px-4 font-medium">Kelompok</th>
                      <th className="py-2.5 px-4 font-medium">Ketua</th>
                      <th className="py-2.5 px-4 font-medium">Tahap sekarang</th>
                      <th className="py-2.5 px-4 font-medium">Progres</th>
                      <th className="py-2.5 px-4 font-medium">Item</th>
                      <th className="py-2.5 px-4 text-right font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E2DE]">
                    {filteredProgressRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-[#6B6560]">
                          <p className="font-semibold text-[#21201E]">Tidak ada kelompok pada filter ini.</p>
                          <p className="mt-0.5">Ubah kata kunci pencarian atau pilih chip "Semua".</p>
                        </td>
                      </tr>
                    ) : (
                      filteredProgressRows.map((row) => (
                        <tr
                          key={row.id}
                          onClick={() => handleOpenReview(row.id)}
                          className="hover:bg-[#F7F5F2]/60 transition-colors cursor-pointer"
                        >
                          {/* Kelompok (name and SMP asal) */}
                          <td className="py-3 px-4">
                            <div>
                              <span className="font-bold text-[#21201E] block">
                                Kelompok {row.number}
                              </span>
                              <span className="text-[11px] text-[#6B6560] block">
                                {row.schoolName}
                              </span>
                            </div>
                          </td>

                          {/* Ketua */}
                          <td className="py-3 px-4 text-[#21201E]">
                            {row.hasLeader ? (
                              row.leaderName
                            ) : (
                              <span className="text-[#6B6560] italic">Belum ditentukan</span>
                            )}
                          </td>

                          {/* Tahap sekarang */}
                          <td className="py-3 px-4 text-[#21201E] font-medium">
                            {row.currentStage}
                          </td>

                          {/* Progres: Six small segments (completed solid charcoal, current outlined, future pale) */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 w-24">
                              {[1, 2, 3, 4, 5, 6].map((stg) => {
                                const isCompleted = stg < row.currentStageIndex;
                                const isCurrent = stg === row.currentStageIndex;
                                return (
                                  <span
                                    key={stg}
                                    className={`h-2 flex-1 rounded-[1px] ${
                                      isCompleted
                                        ? 'bg-[#21201E]'
                                        : isCurrent
                                        ? 'border border-[#21201E] bg-white'
                                        : 'bg-[#E6E2DE]'
                                    }`}
                                    title={`Tahap ${stg}: ${SIX_STAGES[stg - 1]}`}
                                  />
                                );
                              })}
                            </div>
                          </td>

                          {/* Item */}
                          <td className="py-3 px-4 text-[#6B6560]">
                            {row.approvedItemsText}
                          </td>

                          {/* Status Chip (Most urgent state first) */}
                          <td className="py-3 px-4 text-right">
                            {row.urgentStatus === 'review' && (
                              <span
                                className="px-2 py-0.5 rounded-[4px] bg-[#F2B33D]/25 text-[#21201E] text-[11px] font-medium cursor-help inline-block"
                                title={row.urgentStatusHint}
                              >
                                Menunggu review
                              </span>
                            )}
                            {row.urgentStatus === 'overdue' && (
                              <span
                                className="px-2 py-0.5 rounded-[4px] bg-[#FF8A5B]/25 text-[#21201E] text-[11px] font-medium cursor-help inline-flex items-center gap-1"
                                title={row.urgentStatusHint}
                              >
                                <Clock className="w-3 h-3 text-[#FF8A5B]" />
                                <span>{row.urgentStatusLabel}</span>
                              </span>
                            )}
                            {row.urgentStatus === 'revisi' && (
                              <span
                                className="px-2 py-0.5 rounded-[4px] bg-[#FF8A5B]/25 text-[#21201E] text-[11px] font-medium cursor-help inline-block"
                                title={row.urgentStatusHint}
                              >
                                Perlu revisi
                              </span>
                            )}
                            {row.urgentStatus === 'approved' && (
                              <span
                                className="px-2 py-0.5 rounded-[4px] bg-[#3DBE7A]/25 text-[#21201E] text-[11px] font-medium cursor-help inline-block"
                                title={row.urgentStatusHint}
                              >
                                Disetujui
                              </span>
                            )}
                            {row.urgentStatus === 'waiting' && (
                              <span
                                className="px-2 py-0.5 rounded-[4px] bg-[#8A8582]/15 text-[#21201E] text-[11px] font-medium cursor-help inline-block"
                                title={row.urgentStatusHint}
                              >
                                Belum dikumpulkan
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E6E2DE]">
              <div>
                <h1 className="text-2xl font-extrabold text-[#21201E] tracking-tight">
                  Kelompok
                </h1>
                <p className="text-xs text-[#6B6560] mt-1 leading-relaxed">
                  Siapkan data kelompok dan tentukan ketua. Hanya ketua yang punya akun.
                </p>
              </div>

              {/* Indicator & The Single Red Primary Button on Screen 3: "Impor CSV" */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Two-item Persiapan indicator */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-[#21201E] font-medium">
                    <Check className="w-3.5 h-3.5 text-[#3DBE7A]" />
                    <span>1. Impor data</span>
                  </span>
                  <span className="text-[#E6E2DE]">/</span>
                  <span className="font-bold text-[#21201E] bg-white border border-[#21201E] px-2 py-0.5 rounded-[4px]">
                    2. Tandai ketua ({groupsWithLeaderCount} dari {groupsList.length})
                  </span>
                </div>

                {/* Exactly one primary button on Screen 3: Signal Red */}
                <button
                  onClick={() => {
                    setIsImportCsvOpen(true);
                    setImportCsvStep(1);
                  }}
                  className="px-4 py-2 bg-[#E20113] hover:bg-[#b4000c] text-white text-xs font-semibold rounded-[4px] transition-colors cursor-pointer shrink-0"
                >
                  Impor CSV
                </button>
              </div>
            </div>

            {/* Table: Kelompok, SMP asal, Anggota, Ketua */}
            <div className="bg-white border border-[#E6E2DE] rounded-[4px] overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E6E2DE] text-[#6B6560] font-medium">
                    <th className="py-2.5 px-4 font-medium">Kelompok</th>
                    <th className="py-2.5 px-4 font-medium">SMP asal</th>
                    <th className="py-2.5 px-4 font-medium">Anggota</th>
                    <th className="py-2.5 px-4 text-right font-medium">Ketua</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E2DE]">
                  {groupsList.map((grp) => (
                    <tr key={grp.id} className="hover:bg-[#F7F5F2]/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-[#21201E]">
                        Kelompok {grp.number}
                      </td>
                      <td className="py-3 px-4 text-[#21201E]">
                        {grp.schoolName}
                      </td>
                      <td className="py-3 px-4 text-[#6B6560]">
                        {grp.members.length} siswa
                      </td>
                      <td className="py-3 px-4 text-right">
                        {grp.hasLeader ? (
                          <div className="flex items-center justify-end gap-3">
                            <span className="font-medium text-[#21201E]">{grp.leaderName}</span>
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
                              className="text-xs text-[#6B6560] hover:text-[#21201E] underline cursor-pointer"
                            >
                              Reset kata sandi
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-3">
                            <span className="text-[#6B6560] italic">Belum ditentukan</span>
                            <button
                              onClick={() => {
                                setAssignLeaderGroup(grp);
                                setSelectedLeaderMember(grp.members[0]?.name || '');
                              }}
                              className="px-2.5 py-1 rounded-[4px] border border-[#21201E] text-[#21201E] hover:bg-[#21201E]/5 text-xs font-medium transition-colors cursor-pointer"
                            >
                              Tandai ketua
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────────
            FEEDBACK TAB
        ──────────────────────────────────────────────────────────────────── */}
        {activeScreen === 'feedback' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-[#E6E2DE]">
              <h1 className="text-2xl font-extrabold text-[#21201E] tracking-tight">
                Feedback
              </h1>
              <p className="text-xs text-[#6B6560] mt-1 leading-relaxed">
                Evaluasi dan masukan langsung dari guru pamong dan siswa SMP setelah sesi mengajar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-[#E6E2DE] p-4 rounded-[4px]">
                <span className="text-xs text-[#6B6560] block">Kepuasan guru pamong</span>
                <span className="text-2xl font-extrabold text-[#21201E] mt-1 block">4.8 / 5.0</span>
                <p className="text-xs text-[#6B6560] mt-2 leading-relaxed">
                  "Siswa SMK sangat siap dengan modul Canva dan tata krama mengajar yang baik."
                </p>
              </div>

              <div className="bg-white border border-[#E6E2DE] p-4 rounded-[4px]">
                <span className="text-xs text-[#6B6560] block">Respons siswa SMP</span>
                <span className="text-2xl font-extrabold text-[#21201E] mt-1 block">4.5 / 5.0</span>
                <p className="text-xs text-[#6B6560] mt-2 leading-relaxed">
                  "Penyampaian materi ramah dan mudah dipahami adik kelas."
                </p>
              </div>

              <div className="bg-white border border-[#E6E2DE] p-4 rounded-[4px]">
                <span className="text-xs text-[#6B6560] block">Relevansi kurikulum</span>
                <span className="text-2xl font-extrabold text-[#21201E] mt-1 block">4.7 / 5.0</span>
                <p className="text-xs text-[#6B6560] mt-2 leading-relaxed">
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
            <div className="pb-4 border-b border-[#E6E2DE]">
              <h1 className="text-2xl font-extrabold text-[#21201E] tracking-tight">
                Pengaturan
              </h1>
              <p className="text-xs text-[#6B6560] mt-1 leading-relaxed">
                Jadwal resmi enam tahap program Skomda Mengajar untuk panduan semua kelompok.
              </p>
            </div>

            <div className="bg-white border border-[#E6E2DE] rounded-[4px] divide-y divide-[#E6E2DE] text-xs">
              {[
                { stage: 'Tahap 1: Atur peran', date: '12 Jan 2026', status: 'Selesai' },
                { stage: 'Tahap 2: Rancang materi', date: '28 Jan 2026', status: 'Selesai' },
                { stage: 'Tahap 3: Buat desain', date: '15 Feb 2026', status: 'Aktif berjalan' },
                { stage: 'Tahap 4: Pelaksanaan di SMP', date: '18–25 Feb 2026', status: 'Mendatang' },
                { stage: 'Tahap 5: Kumpulkan laporan', date: '28 Feb 2026', status: 'Mendatang' },
                { stage: 'Tahap 6: Terima feedback', date: '05 Mar 2026', status: 'Mendatang' },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between">
                  <span className="font-bold text-[#21201E]">{item.stage}</span>
                  <div className="flex items-center gap-4 text-[#6B6560]">
                    <span>Tenggat: {item.date}</span>
                    <span className="px-2 py-0.5 rounded-[4px] bg-[#E6E2DE]/50 text-[#21201E] font-medium">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ══════════════════════════════════════════════════════════════════════════
          SCREEN 2: REVIEW PANEL (RIGHT-SIDE SLIDE-OVER OVER SCREEN 1)
      ══════════════════════════════════════════════════════════════════════════ */}
      {isReviewPanelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/25">
          <div className="w-full max-w-xl bg-white h-full border-l border-[#E6E2DE] flex flex-col justify-between animate-in slide-in-from-right duration-200">
            {/* Top Line: "Review 1 dari 4" and "Kembali" link */}
            <div className="p-4 border-b border-[#E6E2DE] flex items-center justify-between">
              <span className="text-xs font-bold text-[#21201E]">
                {!isAllReviewsFinished
                  ? `Review ${currentReviewIdx + 1} dari ${reviewQueue.length}`
                  : 'Review selesai'}
              </span>
              <button
                onClick={() => setIsReviewPanelOpen(false)}
                className="text-xs font-medium text-[#6B6560] hover:text-[#21201E] underline cursor-pointer"
              >
                Kembali
              </button>
            </div>

            {/* When all reviews are done */}
            {isAllReviewsFinished ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-[4px] bg-[#3DBE7A]/20 text-[#3DBE7A] flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#21201E]">
                    Semua review selesai
                  </h3>
                  <p className="text-xs text-[#6B6560] mt-1 max-w-xs leading-relaxed">
                    Semua berkas yang menunggu tindakan Anda telah diperiksa.
                  </p>
                </div>
                {/* The single primary button on this state */}
                <button
                  onClick={() => setIsReviewPanelOpen(false)}
                  className="px-4 py-2 bg-[#E20113] hover:bg-[#b4000c] text-white text-xs font-semibold rounded-[4px] transition-colors cursor-pointer"
                >
                  Kembali ke beranda
                </button>
              </div>
            ) : currentReviewGroup ? (
              <>
                {/* Panel Header Info: Group, SMP asal, Ketua */}
                <div className="px-5 py-4 border-b border-[#E6E2DE] bg-[#F7F5F2]/40">
                  <h2 className="text-lg font-extrabold text-[#21201E]">
                    Kelompok {currentReviewGroup.number}
                  </h2>
                  <p className="text-xs font-medium text-[#6B6560] mt-0.5">
                    {currentReviewGroup.schoolName}
                  </p>
                  <p className="text-xs text-[#21201E] mt-1">
                    Ketua: {currentReviewGroup.leaderName || 'Belum ditentukan'}
                  </p>
                </div>

                {/* Panel Body: Scrollable */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
                  {/* Six-Stage Timeline with Waiting Item Open */}
                  <div>
                    <h3 className="font-bold text-[#21201E] mb-2.5">Tahapan program</h3>
                    <div className="space-y-2 border border-[#E6E2DE] rounded-[4px] p-3 bg-[#F7F5F2]/30">
                      {SIX_STAGES.map((stgName, idx) => {
                        const stgNum = idx + 1;
                        const isOpen = stgNum === 3; // Tahap 3 is waiting review & open
                        return (
                          <div key={stgNum} className="space-y-2">
                            <div className="flex items-center justify-between py-1">
                              <span
                                className={`font-medium ${
                                  isOpen ? 'font-bold text-[#21201E]' : 'text-[#6B6560]'
                                }`}
                              >
                                Tahap {stgNum}: {stgName}
                              </span>
                              {stgNum < 3 && (
                                <span
                                  className="px-2 py-0.5 rounded-[4px] bg-[#3DBE7A]/25 text-[#21201E] text-[11px] font-medium cursor-help"
                                  title="Tahap ini sudah diperiksa dan disetujui"
                                >
                                  Disetujui
                                </span>
                              )}
                              {stgNum === 3 && (
                                <span
                                  className="px-2 py-0.5 rounded-[4px] bg-[#F2B33D]/25 text-[#21201E] text-[11px] font-medium cursor-help"
                                  title="Menunggu review Anda"
                                >
                                  Menunggu review
                                </span>
                              )}
                              {stgNum > 3 && (
                                <span
                                  className="px-2 py-0.5 rounded-[4px] bg-[#8A8582]/15 text-[#21201E] text-[11px] font-medium cursor-help"
                                  title="Belum dikumpulkan kelompok"
                                >
                                  Belum dikumpulkan
                                </span>
                              )}
                            </div>

                            {/* Open Stage 3 Details: item name, version, upload time, file preview, checklist, earlier comments */}
                            {isOpen && (
                              <div className="p-3.5 bg-white border border-[#E6E2DE] rounded-[4px] space-y-3.5 my-2">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="font-bold text-[#21201E] text-xs block">
                                      X-Banner v2
                                    </span>
                                    <span className="text-[11px] text-[#6B6560]">
                                      Versi 2 • Diunggah 45 menit lalu
                                    </span>
                                  </div>
                                  <button
                                    onClick={() =>
                                      showToast('Membuka file X-Banner v2 di tab baru...', 'info')
                                    }
                                    className="px-2.5 py-1 rounded-[4px] border border-[#21201E] text-[#21201E] hover:bg-[#21201E]/5 font-medium text-xs transition-colors cursor-pointer flex items-center gap-1"
                                  >
                                    <span>Buka file</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </button>
                                </div>

                                {/* Ticked Checklist */}
                                <div className="space-y-1.5 pt-1">
                                  <span className="text-[11px] font-bold text-[#21201E] block">
                                    Daftar periksa desain:
                                  </span>
                                  {[
                                    'Ukuran cetak sesuai standar 60 × 160 cm',
                                    'Resolusi berkas tajam dan siap cetak',
                                    'Memuat logo SMK Telkom Sidoarjo dan SMP tujuan',
                                    'Mencantumkan nama guru pembimbing',
                                  ].map((chk, cIdx) => (
                                    <div
                                      key={cIdx}
                                      className="flex items-center gap-2 text-[#21201E]"
                                    >
                                      <span className="w-3.5 h-3.5 rounded-[2px] bg-[#21201E] text-white flex items-center justify-center shrink-0">
                                        <Check className="w-2.5 h-2.5" />
                                      </span>
                                      <span>{chk}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* Earlier Comments */}
                                <div className="pt-2 border-t border-[#E6E2DE]">
                                  <span className="text-[11px] font-bold text-[#21201E] block">
                                    Catatan review sebelumnya:
                                  </span>
                                  <p className="text-[11px] text-[#6B6560] mt-1 leading-relaxed bg-[#F7F5F2] p-2 rounded-[4px]">
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
                    <h3 className="font-bold text-[#21201E] mb-2">Anggota</h3>
                    <div className="border border-[#E6E2DE] rounded-[4px] divide-y divide-[#E6E2DE]">
                      {currentReviewGroup.members.map((m, mIdx) => (
                        <div
                          key={mIdx}
                          className="p-2.5 flex items-center justify-between text-xs"
                        >
                          <span className="font-medium text-[#21201E]">{m.name}</span>
                          <span className="text-[#6B6560]">{m.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sticky Bottom Bar: Red "Setujui dan lanjut" and Outlined "Minta revisi" */}
                <div className="p-4 border-t border-[#E6E2DE] bg-white space-y-3">
                  {/* Revision comment input if opened */}
                  {isRevisionBoxOpen && (
                    <div className="space-y-2 animate-in fade-in duration-150">
                      <label className="text-xs font-bold text-[#21201E] block">
                        Tulis catatan revisi
                      </label>
                      <textarea
                        rows={3}
                        value={revisionComment}
                        onChange={(e) => setRevisionComment(e.target.value)}
                        placeholder="Tulis bagian yang perlu diperbaiki kelompok..."
                        className="w-full p-2 text-xs border border-[#E6E2DE] rounded-[4px] focus:outline-none focus:border-[#21201E]"
                      />
                      <p className="text-[11px] text-[#6B6560]">
                        Kelompok akan melihat catatan ini dan diminta mengunggah ulang.
                      </p>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setIsRevisionBoxOpen(false)}
                          className="px-3 py-1.5 rounded-[4px] border border-[#E6E2DE] text-[#6B6560] text-xs font-medium cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          onClick={handleSubmitRevision}
                          className="px-4 py-1.5 rounded-[4px] bg-[#21201E] text-white text-xs font-medium cursor-pointer"
                        >
                          Kirim catatan revisi
                        </button>
                      </div>
                    </div>
                  )}

                  {!isRevisionBoxOpen && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* The single primary button in this screen state: Signal Red */}
                        <button
                          onClick={handleApproveAndNext}
                          className="px-4 py-2 rounded-[4px] bg-[#E20113] hover:bg-[#b4000c] text-white font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Setujui dan lanjut
                        </button>

                        {/* Outlined Charcoal button */}
                        <button
                          onClick={() => setIsRevisionBoxOpen(true)}
                          className="px-3 py-2 rounded-[4px] border border-[#21201E] text-[#21201E] hover:bg-[#21201E]/5 font-medium text-xs transition-colors cursor-pointer"
                        >
                          Minta revisi
                        </button>
                      </div>

                      {/* Remaining queue indicator */}
                      <span className="text-[11px] text-[#6B6560]">
                        Sisa {reviewQueue.length - currentReviewIdx} pengajuan
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
