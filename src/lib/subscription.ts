import { supabase } from "@/integrations/supabase/client";

export type SubscriptionTier = "FREE" | "VIP" | "VVIP";

export interface Subscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  trial_tier: SubscriptionTier | null;
  trial_started_at: string | null;
  trial_expires_at: string | null;
  paid_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActiveSubscription {
  effectiveTier: SubscriptionTier;
  source: "paid" | "trial" | "free";
  expiresAt: Date | null;
  daysLeft: number | null;
  raw: Subscription | null;
}

export function computeActive(sub: Subscription | null): ActiveSubscription {
  if (!sub) {
    return { effectiveTier: "FREE", source: "free", expiresAt: null, daysLeft: null, raw: null };
  }
  const now = Date.now();
  const paid = sub.paid_expires_at ? new Date(sub.paid_expires_at) : null;
  const trial = sub.trial_expires_at ? new Date(sub.trial_expires_at) : null;

  if (paid && paid.getTime() > now) {
    const days = Math.ceil((paid.getTime() - now) / 86400000);
    return { effectiveTier: sub.tier, source: "paid", expiresAt: paid, daysLeft: days, raw: sub };
  }
  if (trial && trial.getTime() > now && sub.trial_tier) {
    const days = Math.ceil((trial.getTime() - now) / 86400000);
    return {
      effectiveTier: sub.trial_tier,
      source: "trial",
      expiresAt: trial,
      daysLeft: days,
      raw: sub,
    };
  }
  return { effectiveTier: "FREE", source: "free", expiresAt: null, daysLeft: 0, raw: sub };
}

export async function fetchMySubscription(): Promise<Subscription | null> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userData.user.id)
    .maybeSingle();
  if (error) return null;
  return data as Subscription | null;
}

// Materi yang boleh diakses user FREE
export const FREE_MATERI_KEYS = ["jilid1", "jilid2", "kholasoh"];

export function canAccessMateri(materiKey: string, tier: SubscriptionTier): boolean {
  if (tier === "VIP" || tier === "VVIP") return true;
  return FREE_MATERI_KEYS.includes(materiKey);
}
