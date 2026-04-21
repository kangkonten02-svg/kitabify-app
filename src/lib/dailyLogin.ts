// Daily Login reward system (WIB / GMT+7)
// - Streak advances once per WIB day.
// - Missing a day resets streak to 1.
// - Rewards: day 1=10 EXP, day 2=25 EXP, ... (see REWARDS table)
// - Milestones: day 7 => +30 EXP bonus + 1 day VIP
//               day 14 => +90 EXP bonus + 2 days VIP
//               day 30 => +180 EXP bonus + 7 days VIP
// VIP bonus is stored locally (kitabify_vip_bonus) and merged with the real
// subscription via computeActive() — no DB changes required.

import { addExp, getUser, saveUser } from "./store";

const STORAGE_KEY = "kitabify_daily_login";
export const VIP_BONUS_KEY = "kitabify_vip_bonus";

export interface DailyLoginState {
  streak: number;
  lastClaimedWIBDate: string; // YYYY-MM-DD in WIB
}

export interface DailyReward {
  day: number;           // streak day (1..30, capped at 30 for display)
  exp: number;           // base EXP for that day
  bonusExp: number;      // milestone bonus EXP (0 if none)
  vipDays: number;       // milestone VIP days (0 if none)
  totalExp: number;      // exp + bonusExp
  isMilestone: boolean;
}

// Get current date in WIB (GMT+7) as YYYY-MM-DD
export function getWIBDateString(date: Date = new Date()): string {
  const wib = new Date(date.getTime() + (7 * 60 - date.getTimezoneOffset()) * 60000);
  const y = wib.getUTCFullYear();
  const m = String(wib.getUTCMonth() + 1).padStart(2, "0");
  const d = String(wib.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function daysBetweenWIB(a: string, b: string): number {
  const da = new Date(`${a}T00:00:00Z`).getTime();
  const db = new Date(`${b}T00:00:00Z`).getTime();
  return Math.round((db - da) / 86400000);
}

function loadState(): DailyLoginState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as DailyLoginState : null;
  } catch { return null; }
}

function saveState(s: DailyLoginState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

// Base EXP per day (1..30). Day 1=10, Day 2=25, then +15 per day capped at 200.
function baseExpForDay(day: number): number {
  if (day <= 1) return 10;
  if (day === 2) return 25;
  // Progressive growth
  const val = 25 + (day - 2) * 15;
  return Math.min(val, 200);
}

function milestoneFor(day: number): { bonusExp: number; vipDays: number } {
  if (day === 7) return { bonusExp: 30, vipDays: 1 };
  if (day === 14) return { bonusExp: 90, vipDays: 2 };
  if (day === 30) return { bonusExp: 180, vipDays: 7 };
  return { bonusExp: 0, vipDays: 0 };
}

export function computeRewardForDay(day: number): DailyReward {
  const capped = Math.max(1, Math.min(day, 30));
  const exp = baseExpForDay(capped);
  const { bonusExp, vipDays } = milestoneFor(capped);
  return {
    day: capped,
    exp,
    bonusExp,
    vipDays,
    totalExp: exp + bonusExp,
    isMilestone: bonusExp > 0 || vipDays > 0,
  };
}

// Preview all 30 days
export function getRewardSchedule(): DailyReward[] {
  return Array.from({ length: 30 }, (_, i) => computeRewardForDay(i + 1));
}

// Add VIP bonus days to localStorage (stacking on existing bonus)
function addVipBonusDays(days: number) {
  if (days <= 0) return;
  try {
    const raw = localStorage.getItem(VIP_BONUS_KEY);
    const now = Date.now();
    const current = raw ? new Date(raw).getTime() : 0;
    const base = current > now ? current : now;
    const next = new Date(base + days * 86400000);
    localStorage.setItem(VIP_BONUS_KEY, next.toISOString());
  } catch {}
}

export function getActiveVipBonusExpiry(): Date | null {
  try {
    const raw = localStorage.getItem(VIP_BONUS_KEY);
    if (!raw) return null;
    const d = new Date(raw);
    return d.getTime() > Date.now() ? d : null;
  } catch { return null; }
}

export interface ClaimResult {
  claimed: boolean;        // true if a reward was granted in this call
  reward: DailyReward;
  streak: number;          // resulting streak
  alreadyClaimedToday: boolean;
}

// Call on app entry. Grants reward only if WIB date changed since last claim.
export function checkAndClaimDailyLogin(): ClaimResult {
  const today = getWIBDateString();
  const state = loadState();

  if (state && state.lastClaimedWIBDate === today) {
    return {
      claimed: false,
      reward: computeRewardForDay(state.streak),
      streak: state.streak,
      alreadyClaimedToday: true,
    };
  }

  let newStreak = 1;
  if (state) {
    const diff = daysBetweenWIB(state.lastClaimedWIBDate, today);
    if (diff === 1) newStreak = state.streak + 1;
    else newStreak = 1; // reset on gap or clock anomaly
  }

  const reward = computeRewardForDay(newStreak);

  // Persist state
  saveState({ streak: newStreak, lastClaimedWIBDate: today });

  // Grant EXP
  addExp(reward.totalExp, `Daily Login Hari ${reward.day}`);

  // Update user streak field for display consistency
  const u = getUser();
  if (u) {
    u.streak = newStreak;
    u.lastLogin = new Date().toISOString();
    saveUser(u);
  }

  // Grant VIP days if milestone
  if (reward.vipDays > 0) addVipBonusDays(reward.vipDays);

  return { claimed: true, reward, streak: newStreak, alreadyClaimedToday: false };
}

export function getCurrentStreak(): number {
  const state = loadState();
  if (!state) return 0;
  const today = getWIBDateString();
  const diff = daysBetweenWIB(state.lastClaimedWIBDate, today);
  if (diff === 0) return state.streak;
  if (diff === 1) return state.streak; // not yet claimed today but still on track
  return 0; // broken
}