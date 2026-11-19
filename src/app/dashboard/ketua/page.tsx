"use client";

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { groupsData } from '../../../data/mockData';
import {
  ArrowLeft,
  LayoutDashboard,
  Users,
  Kanban,
  FileText,
  Palette,
  QrCode,
  CheckCircle2,
  Clock,
  AlertCircle,
  Upload,
  Download,
  Copy,
  Plus,
  Share2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  FileCheck,
  Eye,
  Trash2,
  Calendar,
  Check
} from 'lucide-react';

export const KetuaDashboardPage: React.FC = () => {
  const { navigate, currentUser, showToast } = useApp();

  // Active Sidebar Tab: 1 to 6
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'anggota' | 'tugas' | 'materi' | 'desain' | 'laporan'>('ringkasan');

  // Identify Current Group (Default to KEL-01 or user's group)
  const userGrpNum = currentUser?.groupNumber ? String(currentUser.groupNumber).padStart(2, '0') : '01';
  const myGroup = groupsData.find((g) => g.number === userGrpNum) || groupsData[0];

  // 1. Members State & Roles
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: currentUser?.name || myGroup.leaderName, role: 'Ketua', igUrl: '@raffi_telkom', igStatus: 'Valid', nis: '54124101' },
    { id: '2', name: 'Nabila Putri R.', role: 'Notulen', igUrl: '@nabila.ptr', igStatus: 'Valid', nis: '54124102' },
    { id: '3', name: 'Rafi Fadillah', role: 'Desain Grafis', igUrl: '@rafifad', igStatus: 'Valid', nis: '54124103' },
    { id: '4', name: 'Dinda Salsabila', role: 'Koord. Materi', igUrl: '@dindasalsa', igStatus: 'Valid', nis: '54124104' },
    { id: '5', name: 'M. Arya Bima', role: 'Dokumentasi', igUrl: '@aryabima_', igStatus: 'Verifikasi', nis: '54124105' },
    { id: '6', name: 'Siti Aisyah', role: 'Logistik', igUrl: '@sitiaisyah', igStatus: 'Verifikasi', nis: '54124106' },
    { id: '7', name: 'Bagas Pratama', role: 'Logistik', igUrl: '@bagas_prat', igStatus: 'Valid', nis: '54124107' },
    { id: '8', name: 'Zahra Amelia', role: 'Dokumentasi', igUrl: '@zahramel', igStatus: 'Valid', nis: '54124108' },
  ]);

  // 2. Kanban Tasks State
  const [tasks, setTasks] = useState([
    { id: 't1', title: 'Cetak fisik X-Banner 60x160 di percetakan rekanan', col: 'todo', tag: 'Desain', assignee: 'Rafi Fadillah', due: '15 Feb' },
    { id: 't2', title: 'Finalisasi RPP Pertemuan 2 - Logika Scratch', col: 'todo', tag: 'Materi', assignee: 'Dinda Salsabila', due: '14 Feb' },
    { id: 't3', title: 'Revisi Slide PPT Canva sesuai masukan pembimbing', col: 'doing', tag: 'Materi', assignee: 'Dinda Salsabila', due: '13 Feb' },
    { id: 't4', title: 'Verifikasi upload feed Instagram 8 anggota', col: 'doing', tag: 'Publikasi', assignee: 'M. Arya Bima', due: '13 Feb' },
    { id: 't5', title: 'Survei ruang lab komputer SMPN tujuan', col: 'done', tag: 'Logistik', assignee: 'Siti Aisyah', due: '10 Feb' },
    { id: 't6', title: 'Pembagian peran & jadwal mengajar tim', col: 'done', tag: 'Organisasi', assignee: 'Raffi Akbar', due: '08 Feb' },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTag, setNewTaskTag] = useState('Materi');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // 3. Materials & Documents State
  const [rppStatus, setRppStatus] = useState<'approved' | 'review' | 'revision'>('approved');
  const [slideStatus, setSlideStatus] = useState<'approved' | 'review' | 'revision'>('revision');
  const [slideAdvisorNotes, setSlideAdvisorNotes] = useState('Tolong tambahkan contoh studi kasus di slide nomor 7 dan kurangi teks terlalu padat.');

  // 4. Design & X-Banner State
  const [bannerStatus, setBannerStatus] = useState<'approved' | 'review' | 'revision'>('review');

  // 5. Final Report & Feedback State
  const [reportSummary, setReportSummary] = useState(
    'Program mengajar berjalan dengan baik. Seluruh siswa SMP antusias mencoba simulasi logika komputer.'
  );
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyQrLink = () => {
    navigator.clipboard.writeText(`https://skomda.sch.id/feedback/${myGroup.number}`);
    setIsCopied(true);
    showToast('Tautan feedback SMP disalin ke clipboard!', 'success');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: `t-${Date.now()}`,
      title: newTaskTitle.trim(),
      col: 'todo',
      tag: newTaskTag,
      assignee: teamMembers[0].name,
      due: '18 Feb',
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setIsAddTaskOpen(false);
    showToast('Tugas baru berhasil ditambahkan.', 'success');
  };

  const handleMoveTask = (id: string, targetCol: 'todo' | 'doing' | 'done') => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, col: targetCol } : t)));
    showToast('Status tugas diperbarui.', 'info');
  };

  return (
    <div className="w-full min-h-screen bg-[#F4F4F5] flex flex-col font-sans antialiased selection:bg-red-500 selection:text-white">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-full transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-3">
              <span className="text-base font-black text-slate-900 tracking-tight">#SKOMDA</span>
              <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                MENGAJAR
              </span>
            </div>
          </div>

          {/* Group Context in Header */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-900">{myGroup.schoolName}</div>
              <div className="text-[11px] text-slate-500">Pembimbing: {myGroup.mentorName}</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-red-600 text-white font-extrabold flex items-center justify-center text-xs shadow-sm">
              {myGroup.number}
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col md:flex-row gap-6">
        
        {/* ================= LEFT PERSISTENT SIDEBAR ================= */}
        <aside className="w-full md:w-64 shrink-0 space-y-4">
          {/* Active Context Card */}
          <div className="bg-white rounded-[24px] border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 font-extrabold text-[10px] tracking-wider uppercase border border-red-100">
                KELOMPOK {myGroup.number}
              </span>
              <span className="text-[11px] font-medium text-slate-400">{myGroup.district}</span>
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                {myGroup.schoolName}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Guru: <span className="font-semibold text-slate-700">{myGroup.mentorName.split(',')[0]}</span>
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] flex items-center justify-between text-slate-500">
              <span>Progres Tim:</span>
              <span className="font-bold text-red-600">Tahap 4 • 67%</span>
            </div>
          </div>

          {/* 6 Pill Navigation Menu */}
          <nav className="bg-white rounded-[24px] border border-slate-200/80 p-2.5 shadow-xs space-y-1">
            {[
              { id: 'ringkasan', label: 'Ringkasan', icon: LayoutDashboard },
              { id: 'anggota', label: 'Anggota & Peran', icon: Users, badge: teamMembers.length },
              { id: 'tugas', label: 'Papan Tugas', icon: Kanban, badge: tasks.filter((t) => t.col !== 'done').length },
              { id: 'materi', label: 'Materi & Draf', icon: FileText },
              { id: 'desain', label: 'Galeri Desain', icon: Palette },
              { id: 'laporan', label: 'Laporan & QR Feedback', icon: QrCode },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ================= RIGHT MAIN CONTENT AREA ================= */}
        <main className="flex-1 min-w-0">
          
          {/* TAB 1: RINGKASAN */}
          {activeTab === 'ringkasan' && (
            <div className="space-y-6">
              {/* Stepper Header */}
              <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900">Alur Tahapan Kelompok</h2>
                  <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                    Tahap Aktif: 04. Siapkan Desain
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
                  {[
                    { no: '01', name: 'Bentuk Tim', done: true },
                    { no: '02', name: 'Pilih Ketua', done: true },
                    { no: '03', name: 'Susun Modul', done: true },
                    { no: '04', name: 'Siapkan Desain', active: true },
                    { no: '05', name: 'Mengajar SMP', locked: true },
                    { no: '06', name: 'Evaluasi & Nilai', locked: true },
                  ].map((s) => (
                    <div
                      key={s.no}
                      className={`p-3 rounded-2xl border text-center space-y-1 ${
                        s.active
                          ? 'border-2 border-red-600 bg-red-50/50 shadow-xs'
                          : s.done
                          ? 'bg-slate-50 border-slate-200'
                          : 'bg-slate-50/50 border-slate-100 opacity-60'
                      }`}
                    >
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full inline-block ${
                          s.active
                            ? 'bg-red-600 text-white'
                            : s.done
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {s.no}
                      </span>
                      <div className={`text-xs font-bold ${s.active ? 'text-red-700' : 'text-slate-800'}`}>
                        {s.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 Interactive Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  onClick={() => setActiveTab('anggota')}
                  className="bg-white rounded-[24px] border border-slate-200/80 p-5 shadow-xs hover:border-red-300 hover:shadow-md transition cursor-pointer space-y-1"
                >
                  <div className="text-slate-400 text-xs font-semibold">Anggota Terdaftar</div>
                  <div className="text-2xl font-black text-slate-900">{teamMembers.length} Siswa</div>
                  <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Semua sudah konfirmasi peran
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('tugas')}
                  className="bg-white rounded-[24px] border border-slate-200/80 p-5 shadow-xs hover:border-red-300 hover:shadow-md transition cursor-pointer space-y-1"
                >
                  <div className="text-slate-400 text-xs font-semibold">Tugas Berjalan</div>
                  <div className="text-2xl font-black text-slate-900">
                    {tasks.filter((t) => t.col === 'doing').length} Tugas
                  </div>
                  <div className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Tenggat berikutnya: 14 Feb
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('desain')}
                  className="bg-white rounded-[24px] border border-slate-200/80 p-5 shadow-xs hover:border-red-300 hover:shadow-md transition cursor-pointer space-y-1"
                >
                  <div className="text-slate-400 text-xs font-semibold">Status Berkas Desain</div>
                  <div className="text-2xl font-black text-amber-600">Menunggu Review</div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    X-Banner v2 diajukan ke pembimbing
                  </div>
                </div>
              </div>

              {/* Priority Action Items */}
              <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">2 Tindakan Prioritas Hari Ini</h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-amber-900">
                        Perbaiki Slide Presentasi Canva (Revisi Pembimbing)
                      </div>
                      <p className="text-xs text-amber-800">
                        "{slideAdvisorNotes}"
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('materi')}
                      className="px-3.5 py-1.5 rounded-full bg-amber-600 text-white font-bold text-xs shrink-0 cursor-pointer hover:bg-amber-700 transition"
                    >
                      Buka Modul
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200/80 flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-red-900">
                        Cek Bukti Unggah Feed Instagram 2 Anggota Tim
                      </div>
                      <p className="text-xs text-red-800">
                        M. Arya Bima dan Siti Aisyah belum terverifikasi publikasi Instagram-nya.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('anggota')}
                      className="px-3.5 py-1.5 rounded-full bg-red-600 text-white font-bold text-xs shrink-0 cursor-pointer hover:bg-red-700 transition"
                    >
                      Verifikasi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANGGOTA & PERAN */}
          {activeTab === 'anggota' && (
            <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Daftar Anggota & Distribusi Peran</h2>
                  <p className="text-xs text-slate-500">
                    Atur peran spesifik untuk setiap siswa di tim Anda agar pembagian tugas berjalan terarah.
                  </p>
                </div>
                <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full self-start">
                  Total: {teamMembers.length} Siswa
                </div>
              </div>

              {/* Members Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                      <th className="pb-3 pl-2">Nama Siswa / NIS</th>
                      <th className="pb-3">Peran Tim</th>
                      <th className="pb-3">Publikasi Instagram</th>
                      <th className="pb-3 pr-2 text-right">Status Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {teamMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 pl-2">
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>{m.name}</span>
                            {m.role === 'Ketua' && (
                              <span className="text-[10px] font-extrabold bg-red-600 text-white px-2 py-0.5 rounded-full">
                                KETUA
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">NIS: {m.nis}</div>
                        </td>

                        <td className="py-3.5">
                          <select
                            value={m.role}
                            onChange={(e) => {
                              const newRole = e.target.value;
                              setTeamMembers(
                                teamMembers.map((item) => (item.id === m.id ? { ...item, role: newRole } : item))
                              );
                              showToast(`Peran ${m.name} diubah menjadi ${newRole}`, 'info');
                            }}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
                          >
                            <option value="Ketua">Ketua</option>
                            <option value="Koord. Materi">Koord. Materi</option>
                            <option value="Desain Grafis">Desain Grafis</option>
                            <option value="Notulen">Notulen</option>
                            <option value="Dokumentasi">Dokumentasi</option>
                            <option value="Logistik">Logistik</option>
                          </select>
                        </td>

                        <td className="py-3.5">
                          <span className="text-slate-600 font-medium">{m.igUrl}</span>
                        </td>

                        <td className="py-3.5 pr-2 text-right">
                          <button
                            onClick={() => {
                              const nextStatus = m.igStatus === 'Valid' ? 'Verifikasi' : 'Valid';
                              setTeamMembers(
                                teamMembers.map((item) => (item.id === m.id ? { ...item, igStatus: nextStatus } : item))
                              );
                              showToast(`Status publikasi ${m.name} diubah ke ${nextStatus}`, 'success');
                            }}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition ${
                              m.igStatus === 'Valid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                            }`}
                          >
                            {m.igStatus === 'Valid' ? '✓ Valid' : 'Belum Valid'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PAPAN TUGAS (KANBAN) */}
          {activeTab === 'tugas' && (
            <div className="space-y-6">
              <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Papan Tugas Kelompok</h2>
                  <p className="text-xs text-slate-500">
                    Lacak progres sprint pengerjaan persiapan mengajar secara transparan bersama seluruh tim.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddTaskOpen(true)}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-full transition shadow-xs cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Tugas</span>
                </button>
              </div>

              {/* Kanban Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* To Do */}
                <div className="bg-white rounded-[24px] border border-slate-200/80 p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      To Do ({tasks.filter((t) => t.col === 'todo').length})
                    </span>
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                  </div>
                  <div className="space-y-2.5">
                    {tasks.filter((t) => t.col === 'todo').map((task) => (
                      <div key={task.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                            {task.tag}
                          </span>
                          <span className="text-[11px] text-slate-400">{task.due}</span>
                        </div>
                        <p className="font-bold text-slate-900 leading-snug">{task.title}</p>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                          <span className="text-[11px] text-slate-500">{task.assignee}</span>
                          <button
                            onClick={() => handleMoveTask(task.id, 'doing')}
                            className="text-[11px] text-red-600 font-bold hover:underline cursor-pointer"
                          >
                            Mulai →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Doing */}
                <div className="bg-white rounded-[24px] border border-slate-200/80 p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                      Sedang Dikerjakan ({tasks.filter((t) => t.col === 'doing').length})
                    </span>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  </div>
                  <div className="space-y-2.5">
                    {tasks.filter((t) => t.col === 'doing').map((task) => (
                      <div key={task.id} className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                            {task.tag}
                          </span>
                          <span className="text-[11px] text-amber-700 font-semibold">{task.due}</span>
                        </div>
                        <p className="font-bold text-slate-900 leading-snug">{task.title}</p>
                        <div className="flex items-center justify-between pt-1 border-t border-amber-100">
                          <span className="text-[11px] text-slate-500">{task.assignee}</span>
                          <button
                            onClick={() => handleMoveTask(task.id, 'done')}
                            className="text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer"
                          >
                            Selesai ✓
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Done */}
                <div className="bg-white rounded-[24px] border border-slate-200/80 p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      Selesai ({tasks.filter((t) => t.col === 'done').length})
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="space-y-2.5">
                    {tasks.filter((t) => t.col === 'done').map((task) => (
                      <div key={task.id} className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/30 space-y-1.5 text-xs opacity-80">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {task.tag}
                          </span>
                          <span className="text-[11px] text-slate-400">Tuntas</span>
                        </div>
                        <p className="font-bold text-slate-700 line-through leading-snug">{task.title}</p>
                        <div className="text-[11px] text-slate-400 pt-1">{task.assignee}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Add Task Modal */}
              {isAddTaskOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-xl">
                    <h3 className="font-bold text-slate-900 text-sm">Tambah Tugas Baru</h3>
                    <form onSubmit={handleAddNewTask} className="space-y-3 text-xs">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Judul Tugas</label>
                        <input
                          type="text"
                          required
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          placeholder="misal: Finalisasi draf materi pertemuan 1"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Kategori</label>
                        <select
                          value={newTaskTag}
                          onChange={(e) => setNewTaskTag(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                        >
                          <option value="Materi">Materi</option>
                          <option value="Desain">Desain</option>
                          <option value="Publikasi">Publikasi</option>
                          <option value="Logistik">Logistik</option>
                        </select>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddTaskOpen(false)}
                          className="px-4 py-2 rounded-full border border-slate-200 font-bold"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-full bg-red-600 text-white font-bold"
                        >
                          Simpan Tugas
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MATERI & DRAF */}
          {activeTab === 'materi' && (
            <div className="space-y-6">
              <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-2">
                <h2 className="text-lg font-bold text-slate-900">Berkas Modul & Silabus Ajar</h2>
                <p className="text-xs text-slate-500">
                  Unggah Rencana Pelaksanaan Pembelajaran (RPP) dan slide materi presentasi yang akan dibawakan di kelas SMP.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. RPP / Modul */}
                <div className="bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Dokumen 1</span>
                    <span className="px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                      ✓ Disetujui
                    </span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">RPP & Silabus Pembelajaran</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Format standar SMK Telkom Sidoarjo berisi durasi 90 menit & rubrik kuis.
                    </p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-800">RPP_Informatika_{myGroup.district}_v2.pdf</div>
                      <div className="text-[11px] text-slate-400">1.8 MB • Diunggah kemarin</div>
                    </div>
                    <button
                      onClick={() => showToast('Mengunduh berkas RPP...', 'info')}
                      className="p-2 text-slate-600 hover:text-red-600 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 2. Slide Presentasi PPT */}
                <div className="bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Dokumen 2</span>
                    <span className="px-3 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[11px] border border-amber-200">
                      Perlu Revisi
                    </span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">Slide Presentasi (Canva / PPT)</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Media visual interaktif pengantar materi untuk siswa SMP.
                    </p>
                  </div>

                  {/* Advisor Comment Box */}
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs space-y-1">
                    <span className="font-bold">Catatan Pembimbing ({myGroup.mentorName.split(',')[0]}):</span>
                    <p className="text-[11px] leading-relaxed">{slideAdvisorNotes}</p>
                  </div>

                  {/* Dropzone Upload */}
                  <div className="border-2 border-dashed border-slate-200 hover:border-red-400 rounded-2xl p-5 text-center space-y-2 cursor-pointer transition">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                    <div className="text-xs font-bold text-slate-700">Unggah Revisi Slide PPT</div>
                    <div className="text-[11px] text-slate-400">Format .pptx atau .pdf maks. 25 MB</div>
                    <button
                      onClick={() => {
                        setSlideStatus('review');
                        showToast('Revisi slide berhasil diunggah! Menunggu review pembimbing.', 'success');
                      }}
                      className="px-4 py-1.5 rounded-full bg-red-600 text-white font-bold text-xs"
                    >
                      Pilih File
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GALERI DESAIN */}
          {activeTab === 'desain' && (
            <div className="space-y-6">
              <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-2">
                <h2 className="text-lg font-bold text-slate-900">Galeri Desain & Publikasi Cetak</h2>
                <p className="text-xs text-slate-500">
                  Desain X-Banner resmi berstandar cetak percetakan rekanan SMK Telkom Sidoarjo serta feed promosi media sosial.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* X-Banner Card (7 Cols) */}
                <div className="lg:col-span-7 bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-[10px] uppercase">
                      Wajib Cetak
                    </span>
                    <span className="px-3 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[11px] border border-amber-200">
                      Menunggu Review
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      X-Banner Publikasi 60x160 cm
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Wajib dipajang di depan aula / lab komputer sekolah mitra saat pelaksanaan mengajar.
                    </p>
                  </div>

                  {/* Specifications Badge Strip */}
                  <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-slate-600">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-md">Ukuran: 60 x 160 cm</span>
                    <span className="bg-slate-100 px-2.5 py-1 rounded-md">Resolusi: 300 DPI</span>
                    <span className="bg-slate-100 px-2.5 py-1 rounded-md">Warna: CMYK</span>
                    <span className="bg-slate-100 px-2.5 py-1 rounded-md">Bleed: 1 cm</span>
                  </div>

                  {/* Visual Mockup Preview */}
                  <div className="w-full h-48 bg-gradient-to-r from-red-700 to-red-900 rounded-2xl flex items-center justify-center text-white relative overflow-hidden shadow-inner">
                    <div className="text-center p-4">
                      <div className="text-xs uppercase tracking-widest text-red-200 font-black">#SKOMDA MENGAJAR 2026</div>
                      <div className="text-lg font-black mt-1">{myGroup.schoolName}</div>
                      <div className="text-xs text-red-100 mt-1">Kelompok {myGroup.number} • Generasi Inovator</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-400">Riwayat versi: v2 (terbaru)</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => showToast('Membuka pratinjau penuh X-Banner...', 'info')}
                        className="px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-100 font-bold"
                      >
                        Lihat Full
                      </button>
                      <button
                        onClick={() => showToast('Mengunduh master PDF CMYK...', 'success')}
                        className="px-3 py-1.5 rounded-full bg-slate-900 text-white font-bold"
                      >
                        Unduh PDF
                      </button>
                    </div>
                  </div>
                </div>

                {/* Feed Instagram Card (5 Cols) */}
                <div className="lg:col-span-5 bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Media Sosial</span>
                    <span className="px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                      ✓ Aset Tersedia
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      Desain Feed Instagram (1:1)
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Aset grafis resmi untuk feed publikasi anggota tim di media sosial.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="text-xs font-bold text-slate-700">Aset Resmi yang Disediakan:</div>
                    <ul className="text-xs text-slate-600 space-y-1.5">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Logo Vector Telkom & Skomda PNG
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Frame Twibbon Siap Mengajar
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Panduan Caption & Tagar #Impact2026
                      </li>
                    </ul>

                    <button
                      onClick={() => showToast('Mengunduh ZIP Kit Aset Instagram...', 'success')}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh Paket Desain (.ZIP)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: LAPORAN & QR FEEDBACK */}
          {activeTab === 'laporan' && (
            <div className="space-y-6">
              <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-2">
                <h2 className="text-lg font-bold text-slate-900">Laporan Akhir & QR Feedback SMP</h2>
                <p className="text-xs text-slate-500">
                  Lengkapi lembar refleksi pengajaran dan bagikan kode QR kepada guru dan adik kelas SMP mitra.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Structured Form (7 Cols) */}
                <div className="lg:col-span-7 bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <h3 className="font-extrabold text-base text-slate-900">Form Laporan Akhir Kelompok</h3>
                  
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Sekolah Sasaran</label>
                      <input
                        type="text"
                        disabled
                        value={`${myGroup.schoolName} (${myGroup.district})`}
                        className="w-full p-2.5 bg-slate-100 rounded-xl text-slate-600 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Modul Pembelajaran yang Disampaikan</label>
                      <input
                        type="text"
                        disabled
                        value={myGroup.featuredModule}
                        className="w-full p-2.5 bg-slate-100 rounded-xl text-slate-600 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Ringkasan Pelaksanaan & Catatan Khusus</label>
                      <textarea
                        rows={4}
                        value={reportSummary}
                        onChange={(e) => setReportSummary(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button
                        onClick={() => showToast('Draf laporan tersimpan otomatis.', 'info')}
                        className="px-4 py-2 rounded-full border border-slate-200 font-bold"
                      >
                        Simpan Draf
                      </button>
                      <button
                        onClick={() => showToast('Mengekspor Laporan PDF Kelompok...', 'success')}
                        className="px-5 py-2 rounded-full bg-red-600 text-white font-bold flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Ekspor Laporan (PDF)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Auto-generated QR Feedback SMP (5 Cols) */}
                <div className="lg:col-span-5 bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-xs space-y-4 text-center">
                  <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 font-bold text-[10px] uppercase">
                    Khusus {myGroup.schoolName}
                  </span>

                  <div>
                    <h3 className="font-black text-base text-slate-900">QR Code Feedback SMP</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Pindai tanpa perlu login untuk mengisi survei kepuasan sekolah mitra.
                    </p>
                  </div>

                  {/* QR Box Visual */}
                  <div className="w-48 h-48 mx-auto bg-slate-50 border-2 border-dashed border-red-300 rounded-2xl flex flex-col items-center justify-center p-4">
                    <QrCode className="w-24 h-24 text-slate-800" />
                    <span className="text-[10px] font-mono font-bold text-slate-500 mt-2">
                      FEEDBACK-KEL-{myGroup.number}
                    </span>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleCopyQrLink}
                      className="w-full py-2.5 rounded-full border border-slate-200 hover:bg-slate-100 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{isCopied ? 'Tautan Disalin!' : 'Salin Link Feedback'}</span>
                    </button>

                    <button
                      onClick={() => showToast('Mengunduh QR Code resolusi tinggi...', 'success')}
                      className="w-full py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh Gambar QR Code</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
