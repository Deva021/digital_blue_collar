# Implementation Plan: Phase 14 — Job Applications

**Branch**: `140-job-applications` | **Date**: 2026-04-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/0140-job-applications/spec.md`

## Summary

This phase implements the "Job Applications" functionality, bridging customer demand (open jobs) and worker supply (interest). It enables workers to browse jobs matching their service categories and apply with a proposed price and short message. Conversely, it allows the job owner (customer) to review these applications and accept (or reject) a candidate. This stops short of creating booking records and explicitly omits notifications.

## Technical Context

**Language/Version**: TypeScript / Next.js 14+ (App Router)  
**Primary Dependencies**: React, TailwindCSS, Supabase (JS Client + SSR helpers), Zod, React Hook Form, Lucide Icons  
**Storage**: PostgreSQL (via Supabase)  
**Target Platform**: Web (Mobile-first responsive dashboard)  
**Project Type**: Next.js Full Stack Web Application

## Constitution Check

- **Clarity over Cleverness**: Server actions will remain simple data wrappers using Supabase inserts/updates. No complex state machines for application statuses; just standard enums.
- **Simple First**: No real-time subscriptions for status updates; standard Next.js revalidation strategy instead.
- **Authorization by Default**: Strict Row Level Security (RLS) augmented by Server Action guard checks (e.g., verifying user is the `customer_id` of the job before allowing accept/reject).
- **Validate Inputs**: All incoming data (messages, prices, application IDs) validated using Zod combined with `next-safe-action` or direct parsing before hitting Supabase.

## Project Structure

### Documentation (this feature)

```text
specs/0140-job-applications/
├── spec.md              # Feature specification
├── plan.md              # This file
└── tasks.md             # To be generated via /speckit.tasks
```

### Source Code

All pages exist within the `(protected)/dashboard` hierarchy.

```text
src/
├── app/(protected)/dashboard/
│   ├── applications/              # Worker applications view
│   │   └── page.tsx
│   └── jobs/
│       ├── available/             # Available jobs to apply for
│       │   ├── page.tsx
│       │   └── [id]/              # View job to apply
│       │       └── page.tsx
│       └── [id]/applications/     # Owner's application review view
│           └── page.tsx
├── components/
│   └── features/
│       └── applications/          # New feature components
│           ├── ApplyToJobForm.tsx
│           ├── ApplicantCard.tsx
│           ├── ApplicationStatusBadge.tsx
│           └── ApplicationList.tsx
└── types/
    └── index.ts                   # Add enums if needed
```

## Dashboard Route Structure & Approach

1. **`/dashboard/jobs/available`**
   - **Audience**: Workers.
   - **Approach**: Fetch `job_posts` where `status = 'open'`. Filter the query geographically (if required) or primarily by checking if the job's `category_id` matches any `category_id` the current user's profile has in `worker_categories`. Render as a grid/list of `JobCard`s.
2. **`/dashboard/jobs/available/[id]`**
   - **Audience**: Workers.
   - **Approach**: Detailed view of a job. Includes the `ApplyToJobForm` client component. Handles server-side duplicate check (is there already a record in `job_applications` with this `job_id` and the user's `id`). If true, disable form and show "Already Applied."
3. **`/dashboard/applications`**
   - **Audience**: Workers.
   - **Approach**: Fetch `job_applications` where `worker_id = user.id`, joined with `job_posts` to display the title. Render a list showing the worker's application status (Pending, Accepted, Rejected), date, and proposed price.
4. **`/dashboard/jobs/[id]/applications`**
   - **Audience**: Job Owners (Customers).
   - **Approach**: Fetch `job_applications` for the `[id]`, joined with `worker_profiles`. **Critical Check**: The Server Action / Page must assert that `job_posts.customer_id === user.id`. Render applicant list with "Accept" and "Reject" buttons.
   - **Accept/Reject**: A server action takes `applicationId` and `status` ('accepted' | 'rejected'). It first validates ownership, then updates the status, then calls `revalidatePath`.

## Data Model (Review)

The table `job_applications` already exists from Phase 3.5.

```sql
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES job_posts(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
    application_message TEXT,
    proposed_price DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, worker_id)
);
```

## Validation & State Strategy

- **Validation**: Utilize existing Zod patterns for the application form payload.
  - `application_message`: `z.string().min(1).max(1000)`
  - `proposed_price`: `z.coerce.number().positive()`
- **Loading Handling**: Use `useTransition` for accept/reject buttons to show inline loading spinners on buttons. For the apply form, disable the submit button while pending. Utilize `loading.tsx` in Next.js layouts for page-level transitions.
- **Error Handling**: Form validation errors shown inline below inputs. Generic server errors ("Failed to apply", "Failed to accept") pushed through the existing toast notification system. `error.tsx` bounds handle full-page fetch faults.

## Duplicate Prevention & Race Conditions

- **Double Applications**: Prevented via the SQL `UNIQUE(job_id, worker_id)` constraint. The Server Action catches duplicate insert errors (code 23505) and returns a user-friendly constraint error. UI preemptively hides form if duplicate is detected on load.
- **Multiple Accepts**: Handled application-side in the action.

  ```typescript
  // Server Action Pseudo
  const job = await db.from("job_posts").select("*").eq("id", jobId).single();
  if (job.status !== "open") throw new Error("Job no longer open.");

  // Accept the application
  await db
    .from("job_applications")
    .update({ status: "accepted" })
    .eq("id", appId);
  // (Optional logic to auto-reject others deferred for simplicity unless strictly required,
  // but DB must ensure no two applications are 'accepted' if enforcing 1 worker/job,
  // though typically standard marketplace logic just updates the job to 'closed'/'booked'.)
  ```

## Risks and Mitigations

| Risk                                                           | Mitigation                                                                                                                          |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Worker lacking categories sees no available jobs.              | Show clear empty state on `/dashboard/jobs/available` with link: "Update your profile categories to see jobs."                      |
| Job Owner applies to own job.                                  | Check and filter at query level: `job_posts.customer_id != user.id` in the available jobs feed. Reject in Server Action explicitly. |
| Owner accepts an application but there's no booking phase yet. | The UI will just show "Accepted." A small info toast/text can state: "Booking flow coming in Phase 15."                             |
| Unauthorized access to applications                            | Strict Supabase RLS policies (e.g., `user_id = worker_id` OR `job.customer_id = user.id`) + Next.js layout auth checks.             |
