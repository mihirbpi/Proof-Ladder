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
