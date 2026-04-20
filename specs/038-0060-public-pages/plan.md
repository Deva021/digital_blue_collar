# Implementation Plan: Phase 6 — Public Pages

**Branch**: `038-0060-public-pages` | **Date**: 2026-04-20 | **Spec**: [spec.md](./spec.md)

## Summary

Translating the Phase 6 specification into an actionable React Router tree under `src/app/(public)`. The overarching strategy is aggressively reusing Phase 5 primitives while strictly isolating all listings and logic inside local hardcoded mock shapes.

## Page Implementation Approach

- Use standard React Functional Server Components by default.
- Pages will map strictly to specific segment folders: `/about`, `/how-it-works`, `/categories`, `/workers`, `/jobs`, `/faq`.
- Define local static JSON array constants mapping to the database schemas at the top of the relevant `page.tsx` files to mock network fetch results (e.g., `const MOCK_JOBS = [{ id: 1, title: 'Need Plumber'...}]`).

## Route Structure Usage

All routes will reside statically nested inside `src/app/(public)` to automatically inherit the global public UI bindings.

- `src/app/(public)/page.tsx` -> Replaces the current minimal placeholder with a rich Hero/Home orientation page.
- `src/app/(public)/[segment]/page.tsx` -> Dedicated modular folders mapping the primary navigation endpoints.

## Layout Usage & Navigation Strategy

- Overhaul `src/app/(public)/layout.tsx` (the header/footer currently built in Phase 4) making it fully robust.
- Isolate responsive mobile-menu state (`useState`) to a dedicated Client `<MobileNav />` component included in the layout.
- The Footer will be expanded to hardcode standard mapped site links (Privacy, Terms, Contact).

## Placeholder Data Strategy

- Static constants will shape schemas aligned identically with the Phase 3.5 PostgreSQL structural outputs.
- Example: `{ id: 'uuid', worker_id: 'uuid', category_id: 'uuid', title: 'Farm Helper', ... }`. We map these tightly into the Phase 5 interactive Cards natively.

## Component Reuse Strategy (from Phase 5)

- Leverage `<Container>` comprehensively wrapping all block areas ensuring max-width adherence globally.
- Use `<Button>` for all CTA interactions ("Post a Job", "Find Workers").
- Leverage `<Card>` primitive heavily for list maps (e.g., Worker Profiles array `.map()` rendered inside `<Card>`).
- Inject `<Badge>` identically styling category tags (e.g., `<Badge variant="outline">Agriculture</Badge>`).

## Responsive / Mobile-First Behavior

- Rely inherently on Tailwind's mobile-first breakpoints (e.g., `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for arrays).
- Ensure CTAs remain fully actionable prioritizing thumb reach bounds across 320px viewport restrictions.

## File and Folder Impact

```text
src/
└── app/
    └── (public)/
        ├── layout.tsx         # Updated global public nav/footer
        ├── page.tsx           # Overhauled Home/Hero
        ├── about/page.tsx
        ├── how-it-works/page.tsx
        ├── categories/page.tsx
        ├── workers/page.tsx
        ├── jobs/page.tsx
        └── faq/page.tsx
```

## Validation and Verification Approach

- **Visual Inspection**: Click entirely through the Header links globally verifying they land on completely rendered generic endpoints.
- **Responsive Check**: Compress viewport boundings verifying horizontal shiftings map without breakage correctly utilizing tailwind `md` limits.
- **Build Pass**: `npm run build` must statically compile these folders perfectly passing existing type checking barriers zero mock API intercept warnings.

## Risks and Mitigation

- **Risk**: Statically Mocked arrays heavily duplicate HTML/TSX if directly pasted across pages.
  _Mitigation_: Rather than building an abstracted central generic mock module, mock directly inside the consuming `page.tsx` files. This ensures zero data coupling risk for later Phases when real RPC hooks must overwrite them natively.
- **Risk**: Client-rendering `useState` hooks pollute layout SSR patterns.
  _Mitigation_: Add `"use client"` exclusively limited strictly to isolated components (like `<MobileMenuTrigger />`), keeping layout rendering SSR optimal.

## Assumptions

- Generic icons will continue invoking `lucide-react`.
- No image uploads or rich media are active. Standard placeholder URLs (via generic image generators) map avatar representations safely.
