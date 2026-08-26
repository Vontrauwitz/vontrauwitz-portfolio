import { z } from 'zod';

// Mirrors src/data/skillsConst.ts's current shape exactly (48 records
// audited). `icon`/`iconClassName` are nullable — 4 of the 48 records
// (python, django, ruby, ror) have both null, always paired together;
// verified no other record has either one null in isolation. `link` is
// nullable too — every one of the 48 current records has it as null, no
// exceptions, but it's modeled as a real field (not omitted) since the
// data file's own header comment states it's "kept for shape-
// compatibility with a future admin ('learn more' URL per skill)".
//
// `link` stays a plain nullable string, not z.url() — unlike Projects'
// deployUrl/Certificates' credentialUrl, there are zero non-null current
// values to verify actually are real URLs, so enforcing z.url() here
// would be an untested assumption about a hypothetical future value's
// format rather than a fact derived from real data.
//
// `category` is a strict enum — same reasoning as Certificates' category
// (Checkpoint 3.4): a small, closed set SkillsTabs.tsx's own
// CATEGORY_BY_BUTTON mapping is structurally built around (exactly 3
// tabs), and every one of the 48 current records uses one of exactly
// these 3 values with 100% coverage.
//
// No `order` field here — ordering matters visually (SkillsTabs.tsx
// filters this array by category and renders in array order), but it's
// modeled as Mongoose-only persistence metadata (see
// services/skill.model.ts), not a real content field, the same treatment
// Projects gave `timestamps`.
export const skillSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(['frontend', 'backend', 'tools']),
  description: z.string().min(1),
  icon: z.string().min(1).nullable(),
  iconClassName: z.string().min(1).nullable(),
  link: z.string().min(1).nullable(),
});

export type Skill = z.infer<typeof skillSchema>;
