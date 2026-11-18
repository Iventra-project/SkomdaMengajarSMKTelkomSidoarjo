"use client"; 
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Group, groupsData, initialMembersKelompok03, initialSprintTasks, Member, SprintTask } from '../data/mockData';

export type RoutePath =
  | '/'
  | '/login'
  | '/admin'
  | '/admin/kelompok/03'
  | '/workspace'
  | '/dashboard/admin'
  | '/dashboard/admin/review';

export type UserRole = 'admin' | 'user';

export function formatGroupNumber(groupNumber?: string): string {
  const cleaned = (groupNumber || '01').trim().replace(/^0+/, '');
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
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  groupNumber?: string;
  schoolName?: string;
}

interface AppContextType {
  currentPath: RoutePath;
  navigate: (path: RoutePath) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  authToken: string | null;
  isAuthReady: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string; user?: User }>;
  register: (payload: RegisterPayload) => Promise<{ ok: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
  activeGroup: Group;
  openGroupWorkspace: (targetGroupNumber: string) => void;
  members: Member[];
  toggleMemberStatus: (memberId: string) => void;
  sprintTasks: SprintTask[];
  moveTaskColumn: (taskId: string, newCol: 'todo' | 'in_progress' | 'done') => void;
  addTask: (title: string, priority?: 'high' | 'medium' | 'low', assignee?: string) => void;
  bannerStatus: 'pending' | 'approved' | 'revision';
  bannerFeedback: string;
  submitBannerDecision: (decision: 'approved' | 'revision', notes: string) => void;
  supervisorMemo: string;
  showMemoToLeader: boolean;
  saveSupervisorMemo: (memo: string, shareWithLeader: boolean) => void;
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  isBannerModalOpen: boolean;
  setIsBannerModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Read hash or initial path if present
  const getInitialPath = (): RoutePath => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash === '/login') return '/login';
      if (hash === '/admin' || hash === '/dashboard/admin') return '/admin';
      if (
        hash === '/admin/kelompok/03' ||
        hash === '/admin-kelompok-03' ||
        hash === '/dashboard/admin/review'
      )
        return '/admin/kelompok/03';
      if (hash === '/workspace' || hash === '/kelompok-03') return '/workspace';
    }
    return '/';
  };

  const AUTH_TOKEN_KEY = 'syc_auth_token';

  const [currentPath, setCurrentPath] = useState<RoutePath>(getInitialPath);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(() =>
    typeof window !== 'undefined' ? window.localStorage.getItem(AUTH_TOKEN_KEY) : null
  );
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);

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
          setCurrentUser(null);
        }
      } catch {
        // Keep offline fallback if API server is not running
      } finally {
        setIsAuthReady(true);
      }
    };
    void restoreSession();
  }, []);

  const userGroupNumber = formatGroupNumber(currentUser?.groupNumber);
  const activeGroup: Group =
    groupsData.find((g) => g.number === userGroupNumber) ||
    groupsData.find((g) => g.number === '01') ||
    groupsData[0];

  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user);
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('skomda_current_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('skomda_current_user');
      }
    }
  };

  const [members, setMembers] = useState<Member[]>(initialMembersKelompok03);
  const [sprintTasks, setSprintTasks] = useState<SprintTask[]>(initialSprintTasks);
  const [bannerStatus, setBannerStatus] = useState<'pending' | 'approved' | 'revision'>('pending');
  const [bannerFeedback, setBannerFeedback] = useState<string>('');
  const [supervisorMemo, setSupervisorMemo] = useState<string>(
    'Harap perhatikan penataan sound system aula SMPN 1 Buduran dan pastikan roll banner diletakkan di samping pintu masuk lab komputer.'
  );
  const [showMemoToLeader, setShowMemoToLeader] = useState<boolean>(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const navigate = (path: RoutePath) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.location.hash = path;
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
    if (!currentUser || currentUser.role !== 'user') return;
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
      const hash = window.location.hash.replace('#', '');
      const groupMatch = hash.match(/^\/(?:workspace|kelompok)[/-](\d+)$/i);
      if (groupMatch) {
        const requestedGroup = formatGroupNumber(groupMatch[1]);
        if (!currentUser) {
          showToast('Silakan login terlebih dahulu untuk mengakses workspace.', 'warning');
          navigate('/login');
          return;
        }
        if (currentUser.role === 'user' && requestedGroup !== userGroupNumber) {
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

      if (hash === '/login') setCurrentPath('/login');
      else if (hash === '/admin') setCurrentPath('/admin');
      else if (hash === '/admin/kelompok/03' || hash === '/admin-kelompok-03') setCurrentPath('/admin/kelompok/03');
      else if (hash === '/workspace') setCurrentPath('/workspace');
      else if (hash === '/' || hash === '') setCurrentPath('/');
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
    if (authToken && currentUser?.role === 'user') {
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

  const addTask = (title: string, priority: 'high' | 'medium' | 'low' = 'medium', assignee?: string) => {
    const taskAssignee = assignee || currentUser?.name || activeGroup.leaderName;
    const newTask: SprintTask = {
      id: `task-${Date.now()}`,
      title,
      column: 'todo',
      priority,
      assignee: taskAssignee,
      assigneeInitials: taskAssignee.slice(0, 2).toUpperCase(),
      dueDate: '14 Feb',
      subtext: 'Tugas baru ditambahkan'
    };
    setSprintTasks((prev) => [newTask, ...prev]);
    if (authToken && currentUser?.role === 'user') {
      void fetch(`/api/groups/${userGroupNumber}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ title, priority, assignee: taskAssignee }),
      });
    }
    showToast('Tugas baru berhasil ditambahkan ke papan kerja!', 'success');
  };

  const submitBannerDecision = (decision: 'approved' | 'revision', notes: string) => {
    setBannerStatus(decision);
    setBannerFeedback(notes);
    if (decision === 'approved') {
      showToast('Desain X-Banner resmi DISETUJUI oleh Admin Kurikulum!', 'success');
    } else {
      showToast('Permintaan revisi desain telah dikirimkan ke Ketua Kelompok 03.', 'warning');
    }
  };

  const saveSupervisorMemo = (memo: string, shareWithLeader: boolean) => {
    setSupervisorMemo(memo);
    setShowMemoToLeader(shareWithLeader);
    showToast('Catatan supervisi internal berhasil disimpan!', 'success');
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { token?: string; user?: User; error?: string };
      if (!res.ok || !data.token || !data.user) {
        return { ok: false, error: data.error || 'Login gagal.' };
      }
      window.localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      setAuthToken(data.token);
      setCurrentUser(data.user);
      showToast(
        data.user.role === 'admin'
          ? `Selamat datang, ${data.user.name} (Admin)!`
          : `Login berhasil sebagai ${data.user.name}!`,
        'success'
      );
      navigate(data.user.role === 'admin' ? '/admin' : '/workspace');
      return { ok: true, user: data.user };
    } catch {
      return { ok: false, error: 'Tidak dapat terhubung ke server autentikasi. Pastikan npm run server berjalan.' };
    }
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

  const logout = async () => {
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
    }
    setAuthToken(null);
    setCurrentUser(null);
    showToast('Anda telah keluar dari sesi.', 'info');
    navigate('/login');
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
        register,
        logout,
        activeGroup,
        openGroupWorkspace,
        members,
        toggleMemberStatus,
        sprintTasks,
        moveTaskColumn,
        addTask,
        bannerStatus,
        bannerFeedback,
        submitBannerDecision,
        supervisorMemo,
        showMemoToLeader,
        saveSupervisorMemo,
        toast,
        showToast,
        isBannerModalOpen,
        setIsBannerModalOpen
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
