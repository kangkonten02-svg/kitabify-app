// Bank Soal Nahwu Interaktif — Struktur: Jilid → Bab → Soal
// Format: pilihan ganda berbasis teks Arab (gundul/dengan harokat sebagian)

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
  number: number;
  title: string;
  description: string;
  soal: NahwuSoal[];
}

export type JilidColor = "green" | "blue" | "orange";

export interface NahwuJilid {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  color: JilidColor;
  babs: NahwuBab[];
}

// Helper untuk membangun 10 soal dari template
const mk = (id: string, soal: string, pilihan: NahwuSoal["pilihan"], jawaban: NahwuSoal["jawaban"], pembahasan: string): NahwuSoal =>
  ({ id, soal, pilihan, jawaban, pembahasan });

// =====================================================================
// JILID 1 — HIJAU
// =====================================================================
const JILID_1: NahwuJilid = {
  id: "jilid1",
  number: 1,
  title: "Jilid 1",
  subtitle: "Materi dasar Nahwu untuk pemula",
  color: "green",
  babs: [
    {
      id: "j1_b1_huruf_jar",
      number: 1,
      title: "Huruf Jar",
      description: "Macam huruf jar & pengaruhnya pada isim",
      soal: [
        mk("j1b1_1", "Manakah berikut ini yang termasuk huruf jar?", { A: "في", B: "كان", C: "إنّ", D: "لم" }, "A", "في adalah salah satu huruf jar (di/di dalam)."),
        mk("j1b1_2", "ذهبتُ إلى ____ ", { A: "المسجدُ", B: "المسجدِ", C: "المسجدَ", D: "مسجدٌ" }, "B", "Setelah huruf jar إلى, isim menjadi majrur dengan kasrah → المسجدِ."),
        mk("j1b1_3", "Huruf jar yang berarti 'dari' adalah …", { A: "إلى", B: "على", C: "من", D: "في" }, "C", "من = dari (asal/sumber)."),
        mk("j1b1_4", "الكتابُ ____ المكتبِ. (di atas)", { A: "في", B: "إلى", C: "على", D: "عن" }, "C", "على = di atas."),
        mk("j1b1_5", "مررتُ ____ زيدٍ. ", { A: "بِ", B: "لِ", C: "كَ", D: "في" }, "A", "Fi'il مرّ biasa diiringi huruf jar ب (mururtu bi-zaidin = aku melewati Zaid)."),
        mk("j1b1_6", "Pengaruh huruf jar terhadap isim sesudahnya adalah …", { A: "Marfu'", B: "Manshub", C: "Majrur", D: "Majzum" }, "C", "Isim setelah huruf jar selalu majrur."),
        mk("j1b1_7", "Manakah yang BUKAN huruf jar?", { A: "عن", B: "حتى", C: "ثُمَّ", D: "الباء" }, "C", "ثُمَّ adalah huruf 'athaf, bukan huruf jar."),
        mk("j1b1_8", "الحمدُ ____ ربِّ العالمين. ", { A: "لِ", B: "بِ", C: "كَ", D: "في" }, "A", "ل = bagi/untuk. الحمد لله = segala puji bagi Allah."),
        mk("j1b1_9", "Tanda majrur untuk isim mufrad adalah …", { A: "Fathah", B: "Dhammah", C: "Kasrah", D: "Sukun" }, "C", "Isim mufrad majrur ditandai dengan kasrah."),
        mk("j1b1_10", "كتبتُ ____ القلمِ. (dengan)", { A: "إلى", B: "بِ", C: "عن", D: "في" }, "B", "ب = dengan (alat). كتبت بالقلم = aku menulis dengan pena."),
      ],
    },
    {
      id: "j1_b2_isim_dhomir",
      number: 2,
      title: "Isim Dhomir",
      description: "Kata ganti dalam bahasa Arab",
      soal: [
        mk("j1b2_1", "Dhomir untuk 'saya' adalah …", { A: "أنتَ", B: "أنا", C: "هو", D: "نحن" }, "B", "أنا = saya."),
        mk("j1b2_2", "Dhomir untuk 'kami/kita' adalah …", { A: "هم", B: "نحن", C: "أنتم", D: "هي" }, "B", "نحن = kami/kita."),
        mk("j1b2_3", "Dhomir untuk 'dia (laki-laki)' adalah …", { A: "هي", B: "هو", C: "أنتَ", D: "هم" }, "B", "هو = dia (mudzakkar)."),
        mk("j1b2_4", "Dhomir untuk 'dia (perempuan)' adalah …", { A: "هو", B: "هي", C: "أنتِ", D: "هن" }, "B", "هي = dia (muannats)."),
        mk("j1b2_5", "Dhomir untuk 'kamu (laki-laki)' adalah …", { A: "أنتَ", B: "أنتِ", C: "أنتم", D: "أنتما" }, "A", "أنتَ = kamu (mudzakkar mufrad)."),
        mk("j1b2_6", "Dhomir untuk 'mereka (laki-laki, jamak)' adalah …", { A: "هما", B: "هم", C: "هن", D: "هو" }, "B", "هم = mereka (mudzakkar jamak)."),
        mk("j1b2_7", "Dhomir muttashil pada كتابُهُ menunjukkan …", { A: "Milik saya", B: "Milik kamu", C: "Milik dia (laki-laki)", D: "Milik kami" }, "C", "هُ = miliknya (laki-laki)."),
        mk("j1b2_8", "كتابُ____ (kitab milikku)", { A: "ـكَ", B: "ـي", C: "ـه", D: "ـنا" }, "B", "ي = milikku."),
        mk("j1b2_9", "Manakah dhomir tatsniyah (dua orang)?", { A: "نحن", B: "هما", C: "هم", D: "أنا" }, "B", "هما = mereka berdua."),
        mk("j1b2_10", "Dhomir munfashil adalah dhomir yang …", { A: "Berdiri sendiri", B: "Bersambung dengan kata", C: "Hanya untuk fi'il", D: "Tidak pernah dipakai" }, "A", "Munfashil = terpisah/berdiri sendiri (أنا، أنت، هو…)."),
      ],
    },
    {
      id: "j1_b3_isim_isyaroh",
      number: 3,
      title: "Isim Isyaroh",
      description: "Kata tunjuk (ini, itu)",
      soal: [
        mk("j1b3_1", "Isim isyaroh untuk dekat (mudzakkar mufrad) adalah …", { A: "ذلك", B: "هذا", C: "تلك", D: "هذه" }, "B", "هذا = ini (mudzakkar)."),
        mk("j1b3_2", "Isim isyaroh untuk dekat (muannats mufrad) adalah …", { A: "هذا", B: "هذه", C: "ذلك", D: "تلك" }, "B", "هذه = ini (muannats)."),
        mk("j1b3_3", "Isim isyaroh untuk jauh (mudzakkar) adalah …", { A: "هذا", B: "ذلك", C: "هذه", D: "تلك" }, "B", "ذلك = itu (mudzakkar)."),
        mk("j1b3_4", "Isim isyaroh untuk jauh (muannats) adalah …", { A: "هذه", B: "تلك", C: "ذلك", D: "هذا" }, "B", "تلك = itu (muannats)."),
        mk("j1b3_5", "____ كتابٌ (ini sebuah kitab)", { A: "هذه", B: "هذا", C: "ذلك", D: "تلك" }, "B", "كتاب mudzakkar → هذا."),
        mk("j1b3_6", "____ مدرسةٌ (ini sebuah sekolah)", { A: "هذا", B: "هذه", C: "ذلك", D: "تلك" }, "B", "مدرسة muannats (ada ة) → هذه."),
        mk("j1b3_7", "Isim isyaroh untuk dua orang/benda dekat (mudzakkar) adalah …", { A: "هذان", B: "هاتان", C: "هؤلاء", D: "أولئك" }, "A", "هذان = dua ini (mudzakkar)."),
        mk("j1b3_8", "Isim isyaroh untuk jamak (dekat) adalah …", { A: "هذا", B: "هذه", C: "هؤلاء", D: "أولئك" }, "C", "هؤلاء = ini (mereka, dekat)."),
        mk("j1b3_9", "Isim isyaroh untuk jamak (jauh) adalah …", { A: "هؤلاء", B: "أولئك", C: "ذلك", D: "تلك" }, "B", "أولئك = mereka itu (jauh)."),
        mk("j1b3_10", "Isim isyaroh termasuk isim …", { A: "Nakirah", B: "Ma'rifat", C: "Fi'il", D: "Huruf" }, "B", "Isim isyaroh termasuk isim ma'rifat."),
      ],
    },
    {
      id: "j1_b4_isim_maushul",
      number: 4,
      title: "Isim Maushul",
      description: "Kata penghubung (yang...)",
      soal: [
        mk("j1b4_1", "Isim maushul untuk mudzakkar mufrad adalah …", { A: "التي", B: "الذي", C: "الذين", D: "اللاتي" }, "B", "الذي = yang (mudzakkar mufrad)."),
        mk("j1b4_2", "Isim maushul untuk muannats mufrad adalah …", { A: "الذي", B: "التي", C: "اللذان", D: "اللاتي" }, "B", "التي = yang (muannats mufrad)."),
        mk("j1b4_3", "Isim maushul untuk jamak mudzakkar adalah …", { A: "الذين", B: "اللاتي", C: "الذي", D: "اللتان" }, "A", "الذين = orang-orang yang (mudzakkar jamak)."),
        mk("j1b4_4", "Isim maushul untuk jamak muannats adalah …", { A: "الذين", B: "اللاتي", C: "الذي", D: "اللذان" }, "B", "اللاتي/اللواتي = perempuan-perempuan yang."),
        mk("j1b4_5", "جاء الطالبُ ____ نجحَ. (yang lulus)", { A: "التي", B: "الذي", C: "الذين", D: "اللاتي" }, "B", "الطالب mudzakkar mufrad → الذي."),
        mk("j1b4_6", "جاءت الطالبةُ ____ نجحَتْ.", { A: "الذي", B: "التي", C: "الذين", D: "اللاتي" }, "B", "الطالبة muannats mufrad → التي."),
        mk("j1b4_7", "جاء الطلابُ ____ نجحوا.", { A: "الذي", B: "التي", C: "الذين", D: "اللاتي" }, "C", "الطلاب jamak mudzakkar → الذين."),
        mk("j1b4_8", "Isim maushul untuk tatsniyah mudzakkar adalah …", { A: "اللذان", B: "اللتان", C: "الذين", D: "اللاتي" }, "A", "اللذان = dua orang (mudzakkar) yang."),
        mk("j1b4_9", "Isim maushul termasuk isim …", { A: "Nakirah", B: "Ma'rifat", C: "Fi'il", D: "Huruf" }, "B", "Isim maushul adalah ma'rifat."),
        mk("j1b4_10", "Kalimat setelah isim maushul disebut …", { A: "Khabar", B: "Shilah maushul", C: "Mubtada", D: "Maf'ul" }, "B", "Shilah maushul = kalimat penjelas yang melengkapi isim maushul."),
      ],
    },
  ],
};

