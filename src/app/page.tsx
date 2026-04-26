"use client";

import { useState, useEffect } from "react";
import Navigation, { type Page } from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import ChallengeCards from "@/components/ChallengeCards";
import SoulTracker from "@/components/SoulTracker";
import FollowUp from "@/components/FollowUp";
import PrayerWall from "@/components/PrayerWall";
import Testimonies from "@/components/Testimonies";
import Events from "@/components/Events";
import Groups from "@/components/Groups";
import Community from "@/components/Community";
import ComingSoon from "@/components/ComingSoon";
import Toolkit from "@/components/Toolkit";
import ProfilePage from "@/components/ProfilePage";
import Leaderboard from "@/components/Leaderboard";
import AdminDashboard from "@/components/AdminDashboard";
import LandingPage from "@/components/LandingPage";
import AuthPage from "@/components/AuthPage";
import NotificationPrompt from "@/components/NotificationPrompt";
import InstallPrompt from "@/components/InstallPrompt";
import UsernameSetup from "@/components/UsernameSetup";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

type AppScreen = "landing" | "auth" | "app";

export default function Home() {
  const { user, profile, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [screen, setScreen] = useState<AppScreen>("landing");
  const [usernameSet, setUsernameSet] = useState(false);

  useEffect(() => {
    if (loading) return;

    // Check if running as installed PWA (standalone mode)
    const isPWA = window.matchMedia("(display-mode: standalone)").matches
      || (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    const seenLanding = sessionStorage.getItem("ws-seen-landing");
    if (user) {
      setScreen("app");
    } else if (isPWA || seenLanding) {
      // Installed app skips landing page, goes straight to login
      setScreen("auth");
    } else {
      setScreen("landing");
    }
  }, [user, loading]);

  const handleEnterApp = () => {
    sessionStorage.setItem("ws-seen-landing", "true");
    setScreen("auth");
  };

  const handleAuthSuccess = () => {
    setScreen("app");
  };

  const handleShowAuth = () => {
    setScreen("auth");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard": return <Dashboard onNavigate={setCurrentPage} />;
      case "challenges": return <ChallengeCards />;
      case "souls": return <SoulTracker />;
      case "followup": return <FollowUp />;
      case "prayer": return <PrayerWall />;
      case "testimonies": return <Testimonies />;
      case "events": return <Events />;
      case "groups": return <Groups />;
      case "community": return <Community />;
      case "toolkit": return <Toolkit />;
      case "leaderboard": return <Leaderboard />;
      case "profile": return <ProfilePage />;
      case "admin": return <AdminDashboard />;
      case "comingsoon": return <ComingSoon />;
      default: return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0c1a3a 0%, #1E3A8A 40%, #1E40AF 100%)" }}>
        <div className="text-center">
          <Loader2 size={40} className="animate-spin" style={{ color: "#FBBF24", margin: "0 auto 16px" }} />
          <p style={{ color: "#93C5FD", fontSize: 14 }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (screen === "landing") {
    return <LandingPage onEnterApp={handleEnterApp} />;
  }

  if (screen === "auth") {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  // Show username setup if user hasn't chosen a custom username yet (admins skip)
  const isAdmin = profile?.role === "admin";
  const needsUsername = user && profile && !usernameSet && !isAdmin && (
    !profile.username ||
    profile.username === user.email?.split("@")[0]
  );

  if (needsUsername) {
    return <UsernameSetup onComplete={() => setUsernameSet(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} onShowAuth={handleShowAuth} />
      {/* Main content area */}
      <main className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-8">
        <div className="max-w-5xl mx-auto px-4 py-6">
          {renderPage()}
        </div>
      </main>
      <NotificationPrompt />
      <InstallPrompt />
    </div>
  );
}
