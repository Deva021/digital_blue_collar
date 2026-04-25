# Feature Specification: Phase 12 — Search and Discovery

**Feature Branch**: `120-working-phase-12`  
**Created**: 2026-04-25  
**Status**: Draft  
**Input**: User description: We are working on Phase 12 — Search and Discovery.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Public Worker Search (Priority: P1)

As a public visitor, I want to search for workers by category, location, and keywords, so that I can find suitable professionals without needing an account.

**Why this priority**: Core value proposition of the marketplace. Discovery must be seamless for unauthenticated users to drive engagement and acquisition.

**Independent Test**: Can be fully tested by navigating to `/workers`, selecting a category and typing a location, and observing relevant worker lists without being logged in.

**Acceptance Scenarios**:

1. **Given** I am an unauthenticated user on the `/workers` page, **When** I leave all filters empty, **Then** I see the default list of workers and pagination/infinite scroll options.
2. **Given** I am on the `/workers` page, **When** I select "Plumbing" category and enter "Addis Ababa" in location, **Then** I only see plumbers with "Addis Ababa" in their profile location.

---

### User Story 2 - Public Job Search (Priority: P1)

As a public worker, I want to search for available jobs by category, location, and keywords, so that I can find work opportunities before or after logging in.

**Why this priority**: Essential for worker acquisition and marketplace liquidity.

**Independent Test**: Can be fully tested by navigating to `/jobs` and using filters to find sample job postings, returning relevant results.

**Acceptance Scenarios**:

1. **Given** I am on the `/jobs` page, **When** I search using keywords "paint" and category "Painting", **Then** I see active jobs related to painting.
2. **Given** no jobs match my filter criteria, **When** I apply the filters, **Then** I see a clear empty state with suggestions to clear filters.

---

### User Story 3 - Dashboard Discovery Enhancements (Priority: P2)

As an authenticated user, I want to discover workers and jobs from my dashboard with persistent preferences and easy access, so that discovery flows seamlessly into booking or applications.

**Why this priority**: Central to the logged-in user experience (Phase 11-23 Unified Dashboard) without creating legacy routes.

**Independent Test**: Can be tested by logging in as a customer, navigating to `/dashboard/discover`, and viewing personalized or localized suggestions (based on profile location).

**Acceptance Scenarios**:

1. **Given** I am a logged-in customer, **When** I navigate to `/dashboard/discover`, **Then** I can use the same search capabilities as public pages but contained within the authenticated layout.
2. **Given** I am logged in, **When** I view search results, **Then** the UI may present direct "Book" or "Apply" buttons seamlessly depending on my role.

---

### User Story 4 - Filtering and Sorting UX (Priority: P2)

As a user searching for entities, I want an intuitive filter interface with basic sorting options (e.g., newest, a-z), so that I can quickly narrow down large lists.

**Why this priority**: Usability is critical for high-volume discovery pages. Must be highly functional on mobile.

**Independent Test**: Can be tested on mobile viewport to ensure filters can be toggled without breaking layout and selections apply correctly.

**Acceptance Scenarios**:

1. **Given** I am on mobile viewing `/workers`, **When** I open filters, **Then** they appear in a mobile-optimized modal or drawer.
2. **Given** I have a list of search results, **When** I select "Sort by: Newest", **Then** the list instantly reorders without page reload.

### Edge Cases

- What happens when a user applies a location filter that yields no results but is a slight typo of an existing location? (Basic text filtering assumed, no partial match/fuzzy search might yield empty states — UI should guide to clear filters).
- How does system handle loading states during slow network searches? (Should display skeleton loaders matching result cards).
- What happens if the backend search fails or times out? (Display an error state with a retry button).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a public worker search page at `/workers`.
- **FR-002**: System MUST provide a public job search page at `/jobs`.
- **FR-003**: System MUST provide a unified dashboard discovery capability under `/dashboard/discover` for authenticated users.
- **FR-004**: System MUST NOT use or create legacy `/worker` or `/customer` routes for discovery.
- **FR-005**: System MUST allow filtering workers and jobs by categories (based on service_categories table).
- **FR-006**: System MUST allow text-based location filtering.
- **FR-007**: System MUST allow availability-based filtering (where applicable based on data model).
- **FR-008**: System MUST support keyword search against entity titles/names, and descriptions.
- **FR-009**: System MUST support basic sorting (e.g., relevance, newest, oldest).
- **FR-010**: System MUST define clear empty, loading, and error states for all discovery views.
- **FR-011**: System MUST ensure mobile UI supports smooth filter operations without overwhelming the screen.

### Key Entities

- **WorkerProfile**: The primary entity for the `/workers` search, bringing associated Category relations.
- **WorkerService**: Searchable representations of what a worker offers.
- **JobPost**: The primary entity for the `/jobs` search, representing available gigs.
- **ServiceCategory**: Enables structured classification and filtering of workers and jobs.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can successfully filter a list of 100+ entities with results updating in < 500ms.
- **SC-002**: Unauthenticated users can view complete lists of workers and jobs without authentication prompts interrupting the view.
- **SC-003**: Mobile users can activate, apply, and clear filters within an optimized responsive layout (no horizontal scrolling).
- **SC-004**: Codebase contains no new references to `/customer` or `/worker` base routes.

## Assumptions

- We are relying on simple SQL querying (e.g., ILIKE or basic full-text features within Supabase) rather than complex search engines (Elasticsearch/Algolia).
- "Availability filtering" depends primarily on simple boolean flags or enums in the respective entity profiles, not complex calendar scheduling math.
- Location filtering is simple text matching, as maps/geolocation UI is explicitly out of scope.
- We will reuse the unified dashboard sidebar/layout for `/dashboard/discover`.
