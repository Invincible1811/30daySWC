"use client";

import { supabase, isSupabaseConfigured } from "./supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

type Callback = () => void;

let channel: RealtimeChannel | null = null;

export function subscribeToRealtime(onUpdate: Callback): () => void {
  if (!isSupabaseConfigured || !supabase) return () => {};

  channel = supabase
    .channel("public-changes")
    .on("postgres_changes", { event: "*", schema: "public", table: "testimonies" }, () => onUpdate())
    .on("postgres_changes", { event: "*", schema: "public", table: "prayers" }, () => onUpdate())
    .on("postgres_changes", { event: "*", schema: "public", table: "community_posts" }, () => onUpdate())
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
