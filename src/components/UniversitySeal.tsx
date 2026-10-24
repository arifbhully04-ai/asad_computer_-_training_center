import React from 'react';

interface UniversitySealProps {
  className?: string;
  size?: number;
}

export const UniversitySeal: React.FC<UniversitySealProps> = ({
  className = '',
  size = 72,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      title="Asad Computer & Training Center Seal"
    >
      <svg
        viewBox="0 0 160 160"
        className="w-full h-full text-white/90 drop-shadow-md transition-transform duration-300 hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer concentric beaded / dashed ring */}
        <circle
          cx="80"
          cy="80"
          r="76"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="2 3"
          className="opacity-70"
        />
        
        {/* Outer solid rim */}
        <circle
          cx="80"
          cy="80"
          r="72"
          stroke="currentColor"
          strokeWidth="1.5"
          className="opacity-90"
        />

        {/* Inner concentric boundary ring */}
        <circle
          cx="80"
          cy="80"
          r="54"
          stroke="currentColor"
          strokeWidth="1.2"
          className="opacity-80"
        />

        {/* Circular text path for Asad Computer & Training Center */}
        <path
          id="upperArc"
          d="M 22 80 A 58 58 0 0 1 138 80"
          fill="none"
        />
        <text
          fill="currentColor"
          fontSize="7.2"
          fontWeight="700"
          letterSpacing="1.2"
          className="font-cinzel uppercase opacity-95"
        >
          <textPath href="#upperArc" startOffset="50%" textAnchor="middle">
            ASAD COMPUTER & TRAINING
          </textPath>
        </text>

        <path
          id="lowerArc"
          d="M 138 80 A 58 58 0 0 1 22 80"
          fill="none"
        />
        <text
          fill="currentColor"
          fontSize="6.8"
          fontWeight="600"
          letterSpacing="1.8"
          className="font-cinzel uppercase opacity-90"
        >
          <textPath href="#lowerArc" startOffset="50%" textAnchor="middle">
            EST. 2015 • DIGITAL SKILLS
          </textPath>
        </text>

        {/* Side decorative stars */}
        <circle cx="23" cy="80" r="1.5" fill="currentColor" opacity="0.8" />
        <circle cx="137" cy="80" r="1.5" fill="currentColor" opacity="0.8" />

        {/* Center Shield background */}
        <path
          d="M 60 48 L 100 48 C 100 48 102 76 80 94 C 58 76 60 48 60 48 Z"
          fill="rgba(0, 0, 0, 0.25)"
          stroke="currentColor"
          strokeWidth="1.5"
        />

        {/* Inner shield border */}
        <path
          d="M 63 51 L 97 51 C 97 51 98.5 73.5 80 89.5 C 61.5 73.5 63 51 63 51 Z"
          stroke="currentColor"
          strokeWidth="0.8"
          opacity="0.6"
        />

        {/* Computer Screen Icon inside Shield */}
        <rect
          x="68"
          y="56"
          width="24"
          height="16"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="currentColor"
          fillOpacity="0.2"
        />
        {/* Screen inner lines representing Office doc / code */}
        <line x1="72" y1="61" x2="84" y2="61" stroke="currentColor" strokeWidth="0.8" opacity="0.9" />
        <line x1="72" y1="64" x2="88" y2="64" stroke="currentColor" strokeWidth="0.8" opacity="0.9" />
        <line x1="72" y1="67" x2="80" y2="67" stroke="currentColor" strokeWidth="0.8" opacity="0.9" />

        {/* Monitor stand & base */}
        <path d="M 78 72 L 82 72 L 82 75 L 78 75 Z" fill="currentColor" opacity="0.8" />
        <line x1="75" y1="75" x2="85" y2="75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />

        {/* Laurel branches under shield */}
        <path
          d="M 68 98 C 73 99 76 96 80 95 C 84 96 87 99 92 98"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.75"
        />
      </svg>
    </div>
  );
};
