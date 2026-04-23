# Tasks - Phase 8: Worker Onboarding and Profile

**Input**: Design documents from `specs/0080-worker-onboarding-and-profile/`
**Prerequisites**: `plan.md`, `spec.md`

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: Core synchronization and access control guards.

- [ ] T001 Create migration `supabase/migrations/20260423000000_user_sync_trigger.sql` to sync `auth.users` to `public.users`
- [ ] T002 Verify `public.users` synchronization by signing up a new user or manually triggering a sync
- [ ] T003 Implement worker onboarding guard in `src/lib/supabase/middleware.ts` (redirect to `/onboarding/worker` if profile missing)
- [ ] T004 Create worker action shell in `src/app/worker/actions.ts` with base error handling

---

## Phase 2: User Story 1 - Worker Onboarding Flow (P1) 🎯 MVP

**Goal**: Establish the entry point and initial profile creation.

- [ ] T005 Create onboarding page at `src/app/onboarding/worker/page.tsx`
- [ ] T006 Implement `WorkerOnboardingForm` structure in `src/components/worker/worker-onboarding-form.tsx`
- [ ] T007 Implement server action `upsertWorkerProfile` in `src/app/worker/actions.ts` for creation
- [ ] T008 [P] Add Identity & Basic Info fields (name/display name) to `WorkerOnboardingForm`
- [ ] T009 [P] Add Bio & Experience text area fields to `WorkerOnboardingForm`
- [ ] T010 [P] Add Location field (text input) to `WorkerOnboardingForm`
- [ ] T011 [P] Add Logistics fields (can_travel, has_tools) to `WorkerOnboardingForm`
- [ ] T012 Add Zod validation schema in `src/lib/validations/worker.ts`
- [ ] T013 Create worker dashboard entry page at `src/app/(protected)/dashboard/page.tsx` (if not existing) or link to it
- [ ] T014 Verify onboarding flow: Signup -> Redirect -> Form Submit -> Dashboard Entry

---

## Phase 3: User Story 2 - Profile Core Data Updates (P1)

**Goal**: Allow workers to manage their professional profiles after onboarding.

- [ ] T015 Create profile settings page at `src/app/(protected)/worker/settings/profile/page.tsx`
- [ ] T016 Implement `WorkerProfileForm` in `src/components/worker/worker-profile-form.tsx` (reusing logic from onboarding)
- [ ] T017 Connect `upsertWorkerProfile` action for updating existing records
- [ ] T018 Verify update flow: Dashboard -> Settings -> Edit -> Save -> Verify Persistence

---

## Phase 4: User Story 3 - Logistics & Availability (P2)

**Goal**: Refine logistics fields and availability state management.

- [ ] T019 Add Availability status toggle to `WorkerOnboardingForm` and `WorkerProfileForm`
- [ ] T020 Implement profile image placeholder and basic "expectation" UI for upload in `WorkerProfileForm`
- [ ] T021 [P] Add unit test for worker profile validation schema in `tests/unit/validations/worker.test.ts`
- [ ] T022 Verify availability state changes reflect correctly in the database

---

## Phase N: Polish & Cross-Cutting Concerns

- [ ] T023 Add skeleton loading states for profile forms during initial fetch
- [ ] T024 Implement toast notifications for successful profile updates
- [ ] T025 Ensure all auth routes correctly handle the `next` redirect parameter after profile creation
