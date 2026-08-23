"use client";

// Moved/split from src/components/Testimonials.js for Checkpoint 2.4.
// PLAN.md Part III §2's target tree labels this pair
// "{TestimonialList.tsx (server), TestimonialCard.tsx (client)}", but the
// audit's own reasoning ("only the motion.div wrapper needs client; card
// mapping is server-safe") points the other way — this file owns the
// `motion.div` (and so must be the client boundary), while TestimonialCard
// is the server-safe presentational leaf. Following the reasoning, not the
// transposed labels, to keep the single group whileInView animation exactly
// as it behaves today (one reveal for the whole list, not per card).

import Layout from '@/components/Layout';
import { cards } from '@/data/testimonialConst';
import AnimatedText from '@/components/AnimatedText';
import { motion } from 'motion/react';
import TestimonialCard from './TestimonialCard';

const TestimonialList = () => {
  return (
    <Layout>
      <AnimatedText className="mb-16 lg:!text-7xl md:!text-5xl sm:!text-4xl" text="What people say! 🙊" />
      <motion.div
        initial={{ y: 100 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.9, type: "spring" }}
        className="flex flex-wrap justify-center">
        {cards.map((card) => (
          <TestimonialCard
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

export default TestimonialList;
