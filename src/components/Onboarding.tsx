"use client";

import { useState, useEffect, useCallback } from "react";
import { BookOpen, PenLine, Users, Sparkles, ArrowRight, Flame } from "lucide-react";
import { LogoIcon } from "./Logo";

const slides = [
  {
    icon: Flame,
    title: "Welcome to the 30-Day Soul-Winning Challenge",
    text: "A simple daily journey designed to help you grow in boldness, step out in faith, and share the Gospel with others.",
    button: "Let's Go",
    gradient: "from-blue-900 via-blue-800 to-indigo-900",
    accent: "#FBBF24",
    illustration: "fire",
  },
  {
    icon: BookOpen,
    title: "Start Each Day with God",
    text: "Each challenge day includes Scripture, Prayer, Encouragement, and a simple action step. This becomes your daily starting point.",
    button: "Next",
    gradient: "from-indigo-900 via-purple-900 to-blue-900",
    accent: "#A78BFA",
    illustration: "book",
    features: ["Scripture", "Prayer", "Encouragement", "Action Step"],
  },
  {
    icon: Sparkles,
    title: "Step Out & Share Your Faith",
    text: "Use the Soul-Winning Toolkit — conversation starters, scripture cards, and Gospel tools to guide conversations with boldness.",
    button: "Next",
    gradient: "from-emerald-900 via-teal-900 to-blue-900",
    accent: "#34D399",
    illustration: "sparkle",
  },
  {
    icon: PenLine,
    title: "Record What God Did",
    text: "Track every person you connect with, pray for, encourage, or lead to Christ. Share testimonies and celebrate God's faithfulness.",
    button: "Next",
    gradient: "from-amber-900 via-orange-900 to-red-900",
    accent: "#FB923C",
    illustration: "pen",
  },
  {
    icon: Users,
    title: "You\u2019re Not Alone",
    text: "Join a growing community of believers stepping out in faith, encouraging one another, and sharing the Gospel together.",
    button: "Start Day 1",
    gradient: "from-blue-900 via-indigo-900 to-purple-900",
    accent: "#FBBF24",
    illustration: "community",
  },
];

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [animating, setAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const slide = slides[current];
  const Icon = slide.icon;
  const isLast = current === slides.length - 1;

  useEffect(() => {
    setMounted(true);
  }, []);

  const goNext = useCallback(() => {
    if (animating) return;
    if (isLast) {
      onComplete();
      return;
    }
    setAnimating(true);
    setDirection("next");
    setTimeout(() => {
      setCurrent(c => c + 1);
      setAnimating(false);
    }, 300);
  }, [animating, isLast, onComplete]);

  const goTo = useCallback((index: number) => {
    if (animating || index === current) return;
    setAnimating(true);
    setDirection(index > current ? "next" : "prev");
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 300);
  }, [animating, current]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between px-6 py-10 relative overflow-hidden transition-all duration-700"
      style={{ background: `linear-gradient(135deg, #0c1a3a 0%, #1E3A8A 40%, #1E40AF 100%)` }}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full transition-all duration-1000 ease-in-out"
          style={{
            top: `${10 + current * 8}%`,
            left: `${5 + current * 12}%`,
            width: 300,
            height: 300,
            background: slide.accent,
            filter: "blur(130px)",
            opacity: 0.15,
          }}
        />
        <div
          className="absolute rounded-full transition-all duration-1000 ease-in-out"
          style={{
            bottom: `${10 + current * 5}%`,
            right: `${5 + current * 8}%`,
            width: 350,
            height: 350,
            background: "#6366F1",
            filter: "blur(140px)",
            opacity: 0.12,
          }}
        />
        <div
          className="absolute rounded-full transition-all duration-1000 ease-in-out"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            height: 500,
            background: slide.accent,
            filter: "blur(180px)",
            opacity: 0.06,
          }}
        />
        {/* Floating particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              top: `${10 + (i * 7) % 80}%`,
              left: `${5 + (i * 11) % 90}%`,
              width: 3 + (i % 3),
              height: 3 + (i % 3),
              background: "rgba(255,255,255,0.3)",
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      {/* Top Section: Logo */}
      <div
        className="relative z-10 flex flex-col items-center transition-all duration-500"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(-20px)",
        }}
      >
        <LogoIcon size={48} />
        <span className="text-white/40 text-[10px] font-semibold tracking-widest uppercase mt-2">Soul-Winning</span>
      </div>

      {/* Middle Section: Content */}
      <div
        className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-md"
        key={current}
        style={{
          animation: animating
            ? `slideOut${direction === "next" ? "Left" : "Right"} 0.3s ease-out forwards`
            : "slideIn 0.5s ease-out forwards",
        }}
      >
        {/* Icon circle with glow */}
        <div className="relative mb-8">
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: slide.accent,
              filter: "blur(25px)",
              opacity: 0.3,
              transform: "scale(1.3)",
            }}
          />
          <div
            className="relative w-20 h-20 rounded-3xl flex items-center justify-center border border-white/10"
            style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}
          >
            <Icon size={36} style={{ color: slide.accent }} />
          </div>
        </div>

        {/* Title */}
        <h1
          className="text-center font-black text-white leading-tight mb-4"
          style={{ fontSize: "clamp(1.5rem, 6vw, 2rem)" }}
        >
          {slide.title}
        </h1>

        {/* Description */}
        <p className="text-center text-blue-200/90 text-sm leading-relaxed max-w-sm mb-6">
          {slide.text}
        </p>

        {/* Feature pills (for slide 2) */}
        {slide.features && (
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {slide.features.map((f, i) => (
              <span
                key={f}
                className="px-4 py-2 rounded-full text-xs font-semibold border border-white/15"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: slide.accent,
                  animationDelay: `${i * 0.1 + 0.3}s`,
                  animation: "popIn 0.4s ease-out both",
                }}
              >
                {f}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Section: Controls */}
      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="transition-all duration-400 rounded-full"
              style={{
                width: i === current ? 32 : 8,
                height: 8,
                background: i === current ? slide.accent : "rgba(255,255,255,0.2)",
                boxShadow: i === current ? `0 0 12px ${slide.accent}60` : "none",
              }}
            />
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={goNext}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-base transition-all duration-300 active:scale-[0.97]"
          style={{
            background: isLast
              ? `linear-gradient(135deg, ${slide.accent}, #F59E0B)`
              : "rgba(255,255,255,0.1)",
            color: isLast ? "#1E293B" : "#fff",
            border: isLast ? "none" : "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            boxShadow: isLast ? `0 8px 32px ${slide.accent}40` : "none",
          }}
        >
          {slide.button}
          <ArrowRight size={18} style={{ opacity: 0.8 }} />
        </button>

        {/* Skip */}
        {!isLast && (
          <button
            onClick={onComplete}
            className="w-full text-center text-white/40 text-xs font-medium hover:text-white/60 transition-colors py-2"
          >
            Skip intro
          </button>
        )}
      </div>

      {/* CSS keyframes */}
      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutLeft {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(-30px); }
        }
        @keyframes slideOutRight {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(30px); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
