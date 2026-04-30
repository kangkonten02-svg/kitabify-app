import { useEffect, useState } from "react";
import { Heart, Flame, Star } from "lucide-react";
import {
  MAX_HEARTS,
  getHearts,
  secondsToNextHeart,
  refillHeartsWithExp,
  HEART_REFILL_COST,
} from "@/lib/gamification";
import { getUser } from "@/lib/store";

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const HeartsBar = () => {
  const [hearts, setHearts] = useState(getHearts());
  const [secs, setSecs] = useState(secondsToNextHeart());
  const [, setTick] = useState(0);

  useEffect(() => {
    const refresh = () => {
      setHearts(getHearts());
      setSecs(secondsToNextHeart());
    };
    const t = setInterval(refresh, 1000);
    const handler = () => refresh();
    window.addEventListener("kitabify:hearts", handler);
    window.addEventListener("storage", handler);
    return () => {
      clearInterval(t);
      window.removeEventListener("kitabify:hearts", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const u = getUser();
  const streak = u?.streak ?? 0;
  const exp = u?.exp ?? 0;

  const handleRefill = () => {
    if (refillHeartsWithExp()) {
      setHearts(MAX_HEARTS);
      setSecs(0);
      setTick((x) => x + 1);
    } else {
      alert(`Butuh ${HEART_REFILL_COST} EXP untuk mengisi ulang nyawa.`);
    }
  };

  return (
    <div className="flex items-center gap-2 text-xs font-bold">
      {/* Streak */}
      <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400">
        <Flame size={14} className="fill-orange-400/40" />
        <span>{streak}</span>
      </div>
      {/* XP */}
      <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-accent/15 border border-accent/40 text-accent">
        <Star size={14} className="fill-accent/40" />
        <span>{exp}</span>
      </div>
      {/* Hearts */}
      <button
        onClick={hearts < MAX_HEARTS ? handleRefill : undefined}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500/25 transition"
        title={hearts < MAX_HEARTS ? `Refill (${HEART_REFILL_COST} EXP)` : "Hearts penuh"}
      >
        <Heart size={14} className="fill-rose-400/60" />
        <span>{hearts}/{MAX_HEARTS}</span>
        {hearts < MAX_HEARTS && secs > 0 && (
          <span className="ml-1 text-[10px] opacity-80 font-medium">{fmt(secs)}</span>
        )}
      </button>
    </div>
  );
};

export default HeartsBar;