# Tasks: Phase 20 — Admin Moderation and Management

**Input**: Design documents from `specs/0200-admin-moderation-and-management/`
**Prerequisites**: [plan.md](file:///home/dawa/Documents/digital-blue-collar/specs/0200-admin-moderation-and-management/plan.md) (required), [spec.md](file:///home/dawa/Documents/digital-blue-collar/specs/0200-admin-moderation-and-management/spec.md) (required)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1–US6)
- Exact file paths included

---

## Phase 1: Foundation — Service Role Client & Shared Components

**Purpose**: Infrastructure required by all mutation tasks. Must complete before any user story.

- [ ] T001 [P] Create service role Supabase client in `src/lib/supabase/service.ts`
  - **Files**: `src/lib/supabase/service.ts` [NEW]
  - **Details**: Export `createServiceRoleClient()` that returns a Supabase client using `SUPABASE_SERVICE_ROLE_KEY`. Throws a clear error if the env var is missing. Uses `createClient` from `@supabase/supabase-js` (not SSR). No cookie handling — stateless.
  - **Done when**: Function exports cleanly, throws if key missing, `npm run build` passes

- [ ] T002 [P] Create reusable admin confirmation dialog in `src/components/admin/AdminConfirmDialog.tsx`
  - **Files**: `src/components/admin/AdminConfirmDialog.tsx` [NEW]
  - **Details**: Client component wrapping existing `Modal` from `src/components/ui/modal.tsx`. Props: `isOpen`, `onClose`, `onConfirm`, `title`, `description`, `confirmLabel` (default "Confirm"), `confirmVariant` ("default" | "destructive"), `isLoading`, `children` (slot for extra fields like textarea). Cancel button always available. Confirm button disabled + shows `Spinner` when `isLoading`. Backdrop click closes (no mutation).
  - **Done when**: Component renders with title, description, cancel/confirm buttons, loading state disables confirm, children slot renders custom content, `npm run build` passes

**Checkpoint**: Foundation ready — user story work can begin.

---

## Phase 2: User Story 1 — Category Active/Inactive Toggle (Priority: P1) 🎯

**Goal**: Admin can toggle categories between active and inactive with confirmation.

**Independent Test**: Navigate to `/admin/categories`, toggle a category, verify badge changes and public listing updates.

- [ ] T003 [US1] Add `toggleCategoryActive` Server Action to `src/lib/services/admin.ts`
  - **Files**: `src/lib/services/admin.ts` [MODIFY]
  - **Details**: New exported async function `toggleCategoryActive(categoryId: string, isActive: boolean)`. Calls `requireAdmin()` to verify caller. Validates `categoryId` is non-empty string and `isActive` is boolean. Creates service role client via `createServiceRoleClient()`. Executes `UPDATE service_categories SET is_active = $isActive WHERE id = $categoryId`. Calls `revalidatePath('/admin/categories')` and `revalidatePath('/categories')`. Returns `{ success: true }` or `{ success: false, error: string }`.
  - **Done when**: Action updates `is_active` in DB, revalidates paths, returns success/error, non-admin callers are rejected

- [ ] T004 [US1] Create interactive categories table in `src/components/admin/AdminCategoriesTable.tsx`
  - **Files**: `src/components/admin/AdminCategoriesTable.tsx` [NEW]
  - **Details**: `'use client'` component. Receives `AdminCategory[]` as props. Renders table with columns: Name, Status (Badge — green "Active" / gray "Inactive"), Description, Created date, Actions (toggle button). Toggle button labeled "Deactivate" for active rows, "Activate" for inactive rows. Clicking opens `AdminConfirmDialog` with appropriate title/description. On confirm: calls `toggleCategoryActive()`. On success: closes dialog. On error: shows error in dialog. Inactive rows have muted styling (e.g., `opacity-60` or muted text color).
  - **Depends on**: T002, T003
  - **Done when**: Table renders categories, toggle button opens confirmation, confirms execute toggle, inactive rows are visually muted

- [ ] T005 [US1] Update categories page to use interactive table in `src/app/(admin)/admin/categories/page.tsx`
  - **Files**: `src/app/(admin)/admin/categories/page.tsx` [MODIFY]
  - **Details**: Replace `AdminDataTable` import/usage with new `AdminCategoriesTable`. Server Component fetches via `getAdminCategories()` and passes data as props to the client component. Keep existing `metadata` export.
  - **Depends on**: T004
  - **Done when**: `/admin/categories` renders interactive table with toggle controls, old read-only table is replaced

**Checkpoint**: Category toggle works end-to-end. Admin can activate/deactivate categories with confirmation. Public marketplace respects `is_active` via existing RLS.

---

## Phase 3: User Story 2 — Verification Request Review & Approval/Rejection (Priority: P1) 🎯

**Goal**: Admin can review, approve, or reject pending verification requests with mandatory notes.

**Independent Test**: Navigate to `/admin/verifications`, approve or reject a pending request with notes, verify worker status updates.

- [ ] T006 [US2] Add `reviewVerification` Server Action to `src/lib/services/admin.ts`
  - **Files**: `src/lib/services/admin.ts` [MODIFY]
  - **Details**: New exported async function `reviewVerification(verificationId: string, decision: 'verified' | 'rejected', adminNotes: string)`. Calls `requireAdmin()`. Validates: `verificationId` non-empty, `decision` is exactly `'verified'` or `'rejected'`, `adminNotes` is non-empty after trim. Creates service role client. Fetches the verification request to confirm `status = 'pending'` — if not pending, returns error "This request has already been reviewed". Executes `UPDATE verification_requests SET status = $decision, admin_notes = $adminNotes WHERE id = $verificationId`. The existing `trg_sync_verification_status` trigger handles `worker_profiles.verification_status` sync. Calls `revalidatePath('/admin/verifications')` and `revalidatePath('/admin')`. Returns `{ success: true }` or `{ success: false, error: string }`.
  - **Done when**: Action updates verification status + admin notes, rejects non-pending requests, trigger syncs worker profile, non-admin callers rejected

- [ ] T007 [US2] Add `getAdminVerificationDetail` query to `src/lib/services/admin.ts`
  - **Files**: `src/lib/services/admin.ts` [MODIFY]
  - **Details**: New exported async function `getAdminVerificationDetail(verificationId: string)`. Calls `requireAdmin()`. Fetches single verification request: `id`, `worker_id`, `status`, `document_url`, `selfie_url`, `admin_notes`, `created_at`, `updated_at`. Returns the record or `null`.
  - **Done when**: Function returns full verification detail for a given ID, returns null for invalid ID, non-admin callers rejected

- [ ] T008 [US2] Create interactive verifications table in `src/components/admin/AdminVerificationsTable.tsx`
  - **Files**: `src/components/admin/AdminVerificationsTable.tsx` [NEW]
  - **Details**: `'use client'` component. Receives `AdminVerification[]` as props. Renders table with columns: Worker ID, Status (Badge — pending=yellow `secondary`, verified=green `default`, rejected=red `destructive`), Document (link), Submitted date, Admin Notes (truncated if present, "—" if null), Actions. **Actions column**: For `pending` rows: "Approve" button (default variant) and "Reject" button (destructive variant). For non-pending rows: no action buttons rendered. **Approve flow**: Opens `AdminConfirmDialog` with title "Approve verification?", description, `children` slot containing a required `Textarea` for admin notes (using existing `src/components/ui/textarea.tsx`). Confirm button labeled "Approve", disabled until notes non-empty. On confirm: calls `reviewVerification(id, 'verified', notes)`. **Reject flow**: Same dialog but title "Reject verification?", confirm label "Reject", `confirmVariant='destructive'`, calls `reviewVerification(id, 'rejected', notes)`. On success: dialog closes. On error: inline error in dialog.
  - **Depends on**: T002, T006
  - **Done when**: Table renders all verifications, approve/reject open dialogs with required notes, actions complete successfully, non-pending rows have no action buttons

- [ ] T009 [US2] Update verifications page to use interactive table in `src/app/(admin)/admin/verifications/page.tsx`
  - **Files**: `src/app/(admin)/admin/verifications/page.tsx` [MODIFY]
  - **Details**: Replace `AdminDataTable` import/usage with new `AdminVerificationsTable`. Server Component fetches via `getAdminVerifications()` and passes data as props. Keep existing `metadata` export. Update empty state message to "No verification requests to review."
  - **Depends on**: T008
  - **Done when**: `/admin/verifications` renders interactive table with approve/reject controls, old read-only table is replaced

**Checkpoint**: Verification approve/reject works end-to-end. Worker profile status syncs automatically via DB trigger. Admin notes are persisted and visible.

---

## Phase 4: User Story 3 — Admin Notes for Moderation Decisions (Priority: P1)

**Goal**: All verification moderation actions require and persist admin notes.

**Independent Test**: Perform verification actions and verify notes are required, saved, and displayed.

> **Note**: The admin notes requirement is already embedded in T006 (server validation) and T008 (UI textarea + disabled confirm). This phase validates that the notes are correctly displayed in the read-only view.

- [ ] T010 [US3] Display admin notes on decided verification rows in `src/components/admin/AdminVerificationsTable.tsx`
  - **Files**: `src/components/admin/AdminVerificationsTable.tsx` [MODIFY]
  - **Details**: For rows with `status = 'verified'` or `status = 'rejected'`, display the `admin_notes` value in the Admin Notes column. Show full text (not truncated) or use a tooltip/expandable for long notes. Show the decision badge and notes as read-only — no action buttons. Ensure the row visually communicates "decided" state (e.g., slightly different background for verified vs rejected).
  - **Depends on**: T008
  - **Done when**: Decided verification rows show admin notes clearly, no action buttons, visual distinction between verified/rejected

**Checkpoint**: Admin notes are visible on all decided verification records.

---

## Phase 5: User Story 4 — System Record Visibility (Priority: P2)

**Goal**: Admin pages show all records regardless of status with clear indicators.

**Independent Test**: Verify admin pages display inactive categories, rejected verifications, and all users.

- [ ] T011 [US4] Update `getAdminVerifications` sort order in `src/lib/services/admin.ts`
  - **Files**: `src/lib/services/admin.ts` [MODIFY]
  - **Details**: Modify `getAdminVerifications()` to sort pending items first. Change the query to use a consistent sort: pending items should appear before verified/rejected. Since Supabase doesn't support custom enum ordering in `.order()`, fetch all results and sort client-side: pending first, then by `created_at` descending within each group. Alternatively, keep the server sort by `created_at` descending and let the UI component handle grouping.
  - **Done when**: Pending verifications appear before decided ones in the returned data

- [ ] T012 [P] [US4] Ensure categories page shows all categories (active + inactive) in `src/components/admin/AdminCategoriesTable.tsx`
  - **Files**: `src/components/admin/AdminCategoriesTable.tsx` [MODIFY]
  - **Details**: Verify that the categories table displays both active and inactive categories. Add a count summary in the table footer (e.g., "Showing X categories (Y active, Z inactive)"). Inactive categories should have clear visual distinction (muted row + "Inactive" badge already from T004).
  - **Depends on**: T004
  - **Done when**: Both active and inactive categories visible with status badges and count summary

**Checkpoint**: Admin has complete visibility into all platform records regardless of status.

---

## Phase 6: User Story 5 — Safe Admin Actions with Confirmation (Priority: P2)

**Goal**: All moderation actions require explicit confirmation with loading/error states.

**Independent Test**: Trigger each admin action and verify confirmation appears, cancel works, loading shows, errors display.

> **Note**: Confirmation dialogs are already built into T004 (categories) and T008 (verifications) via `AdminConfirmDialog`. This phase adds edge case handling.

- [ ] T013 [US5] Add loading state to category toggle in `src/components/admin/AdminCategoriesTable.tsx`
  - **Files**: `src/components/admin/AdminCategoriesTable.tsx` [MODIFY]
  - **Details**: Ensure that when the toggle action is processing: (1) the confirm button in the dialog shows a spinner and is disabled, (2) the cancel button remains available but does not dismiss during processing, (3) on error the dialog stays open with an inline error message, (4) on success the dialog closes and a success message is briefly shown (use a local state message or toast). Verify the toggle button in the table row is also disabled while the dialog is processing to prevent double-opens.
  - **Depends on**: T004
  - **Done when**: Loading spinner shows during processing, errors display inline, double-submit prevented, cancel available but controlled

- [ ] T014 [US5] Add loading state to verification actions in `src/components/admin/AdminVerificationsTable.tsx`
  - **Files**: `src/components/admin/AdminVerificationsTable.tsx` [MODIFY]
  - **Details**: Same loading/error handling as T013 but for approve/reject flows. Ensure: (1) confirm button shows spinner + disabled during processing, (2) error message displays inline in dialog on failure, (3) success closes dialog, (4) approve/reject buttons in table row disabled while any dialog is open/processing.
  - **Depends on**: T008
  - **Done when**: Loading/error states work for both approve and reject flows, double-submit prevented

**Checkpoint**: All admin actions have safe confirmation with proper loading and error handling.

---

## Phase 7: User Story 6 — Flagged/Problem Record Readiness (Priority: P3)

**Goal**: Visual indicators highlight records needing admin attention.

**Independent Test**: Verify pending verifications and inactive categories have visual emphasis on dashboard and list pages.

- [ ] T015 [US6] Add `inactiveCategories` count to `getAdminOverviewStats` in `src/lib/services/admin.ts`
  - **Files**: `src/lib/services/admin.ts` [MODIFY]
  - **Details**: Add a new query to `getAdminOverviewStats()` counting categories where `is_active = false`. Add `inactiveCategories: number` to the `AdminOverviewStats` interface. Add the count query to the existing `Promise.all` array.
  - **Done when**: `AdminOverviewStats` includes `inactiveCategories` count, query executes correctly

- [ ] T016 [US6] Add attention indicators to admin dashboard stat cards in `src/app/(admin)/admin/page.tsx`
  - **Files**: `src/app/(admin)/admin/page.tsx` [MODIFY]
  - **Details**: Update the "Pending Verifications" stat card to show visual emphasis when `pendingVerifications > 0` (e.g., a pulsing dot, highlighted border `ring-2 ring-rose-300`, or the value rendered in rose color). Add a new "Inactive Categories" stat card (or badge on the existing categories card) showing the `inactiveCategories` count with amber accent when count > 0. Update the dashboard subtitle from "Actions coming in Phase 20" to "A high-level summary of platform activity." Remove any Phase 20 preview references.
  - **Depends on**: T015
  - **Done when**: Pending verifications stat card highlights when count > 0, inactive categories count visible, subtitle updated

- [ ] T017 [US6] Add pending highlight to verification table rows in `src/components/admin/AdminVerificationsTable.tsx`
  - **Files**: `src/components/admin/AdminVerificationsTable.tsx` [MODIFY]
  - **Details**: Add a left-border highlight to pending verification rows (e.g., `border-l-4 border-amber-400`). Ensure pending rows are visually distinct from decided rows at a glance.
  - **Depends on**: T008
  - **Done when**: Pending rows have a visible left-border accent, decided rows do not

**Checkpoint**: Admin dashboard and list pages clearly surface items requiring attention.

---

## Phase 8: Validation & Polish

**Purpose**: Final verification that all acceptance criteria are met.

- [ ] T018 Validate admin permission enforcement
  - **Files**: No code changes — manual verification
  - **Details**: Verify that: (1) non-admin users accessing `/admin/*` are redirected to `/dashboard`, (2) directly calling `toggleCategoryActive()` or `reviewVerification()` without admin role fails/redirects, (3) the `is_admin` column cannot be modified by authenticated users (trigger protection).
  - **Done when**: All permission checks pass, non-admin users cannot perform any admin action

- [ ] T019 Validate category toggle end-to-end
  - **Files**: No code changes — manual verification
  - **Details**: Verify: (1) toggle active → inactive with confirmation, (2) inactive category disappears from public `/categories` page, (3) toggle inactive → active restores public visibility, (4) cancel confirmation makes no change, (5) existing `worker_categories` associations are preserved when category is deactivated, (6) inactive categories are not selectable for new worker registrations.
  - **Done when**: All category toggle scenarios pass

- [ ] T020 Validate verification review end-to-end
  - **Files**: No code changes — manual verification
  - **Details**: Verify: (1) approve pending request with notes → status becomes `verified`, worker profile `verification_status` becomes `verified`, (2) reject pending request with notes → status becomes `rejected`, worker profile `verification_status` becomes `rejected`, (3) empty notes prevent submission (client + server), (4) already-decided requests show read-only with no action buttons, (5) admin notes are persisted and visible.
  - **Done when**: All verification review scenarios pass

- [ ] T021 Validate no hard deletes exist
  - **Files**: No code changes — code review
  - **Details**: Review all new/modified files to confirm: (1) no SQL `DELETE` statements, (2) no Supabase `.delete()` calls, (3) all actions are reversible (category re-toggle) or final-but-non-destructive (verification decisions), (4) no `/worker` or `/customer` routes were created.
  - **Done when**: Code review confirms no destructive operations and no prohibited routes

- [ ] T022 Run build validation
  - **Files**: No code changes
  - **Details**: Run `npm run build` and verify clean build with no TypeScript errors, no missing imports, and no warnings related to admin changes.
  - **Done when**: `npm run build` passes cleanly

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Foundation)    → No dependencies — start here
Phase 2 (Categories)    → Depends on Phase 1 (T001, T002)
Phase 3 (Verifications) → Depends on Phase 1 (T001, T002)
Phase 4 (Admin Notes)   → Depends on Phase 3 (T008)
Phase 5 (Visibility)    → Depends on Phase 2 + 3
Phase 6 (Confirmation)  → Depends on Phase 2 + 3
Phase 7 (Attention)     → Depends on Phase 2 + 3
Phase 8 (Validation)    → Depends on all previous phases
```

### Parallel Opportunities

- **T001 and T002**: Can run in parallel (different files, no dependencies)
- **Phase 2 and Phase 3**: Can run in parallel after Phase 1 completes (different file sets)
- **T011 and T012**: Can run in parallel (different files)
- **T015 and T017**: Can run in parallel (different files)

### Critical Path

```
T001 → T003 → T004 → T005  (Category toggle path)
T001 → T006 → T008 → T009  (Verification review path)
T002 → T004 (Confirmation dialog needed by categories table)
T002 → T008 (Confirmation dialog needed by verifications table)
```

---

## Notes

- All admin functionality stays within `src/app/(admin)/admin/` — no `/worker` or `/customer` routes
- No new database migrations — all mutations operate on existing schema
- Service role client is the RLS bypass strategy for admin mutations
- The `trg_sync_verification_status` DB trigger handles `worker_profiles` sync automatically
- No optimistic updates — all UI waits for server confirmation
- No hard deletes anywhere — all actions are soft controls
