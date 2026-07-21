# Planova - Testing Strategy and Development Roadmap

This document defines the quality assurance frameworks, testing strategies, and the incremental release roadmap for Planova.

---

## 1. Testing Strategy

Planova enforces a strict testing pyramid across all components in the monorepo:

```text
    / \
   /   \      E2E / Playwright / Widget (Top 10%)
  /-----\
 /       \    Integration / Service APIs (Middle 30%)
/---------\
/           \  Unit Tests / Models / Utilities (Base 60%)
-------------
```

### 1.1. Backend API (NestJS)
* **Unit Testing**: Jest for business logic isolated from database interactions. Mocks Prisma clients.
* **Integration Testing**: Jest and supertest against a Dockerized test database instance. Runs database migrations and validates seed queries.
* **End-to-End Testing**: Validates whole request pipelines, authentication middleware, and error-handling interceptors.

### 1.2. Flutter Mobile Client
* **Unit Testing**: Tests Dart business rules, Riverpod providers, and utility classes.
* **Widget Testing**: Tests isolated UI components to verify layout, labels, and state mutations under mocked inputs.
* **Integration Testing**: End-to-end integration tests using `flutter_driver` or `integration_test` package running on simulators or actual hardware.
* **Golden Tests**: Visual regression testing using `golden_toolkit` to verify visual consistency across platforms and resolutions.

### 1.3. Web Clients (User-Web & Admin-Web)
* **Component Testing**: React Testing Library and Vitest for testing Next.js layouts and UI states.
* **End-to-End Testing**: Playwright for verifying user flows (registration, dragging events on the timetable, clicking approval modals).

---

## 2. Development Roadmap & Release Phases

The project progresses in grouped phases, with strict verification checks required to transition:

```mermaid
gantt
    title Planova Implementation Milestones
    dateFormat  YYYY-MM-DD
    section Setup & Foundations
    Phase 0 - Specification           :active, p0, 2026-07-20, 2d
    Phase 1 - Monorepo Environment     : p1, after p0, 3d
    Phase 2 - Database & Prisma        : p2, after p1, 4d
    section Authentication & UI
    Phase 3 & 4 - Auth & Onboarding    : p3_4, after p2, 6d
    Phase 5 & 6 - Timetable & Tasks    : p5_6, after p3_4, 10d
    section AI & Constraints
    Phase 7 & 8 - AI Router & NL Planner: p7_8, after p5_6, 8d
    Phase 9 & 10 - Scheduling & Rearrange : p9_10, after p7_8, 12d
    section Sync & Integrations
    Phase 11-13 - Calendars Sync (Google/Apple/Outlook) : p11_13, after p9_10, 10d
    Phase 14 & 15 - Alarms & Offline   : p14_15, after p11_13, 8d
    section Advanced Features
    Phase 16-19 - Collab & Academic Modes : p16_19, after p14_15, 12d
    Phase 20-22 - Payments & Analytics : p20_22, after p16_19, 10d
    section Security & Polish
    Phase 23-26 - Hardening & Performance: p23_26, after p20_22, 8d
    section Release Operations
    Phase 27-30 - Deployment & Launch  : p27_30, after p23_26, 7d
```

### Milestone Groupings
1. **Infrastructure (Phases 1-2)**: Monorepo construction, database migrations, Docker configs.
2. **Core App (Phases 3-6)**: Authentication, User Profiles, Calendar Views, Drag-and-drop Events.
3. **AI Scheduling (Phases 7-10)**: NL parser, dynamic scoring constraint solver, side-by-side proposal preview logic.
4. **Integrations (Phases 11-16)**: Third-party calendar sync tokens, native Swift/Kotlin EventKit wrappers, foreground service alarms, FCM pushes.
5. **Business/Niche Logic (Phases 17-22)**: Student Mode, Professional Shifts, Sharing metrics, payment plans.
6. **Hardening & Launch (Phases 23-30)**: Audits, localizations, E2E tests, build profiling, App Store delivery.
