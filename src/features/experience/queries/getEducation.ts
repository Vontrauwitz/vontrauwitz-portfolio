import { getEducation as getEducationFromRepository } from '@/features/experience/services/educationRepository';
import type { Education } from '../schemas/education.schema';

// Stage B (Checkpoint 3.6): same treatment as getExperience.ts — now
// re-exports the Zod-inferred `Education` type instead of the Stage A
// hand-written one; EducationTimeline.tsx's import path is unchanged.
export type { Education };

// Delegates to educationRepository (Mongo-backed, with a static-data
// fallback and explicit `order`-based sort). Signature and return shape
// unchanged from Stage A.
export async function getEducation(): Promise<Education[]> {
  return getEducationFromRepository();
}
