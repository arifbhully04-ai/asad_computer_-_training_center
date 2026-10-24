import React from 'react';

interface SignatureProps {
  className?: string;
}

export const SignatureSvg: React.FC<SignatureProps> = ({ className = '' }) => {
  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
      {/* Authentic flowing handwritten SVG signature */}
      <svg
        viewBox="0 0 280 90"
        className="w-48 h-16 sm:w-56 sm:h-20 text-stone-700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Chancellor's Signature"
      >
        {/* Main signature stroke - flowing penmanship */}
        <path
          d="M 35 48 C 38 32 46 22 55 24 C 64 26 62 44 58 58 C 55 68 53 72 49 71 C 45 70 47 52 56 42 C 65 32 78 35 84 46 C 90 57 88 66 94 66 C 100 66 106 50 114 48 C 122 46 126 56 134 52 C 142 48 147 43 156 45 C 165 47 167 56 176 53 C 185 50 193 41 199 44 C 205 47 202 59 208 57 C 214 55 220 46 226 48 C 232 50 238 60 248 56"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-85"
        />

        {/* First initial loop & dot */}
        <path
          d="M 28 36 C 30 26 38 20 42 22 C 45 23 44 32 39 37"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="68" cy="28" r="1.5" fill="currentColor" opacity="0.8" />

        {/* Flourishing horizontal underline with loop taper */}
        <path
          d="M 60 74 C 95 72 145 71 185 72 C 205 72.5 228 73 242 70 C 235 66 220 64 212 68 C 218 72 232 73 245 72"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-75"
        />
      </svg>
    </div>
  );
};
