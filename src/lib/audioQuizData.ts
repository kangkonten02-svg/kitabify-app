// Audio Quiz Data with dynamic question variations
// Each question has rich concept data enabling multiple question types

export type QuestionType =
  | "identify_materi"      // "Kalimat yang didengar termasuk materi apa?"
  | "identify_unsur"       // "Manakah yang termasuk X dalam kalimat?"
  | "fungsi_kata"          // "Kata X berfungsi sebagai apa?"
  | "jenis_kata"           // "Kata yang didengar termasuk jenis apa?"
  | "deteksi_struktur";    // "Kalimat tersebut termasuk jumlah apa?"

export interface ConceptDetail {
  /** The key element in the sentence (e.g. "بِ", "هُوَ") */
  keyElement: string;
  /** What category/role it plays */
  role: string;
  /** Related concept label */
  conceptLabel: string;
}

export interface AudioQuestion {
  id: string;
  /** Arabic sentence spoken via TTS (NOT shown) */
  arabicText: string;
  /** The correct bab/topic */
  correctAnswer: string;
  /** 3 distractors for identify_materi */
  distractors: string[];
  /** Explanation shown after answering */
  explanation: string;
  /** Rich concept data for varied question types */
  concepts: ConceptDetail[];
  /** Which question types are valid for this question */
  allowedTypes: QuestionType[];
}

export interface AudioBabQuiz {
  kitabId: string;
  jilidId: string;
  babId: string;
  babTitle: string;
  questions: AudioQuestion[];
}

// =====================
// DYNAMIC QUESTION GENERATOR
// =====================

export interface GeneratedQuestion {
  questionText: string;
  correctAnswer: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  arabicText: string;
  type: QuestionType;
}

// Distractors pools per concept type
const DISTRACTORS_POOLS: Record<string, string[]> = {
  huruf_jar: ["بِ", "إِلَى", "مِنْ", "عَلَى", "فِي", "كَ", "لِ", "عَنْ", "حَتَّى"],
  isim_majrur: ["Isim Majrur", "Fa'il", "Maf'ul Bih", "Mubtada", "Khabar", "Na'at", "Badal"],
  dhomir: ["هُوَ", "هِيَ", "أَنَا", "أَنْتَ", "نَحْنُ", "هُمْ", "أَنْتُمْ", "أَنْتِ"],
  isyaroh: ["هٰذَا", "هٰذِهِ", "ذٰلِكَ", "تِلْكَ", "هٰؤُلَاءِ", "أُولٰئِكَ"],
  maushul: ["الَّذِي", "الَّتِي", "الَّذِينَ", "اللَّاتِي", "مَنْ", "مَا"],
  jumlah: ["Jumlah Fi'liyyah", "Jumlah Ismiyyah", "Syibhul Jumlah", "Jumlah Syarthiyyah"],
  jenis_kata: ["Isim", "Fi'il", "Huruf", "Isim Nakirah", "Isim Ma'rifat", "Isim Fa'il", "Isim Maf'ul", "Masdar"],
  tanda_isim: ["Tanwin", "Alif Lam (ال)", "Nida (يا)", "Jar", "Isnad"],
  macam_isim: ["Nakirah", "Ma'rifat", "Mudzakkar", "Muannats", "Mufrad", "Tatsniyah", "Jamak Mudzakkar Salim", "Jamak Muannats Salim", "Jamak Taksir"],
  wazan: ["فَاعِل", "مَفْعُول", "فَعْل", "تَفْعِيل", "فِعَالَة", "مُفَعِّل", "إِفْعَال"],
  materi: ["Huruf Jar", "Isim Dhomir", "Isim Isyaroh", "Isim Maushul", "Tanda-tanda Isim", "Macam-macam Isim", "Isim Fa'il", "Isim Maf'ul", "Masdar", "Fi'il Madhi", "Fi'il Mudhari'"],
};

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export { shuffleArray };

function pickDistractors(correct: string, pool: string[], count: number = 3): string[] {
  const filtered = pool.filter(d => d !== correct);
  return shuffleArray(filtered).slice(0, count);
}

function buildShuffledOptions(correct: string, distractors: string[]): { options: string[]; correctIndex: number } {
  const all = shuffleArray([correct, ...distractors.slice(0, 3)]);
  return { options: all, correctIndex: all.indexOf(correct) };
}

