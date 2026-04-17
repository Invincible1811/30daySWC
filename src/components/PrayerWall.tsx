"use client";

import { useApp } from "@/lib/store";
import { Heart, MessageCircle, HandHeart, Plus, X, Send } from "lucide-react";
import { useState } from "react";

export default function PrayerWall() {
  const { prayers, addPrayer, likePrayer, prayForRequest, addCommentToPrayer, userName } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState("");
  const [commentingId, setCommentingId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    addPrayer({
      author: userName,
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark">Prayer Wall</h2>
          <p className="text-grey mt-1">Lift each other up in prayer for evangelism</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} /> Post Prayer
        </button>
      </div>

      {/* Prayer Feed */}
      <div className="space-y-4">
        {prayers.map(prayer => (
          <div key={prayer.id} className="bg-card rounded-2xl shadow-sm border border-grey-light overflow-hidden">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {prayer.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-dark text-sm">{prayer.author}</p>
                  <p className="text-xs text-grey">{prayer.date}</p>
                </div>
              </div>
              <p className="text-grey-dark text-sm leading-relaxed">{prayer.content}</p>
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-grey-light">
                <button
                  onClick={() => likePrayer(prayer.id)}
                  className="flex items-center gap-1.5 text-sm text-grey hover:text-danger transition-colors"
                >
                  <Heart size={16} /> {prayer.likes}
                </button>
                <button
                  onClick={() => prayForRequest(prayer.id)}
                  className="flex items-center gap-1.5 text-sm text-grey hover:text-primary transition-colors"
                >
                  <HandHeart size={16} /> {prayer.prayerCount} Praying
                </button>
                <button
                  onClick={() => setCommentingId(commentingId === prayer.id ? null : prayer.id)}
                  className="flex items-center gap-1.5 text-sm text-grey hover:text-primary transition-colors"
                >
                  <MessageCircle size={16} /> {prayer.comments.length}
                </button>
              </div>

              {/* Comments */}
              {prayer.comments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {prayer.comments.map(c => (
                    <div key={c.id} className="bg-grey-light/50 rounded-lg p-3 ml-6">
                      <p className="text-xs font-medium text-dark">{c.author}</p>
                      <p className="text-xs text-grey-dark mt-0.5">{c.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Comment Input */}
              {commentingId === prayer.id && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 rounded-lg border border-grey-light text-sm focus:outline-none focus:border-primary"
                    onKeyDown={e => e.key === "Enter" && handleComment(prayer.id)}
                  />
                  <button
                    onClick={() => handleComment(prayer.id)}
                    className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark"
                  >
                    <Send size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Post Prayer Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full animate-pop-in shadow-2xl">
            <div className="p-5 border-b border-grey-light flex items-center justify-between">
              <h3 className="text-lg font-bold text-dark">Post a Prayer Request</h3>
              <button onClick={() => setShowForm(false)} className="text-grey hover:text-dark">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Share your prayer request for evangelism..."
                className="w-full px-4 py-3 rounded-xl border border-grey-light text-sm focus:outline-none focus:border-primary resize-none h-32"
                required
              />
              <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors">
                Post Prayer Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
