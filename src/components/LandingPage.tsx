"use client";

import { useState, useEffect } from "react";
import {
  BookOpen, Heart, Users, MapPin, Sparkles, Gift,
  ChevronRight, ArrowRight, Star, Flame,
  CheckCircle2, MessageCircle, Globe, Calendar, Share2, Download, Smartphone,
  CalendarDays, Target, HandHeart, Trophy, Wrench, UserPlus
} from "lucide-react";
import ShareInvite from "./ShareInvite";
import { useInstallPrompt } from "./InstallPrompt";
import { LogoIcon } from "./Logo";

interface LandingPageProps {
  onEnterApp: () => void;
}

const features = [
  {
    icon: BookOpen,
    title: "30-Day Challenge",
    desc: "Daily scriptures, prayers, and evangelism challenges to build your soul-winning habit.",
    bg: "#1E40AF",
  },
  {
    icon: Users,
    title: "Soul Tracker",
    desc: "Log every soul you lead to Christ. Watch your impact grow day by day.",
    bg: "#059669",
  },
  {
    icon: Heart,
    title: "Prayer Wall",
    desc: "Post prayer requests, intercede for others, and see God move in real time.",
    bg: "#E11D48",
  },
  {
    icon: MessageCircle,
    title: "Testimonies",
    desc: "Share your stories of God's faithfulness and be encouraged by others.",
    bg: "#7C3AED",
  },
  {
    icon: Globe,
    title: "Community",
    desc: "Connect with soul winners worldwide. Share reports, encourage one another.",
    bg: "#4F46E5",
  },
  {
    icon: Sparkles,
    title: "Evangelism Toolkit",
    desc: "Scripture cards, conversation starters, gospel tools, and outreach ideas.",
    bg: "#D97706",
  },
];

const stats = [
  { label: "Daily Challenges", value: "30", icon: Calendar },
  { label: "Scripture Cards", value: "30+", icon: BookOpen },
  { label: "Conversation Starters", value: "34", icon: MapPin },
  { label: "Outreach Ideas", value: "26+", icon: Gift },
];

const testimonials = [
  {
    quote: "This app transformed my evangelism journey. I went from being afraid to share the Gospel to leading 12 souls to Christ in one month!",
    name: "Sarah M.",
    role: "Youth Pastor",
  },
  {
    quote: "The daily challenges kept me accountable and the toolkit gave me everything I needed. God is so faithful!",
    name: "David K.",
    role: "Church Leader",
  },
  {
    quote: "I love the prayer wall feature. Knowing others are praying for my outreach gives me so much boldness.",
    name: "Grace O.",
    role: "Evangelist",
  },
];

