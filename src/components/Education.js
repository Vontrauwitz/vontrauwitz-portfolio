import { education } from '../../public/All-Texts/eduConst';
import { motion, useScroll } from 'framer-motion';
import { useRef } from 'react';
import LilIcon from './LilIcon';

const Details = ({ type, schoolLink, place, info, position, company, companyLink, time, address, work }) => {

  const ref = useRef(null)

  return (

    <li ref={ref}
      className='my-8 first:mt-0 last:mb-0 w-[60%] mx-auto flex flex-col  justify-between md:w-[80%]'
    >

      <LilIcon reference={ref} />

      <motion.div
        initial={{ y: 50 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <h3
          className='capitalize font-bold text-2xl sm:text-xl xs:text-lg'
        >{type}
        </h3>
        <span className='capitalize font-medium text-dark/75 xs:text-sm'>
          {time} | &nbsp;
          <a
            href={schoolLink}
            target='_blank'
            className='text-primary capitalize'
          >
            @{place}
          </a>
        </span>
        <p className='font-medium w-full md:text-sm'>
          {info}
        </p>
      </motion.div>
    </li>
  )
}


const Education = () => {

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"]
  })

  return (
    <div className='my-20'>
      <h2 className='font-bold text-8xl mb-20 w-full text-center lg:!text-7xl md:!text-5xl sm:!text-4xl'>
        Education 📓
      </h2>
      <div
        ref={ref}
        className='w-[75%] mx-auto relative lg:w-[90%] md:w-full'
      >

        <motion.div
          style={{
            scaleY: scrollYProgress
          }}
          className='absolute left-7 top-0 w-[4px] h-full bg-dark origin-top dark:bg-light md:w-[2px] md_left-[30px] xs:left-[20px] ' />

        <ul
          className='w-full flex flex-col items-start justify-between ml-4 xs:ml-2'
        >
          {education.map((edu, index) => (
            <Details
              key={index}
              type={edu.type}
              schoolLink={edu.schoolLink}
              time={edu.time}
              place={edu.place}
              info={edu.info}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Education;
