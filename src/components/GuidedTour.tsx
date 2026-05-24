"use client";

import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

const tourSteps = [
  {
    title: "Welcome to Winning Souls! 🎉",
    description: "Let me show you around. This quick tour will help you get the most out of the app.",
    position: "center" as const,
  },
  {
    title: "30-Day Challenge 📖",
    description: "Tap here to see your daily challenge card. Each day has a scripture, prayer, action step, and reflection to guide your soul-winning journey.",
    position: "center" as const,
    highlight: "challenges",
  },
  {
    title: "Record What God Did ✍️",
    description: "After stepping out in faith, tap 'Record What God Did' on your challenge card to log souls won, prayers offered, and church invitations.",
    position: "center" as const,
  },
  {
    title: "Soul-Winning Toolkit 🛠️",
    description: "Access scripture cards, conversation starters, the Gospel tool, and acts of kindness ideas. Save your favorites for quick access!",
    position: "center" as const,
    highlight: "toolkit",
  },
  {
    title: "Community & Prayer Wall 🙏",
    description: "Share testimonies, encourage others, and pray for one another. You're not alone — there's a whole community stepping out with you!",
    position: "center" as const,
    highlight: "community",
  },
  {
    title: "Groups & Outreach Teams 👥",
    description: "Join or create outreach teams. Partner with others to win souls together in your city.",
    position: "center" as const,
    highlight: "groups",
  },
  {
    title: "You're Ready! 🔥",
    description: "That's it! Tap your first challenge card to get started. Remember: every soul matters to God, and He's using YOU.",
    position: "center" as const,
  },
];

interface GuidedTourProps {
  onComplete: () => void;
  onNavigate?: (page: string) => void;
}

export default function GuidedTour({ onComplete, onNavigate }: GuidedTourProps) {
  const [step, setStep] = useState(0);
  const current = tourSteps[step];

  const next = () => {
    if (step === tourSteps.length - 1) {
      onComplete();
    } else {
      const nextStep = tourSteps[step + 1];
      if (nextStep.highlight && onNavigate) {
        onNavigate(nextStep.highlight);
      }
      setStep(step + 1);
    }
  };

  const prev = () => {
    if (step > 0) {
      const prevStep = tourSteps[step - 1];
      if (prevStep.highlight && onNavigate) {
        onNavigate(prevStep.highlight);
      }
      setStep(step - 1);
    }
  };

  const skip = () => onComplete();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[20px] max-w-sm w-full shadow-2xl overflow-hidden animate-pop-in">
        {/* Progress bar */}
        <div className="h-1 bg-grey-light">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((step + 1) / tourSteps.length) * 100}%` }}
          />
        </div>

        <div className="p-6">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              {step + 1} of {tourSteps.length}
            </span>
            <button onClick={skip} className="text-xs text-grey hover:text-dark transition-colors">
              Skip Tour
            </button>
          </div>

          {/* Content */}
          <h3 className="text-lg font-bold text-dark mb-2">{current.title}</h3>
          <p className="text-grey-dark text-sm leading-relaxed">{current.description}</p>

          {/* Navigation */}
          <div className="flex items-center gap-3 mt-6">
            {step > 0 && (
              <button
                onClick={prev}
                className="flex items-center gap-1 text-grey text-sm font-medium hover:text-dark transition-colors"
              >
                <ChevronLeft size={16} /> Back
              </button>
            )}
            <button
              onClick={next}
              className="flex-1 bg-primary text-white py-3 rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            >
              {step === tourSteps.length - 1 ? "Start My Journey! 🚀" : "Next"}
              {step < tourSteps.length - 1 && <ChevronRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
