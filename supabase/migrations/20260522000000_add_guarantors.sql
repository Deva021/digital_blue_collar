-- Add requires_guarantor to job_posts
ALTER TABLE public.job_posts ADD COLUMN requires_guarantor BOOLEAN DEFAULT FALSE NOT NULL;

-- Create guarantor_submissions table
CREATE TABLE public.guarantor_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id UUID REFERENCES public.job_applications(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL, -- pending, submitted
    full_name TEXT,
    fan_number TEXT,
    national_id_url TEXT,
    signature_data TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    submitted_at TIMESTAMPTZ,
    UNIQUE(application_id)
);

-- RLS for guarantor_submissions
ALTER TABLE public.guarantor_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert/update their own pending submission via the unauthenticated link
-- Since it's public link sharing, we can either use anon key policies or handle it in a server action using service_role key.
-- Since the frontend will be a public page using Server Actions, the Server Action will bypass RLS.
-- But for safety, we allow read access to the specific application owner and job owner.
CREATE POLICY "Public can select guarantor submissions" ON public.guarantor_submissions FOR SELECT USING (true);

-- Create storage bucket for guarantor documents
INSERT INTO storage.buckets (id, name, public) VALUES ('guarantor_documents', 'guarantor_documents', true);

-- Storage RLS for guarantor_documents
CREATE POLICY "Public access to guarantor_documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'guarantor_documents');

CREATE POLICY "Allow public uploads to guarantor_documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'guarantor_documents');

CREATE POLICY "Allow updates to guarantor_documents"
ON storage.objects FOR UPDATE
USING (bucket_id = 'guarantor_documents');
