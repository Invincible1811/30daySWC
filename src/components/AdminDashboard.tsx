"use client";

import { useState, useEffect } from "react";
import { Shield, Users, Heart, BookOpen, UserPlus, Trash2, ChevronDown, ChevronUp, TrendingUp, Globe, Bell, Send, RefreshCw, Loader2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface UserRow {
  id: string;
  username: string;
  full_name: string;
  role: string;
  current_day: number;
  completed_days: number[];
  created_at: string;
}

interface Stats {
  totalUsers: number;
  totalSouls: number;
  totalTestimonies: number;
  totalPrayers: number;
  totalEvents: number;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalSouls: 0, totalTestimonies: 0, totalPrayers: 0, totalEvents: 0 });
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [tab, setTab] = useState<"overview" | "users" | "content" | "notifications">("overview");
  const [notifTitle, setNotifTitle] = useState("");
  const [notifBody, setNotifBody] = useState("");
  const [sendingNotif, setSendingNotif] = useState(false);
  const [notifSent, setNotifSent] = useState(false);
  const [notifError, setNotifError] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }

    (async () => {
      const [profilesRes, soulsRes, testimoniesRes, prayersRes, eventsRes] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("souls").select("*", { count: "exact", head: true }),
        supabase.from("testimonies").select("*", { count: "exact", head: true }),
        supabase.from("prayers").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*", { count: "exact", head: true }),
      ]);

      setUsers((profilesRes.data || []) as unknown as UserRow[]);
      setStats({
        totalUsers: (profilesRes.data || []).length,
        totalSouls: soulsRes.count || 0,
        totalTestimonies: testimoniesRes.count || 0,
        totalPrayers: prayersRes.count || 0,
        totalEvents: eventsRes.count || 0,
      });
      setLoading(false);
    })();
  }, []);

  const setRole = async (userId: string, newRole: string) => {
    await supabase.from("profiles").update({ role: newRole }).eq("id", userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure? This will delete this user and all their data.")) return;
    await supabase.from("profiles").delete().eq("id", userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
  };

  const statCards = [
    { icon: <Users className="text-primary" size={22} />, label: "Total Users", value: stats.totalUsers, bg: "bg-primary/10" },
    { icon: <UserPlus className="text-success" size={22} />, label: "Souls Won", value: stats.totalSouls, bg: "bg-success/10" },
    { icon: <BookOpen className="text-warning" size={22} />, label: "Testimonies", value: stats.totalTestimonies, bg: "bg-warning/10" },
    { icon: <Heart className="text-danger" size={22} />, label: "Prayers", value: stats.totalPrayers, bg: "bg-danger/10" },
    { icon: <Globe className="text-primary" size={22} />, label: "Events", value: stats.totalEvents, bg: "bg-primary/10" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-dark via-dark-light to-primary-dark rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
            <Shield size={24} className="text-warning" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Admin Dashboard</h2>
            <p className="text-blue-200 text-sm">Manage users, content, and monitor activity</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-grey-light rounded-xl p-1">
        {(["overview", "users", "content", "notifications"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all ${
              tab === t ? "bg-white text-primary shadow-sm" : "text-grey-dark"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {statCards.map(card => (
              <div key={card.label} className={`${card.bg} rounded-xl p-4 text-center`}>
                <div className="mx-auto mb-2 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  {card.icon}
                </div>
                <p className="text-2xl font-bold text-dark">{card.value}</p>
                <p className="text-xs text-grey-dark mt-1">{card.label}</p>
              </div>
            ))}
          </div>

          {/* Recent Users */}
          <div className="bg-card rounded-2xl shadow-sm border border-grey-light overflow-hidden">
            <div className="p-4 border-b border-grey-light flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" />
              <h3 className="font-bold text-dark">Recent Sign-ups</h3>
            </div>
            <div className="divide-y divide-grey-light">
              {users.slice(0, 5).map(u => (
                <div key={u.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {(u.full_name || u.username || "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark truncate">{u.full_name || u.username || "Unnamed"}</p>
                    <p className="text-xs text-grey-dark">Day {u.current_day} • {u.completed_days?.length || 0} completed</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    u.role === "admin" ? "bg-warning/20 text-warning" : u.role === "assistant_admin" ? "bg-purple-100 text-purple-600" : "bg-grey-light text-grey-dark"
                  }`}>
                    {u.role === "assistant_admin" ? "assistant" : u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Users Tab */}
      {tab === "users" && (
        <div className="bg-card rounded-2xl shadow-sm border border-grey-light overflow-hidden">
          <div className="p-4 border-b border-grey-light">
            <h3 className="font-bold text-dark">All Users ({users.length})</h3>
          </div>
          <div className="divide-y divide-grey-light">
            {users.map(u => (
              <div key={u.id}>
                <button
                  onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-grey-light/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {(u.full_name || u.username || "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-dark truncate">{u.full_name || u.username || "Unnamed"}</p>
                    <p className="text-xs text-grey-dark">Joined {new Date(u.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    u.role === "admin" ? "bg-warning/20 text-warning" : u.role === "assistant_admin" ? "bg-purple-100 text-purple-600" : "bg-grey-light text-grey-dark"
                  }`}>
                    {u.role === "assistant_admin" ? "assistant" : u.role}
                  </span>
                  {expandedUser === u.id ? <ChevronUp size={16} className="text-grey" /> : <ChevronDown size={16} className="text-grey" />}
                </button>

                {expandedUser === u.id && (
                  <div className="px-4 pb-4 bg-grey-light/30">
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-white rounded-lg p-2 text-center">
                        <p className="text-lg font-bold text-dark">{u.current_day}</p>
                        <p className="text-[10px] text-grey-dark">Current Day</p>
                      </div>
                      <div className="bg-white rounded-lg p-2 text-center">
                        <p className="text-lg font-bold text-dark">{u.completed_days?.length || 0}</p>
                        <p className="text-[10px] text-grey-dark">Days Done</p>
                      </div>
                      <div className="bg-white rounded-lg p-2 text-center">
                        <p className="text-lg font-bold text-dark">{Math.round(((u.completed_days?.length || 0) / 30) * 100)}%</p>
                        <p className="text-[10px] text-grey-dark">Progress</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {u.role === "user" && (
                        <button
                          onClick={() => setRole(u.id, "assistant_admin")}
                          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                        >
                          <Shield size={14} /> Make Assistant
                        </button>
                      )}
                      {u.role === "assistant_admin" && (
                        <button
                          onClick={() => setRole(u.id, "user")}
                          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold bg-grey-light text-grey-dark hover:bg-grey-medium/30 transition-colors"
                        >
                          <Shield size={14} /> Remove Assistant
                        </button>
                      )}
                      {u.role !== "admin" && (
                        <button
                          onClick={() => setRole(u.id, "admin")}
                          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          <Shield size={14} /> Make Admin
                        </button>
                      )}
                      {u.role === "admin" && (
                        <button
                          onClick={() => setRole(u.id, "user")}
                          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold bg-grey-light text-grey-dark hover:bg-grey-medium/30 transition-colors"
                        >
                          <Shield size={14} /> Remove Admin
                        </button>
                      )}
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="flex items-center justify-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold bg-danger/10 text-danger hover:bg-danger/20 transition-colors"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Tab */}
      {tab === "content" && (
        <div className="space-y-4">
          {[
            { label: "Testimonies", count: stats.totalTestimonies, table: "testimonies" },
            { label: "Prayer Requests", count: stats.totalPrayers, table: "prayers" },
            { label: "Events", count: stats.totalEvents, table: "events" },
            { label: "Souls Recorded", count: stats.totalSouls, table: "souls" },
          ].map(item => (
            <div key={item.label} className="bg-card rounded-xl p-4 shadow-sm border border-grey-light flex items-center justify-between">
              <div>
                <p className="font-semibold text-dark">{item.label}</p>
                <p className="text-xs text-grey-dark mt-0.5">Manage in Supabase Dashboard → Table Editor → {item.table}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{item.count}</p>
                <p className="text-[10px] text-grey-dark">total</p>
              </div>
            </div>
          ))}
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
            <p className="text-sm text-primary font-medium">
              💡 For detailed content moderation, use the{" "}
              <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline font-bold">
                Supabase Dashboard
              </a>{" "}
              → Table Editor. You can edit, delete, or moderate any row directly.
            </p>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {tab === "notifications" && (
        <div className="space-y-4">
          {/* Push Update Notification */}
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-grey-light">
            <h3 className="font-bold text-dark mb-1 flex items-center gap-2">
              <RefreshCw size={18} className="text-primary" /> Push App Update
            </h3>
            <p className="text-xs text-grey-dark mb-4">Notify all users to refresh the app for the latest version.</p>
            <button
              onClick={async () => {
                if (!isSupabaseConfigured) return;
                setSendingNotif(true);
                setNotifError("");
                const { error } = await supabase.from("notifications").insert({
                  title: "App Update Available",
                  body: "A new version of Winning Souls is available. Please refresh or reopen the app to get the latest features!",
                  type: "update",
                });
                if (error) setNotifError(error.message);
                else setNotifSent(true);
                setSendingNotif(false);
                setTimeout(() => setNotifSent(false), 3000);
              }}
              disabled={sendingNotif}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              {sendingNotif ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              {notifSent ? "Sent!" : "Push Update to All Users"}
            </button>
          </div>

          {/* Custom Announcement */}
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-grey-light">
            <h3 className="font-bold text-dark mb-1 flex items-center gap-2">
              <Bell size={18} className="text-warning" /> Send Announcement
            </h3>
            <p className="text-xs text-grey-dark mb-4">Send a custom notification to all app users.</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-grey-dark block mb-1">Title</label>
                <input
                  value={notifTitle}
                  onChange={e => setNotifTitle(e.target.value)}
                  placeholder="e.g. New Feature Released!"
                  className="w-full bg-grey-light/50 rounded-xl px-4 py-2.5 border border-grey-light text-sm outline-none text-dark focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-grey-dark block mb-1">Message</label>
                <textarea
                  value={notifBody}
                  onChange={e => setNotifBody(e.target.value)}
                  placeholder="Write your announcement..."
                  rows={3}
                  className="w-full bg-grey-light/50 rounded-xl px-4 py-2.5 border border-grey-light text-sm outline-none text-dark focus:border-primary resize-none"
                />
              </div>
              {notifError && <p className="text-xs text-danger font-medium">{notifError}</p>}
              <button
                onClick={async () => {
                  if (!notifTitle.trim() || !notifBody.trim() || !isSupabaseConfigured) return;
                  setSendingNotif(true);
                  setNotifError("");
                  const { error } = await supabase.from("notifications").insert({
                    title: notifTitle.trim(),
                    body: notifBody.trim(),
                    type: "announcement",
                  });
                  if (error) setNotifError(error.message);
                  else {
                    setNotifSent(true);
                    setNotifTitle("");
                    setNotifBody("");
                  }
                  setSendingNotif(false);
                  setTimeout(() => setNotifSent(false), 3000);
                }}
                disabled={sendingNotif || !notifTitle.trim() || !notifBody.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-warning text-white hover:bg-warning/90 transition-colors disabled:opacity-50"
              >
                {sendingNotif ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {notifSent ? "Sent!" : "Send Announcement"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
