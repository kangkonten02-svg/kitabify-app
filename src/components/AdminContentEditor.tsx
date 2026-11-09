import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpen, Check, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getEditableMaterialRecords,
  getMergedQuizList,
  isAlfiyahEntry,
  isNahwuBab,
  isRichBab,
  isSimpleBab,
  loadContentOverrides,
  saveMaterialOverride,
  saveQuizOverride,
  type EditableMaterialRecord,
} from "@/lib/appContent";
import type { NahwuBab } from "@/lib/nahwuQuizData";

interface AdminContentEditorProps {
  onBack: () => void;
}

function validateMaterial(record: EditableMaterialRecord, value: unknown): string | null {
  if (record.kind === "rich" && isRichBab(value) && value.id === record.id) {
    const supportedTypes = new Set(["text", "list", "arabic", "kaidah", "alfiyah", "example", "table", "grid", "pairs", "ayat", "contoh_kalimat"]);
    const validSections = value.sections.every((section) =>
      typeof section === "object" && section !== null && "type" in section &&
      supportedTypes.has(String(section.type)) &&
      (!(("items" in section) && section.items !== undefined) || Array.isArray(section.items)) &&
      (!(("rows" in section) && section.rows !== undefined) || Array.isArray(section.rows))
    );
    return validSections ? null : "Periksa kembali jenis bagian, daftar, atau baris materi.";
  }
  if (record.kind === "simple" && isSimpleBab(value) && value.id === record.id) return null;
  if (record.kind === "alfiyah" && isAlfiyahEntry(value) && value.id === record.id.replace("alfiyah:", "")) return null;
  return "Struktur tidak sesuai atau ID materi berubah. Pertahankan ID yang sudah ada.";
}

