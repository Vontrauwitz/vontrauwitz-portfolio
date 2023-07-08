import Layout from '@/components/Layout'
import Head from 'next/head'
import Image from 'next/image'
import profileimg from "../../public/images/profile/yo1.3sf.png"
import AnimatedText from '@/components/AnimatedText'
import Link from 'next/link'
import { LinkArrow } from '@/components/Icons'

export default function Home() {
  return (
    <>
      <Head>
        <title>VontrauwitzDEV | Portfolio</title>
        <meta name="welcome" content="welcome" />
      </Head>
      <main className='flex items-center text-dark w-full min-h-screen dark:text-light'>
        <Layout className='pt-0 '>
          <div className='flex lg:items-center lg:flex-col'>
            <div className='w-1/2 md:w-full'>
              <Image
                src={profileimg}
                alt="vontrauwitz"
                className='w-[100%] my-2 lg:mb-15'
                priority
                sizes='(max-width: 768px) 100vw,
                (max-width: 1200px) 50vw,
                50vw'
              />
            </div>
            <div className='w-1/2 lg:w-full flex flex-col items-start self-center'>
              <AnimatedText text="Code Artist" className='text-left lg:text-6xl md:text-5xl lg:text-center sm:text-4xl xs:text-3xl ' />
              <AnimatedText text="Turning Dreams into Digital Reality." className='text-xl text-left lg:text-center md:text-lg sm:text-sm' />

              <p
                className='my-2 text-base front-medium'
              >
                Hello there! I am a full-stack developer with a passion for turning ideas into reality. I have a strong understanding of both the front-end and back-end development of web applications, and I am always looking for new and innovative ways to create user-friendly and engaging experiences.

                I believe that code is a powerful tool that can be used to solve problems and create new possibilities. I am excited to use my skills to help businesses and individuals achieve their goals.

                I am confident that I have the skills and experience to be a valuable asset to your team.

                Let&apo;s embark on an exciting journey where innovation meets coding excellence.

              </p>
              <div className='flex items-center self-start mt-2'>
                <Link
                  href="/cvhanstrauwitzbrita.pdf"
                  target={"_blank"}
                  className='flex items-center bg-dark text-light p-1.5 px-6 rounded-lg text-lg font-semibold
                  hover:bg-light hover:text-dark border-2 border-solid border-transparent hover:border-black dark:text-dark dark:bg-light hover:dark:bg-dark hover:dark:text-light hover:dark:border-light'
                  download={true}
                >
                  Resume
                  <LinkArrow className={"w-6 ml-1"} />

                </Link>
                {/* //TODO NO ME GUSTA ESTO */}
                {/* <Link
                  href="mailto:"
                  target={"_blank"}
                  className="ml-6 text-lg font-medium capitalize text-dark underline"
                >
                  Contact
                </Link> */}
              </div>
            </div>
          </div>
        </Layout>
      </main>
    </>
  )
}







