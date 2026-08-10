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
// The distinction that matters: a letter used as an *element label* is fine at
// l3 (`a ∈ S`, `{a,b}`, `f(a)` — §A4.2 permits set names as labels); a letter
// doing *arithmetic*, or compared against a *numeral*, is a variable and is not
// (6.EE.A.2). So the signal is the letter's company, not the letter itself.
const VAR = '(?!i\\b)(?!e\\b)[a-hj-z]';
const NUM = '\\d';
const REL = '(?:=|<|>|\\\\leq|\\\\geq|≤|≥|\\\\neq|≠)';
const OP = '(?:[+\\-/]|×|÷|·|\\\\times|\\\\cdot|\\\\div)';
const OPEN = '(^|[$\\\\s({=,])';

const NUMERIC_VAR_PATTERNS = [
  // prose
  [new RegExp(`\\bLet\\s+\\$?${VAR}\\$?\\s+be\\s+(a|an|any)\\s+(whole\\s+|real\\s+|counting\\s+)?(number|integer|value)`, 'i'), '"let <letter> be a number"'],
  [new RegExp(`\\bfor\\s+(any|every|all|each)\\s+\\$?${VAR}\\$?\\b(?!\\s*(in|∈)\\s*[A-Z])`, 'i'), '"for any <letter>"'],
  [new RegExp(`\\bsends?\\s+\\$?${VAR}\\$?\\s+to\\b`, 'i'), '"send <letter> to"'],
  [new RegExp(`\\b(number|value)\\s+\\$?${VAR}\\$?(?=[\\s.,$])`, 'i'), '"the number <letter>"'],
  // arithmetic: letter with a letter, or letter with a numeral, either order
  [new RegExp(`${OPEN}${VAR}\\s*${OP}\\s*${VAR}\\b`, 'm'), 'arithmetic between two letters'],
  [new RegExp(`${OPEN}${VAR}\\s*${OP}\\s*${NUM}`, 'm'), 'arithmetic on a letter and a numeral'],
  [new RegExp(`${OPEN}${NUM}\\s*${OP}\\s*${VAR}\\b`, 'm'), 'arithmetic on a numeral and a letter'],
  [new RegExp(`${OPEN}${NUM}${VAR}\\b`, 'm'), 'implicit coefficient (e.g. 2x)'],
  // comparison against a numeral
  [new RegExp(`${OPEN}${VAR}\\s*${REL}\\s*${NUM}`, 'm'), 'a letter compared with a numeral'],
  [new RegExp(`${OPEN}${NUM}\\s*${REL}\\s*${VAR}\\b`, 'm'), 'a numeral compared with a letter'],
  // powers, radicals, fractions — digit exponent only, so f^{-1} is not caught here
  [new RegExp(`${OPEN}${VAR}\\s*\\^\\s*\\{?\\s*${NUM}`, 'm'), 'a letter raised to a power'],
  [new RegExp(`\\\\sqrt\\s*\\{?\\s*${VAR}\\b`, 'm'), 'a letter under a radical'],
  [new RegExp(`\\\\[dt]?frac\\s*\\{\\s*${VAR}\\s*\\}`, 'm'), 'a letter in a fraction'],
  [new RegExp(`${VAR}\\s*\\+\\s*${VAR}i\\b`), 'a + bi'],
  [/\bA\([a-z]\)/, 'statement schema A(n)'],
];

// The l3 variable detector is the one check where a tighter net risks catching
// legitimate element labels. These cases pin both edges of it; run with
// --self-test after touching NUMERIC_VAR_PATTERNS.
const VAR_MUST_PASS = [
  '$a \\in S$', '$\\{a, b, c\\}$', '$f(a) = 1$', '$(a,b)$', '$s \\in S$',
  'the set $A$', '$\\{1, 2, 3, \\ldots, 26\\}$', '$A \\subseteq B$',
  '$f^{-1}(\\{2\\}) = \\{a, b\\}$', '$\\text{Im}(f)$', 'trace back from $3$',
  '$\\{\\,\\}$', 'the machine $f$', '$T$ and $S$',
];
const VAR_MUST_CATCH = [
  '$x \\geq 1$', '$3 \\times k$', '$x = 6$', 'the number $n$', '$m \\times 0$',
  'send $x$ to', '$y = 2$', '$1/z$', '$k+1$', '$a \\cdot 1$', '$2x$', '$x^2$',
  '$\\sqrt{x}$', 'Let $n$ be a whole number', 'for any $x$',
];

// The → rule distinguishes a type signature from a mapping arrow; both edges
// are pinned here for the same reason.
const ARROW_MUST_PASS = ['$1 \\to 2$', '$$0 \\to 1 \\to 2 \\to 3$$', 'Sam → S', 'a → 1'];
const ARROW_MUST_CATCH = [
  '$f : S \\to T$', '$f : \\mathbb{R} \\to \\mathbb{R}$',
  '$\\lfloor \\cdot \\rfloor : \\mathbb{R} \\to \\mathbb{Z}$', '$g : T \\to R$',
];


// §A4.2 is cumulative: a symbol may appear at a level only if it is introduced
// at that level or below. GATES above are per-level bans kept for their wording;
// this table is the full ladder, and it is what makes the gate binding rather
// than advisory. `only` restricts a symbol to the modules that introduce it.
const LEVEL_ORDER = ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8'];
// A symbol introduced in module X.Y is available from X.Y onward — the course
// is read in order. `notBefore` compares "chapter.module" positions; the old
// `only` semantics ("only in the introducing module") was wrong, since it
// forbade §2.3 from using a symbol §1.10 had already taught.
const modPos = (rel) => {
  const m = rel.match(/(\d+)-[^/]+\/(\d+)-/);
  return m ? Number(m[1]) * 100 + Number(m[2]) : 0;
};
const rank = (l) => LEVEL_ORDER.indexOf(l);

