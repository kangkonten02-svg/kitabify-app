import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  generateQuiz,
  matchSpeech,
  type GeneratedQuiz,
  type WordEntry,
} from "@/lib/dynamicQuizEngine";
import { addExp } from "@/lib/store";
import {
  Mic,
  MicOff,
  Volume2,
  RotateCcw,
  ChevronRight,
  Trophy,
  Sparkles,
  XCircle,
  Lightbulb,
  Zap,
  ArrowLeft,
} from "lucide-react";

type Difficulty = 1 | 2 | 3;
type Bab = "tanda_isim" | "macam_isim";
type Phase = "select" | "quiz" | "result";

interface AnswerResult {
  quiz: GeneratedQuiz;
  blankIndex: number;
  spoken: string;
  expected: WordEntry;
  score: number;
  level: "exact" | "similar" | "wrong";
}

const BAB_LABELS: Record<Bab, string> = {
  tanda_isim: "Tanda-tanda Isim",
  macam_isim: "Macam-macam Isim",
};

const DIFFICULTY_LABELS: Record<Difficulty, { label: string; icon: string; desc: string }> = {
  1: { label: "Mudah", icon: "🟢", desc: "1 kata kosong + hint" },
  2: { label: "Sedang", icon: "🟡", desc: "2 kata kosong + hint" },
  3: { label: "Sulit", icon: "🔴", desc: "Tanpa hint" },
};

