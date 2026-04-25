# Tasks: Phase 13 - Job Posting

**Input**: Design documents from `specs/0130-job-posting/`  
**Prerequisites**: `plan.md`, `spec.md`

## Phase 1: Setup & API Foundation

**Purpose**: Core validation and database access services required for job mutations.

- [ ] T001 Create `src/lib/validations/job.ts` providing the Zod schema for Job Posting based on DB constraints
- [ ] T002 Create `src/lib/services/jobs.ts` to house job data access functions
- [ ] T003 Implement `createJobPost` server action handling auth payload extraction and Zod parsing
- [ ] T004 Implement `getCustomerJobs` fetcher for fetching user's own jobs
- [ ] T005 Implement `getJobPostById` fetcher ensuring row-level customer restriction

**Checkpoint**: Zod validations are defined, and basic data fetching logic executes without crashing.

---

## Phase 2: User Story 1 - Create a Job Post (P1)

**Goal**: Customer has a functional form allowing job creation.

- [ ] T006 Build base `<JobPostForm>` structure in `src/components/jobs/JobPostForm.tsx` anchoring to react-hook-form
- [ ] T007 Implement standardized `title` (text) and `description` (textarea) fields
- [ ] T008 [P] Implement Category Selection field querying `getActiveCategories()` dynamically
- [ ] T009 [P] Implement Location text field
- [ ] T010 Implement Budget fields (`budget_range` and `is_negotiable` toggle)
- [ ] T011 [P] Implement `workers_needed` field (number input)
- [ ] T012 Connect `<JobPostForm>` submission to the `createJobPost` server action along with loading/success toast states
- [ ] T013 Create the creation page frame at `src/app/(protected)/dashboard/jobs/new/page.tsx` wrapping the form

**Checkpoint**: User can navigate to the "New Job" URL, submit a valid form, and verify new row creation in Supabase.

---

## Phase 3: User Story 2 - View Active Jobs List (P1)

**Goal**: Customers can view jobs they have dispatched.

- [ ] T014 Build `src/app/(protected)/dashboard/jobs/page.tsx` resolving `getCustomerJobs(customerId)`
- [ ] T015 Create localized `<DashboardJobList>` rendering standard card previews containing Job details
- [ ] T016 Add a distinct Status Badge logic inside `<DashboardJobList>` to signify "Open", "Filled", or "Closed"
- [ ] T017 Integrate standard `<EmptyState>` when the user has zero jobs, pointing to "Post a new job"
- [ ] T018 Integrate `<Loading>` skeleton for the Jobs list (`src/app/(protected)/dashboard/jobs/loading.tsx`)
- [ ] T019 Update `DashboardNav.tsx` embedding a "My Jobs" persistent menu link

**Checkpoint**: Users dashboard successfully lists jobs specific to the authorized user visually.

---

## Phase 4: User Story 3 - View Job Details (P2)

**Goal**: Users can double click a job entering a detailed management view.

- [ ] T020 Build detail path frame at `src/app/(protected)/dashboard/jobs/[id]/page.tsx` resolving `getJobPostById`
- [ ] T021 Render comprehensive Job detail readably (incorporating budget, location, worker count visually)
- [ ] T022 Implement 404 boundaries or fallback error handling if job ID fetches null or unauthorized data
- [ ] T023 Implement detail `<Loading>` skeleton substituting content gracefully
- [ ] T024 Embellish `<ErrorBoundary>` states (`src/app/(protected)/dashboard/jobs/error.tsx`) catching hard fetching failures gracefully

**Checkpoint**: Deep linking to a specific job ID fully populates all form metadata securely.
