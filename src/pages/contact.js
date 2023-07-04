import React from 'react';
import Layout from '@/components/Layout';
import Head from 'next/head';
import AnimatedText from '@/components/AnimatedText';
import Image from 'next/image';
import profilePic from '../../public/images/contact/mexico1.png'



const Contact = () => {
  return (
    <>
      <Head>
        <title>VontrauwitzDEV | Projects</title>
        <meta name="projects" content="my projects" />
      </Head>
      <main>
        <Layout>
          <div className="flex items-center justify-between w-full mb-10">

            <div className='w-1/2 flex flex-col items-center self-center px-11'>
              {/* //TODO <TypingCode />  CORREGIR ESTO Y HACERLO MAS TYPE*/}
              <AnimatedText text="Contact me!" className='!text-4xl !text-left' />
              <p
                className='my-4 text-base front-medium'
              >

                I am interested in freelance opportunities - especially on ambitious
                or large projects. However, if you have any other requests or
                questions, don&apos;t hesitate to contact me using below form either.

              </p>

              <div className="contact-form">
                <ul className="flex">
                  <li className="w-1/2 mr-2">
                    <input placeholder="Name" type="text" name="name" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                  </li>
                  <li className="w-1/2 ml-2">
                    <input placeholder="Email" type="email" name="email" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                  </li>
                </ul>
                <ul>
                  <li className="w-full my-2">
                    <input placeholder="Subject" type="text" name="subject" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                  </li>
                  <li className="w-full">
                    <textarea placeholder="Message" name="message" required className="w-full px-4 py-2 h-60 border border-gray-300 rounded-md"></textarea>
                  </li>

                  {/* cambiar este boton no me convence la combinación de el color */}
                  <li className="w-full mt-2">
                    <input type="submit" className="bg-primary text-white px-4 py-2 rounded-md" value="SEND" />
                  </li>
                </ul>
              </div>



            </div>
            {/* //TODO esto no funciona */}
            {/* //TODO revisar bien estas caracteristicas pero si dejar el borde */}
            <div className='col-span-3 relative h-max rounded-2xl border-2 border-solid border-dark bg-light p-8 mr-20 mt-10'>
              {/* //TODO esta es la ceja pero no se ve */}
              <div className='absolute top-0 -right-3 -z-10 w-[102%] h-[103%] rounded-[2rem] bg-dark' />
              <Image src={profilePic} alt='Vontrauwitz' className='w.full h-auto rounded-2xl' />
            </div>
          </div>
        </Layout>
      </main>
    </>
  );
};


export default Contact;

