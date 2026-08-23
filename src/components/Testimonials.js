import Link from 'next/link';
import React from 'react';
import Layout from './Layout';
import Image from 'next/image';
import { cards } from '@/data/testimonialConst';
import AnimatedText from './AnimatedText';
import { motion } from 'motion/react';


const ScrollableCard = ({ title, content, image, imageWidth, imageHeight, profileUrl }) => {
  return (
    <div className="bg-dark rounded-lg shadow-md p-4 m-2 w-64 h-auto  dark:bg-light text-light font-semibold">
      <div className="flex flex-col items-center mb-5">
        <div className="flex items-center mb-2">
          <Image
            alt="testimonial photo"
            src={image}
            width={imageWidth}
            height={imageHeight}
            className="
    w-[30%]
    rounded-full
    object-cover
    mr-4
    drop-shadow-[2px_3px_2px_rgba(255,255,255,.4)]
    dark:drop-shadow-[2px_3px_2px_rgba(0,0,0,.4)]
  "
          />
          <h2 className=" w-[70%] text-lg font-semibold dark:text-dark ">
            <Link
              href={profileUrl}
              target={"_blank"}
              className='text-primary hover:underline '
            >
              {title}
            </Link>
          </h2>
        </div>

      </div>
      <div className='h-[70%] flex items-center content-center'>
        <div className="dark:text-gray-600 text-light text-md">{content}</div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  return (
    <Layout>
      <AnimatedText className="mb-16 lg:!text-7xl md:!text-5xl sm:!text-4xl" text="What people say! 🙊" />
      <motion.div
        initial={{ y: 100 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.9, type: "spring" }}
        className="flex flex-wrap justify-center">
        {cards.map((card) => (
          <ScrollableCard
            key={card.slug}
            title={card.title}
            content={card.content}
            image={card.image}
            imageWidth={card.imageWidth}
            imageHeight={card.imageHeight}
            profileUrl={card.profileUrl}
          />
        ))}
      </motion.div>
    </Layout>
  );
};

export default Testimonials;
