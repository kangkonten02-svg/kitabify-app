import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MATERI_DATA } from "@/lib/materiData";
import { JILID1_CONTENT, ALFIYAH_ENTRIES, getAlfiyahById, getAlfiyahByBab, type RichBab, type ContentSection } from "@/lib/jilidContent";
import { JILID2_CONTENT } from "@/lib/jilid2Content";
import { JILID3_CONTENT } from "@/lib/jilid3Content";
import { JURUMIYAH_CONTENT } from "@/lib/jurumiyahContent";
import { SAFINAH_CONTENT } from "@/lib/safinahContent";
import { getUser, saveUser, addExp } from "@/lib/store";
import { ChevronDown, BookOpen, ArrowLeft, ArrowRight, CheckCircle, Star, Bookmark, Search, X, Headphones, Lock } from "lucide-react";
import { ClickableItem } from "./InteractivePopup";
import {
  getPrevBab,
  getNextBab,
  hasQuiz,
  setPendingQuiz,
  consumePendingMateri,
  hasPassedQuiz,
  getBestQuizScore,
  QUIZ_PASS_THRESHOLD,
} from "@/lib/babNavigation";
import { markBabRead } from "@/lib/gamification";
import HeartsBar from "./HeartsBar";
import PathView from "./PathView";

// All rich content combined
const ALL_RICH_CONTENT: RichBab[] = [
  ...JILID1_CONTENT,
  ...JILID2_CONTENT,
  ...JILID3_CONTENT,
  ...JURUMIYAH_CONTENT,
  ...SAFINAH_CONTENT,
];

