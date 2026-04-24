# Implementation Plan - Phase 10: Categories System

Based on `specs/0100-categories-system/spec.md`, this plan details the technical execution boundaries for mapping hierarchical service classifications functionally into the `worker_profiles`.

## 1. Goal Description

Establish the functional taxonomy mappings. The system will expose the database-seeded `service_categories` functionally to the presentation layer honoring `is_active` constraints. Workers will utilize a client-side selection UI mapped strictly via React hook forms, delegating validation to Zod, resolving directly into the `worker_categories` table via an explicit Server Action bridging mechanism.

## 2. Proposed Changes

### Data Access & Supabase Boundaries

- **Category Data Access**: A shared server utility `getCategories()` will extract records from `service_categories` where `is_active = true`. A subsequent transformation maps standard linear outputs into a parent/child relational nested array reducing frontend execution costs.
- **Worker Assignment Updates**: Replacing `worker_categories` will utilize a transaction-like pattern (delete all prior references for `worker_id`, insert all new array IDs) ensuring multi-select overrides naturally without index collision conflicts.

### Components & Forms

#### [NEW] [src/components/worker/worker-category-form.tsx](src/components/worker/worker-category-form.tsx)

- **Role**: Client component responsible for multi-category selections.
- **Behavior**: Retrieves pre-hydrated `initialSelectedCategoryIds`. Renders active parent clusters, optionally hiding/disabling child dependencies unless structural contexts map successfully.

#### [NEW] [src/lib/validations/category.ts](src/lib/validations/category.ts)

- **Role**: Validates categorical mapping submissions.
- **Rules**: Validates payload shape asserting an array of `uuid` strings mapping to standard categories.

### Server Actions

#### [NEW] [src/app/worker/category-actions.ts](src/app/worker/category-actions.ts)

- **Role**: Handles specific multi-select persistence natively bound to `worker_categories`.
- **Logic**: Resolves auth session, deletes stale bindings where `worker_id = user.id`, generates payload iterations over `zod` results mapping new inserts, and executes Supabase insertion array. Yields `revalidatePath`.

### Route & Visual Implementations

#### [MODIFY] [src/app/(protected)/worker/settings/profile/page.tsx](<src/app/(protected)/worker/settings/profile/page.tsx>)

- **Role**: Integrating the generic Settings page.
- **Updates**: Injects `<WorkerCategoryForm/>` alongside the existing `WorkerProfileForm` conceptually separating baseline identity concerns from marketplace offering specializations.

#### [NEW] [src/app/categories/page.tsx](src/app/categories/page.tsx)

- **Role**: Public-facing taxonomy explorer (P2 Spec requirement).
- **Functionality**: Reads exclusively from `service_categories` mapping out the entire active logical tree so customers verify marketplace service contexts locally.

#### [NEW] [src/components/shared/category-badge.tsx](src/components/shared/category-badge.tsx)

- **Role**: Small stylistic layout component mapping isolated ID context to generic visual boundaries.

## 3. Verification Plan

### Automated Tests

- Unit suite `tests/unit/validations/category.test.ts` to block structurally mismatched UUID arrays formatting into the `.upsert` handler APIs.

### Manual Verification

1. Access worker profile settings and select multiple mixed categories securely. Save securely and refresh verifying state permanence.
2. Visit public `/categories` route and enforce disabled items (where `is_active = false`) are explicitly obscured.
3. Remove a categorization from the worker subset ensuring old junction definitions detach predictably.

## 4. Risks and Assumptions

- **Assumption**: A complete replacement technique on `worker_categories` (Delete existing -> Insert new array payload) avoids complexity compared to explicit diff computations and solves index-unique collision naturally.
- **Risk**: Overwhelming lists crashing simple `<Select/>` elements. **Mitigation**: Categories are implemented natively utilizing checkboxes matching typical tree structures explicitly honoring parent nodes recursively.
- **Constraint Compliance**: Filtering capabilities (Search interactions mapping jobs) will be organically supported via PostgreSQL junction queries without injecting dedicated Elasticsearch/Vector search layers matching simplicity guidelines.
