// Helpers for navigating between Babs across Jilids inside Amtsilati materi.
import { MATERI_DATA } from "./materiData";
import { ALL_AUDIO_QUIZZES } from "./audioQuizData";

export interface BabLocation {
  kitabId: string;
  jilidId: string;
  babId: string;
}

export interface FlatBab extends BabLocation {
  babTitle: string;
  jilidTitle: string;
  kitabTitle: string;
}

/** Flatten all babs of a kitab in display order. */
export function flattenKitabBabs(kitabId: string): FlatBab[] {
  const kitab = MATERI_DATA.find((k) => k.id === kitabId);
  if (!kitab) return [];
  const out: FlatBab[] = [];
  for (const j of kitab.jilids) {
    for (const b of j.babs) {
      out.push({
        kitabId: kitab.id,
        jilidId: j.id,
        babId: b.id,
        babTitle: b.title,
        jilidTitle: j.title,
        kitabTitle: kitab.title,
      });
    }
  }
  return out;
}

export function getPrevBab(loc: BabLocation): FlatBab | null {
  const list = flattenKitabBabs(loc.kitabId);
  const idx = list.findIndex((b) => b.babId === loc.babId);
  if (idx <= 0) return null;
  return list[idx - 1];
}

export function getNextBab(loc: BabLocation): FlatBab | null {
  const list = flattenKitabBabs(loc.kitabId);
  const idx = list.findIndex((b) => b.babId === loc.babId);
  if (idx === -1 || idx >= list.length - 1) return null;
  return list[idx + 1];
}

export function hasQuiz(jilidId: string, babId: string): boolean {
  return ALL_AUDIO_QUIZZES.some((q) => q.jilidId === jilidId && q.babId === babId);
}

// SessionStorage keys for cross-page navigation hints
const PENDING_QUIZ_KEY = "kitabify_pending_quiz";
const PENDING_MATERI_KEY = "kitabify_pending_materi";

export function setPendingQuiz(loc: BabLocation) {
  sessionStorage.setItem(PENDING_QUIZ_KEY, JSON.stringify(loc));
}
export function consumePendingQuiz(): BabLocation | null {
  const raw = sessionStorage.getItem(PENDING_QUIZ_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(PENDING_QUIZ_KEY);
  try { return JSON.parse(raw) as BabLocation; } catch { return null; }
}

export function setPendingMateri(loc: BabLocation) {
  sessionStorage.setItem(PENDING_MATERI_KEY, JSON.stringify(loc));
}
export function consumePendingMateri(): BabLocation | null {
  const raw = sessionStorage.getItem(PENDING_MATERI_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(PENDING_MATERI_KEY);
  try { return JSON.parse(raw) as BabLocation; } catch { return null; }
}