// Rich content renderer
const SectionCard = ({ section }: { section: ContentSection }) => {
  switch (section.type) {
    case "text":
      return (
        <div className="glass-card p-4 space-y-2">
          {section.title && <h4 className="font-bold text-foreground text-sm">{section.title}</h4>}
          {section.content && (
            <p className="text-foreground/85 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
          )}
        </div>
      );

    case "list":
      return (
        <div className="glass-card p-4 space-y-3">
          {section.title && <h4 className="font-bold text-foreground text-sm">{section.title}</h4>}
          <div className="grid grid-cols-2 gap-2">
            {section.items?.map((item, i) => (
              <ClickableItem key={i} item={item} sectionTitle={section.title} sectionType="list">
                <div className="bg-muted/50 rounded-xl p-3 flex items-center gap-3">
                  <span className="font-arabic text-lg font-bold text-primary leading-none">{item.key}</span>
                  <span className="text-xs text-muted-foreground">{item.value}</span>
                </div>
              </ClickableItem>
            ))}
          </div>
        </div>
      );

    case "grid":
      return (
        <div className="glass-card p-4 space-y-3">
          {section.title && <h4 className="font-bold text-foreground text-sm">{section.title}</h4>}
          <div className="grid grid-cols-2 gap-2">
            {section.items?.map((item, i) => (
              <ClickableItem key={i} item={item} sectionTitle={section.title} sectionType="grid">
                <div className="bg-muted/40 rounded-xl p-3 text-center">
                  <p className="font-arabic text-xl font-bold text-primary mb-1">{item.key}</p>
                  <p className="text-xs text-muted-foreground">{item.value}</p>
                </div>
              </ClickableItem>
            ))}
          </div>
        </div>
      );

    case "pairs":
      return (
        <div className="glass-card p-4 space-y-3">
          {section.title && <h4 className="font-bold text-foreground text-sm">{section.title}</h4>}
          <div className="space-y-2">
            {section.items?.map((item, i) => (
              <ClickableItem key={i} item={item} sectionTitle={section.title} sectionType="pairs">
                <div className="flex items-center gap-3 bg-muted/40 rounded-xl p-3">
                  <span className="font-arabic text-lg font-bold text-primary flex-1 text-center">{item.key}</span>
                  <span className="text-primary text-lg">↔</span>
                  <span className="font-arabic text-lg font-bold text-gold flex-1 text-center">{item.value}</span>
                </div>
              </ClickableItem>
            ))}
          </div>
        </div>
      );

    case "alfiyah": {
      const entry = section.alfiyahId ? getAlfiyahById(section.alfiyahId) : null;
      return (
        <div className="rounded-2xl border-2 border-accent/40 bg-accent/10 p-5 space-y-4">
          {section.title && <h4 className="font-bold text-accent text-sm flex items-center gap-2">{section.title}</h4>}
          {section.content && (
            <p className="text-foreground/85 text-sm leading-relaxed">{section.content}</p>
          )}
          {entry && (
            <div className="space-y-3">
              <div className="bg-background/40 rounded-xl p-5 text-center">
                <p className="font-arabic text-xl md:text-2xl leading-[2.2] font-bold whitespace-pre-line text-accent" dir="rtl" style={{ height: 'auto', overflow: 'visible' }}>
                  {entry.bait_arab}
                </p>
              </div>
              <p className="text-foreground/60 text-sm italic text-center leading-relaxed whitespace-pre-line">
                {entry.bait_latin}
              </p>
              <div className="border-t border-accent/20 pt-3">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  📖 {entry.arti}
                </p>
              </div>
            </div>
          )}
          {section.explanation && (
            <p className="text-sm text-foreground/80 bg-muted/30 rounded-lg p-3">
              💡 {section.explanation}
            </p>
          )}
        </div>
      );
    }

    case "kaidah":
      return (
        <div className="rounded-2xl border-2 border-primary/30 bg-primary/10 p-4 space-y-3">
          {section.title && <h4 className="font-bold text-primary text-sm">{section.title}</h4>}
          {section.content && (
            <p className="text-foreground/85 text-sm leading-relaxed">{section.content}</p>
          )}
          {section.arabic && (
            <div className="bg-background/40 rounded-xl p-4 text-center">
              <p className="font-arabic text-xl leading-loose text-accent font-bold whitespace-pre-line" dir="rtl">
                {section.arabic}
              </p>
            </div>
          )}
          {section.translation && (
            <p className="text-xs text-muted-foreground italic border-t border-primary/20 pt-2">
              📖 {section.translation}
            </p>
          )}
          {section.explanation && (
            <p className="text-sm text-foreground/80 bg-muted/30 rounded-lg p-3">
              💡 {section.explanation}
            </p>
          )}
        </div>
      );

    case "example":
      return (
        <div className="glass-card p-4 space-y-3 border-l-4 border-gold">
          {section.title && <h4 className="font-bold text-foreground text-sm">{section.title}</h4>}
          {section.content && (
            <p className="text-foreground/80 text-sm">{section.content}</p>
          )}
          {section.items?.map((item, i) => (
            <ClickableItem key={i} item={item} sectionTitle={section.title} sectionType="example">
              <div className="bg-muted/40 rounded-xl p-3">
                <p className="font-semibold text-primary text-xs mb-1">{item.key}</p>
                <p className="text-sm text-foreground/90 font-arabic-mixed">{item.value}</p>
              </div>
            </ClickableItem>
          ))}
        </div>
      );

    case "table": {
      const tableAlfiyah = section.alfiyahId ? getAlfiyahById(section.alfiyahId) : null;
      return (
        <div className="glass-card p-4 space-y-3">
          {section.title && <h4 className="font-bold text-foreground text-sm">{section.title}</h4>}
          <div className="space-y-2">
            {section.rows?.map((row, i) => (
              <ClickableItem key={i} item={{ key: row.label, value: row.value }} sectionTitle={section.title} sectionType="table">
                <div className="flex items-center bg-muted/40 rounded-xl overflow-hidden">
                  <div className="bg-primary/20 px-4 py-3 w-24 text-center">
                    <span className="text-sm font-bold text-primary">{row.label}</span>
                  </div>
                  <div className="px-4 py-3">
                    <span className="text-sm text-foreground">{row.value}</span>
                  </div>
                </div>
              </ClickableItem>
            ))}
          </div>
          {tableAlfiyah ? (
            <div className="rounded-2xl border-2 border-accent/40 bg-accent/10 p-4 space-y-3 mt-2">
              <h4 className="font-bold text-accent text-sm">📖 Dasar Alfiyah</h4>
              <div className="bg-background/40 rounded-xl p-5 text-center">
                <p className="font-arabic text-xl leading-[2.2] font-bold whitespace-pre-line text-accent" dir="rtl" style={{ height: 'auto', overflow: 'visible' }}>
                  {tableAlfiyah.bait_arab}
                </p>
              </div>
              <p className="text-foreground/60 text-sm italic text-center leading-relaxed whitespace-pre-line">
                {tableAlfiyah.bait_latin}
              </p>
              <div className="border-t border-accent/20 pt-3">
                <p className="text-muted-foreground text-sm leading-relaxed">📖 {tableAlfiyah.arti}</p>
              </div>
            </div>
          ) : section.arabic ? (
            <div className="bg-primary/10 rounded-xl p-4 text-center border border-primary/20 mt-2">
              <p className="font-arabic text-lg leading-loose text-accent font-bold whitespace-pre-line" dir="rtl">
                {section.arabic}
              </p>
              {section.translation && (
                <p className="text-xs text-muted-foreground italic mt-2">📖 {section.translation}</p>
              )}
            </div>
          ) : null}
        </div>
      );
    }

    case "contoh_kalimat":
      return (
        <div className="glass-card p-4 space-y-3 border-l-4 border-primary">
          {section.title && <h4 className="font-bold text-foreground text-sm">{section.title}</h4>}
          {section.content && (
            <p className="text-foreground/80 text-sm">{section.content}</p>
          )}
          <div className="space-y-2">
            {section.items?.map((item, i) => (
              <div key={i} className="bg-muted/30 rounded-xl p-5 flex items-start gap-3">
                <div className="flex-1">
                  <p className="font-arabic text-3xl md:text-4xl font-bold text-accent leading-[2.4] whitespace-pre-line" dir="rtl" style={{ height: 'auto', overflow: 'visible' }}>
                    {item.key}
                  </p>
                  {item.value && (
                    <p className="text-base text-muted-foreground mt-2">{item.value}</p>
                  )}
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(item.key || "")}
                  className="p-1.5 rounded-lg hover:bg-muted/60 transition text-muted-foreground flex-shrink-0"
                  title="Copy"
                >
                  📋
                </button>
              </div>
            ))}
          </div>
        </div>
      );

    case "ayat":
      return (
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5 space-y-4">
          {section.title && <h4 className="font-bold text-accent text-sm">{section.title}</h4>}
          {section.content && (
            <p className="text-foreground/80 text-sm mb-2">{section.content}</p>
          )}
          <div className="space-y-3">
            {section.items?.map((item, i) => (
              <div key={i} className="bg-background/40 rounded-xl p-6 text-center relative group">
                <p className="font-arabic text-3xl md:text-4xl font-bold text-accent leading-[2.4] whitespace-pre-line" dir="rtl" style={{ height: 'auto', overflow: 'visible' }}>
                  {item.key}
                </p>
                {item.value && (
                  <p className="text-base text-muted-foreground mt-3 italic">{item.value}</p>
                )}
                <button
                  onClick={() => navigator.clipboard.writeText(item.key || "")}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-muted/40 hover:bg-muted/70 transition text-muted-foreground opacity-0 group-hover:opacity-100 text-xs"
                  title="Copy Ayat"
                >
                  📋
                </button>
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
};

const RichContentViewer = ({
  bab,
  onBack,
  babId,
  kitabId,
  jilidId,
  onSelectBab,
  onGoKuis,
}: {
  bab: RichBab;
  onBack: () => void;
  babId: string;
  kitabId: string;
  jilidId: string;
  onSelectBab: (loc: { kitabId: string; jilidId: string; babId: string }) => void;
  onGoKuis: () => void;
}) => {
  const user = getUser();
  const isRead = user?.materiProgress[babId] === 100;
  const [marked, setMarked] = useState(isRead);
  const [bookmarked, setBookmarked] = useState(() => {
    const bms = JSON.parse(localStorage.getItem("kitabify_bookmarks") || "[]") as string[];
    return bms.includes(babId);
  });

  const prev = getPrevBab({ kitabId, jilidId, babId });
  const next = getNextBab({ kitabId, jilidId, babId });
  const quizAvailable = hasQuiz(jilidId, babId);
  const passedThisBab = hasPassedQuiz(babId);
  const bestScore = getBestQuizScore(babId);

  const markAsRead = () => {
    if (!user || marked) return;
    user.materiProgress[babId] = 100;
    saveUser(user);
    addExp(15, `Belajar: ${bab.title}`);
    setMarked(true);
    markBabRead({ kitabId, jilidId, babId });
    window.dispatchEvent(new Event("storage"));
  };

  const handleNext = () => {
    if (!marked) markAsRead();
    if (quizAvailable) {
      setPendingQuiz({ kitabId, jilidId, babId });
      onGoKuis();
    } else if (next) {
      onSelectBab({ kitabId: next.kitabId, jilidId: next.jilidId, babId: next.babId });
    }
  };

  const handleSkipToNext = () => {
    if (!marked) markAsRead();
    if (next) {
      onSelectBab({ kitabId: next.kitabId, jilidId: next.jilidId, babId: next.babId });
    }
  };

  const handleStartQuiz = () => {
    if (!marked) markAsRead();
    setPendingQuiz({ kitabId, jilidId, babId });
    onGoKuis();
  };

  const handlePrev = () => {
    if (prev) onSelectBab({ kitabId: prev.kitabId, jilidId: prev.jilidId, babId: prev.babId });
  };

  const toggleBookmark = () => {
    const bms = JSON.parse(localStorage.getItem("kitabify_bookmarks") || "[]") as string[];
    if (bookmarked) {
      localStorage.setItem("kitabify_bookmarks", JSON.stringify(bms.filter((b) => b !== babId)));
    } else {
      localStorage.setItem("kitabify_bookmarks", JSON.stringify([...bms, babId]));
    }
    setBookmarked(!bookmarked);
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-5">
        <button onClick={onBack} className="flex items-center gap-2 text-primary text-sm font-semibold">
          <ArrowLeft size={18} /> Kembali
        </button>
        <button onClick={toggleBookmark} className="p-2 rounded-xl hover:bg-muted/50 transition">
          <Bookmark size={20} className={bookmarked ? "fill-gold text-gold" : "text-muted-foreground"} />
        </button>
      </div>

      <motion.h2
        className="text-xl font-extrabold text-foreground mb-5"
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      >
        {bab.title}
      </motion.h2>

      <div className="space-y-4">
        {bab.sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <SectionCard section={section} />
          </motion.div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="mt-6 space-y-3">
        {babId !== "muqoddimah" && (
          <button
            onClick={markAsRead}
            disabled={marked}
            className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
              marked ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
            }`}
          >
            {marked ? (
              <><CheckCircle size={16} /> Sudah selesai membaca ✓</>
            ) : (
              <><Star size={16} /> Selesai membaca (+15 EXP)</>
            )}
          </button>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handlePrev}
            disabled={!prev}
            className="py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 bg-muted text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted/70 transition"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <button
            onClick={handleNext}
            disabled={!next && !quizAvailable}
            className="py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 bg-accent text-accent-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent/90 transition"
          >
            {quizAvailable ? <><Headphones size={16} /> Kerjakan Kuis</> : <>Next <ArrowRight size={16} /></>}
          </button>
        </div>
        {quizAvailable && next && (
          <button
            onClick={handleSkipToNext}
            className="w-full py-2.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition flex items-center justify-center gap-1.5 border border-dashed border-muted-foreground/30"
          >
            Lompati soal & lanjut ke {next.babTitle} <ArrowRight size={14} />
          </button>
        )}
        {quizAvailable && (
          <div
            className={`px-3 py-2.5 rounded-xl text-xs text-center ${
              passedThisBab
                ? "bg-primary/10 text-primary"
                : "bg-muted/40 text-muted-foreground"
            }`}
          >
            {passedThisBab ? (
              <>✓ Kuis lulus ({bestScore}/10) — bab berikutnya terbuka</>
            ) : (
              <>🔒 Selesaikan kuis dengan skor minimal {QUIZ_PASS_THRESHOLD}/10 untuk membuka bab berikutnya</>
            )}
          </div>
        )}
        {quizAvailable && passedThisBab && next && (
          <button
            onClick={() => onSelectBab({ kitabId: next.kitabId, jilidId: next.jilidId, babId: next.babId })}
            className="w-full py-2.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition flex items-center justify-center gap-1.5"
          >
            Lanjut ke bab berikutnya <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

// Search result type
interface SearchResult {
  kitabId: string;
  kitabTitle: string;
  kitabIcon: string;
  jilidId: string;
  jilidTitle: string;
  babId: string;
  babTitle: string;
  matchType: "kitab" | "bab" | "content";
  snippet?: string;
}

interface MateriPageProps {
  onGoKuis?: () => void;
  initialKitabId?: string | null;
}

const MateriPage = ({ onGoKuis, initialKitabId }: MateriPageProps = {}) => {
  const [openKitab, setOpenKitab] = useState<string | null>(null);
  const [openJilid, setOpenJilid] = useState<string | null>(null);
  const [selectedBab, setSelectedBab] = useState<{ kitabId: string; jilidId: string; babId: string } | null>(null);
  const [showKholasoh, setShowKholasoh] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [, setRefresh] = useState(0);
  // Filter to a single kitab when user arrives via "Materi Populer"
  const [filterKitabId, setFilterKitabId] = useState<string | null>(initialKitabId ?? null);

  // React to changes from parent (user picks another kitab from dashboard)
  useEffect(() => {
    if (initialKitabId !== undefined) {
      setFilterKitabId(initialKitabId ?? null);
      if (initialKitabId) {
        const kitab = MATERI_DATA.find((k) => k.id === initialKitabId);
        if (kitab?.isKholasoh) {
          setShowKholasoh(true);
        } else {
          setShowKholasoh(false);
          setOpenKitab(initialKitabId);
        }
      }
    }
  }, [initialKitabId]);

  // Consume pending navigation hint (e.g. when returning from Kuis page)
  useEffect(() => {
    const pending = consumePendingMateri();
    if (pending) {
      setOpenKitab(pending.kitabId);
      setOpenJilid(pending.jilidId);
      setSelectedBab(pending);
    }
  }, []);

  useEffect(() => {
    const handler = () => setRefresh((r) => r + 1);
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const user = getUser();

  // Build search index
  const searchResults = useMemo<SearchResult[]>(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q || q.length < 2) return [];

    const results: SearchResult[] = [];

    for (const kitab of MATERI_DATA) {
      if (kitab.isKholasoh) continue;

      const kitabMatch = kitab.title.toLowerCase().includes(q);

      for (const jilid of kitab.jilids) {
        for (const bab of jilid.babs) {
          const babMatch = bab.title.toLowerCase().includes(q);

          // Search in rich content
          const richBab = ALL_RICH_CONTENT.find((r) => r.id === bab.id);
          let contentMatch = false;
          let snippet = "";

          if (richBab) {
            for (const section of richBab.sections) {
              const texts = [
                section.title || "",
                section.content || "",
                section.arabic || "",
                section.translation || "",
                ...(section.items?.map((i) => `${i.key} ${i.value}`) || []),
                ...(section.rows?.map((r) => `${r.label} ${r.value}`) || []),
              ].join(" ").toLowerCase();

              if (texts.includes(q)) {
                contentMatch = true;
                // Extract snippet
                const idx = texts.indexOf(q);
                const start = Math.max(0, idx - 20);
                const end = Math.min(texts.length, idx + q.length + 30);
                snippet = (start > 0 ? "..." : "") + texts.slice(start, end) + (end < texts.length ? "..." : "");
                break;
              }
            }
          }

          // Also search simple content
          if (!contentMatch && bab.content?.toLowerCase().includes(q)) {
            contentMatch = true;
            const idx = bab.content.toLowerCase().indexOf(q);
            const start = Math.max(0, idx - 20);
            const end = Math.min(bab.content.length, idx + q.length + 30);
            snippet = (start > 0 ? "..." : "") + bab.content.slice(start, end) + (end < bab.content.length ? "..." : "");
          }

          if (kitabMatch || babMatch || contentMatch) {
            results.push({
              kitabId: kitab.id,
              kitabTitle: kitab.title,
              kitabIcon: kitab.icon,
              jilidId: jilid.id,
              jilidTitle: jilid.title,
              babId: bab.id,
              babTitle: bab.title,
              matchType: contentMatch ? "content" : babMatch ? "bab" : "kitab",
              snippet: snippet || undefined,
            });
          }
        }
      }
    }

    return results.slice(0, 15);
  }, [searchQuery]);

  // Check if this bab has rich content
  const richBab = selectedBab
    ? ALL_RICH_CONTENT.find((b) => b.id === selectedBab.babId)
    : null;

  // Fallback to simple content
  const simpleBab = selectedBab
    ? MATERI_DATA.find((k) => k.id === selectedBab.kitabId)
        ?.jilids.find((j) => j.id === selectedBab.jilidId)
        ?.babs.find((b) => b.id === selectedBab.babId)
    : null;

  // Show rich content viewer
  if (selectedBab && richBab) {
    return (
      <RichContentViewer
        bab={richBab}
        babId={selectedBab.babId}
        kitabId={selectedBab.kitabId}
        jilidId={selectedBab.jilidId}
        onBack={() => setSelectedBab(null)}
        onSelectBab={(loc) => {
          setOpenKitab(loc.kitabId);
          setOpenJilid(loc.jilidId);
          setSelectedBab(loc);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onGoKuis={() => onGoKuis?.()}
      />
    );
  }

  // Show simple content (fallback)
  if (selectedBab && simpleBab) {
    const isRead = user?.materiProgress[selectedBab.babId] === 100;
    const prev = getPrevBab(selectedBab);
    const next = getNextBab(selectedBab);
    const quizAvailable = hasQuiz(selectedBab.jilidId, selectedBab.babId);
    const markAsRead = () => {
      if (!user) return;
      user.materiProgress[selectedBab.babId] = 100;
      saveUser(user);
      addExp(15, `Belajar: ${simpleBab.title}`);
      markBabRead(selectedBab);
      setRefresh((r) => r + 1);
    };
    const goToBab = (loc: { kitabId: string; jilidId: string; babId: string }) => {
      setOpenKitab(loc.kitabId);
      setOpenJilid(loc.jilidId);
      setSelectedBab(loc);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const handleNext = () => {
      if (!isRead) markAsRead();
      if (quizAvailable && selectedBab) {
        setPendingQuiz(selectedBab);
        onGoKuis?.();
      } else if (next) {
        goToBab({ kitabId: next.kitabId, jilidId: next.jilidId, babId: next.babId });
      }
    };

    return (
      <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
        <button onClick={() => setSelectedBab(null)} className="flex items-center gap-2 text-primary mb-4 text-sm font-semibold">
          <ArrowLeft size={18} /> Kembali
        </button>
        <motion.div className="glass-card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-xl font-bold text-foreground mb-4">{simpleBab.title}</h2>
          {simpleBab.content ? (
            <p className="text-foreground/90 leading-relaxed text-sm">{simpleBab.content}</p>
          ) : (
            <p className="text-muted-foreground italic text-sm">Materi sedang disusun...</p>
          )}
        </motion.div>

        {simpleBab.content && (
          <div className="mt-6 space-y-3">
            <button
              onClick={markAsRead}
              disabled={isRead}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 ${
                isRead ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
              }`}
            >
              <CheckCircle size={16} />
              {isRead ? "Sudah selesai membaca ✓" : "Selesai membaca (+15 EXP)"}
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => prev && goToBab({ kitabId: prev.kitabId, jilidId: prev.jilidId, babId: prev.babId })}
                disabled={!prev}
                className="py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 bg-muted text-foreground disabled:opacity-40 hover:bg-muted/70 transition"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                onClick={handleNext}
                disabled={!next && !quizAvailable}
                className="py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 bg-accent text-accent-foreground disabled:opacity-40 hover:bg-accent/90 transition"
              >
                {quizAvailable ? <><Headphones size={16} /> Kerjakan Kuis</> : <>Next <ArrowRight size={16} /></>}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Kholasoh Alfiyah view
  if (showKholasoh) {
    const grouped = getAlfiyahByBab();
    return (
      <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
        <button onClick={() => setShowKholasoh(false)} className="flex items-center gap-2 text-primary mb-5 text-sm font-semibold">
          <ArrowLeft size={18} /> Kembali
        </button>
        <motion.h2
          className="text-xl font-extrabold text-foreground mb-5"
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        >
          📗 Kholasoh Alfiyah
        </motion.h2>
        <p className="text-muted-foreground text-sm mb-6">Kumpulan bait-bait Alfiyah Ibnu Malik yang digunakan dalam materi Amtsilati.</p>
        <div className="space-y-6">
          {Object.entries(grouped).map(([bab, entries]) => (
            <motion.div key={bab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <h3 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                <BookOpen size={16} /> {bab}
              </h3>
              <div className="space-y-3">
                {entries.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border-2 border-accent/40 bg-accent/10 p-5 space-y-3">
                    <div className="bg-background/40 rounded-xl p-5 text-center">
                      <p className="font-arabic text-xl md:text-2xl leading-[2.2] font-bold whitespace-pre-line text-accent" dir="rtl" style={{ height: 'auto', overflow: 'visible' }}>
                        {entry.bait_arab}
                      </p>
                    </div>
                    <p className="text-foreground/60 text-sm italic text-center leading-relaxed whitespace-pre-line">
                      {entry.bait_latin}
                    </p>
                    <div className="border-t border-accent/20 pt-3">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        📖 {entry.arti}
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-semibold">
                        {entry.id}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const handleSearchSelect = (result: SearchResult) => {
    setSearchQuery("");
    setSearchFocused(false);
    setOpenKitab(result.kitabId);
    setOpenJilid(result.jilidId);
    setSelectedBab({ kitabId: result.kitabId, jilidId: result.jilidId, babId: result.babId });
  };

  // Materi list
  const visibleKitabs = filterKitabId
    ? MATERI_DATA.filter((k) => k.id === filterKitabId)
    : MATERI_DATA;
  const filteredKitab = filterKitabId ? MATERI_DATA.find((k) => k.id === filterKitabId) : null;
  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-extrabold text-foreground">
          {filteredKitab ? `${filteredKitab.icon} ${filteredKitab.title}` : "📚 Materi"}
        </h1>
        {filterKitabId && (
          <button
            onClick={() => { setFilterKitabId(null); setOpenKitab(null); setOpenJilid(null); }}
            className="text-xs font-semibold text-primary px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition flex-shrink-0"
          >
            Lihat semua
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative mb-5">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari kitab, bab, atau materi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setSearchFocused(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {searchFocused && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full left-0 right-0 mt-1 z-30 glass-card border border-border rounded-xl max-h-72 overflow-y-auto shadow-lg"
            >
              {searchResults.map((result, i) => (
                <button
                  key={`${result.babId}-${i}`}
                  onMouseDown={() => handleSearchSelect(result)}
                  className="w-full px-4 py-3 text-left hover:bg-muted/50 transition flex items-start gap-3 border-b border-border/50 last:border-b-0"
                >
                  <span className="text-lg flex-shrink-0 mt-0.5">{result.kitabIcon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{result.babTitle}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {result.kitabTitle} → {result.jilidTitle}
                    </p>
                    {result.snippet && (
                      <p className="text-xs text-muted-foreground/70 mt-0.5 truncate italic">
                        "{result.snippet}"
                      </p>
                    )}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 mt-1 ${
                    result.matchType === "content" ? "bg-accent/20 text-accent" :
                    result.matchType === "bab" ? "bg-primary/20 text-primary" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {result.matchType === "content" ? "Isi" : result.matchType === "bab" ? "Bab" : "Kitab"}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
          {searchFocused && searchQuery.length >= 2 && searchResults.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute top-full left-0 right-0 mt-1 z-30 glass-card border border-border rounded-xl p-4 text-center shadow-lg"
            >
              <p className="text-sm text-muted-foreground">Tidak ditemukan hasil untuk "{searchQuery}"</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Kitab List */}
      <div className="space-y-3">
        {visibleKitabs.map((kitab) => (
          <div key={kitab.id} className="glass-card overflow-hidden">
            <button
              onClick={() => kitab.isKholasoh ? setShowKholasoh(true) : setOpenKitab(openKitab === kitab.id ? null : kitab.id)}
              className="w-full flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{kitab.icon}</span>
                <div className="text-left">
                  <span className="font-bold text-foreground">{kitab.title}</span>
                  <p className="text-xs text-muted-foreground">
                    {kitab.isKholasoh
                      ? `${ALFIYAH_ENTRIES.length} bait`
                      : `${kitab.jilids.length} jilid • ${kitab.jilids.reduce((s, j) => s + j.babs.length, 0)} bab`
                    }
                  </p>
                </div>
              </div>
              {kitab.isKholasoh ? (
                <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-semibold">
                  {ALFIYAH_ENTRIES.length} bait
                </span>
              ) : (
                <ChevronDown
                  size={18}
                  className={`text-muted-foreground transition-transform duration-200 ${openKitab === kitab.id ? "rotate-180" : ""}`}
                />
              )}
            </button>
            <AnimatePresence>
              {openKitab === kitab.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-3 space-y-2">
                    {kitab.jilids.map((jilid) => (
                      <div key={jilid.id}>
                        <button
                          onClick={() => setOpenJilid(openJilid === jilid.id ? null : jilid.id)}
                          className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl bg-muted/50 hover:bg-muted transition"
                        >
                          <span className="text-sm font-semibold text-foreground">📂 {jilid.title}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground">{jilid.babs.length} bab</span>
                            <ChevronDown
                              size={14}
                              className={`text-muted-foreground transition-transform duration-200 ${openJilid === jilid.id ? "rotate-180" : ""}`}
                            />
                          </div>
                        </button>
                        <AnimatePresence>
                          {openJilid === jilid.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 py-2 space-y-1">
                                {jilid.babs.map((b, babIdx) => {
                                  const done = user?.materiProgress[b.id] === 100;
                                  const hasRich = ALL_RICH_CONTENT.some((rc) => rc.id === b.id);
                                  // Determine prev bab in this jilid; lock if prev has a quiz not yet passed.
                                  const prevB = babIdx > 0 ? jilid.babs[babIdx - 1] : null;
                                  const prevQuiz = prevB ? hasQuiz(jilid.id, prevB.id) : false;
                                  const locked =
                                    prevB && prevQuiz && !hasPassedQuiz(prevB.id);
                                  return (
                                    <button
                                      key={b.id}
                                      onClick={() => {
                                        if (locked) return;
                                        setSelectedBab({ kitabId: kitab.id, jilidId: jilid.id, babId: b.id });
                                      }}
                                      disabled={!!locked}
                                      className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-lg transition text-left ${
                                        locked
                                          ? "opacity-50 cursor-not-allowed"
                                          : "hover:bg-muted/50"
                                      }`}
                                    >
                                      {locked ? (
                                        <Lock size={16} className="text-muted-foreground flex-shrink-0" />
                                      ) : done ? (
                                        <CheckCircle size={16} className="text-primary flex-shrink-0" />
                                      ) : (
                                        <BookOpen size={16} className="text-muted-foreground flex-shrink-0" />
                                      )}
                                      <span className={`text-sm flex-1 ${done ? "text-primary font-medium" : "text-foreground"}`}>
                                        {b.title}
                                      </span>
                                      {locked && (
                                        <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-semibold">
                                          Terkunci
                                        </span>
                                      )}
                                      {!locked && hasRich && (
                                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-semibold">
                                          Lengkap
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MateriPage;
