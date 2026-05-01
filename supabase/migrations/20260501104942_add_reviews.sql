-- Add index on reviewee_id for fast lookup
CREATE INDEX IF NOT EXISTS reviews_reviewee_id_idx ON public.reviews (reviewee_id);
-- Add index on reviewer_id for fast lookup
CREATE INDEX IF NOT EXISTS reviews_reviewer_id_idx ON public.reviews (reviewer_id);

-- Allow authenticated customers to create reviews for their own bookings
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'reviews' AND policyname = 'Customers can insert own reviews'
    ) THEN
        CREATE POLICY "Customers can insert own reviews" 
            ON public.reviews FOR INSERT 
            WITH CHECK (auth.uid() = reviewer_id);
    END IF;
END
$$;

-- Function to get average rating and count
CREATE OR REPLACE FUNCTION public.get_worker_rating_summary(p_worker_id uuid)
RETURNS TABLE (
    average_rating numeric,
    review_count bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROUND(AVG(rating)::numeric, 1) AS average_rating,
        COUNT(*) AS review_count
    FROM public.reviews
    WHERE reviewee_id = p_worker_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
