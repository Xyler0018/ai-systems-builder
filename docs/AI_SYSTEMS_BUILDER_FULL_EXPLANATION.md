# AI Systems Builder — Complete Project Explanation

## 1. What We Built

**AI Systems Builder** is a complete local-first learning system for a 12-month roadmap toward becoming a practical AI Engineer / AI Generalist with specialization in **RAG + AI Automation Systems**.

The project is not only a dashboard and not only a course document. It includes:

- a full course roadmap;
- a local desktop web dashboard;
- Docker-based local deployment;
- a native offline Android app;
- a GitHub repository;
- a GitHub Android release with a directly installable APK.

Repository:

[https://github.com/Xyler0018/ai-systems-builder](https://github.com/Xyler0018/ai-systems-builder)

Android release:

[AI Systems Builder Android v1.0.0](https://github.com/Xyler0018/ai-systems-builder/releases/tag/android-v1.0.0)

Direct Android APK:

[Download AI-Systems-Builder.apk](https://github.com/Xyler0018/ai-systems-builder/releases/download/android-v1.0.0/AI-Systems-Builder.apk)

---

## 2. Main Product Idea

The project is built around one practical route:

> AI Engineer / AI Generalist / LLM App Developer / AI Automation Engineer -> RAG + AI Automation Systems Specialist

The roadmap tells the learner **what to study and build**.

The dashboard helps the learner **track whether they are actually executing**.

The Android app gives the learner **offline mobile access** for daily tracking.

The core idea is simple:

- learn the minimum useful concept;
- build something every week;
- track daily and weekly execution;
- collect proof of work;
- turn projects into portfolio assets.

---

## 3. Course Roadmap

The course roadmap lives at:

```text
course/AI_Systems_Builder_Roadmap.md
```

It is the main course document.

It includes:

- the final career direction;
- what the roadmap is and is not;
- the learning philosophy;
- daily execution template;
- weekly execution template;
- 12-month learning phases;
- project deliverables;
- portfolio targets;
- checkpoints;
- rules;
- tools;
- resources;
- final positioning.

The roadmap is treated as the primary course material, not as an appendix.

### Why We Added It

The repository is intended to be the official home for the **course plan plus the tracking tools**.

That means the repo is positioned as:

```text
AI Systems Builder course plan + local dashboard + Android app
```

---

## 4. Desktop Web Dashboard

The desktop dashboard is a local-first web application.

It uses:

- Next.js;
- TypeScript;
- Tailwind CSS;
- Prisma;
- SQLite;
- Docker;
- Recharts;
- Lucide icons;
- Zod.

The local web app runs at:

```text
http://127.0.0.1:3001
```

### Dashboard Modules

The dashboard tracks:

- Command Center;
- Roadmap;
- Weekly Execution;
- Daily Log;
- Projects;
- Skills;
- Resources;
- Tools;
- Rules;
- Checkpoints;
- Settings;
- Export / Import / Backup.

### Why Next.js

Next.js was used because it provides a strong full-stack structure:

- React UI;
- App Router pages;
- API routes;
- production builds;
- server-side data loading;
- Docker-friendly deployment.

This fits a local dashboard that needs real database-backed screens and export/import APIs.

### Why TypeScript

TypeScript was used to reduce mistakes across:

- data models;
- API payloads;
- component props;
- utility functions;
- dashboard module logic.

The app has many related models, so strong typing makes the codebase safer and easier to maintain.

### Why Prisma

Prisma is used as the ORM for the web dashboard.

It handles:

- database schema;
- generated database client;
- relational queries;
- seed data;
- migrations / local schema application.

### Why SQLite

SQLite was chosen because the dashboard is local-first.

Benefits:

- no cloud database required;
- no Supabase required;
- no PostgreSQL setup required;
- no account or login required;
- data stays on the user’s own device.

---

## 5. Web Dashboard Database

The desktop dashboard stores data in SQLite.

When running through Docker, the SQLite database is stored in a Docker volume:

```text
ai-systems-builder-data
```

That means the data survives:

- closing the browser;
- restarting the container;
- restarting the computer;
- normal Docker stop/start.

Safe commands:

```powershell
docker compose stop
docker compose up -d
```

Dangerous command:

```powershell
docker compose down -v
```

The `-v` removes Docker volumes, which deletes the local SQLite database.

### Main Database Models

The dashboard tracks:

- user settings;
- roadmap phases;
- weekly plans;
- daily logs;
- projects;
- project tasks;
- skills;
- learning resources;
- environment tools;
- rules;
- checkpoints;
- weekly reviews;
- proofs of work;
- blockers.

These models allow the user to track both **learning progress** and **proof of execution**.

---

## 6. Docker Setup

Docker support includes:

```text
Dockerfile
docker-compose.yml
scripts/docker-start.mjs
```

The Docker app runs on:

```text
http://127.0.0.1:3001
```

### Why Docker

Docker makes the local dashboard easier to run because the user does not need to manually manage:

- Node production server startup;
- environment configuration;
- database initialization;
- repeatable local runtime setup.

### Docker Compose

The service uses:

```yaml
restart: unless-stopped
```

This allows the app to restart automatically when Docker Desktop starts, unless the user manually stops the container.

### Docker Database Behavior

The compose file stores the database in:

```yaml
volumes:
  - ai-systems-builder-data:/app/data
```

The database URL inside Docker is:

```text
file:/app/data/dev.db
```

So the app remains local and persistent.

---

## 7. Security Hardening

A security hardening pass was added for the local-first web dashboard.

Security work included:

- local-only access boundary;
- optional token-based access for remote exposure;
- safer API mutation checks;
- request size controls;
- safer error handling;
- URL validation;
- CSV formula neutralization;
- import validation;
- security headers;
- security documentation.

Security docs live under:

```text
docs/security/
```

The repo also includes:

```text
SECURITY.md
```

### Why This Matters

Even local apps can become risky if they are later exposed to a network.

The security work makes the dashboard safer by default and documents what must be reviewed before hosted or remote use.

---

## 8. App Icon And PWA Setup

The app uses a robotic-head identity.

Icon and manifest files include:

```text
public/robot-head.svg
public/icon-192.png
public/icon-512.png
public/apple-touch-icon.png
public/app-icon.ico
public/manifest.webmanifest
```

### Why Multiple Icon Types

Different systems expect different formats:

- browsers can use SVG;
- Chrome install flow prefers PNG icons;
- Windows desktop shortcuts often need `.ico`;
- mobile browsers use touch icons.

That is why the project includes SVG, PNG, Apple touch icon, and ICO assets.

---

## 9. GitHub Repository

The public GitHub repository is:

[https://github.com/Xyler0018/ai-systems-builder](https://github.com/Xyler0018/ai-systems-builder)

Description:

```text
Course plan and local-first dashboard for a 12-month AI Systems Builder roadmap.
```

The repo includes:

- course roadmap;
- web dashboard source code;
- Docker setup;
- Android app source code;
- installable Android APK;
- security docs;
- licenses;
- README;
- release assets.

Topics include:

- ai-systems-builder;
- ai-engineering;
- rag;
- ai-automation;
- llm-apps;
- nextjs;
- typescript;
- prisma;
- sqlite;
- docker;
- local-first;
- course;
- learning-dashboard.

---

## 10. Licensing

The project uses two licenses.

### Code License

The dashboard and app source code use:

```text
MIT License
```

File:

```text
LICENSE
```

This allows reuse and modification of the software code under MIT terms.

### Course Content License

The course roadmap content uses:

```text
CC BY-NC 4.0
```

File:

```text
CONTENT_LICENSE.md
```

This allows people to share and adapt the course content for non-commercial use with credit, but prevents commercial resale without permission.

### Why Two Licenses

Code and course content are different kinds of work.

The code can be permissive and open.

The course material needs stronger protection against commercial repackaging.

---

## 11. Native Android App

The native Android app lives in:

```text
android/
```

This is not a WebView wrapper.

It is a native Android app.

### Android Tech Stack

The Android app uses:

- Kotlin;
- Jetpack Compose;
- Material 3;
- Room SQLite;
- Kotlin serialization;
- AndroidX Navigation;
- Android Studio / Android SDK;
- Gradle.

### Why Native Android

The Android app was built natively because the goal was offline local use.

A native app is better for this because:

- it works without Docker;
- it works without a server;
- it stores data directly on the phone;
- it can run fully offline;
- it feels more mobile-native.

### Android Data Storage

The Android app uses Room SQLite.

That means Android data is stored locally on the phone.

The Android app does not automatically sync with the desktop dashboard.

Desktop and Android data are separate in v1.

### Android App Modules

The Android app includes native screens for:

- Command Center;
- Roadmap;
- Weekly Execution;
- Daily Log;
- Projects;
- Skills;
- Resources;
- Tools;
- Rules;
- Checkpoints;
- Settings.

### Android Backup

The Android app supports JSON backup export/import.

This allows manual transfer between devices or future transfer between desktop and Android.

---

## 12. Android APK Release

The Android APK is stored in:

```text
android/releases/AI-Systems-Builder.apk
```

Checksum file:

```text
android/releases/AI-Systems-Builder.apk.sha256
```

SHA-256:

```text
AE8D39D9CDA48F5A033D0D410755FA99641498D7E87905D8973275CD863864B3
```

### GitHub Release

A proper GitHub Release was created:

[AI Systems Builder Android v1.0.0](https://github.com/Xyler0018/ai-systems-builder/releases/tag/android-v1.0.0)

Direct APK:

[Download AI-Systems-Builder.apk](https://github.com/Xyler0018/ai-systems-builder/releases/download/android-v1.0.0/AI-Systems-Builder.apk)

### Why GitHub Release

GitHub mobile displays Releases separately.

This makes the Android app easier to find and install compared with only placing the APK somewhere in the file tree.

---

## 13. README Structure

The README presents the project as a course-plus-dashboard system.

The top focuses on:

- what AI Systems Builder is;
- what is included;
- who it is for;
- course direction;
- dashboard features.

Detailed Android instructions live lower in:

```text
## Android Offline App
```

The GitHub Releases section separately exposes the Android APK.

---

## 14. Build And Verification

The web dashboard checks passed:

```bash
npm run lint
npm run typecheck
npm run build
npm run test:security
```

Docker validation was performed with:

```bash
docker compose up -d --build
docker compose ps
```

The app ran successfully on port `3001`.

The Android APK was built with Gradle:

```bash
assembleDebug
```

The generated APK was copied to:

```text
android/releases/AI-Systems-Builder.apk
```

---

## 15. Desktop Data vs Android Data

The desktop dashboard and Android app are both local-first, but they use separate local databases.

### Desktop

Desktop uses:

```text
Docker volume + SQLite
```

Docker volume:

```text
ai-systems-builder-data
```

### Android

Android uses:

```text
Room SQLite on the phone
```

No Docker is needed.

No cloud database is needed.

No server is needed.

### Sync

There is no automatic sync in v1.

Manual backup/import is the intended transfer method.

---

## 16. Why This Architecture Makes Sense

The architecture supports ownership and practical execution.

### Local-First

The user owns the data.

There is no required account, no required cloud database, and no required paid backend.

### Course + Dashboard

The roadmap gives direction.

The dashboard turns the roadmap into trackable execution.

### Docker For Desktop

Docker makes local desktop running repeatable and stable.

### Native Android

Native Android gives true phone-local offline tracking.

### GitHub Release

GitHub Release makes the Android APK discoverable from GitHub mobile and desktop.

---

## 17. Current Final Structure

Important project structure:

```text
course/
  AI_Systems_Builder_Roadmap.md

app/
components/
lib/
prisma/
scripts/
docs/security/
public/

android/
  app/
  releases/
    AI-Systems-Builder.apk
    AI-Systems-Builder.apk.sha256

Dockerfile
docker-compose.yml
README.md
LICENSE
CONTENT_LICENSE.md
SECURITY.md
```

---

## 18. Simple Summary

AI Systems Builder is now a complete local-first learning product.

It includes:

- a 12-month AI Systems Builder course roadmap;
- a local web dashboard to track execution;
- Docker setup for desktop use;
- a native offline Android app;
- a proper GitHub repository;
- a GitHub Release with installable APK;
- backup/export support;
- security hardening;
- separate licenses for code and course content.

The final result is a complete course-plus-tracking system for someone learning to become an AI Systems Builder.
