import React, { useState } from 'react';
import { frontend, backend, tools } from '../../public/All-Texts/skillsConst';
import AnimatedText from '@/components/AnimatedText';

const Skills = () => {
  const [selectedButton, setSelectedButton] = useState('button1');
  const [listItems, setListItems] = useState(frontend);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
    setSelectedItem(null);
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
      <AnimatedText className="mb-16" text="Skills" />

      <div className="flex pt-10 justify-between w-full">
        <div className="w-1/2">
          <div className="py-4 flex justify-center">
            <button
              className={`${selectedButton === 'button1' ? 'bg-primary' : 'bg-gray-300'
                } mr-4 p-3 rounded text-dark font-bold`}
              onClick={(e) => {
                e.preventDefault();
                handleButtonClick('button1');
              }}
            >
              Front-end
            </button>
            <button
              className={`${selectedButton === 'button2' ? 'bg-primary' : 'bg-gray-300'
                } mx-4 p-3 rounded text-dark font-bold`}
              onClick={(e) => {
                e.preventDefault();
                handleButtonClick('button2');
              }}
            >
              Back-end
            </button>
            <button
              className={`${selectedButton === 'button3' ? 'bg-primary' : 'bg-gray-300'
                } ml-4 p-3 rounded text-dark font-bold`}
              onClick={(e) => {
                e.preventDefault();
                handleButtonClick('button3');
              }}
            >
              Tools
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {listItems.map((item, index) => (
              <div
                className="flex items-center self-start mt-2 bg-dark text-light rounded-md text-md font-semibold hover:bg-light hover:text-dark border-2 border-solid border-transparent hover:border-black px-3 dark:text-dark dark:bg-light hover:dark:bg-dark hover:dark:text-light hover:dark:border-light" style={{ minHeight: '70px' }}
                key={index}
              >
                <button
                  onClick={() => setSelectedItem(item)}
                  className={`${selectedItem === item ? 'text-primary' : ''} flex items-center justify-center p-0.5`}
                >
                  <div className="w-8">
                    {item.icon}
                  </div>
                  <span className="text-xs ml-2">{item.name}</span>
                </button>
              </div>
            ))}
          </div>



        </div>
        <div className="w-1/2 flex justify-center">
          {selectedItem && (
            <div className="mt-4 px-20 pt-8">
              <h3 className=" mt-10 py-5">{selectedItem.name}</h3>
              <p>{selectedItem.description}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Skills;
