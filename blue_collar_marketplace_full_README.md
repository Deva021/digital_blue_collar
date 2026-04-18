# 🛠️ Blue Collar Marketplace (Ethiopia)

## 📌 Overview

This project is a production-grade digital marketplace connecting Ethiopian blue-collar workers with customers.

It is designed specifically for:

- Informal labor markets
- Agriculture-based work
- Local trust-based hiring systems
- Low-tech mobile users

---

## 🎯 Core Principles

1. Dual Marketplace

- Workers offer services
- Customers post jobs

2. Category-Based Matching

- Workers select multiple categories
- Jobs are matched and filtered based on categories

3. Trust Layer

- Reviews
- Verification
- History tracking

4. Ethiopia-First Design

- Injera baking, farm labor, laundry, etc.
- Mobile-first UX
- Simple workflows

---

## 🏗️ Full System Architecture

Frontend:

- Next.js (App Router)
- TypeScript
- Tailwind CSS

Backend:

- Next.js API Routes / Server Actions

Database:

- PostgreSQL (Supabase recommended)

Auth:

- OTP / phone-first authentication

Storage:

- Supabase Storage / Cloudinary

---

## 🧱 Complete Project Structure

```
blue-collar-marketplace/
│
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── categories/
│   │   │   └── [slug]/page.tsx
│   │   ├── workers/
│   │   │   └── [id]/page.tsx
│   │   ├── jobs/
│   │   │   └── [id]/page.tsx
│   │   └── about/page.tsx
│
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── verify/page.tsx
│
│   ├── (dashboard)/
│   │   ├── customer/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── jobs/page.tsx
│   │   │   ├── bookings/page.tsx
│   │   │   └── profile/page.tsx
│   │   │
│   │   ├── worker/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── services/page.tsx
│   │   │   ├── jobs/page.tsx
│   │   │   ├── bookings/page.tsx
│   │   │   └── profile/page.tsx
│   │   │
│   │   └── admin/
│   │       ├── dashboard/page.tsx
│   │       ├── users/page.tsx
│   │       ├── categories/page.tsx
│   │       └── reports/page.tsx
│
│   ├── api/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── workers/
│   │   ├── jobs/
│   │   ├── bookings/
│   │   ├── reviews/
│   │   └── notifications/
│
│   └── layout.tsx
│
├── components/
│   ├── ui/
│   ├── forms/
│   ├── cards/
│   ├── layout/
│   └── modals/
│
├── lib/
│   ├── db/
│   ├── auth/
│   ├── validations/
│   └── utils/
│
├── hooks/
├── types/
├── constants/
├── public/
├── styles/
├── .env
├── package.json
└── README.md
```

---

## 🗄️ Database Schema (Final)

### users

- id
- phone_number
- email
- password_hash
- is_active
- is_admin
- timestamps

### worker_profiles

### customer_profiles

### service_categories (with is_active)

### worker_categories (NEW core table)

### worker_services

### job_posts

### job_applications

### bookings

### reviews

### verification_requests

### notifications

---

## 🔥 Core Features

### Worker Side

- Create profile
- Select categories
- Add services
- Receive job notifications
- Accept/reject bookings

### Customer Side

- Browse workers
- Post jobs
- Request services
- Review workers

---

## 🔄 Marketplace Flow

1. Worker selects categories
2. Customer posts job
3. Matching happens via category
4. Worker applies OR customer books directly
5. Booking created
6. Job completed
7. Review added

---

## 🚀 Development Phases

Phase 1 — Product Definition  
Phase 2 — Architecture  
Phase 3 — Data Model  
Phase 4 — Setup  
Phase 5 — UI System  
Phase 6 — Public Pages  
Phase 7 — Auth  
Phase 8 — Worker Profile  
Phase 9 — Customer Dashboard  
Phase 10 — Services  
Phase 11 — Search  
Phase 12 — Booking  
Phase 13 — Job Posting  
Phase 14 — Messaging  
Phase 15 — Reviews  
Phase 16 — Verification  
Phase 17 — Notifications  
Phase 18 — Payments  
Phase 19 — Admin  
Phase 20 — Moderation  
Phase 21 — Localization  
Phase 22 — Analytics  
Phase 23 — Testing  
Phase 24 — Launch

---

## 🌍 Ethiopia-Specific Features

- Injera baking category
- Farm labor (plowing, harvesting)
- Laundry (manual washing)
- Local transport helpers
- Low-bandwidth UI
- Phone-first UX

---

## 🔮 Future Roadmap

- Map integration (lat/lng)
- AI matching
- Telebirr payments
- Voice-based booking
- Worker reputation scoring

---

## ⚙️ Setup

```bash
git clone <repo>
cd project
npm install
npm run dev
```

---

## 🎯 Goal

To build the most trusted digital platform for blue-collar work in Ethiopia.
