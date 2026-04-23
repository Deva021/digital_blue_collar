# Implementation Plan - Phase 9: Customer Profile and Account Area

Based on `specs/0090-customer-profile-and-account-area/spec.md`, this plan outlines the architecture for the customer-side capabilities, implementing an optional onboarding flow and establishing the required dashboard placeholder frames.

## 1. Goal Description

Establish the customer identity foundation, meaning registered users can choose to configure a Customer profile (consisting of their geographical location) required to post jobs. This establishes the `/customer/dashboard` environment and `/customer/settings/profile` editing mechanisms similar to the Worker flow, but constrained strictly to the consumer identity structure.

## 2. Proposed Changes

### Components & Validations

#### [NEW] [src/lib/validations/customer.ts](src/lib/validations/customer.ts)

- **Role**: Standardizes `zod` input constraints for the customer profile.
- **Rules**: Validates `location_text` (min length 2, max 100). No other fields required per `spec.md`.

#### [NEW] [src/components/customer/customer-profile-form.tsx](src/components/customer/customer-profile-form.tsx)

- **Role**: Reusable React component managing customer profile state.
- **Integration**: Leverages Next.js `useTransition` interacting with the server action, returning inline Zod schema errors gracefully or rendering success banners.

### Server Actions

#### [NEW] [src/app/customer/actions.ts](src/app/customer/actions.ts)

- **Role**: Provides the server context `upsertCustomerProfile(data: CustomerProfileValues)`.
- **Logic**: Authenticates the HTTP Session, safely parses Zod inputs, and natively invokes `.upsert()` into `public.customer_profiles` mapping `user.id`. Calls `revalidatePath` ensuring navigation frames stay synced.

### App Routing & Contexts

#### [NEW] [src/app/(protected)/customer/dashboard/page.tsx](<src/app/(protected)/customer/dashboard/page.tsx>)

- **Role**: Primary UI navigation anchor once established as a customer.
- **Constraints**:
  - Conditionally displays "Create Customer Profile" vs "Profile Active" based on table hits.
  - Implements designated UI Skeleton grids mapping to upcoming Job and Booking functional dependencies. No dynamic logic implemented yet.

#### [NEW] [src/app/(protected)/customer/settings/profile/page.tsx](<src/app/(protected)/customer/settings/profile/page.tsx>)

- **Role**: Account configuration viewport allowing users to modify the location constraints.
- **Functionality**: Re-uses the Server Client to map current `.maybeSingle()` returns onto the `initialData` parameter of `<CustomerProfileForm/>`. Handles empty profile states gracefully to act natively as onboarding logic.

#### [NEW] [src/app/(protected)/customer/settings/profile/loading.tsx](<src/app/(protected)/customer/settings/profile/loading.tsx>)

- **Role**: Suspense fallback for latency masking during configuration lookups.

## 3. Verification Plan

### Automated Tests

- Introduce unit test definitions under `tests/unit/validations/customer.test.ts` to strictly catch validation omissions for customer profile Zod shapes.

### Manual Verification

1. Navigate directly to `/customer/dashboard` unconditionally.
2. Ensure placeholder items correctly structure the UI.
3. Validate "Create Profile" CTAs function when missing `customer_profiles` data.
4. Render updates through `/customer/settings/profile` and verify instantaneous component state shifts upon database execution.

## 4. Risks and Assumptions

- **Assumption**: The existing `auth.users -> public.users` DB triggers correctly supply identity rows so `customer_profiles` foreign constraints will pass successfully.
- **Assumption**: No further Middleware route blocking logic is necessary per iterative user guidance making all paths "Optional" prior to use. Missing records gracefully fallback in frontend rendering states.
- **Risk**: Customer onboarding schema changes context relative to worker. **Mitigation**: Kept distinctly isolated matching separate database schemas exactly.
