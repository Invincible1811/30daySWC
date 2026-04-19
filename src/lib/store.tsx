"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import {
  Soul, Testimony, PrayerRequest, Event, Group, CommunityPost, DailyRecord, DailyShare,
  sampleSouls, sampleTestimonies, samplePrayers, sampleEvents, sampleGroups, sampleCommunityPosts
} from "./data";
import { useAuth } from "./auth-context";
import { isSupabaseConfigured } from "./supabase";
import * as db from "./supabase-data";
import { subscribeToRealtime } from "./realtime";

interface AppState {
  currentDay: number;
  souls: Soul[];
  testimonies: Testimony[];
  prayers: PrayerRequest[];
  events: Event[];
  groups: Group[];
  communityPosts: CommunityPost[];
  completedDays: number[];
  userName: string;
  globalSoulCount: number;
  dailyRecords: Record<number, DailyRecord>;
  dailyShares: DailyShare[];
}

interface AppContextType extends AppState {
  addSoul: (soul: Omit<Soul, "id">) => void;
  updateSoul: (id: string, updates: Partial<Soul>) => void;
  deleteSoul: (id: string) => void;
  addTestimony: (testimony: Omit<Testimony, "id" | "likes" | "comments">) => void;
  addPrayer: (prayer: Omit<PrayerRequest, "id" | "likes" | "prayerCount" | "comments">) => void;
  addEvent: (event: Omit<Event, "id" | "attendees">) => void;
  completeDay: (day: number) => void;
  setUserName: (name: string) => void;
  likeTestimony: (id: string) => void;
  likePrayer: (id: string) => void;
  prayForRequest: (id: string) => void;
  addCommentToTestimony: (testimonyId: string, comment: Omit<Comment, "id">) => void;
  addCommentToPrayer: (prayerId: string, comment: Omit<Comment, "id">) => void;
  likeCommunityPost: (id: string) => void;
  joinGroup: (id: string) => void;
  rsvpEvent: (id: string) => void;
  saveDailyRecord: (record: DailyRecord) => void;
  shareDailyRecord: (day: number) => void;
  likeDailyShare: (id: string) => void;
  addCommentToDailyShare: (shareId: string, comment: Omit<Comment, "id">) => void;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}

const AppContext = createContext<AppContextType | null>(null);

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function loadState(): AppState | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("winning-souls-state");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("winning-souls-state", JSON.stringify(state));
  } catch {
    // Storage full or unavailable
  }
}

