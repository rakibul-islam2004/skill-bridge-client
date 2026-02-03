# SkillBridge - Full-Stack Tutor-Student Marketplace

SkillBridge is a high-performance, responsive platform designed to bridge the gap between students and expert tutors. Built with **Next.js 16**, **React 19**, and **Node.js/Express**, it provides a seamless 1-on-1 learning experience through specialized role-based portals, robust scheduling algorithms, and secure authentication.

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Core Features](#-core-features)
- [Project Structure](#-project-structure)
- [Database Architecture](#-database-architecture)
- [Getting Started](#-getting-started)
- [Technical Highlights](#-technical-highlights)

---

## 🚀 Project Overview

SkillBridge facilitates professional learning connections by offering three distinct user experiences:
- **Students:** Can discover experts, book real-time sessions, and track their learning journey.
- **Tutors:** Can manage their teaching business, set flexible availability, and track earnings.
- **Admins:** Oversee platform integrity, manage users, and curate featured content.

The application follows a **mobile-first, fully responsive design** with full dark mode support and optimized performance.

---

## 🛠 Tech Stack

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI:** [React 19](https://react.dev/), [TailwindCSS 4](https://tailwindcss.com/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/), Lucide Icons
- **State/Fetching:** [TanStack Query v5](https://tanstack.com/query/latest), Axios
- **Forms:** React Hook Form, Zod (Validations)
- **Auth:** [Better Auth](https://www.better-auth.com/)

### Backend
- **Server:** Node.js, Express.js
- **Language:** TypeScript 5
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL
- **Security:** JWT-based role session validation

---

## ✨ Core Features

### 🎓 For Students
- **Smart Discovery:** Advanced filtering by category, price, and tutor ratings.
- **Instant Booking:** Seamless scheduling with real-time availability validation.
- **My Tutors Hub:** Track and manage relationships with previously booked instructors.
- **Learning History:** Detailed overview of upcoming, completed, and cancelled sessions.
- **Quality Control:** Integrated review system to rate tutors and leave feedback.

### 👨‍🏫 For Tutors
- **Availability Engine:** Set recurring or one-time availability blocks with conflict prevention.
- **Pricing Management:** Tiered pricing configuration based on session durations.
- **Earnings Analytics:** Professional dashboard with revenue charts and session stats.
- **Profile Builder:** Specialized tutor profiles with bio, experience, and category tags.
- **Meeting Management:** Automated booking statuses (Pending, Confirmed, Completed).

### 🛡️ For Admins
- **User Governance:** Complete management of student, tutor, and admin profiles.
- **Content Curation:** Management of platform categories and featured tutor listings.
- **Activity Monitoring:** Global overview of all bookings and system engagement.

---

## 📁 Project Structure

```text
skill-bridge-client/ (Frontend)
├── src/
│   ├── app/                  # Next.js App Router (27+ routes)
│   │   ├── student/          # Student Portal (Dashboard, Bookings, My Tutors)
│   │   ├── tutor/            # Tutor Portal (Schedule, Earnings, Profile)
│   │   ├── admin/            # Admin Panel (Users, Categories, Analytics)
│   │   └── tutors/           # Public listings & Profile pages
│   ├── components/           # UI primitives & role-specific features
│   ├── lib/                  # API clients, Auth config, & Shared utils
│   └── validations/          # Zod schemas for end-to-end data integrity
```

```text
SkillBridge/ (Backend)
├── prisma/                   # Database schema & migrations
├── src/
│   ├── modules/              # Feature modules (Auth, Booking, Tutor, Admin)
│   ├── routes/               # Express route definitions
│   └── lib/                  # Prisma client & Middleware logic
```

---

## 📊 Database Architecture

The system relies on a robust PostgreSQL schema managed via Prisma:
- **User Role Management:** Specialized profiles for Students, Tutors, and Admins.
- **Scheduling Logic:** Tracks `TutorAvailability`, `TutorPricing`, and `CalendarBlocks`.
- **Booking Flow:** Connects Students to Tutors with status tracking and meeting links.
- **Engagement Data:** Stores `Reviews`, `Categories`, and `Notifications`.

---

## 🏁 Getting Started

### 1. Clone Repositories
```bash
git clone https://github.com/rakibul-islam2004/skill-bridge-client.git
git clone https://github.com/rakibul-islam2004/SkillBridge.git
```

### 2. Environment Setup
**Frontend (`.env.local`):**
```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:4000"
```

**Backend (`.env`):**
```env
DATABASE_URL="postgresql://user:password@host:port/db"
BETTER_AUTH_SECRET="your_secret"
FRONTEND_URL="http://localhost:3000"
```

### 3. Installation & Start
- **Backend:** `npm install && npx prisma migrate dev && npm run dev`
- **Frontend:** `pnpm install && pnpm dev`

---

## 💡 Technical Highlights

- **Role-Based Access Control (RBAC):** Middleware-level protection for Student, Tutor, and Admin portals.
- **End-to-End Type Safety:** Shared Zod schemas ensuring data consistency between frontend and backend.
- **Optimistic UI:** Instant feedback for booking and reviews using TanStack Query.
- **Conflict Prevention:** Backend logic to prevent double-booking and overlapping availability.
- **Automated Notifications:** Real-time system alerts for booking status changes.

---

_Developed for Programming Hero Next Level Development - First Full Stack Assignment._
