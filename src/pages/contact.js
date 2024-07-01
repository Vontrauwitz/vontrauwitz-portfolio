import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Head from 'next/head';
import AnimatedText from '@/components/AnimatedText';
import Image from 'next/image';
import profilePicMon from '../../public/images/contact/montreal1.png';
import profilePicMon2 from '../../public/images/contact/montreal2.jpg';
import profilePicMon3 from '../../public/images/contact/montreal3.png';
import profilePicMon4 from '../../public/images/contact/montreal4.jpg';
import { sendContactForm } from '@/lib/api';
import { LoadIcon } from '@/components/Icons';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import TransitionEffect from '@/components/TransitionEffect';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const initValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

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
  const images = [profilePicMon3, profilePicMon4, profilePicMon2, profilePicMon];
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

  const onBlur = ({ target }) =>
    setTouched((prev) => ({
      ...prev,
      [target.name]: true,
    }));

  const validateForm = () => {
    const { name, email, subject, message } = values;
    const newErrors = { ...initErrors };

    newErrors.name = name.trim() === "";
    newErrors.email = !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
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
        setTimeout(() => toast.dismiss(toastId), 3000); // Esto quitará la notificación después de 3 segundos
        setState(initState);
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
      } finally {
        setIsLoading(false); // Desactivar el loading después de enviar el formulario
      }
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <>
      <Head>
        <title>VontrauwitzDEV | Contact</title>
        <meta name="contact" content="contact me" />
      </Head>
      <TransitionEffect />
      <main className='dark:text-light'>
        <Layout>
          <div className="flex items-center justify-between w-full  lg:flex-col-reverse min-h-screen">
            <div className='w-1/2 lg:w-full flex flex-col items-center self-center px-2'>
              <AnimatedText text="Contact me! 🖖🏽" className='w-full mb-16 lg:!text-6xl md:!text-4xl sm:!text-3xl sm:mb-2 md:mb-2 lg:mb-2' />
              <p className='my-4 text-base front-medium'>
                I am open to freelance opportunities, especially on ambitious or large projects. I am also happy to discuss other opportunities, so please do not hesitate to contact me if you have any questions or requests.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-1">
                  <input type="text" placeholder="Name" name="name" value={values.name} onChange={handleChange} className="border border-gray-400 py-1 px-2" onBlur={onBlur} />
                  <input type="email" placeholder="E-mail" name="email" value={values.email} onChange={handleChange} className="border border-gray-400 py-1 px-2" onBlur={onBlur} />
                  <p className="text-red-500 text-xs italic" id="grid-name-error">{errors.name && "Please enter your name."}</p>
                  <p className="text-red-500 text-xs italic" id="grid-email-error">{errors.email && "Please enter a valid email."}</p>
                </div>
                <div className="mt-5">
                  <input type="text" placeholder="Subject" name="subject" value={values.subject} onChange={handleChange} className="border border-gray-400 py-1 px-2 w-full" onBlur={onBlur} />
                  <p className="text-red-500 text-xs italic" id="grid-subject-error">{errors.subject && "Please enter the subject."}</p>
                </div>
                <div className="my-5">
                  <textarea placeholder="Message" name="message" value={values.message} onChange={handleChange} className="w-full px-2 py-1 h-30 border border-gray-400" onBlur={onBlur} />
                  <p className="text-red-500 text-xs italic" id="grid-message-error">{errors.message && "Please enter your message."}</p>
                </div>
                <div>
                  <button
                    onClick={handleSubmit}
                    className='flex items-center bg-dark text-light p-.5 px-3 rounded-lg text-lg font-semibold hover:bg-light hover:text-dark border-2 border-solid border-transparent hover:border-black dark:text-dark dark:bg-light hover:dark:bg-dark hover:dark:text-light hover:dark:border-light'
                    disabled={isLoading}
                  >
                    {isLoading && <LoadIcon className="text-black" />}
                    Send 🤟🏽
                  </button>
                </div>
              </form>
            </div>
            <div className='w-1/2 pb-20 h-full p-4 lg:w-full lg:mr-10 lg:ml-10 lg:pb-0 sm:mx-0'>
              <Slider {...settings}>
                {images.map((image, index) => (
                  <div key={index} className="w-full h-[800px] lg:h-[500px] relative">
                    <Image
                      src={image}
                      alt={`Slide ${index}`}
                      layout="fill"
                      className="object-cover rounded-3xl"
                      priority
                      placeholder="blur"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </Layout>
      </main>
    </>
  );
};

export default Contact;

