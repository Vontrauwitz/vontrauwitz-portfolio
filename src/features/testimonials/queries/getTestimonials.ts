import { getTestimonials as getTestimonialsFromRepository } from '@/features/testimonials/services/testimonialRepository';
import type { Testimonial } from '../schemas/testimonial.schema';

// Stage B (Checkpoint 3.7): now re-exports the Zod-inferred `Testimonial`
// type from schemas/testimonial.schema.ts instead of the Stage A
// hand-written one — TestimonialList.tsx's `import type { Testimonial }
// from '@/features/testimonials/queries/getTestimonials'` doesn't change;
// only what this file exports it from does.
export type { Testimonial };

// Delegates to testimonialRepository (Mongo-backed, with a static-data
// fallback and explicit `order`-based sort). Signature and return shape
// unchanged from Stage A, so about/page.tsx needed zero further changes.
//
// Still no "use cache"/cacheTag/cacheLife/cacheComponents — no write path
// exists yet.
export async function getTestimonials(): Promise<Testimonial[]> {
  return getTestimonialsFromRepository();
}
