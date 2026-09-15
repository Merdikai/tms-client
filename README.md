<h1 align="center">🎓 Training Management System (TMS) — Frontend Portal</h1>

<p align="center">
  <strong>Next-Generation Enterprise Academy & Course Lifecycle Platform</strong><br>
  Built with Angular 22 Zoneless, NgRx SignalStore, Angular Material, SignalR, Vitest, and Playwright E2E.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-22.1-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/NgRx-SignalStore-BA68C8?style=for-the-badge&logo=ngrx&logoColor=white" alt="NgRx" />
  <img src="https://img.shields.io/badge/Vitest-Unit%20Tested-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/Playwright-E2E%20Verified-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" />
  <img src="https://img.shields.io/badge/SignalR-Real--Time-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt="SignalR" />
</p>

---

## 🌟 Application Visual Showcase

<table>
  <tr>
    <td width="50%" align="center">
      <strong>👩‍🏫 Instructor Command Center</strong><br>
      <img src="./public/docs/screenshots/instructor-dashboard.png" alt="Instructor Command Center" width="100%" style="border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 16px rgba(0,0,0,0.2);" />
    </td>
    <td width="50%" align="center">
      <strong>👨‍🎓 Student Academic Hub</strong><br>
      <img src="./public/docs/screenshots/student-portal.png" alt="Student Academic Portal" width="100%" style="border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 16px rgba(0,0,0,0.2);" />
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <strong>📚 Course Catalog & Capacity Tracker</strong><br>
      <img src="./public/docs/screenshots/course-catalog.png" alt="Course Catalog" width="100%" style="border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 16px rgba(0,0,0,0.2);" />
    </td>
    <td width="50%" align="center">
      <strong>📑 Admissions & Enrollment Registry</strong><br>
      <img src="./public/docs/screenshots/enrollments-registry.png" alt="Admissions Registry" width="100%" style="border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 16px rgba(0,0,0,0.2);" />
    </td>
  </tr>
</table>

---

## 📖 Overview

The **TMS Frontend Client** is an enterprise-grade Single Page Application (SPA) designed for higher education academies and corporate training institutions. It delivers tailored role-based portals for **Students**, **Faculty Instructors**, and **Academy Administrators**.

Built on **Angular 22** using the modern **zoneless paradigm**, this platform leverages **Signal-based reactivity**, **NgRx SignalStore**, and WebSocket synchronization via **Microsoft SignalR** for real-time enrollment updates, diagnostics, and grading workflows.

---

## 📸 In-Depth Feature Screenshots

### 👩‍🏫 1. Faculty Command Center & KPI Analytics
> Real-time status diagnostics, KPI metrics (Active Students, Pending Requests, Confirmed Admissions), and dynamic status analytics charts.
<p align="center">
  <img src="./public/docs/screenshots/instructor-dashboard.png" alt="Instructor Command Center" width="95%" style="border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 20px rgba(0,0,0,0.25);" />
</p>

---

### 👨‍🎓 2. Student Academic Progress & Degree Tracker
> Program track selection (Software Engineering, Cloud & DevOps, Data & AI), GPA target calculators, earned credits milestones, and course enrollment cards.
<p align="center">
  <img src="./public/docs/screenshots/student-portal.png" alt="Student Academic Portal" width="95%" style="border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 20px rgba(0,0,0,0.25);" />
</p>

---

### 📚 3. Course Catalog & Capacity Management
> Academic course offerings with real-time seat capacity progress bars, credit tags, department filters, and instructor assignments.
<p align="center">
  <img src="./public/docs/screenshots/course-catalog.png" alt="Course Catalog" width="95%" style="border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 20px rgba(0,0,0,0.25);" />
</p>

---

### 📑 4. Admissions Registry & One-Click Decisions
> Complete enrollment registry with instant keyword search, live status filter chips (Pending, Approved, Rejected), CSV report export, and one-click approvals.
<p align="center">
  <img src="./public/docs/screenshots/enrollments-registry.png" alt="Admissions Registry" width="95%" style="border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 20px rgba(0,0,0,0.25);" />
</p>

---

### 🎯 5. Gradebook & Evaluation Submissions
> Instructor grading interface with student selection, course score inputs, automated GPA / letter grade calculations, and permission validation.
<p align="center">
  <img src="./public/docs/screenshots/grade-submission.png" alt="Grade Submission Portal" width="95%" style="border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 20px rgba(0,0,0,0.25);" />
</p>

---

### 🔐 6. Secure Institutional Authentication & Registration
> Dual-mode authentication portal with institutional email validation, password strength meters, and student/faculty role selection.
<p align="center">
  <img src="./public/docs/screenshots/login-auth.png" alt="Authentication Portal" width="95%" style="border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 20px rgba(0,0,0,0.25);" />
</p>

---

### 📝 7. Curriculum & Syllabus Modal Manager
> Detailed module editor for prerequisites, learning outcomes, syllabus schedule, and industry-aligned skills.
<p align="center">
  <img src="./public/docs/screenshots/curriculum-editor.png" alt="Curriculum Editor" width="95%" style="border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 20px rgba(0,0,0,0.25);" />
