"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Loader2, XCircle, Flame } from "lucide-react";

export default function ConfirmPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", "?"));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");

    // Also check URL search params (some Supabase versions use query params)
    const searchParams = new URLSearchParams(window.location.search);
    const tokenHash = searchParams.get("token_hash");
    const confirmType = searchParams.get("type") || type;

    (async () => {
      try {
        if (tokenHash && confirmType) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: confirmType as "signup" | "email",
          });
          if (error) throw error;
          setStatus("success");
        } else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
          setStatus("success");
        } else {
          // Try to get the session — maybe the link already confirmed
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            setStatus("success");
          } else {
            setErrorMsg("Invalid or expired confirmation link. Please try signing up again.");
            setStatus("error");
          }
        }
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
        setStatus("error");
      }
    })();
  }, []);

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
        <div className="rounded-3xl text-center" style={{ background: "#fff", padding: "40px 28px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          {status === "loading" && (
            <>
              <Loader2 size={48} className="animate-spin mx-auto" style={{ color: "#1E40AF", marginBottom: 20 }} />
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Confirming Your Email...</h2>
              <p style={{ color: "#6B7280", fontSize: 14 }}>Please wait a moment</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="inline-flex items-center justify-center rounded-full" style={{ width: 72, height: 72, background: "#F0FDF4", marginBottom: 20 }}>
                <CheckCircle2 size={40} style={{ color: "#16A34A" }} />
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 8 }}>
                Welcome to Winning Souls! 🎉
              </h2>
              <p style={{ color: "#6B7280", fontSize: 15, lineHeight: 1.6, marginBottom: 8 }}>
                Your email has been confirmed successfully.
              </p>
              <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
                You&apos;re now part of a community of soul winners. Get ready to be equipped, encouraged, and empowered to share the Gospel boldly!
              </p>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl transition-all"
                style={{ background: "#1E40AF", color: "#fff", fontWeight: 700, fontSize: 16, padding: "14px 32px", textDecoration: "none" }}
              >
                <Flame size={20} style={{ color: "#FBBF24" }} /> Open the App
              </a>
            </>
          )}

          {status === "error" && (
            <>
              <div className="inline-flex items-center justify-center rounded-full" style={{ width: 72, height: 72, background: "#FEF2F2", marginBottom: 20 }}>
                <XCircle size={40} style={{ color: "#DC2626" }} />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Confirmation Failed</h2>
              <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                {errorMsg}
              </p>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl transition-all"
                style={{ background: "#1E40AF", color: "#fff", fontWeight: 700, fontSize: 15, padding: "14px 32px", textDecoration: "none" }}
              >
                Go to App
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
