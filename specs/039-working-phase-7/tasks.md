# Tasks: Phase 7 — Authentication

**Input**: Design documents from `/specs/039-working-phase-7/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Foundational Auth Setup

**Purpose**: Core infrastructure for Supabase auth that all UI forms will depend on.

- [ ] T0701 [P] Create Supabase server client utility in `src/lib/supabase/server.ts`
  - **Done when**: `createServerClient` is successfully wrapped and exported.
- [ ] T0702 [P] Create Supabase browser client utility in `src/lib/supabase/client.ts`
  - **Done when**: `createBrowserClient` is successfully wrapped and exported.
- [ ] T0703 [P] Create Supabase middleware client utility in `src/lib/supabase/middleware.ts`
  - **Done when**: `createServerClient` for middleware request/response is wrapped and exported.
- [ ] T0704 Define shared auth schema validations (Zod) in `src/lib/validations/auth.ts`
  - **Done when**: Email and password validation schemas are defined and exportable.

**Checkpoint**: Foundation ready - UI stories can be implemented.

---

## Phase 2: User Story 1 - Secure Signup & Login (Priority: P1)

**Goal**: Implement user entry via `/signup` and `/login` forms.

- [ ] T0705 [US1] Create atomic `login-form.tsx` component in `src/components/auth/`
  - **Done when**: UI form exists with email/password inputs, loading state support, and error state mapping.
- [ ] T0706 [US1] Create atomic `signup-form.tsx` component in `src/components/auth/`.
  - **Done when**: UI form exists with email/password inputs, mimicking login structure but geared for registration.
- [ ] T0707 [US1] Implement Server Action for Login in `src/app/(auth)/login/actions.ts`
  - **Done when**: Action calls Supabase `signInWithPassword`, handles generic error passing.
- [ ] T0708 [US1] Implement Server Action for Signup in `src/app/(auth)/signup/actions.ts`
  - **Done when**: Action calls Supabase `signUp`, handles generic error passing, defers profile creation.
- [ ] T0709 [US1] Build `/login` page route in `src/app/(auth)/login/page.tsx`
  - **Done when**: Page renders `login-form.tsx` wired to the server action, redirecting if session already exists.
- [ ] T0710 [US1] Build `/signup` page route in `src/app/(auth)/signup/page.tsx`
  - **Done when**: Page renders `signup-form.tsx` wired to the server action.

**Checkpoint**: Users can successfully create an account and authenticate.

---

## Phase 3: User Story 2 - Password Recovery (Priority: P2)

**Goal**: Implement `/forgot-password` flow.

- [ ] T0711 [US2] Create atomic `forgot-password-form.tsx` component in `src/components/auth/`
  - **Done when**: UI form exists with single email input and generic success/error states.
- [ ] T0712 [US2] Implement Server Action for Password Reset in `src/app/(auth)/forgot-password/actions.ts`
  - **Done when**: Action calls Supabase `resetPasswordForEmail`.
- [ ] T0713 [US2] Build `/forgot-password` page route in `src/app/(auth)/forgot-password/page.tsx`
  - **Done when**: Page renders the forgot password form and connects to the action.
- [ ] T0714 [US2] Implement `/auth/callback` route handler for password reset redirect link
  - **Done when**: `src/app/auth/callback/route.ts` successfully exchanges standard auth codes.

**Checkpoint**: User can trigger recovery and reset connection works.

---

## Phase 4: User Story 3 - Protected Routes & Session Handling (Priority: P1)

**Goal**: Protect access and gracefully redirect users based on auth state.

- [ ] T0715 [US3] Implement global Next.js middleware in `src/middleware.ts`
  - **Done when**: Middleware successfully checks session via `src/lib/supabase/middleware.ts` and updates cookies.
- [ ] T0716 [US3] Add unauthenticated redirect logic to middleware
  - **Done when**: Any route matching `/(protected)/*` strictly redirects to `/login` if no session exists.
- [ ] T0717 [US3] Add authenticated redirect logic to middleware
  - **Done when**: Any logged-in user hitting `/login` or `/signup` automatically bounces to `/dashboard` (or generic root).
- [ ] T0718 [P] [US3] Scaffold `(protected)` route group layout in `src/app/(protected)/layout.tsx`
  - **Done when**: Base protected app layout is established and optionally verifies server-side session.

**Checkpoint**: Security boundaries established. Unauthenticated access gracefully blocked.

---

## Phase 5: Verification & Polish

**Purpose**: Tie up edge cases and finalize loading/error constraints.

- [ ] T0719 Verify robust error state presentation on all auth forms
  - **Done when**: Bad logins/signups surface user-friendly, safe error text directly in the form UI.
- [ ] T0720 Verify global loading states during auth transitions
  - **Done when**: Form submissions block duplicate clicks via `useFormStatus` or similar disabled mechanisms.
