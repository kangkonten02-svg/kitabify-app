import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Lock, Check, Star, Gift, Sparkles } from "lucide-react";
import { MATERI_DATA, type Kitab, type Jilid } from "@/lib/materiData";
import { hasQuiz } from "@/lib/babNavigation";
import {
  getBabProgress,
  isChestOpened,
  openChest,
} from "@/lib/gamification";
import { addExp } from "@/lib/store";

interface PathViewProps {
  kitab: Kitab;
  onSelectBab: (loc: { kitabId: string; jilidId: string; babId: string }) => void;
}

type NodeKind = "lesson" | "chest";
interface PathNode {
  kind: NodeKind;
  jilid: Jilid;
  babId?: string;
  babTitle?: string;
  jilidIdx: number;
  babIdx?: number;
}

// Build a flat sequence: each jilid's babs followed by a chest node.
function buildNodes(kitab: Kitab): PathNode[] {
  const out: PathNode[] = [];
  kitab.jilids.forEach((jilid, jilidIdx) => {
    jilid.babs.forEach((b, babIdx) => {
      out.push({
        kind: "lesson",
        jilid,
        babId: b.id,
        babTitle: b.title,
        jilidIdx,
        babIdx,
      });
    });
    out.push({ kind: "chest", jilid, jilidIdx });
  });
  return out;
}

function isBabComplete(jilidId: string, babId: string): boolean {
  const p = getBabProgress(babId);
  if (!p.read) return false;
  if (hasQuiz(jilidId, babId)) return p.score >= 7;
  return true;
}

