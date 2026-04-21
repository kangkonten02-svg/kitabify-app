import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MATERI_DATA } from "@/lib/materiData";
import { ALL_AUDIO_QUIZZES, type AudioBabQuiz, type GeneratedQuestion, generateQuizSession, getAudioQuiz } from "@/lib/audioQuizData";
import { addExp, getUser, saveUser } from "@/lib/store";
import { ChevronDown, ChevronRight, CheckCircle, XCircle, Trophy, Play, RotateCcw, Volume2, ArrowLeft, ArrowRight, Gift, Sparkles } from "lucide-react";
import { consumePendingQuiz, getPrevBab, getNextBab, setPendingMateri } from "@/lib/babNavigation";

type Phase = "menu" | "quiz" | "result";

// TTS helper
function speakArabic(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve(); return; }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ar-SA";
    utter.rate = 0.8;
    utter.onend = () => resolve();
    utter.onerror = () => resolve();
    window.speechSynthesis.speak(utter);
  });
}

interface KuisPageProps {
  onGoMateri?: () => void;
}

const KuisPage = ({ onGoMateri }: KuisPageProps = {}) => {
  const [openKitab, setOpenKitab] = useState<string | null>(null);
  const [openJilid, setOpenJilid] = useState<string | null>(null);

  const [activeQuiz, setActiveQuiz] = useState<AudioBabQuiz | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [phase, setPhase] = useState<Phase>("menu");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [giftOpened, setGiftOpened] = useState(false);
  const [bonusExp, setBonusExp] = useState(0);
  const [history, setHistory] = useState<{ babTitle: string; score: number; total: number; date: string }[]>(() => {
    try { return JSON.parse(localStorage.getItem("kitabify_quiz_history") || "[]"); } catch { return []; }
  });

  // Calculate bonus EXP based on percentage (so it scales to any total, e.g. 7 soal → 6/7=85%, 5/7=71%, 4/7=57%)
  const calcBonus = (s: number, total: number) => {
    if (total === 0) return 0;
    const pct = (s / total) * 100;
    if (pct >= 85) return 100;
    if (pct >= 70) return 50;
    if (pct >= 55) return 10;
    return 0;
  };

  const startQuiz = useCallback((quiz: AudioBabQuiz) => {
    const generated = generateQuizSession(quiz);
    setActiveQuiz(quiz);
    setGeneratedQuestions(generated);
    setPhase("quiz");
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowFeedback(false);
    setGiftOpened(false);
    setBonusExp(0);
  }, []);

  // Auto-start quiz when navigated from Materi page
  useEffect(() => {
    const pending = consumePendingQuiz();
    if (pending) {
      const quiz = getAudioQuiz(pending.jilidId, pending.babId);
      if (quiz) {
        setOpenKitab(quiz.kitabId);
        setOpenJilid(quiz.jilidId);
        startQuiz(quiz);
      }
    }
  }, [startQuiz]);

  const currentQuestion = generatedQuestions[currentQ];

  const playAudio = async () => {
    if (isPlaying || !currentQuestion) return;
    setIsPlaying(true);
    await speakArabic(currentQuestion.arabicText);
    setIsPlaying(false);
  };

  const handleAnswer = (idx: number) => {
    if (showFeedback) return;
    setSelected(idx);
    setShowFeedback(true);
    if (idx === currentQuestion?.correctIndex) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= generatedQuestions.length) {
      finishQuiz();
    } else {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setShowFeedback(false);
    }
  };

  const finishQuiz = () => {
    setPhase("result");
    if (activeQuiz) {
      const totalExp = score * 20;
      addExp(totalExp, `Kuis Audio: ${activeQuiz.babTitle}`);
      const user = getUser();
      if (user) {
        const key = `${activeQuiz.jilidId}_${activeQuiz.babId}`;
        user.quizScores[key] = Math.max(user.quizScores[key] || 0, score);
        saveUser(user);
      }
      const entry = { babTitle: activeQuiz.babTitle, score, total: generatedQuestions.length, date: new Date().toISOString() };
      const newHistory = [entry, ...history].slice(0, 20);
      setHistory(newHistory);
      localStorage.setItem("kitabify_quiz_history", JSON.stringify(newHistory));
    }
  };

  const goBack = () => {
    window.speechSynthesis?.cancel();
    setActiveQuiz(null);
    setPhase("menu");
  };

  // ===== QUIZ PHASE =====
  if (phase === "quiz" && activeQuiz && currentQuestion) {
    const progressPct = ((currentQ + 1) / generatedQuestions.length) * 100;
    const isCorrect = selected === currentQuestion.correctIndex;

    return (
      <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={goBack} className="text-primary text-sm font-semibold">← Kembali</button>
          <span className="text-xs text-muted-foreground font-medium">
            Soal {currentQ + 1}/{generatedQuestions.length}
          </span>
        </div>

        {/* Progress */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-6">
          <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
        </div>

        {/* Audio Card */}
        <div className="glass-card p-6 mb-5 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Volume2 className="text-primary" size={28} />
            <span className="text-sm text-muted-foreground font-medium">Dengarkan kalimat berikut</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <motion.button
              onClick={playAudio}
              disabled={isPlaying}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm disabled:opacity-50"
              whileTap={{ scale: 0.95 }}
            >
              <Play size={18} />
              {isPlaying ? "Memutar..." : "▶ Putar Audio"}
            </motion.button>

            <motion.button
              onClick={playAudio}
              disabled={isPlaying}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-muted text-foreground font-medium text-sm disabled:opacity-50"
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw size={16} />
              🔁 Ulangi
            </motion.button>
          </div>
        </div>

        {/* Dynamic Question Text */}
        <div className="glass-card p-4 mb-4">
          <h3 className="text-foreground font-bold text-sm">{currentQuestion.questionText}</h3>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground capitalize">
            {currentQuestion.type.replace(/_/g, " ")}
          </span>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((opt, i) => {
            let cls = "glass-card p-4 text-left w-full text-sm font-medium transition-all ";
            if (showFeedback) {
              if (i === currentQuestion.correctIndex) cls += "border-primary bg-primary/20 text-primary ";
              else if (i === selected) cls += "border-destructive bg-destructive/20 text-destructive ";
              else cls += "text-muted-foreground opacity-50 ";
            } else {
              cls += "text-foreground hover:bg-muted/50 ";
            }
            return (
              <motion.button key={i} onClick={() => handleAnswer(i)} className={cls} whileTap={{ scale: 0.98 }}>
                <span className="mr-3 text-muted-foreground">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </motion.button>
            );
          })}
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 mt-4">
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <><CheckCircle className="text-primary" size={18} /><span className="text-primary font-bold text-sm">Benar! ✅</span></>
                ) : (
                  <><XCircle className="text-destructive" size={18} /><span className="text-destructive font-bold text-sm">Salah ❌</span></>
                )}
              </div>
              {!isCorrect && (
                <p className="text-sm text-foreground mb-1">Jawaban benar: <strong className="text-primary">{currentQuestion.correctAnswer}</strong></p>
              )}
              <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
              <button onClick={nextQuestion} className="mt-3 w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm">
                {currentQ + 1 >= generatedQuestions.length ? "Lihat Skor →" : "Lanjut Soal Berikutnya →"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ===== RESULT =====
  if (phase === "result" && activeQuiz) {
    const pct = Math.round((score / generatedQuestions.length) * 100);
    const totalExp = score * 20;
    const possibleBonus = calcBonus(score, generatedQuestions.length);
    const loc = { kitabId: activeQuiz.kitabId, jilidId: activeQuiz.jilidId, babId: activeQuiz.babId };
    const prev = getPrevBab(loc);
    const next = getNextBab(loc);

    const goToMateri = (target: { kitabId: string; jilidId: string; babId: string }) => {
      setPendingMateri(target);
      window.speechSynthesis?.cancel();
      setActiveQuiz(null);
      setPhase("menu");
      onGoMateri?.();
    };

    const openGift = () => {
      if (giftOpened || possibleBonus <= 0) return;
      addExp(possibleBonus, `Kado Kuis: ${activeQuiz.babTitle}`);
      setBonusExp(possibleBonus);
      setGiftOpened(true);
    };

    return (
      <div className="pb-24 px-4 pt-6 max-w-lg mx-auto flex items-center justify-center min-h-[70vh]">
        <motion.div className="glass-card p-8 text-center w-full" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Trophy className="text-primary mx-auto mb-4" size={56} />
          <h2 className="text-2xl font-extrabold text-foreground mb-2">Hasil Kuis 🎉</h2>
          <p className="text-lg text-foreground font-bold mb-1">{activeQuiz.babTitle}</p>
          <div className="my-4 p-4 rounded-xl bg-muted/50">
            <p className="text-4xl font-extrabold text-primary">{score}/{generatedQuestions.length}</p>
            <p className="text-sm text-muted-foreground mt-1">{pct}% benar</p>
          </div>
          <p className="text-sm text-muted-foreground mb-4">+{totalExp} EXP</p>

          {/* 🎁 Kado Bonus EXP */}
          {possibleBonus > 0 ? (
            <div className="mb-5">
              {!giftOpened ? (
                <motion.button
                  onClick={openGift}
                  className="relative w-full py-5 rounded-2xl bg-gradient-to-br from-accent via-primary to-accent text-primary-foreground font-bold flex flex-col items-center justify-center gap-2 shadow-lg overflow-hidden"
                  whileTap={{ scale: 0.95 }}
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                >
                  <motion.div
                    animate={{ rotate: [-8, 8, -8] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                  >
                    <Gift size={40} />
                  </motion.div>
                  <span className="text-base">🎁 Buka Kado Bonus!</span>
                  <span className="text-xs opacity-90">Klik untuk mengungkap hadiah</span>
                </motion.button>
              ) : (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="relative p-5 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary"
                >
                  <Sparkles className="text-primary mx-auto mb-2" size={32} />
                  <p className="text-xl font-extrabold text-primary">+{bonusExp} EXP</p>
                  <p className="text-xs text-muted-foreground mt-1">Bonus kado kamu! 🎉</p>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="mb-5 p-4 rounded-2xl bg-muted/30 border border-dashed border-muted-foreground/30">
              <Gift className="text-muted-foreground mx-auto mb-1" size={28} />
              <p className="text-xs text-muted-foreground">Capai minimal 4/{generatedQuestions.length} untuk membuka kado bonus EXP 🎁</p>
            </div>
          )}

          <div className="space-y-3">
            <button onClick={() => startQuiz(activeQuiz)} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm">
              Ulangi Kuis 🔄
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => prev && goToMateri(prev)}
                disabled={!prev}
                className="py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 bg-muted text-foreground disabled:opacity-40 hover:bg-muted/70 transition"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                onClick={() => next && goToMateri(next)}
                disabled={!next}
                className="py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 bg-accent text-accent-foreground disabled:opacity-40 hover:bg-accent/90 transition"
              >
                Next <ArrowRight size={16} />
              </button>
            </div>
            <button onClick={goBack} className="w-full py-2.5 rounded-xl text-xs text-muted-foreground hover:text-foreground transition">
              ← Kembali ke menu kuis
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ===== MENU =====
  const kitabs = MATERI_DATA.filter(k => !k.isKholasoh);

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-extrabold text-foreground mb-2">📝 Kuis Audio</h1>
      <p className="text-sm text-muted-foreground mb-5">Dengarkan kalimat Arab, analisis struktur nahwu-nya</p>

      {kitabs.map((kitab) => {
        const hasQuizzes = ALL_AUDIO_QUIZZES.some(q => q.kitabId === kitab.id);
        return (
          <div key={kitab.id} className={`glass-card overflow-hidden mb-4 ${!hasQuizzes ? "opacity-60" : ""}`}>
            <button
              onClick={() => hasQuizzes ? setOpenKitab(openKitab === kitab.id ? null : kitab.id) : null}
              className="w-full flex items-center justify-between p-4"
              disabled={!hasQuizzes}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{kitab.icon}</span>
                <div className="text-left">
                  <span className="font-bold text-foreground">{kitab.title}</span>
                  {!hasQuizzes && <p className="text-xs text-muted-foreground">Kuis sedang disusun</p>}
                </div>
              </div>
              {hasQuizzes && (
                <ChevronDown size={18} className={`text-muted-foreground transition-transform ${openKitab === kitab.id ? "rotate-180" : ""}`} />
              )}
            </button>

            <AnimatePresence>
              {openKitab === kitab.id && hasQuizzes && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="px-4 pb-3 space-y-2">
                    {kitab.jilids.map((jilid) => {
                      const babsWithQuiz = ALL_AUDIO_QUIZZES.filter(q => q.kitabId === kitab.id && q.jilidId === jilid.id);
                      if (babsWithQuiz.length === 0) return (
                        <div key={jilid.id} className="py-2.5 px-3 rounded-xl bg-muted/30 opacity-60">
                          <span className="text-sm text-muted-foreground">📂 {jilid.title} — Segera hadir</span>
                        </div>
                      );
                      return (
                        <div key={jilid.id}>
                          <button
                            onClick={() => setOpenJilid(openJilid === jilid.id ? null : jilid.id)}
                            className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl bg-muted/50"
                          >
                            <span className="text-sm font-semibold text-foreground">📂 {jilid.title}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{babsWithQuiz.length} bab</span>
                              <ChevronDown size={14} className={`text-muted-foreground transition-transform ${openJilid === jilid.id ? "rotate-180" : ""}`} />
                            </div>
                          </button>
                          <AnimatePresence>
                            {openJilid === jilid.id && (
                              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                                <div className="pl-4 py-2 space-y-1">
                                  {babsWithQuiz.map((bq) => {
                                    const user = getUser();
                                    const key = `${bq.jilidId}_${bq.babId}`;
                                    const bestScore = user?.quizScores[key];
                                    return (
                                      <button
                                        key={bq.babId}
                                        onClick={() => startQuiz(bq)}
                                        className="w-full flex items-center justify-between py-3 px-3 rounded-lg hover:bg-muted/50 transition text-left"
                                      >
                                        <div className="flex items-center gap-3">
                                          <Volume2 className="text-primary" size={16} />
                                          <div>
                                            <span className="text-sm font-medium text-foreground">{bq.babTitle}</span>
                                            <p className="text-xs text-muted-foreground">{bq.questions.length} soal · variasi dinamis</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          {bestScore !== undefined && (
                                            <span className="text-xs text-primary font-bold">{bestScore}/{bq.questions.length}</span>
                                          )}
                                          <ChevronRight size={14} className="text-muted-foreground" />
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {history.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold text-foreground mb-3">📊 Riwayat Kuis</h2>
          <div className="space-y-2">
            {history.slice(0, 5).map((h, i) => (
              <div key={i} className="glass-card p-3 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-foreground">{h.babTitle}</span>
                  <p className="text-xs text-muted-foreground">{new Date(h.date).toLocaleDateString("id-ID")}</p>
                </div>
                <span className={`text-sm font-bold ${h.score / h.total >= 0.7 ? "text-primary" : "text-destructive"}`}>
                  {h.score}/{h.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KuisPage;
