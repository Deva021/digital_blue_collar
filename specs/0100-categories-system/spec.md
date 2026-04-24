# Feature Specification: Phase 10 — Categories System

**Feature Branch**: `091-phase-10-categories-system`  
**Created**: 2026-04-24  
**Status**: Ready for Planning  
**Input**: Define the core taxonomy foundation enabling workers to select specializations driving search, filtering, and classification without breaching into job booking mechanisms directly.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Worker Category Selection (Priority: P1)

As an active worker, I want to assign myself to specific platform categories (e.g., 'Home Services' > 'House Cleaning', or 'Agriculture' > 'Plowing') so that customers can discover my generalized skills during search.

**Why this priority**: Without being tagged to an active category, a worker’s profile exists generically but completely detached from market discovery and matching logic.

**Independent Test**: Can be independently verified by accessing the Worker Profile editing suite and assigning one or more multi-faceted categories successfully, verifying insertion into `worker_categories`.

**Acceptance Scenarios**:

1. **Given** a worker navigating their profile settings, **When** they interact with the category picker, **Then** they can see active root categories and specific active sub-categories.
2. **Given** a worker saving their choices, **When** the form submits, **Then** the multi-category selections are persisted to the database relationally, overriding previously saved ones if updated.

---

### User Story 2 - Customer Category Exploration (Priority: P2)

As a customer or guest entering the application, I want to explore the service taxonomy and see worker listings broken down by categorical disciplines so I know what the platform offers.

**Why this priority**: Core marketplace architecture requires demand-side filtering mechanisms. Constructing the foundational Read logic ensures the entire matching foundation is solid before implementing jobs.

**Independent Test**: Can be completely isolated by navigating to `/categories` or filtering `/workers` by category ID and verifying the underlying database responds correctly with subset queries.

**Acceptance Scenarios**:

1. **Given** a customer viewing a category page, **When** they select "Home Services", **Then** the resulting UI displays its specific subcategories and general worker aggregates mapping to it.

---

### User Story 3 - Inactive Category Obfuscation (Edge Case / P2)

As a platform administrator, if I deactivate a category, I need the system to stop presenting it to workers as a selectable option but keep historical worker bindings intact to prevent crashing old profiles.

**Acceptance Scenarios**:

1. **Given** a category marked `is_active = false`, **When** a worker attempts to update their profile configurations, **Then** the disabled category is not visible nor selectable in the picker array.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST support hierarchical categorizations (Parent -> Child). Usually limited functionally to Root (Tier 1) and Sub-category (Tier 2).
- **FR-002**: System MUST allow workers to select _multiple_ valid categories assigning to `worker_categories`.
- **FR-003**: System MUST provide frontend UX for discovering classifications properly (cascading menus, categorized grid overviews).
- **FR-004**: System MUST strictly observe the `is_active` flag within presentation hooks (excluding inactive objects from being listed as new assignments).
- **FR-005**: Displayed worker arrays MUST correctly join and aggregate their selected capabilities derived from `worker_categories`.

### Key Entities

- **`service_categories`**: Defines taxonomy logic (id, name, parent_id, is_active).
- **`worker_categories`**: Bridging junction between UUID `worker_id` and UUID `category_id`. Supports many-to-many.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: New workers can accurately map themselves against the domain logic created previously in the `seed.sql`.
- **SC-002**: Categorical intersections execute properly preventing detached/orphan workers in the core search loops.
- **SC-003**: Empty State behaviors trigger functionally for valid categories experiencing zero active worker mappings.

## Risks & Assumptions

### Scope Assumptions

- No Admin UI for Category Management: Modifications to `service_categories` continue dynamically via database migration or raw SQL seeds pending a dedicated Administrative Phase. The UX acts uniquely as a `READ-ONLY` viewer on the taxonomy.
- Notification structures ("Email matching workers") are strictly out of scope but architecturally considered (e.g. querying `worker_categories` allows matching a future job target).

### Definition of Done

The phase concludes successfully solely when Workers can assign themselves multi-categories accurately within their UI profile settings AND generic users can utilize a frontend route or filter interface displaying category trees querying the `supabase` API correctly.