export function generateDynamicQuestion(q: AudioQuestion): GeneratedQuestion {
  // Pick a random allowed question type
  const type = q.allowedTypes[Math.floor(Math.random() * q.allowedTypes.length)];

  switch (type) {
    case "identify_materi": {
      const distractors = pickDistractors(q.correctAnswer, DISTRACTORS_POOLS.materi);
      const { options, correctIndex } = buildShuffledOptions(q.correctAnswer, distractors);
      return {
        questionText: "Kalimat yang didengar termasuk materi apa?",
        correctAnswer: q.correctAnswer,
        options,
        correctIndex,
        explanation: q.explanation,
        arabicText: q.arabicText,
        type,
      };
    }

    case "identify_unsur": {
      // Use the first concept's key element
      const concept = q.concepts[0];
      if (!concept) return fallbackQuestion(q);
      const poolKey = getPoolKeyForRole(concept.role);
      const distractors = pickDistractors(concept.keyElement, DISTRACTORS_POOLS[poolKey] || DISTRACTORS_POOLS.materi);
      const { options, correctIndex } = buildShuffledOptions(concept.keyElement, distractors);
      return {
        questionText: `Manakah yang termasuk ${concept.conceptLabel} dalam kalimat tersebut?`,
        correctAnswer: concept.keyElement,
        options,
        correctIndex,
        explanation: q.explanation,
        arabicText: q.arabicText,
        type,
      };
    }

    case "fungsi_kata": {
      const concept = q.concepts[0];
      if (!concept) return fallbackQuestion(q);
      const distractors = pickDistractors(concept.role, DISTRACTORS_POOLS.isim_majrur);
      const { options, correctIndex } = buildShuffledOptions(concept.role, distractors);
      return {
        questionText: `Kata '${concept.keyElement}' dalam kalimat tersebut berfungsi sebagai apa?`,
        correctAnswer: concept.role,
        options,
        correctIndex,
        explanation: q.explanation,
        arabicText: q.arabicText,
        type,
      };
    }

    case "jenis_kata": {
      const concept = q.concepts.length > 1 ? q.concepts[1] : q.concepts[0];
      if (!concept) return fallbackQuestion(q);
      const distractors = pickDistractors(concept.role, DISTRACTORS_POOLS.jenis_kata);
      const { options, correctIndex } = buildShuffledOptions(concept.role, distractors);
      return {
        questionText: `Kata '${concept.keyElement}' termasuk jenis apa?`,
        correctAnswer: concept.role,
        options,
        correctIndex,
        explanation: q.explanation,
        arabicText: q.arabicText,
        type,
      };
    }

    case "deteksi_struktur": {
      // Determine jumlah type from sentence structure
      const isJumlahFiliyyah = /^[^\s]+َ\s/.test(q.arabicText) || q.concepts.some(c => c.role.includes("Fi'il"));
      const correct = isJumlahFiliyyah ? "Jumlah Fi'liyyah" : "Jumlah Ismiyyah";
      const distractors = pickDistractors(correct, DISTRACTORS_POOLS.jumlah);
      const { options, correctIndex } = buildShuffledOptions(correct, distractors);
      return {
        questionText: "Kalimat tersebut termasuk jumlah apa?",
        correctAnswer: correct,
        options,
        correctIndex,
        explanation: `Kalimat "${q.correctAnswer}" — ${q.explanation}`,
        arabicText: q.arabicText,
        type,
      };
    }

    default:
      return fallbackQuestion(q);
  }
}

function fallbackQuestion(q: AudioQuestion): GeneratedQuestion {
  const distractors = pickDistractors(q.correctAnswer, DISTRACTORS_POOLS.materi);
  const { options, correctIndex } = buildShuffledOptions(q.correctAnswer, distractors);
  return {
    questionText: "Kalimat yang didengar termasuk materi apa?",
    correctAnswer: q.correctAnswer,
    options,
    correctIndex,
    explanation: q.explanation,
    arabicText: q.arabicText,
    type: "identify_materi",
  };
}

function getPoolKeyForRole(role: string): string {
  if (role.includes("Huruf Jar") || role === "Huruf Jar") return "huruf_jar";
  if (role.includes("Dhomir")) return "dhomir";
  if (role.includes("Isyaroh")) return "isyaroh";
  if (role.includes("Maushul")) return "maushul";
  if (role.includes("Majrur")) return "huruf_jar";
  if (role.includes("Tanda")) return "tanda_isim";
  if (role.includes("Wazan") || role.includes("فَاعِل") || role.includes("مَفْعُول")) return "wazan";
  return "jenis_kata";
}

/** Generate a full set of varied questions for a quiz session */
export function generateQuizSession(quiz: AudioBabQuiz): GeneratedQuestion[] {
  const shuffledQs = shuffleArray(quiz.questions);
  const generated: GeneratedQuestion[] = [];
  let lastType: QuestionType | null = null;

  for (const q of shuffledQs) {
    // Try to avoid same question type consecutively
    let attempts = 0;
    let gq: GeneratedQuestion;
    do {
      gq = generateDynamicQuestion(q);
      attempts++;
    } while (gq.type === lastType && q.allowedTypes.length > 1 && attempts < 4);

    lastType = gq.type;
    generated.push(gq);
  }

  return generated;
}

// Legacy compat
export function getShuffledOptions(q: AudioQuestion): { options: string[]; correctIndex: number } {
  const all = [q.correctAnswer, ...q.distractors];
  const shuffled = shuffleArray(all);
  return { options: shuffled, correctIndex: shuffled.indexOf(q.correctAnswer) };
}

// =====================
// AMTSILATI - JILID 1
// =====================

