-- T002: Add selfie_url to verification_requests
ALTER TABLE public.verification_requests 
ADD COLUMN selfie_url text;

-- T003: Add verification_status to worker_profiles
ALTER TABLE public.worker_profiles 
ADD COLUMN verification_status verification_status default 'unverified' not null;

-- T004: Implement migration trigger to sync worker_profiles.verification_status
CREATE OR REPLACE FUNCTION sync_worker_verification_status()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.worker_profiles
  SET verification_status = NEW.status
  WHERE id = NEW.worker_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_sync_verification_status
AFTER INSERT OR UPDATE OF status ON public.verification_requests
FOR EACH ROW
EXECUTE FUNCTION sync_worker_verification_status();

-- T005 & T006: Create verification_documents storage bucket and RLS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('verification_documents', 'verification_documents', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);

-- Allow workers to insert documents
CREATE POLICY "Workers can upload verification documents" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'verification_documents' AND 
  (auth.uid())::text = (string_to_array(name, '/'))[1]
);

-- Allow workers to read their own documents
CREATE POLICY "Workers can read own verification documents" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'verification_documents' AND 
  (auth.uid())::text = (string_to_array(name, '/'))[1]
);

-- Allow workers to update/delete their own documents (if needed for re-submission)
CREATE POLICY "Workers can update own verification documents" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'verification_documents' AND 
  (auth.uid())::text = (string_to_array(name, '/'))[1]
);

CREATE POLICY "Workers can delete own verification documents" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'verification_documents' AND 
  (auth.uid())::text = (string_to_array(name, '/'))[1]
);
