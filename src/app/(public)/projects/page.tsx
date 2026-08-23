import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import AnimatedText from "@/components/AnimatedText";
import TransitionEffect from "@/components/TransitionEffect";
import ProjectCard from "@/features/projects/components/ProjectCard";
import { getPublishedProjects } from "@/features/projects/queries/getPublishedProjects";

// Full generateMetadata/OG work (per Principle 13) is Checkpoint 2.10's
// explicit scope ("per-page generateMetadata where distinct: projects/
// certificates") — this is the same minimal static-metadata treatment
// already used for "/" and "/about", just replacing this page's original
// <Head> content.
export const metadata: Metadata = {
  title: 'VontrauwitzDEV | Projects',
  other: {
    projects: 'my projects',
  },
};

export default async function Projects() {
  const projects = await getPublishedProjects();

  return (
    <>
      <TransitionEffect />
      <main className="w-full mb-16 flex flex-col items-center justify-center">
        <Layout className="pt-16">
          <AnimatedText text="Imagination Trumps Knowledge!" className="mb-16 lg:!text-7xl md:!text-5xl sm:!text-4xl" />
          <div className="grid grid-cols-12 gap-10  lg:flex lg:flex-col">


            {/* TODO DOS PROYECTOS POR LINEA */}
            {projects.map((proj) => (
              <div className="col-span-6" key={proj.slug}>
                <ProjectCard
                  type={proj.type}
                  title={proj.title}
                  titleNote={proj.titleNote}
                  summary={proj.summary}
                  note={proj.note}
                  image={proj.image}
                  imageWidth={proj.imageWidth}
                  imageHeight={proj.imageHeight}
                  deployUrl={proj.deployUrl}
                  icon={proj.icon}
                  githubUrl={proj.githubUrl}
                />
              </div>
            ))}
          </div>
        </Layout>
      </main>
    </>
  );
}
