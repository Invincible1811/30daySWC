"use client";

import { Sparkles, CheckCircle2, Bell } from "lucide-react";
import { useState } from "react";

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await fetch("/api/notify-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
    } catch { /* still show success to user */ }
    setSubscribed(true);
    setEmail("");
  };

  const benefits = [
    { icon: "🎓", color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", title: "Full Scholarship", desc: "Complete tuition coverage for Bible school — practical ministry, biblical foundations, and spiritual growth." },
    { icon: "🏆", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", title: "Recognition", desc: "Publicly honouring those faithfully stepping out in faith and leading others to Christ." },
    { icon: "📖", color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0", title: "Further Training", desc: "Biblical and practical training to grow in your calling, boldness, and ability to share the Gospel." },
    { icon: "🤝", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", title: "Mentorship", desc: "Learn from Pastors, Evangelists, and Ministry Leaders passionate about raising the next generation." },
  ];

  const criteria = [
    "Complete the 30-Day Soul Winning Challenge",
    "Show consistency and faithfulness in soul-winning beyond the challenge",
    "Keep records of souls reached and people prayed for",
    "Remain actively engaged in the Soul Winning community",
    "Submit testimonies of lives impacted through steps of faith and discipleship",
    "Continue following up with and discipling those led to Christ",
  ];

  return (
    <div className="animate-fade-in space-y-5">

      {/* ── Hero ── */}
      <div className="relative rounded-2xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0f172a 100%)", boxShadow: "0 8px 40px rgba(37,99,235,0.15)" }}>
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="relative z-10 text-center px-6 py-10">
          <div className="inline-flex items-center gap-2 bg-amber-400/15 text-amber-300 text-xs font-bold px-4 py-1.5 rounded-full mb-5 border border-amber-400/20">
            <Sparkles size={11} /> COMING SOON
          </div>
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center text-4xl"
            style={{ background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.3)" }}>
            🎓
          </div>
          <h2 className="text-3xl font-black text-white mb-3 leading-tight">Bible School<br />Scholarship</h2>
          <p className="text-slate-300/70 text-sm max-w-sm mx-auto leading-relaxed">
            Rewarding the most dedicated soul-winners with a full scholarship. Keep stepping out in faith — your faithfulness is being noticed.
          </p>
          {/* Animated dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {[0, 150, 300].map(d => (
              <div key={d} className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Big Announcement Banner ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 bg-amber-50 border border-amber-100">🔔</div>
        <div>
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-full mb-2">
            <Bell size={10} /> Stay Tuned
          </div>
          <h3 className="font-bold text-slate-800 text-base">Big Announcement Coming!</h3>
          <p className="text-slate-500 text-sm mt-1 leading-relaxed">
            Something exciting is being prepared for the most dedicated soul-winners. Keep winning souls, keep stepping out in faith.
          </p>
        </div>
      </div>

      {/* ── Benefits ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
          <span className="text-base">✨</span> What You Stand to Gain
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {benefits.map(b => (
            <div key={b.title} className="flex items-start gap-3 p-3.5 rounded-xl border transition-all hover:scale-[1.01]"
              style={{ background: b.bg, borderColor: b.border }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 bg-white shadow-sm">
                {b.icon}
              </div>
              <div>
                <h4 className="font-bold text-sm" style={{ color: b.color }}>{b.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Eligibility ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
          <span className="text-base">📋</span> Eligibility Criteria
        </h3>
        <div className="space-y-2.5">
          {criteria.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#DCFCE7", border: "1px solid #BBF7D0" }}>
                <CheckCircle2 size={13} style={{ color: "#16A34A" }} />
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sponsor Progress ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl bg-purple-50 border border-purple-100">🤲</div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Sponsor a Soul-Winner</h3>
            <p className="text-xs text-slate-400">Help fund a scholarship</p>
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="flex items-center justify-between text-sm mb-2.5">
            <span className="text-slate-600 font-medium">Scholarships Funded</span>
            <span className="font-bold text-blue-600">0 / 5</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: "0%", background: "linear-gradient(90deg, #2563EB, #7C3AED)" }} />
          </div>
          <p className="text-xs text-slate-400 mt-2.5 text-center">Testimonies of impact connected to giving will be shared here.</p>
        </div>
      </div>

      {/* ── Email Signup ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)", boxShadow: "0 8px 24px rgba(37,99,235,0.2)" }}>
        <div className="p-6 text-center">
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="text-xl font-bold text-white mb-1">Get Notified First</h3>
          <p className="text-blue-200/70 text-sm mb-5">Be the first to know when applications open.</p>
          {subscribed ? (
            <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
              <div className="text-3xl mb-2">✅</div>
              <p className="font-bold text-white">You&apos;re on the list!</p>
              <p className="text-blue-200/60 text-xs mt-1">We&apos;ll email you when applications open.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2.5 max-w-sm mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-4 py-3 rounded-xl text-slate-800 text-sm focus:outline-none bg-white shadow-sm"
              />
              <button type="submit"
                className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 shadow-md"
                style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#1a1200" }}>
                Notify Me When It Launches
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
