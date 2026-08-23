// Extracted from src/components/Testimonials.js's inline ScrollableCard for
// Checkpoint 2.4. Pure presentational, no hooks — stays a Server Component
// per PLAN.md's audit ("card mapping is server-safe"). See TestimonialList.tsx
// for the client boundary (the motion.div wrapper) and the note on the
// server/client labels in PLAN.md Part III §2's target tree.

import Link from 'next/link';
import Image from 'next/image';

type TestimonialCardProps = {
  title: string;
  content: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  profileUrl: string;
};

const TestimonialCard = ({ title, content, image, imageWidth, imageHeight, profileUrl }: TestimonialCardProps) => {
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

export default TestimonialCard;
