import "server-only";
import { skills as staticSkills } from '@/data/skillsConst';
import { connectToDatabase } from '@/lib/db/connection';
import { SkillModel } from './skill.model';
import { skillSchema, type Skill } from '../schemas/skill.schema';

// Data Access Layer for the Skills domain — same shape as
// projectRepository.ts/certificateRepository.ts. getSkills.ts (the
// queries/ layer) just calls getSkills() below.
//
// Read strategy: try Mongo first, always explicitly sorted by `order`
// ascending (never relying on Mongo's natural document order — see
// skill.model.ts for why that field exists). On any failure (connection,
// query, or shape validation), fall back to the existing static
// src/data/skillsConst.ts array — which is already in the correct visual
// order since it's the literal source `order` was derived from.
export async function getSkills(): Promise<Skill[]> {
  try {
    await connectToDatabase();
    const docs = await SkillModel.find({}).sort({ order: 1 }).lean();

    // .lean() returns plain objects, not Mongoose Documents, but they
    // still carry Mongo-only/persistence-only fields (_id, __v, order).
    // Stripping those and re-validating every record through the same Zod
    // schema the seed script uses guarantees the returned array is
    // byte-for-byte Skill-shaped.
    return docs.map((doc) => {
      const { _id, __v, order, ...rest } = doc;
      void _id;
      void __v;
      void order;
      return skillSchema.parse(rest);
    });
  } catch (error) {
    // error.name only, never error.message — some driver error paths can
    // include connection details in their message.
    console.warn(
      '[skillRepository] Mongo read or validation failed, falling back to static skill data. Reason:',
      error instanceof Error ? error.name : 'UnknownError'
    );
    // skillsConst.ts has no `as const`, so its inferred `category` type is
    // the widened `string`, not the stricter enum literal union
    // skillSchema requires — re-validating through the same schema (same
    // treatment as Certificates' fallback) narrows it correctly.
    return staticSkills.map((skill) => skillSchema.parse(skill));
  }
}
