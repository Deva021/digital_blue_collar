# Implementation Plan: Phase 15 — Booking System

**Branch**: `0150-booking-system` | **Date**: 2026-04-27 | **Spec**: [spec.md](file:///home/dawa/Documents/digital-blue-collar/specs/0150-booking-system/spec.md)
**Input**: Feature specification from `/specs/0150-booking-system/spec.md`

## Summary

Implement the foundational booking system for the marketplace, enabling direct service booking from worker profiles and job-based booking from accepted applications. This includes building the booking request form, status lifecycle management, and dedicated dashboard views, without touching payments, chat, or reviews.

## Technical Context

**Language/Version**: TypeScript / Next.js 16 (App Router)
**Primary Dependencies**: React Hook Form, Zod, Supabase SDK (`@supabase/supabase-js`, `@supabase/ssr`), Tailwind CSS
**Storage**: PostgreSQL (Supabase)
**Target Platform**: Web (Mobile-first responsive)

## Constitution Check

- *Simplicity over complexity*: We use simple forms and standard Next.js Server Actions.
- *Trust-first system*: Role-based status transitions ensure users only affect their end of the deal.
- *Authorization by default*: All routes and actions protected by Supabase Auth and RLS.
- *Next.js App Router Structure*: strictly using `/dashboard` routes, no `/worker` or `/customer`.
- *No N+1 Queries*: Joins used in data access layer to fetch related job/service/user info with bookings.

## Project Structure

### Documentation

```text
specs/0150-booking-system/
├── spec.md
├── plan.md              # This file
└── tasks.md             # To be generated
```

### Source Code

```text
src/
├── app/
│   └── dashboard/
│       └── bookings/
│           ├── page.tsx               # List of bookings (customer/worker view)
│           ├── [id]/
│           │   └── page.tsx           # Booking detail page
│           └── new/
│               └── page.tsx           # Direct booking form page
├── components/
│   └── bookings/
│       ├── BookingList.tsx
│       ├── BookingCard.tsx
│       ├── BookingDetailView.tsx
│       ├── BookingStatusBadge.tsx
│       └── DirectBookingForm.tsx
├── lib/
│   ├── services/
│   │   └── bookings.ts                # Server Actions
│   └── validations/
│       └── bookings.ts                # Zod schemas
└── supabase/
    └── migrations/
        └── [timestamp]_add_location_to_bookings.sql
```

**Structure Decision**: Standard Next.js feature folder layout under App Router `dashboard/bookings`.

## Dashboard Route Structure

- `/dashboard/bookings`: Main list view for bookings. Will display tabs/filters for users to switch between "My Bookings (Customer)" and "My Jobs (Worker)" if they act in both roles.
- `/dashboard/bookings/[id]`: Detail view for a specific booking.
- `/dashboard/bookings/new?service_id=xyz&worker_id=abc`: Route dedicated to the direct booking request form.

## Implementation Approaches

### 1. Database & Migrations
The existing `bookings` table has `scheduled_at` and `final_price`. The spec requires capturing a `location_text` for the booking.
- **Migration**: Create a new migration file to `ALTER TABLE public.bookings ADD COLUMN location_text text;`.
- **RLS Policy**: Existing policies `Users can access their bookings` covers CRUD operations (`auth.uid() = worker_id or auth.uid() = customer_id`). We may need to refine policies for inserting (`auth.uid() = customer_id`) and updating statuses based on roles.

### 2. Direct Service Booking Approach
- A new route `/dashboard/bookings/new` will host the `DirectBookingForm`.
- URL parameters will pre-fill the `worker_id` and `service_id` context.
- Form fields: Date, Time, Location, Price Offer (defaulting to the service's base price).
- Form submission triggers a Server Action `createDirectBooking` which parses the Date/Time into a single `timestamptz` (`scheduled_at`), validates inputs, and inserts a `bookings` row with `status = 'pending'`.

### 3. Accepted-Application Booking Approach
- Modify the existing application acceptance logic (in `src/lib/services/applications.ts` or as a new orchestrated action).
- When a customer accepts an application, use a sequential Server Action steps to:
  1. Update `job_applications` status to `accepted`.
  2. Create a new `bookings` row using the application's `proposed_price` as `final_price`, linking `job_post_id`, `worker_id`, and `customer_id`.
  3. Default `scheduled_at` to a placeholder or require the customer to pick a date during acceptance. *Decision*: To keep it simple, we can add a simple date picker to the acceptance modal, or default it to "TBD" (if `scheduled_at` was nullable, but it's `not null`! So we must capture `scheduled_at` when accepting the application, or use the job post's date if it had one. Since `job_posts` doesn't have a date, the customer must select a `scheduled_at` when accepting).

### 4. Booking Request Form Approach
- **Validation Strategy**: Use Zod in `src/lib/validations/bookings.ts`.
  - `scheduled_date`: Must be today or future.
  - `location_text`: Required, min 3 chars.
  - `final_price`: Required, numeric, > 0.
- **UI**: Client-side component using `react-hook-form` and `@hookform/resolvers/zod`. Uses React `useTransition` for loading states.

### 5. Status Transition Approach
- Existing `booking_status` enum: `'pending', 'accepted', 'in_progress', 'completed', 'cancelled'`.
- **Server Action**: `updateBookingStatus(bookingId: string, newStatus: BookingStatus)`.
- **Logic**:
  - `pending` -> `accepted` / `cancelled`: Worker can accept/cancel. Customer can cancel.
  - `accepted` -> `in_progress`: Worker only.
  - `in_progress` -> `completed`: Worker only.
  - *Any non-complete* -> `cancelled`: Either party.
- Detail page will dynamically render buttons based on the current user's role and the booking status.

### 6. Customer/Worker Perspective Handling
- The list view (`/dashboard/bookings`) fetches `SELECT * FROM bookings WHERE customer_id = uid() OR worker_id = uid()`.
- The UI checks `booking.customer_id === user.id` to determine if the current user is acting as the customer.
- UI displays distinct labels (e.g., "Worker: [Name]" if viewing as customer, "Customer: [Name]" if viewing as worker).

### 7. Data Access Strategy
- All access via Supabase Server Client inside `src/lib/services/bookings.ts`.
- `getBookingDetails(id)` will join `customer_profiles`, `worker_profiles`, `worker_services`, and `job_posts` to fetch complete context.
- Handle Supabase errors and return standardized `{ error?: string, data?: any }` objects.

### 8. Validation Strategy
- Zod schemas in `src/lib/validations/bookings.ts`.
- Check for past dates.
- Required fields check.

### 9. Loading/Error Handling
- `loading.tsx` inside `/dashboard/bookings` and `/dashboard/bookings/[id]`.
- Standardized toast notifications on form success/failure.
- Server action error messages mapped to user-friendly strings.

## Risks and Mitigations

- **Risk**: `scheduled_at` is `NOT NULL` in the DB schema, meaning we MUST capture a date when a job application is accepted.
  - **Mitigation**: Update the "Accept Application" UI to include a date/time picker, or use a default value, though a real value is preferred. We will add a small scheduling step to the accept modal.
- **Risk**: Complex state handling with dual-roles (users can be both workers and customers).
  - **Mitigation**: Ensure queries and UI strictly check the exact relation (`customer_id` vs `worker_id`) on the specific booking, rather than relying on global profile types.

## Assumptions

- We are reusing the existing UI components (Buttons, Inputs, Cards).
- Location capture is a simple text field (no Mapbox/Google Maps integration yet).
- When accepting a job application, the `final_price` is the application's `proposed_price`.
- Schema for `bookings` is already partially created from Phase 3, we just need to patch it with `location_text`.
