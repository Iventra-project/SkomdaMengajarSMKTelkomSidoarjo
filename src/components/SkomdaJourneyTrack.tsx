import React from 'react';
import {
  Users,
  UserCheck,
  BookOpen,
  Palette,
  GraduationCap,
  CheckCircle2,
} from 'lucide-react';

export interface JourneyStep {
  num: number;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    num: 1,
    label: 'Bentuk kelompok',
    subtitle: 'Penentuan anggota tim',
    icon: Users,
  },
  {
    num: 2,
    label: 'Pilih ketua',
    subtitle: 'Koordinator lapangan',
    icon: UserCheck,
  },
  {
    num: 3,
    label: 'Susun materi',
    subtitle: 'Modul & silabus ajar',
    icon: BookOpen,
  },
  {
    num: 4,
    label: 'Siapkan desain',
    subtitle: 'Media visual & slide',
    icon: Palette,
  },
  {
    num: 5,
    label: 'Mengajar di SMP',
    subtitle: 'Sesi kelas interaktif',
    icon: GraduationCap,
  },
  {
    num: 6,
    label: 'Laporan & feedback',
    subtitle: 'Refleksi & publikasi',
    icon: CheckCircle2,
  },
];

interface SkomdaJourneyTrackProps {
  currentActiveStep?: number; // default: 2 (as in reference UI)
  selectedStep?: number;
  onSelectStep?: (step: number) => void;
  activePhaseTitle?: string;
  className?: string;
  showCardWrapper?: boolean;
}

export const SkomdaJourneyTrack: React.FC<SkomdaJourneyTrackProps> = ({
  currentActiveStep = 2,
  selectedStep,
  onSelectStep,
  activePhaseTitle = 'Fase Aktif: Pembentukan Ketua Tim',
  className = '',
  showCardWrapper = true,
}) => {
  const activeStep = selectedStep !== undefined ? selectedStep : currentActiveStep;

  const content = (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 sm:pb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0B1B3A] tracking-tight">
            Alur & Progres Skomda Mengajar
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Tahapan terstruktur dari pembentukan tim hingga evaluasi luaran nyata di sekolah mitra.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-200 bg-red-50/70 text-[#E50914] text-xs font-bold shrink-0 self-start sm:self-auto shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
          <span>{activePhaseTitle}</span>
        </div>
      </div>

      {/* Undulating Sinusoidal Wave Track */}
      <div className="pt-2 pb-4 overflow-x-auto select-none scrollbar-none">
        <div className="min-w-[880px] relative h-[230px]">
          {/* Background SVG Dashed Track (sinusoidal cubic bezier wave) */}
          <svg
            className="absolute top-0 left-0 w-full h-[170px] pointer-events-none"
            viewBox="0 0 1000 170"
            preserveAspectRatio="none"
            fill="none"
          >
            {/* Segment 0: Step 1 (83.33, 50) -> Step 2 (250, 120) */}
            <path
              d="M 83.33 50 C 166.67 50, 166.67 120, 250 120"
              stroke={activeStep >= 2 ? '#E50914' : '#CBD5E1'}
              strokeWidth="2.5"
              strokeDasharray="2 7"
              strokeLinecap="round"
            />
            {/* Segment 1: Step 2 (250, 120) -> Step 3 (416.67, 50) */}
            <path
              d="M 250 120 C 333.33 120, 333.33 50, 416.67 50"
              stroke={activeStep >= 3 ? '#E50914' : '#CBD5E1'}
              strokeWidth="2.5"
              strokeDasharray="2 7"
              strokeLinecap="round"
            />
            {/* Segment 2: Step 3 (416.67, 50) -> Step 4 (583.33, 120) */}
            <path
              d="M 416.67 50 C 500 50, 500 120, 583.33 120"
              stroke={activeStep >= 4 ? '#E50914' : '#CBD5E1'}
              strokeWidth="2.5"
              strokeDasharray="2 7"
              strokeLinecap="round"
            />
            {/* Segment 3: Step 4 (583.33, 120) -> Step 5 (750, 50) */}
            <path
              d="M 583.33 120 C 666.67 120, 666.67 50, 750 50"
              stroke={activeStep >= 5 ? '#E50914' : '#CBD5E1'}
              strokeWidth="2.5"
              strokeDasharray="2 7"
              strokeLinecap="round"
            />
            {/* Segment 4: Step 5 (750, 50) -> Step 6 (916.67, 120) */}
            <path
              d="M 750 50 C 833.33 50, 833.33 120, 916.67 120"
              stroke={activeStep >= 6 ? '#E50914' : '#CBD5E1'}
              strokeWidth="2.5"
              strokeDasharray="2 7"
              strokeLinecap="round"
            />
          </svg>

          {/* 6 Grid Nodes */}
          <div className="absolute inset-0 grid grid-cols-6 w-full">
            {JOURNEY_STEPS.map((step, idx) => {
              const isEven = idx % 2 === 1; // 0, 2, 4 are top (pt-4 -> center Y=50); 1, 3, 5 are bottom (pt-[86px] -> center Y=120)
              const isCompleted = step.num < activeStep;
              const isActive = step.num === activeStep;
              const isFinish = step.num === 6;
              const IconComp = step.icon;

              return (
                <div
                  key={step.num}
                  onClick={() => onSelectStep && onSelectStep(step.num)}
                  className={`flex flex-col items-center text-center group select-none ${
                    onSelectStep ? 'cursor-pointer' : ''
                  } ${isEven ? 'pt-[86px]' : 'pt-4'}`}
                >
                  {/* Card Squircle */}
                  <div
                    className={`w-[68px] h-[68px] rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300 group-hover:-translate-y-1 ${
                      isCompleted
                        ? 'bg-[#E50914] text-white shadow-lg shadow-red-600/25'
                        : isActive
                        ? 'bg-white border-2 border-[#E50914] text-[#E50914] shadow-lg shadow-red-500/15 ring-4 ring-red-50/70'
                        : 'bg-white border border-slate-200/90 text-slate-500 shadow-2xs hover:border-slate-300'
                    }`}
                  >
                    {/* Tilted Finish Badge for Step 6 */}
                    {isFinish && (
                      <span className="absolute -top-3 -right-2.5 bg-[#E50914] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-xs rotate-[-8deg] pointer-events-none">
                        FINISH
                      </span>
                    )}

                    {/* Step Number */}
                    <span
                      className={`text-[10px] font-black tracking-wider leading-none mb-1 ${
                        isCompleted
                          ? 'text-white/90'
                          : isActive
                          ? 'text-[#E50914]'
                          : 'text-slate-400'
                      }`}
                    >
                      0{step.num}
                    </span>

                    {/* Step Icon */}
                    <IconComp
                      className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                        isCompleted
                          ? 'text-white'
                          : isActive
                          ? 'text-[#E50914]'
                          : 'text-slate-600'
                      }`}
                    />
                  </div>

                  {/* Labels below Card */}
                  <div className="mt-3 px-1">
                    <h4
                      className={`text-xs sm:text-sm font-bold leading-tight transition-colors ${
                        isActive
                          ? 'text-[#E50914]'
                          : isCompleted
                          ? 'text-[#0B1B3A]'
                          : 'text-[#0B1B3A] group-hover:text-[#E50914]'
                      }`}
                    >
                      {step.label}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium leading-tight">
                      {step.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );

  if (!showCardWrapper) {
    return <div className={className}>{content}</div>;
  }

  return (
    <div
      className={`bg-white border border-[#E8ECF2] rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden ${className}`}
    >
      {content}
    </div>
  );
};
