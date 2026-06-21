import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path d="M50 10 C30 10 15 25 15 45 C15 70 50 90 50 90 C50 90 85 70 85 45 C85 25 70 10 50 10 Z" fill="url(#leafGrad)" />
      <circle cx="50" cy="45" r="15" fill="white" fillOpacity="0.2" />
      <path d="M50 30 L50 60 M35 45 L65 45" stroke="white" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
};
export default Logo;
