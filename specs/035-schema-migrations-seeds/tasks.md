# Tasks: Phase 3.5 — Schema, Migrations, and Seeds

**Input**: Design documents from `/specs/035-schema-migrations-seeds/`
**Prerequisites**: `spec.md`, `plan.md`

## Phase 1: Setup & Conventions (Infrastructure)

**Purpose**: Establish common rules and core reference tables.

- [x] T001 [P] Define Common PostgreSQL Enums (AvailabilityStatus, ApplicationStatus, BookingStatus, JobStatus, VerificationStatus)
  - **Done when**: `supabase/migrations/[TIMESTAMP]_initial_schema.sql` contains `CREATE TYPE` statements for all 5 enums.
- [x] T002 Implement `updated_at` trigger function and helper
  - **Done when**: Migration file contains `moddatetime` extension or custom trigger function for handling `updated_at`.
- [x] T003 [P] Create `service_categories` table (Self-referential)
  - **Done when**: Table exists with `id` (UUID), `name`, `parent_id` (FK to self), `is_active` (Bool), and `description`.

---

## Phase 2: Core Identity & Profiles (The "Dual-Role" Foundation)

**Purpose**: Implement the user and profile entities.

- [x] T004 Create `users` table linked to `auth.users`
  - **Done when**: Table exists with `id` (FK to auth.users), `email`, and `created_at`.
- [x] T005 Create `worker_profiles` table
  - **Done when**: Table exists with `id` (FK to users), `bio`, `availability_status` (Enum), `location_text`, and optional `latitude`/`longitude`.
- [x] T006 Create `customer_profiles` table
  - **Done when**: Table exists with `id` (FK to users), `location_text`, and optional `latitude`/`longitude`.
- [x] T007 Create `worker_categories` junction table
  - **Done when**: Many-to-many table links `worker_profiles` and `service_categories`.
- [x] T008 [P] Create `worker_services` table
  - **Done when**: Table exists linking `worker_profiles` to specific `service_categories` with `base_price` and `is_negotiable`.

---

## Phase 3: Market Activity & Trust (The Marketplace Engine)

**Purpose**: Implement job posts, applications, and bookings.

- [x] T009 Create `job_posts` table
  - **Done when**: Table exists linking `customer_profiles` to `service_categories` with `status` (Enum) and `budget_range`.
- [x] T010 Create `job_applications` table
  - **Done when**: Table exists linking `worker_profiles` to `job_posts` with `proposed_price` and `status` (Enum).
- [x] T011 Create `bookings` table
  - **Done when**: Table exists linking `worker_profiles` and `customer_profiles` with `status`, `final_price`, and `scheduled_at`.
- [x] T012 Create `reviews` table
  - **Done when**: Table exists linking `bookings` with `rating` (1-5) and `comment`.
- [x] T013 [P] Create `verification_requests` table
  - **Done when**: Table exists for workers to submit ID/docs with `status` (Enum).
- [x] T014 [P] Create `notifications` table
  - **Done when**: Table exists for `users` with `is_read` and JSONB `payload`.

---

## Phase 4: Seeds (Ethiopia-Focused Utility)

**Purpose**: Populate the DB with realistic data for development.

- [x] T015 Seed `service_categories` with Ethiopia-specific service hierarchy
  - **Done when**: `supabase/seed.sql` contains `Injera Baking`, `Harvesting Labor`, `Plastering`, etc.
- [x] T016 Seed Mock Users (Admin, Worker, Customer, Dual-role)
  - **Done when**: `seed.sql` creates valid entries in `auth.users`, `users`, and profiles.
- [x] T017 Seed Sample Market Data (Job posts and services)
  - **Done when**: `seed.sql` includes active jobs and worker service listings for testing search/matching.

---

## Phase 5: Verification & Constraints

**Purpose**: Ensure the schema is robust and correctly configured.

- [x] T018 Apply Row Level Security (RLS) base policies
  - **Done when**: Migration includes `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` and basic `authenticated` user policies.
- [x] T019 Create Foreign Key Indexes
  - **Done when**: Migration includes `CREATE INDEX` on all FK columns and frequently searched text columns.
- [x] T020 Run Final Migration + Seed validation loop
  - **Done when**: `supabase db reset` runs locally without errors and data appears correctly in Supabase Studio.

---

## Dependencies & Execution Order

1. **Infrastructure (Phase 1)**: Must be done first.
2. **Identity (Phase 2)**: Depends on Phase 1.
3. **Market (Phase 3)**: Depends on Phase 2.
4. **Seeds (Phase 4)**: Depends on completion of Phases 1-3.
5. **Verification (Phase 5)**: Can be integrated into migrations or run as final cleanup.

---

## Notes

- **UUID Usage**: Ensure all `id` columns use `uuid DEFAULT gen_random_uuid()`.
- **Timestamps**: Ensure all tables have `created_at` and `updated_at`.
- **Location**: Use `text` for `location_text` and `numeric(10, 8)` for lat/lng.
