import { supabase } from "@/integrations/supabase/client";
import { MATERI_DATA, type Kitab } from "@/lib/materiData";
import { JILID_LIST, type NahwuBab, type NahwuJilid } from "@/lib/nahwuQuizData";
import { ALFIYAH_ENTRIES, JILID1_CONTENT, type AlfiyahEntry, type RichBab } from "@/lib/jilidContent";
import { JILID2_CONTENT } from "@/lib/jilid2Content";
import { JILID3_CONTENT } from "@/lib/jilid3Content";
import { JURUMIYAH_CONTENT } from "@/lib/jurumiyahContent";
import { SAFINAH_CONTENT } from "@/lib/safinahContent";

export type SimpleBab = { id: string; title: string; content?: string };
export type MaterialOverride = RichBab | SimpleBab | AlfiyahEntry;

const seedRichContent: RichBab[] = [
  ...JILID1_CONTENT,
  ...JILID2_CONTENT,
  ...JILID3_CONTENT,
  ...JURUMIYAH_CONTENT,
  ...SAFINAH_CONTENT,
];

const contentOverrides = new Map<string, MaterialOverride>();
const quizOverrides = new Map<string, NahwuBab>();
let hasLoaded = false;
let loadPromise: Promise<void> | null = null;

const quizKey = (jilidId: string, babId: string) => `${jilidId}:${babId}`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isRichBab(value: unknown): value is RichBab {
  return isRecord(value) && typeof value.id === "string" && typeof value.title === "string" && Array.isArray(value.sections);
}

export function isSimpleBab(value: unknown): value is SimpleBab {
  return isRecord(value) && typeof value.id === "string" && typeof value.title === "string" &&
    (value.content === undefined || typeof value.content === "string");
}

export function isAlfiyahEntry(value: unknown): value is AlfiyahEntry {
  return isRecord(value) && typeof value.id === "string" && typeof value.bab === "string" &&
    typeof value.bait_arab === "string" && typeof value.bait_latin === "string" &&
    typeof value.arti === "string" && typeof value.digunakan_di_materi === "boolean";
}

export function isNahwuBab(value: unknown): value is NahwuBab {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.title !== "string" ||
      typeof value.description !== "string" || !Array.isArray(value.soal)) return false;
  return value.soal.every((item) => {
    if (!isRecord(item) || typeof item.id !== "string" || typeof item.soal !== "string" ||
        typeof item.pembahasan !== "string" || !isRecord(item.pilihan)) return false;
    return ["A", "B", "C", "D"].every((letter) => typeof item.pilihan[letter] === "string") &&
      ["A", "B", "C", "D"].includes(String(item.jawaban));
  });
}

export async function loadContentOverrides(force = false): Promise<void> {
  if (hasLoaded && !force) return;
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    const [materials, quizzes] = await Promise.all([
      supabase.from("content_overrides").select("content_id, payload"),
      supabase.from("quiz_overrides").select("jilid_id, bab_id, payload"),
    ]);
    if (materials.error) throw materials.error;
    if (quizzes.error) throw quizzes.error;

    contentOverrides.clear();
    quizOverrides.clear();
    (materials.data ?? []).forEach((row) => {
      const payload = row.payload as unknown;
      if (isRichBab(payload) || isSimpleBab(payload) || isAlfiyahEntry(payload)) contentOverrides.set(row.content_id, payload);
    });
    (quizzes.data ?? []).forEach((row) => {
      const payload = row.payload as unknown;
      if (isNahwuBab(payload) && payload.id === row.bab_id) {
        quizOverrides.set(quizKey(row.jilid_id, row.bab_id), payload);
      }
    });
    hasLoaded = true;
  })().finally(() => {
    loadPromise = null;
  });
  return loadPromise;
}

export function getMergedRichContent(): RichBab[] {
  return seedRichContent.map((seed) => {
    const override = contentOverrides.get(seed.id);
    return isRichBab(override) && override.id === seed.id ? override : seed;
  });
}

export function getMergedAlfiyahEntries(): AlfiyahEntry[] {
  return ALFIYAH_ENTRIES.map((entry) => {
    const override = contentOverrides.get(`alfiyah:${entry.id}`);
    return isAlfiyahEntry(override) && override.id === entry.id ? override : entry;
  });
}

export function getMergedMateriData(): Kitab[] {
  return MATERI_DATA.map((kitab) => ({
    ...kitab,
    jilids: kitab.jilids.map((jilid) => ({
      ...jilid,
      babs: jilid.babs.map((bab) => {
        const override = contentOverrides.get(bab.id);
        return isSimpleBab(override) && override.id === bab.id
          ? { ...bab, title: override.title, content: override.content }
          : bab;
      }),
    })),
  }));
}

export function getMergedQuizList(): NahwuJilid[] {
  return JILID_LIST.map((jilid) => ({
    ...jilid,
    babs: jilid.babs.map((bab) => quizOverrides.get(quizKey(jilid.id, bab.id)) ?? bab),
  }));
}

export function getMergedQuizBab(jilidId: string, babId: string): NahwuBab | undefined {
  const jilid = getMergedQuizList().find((item) => item.id === jilidId);
  return jilid?.babs.find((bab) => bab.id === babId);
}

export async function saveMaterialOverride(contentId: string, payload: MaterialOverride): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase.from("content_overrides").upsert({
    content_id: contentId,
    payload: payload as unknown as import("@/integrations/supabase/types").Json,
    updated_by: user?.id ?? null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "content_id" });
  if (error) throw error;
  contentOverrides.set(contentId, payload);
}

export async function saveQuizOverride(jilidId: string, bab: NahwuBab): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase.from("quiz_overrides").upsert({
    jilid_id: jilidId,
    bab_id: bab.id,
    payload: bab as unknown as import("@/integrations/supabase/types").Json,
    updated_by: user?.id ?? null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "jilid_id,bab_id" });
  if (error) throw error;
  quizOverrides.set(quizKey(jilidId, bab.id), bab);
}

export function getSeedRichContent(): RichBab[] {
  return seedRichContent;
}

export function hasMaterialOverride(contentId: string): boolean {
  return contentOverrides.has(contentId);
}

export function hasQuizOverride(jilidId: string, babId: string): boolean {
  return quizOverrides.has(quizKey(jilidId, babId));
}