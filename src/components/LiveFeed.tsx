"use client";

import { useApp } from "@/lib/store";
import { Heart, BookOpen, HandHeart, Globe, Clock, MessageCircle } from "lucide-react";
import { useEffect } from "react";

interface FeedItem {
  id: string;
  type: "testimony" | "prayer" | "community";
  author: string;
  authorAvatar?: string;
  content: string;
  title?: string;
  date: string;
  likes: number;
}

export default function LiveFeed() {
  const { testimonies, prayers, communityPosts, clearFeedBadge } = useApp();

  useEffect(() => {
    clearFeedBadge();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Merge all posts into one timeline sorted by date (newest first)
  const feedItems: FeedItem[] = [
    ...testimonies.map(t => ({
      id: t.id,
      type: "testimony" as const,
      author: t.author,
      authorAvatar: t.authorAvatar,
      content: t.content,
      title: t.title,
      date: t.date,
      likes: t.likes,
    })),
    ...prayers.map(p => ({
      id: p.id,
      type: "prayer" as const,
      author: p.author,
      authorAvatar: p.authorAvatar,
      content: p.content,
      date: p.date,
      likes: p.likes,
    })),
    ...communityPosts.map(c => ({
      id: c.id,
      type: "community" as const,
      author: c.author,
      authorAvatar: c.authorAvatar,
      content: c.content,
      date: c.date,
      likes: c.likes,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const typeIcon = (type: string) => {
    switch (type) {
      case "testimony": return <BookOpen size={14} className="text-accent" />;
      case "prayer": return <HandHeart size={14} className="text-rose-500" />;
      case "community": return <Globe size={14} className="text-primary" />;
      default: return <MessageCircle size={14} className="text-grey" />;
    }
  };

  const typeLabel = (type: string) => {
    switch (type) {
      case "testimony": return "Testimony";
      case "prayer": return "Prayer Request";
      case "community": return "Community Post";
      default: return "Post";
    }
  };

  const typeGlow = (type: string) => {
    switch (type) {
      case "testimony": return { border: "#F59E0B", glow: "rgba(245,158,11,0.15)", badge: "#F59E0B", badgeBg: "rgba(245,158,11,0.15)" };
      case "prayer": return { border: "#F43F5E", glow: "rgba(244,63,94,0.15)", badge: "#F43F5E", badgeBg: "rgba(244,63,94,0.15)" };
      case "community": return { border: "#22D3EE", glow: "rgba(34,211,238,0.15)", badge: "#22D3EE", badgeBg: "rgba(34,211,238,0.1)" };
      default: return { border: "#6B7280", glow: "rgba(107,114,128,0.1)", badge: "#6B7280", badgeBg: "rgba(107,114,128,0.1)" };
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header — broadcast control room */}
      <div
        className="relative rounded-2xl overflow-hidden mb-6 p-6"
        style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 50%, #0a0a1a 100%)", boxShadow: "0 4px 30px rgba(0,0,255,0.15)" }}
      >
        {/* Star field dots */}
        {[...Array(24)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{
              width: i % 5 === 0 ? 2 : 1,
              height: i % 5 === 0 ? 2 : 1,
              top: `${(i * 37) % 100}%`,
              left: `${(i * 53) % 100}%`,
              opacity: 0.3 + (i % 3) * 0.2,
            }}
          />
        ))}
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="relative">
                <div className="w-3 h-3 bg-green-400 rounded-full" />
                <div className="w-3 h-3 bg-green-400 rounded-full absolute inset-0 animate-ping opacity-60" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-wide">LIVE FEED</h2>
            </div>
            <p className="text-blue-300/70 text-sm">Broadcasting real-time from the community</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-cyan-400">{feedItems.length}</p>
            <p className="text-blue-300/60 text-xs">transmissions</p>
          </div>
        </div>
      </div>

      {feedItems.length === 0 ? (
        <div
          className="rounded-2xl flex flex-col items-center justify-center py-20 text-center"
          style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 100%)" }}
        >
          <Clock size={40} className="mb-3" style={{ color: "#22D3EE" }} />
          <p className="text-white/70 font-semibold">No transmissions yet</p>
          <p className="text-blue-300/40 text-sm mt-1">Activity will appear here as people share</p>
        </div>
      ) : (
        <div
          className="rounded-2xl p-4 space-y-3"
          style={{ background: "linear-gradient(180deg, #080818 0%, #0a0f2e 100%)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)" }}
        >
          {feedItems.map((item, idx) => {
            const glow = typeGlow(item.type);
            return (
              <div
                key={`${item.type}-${item.id}`}
                className="rounded-xl p-4 transition-all hover:scale-[1.01]"
                style={{
                  background: `linear-gradient(135deg, #0d1533 0%, #111827 100%)`,
                  border: `1px solid ${glow.border}40`,
                  boxShadow: `0 0 20px ${glow.glow}, inset 0 1px 0 rgba(255,255,255,0.03)`,
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  {item.authorAvatar ? (
                    <img src={item.authorAvatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" style={{ boxShadow: `0 0 8px ${glow.border}60` }} />
                  ) : (
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                      style={{ background: `${glow.border}20`, color: glow.border, border: `1px solid ${glow.border}40` }}>
                      {item.author.charAt(0)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-sm">{item.author}</span>
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: glow.badgeBg, color: glow.badge, border: `1px solid ${glow.border}40` }}>
                        {typeIcon(item.type)} {typeLabel(item.type)}
                      </span>
                      {idx === 0 && <span className="text-[9px] font-bold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded-full border border-green-400/30">LATEST</span>}
                    </div>
                    {item.title && <p className="font-bold text-white/90 text-sm mt-1">{item.title}</p>}
                    <p className="text-blue-100/60 text-sm mt-1 line-clamp-2">{item.content}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-xs" style={{ color: glow.badge }}>
                        <Heart size={11} /> {item.likes}
                      </span>
                      <span className="text-xs text-blue-300/40">{item.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
