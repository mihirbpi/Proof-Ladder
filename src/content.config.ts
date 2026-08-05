import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const LEVEL_IDS = ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8'] as const;
const levelEnum = z.enum(LEVEL_IDS);

const treatmentEnum = z.enum(['core', 'touch']);

const namedMoves = [
  'the opposite',
  'flip it around',
  'suppose not',
  'check both boxes',
  'one bad apple',
  'dominoes',
  'split into cases',
  'start from what you\'re given',
  'take any one and follow it',
] as const;

const moduleContract = z.object({
  id: z.string(),
  slug: z.string(),
  chapter: z.string(),
  order: z.number(),
  titles: z.record(levelEnum, z.string()),
  // kernelIdea is the author-side fixed sentence — used by lint and
  // reviewers to check that every level's kernel points at the same idea.
  // It is NOT displayed to readers.
  kernelIdea: z.string().optional(),
  // kernels is the per-level object; each entry is the sentence rendered
  // on the invariant band for that level. Every level should eventually
  // have one; missing entries fall back to `kernel` (legacy singular).
  kernels: z.record(levelEnum, z.string().optional()).optional(),
  // Legacy singular kernel. Kept for backwards compatibility while modules
  // are migrated to per-level kernels; used as the fallback for any level
  // missing from `kernels`.
  kernel: z.string(),
  objectives: z.array(z.string()),
  sourceRef: z.string(),
  vocabulary: z.array(z.string()).default([]),
  prerequisites: z.array(z.string()).default([]),
  treatment: z.record(levelEnum, treatmentEnum),
  namedMove: z.enum(namedMoves).nullable().default(null),
  anchorExample: z.string().optional(),
});

export type ModuleContract = z.infer<typeof moduleContract>;

// MDX files: content/chapters/<chapter>/<module>/lN.mdx
const modules = defineCollection({
  loader: glob({ pattern: '**/l[1-8].mdx', base: './content/chapters' }),
  schema: z.object({
    level: levelEnum,
    title: z.string(),
    readingTimeMin: z.number().optional(),
    newTerms: z.array(z.string()).default([]),
    anchorExample: z.string().optional(),
    readAloud: z.boolean().default(false),
  }),
});

export const collections = { modules };
export { LEVEL_IDS, levelEnum, moduleContract };
