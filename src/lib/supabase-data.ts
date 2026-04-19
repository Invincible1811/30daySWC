import { supabase, isSupabaseConfigured } from "./supabase";
import type { Soul, Testimony, PrayerRequest, Event, Group, CommunityPost, DailyRecord } from "./data";

// ─── Souls ────────────────────────────────────────────────

export async function fetchSouls(userId: string): Promise<Soul[]> {
  if (!isSupabaseConfigured) return [];
  const { data } = await supabase
    .from("souls")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data || []).map((s) => ({
    id: s.id,
    name: s.name,
    phone: s.phone,
    email: s.email,
    location: s.location,
    notes: s.notes,
    followUpStatus: s.follow_up_status as Soul["followUpStatus"],
    date: s.created_at.split("T")[0],
    addedBy: s.user_id,
  }));
}

export async function insertSoul(userId: string, soul: Omit<Soul, "id">): Promise<Soul | null> {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase
    .from("souls")
    .insert({
      user_id: userId,
      name: soul.name,
      phone: soul.phone || "",
      email: soul.email || "",
      location: soul.location || "",
      notes: soul.notes || "",
      follow_up_status: soul.followUpStatus || "pending",
    })
    .select()
    .single();

  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    phone: data.phone,
    email: data.email,
    location: data.location,
    notes: data.notes,
    followUpStatus: data.follow_up_status as Soul["followUpStatus"],
    date: data.created_at.split("T")[0],
    addedBy: data.user_id,
  };
}

export async function updateSoulDb(id: string, updates: Partial<Soul>) {
  if (!isSupabaseConfigured) return;
  const dbUpdates: Record<string, unknown> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
  if (updates.email !== undefined) dbUpdates.email = updates.email;
  if (updates.location !== undefined) dbUpdates.location = updates.location;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
  if (updates.followUpStatus !== undefined) dbUpdates.follow_up_status = updates.followUpStatus;
  await supabase.from("souls").update(dbUpdates).eq("id", id);
}

export async function deleteSoulDb(id: string) {
  if (!isSupabaseConfigured) return;
  await supabase.from("souls").delete().eq("id", id);
}

// ─── Testimonies ──────────────────────────────────────────

export async function fetchTestimonies(): Promise<Testimony[]> {
  if (!isSupabaseConfigured) return [];
  const { data } = await supabase
    .from("testimonies")
    .select("*")
    .order("created_at", { ascending: false });

  return (data || []).map((t) => ({
    id: t.id,
    author: t.author,
    title: t.title,
    content: t.content,
    likes: t.likes,
    date: t.created_at.split("T")[0],
    comments: [],
  }));
}

export async function insertTestimony(userId: string, testimony: { author: string; title: string; content: string; date: string }): Promise<{ id: string } | null> {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase
    .from("testimonies")
    .insert({
      user_id: userId,
      author: testimony.author,
      title: testimony.title,
      content: testimony.content,
    })
    .select()
    .single();
  return data as { id: string } | null;
}

export async function likeTestimonyDb(id: string) {
  if (!isSupabaseConfigured) return;
  const { data } = await supabase.from("testimonies").select("likes").eq("id", id).single();
  if (data) {
    await supabase.from("testimonies").update({ likes: (data as { likes: number }).likes + 1 }).eq("id", id);
  }
}

// ─── Prayers ──────────────────────────────────────────────

export async function fetchPrayers(): Promise<PrayerRequest[]> {
  if (!isSupabaseConfigured) return [];
  const { data } = await supabase
    .from("prayers")
    .select("*")
    .order("created_at", { ascending: false });

  return (data || []).map((p) => ({
    id: p.id,
    author: p.author,
    content: p.content,
    likes: p.likes,
    prayerCount: p.prayer_count,
    date: p.created_at.split("T")[0],
    comments: [],
  }));
}

export async function insertPrayer(userId: string, prayer: { author: string; content: string; date: string }): Promise<{ id: string } | null> {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase
    .from("prayers")
    .insert({
      user_id: userId,
      author: prayer.author,
      content: prayer.content,
    })
    .select()
    .single();
  return data as { id: string } | null;
}

