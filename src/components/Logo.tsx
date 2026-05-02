"use client";

export function LogoIcon({ size = 40 }: { size?: number }) {
  return (
    <img
      src="/icons/logo.png"
      alt="30 Day SWC"
      width={size}
      height={size}
      className="rounded-xl"
      style={{ width: size, height: size, objectFit: "cover" }}
    />
  );
}
