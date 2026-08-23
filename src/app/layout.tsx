import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Montserrat } from "next/font/google";
import "@/styles/globals.css";

// Same physical stylesheet the Pages Router's _app.js still imports for the
// routes that haven't migrated yet — not a duplicate, just a second import
// site for one shared file until src/pages is removed (Checkpoint 2.8).

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-mont",
});

export const metadata: Metadata = {
  title: "VontrauwitzDEV | Portfolio",
  description: "my description",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Reproduces src/pages/_document.js's inline theme script verbatim. Pages
// Router routes still get their flash-prevention from _document.js — that
// file only affects pages/, not app/ — so this is a second, independent
// implementation of the same logic for the App Router side, not a shared one.
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
