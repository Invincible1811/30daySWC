"use client";

import { Users, Search, UserPlus, Shield, Plus, X, Loader2, Clock, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

interface Group {
  id: string;
  user_id: string;
  name: string;
  description: string;
  leader: string;
  members: number;
  type: string;
  status: string;
  created_at: string;
}

const groupTypeConfig: Record<string, { bg: string; text: string; icon: string; color: string }> = {
  street: { bg: "bg-danger/10", text: "text-danger", icon: "🔥", color: "#EF4444" },
  campus: { bg: "bg-primary/10", text: "text-primary", icon: "🎓", color: "#1E40AF" },
  prayer: { bg: "bg-success/10", text: "text-success", icon: "🙏", color: "#10B981" },
  outreach: { bg: "bg-warning/10", text: "text-warning", icon: "🚪", color: "#F59E0B" },
};

export default function Groups() {
  const { user, profile, isAdmin, isAssistantAdmin } = useAuth();
  const canCreate = isAdmin || isAssistantAdmin;
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set());
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", description: "", type: "outreach" });
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase.from("groups").select("*").order("created_at", { ascending: false });
      if (data) setGroups(data as Group[]);
      setLoading(false);
    })();
  }, []);

  const visibleGroups = groups.filter(g => {
    if (isAdmin) return true;
    return g.status === "approved";
  });

  const filtered = visibleGroups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleJoin = (id: string) => {
    if (joinedGroups.has(id)) return;
    setJoinedGroups(prev => new Set([...prev, id]));
  };

  const handleCreate = async () => {
    if (!newGroup.name.trim() || !newGroup.description.trim() || !user) return;
    setCreating(true);
    setCreateError("");
    const { data, error } = await supabase.from("groups").insert({
      user_id: user.id,
      name: newGroup.name.trim(),
      description: newGroup.description.trim(),
      leader: profile?.full_name || profile?.username || "Unknown",
      type: newGroup.type,
      status: isAdmin ? "approved" : "pending",
    }).select().single();
    if (error) {
      setCreateError(error.message);
    } else {
      setGroups(prev => [data as Group, ...prev]);
      setCreateSuccess(true);
      setNewGroup({ name: "", description: "", type: "outreach" });
      setTimeout(() => { setCreateSuccess(false); setShowCreate(false); }, 2000);
    }
    setCreating(false);
  };

  const handleApprove = async (id: string) => {
    await supabase.from("groups").update({ status: "approved" }).eq("id", id);
    setGroups(prev => prev.map(g => g.id === id ? { ...g, status: "approved" } : g));
  };

  const handleReject = async (id: string) => {
    await supabase.from("groups").update({ status: "rejected" }).eq("id", id);
    setGroups(prev => prev.map(g => g.id === id ? { ...g, status: "rejected" } : g));
  };

  const handleDelete = async (id: string) => {
    await supabase.from("groups").delete().eq("id", id);
    setGroups(prev => prev.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark">Groups & Outreach Teams</h2>
          <p className="text-grey mt-1">Join a team and win souls together</p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            <Plus size={16} /> Create Group
          </button>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-pop-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-grey-light">
              <h3 className="font-bold text-dark text-lg">Create a Group</h3>
              <button onClick={() => setShowCreate(false)} className="w-8 h-8 rounded-full bg-grey-light flex items-center justify-center text-grey-dark hover:bg-grey-medium/30">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {!isAdmin && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                  <Clock size={16} className="text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700">Your group will be reviewed and approved by the administrator before it becomes visible to others.</p>
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-grey-dark block mb-1">Group Name</label>
                <input
                  value={newGroup.name}
                  onChange={e => setNewGroup(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Downtown Outreach Crew"
                  className="w-full bg-grey-light/50 rounded-xl px-4 py-2.5 border border-grey-light text-sm outline-none text-dark focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-grey-dark block mb-1">Description</label>
                <textarea
                  value={newGroup.description}
                  onChange={e => setNewGroup(p => ({ ...p, description: e.target.value }))}
                  placeholder="What is this group about?"
                  rows={3}
                  className="w-full bg-grey-light/50 rounded-xl px-4 py-2.5 border border-grey-light text-sm outline-none text-dark focus:border-primary resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-grey-dark block mb-1">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(groupTypeConfig).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => setNewGroup(p => ({ ...p, type: key }))}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                        newGroup.type === key
                          ? `${cfg.bg} ${cfg.text} border-current`
                          : "border-grey-light text-grey-dark hover:border-grey-medium"
                      }`}
                    >
                      <span>{cfg.icon}</span>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              {createError && <p className="text-xs text-danger font-medium">{createError}</p>}
              {createSuccess && (
                <div className="bg-success/10 text-success text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2">
                  <CheckCircle2 size={16} /> {isAdmin ? "Group created!" : "Group submitted for review!"}
                </div>
              )}
              <button
                onClick={handleCreate}
                disabled={creating || !newGroup.name.trim() || !newGroup.description.trim()}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                {creating ? "Creating..." : isAdmin ? "Create Group" : "Submit for Approval"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-grey" />
        <input
          type="text"
          placeholder="Search groups..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-card rounded-xl border border-grey-light text-sm focus:outline-none focus:border-primary"
        />
      </div>

      {/* Pending Groups (Admin Only) */}
      {isAdmin && groups.filter(g => g.status === "pending").length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-dark flex items-center gap-2">
            <Clock size={16} className="text-amber-500" /> Pending Approval ({groups.filter(g => g.status === "pending").length})
          </h3>
          {groups.filter(g => g.status === "pending").map(group => {
            const config = groupTypeConfig[group.type] || groupTypeConfig.outreach;
            return (
              <div key={group.id} className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 ${config.bg} rounded-xl flex items-center justify-center text-lg`}>{config.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-dark text-sm">{group.name}</h4>
                    <p className="text-xs text-grey-dark">by {group.leader} • {config.icon} {group.type}</p>
                  </div>
                </div>
                <p className="text-sm text-grey-dark mb-3">{group.description}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleApprove(group.id)} className="flex-1 py-2 rounded-xl text-sm font-semibold bg-success text-white hover:bg-success/90 transition-colors">
                    Approve
                  </button>
                  <button onClick={() => handleReject(group.id)} className="flex-1 py-2 rounded-xl text-sm font-semibold bg-danger/10 text-danger hover:bg-danger/20 transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Groups Grid */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 size={32} className="text-primary animate-spin mx-auto mb-3" />
          <p className="text-grey text-sm">Loading groups...</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map(group => {
            const config = groupTypeConfig[group.type] || groupTypeConfig.outreach;
            const joined = joinedGroups.has(group.id);
            const isPending = group.status === "pending";
            const isRejected = group.status === "rejected";
            return (
              <div key={group.id} className={`bg-card rounded-2xl shadow-sm border overflow-hidden ${isPending ? "border-amber-300 opacity-75" : isRejected ? "border-danger/30 opacity-50" : "border-grey-light"}`}>
                <div className="h-2" style={{ backgroundColor: config.color }} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center text-xl`}>
                        {config.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-dark">{group.name}</h3>
                        <span className={`text-xs font-medium ${config.text}`}>
                          {group.type.charAt(0).toUpperCase() + group.type.slice(1)} Team
                        </span>
                      </div>
                    </div>
                    {isPending && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">Pending</span>}
                    {isRejected && <span className="text-xs bg-danger/10 text-danger px-2 py-1 rounded-full font-medium">Rejected</span>}
                  </div>
                  <p className="text-sm text-grey-dark mb-4">{group.description}</p>
                  <div className="flex items-center gap-4 text-xs text-grey mb-4">
                    <span className="flex items-center gap-1">
                      <Shield size={12} /> {group.leader}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {group.members} members
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {group.status === "approved" && (
                      <button
                        onClick={() => handleJoin(group.id)}
                        disabled={joined}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                          joined
                            ? "bg-success/10 text-success cursor-default"
                            : "bg-primary text-white hover:bg-primary-dark"
                        }`}
                      >
                        {joined ? <>✓ Joined</> : <><UserPlus size={16} /> Join</>}
                      </button>
                    )}
                    {isAdmin && (
                      <button onClick={() => handleDelete(group.id)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-danger border border-danger/30 hover:bg-danger/10 transition-colors">
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="text-grey-medium mx-auto mb-3" />
          <p className="text-grey font-medium">No groups found</p>
          <p className="text-grey text-sm mt-1">Create one to get started!</p>
        </div>
      )}
    </div>
  );
}
