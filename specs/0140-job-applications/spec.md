# Feature Specification: Phase 14 — Job Applications

**Feature Branch**: `140-job-applications`  
**Created**: 2026-04-27  
**Status**: Draft  
**Input**: User description: "Phase 14 — Job Applications under the unified dashboard."

---

## Purpose

Job Applications is the bridge between a posted job (created by a customer) and a booked engagement (confirmed in a future phase). It is the mechanism through which workers express intent to take on a job, and through which job owners curate that interest into a single accepted candidate.

This phase intentionally stops at application acceptance. An accepted application signals readiness for a booking, but no booking record is created here.

---

## Application Lifecycle

```
open job → worker applies (pending) → owner reviews → accepted | rejected
                                                     ↑
                                             (other applications remain pending or are rejected)
```

| Status      | Who Sets It        | Meaning                                                         |
| ----------- | ------------------ | --------------------------------------------------------------- |
| `pending`   | System (on submit) | Application has been submitted; awaiting job owner review.      |
| `accepted`  | Job owner          | Owner has selected this worker; job is considered pre-booked.   |
| `rejected`  | Job owner          | Owner has declined this worker's application.                   |
| `withdrawn` | Worker (future)    | Out of scope for this phase; reserved for future consideration. |

**Status rules:**

- Only one application per worker per job is permitted.
- Once a job has an `accepted` application, no further applications can be accepted on the same job (the job remains "open" in the database but appears closed to applicants).
- An owner may reject an accepted application and then accept another (re-open selection). This is an edge case and should be noted but not over-engineered.
- Workers cannot delete a submitted application in this phase.

---

## Dashboard Placement

All authenticated application functionality lives under `/dashboard`.

| Route                               | Actor     | Purpose                                            |
| ----------------------------------- | --------- | -------------------------------------------------- |
| `/dashboard/jobs/available`         | Worker    | Browse open jobs that match their categories.      |
| `/dashboard/jobs/available/[id]`    | Worker    | View job details and submit an application.        |
| `/dashboard/applications`           | Worker    | View all applications the worker has submitted.    |
| `/dashboard/jobs/[id]/applications` | Job Owner | View all applications received for a specific job. |

> **Architectural rule**: No `/worker` or `/customer` routes. All routes live under `/dashboard`.

---

## User Scenarios & Testing _(mandatory)_

### User Story 1 — Worker Browses Available Jobs (Priority: P1)

As a worker, I want to see a list of open jobs that are relevant to the service categories I offer, so that I can identify opportunities worth applying for.

**Why this priority**: Without discovery, workers cannot participate in the application flow at all. This is the entry point of the entire phase.

**Independent Test**: Can be fully tested by logging in as a worker with at least one category, navigating to `/dashboard/jobs/available`, and verifying only open jobs within matching categories appear.

**Acceptance Scenarios**:

1. **Given** I am a logged-in worker with at least one service category, **When** I visit `/dashboard/jobs/available`, **Then** I see a paginated list of open job posts in relevant categories with title, location, budget, and category visible on each card.
2. **Given** no open jobs exist in my categories, **When** I visit the page, **Then** I see a meaningful empty state explaining no jobs are currently available.
3. **Given** I have already applied to a job, **When** that job appears in the list, **Then** it is visually marked as "Applied" and I cannot apply again.

---

### User Story 2 — Worker Applies to a Job (Priority: P1)

As a worker, I want to apply to a job by submitting a short application message and a proposed price, so that the job owner can evaluate my interest and suitability.

**Why this priority**: Core transactional action of this phase. Without it, no applications can exist.

**Independent Test**: Can be fully tested by a worker navigating to a job detail page, completing the application form, submitting it, and confirming the application appears in their applications list.

**Acceptance Scenarios**:

1. **Given** I have not yet applied to this job, **When** I fill in an application message and proposed price and submit, **Then** a new application record is created with status `pending` and I receive a confirmation on screen.
2. **Given** I have already submitted an application for this job, **When** I try to apply again (e.g., by navigating directly to the form), **Then** the system blocks the duplicate and shows a clear message that I have already applied.
3. **Given** I leave required fields blank, **When** I attempt to submit, **Then** field-level validation errors are displayed and the form is not submitted.
4. **Given** the application message exceeds the maximum allowed length, **When** I attempt to submit, **Then** the system enforces the limit with a helpful message.

---

### User Story 3 — Worker Views Their Applications (Priority: P2)

As a worker, I want to see a list of all jobs I have applied to along with my current application status, so that I can track my activity in the marketplace.

**Why this priority**: Workers need visibility into their outgoing applications to manage themselves; without it, the apply action has no feedback loop.

