# Implementation Plan: Phase 5 — Design System and UI Foundation

**Branch**: `037-0050-design-system`  
**Date**: 2026-04-20  
**Spec**: [spec.md](./spec.md)

## Summary

Translating the Phase 5 specification into a practical React/Tailwind UI foundation. The focus is to build reusable, agnostic components (`Button`, `Input`, `Card`, etc.) relying on standard Tailwind utility classes to ensure responsive, accessible, and consistent feature scaling for later phases.

## Implementation Approach

1. **Helper & Dependencies**: Install integration utilities (`clsx`, `tailwind-merge`) and `lucide-react` for standard iconography. Create a `cn` merging helper.
2. **Token Integration**: No heavy modification to `tailwind.config.ts` is strictly necessary if standard color scales fit; however, adopting unified semantic naming conventions across primitives is enforced.
3. **Primitive Scaffolding**: Build foundational interactive elements from atomic (Buttons, Inputs, Badges, Spinners) to structural (Containers, Cards).

## Component Organization Strategy

- Components strictly live in `src/components/ui/` to denote they are generic primitives.
- Feature logic must never leak into the `ui/` directory. All components here should be stateless presenters receiving native HTML props or strongly typed interfaces.

## Shared Styling / Token Approach

- Use Tailwind's default spacing and typography scales for predictability.
- Rely on explicit utility chaining for specific interactive pseudo-states (e.g., `hover:bg-blue-700`, `focus-visible:ring-2`) rather than abstracted `@apply` blocks to keep source-of-truth visible in the TSX.

## Layout / Container Strategy

- Implement a rigid `Container` layout wrapper ensuring `max-w-7xl mx-auto px-4 sm:px-6` constraints for page bodies.
- Ensure all custom cards and boundaries default to full width `w-full` rather than fixed pixels to enforce mobile-fluid responses shrink logic.

## Feedback State Strategy

- **Loading**: Implement a generic `Spinner` replacing plain text "Loading...", and standard tailwind `animate-pulse` utilities applied natively when needed.
- **Empty**: Provide a highly reusable `EmptyState` pattern (icon, heading, detail text) preventing awkward blank pages.
- **Form states**: Input components natively support standard validation styling rings on error.

## Accessibility Approach

- Provide sensible defaults mapping standard ARIA attributes (`aria-invalid` automatically applied inside inputs when an error prop exists).
- `focus-visible` bindings replace default unstyled focus boxes, ensuring keyboard users never lose track of their position.

## Responsive Behavior Approach

- Adopt a mobile-first philosophy internally on component prop limits. Base interactive elements (like `Button` or `Input`) demand `min-h-[40px]` touch targets locally.

## File and Folder Impact

```text
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── spinner.tsx
│   │   └── empty-state.tsx
│   └── layouts/
│       └── container.tsx
└── lib/
    └── utils/
        └── cn.ts           # tailwind-merge helper
```

## Validation and Verification Approach

- **Component Showcase**: Scaffold a temporary dev-only route (`src/app/(public)/design/page.tsx`) mapping each primitive with variant combinations (e.g. Disabled Button, Outline Button, Error Input). Visually verify rendering.
- **Compilation Check**: Verify TS strict types successfully build via standard Next.js pipeline verification logic `npm run typecheck` or `npm run build`.

## Risks and Mitigation

- **Risk**: Component API complexity bloats quickly as edge cases appear.
  _Mitigation_: Restrict variants heavily. (e.g. `variant='primary' | 'secondary' | 'outline' | 'ghost'`). Reject hyper-specific props (e.g. `leftIconMarginPx`).
- **Risk**: Specific color dependencies drift from blue-collar branding.
  _Mitigation_: Preemptively standardize on Tailwind's default robust palettes (`blue-600` for primary) keeping the MVP strict.

## Assumptions

- Minimalist open-source structural conventions (similar conceptually to Radix/shadcn-ui) are desired over loading an arbitrary bulky material component suite.
- Standard React features (`React.HTMLAttributes<HTMLDivElement>`) will be cleanly forwarded to internal HTML nodes via `...props` structuring.
