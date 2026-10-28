import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { BangladeshPostLogo } from './BangladeshPostLogo.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

interface PostOfficeAffiliationBadgeProps {
  className?: string;
  variant?: 'full' | 'compact' | 'card';
  onClick?: () => void;
}

export const PostOfficeAffiliationBadge: React.FC<PostOfficeAffiliationBadgeProps> = ({
  className = '',
  variant = 'full',
  onClick,
}) => {
  const { language, trans } = useLanguage();
  const isEn = language === 'en';

  if (variant === 'compact') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-50 via-white to-amber-50 border border-emerald-300 shadow-xs hover:border-emerald-500 transition-all font-bengali ${
          onClick ? 'cursor-pointer hover:shadow-sm' : ''
        } ${className}`}
      >
        <BangladeshPostLogo size={24} />
        <span className="text-xs font-bold text-emerald-950 tracking-normal">
          {isEn
            ? 'Under Bangladesh Post Office'
            : 'বাংলাদেশ ডাক বিভাগের আওতাধীন পরিচালিত'}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`relative group inline-flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 px-4 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-stone-50 via-white to-amber-50/70 border-2 border-emerald-600/40 hover:border-emerald-600 shadow-md hover:shadow-lg transition-all duration-300 font-bengali text-left ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      title={
        isEn
          ? 'Affiliated with Bangladesh Post Office'
          : 'বাংলাদেশ ডাক বিভাগের আওতাধীন অনুমোদিত প্রতিষ্ঠান'
      }
    >
      {/* Decorative Corner Accents */}
      <div className="absolute top-1.5 left-2 w-1.5 h-1.5 rounded-full bg-emerald-600/60" />
      <div className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-amber-600/60" />
      <div className="absolute bottom-1.5 left-2 w-1.5 h-1.5 rounded-full bg-emerald-600/60" />
      <div className="absolute bottom-1.5 right-2 w-1.5 h-1.5 rounded-full bg-amber-600/60" />

      {/* Official Bangladesh Post Office Logo */}
      <div className="shrink-0 relative group-hover:scale-105 transition-transform duration-300">
        <BangladeshPostLogo size={56} />
        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-2 ring-white shadow-xs">
          <CheckCircle2 className="w-3 h-3 text-white" />
        </span>
      </div>

      {/* Text Hierarchy responding dynamically to Language selection */}
      <div className="flex flex-col text-center sm:text-left">
        {/* Top Kicker */}
        <div className="flex items-center justify-center sm:justify-start space-x-1.5 text-[11px] font-semibold text-emerald-800 uppercase tracking-wide">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>
            {isEn
              ? 'Govt. of Bangladesh Approved'
              : 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত'}
          </span>
          <span className="text-stone-300">·</span>
          <span className="text-amber-700 font-bold">
            {isEn ? 'Official Affiliation' : 'বাংলাদেশ ডাক বিভাগ'}
          </span>
        </div>

        {/* Primary Heading */}
        <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug tracking-normal mt-0.5">
          {isEn
            ? 'Under Bangladesh Post Office'
            : 'বাংলাদেশ ডাক বিভাগের আওতাধীন পরিচালিত'}
        </h3>

        {/* Secondary English & Curriculum Badge */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-0.5 text-xs text-stone-600 mt-0.5">
          <span className="font-semibold text-stone-700">
            {isEn
              ? 'Bangladesh Post Office Affiliated Institute'
              : 'Under Bangladesh Post Office · Affiliated'}
          </span>
          <span className="hidden sm:inline text-stone-400">·</span>
          <span className="text-[11px] bg-emerald-100 text-emerald-900 font-semibold px-2 py-0.2 rounded">
            {isEn
              ? 'Computer Office Application (3 & 6 Months)'
              : 'কম্পিউটার অফিস অ্যাপ্লিকেশন ৩ ও ৬ মাস'}
          </span>
        </div>
      </div>
    </div>
  );
};
