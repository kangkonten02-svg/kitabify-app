import { describe, expect, it } from "vitest";
import { isNahwuBab, isRichBab, isSimpleBab } from "@/lib/appContent";

describe("admin content validation", () => {
  it("accepts quiz questions with four choices and a valid answer key", () => {
    expect(isNahwuBab({
      id: "j1_b1_huruf_jar",
      number: 1,
      title: "Huruf Jar",
      description: "Contoh",
      soal: [{
        id: "j1b1_1",
        soal: "من termasuk ...",
        pilihan: { A: "isim", B: "fi'il", C: "huruf", D: "jumlah" },
        jawaban: "C",
        pembahasan: "من adalah huruf jar.",
      }],
    })).toBe(true);
  });

  it("rejects a quiz missing an option or using an invalid answer key", () => {
    const invalid = {
      id: "j1_b1_huruf_jar",
      number: 1,
      title: "Huruf Jar",
      description: "Contoh",
      soal: [{
        id: "j1b1_1",
        soal: "من termasuk ...",
        pilihan: { A: "isim", B: "fi'il", C: "huruf" },
        jawaban: "E",
        pembahasan: "Contoh.",
      }],
    };
    expect(isNahwuBab(invalid)).toBe(false);
  });

  it("requires stable IDs and the correct material structure", () => {
    expect(isRichBab({ id: "bab-a", title: "Bab A", sections: [] })).toBe(true);
    expect(isRichBab({ id: "bab-a", title: "Bab A", sections: "teks" })).toBe(false);
    expect(isSimpleBab({ id: "bab-a", title: "Bab A", content: "Isi" })).toBe(true);
    expect(isSimpleBab({ id: "bab-a", title: "Bab A", content: 4 })).toBe(false);
  });
});