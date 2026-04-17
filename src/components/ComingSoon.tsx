"use client";

import { Award, BookOpen, Trophy, Star, GraduationCap, Clock, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 45);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
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
            Rewarding the most dedicated soul winners with a full scholarship to Bible School.
            Win souls, change lives, and earn the opportunity to deepen your theological education.
          </p>
        </div>
      </div>

      {/* Countdown */}
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-grey-light">
        <h3 className="font-bold text-dark text-center mb-4 flex items-center justify-center gap-2">
          <Clock className="text-primary" size={20} /> Launch Countdown
        </h3>
        <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
          {[
            { value: timeLeft.days, label: "Days" },
            { value: timeLeft.hours, label: "Hours" },
            { value: timeLeft.minutes, label: "Minutes" },
            { value: timeLeft.seconds, label: "Seconds" },
          ].map(item => (
            <div key={item.label} className="bg-dark rounded-xl p-3 text-center">
              <p className="text-2xl lg:text-3xl font-bold text-white">{String(item.value).padStart(2, "0")}</p>
              <p className="text-xs text-grey-medium mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-grey-light">
        <h3 className="font-bold text-dark mb-4">What You Stand to Gain</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: <GraduationCap className="text-primary" size={24} />, title: "Full Scholarship", desc: "Complete tuition coverage for an accredited Bible school program" },
            { icon: <Trophy className="text-warning" size={24} />, title: "Recognition", desc: "Be celebrated as a top soul winner in the global community" },
            { icon: <BookOpen className="text-success" size={24} />, title: "Deeper Knowledge", desc: "Advanced theological training to multiply your evangelism impact" },
            { icon: <Star className="text-danger" size={24} />, title: "Mentorship", desc: "Personal mentorship from experienced pastors and evangelists" },
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
            "Log a minimum of 30 verified souls won",
            "Maintain active follow-up records for all contacts",
            "Be an active member of the Winning Souls community",
            "Submit at least 3 testimonies of evangelism impact",
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-success shrink-0" />
              <p className="text-sm text-grey-dark">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Email Signup */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 text-white text-center">
        <Award size={32} className="mx-auto mb-3 text-warning" />
        <h3 className="text-xl font-bold mb-2">Get Notified When Applications Open</h3>
        <p className="text-blue-200 text-sm mb-4">Be the first to know when the scholarship program launches.</p>
        {subscribed ? (
          <div className="bg-white/20 rounded-xl p-4 flex items-center justify-center gap-2">
            <CheckCircle2 size={20} className="text-success" />
            <p className="font-semibold">You&apos;re on the list! We&apos;ll notify you soon.</p>
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
