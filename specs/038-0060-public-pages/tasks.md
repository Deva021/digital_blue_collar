# Tasks: Phase 6 — Public Pages

**Input**: Design documents from `/specs/038-0060-public-pages/`  
**Prerequisites**: `spec.md`, `plan.md`

## Phase 1: Global Navigation and Layout Shell

**Purpose**: Construct the global wrapper so all pages inherit a unified header and footer consistently.

- [x] T001 Implement Public Header / Navbar
  - **Files touched**: `src/components/layouts/public-header.tsx`
  - **Done when**: Header component exists with desktop links and a mobile hamburger menu targeting existing standard route segments.
- [x] T002 Implement Public Footer
  - **Files touched**: `src/components/layouts/public-footer.tsx`
  - **Done when**: Standard multi-column link map exists including legal and secondary page links.
- [x] T003 Bind Layout Consistency
  - **Files touched**: `src/app/(public)/layout.tsx`
  - **Done when**: The `(public)` layout integrates the newly created Header and Footer encapsulating the `{children}`.

---

## Phase 2: Static Informational Pages

**Purpose**: Structure the native content marketing pathways explaining the platform.

- [x] T004 [P] Scaffold Home Page
  - **Files touched**: `src/app/(public)/page.tsx`
  - **Done when**: Hero section, key value-props, and CTAs utilizing Phase 5 `Button` and `Container` components exist.
- [x] T005 [P] Scaffold About Page
  - **Files touched**: `src/app/(public)/about/page.tsx`
  - **Done when**: A clean, readable text-block page is deployed summarizing the mission.
- [x] T006 [P] Scaffold How It Works Page
  - **Files touched**: `src/app/(public)/how-it-works/page.tsx`
  - **Done when**: Step-by-step visual placeholder flow is built relying on Phase 5 icons/spacing.
- [x] T007 [P] Scaffold FAQ & Contact Placeholders
  - **Files touched**: `src/app/(public)/faq/page.tsx`, `src/app/(public)/contact/page.tsx`
  - **Done when**: Standard textual empty-states or placeholder text map correctly into standard containers.

---

## Phase 3: Directory Listing Pages (Mocked)

**Purpose**: Create the heavily structured grids predicting future database responses using dummy data.

- [x] T008 [P] Implement Categories Listing Page
  - **Files touched**: `src/app/(public)/categories/page.tsx`
  - **Done when**: Standard generic category blocks (Agriculture, Construction, Home Services) map natively into clickable Phase 5 cards.
- [x] T009 [P] Implement Workers Listing Page
  - **Files touched**: `src/app/(public)/workers/page.tsx`
  - **Done when**: A static `MOCK_WORKERS` array correctly loops inside the DOM, mapping parameters (Name, Trade, Rating) into generic UI components.
- [x] T010 [P] Implement Jobs Listing Page
  - **Files touched**: `src/app/(public)/jobs/page.tsx`
  - **Done when**: A static `MOCK_JOBS` array populates a feed layout mimicking expected future job discovery feeds.

---

## Phase 4: Verification and UX Pass

**Purpose**: Validate responsive integrity and seamless transition boundaries.

- [x] T011 Verify Contextual UX Spacing
  - **Files touched**: N/A (Manual visual check)
  - **Done when**: All margins/paddings align to the agreed `Container` structure across the built static paths.
- [x] T012 Validate Navigation and Mobile Responsiveness
  - **Files touched**: N/A
  - **Done when**: `npm run build` succeeds, all menu linkages route properly, and no page breaks horizontal boundaries on a 320px viewport simulated check.

---

## Dependencies & Execution Order

1. **Global Shell (Phase 1)**: Must be completed sequentially first so all subsequent pages have standard DOM parents.
2. **Phase 2 & Phase 3**: Can be tackled fully in parallel (`[P]`).
3. **Verification (Phase 4)**: Must conclude the Phase 6 workflow to guarantee UI standard cohesion prior to back-end logic integrations later.
