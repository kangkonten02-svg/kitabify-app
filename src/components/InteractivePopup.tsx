import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

// ── Types ──
interface PopupItem {
  key?: string;
  value: string;
}

type PopupType = "huruf_jar" | "irob" | "example" | "kaidah" | "dhomir" | "isyaroh" | "maushul" | "generic";

interface SmartContent {
  title: string;
  arabic: string;
  sections: { label: string; content: string }[];
  steps?: { label: string; content: string }[];
}

// ── Data ──
const HURUF_JAR_DETAILS: Record<string, { fungsi: string; contoh: string[] }> = {
  "مِنْ": { fungsi: "Menunjukkan asal/permulaan (ابتداء الغاية) atau sebagian (تبعيض)", contoh: ["مِنَ المَسْجِدِ الحَرَامِ — Dari Masjidil Haram", "مِنْ خَيْرٍ — Dari kebaikan", "كُلُوا مِنْ طَيِّبَاتِ — Makanlah dari yang baik-baik"] },
  "إِلَى": { fungsi: "Menunjukkan tujuan/akhir (انتهاء الغاية)", contoh: ["إِلَى المَسْجِدِ الأَقْصَى — Ke Masjidil Aqsha", "إِلَى اللَّيْلِ — Hingga malam", "أَوْحَيْنَا إِلَيْكَ — Kami wahyukan kepadamu"] },
  "حَتَّى": { fungsi: "Menunjukkan batas akhir (الغاية)", contoh: ["حَتَّى مَطْلَعِ الفَجْرِ — Hingga terbit fajar", "حَتَّى حِينٍ — Sampai suatu waktu"] },
  "فِي": { fungsi: "Menunjukkan tempat/wadah (الظرفية)", contoh: ["فِي الأَرْضِ — Di bumi", "فِي قُلُوبِهِمْ — Di hati mereka", "فِي سَبِيلِ اللهِ — Di jalan Allah"] },
  "عَنْ": { fungsi: "Menunjukkan menjauhi/berpisah (المجاوزة)", contoh: ["عَنِ المُنْكَرِ — Dari kemungkaran", "عَنْ يَمِينِهِ — Dari kanannya"] },
  "عَلَى": { fungsi: "Menunjukkan di atas/penguasaan (الاستعلاء)", contoh: ["عَلَى الأَرْضِ — Di atas bumi", "عَلَيْهِمْ — Atas mereka"] },
  "بِ": { fungsi: "Menunjukkan sebab/alat (السببية / الاستعانة)", contoh: ["بِسْمِ اللهِ — Dengan nama Allah", "بِالقَلَمِ — Dengan pena", "بِمَا كَانُوا — Karena apa yang mereka"] },
  "لِ": { fungsi: "Menunjukkan kepemilikan/sebab (المِلك / التعليل)", contoh: ["لِلَّهِ مَا فِي السَّمَاوَاتِ — Milik Allah apa di langit", "لِيَعْبُدُوا — Agar mereka beribadah"] },
  "كَ": { fungsi: "Menunjukkan perumpamaan (التشبيه)", contoh: ["كَالحِجَارَةِ — Seperti batu", "كَمَثَلِ — Seperti perumpamaan"] },
  "وَ": { fungsi: "Untuk sumpah (القَسَم)", contoh: ["وَاللهِ — Demi Allah", "وَالعَصْرِ — Demi waktu"] },
  "تَ": { fungsi: "Untuk sumpah khusus dengan lafaz Allah (القَسَم)", contoh: ["تَاللهِ — Demi Allah"] },
  "مُذْ / مُنْذُ": { fungsi: "Menunjukkan permulaan waktu (ابتداء الغاية الزمانية)", contoh: ["مُنْذُ يَوْمِ الجُمُعَةِ — Sejak hari Jumat"] },
  "رُبَّ": { fungsi: "Menunjukkan sedikit/banyak (التقليل / التكثير)", contoh: ["رُبَّ أَخٍ — Betapa banyak saudara"] },
  "كَيْ": { fungsi: "Menunjukkan tujuan (التعليل)", contoh: ["لِكَيْ لَا يَكُونَ — Agar tidak menjadi"] },
  "لَعَلَّ": { fungsi: "Menunjukkan harapan/kemungkinan (الترجّي)", contoh: ["لَعَلَّ السَّاعَةَ — Boleh jadi hari kiamat"] },
  "مَتَى": { fungsi: "Menunjukkan waktu (الظرفية الزمانية)", contoh: ["مَتَى البَلَدِ — Dari negeri"] },
  "خَلَا / حَاشَا / عَدَا": { fungsi: "Menunjukkan pengecualian (الاستثناء)", contoh: ["خَلَا زَيْدٍ — Kecuali Zaid"] },
};

