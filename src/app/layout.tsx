import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Montserrat } from "next/font/google";
import "@/styles/globals.css";

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
