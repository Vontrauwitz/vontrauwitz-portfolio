"use client";

// Moved from src/pages/projects.js's inline FeaturedProject for Checkpoint
// 2.5, per PLAN.md Part III §2's target tree. Behavior/markup unchanged;
// only the file location, the "use client" directive, and light TypeScript
// typing are new. Stays a client component: hover state (useState,
// onMouseEnter/onMouseLeave) is real interactivity, not just an animation.

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Icon from "@/components/Icon";
import type { projects } from "@/data/projectConst";

type Project = (typeof projects)[number];

type ProjectCardProps = Pick<
  Project,
  'type' | 'title' | 'titleNote' | 'summary' | 'note' | 'image' | 'imageWidth' | 'imageHeight' | 'deployUrl' | 'icon' | 'githubUrl'
>;

const ProjectCard = ({ type, title, titleNote, summary, note, image, imageWidth, imageHeight, deployUrl, icon, githubUrl }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <article className='w-full h-full flex flex-col items-center justify-center rounded-2xl border border-solid border-dark bg-light py-1 px-2 relative mb-5'>
      <div
        className={`relative w-full h-auto overflow-hidden rounded-lg ${isHovered ? 'opacity-95' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave} >
        <Image
          src={image}
          alt={title}
          width={imageWidth}
          height={imageHeight}
          className="w-full h-60"
          priority
          sizes='(max-width: 768px) 100vw,
                (max-width: 1200px) 50vw,
                50vw'
        />
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
            <p className="text-light text-center p-4 text-xs overflow-y-auto max-h-60">
              {summary}
              {note && <strong> {note}</strong>}
            </p>
          </div>
        )}
      </div>
      <div className='w-full flex flex-col items-start justify-between mt-4'>
        <span className='text-primary font-bold text-xs'>{type}</span>


        {!deployUrl ? (
          <span className='my-2 w-full text-left text-3xl font-bold hover:underline underline-offset-2'>
            {title}
            {titleNote && <span className='block text-red-500 text-xs ml-10'>{titleNote}</span>}
          </span>
        ) : (
          <Link href={deployUrl} target="_blank" className='hover:underline underline-offset-2'>
            <h2 className='my-2 w-full text-left text-3xl font-bold'>
              {title}
              {titleNote && <span className='block text-red-500 text-xs ml-10'>{titleNote}</span>}
            </h2>
          </Link>
        )}

        <div className='w-full mt-2 flex items-center justify-between'>
          {!deployUrl ? (
            <span className='text-lg font-semibold'>{/* Renderiza aquí el texto de la visita sin enlace */}</span>
          ) : (
            <Link href={deployUrl} target="_blank" className='text-lg font-semibold underline'>
              Visit
            </Link>
          )}
          <Link href={githubUrl} target="_blank" className='w-8'>
            <Icon name={icon} className="w-5 ml-1" />
          </Link>
        </div>
      </div>
    </article>
  );

};

export default ProjectCard;
