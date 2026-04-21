import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Sunset, Sunrise, CloudMoon, MapPin } from "lucide-react";
import { toast } from "sonner";
import {
  loadPrayerSchedule,
  getNextPrayer,
  getCurrentPrayerIfActive,
  formatCountdown,
  type PrayerSchedule,
  type PrayerName,
} from "@/lib/prayerTimes";

const PRAYER_ICONS: Record<PrayerName, typeof Sun> = {
  Subuh: Sunrise,
  Dzuhur: Sun,
  Ashar: CloudMoon,
  Maghrib: Sunset,
  Isya: Moon,
};

const NOTIFIED_KEY = "kitabify_prayer_notified";

const PrayerTimesCard = () => {
  const [schedule, setSchedule] = useState<PrayerSchedule | null>(null);
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;
    loadPrayerSchedule()
      .then((s) => {
        if (mounted) setSchedule(s);
      })
      .catch(() => {
        if (mounted) toast.error("Gagal memuat jadwal sholat");
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  // Tick every 15s for countdown + check active prayer
  useEffect(() => {
    tickRef.current = window.setInterval(() => setNow(new Date()), 15000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  // Notification check
  useEffect(() => {
    if (!schedule) return;
    const active = getCurrentPrayerIfActive(schedule, now, 90);
    if (!active) return;
    const key = `${schedule.date}_${active.name}`;
    const notified: string[] = JSON.parse(localStorage.getItem(NOTIFIED_KEY) || "[]");
    if (notified.includes(key)) return;
    notified.push(key);
    localStorage.setItem(NOTIFIED_KEY, JSON.stringify(notified.slice(-20)));
    toast.success(`SAATNYA SHOLAT ${active.name.toUpperCase()}`, {
      description: `Pukul ${active.time} ${schedule.zone} — Mari tunaikan sholat 🕌`,
      duration: 10000,
    });
  }, [now, schedule]);

  if (loading) {
    return (
      <div className="glass-card p-4 animate-pulse">
        <div className="h-4 w-32 bg-muted rounded mb-2" />
        <div className="h-6 w-40 bg-muted rounded" />
      </div>
    );
  }

  if (!schedule) return null;

  const { next, minutesUntil } = getNextPrayer(schedule, now);
  const Icon = PRAYER_ICONS[next.name];

  return (
    <motion.div
      className="glass-card p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin size={12} />
          <span>{schedule.city} · {schedule.zone}</span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
          <Icon className="text-accent" size={24} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Sholat selanjutnya</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={next.name}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-base font-bold text-foreground"
            >
              Sholat {next.name} · {next.time} {schedule.zone}
            </motion.p>
          </AnimatePresence>
          <p className="text-xs text-primary font-semibold mt-0.5">
            {formatCountdown(minutesUntil)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1.5 pt-3 border-t border-border/50">
        {schedule.times.map((p) => {
          const isNext = p.name === next.name;
          const isPast = p.date.getTime() < now.getTime();
          return (
            <div
              key={p.name}
              className={`flex flex-col items-center text-center py-1.5 rounded-lg transition-colors ${
                isNext ? "bg-accent/15" : ""
              }`}
            >
              <span
                className={`text-[10px] font-medium ${
                  isNext ? "text-accent" : isPast ? "text-muted-foreground/60" : "text-muted-foreground"
                }`}
              >
                {p.name}
              </span>
              <span
                className={`text-xs font-bold mt-0.5 ${
                  isNext ? "text-accent" : isPast ? "text-muted-foreground/60" : "text-foreground"
                }`}
              >
                {p.time}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PrayerTimesCard;
