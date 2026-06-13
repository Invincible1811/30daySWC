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

  return (data || []).map((t: Record<string, unknown>) => ({
    id: t.id as string,
    author: t.author as string,
    authorAvatar: (t.author_avatar as string) || undefined,
    title: t.title as string,
    content: t.content as string,
    likes: (t.likes as number) || 0,
    date: t.created_at as string,
    comments: [],
    mediaUrl: (t.media_url as string) || undefined,
    mediaType: (t.media_type as "video" | "audio") || undefined,
    blurred: (t.blurred as boolean) || false,
    mediaDuration: (t.media_duration as number) || undefined,
  }));
}

export async function insertTestimony(userId: string, testimony: { author: string; authorAvatar?: string; title: string; content: string; date: string; mediaUrl?: string; mediaType?: string; blurred?: boolean; mediaDuration?: number }): Promise<{ id: string } | null> {
  if (!isSupabaseConfigured) return null;
  const row: Record<string, unknown> = {
    user_id: userId,
    author: testimony.author,
    title: testimony.title,
    content: testimony.content,
  };
  if (testimony.authorAvatar) row.author_avatar = testimony.authorAvatar;
  if (testimony.mediaUrl) row.media_url = testimony.mediaUrl;
  if (testimony.mediaType) row.media_type = testimony.mediaType;
  if (testimony.blurred) row.blurred = true;
  if (testimony.mediaDuration) row.media_duration = testimony.mediaDuration;
  const { data } = await supabase
    .from("testimonies")
    .insert(row)
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

export async function deleteTestimonyDb(id: string) {
  if (!isSupabaseConfigured) return;
  await supabase.from("testimonies").delete().eq("id", id);
}

// ─── Prayers ──────────────────────────────────────────────

export async function fetchPrayers(): Promise<PrayerRequest[]> {
  if (!isSupabaseConfigured) return [];
  const { data } = await supabase
    .from("prayers")
    .select("*")
    .order("created_at", { ascending: false });

  return (data || []).map((p: Record<string, unknown>) => ({
    id: p.id as string,
    author: p.author as string,
    authorAvatar: (p.author_avatar as string) || undefined,
    content: p.content as string,
    likes: (p.likes as number) || 0,
    prayerCount: (p.prayer_count as number) || 0,
    date: (p.created_at as string).split("T")[0],
    comments: [],
  }));
}

export async function insertPrayer(userId: string, prayer: { author: string; authorAvatar?: string; content: string; date: string }): Promise<{ id: string } | null> {
  if (!isSupabaseConfigured) return null;
  const row: Record<string, unknown> = {
    user_id: userId,
    author: prayer.author,
    content: prayer.content,
  };
  if (prayer.authorAvatar) row.author_avatar = prayer.authorAvatar;
  const { data } = await supabase
    .from("prayers")
    .insert(row)
    .select()
    .single();
  return data as { id: string } | null;
}

export async function likePrayerDb(id: string) {
  if (!isSupabaseConfigured) return;
  const { data } = await supabase.from("prayers").select("likes").eq("id", id).single();
  if (data) {
    await supabase.from("prayers").update({ likes: ((data as { likes: number }).likes || 0) + 1 }).eq("id", id);
  }
}

export async function deletePrayerDb(id: string) {
  if (!isSupabaseConfigured) return;
  await supabase.from("prayers").delete().eq("id", id);
}

export async function prayForRequestDb(id: string) {
  if (!isSupabaseConfigured) return;
  const { data } = await supabase.from("prayers").select("prayer_count").eq("id", id).single();
  if (data) {
    await supabase.from("prayers").update({ prayer_count: ((data as { prayer_count: number }).prayer_count || 0) + 1 }).eq("id", id);
  }
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
    address: e.address || "",
    locationNotes: e.location_notes || "",
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
      address: event.address || "",
      location_notes: event.locationNotes || "",
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

  return (data || []).map((p: Record<string, unknown>) => ({
    id: p.id as string,
    author: p.author as string,
    authorAvatar: (p.author_avatar as string) || undefined,
    location: (p.location as string) || "",
    content: p.content as string,
    likes: (p.likes as number) || 0,
    type: p.type as CommunityPost["type"],
    date: (p.created_at as string).split("T")[0],
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
