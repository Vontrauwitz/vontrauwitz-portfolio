import type { ReactNode } from "react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/Footer";

// NavBar here is the next/navigation-based fork (components/layout/NavBar.tsx),
// not the original src/components/NavBar.js (which still powers the routes
// that haven't migrated yet, via src/pages/_app.js). See the Checkpoint 2.3
// report for why the fork exists and when it goes away.
//
// AnimatePresence-based route-transition orchestration is still not present
// here — with only "/" migrated so far there are no two App-Router pages to
// transition between yet. Deferred to the checkpoint where a second page
// migrates; see PLAN.md Part III §7.
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
}
