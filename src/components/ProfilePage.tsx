"use client";

import { useState } from "react";
import { User, Trophy, Flame, Heart, BookOpen, Calendar, Edit3, Check, X, LogOut, Trash2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useApp } from "@/lib/store";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function ProfilePage() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { souls, completedDays, testimonies, dailyRecords } = useApp();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const stats = [
    { icon: <Trophy className="text-warning" size={20} />, label: "Souls Won", value: souls.length, bg: "bg-warning/10" },
    { icon: <Flame className="text-danger" size={20} />, label: "Days Completed", value: completedDays.length, bg: "bg-danger/10" },
    { icon: <Heart className="text-primary" size={20} />, label: "Testimonies", value: testimonies.filter(t => t.author === (profile?.full_name || profile?.username)).length, bg: "bg-primary/10" },
    { icon: <BookOpen className="text-success" size={20} />, label: "Daily Records", value: Object.keys(dailyRecords).length, bg: "bg-success/10" },
  ];

  const streakDays = (() => {
    if (completedDays.length === 0) return 0;
    const sorted = [...completedDays].sort((a, b) => b - a);
    let streak = 1;
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i] - sorted[i + 1] === 1) streak++;
      else break;
    }
    return streak;
  })();

  const progress = Math.round((completedDays.length / 30) * 100);

  const handleSave = async () => {
    if (!user || !isSupabaseConfigured) return;
    setSaving(true);
    await supabase.from("profiles").update({
      full_name: fullName.trim(),
      username: username.trim(),
      updated_at: new Date().toISOString(),
    }).eq("id", user.id);
    await refreshProfile();
    setSaving(false);
    setEditing(false);
  };

  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-dark via-dark-light to-primary-dark rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center border-2 border-primary-light/50 shrink-0">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User size={28} className="text-primary-light" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-2">
                <input
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary-light"
                />
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary-light"
                />
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-1 bg-success text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                    <Check size={14} /> {saving ? "Saving..." : "Save"}
                  </button>
                  <button onClick={() => setEditing(false)} className="flex items-center gap-1 bg-white/10 text-white text-xs px-3 py-1.5 rounded-lg">
                    <X size={14} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold truncate">{profile?.full_name || profile?.username || "Soul Winner"}</h2>
                <p className="text-blue-200 text-sm">@{profile?.username || "user"}</p>
                <p className="text-grey-medium text-xs mt-1 flex items-center gap-1">
                  <Calendar size={12} /> Joined {joinDate}
                </p>
              </>
            )}
          </div>
          {!editing && (
            <button onClick={() => { setFullName(profile?.full_name || ""); setUsername(profile?.username || ""); setEditing(true); }} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              <Edit3 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Challenge Progress */}
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-grey-light">
        <h3 className="font-bold text-dark mb-4">Challenge Progress</h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-grey-dark">30-Day Challenge</span>
              <span className="font-bold text-primary">{progress}%</span>
            </div>
            <div className="h-3 bg-grey-light rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 bg-warning/10 rounded-xl p-3 text-center">
            <Flame size={20} className="text-warning mx-auto mb-1" />
            <p className="text-lg font-bold text-dark">{streakDays}</p>
            <p className="text-xs text-grey-dark">Day Streak</p>
          </div>
          <div className="flex-1 bg-primary/10 rounded-xl p-3 text-center">
            <Calendar size={20} className="text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-dark">{completedDays.length}/30</p>
            <p className="text-xs text-grey-dark">Completed</p>
          </div>
          <div className="flex-1 bg-success/10 rounded-xl p-3 text-center">
            <Trophy size={20} className="text-success mx-auto mb-1" />
            <p className="text-lg font-bold text-dark">{souls.length}</p>
            <p className="text-xs text-grey-dark">Souls Won</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-grey-light">
        <h3 className="font-bold text-dark mb-4">Your Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          {stats.map(stat => (
            <div key={stat.label} className={`${stat.bg} rounded-xl p-4 text-center`}>
              <div className="mx-auto mb-2 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-dark">{stat.value}</p>
              <p className="text-xs text-grey-dark mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Account */}
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-grey-light">
        <h3 className="font-bold text-dark mb-4">Account</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-grey-dark">Email</span>
            <span className="text-sm font-medium text-dark">{user?.email || "—"}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-grey-dark">Account Type</span>
            <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">Free</span>
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center justify-center gap-2 mt-4 py-3 rounded-xl text-sm font-semibold text-danger bg-danger/10 hover:bg-danger/20 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Delete Account */}
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-danger/20">
        <h3 className="font-bold text-danger mb-2 flex items-center gap-2">
          <AlertTriangle size={18} /> Danger Zone
        </h3>
        <p className="text-xs text-grey-dark mb-4">
          Deleting your account will permanently remove all your data — souls, testimonies, prayers, and progress. This cannot be undone.
        </p>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-danger border border-danger/30 hover:bg-danger/10 transition-colors"
          >
            <Trash2 size={14} />
            Delete My Account
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-danger font-semibold">Type DELETE to confirm:</p>
            <input
              value={deleteConfirmText}
              onChange={e => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full px-4 py-2.5 rounded-xl border border-danger/30 text-sm focus:outline-none focus:border-danger"
            />
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  if (deleteConfirmText !== "DELETE" || !user || !isSupabaseConfigured) return;
                  setDeleting(true);
                  // Delete profile (cascades to all user data via FK)
                  await supabase.from("profiles").delete().eq("id", user.id);
                  await signOut();
                }}
                disabled={deleteConfirmText !== "DELETE" || deleting}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ background: deleteConfirmText === "DELETE" ? "#DC2626" : "#D1D5DB", cursor: deleteConfirmText === "DELETE" ? "pointer" : "not-allowed" }}
              >
                <Trash2 size={14} />
                {deleting ? "Deleting..." : "Permanently Delete"}
              </button>
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); }}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-grey-dark bg-grey-light hover:bg-grey-light/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
