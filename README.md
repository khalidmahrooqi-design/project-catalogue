# مشاريعي · My projects

Khalid Al Mahrouqi’s Arabic-first public project catalogue, with an English interface, light/dark modes, search, category filters, project details, and task updates. Tajawal and Manrope are self-hosted under their included SIL Open Font Licenses.

**Website:** https://khalidmahrooqi-design.github.io/project-catalogue/

## Run locally

No dependency installation or build is required. Use Node.js 24 and Python 3:

```sh
npm run validate
npm test
npm start
```

Open `http://127.0.0.1:5179`. Serve `site/`, not the repository root.

## Catalogue updates

`site/data/catalogue.json` contains public content only. Company and app names initially come from the owner’s confirmed catalogue scope. A `listed` status does not assert operational progress. Do not commit private records, local paths, transcripts, credentials, or internal sources. All repository history is public.

Use stable IDs to avoid duplicate projects and task updates. Titles, names and summaries must include `ar` and `en`. Task states are `planned`, `active`, `completed`, `paused` or `blocked`; project states are `listed`, `active`, `live`, `paused` or `completed`. Dates use ISO format and are recorded in Asia/Muscat.

An update can be sent as JSON on stdin:

```sh
node scripts/catalogue.mjs upsert task < public-task.json
npm run validate
npm test
```

Use `companyId` on an application or project to identify its parent company; the referenced entry must have `kind: "company"`. ABS ERP belongs to ABS (`companyId: "abs"`); `group` records the broader catalogue grouping.

A task entry has `id`, `projectId`, `title: {ar, en}`, `summary: {ar, en}`, `status`, `date`, and `visibility: "public"`. The updater rejects unexpected fields, private entries, known credential/path patterns, duplicate IDs, and missing project references. It is a validation aid, not a substitute for reviewing public text.

Before editing, fetch the latest `main` and preserve changes from other sessions. Stage only the intended public files. A push to `main` triggers validation and GitHub Pages publication. Confirm both workflow success and live data before reporting a change as published. The workflow follows [GitHub’s Pages instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

The owner’s local catalogue instructions and verification screenshots are excluded from Git. The website does not read private project folders, access Codex chats, or run a background sync. Future sessions publish summaries when the owner’s catalogue instructions are loaded. Earlier task history is not bulk imported.
