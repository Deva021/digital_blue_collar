# Tasks - Phase 10: Categories System

**Input**: Specs and plans isolated in `specs/0100-categories-system/`
**Goal**: Build a functional subset mapping hierarchy structure matching taxonomy databases independently of Job logics.

## Phase 1: Database Logic & Data Access

**Focus**: Reliable Read/Write layers bridging Supabase schema constraints.

- [ ] T001 Create `src/lib/services/categories.ts` utility specifically fetching active `service_categories` formatted relationally grouping parent/children.
- [ ] T002 Establish `workerCategoriesSchema` safely defining UUID multi-payload validation natively in `src/lib/validations/category.ts`.
- [ ] T003 Implement `upsertWorkerCategories` natively inside `src/app/worker/category-actions.ts` orchestrating safe row-override execution patterns across `worker_categories`.

## Phase 2: Category Frontend Components

**Focus**: Expose classification markers efficiently using uniform visual badges preventing layout shifting.

- [ ] T004 Create `<CategoryBadge/>` in `src/components/shared/category-badge.tsx` uniformly styled formatting generic service tags.
- [ ] T005 [P] Expose `<WorkerCategoryForm/>` securely in `src/components/worker/worker-category-form.tsx`.
- [ ] T006 Wire the form utilizing React inputs natively structured to visually nest multi-selectable active service disciplines preventing inaccessible `is_active=false` categories entirely.

## Phase 3: Routing Execution & Discovery

**Focus**: Wiring categorical views correctly across targeted entry-points.

- [ ] T007 Connect `WorkerCategoryForm` adjacent onto the configurations route natively within `src/app/(protected)/worker/settings/profile/page.tsx`.
- [ ] T008 Fetch and present currently saved subsets mapping native `worker_categories` via mapping logic to `<CategoryBadge/>` components on `src/app/(protected)/worker/dashboard/page.tsx`.
- [ ] T009 Implement a public browsing boundary directly exploring categories linearly inside `src/app/categories/page.tsx`.
- [ ] T010 Introduce search/filter rudimentary input UI inside the Categories public directory to dynamically pare down categories locally.

## Phase 4: Validation & Quality Assurance

- [ ] T011 Create `tests/unit/validations/category.test.ts` to statically reject incompatible arrays structurally submitted through form intercepts.
- [ ] T012 Manual verification dynamically disabling active seeds manually in SQL testing Form rendering states cleanly exclude them seamlessly.
