"use client";

// Moved from src/components/Skills.js for Checkpoint 2.4, per PLAN.md Part III
// §2's target tree. Behavior/markup unchanged; only the file location, the
// "use client" directive, and light TypeScript typing are new.
//
// Checkpoint 3.5 Stage A: no longer imports the runtime `skills` array
// from @/data/skillsConst — receives it as a prop from the (server)
// about/page.tsx via getSkills() instead, same pattern already used for
// Projects/Certificates. The `Skill` type now comes from getSkills.ts (a
// proper domain type) rather than being derived from a runtime data
// import just for typing.

import { useState } from 'react';
import AnimatedText from '@/components/AnimatedText';
import Icon from '@/components/Icon';
import { motion } from 'motion/react';
import type { Skill } from '@/features/skills/queries/getSkills';

const CATEGORY_BY_BUTTON: Record<string, Skill['category']> = {
  button1: 'frontend',
  button2: 'backend',
  button3: 'tools',
};

type SkillsTabsProps = {
  skills: Skill[];
};

const SkillsTabs = ({ skills }: SkillsTabsProps) => {
  const [selectedButton, setSelectedButton] = useState('button1');
  const [selectedItem, setSelectedItem] = useState<Skill | null>(null);

  const listItems = skills.filter((item) => item.category === CATEGORY_BY_BUTTON[selectedButton]);

  const handleButtonClick = (buttonName: string) => {
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

export default SkillsTabs;
