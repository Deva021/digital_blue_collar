# Feature Specification: Phase 13 — Job Posting

**Feature Branch**: `121-working-phase-13`  
**Created**: 2026-04-25  
**Status**: Draft  
**Input**: User description: "Phase 13 — Job Posting under the unified dashboard."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Create a Job Post (Priority: P1)

As a customer needing a service, I want to create a new job post specifying what I need (title, description, category, location, budget), so that workers can discover and apply for my job.

**Why this priority**: Creating job posts is the foundation of the marketplace's "demand" flow. Without demand, workers cannot apply.

**Independent Test**: Can be fully tested by logging in as a customer, navigating to `/dashboard/jobs/new`, filling out the form, submitting it, and verifying the new job appears in the user's job management list.

**Acceptance Scenarios**:

1. **Given** I am on the `/dashboard/jobs/new` page, **When** I fill in all required fields and submit, **Then** a new job is created in the database with status "open" and I am redirected to my job list.
2. **Given** I leave required fields empty, **When** I submit, **Then** I see clear field-level error messages preventing submission.

---

### User Story 2 - View Active Jobs List (Priority: P1)

As a customer, I want to view a list of all jobs I have posted from my dashboard, so that I can see their status and access their details.

**Why this priority**: Customers need visibility into what they've thrown out into the marketplace to manage them effectively.

**Independent Test**: Can be fully tested by logging in and navigating to `/dashboard/jobs` to see a list of authored job posts fetching dynamically.

**Acceptance Scenarios**:

1. **Given** I am on the `/dashboard/jobs` page, **When** I have active jobs, **Then** I see them listed with their titles, statuses, and key metadata.
2. **Given** I have never posted a job, **When** I view the list, **Then** I see an empty state urging me to post my first job.

---

### User Story 3 - View Job Details (Priority: P2)

As a customer, I want to view the details of a specific job post I created, so I can review its requirements and status before managing applications.

**Why this priority**: Essential to verify job accuracy and acts as the anchor page where applications will be managed in future phases.

**Independent Test**: Can be fully tested by clicking on a job in the list and being taken to `/dashboard/jobs/[id]`.

**Acceptance Scenarios**:

1. **Given** I click a job post acting as the owner, **When** the page loads, **Then** I see the full contents (title, desc, budget, etc) formatted readably.

### Edge Cases

- What happens when a user enters an extremely long description or title? (UI must clamp lines or expand properly, max text constraints enforced via Zod).
- How does the system handle concurrent updates to the same job post if editing is ever enabled in the future? (Standard DB concurrency rules).
- What happens if a customer tries to access a job posting form but hasn't completed their basic profile yet? (Should be warned or blocked depending on the unified dashboard's overarching profile requirements).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a job posting form anchored at `/dashboard/jobs/new`.
- **FR-002**: System MUST capture job `title` (required) and `description` (required).
- **FR-003**: System MUST require linking the job to an existing system `category_id`.
- **FR-004**: System MUST capture `location_text` (required, supporting text-only location logic).
- **FR-005**: System MUST capture `budget_range` and a boolean flag indicating if it is `is_negotiable`.
- **FR-006**: System MUST capture the number of workers needed (`workers_needed`).
- **FR-007**: System MUST allow optional date/duration fields depending on underlying schema capabilities.
- **FR-008**: System MUST default newly created jobs to an "open" status automatically.
- **FR-009**: System MUST present a list of the user's jobs at `/dashboard/jobs`.
- **FR-010**: System MUST present a detailed view page at `/dashboard/jobs/[id]`.
- **FR-011**: All features MUST exist securely under the `/dashboard` hierarchy, checking for valid authenticated user context, strictly avoiding legacy `/customer` paths.

### Key Entities

- **JobPost**: Represents the gig/work needed by a user. Attributes include title, description, budget parameters, required category, location text, worker count, and status. It inherently maps to the `customer_id` creating the posting.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: User can successfully load `/dashboard/jobs/new` and submit a valid, error-free payload creating a new record in the `job_posts` table.
- **SC-002**: User can traverse from Dashboard -> Job List -> Job Detail smoothly without encountering unhandled null errors.
- **SC-003**: 100% of the UI exists under `/dashboard` components and layout context.

## Assumptions

- Job applications, complex calendar-based billing logic, and deep messaging are purely relegated to later phases (Phase 14, 15+).
- Form validations will rely on standard `zod` and `react-hook-form` structural patterns leveraged previously in the project.
- Visual hierarchy strictly aligns with the established UI system rules.
