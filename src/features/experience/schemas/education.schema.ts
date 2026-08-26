import { z } from 'zod';

// Mirrors src/data/eduConst.ts's current shape exactly (5 records
// audited). No nullable fields — every field on every record is a
// required, non-empty string. No `location` field — unlike Experience,
// Education never had one; not invented here.
//
// `institutionUrl` uses z.url() — verified all 5 values are real absolute
// https:// URLs, no exceptions. `period` stays a plain non-empty string,
// same reasoning as Experience's `period` (eduConst.ts's own header
// comment cites the same free-text-date rationale).
export const educationSchema = z.object({
  slug: z.string().min(1),
  program: z.string().min(1),
  institution: z.string().min(1),
  institutionUrl: z.url(),
  period: z.string().min(1),
  description: z.string().min(1),
});

export type Education = z.infer<typeof educationSchema>;
