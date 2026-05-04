# Feature Specification: Phase 20 — Admin Moderation and Management

**Feature Branch**: `191-phase-20-admin`  
**Created**: 2026-05-04  
**Status**: Draft  
**Input**: User description: "Define the basic admin control actions needed to operate and moderate the platform."

---

## Purpose

Phase 19 established a read-only admin dashboard with visibility into platform entities. Phase 20 adds the first set of **safe, non-destructive admin control actions** — the minimum mutations an operator needs to moderate content, manage verification requests, and control category availability. Every action requires explicit confirmation and records an audit trail via admin notes.

The constitution is the source of truth. This spec does not restate it.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Category Active/Inactive Toggle (Priority: P1)

As an administrator, I need to toggle a service category between active and inactive states, so that I can control which categories are visible and available to workers and customers on the marketplace without deleting them.

**Why this priority**: Categories drive the entire matching model. An admin must be able to disable a problematic or seasonal category immediately. This is the simplest mutation and proves the admin action pattern end-to-end.

**Independent Test**: Can be tested by navigating to the admin categories page, toggling a category's active state, and verifying the category's `is_active` flag updates in the database and that the public marketplace no longer shows the deactivated category.

**Acceptance Scenarios**:

1. **Given** an admin viewing the categories list, **When** they click the toggle control on an active category, **Then** a confirmation dialog appears asking "Deactivate category [name]?"
2. **Given** an admin confirming the deactivation, **When** the action completes, **Then** the category's `is_active` flag is set to `false`, the badge updates to "Inactive", and a success feedback message is shown.
3. **Given** an admin toggling an inactive category back to active, **When** the action completes, **Then** the category's `is_active` flag is set to `true` and the badge updates to "Active".
4. **Given** a deactivated category, **When** a public user browses the marketplace, **Then** the deactivated category does not appear in category listings or search filters.

---

### User Story 2 — Verification Request Review & Approval/Rejection (Priority: P1)

As an administrator, I need to review a pending verification request, view the submitted documents, and approve or reject the request with mandatory notes, so that I can make informed trust decisions and provide clear reasoning to workers.

**Why this priority**: Verification is a core trust mechanism. Without admin ability to approve or reject, the verification queue from Phase 17/19 is permanently stuck in "pending" state.

**Independent Test**: Can be tested by navigating to the verification queue, selecting a pending request, reviewing the submitted document, entering admin notes, and approving or rejecting. Verify the worker's verification status updates accordingly and the admin notes are persisted.

**Acceptance Scenarios**:

1. **Given** an admin viewing the verification queue, **When** they select a pending verification request, **Then** they see the worker ID, submitted document (viewable link), submission date, and current status.
2. **Given** an admin reviewing a pending request, **When** they click "Approve", **Then** a confirmation dialog appears with a required admin notes text field.
3. **Given** an admin entering notes and confirming approval, **When** the action completes, **Then** the `verification_requests.status` is set to `verified`, the `admin_notes` field is populated, the worker's `worker_profiles.verification_status` is updated to `verified`, and a success message is shown.
4. **Given** an admin entering notes and confirming rejection, **When** the action completes, **Then** the `verification_requests.status` is set to `rejected`, the `admin_notes` field is populated with the rejection reason, the worker's `worker_profiles.verification_status` is updated to `rejected`, and a success message is shown.
5. **Given** a verification request that is already `verified` or `rejected`, **When** the admin views it, **Then** the approve/reject actions are disabled and the existing admin notes and decision are displayed as read-only.

---

### User Story 3 — Admin Notes for Moderation Decisions (Priority: P1)

As an administrator, I need to attach notes to every moderation action I perform, so that there is a clear record of the reasoning behind each decision and other admins can understand past actions.

**Why this priority**: Accountability and traceability are essential for any moderation system. Notes provide the minimum viable audit trail before a full audit log system is built.

**Independent Test**: Can be tested by performing any moderation action (category toggle, verification review) and verifying that admin notes are required, persisted, and visible in the admin interface.

**Acceptance Scenarios**:

1. **Given** an admin performing any moderation action (verification approve/reject), **When** the confirmation dialog appears, **Then** the admin notes field is required and the action cannot be submitted with empty notes.
2. **Given** completed moderation actions with notes, **When** an admin views the relevant record (verification request), **Then** the admin notes are visible in the record detail view.

---

### User Story 4 — System Record Visibility (Priority: P2)

As an administrator, I need to see all system records across the platform — including those normally hidden from regular users — so that I have complete operational visibility for moderation purposes.

**Why this priority**: Admins need unfiltered views to moderate effectively. Phase 19 established read-only visibility; this story ensures the existing views remain comprehensive and include status indicators that support moderation workflows.

**Independent Test**: Can be tested by verifying that admin overview pages display records regardless of ownership or visibility constraints, including inactive categories, rejected verifications, and all user types.

**Acceptance Scenarios**:

1. **Given** an admin on the categories page, **When** the page loads, **Then** both active and inactive categories are displayed with clear status indicators.
2. **Given** an admin on the verification queue page, **When** the page loads, **Then** all verification requests (pending, verified, rejected) are shown with filterable status indicators.
3. **Given** an admin on the users overview page, **When** the page loads, **Then** all users are shown regardless of profile type, including profile status indicators.

---

### User Story 5 — Safe Admin Actions with Confirmation (Priority: P2)

As an administrator, I need all moderation actions to require explicit confirmation before execution, so that accidental mutations are prevented and I can review my action before it takes effect.

**Why this priority**: Admin actions affect platform state for all users. Confirmation dialogs are a critical safety net against accidental changes.

**Independent Test**: Can be tested by triggering each admin action and verifying that a confirmation dialog appears before any mutation occurs, and that cancelling the dialog leaves the record unchanged.

**Acceptance Scenarios**:

1. **Given** an admin clicking any action button (toggle, approve, reject), **When** the button is clicked, **Then** a confirmation dialog appears describing the action, the target record, and the consequence.
2. **Given** an admin cancelling a confirmation dialog, **When** they click "Cancel" or dismiss the dialog, **Then** no mutation occurs and the UI remains unchanged.
3. **Given** an admin confirming an action, **When** the action is processing, **Then** the action button shows a loading state and duplicate submissions are prevented.
4. **Given** an action that fails (network error, permission error), **When** the error occurs, **Then** a clear error message is displayed and the record state is not corrupted.

---

### User Story 6 — Flagged/Problem Record Readiness (Priority: P3)

As an administrator, I need visual indicators on records that may require attention (e.g., pending verifications, inactive categories), so that I can quickly prioritize moderation work.

**Why this priority**: Attention indicators reduce admin workload by surfacing priority items. This is a visual enhancement on existing data, not a new data model.

**Independent Test**: Can be tested by verifying that records requiring attention are visually distinguished (badge color, icon, sort order) from normal records.

**Acceptance Scenarios**:

1. **Given** an admin viewing the verification queue, **When** there are pending requests, **Then** pending requests are visually highlighted and appear at the top of the list.
2. **Given** an admin viewing categories, **When** there are inactive categories, **Then** inactive categories display a distinct visual indicator (e.g., muted styling, warning badge).
3. **Given** an admin viewing the dashboard landing page, **When** there are items requiring attention, **Then** the relevant stat cards highlight the count (e.g., pending verifications count is visually emphasized).

---

### Edge Cases

