# Implementation Plan: Phase 13 - Job Posting

**Branch**: `121-working-phase-13` | **Date**: 2026-04-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/0130-job-posting/spec.md`

## Summary

This phase establishes the customer-side demand flow by implementing a job posting form, a job listing view, and a job detail page within the unified dashboard system. It strictly relies on the existing category foundation and avoids application/booking/payment logic, ensuring all routes belong to `/dashboard` while ignoring legacy customer/worker paths.

## Technical Context

**Language/Version**: Next.js App Router / TypeScript
**Primary Dependencies**: React Server Components, Server Actions for mutations, Zod for validation, Supabase for DB and Auth.
**Storage**: PostgreSQL (`job_posts` table)
**Testing**: Local verification and build-time static checks (`npm run build`).
**Project Type**: Next.js Web App

## Implementation Strategy

### Route Structure

All job management routes reside solely within the authenticated dashboard layout:

- `src/app/(protected)/dashboard/jobs/page.tsx` (User's Job List)
- `src/app/(protected)/dashboard/jobs/new/page.tsx` (Creation Form)
- `src/app/(protected)/dashboard/jobs/[id]/page.tsx` (Job Detail View)

### Component Approach

- **Job Posting Form (`JobPostForm.tsx`)**: A structured React Hook Form + Zod component capturing:
  - `title` (text)
  - `description` (textarea)
  - `category_id` (select group querying active service categories)
  - `location_text` (text)
  - `budget_range` (text)
  - `is_negotiable` (checkbox)
  - `workers_needed` (number slider/input)
- **Category Selection Handling**: Dynamically grabs options via an imported `getActiveCategories()` helper from Phase 10.
- **Job List (`JobList.tsx` - Internal Dashboard Variante)**: React Server Component that lists jobs using basic cards. Status badges distinctly mark identical visual languages across states ("open", "filled", "cancelled").
- **Job Detail**: Read-only display of the job parameters acting as the anchor point for the next phase's (Phase 14) applicant tracking logic.

### Data Access Strategy

Introduces `src/lib/services/jobs.ts` mapping to the schema:

- `createJobPost({ title, description, category_id, location_text, budget_range, is_negotiable, workers_needed, status: 'open' })`
- `getCustomerJobs(customerId: string)` -> Renders the base `/dashboard/jobs` list.
- `getJobPostById(jobId: string, customerId: string)` -> Guards detail fetching ensuring privacy.

### Form & State Handling

Client-side state managed via React hooks interacting with a Next.js Server Action (`createJobAction`), using `useTransition` or native form status tools for pending states. Includes immediate redirect to the jobs list upon successful DB insertion.
k

### Validation Approach

Enforced rigidly using `zod`. Server actions must replicate schema validations protecting against payload bypasses, returning localized error messages to the client form.

### Loading/Error Handling

Local error boundaries placed at `/dashboard/jobs/error.tsx`. Loading skeletons provided via `/dashboard/jobs/loading.tsx` substituting card outlines seamlessly utilizing the recently added `Skeleton` standard UI component.

## File/Folder Impact

### Expected New Files

```text
src/lib/services/jobs.ts
src/app/(protected)/dashboard/jobs/page.tsx
src/app/(protected)/dashboard/jobs/loading.tsx
src/app/(protected)/dashboard/jobs/new/page.tsx
src/app/(protected)/dashboard/jobs/[id]/page.tsx
src/app/(protected)/dashboard/jobs/[id]/loading.tsx
src/components/jobs/JobPostForm.tsx
src/lib/validations/job.ts
```

### Expected Modified Files

```text
src/components/shared/nav/DashboardNav.tsx
```

## Verification Strategy

- **Validation Check**: Submission of empty forms successfully prompts field-level UI errors without executing queries.
- **Data Integrations**: Post-submission, the user's dashboard view updates reflecting the newly persisted row in the Supabase backend.
- **Route Access**: The detail view confirms fetching restricted row-level details successfully.

## Risks and Mitigations

- **Risk**: Database constraints block record insertion due to foreign key requirements mapped to a customer profile.
  - _Mitigation_: The feature must query auth context securely ensuring valid UUID insertion. Should prompt the user if they lack a Customer Profile beforehand.
- **Risk**: Users expecting application functionalities.
  - _Mitigation_: Clearly denote that applications are handled natively or label tabs as "Coming Soon" if placed preliminarily.

## Assumptions

- We are leveraging existing table structures created during Phase 3 layout plans (`job_posts`). Let us ensure it has all needed column types beforehand.
- We reuse the generic Button, Input, and Textarea UI packages in `src/components/ui/`.
- No booking integration endpoints need hooking up; jobs strictly rest as entity definitions during this stage.
