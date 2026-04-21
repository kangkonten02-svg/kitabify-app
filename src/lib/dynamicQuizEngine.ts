// Dynamic Quiz Engine for Nahwu Learning (Voice-Based)
// Bab: Tanda-tanda Isim & Macam-macam Isim

export interface QuizTemplate {
  id: string;
  /** Arabic sentence with ____ placeholder(s) */
  template: string;
  /** Which blank positions map to which word category */
  blanks: BlankSlot[];
  /** Difficulty: 1=easy, 2=medium, 3=hard */
  difficulty: 1 | 2 | 3;
  /** Which bab this template belongs to */
  bab: "tanda_isim" | "macam_isim";
}

export interface BlankSlot {
  /** Category of the expected word */
  category: WordCategory;
  /** Position index in the template (0-based blank order) */
  position: number;
}

export type WordCategory =
  | "isim_with_al"
  | "isim_without_al"
  | "isim_dhomir"
  | "isim_isyaroh"
  | "isim_nakirah"
  | "isim_marifat"
  | "isim_mudzakkar"
  | "isim_muannats";

export interface WordEntry {
  arabic: string;
  latin: string;
  meaning: string;
  category: WordCategory;
}

export interface GeneratedQuiz {
  id: string;
  /** The sentence with blanks */
  question: string;
  /** The full sentence (answer) */
  fullSentence: string;
  /** The correct answers for each blank */
  answers: { word: WordEntry; position: number }[];
  /** Alternative acceptable answers */
  alternatives: WordEntry[][];
  /** Difficulty level */
  difficulty: 1 | 2 | 3;
  /** Bab */
  bab: "tanda_isim" | "macam_isim";
  /** Hint text */
  hint: string;
}

// =====================
// WORD BANK
// =====================

