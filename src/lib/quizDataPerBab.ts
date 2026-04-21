// Per-bab quiz data: each bab has its own 10 MC + optional 5 essay (Jilid 2)

export interface McQuestion {
  id: string;
  question: string;
  options: [string, string, string, string]; // A B C D
  correctIndex: number; // 0-3
  explanation?: string;
}

export interface EssayFillQuestion {
  id: string;
  /** The ayat/sentence with ______ for blank */
  prompt: string;
  /** The correct answer to fill the blank */
  answer: string;
}

export interface BabQuiz {
  jilidId: string;
  babId: string;
  babTitle: string;
  mc: McQuestion[];
  essay?: EssayFillQuestion[];
}

// Helper to strip harakat for tolerance comparison
export function stripHarakat(text: string): string {
  // Remove Arabic diacritics: fathah, kasrah, dammah, sukun, shadda, tanwin, maddah, superscript alef, etc.
  return text.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g, '').trim();
}

export function compareAnswers(userAnswer: string, correctAnswer: string): { correct: boolean; diff: number[] } {
  const uStripped = stripHarakat(userAnswer.trim());
  const cStripped = stripHarakat(correctAnswer.trim());
  
  if (uStripped === cStripped) return { correct: true, diff: [] };
  
  // Find differing character positions
  const diff: number[] = [];
  const maxLen = Math.max(uStripped.length, cStripped.length);
  for (let i = 0; i < maxLen; i++) {
    if (uStripped[i] !== cStripped[i]) diff.push(i);
  }
  return { correct: false, diff };
}

export function getHint(answer: string, level: 1 | 2): string {
  const stripped = stripHarakat(answer);
  if (level === 1) {
    // Show first character
    return stripped.slice(0, 1) + "...";
  }
  // Show first and last
  return stripped.slice(0, 1) + "..." + stripped.slice(-1);
}

// =====================
// JILID 1 QUIZZES (10 MC each, no essay)
// =====================

