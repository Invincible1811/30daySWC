"use client";

import { useState, useEffect } from "react";
import { Users, UserPlus, Search, Check, X, Loader2, Heart, Trophy } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

interface Partner {
  id: string;
  user_id: string;
  partner_id: string;
  status: string;
  created_at: string;
  partner_profile?: {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string | null;
    current_day: number;
    completed_days: number[];
    city: string;
    country: string;
  };
  requester_profile?: {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string | null;
    current_day: number;
    completed_days: number[];
    city: string;
    country: string;
  };
}

interface MemberProfile {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  city: string;
  country: string;
}

export default function ChallengePartners() {
  const { user } = useAuth();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<MemberProfile[]>([]);
  const [searching, setSearching] = useState(false);
  const [sending, setSending] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !user) { setLoading(false); return; }
    loadPartners();
  }, [user]);

  const loadPartners = async () => {
    if (!user) return;
    // Load accepted partnerships (where I'm either user or partner)
    const { data: myPartners } = await supabase
      .from("challenge_partners")
      .select("*")
      .or(`user_id.eq.${user.id},partner_id.eq.${user.id}`)
      .eq("status", "accepted");

    // Load pending requests TO me
    const { data: incoming } = await supabase
      .from("challenge_partners")
      .select("*")
      .eq("partner_id", user.id)
      .eq("status", "pending");

    // Fetch profiles for all partners
    const partnerIds = new Set<string>();
    (myPartners || []).forEach(p => {
      partnerIds.add(p.user_id === user.id ? p.partner_id : p.user_id);
    });
    (incoming || []).forEach(p => partnerIds.add(p.user_id));

    let profiles: Record<string, MemberProfile> = {};
    if (partnerIds.size > 0) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url, current_day, completed_days, city, country")
        .in("id", Array.from(partnerIds));
      if (profs) {
        profs.forEach((p: MemberProfile & { current_day?: number; completed_days?: number[] }) => {
          profiles[p.id] = p;
        });
      }
    }

    // Attach profiles
    const enrichedPartners = (myPartners || []).map(p => ({
      ...p,
      partner_profile: profiles[p.user_id === user.id ? p.partner_id : p.user_id] as Partner["partner_profile"],
    }));

    const enrichedPending = (incoming || []).map(p => ({
      ...p,
      requester_profile: profiles[p.user_id] as Partner["requester_profile"],
    }));

    setPartners(enrichedPartners);
    setPendingRequests(enrichedPending);
    setLoading(false);
  };

  const [searchDebug, setSearchDebug] = useState("");

  const handleSearch = async () => {
    if (!search.trim() || !user) return;
    setSearching(true);
    setSearchResults([]);
    setSearchDebug("");
    const q = search.trim();
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url, city, country")
        .neq("id", user.id)
        .limit(500);
      if (error) {
        setSearchDebug(`DB Error: ${error.message}`);
        setSearching(false);
        return;
      }
      setSearchDebug(`Found ${data?.length || 0} total profiles`);
      if (data && data.length > 0) {
        const lq = q.toLowerCase();
        const filtered = data.filter((m: MemberProfile) =>
          (m.full_name && m.full_name.toLowerCase().includes(lq)) ||
          (m.username && m.username.toLowerCase().includes(lq))
        );
        setSearchDebug(`${data.length} profiles, ${filtered.length} match "${q}"`);
        setSearchResults(filtered as MemberProfile[]);
      } else {
        setSearchDebug(`0 profiles returned from DB`);
      }
    } catch (err: unknown) {
      setSearchDebug(`Exception: ${err instanceof Error ? err.message : String(err)}`);
    }
    setSearching(false);
  };

  const sendRequest = async (partnerId: string) => {
    if (!user) return;
    setSending(partnerId);
    await supabase.from("challenge_partners").insert({
      user_id: user.id,
      partner_id: partnerId,
    });
    setSending(null);
    setSearchResults(prev => prev.filter(m => m.id !== partnerId));
  };

  const acceptRequest = async (id: string) => {
    await supabase.from("challenge_partners").update({ status: "accepted" }).eq("id", id);
    loadPartners();
  };

  const declineRequest = async (id: string) => {
    await supabase.from("challenge_partners").update({ status: "declined" }).eq("id", id);
    setPendingRequests(prev => prev.filter(p => p.id !== id));
  };

  const removePartner = async (id: string) => {
    await supabase.from("challenge_partners").delete().eq("id", id);
    setPartners(prev => prev.filter(p => p.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-dark text-lg flex items-center gap-2">
            <Users size={20} className="text-primary" /> Challenge Partners
          </h3>
          <p className="text-grey text-xs mt-0.5">Team up with friends to complete the challenge together</p>
        </div>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="flex items-center gap-1.5 bg-primary text-white px-3 py-2 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors"
        >
          <UserPlus size={16} /> Add Partner
        </button>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h4 className="font-semibold text-amber-800 text-sm mb-3">Partner Requests</h4>
          {pendingRequests.map(req => (
            <div key={req.id} className="flex items-center justify-between bg-white rounded-lg p-3 mb-2 last:mb-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  {req.requester_profile?.avatar_url ? (
                    <img src={req.requester_profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Users size={16} className="text-primary" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-dark text-sm">{req.requester_profile?.full_name || req.requester_profile?.username}</p>
                  <p className="text-grey text-xs">{req.requester_profile?.city}{req.requester_profile?.country ? `, ${req.requester_profile.country}` : ""}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => acceptRequest(req.id)} className="bg-success text-white p-2 rounded-lg hover:bg-success/90">
                  <Check size={14} />
                </button>
                <button onClick={() => declineRequest(req.id)} className="bg-grey-light text-grey-dark p-2 rounded-lg hover:bg-grey-medium/30">
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search to add partner */}
      {showSearch && (
        <div className="bg-card border border-grey-light rounded-xl p-4 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-grey" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Search by name or username..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-grey-light text-sm outline-none focus:border-primary"
              />
            </div>
            <button onClick={handleSearch} disabled={searching} className="bg-primary text-white px-4 rounded-xl text-sm font-medium hover:bg-primary-dark">
              {searching ? <Loader2 size={16} className="animate-spin" /> : "Search"}
            </button>
          </div>
          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {searchResults.map(member => (
                <div key={member.id} className="flex items-center justify-between bg-grey-light/50 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {member.avatar_url ? (
                        <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Users size={16} className="text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-dark text-sm">{member.full_name || member.username}</p>
                      <p className="text-grey text-xs">{member.city}{member.country ? `, ${member.country}` : ""}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => sendRequest(member.id)}
                    disabled={sending === member.id}
                    className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary-dark"
                  >
                    {sending === member.id ? <Loader2 size={12} className="animate-spin" /> : "Invite"}
                  </button>
                </div>
              ))}
            </div>
          )}
          {searchDebug && (
            <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 font-mono">{searchDebug}</p>
          )}
          {searchResults.length === 0 && search && !searching && !searchDebug.includes("profiles,") && (
            <p className="text-grey text-sm text-center py-2">No users found. Try a different name.</p>
          )}
        </div>
      )}

      {/* Active Partners */}
      {partners.length > 0 ? (
        <div className="space-y-3">
          {partners.map(p => {
            const prof = p.partner_profile;
            if (!prof) return null;
            const progress = Math.round(((prof.completed_days?.length || 0) / 30) * 100);
            return (
              <div key={p.id} className="bg-card border border-grey-light rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20">
                    {prof.avatar_url ? (
                      <img src={prof.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Users size={20} className="text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-dark text-sm">{prof.full_name || prof.username}</p>
                    <p className="text-grey text-xs">{prof.city}{prof.country ? `, ${prof.country}` : ""}</p>
                  </div>
                  <button onClick={() => removePartner(p.id)} className="text-grey hover:text-danger p-1">
                    <X size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-grey-dark">Progress</span>
                      <span className="font-bold text-primary">{prof.completed_days?.length || 0}/30</span>
                    </div>
                    <div className="h-2 bg-grey-light rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                    <Trophy size={12} /> Day {prof.current_day || 1}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 bg-card border border-grey-light rounded-xl">
          <Heart size={32} className="text-grey-medium mx-auto mb-3" />
          <p className="text-dark font-semibold text-sm">No partners yet</p>
          <p className="text-grey text-xs mt-1">Invite a friend to do the 30-day challenge together!</p>
        </div>
      )}
    </div>
  );
}