export const WORD_BANK: WordEntry[] = [
  // Isim with Al (ال)
  { arabic: "الرَّجُلُ", latin: "ar-rajulu", meaning: "laki-laki itu", category: "isim_with_al" },
  { arabic: "الْكِتَابُ", latin: "al-kitaabu", meaning: "buku itu", category: "isim_with_al" },
  { arabic: "الْمَسْجِدُ", latin: "al-masjidu", meaning: "masjid itu", category: "isim_with_al" },
  { arabic: "الطَّالِبُ", latin: "ath-thoolibu", meaning: "murid itu", category: "isim_with_al" },
  { arabic: "الْمُعَلِّمُ", latin: "al-mu'allimu", meaning: "guru itu", category: "isim_with_al" },
  { arabic: "الْبَيْتُ", latin: "al-baitu", meaning: "rumah itu", category: "isim_with_al" },
  { arabic: "الْقَلَمُ", latin: "al-qalamu", meaning: "pena itu", category: "isim_with_al" },
  { arabic: "الْوَلَدُ", latin: "al-waladu", meaning: "anak itu", category: "isim_with_al" },
  { arabic: "السَّمَاءُ", latin: "as-samaa'u", meaning: "langit itu", category: "isim_with_al" },
  { arabic: "الْأَرْضُ", latin: "al-ardhu", meaning: "bumi itu", category: "isim_with_al" },

  // Isim without Al (nakirah)
  { arabic: "رَجُلٌ", latin: "rajulun", meaning: "seorang laki-laki", category: "isim_without_al" },
  { arabic: "كِتَابٌ", latin: "kitaabun", meaning: "sebuah buku", category: "isim_without_al" },
  { arabic: "مَسْجِدٌ", latin: "masjidun", meaning: "sebuah masjid", category: "isim_without_al" },
  { arabic: "طَالِبٌ", latin: "thoolibun", meaning: "seorang murid", category: "isim_without_al" },
  { arabic: "بَيْتٌ", latin: "baitun", meaning: "sebuah rumah", category: "isim_without_al" },
  { arabic: "قَلَمٌ", latin: "qalamun", meaning: "sebuah pena", category: "isim_without_al" },
  { arabic: "وَلَدٌ", latin: "waladun", meaning: "seorang anak", category: "isim_without_al" },
  { arabic: "عِلْمٌ", latin: "'ilmun", meaning: "ilmu", category: "isim_without_al" },
  { arabic: "مَاءٌ", latin: "maa'un", meaning: "air", category: "isim_without_al" },
  { arabic: "نُورٌ", latin: "nuurun", meaning: "cahaya", category: "isim_without_al" },

  // Isim Dhomir
  { arabic: "هُوَ", latin: "huwa", meaning: "dia (lk)", category: "isim_dhomir" },
  { arabic: "هِيَ", latin: "hiya", meaning: "dia (pr)", category: "isim_dhomir" },
  { arabic: "أَنْتَ", latin: "anta", meaning: "kamu (lk)", category: "isim_dhomir" },
  { arabic: "أَنْتِ", latin: "anti", meaning: "kamu (pr)", category: "isim_dhomir" },
  { arabic: "أَنَا", latin: "ana", meaning: "saya", category: "isim_dhomir" },
  { arabic: "نَحْنُ", latin: "nahnu", meaning: "kami/kita", category: "isim_dhomir" },
  { arabic: "هُمْ", latin: "hum", meaning: "mereka (lk)", category: "isim_dhomir" },
  { arabic: "أَنْتُمْ", latin: "antum", meaning: "kalian (lk)", category: "isim_dhomir" },

  // Isim Isyaroh
  { arabic: "هٰذَا", latin: "haadzaa", meaning: "ini (lk)", category: "isim_isyaroh" },
  { arabic: "هٰذِهِ", latin: "haadzihi", meaning: "ini (pr)", category: "isim_isyaroh" },
  { arabic: "ذٰلِكَ", latin: "dzaalika", meaning: "itu (lk)", category: "isim_isyaroh" },
  { arabic: "تِلْكَ", latin: "tilka", meaning: "itu (pr)", category: "isim_isyaroh" },
  { arabic: "هٰؤُلَاءِ", latin: "haa'ulaa'i", meaning: "mereka ini", category: "isim_isyaroh" },
  { arabic: "أُولٰئِكَ", latin: "ulaa'ika", meaning: "mereka itu", category: "isim_isyaroh" },

  // Nakirah (explicitly)
  { arabic: "صَالِحٌ", latin: "shoolihun", meaning: "yang sholeh", category: "isim_nakirah" },
  { arabic: "كَبِيرٌ", latin: "kabiirun", meaning: "yang besar", category: "isim_nakirah" },
  { arabic: "صَغِيرٌ", latin: "shaghiirun", meaning: "yang kecil", category: "isim_nakirah" },
  { arabic: "جَمِيلٌ", latin: "jamiilun", meaning: "yang indah", category: "isim_nakirah" },
  { arabic: "عَظِيمٌ", latin: "azhiimun", meaning: "yang agung", category: "isim_nakirah" },

  // Ma'rifat
  { arabic: "اللّٰهُ", latin: "Allaahu", meaning: "Allah", category: "isim_marifat" },
  { arabic: "مُحَمَّدٌ", latin: "Muhammadun", meaning: "Muhammad", category: "isim_marifat" },
  { arabic: "إِبْرَاهِيمُ", latin: "Ibraahiimu", meaning: "Ibrahim", category: "isim_marifat" },

  // Mudzakkar
  { arabic: "مُسْلِمٌ", latin: "muslimun", meaning: "seorang muslim (lk)", category: "isim_mudzakkar" },
  { arabic: "مُؤْمِنٌ", latin: "mu'minun", meaning: "seorang mukmin (lk)", category: "isim_mudzakkar" },
  { arabic: "مُعَلِّمٌ", latin: "mu'allimun", meaning: "seorang guru (lk)", category: "isim_mudzakkar" },

  // Muannats
  { arabic: "مُسْلِمَةٌ", latin: "muslimatun", meaning: "seorang muslimah", category: "isim_muannats" },
  { arabic: "مُؤْمِنَةٌ", latin: "mu'minatun", meaning: "seorang mukminah", category: "isim_muannats" },
  { arabic: "مُعَلِّمَةٌ", latin: "mu'allimatun", meaning: "seorang guru (pr)", category: "isim_muannats" },
  { arabic: "فَاطِمَةُ", latin: "Faathimatu", meaning: "Fatimah", category: "isim_muannats" },
];

// =====================
// SENTENCE TEMPLATES
// =====================