// =====================================================================
// JILID 2 — BIRU
// =====================================================================
const JILID_2: NahwuJilid = {
  id: "jilid2",
  number: 2,
  title: "Jilid 2",
  subtitle: "Memahami struktur kata dalam Nahwu",
  color: "blue",
  babs: [
    {
      id: "j2_b1_tanda_isim",
      number: 1,
      title: "Tanda-tanda Isim",
      description: "Ciri-ciri isim dan cara mengenalinya",
      soal: [
        mk("j2b1_1", "Manakah kata berikut yang termasuk isim?", { A: "ذهب", B: "كتاب", C: "في", D: "يكتب" }, "B", "كتاب bisa menerima tanwin (كتابٌ) dan ال (الكتاب) → tanda isim."),
        mk("j2b1_2", "Tanda apa yang menunjukkan الرجل adalah isim?", { A: "Berakhiran fathah", B: "Diawali ال", C: "Berbentuk fi'il madhi", D: "Mengandung huruf jar" }, "B", "Masuknya ال adalah salah satu tanda isim."),
        mk("j2b1_3", "Manakah yang BUKAN tanda isim?", { A: "Tanwin", B: "ال", C: "Huruf jar masuk padanya", D: "Tanda jazm (sukun)" }, "D", "Jazm hanya pada fi'il mudhari'."),
        mk("j2b1_4", "بسم الله — kata الله adalah …", { A: "Fi'il", B: "Huruf", C: "Isim", D: "Maf'ul fi'il" }, "C", "الله isim majrur karena didahului ب."),
        mk("j2b1_5", "يا محمد — kenapa محمد disebut isim?", { A: "Didahului يا (huruf nida)", B: "Fi'il madhi", C: "Huruf jar", D: "Fi'il mudhari'" }, "A", "Kemasukan huruf nida adalah tanda isim."),
        mk("j2b1_6", "Manakah kalimat yang seluruh katanya isim?", { A: "زيد قائم", B: "ذهب زيد", C: "يقرأ الطالب", D: "اكتب الدرس" }, "A", "زيد (mubtada) + قائم (khabar) keduanya isim."),
        mk("j2b1_7", "مررت بزيدٍ — kata زيد di sini …", { A: "Marfu'", B: "Manshub", C: "Majrur", D: "Majzum" }, "C", "Majrur karena kemasukan huruf jar ب."),
        mk("j2b1_8", "Manakah yang termasuk isim mufrad?", { A: "المسلمون", B: "المسلمان", C: "مسلمٌ", D: "مسلمات" }, "C", "مسلمٌ tunggal."),
        mk("j2b1_9", "Tanwin adalah tanda khusus untuk …", { A: "Fi'il", B: "Huruf", C: "Isim", D: "Semua kata" }, "C", "Tanwin hanya masuk pada isim."),
        mk("j2b1_10", "Manakah yang termasuk isim?", { A: "إلى", B: "قلم", C: "كتب", D: "لم" }, "B", "قلم isim (bisa ditanwinkan: قلمٌ)."),
      ],
    },
    {
      id: "j2_b2_macam_isim",
      number: 2,
      title: "Macam-macam Isim",
      description: "Nakirah, Ma'rifat, Dhomir, Isyaroh, Maushul",
      soal: [
        mk("j2b2_1", "Manakah yang termasuk isim ma'rifat?", { A: "كتابٌ", B: "رجلٌ", C: "البيت", D: "قلمٌ" }, "C", "البيت ma'rifat karena diawali ال."),
        mk("j2b2_2", "Ciri utama isim nakirah adalah …", { A: "Diawali ال", B: "Menerima tanwin", C: "Berupa dhomir", D: "Berupa isim 'alam" }, "B", "Nakirah biasanya bertanwin."),
        mk("j2b2_3", "Manakah isim muannats?", { A: "مسلم", B: "فاطمة", C: "محمد", D: "زيد" }, "B", "Akhiran ة = muannats."),
        mk("j2b2_4", "Manakah yang BUKAN isim ma'rifat?", { A: "هو", B: "هذا", C: "الذي", D: "رجلٌ" }, "D", "رجلٌ nakirah."),
        mk("j2b2_5", "هذا كتابٌ — هذا adalah isim …", { A: "Dhomir", B: "Isyaroh", C: "Maushul", D: "'Alam" }, "B", "هذا = isim isyaroh."),
        mk("j2b2_6", "Dhomir untuk 'kami/kita' adalah …", { A: "هم", B: "نحن", C: "أنتم", D: "هي" }, "B", "نحن = kami/kita."),
        mk("j2b2_7", "Tatsniyah dari مسلم adalah …", { A: "مسلمون", B: "مسلمان", C: "مسلمات", D: "مسالم" }, "B", "Tatsniyah = +ان."),
        mk("j2b2_8", "Jamak mudzakkar salim adalah …", { A: "مسلمات", B: "رجال", C: "مؤمنون", D: "كتب" }, "C", "JMS diakhiri ون/ين."),
        mk("j2b2_9", "Jamak muannats salim adalah …", { A: "مسلمون", B: "مسلمات", C: "رجال", D: "كتب" }, "B", "JMnS diakhiri ات."),
        mk("j2b2_10", "محمد adalah jenis isim …", { A: "'Alam (nama)", B: "Nakirah", C: "Isyaroh", D: "Maushul" }, "A", "Isim 'alam = nama orang/tempat (ma'rifat)."),
      ],
    },
    {
      id: "j2_b3_isim_fail",
      number: 3,
      title: "Wazan-wazan Isim Fa'il",
      description: "Pola wazan dan contoh isim fa'il",
      soal: [
        mk("j2b3_1", "ولا أنا ____ ما عبدتم", { A: "عابدٌ", B: "عابدٍ", C: "عابد", D: "عابدُ" }, "A", "Khabar dari mubtada أنا → rofa' (tanwin dhammah)."),
        mk("j2b3_2", "Wazan baku isim fa'il dari tsulatsi mujarrad adalah …", { A: "مَفْعُول", B: "فَاعِل", C: "تَفْعِيل", D: "فِعَالَة" }, "B", "Wazan فَاعِل (كاتب، قارئ)."),
        mk("j2b3_3", "Isim fa'il dari كَتَبَ adalah …", { A: "مكتوب", B: "كتاب", C: "كاتب", D: "مكتب" }, "C", "كاتب = penulis."),
        mk("j2b3_4", "الطالب ____ في الفصل", { A: "مكتوب", B: "كاتبٌ", C: "كاتبٍ", D: "اكتب" }, "B", "Khabar marfu' → كاتبٌ."),
        mk("j2b3_5", "Isim fa'il dari قرأ adalah …", { A: "مقروء", B: "قراءة", C: "قارئ", D: "اقرأ" }, "C", "قارئ = pembaca."),
        mk("j2b3_6", "Manakah yang BUKAN isim fa'il?", { A: "ناصر", B: "حافظ", C: "مكتوب", D: "ساجد" }, "C", "مكتوب = isim maf'ul."),
        mk("j2b3_7", "محمدٌ ____ القرآنَ كل يوم. (pembaca)", { A: "مقروء", B: "قارئٌ", C: "قراءة", D: "قُرّاء" }, "B", "Isim fa'il sebagai khabar → marfu'."),
        mk("j2b3_8", "Isim fa'il berfungsi seperti fi'ilnya, sehingga bisa …", { A: "Hanya menjadi mubtada", B: "Merofa'kan fa'il & menashabkan maf'ul", C: "Tidak punya amal", D: "Hanya majrur" }, "B", "Isim fa'il beramal seperti fi'ilnya."),
        mk("j2b3_9", "Isim fa'il dari نَصَرَ adalah …", { A: "منصور", B: "ناصر", C: "نَصْر", D: "نصير" }, "B", "ناصر = penolong."),
        mk("j2b3_10", "Isim fa'il dari سَجَدَ adalah …", { A: "ساجد", B: "مسجود", C: "سجود", D: "مسجد" }, "A", "ساجد = orang yang sujud."),
      ],
    },
    {
      id: "j2_b4_isim_maful",
      number: 4,
      title: "Wazan-wazan Isim Maf'ul",
      description: "Pola wazan dan contoh isim maf'ul",
      soal: [
        mk("j2b4_1", "Wazan baku isim maf'ul tsulatsi mujarrad …", { A: "فَاعِل", B: "مَفْعُول", C: "فَعِيل", D: "مُفْعَل" }, "B", "Wazan مَفْعُول (مكتوب، منصور)."),
        mk("j2b4_2", "Isim maf'ul dari كتب …", { A: "كاتب", B: "كتاب", C: "مكتوب", D: "اكتب" }, "C", "مكتوب = yang ditulis."),
        mk("j2b4_3", "Isim maf'ul dari نصر …", { A: "ناصر", B: "نصير", C: "منصور", D: "نَصْر" }, "C", "منصور = yang ditolong."),
        mk("j2b4_4", "الكتاب ____ على المكتب. (diletakkan)", { A: "واضع", B: "موضوعٌ", C: "موضوعٍ", D: "ضع" }, "B", "Khabar marfu' → موضوعٌ."),
        mk("j2b4_5", "Manakah isim maf'ul?", { A: "مفتاح", B: "مفتوح", C: "فاتح", D: "فتح" }, "B", "مفتوح wazan مفعول."),
        mk("j2b4_6", "Perbedaan isim fa'il dan isim maf'ul?", { A: "Sama saja", B: "Fa'il = pelaku, Maf'ul = sasaran", C: "Fa'il selalu majrur", D: "Maf'ul selalu mubtada" }, "B", "Fa'il = subjek, Maf'ul = objek."),
        mk("j2b4_7", "Ubah كاتب menjadi isim maf'ul:", { A: "مكاتب", B: "كتيب", C: "مكتوب", D: "كتابة" }, "C", "فاعل → مفعول."),
        mk("j2b4_8", "زيدٌ ____ من الله. (yang diberi rahmat)", { A: "راحم", B: "مرحومٌ", C: "رحمة", D: "ارحم" }, "B", "مرحوم = isim maf'ul."),
        mk("j2b4_9", "Isim maf'ul dari عَلِمَ adalah …", { A: "عالم", B: "علم", C: "معلوم", D: "تعليم" }, "C", "معلوم = yang diketahui."),
        mk("j2b4_10", "Isim maf'ul dari فَهِمَ adalah …", { A: "فاهم", B: "مفهوم", C: "فهم", D: "افهم" }, "B", "مفهوم = yang dipahami."),
      ],
    },
    {
      id: "j2_b5_masdar",
      number: 5,
      title: "Wazan-wazan Masdar",
      description: "Pola wazan dan contoh masdar",
      soal: [
        mk("j2b5_1", "Masdar dari كَتَبَ adalah …", { A: "كاتب", B: "مكتوب", C: "كتابة", D: "اكتب" }, "C", "كتابة = penulisan."),
        mk("j2b5_2", "Masdar dari فَهِمَ adalah …", { A: "فاهم", B: "مفهوم", C: "فَهْم", D: "افهم" }, "C", "فَهْم = pemahaman."),
        mk("j2b5_3", "Wazan masdar yang umum dari ضَرَبَ …", { A: "ضَرْب", B: "ضارب", C: "مضروب", D: "تضريب" }, "A", "ضَرْب (wazan فَعْل)."),
        mk("j2b5_4", "Masdar dari عَلَّمَ adalah …", { A: "تعليم", B: "علم", C: "معلوم", D: "معلم" }, "A", "Wazan فَعَّلَ → تَفْعِيل."),
        mk("j2b5_5", "____ القرآن واجبٌ على كل مسلم. (membaca)", { A: "قارئ", B: "مقروء", C: "قراءةُ", D: "اقرأ" }, "C", "Mubtada → marfu'."),
        mk("j2b5_6", "Masdar dari أَكْرَمَ adalah …", { A: "كرم", B: "كريم", C: "إكرام", D: "مكرم" }, "C", "Wazan أَفْعَلَ → إِفْعَال."),
        mk("j2b5_7", "Manakah masdar?", { A: "ذاهب", B: "مذهوب", C: "ذَهَاب", D: "اذهب" }, "C", "ذهاب = kepergian."),
        mk("j2b5_8", "Ciri masdar adalah …", { A: "Selalu menunjukkan waktu", B: "Isim yang menunjukkan kejadian tanpa terikat waktu", C: "Selalu pelaku", D: "Selalu majrur" }, "B", "Masdar = kejadian/perbuatan tanpa waktu."),
        mk("j2b5_9", "Masdar dari جَلَسَ adalah …", { A: "جالس", B: "مجلوس", C: "جلوس", D: "مجلس" }, "C", "جلوس = duduk."),
        mk("j2b5_10", "Masdar dari اسْتَغْفَرَ adalah …", { A: "غفران", B: "استغفار", C: "مغفور", D: "غافر" }, "B", "Wazan اسْتَفْعَلَ → اسْتِفْعَال."),
      ],
    },
  ],
};

