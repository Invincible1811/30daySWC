"use client";

import { useApp } from "@/lib/store";
import { Search, MapPin, Phone, Mail, Edit3, Check, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";
import type { Soul } from "@/lib/data";

export default function FollowUp() {
  const { souls, updateSoul } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "in_progress" | "completed">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");

  const filtered = souls
    .filter(s => filter === "all" || s.followUpStatus === filter)
    .filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase())
    );

  const statusCounts = {
    all: souls.length,
    pending: souls.filter(s => s.followUpStatus === "pending").length,
    in_progress: souls.filter(s => s.followUpStatus === "in_progress").length,
    completed: souls.filter(s => s.followUpStatus === "completed").length,
  };

  const startEdit = (soul: Soul) => {
    setEditingId(soul.id);
    setEditNotes(soul.notes);
  };

  const saveEdit = (id: string) => {
    updateSoul(id, { notes: editNotes });
    setEditingId(null);
  };

  const cycleStatus = (soul: Soul) => {
    const next: Record<string, "pending" | "in_progress" | "completed"> = {
      pending: "in_progress",
      in_progress: "completed",
      completed: "pending",
    };
    updateSoul(soul.id, { followUpStatus: next[soul.followUpStatus] });
  };

  const statusConfig = {
    pending:     { label: "Pending",     color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", light: "#FFF5F5", icon: <AlertCircle size={12} /> },
    in_progress: { label: "In Progress", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", light: "#FFFDF0", icon: <Clock size={12} /> },
    completed:   { label: "Completed",   color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0", light: "#F7FEF9", icon: <Check size={12} /> },
  };

  const completedPct = souls.length > 0 ? Math.round((statusCounts.completed / souls.length) * 100) : 0;

  return (
    <div className="animate-fade-in space-y-5">

      {/* ── Header ── */}
      <div className="relative rounded-2xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)", boxShadow: "0 8px 32px rgba(6,78,59,0.2)" }}>
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative z-10 px-6 py-6">
          <p className="text-emerald-300/70 text-xs font-semibold uppercase tracking-widest mb-1">Discipleship Pipeline</p>
          <h2 className="text-2xl font-black text-white mb-0.5">Follow-Up Records</h2>
          <p className="text-emerald-200/60 text-sm">Track and nurture every soul towards discipleship</p>

          {/* Progress bar */}
          {souls.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-emerald-200/70">Discipleship Progress</span>
                <span className="font-bold text-emerald-300">{statusCounts.completed} / {souls.length} completed</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${completedPct}%`, background: "linear-gradient(90deg, #34d399, #10b981)" }} />
              </div>
            </div>
          )}

          {/* Stat chips */}
          <div className="flex gap-2 mt-4 flex-wrap">
            {[
              { label: "Pending",     count: statusCounts.pending,     emoji: "🔴" },
              { label: "In Progress", count: statusCounts.in_progress,  emoji: "🟡" },
              { label: "Completed",   count: statusCounts.completed,    emoji: "🟢" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.12)" }}>
                <span>{s.emoji}</span> {s.count} {s.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter + Search ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Filter tabs */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-slate-100 flex-wrap sm:flex-nowrap">
          {(["all", "pending", "in_progress", "completed"] as const).map(status => (
            <button key={status} onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                filter === status ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500"
              }`}>
              {status === "all" ? "All" : status === "in_progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-1 opacity-60">({statusCounts[status]})</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
          />
        </div>
      </div>

      {/* ── Contact Cards ── */}
      <div className="space-y-3">
        {filtered.map(soul => {
          const sc = statusConfig[soul.followUpStatus] || statusConfig.pending;
          const initials = soul.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
          return (
            <div key={soul.id} className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all"
              style={{ borderColor: sc.border }}>
              {/* Coloured left accent + top strip */}
              <div className="h-1 rounded-t-2xl" style={{ background: sc.color }} />

              <div className="p-4">
                {/* Top row — avatar, name, status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-sm shrink-0"
                      style={{ background: sc.bg, color: sc.color, border: `2px solid ${sc.border}` }}>
                      {initials}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{soul.name}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        {soul.location && (
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <MapPin size={11} /> {soul.location}
                          </span>
                        )}
                        <span className="text-xs text-slate-400">{soul.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status badge — tap to cycle */}
                  <button onClick={() => cycleStatus(soul)}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full shrink-0 transition-all hover:scale-105 active:scale-95"
                    style={{ background: sc.bg, color: sc.color, border: `1.5px solid ${sc.border}` }}
                    title="Tap to update status">
                    {sc.icon} {sc.label}
                  </button>
                </div>

                {/* Contact links */}
                {(soul.phone || soul.email) && (
                  <div className="flex flex-wrap gap-3 mt-3 pl-14">
                    {soul.phone && (
                      <a href={`tel:${soul.phone}`}
                        className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg hover:bg-emerald-100 transition-colors">
                        <Phone size={11} /> {soul.phone}
                      </a>
                    )}
                    {soul.email && (
                      <a href={`mailto:${soul.email}`}
                        className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition-colors">
                        <Mail size={11} /> {soul.email}
                      </a>
                    )}
                  </div>
                )}

                {/* Notes */}
                <div className="mt-3 rounded-xl p-3" style={{ background: sc.light, border: `1px solid ${sc.border}` }}>
                  {editingId === soul.id ? (
                    <>
                      <textarea
                        value={editNotes}
                        onChange={e => setEditNotes(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-emerald-400 resize-none h-20 transition-all"
                        placeholder="Add follow-up notes…"
                      />
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => saveEdit(soul.id)}
                          className="text-xs font-bold bg-emerald-600 text-white px-4 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors">
                          Save
                        </button>
                        <button onClick={() => setEditingId(null)}
                          className="text-xs font-semibold text-slate-500 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs text-slate-500 leading-relaxed flex-1">
                        {soul.notes || <span className="italic text-slate-400">No notes yet — tap ✎ to add</span>}
                      </p>
                      <button onClick={() => startEdit(soul)}
                        className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                        style={{ color: sc.color }}>
                        <Edit3 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
              <Search size={24} className="text-slate-300" />
            </div>
            <p className="font-bold text-slate-500">No contacts found</p>
            <p className="text-slate-400 text-sm mt-1">Log souls in Impact Tracker, then follow up here</p>
          </div>
        )}
      </div>
    </div>
  );
}
