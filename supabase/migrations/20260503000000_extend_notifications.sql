-- Add type and action_url to notifications
ALTER TABLE public.notifications ADD COLUMN type text;
ALTER TABLE public.notifications ADD COLUMN action_url text;

-- Create index for faster querying by type (optional but helpful)
CREATE INDEX idx_notifications_type ON public.notifications(type);
