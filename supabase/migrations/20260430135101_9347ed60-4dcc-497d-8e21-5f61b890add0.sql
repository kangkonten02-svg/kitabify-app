-- =====================================================
-- Gamification: user_progress, user_xp, user_streak
-- Extends the existing schema without modifying any
-- existing tables, columns, or policies.
-- =====================================================

-- ---------- user_progress ----------
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kitab_id TEXT NOT NULL,
  jilid_id TEXT NOT NULL,
  bab_id TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  best_quiz_score INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, bab_id)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_bab ON public.user_progress(user_id, bab_id);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own progress"
  ON public.user_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own progress"
  ON public.user_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own progress"
  ON public.user_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin views all progress"
  ON public.user_progress FOR SELECT TO authenticated
  USING ((SELECT email FROM auth.users WHERE id = auth.uid())::text = 'kitabifyid@gmail.com');

-- ---------- user_xp ----------
CREATE TABLE IF NOT EXISTS public.user_xp (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  lifetime_xp INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_xp ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own xp"
  ON public.user_xp FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own xp"
  ON public.user_xp FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own xp"
  ON public.user_xp FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin views all xp"
  ON public.user_xp FOR SELECT TO authenticated
  USING ((SELECT email FROM auth.users WHERE id = auth.uid())::text = 'kitabifyid@gmail.com');

-- ---------- user_streak ----------
CREATE TABLE IF NOT EXISTS public.user_streak (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_claim_date DATE,
  hearts INTEGER NOT NULL DEFAULT 5,
  hearts_updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_streak ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own streak"
  ON public.user_streak FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own streak"
  ON public.user_streak FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own streak"
  ON public.user_streak FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin views all streak"
  ON public.user_streak FOR SELECT TO authenticated
  USING ((SELECT email FROM auth.users WHERE id = auth.uid())::text = 'kitabifyid@gmail.com');

-- ---------- updated_at trigger ----------
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_user_progress_touch
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER trg_user_xp_touch
  BEFORE UPDATE ON public.user_xp
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER trg_user_streak_touch
  BEFORE UPDATE ON public.user_streak
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();