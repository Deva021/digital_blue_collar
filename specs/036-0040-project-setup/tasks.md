# Tasks: Phase 4 — Project Setup and Technical Foundation

**Input**: Design documents from `/specs/036-0040-project-setup/`
**Prerequisites**: `spec.md`, `plan.md`

## Phase 1: Environment & Tooling Baseline

**Purpose**: Establish build-time validations, path aliases constraints, and configuration parsing.

- [x] T001 Implement environment variable parser (`src/lib/env.ts` or `env.mjs`)
  - **Done when**: File validates `process.env` keys matching Phase 3.5's `.env` expectations (Supabase URLs, service keys).
- [x] T002 Integrate env validation into Next.js config
  - **Done when**: `next.config.ts` imports the validator to enforce fail-fast behavior on `npm run build` bridging to CI boundaries.
- [x] T003 Verify and enforce Path Aliases
  - **Done when**: `tsconfig.json` mappings are confirmed to cleanly route `@/*` to `src/*` ensuring scalable imports.

---

## Phase 2: App Router Layout Strategy

**Purpose**: Create the structural Next.js shells differentiating public and authenticated zones.

- [x] T004 Define baseline Root Layout (`src/app/layout.tsx`)
  - **Done when**: Generic HTML shell, fundamental SEO metadata, global fonts, and baseline structure are standardized.
- [x] T005 [P] Scaffold `(public)` Route Group Boundary
  - **Done when**: `src/app/(public)/layout.tsx` is created to contain marketing/public landing structures.
- [x] T006 [P] Scaffold `(auth)` Route Group Boundary
  - **Done when**: `src/app/(auth)/layout.tsx` is created strictly containing future login/signup flows.
- [x] T007 [P] Scaffold `(dashboard)` Route Group Boundary
  - **Done when**: `src/app/(dashboard)/layout.tsx` is created containing the authenticated app shell placeholder.
- [x] T008 [P] Add root `error.tsx` and `loading.tsx`
  - **Done when**: Minimum Viable error catching UI and suspension loading UIs are active in `src/app/`.

---

## Phase 3: Component & Helper Integration

**Purpose**: Establish the standardized directories for UI, domain features, and shared utilities per the plan.

- [x] T009 Scaffold Component Directory Schema
  - **Done when**: `src/components/ui/`, `src/components/layouts/`, and `src/components/features/` exist and are strictly decoupled.
- [x] T010 Setup Shared Server vs Client Utilities
  - **Done when**: `src/lib/utils/` and Supabase server/browser abstraction folders/files are cleanly staged without logic pollution.
- [x] T011 Consolidate existing generic layouts or page elements
  - **Done when**: Default Next.js boilerplate UI elements not needed for MVP are cleanly removed from `src/app/page.tsx` replacing it with a minimal placeholder.

---

## Phase 4: Validation & Verification

**Purpose**: Prove the foundation is technically sound without logic debt.

- [x] T012 Run global linting
  - **Done when**: `npm run lint` yields 0 warnings or errors indicating strict TypeScript compliance.
- [x] T013 Run production compilation check
  - **Done when**: `npm run build` correctly enforces type checking, environment verification, and statically renders layouts within target time limits.

---

## Dependencies & Execution Order

1. **Tooling (Phase 1)**: Must be executed first since build validation touches config roots.
2. **Layouts (Phase 2)**: Resolves the Next.js standard paths cleanly.
3. **Components & Helpers (Phase 3)**: Independent, but conceptually relies on understanding layouts.
4. **Validation (Phase 4)**: The final seal of baseline execution.

---

## Notes

- **Naming Conventions**: Keep folders lowercase and dash-separated (kebab-case).
- **Server Components**: All Next.js standard pages/layouts are React Server Components by default unless explicitly decorated. Avoid `"use client"` at the layout roots.