const SYMBOL_LEVELS = [
  // introduced at l4
  { re: /\\emptyset|∅/, name: '∅', from: 'l4' },
  { re: /\\neq|≠/, name: '≠', from: 'l3' }, // easier to read than ⊆, which is already l3
  { re: /\\leq|≤|\\geq|≥/, name: '≤ / ≥', from: 'l3' }, // Part B §1.1, §1.2
  // Part B §5.6 at l3 is "Pythagoras applied on the complex plane", which needs √.
  { re: /\\sqrt|√/, name: '√', from: 'l4', early: { level: 'l3', when: /05-complex\/06-/ } },
  // Not in §A4.2's original table; it is a Chapter 2 set operation alongside ∪ ∩,
  // and Chapter 5 uses the same bar for conjugation. Introduced with them at l3.
  { re: /\\overline\{/, name: 'the complement bar', from: 'l3' },
  // Part B 2.2 introduces `{x | condition}` at l3 — the bound letter is a slot,
  // not a number, so this does not conflict with the l3 variable ban.
  { re: /\\mid|∣/, name: 'set-builder “such that”', from: 'l3' },
  // Part B §3.7 at l3: "Notation `g ∘ f` with the right-to-left reading called
  // out as the usual stumbling block" — so the module that teaches it may use it.
  { re: /\\circ|∘/, name: '∘ (composition)', from: 'l4', notBefore: 307, early: { level: 'l3', when: /03-functions\/07-/ } },
  { re: /∀|\\forall|∃|\\exists/, name: '∀ / ∃', from: 'l4', notBefore: 110 }, // §1.10
  // The connectives are gated by *module position*, not just by level. §1.2 was
  // writing p ∧ ¬p and p ∨ ¬p a whole module before §1.3 introduces "and" and
  // "or" — the positional check had let a bolded word anywhere nearby count as
  // an introduction, so a bolded **contradiction** was excusing the ∧ beside it.
  { re: /\\neg|¬/, name: '¬', from: 'l4', notBefore: 102 }, // §1.2 introduces it
  { re: /\\wedge|∧/, name: '∧', from: 'l4', notBefore: 103 }, // §1.3
  { re: /\\vee(?!r)|∨/, name: '∨', from: 'l4', notBefore: 103 }, // §1.3
  { re: /\\Rightarrow|⇒/, name: '⇒', from: 'l4', notBefore: 105 }, // §1.5
  // introduced at l5
  // §A4.2 restricts the *type signature* `f : S → T`, not a mapping arrow.
  // `0 → 1 → 2` and `a → 1` are legitimate pictures at any level; the signature
  // is what carries the domain/codomain abstraction, and it is always written
  // with a colon. So require the colon.
  { re: /:\s*[A-Za-z\\{}^0-9]+\s*(\\to\b|→)/, name: '→ in a type signature (f : S → T)', from: 'l3', notBefore: 301 }, // Part B §3.1
  { re: /\\mapsto|↦/, name: '↦', from: 'l5' },
  { re: /\\Leftrightarrow|⇔|\\iff/, name: '⇔', from: 'l4', notBefore: 109 }, // Part B §1.9
  // Only interval endpoints — not summation limits (\sum^\infty) or the
  // "infinitely many" superscript (\exists^\infty), which are different uses.
  { re: /[[(]\s*-?\\infty|\\infty\s*[\])]|[[(]\s*-?∞|∞\s*[\])]/, name: '∞ (interval notation)', from: 'l4', notBefore: 202 }, // Part B §2.2
  // introduced at l6
  { re: /\\equiv|≡/, name: '≡', from: 'l4', notBefore: 104 }, // Part B §1.4
  // §A4.2 splits the two objects sharing this notation: the pre-image operator
  // f⁻¹(U) is introduced in Chapter 3 at l4; f⁻¹ as an inverse *function* is
  // l6. Chapter 3 is the mechanical proxy for that distinction.

  { re: /f\s*\^\s*\{?\s*-\s*1/, name: 'f⁻¹', from: 'l6', early: { level: 'l4', when: /03-functions/ } },
  { re: /\\oplus|⊕/, name: '⊕', from: 'l6' },
  // introduced at l7
  { re: /\\sum|Σ/, name: 'Σ', from: 'l7' },
  { re: /\\prod|∏/, name: '∏', from: 'l7' },
  { re: /\\lim\b/, name: 'lim', from: 'l7' },
];

// §A4.1 lists abstract algebra, topology and measure theory as *not met* at l7.
// These terms are checked in the body only — a <WhereThisGoes> block is a
// forward pointer and is allowed to name the field it points at.
// Proof-course jargon that is genuinely opaque to someone new to proofs. This
// is deliberately a short curated list, not the union of every declared term:
// "set" and "union" are declared terms too, and nobody needs them re-glossed.
// §A4.2 requires a gloss or cross-reference on first use in each module that
// borrows one of these rather than defining it.
// Destination vocabulary. A <WhereThisGoes> block may name what is coming, but
// a precalculus reader has matrices, determinants, systems and vectors — not
// basis, span, subspace, null space, rank or eigenvalue. Naming one of these
// without anchoring it to something on-grade points nowhere.
const DESTINATION_VOCAB = [
  'null space', 'column space', 'row space', 'rank', 'nullity', 'eigenvalue',
  'eigenvector', 'subspace', 'basis', 'bases', 'span', 'linearly independent',
  'linear independence', 'Invertible Matrix Theorem', 'row echelon', 'rref',
  'vector space', 'linear transformation', 'orthogonal complement',
];

// Real-analysis foundations. These are genuinely needed (well-ordering justifies
// induction), so the rule is gloss-or-plain-language, not removal.
const ANALYSIS_FOUNDATIONS = [
  'well-ordering', 'well-ordered', 'Archimedean', 'supremum', 'infimum',
  'least upper bound', 'completeness axiom', 'complete ordered field',
  'order-complete',
];

const LADDER_JARGON = [
  'well-defined', 'vacuously', 'arbitrary but fixed', 'witness',
  'canonical representative', 'canonical embedding',
  'extensionality', 'involution', 'idempotent', 'tautology', 'contrapositive',
  'element chasing', 'disjunctive syllogism', 'universal generalisation',
  'trichotomy', 'non-constructive', 'reductio ad absurdum', 'up to isomorphism',
  'without loss of generality', 'necessary and sufficient', 'antisymmetr',
  'equinumerous', 'absorption law', 'excluded middle',
];

// Hyphenated forms slip past a plain space in these patterns — "integral-domain
// property" escaped /\bintegral domains?\b/ for the whole of the l7 pass. Any
// multi-word term below must therefore match a space OR a hyphen.
const L7_OFF_GRADE = [
  /\bintegral[ -]domains?\b/i, /\bfield[ -]of[ -]fractions\b/i, /\bprincipal[ -]ideal\b/i,
  /\bEuclidean[ -]domain\b/i, /\bcosets?\b/i, /\bquotient[ -](group|ring)\b/i,
  /\bmonoids?\b/i, /\bautomorphisms?\b/i, /\bendomorphisms?\b/i,
  /\blattices?\b(?<!integer lattice)/i, /\bBoolean[ -]algebras?\b/i, /\badjunction\b/i, /\badjoint\b/i,
  /\bcategoric(al|ity)\b/i, /\bfunctors?\b/i, /\btopolog(y|ical|ies)\b/i,
  /\bmeasure[ -](theory|space|able)\b/i, /\bsigma-algebra|\bσ-algebra/i,
  /\bHausdorff\b/i, /\bZorn\b/i, /\bZFC\b/i, /\bwell-founded\b/i,
  /\bprenex\b/i,
  // Added after a review found the first list incomplete. Word senses matter:
  // "already ideal", "a compact demonstration" and "group the reals into
  // families" are ordinary English, so these patterns are deliberately narrow.
  /\banti-?homomorphism/i, /\bhomomorphisms?\b/i,
  // Added when the kernel sweep found these running as working vocabulary.
  // NOT included: bare "ring". Part B §4.1 introduces the term at l5–l6 on
  // purpose ("a label for a number system with these rules") and §4.5 makes
  // ring-vs-field an objective, so a pattern for it would put this list back
  // in conflict with Part B — the failure §A4.2 already had to be rescued from.
  /\bmetric[ -]spaces?\b/i, /\bnormed[ -]spaces?\b/i, /\bnorm[ -]axioms?\b/i,
  /\bmeet[ -]and[ -]join\b/i, /\bjoin[ -]and[ -]meet\b/i, /\b(left|right)-cancell?able\b/i,
  /\bisomorphism[ -]theorem\b/i, /\bsymmetric[ -]group\b/i, /\bCayley/i,
  /\bgroup[ -]theory\b/i, /\b(a|the|every|any)\s+group\b(?!\s+(the|of|by))/i, /\bgroup theory\b/i, /\bsubgroups?\b/i, /\babelian\b/i,
  /\bfirst-order (logic|arithmetic|formula|schema|theorem|\*)/i,
  /\bEhrenfeucht|\bHintikka/i,
  // Godel's completeness theorem is a named historical result, and §7.1 is
  // about exactly what axiom systems can and cannot do — naming it is on-topic.

  /\bprincipal[ -]ideals?\b/i, /\bideal[ -]generated\b/i, /\bideals? (still|of|in) \b/i,
  /\bAxiom[ -]of[ -]Choice\b/i, /\bcompactness\b/i,
  /\brecursion[ -]theorem\b/i, /\btransfinite\b/i,
  // "second-order recurrence" is ordinary sequence vocabulary; only the
  // logician's sense (second-order logic/arithmetic) is off-grade.
  /\bsecond-order (?!recurrence)/i,
];
// Deliberately NOT listed: `ring` and `cardinality`. Both are introduced and
// glossed by the ladder itself (Part B 4.1 for ring, §3.8 for cardinality), so
// they are course vocabulary rather than unexplained forward references.

// Section length. A section is the unit a reader takes in one go; past a point
// it becomes a wall of text regardless of how good the prose is. Caps are set at
// roughly the 90th percentile of the levels whose tails are already healthy
// (l6, l8), scaled for reading maturity. Advisory — style, not correctness.
// Caps on RUNNING PROSE between components, set just above each level's 97th
// percentile so the check flags genuine outliers rather than firing constantly.
const SECTION_CAP = { l1: 70, l2: 150, l3: 160, l4: 175, l5: 190, l6: 190, l7: 210, l8: 210 };

// §A4.2: "anything introduced at a level must be glossed in words on first use
// in every module that uses it." A term defined in its OWN module needs no
// re-gloss; a term borrowed from another module must be reintroduced or
// cross-referenced. Proof-course jargon is the category this catches.
const GLOSS_SIGNAL = /—|--|\bmeans\b|\bthat is\b|\bi\.e\.|\bnamely\b|\bin other words\b|§\d|\bmodule \d|\bChapter \d/i;

// Sentence bounds around an index. Splitting naively on '.' breaks inside
// section numbers like §1.8, which chops off the very cross-reference the gloss
// check is looking for — so skip periods flanked by digits.
// The gloss may legitimately land in the next sentence — "**Term.** Explanation
// (§1.8)." is a common shape — so scope the check to the enclosing paragraph.
function paragraphAround(hay, start, end) {
  const from = hay.lastIndexOf('\n\n', start);
  const to = hay.indexOf('\n\n', end);
  return hay.slice(from < 0 ? 0 : from, to < 0 ? hay.length : to);
}

function sentenceAround(hay, start, end) {
  let from = 0;
  for (let i = start - 1; i > 0; i--) {
    if (hay[i] !== '.') continue;
    if (/\d/.test(hay[i - 1] ?? '') && /\d/.test(hay[i + 1] ?? '')) continue;
    from = i + 1; break;
  }
  let to = hay.length;
  for (let i = end; i < hay.length; i++) {
    if (hay[i] !== '.') continue;
    if (/\d/.test(hay[i - 1] ?? '') && /\d/.test(hay[i + 1] ?? '')) continue;
    to = i; break;
  }
  return hay.slice(from, to);
}

// §A4.2 is derived, so the plan and this table must agree. This guard fails if
// either is edited without the other — the drift that cost six rounds of
// investigation before anyone noticed the two had never been reconciled.
function checkPlanSync() {
  const plan = fs.readFileSync(path.join(ROOT, 'math0-spiral-plan.md'), 'utf8');
  const table = plan.slice(plan.indexOf('#### A4.2'), plan.indexOf('### A5.'));
  const rowFor = (lv) => (table.match(new RegExp(`^\\| \`${lv}\`.*$`, 'm')) ?? [''])[0];
  const TOKENS = {
    '∅': '∅', '≠': '≠', '≤ / ≥': '≤', '√': '√', 'the complement bar': 'complement bar',
    'set-builder “such that”': 'set-builder', '∘ (composition)': '∘', '∀ / ∃': '∀',
    '→ in a type signature (f : S → T)': 'f : S → T', '↦': '↦', '⇔': '⇔',
    '∞ (interval notation)': '∞', '≡': '≡', 'f⁻¹': 'f⁻¹', '⊕': '⊕',
    'Σ': 'Σ', '∏': '∏', 'lim': 'limits',
  };
  const bad = [];
  for (const sym of SYMBOL_LEVELS) {
    const tok = TOKENS[sym.name];
    if (!tok) continue;
    const lv = sym.early ? sym.early.level : sym.from;
    if (!rowFor(lv).includes(tok)) bad.push(`${sym.name}: lint says ${lv}, §A4.2 row does not list it`);
  }
  return bad;
}

if (process.argv.includes('--self-test')) {
  const fire = (s) => NUMERIC_VAR_PATTERNS.find(([re]) => re.test(s));
  const arrow = /:\s*[A-Za-z\\{}^0-9]+\s*(\\to\b|→)/;
  let bad = 0;
  for (const msg of checkPlanSync()) { console.error(`  PLAN DRIFT  ${msg}`); bad++; }
  for (const s of ARROW_MUST_PASS) {
    if (arrow.test(s)) { console.error(`  FALSE POSITIVE (arrow)  ${s}`); bad++; }
  }
  for (const s of ARROW_MUST_CATCH) {
    if (!arrow.test(s)) { console.error(`  MISSED (arrow)  ${s}`); bad++; }
  }
  for (const s of VAR_MUST_PASS) {
    const h = fire(s);
    if (h) { console.error(`  FALSE POSITIVE  ${s}  ->  ${h[1]}`); bad++; }
  }
  for (const s of VAR_MUST_CATCH) {
    if (!fire(s)) { console.error(`  MISSED  ${s}`); bad++; }
  }
  console.log(
    bad === 0
      ? `\nself-test OK — ${VAR_MUST_PASS.length} labels pass, ${VAR_MUST_CATCH.length} variables caught, ${ARROW_MUST_PASS.length} mapping arrows pass, ${ARROW_MUST_CATCH.length} signatures caught, §A4.2 in sync.`
      : `\nself-test FAILED — ${bad} case(s).`,
  );
  process.exit(bad > 0 ? 1 : 0);
}

const GATES = {
  l2: [
    [/×|\\times|\\cdot|·/, 'uses × — grade 2 has no multiplication (2.OA.C.4 is repeated addition)'],
    [/÷|\\div/, 'uses ÷ — grade 2 has no division'],
    [/\\frac|\\tfrac|\\dfrac/, 'uses a fraction — grade 2 has no fractions as numbers (3.NF)'],
    [/[$({=,+]\s*-\s*\d/, 'uses a negative number — negatives are grade 6 (6.NS.C.5)'],
    [/\\mathbb/, 'uses a number-system symbol — far beyond grade 2'],
  ],
  l3: [
    [/\\mathbb\{[NZQRC]\}/, 'uses ℕ/ℤ/ℚ/ℝ/ℂ — beyond grade 5'],
    [/[$({=,+]\s*-\s*\d/, 'uses a negative number — negatives are grade 6 (6.NS.C.5)'],
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

// Components that actually exist on disk, for the import check below.
const COMPONENTS = new Set(
  fs.readdirSync(path.join(ROOT, 'src/components'))
    .filter((f) => f.endsWith('.astro'))
    .map((f) => path.basename(f, '.astro')),
);

// Treatment per module, keyed by "<chapter>/<module>" relative to content/chapters.
// Read up front so the per-file word-budget check can exempt `touch` pages.
const MODULE_TREATMENT = new Map();
for (const ch of fs.readdirSync(CHAPTERS)) {
  const chDir = path.join(CHAPTERS, ch);
  if (!fs.statSync(chDir).isDirectory()) continue;
  for (const mod of fs.readdirSync(chDir)) {
    const mj = path.join(chDir, mod, '_module.json');
    if (!fs.existsSync(mj)) continue;
    const rel = path.relative(ROOT, path.join(chDir, mod));
    MODULE_TREATMENT.set(rel, JSON.parse(fs.readFileSync(mj, 'utf8')).treatment ?? {});
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
    // Chapter 5 is the standing exception for negatives: i × i = −1 is the
    // chapter's whole content, so §5.3 introduces below-zero numbers in words
    // and later modules re-gloss them. Everything else at l2/l3 stays clear.
    if (/negative number/.test(msg) && /05-complex/.test(rel)) continue;
    if (re.test(math) || re.test(text)) err(rel, msg);
  }

  // Concept gate: undergraduate vocabulary as *working* vocabulary in the body.
  // Each level has one sanctioned slot for naming a destination and glossing it,
  // and prose outside that slot is held strictly. l7 has <WhereThisGoes>; l6 has
  // no such component, so its <Aside> does that job. Applied to l6 as well as l7
  // because a term off-grade at grade 12 is not on-grade at grade 10.
  // The gate applies from l3 up. It used to run on l6/l7 only, which left 8th
  // grade carrying "cosets", "topology", "automorphism" and "axiom of choice" —
  // terms already judged off-grade for a TWELFTH grader. If it is beyond grade
  // 12 it is beyond grade 8, so the same list binds all the way down.
  const GLIMPSE = {
    l3: /<Aside[\s\S]*?<\/Aside>/g,
    l4: /<Aside[\s\S]*?<\/Aside>/g,
    l5: /<Aside[\s\S]*?<\/Aside>/g,
    l6: /<Aside[\s\S]*?<\/Aside>/g,
    l7: /<WhereThisGoes[\s\S]*?<\/WhereThisGoes>/g,
  };
  // Strip the block from the RAW source: body() removes JSX tags, which would
  // leave the block's prose behind and get it scanned as though it were body.
  const bodyOnlyL7 = level === 'l7' ? body(src.replace(GLIMPSE.l7, '')) : '';
  if (GLIMPSE[level]) {
    const prose = level === 'l7' ? bodyOnlyL7 : body(src.replace(GLIMPSE[level], ''));
    const found = L7_OFF_GRADE
      .map((re) => prose.match(re)?.[0])
      .filter(Boolean);
    if (found.length) {
      warn(rel, `body uses off-grade vocabulary (§A4.1 — abstract algebra / topology / measure theory are not met by grade 12): ${[...new Set(found)].join(', ')}`);
    }
  }

  // §A4.2 cumulative ladder
  for (const s of SYMBOL_LEVELS) {
    // A symbol may be introduced earlier in the chapters that define it.
    const from = s.early && s.early.when.test(rel) ? s.early.level : s.from;
    if (rank(level) >= rank(from)) {
      // At or above the introducing level: only the `only` restriction applies,
      // and only at the introducing level itself.
      if (s.notBefore && modPos(rel) < s.notBefore && s.re.test(math)) {
        // Using notation before its introducing module is legitimate as a
        // signposted preview — §1.1 must show what closes an open statement,
        // §1.5 must state a quantified theorem — but the preview has to be
        // labelled, so the reader knows the treatment comes later. Same
        // "gloss or cross-reference" principle as the §A4.2 jargon rule.
        // Scope to the enclosing SECTION: a signpost in the heading ("Negation
        // with quantifiers, previewed") covers the bullets beneath it.
        const m2 = s.re.exec(text);
        let near = text;
        if (m2) {
          const hs = text.lastIndexOf('\n#', m2.index);
          const he = text.indexOf('\n#', m2.index + m2[0].length);
          near = text.slice(hs < 0 ? 0 : hs, he < 0 ? text.length : he);
        }
        if (!/§\d|\bmodule \d|\bChapter \d|\bpreview/i.test(near)) {
          err(rel, `uses ${s.name} before §${Math.floor(s.notBefore / 100)}.${s.notBefore % 100} introduces it, with no forward reference (§A4.2)`);
        }
      }
      continue;
    }
    if (s.re.test(math)) {
      err(rel, `uses ${s.name} — introduced at ${from}, not permitted at ${level} (§A4.2)`);
    }
  }

  // l3: letters standing for numbers.
  // Part B writes `z·z̄` at l3 (§5.4, §5.6) and `a · 1 = a` at l3 (§7.7), so a
  // letter naming the object a module is *about* is sanctioned there; the ban
  // is on letters standing for arbitrary numbers in general algebra.
  // Part B also sanctions f(x) in Chapter 3 at l3 (§3.1) and the set-builder
  // slot letter in §2.2, both of which require a letter.
  const PARTB_LETTER_OK = /05-complex\/(04|06|08)-|07-peano\/07-|03-functions\/|02-sets\/02-/;
  if (level === 'l3' && !PARTB_LETTER_OK.test(rel)) {
    for (const [re, why] of NUMERIC_VAR_PATTERNS) {
      const m = text.match(re);
      if (m) {
        const snippet = m[0].replace(/\s+/g, ' ').trim().slice(0, 40);
        err(rel, `uses a letter as a number — ${why}: “${snippet}”. Variables are grade 6 (6.EE.A.2); say "take any one and follow it"`);
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
    } else if (usesFx && !/new notation|notation.*introduc|introduc.*notation|we write|§3\.1|module 3\.1/i.test(text)) {
      // §3.1 introduces f(x) at this level; later Chapter 3 modules borrow it and
      // need a cross-reference rather than a repeated gloss (§A4.2).
      warn(rel, 'uses f(x) without glossing it or cross-referencing §3.1');
    }
    // ∀ ∃ outside 1.10–1.12 is now an error, raised by the §A4.2 ladder above.
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

  // Text that points at a picture must have one to point at. Found when §1.11
  // at l1 opened "Look at this picture of a farm" and no farm had ever been
  // drawn — the reader is told to look at something that is not there, which is
  // worse than having no picture at all. Deliberately narrow: only phrases that
  // can ONLY mean an on-page visual. "Look at the definition", "the picture in
  // your head" and a "shown above" pointing at an earlier proof are all
  // ordinary prose and must not fire.
  //
  // The rule fires only when the page has NO picture at all. Distance from the
  // nearest figure looked like a better signal and is not: a back-reference
  // ("the picture above", "look at the pictures again") is ordinary and can sit
  // any number of lines below the thing it refers to, so every threshold I
  // tried either missed real cases or flagged good prose. "Points at a picture,
  // page has none" is the defect, and it is exactly decidable.
  const POINTS_AT_A_PICTURE =
    /\b(look at (this|the) (picture|diagram|drawing)|in the picture|the diagram (above|below)|stand back and look at)/i;
  {
    // Only components that DRAW something count. A nearby <TryIt> or <Warning>
    // is prose furniture and does not satisfy "look at this picture" — an
    // earlier version of this check counted them and so never fired.
    const NOT_A_PICTURE = new Set([
      'TryIt', 'Warning', 'Aside', 'Discussion', 'Proof', 'WhereThisGoes',
      'Term', 'Needs', 'BigIdea', 'Figure',
    ]);
    const lines = src.split('\n');
    const figureLines = lines
      .map((l, i) => {
        if (/^import\b/.test(l)) return -1;
        const names = [...l.matchAll(/<([A-Z][A-Za-z]*)\b/g)].map((m) => m[1]);
        return names.some((n) => !NOT_A_PICTURE.has(n)) ? i : -1;
      })
      .filter((i) => i >= 0);
    if (figureLines.length === 0) {
      for (const [i, line] of lines.entries()) {
        if (/^import\b/.test(line)) continue;
        const m = POINTS_AT_A_PICTURE.exec(line);
        if (!m) continue;
        err(rel, `line ${i + 1} says "${m[0]}" but this page draws no picture at all`);
      }
    }
  }

  // Components must be imported, and the file must exist. §C7 lists figure
  // components as a build-these backlog, and reaching for an unbuilt one from
  // that list breaks `astro build` with an error that does not name the page.
  // Catching it here names the page and costs nothing.
  const imported = new Set(
    [...src.matchAll(/^import\s+([A-Z][A-Za-z]*)\s+from\s+'@\/components\/([A-Za-z]+)\.astro';/gm)]
      .map((m) => m[1]),
  );
  const used = new Set([...src.matchAll(/<([A-Z][A-Za-z]*)[\s/>]/g)].map((m) => m[1]));
  for (const name of used) {
    if (!imported.has(name)) {
      err(rel, `<${name}> is used but never imported`);
    } else if (!COMPONENTS.has(name)) {
      err(rel, `<${name}> is imported but src/components/${name}.astro does not exist`);
    }
  }
  for (const name of imported) {
    if (!used.has(name)) warn(rel, `imports <${name}> but never uses it`);
  }

  // word budget
  const words = text.split(/\s+/).filter(Boolean).length;
  // l8's budget is still an a-priori estimate — too few pages exist to calibrate
  // it from the corpus, so measuring against it is not meaningful.
  const CALIBRATED = new Set(['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7']);
  // A `touch` module is deliberately lighter than the level's core pages, so the
  // core budget is the wrong yardstick for it. Added when l5 §5.7–5.9 were
  // written as touch (they need trig, which a grade-9 reader has not met) and
  // then flagged as under-budget for being exactly what they were meant to be.
  const treatment = MODULE_TREATMENT.get(rel.replace(/\/l\d\.mdx$/, ''))?.[level];
  const uncapped = !CALIBRATED.has(level) || treatment === 'touch';
  const [lo, hi] = uncapped ? [0, Infinity] : budget[level];
  if (words < lo * 0.8) warn(rel, `${words} words — more than 20% under the ${lo}–${hi} budget`);
  if (words > hi * 1.2) warn(rel, `${words} words — more than 20% over the ${lo}–${hi} budget`);

  // section length
  const cap = SECTION_CAP[level];
  if (cap) {
    // Split on any heading level ≥ 2: a ### subheading breaks the wall for a
    // reader just as a ## does, so it should count toward relieving the cap.
    const parts = src.replace(/^---[\s\S]*?^---/m, '').split(/^#{2,} /m).slice(1);
    for (const part of parts) {
      const title = part.split('\n')[0].trim();
      // Count RUNNING PROSE only. A <Proof>, <Discussion> or <Warning> block is
      // visually distinct on the page and does not read as a wall of text, so
      // counting its words as prose overstated section length badly (median 79%
      // of a long section's words turned out to live inside such blocks).
      // Match components generically rather than by name. Any capitalised JSX
      // element is a component and is visually distinct from running prose,
      // which is the whole rationale above. A hardcoded list silently counted
      // every newer component's ATTRIBUTES as prose — a <ThingBox> with its
      // items spelled out added ~30 "words" to its section and pushed pages
      // over the cap for carrying a picture. Self-closing tags are stripped
      // first so the paired pattern cannot run from one of them to a later
      // closing tag of the same name.
      const n = part
        .replace(/<[A-Z][A-Za-z]*\b[^>]*\/>/g, ' ')
        .replace(/<([A-Z][A-Za-z]*)\b[\s\S]*?<\/\1>/g, ' ')
        .replace(/\$\$[\s\S]*?\$\$/g, ' ')
        .split(/\s+/).filter(Boolean).length;
      if (n > cap) {
        warn(rel, `section "${title}" is ${n} words (cap ${cap}) — split it or move material into a Proof/Aside`);
      }
    }
  }

  // §A4.2 gloss rule for terms this module borrows rather than defines
  const own = new Set(
    (fm?.[1].match(/newTerms:\s*\[(.*?)\]/)?.[1] ?? '')
      .split(',').map((t) => t.replace(/["'\s]/g, '').toLowerCase()).filter(Boolean),
  );
  for (const term of LADDER_JARGON) {
    // A module declaring "proof by contrapositive" has defined "contrapositive";
    // one declaring "vacuously true" has defined "vacuously". Match on
    // containment either way, not on exact set membership.
    const key = term.replace(/\s/g, '');
    if ([...own].some((d) => d.includes(key) || key.includes(d))) continue;
    // A term in a heading announces the topic; the body below explains it, so a
    // heading occurrence is not the "first use" the gloss rule is about.
    const re = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![a-z])`, 'gi');
    let m = null;
    for (const cand of text.matchAll(re)) {
      const lineStart = text.lastIndexOf('\n', cand.index) + 1;
      if (text.slice(lineStart, lineStart + 6).trimStart().startsWith('#')) continue;
      m = cand; break;
    }
    if (!m) continue;
    const sentence = paragraphAround(text, m.index, m.index + m[0].length);
    if (!GLOSS_SIGNAL.test(sentence)) {
      warn(rel, `uses "${term}" without a gloss or cross-reference on first use (§A4.2)`);
    }
  }

  if (level === 'l7') {
    const own = new Set(
      (fm?.[1].match(/newTerms:\s*\[(.*?)\]/)?.[1] ?? '')
        .split(',').map((t) => t.replace(/["'\s]/g, '').toLowerCase()).filter(Boolean),
    );
    const firstUngloss = (list, hay, label) => {
      for (const term of list) {
        // A module that declares a term defines it — same rule as the jargon check.
        const k = term.replace(/\s/g, '').toLowerCase();
        if ([...own].some((d) => d.includes(k) || k.includes(d))) continue;
        const m = new RegExp(`\\b${term}`, 'i').exec(hay);
        if (!m) continue;
        const sent = paragraphAround(hay, m.index, m.index + m[0].length);
        if (!GLOSS_SIGNAL.test(sent)) warn(rel, `${label}: "${term}" is named without anchoring it to something on-grade`);
      }
    };
    const wtg = (src.match(/<WhereThisGoes[\s\S]*?<\/WhereThisGoes>/g) ?? []).join('\n');
    if (wtg) {
      // A trailing vocabulary line glosses the whole block, so accept a gloss
      // anywhere in it rather than only in the sentence of first use.
      const w = body(wtg);
      for (const term of DESTINATION_VOCAB) {
        if (!new RegExp(`\\b${term}`, 'i').test(w)) continue;
        if (new RegExp(`\\*\\*${term}\\*\\*\\s*—`, 'i').test(w)) continue;
        const m = new RegExp(`\\b${term}`, 'i').exec(w);
        if (!GLOSS_SIGNAL.test(paragraphAround(w, m.index, m.index + m[0].length))) {
          warn(rel, `WhereThisGoes: "${term}" is named without anchoring it to something on-grade`);
        }
      }
    }
    firstUngloss(ANALYSIS_FOUNDATIONS, bodyOnlyL7, 'body');
  }
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Undefined LaTeX inside math. KaTeX renders an unknown command as an error node
// rather than failing the build, so broken math ships silently.
//
// This exists because three separate search-and-replace passes over math damaged
// it in ways the build did not catch: \omega → w turned "0\cdot\omega" into
// "\cdotw"; a follow-up fix turned every "\cdots" into "\cdot s"; and renaming
// statement variables produced "\negp", "\equivq", "\cosw". Regex over LaTeX
// needs a net under it.
// ---------------------------------------------------------------------------
const KATEX_COMMANDS = new Set(`
frac tfrac dfrac sqrt times div cdot cdots ldots dots vdots ddots pm mp leq le geq ge
neq approx equiv sim cong propto pi theta alpha beta gamma delta Delta epsilon varepsilon
lambda mu sigma tau rho zeta chi psi phi varphi omega Omega Gamma infty quad qquad text
textbf textit mathbf mathbb mathcal mathrm mathit operatorname left right big Big bigg Bigg
bigl bigr phantom hphantom vphantom begin end aligned align array matrix pmatrix bmatrix
cases hline overline underline bar hat vec tilde widehat overbrace underbrace angle triangle
perp parallel circ degree sin cos tan cot sec csc arcsin arccos arctan sinh cosh tanh log ln
exp lim limsup liminf sup inf max min gcd lcm det dim deg ker to rightarrow leftarrow
leftrightarrow Rightarrow Leftarrow Leftrightarrow longrightarrow longleftarrow
longleftrightarrow Longrightarrow Longleftarrow Longleftrightarrow implies iff mapsto
longmapsto xrightarrow xleftarrow hookrightarrow twoheadrightarrow rightharpoonup uparrow
downarrow in notin ni subset supset subseteq supseteq subsetneq supsetneq cup cap setminus
emptyset varnothing wedge vee neg lnot land lor forall exists nexists therefore because
mid nmid parallel bmod pmod binom choose sum prod int oint partial nabla lfloor rfloor
lceil rceil lvert rvert langle rangle vert Vert colon semicolon star ast dagger bullet
square Box Diamond blacksquare checkmark boxed tag displaystyle textstyle scriptstyle
overset underset stackrel substack middle not ell hbar Re Im wp aleph prime circledast
oplus otimes ominus odot sqcup sqcap bigcup bigcap bigsqcup bigwedge bigvee bigoplus
prec succ preceq succeq ll gg equivalent vdash models S P dag ddag
arg overrightarrow overleftarrow xmapsto xhookrightarrow smallint iint iiint
`.trim().split(/\s+/));

for (const file of files) {
  const rel = path.relative(ROOT, file);
  const src = fs.readFileSync(file, 'utf8').replace(/^---[\s\S]*?^---/m, '');
  for (const m of src.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$\n]+)\$/g)) {
    const seg = m[1] ?? m[2] ?? '';
    for (const c of seg.match(/\\[a-zA-Z]+/g) ?? []) {
      if (!KATEX_COMMANDS.has(c.slice(1))) {
        err(rel, `undefined LaTeX command ${c} — KaTeX renders this as an error, not a build failure`);
      }
    }
  }
}

// §A5.0 rule 2: no proof notation before it is introduced.
//
// ∀ ∃ ⇒ ⇔ ¬ ∧ ∨ ∈ ⊆ ∪ ∩ ∅ ≡ ∘ ↦ and the blackboard-bold sets are taught nowhere
// in American K-12 — they are college discrete-maths notation. A reader works
// through a level IN ORDER, so each symbol must be explained in words the first
// time that level uses it. This walks the modules in reading order and checks
// only the first appearance; later uses are free.
// ---------------------------------------------------------------------------
const PROOF_NOTATION = [
  ['∀', /\\forall|∀/],
  ['∃', /\\exists|∃/],
  ['⇒', /\\Rightarrow|⇒/],
  ['⇔', /\\Leftrightarrow|⇔|\\iff/],
  ['¬', /\\neg|¬/],
  ['∧', /\\wedge|∧/],
  ['∨', /\\vee(?!r)|∨/],
  ['∈', /\\in\b|∈/],
  ['⊆', /\\subseteq|⊆/],
  ['∪', /\\cup\b|∪/],
  ['∩', /\\cap\b|∩/],
  ['∅', /\\emptyset|∅/],
  ['≡', /\\equiv|≡/],
  ['∘', /\\circ\b|∘/],
  ['↦', /\\mapsto|↦/],
  ['Σ', /\\sum\b|Σ/],
  // Sigma notation and combinations ARE met in precalculus, but only briefly, so
  // they get the same treatment as everything else: introduced before first use.
  ['binomial coefficient', /\\binom|\\choose/],
  ['∫', /\\int\b|∫/],
  ['∤', /\\nmid|∤/],
  ['ℕ', /\\mathbb\{N\}|ℕ/],
  ['ℤ', /\\mathbb\{Z\}|ℤ/],
  ['ℚ', /\\mathbb\{Q\}|ℚ/],
  ['ℝ', /\\mathbb\{R\}|ℝ/],
  ['ℂ', /\\mathbb\{C\}|ℂ/],
];
// Wording that counts as introducing a symbol. Deliberately requires an explicit
// act of naming — "reads", "means", "is written" — rather than merely occurring
// near an English word that happens to match, which an earlier draft of this
// check did and which passed everything.
// Inflections matter: an earlier version listed "write" but not "writing", so a
// perfectly good gloss ("writing ℚ for the rationals") failed the check three
// separate times and I reworded the prose instead of fixing the pattern.
const INTRODUCES =
  /\b(read|reads|reading|is read|mean|means|meaning|writ(e|es|ing|ten)|stands? for|short(hand)? for|the symbol|notation for|abbreviat\w*|pronounc\w*|denot\w*|call(ed)? the)\b/i;

{
  const modKey = (p) => {
    const m = p.match(/(\d+)-[^/]+\/(\d+)-/);
    return m ? Number(m[1]) * 100 + Number(m[2]) : 0;
  };
  for (const level of ['l3', 'l4', 'l5', 'l6', 'l7', 'l8']) {
    const pages = files
      .filter((f) => path.basename(f, '.mdx') === level)
      .sort((a, b) => modKey(a) - modKey(b));
    for (const [sym, re] of PROOF_NOTATION) {
      for (const f of pages) {
        const src = fs.readFileSync(f, 'utf8');
        const b = src.replace(/^---[\s\S]*?^---/m, '').replace(/^import .*$/gm, '');
        if (!re.test(b)) continue;
        // First page of this level that uses the symbol. Does it introduce it?
        // Two shapes count, because both are how mathematics actually introduces
        // notation and requiring only the first would have me bolt redundant
        // glosses onto pages that already do the job:
        //   1. explicit naming — "the symbol ≡ reads…"
        //   2. definitional — "the **negation** ¬p is the statement…", where a
        //      bolded term sits right beside the symbol
        // A display equation followed by its explanation is also normal, so the
        // paragraph after first use counts too.
        const paras = b.split(/\n\s*\n/);
        const at = paras.findIndex((p) => re.test(p));
        // The introduction must PRECEDE the symbol, not merely exist on the page.
        // Checking only "is it introduced somewhere here" let ∅ be displayed and
        // then named a paragraph later, and let ∀ appear inside a worked example
        // eight modules before the quantifier module. Position is the whole point.
        const introducedBefore = paras.slice(0, at + 1).some((p, i) =>
          (re.test(p) && (INTRODUCES.test(p) || /\*\*[^*]+\*\*/.test(p) || /\|\s*-+\s*\|/.test(p)))
          || (i === at - 1 && INTRODUCES.test(p)));
        if (!introducedBefore) {
          warn(
            path.relative(ROOT, f),
            `${level} shows "${sym}" before introducing it (paragraph ${at + 1}) — §A5.0 rule 2`,
          );
          break;
        }
        // Previous, current and next paragraph. A display equation is its own
        // paragraph, so its introduction routinely sits immediately before it
        // ("Each system gets a letter:" then the display) or immediately after
        // ("… the **rational numbers**"). Looking only forwards missed both.
        const scope = paras.slice(Math.max(0, at - 1), at + 2).join('\n\n');
        // A notation table — "| ℕ | naturals | {0,1,2,…} |" — introduces its
        // symbols as surely as a sentence does, and is the usual way a course
        // presents a family of them at once.
        const inNotationTable = /\|\s*-+\s*\|/.test(scope)
          && scope.split('\n').some((ln) => ln.trim().startsWith('|') && re.test(ln));
        const definitional = /\*\*[^*]+\*\*/.test(scope) || inNotationTable;
        if (!INTRODUCES.test(scope) && !definitional) {
          warn(
            path.relative(ROOT, f),
            `${level} meets "${sym}" here first (reading order) and does not introduce it — §A5.0 rule 2`,
          );
        }
        break;
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Proof-jargon density. Matching the lexical level is not enough: three abstract
// terms in one sentence is hard going even when each is individually fair game.
// Terms that are the module's OWN subject don't count — §7.2 is the
// reflexive/symmetric/transitive module, and naming all three there is the
// content. What this catches is jargon *borrowed* from elsewhere and stacked.
//
// The three arithmetic properties (commutative/associative/distributive) are
// deliberately absent: CCSSM names them from grade 3 (3.OA.B.5), so they are not
// proof-course vocabulary at any level here.
const HEAVY_JARGON = [
  /\bquantifi\w*\b/i, /\bcontrapositive\b/i, /\bbiconditional\b/i, /\bvacuous\w*\b/i,
  /\bwell-defined\w*\b/i, /\bequivalence relation\b/i, /\binjectiv\w*\b/i,
  /\bsurjectiv\w*\b/i, /\bbijectiv\w*\b/i, /\bidempotent\w*\b/i, /\binvolution\b/i,
  /\btransitivit\w*\b/i, /\breflexivit\w*\b/i, /\baxiomati\w*\b/i, /\bisomorph\w*\b/i,
  /\bcardinalit\w*\b/i, /\bcountab\w*\b/i, /\bantecedent\b/i, /\bconsequent\b/i,
  /\btautolog\w*\b/i, /\bpredicate\b/i, /\bcodomain\b/i, /\bBoolean ring\b/i,
  /\bcommutative ring\b/i, /\bintegral domain\b/i, /\bequinumerous\b/i,
  /\bpreorder\b/i, /\bpartial order\b/i, /\bantisymmetr\w*\b/i,
];
// Vocabulary belonging to a chapter at a level: every newTerm and title the
// chapter declares. Scoped to the chapter, not the module, because Chapter 3 may
// say "injective, surjective, bijective" in any of its modules — those words are
// its subject matter, and flagging §3.3 for naming what §3.5-§3.8 will prove
// would be flagging the table of contents.
const chapterVocab = new Map();
for (const f of files) {
  const level = path.basename(f, '.mdx');
  const ch = path.relative(CHAPTERS, f).split(path.sep)[0];
  const fm = fs.readFileSync(f, 'utf8').match(/^---([\s\S]*?)^---/m)?.[1] ?? '';
  const key = `${ch}/${level}`;
  chapterVocab.set(key, (chapterVocab.get(key) ?? '') + ' '
    + (fm.match(/newTerms:\s*\[([^\]]*)\]/)?.[1] ?? '') + ' '
    + (fm.match(/title:\s*(.*)/)?.[1] ?? ''));
}
for (const f of files) {
  const level = path.basename(f, '.mdx');
  if (!['l3', 'l4', 'l5', 'l6', 'l7'].includes(level)) continue; // l8 is college
  const src = fs.readFileSync(f, 'utf8');
  const ch = path.relative(CHAPTERS, f).split(path.sep)[0];
  const own = (chapterVocab.get(`${ch}/${level}`) ?? '').toLowerCase();
  // A bulleted list that names one term per line and glosses each in place is
  // a glossary, not a pile-up, so each item is judged on its own.
  const prose = body(src).replace(/\n(\s*[-*]\s)/g, '\n\n$1');
  for (const para of prose.split(/\n\s*\n/)) {
    if (/^\s*(import|<|\|)/.test(para)) continue;
    const hits = HEAVY_JARGON
      .map((re) => para.match(re)?.[0])
      .filter((t) => t && !own.includes(t.slice(0, 6).toLowerCase()));
    const distinct = [...new Set(hits.map((t) => t.toLowerCase()))];
    if (distinct.length >= 3) {
      warn(
        path.relative(ROOT, f),
        `stacks ${distinct.length} borrowed proof-jargon terms in one paragraph (${distinct.join(', ')}) — spread them out`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// College mathematics has no place at l4-l7. These are 8th to 12th graders in
// an American high school taking a first proof course; rings, fields, groups,
// vector spaces, topology and complex analysis appear in no course any of them
// has taken or will take before university.
//
// The <WhereThisGoes> box at l7 is exempt — naming a destination is its whole
// purpose, and it now carries a standing note saying so. Everywhere else these
// terms are simply unavailable, including in the body of a module that happens
// to be *about* the underlying idea: §4.1's real content is "these systems obey
// the same arithmetic rules", which needs no word at all.
const COLLEGE_TERMS = [
  [/\bholomorphic|\bmeromorphic|\banalytic function|\bcontour integral/i, 'complex analysis'],
  [/\brings?\b|\bfields?\b(?!\s+of\s+study)|\bcosets?\b|\bideals?\b/i, 'abstract algebra'],
  [/\bvector spaces?\b|\beigen|\bdeterminants?\b|\bhomomorph|\bisomorph|\bautomorph/i, 'linear/abstract algebra'],
  [/\btopolog|\bmetric spaces?\b|\bhomeomorph|\bopen sets?\b/i, 'topology'],
  [/\bmeasure theor|\bLebesgue|\bBanach|\bHilbert\b/i, 'analysis'],
  [/\bcardinals?\b|\bordinals?\b|\btransfinite|\bZorn|\baxiom of choice/i, 'set theory'],
  [/\bintegral domain|\bGalois|\babelian|\bmonoid|\bBoolean algebra/i, 'abstract algebra'],
  [/\bcategory theor|\bfunctors?\b|\bnatural transformation/i, 'category theory'],
  [/\bmanifold|\bmultivariable|\bJacobian|\bpartial derivative/i, 'later calculus'],
];
for (const f of files) {
  const level = path.basename(f, '.mdx');
  if (!['l4', 'l5', 'l6', 'l7'].includes(level)) continue;
  const rel = path.relative(ROOT, f);
  const text = body(
    fs.readFileSync(f, 'utf8').replace(/<WhereThisGoes[\s\S]*?<\/WhereThisGoes>/g, ''),
  );
  for (const [re, area] of COLLEGE_TERMS) {
    const m = text.match(re);
    if (m) warn(rel, `${level} uses "${m[0]}" (${area}) — no US high-school course teaches it`);
  }
}

// ---------------------------------------------------------------------------
// Callout tags must balance. A bulk edit whose replacement ran to the next
// blank line once swallowed a `</Warning>`, and the failure surfaced only as an
// MDX parse error four minutes into a build — long after the commit.
const CALLOUTS = ['Warning', 'Aside', 'Proof', 'Discussion', 'WhereThisGoes', 'TryIt', 'Figure', 'BigIdea'];
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  for (const tag of CALLOUTS) {
    const open = (src.match(new RegExp(`<${tag}[\\s>]`, 'g')) ?? []).length;
    const close = (src.match(new RegExp(`</${tag}>`, 'g')) ?? []).length;
    if (open !== close) {
      err(path.relative(ROOT, f), `<${tag}> is unbalanced: ${open} opening, ${close} closing`);
    }
  }
}

// No prose inside a display block. Twice now an inserted gloss has landed
// between a display's opening `$$` and its closing one, which renders the raw
// LaTeX to the reader with the italic sentence sitting on top of it.
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  for (const m of src.matchAll(/^\$\$\n([\s\S]*?)^\$\$/gm)) {
    if (/^\*(In words|Symbol by symbol)/m.test(m[1])) {
      err(path.relative(ROOT, f), 'a gloss is trapped inside a display block — it renders as raw LaTeX');
    }
  }
}

// A notation key may only name symbols that actually appear in the display it
// sits under. The generator that wrote these paired any two `$$` occurrences,
// so it read the prose *between* two displays as if it were a display — and a
// key ended up announcing "ℂ is the complex numbers, ∅ is the empty collection"
// under a line containing neither. A display runs from a line-initial `$$` to
// the next line-initial `$$`, and nothing else counts.
const KEY_GLYPHS = [
  ['\\mathbb{N}', /\\mathbb\{N\}/], ['\\mathbb{Z}', /\\mathbb\{Z\}/],
  ['\\mathbb{Q}', /\\mathbb\{Q\}/], ['\\mathbb{R}', /\\mathbb\{R\}/],
  ['\\mathbb{C}', /\\mathbb\{C\}/], ['\\subseteq', /\\subseteq/],
  ['\\notin', /\\notin/], ['\\in', /\\in\b/], ['\\emptyset', /\\emptyset/],
  ['\\forall', /\\forall/], ['\\exists', /\\exists/], ['\\Rightarrow', /\\Rightarrow/],
  ['\\Leftrightarrow', /\\Leftrightarrow|\\iff/], ['\\neg', /\\neg/],
  ['\\wedge', /\\wedge/], ['\\vee', /\\vee/], ['\\cup', /\\cup/], ['\\cap', /\\cap/],
];
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const rel = path.relative(ROOT, f);
  for (const m of src.matchAll(/^\$\$[\s\S]*?^\$\$/gm)) {
    const after = src.slice(m.index + m[0].length);
    if (!after.startsWith('\n\n*Symbol by symbol:')) continue;
    const gloss = after.slice(2, after.indexOf('\n', 2) < 0 ? undefined : after.indexOf('\n', 2));
    const head = gloss.split('So the line reads:')[0];
    for (const [name, re] of KEY_GLYPHS) {
      if (head.includes(`$${name}$`) && !re.test(m[0])) {
        err(rel, `notation key names "${name}" but the display above it does not use that symbol`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Kernels carry no proof notation, at any level.
//
// The kernel is printed at the very top of the page under "The big idea, said
// for you" — before the reader has read a word of the module. A kernel opening
// "ℚ is closed under … multiplicative inverses of nonzero elements — this makes
// ℚ a field" asks them to hold five unexplained things before the page starts.
// The symbols are always available a few paragraphs later, where they are
// introduced; the kernel says the idea in words.
const KERNEL_NOTATION = /[ℚℤℝℕℂ∀∃⊆∈∉∪∩¬∧∨⇒⇔≡∅↦∘]|\\mathbb|\\forall|\\exists/;
for (const ch of fs.readdirSync(CHAPTERS)) {
  const chDir = path.join(CHAPTERS, ch);
  if (!fs.statSync(chDir).isDirectory()) continue;
  for (const mod of fs.readdirSync(chDir)) {
    const p = path.join(chDir, mod, '_module.json');
    if (!fs.existsSync(p)) continue;
    const j = JSON.parse(fs.readFileSync(p, 'utf8'));
    const rel = path.relative(ROOT, p);
    for (const [lvl, k] of Object.entries(j.kernels ?? {})) {
      // l8 is exempt: its reader is a university student who has met this
      // notation, and its modules are still unwritten — its kernels get
      // rewritten alongside the bodies rather than twice.
      if (lvl === 'l8') continue;
      const m = String(k).match(KERNEL_NOTATION);
      if (m) warn(rel, `kernels.${lvl} uses "${m[0]}" — the kernel is read before anything explains it`);
    }
  }
}

// ---------------------------------------------------------------------------
// Symbolic displays in the early chapters must come with a plain rendering.
//
// Introducing a symbol once is not enough when a whole display is built from
// four of them: the reader can know what each mark means and still not be able
// to read the line. So a display carrying proof notation gets a sentence saying
// what it says, in words, right beside it.
//
// The requirement tapers by level, not by page count. An 8th grader is meeting
// every one of these marks for the first time in their life, so at l4 *every*
// chapter carries the requirement; a 9th grader has had a year of the course
// before Chapter 5, so l5 stops after Chapter 4; l6 after Chapter 2; l7 keeps
// it only for Chapter 1, where the reader is still finding their feet.
const GLOSS_THROUGH_CHAPTER = { l4: 7, l5: 7, l6: 6, l7: 5 };
const DISPLAY_SYMBOLS =
  /\\forall|\\exists|\\Rightarrow|\\Leftrightarrow|\\iff|\\neg|\\wedge|\\vee(?!r)|\\in\b|\\subseteq|\\mathbb\{[NZQRC]\}|\\equiv|\\cup\b|\\cap\b/;
const RENDERS_IT =
  /\bread[s]?\b|\bmeans?\b|\bsays?\b|in words|that is|i\.e\.|which is|translat\w*|\bis just\b|\bshorthand\b|\bunpack\w*|\bunfold\w*/i;
for (const f of files) {
  const level = path.basename(f, '.mdx');
  const through = GLOSS_THROUGH_CHAPTER[level];
  if (!through) continue;
  const rel = path.relative(ROOT, f).split(path.sep).join('/');
  const chapterNo = Math.floor(modPos(rel) / 100);
  if (chapterNo > through) continue;
  const paras = body(fs.readFileSync(f, 'utf8')).split(/\n\s*\n/);
  for (let i = 0; i < paras.length; i += 1) {
    const p = paras[i];
    if (!p.trim().startsWith('$$') || !DISPLAY_SYMBOLS.test(p)) continue;
    const around = paras.slice(Math.max(0, i - 1), i + 2).join('\n\n');
    // The house convention is a wholly-italic line immediately after the
    // display, which is a rendering whatever words it happens to use.
    const next = (paras[i + 1] ?? '').trim();
    const italicGloss = next.startsWith('*') && next.endsWith('*') && !next.startsWith('**');
    if (!italicGloss && !RENDERS_IT.test(around)) {
      warn(
        path.relative(ROOT, f),
        `symbolic display with no plain rendering beside it — say what it says in words (${level}, Ch ${chapterNo})`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// The l7 look-ahead boxes may point forward — that is their whole job — but a
// reader in grade 12 is *starting* calculus. Two things they may not do:
//
//   1. Lean on the last unit of BC calculus (series, convergence, epsilon-delta)
//      as if it were shared ground. Early calculus — slopes, breaks in a graph,
//      highest and lowest points — is available from the first weeks and makes
//      the same points.
//   2. Name a theorem and recite its hypotheses. "The Mean Value Theorem needs
//      continuity on [a,b] and differentiability on (a,b)" tells a reader who
//      has not met it precisely nothing, at some length.
const LOOKAHEAD_LATE =
  /\bseries\b|\bconverges?\b|\bconvergence\b|\bdiverges?\b|\bdivergence\b|Ratio Test|\bTaylor\b|radius of convergence|varepsilon|\bpartial sums?\b/i;
const LOOKAHEAD_NAMED =
  /\b(Mean|Intermediate|Extreme) Value Theorem\b|\bRolle'?s? theorem\b|\bFundamental Theorem of Calculus\b/i;
for (const f of files) {
  if (path.basename(f, '.mdx') !== 'l7') continue;
  const box = fs.readFileSync(f, 'utf8').match(/<WhereThisGoes[\s\S]*?<\/WhereThisGoes>/)?.[0];
  if (!box) continue;
  const rel = path.relative(ROOT, f);
  const late = box.match(LOOKAHEAD_LATE);
  if (late) {
    warn(rel, `look-ahead box leans on late-BC material ("${late[0]}") — use early calculus, which they meet in the first weeks`);
  }
  const named = box.match(LOOKAHEAD_NAMED);
  if (named) {
    warn(rel, `look-ahead box names "${named[0]}" — say what it claims instead; the reader has not met it`);
  }
  // Bare initialisms are worse than the full name: IVT, FTC and MVT are what
  // you write for someone who already knows the theorem.
  const abbrev = box.match(/\b(IVT|MVT|EVT|FTC|LHS|RHS|WLOG|iff\b)\b/);
  if (abbrev) {
    warn(rel, `look-ahead box uses the abbreviation "${abbrev[0]}" — write it out; the reader has never seen it`);
  }
}

// ---------------------------------------------------------------------------
// Titles: the .mdx frontmatter and _module.json must agree, and neither may use
// school vocabulary from a later grade than the level's ceiling.
//
// The two had drifted apart in 20 places, and since _module.json is what the
// page renders, readers were getting the *stale* one: "Adding two √2s" at grade
// 2, "The rationals are a field" at grade 5. The .mdx titles were the
// grade-tuned ones and nobody could see them.
//
// A title naming the thing its own module defines is fine — §7.1 "What is an
// axiom?" is the question the module answers. What this catches is a title
// leaning on ordinary school mathematics the reader has not reached.
const TITLE_VOCAB = [
  [/\bfractions?\b/i, 'l3'],        // 3.NF
  [/\bdivide|division\b/i, 'l3'],   // 3.OA
  [/\bodd|even\b/i, 'l2'],          // 2.OA.C.3
  [/\bdecimals?\b/i, 'l3'],         // 4.NF.C
  [/\bnegative\b/i, 'l4'],          // 6.NS.C.5
  [/\bintegers?\b/i, 'l4'],         // 6.NS
  [/\bdivisibility|divisor\b/i, 'l4'],
  [/√|\bsquare root\b/i, 'l5'],     // 8.EE.A.2
  [/\brationals?\b/i, 'l4'],      // 7.NS.A — rational arithmetic is grade 7
  [/\birrationals?\b/i, 'l5'],    // 8.NS.A.1
  [/\bpolynomial|quadratic|algebra\b/i, 'l5'],
];
for (const f of files) {
  const level = path.basename(f, '.mdx');
  if (!LEVEL_ORDER.includes(level)) continue;
  const rel = path.relative(ROOT, f);
  const dir = path.dirname(f);
  const contractPath = path.join(dir, '_module.json');
  if (!fs.existsSync(contractPath)) continue;
  const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
  const declared = contract.titles?.[level];
  const fm = fs.readFileSync(f, 'utf8').match(/^title:\s*(.*)$/m)?.[1]?.trim().replace(/^"|"$/g, '');
  if (declared && fm && declared !== fm) {
    err(rel, `title disagrees with _module.json: "${fm}" vs "${declared}" (the JSON is what renders)`);
  }
  for (const [re, from] of TITLE_VOCAB) {
    if (rank(level) >= rank(from)) continue;
    const m = declared?.match(re);
    if (!m) continue;
    // A module whose whole subject is the word may name it — §4.7 is where
    // irrational numbers and square roots are met, so its title may say so.
    // The slug spells some of them differently ("sqrt2"), hence the aliases.
    const slug = path.basename(dir).toLowerCase();
    const stem = m[0].toLowerCase().replace(/s$/, '');
    const alias = { 'square root': 'sqrt', '√': 'sqrt' }[stem] ?? stem;
    if (slug.includes(stem) || slug.includes(alias)) continue;
    warn(rel, `title "${declared}" uses "${m[0]}", which is not taught until ${from}`);
  }
}

// ---------------------------------------------------------------------------
// A notation gloss must have a *symbol* on its left. Bulk substitution of
// blackboard-bold letters for their names once rewrote the very sentences that
// introduce them, producing "the integers reads the integers" in seven files —
// each still grammatical, so nothing else caught it. This is the third time a
// regex over LaTeX has damaged prose; the KaTeX guard catches invalid commands,
// and this catches destroyed explanations. Matching only the number-system
// names keeps it exact: "reads" is an ordinary verb everywhere else.
const SYSTEM_NAMES =
  /\b(the (real numbers|reals|integers|rationals|counting numbers|natural numbers|complex numbers))\s+(reads|denotes|is read|means)\b/i;
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const m = src.match(SYSTEM_NAMES);
  if (m) {
    err(
      path.relative(ROOT, f),
      `"${m[0]}" glosses a name with itself — the gloss has lost its symbol`,
    );
  }
}

// ---------------------------------------------------------------------------
// Notation density in the first two chapters. A reader arriving at Chapter 1 has
// taken no logic or discrete-maths course, so every symbol is new at once —
// explaining each one repeatedly is necessary but not sufficient, because the
// page can still be unreadably dense. Chapters 1 and 2 therefore carry a cap;
// from Chapter 3 on the reader has had time and the cap lifts.
//
// Symbols inside <TruthTable> and other components are excluded: they are the
// rendered object under discussion, not prose the reader must parse.
const DENSITY_SYMBOLS =
  /\\neg|¬|\\wedge|∧|\\vee(?!r)|∨|\\equiv|≡|\\Rightarrow|⇒|\\Leftrightarrow|⇔|\\iff|\\forall|∀|\\exists|∃|\\in\b|∈|\\emptyset|∅|\\subseteq|⊆|\\cup\b|∪|\\cap\b|∩|\\mathbb\{[NZQRC]\}|[ℕℤℚℝℂ]/g;
// Absolute symbol density, capped near each level's 90th percentile. Earlier
// versions tried to excuse a chapter for its "own" symbols, which let §2.8 sit
// at 168 per 1000 — a symbol every six words — on the grounds that ∪ and ∩ were
// Chapter 2's business. But thickness is thickness: established vocabulary is
// not hard to *understand*, and a page solid with it is still hard to *read*.
// So nothing is exempted, and the cap is set where it flags real outliers.
const DENSITY_CAP = { l4: 110, l5: 95, l6: 90, l7: 105, l8: 130 };
for (const f of files) {
  const level = path.basename(f, '.mdx');
  const rel = path.relative(ROOT, f);
  if (rank(level) < rank('l4')) continue; // l1–l3 are governed by the notation gate
  const cap = DENSITY_CAP[level];
  if (!cap) continue;
  // <Proof> blocks are excluded: inside a proof the symbols *are* the medium,
  // and element-chasing cannot be de-symbolised without becoming worse. What
  // this measures is the exposition around the proofs — the part a reader has
  // to get through before they can even start on the argument.
  const raw = fs.readFileSync(f, 'utf8').replace(/<Proof[\s\S]*?<\/Proof>/g, '');
  const text = body(raw);
  const words = text.replace(/[^A-Za-z ]/g, ' ').split(/\s+/).filter(Boolean).length;
  const symbols = (text.match(DENSITY_SYMBOLS) ?? []).length;
  const per1000 = Math.round((1000 * symbols) / Math.max(words, 1));
  if (per1000 > cap) {
    warn(rel, `${per1000} proof symbols per 1000 words (cap ${cap} at ${level}) — say more of it in words`);
  }
}

// ---------------------------------------------------------------------------
// Heavier synonyms for things the course can say plainly. The audience is every
// student, not only the ones already drawn to mathematics, so a Latin or Greek
// name earns its place only when it is genuinely the key vocabulary of a module
// — contrapositive, quantifier, tautology and the like are declared in
// `newTerms` and explained there. These are not.
const HEAVIER_SYNONYM = [
  [/\buniversal quantifier\b/i, 'say "the *for all* quantifier"'],
  [/\bexistential quantifier\b/i, 'say "the *there exists* quantifier"'],
  [/\buniversally quantified\b/i, 'say "made about every element"'],
  [/\bexistentially quantified\b/i, 'say "asserting that something exists"'],
  [/\btrichotomy\b/i, 'state the three-way split instead'],
  [/\bcanonical\b/i, 'say "standard" or "natural"'],
  [/\bantecedent\b/i, 'say "hypothesis"'],
  [/\bconsequent\b/i, 'say "conclusion"'],
  [/\bmetalanguage\b|\bobject language\b/i, 'say it plainly'],
  [/\bPythagoras\b/, 'call it "the Pythagorean theorem"'],
];
for (const f of files) {
  const src = body(fs.readFileSync(f, 'utf8'));
  const rel = path.relative(ROOT, f);
  for (const [re, advice] of HEAVIER_SYNONYM) {
    const m = src.match(re);
    if (!m) continue;
    // Naming the heavier word *alongside* the plain one is teaching it, not
    // leaning on it — "the hypothesis, or antecedent" is fine.
    const near = src.slice(Math.max(0, m.index - 160), m.index + 160);
    if (/hypothesis|conclusion|standard|natural|Pythagorean|three-way|for all|there exists|plainly/i.test(near)) continue;
    warn(rel, `"${m[0]}" is heavier than it needs to be — ${advice}`);
  }
}

// ---------------------------------------------------------------------------
// Proof-course vocabulary may not be used before the module that defines it.
// A signposted forward reference is fine — "§1.10 will call these quantifiers",
// "when you meet injective" — but assumed use is not, because the reader has
// taken no logic or discrete-maths course and has nowhere else to have met it.
// Ordinary school words are deliberately absent from this list: prime and factor
// are 4.OA.B.4, rational and irrational are 8.NS.A.1, and "two lines intersect"
// is plain geometry, so none of them is a forward reference.
const VOCAB_HOME = {
  tautolog: 103, conjunction: 103, disjunction: 103, vacuous: 103,
  contrapositive: 107, converse: 107, biconditional: 109,
  quantifier: 110, counterexample: 111, witness: 112,
  codomain: 301, injectiv: 305, surjectiv: 306, bijectiv: 308,
  ring: 401, field: 405, 'equivalence relation': 702,
};
const SIGNPOSTED =
  /§\d|modules? \d|chapters? \d|\(\d\.\d+\)|later|preview\w*|introduced|coming|ahead|for now|soon|you have not|will (meet|see|call|be|define|use|show)|when you meet/i;
{
  const modKey = (p) => {
    const m = p.match(/(\d+)-[^/]+\/(\d+)-/);
    return m ? Number(m[1]) * 100 + Number(m[2]) : 0;
  };
  for (const level of LEVEL_ORDER) {
    const pages = files
      .filter((f) => path.basename(f, '.mdx') === level)
      .sort((a, b) => modKey(a) - modKey(b));
    for (const [term, home] of Object.entries(VOCAB_HOME)) {
      const re = new RegExp(`\\b${term}${/[a-z]$/.test(term) ? '(s|es)?\\b' : ''}`, 'i');
      for (const f of pages) {
        if (modKey(f) >= home) break;
        // Component props are data, not prose.
        const src = fs.readFileSync(f, 'utf8').replace(/<[A-Z][^>]*>/g, '');
        const m = src.match(re);
        if (!m) continue;
        const pStart = src.lastIndexOf('\n\n', m.index) + 1;
        const pEnd = src.indexOf('\n\n', m.index);
        const after = pEnd < 0 ? src.length : src.indexOf('\n\n', pEnd + 2);
        const para = src.slice(pStart, after < 0 ? src.length : after);
        // A bolded definitional introduction defines it on the spot.
        if (SIGNPOSTED.test(para) || new RegExp(`\\*\\*[^*]*${term}`, 'i').test(para)) break;
        warn(
          path.relative(ROOT, f),
          `${level} uses "${m[0]}" at §${Math.floor(modKey(f) / 100)}.${modKey(f) % 100}, before §${Math.floor(home / 100)}.${home % 100} defines it — signpost it or gloss it`,
        );
        break;
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Headings, callout titles and card captions carry no proof notation, ever.
// A heading is read *before* the body that introduces the symbol, and
// `anchorExample` is shown on navigation cards outside the reading flow
// altogether — so the positional introduction rule cannot protect either one.
// They say the same thing in words instead.
const HEADING_NOTATION = /∀|∃|⇒|⇔|¬|∧|∨|∈|∉|⊆|∪|∩|∅|≡|∘|↦|Σ|∫|∤|ℕ|ℤ|ℚ|ℝ|ℂ|\\forall|\\exists|\\Rightarrow|\\Leftrightarrow|\\iff|\\neg|\\wedge|\\vee(?!r)|\\subseteq|\\cup\b|\\cap\b|\\emptyset|\\equiv|\\circ\b|\\mapsto|\\sum\b|\\mathbb/;
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const rel = path.relative(ROOT, f);
  const spots = [];
  for (const m of src.matchAll(/^(#{2,4} .*)$/gm)) spots.push(['heading', m[1]]);
  for (const m of src.matchAll(/^(anchorExample:.*)$/gm)) spots.push(['card caption', m[1]]);
  for (const m of src.matchAll(/title="([^"]*)"/g)) spots.push(['callout title', m[1]]);
  for (const [kind, textLine] of spots) {
    if (HEADING_NOTATION.test(textLine)) {
      err(rel, `${kind} carries proof notation — say it in words: "${textLine.trim().slice(0, 70)}"`);
    }
  }
}

// ---------------------------------------------------------------------------
// Trigonometry, base e and logarithms, gated by §A5.0 rule 1.
//   right-triangle trig  G-SRT.C.6   Geometry, grade 9   → from l6
//   unit circle, radians F-TF        Algebra II, gr 10   → from l6 (l6 has Geometry)
//   base e, logarithms   F-LE.A.4    Algebra II, gr 10   → from l7 (l6 is *taking* it)
// Chapter 5 is the standing exception: the complex plane, modulus, polar form and
// Euler's formula cannot be written without them, and Part B assigns those modules
// at every level. There they must be presented as named, glossed destinations —
// the way §5.6 now teaches the right-triangle rule at l3 instead of citing
// Pythagoras. Everywhere else they are a convenience with an easy substitute,
// which is what this check removes.
const CH5 = /05-complex\/0[6-9]-/;
const GRADED_CONCEPTS = [
  // Ordinary school mathematics from a later grade. No glimpse exemption: an
  // Aside full of trigonometry at l3 is still trigonometry.
  { name: 'trigonometry', from: 'l6', re: /\\cos|\\sin\b|\\tan\b|\\theta|trigonometr|\bradians?\b/ },
  { name: 'base e / logarithms', from: 'l7', re: /\be\^|\\exp\b|\\ln\b|\\log|\blogarithm/ },
  // Genuine destinations, so §A4.1a's sanctioned glimpse slot applies: they may
  // be named and glossed inside an <Aside> or <WhereThisGoes>, never used as
  // working vocabulary in the body.
  { name: 'matrices and vectors', from: 'l7', glimpseOK: true,
    re: /\\begin\{[bp]matrix|\bmatri(x|ces)\b|\bdeterminant/ },
  { name: 'calculus', from: 'l7', glimpseOK: true,
    re: /\\lim\b|\bderivativ|\\frac\{d\}\{d|\bantiderivativ|\bRiemann sum/ },
];
// §6.6 is "Induction in calculus" — its subject is the exception, as Chapter 5's is.
const OWN_SUBJECT = /06-induction\/06-/;
for (const f of files) {
  const level = path.basename(f, '.mdx');
  if (!LEVEL_ORDER.includes(level) || level === 'l8') continue;
  const rel = path.relative(ROOT, f);
  if (CH5.test(rel)) continue;
  const full = body(fs.readFileSync(f, 'utf8'));
  const outsideGlimpse = full
    .replace(/<Aside[\s\S]*?<\/Aside>/g, '')
    .replace(/<WhereThisGoes[\s\S]*?<\/WhereThisGoes>/g, '');
  for (const { name, from, re, glimpseOK } of GRADED_CONCEPTS) {
    if (rank(level) >= rank(from)) continue;
    if (glimpseOK && OWN_SUBJECT.test(rel)) continue;
    const hay = glimpseOK ? outsideGlimpse : full;
    const m = hay.match(re);
    if (!m) continue;
    // A destination named *and glossed* in the body is fine — the same standard
    // the named-results check applies. "Square grids of numbers, called
    // matrices in Algebra II" assumes nothing; a bare "matrices" does.
    if (glimpseOK) {
      const pStart = hay.lastIndexOf('\n\n', m.index) + 1;
      const pEnd = hay.indexOf('\n\n', m.index);
      const para = hay.slice(pStart, pEnd < 0 ? hay.length : pEnd);
      if (/\b(called|which|rows and columns|grids? of numbers|Algebra II|Precalculus|later|you will meet|introduces|a tool from)\b/i.test(para)) continue;
    }
    warn(rel, `${level} uses ${name} ("${m[0]}") — not available until ${from} (§A5.0 rule 1)`);
  }
}

// ---------------------------------------------------------------------------
// Named results no American school course teaches. A reader may meet these —
// they are some of the best stories in mathematics — but never as something
// assumed. Every mention must say what the result actually claims, because
// "by well-ordering" is not an argument to someone who has never heard of it.
//
// Results that ARE taught (Pythagoras, the quadratic formula, the Mean Value
// Theorem) are handled by the grade-ceiling checks instead; this list is only
// for the ones that appear in no K-12 standard at all.
const UNTAUGHT_RESULTS = [
  ['well-ordering', /\bwell[- ]ordering\b/i],
  ['Gödel', /\bGödel\b/],
  ["Bézout", /\bBézout\b/],
  ['Twin Prime', /\btwin prime/i],
  ['Goldbach', /\bGoldbach\b/],
  ["Fermat's Last Theorem", /\bFermat's Last Theorem\b/],
  ["Euclid's lemma", /\bEuclid's lemma\b/i],
  ["Cantor's theorem", /\bCantor's theorem\b/i],
  ["Russell's paradox", /\bRussell's paradox\b/i],
  ["Pólya's conjecture", /\bPólya\b/],
  ["Zorn's lemma", /\bZorn\b/],
  ['Chinese Remainder', /\bChinese Remainder\b/i],
];
// Wording that counts as saying what the result claims. A statement, not a
// biography: "proved in 1994" tells the reader nothing about what was proved.
// `\b` before `—` or `:` can never match (both sides are non-word characters),
// so those two alternatives sat dead in an earlier version and every "Name: the
// statement" gloss was reported as bare.
const STATES_IT = /\b(says?|states?|asserts?|claims?|that|which|if|there (is|are|exists?)|every|each|all|any|no)\b|—|:/i;
{
  const modKey = (p) => {
    const m = p.match(/(\d+)-[^/]+\/(\d+)-/);
    return m ? Number(m[1]) * 100 + Number(m[2]) : 0;
  };
  for (const level of ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8']) {
    const pages = files
      .filter((f) => path.basename(f, '.mdx') === level)
      .sort((a, b) => modKey(a) - modKey(b));
    for (const [name, re] of UNTAUGHT_RESULTS) {
      for (const f of pages) {
        // Bullet items are their own units: a list of conjectures where only
        // the first is glossed must not be excused by its neighbours.
        const prose = body(fs.readFileSync(f, 'utf8')).replace(/\n(\s*[-*]\s)/g, '\n\n$1');
        const m = prose.match(re);
        if (!m) continue;
        // Judge the sentence it lands in, plus the one after — a result is often
        // named and then stated in the next breath.
        const i = m.index;
        // Scope: the paragraph the name lands in. A gloss may precede the name
        // ("…never a cube. That guess is called Fermat's Last Theorem") as
        // easily as follow it, but it does not cross a paragraph break — and a
        // name dropped into a paragraph that nowhere states the result is
        // exactly the failure this check exists for. A fixed character window
        // was tried first and passed bare mentions whose *neighbours* happened
        // to contain a colon.
        const pStart = prose.lastIndexOf('\n\n', i) + 1;
        const pEnd = prose.indexOf('\n\n', i);
        const scope = prose.slice(pStart, pEnd < 0 ? prose.length : pEnd);
        if (!STATES_IT.test(scope)) {
          warn(
            path.relative(ROOT, f),
            `${level} names "${name}" without saying what it claims — no school course teaches it`,
          );
        }
        break; // first mention per level is the one that must carry the gloss
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Function notation. CCSSM introduces f(x) at F-IF.A.2, an Algebra I standard,
// and grade 8 explicitly does not require it (8.F.A.1). So l5 and up may use it
// freely; l3 (grade 5) and l4 (ceiling grade 7) must introduce it before use.
{
  const FN = /(?:^|[^A-Za-z\\])([fgphq])\s*\(\s*[a-z0-9]/;
  const FN_INTRO = /\b(f\(x\)|function notation|writ(e|es|ing|ten)|read|reads|means?|notation|stands? for|denot\w*)\b/i;
  const modKey = (p) => {
    const m = p.match(/(\d+)-[^/]+\/(\d+)-/);
    return m ? Number(m[1]) * 100 + Number(m[2]) : 0;
  };
  for (const level of ['l3', 'l4']) {
    const pages = files
      .filter((f) => path.basename(f, '.mdx') === level)
      .sort((a, b) => modKey(a) - modKey(b));
    let seenInFunctions = 0;
    for (const f of pages) {
      const b = body(fs.readFileSync(f, 'utf8'));
      const paras = b.split(/\n\s*\n/);
      const at = paras.findIndex((p) => FN.test(p));
      if (at < 0) continue;
      const scope = paras.slice(Math.max(0, at - 1), at + 2).join('\n\n');
      if (!FN_INTRO.test(scope)) {
        warn(
          path.relative(ROOT, f),
          `${level} uses function notation "${paras[at].match(FN)[1]}(…)" before introducing it — not taught until Algebra I (F-IF.A.2)`,
        );
      }
      // Every module, not just the first: f(x) is not working vocabulary at
      // these levels, so each page that reaches for it has to earn it again.
      // Chapter 3 is the exception — functions are its subject, so it earns the
      // notation once in §3.1 and then re-glosses it on the next few pages,
      // which is the "first few uses" rule rather than every page forever.
      if (/03-functions/.test(f)) { seenInFunctions += 1; if (seenInFunctions >= 3) break; }
    }
  }
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
    // A kernel is the one-sentence takeaway, so it gets no glimpse-block
    // exemption: destination vocabulary belongs in an Aside, not here. Found
    // after l6 kernels turned out to read as *more* advanced than l7's —
    // "distributive lattice", "anti-homomorphism", "field automorphism" — which
    // is a level inversion in the thing readers see first.
    for (const l of ['l1','l2','l3','l4','l5','l6','l7']) {
      const k = j.kernels?.[l];
      if (!k) continue;
      const found = [...new Set(L7_OFF_GRADE.map((re) => k.match(re)?.[0]).filter(Boolean))];
      if (found.length) {
        warn(rel, `kernels.${l} uses off-grade vocabulary (§A4.1): ${found.join(', ')}`);
      }
    }
  }
}

console.log(`\n${errors} error(s), ${warnings} warning(s).`);
process.exit(errors > 0 ? 1 : 0);
