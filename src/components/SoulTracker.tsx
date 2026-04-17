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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark">Soul Tracker</h2>
          <p className="text-grey mt-1">Log and track every soul won for the Kingdom</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
        >
          <Plus size={18} /> Log Soul
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-grey-light text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <UserPlus className="text-primary" size={24} />
          </div>
          <p className="text-3xl font-bold text-dark">{souls.length}</p>
          <p className="text-xs text-grey mt-1">My Souls Won</p>
        </div>
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-grey-light text-center">
          <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Globe className="text-success" size={24} />
          </div>
          <p className="text-3xl font-bold text-dark">{globalSoulCount}</p>
          <p className="text-xs text-grey mt-1">Global Souls Won</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-grey" />
        <input
          type="text"
          placeholder="Search souls by name or location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-card rounded-xl border border-grey-light text-sm focus:outline-none focus:border-primary"
        />
      </div>

      {/* Souls List */}
      <div className="space-y-3">
        {filtered.map(soul => (
          <div key={soul.id} className="bg-card rounded-xl p-4 shadow-sm border border-grey-light flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
              {soul.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-dark">{soul.name}</p>
              <p className="text-xs text-grey">{soul.location} • {soul.date}</p>
              {soul.phone && <p className="text-xs text-grey-dark mt-0.5">📞 {soul.phone}</p>}
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${
              soul.followUpStatus === "completed" ? "bg-success/10 text-success" :
              soul.followUpStatus === "in_progress" ? "bg-warning/10 text-warning" :
              "bg-danger/10 text-danger"
            }`}>
              {soul.followUpStatus === "in_progress" ? "In Progress" : soul.followUpStatus.charAt(0).toUpperCase() + soul.followUpStatus.slice(1)}
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <UserPlus size={48} className="text-grey-medium mx-auto mb-3" />
            <p className="text-grey font-medium">No souls found</p>
            <p className="text-grey text-sm mt-1">Start winning souls and log them here!</p>
          </div>
        )}
      </div>

      {/* Add Soul Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full animate-pop-in shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary-dark p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Log a New Soul</h3>
                <p className="text-blue-200 text-sm">Record this precious decision for Christ</p>
              </div>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-3">
              <div>
                <label className="text-sm font-medium text-dark block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-grey-light text-sm focus:outline-none focus:border-primary"
                  placeholder="Enter name"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-dark block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-grey-light text-sm focus:outline-none focus:border-primary"
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-dark block mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-grey-light text-sm focus:outline-none focus:border-primary"
                    placeholder="Email address"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-dark block mb-1">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-grey-light text-sm focus:outline-none focus:border-primary"
                  placeholder="Where were they reached?"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-dark block mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-grey-light text-sm focus:outline-none focus:border-primary resize-none h-20"
                  placeholder="Any additional notes..."
                />
              </div>
              <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors">
                Save Soul Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
