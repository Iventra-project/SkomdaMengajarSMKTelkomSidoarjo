import React from 'react';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<BrandLogoProps['size']>, string> = {
  xs: 'h-6',
  sm: 'h-8',
  md: 'h-9',
  lg: 'h-14',
};

/**
 * Shared "#SKOMDA MENGAJAR" brand logo image used across all pages, navbars, and modals.
 * - `variant="light"` (default): dark "#SKOMDA" text + red "MENGAJAR" bar for light/white surfaces.
 * - `variant="dark"`: white "#SKOMDA" text + red "MENGAJAR" bar for dark surfaces (e.g. dark Navbar).
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'light',
  className = '',
}) => {
  const src =
    variant === 'dark' ? '/logo-skomda-mengajar.png' : '/logo-skomda-mengajar-dark.png';

  return (
    <img
      src={src}
      alt="#SKOMDA MENGAJAR"
      className={`w-auto object-contain select-none shrink-0 ${SIZE_CLASSES[size]} ${className}`.trim()}
      draggable={false}
    />
  );
};
