# PFM Frontend Portal

**Palestinian Forum Malaysia (PFM)** — official member & operations portal frontend.
A public marketing site plus role-scoped dashboards (Admin, Staff, Beneficiary) for managing
projects, applications, beneficiaries, staff, content, and donations.

Built with React, Tailwind CSS, and React Router v6.

---

## Tech Stack

| Layer         | Technology                              |
|---------------|------------------------------------------|
| Framework     | React 19                                 |
| Routing       | React Router v6                          |
| Styling       | Tailwind CSS v3                          |
| HTTP client   | Axios                                    |
| i18n          | i18next / react-i18next (English + Arabic, RTL) |
| Charts        | ApexCharts (react-apexcharts)            |
| Icons         | react-icons (Material Design set)        |
| Build tool    | Create React App (react-scripts)         |
| File storage  | DigitalOcean Spaces via presigned URLs   |
| Deployment    | Vercel                                   |

---

## Getting Started

**Prerequisites:** Node.js LTS

```bash
# 1. Clone the repo
git clone https://github.com/adnanmadi241/pfm-frontend.git
cd pfm-frontend

# 2. Install dependencies
npm install

# 3. Start the dev server (uses .env.development)
npm run dev
```

App runs at **http://localhost:3000**.

---

## Scripts

| Command                | Description                                        |
|-------------------------|----------------------------------------------------|
| `npm run dev` / `start` | Start dev server against `.env.development`        |
| `npm run start:staging` | Start dev server against `.env.staging`             |
| `npm run build`         | Production build using `.env.development` → `/build` |
| `npm run build:staging` | Build using `.env.staging`                          |
| `npm run build:prod`    | Build using `.env.production`                       |
| `npm test`               | Run test suite                                     |
| `npm run pretty`         | Format code with Prettier                          |

---

## Project Structure

```
src/
├── assets/
│   └── branding/            # LOGO.jpg, LOGO-wbg.png
├── components/
│   ├── ui/                  # Reusable primitives — Button, DataTable, PageHeader,
│   │                        #   AlertBanner, Loading, InfoRow, StorageImage,
│   │                        #   StorageFileLink, toast system, dashboard widgets
│   ├── form/                # InputField, SelectField, ToggleInput, StorageImageField,
│   │                        #   StorageDocumentField, StorageCoverField, upload hooks
│   ├── features/            # One folder per domain feature, each with its own
│   │   ├── auth/            #   components/, hooks/, services/ (and constants where needed)
│   │   ├── users/           # Super Administrator accounts
│   │   ├── staff/
│   │   ├── beneficiaries/
│   │   ├── projects/
│   │   ├── applications/
│   │   ├── opportunities/ & opportunityApplications/
│   │   ├── partnerships/
│   │   ├── branches/
│   │   ├── categories/ & classifications/
│   │   ├── news/ & blogs/ & events/
│   │   ├── newsletter/
│   │   ├── feedback/
│   │   ├── contactMessages/
│   │   ├── stats/
│   │   ├── profile/         # Self-service "My Profile" (all roles)
│   │   └── storage/         # Presigned upload/download to DigitalOcean Spaces
│   ├── public/               # Public-site sections (home, projects, news, blogs, events, …)
│   ├── navbar/, sidebar/, footer/, layouts pieces
│   └── loading/, empty states
├── layouts/
│   ├── public/               # Marketing site chrome
│   ├── auth/                 # Sign in / register / password flows
│   ├── admin/                 # Admin sidebar + routing shell
│   ├── staff/                 # Staff sidebar + routing shell
│   └── beneficiary/           # Beneficiary sidebar + routing shell
├── views/
│   ├── public/                # Home, About, Projects, News, Blogs, Events, Donate,
│   │                          #   Opportunities, Contact, Newsletter, Register
│   ├── auth/                   # Sign in, register, forgot/reset/change/set password
│   ├── admin/                  # Full CRUD views for every admin-managed resource
│   ├── staff/                  # Staff dashboard (shares most admin resource views)
│   └── beneficiary/            # Dashboard, requests, projects, events, opportunities, profile
├── locales/
│   ├── en.json
│   └── ar.json                 # Namespaced per feature, kept in lockstep with en.json
├── routes.js                    # Route table (path, layout, role, sidebar section/children)
└── services/app.js              # Axios instance (REACT_APP_API_URL base, auth interceptors)
```