- What happens when an admin tries to deactivate a category that has active workers assigned to it? → The deactivation proceeds but does not remove existing worker-category associations. Workers with the deactivated category retain it but it is hidden from new selections.
- What happens when two admins simultaneously approve/reject the same verification? → The first action wins. The second admin sees the updated state on refresh and the action buttons are disabled for non-pending requests.
- What happens when an admin tries to approve a verification where the document URL is broken or expired? → The admin can still approve/reject based on their judgment. Document availability is informational, not a system-enforced prerequisite.
- What happens when a network error occurs during an admin action? → The confirmation dialog shows an error state. The original record state is preserved (no partial mutations). The admin can retry.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a toggle control on each category row in the admin categories page that sets `service_categories.is_active` to `true` or `false`.
- **FR-002**: System MUST provide "Approve" and "Reject" action controls for each pending verification request in the admin verification queue.
- **FR-003**: System MUST update `verification_requests.status` and `worker_profiles.verification_status` atomically when a verification is approved or rejected.
- **FR-004**: System MUST require non-empty admin notes for all verification approve/reject actions. Notes are stored in `verification_requests.admin_notes`.
- **FR-005**: System MUST display a confirmation dialog before executing any moderation action (category toggle, verification approve/reject). The dialog must describe the action and its target.
- **FR-006**: System MUST prevent duplicate submission of actions by disabling the action button and showing a loading indicator during processing.
- **FR-007**: System MUST show clear success or error feedback after every action completes.
- **FR-008**: System MUST enforce admin-only access for all mutation actions using the existing `requireAdmin()` guard from `src/lib/services/admin.ts`.
- **FR-009**: System MUST continue to use the `(admin)` route group established in Phase 19. No `/worker` or `/customer` routes may be created.
- **FR-010**: System MUST display all records regardless of status on admin overview pages (e.g., inactive categories, rejected verifications) with clear status indicators.
- **FR-011**: System MUST sort flagged/attention items (pending verifications, inactive categories) to the top of their respective lists or provide visual emphasis.
- **FR-012**: System MUST handle loading, empty, and error states for all admin pages and action dialogs.

### Key Entities

- **service_categories**: Existing table. `is_active` (boolean) is toggled by the admin. The existing RLS policy `"Anyone can see active categories"` already filters inactive categories from public views.
- **verification_requests**: Existing table. `status` (verification_status enum: `unverified`, `pending`, `verified`, `rejected`) and `admin_notes` (text, nullable) are updated by admin actions.
- **worker_profiles**: Existing table. `verification_status` (verification_status enum) is updated as a side-effect of verification request decisions.
- **users**: Existing table. `is_admin` (boolean) determines access. No new user status fields are introduced in this phase.

---

## Admin Action Responsibilities

### Category Control Rules

1. Toggling `is_active` is the only category mutation in scope.
2. Deactivating a category hides it from public listings (enforced by existing RLS: `is_active = true`).
3. Deactivating does NOT remove existing `worker_categories` associations.
4. Reactivating a category restores it to public visibility immediately.
5. No category creation, editing, or deletion is in scope.

### Verification Approval/Rejection Rules

1. Only verification requests with `status = 'pending'` may be approved or rejected.
2. Approval sets `verification_requests.status` to `verified` and `worker_profiles.verification_status` to `verified`.
3. Rejection sets `verification_requests.status` to `rejected` and `worker_profiles.verification_status` to `rejected`.
4. Both actions require non-empty `admin_notes`.
5. The existing database trigger (`sync_verification_status`) already handles `worker_profiles.verification_status` sync on `verification_requests` status change.
6. Already-decided requests (verified/rejected) display their decision and notes as read-only. Actions are disabled.

### User Status Control

1. No new user status fields are introduced in this phase.
2. Admin users page continues to display existing profile and role information (read-only from Phase 19).
3. User suspension/banning is deferred to a future phase.

### Admin Notes Expectations

1. Notes are mandatory for verification approve/reject actions.
2. Notes provide the reasoning behind the decision (e.g., "Documents verified — national ID matches selfie" or "Rejected — document image is blurry and unreadable").
3. Notes are stored in `verification_requests.admin_notes`.
4. Notes are immutable once the decision is recorded (no editing after approval/rejection).
5. Notes are visible to other admins reviewing the record.

---

## Safety & Confirmation Expectations

1. Every mutation action requires an explicit confirmation dialog before execution.
2. Confirmation dialogs clearly state: the action type, the target record identifier, and the consequence.
3. Dialogs provide "Cancel" and "Confirm" buttons. Cancel dismisses with no side effects.
4. During processing, the confirm button shows a loading indicator and is disabled.
5. No hard deletes or destructive actions are permitted in this phase. All actions are reversible (category re-toggle) or final-but-non-destructive (verification decisions are appended, not deleted).

---

## Permission Expectations

