"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronRight, ChevronLeft, Flame } from "lucide-react";

const tourSteps = [
  {
    title: "Welcome! Let me show you around 🎉",
    description: "This quick tour will help you get the most out of the app. Follow along as I point out each section!",
    highlightTab: null,
    navigateTo: null,
  },
  {
    title: "Your Daily Challenge 📖",
    description: "This is where your 30-day journey lives. Each day has a scripture, prayer, action step, and reflection to guide you.",
    highlightTab: "challenges",
    navigateTo: "challenges",
  },
  {
    title: "Track Your Impact 🎯",
    description: "Tap here to log souls won, people prayed for, and everyone you've invited to church. Watch your impact grow!",
    highlightTab: "souls",
    navigateTo: "souls",
  },
  {
    title: "Events & Outreach �",
    description: "Find outreach events near you with dates, times, and Google Maps directions. Never miss an opportunity!",
    highlightTab: "events",
    navigateTo: "events",
  },
  {
    title: "More Features ✨",
    description: "Tap 'More' to access the Soul-Winning Toolkit, Community, Prayer Wall, Groups, Testimonies, and everything else!",
    highlightTab: "community",
    navigateTo: null,
  },
  {
    title: "You're Ready! 🔥",
    description: "That's it! Head to your Challenge tab and start Day 1. Every soul matters to God — and He's moving through YOU!",
    highlightTab: "challenges",
    navigateTo: "challenges",
  },
];

interface GuidedTourProps {
  onComplete: () => void;
  onNavigate?: (page: string) => void;
}

export default function GuidedTour({ onComplete, onNavigate }: GuidedTourProps) {
  const [step, setStep] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  const [animating, setAnimating] = useState(false);
  const current = tourSteps[step];
  const isLast = step === tourSteps.length - 1;

  const updateSpotlight = useCallback((tabId: string | null) => {
    if (!tabId) {
      setSpotlightRect(null);
      return;
    }
    const el = document.querySelector(`[data-tour="${tabId}"]`);
    if (el) {
      const rect = el.getBoundingClientRect();
      setSpotlightRect(rect);
    } else {
      setSpotlightRect(null);
    }
  }, []);

  useEffect(() => {
    updateSpotlight(current.highlightTab);
    // Recalculate on resize
    const handleResize = () => updateSpotlight(current.highlightTab);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [step, current.highlightTab, updateSpotlight]);

  const goTo = useCallback((nextStep: number) => {
    if (animating) return;
    setAnimating(true);
    const target = tourSteps[nextStep];
    if (target.navigateTo && onNavigate) {
      onNavigate(target.navigateTo);
    }
    setTimeout(() => {
      setStep(nextStep);
      setAnimating(false);
    }, 200);
  }, [animating, onNavigate]);

  const next = () => {
    if (isLast) {
      onComplete();
    } else {
      goTo(step + 1);
    }
  };

  const prev = () => {
    if (step > 0) goTo(step - 1);
  };

  const skip = () => onComplete();

  // Calculate tooltip position (above the highlighted tab)
  const tooltipStyle: React.CSSProperties = {};
  const arrowStyle: React.CSSProperties = {};
  let showArrow = false;

  if (spotlightRect) {
    showArrow = true;
    const centerX = spotlightRect.left + spotlightRect.width / 2;
    tooltipStyle.position = "absolute";
    tooltipStyle.bottom = `${window.innerHeight - spotlightRect.top + 16}px`;
    tooltipStyle.left = "50%";
    tooltipStyle.transform = "translateX(-50%)";
    // Arrow pointing down to the tab
    arrowStyle.position = "absolute";
    arrowStyle.bottom = -8;
    arrowStyle.left = centerX;
    arrowStyle.transform = "translateX(-50%)";
  }

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Dark overlay with spotlight cutout */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
        <defs>
          <mask id="tour-spotlight">
            <rect width="100%" height="100%" fill="white" />
            {spotlightRect && (
              <rect
                x={spotlightRect.left - 8}
                y={spotlightRect.top - 6}
                width={spotlightRect.width + 16}
                height={spotlightRect.height + 12}
                rx={14}
                fill="black"
                className="transition-all duration-300"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.75)"
          mask="url(#tour-spotlight)"
        />
      </svg>

      {/* Spotlight glow ring */}
      {spotlightRect && (
        <div
          className="absolute rounded-2xl border-2 border-primary shadow-[0_0_20px_rgba(30,64,175,0.5)] transition-all duration-300 pointer-events-none"
          style={{
            left: spotlightRect.left - 8,
            top: spotlightRect.top - 6,
            width: spotlightRect.width + 16,
            height: spotlightRect.height + 12,
            animation: "pulseGlow 2s ease-in-out infinite",
          }}
        />
      )}

      {/* Tooltip card */}
      <div
        className="absolute left-4 right-4 flex justify-center transition-all duration-300"
        style={{
          bottom: spotlightRect
            ? `${window.innerHeight - spotlightRect.top + 20}px`
            : "50%",
          transform: spotlightRect ? "none" : "translateY(50%)",
        }}
      >
        <div
          className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden"
          style={{ animation: "popUp 0.3s ease-out" }}
        >
          {/* Progress bar */}
          <div className="h-1 bg-gray-100">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${((step + 1) / tourSteps.length) * 100}%` }}
            />
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                {step + 1} of {tourSteps.length}
              </span>
              <button onClick={skip} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                Skip
              </button>
            </div>

            <h3 className="text-base font-bold text-gray-900 mb-1.5">{current.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{current.description}</p>

            <div className="flex items-center gap-3 mt-5">
              {step > 0 && (
                <button
                  onClick={prev}
                  className="flex items-center gap-1 text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors"
                >
                  <ChevronLeft size={16} /> Back
                </button>
              )}
              <button
                onClick={next}
                className="flex-1 bg-primary text-white py-3 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                {isLast ? "Start My Journey!" : "Next"}
                {isLast ? <Flame size={16} /> : <ChevronRight size={16} />}
              </button>
            </div>
          </div>

          {/* Arrow pointing down to tab */}
          {showArrow && (
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 shadow-md"
            />
          )}
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes popUp {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(30,64,175,0.4); }
          50% { box-shadow: 0 0 30px rgba(30,64,175,0.7); }
        }
      `}</style>
    </div>
  );
}
