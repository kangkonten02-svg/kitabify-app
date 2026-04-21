import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  computeActive,
  fetchMySubscription,
  type ActiveSubscription,
  type Subscription,
} from "@/lib/subscription";

export function useSubscription() {
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const s = await fetchMySubscription();
    setSub(s);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    // Real-time subscription on changes
    const channel = supabase
      .channel("my-subscription")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "subscriptions" },
        () => refresh()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh]);

  const active: ActiveSubscription = computeActive(sub);

  return { sub, active, loading, refresh };
}
