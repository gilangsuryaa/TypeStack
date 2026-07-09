"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Lightweight WebAudio keystroke feedback. No audio assets are shipped: a short
 * oscillator blip is synthesized on demand, so it stays tiny and offline-first.
 */
export function useTypingSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, []);

  return useCallback(
    (correct: boolean) => {
      if (!enabled || typeof window === "undefined") return;
      try {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (!ctxRef.current) ctxRef.current = new Ctx();
        const ctx = ctxRef.current;
        if (ctx.state === "suspended") void ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = correct ? 620 : 240;
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      } catch {
        // Audio is best-effort; ignore failures (e.g. autoplay policies).
      }
    },
    [enabled],
  );
}
