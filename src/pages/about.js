import AnimatedText from '@/components/AnimatedText';
import Layout from '@/components/Layout';
import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
import profilePic from '../../public/images/profile/yo1.jpg'
import profilePic2 from '../../public/images/profile/yo1.1.png'
import { isMotionValue, useInView, useMotionValue, useSpring } from 'framer-motion';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Education from '@/components/Education';
import Link from 'next/link'
import { CertificateIcon } from '@/components/Icons'
import Testimonials from '@/components/Testimonials';



const AnimatedNumber = ({ value }) => {
  const ref = useRef(null);

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 3000 });
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    };
  }, [isInView, value, motionValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      // console.log(latest);
      if (ref.current && latest.toFixed(0) <= value) {
        ref.current.textContent = latest.toFixed(0)
      }
    });
  }, [springValue, value]);

  return <span ref={ref}></span>
}

const About = () => {
  return (
    <>
      <Head>
        <title>VontrauwitzDEV | About</title>
        <meta name="description" content="my description" />
      </Head>
      <main className='flex w-full flex-col items-center justify-center dark:text-light'>
        <Layout className='pt-16'>
          <AnimatedText className='mb-16' text="Code To Solve Problems! " />
          <div className='grid w-full grid-cols-8 gap-16 pb-10'>
            <div className='col-span-4 flex flex-col items-center justify-center'>
              <h2 className='mb-4 text-lg font-bold uppercase text-dark/75 dark:text-light/75'>Biography</h2>
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
            <div className='col-span-4  flex items-center justify-center'>
              <div className='max-w-full  relative h-auto rounded-2xl border-2 border-solid border-dark bg-light dark:bg-dark dark:border-light p-8'>
                <div className='absolute top-0 -right-3 -z-10 w-[102%] h-[103%] rounded-[2rem] bg-dark dark:bg-light' />
                <Image src={profilePic} alt='Vontrauwitz' className='w-full h-auto rounded-2xl object-contain' />
              </div>
            </div>

          </div>
          <Skills />
          <Experience />
          <Education />
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
          <Testimonials />
        </Layout>
      </main>
    </>
  );
}

export default About;

