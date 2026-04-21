// Share utility functions

export function getBadge(score: number, total: number): { emoji: string; label: string; color: string } {
  const pct = (score / total) * 100;
  if (pct >= 80) return { emoji: "🥇", label: "Mumtaz", color: "from-yellow-400 to-amber-500" };
  if (pct >= 60) return { emoji: "🥈", label: "Jayyid", color: "from-gray-300 to-gray-400" };
  return { emoji: "🥉", label: "Perlu Belajar Lagi", color: "from-orange-400 to-orange-500" };
}

export function getShareText(title: string, score: number, total: number, url: string): string {
  return `Aku dapat nilai ${score}/${total} di materi "${title}" di Kitabify! Kamu bisa ngalahin aku gak? 😎📚\n${url}`;
}

export async function shareResult(title: string, score: number, total: number, materiUrl: string): Promise<boolean> {
  const text = getShareText(title, score, total, materiUrl);
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Hasil Kuis Kitabify - ${title}`,
        text,
        url: materiUrl,
      });
      return true;
    } catch {
      // User cancelled or error
    }
  }

  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Final fallback
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    return true;
  }
}
