import React from 'react';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<BrandLogoProps['size']>, { tag: string; pill: string; gap: string }> = {
  xs: {
    tag: 'text-[11px]',
    pill: 'text-[9px] px-2 py-0.5',
    gap: 'gap-1.5',
  },
  sm: {
    tag: 'text-base',
    pill: 'text-[9px] px-2 py-0.5',
    gap: 'gap-1.5',
  },
  md: {
    tag: 'text-lg',
    pill: 'text-[10px] px-2.5 py-0.5',
    gap: 'gap-1.5',
  },
  lg: {
    tag: 'text-3xl',
    pill: 'text-base px-3.5 py-1 shadow-xs',
    gap: 'gap-2 flex-wrap',
  },
};

/**
 * Shared tilted "#SKOMDA MENGAJAR" brand logo used across all pages and modals.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className = '' }) => {
  const styles = SIZE_CLASSES[size];

  return (
    <span className={`inline-flex items-center ${styles.gap} ${className}`.trim()}>
      <span
        className={`${styles.tag} font-extrabold text-slate-900 tracking-tight transform -rotate-3 origin-bottom-left select-none italic`}
      >
        #SKOMDA
      </span>
      <span
        className={`bg-[#e20113] text-white ${styles.pill} font-extrabold uppercase rounded-full transform -rotate-3 origin-center inline-block tracking-wider select-none`}
      >
        MENGAJAR
      </span>
    </span>
  );
};
