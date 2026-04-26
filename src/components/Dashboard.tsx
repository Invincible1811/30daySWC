"use client";

import { useApp } from "@/lib/store";
import { challengeCards } from "@/lib/data";
import {
  Users, UserPlus, Globe, BookOpen, Trophy,
  Heart, ArrowRight, Flame, Target,
  HandHeart, MessageCircle, CalendarDays, Wrench, Award, Shield,
  User, LogOut, Bell, Settings
} from "lucide-react";
import { useState } from "react";
import type { Page } from "./Navigation";
import ShareInvite from "./ShareInvite";
import { useAuth } from "@/lib/auth-context";

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

const featureCards: { icon: React.ElementType; label: string; desc: string; page: Page; gradient: string }[] = [
  { icon: BookOpen, label: "30-Day Challenge", desc: "Daily evangelism challenges", page: "challenges", gradient: "from-blue-500 to-blue-600" },
  { icon: UserPlus, label: "Log Souls", desc: "Record souls won for Christ", page: "souls", gradient: "from-emerald-500 to-emerald-600" },
  { icon: Heart, label: "Prayer Wall", desc: "Share & pray together", page: "prayer", gradient: "from-purple-500 to-purple-600" },
  { icon: MessageCircle, label: "Testimonies", desc: "Share your stories", page: "testimonies", gradient: "from-amber-500 to-amber-600" },
  { icon: Globe, label: "Community", desc: "Connect with believers", page: "community", gradient: "from-teal-500 to-teal-600" },
  { icon: Wrench, label: "Evangelism Toolkit", desc: "Resources & materials", page: "toolkit", gradient: "from-indigo-500 to-indigo-600" },
  { icon: Users, label: "Groups & Teams", desc: "Outreach communities", page: "groups", gradient: "from-orange-500 to-orange-600" },
  { icon: CalendarDays, label: "Events", desc: "Upcoming outreach", page: "events", gradient: "from-rose-500 to-rose-600" },
  { icon: HandHeart, label: "Follow Up", desc: "Track new converts", page: "followup", gradient: "from-cyan-500 to-cyan-600" },
  { icon: Trophy, label: "Leaderboard", desc: "Top soul winners", page: "leaderboard", gradient: "from-yellow-500 to-yellow-600" },
  { icon: Award, label: "Coming Soon", desc: "Scholarships & more", page: "comingsoon", gradient: "from-slate-500 to-slate-600" },
];

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { souls, currentDay, completedDays, globalSoulCount, userName, communityPosts } = useApp();
  const { profile, isAdmin, signOut } = useAuth();
  const [showChallenge, setShowChallenge] = useState(false);
  const displayName = profile?.full_name || profile?.username || userName;
  const initials = (displayName || "U").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const mySoulCount = souls.length;
  const todayChallenge = challengeCards[Math.min(currentDay - 1, 29)];
  const progress = (completedDays.length / 30) * 100;

  const allFeatures = isAdmin
    ? [...featureCards, { icon: Shield, label: "Admin", desc: "Manage app & users", page: "admin" as Page, gradient: "from-red-600 to-red-700" }]
    : featureCards;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Dashboard</h1>
          <p className="text-grey text-sm">Plan, prioritize, and win souls for Christ.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowChallenge(true)}
            className="hidden sm:flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
          >
            + Today&apos;s Challenge
          </button>
          <button
            onClick={() => onNavigate("souls")}
            className="hidden sm:flex items-center gap-2 border border-grey-light text-dark px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-grey-light/50 transition-colors"
          >
            Log a Soul
          </button>
          <button onClick={() => onNavigate("profile")} className="relative">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-grey-light" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow">
                {initials}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Hero Welcome + User Card Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Welcome Card — takes 2 cols on desktop */}
        <div className="lg:col-span-2 bg-gradient-to-br from-primary via-primary to-primary-dark rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <p className="text-blue-200 text-sm font-medium">Welcome back,</p>
            <h2 className="text-2xl font-bold mt-1">{displayName} 🔥</h2>
            <p className="text-blue-200/80 text-sm mt-2">Day {Math.min(currentDay, 30)} of 30 — Keep winning souls!</p>
            <div className="mt-5 flex gap-3 sm:hidden">
              <button
                onClick={() => setShowChallenge(true)}
                className="bg-white text-primary font-semibold px-4 py-2 rounded-lg text-sm"
              >
                Today&apos;s Challenge
              </button>
              <button
                onClick={() => onNavigate("souls")}
                className="bg-white/20 text-white font-semibold px-4 py-2 rounded-lg text-sm"
              >
                Log a Soul
              </button>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-grey-light flex flex-col items-center justify-center text-center">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover border-3 border-primary/20 mb-3" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-xl mb-3 shadow-lg">
              {initials}
            </div>
          )}
          <h3 className="font-bold text-dark text-base">{displayName}</h3>
          <p className="text-grey text-xs mt-0.5">@{profile?.username || "user"}</p>
          <span className="mt-2 text-[10px] font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">
            {profile?.role === "admin" ? "Admin" : profile?.role === "assistant_admin" ? "Assistant" : "Soul Winner"}
          </span>
          <div className="flex gap-2 mt-3">
            <button onClick={() => onNavigate("profile")} className="p-2 rounded-lg bg-grey-light/70 text-grey-dark hover:bg-grey-light transition-colors" title="Profile">
              <Settings size={16} />
            </button>
            <button onClick={signOut} className="p-2 rounded-lg bg-grey-light/70 text-grey-dark hover:bg-red-50 hover:text-red-500 transition-colors" title="Sign Out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating share button */}
      <ShareInvite variant="floating" />

      {/* Stats Grid — Donezo style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-5 text-white relative overflow-hidden">
          <div className="absolute top-2 right-2 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
            <ArrowRight size={14} />
          </div>
          <UserPlus size={20} className="mb-2 opacity-80" />
          <p className="text-3xl font-bold">{mySoulCount}</p>
          <p className="text-blue-200 text-xs mt-1">My Souls Won</p>
        </div>
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-grey-light">
          <div className="absolute top-2 right-2 w-8 h-8 rounded-full" />
          <Globe size={20} className="text-emerald-500 mb-2" />
          <p className="text-3xl font-bold text-dark">{globalSoulCount}</p>
          <p className="text-grey text-xs mt-1">Global Souls</p>
        </div>
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-grey-light">
          <Target size={20} className="text-amber-500 mb-2" />
          <p className="text-3xl font-bold text-dark">{completedDays.length}/30</p>
          <p className="text-grey text-xs mt-1">Days Completed</p>
        </div>
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-grey-light">
          <Flame size={20} className="text-red-500 mb-2" />
          <p className="text-3xl font-bold text-dark">{completedDays.length}<span className="text-sm font-normal text-grey ml-1">days</span></p>
          <p className="text-grey text-xs mt-1">Current Streak</p>
        </div>
      </div>

      {/* Bento Row: Progress + Today's Challenge */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Challenge Progress */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-grey-light">
          <h3 className="font-bold text-dark mb-4">Challenge Progress</h3>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#E5E7EB" strokeWidth="10" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="#1E40AF" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${progress * 3.267} ${326.7 - progress * 3.267}`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-dark">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-grey">
            <span>Day 1</span>
            <span className="font-semibold text-primary">{completedDays.length} of 30 days</span>
            <span>Day 30</span>
          </div>
        </div>

        {/* Today's Challenge Preview */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-grey-light">
          <h3 className="font-bold text-dark mb-3">Today&apos;s Challenge</h3>
          {todayChallenge && (
            <>
              <div className="bg-primary/5 rounded-xl p-4 mb-3">
                <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">Day {todayChallenge.day} — {todayChallenge.theme}</p>
                <h4 className="font-bold text-dark">{todayChallenge.title}</h4>
                <p className="text-sm text-grey-dark mt-2 line-clamp-2">{todayChallenge.challenge}</p>
              </div>
              <button
                onClick={() => setShowChallenge(true)}
                className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors"
              >
                View Full Challenge
              </button>
            </>
          )}
        </div>
      </div>

      {/* Feature Grid */}
      <div>
        <h3 className="font-bold text-dark text-lg mb-3">Explore Features</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {allFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <button
                key={feat.page}
                onClick={() => onNavigate(feat.page)}
                className="group flex flex-col items-center text-center gap-2.5 p-4 rounded-2xl bg-card border border-grey-light shadow-sm hover:shadow-lg hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={22} />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-dark leading-tight block">{feat.label}</span>
                  <span className="text-[9px] text-grey hidden sm:block mt-0.5">{feat.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent Souls */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-grey-light">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-dark">Recent Souls Won</h3>
            <button onClick={() => onNavigate("souls")} className="text-primary text-sm flex items-center gap-1 hover:underline font-medium">
              View All <ArrowRight size={14} />
            </button>
          </div>
          {souls.slice(0, 3).map(soul => (
            <div key={soul.id} className="flex items-center gap-3 py-2.5 border-b border-grey-light last:border-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                {soul.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-dark text-sm truncate">{soul.name}</p>
                <p className="text-xs text-grey">{soul.location} • {soul.date}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                soul.followUpStatus === "completed" ? "bg-success/10 text-success" :
                soul.followUpStatus === "in_progress" ? "bg-warning/10 text-warning" :
                "bg-danger/10 text-danger"
              }`}>
                {soul.followUpStatus === "in_progress" ? "In Progress" : soul.followUpStatus.charAt(0).toUpperCase() + soul.followUpStatus.slice(1)}
              </span>
            </div>
          ))}
          {souls.length === 0 && (
            <p className="text-grey text-sm text-center py-6">No souls logged yet. Start winning!</p>
          )}
        </div>

        {/* Community Highlights */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-grey-light">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-dark">Community Highlights</h3>
            <button onClick={() => onNavigate("community")} className="text-primary text-sm flex items-center gap-1 hover:underline font-medium">
              View All <ArrowRight size={14} />
            </button>
          </div>
          {communityPosts.slice(0, 3).map(post => (
            <div key={post.id} className="py-2.5 border-b border-grey-light last:border-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs">
                  {post.author.charAt(0)}
                </div>
                <span className="font-medium text-sm text-dark">{post.author}</span>
                <span className="text-xs text-grey">• {post.location}</span>
              </div>
              <p className="text-sm text-grey-dark line-clamp-2">{post.content}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-grey">❤️ {post.likes}</span>
                <span className="text-xs text-grey">💬 {post.comments.length}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Challenge Pop-up Modal */}
      {showChallenge && todayChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full animate-pop-in shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen size={32} />
              </div>
              <p className="text-blue-200 text-sm">Day {todayChallenge.day} of 30</p>
              <h3 className="text-xl font-bold mt-1">{todayChallenge.title}</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-primary font-semibold uppercase tracking-wide">{todayChallenge.theme}</p>
              <div>
                <h4 className="font-semibold text-dark text-sm mb-1">📋 Today&apos;s Challenge:</h4>
                <p className="text-grey-dark text-sm">{todayChallenge.challenge}</p>
              </div>
              <div className="bg-primary/5 rounded-lg p-3">
                <p className="text-primary text-sm italic">&ldquo;{todayChallenge.keyScripture}&rdquo;</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <h4 className="font-semibold text-green-800 text-sm mb-1">💚 Encouragement:</h4>
                <p className="text-green-700 text-sm italic">&ldquo;{todayChallenge.encouragement}&rdquo;</p>
              </div>
              <div className="flex gap-2 text-xs text-grey-dark">
                <span className="bg-grey-light px-2 py-1 rounded-lg">📚 {todayChallenge.dailyReading}</span>
                <span className="bg-grey-light px-2 py-1 rounded-lg">📍 {todayChallenge.locationSuggestions}</span>
              </div>
              <button
                onClick={() => setShowChallenge(false)}
                className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
              >
                Accept Challenge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
