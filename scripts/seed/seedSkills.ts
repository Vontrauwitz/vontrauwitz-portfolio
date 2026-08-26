// One-off local script — never an HTTP endpoint, never run in production
// automatically. Seeds the Skills collection in whichever database
// MONGODB_URI (.env.local) currently points to, from the existing
// src/data/skillsConst.ts static array. Same shape as
// seedProjects.ts/seedCertificates.ts — see seedProjects.ts for why
// `--conditions=react-server --env-file=.env.local` is required.
//
// Run via: npm run seed:skills
//
// Idempotency: upserts each record keyed by `slug` (verified unique
// across all 48 current records) rather than inserting. `order` is
// (re-)written as the static array's current 0-based index on every run,
// so a reorder in skillsConst.ts followed by re-seeding correctly updates
// existing documents' order too, not just newly inserted ones. Never
// touches any other collection.
import mongoose from 'mongoose';
import { skills } from '@/data/skillsConst';
import { skillSchema } from '@/features/skills/schemas/skill.schema';
import { connectToDatabase } from '@/lib/db/connection';
import { SkillModel } from '@/features/skills/services/skill.model';

async function main() {
  console.log(`Validating ${skills.length} static skill records against skillSchema...`);
  const validated = skills.map((skill) => skillSchema.parse(skill));
  console.log('All records passed Zod validation.');

  await connectToDatabase();
  console.log('Connected to Mongo.');

  for (let index = 0; index < validated.length; index++) {
    const skill = validated[index];
    await SkillModel.findOneAndUpdate(
      { slug: skill.slug },
      { ...skill, order: index },
      { upsert: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ upserted (order ${index}): ${skill.slug}`);
  }

  const count = await SkillModel.countDocuments();
  console.log(`Seed complete. ${validated.length} records upserted. Collection now has ${count} document(s).`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((error) => {
  console.error('Seed FAILED:', error instanceof Error ? error.name : 'UnknownError');
  process.exit(1);
});
