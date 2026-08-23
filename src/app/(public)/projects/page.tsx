import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import AnimatedText from "@/components/AnimatedText";
import TransitionEffect from "@/components/TransitionEffect";
import ProjectCard from "@/features/projects/components/ProjectCard";
import { getPublishedProjects } from "@/features/projects/queries/getPublishedProjects";

// Checkpoint 2.10: uses generateMetadata (not a static `metadata` export)
// because the description is derived from the real project count via the
// same getPublishedProjects() query the page itself reads — distinct,
// factual per-page metadata per Principle 13, with no invented numbers.
const title = 'VontrauwitzDEV | Projects';

export async function generateMetadata(): Promise<Metadata> {
  const projects = await getPublishedProjects();
  const description = `Explore ${projects.length} projects built by Hans Trauwitz, a full-stack developer.`;

  return {
    title,
    description,
    alternates: {
      canonical: '/projects',
    },
    openGraph: {
      title,
      description,
      url: '/projects',
      type: 'website',
      images: ['/opengraph-image'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/opengraph-image'],
    },
  };
}

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
