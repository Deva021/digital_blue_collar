# Blue Collar Marketplace Constitution

## Core Philosophy & Mission

A mobile-first platform connecting workers and customers for real-world services like agriculture, labor, home services, and more.

- Simplicity over complexity
- Trust-first system
- Category-driven matching
- Ethiopia-first design

## Engineering Principles

- **Clarity over Cleverness**: Code must be readable and easy to understand.
- **Simple First**: Start with the simplest solution and iterate. MVP approach.
- **Correctness**: Code must be accurate and robust.
- **Testing**: Tests are mandatory to ensure functionality and prevent regressions.

## Security Baseline

- **Authorization by Default**: All access must be authorized unless explicitly public.
- **Validate Inputs**: All incoming data, whether from clients or third parties, must be strictly validated.
- **Least Privilege**: Components and users should only have the permissions necessary to perform their function.

## DX Conventions

- **File Naming & Folder Structure**: Standardize naming according to the established Next.js App Router structure.
- **Commit Hygiene**: Clean, descriptive, and atomic commits.

## Documentation Expectations

- `spec.md`, `plan.md`, and `tasks.md` are the source of truth for features and must be continuously updated. Keep documentation aligned with the SDD Workflow.

## Performance Expectations

- **Avoid N+1 Queries**: Ensure database data fetching is optimized.
- **Pagination**: Implement pagination for lists and sets of items.
- **Indexes**: Apply database indexes where needed to support performance.

## Repo-Specific Defaults

- **Supabase Architecture**: Next.js + Supabase. All Supabase access must go through Next.js API routes or Server Actions. Web and Flutter clients never talk to Supabase directly.
- **Prompt Engineering**: Prefer concise editor prompts. Avoid huge documentation blocks in prompts; keep explanations in chat summaries.

## User-provided constraints

- **Technology Stack**: Next.js (App Router, TypeScript), Supabase (PostgreSQL, Auth, Storage), Tailwind CSS.
- **Architecture**: Frontend: Next.js App Router; Backend: Server Actions + Supabase; Database: PostgreSQL.
- **Core Features**: Worker profiles, Customer job posting, Service listings, Booking system, Reviews and verification.
- **Data Model Overview**:
  - Key tables: users, worker_profiles, customer_profiles, service_categories, worker_categories, worker_services, job_posts, bookings, reviews.
- **Matching Logic**: Workers receive jobs based on selected categories.
- **Booking Flow**: Customer → request → worker accepts → job → review.
- **Folder Structure**: src/, app/, features/, components/, lib/, server/.
- **Development Phases**: Foundation, Auth, Categories, Jobs, Booking, Reviews, Notifications, Admin.
- **SDD Workflow**: spec.md → plan.md → tasks.md → implementation.
- **Future Features**: Maps, Payments, AI matching.

**Version**: 1.0.0 | **Ratified**: 2026-04-18
