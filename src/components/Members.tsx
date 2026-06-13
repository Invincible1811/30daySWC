"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Users, MapPin, MessageCircle, Search, Send, X, ArrowLeft, User, Church } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

interface MemberProfile {
  id: string;
  username: string;
  full_name: string;
  city: string;
  country: string;
  church: string;
  avatar_url: string;
  bio: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

interface Conversation {
  user: MemberProfile;
  lastMessage: string;
  lastTime: string;
  unread: number;
}

export default function Members() {
  const { user } = useAuth();
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"directory" | "conversations" | "chat">("directory");
  const [selectedUser, setSelectedUser] = useState<MemberProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all members
  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, username, full_name, city, country, church, avatar_url, bio")
        .order("full_name", { ascending: true });
      setMembers((data || []) as MemberProfile[]);
      setLoading(false);
    })();
  }, []);

  // Fetch conversations
  const loadConversations = useCallback(async () => {
    if (!isSupabaseConfigured || !user) return;
    const { data: msgs } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (!msgs) return;

    const convMap = new Map<string, { messages: Message[] }>();
    (msgs as Message[]).forEach(m => {
      const otherId = m.sender_id === user.id ? m.receiver_id : m.sender_id;
      if (!convMap.has(otherId)) convMap.set(otherId, { messages: [] });
      convMap.get(otherId)!.messages.push(m);
    });

    const convs: Conversation[] = [];
    convMap.forEach((val, otherId) => {
      const member = members.find(m => m.id === otherId);
      if (!member) return;
      const last = val.messages[0];
      const unread = val.messages.filter(m => m.receiver_id === user.id && !m.read).length;
      convs.push({
        user: member,
        lastMessage: last.content,
        lastTime: last.created_at,
        unread,
      });
    });

    convs.sort((a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime());
    setConversations(convs);
  }, [user, members]);

  useEffect(() => {
    if (members.length > 0) loadConversations();
  }, [members, loadConversations]);

  // Load chat messages for selected user
  const loadMessages = useCallback(async (otherUserId: string) => {
    if (!isSupabaseConfigured || !user) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
      .order("created_at", { ascending: true });
    setMessages((data || []) as Message[]);

    // Mark unread messages as read
    await supabase
      .from("messages")
      .update({ read: true })
      .eq("sender_id", otherUserId)
      .eq("receiver_id", user.id)
      .eq("read", false);
  }, [user]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Real-time subscription for new messages
  useEffect(() => {
    if (!isSupabaseConfigured || !user) return;
    const channel = supabase
      .channel("messages-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const msg = payload.new as Message;
        if (msg.sender_id === user.id || msg.receiver_id === user.id) {
          if (selectedUser && (msg.sender_id === selectedUser.id || msg.receiver_id === selectedUser.id)) {
            setMessages(prev => [...prev, msg]);
            // Mark as read if we're viewing this chat
            if (msg.sender_id === selectedUser.id) {
              supabase.from("messages").update({ read: true }).eq("id", msg.id);
            }
          }
          loadConversations();
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, selectedUser, loadConversations]);

  const openChat = (member: MemberProfile) => {
    setSelectedUser(member);
    setView("chat");
    loadMessages(member.id);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !user || sending) return;
    setSending(true);
    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: selectedUser.id,
      content: newMessage.trim(),
    });
    setNewMessage("");
    setSending(false);
    await loadMessages(selectedUser.id);
  };

  const filteredMembers = members.filter(m => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      m.username?.toLowerCase().includes(q) ||
      m.full_name?.toLowerCase().includes(q) ||
      m.city?.toLowerCase().includes(q) ||
      m.country?.toLowerCase().includes(q) ||
      m.church?.toLowerCase().includes(q)
    );
  });

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h`;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20" style={{ background: "#fdf6e3" }}>
        <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Chat view
  if (view === "chat" && selectedUser) {
    return (
      <div className="animate-fade-in flex flex-col h-[calc(100vh-140px)] lg:h-[calc(100vh-80px)]" style={{ background: "#fdf6e3" }}>
        {/* Chat header */}
        <div className="rounded-t-2xl p-4 flex items-center gap-3 shrink-0" style={{ background: "#f5e6c8", borderBottom: "2px solid #d4a96a" }}>
          <button onClick={() => { setView("directory"); setSelectedUser(null); }} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.08)" }}>
            <ArrowLeft size={18} style={{ color: "#78350f" }} />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-sm font-bold" style={{ background: "#e2c88e", color: "#78350f", border: "2px solid #d4a96a" }}>
            {selectedUser.avatar_url ? (
              <img src={selectedUser.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              (selectedUser.full_name || selectedUser.username || "?")[0].toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate" style={{ color: "#3b1a00" }}>{selectedUser.full_name || selectedUser.username}</p>
            <p className="text-xs" style={{ color: "#a16207" }}>{[selectedUser.city, selectedUser.country].filter(Boolean).join(", ") || "Location unknown"}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: "#fef9ee" }}>
          {messages.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle size={40} className="mx-auto mb-2" style={{ color: "#d4a96a", opacity: 0.4 }} />
              <p className="text-sm" style={{ color: "#a16207" }}>No messages yet. Say hello!</p>
            </div>
          )}
          {messages.map((msg) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5`}
                  style={isMe
                    ? { background: "linear-gradient(135deg, #d97706, #b45309)", color: "#fff", borderBottomRightRadius: 4 }
                    : { background: "#fff", color: "#3b1a00", border: "1px solid #e2c88e", borderBottomLeftRadius: 4 }}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p className="text-[10px] mt-1" style={{ opacity: 0.6 }}>{formatTime(msg.created_at)}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="rounded-b-2xl p-3 flex items-center gap-2 shrink-0" style={{ background: "#f5e6c8", borderTop: "2px solid #d4a96a" }}>
          <input
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
            style={{ background: "#fff", border: "1px solid #d4a96a", color: "#3b1a00" }}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #d97706, #b45309)", color: "#fff" }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    );
  }

  const CARD_ROTATIONS = [-2, 1.5, -1, 2.5, -1.5, 1, -2.5, 2];

  return (
    <div className="animate-fade-in space-y-5" style={{ background: "#fdf6e3", borderRadius: 24, padding: "0 0 16px 0" }}>
      {/* Photo Wall Header */}
      <div
        className="relative overflow-hidden rounded-2xl p-6"
        style={{
          background: "linear-gradient(135deg, #3b1a00 0%, #78350f 50%, #3b1a00 100%)",
          boxShadow: "0 4px 20px rgba(120,53,15,0.3)",
        }}
      >
        {/* String/wire line decoration */}
        <div className="absolute top-5 left-0 right-0 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />
        <div className="absolute top-0 bottom-0 left-8 w-px" style={{ background: "rgba(255,255,255,0.07)" }} />
        <div className="absolute top-0 bottom-0 right-8 w-px" style={{ background: "rgba(255,255,255,0.07)" }} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">📸</span>
              <h2 className="text-2xl font-bold text-white">Members</h2>
            </div>
            <p className="text-amber-200/60 text-sm">Connect with fellow soul winners</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-amber-300">{members.length}</p>
            <p className="text-amber-200/50 text-xs">worldwide</p>
          </div>
        </div>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-2 mx-0 px-1" style={{ background: "#f0d9a8", borderRadius: 16, padding: 6 }}>
        <button
          onClick={() => setView("directory")}
          className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
          style={view === "directory"
            ? { background: "#3b1a00", color: "#fde68a", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }
            : { background: "transparent", color: "#a16207" }}
        >
          <Users size={15} /> Directory
        </button>
        <button
          onClick={() => setView("conversations")}
          className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 relative"
          style={view === "conversations"
            ? { background: "#3b1a00", color: "#fde68a", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }
            : { background: "transparent", color: "#a16207" }}
        >
          <MessageCircle size={15} /> Messages
          {conversations.reduce((sum, c) => sum + c.unread, 0) > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {conversations.reduce((sum, c) => sum + c.unread, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Directory view */}
      {view === "directory" && (
        <div className="space-y-4 px-1">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#a16207" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, city, or church..."
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: "#fff", border: "2px solid #e2c88e", color: "#3b1a00" }}
            />
          </div>

          <p className="text-xs font-semibold" style={{ color: "#a16207" }}>{filteredMembers.length} member{filteredMembers.length !== 1 ? "s" : ""}</p>

          {/* Polaroid grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredMembers.map((m, idx) => (
              <div
                key={m.id}
                className="group flex flex-col items-center transition-all duration-300 hover:scale-105 hover:z-10"
                style={{ transform: `rotate(${CARD_ROTATIONS[idx % CARD_ROTATIONS.length]}deg)` }}
              >
                {/* Polaroid card */}
                <div className="w-full rounded-sm overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow"
                  style={{ background: "#fff", border: "1px solid #e5d5b0", padding: "8px 8px 28px 8px" }}>
                  {/* Photo area */}
                  <div className="w-full aspect-square rounded-sm overflow-hidden flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #f5e6c8, #e2c88e)" }}>
                    {m.avatar_url ? (
                      <img src={m.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-black" style={{ color: "#78350f" }}>
                        {(m.full_name || m.username || "?")[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  {/* Polaroid caption */}
                  <div className="mt-2 text-center" style={{ fontFamily: "Georgia, serif" }}>
                    <p className="text-xs font-bold truncate" style={{ color: "#3b1a00" }}>{m.full_name || m.username || "Member"}</p>
                    {(m.city || m.country) && (
                      <p className="text-[10px] truncate" style={{ color: "#a16207" }}>{[m.city, m.country].filter(Boolean).join(", ")}</p>
                    )}
                  </div>
                </div>
                {/* Chat button */}
                {user && m.id !== user.id && (
                  <button
                    onClick={() => openChat(m)}
                    className="mt-2 flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "#3b1a00", color: "#fde68a" }}
                  >
                    <MessageCircle size={12} /> Message
                  </button>
                )}
              </div>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <span className="text-4xl">📭</span>
              <p className="text-sm mt-2" style={{ color: "#a16207" }}>No members found</p>
            </div>
          )}
        </div>
      )}

      {/* Conversations view */}
      {view === "conversations" && (
        <div className="space-y-2 px-1">
          {conversations.length === 0 && (
            <div className="text-center py-12">
              <span className="text-4xl">💬</span>
              <p className="text-sm mt-2" style={{ color: "#a16207" }}>No conversations yet. Message someone!</p>
            </div>
          )}
          {conversations.map(conv => (
            <button
              key={conv.user.id}
              onClick={() => openChat(conv.user)}
              className="w-full rounded-2xl p-4 flex items-center gap-3 text-left transition-all hover:scale-[1.01]"
              style={{ background: "#fff", border: "2px solid #e2c88e", boxShadow: "2px 3px 0 #d4a96a" }}
            >
              <div className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center text-sm font-bold shrink-0 relative"
                style={{ background: "#f5e6c8", color: "#78350f", border: "2px solid #d4a96a" }}>
                {conv.user.avatar_url ? (
                  <img src={conv.user.avatar_url} alt="" className="w-11 h-11 rounded-full object-cover" />
                ) : (
                  (conv.user.full_name || conv.user.username || "?")[0].toUpperCase()
                )}
                {conv.unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm truncate" style={{ color: "#3b1a00" }}>{conv.user.full_name || conv.user.username}</p>
                  <span className="text-[10px] shrink-0" style={{ color: "#a16207" }}>{formatTime(conv.lastTime)}</span>
                </div>
                <p className={`text-xs mt-0.5 truncate`} style={{ color: conv.unread > 0 ? "#3b1a00" : "#a16207", fontWeight: conv.unread > 0 ? 600 : 400 }}>
                  {conv.lastMessage}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
