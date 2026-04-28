---
description: "Task list template for feature implementation"
---

# Tasks: Phase 15 — Booking System

**Input**: Design documents from `/specs/0150-booking-system/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

---

## Phase 1: Foundational (Database & Validations)

**Purpose**: Core infrastructure that MUST be complete before UI components are built.

- [ ] T001 [P] Create migration file `supabase/migrations/[timestamp]_add_location_to_bookings.sql` to add `location_text text` to the `bookings` table.
- [ ] T002 [P] Create Zod schemas for booking requests and status updates in `src/lib/validations/bookings.ts`.
- [ ] T003 Implement booking Server Actions in `src/lib/services/bookings.ts` (`createDirectBooking`, `updateBookingStatus`, `getUserBookings`, `getBookingById`).

**Checkpoint**: Database schema supports locations and data access layer is ready.

---

## Phase 2: User Story 1 - Direct Service Booking (Priority: P1)

**Goal**: A Customer views a Worker's service and submits a direct booking request.

### Implementation for User Story 1

- [ ] T004 [US1] Create `DirectBookingForm.tsx` in `src/components/bookings/` with fields for schedule, location, and initial price offer.
- [ ] T005 [US1] Build the route `src/app/dashboard/bookings/new/page.tsx` to host the direct booking form.
- [ ] T006 [US1] Integrate `DirectBookingForm` with `createDirectBooking` action, adding validation, loading, and error states.

**Checkpoint**: Direct bookings can be created and saved to the database.

---

## Phase 3: User Story 2 - Job-Based Booking (Priority: P1)

**Goal**: A Customer accepts a Worker's job application, resulting in a new booking.

### Implementation for User Story 2

- [ ] T007 [US2] Update `acceptApplication` Server Action in `src/lib/services/applications.ts` to transition application status AND insert a corresponding `bookings` record.
- [ ] T008 [US2] Modify the application acceptance UI (modal or page) to capture a `scheduled_at` date/time from the customer before executing the acceptance action.

**Checkpoint**: Accepting an application now correctly generates a booking record.

---

## Phase 4: User Story 3 & 4 - Booking Management & Lifecycle (Priority: P1/P2)

**Goal**: Users can view their bookings list, see details, and update statuses based on their role.

### Implementation for User Story 3 & 4

- [ ] T009 [P] [US3] Create `BookingStatusBadge.tsx` in `src/components/bookings/` for visual status representation.
- [ ] T010 [P] [US3] Create `BookingCard.tsx` in `src/components/bookings/` to display booking summaries with customer/worker perspective labels.
- [ ] T011 [US3] Build the bookings list route `src/app/dashboard/bookings/page.tsx` to fetch and display the user's bookings.
- [ ] T012 [P] [US4] Create `BookingDetailView.tsx` in `src/components/bookings/` to display full booking context and status transition buttons (Accept, Decline, Complete, Cancel).
- [ ] T013 [US4] Build the booking detail route `src/app/dashboard/bookings/[id]/page.tsx` integrating `BookingDetailView` and `updateBookingStatus` action.
- [ ] T014 [P] [US3] Add Next.js `loading.tsx` and empty states to `/dashboard/bookings` and `/dashboard/bookings/[id]`.

**Checkpoint**: Both parties can view and manage their booking lifecycle within `/dashboard`.

---

## Phase 5: Polish & Validation

**Purpose**: Ensure UX is smooth and constraints are met.

- [ ] T015 Verify navigation links to `/dashboard/bookings` exist in dashboard sidebars or headers.
- [ ] T016 Validate RLS policies on `bookings` table allow customers to insert records and both parties to update status appropriately.
- [ ] T017 Verify error states and validation blocks invalid booking sources or past dates.
