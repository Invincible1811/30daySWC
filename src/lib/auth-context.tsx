"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isAssistantAdmin: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  phone: string;
  address: string;
  city: string;
  country: string;
  bio: string;
  church: string;
  role: "user" | "admin" | "assistant_admin";
  current_day: number;
  completed_days: number[];
  trial_ends_at: string;
  subscription_status: "trial" | "active" | "expired" | "cancelled";
  stripe_customer_id: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isAssistantAdmin: false,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) {
      const profile = data as unknown as UserProfile;
      setProfile(profile);
    }
  };

  // Process referral: link new user to referrer and award bonus months when threshold is met
  const processReferral = async (currentUser: User) => {
    const refCode = currentUser.user_metadata?.referral_code;
    if (!refCode) return;

    // Check if this user was already recorded as a referral
    const { data: existing } = await supabase
      .from("referrals")
      .select("id")
      .eq("referred_id", currentUser.id)
      .maybeSingle();
    if (existing) return;

    // Find the referrer by matching the first 8 chars of their id
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id")
      .limit(100);

    const referrer = profiles?.find((p: { id: string }) => p.id.startsWith(refCode));
    if (!referrer || referrer.id === currentUser.id) return;

    // Insert referral record
    await supabase.from("referrals").insert({
      referrer_id: referrer.id,
      referred_id: currentUser.id,
    });

    // Check if referrer now has 8 referrals → award 2 months
    const { count } = await supabase
      .from("referrals")
      .select("id", { count: "exact", head: true })
      .eq("referrer_id", referrer.id);

    if (count && count >= 8 && count < 10) {
      // Extend the referrer's trial/subscription by 2 months
      const { data: referrerProfile } = await supabase
        .from("profiles")
        .select("trial_ends_at, subscription_status")
        .eq("id", referrer.id)
        .single();

      if (referrerProfile) {
        const baseDate = new Date(referrerProfile.trial_ends_at) > new Date()
          ? new Date(referrerProfile.trial_ends_at)
          : new Date();
        baseDate.setMonth(baseDate.getMonth() + 2);
        await supabase.from("profiles").update({
          trial_ends_at: baseDate.toISOString(),
          subscription_status: "trial",
        }).eq("id", referrer.id);
      }
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        // Process referral on first sign-in
        processReferral(session.user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, isAdmin: profile?.role === "admin", isAssistantAdmin: profile?.role === "assistant_admin", signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
