"use client";

import { useApp } from "@/lib/store";
import { CalendarDays, MapPin, Clock, Users, Plus, X, ChevronLeft, ChevronRight, Navigation, ExternalLink } from "lucide-react";
import { useState } from "react";

const eventTypeColors: Record<string, { bg: string; border: string; accent: string; light: string; label: string; emoji: string }> = {
  outreach: { bg: "#EFF6FF", border: "#BFDBFE", accent: "#2563EB", light: "#DBEAFE", label: "Outreach",    emoji: "🌍" },
  prayer:   { bg: "#F0FDF4", border: "#BBF7D0", accent: "#16A34A", light: "#DCFCE7", label: "Prayer",      emoji: "🙏" },
  study:    { bg: "#FFFBEB", border: "#FDE68A", accent: "#D97706", light: "#FEF3C7", label: "Bible Study",  emoji: "📖" },
  crusade:  { bg: "#FFF1F2", border: "#FECDD3", accent: "#E11D48", light: "#FFE4E6", label: "Crusade",     emoji: "⚡" },
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

  const inputCls = "w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none text-slate-800 placeholder-slate-400 bg-white border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all";

  return (
    <div className="animate-fade-in space-y-5">

      {/* ── Header ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)", boxShadow: "0 8px 32px rgba(37,99,235,0.18)" }}>
        <div className="px-6 pt-6 pb-5 flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">Outreach Calendar</p>
            <h2 className="text-2xl font-bold text-white">Outreach Events</h2>
            <p className="text-blue-200/70 text-sm mt-0.5">Plan · Gather · Impact</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-white text-blue-700 px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95">
            <Plus size={16} /> New Event
          </button>
        </div>
        {/* Type legend strip */}
        <div className="flex border-t border-white/10">
          {Object.entries(eventTypeColors).map(([key, c]) => (
            <div key={key} className="flex-1 flex items-center justify-center gap-1 py-2.5" style={{ borderRight: "1px solid rgba(255,255,255,0.08)" }}>
              <span className="text-xs">{c.emoji}</span>
              <span className="text-[10px] font-semibold text-white/60 hidden sm:inline">{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Calendar ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <button onClick={prevMonth} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors">
            <ChevronLeft size={18} className="text-slate-500" />
          </button>
          <h3 className="font-bold text-slate-800 text-sm tracking-wide">{monthName}</h3>
          <button onClick={nextMonth} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors">
            <ChevronRight size={18} className="text-slate-500" />
          </button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d, i) => (
              <div key={i} className="text-[10px] font-bold text-slate-400 py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              const isToday = day && new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
              const hasEvent = day && eventDates.has(`${year}-${month}-${day}`);
              return (
                <div key={idx}
                  className="aspect-square flex flex-col items-center justify-center rounded-lg text-xs relative transition-all"
                  style={{
                    background: isToday ? "#2563EB" : hasEvent ? "#EFF6FF" : "transparent",
                    color: isToday ? "#fff" : day ? "#1e293b" : "transparent",
                    fontWeight: isToday ? 700 : hasEvent ? 600 : 400,
                    border: hasEvent && !isToday ? "1.5px solid #BFDBFE" : "1.5px solid transparent",
                  }}>
                  {day}
                  {hasEvent && !isToday && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 absolute bottom-1" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Events List ── */}
      {(() => {
        const now = new Date(); now.setHours(0,0,0,0);
        const upcoming = events.filter(e => new Date(e.date) >= now);
        const past = [...events.filter(e => new Date(e.date) < now)].sort((a, b) => b.date.localeCompare(a.date));
        return (
          <>
            {/* Upcoming */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block animate-pulse" />
                <h3 className="font-bold text-slate-700 text-sm uppercase tracking-widest">Upcoming Events</h3>
                {upcoming.length > 0 && <span className="ml-auto text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{upcoming.length}</span>}
              </div>
              {upcoming.length === 0 && (
                <div className="rounded-2xl flex flex-col items-center justify-center py-12 text-center bg-slate-50 border border-dashed border-slate-200">
                  <CalendarDays size={36} className="text-slate-300 mb-2" />
                  <p className="text-slate-500 font-medium text-sm">No upcoming events</p>
                  <p className="text-slate-400 text-xs mt-1">Tap "New Event" to schedule one</p>
                </div>
              )}
              {upcoming.map(event => {
                const c = eventTypeColors[event.type] || eventTypeColors.outreach;
                const d = new Date(event.date);
                return (
                  <div key={event.id}
                    className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all hover:scale-[1.005]"
                    style={{ borderColor: c.border }}>
                    {/* Coloured top accent bar */}
                    <div className="h-1 rounded-t-2xl" style={{ background: c.accent }} />
                    <div className="p-4 flex items-start gap-4">
                      {/* Date block */}
                      <div className="rounded-xl overflow-hidden shrink-0 w-14 text-center shadow-sm" style={{ border: `1.5px solid ${c.border}` }}>
                        <div className="py-1 text-[9px] font-black uppercase tracking-widest text-white" style={{ background: c.accent }}>
                          {d.toLocaleString("default", { month: "short" })}
                        </div>
                        <div className="py-1.5 font-black text-xl" style={{ color: c.accent, background: c.bg }}>
                          {d.getDate()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-sm">{c.emoji}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: c.light, color: c.accent }}>{c.label}</span>
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm leading-snug">{event.title}</h4>
                            {event.description && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{event.description}</p>}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-slate-500">
                              <span className="flex items-center gap-1 text-xs"><Clock size={11} /> {event.time}</span>
                              {event.location && <span className="flex items-center gap-1 text-xs"><MapPin size={11} /> {event.location}</span>}
                              {event.attendees > 0 && <span className="flex items-center gap-1 text-xs"><Users size={11} /> {event.attendees} going</span>}
                            </div>
                          </div>
                          <button onClick={() => rsvpEvent(event.id)}
                            className="shrink-0 text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all hover:scale-105 active:scale-95 text-white shadow-sm"
                            style={{ background: c.accent }}>
                            RSVP
                          </button>
                        </div>
                        {event.address && (
                          <div className="mt-3 rounded-xl p-3 border" style={{ background: c.bg, borderColor: c.border }}>
                            <p className="text-xs font-semibold mb-1 flex items-center gap-1" style={{ color: c.accent }}>
                              <MapPin size={11} /> {event.address}
                            </p>
                            {event.locationNotes && <p className="text-xs text-slate-500 mt-1">Note: {event.locationNotes}</p>}
                            <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.address)}&travelmode=transit`}
                              target="_blank" rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-white shadow-sm"
                              style={{ background: c.accent }}>
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

            {/* Past Events */}
            {past.length > 0 && (
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Past Events</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                {past.map(event => {
                  const c = eventTypeColors[event.type] || eventTypeColors.outreach;
                  const d = new Date(event.date);
                  return (
                    <div key={event.id} className="bg-slate-50 rounded-xl border border-slate-200 p-3.5 flex items-center gap-3 opacity-70">
                      <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-base bg-slate-100 border border-slate-200">
                        {c.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-600 text-sm truncate line-through decoration-slate-300">{event.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {d.toLocaleString("default", { month: "short", day: "numeric", year: "numeric" })}
                          {event.location ? ` · ${event.location}` : ""}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-500 shrink-0">Completed</span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        );
      })()}

      {/* ── Add Event Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl animate-pop-in shadow-2xl overflow-y-auto max-h-[92vh] bg-white">
            <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Create Event</h3>
                <p className="text-slate-400 text-xs">Schedule your next Kingdom assignment</p>
              </div>
              <button onClick={() => setShowForm(false)} className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-3">
              <input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Event title" className={inputCls} />
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description (optional)" className={`${inputCls} resize-none h-20`} />
              <div className="grid grid-cols-2 gap-3">
                <input type="date" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={inputCls} />
                <input type="time" required value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} className={inputCls} />
              </div>
              <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Venue name (e.g. City Hall)" className={inputCls} />
              <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Full address" className={inputCls} />
              <input type="text" value={form.locationNotes} onChange={e => setForm(f => ({ ...f, locationNotes: e.target.value }))} placeholder="Notes (e.g. Gate B entrance)" className={inputCls} />
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as typeof form.type }))} className={inputCls}>
                <option value="outreach">🌍 Outreach</option>
                <option value="prayer">🙏 Prayer Meeting</option>
                <option value="study">📖 Bible Study</option>
                <option value="crusade">⚡ Crusade</option>
              </select>
              <button type="submit"
                className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95 shadow-md"
                style={{ background: "linear-gradient(135deg, #2563EB, #1d4ed8)" }}>
                Create Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
