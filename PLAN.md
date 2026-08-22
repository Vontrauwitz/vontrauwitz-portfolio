# PLAN.md — Vontrauwitz Portfolio: Codebase Analysis & Modernization Plan

> Status: **Phase 0 complete** (hygiene: bug fixes, dead-boilerplate removal, README rewrite). Phases 1+ not started. This document describes the codebase as it exists today and proposes a phased, incremental modernization path toward the future goals (admin dashboard, auth, CMS-style content management, analytics, Job Application Studio, premium animations).

---

## 1. Current Architecture & Folder Structure

This is a **Next.js Pages Router** project (not App Router), using **JavaScript** (no TypeScript, despite `@types/react` being present as a dev dependency — likely just for editor IntelliSense).

```
vontrauwitz-portfolio/
├── public/
│   ├── All-Texts/              # "CMS" — all hardcoded content lives here as JS modules
│   │   ├── projectConst.js     # Projects data (JSX embedded in data!)
│   │   ├── skillsConst.js      # Skills data (frontend/backend/tools), JSX icons embedded
│   │   ├── expConst.js         # Work experience data
│   │   ├── eduConst.js         # Education data
│   │   ├── certConst.js        # Certificates data (fullstack/frontend/backend/misc)
│   │   └── testimonialConst.js # Testimonial cards data
│   ├── images/                 # ~100 static images (profile, projects, certs, testimonials, contact, svgs)
│   ├── cv_hans_trauwitz_portfolio.pdf
│   └── favicon.ico, next.svg, vercel.svg, thirteen.svg (unused Next.js boilerplate)
├── src/
│   ├── pages/                  # Pages Router — file-based routing
│   │   ├── _app.js             # Global App shell: fonts, NavBar/Footer, AnimatePresence
│   │   ├── _document.js        # Custom Document: injects dark-mode script before hydration
│   │   ├── index.js            # Home page ("/")
│   │   ├── about.js             # About page — embeds Skills, Experience, Education, Testimonials
│   │   ├── projects.js          # Projects grid page
│   │   ├── certificates.js      # Certificates page (tabbed gallery)
│   │   ├── contact.js           # Contact form + image carousel
│   │   └── api/
│   │       └── contact.js       # Single API route: POST → sends email via Nodemailer
│   ├── components/              # Presentational + a few "smart" components
│   │   ├── AnimatedText.js       # Word-by-word stagger text animation (Framer Motion)
│   │   ├── Education.js         # Renders eduConst timeline
│   │   ├── Experience.js        # Renders expConst timeline
│   │   ├── Skills.js             # Tabbed skills grid
│   │   ├── Testimonials.js       # Testimonial cards
│   │   ├── Footer.js
│   │   ├── NavBar.js             # Desktop + mobile nav, theme toggle, social links
│   │   ├── Layout.js             # Simple padding/width wrapper
│   │   ├── LilIcon.js            # Scroll-progress circular indicator (used in timelines)
│   │   ├── Logo.js                # Animated logo (GIF avatar + Framer Motion Link wrapper)
│   │   ├── Icons.js               # ~2000 lines: dozens of inline SVG icon components
│   │   ├── TransitionEffect.js    # Page-transition overlay (3 colored panels sliding)
│   │   ├── TypingCode.js          # **Dead code** — defined, never imported anywhere
│   │   └── hooks/
│   │       └── useThemeSwitcher.js # Dark/light mode hook (localStorage + matchMedia)
│   ├── lib/
│   │   └── api.js                # `sendContactForm` — thin fetch wrapper for the contact API
│   ├── config/
│   │   └── nodemailer.js         # Nodemailer transporter (Gmail) + mailOptions
│   └── styles/
│       ├── globals.css           # Just the 3 Tailwind directives
│       └── Home.module.css       # **Dead file** — leftover from `create-next-app`, unused
├── next.config.js                # Minimal: `reactStrictMode: true` only
├── tailwind.config.js             # Custom colors (dark/light/primary/primaryDark), custom max-width breakpoints
├── postcss.config.js
├── jsconfig.json                  # `@/*` → `./src/*` path alias
├── .eslintrc.json                  # `next/core-web-vitals` only
├── .env.local                      # EMAIL, EMAIL_PASS, NEXT_PUBLIC_MAPS_API_KEY
└── README.md                       # **Corrupted/mistaken file** — contains raw JS (an old draft of projects.js), not actual documentation
```

**Content model today:** there is no CMS, no database. "Content management" = editing `.js` files under `public/All-Texts/` and re-deploying. Several of these files embed **JSX directly inside data objects** (e.g., `icon: <GithubIcon />` in `projectConst.js`, `summary: <div>...</div>` with `<strong>` tags), which tightly couples content to React and will need to be restructured before any admin/CMS work.

---

## 2. Next.js Version & Routing Architecture

- **Next.js 13.2.4** (`package.json`) — this is the version that *introduced* the App Router as opt-in, but this project uses the **legacy Pages Router exclusively** (`src/pages/`). There is no `src/app/`.
- **React 18.2.0 / react-dom 18.2.0.**
- Routing is fully file-based and flat: `/`, `/about`, `/projects`, `/certificates`, `/contact`, plus one API route `/api/contact`. No dynamic routes (`[slug].js`), no nested layouts beyond the single `_app.js` shell, no middleware, no route groups.
- `next/font/google` (Montserrat) is used via the modern `next/font` API — this part is already current for a 13.x app.
- No `getStaticProps`/`getServerSideProps`/`getStaticPaths` anywhere — every page is a plain client-rendered functional component (effectively CSR-only content, despite being SSR-capable by framework default). This matters for future dynamic content (projects from a DB) — it will need data-fetching patterns added.

**Migration implication:** moving to the App Router is a separate, non-trivial project decision (routing conventions, data fetching model, Route Handlers instead of `pages/api`, Server Components). Given the "incremental, no full rewrite" constraint, see the phased plan (Section — Modernization Plan) for how to sequence this.

---

## 3. Main Dependencies & Their Purpose

| Package | Version | Purpose | Notes |
|---|---|---|---|
| `next` | 13.2.4 | Framework | 2+ major versions behind current (15.x) |
| `react` / `react-dom` | 18.2.0 | UI library | Current major (18), fine to stay for now |
| `framer-motion` | ^10.6.0 | All animations: page transitions, text stagger, scroll-linked progress, hover/tap micro-interactions | Central to visual identity — **must preserve** |
| `react-slick` + `slick-carousel` | ^0.30.2 / ^1.8.1 | Image carousel on Contact page | jQuery-era library; CSS imported directly from `node_modules` |
| `react-toastify` | ^9.1.3 | Toast notification after contact form submit | Used only in `contact.js` |
| `nodemailer` | ^6.9.3 | Sends contact-form emails via Gmail SMTP, used server-side in `pages/api/contact.js` | Credentials via `.env.local` (`EMAIL`, `EMAIL_PASS` — a Gmail app password) |
| `@fortawesome/free-brands-svg-icons`, `@fortawesome/react-fontawesome` | ^6.4.0 / ^0.2.0 | **Unused** — no imports found anywhere in `src/` | Dead dependency |
| `animate.css` | ^4.1.1 | **Unused** — no imports/class usage found | Dead dependency |
| `@googlemaps/js-api-loader`, `@types/google.maps` | ^1.16.6 / ^3.55.7 | **Unused** — no code references them, but `NEXT_PUBLIC_MAPS_API_KEY` exists in `.env.local` | Likely scaffolding for the planned "location/map section" that was never built |
| `tailwindcss` | ^3.3.2 | Styling — utility classes throughout, dark mode via `class` strategy | |
| `eslint` / `eslint-config-next` | 8.36.0 / 13.2.4 | Linting, matches Next 13 | |

**Dead/unused dependencies to prune:** `@fortawesome/*`, `animate.css`, `@googlemaps/js-api-loader`, `@types/google.maps` (unless the map section is built soon, in which case keep the maps loader and finally wire it up).

---

## 4. Existing Animations & Where They Live

All animation is done via **Framer Motion** (`motion` components, `AnimatePresence`, `useScroll`, `useMotionValue`, `useSpring`, `useInView`). No CSS-keyframe animation libraries are actually in use (animate.css is dead weight).

| Animation | File | Mechanism |
|---|---|---|
| Word-by-word heading reveal | `components/AnimatedText.js` | `variants` with `staggerChildren`, used on every page's H1 |
| Page transition overlay (3 sliding color panels) | `components/TransitionEffect.js` | 3 stacked `motion.div`s animating `x`/`width` with staggered `delay` (0, 0.2, 0.4s), rendered per-page (not global) |
| Route-level enter/exit orchestration | `pages/_app.js` | `<AnimatePresence mode="wait">` wrapping `<Component key={router.asPath} />` |
| Animated counters | `pages/about.js` (`AnimatedNumber`, currently unused/no visible caller in the JSX but defined) | `useMotionValue` + `useSpring`, updates a ref's `textContent` imperatively on `"change"` |
| Scroll-linked timeline progress bar | `components/Experience.js`, `components/Education.js` | `useScroll({ target: ref, offset: [...] })` driving a `scaleY` transform on a vertical line |
| Scroll-linked circular "node" indicator | `components/LilIcon.js` | `useScroll` driving `pathLength` on an SVG circle, used inside each Experience/Education list item |
| Scroll-triggered slide-up on view | `components/Skills.js`, `components/Testimonials.js` | `whileInView={{ y: 0 }}` from an initial `y` offset |
| Nav underline hover/active indicator | `components/NavBar.js` (`CustomLink`) | Plain CSS transition (`transition-[width]`), not Framer Motion |
| Mobile menu open/close | `components/NavBar.js` | `motion.div` with `initial`/`animate` scale+opacity, plus manual `isOpen` state and click-outside handling |
| Icon hover/tap micro-interactions | `components/NavBar.js` (social icons), `components/Logo.js` | `whileHover={{ y: -2 }}`, `whileTap={{ scale: 0.9 }}` |
| Theme toggle icon swap | `components/NavBar.js` + `hooks/useThemeSwitcher.js` | Conditional render of `SunIcon`/`MoonIcon`, no motion on the swap itself |
| Dark-mode flash prevention | `pages/_document.js` | Inline `<Script beforeInteractive>` that reads `localStorage`/`matchMedia` before paint |
| Dead/unused animation | `components/TypingCode.js` | Fully built typewriter-style text cycler using Framer Motion opacity variants — **not imported anywhere**, orphaned |

**Visual identity note:** The `TransitionEffect` (three colored diagonal-feeling panels: `#AC485C`, `#EF9E34`, `#2F889E`) is the site's signature transition and is explicitly called out by the user as "aggressive" and slated for replacement — but it is currently the primary carrier of "personality" for route changes, so its replacement needs equal presence, not just removal.

---

## 5. Existing Page Transitions

- Global orchestration: `_app.js` wraps every routed `<Component>` in `<AnimatePresence mode="wait">`, keyed by `router.asPath`. This forces exit animations to complete before the next page mounts.
- Each page **individually** renders `<TransitionEffect />` at the top of its JSX (`index.js`, `projects.js`, `certificates.js`, `contact.js` all do this — **`about.js` does not**, which is an existing inconsistency/bug: navigating to `/about` shows no transition overlay).
- The transition itself has no exit animation defined on 2 of its 3 layers (only the first `motion.div` has an `exit` prop) — meaning on route-out, two of the three color panels don't animate out, they simply unmount. This is likely an unintentional inconsistency rather than a deliberate design choice.
- There's no shared layout persistence (e.g., NavBar/Footer do not animate — they're outside the `AnimatePresence` boundary in `_app.js`, which is correct and worth preserving as-is).

---

## 6. Where Content Is Hardcoded

All content lives in **plain JS files under `public/All-Texts/`**, imported directly into components/pages at build time (not via `getStaticProps` — via literal `import`/`require`, meaning content changes require a full redeploy):

| Content type | File | Shape | Notes |
|---|---|---|---|
| Projects | `public/All-Texts/projectConst.js` | Array of `{ type, title, summary, img, link, icon, iconWeb }` | `title`/`summary` are sometimes **JSX elements**, not strings (e.g., wraps text in `<div><strong>`) — this breaks the "just data" assumption and will complicate any admin CRUD or JSON-based storage |
| Skills | `public/All-Texts/skillsConst.js` | 3 arrays (`frontend`, `backend`, `tools`) of `{ name, link, description, icon }` | `icon` is a JSX element referencing one of ~40 hand-built icon components in `Icons.js`; `link` is always `"/"` (never actually links anywhere — dead field) |
| Experience | `public/All-Texts/expConst.js` | Array of `{ position, company, companyLink, time, address, work }` | Plain strings only — easiest of the content types to migrate |
| Education | `public/All-Texts/eduConst.js` | Array of `{ type, schoolLink, time, place, info }` | Plain strings only |
| Certificates | `public/All-Texts/certConst.js` | 4 arrays (`fullstack`, `frontend`, `backend`, `misc`) of `{ title, school, link, issued, image }` | `image` is a static `import` of a PNG — will need actual file upload once admin-managed |
| Testimonials | `public/All-Texts/testimonialConst.js` | Array of `{ id, title, content, img, link }` | Plain strings + static image import |
| CV/Resume | `public/cv_hans_trauwitz_portfolio.pdf` | Static file | Linked directly from `index.js`, both "View" and "Download" buttons point at the same static PDF |
| Personal bio copy | Inline JSX in `pages/index.js` and `pages/about.js` | Paragraphs hardcoded directly in component markup (not even in the `All-Texts` files) | Least structured of all content — literally prose in JSX |

**Implication for the admin dashboard:** none of this is currently backed by a database or API. Every "manage X from admin" future goal requires: (1) a real data store, (2) a data-fetching layer in the app, (3) migrating existing entries out of these JS files into that store, and (4) resolving the JSX-in-data problem (likely by converting `summary`/`title` to rich text or Markdown fields rendered via a safe renderer, and `icon` references to a fixed enum/string key resolved against the existing `Icons.js` catalog).

---

## 7. Existing APIs and Forms

**API surface today is exactly one route:**
- `POST /api/contact` (`src/pages/api/contact.js`): validates required fields (`name`, `email`, `subject`, `message`) with a 400 on missing fields, builds an HTML email body, sends via `nodemailer` (Gmail SMTP, credentials from `.env.local`). No rate limiting, no CAPTCHA/spam protection, no request-size limits, no CSRF concern beyond same-origin fetch. Errors are logged with `console.log` and returned as JSON with the raw error message (`error.message`) — **leaks internal error detail to the client**, worth tightening.

**Forms:**
- **Contact form** (`pages/contact.js`): uncontrolled-ish controlled inputs, client-side validation (`validateForm`) for empty name/subject/message and a regex email check. On submit: validates → optimistically calls `router.push('/')` on a 1.5s timeout **before** actually confirming the email sent (the `router.push` runs regardless of whether the `sendContactForm` promise resolves or rejects, because it's in a bare `setTimeout` outside the `try/catch`) → separately awaits `sendContactForm`, shows a toast, resets form. **Bug:** the user is redirected home even if the email send fails, and the error toast path (`catch` block) never actually shows an error toast to the user — it only `console.error`s. This should be fixed as part of any contact-form work.
- No other forms exist yet (no auth forms, no admin forms — these are 100% future work).

**No existing backend/database, no auth, no session handling, no middleware.** This is a fully static/stateless site aside from the one mail-sending endpoint.

---

## 8. Technical Debt, Bugs, Outdated Patterns, Risky Areas

**Bugs:**
1. Contact form redirects to `/` via `setTimeout` regardless of whether the email actually sent successfully (`pages/contact.js:81-93`) — user sees "success" navigation even on failure, and the catch-block error is silently swallowed (no user-facing error state).
2. `about.js` never renders `<TransitionEffect />`, unlike every other page — inconsistent page-transition behavior when navigating to About.
3. `TransitionEffect`'s 2nd and 3rd panels have no `exit` animation defined, so they pop out abruptly on route change instead of animating out like the 1st panel.
4. `projects.js` `FeaturedProject`: when `link === "/"` (i.e., a project has no real deployed URL — several do: ProFY, Poke App Mobile, Poke App Website, Countries, Food App), the "Visit" link and title-link are suppressed, but the GitHub icon link (`iconWeb`) still renders with `target={iconWeb}` — passing a **URL string as the `target` attribute** instead of `"_blank"`, which is incorrect usage (should be `target="_blank"`) throughout (also present in the working `<Link href={iconWeb} target={iconWeb}>` in `pages/projects.js`).
5. `useThemeSwitcher.js` has a typo/dead branch: `preferDarkQuery = "(prefer-color-scheme: dark)"` is missing the "s" in "prefers" — `window.matchMedia` on an invalid media query string effectively never matches, so the `mediaQuery.matches` branch is always false. The **only reason dark-mode-by-OS-preference still sort of works** is the separate, correct inline script in `_document.js` that runs once before hydration; the hook's own OS-preference detection is silently broken. Low severity today (works via a different code path) but a latent bug that will bite if `_document.js`'s script is ever touched.

**Outdated / duplicated patterns:**
- **`src/pages/projects.js` vs stray duplicate**: `README.md` at the repo root is not documentation — it's raw, unformatted JavaScript source containing an *older draft* of the Projects page component (missing `TransitionEffect`, missing responsive classes, different image import). This is almost certainly a mistaken save (e.g., copy-pasted into the wrong file) and should be replaced with real project documentation.
- **`src/styles/Home.module.css`** — untouched `create-next-app` boilerplate CSS module, never imported by any page. Dead file.
- **`public/next.svg`, `public/vercel.svg`, `public/thirteen.svg`, `public/images/circular-text.png`** — unused boilerplate/leftover assets.
- **`components/TypingCode.js`** — a fully-built component, never imported anywhere. Either finish integrating it (it looks intended for a rotating-role subtitle on Home) or delete it.
- **~17 unused images** under `public/images/projects/*` (top-level, non-`proy/` versions) — superseded by the `proy/` subfolder actually referenced in `projectConst.js`, but never cleaned up. Same for `gifs/casa.gif`, `gifs/casa-min.mp4`, `gifs/charizard2.gif`, `images/react_native_apis.png`.
- **Dead/unused dependencies**: `@fortawesome/*` packages, `animate.css`, `@googlemaps/js-api-loader` + `@types/google.maps` (env var `NEXT_PUBLIC_MAPS_API_KEY` present but nothing consumes it — clearly scaffolding for the planned but never-built map section).
- **JSX embedded directly in data files** (`projectConst.js` `summary`/`title` fields, `skillsConst.js`/`certConst.js` `icon` fields) — works fine for a hardcoded site, but is fundamentally incompatible with any future JSON/DB-backed content model without a translation layer.
- **`Icons.js` is a single 2000+ line file** with ~40 hand-copied inline SVGs (many with large embedded path data, e.g. `ReactIcon`, `ReduxIcon`). Fine for a static site, but worth knowing about before any icon-library migration (e.g., moving to `react-icons` or a similar package to shrink this file and dedupe SVGs that already exist in `public/images/svgs/*` — several icons appear to exist in **both** places, e.g. `Github.svg`/`GithubIcon`, `React.svg`/`ReactIcon`).
- **No TypeScript** — `@types/react` and `@types/nodemailer` are installed but there is no `tsconfig.json` and no `.ts`/`.tsx` files; these type packages are currently inert.
- **No tests** — no test runner, no test files anywhere in the repo.
- **No CI config** — no `.github/workflows`, relies entirely on Vercel's git-push auto-deploy.
- **Inline `<style jsx>`-free but heavy Tailwind class strings** — some very long className strings (e.g., `NavBar.js`, `index.js` buttons) repeated near-verbatim across pages (the "View"/"Download" CV buttons, the "Certificates" link button) — candidates for a shared `Button` component, but not urgent.
- **Hardcoded `console.log`/`console.error`** calls left in production code paths (`contact.js`, `api/contact.js`) — fine for a small site, but should be replaced with real logging before analytics/admin work lands.

**Risky areas (things that need care during modernization):**
- **Secrets in `.env.local`**: `EMAIL`, `EMAIL_PASS` (Gmail app password) and `NEXT_PUBLIC_MAPS_API_KEY`. The `NEXT_PUBLIC_` prefix means the Maps key is already exposed client-side by design (expected for browser Maps JS usage) — just confirm it's a properly *restricted* key (HTTP referrer restrictions) in Google Cloud Console before ever wiring up the map section, since it's presumably unrestricted right now (never used yet). `.env.local` is correctly gitignored, and is not tracked — no leak found in the repo itself.
- **Nodemailer via Gmail SMTP** with a personal account is fragile at any scale and a common source of deliverability/rate-limit problems — worth reconsidering (e.g., Resend, Postmark, SES) once the contact form gets more traffic or the CV/cover-letter generation features start sending mail too.
- **No auth, no admin, no database yet** — the entire future roadmap (dashboard, auth, CRUD, analytics, job tracking, PDF generation) is greenfield backend work layered onto a currently 100% static/stateless frontend. This is the single largest architectural gap between "today" and "future goals," not a bug — but it means Phase 2+ below is effectively a new application being grown alongside the existing site, not a small patch.
- **Deployed on Vercel already, in production** — any dependency upgrade (especially a Next.js major version bump) should go through a preview deployment before merging to the branch Vercel treats as production, since regressions would be user-facing immediately.

---

## 9. What Should Be Preserved

- **Visual identity**: color palette (`dark #1b1b1b`, `light #f5f5f5`, `primary #B63E96`, `primaryDark #58E6D9`), Montserrat font, dark/light theme toggle behavior and the flash-prevention script in `_document.js`.
- **Framer Motion as the animation engine** — it's modern, well-supported, and already deeply integrated (word-stagger text, scroll-linked timelines, hover/tap micro-interactions). No reason to replace the library itself; only specific animations (the page-transition overlay) are flagged for a redesign, per explicit user request.
- **The scroll-linked timeline mechanism** (`LilIcon.js` + `useScroll` in `Experience.js`/`Education.js`) — this is a nice, already-working parallax-adjacent effect and a good foundation to *extend* into the requested "scroll-linked animations/parallax" goal rather than rebuild from scratch.
- **The `@/*` → `src/*` alias**, Tailwind dark-mode-by-class strategy, and the custom `max-width`-based responsive breakpoints in `tailwind.config.js` (`lg`, `md`, `sm`, `xs` all as `max` widths, which is an intentional "desktop-first" authoring style used consistently across every component).
- **Existing page structure and content** (Home, About, Projects, Certificates, Contact) as the public-facing site — the admin/auth/CMS work is additive, not a replacement of the public site's information architecture.
- **Nodemailer-based contact flow** as a starting point (fix its bugs, keep the mechanism) unless/until a transactional email provider is adopted for the broader mail needs of the Job Application Studio.

## 10. What Should Be Refactored

Roughly in the order they'll block future work:

1. **Content model**: extract all data from `public/All-Texts/*.js` into plain JSON-serializable shapes (no embedded JSX) as the very first step — this alone unlocks moving that content into a database later without touching every consuming component twice. Icon references become string keys resolved against a fixed icon map; rich text (`summary`, `title`) becomes plain strings or Markdown.
2. **Fix the identified bugs** (Section 8, bugs 1–5) — small, isolated, low-risk fixes that remove latent footguns before bigger changes land on top of them.
3. **Prune dead code/assets**: `TypingCode.js` (decide: delete or finally use it for the Home subtitle), `Home.module.css`, unused images (`projects/*` non-`proy` versions, unused gifs), unused deps (`@fortawesome/*`, `animate.css`), fix `README.md` to contain actual project documentation instead of stray JS.
4. **`TransitionEffect` redesign** — replace the 3-panel color-wipe with a more premium transition (e.g., a subtle fade/scale + blur combination, or a shared-element-style crossfade), applied consistently on **every** page including `about.js`, with matching enter/exit animations on all layers.
5. **Home page animation refresh** — likely bring `AnimatedText`/hero imagery into a more choreographed entrance (using the already-present `useInView`/`useScroll` primitives) and decide the fate of `TypingCode.js` as part of this.
6. **Introduce scroll-linked parallax** as a generalized pattern (not just the timeline), likely via a small reusable hook wrapping `useScroll`/`useTransform`, reused across Home hero, About imagery, and Projects cards.
7. **Data layer introduction** (biggest structural change): pick a database + ORM (e.g., Postgres via a managed provider + Prisma, or a lighter option like Supabase/Turso, chosen based on hosting constraints on Vercel), migrate the now-cleaned-up content model into it, and introduce real data-fetching (`getStaticProps`/ISR, or start evaluating a partial App Router migration for Server Components — see below).
8. **Auth + `/admin`**: add an auth solution (NextAuth.js/Auth.js is the natural fit for Pages Router + Vercel), a protected `/admin` route tree, and CRUD screens for projects/skills/experience/education/certificates, replacing the static JS files as the source of truth.
9. **File uploads** (project screenshots, certificate images/PDFs): needs object storage (Vercel Blob, S3, or Cloudinary — the project already references Cloudinary in one experience bullet, so the author has prior familiarity with it) plus upload UI in the admin.
10. **Analytics dashboard + completeness indicators**: needs its own data (page views/events) — likely a lightweight events table plus a charting library, fed by either self-instrumented tracking or a third-party analytics API.
11. **Job Application Studio**: the most complex new subsystem — job-posting ingestion/parsing, ATS-oriented resume tailoring "without inventing experience" (constrains this to rewriting/re-emphasizing existing content, not generating new claims — worth designing explicit guardrails here), cover-letter generation, application/interview tracking, and PDF export (e.g., `@react-pdf/renderer` or a headless-Chrome/Puppeteer-based render step). This is realistically its own multi-phase project once the data layer and auth exist.
12. **Consider (not commit to) an App Router migration**, incrementally, once the data layer exists — Next.js Pages Router still works fine on 13.2.4 but is increasingly legacy; a future major version bump (13 → 14/15) plus incremental route-by-route migration to `app/` would align the project with current Next.js conventions and unlock Server Components/Server Actions for the admin CRUD work specifically (arguably the best fit for the admin section, even if the public marketing pages stay on Pages Router longer).

---

## Phased Modernization Plan

The plan is intentionally incremental: each phase ships independently, keeps the site deployable on Vercel at every step, and doesn't require the next phase to be useful on its own.

### Phase 0 — Hygiene (low risk, do first) — ✅ COMPLETE

- [x] Fixed the 5 identified bugs (contact-form redirect-on-failure, missing `about.js` transition, incomplete exit animations, `target` attribute misuse, broken media-query string).
- [x] Replaced `README.md` with real project docs.
- [x] Removed **confirmed** dead boilerplate: `src/styles/Home.module.css`, `public/next.svg`, `public/vercel.svg`, `public/thirteen.svg`, and the unused `@fortawesome/*` / `animate.css` dependencies.
- [x] Google Maps dependency/env var **kept as-is** (per explicit instruction — a map section is planned).
- [x] `TypingCode.js` **kept as-is**, undeleted (per explicit instruction — still dead/unimported, revisit in a later phase).
- No visual or behavioral change intended except the bug fixes above; page-transition *design* was not touched, only its exit-animation inconsistency.

**Conservatively kept, not deleted** (confirmed unused by code today, but plausible source/reusable assets rather than pure framework boilerplate — flagged for a deliberate decision in a later phase instead of a Phase-0 deletion):
- `public/images/circular-text.png` and `public/images/svgs/CircularText.svg` — no code references either, no "CircularText" icon exists in `Icons.js`.
- `public/images/projects/*` top-level files (non-`proy/` versions, ~17 images) — superseded by `public/images/projects/proy/*`, which is what `projectConst.js` actually imports; the top-level files may be uncropped originals.
- `public/images/gifs/casa.gif`, `casa-min.mp4`, `charizard2.gif` — `casa-min.gif` and `charizard.gif` are the ones actually used in `Logo.js`/`NavBar.js` (via `Icons.js`).
- `public/images/react_native_apis.png` (top-level) — a same-named file already exists and is used from `public/images/certificates/native_apis.png`.
- `src/components/TypingCode.js` — fully-built but unimported; left in place per instruction.

**Full list of files changed in Phase 0:**
| File | Change |
|---|---|
| `src/pages/contact.js` | Fixed redirect-on-failure bug: `router.push('/')` now only fires after a successful send, inside the `try` block, instead of an unconditional `setTimeout`. Added a user-facing `toast.error(...)` in the `catch` block (previously only `console.error`). Discovered and fixed a related latent bug while touching this code: `<ToastContainer />` was imported but never rendered, and `react-toastify/dist/ReactToastify.css` was never imported — so **no toast (success or error) has ever actually been visible to users**. Added both. Removed a stray Spanish debug `console.log`. |
| `src/pages/about.js` | Added the missing `<TransitionEffect />` (imported and rendered), matching every other page. |
| `src/components/TransitionEffect.js` | Added matching `exit` props to the 2nd and 3rd color panels (previously only the 1st panel animated out; the other two just vanished). Entrance timing/colors/design untouched. |
| `src/pages/projects.js` | Fixed `target={link}` and `target={iconWeb}` (passing a URL as the `target` attribute) to `target="_blank"` on the "Visit" and GitHub-icon links. |
| `src/components/hooks/useThemeSwitcher.js` | Fixed typo `"(prefer-color-scheme: dark)"` → `"(prefers-color-scheme: dark)"` so the hook's own OS dark-mode detection actually matches (previously always false; masked by the separate correct script in `_document.js`). |
| `README.md` | Replaced corrupted content (raw leftover JS from an old draft of the Projects page) with real project documentation: tech stack, setup, env vars, folder structure, scripts, roadmap pointer to `PLAN.md`. |
| `package.json` / `package-lock.json` | Removed unused dependencies `@fortawesome/free-brands-svg-icons`, `@fortawesome/react-fontawesome`, `animate.css` (confirmed zero imports anywhere in `src/`). `@googlemaps/js-api-loader` and `@types/google.maps` kept. |
| `src/styles/Home.module.css` | **Deleted** — unimported `create-next-app` boilerplate. |
| `public/next.svg`, `public/vercel.svg`, `public/thirteen.svg` | **Deleted** — unreferenced `create-next-app` boilerplate assets (`thirteen.svg` was only ever referenced by the now-also-dead `.thirteen` class in the deleted `Home.module.css`). |
| `PLAN.md` | This file — marked Phase 0 items complete, documented conservative asset decisions. |

**Verification:** `npm run lint` → no warnings or errors, both before and after changes. `npm run build` → succeeds both before and after changes, with no new warnings; bundle sizes essentially unchanged (About +~0.2 kB from the added `TransitionEffect` import, Contact's route CSS +~2 kB from the now-actually-imported `ReactToastify.css`).

### Phase 1 — Content model extraction
- Convert `public/All-Texts/*.js` into JSX-free, JSON-serializable data (still committed as static files at this stage — no DB yet).
- Update consuming components to resolve icons/rich text from string keys instead of embedded JSX.
- This is prep work; site behavior is unchanged, but the codebase becomes migration-ready.

### Phase 2 — Animation/visual modernization (the explicitly requested design work)
- Design and implement the new page-transition animation (replacing `TransitionEffect`), applied uniformly across all pages.
- Refresh Home page animation choreography.
- Add the generalized scroll-linked parallax hook and apply it beyond the existing Experience/Education timelines.
- This phase is purely front-of-house and can ship independently of any backend work, satisfying the "premium feel" goals early.

### Phase 3 — Data layer + auth foundation
- Introduce the database and ORM.
- Migrate Phase-1 content into it, with the existing pages switched to read from it (via SSR/ISR) instead of static imports — public site behavior stays visually identical.
- Add authentication (NextAuth.js/Auth.js) and a protected `/admin` shell (no real admin features yet, just the gate).

### Phase 4 — Admin CRUD + file uploads
- Build management screens for projects, skills, experience, education, certificates.
- Add object storage and upload flows for project screenshots and certificate images/PDFs.
- Wire GitHub URLs, deploy URLs, and (optionally) live GitHub API integration (e.g., pulling stars/last-commit) into the project model.

### Phase 5 — Analytics dashboard
- Instrument the public site for page-view/event tracking.
- Build the analytics dashboard and "portfolio completeness" indicators inside `/admin`.

### Phase 6 — Job Application Studio
- Job-posting paste + analysis.
- ATS-oriented resume tailoring constrained to existing, already-entered experience/skills data (no fabrication).
- Cover-letter generation.
- Application/interview status tracking.
- Downloadable CV/cover-letter PDF generation.
- This phase depends on Phases 3–4 (data layer, auth, structured experience/skills data) being in place, and likely needs an LLM API integration decision (provider, cost, and a clear "ground truth" prompt-design guardrail so generated resume content never invents experience).

### Phase 7 (ongoing, not a single phase) — Framework currency
- Track Next.js releases and migrate the Pages Router forward (13 → 14/15 → App Router) opportunistically, ideally starting with the `/admin` section once it exists (best fit for Server Components/Actions), leaving the public marketing pages on the Pages Router until there's a concrete reason to move them.
- Revisit performance/accessibility (image `sizes`/`priority` usage is already reasonably good; audit color contrast in both themes, keyboard navigation on the mobile menu and tabbed Skills/Certificates UIs, and `alt` text quality) as a recurring checklist item each phase, not a one-time pass.
