// =====================================================
// Gamification — hybrid LocalStorage + Lovable Cloud sync
// Extends, never replaces, the existing kitabify_user store.
// =====================================================
import { supabase } from "@/integrations/supabase/client";
import { getUser, saveUser } from "./store";

export const MAX_HEARTS = 5;
export const HEART_REGEN_MINUTES = 30; // 1 heart every 30 minutes
export const HEART_REFILL_COST = 50;   // EXP cost to refill all hearts

// ---------- LocalStorage keys ----------
const HEARTS_KEY = "kitabify_hearts";        // { hearts: number, updatedAt: ISO }
const PATH_PROGRESS_KEY = "kitabify_path";   // { [babId]: { read, score, completedAt } }
const CHEST_KEY = "kitabify_chests";         // { [jilidId]: ISO date opened }

export interface HeartsState {
  hearts: number;
  updatedAt: string; // ISO
}

export interface PathProgressEntry {
  read: boolean;
  score: number;       // best quiz score 0..10
  completedAt?: string;
}

// =====================================================
// HEARTS
// =====================================================
function readHeartsRaw(): HeartsState {
  try {
    const raw = localStorage.getItem(HEARTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { hearts: MAX_HEARTS, updatedAt: new Date().toISOString() };
}

function writeHeartsRaw(s: HeartsState) {
  localStorage.setItem(HEARTS_KEY, JSON.stringify(s));
  window.dispatchEvent(new Event("kitabify:hearts"));
  // Background cloud sync — never blocks UI
  syncHeartsToCloud(s).catch(() => { /* swallow */ });
}

/** Apply passive regen and return current heart count. */
export function getHearts(): number {
  const s = readHeartsRaw();
  if (s.hearts >= MAX_HEARTS) {
    if (s.hearts !== MAX_HEARTS) writeHeartsRaw({ hearts: MAX_HEARTS, updatedAt: new Date().toISOString() });
    return MAX_HEARTS;
  }
  const last = new Date(s.updatedAt).getTime();
  const now = Date.now();
  const elapsedMin = Math.floor((now - last) / 60000);
  const regen = Math.floor(elapsedMin / HEART_REGEN_MINUTES);
  if (regen <= 0) return s.hearts;
  const next = Math.min(MAX_HEARTS, s.hearts + regen);
  // Carry over the unused minutes so timer keeps ticking accurately
  const consumedMin = regen * HEART_REGEN_MINUTES;
  const carry = new Date(last + consumedMin * 60000).toISOString();
  writeHeartsRaw({ hearts: next, updatedAt: next >= MAX_HEARTS ? new Date().toISOString() : carry });
  return next;
}

/** Seconds until the next heart regenerates. 0 if hearts are full. */
export function secondsToNextHeart(): number {
  const h = getHearts();
  if (h >= MAX_HEARTS) return 0;
  const s = readHeartsRaw();
  const last = new Date(s.updatedAt).getTime();
  const elapsedSec = Math.floor((Date.now() - last) / 1000);
  return Math.max(0, HEART_REGEN_MINUTES * 60 - elapsedSec);
}

export function loseHeart(): number {
  const h = getHearts();
  if (h <= 0) return 0;
  const next = h - 1;
  // Reset the regen timer when dropping below max so countdown starts now
  writeHeartsRaw({ hearts: next, updatedAt: new Date().toISOString() });
  return next;
}

/** Spend EXP to refill all hearts. Returns true if successful. */
export function refillHeartsWithExp(): boolean {
  const u = getUser();
  if (!u || u.exp < HEART_REFILL_COST) return false;
  u.exp -= HEART_REFILL_COST;
  u.expHistory.push({ source: "Refill Hearts", amount: -HEART_REFILL_COST, date: new Date().toISOString() });
  saveUser(u);
  writeHeartsRaw({ hearts: MAX_HEARTS, updatedAt: new Date().toISOString() });
  window.dispatchEvent(new Event("storage"));
  return true;
}

// =====================================================
// PATH PROGRESS (per-bab)
// =====================================================
function readPath(): Record<string, PathProgressEntry> {
  try { return JSON.parse(localStorage.getItem(PATH_PROGRESS_KEY) || "{}"); }
  catch { return {}; }
}
function writePath(map: Record<string, PathProgressEntry>) {
  localStorage.setItem(PATH_PROGRESS_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event("kitabify:path"));
}

export function getBabProgress(babId: string): PathProgressEntry {
  return readPath()[babId] || { read: false, score: 0 };
}

export function markBabRead(loc: { kitabId: string; jilidId: string; babId: string }) {
  const map = readPath();
  const cur = map[loc.babId] || { read: false, score: 0 };
  if (!cur.read) {
    cur.read = true;
    cur.completedAt = cur.completedAt || new Date().toISOString();
    map[loc.babId] = cur;
    writePath(map);
    syncProgressToCloud(loc, cur).catch(() => {});
  }
}

export function recordBabQuizScore(
  loc: { kitabId: string; jilidId: string; babId: string },
  score: number,
) {
  const map = readPath();
  const cur = map[loc.babId] || { read: false, score: 0 };
  cur.score = Math.max(cur.score, score);
  if (cur.score >= 7 && !cur.completedAt) cur.completedAt = new Date().toISOString();
  map[loc.babId] = cur;
  writePath(map);
  syncProgressToCloud(loc, cur).catch(() => {});
}

// =====================================================
// CHESTS (one per jilid)
// =====================================================
function readChests(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(CHEST_KEY) || "{}"); }
  catch { return {}; }
}
export function isChestOpened(jilidId: string): boolean {
  return !!readChests()[jilidId];
}
export function openChest(jilidId: string) {
  const m = readChests();
  m[jilidId] = new Date().toISOString();
  localStorage.setItem(CHEST_KEY, JSON.stringify(m));
  window.dispatchEvent(new Event("kitabify:chest"));
}

// =====================================================
// CLOUD SYNC (best-effort, fire-and-forget)
// =====================================================
async function getUserId(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

async function syncHeartsToCloud(s: HeartsState) {
  const uid = await getUserId();
  if (!uid) return;
  await supabase.from("user_streak").upsert(
    { user_id: uid, hearts: s.hearts, hearts_updated_at: s.updatedAt },
    { onConflict: "user_id" },
  );
}

async function syncProgressToCloud(
  loc: { kitabId: string; jilidId: string; babId: string },
  entry: PathProgressEntry,
) {
  const uid = await getUserId();
  if (!uid) return;
  await supabase.from("user_progress").upsert(
    {
      user_id: uid,
      kitab_id: loc.kitabId,
      jilid_id: loc.jilidId,
      bab_id: loc.babId,
      read: entry.read,
      best_quiz_score: entry.score,
      completed_at: entry.completedAt ?? null,
    },
    { onConflict: "user_id,bab_id" },
  );
}

/** Sync XP/level snapshot to cloud (call from addExp wrappers). */
export async function syncXpToCloud() {
  const uid = await getUserId();
  if (!uid) return;
  const u = getUser();
  if (!u) return;
  await supabase.from("user_xp").upsert(
    { user_id: uid, total_xp: u.exp, level: u.level, lifetime_xp: u.exp },
    { onConflict: "user_id" },
  );
}

/** Sync streak snapshot. */
export async function syncStreakToCloud() {
  const uid = await getUserId();
  if (!uid) return;
  const u = getUser();
  if (!u) return;
  await supabase.from("user_streak").upsert(
    {
      user_id: uid,
      current_streak: u.streak,
      longest_streak: u.streak,
      last_claim_date: new Date().toISOString().slice(0, 10),
    },
    { onConflict: "user_id" },
  );
}

/** Pull cloud snapshots into local cache on app boot. */
export async function hydrateFromCloud() {
  const uid = await getUserId();
  if (!uid) return;
  try {
    const [{ data: progress }, { data: streak }] = await Promise.all([
      supabase.from("user_progress").select("*").eq("user_id", uid),
      supabase.from("user_streak").select("*").eq("user_id", uid).maybeSingle(),
    ]);
    if (progress?.length) {
      const local = readPath();
      for (const row of progress) {
        const existing = local[row.bab_id];
        const remote: PathProgressEntry = {
          read: row.read,
          score: row.best_quiz_score,
          completedAt: row.completed_at ?? undefined,
        };
        // Local-first: prefer the better of the two
        local[row.bab_id] = {
          read: (existing?.read || remote.read),
          score: Math.max(existing?.score || 0, remote.score),
          completedAt: existing?.completedAt || remote.completedAt,
        };
      }
      localStorage.setItem(PATH_PROGRESS_KEY, JSON.stringify(local));
      window.dispatchEvent(new Event("kitabify:path"));
    }
    if (streak) {
      writeHeartsRaw({ hearts: streak.hearts, updatedAt: streak.hearts_updated_at });
    }
  } catch { /* ignore */ }
}
