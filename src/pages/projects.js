import React, { useState } from "react";
import Layout from '@/components/Layout';
import Head from 'next/head';


const Projects = () => {


  return (
    <>
      <Head>
        <title>VontrauwitzDEV | Projects</title>
        <meta name="projects" content="my projects" />
      </Head>
      <main>
        <Layout>
          <h1>Projects</h1>
        </Layout>
      </main>
    </>
  );
};

export default Projects;
