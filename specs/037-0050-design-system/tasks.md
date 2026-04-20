# Tasks: Phase 5 — Design System and UI Foundation

**Input**: Design documents from `/specs/037-0050-design-system/`  
**Prerequisites**: `spec.md`, `plan.md`

## Phase 1: Dependencies and Core Tokens

**Purpose**: Establish the utility foundation, design tokens, and testing ground.

- [x] T001 Install UI dependencies
  - **Files touched**: `package.json`
  - **Done when**: `clsx`, `tailwind-merge`, and `lucide-react` are installed.
- [x] T002 Implement style merging utility
  - **Files touched**: `src/lib/utils/cn.ts`
  - **Done when**: `cn` helper exists and handles Tailwind class conflicts properly.
- [x] T003 Configure Tailwind Design Tokens
  - **Files touched**: `src/app/globals.css`, `tailwind.config.ts`
  - **Done when**: Native CSS variables or tailwind theme configurations map the required brand/semantic colors and typography baselines.
- [x] T004 Setup Component Showcase Route
  - **Files touched**: `src/app/(public)/design/page.tsx`
  - **Done when**: A blank page mounts successfully to act as the visual playground for upcoming component tasks.

---

## Phase 2: Layout & Structural Primitives

**Purpose**: Build the structural grid and bounding components.

- [x] T005 [P] Create `Container` layout wrapper
  - **Files touched**: `src/components/layouts/container.tsx`
  - **Done when**: Container component enforces `max-w-7xl` centered limits with responsive padding.
- [x] T006 [P] Create `Card` component family
  - **Files touched**: `src/components/ui/card.tsx`
  - **Done when**: `Card`, `CardHeader`, `CardTitle`, `CardContent`, and `CardFooter` components compose into standard blocks with unified borders/radii.

---

## Phase 3: Interactive Primitives (Inputs & Buttons)

**Purpose**: Create the atomic interaction layer for data entry and actions.

- [x] T007 [P] Create `Button` component
  - **Files touched**: `src/components/ui/button.tsx`
  - **Done when**: Component supports `variant` (primary, secondary, outline, ghost) and standard responsive touch sizes, passing `...props`.
- [x] T008 [P] Create `Input` and Label components
  - **Files touched**: `src/components/ui/input.tsx`, `src/components/ui/label.tsx`
  - **Done when**: Strongly typed text inputs correctly display `focus-visible:ring` and optional `error` variant styling.
- [x] T009 [P] Create `Textarea` component
  - **Files touched**: `src/components/ui/textarea.tsx`
  - **Done when**: Multiline input behaves identically to `Input` regarding focus and error states.
- [x] T010 [P] Create `Select` / Dropdown generic wrap
  - **Files touched**: `src/components/ui/select.tsx`
  - **Done when**: Standalone native or generic dropdown handles value forwarding and error indicators identically to inputs.
- [x] T011 [P] Create `Badge` / Tag component
  - **Files touched**: `src/components/ui/badge.tsx`
  - **Done when**: Non-interactive pill displays semantic states (success, warning) for status displays.

---

## Phase 4: Feedback & Overlays

**Purpose**: Deliver standard behavior patterns for waiting, errors, menus, and no-data conditions.

- [x] T012 [P] Create `Spinner` / Loading primitive
  - **Files touched**: `src/components/ui/spinner.tsx`
  - **Done when**: Clean SVG/CSS spinner renders with optional sizing.
- [x] T013 [P] Create `EmptyState` component
  - **Files touched**: `src/components/ui/empty-state.tsx`
  - **Done when**: A centered container taking an icon, title, and optional action button handles zero-data scenarios gracefully.
- [x] T014 [P] Create `Modal` / Dialog structural component
  - **Files touched**: `src/components/ui/modal.tsx`
  - **Done when**: Accessible overlay prevents background scrolling, provides a backdrop, and handles `isOpen` lifecycle mechanically.
- [x] T015 [P] Integrate Toast / Alert feedback pattern
  - **Files touched**: `src/components/ui/toast.tsx` (or config)
  - **Done when**: A system exists to fire transient success/error messages across the app layout root.

---

## Phase 5: Verification & Documentation

**Purpose**: Prove global usage intent.

- [x] T016 Populate Showcase and Verify Responsiveness & Accessibility
  - **Files touched**: `src/app/(public)/design/page.tsx`
  - **Done when**: Every component created from T005 - T015 is rendered on the showcase page, verifying ARIA logic, focus rings, and proper mobile collapsing.
- [x] T017 Run Compilation Boundaries
  - **Files touched**: N/A
  - **Done when**: `npm run build` cleanly type-checks all components and completes.

---

## Dependencies & Execution Order

1. **Tokens (Phase 1)**: Must be executed first since `cn` and baseline colors are required immediately.
2. **Phase 2, 3, 4**: Can be executed roughly in parallel.
3. **Verification (Phase 5)**: The final step to lock in the Design System.
