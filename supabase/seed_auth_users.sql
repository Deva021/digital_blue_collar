-- Script to inject the seeded dummy users directly into Supabase auth.users
-- This allows you to login with 'password123' for the respective seeded emails.
-- Run this manually in your hosted Supabase SQL Editor.

-- Requires the pgcrypto extension to properly hash the passwords
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) 
VALUES
  (
    '00000000-0000-0000-0000-000000000000',
    'aaaa1111-1111-1111-1111-111111111111',
    'authenticated',
    'authenticated',
    'worker@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'bbbb2222-2222-2222-2222-222222222222',
    'authenticated',
    'authenticated',
    'customer@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'cccc3333-3333-3333-3333-333333333333',
    'authenticated',
    'authenticated',
    'hybrid@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
ON CONFLICT (id) DO NOTHING;

-- Also seed the associated identities for JWT consistency
INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
VALUES
  (
    'aaaa1111-1111-1111-1111-111111111111',
    'aaaa1111-1111-1111-1111-111111111111',
    'aaaa1111-1111-1111-1111-111111111111',
    format('{"sub":"%s","email":"%s"}', 'aaaa1111-1111-1111-1111-111111111111', 'worker@example.com')::jsonb,
    'email',
    now(),
    now(),
    now()
  ),
  (
    'bbbb2222-2222-2222-2222-222222222222',
    'bbbb2222-2222-2222-2222-222222222222',
    'bbbb2222-2222-2222-2222-222222222222',
    format('{"sub":"%s","email":"%s"}', 'bbbb2222-2222-2222-2222-222222222222', 'customer@example.com')::jsonb,
    'email',
    now(),
    now(),
    now()
  ),
  (
    'cccc3333-3333-3333-3333-333333333333',
    'cccc3333-3333-3333-3333-333333333333',
    'cccc3333-3333-3333-3333-333333333333',
    format('{"sub":"%s","email":"%s"}', 'cccc3333-3333-3333-3333-333333333333', 'hybrid@example.com')::jsonb,
    'email',
    now(),
    now(),
    now()
  )
ON CONFLICT (provider_id, provider) DO NOTHING;