const IROB_DETAILS: Record<string, { kapan: string; contoh: string[] }> = {
  "Rofa'": { kapan: "Saat isim menjadi mubtada, khabar, fa'il, atau naibul fa'il", contoh: ["الطَّالِبُ مُجْتَهِدٌ — Pelajar itu rajin (dhommah)", "جَاءَ مُحَمَّدٌ — Muhammad datang (tanwin dhom)"] },
  "Nashob": { kapan: "Saat isim menjadi maf'ul bih, khabar inna, isim kaana, atau hal", contoh: ["رَأَيْتُ الطَّالِبَ — Saya melihat pelajar (fathah)", "إِنَّ مُحَمَّدًا — Sesungguhnya Muhammad (tanwin fath)"] },
  "Jer": { kapan: "Saat isim didahului huruf jar atau menjadi mudhof ilaih", contoh: ["مِنَ المَسْجِدِ — Dari masjid (kasroh)", "كِتَابُ الطَّالِبِ — Buku pelajar (idhofah)"] },
  "Jazem": { kapan: "Saat fi'il mudhari didahului huruf jazm (لم، لا الناهية، لمّا)", contoh: ["لَمْ يَكْتُبْ — Dia tidak menulis (sukun)", "لَا تَذْهَبْ — Jangan pergi (sukun)"] },
};

