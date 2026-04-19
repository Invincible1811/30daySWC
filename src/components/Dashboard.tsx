"use client";

import { useApp } from "@/lib/store";
import { challengeCards } from "@/lib/data";
import {
  Users, UserPlus, Globe, BookOpen, Trophy,
  TrendingUp, Heart, ArrowRight, Flame, Target
} from "lucide-react";
import { useState } from "react";
import type { Page } from "./Navigation";
import ShareInvite from "./ShareInvite";

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { souls, currentDay, completedDays, globalSoulCount, userName, testimonies, communityPosts } = useApp();
  const [showChallenge, setShowChallenge] = useState(false);

  const mySoulCount = souls.length;
  const todayChallenge = challengeCards[Math.min(currentDay - 1, 29)];
  const progress = (completedDays.length / 30) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <p className="text-primary-light/80 text-sm">Welcome back,</p>
        <h2 className="text-2xl font-bold mt-1">{userName} 🔥</h2>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<UserPlus className="text-primary" size={24} />}
          label="My Souls Won"
          value={mySoulCount}
          color="bg-primary/10"
        />
        <StatCard
          icon={<Globe className="text-success" size={24} />}
          label="Global Souls"
          value={globalSoulCount}
          color="bg-success/10"
        />
        <StatCard
          icon={<Target className="text-warning" size={24} />}
          label="Days Completed"
          value={`${completedDays.length}/30`}
          color="bg-warning/10"
        />
        <StatCard
          icon={<Flame className="text-danger" size={24} />}
          label="Current Streak"
          value={completedDays.length}
          color="bg-danger/10"
          suffix="days"
        />
      </div>

      {/* Progress Bar */}
      <div className="bg-card rounded-2xl p-5 shadow-sm border border-grey-light">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-dark">Challenge Progress</h3>
          <span className="text-sm text-primary font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-3 bg-grey-light rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-grey">Day 1</span>
          <span className="text-xs text-grey">Day 30</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <QuickAction icon={<BookOpen size={20} />} label="View Challenges" onClick={() => onNavigate("challenges")} />
        <QuickAction icon={<Heart size={20} />} label="Prayer Wall" onClick={() => onNavigate("prayer")} />
        <QuickAction icon={<Users size={20} />} label="My Groups" onClick={() => onNavigate("groups")} />
        <QuickAction icon={<Trophy size={20} />} label="Scholarship" onClick={() => onNavigate("comingsoon")} />
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
                <h4 className="font-semibold text-green-800 text-sm mb-1">� Encouragement:</h4>
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

function StatCard({ icon, label, value, color, suffix }: {
  icon: React.ReactNode; label: string; value: number | string; color: string; suffix?: string;
}) {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm border border-grey-light">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-dark">
        {value}{suffix && <span className="text-sm font-normal text-grey ml-1">{suffix}</span>}
      </p>
      <p className="text-xs text-grey mt-1">{label}</p>
    </div>
  );
}

function QuickAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-card rounded-xl p-4 shadow-sm border border-grey-light flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all text-grey-dark hover:text-primary"
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
