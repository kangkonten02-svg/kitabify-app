import { motion, AnimatePresence } from "framer-motion";
import { Flame, Crown, Zap, Gift, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getRewardSchedule, type DailyReward } from "@/lib/dailyLogin";

interface DailyLoginModalProps {
  open: boolean;
  streak: number;
  reward: DailyReward;
  onClose: () => void;
}

const DailyLoginModal = ({ open, streak, reward, onClose }: DailyLoginModalProps) => {
  const [schedule] = useState(() => getRewardSchedule());
  const currentDay = Math.max(1, Math.min(streak, 30));

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-card w-full max-w-sm p-6 relative overflow-hidden"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition"
              aria-label="Tutup"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="text-center mb-4">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/30 to-red-500/20 mb-3"
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Flame className="text-orange-400" size={32} />
              </motion.div>
              <h2 className="text-xl font-extrabold text-foreground">Daily Login</h2>
              <p className="text-sm text-muted-foreground">
                Hari ke-<span className="text-primary font-bold">{currentDay}</span> · Streak {streak} 🔥
              </p>
            </div>

            {/* Reward summary */}
            <motion.div
              className="rounded-2xl p-4 mb-4 bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Zap className="text-primary" size={22} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Kamu mendapatkan</p>
                  <p className="text-lg font-extrabold text-foreground">
                    +{reward.totalExp} EXP
                  </p>
                  {reward.bonusExp > 0 && (
                    <p className="text-xs text-primary">
                      termasuk bonus +{reward.bonusExp} EXP milestone
                    </p>
                  )}
                </div>
              </div>
              {reward.vipDays > 0 && (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-gold/15 border border-gold/30 px-3 py-2">
                  <Crown className="text-gold" size={18} />
                  <p className="text-sm font-bold text-foreground">
                    +{reward.vipDays} hari VIP GRATIS 🎉
                  </p>
                </div>
              )}
            </motion.div>

            {/* 30-day grid */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                <Gift size={12} /> Jadwal 30 hari
              </p>
              <div className="grid grid-cols-7 gap-1.5 max-h-48 overflow-y-auto scrollbar-hide">
                {schedule.map((r) => {
                  const isPast = r.day < currentDay;
                  const isToday = r.day === currentDay;
                  return (
                    <div
                      key={r.day}
                      className={`relative aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] border transition ${
                        isToday
                          ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                          : isPast
                            ? "bg-primary/10 text-foreground border-primary/20"
                            : r.isMilestone
                              ? "bg-gold/10 text-foreground border-gold/40"
                              : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {isPast && (
                        <Check size={10} className="absolute top-0.5 right-0.5 text-primary" />
                      )}
                      {r.isMilestone && !isPast && (
                        <Crown size={10} className="absolute top-0.5 right-0.5 text-gold" />
                      )}
                      <span className="font-bold leading-none">{r.day}</span>
                      <span className="leading-none mt-0.5">{r.totalExp}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                Reset setiap hari jam 00:00 WIB · Lewatkan satu hari = streak reset
              </p>
            </div>

            <motion.button
              onClick={onClose}
              whileTap={{ scale: 0.97 }}
              className="w-full mt-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg"
            >
              Mantap, lanjut belajar!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DailyLoginModal;