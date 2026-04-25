# Implementation Plan: Search and Discovery

**Branch**: `111-working-phase-12` | **Date**: 2026-04-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/0120-search-and-discovery/spec.md`

## Summary

This phase establishes the discovery layer of the marketplace, defining how users discover workers, services, and jobs. It includes building public worker/job search pages (`/workers`, `/jobs`), a unified dashboard discovery capability (`/dashboard/discover`), and ensuring clean filtering (category, location, keyword, availability) and basic sorting without complex ranking. The focus is on a simple, mobile-friendly UX that reuses existing category foundations while strictly separating public routes from authenticated discovery enhancements.

## Technical Context

**Language/Version**: Next.js API / TypeScript
**Primary Dependencies**: React Server Components, Supabase (PostgreSQL)
**Testing**: Unit tests, integration tests via standard setup
**Project Type**: Web Application
**Performance Goals**: Fast initial load with basic text ILIKE queries on Supabase

## Implementation Strategy

### Routing Strategy

- **Public Routes**: `/workers` and `/jobs` pages using `src/app/(public)/...` for unlogged visitors.
- **Dashboard Routes**: `/dashboard/discover` in `src/app/(protected)/dashboard/...` for authenticated users.
- **Strict Rule**: No legacy `/worker` or `/customer` routes are used for discovery.

### Search Query & State Approach

- **State Management**: Search state (keywords, categories, location, sorting) will be synced with the URL query parameters to ensure shareability and proper back-navigation behavior.
- **Data Access approach**:
  - Leverage Server Components for initial data fetching.
  - Query Supabase directly using textual matches (e.g., ILIKE) for keyword/location filtering against `worker_profiles`, `worker_services`, and `job_posts`.
  - Filter using category IDs via standard relation traversals (`worker_categories`, `job_posts` categories).
  - Implement data access definitions (e.g., `getPublicWorkers(filters)`, `searchJobs(filters)`) inside `src/lib/services/search.ts` or parallel abstraction.

### Filter & Sorting UI Approach

- **UI Architecture**: Provide a unified `<FilterSidebar>` combined with a mobile-optimized modal representation to prevent horizontal scrolling.
- **Category Reuse**: Integrate with the Phase 10 categories logic residing in `src/lib/services/categories.ts`.
- **Location filtering**: Leverage uncontrolled text inputs tying directly into the location query parameters.
- **Availability filtering**: Provide boolean toggles mapped against the worker's active/available profile flags.
- **Sorting**: Select inputs syncing to a sort parameter mapped into simple database order-bys (`created_at` desc/asc).

### State Handling Options

- **Loading states**: Use React Suspense alongside tailored Skeleton components.
- **Empty states**: Rely on existing empty state displays accompanied by actionable "Clear Filters" triggers.
- **Error handling**: Return custom React `<ErrorBoundary>` boundaries to prevent full-page crashes.

### Validations

- Soft validations on query parameters (revert to defaults seamlessly instead of breaking the page on invalid states).

## File/Folder Impact

### Expected New Files

```text
src/app/(public)/workers/page.tsx
src/app/(public)/jobs/page.tsx
src/app/(protected)/dashboard/discover/page.tsx
src/components/search/SearchFilters.tsx
src/components/search/WorkerList.tsx
src/components/search/JobList.tsx
src/components/search/SearchPagination.tsx
src/lib/services/search.ts
```

### Potential Modified Files

```text
src/components/shared/nav/Navbar.tsx
src/components/shared/nav/DashboardNav.tsx
```

## Risks and Mitigations

- **Risk**: Potential database slowdowns doing broad wildcards on large sets.
  - _Mitigation_: Strictly enforce server-side pagination with defined limits.
- **Risk**: Dead ends when users filter too aggressively.
  - _Mitigation_: Clear UX markers and quick actions to remove over-constrained parameters.

## Assumptions

- Existing UI components (cards, badges, modals) created in earlier phases are sufficiently mature to be aggregated into these discovery lists.
- Database access patterns follow the established Server Actions paradigm and standard Supabase JS client integration as seen in other modules.
