"use client";

import { useApp } from "@/lib/store";
import { Search, MapPin, Phone, Mail, ChevronDown, Edit3, Check, Clock, AlertCircle } from "lucide-react";
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-dark">Follow-Up Records</h2>
        <p className="text-grey mt-1">Track and nurture every soul towards discipleship</p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(["all", "pending", "in_progress", "completed"] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === status
                ? "bg-primary text-white"
                : "bg-card text-grey border border-grey-light hover:border-primary/30"
            }`}
          >
            {status === "all" ? "All" : status === "in_progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-2 text-xs opacity-80">({statusCounts[status]})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-grey" />
        <input
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-card rounded-xl border border-grey-light text-sm focus:outline-none focus:border-primary"
        />
      </div>

      {/* Contacts List */}
      <div className="space-y-3">
        {filtered.map(soul => (
          <div key={soul.id} className="bg-card rounded-xl shadow-sm border border-grey-light overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                    {soul.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-dark">{soul.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-grey">
                      {soul.location && (
                        <span className="flex items-center gap-1"><MapPin size={12} /> {soul.location}</span>
                      )}
                      <span>{soul.date}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => cycleStatus(soul)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                    soul.followUpStatus === "completed" ? "bg-success/10 text-success hover:bg-success/20" :
                    soul.followUpStatus === "in_progress" ? "bg-warning/10 text-warning hover:bg-warning/20" :
                    "bg-danger/10 text-danger hover:bg-danger/20"
                  }`}
                >
                  {soul.followUpStatus === "completed" && <Check size={12} />}
                  {soul.followUpStatus === "in_progress" && <Clock size={12} />}
                  {soul.followUpStatus === "pending" && <AlertCircle size={12} />}
                  {soul.followUpStatus === "in_progress" ? "In Progress" : soul.followUpStatus.charAt(0).toUpperCase() + soul.followUpStatus.slice(1)}
                </button>
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-3 mt-3 ml-15">
                {soul.phone && (
                  <a href={`tel:${soul.phone}`} className="flex items-center gap-1 text-xs text-primary hover:underline">
                    <Phone size={12} /> {soul.phone}
                  </a>
                )}
                {soul.email && (
                  <a href={`mailto:${soul.email}`} className="flex items-center gap-1 text-xs text-primary hover:underline">
                    <Mail size={12} /> {soul.email}
                  </a>
                )}
              </div>

              {/* Notes */}
              <div className="mt-3 bg-grey-light/50 rounded-lg p-3">
                {editingId === soul.id ? (
                  <div>
                    <textarea
                      value={editNotes}
                      onChange={e => setEditNotes(e.target.value)}
                      className="w-full p-2 rounded-lg border border-grey-light text-sm focus:outline-none focus:border-primary resize-none h-16"
                    />
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => saveEdit(soul.id)} className="text-xs bg-primary text-white px-3 py-1 rounded-lg">Save</button>
                      <button onClick={() => setEditingId(null)} className="text-xs text-grey px-3 py-1 rounded-lg hover:bg-grey-light">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-grey-dark">{soul.notes || "No notes added"}</p>
                    <button onClick={() => startEdit(soul)} className="text-grey hover:text-primary ml-2 shrink-0">
                      <Edit3 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Search size={48} className="text-grey-medium mx-auto mb-3" />
            <p className="text-grey font-medium">No contacts found</p>
            <p className="text-grey text-sm mt-1">Log souls first, then follow up here</p>
          </div>
        )}
      </div>
    </div>
  );
}
