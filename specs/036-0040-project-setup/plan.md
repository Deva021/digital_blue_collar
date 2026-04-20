# Implementation Plan: Phase 4 — Project Setup and Technical Foundation

**Branch**: `036-0040-project-setup` | **Date**: 2026-04-20 | **Spec**: [spec.md](./spec.md)

## Summary

Translating the Phase 4 Technical Foundation spec into execution. Establish the Next.js App Router boundaries, basic shell components, clear folder hierarchy, and necessary DX tooling before initiating complex feature development.

## Implementation Approach

1. **Tooling & Validation**: Implement environment variable parsing/validation logic to fail fast during build or development startup.
2. **App Directory Structuring**: Establish core Next.js layout structures, encapsulating the public landing UI and the authenticated dashboard UI.
3. **Component Library Staging**: Standardize the UI folder root to differentiate between shared design system components (`src/components/ui`), feature-specific components (`src/components/features`), and layouts (`src/components/layouts`).
4. **Error & Loading Scaffolding**: Add `error.tsx` and `loading.tsx` at the root and group boundaries to establish the pattern for future routes.

## Environment Configuration Strategy

- Implement an explicit environment variable validation check (`src/env.mjs` or `src/lib/env.ts`).
- Ensure `next.config.ts` imports and triggers this validation, failing the build immediately if configuration is broken.

## Shared Helper Organization

- `src/lib/utils/`: Generic string/math/date utilities.
- `src/lib/supabase/`: Client and Server Supabase instances.
- `src/lib/types/`: Centralized TypeScript interfaces corresponding to database row shapes.

## Server/Client Boundary Approach

- Standardize on Server Components by default throughout `src/app`.
- Place `"use client"` explicit boundaries as low in the component tree as possible (e.g., interactive buttons, form elements) inside `src/components/features` or `src/components/ui`.
- Enforce that data fetching happens either in Server Components or dedicated Server Actions via `src/lib/actions/`. No direct `fetch` inside `useEffect` unless absolutely necessary for third-party libraries.

## Route-Group and Layout Strategy

- `src/app/(public)`: Routes unauthenticated users see (Home, About, Legal).
- `src/app/(auth)`: Dedicated authentication paths (Login, Signup).
- `src/app/(dashboard)`: Authenticated application shell paths.
- Each group will possess an explicit `layout.tsx` to handle standard UI chromes (like navbars) without muddying the root layout.

## File and Folder Impact

```text
src/
├── app/
│   ├── (auth)/
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   └── layout.tsx
│   ├── (public)/
│   │   └── layout.tsx
│   ├── error.tsx
│   ├── layout.tsx
│   ├── loading.tsx
│   └── page.tsx
├── components/
│   ├── layouts/
│   ├── ui/
│   └── features/
└── lib/
    ├── env.ts          # Env validation script
    ├── supabase/       # Client/server configs
    └── utils/          # Shared helpers
```

## Validation and Verification Approach

- **Compilation Check**: `npm run build` MUST compile cleanly. Any unhandled ESLint or TS errors should block the build.
- **Layout Rendering**: Root page effectively mounts a generic App Shell placeholder.
- **Environment**: Force a missing `.env` to trigger the `env.ts` failure, proving the fail-fast mechanism works.

## Risks and Mitigation

- **Risk**: Moving files triggers Git churn and potential merge conflicts.
  _Mitigation_: Restrict this phase strictly to creating folders and `layout.tsx` limits. Do not rewrite current generic components.
- **Risk**: Overwhelming the config setup.
  _Mitigation_: Implement minimum viable structure. Do not install heavy state managers (Redux, Zustand) or unnecessary abstractions unless natively required by App Router.

## Assumptions

- Next.js and typical dependencies (Next, React, Tailwind) are inherently established.
- The repository favors TypeScript strict mode globally.
