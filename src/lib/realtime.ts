"use client";

import { supabase, isSupabaseConfigured } from "./supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

type Callback = () => void;
type EventCallback = (table: string, eventType: string) => void;

let channel: RealtimeChannel | null = null;

export function subscribeToRealtime(onUpdate: Callback, onNewEvent?: EventCallback): () => void {
  if (!isSupabaseConfigured || !supabase) return () => {};

  channel = supabase
    .channel("public-changes")
    .on("postgres_changes", { event: "*", schema: "public", table: "testimonies" }, (payload) => {
      onUpdate();
      if (payload.eventType === "INSERT" && onNewEvent) onNewEvent("testimonies", "INSERT");
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "prayers" }, (payload) => {
      onUpdate();
      if (payload.eventType === "INSERT" && onNewEvent) onNewEvent("prayers", "INSERT");
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "community_posts" }, (payload) => {
      onUpdate();
      if (payload.eventType === "INSERT" && onNewEvent) onNewEvent("community_posts", "INSERT");
    })
    .on("postgres_changes", { event: "*", schema: "public", table: "souls" }, () => onUpdate())
    .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, () => onUpdate())
    .subscribe();

  return () => {
    if (channel) {
      supabase.removeChannel(channel);
      channel = null;
    }
  };
}