// ── Content Generator ──
function generateSmartContent(item: PopupItem, type: PopupType): SmartContent {
  const arabic = item.key || "";
  const meaning = item.value || "";

  if (type === "huruf_jar") {
    const detail = HURUF_JAR_DETAILS[arabic] || HURUF_JAR_DETAILS[Object.keys(HURUF_JAR_DETAILS).find(k => arabic.includes(k.replace(/\s/g, ''))) || ""];
    return {
      title: `Huruf Jar: ${arabic}`,
      arabic,
      sections: [
        { label: "Arti", content: meaning },
        { label: "Fungsi dalam Nahwu", content: detail?.fungsi || `Berfungsi sebagai huruf jar yang men-jar-kan isim setelahnya` },
        { label: "Contoh dalam Kitab", content: detail?.contoh?.join("\n") || `${arabic} + isim → isim menjadi majrur (kasroh)` },
      ],
    };
  }

  if (type === "irob") {
    const detail = IROB_DETAILS[item.key || ""] || IROB_DETAILS[arabic];
    return {
      title: arabic || item.key || "",
      arabic: arabic || "",
      sections: [
        { label: "Tanda", content: meaning },
        { label: "Kapan Digunakan", content: detail?.kapan || "Digunakan sesuai kedudukan isim/fi'il dalam kalimat" },
        { label: "Contoh Kalimat", content: detail?.contoh?.join("\n") || "Lihat materi untuk contoh lengkap" },
      ],
    };
  }

  if (type === "example") {
    const parts = meaning.split("→").map(s => s.trim());
    if (parts.length >= 2) {
      return {
        title: item.key || "Contoh",
        arabic: parts[0]?.split("—")[0]?.trim() || arabic,
        sections: [{ label: "Penjelasan", content: meaning }],
        steps: [
          { label: "Bentuk Awal", content: parts[0] || meaning },
          { label: "Proses Perubahan", content: `Huruf jar mempengaruhi isim setelahnya` },
          { label: "Hasil Akhir", content: parts[parts.length - 1] || meaning },
        ],
      };
    }
    return { title: item.key || "Contoh", arabic, sections: [{ label: "Penjelasan Lengkap", content: meaning }] };
  }

  if (type === "kaidah") {
    return {
      title: item.key || "Kaidah",
      arabic,
      sections: [
        { label: "Penjelasan", content: meaning },
        { label: "Penggunaan", content: `Kaidah ini menentukan bagaimana ${arabic || item.key} berperan dalam struktur kalimat Arab.` },
      ],
    };
  }

  if (type === "dhomir") {
    return {
      title: `Dhomir: ${arabic}`,
      arabic,
      sections: [
        { label: "Arti", content: meaning },
        { label: "Jenis", content: arabic.startsWith("هُ") || arabic.startsWith("هِ") || arabic.startsWith("هُمَ") || arabic.startsWith("هُنَّ") ? "Dhomir Ghoib (orang ketiga)" : arabic.startsWith("أَنْ") ? "Dhomir Mukhotob (orang kedua)" : arabic.startsWith("أَنَا") || arabic.startsWith("نَحْنُ") ? "Dhomir Mutakallim (orang pertama)" : "Dhomir" },
        { label: "Contoh Penggunaan", content: `${arabic} + فِي المَسْجِدِ → ${arabic} فِي المَسْجِدِ` },
      ],
    };
  }

  if (type === "isyaroh") {
    const isDekat = arabic.includes("هٰذ") || arabic.includes("هَات") || arabic.includes("هٰؤ") || arabic === "هُنَا";
    return {
      title: `Isim Isyaroh: ${arabic}`,
      arabic,
      sections: [
        { label: "Arti", content: meaning },
        { label: "Jarak", content: isDekat ? "Dekat (قريب)" : "Jauh (بعيد)" },
        { label: "Contoh Penggunaan", content: `${arabic} الكِتَابُ — ${meaning} kitab` },
      ],
    };
  }

  if (type === "maushul") {
    return {
      title: `Isim Maushul: ${arabic}`,
      arabic,
      sections: [
        { label: "Arti", content: meaning },
        { label: "Kaidah", content: "Wajib diikuti oleh Shilah (kalimat penyambung yang mengandung dhomir kembali ke isim maushul)" },
        { label: "Contoh", content: `${arabic} يُصَلِّي — ${meaning} sholat` },
      ],
    };
  }

  return { title: item.key || "Detail", arabic, sections: [{ label: "Keterangan", content: meaning }] };
}

function detectType(sectionTitle?: string, sectionType?: string): PopupType {
  const t = (sectionTitle || "").toLowerCase();
  if (t.includes("huruf jar") || t.includes("jenis huruf")) return "huruf_jar";
  if (t.includes("i'rob") || t.includes("i'rob") || sectionType === "table") return "irob";
  if (t.includes("contoh") || t.includes("pengaruh")) return "example";
  if (t.includes("penyebab") || t.includes("kaidah")) return "kaidah";
  if (t.includes("dhomir")) return "dhomir";
  if (t.includes("isyaroh")) return "isyaroh";
  if (t.includes("maushul")) return "maushul";
  return "generic";
}

// ── Step Viewer ──
const StepViewer = ({ steps }: { steps: { label: string; content: string }[] }) => {
  const [currentStep, setCurrentStep] = useState(0);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-primary">Langkah {currentStep + 1}/{steps.length}</span>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === currentStep ? "bg-primary" : "bg-muted-foreground/30"}`} />
          ))}
        </div>
      </div>
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-background/30 rounded-xl p-4 space-y-2"
      >
        <p className="text-xs font-bold text-accent">{steps[currentStep].label}</p>
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{steps[currentStep].content}</p>
      </motion.div>
      <div className="flex gap-2">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="flex-1 py-2 rounded-xl bg-muted/50 text-sm font-semibold text-foreground disabled:opacity-30 flex items-center justify-center gap-1"
        >
          <ChevronLeft size={14} /> Sebelum
        </button>
        <button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
          className="flex-1 py-2 rounded-xl bg-primary/20 text-sm font-semibold text-primary disabled:opacity-30 flex items-center justify-center gap-1"
        >
          Selanjutnya <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

