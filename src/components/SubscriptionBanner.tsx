import { motion } from "framer-motion";
import { Crown, Sparkles, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";

const SubscriptionBanner = () => {
  const navigate = useNavigate();
  const { active, loading } = useSubscription();

  if (loading) return null;

  // Active VIP/VVIP — show compact status
  if (active.source !== "free" && active.daysLeft !== null) {
    const isVVIP = active.effectiveTier === "VVIP";
    const isTrial = active.source === "trial";
    return (
      <motion.div
        className="glass-card p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isVVIP ? "bg-amber-500/20 text-amber-400" : "bg-primary/20 text-primary"
            }`}
          >
            <Crown size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">
              {isTrial ? "Trial aktif" : "Paket aktif"}
            </p>
            <p className="text-sm font-bold text-foreground">
              {active.effectiveTier} · {active.daysLeft} hari lagi
            </p>
          </div>
          {isTrial && (
            <button
              onClick={() => navigate("/langganan")}
              className="text-xs font-semibold text-primary px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors flex-shrink-0"
            >
              Berlangganan
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  // FREE — show upsell
  return (
    <motion.button
      onClick={() => navigate("/langganan")}
      className="w-full glass-card p-4 text-left relative overflow-hidden group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
      <div className="flex items-center gap-3 relative">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
          <Sparkles className="text-primary-foreground" size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground">Buka semua kitab</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock size={11} /> Trial habis — upgrade ke VIP/VVIP
          </p>
        </div>
        <ArrowRight className="text-primary" size={18} />
      </div>
    </motion.button>
  );
};

export default SubscriptionBanner;
