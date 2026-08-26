import "server-only";
import { experience as staticExperience } from '@/data/expConst';
import { connectToDatabase } from '@/lib/db/connection';
import { ExperienceModel } from './experience.model';
import { experienceSchema, type Experience } from '../schemas/experience.schema';

// Data Access Layer for the Experience domain — same shape as
// projectRepository.ts/certificateRepository.ts/skillRepository.ts.
//
// Read strategy: try Mongo first, always explicitly sorted by `order`
// ascending (never relying on Mongo's natural document order). On any
// failure, fall back to the existing static src/data/expConst.ts array —
// already in the correct visual order since it's the literal source
// `order` was derived from.
export async function getExperience(): Promise<Experience[]> {
  try {
    await connectToDatabase();
    const docs = await ExperienceModel.find({}).sort({ order: 1 }).lean();

    return docs.map((doc) => {
      const { _id, __v, order, ...rest } = doc;
      void _id;
      void __v;
      void order;
      return experienceSchema.parse(rest);
    });
  } catch (error) {
    // error.name only, never error.message — some driver error paths can
    // include connection details in their message.
    console.warn(
      '[experienceRepository] Mongo read or validation failed, falling back to static experience data. Reason:',
      error instanceof Error ? error.name : 'UnknownError'
    );
    return staticExperience.map((exp) => experienceSchema.parse(exp));
  }
}
