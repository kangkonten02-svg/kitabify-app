// Simple state management with localStorage
export interface User {
  name: string;
  city: string;
  institution: string;
  phone: string;
  email: string;
  exp: number;
  level: number;
  streak: number;
  lastLogin: string;
  achievements: string[];
  materiProgress: Record<string, number>;
  quizScores: Record<string, number>;
  expHistory: { source: string; amount: number; date: string }[];
  photo?: string;
}

const DEFAULT_USER: User = {
  name: "", city: "", institution: "", phone: "", email: "",
  exp: 0, level: 1, streak: 0, lastLogin: "",
  achievements: [], materiProgress: {}, quizScores: {}, expHistory: [],
};

export function getUser(): User | null {
  const d = localStorage.getItem("kitabify_user");
  return d ? JSON.parse(d) : null;
}

export function saveUser(u: User) {
  localStorage.setItem("kitabify_user", JSON.stringify(u));
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem("kitabify_user");
}

export function logout() {
  localStorage.removeItem("kitabify_user");
}

export function addExp(amount: number, source: string) {
  const u = getUser();
  if (!u) return;
  u.exp += amount;
  u.expHistory.push({ source, amount, date: new Date().toISOString() });
  // Level up every 100 EXP
  u.level = Math.floor(u.exp / 100) + 1;
  saveUser(u);
  // Best-effort cloud sync for the new XP table (extends, never replaces).
  // Lazy import to avoid circular deps with gamification.ts.
  import("./gamification").then((m) => m.syncXpToCloud()).catch(() => {});
}

export function getLevelTitle(level: number): string {
  if (level <= 2) return "Santri Pemula";
  if (level <= 5) return "Santri Aktif";
  if (level <= 10) return "Santri Rajin";
  if (level <= 20) return "Santri Mahir";
  return "Ahli Kitab";
}

export function getExpToNextLevel(exp: number): { current: number; needed: number } {
  const current = exp % 100;
  return { current, needed: 100 };
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const ALL_BADGES: Badge[] = [
  { id: "pemula", name: "Santri Pemula", icon: "🟢", description: "Login pertama kali", color: "from-primary to-emerald-600" },
  { id: "rajin", name: "Rajin Belajar", icon: "📚", description: "Akses materi 5 kali", color: "from-blue-500 to-blue-700" },
  { id: "konsisten", name: "Konsisten", icon: "🔥", description: "Belajar 7 hari berturut-turut", color: "from-orange-500 to-red-600" },
  { id: "master_nahwu", name: "Master Nahwu", icon: "🧠", description: "Lulus semua kuis Jilid 1", color: "from-purple-500 to-purple-700" },
  { id: "cepat", name: "Cepat Tanggap", icon: "⚡", description: "Jawab cepat di kuis", color: "from-yellow-400 to-amber-600" },
  { id: "ahli", name: "Ahli Kitab", icon: "🏆", description: "Mencapai level tinggi", color: "from-gold to-gold-light" },
];
