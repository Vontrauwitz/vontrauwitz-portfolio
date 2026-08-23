import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Montserrat } from "next/font/google";
import "@/styles/globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-mont",
});

// Checkpoint 2.10: metadataBase is required for Next to resolve relative
// OG/canonical URLs to absolute ones. https://vontrauwitz-portfolio.vercel.app
// is the live deploy documented in README.md and already referenced as the
// site's own URL in src/data/expConst.ts (companyUrl for the "freelance"
// entries) — not a new/invented domain.
const siteUrl = "https://vontrauwitz-portfolio.vercel.app";
const siteName = "VontrauwitzDEV | Portfolio";
const siteDescription =
  "Personal portfolio of Hans Trauwitz, a full-stack developer — featuring projects, skills, experience, and certificates.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteName,
  description: siteDescription,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName,
    locale: "en_US",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Reproduces the dark-mode flash-prevention script that lived in the old
// Pages Router's _document.js (removed in Checkpoint 2.7) verbatim.
const themeInitScript = `
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script id="theme-switcher" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <main
          className={`${montserrat.variable} font-mont bg-light dark:bg-dark w-full min-h-screen`}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
