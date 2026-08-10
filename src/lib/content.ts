import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ModuleContract } from '@/content.config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const CHAPTERS_DIR = path.join(ROOT, 'content', 'chapters');
const LEVELS_FILE = path.join(ROOT, 'content', 'levels', 'levels.json');
const GLOSSARY_FILE = path.join(ROOT, 'content', 'glossary', 'glossary.json');
const INTROS_FILE = path.join(ROOT, 'content', 'intros', 'intros.json');

export type LevelId = 'l1' | 'l2' | 'l3' | 'l4' | 'l5' | 'l6' | 'l7' | 'l8';

export type LevelProfile = {
  id: LevelId;
  label: string;
  shortLabel: string;
  ageRange: string;
  grade: string;
  readingTarget: string;
  wordBudget: [number, number];
  notation: string;
  allowedSymbols: string[];
  voice: string;
};

export type ChapterMeta = {
  id: string;
  slug: string;
  number: number;
  title: string;
  subtitle?: string;
  question: string;
  anchorExample?: string;
  // Per-level names. A chapter called "The Peano axioms" is unreadable to a
  // five-year-old, and the chapter heading is the first thing on the page, so
  // each level gets its own. `title` stays as the canonical name and is the
  // fallback for any level not listed.
  titles?: Partial<Record<LevelId, string>>;
  subtitles?: Partial<Record<LevelId, string>>;
};

export function chapterTitle(ch: ChapterMeta, level: LevelId): string {
  return ch.titles?.[level] ?? ch.title;
}

export function chapterSubtitle(ch: ChapterMeta, level: LevelId): string {
  return ch.subtitles?.[level] ?? ch.subtitle ?? '';
}

const levelsRaw = JSON.parse(fs.readFileSync(LEVELS_FILE, 'utf-8')) as {
  levels: LevelProfile[];
};
export const LEVELS: LevelProfile[] = levelsRaw.levels;

export function getLevel(id: LevelId): LevelProfile {
  const l = LEVELS.find((x) => x.id === id);
  if (!l) throw new Error(`Unknown level ${id}`);
  return l;
}

function readJson<T>(p: string): T {
  return JSON.parse(fs.readFileSync(p, 'utf-8')) as T;
}

function safeReadJson<T>(p: string): T | null {
  try {
    return readJson<T>(p);
  } catch {
    return null;
  }
}

export function getAllChapters(): ChapterMeta[] {
  const dirs = fs
    .readdirSync(CHAPTERS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
  return dirs.map((dir) => {
    const meta = readJson<ChapterMeta & { id: string }>(
      path.join(CHAPTERS_DIR, dir, '_chapter.json'),
    );
    return { ...meta, slug: dir };
  });
}

export function getChapter(slug: string): ChapterMeta {
  const meta = readJson<ChapterMeta>(
    path.join(CHAPTERS_DIR, slug, '_chapter.json'),
  );
  return { ...meta, slug };
}

export function getModulesForChapter(chapterSlug: string): ModuleContract[] {
  const chapterDir = path.join(CHAPTERS_DIR, chapterSlug);
  const modDirs = fs
    .readdirSync(chapterDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
  const mods = modDirs
    .map((dir) => {
      const p = path.join(chapterDir, dir, '_module.json');
      const m = safeReadJson<ModuleContract>(p);
      if (!m) return null;
      // Always use the on-disk directory as the slug so URLs match MDX ids
      // from the content-collection glob loader.
      return { ...m, slug: dir };
    })
    .filter((m): m is ModuleContract => m !== null);
  mods.sort((a, b) => a.order - b.order);
  return mods;
}

export function getAllModules(): {
  chapter: ChapterMeta;
  module: ModuleContract;
}[] {
  const out: { chapter: ChapterMeta; module: ModuleContract }[] = [];
  for (const chapter of getAllChapters()) {
    for (const m of getModulesForChapter(chapter.slug)) {
      out.push({ chapter, module: m });
    }
  }
  return out;
}

export function getModule(chapterSlug: string, moduleSlug: string): ModuleContract | null {
  const p = path.join(CHAPTERS_DIR, chapterSlug, moduleSlug, '_module.json');
  const m = safeReadJson<ModuleContract>(p);
  if (!m) return null;
  return { ...m, slug: moduleSlug };
}

export function hasModuleMDX(
  chapterSlug: string,
  moduleSlug: string,
  level: LevelId,
): boolean {
  const p = path.join(CHAPTERS_DIR, chapterSlug, moduleSlug, `${level}.mdx`);
  return fs.existsSync(p);
}

// Glossary
export type GlossaryEntry = {
  term: string;
  slug: string;
  definitions: Partial<Record<LevelId, string>>;
};
export type Glossary = { entries: GlossaryEntry[] };

export function getGlossary(): Glossary {
  return readJson<Glossary>(GLOSSARY_FILE);
}

export function findGlossaryEntry(term: string): GlossaryEntry | undefined {
  const g = getGlossary();
  const needle = term.toLowerCase();
  return g.entries.find(
    (e) => e.term.toLowerCase() === needle || e.slug === needle,
  );
}

// Per-level intros (course intro shown at the top of each level's home page)
export type Intro = {
  level: LevelId;
  title: string;
  paragraphs: string[];
};

export function getIntro(level: LevelId): Intro {
  const data = readJson<{ intros: Intro[] }>(INTROS_FILE);
  const i = data.intros.find((x) => x.level === level);
  if (!i) throw new Error(`No intro for level ${level}`);
  return i;
}

// URL helpers
export function levelHome(level: LevelId): string {
  return `/${level}/`;
}
export function chapterPath(level: LevelId, chapter: string): string {
  return `/${level}/${chapter}/`;
}
export function modulePath(level: LevelId, chapter: string, mod: string): string {
  return `/${level}/${chapter}/${mod}/`;
}