**Independent Test**: Can be fully tested by logging in as a worker, applying to at least one job, then navigating to `/dashboard/applications` and confirming the entry appears.

**Acceptance Scenarios**:

1. **Given** I have submitted at least one application, **When** I visit `/dashboard/applications`, **Then** I see all my applications listed with job title, my proposed price, application date, and current status (`pending`, `accepted`, `rejected`).
2. **Given** one of my applications has been accepted, **When** I view the list, **Then** it is clearly highlighted or labelled as "Accepted."
3. **Given** I have never applied to any job, **When** I visit the page, **Then** I see an empty state encouraging me to browse available jobs.

---

### User Story 4 — Job Owner Reviews Received Applications (Priority: P1)

As a job owner, I want to view all applications submitted for a job I posted so that I can evaluate candidates and make a selection.

**Why this priority**: Without the ability to review incoming applications, the job owner side of this phase delivers no value.

**Independent Test**: Can be fully tested by posting a job as a customer, applying to it as a worker, then logging back in as the customer and navigating to `/dashboard/jobs/[id]/applications`.

**Acceptance Scenarios**:

1. **Given** my job has received applications, **When** I navigate to `/dashboard/jobs/[id]/applications`, **Then** I see a list of applicants with their name, message, proposed price, and application status.
2. **Given** no applications exist yet, **When** I view the applications page, **Then** I see a clear empty state indicating no applications received yet.
3. **Given** I am not the owner of the job, **When** I try to access `/dashboard/jobs/[id]/applications`, **Then** I am denied access with an appropriate error.

---

### User Story 5 — Job Owner Accepts or Rejects an Application (Priority: P1)

As a job owner, I want to accept or reject individual applications so that I can select the right worker for my job.

**Why this priority**: The accept/reject action is the primary decision-making event of this phase and is directly linked to future booking flows.

**Independent Test**: Can be fully tested by accepting an application and verifying its status changes to `accepted` and the applicant worker sees the updated status on their applications page.

**Acceptance Scenarios**:

1. **Given** I am looking at a `pending` application, **When** I click "Accept," **Then** the application status changes to `accepted` and an appropriate confirmation message is shown.
2. **Given** I am looking at a `pending` application, **When** I click "Reject," **Then** the application status changes to `rejected` and confirmation is shown.
3. **Given** a job already has an accepted application, **When** I try to accept another application for the same job, **Then** the system prevents this and informs me that a worker has already been accepted.
4. **Given** I have accepted an application, **When** the accepted worker views their application list, **Then** they see status `accepted` for that job.

---

### Edge Cases

- What happens if a worker applies to a job that has been closed or removed between list load and submission? (System must validate job is still `open` at submit time and return a clear error if not.)
- What happens if a job owner accepts an application and then deletes or closes the job? (Out of scope for this phase; must be handled by future phases.)
- What happens if the job owner's account is deleted or suspended after receiving applications? (Data integrity is maintained via foreign key constraints; behavior in the UI is a future concern.)
- What if both the "accept" and "reject" buttons are triggered simultaneously (race condition)? (The database constraint ensures only one accepted application per job; the second operation will fail gracefully.)
- What if a worker submits duplicate applications through parallel browser tabs? (Server-side uniqueness constraint on `(job_id, worker_id)` must prevent this.)

---

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a browsable list of open jobs at `/dashboard/jobs/available`, visible only to authenticated workers.
- **FR-002**: System MUST filter the available jobs list to show only jobs in categories the logged-in worker has selected.
- **FR-003**: System MUST provide a job detail view reachable from the available jobs list, showing full job metadata and an application form for eligible workers.
- **FR-004**: System MUST capture an `application_message` (required, max 1000 characters) as part of each application.
- **FR-005**: System MUST capture a `proposed_price` (required, numeric, positive value) as part of each application.
- **FR-006**: System MUST default newly submitted applications to a status of `pending`.
- **FR-007**: System MUST enforce that a worker can only submit one application per job (duplicate prevention via server-side unique constraint on `job_id` + `worker_id`).
- **FR-008**: System MUST display an error or blocked state if a worker attempts to apply to a job they have already applied to.
- **FR-009**: System MUST provide a worker applications list at `/dashboard/applications`, showing all applications submitted by the signed-in worker.
- **FR-010**: System MUST display each application's associated job title, proposed price, submission date, and current status on the worker applications list.
- **FR-011**: System MUST provide a received-applications view at `/dashboard/jobs/[id]/applications`, accessible only to the job's owner.
- **FR-012**: System MUST display each applicant's name, message, proposed price, and status on the received-applications view.
- **FR-013**: System MUST allow a job owner to accept a `pending` application, setting its status to `accepted`.
- **FR-014**: System MUST allow a job owner to reject a `pending` application, setting its status to `rejected`.
- **FR-015**: System MUST prevent a job owner from accepting more than one application for the same job at the same time.
- **FR-016**: All routes and features MUST reside under `/dashboard` with authenticated user context enforced. No `/worker` or `/customer` paths allowed.
- **FR-017**: System MUST validate all inputs server-side before persisting any application record.
- **FR-018**: System MUST show appropriate loading indicators during async data operations.
- **FR-019**: System MUST show appropriate empty states when no data is available (no available jobs, no submitted applications, no received applications).
- **FR-020**: System MUST show clear, user-friendly error messages when operations fail.
- **FR-021**: System MUST prevent access to `/dashboard/jobs/[id]/applications` for any user who is not the job owner.