const PathView = ({ kitab, onSelectBab }: PathViewProps) => {
  const [, setTick] = useState(0);
  useEffect(() => {
    const refresh = () => setTick((x) => x + 1);
    window.addEventListener("kitabify:path", refresh);
    window.addEventListener("kitabify:chest", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("kitabify:path", refresh);
      window.removeEventListener("kitabify:chest", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const nodes = useMemo(() => buildNodes(kitab), [kitab]);

  // Determine which nodes are unlocked. A lesson unlocks when the previous lesson
  // is fully complete (read + quiz passed if quiz exists). Chest unlocks when all
  // babs in its jilid are complete.
  const unlockMap = useMemo(() => {
    const map = new Map<number, boolean>();
    let lastLessonComplete = true; // first lesson unlocked
    nodes.forEach((n, i) => {
      if (n.kind === "lesson") {
        map.set(i, lastLessonComplete);
        lastLessonComplete = isBabComplete(n.jilid.id, n.babId!);
      } else {
        // chest
        const allDone = n.jilid.babs.every((b) => isBabComplete(n.jilid.id, b.id));
        map.set(i, allDone);
      }
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, /* re-eval on tick */ setTick]);

  // Find active = first unlocked & not-complete lesson
  const activeIdx = useMemo(() => {
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (n.kind !== "lesson") continue;
      if (!unlockMap.get(i)) continue;
      if (!isBabComplete(n.jilid.id, n.babId!)) return i;
    }
    return -1;
  }, [nodes, unlockMap]);

  const handleChest = (jilidId: string) => {
    if (isChestOpened(jilidId)) return;
    openChest(jilidId);
    addExp(50, `Chest: ${jilidId}`);
  };

  // Alternating zig-zag offsets for the Duolingo path feel
  const offsets = [0, 60, 90, 60, 0, -60, -90, -60];

  return (
    <div className="relative pb-10 pt-2">
      {/* Jilid section headers + nodes */}
      <div className="flex flex-col items-center gap-7">
        {nodes.map((n, i) => {
          const offset = offsets[i % offsets.length];
          const unlocked = unlockMap.get(i) ?? false;
          const isFirstOfJilid =
            n.kind === "lesson" && n.babIdx === 0;

          return (
            <div key={i} className="w-full flex flex-col items-center">
              {isFirstOfJilid && (
                <div className="w-full px-1 mb-2 mt-3 first:mt-0">
                  <div className="rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-l-4 border-primary px-4 py-2.5">
                    <p className="text-[10px] uppercase tracking-wider text-primary/80 font-bold">
                      Bagian {n.jilidIdx + 1}
                    </p>
                    <p className="text-sm font-extrabold text-foreground">
                      📂 {n.jilid.title}
                    </p>
                  </div>
                </div>
              )}

              <motion.div
                style={{ transform: `translateX(${offset}px)` }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, delay: Math.min(i * 0.015, 0.3) }}
              >
                {n.kind === "lesson" ? (
                  <LessonNode
                    title={n.babTitle!}
                    locked={!unlocked}
                    active={i === activeIdx}
                    complete={unlocked && isBabComplete(n.jilid.id, n.babId!)}
                    quizAvailable={hasQuiz(n.jilid.id, n.babId!)}
                    score={getBabProgress(n.babId!).score}
                    onClick={() => unlocked && onSelectBab({
                      kitabId: kitab.id,
                      jilidId: n.jilid.id,
                      babId: n.babId!,
                    })}
                  />
                ) : (
                  <ChestNode
                    locked={!unlocked}
                    opened={isChestOpened(n.jilid.id)}
                    onClick={() => unlocked && handleChest(n.jilid.id)}
                  />
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// =====================================================
// Nodes
// =====================================================
const LessonNode = ({
  title, locked, active, complete, quizAvailable, score, onClick,
}: {
  title: string;
  locked: boolean;
  active: boolean;
  complete: boolean;
  quizAvailable: boolean;
  score: number;
  onClick: () => void;
}) => {
  const ring =
    complete ? "ring-4 ring-primary/40" :
    active   ? "ring-4 ring-accent/60 animate-pulse" :
    "ring-2 ring-border";

  const bg =
    locked   ? "bg-muted/40 text-muted-foreground" :
    complete ? "bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground" :
    active   ? "bg-gradient-to-br from-accent to-amber-500 text-accent-foreground" :
               "bg-card text-foreground";

  const Icon = locked ? Lock : complete ? Check : BookOpen;

  return (
    <button
      onClick={onClick}
      disabled={locked}
      className={`relative group flex flex-col items-center gap-1.5 ${locked ? "cursor-not-allowed" : ""}`}
    >
      <div
        className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${ring} ${bg} transition-transform ${
          !locked ? "active:scale-95 hover:scale-105" : ""
        }`}
        style={{
          boxShadow: complete
            ? "0 8px 0 hsl(var(--primary) / 0.5), 0 12px 24px hsl(var(--primary) / 0.25)"
            : active
            ? "0 8px 0 hsl(var(--accent) / 0.5), 0 12px 24px hsl(var(--accent) / 0.25)"
            : "0 6px 0 hsl(var(--border)), 0 8px 16px rgba(0,0,0,0.15)",
        }}
      >
        <Icon size={32} strokeWidth={2.5} />
      </div>
      <div
        className={`max-w-[160px] text-center text-[11px] font-bold leading-tight px-2 py-0.5 rounded-md ${
          locked ? "text-muted-foreground" :
          active ? "text-accent" :
          complete ? "text-primary" :
          "text-foreground"
        }`}
      >
        {title}
      </div>
      {quizAvailable && score > 0 && !locked && (
        <span className="text-[10px] font-bold text-accent flex items-center gap-0.5">
          <Star size={10} className="fill-accent" /> {score}/10
        </span>
      )}
    </button>
  );
};

const ChestNode = ({
  locked, opened, onClick,
}: {
  locked: boolean;
  opened: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={locked || opened}
      className="relative flex flex-col items-center gap-1.5 disabled:cursor-not-allowed"
    >
      <div
        className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transition-transform ${
          locked
            ? "bg-muted/40 text-muted-foreground ring-2 ring-border"
            : opened
            ? "bg-gradient-to-br from-gold/40 to-amber-700/30 text-gold ring-2 ring-gold/40"
            : "bg-gradient-to-br from-gold to-amber-500 text-accent-foreground ring-4 ring-gold/50 hover:scale-105 active:scale-95"
        }`}
        style={{
          boxShadow: !locked && !opened
            ? "0 8px 0 hsl(var(--gold) / 0.6), 0 12px 24px hsl(var(--gold) / 0.3)"
            : "0 6px 0 hsl(var(--border)), 0 8px 16px rgba(0,0,0,0.15)",
        }}
      >
        {locked ? <Lock size={28} /> : opened ? <Sparkles size={28} /> : <Gift size={32} strokeWidth={2.5} />}
      </div>
      <div className={`text-[11px] font-bold ${locked ? "text-muted-foreground" : opened ? "text-gold" : "text-accent"}`}>
        {locked ? "Chest Terkunci" : opened ? "Chest Dibuka ✓" : "🎁 Buka Chest +50 XP"}
      </div>
    </button>
  );
};

export default PathView;