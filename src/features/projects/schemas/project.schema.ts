import { z } from 'zod';

// Mirrors src/data/projectConst.ts's current shape exactly — see that
// file's own field-by-field comments for the semantics behind each
// nullable field (titleNote/note/deployUrl are all "present but null",
// never an absent key, so they're modeled as .nullable(), not .optional()).
// No fields added, removed, or renamed; no data normalization. This is
// Checkpoint 3.2's schema/model-architecture step only — nothing here is
// wired into any repository, query, or route yet.
//
// deployUrl/githubUrl use z.url() (Zod v4 top-level format validator) since
// every current value is a real absolute URL. `image` stays a plain
// non-empty string, not z.url() — it's a root-relative public/ path
// ("/images/projects/proy/x.jpg"), not an absolute URL, per that file's
// own comment.
//
// `technologies` is a required array (no `.default([])`): every current
// record already has the key present (as `[]`), so the Zod input contract
// requires it explicitly — an object missing the key fails validation
// rather than silently passing with an assumed empty array.
export const projectSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  titleNote: z.string().min(1).nullable(),
  type: z.string().min(1),
  summary: z.string().min(1),
  note: z.string().min(1).nullable(),
  image: z.string().min(1),
  imageWidth: z.number().int().positive(),
  imageHeight: z.number().int().positive(),
  deployUrl: z.url().nullable(),
  githubUrl: z.url(),
  icon: z.string().min(1),
  technologies: z.array(z.string()),
  featured: z.boolean(),
});

export type Project = z.infer<typeof projectSchema>;
