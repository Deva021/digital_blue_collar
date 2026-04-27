# Execution Tasks: Phase 14 — Job Applications

**Branch**: `140-job-applications` | **Date**: 2026-04-27 | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Phase 1: Foundational Setup (Server Actions & Helpers)

- [ ] **Task 1.1: Create basic data access helpers for applications [P]**
  - **Description**: Add server-side helpers to insert applications and fetch applications for a job or worker.
  - **Files touches**: `src/app/(protected)/dashboard/actions/applications.ts` (create if needed, or add to existing logic file)
  - **Done When**: Helpers exist for fetching by job ID, fetching by worker ID, inserting an application, and updating application status.

- [ ] **Task 1.2: Implement duplicate check logic**
  - **Description**: Create server action `applyToJob(jobId, formData)` with explicit duplicate detection before DB insertion, wrapping Zod validation for message and proposed price.
  - **Files touched**: `src/app/(protected)/dashboard/actions/applications.ts`
  - **Done When**: Server action is fully typed, validates schema with Zod, checks for existing application, and leverages DB constraints.

## Phase 2: Worker Workflow (Available Jobs & Apply)

- [ ] **Task 2.1: Available Jobs page UI and Data Fetching**
  - **Description**: Create the dashboard view listing open jobs. sorted by worker's relevant categories optionally or just show all `open` jobs initially. Handle empty state.
  - **Files touched**: `src/app/(protected)/dashboard/jobs/available/page.tsx`, component files for list/empty state.
  - **Done When**: `/dashboard/jobs/available` successfully lists `open` jobs, handles empty and loading states.

- [ ] **Task 2.2: Apply to Job detail view**
  - **Description**: Add a detail page accessible from available jobs to view job details before applying.
  - **Files touched**: `src/app/(protected)/dashboard/jobs/available/[id]/page.tsx`
  - **Done When**: Job details render successfully at the endpoint with a back-link to available jobs list.

- [ ] **Task 2.3: Application Form Component**
  - **Description**: Build the client-side form capturing `application_message` and `proposed_price`.
  - **Files touched**: `src/components/features/applications/ApplyToJobForm.tsx`
  - **Done When**: Form validates required constraints client-side via react-hook-form/Zod and calls the server action, disabling during submission.

- [ ] **Task 2.4: Integrate Form & Duplicate Prevention UI**
  - **Description**: Render `ApplyToJobForm` in the detail view. Check if user already applied and display a "Already Applied" blocked state instead of the form.
  - **Files touched**: `src/app/(protected)/dashboard/jobs/available/[id]/page.tsx`
  - **Done When**: UI prevents submitting the form twice; after submission, successful application redirects or updates state to show 'Applied'.

## Phase 3: Worker Applications Management

- [ ] **Task 3.1: Worker Applications List View**
  - **Description**: Create the page for workers to view all jobs they've applied for, fetching their history.
  - **Files touched**: `src/app/(protected)/dashboard/applications/page.tsx`
  - **Done When**: Worker can navigate to the route and see a listed history of their applications.

- [ ] **Task 3.2: Status Display Component [P]**
  - **Description**: Build UI badges to represent `pending`, `accepted`, and `rejected` states uniformly across lists.
  - **Files touched**: `src/components/features/applications/ApplicationStatusBadge.tsx`
  - **Done When**: Badge component natively styles the three explicit statuses.

- [ ] **Task 3.3: Finalize Worker App UI hooks**
  - **Description**: Add list integration with the badge component and proper date formatting and proposed price.
  - **Files touched**: `src/app/(protected)/dashboard/applications/page.tsx`
  - **Done When**: The worker application list clearly shows dates, prices, job titles, and accurate statuses, alongside empty state handling.

## Phase 4: Job Owner Workflow (Review & Accept)

- [ ] **Task 4.1: Receive Applications View Setup**
  - **Description**: Create the job owner's view for reading submitted applications for their job. Includes server-side auth assertions to verify current user is the job owner.
  - **Files touched**: `src/app/(protected)/dashboard/jobs/[id]/applications/page.tsx`
  - **Done When**: Page loads for the job owner showing a basic mapping of applicants or an empty state, and inherently blocks non-owners from viewing it.

- [ ] **Task 4.2: Applicant Card Component [P]**
  - **Description**: Create the individual UI card structure bringing together the worker's basic profile details, their message, proposed price, and current status.
  - **Files touched**: `src/components/features/applications/ApplicantCard.tsx`
  - **Done When**: The card faithfully renders applicant intent and identity alongside standard action slots.

- [ ] **Task 4.3: Accept/Reject Server Actions**
  - **Description**: Write `reviewApplication(appId, 'accepted' | 'rejected')`. Must enforce job ownership and prevent accepting if another is already accepted. Triggers Next.js revalidation.
  - **Files touched**: `src/app/(protected)/dashboard/actions/applications.ts`
  - **Done When**: Review action updates row status accurately and errors appropriately if rules are breached.

- [ ] **Task 4.4: Integrate Accept/Reject Flow**
  - **Description**: Wire buttons in `ApplicantCard` inside the view to trigger the review actions, using `useTransition` for inline loading.
  - **Files touched**: `src/components/features/applications/ApplicantCard.tsx`, `src/app/(protected)/dashboard/jobs/[id]/applications/page.tsx`
  - **Done When**: Job owner can click Accept/Reject, buttons yield inline spinners, and state seamlessly updates on completion without full-page reloads.

## Phase 5: Final Navigation & Polish

- [ ] **Task 5.1: Navigation Wiring**
  - **Description**: Link `/dashboard/jobs/[id]/applications` from the existing Job Detail page for the owner. Link `/dashboard/applications` in the sidebar or worker navigation area. List `/dashboard/jobs/available` prominently.
  - **Files touched**: Nav layouts, `src/app/(protected)/dashboard/jobs/[id]/page.tsx` (from Phase 13).
  - **Done When**: Easy connectivity through dashboard UI paths exists without typed URL guesses.

- [ ] **Task 5.2: Error Boundary & Loading Sweeps**
  - **Description**: Ensure loading states and error boundaries are correctly positioned on all new dashboard routes.
  - **Files touched**: Multiple `loading.tsx` and `error.tsx` at the new route segments.
  - **Done When**: Heavy loads or intentional errors transition gracefully gracefully inside the unified dashboard shell.
