import { z } from 'zod';

// Mirrors src/data/testimonialConst.ts's current shape exactly (3 records
// audited). No nullable fields — every field on every record is a
// required, non-empty value.
//
// `profileUrl` uses z.url() — verified all 3 values are real absolute
// https://www.linkedin.com/... URLs, no exceptions. `image` stays a plain
// non-empty string (root-relative public/ path), same treatment as every
// other domain's image field. `imageWidth`/`imageHeight` are positive
// integers (392x392, 800x800, 460x460 in the current data).
export const testimonialSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  image: z.string().min(1),
  imageWidth: z.number().int().positive(),
  imageHeight: z.number().int().positive(),
  profileUrl: z.url(),
});

export type Testimonial = z.infer<typeof testimonialSchema>;
