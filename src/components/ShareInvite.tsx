"use client";

import { useState, useEffect } from "react";
import { Share2, X, Copy, Check, MessageCircle, Gift, Users } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

const INVITE_TEXT = "Join me on the 30-Day Soul-Winning Challenge! Daily scriptures, prayer tools, and a community of soul winners. Let's win souls together!";

function getAppUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  return "https://30dayswc.vercel.app";
}

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function XIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

interface ShareInviteProps {
  variant?: "button" | "floating";
}

export default function ShareInvite({ variant = "button" }: ShareInviteProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
  const { user } = useAuth();

  // Generate a short referral code from user ID
  const referralCode = user?.id ? user.id.slice(0, 8) : "";
  const baseUrl = getAppUrl();
  const shareUrl = referralCode ? `${baseUrl}?ref=${referralCode}` : baseUrl;
  const shareText = INVITE_TEXT;

  // Fetch referral count
  useEffect(() => {
    if (!user) return;
    supabase
      .from("referrals")
      .select("id", { count: "exact", head: true })
      .eq("referrer_id", user.id)
      .then(({ count }) => setReferralCount(count || 0));
  }, [user]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = `${shareText}\n\n${shareUrl}`;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Winning Souls", text: shareText, url: shareUrl });
      } catch {
        // User cancelled
      }
    } else {
      setOpen(true);
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;

  const shareOptions = [
    { name: "WhatsApp", icon: WhatsAppIcon, url: whatsappUrl, bg: "#25D366", color: "#fff" },
    { name: "X (Twitter)", icon: XIcon, url: twitterUrl, bg: "#000", color: "#fff" },
    { name: "Facebook", icon: FacebookIcon, url: facebookUrl, bg: "#1877F2", color: "#fff" },
  ];

  return (
    <>
      {variant === "floating" ? (
        <button
          onClick={handleNativeShare}
          className="fixed bottom-24 right-4 lg:bottom-8 lg:right-8 z-50 flex items-center gap-2 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
          style={{ background: "#1E40AF", color: "#fff", padding: "14px 20px", border: "none", cursor: "pointer" }}
        >
          <Share2 size={18} />
          <span style={{ fontWeight: 600, fontSize: 14 }}>Invite</span>
        </button>
      ) : (
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-2 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ background: "#1E40AF", color: "#fff", padding: "10px 20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14 }}
        >
          <Share2 size={16} />
          Invite Friends
        </button>
      )}

      {/* Share Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl"
            style={{ background: "#fff", padding: "24px", paddingBottom: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>Invite Friends</h3>
                <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Share the challenge with others</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-full"
                style={{ width: 36, height: 36, background: "#F3F4F6", border: "none", cursor: "pointer" }}
              >
                <X size={18} style={{ color: "#6B7280" }} />
              </button>
            </div>

            {/* Referral Progress */}
            {user && (
              <div className="rounded-xl" style={{ background: "linear-gradient(135deg, #EEF2FF, #E0E7FF)", padding: 16, marginBottom: 16, border: "1px solid #C7D2FE" }}>
                <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                  <Gift size={16} style={{ color: "#4F46E5" }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#312E81" }}>Referral Reward</span>
                </div>
                <p style={{ fontSize: 12, color: "#4338CA", marginBottom: 10, lineHeight: 1.5 }}>
                  Invite 8 friends → Get <strong>2 months free!</strong>
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, height: 8, background: "#C7D2FE", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min((referralCount / 8) * 100, 100)}%`, height: "100%", background: "linear-gradient(90deg, #4F46E5, #6366F1)", borderRadius: 999, transition: "width 0.5s" }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#4338CA" }}>{referralCount}/8</span>
                </div>
                {referralCount >= 8 && (
                  <p style={{ fontSize: 12, color: "#059669", fontWeight: 600, marginTop: 8 }}>🎉 Congratulations! You earned 2 free months!</p>
                )}
              </div>
            )}

            {/* Invite message preview */}
            <div className="rounded-xl" style={{ background: "#F9FAFB", padding: 16, marginBottom: 20, border: "1px solid #F3F4F6" }}>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{shareText}</p>
              <p style={{ fontSize: 12, color: "#1E40AF", fontWeight: 600, marginTop: 8 }}>{shareUrl}</p>
            </div>

            {/* Share buttons */}
            <div className="grid grid-cols-3 gap-3" style={{ marginBottom: 16 }}>
              {shareOptions.map((option) => (
                <a
                  key={option.name}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 rounded-xl p-3 transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ background: option.bg, color: option.color, textDecoration: "none" }}
                >
                  <option.icon size={24} />
                  <span style={{ fontSize: 11, fontWeight: 600 }}>{option.name}</span>
                </a>
              ))}
            </div>

            {/* Copy link button */}
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 rounded-xl transition-all duration-200 active:scale-[0.98]"
              style={{
                padding: "14px",
                background: copied ? "#D1FAE5" : "#F3F4F6",
                color: copied ? "#059669" : "#374151",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? "Copied!" : "Copy Invite Link"}
            </button>

            {/* SMS / Text option */}
            <a
              href={`sms:?body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`}
              className="w-full flex items-center justify-center gap-2 rounded-xl transition-all duration-200 active:scale-[0.98]"
              style={{
                padding: "14px",
                marginTop: 8,
                background: "#EEF2FF",
                color: "#4F46E5",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              <MessageCircle size={18} />
              Send via Text Message
            </a>
          </div>
        </div>
      )}
    </>
  );
}
