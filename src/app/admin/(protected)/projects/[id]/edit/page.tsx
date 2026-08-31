import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectById, isValidProjectId } from "@/features/projects/services/projectAdminRepository";
import ProjectForm from "../../ProjectForm";

export const metadata: Metadata = {
  title: "Edit Project | Admin | VontrauwitzDEV",
  robots: { index: false, follow: false },
};

// See admin/projects/page.tsx's identical export for why this is required
// rather than left to Next's default prerendering heuristics.
export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!isValidProjectId(id)) {
    notFound();
  }

  const project = await getProjectById(id);
  if (!project) {
    notFound();
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-4 py-16 bg-light dark:bg-dark">
      <div className="mb-10 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-dark dark:text-light">Edit project</h1>
      </div>
      <ProjectForm project={project} />
    </main>
  );
}
