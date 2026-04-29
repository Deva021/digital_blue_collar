-- Migration: Add location_text to bookings table
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS location_text text;
