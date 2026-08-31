# PLAN.md — Vontrauwitz Portfolio: Modernization Roadmap

> **This document supersedes all prior phase numbering.** Earlier drafts of this file described a "Phase 2" that was a Mongo/Auth/Cloudinary/admin architecture proposal, with the framework migration deferred to an open-ended "Phase 8 (ongoing)." That sequencing has been **replaced**: the project owner has decided the framework/architecture foundation must be modernized *first*, in isolation, before any backend (database/auth/storage) work begins. There is now exactly **one** authoritative roadmap (below). No other document or section in this repo should be treated as a competing roadmap.
>
> **Status as of this revision (updated 2026-08-31, Checkpoint 5.3 sign-off):** Phases 0–5 are all complete and implemented in the repository — see the Authoritative Roadmap table below for exact commit references. This document's original text below (describing Phase 2 as "designed but not implemented," and Part IV's Phases 3–9 as "forward design only, not implemented") reflects this file's state *when it was written*, at the end of Phase 1/start of Phase 2. It has been left largely intact as historical design rationale rather than rewritten — the Roadmap table and the correction notes added at the end of Part IV are the authoritative current-status source; where the prose elsewhere in this file says a phase "hasn't started" or is "forward design only," treat the table as overriding it for phases 0–5.

---

## Authoritative Roadmap

| Phase | Name | Status |
|---|---|---|
| 0 | Stabilization (bug fixes, dead-code removal, doc hygiene) | ✅ Complete |
| 1 | Serializable content model (`src/data/*.js`, JSX-free, icon resolver) | ✅ Complete |
| 2 | Next.js 16 + React 19 + TypeScript + App Router foundational migration | ✅ Complete (signed off 2026-08-23 at commit `285f9ca`; contact-form/email hardening continued through `135b4e0` on 2026-08-24) |
| 3 | MongoDB Atlas + Mongoose + Zod + Data Access Layer | ✅ Complete (Checkpoints 3.1–3.8, commits `a222348`…`8006165`) |
| 4 | Auth.js (GitHub, single-owner) + Cloudinary signed uploads + secure admin foundation | ✅ Complete (Checkpoints 4.1–4.6, commits `9d11104`…`b6cabc9`) |
| 5 | Projects/Certificates Admin MVP (first real CRUD slice) | ✅ Complete (Checkpoints 5.1–5.3, commits `d1fc42c` Projects, `d7a6f2f` Certificates; see Part IV §10 for the integrated sign-off and known deviations from the original design) |
| 6 | Public portfolio visual modernization (page-transition redesign, animation refresh) | ⏳ Forward design only (Part IV) |
| 7 | Analytics dashboard | ⏳ Forward design only (Part IV) |
| 8 | Job Application Studio | ⏳ Forward design only (Part IV) |
| 9 | Remaining CMS modules (skills/experience/education/testimonials/settings admin) + ongoing optimization | ⏳ Forward design only (Part IV) |

**Hard constraint carried through every phase below:** Phase 2 introduces **no** MongoDB, Auth.js, or Cloudinary code. It is a pure framework/language/routing migration. The site continues to read from `src/data/*.js` exactly as it does today; only *how* it's rendered and organized changes. Backend infrastructure begins in Phase 3.

---

# Part I — Baseline Snapshot (accurate as of Phase 1 completion, unchanged by this revision)

This part is carried forward from the prior document verbatim where still accurate — it describes the codebase Phase 2 will migrate *from*.

## 1. Current Architecture & Folder Structure

Confirmed via direct repo audit (2026-08-22): **Next.js 13.2.4, Pages Router only, plain JavaScript.**

```
vontrauwitz-portfolio/
├── public/
│   ├── cv_hans_trauwitz_portfolio.pdf
│   ├── favicon.ico
│   └── images/ (certificates/, contact/, gifs/, profile/, projects/ (+ proy/), svgs/ ~50 icons, testimonials/)
├── src/
│   ├── pages/
│   │   ├── _app.js             # Global App shell: fonts, NavBar/Footer, AnimatePresence
│   │   ├── _document.js        # Custom Document: dark-mode flash-prevention script
│   │   ├── index.js            # "/"
│   │   ├── about.js            # "/about" — Skills, Experience, Education, Testimonials
│   │   ├── projects.js         # "/projects"
│   │   ├── certificates.js     # "/certificates" (tabbed gallery)
│   │   ├── contact.js          # "/contact" — form + carousel
│   │   └── api/contact.js      # POST → sends email via Nodemailer
│   ├── components/
│   │   ├── AnimatedText.js, Education.js, Experience.js, Footer.js, Icon.js,
│   │   │   Icons.js (~2000 lines, ~40 inline SVGs), LilIcon.js, Logo.js, Layout.js,
│   │   │   NavBar.js, Skills.js, Testimonials.js, TransitionEffect.js,
│   │   │   TypingCode.js (dead/unimported)
│   │   └── hooks/useThemeSwitcher.js
│   ├── data/ (projectConst.js, skillsConst.js, expConst.js, eduConst.js, certConst.js, testimonialConst.js)
│   ├── lib/ (api.js, iconMap.js)
│   ├── config/nodemailer.js
│   └── styles/globals.css
├── next.config.js               # { reactStrictMode: true } only — nothing exotic to port
├── tailwind.config.js, postcss.config.js
├── jsconfig.json                # "@/*" → "./src/*"
├── .eslintrc.json                # legacy format, "next/core-web-vitals" only
└── .env.local                    # EMAIL, EMAIL_PASS, NEXT_PUBLIC_MAPS_API_KEY
```

**Dependencies (current):** `next@13.2.4`, `react@18.2.0`, `react-dom@18.2.0`, `framer-motion@^10.6.0`, `react-slick`/`slick-carousel`, `react-toastify@^9.1.3`, `nodemailer@^6.9.3`, `@googlemaps/js-api-loader` (unused, kept intentionally for a future map section), Tailwind 3.3.2, `eslint@8.36.0`/`eslint-config-next@13.2.4`. No TypeScript packages beyond inert `@types/react`/`@types/nodemailer`. No test runner, no CI config, no `vercel.json` (deploy config lives in the Vercel dashboard only).

Routing is flat and file-based: `/`, `/about`, `/projects`, `/certificates`, `/contact`, `/api/contact`. No dynamic routes, no middleware, no nested layouts beyond `_app.js`.

## 2. Content Model (established in Phase 1 — do not re-litigate)

All content lives in `src/data/*.js`: JSX-free, JSON-serializable, images stored as root-relative string paths with explicit `imageWidth`/`imageHeight`, icons resolved via string keys against `src/lib/iconMap.js` + `src/components/Icon.js`. This is already Mongo-ready — Phase 3 migrates these shapes into collections with zero further normalization. See prior revisions of this file (git history) for the full field-by-field mapping table if needed; it is not repeated here to keep this document to one authoritative source of truth.

## 3. Framer Motion Inventory (must survive Phase 2 unchanged)

