// Rich content types for materi
export interface ContentSection {
  type: "text" | "list" | "arabic" | "kaidah" | "alfiyah" | "example" | "table" | "grid" | "pairs" | "ayat" | "contoh_kalimat";
  title?: string;
  content?: string;
  items?: { key?: string; value: string }[];
  arabic?: string;
  latin?: string;
  translation?: string;
  explanation?: string;
  rows?: { label: string; value: string }[];
  alfiyahId?: string;
}

export interface RichBab {
  id: string;
  title: string;
  sections: ContentSection[];
}

// Alfiyah Entry — source of truth for Kholasoh Alfiyah
export interface AlfiyahEntry {
  id: string;
  bab: string;
  bait_arab: string;
  bait_latin: string;
  arti: string;
  digunakan_di_materi: boolean;
}

import { JILID2_ALFIYAH_ENTRIES } from "./jilid2Content";
import { JILID3_ALFIYAH_ENTRIES } from "./jilid3Content";

export const ALFIYAH_ENTRIES: AlfiyahEntry[] = [
  {
    id: "alfiyah_001",
    bab: "Huruf Jar",
    bait_arab: "هاكَ حُرُوفَ الجَرِّ وَهِيَ مِنْ إِلَى\nحَتَّى خَلَا حَاشَا عَدَا فِي عَنْ عَلَى\nمُذْ مُنْذُ رُبَّ لَمْ كَيْ وَ وَتَ\nوَالكَافُ وَالبَا وَلَعَلَّ وَمَتَى",
    bait_latin: "Haaka huruufal jarri wa hiya min ilaa\nHattaa khalaa haasyaa 'adaa fii 'an 'alaa\nMudz mundzu rubba lam kay wa wa ta\nWal kaafu wal baa wa la'alla wa mataa",
    arti: "\"Ari huruf jeer eta min jeng ilaa hatta holaa haasyaa a'daa fii an alaa mudz mundzu rubba lamu kae wawu jeng ta huruf kaf jeng ba jeng laalla jeng mataa.\"",
    digunakan_di_materi: true,
  },
  {
    id: "alfiyah_002",
    bab: "Huruf Jar",
    bait_arab: "وَكُلُّ حَرْفٍ مُسْتَحِقٌّ لِلْبِنَا\nوَالأَصْلُ فِي المَبْنِيِّ أَنْ يُسَكَّنَا",
    bait_latin: "Wa kullu harfin mustahiqqun lil binaa\nWal ashlu fil mabniyyi an yusakkana",
    arti: "Jeng sakabeh huruf hukumna mabni\nSukun jadi tanda asli na mabni.",
    digunakan_di_materi: true,
  },
  {
    id: "alfiyah_003",
    bab: "Huruf Jar",
    bait_arab: "فَارْفَعْ بِضَمٍّ وَانْصِبَنْ فَتْحًا وَجُرّ\nكَسْرًا كَذِكْرِ اللّٰهِ عَبْدُهُ يَسُرّ\nوَجَزْمٌ بِتَسْكِينٍ وَغَيْرُمَا ذُكِرْ\nيَنُوبُ نَحْوَ جَاأَخُو بَنِي نَمِرْ",
    bait_latin: "Far fa' bi dhommin wanshiban fat-han wa jurr\nKasran kadzikrillaahi 'abduhu yasurr\nWa jazmun bi taskiinin wa ghoirumaa dzukir\nYanuubu nahwa jaa akhu banii namir",
    arti: "Rofa' dhommah, nashob fattah, jazem sukun, jeer kasroh dzikir ka Alloh sing tekun.",
    digunakan_di_materi: true,
  },
  {
    id: "alfiyah_003b",
    bab: "Huruf Jar",
    bait_arab: "فَالاَوَّلُ الْاِعْرَابُ فِيهِ قُدِّرَ\nجَمِعُهُ وَهُوَالّٰذِي قَد قُصِّرَ",
    bait_latin: "Fal awwalul i'raabu fiihi quddiro\nJamii'uhu wahuwalladzi qod qusshiro",
    arti: "Isim akhir nya Alif di sebut maksur\nI'rob kira-kirakan jangan takabur",
    digunakan_di_materi: true,
  },
  {
    id: "alfiyah_003c",
    bab: "Huruf Jar",
    bait_arab: "وَارْفَعْ بِوَاوٍ وَبِيَا اجْرُرْ وَانْصِبْ\nسَالِمَ جَمْعِ عَامِرٍ وَمُذْنِبِ\nوَشِبْهِ ذَيْنِ وَبِهِ عِشْرُونَ\nوَبَابُهُ الْحِقْ وَالأَهْلُونَ\nأُولُو وَعَالَمُونَ عِلِّيُّونَ\nوَأَرَضُونَ شَذَّ وَالسِّنُونَ",
    bait_latin: "War fa' bi waawin wa biyaa ijrur wanshib\nSaalima jam'i 'aamirin wa mudznibi...",
    arti: "Jama' mudzakar dan mulhaq nasab Ya'-nun\nRofa' nya Wawu-Nun dan jer dengan Ya'-nun",
    digunakan_di_materi: true,
  },
  {
    id: "alfiyah_003d",
    bab: "Huruf Jar",
    bait_arab: "نُونَاتَالِى الْاِعْرَابِ اَوْتَنْوِينِ\nمِمَّا تُضِيفُ احْذِفْ كَطُورِشِينِ\nوَالثَّانِي اجْرُرْ وَانْوِ مِنْ اَوْفِي إِذَا\nلَمْ يَصْلُحْ اِلَّا ذَاكَ وَالَّامَ خُذَا",
    bait_latin: "Nuunaataali al-i'raabi aw tanwiini\nMimmaa tudhiifu ahdzif kathuuri syiini...",
    arti: "Nun dan tanwin yang jadi mudhof di buang,\nMudhof ilaih jer dan Al mudhof buang\nIdhofat harus menyimpan makna nya في\nAtau makna nya من dan maknanya ل",
    digunakan_di_materi: true,
  },
  {
    id: "alfiyah_004",
    bab: "Isim Dhomir",
    bait_arab: "وَكُلُّ مُضْمَرٍ لَهُ البِنَا يَجِبْ\nوَلَفْظُ مَا جُرَّ كَلَفْظِ مَا نُصِبْ",
    bait_latin: "Wa kullu mudhmarrin lahul binaa yajib\nWalafdzi maa jurro kalafdzi maa nusib",
    arti: "Sakabeh dhomir mabni hukumna\nLafadz jeer sarupa lafadz nasabna",
    digunakan_di_materi: true,
  },
  {
    id: "alfiyah_004b",
    bab: "Isim Dhomir",
    bait_arab: "هَا فَاكْسِرَنْ مِنْ هُ هُمَا هُنَّ وَهُمْ\nإِنْ قَبْلَهَا يَاءُ السَّاكِنُ اَوْكَسْرٌ فَعُمْ",
    bait_latin: "Haa faksiron min hu humaa hunna wa hum\nIn qoblahaa yaa'us saakinu aw kasrun fa'um",
    arti: "هُ، هُمَا، هُنَّ، هَا di baca kasroh\nsebelum nya Ya' sukun atau kasroh",
    digunakan_di_materi: true,
  },
  {
    id: "alfiyah_005",
    bab: "Isim Dhomir",
    bait_arab: "وَلَامُ جَرٍّ فَافْتَحَنْ إِنْ يَتَّصِلْ\nبِهَا ضَمِيرٌ غَيْرُ يَاءٍ مُتَّصِلْ",
    bait_latin: "Wa lammu jarrin faftahan iyyattashil\nBihaa dhomiirin ghoiru yaa in muttashil",
    arti: "Lam jer mun panggih jeng dhomir muttasil\nSalianti ya' di baca fathah te musykil",
    digunakan_di_materi: true,
  },
  {
    id: "alfiyah_005b",
    bab: "Isim Dhomir",
    bait_arab: "اَخِرَمَا اُضِيفَ لِلْيَاكْسِرِ اِذَا\nلَمْ يَكُّ مُعْتَلًّا كَرَامٍ وَقَذَا",
    bait_latin: "Akhirumaa udhiifa lilyaksir idzaa\nLam yakku mu'talan karoomin waqodza",
    arti: "Kata gandeng dhomir Ya' di baca kasroh\nYa nya sukun jika mu'tal Ya' di baca fatah.",
    digunakan_di_materi: true,
  },
  {
    id: "alfiyah_006",
    bab: "Isim Isyaroh",
    bait_arab: "كَالشَّبَهِ الوَضْعِيِّ فِي اسْمِي جَاتِنَا\nوَالمَعْنَوِيِّ فِي مَتَى وَفِي هُنَا",
    bait_latin: "Kasy-syabahil wadh'iyyi fii ismiy jaatinaa\nWal ma'nawiyyi fii mataa wa fii hunaa",
    arti: "Dhomir mabni serupa huruf jumlah nya\nSyarat Isyaroh sama nyimpan maknanya.",
    digunakan_di_materi: true,
  },
  {
    id: "alfiyah_007",
    bab: "Isim Maushul",
    bait_arab: "وَمَنْ وَمَا وَالْ تُسَاوِي مَا ذُكِرْ\nوَهَكَذَا ذُو عِنْدَ طَيِّئٍ شُهِرْ",
    bait_latin: "Wa man wa maa wal tusaawi maa dzukir\nWa haakadzaa dzu 'inda thayyiin syuhir",
    arti: "من، ما، sama yang tersebut dan juga AL\ndari maushul ذو juga sudah terkenal.",
    digunakan_di_materi: true,
  },
  {
    id: "alfiyah_007b",
    bab: "Isim Maushul",
    bait_arab: "وَكَنِيَابَةٍ عَنِ الفِعْلِ بِلَا\nتَأَثُّرٍ وَكَافْتِقَارٍ أُصِّلَا",
    bait_latin: "Wa kaniyaabatin 'anil fi'li bilaa\nTa'atstsurin wa kaftiqaarin ushshilaa",
    arti: "Dan serupa di dalam butuh sambungan\nContoh maushul mu'rob tanpa sambungan.",
    digunakan_di_materi: true,
  },
  {
    id: "alfiyah_008",
    bab: "Isim Maushul",
    bait_arab: "وَكُلُّهَا يَلْزَمُ بَعْدَهُ صِلَه\nعَلَى ضَمِيرٍ لَائِقٍ مُشْتَمِلَه",
    bait_latin: "Wa kulluhaa yalzamu ba'dahu shilah\n'Alaa dhamiiril laa'iqin musytamilah",
    arti: "Setelah maushul harus nya ada Shilah\nMengandung dhomir dan shilah nya bentuk jumlah.",
    digunakan_di_materi: true,
  },
  ...JILID2_ALFIYAH_ENTRIES,
  ...JILID3_ALFIYAH_ENTRIES,
];

