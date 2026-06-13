"use client";

import { useApp } from "@/lib/store";
import { CalendarDays, MapPin, Clock, Users, Plus, X, ChevronLeft, ChevronRight, Navigation, ExternalLink } from "lucide-react";
import { useState } from "react";

const eventTypeColors: Record<string, { bg: string; border: string; accent: string; chip: string; label: string; emoji: string }> = {
  outreach: { bg: "rgba(14,165,233,0.08)", border: "rgba(14,165,233,0.3)", accent: "#0EA5E9", chip: "rgba(14,165,233,0.15)", label: "Outreach", emoji: "🌍" },
  prayer:   { bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.3)",  accent: "#22C55E", chip: "rgba(34,197,94,0.15)",  label: "Prayer",   emoji: "🙏" },
  study:    { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.3)", accent: "#F59E0B", chip: "rgba(245,158,11,0.15)", label: "Bible Study", emoji: "📖" },
  crusade:  { bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.3)",  accent: "#EF4444", chip: "rgba(239,68,68,0.15)",  label: "Crusade",  emoji: "⚡" },
};

export default function Events() {
  const { events, addEvent, rsvpEvent } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [form, setForm] = useState({
    title: "", description: "", date: "", time: "", location: "", address: "", locationNotes: "", type: "outreach" as "outreach" | "prayer" | "study" | "crusade",
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  const eventDates = new Set(events.map(e => {
    const d = new Date(e.date);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  }));

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    addEvent(form);
    setForm({ title: "", description: "", date: "", time: "", location: "", address: "", locationNotes: "", type: "outreach" });
    setShowForm(false);
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none text-white placeholder-white/30 bg-white/5 border border-white/10 focus:border-blue-400/50";

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div
        className="relative rounded-2xl overflow-hidden p-6"
        style={{ background: "linear-gradient(135deg, #0a1628 0%, #0d2045 60%, #0a1628 100%)", boxShadow: "0 4px 30px rgba(14,165,233,0.12)" }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">📅</span>
              <h2 className="text-2xl font-bold text-white">Outreach Events</h2>
            </div>
            <p className="text-blue-300/60 text-sm">Stay ready for the next Kingdom assignment</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #0EA5E9, #0284C7)", color: "#fff", boxShadow: "0 4px 15px rgba(14,165,233,0.4)" }}>
            <Plus size={16} /> Add Event
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "linear-gradient(180deg, #0a1628 0%, #0d1f40 100%)", border: "1px solid rgba(14,165,233,0.2)" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(14,165,233,0.1)" }}>
          <button onClick={prevMonth} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronLeft size={18} className="text-blue-300" />
          </button>
          <h3 className="font-bold text-white text-sm tracking-wide uppercase">{monthName}</h3>
          <button onClick={nextMonth} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
            <ChevronRight size={18} className="text-blue-300" />
          </button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {["S","M","T","W","T","F","S"].map((d, i) => (
              <div key={i} className="text-[10px] font-bold text-blue-400/50 py-1 uppercase">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              const isToday = day && new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
              const hasEvent = day && eventDates.has(`${year}-${month}-${day}`);
              return (
                <div key={idx}
                  className="aspect-square flex flex-col items-center justify-center rounded-lg text-xs relative transition-colors"
                  style={{
                    background: isToday ? "linear-gradient(135deg, #0EA5E9, #0284C7)" : hasEvent ? "rgba(14,165,233,0.1)" : "transparent",
                    color: isToday ? "#fff" : day ? "rgba(255,255,255,0.7)" : "transparent",
                    fontWeight: isToday ? 700 : hasEvent ? 600 : 400,
                    border: hasEvent && !isToday ? "1px solid rgba(14,165,233,0.3)" : "1px solid transparent",
                  }}>
                  {day}
                  {hasEvent && !isToday && <div className="w-1 h-1 rounded-full bg-blue-400 absolute bottom-1" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Events List */}
      {(() => {
        const now = new Date(); now.setHours(0,0,0,0);
        const upcoming = events.filter(e => new Date(e.date) >= now);
        const past = events.filter(e => new Date(e.date) < now);
        return (
          <>
            <div className="space-y-3">
              <h3 className="font-bold text-white/80 text-sm uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Upcoming Events
              </h3>
              {upcoming.length === 0 && (
                <div className="rounded-2xl flex flex-col items-center justify-center py-14 text-center"
                  style={{ background: "rgba(14,165,233,0.04)", border: "1px dashed rgba(14,165,233,0.2)" }}>
                  <span className="text-4xl mb-2">📅</span>
                  <p className="text-white/40 text-sm">No upcoming events — create one!</p>
                </div>
              )}
              {upcoming.map(event => {
                const c = eventTypeColors[event.type] || eventTypeColors.outreach;
                const d = new Date(event.date);
                return (
                  <div key={event.id} className="rounded-2xl p-4 transition-all hover:scale-[1.01]"
                    style={{ background: c.bg, border: `1px solid ${c.border}`, boxShadow: `0 0 20px ${c.bg}` }}>
                    <div className="flex items-start gap-4">
                      {/* Date chip */}
                      <div className="rounded-xl text-center shrink-0 overflow-hidden w-14"
                        style={{ background: c.chip, border: `1px solid ${c.border}` }}>
                        <div className="py-1 text-[9px] font-black uppercase tracking-widest" style={{ background: c.accent, color: "#fff" }}>
                          {d.toLocaleString("default", { month: "short" })}
                        </div>
                        <div className="py-1.5 text-xl font-black" style={{ color: c.accent }}>{d.getDate()}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm">{c.emoji}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: c.chip, color: c.accent }}>
                                {c.label}
                              </span>
                            </div>
                            <h4 className="font-bold text-white text-sm">{event.title}</h4>
                            {event.description && <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{event.description}</p>}
                            <div className="flex flex-wrap items-center gap-3 mt-2" style={{ color: "rgba(255,255,255,0.45)" }}>
                              <span className="flex items-center gap-1 text-xs"><Clock size={11} /> {event.time}</span>
                              <span className="flex items-center gap-1 text-xs"><MapPin size={11} /> {event.location}</span>
                              <span className="flex items-center gap-1 text-xs"><Users size={11} /> {event.attendees}</span>
                            </div>
                          </div>
                          <button onClick={() => rsvpEvent(event.id)}
                            className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                            style={{ background: c.accent, color: "#fff" }}>
                            RSVP
                          </button>
                        </div>
                        {event.address && (
                          <div className="mt-3 rounded-xl p-3" style={{ background: "rgba(0,0,0,0.2)", border: `1px solid ${c.border}` }}>
                            <p className="text-xs font-semibold mb-1" style={{ color: c.accent }}>📍 {event.address}</p>
                            {event.locationNotes && <p className="text-xs text-white/40">Note: {event.locationNotes}</p>}
                            <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.address)}&travelmode=transit`}
                              target="_blank" rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg"
                              style={{ background: c.accent, color: "#fff" }}>
                              <Navigation size={12} /> Get Directions <ExternalLink size={10} />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {past.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold text-white/30 text-xs uppercase tracking-widest">Past Events</h3>
                {past.map(event => (
                  <div key={event.id} className="rounded-xl p-4 opacity-50"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                        style={{ background: "rgba(255,255,255,0.05)" }}>
                        {(eventTypeColors[event.type] || eventTypeColors.outreach).emoji}
                      </div>
                      <div>
                        <p className="font-semibold text-white/60 text-sm">{event.title}</p>
                        <p className="text-xs text-white/30">{event.date} · {event.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        );
      })()}

      {/* Add Event Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="max-w-md w-full rounded-2xl animate-pop-in shadow-2xl overflow-y-auto max-h-[90vh]"
            style={{ background: "#0a1628", border: "1px solid rgba(14,165,233,0.3)", boxShadow: "0 0 40px rgba(14,165,233,0.15)" }}>
            <div className="p-5 flex items-center justify-between sticky top-0 z-10"
              style={{ background: "#0a1628", borderBottom: "1px solid rgba(14,165,233,0.15)" }}>
              <div>
                <h3 className="text-lg font-bold text-white">Create Event</h3>
                <p className="text-blue-300/50 text-xs">Schedule your Kingdom assignment</p>
              </div>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-blue-300">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-3">
              <input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Event title" className={inputCls} />
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" className={`${inputCls} resize-none h-20`} />
              <div className="grid grid-cols-2 gap-3">
                <input type="date" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={inputCls} />
                <input type="time" required value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} className={inputCls} />
              </div>
              <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Venue name" className={inputCls} />
              <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Full address" className={inputCls} />
              <input type="text" value={form.locationNotes} onChange={e => setForm(f => ({ ...f, locationNotes: e.target.value }))} placeholder="Location notes" className={inputCls} />
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as typeof form.type }))}
                className={inputCls} style={{ background: "#0d1f40" }}>
                <option value="outreach">🌍 Outreach</option>
                <option value="prayer">🙏 Prayer</option>
                <option value="study">📖 Bible Study</option>
                <option value="crusade">⚡ Crusade</option>
              </select>
              <button type="submit"
                className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, #0EA5E9, #0284C7)", color: "#fff", boxShadow: "0 4px 15px rgba(14,165,233,0.3)" }}>
                📅 Create Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
