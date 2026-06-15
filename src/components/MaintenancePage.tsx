"use client";

const MAINTENANCE_END = new Date("2026-06-29T00:00:00Z");

export default function MaintenancePage() {
  const now = new Date();
  if (now >= MAINTENANCE_END) return null;

  const diff = MAINTENANCE_END.getTime() - now.getTime();
  const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 px-6 text-center">
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-sm w-full">
        {/* Icon */}
        <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
          <svg className="w-9 h-9 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l5.653-4.655m5.8-3.8a8.25 8.25 0 1 0-11.31 0" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
          Under Maintenance
        </h1>

        {/* Message */}
        <p className="text-slate-400 text-base leading-relaxed mb-6">
          Sorry, we&rsquo;re currently down for scheduled maintenance. We&rsquo;ll be back better than ever very soon!
        </p>

        {/* Countdown pill */}
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 text-sm font-semibold text-slate-300">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          Back in approximately {daysLeft} day{daysLeft !== 1 ? "s" : ""}
        </div>

        {/* Sub-note */}
        <p className="mt-8 text-xs text-slate-600">
          Expected back: 29 June 2026
        </p>
      </div>
    </div>
  );
}
