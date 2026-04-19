"use client";

import { useEffect } from "react";

const APP_VERSION = "2.0.0";

export default function PWARegister() {
  useEffect(() => {
    // Force clear old cached data if version changed
    const storedVersion = localStorage.getItem("ws-app-version");
    if (storedVersion !== APP_VERSION) {
      localStorage.removeItem("winning-souls-state");
      localStorage.setItem("ws-app-version", APP_VERSION);
      // Also clear the session landing flag so landing shows again
      sessionStorage.removeItem("ws-entered");
    }

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("SW registered:", reg.scope))
        .catch((err) => console.log("SW registration failed:", err));
    }
  }, []);

  return null;
}
