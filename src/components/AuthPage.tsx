"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Flame, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, Inbox } from "lucide-react";

type AuthMode = "login" | "signup" | "forgot" | "confirm";

export default function AuthPage({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [signupEmail, setSignupEmail] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      onAuthSuccess();
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, username: email.split("@")[0] },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    if (error) {
      setError(error.message);
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
      // Email already exists — Supabase returns a fake success with no identities
      setError("__duplicate__");
    } else {
      setSignupEmail(email);
      setMode("confirm");
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset link sent! Check your email.");
      setMode("login");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}` },
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #0c1a3a 0%, #1E3A8A 40%, #1E40AF 100%)" }}>
      {/* Glow orbs */}
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
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>Winning Souls</h1>
          <p style={{ color: "#93C5FD", fontSize: 14, marginTop: 4 }}>30-Day Soul-Winning Challenge</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl" style={{ background: "#fff", padding: "32px 28px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          {/* Confirm Email Screen */}
          {mode === "confirm" && (
            <div className="text-center" style={{ padding: "16px 0" }}>
              <div className="inline-flex items-center justify-center rounded-full" style={{ width: 64, height: 64, background: "#F0FDF4", marginBottom: 20 }}>
                <Inbox size={32} style={{ color: "#16A34A" }} />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Check Your Email</h2>
              <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>
                We sent a confirmation link to
              </p>
              <p style={{ color: "#1E40AF", fontSize: 15, fontWeight: 700, marginBottom: 20 }}>
                {signupEmail}
              </p>
              <div className="rounded-xl" style={{ background: "#F9FAFB", padding: 20, textAlign: "left", marginBottom: 24 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 12 }}>Next Steps:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <CheckCircle2 size={18} style={{ color: "#16A34A", flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontSize: 13, color: "#4B5563" }}>Open your email inbox</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <CheckCircle2 size={18} style={{ color: "#16A34A", flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontSize: 13, color: "#4B5563" }}>Click the confirmation link from Supabase</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <CheckCircle2 size={18} style={{ color: "#16A34A", flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontSize: 13, color: "#4B5563" }}>Come back here and log in to start winning souls!</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { setMode("login"); setError(""); setMessage(""); }}
                className="w-full flex items-center justify-center gap-2 rounded-xl transition-all active:scale-[0.98]"
                style={{ background: "#1E40AF", color: "#fff", fontWeight: 700, fontSize: 15, padding: "14px", border: "none", cursor: "pointer" }}
              >
                Go to Log In <ArrowRight size={18} />
              </button>
              <p style={{ color: "#9CA3AF", fontSize: 12, marginTop: 16 }}>
                Didn&apos;t get the email? Check your spam folder.
              </p>
            </div>
          )}

          {/* Tab toggle */}
          {mode !== "forgot" && mode !== "confirm" && (
            <div className="flex rounded-xl" style={{ background: "#F3F4F6", padding: 4, marginBottom: 24 }}>
              <button
                onClick={() => { setMode("login"); setError(""); }}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{ background: mode === "login" ? "#fff" : "transparent", color: mode === "login" ? "#111827" : "#6B7280", boxShadow: mode === "login" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}
              >
                Log In
              </button>
              <button
                onClick={() => { setMode("signup"); setError(""); }}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{ background: mode === "signup" ? "#fff" : "transparent", color: mode === "signup" ? "#111827" : "#6B7280", boxShadow: mode === "signup" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}
              >
                Sign Up
              </button>
            </div>
          )}

          {mode !== "confirm" && (<>
          {/* Messages */}
          {error && error === "__duplicate__" && (
            <div className="rounded-xl" style={{ background: "#FEF2F2", padding: "16px", marginBottom: 16 }}>
              <p style={{ color: "#DC2626", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                An account with this email already exists.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => { setMode("login"); setError(""); }}
                  style={{ fontSize: 12, fontWeight: 700, color: "#1E40AF", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                >
                  Log In instead
                </button>
                <span style={{ color: "#D1D5DB" }}>|</span>
                <button
                  onClick={() => { setMode("forgot"); setError(""); }}
                  style={{ fontSize: 12, fontWeight: 700, color: "#1E40AF", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                >
                  Forgot password?
                </button>
              </div>
            </div>
          )}
          {error && error !== "__duplicate__" && (
            <div className="rounded-xl" style={{ background: "#FEF2F2", padding: "12px 16px", marginBottom: 16, color: "#DC2626", fontSize: 13, fontWeight: 500 }}>
              {error}
            </div>
          )}
          {message && (
            <div className="rounded-xl" style={{ background: "#F0FDF4", padding: "12px 16px", marginBottom: 16, color: "#16A34A", fontSize: 13, fontWeight: 500 }}>
              {message}
            </div>
          )}

          {/* Forms */}
          <form onSubmit={mode === "login" ? handleLogin : mode === "signup" ? handleSignup : handleForgotPassword}>
            {mode === "forgot" && (
              <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 16 }}>
                Enter your email and we&apos;ll send you a reset link.
              </p>
            )}

            {mode === "signup" && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Full Name</label>
                <div className="flex items-center rounded-xl" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", padding: "0 14px" }}>
                  <User size={18} style={{ color: "#9CA3AF", flexShrink: 0 }} />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full bg-transparent outline-none"
                    style={{ padding: "12px 10px", fontSize: 14, color: "#111827", border: "none" }}
                  />
                </div>
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email</label>
              <div className="flex items-center rounded-xl" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", padding: "0 14px" }}>
                <Mail size={18} style={{ color: "#9CA3AF", flexShrink: 0 }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-transparent outline-none"
                  style={{ padding: "12px 10px", fontSize: 14, color: "#111827", border: "none" }}
                />
              </div>
            </div>

            {mode !== "forgot" && (
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Password</label>
                <div className="flex items-center rounded-xl" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", padding: "0 14px" }}>
                  <Lock size={18} style={{ color: "#9CA3AF", flexShrink: 0 }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "signup" ? "Min 6 characters" : "Your password"}
                    required
                    className="w-full bg-transparent outline-none"
                    style={{ padding: "12px 10px", fontSize: 14, color: "#111827", border: "none" }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                    {showPassword ? <EyeOff size={18} style={{ color: "#9CA3AF" }} /> : <Eye size={18} style={{ color: "#9CA3AF" }} />}
                  </button>
                </div>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => { setMode("forgot"); setError(""); }}
                    style={{ fontSize: 13, color: "#1E40AF", fontWeight: 500, marginTop: 8, background: "none", border: "none", cursor: "pointer" }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl transition-all active:scale-[0.98]"
              style={{ background: "#1E40AF", color: "#fff", fontWeight: 700, fontSize: 15, padding: "14px", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Log In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {mode === "forgot" && (
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className="w-full text-center"
              style={{ marginTop: 16, fontSize: 14, color: "#1E40AF", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}
            >
              Back to login
            </button>
          )}

          {/* Divider */}
          {(mode === "login" || mode === "signup") && (
            <>
              <div className="flex items-center gap-4" style={{ margin: "24px 0" }}>
                <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
                <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500 }}>or</span>
                <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
              </div>

              {/* Google Login */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 rounded-xl transition-all active:scale-[0.98]"
                style={{ background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, padding: "12px", border: "1px solid #E5E7EB", cursor: "pointer" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
            </>
          )}
          </>)}
        </div>

        {/* Bottom text */}
        <p className="text-center" style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 24 }}>
          By continuing, you agree to share the Gospel boldly.
        </p>
      </div>
    </div>
  );
}