const VoiceQuizPage = ({ onBack }: { onBack: () => void }) => {
  const [phase, setPhase] = useState<Phase>("select");
  const [selectedBab, setSelectedBab] = useState<Bab>("tanda_isim");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(1);

  // Quiz state
  const [quizzes, setQuizzes] = useState<GeneratedQuiz[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentBlank, setCurrentBlank] = useState(0);
  const [results, setResults] = useState<AnswerResult[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [feedback, setFeedback] = useState<AnswerResult | null>(null);
  const [showHint, setShowHint] = useState(false);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startQuiz = () => {
    const generated = generateQuiz(selectedBab, selectedDifficulty, 5);
    if (generated.length === 0) return;
    setQuizzes(generated);
    setCurrentIndex(0);
    setCurrentBlank(0);
    setResults([]);
    setTotalScore(0);
    setFeedback(null);
    setSpokenText("");
    setShowHint(false);
    setPhase("quiz");
  };

  const regenerate = () => {
    const generated = generateQuiz(selectedBab, selectedDifficulty, 5);
    setQuizzes(generated);
    setCurrentIndex(0);
    setCurrentBlank(0);
    setResults([]);
    setTotalScore(0);
    setFeedback(null);
    setSpokenText("");
    setShowHint(false);
  };

  const speakArabic = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = 0.8;
    synthRef.current.speak(utterance);
  };

  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Browser kamu tidak mendukung Speech Recognition. Gunakan Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ar-SA";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setSpokenText(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error !== "no-speech") {
        console.error("Speech recognition error:", event.error);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const checkAnswer = useCallback(() => {
    if (!spokenText.trim() || quizzes.length === 0) return;

    const quiz = quizzes[currentIndex];
    const answer = quiz.answers[currentBlank];
    if (!answer) return;

    const result = matchSpeech(spokenText, answer.word);
    const answerResult: AnswerResult = {
      quiz,
      blankIndex: currentBlank,
      spoken: spokenText,
      expected: answer.word,
      score: result.score,
      level: result.level,
    };

    setFeedback(answerResult);
    setResults(prev => [...prev, answerResult]);
    setTotalScore(prev => prev + result.score);
  }, [spokenText, quizzes, currentIndex, currentBlank]);

  const nextQuestion = () => {
    const quiz = quizzes[currentIndex];

    // Check if there are more blanks in current question
    if (currentBlank + 1 < quiz.answers.length) {
      setCurrentBlank(prev => prev + 1);
      setFeedback(null);
      setSpokenText("");
      setShowHint(false);
      return;
    }

    // Move to next question
    if (currentIndex + 1 < quizzes.length) {
      setCurrentIndex(prev => prev + 1);
      setCurrentBlank(0);
      setFeedback(null);
      setSpokenText("");
      setShowHint(false);
    } else {
      // Quiz finished
      const avgScore = Math.round(totalScore / Math.max(results.length, 1));
      const expGain = Math.round(avgScore / 10) * 5;
      addExp(expGain, `Voice Quiz: ${BAB_LABELS[selectedBab]}`);
      setPhase("result");
    }
  };

  const handleTextSubmit = (text: string) => {
    setSpokenText(text);
  };

  // ===== SELECT PHASE =====
  if (phase === "select") {
    return (
      <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="text-primary">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-2xl font-extrabold text-foreground">🎤 Kuis Suara</h1>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Latihan nahwu dinamis dengan suara. Soal digenerate otomatis dan selalu berbeda!
        </p>

        {/* Bab Selection */}
        <div className="mb-5">
          <h3 className="text-sm font-bold text-foreground mb-3">📘 Pilih Bab</h3>
          <div className="grid grid-cols-1 gap-2">
            {(Object.keys(BAB_LABELS) as Bab[]).map(bab => (
              <motion.button
                key={bab}
                onClick={() => setSelectedBab(bab)}
                className={`glass-card p-4 text-left transition-all ${
                  selectedBab === bab
                    ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                    : "hover:bg-muted/50"
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-sm font-bold text-foreground">{BAB_LABELS[bab]}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-foreground mb-3">⚡ Tingkat Kesulitan</h3>
          <div className="grid grid-cols-3 gap-2">
            {([1, 2, 3] as Difficulty[]).map(d => (
              <motion.button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`glass-card p-3 text-center transition-all ${
                  selectedDifficulty === d
                    ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                    : "hover:bg-muted/50"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">{DIFFICULTY_LABELS[d].icon}</span>
                <p className="text-xs font-bold text-foreground mt-1">{DIFFICULTY_LABELS[d].label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{DIFFICULTY_LABELS[d].desc}</p>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button
          onClick={startQuiz}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base flex items-center justify-center gap-2"
          whileTap={{ scale: 0.97 }}
        >
          <Mic size={20} />
          Mulai Kuis Suara
        </motion.button>

        {/* Info */}
        <div className="glass-card p-4 mt-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-bold text-foreground">💡 Cara bermain:</span><br />
            1. Dengarkan kalimat Arab dengan bagian kosong<br />
            2. Ucapkan kata yang tepat mengisi kosong<br />
            3. Atau ketik jawabanmu di kolom teks<br />
            <br />
            <span className="font-bold">Skor:</span> Exact = 100% · Similar = 70% · Wrong = 0%
          </p>
        </div>
      </div>
    );
  }

  // ===== RESULT PHASE =====
  if (phase === "result") {
    const totalPossible = results.length * 100;
    const percentage = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
    const exactCount = results.filter(r => r.level === "exact").length;
    const similarCount = results.filter(r => r.level === "similar").length;
    const wrongCount = results.filter(r => r.level === "wrong").length;

    return (
      <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
        <motion.div
          className="glass-card p-6 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Trophy className="text-primary mx-auto mb-3" size={56} />
          <h2 className="text-2xl font-extrabold text-foreground mb-1">Hasil Kuis Suara</h2>
          <p className="text-muted-foreground text-sm mb-4">{BAB_LABELS[selectedBab]}</p>

          <div className="text-5xl font-black text-primary mb-2">{percentage}%</div>
          <p className="text-sm text-muted-foreground mb-6">Skor rata-rata</p>

          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="p-3 rounded-xl bg-primary/10">
              <p className="text-lg font-bold text-primary">{exactCount}</p>
              <p className="text-[10px] text-muted-foreground">Tepat (100%)</p>
            </div>
            <div className="p-3 rounded-xl bg-accent/50">
              <p className="text-lg font-bold text-accent-foreground">{similarCount}</p>
              <p className="text-[10px] text-muted-foreground">Mirip (70%)</p>
            </div>
            <div className="p-3 rounded-xl bg-destructive/10">
              <p className="text-lg font-bold text-destructive">{wrongCount}</p>
              <p className="text-[10px] text-muted-foreground">Salah (0%)</p>
            </div>
          </div>

          {/* Detail results */}
          <div className="text-left space-y-2 mb-6">
            {results.map((r, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg text-xs ${
                  r.level === "exact"
                    ? "bg-primary/10 border border-primary/20"
                    : r.level === "similar"
                    ? "bg-accent/30 border border-accent"
                    : "bg-destructive/10 border border-destructive/20"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-foreground font-bold" dir="rtl">
                    {r.expected.arabic}
                  </span>
                  <span className={`font-bold ${
                    r.level === "exact" ? "text-primary" : r.level === "similar" ? "text-accent-foreground" : "text-destructive"
                  }`}>
                    {r.score}%
                  </span>
                </div>
                <p className="text-muted-foreground mt-0.5">
                  Kamu: "<span dir="rtl">{r.spoken || "—"}</span>" → {r.expected.meaning}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => { regenerate(); setPhase("quiz"); }}
              className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-1"
            >
              <RotateCcw size={16} /> Soal Baru
            </button>
            <button
              onClick={() => setPhase("select")}
              className="flex-1 py-3 rounded-xl bg-muted text-foreground font-bold text-sm"
            >
              Ganti Bab
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ===== QUIZ PHASE =====
  const quiz = quizzes[currentIndex];
  if (!quiz) return null;

  const currentAnswer = quiz.answers[currentBlank];
  const progressPct = ((currentIndex + 1) / quizzes.length) * 100;

  // Render question with highlighted blanks
  const renderQuestion = () => {
    const parts = quiz.question.split("____");
    return (
      <p className="text-2xl leading-[2.5] text-foreground text-center" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < parts.length - 1 && (
              <span
                className={`inline-block min-w-[60px] mx-1 border-b-2 ${
                  i === currentBlank
                    ? "border-primary bg-primary/10 rounded px-2"
                    : feedback && i < currentBlank
                    ? "border-primary/50 text-primary"
                    : "border-muted-foreground/30"
                }`}
              >
                {feedback && i < currentBlank
                  ? quiz.answers[i]?.word.arabic
                  : feedback && i === currentBlank
                  ? feedback.expected.arabic
                  : " ؟ "}
              </span>
            )}
          </span>
        ))}
      </p>
    );
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setPhase("select")} className="text-primary text-sm font-semibold">
          <ArrowLeft size={18} className="inline mr-1" />
          Kembali
        </button>
        <span className="text-xs text-muted-foreground">
          {currentIndex + 1}/{quizzes.length} · Blank {currentBlank + 1}/{quiz.answers.length}
        </span>
      </div>

      {/* Progress */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Question Card */}
      <motion.div
        key={quiz.id + currentBlank}
        className="glass-card p-5 mb-4"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-muted-foreground">
            {DIFFICULTY_LABELS[selectedDifficulty].icon} {DIFFICULTY_LABELS[selectedDifficulty].label}
          </span>
          <button
            onClick={() => speakArabic(quiz.fullSentence)}
            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition"
          >
            <Volume2 size={16} />
          </button>
        </div>

        {/* Arabic sentence with blanks */}
        <div className="p-3 rounded-xl bg-muted/30 border border-border mb-4">
          {renderQuestion()}
        </div>

        {/* Hint */}
        {quiz.hint && !showHint && !feedback && (
          <button
            onClick={() => setShowHint(true)}
            className="text-xs text-primary flex items-center gap-1 mb-3"
          >
            <Lightbulb size={14} /> Tampilkan hint
          </button>
        )}

        <AnimatePresence>
          {showHint && quiz.hint && !feedback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 p-2 rounded-lg bg-accent/50 border border-accent"
            >
              <p className="text-xs text-muted-foreground">
                💡 {quiz.hint}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice Input Section */}
        {!feedback && (
          <div className="space-y-3">
            {/* Mic button */}
            <div className="flex justify-center">
              <motion.button
                onClick={isListening ? stopListening : startListening}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? "bg-destructive text-destructive-foreground animate-pulse"
                    : "bg-primary text-primary-foreground"
                }`}
                whileTap={{ scale: 0.9 }}
              >
                {isListening ? <MicOff size={28} /> : <Mic size={28} />}
              </motion.button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              {isListening ? "🔴 Sedang mendengarkan..." : "Tekan mic & ucapkan jawaban"}
            </p>

            {/* Spoken text display */}
            {spokenText && (
              <div className="p-3 rounded-xl bg-muted/50 border border-border text-center">
                <p className="text-lg text-foreground" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
                  {spokenText}
                </p>
              </div>
            )}

            {/* Text input fallback */}
            <div className="relative">
              <input
                type="text"
                dir="rtl"
                placeholder="...أو ketik jawaban di sini"
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground text-base text-center focus:outline-none focus:ring-2 focus:ring-primary"
                style={{ fontFamily: "'Amiri', serif" }}
                value={spokenText}
                onChange={e => setSpokenText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") checkAnswer(); }}
              />
            </div>

            <button
              onClick={checkAnswer}
              disabled={!spokenText.trim()}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Zap size={16} /> Periksa Jawaban
            </button>
          </div>
        )}

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              {feedback.level === "exact" ? (
                <div className="p-4 rounded-xl bg-primary/15 border border-primary/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="text-primary" size={20} />
                    <span className="text-primary font-bold">Tepat Sekali! 🎉</span>
                    <span className="ml-auto text-primary font-black">100%</span>
                  </div>
                  <p className="text-2xl text-center text-primary font-bold" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
                    {feedback.expected.arabic}
                  </p>
                  <p className="text-xs text-muted-foreground text-center mt-1">{feedback.expected.meaning}</p>
                </div>
              ) : feedback.level === "similar" ? (
                <div className="p-4 rounded-xl bg-accent/30 border border-accent">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="text-accent-foreground" size={20} />
                    <span className="text-accent-foreground font-bold">Hampir Tepat! 👍</span>
                    <span className="ml-auto text-accent-foreground font-black">70%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Kamu: "<span dir="rtl">{feedback.spoken}</span>"
                  </p>
                  <p className="text-2xl text-center text-foreground font-bold mt-2" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
                    {feedback.expected.arabic}
                  </p>
                  <p className="text-xs text-muted-foreground text-center mt-1">{feedback.expected.meaning}</p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-destructive/15 border border-destructive/30">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="text-destructive" size={20} />
                    <span className="text-destructive font-bold">Belum Tepat</span>
                    <span className="ml-auto text-destructive font-black">0%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Kamu: "<span dir="rtl">{feedback.spoken || "—"}</span>"
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Jawaban yang benar:</p>
                  <p className="text-2xl text-center text-primary font-bold mt-1" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
                    {feedback.expected.arabic}
                  </p>
                  <p className="text-xs text-muted-foreground text-center mt-1">{feedback.expected.meaning}</p>
                </div>
              )}

              {/* Full sentence reveal */}
              {currentBlank === quiz.answers.length - 1 && (
                <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Kalimat lengkap:</p>
                  <p className="text-lg text-center text-foreground" dir="rtl" style={{ fontFamily: "'Amiri', serif" }}>
                    {quiz.fullSentence}
                  </p>
                </div>
              )}

              <button
                onClick={nextQuestion}
                className="w-full mt-3 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-1"
              >
                {currentIndex + 1 >= quizzes.length && currentBlank + 1 >= quiz.answers.length
                  ? "Lihat Hasil"
                  : currentBlank + 1 < quiz.answers.length
                  ? "Blank Berikutnya →"
                  : "Soal Berikutnya →"
                }
                <ChevronRight size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default VoiceQuizPage;
