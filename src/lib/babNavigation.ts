// Helpers for navigating between Babs across Jilids inside Amtsilati materi.
import { MATERI_DATA } from "./materiData";
import { ALL_AUDIO_QUIZZES } from "./audioQuizData";
import { JILID_LIST, type NahwuJilid, type NahwuBab } from "./nahwuQuizData";

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
  // A bab has a quiz if either an audio quiz exists OR a Nahwu (text) quiz can be matched.
  if (ALL_AUDIO_QUIZZES.some((q) => q.jilidId === jilidId && q.babId === babId)) return true;
  return findNahwuBabByMateriId(babId) !== null;
}

/** Map a Materi babId (e.g. "huruf_jar", "j3_mubtada") to the Nahwu quiz bab. */
export function findNahwuBabByMateriId(
  materiBabId: string
): { jilid: NahwuJilid; bab: NahwuBab } | null {
  // Strip optional "j{n}_" prefix from materi id so we match by topic suffix.
  const normalized = materiBabId.replace(/^j\d+_/, "");
  for (const jilid of JILID_LIST) {
    for (const bab of jilid.babs) {
      // Nahwu ids look like "j1_b1_huruf_jar" — match by ending with the materi suffix.
      if (bab.id.endsWith(`_${normalized}`) || bab.id === materiBabId) {
        return { jilid, bab };
      }
    }
  }
  return null;
}

// =================== Quiz pass-gate storage ===================
const PASS_KEY = "kitabify_quiz_pass"; // { [materiBabId]: bestScore }
const PASS_THRESHOLD = 7; // out of 10 — minimum to unlock next bab (must be ≥7)
const PERFECT_SCORE = 10;

function readPassMap(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(PASS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function recordQuizScore(materiBabId: string, score: number) {
  const map = readPassMap();
  map[materiBabId] = Math.max(map[materiBabId] || 0, score);
  localStorage.setItem(PASS_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event("storage"));
  // Also feed the gamified path-progress store. Lazy-import to keep
  // legacy modules free of new deps.
  import("./gamification").then((m) => {
    // We may not know exact kitabId/jilidId here — find it from MATERI_DATA.
    import("./materiData").then(({ MATERI_DATA }) => {
      for (const k of MATERI_DATA) {
        for (const j of k.jilids) {
          for (const b of j.babs) {
            if (b.id === materiBabId) {
              m.recordBabQuizScore(
                { kitabId: k.id, jilidId: j.id, babId: materiBabId },
                score,
              );
              return;
            }
          }
        }
      }
    });
  }).catch(() => {});
}

export function getBestQuizScore(materiBabId: string): number {
  return readPassMap()[materiBabId] || 0;
}

export function hasPassedQuiz(materiBabId: string): boolean {
  return getBestQuizScore(materiBabId) >= PASS_THRESHOLD;
}

export function hasPerfectQuiz(materiBabId: string): boolean {
  return getBestQuizScore(materiBabId) >= PERFECT_SCORE;
}

export const QUIZ_PASS_THRESHOLD = PASS_THRESHOLD;
export const QUIZ_PERFECT_SCORE = PERFECT_SCORE;

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
