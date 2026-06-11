"use client";

import { Award, BookOpen, Trophy, Star, GraduationCap, Sparkles, CheckCircle2, Heart, HandHeart, Bell } from "lucide-react";
import { useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (isSupabaseConfigured) {
      await supabase.from("notify_emails").upsert({ email: email.trim().toLowerCase() }, { onConflict: "email" });
    }
    setSubscribed(true);
    setEmail("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-br from-dark via-dark-light to-primary-dark rounded-2xl p-8 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-warning/10 rounded-full blur-xl" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary/10 rounded-full blur-xl" />
        </div>
        <div className="relative z-10">
          <div className="w-20 h-20 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap size={40} className="text-warning" />
          </div>
          <div className="inline-block bg-warning/20 text-warning text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            COMING SOON
          </div>
          <h2 className="text-3xl font-bold mb-2">Bible School Scholarship</h2>
          <p className="text-grey-medium max-w-lg mx-auto">
            Rewarding the most dedicated soul-winners with a full scholarship to Bible school.
            Continue stepping out in faith. Win souls. Grow in boldness. Step confidently into what God is calling you to.
          </p>
        </div>
      </div>

      {/* Announcement Teaser */}
      <div className="bg-card rounded-2xl p-8 shadow-sm border border-grey-light text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-warning/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-primary/10 rounded-full blur-2xl" />
        </div>
        <div className="relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-warning/20 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bell size={28} className="text-primary" />
          </div>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-3">
            <Sparkles size={12} /> Stay Tuned
          </div>
          <h3 className="text-xl font-extrabold text-dark mb-2">Big Announcement Coming!</h3>
          <p className="text-grey-dark text-sm max-w-sm mx-auto leading-relaxed">
            Something exciting is being prepared for the most dedicated soul-winners.
            Keep winning souls, keep stepping out in faith — the details will be revealed soon!
          </p>
          <div className="mt-5 flex items-center justify-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-grey-light">
        <h3 className="font-bold text-dark mb-4">What You Stand to Gain</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: <GraduationCap className="text-primary" size={24} />, title: "Full Scholarship", desc: "Complete tuition coverage for a Bible school centered on practical ministry, biblical foundations, and spiritual growth." },
            { icon: <Trophy className="text-warning" size={24} />, title: "Recognition", desc: "Honoring those who are faithfully stepping out in faith and leading others to Christ." },
            { icon: <BookOpen className="text-success" size={24} />, title: "Further Training", desc: "Receive practical and biblical training to continue growing in your calling, boldness, and ability to share your faith effectively." },
            { icon: <Star className="text-danger" size={24} />, title: "Mentorship", desc: "Learn from experienced Pastors, Evangelists, and Ministry Leaders who are passionate about raising up the next generation." },
          ].map(benefit => (
            <div key={benefit.title} className="flex items-start gap-3 p-3 rounded-xl bg-grey-light/50">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
                {benefit.icon}
              </div>
              <div>
                <h4 className="font-semibold text-dark text-sm">{benefit.title}</h4>
                <p className="text-xs text-grey-dark mt-0.5">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Eligibility */}
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-grey-light">
        <h3 className="font-bold text-dark mb-4">Eligibility Criteria</h3>
        <div className="space-y-3">
          {[
            "Complete the 30-Day Soul Winning Challenge",
            "Show consistency and faithfulness in soul-winning beyond the challenge",
            "Keep records of souls reached and people prayed for",
            "Remain actively engaged in the Soul Winning community",
            "Submit testimonies of lives impacted through steps of faith, soul-winning, and discipleship",
            "Continue following up with and discipling those led to Christ",
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-success shrink-0" />
              <p className="text-sm text-grey-dark">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sponsor a Soul-Winner */}
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-grey-light">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <HandHeart size={22} className="text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-dark">Sponsor a Soul-Winner</h3>
            <p className="text-xs text-grey-dark">Support a Scholarship</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-grey-light/50 rounded-xl p-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-grey-dark font-medium">Scholarships Funded</span>
              <span className="font-bold text-primary">0 / 5</span>
            </div>
            <div className="w-full h-3 bg-grey-light rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full" style={{ width: "0%" }} />
            </div>
          </div>
          <p className="text-xs text-grey-dark text-center">Testimonies of impact connected to giving will be shared here.</p>
        </div>
      </div>

      {/* Email Signup */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 text-white text-center">
        <Award size={32} className="mx-auto mb-3 text-warning" />
        <h3 className="text-xl font-bold mb-2">Get Notified When Applications Open</h3>
        <p className="text-blue-200 text-sm mb-4">Be the first to know when the scholarship program launches.</p>
        {subscribed ? (
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <CheckCircle2 size={24} className="text-success mx-auto mb-2" />
            <p className="font-semibold">You&apos;ve been added!</p>
            <p className="text-blue-200 text-xs mt-1">We&apos;ll send you an email when applications open.</p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl text-dark text-sm focus:outline-none"
            />
            <button type="submit" className="bg-warning text-dark font-semibold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors whitespace-nowrap">
              Notify Me
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
