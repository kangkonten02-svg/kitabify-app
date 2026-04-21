import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getUser, saveUser, logout, getLevelTitle, getExpToNextLevel, ALL_BADGES } from "@/lib/store";
import { User, Award, Zap, LogOut, ChevronRight, X, Moon, Sun, ExternalLink, Settings, Phone, Heart, Camera, Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import supportQr from "@/assets/support-qr.jpg";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LainnyaPageProps {
  onLogout: () => void;
}

const LainnyaPage = ({ onLogout }: LainnyaPageProps) => {
  const [user, setUser] = useState(getUser());
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("kitabify_theme") !== "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    // Add transition class for smooth theme switch
    root.classList.add("theme-transition");
    if (isDark) {
      root.classList.remove("light");
      localStorage.setItem("kitabify_theme", "dark");
    } else {
      root.classList.add("light");
      localStorage.setItem("kitabify_theme", "light");
    }
    // Remove transition class after animation completes
    const timer = setTimeout(() => root.classList.remove("theme-transition"), 350);
    return () => clearTimeout(timer);
  }, [isDark]);

  if (!user) return null;

  const { current, needed } = getExpToNextLevel(user.exp);
  const earnedBadges = ALL_BADGES.filter((b) => user.achievements.includes(b.id));
  const lockedBadges = ALL_BADGES.filter((b) => !user.achievements.includes(b.id));

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const sectionTitle = (icon: string, title: string) => (
    <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
      {icon} {title}
    </h2>
  );

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto space-y-5">
      <h1 className="text-2xl font-extrabold text-foreground mb-2">⚙️ Lainnya</h1>

      {/* Profile Card */}
      {sectionTitle("👤", "Profil")}
      <motion.div className="glass-card p-5 rounded-2xl" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
            <User className="text-primary" size={28} />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-foreground truncate">{user.name}</h3>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            { label: "Kota", value: user.city || "-" },
            { label: "Instansi", value: user.institution || "-" },
          ].map((item) => (
            <div key={item.label} className="bg-muted/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-sm font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Level & EXP */}
      <motion.button
        onClick={() => setShowExpHistory(true)}
        className="glass-card p-5 w-full text-left rounded-2xl active:scale-[0.98] transition-transform"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Zap className="text-gold" size={20} />
            <div>
              <p className="text-sm font-bold text-foreground">Level {user.level} — {getLevelTitle(user.level)}</p>
              <p className="text-xs text-muted-foreground">{user.exp} total EXP</p>
            </div>
          </div>
          <ChevronRight className="text-muted-foreground" size={18} />
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full progress-bar-fill transition-all" style={{ width: `${(current / needed) * 100}%` }} />
        </div>
      </motion.button>

      {/* Achievements */}
      <motion.button
        onClick={() => setShowBadges(true)}
        className="glass-card p-5 w-full text-left rounded-2xl active:scale-[0.98] transition-transform"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="text-gold" size={20} />
            <div>
              <p className="text-sm font-bold text-foreground">Achievement</p>
              <p className="text-xs text-muted-foreground">{earnedBadges.length}/{ALL_BADGES.length} badge diraih</p>
            </div>
          </div>
          <ChevronRight className="text-muted-foreground" size={18} />
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {earnedBadges.map((b) => (
            <span key={b.id} className="text-2xl">{b.icon}</span>
          ))}
          {earnedBadges.length === 0 && <span className="text-sm text-muted-foreground italic">Belum ada badge</span>}
        </div>
      </motion.button>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Pengaturan */}
      {sectionTitle("⚙️", "Pengaturan")}
      <motion.div
        className="glass-card p-5 rounded-2xl"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDark ? <Moon className="text-primary" size={20} /> : <Sun className="text-primary" size={20} />}
            <div>
              <p className="text-sm font-bold text-foreground">{isDark ? "Mode Gelap" : "Mode Terang"}</p>
              <p className="text-xs text-muted-foreground">Ubah tampilan aplikasi</p>
            </div>
          </div>
          <Switch checked={isDark} onCheckedChange={setIsDark} />
        </div>
      </motion.div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Hubungi Kami */}
      {sectionTitle("📞", "Hubungi Kami")}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      >
        <a
          href="https://www.instagram.com/kitabify.id?igsh=d21iMmNibmQ4Mmw1"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card p-4 rounded-2xl flex items-center gap-3 active:scale-[0.98] transition-transform block"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            📷
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">Instagram Kitabify</p>
            <p className="text-xs text-muted-foreground">@kitabify.id</p>
          </div>
          <ExternalLink className="text-muted-foreground" size={16} />
        </a>

        <a
          href="https://www.threads.com/@kitabifyid"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card p-4 rounded-2xl flex items-center gap-3 active:scale-[0.98] transition-transform block"
        >
          <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center text-background font-bold text-lg">
            @
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">Threads Kitabify</p>
            <p className="text-xs text-muted-foreground">@kitabifyid</p>
          </div>
          <ExternalLink className="text-muted-foreground" size={16} />
        </a>
      </motion.div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Akun */}
      {sectionTitle("🔐", "Akun")}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      >
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center gap-3 py-4 px-5 rounded-2xl bg-destructive/10 text-destructive active:scale-[0.98] transition-transform"
        >
          <LogOut size={18} />
          <span className="font-semibold text-sm">Keluar</span>
        </button>
      </motion.div>

      {/* Version & Quote */}
      <div className="text-center pt-4 pb-2 space-y-2">
        <p className="text-xs text-muted-foreground italic">
          "Barangsiapa menempuh jalan untuk mencari ilmu, maka Allah mudahkan baginya jalan menuju surga." — HR. Muslim
        </p>
        <p className="text-[10px] text-muted-foreground/50 font-mono">Kitabify v1.0.0</p>
      </div>

      {/* Logout Confirmation */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent className="max-w-sm rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Yakin ingin keluar?</AlertDialogTitle>
            <AlertDialogDescription>
              Kamu akan keluar dari akun Kitabify. Data progress tetap tersimpan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* EXP History Modal */}
      <AnimatePresence>
        {showExpHistory && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-background/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowExpHistory(false)}
          >
            <motion.div
              className="w-full max-w-lg bg-card rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto"
              initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Riwayat EXP</h3>
                <button onClick={() => setShowExpHistory(false)}><X className="text-muted-foreground" size={20} /></button>
              </div>
              {user.expHistory.length === 0 ? (
                <p className="text-muted-foreground text-sm">Belum ada riwayat</p>
              ) : (
                <div className="space-y-3">
                  {[...user.expHistory].reverse().map((h, i) => (
                    <div key={i} className="flex items-center justify-between bg-muted/50 rounded-xl p-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{h.source}</p>
                        <p className="text-xs text-muted-foreground">{new Date(h.date).toLocaleDateString("id-ID")}</p>
                      </div>
                      <span className="gold-badge px-3 py-1 rounded-full text-xs">+{h.amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badges Modal */}
      <AnimatePresence>
        {showBadges && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-background/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowBadges(false)}
          >
            <motion.div
              className="w-full max-w-lg bg-card rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto"
              initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">🏅 Semua Badge</h3>
                <button onClick={() => setShowBadges(false)}><X className="text-muted-foreground" size={20} /></button>
              </div>
              <div className="space-y-3">
                {earnedBadges.map((b) => (
                  <div key={b.id} className="flex items-center gap-4 bg-primary/10 border border-primary/20 rounded-xl p-4">
                    <span className="text-3xl">{b.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-foreground">{b.name}</p>
                      <p className="text-xs text-muted-foreground">{b.description}</p>
                    </div>
                    <div className="ml-auto gold-badge w-6 h-6 rounded-full flex items-center justify-center text-xs">✓</div>
                  </div>
                ))}
                {lockedBadges.map((b) => (
                  <div key={b.id} className="flex items-center gap-4 bg-muted/30 rounded-xl p-4 opacity-50">
                    <span className="text-3xl grayscale">{b.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-foreground">{b.name}</p>
                      <p className="text-xs text-muted-foreground">{b.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LainnyaPage;
