# Feature Specification: Worker Verification

**Feature Branch**: `0170-worker-verification`  
**Created**: 2026-05-02  
**Status**: Draft  
**Input**: User description: "Phase 17 — Worker Verification"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Submit Verification Documents (Priority: P1)

Workers need a dedicated section in their dashboard to submit required verification data so they can gain a verified badge on the platform.

**Why this priority**: Without a way to submit information, no verification process can exist.

**Independent Test**: Can be tested by having a test worker log in, navigate to the dashboard verification page, and successfully submit a document payload, ensuring the status changes to 'pending'.

**Acceptance Scenarios**:

1. **Given** a worker is logged in and unverified, **When** they navigate to `/dashboard/verification`, **Then** they see a prompt to upload a document and optionally a selfie.
2. **Given** the worker is on the verification page, **When** they submit a valid document, **Then** their verification status updates to 'pending' and they see a success message.

---

### User Story 2 - View Verification Status (Priority: P1)

Workers must be able to view their current verification status (e.g., Unverified, Pending, Approved, Rejected) so they know if they need to take further action.

**Why this priority**: Users need feedback on their submission and need to know their current standing.

**Independent Test**: Can be tested by modifying a worker's verification status in the database and verifying that the dashboard UI accurately reflects the state (e.g., showing 'Pending Review').

**Acceptance Scenarios**:

1. **Given** a worker has submitted documents, **When** they view `/dashboard/verification`, **Then** they see a 'Pending' status.
2. **Given** a worker's verification is rejected, **When** they view `/dashboard/verification`, **Then** they see a 'Rejected' status with instructions to resubmit.

---

### User Story 3 - Display Verified Badge (Priority: P2)

When a worker's verification is approved, a verified badge should be visible on their profile to increase trust with customers.

**Why this priority**: The primary benefit of verification for a worker is the trust signal it provides to potential customers.

**Independent Test**: Can be tested by setting a worker's status to 'approved' and ensuring the verified badge component renders where expected.

**Acceptance Scenarios**:

1. **Given** a worker is approved, **When** they or a customer view their profile or job application, **Then** a verified badge icon is displayed next to their name.
2. **Given** a worker is pending or unverified, **When** they or a customer view their profile, **Then** the verified badge is not displayed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a dedicated page under `/dashboard` (e.g., `/dashboard/verification`) for workers to manage verification.
- **FR-002**: System MUST NOT expose any verification functionality under `/worker` or `/customer` routes.
- **FR-003**: System MUST allow workers to upload a required verification document (e.g., ID).
- **FR-004**: System MUST allow workers to optionally upload a selfie/photo.
- **FR-005**: System MUST track verification lifecycle states: `unverified`, `pending`, `approved`, `rejected`.
- **FR-006**: System MUST display a 'Verified' badge for workers in the `approved` state.
- **FR-007**: System MUST provide clear loading, validation, and error feedback during document upload.
- **FR-008**: System MUST structure the saved verification data in a simple format ready for admin review.

### Key Entities *(include if feature involves data)*

- **Worker Verification**: Represents the verification submission, including:
  - `worker_id`
  - `status` (Enum: unverified, pending, approved, rejected)
  - `document_url` (Required)
  - `selfie_url` (Optional)
  - `submitted_at`
  - `reviewed_at`
  - `rejection_reason` (Optional)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Workers can successfully access the `/dashboard/verification` page and submit documents without errors.
- **SC-002**: The system accurately reflects the verification status (pending/approved/rejected) on the dashboard immediately following state changes.
- **SC-003**: A verified badge correctly renders for approved workers without affecting performance.

## Assumptions

- We are building a simple admin-review-ready structure; a full admin UI is out of scope for this phase.
- File storage (e.g., Supabase Storage) is available and will handle document and selfie uploads.
- We do not integrate with a third-party KYC provider.
- Disputes, background checks, and payment verification are not part of this verification process.
- Only authenticated workers can submit their own verification information.

## Risks & Open Questions
- **Risk**: Storing sensitive documents requires appropriate security and bucket policies.
- **Open Question**: Do we need to define specific file size limits or formats for the document and selfie uploads, or rely on global default storage limits?
- **Open Question**: Should workers be allowed to withdraw a pending verification request?

## Definition of Done
- Verification submission form is fully functional at `/dashboard/verification`.
- Status display accurately reflects current state (Pending/Approved/Rejected/Unverified).
- Verified badge displays for approved users.
- Verification data structure is created and allows for simple status updates (simulated admin review).
- No code is created outside the `/dashboard` routing structure.
