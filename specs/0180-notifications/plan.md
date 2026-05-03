# Implementation Plan: Phase 18 — Notifications

**Branch**: `0180-notifications` | **Date**: 2026-05-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/0180-notifications/spec.md`

## Summary

Implement an in-app notification center within the authenticated `/dashboard` area. The system will leverage the existing `notifications` table, adding support for tracking notification types and action URLs. Notifications will be generated via Supabase database triggers when core entities (bookings, applications, verifications) change state, ensuring reliable delivery without complex application logic. Users will view paginated notifications and manage read/unread states through Next.js Server Actions.

## Technical Context

**Language/Version**: TypeScript, React 18, Next.js App Router
**Primary Dependencies**: Next.js, Supabase JS Client, Tailwind CSS, Lucide React (for icons)
**Storage**: PostgreSQL (Supabase) - reusing and extending the existing `public.notifications` table
**Target Platform**: Web (Desktop & Mobile responsive)
**Project Type**: Full-stack Next.js Web Application
**Constraints**: 
- All functionality restricted to `/dashboard`.
- Strictly in-app notifications (no email, SMS, push).
- No WebSockets/real-time subscriptions; standard HTTP fetching only.
- Adhere to existing "Next.js + Supabase Server Actions" architecture.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Authorization by Default**: All access strictly bounded to authenticated users via `/dashboard` and enforced by RLS.
- [x] **Simple First**: Avoiding real-time WebSockets and external delivery channels in favor of simple HTTP fetching and database triggers.
- [x] **DX Conventions**: Adhering to Next.js App Router structures and Server Actions.
- [x] **Performance**: Employing pagination for the list and indexed counts for the unread badge.
- [x] **Next.js Architecture**: Supabase mutations and fetches handled via Server Actions.

## Project Structure

### Documentation (this feature)

```text
specs/0180-notifications/
├── spec.md
└── plan.md
```

### Source Code

```text
supabase/migrations/
└── [timestamp]_extend_notifications.sql     # Database migration for type & action_url, plus triggers

src/
├── app/(protected)/dashboard/
│   ├── layout.tsx                           # Update to include NotificationBell
│   └── notifications/
│       ├── page.tsx                         # Notification list page
│       ├── loading.tsx                      # Loading skeleton
│       └── error.tsx                        # Error boundary
├── components/
│   └── notifications/
│       ├── NotificationBell.tsx             # Header icon with unread badge
│       ├── NotificationList.tsx             # Paginated list of notifications
│       └── NotificationItem.tsx             # Individual notification card
└── server/
    └── notifications/
        └── actions.ts                       # Server actions (get, markAsRead)
```

**Structure Decision**: The implementation relies on modifying the existing centralized `notifications` table and grouping all feature-specific UI components under `src/components/notifications/` while encapsulating database access within `src/server/notifications/actions.ts`.

## Implementation Strategy

### 1. Data Access Strategy & Database Updates
- **Existing State**: `public.notifications` exists with `id, user_id, title, body, is_read, payload, created_at`. It already has an RLS policy (`auth.uid() = user_id`) and an index on `(user_id, is_read)`.
- **Migration**: Create a new SQL migration to add:
  - `type` (text, e.g., 'booking_created', 'verification_approved').
  - `action_url` (text, e.g., '/dashboard/bookings/123').
- **Notification Creation Approach**: Use PostgreSQL Triggers for bulletproof reliability. This avoids scattering `createNotification` calls across various Server Actions. 
  - Trigger on `bookings`: When `status` changes.
  - Trigger on `job_applications`: When `status` changes.
  - Trigger on `verification_requests`: When `status` changes.

### 2. Server Actions (`actions.ts`)
- `getNotifications(page: number, limit: number)`: Fetches paginated notifications for the authenticated user, ordered by `created_at` descending.
- `getUnreadNotificationCount()`: Returns an integer count of unread notifications.
- `markNotificationAsRead(id: string)`: Updates `is_read = true` for a specific notification.
- `markAllNotificationsAsRead()`: Updates `is_read = true` for all unread notifications belonging to the user.

### 3. Dashboard Route Strategy
- **Route**: `/dashboard/notifications`
- **Page Component**: Server Component that calls `getNotifications()` for the initial load and passes data to a Client Component (`NotificationList`) for interactivity (marking as read, pagination).
- **Navigation**: Restrict to `/dashboard`; do not create `/worker/notifications` or `/customer/notifications`.

### 4. Unread Count Approach
- A Client Component (`NotificationBell.tsx`) embedded in the global dashboard header.
- It will fetch the unread count on initial mount via the `getUnreadNotificationCount()` server action.
- Since real-time websockets are out of scope, the count will rely on Next.js routing (revalidation on navigation) or a simple periodic client-side poll (e.g., every 60 seconds) to simulate freshness without complexity.

### 5. Read/Unread Update Approach
- When a user clicks a notification in `NotificationList.tsx`, a Server Action `markNotificationAsRead` is fired. 
- If `action_url` is present, Next.js `router.push()` navigates the user to the destination *after* the read status is updated or optimistically in parallel.
- A "Mark all as read" button will trigger `markAllNotificationsAsRead()`.
- Use Next.js `revalidatePath('/dashboard/notifications')` to ensure cache freshness after updates.

### 6. Validation Strategy
- **Database level**: RLS ensures users can only read and update their own notifications.
- **Application level**: Server Actions will verify `auth.getUser()` before executing any query.

### 7. Loading & Error Handling
- Next.js `loading.tsx` will display a skeleton list while `getNotifications` resolves.
- Next.js `error.tsx` will catch and display a graceful fallback if fetching fails.
- `NotificationList.tsx` will handle the empty state (e.g., "You have no notifications").

## Risks and Mitigations

- **Risk**: Database triggers become difficult to maintain or debug.
  - *Mitigation*: Keep triggers strictly focused on inserting into `notifications`. Formatting the `title` and `body` in the database is acceptable for simple strings, but complex text should be avoided.
- **Risk**: Stale unread count badge due to lack of websockets.
  - *Mitigation*: Provide a refresh mechanism or utilize Next.js `revalidatePath` whenever a known mutating action occurs. Emphasize that slight delays in count updates are acceptable for Phase 18.
- **Risk**: Missing relations when formatting notifications.
  - *Mitigation*: Triggers will embed the necessary context (e.g., job title) directly into the notification `title` or `body` at creation time, eliminating the need for complex multi-table joins on read.

## Assumptions

- We can safely modify the `notifications` table schema without breaking existing undocumented systems.
- The UI design for the dashboard header has a logical place for a bell icon.
- English is the primary language for notification text in this phase.
- Notification history does not need to be pruned or archived immediately; we will keep all records indefinitely for now.