| Effect | File | Mechanism |
|---|---|---|
| Word-by-word heading reveal | `AnimatedText.js` | `variants` + `staggerChildren` |
| 3-panel color-wipe page transition | `TransitionEffect.js` | 3 stacked `motion.div`, staggered delay, `x`/`width` |
| Route enter transition | `TransitionEffect.tsx` | Per-page 3-panel wipe using `initial`→`animate`. The original Pages Router exit/enter orchestration with `AnimatePresence mode="wait"` was evaluated for restoration during Checkpoint 2.12, but reproduced a silent animation freeze under the current App Router + Motion 13 + React 19 architecture. The attempted restoration was fully reverted. Accepted as a documented Phase 2 deviation; route-transition architecture may be reconsidered during the later visual/animation redesign. |
| Scroll-linked timeline progress line | `Experience.js`, `Education.js` | `useScroll` → `scaleY` |
| Scroll-linked circular node indicator | `LilIcon.js` | `useScroll` → `pathLength` |
| Scroll-triggered reveal | `Skills.js`, `Testimonials.js` | `whileInView` |
| Mobile menu / icon micro-interactions | `NavBar.js`, `Logo.js` | `motion.div`, `whileHover`/`whileTap` |
| Dark-mode flash prevention | `_document.js` | inline `<Script beforeInteractive>` |

**The hardest single problem in Phase 2** is `AnimatePresence mode="wait"` keyed by `router.asPath` in `_app.js` — App Router has no single top-level `<Component>` swap point to key off of. This needs a dedicated replacement pattern, designed in Part III §7 below, not an incidental side effect of moving files.

## 4. Client/Server Component Boundary Audit

Full component-by-component audit performed against the actual source (not inferred) — this table drives every "use client" placement decision in Phase 2.

| Current file | Needs `"use client"`? | Reason | Target location (Part III tree) |
|---|---|---|---|
| `NavBar.js` | **Yes** | `useState`, `useRef`, `useEffect`, `onClick`, framer-motion | `components/layout/NavBar.tsx` |
| `Logo.js` | **Yes** | `motion(Link)` wrapper | `components/layout/Logo.tsx` |
| `AnimatedText.js` | **Yes** | framer-motion `motion.h1`/`motion.span` | `components/motion/AnimatedText.tsx` |
| `TransitionEffect.js` | **Yes** | framer-motion animation engine | `components/motion/TransitionEffect.tsx` |
| `LilIcon.js` | **Yes** | `useScroll` hook | `components/motion/LilIcon.tsx` |
| `Experience.js` | **Yes** | `useRef`, `useScroll` | `features/experience/components/ExperienceTimeline.tsx` |
| `Education.js` | **Yes** | `useRef`, `useScroll` | `features/experience/components/EducationTimeline.tsx` |
| `Skills.js` | **Yes** | `useState` (tab selection), `onClick` | `features/skills/components/SkillsTabs.tsx` |
| `Testimonials.js` | **Split** — only the `motion.div` wrapper needs client; card mapping is server-safe | `features/testimonials/components/{TestimonialList.tsx (server), TestimonialCard.tsx (client)}` |
| `hooks/useThemeSwitcher.js` | **Yes** | `window.matchMedia`, `localStorage`, `document` | `components/layout/useThemeSwitcher.ts` |
| Projects hover card (in `pages/projects.js`) | **Yes, leaf only** | `useState(isHovered)`, `onMouseEnter/Leave` | `features/projects/components/ProjectCard.tsx` (client); page/grid stays server |
| Certificates tabbed gallery (in `pages/certificates.js`) | **Yes, whole gallery** | `useState` (selected tab/item), `onClick` | `features/certificates/components/CertificateGallery.tsx` |
| Contact form + carousel (in `pages/contact.js`) | **Yes, whole form** | `useState`, `onChange/onSubmit`, `react-toastify`, `react-slick` | `features/contact/components/ContactForm.tsx` |
| `TypingCode.js` (dead/unimported) | N/A | Not wired up — decide delete-or-integrate in Phase 2 cleanup, not carried forward silently | — |
| `Footer.js` | **No** | Pure presentational, `new Date().getFullYear()` only | `components/layout/Footer.tsx` |
| `Layout.js` | **No** | Pure wrapper div | `components/ui/Container.tsx` |
| `Icon.js` | **No** | Pure resolver by prop | `components/ui/Icon.tsx` |
| `Icons.js` (~40 SVGs) | **No** | Confirmed zero hooks/handlers/browser APIs — every icon is `(props) => <svg/>` | `components/ui/icons/*.tsx` (split from one 2000-line file, one icon per file, or a typed registry — decide during the checkpoint) |
| `lib/iconMap.js` | N/A (not a component) | Plain object map | `lib/icon-map.ts` |
| `lib/api.js` (`sendContactForm`) | N/A (not a component) | `fetch` wrapper, becomes a client call to the new Route Handler | `features/contact/actions/submitContactForm.ts` (client-side fetch helper, calling `app/api/contact/route.ts`) |
| `_app.js` | **Split required** | `AnimatePresence` (client) wraps `<Component>`; NavBar/Footer stay outside it | Root `app/layout.tsx` (server) + `components/motion/PageTransitions.tsx` (client, wraps `{children}`, keyed by `usePathname()`) |
| `_document.js` | Not a component | Inline flash-prevention script | Inline `<script>` in `app/layout.tsx`'s `<head>`, no client boundary needed (raw script tag, not React state) |

**Net result:** every animation-driven or stateful leaf gets `"use client"`; every purely presentational leaf (`Footer`, `Layout`/`Container`, `Icon`, all ~40 icons) becomes a genuine Server Component with zero runtime JS shipped for it. `Testimonials`, the projects grid, and (partially) the certificates gallery are Server/Client splits, not all-or-nothing client boundaries.

---

# Part II — Next.js 16 Platform Facts Grounding This Design

Researched directly against `nextjs.org/docs` and `nextjs.org/blog` (fetched 2026-08-22, docs last-updated 2026-08-18). Every architectural decision in Part III cites back to one of these facts.

