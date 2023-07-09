import React, { useState } from "react";
import Layout from '@/components/Layout';
import Head from 'next/head';
import AnimatedText from "@/components/AnimatedText";
import Link from "next/link";
import Image from "next/image";
import { projects, project } from '../../public/All-Texts/projectConst';
import project1 from '../../public/images/projects/proy/curved_lines_diagonal_pokemon.jpg'
import { GithubIcon } from '@/components/Icons';

const FeaturedProject = ({ type, title, summary, img, link, icon, iconWeb }) => {
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
        <Image src={img} alt={title} className="w-full h-60" />
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
            <p className="text-light text-center p-4 text-xs overflow-y-auto max-h-60">{summary}</p>
          </div>
        )}
      </div>
      <div className='w-full flex flex-col items-start justify-between mt-4'>
        <span className='text-primary font-bold text-xs'>{type}</span>
        <Link href={link} target="_blank" className='hover:underline underline-offset-2'>
          <h2 className='my-2 w-full text-left text-3xl font-bold'>{title}</h2>
        </Link>
        <div className='w-full mt-2 flex items-center justify-between'>
          <Link href={link} target="_blank" className='text-lg font-semibold underline'>
            Visit
          </Link>
          <Link href={icon} target="_blank" className='w-8'>
            {icon}
          </Link>
        </div>
      </div>
    </article>
  );

};

const Projects = () => {
  return (
    <>
      <Head>
        <title>VontrauwitzDEV | Projects</title>
        <meta name="projects" content="my projects" />
      </Head>
      <main className="w-full mb-16 flex flex-col items-center justify-center">
        <Layout className="pt-16">
          <AnimatedText text="Imagination Trumps Knowledge!" className="mb-16 lg:!text-7xl md:!text-5xl sm:!text-4xl" />
          <div className="grid grid-cols-12 gap-10  lg:flex lg:flex-col">


            {/* TODO DOS PROYECTOS POR LINEA */}
            {projects.map((proj, index) => (
              <div className="col-span-6" key={index}>
                <FeaturedProject
                  key={index}
                  type={proj.type}
                  title={proj.title}
                  summary={proj.summary}
                  img={proj.img}
                  link={proj.link}
                  icon={proj.icon}
                  iconWeb={proj.iconWeb}
                />
              </div>
            ))}
          </div>
        </Layout>
      </main>
    </>
  );
};

export default Projects;

