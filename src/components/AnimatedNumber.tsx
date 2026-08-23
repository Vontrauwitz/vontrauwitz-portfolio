"use client";

// Extracted from src/pages/about.js for Checkpoint 2.4. Was already unused
// dead code in the original (defined, never rendered in the JSX) — carried
// over unchanged, not deleted, since removing it wasn't asked for. It has
// to live in its own "use client" file: importing `useEffect`/`useRef` into
// a Server Component module fails the Next.js build outright, even for a
// function that's never actually called.

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'motion/react';

const AnimatedNumber = ({ value }: { value: number }) => {
  const ref = useRef<HTMLSpanElement>(null);

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 3000 });
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    };
  }, [isInView, value, motionValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      // console.log(latest);
      if (ref.current && Number(latest.toFixed(0)) <= value) {
        ref.current.textContent = latest.toFixed(0)
      }
    });
  }, [springValue, value]);

  return <span ref={ref}></span>
}

export default AnimatedNumber;