export const QUIZ_TEMPLATES: QuizTemplate[] = [
  // BAB 1: Tanda-tanda Isim — Easy (1 blank)
  {
    id: "t1", bab: "tanda_isim", difficulty: 1,
    template: "____ ذَهَبَ إِلَى الْمَسْجِدِ",
    blanks: [{ category: "isim_with_al", position: 0 }],
  },
  {
    id: "t2", bab: "tanda_isim", difficulty: 1,
    template: "فِي الْمَدْرَسَةِ ____ صَالِحٌ",
    blanks: [{ category: "isim_without_al", position: 0 }],
  },
  {
    id: "t3", bab: "tanda_isim", difficulty: 1,
    template: "____ يَقْرَأُ الْقُرْآنَ",
    blanks: [{ category: "isim_dhomir", position: 0 }],
  },
  {
    id: "t4", bab: "tanda_isim", difficulty: 1,
    template: "____ كِتَابٌ جَمِيلٌ",
    blanks: [{ category: "isim_isyaroh", position: 0 }],
  },
  {
    id: "t5", bab: "tanda_isim", difficulty: 1,
    template: "يَا ____ اجْتَهِدْ",
    blanks: [{ category: "isim_without_al", position: 0 }],
  },
  {
    id: "t6", bab: "tanda_isim", difficulty: 1,
    template: "جَاءَ ____ مِنَ الْمَدْرَسَةِ",
    blanks: [{ category: "isim_with_al", position: 0 }],
  },
  {
    id: "t7", bab: "tanda_isim", difficulty: 1,
    template: "____ جَلَسَ فِي الْبَيْتِ",
    blanks: [{ category: "isim_with_al", position: 0 }],
  },
  {
    id: "t8", bab: "tanda_isim", difficulty: 1,
    template: "قَرَأَ ____ الْكِتَابَ",
    blanks: [{ category: "isim_dhomir", position: 0 }],
  },

  // BAB 1: Medium (2 blanks)
  {
    id: "t9", bab: "tanda_isim", difficulty: 2,
    template: "____ ذَهَبَ إِلَى ____",
    blanks: [
      { category: "isim_with_al", position: 0 },
      { category: "isim_with_al", position: 1 },
    ],
  },
  {
    id: "t10", bab: "tanda_isim", difficulty: 2,
    template: "____ قَرَأَ ____ فِي الْمَسْجِدِ",
    blanks: [
      { category: "isim_dhomir", position: 0 },
      { category: "isim_with_al", position: 1 },
    ],
  },
  {
    id: "t11", bab: "tanda_isim", difficulty: 2,
    template: "فِي ____ ____ كَثِيرٌ",
    blanks: [
      { category: "isim_with_al", position: 0 },
      { category: "isim_without_al", position: 1 },
    ],
  },

  // BAB 1: Hard (no hint)
  {
    id: "t12", bab: "tanda_isim", difficulty: 3,
    template: "____ ____ إِلَى ____ لِلصَّلَاةِ",
    blanks: [
      { category: "isim_dhomir", position: 0 },
      { category: "isim_with_al", position: 1 },
      { category: "isim_with_al", position: 2 },
    ],
  },

  // BAB 2: Macam-macam Isim — Easy
  {
    id: "m1", bab: "macam_isim", difficulty: 1,
    template: "____ طَالِبٌ مُجْتَهِدٌ",
    blanks: [{ category: "isim_isyaroh", position: 0 }],
  },
  {
    id: "m2", bab: "macam_isim", difficulty: 1,
    template: "جَاءَتْ ____ مِنَ الْبَيْتِ",
    blanks: [{ category: "isim_muannats", position: 0 }],
  },
  {
    id: "m3", bab: "macam_isim", difficulty: 1,
    template: "____ رَسُولُ اللّٰهِ",
    blanks: [{ category: "isim_marifat", position: 0 }],
  },
  {
    id: "m4", bab: "macam_isim", difficulty: 1,
    template: "____ مُؤْمِنٌ صَادِقٌ",
    blanks: [{ category: "isim_mudzakkar", position: 0 }],
  },
  {
    id: "m5", bab: "macam_isim", difficulty: 1,
    template: "كَتَبَ ____ الدَّرْسَ",
    blanks: [{ category: "isim_with_al", position: 0 }],
  },
  {
    id: "m6", bab: "macam_isim", difficulty: 1,
    template: "فِي الْفَصْلِ ____ كَثِيرَةٌ",
    blanks: [{ category: "isim_without_al", position: 0 }],
  },

  // BAB 2: Medium
  {
    id: "m7", bab: "macam_isim", difficulty: 2,
    template: "____ أَخَذَ ____ مِنَ الْمَكْتَبَةِ",
    blanks: [
      { category: "isim_isyaroh", position: 0 },
      { category: "isim_with_al", position: 1 },
    ],
  },
  {
    id: "m8", bab: "macam_isim", difficulty: 2,
    template: "____ ____ مُجْتَهِدَةٌ",
    blanks: [
      { category: "isim_isyaroh", position: 0 },
      { category: "isim_muannats", position: 1 },
    ],
  },

  // BAB 2: Hard
  {
    id: "m9", bab: "macam_isim", difficulty: 3,
    template: "____ ____ ____ فِي الْمَسْجِدِ",
    blanks: [
      { category: "isim_dhomir", position: 0 },
      { category: "isim_isyaroh", position: 1 },
      { category: "isim_with_al", position: 2 },
    ],
  },
];

