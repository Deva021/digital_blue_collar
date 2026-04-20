# Feature Specification: Phase 3.5 — Schema, Migrations, and Seeds

**Feature Branch**: `035-schema-migrations-seeds`  
**Created**: 2026-04-19  
**Status**: Draft

## Title

Phase 3.5 — Schema, Migrations, and Seeds

## Background

The Blue Collar Marketplace for Ethiopia will connect workers with customers for real-world services. Following product definition and information architecture, this phase aims to translate the agreed MVP data model into a realistic, durable database foundation.
Key architectural decisions dictate that we support users taking on dual roles (both worker and customer). Services support both direct bookings and job post applications. Pricing can be negotiable, worker availability is straightforward (available, busy, offline), text-based locations are prioritized for V1, and service categories are core to matching and filtering.

## Objective

The purpose of this phase is to establish a clean, practical, and MVP-ready database architecture for the marketplace. This includes designing the structure of the tables, enforcing relationships and constraints, preparing the initial SQL migration scripts, and creating a reliable seed dataset for testing and development. No implementation of API endpoints, routing, or UI views will happen in this phase.

## In Scope

- Translation of the conceptual data model into PostgreSQL tables (via Supabase).
- Design the `users`, profiles, jobs, bookings, reviews, and notification entities.
- Establishment of common id, timestamp, relationship, constraint, and index rules.
- Design of schema migrations for all core entities.
- Design of seed scripts, particularly emphasizing Ethiopian context for categories and sufficient mock data for features.

## Out of Scope

- Payment, escrow, and transaction entity modeling.
- Chat, messaging, and dispute schemas (these are future additions).
- Writing any application code (UI, APIs, server hooks).
- Writing the actual SQL statements (deferred to implementation planning).
- Third-party authentications schemas (except basic Supabase auth user linkage).

## Entity Overview

### `users`

- **Why it exists**: Core authentication and platform identity.
- **Role**: Ties everything together. A user can act as a worker, a customer, or both.
- **Relationships**: 1:1 with `customer_profiles`, 1:1 with `worker_profiles`. References Supabase's `auth.users` under the hood.

### `customer_profiles`

- **Why it exists**: Stores data specific to acting as a customer (e.g., location, preferences).
- **Role**: Enables users to post jobs and book workers directly.
- **Relationships**: Belongs to `users`. 1:M with `job_posts`. 1:M with `bookings`. 1:M with `reviews` (as reviewer).

### `worker_profiles`

- **Why it exists**: Stores data specific to providing services (e.g., bio, availability, verification status).
- **Role**: Enables users to offer services, appear in search, and apply to jobs.
- **Relationships**: Belongs to `users`. 1:M with `worker_services`. 1:M with `job_applications`. 1:M with `bookings`. 1:M with `worker_categories`.

### `service_categories`

- **Why it exists**: Core platform taxonomy for matching supply and demand.
- **Role**: Used by workers to list their abilities and by customers to post jobs or filter searches.
- **Relationships**: 1:M self-referential for parent/subcategory structure. 1:M with `worker_categories`. 1:M with `job_posts`.

### `worker_categories`

- **Why it exists**: Maps a worker to the categories they operate in.
- **Role**: Enabling filtering and targeted job notifications.
- **Relationships**: Many-to-Many junction between `worker_profiles` and `service_categories`.

### `worker_services`

- **Why it exists**: Defines specific, bookable offerings from a worker.
- **Role**: Allows a worker to set specific pricing (negotiable flag, base price) for a subcategory or distinct service.
- **Relationships**: Belongs to `worker_profiles`. Refers to `service_categories`. 1:M with `bookings` (optional, if booked directly).

### `job_posts`

- **Why it exists**: Allows customers to broadcast a need to the marketplace.
- **Role**: Creates a competitive bidding/application market for available workers.
- **Relationships**: Belongs to `customer_profiles`. Refers to `service_categories`. 1:M with `job_applications`. 1:1 with `bookings` (if fulfilled).

### `job_applications`

- **Why it exists**: Represents a worker's interest and proposed price for a specific job post.
- **Role**: Connects supply to demand.
- **Relationships**: Belongs to `worker_profiles`. Belongs to `job_posts`.

### `bookings`