1. All admin actions use the existing `requireAdmin()` server-side guard.
2. The `is_admin` flag on `public.users` is the single source of truth for admin access.
3. The `prevent_is_admin_update` trigger protects the flag from unauthorized modification.
4. No new permission levels or role hierarchies are introduced.

---

## Loading, Empty, and Error Expectations

1. **Loading**: All pages and action dialogs display loading indicators during data fetch and mutation processing.
2. **Empty**: Empty states show descriptive messages (e.g., "No pending verifications" with context).
3. **Error**: Network and server errors are caught and displayed inline. Failed actions do not corrupt record state. Users can retry.
4. **Optimistic updates**: NOT used. All UI updates wait for server confirmation to ensure data integrity.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admin can toggle any category's active/inactive state and see the change reflected in both the admin view and public marketplace.
- **SC-002**: Admin can approve a pending verification request with notes, and the worker's profile reflects `verified` status.
- **SC-003**: Admin can reject a pending verification request with notes, and the worker's profile reflects `rejected` status.
- **SC-004**: All moderation actions require confirmation before execution — no action fires on a single click.
- **SC-005**: All verification approve/reject actions require non-empty admin notes.
- **SC-006**: Already-decided verification requests show their decision as read-only with no re-action possible.
- **SC-007**: Admin pages display all records regardless of status with clear visual indicators.
- **SC-008**: Non-admin users cannot execute any admin mutation actions (server-side enforced).

---

## Assumptions

- **Phase 19 Foundation**: The admin dashboard structure, route group `(admin)`, layout, navigation, `requireAdmin()` guard, and read-only overview pages are fully implemented and stable.
- **Existing Schema**: The `service_categories.is_active`, `verification_requests.status`, `verification_requests.admin_notes`, and `worker_profiles.verification_status` columns already exist in the database.
- **Existing Trigger**: The `sync_verification_status` trigger on `verification_requests` already propagates status changes to `worker_profiles.verification_status`.
- **UI Components**: The project's Shadcn UI component library provides Dialog, Button, Badge, and form components needed for confirmation flows.
- **No New Tables**: This phase does not introduce new database tables or columns. All actions operate on existing schema.
- **No External Notifications**: Admin actions do not trigger email/SMS notifications. In-app notifications to workers (e.g., "Your verification was approved") are a separate concern and out of scope unless already wired.

---

## Out of Scope

- Payments management
- Disputes system
- Advanced audit logs (beyond admin notes)
- Advanced role/team permissions
- Automated fraud detection
- Destructive hard deletes
- Complex reporting/analytics
- User suspension/banning
- Category creation, editing, or deletion
- Bulk actions

---

## Risks & Open Questions

1. **RLS for Admin Mutations**: The existing RLS policies may restrict admin `UPDATE` operations on `service_categories` and `verification_requests`. The implementation will likely need to use the service role client or add admin-specific RLS policies. This is a plan-phase decision.
2. **Concurrent Admin Actions**: If multiple admins operate simultaneously, the last-write-wins. Is optimistic locking needed? Recommendation: not in this phase — keep it simple.
3. **Notification Integration**: Should approving/rejecting a verification trigger an in-app notification to the worker? If the notification system from Phase 15 is wired for verification events, this may already work via database triggers. Needs verification during planning.
4. **Category Toggle Impact**: Deactivating a category with active job posts — should existing open jobs in that category be affected? Recommendation: no, only new job creation is affected by category visibility.

---

## Definition of Done

- [ ] Category active/inactive toggle works end-to-end with confirmation dialog
- [ ] Verification approve action works end-to-end with mandatory notes and confirmation
- [ ] Verification reject action works end-to-end with mandatory notes and confirmation
- [ ] All admin actions enforce `requireAdmin()` server-side
- [ ] All mutations display confirmation dialogs before execution
- [ ] Admin notes are persisted and visible in the verification detail view
- [ ] Already-decided verification requests show read-only state with disabled actions
- [ ] Admin overview pages show all records regardless of status
- [ ] Loading, empty, and error states are handled for all pages and action dialogs
- [ ] No hard deletes or destructive actions are possible
- [ ] No `/worker` or `/customer` routes are created
- [ ] All functionality lives within the `(admin)` route group
