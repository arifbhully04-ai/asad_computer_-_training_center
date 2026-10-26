import React from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export interface ApplicationStatusBadgeProps {
  status?: 'Processing' | 'Ready' | 'Completed' | string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showSubtext?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
  adminActionLabel?: string;
}

export const isApplicationCompleted = (status?: string): boolean => {
  if (!status) return false;
  const s = status.toLowerCase();
  return s === 'completed' || s === 'ready' || s === 'সম্পন্ন';
};

export const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({
  status,
  size = 'md',
  showSubtext = false,
  interactive = false,
  onClick,
  className = '',
  adminActionLabel,
}) => {
  const completed = isApplicationCompleted(status);

  // Size configurations
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px] gap-1',
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-xs sm:text-[13px] gap-2',
    lg: 'px-4 py-2 text-sm sm:text-base gap-2.5 font-bold',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (completed) {
    return (
      <div className={`inline-flex flex-col items-start ${className}`}>
        <span
          onClick={interactive ? onClick : undefined}
          title={interactive ? 'ক্লিক করে স্ট্যাটাস পরিবর্তন করুন' : 'এডমিন কর্তৃক যাচাই ও আবেদন সম্পন্ন করা হয়েছে'}
          className={`inline-flex items-center font-bold rounded-full border transition-all duration-200 shadow-2xs ${
            sizeClasses[size]
          } ${
            interactive
              ? 'bg-emerald-100/90 text-emerald-900 border-emerald-400 hover:bg-emerald-200 hover:border-emerald-500 cursor-pointer active:scale-98 ring-2 ring-emerald-500/20'
              : 'bg-emerald-50 text-emerald-900 border-emerald-300 ring-1 ring-emerald-500/15'
          }`}
        >
          <span className="relative flex shrink-0">
            <CheckCircle2 className={`${iconSizes[size]} text-emerald-600 shrink-0`} />
            <span className="sr-only">Completed</span>
          </span>
          <span className="tracking-tight">আবেদন সম্পন্ন</span>
          <span className="font-semibold text-emerald-700/90 text-[11px] uppercase tracking-wider font-mono">
            (Completed)
          </span>
          {adminActionLabel && (
            <span className="text-[10px] bg-emerald-200/80 text-emerald-950 px-1.5 py-0.2 rounded font-normal ml-0.5">
              {adminActionLabel}
            </span>
          )}
        </span>
        {showSubtext && (
          <span className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center space-x-1 pl-1">
            <span>✓ এডমিন কর্তৃক সম্পন্ন ও অনুমোদিত</span>
          </span>
        )}
      </div>
    );
  }

  // Processing state (Default for newly applied jobs)
  return (
    <div className={`inline-flex flex-col items-start ${className}`}>
      <span
        onClick={interactive ? onClick : undefined}
        title={interactive ? 'ক্লিক করে সম্পন্ন করুন' : 'আবেদনটি বর্তমানে এডমিন কর্তৃক যাচাই ও প্রক্রিয়াধীন অবস্থায় রয়েছে'}
        className={`inline-flex items-center font-bold rounded-full border transition-all duration-200 shadow-2xs ${
          sizeClasses[size]
        } ${
          interactive
            ? 'bg-amber-100/95 text-amber-950 border-amber-400 hover:bg-amber-200 hover:border-amber-500 cursor-pointer active:scale-98 ring-2 ring-amber-500/20'
            : 'bg-amber-50 text-amber-900 border-amber-300 ring-1 ring-amber-500/15'
        }`}
      >
        <span className="relative flex shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60"></span>
          <Clock className={`${iconSizes[size]} text-amber-700 shrink-0 relative`} />
        </span>
        <span className="tracking-tight">প্রক্রিয়াধীন</span>
        <span className="font-semibold text-amber-800/90 text-[11px] uppercase tracking-wider font-mono">
          (Processing)
        </span>
        {adminActionLabel && (
          <span className="text-[10px] bg-amber-200/80 text-amber-950 px-1.5 py-0.2 rounded font-normal ml-0.5">
            {adminActionLabel}
          </span>
        )}
      </span>
      {showSubtext && (
        <span className="text-[11px] text-amber-700 font-medium mt-1 flex items-center space-x-1 pl-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          <span>এডমিন যাচাই করছেন · সম্পন্ন হলে আপডেট হবে</span>
        </span>
      )}
    </div>
  );
};
