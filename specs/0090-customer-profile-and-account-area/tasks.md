# Tasks - Phase 9: Customer Profile and Account Area

**Input**: Design documents from `specs/0090-customer-profile-and-account-area/`
**Prerequisites**: `plan.md`, `spec.md`

## Phase 1: Foundational Validations & Actions

**Purpose**: Establish data mapping structures safely interacting with the existing schema.

- [ ] T001 Create `customerProfileSchema` in `src/lib/validations/customer.ts` validating `location_text`.
- [ ] T002 Implement `upsertCustomerProfile` server action in `src/app/customer/actions.ts` targeting `public.customer_profiles`.
- [ ] T003 [P] Add unit test suite in `tests/unit/validations/customer.test.ts` to ensure invariants are caught.

---

## Phase 2: Form Interface Configuration (P1)

**Goal**: Establish the primary UI component powering both onboarding and settings.

- [ ] T004 Create `CustomerProfileForm` structure in `src/components/customer/customer-profile-form.tsx`.
- [ ] T005 [P] Wire `CustomerProfileForm` specifically with the `zodResolver(customerProfileSchema)` and React Hook Form.
- [ ] T006 [P] Add the `location_text` input field to the form with associated error labels.
- [ ] T007 Configure inline React state to render a success banner cleanly avoiding strict dependent Toast components.

---

## Phase 3: Dashboard & Empty States (P1)

**Goal**: Create the routing endpoints the forms map into and establish future architecture markers.

- [ ] T008 Scaffold Customer Dashboard at `src/app/(protected)/customer/dashboard/page.tsx`.
- [ ] T009 Add logic to query `customer_profiles` cleanly using `.maybeSingle()`.
- [ ] T010 If profile is null, display "Create Customer Profile" call-to-action wrapper.
- [ ] T011 If profile exists, display "Profile Active" alongside rendering UX Placeholders blocks explicitly labeled "My Job Posts" and "My Bookings".

---

## Phase 4: Account Configuration Area (P2)

**Goal**: Place the `<CustomerProfileForm/>` effectively into the application layout tree.

- [ ] T012 Scaffold Settings layout at `src/app/(protected)/customer/settings/profile/page.tsx`.
- [ ] T013 Pre-fetch existing customer data (if any) and inject into `initialData` for the `<CustomerProfileForm/>`.
- [ ] T014 Implement `src/app/(protected)/customer/settings/profile/loading.tsx` to display skeleton blocks matching the Form.

---

## Phase N: Verification

- [ ] T015 Verify TS type checking over the isolated customer configurations.
- [ ] T016 Visually verify navigating unprofiled `/customer/dashboard` securely acts modular.
