-- Fix the UPDATE RLS policy for guarantor_submissions
-- In PostgreSQL, if an UPDATE policy lacks a WITH CHECK clause, the USING clause is used for both the old and new row.
-- Because we update the status from 'pending' to 'submitted', the new row failed the `status = 'pending'` check.

DROP POLICY IF EXISTS "Anyone can update pending guarantor submission" ON public.guarantor_submissions;

CREATE POLICY "Anyone can update pending guarantor submission"
ON public.guarantor_submissions FOR UPDATE
USING (status = 'pending')
WITH CHECK (status = 'submitted');