| # | Fact | Status |
|---|---|---|
| 1 | Next.js **16.3.x** is current stable (16.0 GA'd 2025-10-21). Requires **Node.js ≥20.9**, **TypeScript ≥5.1**. App Router runs on **React 19.2** (bundled with Next, not an independent choice). | Stable |
| 2 | `middleware.ts` is **deprecated**, renamed to **`proxy.ts`** / `export function proxy()`. Runs **Node.js runtime only** — no Edge runtime support. Codemod: `middleware-to-proxy`. Partly motivated by CVE-2025-29927 (a Middleware auth-bypass under Edge Runtime constraints). | Stable convention since 16.0 |
| 3 | **Official guidance, verbatim intent:** "Always verify authentication and authorization inside each Server Function rather than relying on Proxy alone" — because Server Actions are directly POST-reachable even if a proxy `matcher` excludes their route. Proxy is explicitly documented as best for redirects/rewrites/header work, "recommended as a last resort" for anything else. | Directly grounds Principle 10 |
| 4 | **Turbopack is the default bundler** for both `next dev` and `next build`, no flag needed. A project with a **custom webpack config fails the build** by default unless `--turbopack`/`--webpack` is explicit. This repo has no webpack customization today — a non-event here. | Stable |
| 5 | `params`, `searchParams`, `cookies()`, `headers()`, `draftMode()` are **fully async (Promise-based), no sync fallback** — the Next 15 compatibility shim is removed entirely. Codemod: `next-async-request-api`. `npx next typegen` generates `PageProps<'/route'>`/`LayoutProps`/`RouteContext` helper types. | Mandatory breaking change |
| 6 | **Cache Components** (`cacheComponents: true` in `next.config`) replaces the old `experimental.dynamicIO`/`useCache`/`ppr` flags (all **removed**, not just deprecated). Under it, **all data fetching is dynamic-by-default**; caching is opt-in per function/component via `"use cache"`. `cacheTag()`/`cacheLife()` are now **stable**, `unstable_` prefixes dropped. `revalidateTag(tag)` single-arg form is deprecated — **now requires a `cacheLife` profile as a second argument** (`revalidateTag('projects', 'max')`). New primitives: `updateTag(tag)` (Server-Actions-only, read-your-writes) and `refresh()` (Server-Actions-only, refreshes uncached data only). | `cacheComponents` is **opt-in**, not default; the directive/tag/life APIs themselves are stable |
| 7 | React Compiler is **stable** (`reactCompiler: true`, top-level `next.config` key) but **not on by default** — it depends on Babel and measurably slows dev/build compile. | Stable, opt-in |
| 8 | `next/image` default changes in 16: `images.qualities` default is now **`[75]` only** (unlisted values coerced); `minimumCacheTTL` default 60s → **4h**; `imageSizes` no longer includes `16`; local `src` with a query string now requires `images.localPatterns`; `images.domains` deprecated for `images.remotePatterns`. | Stable defaults, plan `next.config` explicitly |
| 9 | `next lint` is **removed** (not deprecated) — lint directly via ESLint or Biome; `next build` no longer lints as a side effect. `@next/eslint-plugin-next` **defaults to ESLint flat config**. Codemod: `next-lint-to-eslint-cli`. | Mandatory |
| 10 | An official mechanical upgrade codemod exists: `npx @next/codemod@canary upgrade latest` — handles the proxy rename, Turbopack config relocation, `next lint`→ESLint CLI, `unstable_` prefix removal. **No official codemod exists for Pages→App Router restructuring** — that part is manual, standard App Router migration practice. | Confirmed via official upgrade guide |
| 11 | Auth.js: `next-auth` is still on the **`@beta` npm tag (v5)** as of this research — **not GA**. `next-auth@4.24.x` is `latest` (old callback API, no native `proxy.ts`/App-Router-first ergonomics). | Flagged risk — see Part IV §1 |
| 12 | Server Actions vs. Route Handlers — official **Data Access Layer** pattern: a `server-only` module does auth checks + returns minimal DTOs; thin `"use server"` actions/Route Handlers delegate to it. This is exactly the requested `verifyAdmin()` + repository design — it is the *officially blessed* pattern, not an invented one. | Directly grounds Principle 9 & 10 |

---

# Part III — Phase 2: Next.js 16 Foundational Migration — Target Architecture

## 1. Scope guardrails (non-negotiable for this phase)

- **No MongoDB, no Auth.js, no Cloudinary code.** `src/data/*.js` remains the single source of truth for content; it is only relocated and (optionally) retyped as `.ts`, never rewired to a database.
- **No public URL changes.** `/`, `/about`, `/projects`, `/certificates`, `/contact` resolve identically before and after.
- **No visual/behavioral change.** Every animation in Part I §3 must look and feel identical after migration. The redesign (Phase 6) happens later, deliberately, as its own reviewable change.
- **The one exception to "no backend changes":** `src/pages/api/contact.js` moves to `src/app/api/contact/route.ts` as a Route Handler (rule: Route Handlers are for genuine external HTTP endpoints — the contact form is exactly that), with identical Nodemailer logic, not new logic.

## 2. Target Folder Tree (final state — phase-annotated)

This is the complete target tree across **all** phases, so Phase 2's structural choices don't need revisiting later. Directories/files annotated `[P2]` are created in this phase; `[P3]`/`[P4]`/etc. are reserved empty or simply absent until their phase, not stubbed out prematurely.

```
vontrauwitz-portfolio/
├── src/
│   ├── app/                                          [P2]
│   │   ├── layout.tsx                                 # root: <html>/<head>, fonts, theme flash-prevention inline script
│   │   ├── globals.css
│   │   ├── sitemap.ts                                  # file-based Metadata API
│   │   ├── robots.ts
│   │   ├── opengraph-image.tsx                         # default OG image
│   │   ├── icon.tsx / apple-icon.tsx                   # if replacing static favicon.ico is desired; else keep public/favicon.ico
│   │   ├── (public)/                                   # route group — no effect on URLs
│   │   │   ├── layout.tsx                              # NavBar/Footer + PageTransitions wrapper (server, composes client leaves)
│   │   │   ├── page.tsx                                # "/"
│   │   │   ├── loading.tsx                              # optional, only where a real async gap exists (Phase 3+ once Mongo reads are dynamic)
│   │   │   ├── about/page.tsx                          # "/about"
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx                            # "/projects"
│   │   │   │   └── generateMetadata / metadata          # project-specific OG/social metadata
│   │   │   ├── certificates/page.tsx                   # "/certificates"
│   │   │   └── contact/
│   │   │       ├── page.tsx                            # "/contact" (server shell)
│   │   │       └── not-found.tsx                        # optional
│   │   ├── (admin)/                                    [P4+] reserved — not created in Phase 2
│   │   │   └── admin/
│   │   │       ├── layout.tsx                          # server-verified shell — calls verifyAdmin()
│   │   │       ├── page.tsx                            # dashboard
│   │   │       ├── login/page.tsx
│   │   │       ├── projects/{page.tsx,new/page.tsx,[id]/edit/page.tsx}   [P5]
│   │   │       ├── certificates/{...same pattern...}                     [P5]
│   │   │       ├── skills/, experience/, education/, testimonials/       [P9]
│   │   │       ├── applications/                                          [P8]
│   │   │       ├── analytics/page.tsx                                     [P7]
│   │   │       └── settings/page.tsx                                      [P9]
│   │   └── api/
│   │       ├── contact/route.ts                        [P2]              # POST, moved from pages/api/contact.js
│   │       ├── auth/[...nextauth]/route.ts              [P4]              # Auth.js handler
│   │       └── cloudinary/sign/route.ts                 [P4]              # signed-upload signature endpoint
│   ├── features/                                        [P2 skeleton, filled in over time]
│   │   ├── projects/
│   │   │   ├── components/   # ProjectGrid.tsx (server), ProjectCard.tsx (client, hover state)
│   │   │   ├── queries/      # getPublishedProjects.ts — [P2] reads src/data; [P3] swapped to Mongo via services/
│   │   │   ├── actions/      # [P5] createProject.ts, updateProject.ts, deleteProject.ts (Server Actions)
│   │   │   ├── schemas/      # [P3] project.schema.ts (Zod)
│   │   │   ├── types/        # [P2] Project type, hand-written from Phase 1 shape
│   │   │   └── services/     # [P3] projectRepository.ts (DAL — Mongoose calls live only here)
│   │   ├── certificates/      # same shape as projects/
│   │   ├── experience/        # components/ExperienceTimeline.tsx, EducationTimeline.tsx; queries/ only until P9
│   │   ├── skills/            # components/SkillsTabs.tsx; queries/ only until P9
│   │   ├── testimonials/      # components/{TestimonialList.tsx (server), TestimonialCard.tsx (client)}
│   │   ├── contact/           # [P2] components/ContactForm.tsx (client); actions/submitContactForm.ts
│   │   ├── analytics/         [P7] components/, queries/, services/ (analyticsEvents + rollup)
│   │   ├── applications/      [P8] components/, actions/, schemas/, services/
│   │   ├── resume/            [P8/P9] CV/settings/document-generation logic, PDF export
│   │   └── github/            [P9] future GitHub API sync (stars, last-commit)
│   ├── components/
│   │   ├── ui/                [P2] Container.tsx (was Layout.js), Icon.tsx, icons/*.tsx (split from Icons.js)
│   │   ├── layout/            [P2] NavBar.tsx, Footer.tsx, Logo.tsx, useThemeSwitcher.ts
│   │   └── motion/            [P2] AnimatedText.tsx, TransitionEffect.tsx (or its Phase 6 replacement), LilIcon.tsx, PageTransitions.tsx
│   ├── lib/
│   │   ├── db/                [P3] connection.ts (cached Mongoose connection, hot-reload-safe)
│   │   ├── auth/               [P4] auth.ts (Auth.js config), verifyAdmin.ts (centralized authorization)
│   │   ├── cloudinary/         [P4] client.ts, sign.ts
│   │   ├── security/           [P3/P4] rate-limit.ts, sanitize.ts
│   │   ├── validation/         [P3] shared zod helpers (e.g. slug/id parsing)
│   │   ├── env/                [P2] server.ts, client.ts — typed/validated env access (zod-parsed once Zod exists in P3; plain typed accessors in P2)
│   │   ├── icon-map.ts         [P2] moved+typed from lib/iconMap.js
│   │   └── nodemailer/         [P2] client.ts — moved+typed from config/nodemailer.js
│   ├── data/                   [P2 carryover] projectConst.ts, skillsConst.ts, expConst.ts, eduConst.ts, certConst.ts, testimonialConst.ts — retired collection-by-collection starting Phase 3, per the migration strategy in Part IV §5; not deleted until every collection is trusted on Mongo
│   ├── proxy.ts                [P4] optimistic /admin route gate only — never the sole authorization mechanism (see Part IV §3)
│   └── (no middleware.ts — renamed convention, never created under the old name)
├── public/                     # unchanged: images/, cv PDF, favicon.ico
├── next.config.ts              [P2] images{} block, top-level turbopack{} key if ever needed, cacheComponents flag (decision in §6), reactCompiler flag (decision in §7)
├── tsconfig.json                [P2] replaces jsconfig.json
├── eslint.config.mjs             [P2] replaces .eslintrc.json
├── tailwind.config.ts            [P2] ported from .js, same design tokens
├── package.json                  [P2] scripts updated (lint no longer `next lint`)
└── PLAN.md
```

## 3. Architecture Principles Adopted (mapping user's principles to concrete decisions)

1. **`src/app` owns routing/composition only.** No business logic in `page.tsx`/`layout.tsx` beyond composing feature components and calling `queries/` functions.
2. **Feature-oriented `src/features/*`** as specified — `components/actions/queries/schemas/types/services` per feature, populated incrementally (Phase 2 only needs `components/`, `queries/`, `types/` for existing content; `actions/`, `schemas/`, `services/` arrive with Phase 3–5).
3. **Shared infra under `src/lib/*`** exactly as specified — `db`, `auth`, `cloudinary`, `security`, `validation`, `env`. Phase 2 only populates `env/` (typed env access) and relocates `nodemailer/`+`icon-map.ts`; the rest are reserved directories that simply don't exist until their phase.
4. **Shared visual components under `src/components/{ui,layout,motion}`** — this is where every "no `use client` needed" and every generic client leaf from the Part I §4 audit lands.
5. **Route groups `(public)`/`(admin)` with unchanged URLs.** `(public)` is created in Phase 2 (wrapping all 5 existing routes); `(admin)` is reserved but not created until Phase 4 has something to put in it — creating an empty admin shell in Phase 2 would violate the "no auth/DB in Phase 2" guardrail (a dashboard with nothing to authenticate against is dead weight, not architecture).
6. **Server Components by default** — confirmed via the Part I §4 audit: only genuinely stateful/animated/browser-API leaves get `"use client"`; everything else (icons, footer, container, data-mapping wrappers) stays server-rendered.
7. **TypeScript introduced now**, incrementally (see §5 below), not deferred.
8. **Zod** is explicitly **not** introduced in Phase 2 (there are no system boundaries yet that need runtime validation beyond the contact form, which already has hand-rolled validation that is preserved as-is) — it arrives in Phase 3 when Mongo/Server Action boundaries are created. Only exception under consideration: validating the contact Route Handler's body with Zod as a small, self-contained improvement — see §8 (Checkpoint 2.7) for the explicit go/no-go call.
9. **DAL/repository pattern** — the `features/*/services/` folders are reserved now, populated in Phase 3. Phase 2's `queries/` functions (e.g. `getPublishedProjects()`) already establish the *call shape* pages use, so swapping their internals from "read `src/data`" to "call a Mongoose repository" in Phase 3 requires zero changes to any `page.tsx` or component.
10. **Centralized `verifyAdmin()`** — designed in Part IV §3, implemented in Phase 4. Phase 2 has nothing to authorize yet, so this is forward design only, cited here so the folder tree (`src/lib/auth/verifyAdmin.ts`) is already correctly placed for when it lands.
11. **Modern caching (Cache Components)** — evaluated in §6 below; a concrete adoption decision is made for Phase 2 even though there's no dynamic data yet, so Phase 3's Mongo-backed queries inherit a proven pattern rather than retrofitting one.
12. **Server Actions for admin CRUD, Route Handlers for genuine HTTP** — contact stays a Route Handler in Phase 2 (per rule); admin CRUD Server Actions don't exist until Phase 5.
13. **Modern Metadata APIs** — `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, per-page `metadata`/`generateMetadata` all introduced in Phase 2 (§9), since they're pure App Router mechanics with no backend dependency.
14. **`loading.tsx`/`error.tsx`/`not-found.tsx`** — added only where they provide real value. In Phase 2, every data source is a synchronous static import (no `await`, no network) — so `loading.tsx` has nothing to show yet and is **deferred to Phase 3** when Mongo reads introduce real async boundaries. `error.tsx`/`not-found.tsx` are added in Phase 2 at the `(public)` layout level as a baseline safety net (cheap, no dependency on async data).
15. **Next.js 16 changes accounted for** — proxy.ts (deferred to Phase 4, nothing to protect yet), Turbopack (default, non-event here), React 19 (comes bundled), async request APIs (this app barely uses `params`/`searchParams` today — audit confirms only trivial usage, if any, per current flat routing), modern Image behavior (explicit `images` config added), modern caching (§6), current lint tooling (§4), React Compiler (evaluated §7, left off by default per official guidance).
16. **Preserve URLs/content/Framer Motion/timeline effects/theme/visual design** — this is the primary success criterion for every checkpoint's smoke test (§8).

## 4. TypeScript & Lint Tooling Strategy

- **`tsconfig.json`** introduced with `allowJs: true` initially (so `.js` and `.tsx` coexist during the file-by-file migration) and `strict: false` initially; a **dedicated checkpoint (2.9)** flips `strict: true` and removes `allowJs` once every source file has been converted. `jsconfig.json` is deleted the moment `tsconfig.json` exists (Next.js only reads one or the other).
- Path alias `@/*` → `./src/*` is carried forward unchanged.
- **ESLint**: migrate `.eslintrc.json` → `eslint.config.mjs` (flat config) via `npx @next/codemod@canary next-lint-to-eslint-cli .`, since `next lint` is removed in v16. `package.json`'s `"lint"` script becomes a direct `eslint .` invocation.
- Use `npx @next/codemod@canary upgrade latest` as the mechanical first step of the actual implementation (not part of this design doc) — it handles the proxy rename (irrelevant yet, no middleware exists today), Turbopack config relocation, and `unstable_` prefix removal in one pass.

## 5. File-by-File Migration Order

Files convert `.js`→`.tsx`/`.ts` **as they're touched by a checkpoint**, not in one giant pass — this keeps every checkpoint's diff reviewable and its smoke test meaningful.

## 6. Caching Strategy Decision

Per Part II §6: `cacheComponents` is opt-in, not default, and changes rendering semantics (all data fetching becomes dynamic-by-default; caching is explicit per-function).

**Decision for Phase 2: enable `cacheComponents: true` now, applied to the `queries/` layer.** Rationale:
- Every current data "fetch" is a synchronous static import with no real async cost — there is nothing to break by enabling the flag now, and no risk of the "uncached data outside `<Suspense>`" build errors the docs warn about, since nothing is dynamic yet.
- It establishes the pattern (`"use cache"` + `cacheTag()` + `cacheLife()` on each `features/*/queries/*.ts` function) while the stakes are zero, so Phase 3's Mongo-backed rewrite of those same functions is a mechanical "swap the body, keep the directive/tags" change instead of a new concept introduced under time pressure.
- Concretely: `getPublishedProjects()` becomes `"use cache"`; `cacheTag("projects")`; `cacheLife("days")` (portfolio content changes rarely). No revalidation call exists yet in Phase 2 (nothing writes to this data at runtime) — `revalidateTag`/`updateTag` calls are introduced in Phase 5 when admin Server Actions actually mutate content.
- **Explicit non-goal:** do not attempt to replicate old Pages-Router ISR (`getStaticProps` + `revalidate: N`) — that model doesn't exist in the App Router and reasoning about "revalidate every N seconds" would be solving a problem (stale reads) that doesn't apply to a build-time-static content source.

**Correction — final implemented decision (recorded after Phase 2 sign-off, original design discussion above left unchanged):** `cacheComponents` was **not** enabled during Phase 2. Every shipped `features/*/queries/*.ts` function (`getPublishedProjects()`, `getCertificates()`) is a plain `async` function reading the existing `src/data/*.ts` static import — no `"use cache"`, no `cacheTag()`, no `cacheLife()`. Enabling `cacheComponents` is a global `next.config` flag that changes rendering semantics for the entire app, not something to fold into an individual route migration without its own isolated checkpoint and test pass — so it was deliberately deferred rather than adopted as planned above. **Phase 3 must not enable it implicitly**; nothing in the Phase 3 checkpoint plan (MongoDB/Mongoose/Zod foundation) depends on it, and Phase 3 introduces no write paths that would create a staleness problem for it to solve. Cache/tag invalidation (`cacheTag()`/`revalidateTag()`/`updateTag()`) will be evaluated when real write paths/admin CRUD exist — Phase 5, when admin Server Actions first mutate Mongo-backed content.

## 7. Route-Transition Redesign (mechanical, not visual)

App Router has no `router.asPath`-keyed single swap point. Replacement pattern:

```
components/motion/PageTransitions.tsx   ("use client")
  - usePathname() as the AnimatePresence key
  - wraps {children}, mode="wait", identical enter/exit timing to today
```

Placed inside `app/(public)/layout.tsx` (server), wrapping the `{children}` slot, with `NavBar`/`Footer` rendered as siblings outside it — exactly preserving today's structural rule that chrome (nav/footer) doesn't animate on route change, only the page content does. `TransitionEffect` (the 3-panel color wipe) is rendered inside each page as it is today, unchanged in Phase 2 — its replacement is explicitly Phase 6 work, not bundled here.

**Checkpoint 2.12 outcome:** this `PageTransitions.tsx`/`usePathname()`/`AnimatePresence` pattern was implemented and tested exactly as specified above. It reproduced a silent animation freeze — `TransitionEffect`'s panels stuck at their initial position indefinitely, with no console error or warning — under the current App Router + Motion 13 + React 19 architecture, on every route tested. The implementation was fully reverted; no trace of it remains in `src`. Phase 2 therefore intentionally retains the existing per-page `TransitionEffect` wipe without `AnimatePresence` exit orchestration. Future animation/redesign work should treat this as a known finding — the same implementation should not be blindly retried; a different route-transition approach (or a newer Motion/React combination) would need to be evaluated first.

## 8. Phase 2 Migration Checkpoints

Every checkpoint below must pass, in order, before the next begins: `npm run build` (Turbopack, default) succeeds, `tsc --noEmit` succeeds (once tsconfig exists), `npm run lint` (flat config, once migrated) is clean, and a manual `next start` smoke test confirms all 5 public routes render, dark/light toggle works, every Framer Motion effect in Part I §3 still plays, and the contact form still sends mail. This directly satisfies the "small checkpoints, gated" requirement.

| # | Checkpoint | Scope | Gate |
|---|---|---|---|
| **2.0** | Pre-flight baseline | Record current `npm run build`/`npm run lint`/`next start` behavior as the reference to diff every later checkpoint against. No files touched. | N/A — this *is* the baseline |
| **2.1** | Dependency/tooling bump, still Pages Router | Bump `next`→16.3.x, `react`/`react-dom`→19.2.x, add `typescript`/`@types/node`, add `tsconfig.json` (`allowJs:true`), run `@next/codemod@canary upgrade latest`, migrate `.eslintrc.json`→`eslint.config.mjs`, replace `"lint": "next lint"` script, add explicit `images{}` block to `next.config.ts` (renamed from `.js`), delete `jsconfig.json`. **No `src/app` yet — routing is 100% unchanged.** | Build/lint/typecheck clean; site behaves byte-for-byte identically since only the compiler/language changed, not the routing |
| **2.2** | Root layout groundwork | Create `src/app/layout.tsx` (fonts, `<head>` flash-prevention script, global CSS import) and `src/app/(public)/layout.tsx` (NavBar/Footer + `PageTransitions` wrapper) **without deleting `pages/` yet** — Next.js supports `app/` and `pages/` side-by-side, App Router taking precedence only for routes it defines. No page moved yet, so nothing in `app/` resolves to a live route yet (or start with a throwaway `app/(public)/__scaffold/page.tsx` to verify the shell renders, then delete it). | Build succeeds with both routers present; existing `pages/` routes still serve identically |
| **2.3** | Migrate `/` | Move `pages/index.js` → `app/(public)/page.tsx` (server) + extract any client leaf per the Part I §4 audit. Convert consumed components (`AnimatedText`, `TransitionEffect`) to `.tsx` with `"use client"`. | `/` renders identically; hero animation, theme toggle, nav all work |
| **2.4** | Migrate `/about` | `pages/about.js` → `app/(public)/about/page.tsx`. Extract `Skills`, `Experience`, `Education`, `Testimonials` into their `features/*/components/` homes per §2's tree, applying the Server/Client split designed for `Testimonials`. | `/about` identical; scroll-linked timeline and tab interactions still work |
| **2.5** | Migrate `/projects` | `pages/projects.js` → `app/(public)/projects/page.tsx` (server, maps data) + `features/projects/components/ProjectCard.tsx` (client, hover state) + `features/projects/queries/getPublishedProjects.ts` (`"use cache"`, per §6). Add project-specific `generateMetadata`/OG per Principle 13. | `/projects` identical; hover interactions and images render correctly |
| **2.6** | Migrate `/certificates` | `pages/certificates.js` → `app/(public)/certificates/page.tsx` + `features/certificates/components/CertificateGallery.tsx` (client, whole gallery per audit) + `features/certificates/queries/getCertificates.ts`. | `/certificates` identical; tab/gallery interactions work |
| **2.7** | Migrate `/contact` + its API route | `pages/contact.js` → `app/(public)/contact/page.tsx` (server shell) + `features/contact/components/ContactForm.tsx` (client, form+carousel+toasts). `pages/api/contact.js` → `app/api/contact/route.ts` (Route Handler, identical Nodemailer logic). **Decision point:** optionally validate the request body with a minimal hand-rolled check (not Zod — Zod isn't introduced until Phase 3) equivalent to today's validation, no new dependency. | `/contact` identical; form submits, email sends, error/success toasts behave exactly as today (including the already-fixed Phase-0 bug fixes) |
| **2.8** | Delete the old router | Remove `src/pages/` entirely (`_app.js`, `_document.js`, all page files, `api/contact.js`), confirm no remaining import references it. | Build succeeds with `pages/` gone; full manual smoke test of all 5 routes |
| **2.9** | Finish TypeScript conversion + tighten config | Convert every remaining `.js` file (icons, hooks, lib) to `.ts`/`.tsx`. Flip `tsconfig.json` to `strict: true`, remove `allowJs`. Split `Icons.js` into `components/ui/icons/*.tsx`. | `tsc --noEmit` clean under strict mode; build/lint clean |
| **2.10** | Metadata & file-based conventions | Add `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, root `metadata` export, per-page `generateMetadata` where distinct (projects/certificates), `error.tsx`/`not-found.tsx` at the `(public)` layout level. | Build clean; verify `/sitemap.xml`, `/robots.txt`, OG image, and a deliberate 404 all resolve correctly |
| **2.11** | React Compiler evaluation | Trial `reactCompiler: true` in an isolated branch/build, measure dev/build time delta per Part II §7's known Babel-overhead caveat. **Default decision: leave off** unless the trial shows a clear win with no meaningful build-time regression. | Documented go/no-go recorded in this file's changelog; default is "off" |
| **2.12** | Final Phase 2 sign-off | Full `npm run build` + `tsc --noEmit` + `npm run lint` + complete manual browser smoke test (all routes, both themes, every animation in Part I §3, contact form end-to-end) on a Vercel preview deployment before merging to the production branch. | All green; this is the phase's exit gate |

**Checkpoint 2.11 decision:** React Compiler — DEFERRED / NO-GO for Phase 2. Reason: isolated evaluation caused a site-wide hook-order runtime regression in NavBar and increased build time. Compiler changes were fully reverted.

## 9. Old Files/Conventions That Disappear or Are Replaced

| Old | Fate |
|---|---|
| `src/pages/` (entire directory) | Replaced by `src/app/(public)/*`, `src/app/api/*` (later `(admin)/admin/*`) |
| `src/pages/_app.js` | Replaced by `src/app/layout.tsx` + `components/motion/PageTransitions.tsx` |
| `src/pages/_document.js` | Replaced by `src/app/layout.tsx`'s `<html>`/`<head>` + inline script |
| `src/pages/api/contact.js` | Replaced by `src/app/api/contact/route.ts` |
| `jsconfig.json` | Replaced by `tsconfig.json` |
| `.eslintrc.json` | Replaced by `eslint.config.mjs` |
| `next.config.js` | Replaced by `next.config.ts` |
| `src/config/nodemailer.js` | Replaced by `src/lib/nodemailer/client.ts` |
| `src/lib/api.js` | Replaced by `src/features/contact/actions/submitContactForm.ts` |
| `src/lib/iconMap.js` | Replaced by `src/lib/icon-map.ts` |
| `src/components/*.js` | Redistributed into `src/components/{ui,layout,motion}` and `src/features/*/components`, converted to `.tsx` |
| `"lint": "next lint"` (package.json script) | Replaced by a direct `eslint .` invocation |
| `middleware.js` (never actually created in this repo, only proposed in an earlier draft) | If ever created, must be named `proxy.ts` from day one — the old name is not a valid Next.js 16 convention |

---

# Part IV — Forward Design for Phases 3–9 (design-only when written; Phases 3–5 now implemented — see §10)

This part carries forward the substance of the prior Mongo/Auth/Cloudinary/admin architecture proposal, **renumbered** to the new phase scheme and **corrected** against the Part II research (Auth.js beta status, `proxy.ts` naming, Cache Components replacing ISR-style thinking). It was design-only at the time this section was written, before Phase 2 began. **As of Checkpoint 5.3 (2026-08-31), Phases 3, 4, and 5 described below are fully implemented** — §§1–8 below are kept as-written for their historical rationale (why each decision was made), and §10 records exactly where the real implementation confirmed, refined, or deviated from this original design. Phases 6–9 remain design-only, unstarted.

## 1. Auth.js version risk (correction to prior draft)

The prior draft assumed a settled "NextAuth/Auth.js" v5 API. Current research shows **`next-auth` is still on the `@beta` tag** — v5 is not GA. Phase 4 must:
- Pin an **exact** `next-auth@beta` version (never a floating `@latest`/`@beta`), and record the pinned version in this file when Phase 4 starts. **Done:** `next-auth@5.0.0-beta.32` (see `package.json`), pinned exactly, not a floating range. `cloudinary@^2.11.0` was the other version-sensitive dependency introduced in Phase 4 (Checkpoint 4.5), a stable (non-beta) major so a caret range was acceptable there.
- Use the current documented v5-beta conventions: root `auth.ts` exporting `{ auth, handlers, signIn, signOut }`; `AUTH_GITHUB_ID`/`AUTH_GITHUB_SECRET`/`AUTH_SECRET` env var naming (Auth.js's own `AUTH_`-prefixed convention), not the older `GITHUB_ID`/`GITHUB_SECRET`/`NEXTAUTH_SECRET` naming the prior draft used.
- Treat re-pinning to GA v5 (whenever it ships) as its own small, isolated checkpoint — not bundled into unrelated work.

## 2. Single-owner GitHub allow-list

Official Auth.js pattern is the `signIn` callback (`authjs.dev/guides/restricting-user-access`, documented for email-domain allow-listing) adapted to a GitHub-id check:
```
callbacks: {
  signIn({ profile }) {
    return profile?.id?.toString() === process.env.ADMIN_GITHUB_ID
  }
}
```
Session strategy: **JWT** (default, no adapter needed for a single user); `@auth/mongodb-adapter` is the documented upgrade path only if instant server-side session revocation ever becomes a real requirement.

## 3. Centralized authorization — `verifyAdmin()`

Per the official Data Access Layer guidance (Part II §12): a `server-only` module (`src/lib/auth/verifyAdmin.ts`) is the **single** authority. Every admin Server Action and every `(admin)` Route Handler calls it directly — `proxy.ts` (Phase 4) may additionally gate `/admin/:path*` for optimistic UX (redirect unauthenticated visitors before they see the shell), but per the official warning in Part II §3, **proxy must never be the only check**, since Server Actions are independently POST-reachable regardless of what a proxy `matcher` covers.

## 4. Cloudinary signed uploads

Unchanged in substance from the prior draft, confirmed still Cloudinary's current recommended pattern: client requests a signature from `app/api/cloudinary/sign/route.ts` (session-gated via `verifyAdmin()`), server signs constrained upload params (`folder`, `allowed_formats`, byte cap) with `cloudinary.utils.api_sign_request`, client uploads directly to Cloudinary, then PATCHes the owning Server Action/route with the returned `{ secure_url, public_id, width, height }`. Delete-then-write ordering, ownership re-derivation of `publicId` server-side, and folder layout (`portfolio/projects/{slug}`, etc.) all carry forward unchanged.

## 5. MongoDB + Mongoose

Collection shapes (`projects`, `skills`, `experience`, `education`, `certificates`, `testimonials`, `siteSettings`, later `applications`/`documentVersions`/`analyticsEvents`) carry forward unchanged from the prior draft — they were already designed as a superset of the Phase 1 content shapes and need no correction. The cached-connection pattern (`mongoose.models.X || mongoose.model(...)` + a cached global connection promise) remains current community best practice; Phase 3 should do one fresh doc check against MongoDB's own Vercel integration guide before implementation, since this wasn't independently re-verified against an official example in this research pass (flagged, not blocking).

**Correction to the prior draft's data-fetching strategy:** the prior draft's "on-demand ISR via `res.revalidate()`" is Pages Router thinking and does not apply. Phase 3's `features/*/queries/*.ts` functions (already `"use cache"`-wrapped per Phase 2 §6) get their cache invalidated via `revalidateTag(tag, profile)` (public, stale-while-revalidate) or `updateTag(tag)` (admin Server Actions needing read-your-writes) — called from the Phase 5 admin Server Actions after a successful Mongo write, not from a `res.revalidate()` call that no longer exists in the App Router.

## 6. Zod

Introduced at the Phase 3 boundary: Server Action inputs, Route Handler bodies, and `features/*/schemas/*.schema.ts` all validate through Zod (current stable major, per Part II research). Existing hand-rolled contact-form validation (Phase 2) can be upgraded to Zod at this point too, retiring the Phase 2.7 hand-rolled check as a small follow-up, not a re-litigation.

## 7. Admin route structure (App Router version of the old proposal)

```
app/(admin)/admin/
  layout.tsx                    → calls verifyAdmin(), renders admin chrome
  page.tsx                      → /admin dashboard
  login/page.tsx                → /admin/login
  projects/page.tsx             → /admin/projects (list)
  projects/new/page.tsx         → /admin/projects/new
  projects/[id]/edit/page.tsx   → /admin/projects/[id]/edit
  certificates/... (same pattern)
  skills/, experience/, education/, testimonials/  (Phase 9)
  applications/  (Phase 8)
  analytics/     (Phase 7)
  settings/      (Phase 9)
```
Mutations are **Server Actions** in `features/*/actions/*.ts` (create/update/delete), each calling `verifyAdmin()` first and a Zod schema second, then the feature's `services/*Repository.ts`. Cloudinary signing and any genuine webhook/external-integration endpoint remain Route Handlers under `app/api/*`, per the rule that distinguishes the two.

## 8. Phase sequence recap (5 → 9)

- **Phase 5 (Projects/Certificates Admin MVP):** the first real end-to-end slice — auth, two Mongo collections, two admin CRUD screens, Cloudinary upload/delete, public pages switched from `src/data` reads to Mongo reads behind the same `queries/` call shape established in Phase 2.
- **Phase 6 (Visual modernization):** replace `TransitionEffect`'s 3-panel wipe, refresh Home choreography, generalize the scroll-linked parallax hook — purely front-of-house, no backend dependency, deliberately sequenced after the foundation is stable per the user's explicit instruction.
- **Phase 7 (Analytics):** `analyticsEvents` + rollup collection, dashboard inside `/admin`.
- **Phase 8 (Job Application Studio):** job-posting ingestion, ATS-oriented tailoring constrained to existing entered data (no fabrication), cover-letter generation, `applications`/`documentVersions` collections, PDF export.
- **Phase 9 (Remaining CMS + optimization):** skills/experience/education/testimonials/settings admin screens, GitHub API sync, and an ongoing (not one-time) framework-currency/performance/accessibility checklist.

## 9. Phase 6 Creative Direction — approved (documentation only, not implemented)

Recorded during Phase 3 (Checkpoint 3.7) so these already-made visual decisions aren't lost before Phase 6 actually starts. **Nothing in this section is built yet** — no retro assets, animations, parallax, or UI redesign exist in the codebase as of this note. Phase 6 remains sequenced after Phase 5 per §8.

**a) Retro splash / intro on `/`.** A single-screen retro landing inspired by authentic 1997–2001 personal homepages (GeoCities/Angelfire/Netscape-era/Dreamweaver aesthetic) — not a second portfolio, no retro nav/tabs. Main CTA visible above the fold immediately, never requiring a scroll to find; the CTA reveals the real modern portfolio. Content below the fold may continue the joke/detail but the screen's purpose is only an intro. Real résumé info may appear, intentionally period-bad-designed. Period elements: visitor counter, Netscape/IE/800×600 badges, "UNDER CONSTRUCTION" elements, animated dividers, low-res GIF aesthetic. Two matching dancing-Spider-Man GIFs desired, ideally one horizontally mirrored to face/frame the composition (subject to asset/licensing feasibility) — one dominant coherent retro visual language (the "Buddha" reference), not random GIF chaos. An old-phone/monophonic audio sting is an optional later experiment only, must respect browser autoplay rules. Despite the crude look, the implementation itself must be accessible, responsive, and built cleanly on the modern stack. After entering once, don't repeatedly force the splash in the same session — exact session/easter-egg return mechanism to be evaluated in Phase 6, not decided yet.

**b) Retro → modern transition.** No boring redirect if avoidable — the CTA should trigger a high-quality Motion transition that dramatically contrasts with the crude retro screen. Exact transition concept intentionally not locked yet; to be explored in Phase 6 before implementation.

**c) Modern portfolio visual direction.** Preserve the existing portfolio's personality/strengths — must not become a generic developer template, and must look clearly more premium than the current design (a redesign that doesn't clear this bar isn't approved). Strong but intentional parallax/scroll-linked storytelling — parallax serves composition/storytelling, not "make everything move." Explore layered technology scenes (computer/monitor, code windows, terminal fragments, geometric objects, grids/nodes, programming symbols, tech logos) rather than committing to one object up front; logos (React/Next/Node etc.) should feel integrated into scene depth, not pasted on as floating stickers. User photo/identity stays the focal point. Explore 2–3 art-direction mockups before committing to a final visual system — candidate concepts: (a) Tech Desk/computer scene, (b) Digital Space/geometric depth, (c) Hybrid portrait + digital workstation. Motion must support `prefers-reduced-motion`.

**d) Existing/future visual features to preserve or evolve.** `AnimatedNumber.tsx` is intentionally kept dead-but-present for a future animated statistics/counter section — real, meaningful metrics only, nothing fabricated. The current timeline scroll-progress line and `LilIcon` behavior (Part I §3, Part V) should *evolve* in Phase 6, not simply disappear. Certificates need a materially stronger visual treatment. Projects should move toward richer case-study presentation. A map/location section remains desired for the final portfolio. Hero/parallax, Projects, About/Experience, Certificates, and Contact can each carry different animation intensity while sharing one coherent design system.

**e) Later-phase admin/product features reconfirmed (unchanged from Part IV §7–8, restated here for continuity).** Dynamic admin for all content domains; image uploads (not manual source-file replacement); GitHub/deploy URL fields with eventual GitHub integration; analytics dashboard with visitor statistics; Job Application Studio (paste job posting → tailor CV → generate cover letter → downloadable versions) — ATS keyword optimization must be legitimate tailoring against the user's real experience, never fabricated qualifications.

## 10. Phase 5 integrated sign-off (Checkpoint 5.3, 2026-08-31) — actual implementation vs. this Part's original design

Phase 5 (Checkpoints 5.1 Projects, 5.2 Certificates, 5.3 this integrated sign-off) is **complete**. Both domains follow one identical, consistent architecture end-to-end: public page → `queries/` → repository (Mongo-first, static-fallback) unchanged from Phase 3; admin UI → admin API route → `verifyAdmin()` (called independently in every handler, never assuming `proxy.ts`/the admin layout already gated the request) → `.strict()` Zod write schema → admin repository → Mongoose. Verified via a full integrated audit: live Mongo data (9 Projects, 20 Certificates, unique slugs, correct order, all published, zero leftover test fixtures), all 5 admin API handlers (Projects collection/`[id]`, Certificates collection/`[id]`, the shared Cloudinary signing route), idempotent migration scripts, seed scripts that can no longer clobber admin-managed `order`/`published`/`imagePublicId`, and clean `typecheck`/`lint`/`build`/client-bundle-secret gates. No BLOCKER or IMPORTANT security/architecture findings.

Where the real implementation **differs from this Part's original sketch** (§§2–8 above), recorded here rather than silently rewriting that historical design text:

- **Mutations are Route Handlers, not Server Actions.** §7's diagram says "Mutations are Server Actions in `features/*/actions/*.ts`." The actual admin CRUD (`POST/GET/PATCH/DELETE /api/admin/{projects,certificates}[/[id]]`) is implemented as App Router Route Handlers instead, calling into `features/*/services/*AdminRepository.ts`. This was a deliberate in-the-moment choice (a REST-shaped admin API was more consistent with the already-existing Cloudinary signing Route Handler from Phase 4, and let the same `verifyAdmin()`-first / strict-Zod / controlled-status-code pattern be reused identically across all three admin surfaces) — not an oversight, and not revisited in this sign-off per its own scope rule against modifying working CRUD.
- **Actual folder structure is `app/admin/(protected)/*`, not `app/(admin)/admin/*`.** §7's tree shows an outer `(admin)` route group wrapping `admin/`. The implementation (Checkpoint 4.3) instead put the route-group boundary *inside* `admin/` — `admin/login/page.tsx` (unprotected) sits alongside `admin/(protected)/{page.tsx,projects/,certificates/,uploads/}` (protected). Functionally equivalent (same URLs, same protection boundary), just organized one level differently than originally sketched.
- **Cache/revalidation is `revalidatePath()`, not `revalidateTag()`/`updateTag()`.** §5's correction note (recorded after Phase 2) already established that `cacheComponents` was deliberately never enabled, and Part IV §5's original text expected tag-based invalidation once "Phase 5 admin Server Actions" existed. Since Phase 5 uses Route Handlers rather than Server Actions, and no `queries/*.ts` function ever adopted `"use cache"`/`cacheTag()`, the actual mechanism is a plain `revalidatePath('/projects')` / `revalidatePath('/certificates')` call after each successful admin write — the minimal correct primitive for this MVP's actual caching posture (public pages are otherwise statically generated at build time), not the tag/life machinery this Part anticipated. Confirmed sufficient for Phase 5's scope: publishing/editing/unpublishing was live-verified to update the public page immediately, no redeploy needed.
- **Cloudinary delete is intentionally deferred, not implemented.** §4 describes "delete-then-write ordering" as carrying forward unchanged from the prior draft. In the actual implementation, deleting or replacing a Project/Certificate's image does **not** delete the old Cloudinary asset — `imagePublicId` is read back from the deleted/replaced Mongo document server-side (never trusting client input) and stored for a future cleanup pass, but no `cloudinary.uploader.destroy()` call happens today. This is a deliberate, documented choice (Checkpoints 5.1/5.2's own route-handler comments): safely deleting across two systems (Mongo + Cloudinary) as one unit needs a real consistency mechanism (a queue, retry/reconciliation, or soft-delete-then-sweep), which is out of scope for an MVP CRUD checkpoint. **Classified as acceptable non-blocking technical debt, not a Phase 5 blocker** — the asset is orphaned (wastes a small amount of Cloudinary storage), never silently deleted incorrectly or leaked to a client; recommended as a focused Phase 5.x/6-adjacent follow-up checkpoint whenever it's prioritized, addressing both domains together since the pattern is identical.
- **`next-auth` exact pinned version recorded** (this Part's §1 asked for this and it had never actually been written down until now): `next-auth@5.0.0-beta.32`.

---

# Part V — Preservation Contract

Carried through every phase without exception until Phase 6 explicitly revisits it by design:

- Color palette (`dark #1b1b1b`, `light #f5f5f5`, `primary #B63E96`, `primaryDark #58E6D9`), Montserrat font, dark/light toggle behavior and flash-prevention.
- Framer Motion as the animation engine and every effect cataloged in Part I §3.
- The scroll-linked timeline mechanism (`LilIcon` + `useScroll`) as a foundation to extend later, not replace.
- The `@/*` → `src/*` alias, Tailwind dark-mode-by-class strategy, and the desktop-first `max-width` breakpoint convention.
- Existing page structure, URLs, and content as the public-facing site — all backend/admin work is additive.
