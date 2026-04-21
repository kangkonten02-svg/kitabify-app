// Prayer times utility for Indonesia (WIB/WITA/WIT)
export type PrayerName = "Subuh" | "Dzuhur" | "Ashar" | "Maghrib" | "Isya";

export interface PrayerTime {
  name: PrayerName;
  time: string; // HH:MM
  date: Date;
}

export interface PrayerSchedule {
  times: PrayerTime[];
  zone: "WIB" | "WITA" | "WIT";
  city: string;
  date: string;
}

// Default coordinates for major Indonesian cities by zone
const ZONE_DEFAULTS = {
  WIB: { lat: -6.2088, lon: 106.8456, city: "Jakarta", offset: 7 },
  WITA: { lat: -8.6705, lon: 115.2126, city: "Denpasar", offset: 8 },
  WIT: { lat: -2.5916, lon: 140.6690, city: "Jayapura", offset: 9 },
};

export function detectZone(lon: number): "WIB" | "WITA" | "WIT" {
  // Indonesia: WIB <= 112.5, WITA 112.5–127.5, WIT > 127.5
  if (lon < 112.5) return "WIB";
  if (lon < 127.5) return "WITA";
  return "WIT";
}

interface CachedSchedule {
  schedule: PrayerSchedule;
  fetchedAt: number;
}

const CACHE_KEY = "kitabify_prayer_cache";

function loadCache(): Record<string, CachedSchedule> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveCache(c: Record<string, CachedSchedule>) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(c));
}

export async function getCoordinates(): Promise<{ lat: number; lon: number } | null> {
  if (!("geolocation" in navigator)) return null;
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 5000, maximumAge: 60 * 60 * 1000 }
    );
  });
}

export async function fetchPrayerTimes(
  lat: number,
  lon: number,
  zone: "WIB" | "WITA" | "WIT"
): Promise<PrayerSchedule> {
  const today = new Date();
  const dateStr = `${today.getDate().toString().padStart(2, "0")}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getFullYear()}`;
  const cacheKey = `${zone}_${dateStr}_${lat.toFixed(2)}_${lon.toFixed(2)}`;

  const cache = loadCache();
  if (cache[cacheKey]) {
    const cached = cache[cacheKey].schedule;
    // Rehydrate Date objects (lost during JSON serialization)
    return {
      ...cached,
      times: cached.times.map((p) => ({ ...p, date: new Date(p.date) })),
    };
  }

  // Aladhan API — method 20 = Kemenag Indonesia
  const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=20`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch prayer times");
  const data = await res.json();
  const t = data.data.timings;

  const buildDate = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    const d = new Date(today);
    d.setHours(h, m, 0, 0);
    return d;
  };

  const times: PrayerTime[] = [
    { name: "Subuh", time: t.Fajr.slice(0, 5), date: buildDate(t.Fajr) },
    { name: "Dzuhur", time: t.Dhuhr.slice(0, 5), date: buildDate(t.Dhuhr) },
    { name: "Ashar", time: t.Asr.slice(0, 5), date: buildDate(t.Asr) },
    { name: "Maghrib", time: t.Maghrib.slice(0, 5), date: buildDate(t.Maghrib) },
    { name: "Isya", time: t.Isha.slice(0, 5), date: buildDate(t.Isha) },
  ];

  const schedule: PrayerSchedule = {
    times,
    zone,
    city: ZONE_DEFAULTS[zone].city,
    date: dateStr,
  };

  cache[cacheKey] = { schedule, fetchedAt: Date.now() };
  saveCache(cache);
  return schedule;
}

export async function loadPrayerSchedule(): Promise<PrayerSchedule> {
  const coords = await getCoordinates();
  if (coords) {
    const zone = detectZone(coords.lon);
    try {
      return await fetchPrayerTimes(coords.lat, coords.lon, zone);
    } catch {
      // fall through to default
    }
  }
  // Fallback: WIB Jakarta
  const def = ZONE_DEFAULTS.WIB;
  return fetchPrayerTimes(def.lat, def.lon, "WIB");
}

export function getNextPrayer(schedule: PrayerSchedule, now = new Date()): {
  next: PrayerTime;
  isNow: boolean; // within 1 minute of prayer time
  minutesUntil: number;
} {
  const upcoming = schedule.times.find((p) => p.date.getTime() > now.getTime());
  if (upcoming) {
    const diffMs = upcoming.date.getTime() - now.getTime();
    const minutesUntil = Math.floor(diffMs / 60000);
    // "isNow" if we just crossed the prayer time within the last minute (handled separately)
    return { next: upcoming, isNow: false, minutesUntil };
  }
  // Past Isya — next is tomorrow's Subuh (approximate using today's Subuh + 24h)
  const subuh = schedule.times[0];
  const tomorrowSubuh: PrayerTime = {
    ...subuh,
    date: new Date(subuh.date.getTime() + 24 * 60 * 60 * 1000),
  };
  const diffMs = tomorrowSubuh.date.getTime() - now.getTime();
  return { next: tomorrowSubuh, isNow: false, minutesUntil: Math.floor(diffMs / 60000) };
}

export function getCurrentPrayerIfActive(
  schedule: PrayerSchedule,
  now = new Date(),
  windowSec = 60
): PrayerTime | null {
  // Returns a prayer if "now" is within `windowSec` AFTER its time
  for (const p of schedule.times) {
    const diff = (now.getTime() - p.date.getTime()) / 1000;
    if (diff >= 0 && diff <= windowSec) return p;
  }
  return null;
}

export function formatCountdown(minutes: number): string {
  if (minutes < 1) return "kurang dari 1 menit";
  if (minutes < 60) return `${minutes} menit lagi`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} jam lagi` : `${h} jam ${m} menit lagi`;
}
