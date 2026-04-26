"use client";

import { useState, useEffect } from "react";
import { Trophy, Medal, Crown, Flame, Users, TrendingUp } from "lucide-react";
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

  const getRankIcon = (idx: number) => {
    if (idx === 0) return <Crown size={20} className="text-warning" />;
    if (idx === 1) return <Medal size={20} className="text-grey" />;
    if (idx === 2) return <Medal size={20} className="text-amber-600" />;
    return <span className="text-sm font-bold text-grey-dark w-5 text-center">{idx + 1}</span>;
  };

  const getRankBg = (idx: number) => {
    if (idx === 0) return "bg-warning/10 border-warning/30";
    if (idx === 1) return "bg-grey-light/80 border-grey/30";
    if (idx === 2) return "bg-amber-50 border-amber-200/50";
    return "bg-card border-grey-light";
  };

  const totalSouls = leaders.reduce((sum, l) => sum + l.soul_count, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-warning/90 to-amber-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 text-center">
          <Trophy size={36} className="mx-auto mb-2" />
          <h2 className="text-2xl font-bold">Leaderboard</h2>
          <p className="text-amber-100 text-sm mt-1">See how the community is winning souls!</p>
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card rounded-xl p-4 shadow-sm border border-grey-light text-center">
          <Users size={20} className="text-primary mx-auto mb-1" />
          <p className="text-xl font-bold text-dark">{leaders.length}</p>
          <p className="text-xs text-grey-dark">Soul Winners</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-sm border border-grey-light text-center">
          <TrendingUp size={20} className="text-success mx-auto mb-1" />
          <p className="text-xl font-bold text-dark">{totalSouls}</p>
          <p className="text-xs text-grey-dark">Total Souls Won</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-grey-light rounded-xl p-1">
        <button
          onClick={() => setTab("souls")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            tab === "souls" ? "bg-white text-primary shadow-sm" : "text-grey-dark"
          }`}
        >
          <Trophy size={14} className="inline mr-1" /> Most Souls
        </button>
        <button
          onClick={() => setTab("streak")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            tab === "streak" ? "bg-white text-primary shadow-sm" : "text-grey-dark"
          }`}
        >
          <Flame size={14} className="inline mr-1" /> Longest Streak
        </button>
      </div>

      {/* Rankings */}
      <div className="bg-card rounded-2xl shadow-sm border border-grey-light overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-sm text-grey-dark">Loading rankings...</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="p-8 text-center">
            <Trophy size={32} className="text-grey mx-auto mb-2" />
            <p className="text-sm text-grey-dark">No rankings yet. Be the first to win a soul!</p>
          </div>
        ) : (
          <div className="divide-y divide-grey-light">
            {sorted.map((entry, idx) => {
              const isYou = entry.id === user?.id;
              const value = tab === "souls" ? entry.soul_count : getStreak(entry.completed_days);
              const label = tab === "souls" ? "souls" : "day streak";

              return (
                <div key={entry.id} className={`flex items-center gap-3 px-4 py-3 ${getRankBg(idx)} ${isYou ? "ring-2 ring-primary/30 ring-inset" : ""}`}>
                  <div className="w-8 flex items-center justify-center shrink-0">
                    {getRankIcon(idx)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-dark truncate">
                      {entry.full_name || entry.username || "Soul Winner"}
                      {isYou && <span className="ml-1 text-xs text-primary font-bold">(You)</span>}
                    </p>
                    <p className="text-xs text-grey-dark">{entry.completed_days.length} days completed</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-dark">{value}</p>
                    <p className="text-[10px] text-grey-dark">{label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
