import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getUser, saveUser, logout, getLevelTitle, getExpToNextLevel, ALL_BADGES } from "@/lib/store";
import {
  User as UserIcon, Award, Zap, LogOut, ChevronRight, X, Moon, Sun,
  ExternalLink, Settings, Phone, Heart, Camera, Pencil,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import supportQr from "@/assets/support-qr.jpg";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LainnyaPageProps {
  onLogout: () => void;
}

type Sheet = null | "profile" | "settings" | "contact" | "support" | "badges";

const LainnyaPage = ({ onLogout }: LainnyaPageProps) => {
  const [user, setUser] = useState(getUser());
  const [sheet, setSheet] = useState<Sheet>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [nameError, setNameError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("kitabify_theme") !== "light",
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    if (isDark) {
      root.classList.remove("light");
      localStorage.setItem("kitabify_theme", "dark");
    } else {
      root.classList.add("light");
      localStorage.setItem("kitabify_theme", "light");
    }
    const t = setTimeout(() => root.classList.remove("theme-transition"), 350);
    return () => clearTimeout(t);
  }, [isDark]);

  if (!user) return null;

  const { current, needed } = getExpToNextLevel(user.exp);
  const earnedBadges = ALL_BADGES.filter((b) => user.achievements.includes(b.id));
  const lockedBadges = ALL_BADGES.filter((b) => !user.achievements.includes(b.id));

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const photo = reader.result as string;
      const updated = { ...user, photo };
      saveUser(updated);
      setUser(updated);
    };
    reader.readAsDataURL(file);
  };

  const openNameEdit = () => {
    setNameInput(user.name);
    setNameError("");
    setShowNameEdit(true);
  };

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setNameError("Nama tidak boleh kosong");
      return;
    }
    if (trimmed.length > 50) {
      setNameError("Nama maksimal 50 karakter");
      return;
    }
    const updated = { ...user, name: trimmed };
    saveUser(updated);
    setUser(updated);
    setShowNameEdit(false);
  };

  const MenuItem = ({
    icon, title, subtitle, onClick, delay = 0,
  }: { icon: React.ReactNode; title: string; subtitle: string; onClick: () => void; delay?: number }) => (
    <motion.button
      onClick={onClick}
      className="glass-card p-4 w-full text-left rounded-2xl flex items-center gap-4 active:scale-[0.98] transition-transform"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    >
      <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
      </div>
      <ChevronRight className="text-muted-foreground" size={18} />
    </motion.button>
  );

  const Avatar = ({ size = 56 }: { size?: number }) => (
    <div
      className="rounded-2xl bg-primary/20 flex items-center justify-center overflow-hidden shrink-0"
      style={{ width: size, height: size }}
    >
      {user.photo ? (
        <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
      ) : (
        <UserIcon className="text-primary" size={size * 0.5} />
      )}
    </div>
  );

  const SheetModal = ({ open, onClose, title, children }: {
    open: boolean; onClose: () => void; title: string; children: React.ReactNode;
  }) => (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-background/60 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-lg bg-card rounded-t-3xl p-6 pb-28 max-h-[85vh] overflow-y-auto"
            initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-foreground">{title}</h3>
              <button onClick={onClose} aria-label="Tutup">
                <X className="text-muted-foreground" size={20} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-extrabold text-foreground mb-2">⚙️ Lainnya</h1>

      {/* Summary card */}
      <motion.div
        className="glass-card p-5 rounded-2xl flex items-center gap-4"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      >
        <Avatar size={56} />
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-foreground truncate">{user.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          <p className="text-xs text-primary mt-0.5 font-semibold">
            Level {user.level} · {getLevelTitle(user.level)}
          </p>
        </div>
      </motion.div>

      {/* Menu */}
      <div className="space-y-3">
        <MenuItem
          icon={<UserIcon size={20} />}
          title="Profil"
          subtitle="Lihat informasi akun & achievement"
          onClick={() => setSheet("profile")}
          delay={0.05}
        />
        <MenuItem
          icon={<Settings size={20} />}
          title="Setting"
          subtitle="Tema, foto profil & akun"
          onClick={() => setSheet("settings")}
          delay={0.1}
        />
        <MenuItem
          icon={<Phone size={20} />}
          title="Hubungi Kami"
          subtitle="Instagram, Threads & dukungan"
          onClick={() => setSheet("contact")}
          delay={0.15}
        />
      </div>

      {/* Quote */}
      <div className="text-center pt-4 pb-2 space-y-2">
        <p className="text-xs text-muted-foreground italic">
          "Barangsiapa menempuh jalan untuk mencari ilmu, maka Allah mudahkan baginya jalan menuju surga." — HR. Muslim
        </p>
        <p className="text-[10px] text-muted-foreground/50 font-mono">Kitabify v1.0.0</p>
      </div>

      {/* Profile Sheet */}
      <SheetModal open={sheet === "profile"} onClose={() => setSheet(null)} title="👤 Profil">
        <div className="space-y-5">
          <div className="flex flex-col items-center text-center">
            <Avatar size={88} />
            <h3 className="text-lg font-bold text-foreground mt-3">{user.name}</h3>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Kota</p>
              <p className="text-sm font-semibold text-foreground">{user.city || "-"}</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Instansi</p>
              <p className="text-sm font-semibold text-foreground">{user.institution || "-"}</p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="text-gold" size={20} />
              <div>
                <p className="text-sm font-bold text-foreground">
                  Level {user.level} — {getLevelTitle(user.level)}
                </p>
                <p className="text-xs text-muted-foreground">{user.exp} total EXP</p>
              </div>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full progress-bar-fill transition-all" style={{ width: `${(current / needed) * 100}%` }} />
            </div>
          </div>

          <button
            onClick={() => setSheet("badges")}
            className="glass-card p-4 w-full text-left rounded-2xl active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="text-gold" size={20} />
                <div>
                  <p className="text-sm font-bold text-foreground">Achievement Badge</p>
                  <p className="text-xs text-muted-foreground">
                    {earnedBadges.length}/{ALL_BADGES.length} badge diraih
                  </p>
                </div>
              </div>
              <ChevronRight className="text-muted-foreground" size={18} />
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              {earnedBadges.map((b) => (
                <span key={b.id} className="text-2xl">{b.icon}</span>
              ))}
              {earnedBadges.length === 0 && (
                <span className="text-sm text-muted-foreground italic">Belum ada badge</span>
              )}
            </div>
          </button>
        </div>
      </SheetModal>

      {/* Settings Sheet */}
      <SheetModal open={sheet === "settings"} onClose={() => setSheet(null)} title="⚙️ Setting">
        <div className="space-y-4">
          {/* Theme */}
          <div className="glass-card p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="text-primary" size={20} /> : <Sun className="text-primary" size={20} />}
              <div>
                <p className="text-sm font-bold text-foreground">
                  {isDark ? "Mode Gelap" : "Mode Terang"}
                </p>
                <p className="text-xs text-muted-foreground">Ubah tampilan aplikasi</p>
              </div>
            </div>
            <Switch checked={isDark} onCheckedChange={setIsDark} />
          </div>

          {/* Change photo */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="glass-card p-4 w-full rounded-2xl flex items-center gap-3 active:scale-[0.98] transition-transform"
          >
            <Avatar size={44} />
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-bold text-foreground">Ganti Foto Profil</p>
              <p className="text-xs text-muted-foreground">Upload foto dari perangkat</p>
            </div>
            <Camera className="text-muted-foreground" size={18} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />

          {/* Change name */}
          <button
            onClick={openNameEdit}
            className="glass-card p-4 w-full rounded-2xl flex items-center gap-3 active:scale-[0.98] transition-transform"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center text-primary shrink-0">
              <Pencil size={20} />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-bold text-foreground">Ubah Nama</p>
              <p className="text-xs text-muted-foreground truncate">{user.name}</p>
            </div>
            <ChevronRight className="text-muted-foreground" size={18} />
          </button>

          {/* Logout */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 py-4 px-5 rounded-2xl bg-destructive/10 text-destructive active:scale-[0.98] transition-transform"
          >
            <LogOut size={18} />
            <span className="font-semibold text-sm">Keluar / Logout</span>
          </button>
        </div>
      </SheetModal>

      {/* Contact Sheet */}
      <SheetModal open={sheet === "contact"} onClose={() => setSheet(null)} title="📞 Hubungi Kami">
        <div className="space-y-3">
          <a
            href="https://www.instagram.com/kitabify.id?igsh=d21iMmNibmQ4Mmw1"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-4 rounded-2xl flex items-center gap-3 active:scale-[0.98] transition-transform"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-lg">
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
            className="glass-card p-4 rounded-2xl flex items-center gap-3 active:scale-[0.98] transition-transform"
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

          <button
            onClick={() => setSheet("support")}
            className="glass-card p-4 w-full rounded-2xl flex items-center gap-3 active:scale-[0.98] transition-transform"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center">
              <Heart className="text-primary-foreground" size={18} fill="currentColor" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-bold text-foreground">Support Kami</p>
              <p className="text-xs text-muted-foreground">Dukung pengembangan Kitabify</p>
            </div>
            <ChevronRight className="text-muted-foreground" size={16} />
          </button>
        </div>
      </SheetModal>

      {/* Support Sheet */}
      <SheetModal open={sheet === "support"} onClose={() => setSheet(null)} title="💛 Support Kami">
        <div className="space-y-4 text-center">
          <p className="text-sm text-foreground leading-relaxed">
            Kami sangat membutuhkan bantuan support kalian untuk membantu mengembangkan aplikasi <span className="font-bold text-primary">Kitabify</span>.
          </p>

          <div className="glass-card p-4 rounded-2xl">
            <div className="bg-background rounded-xl p-3 flex items-center justify-center">
              <img
                src={supportQr}
                alt="QR Code Donasi Kitabify"
                className="w-full max-w-[260px] aspect-square object-contain rounded-lg"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Scan QR code di atas untuk berdonasi
            </p>
          </div>

          <p className="text-sm text-foreground leading-relaxed">
            Berapapun bantuan kalian akan sangat membantu untuk perkembangan aplikasi Kitabify.
          </p>

          <p className="text-xs text-muted-foreground italic pt-2">
            Jazakumullahu khairan 🤲
          </p>
        </div>
      </SheetModal>

      {/* Badges Sheet */}
      <SheetModal open={sheet === "badges"} onClose={() => setSheet("profile")} title="🏅 Semua Badge">
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
      </SheetModal>

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
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LainnyaPage;