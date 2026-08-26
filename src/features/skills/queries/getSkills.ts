import { getSkills as getSkillsFromRepository } from '@/features/skills/services/skillRepository';
import type { Skill } from '../schemas/skill.schema';

// Stage B (Checkpoint 3.5): now re-exports the Zod-inferred `Skill` type
// from schemas/skill.schema.ts instead of the Stage A hand-written one —
// SkillsTabs.tsx's `import type { Skill } from
// '@/features/skills/queries/getSkills'` doesn't change; only what this
// file exports it from does.
export type { Skill };

// Delegates to skillRepository (Mongo-backed, with a static-data fallback
// — see that file for the read/fallback/ordering strategy) instead of
// directly importing src/data/skillsConst, same treatment as
// getPublishedProjects.ts/getCertificates.ts. Signature and return shape
// unchanged from Stage A, so about/page.tsx needed zero further changes.
//
// Still no "use cache"/cacheTag/cacheLife/cacheComponents — same
// rationale as the other two domains: no write path exists yet.
export async function getSkills(): Promise<Skill[]> {
  return getSkillsFromRepository();
}
