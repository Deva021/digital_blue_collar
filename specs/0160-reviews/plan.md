# Implementation Plan: Phase 16 - Reviews

**Branch**: `151-working-phase-16` | **Date**: 2026-05-01 | **Spec**: `/specs/0160-reviews/spec.md`

## Summary

This plan translates the Phase 16 Reviews feature specification into technical steps. The focus is on allowing customers to submit a 1-5 rating and comment for completed bookings securely from the dashboard, storing this review securely in Supabase via Next.js Server Actions, and displaying the aggregated rating and individual reviews on worker profiles.

## Architecture Strategy

### Data Access Strategy

- **Database**: PostgreSQL on Supabase. Create a new `reviews` table.
- **Backend Access**: Next.js Server Actions for all mutations (creating reviews). Server-side data fetching for reading reviews and aggregated ratings. Web clients never hit Supabase directly.
- **Row Level Security (RLS)**: We will ensure all operations are strictly validated against the authenticated user on the server side, acting as a secure middleman.

### Validation & Security Strategy

- **Review Eligibility & Completed Booking Check**:
  - The server action will verify that a booking exists by `booking_id`, belongs to the authenticated `customer_id`, and its status is exactly `'completed'`.
  - The form submission will strictly enforce a 1 to 5 rating constraint using Zod.
- **Duplicate Prevention Approach**:
  - Database level: A `UNIQUE` constraint on `booking_id` in the `reviews` table.
  - Application level: The database query for booking details will join or look up existing reviews. If a review exists, the UI will hide the review submission form and instead display the existing review. The server action will also catch and handle duplicate key errors gracefully.

## Technical Approach

### 1. Database Schema & Migration

**File**: `supabase/migrations/[timestamp]_add_reviews.sql`

- Create `reviews` table:
  - `id` (uuid, primary key)
  - `booking_id` (uuid, unique, references `bookings(id)`)
  - `worker_id` (uuid, references `worker_profiles(id)`)
  - `customer_id` (uuid, references `customer_profiles(id)`)
  - `rating` (smallint, check `rating >= 1 AND rating <= 5`)
  - `comment` (text, nullable)
  - `created_at` (timestamptz)
- Create index on `worker_id` for efficient profile lookups.
- Setup RLS policies restricting inserts and modifications to the backend via service role, or ensuring read access is public while inserts are authenticated.

### 2. Rating Aggregate Strategy

- Instead of complex triggers or materialized views for now (to follow "Simplicity over complexity" MVP rule), we will compute the average rating and review count on-the-fly or via a simple database function/view.
- Create a SQL view or function `get_worker_rating_summary(worker_id)` that returns the `avg(rating)` and `count(*)` for a given worker. This keeps the schema simple and prevents race conditions with triggers.

### 3. Server Actions & Services

**File**: `src/lib/services/reviews.ts`

- Implement `createReview(data: ReviewInput)`
  - Authenticate user.
  - Validate booking ownership and `status === 'completed'`.
  - Attempt insert. Catch unique constraint violation for duplicate handling.
  - Return standardized response (success, error).
- Implement `getReviewsByWorkerId(workerId: string)`
  - Fetch list of reviews with customer names.
- Implement `getReviewByBookingId(bookingId: string)`
  - Used for checking if a review already exists.

**File**: `src/lib/validations/reviews.ts`

- Zod schema for `ReviewInput`: `rating` (min 1, max 5), `comment` (max 1000 chars), `booking_id` (uuid).

### 4. Dashboard Review Route & Submission Approach

**Dashboard Booking Details**: `src/app/(protected)/dashboard/bookings/[id]/page.tsx`
- **Logic**: Fetch booking details. If `status === 'completed'`, fetch `getReviewByBookingId()`.
- **UI State 1 (No Review)**: Render `<ReviewSubmissionForm bookingId={id} workerId={booking.worker_id} />`.
- **UI State 2 (Has Review)**: Render `<ReviewCard review={review} />`.

**Components**:
- `src/components/reviews/ReviewSubmissionForm.tsx`: Client component using Server Actions to call `createReview`. Incorporates loading states (disabling submit button, showing spinner) and error handling (inline errors for duplicates/validation).
- `src/components/reviews/ReviewCard.tsx`: Display an individual review (stars, comment, date).
- `src/components/reviews/StarRating.tsx`: Interactive component for selecting 1-5 stars.

### 5. Worker Profile Review Display Approach

**Worker Profile Page**: `src/app/(protected)/dashboard/discover/workers/[id]/page.tsx` (or equivalent profile route).
- **Logic**: Fetch worker profile details, fetch `get_worker_rating_summary`, fetch `getReviewsByWorkerId`.
- **UI**: 
  - Update the main profile header to show average rating (e.g., ⭐ 4.8) and count.
  - Add a "Reviews" section listing the latest reviews using `ReviewCard`.

## File / Folder Impact

### New Files
- `supabase/migrations/[timestamp]_add_reviews.sql`
- `src/lib/services/reviews.ts`
- `src/lib/validations/reviews.ts`
- `src/components/reviews/ReviewSubmissionForm.tsx`
- `src/components/reviews/ReviewCard.tsx`
- `src/components/reviews/StarRating.tsx`

### Modified Files
- `src/app/(protected)/dashboard/bookings/[id]/page.tsx` (to include the review form/card)
- Worker profile page (to include ratings and review list)
- `src/components/search/WorkerList.tsx` or equivalent service cards (to display aggregate ratings)

## Loading / Error Handling

- **Loading**: Use React form status hooks or `useTransition` in `ReviewSubmissionForm` to disable the submit button and prevent double-submission.
- **Validation Errors**: Zod errors map to inline field errors in the form.
- **Duplicate Errors**: Caught by the service layer (Postgres unique constraint violation) and returned as a user-friendly error "You have already reviewed this booking".

## Risks and Mitigations

- **Risk**: Performance bottleneck computing average ratings dynamically.
  - **Mitigation**: For the MVP, on-the-fly SQL aggregation `AVG(rating)` is perfectly acceptable. We will create an index on `worker_id` to ensure this query remains fast. We can migrate to triggers/materialized views later if scale requires it.
- **Risk**: Users attempting to bypass the UI to submit reviews for uncompleted bookings.
  - **Mitigation**: Server-side validation in the action will fetch the booking and strictly assert its status before insertion.

## Assumptions

- We are generating static types from Supabase CLI as per usual workflows.
- No editing or deleting of reviews is required for this phase.
- We do not need a dedicated `/dashboard/reviews` page; reviews are handled within the context of booking details and worker profiles.
- Standard pagination for the worker profile reviews list is deferred to a future phase; we will display the most recent N (e.g., 20) reviews for MVP.
