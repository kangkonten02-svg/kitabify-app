import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { Share2, Download, RotateCcw, Trophy, Copy, Check } from "lucide-react";
import { getBadge, shareResult } from "@/lib/shareUtils";
import { getUser } from "@/lib/store";

interface ShareResultCardProps {
  title: string;
  score: number;
  total: number;
  mcScore: number;
  mcTotal: number;
  essayExp: number;
  totalExp: number;
  essayResults?: { correct: boolean; userAnswer: string; correctAnswer: string }[];
  onRetry: () => void;
  onBack: () => void;
}

const ShareResultCard = ({
  title, score, total, mcScore, mcTotal, essayExp, totalExp,
  essayResults, onRetry, onBack,
}: ShareResultCardProps) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);
  const badge = getBadge(mcScore, mcTotal);
  const user = getUser();
  const materiUrl = `https://kitabifyapps.lovable.app`;

  const handleShare = async () => {
    const success = await shareResult(title, mcScore, mcTotal, materiUrl);
    if (success && !navigator.share) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadCert = useCallback(async () => {
    if (!certRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(certRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#0a1f14",
      });
      const link = document.createElement("a");
      link.download = `Kitabify-${title.replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Failed to generate certificate:", e);
    }
    setDownloading(false);
  }, [downloading, title]);

  const pct = Math.round((mcScore / mcTotal) * 100);

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      {/* Main Result Card */}
      <motion.div
        className="glass-card p-6 text-center mb-4"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <Trophy className="mx-auto mb-3 text-gold" size={52} />
        </motion.div>

        <h2 className="text-xl font-extrabold text-foreground mb-1">🎉 Selamat!</h2>
        <p className="text-sm text-muted-foreground mb-4">Kamu telah menyelesaikan kuis</p>

        {/* Badge */}
        <motion.div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${badge.color} text-background font-bold text-sm mb-4`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-lg">{badge.emoji}</span>
          <span>{badge.label}</span>
        </motion.div>

        {/* Score Display */}
        <motion.div
          className="mb-4"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-5xl font-extrabold text-primary">{pct}%</p>
          <p className="text-sm text-muted-foreground mt-1">{mcScore}/{mcTotal} benar</p>
        </motion.div>

        {/* Quiz Title */}
        <div className="glass-card p-3 mb-4">
          <p className="text-xs text-muted-foreground">📚 Materi</p>
          <p className="font-bold text-foreground text-sm">{title}</p>
        </div>

        {/* MC + Essay Breakdown */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="glass-card p-3">
            <p className="text-xs text-muted-foreground">📝 Pilihan Ganda</p>
            <p className="text-lg font-extrabold text-primary">{mcScore}/{mcTotal}</p>
          </div>
          {essayResults && essayResults.length > 0 && (
            <div className="glass-card p-3">
              <p className="text-xs text-muted-foreground">✍️ Essay</p>
              <p className="text-lg font-extrabold text-primary">+{essayExp} EXP</p>
            </div>
          )}
        </div>

        {/* Essay Detail */}
        {essayResults && essayResults.length > 0 && (
          <div className="glass-card p-3 mb-4 text-left">
            <p className="text-xs text-muted-foreground mb-2">Detail Essay</p>
            <div className="space-y-1">
              {essayResults.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  {r.correct
                    ? <span className="text-primary">✅</span>
                    : <span className="text-destructive">❌</span>}
                  <span className="text-muted-foreground">Soal {i + 1}</span>
                  {!r.correct && <span className="text-primary text-xs" dir="rtl">→ {r.correctAnswer}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total EXP */}
        <div className="glass-card p-3 mb-5">
          <p className="text-xs text-muted-foreground">Total EXP</p>
          <p className="text-2xl font-extrabold text-primary">+{totalExp}</p>
        </div>

        <p className="text-muted-foreground text-xs mb-4">
          {pct === 100 ? "Sempurna! 🌟" : pct >= 80 ? "Luar biasa! 🔥" : pct >= 60 ? "Bagus! 👏" : "Terus belajar! 💪"}
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <motion.button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-accent-foreground font-bold text-sm"
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={16} />
            Ulangi
          </motion.button>
          <motion.button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm"
            whileTap={{ scale: 0.95 }}
          >
            {copied ? <><Check size={16} /> Tersalin!</> : <><Share2 size={16} /> Share</>}
          </motion.button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <motion.button
            onClick={handleDownloadCert}
            disabled={downloading}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-foreground font-bold text-sm disabled:opacity-50"
            whileTap={{ scale: 0.95 }}
          >
            <Download size={16} />
            {downloading ? "..." : "Sertifikat"}
          </motion.button>
          <motion.button
            onClick={onBack}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-foreground font-bold text-sm"
            whileTap={{ scale: 0.95 }}
          >
            Kembali
          </motion.button>
        </div>

        <p className="text-xs text-muted-foreground mt-4">📣 Ajak teman belajar bareng!</p>
      </motion.div>

      {/* Hidden Certificate for Screenshot */}
      <div className="fixed -left-[9999px] top-0">
        <div
          ref={certRef}
          style={{
            width: 600,
            height: 400,
            background: "linear-gradient(135deg, #0a1f14, #0d2a1a, #122e1e)",
            padding: 40,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative border */}
          <div style={{
            position: "absolute", inset: 12, border: "2px solid rgba(74, 222, 128, 0.3)",
            borderRadius: 16,
          }} />

          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
            SERTIFIKAT KUIS
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
            📚 Kitabify
          </div>
          <div style={{
            fontSize: 16, color: "rgba(255,255,255,0.7)", marginBottom: 20,
            textAlign: "center", maxWidth: 400,
          }}>
            {title}
          </div>

          {user?.name && (
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: "#4ade80" }}>
              {user.name}
            </div>
          )}

          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginBottom: 16,
          }}>
            <span style={{ fontSize: 36 }}>{badge.emoji}</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#4ade80" }}>
                {pct}%
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                {mcScore}/{mcTotal} benar • {badge.label}
              </div>
            </div>
          </div>

          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
            kitabifyapps.lovable.app • {new Date().toLocaleDateString("id-ID")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareResultCard;
