# Feature Specification: Phase 9 — Customer Profile and Account Area

**Feature Branch**: `081-phase-9-customer`  
**Created**: 2026-04-24  
**Status**: Ready for Planning
**Input**: Phase 9: Establish the customer profile foundation, onboarding, and basic dashboard layout.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Create Customer Profile (Priority: P1)

As a newly registered user who wants to hire a worker, I need to create a basic customer profile so that I can establish my identity and default location in the marketplace.

**Why this priority**: Without a customer profile, the user cannot eventually post jobs or create bookings. It is the fundamental gating step for the demand side of the marketplace.

**Independent Test**: Can be fully tested by creating a new account, optionally bypassing worker onboarding, and completing the Customer Onboarding sequence to persist a `customer_profiles` record.

**Acceptance Scenarios**:

1. **Given** an authenticated user without a `customer_profiles` record, **When** they attempt to access the customer dashboard, **Then** they are presented with a lightweight customer initialization/onboarding form.
2. **Given** the customer onboarding form, **When** the user provides their identity details and default location, **Then** the system persists the data and transitions them securely to their customer dashboard.

---

### User Story 2 - Navigate the Customer Dashboard (Priority: P1)

As a registered customer, I want a centralized dashboard where I can understand my active status and eventually see my job posts and bookings.

**Why this priority**: The dashboard is the primary anchor point for the user. While job and booking features don't exist yet, the architectural placeholders must be established now to prevent future structural rewrites.

**Independent Test**: Can be fully tested by logging in as a recognized customer and verifying the presence of placeholder sections linking to Job Management and Bookings.

**Acceptance Scenarios**:

1. **Given** a user with a valid customer profile, **When** they navigate to `/customer/dashboard`, **Then** they see their profile summary and designated skeleton areas for "My Jobs" and "My Bookings".

---

### User Story 3 - Map and Edit Profile Settings (Priority: P2)

As an active customer, I need to be able to modify my basic identity and default location text so that my job postings accurately reflect my current whereabouts.

**Why this priority**: Users move or make typos during onboarding. Letting them manage their own configuration reduces administration overhead.

**Independent Test**: Can be fully tested by modifying the location text in the settings and verifying that the changes persist to the database.

**Acceptance Scenarios**:

1. **Given** an active customer, **When** they edit their location text in `/customer/settings/profile`, **Then** the updated location is saved successfully.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST supply a lightweight onboarding interface for customers to capture basic identity details and location text.
- **FR-002**: System MUST intercept requests to the customer dashboard if the user lacks a valid `customer_profiles` record and present the creation mechanism. (Note: Onboarding should be optional at login, but required to access customer-specific tools).
- **FR-003**: System MUST provide a profile editing form corresponding to the `customer_profiles` table.
- **FR-004**: System MUST render a primary `/customer/dashboard` containing visual placeholders for "My Job Posts" and "My Bookings" features.
- **FR-005**: Form mutations MUST implement Zod schema validations for robust error handling.
- **FR-006**: Form mutations MUST gracefully handle loading states (spinners/disabling).

### Key Entities

- **Customer Profile (`public.customer_profiles`)**: Stores the user's primary marketplace identity as a consumer, mapping exactly one 1:1 row per `public.users` instance. Stores foundational `location_text`.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Unprofiled users securely flow into the customer creation ecosystem seamlessly upon interacting with customer-gated features.
- **SC-002**: Customer dashboards load devoid of server-side data extraction errors.
- **SC-003**: Empty states appropriately communicate placeholders for later Phase functions (Jobs / Bookings).

## Assumptions

- We are leveraging the Next.js `middleware.ts` foundation evolved during Phase 8.
- The `auth.users` -> `public.users` synchronization logic created in Phase 8 mitigates foreign-key constraint violations organically.
- Dual-role capability (Users being both Customers and Workers concurrently) is inherently supported by the database, meaning a worker can simultaneously create a customer profile if desired.
- Customer locations are kept as simple plain-text `location_text` strings for Phase 9 without requiring map/GPS validation at this stage.
