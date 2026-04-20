# Implementation Plan: Phase 3.5 — Schema, Migrations, and Seeds

**Branch**: `035-schema-migrations-seeds` | **Date**: 2026-04-19 | **Spec**: [spec.md](./spec.md)

## Summary

The goal of this phase is to build the foundational database architecture for the Blue Collar Marketplace in Supabase. This involves translating a dual-role user model (Worker/Customer), category-driven service matching, and booking/review systems into a practical PostgreSQL schema. The focus is on a migration-first workflow using standard PostgreSQL features (Enums, UUIDs, RLS, Triggers) and providing an Ethiopia-centered seed dataset for immediate developer utility.

## Technical Approach

### 1. Supabase/Postgres Integration

- **Migration-First**: All changes using `supabase/migrations` scripts.
- **UUIDs**: Primary keys will use `gen_random_uuid()` to ensure global uniqueness and easier mobile sync in the future.
- **RLS (Row Level Security)**: Initialize basic RLS policies for all tables. By default, tables will be restricted to `authenticated` users, with owner-based write permissions.

### 2. Dual-Role User Architecture

- One `users` table as the central pivot.
- Two optional profile tables: `worker_profiles` and `customer_profiles`.
- A user is a "Worker" if they have a record in `worker_profiles`.
- A user is a "Customer" if they have a record in `customer_profiles`.
- This avoids role-flag pollution on the main user record and allows role-specific extensions without bloat.

### 3. Service & Category Logic

- `service_categories`: A tree structure using a nullable `parent_id` foreign key.
- `worker_categories`: A junction table for many-to-many mapping, enabling workers to list multiple skills.
- `job_posts`: References a single category (the primary category the job belongs to).

### 4. Location Handling

- `location_text` (String): The primary city/neighborhood text (e.g., "Addis Ababa, Bole").
- `latitude`/`longitude` (Decimal): Included but nullable, reserved for future map/GPS features.

## Database Object Strategy

### Table Creation Sequencing

1.  **Reference Data**: `service_categories`.
2.  **Identity**: `users` (linked to `auth.users`).
3.  **Profiles**: `worker_profiles`, `customer_profiles`.
4.  **Skills**: `worker_categories`, `worker_services`.
5.  **Market Activity**: `job_posts`, `job_applications`, `bookings`.
6.  **Trust & Communication**: `reviews`, `verification_requests`, `notifications`.

### Enums & Statuses

- **AvailabilityStatus**: `available`, `busy`, `offline`
- **ApplicationStatus**: `pending`, `accepted`, `rejected`, `withdrawn`
- **BookingStatus**: `pending`, `accepted`, `in_progress`, `completed`, `cancelled`
- **VerificationStatus**: `unverified`, `pending`, `verified`, `rejected`

### Indexing strategy

- B-tree indexes on all foreign keys (for join performance).
- Indexes on `service_categories.parent_id`.
- Composite indexes on `worker_profiles(availability_status, location_text)` for search optimization.
- Index on `job_posts(status, category_id)`.

## Seed Strategy

### Development Seeds (`seed.sql`)

1.  **Categories**: Comprehensive list of Ethiopia-specific services (Baking, Plastering, Plowing, etc.) using a 2-level hierarchy.
2.  **Test Users**:
    - `admin@example.com` (Admin role if applicable).
    - `worker_1@example.com` (Purely worker).
    - `customer_1@example.com` (Purely customer).
    - `hybrid_1@example.com` (Both profiles).
3.  **Mock Data**: Sample job posts in "Plumbing" and "General Labor" to test the feed immediately.

## File Impact

```text
supabase/
├── migrations/
│   └── 20260419000000_initial_schema.sql  # Combined primary schema
├── seed.sql                                # Ethiopia-focused mock data
└── tests/
    └── schema-validation.test.sql           # Basic existence/constraint checks
```

## Validation and Test Strategy

- **Migration Spin-up**: Run `supabase db reset` locally to verify the schema compiles and seeds correctly.
- **Referential Integrity Checks**: Attempt to delete a category used by a worker to ensure `ON DELETE RESTRICT` or `CASCADE` works as planned.
- **RLS Verification**: Verify that a user cannot update another user's profile via standard Supabase client calls.

## Risks and Mitigations

- **Complexity of Dual Profile**: Application logic must check for existence of BOTH profiles to show a "Switch mode" UI.
- **Location Fragmentation**: Using text labels for location can lead to "Addis Ababa" vs "Addis" issues. _Mitigation_: Start with simple seeds and transition to a reference table or selection UI in later phases.
- **RLS Overhead**: Complex policies can slow down queries. _Mitigation_: Keep policies simple (basic ownership) initially.

## Implementation Notes

- Use standard Postgres triggers for `updated_at` management.
- Ensure all IDs are type `uuid`.
- Categories should have an `is_active` boolean for platform-wide administrative disabling.
- Job postings should have a JSONB `metadata` field for flexible future-proofing (extra labor requirements, special tools).
