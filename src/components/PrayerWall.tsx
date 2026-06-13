"use client";

import { useApp } from "@/lib/store";
import { Heart, MessageCircle, HandHeart, Plus, X, Send, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

// Sticky note colours: pastel yellow, blue, pink, green, lavender, peach
const NOTE_COLOURS = [
  { bg: "#FEF08A", border: "#EAB308", text: "#713F12", accent: "#92400E" },
  { bg: "#BAE6FD", border: "#0EA5E9", text: "#0C4A6E", accent: "#075985" },
  { bg: "#FBCFE8", border: "#EC4899", text: "#831843", accent: "#9D174D" },
  { bg: "#BBF7D0", border: "#22C55E", text: "#14532D", accent: "#166534" },
  { bg: "#DDD6FE", border: "#8B5CF6", text: "#4C1D95", accent: "#5B21B6" },
  { bg: "#FED7AA", border: "#F97316", text: "#7C2D12", accent: "#9A3412" },
];

// Deterministic tilt based on id string
function getTilt(id: string): number {
  const sum = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const tilts = [-3, -2, -1, 0, 1, 2, 3];
  return tilts[sum % tilts.length];
}

// Pushpin SVG component
function PushPin({ color }: { color: string }) {
  return (
    <svg width="20" height="28" viewBox="0 0 20 28" fill="none" className="drop-shadow-md">
      <circle cx="10" cy="8" r="7" fill={color} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
      <circle cx="10" cy="8" r="3" fill="rgba(255,255,255,0.4)" />
      <rect x="9" y="14" width="2" height="12" rx="1" fill={color} opacity="0.7" />
    </svg>
  );
}

export default function PrayerWall() {
  const { prayers, addPrayer, deletePrayer, likePrayer, prayForRequest, addCommentToPrayer, userName } = useApp();
  const { profile, isAdmin } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState("");
  const [commentingId, setCommentingId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    addPrayer({
      author: userName,
      authorAvatar: profile?.avatar_url || undefined,
      content,
      date: new Date().toISOString().split("T")[0],
    });
    setContent("");
    setShowForm(false);
  };

  const handleComment = (prayerId: string) => {
    if (!commentText.trim()) return;
    addCommentToPrayer(prayerId, {
      author: userName,
      content: commentText,
      date: new Date().toISOString().split("T")[0],
    });
    setCommentText("");
    setCommentingId(null);
  };

  return (
    <div className="animate-fade-in">
      {/* Cork Board Header */}
      <div
        className="relative rounded-2xl overflow-hidden mb-6"
        style={{
          background: "linear-gradient(135deg, #1a0a00 0%, #2d1a0a 40%, #1a0f05 100%)",
          padding: "1.5rem",
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.6), 0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* Subtle wood grain texture overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(255,200,100,0.3) 2px,
              rgba(255,200,100,0.3) 4px
            )`,
          }}
        />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-amber-100 flex items-center gap-2">
              🙏 Prayer Wall
            </h2>
            <p className="text-amber-300/70 text-sm mt-1">Pin your prayer request on the wall</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
            style={{ background: "#FEF08A", color: "#713F12", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
          >
            <Plus size={16} /> Pin Prayer
          </button>
        </div>
      </div>

      {/* Cork Board Wall */}
      <div
        className="relative rounded-2xl p-4 min-h-[400px]"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(180,120,60,0.15) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 70%, rgba(160,100,40,0.1) 0%, transparent 60%),
            linear-gradient(135deg, #8B5E3C 0%, #A0724A 25%, #8B5E3C 50%, #9A6A42 75%, #8B5E3C 100%)
          `,
          boxShadow: "inset 0 2px 12px rgba(0,0,0,0.4), 0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        {/* Cork texture dots */}
        <div className="absolute inset-0 rounded-2xl opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.3) 1px, transparent 0)`,
            backgroundSize: "12px 12px",
          }}
        />

        {prayers.length === 0 && (
          <div className="relative z-10 flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-3">📌</div>
            <p className="text-amber-100/80 font-semibold">The wall is empty</p>
            <p className="text-amber-200/50 text-sm mt-1">Be the first to pin a prayer!</p>
          </div>
        )}

        {/* Sticky Notes Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {prayers.map((prayer, idx) => {
            const colour = NOTE_COLOURS[idx % NOTE_COLOURS.length];
            const tilt = getTilt(prayer.id);
            const canDelete = isAdmin || prayer.author === userName || prayer.author === profile?.full_name;

            return (
              <div
                key={prayer.id}
                className="relative group"
                style={{ transform: `rotate(${tilt}deg)`, transition: "transform 0.2s ease" }}
                onMouseEnter={e => (e.currentTarget.style.transform = `rotate(0deg) scale(1.03)`)}
                onMouseLeave={e => (e.currentTarget.style.transform = `rotate(${tilt}deg)`)}
              >
                {/* Push Pin */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <PushPin color={colour.border} />
                </div>

                {/* Sticky Note Card */}
                <div
                  className="rounded-sm pt-6 pb-4 px-4"
                  style={{
                    background: `linear-gradient(160deg, ${colour.bg} 0%, ${colour.bg}ee 100%)`,
                    boxShadow: `3px 6px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.6)`,
                    borderTop: `3px solid ${colour.border}`,
                    minHeight: "180px",
                  }}
                >
                  {/* Author row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {prayer.authorAvatar ? (
                        <img src={prayer.authorAvatar} alt="" className="w-7 h-7 rounded-full object-cover" style={{ outline: `2px solid ${colour.border}` }} />
                      ) : (
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: colour.border, color: "#fff" }}>
                          {prayer.author.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold" style={{ color: colour.text }}>{prayer.author}</p>
                        <p className="text-[10px] opacity-60" style={{ color: colour.text }}>{prayer.date}</p>
                      </div>
                    </div>
                    {canDelete && (
                      <button
                        onClick={() => { if (confirm("Remove this prayer?")) deletePrayer(prayer.id); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-black/10"
                      >
                        <Trash2 size={12} style={{ color: colour.accent }} />
                      </button>
                    )}
                  </div>

                  {/* Prayer text */}
                  <p className="text-sm leading-relaxed mb-3" style={{ color: colour.text, fontFamily: "'Georgia', serif" }}>
                    {prayer.content}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2" style={{ borderTop: `1px solid ${colour.border}40` }}>
                    <button
                      onClick={() => likePrayer(prayer.id)}
                      className="flex items-center gap-1 text-xs font-semibold transition-transform hover:scale-110"
                      style={{ color: colour.accent }}
                    >
                      <Heart size={13} fill={prayer.likes > 0 ? colour.accent : "none"} /> {prayer.likes}
                    </button>
                    <button
                      onClick={() => prayForRequest(prayer.id)}
                      className="flex items-center gap-1 text-xs font-semibold transition-transform hover:scale-110"
                      style={{ color: colour.accent }}
                    >
                      <HandHeart size={13} /> {prayer.prayerCount}
                    </button>
                    <button
                      onClick={() => setCommentingId(commentingId === prayer.id ? null : prayer.id)}
                      className="flex items-center gap-1 text-xs font-semibold transition-transform hover:scale-110 ml-auto"
                      style={{ color: colour.accent }}
                    >
                      <MessageCircle size={13} /> {prayer.comments.length}
                    </button>
                  </div>

                  {/* Comments */}
                  {prayer.comments.length > 0 && (
                    <div className="mt-2 space-y-1 max-h-24 overflow-y-auto">
                      {prayer.comments.map(c => (
                        <div key={c.id} className="rounded px-2 py-1" style={{ background: `${colour.border}20` }}>
                          <p className="text-[10px] font-bold" style={{ color: colour.text }}>{c.author}</p>
                          <p className="text-[10px]" style={{ color: colour.text }}>{c.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment input */}
                  {commentingId === prayer.id && (
                    <div className="mt-2 flex gap-1">
                      <input
                        type="text"
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        placeholder="Reply..."
                        className="flex-1 px-2 py-1 rounded text-xs focus:outline-none"
                        style={{ background: `${colour.border}20`, color: colour.text, border: `1px solid ${colour.border}60` }}
                        onKeyDown={e => e.key === "Enter" && handleComment(prayer.id)}
                      />
                      <button
                        onClick={() => handleComment(prayer.id)}
                        className="p-1.5 rounded"
                        style={{ background: colour.border }}
                      >
                        <Send size={11} color="#fff" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Tape strip at top for extra flair */}
                <div
                  className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-3 rounded-sm opacity-30"
                  style={{ background: colour.border }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Post Prayer Modal — styled as a fresh sticky note */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className="relative max-w-md w-full rounded-sm animate-pop-in"
            style={{
              background: "linear-gradient(160deg, #FEF08A 0%, #FDE68A 100%)",
              boxShadow: "4px 8px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.7)",
              borderTop: "4px solid #EAB308",
              padding: "0",
            }}
          >
            {/* Pin on modal */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
              <PushPin color="#EAB308" />
            </div>

            <div className="p-6 pt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold" style={{ color: "#713F12", fontFamily: "'Georgia', serif" }}>
                  📌 Pin a Prayer Request
                </h3>
                <button onClick={() => setShowForm(false)} className="opacity-60 hover:opacity-100" style={{ color: "#713F12" }}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Write your prayer request here..."
                  className="w-full px-3 py-3 rounded-sm text-sm focus:outline-none resize-none h-36"
                  style={{
                    background: "rgba(255,255,255,0.4)",
                    color: "#713F12",
                    border: "1px solid #EAB30860",
                    fontFamily: "'Georgia', serif",
                  }}
                  required
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-sm font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "#EAB308", color: "#1a0a00", boxShadow: "0 3px 10px rgba(0,0,0,0.2)" }}
                >
                  📌 Pin to Wall
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
