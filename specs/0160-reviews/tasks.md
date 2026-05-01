# Implementation Tasks: Phase 16 - Reviews

**Branch**: `151-working-phase-16` | **Spec**: `/specs/0160-reviews/spec.md` | **Plan**: `/specs/0160-reviews/plan.md`

## Phase 1: Database Setup & Core Services

- [ ] **Task 1: Create Database Migration for Reviews Table**
  - **Description**: Create the SQL migration for the `reviews` table, including the unique constraint on `booking_id`, and foreign keys to `bookings`, `worker_profiles`, and `customer_profiles`.
  - **Files**: `supabase/migrations/[timestamp]_add_reviews.sql`
  - **Done When**: The migration runs successfully and the table exists in the local Supabase instance with the `booking_id` unique constraint and rating check constraint (1-5).

- [ ] **Task 2: Create SQL View/Function for Aggregate Ratings**
  - **Description**: Add a SQL function `get_worker_rating_summary` to the migration created in Task 1 to compute the average rating and total review count for a given worker.
  - **Files**: `supabase/migrations/[timestamp]_add_reviews.sql`
  - **Done When**: The function exists in the database and can be queried.

- [ ] **Task 3: [P] Create Review Validation Schemas**
  - **Description**: Define Zod schemas for review submission input to ensure rating is between 1 and 5, and the comment length is reasonable (e.g., max 1000).
  - **Files**: `src/lib/validations/reviews.ts`
  - **Done When**: Zod schemas are defined and exported.

- [ ] **Task 4: Implement Review Service and Server Actions**
  - **Description**: Implement data access functions: `createReview`, `getReviewsByWorkerId`, and `getReviewByBookingId`. Ensure `createReview` strictly validates that the booking is in a `completed` state and belongs to the authenticated customer. Handle database duplicate key errors gracefully.
  - **Files**: `src/lib/services/reviews.ts`
  - **Done When**: Service functions are implemented, typed, and correctly enforce business logic (only completed bookings, correct ownership).

## Phase 2: UI Components

- [ ] **Task 5: [P] Create Interactive Star Rating Component**
  - **Description**: Build an accessible, interactive Star Rating component that allows users to select a rating from 1 to 5, and also display a static rating.
  - **Files**: `src/components/reviews/StarRating.tsx`
  - **Done When**: Component renders, accepts clicks to set a value, and can display a read-only state.

- [ ] **Task 6: [P] Create Review Card Component**
  - **Description**: Build a UI component to display a submitted review, showing the star rating, comment, date, and optionally the customer's name.
  - **Files**: `src/components/reviews/ReviewCard.tsx`
  - **Done When**: Component correctly renders review data visually.

- [ ] **Task 7: Create Review Submission Form**
  - **Description**: Build the form component utilizing Next.js Server Actions. Include the `StarRating` component, a comment textarea, loading states (e.g., `useTransition` or `useFormStatus`), and error handling for validation or duplicate submissions.
  - **Files**: `src/components/reviews/ReviewSubmissionForm.tsx`
  - **Done When**: The form can successfully submit a review and handle loading/error states without full page reloads.

## Phase 3: Integration

- [ ] **Task 8: Integrate Reviews into Booking Details Page**
  - **Description**: Update the Booking Details page to conditionally render review UI. Fetch `getReviewByBookingId`. If a review exists, show `ReviewCard`. If no review exists AND the booking status is `completed`, show `ReviewSubmissionForm`. Otherwise, show neiether.
  - **Files**: `src/app/(protected)/dashboard/bookings/[id]/page.tsx`
  - **Done When**: A customer can leave a review on a completed booking, and immediately sees their review after submission instead of the form.

- [ ] **Task 9: Display Aggregated Rating and Reviews on Worker Profile**
  - **Description**: Fetch the aggregated rating summary and the list of past reviews. Display the average rating in the profile header. Display the list of `ReviewCard` components in a new "Reviews" section. Show an empty state if no reviews exist.
  - **Files**: The worker profile page (e.g., `src/app/(protected)/dashboard/discover/[id]/page.tsx` or similar, depending on exact routing).
  - **Done When**: The worker profile successfully displays the aggregated rating and individual reviews.

- [ ] **Task 10: Display Aggregated Rating on Worker Cards**
  - **Description**: Update worker summary cards (e.g., in search results or applicant lists) to fetch and display the aggregated rating and total review count.
  - **Files**: `src/components/search/WorkerList.tsx` and/or `src/components/features/applications/ApplicantCard.tsx`.
  - **Done When**: Worker cards consistently show ratings across the dashboard.
