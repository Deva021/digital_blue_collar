-- Fix RLS policies for guarantor_submissions

-- Allow authenticated workers to insert a guarantor submission for their own application
CREATE POLICY "Workers can insert guarantor submission for own application"
ON public.guarantor_submissions FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.job_applications 
        WHERE id = guarantor_submissions.application_id 
        AND worker_id = auth.uid()
    )
);

-- Allow anyone (including anon) to update a pending guarantor submission
CREATE POLICY "Anyone can update pending guarantor submission"
ON public.guarantor_submissions FOR UPDATE
USING (status = 'pending');
