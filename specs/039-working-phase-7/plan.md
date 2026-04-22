# Implementation Plan: Phase 7 — Authentication

**Branch**: `039-working-phase-7` | **Date**: 2026-04-22 | **Spec**: [specs/039-working-phase-7/spec.md](file:///home/dawa/Documents/digital-blue-collar/specs/039-working-phase-7/spec.md)
**Input**: Feature specification from `/specs/039-working-phase-7/spec.md`

## Summary

This phase establishes the foundational authentication system for Blue Collar Marketplace using Supabase Auth. It will introduce user entry flows (signup, login, forgot password) and implement basic session management, access control boundaries through route protection, and auth redirection rules securely.

## Technical Context

**Language/Version**: TypeScript, Next.js (App Router)
**Primary Dependencies**: `@supabase/ssr` (or auth-helpers-nextjs), `lucide-react`, Tailwind CSS
**Storage**: PostgreSQL via Supabase Auth
**Testing**: Jest / Playwright plus manual validation testing
**Target Platform**: Web Client
**Project Type**: Next.js Web App

## Core Approach

### 1. Server/Client Boundary Considerations

- **Server Components**: Used to handle session retrieval and protected route checks at the layout level cleanly.
- **Client Components**: Only utilized for complex interactivity (Auth Forms, Toast notifications) ensuring Next.js Server Actions execute securely over the wire.
- **Middleware**: Use Next.js Middleware to ensure fast, boundary-level redirect logic for unauthenticated users accessing protected paths, preventing flashes of content.

### 2. Authentication Helper Usage Strategy

- We will leverage standard Next.js + Supabase Auth helpers to create standardized database/auth clients across Server Actions, API Routes, Middleware, and Client Components.

### 3. Session Handling Approach

- Session state will rely on secure HTTP-only cookies managed directly by Supabase helpers.
- Auth change listeners (`onAuthStateChange`) will be placed in a top-level provider if needed to ensure the client-side session remains synchronized with the server's cache without triggering UI flickering.

### 4. Auth Page Structure Approach

- **`/login`**: Standard credential login.
- **`/signup`**: Core signup logic (deferring role choice as specified in Phase 7 scope).
- **`/forgot-password`**: Email submit for recovery flow.
- Ensure all forms use robust React Hook Form + Zod combo (or strict vanilla form actions) with server validation to comply with the MVP philosophy.

### 5. Protected Route & Redirect Approach

- Unregistered users hitting specific protected dashboard paths will be intercepted and redirected to `/login`.
- Authenticated users attempting to view `/login` or `/signup` will be automatically redirected to a safe internal fallback path (e.g., `/` or `/dashboard`).

### 6. Error & Loading Handling Approach

- Implementation of safe pending states using React `useFormStatus` and inline error messages using explicit UI components.
- Display generic, safe feedback for sensitive actions to prevent user enumeration (e.g. "If an account exists, a recovery email has been sent").

### 7. Validation Strategy

- Leverage Server Actions for robust server-side input validation mapping back to the client.
- All email inputs will be thoroughly typed and validated. Password strength will be enforced up to Supabase standard defaults.

## Constraints & Assumptions

- **Constraint**: Strict omission of role-based profiles (Worker/Customer) during auth execution until later phases.
- **Assumptions**: The Supabase Instance configuration is already functioning locally via `.env.local` keys; Phase 5 UI components are functional.

## Project Structure (File/Folder Impact)

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   └── (protected)/
│       └── layout.tsx
├── components/
│   └── auth/           # Shared forms and helpers
│       ├── login-form.tsx
│       ├── signup-form.tsx
│       └── forgot-password-form.tsx
├── lib/
│   └── supabase/
│       ├── client.ts   # Browser client init
│       ├── server.ts   # Server client init
│       └── middleware.ts # Edge client init
└── middleware.ts       # Global routing bounds
```

## Risks and Mitigations

- **Risk**: Auth mismatch between server rendering and client state causing "flash of unauthenticated content".
  - **Mitigation**: Handle top-level validation in Middleware where applicable, blocking the unauthenticated render completely.

## Verification / Manual Test Plan

1. **Service Init**: Start up local Supabase and Next.js Dev Server (`npm run dev`).
2. **Login Validation**: Navigate to `/login` manually. Attempt incorrect login and validate standard form format error rendering.
3. **Signup**: Complete `/signup` flow with new credentials.
4. **Active Session Redirects**: Try to navigate back to `/login` after successful authentication to ensure redirect back away from the auth screen.
5. **Route Protection**: Open an incognito window and attempt to hit a route grouped inside the `(protected)` directory. Validate it kicks you forcefully to `/login`.
