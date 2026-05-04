---
description: "Task list for Phase 19 — Admin Dashboard implementation"
---

# Tasks: Phase 19 — Admin Dashboard

**Input**: Design documents from `specs/0190-admin-dashboard/`
**Prerequisites**: plan.md (required), spec.md (required)

## Phase 1: Foundational (Access & Route Strategy)

**Purpose**: Establish the core admin structure, database role, and route protection.

- [ ] T001 [P] [US1] Create migration to add `is_admin` boolean to `public.users` table in `supabase/migrations/[timestamp]_add_admin_role.sql`
- [ ] T002 [US1] Create `src/app/(admin)/layout.tsx` to handle route protection (fetch `is_admin` status, redirect unauthorized to `/login`).
- [ ] T003 [P] [US1] Create `src/app/(admin)/error.tsx` for global admin error boundary.
- [ ] T004 [P] [US1] Create `src/app/(admin)/loading.tsx` for global admin loading states.

**Checkpoint**: Admin route group is protected; only users with `is_admin=true` can access it.

---

## Phase 2: Navigation & Layout

**Purpose**: Build the shell and navigation for the admin area.

- [ ] T005 [P] [US2] Create `src/components/admin/AdminSidebar.tsx` with navigation links to Users, Categories, Jobs, Bookings, Verification Queue, and Reports.
- [ ] T006 [P] [US2] Create `src/components/admin/AdminHeader.tsx` for top-level actions (e.g., breadcrumbs, logout).
- [ ] T007 [US2] Update `src/app/(admin)/layout.tsx` to integrate `AdminSidebar` and `AdminHeader` into a distinct admin layout.

**Checkpoint**: Admin shell renders with sidebar and header, completely separate from the normal user dashboard.

---

## Phase 3: Dashboard Landing & Stats

**Purpose**: Build the high-level overview page with statistics.

- [ ] T008 [P] [US3] Create `getAdminOverviewStats` server service in `src/lib/services/admin.ts` to count users, workers, customers, jobs, bookings, and pending verifications (ensure `is_admin` validation).
- [ ] T009 [P] [US3] Create `src/components/admin/AdminStatCard.tsx` reusable component for displaying metric cards.
- [ ] T010 [US3] Create `src/app/(admin)/admin/page.tsx` utilizing `getAdminOverviewStats` and `AdminStatCard` to display the basic dashboard stats.

**Checkpoint**: Landing page successfully loads and displays accurate metrics from the database.

---

## Phase 4: Users & Verifications Overviews

**Purpose**: Provide visibility into users and the verification queue.

- [ ] T011 [P] [US4] Create `src/components/admin/AdminDataTable.tsx` reusable table component (with support for empty states).
- [ ] T012 [P] [US4] Create `getAdminUsers` service in `src/lib/services/admin.ts` (enforcing `is_admin`).
- [ ] T013 [US4] Create `src/app/(admin)/admin/users/page.tsx` integrating `getAdminUsers` and `AdminDataTable` to list users.
- [ ] T014 [P] [US4] Create `getAdminVerifications` service in `src/lib/services/admin.ts` for pending requests (enforcing `is_admin`).
- [ ] T015 [US4] Create `src/app/(admin)/admin/verifications/page.tsx` integrating `getAdminVerifications` and `AdminDataTable` to list pending verifications.

**Checkpoint**: Users and Verification Queue pages load tables of read-only data.

---

## Phase 5: Platform Entities Overviews

**Purpose**: Provide visibility into categories, jobs, and bookings.

- [ ] T016 [P] [US4] Create `getAdminCategories` service in `src/lib/services/admin.ts` (enforcing `is_admin`).
- [ ] T017 [US4] Create `src/app/(admin)/admin/categories/page.tsx` integrating `getAdminCategories` and `AdminDataTable`.
- [ ] T018 [P] [US4] Create `getAdminJobs` service in `src/lib/services/admin.ts` (enforcing `is_admin`).
- [ ] T019 [US4] Create `src/app/(admin)/admin/jobs/page.tsx` integrating `getAdminJobs` and `AdminDataTable`.
- [ ] T020 [P] [US4] Create `getAdminBookings` service in `src/lib/services/admin.ts` (enforcing `is_admin`).
- [ ] T021 [US4] Create `src/app/(admin)/admin/bookings/page.tsx` integrating `getAdminBookings` and `AdminDataTable`.

**Checkpoint**: Categories, Jobs, and Bookings pages load tables of read-only data.

---

## Phase 6: Reports & Final UX Polish

**Purpose**: Add the reports placeholder and ensure all states render correctly.

- [ ] T022 [P] [US4] Create `src/app/(admin)/admin/reports/page.tsx` returning a static placeholder state.
- [ ] T023 [US5] Verify and implement empty states on all overview tables (`users`, `categories`, `jobs`, `bookings`, `verifications`).
- [ ] T024 [US5] Verify and implement localized loading states (e.g., specific `loading.tsx` files inside overview folders) for smoother navigation.
- [ ] T025 [US1] Final validation: Test to ensure no moderation actions are exposed, and strictly verify non-admin users receive a 404/redirect when trying to hit `/admin`.

**Checkpoint**: All UX states are handled, admin dashboard is fully verified, polished, and ready for production.
