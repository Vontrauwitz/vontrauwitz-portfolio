import React, { useState } from 'react';
import { skills } from '@/data/skillsConst';
import AnimatedText from '@/components/AnimatedText';
import Icon from '@/components/Icon';
import { motion } from 'motion/react';

const CATEGORY_BY_BUTTON = {
  button1: 'frontend',
  button2: 'backend',
  button3: 'tools',
};

const Skills = () => {
  const [selectedButton, setSelectedButton] = useState('button1');
  const [selectedItem, setSelectedItem] = useState(null);

  const listItems = skills.filter((item) => item.category === CATEGORY_BY_BUTTON[selectedButton]);

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
    setSelectedItem(null);
  };

  return (
    <main className="flex w-full flex-col items-center justify-center">
      <AnimatedText className="mb-16 lg:!text-7xl md:!text-5xl sm:!text-4xl" text="Skills 😏" />

      <div className="flex pt-10 justify-between w-full lg:flex-col">
        <motion.div
          className="w-1/2 lg:w-full"
          initial={{ y: 50 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <div className="py-4 flex justify-center">
            <button
              className={`${selectedButton === 'button1' ? 'bg-primary' : 'bg-gray-300'
                } mr-4 p-3 rounded text-dark font-bold  sm:text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl`}
              onClick={(e) => {
                e.preventDefault();
                handleButtonClick('button1');
              }}
            >
              Front - end
            </button>
            <button
              className={`${selectedButton === 'button2' ? 'bg-primary' : 'bg-gray-300'
                } mx-2 p-2 rounded text-dark font-bold sm:text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl`}
              onClick={(e) => {
                e.preventDefault();
                handleButtonClick('button2');
              }}
            >
              Back - end
            </button>
            <button
              className={`${selectedButton === 'button3' ? 'bg-primary' : 'bg-gray-300'
                } ml-4 p-3 rounded text-dark font-bold sm:text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl`}
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

                className="flex flex-col items-center text-sm justify-center mt-2 bg-dark text-light rounded-md text-md font-semibold hover:bg-light hover:text-dark border-2 border-solid border-transparent hover:border-black px-3 dark:text-dark dark:bg-light hover:dark:bg-dark hover:dark:text-light hover:dark:border-light" style={{ minHeight: '90px' }}
                key={index}
              >
                <button onClick={() => setSelectedItem(item)} className={`${selectedItem === item ? 'text-primary' : ''} flex flex-col items-center`}>
                  <svg className="w-6 h-6">
                    <Icon name={item.icon} className={item.iconClassName} />
                  </svg>
                  <span className="mt-2 sm:text-xs md:text-sm lg:text-md">
                    {item.name}
                  </span>
                </button>

              </div>
            ))}
          </div>

        </motion.div>
        <div className="w-1/2 lg:w-full flex items-center justify-center">
          {selectedItem && (
            <div className="px-5">
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
