"use client";

import { useApp } from "@/lib/store";
import { CalendarDays, MapPin, Clock, Users, Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const eventTypeColors: Record<string, { bg: string; text: string; label: string }> = {
  outreach: { bg: "bg-primary/10", text: "text-primary", label: "Outreach" },
  prayer: { bg: "bg-success/10", text: "text-success", label: "Prayer" },
  study: { bg: "bg-warning/10", text: "text-warning", label: "Bible Study" },
  crusade: { bg: "bg-danger/10", text: "text-danger", label: "Crusade" },
};

export default function Events() {
  const { events, addEvent, rsvpEvent } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [form, setForm] = useState({
    title: "", description: "", date: "", time: "", location: "", type: "outreach" as "outreach" | "prayer" | "study" | "crusade",
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
    setForm({ title: "", description: "", date: "", time: "", location: "", type: "outreach" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark">Evangelism Events</h2>
          <p className="text-grey mt-1">Stay informed about upcoming outreach activities</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} /> Add Event
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-card rounded-2xl p-5 shadow-sm border border-grey-light">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 hover:bg-grey-light rounded-lg">
            <ChevronLeft size={20} className="text-grey-dark" />
          </button>
          <h3 className="font-bold text-dark">{monthName}</h3>
          <button onClick={nextMonth} className="p-2 hover:bg-grey-light rounded-lg">
            <ChevronRight size={20} className="text-grey-dark" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="text-xs font-medium text-grey py-1">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            const isToday = day && new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
            const hasEvent = day && eventDates.has(`${year}-${month}-${day}`);
            return (
              <div
                key={idx}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm relative ${
                  day ? "cursor-default" : ""
                } ${isToday ? "bg-primary text-white font-bold" : day ? "text-dark hover:bg-grey-light" : ""}`}
              >
                {day}
                {hasEvent && (
                  <div className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${isToday ? "bg-white" : "bg-primary"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-dark">Upcoming Events</h3>
        {events.map(event => {
          const colors = eventTypeColors[event.type] || eventTypeColors.outreach;
          return (
            <div key={event.id} className="bg-card rounded-xl p-4 shadow-sm border border-grey-light">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center shrink-0`}>
                    <CalendarDays size={22} className={colors.text} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark">{event.title}</h4>
                    <p className="text-sm text-grey-dark mt-0.5">{event.description}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-grey">
                      <span className="flex items-center gap-1"><CalendarDays size={12} /> {event.date}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {event.time}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
                      <span className="flex items-center gap-1"><Users size={12} /> {event.attendees}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => rsvpEvent(event.id)}
                  className="bg-primary text-white text-xs px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors shrink-0"
                >
                  RSVP
                </button>
              </div>
            </div>
          );
        })}
        {events.length === 0 && (
          <div className="text-center py-12">
            <CalendarDays size={48} className="text-grey-medium mx-auto mb-3" />
            <p className="text-grey font-medium">No upcoming events</p>
            <p className="text-grey text-sm mt-1">Create an evangelism event to get started</p>
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full animate-pop-in shadow-2xl">
            <div className="p-5 border-b border-grey-light flex items-center justify-between">
              <h3 className="text-lg font-bold text-dark">Create Evangelism Event</h3>
              <button onClick={() => setShowForm(false)} className="text-grey hover:text-dark"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-3">
              <input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Event title" className="w-full px-4 py-2.5 rounded-xl border border-grey-light text-sm focus:outline-none focus:border-primary" />
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" className="w-full px-4 py-2.5 rounded-xl border border-grey-light text-sm focus:outline-none focus:border-primary resize-none h-20" />
              <div className="grid grid-cols-2 gap-3">
                <input type="date" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-grey-light text-sm focus:outline-none focus:border-primary" />
                <input type="time" required value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-grey-light text-sm focus:outline-none focus:border-primary" />
              </div>
              <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Location" className="w-full px-4 py-2.5 rounded-xl border border-grey-light text-sm focus:outline-none focus:border-primary" />
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as typeof form.type }))} className="w-full px-4 py-2.5 rounded-xl border border-grey-light text-sm focus:outline-none focus:border-primary bg-white">
                <option value="outreach">Outreach</option>
                <option value="prayer">Prayer</option>
                <option value="study">Bible Study</option>
                <option value="crusade">Crusade</option>
              </select>
              <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors">Create Event</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
