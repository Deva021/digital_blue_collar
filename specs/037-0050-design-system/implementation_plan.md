# Implementation Workflow Plan: Phase 5 UI Foundation

## Components to build

1. **Utilities & Tokens**:
   - `src/lib/utils/cn.ts`
   - `src/app/globals.css` (Tailwind v4 tokens)
2. **Layouts**:
   - `src/components/layouts/container.tsx`
3. **Primitives**:
   - `src/components/ui/button.tsx`
   - `src/components/ui/card.tsx`
   - `src/components/ui/input.tsx`
   - `src/components/ui/label.tsx`
   - `src/components/ui/textarea.tsx`
   - `src/components/ui/select.tsx`
   - `src/components/ui/badge.tsx`
   - `src/components/ui/spinner.tsx`
   - `src/components/ui/empty-state.tsx`
   - `src/components/ui/modal.tsx`
   - `src/components/ui/toast.tsx`
4. **Testing**:
   - `src/app/(public)/design/page.tsx`

## Commands to run

- `npm install clsx tailwind-merge lucide-react`
- `npm run lint`
- `npm run build`
