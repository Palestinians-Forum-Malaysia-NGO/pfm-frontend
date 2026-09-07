# PFM Frontend Portal

**Palestinian Forum Malaysia (PFM)** — official member portal frontend.  
Built with React, Tailwind CSS, and React Router v6.

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Framework   | React 19                          |
| Routing     | React Router v6                   |
| Styling     | Tailwind CSS v3                   |
| Icons       | react-icons (MD + FI + FA)        |
| Build tool  | Create React App (react-scripts)  |
| Deployment  | Vercel                            |

---

## Getting Started

**Prerequisites:** Node.js LTS

```bash
# 1. Clone the repo
git clone https://github.com/adnanmadi241/pfm-frontend.git
cd pfm-frontend

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

App runs at **http://localhost:3000**

---

## Scripts

| Command           | Description                        |
|-------------------|------------------------------------|
| `npm run dev`     | Start development server           |
| `npm start`       | Alias for dev server               |
| `npm run build`   | Production build → `/build`        |
| `npm test`        | Run test suite                     |
| `npm run pretty`  | Format code with Prettier          |

---

## Project Structure

```
src/
├── assets/
│   └── brand/              # LOGO.jpg, LOGO-wbg.png
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── buttons/        # Button, IconButton, RowIconButton, PrevButton, NextButton
│   │   ├── modals/         # Modal (base), ConfirmModal
│   │   ├── form/           # FormHeader
│   │   ├── PageHeader.jsx
│   │   ├── FilterSelect.jsx
│   │   ├── ComingSoon.jsx
│   │   └── ComingSoonPage.jsx
│   ├── form/               # InputField, PasswordField, SelectField, SearchInput, ToggleInput …
│   ├── features/
│   │   └── users/          # useUsers hook, userService, UserDeleteModal
│   ├── home/               # ComingSoon (public landing page)
│   ├── navbar/
│   ├── sidebar/
│   ├── footer/
│   ├── loading/
│   └── empty/
├── layouts/
│   ├── admin/              # Admin layout + routes
│   ├── manager/            # Manager layout
│   ├── member/             # Member layout
│   └── public/             # Public layout
├── views/
│   ├── admin/
│   │   ├── default/        # Dashboard
│   │   ├── users/          # Users CRUD (index, create, detail, edit)
│   │   ├── profile/
│   │   └── placeholder/    # Coming soon for unbuilt sections
│   ├── manager/
│   ├── member/
│   └── public/
│       └── home/           # Public landing page
├── routes.js               # Route definitions with sidebar children
└── constants/
```

---

## Layouts & Routes

| Layout  | Base path      | Role        |
|---------|----------------|-------------|
| Public  | `/`            | Visitors    |
| Admin   | `/admin`       | Admins      |
| Manager | `/manager`     | Managers    |
| Member  | `/member`      | Members     |

---

## Features

### ✅ Built
- **Users** — full CRUD: list with filters/search/pagination, create, view detail, edit, delete modal
- **Public home** — Coming Soon landing page with email notification
- **UI system** — reusable Modal, ConfirmModal, Button variants, SearchInput, FilterSelect, PageHeader, FormHeader, ComingSoonPage

### 🚧 Coming Soon
- Members management
- Events
- Donations
- Reports

---

## Reusable Components

### Buttons
```jsx
<Button variant="primary | secondary | ghost | danger" text="..." icon={...} />
<RowIconButton variant="default | primary | danger" icon={...} onClick={...} />
```

### Modal
```jsx
<Modal open={open} onClose={onClose} title="..." size="sm | md | lg | xl" footer={...}>
  {/* body content */}
</Modal>

<ConfirmModal open={open} onClose={onClose} onConfirm={fn}
  title="..." message="..." confirmText="..." confirmVariant="danger" />
```

### Forms
```jsx
<InputField    label="..." field="name"  formData={...} errors={...} updateFormData={...} />
<SelectField   label="..." field="role"  options={[...]} formData={...} errors={...} updateFormData={...} />
<PasswordField label="..." field="pass"  formData={...} errors={...} updateFormData={...} />
<ToggleInput   label="..." field="active" formData={...} updateFormData={...} />
<SearchInput   value={...} onChange={fn} placeholder="..." />
<FilterSelect  value={...} onChange={fn} options={[...]} />
```

### Coming Soon
```jsx
// Section-level placeholder
<ComingSoon title="Reports" />

// Full-page route placeholder
<ComingSoonPage title="Events" icon={<MdEvent />} backPath="/admin/default" />
```

---

## Deployment (Vercel)

The project is pre-configured for Vercel via `vercel.json`:

```json
{
  "buildCommand": "CI=false npm run build",
  "outputDirectory": "build",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Deploy steps:**
1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Vercel auto-detects CRA — click Deploy

---

## Environment Variables

Copy `.env.example` to `.env.local` for local development:

```bash
cp .env.example .env.local
```

| Variable             | Description              |
|----------------------|--------------------------|
| `REACT_APP_API_URL`  | Backend API base URL     |

Set these in **Vercel → Project → Settings → Environment Variables** for production.

---

## Brand

| Asset              | Path                        |
|--------------------|-----------------------------|
| Logo (white bg)    | `src/assets/brand/LOGO-wbg.png` |
| Logo (solid)       | `src/assets/brand/LOGO.jpg`     |
| Brand green        | `#007A3D`                       |

---

## License

© 2025 Palestinian Forum Malaysia (PFM). All rights reserved.
