# Feature Specification: Phase 15 — Booking System

**Feature Branch**: `0150-booking-system`
**Created**: 2026-04-27
**Status**: Draft
**Input**: User description: "We are working on Phase 15 — Booking System..."

## Purpose of Bookings

The booking system serves as the official agreement between a Customer and a Worker to perform a specific service at an agreed-upon date, time, location, and price. It tracks the entire lifecycle of a service engagement from initial request to completion or cancellation. All authenticated booking functionality must reside under `/dashboard`. No `/worker` or `/customer` routes are permitted.

## Booking Sources

There are two primary ways a booking is created:
1.  **Direct Service Booking**: A customer browses a worker's profile or service listing and directly requests to book a specific service.
2.  **Job-Based Booking**: A customer posts a job, receives applications, and accepts an application from a worker. This acceptance automatically transitions into a booking.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Direct Service Booking (Priority: P1)

A Customer views a Worker's service and submits a direct booking request, offering a specific schedule, location, and an initial price.

**Why this priority**: Direct booking is the most straightforward path to initiating a service engagement and represents the core value of the marketplace.

**Independent Test**: Can be fully tested by simulating a customer selecting a service, filling out the booking form, and verifying that a 'pending' booking record is created and visible to both parties.

**Acceptance Scenarios**:

1. **Given** a customer is viewing a worker's service, **When** they click "Book Now" and submit valid schedule, location, and price data, **Then** a new booking is created with a 'pending' status, and both the worker and customer see it in their respective `/dashboard/bookings` views.
2. **Given** a customer submits a booking request, **When** they omit required fields (like date/time or location), **Then** validation errors are displayed on the form and the booking is not created.

---

### User Story 2 - Job-Based Booking (Priority: P1)

A Customer accepts a Worker's job application, resulting in a new booking.

**Why this priority**: Job posting is the second main flow of the platform. Completing the job lifecycle by forming a booking is essential.

**Independent Test**: Can be fully tested by taking an existing application, accepting it, and verifying a corresponding booking is automatically generated using the job and application details.

**Acceptance Scenarios**:

1. **Given** a customer is viewing an application, **When** they click "Accept Application", **Then** the application status updates to 'accepted' and a new booking is automatically created inheriting details from the job and application, starting in an 'accepted' state.

---

### User Story 3 - Worker Views and Manages Booking Requests (Priority: P1)

A Worker views their pending booking requests and can accept or decline them.

**Why this priority**: Workers need agency over which bookings they take on.

**Independent Test**: Can be fully tested by logging in as a worker, navigating to `/dashboard/bookings`, viewing a pending direct booking, and clicking 'Accept' or 'Decline'.

**Acceptance Scenarios**:

1. **Given** a worker has a pending direct booking, **When** they view the booking details and click "Accept", **Then** the booking status transitions to 'accepted' and the customer is notified in the UI.
2. **Given** a worker has a pending direct booking, **When** they view the booking details and click "Decline", **Then** the booking status transitions to 'declined' and the booking is closed.

---

### User Story 4 - Booking Status Lifecycle (Priority: P2)

Either party can update the status of an accepted booking to track progress (e.g., in-progress, completed, cancelled).

**Why this priority**: Tracking the lifecycle is critical for trust and eventual review submission.

**Independent Test**: Can be fully tested by an agreed booking being marked 'completed' by the worker and 'confirmed completed' by the customer.

**Acceptance Scenarios**:

1. **Given** an accepted booking, **When** the scheduled time arrives, the worker marks it as 'in-progress'.
2. **Given** an 'in-progress' booking, **When** the work is done, the worker marks it as 'completed'.
3. **Given** any non-completed booking, **When** either party chooses to cancel, **Then** the booking transitions to 'cancelled'.

### Edge Cases

- What happens when a user tries to accept a booking that has already been cancelled?
- How does the system handle booking requests for dates in the past?
- How is a booking handled if the worker deletes their account while the booking is pending or accepted?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support creating a booking via a direct request form accessible from a service or worker profile.
- **FR-002**: System MUST capture schedule (date/time), location (text), and initial price offer during direct booking creation.
- **FR-003**: System MUST automatically generate a booking when a job application is explicitly accepted by a customer.
- **FR-004**: System MUST maintain a strictly enforced booking status lifecycle (e.g., `pending`, `accepted`, `declined`, `cancelled`, `completed`).
- **FR-005**: System MUST provide a unified dashboard view at `/dashboard/bookings` displaying all bookings relevant to the user.
- **FR-006**: System MUST provide a booking detail page (`/dashboard/bookings/[id]`) showing full engagement details, current status, and allowed actions based on the current user's role and the booking status.
- **FR-007**: System MUST validate all form inputs (date/time must be future, price must be valid, location cannot be empty).
- **FR-008**: System MUST display appropriate loading states during asynchronous booking operations and clear error messages upon failure.

### Key Entities

- **Booking**: Represents the engagement. Key attributes: `id`, `customer_id`, `worker_id`, `service_id` (optional, for direct), `job_id` (optional, for job-based), `status`, `scheduled_date`, `scheduled_time`, `location_text`, `agreed_price`, `created_at`, `updated_at`.
- **User (Customer/Worker)**: The actors participating in the booking.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can successfully submit a direct booking request with all required fields in under 1 minute.
- **SC-002**: Accepting a job application successfully creates a booking record 100% of the time.
- **SC-003**: All booking-related routes exist exclusively under `/dashboard/bookings`. No routes exist under `/worker` or `/customer`.
- **SC-004**: The booking status correctly transitions according to defined rules.

## Assumptions

- We are relying on the existing Supabase backend and authentication.
- Users have correctly configured profiles (workers have active services, customers have accounts).
- The 'agreed price' mechanism will rely on the initial offer for direct bookings, or the proposed price in an accepted application, which becomes the locked agreed price upon booking creation/acceptance.
- Notifications, messaging, reviews, and payments are strictly out of scope for Phase 15 and will be handled in subsequent phases.

## Definition of Done

- Specifications for booking creation (direct and job-based) are clearly documented.
- Booking status lifecycle and rules are defined.
- Dashboard routing rules (`/dashboard/bookings`) are explicitly stated.
- Acceptance criteria and success metrics are established.
- Required data fields for booking creation are defined.
- Edge cases and risks are identified.

## Risks & Open Questions

- **Risk**: Handling concurrent booking requests that might overlap in a worker's schedule. Given the current scope, we may not enforce strict calendar collision blocking, but rely on the worker to manage their schedule.
- **Open Question**: Should direct booking requests require an exact time, or just a date and general availability block (morning/afternoon)? *Assumption for MVP: Date + specific Time or Time window, represented as text or simple datetime to keep it flexible.*
- **Open Question**: What are the exact status enumerations? *Recommendation: `pending`, `accepted`, `declined`, `cancelled`, `completed`.*
