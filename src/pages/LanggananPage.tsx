import { motion } from "framer-motion";
import { Crown, Check, ArrowLeft, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";

// Nomor WhatsApp admin Kitabify
const ADMIN_WA = "6285831878561";

const PLANS = [
  {
    tier: "VIP" as const,
    name: "VIP",
    price: "Rp 150.000",
    period: "/ 6 bulan",
    color: "from-primary to-primary/60",
    features: [
      "Akses semua kitab Amtsilati Jilid 1-5",
      "Qoidati, Tatimah, Shorofiyah",
      "Kholasoh Alfiyah, Jurumiyah",
      "Safinah & Tijan",
      "Audio quiz lengkap",
    ],
  },
  {
    tier: "VVIP" as const,
    name: "VVIP",
    price: "Rp 250.000",
    period: "/ 1 tahun",
    color: "from-amber-500 to-amber-300",
    features: [
      "Semua benefit VIP",
      "Akses penuh tanpa batas 1 tahun",
      "Prioritas update materi baru",
      "Trial 7 hari saat pertama daftar",
      "Hemat dibanding paket VIP",
    ],
    highlighted: true,
  },
];

const LanggananPage = () => {
  const navigate = useNavigate();
  const { active } = useSubscription();

  const handleSubscribe = (tier: "VIP" | "VVIP", price: string) => {
    const text = encodeURIComponent(`Halo min aku mau upgrade Akun menjadi ${tier}`);
    window.open(`https://wa.me/${ADMIN_WA}?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background bg-texture pb-12">
      <div className="max-w-lg mx-auto px-4 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground"
        >
          <ArrowLeft size={20} /> Kembali
        </button>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold text-foreground">Pilih Paket</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Buka akses penuh ke semua kitab Kitabify
          </p>
        </motion.div>

        {active.source !== "free" && active.daysLeft !== null && (
          <motion.div
            className="mt-4 glass-card p-3 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Crown className="text-primary" size={18} />
            <p className="text-xs text-foreground">
              Status saat ini: <strong>{active.effectiveTier}</strong> ·{" "}
              {active.source === "trial" ? "trial" : "berbayar"} · sisa{" "}
              {active.daysLeft} hari
            </p>
          </motion.div>
        )}

        <div className="space-y-4 mt-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.tier}
              className={`glass-card p-5 relative overflow-hidden ${
                plan.highlighted ? "ring-2 ring-amber-500/50" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {plan.highlighted && (
                <div className="absolute top-3 right-3 text-[10px] font-bold bg-amber-500 text-amber-950 px-2 py-0.5 rounded-full">
                  TERBAIK
                </div>
              )}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-3`}
              >
                <Crown className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-extrabold text-foreground">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-1 mb-4">
                <span className="text-2xl font-bold text-primary">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <Check size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.tier, plan.price)}
                className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
              >
                <MessageCircle size={18} />
                Hubungi Admin via WhatsApp
              </button>
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Pembayaran manual via transfer. Setelah konfirmasi, paket akan diaktifkan
          oleh admin.
        </p>
      </div>
    </div>
  );
};

export default LanggananPage;
