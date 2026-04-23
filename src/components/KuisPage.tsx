import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  JILID_LIST,
  type NahwuJilid,
  type NahwuBab,
  type NahwuSoal,
  type JilidColor,
} from "@/lib/nahwuQuizData";
import { addExp, getUser, saveUser } from "@/lib/store";
import {
  CheckCircle, XCircle, Trophy, RotateCcw, ArrowLeft, ArrowRight,
  BookOpen, GraduationCap, Sparkles, Gift, ChevronRight, List, Lightbulb,
} from "lucide-react";

type Phase = "jilid" | "bab" | "quiz" | "result";
type Mode = "latihan" | "ujian";
type Letter = "A" | "B" | "C" | "D";

interface AnswerLog {
  soal: NahwuSoal;
  picked: Letter | null;
  correct: boolean;
}

interface KuisPageProps {
  onGoMateri?: () => void;
}

const LETTERS: Letter[] = ["A", "B", "C", "D"];

// =================== Color helpers per Jilid ===================
const COLOR_MAP: Record<JilidColor, {
  text: string; bg: string; bgSoft: string; border: string; ring: string; gradFrom: string; gradTo: string;
}> = {
  green:  { text: "text-emerald-400", bg: "bg-emerald-500", bgSoft: "bg-emerald-500/15", border: "border-emerald-500/40", ring: "ring-emerald-500/40", gradFrom: "from-emerald-500/20", gradTo: "to-emerald-700/10" },
  blue:   { text: "text-sky-400",     bg: "bg-sky-500",     bgSoft: "bg-sky-500/15",     border: "border-sky-500/40",     ring: "ring-sky-500/40",     gradFrom: "from-sky-500/20",     gradTo: "to-sky-700/10" },
  orange: { text: "text-orange-400",  bg: "bg-orange-500",  bgSoft: "bg-orange-500/15",  border: "border-orange-500/40",  ring: "ring-orange-500/40",  gradFrom: "from-orange-500/20",  gradTo: "to-orange-700/10" },
};

