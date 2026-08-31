import { z } from "zod";

// Checkpoint 5.1 — the .strict() schema every admin Project write (create
// and update) actually validates against, deliberately separate from
// ../schemas/project.schema.ts (the public *read*-path schema, which has
// `.default()`s for backward compatibility with pre-Checkpoint-5.1 data
// and the static seed array — see that file's own comment). Admin input
// gets no such leniency: every field must be explicitly and correctly
// supplied, and .strict() rejects any unrecognized key outright rather
// than silently dropping it — the same hardening decision already made
// for the Cloudinary signing endpoint's request schema in Checkpoint 4.5.
//
// Deliberately excludes: _id, createdAt, updatedAt. Mongo/Mongoose
// generates and owns all three; no code path in the admin API ever reads
// them from a request body (see the admin Project repository and routes).
export const projectInputSchema = z
  .object({
    slug: z
      .string()
      .min(1)
      .max(120)
      .regex(
        /^[a-z0-9]+(-[a-z0-9]+)*$/,
        "slug must be lowercase alphanumeric words separated by single hyphens"
      ),
    title: z.string().min(1).max(200),
    titleNote: z.string().min(1).max(200).nullable(),
    type: z.string().min(1).max(200),
    summary: z.string().min(1).max(5000),
    note: z.string().min(1).max(1000).nullable(),
    // `image`/`imageWidth`/`imageHeight`/`imagePublicId` together are the
    // normalized Cloudinary upload result (src/lib/cloudinary/uploadImage.ts)
    // once an admin replaces the image, or the untouched legacy
    // /public path + dimensions + null publicId for a project not yet
    // re-uploaded. Never trust a client-supplied `imagePublicId` as
    // authorization for anything — it's stored purely for a later,
    // not-yet-built asset-management feature to read back server-side.
    image: z.string().min(1),
    imageWidth: z.number().int().positive(),
    imageHeight: z.number().int().positive(),
    imagePublicId: z.string().min(1).nullable(),
    deployUrl: z.url().nullable(),
    githubUrl: z.url(),
    icon: z.string().min(1).max(50),
    technologies: z.array(z.string().min(1).max(50)).max(50),
    featured: z.boolean(),
    order: z.number().int().min(0).max(9999),
    published: z.boolean(),
  })
  .strict();

export type ProjectInput = z.infer<typeof projectInputSchema>;

// PATCH — every field optional, but still .strict(): an unrecognized key
// or a wrong-typed value for a field that IS present still fails.
//
// Hardening pass (post-Checkpoint-5.1 review): `.refine()` below rejects
// `{}` specifically — a client that sends an empty body almost certainly
// made a mistake (a bug in the caller, a stripped-out payload) and should
// get a clear 400, not a silent no-op success that looks like it worked.
// `.partial()` alone made every field optional, which technically made
// `{}` a valid *shape*; the refine adds the "at least one field" business
// rule on top without changing what counts as a valid field once one is
// present.
export const projectUpdateSchema = projectInputSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });

export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
