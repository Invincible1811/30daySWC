"use client";

import { useApp } from "@/lib/store";
import { challengeCards } from "@/lib/data";
import { Heart, MessageCircle, MapPin, Globe, TrendingUp, Users, Award, CalendarDays, Send, Plus, X } from "lucide-react";
import { useState } from "react";

export default function Community() {
  const { communityPosts, likeCommunityPost, addCommunityPost, globalSoulCount, dailyShares, likeDailyShare, addCommentToDailyShare, userName } = useApp();
  const [filter, setFilter] = useState<"all" | "testimony" | "report" | "encouragement" | "milestone">("all");
  const [activeTab, setActiveTab] = useState<"feed" | "daily-shares">("feed");
  const [dayFilter, setDayFilter] = useState<number | null>(null);
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [showCreate, setShowCreate] = useState(false);
  const [newPost, setNewPost] = useState({ content: "", type: "testimony" as "testimony" | "report" | "encouragement" | "milestone", location: "" });

  const filtered = filter === "all" ? communityPosts : communityPosts.filter(p => p.type === filter);

  const typeColors: Record<string, string> = {
    testimony: "bg-primary/10 text-primary",
    report: "bg-success/10 text-success",
    encouragement: "bg-warning/10 text-warning",
    milestone: "bg-danger/10 text-danger",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark">Global Community</h2>
          <p className="text-grey mt-1">Connect with soul winners across the nation</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-md shadow-primary/20"
        >
          <Plus size={16} /> Write Post
        </button>
      </div>

      {/* Create Post Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-[20px] max-w-md w-full shadow-2xl animate-pop-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-grey-light">
              <h3 className="font-bold text-dark text-lg">Write a Post</h3>
              <button onClick={() => setShowCreate(false)} className="w-8 h-8 rounded-full bg-grey-light flex items-center justify-center text-grey-dark hover:bg-grey-medium/30">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-grey-dark block mb-1.5">Post Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["testimony", "report", "encouragement", "milestone"] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setNewPost(p => ({ ...p, type: t }))}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                        newPost.type === t
                          ? "bg-primary/10 text-primary border-primary"
                          : "border-grey-light text-grey-dark hover:border-grey-medium"
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-grey-dark block mb-1.5">Location</label>
                <input
                  value={newPost.location}
                  onChange={e => setNewPost(p => ({ ...p, location: e.target.value }))}
                  placeholder="e.g. Harare, Zimbabwe"
                  className="w-full bg-grey-light/50 rounded-xl px-4 py-2.5 border border-grey-light text-sm outline-none text-dark focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-grey-dark block mb-1.5">Your Message</label>
                <textarea
                  value={newPost.content}
                  onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
                  placeholder="Share what God has done..."
                  rows={4}
                  className="w-full bg-grey-light/50 rounded-xl px-4 py-2.5 border border-grey-light text-sm outline-none text-dark focus:border-primary resize-none"
                />
              </div>
              <button
                onClick={() => {
                  if (!newPost.content.trim()) return;
                  addCommunityPost({
                    author: userName,
                    location: newPost.location.trim() || "Unknown",
                    content: newPost.content.trim(),
                    date: new Date().toISOString().split("T")[0],
                    type: newPost.type,
                  });
                  setNewPost({ content: "", type: "testimony", location: "" });
                  setShowCreate(false);
                }}
                disabled={!newPost.content.trim()}
                className="w-full bg-primary text-white py-3 rounded-xl text-sm font-bold hover:bg-primary-dark transition-all shadow-md shadow-primary/20 disabled:opacity-50"
              >
                Publish Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Stats Banner */}
      <div className="bg-gradient-to-r from-dark to-dark-light rounded-2xl p-5 text-white">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <Globe size={24} className="mx-auto mb-1 text-primary-light" />
            <p className="text-2xl font-bold">{globalSoulCount}</p>
            <p className="text-xs text-grey-medium">Souls Won</p>
          </div>
          <div>
            <Users size={24} className="mx-auto mb-1 text-success" />
            <p className="text-2xl font-bold">342</p>
            <p className="text-xs text-grey-medium">Active Winners</p>
          </div>
          <div>
            <TrendingUp size={24} className="mx-auto mb-1 text-warning" />
            <p className="text-2xl font-bold">89</p>
            <p className="text-xs text-grey-medium">Cities Reached</p>
          </div>
        </div>
      </div>

      {/* Main Tabs: Feed vs Daily Shares */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("feed")}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
            activeTab === "feed" ? "bg-primary text-white" : "bg-card text-grey border border-grey-light hover:border-primary/30"
          }`}
        >
          <Globe size={16} /> Community Feed
        </button>
        <button
          onClick={() => setActiveTab("daily-shares")}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
            activeTab === "daily-shares" ? "bg-primary text-white" : "bg-card text-grey border border-grey-light hover:border-primary/30"
          }`}
        >
          <CalendarDays size={16} /> Daily Shares
        </button>
      </div>

      {activeTab === "feed" && (
        <>
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(["all", "testimony", "report", "encouragement", "milestone"] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === type
                ? "bg-primary text-white"
                : "bg-card text-grey border border-grey-light hover:border-primary/30"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Community Feed */}
      <div className="space-y-4">
        {filtered.map(post => (
          <div key={post.id} className="bg-card rounded-2xl shadow-sm border border-grey-light overflow-hidden">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-dark text-sm">{post.author}</p>
                    <p className="text-xs text-grey flex items-center gap-1">
                      <MapPin size={10} /> {post.location} • {post.date}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeColors[post.type] || ""}`}>
                  {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                </span>
              </div>
              <p className="text-grey-dark text-sm leading-relaxed">{post.content}</p>
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-grey-light">
                <button
                  onClick={() => likeCommunityPost(post.id)}
                  className="flex items-center gap-1.5 text-sm text-grey hover:text-danger transition-colors"
                >
                  <Heart size={16} /> {post.likes}
                </button>
                <span className="flex items-center gap-1.5 text-sm text-grey">
                  <MessageCircle size={16} /> {post.comments.length}
                </span>
              </div>

              {post.comments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {post.comments.map(c => (
                    <div key={c.id} className="bg-grey-light/50 rounded-lg p-3 ml-6">
                      <p className="text-xs font-medium text-dark">{c.author}</p>
                      <p className="text-xs text-grey-dark mt-0.5">{c.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Top Soul Winners */}
      </>
      )}

      {activeTab === "daily-shares" && (
        <>
          {/* Day Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setDayFilter(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                dayFilter === null ? "bg-primary text-white" : "bg-card text-grey border border-grey-light hover:border-primary/30"
              }`}
            >
              All Days
            </button>
            {Array.from(new Set(dailyShares.map(s => s.day))).sort((a, b) => a - b).map(day => (
              <button
                key={day}
                onClick={() => setDayFilter(day)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  dayFilter === day ? "bg-primary text-white" : "bg-card text-grey border border-grey-light hover:border-primary/30"
                }`}
              >
                Day {day}
              </button>
            ))}
          </div>

          {/* Daily Shares Feed */}
          <div className="space-y-4">
            {(dayFilter !== null ? dailyShares.filter(s => s.day === dayFilter) : dailyShares).map(share => {
              const cardData = challengeCards[share.day - 1];
              return (
                <div key={share.id} className="bg-card rounded-2xl shadow-sm border border-grey-light overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-5 py-3 border-b border-grey-light">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} className="text-primary" />
                        <span className="text-sm font-bold text-primary">Day {share.day}</span>
                        {cardData && <span className="text-xs text-grey">— {cardData.title}</span>}
                      </div>
                      <span className="text-xs text-grey">{share.date}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {share.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-dark text-sm">{share.author}</p>
                        <p className="text-xs text-grey">Shared their Day {share.day} record</p>
                      </div>
                    </div>

                    {/* Impact Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-primary/5 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-primary">{share.soulsSaved}</p>
                        <p className="text-xs text-grey">Souls Saved</p>
                      </div>
                      <div className="bg-success/5 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-success">{share.peoplePrayedFor}</p>
                        <p className="text-xs text-grey">Prayed For</p>
                      </div>
                      <div className="bg-warning/5 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-warning">{share.invitationsToChurch}</p>
                        <p className="text-xs text-grey">Church Invites</p>
                      </div>
                    </div>

                    {/* Reflections */}
                    {Object.entries(share.reflectionAnswers).filter(([, v]) => v.trim()).length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-grey uppercase mb-2">Reflections</h4>
                        {Object.entries(share.reflectionAnswers).filter(([, v]) => v.trim()).map(([question, answer], i) => (
                          <div key={i} className="mb-2">
                            <p className="text-xs font-medium text-grey-dark">{question}</p>
                            <p className="text-sm text-dark bg-grey-light/50 rounded-lg p-2 mt-1">{answer}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Healing Testimonies */}
                    {share.healingTestimonies && share.healingTestimonies.trim() && (
                      <div className="bg-rose-50 rounded-xl p-3 mb-4">
                        <h4 className="text-xs font-semibold text-rose-800 mb-1">Healing & Miracle Testimonies</h4>
                        <p className="text-sm text-rose-700">{share.healingTestimonies}</p>
                      </div>
                    )}

                    {/* Like & Comment */}
                    <div className="flex items-center gap-4 pt-3 border-t border-grey-light">
                      <button
                        onClick={() => likeDailyShare(share.id)}
                        className="flex items-center gap-1.5 text-sm text-grey hover:text-danger transition-colors"
                      >
                        <Heart size={16} /> {share.likes}
                      </button>
                      <span className="flex items-center gap-1.5 text-sm text-grey">
                        <MessageCircle size={16} /> {share.comments.length}
                      </span>
                    </div>

                    {/* Comments */}
                    {share.comments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {share.comments.map(c => (
                          <div key={c.id} className="bg-grey-light/50 rounded-lg p-3 ml-6">
                            <p className="text-xs font-medium text-dark">{c.author}</p>
                            <p className="text-xs text-grey-dark mt-0.5">{c.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment */}
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={commentTexts[share.id] || ""}
                        onChange={(e) => setCommentTexts(prev => ({ ...prev, [share.id]: e.target.value }))}
                        placeholder="Write a comment..."
                        className="flex-1 border border-grey-light rounded-xl px-3 py-2 text-sm text-dark placeholder:text-grey focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <button
                        onClick={() => {
                          const text = commentTexts[share.id]?.trim();
                          if (!text) return;
                          addCommentToDailyShare(share.id, { author: userName, content: text, date: new Date().toISOString().split("T")[0] });
                          setCommentTexts(prev => ({ ...prev, [share.id]: "" }));
                        }}
                        className="bg-primary text-white px-3 py-2 rounded-xl hover:bg-primary-dark transition-colors"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {dailyShares.length === 0 && (
              <div className="text-center py-12 text-grey">
                <CalendarDays size={48} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No daily shares yet</p>
                <p className="text-sm mt-1">Complete a challenge and share your record to see it here!</p>
              </div>
            )}
          </div>
        </>
      )}

      <div className="bg-card rounded-2xl p-5 shadow-sm border border-grey-light">
        <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
          <Award className="text-warning" size={20} /> Top Soul Winners This Month
        </h3>
        <div className="space-y-3">
          {[
            { rank: 1, name: "Evangelist Tapiwa", city: "Harare", souls: 47 },
            { rank: 2, name: "Pastor Chipo", city: "Bulawayo", souls: 38 },
            { rank: 3, name: "Brother Kudzi", city: "Mutare", souls: 31 },
            { rank: 4, name: "Sister Nyasha", city: "Gweru", souls: 25 },
            { rank: 5, name: "Deacon Samuel", city: "Masvingo", souls: 22 },
          ].map(winner => (
            <div key={winner.rank} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                winner.rank === 1 ? "bg-warning/20 text-warning" :
                winner.rank === 2 ? "bg-grey-medium/30 text-grey-dark" :
                winner.rank === 3 ? "bg-orange-100 text-orange-600" :
                "bg-grey-light text-grey"
              }`}>
                {winner.rank}
              </div>
              <div className="flex-1">
                <p className="font-medium text-dark text-sm">{winner.name}</p>
                <p className="text-xs text-grey">{winner.city}</p>
              </div>
              <p className="font-bold text-primary text-sm">{winner.souls} souls</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