// Helper: get alfiyah entry by id
export const getAlfiyahById = (id: string) => ALFIYAH_ENTRIES.find((e) => e.id === id);

// Helper: get all alfiyah entries grouped by bab
export const getAlfiyahByBab = () => {
  const grouped: Record<string, AlfiyahEntry[]> = {};
  ALFIYAH_ENTRIES.forEach((entry) => {
    if (!grouped[entry.bab]) grouped[entry.bab] = [];
    grouped[entry.bab].push(entry);
  });
  return grouped;
};

export const JILID1_CONTENT: RichBab[] = [
  // =====================
  // MUQODDIMAH
  // =====================
  {
    id: "muqoddimah",
    title: "Muqoddimah",
    sections: [
      {
        type: "arabic",
        title: "بسم الله الرحمن الرحيم",
        arabic: "السلام عليكم ورحمةالله وبركاته\n\nبسم الله الرحمن الحيم",
      },
      {
        type: "text",
        title: "Pengantar",
        content: "Alhamdulillah, berkat pertolongan Alloh subhannalloh ta'ala, Aplikasi Kitabify yang sesuai dengan kitab Amtsilati karangan KH Taufiqul Hakim dapat terselesaikan.\n\nDengan adanya Aplikasi ini, Insya Alloh, bagi para pemula dapat dengan mudah memahami Al Qur'an dan dapat juga metode tersebut diterapkan untuk mendalami kitab-kitab klasik, yang di kenal dengan sebutan kitab kuning.\n\nWalaupun masih begitu jauh dari sempurna, Aplikasi Kitabify yang mengusung pelajaran dari kitab Amtsilati ini semoga dapat membantu membuka cakrawala berfikir santri yang kebanyakan merasa sulit dan berat dalam mendalami Al Qur'an, yang berakibat malas untuk belajar Al Qur'an atau kitab kuning.\n\nSemoga dengan di hadirkan nya aplikasi ini, dapat menjadi sumbangan pemikiran, sebagai tambahan dalam khazanah pemikiran mendalami Islam, dan memberi semangat pada generasi muslim agar menjadi generasi yang paham dengan kitab Suci nya.",
      },
      {
        type: "text",
        title: "Ucapan Terima Kasih",
        content: "Saya sangat berterima kasih sebanyak-banyak nya kepada KH Taufiqul Hakim, karena telah menciptakan kitab Amtsilati, dan juga saya berterimakasih kepada KH Aden beserta jajaran nya, karena telah mengajarkan saya metode Amtsilati.\n\nHarapan saya, semoga Kitabify bisa bermanfaat bukan cuma untuk kalangan santri, juga bisa bermanfaat untuk kalangan non santri yang ingin belajar membaca, memahami kitab-kitab klasik.",
      },
      {
        type: "arabic",
        arabic: "والسلام عليكم ورحمةالله وبركاته",
      },
      {
        type: "text",
        title: "Pembuat",
        content: "Aa Ust Muhammad Nurzen",
      },
      {
        type: "text",
        title: "Pengarang Kitab Amtsilati",
        content: "KH Taufiqul Hakim",
      },
      {
        type: "text",
        title: "Pengajar Kitab Amtsilati",
        content: "KH Aden beserta jajaran nya pada Pondok Pesantren Al Istiqomah / Ponpes Isteq Amtsilati Ciheulang Cianjur Jawa Barat",
      },
      {
        type: "text",
        title: "⚠️ Himbauan",
        content: "Jangan Takut salah, asal berusaha membenarkan dan tidak sengaja di salahkan.\n\nJangan malu bertanya di sosial media yang kita sediakan.\n\nBanyaklah berdiskusi dan bermusyawarah dengan admin yang siap melayani 1x24jam.\n\nApabila sudah khatam, lanjutkan pada kitab-kitab yang lebih sempurna.\n\nIngatlah, pembahasan pada kitab ini baru dalam tahap dasar.\n\nBertawadhlu lah dengan ilmu yang kita miliki.\n\nBila ada materi yang salah, mohon di koreksi.",
      },
    ],
  },

  // =====================
  // BAB 1 — HURUF JAR
  // =====================
  {
    id: "huruf_jar",
    title: "Bab 1 — Huruf Jar",
    sections: [
      {
        type: "text",
        title: "🟢 Pengertian",
        content: "Huruf Jar adalah kata depan yang mempengaruhi isim setelah nya. Atau merubah harokat pada isim/kata setelah nya.\n\nHuruf Jar memiliki peran untuk mengkasrohkan isim/kata setelah nya.",
      },
      {
        type: "list",
        title: "🟢 Huruf Jar ada 20 jenis",
        items: [
          { key: "مِنْ", value: "saking / dari — Menunjukkan asal suatu kalimat. من bila bertemu dengan alif lam maka nun sukun berubah menjadi nun fatah" },
          { key: "إِلَى", value: "ke / kepada — Menunjukkan tujuan atau yang di tuju" },
          { key: "حَتَّى", value: "sehingga" },
          { key: "خَلَا / حَاشَا / عَدَا", value: "kecuali" },
          { key: "فِي", value: "di / didalam — Menunjukkan posisi kata dalam suatu kalimat" },
          { key: "عَنْ", value: "saking / dari — Menunjukkan asal suatu kalimat. عن bila bertemu dengan alif lam maka nun sukun berubah menjadi nun kasroh" },
          { key: "عَلَى", value: "diatas / atas — Menunjukkan posisi subjek dalam suatu kalimat" },
          { key: "مُذْ / مُنْذُ", value: "Sejak" },
          { key: "رُبَّ", value: "kebalikan" },
          { key: "لِ", value: "Karena, pada, milik — Menunjukkan kepemilikan" },
          { key: "كَيْ", value: "seperti" },
          { key: "وَ", value: "demi — Menunjukkan makna sumpah (qosam)" },
          { key: "تَ", value: "demi (untuk sumpah)" },
          { key: "كَ", value: "Seperti / bagaikan — Menunjukkan makna penyerupaan / tasybih" },
          { key: "بِ", value: "Demi / Sebab / Dengan — Menunjukkan sebab / alasan terjadi nya sesuatu" },
          { key: "لَعَلَّ", value: "Boleh jadi / Bisa jadi" },
          { key: "مَتَى", value: "Kapan" },
        ],
      },
      {
        type: "example",
        title: "🟢 Contoh مِنْ (Tanpa alif lam)",
        items: [
          { value: "ذُرِّيَّىةً بَعضُهَا مِنْ بَعضٍ" },
          { value: "كَم اَهلَكنَا مِن قَبلِهِم" },
        ],
      },
      {
        type: "example",
        title: "🟢 Contoh مِنْ (Dengan alif lam)",
        items: [
          { value: "مِنَ اْلجِنَّةِ وَالنَّاسِ" },
          { value: "وَمَا اَنَامِنَ المُشرِكِينَ" },
        ],
      },
      {
        type: "example",
        title: "🟢 Contoh إِلَى",
        items: [
          { value: "إِلٰى اللّٰهِ مَرجِعُكُم" },
          { value: "إِلٰى المَسجِدِ الْأَقصَى" },
          { value: "وَإِلٰى رَبِّكَ فَارْغَبْ" },
        ],
      },
      {
        type: "example",
        title: "🟢 Contoh فِي",
        items: [
          { value: "فِي جِيدِهَاحَبلٌ" },
          { value: "فِي كُلِّ سُنبُلَةٍ مِاىَٔةُ" },
        ],
      },
      {
        type: "example",
        title: "🟢 Contoh عَنْ",
        items: [
          { value: "عَنِ الفَحْشَا ءِوَالمُنكَرِ" },
          { value: "إِلَّاعَن مَوعِدَةً وَعَدَهَا" },
        ],
      },
      {
        type: "example",
        title: "🟢 Contoh عَنْ dengan alif lam",
        items: [
          { value: "عَنِ الْحَمدُلِلّٰهِ رَبِّ العَالَمِينَ" },
        ],
      },
      {
        type: "example",
        title: "🟢 Contoh عَلَى",
        items: [
          { value: "وَاَن لَا تَعلُوا عَلٰى اللّٰهِ" },
          { value: "لَذُوفَضلٍ عَلٰى النَّاسِ" },
        ],
      },
      {
        type: "example",
        title: "🟢 Contoh لِ",
        items: [
          { value: "ذٰالِكَ لِمَن خَشِيَ رَبَّهُ" },
          { value: "لِلرِّجَالِ نَصِيبٌ" },
        ],
      },
      {
        type: "example",
        title: "🟢 Contoh وَ (sumpah/qosam)",
        items: [
          { value: "وَالنَّا زِعَاتِ غَرقًا" },
          { value: "وَالسَّمَآءِذَاتِ البُرُوجِ" },
        ],
      },
      {
        type: "example",
        title: "🟢 Contoh كَ (penyerupaan/tasybih)",
        items: [
          { value: "كَذٰالِكَ يُبَيِّنُ اللّٰهُ" },
          { value: "كَمَسَلِ حَبَّةٍ اَنبَتَتْ" },
        ],
      },
      {
        type: "example",
        title: "🟢 Contoh بِ",
        items: [
          { value: "وَمَانَحنُ بِتَارِكٖىٓ" },
          { value: "يَانُوحُ اهْبِطْ بِسَلَامٍ" },
        ],
      },
      {
        type: "alfiyah",
        title: "📖 Dasar Alfiyah — Huruf Jar",
        alfiyahId: "alfiyah_001",
      },
      {
        type: "text",
        title: "🟢 Hukum Huruf Jar",
        content: "Semua huruf jar hukum nya mabni, tanda asli mabni adalah sukun.",
      },
      {
        type: "alfiyah",
        title: "📖 Dasar Alfiyah — Kaidah Mabni",
        alfiyahId: "alfiyah_002",
      },
      {
        type: "text",
        title: "🟢 Pengaruh Huruf Jar pada Kata Tunggal",
        content: "Huruf jar pada kata tunggal bisa mempengaruhi tanda baca suatu huruf di awal mau pun di akhir kalimat.",
      },
      {
        type: "example",
        title: "🟢 Contoh Perubahan pada Kata Tunggal",
        items: [
          { key: "من ماء → مماء", value: "Nun sukun di buang dan mim di beri berharokat fattah dan diberi tasydid mengganti nun sukun yang di buang" },
          { key: "مِنْ + اَللّٰهُ → مِنَ اللّٰهِ", value: "harokat sukun pada nun berubah menjadi fattah karena bertemu dengan alif lam dan harokat fattah pada alif di buang dan dommah pada akhir kalimat berubah menjadi kasroh karna diawali huruf jar من" },
        ],
      },
      {
        type: "example",
        title: "🟢 Contoh dengan Alif Lam",
        items: [
          { key: "الَّذِينَ يُؤمِنُونَ بِالغَيبِ", value: "kata بالغيب asal nya بِ + اَلغَيبُ" },
          { key: "اَلحَمدُلِلّٰهِ رَبِّ العَالَمِينَ", value: "kata لِلّٰهِ asal nya لِ + اَللّٰهُ" },
          { key: "مِنَ المَسجِدِ الْحَرَامِ", value: "kata المَسجِدِ asal nya اَلمَسجِدُ karena awal nya berupa huruf jer مِن maka tanda baca pada kata setelah nya wajib majrur / kasroh" },
        ],
      },
      {
        type: "example",
        title: "🟢 Contoh tanpa Alif Lam",
        items: [
          { key: "ذُرّيَّةَ بَعضُهَامِنْ بَعضٍ", value: "kata بَعضٍ asal nya بَعْضٌ karena bertemu dengan huruf jar من maka dommah berubah menjadi majrur / kasroh dengan tanwin karena tanpa alif lam" },
          { key: "وَفَضَّلنَا هُم عَلَى كَسِيرٍ", value: "kata كَسِيرٍ asal nya كَسِيرٌ karena bertemu dengan huruf jar على maka domah berubah menjadi majrur / kasroh. Dengan tanwin karena tanpa alif lam" },
          { key: "اِن اَمْسَكَهُمَا مِن اَحَدٍ", value: "" },
        ],
      },
      {
        type: "alfiyah",
        title: "📖 Dasar Alfiyah — I'rob",
        alfiyahId: "alfiyah_003",
      },
      {
        type: "text",
        title: "🟢 Kata Berakhiran (ا/ى) dengan Fathah Sebelumnya",
        content: "Kata yang akhir nya berupa (ا/ى) dan huruf sebelum nya berharokat fatah, maka tanda jer nya tetap / dikira-kirakan (tidak berupa kasroh yang nampak).",
      },
      {
        type: "example",
        title: "🟢 Contoh dengan Alif Lam",
        items: [
          { key: "بِالهُدَى", value: "بالهدي → بِالهُدَى" },
          { value: "فَسَنُيَسِّرُهُ لِليُسرَى" },
          { value: "بِالبُشرَى قَالُواسَلَامًا" },
          { value: "إِن كُنتُم لِلرُؤيَا تَعبُرُونَ" },
        ],
      },
      {
        type: "example",
        title: "🟢 Contoh dengan Tanwin",
        items: [
          { key: "بِهُدًى", value: "بهدى → بِهُدًى" },
          { value: "اِنَّكَ لَعَلَّى هُدًى مُستَقِيمَ" },
          { value: "وَاِنَّآ اَو اِيَّاكُم لَعَلَّى هُدًى" },
          { value: "أُولٓىِٔكَ هُدًى مِن رَبِّهِم" },
        ],
      },
      {
        type: "text",
        title: "📝 Notes",
        content: "بِالْهُدَى di baca tetap karena di akhiri alif\nبِهُدًى di baca tetap karena di akhiri alif",
      },
      {
        type: "alfiyah",
        title: "📖 Dasar Alfiyah — Isim Maksur",
        alfiyahId: "alfiyah_003b",
      },
      {
        type: "text",
        title: "🟢 Nama Berakhiran (ى/ا) dengan Fathah Sebelumnya",
        content: "Nama yang akhir nya (ى/ا), bila harokat sebelum nya fathah maka tanpa Al, tanpa tanwin, jer nya tetap / dikira-kirakan (tidak memakai kasroh yang nampak).",
      },
      {
        type: "example",
        title: "🟢 Contoh",
        items: [
          { key: "إِلٰى مُوسَى", value: "jangan di baca إِلٰى مُوسَىِ karena kata musaa dalam kalimat tersebut menyebutkan arti Nama yang di akhiri Alif maka harokat kasroh nya tidak di tampakkan" },
        ],
      },
      {
        type: "example",
        title: "🟢 Contoh Ayat",
        items: [
          { value: "وَلَمَّا سَكَتَ اَن مُوسَى الغَضَبُ" },
          { value: "وَقَفَّيْنَا عَلٰى اٰثَا رِهِمْ بِعِيسٰى" },
        ],
      },
      {
        type: "text",
        content: "الى موسى di baca tetap, tanpa Al tanpa tanwin karena nama di akhiri alif",
      },
      {
        type: "alfiyah",
        title: "📖 Dasar Alfiyah — Isim Maksur (Nama)",
        alfiyahId: "alfiyah_003b",
      },
      {
        type: "text",
        title: "🟢 Kata Berakhiran Ya'-Nun Jamak (ملحق جمع مذكر سالم)",
        content: "Kata yang di akhiri Ya'-Nun Jamak atau yang serupa dengan jamak.\n\nCirinya adalah tidak berakal (jernya dibaca ina ( َيْن))",
      },
      {
        type: "example",
        title: "🟢 Contoh",
        items: [
          { key: "للمتقين → لِلمُتَّقِينَ", value: "" },
          { value: "هُدًى لِلمُتَّقِينَ" },
          { value: "أَن أَكُونَ مِنَ المُسلِمِينَ" },
          { value: "وَمَا هُم بِخَارِجِينَ مِنَ النَّارِ" },
        ],
      },
      {
        type: "text",
        content: "للمتقين dibaca لِلمُتَّقِينَ karena di akhiri Ya'-nun jamak",
      },
      {
        type: "alfiyah",
        title: "📖 Dasar Alfiyah — Jama' Mudzakar",
        alfiyahId: "alfiyah_003c",
      },
      {
        type: "text",
        title: "🟢 Pengaruh Huruf Jar pada Gabungan Dua Kata atau Lebih (Idhofat)",
        content: "Huruf jar memiliki pengaruh mengkasrohkan tanda baca suatu kalimat pada kalimat yang memiliki 2 gabungan kata atau lebih yang di sebut dengan Idhofat.\n\nDi dalam idhofat ada 2 jenis kata:\n• Kata pertama di sebut Mudhof (kata yang di idhofatkan)\n• Kata kedua di sebut Mudhof ilaih (kata yang bersandar pada Mudhof)",
      },
      {
        type: "example",
        title: "🟢 Contoh Idhofat",
        items: [
          { key: "فِي جَنّٰتِ النَّعِيمِ", value: "فى adalah huruf jar yang bermakna di / didalam. جَنّٰتِ adalah mudhof. النعيم adalah mudhof ilaih yang bersandar pada kata جَنّٰتِ" },
        ],
      },
      {
        type: "text",
        title: "🟢 Penyebab Kata Menjadi Mudhof Ilaih",
        content: "Penyebab kata menjadi Mudhof ilaih terbagi menjadi 2 jenis:",
      },
      {
        type: "example",
        title: "🟢 Mudhof Ilaih karena Tanwin",
        items: [
          { value: "وَمِنْ شَرِّ حَاسِدٍ" },
          { value: "فِي دِينِ اللّٰهِ اَفْوَاجًا" },
        ],
      },
      {
        type: "example",
        title: "🟢 Mudhof Ilaih karena Alif Lam",
        items: [
          { value: "فِى جَنّٰتِ النَّعِيمِ" },
          { value: "وَمِن شَرِّ النَّفَّاثَاتِ فِى الْعُقُدِ" },
          { key: "بِرَبِّ النَّاسِ", value: "بِرَبِّ di baca kasroh karena terletak setelah huruf jer yaitu بِ Tanpa Al dan tanpa tanwin karena di mudhofkan dengan kata الناس. الناس di baca kasroh karena menjadi mudhof ilaih. Tanpa tanwin karena ada Al" },
        ],
      },
      {
        type: "alfiyah",
        title: "📖 Dasar Alfiyah — Idhofat",
        alfiyahId: "alfiyah_003d",
      },
      {
        type: "text",
        title: "🟢 Pengaruh Huruf Jar pada Mudhof Ilaih Ya'-Nun Jamak",
        content: "Pengaruh huruf jer pada kata yang mudhof ilaih nya di akhiri Ya'-Nun Jamak dan yang serupa dengan jamak.",
      },
      {
        type: "example",
        title: "🟢 Contoh",
        items: [
          { key: "لرب العالمين → لِرَبِّ العَالَمِينَ", value: "" },
          { value: "قَالَ اَسلَمتُ لِرَبِّ الْعَالَمِينَ" },
          { value: "يَومَ يَقُومُ النَّاسُ لِرَبِّ الْعَالَمِينَ" },
        ],
      },
      {
        type: "text",
        content: "لرب العالمين:\nلرب : di baca kasroh, karena terletak setelah huruf jer yaitu لِ. Tanpa Al dan tanpa tanwin karena di mudhofkan pada kata العالمين.\nالعالمين di baca jer karena menjadi mudhof ilaih.",
      },
      {
        type: "alfiyah",
        title: "📖 Dasar Alfiyah — Idhofat (Pengulangan)",
        alfiyahId: "alfiyah_003d",
      },
      {
        type: "text",
        title: "🟢 I'rob",
        content: "I'rob adalah perubahan akhir kata karena terpengaruh oleh kata lain.\n\nI'rob terbagi menjadi 4, diantaranya:",
      },
      {
        type: "table",
        title: "🟢 4 Jenis I'rob",
        rows: [
          { label: "I'rob Rofa'", value: "Tanda asli nya Dhommah (ـُ)" },
          { label: "I'rob Nasab", value: "Tanda asli nya Fathah (ـَ)" },
          { label: "I'rob Jer", value: "Tanda asli nya Kasroh (ـِ)" },
          { label: "I'rob Jazem", value: "Tanda asli nya Sukun (ـْ)" },
        ],
      },
      {
        type: "alfiyah",
        title: "📖 Dasar Alfiyah — I'rob",
        alfiyahId: "alfiyah_003",
      },
    ],
  },

  // =====================
  // BAB 2 — ISIM DHOMIR
  // =====================
  {
    id: "isim_dhomir",
    title: "Bab 2 — Isim Dhomir",
    sections: [
      {
        type: "text",
        title: "🟢 Pengertian",
        content: "Isim dhomir adalah kata yang menggantikan isim menjadi kalimat yang lebih ringkas.",
      },
      {
        type: "text",
        title: "🟢 Macam-macam Isim Dhomir",
        content: "Macam-macam isim dhomir ada 14 diantaranya:",
      },
      {
        type: "text",
        title: "🟢 هُوَ / هُ — Dia laki-laki",
        content: "Menggantikan makna 1 orang laki-laki atau yang serupa dengan itu. (Jika merujuk kepada Alloh sandingkan kepada ke Esaan Alloh).",
      },
      {
        type: "example",
        title: "Contoh dhomir munfasil هُوَ",
        items: [
          { value: "وهوالسميع العليم" },
          { value: "قل هوالله احد" },
          { value: "بل هو قررأن مجيد" },
        ],
      },
      {
        type: "example",
        title: "Contoh dhomir muttasil هُ",
        items: [
          { value: "انه كان توابا" },
          { value: "ولم يكن له كفوا احد" },
          { value: "له ملك السموات والارض" },
        ],
      },
      {
        type: "text",
        content: "هو adalah dhomir munfashil\nه adalah dhomir muttasil\nDhomir munfassil dan dhomir muttasil hukum nya Mabni.",
      },
      {
        type: "alfiyah",
        title: "📖 Dasar Alfiyah — Kaidah Dhomir Mabni",
        alfiyahId: "alfiyah_004",
      },
      {
        type: "text",
        title: "🟢 هُمَا — Dia 2 orang laki-laki / perempuan",
        content: "Menunjukkan makna penyebutan 2 orang.",
      },
      {
        type: "example",
        title: "Contoh هُمَا",
        items: [
          { value: "وبينهما حجابٌ" },
          { value: "فأزلهما ابشيطان" },
          { value: "إن امسكهما من احد" },
        ],
      },
      {
        type: "text",
        title: "🟢 هُمْ — Mereka laki-laki",
        content: "Menggantikan makna penyebutan laki-laki yang lebih dari 2 yang posisi nya jauh dari kita.\n\nهُمْ bila bertemu dengan Alif lam maka di baca هُمُ الْ",
      },
      {
        type: "example",
        title: "Contoh هُمْ",
        items: [
          { value: "وفضلنا هم على كثير" },
          { value: "ويمدهم فى طغيانهم" },
          { value: "يرجع بعضهم الى بعض" },
        ],
      },
      {
        type: "example",
        title: "Contoh هُمُ الْ",
        items: [
          { value: "قال لهم الناس" },
          { value: "سيرحمهم الله" },
          { value: "وايةلهم الارض الميتة" },
        ],
      },
      {
        type: "text",
        title: "🟢 هِيَ / هَا — Dia perempuan",
        content: "Menggantikan makna penyebutan perempuan atau yang menyerupai perempuan.",
      },
      {
        type: "text",
        title: "🟢 هُنَّ — Mereka perempuan",
        content: "Menggantikan makna penyebutan 2 perempuan.",
      },
      {
        type: "example",
        title: "Contoh dhomir muttassil هُنَّ",
        items: [
          { value: "هن لباس لكم" },
          { value: "ولا تمسكو هن ضرارا" },
          { value: "ما يمسكهن الاالرحمن" },
          { value: "فأمسكو هن بمعرو ف" },
        ],
      },
      {
        type: "example",
        title: "Contoh dhomir munfashil هَا",
        items: [
          { value: "فجعلناهانكالالمابين سديها" },
          { value: "وعلم ادم الاسماءكلها" },
          { value: "وانى أعيذهابك" },
          { value: "ودريتهامن الشيطان الرجيم" },
        ],
      },
      {
        type: "text",
        title: "🟢 أَنْتَ / كَ — Kamu laki-laki",
        content: "Menggantikan makna satu laki-laki / yang serupa, yang posisi nya berdekatan dengan kita.",
      },
      {
        type: "example",
        title: "Contoh أَنْتَ",
        items: [
          { value: "انماانت منذر" },
          { value: "وانت خيرالفاتحين" },
          { value: "فأنت عنه تلهى" },
          { value: "انك أنت العزيزالحكيم" },
        ],
      },
      {
        type: "text",
        title: "🟢 أَنْتُمَا / كُمَا — Kamu dua orang laki-laki / perempuan",
        content: "Menggantikan makna dua orang laki-laki atau perempuan yang posisi nya berdekatan.",
      },
      {
        type: "example",
        title: "Contoh أَنْتُمَا",
        items: [
          { value: "انتما ومن اتبعكنا" },
        ],
      },
      {
        type: "example",
        title: "Contoh كُمَا",
        items: [
          { value: "فقد صغت قلو بكما" },
          { value: "ألم أنهكما عن تلكماالشجرة" },
          { value: "قال فمن ربكما يا موسى" },
        ],
      },
      {
        type: "text",
        title: "🟢 أَنْتُمْ / كُمْ — Kamu semua laki-laki",
        content: "Mengantikan makna orang yang diajak bicara semua nya laki-laki.",
      },
      {
        type: "example",
        title: "Contoh أَنْتُمْ",
        items: [
          { value: "ولاأنتم تحزنون" },
          { value: "وأنتم سكارى" },
          { value: "بل أنتم قوم مسرفون" },
          { value: "ولا انتم عا بدون ما اعبد" },
        ],
      },
      {
        type: "example",
        title: "Contoh كُمْ",
        items: [
          { value: "قال طاىٔركم عندالله" },
          { value: "كتب عليكم الصيام" },
          { value: "فقال انا ربكم الاعلى" },
        ],
      },
      {
        type: "text",
        title: "🟢 أَنْتِ / كِ — Kamu perempuan",
        content: "Menggantikan makna orang yang di ajak bicara nya satu orang perempuan / yang serupa.",
      },
      {
        type: "example",
        title: "Contoh أَنْتِ",
        items: [
          { value: "انما انت رحمتى ارحم بك" },
          { value: "انما انت عذابى اعذب" },
        ],
      },
      {
        type: "example",
        title: "Contoh كِ",
        items: [
          { value: "واصطفاك على نساءالعالمين" },
          { value: "ان الله اصطفاك" },
          { value: "قال يا مريم أنى لك هذا" },
        ],
      },
      {
        type: "text",
        title: "🟢 أَنْتُنَّ / كُنَّ — Kamu semua perempuan",
        content: "Menggantikan makna kamu semua perempuan / orang yang di ajak bicaranya dekat dengan kita.",
      },
      {
        type: "example",
        title: "Contoh كُنَّ",
        items: [
          { value: "ان يبد له ازواجا خيرامنكن" },
          { value: "واذكرن ما يتلى فى بيوتكن" },
          { value: "من يأت مكن بفاحشة" },
        ],
      },
      {
        type: "text",
        title: "🟢 أَنَا — Saya",
        content: "",
      },
      {
        type: "text",
        title: "🟢 نَحْنُ / نَا — Kita / Kami",
        content: "Menunjukkan makna kita/kami baik laki-laki atau pun perempuan.",
      },
      {
        type: "example",
        title: "Contoh نَحْنُ",
        items: [
          { value: "نحن قسمنا بينهم" },
          { value: "ونحن تسبخ بحمدك" },
          { value: "انانحن نزلنا الذكر" },
        ],
      },
      {
        type: "example",
        title: "Contoh نَا",
        items: [
          { value: "اهدناالصراط المستقيم" },
          { value: "إنا رسول رب العالمين" },
          { value: "وعندنا كتاب حفيظ" },
        ],
      },
      {
        type: "text",
        title: "🟢 Jenis Dhomir",
        content: "Isim dhomir terbagi menjadi 2 diantara nya:\n• Dhomir Munfasil (Dhomir yang terpisah atau berdiri sendiri biasa nya berada di awal kalimat)\n• Dhomir Mutassil (Dhomir yang selalu menempel pada kata lain)",
      },
      {
        type: "text",
        title: "🟢 Dhomir Muttashil هُ Dibaca هِ",
        content: "هُمَا di baca هِمَا bila sebelum nya kasroh atau Ya' sukun yang di gabung menjadi satu.",
      },
      {
        type: "example",
        title: "Contoh هُ dibaca هِ",
        items: [
          { key: "فيه أيات بينات", value: "هُ pada kata فيه di baca هِ karena huruf sebelumnya adalah Ya' sukun" },
          { value: "وانه اليه تحشرون" },
          { value: "ان صالحا مرسل من ربه" },
          { key: "تجرى باْمره", value: "هُ pada kata بأمره di baca هِ karena harokat sebelum nya adalah kasroh" },
        ],
      },
      {
        type: "example",
        title: "Contoh هُمَا dibaca هِمَا",
        items: [
          { value: "من دونهما جنتان" },
          { value: "ماووري عنْهما من سَوءَاتِهِمَا" },
          { value: "فيهما عينان تجريان" },
          { value: "فلاجناح عليهما فيما اقتدت به" },
        ],
      },
      {
        type: "text",
        content: "هُمَا bila sebelumnya ya sukun / kasroh maka di baca هِمَا",
      },
      {
        type: "alfiyah",
        title: "📖 Dasar Alfiyah — Kasroh pada Dhomir",
        alfiyahId: "alfiyah_004b",
      },
      {
        type: "text",
        title: "🟢 Dhomir Muttasil هُمْ Dibaca هِمْ",
        content: "Dhomir muttasil هُمْ dibaca هِمْ Bila sebelum nya Kasroh atau Ya' sukun yang di gabung jadi satu kalimat.\n\nهُمْ bila bertemu dengan Alif lam dan sebelum nya Ya'sukun atau Kasroh maka dibaca هِمُ الْ",
      },
      {
        type: "example",
        title: "Contoh هُمْ dibaca هِمْ",
        items: [
          { value: "اذاطلعت تزاورعن كهفهم ذات اليمين" },
          { value: "ولبسو فى كهفهم ثلاث ماىٔة" },
        ],
      },
      {
        type: "example",
        title: "Contoh هُمْ dibaca هِمُ الْ",
        items: [
          { value: "عن قبلتِهِمُ الَّتِى كانو عليها" },
        ],
      },
      {
        type: "text",
        content: "Semua huruf pada isim dhomir hukum nya mabni.",
      },
      {
        type: "alfiyah",
        title: "📖 Dasar Alfiyah — Dhomir Mabni",
        alfiyahId: "alfiyah_004",
      },
      {
        type: "text",
        title: "🟢 Perubahan Huruf Jar Sebab Dhomir dan Pengaruhnya",
        content: "",
      },
      {
        type: "example",
        title: "Contoh Perubahan",
        items: [
          { key: "لِ bertemu هُ", value: "maka menjadi لَهُ" },
          { key: "على bertemu هُ", value: "maka menjadi عَلَيهِ" },
        ],
      },
      {
        type: "example",
        title: "Contoh Ayat",
        items: [
          { value: "له ما فى السموات وما فى الارض" },
          { value: "لها ماكسبت وعليها مااكتسبت" },
          { value: "لهم أجرهم عند ربهم" },
        ],
      },
      {
        type: "text",
        content: "لِ adalah huruf jer bertemu dengan isim dhomir هُ maka harokat kasroh diganti dengan harokat fatah menjadi لَهُ",
      },
      {
        type: "alfiyah",
        title: "📖 Dasar Alfiyah — Lam + Dhomir",
        alfiyahId: "alfiyah_005",
      },
      {
        type: "text",
        title: "🟢 Huruf Jar + Ya Dhomir Mutakalim (ي)",
        content: "Semua kata termasuk huruf jar bila bertemu dengan Ya Dhomir mutakalim (ى) maka kata tersebut di baca kasroh dan ى di baca sukun / tanpa harokat.",
      },
      {
        type: "example",
        title: "Contoh لِ + ى = لِى",
        items: [
          { value: "رب هب لى من الصالحين" },
          { value: "فليستجيبو لى وليؤمنوالى" },
        ],
      },
      {
        type: "alfiyah",
        title: "📖 Dasar Alfiyah — Ya Dhomir",
        alfiyahId: "alfiyah_005b",
      },
      {
        type: "text",
        content: "Mu'tal adalah isim yang cacat.",
      },
      {
        type: "text",
        title: "🟢 عَلَى / إِلَى + Dhomir Muttasil",
        content: "Kata على atau الى bila bertemu dengan dhomir muttasil maka di baca عَلَيْ dan إِلَيْ",
      },
      {
        type: "example",
        title: "Contoh على + dhomir",
        items: [
          { key: "على + كم", value: "كتب عليكم الصّيام" },
          { key: "على + ه", value: "صلوا عليه وسلموا تسليما" },
          { key: "على + نا", value: "وماعليناالا البلاغ المبين" },
        ],
      },
    ],
  },

  // =====================
  // BAB 3 — ISIM ISYAROH
  // =====================
  {
    id: "isim_isyaroh",
    title: "Bab 3 — Isim Isyaroh",
    sections: [
      {
        type: "text",
        title: "🟢 Pengertian",
        content: "Isim Isyaroh (Kata Tunjuk) adalah Isim yang menunjukkan sesuatu, baik benda, orang mau pun tempat.",
      },
      {
        type: "text",
        title: "🟢 11 Huruf Isim Isyaroh",
        content: "Dalam kaidah Nahwu, Isim Isyaroh memiliki 11 Huruf diantaranya:",
      },
      {
        type: "text",
        title: "🟢 هٰذَا — Ini (Laki-laki)",
        content: "",
      },
      {
        type: "example",
        title: "Contoh هٰذَا",
        items: [
          { value: "هذا الذى كنتم به تدعون" },
          { value: "إن هذا لهو القصص الحق" },
          { value: "قالوا إن هذا لسحر مبين" },
        ],
      },
      {
        type: "text",
        title: "🟢 هٰذَانِ — Ini (Dua laki-laki)",
        content: "",
      },
      {
        type: "example",
        title: "Contoh هٰذَانِ",
        items: [
          { value: "قالوا إن هذان لساحران" },
          { value: "هذان خصمان اختصموا" },
        ],
      },
      {
        type: "text",
        title: "🟢 هٰذِهِ — Ini (Perempuan)",
        content: "",
      },
      {
        type: "example",
        title: "Contoh هٰذِهِ",
        items: [
          { value: "ولاتقربا هذه الشجرة فتكونا" },
          { value: "وهذه الانهار اجرى" },
          { value: "هذه جهنم التى كنتم توعدون" },
        ],
      },
      {
        type: "text",
        title: "🟢 هٰؤُلَاءِ — Mereka ini",
        content: "",
      },
      {
        type: "example",
        title: "Contoh هٰؤُلَاءِ",
        items: [
          { value: "إن هىؤلاء لضالون" },
          { value: "ويقولون هؤلاءشفعاءنا" },
          { value: "قال هؤلاءبناتى" },
          { value: "إن هؤلاء قوم لايؤمنون" },
        ],
      },
      {
        type: "text",
        title: "🟢 ذٰالِكَ — Itu (Laki-laki)",
        content: "",
      },
      {
        type: "example",
        title: "Contoh ذٰالِكَ",
        items: [
          { value: "ذلك الكتاب لاريب فيه" },
          { value: "كذلك يبين الله لكم" },
          { value: "وإنه على ذلك لشهيد" },
          { value: "وذلك دين القيمة" },
        ],
      },
      {
        type: "text",
        title: "🟢 ذٰانِكَ / ذَيـنِكَ — Itu (2 laki-laki)",
        content: "",
      },
      {
        type: "text",
        title: "🟢 أُولٰئِكَ — Mereka itu",
        content: "",
      },
      {
        type: "example",
        title: "Contoh أُولٰئِكَ",
        items: [
          { value: "فأولىٔك حبطت أعمالهم" },
          { value: "اولىٔك عليهم لعنت الله" },
          { value: "وعملوا الصالحات أولىٔك اصحاب الجنة" },
        ],
      },
      {
        type: "text",
        title: "🟢 تِلْكَ — Itu (Perempuan)",
        content: "",
      },
      {
        type: "example",
        title: "Contoh تِلْكَ",
        items: [
          { value: "تلك أمة قدخلت لها" },
          { value: "وتلك حدود الله يبينها" },
          { value: "تلك ايات الله نتلوها" },
        ],
      },
      {
        type: "text",
        title: "🟢 تَانِكَ / تَيْنِكَ — Itu (2 perempuan)",
        content: "",
      },
      {
        type: "text",
        title: "🟢 هٰهُنَا — Disini",
        content: "",
      },
      {
        type: "example",
        title: "Contoh هٰهُنَا",
        items: [
          { value: "أتتركون فيما ههنا امنين" },
          { value: "فليس له اليوم ههنا حميم" },
        ],
      },
      {
        type: "text",
        title: "🟢 هُنَا — Disini",
        content: "",
      },
      {
        type: "text",
        title: "🟢 هُنَالِكَ / ثَمَّ — Disana",
        content: "",
      },
      {
        type: "example",
        title: "Contoh هُنَالِكَ / ثَمَّ",
        items: [
          { value: "فغلبوا هنالك وانقلبوا" },
          { value: "هنالك تبلوا كل نفس" },
          { value: "فأينما تولوا فثم وجه الله" },
          { value: "وازلفنا ثم الأخرين" },
        ],
      },
      {
        type: "text",
        content: "Semua isim / kata pada Isim isyaroh hukum nya Mabni.",
      },
      {
        type: "alfiyah",
        title: "📖 Dasar Alfiyah — Kaidah Isim Isyaroh",
        alfiyahId: "alfiyah_006",
      },
      {
        type: "text",
        title: "🟢 Catatan Penting tentang Dhomir pada Isim Isyaroh",
        content: "Dhomir ك ، كما ، كم ... pada isim isyaroh ذالك ، ذالكما ، ذالكم menunjukkan مخاطب (orang yang diajak bicara) bukan menunjukkan مشاراليه (barang/orang yang di isyarohi).",
      },
      {
        type: "example",
        title: "Contoh Penjelasan",
        items: [
          { key: "ذلك الكتاب", value: "itu loh, satu kitab wahai kamu seorang laki-laki" },
          { key: "ذلكما الكتاب", value: "itu loh, satu kitab, wahai kamu 2 orang laki-laki" },
          { key: "ذنك الكتاب", value: "itu loh, 2 kitab, wahai kamu seorang laki-laki" },
          { key: "ذنكما الكتاب", value: "itu loh, 2 kitab, wahai kamu 2 orang laki-laki" },
        ],
      },
      {
        type: "text",
        content: "Contoh: ذلك الكتاب tidak boleh di baca ذٰلِكَ الكِتَابَ",
      },
    ],
  },

  // =====================
  // BAB 4 — ISIM MAUSHUL
  // =====================
  {
    id: "isim_maushul",
    title: "Bab 4 — Isim Maushul",
    sections: [
      {
        type: "text",
        title: "🟢 Pengertian",
        content: "Isim Maushul adalah Kata Penghubung.",
      },
      {
        type: "text",
        title: "🟢 Macam-macam Isim Maushul",
        content: "",
      },
      {
        type: "text",
        title: "🟢 الَّذِي — Orang yang / barang yang",
        content: "",
      },
      {
        type: "example",
        title: "Contoh الَّذِي",
        items: [
          { value: "الذى جعل لكم الأرض فراشا" },
          { value: "الذى خلقكم والذين من قبلكم" },
          { value: "الذى يؤتى ما له يتزكى" },
        ],
      },
      {
        type: "text",
        title: "🟢 اللَّذَانِ",
        content: "",
      },
      {
        type: "text",
        title: "🟢 الَّذِينَ — Orang-orang yang / Wong akeh, kang....",
        content: "",
      },
      {
        type: "example",
        title: "Contoh الَّذِينَ",
        items: [
          { value: "الذين يؤمنون بالغيب" },
          { value: "الذين يصدون عن سبيل الله" },
          { value: "الذين يكذبونبيوم الدين" },
          { value: "والذين يؤمنون بما أنزل إليك" },
          { value: "إن الذين امنوا" },
          { value: "إن الذين كفروا سواء" },
        ],
      },
      {
        type: "text",
        title: "🟢 الَّتِي — Barang/orang yang",
        content: "",
      },
      {
        type: "example",
        title: "Contoh الَّتِي",
        items: [
          { value: "عن القرية التى انعمت" },
          { value: "هذه النار التى كنتم بها" },
          { value: "والأغلال التى كانت عليهم" },
        ],
      },
      {
        type: "text",
        title: "🟢 اللَّتَانِ",
        content: "",
      },
      {
        type: "text",
        title: "🟢 اللَّاتِي / اللَّائِي — Wanita-wanita yang",
        content: "",
      },
      {
        type: "example",
        title: "Contoh اللَّاتِي",
        items: [
          { value: "وأمهاتكم اللاتى ارضعتكم" },
          { value: "فى نساىٔكم اللاتى دخلتم" },
          { value: "واللاتى تخافون نشوزهن" },
        ],
      },
      {
        type: "text",
        title: "🟢 مَنْ — Orang yang (ditandai dengan utawi)",
        content: "",
      },
      {
        type: "example",
        title: "Contoh مَنْ",
        items: [
          { value: "إلا من تاب وامن" },
          { value: "ومنهم من لم نقصص عليك" },
          { value: "و منكم مو يتوفى من قبل" },
        ],
      },
      {
        type: "text",
        title: "🟢 مَا — Barang yang (ditandai dengan Ing)",
        content: "",
      },
      {
        type: "example",
        title: "Contoh مَا",
        items: [
          { value: "ولا اناعابد ما تعبدون" },
          { value: "والذين يؤمنون بما أنزل إليك" },
          { value: "لا يكلف الله نفسا إلا ما اتاها" },
        ],
      },
      {
        type: "alfiyah",
        title: "📖 Dasar Alfiyah — Isim Maushul",
        alfiyahId: "alfiyah_007",
      },
      {
        type: "text",
        content: "Semua isim pada Isim Maushul hukum nya mabni.",
      },
      {
        type: "alfiyah",
        title: "📖 Dasar Alfiyah — Mabni Maushul",
        alfiyahId: "alfiyah_007b",
      },
      {
        type: "text",
        title: "🟢 Ketentuan Shilah",
        content: "Setelah isim maushul harus ada Shilah (penyambung), silah harus berupa kalimat (جملة) yang mengandung dhomir yang kembali kepada maushul yang sesuai.",
      },
      {
        type: "alfiyah",
        title: "📖 Dasar Alfiyah — Shilah",
        alfiyahId: "alfiyah_008",
      },
    ],
  },
];