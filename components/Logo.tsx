
import React from 'react';

const HourglassIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 22h14" />
    <path d="M5 2h14" />
    <path d="M17 2v2.34c0 1.5-1.01 2.74-2.43 3.12L12 8.5l-2.57-1.04C7.99 7.08 7 5.84 7 4.34V2" />
    <path d="M7 22v-2.34c0-1.5 1.01-2.74 2.43-3.12L12 15.5l2.57 1.04c1.42.38 2.43 1.62 2.43 3.12V22" />
    <path d="M12 15.5V8.5" />
    <circle cx="12" cy="12.5" r="0.5" />
    <path d="M10.5 11q.5-1 1.5-1t1.5 1" />
    <path d="M10 5.5q.5-1 2-1t2 1" />
  </svg>
);


interface LogoProps {
    isCompact?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ isCompact = false }) => {
  if (isCompact) {
    return (
        <div className="flex items-center space-x-2 text-white filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
            <HourglassIcon className="w-6 h-6" />
            <span className="text-xl tracking-widest">TIMELINE ALCHEMY</span>
        </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 text-white select-none">
      <div className="filter drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">
        <HourglassIcon className="w-24 h-24 mb-4" />
      </div>
      <h1 className="text-5xl md:text-6xl font-semibold tracking-[0.3em] filter drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
        TIMELINE
      </h1>
      <h2 className="text-5xl md:text-6xl font-semibold tracking-[0.2em] filter drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
        ALCHEMY
      </h2>
    </div>
  );
};
