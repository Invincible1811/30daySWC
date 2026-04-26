"use client";

import { useApp } from "@/lib/store";
import { challengeCards } from "@/lib/data";
import {
  Users, UserPlus, Globe, BookOpen, Trophy,
  Heart, ArrowRight, Flame, Target,
  HandHeart, MessageCircle, CalendarDays, Wrench, Award, Shield
} from "lucide-react";
import { useState } from "react";
import type { Page } from "./Navigation";
import ShareInvite from "./ShareInvite";
import { useAuth } from "@/lib/auth-context";

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

const featureCards: { icon: React.ElementType; label: string; desc: string; page: Page; gradient: string; iconBg: string }[] = [
  { icon: BookOpen, label: "30-Day Challenge", desc: "Complete daily challenges", page: "challenges", gradient: "from-blue-500 to-blue-700", iconBg: "bg-white/20" },
  { icon: UserPlus, label: "Log Souls", desc: "Record souls you've won", page: "souls", gradient: "from-emerald-500 to-emerald-700", iconBg: "bg-white/20" },
  { icon: Heart, label: "Prayer Wall", desc: "Share & pray together", page: "prayer", gradient: "from-purple-500 to-purple-700", iconBg: "bg-white/20" },
  { icon: MessageCircle, label: "Testimonies", desc: "Share your stories", page: "testimonies", gradient: "from-amber-500 to-amber-700", iconBg: "bg-white/20" },
  { icon: Globe, label: "Community", desc: "Connect with others", page: "community", gradient: "from-teal-500 to-teal-700", iconBg: "bg-white/20" },
  { icon: Wrench, label: "Evangelism Toolkit", desc: "Resources & cards", page: "toolkit", gradient: "from-indigo-500 to-indigo-700", iconBg: "bg-white/20" },
  { icon: Users, label: "Groups & Teams", desc: "Outreach communities", page: "groups", gradient: "from-orange-500 to-orange-700", iconBg: "bg-white/20" },
  { icon: CalendarDays, label: "Events", desc: "Outreach schedule", page: "events", gradient: "from-rose-500 to-rose-700", iconBg: "bg-white/20" },
  { icon: HandHeart, label: "Follow Up", desc: "Track new converts", page: "followup", gradient: "from-cyan-500 to-cyan-700", iconBg: "bg-white/20" },
  { icon: Trophy, label: "Leaderboard", desc: "See top soul winners", page: "leaderboard", gradient: "from-yellow-500 to-yellow-700", iconBg: "bg-white/20" },
  { icon: Award, label: "Coming Soon", desc: "Scholarships & more", page: "comingsoon", gradient: "from-slate-500 to-slate-700", iconBg: "bg-white/20" },
];

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { souls, currentDay, completedDays, globalSoulCount, userName, communityPosts } = useApp();
  const { profile, isAdmin } = useAuth();
  const [showChallenge, setShowChallenge] = useState(false);
  const displayName = profile?.full_name || profile?.username || userName;

  const mySoulCount = souls.length;
  const todayChallenge = challengeCards[Math.min(currentDay - 1, 29)];
  const progress = (completedDays.length / 30) * 100;

  const allFeatures = isAdmin
    ? [...featureCards, { icon: Shield, label: "Admin", desc: "Manage app & users", page: "admin" as Page, gradient: "from-red-600 to-red-800", iconBg: "bg-white/20" }]
    : featureCards;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <p className="text-primary-light/80 text-sm">Welcome back,</p>
        <h2 className="text-2xl font-bold mt-1">{displayName} 🔥</h2>
        <p className="text-blue-200 text-sm mt-2">Day {Math.min(currentDay, 30)} of 30 — Keep winning souls!</p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setShowChallenge(true)}
            className="bg-white text-primary font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors"
          >
            Today&apos;s Challenge
          </button>
          <button
            onClick={() => onNavigate("souls")}
            className="bg-white/20 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-white/30 transition-colors"
          >
            Log a Soul
          </button>
        </div>
      </div>

      {/* Floating share button */}
      <ShareInvite variant="floating" />

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3">
        <MiniStat icon={<UserPlus size={18} />} value={mySoulCount} label="Souls" color="text-primary" bg="bg-primary/10" />
        <MiniStat icon={<Globe size={18} />} value={globalSoulCount} label="Global" color="text-emerald-600" bg="bg-emerald-50" />
        <MiniStat icon={<Target size={18} />} value={`${completedDays.length}/30`} label="Days" color="text-amber-600" bg="bg-amber-50" />
        <MiniStat icon={<Flame size={18} />} value={completedDays.length} label="Streak" color="text-red-500" bg="bg-red-50" />
      </div>

      {/* Progress Bar */}
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-grey-light">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-dark text-sm">Challenge Progress</h3>
          <span className="text-sm text-primary font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2.5 bg-grey-light rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Feature Grid */}
      <div>
        <h3 className="font-bold text-dark text-lg mb-3">Explore</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {allFeatures.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <button
                key={feat.page}
                onClick={() => onNavigate(feat.page)}
                className="group flex flex-col items-center text-center gap-2 p-3 rounded-2xl bg-card border border-grey-light shadow-sm hover:shadow-lg hover:scale-[1.04] hover:-translate-y-0.5 transition-all duration-200"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={22} />
                </div>
                <span className="text-[11px] font-semibold text-dark leading-tight">{feat.label}</span>
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
            <h3 className="font-semibold text-dark">Recent Souls Won</h3>
            <button onClick={() => onNavigate("souls")} className="text-primary text-sm flex items-center gap-1 hover:underline">
              View All <ArrowRight size={14} />
            </button>
          </div>
          {souls.slice(0, 3).map(soul => (
            <div key={soul.id} className="flex items-center gap-3 py-2 border-b border-grey-light last:border-0">
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
            <p className="text-grey text-sm text-center py-4">No souls logged yet. Start winning!</p>
          )}
        </div>

        {/* Community Highlights */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-grey-light">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-dark">Community Highlights</h3>
            <button onClick={() => onNavigate("community")} className="text-primary text-sm flex items-center gap-1 hover:underline">
              View All <ArrowRight size={14} />
            </button>
          </div>
          {communityPosts.slice(0, 3).map(post => (
            <div key={post.id} className="py-2 border-b border-grey-light last:border-0">
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

function MiniStat({ icon, value, label, color, bg }: {
  icon: React.ReactNode; value: number | string; label: string; color: string; bg: string;
}) {
  return (
    <div className={`${bg} rounded-xl p-3 text-center`}>
      <div className={`${color} flex justify-center mb-1`}>{icon}</div>
      <p className="text-lg font-bold text-dark leading-tight">{value}</p>
      <p className="text-[10px] text-grey-dark">{label}</p>
    </div>
  );
}