// =====================================================================
// JILID 3 — ORANGE
// =====================================================================
const JILID_3: NahwuJilid = {
  id: "jilid3",
  number: 3,
  title: "Jilid 3",
  subtitle: "Pendalaman materi Nahwu lanjutan",
  color: "orange",
  babs: [
    {
      id: "j3_b1_mubtada",
      number: 1,
      title: "Mubtada",
      description: "Subjek kalimat ismiyah",
      soal: [
        mk("j3b1_1", "Mubtada adalah …", { A: "Isim marfu' di awal jumlah ismiyah", B: "Fi'il madhi", C: "Huruf jar", D: "Maf'ul bih" }, "A", "Mubtada = isim marfu' yang menjadi subjek di awal kalimat ismiyah."),
        mk("j3b1_2", "Hukum asal mubtada adalah …", { A: "Manshub", B: "Majrur", C: "Marfu'", D: "Majzum" }, "C", "Mubtada selalu marfu'."),
        mk("j3b1_3", "____ قائمٌ. (Zaid berdiri)", { A: "زيدًا", B: "زيدٍ", C: "زيدٌ", D: "زيدَ" }, "C", "Mubtada marfu' → زيدٌ."),
        mk("j3b1_4", "Pasangan mubtada disebut …", { A: "Fa'il", B: "Khabar", C: "Maf'ul", D: "Hal" }, "B", "Mubtada + Khabar = jumlah ismiyah."),
        mk("j3b1_5", "Hukum khabar mubtada adalah …", { A: "Manshub", B: "Majrur", C: "Marfu'", D: "Majzum" }, "C", "Khabar mubtada juga marfu'."),
        mk("j3b1_6", "Mubtada biasanya berupa isim …", { A: "Nakirah", B: "Ma'rifat", C: "Fi'il", D: "Huruf" }, "B", "Mubtada umumnya ma'rifat."),
        mk("j3b1_7", "الطالبُ ____. (rajin)", { A: "مجتهدًا", B: "مجتهدٍ", C: "مجتهدٌ", D: "مجتهدَ" }, "C", "Khabar marfu' → مجتهدٌ."),
        mk("j3b1_8", "Pada kalimat 'في البيتِ رجلٌ' kedudukan رجلٌ adalah …", { A: "Khabar muqaddam", B: "Mubtada muakhkhor", C: "Maf'ul", D: "Fa'il" }, "B", "Mubtada diakhirkan karena khabar berupa jar-majrur didahulukan."),
        mk("j3b1_9", "Khabar bisa berupa …", { A: "Mufrad, jumlah, atau syibhul jumlah", B: "Hanya mufrad", C: "Hanya fi'il", D: "Hanya huruf" }, "A", "Khabar bisa mufrad, jumlah (ismiyah/fi'liyah), atau syibhul jumlah (jar-majrur/zharaf)."),
        mk("j3b1_10", "محمدٌ ____ في المسجدِ. (mubtada + khabar berupa jumlah fi'liyah)", { A: "كتابٌ", B: "يصلّي", C: "كاتب", D: "مكتوب" }, "B", "Khabar berupa jumlah fi'liyah: يصلّي."),
      ],
    },
    {
      id: "j3_b2_annawasikh",
      number: 2,
      title: "Annawasikh",
      description: "Amil yang mengubah hukum mubtada-khabar (kana, inna, dll)",
      soal: [
        mk("j3b2_1", "كان dan saudara-saudaranya berfungsi …", { A: "Merofa'kan mubtada, menashabkan khabar", B: "Menashabkan mubtada, merofa'kan khabar", C: "Menjazmkan keduanya", D: "Menjarkan keduanya" }, "A", "Kana wa akhowatuha: rofa' isimnya, nashab khabarnya."),
        mk("j3b2_2", "إنّ dan saudara-saudaranya berfungsi …", { A: "Merofa'kan mubtada, menashabkan khabar", B: "Menashabkan mubtada (isimnya), merofa'kan khabar", C: "Menjazmkan keduanya", D: "Tidak berpengaruh" }, "B", "Inna wa akhowatuha: nashab isimnya, rofa' khabarnya."),
        mk("j3b2_3", "كان زيدٌ ____. (berdiri)", { A: "قائمٌ", B: "قائمًا", C: "قائمٍ", D: "قائمَ" }, "B", "Khabar كان manshub → قائمًا."),
        mk("j3b2_4", "إنّ ____ قائمٌ.", { A: "زيدٌ", B: "زيدٍ", C: "زيدًا", D: "زيدَ" }, "C", "Isim إنّ manshub → زيدًا."),
        mk("j3b2_5", "Manakah saudara كان?", { A: "أصبح", B: "إنّ", C: "كأنّ", D: "ليت" }, "A", "أصبح، أمسى، ظلّ termasuk akhowat كان."),
        mk("j3b2_6", "Manakah saudara إنّ?", { A: "أصبح", B: "صار", C: "كأنّ", D: "ليس" }, "C", "إنّ، أنّ، كأنّ، لكنّ، ليت، لعلّ."),
        mk("j3b2_7", "ليس termasuk …", { A: "Saudara كان", B: "Saudara إنّ", C: "Huruf jar", D: "Fi'il amr" }, "A", "ليس termasuk akhowat كان (untuk peniadaan)."),
        mk("j3b2_8", "كأنّ العلمَ ____. (cahaya)", { A: "نورٌ", B: "نورًا", C: "نورٍ", D: "نورَ" }, "A", "Khabar كأنّ marfu' → نورٌ."),
        mk("j3b2_9", "ظَنّ dan saudaranya disebut …", { A: "Naasikh", B: "Af'al qulub (menashabkan dua maf'ul)", C: "Huruf jar", D: "Fi'il amr" }, "B", "ظنّ، حسب، خال = af'al qulub, menashabkan dua maf'ul (asalnya mubtada-khabar)."),
        mk("j3b2_10", "Disebut nawasikh karena …", { A: "Menghapus kata", B: "Menasakh/mengubah hukum mubtada-khabar", C: "Menambah huruf", D: "Tidak berfungsi" }, "B", "Nawasikh = mengubah/menasakh hukum asal mubtada-khabar."),
      ],
    },
    {
      id: "j3_b3_ghoir_munshorif",
      number: 3,
      title: "Ghoir Munshorif",
      description: "Isim yang tidak menerima tanwin",
      soal: [
        mk("j3b3_1", "Isim ghoir munshorif adalah …", { A: "Isim yang menerima tanwin", B: "Isim yang TIDAK menerima tanwin", C: "Fi'il", D: "Huruf" }, "B", "Ghoir munshorif = tidak ditanwinkan dan jarnya dengan fathah."),
        mk("j3b3_2", "Tanda jar isim ghoir munshorif adalah …", { A: "Kasrah", B: "Fathah", C: "Dhammah", D: "Sukun" }, "B", "Jar dengan fathah (sebagai pengganti kasrah)."),
        mk("j3b3_3", "Manakah isim ghoir munshorif?", { A: "زيد", B: "أحمد", C: "كتاب", D: "قلم" }, "B", "أحمد = isim 'alam wazan fi'il, ghoir munshorif."),
        mk("j3b3_4", "صليتُ في ____. (di Mekkah)", { A: "مكةٌ", B: "مكةَ", C: "مكةٍ", D: "مكةً" }, "B", "مكة ghoir munshorif, jar dengan fathah → مكةَ."),
        mk("j3b3_5", "Sebab ghoir munshorif pada فاطمة adalah …", { A: "Ta'nits & 'alamiyah", B: "Wazan fi'il", C: "Tarkib", D: "Jamak taksir" }, "A", "فاطمة = nama perempuan ('alam muannats)."),
        mk("j3b3_6", "Manakah BUKAN sebab ghoir munshorif?", { A: "Wazan fi'il", B: "'Adl", C: "Tanwin", D: "'Ujmah ('asing')" }, "C", "Tanwin justru tanda munshorif. Sebab ghoir munshorif: 'alamiyah, ta'nits, 'ujmah, wazan fi'il, tarkib, 'adl, dll."),
        mk("j3b3_7", "Bila kemasukan ال atau idhafah, ghoir munshorif …", { A: "Tetap jar dengan fathah", B: "Kembali jar dengan kasrah", C: "Tidak berubah", D: "Menjadi marfu'" }, "B", "Jika ber-ال atau jadi mudhaf, jarnya kembali pakai kasrah."),
        mk("j3b3_8", "مررتُ بأحمد____ ", { A: "ُ", B: "َ", C: "ِ", D: "ٍ" }, "B", "Jar ghoir munshorif → fathah."),
        mk("j3b3_9", "Manakah ghoir munshorif karena jamak (shighotu muntahal jumu')?", { A: "كتب", B: "مساجد", C: "رجال", D: "أقلام" }, "B", "مساجد wazan مفاعل = shighotu muntahal jumu' → ghoir munshorif."),
        mk("j3b3_10", "عمر termasuk ghoir munshorif karena …", { A: "'Alamiyah & 'adl", B: "Wazan fi'il", C: "Ta'nits", D: "Jamak" }, "A", "عمر = 'alam + 'adl (dari عامر)."),
      ],
    },
    {
      id: "j3_b4_isim_musytaq",
      number: 4,
      title: "Isim Musytaq",
      description: "Isim turunan (fa'il, maf'ul, sifat musyabbahah, dll)",
      soal: [
        mk("j3b4_1", "Isim musytaq adalah …", { A: "Isim yang berdiri sendiri", B: "Isim yang diambil/diturunkan dari masdar/fi'il", C: "Huruf jar", D: "Fi'il madhi" }, "B", "Musytaq = diambil dari kata lain (umumnya masdar)."),
        mk("j3b4_2", "Manakah BUKAN isim musytaq?", { A: "كاتب", B: "مكتوب", C: "حجر", D: "أكبر" }, "C", "حجر = isim jamid (bukan turunan)."),
        mk("j3b4_3", "كاتب adalah jenis musytaq …", { A: "Isim fa'il", B: "Isim maf'ul", C: "Sifat musyabbahah", D: "Isim tafdhil" }, "A", "كاتب = isim fa'il (wazan فاعل)."),
        mk("j3b4_4", "مكتوب adalah jenis musytaq …", { A: "Isim fa'il", B: "Isim maf'ul", C: "Sifat musyabbahah", D: "Isim tafdhil" }, "B", "مكتوب = isim maf'ul (wazan مفعول)."),
        mk("j3b4_5", "أكبر adalah jenis musytaq …", { A: "Isim fa'il", B: "Isim maf'ul", C: "Isim tafdhil", D: "Isim makan" }, "C", "Wazan أَفْعَل = isim tafdhil (lebih …)."),
        mk("j3b4_6", "Sifat musyabbahah biasanya menunjukkan …", { A: "Sifat tetap pada pelakunya", B: "Tempat", C: "Waktu", D: "Alat" }, "A", "Sifat musyabbahah = sifat tsabit/tetap (حسن، كريم)."),
        mk("j3b4_7", "مفتاح termasuk …", { A: "Isim alat", B: "Isim makan", C: "Isim tafdhil", D: "Isim fa'il" }, "A", "Wazan مِفْعَال = isim alat (مفتاح، ميزان)."),
        mk("j3b4_8", "مدرسة termasuk …", { A: "Isim alat", B: "Isim makan/zaman", C: "Isim tafdhil", D: "Sifat musyabbahah" }, "B", "مَفْعَلة = isim makan."),
        mk("j3b4_9", "زيد ____ من عمرٍو. (lebih besar)", { A: "كبير", B: "أكبر", C: "مكبور", D: "تكبير" }, "B", "Isim tafdhil → أكبر (لـ tafdhil)."),
        mk("j3b4_10", "Isim musytaq diturunkan dari …", { A: "Huruf", B: "Masdar", C: "Dhomir", D: "Isim isyaroh" }, "B", "Sumber utama isim musytaq adalah masdar."),
      ],
    },
    {
      id: "j3_b5_isim_mutal",
      number: 5,
      title: "Isim Mu'tal",
      description: "Isim yang akhirnya huruf 'illat (alif/ya/wau)",
      soal: [
        mk("j3b5_1", "Isim mu'tal adalah isim yang …", { A: "Akhirnya berupa huruf shahih", B: "Akhirnya berupa huruf 'illat (ا/ي/و)", C: "Diawali ال", D: "Bertanwin" }, "B", "Mu'tal = berakhir dengan huruf 'illat."),
        mk("j3b5_2", "Isim maqshur adalah isim yang akhirnya …", { A: "Alif lazimah", B: "Ya' lazimah berkasrah", C: "Wau", D: "Hamzah" }, "A", "Maqshur = akhirnya alif tetap (الفتى، الهدى)."),
        mk("j3b5_3", "Isim manqush adalah isim yang akhirnya …", { A: "Alif", B: "Ya' lazimah berkasrah", C: "Wau", D: "Hamzah" }, "B", "Manqush = akhirnya ya' lazimah berkasrah (القاضي، الداعي)."),
        mk("j3b5_4", "Isim mamdud adalah isim yang akhirnya …", { A: "Hamzah didahului alif zaidah", B: "Ya'", C: "Wau", D: "Sukun" }, "A", "Mamdud = akhirnya hamzah dengan alif zaidah sebelumnya (سماء، صحراء)."),
        mk("j3b5_5", "Manakah isim maqshur?", { A: "القاضي", B: "الفتى", C: "السماء", D: "الكتاب" }, "B", "الفتى = maqshur."),
        mk("j3b5_6", "Manakah isim manqush?", { A: "الفتى", B: "القاضي", C: "السماء", D: "الكتاب" }, "B", "القاضي = manqush (akhir ya')."),
        mk("j3b5_7", "Manakah isim mamdud?", { A: "الفتى", B: "القاضي", C: "السماء", D: "الكتاب" }, "C", "السماء = mamdud (akhir hamzah)."),
        mk("j3b5_8", "I'rab isim maqshur ditandai dengan …", { A: "Harokat zhahir", B: "Harokat muqaddarah (ditakdirkan)", C: "Huruf", D: "Sukun" }, "B", "Karena alifnya tidak menerima harokat → harokat ditakdirkan."),
        mk("j3b5_9", "Pada isim manqush, harokat yang ditakdirkan adalah …", { A: "Fathah", B: "Dhammah & kasrah (rofa' dan jar)", C: "Sukun", D: "Tanwin" }, "B", "Pada manqush, dhammah & kasrah ditakdirkan; fathah zhahir."),
        mk("j3b5_10", "Saat isim manqush nakirah, ya'-nya biasanya …", { A: "Tetap", B: "Dibuang dan diganti tanwin", C: "Berubah jadi alif", D: "Berubah jadi wau" }, "B", "Manqush nakirah → ya' dibuang, jadi قاضٍ، داعٍ."),
      ],
    },
    {
      id: "j3_b6_at_tawabi",
      number: 6,
      title: "At-Tawabi'",
      description: "Kata yang mengikuti i'rab kata sebelumnya (na't, athaf, taukid, badal)",
      soal: [
        mk("j3b6_1", "At-Tawabi' adalah …", { A: "Kata yang mengikuti i'rab kata sebelumnya", B: "Fi'il", C: "Huruf jar", D: "Mubtada" }, "A", "Tawabi' = na't, athaf, taukid, badal — mengikuti i'rab matbu'."),
        mk("j3b6_2", "Yang BUKAN termasuk tawabi' adalah …", { A: "Na't (sifat)", B: "'Athaf", C: "Taukid", D: "Maf'ul bih" }, "D", "Maf'ul bih bukan tawabi'."),
        mk("j3b6_3", "جاء الطالبُ ____. (yang rajin)", { A: "المجتهدَ", B: "المجتهدُ", C: "المجتهدِ", D: "المجتهدًا" }, "B", "Na't ikut man'utnya (الطالبُ marfu') → المجتهدُ."),
        mk("j3b6_4", "رأيتُ الطالبَ ____. ", { A: "المجتهدُ", B: "المجتهدَ", C: "المجتهدِ", D: "المجتهدٌ" }, "B", "Na't ikut man'ut (manshub) → المجتهدَ."),
        mk("j3b6_5", "جاء زيدٌ و____. ", { A: "عمرًا", B: "عمرٍو", C: "عمرٌو", D: "عمرَ" }, "C", "'Athaf ikut ma'thuf 'alaih (زيدٌ marfu') → عمرٌو."),
        mk("j3b6_6", "Huruf 'athaf yang berarti 'kemudian (langsung)' adalah …", { A: "ثُمَّ", B: "فَ", C: "و", D: "أو" }, "B", "فَ = lalu/kemudian (segera). ثمّ = kemudian (berjeda)."),
        mk("j3b6_7", "Taukid berfungsi untuk …", { A: "Menyifati", B: "Menguatkan/menegaskan", C: "Mengganti", D: "Menjarkan" }, "B", "Taukid = penegasan."),
        mk("j3b6_8", "Lafadz taukid maknawi antara lain …", { A: "نفس، عين، كل، جميع", B: "في، إلى، عن", C: "كان، أصبح", D: "إنّ، أنّ" }, "A", "Taukid maknawi: نفس، عين، كل، جميع، كلا، كلتا."),
        mk("j3b6_9", "Badal adalah …", { A: "Pengganti yang dimaksud sebenarnya", B: "Penyifat", C: "Penghubung", D: "Penegas" }, "A", "Badal = pengganti dari matbu'-nya, yang sebenarnya dimaksud."),
        mk("j3b6_10", "جاء أخوك ____. (Zaid sebagai badal)", { A: "زيدٌ", B: "زيدًا", C: "زيدٍ", D: "زيدَ" }, "A", "Badal ikut mubdal minhu (أخوك marfu') → زيدٌ."),
      ],
    },
  ],
};

export const JILID_LIST: NahwuJilid[] = [JILID_1, JILID_2, JILID_3];

export function getJilidById(id: string): NahwuJilid | undefined {
  return JILID_LIST.find((j) => j.id === id);
}

export function getBabById(jilidId: string, babId: string): NahwuBab | undefined {
  return getJilidById(jilidId)?.babs.find((b) => b.id === babId);
}

// Backward compat: flatten semua bab (jika ada kode lama yang import NAHWU_BANK)
export const NAHWU_BANK: NahwuBab[] = JILID_LIST.flatMap((j) => j.babs);
