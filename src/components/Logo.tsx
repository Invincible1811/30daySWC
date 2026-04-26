"use client";

export function LogoIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0c1a3a"/>
          <stop offset="40%" stopColor="#1E3A8A"/>
          <stop offset="100%" stopColor="#2563EB"/>
        </linearGradient>
        <linearGradient id="logoCross" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE68A"/>
          <stop offset="100%" stopColor="#F59E0B"/>
        </linearGradient>
        <linearGradient id="logoFlame" x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor="#F59E0B"/>
          <stop offset="50%" stopColor="#FBBF24"/>
          <stop offset="100%" stopColor="#FDE68A"/>
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="108" fill="url(#logoBg)"/>
      <circle cx="256" cy="230" r="120" fill="#3B82F6" opacity="0.12"/>
      <rect x="242" y="110" width="28" height="180" rx="14" fill="url(#logoCross)"/>
      <rect x="192" y="146" width="128" height="28" rx="14" fill="url(#logoCross)"/>
      <path d="M256 330 C256 330 220 356 220 382 C220 404 236 416 256 416 C276 416 292 404 292 382 C292 356 256 330 256 330Z" fill="url(#logoFlame)" opacity="0.9"/>
    </svg>
  );
}
