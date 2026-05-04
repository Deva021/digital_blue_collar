# Feature Specification: Phase 19 — Admin Dashboard

**Feature Branch**: `181-phase-19-admin`  
**Created**: 2026-05-04  
**Status**: Draft  
**Input**: User description: "Define the admin dashboard foundation for platform operations."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Admin Route Protection (Priority: P1)

As an administrator, I need to access the dashboard on a secure admin-specific route, so that regular users cannot access administrative controls.

**Why this priority**: Without strict route protection, the system is fundamentally insecure. This is the foundational prerequisite for all admin features.

**Independent Test**: Can be tested by attempting to access an admin route with various authentication states (unauthenticated, authenticated customer, authenticated worker, authenticated admin) and verifying access control.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user, **When** they navigate to the admin dashboard route, **Then** they are redirected to the login page.
2. **Given** an authenticated user without admin privileges (customer or worker), **When** they navigate to the admin dashboard route, **Then** they are denied access and shown an unauthorized/404 page.
3. **Given** an authenticated admin user, **When** they navigate to the admin dashboard route, **Then** they successfully view the admin dashboard landing page.

---

### User Story 2 - Admin Dashboard Navigation (Priority: P1)

As an administrator, I need a clear navigation structure specifically for administrative sections (Users, Categories, Jobs, Bookings, Verifications, Reports), so that I can easily move between different management areas.

**Why this priority**: Admins require a distinct workspace separate from the normal user dashboard to manage platform operations.

**Independent Test**: Can be tested by rendering the admin layout and verifying that the navigation sidebar/header contains the correct links that route to the respective overview pages.

**Acceptance Scenarios**:

1. **Given** an admin user on the admin dashboard, **When** they view the navigation menu, **Then** they see clearly labeled links to Users, Categories, Jobs, Bookings, Verification Queue, and Reports.
2. **Given** an admin user clicking a navigation link, **When** the link is activated, **Then** they are routed to the correct overview page.

---

### User Story 3 - Admin Dashboard Landing Page & Basic Stats (Priority: P2)

As an administrator, I need an overview landing page showing basic platform statistics, so that I can quickly assess platform health, user growth, and pending tasks.

**Why this priority**: Provides an immediate high-level summary of platform activity, serving as the entry point for daily admin operations.

**Independent Test**: Can be tested by loading the admin landing page and verifying that aggregated metrics (users, jobs, etc.) are fetched and displayed accurately.

**Acceptance Scenarios**:

1. **Given** an admin user navigating to the admin landing page, **When** the page loads, **Then** they see high-level statistics cards (e.g., total users, active jobs, recent bookings, pending verifications).

---

### User Story 4 - Entity Overview Pages (Priority: P2)

As an administrator, I need dedicated overview pages for core platform entities (Users, Categories, Jobs, Bookings, Verifications), so that I have complete visibility into all records regardless of ownership and the previous constraint which is keeping the design simple as it should be convinent for users with slow network and low devices is revoked for this as admins have good device and fast network acces.

**Why this priority**: Essential for platform visibility. This phase establishes the structure for viewing these entities; detailed management actions (create/update/delete) are deferred to Phase 20.

**Independent Test**: Can be tested by visiting each overview route and verifying that a list or data table of the respective entity renders successfully.

**Acceptance Scenarios**:

1. **Given** an admin user on the Users overview page, **When** the page loads, **Then** a comprehensive list of all users (customers and workers) is displayed.
2. **Given** an admin user on the Verification Queue overview page, **When** the page loads, **Then** a list of pending verification requests is displayed.
3. **Given** an admin user on the Reports placeholder page, **When** the page loads, **Then** a placeholder UI indicating future functionality is displayed.

---

### User Story 5 - Loading, Empty, and Error States (Priority: P3)

As an administrator, I need clear UI feedback during data fetching, when an error occurs, or when a list is empty, so that I am always aware of the system's status.

**Why this priority**: A standard UI/UX requirement for all robust dashboards to prevent user confusion.

**Independent Test**: Can be tested by simulating slow network responses (loading state), returning empty datasets (empty state), or simulating failed API requests (error state).

**Acceptance Scenarios**:

1. **Given** an admin user navigating to a section with no data (e.g., an empty Verification Queue), **When** the page loads, **Then** a clear "no data" or empty state illustration/message is shown.
2. **Given** an admin user navigating to a section that is fetching data, **When** the request is in flight, **Then** a loading skeleton or spinner is displayed.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST strictly enforce admin-only access to all admin routes using the existing authentication and authorization architecture.
- **FR-002**: System MUST utilize the existing admin route strategy (e.g., standard Next.js route groups or specific folder paths) and MUST NOT create or use `/worker` or `/customer` routes for admin functionality.
- **FR-003**: System MUST provide an admin dashboard landing page that displays basic aggregated platform statistics.
- **FR-004**: System MUST provide distinct, read-only structural overview pages for: Users, Categories, Jobs, Bookings, and the Verification Queue.
- **FR-005**: System MUST provide a placeholder page for Reports.
- **FR-006**: System MUST establish a distinct admin navigation layout and structure that is separate from the normal user (customer/worker) dashboard.
- **FR-007**: System MUST implement standard loading (`loading.tsx`), empty state, and error handling (`error.tsx`) components for all admin views.

### Key Entities

- **Admin Role/Profile**: The identifier or role flag used to determine if a user has elevated privileges.
- **Users**: Aggregated view of all registered profiles.
- **Jobs**: Aggregated view of all marketplace tasks.
- **Bookings**: Aggregated view of all contracts/agreements.
- **Verification Requests**: Aggregated view of worker identity/document submissions.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% of non-admin authenticated users attempting to access admin routes are successfully blocked and redirected/shown an error.
- **SC-002**: Admin navigation structure is successfully implemented and links to 6 distinct overview/placeholder pages (Users, Categories, Jobs, Bookings, Verifications, Reports).
- **SC-003**: The admin landing page renders successfully and displays at least 4 key platform statistics without errors.

## Assumptions

- **Admin Identification**: An existing strategy for identifying "admin" users (e.g., a specific role in Supabase auth, a database flag, or a separate admin table) either exists or will be definitively chosen and implemented as part of the route protection setup.
- **UI Components**: The project's existing design system and component library (e.g., Shadcn UI) will be utilized for constructing the admin dashboard layouts and tables.
- **Scope Limitation**: Complex moderation workflows, payments management, and detailed dispute handling are explicitly out of scope for this phase. This phase focuses entirely on structural visibility (read-only overviews). Admin control actions (mutations) will be implemented in Phase 20.
- **Architecture**: The implementation will adhere to the project's "API-as-Gateway" rule, utilizing server components and actions appropriately within the established Next.js App Router patterns.
