import React, { useState } from 'react';
import { fullstack, frontend, backend, misc } from '../../public/All-Texts/certConst';
import AnimatedText from '@/components/AnimatedText';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import TransitionEffect from '@/components/TransitionEffect';

const Certificates = () => {
  const [selectedButton, setSelectedButton] = useState('button1');
  const [selectedItem, setSelectedItem] = useState(null);

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
    setSelectedItem(null);
  };

  //TODO Lógica para seleccionar los elementos iniciales según el botón seleccionado
  const selectInitialItems = () => {
    if (selectedButton === 'button1') {
      return fullstack;
    } else if (selectedButton === 'button2') {
      return frontend;
    } else if (selectedButton === 'button3') {
      return backend;
    } else if (selectedButton === 'button4') {
      return misc;
    }
  };

  const listItems = selectInitialItems();
  return (
    <>
      <Head>
        <title>VontrauwitzDEV | Certificates</title>
        <meta name="certificates" content="my certificates" />
      </Head>
      <TransitionEffect />
      <main className="flex w-full flex-col items-center justify-center ">
        <AnimatedText className="mb-16 lg:!text-7xl md:!text-5xl sm:!text-4xl" text="Certificates" />

        <div className="flex pt-10 justify-between w-full mb-20 lg:flex-col lg:mx-5  ">
          <div className="w-1/2  lg:w-full">
            <div className="py-4 px-5 flex justify-between lg:text-xs ">
              <div className="flex justify-center space-x-4">
                <button
                  className={`${selectedButton === 'button1' ? 'bg-primary' : 'bg-gray-200'
                    } rounded text-white button sm:text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleButtonClick('button1');
                  }}
                >
                  Full Stack
                </button>
                <button
                  className={`${selectedButton === 'button2' ? 'bg-primary' : 'bg-gray-200'
                    } rounded text-white button sm:text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleButtonClick('button2');
                  }}
                >
                  Front End
                </button>
                <button
                  className={`${selectedButton === 'button3' ? 'bg-primary' : 'bg-gray-200'
                    } rounded text-white button sm:text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleButtonClick('button3');
                  }}
                >
                  Back End
                </button>
                <button
                  className={`${selectedButton === 'button4' ? 'bg-primary' : 'bg-gray-200'
                    } rounded text-white button px-2 sm:text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleButtonClick('button4');
                  }}
                >
                  Misc
                </button>
              </div>

            </div>

            <div className="grid grid-cols-3 gap-2 px-4 py-4" style={{ minHeight: '100px' }}>
              {listItems.map((item, index) => (
                <div
                  className="flex items-center mt-2 px-1 bg-dark text-light rounded-md text-md font-semibold hover:bg-light hover:text-dark border-2 border-solid border-transparent hover:border-black " style={{ minHeight: '125px' }}
                  key={index}
                >
                  <button
                    onClick={() => setSelectedItem(item)}
                    className={`${selectedItem === item ? 'text-primary' : ''} flex items-center justify-center`}
                  >

                    <div className="flex flex-col items-center text-xs lg:flex-col">
                      <p className="mb-2">{item.title}</p>
                      <div className="flex">
                        <p>{item.school}</p>
                        <p className="ml-2 lg:flex-col">{item.issued}</p>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>

          </div>
          <div className="w-1/2 flex justify-center lg:w-full">
            {selectedItem && (
              <div className="mt-4 px-5 pt-5 ">
                <Image src={selectedItem.image} alt={selectedItem.title} width={500} height={300} className="my-4" />

                <Link
                  href={selectedItem.link}
                  target={"_blank"}
                  className="text-xs  hover:text-primary font-medium capitalize text-dark underline"
                >
                  show credential
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};
export default Certificates;


