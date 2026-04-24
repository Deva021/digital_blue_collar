# Tasks: Phase 11 — Worker Services

**Branch**: `0110-worker-services` | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Phase 1: Data Access & Validation

- [ ] **T001**: Create `src/lib/services/worker-services.ts` and implement `getWorkerServices()` (fetching services joined with categories for `auth.uid()`) and `getWorkerServiceById(id)`.
- [ ] **T002**: Create `src/lib/validations/worker-service.ts` defining `workerServiceSchema` enforcing title, description, UUID category, and nullable/required base_price dependent on the `is_negotiable` boolean.
- [ ] **T003**: Create base Server Actions in `src/app/(protected)/dashboard/services/actions.ts` specifically implementing `upsertWorkerService(formData)` protecting writes via `auth.uid()`.
- [ ] **T004** [P]: Implement `toggleServiceStatus(id, isActive)` inside `actions.ts` solely responsible for updating the `is_active` parameter.

## Phase 2: User Interface Components

- [ ] **T005**: Create `src/components/worker/worker-service-form.tsx` establishing the `<form>` wrapping inputs for Title and Description driven by `react-hook-form`.
- [ ] **T006**: Add Category selection to `worker-service-form.tsx` by querying `getActiveCategories()` natively and mapping to a dropdown/radio list.
- [ ] **T007**: Add Pricing parameters to `worker-service-form.tsx`, ensuring `base_price` dynamically adjusts required-status based on the `is_negotiable` toggle.
- [ ] **T008**: Implement loading/disabling states tied to `useTransition` and field-level error messages directly inside `<WorkerServiceForm/>`.
- [ ] **T009** [P]: Create `src/components/worker/worker-service-card.tsx` to handle standard visual presentation of a single service row block on lists.
- [ ] **T010**: Wire the Active/Inactive toggle switch directly into the `<WorkerServiceCard/>` calling the `toggleServiceStatus()` Server Action cleanly.

## Phase 3: Dashboard Route Execution

- [ ] **T011**: Create index `src/app/(protected)/dashboard/services/page.tsx` retrieving active arrays via `getWorkerServices()` and mapping them heavily through `<WorkerServiceCard/>`.
- [ ] **T012**: Create `src/app/(protected)/dashboard/services/new/page.tsx` serving as the host entry wrapper rendering an empty `<WorkerServiceForm/>`.
- [ ] **T013**: Create `src/app/(protected)/dashboard/services/[id]/page.tsx` fetching native `getWorkerServiceById(id)` to pre-populate an edit-focused `<WorkerServiceForm/>`.
- [ ] **T014**: Enhance unified system navigation sidebars (e.g. `(protected)/worker/layout.tsx` or matching unifying wrapper) ensuring visually accessible `<Link href="/dashboard/services">` exists pointing directly into the service management portal.

## Phase 4: Validation & Quality Assurance

- [ ] **T015**: Create structural unit test `tests/unit/validations/worker-service.test.ts` rejecting payload boundaries deliberately (missing price while non-negotiable).
- [ ] **T016**: Manual QA — verify service form creations securely persist arrays rendering back uniformly onto the UI components properly tracking Category UUID dependencies.
- [ ] **T017**: Manual QA — test the active/inactive togglers confirming visually dimmed unbookable states persist across manual URL reloads securely.
