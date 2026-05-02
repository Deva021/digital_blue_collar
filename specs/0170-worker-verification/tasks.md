---
description: "Task list for Phase 17 — Worker Verification"
---

# Tasks: Worker Verification

**Input**: Design documents from `./`
**Prerequisites**: plan.md, spec.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

---

## Phase 1: Foundational (Database & Storage)

**Purpose**: Core schema updates and storage bucket creation that must be complete before UI components.

- [ ] T001 Create a new migration file (e.g., `[timestamp]_add_verification_storage.sql`) in `supabase/migrations/`.
- [ ] T002 Implement migration to add `selfie_url` (text, nullable) to `verification_requests` table.
- [ ] T003 Implement migration to add `verification_status` (enum `verification_status`, default 'unverified') to `worker_profiles`.
- [ ] T004 Implement migration trigger to sync `worker_profiles.verification_status` whenever the latest `verification_requests.status` changes for that worker.
- [ ] T005 Implement migration to create the `verification_documents` storage bucket.
- [ ] T006 Implement migration to add strict RLS policies on `verification_documents` bucket (workers can insert and read their own files).
- [ ] T007 [Manual] Leave the migration file for the user to run; do not execute `supabase migration up` or equivalent locally.

**Checkpoint**: Database schema and storage buckets are ready.

---

## Phase 2: User Story 1 - Submit Verification Documents (P1)

**Goal**: Workers can access the dashboard route and submit their verification files.

- [ ] T008 [P] [US1] Create Zod schema for verification submission in `src/features/verification/schemas.ts` (validate document is required, selfie is optional, check types/sizes).
- [ ] T009 [US1] Create server action `submitVerification` in `src/features/verification/actions/submitVerification.ts` that handles `FormData`, uploads to `verification_documents` bucket, and inserts into `verification_requests` with 'pending' status.
- [ ] T010 [US1] Update server action to prevent duplicate active submissions (i.e., return error if user already has a 'pending' or 'verified' request).
- [ ] T011 [P] [US1] Create `VerificationForm` component in `src/components/verification/VerificationForm.tsx` with inputs for document upload and selfie upload, including client-side validation.
- [ ] T012 [US1] Add loading states (disabling submit button during upload) and error handling (toast messages) to `VerificationForm`.
- [ ] T013 [P] [US1] Create `/dashboard/verification/page.tsx` server component.
- [ ] T014 [US1] Render `VerificationForm` on the `/dashboard/verification` page with a clear empty/unverified state title and description.
- [ ] T015 [US1] Add dashboard navigation/back link to the verification page header.

**Checkpoint**: Workers can successfully upload files, which save to Supabase Storage and create a 'pending' DB row.

---

## Phase 3: User Story 2 - View Verification Status (P1)

**Goal**: Workers see their current verification status and are blocked from submitting if pending or approved.

- [ ] T016 [P] [US2] Create `VerificationStatusAlert` component in `src/components/verification/VerificationStatusAlert.tsx` to handle visual display of 'pending', 'verified', and 'rejected' states.
- [ ] T017 [US2] Update `VerificationStatusAlert` to accept and display `admin_notes` if the status is 'rejected'.
- [ ] T018 [US2] Update `/dashboard/verification/page.tsx` to fetch the user's latest `verification_requests` row on load.
- [ ] T019 [US2] Update `/dashboard/verification/page.tsx` conditional rendering: if status is 'pending' or 'verified', show only `VerificationStatusAlert`.
- [ ] T020 [US2] Update `/dashboard/verification/page.tsx` conditional rendering: if status is 'rejected' or 'unverified' (or no row exists), show `VerificationStatusAlert` (if rejected) *and* the `VerificationForm` to allow a new submission.
- [ ] T021 [US2] Add a `/dashboard/verification/loading.tsx` to show a skeleton state while fetching verification status.

**Checkpoint**: Verification page correctly toggles between upload form and status view depending on the worker's data.

---

## Phase 4: User Story 3 - Display Verified Badge (P2)

**Goal**: Customers and other users see a verified badge next to the worker's name if they are approved.

- [ ] T022 [P] [US3] Create `VerifiedBadge` UI component in `src/components/ui/VerifiedBadge.tsx` (e.g., using `lucide-react` badge-check icon with a tooltip).
- [ ] T023 [US3] Update `WorkerList` component in `src/components/search/WorkerList.tsx` to fetch `verification_status` (from `worker_profiles`) and conditionally render `VerifiedBadge`.
- [ ] T024 [US3] Update dashboard discover page `src/app/(protected)/dashboard/discover/page.tsx` (or wherever worker profile details are shown) to render the `VerifiedBadge` if approved.
- [ ] T025 [US3] Validate that workers with 'pending' or 'rejected' status do *not* display the verified badge.

**Checkpoint**: Verified workers show a badge in search/lists.

---

## Implementation Strategy

1. **Phase 1** must be completed first to provide the backend data shapes.
2. **Phase 2 & Phase 3** should be built together so the submission immediately updates the UI to pending.
3. **Phase 4** can be implemented independently once the backend schema allows mock data (e.g., manually setting a worker to 'verified' in the DB) to test the badge UI.
