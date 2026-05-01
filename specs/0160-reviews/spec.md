# Feature Specification: Phase 16 - Reviews

**Feature Branch**: `151-working-phase-16`  
**Created**: 2026-05-01  
**Status**: Draft  
**Input**: User description: "Define how users leave and view reviews after completed bookings..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Customer Leaves a Review for a Completed Booking (Priority: P1)

Customers need a way to leave feedback and a rating for a worker after a booking is successfully completed, ensuring accountability and building trust on the platform.

**Why this priority**: Submitting a review is the core functionality of this feature. Without it, there is no reputation system for workers.

**Independent Test**: Can be fully tested by simulating a completed booking and verifying that a customer can submit a 1-5 rating and comment via a `/dashboard` route.

**Acceptance Scenarios**:

1. **Given** a booking in a `completed` state, **When** the customer views the booking details in the dashboard, **Then** they see an option to leave a review.
2. **Given** a booking that is not `completed` (e.g., `pending`, `confirmed`), **When** the customer views the booking details, **Then** the option to leave a review is not available.
3. **Given** a customer submitting a review, **When** they provide a valid rating (1-5) and optional comment, **Then** the review is successfully saved and tied to the completed booking and worker.

---

### User Story 2 - Prevent Duplicate Reviews for a Booking (Priority: P1)

Customers should only be able to leave one review per completed booking to maintain the integrity of the rating system.

**Why this priority**: Essential to prevent review spam or inflated ratings, ensuring the reputation system remains trustworthy.

**Independent Test**: Can be fully tested by attempting to submit a second review for a booking that already has a review associated with it.

**Acceptance Scenarios**:

1. **Given** a customer who has already submitted a review for a completed booking, **When** they view the booking details, **Then** they see their submitted review but no option to submit another.
2. **Given** an API request to submit a review for a booking that already has one, **When** the request is processed, **Then** it is rejected with an appropriate error message.

---

### User Story 3 - Display Worker Ratings and Review Lists (Priority: P2)

Customers need to see a worker's average rating and a list of their past reviews on the worker's profile (in the discover section) and relevant dashboard views.

**Why this priority**: The value of reviews comes from displaying them to future customers to help them make informed booking decisions.

**Independent Test**: Can be fully tested by navigating to a worker's profile or service card and verifying the correct average rating and review count are displayed, along with a list of individual reviews.

**Acceptance Scenarios**:

1. **Given** a worker with published reviews, **When** a user views their service card or profile, **Then** the aggregated rating and total review count are visible.
2. **Given** a worker with published reviews, **When** a user views the review section of their profile, **Then** a paginated or scrollable list of individual reviews (rating, comment, author name, date) is displayed.
3. **Given** a worker with no reviews, **When** a user views their profile, **Then** a "No reviews yet" or similar empty state is displayed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow customers to submit a review (rating and optional comment) only for a booking that is in the `completed` status.
- **FR-002**: System MUST restrict review submission to the customer who made the booking. (Workers cannot review customers in this phase).
- **FR-003**: System MUST prevent more than one review per unique booking ID.
- **FR-004**: System MUST record the rating as an integer between 1 and 5 (inclusive).
- **FR-005**: System MUST display a worker's aggregated rating (average) and total review count on their profile and service cards.
- **FR-006**: System MUST provide a list view of a worker's past reviews, displaying the rating, comment, date, and customer's first name.
- **FR-007**: System MUST provide clear validation errors if a review submission fails (e.g., missing rating, booking not completed).
- **FR-008**: System MUST display loading states during review submission to prevent double-clicks.
- **FR-009**: All review submission and management UI MUST be located within the authenticated `/dashboard` routes.

### Key Entities

- **Review**: Represents a customer's feedback for a completed booking. Key attributes: `id`, `booking_id` (unique), `worker_id`, `customer_id`, `rating` (1-5), `comment` (text), `created_at`.
- **Booking**: The existing entity representing a job. Must be in `completed` state to be eligible for a review.
- **Worker Profile**: The existing entity that will now need to aggregate review data (average rating, review count).

## Scope Definition

**Purpose of Reviews**: To provide accountability and build trust by allowing customers to rate and feedback on completed jobs.
**When Reviews are Allowed**: Strictly after a booking transitions to the `completed` status.
**Who Can Review Whom**: Only customers can review workers based on a completed booking. Worker-to-customer reviews are out of scope.
**Review Lifecycle**: Created by customer -> Associated with booking/worker -> Displayed publicly on worker's profile.
**Duplicate Prevention**: Strictly one review per `booking_id` enforced at the database level.
**Rating Display Expectations**: Average rating out of 5.0 (e.g., 4.8), alongside the total number of reviews (e.g., "4.8 (12 reviews)").
**Dashboard Placement**: Review submission UI will be surfaced on the Booking Details page (`/dashboard/bookings/[id]`) for completed bookings.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Customers can successfully submit a review for a completed booking without encountering errors.
- **SC-002**: The system strictly prevents duplicate reviews for the same booking.
- **SC-003**: Worker profiles correctly reflect the updated average rating and review count immediately after a new review is submitted.
- **SC-004**: All authenticated review interactions happen exclusively within the `/dashboard` routing structure.

## Assumptions

- We assume the existing booking system accurately tracks and updates the `completed` status.
- We assume reviews are immediately visible upon submission (no admin moderation required before publishing, as moderation is out of scope).
- We assume basic text sanitization will be handled by the framework/database to prevent XSS in review comments.

## Risks & Open Questions

- **Risk**: How do we handle recalculating average ratings efficiently if a worker has thousands of reviews? (Database triggers, materialized views, or on-the-fly aggregation?)
- **Risk**: What happens if a completed booking is somehow reverted to a different status after a review is left?
- **Open Question**: Should there be a character limit on the review comment? (Assuming a standard 500 or 1000 character limit).
- **Open Question**: Can a user edit or delete their review after submission? (Assuming NO for this phase to keep it simple, unless specified otherwise).

## Definition of Done

- Review table schema is designed and migrated with appropriate constraints (unique `booking_id`).
- Review submission UI is implemented on the Booking Details page for completed bookings under `/dashboard`.
- Validation is in place for ratings (1-5) and booking status rules.
- Worker profile and service cards are updated to display average ratings and review counts.
- A list of reviews is viewable on the worker's profile.
- All acceptance criteria in user stories are met and manually tested.
- No new routes are created outside of `/dashboard`.
