# Implementation Plan - Phase 8: Worker Onboarding and Profile

This plan establishes the foundation for worker profiles, including the onboarding flow, profile management, and identity synchronization between Supabase Auth and the public schema.

## Summary

The goal of this phase is to allow users to establish themselves as Workers. We will implement:

1.  **Identity Sync**: An automated DB trigger to populate `public.users`.
2.  **Onboarding Guard**: Middleware to enforce profile completion.
3.  **Onboarding Flow**: A dedicated UI for initial profile creation.
4.  **Profile Settings**: A management interface for workers to update their bio, location, and logistics.

## Proposed Changes

### 1. Database & Security (Supabase)

#### [NEW] [user_sync_trigger.sql](supabase/migrations/20260423000000_user_sync_trigger.sql)

- **Status**: Essential for `worker_profiles` foreign key constraints.
- **Change**: Create `handle_new_user()` function and `on_auth_user_created` trigger.

### 2. Middleware & Navigation

#### [MODIFY] [src/lib/supabase/middleware.ts](supabase/middleware.ts)

- **Change**: Add a check for `worker_profiles` existence for authenticated users attempting to access `/dashboard` or `/worker/*`.
- **Redirect**: If no profile exists, redirect to `/onboarding/worker`.

### 3. Components & Forms

#### [NEW] [src/components/worker/worker-onboarding-form.tsx](src/components/worker/worker-onboarding-form.tsx)

- **Role**: Initial onboarding state.
- **Fields**: Name, Bio, Experience, Location Text, Travel Toggle, Tools Toggle.
- **Validation**: Zod schema with strict requirements for bio and location.

#### [NEW] [src/components/worker/worker-profile-form.tsx](src/components/worker/worker-profile-form.tsx)

- **Role**: Active profile management (Edit Mode).
- **Functionality**: Loads existing data and supports patching.

### 4. Pages & Server Actions

#### [NEW] [src/app/onboarding/worker/page.tsx](src/app/onboarding/worker/page.tsx)

- Pure onboarding UI shell.

#### [NEW] [src/app/(protected)/worker/settings/profile/page.tsx](<src/app/(protected)/worker/settings/profile/page.tsx>)

- Professional profile management interface.

#### [NEW] [src/app/worker/actions.ts](src/app/worker/actions.ts)

- `upsertWorkerProfile`: Unified action to create/update the `worker_profiles` record.

## Verification Plan

### Automated Tests

- No existing tests found in `tests/*`.
- Propose adding a unit test for the worker profile validation schema in `tests/unit/validations/worker.test.ts`.

### Manual Verification

1. **Trigger Check**:
   - Create a new account via `/signup`.
   - Verify `public.users` table has the new row via `supabase console` or temporary query.
2. **Onboarding Guard**:
   - Log in as a new user.
   - Try to navigate to `/dashboard`.
   - Verify automatic redirect to `/onboarding/worker`.
3. **Flow Completion**:
   - Submit the onboarding form.
   - Verify success toast and redirect to `/dashboard`.
   - Verify `worker_profiles` row in DB.
4. **Edit Lifecycle**:
   - Navigate to `/worker/settings/profile`.
   - Mutate bio/location.
   - Save and refresh to verify persistence.