export const JILID1_QUIZZES: BabQuiz[] = [
  {
    jilidId: "jilid1",
    babId: "huruf_jar",
    babTitle: "Huruf Jar",
    mc: [
      { id: "hj1", question: "Manakah yang termasuk Huruf Jar?", options: ["مِنْ", "لَمْ", "قَدْ", "سَوْفَ"], correctIndex: 0, explanation: "مِنْ adalah salah satu Huruf Jar yang berarti 'dari'." },
      { id: "hj2", question: "Huruf Jar berfungsi untuk...", options: ["Me-rafa'-kan isim", "Me-jar-kan isim", "Me-jazm-kan fi'il", "Me-nashab-kan fi'il"], correctIndex: 1, explanation: "Huruf Jar berfungsi me-jar-kan (mengkasrahkan) isim setelahnya." },
      { id: "hj3", question: "Berapa jumlah Huruf Jar?", options: ["5", "7", "10", "20"], correctIndex: 3, explanation: "Huruf Jar berjumlah 20 menurut keterangan yang lengkap." },
      { id: "hj4", question: "Contoh kalimat dengan Huruf Jar yang benar:", options: ["ذَهَبَ إِلَى المَسْجِدِ", "ذَهَبَ المَسْجِدُ", "إِلَى ذَهَبَ", "المَسْجِدِ إِلَى"], correctIndex: 0, explanation: "إِلَى adalah Huruf Jar yang menjar-kan المَسْجِدِ." },
      { id: "hj5", question: "Huruf 'بِ' termasuk jenis?", options: ["Huruf Athof", "Huruf Jar", "Huruf Nida", "Huruf Istifham"], correctIndex: 1, explanation: "بِ adalah salah satu Huruf Jar yang berarti 'dengan'." },
      { id: "hj6", question: "Isim setelah huruf jar dibaca?", options: ["Rofa'", "Nashab", "Jar (Kasroh)", "Jazm"], correctIndex: 2, explanation: "Isim setelah huruf jar berharokat kasroh (majrur)." },
      { id: "hj7", question: "Manakah yang BUKAN huruf jar?", options: ["عَنْ", "عَلَى", "قَدْ", "فِي"], correctIndex: 2, explanation: "قَدْ bukan huruf jar, melainkan huruf tahqiq." },
      { id: "hj8", question: "'كَ' dalam كَزَيْدٍ berarti?", options: ["Dari", "Ke", "Seperti", "Dengan"], correctIndex: 2, explanation: "كَ sebagai huruf jar berarti 'seperti'." },
      { id: "hj9", question: "'لِ' dalam لِلّٰهِ berfungsi sebagai?", options: ["Huruf Athof", "Huruf Jar", "Huruf Nafi", "Huruf Syarat"], correctIndex: 1, explanation: "لِ adalah huruf jar yang berarti 'milik' atau 'untuk'." },
      { id: "hj10", question: "Dalam بِسْمِ اللّٰهِ, huruf jar-nya adalah?", options: ["سْ", "بِ", "مِ", "اللّٰهِ"], correctIndex: 1, explanation: "بِ adalah huruf jar dalam بِسْمِ اللّٰهِ." },
    ],
  },
  {
    jilidId: "jilid1",
    babId: "isim_dhomir",
    babTitle: "Isim Dhomir",
    mc: [
      { id: "id1", question: "Isim Dhomir adalah...", options: ["Kata tunjuk", "Kata ganti", "Kata sifat", "Kata kerja"], correctIndex: 1, explanation: "Isim Dhomir berarti kata ganti (pronoun)." },
      { id: "id2", question: "هُوَ adalah dhomir untuk...", options: ["Dia (lk)", "Dia (pr)", "Kamu", "Saya"], correctIndex: 0, explanation: "هُوَ adalah kata ganti orang ketiga laki-laki tunggal." },
      { id: "id3", question: "Dhomir terbagi menjadi...", options: ["2 macam", "3 macam", "4 macam", "5 macam"], correctIndex: 0, explanation: "Dhomir terbagi menjadi muttashil (bersambung) dan munfashil (terpisah)." },
      { id: "id4", question: "هِيَ adalah dhomir untuk...", options: ["Dia (lk)", "Dia (pr)", "Kamu (pr)", "Mereka"], correctIndex: 1, explanation: "هِيَ adalah kata ganti orang ketiga perempuan tunggal." },
      { id: "id5", question: "أَنَا adalah dhomir untuk...", options: ["Kamu", "Dia", "Saya", "Kami"], correctIndex: 2, explanation: "أَنَا berarti saya (orang pertama tunggal)." },
      { id: "id6", question: "Dhomir muttashil adalah dhomir yang...", options: ["Berdiri sendiri", "Bersambung dengan kata lain", "Hanya untuk muannats", "Hanya untuk jamak"], correctIndex: 1, explanation: "Dhomir muttashil selalu bersambung dengan kata lain." },
      { id: "id7", question: "Contoh dhomir munfashil:", options: ["ـهُ", "ـكَ", "هُوَ", "ـنَا"], correctIndex: 2, explanation: "هُوَ adalah dhomir munfashil (berdiri sendiri)." },
      { id: "id8", question: "نَحْنُ adalah dhomir untuk...", options: ["Saya", "Kamu", "Kami/Kita", "Mereka"], correctIndex: 2, explanation: "نَحْنُ berarti kami/kita (orang pertama jamak)." },
      { id: "id9", question: "أَنْتُمْ adalah dhomir untuk...", options: ["Kalian (lk)", "Kalian (pr)", "Mereka (lk)", "Kami"], correctIndex: 0, explanation: "أَنْتُمْ berarti kalian (orang kedua jamak mudzakkar)." },
      { id: "id10", question: "Dhomir هُمْ untuk...", options: ["Mereka (lk)", "Mereka (pr)", "Kalian", "Kami"], correctIndex: 0, explanation: "هُمْ berarti mereka (orang ketiga jamak mudzakkar)." },
    ],
  },
  {
    jilidId: "jilid1",
    babId: "isim_isyaroh",
    babTitle: "Isim Isyaroh",
    mc: [
      { id: "ii1", question: "هٰذَا digunakan untuk...", options: ["Menunjuk dekat (lk)", "Menunjuk jauh (lk)", "Menunjuk dekat (pr)", "Menunjuk jauh (pr)"], correctIndex: 0, explanation: "هٰذَا untuk menunjuk benda dekat mudzakkar." },
      { id: "ii2", question: "Isim Isyaroh artinya...", options: ["Kata ganti", "Kata tunjuk", "Kata sifat", "Kata kerja"], correctIndex: 1, explanation: "Isim Isyaroh berarti kata tunjuk (demonstrative)." },
      { id: "ii3", question: "هٰذِهِ digunakan untuk...", options: ["Dekat (lk)", "Dekat (pr)", "Jauh (lk)", "Jauh (pr)"], correctIndex: 1, explanation: "هٰذِهِ untuk menunjuk benda dekat muannats." },
      { id: "ii4", question: "ذٰلِكَ digunakan untuk...", options: ["Dekat (lk)", "Dekat (pr)", "Jauh (lk)", "Jauh (pr)"], correctIndex: 2, explanation: "ذٰلِكَ untuk menunjuk benda jauh mudzakkar." },
      { id: "ii5", question: "تِلْكَ digunakan untuk...", options: ["Dekat (lk)", "Dekat (pr)", "Jauh (lk)", "Jauh (pr)"], correctIndex: 3, explanation: "تِلْكَ untuk menunjuk benda jauh muannats." },
      { id: "ii6", question: "Hukum isim isyaroh adalah?", options: ["Mu'rob", "Mabni", "Mu'tal", "Shohih"], correctIndex: 1, explanation: "Semua isim isyaroh adalah mabni." },
      { id: "ii7", question: "هٰذَانِ untuk menunjuk...", options: ["2 benda (lk) dekat", "2 benda (pr) dekat", "Jamak (lk)", "Jamak (pr)"], correctIndex: 0, explanation: "هٰذَانِ untuk tatsniyah mudzakkar dekat." },
      { id: "ii8", question: "هَاتَانِ untuk menunjuk...", options: ["2 benda (lk) dekat", "2 benda (pr) dekat", "Jamak (lk)", "Jamak (pr)"], correctIndex: 1, explanation: "هَاتَانِ untuk tatsniyah muannats dekat." },
      { id: "ii9", question: "أُولٰئِكَ digunakan untuk...", options: ["Tunggal dekat", "Tatsniyah jauh", "Jamak jauh", "Jamak dekat"], correctIndex: 2, explanation: "أُولٰئِكَ untuk menunjuk jamak jauh." },
      { id: "ii10", question: "هٰؤُلَاءِ digunakan untuk...", options: ["Tunggal dekat", "Tatsniyah dekat", "Jamak dekat", "Jamak jauh"], correctIndex: 2, explanation: "هٰؤُلَاءِ untuk menunjuk jamak dekat." },
    ],
  },
  {
    jilidId: "jilid1",
    babId: "isim_maushul",
    babTitle: "Isim Maushul",
    mc: [
      { id: "im1", question: "الَّذِي digunakan untuk...", options: ["Tunggal mudzakkar", "Tunggal muannats", "Jamak mudzakkar", "Jamak muannats"], correctIndex: 0, explanation: "الَّذِي adalah isim maushul untuk tunggal mudzakkar." },
      { id: "im2", question: "Isim Maushul berfungsi...", options: ["Menghubungkan kalimat", "Menunjuk benda", "Mengganti nama", "Menerangkan sifat"], correctIndex: 0, explanation: "Isim Maushul berfungsi menghubungkan dua kalimat." },
      { id: "im3", question: "الَّتِي digunakan untuk...", options: ["Tunggal mudzakkar", "Tunggal muannats", "Jamak mudzakkar", "Tatsniyah"], correctIndex: 1, explanation: "الَّتِي untuk tunggal muannats." },
      { id: "im4", question: "الَّذِينَ digunakan untuk...", options: ["Tunggal mudzakkar", "Tunggal muannats", "Jamak mudzakkar", "Jamak muannats"], correctIndex: 2, explanation: "الَّذِينَ untuk jamak mudzakkar." },
      { id: "im5", question: "اللَّاتِي digunakan untuk...", options: ["Tunggal mudzakkar", "Tunggal muannats", "Jamak mudzakkar", "Jamak muannats"], correctIndex: 3, explanation: "اللَّاتِي untuk jamak muannats." },
      { id: "im6", question: "Hukum isim maushul adalah?", options: ["Mu'rob", "Mabni", "Manshub", "Majzum"], correctIndex: 1, explanation: "Semua isim maushul adalah mabni." },
      { id: "im7", question: "Setelah isim maushul harus ada?", options: ["Mubtada", "Hal", "Shilah", "Tamyiz"], correctIndex: 2, explanation: "Setelah isim maushul harus ada shilah (jumlah penghubung)." },
      { id: "im8", question: "مَنْ sebagai isim maushul berarti?", options: ["Apa", "Siapa/yang (berakal)", "Dimana", "Kapan"], correctIndex: 1, explanation: "مَنْ untuk yang berakal." },
      { id: "im9", question: "مَا sebagai isim maushul berarti?", options: ["Siapa", "Yang (tidak berakal)", "Dimana", "Mengapa"], correctIndex: 1, explanation: "مَا untuk yang tidak berakal." },
      { id: "im10", question: "اللَّذَانِ digunakan untuk...", options: ["Tunggal mudzakkar", "Tatsniyah mudzakkar", "Jamak mudzakkar", "Tunggal muannats"], correctIndex: 1, explanation: "اللَّذَانِ untuk tatsniyah mudzakkar." },
    ],
  },
];