// =====================
// GENERATION LOGIC
// =====================

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getWordsByCategory(category: WordCategory): WordEntry[] {
  return WORD_BANK.filter(w => w.category === category);
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

let questionCounter = 0;

export function generateQuiz(
  bab: "tanda_isim" | "macam_isim",
  difficulty: 1 | 2 | 3,
  count: number = 5
): GeneratedQuiz[] {
  const templates = QUIZ_TEMPLATES.filter(
    t => t.bab === bab && t.difficulty === difficulty
  );

  if (templates.length === 0) return [];

  const quizzes: GeneratedQuiz[] = [];
  const usedTemplates = new Set<string>();

  for (let i = 0; i < count; i++) {
    // Pick a random template (avoid repeats if possible)
    let available = templates.filter(t => !usedTemplates.has(t.id));
    if (available.length === 0) {
      usedTemplates.clear();
      available = templates;
    }

    const template = getRandomItem(available);
    usedTemplates.add(template.id);

    // Fill blanks with random words
    const answers: { word: WordEntry; position: number }[] = [];
    const alternatives: WordEntry[][] = [];
    let fullSentence = template.template;
    let question = template.template;

    const usedWords = new Set<string>();

    for (const blank of template.blanks) {
      const words = getWordsByCategory(blank.category);
      const availableWords = words.filter(w => !usedWords.has(w.arabic));
      const word = getRandomItem(availableWords.length > 0 ? availableWords : words);
      usedWords.add(word.arabic);

      answers.push({ word, position: blank.position });

      // Get alternatives (other words from same category)
      const alts = words.filter(w => w.arabic !== word.arabic);
      alternatives.push(shuffleArray(alts).slice(0, 3));

      // Replace the FIRST remaining blank
      fullSentence = fullSentence.replace("____", word.arabic);
    }

    // Build hint
    const hintParts = answers.map(a => {
      const catNames: Record<WordCategory, string> = {
        isim_with_al: "Isim dengan Al (ال)",
        isim_without_al: "Isim tanpa Al",
        isim_dhomir: "Isim Dhomir",
        isim_isyaroh: "Isim Isyaroh",
        isim_nakirah: "Isim Nakirah",
        isim_marifat: "Isim Ma'rifat",
        isim_mudzakkar: "Isim Mudzakkar",
        isim_muannats: "Isim Muannats",
      };
      return catNames[a.word.category] || a.word.category;
    });

    questionCounter++;

    quizzes.push({
      id: `dq_${Date.now()}_${questionCounter}`,
      question,
      fullSentence,
      answers,
      alternatives,
      difficulty,
      bab,
      hint: difficulty < 3 ? `Cari: ${hintParts.join(" & ")}` : "",
    });
  }

  return quizzes;
}

// =====================
// SPEECH MATCHING
// =====================

export function matchSpeech(
  spokenText: string,
  expectedWord: WordEntry
): { score: number; level: "exact" | "similar" | "wrong" } {
  const spoken = stripForMatch(spokenText);
  const expected = stripForMatch(expectedWord.arabic);
  const expectedLatin = expectedWord.latin.toLowerCase();

  // Exact match (arabic or latin)
  if (spoken === expected || spoken === expectedLatin) {
    return { score: 100, level: "exact" };
  }

  // Similar match (at least 60% characters match)
  const similarity = calculateSimilarity(spoken, expected);
  const latinSimilarity = calculateSimilarity(spoken, expectedLatin);
  const bestSim = Math.max(similarity, latinSimilarity);

  if (bestSim >= 0.6) {
    return { score: 70, level: "similar" };
  }

  return { score: 0, level: "wrong" };
}

function stripForMatch(text: string): string {
  return text
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g, '')
    .replace(/\s+/g, '')
    .trim()
    .toLowerCase();
}

function calculateSimilarity(a: string, b: string): number {
  if (a.length === 0 && b.length === 0) return 1;
  if (a.length === 0 || b.length === 0) return 0;

  const maxLen = Math.max(a.length, b.length);
  let matches = 0;
  const minLen = Math.min(a.length, b.length);

  for (let i = 0; i < minLen; i++) {
    if (a[i] === b[i]) matches++;
  }

  return matches / maxLen;
}
