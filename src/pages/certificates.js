import React, { useState } from 'react';
import { fullstack, frontend, backend, misc } from '../../public/All-Texts/certConst';
import AnimatedText from '@/components/AnimatedText';
import Image from 'next/image';
import Link from 'next/link';

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
    <main className="flex w-full flex-col items-center justify-center">
      <AnimatedText className="mb-16" text="Certificates" />

      <div className="flex pt-10 justify-between w-full mb-20">
        <div className="w-1/2">
          <div className="py-4 flex justify-center">
            <button
              className={`${selectedButton === 'button1' ? 'bg-primary' : 'bg-gray-200'
                } mr-4 p-3 rounded text-white`}
              onClick={(e) => {
                e.preventDefault();
                handleButtonClick('button1');
              }}
            >
              Full-Stack
            </button>
            <button
              className={`${selectedButton === 'button2' ? 'bg-primary' : 'bg-gray-200'
                } mr-4 p-3 rounded text-white`}
              onClick={(e) => {
                e.preventDefault();
                handleButtonClick('button2');
              }}
            >
              Front-end
            </button>
            <button
              className={`${selectedButton === 'button3' ? 'bg-primary' : 'bg-gray-200'
                } mx-4 p-3 rounded text-white`}
              onClick={(e) => {
                e.preventDefault();
                handleButtonClick('button3');
              }}
            >
              Back-end
            </button>
            <button
              className={`${selectedButton === 'button4' ? 'bg-primary' : 'bg-gray-200'
                } ml-4 p-3 rounded text-white`}
              onClick={(e) => {
                e.preventDefault();
                handleButtonClick('button4');
              }}
            >
              Misc
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 px-4" style={{ minHeight: '300px' }}>
            {listItems.map((item, index) => (
              <div
                className="flex items-center self-start mt-2 px-1 bg-dark text-light rounded-md text-md font-semibold hover:bg-light hover:text-dark border-2 border-solid border-transparent hover:border-black " style={{ minHeight: '100px' }}
                key={index}
              >
                <button
                  onClick={() => setSelectedItem(item)}
                  className={`${selectedItem === item ? 'text-primary' : ''} flex items-center justify-center`}
                >

                  <div className="flex flex-col items-center text-xs">
                    <p className="mb-2">{item.title}</p>
                    <div className="flex">
                      <p>{item.school}</p>
                      <p className="ml-2">{item.issued}</p>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/2 flex justify-center">
          {selectedItem && (
            <div className="mt-4 px-20 pt-8">
              <Image src={selectedItem.image} alt={selectedItem.title} width={500} height={300} className="my-4" />

              {/* <p>{selectedItem.description}</p> */}
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
  );
};
export default Certificates;


