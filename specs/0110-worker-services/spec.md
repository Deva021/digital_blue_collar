# Feature Specification: Phase 11 — Worker Services

**Feature Branch**: `0110-worker-services`  
**Created**: 2026-04-25  
**Status**: Draft

## Goal

Define how users (in worker context) create and manage the specific services they offer. This establishes the service layer of the marketplace without entering the realms of discovery ranking or booking flows.

## Core Definitions

### Purpose of a Service

A "Service" represents a distinct, bookable offering provided by a worker. While "Categories" define the generic taxonomy (e.g., "Plumbing"), a Service defined by the worker allows them to express exactly what they do, how they charge, and provide unique context (e.g., "Emergency Leak Repair" under the Plumbing category).

### Service Responsibilities

Services are responsible for:

- Presenting a clear title and description to customers.
- Establishing pricing models (fixed vs. negotiable).
- Linking to the marketplace's official taxonomy via Categories.
- Retaining an active/inactive state so workers can temporarily pause specific offerings without deleting them.

### Required vs Optional Fields

- **Required**: `title` (string), `description` (long string), `category_id` (foreign key string), `is_negotiable` (boolean), `is_active` (boolean).
- **Optional**: `base_price` (numeric). It is optional strictly in scenarios where `is_negotiable` is true and a base quote doesn't apply.

### Category Linkage Rules

- A Service MUST link to an existing `service_category` that is `is_active=true` at the time of creation.
- A single Service maps to exactly one Category (1:1 mapping at the service row level) to maintain strong categorization during job-matching later.

### Lifecycle (Create → Update → Enable/Disable)

1. **Creation**: Worker constructs the service natively from their unified dashboard.
2. **Update**: Worker can modify title, description, or pricing attributes at any time.
3. **Enable/Disable**: Worker toggles the `is_active` boolean; this instantly hides the Service from potential customers, retaining the history without a destructive delete.

---

## User Scenarios & Testing

### User Story 1 - Service Creation (Priority: P1)

As a Worker, I want to create a new service offering inside my unified dashboard so that customers can eventually hire me for that specific skill.

**Why this priority**: Without services, the marketplace has no products to match or book against.

**Independent Test**: Can be fully tested by submitting the service creation form and verifying insertion in the `worker_services` database via the UI.

**Acceptance Scenarios**:

1. **Given** a validated worker session accessing the dashboard, **When** they fill out a valid title, description, price, and category, then hit submit, **Then** the service persists and appears in their dashboard summary.
2. **Given** the service form, **When** they omit the required Category or Title, **Then** client-side Zod validation prevents submission and highlights errors.

---

### User Story 2 - Managing and Disabling Services (Priority: P1)

As a Worker, I want to view my active offerings on the dashboard and toggle their active state or edit their pricing.

**Why this priority**: Workers need inventory control based on their immediate capacity or changing rates.

**Acceptance Scenarios**:

1. **Given** a previously created service, **When** the worker toggles "Inactive", **Then** the system immediately updates the `is_active` flag to false.

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide a dedicated "Services" management tab/section inside the unified `(protected)/dashboard` structure. No `/worker` route branches shall be created.
- **FR-002**: System MUST validate all submitted service parameters natively against a unified Zod schema.
- **FR-003**: System MUST execute the safe update/insertion natively via Server Actions (e.g. `upsertWorkerService`).
- **FR-004**: System MUST render loading states during network execution and toast/error indicators for success and failure cleanly.

### Key Entities

- **`worker_services`**:
  - `id` (uuid)
  - `worker_id` (uuid -> worker_profiles.id)
  - `category_id` (uuid -> service_categories.id)
  - `title` (text)
  - `description` (text)
  - `base_price` (numeric, nullable)
  - `is_negotiable` (boolean)
  - `is_active` (boolean)

## Dashboard Placement & Structure Expectations

- **Placement**: Integrated seamlessly into the unified `/dashboard`.
- **Structure**: A sub-view component or tab exclusively visible to accounts acting in the "Worker Portal" context. Must display as a structured list/grid of service cards, featuring primary actions: "Add New Service" and "Edit" on individual cards.

## UX Expectations, Loading, and Validation

- **Validation**: Strict client-side validation enforced before network requests.
- **Loading**: Use React `useTransition` rendering disabled `<Button disabled/>` paired with local spinner feedback on submissions.
- **Errors**: Return standardized error hashes from Server Actions caught natively and displayed visually adjacent to the trigger points natively.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Worker accounts can create and retrieve multiple service payloads concurrently in the unified dashboard natively.
- **SC-002**: Component rendering accurately reflects mutated active/inactive logic post-action uniformly across the dashboard list boundaries.

## Edge Cases and Risks

### Edge Cases

- **Missing Active Categories**: What happens if the overarching Service Category is disabled at the root database level by an Admin later?
  _Handling: Active worker services should cascade visually or filter out gracefully without database crashes if the parent drops offline._
- **Zero-Value Pricing**: What happens if `base_price` is omitted and `is_negotiable is false`?
  _Handling: Zod validation explicitly blocks this matrix._

### Definition of Done

- Database access layer logic implemented.
- Validation schemas implemented safely.
- Dashboard UI listing completed for worker context.
- Creation/Editing forms integrated over Server Actions.
- Acceptance tests written and passing for UI constraints (vitest).
- All work committed iteratively to `0110-worker-services`.
