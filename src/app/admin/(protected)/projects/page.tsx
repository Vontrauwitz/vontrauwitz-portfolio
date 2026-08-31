import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { listAdminProjects } from "@/features/projects/services/projectAdminRepository";
import DeleteProjectButton from "./DeleteProjectButton";

export const metadata: Metadata = {
  title: "Projects | Admin | VontrauwitzDEV",
  robots: { index: false, follow: false },
};

// Never statically prerendered: this reads live, auth-gated Mongo data via
// listAdminProjects() with no dynamic-API call (no cookies()/headers()) to
// otherwise signal that to Next automatically. Without this, `next build`
// tries to prerender the page at build time against the real database —
// caught for real during this checkpoint (a build failure, not a
// hypothetical) before `force-dynamic` and a createdAt backfill fixed it.
export const dynamic = "force-dynamic";

// Checkpoint 5.1 — no verifyAdmin() call here, same established rule as
// admin/(protected)/page.tsx since Checkpoint 4.3: this is a Server
// Component rendered only after admin/(protected)/layout.tsx's own
// verifyAdmin() gate already passed. listAdminProjects() is called
// directly (not via the /api/admin/projects route) since a Server
// Component can read the DAL in-process — the API route exists for the
// client-side create/edit/delete forms, which have no other way to reach
// the server.
export default async function AdminProjectsPage() {
  const projects = await listAdminProjects();

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-4 py-16 bg-light dark:bg-dark">
      <div className="w-full max-w-3xl">
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-dark dark:text-light">Projects</h1>
          <Link
            href="/admin/projects/new"
            className="bg-dark text-light px-4 py-2 rounded-lg text-sm font-semibold hover:bg-light hover:text-dark border-2 border-solid border-transparent hover:border-black dark:text-dark dark:bg-light hover:dark:bg-dark hover:dark:text-light hover:dark:border-light"
          >
            New project
          </Link>
        </div>

        {projects.length === 0 ? (
          <p className="text-dark/60 dark:text-light/60">No projects yet.</p>
        ) : (
          <ul className="space-y-3">
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex items-center gap-4 rounded-lg border-2 border-dark/10 p-4 dark:border-light/10"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-dark/5 dark:bg-light/5">
                  {project.image && (
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={64}
                      height={64}
                      className="h-16 w-16 object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-dark dark:text-light">{project.title}</p>
                  <p className="text-sm text-dark/60 dark:text-light/60">
                    order: {project.order} · {project.published ? "published" : "unpublished"}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="rounded-lg border-2 border-dark/10 px-3 py-1.5 text-xs font-semibold text-dark hover:border-primary dark:border-light/10 dark:text-light hover:dark:border-primaryDark"
                  >
                    Edit
                  </Link>
                  <DeleteProjectButton id={project.id} title={project.title} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
