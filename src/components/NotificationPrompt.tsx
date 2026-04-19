"use client";

import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";

export default function NotificationPrompt() {
  const [show, setShow] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    setPermission(Notification.permission);

    // Show prompt if not yet decided and hasn't been dismissed recently
    if (Notification.permission === "default") {
      const dismissed = localStorage.getItem("ws-notif-dismissed");
      if (!dismissed || Date.now() - parseInt(dismissed) > 7 * 24 * 60 * 60 * 1000) {
        // Show after 10 seconds
        const timer = setTimeout(() => setShow(true), 10000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleEnable = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
    setShow(false);

    if (result === "granted") {
      // Schedule daily reminder notification
      scheduleDailyReminder();
    }
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("ws-notif-dismissed", Date.now().toString());
  };

  if (!show || permission !== "default") return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:w-96 z-50 animate-slide-up">
      <div className="rounded-2xl shadow-2xl border border-grey-light overflow-hidden" style={{ background: "#fff" }}>
        <div className="p-4 flex gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "#EFF6FF" }}>
            <Bell size={20} style={{ color: "#1E40AF" }} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm" style={{ color: "#111827" }}>Enable Notifications?</h4>
            <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
              Get daily reminders to complete your challenge and win souls!
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleEnable}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={{ background: "#1E40AF", color: "#fff" }}
              >
                Enable
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={{ background: "#F3F4F6", color: "#6B7280" }}
              >
                Later
              </button>
            </div>
          </div>
          <button onClick={handleDismiss} className="flex-shrink-0 p-1 self-start">
            <X size={16} style={{ color: "#9CA3AF" }} />
          </button>
        </div>
      </div>
    </div>
  );
}

function scheduleDailyReminder() {
  if (!("serviceWorker" in navigator)) return;

  // Use the Notifications API for a local scheduled notification
  // For now, set up a daily check using the app itself
  localStorage.setItem("ws-notif-enabled", "true");

  // Show a confirmation notification
  if (Notification.permission === "granted") {
    new Notification("Winning Souls", {
      body: "Notifications enabled! You'll get daily reminders to win souls.",
      icon: "/icons/icon-192.png",
    });
  }
}
