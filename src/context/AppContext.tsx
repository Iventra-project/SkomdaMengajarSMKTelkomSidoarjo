import React, { createContext, useContext, useState, ReactNode } from 'react';
import { initialMembersKelompok03, initialSprintTasks, Member, SprintTask } from '../data/mockData';

export type RoutePath = '/' | '/login' | '/admin' | '/admin/kelompok/03' | '/workspace';

export interface User {
  name: string;
  role: 'admin' | 'leader';
  email: string;
  groupNumber?: string;
  schoolName?: string;
}

interface AppContextType {
  currentPath: RoutePath;
  navigate: (path: RoutePath) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
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
      if (hash === '/admin') return '/admin';
      if (hash === '/admin/kelompok/03' || hash === '/admin-kelompok-03') return '/admin/kelompok/03';
      if (hash === '/workspace' || hash === '/kelompok-03') return '/workspace';
    }
    return '/';
  };

  const [currentPath, setCurrentPath] = useState<RoutePath>(getInitialPath);
  const [currentUser, setCurrentUser] = useState<User | null>({
    name: 'Admin Kurikulum',
    role: 'admin',
    email: 'admin@telkomsda.sch.id'
  });

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
    showToast('Status verifikasi Instagram anggota berhasil diperbarui!', 'success');
  };

  const moveTaskColumn = (taskId: string, newCol: 'todo' | 'in_progress' | 'done') => {
    setSprintTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, column: newCol } : task))
    );
    showToast('Status tugas berhasil dipindahkan.', 'info');
  };

  const addTask = (title: string, priority: 'high' | 'medium' | 'low' = 'medium', assignee: string = 'Nabila') => {
    const newTask: SprintTask = {
      id: `task-${Date.now()}`,
      title,
      column: 'todo',
      priority,
      assignee,
      assigneeInitials: assignee.slice(0, 2).toUpperCase(),
      dueDate: '14 Feb',
      subtext: 'Tugas baru ditambahkan'
    };
    setSprintTasks((prev) => [newTask, ...prev]);
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

  return (
    <AppContext.Provider
      value={{
        currentPath,
        navigate,
        currentUser,
        setCurrentUser,
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
