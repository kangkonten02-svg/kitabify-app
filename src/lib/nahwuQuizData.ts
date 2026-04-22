// Bank Soal Nahwu Interaktif (Multiple Choice, teks Arab gundul)
// Fokus: Tanda Isim, Macam Isim, Isim Fa'il, Isim Maf'ul, Masdar

export interface NahwuSoal {
  id: string;
  /** Pertanyaan; gunakan ____ untuk bagian kosong yang akan di-highlight */
  soal: string;
  pilihan: { A: string; B: string; C: string; D: string };
  jawaban: "A" | "B" | "C" | "D";
  pembahasan: string;
}

export interface NahwuBab {
  id: string;
  title: string;
  description: string;
  icon: string;
  soal: NahwuSoal[];
}

export const NAHWU_BANK: NahwuBab[] = [
  // ============ BAB 1: ISIM ============
  {
    id: "bab1_isim",
    title: "Bab 1 — Isim (Identifikasi)",
    description: "Mengenali kata yang termasuk Isim",
    icon: "📘",
    soal: [
      {
        id: "b1_1",
        soal: "Manakah kata berikut yang termasuk isim?",
        pilihan: { A: "ذهب", B: "كتاب", C: "في", D: "يكتب" },
        jawaban: "B",
        pembahasan: "كتاب adalah isim karena bisa menerima tanwin (كتابٌ) dan ال (الكتاب).",
      },
      {
        id: "b1_2",
        soal: "Tanda apa yang menunjukkan bahwa الرجل adalah isim?",
        pilihan: { A: "Berakhiran fathah", B: "Diawali ال", C: "Berbentuk fi'il madhi", D: "Mengandung huruf jar" },
        jawaban: "B",
        pembahasan: "Salah satu tanda isim adalah masuknya ال (alif lam) di awal kata.",
      },
      {
        id: "b1_3",
        soal: "Manakah yang BUKAN tanda isim?",
        pilihan: { A: "Tanwin", B: "Alif Lam (ال)", C: "Huruf Jar", D: "Tanda jazm (sukun)" },
        jawaban: "D",
        pembahasan: "Tanda jazm hanya masuk pada fi'il mudhari', bukan isim.",
      },
      {
        id: "b1_4",
        soal: "بسم الله — kata الله pada kalimat tersebut adalah …",
        pilihan: { A: "Fi'il", B: "Huruf", C: "Isim", D: "Maf'ul fi'il" },
        jawaban: "C",
        pembahasan: "الله adalah isim ma'rifat (isim 'alam), termasuk isim majrur karena didahului huruf jar ب.",
      },
      {
        id: "b1_5",
        soal: "Kata يا محمد — kenapa محمد disebut isim?",
        pilihan: { A: "Karena didahului يا (huruf nida)", B: "Karena fi'il madhi", C: "Karena huruf jar", D: "Karena fi'il mudhari'" },
        jawaban: "A",
        pembahasan: "Kemasukan huruf nida (يا) adalah salah satu tanda isim.",
      },
      {
        id: "b1_6",
        soal: "Manakah kalimat yang seluruh katanya isim?",
        pilihan: { A: "زيد قائم", B: "ذهب زيد", C: "يقرأ الطالب", D: "اكتب الدرس" },
        jawaban: "A",
        pembahasan: "زيد (mubtada) dan قائم (khabar) keduanya isim.",
      },
      {
        id: "b1_7",
        soal: "مررت بزيدٍ — kata زيد di sini berstatus …",
        pilihan: { A: "Marfu'", B: "Manshub", C: "Majrur", D: "Majzum" },
        jawaban: "C",
        pembahasan: "زيد majrur karena kemasukan huruf jar ب, ditandai kasrah/tanwin kasrah.",
      },
      {
        id: "b1_8",
        soal: "Manakah yang termasuk isim mufrad?",
        pilihan: { A: "المسلمون", B: "المسلمان", C: "مسلمٌ", D: "مسلمات" },
        jawaban: "C",
        pembahasan: "مسلمٌ adalah isim mufrad (tunggal). Lainnya adalah jamak/tatsniyah.",
      },
    ],
  },

  // ============ BAB 2: MACAM ISIM ============
  {
    id: "bab2_macam_isim",
    title: "Bab 2 — Macam-macam Isim",
    description: "Nakirah, Ma'rifat, Mudzakkar, Muannats",
    icon: "📗",
    soal: [
      {
        id: "b2_1",
        soal: "Manakah yang termasuk isim ma'rifat?",
        pilihan: { A: "كتابٌ", B: "رجلٌ", C: "البيت", D: "قلمٌ" },
        jawaban: "C",
        pembahasan: "البيت adalah ma'rifat karena diawali ال. Selainnya nakirah (bertanwin).",
      },
      {
        id: "b2_2",
        soal: "Ciri utama isim nakirah adalah …",
        pilihan: { A: "Diawali ال", B: "Menerima tanwin", C: "Berupa dhomir", D: "Berupa isim 'alam" },
        jawaban: "B",
        pembahasan: "Isim nakirah biasanya menerima tanwin (مسلمٌ، كتابٌ).",
      },
      {
        id: "b2_3",
        soal: "Manakah yang termasuk isim muannats?",
        pilihan: { A: "مسلم", B: "فاطمة", C: "محمد", D: "زيد" },
        jawaban: "B",
        pembahasan: "فاطمة diakhiri ta marbuthah (ة) — tanda muannats.",
      },
      {
        id: "b2_4",
        soal: "Manakah yang BUKAN isim ma'rifat?",
        pilihan: { A: "هو", B: "هذا", C: "الذي", D: "رجلٌ" },
        jawaban: "D",
        pembahasan: "رجلٌ adalah nakirah. Dhomir, isyaroh, dan maushul termasuk ma'rifat.",
      },
      {
        id: "b2_5",
        soal: "هذا كتابٌ — kata هذا adalah isim …",
        pilihan: { A: "Dhomir", B: "Isyaroh", C: "Maushul", D: "'Alam" },
        jawaban: "B",
        pembahasan: "هذا adalah isim isyaroh (kata tunjuk) untuk mudzakkar mufrad.",
      },
      {
        id: "b2_6",
        soal: "Manakah dhomir untuk 'kami/kita'?",
        pilihan: { A: "هم", B: "نحن", C: "أنتم", D: "هي" },
        jawaban: "B",
        pembahasan: "نحن adalah dhomir munfashil untuk mutakallim ma'al ghair (kami/kita).",
      },
      {
        id: "b2_7",
        soal: "Bentuk tatsniyah (dual) dari مسلم adalah …",
        pilihan: { A: "مسلمون", B: "مسلمان", C: "مسلمات", D: "مسالم" },
        jawaban: "B",
        pembahasan: "Tatsniyah dibentuk dengan menambah ان di akhir.",
      },
      {
        id: "b2_8",
        soal: "Manakah yang termasuk jamak mudzakkar salim?",
        pilihan: { A: "مسلمات", B: "رجال", C: "مؤمنون", D: "كتب" },
        jawaban: "C",
        pembahasan: "Jamak mudzakkar salim diakhiri ون (rofa') atau ين (nashab/jar).",
      },
    ],
  },

  // ============ BAB 3: ISIM FA'IL ============
  {
    id: "bab3_isim_fail",
    title: "Bab 3 — Isim Fa'il",
    description: "Pelaku perbuatan (subjek aktif)",
    icon: "📙",
    soal: [
      {
        id: "b3_1",
        soal: "ولا أنا ____ ما عبدتم",
        pilihan: { A: "عابدٌ", B: "عابدٍ", C: "عابد", D: "عابدُ" },
        jawaban: "A",
        pembahasan: "عابد adalah isim fa'il sebagai khabar dari mubtada أنا, maka rofa' dengan dhammah/tanwin dhammah.",
      },
      {
        id: "b3_2",
        soal: "Wazan baku isim fa'il dari fi'il tsulatsi mujarrad adalah …",
        pilihan: { A: "مَفْعُول", B: "فَاعِل", C: "تَفْعِيل", D: "فِعَالَة" },
        jawaban: "B",
        pembahasan: "Isim fa'il dari tsulatsi mujarrad mengikuti wazan فَاعِل (contoh: كاتب، قارئ، عالم).",
      },
      {
        id: "b3_3",
        soal: "Isim fa'il dari fi'il كَتَبَ adalah …",
        pilihan: { A: "مكتوب", B: "كتاب", C: "كاتب", D: "مكتب" },
        jawaban: "C",
        pembahasan: "كاتب mengikuti wazan فاعل = orang yang menulis.",
      },
      {
        id: "b3_4",
        soal: "الطالب ____ في الفصل",
        pilihan: { A: "مكتوب", B: "كاتبٌ", C: "كاتبٍ", D: "اكتب" },
        jawaban: "B",
        pembahasan: "Khabar dari الطالب harus rofa', jadi كاتبٌ (isim fa'il).",
      },
      {
        id: "b3_5",
        soal: "Isim fa'il dari قرأ adalah …",
        pilihan: { A: "مقروء", B: "قراءة", C: "قارئ", D: "اقرأ" },
        jawaban: "C",
        pembahasan: "قارئ = pembaca (wazan فاعل).",
      },
      {
        id: "b3_6",
        soal: "Manakah yang BUKAN isim fa'il?",
        pilihan: { A: "ناصر", B: "حافظ", C: "مكتوب", D: "ساجد" },
        jawaban: "C",
        pembahasan: "مكتوب adalah isim maf'ul (wazan مفعول), bukan isim fa'il.",
      },
      {
        id: "b3_7",
        soal: "محمدٌ ____ القرآنَ كل يوم. (pembaca)",
        pilihan: { A: "مقروء", B: "قارئٌ", C: "قراءة", D: "قُرّاء" },
        jawaban: "B",
        pembahasan: "قارئٌ — isim fa'il sebagai khabar (rofa'/tanwin dhammah).",
      },
      {
        id: "b3_8",
        soal: "Isim fa'il berfungsi seperti fi'il-nya, sehingga bisa …",
        pilihan: { A: "Menjadi mubtada saja", B: "Beramal merofa'kan fa'il & menashabkan maf'ul", C: "Tidak punya amal", D: "Hanya majrur" },
        jawaban: "B",
        pembahasan: "Isim fa'il dapat beramal seperti fi'ilnya: merofa'kan fa'il dan menashabkan maf'ul bih.",
      },
    ],
  },

  // ============ BAB 4: ISIM MAF'UL ============
  {
    id: "bab4_isim_maful",
    title: "Bab 4 — Isim Maf'ul",
    description: "Objek perbuatan (yang dikenai pekerjaan)",
    icon: "📕",
    soal: [
      {
        id: "b4_1",
        soal: "Wazan baku isim maf'ul dari fi'il tsulatsi mujarrad adalah …",
        pilihan: { A: "فَاعِل", B: "مَفْعُول", C: "فَعِيل", D: "مُفْعَل" },
        jawaban: "B",
        pembahasan: "Isim maf'ul tsulatsi mujarrad mengikuti wazan مَفْعُول (مكتوب، مقروء، منصور).",
      },
      {
        id: "b4_2",
        soal: "Isim maf'ul dari كتب adalah …",
        pilihan: { A: "كاتب", B: "كتاب", C: "مكتوب", D: "اكتب" },
        jawaban: "C",
        pembahasan: "مكتوب = yang ditulis (wazan مفعول).",
      },
      {
        id: "b4_3",
        soal: "Isim maf'ul dari نصر adalah …",
        pilihan: { A: "ناصر", B: "نصير", C: "منصور", D: "نَصْر" },
        jawaban: "C",
        pembahasan: "منصور = yang ditolong (wazan مفعول).",
      },
      {
        id: "b4_4",
        soal: "الكتاب ____ على المكتب. (yang diletakkan/diatas)",
        pilihan: { A: "واضع", B: "موضوعٌ", C: "موضوعٍ", D: "ضع" },
        jawaban: "B",
        pembahasan: "موضوعٌ = isim maf'ul, sebagai khabar dari الكتاب maka rofa'.",
      },
      {
        id: "b4_5",
        soal: "Manakah yang termasuk isim maf'ul?",
        pilihan: { A: "مفتاح", B: "مفتوح", C: "فاتح", D: "فتح" },
        jawaban: "B",
        pembahasan: "مفتوح = yang dibuka (wazan مفعول). فاتح adalah isim fa'il.",
      },
      {
        id: "b4_6",
        soal: "Perbedaan utama isim fa'il dan isim maf'ul adalah …",
        pilihan: { A: "Isim fa'il = pelaku, Isim maf'ul = sasaran", B: "Sama saja", C: "Isim fa'il selalu majrur", D: "Isim maf'ul selalu mubtada" },
        jawaban: "A",
        pembahasan: "Isim fa'il menunjukkan pelaku (subjek), isim maf'ul menunjukkan objek/sasaran perbuatan.",
      },
      {
        id: "b4_7",
        soal: "Ubah isim fa'il كاتب menjadi isim maf'ul:",
        pilihan: { A: "مكاتب", B: "كتيب", C: "مكتوب", D: "كتابة" },
        jawaban: "C",
        pembahasan: "Dari فاعل (كاتب) → مفعول (مكتوب).",
      },
      {
        id: "b4_8",
        soal: "زيدٌ ____ من الله. (yang diberi rahmat — dari رحم)",
        pilihan: { A: "راحم", B: "مرحومٌ", C: "رحمة", D: "ارحم" },
        jawaban: "B",
        pembahasan: "مرحومٌ = isim maf'ul, sebagai khabar maka rofa'.",
      },
    ],
  },

  // ============ BAB 5: MASDAR ============
  {
    id: "bab5_masdar",
    title: "Bab 5 — Masdar",
    description: "Kata benda dasar dari fi'il (kata kerja)",
    icon: "📒",
    soal: [
      {
        id: "b5_1",
        soal: "Masdar dari fi'il كَتَبَ adalah …",
        pilihan: { A: "كاتب", B: "مكتوب", C: "كتابة", D: "اكتب" },
        jawaban: "C",
        pembahasan: "كتابة = penulisan (masdar dari كتب).",
      },
      {
        id: "b5_2",
        soal: "Masdar dari فَهِمَ adalah …",
        pilihan: { A: "فاهم", B: "مفهوم", C: "فَهْم", D: "افهم" },
        jawaban: "C",
        pembahasan: "فَهْم = pemahaman (masdar tsulatsi mujarrad).",
      },
      {
        id: "b5_3",
        soal: "Wazan masdar yang umum dari ضَرَبَ adalah …",
        pilihan: { A: "ضَرْب", B: "ضارب", C: "مضروب", D: "تضريب" },
        jawaban: "A",
        pembahasan: "ضَرْب (wazan فَعْل) = pemukulan.",
      },
      {
        id: "b5_4",
        soal: "Masdar dari fi'il mazid عَلَّمَ adalah …",
        pilihan: { A: "تعليم", B: "علم", C: "معلوم", D: "معلم" },
        jawaban: "A",
        pembahasan: "Masdar dari فَعَّلَ (mazid bi harf) adalah تَفْعِيل → تعليم.",
      },
      {
        id: "b5_5",
        soal: "____ القرآن واجبٌ على كل مسلم. (membaca)",
        pilihan: { A: "قارئ", B: "مقروء", C: "قراءةُ", D: "اقرأ" },
        jawaban: "C",
        pembahasan: "قراءةُ = masdar (membaca), sebagai mubtada maka rofa'.",
      },
      {
        id: "b5_6",
        soal: "Masdar dari أَكْرَمَ adalah …",
        pilihan: { A: "كرم", B: "كريم", C: "إكرام", D: "مكرم" },
        jawaban: "C",
        pembahasan: "Wazan masdar dari أَفْعَلَ adalah إِفْعَال → إكرام.",
      },
      {
        id: "b5_7",
        soal: "Manakah yang termasuk masdar?",
        pilihan: { A: "ذاهب", B: "مذهوب", C: "ذَهَاب", D: "اذهب" },
        jawaban: "C",
        pembahasan: "ذَهَاب = kepergian (masdar). Lainnya isim fa'il/maf'ul/fi'il amr.",
      },
      {
        id: "b5_8",
        soal: "Ciri masdar adalah …",
        pilihan: { A: "Selalu menunjukkan waktu", B: "Kata benda yang menunjukkan kejadian/perbuatan tanpa terikat waktu", C: "Selalu pelaku", D: "Selalu majrur" },
        jawaban: "B",
        pembahasan: "Masdar = isim yang menunjukkan kejadian/perbuatan tanpa terikat waktu (berbeda dengan fi'il).",
      },
    ],
  },
];

export function getBabById(id: string): NahwuBab | undefined {
  return NAHWU_BANK.find((b) => b.id === id);
}