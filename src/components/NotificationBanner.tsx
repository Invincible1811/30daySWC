"use client";

import { useState, useEffect } from "react";
import { Bell, X, RefreshCw } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: "update" | "announcement";
  created_at: string;
}

export default function NotificationBanner() {
  const [notification, setNotification] = useState<AppNotification | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Load dismissed notification IDs
    const stored = localStorage.getItem("ws-dismissed-notifs");
    const dismissedIds: string[] = stored ? JSON.parse(stored) : [];
    setDismissed(dismissedIds);

    // Fetch latest notification from last 24 hours
    const fetchNotif = async () => {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(1);
      if (data && data.length > 0 && !dismissedIds.includes(data[0].id)) {
        setNotification(data[0] as AppNotification);
      }
    };

    fetchNotif();

    // Listen for new notifications in real-time
    const channel = supabase
      .channel("notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload) => {
        const notif = payload.new as AppNotification;
        if (!dismissedIds.includes(notif.id)) {
          setNotification(notif);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleDismiss = () => {
    if (!notification) return;
    const updated = [...dismissed, notification.id];
    setDismissed(updated);
    localStorage.setItem("ws-dismissed-notifs", JSON.stringify(updated));
    setNotification(null);
  };

  const handleUpdate = () => {
    handleDismiss();
    window.location.reload();
  };

  if (!notification) return null;

  const isUpdate = notification.type === "update";

  return (
    <div className="fixed top-0 left-0 right-0 z-[9998] animate-fade-in lg:ml-64">
      <div className={`px-4 py-3 flex items-start gap-3 shadow-lg ${isUpdate ? "bg-primary text-white" : "bg-warning text-white"}`}>
        <div className="shrink-0 mt-0.5">
          {isUpdate ? <RefreshCw size={18} /> : <Bell size={18} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold">{notification.title}</p>
          <p className="text-xs opacity-90 mt-0.5">{notification.body}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isUpdate && (
            <button
              onClick={handleUpdate}
              className="flex items-center gap-1 bg-white text-primary font-bold text-xs px-3 py-1.5 rounded-lg"
            >
              <RefreshCw size={12} /> Update
            </button>
          )}
          <button onClick={handleDismiss} className="p-1 hover:bg-white/20 rounded">
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