</p>

---

### 🌓 8. Dark & Light Theme Support
<table>
  <tr>
    <td width="50%" align="center">
      <strong>Dark Mode Dashboard</strong><br>
      <img src="./public/docs/screenshots/dashboard-dark.png" alt="Dark Mode Dashboard" width="100%" style="border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.2);" />
    </td>
    <td width="50%" align="center">
      <strong>Dark Mode Course Catalog</strong><br>
      <img src="./public/docs/screenshots/courses-dark.png" alt="Dark Mode Courses" width="100%" style="border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.2);" />
    </td>
  </tr>
</table>

---

### ✏️ 9. Administrative Course Editor & Application Forms
<table>
  <tr>
    <td width="50%" align="center">
      <strong>Course Configuration Modal</strong><br>
      <img src="./public/docs/screenshots/course-edit-modal.png" alt="Course Edit Modal" width="100%" style="border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.2);" />
    </td>
    <td width="50%" align="center">
      <strong>Student Enrollment Application</strong><br>
      <img src="./public/docs/screenshots/enrollment-form.png" alt="Enrollment Form" width="100%" style="border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.2);" />
    </td>
  </tr>
</table>

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies & Libraries |
|---|---|
| **Framework** | Angular 22 (Standalone Components, Zoneless Signals) |
| **State Management** | `@ngrx/signals` (SignalStore with Entities & Computed Signals) |
| **Real-Time Sync** | `@microsoft/signalr` (WebSocket Hub Connection) |
| **UI Design System** | Angular Material, Custom SCSS Glassmorphism Design System, Lucide Vector Icons |
| **Unit & Store Testing** | Vitest (`@angular/build:unit-test`), `HttpTestingController` |
| **End-to-End Testing** | Playwright with Session `storageState` authentication reuse |
| **Temporal Dates** | `@js-temporal/polyfill` |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **NPM**: `v10.x` or higher
- **Backend API**: Running at `http://localhost:5282`

### Installation
```bash
# Clone the repository
git clone https://github.com/Merdikai/tms-client.git
cd tms-client

# Install dependencies
npm install --legacy-peer-deps
```

### Running Locally
```bash
# Start the development server with API proxying
npm start
```
Navigate to `http://localhost:4200/` in your browser.

---

## 🧪 Comprehensive Testing Suite

The frontend is protected by a multi-layered testing safety net:

### 1. Unit, Service & SignalStore Tests (Vitest)
```bash
# Run tests in watch mode
npm test

# Run all specs once and exit
npm test -- --watch=false
```
**Specs Included:**
- `CourseCardComponent`: Signal input binding, output events, and routerLink providers.
- `EnrollmentService`: HTTP request matching and mocking with `HttpTestingController`.
- `EnrollmentStore`: State seeding, entity management, and computed `pendingCount()` verification.
- `Dashboard & Chart Components`: Mock dependencies and change detection stability.

### 2. End-to-End Tests (Playwright)
```bash
# Run full E2E test suite (Headless)
npx playwright test

# Run E2E tests with UI runner
npx playwright test --ui

# View HTML Test Report
npx playwright show-report
```

---

## 📁 Project Directory Structure

```text
tms-client/
├── e2e/                             # Playwright E2E test suite
│   ├── auth.setup.ts                # Session state auth setup
│   └── admin-approve-enrollment.spec.ts # Happy-path browser journeys
├── public/                          # Static assets and icons
│   └── docs/                        # Documentation & project screenshots
│       └── screenshots/             # Real UI captures (12 authentic views)
├── src/
│   ├── app/
│   │   ├── features/                # Route-level page components
│   │   │   ├── admin-users/         # User approval console
│   │   │   ├── course-detail/       # Single course view
│   │   │   ├── course-list/         # Course catalog & curriculum manager
│   │   │   ├── enrollment-form/     # Student course application form
│   │   │   ├── enrollment-list/     # Admissions registry
│   │   │   ├── grade-submission/    # Instructor gradebook
│   │   │   ├── instructor-dashboard/# Command center & KPI analytics
│   │   │   ├── login/               # Portal authentication & registration
│   │   │   └── student-dashboard/   # Degree tracker & academic goal hub
│   │   ├── guards/                  # Auth and Role route guards
│   │   ├── models/                  # TypeScript domain models & interfaces
│   │   ├── services/                # HTTP API services & SignalR client
│   │   ├── store/                   # NgRx SignalStores
│   │   └── ui/                      # Reusable presentational components
│   │       ├── analytics-chart/     # Custom status breakdown chart
│   │       └── course-card/         # Modern course card UI
│   ├── environments/                # Environment configuration
│   └── styles.scss                  # Global design tokens & styling
├── angular.json                     # Angular CLI & build configuration
├── playwright.config.ts             # Playwright test configuration
└── tsconfig.json                    # TypeScript compiler configuration
```

---

<p align="center">
  Crafted with excellence for the <strong>Training Management System</strong> ecosystem.
</p>
