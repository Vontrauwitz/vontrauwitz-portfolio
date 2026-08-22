# Vontrauwitz Portfolio

Personal portfolio site for Hans Trauwitz — full-stack developer. Built with Next.js (Pages Router) and Tailwind CSS, deployed on Vercel.

Live: https://vontrauwitz-portfolio.vercel.app

## Tech Stack

- **Framework:** Next.js 13.2.4 (Pages Router, JavaScript — no TypeScript)
- **Styling:** Tailwind CSS, with a class-based dark mode
- **Animation:** Framer Motion (page transitions, scroll-linked timelines, text reveals)
- **Fonts:** `next/font/google` (Montserrat)
- **Contact form:** Nodemailer (Gmail SMTP) via a single API route
- **Other UI libs:** react-slick / slick-carousel (Contact page image carousel), react-toastify (form feedback)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file with:

```
EMAIL=<gmail address used to send contact-form emails>
EMAIL_PASS=<gmail app password>
NEXT_PUBLIC_MAPS_API_KEY=<Google Maps JavaScript API key>
```

`EMAIL` / `EMAIL_PASS` are consumed server-side in `src/config/nodemailer.js` by the `/api/contact` route. `NEXT_PUBLIC_MAPS_API_KEY` is reserved for a planned location/map section (the `@googlemaps/js-api-loader` dependency is already installed but not yet wired up).

## Project Structure

```
public/
  All-Texts/     # Site content (projects, skills, experience, education, certificates, testimonials)
                 # as plain JS modules — this is the current "content management" layer.
  images/        # Static images used across the site
src/
  pages/         # File-based routes: /, /about, /projects, /certificates, /contact, /api/contact
  components/    # Shared UI: NavBar, Footer, Layout, AnimatedText, TransitionEffect, icon set, etc.
  lib/           # Client-side helpers (contact form fetch wrapper)
  config/        # Server-side config (Nodemailer transporter)
  styles/        # Tailwind entrypoint
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build locally
- `npm run lint` — run ESLint (`next/core-web-vitals`)

## Roadmap

See `PLAN.md` for the current codebase analysis and the phased modernization plan (bug fixes/cleanup, content-model extraction, animation refresh, an authenticated `/admin` dashboard, analytics, and a "Job Application Studio").
