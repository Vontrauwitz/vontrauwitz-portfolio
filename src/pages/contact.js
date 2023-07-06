import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Head from 'next/head';
import AnimatedText from '@/components/AnimatedText';
import Image from 'next/image';
import profilePic from '../../public/images/contact/mexico1.png'
import { sendContactForm } from '@/lib/api';

const initValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
}

const initErrors = {
  name: false,
  email: false,
  subject: false,
  message: false,
};

const initState = { values: initValues, errors: initErrors };


const Contact = () => {

  const [state, setState] = useState(initState);
  const [touched, setTouched] = useState({});


  const { values, errors } = state;

  const handleChange = ({ target }) =>
    setState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [target.name]: target.value,
      },
    }));

  const onBlur = ({ target }) => setTouched((prev) => ({
    ...prev,
    [
      target.name
    ]: true
  }))

  const validateForm = () => {
    const { name, email, subject, message } = values;
    const newErrors = { ...initErrors };

    newErrors.name = name.trim() === "";
    newErrors.email = email.trim() === "";
    newErrors.subject = subject.trim() === "";
    newErrors.message = message.trim() === "";

    setState((prev) => ({
      ...prev,
      errors: newErrors,
    }));

    return Object.values(newErrors).every((error) => !error);
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (validateForm()) {
  //     // Lógica para enviar el formulario
  //     console.log("Formulario enviado:", values);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Formulario enviado:", values);
      try {
        await sendContactForm(values); // Asegúrate de que sendContactForm sea una función asíncrona que envíe el formulario
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
      }
    }
  };


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
                I am open to freelance opportunities, especially on ambitious or large projects. I am also happy to discuss other opportunities, so please do not hesitate to contact me if you have any questions or requests.

              </p>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-1">
                  <input type="text" placeholder="Name" name="name" value={values.name} onChange={handleChange} className="border  border-gray-400 py-1 px-2"
                    onBlur={onBlur}
                  />
                  <input type="email" placeholder="E-mail" name="email" value={values.email} onChange={handleChange} className="border  border-gray-400 py-1 px-2" />
                  <p className="text-red-500 text-xs italic" id="grid-name-error" > {errors.name && "Please enter your name."}</p>
                  <p className="text-red-500 text-xs italic" id="grid-email-error" >{errors.email && "Please enter your ."}</p>
                </div>

                <div className="mt-5">
                  <input type="text" placeholder="Subject" name="subject" value={values.subject} onChange={handleChange} className="border  border-gray-400 py-1 px-2 w-full" />
                  <p className="text-red-500 text-xs italic" id="grid-subject-error" > {errors.subject && "Please enter the subject."}</p>

                </div>
                <div className="my-5">
                  <textarea placeholder="Message" name="message" value={values.message} onChange={handleChange} className="w-full px-2 py-1 h-30 border border-gray-400 " />
                  <p className="text-red-500 text-xs italic" id="grid-message-error" >{errors.message && "Please enter your message."}</p>

                </div>
                <div>
                  <button
                    onClick={handleSubmit}
                    className='flex items-center bg-dark text-light p-.5 px-3  rounded-lg text-lg font-semibold 
                  hover:bg-light hover:text-dark border-2 border-solid border-transparent hover:border-black'
                  >
                    Send
                  </button>
                </div>
              </form>

            </div>
            {/* //TODO esto no funciona y arrgelar el onblurr  pobner un disabled al boton/}
            {/* //TODO revisar bien estas caracteristicas pero si dejar el borde , hacer un isloading al boton */}
            <div className='col-span-3 relative h-max rounded-2xl border-2 border-solid border-dark bg-light p-8 mr-20 mt-10'>
              {/* //TODO esta es la ceja pero no se ve */}
              {/* <div className='absolute top-0 -right-6 -z-10 w-[102%] h-[103%] rounded-[2rem] bg-dark' /> */}
              <Image src={profilePic} alt='Vontrauwitz' className='w.full h-auto rounded-2xl' />
            </div>
          </div>
        </Layout>
      </main>
    </>
  );
};


export default Contact;

{/* 
              <form>

                <input placeholder="Name" type="text" name="name" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />

                <input placeholder="Email" type="email" name="email" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />


                <input placeholder="Subject" type="text" name="subject" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                <textarea placeholder="Message" name="message" required className="w-full px-4 py-2 h-60 border border-gray-300 rounded-md"></textarea>

                <input type="submit" className="bg-primary text-white px-4 py-2 rounded-md" value="SEND" />
              </form> */}

{/* <form className='flex items-center justify-center'>
                <div className='relative'>
                  <input type="text" id='name' className='border-b py-1 focus:outline-none focus:border-primary focus:border-b-2 transition-colors peer' autocomplete="off" />
                  <label for="name" className='absolute left-0 top-1 text-gray-600 cursor-text peer-focus:text-xs peer-focus:-top-4 peer-focus:text-primary transition-all duration-500'>Your Name</label>
                </div>
              </form> */}


{/* <form className='flex items-center justify-center'>
                <div className='relative'>
                  <input type="text" id='name' className='border-b py-1 focus:outline-none focus:border-primary focus:border-b-2 transition-colors peer' autoComplete="off" />
                  <label htmlFor="name" className='absolute left-0 top-1 text-gray-600 cursor-text peer-focus:text-xs peer-focus:-top-4 peer-focus:text-primary transition-all duration-500'>Your Name</label>
                </div>
              </form> */}
