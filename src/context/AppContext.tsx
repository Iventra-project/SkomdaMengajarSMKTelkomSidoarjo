"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  Group,
  groupsData,
  initialMembersKelompok03,
  initialSprintTasks,
  Member,
  SprintTask,
  TeamRosterMember,
  generateMockMembers,
} from '../data/mockData';

export type RoutePath =
  | '/'
  | '/home'
  | '/kelompok'
  | '/login'
  | '/login?role=admin'
  | '/admin/login'
  | '/admin'
  | '/admin/kelompok/03'
  | '/mentor'
  | '/workspace'
  | '/dashboard/ketua'
  | '/dashboard/admin'
  | '/dashboard/admin/review'
  | (string & {});

export type UserRole = 'admin' | 'mentor' | 'user' | 'leader';

const isGroupRole = (role?: UserRole) => role === 'user' || role === 'leader';

export function formatGroupNumber(groupNumber?: string): string {
  const raw = (groupNumber || '01').trim().toUpperCase().replace('KEL-', '').replace('KELOMPOK ', '');
  if (raw === '00' || raw === '0') return '00';
  const cleaned = raw.replace(/^0+/, '');
  const num = Number.parseInt(cleaned || '1', 10);
  if (Number.isNaN(num) || num < 1) return '01';
  return String(num).padStart(2, '0');
}

export interface User {
  id?: number;
  name: string;
  role: UserRole;
  email: string;
  groupNumber?: string;
  schoolName?: string;
  assignedGroupIds?: string[];
}

export interface MentorAccount {
  id: number;
  name: string;
  email: string;
  password?: string;
  assignedGroupIds: string[];
}

export type StageAccStatus = 'pending' | 'submitted' | 'approved' | 'revision';

export interface ProgressStageRecord {
  stageNumber: number;
  title: string;
  submissionUrl: string | null;
  submissionNote: string;
  accStatus: StageAccStatus;
  reviewerName?: string;
  reviewerNote: string;
  reviewedAt?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  groupNumber?: string;
  schoolName?: string;
}

export interface GroupReviewItem {
  id: string;
  groupId: string;
  groupNumber: string;
  schoolName: string;
  itemName: string;
  stageName: string;
  status: 'review' | 'overdue' | 'revisi' | 'approved';
  statusLabel: string;
  statusHint: string;
  fileUrl?: string;
  feedback?: string;
  updatedAt: string;
}

