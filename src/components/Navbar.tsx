"use client";

import React, { useState, useEffect } from 'react';
import { useApp, formatGroupNumber } from '../context/AppContext';
import {
  Menu,
  X,
  ArrowRight,
  ArrowLeft,
  LogOut,
  Check,
  Lock,
} from 'lucide-react';

export interface NavbarProps {
  variant?: 'public' | 'home' | 'login';
  currentActiveTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  variant = 'public',
  currentActiveTab,
  onTabChange,
  className = '',
}) => {
  const { navigate, currentUser, logout, groups } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(
    currentActiveTab || 'beranda'
  );

  // Sync active tab if passed from parent
  useEffect(() => {
    if (currentActiveTab) {
      setActiveTab(currentActiveTab);
    }
  }, [currentActiveTab]);

  // Scroll spy for public & home pages to automatically update the glowing indicator
  useEffect(() => {
    if (variant === 'login') return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      const sections =
        variant === 'public'
          ? [
              { id: 'jejak', el: document.getElementById('jejak') },
              { id: 'kelompok', el: document.getElementById('kelompok') },
              { id: 'alur', el: document.getElementById('alur') },
              { id: 'beranda', el: document.body },
            ]
          : [
              { id: 'jejak', el: document.getElementById('jejak') },
              { id: 'alur', el: document.getElementById('alur') },
              { id: 'beranda', el: document.body },
            ];

      for (const section of sections) {
        if (section.el) {
          const top = section.el.offsetTop;
          if (scrollPosition >= top) {
            setActiveTab(section.id);
            if (onTabChange) onTabChange(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [variant, onTabChange]);

  const handleNavClick = (id: string, targetAnchor?: string) => {
    setActiveTab(id);
    if (onTabChange) onTabChange(id);
    setMobileMenuOpen(false);

    if (id === 'beranda') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const anchor = targetAnchor || id;
    const el = document.getElementById(anchor);
    if (el) {
      const yOffset = -96; // Offset for floating pill navbar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await logout();
  };

  // User detail helpers
  const userGroupNum = currentUser?.groupNumber
    ? formatGroupNumber(currentUser.groupNumber)
    : '03';
  const shortLeaderName = currentUser?.name
    ? currentUser.name.split(' ')[0]
    : 'Ketua';

  // ════════════════════════════════════════════════════════════════════════════
  // 1. VARIANT: LOGIN PAGE NAVBAR
  // ════════════════════════════════════════════════════════════════════════════
  if (variant === 'login') {
    return (
      <header className={`sticky top-4 z-50 w-full max-w-5xl mx-auto px-4 ${className}`}>
        <div className="rounded-full bg-[#141416]/95 backdrop-blur-md border border-white/10 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.28)] px-5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between transition-all">
          {/* Back to Home CTA */}
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-300 hover:text-white transition-colors cursor-pointer group"
          >
            <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:-translate-x-0.5 transition-transform">
              <ArrowLeft className="w-3.5 h-3.5 text-zinc-300 group-hover:text-white" />
            </span>
            <span className="uppercase text-[11px] sm:text-xs">Kembali ke Beranda</span>
          </button>

          {/* Right Brand Badge */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#E50914] text-white flex items-center justify-center font-black text-xs shadow-[0_0_12px_rgba(229,9,20,0.4)]">
              SM
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white">
                #SKOMDA
              </span>
              <span className="bg-[#E50914]/20 text-[#E50914] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#E50914]/30">
                2026
              </span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Define nav links for public vs home
  const publicLinks = [
    { id: 'beranda', label: 'BERANDA', anchor: 'hero' },
    { id: 'alur', label: 'ALUR PROGRES', anchor: 'alur' },
    { id: 'kelompok', label: 'KELOMPOK', anchor: 'kelompok' },
    { id: 'jejak', label: 'REKAM JEJAK', anchor: 'jejak' },
  ];

  const homeLinks = [
    { id: 'beranda', label: 'BERANDA', anchor: 'hero' },
    { id: 'alur', label: 'ALUR PROGRES', anchor: 'alur' },
    { id: 'jejak', label: 'REKAM JEJAK', anchor: 'jejak' },
  ];

  const currentLinks = variant === 'public' ? publicLinks : homeLinks;

  // ════════════════════════════════════════════════════════════════════════════
  // 2. VARIANT: PUBLIC (/) & POST-LOGIN HOME (/home) NAVBAR
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <header className={`sticky top-4 z-50 w-full max-w-5xl mx-auto px-4 ${className}`}>
      {/* ─── FLOATING DARK CAPSULE PILL ─── */}
      <div className="rounded-full bg-[#141416]/95 backdrop-blur-md border border-white/10 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.28)] px-5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between transition-all">
        {/* Left: Compact #SKOMDA Logo Badge */}
        <button
          onClick={() => handleNavClick('beranda')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0 text-left"
        >
          <div className="w-8 h-8 rounded-full bg-[#E50914] text-white flex items-center justify-center font-black text-xs shadow-[0_0_12px_rgba(229,9,20,0.4)] group-hover:scale-105 transition-transform">
            SM
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-red-400 transition-colors">
              #SKOMDA
            </span>
            <span className="bg-[#E50914]/20 text-[#E50914] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#E50914]/40">
              2026
            </span>
          </div>
        </button>

        {/* Center: Glowing Active Indicator Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {currentLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id, link.anchor)}
                className={`relative px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-300 rounded-full cursor-pointer select-none ${
                  isActive
                    ? 'text-white font-bold bg-gradient-to-t from-[#E50914]/25 via-[#E50914]/5 to-transparent'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>

                {/* Crimson Red Bottom Glow Bar on Active Item */}
                {isActive && (
                  <span className="absolute -bottom-2 sm:-bottom-2.5 left-1/2 -translate-x-1/2 h-[3px] w-7 rounded-full bg-[#E50914] shadow-[0_0_12px_#E50914] animate-in fade-in zoom-in duration-200" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA / Session Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          {variant === 'public' ? (
            /* Pre-Login CTA */
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E50914] hover:bg-[#b4000c] text-white transition-all shadow-[0_0_14px_rgba(229,9,20,0.45)] hover:shadow-[0_0_20px_rgba(229,9,20,0.65)] hover:scale-[1.02] cursor-pointer"
            >
              <span>Login <span className="hidden sm:inline">Ketua / Admin</span></span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            /* Post-Login Session Actions */
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Compact User Badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-zinc-200 text-[11px]">
                  KEL-{userGroupNum} • {shortLeaderName}
                </span>
              </div>

              {/* Quick Red Pill to Dashboard */}
              <button
                onClick={() => navigate('/dashboard/ketua')}
                className="inline-flex items-center gap-1 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E50914] hover:bg-[#b4000c] text-white transition-all shadow-[0_0_12px_rgba(229,9,20,0.4)] hover:shadow-[0_0_16px_rgba(229,9,20,0.6)] cursor-pointer"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Subtle Logout Icon Button */}
              <button
                onClick={handleLogout}
                title="Keluar Akun"
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors border border-white/5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Mobile Menu Trigger (< md) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ─── MOBILE EXPANDED MENU DRAWER (COMPACT FLOATING DARK CARD) ─── */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 w-full rounded-2xl bg-[#141416]/98 backdrop-blur-xl border border-white/10 p-4 shadow-2xl flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200 text-xs">
          {variant === 'home' && (
            <div className="flex items-center justify-between pb-2 mb-1 border-b border-white/10 text-zinc-300">
              <span className="font-bold">
                Ketua KEL-{userGroupNum} • {currentUser?.name}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase">Aktif</span>
            </div>
          )}

          {currentLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id, link.anchor)}
                className={`w-full py-2.5 px-3 rounded-xl text-left text-xs font-semibold uppercase tracking-wider flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-[#E50914]/20 text-white font-bold border-l-2 border-[#E50914]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />}
              </button>
            );
          })}

          <div className="pt-2 border-t border-white/10 flex gap-2 mt-1">
            {variant === 'public' ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full py-2.5 rounded-xl text-center font-bold text-xs uppercase tracking-wider bg-[#E50914] text-white cursor-pointer shadow-md"
              >
                Login Ketua / Admin
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/dashboard/ketua');
                  }}
                  className="flex-1 py-2 rounded-xl text-center font-bold text-xs uppercase tracking-wider bg-[#E50914] text-white cursor-pointer"
                >
                  Buka Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2 rounded-xl text-center font-bold text-xs uppercase tracking-wider bg-white/10 text-zinc-300 hover:text-white cursor-pointer"
                >
                  Keluar
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// 3. DARK PILL STAGE SWITCHER FOR BENTO WORKSPACE (/dashboard/ketua)
// ════════════════════════════════════════════════════════════════════════════
export interface DarkStagePillSwitcherProps {
  activeStage?: number;
  viewStage?: number;
  onSelectStage?: (stage: number) => void;
  className?: string;
}

export const DarkStagePillSwitcher: React.FC<DarkStagePillSwitcherProps> = ({
  activeStage = 4,
  viewStage = 4,
  onSelectStage,
  className = '',
}) => {
  return (
    <div
      className={`rounded-full bg-[#141416]/95 backdrop-blur-md border border-white/10 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.28)] p-1.5 flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-full scrollbar-none ${className}`}
    >
      {[1, 2, 3, 4, 5, 6].map((stageNum) => {
        const isPast = stageNum < activeStage;
        const isCurrent = stageNum === activeStage;
        const isSelectedView = viewStage === stageNum;

        // 1. Completed Stages (01–03): Crisp light text with green checkmark icon
        if (isPast) {
          return (
            <button
              key={stageNum}
              onClick={() => onSelectStage && onSelectStage(stageNum)}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap text-xs font-semibold ${
                isSelectedView
                  ? 'bg-emerald-600/90 text-white shadow-xs font-extrabold ring-1 ring-emerald-400/50'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
              title={`Tahap 0${stageNum} Selesai • Klik untuk melihat arsip`}
            >
              <Check className={`w-3.5 h-3.5 ${isSelectedView ? 'text-white' : 'text-emerald-400'}`} />
              <span>Tahap 0{stageNum}</span>
            </button>
          );
        }

        // 2. Active Stage (04): Bright white text with the Crimson Red bottom glow bar
        if (isCurrent) {
          return (
            <button
              key={stageNum}
              onClick={() => onSelectStage && onSelectStage(stageNum)}
              className={`relative px-3.5 py-1.5 rounded-full flex items-center gap-1.5 font-extrabold text-xs transition-all cursor-pointer whitespace-nowrap ${
                isSelectedView
                  ? 'text-white bg-gradient-to-t from-[#E50914]/30 via-[#E50914]/10 to-transparent'
                  : 'text-zinc-200 hover:text-white bg-white/5'
              }`}
              title={`Tahap 0${stageNum} Sedang Berjalan (Fase Aktif)`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse" />
              <span>Tahap 0{stageNum}</span>

              {/* Crimson Red bottom glow bar */}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[3px] w-7 rounded-full bg-[#E50914] shadow-[0_0_12px_#E50914]" />
            </button>
          );
        }

        // 3. Locked Future Stages (05–06): Muted text-zinc-600 with a small Lock icon
        return (
          <button
            key={stageNum}
            disabled
            tabIndex={-1}
            className="px-3 py-1.5 rounded-full text-zinc-600 cursor-not-allowed pointer-events-none flex items-center gap-1.5 text-xs font-medium select-none whitespace-nowrap"
            title={`Tahap 0${stageNum} Terkunci (Selesaikan tahap sebelumnya)`}
          >
            <Lock className="w-3 h-3 text-zinc-600" />
            <span>Tahap 0{stageNum}</span>
          </button>
        );
      })}
    </div>
  );
};
