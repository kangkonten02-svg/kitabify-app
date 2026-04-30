import { motion } from "framer-motion";
import { getUser, getLevelTitle, getExpToNextLevel } from "@/lib/store";
import { MATERI_DATA } from "@/lib/materiData";
import { BookOpen, TrendingUp, Flame, ChevronRight } from "lucide-react";
import PrayerTimesCard from "./PrayerTimesCard";
import SubscriptionBanner from "./SubscriptionBanner";

interface DashboardPageProps {
  onGoMateri: (kitabId?: string) => void;
}

const DashboardPage = ({ onGoMateri }: DashboardPageProps) => {
  const user = getUser();
  if (!user) return null;

  const { current, needed } = getExpToNextLevel(user.exp);
  const progressPct = (current / needed) * 100;
  const totalMateri = MATERI_DATA.reduce((sum, k) => sum + k.jilids.reduce((s, j) => s + j.babs.length, 0), 0);
  const learned = Object.keys(user.materiProgress).length;
  const totalPct = totalMateri > 0 ? Math.round((learned / totalMateri) * 100) : 0;

  const lastMateri = Object.keys(user.materiProgress).pop();

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <p className="text-muted-foreground text-sm">Assalamualaikum 👋</p>
        <h1 className="text-2xl font-extrabold text-foreground">{user.name}</h1>
      </motion.div>

      {/* Level Card */}
      <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.05 }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground">Level {user.level}</p>
            <h3 className="text-lg font-bold text-foreground">{getLevelTitle(user.level)}</h3>
          </div>
          <div className="gold-badge px-3 py-1.5 rounded-full text-xs">
            {user.exp} EXP
          </div>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">{current}/{needed} EXP menuju level berikutnya</p>
      </motion.div>

      {/* Subscription banner */}
      <SubscriptionBanner />

      {/* Prayer Times */}
      <PrayerTimesCard />

      {/* Two cards side by side */}
      <div className="grid grid-cols-2 gap-3">
        {/* Last Materi */}
        <motion.div
          className="glass-card p-4 flex flex-col justify-between"
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
        >
          <BookOpen className="text-primary mb-2" size={20} />
          <p className="text-xs text-muted-foreground">Terakhir dipelajari</p>
          <p className="text-sm font-semibold text-foreground mt-1 line-clamp-2">
            {lastMateri ? lastMateri.replace(/_/g, " ") : "Belum ada"}
          </p>
          <button
            onClick={() => onGoMateri()}
            className="mt-3 text-xs text-primary font-semibold flex items-center gap-1"
          >
            Lanjutkan <ChevronRight size={14} />
          </button>
        </motion.div>

        {/* Progress */}
        <motion.div
          className="glass-card p-4 flex flex-col justify-between"
          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
        >
          <TrendingUp className="text-primary mb-2" size={20} />
          <p className="text-xs text-muted-foreground">Progress Belajar</p>
          <p className="text-3xl font-extrabold text-foreground mt-1">{totalPct}%</p>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
            <div className="h-full bg-primary rounded-full" style={{ width: `${totalPct}%` }} />
          </div>
        </motion.div>
      </div>

      {/* Streak */}
      <motion.div
        className="glass-card p-4 flex items-center gap-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
      >
        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
          <Flame className="text-orange-400" size={24} />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">{user.streak} Hari Berturut-turut 🔥</p>
          <p className="text-xs text-muted-foreground">Terus semangat belajar!</p>
        </div>
      </motion.div>

      {/* Materi Populer */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-3">🔥 Materi Populer</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {MATERI_DATA.map((kitab) => (
            <motion.button
              key={kitab.id}
              onClick={() => onGoMateri(kitab.id)}
              className="glass-card p-4 min-w-[140px] flex-shrink-0 text-left"
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-3xl">{kitab.icon}</span>
              <p className="text-sm font-bold text-foreground mt-2">{kitab.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{kitab.jilids.length} jilid</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
