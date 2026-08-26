import { z } from 'zod';

// Mirrors src/data/expConst.ts's current shape exactly. Only 4 records
// are live (a 5th, "agave-lab-front-end-developer", is fully commented
// out in the source and therefore not part of the runtime `experience`
// array — not seeded, not counted). No nullable fields — every field on
// every live record is a required, non-empty string.
//
// `companyUrl` uses z.url() — verified all 4 live values are real
// absolute https:// URLs, no exceptions. `period` stays a plain non-empty
// string, not a date type: values mix languages/casing inconsistently
// ("Ene", "aug", "Nov"), exactly the reason expConst.ts's own header
// comment gives for keeping it free text — parsing it would invent a
// stricter shape the data doesn't actually have.
export const experienceSchema = z.object({
  slug: z.string().min(1),
  position: z.string().min(1),
  company: z.string().min(1),
  companyUrl: z.url(),
  period: z.string().min(1),
  location: z.string().min(1),
  description: z.string().min(1),
});

export type Experience = z.infer<typeof experienceSchema>;
