"use client";

import { useCallback, useEffect, useState } from "react";

let cachedVoices: SpeechSynthesisVoice[] = [];

/**
 * Replace blank markers with the spoken German word for "gap" so speech
 * synthesis says something coherent instead of spelling out underscores (or
 * silently dropping them). Handles both full blanks ("____") and partial
 * word fragments ("d____", "sein____") since content uses both forms.
 */
export function toSpeakableGerman(text: string): string {
  return text
    .replace(/[^\s.,!?;:]*_{2,}[^\s.,!?;:]*/g, "Lücke")
    .replace(/\s+/g, " ")
    .trim();
}

function pickGermanVoice(): SpeechSynthesisVoice | undefined {
  if (typeof window === "undefined" || !("speechSynthesis" in window))
    return undefined;
  const voices = cachedVoices.length
    ? cachedVoices
    : window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang?.toLowerCase() === "de-de") ??
    voices.find((v) => v.lang?.toLowerCase().startsWith("de")) ??
    undefined
  );
}

/**
 * Thin wrapper around the Web Speech API's SpeechSynthesis for reading
 * German prompts/answers aloud. No network calls, no API keys — degrades to
 * a no-op (supported=false) in browsers/environments without it.
 */
export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSupported(true);
    const load = () => {
      cachedVoices = window.speechSynthesis.getVoices();
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const trimmed = toSpeakableGerman(text);
    if (!trimmed) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(trimmed);
    utterance.lang = "de-DE";
    const voice = pickGermanVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = 0.92;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking, supported };
}
