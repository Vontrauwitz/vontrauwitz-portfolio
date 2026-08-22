import { education } from '@/data/eduConst';
import { motion, useScroll } from 'framer-motion';
import { useRef } from 'react';
import LilIcon from './LilIcon';

const Details = ({ program, institutionUrl, institution, description, period }) => {

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
        >{program}
        </h3>
        <span className='capitalize font-medium text-dark/75 xs:text-sm'>
          {period} | &nbsp;
          <a
            href={institutionUrl}
            target='_blank'
            className='text-primary capitalize'
          >
            @{institution}
          </a>
        </span>
        <p className='font-medium w-full md:text-sm'>
          {description}
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
          {education.map((edu) => (
            <Details
              key={edu.slug}
              program={edu.program}
              institutionUrl={edu.institutionUrl}
              institution={edu.institution}
              period={edu.period}
              description={edu.description}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Education;
