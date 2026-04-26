"use client";

import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isPWA = window.matchMedia("(display-mode: standalone)").matches
      || (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isPWA) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    return outcome === "accepted";
  };

  return { canInstall: !!deferredPrompt && !isInstalled, isInstalled, install };
}

export default function InstallPrompt() {
  const { canInstall, isInstalled, install } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);
    const wasDismissed = sessionStorage.getItem("ws-install-dismissed");
    if (wasDismissed) setDismissed(true);
  }, []);

  if (isInstalled || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("ws-install-dismissed", "true");
  };

  // Android/Desktop: native install prompt
  if (canInstall) {
    return (
      <div className="fixed bottom-24 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:w-80 z-50 animate-fade-in">
        <div className="bg-dark text-white rounded-2xl p-4 shadow-2xl border border-dark-light">
          <button onClick={handleDismiss} className="absolute top-3 right-3">
            <X size={16} className="text-grey" />
          </button>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Download size={20} className="text-primary-light" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">Install Winning Souls</p>
              <p className="text-xs text-grey-medium mt-1">Get the full app experience — works offline, no browser needed.</p>
              <button
                onClick={install}
                className="mt-3 w-full py-2.5 rounded-xl text-sm font-bold bg-primary hover:bg-primary-dark transition-colors text-center"
              >
                Install App
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // iOS: show manual instructions
  if (isIOS) {
    return (
      <>
        {!showIOSGuide && (
          <div className="fixed bottom-24 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:w-80 z-50 animate-fade-in">
            <div className="bg-dark text-white rounded-2xl p-4 shadow-2xl border border-dark-light">
              <button onClick={handleDismiss} className="absolute top-3 right-3">
                <X size={16} className="text-grey" />
              </button>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Smartphone size={20} className="text-primary-light" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Add to Home Screen</p>
                  <p className="text-xs text-grey-medium mt-1">Install this app on your iPhone for the best experience.</p>
                  <button
                    onClick={() => setShowIOSGuide(true)}
                    className="mt-3 w-full py-2.5 rounded-xl text-sm font-bold bg-primary hover:bg-primary-dark transition-colors text-center"
                  >
                    Show Me How
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
            <div className="bg-white rounded-t-3xl w-full max-w-md p-6 pb-10 animate-slide-in">
              <button onClick={() => { setShowIOSGuide(false); handleDismiss(); }} className="absolute top-4 right-4">
                <X size={20} className="text-grey-dark" />
              </button>
              <h3 className="text-lg font-bold text-dark mb-4">Install on iPhone</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center flex-shrink-0">1</span>
                  <p className="text-sm text-grey-dark pt-0.5">Tap the <strong>Share</strong> button <span className="inline-block w-5 h-5 text-center leading-5 bg-grey-light rounded">⬆</span> at the bottom of Safari</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center flex-shrink-0">2</span>
                  <p className="text-sm text-grey-dark pt-0.5">Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong></p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center flex-shrink-0">3</span>
                  <p className="text-sm text-grey-dark pt-0.5">Tap <strong>&quot;Add&quot;</strong> — the app will appear on your home screen!</p>
                </div>
              </div>
              <button
                onClick={() => { setShowIOSGuide(false); handleDismiss(); }}
                className="mt-6 w-full py-3 rounded-xl text-sm font-bold bg-primary text-white"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}
