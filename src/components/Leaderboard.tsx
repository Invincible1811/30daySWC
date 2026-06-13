"use client";

import { useState, useEffect } from "react";
import { Trophy, Flame, Users, TrendingUp } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

interface LeaderEntry {
  id: string;
  username: string;
  full_name: string;
  soul_count: number;
  completed_days: number[];
}

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"souls" | "streak">("souls");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    (async () => {
      // Fetch all profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, full_name, completed_days");

      if (!profiles) { setLoading(false); return; }

      // Fetch soul counts per user
      const { data: soulCounts } = await supabase
        .from("souls")
        .select("user_id");

      const countMap: Record<string, number> = {};
      (soulCounts || []).forEach((s: { user_id: string }) => {
        countMap[s.user_id] = (countMap[s.user_id] || 0) + 1;
      });

      const entries: LeaderEntry[] = (profiles as { id: string; username: string; full_name: string; completed_days: number[] }[]).map(p => ({
        id: p.id,
        username: p.username,
        full_name: p.full_name,
        soul_count: countMap[p.id] || 0,
        completed_days: p.completed_days || [],
      }));

      setLeaders(entries);
      setLoading(false);
    })();
  }, []);

  const getStreak = (days: number[]) => {
    if (!days || days.length === 0) return 0;
    const sorted = [...days].sort((a, b) => b - a);
    let streak = 1;
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i] - sorted[i + 1] === 1) streak++;
      else break;
    }
    return streak;
  };

  const sorted = [...leaders].sort((a, b) =>
    tab === "souls"
      ? b.soul_count - a.soul_count
      : getStreak(b.completed_days) - getStreak(a.completed_days)
  );

  const totalSouls = leaders.reduce((sum, l) => sum + l.soul_count, 0);
  const top3 = sorted.slice(0, 3);

  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;
  const podiumHeights = ["h-20", "h-28", "h-16"];
  const podiumColors = [
    { bg: "#C0C0C0", text: "#64748b", ring: "#e2e8f0" },
    { bg: "#F59E0B", text: "#92400e", ring: "#fde68a" },
    { bg: "#CD7F32", text: "#78350f", ring: "#fcd34d" },
  ];
  const podiumLabels = ["2nd", "1st", "3rd"];

  return (
    <div className="animate-fade-in space-y-5">

      {/* ── Hero Banner ── */}
      <div className="relative rounded-2xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a1200 0%, #3d2800 40%, #1a1200 100%)", boxShadow: "0 8px 40px rgba(245,158,11,0.2)" }}>
        {/* Shimmer lines */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute top-0 bottom-0 w-px opacity-10"
            style={{ left: `${15 + i * 14}%`, background: "linear-gradient(180deg, transparent, #F59E0B, transparent)" }} />
        ))}
        <div className="relative z-10 text-center px-6 py-7">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy size={28} style={{ color: "#F59E0B" }} />
            <h2 className="text-2xl font-black text-white tracking-wide">Global Impact Board</h2>
            <Trophy size={28} style={{ color: "#F59E0B" }} />
          </div>
          <p className="text-amber-300/60 text-sm">Every soul won echoes into eternity</p>
          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 mt-5">
            <div className="text-center">
              <p className="text-3xl font-black" style={{ color: "#F59E0B" }}>{leaders.length}</p>
              <p className="text-[11px] text-amber-200/50 uppercase tracking-widest">Soul Winners</p>
            </div>
            <div className="w-px h-10 bg-amber-400/20" />
            <div className="text-center">
              <p className="text-3xl font-black" style={{ color: "#F59E0B" }}>{totalSouls}</p>
              <p className="text-[11px] text-amber-200/50 uppercase tracking-widest">Souls Won</p>
            </div>
            <div className="w-px h-10 bg-amber-400/20" />
            <div className="text-center">
              <p className="text-3xl font-black" style={{ color: "#F59E0B" }}>
                {leaders.reduce((m, l) => Math.max(m, getStreak(l.completed_days)), 0)}
              </p>
              <p className="text-[11px] text-amber-200/50 uppercase tracking-widest">Top Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 p-1 rounded-xl bg-slate-100">
        <button onClick={() => setTab("souls")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === "souls" ? "bg-white text-amber-600 shadow-sm" : "text-slate-500"}`}>
          <Trophy size={14} /> Most Souls
        </button>
        <button onClick={() => setTab("streak")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === "streak" ? "bg-white text-orange-500 shadow-sm" : "text-slate-500"}`}>
          <Flame size={14} /> Longest Streak
        </button>
      </div>

      {/* ── Podium (top 3) ── */}
      {!loading && sorted.length >= 2 && (
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "linear-gradient(180deg, #1a1200 0%, #261900 100%)", border: "1px solid rgba(245,158,11,0.15)" }}>
          <p className="text-center text-[10px] font-bold text-amber-400/40 uppercase tracking-widest pt-4 pb-2">Top Performers</p>
          <div className="flex items-end justify-center gap-3 px-4 pb-0">
            {podiumOrder.map((entry, i) => {
              if (!entry) return null;
              const pc = podiumColors[i];
              const value = tab === "souls" ? entry.soul_count : getStreak(entry.completed_days);
              const isYou = entry.id === user?.id;
              return (
                <div key={entry.id} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black mb-1 ${isYou ? "ring-2 ring-offset-1 ring-blue-400" : ""}`}
                    style={{ background: pc.ring, color: pc.text }}>
                    {(entry.full_name || entry.username || "?")[0].toUpperCase()}
                  </div>
                  <p className="text-white text-[10px] font-bold text-center truncate w-full px-1">
                    {entry.full_name || entry.username || "Soul Winner"}
                    {isYou && <span className="text-blue-400"> ★</span>}
                  </p>
                  <p className="font-black text-sm" style={{ color: pc.bg }}>{value}</p>
                  <div className={`w-full ${podiumHeights[i]} rounded-t-xl flex items-start justify-center pt-2`}
                    style={{ background: `linear-gradient(180deg, ${pc.bg}cc, ${pc.bg}66)`, border: `1px solid ${pc.bg}50`, borderBottom: "none" }}>
                    <span className="text-xs font-black" style={{ color: pc.text }}>{podiumLabels[i]}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Gold base */}
          <div className="h-3 mx-0" style={{ background: "linear-gradient(90deg, #78350f, #F59E0B, #78350f)" }} />
        </div>
      )}

      {/* ── Full Rankings ── */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Full Rankings</h3>
        {loading ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 shadow-sm">
            <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm text-slate-500">Loading rankings...</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 shadow-sm">
            <Trophy size={36} className="mx-auto mb-2 text-slate-200" />
            <p className="font-semibold text-slate-500 text-sm">No rankings yet</p>
            <p className="text-slate-400 text-xs mt-1">Be the first to win a soul!</p>
          </div>
        ) : (
          sorted.map((entry, idx) => {
            const isYou = entry.id === user?.id;
            const value = tab === "souls" ? entry.soul_count : getStreak(entry.completed_days);
            const label = tab === "souls" ? "souls" : "day streak";
            const isTop = idx < 3;

            const rankStyle = idx === 0
              ? { bg: "#FFFBEB", border: "#FDE68A", num: "#D97706" }
              : idx === 1
              ? { bg: "#F8FAFC", border: "#E2E8F0", num: "#64748B" }
              : idx === 2
              ? { bg: "#FFF7ED", border: "#FED7AA", num: "#C2410C" }
              : { bg: "#FAFAFA", border: "#F1F5F9", num: "#94A3B8" };

            return (
              <div key={entry.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${isYou ? "ring-2 ring-blue-300" : "hover:scale-[1.005]"}`}
                style={{ background: rankStyle.bg, borderColor: rankStyle.border, boxShadow: isTop ? "0 2px 8px rgba(0,0,0,0.04)" : "none" }}>
                {/* Rank */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-black text-sm"
                  style={{ background: isTop ? rankStyle.border : "#F1F5F9", color: rankStyle.num }}>
                  {idx === 0 ? "👑" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
                </div>
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-sm font-bold"
                  style={{ background: "#E2E8F0", color: "#475569" }}>
                  {(entry.full_name || entry.username || "?")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">
                    {entry.full_name || entry.username || "Soul Winner"}
                    {isYou && <span className="ml-1.5 text-[10px] bg-blue-100 text-blue-600 font-bold px-1.5 py-0.5 rounded-full">You</span>}
                  </p>
                  <p className="text-xs text-slate-400">{entry.completed_days.length} days completed</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-black" style={{ color: rankStyle.num }}>{value}</p>
                  <p className="text-[10px] text-slate-400">{label}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
