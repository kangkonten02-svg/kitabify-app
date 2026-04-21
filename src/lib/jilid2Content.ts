import type { RichBab, AlfiyahEntry } from "./jilidContent";

export const JILID2_ALFIYAH_ENTRIES: AlfiyahEntry[] = [
  {
    id: "alfiyah_009",
    bab: "Tanda-tanda Isim",
    bait_arab: "اسْمًا وَفِعْلًا ثُمَّ حَرْفًا مَيِّزَا\nلَفْظًا بِمَا مِنَ العَلَامَةِ احْرِزَا",
    bait_latin: "Isman wa fi'lan tsumma harfan mayyiza\nLafzan bimaa minal 'alaamati uhriza",
    arti: "Bedakan isim, fi'il, dan huruf dengan tanda-tanda yang dimilikinya.",
    digunakan_di_materi: true,
  },
  {
    id: "alfiyah_010",
    bab: "Tanda-tanda Isim",
    bait_arab: "بِالجَرِّ وَالتَّنْوِينِ وَالنِّدَا وَأَلْ\nوَمُسْنَدِ لِلاسْمِ تَمْيِيزٌ حَصَلْ",
    bait_latin: "Bil jarri wat tanwiini wan nidaa wal\nWa musnadil ismi tamyiizun hashal",
    arti: "Isim dikenali dengan: Jar, Tanwin, Nida', Al, dan Musnad ilaih.",
    digunakan_di_materi: true,
  },
  {
    id: "alfiyah_011",
    bab: "Tanda-tanda Isim",
    bait_arab: "وَالاسْمُ قَدْ خُصِّصَ بِالجَرِّ كَمَا\nقَدْ خُصِّصَ الفِعْلُ بِأَنْ يَنْجَزِمَا",
    bait_latin: "Wal ismu qad khushshisha bil jarri kama\nQad khushshisha al fi'lu bi an yanjazima",
    arti: "Jar khusus untuk isim, sebagaimana jazm khusus untuk fi'il.",
    digunakan_di_materi: true,
  },
  {
    id: "alfiyah_012",
    bab: "Tanda-tanda Isim",
    bait_arab: "نُونَاتَلِي الإِعْرَابِ أَوْ تَنْوِينَا\nمِمَّا تُضَافُ احْذِفْ كَطُورِ سِينَا",
    bait_latin: "Nuuna tali al i'raabi aw tanwiina\nMimmaa tudhaafu ihdzif ka tuuri siinaa",
    arti: "Nun dan tanwin dibuang saat idhofah. Contoh: طُورِ سِينَا (Gunung Sinai).",
    digunakan_di_materi: true,
  },
  {
    id: "alfiyah_013",
    bab: "Tanda-tanda Isim",
    bait_arab: "وَابْنِ المُعَرَّفِ المُنَادَى المُفْرَدَا\nعَلَى الَّذِي فِي قَدْ عُهِدَا",
    bait_latin: "Wabnil ma'rifil munaadaa al mufradaa\n'Alalladzii fii qad 'uhidaa",
    arti: "Munada ma'rifat mufrod dibaca rofa' (dhommah) berdasarkan kaidah yang telah diketahui.",
    digunakan_di_materi: true,
  },
];