const AdminContentEditor = ({ onBack }: AdminContentEditorProps) => {
  const [records, setRecords] = useState(getEditableMaterialRecords());
  const [materialId, setMaterialId] = useState(records[0]?.id ?? "");
  const [materialJson, setMaterialJson] = useState("");
  const [quizList, setQuizList] = useState(getMergedQuizList());
  const [quizJilidId, setQuizJilidId] = useState(quizList[0]?.id ?? "");
  const [quizBabId, setQuizBabId] = useState(quizList[0]?.babs[0]?.id ?? "");
  const [quizJson, setQuizJson] = useState("");
  const [savingMaterial, setSavingMaterial] = useState(false);
  const [savingQuiz, setSavingQuiz] = useState(false);

  const selectedRecord = useMemo(() => records.find((record) => record.id === materialId), [records, materialId]);
  const selectedJilid = useMemo(() => quizList.find((jilid) => jilid.id === quizJilidId), [quizList, quizJilidId]);
  const selectedBab = useMemo(() => selectedJilid?.babs.find((bab) => bab.id === quizBabId), [selectedJilid, quizBabId]);

  useEffect(() => {
    loadContentOverrides().then(() => {
      const latestRecords = getEditableMaterialRecords();
      const latestQuizzes = getMergedQuizList();
      setRecords(latestRecords);
      setQuizList(latestQuizzes);
      setMaterialId((current) => current || latestRecords[0]?.id || "");
      setQuizJilidId((current) => current || latestQuizzes[0]?.id || "");
      setQuizBabId((current) => current || latestQuizzes[0]?.babs[0]?.id || "");
    }).catch(() => toast.error("Materi tersimpan belum dapat dimuat; konten asli tetap tersedia."));
  }, []);

  useEffect(() => {
    if (selectedRecord) setMaterialJson(JSON.stringify(selectedRecord.payload, null, 2));
  }, [selectedRecord]);

  useEffect(() => {
    if (selectedBab) setQuizJson(JSON.stringify(selectedBab, null, 2));
  }, [selectedBab]);

  const saveMaterial = async () => {
    if (!selectedRecord) return;
    let value: unknown;
    try {
      value = JSON.parse(materialJson);
    } catch {
      toast.error("Periksa format materi yang diedit.");
      return;
    }
    const validationMessage = validateMaterial(selectedRecord, value);
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }
    setSavingMaterial(true);
    try {
      await saveMaterialOverride(selectedRecord.id, value as EditableMaterialRecord["payload"]);
      await loadContentOverrides(true);
      setRecords(getEditableMaterialRecords());
      window.dispatchEvent(new Event("kitabify-content-updated"));
      toast.success("Materi berhasil disimpan.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Materi gagal disimpan.");
    } finally {
      setSavingMaterial(false);
    }
  };

  const saveQuiz = async () => {
    if (!selectedJilid || !selectedBab) return;
    let value: unknown;
    try {
      value = JSON.parse(quizJson);
    } catch {
      toast.error("Periksa format soal yang diedit.");
      return;
    }
    if (!isNahwuBab(value) || value.id !== selectedBab.id || value.number !== selectedBab.number) {
      toast.error("Format soal tidak sesuai. Pertahankan ID dan nomor bab.");
      return;
    }
    if (value.soal.length === 0) {
      toast.error("Bab harus memiliki minimal satu soal.");
      return;
    }
    setSavingQuiz(true);
    try {
      await saveQuizOverride(selectedJilid.id, value as NahwuBab);
      await loadContentOverrides(true);
      setQuizList(getMergedQuizList());
      window.dispatchEvent(new Event("kitabify-content-updated"));
      toast.success("Soal berhasil disimpan.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Soal gagal disimpan.");
    } finally {
      setSavingQuiz(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-texture pb-12">
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <Button variant="ghost" onClick={onBack} className="mb-4 px-0 text-muted-foreground">
          <ArrowLeft /> Kembali ke Panel Admin
        </Button>
        <h1 className="text-2xl font-extrabold text-foreground">Edit Materi & Soal</h1>
        <p className="mt-1 text-sm text-muted-foreground">Perubahan tersimpan dan digunakan tanpa menghapus naskah asli.</p>

        <Tabs defaultValue="materi" className="mt-5">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="materi"><BookOpen className="mr-2 h-4 w-4" />Materi</TabsTrigger>
            <TabsTrigger value="soal">Bank Soal</TabsTrigger>
          </TabsList>

          <TabsContent value="materi" className="mt-4 space-y-3">
            <label className="block text-sm font-semibold text-foreground" htmlFor="material-picker">Pilih materi</label>
            <select
              id="material-picker"
              value={materialId}
              onChange={(event) => setMaterialId(event.target.value)}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              {records.map((record) => <option key={record.id} value={record.id}>{record.label}</option>)}
            </select>
            {selectedRecord && (
              <>
                <p className="text-xs text-muted-foreground">Judul, isi, contoh, bait, dan susunan bagian materi dapat diubah di bawah.</p>
                <Textarea
                  aria-label="Isi materi"
                  value={materialJson}
                  onChange={(event) => setMaterialJson(event.target.value)}
                  className="min-h-[55vh] font-mono text-xs leading-relaxed"
                  spellCheck={false}
                />
                <Button onClick={saveMaterial} disabled={savingMaterial} className="w-full">
                  {savingMaterial ? <Check className="animate-pulse" /> : <Save />}
                  Simpan Materi
                </Button>
              </>
            )}
          </TabsContent>

          <TabsContent value="soal" className="mt-4 space-y-3">
            <label className="block text-sm font-semibold text-foreground" htmlFor="quiz-jilid-picker">Pilih jilid</label>
            <select
              id="quiz-jilid-picker"
              value={quizJilidId}
              onChange={(event) => {
                const nextId = event.target.value;
                const nextJilid = quizList.find((item) => item.id === nextId);
                setQuizJilidId(nextId);
                setQuizBabId(nextJilid?.babs[0]?.id ?? "");
              }}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              {quizList.map((jilid) => <option key={jilid.id} value={jilid.id}>{jilid.title}</option>)}
            </select>
            <label className="block text-sm font-semibold text-foreground" htmlFor="quiz-bab-picker">Pilih bab</label>
            <select
              id="quiz-bab-picker"
              value={quizBabId}
              onChange={(event) => setQuizBabId(event.target.value)}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              {(selectedJilid?.babs ?? []).map((bab) => <option key={bab.id} value={bab.id}>{bab.title}</option>)}
            </select>
            {selectedBab && (
              <>
                <p className="text-xs text-muted-foreground">Edit pertanyaan, pilihan A–D, kunci jawaban, dan pembahasan. Pastikan jawaban benar tetap A, B, C, atau D.</p>
                <Textarea
                  aria-label="Isi soal"
                  value={quizJson}
                  onChange={(event) => setQuizJson(event.target.value)}
                  className="min-h-[55vh] font-mono text-xs leading-relaxed"
                  spellCheck={false}
                />
                <Button onClick={saveQuiz} disabled={savingQuiz} className="w-full">
                  {savingQuiz ? <Check className="animate-pulse" /> : <Save />}
                  Simpan Soal
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminContentEditor;