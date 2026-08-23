import type { ReactNode } from "react";
import Footer from "@/components/Footer";

// NavBar is intentionally NOT rendered here yet. It imports `useRouter` from
// `next/router` (Pages Router only) inside CustomLink/CustomMobilLink, which
// throws under the App Router (no Pages Router context is mounted). Wiring
// NavBar in requires converting it to `next/navigation`'s usePathname/useRouter
// as part of actually migrating a route — deferred to that checkpoint, same
// as the AnimatePresence route-transition wrapper (see layout.tsx notes and
// the checkpoint report). Footer has no router dependency and works as-is.
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
