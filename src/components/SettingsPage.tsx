"use client";

import { useState, useEffect } from "react";
import {
  User, Lock, Bell, Shield, FileText, Info, Mail, Phone, MapPin, Church,
  LogOut, ChevronRight, Eye, EyeOff, Loader2, CheckCircle2, Camera,
  Trash2, AlertTriangle, RefreshCw, Cookie, Crown, Calendar, Globe
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useSubscriptionStatus } from "./Paywall";
import type { Page } from "./Navigation";

type Tab = "main" | "profile" | "email" | "password" | "notifications" | "subscription" | "privacy" | "terms" | "delete";

interface SettingsPageProps {
  onNavigate: (page: Page) => void;
}

export default function SettingsPage({ onNavigate }: SettingsPageProps) {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { status: subStatus, daysLeft } = useSubscriptionStatus();
  const [tab, setTab] = useState<Tab>("main");

  // Profile edit state
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [address, setAddress] = useState(profile?.address || "");
  const [city, setCity] = useState(profile?.city || "");
  const [country, setCountry] = useState(profile?.country || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [church, setChurch] = useState(profile?.church || "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Email change
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState(false);

  // Password change
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  // Notifications
  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);

  // Delete account
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Check for updates
  const [checking, setChecking] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<"" | "available" | "latest">("");

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setUsername(profile.username || "");
      setPhone(profile.phone || "");
      setAddress(profile.address || "");
      setCity(profile.city || "");
      setCountry(profile.country || "");
      setBio(profile.bio || "");
      setChurch(profile.church || "");
    }
    if (user) setNewEmail(user.email || "");
    // Check push notification permission
    if ("Notification" in window) {
      setPushEnabled(Notification.permission === "granted");
    }
  }, [profile, user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !isSupabaseConfigured) return;
    setUploadingAvatar(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadError) { setUploadingAvatar(false); return; }
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const avatarUrl = urlData.publicUrl + "?t=" + Date.now();
    await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("id", user.id);
    await refreshProfile();
    setUploadingAvatar(false);
  };

  const handleRemoveAvatar = async () => {
    if (!user || !isSupabaseConfigured) return;
    setUploadingAvatar(true);
    await supabase.from("profiles").update({ avatar_url: null }).eq("id", user.id);
    await refreshProfile();
    setUploadingAvatar(false);
  };

  const handleProfileSave = async () => {
    if (!user || !isSupabaseConfigured) return;
    setProfileSaving(true);
    setProfileSuccess(false);
    await supabase.from("profiles").update({
      full_name: fullName.trim(),
      username: username.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      country: country.trim(),
      bio: bio.trim(),
      church: church.trim(),
      updated_at: new Date().toISOString(),
    }).eq("id", user.id);
    await refreshProfile();
    setProfileSaving(false);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setEmailSuccess(false);
    if (!newEmail.trim() || newEmail === user?.email) { setEmailError("Enter a different email address"); return; }
    setEmailLoading(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    if (error) { setEmailError(error.message); }
    else { setEmailSuccess(true); }
    setEmailLoading(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess(false);
    if (newPw.length < 6) { setPwError("Password must be at least 6 characters"); return; }
    if (newPw !== confirmPw) { setPwError("Passwords do not match"); return; }
    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    if (error) { setPwError(error.message); }
    else { setPwSuccess(true); setNewPw(""); setConfirmPw(""); }
    setPwLoading(false);
  };

  const handleTogglePush = async () => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
      setPushEnabled(false);
      // Can't revoke programmatically — inform user
      alert("To disable push notifications, go to your browser settings and revoke notification permissions for this site.");
      setPushEnabled(true);
    } else {
      const perm = await Notification.requestPermission();
      setPushEnabled(perm === "granted");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE" || !user || !isSupabaseConfigured) return;
    setDeleting(true);
    await supabase.from("profiles").delete().eq("id", user.id);
    await signOut();
  };

  const handleCheckUpdates = async () => {
    setChecking(true);
    setUpdateStatus("");
    try {
      const res = await fetch("/version.json?t=" + Date.now());
      if (res.ok) {
        const data = await res.json();
        const current = localStorage.getItem("ws-server-version");
        if (current && current !== data.version) {
          setUpdateStatus("available");
          localStorage.setItem("ws-server-version", data.version);
          setTimeout(() => window.location.reload(), 1500);
        } else {
          localStorage.setItem("ws-server-version", data.version);
          if ("serviceWorker" in navigator) {
            const reg = await navigator.serviceWorker.getRegistration();
            if (reg) await reg.update();
          }
          setUpdateStatus("latest");
        }
      }
    } catch { setUpdateStatus("latest"); }
    setChecking(false);
  };

  const handleResetCookies = () => {
    localStorage.removeItem("ws-cookie-consent");
    window.location.reload();
  };

  // ─── Back button for sub-screens ───
  const BackButton = () => (
    <button onClick={() => setTab("main")} className="text-primary text-sm font-semibold flex items-center gap-1 mb-4">
      ← Back to Settings
    </button>
  );

  // ─── Sub-screen icon + title header ───
  const SubHeader = ({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) => (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">{icon}</div>
      <div>
        <h2 className="text-lg font-bold text-dark">{title}</h2>
        <p className="text-xs text-grey">{subtitle}</p>
      </div>
    </div>
  );

  // ─── Success / Error banners ───
  const SuccessBanner = ({ text }: { text: string }) => (
    <div className="rounded-xl bg-success/10 text-success px-4 py-3 text-sm font-medium mb-4 flex items-center gap-2">
      <CheckCircle2 size={16} /> {text}
    </div>
  );
  const ErrorBanner = ({ text }: { text: string }) => (
    <div className="rounded-xl bg-danger/10 text-danger px-4 py-3 text-sm font-medium mb-4">{text}</div>
  );

  // ═════════════════════════ EDIT PROFILE ═════════════════════════
  if (tab === "profile") {
    return (
      <div className="space-y-6 animate-fade-in">
        <BackButton />
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-grey-light">
          <SubHeader icon={<User size={20} className="text-primary" />} title="Edit Profile" subtitle="Change your personal information" />

          {profileSuccess && <SuccessBanner text="Profile updated successfully!" />}

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User size={28} className="text-primary/50" />
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center cursor-pointer border-2 border-white shadow-md">
                {uploadingAvatar ? <Loader2 size={12} className="text-white animate-spin" /> : <Camera size={12} className="text-white" />}
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
              </label>
            </div>
            <div>
              <p className="text-sm font-medium text-dark">Profile Photo</p>
              {profile?.avatar_url && (
                <button onClick={handleRemoveAvatar} disabled={uploadingAvatar} className="text-xs text-danger font-medium mt-1">Remove photo</button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-grey-dark block mb-1">Full Name</label>
                <div className="flex items-center gap-2 bg-grey-light/50 rounded-xl px-3 py-2.5 border border-grey-light focus-within:border-primary">
                  <User size={16} className="text-grey" />
                  <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" className="w-full bg-transparent text-sm outline-none text-dark" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-grey-dark block mb-1">Username</label>
                <div className="flex items-center gap-2 bg-grey-light/50 rounded-xl px-3 py-2.5 border border-grey-light focus-within:border-primary">
                  <span className="text-grey text-sm font-semibold">@</span>
                  <input value={username} onChange={e => setUsername(e.target.value)} placeholder="username" className="w-full bg-transparent text-sm outline-none text-dark" />
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-grey-dark block mb-1">Bio</label>
              <div className="flex items-start gap-2 bg-grey-light/50 rounded-xl px-3 py-2.5 border border-grey-light focus-within:border-primary">
                <FileText size={16} className="text-grey mt-0.5" />
                <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell others about yourself..." rows={2} className="w-full bg-transparent text-sm outline-none text-dark resize-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-grey-dark block mb-1">Phone Number</label>
                <div className="flex items-center gap-2 bg-grey-light/50 rounded-xl px-3 py-2.5 border border-grey-light focus-within:border-primary">
                  <Phone size={16} className="text-grey" />
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234 567 8900" className="w-full bg-transparent text-sm outline-none text-dark" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-grey-dark block mb-1">Church</label>
                <div className="flex items-center gap-2 bg-grey-light/50 rounded-xl px-3 py-2.5 border border-grey-light focus-within:border-primary">
                  <Church size={16} className="text-grey" />
                  <input value={church} onChange={e => setChurch(e.target.value)} placeholder="Your local church" className="w-full bg-transparent text-sm outline-none text-dark" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-grey-dark block mb-1">Address</label>
                <div className="flex items-center gap-2 bg-grey-light/50 rounded-xl px-3 py-2.5 border border-grey-light focus-within:border-primary">
                  <MapPin size={16} className="text-grey" />
                  <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Street address" className="w-full bg-transparent text-sm outline-none text-dark" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-grey-dark block mb-1">City</label>
                <input value={city} onChange={e => setCity(e.target.value)} placeholder="City" className="w-full bg-grey-light/50 rounded-xl px-3 py-2.5 border border-grey-light text-sm outline-none text-dark focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-semibold text-grey-dark block mb-1">Country</label>
                <input value={country} onChange={e => setCountry(e.target.value)} placeholder="Country" className="w-full bg-grey-light/50 rounded-xl px-3 py-2.5 border border-grey-light text-sm outline-none text-dark focus:border-primary" />
              </div>
            </div>
            <button onClick={handleProfileSave} disabled={profileSaving} className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
              {profileSaving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              {profileSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════ CHANGE EMAIL ═════════════════════════
  if (tab === "email") {
    return (
      <div className="space-y-6 animate-fade-in">
        <BackButton />
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-grey-light">
          <SubHeader icon={<Mail size={20} className="text-primary" />} title="Change Email" subtitle="Update your login email address" />

          {emailError && <ErrorBanner text={emailError} />}
          {emailSuccess && <SuccessBanner text="Confirmation email sent to your new address! Check your inbox to verify." />}

          <div className="rounded-xl bg-blue-50 px-4 py-3 text-xs text-primary font-medium mb-4">
            Current email: <strong>{user?.email}</strong>
          </div>

          <form onSubmit={handleEmailChange} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-grey-dark block mb-1">New Email Address</label>
              <div className="flex items-center rounded-xl bg-grey-light/50 border border-grey-light px-3">
                <Mail size={16} className="text-grey shrink-0" />
                <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="newemail@example.com" required className="flex-1 bg-transparent outline-none px-3 py-2.5 text-sm text-dark" />
              </div>
            </div>
            <button type="submit" disabled={emailLoading} className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
              {emailLoading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
              Update Email
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ═════════════════════════ CHANGE PASSWORD ═════════════════════════
  if (tab === "password") {
    return (
      <div className="space-y-6 animate-fade-in">
        <BackButton />
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-grey-light">
          <SubHeader icon={<Lock size={20} className="text-primary" />} title="Change Password" subtitle="Update your account password" />

          {pwError && <ErrorBanner text={pwError} />}
          {pwSuccess && <SuccessBanner text="Password updated successfully!" />}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-grey-dark block mb-1">New Password</label>
              <div className="flex items-center rounded-xl bg-grey-light/50 border border-grey-light px-3">
                <Lock size={16} className="text-grey shrink-0" />
                <input type={showPw ? "text" : "password"} value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min 6 characters" required className="flex-1 bg-transparent outline-none px-3 py-2.5 text-sm text-dark" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="p-1">
                  {showPw ? <EyeOff size={16} className="text-grey" /> : <Eye size={16} className="text-grey" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-grey-dark block mb-1">Confirm New Password</label>
              <div className="flex items-center rounded-xl bg-grey-light/50 border border-grey-light px-3">
                <Lock size={16} className="text-grey shrink-0" />
                <input type={showPw ? "text" : "password"} value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Re-enter password" required className="flex-1 bg-transparent outline-none px-3 py-2.5 text-sm text-dark" />
              </div>
            </div>
            <button type="submit" disabled={pwLoading} className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50">
              {pwLoading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
              Update Password
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ═════════════════════════ NOTIFICATIONS ═════════════════════════
  if (tab === "notifications") {
    return (
      <div className="space-y-6 animate-fade-in">
        <BackButton />
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-grey-light">
          <SubHeader icon={<Bell size={20} className="text-primary" />} title="Notifications" subtitle="Control how you receive updates" />

          <div className="space-y-1">
            <div className="flex items-center justify-between py-3.5">
              <div>
                <p className="text-sm font-medium text-dark">Push Notifications</p>
                <p className="text-xs text-grey">Daily challenge reminders & messages</p>
              </div>
              <button onClick={handleTogglePush} className={`w-12 h-7 rounded-full transition-colors relative ${pushEnabled ? "bg-primary" : "bg-grey-light"}`}>
                <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${pushEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
            <div className="border-t border-grey-light" />
            <div className="flex items-center justify-between py-3.5">
              <div>
                <p className="text-sm font-medium text-dark">Email Notifications</p>
                <p className="text-xs text-grey">Weekly summaries & community updates</p>
              </div>
              <button onClick={() => setEmailNotifs(!emailNotifs)} className={`w-12 h-7 rounded-full transition-colors relative ${emailNotifs ? "bg-primary" : "bg-grey-light"}`}>
                <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${emailNotifs ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════ SUBSCRIPTION ═════════════════════════
  if (tab === "subscription") {
    const trialEnd = profile?.trial_ends_at ? new Date(profile.trial_ends_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—";
    const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—";

    return (
      <div className="space-y-6 animate-fade-in">
        <BackButton />
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-grey-light">
          <SubHeader icon={<Crown size={20} className="text-warning" />} title="Subscription" subtitle="Manage your plan" />

          <div className="rounded-xl bg-gradient-to-r from-primary to-primary-dark p-5 text-white mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">Current Plan</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${subStatus === "active" ? "bg-green-400/20 text-green-100" : subStatus === "trial" ? "bg-amber-400/20 text-amber-100" : "bg-red-400/20 text-red-100"}`}>
                {subStatus === "active" ? "Active" : subStatus === "trial" ? "Free Trial" : "Expired"}
              </span>
            </div>
            <p className="text-2xl font-bold">{subStatus === "active" ? "$8" : "$0"}<span className="text-sm font-normal opacity-70">/month</span></p>
            {subStatus === "trial" && (
              <p className="text-sm opacity-80 mt-2">{daysLeft} day{daysLeft !== 1 ? "s" : ""} remaining in trial</p>
            )}
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between py-2 border-b border-grey-light">
              <span className="text-sm text-grey-dark">Member since</span>
              <span className="text-sm font-medium text-dark">{joinDate}</span>
            </div>
            {subStatus === "trial" && (
              <div className="flex justify-between py-2 border-b border-grey-light">
                <span className="text-sm text-grey-dark">Trial ends</span>
                <span className="text-sm font-medium text-dark">{trialEnd}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b border-grey-light">
              <span className="text-sm text-grey-dark">Price after trial</span>
              <span className="text-sm font-medium text-dark">$8/month</span>
            </div>
          </div>

          {(subStatus === "trial" || subStatus === "expired") && (
            <button
              onClick={async () => {
                try {
                  const res = await fetch("/api/checkout", { method: "POST" });
                  const data = await res.json();
                  if (data.url) window.location.href = data.url;
                  else alert("Payment system is being set up. Please try again later.");
                } catch { alert("Payment system is being set up. Please try again later."); }
              }}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Crown size={16} /> Subscribe Now — $8/month
            </button>
          )}
        </div>
      </div>
    );
  }

  // ═════════════════════════ PRIVACY POLICY ═════════════════════════
  if (tab === "privacy") {
    return (
      <div className="space-y-6 animate-fade-in">
        <BackButton />
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-grey-light">
          <h2 className="text-xl font-bold text-dark mb-4">Privacy Policy</h2>
          <div className="text-sm text-grey-dark space-y-4 leading-relaxed">
            <p><strong>Last Updated:</strong> April 2026</p>
            <h3 className="font-bold text-dark text-base">1. Information We Collect</h3>
            <p>When you create an account, we collect your name, email address, and optional profile information (city, country, church, phone number, bio). We also collect data you voluntarily provide: soul records, testimonies, prayer requests, community posts, and challenge progress.</p>
            <h3 className="font-bold text-dark text-base">2. How We Use Your Information</h3>
            <p>We use your information to: provide and improve the app experience, display your username and location to other members in the community directory, send email notifications (account confirmation, password resets), and aggregate anonymous statistics for the community dashboard.</p>
            <h3 className="font-bold text-dark text-base">3. Data Sharing</h3>
            <p>We do <strong>not</strong> sell, trade, or share your personal data with third parties. Your soul records and follow-up contacts are visible only to you.</p>
            <h3 className="font-bold text-dark text-base">4. Data Storage &amp; Security</h3>
            <p>Your data is stored securely on Supabase infrastructure with row-level security policies. Passwords are hashed and never stored in plain text. All connections use HTTPS encryption.</p>
            <h3 className="font-bold text-dark text-base">5. Your Rights</h3>
            <p>You can: view and edit your profile at any time, delete your account and all associated data from Settings, export your data upon request, and opt out of non-essential communications.</p>
            <h3 className="font-bold text-dark text-base">6. Cookies &amp; Local Storage</h3>
            <p>We use local storage to save your app preferences and session data. We do not use tracking cookies or third-party analytics that identify you personally.</p>
            <h3 className="font-bold text-dark text-base">7. Payment Information</h3>
            <p>Payments are processed securely through Stripe. We never store your credit card details.</p>
            <h3 className="font-bold text-dark text-base">8. Children&apos;s Privacy</h3>
            <p>This app is intended for users aged 13 and above. We do not knowingly collect data from children under 13.</p>
            <h3 className="font-bold text-dark text-base">9. Contact</h3>
            <p>For privacy-related questions, contact the app administrator through the community section or email support.</p>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════ TERMS OF SERVICE ═════════════════════════
  if (tab === "terms") {
    return (
      <div className="space-y-6 animate-fade-in">
        <BackButton />
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-grey-light">
          <h2 className="text-xl font-bold text-dark mb-4">Terms of Service</h2>
          <div className="text-sm text-grey-dark space-y-4 leading-relaxed">
            <p><strong>Last Updated:</strong> April 2026</p>
            <h3 className="font-bold text-dark text-base">1. Acceptance of Terms</h3>
            <p>By using Winning Souls, you agree to these Terms of Service. If you do not agree, please do not use the app.</p>
            <h3 className="font-bold text-dark text-base">2. Description of Service</h3>
            <p>Winning Souls is a 30-day evangelism challenge companion app with daily challenges, soul tracking, community features, and evangelism tools.</p>
            <h3 className="font-bold text-dark text-base">3. User Accounts</h3>
            <p>You are responsible for maintaining the security of your account. You must provide accurate information and may not impersonate others.</p>
            <h3 className="font-bold text-dark text-base">4. Subscription &amp; Payments</h3>
            <p>The app offers a free 12-day trial. After the trial, $8/month is required. Subscriptions can be cancelled at any time.</p>
            <h3 className="font-bold text-dark text-base">5. Acceptable Use</h3>
            <p>Use the app for its intended purpose. Treat others with respect. Do not post offensive content or attempt to disrupt the service.</p>
            <h3 className="font-bold text-dark text-base">6. Content Ownership</h3>
            <p>You retain ownership of content you post. By posting, you grant Winning Souls a non-exclusive license to display it within the app.</p>
            <h3 className="font-bold text-dark text-base">7. Termination</h3>
            <p>We may suspend accounts that violate terms. You may delete your account at any time from Settings.</p>
            <h3 className="font-bold text-dark text-base">8. Disclaimer</h3>
            <p>The app is provided &quot;as is&quot; without warranties of any kind.</p>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════ DELETE ACCOUNT ═════════════════════════
  if (tab === "delete") {
    return (
      <div className="space-y-6 animate-fade-in">
        <BackButton />
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-danger/30">
          <SubHeader icon={<AlertTriangle size={20} className="text-danger" />} title="Delete Account" subtitle="This action is permanent and cannot be undone" />

          <div className="rounded-xl bg-danger/5 border border-danger/20 p-4 mb-6">
            <p className="text-sm text-danger font-semibold mb-2">What will be deleted:</p>
            <ul className="text-xs text-grey-dark space-y-1.5 list-disc pl-4">
              <li>Your profile, name, photo, and all personal information</li>
              <li>All soul records and follow-up contacts</li>
              <li>All testimonies and prayer requests you posted</li>
              <li>All community posts and comments</li>
              <li>All messages and conversations</li>
              <li>Challenge progress and daily records</li>
              <li>Your subscription (if active)</li>
            </ul>
          </div>

          <p className="text-sm text-dark font-semibold mb-2">Type <strong className="text-danger">DELETE</strong> to confirm:</p>
          <input
            value={deleteConfirmText}
            onChange={e => setDeleteConfirmText(e.target.value)}
            placeholder="Type DELETE"
            className="w-full px-4 py-2.5 rounded-xl border border-danger/30 text-sm focus:outline-none focus:border-danger mb-4"
          />
          <div className="flex gap-2">
            <button
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== "DELETE" || deleting}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-colors"
              style={{ background: deleteConfirmText === "DELETE" ? "#DC2626" : "#D1D5DB", cursor: deleteConfirmText === "DELETE" ? "pointer" : "not-allowed" }}
            >
              <Trash2 size={14} />
              {deleting ? "Deleting..." : "Permanently Delete Account"}
            </button>
            <button onClick={() => setTab("main")} className="px-5 py-3 rounded-xl text-sm font-semibold text-grey-dark bg-grey-light">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════ MAIN SETTINGS ═════════════════════════
  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "";

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-dark">Settings</h2>
        <p className="text-grey mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile summary */}
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-grey-light">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <User size={22} className="text-primary/50" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-dark truncate">{profile?.full_name || "Soul Winner"}</p>
            <p className="text-xs text-grey">@{profile?.username || "user"} • Joined {joinDate}</p>
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="bg-card rounded-2xl shadow-sm border border-grey-light overflow-hidden">
        <div className="px-4 py-3 border-b border-grey-light">
          <p className="text-xs font-bold text-grey uppercase tracking-wider">Account</p>
        </div>
        {/* Edit Profile */}
        <button onClick={() => setTab("profile")} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-grey-light/30 transition-colors">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center"><User size={18} className="text-primary" /></div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-dark">Edit Profile</p>
            <p className="text-xs text-grey">Name, username, photo, bio, location, church</p>
          </div>
          <ChevronRight size={16} className="text-grey" />
        </button>
        {/* Change Email */}
        <button onClick={() => setTab("email")} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-grey-light/30 transition-colors border-t border-grey-light">
          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center"><Mail size={18} className="text-primary" /></div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-dark">Change Email</p>
            <p className="text-xs text-grey truncate">{user?.email}</p>
          </div>
          <ChevronRight size={16} className="text-grey" />
        </button>
        {/* Change Password */}
        <button onClick={() => setTab("password")} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-grey-light/30 transition-colors border-t border-grey-light">
          <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center"><Lock size={18} className="text-amber-600" /></div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-dark">Change Password</p>
            <p className="text-xs text-grey">Update your account password</p>
          </div>
          <ChevronRight size={16} className="text-grey" />
        </button>
      </div>

      {/* Notifications */}
      <div className="bg-card rounded-2xl shadow-sm border border-grey-light overflow-hidden">
        <div className="px-4 py-3 border-b border-grey-light">
          <p className="text-xs font-bold text-grey uppercase tracking-wider">Notifications</p>
        </div>
        <button onClick={() => setTab("notifications")} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-grey-light/30 transition-colors">
          <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center"><Bell size={18} className="text-purple-600" /></div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-dark">Notification Preferences</p>
            <p className="text-xs text-grey">Push & email notifications</p>
          </div>
          <ChevronRight size={16} className="text-grey" />
        </button>
      </div>

      {/* Subscription */}
      <div className="bg-card rounded-2xl shadow-sm border border-grey-light overflow-hidden">
        <div className="px-4 py-3 border-b border-grey-light">
          <p className="text-xs font-bold text-grey uppercase tracking-wider">Subscription</p>
        </div>
        <button onClick={() => setTab("subscription")} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-grey-light/30 transition-colors">
          <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center"><Crown size={18} className="text-amber-600" /></div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-dark">Manage Subscription</p>
            <p className="text-xs text-grey">
              {subStatus === "active" ? "Active — $8/month" : subStatus === "trial" ? `Free Trial — ${daysLeft} days left` : "Expired — Subscribe to continue"}
            </p>
          </div>
          <ChevronRight size={16} className="text-grey" />
        </button>
      </div>

      {/* Legal & Privacy */}
      <div className="bg-card rounded-2xl shadow-sm border border-grey-light overflow-hidden">
        <div className="px-4 py-3 border-b border-grey-light">
          <p className="text-xs font-bold text-grey uppercase tracking-wider">Legal &amp; Privacy</p>
        </div>
        <button onClick={() => setTab("privacy")} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-grey-light/30 transition-colors">
          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center"><Shield size={18} className="text-primary" /></div>
          <div className="flex-1 text-left"><p className="text-sm font-medium text-dark">Privacy Policy</p></div>
          <ChevronRight size={16} className="text-grey" />
        </button>
        <button onClick={() => setTab("terms")} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-grey-light/30 transition-colors border-t border-grey-light">
          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center"><FileText size={18} className="text-primary" /></div>
          <div className="flex-1 text-left"><p className="text-sm font-medium text-dark">Terms of Service</p></div>
          <ChevronRight size={16} className="text-grey" />
        </button>
        <button onClick={handleResetCookies} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-grey-light/30 transition-colors border-t border-grey-light">
          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center"><Cookie size={18} className="text-primary" /></div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-dark">Cookie Preferences</p>
            <p className="text-xs text-grey">Re-show cookie consent banner</p>
          </div>
          <ChevronRight size={16} className="text-grey" />
        </button>
      </div>

      {/* About */}
      <div className="bg-card rounded-2xl shadow-sm border border-grey-light overflow-hidden">
        <div className="px-4 py-3 border-b border-grey-light">
          <p className="text-xs font-bold text-grey uppercase tracking-wider">About</p>
        </div>
        <div className="px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-grey-light flex items-center justify-center"><Info size={18} className="text-grey-dark" /></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-dark">Winning Souls</p>
              <p className="text-xs text-grey">Version 1.0 • 30-Day Soul-Winning Challenge</p>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 border-t border-grey-light">
          <button onClick={handleCheckUpdates} disabled={checking} className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
            <RefreshCw size={14} className={checking ? "animate-spin" : ""} />
            {checking ? "Checking..." : "Check for Updates"}
          </button>
          {updateStatus === "available" && <p className="text-xs text-success font-medium mt-2">Update found! Refreshing...</p>}
          {updateStatus === "latest" && <p className="text-xs text-grey mt-2">You&apos;re on the latest version.</p>}
        </div>
      </div>

      {/* Sign Out */}
      <button onClick={signOut} className="w-full bg-grey-light text-dark py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-grey-light/80 transition-colors">
        <LogOut size={18} /> Sign Out
      </button>

      {/* Delete Account */}
      <button onClick={() => setTab("delete")} className="w-full bg-danger/10 text-danger py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-danger/20 transition-colors">
        <Trash2 size={18} /> Delete Account
      </button>

      <p className="text-center text-xs text-grey pb-4">
        &copy; {new Date().getFullYear()} Winning Souls. All rights reserved.
      </p>
    </div>
  );
}
