# Implementation Plan: Phase 19 — Admin Dashboard

**Branch**: `181-phase-19-admin` | **Date**: 2026-05-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/0190-admin-dashboard/spec.md`

## Summary
Translate the Admin Dashboard spec into a technical plan to establish the structural foundation, navigation, and read-only overviews for platform operations. The admin interface will be strictly separated from normal user flows.

## Admin Route Strategy
The admin dashboard will utilize a distinct Next.js App Router route group `(admin)` to separate its layout and error handling from the `(protected)` and `(public)` groups.
Routes will be prefixed with `/admin` to ensure a clear boundary:
- `/admin` (Landing/Stats)
- `/admin/users` (Users Overview)
- `/admin/categories` (Categories Overview)
- `/admin/jobs` (Jobs Overview)
- `/admin/bookings` (Bookings Overview)
- `/admin/verifications` (Verification Queue Overview)
- `/admin/reports` (Reports Placeholder)

## Admin Access Protection Approach
1. **Data Model**: Create a new database migration to add an `is_admin boolean default false` column to the `public.users` table.
2. **Server-Side Protection**: 
   - A server-side check in `src/app/(admin)/layout.tsx` will fetch the current authenticated user's `is_admin` status from `public.users`.
   - If `is_admin` is false or the user is unauthenticated, the system will redirect them to a generic unauthorized page or the login route, preventing access to any `/admin/*` child routes.
   - All server actions/services associated with admin functionality will re-verify the `is_admin` flag before executing queries.

## Admin Layout & Navigation Approach
- Create `src/app/(admin)/layout.tsx` to wrap all admin routes.
- Create `src/components/admin/AdminSidebar.tsx` and `src/components/admin/AdminHeader.tsx`.
- The layout will be completely distinct from the `DashboardLayout` used for customers and workers. It will feature a persistent sidebar for navigation to the overview pages and a top header for admin profile actions/breadcrumbs.

## Dashboard Stats Approach
- The landing page (`/admin/page.tsx`) will fetch aggregated counts.
- Create a dedicated server service `src/lib/services/admin.ts` with a function like `getAdminOverviewStats()`.
- The function will query the database for counts: total `users`, `job_posts`, `bookings`, and `verification_requests` where `status = 'pending'`.
- Stats will be displayed using Shadcn UI `Card` components in a responsive grid layout.

## Overview Page Data Approaches
### Users Overview Approach
- **Route**: `/admin/users/page.tsx`
- **Service**: `getAdminUsers()`
- **UI**: A data table listing users with their email, role (worker/customer profile existence), and created date.
- **Focus**: Read-only list, paginated or limited to top recent for this phase.

### Categories Overview Approach
- **Route**: `/admin/categories/page.tsx`
- **Service**: `getAdminCategories()`
- **UI**: A list/table of `service_categories` showing name, parent category, and `is_active` status.

### Jobs Overview Approach
- **Route**: `/admin/jobs/page.tsx`
- **Service**: `getAdminJobs()`
- **UI**: A table of `job_posts` showing title, customer ID/name, category, status, and created date.

### Bookings Overview Approach
- **Route**: `/admin/bookings/page.tsx`
- **Service**: `getAdminBookings()`
- **UI**: A table of `bookings` showing customer ID, worker ID, status, final price, and scheduled date.

### Verification Queue Overview Approach
- **Route**: `/admin/verifications/page.tsx`
- **Service**: `getAdminVerifications()`
- **UI**: A table focusing on `verification_requests` with `status = 'pending'`, showing worker ID, document URL, and submission date.

### Reports Placeholder Approach
- **Route**: `/admin/reports/page.tsx`
- **UI**: A static placeholder component indicating "Reporting module coming in future updates".

## File & Folder Impact
```text
src/app/(admin)/
├── layout.tsx
├── loading.tsx
├── error.tsx
├── admin/
│   ├── page.tsx
│   ├── users/page.tsx
│   ├── categories/page.tsx
│   ├── jobs/page.tsx
│   ├── bookings/page.tsx
│   ├── verifications/page.tsx
│   └── reports/page.tsx

src/components/admin/
├── AdminSidebar.tsx
├── AdminHeader.tsx
├── AdminStatCard.tsx
└── AdminDataTable.tsx (reusable table component)

src/lib/services/
└── admin.ts

supabase/migrations/
└── [timestamp]_add_admin_role.sql
```

## Loading, Error, and Empty State Strategy
- **Loading**: Use `loading.tsx` in the `(admin)` root and specific sub-routes as needed, utilizing skeleton loaders matching the table/card layouts.
- **Error**: Implement `error.tsx` using a standard error boundary component that allows retrying the request.
- **Empty States**: If a table fetch returns 0 results (e.g., no pending verifications), render an `EmptyState` component with a clear message and illustration/icon.

## Validation Strategy
- **Types**: Define strong TypeScript interfaces for all admin data fetches in `src/lib/types/admin.ts` (if needed) or reuse existing schema types.
- **Data Fetching Validation**: Ensure all `getAdmin*` service functions enforce `is_admin` server-side validation before executing the query, mitigating direct API access risks. No RLS bypassing will happen without strict `is_admin` checks.

## Risks and Mitigations
- **Risk**: Normal users discovering and accessing admin routes.
  - **Mitigation**: Strict enforcement of `is_admin` checks in `layout.tsx` (primary layer) and within every data fetching service. No link to the admin area will be rendered in normal user interfaces.
- **Risk**: Performance degradation due to unoptimized queries across large tables (e.g., all users or jobs).
  - **Mitigation**: Implement `LIMIT` clauses or basic pagination from the start for list endpoints. Use simple `COUNT(*)` queries for stats.
- **Risk**: Code duplication with the user dashboard.
  - **Mitigation**: Share generic UI components (like `Button`, `Card`, `Table` from Shadcn) but maintain separate layout and data fetching logic explicitly for the `(admin)` domain.

## Assumptions
- The `public.users` table is the correct place to add the `is_admin` flag.
- The existing Shadcn UI setup includes the necessary basic components (Table, Card, Sidebar components or primitives) to build the admin interfaces.
- Read-only data access implies we do not need complex form validation (Zod) for mutations in this phase.
- Admin dashboard will be styled primarily for desktop view, though basic responsiveness will be maintained.
