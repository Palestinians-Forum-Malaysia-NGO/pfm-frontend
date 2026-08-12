# pfm-frontend — folder structure

React (CRA) + Tailwind CSS frontend for Palestinian Forum Malaysia. Feature-module
architecture — most business logic lives under `src/components/features/`, not
under `src/views/`. See `README.md` for tech stack, scripts, and env setup.

## `src/components/features/<feature>/`

Each domain feature (`applications`, `auth`, `beneficiaries`, `blogs`, `branches`,
`categories`, `classifications`, `contact`, `eventRegistrations`, `events`,
`feedback`, `news`, `newsletter`, `opportunities`, `opportunityApplications`,
`partnerships`, `profile`, `projects`, `staff`, `stats`, `storage`, `users`) follows
the same shape:

- `components/` — the feature's forms/lists/detail views (e.g. `StaffCreateForm.jsx`,
  `StaffList.jsx`, `StaffDetailView.jsx`, `StaffEditForm.jsx`)
- `hooks/` — one hook per API operation (`useGetStaff`, `useCreateStaff`,
  `useUpdateStaff`, `useDeleteStaff`, `useDeleteStaff`), re-exported from
  `hooks/index.js`
- `services/` — a single `<feature>Service.js` wrapping `services/app.js` (the shared
  axios instance) for that resource's endpoints
- occasionally `constants/` for feature-local lookup data (e.g.
  `beneficiaries/constants/countries.js`)

`auth` is the one feature with extra subfolders: `context/` (AuthContext),
`types/` (role constants), `utils/` (token storage, `extractError`).

New feature work should add to an existing feature folder, or create a new one in
this exact shape — don't invent a different layout.

## `src/views/<role>/<feature>/`

Route-level pages only — `index.jsx` (list), `Create.jsx`, `Edit.jsx`, `Detail.jsx`.
These are thin wrappers that render the real component from
`components/features/<feature>/components/`; no business logic belongs here.
`src/routes.js` is the single source of truth wiring path → layout → component →
sidebar nav entry.

## `src/layouts/` (role-scoped)

Five layouts, each with a matching `src/views/<name>/` tree: `public`, `auth`,
`admin`, `staff`, `beneficiary`. There is no "manager"/"member" layout despite those
roles appearing in some older docs/constants — only the five above are real.

## `src/components/ui/` vs `src/components/form/`

- `ui/` — generic, non-form display primitives: `PageHeader`, `InfoRow`,
  `AlertBanner`, `DataTable`, `StorageImage`, `StorageFileLink`, `UserProfileCard`,
  plus `buttons/`, `modals/`, `toast/`, `dashboard/` subfolders.
- `form/` — controlled form inputs (`InputField`, `SelectField`, `ToggleInput`,
  `TextareaField`, `SearchableSelect`, …), all sharing the
  `{ formData, errors, updateFormData, rules }` prop contract, plus:
  - `form/upload/` — the presigned-storage upload fields (`StorageImageField`,
    `StorageDocumentField`, `StorageCoverField`) and the shared `useStorageUpload`
    hook they wrap
  - `form/utils/validation.js` — the shared `validate(value, rules)` rule engine
    every form field uses

## File upload/display — always reuse, never reinvent

Canonical pattern (full explanation in `README.md`): request a presigned URL →
upload straight to DigitalOcean Spaces → store only the `file_key`. Upload with
`StorageImageField` / `StorageDocumentField` / `StorageCoverField`; display with
`StorageImage` (images) or `StorageFileLink` (documents/PDFs, via
`useStorageUrl(fileKey, { forcePresigned: true })`). Never read `.public_url` off an
API object directly in JSX — always go through these components/hooks so the
`isSafeUrl` check and presigned-URL fallback apply.

## `src/locales/`

`en.json` / `ar.json` — always edited together, one key set per feature namespace
(top-level keys like `"users"`, `"staff"`, `"projects"`). After any edit, validate
both with:
```
node -e "JSON.parse(require('fs').readFileSync('src/locales/en.json'))"
node -e "JSON.parse(require('fs').readFileSync('src/locales/ar.json'))"
```

## Everything else

- `src/hooks/` (top-level) — cross-cutting hooks used by many features:
  `useLayoutBase`, `useInView`. Feature-specific hooks belong in the feature's own
  `hooks/` folder instead.
- `src/utils/` — small stateless helpers not tied to one feature: `url.js`
  (`isSafeUrl`), `eventApplications.js`.
- `src/components/charts/apexConfig.js` — shared ApexCharts option builders
  (`donutOpts`, color palettes) reused by dashboard widgets.
- `src/services/app.js` — the single axios instance (base URL, auth-token request
  interceptor, refresh-token-on-401 response interceptor). Every feature service
  imports this; never create a second axios instance.
- `src/constants/lists.js` — shared static lookup lists (e.g. `COUNTRIES`,
  `NATIONALITIES`) used across features.
- `src/variables/charts.js`, `src/types/auth.ts` — leftover from the original
  Horizon UI template, confirmed unused. Don't add to these; if you need chart
  variables or TS types, use `components/charts/apexConfig.js` or plain JS
  respectively (the app is not set up for TypeScript despite this one stray file).
