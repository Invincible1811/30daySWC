"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronRight, ChevronLeft, Flame, ChevronDown } from "lucide-react";

const tourSteps = [
  {
    title: "Welcome! Let me show you around 🎉",
    description: "This quick tour will help you get the most out of the app. Follow along as I point out each section!",
    highlightTab: null,
    navigateTo: null,
    tabLabel: null,
  },
  {
    title: "Your Daily Challenge 📖",
    description: "This is where your 30-day journey lives. Each day has a scripture, prayer, action step, and reflection to guide you.",
    highlightTab: "challenges",
    navigateTo: "challenges",
    tabLabel: "Challenge",
  },
  {
    title: "Track Your Impact 🎯",
    description: "Tap here to log souls won, people prayed for, and everyone you've invited to church. Watch your impact grow!",
    highlightTab: "souls",
    navigateTo: "souls",
    tabLabel: "Impact",
  },
  {
    title: "Events & Outreach 📅",
    description: "Find outreach events near you with dates, times, and Google Maps directions. Never miss an opportunity!",
    highlightTab: "events",
    navigateTo: "events",
    tabLabel: "Events",
  },
  {
    title: "More Features ✨",
    description: "Tap 'More' to access the Soul-Winning Toolkit, Community, Prayer Wall, Groups, Testimonies, and everything else!",
    highlightTab: "community",
    navigateTo: null,
    tabLabel: "More",
  },
  {
    title: "You're Ready! 🔥",
    description: "That's it! Head to your Challenge tab and start Day 1. Every soul matters to God — and He's moving through YOU!",
    highlightTab: "challenges",
    navigateTo: "challenges",
    tabLabel: null,
  },
];

interface GuidedTourProps {
  onComplete: () => void;
  onNavigate?: (page: string) => void;
}

export default function GuidedTour({ onComplete, onNavigate }: GuidedTourProps) {
  const [step, setStep] = useState(0);
  const [highlightPos, setHighlightPos] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const current = tourSteps[step];
  const isLast = step === tourSteps.length - 1;

  // Find and track the highlighted tab position
  const findTab = useCallback((tabId: string | null) => {
    if (!tabId) { setHighlightPos(null); return; }
    // Small delay to let navigation render
    requestAnimationFrame(() => {
      const el = document.querySelector(`[data-tour="${tabId}"]`);
      if (el) {
        const r = el.getBoundingClientRect();
        setHighlightPos({ x: r.left, y: r.top, w: r.width, h: r.height });
      } else {
        setHighlightPos(null);
      }
    });
  }, []);

  useEffect(() => {
    findTab(current.highlightTab);
    const onResize = () => findTab(current.highlightTab);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [step, current.highlightTab, findTab]);

  const goToStep = (nextIdx: number) => {
    const target = tourSteps[nextIdx];
    if (target.navigateTo && onNavigate) {
      onNavigate(target.navigateTo);
    }
    setStep(nextIdx);
  };

  const next = () => {
    if (isLast) { onComplete(); return; }
    goToStep(step + 1);
  };

  const prev = () => {
    if (step > 0) goToStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col">
      {/* Full-screen dark overlay — tap-proof */}
      <div className="absolute inset-0 bg-black/75" />

      {/* Card — always centered */}
      <div className="flex-1 flex items-center justify-center px-5 relative z-10">
        <div
          key={step}
          className="bg-white rounded-[22px] max-w-sm w-full shadow-2xl overflow-visible relative"
          style={{ animation: "tourCardIn 0.35s ease-out" }}
        >
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 rounded-t-[22px] overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${((step + 1) / tourSteps.length) * 100}%` }}
            />
          </div>

          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                {step + 1} / {tourSteps.length}
              </span>
              <button
                onClick={onComplete}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors font-medium"
              >
                Skip Tour
              </button>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">{current.title}</h3>

            {/* Description */}
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{current.description}</p>

            {/* Highlighted tab indicator */}
            {current.tabLabel && (
              <div className="flex items-center gap-2 mb-5 px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/15">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-semibold text-primary">
                  Look for the "{current.tabLabel}" tab below
                </span>
                <ChevronDown size={14} className="text-primary ml-auto animate-bounce" />
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-3">
              {step > 0 && (
                <button
                  onClick={prev}
                  className="flex items-center gap-1 text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors px-2"
                >
                  <ChevronLeft size={16} /> Back
                </button>
              )}
              <button
                onClick={next}
                className="flex-1 bg-primary text-white py-3.5 rounded-xl text-sm font-bold hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isLast ? "Start My Journey!" : "Next"}
                {isLast ? <Flame size={16} /> : <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Highlighted tab spotlight — sits over the bottom nav */}
      {highlightPos && (
        <div
          className="absolute z-20 pointer-events-none transition-all duration-300 ease-out"
          style={{
            left: highlightPos.x - 6,
            top: highlightPos.y - 4,
            width: highlightPos.w + 12,
            height: highlightPos.h + 8,
          }}
        >
          {/* Bright background to "reveal" the tab */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.95)",
              boxShadow: "0 0 0 3px #1E40AF, 0 0 20px rgba(30,64,175,0.5), 0 0 40px rgba(30,64,175,0.25)",
              animation: "spotlightPulse 1.8s ease-in-out infinite",
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes tourCardIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spotlightPulse {
          0%, 100% { box-shadow: 0 0 0 3px #1E40AF, 0 0 20px rgba(30,64,175,0.5), 0 0 40px rgba(30,64,175,0.25); }
          50% { box-shadow: 0 0 0 4px #3B82F6, 0 0 30px rgba(59,130,246,0.6), 0 0 60px rgba(59,130,246,0.3); }
        }
      `}</style>
    </div>
  );
}
