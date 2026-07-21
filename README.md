# Planova — AI-Powered Smart Timetable Platform

Planova is an intelligent scheduling, calendar, alarm, task-planning, and schedule-optimization platform powered by a hybrid constraint-satisfaction engine and dynamic AI routing. Built for students and academic groups, it automates daily planning by resolving timetable conflicts, providing native mobile alarms with captcha blockers, and offering real-time collaboration study rooms.

---

## 📖 Table of Contents
1. [Monorepo Architecture](#1-monorepo-architecture)
2. [Key Core Features](#2-key-core-features)
3. [Local Development Setup](#3-local-development-setup)
4. [Testing & Verification](#4-testing--verification)
5. [Production Hardening & Optimization](#5-production-hardening--optimization)
6. [Brand Assets](#6-brand-assets)

---

## 1. Monorepo Architecture

Planova is structured as a `pnpm` workspace monorepo separating modular services, client applications, and shared packages:

```text
planova/
├── apps/
│   ├── mobile/             # Flutter Mobile client (Android & iOS)
│   ├── user-web/           # Next.js User Web App (Landing page & Portal)
│   ├── admin-web/          # Next.js Super Admin Dashboard Control Panel
│   └── api/                # NestJS API Backend application
├── packages/
│   ├── shared-types/       # Common TypeScript DTOs and interfaces
│   ├── api-client/         # Web/Client-side fetch API wrapper
│   ├── ui-config/          # Shared styling tokens and Tailwind configs
│   ├── validation/         # Shared Zod validation schemas
│   └── scheduling-engine/  # Backtracking CSP Schedule Solver engine
├── assets/
│   └── logo/               # Brand logo files & mock app icons
├── docs/                   # Product specification & architectural blueprints
├── docker-compose.yml      # Local Postgres & Redis dependency environments
├── start.ps1               # Local setup & server bootstrapper PowerShell script
└── package.json            # Workspace dependencies orchestrator
```

---

## 2. Key Core Features

### 🧠 CSP AI Scheduling Engine (`@planova/scheduling-engine`)
Planova schedules routine slots and tasks across a **96-slot, 15-minute daily grid**. The engine uses:
* **Backtracking search (DFS)** to dynamically resolve overlapping events.
* **Minimum Remaining Values (MRV)** heuristic to order variables.
* **Forward Checking** for domain pruning to prevent search space explosion.
* **Topological Sort (DFS cycle detection)** inside the backend to prevent circular task dependencies (e.g. Task A depending on B, and B depending on A) with `400 Bad Request`.

### 👥 Real-Time Collaboration Gateway
Uses **Socket.io WebSockets** to power study group rooms:
* **Room Management**: `join_room` and `leave_room` events.
* **Coordinate Sharing**: Live location sharing broadcasts.
* **Proposals & Voting**: Group members can propose scheduling slots (`time_proposal`), vote approvals (`vote_proposal`), and trigger conflict resolution audits before finalizing status swaps.

### ⏰ Math Captcha Alarms
A robust native alarm service enforcing strict scheduling guardrails:
* Max **15 daily alarms limit** and minimum **10 minutes separation** constraint.
* Active alarm unlocks require solving randomized mathematical equations (addition, subtraction, multiplication) to prevent oversleeping.

### 💳 Subscriptions & Feature Gating
* Tier structures: **Free**, **Student** ($2.99/mo), and **Premium Pro** ($4.99/mo).
* Enforces **14-day free trials** and a **7-day renewal invoice grace period** on paid tiers.
* Gates advanced scheduling features and multi-calendar sync from expired accounts.

### 📊 Productivity Analytics & Feedback
* **Focus Score Formula**: Calculates plan consistency using `(completedTasks / totalTasks) * 80 + (sleepHours / 8) * 20` (capped at 100).
* **Feedback loops**: Stores star ratings (1-5 stars) and comments as support tickets inside the database.

---

## 3. Local Development Setup

### 3.1. Prerequisites
Ensure you have the following installed:
* **Node.js**: v20 or later
* **pnpm**: `npm install -g pnpm`
* **Flutter SDK**: v3.41 or later
* **Docker Desktop**: for database containers

### 3.2. Automated Start (PowerShell Bootstrapper)
The easiest way to initialize the database and run all developer servers is running the PowerShell setup script:
```powershell
.\start.ps1
```
This script automatically:
1. Boots PostgreSQL and Redis containers.
2. Polls health checks until Postgres is online.
3. Pushes Prisma schema structures to the database (`prisma db push`).
4. Seeds initial permissions, plans, and default admin accounts (`prisma db seed`).
5. Prompts to start dev servers (`pnpm dev` or filters).

---

## 4. Testing & Verification

### 4.1. Backend NestJS Tests
Verify NestJS controllers, services, database transactions, and rate limiters:
```bash
pnpm --filter api test
```
*Run all 78 tests across 22 test suites successfully.*

### 4.2. Mobile Flutter Tests
> [!WARNING]
> **Windows Junction Workaround**: If your Windows profile contains spaces or apostrophes (e.g. `C:\Users\SirBill's`), running Flutter tests in that directory will fail due to CLI argument escaping limitations.
> 
> **Resolution**: Always run Flutter commands inside the linked junction directory `C:\PlanovaTemp\apps\mobile`.

Run mobile static analysis and widget tests:
```bash
# Analyze code quality
flutter analyze

# Run unit & widget tests
flutter test
```
*Run all widget, app starting, alarm validations, and captcha tests successfully.*

---

## 5. Production Hardening & Optimization

### 5.1. Backend API Security
* **Helmet Middleware**: Inject HTTP security headers (HSTS, CSP, XSS-Protection).
* **Compression**: Gzip compression on all REST response payloads.
* **Rate Limiting**: Enforces global Throttler limiters of 100 requests per minute.

### 5.2. Mobile Optimization
* **Obfuscation**: Native class name mangling to protect source code.
* **Release Shrinking**: Enabled `isMinifyEnabled = true` and `isShrinkResources = true` inside the release gradle scripts to remove unused assets and minimize binary size.

---

## 6. Brand Assets
Logo files and app symbols are located inside [assets/logo/](./assets/logo/):
* `logo_dark_full.png` - Horizontal tagline branding for dark pages.
* `logo_dark_tight.png` - Header bar logos.
* `logo_symbol_dark.png` - Standard orbital "P" icon.
* `app_icon_mock.png` - Mobile mockup icon launcher.
