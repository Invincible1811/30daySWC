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
import LandingPage from "@/components/LandingPage";
import AuthPage from "@/components/AuthPage";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

type AppScreen = "landing" | "auth" | "app";

export default function Home() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [screen, setScreen] = useState<AppScreen>("landing");

  useEffect(() => {
    if (loading) return;

    const entered = sessionStorage.getItem("ws-entered");
    if (user) {
      // Logged in — go straight to app
      sessionStorage.setItem("ws-entered", "true");
      setScreen("app");
    } else if (entered) {
      // Visited before this session but not logged in — show auth
      setScreen("auth");
    } else {
      // First visit — show landing
      setScreen("landing");
    }
  }, [user, loading]);

  const handleEnterApp = () => {
    sessionStorage.setItem("ws-entered", "true");
    setScreen("auth");
  };

  const handleAuthSuccess = () => {
    setScreen("app");
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      {/* Main content area */}
      <main className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-8">
        <div className="max-w-5xl mx-auto px-4 py-6">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
