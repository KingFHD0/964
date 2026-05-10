"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISSED_KEY = "aether.install.dismissed.v1";

export function InstallPrompt() {
  const [deferred, setDeferred] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.localStorage.getItem(DISMISSED_KEY)) return;
    } catch {
      /* noop */
    }

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onBip);

    const onInstalled = () => {
      setVisible(false);
      setDeferred(null);
    };
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      /* noop */
    }
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setVisible(false);
    setDeferred(null);
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 360, damping: 30 }}
          role="dialog"
          aria-labelledby="install-title"
          className="fixed bottom-[calc(env(safe-area-inset-bottom)+90px)] left-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 overflow-hidden rounded-2xl glass-strong p-4 shadow-elev-2 lg:bottom-6"
        >
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
              <Download className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div id="install-title" className="text-[13.5px] font-medium text-primary">
                Install Aether
              </div>
              <div className="mt-0.5 text-[12.5px] leading-relaxed text-primary/60">
                Add to your home screen for a native, offline-ready experience.
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={install}
                  className="focus-ring inline-flex h-8 items-center rounded-full bg-grad-cta px-3 text-[12px] font-medium text-white hover:brightness-110"
                >
                  Install
                </button>
                <button
                  onClick={dismiss}
                  className="focus-ring text-[12px] text-primary-muted hover:text-primary"
                >
                  Not now
                </button>
              </div>
            </div>
            <button
              onClick={dismiss}
              aria-label="Close"
              className="focus-ring grid h-7 w-7 place-items-center rounded-full text-primary-muted/80 hover:bg-white/5 hover:text-primary"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
