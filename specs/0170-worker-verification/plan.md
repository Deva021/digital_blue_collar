# Implementation Plan: Worker Verification

**Branch**: `0170-worker-verification` | **Date**: 2026-05-02 | **Spec**: [specs/0170-worker-verification/spec.md](specs/0170-worker-verification/spec.md)
**Input**: Feature specification from `/specs/0170-worker-verification/spec.md`

## Summary

Implement the foundational worker verification system, allowing workers to submit a verification document and an optional selfie from a dedicated `/dashboard/verification` route. The system will track status (pending, verified, rejected) and display a verified badge on approved worker profiles.

## Technical Context

**Language/Version**: TypeScript / Next.js 14 App Router
**Primary Dependencies**: Supabase (Postgres, Storage, Auth), TailwindCSS, lucide-react, Zod
**Storage**: Supabase Postgres (`verification_requests`, `worker_profiles`), Supabase Storage (`verification_documents` bucket)
**Testing**: Manual testing via UI.

## Project Structure

### Documentation (this feature)

```text
specs/0170-worker-verification/
├── plan.md
└── tasks.md
```

### Source Code

```text
src/
├── app/
│   └── (protected)/
│       └── dashboard/
│           └── verification/
│               ├── page.tsx               # Main verification page
│               └── loading.tsx            # Loading state
├── components/
│   ├── verification/
│   │   ├── VerificationForm.tsx           # Form for submitting docs
│   │   └── VerificationStatusAlert.tsx    # Banner showing current status
│   └── ui/
│       └── VerifiedBadge.tsx              # Badge component to render next to names
├── features/
│   └── verification/
│       └── actions/
│           └── submitVerification.ts      # Server action to handle upload and DB insert
└── lib/
    └── supabase/
        └── types.ts                       # Will be updated with new schema
supabase/
└── migrations/
    └── [timestamp]_add_verification_storage.sql # Migration for bucket and schema updates
```

## Migration Ordering

1. **`[timestamp]_add_verification_storage.sql`**:
   - Add `selfie_url` column (text, nullable) to existing `verification_requests` table.
   - Add `verification_status` column (verification_status enum, default 'unverified') to `worker_profiles` table to optimize read queries for the badge.
   - Create a database trigger to automatically update `worker_profiles.verification_status` whenever a `verification_requests` status changes.
   - Create Supabase storage bucket `verification_documents`.
   - Setup RLS policies on the `verification_documents` bucket allowing authenticated workers to insert documents and only read their own documents.

## Implementation Details

### 1. Data Access & Storage Strategy

- Use Supabase Storage for storing actual files securely.
- Client Component will submit files directly to the Server Action using standard `FormData`.
- The Server Action will:
  1. Upload the files to Supabase Storage using `supabase.storage.from('verification_documents').upload()`.
  2. Insert a new row (or update an existing one) in `verification_requests` with status `pending`.

### 2. Route Strategy

- **`/dashboard/verification`**: This will be a Server Component that fetches the user's current verification status from `verification_requests`.
- If the status is `unverified` or `rejected`, it renders the `VerificationForm`.
- If the status is `pending` or `verified`, it renders the `VerificationStatusAlert` displaying the current state and hiding the upload form.

### 3. Verified Badge Display

- Create a `VerifiedBadge` UI component (a small shield or checkmark icon with a tooltip).
- Since we are adding `verification_status` to `worker_profiles`, we will update the `WorkerList` component and individual profile views to render the `VerifiedBadge` conditionally when `worker.verification_status === 'verified'`.
- This ensures existing worker profile behavior is preserved and queries remain fast without complex joins.

### 4. Validation & Error Handling

- Use Zod to validate the incoming `FormData` on the server action (e.g., checking that the primary document is provided, verifying MIME types and size limits).
- Provide client-side validation for immediate feedback.
- Handle loading states using React `useTransition` or the `useFormStatus` hook to disable the submit button while uploading.
- Use toast notifications to display success or error messages.

## Risks and Mitigations

- **Risk**: Storing sensitive KYC documents requires strict security.
  - **Mitigation**: The `verification_documents` bucket MUST have RLS policies restricting access so only the uploading worker (and future admins) can access the files. The bucket must not be public.
- **Risk**: Large file uploads causing timeouts or Server Action limits.
  - **Mitigation**: Implement a sensible size limit (e.g., 5MB) enforced both on the client input and in the Server Action validation.

## Assumptions

- We do not need a dedicated admin dashboard UI yet. The data structure will just sit in the DB for a future phase to build the admin moderation tools.
- We will rely on manual database updates by an admin to transition a request from `pending` to `verified` or `rejected` for now.
- `verification_status` enum already exists in the database.
