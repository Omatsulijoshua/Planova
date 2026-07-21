# Planova - User Roles, Permissions, and Journeys

This document defines the user role taxonomy, permission access levels, and core user journey flows for the Planova platform.

---

## 1. User Roles & Permissions Matrix

Planova implements a Role-Based Access Control (RBAC) matrix that maps distinct system actions to authorized users:

| Role | Target Audience | Key Access Permissions |
| :--- | :--- | :--- |
| **Guest** | Unauthenticated visitors | View public landing pages, pricing plans, and public/shared read-only timetables. |
| **Free User** | Default registered user | Create 1 timetable, manual scheduling, basic alarms. Ad-supported, capped AI usage (3 requests/day). |
| **Premium User** | Paid personal subscribers | Unlimited timetables, full AI features, advanced alarms/challenges, external calendar sync. |
| **Student** | Academic tier users | Special educational templates, homework/exam tracking, syllabus integration, and spacer repetition scheduling. |
| **Teacher** | Educators / Instructors | Create classes, publish syllabi, broadcast events/assignments to study groups, and track student check-ins. |
| **Parent** | Families / Guardians | View children's schedules, configure protected study times, manage notifications, and edit shared family calendars. |
| **Professional** | Work-focused subscribers | Advanced shift rotations, project timeline tracking, calendar overlays, and invoice/timesheet generation. |
| **Org Member** | Employees / Students in Org | Read/edit shared organizational timetables, check-in to events, and share individual availability. |
| **Org Admin** | Managers / Directors | Manage organization workspace, customize templates, provision member licenses, and set custom branding. |
| **Support Agent** | Customer service | View system audit logs, respond to tickets, and temporarily escalate permissions to troubleshoot non-private data. |
| **Admin** | System administrators | Manage support tickets, run database health reports, verify third-party keys, and ban offending users. |
| **Super Admin** | Platform owners | Full control of app settings, edit AI provider configurations/keys, manage system billing, and access all operational logs. |

---

## 2. Core User Journeys

### 2.1. Onboarding and AI Preference Collection

This journey maps the onboarding process where Planova collects constraints and preferences to build the user's initial schedule optimization matrix.

```mermaid
sequenceDiagram
    autonumber
    actor User as User App (Flutter/Web)
    participant API as NestJS API
    participant DB as PostgreSQL Database

    User->>API: POST /auth/register (Email/Social)
    API-->>User: Auth Tokens (Access + Refresh)
    User->>User: Select Persona (Student / Professional / Parent)
    User->>User: Fill out Onboarding Questions<br/>(Sleep, Work, Exercise, Meal times)
    User->>User: Select AI Control Mode (Suggest / Assisted / Autopilot)
    User->>API: POST /users/onboarding-preferences
    Note over API: Validate answers (Timezones,<br/>non-overlapping basic blocks)
    API->>DB: INSERT UserPreferences & UserProfile
    DB-->>API: Confirm Save
    API-->>User: Onboarding Complete -> Initialize Empty Timetable
```

---

### 2.2. Conflict Resolution & AI Proposal Approval Loop

This is the core Planova differentiator: conflicts trigger an AI rearrangement proposal, which is presented side-by-side to the user for selective approval.

```mermaid
sequenceDiagram
    autonumber
    actor User as User App (Flutter/Web)
    participant API as NestJS API
    participant Engine as Scheduling Engine
    participant AI as AI Routing Layer
    participant Cal as External Calendars (Google/Outlook)

    User->>API: Create Event causing conflict (e.g., "Doctor Appointment 2PM")
    API->>Engine: Run Overlap Detection
    Engine-->>API: Conflict Detected (Overlaps "Physics Study")
    API->>AI: Generate Optimal Rearrangement Proposal
    Note over AI: Keeps Doctor Appointment (Fixed)<br/>Moves Physics Study (Flexible) to 4PM
    AI-->>API: Structured Proposal JSON
    API-->>User: Trigger Notification & Display Proposal Preview
    User->>User: Side-by-Side Comparison (Original vs Proposed)
    User->>User: Check/Uncheck proposed event alterations
    User->>API: POST /proposals/approve-selected (IDs of changes)
    Note over API: Execute Database Transaction<br/>Update events, version history
    API->>Cal: Push updates (OAuth Event Sync)
    API-->>User: Timetable Updated (Undo button displayed)
```

---

### 2.3. Offline-First Synchronization Loop

How the client operates while disconnected and merges conflicting changes upon reconnection.

```mermaid
sequenceDiagram
    autonumber
    actor Client as Flutter App (Local Drift DB)
    participant Server as NestJS API Server
    participant DB as PostgreSQL Database

    Note over Client: Network connection drops (Offline)
    Client->>Client: User creates/edits events (Immediate local update)
    Client->>Client: Queue transactions in local SQL database (SyncQueue)
    Note over Client: Network connection restored (Online)
    Client->>Server: POST /sync/push (Upload local queued events & sync tokens)
    Note over Server: Check Sync Token & check database for edits
    alt No Conflicts (Server version matches sync token)
        Server->>DB: Bulk insert/update events
        Server-->>Client: Sync Success (New Sync Token returned)
    else Conflict Detected (Server record has newer timestamp)
        Note over Server: Resolve using "Latest Wins" / Field Merge
        Server->>DB: Save merged record
        Server-->>Client: Sync Merged (Return updated event data & new Token)
        Client->>Client: Update Local Drift DB to match server
    end
```
