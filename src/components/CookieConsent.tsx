"use client";

import { useState, useEffect } from "react";
import { Shield, X } from "lucide-react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("ws-cookie-consent");
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("ws-cookie-consent", "accepted");
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem("ws-cookie-consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 animate-fade-in">
      <div
        className="max-w-lg mx-auto rounded-2xl shadow-2xl border"
        style={{ background: "#fff", borderColor: "#E5E7EB", padding: "20px 24px" }}
      >
        {!showDetails ? (
          <>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Shield size={18} className="text-primary" />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
                  Your Privacy Matters
                </p>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>
                  We use essential cookies and local storage to keep you logged in and save your preferences. We do <strong>not</strong> use tracking cookies or share data with third parties.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={accept}
                style={{ flex: 1, padding: "10px", borderRadius: 10, background: "#1E40AF", color: "#fff", fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}
              >
                Accept
              </button>
              <button
                onClick={decline}
                style={{ padding: "10px 16px", borderRadius: 10, background: "#F3F4F6", color: "#374151", fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}
              >
                Decline
              </button>
              <button
                onClick={() => setShowDetails(true)}
                style={{ padding: "10px 12px", borderRadius: 10, background: "transparent", color: "#6B7280", fontWeight: 500, fontSize: 12, border: "none", cursor: "pointer", textDecoration: "underline" }}
              >
                Learn more
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Cookie & Storage Policy</h3>
              <button onClick={() => setShowDetails(false)} className="w-7 h-7 rounded-full bg-grey-light flex items-center justify-center">
                <X size={14} className="text-grey-dark" />
              </button>
            </div>
            <div className="text-sm text-grey-dark space-y-3 leading-relaxed max-h-[280px] overflow-y-auto" style={{ marginBottom: 16 }}>
              <p><strong>What we store:</strong></p>
              <ul style={{ paddingLeft: 20, listStyleType: "disc" }}>
                <li><strong>Authentication session</strong> — Keeps you logged in securely (essential)</li>
                <li><strong>App preferences</strong> — Your local settings and cached state (essential)</li>
                <li><strong>Cookie consent choice</strong> — Remembers this preference (essential)</li>
              </ul>
              <p><strong>What we do NOT do:</strong></p>
              <ul style={{ paddingLeft: 20, listStyleType: "disc" }}>
                <li>No third-party tracking cookies (no Google Analytics, no Facebook Pixel)</li>
                <li>No advertising or retargeting</li>
                <li>No selling or sharing of personal data</li>
                <li>No cross-site tracking</li>
              </ul>
              <p><strong>Your choices:</strong></p>
              <p>If you decline, the app will still work but you may need to log in again each session. You can clear all stored data anytime via your browser settings.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={accept}
                style={{ flex: 1, padding: "10px", borderRadius: 10, background: "#1E40AF", color: "#fff", fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}
              >
                Accept All
              </button>
              <button
                onClick={decline}
                style={{ flex: 1, padding: "10px", borderRadius: 10, background: "#F3F4F6", color: "#374151", fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}
              >
                Essential Only
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