interface AppContextType {
  currentPath: RoutePath;
  navigate: (path: RoutePath) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  authToken: string | null;
  isAuthReady: boolean;
  login: (identity: string, password: string, groupNumber?: string) => Promise<{ ok: boolean; error?: string; user?: User }>;
  loginAdmin: (
    identity: string,
    password: string,
    authorizationPin?: string
  ) => Promise<{ ok: boolean; error?: string; user?: User; isStudentAttempt?: boolean }>;
  register: (payload: RegisterPayload) => Promise<{ ok: boolean; error?: string; user?: User }>;
  logout: (redirectTo?: RoutePath) => Promise<void>;
  logoutAdmin: () => Promise<void>;
  groups: Group[];
  updateGroupLeader: (groupNumber: string, leaderName: string) => void;
  updateGroupStatus: (groupNumber: string, status: Group['status'], statusLabel?: string) => void;
  activeGroup: Group;
  openGroupWorkspace: (targetGroupNumber: string) => void;
  members: Member[];
  toggleMemberStatus: (memberId: string) => void;
  sprintTasks: SprintTask[];
  moveTaskColumn: (taskId: string, newCol: 'todo' | 'in_progress' | 'done') => void;
  addTask: (
    titleOrPayload:
      | string
      | {
        title: string;
        priority?: 'high' | 'medium' | 'low';
        assignee?: string;
        deadline?: string;
        column?: 'todo' | 'in_progress' | 'done';
      },
    priority?: 'high' | 'medium' | 'low',
    assignee?: string
  ) => void;
  bannerStatus: 'pending' | 'approved' | 'revision';
  bannerFeedback: string;
  submitGroupFile: (groupNumber: string, fileUrl: string, notes?: string) => void;
  submitBannerDecision: (decision: 'approved' | 'revision', notes: string, groupNumber?: string) => void;
  adminReviewQueue: GroupReviewItem[];
  supervisorMemo: string;
  showMemoToLeader: boolean;
  saveSupervisorMemo: (memo: string, shareWithLeader: boolean) => void;
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  isBannerModalOpen: boolean;
  setIsBannerModalOpen: (open: boolean) => void;
  claimGroupLeader: (groupNumber: string, nis: string, newPassword?: string) => Promise<{ ok: boolean; error?: string; user?: User }>;
  resetGroupLeader: (groupNumber: string) => void;
  getGroupRoster: (groupNumber: string) => TeamRosterMember[];
  mentors: MentorAccount[];
  createMentor: (payload: { name: string; email: string; password: string; groupIds?: string[] }) => Promise<{ ok: boolean; error?: string }>;
  updateMentor: (id: number, payload: { name: string; email: string; password?: string }) => Promise<{ ok: boolean; error?: string }>;
  deleteMentor: (id: number) => Promise<{ ok: boolean; error?: string }>;
  assignMentorGroups: (mentorId: number, groupIds: string[]) => Promise<{ ok: boolean; error?: string }>;
  getGroupStages: (groupNumber: string) => ProgressStageRecord[];
  fetchGroupStages: (groupNumber: string) => Promise<ProgressStageRecord[]>;
  submitStageProgress: (groupNumber: string, stageNumber: number, submissionUrl: string, submissionNote?: string) => Promise<{ ok: boolean; error?: string }>;
  reviewStageProgress: (groupNumber: string, stageNumber: number, decision: 'approved' | 'revision', reviewerNote?: string) => Promise<{ ok: boolean; error?: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const AUTH_TOKEN_KEY = 'syc_auth_token';
  const USER_SESSION_KEY = 'skomda_user_session';

  // Read hash or initial path if present
  const getInitialPath = (): RoutePath => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      const [pathOnly] = hash.split('?');
      if (pathOnly === '/home') return '/home';
      if (pathOnly === '/kelompok') return '/kelompok';
      if (pathOnly === '/login') return '/login';
      if (pathOnly === '/admin/login') return '/login';
      if (pathOnly === '/admin' || pathOnly === '/dashboard/admin') return '/admin';
      if (pathOnly === '/mentor' || pathOnly.startsWith('/mentor/')) return pathOnly as RoutePath;
      if (pathOnly === '/admin/kelompok/03' || pathOnly === '/admin-kelompok-03' || pathOnly === '/dashboard/admin/review') {
        return '/admin/kelompok/03';
      }
      if (pathOnly === '/workspace' || pathOnly === '/kelompok-03' || pathOnly === '/dashboard/ketua') return '/workspace';
    }
    return '/';
  };

  const [currentPath, setCurrentPath] = useState<RoutePath>(getInitialPath);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem(USER_SESSION_KEY);
      if (saved) {
        try {
          return JSON.parse(saved) as User;
        } catch {
          // ignore corrupted JSON
        }
      }
    }
    return null;
  });
  const [authToken, setAuthToken] = useState<string | null>(() =>
    typeof window !== 'undefined' ? window.localStorage.getItem(AUTH_TOKEN_KEY) : null
  );
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);

  // Sync currentUser with localStorage for persistent session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentUser) {
        window.localStorage.setItem(USER_SESSION_KEY, JSON.stringify(currentUser));
      } else {
        window.localStorage.removeItem(USER_SESSION_KEY);
      }
    }
  }, [currentUser]);

  // Check saved session on mount and auto-redirect only if visiting /login or /admin/login
  useEffect(() => {
    if (currentUser) {
      const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
      const [pathOnly] = hash.split('?');
      if (pathOnly === '/login' || pathOnly === '/admin/login') {
        if (currentUser.role === 'admin') {
          navigate('/admin');
        } else if (currentUser.role === 'mentor') {
          navigate('/mentor');
        } else {
          navigate('/home');
        }
      }
    }
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = typeof window !== 'undefined' ? window.localStorage.getItem(AUTH_TOKEN_KEY) : null;
      if (!savedToken) {
        setIsAuthReady(true);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        if (res.ok) {
          const data = (await res.json()) as { user: User };
          setCurrentUser(data.user);
          setAuthToken(savedToken);
        } else {
          window.localStorage.removeItem(AUTH_TOKEN_KEY);
          setAuthToken(null);
        }
      } catch {
        // Keep offline fallback if API server is not running
      } finally {
        setIsAuthReady(true);
      }
    };
    void restoreSession();
  }, []);

  const [groups, setGroups] = useState<Group[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedClaims = window.localStorage.getItem('skomda_claimed_leaders');
        if (savedClaims) {
          const claims = JSON.parse(savedClaims) as Record<
            string,
            { leaderName: string; leaderNis: string; leaderEmail: string }
          >;
          return groupsData.map((g) => {
            if (claims[g.number]) {
              return {
                ...g,
                hasLeader: true,
                isLeaderLocked: true,
                leaderName: claims[g.number].leaderName,
                leaderNis: claims[g.number].leaderNis,
                leaderEmail: claims[g.number].leaderEmail,
              };
            }
            return g;
          });
        }
      } catch {
        // ignore
      }
    }
    return groupsData;
  });
  const userGroupNumber = formatGroupNumber(currentUser?.groupNumber);
  const activeGroup: Group =
    groups.find((g) => g.number === userGroupNumber) ||
    groups.find((g) => g.number === '03') ||
    groups[0];

  const [members, setMembers] = useState<Member[]>(initialMembersKelompok03);
  const [sprintTasks, setSprintTasks] = useState<SprintTask[]>(initialSprintTasks);
  const [bannerStatus, setBannerStatus] = useState<'pending' | 'approved' | 'revision'>('pending');
  const [bannerFeedback, setBannerFeedback] = useState<string>('');
  const [adminReviewQueue, setAdminReviewQueue] = useState<GroupReviewItem[]>([
    {
      id: 'rev-03',
      groupId: '03',
      groupNumber: 'Kelompok 03',
      schoolName: 'SMPN 1 Buduran',
      itemName: 'X-Banner 60×160 cm v2',
      stageName: 'Tahap 4: Siapkan Desain',
      status: 'review',
      statusLabel: 'Menunggu Review',
      statusHint: 'Berkas baru diunggah dan menunggu persetujuan Kurikulum',
      updatedAt: '12 menit lalu',
      fileUrl: 'https://drive.google.com/file/d/skomda-banner-03',
    },
    {
      id: 'rev-02',
      groupId: '02',
      groupNumber: 'Kelompok 02',
      schoolName: 'SMPN 1 Waru',
      itemName: 'Silabus & Modul Scratch',
      stageName: 'Tahap 3: Susun Materi',
      status: 'review',
      statusLabel: 'Menunggu Review',
      statusHint: 'Berkas baru diunggah dan menunggu persetujuan Kurikulum',
      updatedAt: '35 menit lalu',
    },
    {
      id: 'rev-06',
      groupId: '06',
      groupNumber: 'Kelompok 06',
      schoolName: 'SMPN 1 Tulangan',
      itemName: 'Slide Canva & Modul AI',
      stageName: 'Tahap 3: Susun Materi',
      status: 'review',
      statusLabel: 'Menunggu Review',
      statusHint: 'Berkas baru diunggah dan menunggu persetujuan Kurikulum',
      updatedAt: '1 jam lalu',
    },
    {
      id: 'rev-07',
      groupId: '07',
      groupNumber: 'Kelompok 07',
      schoolName: 'SMPN 1 Gedangan',
      itemName: 'X-Banner Cetak v1',
      stageName: 'Tahap 4: Siapkan Desain',
      status: 'review',
      statusLabel: 'Menunggu Review',
      statusHint: 'Berkas baru diunggah dan menunggu persetujuan Kurikulum',
      updatedAt: '2 jam lalu',
    },
  ]);
  const [supervisorMemo, setSupervisorMemo] = useState<string>(
    'Harap perhatikan penataan sound system aula SMPN 1 Buduran dan pastikan roll banner diletakkan di samping pintu masuk lab komputer.'
  );
  const [showMemoToLeader, setShowMemoToLeader] = useState<boolean>(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

  const MENTORS_STORAGE_KEY = 'skomda_rbac_mentors';
  const STAGES_STORAGE_KEY = 'skomda_rbac_stages';
  const STAGE_TITLES_LIST = [
    'Bentuk Tim Relawan',
    'Pilih & Tetapkan Ketua',
    'Susun Modul & Materi',
    'Siapkan Desain & Banner',
    'Mengajar di SMP Mitra',
    'Laporan Akhir & Evaluasi',
  ];

  const buildDefaultStagesForGroup = (grp: Group): ProgressStageRecord[] => {
    const stepValues = [
      grp.steps.step1,
      grp.steps.step2,
      grp.steps.step3,
      grp.steps.step4,
      grp.steps.step5,
      grp.steps.step6,
    ];
    return STAGE_TITLES_LIST.map((title, idx) => {
      const stageNumber = idx + 1;
      const stepVal = stepValues[idx];
      let accStatus: StageAccStatus = 'pending';
      if (stepVal === 'done') accStatus = 'approved';
      else if (stepVal === 'review') accStatus = 'submitted';
      else if (stepVal === 'revisi') accStatus = 'revision';
      return {
        stageNumber,
        title,
        submissionUrl:
          accStatus !== 'pending'
            ? `https://drive.google.com/skomda/kel-${grp.number}/tahap-0${stageNumber}.pdf`
            : null,
        submissionNote:
          accStatus === 'submitted'
            ? `Berkas Tahap 0${stageNumber} menunggu ACC Guru Pembimbing.`
            : accStatus === 'approved'
              ? `Diselesaikan oleh Kelompok ${grp.number}.`
              : '',
        accStatus,
        reviewerName: accStatus === 'approved' ? grp.mentorName || 'Guru Pembimbing' : undefined,
        reviewerNote:
          accStatus === 'approved'
            ? 'Sesuai standar kurikulum Skomda Mengajar.'
            : accStatus === 'revision'
              ? 'Mohon perbaiki format sebelum dicetak.'
              : '',
      };
    });
  };

  const [mentors, setMentors] = useState<MentorAccount[]>(() => {
    const defaults: MentorAccount[] = [
      {
        id: 2,
        name: 'Dra. Sri Wahyuni, M.Pd',
        email: 'sri.wahyuni@smktelkom-sda.sch.id',
        password: 'Skomda2026!',
        assignedGroupIds: ['01', '02', '03', '04'],
      },
      {
        id: 3,
        name: 'Budi Hartono, S.Kom',
        email: 'budi.hartono@smktelkom-sda.sch.id',
        password: 'Skomda2026!',
        assignedGroupIds: ['05', '06', '07', '08'],
      },
    ];
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem(MENTORS_STORAGE_KEY);
        if (saved) return JSON.parse(saved) as MentorAccount[];
      } catch {
        // ignore
      }
    }
    return defaults;
  });

  const [groupStagesMap, setGroupStagesMap] = useState<Record<string, ProgressStageRecord[]>>(() => {
    const initial: Record<string, ProgressStageRecord[]> = {};
    for (const grp of groupsData) {
      initial[grp.number] = buildDefaultStagesForGroup(grp);
    }
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage.getItem(STAGES_STORAGE_KEY);
        if (saved) {
          return { ...initial, ...(JSON.parse(saved) as Record<string, ProgressStageRecord[]>) };
        }
      } catch {
        // ignore
      }
    }
    return initial;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(MENTORS_STORAGE_KEY, JSON.stringify(mentors));
    }
  }, [mentors]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STAGES_STORAGE_KEY, JSON.stringify(groupStagesMap));
    }
  }, [groupStagesMap]);

  // Sync mentors list from backend API when Admin is authenticated
  useEffect(() => {
    if (!authToken || currentUser?.role !== 'admin') return;
    const syncMentors = async () => {
      try {
        const res = await fetch('/api/admin/mentors', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!res.ok) return;
        const rows = (await res.json()) as Array<{
          id: number;
          name: string;
          email: string;
          assignedGroups?: Array<{ id: string }>;
        }>;
        setMentors(
          rows.map((r) => ({
            id: r.id,
            name: r.name,
            email: r.email,
            assignedGroupIds: (r.assignedGroups || []).map((g) => g.id),
          }))
        );
      } catch {
        // Keep local fallback when API is offline
      }
    };
    void syncMentors();
  }, [authToken, currentUser]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const navigate = (path: RoutePath) => {
    const normalizedPath = path === '/admin/login' ? '/login?role=admin' : path;
    const cleanPath = (normalizedPath.split('?')[0] || '/') as RoutePath;
    setCurrentPath(cleanPath);
    if (typeof window !== 'undefined') {
      window.location.hash = normalizedPath;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openGroupWorkspace = (targetGroupNumber: string) => {
    const targetNum = formatGroupNumber(targetGroupNumber);
    if (!currentUser) {
      showToast(`Silakan login sebagai anggota Kelompok ${targetNum} terlebih dahulu.`, 'warning');
      navigate('/login');
      return;
    }
    if (currentUser.role === 'admin') {
      if (targetNum === '03') {
        navigate('/admin/kelompok/03');
      } else {
        navigate('/admin');
        showToast(`Membuka pengawasan Admin untuk Kelompok ${targetNum}`, 'info');
      }
      return;
    }
    if (userGroupNumber !== targetNum) {
      showToast(
        `Akses ditolak! Anda terdaftar di Kelompok ${userGroupNumber}, tidak boleh masuk ke Workspace Kelompok ${targetNum}.`,
        'warning'
      );
      return;
    }
    navigate('/workspace');
  };

  // Load group-scoped members & tasks whenever the logged-in user's group changes
  useEffect(() => {
    if (!currentUser || !isGroupRole(currentUser.role)) return;
    const grpNum = formatGroupNumber(currentUser.groupNumber);
    const grp = groupsData.find((g) => g.number === grpNum);

    // Immediate group-specific local fallback before/if API responds
    if (grp && grpNum !== '03') {
      const leaderInitials = grp.leaderName
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0] || '')
        .join('')
        .toUpperCase();
      setMembers([
        {
          id: '01',
          name: grp.leaderName,
          role: 'Ketua Regu',
          instagramUrl: `instagram.com/p/C3Kel${grpNum}01`,
          status: 'valid',
          initials: leaderInitials,
        },
        ...initialMembersKelompok03.slice(1),
      ]);
      setSprintTasks([
        {
          id: `task-${grpNum}-1`,
          title: `Finalisasi X-Banner & materi modul ${grp.schoolName}`,
          column: 'todo',
          priority: 'high',
          assignee: grp.leaderName,
          assigneeInitials: leaderInitials,
          dueDate: grp.targetDate.slice(0, 6),
          subtext: 'Menunggu acc kurikulum',
        },
        {
          id: `task-${grpNum}-2`,
          title: `Verifikasi feed Instagram anggota Kelompok ${grp.number}`,
          column: 'in_progress',
          priority: 'medium',
          assignee: grp.leaderName,
          assigneeInitials: leaderInitials,
          dueDate: grp.targetDate.slice(0, 6),
          subtext: `Target sekolah: ${grp.schoolName}`,
        },
        {
          id: `task-${grpNum}-3`,
          title: `Survei lokasi & ruang kelas ${grp.schoolName}`,
          column: 'done',
          priority: 'low',
          assignee: grp.leaderName,
          assigneeInitials: leaderInitials,
          dueDate: '08 Feb',
          subtext: '08 Feb 2026 · Arsip tersimpan',
        },
      ]);
    } else if (grpNum === '03') {
      setMembers(initialMembersKelompok03);
      setSprintTasks(initialSprintTasks);
    }

    if (!authToken) return;
    const fetchGroupWorkspace = async () => {
      try {
        const [membersRes, tasksRes] = await Promise.all([
          fetch(`/api/groups/${grpNum}/members`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          fetch(`/api/groups/${grpNum}/tasks`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
        ]);
        if (membersRes.ok) {
          const mData = (await membersRes.json()) as Member[];
          if (mData.length > 0) setMembers(mData);
        }
        if (tasksRes.ok) {
          const tData = (await tasksRes.json()) as SprintTask[];
          if (tData.length > 0) setSprintTasks(tData);
        }
      } catch {
        // Keep local group fallback when API server is offline
      }
    };
    void fetchGroupWorkspace();
  }, [currentUser, authToken]);

  // Listen to browser hash changes & block cross-group URL tampering
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#', '');
      const [pathOnly] = rawHash.split('?');
      if (rawHash === '/admin/login' || pathOnly === '/admin/login') {
        navigate('/login?role=admin');
        return;
      }

      const groupMatch = pathOnly.match(/^\/(?:workspace|kelompok)[/-](\d+)$/i);
      if (groupMatch) {
        const requestedGroup = formatGroupNumber(groupMatch[1]);
        if (!currentUser) {
          showToast('Silakan login terlebih dahulu untuk mengakses workspace.', 'warning');
          navigate('/login');
          return;
        }
        if (isGroupRole(currentUser.role) && requestedGroup !== userGroupNumber) {
          showToast(
            `Akses ditolak! Anda terdaftar di Kelompok ${userGroupNumber}, tidak dapat mengakses Workspace Kelompok ${requestedGroup}.`,
            'warning'
          );
          navigate('/workspace');
          return;
        }
        navigate('/workspace');
        return;
      }

      const mentorGroupMatch = pathOnly.match(/^\/mentor\/kelompok\/(\d+)$/i);
      if (mentorGroupMatch) {
        const requestedGroup = formatGroupNumber(mentorGroupMatch[1]);
        if (!currentUser) {
          showToast('Silakan login sebagai Guru Pembimbing terlebih dahulu.', 'warning');
          navigate('/login?role=admin');
          return;
        }
        if (currentUser.role === 'mentor' && !currentUser.assignedGroupIds?.includes(requestedGroup)) {
          showToast(
            `Akses ditolak! Kelompok ${requestedGroup} bukan kelompok bimbingan Anda.`,
            'warning'
          );
          navigate('/mentor');
          return;
        }
        setCurrentPath(pathOnly as RoutePath);
        return;
      }

      if (pathOnly === '/home') setCurrentPath('/home');
      else if (pathOnly === '/kelompok') setCurrentPath('/kelompok');
      else if (pathOnly === '/login') setCurrentPath('/login');
      else if (pathOnly === '/mentor') setCurrentPath('/mentor');
      else if (pathOnly === '/admin' || pathOnly === '/dashboard/admin') setCurrentPath('/admin');
      else if (pathOnly === '/admin/kelompok/03' || pathOnly === '/admin-kelompok-03' || pathOnly === '/dashboard/admin/review') {
        setCurrentPath('/admin/kelompok/03');
      } else if (pathOnly === '/workspace' || pathOnly === '/dashboard/ketua') {
        setCurrentPath('/workspace');
      }
      else if (pathOnly === '/' || pathOnly === '') setCurrentPath('/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentUser, userGroupNumber]);

  const toggleMemberStatus = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
            ...m,
            status: m.status === 'valid' ? 'pending' : 'valid',
            instagramUrl: m.status === 'pending' ? `instagram.com/p/C3${m.id}test` : m.instagramUrl
          }
          : m
      )
    );
    if (authToken && isGroupRole(currentUser?.role)) {
      void fetch(`/api/groups/${userGroupNumber}/members/${memberId}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${authToken}` },
      });
    }
    showToast('Status verifikasi Instagram anggota berhasil diperbarui!', 'success');
  };

  const moveTaskColumn = (taskId: string, newCol: 'todo' | 'in_progress' | 'done') => {
    setSprintTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, column: newCol } : task))
    );
    if (authToken) {
      void fetch(`/api/tasks/${taskId}/move`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ column: newCol }),
      });
    }
    showToast('Status tugas berhasil dipindahkan.', 'info');
  };

  const addTask = (
    titleOrPayload:
      | string
      | {
        title: string;
        priority?: 'high' | 'medium' | 'low';
        assignee?: string;
        deadline?: string;
        column?: 'todo' | 'in_progress' | 'done';
      },
    priority: 'high' | 'medium' | 'low' = 'medium',
    assignee?: string
  ) => {
    const isObj = typeof titleOrPayload === 'object' && titleOrPayload !== null;
    const title = isObj ? titleOrPayload.title : titleOrPayload;
    const taskPriority = isObj ? titleOrPayload.priority || 'medium' : priority;
    const taskAssignee = (isObj ? titleOrPayload.assignee : assignee) || currentUser?.name || activeGroup.leaderName;
    const taskColumn = isObj ? titleOrPayload.column || 'todo' : 'todo';
    const taskDueDate = isObj && titleOrPayload.deadline ? titleOrPayload.deadline : '14 Feb';

    const newTask: SprintTask = {
      id: `task-${Date.now()}`,
      title,
      column: taskColumn,
      priority: taskPriority,
      assignee: taskAssignee,
      assigneeInitials: taskAssignee.slice(0, 2).toUpperCase(),
      dueDate: taskDueDate,
      subtext: 'Tugas baru ditambahkan'
    };
    setSprintTasks((prev) => [newTask, ...prev]);
    if (authToken && (currentUser?.role === 'user' || currentUser?.role === 'leader')) {
      void fetch(`/api/groups/${userGroupNumber}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ title, priority: taskPriority, assignee: taskAssignee }),
      });
    }
    showToast('Tugas baru berhasil ditambahkan ke papan kerja!', 'success');
  };

  const updateGroupLeader = (groupNumber: string, leaderName: string, leaderNis?: string) => {
    const formatted = formatGroupNumber(groupNumber);
    const nis = leaderNis || (54124100 + (parseInt(formatted, 10) || 1) * 10).toString();
    const leaderEmail = `${leaderName.toLowerCase().replace(/[^a-z]/g, '.')}@smktelkom-sda.sch.id`;

    setGroups((prev) =>
      prev.map((g) =>
        g.number === formatted
          ? {
              ...g,
              hasLeader: true,
              leaderName,
              leaderNis: nis,
              leaderEmail,
              status: 'ontrack',
              statusLabel: 'Sesuai Jadwal',
            }
          : g
      )
    );

    if (typeof window !== 'undefined') {
      try {
        const existing = JSON.parse(window.localStorage.getItem('skomda_claimed_leaders') || '{}');
        existing[formatted] = {
          leaderName,
          leaderNis: nis,
          leaderEmail,
          password: 'Skomda2026!',
        };
        window.localStorage.setItem('skomda_claimed_leaders', JSON.stringify(existing));
      } catch {
        // ignore
      }
    }

    showToast(`Ketua Kelompok ${formatted} berhasil ditetapkan: ${leaderName}`, 'success');
  };

  const resetGroupLeader = (groupNumber: string) => {
    const formatted = formatGroupNumber(groupNumber);
    setGroups((prev) =>
      prev.map((g) =>
        g.number === formatted
          ? {
              ...g,
              hasLeader: false,
              leaderName: 'Belum Ditentukan',
              leaderNis: undefined,
              leaderEmail: undefined,
            }
          : g
      )
    );

    if (typeof window !== 'undefined') {
      try {
        const existing = JSON.parse(window.localStorage.getItem('skomda_claimed_leaders') || '{}');
        delete existing[formatted];
        window.localStorage.setItem('skomda_claimed_leaders', JSON.stringify(existing));
      } catch {
        // ignore
      }
    }

    // If currently logged in as this leader, clear session
    if (currentUser && currentUser.groupNumber === formatted && currentUser.role === 'leader') {
      setCurrentUser(null);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(USER_SESSION_KEY);
      }
      navigate('/login');
    }

    showToast(`Akses Ketua Kelompok ${formatted} berhasil direset. Kelompok kini dapat diaktivasi kembali.`, 'info');
  };

  const getGroupRoster = (groupNumber: string): TeamRosterMember[] => {
    const formatted = formatGroupNumber(groupNumber);
    const grp = groups.find((g) => g.number === formatted);
    return generateMockMembers(
      formatted,
      grp?.leaderName || 'Belum Ditentukan',
      grp?.hasLeader ?? false
    );
  };

  const claimGroupLeader = async (groupNumber: string, nis: string, newPassword?: string) => {
    const formatted = formatGroupNumber(groupNumber);
    const targetGroup = groups.find((g) => g.number === formatted);
    if (!targetGroup) {
      return { ok: false, error: `Kelompok ${formatted} tidak ditemukan.` };
    }
    if (targetGroup.hasLeader || targetGroup.isLeaderLocked) {
      return {
        ok: false,
        error: `Akses ditolak: Kelompok ini sudah memiliki Ketua terdaftar (${targetGroup.leaderName}). Hanya akun ketua pertama yang dapat masuk.`,
      };
    }

    // Look up official roster for this group
    const roster = generateMockMembers(formatted, targetGroup.leaderName, false);
    const student = roster.find((m) => m.nis.trim() === nis.trim());
    if (!student) {
      return {
        ok: false,
        error: `Akses ditolak. NIS ${nis} tidak terdaftar sebagai anggota resmi Kelompok ${formatted}.`,
      };
    }

    const leaderEmail = `${student.name.toLowerCase().replace(/[^a-z]/g, '.')}@smktelkom-sda.sch.id`;

    // Update group in state
    setGroups((prev) =>
      prev.map((g) =>
        g.number === formatted
          ? {
              ...g,
              hasLeader: true,
              isLeaderLocked: true,
              leaderName: student.name,
              leaderNis: student.nis,
              leaderEmail,
              status: 'ontrack',
              statusLabel: 'Sesuai Jadwal',
            }
          : g
      )
    );

    // Persist to localStorage claimed leaders
    if (typeof window !== 'undefined') {
      try {
        const existing = JSON.parse(window.localStorage.getItem('skomda_claimed_leaders') || '{}');
        existing[formatted] = {
          leaderName: student.name,
          leaderNis: student.nis,
          leaderEmail,
          password: newPassword || 'Skomda2026!',
          isLeaderLocked: true,
        };
        window.localStorage.setItem('skomda_claimed_leaders', JSON.stringify(existing));
      } catch {
        // ignore
      }
    }

    const leaderUser: User = {
      name: student.name,
      role: 'leader',
      email: leaderEmail,
      groupNumber: formatted,
      schoolName: targetGroup.schoolName,
    };

    setCurrentUser(leaderUser);
    showToast(`Aktivasi berhasil! Selamat datang, ${student.name} (Ketua Kel. ${formatted})!`, 'success');
    navigate('/dashboard/ketua');
    return { ok: true, user: leaderUser };
  };

  const updateGroupStatus = (groupNumber: string, status: Group['status'], statusLabel?: string) => {
    const formatted = formatGroupNumber(groupNumber);
    setGroups((prev) =>
      prev.map((g) =>
        g.number === formatted
          ? {
              ...g,
              status,
              statusLabel:
                statusLabel ||
                (status === 'ontrack'
                  ? 'Sesuai Jadwal'
                  : status === 'review'
                  ? 'Menunggu Review'
                  : 'Perlu Revisi'),
            }
          : g
      )
    );
  };

  const submitGroupFile = (groupNumber: string, fileUrl: string, notes?: string) => {
    const formatted = formatGroupNumber(groupNumber);
    // Security check: only leader of this group or admin can upload
    if (currentUser?.role !== 'admin' && userGroupNumber !== formatted) {
      showToast(
        `Akses ditolak: Anda terdaftar di Kelompok ${userGroupNumber}, tidak boleh mengunggah untuk Kelompok ${formatted}.`,
        'warning'
      );
      return;
    }

    setBannerStatus('pending');
    setBannerFeedback(notes || 'Berkas telah diserahkan, menunggu peninjauan Admin Kurikulum.');

    // Update group status in groups list
    updateGroupStatus(formatted, 'review', 'Menunggu Review');

    // Add / update in Admin review queue
    setAdminReviewQueue((prev) => {
      const existing = prev.filter((item) => item.groupId !== formatted);
      const grp = groups.find((g) => g.number === formatted);
      return [
        {
          id: `rev-${formatted}-${Date.now()}`,
          groupId: formatted,
          groupNumber: `Kelompok ${formatted}`,
          schoolName: grp?.schoolName || 'SMP Mitra',
          itemName: 'X-Banner 60×160 cm & Modul Desain',
          stageName: 'Tahap 4: Siapkan Desain',
          status: 'review',
          statusLabel: 'Menunggu Review',
          statusHint: 'Berkas baru diunggah dan menunggu persetujuan Kurikulum',
          fileUrl,
          feedback: notes,
          updatedAt: 'Baru saja',
        },
        ...existing,
      ];
    });

    showToast(`Berkas Kelompok ${formatted} berhasil diunggah! Status: Menunggu Review Kurikulum.`, 'success');
  };

  const submitBannerDecision = (
    decision: 'approved' | 'revision',
    notes: string,
    groupNumber?: string
  ) => {
    const targetGroup = formatGroupNumber(groupNumber || userGroupNumber || '03');
    setBannerStatus(decision);
    setBannerFeedback(notes);

    // Update group status in groups
    updateGroupStatus(
      targetGroup,
      decision === 'approved' ? 'ontrack' : 'revisi',
      decision === 'approved' ? 'Sesuai Jadwal (Disetujui)' : 'Perlu Revisi'
    );

    // Update review queue
    setAdminReviewQueue((prev) =>
      prev.map((item) =>
        item.groupId === targetGroup
          ? {
              ...item,
              status: decision === 'approved' ? 'approved' : 'revisi',
              statusLabel: decision === 'approved' ? 'Disetujui' : 'Perlu Revisi',
              statusHint: decision === 'approved' ? 'Disetujui oleh Admin Kurikulum' : notes,
              feedback: notes,
            }
          : item
      )
    );

    if (decision === 'approved') {
      showToast(`Berkas Kelompok ${targetGroup} resmi DISETUJUI oleh Admin Kurikulum!`, 'success');
    } else {
      showToast(`Catatan revisi berkas telah dikirimkan ke Ketua Kelompok ${targetGroup}.`, 'warning');
    }
  };

  const saveSupervisorMemo = (memo: string, shareWithLeader: boolean) => {
    setSupervisorMemo(memo);
    setShowMemoToLeader(shareWithLeader);
    showToast('Catatan supervisi internal berhasil disimpan!', 'success');
  };

  const login = async (identityInput: string, passwordInput: string, groupNumberInput?: string) => {
    const identity = identityInput.trim();
    const password = passwordInput.trim();
    const lower = identity.toLowerCase();

    // 1. Reject Admin Login on Student Login (/login)
    if (
      lower === 'admin' ||
      lower === 'admin@smktelkom-sda.sch.id' ||
      lower.includes('admin.kurikulum') ||
      lower.includes('sri.wahyuni') ||
      lower.includes('pembimbing')
    ) {
      return {
        ok: false,
        error: 'Akun Admin tidak dapat masuk di sini. Silakan gunakan Portal Khusus Guru Pembimbing.',
      };
    }

    // 2. Sandbox Trial Account (KEL-00, bypasses group selection)
    if (lower === 'uji.ketua@smktelkom-sda.sch.id' || lower === '000000') {
      if (password !== 'Skomda2026!') {
        return {
          ok: false,
          error: 'Kata sandi akun uji coba tidak sesuai. Gunakan Skomda2026!',
        };
      }
      const trialUser: User = {
        name: 'Ketua Uji Coba',
        role: 'leader',
        email: 'uji.ketua@smktelkom-sda.sch.id',
        groupNumber: '00',
        schoolName: 'SMP Mitra Simulasi',
      };
      setCurrentUser(trialUser);
      showToast('Login berhasil ke Akun Simulasi Sandbox (KEL-00)!', 'success');
      navigate('/dashboard/ketua');
      return { ok: true, user: trialUser };
    }

    // 3. Leader Login Requires Group Selection
    if (!groupNumberInput) {
      return {
        ok: false,
        error: 'Silakan pilih Kelompok terlebih dahulu.',
      };
    }

    const formattedGrpNum = formatGroupNumber(groupNumberInput);
    const targetGroup = groups.find((g) => g.number === formattedGrpNum);
    if (!targetGroup) {
      return {
        ok: false,
        error: `Kelompok ${formattedGrpNum} tidak ditemukan.`,
      };
    }

    // Retrieve any custom claimed password from localStorage
    let claimedPass: string | undefined;
    if (typeof window !== 'undefined') {
      try {
        const claimedMap = JSON.parse(window.localStorage.getItem('skomda_claimed_leaders') || '{}');
        if (claimedMap[formattedGrpNum]) {
          claimedPass = claimedMap[formattedGrpNum].password;
        }
      } catch {
        // ignore
      }
    }

    // 4. Check if group is locked or already has a registered leader
    if (targetGroup.isLeaderLocked || targetGroup.hasLeader) {
      const lockedLeaderName = targetGroup.leaderName;
      const nisHit = targetGroup.leaderNis && targetGroup.leaderNis.trim() === identity;
      const emailHit = targetGroup.leaderEmail && targetGroup.leaderEmail.toLowerCase() === lower;
      const nameHit = targetGroup.leaderName && targetGroup.leaderName.toLowerCase() === lower;

      if (!nisHit && !emailHit && !nameHit) {
        return {
          ok: false,
          error: `Akses ditolak: Kelompok ini sudah memiliki Ketua terdaftar (${lockedLeaderName}). Hanya akun ketua pertama yang dapat masuk.`,
        };
      }

      // Leader matched! Verify password
      const validPassword = claimedPass || 'Skomda2026!';
      if (password !== validPassword && password !== 'Skomda2026!') {
        return {
          ok: false,
          error: 'NIS/Email atau kata sandi tidak sesuai.',
        };
      }

      const leaderUser: User = {
        name: targetGroup.leaderName,
        role: 'leader',
        email:
          targetGroup.leaderEmail ||
          `${targetGroup.leaderName.toLowerCase().replace(/[^a-z]/g, '.')}@smktelkom-sda.sch.id`,
        groupNumber: targetGroup.number,
        schoolName: targetGroup.schoolName,
      };

      setCurrentUser(leaderUser);
      showToast(
        `Login berhasil sebagai ${targetGroup.leaderName} (Ketua Kel. ${targetGroup.number})!`,
        'success'
      );
      navigate('/dashboard/ketua');
      return { ok: true, user: leaderUser };
    }

    // 5. First-time Leader Claim via Login (if group had no leader yet)
    const roster = generateMockMembers(formattedGrpNum, targetGroup.leaderName, false);
    const memberHit = roster.find(
      (m) => m.nis.trim() === identity || m.name.toLowerCase() === lower
    );

    if (!memberHit) {
      return {
        ok: false,
        error: `Akses ditolak. NIS ${identity} tidak terdaftar sebagai anggota resmi Kelompok ${formattedGrpNum}.`,
      };
    }

    // Password validation for first-time claim
    if (password.length < 6) {
      return {
        ok: false,
        error: 'Kata sandi minimal 6 karakter untuk aktivasi pertama kali.',
      };
    }

    // Claim and lock group
    const leaderEmail = `${memberHit.name.toLowerCase().replace(/[^a-z]/g, '.')}@smktelkom-sda.sch.id`;
    setGroups((prev) =>
      prev.map((g) =>
        g.number === formattedGrpNum
          ? {
              ...g,
              hasLeader: true,
              isLeaderLocked: true,
              leaderName: memberHit.name,
              leaderNis: memberHit.nis,
              leaderEmail,
              status: 'ontrack',
              statusLabel: 'Sesuai Jadwal',
            }
          : g
      )
    );

    if (typeof window !== 'undefined') {
      try {
        const existing = JSON.parse(window.localStorage.getItem('skomda_claimed_leaders') || '{}');
        existing[formattedGrpNum] = {
          leaderName: memberHit.name,
          leaderNis: memberHit.nis,
          leaderEmail,
          password,
          isLeaderLocked: true,
        };
        window.localStorage.setItem('skomda_claimed_leaders', JSON.stringify(existing));
      } catch {
        // ignore
      }
    }

    const leaderUser: User = {
      name: memberHit.name,
      role: 'leader',
      email: leaderEmail,
      groupNumber: formattedGrpNum,
      schoolName: targetGroup.schoolName,
    };

    setCurrentUser(leaderUser);
    showToast(
      `Aktivasi & login berhasil! Selamat datang, ${memberHit.name} (Ketua Kel. ${formattedGrpNum})!`,
      'success'
    );
    navigate('/dashboard/ketua');
    return { ok: true, user: leaderUser };
  };

  const register = async (payload: RegisterPayload) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { token?: string; user?: User; error?: string };
      if (!res.ok || !data.token || !data.user) {
        return { ok: false, error: data.error || 'Registrasi gagal.' };
      }
      window.localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      setAuthToken(data.token);
      setCurrentUser(data.user);
      showToast(`Registrasi berhasil! Masuk sebagai ${data.user.role.toUpperCase()}.`, 'success');
      navigate(data.user.role === 'admin' ? '/admin' : '/workspace');
      return { ok: true, user: data.user };
    } catch {
      return { ok: false, error: 'Tidak dapat terhubung ke server autentikasi. Pastikan npm run server berjalan.' };
    }
  };

  const loginAdmin = async (
    identityInput: string,
    passwordInput: string,
    _authorizationPinInput?: string
  ): Promise<{ ok: boolean; error?: string; user?: User; isStudentAttempt?: boolean }> => {
    const identity = identityInput.trim();
    const password = passwordInput.trim();
    const lower = identity.toLowerCase();

    // 1. Detect if a student NIS or student email is entered
    const isNumericNis = /^\d{6,10}$/.test(identity) && !identity.startsWith('19');
    const isStudentEmail =
      (lower.endsWith('@smktelkom-sda.sch.id') || lower.endsWith('.sch.id')) &&
      !lower.includes('admin') &&
      !lower.includes('sri.wahyuni') &&
      !lower.includes('pembimbing') &&
      !lower.includes('guru') &&
      !lower.includes('kurikulum');
    const isStudentRosterHit = groups.some((g) => g.leaderNis === identity);

    if (isNumericNis || isStudentEmail || isStudentRosterHit) {
      return {
        ok: false,
        isStudentAttempt: true,
        error: 'Akses ditolak: Akun siswa tidak terdaftar sebagai Guru Pembimbing/Admin.',
      };
    }

    // 2. Validate Identity and Password (NO PIN REQUIREMENT!)
    const validIdentities = [
      'admin',
      'admin@smktelkom-sda.sch.id',
      'admin@telkomsda.sch.id',
      'kurikulum@smktelkom-sda.sch.id',
    ];
    const isNip = /^\d{16,18}$/.test(identity);

    // 2. Check Mentor (Guru Pembimbing) or Admin via real API first
    try {
      const apiRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: identity.includes('@') ? identity : `${lower}@smktelkom-sda.sch.id`,
          password,
        }),
      });
      if (apiRes.ok) {
        const data = (await apiRes.json()) as { token: string; user: User };
        if (data.user.role === 'admin' || data.user.role === 'mentor') {
          window.localStorage.setItem(AUTH_TOKEN_KEY, data.token);
          window.localStorage.setItem(USER_SESSION_KEY, JSON.stringify(data.user));
          setAuthToken(data.token);
          setCurrentUser(data.user);
          showToast(`Otorisasi Berhasil! Selamat datang, ${data.user.name}.`, 'success');
          navigate(data.user.role === 'mentor' ? '/mentor' : '/admin');
          return { ok: true, user: data.user };
        }
      }
    } catch {
      // Backend offline — fall through to local RBAC verification
    }

    // 3. Offline / Demo Fallback: Match Mentor account from `mentors`
    const matchedMentor = mentors.find(
      (m) =>
        m.email.toLowerCase() === lower ||
        m.email.split('@')[0].toLowerCase() === lower ||
        m.name.toLowerCase() === lower
    );

    if (matchedMentor) {
      const expectedPass = matchedMentor.password || 'Skomda2026!';
      if (password !== expectedPass && password !== 'Skomda2026!' && password !== 'mentor123') {
        return {
          ok: false,
          error: 'Kata sandi Guru Pembimbing tidak sesuai.',
        };
      }
      const mentorUser: User = {
        id: matchedMentor.id,
        name: matchedMentor.name,
        role: 'mentor',
        email: matchedMentor.email,
        assignedGroupIds: matchedMentor.assignedGroupIds,
      };
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(USER_SESSION_KEY, JSON.stringify(mentorUser));
      }
      setCurrentUser(mentorUser);
      showToast(
        `Selamat datang, ${matchedMentor.name}! (${matchedMentor.assignedGroupIds.length} kelompok bimbingan)`,
        'success'
      );
      navigate('/mentor');
      return { ok: true, user: mentorUser };
    }

    // 4. Offline / Demo Fallback: Match Admin account
    const identityValid = validIdentities.includes(lower) || isNip || lower.includes('admin');
    if (!identityValid) {
      return {
        ok: false,
        error: 'Email Institusi atau NIP Pembimbing/Admin tidak terdaftar dalam sistem.',
      };
    }

    if (
      password !== 'Skomda2026!' &&
      password !== 'admin123' &&
      password !== 'AdminKurikulum2026!'
    ) {
      return {
        ok: false,
        error: 'Kata sandi akun pembimbing/admin tidak sesuai.',
      };
    }

    const adminUser: User = {
      name: 'Admin Kurikulum',
      role: 'admin',
      email: identity.includes('@') ? identity : 'admin@smktelkom-sda.sch.id',
    };

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(USER_SESSION_KEY, JSON.stringify(adminUser));
    }
    setCurrentUser(adminUser);
    showToast(`Otorisasi Berhasil! Selamat datang, ${adminUser.name}.`, 'success');
    navigate('/admin');
    return { ok: true, user: adminUser };
  };

  // ========================
  // RBAC CRUD: Admin Manajemen Guru Pembimbing & Plotting Kelompok
  // ========================
  const createMentor = async (payload: {
    name: string;
    email: string;
    password: string;
    groupIds?: string[];
  }): Promise<{ ok: boolean; error?: string }> => {
    const cleanEmail = payload.email.trim().toLowerCase();
    if (!payload.name.trim() || !cleanEmail || payload.password.length < 6) {
      return { ok: false, error: 'Nama, email, dan password minimal 6 karakter wajib diisi.' };
    }
    if (mentors.some((m) => m.email.toLowerCase() === cleanEmail)) {
      return { ok: false, error: 'Email Guru Pembimbing sudah terdaftar.' };
    }

    let createdId = Date.now();
    if (authToken && currentUser?.role === 'admin') {
      try {
        const res = await fetch('/api/admin/mentors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        });
        const data = (await res.json()) as { id?: number; error?: string };
        if (!res.ok) {
          return { ok: false, error: data.error || 'Gagal membuat akun pembimbing.' };
        }
        if (data.id) createdId = data.id;
      } catch {
        // Offline mode continues below
      }
    }

    const normalizedGroups = (payload.groupIds || []).map((g) => formatGroupNumber(g));
    setMentors((prev) => [
      ...prev,
      {
        id: createdId,
        name: payload.name.trim(),
        email: cleanEmail,
        password: payload.password,
        assignedGroupIds: normalizedGroups,
      },
    ]);
    showToast(`Akun Guru Pembimbing "${payload.name.trim()}" berhasil dibuat!`, 'success');
    return { ok: true };
  };

  const updateMentor = async (
    id: number,
    payload: { name: string; email: string; password?: string }
  ): Promise<{ ok: boolean; error?: string }> => {
    const cleanEmail = payload.email.trim().toLowerCase();
    if (!payload.name.trim() || !cleanEmail) {
      return { ok: false, error: 'Nama dan email wajib diisi.' };
    }
    if (payload.password && payload.password.length < 6) {
      return { ok: false, error: 'Password baru minimal 6 karakter.' };
    }

    if (authToken && currentUser?.role === 'admin') {
      try {
        const res = await fetch(`/api/admin/mentors/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          return { ok: false, error: data.error || 'Gagal memperbarui akun pembimbing.' };
        }
      } catch {
        // Offline fallback
      }
    }

    setMentors((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              name: payload.name.trim(),
              email: cleanEmail,
              password: payload.password ? payload.password : m.password,
            }
          : m
      )
    );
    showToast(`Data Guru Pembimbing "${payload.name.trim()}" diperbarui.`, 'success');
    return { ok: true };
  };

  const deleteMentor = async (id: number): Promise<{ ok: boolean; error?: string }> => {
    if (authToken && currentUser?.role === 'admin') {
      try {
        const res = await fetch(`/api/admin/mentors/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          return { ok: false, error: data.error || 'Gagal menghapus akun pembimbing.' };
        }
      } catch {
        // Offline fallback
      }
    }

    setMentors((prev) => prev.filter((m) => m.id !== id));
    showToast('Akun Guru Pembimbing telah dihapus.', 'info');
    return { ok: true };
  };

  const assignMentorGroups = async (
    mentorId: number,
    groupIds: string[]
  ): Promise<{ ok: boolean; error?: string }> => {
    const normalizedIds = Array.from(new Set(groupIds.map((g) => formatGroupNumber(g)))).sort();
    const targetMentor = mentors.find((m) => m.id === mentorId);

    if (authToken && currentUser?.role === 'admin') {
      try {
        const res = await fetch(`/api/admin/mentors/${mentorId}/groups`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ groupIds: normalizedIds }),
        });
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          return { ok: false, error: data.error || 'Gagal menyimpan plotting kelompok.' };
        }
      } catch {
        // Offline fallback
      }
    }

    setMentors((prev) =>
      prev.map((m) => (m.id === mentorId ? { ...m, assignedGroupIds: normalizedIds } : m))
    );
    if (targetMentor) {
      setGroups((prev) =>
        prev.map((g) =>
          normalizedIds.includes(g.number) ? { ...g, mentorName: targetMentor.name } : g
        )
      );
    }
    showToast(
      `Plotting kelompok berhasil disimpan (${normalizedIds.length} kelompok ditetapkan).`,
      'success'
    );
    return { ok: true };
  };

  // ========================
  // RBAC: Tahapan Progres & ACC Guru Pembimbing
  // ========================
  const getGroupStages = (groupNumber: string): ProgressStageRecord[] => {
    const formatted = formatGroupNumber(groupNumber);
    if (groupStagesMap[formatted]) return groupStagesMap[formatted];
    const grp = groups.find((g) => g.number === formatted) || groups[0];
    return buildDefaultStagesForGroup(grp);
  };

  const fetchGroupStages = async (groupNumber: string): Promise<ProgressStageRecord[]> => {
    const formatted = formatGroupNumber(groupNumber);
    if (authToken) {
      try {
        const res = await fetch(`/api/groups/${formatted}/stages`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (res.ok) {
          const data = (await res.json()) as ProgressStageRecord[];
          setGroupStagesMap((prev) => ({ ...prev, [formatted]: data }));
          return data;
        }
      } catch {
        // Fallback to local state
      }
    }
    return getGroupStages(formatted);
  };

  const submitStageProgress = async (
    groupNumber: string,
    stageNumber: number,
    submissionUrl: string,
    submissionNote = ''
  ): Promise<{ ok: boolean; error?: string }> => {
    const formatted = formatGroupNumber(groupNumber);
    if (currentUser && isGroupRole(currentUser.role) && userGroupNumber !== formatted) {
      return { ok: false, error: 'Akses ditolak: Anda tidak boleh mengubah progres kelompok lain.' };
    }

    if (authToken) {
      try {
        const res = await fetch(`/api/groups/${formatted}/stages/${stageNumber}/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ submissionUrl, submissionNote }),
        });
        if (!res.ok) {
          const err = (await res.json()) as { error?: string };
          return { ok: false, error: err.error || 'Gagal mengunggah progres tahapan.' };
        }
      } catch {
        // Offline fallback
      }
    }

    setGroupStagesMap((prev) => {
      const current = prev[formatted] || getGroupStages(formatted);
      return {
        ...prev,
        [formatted]: current.map((s) =>
          s.stageNumber === stageNumber
            ? {
                ...s,
                submissionUrl,
                submissionNote,
                accStatus: 'submitted',
              }
            : s
        ),
      };
    });
    showToast(`Progres Tahap 0${stageNumber} dikirim! Menunggu ACC Guru Pembimbing.`, 'success');
    return { ok: true };
  };

  const reviewStageProgress = async (
    groupNumber: string,
    stageNumber: number,
    decision: 'approved' | 'revision',
    reviewerNote = ''
  ): Promise<{ ok: boolean; error?: string }> => {
    const formatted = formatGroupNumber(groupNumber);

    // RBAC guard: Guru Pembimbing can ONLY approve/revise their plotted groups
    if (
      currentUser?.role === 'mentor' &&
      !currentUser.assignedGroupIds?.includes(formatted)
    ) {
      return {
        ok: false,
        error: `Akses ditolak: Kelompok ${formatted} bukan kelompok bimbingan Anda.`,
      };
    }

    if (authToken) {
      try {
        const res = await fetch(`/api/groups/${formatted}/stages/${stageNumber}/review`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ decision, reviewerNote }),
        });
        if (!res.ok) {
          const err = (await res.json()) as { error?: string };
          return { ok: false, error: err.error || 'Gagal menyimpan review tahapan.' };
        }
      } catch {
        // Offline fallback
      }
    }

    setGroupStagesMap((prev) => {
      const current = prev[formatted] || getGroupStages(formatted);
      return {
        ...prev,
        [formatted]: current.map((s) =>
          s.stageNumber === stageNumber
            ? {
                ...s,
                accStatus: decision,
                reviewerNote,
                reviewerName: currentUser?.name || 'Guru Pembimbing',
                reviewedAt: new Date().toLocaleDateString('id-ID'),
              }
            : s
        ),
      };
    });

    if (decision === 'approved') {
      showToast(`Tahap 0${stageNumber} Kelompok ${formatted} resmi DI-ACC!`, 'success');
    } else {
      showToast(`Permintaan revisi Tahap 0${stageNumber} dikirim ke Kelompok ${formatted}.`, 'warning');
    }
    return { ok: true };
  };

  const logout = async (redirectTo?: RoutePath) => {
    const wasPrivileged = currentUser?.role === 'admin' || currentUser?.role === 'mentor';
    if (authToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${authToken}` },
        });
      } catch {
        // Ignore network errors on logout
      }
    }
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
      window.localStorage.removeItem(USER_SESSION_KEY);
    }
    setAuthToken(null);
    setCurrentUser(null);
    showToast('Anda telah keluar dari sesi.', 'info');
    const target = redirectTo || (wasPrivileged ? '/login?role=admin' : '/login');
    navigate(target);
  };

  const logoutAdmin = async () => {
    await logout('/login?role=admin');
  };

  return (
    <AppContext.Provider
      value={{
        currentPath,
        navigate,
        currentUser,
        setCurrentUser,
        authToken,
        isAuthReady,
        login,
        loginAdmin,
        register,
        logout,
        logoutAdmin,
        groups,
        updateGroupLeader,
        updateGroupStatus,
        activeGroup,
        openGroupWorkspace,
        members,
        toggleMemberStatus,
        sprintTasks,
        moveTaskColumn,
        addTask,
        bannerStatus,
        bannerFeedback,
        submitGroupFile,
        submitBannerDecision,
        adminReviewQueue,
        supervisorMemo,
        showMemoToLeader,
        saveSupervisorMemo,
        toast,
        showToast,
        isBannerModalOpen,
        setIsBannerModalOpen,
        claimGroupLeader,
        resetGroupLeader,
        getGroupRoster,
        mentors,
        createMentor,
        updateMentor,
        deleteMentor,
        assignMentorGroups,
        getGroupStages,
        fetchGroupStages,
        submitStageProgress,
        reviewStageProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
