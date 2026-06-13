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

  const typeBg = (type: string) => {
    switch (type) {
      case "testimony": return "bg-accent/10 border-accent/20";
      case "prayer": return "bg-rose-50 border-rose-200";
      case "community": return "bg-primary/5 border-primary/20";
      default: return "bg-grey-light border-grey-light";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
          <h2 className="text-2xl font-bold text-dark">Live Feed</h2>
        </div>
        <p className="text-grey mt-1">Real-time activity from the community</p>
      </div>

      {feedItems.length === 0 ? (
        <div className="text-center py-16">
          <Clock size={40} className="mx-auto text-grey-light mb-3" />
          <p className="text-grey font-medium">No activity yet</p>
          <p className="text-grey text-sm mt-1">Posts will appear here as people share</p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedItems.map(item => (
            <div key={`${item.type}-${item.id}`} className={`rounded-xl border p-4 ${typeBg(item.type)}`}>
              <div className="flex items-start gap-3">
                {/* Avatar */}
                {item.authorAvatar ? (
                  <img src={item.authorAvatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center text-dark font-bold text-sm shrink-0">
                    {item.author.charAt(0)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-dark text-sm">{item.author}</span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-grey bg-white/60 px-2 py-0.5 rounded-full">
                      {typeIcon(item.type)} {typeLabel(item.type)}
                    </span>
                  </div>

                  {/* Title (testimonies only) */}
                  {item.title && (
                    <p className="font-bold text-dark text-sm mt-1">{item.title}</p>
                  )}

                  {/* Content */}
                  <p className="text-grey-dark text-sm mt-1 line-clamp-3">{item.content}</p>

                  {/* Footer */}
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-xs text-grey">
                      <Heart size={12} /> {item.likes}
                    </span>
                    <span className="text-xs text-grey">{item.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
