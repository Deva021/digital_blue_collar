# Implementation Plan: Phase 20 — Admin Moderation and Management

**Branch**: `191-phase-20-admin` | **Date**: 2026-05-04 | **Spec**: [spec.md](file:///home/dawa/Documents/digital-blue-collar/specs/0200-admin-moderation-and-management/spec.md)
**Input**: Feature specification from `specs/0200-admin-moderation-and-management/spec.md`

---

## Summary

Phase 19 established a read-only admin dashboard at `src/app/(admin)/admin/` with overview stats, data tables, and sidebar navigation. Phase 20 extends this foundation with **safe, non-destructive mutation actions**: category active/inactive toggling, verification request approve/reject, mandatory admin notes, and confirmation dialogs. No new database tables or columns are required — all mutations operate on existing schema. The implementation adds Server Actions for admin mutations, a reusable confirmation dialog component, and upgrades the existing categories and verifications pages from read-only to interactive.

---

## Technical Context

**Language/Version**: TypeScript 5.x / Next.js (App Router)
**Primary Dependencies**: Next.js, Supabase (`@supabase/ssr`), Tailwind CSS, Lucide React, Shadcn-style UI components
**Storage**: Supabase (PostgreSQL) — existing `service_categories`, `verification_requests`, `worker_profiles` tables
**Testing**: Manual browser verification + build validation
**Target Platform**: Web (server-rendered with client interactivity)
**Constraints**: All mutations admin-only via `requireAdmin()`, no hard deletes, no optimistic updates

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| Authorization by Default | ✅ Pass | All mutations use existing `requireAdmin()` guard |
| Validate Inputs | ✅ Pass | Server Actions validate admin notes (non-empty), status values (enum check) |
| Least Privilege | ✅ Pass | Service role client used only for RLS-bypassing admin mutations; never exposed to client |
| Supabase Architecture | ✅ Pass | All access through Server Actions — no direct client-to-Supabase |
| Avoid N+1 Queries | ✅ Pass | Single-row updates only; no batch loops |
| Simple First | ✅ Pass | Minimal mutation surface — toggle + approve/reject only |

---

## Data Access Strategy

### The RLS Problem

The existing Supabase client in `requireAdmin()` uses the **anon key** with the authenticated user's session. Current RLS policies are:

- `service_categories`: SELECT policy `"Anyone can see active categories"` — filters to `is_active = true`. **No UPDATE policy exists** for any role.
- `verification_requests`: RLS enabled but **no explicit SELECT or UPDATE policies for admin users**.

The admin's authenticated session runs as `role = 'authenticated'`, which means RLS blocks all admin UPDATE operations even though the app has verified the user is an admin.

### Solution: Service Role Client for Admin Mutations

Create a dedicated `createServiceRoleClient()` utility that uses `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS. This is safe because:

1. It only runs server-side inside Server Actions
2. Every call site is gated behind `requireAdmin()` which first authenticates the user and verifies `is_admin = true`
3. The service role key is already defined in `src/lib/env.ts` (optional field)
4. The key never leaves the server

**Pattern**:
```
requireAdmin()           → authenticates user, verifies is_admin
createServiceRoleClient()  → returns RLS-bypassing client for the mutation
```

The `requireAdmin()` function continues to use the regular anon-key client for auth checks. Only the actual mutation query uses the service role client.

### Alternative Considered: Admin-Specific RLS Policies

Adding `CREATE POLICY "Admins can update categories" ON service_categories FOR UPDATE USING (...)` would require the RLS policy to query the `users` table to check `is_admin`, adding a cross-table lookup on every mutation. The service role approach is simpler and avoids schema changes.

---

## Admin Moderation Route Strategy

All moderation UI remains within the existing `(admin)` route group:

```
src/app/(admin)/
├── layout.tsx                          # Existing — admin auth guard + shell
├── loading.tsx                         # Existing — loading skeleton
├── error.tsx                           # Existing — error boundary
└── admin/
    ├── page.tsx                        # MODIFY — add attention indicators to stat cards
    ├── categories/
    │   └── page.tsx                    # MODIFY — add toggle controls + confirmation dialog
    ├── verifications/
    │   └── page.tsx                    # MODIFY — add approve/reject + detail view
    ├── users/page.tsx                  # Unchanged — read-only (no user mutations this phase)
    ├── jobs/page.tsx                   # Unchanged
    ├── bookings/page.tsx               # Unchanged
    └── reports/page.tsx                # Unchanged
```

**No new routes are created.** No `/worker` or `/customer` routes.

---

## Proposed Changes

### 1. Supabase Service Role Client

#### [NEW] `src/lib/supabase/service.ts`

Create a server-only utility that returns a Supabase client using the service role key. This client bypasses RLS and is used exclusively inside admin Server Actions after `requireAdmin()` has passed.

```typescript
// Creates a Supabase client with the service role key (bypasses RLS)
// ONLY for use inside admin Server Actions after requireAdmin() verification
```

- Uses `createClient` from `@supabase/supabase-js` (not `@supabase/ssr` — no cookies needed for service role)
- Throws if `SUPABASE_SERVICE_ROLE_KEY` is not set
- No cookie handling — stateless

---

### 2. Admin Mutation Server Actions

#### [MODIFY] `src/lib/services/admin.ts`

Add three new exported Server Action functions to the existing admin service file. Keep all existing read functions unchanged.

**New functions:**

##### `toggleCategoryActive(categoryId: string, isActive: boolean)`
- Calls `requireAdmin()` to verify the caller
- Validates `categoryId` is a non-empty string
- Creates service role client
- Executes `UPDATE service_categories SET is_active = $isActive WHERE id = $categoryId`
- Calls `revalidatePath('/admin/categories')` and `revalidatePath('/categories')` (public page)
- Returns `{ success: true }` or `{ success: false, error: string }`

##### `reviewVerification(verificationId: string, decision: 'verified' | 'rejected', adminNotes: string)`
- Calls `requireAdmin()` to verify the caller
- Validates:
  - `verificationId` is a non-empty string
  - `decision` is exactly `'verified'` or `'rejected'`
  - `adminNotes` is a non-empty string (trimmed)
- Creates service role client
- Fetches the verification request to confirm `status = 'pending'` (rejects if already decided)
- Executes `UPDATE verification_requests SET status = $decision, admin_notes = $adminNotes WHERE id = $verificationId`
- The existing `trg_sync_verification_status` trigger automatically syncs `worker_profiles.verification_status`
- Calls `revalidatePath('/admin/verifications')` and `revalidatePath('/admin')` (dashboard stats)
- Returns `{ success: true }` or `{ success: false, error: string }`

##### `getAdminVerificationDetail(verificationId: string)`
- Calls `requireAdmin()` to verify the caller
- Fetches a single verification request with full details (id, worker_id, status, document_url, selfie_url, admin_notes, created_at, updated_at)
- Returns the verification record or null

**Updated functions:**

##### `getAdminVerifications()` — Sort Enhancement
- Add `.order('status', { ascending: true })` as a primary sort so `pending` items appear before `verified`/`rejected`
- Keep `.order('created_at', { ascending: false })` as secondary sort within each status group

##### `getAdminCategories()` — Sort Enhancement
- Add sort logic to place inactive categories visually distinct (secondary sort by `is_active` descending so inactive appear after active, or rely on UI-level visual emphasis)

---

### 3. Confirmation Dialog Component

#### [NEW] `src/components/admin/AdminConfirmDialog.tsx`

A reusable client component for admin action confirmations. Built on top of the existing `Modal` component (`src/components/ui/modal.tsx`).

**Props:**
```typescript
interface AdminConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  description: string
  confirmLabel?: string        // default: "Confirm"
  confirmVariant?: 'default' | 'destructive'  // visual emphasis
  isLoading?: boolean          // disables confirm button + shows spinner
  children?: React.ReactNode   // optional slot for extra fields (e.g., admin notes textarea)
}
```

**Behavior:**
- Renders the existing `Modal` with title/description
- Shows Cancel and Confirm buttons
- Confirm button shows `Spinner` and is disabled when `isLoading = true`
- Cancel button dismisses with no side effects
- Clicking the backdrop closes (no mutation)
- The `children` slot allows embedding form fields (used for admin notes textarea in verification flows)

---

### 4. Category Toggle Approach

#### [MODIFY] `src/app/(admin)/admin/categories/page.tsx`

Transform from a pure Server Component to a hybrid:
- The **page** remains a Server Component that fetches data via `getAdminCategories()`
- It renders a new **client component** `AdminCategoriesTable` that receives the data as props

#### [NEW] `src/components/admin/AdminCategoriesTable.tsx`

Client component that handles interactivity.

**Behavior:**
- Renders a table (reusing the structure from `AdminDataTable` but with an added "Actions" column)
- Each row shows: Name, Status (Badge: Active/Inactive with color), Description, Created, **Toggle Action**
- The toggle action is a button labeled "Deactivate" (if active) or "Activate" (if inactive)
- Clicking the toggle opens `AdminConfirmDialog`:
  - Title: "Deactivate category [name]?" or "Activate category [name]?"
  - Description: consequence text (e.g., "This will hide the category from public listings")
  - No admin notes required for category toggles (spec only requires notes for verification actions)
- On confirm: calls `toggleCategoryActive()` Server Action
- On success: shows success feedback (toast or inline), dialog closes, page data revalidates
- On error: shows error message in the dialog
- Inactive rows are visually muted (reduced opacity or muted text color)

**Visual indicators (Story 6):**
- Inactive categories: muted row styling + warning badge
- Active categories: normal styling + green badge

---

### 5. Verification Review Approach

#### [MODIFY] `src/app/(admin)/admin/verifications/page.tsx`

Transform to a hybrid approach similar to categories:
- Server Component fetches via `getAdminVerifications()`
- Renders a new client component `AdminVerificationsTable`

#### [NEW] `src/components/admin/AdminVerificationsTable.tsx`

Client component for the verification queue with interactive review capabilities.

**Table columns:**
- Worker ID
- Status (Badge: pending=yellow/warning, verified=green, rejected=red)
- Document (view link)
- Submitted date
- Admin Notes (truncated, shown if present)
- **Actions** (Approve / Reject buttons — only for `pending` status)

**Approve flow:**
1. Admin clicks "Approve" on a pending row
2. `AdminConfirmDialog` opens with:
   - Title: "Approve verification for worker [worker_id]?"
   - Description: "This will mark the worker as verified on the platform."
   - A **required** `Textarea` for admin notes (via the `children` slot)
   - Confirm button labeled "Approve"
3. Confirm button is disabled until notes field is non-empty
4. On confirm: calls `reviewVerification(id, 'verified', notes)`
5. On success: dialog closes, table refreshes via revalidation
6. On error: error shown in dialog

**Reject flow:**
- Same as approve but:
  - Title: "Reject verification for worker [worker_id]?"
  - Description: "This will mark the worker's verification as rejected."
  - Confirm button labeled "Reject" with `destructive` variant
  - Calls `reviewVerification(id, 'rejected', notes)`

**Already-decided requests:**
- Rows with `verified` or `rejected` status show the status badge and admin notes (read-only)
- Approve/Reject buttons are **not rendered** for non-pending rows
- If admin notes exist, they display in a muted text cell

**Sorting (Story 6):**
- Pending requests sorted to the top
- Pending rows may have a subtle left-border highlight (e.g., `border-l-4 border-amber-400`)

---

### 6. Admin Dashboard Attention Indicators

#### [MODIFY] `src/app/(admin)/admin/page.tsx`

- Update the "Pending Verifications" stat card to show visual emphasis when count > 0 (e.g., pulse dot, highlighted border, or the value in a warning color)
- Update the subtitle text from "Actions coming in Phase 20" to something current (e.g., "A high-level summary of platform activity")
- Optionally add an inactive categories count to the stats (requires a minor addition to `getAdminOverviewStats()`)

#### [MODIFY] `src/lib/services/admin.ts` — `getAdminOverviewStats()`

Add `inactiveCategories` count to the stats interface:
```typescript
inactiveCategories: number  // count of categories where is_active = false
```

---

### 7. Admin Notes Handling

Admin notes are handled inline within the `AdminConfirmDialog` for verification actions:

- A `Textarea` component (using existing `src/components/ui/textarea.tsx`) is rendered inside the dialog's `children` slot
- The textarea has a `required` visual indicator and placeholder text (e.g., "Reason for this decision...")
- The confirm button is disabled until the textarea has non-empty content (client-side)
- Server-side validation in `reviewVerification()` also rejects empty `adminNotes`
- Notes are stored in `verification_requests.admin_notes`
- Notes are immutable after the decision — the UI shows them as read-only text for decided requests

**No separate notes component is needed.** The textarea is directly embedded in the confirmation dialog for verification actions.

---

## Permission/Check Strategy

| Layer | Mechanism | Details |
|-------|-----------|---------|
| Route-level | `(admin)/layout.tsx` | Redirects non-admin users to `/dashboard` before any page renders |
| Service-level | `requireAdmin()` in every Server Action | Re-verifies admin status on every mutation. Returns authenticated Supabase client |
| Database-level | Service role client | Bypasses RLS for admin mutations only after `requireAdmin()` passes |
| Column-level | `prevent_is_admin_update` trigger | Prevents `is_admin` from being modified via authenticated/anon role |

**No new permission levels or role hierarchies are introduced.**

---

## File/Folder Impact

### New Files (4)

| File | Purpose |
|------|---------|
| `src/lib/supabase/service.ts` | Service role Supabase client for admin mutations |
| `src/components/admin/AdminConfirmDialog.tsx` | Reusable confirmation dialog with loading state and children slot |
| `src/components/admin/AdminCategoriesTable.tsx` | Interactive categories table with toggle controls |
| `src/components/admin/AdminVerificationsTable.tsx` | Interactive verification queue with approve/reject actions |

### Modified Files (4)

| File | Changes |
|------|---------|
| `src/lib/services/admin.ts` | Add `toggleCategoryActive()`, `reviewVerification()`, `getAdminVerificationDetail()`, update sort orders, add `inactiveCategories` stat |
| `src/app/(admin)/admin/categories/page.tsx` | Replace `AdminDataTable` with new `AdminCategoriesTable` client component |
| `src/app/(admin)/admin/verifications/page.tsx` | Replace `AdminDataTable` with new `AdminVerificationsTable` client component |
| `src/app/(admin)/admin/page.tsx` | Add attention indicators to stat cards, update subtitle text |

### Unchanged Files

| File | Reason |
|------|--------|
| `src/app/(admin)/layout.tsx` | Auth guard already works correctly |
| `src/app/(admin)/admin/users/page.tsx` | No user mutations in this phase |
| `src/app/(admin)/admin/jobs/page.tsx` | Out of scope |
| `src/app/(admin)/admin/bookings/page.tsx` | Out of scope |
| `src/components/admin/AdminDataTable.tsx` | Kept for pages that remain read-only (users, jobs, bookings) |
| `src/components/admin/AdminSidebar.tsx` | No navigation changes needed |
| `src/components/admin/AdminHeader.tsx` | No header changes needed |
| `src/components/ui/modal.tsx` | Used as-is by `AdminConfirmDialog` |
| `src/components/ui/textarea.tsx` | Used as-is for admin notes input |
| Database schema / migrations | No new tables, columns, or migrations |

---

## Loading, Error, and Empty State Strategy

### Loading States
- **Page-level**: Existing `(admin)/loading.tsx` handles initial page load skeleton
- **Action-level**: `AdminConfirmDialog` shows `Spinner` on the confirm button during processing; button is disabled to prevent double-submit
- **Table-level**: After a mutation completes, `revalidatePath()` triggers a server re-render. During the brief transition, Next.js handles the loading state

### Error States
- **Page-level**: Existing `(admin)/error.tsx` catches rendering errors
- **Action-level**: Server Action returns `{ success: false, error: string }`. The confirmation dialog displays the error inline and allows retry
- **Network errors**: Caught in the client component's try/catch around the Server Action call, displayed in the dialog

### Empty States
- **Categories**: "No categories — System service categories haven't been configured." (existing empty message, unchanged)
- **Verifications**: "No verification requests to review." (updated messaging)
- **Filtered empty**: If all verifications are decided, the table still shows them (read-only) — it never goes truly empty unless the table is empty

---

## Validation Strategy

### Client-Side (UX convenience)
- Admin notes textarea: Confirm button disabled until field is non-empty
- No other client-side validation needed (toggles are binary, IDs come from the data)

### Server-Side (Security enforcement)
- `toggleCategoryActive()`:
  - `categoryId`: must be a non-empty string
  - `isActive`: must be a boolean
  - `requireAdmin()`: must pass
- `reviewVerification()`:
  - `verificationId`: must be a non-empty string
  - `decision`: must be exactly `'verified'` or `'rejected'`
  - `adminNotes`: must be a non-empty string after trimming
  - Current status must be `'pending'` (re-checked server-side before mutation)
  - `requireAdmin()`: must pass

### Database-Level
- `verification_status` enum constrains valid values
- `is_active` boolean on `service_categories` constrains toggle values
- `prevent_is_admin_update` trigger protects admin flag
- `trg_sync_verification_status` trigger ensures `worker_profiles.verification_status` stays in sync

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Service role key not configured** | Medium | Admin mutations silently fail | Throw a clear error in `createServiceRoleClient()` if key is missing. Document in README. `env.ts` already has the field (optional) — consider making it required when admin features are used |
| **Concurrent admin actions on same verification** | Low | Last-write-wins, second admin sees stale data | Acceptable for this phase. `reviewVerification()` re-checks `status = 'pending'` before mutating. Second admin gets a clear error "This request has already been reviewed" |
| **Category deactivation affecting live jobs** | Low | Jobs with deactivated category still visible | Per spec edge case: existing jobs/associations are not affected. Only new category selections in public UI are affected via existing RLS filter |
| **Stale UI after mutation** | Low | Admin sees old data | `revalidatePath()` ensures fresh data on next render. No optimistic updates used |
| **RLS policy drift** | Low | Future RLS changes could break admin reads | Admin read functions already use the authenticated user's session which works with current policies. Document the service role dependency for mutations |

---

## Assumptions

1. **Phase 19 complete and stable**: Admin layout, sidebar, header, stat cards, data tables, and `requireAdmin()` guard are all deployed and working
2. **Existing schema unchanged**: `service_categories.is_active`, `verification_requests.status`, `verification_requests.admin_notes`, `worker_profiles.verification_status`, and the `trg_sync_verification_status` trigger all exist as defined in migrations
3. **`SUPABASE_SERVICE_ROLE_KEY` available**: The environment variable is set in the deployment environment (already defined as optional in `src/lib/env.ts`)
4. **No notification wiring needed**: The spec explicitly states no external notifications. No existing database trigger auto-creates notifications for verification status changes, so this is not a concern
5. **Shadcn UI components available**: `Badge`, `Button`, `Textarea`, `Modal`, and `Spinner` components exist in `src/components/ui/`
6. **No pagination needed this phase**: Existing 100-row limit is acceptable for MVP admin moderation. The `AdminDataTable` already notes this limit
7. **Single confirmation dialog pattern**: Category toggles use a simple confirm dialog (no notes). Verification actions use the same dialog with an embedded notes textarea

---

## Dependency Order

```
1. src/lib/supabase/service.ts                    — no dependencies, foundational
2. src/components/admin/AdminConfirmDialog.tsx     — depends on Modal, Button, Spinner
3. src/lib/services/admin.ts (mutations)           — depends on service.ts
4. src/components/admin/AdminCategoriesTable.tsx   — depends on AdminConfirmDialog, admin.ts
5. src/app/(admin)/admin/categories/page.tsx       — depends on AdminCategoriesTable
6. src/components/admin/AdminVerificationsTable.tsx — depends on AdminConfirmDialog, admin.ts
7. src/app/(admin)/admin/verifications/page.tsx    — depends on AdminVerificationsTable
8. src/lib/services/admin.ts (stats update)        — add inactiveCategories count
9. src/app/(admin)/admin/page.tsx                  — depends on updated stats
```

---

## Verification Plan

### Build Validation
- `npm run build` must pass with no errors after all changes

### Manual Verification

1. **Category Toggle**:
   - Navigate to `/admin/categories`
   - Toggle an active category → confirm dialog appears → confirm → badge changes to "Inactive"
   - Visit public `/categories` page → deactivated category should not appear
   - Toggle the category back to active → confirm → badge changes to "Active"
   - Cancel a toggle → no change occurs

2. **Verification Approve**:
   - Navigate to `/admin/verifications`
   - Click "Approve" on a pending request → confirm dialog with notes textarea appears
   - Try to submit with empty notes → confirm button remains disabled
   - Enter notes and confirm → status updates to "verified", notes are visible
   - Check that the worker's profile shows verified status

3. **Verification Reject**:
   - Click "Reject" on a pending request → confirm dialog with destructive styling
   - Enter rejection reason and confirm → status updates to "rejected"
   - Verify that approve/reject buttons are not shown for decided requests

4. **Permission Enforcement**:
   - As a non-admin user, attempt to call admin Server Actions directly → should redirect or fail

5. **Dashboard Attention Indicators**:
   - With pending verifications, the stat card should show visual emphasis
   - With inactive categories, verify the count appears

---

Ready for `/speckit.tasks`.
