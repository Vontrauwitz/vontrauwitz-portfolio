import type { ReactNode } from "react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/Footer";

// NavBar is components/layout/NavBar.tsx, the next/navigation-based version
// created in Checkpoint 2.3 for App Router compatibility. The original
// src/components/NavBar.js (next/router-based, Pages Router only) was
// deleted in Checkpoint 2.8 once nothing referenced it anymore.
//
// AnimatePresence-based route-transition orchestration is still not present
// here — see PLAN.md Part III §7; introducing it is separate front-end
// polish work, not part of the router migration itself.
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
}