export default function LandingPage({ onEnterApp }: LandingPageProps) {
  const [visible, setVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { canInstall, install } = useInstallPrompt();
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "mac" | "windows">("mac");

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/iphone|ipad|ipod/i.test(ua)) setPlatform("ios");
    else if (/android/i.test(ua)) setPlatform("android");
    else if (/windows/i.test(ua)) setPlatform("windows");
    else setPlatform("mac");
  }, []);

  const handleInstallClick = async () => {
    if (canInstall) {
      await install();
    } else {
      setShowInstallGuide(true);
    }
  };

  useEffect(() => {
    setVisible(true);
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#fff" }}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: "linear-gradient(135deg, #0c1a3a 0%, #1E3A8A 40%, #1E40AF 100%)" }}>
        {/* Glow orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: 0.15 }}>
          <div className="absolute rounded-full" style={{ top: "10%", left: "5%", width: 300, height: 300, background: "#3B82F6", filter: "blur(120px)" }} />
          <div className="absolute rounded-full" style={{ bottom: "10%", right: "5%", width: 400, height: 400, background: "#6366F1", filter: "blur(120px)" }} />
          <div className="absolute rounded-full" style={{ top: "40%", left: "40%", width: 500, height: 500, background: "#2563EB", filter: "blur(150px)" }} />
        </div>

        <div
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
          style={{
            transition: "all 1s ease-out",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
          }}
        >
          {/* Logo + Badge */}
          <div className="flex justify-center mb-6">
            <LogoIcon size={72} />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}>
            <Flame size={16} style={{ color: "#FBBF24" }} />
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: 500 }}>30-Day Soul-Winning Challenge</span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: "clamp(3rem, 8vw, 4.5rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 24 }}>
            Winning
            <span className="block" style={{ background: "linear-gradient(90deg, #FCD34D, #FBBF24, #F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Souls
            </span>
          </h1>

          <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)", color: "#93C5FD", maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Your complete companion for evangelism. Daily challenges, scripture cards,
            prayer tools, and a community of soul winners — all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center" style={{ marginBottom: 48 }}>
            <button
              onClick={handleInstallClick}
              className="group flex items-center gap-3"
              style={{ background: "#fff", color: "#1E3A8A", fontWeight: 700, fontSize: 18, padding: "16px 32px", borderRadius: 16, boxShadow: "0 10px 40px rgba(0,0,0,0.3)", transition: "all 0.3s", border: "none", cursor: "pointer" }}
            >
              <Download size={20} /> Install App
            </button>
            <a
              href="#features"
              className="flex items-center gap-2"
              style={{ color: "rgba(255,255,255,0.7)", fontWeight: 500, textDecoration: "none" }}
            >
              Learn More
              <ChevronRight size={16} />
            </a>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
                <stat.icon size={18} style={{ color: "#FBBF24", margin: "0 auto 4px" }} />
                <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: "#93C5FD" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute flex flex-col items-center gap-2 z-10" style={{ bottom: 32, left: "50%", transform: "translateX(-50%)" }}>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Scroll to explore</span>
          <div className="flex justify-center" style={{ width: 24, height: 40, border: "2px solid rgba(255,255,255,0.3)", borderRadius: 20, paddingTop: 8 }}>
            <div className="animate-bounce" style={{ width: 6, height: 12, background: "rgba(255,255,255,0.6)", borderRadius: 6 }} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: "96px 24px", background: "#F9FAFB" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="text-center" style={{ marginBottom: 64 }}>
            <span className="inline-block" style={{ background: "#DBEAFE", color: "#1E40AF", fontSize: 14, fontWeight: 600, padding: "6px 16px", borderRadius: 20, marginBottom: 16 }}>
              Everything You Need
            </span>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 900, color: "#111827", marginBottom: 16 }}>
              Equipped for the Harvest
            </h2>
            <p style={{ color: "#6B7280", fontSize: 18, maxWidth: 600, margin: "0 auto" }}>
              Every tool, resource, and community you need to go out boldly and win souls for Christ.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl p-6 hover:-translate-y-1"
                style={{ background: "#fff", border: "1px solid #F3F4F6", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", transition: "all 0.3s" }}
              >
                <div className="flex items-center justify-center" style={{ width: 48, height: 48, borderRadius: 12, background: feature.bg, marginBottom: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", transition: "transform 0.3s" }}>
                  <feature.icon size={22} style={{ color: "#fff" }} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>{feature.title}</h3>
                <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── App Showcase Sections ─── */}
      {[
        {
          tag: "Daily Growth",
          tagBg: "#DBEAFE",
          tagColor: "#1E40AF",
          title: "30 Days of Bold Evangelism",
          desc: "Each day unlocks a unique challenge with scripture, prayer, worship notes, encouragement, and a practical outreach task. Track your progress with a beautiful card grid and continue challenges the next day if you need more time.",
          icon: CalendarDays,
          iconBg: "#1E40AF",
          features: ["Daily scripture & prayer", "Worship notes & encouragement", "Record your impact", "Share to community"],
          align: "left" as const,
          mockupBg: "linear-gradient(135deg, #1E3A8A, #2563EB)",
          mockupItems: [
            { label: "Day 1", sub: "Called to Go", done: true },
            { label: "Day 2", sub: "The Heart of Compassion", done: true },
            { label: "Day 3", sub: "Speaking Life", done: false },
            { label: "Day 4", sub: "Love Your Neighbor", done: false },
          ],
        },
        {
          tag: "Track Impact",
          tagBg: "#D1FAE5",
          tagColor: "#059669",
          title: "Every Soul Counts",
          desc: "Log every person you lead to Christ with their name, location, and story. Follow up with them through the built-in follow-up system. Watch your impact grow on the dashboard.",
          icon: Target,
          iconBg: "#059669",
          features: ["Log souls with details", "Follow-up reminders", "Personal dashboard stats", "Global soul counter"],
          align: "right" as const,
          mockupBg: "linear-gradient(135deg, #047857, #10B981)",
          mockupItems: [
            { label: "12", sub: "Souls Won This Month", done: true },
            { label: "8", sub: "Following Up", done: true },
            { label: "3", sub: "New This Week", done: false },
          ],
        },
        {
          tag: "Community",
          tagBg: "#EDE9FE",
          tagColor: "#7C3AED",
          title: "You're Not Alone",
          desc: "Share testimonies, post prayer requests, encourage fellow soul winners, and see what God is doing across the nation. Join groups, form outreach teams, and go out together.",
          icon: Globe,
          iconBg: "#7C3AED",
          features: ["Testimony feed", "Prayer wall", "Outreach groups", "Leaderboard"],
          align: "left" as const,
          mockupBg: "linear-gradient(135deg, #5B21B6, #7C3AED)",
          mockupItems: [
            { label: "Prayer Wall", sub: "42 active requests", done: true },
            { label: "Testimonies", sub: "Share what God did", done: true },
            { label: "Groups", sub: "Join a team", done: false },
          ],
        },
        {
          tag: "Resources",
          tagBg: "#FEF3C7",
          tagColor: "#D97706",
          title: "Everything You Need to Go Out",
          desc: "Scripture declaration cards, conversation starters, the gospel tool, Acts of Kindness Bingo, gift ideas, and location suggestions — all at your fingertips. Events with Google Maps directions included.",
          icon: Wrench,
          iconBg: "#D97706",
          features: ["30+ scripture cards", "34 conversation starters", "Gospel presentation tool", "Events with maps & directions"],
          align: "right" as const,
          mockupBg: "linear-gradient(135deg, #B45309, #F59E0B)",
          mockupItems: [
            { label: "Scripture Cards", sub: "Declare boldly", done: true },
            { label: "Conversation Starters", sub: "Break the ice", done: true },
            { label: "Gospel Tool", sub: "Lead them to Christ", done: true },
          ],
        },
      ].map((section, sIdx) => (
        <section key={sIdx} style={{ padding: "80px 24px", background: sIdx % 2 === 0 ? "#fff" : "#F9FAFB" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div className={`flex flex-col ${section.align === "right" ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 lg:gap-16 items-center`}>
              {/* Text side */}
              <div className="flex-1 text-center lg:text-left">
                <span className="inline-block rounded-full" style={{ background: section.tagBg, color: section.tagColor, fontSize: 13, fontWeight: 600, padding: "5px 14px", marginBottom: 16 }}>
                  {section.tag}
                </span>
                <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", fontWeight: 900, color: "#111827", marginBottom: 16, lineHeight: 1.2 }}>
                  {section.title}
                </h2>
                <p style={{ color: "#6B7280", fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
                  {section.desc}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {section.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <CheckCircle2 size={18} style={{ color: section.iconBg, flexShrink: 0 }} />
                      <span style={{ color: "#374151", fontWeight: 500, fontSize: 14 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* iPhone Mockup */}
              <div className="flex-1 flex justify-center">
                <div style={{ width: 280, position: "relative" }}>
                  {/* iPhone outer shell */}
                  <div style={{
                    background: "#1a1a1a",
                    borderRadius: 44,
                    padding: "14px 12px",
                    boxShadow: "0 30px 70px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 0 1px rgba(255,255,255,0.05)",
                  }}>
                    {/* Notch / Dynamic Island */}
                    <div style={{
                      width: 100,
                      height: 28,
                      background: "#1a1a1a",
                      borderRadius: 20,
                      margin: "0 auto 0",
                      position: "relative",
                      zIndex: 2,
                      top: 2,
                    }} />
                    {/* Screen */}
                    <div style={{
                      borderRadius: 32,
                      overflow: "hidden",
                      background: section.mockupBg,
                      marginTop: -14,
                    }}>
                      {/* Status bar */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px 0", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
                        <span>9:41</span>
                        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                          <div style={{ width: 16, height: 10, border: "1.5px solid rgba(255,255,255,0.6)", borderRadius: 2, position: "relative" }}>
                            <div style={{ position: "absolute", inset: 2, background: "rgba(255,255,255,0.6)", borderRadius: 1 }} />
                          </div>
                        </div>
                      </div>
                      {/* App content */}
                      <div style={{ padding: "20px 20px 28px" }}>
                        <div className="flex items-center gap-3 mb-5">
                          <div className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.2)" }}>
                            <section.icon size={20} style={{ color: "#fff" }} />
                          </div>
                          <div>
                            <p style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{section.tag}</p>
                            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Winning Souls</p>
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {section.mockupItems.map((item, i) => (
                            <div key={i} className="flex items-center gap-3" style={{ background: "rgba(255,255,255,0.1)", borderRadius: 14, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.08)" }}>
                              {item.done ? (
                                <div style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  <CheckCircle2 size={14} style={{ color: "#fff" }} />
                                </div>
                              ) : (
                                <div style={{ width: 26, height: 26, borderRadius: 8, border: "2px solid rgba(255,255,255,0.25)", flexShrink: 0 }} />
                              )}
                              <div>
                                <p style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{item.label}</p>
                                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10 }}>{item.sub}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div style={{ width: "100%", marginTop: 14, padding: "10px", borderRadius: 12, background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontWeight: 600, fontSize: 12, textAlign: "center" }}>
                          Open in App →
                        </div>
                      </div>
                      {/* Home indicator */}
                      <div style={{ display: "flex", justifyContent: "center", paddingBottom: 10 }}>
                        <div style={{ width: 120, height: 4, borderRadius: 4, background: "rgba(255,255,255,0.3)" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* How It Works */}
      <section style={{ padding: "96px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div className="text-center" style={{ marginBottom: 64 }}>
            <span className="inline-block" style={{ background: "#D1FAE5", color: "#059669", fontSize: 14, fontWeight: 600, padding: "6px 16px", borderRadius: 20, marginBottom: 16 }}>
              Simple &amp; Powerful
            </span>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 900, color: "#111827" }}>
              How It Works
            </h2>
          </div>

          <div>
            {[
              { step: "01", title: "Start Your 30-Day Challenge", desc: "Each day brings a new scripture, prayer, and evangelism challenge designed to stretch your faith and grow your boldness." },
              { step: "02", title: "Go Out & Share the Gospel", desc: "Use the toolkit — scripture cards, conversation starters, and the gospel tool — to guide your conversations with confidence." },
              { step: "03", title: "Log Souls & Track Your Impact", desc: "Record every person you lead to Christ. Follow up with them, pray for them, and watch your impact multiply." },
              { step: "04", title: "Celebrate with the Community", desc: "Share testimonies, encourage others, and be part of a global movement of soul winners on fire for God." },
            ].map((item, i) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center" style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #1E40AF, #1E3A8A)", color: "#fff", fontWeight: 900, fontSize: 18, boxShadow: "0 4px 12px rgba(30,64,175,0.3)" }}>
                    {item.step}
                  </div>
                  {i < 3 && <div style={{ width: 2, height: 64, background: "linear-gradient(to bottom, #93C5FD, transparent)", marginTop: 8 }} />}
                </div>
                <div style={{ paddingBottom: 48 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ color: "#6B7280", lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative overflow-hidden" style={{ padding: "96px 24px", background: "linear-gradient(180deg, #0c1a3a 0%, #1E3A8A 100%)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="text-center" style={{ marginBottom: 64 }}>
            <span className="inline-block" style={{ background: "rgba(255,255,255,0.1)", color: "#93C5FD", fontSize: 14, fontWeight: 600, padding: "6px 16px", borderRadius: 20, marginBottom: 16, border: "1px solid rgba(255,255,255,0.1)" }}>
              Real Stories
            </span>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 900, color: "#fff" }}>
              Lives Being Changed
            </h2>
          </div>

          <div className="relative" style={{ minHeight: 280 }}>
            {testimonials.map((t, i) => (
              <div
                key={i}
                style={{
                  transition: "all 0.7s ease",
                  opacity: i === activeTestimonial ? 1 : 0,
                  transform: i === activeTestimonial ? "translateY(0)" : "translateY(16px)",
                  position: i === activeTestimonial ? "relative" : "absolute",
                  inset: i === activeTestimonial ? undefined : 0,
                }}
              >
                <div className="text-center rounded-3xl" style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", padding: "40px 32px" }}>
                  <div className="flex justify-center gap-1" style={{ marginBottom: 24 }}>
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} size={20} style={{ color: "#FBBF24", fill: "#FBBF24" }} />
                    ))}
                  </div>
                  <blockquote style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", color: "rgba(255,255,255,0.9)", fontWeight: 500, lineHeight: 1.6, marginBottom: 32, fontStyle: "italic" }}>
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <p style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>{t.name}</p>
                  <p style={{ color: "#93C5FD", fontSize: 14 }}>{t.role}</p>
                </div>
              </div>
            ))}

            <div className="flex justify-center gap-2" style={{ marginTop: 32 }}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  style={{
                    width: i === activeTestimonial ? 32 : 10,
                    height: 10,
                    borderRadius: 10,
                    background: i === activeTestimonial ? "#fff" : "rgba(255,255,255,0.3)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scripture Banner */}
      <section style={{ padding: "64px 24px", background: "#fff" }}>
        <div className="text-center" style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#DBEAFE", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BookOpen size={24} style={{ color: "#1E40AF" }} />
          </div>
          <blockquote style={{ fontSize: "clamp(1.4rem, 3vw, 1.8rem)", fontWeight: 700, color: "#111827", lineHeight: 1.4, marginBottom: 16, fontStyle: "italic" }}>
            &ldquo;Go into all the world and preach the gospel to all creation.&rdquo;
          </blockquote>
          <p style={{ color: "#1E40AF", fontWeight: 600, fontSize: 18 }}>Mark 16:15</p>
        </div>
      </section>

      {/* Checklist Section */}
      <section style={{ padding: "96px 24px", background: "#F9FAFB" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div className="text-center" style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 900, color: "#111827" }}>
              What&apos;s Inside
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "30 daily evangelism challenges",
              "Daily scriptures, prayers & encouragement",
              "Reflection & impact journal",
              "30 scripture declaration cards",
              "34 conversation starter cards",
              "Gospel soul-winning tool",
              "Acts of Kindness Bingo boards",
              "26+ gift & outreach ideas",
              "Soul tracking & follow-up tools",
              "Prayer wall & community feed",
              "Testimony sharing platform",
              "Group & team management",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl" style={{ background: "#fff", padding: 16, border: "1px solid #F3F4F6", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <CheckCircle2 size={20} style={{ color: "#10B981", flexShrink: 0 }} />
                <span style={{ color: "#374151", fontWeight: 500, fontSize: 14 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden" style={{ padding: "96px 24px", background: "linear-gradient(135deg, #1E40AF 0%, #2563EB 50%, #4F46E5 100%)" }}>
        <div className="absolute" style={{ inset: 0, opacity: 0.2, pointerEvents: "none" }}>
          <div className="absolute rounded-full" style={{ top: 0, left: "25%", width: 400, height: 400, background: "#fff", filter: "blur(120px)" }} />
          <div className="absolute rounded-full" style={{ bottom: 0, right: "25%", width: 300, height: 300, background: "#FBBF24", filter: "blur(120px)" }} />
        </div>

        <div className="text-center relative z-10" style={{ maxWidth: 600, margin: "0 auto" }}>
          <Flame size={40} style={{ color: "#FBBF24", margin: "0 auto 24px" }} />
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 900, color: "#fff", marginBottom: 16 }}>
            Ready to Win Souls?
          </h2>
          <p style={{ color: "#BFDBFE", fontSize: 18, marginBottom: 40, maxWidth: 500, margin: "0 auto 40px" }}>
            Join the movement. Start your 30-day soul-winning challenge today and watch God use you to change lives for eternity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button
              onClick={handleInstallClick}
              className="group inline-flex items-center gap-3"
              style={{ background: "#fff", color: "#1E3A8A", fontWeight: 700, fontSize: 18, padding: "20px 40px", borderRadius: 16, boxShadow: "0 10px 40px rgba(0,0,0,0.2)", border: "none", cursor: "pointer", transition: "all 0.3s" }}
            >
              <Download size={22} /> Install App
            </button>
            <ShareInvite />
          </div>
        </div>
      </section>

      {/* Install Guide Modal */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 relative">
            <button onClick={() => setShowInstallGuide(false)} className="absolute top-4 right-4 text-grey-dark hover:text-dark" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20 }}>
              ✕
            </button>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center rounded-full" style={{ width: 56, height: 56, background: "#EFF6FF", marginBottom: 12 }}>
                <Smartphone size={28} style={{ color: "#1E40AF" }} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>
                {platform === "ios" ? "Install on iPhone" : platform === "android" ? "Install on Android" : platform === "windows" ? "Install on Windows" : "Install on Mac"}
              </h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {platform === "ios" ? (
                <>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#1E40AF", color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>1</span>
                    <p style={{ fontSize: 14, color: "#4B5563", paddingTop: 2 }}>Open this page in <strong>Safari</strong></p>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#1E40AF", color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>2</span>
                    <p style={{ fontSize: 14, color: "#4B5563", paddingTop: 2 }}>Tap the <strong>Share</strong> button <span style={{ display: "inline-block", background: "#F3F4F6", borderRadius: 4, padding: "0 4px", fontSize: 16 }}>⬆</span> at the bottom</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#1E40AF", color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>3</span>
                    <p style={{ fontSize: 14, color: "#4B5563", paddingTop: 2 }}>Tap <strong>&quot;Add to Home Screen&quot;</strong> then <strong>&quot;Add&quot;</strong></p>
                  </div>
                </>
              ) : platform === "android" ? (
                <>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#1E40AF", color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>1</span>
                    <p style={{ fontSize: 14, color: "#4B5563", paddingTop: 2 }}>Open this page in <strong>Chrome</strong></p>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#1E40AF", color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>2</span>
                    <p style={{ fontSize: 14, color: "#4B5563", paddingTop: 2 }}>Tap the <strong>⋮ menu</strong> (three dots) at the top right</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#1E40AF", color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>3</span>
                    <p style={{ fontSize: 14, color: "#4B5563", paddingTop: 2 }}>Tap <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong></p>
                  </div>
                </>
              ) : platform === "windows" ? (
                <>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#1E40AF", color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>1</span>
                    <p style={{ fontSize: 14, color: "#4B5563", paddingTop: 2 }}>Open this page in <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong></p>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#1E40AF", color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>2</span>
                    <p style={{ fontSize: 14, color: "#4B5563", paddingTop: 2 }}>Click the <strong>install icon</strong> ⬇ in the address bar (right side)</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#1E40AF", color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>3</span>
                    <p style={{ fontSize: 14, color: "#4B5563", paddingTop: 2 }}>Click <strong>&quot;Install&quot;</strong> — the app will open in its own window!</p>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#1E40AF", color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>1</span>
                    <p style={{ fontSize: 14, color: "#4B5563", paddingTop: 2 }}>Open this page in <strong>Google Chrome</strong> (Safari does not support app install)</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#1E40AF", color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>2</span>
                    <p style={{ fontSize: 14, color: "#4B5563", paddingTop: 2 }}>Click the <strong>install icon</strong> ⬇ in the address bar (right side)</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#1E40AF", color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>3</span>
                    <p style={{ fontSize: 14, color: "#4B5563", paddingTop: 2 }}>Click <strong>&quot;Install&quot;</strong> — the app opens in its own window, just like a native app!</p>
                  </div>
                </>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
              <button
                onClick={() => setShowInstallGuide(false)}
                style={{ flex: 1, padding: "14px", borderRadius: 12, background: "#1E40AF", color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}
              >
                Got It
              </button>
              <button
                onClick={() => { setShowInstallGuide(false); onEnterApp(); }}
                style={{ flex: 1, padding: "14px", borderRadius: 12, background: "#F3F4F6", color: "#374151", fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}
              >
                Use in Browser
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ background: "#111827", padding: "40px 24px" }}>
        <div className="text-center" style={{ maxWidth: 600, margin: "0 auto" }}>
          <div className="flex justify-center mb-3"><LogoIcon size={40} /></div>
          <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Winning Souls</h3>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 16 }}>30-Day Soul-Winning Challenge Companion App</p>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>&copy; {new Date().getFullYear()} Winning Souls. All rights reserved. Built with love for the Kingdom.</p>
        </div>
      </footer>
    </div>
  );
}
