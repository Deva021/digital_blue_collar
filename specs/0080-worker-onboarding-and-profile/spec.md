# Feature Specification: Phase 8 — Worker Onboarding and Worker Profile

**Feature Branch**: `040-phase-8-worker`  
**Created**: 2026-04-23  
**Status**: Draft  
**Input**: Phase 8 establishes how a worker becomes a fully usable participant in the platform, covering profile foundation and the onboarding flow.

## 1. Overview & Purpose

The primary goal of Phase 8 is to define how a registered user transitions into a fully capable **Worker** within the system. It establishes the necessary responsibilities of the worker profile, defining the exact path users take to supply required identity records, professional biographics, area of operation (location), physical readiness (tool access/travel capacity), and availability status, granting them access to their centralized worker dashboard.

### 1.1 In Scope

- **Identity Synchronization**: Ensuring the `public.users` record exists for the authenticated session before profile creation.
- Worker onboarding flow and entry points
- Worker profile creation and subsequent editing
- Identity and basic descriptive details
- Professional bio and experience summaries
- Text-based location declarations
- Logistics modifiers (`can_travel`, `has_tools`)
- Availability status toggles
- Profile image placeholder/upload UX expectations
- Navigation entry into the Worker Dashboard

### 1.2 Out of Scope

- Customer profile logic (Phase 9)
- Deep category selection logic (Phase 10)
- Worker service definition/pricing (Phase 11)
- Booking, applications, or job interactions (Phases 13-15)
- Document verification workflows (Phase 17)
- Admin moderation pathways (Phase 20)

## 2. User Scenarios & Testing

### User Story 1 - Worker Onboarding Flow (Priority: P1)

As a newly registered worker, I need to complete my onboarding profile so that I can officially access my dashboard and prepare to offer services.
**Why this priority**: Without an instantiated worker profile, a user cannot act as a worker in the system.
**Independent Test**: Can be tested by navigating a fresh user to the onboarding route, filling out the required details, and verifying successful redirection to the worker dashboard upon record creation.

**Acceptance Scenarios**:

1. **Given** a new authenticated user with no worker profile, **When** they attempt to access protected worker routes, **Then** they are redirected to the worker onboarding flow.
2. **Given** a user on the onboarding page, **When** they submit all required profile fields, **Then** a `worker_profiles` record is linked to their account and they are routed to the dashboard.

### User Story 2 - Profile Core Data Updates (Priority: P1)

As an active worker, I need to edit my profile details (bio, experience, location, logistics) so that my public representation remains accurate.
**Why this priority**: Profiles are living documents; tradespeople frequently update their availability, tool access, and bios.
**Independent Test**: Can be tested by loading the profile settings page, mutating data, and validating the subsequent database patch reflects the input accurately.

**Acceptance Scenarios**:

1. **Given** an existing worker, **When** they submit valid updates to their profile via the settings form, **Then** their profile record updates immediately without errors.

### User Story 3 - Logistics & Availability Toggling (Priority: P2)

As a worker, I need to quickly toggle my actionable status (availability, `has_tools`, `can_travel`) securely to reflect my dynamic operational states.
**Why this priority**: Granular logistics are central to the gig matchmaking framework.

**Acceptance Scenarios**:

1. **Given** an existing worker, **When** they mutate their toggleable boolean fields, **Then** the UI reflects the saving state and successfully persists the boolean values.

## 3. Requirements

### 3.1 Functional Requirements

- **FR-000**: System MUST ensure a valid record exists in `public.users` matching the `auth.uid()` before proceeding to worker profile instantiation.
- **FR-001**: System MUST provide a dedicated, isolated rendering of the onboarding flow for initial profile creation.
- **FR-002**: System MUST intercept requests to the worker dashboard if the user lacks a valid worker profile record, intercepting them to the onboarding sequence.
- **FR-003**: System MUST enforce Validation for required fields (e.g., location, bio text boundaries).
- **FR-004**: System MUST differentiate cleanly between required fields (Location, Identity) and optional augmentations (Profile imagery, strict availability).
- **FR-005**: System MUST present clean error formatting, skeleton loading states during form data retrieval, and explicit disabling of submit buttons during pending server actions.
- **FR-006**: System MUST supply a structured navigation entry point granting the worker access to the primary dashboard after profile initialization.

### 3.2 Data Fields (Worker Profile context)

- **Identity Details**: Profile image, displayed name structures.
- **Bio/Experience**: Rich text or constrained text blocks for professional summarization.
- **Location**: Freeform string entry for primary operational area.
- **Logistics**: `can_travel` (Boolean), `has_tools` (Boolean), `availability_status` (Enum/Boolean).

## 4. Success Criteria

### 4.1 Measurable Outcomes

- **SC-001**: 100% of new workers successfully hit the Onboarding boundary when attempting dashboard entry without a profile.
- **SC-002**: Form validation correctly captures missing required identities before triggering database calls.
- **SC-003**: Secure transition routing resolves completely to `/dashboard` natively immediately following the profile initialization `INSERT` action.

## 5. Assumptions, Risks & Open Questions

**Assumptions**:

- Existing authentication session contexts (Phase 7 utilities) will be leveraged to pull the current `user_id`.
- The database schema `worker_profiles` defined in Phase 3 is locked and prepared to receive these inserts.
- Image uploads will temporarily rely on UI placeholders or simple storage bucket interactions without heavy cropping logic until polished further.

**Risks & Mitigations**:

- _Redirect Loops_: If the verification of profile existence fails or incorrectly routes, users may be trapped in an onboarding loop. _Mitigation: strict unit testing around `worker_profiles` fetch logic in the route bounds._

## 6. Definition of Done

- Onboarding page UI is structurally complete and fully responsive.
- Next.js server actions validate and safely insert the new `worker_profiles` row to Supabase.
- Edit/Update profile functionality is successfully mapped and tested.
- Error handling toasts/text are correctly surfacing server rejection rules.
- Successful profile creation automatically opens access to the primary, previously-guarded Worker Dashboard.
