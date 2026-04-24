# Implementation Plan: Phase 11 — Worker Services

**Branch**: `0110-worker-services` | **Date**: 2026-04-25 | **Spec**: [spec.md](./spec.md)

## Summary

Implement the ability for authenticated workers to create, edit, list, and toggle the active state of their specific service offerings directly within the unified `/dashboard`. This phase sets up the core inventory layer (connecting workers mapped to categories with specific priced offerings) without introducing any booking or discovery logic.

## Technical Context

- **Framework**: Next.js App Router (TypeScript)
- **Storage**: Supabase (PostgreSQL)
- **State/Mutations**: React Hook Form, Server Actions
- **Validation**: Zod (client & server boundaries)

## Constitution Check

- **Clarity over Cleverness**: Flat, readable React components and Zod schemas.
- **Authorization by Default**: Supabase RLS on `worker_services` combined with strict `.auth.getUser()` guards inside all Server Actions.
- **Unified Dashboard Rules**: Strictly adhering to `/dashboard/*` routes. ZERO `/worker/*` routes introduced natively.

## Implementation Details

### 1. Dashboard Route Structure

All service management operations live cleanly under the unified dashboard path:

- **List View**: `src/app/(protected)/dashboard/services/page.tsx`
- **Creation View**: `src/app/(protected)/dashboard/services/new/page.tsx`
- **Edit View**: `src/app/(protected)/dashboard/services/[id]/page.tsx`

_Note: Navigation to these routes will be mapped directly into the primary `/dashboard` visual hierarchy._

### 2. File & Folder Impact

```text
src/
├── app/(protected)/dashboard/services/
│   ├── page.tsx                           # Service listing view
│   ├── actions.ts                         # Server actions for mutations
│   ├── new/
│   │   └── page.tsx                       # Creation view
│   └── [id]/
│       └── page.tsx                       # Edit view
├── components/worker/
│   ├── worker-service-form.tsx            # Unified form component for create/edit
│   └── worker-service-card.tsx            # Display card for list view
├── lib/validations/
│   └── worker-service.ts                  # Zod schema defining creation payload
└── lib/services/
    └── worker-services.ts                 # Supabase query helpers
```

### 3. Data Access Strategy

- **Queries (`src/lib/services/worker-services.ts`)**:
  - `getWorkerServices()`: fetches services matching `auth.uid()`, performing an inner join with `service_categories` to extract the human-readable category name.
  - `getWorkerServiceById(id)`: specific fetch ensuring the requesting `auth.uid()` owns the service before returning edit-state data.
- **Mutations (`src/app/(protected)/dashboard/services/actions.ts`)**:
  - `upsertWorkerService(formData)`: Validates payload with Zod. Performs an INSERT if no ID is present, or an UPDATE `eq('id', id).eq('worker_id', user.id)` if it exists.
  - `toggleServiceStatus(id, isActive)`: Lightweight toggle logic targeting only the `is_active` boolean.

### 4. Form/State Handling & Validation Approach

- **Validation Base**: Strict Zod schema (`workerServiceSchema`) matching `title`, `description`, `category_id` (UUID), `base_price` (number/null), `is_negotiable` (boolean), and `is_active` (boolean).
- **Pricing Logic**: A conditional refinement layer explicitly blocks submissions where `is_negotiable === false` and `base_price` is missing or below 0.
- **Form Component**: Client-side `<form>` managed by `react-hook-form` + `@hookform/resolvers/zod`.
- **Loading & Errors**: Submit hooks tied to `useTransition`. Server Actions return a discriminated union (`{ error: string } | { success: true }`). Form renders field-specific error messages directly beneath the inputs, and global errors (e.g. database disconnects) block above the submit button.

### 5. Category Linkage Handling

- The new Service creation form will execute `getActiveCategories()` mapping from Phase 10.
- Users will select exactly one category `category_id` from a flattened `<Select>` UI dropdown.
- Relying on the DB's foreign key constraint to ensure they cannot submit phantom UUIDs.

### 6. Service State Handling (Active/Inactive)

- Listed services on the dashboard grid will visually dim or flag "Inactive" components clearly.
- A toggle switch directly on the `worker-service-card.tsx` allows instant disabling without forcing the user to load the full `/edit` form.

## Verification Strategy

### Automated Tests

- Create `tests/unit/validations/worker-service.test.ts` focusing primarily on the complex pricing edge matrices safely validating.

### Manual Verification

1. Open dev server and log in.
2. Navigate to `/dashboard/services`.
3. Create a service. Test omission of price while strictly required. Submit.
4. Correct the payload, observe successful redirection to `/dashboard/services`.
5. Observe the service listed with category labels fetched accurately.
6. Toggle the active state. Refresh page, ensure persistence.

## Assumptions, Risks, and Mitigations

| Risk / Assumption                                         | Mitigation                                                                                                                                       |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Assumption**: RLS for `worker_services` is operational. | Confirm policies via DB queries manually during implementation phase.                                                                            |
| **Risk**: Creating duplicate identical services.          | DB doesn't inherently reject this, but simple MVP assumption allows duplicates without custom DB constraints initially.                          |
| **Risk**: Linked category drops inactive.                 | The SQL inner join must use a `LEFT JOIN` or tolerate inactive lookups for read operations so the card doesn't vanish entirely on the dashboard. |
