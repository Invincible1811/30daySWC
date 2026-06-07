"use client";

import { useApp } from "@/lib/store";
import { Heart, MessageCircle, Share2, Plus, X, Send, Camera, Shield } from "lucide-react";
import { useState } from "react";

export default function Testimonies() {
  const { testimonies, addTestimony, likeTestimony, addCommentToTestimony, userName } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [commentingId, setCommentingId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [shareAnonymously, setShareAnonymously] = useState(false);
  const [permissionGiven, setPermissionGiven] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    addTestimony({
      author: shareAnonymously ? "Anonymous" : userName,
      title,
      content,
      date: new Date().toISOString().split("T")[0],
    });
    setTitle("");
    setContent("");
    setPhotoPreview(null);
    setShareAnonymously(false);
    setPermissionGiven(false);
    setShowForm(false);
  };

  const handleComment = (testimonyId: string) => {
    if (!commentText.trim()) return;
    addCommentToTestimony(testimonyId, {
      author: userName,
      content: commentText,
      date: new Date().toISOString().split("T")[0],
    });
    setCommentText("");
    setCommentingId(null);
  };

  const handleShare = async (testimony: { title: string; content: string; author: string }) => {
    const text = `${testimony.title}\n\n${testimony.content}\n\n— ${testimony.author}\n\nShared from Soul-Winning App`;
    if (navigator.share) {
      try {
        await navigator.share({ title: testimony.title, text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      alert("Testimony copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark">Testimonies</h2>
          <p className="text-grey mt-1">Share and celebrate what God is doing through evangelism</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} /> Share Testimony
        </button>
      </div>

      {/* Testimonies Feed */}
      <div className="space-y-4">
        {testimonies.map(t => (
          <div key={t.id} className="bg-card rounded-2xl shadow-sm border border-grey-light overflow-hidden">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-dark text-sm">{t.author}</p>
                  <p className="text-xs text-grey">{t.date}</p>
                </div>
              </div>
              <h3 className="font-bold text-dark text-lg mb-2">{t.title}</h3>
              <p className="text-grey-dark text-sm leading-relaxed">{t.content}</p>
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-grey-light">
                <button
                  onClick={() => likeTestimony(t.id)}
                  className="flex items-center gap-1.5 text-sm text-grey hover:text-danger transition-colors"
                >
                  <Heart size={16} /> {t.likes}
                </button>
                <button
                  onClick={() => setCommentingId(commentingId === t.id ? null : t.id)}
                  className="flex items-center gap-1.5 text-sm text-grey hover:text-primary transition-colors"
                >
                  <MessageCircle size={16} /> {t.comments.length}
                </button>
                <button
                  onClick={() => handleShare(t)}
                  className="flex items-center gap-1.5 text-sm text-grey hover:text-primary transition-colors"
                >
                  <Share2 size={16} /> Share
                </button>
              </div>

              {t.comments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {t.comments.map(c => (
                    <div key={c.id} className="bg-grey-light/50 rounded-lg p-3 ml-6">
                      <p className="text-xs font-medium text-dark">{c.author}</p>
                      <p className="text-xs text-grey-dark mt-0.5">{c.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {commentingId === t.id && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 rounded-lg border border-grey-light text-sm focus:outline-none focus:border-primary"
                    onKeyDown={e => e.key === "Enter" && handleComment(t.id)}
                  />
                  <button onClick={() => handleComment(t.id)} className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark">
                    <Send size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Share Testimony Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full animate-pop-in shadow-2xl">
            <div className="p-5 border-b border-grey-light flex items-center justify-between">
              <h3 className="text-lg font-bold text-dark">Share Your Testimony</h3>
              <button onClick={() => setShowForm(false)} className="text-grey hover:text-dark">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Testimony title..."
                className="w-full px-4 py-3 rounded-xl border border-grey-light text-sm focus:outline-none focus:border-primary"
                required
              />
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Share what God has done through your evangelism..."
                className="w-full px-4 py-3 rounded-xl border border-grey-light text-sm focus:outline-none focus:border-primary resize-none h-32"
                required
              />

              {/* Photo Upload */}
              <div>
                <label className="flex items-center gap-2 text-sm text-grey-dark cursor-pointer hover:text-primary transition-colors">
                  <Camera size={16} />
                  <span>Add a photo (optional)</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </label>
                {photoPreview && (
                  <div className="mt-2 relative inline-block">
                    <img src={photoPreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                    <button type="button" onClick={() => setPhotoPreview(null)} className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white rounded-full flex items-center justify-center">
                      <X size={10} />
                    </button>
                  </div>
                )}
              </div>

              {/* Privacy Options */}
              <div className="bg-grey-light/50 rounded-xl p-3 space-y-2">
                <p className="text-xs font-bold text-grey-dark flex items-center gap-1.5"><Shield size={12} /> Privacy Options</p>
                <label className="flex items-center gap-2 text-xs text-grey-dark cursor-pointer">
                  <input type="checkbox" checked={permissionGiven} onChange={e => setPermissionGiven(e.target.checked)} className="rounded border-grey-light" />
                  I confirm permission was given to share this testimony publicly
                </label>
                <label className="flex items-center gap-2 text-xs text-grey-dark cursor-pointer">
                  <input type="checkbox" checked={shareAnonymously} onChange={e => setShareAnonymously(e.target.checked)} className="rounded border-grey-light" />
                  Share anonymously
                </label>
              </div>

              <button type="submit" disabled={!permissionGiven} className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Share Testimony
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
