"use client";

import { useApp } from "@/lib/store";
import { Users, Search, MapPin, UserPlus, Shield } from "lucide-react";
import { useState } from "react";

const groupTypeConfig: Record<string, { bg: string; text: string; icon: string }> = {
  street: { bg: "bg-danger/10", text: "text-danger", icon: "🔥" },
  campus: { bg: "bg-primary/10", text: "text-primary", icon: "🎓" },
  prayer: { bg: "bg-success/10", text: "text-success", icon: "🙏" },
  outreach: { bg: "bg-warning/10", text: "text-warning", icon: "🚪" },
};

export default function Groups() {
  const { groups, joinGroup } = useApp();
  const [search, setSearch] = useState("");
  const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set());

  const filtered = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleJoin = (id: string) => {
    if (joinedGroups.has(id)) return;
    joinGroup(id);
    setJoinedGroups(prev => new Set([...prev, id]));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-dark">Groups & Outreach Teams</h2>
        <p className="text-grey mt-1">Join a team and win souls together</p>
      </div>

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

      {/* Groups Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map(group => {
          const config = groupTypeConfig[group.type] || groupTypeConfig.outreach;
          const joined = joinedGroups.has(group.id);
          return (
            <div key={group.id} className="bg-card rounded-2xl shadow-sm border border-grey-light overflow-hidden">
              <div className={`h-2 ${config.bg.replace("/10", "")}`} style={{ backgroundColor: config.text === "text-danger" ? "#EF4444" : config.text === "text-primary" ? "#1E40AF" : config.text === "text-success" ? "#10B981" : "#F59E0B" }} />
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
                  <button
                    onClick={() => handleJoin(group.id)}
                    disabled={joined}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                      joined
                        ? "bg-success/10 text-success cursor-default"
                        : "bg-primary text-white hover:bg-primary-dark"
                    }`}
                  >
                    {joined ? (
                      <>✓ Joined</>
                    ) : (
                      <><UserPlus size={16} /> Join</>
                    )}
                  </button>
                  <button className="px-4 py-2.5 rounded-xl text-sm font-medium border border-grey-light text-grey-dark hover:bg-grey-light transition-colors">
                    Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="text-grey-medium mx-auto mb-3" />
          <p className="text-grey font-medium">No groups found</p>
        </div>
      )}
    </div>
  );
}
