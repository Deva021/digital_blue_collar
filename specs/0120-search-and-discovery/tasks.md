# Tasks: Search and Discovery

**Input**: Design documents from `/specs/0120-search-and-discovery/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for Search and Discovery

- [ ] T001 Create `src/lib/services/search.ts` to house worker and job search functions
- [ ] T002 Extract generic search utility types/interfaces to a shared location if needed (e.g., `src/lib/types/search.ts` or within `search.ts`)
- [ ] T003 Set up dependencies for URL query parameter syncing (`nuqs` or standard hooks)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T004 Implement `getPublicWorkers(filters)` data access function in `src/lib/services/search.ts` using Supabase ILIKE and category filtering
- [ ] T005 Implement `searchJobs(filters)` data access function in `src/lib/services/search.ts`
- [ ] T006 [P] Build structural layout components for search: `<FilterSidebar>` (placeholder) in `src/components/search/SearchFilters.tsx`
- [ ] T007 [P] Build shared pagination component `<SearchPagination>` in `src/components/search/SearchPagination.tsx`

**Checkpoint**: Core data access and base UI wrappers exist.

---

## Phase 3: User Story 1 - Public Worker Search (Priority: P1) 🎯 MVP

**Goal**: As a public visitor, I want to search for workers by category, location, and keywords, so that I can find suitable professionals without needing an account.

### Implementation for User Story 1

- [ ] T008 [US1] Build `src/app/(public)/workers/page.tsx` integrating `getPublicWorkers`
- [ ] T009 [US1] Create `<WorkerList>` component in `src/components/search/WorkerList.tsx` for displaying worker results
- [ ] T010 [P] [US1] Update `src/components/shared/nav/Navbar.tsx` to include "Find Workers" linking to `/workers`
- [ ] T011 [US1] Connect URL query parameters in `workers/page.tsx` to the `getPublicWorkers` fetching logic
- [ ] T012 [P] [US1] Add a clear Empty State (reusing system `<EmptyState>`) when no workers are found
- [ ] T013 [P] [US1] Add Loading skeleton component for `workers/page.tsx` (`src/app/(public)/workers/loading.tsx`)

**Checkpoint**: Basic public worker search is functional and accessible via navbar.

---

## Phase 4: User Story 2 - Public Job Search (Priority: P1)

**Goal**: As a public worker, I want to search for available jobs by category, location, and keywords, so that I can find work opportunities before or after logging in.

### Implementation for User Story 2

- [ ] T014 [US2] Build `src/app/(public)/jobs/page.tsx` integrating `searchJobs`
- [ ] T015 [US2] Create `<JobList>` component in `src/components/search/JobList.tsx` for displaying job results
- [ ] T016 [P] [US2] Update `src/components/shared/nav/Navbar.tsx` to include "Find Jobs" linking to `/jobs`
- [ ] T017 [US2] Connect URL query parameters in `jobs/page.tsx` to the `searchJobs` fetching logic
- [ ] T018 [P] [US2] Add a clear Empty State (reusing system `<EmptyState>`) when no jobs are found
- [ ] T019 [P] [US2] Add Loading skeleton component for `jobs/page.tsx` (`src/app/(public)/jobs/loading.tsx`)

**Checkpoint**: Basic public job search is functional and accessible via navbar.

---

## Phase 5: User Story 4 - Filtering and Sorting UX (Priority: P2)

**Goal**: As a user searching for entities, I want an intuitive filter interface with basic sorting options so that I can quickly narrow down large lists.

### Implementation for User Story 4

- [ ] T020 [US4] Implement Keyword Search input within `src/components/search/SearchFilters.tsx` syncing to `q` query param
- [ ] T021 [US4] Implement Category Filter select using Phase 10 categories in `src/components/search/SearchFilters.tsx` syncing to `category` query param
- [ ] T022 [P] [US4] Implement Location Filter text input tying to `location` query param
- [ ] T023 [P] [US4] Implement Availability Filter checkbox tying to `available` query param
- [ ] T024 [US4] Integrate `<SearchFilters>` into `workers/page.tsx`, ensuring UI updates fetch via query params
- [ ] T025 [US4] Integrate `<SearchFilters>` into `jobs/page.tsx`, ensuring UI updates fetch via query params
- [ ] T026 [P] [US4] Add sorting `<select>` component (e.g., "Newest", "Oldest") to `workers/page.tsx` and `jobs/page.tsx`
- [ ] T027 [US4] Implement mobile-responsive logic transforming `<FilterSidebar>` into a mobile modal or drawer

**Checkpoint**: Filtering and sorting fully operational across both public search pages, working seamlessly on mobile.

---

## Phase 6: User Story 3 - Dashboard Discovery Enhancements (Priority: P2)

**Goal**: As an authenticated user, I want to discover workers and jobs from my dashboard with persistent preferences and easy access, so that discovery flows seamlessly into booking or applications.

### Implementation for User Story 3

- [ ] T028 [US3] Build `src/app/(protected)/dashboard/discover/page.tsx` unifying worker and job search
- [ ] T029 [US3] Add a toggle or tab system in `discover/page.tsx` to switch between "Find Workers" and "Find Jobs"
- [ ] T030 [US3] Integrate `<SearchFilters>`, `<WorkerList>`, and `<JobList>` into the unified dashboard container
- [ ] T031 [P] [US3] Update `src/components/shared/nav/DashboardNav.tsx` to link to `/dashboard/discover`

**Checkpoint**: Authenticated users can search seamlessly within the dashboard layout.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T032 [P] Evaluate and implement custom React `<ErrorBoundary>` in `src/app/(public)/workers/error.tsx` and `src/app/(public)/jobs/error.tsx`
- [ ] T033 Validate pagination functions properly on all search lists (updating `page` query param)
- [ ] T034 Ensure deep-linking works (copying a filtered URL and pasting it in a new tab preserves the filter state)
