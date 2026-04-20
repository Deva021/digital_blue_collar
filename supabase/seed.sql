-- 1. Seed `service_categories` with Ethiopia-specific service hierarchy (T015)
-- First, verify extensions matching migration.
create extension if not exists "uuid-ossp";

-- Delete all first to ensure clean state
truncate table public.service_categories cascade;
truncate table public.users cascade;

-- Insert Categories
INSERT INTO public.service_categories (id, name, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'Home Services', true),
('22222222-2222-2222-2222-222222222222', 'Agriculture', true),
('33333333-3333-3333-3333-333333333333', 'Construction & Skilled Work', true),
('44444444-4444-4444-4444-444444444444', 'Transport & Logistics', true),
('55555555-5555-5555-5555-555555555555', 'General Labor', true);

-- Insert Subcategories
INSERT INTO public.service_categories (id, name, parent_id, is_active) VALUES
-- Home Services
('11111111-0000-0000-0000-000000000001', 'Laundry (Hand Washing)', '11111111-1111-1111-1111-111111111111', true),
('11111111-0000-0000-0000-000000000002', 'House Cleaning', '11111111-1111-1111-1111-111111111111', true),
('11111111-0000-0000-0000-000000000003', 'Injera Baking', '11111111-1111-1111-1111-111111111111', true),
('11111111-0000-0000-0000-000000000004', 'Cooking Assistance', '11111111-1111-1111-1111-111111111111', true),

-- Agriculture
('22222222-0000-0000-0000-000000000001', 'Plowing', '22222222-2222-2222-2222-222222222222', true),
('22222222-0000-0000-0000-000000000002', 'Planting', '22222222-2222-2222-2222-222222222222', true),
('22222222-0000-0000-0000-000000000003', 'Weeding', '22222222-2222-2222-2222-222222222222', true),
('22222222-0000-0000-0000-000000000004', 'Harvesting', '22222222-2222-2222-2222-222222222222', true),
('22222222-0000-0000-0000-000000000005', 'Animal Care', '22222222-2222-2222-2222-222222222222', true),

-- Construction & Skilled Work
('33333333-0000-0000-0000-000000000001', 'Masonry', '33333333-3333-3333-3333-333333333333', true),
('33333333-0000-0000-0000-000000000002', 'Carpentry', '33333333-3333-3333-3333-333333333333', true),
('33333333-0000-0000-0000-000000000003', 'Painting', '33333333-3333-3333-3333-333333333333', true),
('33333333-0000-0000-0000-000000000004', 'Welding', '33333333-3333-3333-3333-333333333333', true),
('33333333-0000-0000-0000-000000000005', 'Electrical Work', '33333333-3333-3333-3333-333333333333', true),
('33333333-0000-0000-0000-000000000006', 'Plumbing', '33333333-3333-3333-3333-333333333333', true),

-- Transport & Logistics
('44444444-0000-0000-0000-000000000001', 'Driver for Hire', '44444444-4444-4444-4444-444444444444', true),
('44444444-0000-0000-0000-000000000002', 'Goods Transport', '44444444-4444-4444-4444-444444444444', true),
('44444444-0000-0000-0000-000000000003', 'Delivery Assistance', '44444444-4444-4444-4444-444444444444', true),

-- General Labor
('55555555-0000-0000-0000-000000000001', 'Loading & Unloading', '55555555-5555-5555-5555-555555555555', true),
('55555555-0000-0000-0000-000000000002', 'Daily Labor Work', '55555555-5555-5555-5555-555555555555', true),
('55555555-0000-0000-0000-000000000003', 'Moving Assistance', '55555555-5555-5555-5555-555555555555', true);

-- 2. T016 Seed Mock Users (Worker, Customer, Hybrid)
-- NOTE: We insert directly into public.users. auth.users is managed by Supabase, so 
-- these records wouldn't be log-in-able without an auth.users hook, but this serves for UI development mapping.
INSERT INTO public.users (id, email) VALUES 
('aaaa1111-1111-1111-1111-111111111111', 'worker@example.com'),
('bbbb2222-2222-2222-2222-222222222222', 'customer@example.com'),
('cccc3333-3333-3333-3333-333333333333', 'hybrid@example.com');

-- Insert into profiles
INSERT INTO public.worker_profiles (id, bio, availability_status, location_text) VALUES 
('aaaa1111-1111-1111-1111-111111111111', 'Experienced plumber and electrician.', 'available', 'Addis Ababa, Bole'),
('cccc3333-3333-3333-3333-333333333333', 'Hardworking loader, can help move anything heavy.', 'busy', 'Addis Ababa, Piassa');

INSERT INTO public.customer_profiles (id, location_text) VALUES 
('bbbb2222-2222-2222-2222-222222222222', 'Addis Ababa, CMC'),
('cccc3333-3333-3333-3333-333333333333', 'Addis Ababa, Piassa');

-- Setup worker categories
INSERT INTO public.worker_categories (worker_id, category_id) VALUES
('aaaa1111-1111-1111-1111-111111111111', '33333333-0000-0000-0000-000000000006'), -- Plumbing
('cccc3333-3333-3333-3333-333333333333', '55555555-0000-0000-0000-000000000001'); -- Loading & Unloading

-- Setup worker specific services
INSERT INTO public.worker_services (worker_id, category_id, base_price, is_negotiable, description) VALUES
('aaaa1111-1111-1111-1111-111111111111', '33333333-0000-0000-0000-000000000006', 500, true, 'Basic pipe fixes and inspection'),
('cccc3333-3333-3333-3333-333333333333', '55555555-0000-0000-0000-000000000001', 300, true, 'Hourly loading and packing');

-- 3. T017 Seed Sample Market Data
-- Add job post
INSERT INTO public.job_posts (customer_id, category_id, title, description, location_text, budget_range, status) VALUES
('bbbb2222-2222-2222-2222-222222222222', '55555555-0000-0000-0000-000000000001', 'Need help moving furniture', 'Looking for 2 strong people to load a truck with my household items', 'Addis Ababa, CMC', '500-1000 ETB', 'open'),
('bbbb2222-2222-2222-2222-222222222222', '33333333-0000-0000-0000-000000000006', 'Fix leaking pipe', 'The pipe under my kitchen sink is leaking heavily', 'Addis Ababa, CMC', 'Negotiable', 'open');

-- Add one application to the open loading job
WITH target_job AS (SELECT id FROM public.job_posts WHERE title = 'Need help moving furniture' LIMIT 1)
INSERT INTO public.job_applications (worker_id, job_post_id, proposed_price, message, status)
SELECT 'cccc3333-3333-3333-3333-333333333333', id, 600, 'I can come tomorrow morning and help finish quickly!', 'pending'
FROM target_job;
