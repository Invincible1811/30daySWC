"use client";

import { useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { Flame, AtSign, Check, Loader2, AlertCircle } from "lucide-react";

export default function UsernameSetup({ onComplete }: { onComplete: () => void }) {
  const { user, refreshProfile } = useAuth();
  const [username, setUsername] = useState("");
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [available, setAvailable] = useState<boolean | null>(null);

  const sanitize = (val: string) => val.toLowerCase().replace(/[^a-z0-9._-]/g, "");

  const handleChange = (val: string) => {
    const clean = sanitize(val);
    setUsername(clean);
    setError("");
    setAvailable(null);
  };

  const checkAvailability = async () => {
    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (!isSupabaseConfigured) return;

    setChecking(true);
    setError("");

    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .neq("id", user?.id || "");

    if (data && data.length > 0) {
      setAvailable(false);
      setError("This username is already taken. Try another one.");
    } else {
      setAvailable(true);
    }
    setChecking(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (!available) {
      await checkAvailability();
      return;
    }

    if (!user || !isSupabaseConfigured) return;

    setSaving(true);
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ username, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (updateError) {
      setError("Failed to save username. Please try again.");
      setSaving(false);
      return;
    }

    await refreshProfile();
    setSaving(false);
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #0c1a3a 0%, #1E3A8A 40%, #1E40AF 100%)" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: 0.12 }}>
        <div className="absolute rounded-full" style={{ top: "15%", left: "10%", width: 300, height: 300, background: "#3B82F6", filter: "blur(120px)" }} />
        <div className="absolute rounded-full" style={{ bottom: "15%", right: "10%", width: 350, height: 350, background: "#6366F1", filter: "blur(120px)" }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center" style={{ marginBottom: 32 }}>
          <div className="inline-flex items-center justify-center rounded-2xl" style={{ width: 56, height: 56, background: "rgba(255,255,255,0.1)", marginBottom: 16 }}>
            <Flame size={28} style={{ color: "#FBBF24" }} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>Welcome to Winning Souls!</h1>
          <p style={{ color: "#93C5FD", fontSize: 14, marginTop: 8 }}>Choose a username to get started</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl" style={{ background: "#fff", padding: "32px 28px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <div className="text-center" style={{ marginBottom: 24 }}>
            <div className="inline-flex items-center justify-center rounded-full" style={{ width: 56, height: 56, background: "#EFF6FF", marginBottom: 12 }}>
              <AtSign size={26} style={{ color: "#1E40AF" }} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Pick Your Username</h2>
            <p style={{ fontSize: 13, color: "#6B7280" }}>This is how other soul winners will know you</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <div className="flex items-center rounded-xl" style={{ background: "#F9FAFB", border: `1px solid ${error ? "#FCA5A5" : available ? "#86EFAC" : "#E5E7EB"}`, padding: "0 14px", transition: "border-color 0.2s" }}>
                <span style={{ color: "#9CA3AF", fontSize: 15, fontWeight: 600, marginRight: 2 }}>@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={() => { if (username.length >= 3) checkAvailability(); }}
                  placeholder="your_username"
                  required
                  maxLength={24}
                  className="w-full bg-transparent outline-none"
                  style={{ padding: "14px 8px", fontSize: 15, color: "#111827", border: "none" }}
                />
                {checking && <Loader2 size={18} className="animate-spin" style={{ color: "#9CA3AF", flexShrink: 0 }} />}
                {available && !checking && <Check size={18} style={{ color: "#16A34A", flexShrink: 0 }} />}
                {available === false && !checking && <AlertCircle size={18} style={{ color: "#DC2626", flexShrink: 0 }} />}
              </div>

              {error && (
                <p style={{ fontSize: 12, color: "#DC2626", marginTop: 6, fontWeight: 500 }}>{error}</p>
              )}
              {available && (
                <p style={{ fontSize: 12, color: "#16A34A", marginTop: 6, fontWeight: 500 }}>Username is available!</p>
              )}
              <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 6 }}>
                Lowercase letters, numbers, dots, hyphens. Min 3 characters.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving || checking || username.length < 3}
              className="w-full flex items-center justify-center gap-2 rounded-xl transition-all active:scale-[0.98]"
              style={{
                background: (saving || checking || username.length < 3) ? "#93C5FD" : "#1E40AF",
                color: "#fff", fontWeight: 700, fontSize: 15, padding: "14px",
                border: "none", cursor: (saving || checking || username.length < 3) ? "not-allowed" : "pointer",
              }}
            >
              {saving ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Continue"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
