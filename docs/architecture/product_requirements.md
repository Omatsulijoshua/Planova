# Planova - Product, Functional, and Non-functional Requirements Document

This document defines the product vision, core features, functional scope, and non-functional specifications of **Planova**, an AI-powered timetable, calendar, alarm, task-planning, and schedule-optimization platform.

---

## 1. Product Requirements Document (PRD)

### 1.1. Executive Summary & Vision
Planova (Plan + Nova, signifying "intelligent planning" and a "new beginning") is a production-ready scheduling ecosystem designed to alleviate the cognitive load of time management. Unlike standard calendar tools, Planova utilizes dynamic AI routing, a deterministic constraint-satisfaction scheduling engine, and deep native platform integrations to automatically resolve scheduling conflicts, optimize daily routines, and adapt to real-world interruptions.

### 1.2. Target Audience & Personas
* **Students**: Need to balance school timetables, study hours, spaced repetition, examination preparation, and extracurricular activities.
* **Professionals / Shift Workers**: Manage complex shifting rosters, client meetings, focus periods, project deadlines, and follow-up activities.
* **Parents**: Keep track of family schedules, school periods, study timetables, and child routines.
* **Organizations**: Schedule group meetings, assign tasks, coordinate team availability, and manage organizational templates.

### 1.3. Scope & Platforms
* **Mobile App (Android/iOS)**: Cross-platform Flutter client offering offline-first support, native alarms/reminders, and hardware integration.
* **User Web App**: Next.js responsive app providing comprehensive grid, timeline, and dashboard interfaces.
* **Admin Web Dashboard**: Next.js app for system operators to manage users, monitor API performance, manage AI providers, inspect audit logs, and override system settings.
* **Backend API**: Scalable NestJS TypeScript backend with Prisma ORM, Redis for queue management, and PostgreSQL database.

---

## 2. Functional Requirements Document (FRD)

### 2.1. Dynamic AI Timetable Generation
* **Natural Language Parsing**: Users can input text descriptions of their schedules (e.g., *"I work 9-5, study Flutter for 10 hrs/week, and exercise 4 times a week"*). The AI parses these constraints into events, tasks, recurrence rules, and preferences.
* **Timetable Creation/Management**: Support manual and automated CRUD operations on timetables. Allow versioning, duplication, and locking of specific events.
* **Conflict Detection & Proposal System**: Identify overlaps and timing conflicts. Suggest optimal rearrangements (proposals) without silently mutating the active schedule.
* **Selective Approval Flow**: Users review proposals with a side-by-side comparison interface and select/deselect specific proposed modifications before applying them.

### 2.2. Core Event & Calendar Features
* **Event Flexibility Classifications**:
  * **Fixed Events**: Immovable, non-resizable, and cannot be overlapped by AI (e.g., shifts, exams).
  * **Semi-Flexible Events**: Moveable only within user-defined constraint windows (e.g., exercise between 5 PM and 8 PM).
  * **Flexible Events**: Moveable to any free slot that optimizes the daily score (e.g., reading).
  * **Locked Events**: Explicitly marked by the user as untouchable for a specific proposal cycle.
* **Synchronizations**:
  * **Google Calendar**: Two-way webhook-driven sync with incremental token storage.
  * **Microsoft Outlook**: Two-way sync via Microsoft Graph API.
  * **Apple Calendar**: Local two-way sync on iOS devices using EventKit via native Swift code.

### 2.3. Tasks, Routines, Goals, and Focus
* **Tasks**: Hierarchical tasks with subtask checklists, deadlines, estimated durations, priorities, and dependency linkages.
* **Routines**: Recurring habits, medication schedules, prayer times, and exercise tracks with streak monitoring.
* **Goals**: Multi-level goals with milestones, target deadlines, and AI-generated progress roadmaps.
* **Focus Sessions**: Dynamic Pomodoro/Stopwatch tool with background soundscapes, interruption tracking, and comparison of estimated vs. actual duration.

### 2.4. Native Alarms & Custom Sounds
* **Advanced Reminders**: Multiple custom alerts per event, escalating volume, text-to-speech, and snooze customization.
* **Alarm Challenges**: Interactive mini-games (Math, QR code scan, Step count, Shake, Memory puzzle, Typing) required to silence the alarm.
* **Platform Integrations**:
  * **Android**: `AlarmManager` for exact scheduling, background service launches, and reboot rescheduling hooks.
  * **iOS**: Native local notifications wrapper with strict compliance on duration/file-type limitations.

### 2.5. Collaboration & Subscriptions
* **Sharing**: Read-only public calendar links, collaborative timetables (Family, Study Group, Teams), and role-based comments/approvals.
* **Subscriptions**: Regionalized tier matrix (Free, Student, Pro, Family, Org) supported by Stripe, Paystack, Flutterwave, Google Play Billing, and Apple In-App Purchases.

---

## 3. Non-functional Requirements Document (NFRD)

### 3.1. Security & Privacy
* **Data Shielding**: Schedule contents, preferences, and private journals are shielded from standard administrators by default. Decryption or access requires audited escalation, explicit user consent, and single-purpose justification.
* **Authentication**: Argon2 hash verification for local passwords, multi-device session management, refresh token rotation, brute-force rate-limiting, and OAuth2 security.
* **Encryption**: TLS 1.3 in transit; AES-256 encryption at rest for database tables and sensitive fields (e.g., third-party API keys).

### 3.2. Performance & Scalability
* **Startup Performance**: Mobile app cold start under 1.5 seconds.
* **Database & Caching**: Optimized PostgreSQL indexing on user/event IDs, Redis caching for fast session lookups, and asynchronous task offloading via BullMQ.
* **API Response Time**: Non-AI API calls must complete in under 200ms. AI calls must failover or stream responses within 8 seconds maximum.

### 3.3. Offline-First Capability
* **Local Persistence**: Mobile clients store full state offline (Drift/Isar databases).
* **Sync Queue**: Write operations offline are stored in a transaction queue.
* **Conflict Resolution**: Logic resolves syncing discrepancies (latest-wins or manual prompt) upon network reconnection.

### 3.4. Accessibility & Localization
* **Accessibility**: Screen reader compatibility, dynamic font resizing, contrast compliance, and color-blind safe indicators.
* **Localization**: Full RTL layouts and translations for English, French, Spanish, Portuguese, Arabic, Chinese, Japanese, Korean, Vietnamese, and Thai.
