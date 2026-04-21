import { Home, BookOpen, FileQuestion, Settings } from "lucide-react";

type Tab = "dashboard" | "materi" | "kuis" | "lainnya";

interface BottomNavProps {
  active: Tab;
  onNavigate: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; Icon: typeof Home }[] = [
  { id: "dashboard", label: "Dashboard", Icon: Home },
  { id: "materi", label: "Materi", Icon: BookOpen },
  { id: "kuis", label: "Kuis", Icon: FileQuestion },
  { id: "lainnya", label: "Lainnya", Icon: Settings },
];

const BottomNav = ({ active, onNavigate }: BottomNavProps) => (
  <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl safe-area-pb">
    <div className="flex max-w-lg mx-auto">
      {tabs.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${
            active === id ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Icon size={22} strokeWidth={active === id ? 2.5 : 1.8} />
          <span className="text-[11px] font-semibold">{label}</span>
        </button>
      ))}
    </div>
  </nav>
);

export default BottomNav;
export type { Tab };
