# Feature Specification: Phase 6 — Public Pages

**Feature Branch**: `038-0060-public-pages`  
**Created**: 2026-04-20  
**Status**: Draft

## Purpose

The purpose of this phase is to structure the public-facing pages of the Blue Collar Marketplace. This phase provides the front-door experience for both prospective workers and customers without relying on the complexities of an active backend. It establishes the navigation architecture, defines key public views, and proves the discoverability routes using mock data as an integration scaffold.

## Scope

### In Scope

- Development of the public global navigation (Header and Footer).
- Creation of the static Home page layout (Hero section, value props, popular categories).
- Creation of the About page and How-It-Works flows.
- Implementation of mock-driven listing layouts for Categories, Workers, and Jobs to prove UI capabilities.
- Creation of basic Contact / FAQ placeholder pages.
- Enforcing full mobile responsiveness for all constructed layouts utilizing the UI Foundation primitives built in Phase 5.

### Out of Scope

- Real data fetching from Supabase (`fetch` or Server Actions bridging to the database).
- Any authentication logic (login/signup states remain visually mocked or redirect to placeholders).
- Active job application flows or booking system funnels.
- User dashboards or profile mutation pages.

## Goals

### Page Responsibilities

- **Home**: Orient the user immediately to the dual-sided nature of the marketplace (Hire someone vs. Find work).
- **About / How-It-Works**: Educate users clearly on trust, payment norms, and behavioral expectations on the platform.
- **Listings (Workers/Jobs/Categories)**: Demonstrate layout viability for dense information blocks (cards, grid structures) utilizing static JSON mocks.

### Navigation Expectations

- A sticky or prominent top navigation linking cleanly to Jobs, Workers, and Categories.
- Clear, distinct "Login" and "Sign up" calls to action.
- A comprehensive footer providing logical grouping for legal, support, and secondary pages.

### UX Goals for Public Pages

- Deliver an instant, zero-friction time-to-first-paint experience leveraging React Server Components for entirely static rendering.
- Ensure all copy and calls-to-action are distinct and readable before any user scrolling occurs (above the fold).

### Content Structure Expectations

- Use standard text blocks, removing any requirement for a CMS during this phase.
- Hardcode category structures simulating what will eventually map to the Phase 3.5 database seeds.

## User Scenarios & Testing

### User Story 1 - Prospective Customer Discovery (Priority: P1)

A visitor seeking a plumber wants to see if the platform supports their needs without signing up.
**Why this priority**: Discoverability is critical for conversion.
**Independent Test**: Can be verified by navigating from the Homepage -> Categories -> Worker Listing (mocked).
**Acceptance Scenarios**:

1. **Given** a user on the homepage, **When** they click "Categories", **Then** they see a static list of service areas.

### User Story 2 - Mobile User Exploration (Priority: P1)

A prospective worker connects via a mobile phone to see how to join.
**Why this priority**: Directly enforces the "low devices" and mobile-first constitution mandate.
**Independent Test**: Verified by simulating a 320px viewport navigation flow.
**Acceptance Scenarios**:

1. **Given** the mobile viewport, **When** clicking the hamburger menu, **Then** all public routes are accessible easily via touch targets.

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide static pages for `/`, `/about`, `/how-it-works`, `/categories`, `/workers`, and `/jobs`.
- **FR-002**: System MUST render "dummy" card grids on the listing pages matching the schema shapes defined in earlier phases.
- **FR-003**: System MUST provide a global Header navigation element accessible on all public routes.

## Success Criteria

### Measurable Outcomes

- **SC-001**: All public paths return standard HTTP 200 via `npm run build` static generation without errors.
- **SC-002**: Zero dependencies on Supabase config exist in the public page tree, meaning it safely renders without DB access.

## Risks & Open Questions

- **Risk**: Statically mocked data structures drift from the actual Supabase database shapes preventing an easy switch in later phases. _Mitigation_: Ensure mock objects map correctly to the logical hierarchy expected (e.g., Worker has Name, Rating, Category).
- **Risk**: Overcomplicating the Home page with unnecessary interactive abstractions. _Mitigation_: Stick strictly to native CSS grid and flexbox for hero architecture.

## Definition of Done

- All listed public pages (`Home`, `About`, `How-it-works`, `Categories`, `Workers`, `Jobs`, `FAQ`) are created and accessible via a global nav.
- Static mock data powers the listing layouts visually.
- Mobile behaviors are fully responsive down to 320px utilizing Phase 5 primitives cleanly.
- The specification is ready for `speckit.plan`.
