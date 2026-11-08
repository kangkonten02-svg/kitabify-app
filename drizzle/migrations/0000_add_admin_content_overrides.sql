CREATE TABLE public.content_overrides (
  content_id text PRIMARY KEY,
  payload jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

CREATE TABLE public.quiz_overrides (
  jilid_id text NOT NULL,
  bab_id text NOT NULL,
  payload jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid,
  PRIMARY KEY (jilid_id, bab_id)
);

GRANT SELECT ON public.content_overrides TO anon, authenticated;
GRANT INSERT, UPDATE ON public.content_overrides TO authenticated;
GRANT ALL ON public.content_overrides TO service_role;

GRANT SELECT ON public.quiz_overrides TO anon, authenticated;
GRANT INSERT, UPDATE ON public.quiz_overrides TO authenticated;
GRANT ALL ON public.quiz_overrides TO service_role;

ALTER TABLE public.content_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read content overrides"
ON public.content_overrides FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Root admin can insert content overrides"
ON public.content_overrides FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM auth.users WHERE users.id = auth.uid() AND users.email = 'kitabifyid@gmail.com'));

CREATE POLICY "Root admin can update content overrides"
ON public.content_overrides FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM auth.users WHERE users.id = auth.uid() AND users.email = 'kitabifyid@gmail.com'))
WITH CHECK (EXISTS (SELECT 1 FROM auth.users WHERE users.id = auth.uid() AND users.email = 'kitabifyid@gmail.com'));

CREATE POLICY "Anyone can read quiz overrides"
ON public.quiz_overrides FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Root admin can insert quiz overrides"
ON public.quiz_overrides FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM auth.users WHERE users.id = auth.uid() AND users.email = 'kitabifyid@gmail.com'));

CREATE POLICY "Root admin can update quiz overrides"
ON public.quiz_overrides FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM auth.users WHERE users.id = auth.uid() AND users.email = 'kitabifyid@gmail.com'))
WITH CHECK (EXISTS (SELECT 1 FROM auth.users WHERE users.id = auth.uid() AND users.email = 'kitabifyid@gmail.com'));