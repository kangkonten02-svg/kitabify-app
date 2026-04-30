import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SplashScreen from "@/components/SplashScreen";
import AuthScreen from "@/components/AuthScreen";
import BottomNav, { type Tab } from "@/components/BottomNav";
import DashboardPage from "@/components/DashboardPage";
import MateriPage from "@/components/MateriPage";
import KuisPage from "@/components/KuisPage";
import LainnyaPage from "@/components/LainnyaPage";
import { isLoggedIn, saveUser, getUser, type User } from "@/lib/store";
import { PopupModalProvider } from "@/components/InteractivePopup";
import { supabase } from "@/integrations/supabase/client";
import DailyLoginModal from "@/components/DailyLoginModal";
import { checkAndClaimDailyLogin, type DailyReward } from "@/lib/dailyLogin";
import { hydrateFromCloud } from "@/lib/gamification";

const Index = () => {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<"splash" | "auth" | "app">("splash");
  const [tab, setTab] = useState<Tab>("dashboard");
  const [, setRefresh] = useState(0);
  const [materiKitabId, setMateriKitabId] = useState<string | null>(null);
  const visitTracked = useRef(false);
  const [dailyOpen, setDailyOpen] = useState(false);
  const [dailyReward, setDailyReward] = useState<DailyReward | null>(null);
  const [dailyStreak, setDailyStreak] = useState(0);
  const dailyChecked = useRef(false);

  // Trigger daily login claim the first time we enter the "app" screen
  useEffect(() => {
    if (screen !== "app" || dailyChecked.current) return;
    dailyChecked.current = true;
    // Pull cloud snapshots in background (best-effort, non-blocking).
    hydrateFromCloud().catch(() => {});
    const result = checkAndClaimDailyLogin();
    if (result.claimed) {
      setDailyReward(result.reward);
      setDailyStreak(result.streak);
      setDailyOpen(true);
    }
  }, [screen]);

  useEffect(() => {
    if (!visitTracked.current) {
      visitTracked.current = true;
      // Defer firebase visit logging — non-blocking, after first paint
      const idle = (window as any).requestIdleCallback || ((cb: () => void) => setTimeout(cb, 1500));
      idle(() => {
        Promise.all([
          import("firebase/firestore"),
          import("@/firebase"),
        ]).then(([{ collection, addDoc }, { db }]) => {
          addDoc(collection(db, "visits"), { createdAt: new Date().toISOString() }).catch(() => {});
        }).catch(() => {});
      });
    }
  }, []);

  // Listen to Supabase auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        // Admin redirect — Kitabify admin goes straight to panel
        if (session.user.email === "kitabifyid@gmail.com") {
          navigate("/admin", { replace: true });
          return;
        }
        // Sync local user data
        if (!getUser() || getUser()?.email !== session.user.email) {
          const newUser: User = {
            name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
            city: "", institution: "", phone: session.user.user_metadata?.phone || "",
            email: session.user.email || "",
            exp: 10, level: 1, streak: 1,
            lastLogin: new Date().toISOString(), achievements: ["pemula"],
            materiProgress: {}, quizScores: {},
            expHistory: [{ source: "Login", amount: 10, date: new Date().toISOString() }],
          };
          saveUser(newUser);
        }
        setScreen("app");
      } else if (event === "SIGNED_OUT") {
        setScreen("auth");
      }
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        if (session.user.email === "kitabifyid@gmail.com") {
          navigate("/admin", { replace: true });
          return;
        }
        if (!getUser()) {
          const newUser: User = {
            name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
            city: "", institution: "", phone: "",
            email: session.user.email || "",
            exp: 10, level: 1, streak: 1,
            lastLogin: new Date().toISOString(), achievements: ["pemula"],
            materiProgress: {}, quizScores: {},
            expHistory: [{ source: "Login", amount: 10, date: new Date().toISOString() }],
          };
          saveUser(newUser);
        }
        setScreen("app");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const refreshApp = () => setRefresh((r) => r + 1);

  if (screen === "splash") {
    return (
      <SplashScreen
        onFinish={() => {
          supabase.auth.getSession().then(({ data: { session } }) => {
            setScreen(session?.user ? "app" : (isLoggedIn() ? "app" : "auth"));
          });
        }}
      />
    );
  }

  if (screen === "auth") {
    return <AuthScreen onAuth={() => { setScreen("app"); refreshApp(); }} />;
  }

  return (
    <PopupModalProvider>
      <div className="min-h-screen bg-background bg-texture relative">
        {tab === "dashboard" && (
          <DashboardPage onGoMateri={(kitabId) => { setMateriKitabId(kitabId ?? null); setTab("materi"); refreshApp(); }} />
        )}
        {tab === "materi" && (
          <MateriPage
            key={materiKitabId ?? "all"}
            initialKitabId={materiKitabId}
            onGoKuis={() => { setTab("kuis"); refreshApp(); }}
          />
        )}
        {tab === "kuis" && <KuisPage onGoMateri={() => { setTab("materi"); refreshApp(); }} />}
        {tab === "lainnya" && (
          <LainnyaPage onLogout={async () => {
            await supabase.auth.signOut();
            localStorage.removeItem("kitabify_user");
            setScreen("auth");
            refreshApp();
          }} />
        )}
        <BottomNav active={tab} onNavigate={(t) => { if (t === "materi") setMateriKitabId(null); setTab(t); refreshApp(); }} />
      </div>
      {dailyReward && (
        <DailyLoginModal
          open={dailyOpen}
          streak={dailyStreak}
          reward={dailyReward}
          onClose={() => { setDailyOpen(false); refreshApp(); }}
        />
      )}
    </PopupModalProvider>
  );
};

export default Index;