export async function likePrayerDb(id: string) {
  if (!isSupabaseConfigured) return;
  supabase.from("prayers").select("likes").eq("id", id).single().then(({ data }) => {
    if (data) supabase.from("prayers").update({ likes: (data as { likes: number }).likes + 1 }).eq("id", id);
  });
}

export async function prayForRequestDb(id: string) {
  if (!isSupabaseConfigured) return;
  supabase.from("prayers").select("prayer_count").eq("id", id).single().then(({ data }) => {
    if (data) supabase.from("prayers").update({ prayer_count: (data as { prayer_count: number }).prayer_count + 1 }).eq("id", id);
  });
}

// ─── Events ───────────────────────────────────────────────

export async function fetchEvents(): Promise<Event[]> {
  if (!isSupabaseConfigured) return [];
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  return (data || []).map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description,
    date: e.date,
    time: e.time,
    location: e.location,
    type: e.type as Event["type"],
    attendees: e.attendees,
  }));
}

export async function insertEvent(userId: string, event: Omit<Event, "id" | "attendees">): Promise<{ id: string } | null> {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase
    .from("events")
    .insert({
      user_id: userId,
      title: event.title,
      description: event.description || "",
      date: event.date,
      time: event.time,
      location: event.location || "",
      type: event.type,
    })
    .select()
    .single();
  return data as { id: string } | null;
}

export async function rsvpEventDb(id: string) {
  if (!isSupabaseConfigured) return;
  supabase.from("events").select("attendees").eq("id", id).single().then(({ data }) => {
    if (data) supabase.from("events").update({ attendees: (data as { attendees: number }).attendees + 1 }).eq("id", id);
  });
}

// ─── Community Posts ──────────────────────────────────────

export async function fetchCommunityPosts(): Promise<CommunityPost[]> {
  if (!isSupabaseConfigured) return [];
  const { data } = await supabase
    .from("community_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (data || []).map((p) => ({
    id: p.id,
    author: p.author,
    location: p.location,
    content: p.content,
    likes: p.likes,
    type: p.type as CommunityPost["type"],
    date: p.created_at.split("T")[0],
    comments: [],
  }));
}

// ─── Groups ───────────────────────────────────────────────

export async function fetchGroups(): Promise<Group[]> {
  if (!isSupabaseConfigured) return [];
  const { data } = await supabase
    .from("groups")
    .select("*")
    .order("created_at", { ascending: false });

  return (data || []).map((g) => ({
    id: g.id,
    name: g.name,
    description: g.description,
    leader: g.leader,
    members: g.members,
    type: g.type as Group["type"],
  }));
}

export async function joinGroupDb(id: string) {
  if (!isSupabaseConfigured) return;
  supabase.from("groups").select("members").eq("id", id).single().then(({ data }) => {
    if (data) supabase.from("groups").update({ members: (data as { members: number }).members + 1 }).eq("id", id);
  });
}

// ─── Comments ─────────────────────────────────────────────

export async function insertComment(userId: string, parentType: string, parentId: string, author: string, content: string): Promise<{ id: string } | null> {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase
    .from("comments")
    .insert({
      user_id: userId,
      parent_type: parentType as "testimony" | "prayer" | "community" | "daily_share",
      parent_id: parentId,
      author,
      content,
    })
    .select()
    .single();
  return data as { id: string } | null;
}

export async function fetchComments(parentType: string, parentId: string) {
  if (!isSupabaseConfigured) return [];
  const { data } = await supabase
    .from("comments")
    .select("*")
    .eq("parent_type", parentType)
    .eq("parent_id", parentId)
    .order("created_at", { ascending: true });

  return (data || []).map((c) => ({
    id: c.id,
    author: c.author,
    content: c.content,
    date: c.created_at.split("T")[0],
  }));
}

// ─── Profile sync ─────────────────────────────────────────

export async function updateProfile(userId: string, updates: { current_day?: number; completed_days?: number[]; username?: string; full_name?: string }) {
  if (!isSupabaseConfigured) return;
  await supabase.from("profiles").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", userId);
}

// ─── Global soul count (sum of all souls across all users) ─

export async function fetchGlobalSoulCount(): Promise<number> {
  if (!isSupabaseConfigured) return 0;
  const { count } = await supabase
    .from("souls")
    .select("*", { count: "exact", head: true });
  return count || 0;
}
