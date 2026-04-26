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
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Chat view
  if (view === "chat" && selectedUser) {
    return (
      <div className="animate-fade-in flex flex-col h-[calc(100vh-140px)] lg:h-[calc(100vh-80px)]">
        {/* Chat header */}
        <div className="bg-card rounded-t-2xl border border-grey-light p-4 flex items-center gap-3 shrink-0">
          <button onClick={() => { setView("directory"); setSelectedUser(null); }} className="w-8 h-8 rounded-full bg-grey-light flex items-center justify-center hover:bg-grey-medium/30">
            <ArrowLeft size={18} className="text-grey-dark" />
          </button>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
            {selectedUser.avatar_url ? (
              <img src={selectedUser.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              (selectedUser.full_name || selectedUser.username || "?")[0].toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-dark text-sm truncate">{selectedUser.full_name || selectedUser.username}</p>
            <p className="text-xs text-grey">{[selectedUser.city, selectedUser.country].filter(Boolean).join(", ") || "Location unknown"}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-grey-light/30 border-x border-grey-light p-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle size={40} className="mx-auto text-grey-medium opacity-30 mb-2" />
              <p className="text-grey text-sm">No messages yet. Say hello!</p>
            </div>
          )}
          {messages.map((msg) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  isMe
                    ? "bg-primary text-white rounded-br-md"
                    : "bg-white text-dark border border-grey-light rounded-bl-md"
                }`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${isMe ? "text-blue-200" : "text-grey"}`}>{formatTime(msg.created_at)}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-card rounded-b-2xl border border-grey-light p-3 flex items-center gap-2 shrink-0">
          <input
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-grey-light/50 rounded-xl px-4 py-2.5 text-sm outline-none text-dark border border-grey-light focus:border-primary"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-dark">Members</h2>
        <p className="text-grey mt-1">Connect with fellow soul winners</p>
      </div>

      {/* Tab toggle: Directory vs Messages */}
      <div className="flex gap-2 bg-grey-light rounded-xl p-1">
        <button
          onClick={() => setView("directory")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            view === "directory" ? "bg-white text-primary shadow-sm" : "text-grey-dark"
          }`}
        >
          <Users size={16} /> Directory
        </button>
        <button
          onClick={() => setView("conversations")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 relative ${
            view === "conversations" ? "bg-white text-primary shadow-sm" : "text-grey-dark"
          }`}
        >
          <MessageCircle size={16} /> Messages
          {conversations.reduce((sum, c) => sum + c.unread, 0) > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {conversations.reduce((sum, c) => sum + c.unread, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Directory view */}
      {view === "directory" && (
        <>
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-grey" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, city, or church..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-grey-light text-sm outline-none text-dark focus:border-primary bg-card"
            />
          </div>

          {/* Member count */}
          <p className="text-xs text-grey font-medium">{filteredMembers.length} member{filteredMembers.length !== 1 ? "s" : ""}</p>

          {/* Members list */}
          <div className="space-y-2">
            {filteredMembers.map(m => (
              <div key={m.id} className="bg-card rounded-xl p-4 border border-grey-light shadow-sm flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {m.avatar_url ? (
                    <img src={m.avatar_url} alt="" className="w-11 h-11 rounded-full object-cover" />
                  ) : (
                    (m.full_name || m.username || "?")[0].toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-dark text-sm truncate">{m.full_name || m.username || "User"}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {(m.city || m.country) && (
                      <span className="text-xs text-grey flex items-center gap-1">
                        <MapPin size={11} /> {[m.city, m.country].filter(Boolean).join(", ")}
                      </span>
                    )}
                    {m.church && (
                      <span className="text-xs text-grey flex items-center gap-1">
                        <Church size={11} /> {m.church}
                      </span>
                    )}
                  </div>
                </div>
                {user && m.id !== user.id && (
                  <button
                    onClick={() => openChat(m)}
                    className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors shrink-0"
                  >
                    <MessageCircle size={16} />
                  </button>
                )}
              </div>
            ))}
            {filteredMembers.length === 0 && (
              <div className="text-center py-12">
                <Users size={40} className="mx-auto text-grey-medium opacity-30 mb-2" />
                <p className="text-grey text-sm">No members found</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Conversations view */}
      {view === "conversations" && (
        <div className="space-y-2">
          {conversations.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle size={40} className="mx-auto text-grey-medium opacity-30 mb-2" />
              <p className="text-grey text-sm">No conversations yet. Message someone from the directory!</p>
            </div>
          )}
          {conversations.map(conv => (
            <button
              key={conv.user.id}
              onClick={() => openChat(conv.user)}
              className="w-full bg-card rounded-xl p-4 border border-grey-light shadow-sm flex items-center gap-3 hover:bg-grey-light/30 transition-colors text-left"
            >
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0 relative">
                {conv.user.avatar_url ? (
                  <img src={conv.user.avatar_url} alt="" className="w-11 h-11 rounded-full object-cover" />
                ) : (
                  (conv.user.full_name || conv.user.username || "?")[0].toUpperCase()
                )}
                {conv.unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-dark text-sm truncate">{conv.user.full_name || conv.user.username}</p>
                  <span className="text-[10px] text-grey shrink-0">{formatTime(conv.lastTime)}</span>
                </div>
                <p className={`text-xs mt-0.5 truncate ${conv.unread > 0 ? "text-dark font-medium" : "text-grey"}`}>
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