---

## Roles & Layouts

| Layout        | Base path       | Who                                             |
|----------------|------------------|-------------------------------------------------|
| Public         | `/`              | Anonymous visitors                              |
| Auth           | `/auth`          | Sign in / register / password recovery          |
| Admin          | `/admin`         | Super Administrators — full system access       |
| Staff          | `/staff`         | Staff — day-to-day content & case management    |
| Beneficiary    | `/beneficiary`   | Aid recipients — self-service portal            |

Route access, sidebar grouping (`MAIN` / `COMMUNITY` / `SYSTEM` / `ACCOUNT`), and per-role
visibility are all defined centrally in `src/routes.js`.

---

## Features

### Public site
Home, About, Projects (list + detail + apply), News, Blogs, Events, Opportunities, Donate,
Contact, Newsletter signup, and beneficiary self-registration.

### Admin (Super Administrator)
Projects (incl. gallery, milestones, updates), Applications, Beneficiaries, Staff, Super
Administrators, Partnerships, Branches, Categories & Classifications, News, Blogs, Events,
Newsletter (subscribers + notifications), Opportunities & Applications, Contact Messages,
Feedback, and org-wide dashboard stats.

### Staff
The same content/case-management surface as Admin, minus system-level resources
(Super Administrator accounts).

### Beneficiary
Personal dashboard, project applications ("My Requests"), browsing Projects/Events/
Opportunities, and a self-service profile.

### Shared
- **Self-service profile** (`/…/profile`, all roles) — edit contact details, WhatsApp/2FA
  preferences, and for staff/admin, banking & financial information; profile photo updates
  save instantly.
- **File uploads** — every upload (images and documents) goes through a presigned-URL flow
  directly to DigitalOcean Spaces; the backend only ever stores a `file_key`.
- **i18n** — full English/Arabic support with RTL layout.

---

## File Uploads & Storage

All file handling follows one pattern, end to end:

1. Request a presigned upload URL from the backend.
2. Upload the file directly to DigitalOcean Spaces using that URL.
3. Store only the returned `file_key` in form state and send it to the backend.
4. To display a file later, resolve a fresh presigned download URL from the `file_key`
   (images may use an embedded public URL shortcut; documents always resolve fresh).

Reusable building blocks: `StorageImageField` / `StorageDocumentField` / `StorageCoverField`
(upload), and `StorageImage` / `StorageFileLink` (display) — see `components/form/upload/`
and `components/ui/`.

---

## Deployment (Vercel)

The project is pre-configured for Vercel via `vercel.json`, including a strict
Content-Security-Policy and standard security headers (`X-Frame-Options`, HSTS,
`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).

**Deploy steps:**
1. Push to GitHub.
2. Import the repo on [vercel.com](https://vercel.com).
3. Set the environment variables below in Vercel project settings.
4. Vercel auto-detects CRA and builds with `CI=false react-scripts build`.

---

## Environment Variables

Local development reads from `.env.development` (default) or `.env.staging` (via
`npm run start:staging` / `build:staging`) — both are committed since they only point at the
staging API. Production values live in `.env.production`, which is **not** committed; set
them in Vercel instead. Use `.env.example` as the reference for what's required.

| Variable                | Description                                                                 |
|--------------------------|------------------------------------------------------------------------------|
| `REACT_APP_API_URL`      | Backend API base URL (e.g. `https://staging-api.pfmy.org/api/v1`)           |
| `INLINE_RUNTIME_CHUNK`   | Must be `false` — otherwise CRA inlines the webpack runtime as an inline `<script>`, which the strict CSP `script-src 'self'` blocks |

---

## Brand

| Asset              | Path                                |
|---------------------|--------------------------------------|
| Logo (white bg)     | `src/assets/branding/LOGO-wbg.png`  |
| Logo (solid)        | `src/assets/branding/LOGO.jpg`      |
| Brand green         | `#007A3D`                            |

---

## License

© 2026 Palestinian Forum Malaysia (PFM). All rights reserved.
