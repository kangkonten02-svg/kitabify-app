import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { saveUser, type User } from "@/lib/store";
import kitabifyLogo from "@/assets/kitabify-logo-transparent.png";
import kitabifyBg from "@/assets/kitabify-bg.png";

interface AuthScreenProps {
  onAuth: () => void;
}

// Always use a stable public URL for email confirmation links so users
// never get redirected to localhost (which happens when window.location
// is the dev sandbox or when the email is opened on another device).
const getRedirectUrl = (): string => {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isLocal =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".local");
    if (!isLocal) return window.location.origin;
  }
  return "https://kitabify-app.lovable.app";
};

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

        </div>
      </motion.div>
    </div>
  );
};

export default AuthScreen;