export const JILID2_CONTENT: RichBab[] = [
  {
    id: "tanda_isim",
    title: "Bab 1 — Tanda-tanda Isim",
    sections: [
      {
        type: "text",
        title: "🟢 Pengertian",
        content: "Dalam bahasa Arab, setiap kata (kalimah) terbagi menjadi 3 jenis:\n1. Isim → kata benda\n2. Fi'il → kata kerja\n3. Huruf → selain keduanya\n\nUntuk membedakannya, kita perlu mengetahui tanda-tanda masing-masing.",
      },
      {
        type: "alfiyah",
        title: "📖 Dasar Alfiyah 1 — Pembagian Kata",
        alfiyahId: "alfiyah_009",
      },
      {
        type: "alfiyah",
        title: "📖 Dasar Alfiyah 2 — Tanda Isim",
        alfiyahId: "alfiyah_010",
      },
      {
        type: "list",
        title: "📌 Ciri-ciri Isim (5 Tanda)",
        items: [
          { key: "1️⃣ Jar", value: "Bisa menerima jar (huruf jar, mudhof ilaih, mengikuti majrur)" },
          { key: "2️⃣ Tanwin", value: "Bisa menerima tanwin (ـٍ ـً ـٌ)" },
          { key: "3️⃣ Nida'", value: "Bisa dipanggil dengan يَا (ya)" },
          { key: "4️⃣ Al (ال)", value: "Bisa menerima alif lam di awal kata" },
          { key: "5️⃣ Musnad Ilaih", value: "Bisa menjadi fa'il atau mubtada'" },
        ],
      },
      {
        type: "alfiyah",
        title: "📖 Dasar Alfiyah 3 — Kekhususan Jar & Jazm",
        content: "Jar hanya untuk isim, jazm hanya untuk fi'il. Fi'il tidak menerima tanda isim, dan huruf diketahui dengan hafalan.",
        alfiyahId: "alfiyah_011",
      },
      {
        type: "text",
        title: "📌 Catatan Dhomir + Nida",
        content: "Jika isim setelah nida (يا):\n• هُوَ → أَنْتَ\n• هِيَ → أَنْتِ\n\nDhomir berubah dari orang ketiga ke orang kedua saat dipanggil.",
      },
      {
        type: "example",
        title: "📌 Contoh Isim (Jar)",
        items: [
          { key: "الرَّحْمٰنِ الرَّحِيمِ", value: "Keduanya majrur karena mengikuti lafadz sebelumnya" },
          { key: "مِمَّا رَزَقْنَاهُمْ يُنْفِقُونَ", value: "مِمَّا = مِنْ + مَا (nun dihapus, mim tasydid)" },
        ],
      },
      {
        type: "example",
        title: "📌 Mudhof & Mudhof Ilaih",
        items: [
          { key: "الْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ", value: "رَبِّ = mudhof, الْعَالَمِينَ = mudhof ilaih" },
          { key: "صِرَاطَ الَّذِينَ", value: "صِرَاطَ = mudhof, الَّذِينَ = mudhof ilaih" },
        ],
      },
      {
        type: "alfiyah",
        title: "📖 Dasar Alfiyah 4 — Idhofah",
        content: "Nun (tanda tatsniyah/jamak) dan tanwin dibuang saat terjadi idhofah.",
        alfiyahId: "alfiyah_012",
      },
      {
        type: "example",
        title: "📌 Tanwin",
        content: "Tanwin adalah tanda bahwa suatu kata adalah isim nakirah.",
        items: [
          { key: "حَاسِدٍ", value: "Kasratain — isim nakirah majrur" },
          { key: "غَاسِقٍ", value: "Kasratain — isim nakirah majrur" },
        ],
      },
      {
        type: "example",
        title: "📌 Nida (Munada)",
        content: "Nida = memanggil seseorang atau sesuatu dengan يَا.",
        items: [
          { key: "يَا اللهُ", value: "Memanggil Allah — munada ma'rifat mufrod" },
          { key: "يَا رَحْمٰنُ", value: "Memanggil Yang Maha Pengasih" },
        ],
      },
      {
        type: "alfiyah",
        title: "📖 Dasar Alfiyah 5 — Munada",
        content: "Munada ma'rifat mufrod dibaca rofa' (dhommah).",
        alfiyahId: "alfiyah_013",
      },
      {
        type: "example",
        title: "📌 Munada Mudhof",
        items: [
          { key: "يَا رَسُولَ اللهِ", value: "Munada mudhof — dibaca nashob (fathah)" },
        ],
      },
      {
        type: "example",
        title: "📌 Munada Syibh Mudhof",
        items: [
          { key: "يَا لَطِيفًا بِخَلْقِهِ", value: "Munada syibh mudhof — dibaca nashob (fathah)" },
        ],
      },
      {
        type: "text",
        title: "📌 Catatan",
        content: "اللّٰهُمَّ = يَا اللهُ\nHamzah washol bisa gugur di tengah kalimat.",
      },
    ],
  },
  {
    id: "macam_isim",
    title: "Bab 2 — Macam-macam Isim",
    sections: [
      {
        type: "text",
        title: "📌 Isim Nakirah",
        content: "Isim nakirah adalah isim umum (tidak spesifik).\n\nCiri:\n• Tanpa Al (ال)\n• Bisa menerima tanwin",
      },
      {
        type: "contoh_kalimat",
        title: "🟢 Contoh Isim Nakirah",
        items: [
          { key: "كِتَابٌ", value: "Sebuah buku (umum)" },
          { key: "رَجُلٌ", value: "Seorang laki-laki (umum)" },
          { key: "بَيْتٌ", value: "Sebuah rumah (umum)" },
        ],
      },
      {
        type: "ayat",
        title: "📌 Contoh Ayat — Isim Nakirah",
        items: [
          { key: "فَهُوَ فِى عِيشَةِِ رَاضِيَةِ", value: "Maka dia dalam kehidupan yang menyenangkan" },
          { key: "تِلْكَ أُمَّةٌ قَدْ خَلَتْ", value: "Itu adalah umat yang telah lalu" },
          { key: "قُلْ بَل مِلَّةَ إِبْرَاهِيمَ حَنِيفًا", value: "Katakanlah, bahkan (ikutilah) agama Ibrahim yang hanif" },
          { key: "فَأَثَرْنَ بِهِ نَقْعًا", value: "Maka menerbangkan debu dengannya" },
          { key: "لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِنْهُمْ", value: "Kami tidak membeda-bedakan seorang pun di antara mereka" },
        ],
      },
      {
        type: "list",
        title: "📌 Isim Ma'rifat (6 Jenis)",
        items: [
          { key: "1️⃣ Al (ال)", value: "الكِتَابُ — buku tertentu" },
          { key: "2️⃣ Nama", value: "مُحَمَّدٌ — nama orang" },
          { key: "3️⃣ Dhomir", value: "هُوَ — kata ganti" },
          { key: "4️⃣ Isyarah", value: "هٰذَا — kata tunjuk" },
          { key: "5️⃣ Maushul", value: "الَّذِي — kata penghubung" },
          { key: "6️⃣ Idhofah", value: "كِتَابُ الطَّالِبِ — buku milik murid" },
        ],
      },
      {
        type: "ayat",
        title: "📌 Contoh Ayat — Isim Ma'rifat dengan Al (ال)",
        items: [
          { key: "اَعُوذُ بِاللّٰهِ مِنَ الشَّيْطَانِ الرَّجِيمِ", value: "Aku berlindung kepada Allah dari setan yang terkutuk" },
          { key: "الرَّحْمٰنِ الرَّحِيمِ", value: "Yang Maha Pengasih lagi Maha Penyayang" },
          { key: "الْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ", value: "Segala puji bagi Allah, Tuhan seluruh alam" },
        ],
      },
      {
        type: "ayat",
        title: "📌 Contoh Ayat — Isim Ma'rifat dengan Nama (Alam)",
        items: [
          { key: "لِإِيْلَافِ قُرَيْشٍ", value: "Karena kebiasaan orang-orang Quraisy" },
          { key: "مُحَمَّدٌ رَسُولُ اللّٰهِ", value: "Muhammad adalah utusan Allah" },
          { key: "وَإِذْ قَالَ إِبْرَاهِيمُ", value: "Dan (ingatlah) ketika Ibrahim berkata" },
        ],
      },
      {
        type: "ayat",
        title: "📌 Contoh Ayat — Isim Ma'rifat dengan Dhomir",
        items: [
          { key: "وَإِذْ قَالَ رَبُّكَ لِلْمَلَائِكَةِ", value: "Dan (ingatlah) ketika Tuhanmu berfirman kepada para malaikat" },
          { key: "وَهُوَ السَّمِيعُ الْعَلِيمُ", value: "Dan Dia-lah Yang Maha Mendengar lagi Maha Mengetahui" },
          { key: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", value: "Dan tidak ada sesuatu pun yang setara dengan-Nya" },
        ],
      },
      {
        type: "ayat",
        title: "📌 Contoh Ayat — Isim Ma'rifat dengan Isyarah",
        items: [
          { key: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ", value: "Kitab (Al-Quran) itu tidak ada keraguan padanya" },
          { key: "أُولَٰئِكَ عَلَىٰ هُدًى", value: "Mereka itulah yang mendapat petunjuk" },
          { key: "هَٰذَا مَا وَعَدَ الرَّحْمَٰنُ", value: "Inilah yang dijanjikan (Allah) Yang Maha Pengasih" },
          { key: "تِلْكَ أُمَّةٌ قَدْ خَلَتْ", value: "Itu adalah umat yang telah lalu" },
        ],
      },
      {
        type: "ayat",
        title: "📌 Contoh Ayat — Isim Ma'rifat dengan Maushul",
        items: [
          { key: "الَّذِينَ يُؤْمِنُونَ", value: "(Yaitu) mereka yang beriman" },
          { key: "هُوَ الَّذِي جَعَلَ لَكُمْ", value: "Dialah yang menjadikan untuk kalian" },
          { key: "فَاتَّقُوا النَّارَ الَّتِي", value: "Maka peliharalah dirimu dari api (neraka) yang" },
        ],
      },
      {
        type: "text",
        title: "📌 Mudzakar & Muannats",
        content: "Mudzakar: isim untuk laki-laki\nMuannats: isim untuk perempuan\n\nTanda muannats:\n• Ta marbuthah (ة) — مُدَرِّسَةٌ\n• Alif maqshurah (ى) — كُبْرَى",
      },
      {
        type: "table",
        title: "📌 Isim Tatsniyah (Dual)",
        rows: [
          { label: "Rofa'", value: "ـَانِ (alif nun)" },
          { label: "Nashob/Jar", value: "ـَيْنِ (ya nun)" },
        ],
      },
      {
        type: "table",
        title: "📌 Jama' Mudzakar Salim",
        rows: [
          { label: "Rofa'", value: "ـُونَ (waw nun)" },
          { label: "Nashob/Jar", value: "ـِينَ (ya nun)" },
        ],
      },
    ],
  },
];
