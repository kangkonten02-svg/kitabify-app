DROP POLICY "Root admin can insert content overrides" ON public.content_overrides;
DROP POLICY "Root admin can update content overrides" ON public.content_overrides;
DROP POLICY "Root admin can insert quiz overrides" ON public.quiz_overrides;
DROP POLICY "Root admin can update quiz overrides" ON public.quiz_overrides;

CREATE POLICY "Root admin can insert content overrides"
ON public.content_overrides FOR INSERT TO authenticated
WITH CHECK ((auth.jwt() ->> 'email') = 'kitabifyid@gmail.com');

CREATE POLICY "Root admin can update content overrides"
ON public.content_overrides FOR UPDATE TO authenticated
USING ((auth.jwt() ->> 'email') = 'kitabifyid@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'kitabifyid@gmail.com');

CREATE POLICY "Root admin can insert quiz overrides"
ON public.quiz_overrides FOR INSERT TO authenticated
WITH CHECK ((auth.jwt() ->> 'email') = 'kitabifyid@gmail.com');

CREATE POLICY "Root admin can update quiz overrides"
ON public.quiz_overrides FOR UPDATE TO authenticated
USING ((auth.jwt() ->> 'email') = 'kitabifyid@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'kitabifyid@gmail.com');