### Key Entities

- **JobApplication**: Represents a worker's intent to take on a specific job. Key attributes: `job_id`, `worker_id`, `application_message`, `proposed_price`, `status` (pending | accepted | rejected), `created_at`. Has a unique constraint on `(job_id, worker_id)`.
- **JobPost** _(from Phase 13)_: Read by workers on the available jobs view. Must be `open` status to accept new applications.
- **WorkerProfile** _(from Phase 8)_: Displayed to the job owner when reviewing applications (name, summary).
- **WorkerCategory** _(from Phase 10)_: Used to filter visible jobs for the worker on the available jobs view.

---

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A worker with at least one service category can browse available jobs and successfully submit an application in under 3 minutes of total interaction time.
- **SC-002**: Duplicate application attempts are blocked 100% of the time at the server level, regardless of how many times the form is submitted.
- **SC-003**: A job owner can review all received applications and perform an accept or reject action within 2 navigational steps from their dashboard.
- **SC-004**: Application status changes made by the job owner are reflected on the worker's applications list without requiring a manual page reload (or at latest on next page load).
- **SC-005**: 100% of application-related UI and routes are scoped under `/dashboard` — zero routes exist under `/worker` or `/customer`.
- **SC-006**: All form submissions display validation feedback within 1 second of the user attempting to submit.

---

## Assumptions

- Workers must have a completed worker profile and at least one service category assigned before they can access the available jobs view. Profile completeness enforcement strategy is inherited from prior phases.
- The `job_applications` table exists in the database schema as designed in Phase 3.5 (T0358).
- The `job_posts` table has an `open` status value established in Phase 13.
- Notification delivery (e.g., "you have a new applicant") is explicitly out of scope for this phase and will be addressed in Phase 18.
- There is no real-time update mechanism in this phase; status changes become visible on next page load or manual refresh.
- Application withdrawal by workers is not supported in this phase and is deferred.
- Booking creation upon acceptance is explicitly out of scope; the accepted application only signals readiness for Phase 15.
- The worker's name and basic profile are accessible via a join between `job_applications` and `worker_profiles` when the job owner views applications.
- No advanced ranking, scoring, or AI-based matching occurs in this phase.

---

## Risks & Open Questions

| #   | Risk / Question                                                                                                           | Severity | Notes                                                                                                                   |
| --- | ------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1   | **Double-accept race condition**: Two browser sessions accept different applications at the same time.                    | Medium   | Database-level unique constraint on "one accepted per job" must be the enforcer; optimistic locking is not needed here. |
| 2   | **Category mismatch**: Worker has categories but none match available jobs, leaving available jobs list always empty.     | Low      | Handled by empty state + copy directing worker to update their categories.                                              |
| 3   | **Accepted application with no booking path yet**: Owner accepts but nothing happens next.                                | Medium   | Phase 15 will handle conversion. Spec must clearly label the feature as "pre-booking" today.                            |
| 4   | **Job owner role enforcement**: A user who is both a worker and a job owner should not be able to apply to their own job. | High     | System must prevent self-application. Owner check must be done on the job's `customer_id` vs the logged-in user.        |
| 5   | **Performance on large application lists**: A popular job could receive hundreds of applications.                         | Low      | Pagination must be applied to the received-applications view from the start.                                            |

---

## Definition of Done

- [ ] Available jobs view renders only open jobs filtered by the worker's categories.
- [ ] Apply form captures message and proposed price; server-side duplicate check enforced.
- [ ] Worker applications list shows all submitted applications with correct status badges.
- [ ] Received applications view is accessible only to the job owner and lists all applicants.
- [ ] Accept and reject actions update the application status correctly.
- [ ] Accepting a second application for the same job is blocked.
- [ ] Self-application (applying to your own job) is prevented.
- [ ] All routes are under `/dashboard`; no `/worker` or `/customer` paths exist.
- [ ] Loading, empty, and error states are all handled.
- [ ] No booking records are created as part of this phase.
- [ ] All functional requirements (FR-001 through FR-021) are demonstrably met.