const defaultState: AppState = {
  currentDay: 1,
  souls: sampleSouls,
  testimonies: sampleTestimonies,
  prayers: samplePrayers,
  events: sampleEvents,
  groups: sampleGroups,
  communityPosts: sampleCommunityPosts,
  completedDays: [],
  userName: "Soul Winner",
  globalSoulCount: 0,
  dailyRecords: {},
  dailyShares: [],
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [state, setState] = useState<AppState>(() => {
    if (typeof window !== "undefined") {
      const saved = loadState();
      if (saved) return { ...defaultState, ...saved, dailyRecords: saved.dailyRecords ?? {}, dailyShares: saved.dailyShares ?? [] };
    }
    return defaultState;
  });
  const [mounted, setMounted] = useState(false);
  const hasSynced = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync from Supabase when user logs in
  useEffect(() => {
    if (!userId || !isSupabaseConfigured || hasSynced.current) return;
    hasSynced.current = true;

    (async () => {
      const [souls, testimonies, prayers, events, groups, communityPosts, globalSoulCount] = await Promise.all([
        db.fetchSouls(userId),
        db.fetchTestimonies(),
        db.fetchPrayers(),
        db.fetchEvents(),
        db.fetchGroups(),
        db.fetchCommunityPosts(),
        db.fetchGlobalSoulCount(),
      ]);

      setState(prev => ({
        ...prev,
        souls: souls.length > 0 ? souls : prev.souls,
        testimonies: testimonies.length > 0 ? testimonies : prev.testimonies,
        prayers: prayers.length > 0 ? prayers : prev.prayers,
        events: events.length > 0 ? events : prev.events,
        groups: groups.length > 0 ? groups : prev.groups,
        communityPosts: communityPosts.length > 0 ? communityPosts : prev.communityPosts,
        globalSoulCount: globalSoulCount > 0 ? globalSoulCount : prev.globalSoulCount,
        userName: user?.user_metadata?.full_name || prev.userName,
      }));
    })();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Realtime: re-fetch shared data when other users make changes
  useEffect(() => {
    if (!userId || !isSupabaseConfigured) return;

    const refreshSharedData = async () => {
      const [testimonies, prayers, communityPosts, globalSoulCount] = await Promise.all([
        db.fetchTestimonies(),
        db.fetchPrayers(),
        db.fetchCommunityPosts(),
        db.fetchGlobalSoulCount(),
      ]);
      setState(prev => ({
        ...prev,
        testimonies: testimonies.length > 0 ? testimonies : prev.testimonies,
        prayers: prayers.length > 0 ? prayers : prev.prayers,
        communityPosts: communityPosts.length > 0 ? communityPosts : prev.communityPosts,
        globalSoulCount: globalSoulCount > 0 ? globalSoulCount : prev.globalSoulCount,
      }));
    };

    const unsubscribe = subscribeToRealtime(refreshSharedData);
    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (mounted) {
      saveState(state);
    }
  }, [state, mounted]);

  const addSoul = useCallback((soul: Omit<Soul, "id">) => {
    const localId = generateId();
    setState(prev => ({
      ...prev,
      souls: [...prev.souls, { ...soul, id: localId }],
      globalSoulCount: prev.globalSoulCount + 1,
    }));
    if (userId && isSupabaseConfigured) {
      db.insertSoul(userId, soul).then(dbSoul => {
        if (dbSoul) {
          setState(prev => ({
            ...prev,
            souls: prev.souls.map(s => s.id === localId ? { ...s, id: dbSoul.id } : s),
          }));
        }
      });
    }
  }, [userId]);

  const updateSoul = useCallback((id: string, updates: Partial<Soul>) => {
    setState(prev => ({
      ...prev,
      souls: prev.souls.map(s => s.id === id ? { ...s, ...updates } : s),
    }));
    if (isSupabaseConfigured) db.updateSoulDb(id, updates);
  }, []);

  const deleteSoul = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      souls: prev.souls.filter(s => s.id !== id),
    }));
    if (isSupabaseConfigured) db.deleteSoulDb(id);
  }, []);

  const addTestimony = useCallback((testimony: Omit<Testimony, "id" | "likes" | "comments">) => {
    const localId = generateId();
    setState(prev => ({
      ...prev,
      testimonies: [{ ...testimony, id: localId, likes: 0, comments: [] }, ...prev.testimonies],
    }));
    if (userId && isSupabaseConfigured) {
      db.insertTestimony(userId, testimony).then(data => {
        if (data) {
          setState(prev => ({
            ...prev,
            testimonies: prev.testimonies.map(t => t.id === localId ? { ...t, id: data.id } : t),
          }));
        }
      });
    }
  }, [userId]);

  const addPrayer = useCallback((prayer: Omit<PrayerRequest, "id" | "likes" | "prayerCount" | "comments">) => {
    const localId = generateId();
    setState(prev => ({
      ...prev,
      prayers: [{ ...prayer, id: localId, likes: 0, prayerCount: 0, comments: [] }, ...prev.prayers],
    }));
    if (userId && isSupabaseConfigured) {
      db.insertPrayer(userId, prayer).then(data => {
        if (data) {
          setState(prev => ({
            ...prev,
            prayers: prev.prayers.map(p => p.id === localId ? { ...p, id: data.id } : p),
          }));
        }
      });
    }
  }, [userId]);

  const addEvent = useCallback((event: Omit<Event, "id" | "attendees">) => {
    const localId = generateId();
    setState(prev => ({
      ...prev,
      events: [...prev.events, { ...event, id: localId, attendees: 0 }],
    }));
    if (userId && isSupabaseConfigured) {
      db.insertEvent(userId, event).then(data => {
        if (data) {
          setState(prev => ({
            ...prev,
            events: prev.events.map(e => e.id === localId ? { ...e, id: data.id } : e),
          }));
        }
      });
    }
  }, [userId]);

  const completeDay = useCallback((day: number) => {
    setState(prev => {
      const newCompleted = prev.completedDays.includes(day) ? prev.completedDays : [...prev.completedDays, day];
      const newDay = Math.max(prev.currentDay, day + 1);
      if (userId && isSupabaseConfigured) {
        db.updateProfile(userId, { current_day: newDay, completed_days: newCompleted });
      }
      return { ...prev, completedDays: newCompleted, currentDay: newDay };
    });
  }, [userId]);

  const setUserName = useCallback((name: string) => {
    setState(prev => ({ ...prev, userName: name }));
  }, []);

  const likeTestimony = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      testimonies: prev.testimonies.map(t => t.id === id ? { ...t, likes: t.likes + 1 } : t),
    }));
    if (isSupabaseConfigured) db.likeTestimonyDb(id);
  }, []);

  const likePrayer = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      prayers: prev.prayers.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p),
    }));
    if (isSupabaseConfigured) db.likePrayerDb(id);
  }, []);

  const prayForRequest = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      prayers: prev.prayers.map(p => p.id === id ? { ...p, prayerCount: p.prayerCount + 1 } : p),
    }));
    if (isSupabaseConfigured) db.prayForRequestDb(id);
  }, []);

  const addCommentToTestimony = useCallback((testimonyId: string, comment: Omit<Comment, "id">) => {
    setState(prev => ({
      ...prev,
      testimonies: prev.testimonies.map(t =>
        t.id === testimonyId
          ? { ...t, comments: [...t.comments, { ...comment, id: generateId() }] }
          : t
      ),
    }));
  }, []);

  const addCommentToPrayer = useCallback((prayerId: string, comment: Omit<Comment, "id">) => {
    setState(prev => ({
      ...prev,
      prayers: prev.prayers.map(p =>
        p.id === prayerId
          ? { ...p, comments: [...p.comments, { ...comment, id: generateId() }] }
          : p
      ),
    }));
  }, []);

  const likeCommunityPost = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      communityPosts: prev.communityPosts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p),
    }));
  }, []);

  const joinGroup = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      groups: prev.groups.map(g => g.id === id ? { ...g, members: g.members + 1 } : g),
    }));
    if (isSupabaseConfigured) db.joinGroupDb(id);
  }, []);

  const rsvpEvent = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      events: prev.events.map(e => e.id === id ? { ...e, attendees: e.attendees + 1 } : e),
    }));
    if (isSupabaseConfigured) db.rsvpEventDb(id);
  }, []);

  const saveDailyRecord = useCallback((record: DailyRecord) => {
    setState(prev => {
      const existingRecord = prev.dailyRecords[record.day];
      const previousSouls = existingRecord ? existingRecord.soulsSaved : 0;
      const soulDiff = record.soulsSaved - previousSouls;
      return {
        ...prev,
        dailyRecords: { ...prev.dailyRecords, [record.day]: record },
        globalSoulCount: prev.globalSoulCount + Math.max(0, soulDiff),
      };
    });
  }, []);

  const shareDailyRecord = useCallback((day: number) => {
    setState(prev => {
      const record = prev.dailyRecords[day];
      if (!record) return prev;
      const alreadyShared = prev.dailyShares.some(s => s.day === day && s.author === prev.userName);
      if (alreadyShared) return prev;
      const share: DailyShare = {
        id: generateId(),
        day: record.day,
        dayTitle: `Day ${record.day}`,
        author: prev.userName,
        reflectionAnswers: record.reflectionAnswers,
        soulsSaved: record.soulsSaved,
        peoplePrayedFor: record.peoplePrayedFor,
        invitationsToChurch: record.invitationsToChurch,
        healingTestimonies: record.healingTestimonies,
        date: new Date().toISOString().split("T")[0],
        likes: 0,
        comments: [],
      };
      return { ...prev, dailyShares: [share, ...prev.dailyShares] };
    });
  }, []);

  const likeDailyShare = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      dailyShares: prev.dailyShares.map(s => s.id === id ? { ...s, likes: s.likes + 1 } : s),
    }));
  }, []);

  const addCommentToDailyShare = useCallback((shareId: string, comment: Omit<Comment, "id">) => {
    setState(prev => ({
      ...prev,
      dailyShares: prev.dailyShares.map(s =>
        s.id === shareId
          ? { ...s, comments: [...s.comments, { ...comment, id: generateId() }] }
          : s
      ),
    }));
  }, []);

  return (
    <AppContext.Provider value={{
      ...state,
      addSoul, updateSoul, deleteSoul,
      addTestimony, addPrayer, addEvent,
      completeDay, setUserName,
      likeTestimony, likePrayer, prayForRequest,
      addCommentToTestimony, addCommentToPrayer,
      likeCommunityPost, joinGroup, rsvpEvent,
      saveDailyRecord, shareDailyRecord, likeDailyShare, addCommentToDailyShare,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
