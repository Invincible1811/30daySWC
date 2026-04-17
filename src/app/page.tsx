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

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    const entered = sessionStorage.getItem("ws-entered");
    if (entered) setShowLanding(false);
  }, []);

  const handleEnterApp = () => {
    sessionStorage.setItem("ws-entered", "true");
    setShowLanding(false);
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

  if (showLanding) {
    return <LandingPage onEnterApp={handleEnterApp} />;
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
