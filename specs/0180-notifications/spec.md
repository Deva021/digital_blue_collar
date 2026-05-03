# Feature Specification: Phase 18 — Notifications

**Feature Branch**: `0180-notifications`  
**Created**: 2026-05-02
**Status**: Draft  
**Input**: User description: "Phase 18 — Notifications"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Viewing Notification Center (Priority: P1)

As an authenticated user, I want to view my recent notifications in a centralized dashboard hub so that I can stay informed about important events related to my account without checking multiple pages.

**Why this priority**: The core foundation of notifications is having a dedicated space to view them. Without this, notifications cannot be consumed.

**Independent Test**: Can be tested by verifying the notification center icon exists in the dashboard layout, navigating to the notification list page, and confirming the presence of existing unread and read notifications.

**Acceptance Scenarios**:

1. **Given** I am logged into the dashboard with no unread notifications, **When** I look at the notification icon, **Then** I see the icon without an unread indicator.
2. **Given** I am logged into the dashboard with unread notifications, **When** I look at the notification icon, **Then** I see an unread badge displaying the total count of unread notifications.
3. **Given** I click the notification icon, **When** I am navigated to the notification list page, **Then** I see a paginated list of all my notifications ordered by most recent first.

---

### User Story 2 - Notification Lifecycle (Unread to Read) (Priority: P1)

As a user with unread notifications, I want to be able to mark them as read so that I can keep track of which items I have already acknowledged.

**Why this priority**: Tracking which notifications require attention versus those already seen is crucial for managing cognitive load and ensuring important events aren't missed.

**Independent Test**: Can be tested by clicking an unread notification or explicitly marking it as read, then verifying the visual state changes and the global unread count decrements.

**Acceptance Scenarios**:

1. **Given** an unread notification in the list, **When** I click on it to view its associated action/content, **Then** the notification's state changes to "read" and the global unread count decreases by 1.
2. **Given** I am on the notification list page, **When** I click a "Mark all as read" button, **Then** all unread notifications are marked as read and the unread badge is cleared.

---

### User Story 3 - Receiving Booking-Related Notifications (Priority: P2)

As a worker or customer involved in a booking, I want to receive notifications when a booking is created, accepted, rejected, or completed so that I am always aware of my job statuses.

**Why this priority**: Bookings are the primary transaction of the platform, so users must be promptly informed of any status changes.

**Independent Test**: Can be tested by triggering a booking status change (e.g., as a customer booking a worker) and verifying a corresponding notification appears in the recipient's notification center.

**Acceptance Scenarios**:

1. **Given** a customer requests a booking, **When** the booking is created, **Then** the targeted worker receives a "Booking Request" notification.
2. **Given** a worker accepts a booking, **When** the booking status changes to accepted, **Then** the customer receives a "Booking Accepted" notification.

---

### User Story 4 - Receiving Verification and Application Notifications (Priority: P2)

As a worker, I want to be notified when my profile verification status changes or when there are updates to my job applications, so I know when I can start accepting certain jobs.

**Why this priority**: Identity verification and job applications are critical onboarding/earning steps that require clear communication of outcomes.

**Independent Test**: Can be tested by changing a worker's verification status via an admin action and verifying the worker receives a notification explaining the result (approved/rejected).

**Acceptance Scenarios**:

1. **Given** a worker submits verification documents, **When** an admin approves the verification, **Then** the worker receives a "Verification Approved" notification.
2. **Given** a worker applies for a job, **When** the application is accepted by the customer, **Then** the worker receives an "Application Accepted" notification.

### Edge Cases

- What happens when a user has thousands of unread notifications? (Unread badge should cap at e.g., "99+").
- How does system handle notifications that link to deleted resources (e.g., a booking that was subsequently canceled and removed)? (Notification should degrade gracefully, perhaps showing plain text without a link or a generic "Resource unavailable" message).
- How are notifications fetched on initial load versus subsequent navigation?
- What happens if a user is offline when a notification is created? (In-app notifications persist in the database and will appear when they next log in).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support creating notifications for specific users (`user_id`).
- **FR-002**: System MUST define distinct notification types (e.g., `booking_created`, `booking_accepted`, `verification_approved`, `verification_rejected`, `application_accepted`, `application_rejected`, `system_alert`).
- **FR-003**: System MUST provide a dedicated notification list page within the `/dashboard` routing group.
- **FR-004**: System MUST NOT expose any notification functionality on public routes, `/worker`, or `/customer` routes.
- **FR-005**: System MUST track the `read` status of each notification (boolean or timestamp).
- **FR-006**: System MUST display an aggregate unread count badge in the global dashboard layout.
- **FR-007**: System MUST allow users to navigate from a notification to the relevant resource (e.g., clicking a booking notification goes to the booking detail page).
- **FR-008**: System MUST support marking individual notifications as read.
- **FR-009**: System MUST automatically generate notifications in response to specific system events (e.g., booking state changes, verification updates) via database triggers or server-side logic.
- **FR-010**: System MUST handle empty states gracefully (e.g., "You have no notifications").
- **FR-011**: System MUST display relative timestamps for notifications (e.g., "2 hours ago").
- **FR-012**: System MUST NOT implement real-time websocket delivery (notifications are fetched on page load/navigation).
- **FR-013**: System MUST NOT send email, SMS, or push notifications for this phase.

### Key Entities

- **Notification**: Represents a single informational event for a user.
  - Attributes: `id`, `user_id` (recipient), `type` (enum/string), `title`, `message`, `action_url` (optional link), `is_read` (boolean), `created_at`.
  - Relationships: Belongs to a User.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view all their notifications in a dedicated dashboard list.
- **SC-002**: Users can clearly distinguish between read and unread notifications visually.
- **SC-003**: Important platform events (bookings, verifications) consistently generate the correct corresponding notification for the intended recipient.
- **SC-004**: The unread count badge accurately reflects the number of unread notifications in the database.

## Assumptions

- Notifications are strictly in-app and fetched via standard HTTP requests (no websockets/real-time subscriptions required for this phase).
- There is no need for advanced notification preferences (users cannot opt-out of these core platform notifications).
- Standard pagination or infinite scroll will be sufficient for the notification list page.
- Notifications will be generated reliably by the backend services or database triggers when core entities (bookings, verifications) are updated.

## Definition of Done

- Notification data model is defined and migrations are created.
- Server actions/queries for fetching, counting, and marking notifications as read are implemented.
- Dashboard global layout includes a notification bell icon with an accurate unread badge.
- A dedicated notification list page (`/dashboard/notifications`) is fully implemented with pagination/loading/empty/error states.
- Triggers or backend logic are in place to create notifications for bookings, applications, and verifications.
- All routing strictly adheres to the `/dashboard` rule.
- No real-time or external delivery mechanisms (email/SMS) are implemented.
