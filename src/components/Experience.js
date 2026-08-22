import { experience } from '@/data/expConst';
import { motion, useScroll } from 'framer-motion';
import { useRef } from 'react';
import LilIcon from './LilIcon';

const Details = ({ position, company, companyUrl, period, location, description }) => {

  const ref = useRef(null)

  return (

    <li ref={ref}
      className='my-8 first:mt-0 last:mb-0 w-[60%] mx-auto flex flex-col items-center justify-between md:w-[80%]'
    >

      <LilIcon reference={ref} />

      <motion.div
        initial={{ y: 50 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <h3
          className='capitalize font-bold text-2xl sm:text-xl xs:text-lg'
        >
          {position}&nbsp;
          <a
            href={companyUrl}
            target='_blank'
            className='text-primary capitalize'
          >
            @{company}
          </a>
        </h3>
        <span className='capitalize font-medium text-dark/75 xs:text-sm'>
          {period} | {location}
        </span>
        <p className='font-medium w-full md:text-sm'>
          {description}
        </p>
      </motion.div>
    </li>
  )
}

const Experience = () => {

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"]
  })

  return (
    <div className='my-10'>
      <h2 className='font-bold text-8xl mb-20 w-full text-center lg:!text-7xl md:!text-5xl sm:!text-4xl'>
        Experience 🤺
      </h2>
      <div
        ref={ref}
        className='w-[75%] mx-auto relative lg:w-[90%] md:w-full'
      >

        <motion.div
          style={{
            scaleY: scrollYProgress
          }}
          className='absolute left-9 top-0 w-[4px] h-full bg-dark origin-top dark:bg-light md:w-[2px] md_left-[30px] xs:left-[20px]' />

        <ul
          className='w-full flex flex-col items-start justify-between ml-4 xs:ml-2'
        >
          {experience.map((exp) => (
            <Details
              key={exp.slug}
              position={exp.position}
              company={exp.company}
              companyUrl={exp.companyUrl}
              period={exp.period}
              location={exp.location}
              description={exp.description}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Experience;
