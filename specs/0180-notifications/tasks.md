---
description: "Task list for Phase 18 - Notifications implementation"
---

# Tasks: Phase 18 — Notifications

**Input**: Design documents from `/specs/0180-notifications/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Foundational (Notification Model)

**Purpose**: Core infrastructure for managing notifications in the database and server actions.

- [ ] T001 Create database migration in `supabase/migrations/` extending `notifications` table with `type` and `action_url` columns.
- [ ] T002 Define notification type constants in `src/lib/constants/notifications.ts` (e.g. `NEW_JOB`, `APPLICATION_RECEIVED`, `BOOKING_UPDATED`, `VERIFICATION_RESULT`).
- [ ] T003 Create `createNotification` internal helper function in `src/server/notifications/actions.ts` to standardize notification insertion.
- [ ] T004 Implement `getNotifications` and `getUnreadNotificationCount` Server Actions in `src/server/notifications/actions.ts`.
- [ ] T005 Implement `markNotificationAsRead` and `markAllNotificationsAsRead` Server Actions in `src/server/notifications/actions.ts`.

**Checkpoint**: Foundation ready - UI development and event attachment can now proceed.

---

## Phase 2: User Story 1 & 2 - Dashboard Notification Center (P1)

**Goal**: Users can view their notifications, see an unread badge, and mark notifications as read.

- [ ] T006 [P] Create `NotificationBell` Client Component in `src/components/notifications/NotificationBell.tsx` to fetch and display the unread count.
- [ ] T007 Integrate `NotificationBell` into the global dashboard header inside `src/app/(protected)/dashboard/layout.tsx`.
- [ ] T008 [P] Create `NotificationItem` component in `src/components/notifications/NotificationItem.tsx` handling visual read/unread states and click navigation.
- [ ] T009 Create `NotificationList` component in `src/components/notifications/NotificationList.tsx` supporting "mark all as read" and empty states.
- [ ] T010 Create the notification list page at `src/app/(protected)/dashboard/notifications/page.tsx` embedding `NotificationList`.
- [ ] T011 Implement `loading.tsx` and `error.tsx` in `src/app/(protected)/dashboard/notifications/` for robust UX.
- [ ] T012 Wire up click handlers in `NotificationItem` to navigate to `action_url` and trigger `markNotificationAsRead`.

**Checkpoint**: Notification Center UI is fully functional and testable with mock data.

---

## Phase 3: User Story 3 & 4 - Notification Events (P2)

**Goal**: Automatically trigger notifications when key platform events occur.

- [ ] T013 [P] Update job creation Server Action to notify relevant workers of new jobs (if job matching logic is currently supported).
- [ ] T014 [P] Update application submission Server Action to notify the job owner (customer) of new applications.
- [ ] T015 [P] Update booking status Server Actions (accept/reject/complete) to notify the affected user (worker or customer) of booking updates.
- [ ] T016 [P] Update verification review Server Action (admin approval/rejection) to notify the worker of their verification result.

**Checkpoint**: All specified core platform actions correctly dispatch in-app notifications.

---

## Phase 4: Validation & Polish

**Purpose**: End-to-end verification of the notification lifecycle and constraints.

- [ ] T017 Validate notification records are created correctly in the database when triggering an event.
- [ ] T018 Validate the notification list correctly filters by the authenticated user's ID (RLS testing).
- [ ] T019 Validate unread/read status updates immediately in the UI when a user interacts with a notification.
- [ ] T020 Validate unread count badge correctly increments/decrements.
- [ ] T021 Confirm no external notification channels (email/SMS/Push) are introduced.
- [ ] T022 Confirm dashboard navigation/back links function smoothly from the notifications page to specific resources.

**Done When**: A user can receive an application, see the unread bell increment, click it, view the application notification on the notifications page, click the notification to view the application detail page, and see the unread count decrement automatically.
