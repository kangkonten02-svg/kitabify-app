export interface Bab {
  id: string;
  title: string;
  content?: string;
}

export interface Jilid {
  id: string;
  title: string;
  babs: Bab[];
}

export interface Kitab {
  id: string;
  title: string;
  icon: string;
  jilids: Jilid[];
  isKholasoh?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface EssayQuestion {
  id: string;
  question: string;
  answer_example: string;
}

export interface CombinedQuiz {
  id: string;
  title: string;
  multiple_choice: QuizQuestion[];
  essay_jilid1: EssayQuestion[];
  essay_jilid2: EssayQuestion[];
}

export const MATERI_DATA: Kitab[] = [
  {
    id: "amtsilati", title: "Amtsilati", icon: "📘",
    jilids: [
      {
        id: "muqoddimah_sec", title: "Muqoddimah",
        babs: [
          { id: "muqoddimah", title: "Muqoddimah" },
        ],
      },
      {
        id: "jilid1", title: "Jilid 1",
        babs: [
          { id: "huruf_jar", title: "Bab 1 - Huruf Jar" },
          { id: "isim_dhomir", title: "Bab 2 - Isim Dhomir" },
          { id: "isim_isyaroh", title: "Bab 3 - Isim Isyaroh" },
          { id: "isim_maushul", title: "Bab 4 - Isim Maushul" },
        ],
      },
      {
        id: "jilid2", title: "Jilid 2",
        babs: [
          { id: "tanda_isim", title: "Bab Tanda-tanda Isim", content: "Isim dikenali dengan 5 tanda: jar, tanwin, nida, al, dan musnad ilaih." },
          { id: "macam_isim", title: "Bab Macam-macam Isim", content: "Isim terbagi menjadi nakirah & ma'rifat, mudzakar & muannats, tatsniyah & jamak." },
          { id: "isim_fail", title: "Isim Fa'il", content: "Isim Fa'il adalah isim yang menunjukkan pelaku perbuatan. Wazan: فَاعِلٌ" },
          { id: "isim_maful", title: "Isim Maf'ul", content: "Isim Maf'ul adalah isim yang menunjukkan objek perbuatan. Wazan: مَفْعُولٌ" },
          { id: "masdar", title: "Masdar", content: "Masdar adalah bentuk kata benda dari fi'il (kata kerja)." },
        ],
      },
      {
        id: "jilid3", title: "Jilid 3",
        babs: [
          { id: "j3_mubtada", title: "Bab 1 — Mubtada" },
          { id: "j3_annawasikh", title: "Bab 2 — Annawasikh" },
          { id: "j3_ghoir_munshorif", title: "Bab 3 — Ghoir Munshorif" },
          { id: "j3_isim_musytaq", title: "Bab 4 — Isim Musytaq" },
          { id: "j3_isim_mutal", title: "Bab 5 — Isim Mu'tal" },
          { id: "j3_tawabi", title: "Bab 6 — At-Tawabi'" },
        ],
      },
      { id: "jilid4", title: "Jilid 4", babs: [{ id: "j4_info", title: "Materi sedang disusun" }] },
      { id: "jilid5", title: "Jilid 5", babs: [{ id: "j5_info", title: "Materi sedang disusun" }] },
      { id: "shorofiyah", title: "Shorofiyah", babs: [{ id: "sho_info", title: "Materi sedang disusun" }] },
      { id: "tatimah", title: "Tatimah", babs: [{ id: "tat_info", title: "Materi sedang disusun" }] },
      { id: "qoidati", title: "Qoidati", babs: [{ id: "qoi_info", title: "Materi sedang disusun" }] },
    ],
  },
  {
    id: "kholasoh", title: "Kholasoh Alfiyah", icon: "📗",
    jilids: [],
    isKholasoh: true,
  },
  {
    id: "jurumiyah", title: "Jurumiyah", icon: "📕",
    jilids: [
      {
        id: "ju_nahwu", title: "Ilmu Nahwu",
        babs: [
          { id: "ju_kalam", title: "Bab Kalam" },
          { id: "ju_isim", title: "Bab Isim" },
          { id: "ju_fiil", title: "Bab Fi'il" },
          { id: "ju_huruf", title: "Bab Huruf" },
        ],
      },
      {
        id: "ju_irab_sec", title: "I'rab & Bina'",
        babs: [
          { id: "ju_irab", title: "Bab I'rab" },
          { id: "ju_marfuat", title: "Bab Tanda I'rab (Alamat)" },
          { id: "ju_murab_mabni", title: "Bab Mu'rab dan Mabni" },
        ],
      },
      {
        id: "ju_isim_sec", title: "Pembahasan Isim",
        babs: [
          { id: "ju_nakirah_marifah", title: "Bab Nakirah dan Ma'rifah" },
          { id: "ju_mubtada_khabar", title: "Bab Mubtada' dan Khabar" },
          { id: "ju_awamil", title: "Bab Amil (Kaana, Inna, dll)" },
        ],
      },
      {
        id: "ju_fiil_sec", title: "Pembahasan Fi'il",
        babs: [
          { id: "ju_fail", title: "Bab Fa'il" },
          { id: "ju_mafulbih", title: "Bab Maf'ul bih" },
          { id: "ju_masdar", title: "Bab Masdar (Maf'ul Muthlaq)" },
          { id: "ju_zharf", title: "Bab Zharf (Maf'ul fih)" },
          { id: "ju_hal", title: "Bab Hal" },
          { id: "ju_tamyiz", title: "Bab Tamyiz" },
        ],
      },
      {
        id: "ju_lain", title: "Lain-lain",
        babs: [
          { id: "ju_idhafah", title: "Bab Idhafah" },
        ],
      },
    ],
  },
  {
    id: "safinah", title: "Safinah", icon: "📙",
    jilids: [
      {
        id: "sa_aqidah", title: "Aqidah & Dasar",
        babs: [
          { id: "sa_pembukaan", title: "Pembukaan" },
          { id: "sa_rukun_islam", title: "Rukun Islam" },
          { id: "sa_rukun_iman", title: "Rukun Iman" },
          { id: "sa_baligh", title: "Tanda-tanda Baligh" },
        ],
      },
      {
        id: "sa_thaharah", title: "Thaharah (Bersuci)",
        babs: [
          { id: "sa_wudhu", title: "Fardhu-fardhu Wudhu" },
          { id: "sa_naqidh_wudhu", title: "Pembatal Wudhu" },
          { id: "sa_mandi", title: "Yang Mewajibkan Mandi" },
          { id: "sa_syarat_wudhu", title: "Syarat-syarat Wudhu" },
          { id: "sa_najis", title: "Bab Najis" },
          { id: "sa_haidh", title: "Bab Haidh & Nifas" },
        ],
      },
      {
        id: "sa_shalat_sec", title: "Shalat",
        babs: [
          { id: "sa_shalat", title: "Syarat-syarat Shalat" },
          { id: "sa_rukun_shalat", title: "Rukun Shalat" },
          { id: "sa_pembatal_shalat", title: "Yang Membatalkan Shalat" },
          { id: "sa_waktu_shalat", title: "Waktu-waktu Shalat" },
          { id: "sa_sujud_sahwi", title: "Sujud Sahwi" },
        ],
      },
      {
        id: "sa_lain", title: "Jenazah, Zakat & Puasa",
        babs: [
          { id: "sa_jenazah", title: "Bab Jenazah" },
          { id: "sa_zakat", title: "Bab Zakat" },
          { id: "sa_puasa", title: "Bab Puasa" },
        ],
      },
    ],
  },
  {
    id: "tijan", title: "Tijan Doruri", icon: "📓",
    jilids: [{ id: "ti1", title: "Bab 1", babs: [{ id: "ti1_info", title: "Materi sedang disusun" }] }],
  },
];

export const QUIZ_DATA: Record<string, QuizQuestion[]> = {
  huruf_jar: [
    { id: "hj1", question: "Manakah yang termasuk Huruf Jar?", options: ["مِنْ", "لَمْ", "قَدْ", "سَوْفَ"], correctIndex: 0, explanation: "مِنْ adalah salah satu Huruf Jar yang berarti 'dari'." },
    { id: "hj2", question: "Huruf Jar berfungsi untuk...", options: ["Me-rafa'-kan isim", "Me-jar-kan isim", "Me-jazm-kan fi'il", "Me-nashab-kan fi'il"], correctIndex: 1, explanation: "Huruf Jar berfungsi me-jar-kan (mengkasrahkan) isim setelahnya." },
    { id: "hj3", question: "Berapa jumlah Huruf Jar?", options: ["5", "7", "10", "17"], correctIndex: 3, explanation: "Huruf Jar berjumlah 17 menurut pendapat yang masyhur." },
    { id: "hj4", question: "Contoh kalimat dengan Huruf Jar yang benar:", options: ["ذَهَبَ إِلَى المَسْجِدِ", "ذَهَبَ المَسْجِدُ", "إِلَى ذَهَبَ", "المَسْجِدِ إِلَى"], correctIndex: 0, explanation: "إِلَى adalah Huruf Jar yang menjar-kan المَسْجِدِ." },
  ],
  isim_dhomir: [
    { id: "id1", question: "Isim Dhomir adalah...", options: ["Kata tunjuk", "Kata ganti", "Kata sifat", "Kata kerja"], correctIndex: 1, explanation: "Isim Dhomir berarti kata ganti (pronoun)." },
    { id: "id2", question: "هُوَ adalah dhomir untuk...", options: ["Dia (lk)", "Dia (pr)", "Kamu", "Saya"], correctIndex: 0, explanation: "هُوَ adalah kata ganti orang ketiga laki-laki tunggal." },
    { id: "id3", question: "Dhomir terbagi menjadi...", options: ["2 macam", "3 macam", "4 macam", "5 macam"], correctIndex: 0, explanation: "Dhomir terbagi menjadi muttashil (bersambung) dan munfashil (terpisah)." },
  ],
  isim_isyaroh: [
    { id: "ii1", question: "هٰذَا digunakan untuk...", options: ["Menunjuk dekat (lk)", "Menunjuk jauh (lk)", "Menunjuk dekat (pr)", "Menunjuk jauh (pr)"], correctIndex: 0, explanation: "هٰذَا untuk menunjuk benda dekat yang mudzakkar (laki-laki)." },
    { id: "ii2", question: "Isim Isyaroh artinya...", options: ["Kata ganti", "Kata tunjuk", "Kata sifat", "Kata kerja"], correctIndex: 1, explanation: "Isim Isyaroh berarti kata tunjuk (demonstrative pronoun)." },
  ],
  isim_maushul: [
    { id: "im1", question: "الَّذِي digunakan untuk...", options: ["Tunggal mudzakkar", "Tunggal muannats", "Jamak mudzakkar", "Jamak muannats"], correctIndex: 0, explanation: "الَّذِي adalah isim maushul untuk tunggal mudzakkar." },
    { id: "im2", question: "Isim Maushul berfungsi...", options: ["Menghubungkan kalimat", "Menunjuk benda", "Mengganti nama", "Menerangkan sifat"], correctIndex: 0, explanation: "Isim Maushul berfungsi menghubungkan dua kalimat." },
  ],
};

export const COMBINED_QUIZZES: CombinedQuiz[] = [
  {
    id: "quiz_jilid1_2",
    title: "Jilid 1 Bab 1-4 & Jilid 2 Bab 1-2",
    multiple_choice: [
      { id: "cq1", question: "Kata yang menunjukkan benda disebut?", options: ["Fi'il", "Huruf", "Isim", "Jumlah"], correctIndex: 2, explanation: "Isim adalah kata benda." },
      { id: "cq2", question: "Ciri utama isim adalah?", options: ["Bisa menerima jazm", "Bisa menerima jar", "Selalu fi'il", "Tidak bisa berubah"], correctIndex: 1, explanation: "Isim bisa menerima i'rob jar." },
      { id: "cq3", question: "Kata kerja dalam bahasa Arab disebut?", options: ["Isim", "Fi'il", "Huruf", "Kalam"], correctIndex: 1, explanation: "Fi'il adalah kata kerja dalam bahasa Arab." },
      { id: "cq4", question: "Huruf jar menyebabkan kata setelahnya menjadi?", options: ["Rofa", "Nasab", "Jazm", "Jar"], correctIndex: 3, explanation: "Huruf jar menyebabkan isim setelahnya menjadi majrur (jar)." },
      { id: "cq5", question: "Contoh huruf jar adalah?", options: ["كتب", "من", "رجل", "ذهب"], correctIndex: 1, explanation: "من (dari) adalah salah satu huruf jar." },
      { id: "cq6", question: "Tanwin adalah tanda dari?", options: ["Fi'il", "Huruf", "Isim", "Jumlah"], correctIndex: 2, explanation: "Tanwin adalah salah satu tanda isim." },
      { id: "cq7", question: "Kata 'محمد' termasuk?", options: ["Fi'il", "Huruf", "Isim", "Jazm"], correctIndex: 2, explanation: "محمد adalah isim (kata benda/nama)." },
      { id: "cq8", question: "Huruf nida digunakan untuk?", options: ["Bertanya", "Memanggil", "Menjelaskan", "Menghubungkan"], correctIndex: 1, explanation: "Huruf nida (يا) digunakan untuk memanggil." },
      { id: "cq9", question: "Kata setelah 'يا' disebut?", options: ["Fa'il", "Munada", "Mudhof", "Khabar"], correctIndex: 1, explanation: "Kata setelah يا disebut munada (yang dipanggil)." },
      { id: "cq10", question: "Isim ma'rifat adalah?", options: ["Kata umum", "Kata kerja", "Kata yang jelas/spesifik", "Kata sambung"], correctIndex: 2, explanation: "Isim ma'rifat adalah kata benda yang sudah jelas dan spesifik." },
    ],
    essay_jilid1: [
      { id: "ej1_1", question: "Beri harokat yang benar pada kata berikut: كتب", answer_example: "كَتَبَ" },
      { id: "ej1_2", question: "Beri harokat: رجل", answer_example: "رَجُلٌ" },
      { id: "ej1_3", question: "Beri harokat: الحمد لله", answer_example: "الْحَمْدُ لِلّٰهِ" },
      { id: "ej1_4", question: "Beri harokat: محمد رسول الله", answer_example: "مُحَمَّدٌ رَسُولُ اللّٰهِ" },
      { id: "ej1_5", question: "Beri harokat: في بيت", answer_example: "فِي بَيْتٍ" },
    ],
    essay_jilid2: [
      { id: "ej2_1", question: "Tentukan jenis kata berikut (tulis dalam bahasa Arab): رجل", answer_example: "اسم" },
      { id: "ej2_2", question: "Tentukan jenis kata: كتب", answer_example: "فعل" },
      { id: "ej2_3", question: "Tentukan jenis kata: من", answer_example: "حرف" },
      { id: "ej2_4", question: "Tentukan jenis kata: هذا", answer_example: "اسم" },
      { id: "ej2_5", question: "Tentukan jenis kata: يكتب", answer_example: "فعل" },
    ],
  },
];
