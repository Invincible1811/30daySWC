"use client";

import { useApp } from "@/lib/store";
import { challengeCards } from "@/lib/data";
import {
  Users, UserPlus, Globe, BookOpen, Trophy,
  Heart, ArrowRight, Flame, Target, ChevronRight,
  HandHeart, MessageCircle, CalendarDays, Wrench, Award, Shield,
  User, LogOut, Settings, Sparkles, TrendingUp, X
} from "lucide-react";
import { useState } from "react";
import type { Page } from "./Navigation";
import ShareInvite from "./ShareInvite";
import { useAuth } from "@/lib/auth-context";

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

const featureCards: { icon: React.ElementType; label: string; desc: string; page: Page; color: string; bg: string; iconBg: string }[] = [
  { icon: BookOpen, label: "30-Day Challenge", desc: "Daily evangelism challenges", page: "challenges", color: "text-blue-600", bg: "bg-blue-50", iconBg: "bg-blue-100" },
  { icon: UserPlus, label: "Log Souls", desc: "Record souls won for Christ", page: "souls", color: "text-emerald-600", bg: "bg-emerald-50", iconBg: "bg-emerald-100" },
  { icon: Heart, label: "Prayer Wall", desc: "Share & pray together", page: "prayer", color: "text-purple-600", bg: "bg-purple-50", iconBg: "bg-purple-100" },
  { icon: MessageCircle, label: "Testimonies", desc: "Share your stories", page: "testimonies", color: "text-amber-600", bg: "bg-amber-50", iconBg: "bg-amber-100" },
  { icon: Globe, label: "Community", desc: "Connect with believers", page: "community", color: "text-teal-600", bg: "bg-teal-50", iconBg: "bg-teal-100" },
  { icon: Wrench, label: "Evangelism Toolkit", desc: "Resources & materials", page: "toolkit", color: "text-indigo-600", bg: "bg-indigo-50", iconBg: "bg-indigo-100" },
  { icon: Users, label: "Groups & Teams", desc: "Outreach communities", page: "groups", color: "text-orange-600", bg: "bg-orange-50", iconBg: "bg-orange-100" },
  { icon: CalendarDays, label: "Events", desc: "Upcoming outreach", page: "events", color: "text-rose-600", bg: "bg-rose-50", iconBg: "bg-rose-100" },
  { icon: HandHeart, label: "Follow Up", desc: "Track new converts", page: "followup", color: "text-cyan-600", bg: "bg-cyan-50", iconBg: "bg-cyan-100" },
  { icon: Trophy, label: "Leaderboard", desc: "Top soul winners", page: "leaderboard", color: "text-yellow-600", bg: "bg-yellow-50", iconBg: "bg-yellow-100" },
  { icon: Award, label: "Coming Soon", desc: "Scholarships & more", page: "comingsoon", color: "text-slate-600", bg: "bg-slate-50", iconBg: "bg-slate-100" },
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
    ? [...featureCards, { icon: Shield, label: "Admin", desc: "Manage app & users", page: "admin" as Page, color: "text-red-600", bg: "bg-red-50", iconBg: "bg-red-100" }]
    : featureCards;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ─── Top Header Bar ─── */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-[28px] font-extrabold text-dark tracking-tight">Dashboard</h1>
          <p className="text-grey text-[13px] mt-0.5">Plan, prioritize, and win souls for Christ.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("souls")}
            className="hidden sm:flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
          >
            + Log a Soul
          </button>
          <button onClick={() => onNavigate("profile")} className="relative group">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-11 h-11 rounded-full object-cover ring-2 ring-grey-light group-hover:ring-primary/40 transition-all" />
            ) : (
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-white shadow-lg group-hover:shadow-xl transition-all">
                {initials}
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
          </button>
        </div>
      </div>

      {/* ─── Hero Row: Welcome + Profile Card ─── */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#3b82f6] rounded-[20px] p-7 text-white relative overflow-hidden shadow-xl shadow-primary/15">
          <div className="absolute top-0 right-0 w-56 h-56 bg-white/[0.04] rounded-full -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/[0.04] rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-6 right-6 hidden sm:block">
            <Sparkles size={40} className="text-white/10" />
          </div>
          <div className="relative z-10">
            <p className="text-blue-200/90 text-sm font-medium tracking-wide">Welcome back,</p>
            <h2 className="text-[26px] font-extrabold mt-1.5 tracking-tight">{displayName} 🔥</h2>
            <p className="text-blue-200/70 text-sm mt-2.5 leading-relaxed">Day {Math.min(currentDay, 30)} of 30 — Keep winning souls!</p>
            <div className="mt-6 flex gap-3 sm:hidden">
              <button onClick={() => setShowChallenge(true)} className="bg-white text-primary font-semibold px-5 py-2.5 rounded-xl text-sm shadow-md">
                Today&apos;s Challenge
              </button>
              <button onClick={() => onNavigate("souls")} className="bg-white/15 backdrop-blur text-white font-semibold px-5 py-2.5 rounded-xl text-sm border border-white/20">
                Log a Soul
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[20px] p-6 shadow-lg shadow-black/[0.04] border border-grey-light/80 flex flex-col items-center justify-center text-center">
          <div className="relative mb-4">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-[72px] h-[72px] rounded-full object-cover ring-4 ring-primary/10" />
            ) : (
              <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-primary via-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl ring-4 ring-primary/10 shadow-lg">
                {initials}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-[3px] border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
          <h3 className="font-bold text-dark text-[15px]">{displayName}</h3>
          <p className="text-grey text-xs mt-0.5">@{profile?.username || "user"}</p>
          <span className="mt-2.5 text-[10px] font-bold px-3 py-1 rounded-full bg-primary/8 text-primary border border-primary/15">
            {profile?.role === "admin" ? "Admin" : profile?.role === "assistant_admin" ? "Assistant Admin" : "Soul Winner"}
          </span>
          <div className="flex gap-2 mt-4">
            <button onClick={() => onNavigate("profile")} className="p-2.5 rounded-xl bg-grey-light/60 text-grey-dark hover:bg-primary/10 hover:text-primary transition-all" title="Profile">
              <Settings size={15} />
            </button>
            <button onClick={signOut} className="p-2.5 rounded-xl bg-grey-light/60 text-grey-dark hover:bg-red-50 hover:text-red-500 transition-all" title="Sign Out">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>

      <ShareInvite variant="floating" />

      {/* ─── Stats Grid ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button onClick={() => onNavigate("souls")} className="bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] rounded-[20px] p-5 text-white relative overflow-hidden shadow-lg shadow-primary/15 text-left group hover:shadow-xl transition-all">
          <div className="absolute top-3 right-3 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <ChevronRight size={14} />
          </div>
          <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center mb-3">
            <UserPlus size={18} />
          </div>
          <p className="text-[28px] font-extrabold leading-none">{mySoulCount}</p>
          <p className="text-blue-200/80 text-[11px] font-medium mt-1.5 tracking-wide">My Souls Won</p>
          <p className="text-emerald-300 text-[10px] mt-1 flex items-center gap-1"><TrendingUp size={10} /> Keep going!</p>
        </button>

        <button onClick={() => onNavigate("community")} className="bg-white rounded-[20px] p-5 shadow-lg shadow-black/[0.04] border border-grey-light/80 text-left group hover:shadow-xl hover:border-emerald-200 transition-all">
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full" />
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center mb-3">
            <Globe size={18} className="text-emerald-600" />
          </div>
          <p className="text-[28px] font-extrabold text-dark leading-none">{globalSoulCount}</p>
          <p className="text-grey text-[11px] font-medium mt-1.5 tracking-wide">Global Souls</p>
        </button>

        <button onClick={() => onNavigate("challenges")} className="bg-white rounded-[20px] p-5 shadow-lg shadow-black/[0.04] border border-grey-light/80 text-left group hover:shadow-xl hover:border-amber-200 transition-all">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center mb-3">
            <Target size={18} className="text-amber-600" />
          </div>
          <p className="text-[28px] font-extrabold text-dark leading-none">{completedDays.length}/30</p>
          <p className="text-grey text-[11px] font-medium mt-1.5 tracking-wide">Days Completed</p>
        </button>

        <div className="bg-white rounded-[20px] p-5 shadow-lg shadow-black/[0.04] border border-grey-light/80 text-left">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center mb-3">
            <Flame size={18} className="text-red-500" />
          </div>
          <p className="text-[28px] font-extrabold text-dark leading-none">{completedDays.length}<span className="text-[13px] font-semibold text-grey ml-1">days</span></p>
          <p className="text-grey text-[11px] font-medium mt-1.5 tracking-wide">Current Streak</p>
        </div>
      </div>

      {/* ─── Bento: Progress + Challenge ─── */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-[20px] p-6 shadow-lg shadow-black/[0.04] border border-grey-light/80">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-dark text-[15px]">Challenge Progress</h3>
            <span className="text-[11px] font-bold text-primary bg-primary/8 px-2.5 py-1 rounded-lg">{completedDays.length} of 30</span>
          </div>
          <div className="flex items-center justify-center mb-5">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="url(#progressGrad)" strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={`${progress * 3.14} ${314 - progress * 3.14}`}
                  className="transition-all duration-700" />
                <defs>
                  <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1E40AF" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-dark">{Math.round(progress)}%</span>
                <span className="text-[10px] text-grey font-medium">Complete</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-blue-50 rounded-xl py-2.5 px-2">
              <p className="text-sm font-bold text-blue-700">{completedDays.length}</p>
              <p className="text-[9px] text-blue-500 font-medium">Done</p>
            </div>
            <div className="bg-amber-50 rounded-xl py-2.5 px-2">
              <p className="text-sm font-bold text-amber-700">{30 - completedDays.length}</p>
              <p className="text-[9px] text-amber-500 font-medium">Remaining</p>
            </div>
            <div className="bg-emerald-50 rounded-xl py-2.5 px-2">
              <p className="text-sm font-bold text-emerald-700">{Math.min(currentDay, 30)}</p>
              <p className="text-[9px] text-emerald-500 font-medium">Current Day</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[20px] p-6 shadow-lg shadow-black/[0.04] border border-grey-light/80 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-dark text-[15px]">Today&apos;s Challenge</h3>
            <span className="text-[10px] font-bold text-white bg-primary px-2.5 py-1 rounded-lg">Day {todayChallenge?.day}</span>
          </div>
          {todayChallenge && (
            <div className="flex-1 flex flex-col">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 mb-4 flex-1 border border-blue-100/50">
                <p className="text-[10px] text-primary/70 font-bold uppercase tracking-widest mb-2">{todayChallenge.theme}</p>
                <h4 className="font-bold text-dark text-base leading-snug">{todayChallenge.title}</h4>
                <p className="text-sm text-grey-dark mt-2.5 leading-relaxed line-clamp-3">{todayChallenge.challenge}</p>
              </div>
              <button
                onClick={() => setShowChallenge(true)}
                className="w-full bg-primary text-white py-3 rounded-xl text-sm font-bold hover:bg-primary-dark transition-all shadow-md shadow-primary/20 hover:shadow-lg"
              >
                View Full Challenge
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── Feature Grid ─── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-dark text-lg">Explore Features</h3>
          <span className="text-[11px] text-grey font-medium">{allFeatures.length} features</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {allFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <button
                key={feat.page}
                onClick={() => onNavigate(feat.page)}
                className={`group flex items-center gap-3 p-4 rounded-2xl ${feat.bg} border border-transparent hover:border-current/10 hover:shadow-md transition-all duration-200 text-left`}
              >
                <div className={`w-11 h-11 rounded-xl ${feat.iconBg} ${feat.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <span className="text-[12px] font-bold text-dark block leading-tight">{feat.label}</span>
                  <span className="text-[10px] text-grey block mt-0.5 leading-snug">{feat.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Recent Activity ─── */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-[20px] p-6 shadow-lg shadow-black/[0.04] border border-grey-light/80">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-dark text-[15px]">Recent Souls Won</h3>
            <button onClick={() => onNavigate("souls")} className="text-primary text-[12px] flex items-center gap-1 hover:gap-2 font-semibold transition-all">
              View All <ArrowRight size={13} />
            </button>
          </div>
          <div className="space-y-1">
            {souls.slice(0, 4).map(soul => (
              <div key={soul.id} className="flex items-center gap-3 py-3 px-3 rounded-xl hover:bg-grey-light/40 transition-colors -mx-1">
                <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center text-primary font-bold text-sm">
                  {soul.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-dark text-[13px] truncate">{soul.name}</p>
                  <p className="text-[11px] text-grey">{soul.location} • {soul.date}</p>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold ${
                  soul.followUpStatus === "completed" ? "bg-emerald-50 text-emerald-600" :
                  soul.followUpStatus === "in_progress" ? "bg-amber-50 text-amber-600" :
                  "bg-red-50 text-red-500"
                }`}>
                  {soul.followUpStatus === "in_progress" ? "In Progress" : soul.followUpStatus.charAt(0).toUpperCase() + soul.followUpStatus.slice(1)}
                </span>
              </div>
            ))}
          </div>
          {souls.length === 0 && (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-grey-light/50 flex items-center justify-center mx-auto mb-3">
                <UserPlus size={22} className="text-grey" />
              </div>
              <p className="text-grey text-sm font-medium">No souls logged yet</p>
              <p className="text-grey text-xs mt-1">Start winning souls for Christ!</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-[20px] p-6 shadow-lg shadow-black/[0.04] border border-grey-light/80">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-dark text-[15px]">Community Highlights</h3>
            <button onClick={() => onNavigate("community")} className="text-primary text-[12px] flex items-center gap-1 hover:gap-2 font-semibold transition-all">
              View All <ArrowRight size={13} />
            </button>
          </div>
          <div className="space-y-1">
            {communityPosts.slice(0, 4).map(post => (
              <div key={post.id} className="py-3 px-3 rounded-xl hover:bg-grey-light/40 transition-colors -mx-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600 font-bold text-xs">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <span className="font-semibold text-[12px] text-dark">{post.author}</span>
                    <span className="text-[10px] text-grey ml-1.5">• {post.location}</span>
                  </div>
                </div>
                <p className="text-[13px] text-grey-dark line-clamp-2 leading-relaxed">{post.content}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[11px] text-grey font-medium">❤️ {post.likes}</span>
                  <span className="text-[11px] text-grey font-medium">💬 {post.comments.length}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Challenge Modal ─── */}
      {showChallenge && todayChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] max-w-md w-full animate-pop-in shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#3b82f6] p-7 text-white text-center relative">
              <button onClick={() => setShowChallenge(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <X size={16} />
              </button>
              <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen size={28} />
              </div>
              <p className="text-blue-200/80 text-sm font-medium">Day {todayChallenge.day} of 30</p>
              <h3 className="text-xl font-extrabold mt-1">{todayChallenge.title}</h3>
            </div>
            <div className="p-7 space-y-4">
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{todayChallenge.theme}</p>
              <div>
                <h4 className="font-bold text-dark text-sm mb-1.5">📋 Today&apos;s Challenge:</h4>
                <p className="text-grey-dark text-sm leading-relaxed">{todayChallenge.challenge}</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100/50">
                <p className="text-primary text-sm italic leading-relaxed">&ldquo;{todayChallenge.keyScripture}&rdquo;</p>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100/50">
                <h4 className="font-bold text-emerald-800 text-sm mb-1">💚 Encouragement:</h4>
                <p className="text-emerald-700 text-sm italic leading-relaxed">&ldquo;{todayChallenge.encouragement}&rdquo;</p>
              </div>
              <div className="flex gap-2 text-xs text-grey-dark">
                <span className="bg-grey-light/70 px-3 py-1.5 rounded-xl font-medium">📚 {todayChallenge.dailyReading}</span>
                <span className="bg-grey-light/70 px-3 py-1.5 rounded-xl font-medium">📍 {todayChallenge.locationSuggestions}</span>
              </div>
              <button
                onClick={() => setShowChallenge(false)}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-md shadow-primary/20 text-sm"
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
