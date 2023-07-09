import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Head from 'next/head';
import AnimatedText from '@/components/AnimatedText';
import Image from 'next/image';
import profilePic from '../../public/images/contact/mexico1.png'
import { sendContactForm } from '@/lib/api';
import { LoadIcon } from '@/components/Icons';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';

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
  const [isLoading, setIsLoading] = useState(false);


  const { values, errors } = state;
  const router = useRouter();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      console.log("Formulario enviado:", values);
      setTimeout(() => {
        router.push('/');
      }, 1500);
      try {
        await sendContactForm(values); // Asegúrate de que sendContactForm sea una función asíncrona que envíe el formulario
        const toastId = toast.success('El mensaje se envió correctamente');
        setTimeout(() => toast.dismiss(toastId), 3000); // Esto quitará la notificación después de 5 segundos
        setState(initState);
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
      } finally {
        setIsLoading(false); // Desactivar el loading después de enviar el formulario
      }
    }
  };

  return (
    <>
      <Head>
        <title>VontrauwitzDEV | Contact</title>
        <meta name="contact" content="contact me" />
      </Head>
      <main className='dark:text-light'>
        <Layout>

          <div className="flex items-center justify-between w-full mb-10  lg:flex-col-reverse">
            {/* <ToastContainer className="fixed top-0 right-0 m-4 p-2 z-50" /> */}
            <div className='w-1/2 lg:w-full flex flex-col items-center self-center px-2'>
              {/* //TODO <TypingCode />  CORREGIR ESTO Y HACERLO MAS TYPE*/}
              <AnimatedText text="Contact me!" className='w-full mb-16 lg:!text-6xl md:!text-4xl sm:!text-3xl' />
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
                    className='flex items-center bg-dark text-light p-.5 px-3 rounded-lg text-lg font-semibold 
  hover:bg-light hover:text-dark border-2 border-solid border-transparent hover:border-black dark:text-dark dark:bg-light hover:dark:bg-dark hover:dark:text-light hover:dark:border-light'
                  >
                    {isLoading && <LoadIcon className="text-black" />}
                    send
                  </button>
                </div>
              </form>

            </div>
            {/* //TODO esto no funciona y arrgelar el onblurr  pobner un disabled al boton/}
            {/* //TODO revisar bien estas caracteristicas pero si dejar el borde , hacer un isloading al boton */}
            <div className='w-full col-span-3 relative h-max rounded-2xl border-2 border-solid border-dark bg-light p-2  lg:w-65%'>
              {/* //TODO esta es la ceja pero no se ve */}
              {/* <div className='absolute top-0 -right-6 -z-10 w-[102%] h-[103%] rounded-[2rem] bg-dark' /> */}
              <Image src={profilePic} alt='Vontrauwitz' className='w-full h-auto rounded-2xl' />
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


{/* <button
                    onClick={handleSubmit}
                    className='flex items-center bg-dark text-light p-.5 px-3  rounded-lg text-lg font-semibold 
                  hover:bg-light hover:text-dark border-2 border-solid border-transparent hover:border-black dark:text-dark dark:bg-light hover:dark:bg-dark hover:dark:text-light hover:dark:border-light' */}

                                  // class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                  // >
                  //   Send
                  // </button>
