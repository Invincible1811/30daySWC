"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

const APP_VERSION = "2.1.0";

export default function PWARegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Force clear old cached data if version changed
    const storedVersion = localStorage.getItem("ws-app-version");
    if (storedVersion !== APP_VERSION) {
      localStorage.removeItem("winning-souls-state");
      localStorage.setItem("ws-app-version", APP_VERSION);
      sessionStorage.removeItem("ws-entered");
    }

    if (!("serviceWorker" in navigator)) return;

    // Register service worker
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("SW registered:", reg.scope);

        // Check for updates every 60 seconds
        setInterval(() => reg.update(), 60 * 1000);

        // Detect new service worker waiting
        reg.addEventListener("updatefound", () => {
          const newSW = reg.installing;
          if (!newSW) return;
          newSW.addEventListener("statechange", () => {
            if (newSW.state === "installed" && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        });
      })
      .catch((err) => console.log("SW registration failed:", err));

    // Listen for SW_UPDATED message from service worker
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type === "SW_UPDATED") {
        setUpdateAvailable(true);
      }
    });
  }, []);

  const handleUpdate = () => {
    window.location.reload();
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] animate-fade-in">
      <div className="bg-primary text-white px-4 py-3 flex items-center justify-between gap-3 shadow-lg">
        <p className="text-sm font-medium flex-1">A new version is available!</p>
        <button
          onClick={handleUpdate}
          className="flex items-center gap-2 bg-white text-primary font-bold text-sm px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors shrink-0"
        >
          <RefreshCw size={14} /> Update Now
        </button>
      </div>
    </div>
  );
}
