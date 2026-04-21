import type { ContentSection, RichBab } from "./jilidContent";

export const JURUMIYAH_CONTENT: RichBab[] = [
  {
    id: "ju_kalam",
    title: "Bab Kalam",
    sections: [
      { type: "text", title: "Pengertian Kalam", content: "Kalam menurut ahli nahwu adalah lafadz yang tersusun dan berfaedah (bermakna) secara sengaja. Kalam terdiri dari tiga unsur: Isim (kata benda), Fi'il (kata kerja), dan Huruf (kata bantu)." },
      { type: "kaidah", title: "📖 Definisi Kalam", arabic: "اَلْكَلاَمُ هُوَ اللَّفْظُ الْمُرَكَّبُ الْمُفِيْدُ بِالْوَضْعِ", translation: "Kalam adalah lafadz yang tersusun, berfaedah, dan disengaja." },
      { type: "list", title: "Bagian-bagian Kalam", items: [
        { key: "اِسْمٌ", value: "Isim (kata benda)" },
        { key: "فِعْلٌ", value: "Fi'il (kata kerja)" },
        { key: "حَرْفٌ", value: "Huruf (kata bantu)" },
      ]},
      { type: "example", title: "Contoh Kalam", items: [
        { key: "قَامَ زَيْدٌ", value: "Zaid berdiri — kalam sempurna (fi'il + isim)" },
        { key: "زَيْدٌ قَائِمٌ", value: "Zaid yang berdiri — kalam sempurna (isim + isim)" },
      ]},
    ],
  },
  {
    id: "ju_isim",
    title: "Bab Isim",
    sections: [
      { type: "text", title: "Pengertian Isim", content: "Isim adalah kata yang menunjukkan makna pada dirinya sendiri dan tidak disertai dengan waktu (zaman). Isim dikenali dengan beberapa tanda." },
      { type: "kaidah", title: "📖 Definisi Isim", arabic: "فَالاِسْمُ يُعْرَفُ بِالْخَفْضِ وَالتَّنْوِيْنِ وَدُخُوْلِ الأَلِفِ وَاللاَّمِ وَحُرُوْفِ الْخَفْضِ", translation: "Isim dikenali dengan jar (khafadh), tanwin, kemasukan alif lam, dan huruf jar." },
      { type: "list", title: "Tanda-tanda Isim", items: [
        { key: "الخَفْضُ", value: "Jar (kasrah di akhir kata)" },
        { key: "التَّنْوِيْنُ", value: "Tanwin (bunyi -n di akhir)" },
        { key: "الْ", value: "Alif Lam (awalan al-)" },
        { key: "حُرُوْفُ الْخَفْضِ", value: "Huruf Jar" },
      ]},
      { type: "kaidah", title: "📖 Huruf Jar", arabic: "وَهِيَ: مِنْ وَإِلَى وَعَنْ وَعَلَى وَفِي وَرُبَّ وَالْبَاءُ وَالْكَافُ وَالَّلامُ وَحُرُوْفُ الْقَسَمِ وَهِيَ: الْوَاوُ وَالْبَاءُ وَالتَّاءُ", translation: "Huruf jar: min, ila, 'an, 'ala, fi, rubba, ba, kaf, lam, dan huruf qasam: waw, ba, ta." },
      { type: "contoh_kalimat", title: "📌 Contoh Isim", items: [
        { key: "جَاءَ مُحَمَّدٌ", value: "Muhammad datang (tanwin = tanda isim)" },
        { key: "فِي الْمَسْجِدِ", value: "Di masjid (al- dan jar = tanda isim)" },
        { key: "مِنَ الْبَيْتِ", value: "Dari rumah (huruf jar min)" },
      ]},
    ],
  },
  {
    id: "ju_fiil",
    title: "Bab Fi'il",
    sections: [
      { type: "text", title: "Pengertian Fi'il", content: "Fi'il adalah kata yang menunjukkan makna pada dirinya sendiri dan disertai dengan waktu (zaman). Fi'il terbagi menjadi tiga: Madhi (lampau), Mudhari' (sekarang/akan datang), dan Amr (perintah)." },
      { type: "kaidah", title: "📖 Definisi Fi'il", arabic: "وَالْفِعْلُ يُعْرَفُ بِقَدْ وَالسِّيْنِ وَسَوْفَ وَتَاءِ التَّأْنِيْثِ السَّاكِنَةِ", translation: "Fi'il dikenali dengan qad, sin, saufa, dan ta' ta'nits sakinah." },
      { type: "list", title: "Tanda-tanda Fi'il", items: [
        { key: "قَدْ", value: "Qad (sungguh/telah)" },
        { key: "السِّيْنُ", value: "Sin (akan)" },
        { key: "سَوْفَ", value: "Saufa (akan)" },
        { key: "تَاءُ التَّأْنِيْثِ", value: "Ta' ta'nits sakinah" },
      ]},
      { type: "grid", title: "Pembagian Fi'il", items: [
        { key: "مَاضٍ", value: "Madhi (lampau)" },
        { key: "مُضَارِعٌ", value: "Mudhari' (sekarang)" },
        { key: "أَمْرٌ", value: "Amr (perintah)" },
      ]},
      { type: "kaidah", title: "📖 Fi'il Madhi", arabic: "فَالْمَاضِي مَفْتُوْحُ الآخِرِ أَبَدًا", translation: "Fi'il madhi selamanya berharokat fathah di akhirnya." },
      { type: "kaidah", title: "📖 Fi'il Mudhari'", arabic: "وَالْمُضَارِعُ مَا كَانَ فِي أَوَّلِهِ إِحْدَى الزَّوَائِدِ الأَرْبَعِ يَجْمَعُهَا قَوْلُكَ أَنَيْتُ", translation: "Fi'il mudhari' diawali salah satu dari 4 huruf tambahan yang terkumpul dalam kata: أَنَيْتُ." },
      { type: "kaidah", title: "📖 Fi'il Amr", arabic: "وَالأَمْرُ مَجْزُومُ الآخِرِ أَبَدًا", translation: "Fi'il amr selamanya berharokat jazm (sukun) di akhirnya." },
      { type: "contoh_kalimat", title: "📌 Contoh Fi'il", items: [
        { key: "كَتَبَ", value: "Dia telah menulis (fi'il madhi)" },
        { key: "يَكْتُبُ", value: "Dia sedang menulis (fi'il mudhari')" },
        { key: "اُكْتُبْ", value: "Tulislah! (fi'il amr)" },
        { key: "قَدْ كَتَبَ", value: "Sungguh dia telah menulis (qad = tanda fi'il)" },
      ]},
    ],
  },
  {
    id: "ju_huruf",
    title: "Bab Huruf",
    sections: [
      { type: "text", title: "Pengertian Huruf", content: "Huruf adalah kata yang tidak menunjukkan makna kecuali jika digabungkan dengan kata lain. Huruf tidak memiliki tanda khusus seperti isim dan fi'il." },
      { type: "kaidah", title: "📖 Definisi Huruf", arabic: "وَالْحَرْفُ مَا لاَ يَصْلُحُ مَعَهُ دَلِيْلُ الاِسْمِ وَلاَ دَلِيْلُ الْفِعْلِ", translation: "Huruf adalah yang tidak cocok padanya tanda isim dan tanda fi'il." },
      { type: "example", title: "Contoh Huruf", items: [
        { key: "هَلْ", value: "Apakah (huruf istifham)" },
        { key: "لَمْ", value: "Tidak/belum (huruf jazm)" },
        { key: "إِنَّ", value: "Sesungguhnya (huruf taukid)" },
        { key: "مِنْ", value: "Dari (huruf jar)" },
      ]},
    ],
  },
  {
    id: "ju_irab",
    title: "Bab I'rab",
    sections: [
      { type: "text", title: "Pengertian I'rab", content: "I'rab adalah perubahan akhir kata karena perbedaan amil (faktor) yang masuk padanya, baik secara lafadz maupun secara takdir (perkiraan)." },
      { type: "kaidah", title: "📖 Definisi I'rab", arabic: "اَلإِعْرَابُ هُوَ تَغْيِيْرُ أَوَاخِرِ الْكَلِمِ لاِخْتِلاَفِ الْعَوَامِلِ الدَّاخِلَةِ عَلَيْهَا لَفْظًا أَوْ تَقْدِيْرًا", translation: "I'rab adalah perubahan akhir kata karena perbedaan amil yang masuk padanya, secara lafadz atau takdir." },
      { type: "grid", title: "Macam-macam I'rab", items: [
        { key: "رَفْعٌ", value: "Rafa' (dhammah)" },
        { key: "نَصْبٌ", value: "Nashab (fathah)" },
        { key: "خَفْضٌ", value: "Khafadh/Jar (kasrah)" },
        { key: "جَزْمٌ", value: "Jazm (sukun)" },
      ]},
      { type: "kaidah", title: "📖 Pembagian I'rab", arabic: "وَأَقْسَامُهُ أَرْبَعَةٌ: رَفْعٌ وَنَصْبٌ وَخَفْضٌ وَجَزْمٌ", translation: "I'rab terbagi empat: rafa', nashab, khafadh, dan jazm." },
      { type: "text", content: "Isim memiliki 3 i'rab: rafa', nashab, dan jar. Sedangkan fi'il memiliki 3 i'rab: rafa', nashab, dan jazm. Huruf tidak memiliki i'rab." },
    ],
  },
  {
    id: "ju_marfuat",
    title: "Bab Tanda I'rab (Alamat)",
    sections: [
      { type: "text", title: "Tanda-tanda I'rab", content: "Tanda i'rab ada yang asli dan ada yang cabang (pengganti). Tanda asli: dhammah (rafa'), fathah (nashab), kasrah (jar), sukun (jazm)." },
      { type: "kaidah", title: "📖 Tanda Rafa'", arabic: "فَأَمَّا الرَّفْعُ فَلَهُ أَرْبَعُ عَلاَمَاتٍ: الضَّمَّةُ وَالْوَاوُ وَالأَلِفُ وَالنُّوْنُ", translation: "Rafa' memiliki 4 tanda: dhammah, wawu, alif, dan nun." },
      { type: "table", title: "Tanda Rafa'", rows: [
        { label: "الضَّمَّةُ", value: "Dhammah — tanda asli rafa'" },
        { label: "الوَاوُ", value: "Wawu — pada jama' mudzakkar salim & asma'ul khamsah" },
        { label: "الأَلِفُ", value: "Alif — pada isim tatsniyah" },
        { label: "النُّوْنُ", value: "Nun — pada af'alul khamsah" },
      ]},
      { type: "kaidah", title: "📖 Tanda Nashab", arabic: "وَأَمَّا النَّصْبُ فَلَهُ خَمْسُ عَلاَمَاتٍ: الْفَتْحَةُ وَالأَلِفُ وَالْكَسْرَةُ وَالْيَاءُ وَحَذْفُ النُّوْنِ", translation: "Nashab memiliki 5 tanda: fathah, alif, kasrah, ya', dan buang nun." },
      { type: "table", title: "Tanda Nashab", rows: [
        { label: "الفَتْحَةُ", value: "Fathah — tanda asli nashab" },
        { label: "الأَلِفُ", value: "Alif — pada asma'ul khamsah" },
        { label: "الكَسْرَةُ", value: "Kasrah — pada jama' muannats salim" },
        { label: "اليَاءُ", value: "Ya' — pada tatsniyah & jama' mudzakkar salim" },
        { label: "حَذْفُ النُّوْنِ", value: "Buang nun — pada af'alul khamsah" },
      ]},
      { type: "kaidah", title: "📖 Tanda Jar", arabic: "وَأَمَّا الْخَفْضُ فَلَهُ ثَلاَثُ عَلاَمَاتٍ: الْكَسْرَةُ وَالْيَاءُ وَالْفَتْحَةُ", translation: "Jar memiliki 3 tanda: kasrah, ya', dan fathah." },
      { type: "kaidah", title: "📖 Tanda Jazm", arabic: "وَأَمَّا الْجَزْمُ فَلَهُ عَلاَمَتَانِ: السُّكُوْنُ وَالْحَذْفُ", translation: "Jazm memiliki 2 tanda: sukun dan buang huruf." },
    ],
  },
  {
    id: "ju_murab_mabni",
    title: "Bab Mu'rab dan Mabni",
    sections: [
      { type: "text", title: "Mu'rab dan Mabni", content: "Kata dalam bahasa Arab ada yang mu'rab (berubah akhirnya) dan ada yang mabni (tetap akhirnya). Isim ada yang mu'rab dan ada yang mabni. Fi'il juga demikian." },
      { type: "kaidah", title: "📖 Mu'rab", arabic: "الْمُعْرَبَاتُ قِسْمَانِ: قِسْمٌ يُعْرَبُ بِالْحَرَكَاتِ وَقِسْمٌ يُعْرَبُ بِالْحُرُوْفِ", translation: "Kata mu'rab ada dua: yang i'rabnya dengan harakat dan yang i'rabnya dengan huruf." },
      { type: "grid", title: "Isim Mabni", items: [
        { key: "الضَّمَائِرُ", value: "Dhamir (kata ganti)" },
        { key: "أَسْمَاءُ الإِشَارَةِ", value: "Isim isyarah" },
        { key: "أَسْمَاءُ الْمَوْصُوْلِ", value: "Isim maushul" },
        { key: "أَسْمَاءُ الاِسْتِفْهَامِ", value: "Isim istifham" },
      ]},
    ],
  },
  {
    id: "ju_nakirah_marifah",
    title: "Bab Nakirah dan Ma'rifah",
    sections: [
      { type: "text", title: "Nakirah dan Ma'rifah", content: "Isim terbagi menjadi nakirah (umum) dan ma'rifah (khusus/tertentu). Nakirah adalah isim yang menunjukkan sesuatu yang tidak tertentu. Ma'rifah adalah isim yang menunjukkan sesuatu yang tertentu." },
      { type: "kaidah", title: "📖 Definisi", arabic: "النَّكِرَةُ: كُلُّ اسْمٍ شَائِعٍ فِي جِنْسِهِ لاَ يَخْتَصُّ بِهِ وَاحِدٌ دُوْنَ آخَرَ", translation: "Nakirah adalah setiap isim yang umum dalam jenisnya, tidak khusus pada satu tanpa yang lain." },
      { type: "list", title: "Macam-macam Ma'rifah", items: [
        { key: "الضَّمِيْرُ", value: "Dhamir (kata ganti)" },
        { key: "العَلَمُ", value: "'Alam (nama)" },
        { key: "اسْمُ الإِشَارَةِ", value: "Isim Isyarah (kata tunjuk)" },
        { key: "اسْمُ الْمَوْصُوْلِ", value: "Isim Maushul (kata sambung)" },
        { key: "المُعَرَّفُ بِالْ", value: "Yang berimbuhan Al" },
        { key: "المُضَافُ", value: "Yang di-idhafah-kan" },
      ]},
      { type: "contoh_kalimat", title: "📌 Contoh", items: [
        { key: "رَجُلٌ", value: "Seorang laki-laki (nakirah)" },
        { key: "الرَّجُلُ", value: "Laki-laki itu (ma'rifah dengan al-)" },
        { key: "مُحَمَّدٌ", value: "Muhammad (ma'rifah dengan 'alam)" },
      ]},
    ],
  },
  {
    id: "ju_mubtada_khabar",
    title: "Bab Mubtada' dan Khabar",
    sections: [
      { type: "text", title: "Mubtada' dan Khabar", content: "Mubtada' adalah isim yang dirafa'kan, tidak didahului oleh amil lafadzi. Khabar adalah isim yang dirafa'kan, yang disandarkan kepada mubtada'." },
      { type: "kaidah", title: "📖 Definisi Mubtada'", arabic: "اَلْمُبْتَدَأُ هُوَ الاِسْمُ الْمَرْفُوْعُ الْعَارِي عَنِ الْعَوَامِلِ اللَّفْظِيَّةِ", translation: "Mubtada' adalah isim yang dirafa'kan, kosong dari amil-amil lafadzi." },
      { type: "kaidah", title: "📖 Definisi Khabar", arabic: "وَالْخَبَرُ هُوَ الاِسْمُ الْمَرْفُوْعُ الْمُسْنَدُ إِلَيْهِ", translation: "Khabar adalah isim yang dirafa'kan, yang disandarkan kepadanya." },
      { type: "grid", title: "Macam Khabar", items: [
        { key: "مُفْرَدٌ", value: "Khabar Mufrad" },
        { key: "جُمْلَةٌ", value: "Khabar Jumlah" },
        { key: "شِبْهُ جُمْلَةٍ", value: "Khabar Syibhul Jumlah" },
      ]},
      { type: "contoh_kalimat", title: "📌 Contoh", items: [
        { key: "زَيْدٌ قَائِمٌ", value: "Zaid berdiri (mubtada' + khabar mufrad)" },
        { key: "زَيْدٌ أَبُوْهُ قَائِمٌ", value: "Zaid ayahnya berdiri (khabar jumlah)" },
        { key: "زَيْدٌ فِي الدَّارِ", value: "Zaid di rumah (khabar syibhul jumlah)" },
      ]},
    ],
  },
  {
    id: "ju_awamil",
    title: "Bab Amil-amil yang Masuk pada Mubtada' dan Khabar",
    sections: [
      { type: "text", title: "Kaana dan Saudara-saudaranya", content: "Kaana dan saudara-saudaranya adalah fi'il naqish yang masuk pada mubtada' dan khabar. Merafa'kan mubtada' (disebut isim kaana) dan menashabkan khabar (disebut khabar kaana)." },
      { type: "kaidah", title: "📖 Kaana wa Akhwatuha", arabic: "كَانَ وَأَمْسَى وَأَصْبَحَ وَأَضْحَى وَظَلَّ وَبَاتَ وَصَارَ وَلَيْسَ وَمَا زَالَ وَمَا انْفَكَّ وَمَا فَتِئَ وَمَا بَرِحَ وَمَا دَامَ", translation: "Kaana, amsa, ashbaha, adhha, zhalla, baata, shaara, laisa, maa zaala, maa infakka, maa fati'a, maa bariha, maa daama." },
      { type: "contoh_kalimat", title: "📌 Contoh", items: [
        { key: "كَانَ زَيْدٌ قَائِمًا", value: "Zaid adalah berdiri (isim kaana rafa', khabar kaana nashab)" },
        { key: "لَيْسَ الأَمْرُ سَهْلًا", value: "Perkara itu tidaklah mudah" },
      ]},
      { type: "text", title: "Inna dan Saudara-saudaranya", content: "Inna dan saudara-saudaranya menashabkan mubtada' (disebut isim inna) dan merafa'kan khabar (disebut khabar inna)." },
      { type: "kaidah", title: "📖 Inna wa Akhwatuha", arabic: "إِنَّ وَأَنَّ وَكَأَنَّ وَلَكِنَّ وَلَيْتَ وَلَعَلَّ", translation: "Inna, anna, ka'anna, lakinna, laita, la'alla." },
      { type: "contoh_kalimat", title: "📌 Contoh", items: [
        { key: "إِنَّ زَيْدًا قَائِمٌ", value: "Sesungguhnya Zaid berdiri" },
        { key: "لَيْتَ الشَّبَابَ يَعُوْدُ", value: "Andai masa muda kembali" },
      ]},
    ],
  },
  {
    id: "ju_fail",
    title: "Bab Fa'il",
    sections: [
      { type: "text", title: "Pengertian Fa'il", content: "Fa'il (subjek/pelaku) adalah isim yang dirafa'kan, disebutkan sebelumnya fi'ilnya. Fa'il bisa berupa isim zhahir atau isim dhamir." },
      { type: "kaidah", title: "📖 Definisi Fa'il", arabic: "اَلْفَاعِلُ هُوَ الاِسْمُ الْمَرْفُوْعُ الْمَذْكُوْرُ قَبْلَهُ فِعْلُهُ", translation: "Fa'il adalah isim yang dirafa'kan, disebutkan sebelumnya fi'ilnya." },
      { type: "contoh_kalimat", title: "📌 Contoh", items: [
        { key: "قَامَ زَيْدٌ", value: "Zaid berdiri (زَيْدٌ = fa'il)" },
        { key: "جَاءَ الطَّالِبُ", value: "Pelajar itu datang (الطَّالِبُ = fa'il)" },
        { key: "يَقُوْمُ الرِّجَالُ", value: "Para lelaki berdiri" },
      ]},
    ],
  },
  {
    id: "ju_mafulbih",
    title: "Bab Maf'ul bih",
    sections: [
      { type: "text", title: "Pengertian Maf'ul bih", content: "Maf'ul bih (objek) adalah isim yang dinashabkan, yang dikenai pekerjaan oleh fa'il." },
      { type: "kaidah", title: "📖 Definisi", arabic: "اَلْمَفْعُوْلُ بِهِ هُوَ الاِسْمُ الْمَنْصُوْبُ الَّذِيْ يَقَعُ بِهِ الْفِعْلُ", translation: "Maf'ul bih adalah isim yang dinashabkan, yang terkena fi'il." },
      { type: "contoh_kalimat", title: "📌 Contoh", items: [
        { key: "ضَرَبَ زَيْدٌ عَمْرًا", value: "Zaid memukul Amr (عَمْرًا = maf'ul bih)" },
        { key: "قَرَأَ الطَّالِبُ الْكِتَابَ", value: "Pelajar membaca kitab (الْكِتَابَ = maf'ul bih)" },
      ]},
    ],
  },
  {
    id: "ju_masdar",
    title: "Bab Masdar (Maf'ul Muthlaq)",
    sections: [
      { type: "text", title: "Maf'ul Muthlaq", content: "Maf'ul muthlaq (masdar) adalah isim yang dinashabkan, disebutkan untuk menguatkan fi'ilnya, menjelaskan jumlahnya, atau menjelaskan macamnya." },
      { type: "kaidah", title: "📖 Definisi", arabic: "اَلْمَصْدَرُ هُوَ الاِسْمُ الْمَنْصُوْبُ الَّذِيْ يَجِيْءُ ثَالِثًا فِي تَصْرِيْفِ الْفِعْلِ", translation: "Masdar adalah isim manshub yang datang urutan ketiga dalam tashrif fi'il." },
      { type: "contoh_kalimat", title: "📌 Contoh", items: [
        { key: "ضَرَبْتُ ضَرْبًا", value: "Aku memukul dengan pukulan" },
        { key: "ضَرَبْتُ ضَرْبَتَيْنِ", value: "Aku memukul dua pukulan" },
      ]},
    ],
  },
  {
    id: "ju_zharf",
    title: "Bab Zharf (Maf'ul fih)",
    sections: [
      { type: "text", title: "Zharf Zaman dan Zharf Makan", content: "Zharf (keterangan) terbagi menjadi zharf zaman (keterangan waktu) dan zharf makan (keterangan tempat). Keduanya dinashabkan." },
      { type: "list", title: "Zharf Zaman (Keterangan Waktu)", items: [
        { key: "الْيَوْمَ", value: "Hari ini" },
        { key: "اللَّيْلَةَ", value: "Malam ini" },
        { key: "غَدًا", value: "Besok" },
        { key: "أَمْسِ", value: "Kemarin" },
        { key: "أَبَدًا", value: "Selama-lamanya" },
      ]},
      { type: "list", title: "Zharf Makan (Keterangan Tempat)", items: [
        { key: "أَمَامَ", value: "Di depan" },
        { key: "وَرَاءَ", value: "Di belakang" },
        { key: "فَوْقَ", value: "Di atas" },
        { key: "تَحْتَ", value: "Di bawah" },
        { key: "عِنْدَ", value: "Di sisi" },
      ]},
    ],
  },
  {
    id: "ju_hal",
    title: "Bab Hal",
    sections: [
      { type: "text", title: "Pengertian Hal", content: "Hal adalah isim yang dinashabkan, disebutkan untuk menjelaskan keadaan fa'il atau maf'ul bih." },
      { type: "kaidah", title: "📖 Definisi", arabic: "اَلْحَالُ هُوَ الاِسْمُ الْمَنْصُوْبُ الْمُفَسِّرُ لِمَا انْبَهَمَ مِنَ الْهَيْئَاتِ", translation: "Hal adalah isim manshub yang menjelaskan keadaan yang samar." },
      { type: "contoh_kalimat", title: "📌 Contoh", items: [
        { key: "جَاءَ زَيْدٌ رَاكِبًا", value: "Zaid datang dalam keadaan berkuda (رَاكِبًا = hal)" },
      ]},
    ],
  },
  {
    id: "ju_tamyiz",
    title: "Bab Tamyiz",
    sections: [
      { type: "text", title: "Pengertian Tamyiz", content: "Tamyiz adalah isim yang dinashabkan, disebutkan untuk menjelaskan sesuatu yang samar dari dzat (jenis)." },
      { type: "kaidah", title: "📖 Definisi", arabic: "التَّمْيِيْزُ هُوَ الاِسْمُ الْمَنْصُوْبُ الْمُفَسِّرُ لِمَا انْبَهَمَ مِنَ الذَّوَاتِ", translation: "Tamyiz adalah isim manshub yang menjelaskan sesuatu yang samar dari dzat." },
      { type: "contoh_kalimat", title: "📌 Contoh", items: [
        { key: "اشْتَرَيْتُ عِشْرِيْنَ كِتَابًا", value: "Aku membeli 20 kitab (كِتَابًا = tamyiz)" },
        { key: "طَابَ مُحَمَّدٌ نَفْسًا", value: "Muhammad baik jiwanya (نَفْسًا = tamyiz)" },
      ]},
    ],
  },
  {
    id: "ju_idhafah",
    title: "Bab Idhafah",
    sections: [
      { type: "text", title: "Pengertian Idhafah", content: "Idhafah adalah penyandaran isim kepada isim lain. Isim pertama disebut mudhaf, dan isim kedua disebut mudhaf ilaih. Mudhaf ilaih selalu dijarkan." },
      { type: "kaidah", title: "📖 Hukum Mudhaf", arabic: "يُحْذَفُ مِنَ الْمُضَافِ التَّنْوِيْنُ وَالنُّوْنُ", translation: "Dari mudhaf dibuang tanwin dan nun." },
      { type: "contoh_kalimat", title: "📌 Contoh", items: [
        { key: "كِتَابُ الطَّالِبِ", value: "Kitab pelajar (idhafah — الطَّالِبِ dijarkan)" },
        { key: "بَابُ الْمَسْجِدِ", value: "Pintu masjid" },
        { key: "غُلاَمُ زَيْدٍ", value: "Anak Zaid" },
      ]},
    ],
  },
];