/** Render question with ____ highlighted as a yellow inline pill */
function QuestionText({ text }: { text: string }) {
  const parts = text.split(/(____+)/g);
  // Heuristic: kalau ada huruf arab dominan, RTL; kalau campuran instruksi Indonesia, biarkan auto.
  const isMostlyArabic = (text.match(/[\u0600-\u06FF]/g) || []).length > 8;
  return (
    <p
      dir={isMostlyArabic ? "rtl" : "auto"}
      className={`font-arabic text-2xl leading-loose text-foreground ${isMostlyArabic ? "text-right" : "text-right"}`}
    >
      {parts.map((p, i) =>
        /^_+$/.test(p) ? (
          <span
            key={i}
            className="inline-block mx-1 px-3 py-0.5 rounded-md bg-accent/30 border-b-2 border-accent text-accent-foreground font-bold"
          >
            ـــــ
          </span>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </p>
  );
}

const KuisPage = ({ onGoMateri }: KuisPageProps = {}) => {
  const [phase, setPhase] = useState<Phase>("jilid");
  const [mode, setMode] = useState<Mode>("latihan");
  const [activeJilid, setActiveJilid] = useState<NahwuJilid | null>(null);
  const [activeBab, setActiveBab] = useState<NahwuBab | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [picked, setPicked] = useState<Letter | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [logs, setLogs] = useState<AnswerLog[]>([]);
  const [bonusOpened, setBonusOpened] = useState(false);
  const [bonusExp, setBonusExp] = useState(0);

  const user = getUser();
  const bestScores: Record<string, number> = useMemo(
    () => (user?.quizScores ?? {}) as Record<string, number>,
    [user]
  );

  const score = useMemo(() => logs.filter((l) => l.correct).length, [logs]);

  // ============ Navigation ============
  const openJilid = (j: NahwuJilid) => {
    setActiveJilid(j);
    setPhase("bab");
  };
  const backToJilid = () => {
    setActiveJilid(null);
    setActiveBab(null);
    setPhase("jilid");
  };
  const backToBab = () => {
    setActiveBab(null);
    setPhase("bab");
  };

  const startQuiz = (bab: NahwuBab) => {
    setActiveBab(bab);
    setCurrentQ(0);
    setPicked(null);
    setShowFeedback(false);
    setLogs([]);
    setBonusOpened(false);
    setBonusExp(0);
    setPhase("quiz");
  };

  const handlePick = (letter: Letter) => {
    if (showFeedback || !activeBab) return;
    const soal = activeBab.soal[currentQ];
    const correct = soal.jawaban === letter;
    setPicked(letter);
    setLogs((prev) => [...prev, { soal, picked: letter, correct }]);
    if (mode === "latihan") {
      setShowFeedback(true);
    } else {
      setTimeout(() => goNext(), 150);
    }
  };

  const goNext = () => {
    if (!activeBab) return;
    if (currentQ + 1 >= activeBab.soal.length) {
      finish();
    } else {
      setCurrentQ((c) => c + 1);
      setPicked(null);
      setShowFeedback(false);
    }
  };

  const finish = () => {
    if (!activeBab) return;
    const finalScore = logs.filter((l) => l.correct).length;
    const total = activeBab.soal.length;
    const exp = finalScore * 15;
    addExp(exp, `Kuis Nahwu: ${activeBab.title}`);
    const u = getUser();
    if (u) {
      u.quizScores[activeBab.id] = Math.max(u.quizScores[activeBab.id] || 0, finalScore);
      saveUser(u);
    }
    try {
      const hist = JSON.parse(localStorage.getItem("kitabify_quiz_history") || "[]");
      const entry = {
        babTitle: `${activeJilid?.title} • ${activeBab.title}`,
        score: finalScore, total, date: new Date().toISOString(),
      };
      localStorage.setItem("kitabify_quiz_history", JSON.stringify([entry, ...hist].slice(0, 20)));
    } catch { /* ignore */ }
    setPhase("result");
  };

  const calcBonus = (s: number, total: number) => {
    const pct = total === 0 ? 0 : (s / total) * 100;
    if (pct >= 85) return 100;
    if (pct >= 70) return 50;
    if (pct >= 55) return 10;
    return 0;
  };

  // =====================================================
  // PHASE: QUIZ
  // =====================================================
  if (phase === "quiz" && activeBab && activeJilid) {
    const c = COLOR_MAP[activeJilid.color];
    const soal = activeBab.soal[currentQ];
    const total = activeBab.soal.length;
    const progressPct = ((currentQ + (showFeedback ? 1 : 0)) / total) * 100;
    const isCorrect = picked === soal.jawaban;

    return (
      <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-3">
          <button onClick={backToBab} className={`${c.text} text-sm font-semibold flex items-center gap-1`}>
            <ArrowLeft size={16} /> Kembali
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-bold">
              {mode === "latihan" ? "Latihan" : "Ujian"}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              Soal {currentQ + 1} dari {total}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-1">
          <div
            className={`h-full ${c.bg} rounded-full transition-all duration-300`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-[10px] text-right text-muted-foreground mb-4">{Math.round(progressPct)}%</p>

        <p className="text-xs text-muted-foreground mb-2 font-semibold">
          {activeJilid.title} • Bab {activeBab.number} — {activeBab.title}
        </p>

        <div className="glass-card p-5 mb-4">
          <QuestionText text={soal.soal} />
        </div>

        <div className="space-y-3">
          {LETTERS.map((letter) => {
            const opt = soal.pilihan[letter];
            let cls =
              "w-full text-right p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ";
            if (showFeedback) {
              if (letter === soal.jawaban) cls += `${c.border} ${c.bgSoft} ${c.text} `;
              else if (letter === picked) cls += "border-destructive bg-destructive/15 text-destructive ";
              else cls += "border-border bg-muted/30 text-muted-foreground opacity-60 ";
            } else if (picked === letter) {
              cls += `${c.border} ${c.bgSoft} text-foreground `;
            } else {
              cls += "border-border bg-card text-foreground hover:border-primary/50 ";
            }
            return (
              <motion.button
                key={letter}
                onClick={() => handlePick(letter)}
                disabled={showFeedback}
                className={cls}
                whileTap={{ scale: showFeedback ? 1 : 0.98 }}
              >
                <span className="font-arabic text-xl flex-1 text-right" dir="rtl">{opt}</span>
                <span className="w-9 h-9 shrink-0 rounded-full border-2 border-current flex items-center justify-center font-bold text-sm">
                  {letter}
                </span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-2xl border-2 ${
                isCorrect ? `${c.border} ${c.bgSoft}` : "border-destructive bg-destructive/10"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <>
                    <CheckCircle className={c.text} size={20} />
                    <span className={`font-bold ${c.text}`}>Benar! ✅</span>
                  </>
                ) : (
                  <>
                    <XCircle className="text-destructive" size={20} />
                    <span className="font-bold text-destructive">Salah ❌</span>
                  </>
                )}
              </div>
              {!isCorrect && (
                <p className="text-sm mb-1.5">
                  Jawaban benar:{" "}
                  <strong className={`font-arabic text-lg ${c.text}`}>
                    {soal.jawaban}. {soal.pilihan[soal.jawaban]}
                  </strong>
                </p>
              )}
              <p className="text-sm text-muted-foreground leading-relaxed">{soal.pembahasan}</p>
              <button
                onClick={() => goNext()}
                className={`mt-3 w-full py-3 rounded-xl ${c.bg} text-white font-bold text-sm`}
              >
                {currentQ + 1 >= total ? "Lihat Hasil →" : "Lanjut Soal →"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!showFeedback && mode === "ujian" && (
          <p className="text-center text-xs text-muted-foreground mt-4">
            Mode ujian — pembahasan ditampilkan di akhir
          </p>
        )}
      </div>
    );
  }

  // =====================================================
  // PHASE: RESULT
  // =====================================================
  if (phase === "result" && activeBab && activeJilid) {
    const c = COLOR_MAP[activeJilid.color];
    const total = activeBab.soal.length;
    const pct = Math.round((score / total) * 100);
    const totalExp = score * 15;
    const possibleBonus = calcBonus(score, total);

    const openGift = () => {
      if (bonusOpened || possibleBonus <= 0) return;
      addExp(possibleBonus, `Bonus Kuis: ${activeBab.title}`);
      setBonusExp(possibleBonus);
      setBonusOpened(true);
    };

    return (
      <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-6 text-center mb-4"
        >
          <Trophy className={`${c.text} mx-auto mb-3`} size={56} />
          <h2 className="text-2xl font-extrabold mb-1">Hasil Kuis 🎉</h2>
          <p className="text-sm text-muted-foreground mb-3">
            {activeJilid.title} • {activeBab.title}
          </p>
          <div className="my-4 p-4 rounded-xl bg-muted/40">
            <p className={`text-4xl font-extrabold ${c.text}`}>{score}/{total}</p>
            <p className="text-sm text-muted-foreground mt-1">{pct}% benar • +{totalExp} EXP</p>
          </div>

          {possibleBonus > 0 ? (
            !bonusOpened ? (
              <motion.button
                onClick={openGift}
                className={`w-full py-4 rounded-2xl bg-gradient-to-br from-accent via-primary to-accent text-primary-foreground font-bold flex flex-col items-center gap-1 mb-4`}
                whileTap={{ scale: 0.95 }}
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
              >
                <Gift size={32} />
                <span>🎁 Buka Kado Bonus EXP!</span>
              </motion.button>
            ) : (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`p-4 rounded-2xl bg-gradient-to-br ${c.gradFrom} ${c.gradTo} border-2 ${c.border} mb-4`}
              >
                <Sparkles className={`${c.text} mx-auto mb-1`} size={28} />
                <p className={`text-xl font-extrabold ${c.text}`}>+{bonusExp} EXP</p>
              </motion.div>
            )
          ) : (
            <p className="text-xs text-muted-foreground mb-4">
              Capai ≥ 55% untuk membuka bonus EXP 🎁
            </p>
          )}
        </motion.div>

        <div className="glass-card p-4 mb-4">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <BookOpen size={18} className={c.text} />
            Pembahasan
          </h3>
          <div className="space-y-3">
            {logs.map((log, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border ${
                  log.correct ? `${c.border} ${c.bgSoft}` : "border-destructive/30 bg-destructive/5"
                }`}
              >
                <div className="flex items-start gap-2 mb-1.5">
                  <span className="text-xs font-bold text-muted-foreground">#{i + 1}</span>
                  {log.correct ? (
                    <CheckCircle className={`${c.text} shrink-0`} size={16} />
                  ) : (
                    <XCircle className="text-destructive shrink-0" size={16} />
                  )}
                </div>
                <div className="font-arabic text-base mb-1.5 text-right" dir="rtl">
                  {log.soal.soal.replace(/____+/g, "ـــــ")}
                </div>
                {!log.correct && (
                  <p className="text-xs mb-1">
                    <span className="text-muted-foreground">Jawabanmu: </span>
                    <span className="text-destructive font-bold">
                      {log.picked ? `${log.picked}. ${log.soal.pilihan[log.picked]}` : "—"}
                    </span>
                  </p>
                )}
                <p className="text-xs">
                  <span className="text-muted-foreground">Benar: </span>
                  <span className={`${c.text} font-bold font-arabic`}>
                    {log.soal.jawaban}. {log.soal.pilihan[log.soal.jawaban]}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{log.soal.pembahasan}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => startQuiz(activeBab)}
            className={`w-full py-3 rounded-xl ${c.bg} text-white font-bold text-sm flex items-center justify-center gap-2`}
          >
            <RotateCcw size={16} /> Ulangi Kuis
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onGoMateri?.()}
              className="py-3 rounded-xl bg-muted text-foreground font-semibold text-sm flex items-center justify-center gap-1.5"
            >
              <BookOpen size={14} /> Materi
            </button>
            <button
              onClick={backToBab}
              className="py-3 rounded-xl bg-accent text-accent-foreground font-semibold text-sm flex items-center justify-center gap-1.5"
            >
              Daftar Bab <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // PHASE: BAB LIST (level 2)
  // =====================================================
  if (phase === "bab" && activeJilid) {
    const c = COLOR_MAP[activeJilid.color];
    const totalSoal = activeJilid.babs.reduce((s, b) => s + b.soal.length, 0);

    return (
      <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={backToJilid}
            className={`w-9 h-9 rounded-xl border-2 ${c.border} ${c.text} flex items-center justify-center`}
          >
            <ArrowLeft size={18} />
          </button>
          <div className={`w-10 h-10 rounded-xl ${c.bgSoft} ${c.text} flex items-center justify-center text-2xl`}>
            📘
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-extrabold truncate">{activeJilid.title}</h1>
            <p className="text-xs text-muted-foreground truncate">{activeJilid.subtitle}</p>
          </div>
        </div>

        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${c.bgSoft} ${c.text} text-xs font-bold mb-5`}>
          {activeJilid.babs.length} bab • {totalSoal} soal
        </div>

        {/* Mode toggle */}
        <div className="glass-card p-1 grid grid-cols-2 gap-1 mb-3">
          <button
            onClick={() => setMode("latihan")}
            className={`py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition ${
              mode === "latihan" ? `${c.bg} text-white` : "text-muted-foreground"
            }`}
          >
            <BookOpen size={16} /> Latihan
          </button>
          <button
            onClick={() => setMode("ujian")}
            className={`py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition ${
              mode === "ujian" ? `${c.bg} text-white` : "text-muted-foreground"
            }`}
          >
            <GraduationCap size={16} /> Ujian
          </button>
        </div>
        <p className="text-xs text-muted-foreground text-center mb-5">
          {mode === "latihan" ? "Pembahasan muncul setelah tiap soal" : "Pembahasan muncul di akhir"}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <List size={16} className={c.text} />
          <h2 className="font-bold">Pilih Bab</h2>
        </div>

        <div className="space-y-3">
          {activeJilid.babs.map((bab) => {
            const best = bestScores[bab.id] ?? 0;
            const total = bab.soal.length;
            const pct = total ? Math.round((best / total) * 100) : 0;
            return (
              <motion.button
                key={bab.id}
                onClick={() => startQuiz(bab)}
                whileTap={{ scale: 0.98 }}
                className={`glass-card w-full p-4 text-left flex items-center gap-3 hover:${c.border} transition border`}
              >
                <div className={`w-11 h-11 rounded-xl ${c.bg} text-white flex items-center justify-center text-lg font-extrabold shrink-0`}>
                  {bab.number}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground text-sm truncate">
                    Bab {bab.number} — {bab.title}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">{bab.description}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${c.bgSoft} ${c.text} font-bold`}>
                      {total} soal
                    </span>
                    {best > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/15 text-accent font-bold">
                        ⭐ {best}/{total} ({pct}%)
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight size={20} className={`${c.text} shrink-0`} />
              </motion.button>
            );
          })}
        </div>

        <div className={`mt-5 glass-card p-4 border ${c.border}`}>
          <div className="flex items-start gap-3">
            <Lightbulb className={`${c.text} shrink-0 mt-0.5`} size={20} />
            <div>
              <h3 className="font-bold text-sm mb-1">Tips Belajar</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Kerjakan soal secara bertahap dan pahami pembahasannya agar lebih mudah menguasai Nahwu.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // PHASE: JILID LIST (level 1) — DEFAULT
  // =====================================================
  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">📝</span>
        <h1 className="text-2xl font-extrabold">Kuis</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Latihan soal berbasis materi Nahwu dari Jilid 1, Jilid 2, dan Jilid 3
      </p>

      {/* Quick chips */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {JILID_LIST.map((j) => {
          const c = COLOR_MAP[j.color];
          const totalSoal = j.babs.reduce((s, b) => s + b.soal.length, 0);
          return (
            <button
              key={j.id}
              onClick={() => openJilid(j)}
              className={`p-3 rounded-2xl border-2 ${c.border} ${c.bgSoft} text-left active:scale-95 transition`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-lg">📘</span>
                <span className={`font-extrabold text-sm ${c.text}`}>{j.title}</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight">
                {j.babs.length} bab • {totalSoal} soal
              </p>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <BookOpen size={16} className="text-primary" />
        <h2 className="font-bold text-sm">Pilih Jilid untuk memulai belajar</h2>
      </div>

      <div className="space-y-3">
        {JILID_LIST.map((j) => {
          const c = COLOR_MAP[j.color];
          return (
            <motion.button
              key={j.id}
              onClick={() => openJilid(j)}
              whileTap={{ scale: 0.98 }}
              className={`glass-card w-full p-4 text-left flex items-center gap-3 border ${c.border}`}
            >
              <div className={`w-12 h-12 rounded-xl ${c.bg} text-white flex items-center justify-center text-2xl shrink-0`}>
                📘
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-extrabold ${c.text} truncate`}>{j.title}</h3>
                <p className="text-xs text-muted-foreground truncate">{j.subtitle}</p>
              </div>
              <ChevronRight size={20} className={`${c.text} shrink-0`} />
            </motion.button>
          );
        })}
      </div>

      <div className="mt-5 glass-card p-4 border border-accent/40">
        <div className="flex items-start gap-3">
          <Lightbulb className="text-accent shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-bold text-sm mb-1">Tips Belajar</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Kerjakan soal secara bertahap dan pahami pembahasannya agar lebih mudah menguasai Nahwu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KuisPage;