// =====================
// JILID 2 QUIZZES (10 MC + 5 essay each)
// =====================

export const JILID2_QUIZZES: BabQuiz[] = [
  {
    jilidId: "jilid2",
    babId: "tanda_isim",
    babTitle: "Tanda-tanda Isim",
    mc: [
      { id: "ti1", question: "Kata yang menunjukkan benda disebut?", options: ["Fi'il", "Huruf", "Isim", "Jumlah"], correctIndex: 2, explanation: "Isim adalah kata benda." },
      { id: "ti2", question: "Ciri utama isim adalah?", options: ["Bisa menerima jazm", "Bisa menerima jar", "Selalu fi'il", "Tidak bisa berubah"], correctIndex: 1, explanation: "Isim bisa menerima i'rob jar." },
      { id: "ti3", question: "Tanwin adalah tanda dari?", options: ["Fi'il", "Huruf", "Isim", "Jumlah"], correctIndex: 2, explanation: "Tanwin adalah salah satu tanda isim." },
      { id: "ti4", question: "Huruf nida digunakan untuk?", options: ["Bertanya", "Memanggil", "Menjelaskan", "Menghubungkan"], correctIndex: 1, explanation: "Huruf nida (يا) digunakan untuk memanggil." },
      { id: "ti5", question: "Kata setelah 'يا' disebut?", options: ["Fa'il", "Munada", "Mudhof", "Khabar"], correctIndex: 1, explanation: "Kata setelah يا disebut munada." },
      { id: "ti6", question: "Ada berapa tanda isim?", options: ["3", "4", "5", "6"], correctIndex: 2, explanation: "Tanda isim ada 5: jar, tanwin, nida, al, musnad ilaih." },
      { id: "ti7", question: "ال pada kata الكتاب menunjukkan?", options: ["Kata kerja", "Tanda isim", "Tanda fi'il", "Huruf"], correctIndex: 1, explanation: "ال (alif lam) adalah salah satu tanda isim." },
      { id: "ti8", question: "Musnad ilaih artinya?", options: ["Kata kerja", "Yang disandarkan kepadanya", "Huruf jar", "Kata sifat"], correctIndex: 1, explanation: "Musnad ilaih seperti fa'il atau mubtada." },
      { id: "ti9", question: "Jazm khusus untuk?", options: ["Isim", "Fi'il", "Huruf", "Jumlah"], correctIndex: 1, explanation: "Jar khusus isim, jazm khusus fi'il." },
      { id: "ti10", question: "Kata 'محمد' termasuk?", options: ["Fi'il", "Huruf", "Isim", "Jazm"], correctIndex: 2, explanation: "محمد adalah isim (kata benda/nama)." },
    ],
    essay: [
      { id: "tie1", prompt: "الْحَمْدُ لِلّٰهِ رَبِّ ______", answer: "العالمين" },
      { id: "tie2", prompt: "بِسْمِ اللّٰهِ الرَّحْمٰنِ ______", answer: "الرحيم" },
      { id: "tie3", prompt: "مُحَمَّدٌ رَسُولُ ______", answer: "الله" },
      { id: "tie4", prompt: "اَعُوذُ بِاللّٰهِ مِنَ الشَّيْطَانِ ______", answer: "الرجيم" },
      { id: "tie5", prompt: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ ______", answer: "نستعين" },
    ],
  },
  {
    jilidId: "jilid2",
    babId: "macam_isim",
    babTitle: "Macam-macam Isim",
    mc: [
      { id: "mi1", question: "Isim nakirah adalah?", options: ["Kata umum", "Kata khusus", "Kata kerja", "Kata huruf"], correctIndex: 0, explanation: "Isim nakirah adalah kata benda umum (tidak spesifik)." },
      { id: "mi2", question: "Isim ma'rifat adalah?", options: ["Kata umum", "Kata yang jelas/spesifik", "Kata kerja", "Kata sambung"], correctIndex: 1, explanation: "Isim ma'rifat adalah kata benda yang sudah jelas dan spesifik." },
      { id: "mi3", question: "Ciri isim nakirah?", options: ["Ada ال", "Ada tanwin", "Ada يا", "Ada ون"], correctIndex: 1, explanation: "Isim nakirah biasanya menerima tanwin." },
      { id: "mi4", question: "Ada berapa jenis isim ma'rifat?", options: ["3", "4", "5", "6"], correctIndex: 3, explanation: "6 jenis: Al, Nama, Dhomir, Isyarah, Maushul, Idhofah." },
      { id: "mi5", question: "Muannats ditandai dengan?", options: ["ون", "ين", "ة / ى", "ال"], correctIndex: 2, explanation: "Tanda muannats antara lain ta marbuthoh (ة) dan alif maqsuroh (ى)." },
      { id: "mi6", question: "Tatsniyah dalam keadaan rofa' bertanda?", options: ["ون", "ين", "ان", "ة"], correctIndex: 2, explanation: "Tatsniyah rofa' bertanda ان." },
      { id: "mi7", question: "Jama' mudzakar salim rofa' bertanda?", options: ["ان", "ين", "ون", "ات"], correctIndex: 2, explanation: "Jama' mudzakar salim rofa' bertanda ون." },
      { id: "mi8", question: "كتاب termasuk isim?", options: ["Ma'rifat", "Nakirah", "Fi'il", "Huruf"], correctIndex: 1, explanation: "كتاب tanpa ال termasuk nakirah." },
      { id: "mi9", question: "الكتاب termasuk isim?", options: ["Nakirah", "Ma'rifat", "Fi'il", "Huruf"], correctIndex: 1, explanation: "الكتاب dengan ال termasuk ma'rifat." },
      { id: "mi10", question: "Mudzakkar artinya?", options: ["Perempuan", "Laki-laki", "Netral", "Jamak"], correctIndex: 1, explanation: "Mudzakkar berarti laki-laki." },
    ],
    essay: [
      { id: "mie1", prompt: "تِلْكَ أُمَّةٌ قَدْ ______", answer: "خلت" },
      { id: "mie2", prompt: "ذَٰلِكَ الْكِتَابُ لَا ______", answer: "ريب" },
      { id: "mie3", prompt: "هُوَ الَّذِي جَعَلَ ______", answer: "لكم" },
      { id: "mie4", prompt: "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ ______", answer: "الصلاة" },
      { id: "mie5", prompt: "صِرَاطَ الَّذِينَ أَنْعَمْتَ ______", answer: "عليهم" },
    ],
  },
];

export const ALL_BAB_QUIZZES: BabQuiz[] = [...JILID1_QUIZZES, ...JILID2_QUIZZES];

export function getQuizByBab(jilidId: string, babId: string): BabQuiz | undefined {
  return ALL_BAB_QUIZZES.find(q => q.jilidId === jilidId && q.babId === babId);
}