// ── Global Modal Context (single modal system) ──
interface ModalState {
  item: PopupItem;
  sectionTitle?: string;
  sectionType?: string;
}

interface ModalContextType {
  openModal: (state: ModalState) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const usePopupModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("usePopupModal must be used within PopupModalProvider");
  return ctx;
};

// ── Provider (renders single modal) ──
export const PopupModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalState, setModalState] = useState<ModalState | null>(null);

  const openModal = useCallback((state: ModalState) => {
    setModalState(state); // replaces, never stacks
  }, []);

  const closeModal = useCallback(() => {
    setModalState(null);
  }, []);

  // Lock body scroll
  useEffect(() => {
    if (modalState) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [modalState]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <AnimatePresence>
        {modalState && (
          <GlobalModal
            item={modalState.item}
            sectionTitle={modalState.sectionTitle}
            sectionType={modalState.sectionType}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
};

// ── Global Modal Component ──
const GlobalModal = ({
  item,
  sectionTitle,
  sectionType,
  onClose,
}: {
  item: PopupItem;
  sectionTitle?: string;
  sectionType?: string;
  onClose: () => void;
}) => {
  const type = detectType(sectionTitle, sectionType);
  const content = generateSmartContent(item, type);

  return (
    <>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      {/* Modal */}
      <motion.div
        className="fixed inset-x-0 bottom-0 z-50 flex flex-col"
        style={{ maxHeight: "85vh" }}
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 350 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.y > 80) onClose();
        }}
      >
        <div className="mx-2 rounded-t-2xl border border-b-0 border-accent/30 bg-card shadow-2xl flex flex-col overflow-hidden">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-2 shrink-0">
            <h3 className="text-base font-bold text-foreground truncate pr-4">{content.title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-muted/60 hover:bg-muted transition shrink-0"
            >
              <X size={16} className="text-muted-foreground" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto overscroll-contain px-5 pb-6" style={{ maxHeight: "calc(85vh - 80px)" }}>
            <div className="space-y-4">
              {/* Arabic title */}
              {content.arabic && (
                <div className="text-center py-3">
                  <p className="font-arabic text-3xl font-bold text-accent leading-relaxed" dir="rtl">
                    {content.arabic}
                  </p>
                </div>
              )}

              {/* Sections */}
              <div className="space-y-3">
                {content.sections.map((sec, i) => (
                  <div key={i} className="bg-muted/30 rounded-xl p-4 space-y-1.5">
                    <p className="text-xs font-bold text-primary">{sec.label}</p>
                    <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-line">{sec.content}</p>
                  </div>
                ))}
              </div>

              {/* Steps */}
              {content.steps && content.steps.length > 0 && (
                <div className="border-t border-border pt-4">
                  <p className="text-xs font-bold text-foreground/70 mb-3">📝 Langkah-langkah:</p>
                  <StepViewer steps={content.steps} />
                </div>
              )}
            </div>

            {/* Safe area padding */}
            <div className="h-6" />
          </div>
        </div>
      </motion.div>
    </>
  );
};

// ── Clickable Item (uses global modal) ──
export const ClickableItem = ({
  children,
  item,
  sectionTitle,
  sectionType,
  className,
}: {
  children: React.ReactNode;
  item: PopupItem;
  sectionTitle?: string;
  sectionType?: string;
  className?: string;
}) => {
  const { openModal } = usePopupModal();

  return (
    <div
      onClick={() => openModal({ item, sectionTitle, sectionType })}
      className={`cursor-pointer active:scale-[0.97] transition-transform duration-150 ring-1 ring-transparent hover:ring-primary/30 rounded-xl ${className || ""}`}
    >
      {children}
    </div>
  );
};
