"use client";

import { useState } from "react";
import { ChevronRight, BookOpen, Footprints, PenLine, Users } from "lucide-react";
import { LogoIcon } from "./Logo";

const slides = [
  {
    icon: BookOpen,
    title: "Welcome to the 30 Day Soul-Winning Challenge",
    text: "A simple daily journey designed to help you grow in boldness, step out in faith, and share the Gospel with others.",
    button: "Continue",
  },
  {
    icon: Footprints,
    title: "Start Each Day with God",
    text: "Each challenge day includes:\n• Scripture\n• Prayer\n• Encouragement\n• A simple action step\n\nThis becomes the daily starting point of the app.",
    button: "Continue",
  },
  {
    icon: ChevronRight,
    title: "Step Out & Share Your Faith",
    text: "Use the Soul-Winning Toolkit, conversation starters, scripture declaration cards, and Gospel tools to help guide conversations and encourage boldness as you step out.",
    button: "Continue",
  },
  {
    icon: PenLine,
    title: "Record What God Did",
    text: "Keep track of the people you connect with, pray for, encourage, or lead to Christ. Share testimonies and celebrate what God is doing through everyday believers like you and me.",
    button: "Continue",
  },
  {
    icon: Users,
    title: "You\u2019re Not Doing This Alone",
    text: "Join a growing community of believers who are stepping out in faith, encouraging one another, and sharing the Gospel together.",
    button: "Start Day 1",
  },
];

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];
  const Icon = slide.icon;
  const isLast = current === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrent(current + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12" style={{ background: "linear-gradient(135deg, #0c1a3a 0%, #1E3A8A 40%, #1E40AF 100%)" }}>
      {/* Logo */}
      <div className="mb-8">
        <LogoIcon size={56} />
      </div>

      {/* Slide content */}
      <div className="max-w-md w-full text-center space-y-6 animate-fade-in" key={current}>
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto">
          <Icon size={32} className="text-amber-400" />
        </div>

        <h1 className="text-2xl font-bold text-white leading-tight">
          {slide.title}
        </h1>

        <p className="text-blue-200 text-sm leading-relaxed whitespace-pre-line">
          {slide.text}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-2 mt-10">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-amber-400" : "w-2 bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Button */}
      <button
        onClick={handleNext}
        className={`mt-8 px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${
          isLast
            ? "bg-amber-400 text-dark hover:bg-amber-300 shadow-lg shadow-amber-400/30"
            : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
        }`}
      >
        {slide.button}
      </button>

      {/* Skip */}
      {!isLast && (
        <button
          onClick={onComplete}
          className="mt-4 text-white/50 text-xs hover:text-white/70 transition-colors"
        >
          Skip
        </button>
      )}
    </div>
  );
}
