import type { ContentSection, RichBab } from "./jilidContent";

export const SAFINAH_CONTENT: RichBab[] = [
  {
    id: "sa_pembukaan",
    title: "Pembukaan",
    sections: [
      { type: "kaidah", title: "📖 Muqaddimah", arabic: "اَلْحَمْدُ للهِ رَبِّ اُلْعَالَمِيْنَ\nوَبِهِ نَسْتَعِيْنُ عَلَى أُمُرِ اُلدُّنْيَا وَاُلدَّيْنِ", translation: "Segala puji hanya kepada Allah Tuhan semesta alam. Dan hanya kepada Allah kita memohon pertolongan untuk urusan dunia dan akhirat." },
    ],
  },
  {
    id: "sa_rukun_islam",
    title: "Rukun Islam",
    sections: [
      { type: "kaidah", title: "📖 Rukun Islam", arabic: "أَرْكَانُ اُلإِسْلامِ خَمْسَةٌ", translation: "Rukun Islam itu lima." },
      { type: "list", title: "Lima Rukun Islam", items: [
        { key: "شَهَادَةُ", value: "Bersaksi tiada tuhan selain Allah dan Muhammad utusan Allah" },
        { key: "إِقَامُ الصَّلاَةِ", value: "Mendirikan shalat" },
        { key: "إِيْتَاءُ الزَّكَاةِ", value: "Menunaikan zakat" },
        { key: "صَوْمُ رَمَضَانَ", value: "Puasa Ramadhan" },
        { key: "حَجُّ الْبَيْتِ", value: "Haji ke Baitullah bagi yang mampu" },
      ]},
    ],
  },
  {
    id: "sa_rukun_iman",
    title: "Rukun Iman",
    sections: [
      { type: "kaidah", title: "📖 Rukun Iman", arabic: "أَرْكَانُ الإِيْمَانِ سِتَّةٌ", translation: "Rukun iman itu enam." },
      { type: "list", title: "Enam Rukun Iman", items: [
        { key: "بِاللهِ", value: "Beriman kepada Allah" },
        { key: "وَمَلاَئِكَتِهِ", value: "Beriman kepada malaikat-Nya" },
        { key: "وَكُتُبِهِ", value: "Beriman kepada kitab-kitab-Nya" },
        { key: "وَرُسُلِهِ", value: "Beriman kepada rasul-rasul-Nya" },
        { key: "وَبِالْيَوْمِ الآخِرِ", value: "Beriman kepada hari akhir" },
        { key: "وَبِالْقَدَرِ", value: "Beriman kepada takdir baik & buruk" },
      ]},
    ],
  },
  {
    id: "sa_baligh",
    title: "Tanda-tanda Baligh",
    sections: [
      { type: "kaidah", title: "📖 Tanda Baligh", arabic: "عَلاَمَاتُ الْبُلُوْغِ ثَلاَثٌ", translation: "Tanda-tanda baligh itu ada tiga." },
      { type: "list", title: "Tiga Tanda Baligh", items: [
        { key: "١", value: "Berumur 15 tahun (laki-laki dan perempuan)" },
        { key: "٢", value: "Bermimpi (ihtilam) — laki-laki & perempuan, setelah umur 9 tahun" },
        { key: "٣", value: "Haidh — perempuan, setelah umur 9 tahun" },
      ]},
    ],
  },
  {
    id: "sa_wudhu",
    title: "Fardhu-fardhu Wudhu",
    sections: [
      { type: "kaidah", title: "📖 Fardhu Wudhu", arabic: "فُرُوْضُ الْوُضُوْءِ سِتَّةٌ", translation: "Fardhu-fardhu wudhu ada enam." },
      { type: "list", title: "Enam Fardhu Wudhu", items: [
        { key: "النِّيَّةُ", value: "Niat" },
        { key: "غَسْلُ الْوَجْهِ", value: "Membasuh muka" },
        { key: "غَسْلُ الْيَدَيْنِ", value: "Membasuh kedua tangan serta siku" },
        { key: "مَسْحُ الرَّأْسِ", value: "Mengusap sebagian kepala" },
        { key: "غَسْلُ الرِّجْلَيْنِ", value: "Membasuh kedua kaki serta buku lali" },
        { key: "التَّرْتِيْبُ", value: "Tertib (berurutan)" },
      ]},
      { type: "text", title: "Pengertian Niat", content: "Niat adalah menginginkan sesuatu seraya bersamaan dengan pekerjaannya. Tempatnya niat adalah hati. Mengucapkan niat itu sunnah. Waktunya niat adalah ketika membasuh awal bagian wajah." },
    ],
  },
  {
    id: "sa_naqidh_wudhu",
    title: "Pembatal Wudhu",
    sections: [
      { type: "kaidah", title: "📖 Pembatal Wudhu", arabic: "نَوَاقِضُ الْوُضُوْءِ أَرْبَعَةُ أَشْيَاءَ", translation: "Perkara yang membatalkan wudhu itu empat perkara." },
      { type: "list", title: "Empat Pembatal Wudhu", items: [
        { key: "١", value: "Sesuatu yang keluar dari qubul atau dubur (kecuali mani)" },
        { key: "٢", value: "Hilangnya akal karena tidur atau lainnya" },
        { key: "٣", value: "Bertemunya kulit laki-laki dan perempuan ajnabi tanpa penghalang" },
        { key: "٤", value: "Memegang kemaluan manusia dengan telapak tangan" },
      ]},
    ],
  },
  {
    id: "sa_mandi",
    title: "Yang Mewajibkan Mandi",
    sections: [
      { type: "kaidah", title: "📖 Mewajibkan Mandi", arabic: "مُوْجِبَاتُ الْغُسْلِ سِتَّةٌ", translation: "Perkara yang mewajibkan mandi itu ada enam." },
      { type: "list", title: "Enam Perkara", items: [
        { key: "١", value: "Memasukkan kemaluan ke farji" },
        { key: "٢", value: "Keluarnya mani" },
        { key: "٣", value: "Haidh" },
        { key: "٤", value: "Nifas" },
        { key: "٥", value: "Melahirkan" },
        { key: "٦", value: "Mati" },
      ]},
      { type: "text", title: "Fardhu Mandi", content: "Fardhu mandi itu dua: niat dan meratakan air ke seluruh badan." },
    ],
  },
  {
    id: "sa_syarat_wudhu",
    title: "Syarat-syarat Wudhu",
    sections: [
      { type: "kaidah", title: "📖 Syarat Wudhu", arabic: "شُرُوْطُ الْوُضُوْءِ عَشَرَةٌ", translation: "Syarat-syarat wudhu itu ada sepuluh." },
      { type: "list", title: "Sepuluh Syarat Wudhu", items: [
        { key: "١", value: "Islam" },
        { key: "٢", value: "Tamyiz" },
        { key: "٣", value: "Suci dari haidh dan nifas" },
        { key: "٤", value: "Tidak ada penghalang sampainya air ke kulit" },
        { key: "٥", value: "Tidak ada yang mengubah air pada anggota tubuh" },
        { key: "٦", value: "Mengetahui kefardhuannya" },
        { key: "٧", value: "Tidak menganggap fardhu sebagai sunnah" },
        { key: "٨", value: "Air suci (thahur)" },
        { key: "٩", value: "Masuknya waktu" },
        { key: "١٠", value: "Muwalah (berkesinambungan) bagi yang selalu berhadats" },
      ]},
    ],
  },
  {
    id: "sa_najis",
    title: "Bab Najis",
    sections: [
      { type: "text", title: "Macam-macam Najis", content: "Najis itu ada tiga macam: Mughalladzah (berat), Mukhaffafah (ringan), dan Mutawassithah (sedang)." },
      { type: "grid", title: "Tiga Macam Najis", items: [
        { key: "مُغَلَّظَةٌ", value: "Mughalladzah — najis anjing & babi" },
        { key: "مُخَفَّفَةٌ", value: "Mukhaffafah — kencing bayi laki-laki" },
        { key: "مُتَوَسِّطَةٌ", value: "Mutawassithah — selain keduanya" },
      ]},
      { type: "text", content: "Najis mughalladzah: suci dengan 7 basuhan, salah satunya dengan tanah.\nNajis mukhaffafah: suci dengan memercikkan air.\nNajis mutawassithah: terbagi dua — 'ainiyyah (punya warna/bau/rasa) dan hukmiyyah (tidak punya tanda)." },
    ],
  },
  {
    id: "sa_haidh",
    title: "Bab Haidh & Nifas",
    sections: [
      { type: "table", title: "Haidh", rows: [
        { label: "Paling sedikit", value: "Sehari semalam" },
        { label: "Biasanya", value: "6 atau 7 hari" },
        { label: "Paling banyak", value: "15 hari" },
      ]},
      { type: "table", title: "Suci antara dua Haidh", rows: [
        { label: "Paling sedikit", value: "15 hari" },
        { label: "Biasanya", value: "23 atau 24 hari" },
        { label: "Paling banyak", value: "Tidak ada batas" },
      ]},
      { type: "table", title: "Nifas", rows: [
        { label: "Paling sedikit", value: "Sekali keluar" },
        { label: "Biasanya", value: "40 hari" },
        { label: "Paling banyak", value: "60 hari" },
      ]},
    ],
  },
  {
    id: "sa_shalat",
    title: "Syarat-syarat Shalat",
    sections: [
      { type: "kaidah", title: "📖 Syarat Shalat", arabic: "شُرُوْطُ الصَّلاَةِ ثَمَانِيَةٌ", translation: "Syarat-syarat shalat itu delapan." },
      { type: "list", title: "Delapan Syarat Shalat", items: [
        { key: "١", value: "Suci dari dua hadats" },
        { key: "٢", value: "Suci dari najis di pakaian, badan, dan tempat" },
        { key: "٣", value: "Menutup aurat" },
        { key: "٤", value: "Menghadap kiblat" },
        { key: "٥", value: "Masuknya waktu" },
        { key: "٦", value: "Mengetahui kefardhuannya" },
        { key: "٧", value: "Tidak menganggap fardhu sebagai sunnah" },
        { key: "٨", value: "Menjauhi pembatal shalat" },
      ]},
    ],
  },
  {
    id: "sa_rukun_shalat",
    title: "Rukun Shalat",
    sections: [
      { type: "text", title: "Rukun Shalat", content: "Rukun shalat ada tujuh belas." },
      { type: "list", title: "17 Rukun Shalat", items: [
        { key: "١", value: "Niat" },
        { key: "٢", value: "Takbiratul ihram" },
        { key: "٣", value: "Berdiri bagi yang mampu (shalat fardhu)" },
        { key: "٤", value: "Membaca Al-Fatihah" },
        { key: "٥", value: "Ruku'" },
        { key: "٦", value: "Thuma'ninah dalam ruku'" },
        { key: "٧", value: "I'tidal (berdiri dari ruku')" },
        { key: "٨", value: "Thuma'ninah dalam i'tidal" },
        { key: "٩", value: "Sujud dua kali" },
        { key: "١٠", value: "Thuma'ninah dalam sujud" },
        { key: "١١", value: "Duduk di antara dua sujud" },
        { key: "١٢", value: "Thuma'ninah dalam duduk" },
        { key: "١٣", value: "Tasyahud akhir" },
        { key: "١٤", value: "Duduk tasyahud akhir" },
        { key: "١٥", value: "Shalawat atas Nabi ﷺ dalam tasyahud akhir" },
        { key: "١٦", value: "Salam" },
        { key: "١٧", value: "Tertib (berurutan)" },
      ]},
    ],
  },
  {
    id: "sa_pembatal_shalat",
    title: "Yang Membatalkan Shalat",
    sections: [
      { type: "text", title: "Pembatal Shalat", content: "Shalat batal karena 14 keadaan." },
      { type: "list", title: "14 Pembatal Shalat", items: [
        { key: "١", value: "Berhadats" },
        { key: "٢", value: "Kejatuhan najis yang tidak dibuang seketika" },
        { key: "٣", value: "Terbukanya aurat yang tidak ditutup seketika" },
        { key: "٤", value: "Mengucapkan 2 huruf atau 1 huruf yang bermakna (sengaja)" },
        { key: "٥", value: "Melakukan pembatal puasa (sengaja)" },
        { key: "٦", value: "Makan banyak dalam keadaan lupa" },
        { key: "٧", value: "3 gerakan berturut-turut (walau lupa)" },
        { key: "٨", value: "Lompatan yang buruk" },
        { key: "٩", value: "Pukulan keras berlebihan" },
        { key: "١٠", value: "Menambah satu rukun fi'li (sengaja)" },
        { key: "١١", value: "Mendahului imam 2 rukun fi'li tanpa uzur" },
        { key: "١٢", value: "Berniat membatalkan shalat" },
        { key: "١٣", value: "Menggantungkan pembatalan pada suatu keadaan" },
        { key: "١٤", value: "Bimbang antara meneruskan atau membatalkan" },
      ]},
    ],
  },
  {
    id: "sa_waktu_shalat",
    title: "Waktu-waktu Shalat",
    sections: [
      { type: "table", title: "Lima Waktu Shalat", rows: [
        { label: "Zhuhur", value: "Tergelincir matahari — bayangan seukuran benda" },
        { label: "Ashar", value: "Bayangan seukuran benda + sedikit — terbenam matahari" },
        { label: "Maghrib", value: "Terbenam matahari — hilang mega merah" },
        { label: "Isya'", value: "Hilang mega merah — terbit fajar shadiq" },
        { label: "Subuh", value: "Terbit fajar shadiq — terbit matahari" },
      ]},
    ],
  },
  {
    id: "sa_sujud_sahwi",
    title: "Sujud Sahwi",
    sections: [
      { type: "text", title: "Sebab Sujud Sahwi", content: "Sebab disunahkannya sujud sahwi ada empat." },
      { type: "list", title: "Empat Sebab", items: [
        { key: "١", value: "Tidak melakukan sunah ab'adh atau sebagiannya" },
        { key: "٢", value: "Melakukan perbuatan yang jika sengaja membatalkan" },
        { key: "٣", value: "Menempatkan rukun qauli bukan pada tempatnya" },
        { key: "٤", value: "Mengerjakan rukun fi'li yang mungkin lebih" },
      ]},
    ],
  },
  {
    id: "sa_jenazah",
    title: "Bab Jenazah",
    sections: [
      { type: "text", title: "Kewajiban terhadap Mayat", content: "Yang wajib atas orang muslim terhadap mayat ada empat: memandikan, mengafani, menyalati, dan menguburkan." },
      { type: "list", title: "Rukun Shalat Jenazah (7)", items: [
        { key: "١", value: "Niat" },
        { key: "٢", value: "Empat takbir" },
        { key: "٣", value: "Berdiri bagi yang mampu" },
        { key: "٤", value: "Membaca Al-Fatihah" },
        { key: "٥", value: "Shalawat atas Nabi ﷺ setelah takbir kedua" },
        { key: "٦", value: "Doa bagi mayat setelah takbir ketiga" },
        { key: "٧", value: "Salam" },
      ]},
    ],
  },
  {
    id: "sa_zakat",
    title: "Bab Zakat",
    sections: [
      { type: "text", title: "Harta yang Wajib Dizakati", content: "Harta-harta yang wajib dikeluarkan zakatnya ada enam macam." },
      { type: "list", title: "Enam Macam Harta Zakat", items: [
        { key: "١", value: "Peternakan (unta, sapi, kambing)" },
        { key: "٢", value: "Emas" },
        { key: "٣", value: "Perak" },
        { key: "٤", value: "Tumbuh-tumbuhan (hasil bumi)" },
        { key: "٥", value: "Harta perniagaan (2,5%)" },
        { key: "٦", value: "Harta timbunan (rikaz)" },
      ]},
    ],
  },
  {
    id: "sa_puasa",
    title: "Bab Puasa",
    sections: [
      { type: "text", title: "Syarat Sah Puasa", content: "Syarat sah puasa ada empat: Islam, berakal, suci dari haidh, dan mengetahui waktu yang sah untuk berpuasa." },
      { type: "list", title: "Rukun Puasa (3)", items: [
        { key: "١", value: "Niat setiap malam untuk puasa fardhu" },
        { key: "٢", value: "Meninggalkan pembatal puasa dalam keadaan sadar" },
        { key: "٣", value: "Orang yang berpuasa (bukan orang gila, dll)" },
      ]},
      { type: "list", title: "Pembatal Puasa", items: [
        { key: "١", value: "Murtad" },
        { key: "٢", value: "Haidh" },
        { key: "٣", value: "Nifas" },
        { key: "٤", value: "Melahirkan" },
        { key: "٥", value: "Gila (walau sekejap)" },
        { key: "٦", value: "Pingsan/mabuk sengaja sepanjang hari" },
      ]},
    ],
  },
];
