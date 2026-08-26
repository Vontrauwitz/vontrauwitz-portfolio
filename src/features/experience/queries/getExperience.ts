import { getExperience as getExperienceFromRepository } from '@/features/experience/services/experienceRepository';
import type { Experience } from '../schemas/experience.schema';

// Stage B (Checkpoint 3.6): now re-exports the Zod-inferred `Experience`
// type from schemas/experience.schema.ts instead of the Stage A
// hand-written one — ExperienceTimeline.tsx's `import type { Experience }
// from '@/features/experience/queries/getExperience'` doesn't change;
// only what this file exports it from does.
export type { Experience };

// Delegates to experienceRepository (Mongo-backed, with a static-data
// fallback and explicit `order`-based sort — see that file) instead of
// directly importing src/data/expConst. Signature and return shape
// unchanged from Stage A, so about/page.tsx needed zero further changes.
//
// Still no "use cache"/cacheTag/cacheLife/cacheComponents — no write path
// exists yet.
export async function getExperience(): Promise<Experience[]> {
  return getExperienceFromRepository();
}
