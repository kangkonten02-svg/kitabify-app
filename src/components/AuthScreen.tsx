import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { saveUser, type User } from "@/lib/store";
import kitabifyLogo from "@/assets/kitabify-logo-transparent.png";
import kitabifyBg from "@/assets/kitabify-bg.png";

interface AuthScreenProps {
  onAuth: () => void;
}

const AuthScreen = ({ onAuth }: AuthScreenProps) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({
    name: "", city: "", institution: "", phone: "", email: "", password: "", confirmPassword: "",
  });
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const initLocalUser = (name: string, email: string, source: string) => {
    const existing = localStorage.getItem("kitabify_user");
    if (existing) {
      const user: User = JSON.parse(existing);
      if (user.email === email) return;
    }
    const newUser: User = {
      name, city: "", institution: "", phone: "",
      email, exp: 10, level: 1, streak: 1,
      lastLogin: new Date().toISOString(), achievements: ["pemula"],
      materiProgress: {}, quizScores: {},
      expHistory: [{ source, amount: 10, date: new Date().toISOString() }],
    };
    saveUser(newUser);
  };

  const handleLogin = async () => {
    setError("");
    if (!form.email || !form.password) return setError("Mohon isi semua field");
    if (!/\S+@\S+\.\S+/.test(form.email))
      return setError("Format email tidak valid");
    if (form.password.length < 6) return setError("Password minimal 6 karakter");

    setLoading(true);
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    setLoading(false);

    if (authError) {
      if (authError.message.includes("Invalid login")) {
        return setError("Email atau password salah");
      }
      return setError(authError.message);
    }

    if (data.user) {
      initLocalUser(
        data.user.user_metadata?.full_name || form.email.split("@")[0],
        form.email,
        "Login"
      );
      onAuth();
    }
  };

  const handleRegister = async () => {
    setError("");
    if (!form.name || !form.email || !form.password || !form.confirmPassword)
      return setError("Mohon isi semua field wajib");
    if (!/\S+@\S+\.\S+/.test(form.email)) return setError("Format email tidak valid");
    if (form.phone && !/^\d{10,13}$/.test(form.phone)) return setError("Nomor HP tidak valid");
    if (form.password.length < 6) return setError("Password minimal 6 karakter");
    if (form.password !== form.confirmPassword) return setError("Password tidak cocok");

    setLoading(true);
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.name,
          phone: form.phone || null,
          city: form.city || null,
          institution: form.institution || null,
        },
        emailRedirectTo: window.location.origin,
      },
    });

    if (authError) {
      setLoading(false);
      return setError(authError.message);
    }

    // Persist city/institution/phone into profiles row (trigger creates row from full_name only)
    if (data.user) {
      await supabase
        .from("profiles")
        .update({
          city: form.city || null,
          institution: form.institution || null,
          phone: form.phone || null,
        } as never)
        .eq("id", data.user.id);

      initLocalUser(form.name, form.email, "Registrasi");
      setLoading(false);
      onAuth();
    } else {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!form.email) return setError("Masukkan email terlebih dahulu");
    if (!/\S+@\S+\.\S+/.test(form.email)) return setError("Format email tidak valid");

    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);

    if (resetError) return setError(resetError.message);
    setError("");
    alert("Link reset password telah dikirim ke email Anda");
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center overflow-y-auto">
      <img src={kitabifyBg} alt="" className="fixed inset-0 w-full h-full object-cover" />
      <div className="fixed inset-0 bg-background/50" />

      <motion.div
        className="relative z-10 w-full max-w-sm px-6 py-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col items-center mb-8">
          <img src={kitabifyLogo} alt="Kitabify" className="w-24 h-24 mb-3" />
          <h1 className="text-2xl font-extrabold text-foreground">Kitabify</h1>
        </div>

        <div className="glass-card p-6">
          <div className="flex mb-6 rounded-xl bg-muted p-1">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === m ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"}`}
              >
                {m === "login" ? "Masuk" : "Daftar"}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-destructive/20 text-destructive border border-destructive/30 rounded-lg p-3 text-sm mb-4">
              {error}
            </div>
          )}

          {mode === "login" ? (
            <div className="space-y-4">
              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-input text-foreground placeholder:text-muted-foreground text-sm border border-border focus:border-primary focus:outline-none transition"
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-input text-foreground placeholder:text-muted-foreground text-sm border border-border focus:border-primary focus:outline-none transition"
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-primary" />
                  Ingat saya
                </label>
                <button type="button" onClick={handleForgotPassword} className="text-sm text-primary font-medium">Lupa password?</button>
              </div>
              <motion.button
                onClick={handleLogin}
                disabled={loading}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Masuk"}
              </motion.button>
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { k: "name", p: "Nama Lengkap *" },
                { k: "city", p: "Nama Kota" },
                { k: "institution", p: "Instansi Pendidikan" },
                { k: "phone", p: "Nomor HP" },
                { k: "email", p: "Email *" },
              ].map(({ k, p }) => (
                <input
                  key={k}
                  placeholder={p}
                  value={(form as any)[k]}
                  onChange={(e) => set(k, e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-input text-foreground placeholder:text-muted-foreground text-sm border border-border focus:border-primary focus:outline-none transition"
                />
              ))}
              <input
                type="password"
                placeholder="Password *"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-input text-foreground placeholder:text-muted-foreground text-sm border border-border focus:border-primary focus:outline-none transition"
              />
              <input
                type="password"
                placeholder="Konfirmasi Password *"
                value={form.confirmPassword}
                onChange={(e) => set("confirmPassword", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-input text-foreground placeholder:text-muted-foreground text-sm border border-border focus:border-primary focus:outline-none transition"
              />
              <motion.button
                onClick={handleRegister}
                disabled={loading}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg mt-2 disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Daftar"}
              </motion.button>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">atau</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google Login */}
          <motion.button
            onClick={handleGoogleLogin}
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl bg-card border border-border text-foreground font-semibold text-sm flex items-center justify-center gap-3 shadow-sm hover:bg-muted transition disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Masuk dengan Google
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthScreen;
