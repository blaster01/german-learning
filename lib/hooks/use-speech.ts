"use client";

import { useCallback, useEffect, useState } from "react";

let cachedVoices: SpeechSynthesisVoice[] = [];

const BLANK = /[^\s.,!?;:]*_{2,}[^\s.,!?;:]*/g;

/**
 * Replace blank markers with the spoken German word for "gap" so speech
 * synthesis says something coherent instead of spelling out underscores (or
 * silently dropping them). Handles both full blanks ("____") and partial
 * word fragments ("d____", "sein____") since content uses both forms.
 *
 * With `pauseAtBlanks`, "Lücke" is set off with commas on both sides so the
 * voice actually pauses around it — otherwise it runs straight into the
 * surrounding words and the location of the gap isn't audible. This is
 * opt-in because it's only useful for the spoken utterance, not for the
 * `SpeakButton` aria-label (screen readers apply their own prosody, and the
 * label should stay a clean transcript).
 */
export function toSpeakableGerman(
  text: string,
  { pauseAtBlanks = false }: { pauseAtBlanks?: boolean } = {},
): string {
  const out = text
    .replace(BLANK, pauseAtBlanks ? ", Lücke," : "Lücke")
    .replace(/\s+/g, " ")
    .trim();
  if (!pauseAtBlanks) return out;
  return out
    .replace(/\s+([,.!?;:])/g, "$1") // "über , Lücke" -> "über, Lücke"
    .replace(/([,.!?;:]),\s*Lücke/g, "$1 Lücke") // "sagt,, Lücke" -> "sagt, Lücke"
    .replace(/Lücke,([,.!?;:])/g, "Lücke$1") // "Lücke,." -> "Lücke."
    .replace(/^,\s*/, "")
    .replace(/,$/, "")
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
    const trimmed = toSpeakableGerman(text, { pauseAtBlanks: true });
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
