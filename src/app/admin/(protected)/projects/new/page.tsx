import type { Metadata } from "next";
import ProjectForm from "../ProjectForm";

export const metadata: Metadata = {
  title: "New Project | Admin | VontrauwitzDEV",
  robots: { index: false, follow: false },
};

export default function NewProjectPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center px-4 py-16 bg-light dark:bg-dark">
      <div className="mb-10 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-dark dark:text-light">New project</h1>
      </div>
      <ProjectForm />
    </main>
  );
}
