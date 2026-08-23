import type { Metadata } from 'next';
import AnimatedText from '@/components/AnimatedText';
import Layout from '@/components/Layout';
import Image from 'next/image';
import profilePic from '../../../../public/images/profile/yo1.jpg'
import profilePic2 from '../../../../public/images/profile/yo1.1.png'
import SkillsTabs from '@/features/skills/components/SkillsTabs';
import ExperienceTimeline from '@/features/experience/components/ExperienceTimeline';
import EducationTimeline from '@/features/experience/components/EducationTimeline';
import Link from 'next/link'
import { CertificateIcon } from '@/components/ui/icons'
import TestimonialList from '@/features/testimonials/components/TestimonialList';
import TransitionEffect from '@/components/TransitionEffect';

// Description matches the root layout's default, so only the title needs
// to be declared here (page-level metadata is shallow-merged with layout
// metadata; unspecified fields are inherited).
export const metadata: Metadata = {
  title: 'VontrauwitzDEV | About',
};

// AnimatedNumber was dead code in the original pages/about.js too (defined,
// never rendered here) — it now lives in src/components/AnimatedNumber.tsx
// as its own client component, since a Server Component file can't import
// React/motion hooks at all, even unused. Not imported here because nothing
// in this page renders it, exactly as before.

const About = () => {
  return (
    <>
      <TransitionEffect />
      <main className='flex w-full flex-col items-center justify-center dark:text-light '>
        <Layout className='pt-16'>
          <AnimatedText className='mb-16 lg:!text-7xl md:!text-5xl sm:!text-4xl' text="Code To Solve Problems!" />
          <div className='grid w-full grid-cols-8 gap-16 pb-10 lg:flex lg:items-center lg:flex-col-reverse'>
            <div className='col-span-4 flex flex-col items-center justify-center'>
              <h2 className='mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75 lg:!text-center'>Biography</h2>
              <p className='font-small'>
                Hi, I&apos;m Hans, a Full Stack developer focused on creating robust and efficient digital experiences. I have a deep understanding of design principles, user experience, and the technical aspects of web development. I enjoy finding innovative solutions to complex problems and strive to deliver intuitive and seamless experiences for users.
              </p>
              <p className=' my-4 font-small'>
                In my view, design goes beyond aesthetics. It involves problem-solving and crafting experiences that resonate with users. I firmly believe in a user-centered approach, always considering the target audience and their specific needs and goals. By leveraging this understanding, I can make informed design decisions that result in user-friendly products.
              </p>
              <p className='font-small'>
                I&apos;m excited to continue advancing my career as a Full Stack developer, utilizing my skills and passion to make meaningful contributions to the field. I look forward to the opportunity to collaborate with you on your next project and create exceptional digital solutions together.
              </p>
            </div>
            <div className='col-span-4  flex items-center justify-center lg:w-75%'>
              <div className='max-w-full  relative h-auto rounded-2xl border-2 border-solid border-dark bg-light dark:bg-dark dark:border-light p-8'>
                <div className='absolute top-0 -right-3 -z-10 w-[102%] h-[103%] rounded-[2rem] bg-dark dark:bg-light' />
                <Image
                  src={profilePic}
                  alt='Vontrauwitz'
                  className='w-full h-auto rounded-2xl object-contain'
                  priority
                  sizes='(max-width: 768px) 100vw,
                (max-width: 1200px) 50vw,
                50vw'
                />
              </div>
            </div>

          </div>
          <SkillsTabs />
          <ExperienceTimeline />
          <EducationTimeline />
          <div className='flex items-center self-start mt-2 mb-10'>
            <Link
              href="/certificates"
              className='flex items-center bg-dark text-light p-.5 px-3  rounded-lg text-lg font-semibold
                  hover:bg-light hover:text-dark border-2 border-solid border-transparent hover:border-black dark:text-dark dark:bg-light hover:dark:bg-dark hover:dark:text-light hover:dark:border-light'
              download={true}
            >
              Certificates
              <CertificateIcon className={"w-6 ml-4"} />
            </Link>
          </div>
          <TestimonialList />


        </Layout>
      </main>
    </>
  );
}

export default About;
