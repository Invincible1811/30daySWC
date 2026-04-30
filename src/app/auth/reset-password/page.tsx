"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Lock, Eye, EyeOff, CheckCircle2, XCircle, Loader2, Flame, ArrowRight } from "lucide-react";

export default function ResetPasswordPage() {
  const [status, setStatus] = useState<"loading" | "ready" | "success" | "error">("loading");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", "?"));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");

    const searchParams = new URLSearchParams(window.location.search);
    const tokenHash = searchParams.get("token_hash");
    const confirmType = searchParams.get("type") || type;

    (async () => {
      try {
        if (tokenHash && confirmType === "recovery") {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: "recovery",
          });
          if (error) throw error;
          setStatus("ready");
        } else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
          setStatus("ready");
        } else {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            setStatus("ready");
          } else {
            setError("Invalid or expired reset link. Please request a new one.");
            setStatus("error");
          }
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setStatus("error");
      }
    })();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setStatus("success");
    }
    setSaving(false);
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
        <div className="text-center" style={{ marginBottom: 32 }}>
          <div className="inline-flex items-center justify-center rounded-2xl" style={{ width: 56, height: 56, background: "rgba(255,255,255,0.1)", marginBottom: 16 }}>
            <Flame size={28} style={{ color: "#FBBF24" }} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>Winning Souls</h1>
        </div>

        <div className="rounded-3xl" style={{ background: "#fff", padding: "32px 28px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          {status === "loading" && (
            <div className="text-center" style={{ padding: "24px 0" }}>
              <Loader2 size={40} className="animate-spin mx-auto" style={{ color: "#1E40AF", marginBottom: 16 }} />
              <p style={{ color: "#6B7280", fontSize: 14 }}>Verifying reset link...</p>
            </div>
          )}

          {status === "ready" && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 4, textAlign: "center" }}>Set New Password</h2>
              <p style={{ color: "#6B7280", fontSize: 14, textAlign: "center", marginBottom: 24 }}>
                Choose a strong password for your account.
              </p>

              {error && (
                <div className="rounded-xl" style={{ background: "#FEF2F2", padding: "12px 16px", marginBottom: 16, color: "#DC2626", fontSize: 13, fontWeight: 500 }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleReset}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>New Password</label>
                  <div className="flex items-center rounded-xl" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", padding: "0 14px" }}>
                    <Lock size={18} style={{ color: "#9CA3AF", flexShrink: 0 }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      required
                      className="w-full bg-transparent outline-none"
                      style={{ padding: "12px 10px", fontSize: 14, color: "#111827", border: "none" }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                      {showPassword ? <EyeOff size={18} style={{ color: "#9CA3AF" }} /> : <Eye size={18} style={{ color: "#9CA3AF" }} />}
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Confirm Password</label>
                  <div className="flex items-center rounded-xl" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", padding: "0 14px" }}>
                    <Lock size={18} style={{ color: "#9CA3AF", flexShrink: 0 }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      required
                      className="w-full bg-transparent outline-none"
                      style={{ padding: "12px 10px", fontSize: 14, color: "#111827", border: "none" }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 rounded-xl transition-all active:scale-[0.98]"
                  style={{ background: "#1E40AF", color: "#fff", fontWeight: 700, fontSize: 15, padding: "14px", border: "none", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? <Loader2 size={20} className="animate-spin" /> : <><Lock size={18} /> Update Password</>}
                </button>
              </form>
            </>
          )}

          {status === "success" && (
            <div className="text-center" style={{ padding: "16px 0" }}>
              <div className="inline-flex items-center justify-center rounded-full" style={{ width: 72, height: 72, background: "#F0FDF4", marginBottom: 20 }}>
                <CheckCircle2 size={40} style={{ color: "#16A34A" }} />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Password Updated!</h2>
              <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
                Your password has been changed successfully. You can now log in with your new password.
              </p>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl transition-all"
                style={{ background: "#1E40AF", color: "#fff", fontWeight: 700, fontSize: 16, padding: "14px 32px", textDecoration: "none" }}
              >
                Go to App <ArrowRight size={18} />
              </a>
            </div>
          )}

          {status === "error" && (
            <div className="text-center" style={{ padding: "16px 0" }}>
              <div className="inline-flex items-center justify-center rounded-full" style={{ width: 72, height: 72, background: "#FEF2F2", marginBottom: 20 }}>
                <XCircle size={40} style={{ color: "#DC2626" }} />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Reset Failed</h2>
              <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>{error}</p>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl transition-all"
                style={{ background: "#1E40AF", color: "#fff", fontWeight: 700, fontSize: 15, padding: "14px 32px", textDecoration: "none" }}
              >
                Go to App
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
