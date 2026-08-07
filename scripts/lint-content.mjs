#!/usr/bin/env node
// Content lint. See math0-spiral-plan.md §D4.
// Checks the grade-calibration gates of §A4.1/§A4.2, which are the ones
// authorial intuition gets wrong.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const CHAPTERS = path.join(ROOT, 'content/chapters');
const LEVELS = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'content/levels/levels.json'), 'utf8'),
).levels;

const budget = Object.fromEntries(LEVELS.map((l) => [l.id, l.wordBudget]));

let errors = 0;
let warnings = 0;
const err = (f, m) => { console.error(`  ERROR  ${f}\n         ${m}`); errors++; };
const warn = (f, m) => { console.warn(`  warn   ${f}\n         ${m}`); warnings++; };

// Strip frontmatter, imports, JSX tags, and code spans so we lint prose + math.
function body(src) {
  return src
    .replace(/^---[\s\S]*?---\n/, '')
    .replace(/^import .*$/gm, '')
    .replace(/<\/?[A-Za-z][^>]*>/g, '')
    .replace(/`[^`]*`/g, '');
}

// Math segments only — where notation violations actually live.
function mathOnly(text) {
  const out = [];
  for (const m of text.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$\n]+)\$/g)) {
    out.push(m[1] ?? m[2]);
  }
  return out.join('\n');
}

// Set names used as labels are fine at l3; single letters used as NUMBERS are not.
// `i`, `e` and `pi` are named constants, not variables, so they are excluded.
const VAR = '(?!i\\b)(?!e\\b)[a-hj-z]';
const NUMERIC_VAR_PATTERNS = [
  new RegExp(`\\bLet\\s+\\$?${VAR}\\$?\\s+be\\s+(a|an|any)\\s+(whole\\s+)?(number|integer)`, 'i'),
  new RegExp(`\\bfor\\s+(any|every|all)\\s+\\$?${VAR}\\$?\\b(?!\\s*(in|∈)\\s*[A-Z])`, 'i'),
  new RegExp(`(^|[$\\s({])${VAR}\\s*[+\\-]\\s*${VAR}\\b`, 'm'),
  new RegExp(`(^|[$\\s({])${VAR}\\s*(×|·|\\\\times|\\\\cdot)\\s*${VAR}\\b`, 'm'),
  new RegExp(`(^|[$\\s({])${VAR}\\^2`, 'm'),
  new RegExp(`${VAR}\\s*\\+\\s*${VAR}i\\b`), // a + bi
  /\bA\([a-z]\)/,                            // statement schema A(n)
];

const GATES = {
  l2: [
    [/×|\\times|\\cdot|·/, 'uses × — grade 2 has no multiplication (2.OA.C.4 is repeated addition)'],
    [/÷|\\div/, 'uses ÷ — grade 2 has no division'],
    [/\\frac|\\tfrac|\\dfrac/, 'uses a fraction — grade 2 has no fractions as numbers (3.NF)'],
    [/\$\s*-\s*\d/, 'uses a negative number — negatives are grade 6 (6.NS.C.5)'],
    [/\\mathbb/, 'uses a number-system symbol — far beyond grade 2'],
  ],
  l3: [
    [/\\mathbb\{[NZQRC]\}/, 'uses ℕ/ℤ/ℚ/ℝ/ℂ — beyond grade 5'],
    [/\$\s*-\s*\d/, 'uses a negative number — negatives are grade 6 (6.NS.C.5)'],
    [/∀|\\forall|∃|\\exists/, 'uses a quantifier symbol — l5+'],
    [/\\Rightarrow|⇒|\\neg|¬|\\wedge|∧|\\vee|∨/, 'uses a logic connective symbol — l4+'],
    // The divides bar, not the set-builder "such that" bar, which is l3 notation.
    // Divisibility is written between two number-like terms: 3 \mid 12.
    [/\\nmid|\d\s*\\mid\s*\d/, 'uses the divides bar — l5+'],
  ],
  // Per §A4.2, l4 may use ∀ ∃ ∃! in the modules that introduce them (1.10–1.12)
  // and ∘ in 3.7–3.9; those exceptions are applied below, not here.
  l4: [
    [/\\sum|Σ/, 'uses Σ — l7+'],
    [/\\prod|∏/, 'uses ∏ — l7+'],
  ],
  l6: [
    [/\\sum|Σ/, 'uses Σ — l7+'],
    [/\\prod|∏/, 'uses ∏ — l7+'],
  ],
};

const L7_FORWARD = /\b(topolog|abstract algebra|measure theor|Banach|Hilbert space|category theor|homolog|manifold|sheaf|scheme)/i;

const files = [];
for (const ch of fs.readdirSync(CHAPTERS)) {
  const chDir = path.join(CHAPTERS, ch);
  if (!fs.statSync(chDir).isDirectory()) continue;
  for (const mod of fs.readdirSync(chDir)) {
    const modDir = path.join(chDir, mod);
    if (!fs.statSync(modDir).isDirectory()) continue;
    for (const f of fs.readdirSync(modDir)) {
      if (/^l[1-8]\.mdx$/.test(f)) files.push(path.join(modDir, f));
    }
  }
}

console.log(`Linting ${files.length} module files against §A4.1 grade calibration.\n`);

for (const file of files) {
  const rel = path.relative(ROOT, file);
  const src = fs.readFileSync(file, 'utf8');
  const level = path.basename(file, '.mdx');
  const text = body(src);
  const math = mathOnly(text);

  // frontmatter level must match filename
  const fm = src.match(/^---\n([\s\S]*?)\n---/);
  if (fm && !new RegExp(`^level:\\s*${level}\\s*$`, 'm').test(fm[1])) {
    err(rel, `frontmatter level does not match filename ${level}`);
  }

  // notation gates
  for (const [re, msg] of GATES[level] ?? []) {
    if (re.test(math) || (level === 'l2' && re.test(text))) err(rel, msg);
  }

  // l3: letters standing for numbers
  if (level === 'l3') {
    for (const re of NUMERIC_VAR_PATTERNS) {
      if (re.test(text)) {
        err(rel, 'uses a letter as a number — variables are grade 6 (6.EE.A.2); say "take any one and follow it"');
        break;
      }
    }
  }

  if (level === 'l4') {
    // f(x) is high-school notation (HSF-IF.A.2). Chapter 3 may introduce it
    // with a gloss; elsewhere it should not appear. Predicate notation p(x)
    // in the quantifier modules is permitted per §A4.2.
    const usesFx = /\bf\s*\(\s*[a-z]\s*\)/.test(math);
    if (usesFx && !/03-functions/.test(rel)) {
      err(rel, 'uses f(x) outside Chapter 3 — function notation is high school (HSF-IF.A.2)');
    } else if (usesFx && !/new notation|notation.*introduc|introduc.*notation|we write/i.test(text)) {
      warn(rel, 'uses f(x) without glossing it as new notation');
    }
    // ∀ ∃ allowed only where introduced (1.10–1.12) or afterwards in Ch. 1
    if (/∀|\\forall|∃|\\exists/.test(math) && !/01-logic\/(1[0-2])-/.test(rel)) {
      warn(rel, 'uses ∀/∃ outside modules 1.10–1.12 — check it is glossed at this level');
    }
    // ∘ allowed only in 3.7–3.9
    if (/\\circ(?!nst)/.test(math) && !/03-functions\/0[789]-/.test(rel)) {
      err(rel, 'uses ∘ outside modules 3.7–3.9 — composition notation is introduced there');
    }
  }

  // l7: forward references belong at l8
  if (level === 'l7') {
    const m = text.match(/<WhereThisGoes[\s\S]*/);
    if (m && L7_FORWARD.test(m[0])) {
      warn(rel, 'WhereThisGoes points past precalculus — those forward refs belong at l8');
    }
  }

  // TryIt required at l1/l2
  if ((level === 'l1' || level === 'l2') && !/<TryIt/.test(src)) {
    err(rel, 'missing <TryIt> (required at l1/l2)');
  }

  // WhereThisGoes only at l7/l8
  if (/<WhereThisGoes/.test(src) && !['l7', 'l8'].includes(level)) {
    err(rel, '<WhereThisGoes> outside l7/l8');
  }

  // Figure alt text
  for (const f of src.matchAll(/<Figure(\s[^>]*)?>/g)) {
    if (!/\balt=/.test(f[1] ?? '')) err(rel, '<Figure> without alt text');
  }

  // word budget
  const words = text.split(/\s+/).filter(Boolean).length;
  const [lo, hi] = budget[level] ?? [0, Infinity];
  if (words < lo * 0.8) warn(rel, `${words} words — more than 20% under the ${lo}–${hi} budget`);
  if (words > hi * 1.2) warn(rel, `${words} words — more than 20% over the ${lo}–${hi} budget`);
}

// per-module completeness + kernels
for (const ch of fs.readdirSync(CHAPTERS)) {
  const chDir = path.join(CHAPTERS, ch);
  if (!fs.statSync(chDir).isDirectory()) continue;
  for (const mod of fs.readdirSync(chDir)) {
    const p = path.join(chDir, mod, '_module.json');
    if (!fs.existsSync(p)) continue;
    const j = JSON.parse(fs.readFileSync(p, 'utf8'));
    const rel = path.relative(ROOT, p);
    if (!j.kernelIdea) err(rel, 'missing kernelIdea');
    for (const l of ['l1','l2','l3','l4','l5','l6','l7','l8']) {
      if (!j.kernels?.[l]) err(rel, `missing kernels.${l}`);
    }
    if (j.kernels?.l1 && j.kernels.l1.split(/\s+/).length > 24) {
      warn(rel, 'l1 kernel is longer than one breath (>24 words)');
    }
  }
}

console.log(`\n${errors} error(s), ${warnings} warning(s).`);
process.exit(errors > 0 ? 1 : 0);