- **Why it exists**: The central entity tracking an agreed service delivery.
- **Role**: Records the final contract, price, schedule, and status between a customer and a worker.
- **Relationships**: Belongs to `customer_profiles`. Belongs to `worker_profiles`. Optional reference to `job_posts` or `worker_services`. 1:1 with `reviews`.

### `reviews`

- **Why it exists**: Trust and reputation system.
- **Role**: Captures customer feedback on completed bookings.
- **Relationships**: Belongs to `customer_profiles` (reviewer). Belongs to `worker_profiles` (reviewee). Belongs to `bookings`.

### `verification_requests`

- **Why it exists**: Managing trust and legal compliance.
- **Role**: Tracks the status of identity or document verifications for workers.
- **Relationships**: Belongs to `worker_profiles`.

### `notifications`

- **Why it exists**: Alerting users of important state changes.
- **Role**: Notifies about job applications, booking updates, and verification status changes.
- **Relationships**: Belongs to `users` (as recipient). Polymorphic entity relation or loose JSON references to relevant entities.

## Relationship Rules

- **Referential Integrity**: All foreign keys must enforce appropriate `ON DELETE` referential actions. Core entities like `users` deleting should cascade smoothly to profiles, while deleting a `service_category` might be restricted if in use.
- **Dual Role Logic**: A user ID remains constant. The system checks `customer_profiles` or `worker_profiles` to authorize specific role actions.

## Common Field Expectations

- **IDs**: Use UUIDv4 universally over auto-incrementing integers for security and distributed flexibility.
- **Timestamps**: All tables must include `created_at` and `updated_at` (managed via triggers). Core tables might include soft deletes (`deleted_at`).
- **Nullability Principle**: Data should be `NOT NULL` by default. Only realistically optional fields (e.g., a secondary address line, an optional `latitude`/`longitude`, or an unfilled `cancellation_reason`) should be nullable.
- **Enums/Statuses**: Use Postgres Enums or simple text constraints for known finite statuses:
  - Worker Availability: `available`, `busy`, `offline`
  - Booking Status: `pending`, `accepted`, `in_progress`, `completed`, `cancelled`
  - Application Status: `pending`, `accepted`, `rejected`, `withdrawn`
  - Job Post Status: `open`, `in_progress`, `closed`, `cancelled`
  - Verification Status: `unverified`, `pending`, `verified`, `rejected`
- **Indexes**: Implement high-level indexing on all Foreign Keys, frequently queried lookup fields (e.g., User IDs, Location text, active statuses).

## Migration Rules

- Schema definition must be written purely in SQL specifically for Supabase.
- Migrations should enforce Row Level Security (RLS) tables, assigning basic restrictive policies for MVP (even if just `false` defaults).
- Migrations must be sequential and cleanly roll-backable during development.

## Seed Rules

- **Development Support**: Seeds must reset database state completely and inject enough data to immediately start clicking around the UI with no setup.
- **Ethiopia-Focused Categories**: Must inject realistic initial service categories (e.g., basic structure like "Home Services" -> "Plumbing", "Electrical"; "Domestic Help" -> "Injera Baking", "Laundry"; "Agriculture" -> "Harvesting Labor", "Plowing").
- **Mock Entities**: Include 1 Admin user, 2 Customer users, 2 Worker users, 1 Dual-role user. Include roughly 3-5 open job posts and a spread of worker services.

## Acceptance Criteria

- [ ] The schema correctly translates the listed entity overview into robust table designs.
- [ ] No payment, messaging, or dispute schemas are included.
- [ ] Foreign Keys, Constraints, and Defaults are correctly defined.
- [ ] Enums are mapped to the defined states correctly.
- [ ] Seed script successfully runs against local Supabase instance without errors.
- [ ] The seeded categories feature a reasonable parent/subcategory hierarchy referencing real-world Ethiopian use cases.

## Risks / Open Questions

- **Location strategy**: Should `location_text` be centralized into a `locations` table or kept fully duplicated on profiles and jobs for V1? (Assuming duplicated string text for V1 simplicity).
- **Job matching query performance**: As the table grows, text-matching jobs to workers might get slow. Standard indexes should suffice but requires monitoring.

## Definition of Done

- Complete implementation plan generated based on the specification.
- Local definitions mapping to `supabase/migrations/` and `supabase/seed.sql` prepared.
- Seed logic allows reproducible test environments.
