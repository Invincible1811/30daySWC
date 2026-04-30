"use client";

import { Crown, CheckCircle2, Flame, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";

export function useSubscriptionStatus() {
  const { profile } = useAuth();

  if (!profile) return { status: "loading" as const, daysLeft: 0, hasAccess: false };

  const isAdmin = profile.role === "admin" || profile.role === "assistant_admin";
  if (isAdmin) return { status: "active" as const, daysLeft: 999, hasAccess: true };

  if (profile.subscription_status === "active") {
    return { status: "active" as const, daysLeft: 999, hasAccess: true };
  }

  if (profile.subscription_status === "trial") {
    const trialEnd = new Date(profile.trial_ends_at);
    const now = new Date();
    const daysLeft = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    if (daysLeft > 0) {
      return { status: "trial" as const, daysLeft, hasAccess: true };
    } else {
      return { status: "expired" as const, daysLeft: 0, hasAccess: false };
    }
  }

  return { status: "expired" as const, daysLeft: 0, hasAccess: false };
}

export default function Paywall() {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    // TODO: Replace with actual Stripe checkout session
    // When you have your Stripe account, create an API route at /api/checkout
    // that creates a Stripe Checkout session and redirects the user
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Payment system is being set up. Please try again later or contact support.");
      }
    } catch {
      alert("Payment system is being set up. Please try again later or contact support.");
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #0c1a3a 0%, #1E3A8A 40%, #1E40AF 100%)" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: 0.12 }}>
        <div className="absolute rounded-full" style={{ top: "15%", left: "10%", width: 300, height: 300, background: "#3B82F6", filter: "blur(120px)" }} />
        <div className="absolute rounded-full" style={{ bottom: "15%", right: "10%", width: 350, height: 350, background: "#6366F1", filter: "blur(120px)" }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Flame size={40} style={{ color: "#FBBF24", margin: "0 auto 12px" }} />
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>Winning Souls</h1>
        </div>

        <div className="rounded-3xl" style={{ background: "#fff", padding: "36px 28px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center rounded-full" style={{ width: 64, height: 64, background: "#FEF3C7", marginBottom: 16 }}>
              <Crown size={32} style={{ color: "#D97706" }} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
              Your Free Trial Has Ended
            </h2>
            <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.6 }}>
              Continue your soul-winning journey for just $8/month.
            </p>
          </div>

          {/* Features included */}
          <div className="rounded-xl mb-6" style={{ background: "#F9FAFB", padding: "16px" }}>
            <p className="text-xs font-bold text-grey-dark mb-3 uppercase tracking-wider">What you get</p>
            <div className="space-y-2.5">
              {[
                "Full 30-day challenge access",
                "Soul tracker & follow-up tools",
                "Community, prayer wall & testimonies",
                "Evangelism toolkit & scripture cards",
                "Direct messaging & groups",
                "Events with Google Maps",
                "Leaderboard & achievements",
              ].map(f => (
                <div key={f} className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} style={{ color: "#10B981", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="text-center mb-6">
            <div className="flex items-baseline justify-center gap-1">
              <span style={{ fontSize: 40, fontWeight: 900, color: "#111827" }}>$8</span>
              <span style={{ fontSize: 16, color: "#6B7280", fontWeight: 500 }}>/month</span>
            </div>
            <p style={{ fontSize: 12, color: "#9CA3AF" }}>Cancel anytime</p>
          </div>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl transition-all active:scale-[0.98]"
            style={{ background: "#1E40AF", color: "#fff", fontWeight: 700, fontSize: 16, padding: "16px", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Crown size={20} />}
            Subscribe Now
          </button>

          <button
            onClick={signOut}
            className="w-full text-center mt-4"
            style={{ color: "#9CA3AF", fontSize: 13, background: "none", border: "none", cursor: "pointer" }}
          >
            Sign out instead
          </button>
        </div>
      </div>
    </div>
  );
}
