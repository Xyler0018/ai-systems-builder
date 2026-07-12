# AI Systems Builder

Course plan and local-first dashboard for a 12-month AI Systems Builder roadmap.

AI Systems Builder is a complete learning system for becoming a practical AI Engineer / AI Generalist with specialization in RAG and AI automation systems. The repository includes the full course roadmap plus a local dashboard for tracking execution, weekly progress, projects, resources, skills, and review habits.

## What Is Included

- **Course roadmap:** the full 12-month AI Systems Builder plan in [course/AI_Systems_Builder_Roadmap.md](course/AI_Systems_Builder_Roadmap.md).
- **Local-first dashboard:** a Next.js app for tracking roadmap progress, daily logs, weekly execution, projects, resources, tools, skills, checkpoints, and settings.
- **Android app:** a native offline mobile dashboard available from the GitHub Releases section.
- **Docker setup:** a local production-style container with SQLite persistence.
- **Security notes:** local-first hardening docs under [docs/security](docs/security).
- **App identity:** robotic-head logo and installable web app manifest.

## Who This Is For

This repository is for learners who want to build useful AI systems instead of only studying theory. It is aimed at people working toward:

- AI Engineer / AI Generalist capability
- LLM application development
- RAG systems
- AI automation systems
- FastAPI, Docker, database, and deployment practice
- practical portfolio projects

## Course Direction

The roadmap is organized around one practical route:

> AI Engineer / AI Generalist / LLM App Developer / AI Automation Engineer, specializing into RAG + AI Automation Systems Specialist.

The course plan emphasizes weekly working outputs, portfolio projects, documentation, debugging, evaluation, and production engineering habits.

Start with the course document:

[Open the AI Systems Builder Roadmap](course/AI_Systems_Builder_Roadmap.md)

## Dashboard Features

The dashboard helps you execute the roadmap instead of letting it sit as a document. It includes modules for:

- command center overview
- roadmap tracking
- weekly execution
- daily logs
- projects
- skills
- resources
- tools
- rules
- checkpoints
- settings, export, and restore

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite
- Docker
- Lucide icons
- Recharts
- Zod validation

## Run Locally With Docker

From the project folder:

```bash
docker compose up -d --build
```

Open:

```text
http://127.0.0.1:3001
```

The SQLite database is stored in the Docker volume `ai-systems-builder-data`. On first startup, the container creates the database and seeds the roadmap data automatically.

Stop the app:

```bash
docker compose stop
```

Start it again:

```bash
docker compose up -d
```

Reset the Docker database:

```bash
docker compose down -v
docker compose up -d --build
```

View logs:

```bash
docker compose logs -f
```

## Automatic Local Startup

The compose service uses `restart: unless-stopped`. To have the dashboard come back after reboot, enable Docker Desktop startup:

`Settings -> General -> Start Docker Desktop when you sign in`

After Docker Desktop starts, the container should restart automatically unless you manually stopped it.

## Install As A Chrome App

After the app is running, open:

```text
http://127.0.0.1:3001
```

Use Chrome's install option from the address bar or browser menu. The included web manifest points to the robotic-head app icon in `public/robot-head.svg`.

If Chrome previously installed the app with a fallback letter icon, uninstall the old Chrome app and install it again after rebuilding.

## Android Offline App

This repository also includes a native Android app in [android/](android/). It is a local-first mobile version of the dashboard built with Kotlin, Jetpack Compose, Material 3, Room SQLite, AndroidX Navigation, and Kotlin serialization.

Download the latest installable APK from GitHub Releases:

[AI Systems Builder Android v1.0.0](https://github.com/Xyler0018/ai-systems-builder/releases/latest)

Direct APK file in the repository:

[android/releases/AI-Systems-Builder.apk](android/releases/AI-Systems-Builder.apk)

The Android app:

- works offline after install
- stores data locally on the phone in Room SQLite
- does not require Docker, the desktop dashboard, a server, login, or cloud database
- includes the AI Systems Builder roadmap seed data
- supports manual JSON backup export/import for moving data between devices

After downloading the APK on Android, open it and allow installation from your browser or file manager if Android asks. This is normal for APKs installed outside the Play Store.

Checksum file: [AI-Systems-Builder.apk.sha256](android/releases/AI-Systems-Builder.apk.sha256)

Open the `android/` folder in Android Studio and run the `app` configuration on an emulator or Android device.

## Local Development Without Docker

Install dependencies:

```bash
npm install
```

Create an environment file:

```bash
cp .env.example .env
```

Apply the SQLite schema and seed data:

```bash
npm run db:apply
npm run seed
```

Run the dev server:

```bash
npm run dev
```

## Checks

```bash
npm run lint
npm run typecheck
npm run build
npm run test:security
```

## Data Backup And Restore

Exports are available from module pages and settings:

- Roadmap JSON: `/api/export/roadmap`
- Daily logs CSV: `/api/export/daily-logs`
- Weekly reviews CSV: `/api/export/weekly-reviews`
- Projects CSV: `/api/export/projects`
- Full backup JSON: `/api/export/backup`

Restore a previous backup from Settings.

## Security Model

This is a local-first single-user learning system. Remote access is blocked by default unless explicitly configured. Review [SECURITY.md](SECURITY.md) and [docs/security](docs/security) before exposing it beyond localhost.

## Licensing

- Dashboard source code is licensed under the [MIT License](LICENSE).
- Roadmap/course content is licensed under [CC BY-NC 4.0](CONTENT_LICENSE.md).

This means the code can be reused under MIT terms, while the course material can be shared and adapted for non-commercial use with credit.
