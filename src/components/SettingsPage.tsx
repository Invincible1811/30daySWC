"use client";

import { useState } from "react";
import {
  Settings, User, Lock, Bell, Shield, FileText, Info,
  LogOut, ChevronRight, Moon, Sun, Eye, EyeOff, Loader2, CheckCircle2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import type { Page } from "./Navigation";

interface SettingsPageProps {
  onNavigate: (page: Page) => void;
}

export default function SettingsPage({ onNavigate }: SettingsPageProps) {
  const { user, profile, signOut } = useAuth();
  const [tab, setTab] = useState<"main" | "password" | "privacy" | "terms">("main");

  // Password change
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess(false);

    if (newPw.length < 6) { setPwError("New password must be at least 6 characters"); return; }
    if (newPw !== confirmPw) { setPwError("Passwords do not match"); return; }

    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    if (error) {
      setPwError(error.message);
    } else {
      setPwSuccess(true);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    }
    setPwLoading(false);
  };

  // Privacy Policy content
  if (tab === "privacy") {
    return (
      <div className="space-y-6 animate-fade-in">
        <button onClick={() => setTab("main")} className="text-primary text-sm font-semibold flex items-center gap-1">
          ← Back to Settings
        </button>
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-grey-light">
          <h2 className="text-xl font-bold text-dark mb-4">Privacy Policy</h2>
          <div className="text-sm text-grey-dark space-y-4 leading-relaxed">
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>

            <h3 className="font-bold text-dark text-base">1. Information We Collect</h3>
            <p>When you create an account, we collect your name, email address, and optional profile information (city, country, church, phone number, bio). We also collect data you voluntarily provide: soul records, testimonies, prayer requests, community posts, and challenge progress.</p>

            <h3 className="font-bold text-dark text-base">2. How We Use Your Information</h3>
            <p>We use your information to: provide and improve the app experience, display your username and location to other members in the community directory, send email notifications (account confirmation, password resets), and aggregate anonymous statistics for the community dashboard.</p>

            <h3 className="font-bold text-dark text-base">3. Data Sharing</h3>
            <p>We do <strong>not</strong> sell, trade, or share your personal data with third parties. Your soul records and follow-up contacts are visible only to you. Community posts, testimonies, and prayer requests are visible to all app users as part of the community features.</p>

            <h3 className="font-bold text-dark text-base">4. Data Storage & Security</h3>
            <p>Your data is stored securely on Supabase infrastructure with row-level security policies. Passwords are hashed and never stored in plain text. All connections use HTTPS encryption.</p>

            <h3 className="font-bold text-dark text-base">5. Your Rights</h3>
            <p>You can: view and edit your profile at any time, delete your account and all associated data by contacting the admin, export your data upon request, and opt out of non-essential communications.</p>

            <h3 className="font-bold text-dark text-base">6. Cookies & Local Storage</h3>
            <p>We use local storage to save your app preferences and session data. We do not use tracking cookies or third-party analytics that identify you personally.</p>

            <h3 className="font-bold text-dark text-base">7. Children&apos;s Privacy</h3>
            <p>This app is intended for users aged 13 and above. We do not knowingly collect data from children under 13.</p>

            <h3 className="font-bold text-dark text-base">8. Contact</h3>
            <p>For privacy-related questions, contact the app administrator through the community section or email support.</p>
          </div>
        </div>
      </div>
    );
  }

  // Terms of Service
  if (tab === "terms") {
    return (
      <div className="space-y-6 animate-fade-in">
        <button onClick={() => setTab("main")} className="text-primary text-sm font-semibold flex items-center gap-1">
          ← Back to Settings
        </button>
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-grey-light">
          <h2 className="text-xl font-bold text-dark mb-4">Terms of Service</h2>
          <div className="text-sm text-grey-dark space-y-4 leading-relaxed">
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>

            <h3 className="font-bold text-dark text-base">1. Acceptance of Terms</h3>
            <p>By using Winning Souls, you agree to these Terms of Service. If you do not agree, please do not use the app.</p>

            <h3 className="font-bold text-dark text-base">2. Description of Service</h3>
            <p>Winning Souls is a 30-day evangelism challenge companion app that provides daily challenges, scripture resources, soul tracking, community features, and evangelism tools to help believers share the Gospel.</p>

            <h3 className="font-bold text-dark text-base">3. User Accounts</h3>
            <p>You are responsible for maintaining the security of your account credentials. You must provide accurate information when creating an account. You may not impersonate others or create accounts for fraudulent purposes.</p>

            <h3 className="font-bold text-dark text-base">4. Subscription & Payments</h3>
            <p>The app offers a free 12-day trial period. After the trial, a subscription of $8/month is required to continue using all features. Subscriptions can be cancelled at any time. Refunds are handled on a case-by-case basis.</p>

            <h3 className="font-bold text-dark text-base">5. Acceptable Use</h3>
            <p>You agree to: use the app for its intended purpose of evangelism and spiritual growth, treat other community members with respect, not post offensive, hateful, or inappropriate content, and not attempt to hack, exploit, or disrupt the service.</p>

            <h3 className="font-bold text-dark text-base">6. Content</h3>
            <p>You retain ownership of content you post (testimonies, prayer requests, etc.). By posting, you grant Winning Souls a non-exclusive license to display your content within the app. Admins may remove content that violates community guidelines.</p>

            <h3 className="font-bold text-dark text-base">7. Termination</h3>
            <p>We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time by contacting the admin.</p>

            <h3 className="font-bold text-dark text-base">8. Disclaimer</h3>
            <p>The app is provided &quot;as is&quot; without warranties. We are not liable for any spiritual, emotional, or other outcomes from using the app or following the challenges.</p>

            <h3 className="font-bold text-dark text-base">9. Changes</h3>
            <p>We may update these terms at any time. Continued use of the app after changes constitutes acceptance of the updated terms.</p>
          </div>
        </div>
      </div>
    );
  }

  // Password change screen
  if (tab === "password") {
    return (
      <div className="space-y-6 animate-fade-in">
        <button onClick={() => setTab("main")} className="text-primary text-sm font-semibold flex items-center gap-1">
          ← Back to Settings
        </button>
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-grey-light">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Lock size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-dark">Change Password</h2>
              <p className="text-xs text-grey">Update your account password</p>
            </div>
          </div>

          {pwError && (
            <div className="rounded-xl bg-danger/10 text-danger px-4 py-3 text-sm font-medium mb-4">{pwError}</div>
          )}
          {pwSuccess && (
            <div className="rounded-xl bg-success/10 text-success px-4 py-3 text-sm font-medium mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} /> Password updated successfully!
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-grey-dark block mb-1">New Password</label>
              <div className="flex items-center rounded-xl bg-grey-light/50 border border-grey-light px-3">
                <Lock size={16} className="text-grey shrink-0" />
                <input
                  type={showPw ? "text" : "password"}
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  className="flex-1 bg-transparent outline-none px-3 py-2.5 text-sm text-dark"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="p-1">
                  {showPw ? <EyeOff size={16} className="text-grey" /> : <Eye size={16} className="text-grey" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-grey-dark block mb-1">Confirm New Password</label>
              <div className="flex items-center rounded-xl bg-grey-light/50 border border-grey-light px-3">
                <Lock size={16} className="text-grey shrink-0" />
                <input
                  type={showPw ? "text" : "password"}
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className="flex-1 bg-transparent outline-none px-3 py-2.5 text-sm text-dark"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={pwLoading}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {pwLoading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
              Update Password
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main settings view
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-dark">Settings</h2>
        <p className="text-grey mt-1">Manage your account and preferences</p>
      </div>

      {/* Account Section */}
      <div className="bg-card rounded-2xl shadow-sm border border-grey-light overflow-hidden">
        <div className="px-4 py-3 border-b border-grey-light">
          <p className="text-xs font-bold text-grey uppercase tracking-wider">Account</p>
        </div>
        <button
          onClick={() => onNavigate("profile")}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-grey-light/30 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={18} className="text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-dark">Edit Profile</p>
            <p className="text-xs text-grey">Name, photo, location, church</p>
          </div>
          <ChevronRight size={16} className="text-grey" />
        </button>
        <button
          onClick={() => setTab("password")}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-grey-light/30 transition-colors border-t border-grey-light"
        >
          <div className="w-9 h-9 rounded-full bg-warning/10 flex items-center justify-center">
            <Lock size={18} className="text-warning" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-dark">Change Password</p>
            <p className="text-xs text-grey">Update your account password</p>
          </div>
          <ChevronRight size={16} className="text-grey" />
        </button>
      </div>

      {/* Subscription */}
      <div className="bg-card rounded-2xl shadow-sm border border-grey-light overflow-hidden">
        <div className="px-4 py-3 border-b border-grey-light">
          <p className="text-xs font-bold text-grey uppercase tracking-wider">Subscription</p>
        </div>
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center">
              <Shield size={18} className="text-success" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-dark">
                {profile ? "Active Plan" : "Loading..."}
              </p>
              <p className="text-xs text-grey">$8/month • Manage your subscription</p>
            </div>
          </div>
        </div>
      </div>

      {/* Legal */}
      <div className="bg-card rounded-2xl shadow-sm border border-grey-light overflow-hidden">
        <div className="px-4 py-3 border-b border-grey-light">
          <p className="text-xs font-bold text-grey uppercase tracking-wider">Legal</p>
        </div>
        <button
          onClick={() => setTab("privacy")}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-grey-light/30 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
            <Shield size={18} className="text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-dark">Privacy Policy</p>
          </div>
          <ChevronRight size={16} className="text-grey" />
        </button>
        <button
          onClick={() => setTab("terms")}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-grey-light/30 transition-colors border-t border-grey-light"
        >
          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
            <FileText size={18} className="text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-dark">Terms of Service</p>
          </div>
          <ChevronRight size={16} className="text-grey" />
        </button>
      </div>

      {/* About */}
      <div className="bg-card rounded-2xl shadow-sm border border-grey-light overflow-hidden">
        <div className="px-4 py-3 border-b border-grey-light">
          <p className="text-xs font-bold text-grey uppercase tracking-wider">About</p>
        </div>
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-grey-light flex items-center justify-center">
              <Info size={18} className="text-grey-dark" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-dark">Winning Souls</p>
              <p className="text-xs text-grey">Version 1.0 • 30-Day Soul-Winning Challenge</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sign Out */}
      <button
        onClick={signOut}
        className="w-full bg-danger/10 text-danger py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-danger/20 transition-colors"
      >
        <LogOut size={18} /> Sign Out
      </button>

      <p className="text-center text-xs text-grey pb-4">
        &copy; {new Date().getFullYear()} Winning Souls. All rights reserved.
      </p>
    </div>
  );
}
