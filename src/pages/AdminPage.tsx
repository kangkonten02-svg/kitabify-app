import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Crown,
  Sparkles,
  Search,
  Plus,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { computeActive, type Subscription, type SubscriptionTier } from "@/lib/subscription";

interface UserRow {
  id: string;
  email: string;
  full_name: string;
  city: string | null;
  institution: string | null;
  phone: string | null;
  created_at: string;
  subscription: Subscription | null;
}

const AdminPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [rows, setRows] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [editTier, setEditTier] = useState<SubscriptionTier>("VIP");
  const [addDays, setAddDays] = useState(180);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    localStorage.removeItem("kitabify_user");
    toast.success("Berhasil keluar");
    navigate("/", { replace: true });
  };

  // Auth + admin check
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setAuthorized(false);
        return;
      }
      // Kitabify root admin — always authorized
      if (user.email === "kitabifyid@gmail.com") {
        setAuthorized(true);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      setAuthorized(profile?.role === "KITABIFY_ADMIN");
    })();
  }, []);

  const loadData = async () => {
    setLoading(true);
    // Profiles + subscriptions
    const [{ data: profiles }, { data: subs }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, created_at, phone, city, institution" as any),
      supabase.from("subscriptions").select("*"),
    ]);

    // Need emails — get from auth via RPC or session: profiles doesn't have email column
    // We use a workaround: use admin function, but for simplicity, we'll show what we have.
    // Email is not in profiles; we display full_name and id.
    const subMap = new Map<string, Subscription>();
    (subs || []).forEach((s: any) => subMap.set(s.user_id, s as Subscription));

    const userRows: UserRow[] = (profiles || []).map((p: any) => ({
      id: p.id,
      email: "", // tidak tersedia tanpa service role
      full_name: p.full_name || "User",
      city: p.city || null,
      institution: p.institution || null,
      phone: p.phone || null,
      created_at: p.created_at,
      subscription: subMap.get(p.id) || null,
    }));

    setRows(userRows);
    setLoading(false);
  };

  useEffect(() => {
    if (authorized) loadData();
  }, [authorized]);

  // Realtime
  useEffect(() => {
    if (!authorized) return;
    const ch = supabase
      .channel("admin-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "subscriptions" }, () => loadData())
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => loadData())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [authorized]);

  const filtered = useMemo(() => {
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.full_name.toLowerCase().includes(q) ||
        r.id.includes(q) ||
        (r.city || "").toLowerCase().includes(q) ||
        (r.institution || "").toLowerCase().includes(q) ||
        (r.phone || "").toLowerCase().includes(q)
    );
  }, [rows, search]);

  const stats = useMemo(() => {
    let total = rows.length;
    let vip = 0,
      vvip = 0,
      trial = 0,
      free = 0;
    rows.forEach((r) => {
      const a = computeActive(r.subscription);
      if (a.source === "trial") trial++;
      else if (a.effectiveTier === "VVIP") vvip++;
      else if (a.effectiveTier === "VIP") vip++;
      else free++;
    });
    return { total, vip, vvip, trial, free };
  }, [rows]);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const { data, error } = await supabase.functions.invoke("admin-set-subscription", {
      body: {
        target_user_id: editing.id,
        tier: editTier,
        add_days: addDays,
      },
    });
    setSaving(false);
    if (error) {
      toast.error("Gagal menyimpan: " + error.message);
      return;
    }
    if ((data as any)?.error) {
      toast.error((data as any).error);
      return;
    }
    toast.success(`Paket ${editTier} +${addDays} hari berhasil diaktifkan`);
    setEditing(null);
    loadData();
  };

  if (authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="animate-spin text-primary" />
      </div>
    );
  }

  if (authorized === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">Akses Ditolak</h1>
        <p className="text-muted-foreground mt-2">
          Halaman ini hanya untuk admin Kitabify.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-primary text-primary-foreground px-4 py-2 rounded-lg"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-texture pb-12">
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={20} /> Kembali
          </button>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 text-sm font-semibold text-destructive bg-destructive/10 hover:bg-destructive/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            <LogOut size={16} />
            {loggingOut ? "Keluar..." : "Keluar"}
          </button>
        </div>

        <h1 className="text-3xl font-extrabold text-foreground">Panel Admin</h1>
        <p className="text-muted-foreground text-sm mt-1">Kelola user & langganan</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <StatCard icon={Users} label="Total User" value={stats.total} accent="primary" />
          <StatCard icon={Sparkles} label="Trial Aktif" value={stats.trial} accent="primary" />
          <StatCard icon={Crown} label="VIP Berbayar" value={stats.vip} accent="primary" />
          <StatCard icon={Crown} label="VVIP Berbayar" value={stats.vvip} accent="amber" />
        </div>

        {/* Search */}
        <div className="relative mt-5">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari nama atau ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* User list */}
        <div className="mt-5 space-y-2">
          {loading && (
            <div className="text-center py-8 text-muted-foreground">Memuat...</div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada user
            </div>
          )}
          {filtered.map((row) => {
            const a = computeActive(row.subscription);
            return (
              <motion.div
                key={row.id}
                className="glass-card p-3 flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold flex-shrink-0">
                  {row.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">
                    {row.full_name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {a.effectiveTier} ·{" "}
                    {a.source === "free"
                      ? "Tidak aktif"
                      : `${a.source === "trial" ? "Trial" : "Berbayar"} · ${a.daysLeft}h`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditing(row);
                    setEditTier(a.effectiveTier === "FREE" ? "VIP" : a.effectiveTier);
                    setAddDays(a.effectiveTier === "VVIP" ? 365 : 180);
                  }}
                  className="text-xs font-semibold text-primary px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors flex-shrink-0"
                >
                  Atur
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => !saving && setEditing(null)}
        >
          <motion.div
            className="glass-card p-5 w-full max-w-md"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-foreground">{editing.full_name}</h3>
            <p className="text-xs text-muted-foreground truncate mb-4">
              ID: {editing.id}
            </p>

            <label className="text-sm font-semibold text-foreground">Paket</label>
            <div className="grid grid-cols-3 gap-2 mt-2 mb-4">
              {(["FREE", "VIP", "VVIP"] as SubscriptionTier[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setEditTier(t)}
                  className={`py-2 rounded-lg text-sm font-semibold transition-colors ${
                    editTier === t
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <label className="text-sm font-semibold text-foreground">
              Tambah durasi (hari)
            </label>
            <div className="flex gap-2 mt-2">
              <input
                type="number"
                value={addDays}
                onChange={(e) => setAddDays(Number(e.target.value))}
                className="flex-1 px-3 py-2 rounded-lg bg-card border border-border text-foreground"
              />
              <button
                onClick={() => setAddDays(180)}
                className="px-3 py-2 rounded-lg bg-card border border-border text-xs text-foreground"
              >
                180
              </button>
              <button
                onClick={() => setAddDays(365)}
                className="px-3 py-2 rounded-lg bg-card border border-border text-xs text-foreground"
              >
                365
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Durasi ditambahkan dari masa berlaku saat ini (jika masih aktif), atau
              dari sekarang.
            </p>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setEditing(null)}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-card border border-border text-foreground font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2"
              >
                {saving ? <RefreshCw className="animate-spin" size={16} /> : <Plus size={16} />}
                Simpan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  accent: "primary" | "amber";
}) => (
  <div className="glass-card p-4">
    <div className="flex items-center gap-2 mb-2">
      <Icon
        size={18}
        className={accent === "amber" ? "text-amber-500" : "text-primary"}
      />
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
    <p className="text-2xl font-extrabold text-foreground">{value}</p>
  </div>
);

export default AdminPage;
