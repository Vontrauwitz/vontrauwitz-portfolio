import "server-only";
import { cards as staticTestimonials } from '@/data/testimonialConst';
import { connectToDatabase } from '@/lib/db/connection';
import { TestimonialModel } from './testimonial.model';
import { testimonialSchema, type Testimonial } from '../schemas/testimonial.schema';

// Data Access Layer for the Testimonials domain — same shape as every
// other domain repository. getTestimonials.ts (the queries/ layer) just
// calls getTestimonials() below.
//
// Read strategy: try Mongo first, always explicitly sorted by `order`
// ascending. On any failure, fall back to the existing static
// src/data/testimonialConst.ts array.
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    await connectToDatabase();
    const docs = await TestimonialModel.find({}).sort({ order: 1 }).lean();

    return docs.map((doc) => {
      const { _id, __v, order, ...rest } = doc;
      void _id;
      void __v;
      void order;
      return testimonialSchema.parse(rest);
    });
  } catch (error) {
    // error.name only, never error.message — some driver error paths can
    // include connection details in their message.
    console.warn(
      '[testimonialRepository] Mongo read or validation failed, falling back to static testimonial data. Reason:',
      error instanceof Error ? error.name : 'UnknownError'
    );
    return staticTestimonials.map((card) => testimonialSchema.parse(card));
  }
}
