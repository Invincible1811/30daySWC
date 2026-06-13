"use client";

import { useApp } from "@/lib/store";
import { UserPlus, Search, X, Plus, Globe } from "lucide-react";
import { useState } from "react";

export default function SoulTracker() {
  const { souls, addSoul, globalSoulCount, userName } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", location: "", notes: "" });

  const filtered = souls.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addSoul({
      name: form.name,
      phone: form.phone,
      email: form.email,
      location: form.location,
      notes: form.notes,
      date: new Date().toISOString().split("T")[0],
      followUpStatus: "pending",
      addedBy: userName,
    });
    setForm({ name: "", phone: "", email: "", location: "", notes: "" });
    setShowForm(false);
  };

  const statusStyle = (status: string) => {
    if (status === "completed") return { bg: "rgba(34,197,94,0.15)", text: "#22C55E", border: "#22C55E40", label: "Completed" };
    if (status === "in_progress") return { bg: "rgba(245,158,11,0.15)", text: "#F59E0B", border: "#F59E0B40", label: "In Progress" };
    return { bg: "rgba(239,68,68,0.15)", text: "#EF4444", border: "#EF444440", label: "Pending" };
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Mission Control Header */}
      <div
        className="relative rounded-2xl overflow-hidden p-6"
        style={{ background: "linear-gradient(135deg, #0c0c1e 0%, #0f172a 50%, #1a0a00 100%)", boxShadow: "0 4px 30px rgba(245,158,11,0.1)" }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)" }}>
                <UserPlus size={16} style={{ color: "#F59E0B" }} />
              </div>
              <h2 className="text-2xl font-bold text-white">Impact Tracker</h2>
            </div>
            <p className="text-amber-300/50 text-sm">Mission intelligence — every soul counts</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#0c0c1e", boxShadow: "0 4px 15px rgba(245,158,11,0.4)" }}
          >
            <Plus size={16} /> Log Soul
          </button>
        </div>

        {/* Stat counters */}
        <div className="grid grid-cols-2 gap-4 mt-5">
          <div className="rounded-xl p-4 text-center" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
            <p className="text-4xl font-black" style={{ color: "#F59E0B" }}>{souls.length}</p>
            <p className="text-xs text-amber-300/60 mt-1 uppercase tracking-widest">My Souls Won</p>
          </div>
          <div className="rounded-xl p-4 text-center" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <p className="text-4xl font-black" style={{ color: "#22C55E" }}>{globalSoulCount}</p>
            <p className="text-xs text-green-300/60 mt-1 uppercase tracking-widest">Global Impact</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#F59E0B" }} />
        <input
          type="text"
          placeholder="Search by name or location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none text-white placeholder-white/30"
          style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)" }}
        />
      </div>

      {/* Soul Records */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "linear-gradient(180deg, #0c0c1e 0%, #0f172a 100%)", border: "1px solid rgba(245,158,11,0.15)" }}
      >
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">✝️</div>
            <p className="text-white/50 font-semibold">No souls logged yet</p>
            <p className="text-amber-300/30 text-sm mt-1">Start your Kingdom mission today</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "rgba(245,158,11,0.08)" }}>
            {filtered.map((soul, idx) => {
              const s = statusStyle(soul.followUpStatus);
              return (
                <div key={soul.id} className="flex items-center gap-4 px-4 py-3.5 hover:bg-amber-500/5 transition-colors">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0"
                    style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)" }}>
                    {soul.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm">{soul.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(245,158,11,0.5)" }}>
                      {soul.location && `📍 ${soul.location}`}{soul.location && soul.date ? " · " : ""}{soul.date}
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
                    style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Soul Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="max-w-md w-full rounded-2xl animate-pop-in overflow-hidden shadow-2xl"
            style={{ background: "#0f172a", border: "1px solid rgba(245,158,11,0.3)", boxShadow: "0 0 40px rgba(245,158,11,0.15)" }}>
            <div className="p-5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(245,158,11,0.15)" }}>
              <div>
                <h3 className="text-lg font-bold text-white">Log a New Soul</h3>
                <p className="text-amber-300/50 text-xs">Record this precious decision for Christ</p>
              </div>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10"
                style={{ color: "#F59E0B" }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-3">
              {[
                { label: "Full Name *", field: "name", type: "text", placeholder: "Enter name", required: true },
                { label: "Location", field: "location", type: "text", placeholder: "Where were they reached?" },
              ].map(({ label, field, type, placeholder, required }) => (
                <div key={field}>
                  <label className="text-xs font-semibold block mb-1" style={{ color: "#F59E0B" }}>{label}</label>
                  <input type={type} required={required} value={form[field as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none text-white placeholder-white/30"
                    style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)" }}
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                {[{ label: "Phone", field: "phone", type: "tel" }, { label: "Email", field: "email", type: "email" }].map(({ label, field, type }) => (
                  <div key={field}>
                    <label className="text-xs font-semibold block mb-1" style={{ color: "#F59E0B" }}>{label}</label>
                    <input type={type} value={form[field as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                      placeholder={label}
                      className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none text-white placeholder-white/30"
                      style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)" }}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: "#F59E0B" }}>Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Any additional notes..."
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none text-white placeholder-white/30 resize-none h-20"
                  style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)" }}
                />
              </div>
              <button type="submit"
                className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#0c0c1e", boxShadow: "0 4px 15px rgba(245,158,11,0.3)" }}>
                ✝️ Save Soul Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
