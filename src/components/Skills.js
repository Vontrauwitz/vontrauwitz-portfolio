// import React, { useState } from 'react';
// import { frontend, backend } from '../../public/All-Texts/skillsConst'; // Importa los datos desde el archivo donde se encuentran
// import Image from 'next/image';
// import fotomuestra from '../../public/images/profile/yo1.3sf.png'
// import AnimatedText from '@/components/AnimatedText';



// const Skills = () => {
//   const [selectedButton, setSelectedButton] = useState('button1');
//   const [listItems, setListItems] = useState(frontend); // Inicializa la lista con los datos del frontend por defecto

//   const handleButtonClick = (buttonName) => {
//     setSelectedButton(buttonName);
//     if (buttonName === 'button1') {
//       setListItems(frontend);
//     } else if (buttonName === 'button2') {
//       setListItems(backend);
//     }
//   };

//   return (

//     <main className='flex w-full flex-col items-center justify-center'>

//       <AnimatedText className='mb-16' text="Skills!" />
//       {/* inicio */}

//       <div className="flex pt-10 justify-between w-full">
//         <div className='w-1/2'>
//           {/* <AnimatedText text="Code Artist: Turning Dreams into Digital Realities." className='!text-4xl !text-left' /> */}
//           <div className=' py-4 flex justify-center'>
//             <button
//               className={`${selectedButton === 'button1' ? 'bg-blue-500' : 'bg-gray-200'
//                 } mr-4 p-3 rounded text-white`}
//               onClick={(e) => { e.preventDefault(); handleButtonClick('button1') }}
//             >
//               Botón 1
//             </button>
//             <button
//               className={`${selectedButton === 'button2' ? 'bg-blue-500' : 'bg-gray-200'
//                 } ml-4 p-3 rounded text-white`}
//               onClick={(e) => { e.preventDefault(); handleButtonClick('button2') }}
//             >
//               Botón 2
//             </button>
//           </div>

//           <div className="grid grid-cols-4 gap-2">
//             {listItems.map((item, index) => (
//               <div key={index} >
//                 <ul className="pl-4 list-none">
//                   <li key={index}>{item.name}</li>
//                 </ul>
//               </div>
//             ))}
//           </div>

//         </div>
//         <div className='w-1/2 flex justify-center '>
//           {/* <Image src={fotomuestra} alt="vontrauwitz" className='w-256 h-auto' /> */}

//         </div>
//       </div>
//       {/* final */}

//     </main>

//   );
// };



// export default Skills;

import React, { useState } from 'react';
import { frontend, backend, tools } from '../../public/All-Texts/skillsConst'; // Importa los datos desde el archivo donde se encuentran
import Image from 'next/image';
import fotomuestra from '../../public/images/profile/yo1.3sf.png';
import AnimatedText from '@/components/AnimatedText';
import { NextJsIcon } from '@/components/Icons';


const Skills = () => {
  const [selectedButton, setSelectedButton] = useState('button1');
  const [listItems, setListItems] = useState(frontend); // Inicializa la lista con los datos del frontend por defecto
  const [selectedItem, setSelectedItem] = useState(null);

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
    setSelectedItem(null); // Reinicia el estado de selectedItem al cambiar de categoría
    if (buttonName === 'button1') {
      setListItems(frontend);
    } else if (buttonName === 'button2') {
      setListItems(backend);
    } else if (buttonName === 'button3') {
      setListItems(tools);
    }
  };

  return (
    <main className="flex w-full flex-col items-center justify-center">
      <AnimatedText className="mb-16" text="Skills!" />

      <div className="flex pt-10 justify-between w-full">
        <div className="w-1/2">
          <div className="py-4 flex justify-center">
            <button
              className={`${selectedButton === 'button1' ? 'bg-blue-500' : 'bg-gray-200'
                } mr-4 p-3 rounded text-white`}
              onClick={(e) => {
                e.preventDefault();
                handleButtonClick('button1');
              }}
            >
              Botón 1
            </button>
            <button
              className={`${selectedButton === 'button2' ? 'bg-blue-500' : 'bg-gray-200'
                } mx-4 p-3 rounded text-white`}
              onClick={(e) => {
                e.preventDefault();
                handleButtonClick('button2');
              }}
            >
              Botón 2
            </button>
            <button
              className={`${selectedButton === 'button3' ? 'bg-blue-500' : 'bg-gray-200'
                } ml-4 p-3 rounded text-white`}
              onClick={(e) => {
                e.preventDefault();
                handleButtonClick('button3');
              }}
            >
              Botón 3
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {listItems.map((item, index) => (
              <div className="flex items-center bg-dark text-light   rounded-md text-md font-semibold 
                  hover:bg-light hover:text-dark border-2 border-solid border-transparent hover:border-black" key={index}>
                <ul className="list-none">
                  <li
                    key={index}
                    onClick={() => setSelectedItem(item)}
                    className={`${selectedItem === item ? 'text-blue-500' : ''}`}
                  >
                    {item.icon}
                    {item.name}
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/2 flex justify-center">
          {selectedItem && (
            <div className="mt-4">
              <h3>{selectedItem.name}</h3>
              <p>{selectedItem.description}</p>

            </div>
          )}
        </div>
      </div>
    </main>
  );



};


export default Skills;
