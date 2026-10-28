import React from 'react';

interface BangladeshPostLogoProps {
  size?: number;
  className?: string;
}

/**
 * Official Bangladesh Post Office (বাংলাদেশ ডাক বিভাগ) Logo
 * Using the authentic official emblem provided by the institute:
 * Red circular seal with "সেবাই আদর্শ" on top, iconic Postal Runner in center,
 * and "বাংলাদেশ ডাক বিভাগ" on the lower scroll banner.
 */
export const BangladeshPostLogo: React.FC<BangladeshPostLogoProps> = ({
  size = 48,
  className = '',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
      title="বাংলাদেশ ডাক বিভাগ (Bangladesh Post Office)"
    >
      <img
        src="/assets/aistudio/images_69849cd4.png"
        alt="বাংলাদেশ ডাক বিভাগ"
        className="w-full h-full object-contain filter drop-shadow-xs"
        loading="lazy"
      />
    </div>
  );
};