const AMTSILATI_J1_HURUF_JAR: AudioBabQuiz = {
  kitabId: "amtsilati", jilidId: "jilid1", babId: "huruf_jar", babTitle: "Huruf Jar",
  questions: [
    {
      id: "aq_hj1", arabicText: "مَرَرْتُ بِزَيْدٍ", correctAnswer: "Huruf Jar",
      distractors: ["Isim Dhomir", "Isim Isyaroh", "Isim Maushul"],
      explanation: "Huruf 'بِ' (bi) adalah huruf jar sehingga membuat kata setelahnya (زَيْدٍ) menjadi majrur.",
      concepts: [
        { keyElement: "بِ", role: "Huruf Jar", conceptLabel: "huruf jar" },
        { keyElement: "زَيْدٍ", role: "Isim Majrur", conceptLabel: "isim majrur" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "fungsi_kata", "jenis_kata"],
    },
    {
      id: "aq_hj2", arabicText: "ذَهَبَ إِلَى المَسْجِدِ", correctAnswer: "Huruf Jar",
      distractors: ["Isim Dhomir", "Fi'il Madhi", "Isim Isyaroh"],
      explanation: "Huruf 'إِلَى' adalah huruf jar yang berarti 'ke'. المَسْجِدِ menjadi isim majrur.",
      concepts: [
        { keyElement: "إِلَى", role: "Huruf Jar", conceptLabel: "huruf jar" },
        { keyElement: "المَسْجِدِ", role: "Isim Majrur", conceptLabel: "isim majrur" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "fungsi_kata", "jenis_kata", "deteksi_struktur"],
    },
    {
      id: "aq_hj3", arabicText: "خَرَجَ مِنَ البَيْتِ", correctAnswer: "Huruf Jar",
      distractors: ["Isim Maushul", "Isim Dhomir", "Isim Isyaroh"],
      explanation: "Huruf 'مِنْ' adalah huruf jar yang berarti 'dari'. البَيْتِ menjadi isim majrur.",
      concepts: [
        { keyElement: "مِنَ", role: "Huruf Jar", conceptLabel: "huruf jar" },
        { keyElement: "البَيْتِ", role: "Isim Majrur", conceptLabel: "isim majrur" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "fungsi_kata", "deteksi_struktur"],
    },
    {
      id: "aq_hj4", arabicText: "الكِتَابُ عَلَى المَكْتَبِ", correctAnswer: "Huruf Jar",
      distractors: ["Isim Dhomir", "Isim Isyaroh", "Isim Maushul"],
      explanation: "Huruf 'عَلَى' adalah huruf jar yang berarti 'di atas'.",
      concepts: [
        { keyElement: "عَلَى", role: "Huruf Jar", conceptLabel: "huruf jar" },
        { keyElement: "المَكْتَبِ", role: "Isim Majrur", conceptLabel: "isim majrur" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "fungsi_kata", "deteksi_struktur"],
    },
    {
      id: "aq_hj5", arabicText: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ", correctAnswer: "Huruf Jar",
      distractors: ["Isim Dhomir", "Isim Isyaroh", "Fi'il Mudhari'"],
      explanation: "Huruf 'بِ' pada بِسْمِ adalah huruf jar.",
      concepts: [
        { keyElement: "بِ", role: "Huruf Jar", conceptLabel: "huruf jar" },
        { keyElement: "اسْمِ", role: "Isim Majrur", conceptLabel: "isim majrur" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "fungsi_kata"],
    },
    {
      id: "aq_hj6", arabicText: "جَلَسَ فِي الغُرْفَةِ", correctAnswer: "Huruf Jar",
      distractors: ["Isim Maushul", "Isim Dhomir", "Isim Isyaroh"],
      explanation: "Huruf 'فِي' adalah huruf jar yang berarti 'di dalam'. الغُرْفَةِ menjadi isim majrur.",
      concepts: [
        { keyElement: "فِي", role: "Huruf Jar", conceptLabel: "huruf jar" },
        { keyElement: "الغُرْفَةِ", role: "Isim Majrur", conceptLabel: "isim majrur" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "fungsi_kata", "deteksi_struktur"],
    },
    {
      id: "aq_hj7", arabicText: "هٰذَا كَالقَمَرِ", correctAnswer: "Huruf Jar",
      distractors: ["Isim Isyaroh", "Isim Dhomir", "Isim Maushul"],
      explanation: "Huruf 'كَ' adalah huruf jar yang berarti 'seperti'.",
      concepts: [
        { keyElement: "كَ", role: "Huruf Jar", conceptLabel: "huruf jar" },
        { keyElement: "القَمَرِ", role: "Isim Majrur", conceptLabel: "isim majrur" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "fungsi_kata"],
    },
  ],
};

const AMTSILATI_J1_ISIM_DHOMIR: AudioBabQuiz = {
  kitabId: "amtsilati", jilidId: "jilid1", babId: "isim_dhomir", babTitle: "Isim Dhomir",
  questions: [
    {
      id: "aq_id1", arabicText: "هُوَ طَالِبٌ", correctAnswer: "Isim Dhomir",
      distractors: ["Huruf Jar", "Isim Isyaroh", "Isim Maushul"],
      explanation: "هُوَ adalah dhomir (kata ganti) orang ketiga laki-laki tunggal.",
      concepts: [
        { keyElement: "هُوَ", role: "Isim Dhomir", conceptLabel: "isim dhomir" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "jenis_kata", "deteksi_struktur"],
    },
    {
      id: "aq_id2", arabicText: "هِيَ مُعَلِّمَةٌ", correctAnswer: "Isim Dhomir",
      distractors: ["Huruf Jar", "Isim Isyaroh", "Isim Maushul"],
      explanation: "هِيَ adalah dhomir orang ketiga perempuan tunggal.",
      concepts: [
        { keyElement: "هِيَ", role: "Isim Dhomir", conceptLabel: "isim dhomir" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "jenis_kata", "deteksi_struktur"],
    },
    {
      id: "aq_id3", arabicText: "أَنَا مُسْلِمٌ", correctAnswer: "Isim Dhomir",
      distractors: ["Isim Isyaroh", "Huruf Jar", "Isim Maushul"],
      explanation: "أَنَا adalah dhomir orang pertama tunggal (saya).",
      concepts: [
        { keyElement: "أَنَا", role: "Isim Dhomir", conceptLabel: "isim dhomir" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "jenis_kata", "deteksi_struktur"],
    },
    {
      id: "aq_id4", arabicText: "أَنْتَ تَلْمِيذٌ", correctAnswer: "Isim Dhomir",
      distractors: ["Huruf Jar", "Isim Isyaroh", "Fi'il Madhi"],
      explanation: "أَنْتَ adalah dhomir orang kedua laki-laki tunggal (kamu).",
      concepts: [
        { keyElement: "أَنْتَ", role: "Isim Dhomir", conceptLabel: "isim dhomir" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "jenis_kata"],
    },
    {
      id: "aq_id5", arabicText: "نَحْنُ مُسْلِمُونَ", correctAnswer: "Isim Dhomir",
      distractors: ["Isim Isyaroh", "Huruf Jar", "Isim Maushul"],
      explanation: "نَحْنُ adalah dhomir orang pertama jamak (kami/kita).",
      concepts: [
        { keyElement: "نَحْنُ", role: "Isim Dhomir", conceptLabel: "isim dhomir" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "jenis_kata", "deteksi_struktur"],
    },
    {
      id: "aq_id6", arabicText: "هُمْ فِي المَدْرَسَةِ", correctAnswer: "Isim Dhomir",
      distractors: ["Huruf Jar", "Isim Isyaroh", "Isim Maushul"],
      explanation: "هُمْ adalah dhomir orang ketiga jamak laki-laki (mereka).",
      concepts: [
        { keyElement: "هُمْ", role: "Isim Dhomir", conceptLabel: "isim dhomir" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "jenis_kata"],
    },
    {
      id: "aq_id7", arabicText: "أَنْتُمْ طُلَّابٌ", correctAnswer: "Isim Dhomir",
      distractors: ["Isim Isyaroh", "Isim Maushul", "Huruf Jar"],
      explanation: "أَنْتُمْ adalah dhomir orang kedua jamak laki-laki (kalian).",
      concepts: [
        { keyElement: "أَنْتُمْ", role: "Isim Dhomir", conceptLabel: "isim dhomir" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "jenis_kata", "deteksi_struktur"],
    },
  ],
};

const AMTSILATI_J1_ISIM_ISYAROH: AudioBabQuiz = {
  kitabId: "amtsilati", jilidId: "jilid1", babId: "isim_isyaroh", babTitle: "Isim Isyaroh",
  questions: [
    {
      id: "aq_ii1", arabicText: "هٰذَا كِتَابٌ", correctAnswer: "Isim Isyaroh",
      distractors: ["Isim Dhomir", "Huruf Jar", "Isim Maushul"],
      explanation: "هٰذَا adalah isim isyaroh (kata tunjuk) untuk dekat, mudzakkar mufrad.",
      concepts: [
        { keyElement: "هٰذَا", role: "Isim Isyaroh", conceptLabel: "isim isyaroh" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "jenis_kata", "deteksi_struktur"],
    },
    {
      id: "aq_ii2", arabicText: "هٰذِهِ مَدْرَسَةٌ", correctAnswer: "Isim Isyaroh",
      distractors: ["Isim Dhomir", "Huruf Jar", "Isim Maushul"],
      explanation: "هٰذِهِ adalah isim isyaroh untuk dekat, muannats mufrad.",
      concepts: [
        { keyElement: "هٰذِهِ", role: "Isim Isyaroh", conceptLabel: "isim isyaroh" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "jenis_kata", "deteksi_struktur"],
    },
    {
      id: "aq_ii3", arabicText: "ذٰلِكَ الكِتَابُ لَا رَيْبَ فِيهِ", correctAnswer: "Isim Isyaroh",
      distractors: ["Huruf Jar", "Isim Dhomir", "Isim Maushul"],
      explanation: "ذٰلِكَ adalah isim isyaroh untuk jauh, mudzakkar mufrad.",
      concepts: [
        { keyElement: "ذٰلِكَ", role: "Isim Isyaroh", conceptLabel: "isim isyaroh" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "jenis_kata"],
    },
    {
      id: "aq_ii4", arabicText: "تِلْكَ أُمَّةٌ قَدْ خَلَتْ", correctAnswer: "Isim Isyaroh",
      distractors: ["Isim Dhomir", "Huruf Jar", "Fi'il Madhi"],
      explanation: "تِلْكَ adalah isim isyaroh untuk jauh, muannats mufrad.",
      concepts: [
        { keyElement: "تِلْكَ", role: "Isim Isyaroh", conceptLabel: "isim isyaroh" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "jenis_kata"],
    },
    {
      id: "aq_ii5", arabicText: "هٰؤُلَاءِ طُلَّابٌ", correctAnswer: "Isim Isyaroh",
      distractors: ["Isim Dhomir", "Isim Maushul", "Huruf Jar"],
      explanation: "هٰؤُلَاءِ adalah isim isyaroh untuk jamak dekat.",
      concepts: [
        { keyElement: "هٰؤُلَاءِ", role: "Isim Isyaroh", conceptLabel: "isim isyaroh" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "jenis_kata", "deteksi_struktur"],
    },
    {
      id: "aq_ii6", arabicText: "أُولٰئِكَ هُمُ المُفْلِحُونَ", correctAnswer: "Isim Isyaroh",
      distractors: ["Isim Dhomir", "Isim Maushul", "Huruf Jar"],
      explanation: "أُولٰئِكَ adalah isim isyaroh untuk jamak jauh.",
      concepts: [
        { keyElement: "أُولٰئِكَ", role: "Isim Isyaroh", conceptLabel: "isim isyaroh" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "jenis_kata"],
    },
  ],
};

const AMTSILATI_J1_ISIM_MAUSHUL: AudioBabQuiz = {
  kitabId: "amtsilati", jilidId: "jilid1", babId: "isim_maushul", babTitle: "Isim Maushul",
  questions: [
    {
      id: "aq_im1", arabicText: "جَاءَ الَّذِي نَجَحَ", correctAnswer: "Isim Maushul",
      distractors: ["Isim Dhomir", "Isim Isyaroh", "Huruf Jar"],
      explanation: "الَّذِي adalah isim maushul untuk tunggal mudzakkar.",
      concepts: [
        { keyElement: "الَّذِي", role: "Isim Maushul", conceptLabel: "isim maushul" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "jenis_kata", "deteksi_struktur"],
    },
    {
      id: "aq_im2", arabicText: "رَأَيْتُ الَّتِي كَتَبَتْ", correctAnswer: "Isim Maushul",
      distractors: ["Isim Dhomir", "Isim Isyaroh", "Huruf Jar"],
      explanation: "الَّتِي adalah isim maushul untuk tunggal muannats.",
      concepts: [
        { keyElement: "الَّتِي", role: "Isim Maushul", conceptLabel: "isim maushul" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "jenis_kata", "deteksi_struktur"],
    },
    {
      id: "aq_im3", arabicText: "الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ", correctAnswer: "Isim Maushul",
      distractors: ["Huruf Jar", "Isim Dhomir", "Isim Isyaroh"],
      explanation: "الَّذِينَ adalah isim maushul untuk jamak mudzakkar.",
      concepts: [
        { keyElement: "الَّذِينَ", role: "Isim Maushul", conceptLabel: "isim maushul" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "jenis_kata"],
    },
    {
      id: "aq_im4", arabicText: "مَنْ يَعْمَلْ خَيْرًا يَجِدْهُ", correctAnswer: "Isim Maushul",
      distractors: ["Isim Dhomir", "Isim Isyaroh", "Huruf Jar"],
      explanation: "مَنْ di sini berfungsi sebagai isim maushul.",
      concepts: [
        { keyElement: "مَنْ", role: "Isim Maushul", conceptLabel: "isim maushul" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "jenis_kata"],
    },
    {
      id: "aq_im5", arabicText: "مَا عِنْدَكُمْ يَنْفَدُ وَمَا عِنْدَ اللّٰهِ بَاقٍ", correctAnswer: "Isim Maushul",
      distractors: ["Isim Isyaroh", "Isim Dhomir", "Huruf Jar"],
      explanation: "مَا di sini berfungsi sebagai isim maushul.",
      concepts: [
        { keyElement: "مَا", role: "Isim Maushul", conceptLabel: "isim maushul" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "jenis_kata"],
    },
    {
      id: "aq_im6", arabicText: "اللَّاتِي يَحْفَظْنَ القُرْآنَ", correctAnswer: "Isim Maushul",
      distractors: ["Isim Dhomir", "Huruf Jar", "Isim Isyaroh"],
      explanation: "اللَّاتِي adalah isim maushul untuk jamak muannats.",
      concepts: [
        { keyElement: "اللَّاتِي", role: "Isim Maushul", conceptLabel: "isim maushul" },
      ],
      allowedTypes: ["identify_materi", "identify_unsur", "jenis_kata"],
    },
  ],
};

// =====================
// AMTSILATI - JILID 2
// =====================

const AMTSILATI_J2_TANDA_ISIM: AudioBabQuiz = {
  kitabId: "amtsilati", jilidId: "jilid2", babId: "tanda_isim", babTitle: "Tanda-tanda Isim",
  questions: [
    {
      id: "aq_ti1", arabicText: "جَاءَ رَجُلٌ", correctAnswer: "Tanda-tanda Isim",
      distractors: ["Macam-macam Isim", "Huruf Jar", "Isim Dhomir"],
      explanation: "رَجُلٌ memiliki tanwin (ٌ) — salah satu tanda isim.",
      concepts: [
        { keyElement: "رَجُلٌ", role: "Isim", conceptLabel: "isim bertanwin" },
        { keyElement: "tanwin (ٌ)", role: "Tanwin", conceptLabel: "tanda isim" },
      ],
      allowedTypes: ["identify_materi", "fungsi_kata", "jenis_kata", "deteksi_struktur"],
    },
    {
      id: "aq_ti2", arabicText: "الحَمْدُ لِلّٰهِ", correctAnswer: "Tanda-tanda Isim",
      distractors: ["Huruf Jar", "Isim Maushul", "Macam-macam Isim"],
      explanation: "الحَمْدُ memiliki 'ال' (alif lam) — salah satu tanda isim.",
      concepts: [
        { keyElement: "الحَمْدُ", role: "Isim", conceptLabel: "isim dengan alif lam" },
        { keyElement: "ال", role: "Alif Lam (ال)", conceptLabel: "tanda isim" },
      ],
      allowedTypes: ["identify_materi", "fungsi_kata", "jenis_kata"],
    },
    {
      id: "aq_ti3", arabicText: "يَا مُحَمَّدُ", correctAnswer: "Tanda-tanda Isim",
      distractors: ["Isim Dhomir", "Isim Isyaroh", "Macam-macam Isim"],
      explanation: "مُحَمَّدُ didahului يَا (nida/panggilan) — salah satu tanda isim.",
      concepts: [
        { keyElement: "مُحَمَّدُ", role: "Isim", conceptLabel: "isim munada" },
        { keyElement: "يَا", role: "Nida (يا)", conceptLabel: "tanda isim" },
      ],
      allowedTypes: ["identify_materi", "fungsi_kata", "jenis_kata"],
    },
    {
      id: "aq_ti4", arabicText: "كَتَبَ الطَّالِبُ الدَّرْسَ", correctAnswer: "Tanda-tanda Isim",
      distractors: ["Huruf Jar", "Isim Maushul", "Macam-macam Isim"],
      explanation: "الطَّالِبُ adalah musnad ilaih (fa'il) yang memiliki ال — tanda isim.",
      concepts: [
        { keyElement: "الطَّالِبُ", role: "Isim", conceptLabel: "isim fa'il" },
        { keyElement: "ال", role: "Alif Lam (ال)", conceptLabel: "tanda isim" },
      ],
      allowedTypes: ["identify_materi", "fungsi_kata", "jenis_kata", "deteksi_struktur"],
    },
    {
      id: "aq_ti5", arabicText: "فِي بَيْتٍ كَبِيرٍ", correctAnswer: "Tanda-tanda Isim",
      distractors: ["Isim Isyaroh", "Isim Dhomir", "Huruf Jar"],
      explanation: "بَيْتٍ dijarkan oleh فِي dan memiliki tanwin — dua tanda isim sekaligus.",
      concepts: [
        { keyElement: "بَيْتٍ", role: "Isim", conceptLabel: "isim bertanwin dan majrur" },
        { keyElement: "tanwin (ٍ)", role: "Tanwin", conceptLabel: "tanda isim" },
      ],
      allowedTypes: ["identify_materi", "fungsi_kata", "jenis_kata"],
    },
    {
      id: "aq_ti6", arabicText: "المُسْلِمُونَ يُصَلُّونَ", correctAnswer: "Tanda-tanda Isim",
      distractors: ["Macam-macam Isim", "Isim Maushul", "Isim Dhomir"],
      explanation: "المُسْلِمُونَ memiliki 'ال' — salah satu tanda isim.",
      concepts: [
        { keyElement: "المُسْلِمُونَ", role: "Isim", conceptLabel: "isim dengan alif lam" },
        { keyElement: "ال", role: "Alif Lam (ال)", conceptLabel: "tanda isim" },
      ],
      allowedTypes: ["identify_materi", "fungsi_kata", "jenis_kata", "deteksi_struktur"],
    },
  ],
};

const AMTSILATI_J2_MACAM_ISIM: AudioBabQuiz = {
  kitabId: "amtsilati", jilidId: "jilid2", babId: "macam_isim", babTitle: "Macam-macam Isim",
  questions: [
    {
      id: "aq_mi1", arabicText: "كِتَابٌ جَدِيدٌ", correctAnswer: "Macam-macam Isim",
      distractors: ["Tanda-tanda Isim", "Huruf Jar", "Isim Dhomir"],
      explanation: "كِتَابٌ adalah isim nakirah (tanpa ال) — salah satu macam isim.",
      concepts: [
        { keyElement: "كِتَابٌ", role: "Isim Nakirah", conceptLabel: "macam isim" },
      ],
      allowedTypes: ["identify_materi", "jenis_kata", "deteksi_struktur"],
    },
    {
      id: "aq_mi2", arabicText: "الكِتَابُ المُفِيدُ", correctAnswer: "Macam-macam Isim",
      distractors: ["Tanda-tanda Isim", "Isim Isyaroh", "Huruf Jar"],
      explanation: "الكِتَابُ adalah isim ma'rifat (dengan ال) — salah satu macam isim.",
      concepts: [
        { keyElement: "الكِتَابُ", role: "Isim Ma'rifat", conceptLabel: "macam isim" },
      ],
      allowedTypes: ["identify_materi", "jenis_kata", "deteksi_struktur"],
    },
    {
      id: "aq_mi3", arabicText: "مُعَلِّمَةٌ فَاضِلَةٌ", correctAnswer: "Macam-macam Isim",
      distractors: ["Huruf Jar", "Isim Dhomir", "Tanda-tanda Isim"],
      explanation: "مُعَلِّمَةٌ adalah isim muannats (dengan ta marbuthoh) — salah satu macam isim.",
      concepts: [
        { keyElement: "مُعَلِّمَةٌ", role: "Isim Muannats", conceptLabel: "macam isim" },
      ],
      allowedTypes: ["identify_materi", "jenis_kata"],
    },
    {
      id: "aq_mi4", arabicText: "المُسْلِمُونَ وَالمُسْلِمَاتُ", correctAnswer: "Macam-macam Isim",
      distractors: ["Isim Maushul", "Huruf Jar", "Tanda-tanda Isim"],
      explanation: "المُسْلِمُونَ jamak mudzakkar salim, المُسْلِمَاتُ jamak muannats salim.",
      concepts: [
        { keyElement: "المُسْلِمُونَ", role: "Jamak Mudzakkar Salim", conceptLabel: "macam isim" },
        { keyElement: "المُسْلِمَاتُ", role: "Jamak Muannats Salim", conceptLabel: "macam isim" },
      ],
      allowedTypes: ["identify_materi", "jenis_kata", "fungsi_kata"],
    },
    {
      id: "aq_mi5", arabicText: "طَالِبَانِ مُجْتَهِدَانِ", correctAnswer: "Macam-macam Isim",
      distractors: ["Tanda-tanda Isim", "Isim Dhomir", "Huruf Jar"],
      explanation: "طَالِبَانِ adalah tatsniyah (bentuk dua) — salah satu macam isim.",
      concepts: [
        { keyElement: "طَالِبَانِ", role: "Tatsniyah", conceptLabel: "macam isim" },
      ],
      allowedTypes: ["identify_materi", "jenis_kata"],
    },
    {
      id: "aq_mi6", arabicText: "رِجَالٌ صَالِحُونَ", correctAnswer: "Macam-macam Isim",
      distractors: ["Huruf Jar", "Isim Isyaroh", "Tanda-tanda Isim"],
      explanation: "رِجَالٌ adalah jamak taksir dari رَجُل — salah satu macam isim.",
      concepts: [
        { keyElement: "رِجَالٌ", role: "Jamak Taksir", conceptLabel: "macam isim" },
      ],
      allowedTypes: ["identify_materi", "jenis_kata"],
    },
  ],
};

const AMTSILATI_J2_ISIM_FAIL: AudioBabQuiz = {
  kitabId: "amtsilati", jilidId: "jilid2", babId: "isim_fail", babTitle: "Isim Fa'il",
  questions: [
    {
      id: "aq_if1", arabicText: "جَاءَ الكَاتِبُ", correctAnswer: "Isim Fa'il",
      distractors: ["Isim Maf'ul", "Masdar", "Huruf Jar"],
      explanation: "الكَاتِبُ (yang menulis) berwazankan فَاعِل — isim fa'il.",
      concepts: [
        { keyElement: "الكَاتِبُ", role: "Isim Fa'il", conceptLabel: "isim fa'il" },
        { keyElement: "فَاعِل", role: "Wazan Isim Fa'il", conceptLabel: "wazan" },
      ],
      allowedTypes: ["identify_materi", "jenis_kata", "fungsi_kata", "deteksi_struktur"],
    },
    {
      id: "aq_if2", arabicText: "المُعَلِّمُ فِي الفَصْلِ", correctAnswer: "Isim Fa'il",
      distractors: ["Isim Maf'ul", "Masdar", "Isim Dhomir"],
      explanation: "المُعَلِّمُ (yang mengajar) adalah isim fa'il dari عَلَّمَ.",
      concepts: [
        { keyElement: "المُعَلِّمُ", role: "Isim Fa'il", conceptLabel: "isim fa'il" },
      ],
      allowedTypes: ["identify_materi", "jenis_kata", "deteksi_struktur"],
    },
    {
      id: "aq_if3", arabicText: "هُوَ طَالِبٌ مُجْتَهِدٌ", correctAnswer: "Isim Fa'il",
      distractors: ["Masdar", "Isim Maf'ul", "Isim Isyaroh"],
      explanation: "طَالِبٌ (yang menuntut ilmu) berwazankan فَاعِل — isim fa'il.",
      concepts: [
        { keyElement: "طَالِبٌ", role: "Isim Fa'il", conceptLabel: "isim fa'il" },
      ],
      allowedTypes: ["identify_materi", "jenis_kata", "fungsi_kata"],
    },
    {
      id: "aq_if4", arabicText: "النَّاصِرُ قَوِيٌّ", correctAnswer: "Isim Fa'il",
      distractors: ["Isim Maf'ul", "Huruf Jar", "Masdar"],
      explanation: "النَّاصِرُ (yang menolong) berwazankan فَاعِل — isim fa'il.",
      concepts: [
        { keyElement: "النَّاصِرُ", role: "Isim Fa'il", conceptLabel: "isim fa'il" },
      ],
      allowedTypes: ["identify_materi", "jenis_kata", "deteksi_struktur"],
    },
    {
      id: "aq_if5", arabicText: "الحَافِظُ يَقْرَأُ القُرْآنَ", correctAnswer: "Isim Fa'il",
      distractors: ["Masdar", "Isim Maf'ul", "Isim Maushul"],
      explanation: "الحَافِظُ (yang menghafal) berwazankan فَاعِل — isim fa'il.",
      concepts: [
        { keyElement: "الحَافِظُ", role: "Isim Fa'il", conceptLabel: "isim fa'il" },
      ],
      allowedTypes: ["identify_materi", "jenis_kata", "deteksi_struktur"],
    },
  ],
};

const AMTSILATI_J2_ISIM_MAFUL: AudioBabQuiz = {
  kitabId: "amtsilati", jilidId: "jilid2", babId: "isim_maful", babTitle: "Isim Maf'ul",
  questions: [
    {
      id: "aq_imf1", arabicText: "هٰذَا مَكْتُوبٌ", correctAnswer: "Isim Maf'ul",
      distractors: ["Isim Fa'il", "Masdar", "Huruf Jar"],
      explanation: "مَكْتُوبٌ (yang ditulis) berwazankan مَفْعُول — isim maf'ul.",
      concepts: [
        { keyElement: "مَكْتُوبٌ", role: "Isim Maf'ul", conceptLabel: "isim maf'ul" },
        { keyElement: "مَفْعُول", role: "Wazan Isim Maf'ul", conceptLabel: "wazan" },
      ],
      allowedTypes: ["identify_materi", "jenis_kata", "fungsi_kata", "deteksi_struktur"],
    },
    {
      id: "aq_imf2", arabicText: "البَابُ مَفْتُوحٌ", correctAnswer: "Isim Maf'ul",
      distractors: ["Isim Fa'il", "Masdar", "Isim Dhomir"],
      explanation: "مَفْتُوحٌ (yang dibuka) berwazankan مَفْعُول — isim maf'ul.",
      concepts: [
        { keyElement: "مَفْتُوحٌ", role: "Isim Maf'ul", conceptLabel: "isim maf'ul" },
      ],
      allowedTypes: ["identify_materi", "jenis_kata", "deteksi_struktur"],
    },
    {
      id: "aq_imf3", arabicText: "الدَّرْسُ مَفْهُومٌ", correctAnswer: "Isim Maf'ul",
      distractors: ["Isim Fa'il", "Huruf Jar", "Masdar"],
      explanation: "مَفْهُومٌ (yang dipahami) berwazankan مَفْعُول — isim maf'ul.",
      concepts: [
        { keyElement: "مَفْهُومٌ", role: "Isim Maf'ul", conceptLabel: "isim maf'ul" },
      ],
      allowedTypes: ["identify_materi", "jenis_kata", "deteksi_struktur"],
    },
    {
      id: "aq_imf4", arabicText: "الكِتَابُ مَعْرُوفٌ", correctAnswer: "Isim Maf'ul",
      distractors: ["Masdar", "Isim Fa'il", "Isim Isyaroh"],
      explanation: "مَعْرُوفٌ (yang dikenal) berwazankan مَفْعُول — isim maf'ul.",
      concepts: [
        { keyElement: "مَعْرُوفٌ", role: "Isim Maf'ul", conceptLabel: "isim maf'ul" },
      ],
      allowedTypes: ["identify_materi", "jenis_kata"],
    },
    {
      id: "aq_imf5", arabicText: "الوَلَدُ مَحْبُوبٌ", correctAnswer: "Isim Maf'ul",
      distractors: ["Isim Fa'il", "Masdar", "Huruf Jar"],
      explanation: "مَحْبُوبٌ (yang dicintai) berwazankan مَفْعُول — isim maf'ul.",
      concepts: [
        { keyElement: "مَحْبُوبٌ", role: "Isim Maf'ul", conceptLabel: "isim maf'ul" },
      ],
      allowedTypes: ["identify_materi", "jenis_kata", "deteksi_struktur"],
    },
  ],
};

const AMTSILATI_J2_MASDAR: AudioBabQuiz = {
  kitabId: "amtsilati", jilidId: "jilid2", babId: "masdar", babTitle: "Masdar",
  questions: [
    {
      id: "aq_ms1", arabicText: "الكِتَابَةُ مُهِمَّةٌ", correctAnswer: "Masdar",
      distractors: ["Isim Fa'il", "Isim Maf'ul", "Huruf Jar"],
      explanation: "الكِتَابَةُ (penulisan) adalah masdar dari كَتَبَ.",
      concepts: [
        { keyElement: "الكِتَابَةُ", role: "Masdar", conceptLabel: "masdar" },
      ],
      allowedTypes: ["identify_materi", "jenis_kata", "deteksi_struktur"],
    },
    {
      id: "aq_ms2", arabicText: "القِرَاءَةُ مُفِيدَةٌ", correctAnswer: "Masdar",
      distractors: ["Isim Fa'il", "Isim Maf'ul", "Isim Dhomir"],
      explanation: "القِرَاءَةُ (bacaan/membaca) adalah masdar dari قَرَأَ.",
      concepts: [
        { keyElement: "القِرَاءَةُ", role: "Masdar", conceptLabel: "masdar" },
      ],
      allowedTypes: ["identify_materi", "jenis_kata", "deteksi_struktur"],
    },
    {
      id: "aq_ms3", arabicText: "التَّعْلِيمُ فَرِيضَةٌ", correctAnswer: "Masdar",
      distractors: ["Isim Maf'ul", "Isim Fa'il", "Isim Isyaroh"],
      explanation: "التَّعْلِيمُ (pengajaran) adalah masdar dari عَلَّمَ.",
      concepts: [
        { keyElement: "التَّعْلِيمُ", role: "Masdar", conceptLabel: "masdar" },
      ],
      allowedTypes: ["identify_materi", "jenis_kata", "deteksi_struktur"],
    },
    {
      id: "aq_ms4", arabicText: "الصَّبْرُ مِفْتَاحُ الفَرَجِ", correctAnswer: "Masdar",
      distractors: ["Huruf Jar", "Isim Fa'il", "Isim Maf'ul"],
      explanation: "الصَّبْرُ (kesabaran) adalah masdar dari صَبَرَ.",
      concepts: [
        { keyElement: "الصَّبْرُ", role: "Masdar", conceptLabel: "masdar" },
      ],
      allowedTypes: ["identify_materi", "jenis_kata"],
    },
    {
      id: "aq_ms5", arabicText: "النَّصْرُ مِنَ اللّٰهِ", correctAnswer: "Masdar",
      distractors: ["Isim Fa'il", "Isim Maf'ul", "Isim Maushul"],
      explanation: "النَّصْرُ (pertolongan) adalah masdar dari نَصَرَ.",
      concepts: [
        { keyElement: "النَّصْرُ", role: "Masdar", conceptLabel: "masdar" },
      ],
      allowedTypes: ["identify_materi", "jenis_kata"],
    },
  ],
};

// Collect all audio quizzes
export const ALL_AUDIO_QUIZZES: AudioBabQuiz[] = [
  AMTSILATI_J1_HURUF_JAR,
  AMTSILATI_J1_ISIM_DHOMIR,
  AMTSILATI_J1_ISIM_ISYAROH,
  AMTSILATI_J1_ISIM_MAUSHUL,
  AMTSILATI_J2_TANDA_ISIM,
  AMTSILATI_J2_MACAM_ISIM,
  AMTSILATI_J2_ISIM_FAIL,
  AMTSILATI_J2_ISIM_MAFUL,
  AMTSILATI_J2_MASDAR,
];

export function getAudioQuiz(jilidId: string, babId: string): AudioBabQuiz | undefined {
  return ALL_AUDIO_QUIZZES.find(q => q.jilidId === jilidId && q.babId === babId);
}
