import "server-only";
import { education as staticEducation } from '@/data/eduConst';
import { connectToDatabase } from '@/lib/db/connection';
import { EducationModel } from './education.model';
import { educationSchema, type Education } from '../schemas/education.schema';

// Data Access Layer for the Education domain — same shape as
// experienceRepository.ts (this checkpoint), a separate model/collection
// per the explicit instruction that Experience and Education stay
// distinct even though they share this feature folder.
export async function getEducation(): Promise<Education[]> {
  try {
    await connectToDatabase();
    const docs = await EducationModel.find({}).sort({ order: 1 }).lean();

    return docs.map((doc) => {
      const { _id, __v, order, ...rest } = doc;
      void _id;
      void __v;
      void order;
      return educationSchema.parse(rest);
    });
  } catch (error) {
    console.warn(
      '[educationRepository] Mongo read or validation failed, falling back to static education data. Reason:',
      error instanceof Error ? error.name : 'UnknownError'
    );
    return staticEducation.map((edu) => educationSchema.parse(edu));
  }
}
