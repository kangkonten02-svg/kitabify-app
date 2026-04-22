import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import kitabifyLogo from "@/assets/kitabify-logo-transparent.png";
import kitabifyBg from "@/assets/kitabify-bg.png";

const slides = [
  { icon: "📚", title: "Materi Kitab Lengkap", desc: "Belajar kitab kuning secara bertahap dan terstruktur" },
  { icon: "🧠", title: "Kuis Interaktif", desc: "Uji pemahaman dengan kuis + timer yang menantang" },
  { icon: "🎯", title: "Sistem Level & Achievement", desc: "Raih badge dan naik level setiap hari" },
  { icon: "📈", title: "Progress Real-time", desc: "Pantau perkembangan belajar kamu secara langsung" },
];

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [current, setCurrent] = useState(0);
  const [showSlides, setShowSlides] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowSlides(true), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!showSlides) return;
    const interval = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [showSlides]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden">
      <img src={kitabifyBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-background/40" />

      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <img src={kitabifyLogo} alt="Kitabify" className="w-32 h-32 mb-4" />
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Kitabify</h1>
        <p className="text-muted-foreground text-sm mt-1">Belajar Kitab Kuning Jadi Lebih Mudah</p>
      </motion.div>

      {showSlides && (
        <motion.div
          className="relative z-10 mt-12 w-full max-w-sm px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="glass-card p-6 text-center min-h-[140px] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
              >
                <span className="text-4xl">{slides[current].icon}</span>
                <h3 className="text-foreground font-bold text-lg mt-3">{slides[current].title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{slides[current].desc}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-primary" : "w-2 bg-muted"}`}
              />
            ))}
          </div>

          <motion.button
            onClick={onFinish}
            className="w-full mt-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-lg"
            whileTap={{ scale: 0.97 }}
          >
            Mulai Belajar
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default SplashScreen;
