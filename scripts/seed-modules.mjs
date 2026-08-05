// Seed all 61 _module.json contracts from Part B of the plan.
// Run: node scripts/seed-modules.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CHAPTERS = path.join(ROOT, 'content', 'chapters');

const LEVELS = ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8'];

// Anchor examples per chapter, applied unless a module overrides.
const CHAPTER_ANCHOR = {
  '01-logic': 'Rain and umbrellas; "it\'s a dog"',
  '02-sets': 'The toy box',
  '03-functions': 'The name tag machine',
  '04-numbers': 'Sharing cookies evenly',
  '05-complex': 'Turning a quarter turn',
  '06-induction': 'A line of dominoes',
  '07-peano': 'Counting on forever',
};

function titles(t) {
  // Broadcast one title across all levels, allowing per-level overrides.
  if (typeof t === 'string') {
    return Object.fromEntries(LEVELS.map((l) => [l, t]));
  }
  const out = {};
  let last = t.default ?? Object.values(t)[0];
  for (const l of LEVELS) {
    if (t[l]) last = t[l];
    out[l] = last;
  }
  return out;
}

function treatment(spec) {
  // Compact spec like {l1: 'touch'} means the rest are 'core'.
  const out = {};
  for (const l of LEVELS) out[l] = spec[l] ?? 'core';
  return out;
}

const MODULES = [
  // ---- Chapter 1 : Logic ----
  {
    chapter: '01-logic',
    slug: '01-what-is-a-claim',
    id: '1.1',
    order: 1,
    titles: titles({
      l1: 'True or silly',
      l2: 'Tellings',
      l3: 'Statements',
      l4: 'What is a statement?',
      default: 'What is a statement?',
    }),
    kernel:
      'A statement is a sentence that is either true or false; questions, commands, and fragments are not. You do not need to know which it is for it to be a statement.',
    objectives: [
      'Sort sentences into statements and non-statements',
      'Give an example of each',
      'Recognize that some statements have unknown truth value (conjectures)',
    ],
    sourceRef: 'Math 0 §1.1',
    vocabulary: ['statement', 'truth value', 'conjecture'],
    prerequisites: [],
    treatment: treatment({}),
    namedMove: null,
  },
  {
    chapter: '01-logic',
    slug: '02-not',
    id: '1.2',
    order: 2,
    titles: titles({
      l1: 'The opposite',
      l2: 'Saying the opposite',
      l3: 'Opposites: negation',
      l4: 'Negation',
      default: 'Negation',
    }),
    kernel:
      'Negation flips truth value. A statement and its negation are never both true and never both false.',
    objectives: [
      'Produce the negation of a claim',
      'State that exactly one of p and ¬p is true',
    ],
    sourceRef: 'Math 0 §1.1.1',
    vocabulary: ['negation', 'opposite', 'truth value'],
    prerequisites: ['1.1'],
    treatment: treatment({}),
    namedMove: 'the opposite',
  },
  {
    chapter: '01-logic',
    slug: '03-and-or',
    id: '1.3',
    order: 3,
    titles: titles({
      l1: 'And, or',
      l2: 'Two things at once',
      l3: 'And, or',
      default: 'And, or',
    }),
    kernel:
      '"p and q" is true only when both are; "p or q" is true when at least one is (inclusive or). A statement always false is a contradiction; always true, a tautology.',
    objectives: [
      'Evaluate compound claims',
      'State that mathematical or includes both',
      'Give an example of a contradiction and a tautology',
    ],
    sourceRef: 'Math 0 §1.1.2',
    vocabulary: ['and', 'or', 'contradiction', 'tautology'],
    prerequisites: ['1.2'],
    treatment: treatment({}),
    namedMove: null,
  },
  {
    chapter: '01-logic',
    slug: '04-de-morgan-logic',
    id: '1.4',
    order: 4,
    titles: titles({
      l1: 'Not both',
      l2: 'Crossing out an AND',
      l3: "De Morgan's laws",
      default: "De Morgan's logic laws",
    }),
    kernel:
      '¬(p ∧ q) is the same as ¬p ∨ ¬q, and ¬(p ∨ q) is the same as ¬p ∧ ¬q. Negation swaps and with or.',
    objectives: [
      'Negate a compound statement correctly',
      'Explain why the connective flips',
    ],
    sourceRef: 'Math 0 §1.1.3',
    vocabulary: ['logically equivalent'],
    prerequisites: ['1.2', '1.3'],
    treatment: treatment({ l1: 'touch' }),
    namedMove: null,
  },
  {
    chapter: '01-logic',
    slug: '05-if-then',
    id: '1.5',
    order: 5,
    titles: titles({
      l1: 'A promise',
      l2: 'Keeping a promise',
      l3: 'If–then',
      l4: 'If–then and vacuous truth',
      default: 'If–then',
    }),
    kernel:
      '"If p then q" claims only that q holds whenever p does. It is false only when p is true and q is false, so it is automatically true when p is false — this is vacuous truth.',
    objectives: [
      'Identify hypothesis and conclusion',
      'Determine the truth of a conditional in all four cases',
      'Explain vacuous truth without discomfort',
    ],
    sourceRef: 'Math 0 §1.1.4',
    vocabulary: ['conditional', 'hypothesis', 'conclusion', 'vacuously true'],
    prerequisites: ['1.3'],
    treatment: treatment({}),
    namedMove: null,
  },
  {
    chapter: '01-logic',
    slug: '06-your-first-proof',
    id: '1.6',
    order: 6,
    titles: titles({
      l1: 'Show me how you know',
      l2: 'A reason chain',
      l3: 'Your first proof',
      default: 'Your first proof',
    }),
    kernel:
      'To prove "if p then q", assume p and reason to q using facts already established. A proof is written in full sentences.',
    objectives: [
      'Recognize the Discussion/Proof structure',
      'Write a two- to three-step direct argument',
      'Recognize the end-of-proof marker',
    ],
    sourceRef: 'Math 0 §1.1.5',
    vocabulary: ['proof', 'Discussion', 'direct proof'],
    prerequisites: ['1.5'],
    treatment: treatment({ l1: 'touch' }),
    namedMove: "start from what you're given",
  },
  {
    chapter: '01-logic',
    slug: '07-converse-inverse-contrapositive',
    id: '1.7',
    order: 7,
    titles: titles({
      l1: 'Flipping a promise',
      l2: 'Turning it around',
      l3: 'Converse, inverse, contrapositive',
      default: 'Converse, inverse, contrapositive',
    }),
    kernel:
      'From p ⇒ q you can form q ⇒ p (converse), ¬p ⇒ ¬q (inverse), and ¬q ⇒ ¬p (contrapositive). Only the contrapositive is logically equivalent to the original.',
    objectives: [
      'Build all three from a given conditional',
      'Give a counterexample showing converse and inverse can fail',
      'State the equivalence of the contrapositive',
    ],
    sourceRef: 'Math 0 §1.2, §1.2.1, §1.2.2',
    vocabulary: ['converse', 'inverse', 'contrapositive'],
    prerequisites: ['1.5'],
    treatment: treatment({ l1: 'touch' }),
    namedMove: 'flip it around',
  },
  {
    chapter: '01-logic',
    slug: '08-proof-by-contrapositive',
    id: '1.8',
    order: 8,
    titles: titles({
      l1: 'Backwards check',
      l2: 'The easier way round',
      l3: 'Proof by contrapositive',
      default: 'Proof by contrapositive',
    }),
    kernel:
      'Proving ¬q ⇒ ¬p proves p ⇒ q. Choose it when the hypothesis you are handed is awkward to compute with.',
    objectives: [
      'Decide when the contrapositive is easier',
      'Write a proof that announces the switch and completes it',
    ],
    sourceRef: 'Math 0 §1.2.3',
    vocabulary: ['proof by contrapositive'],
    prerequisites: ['1.6', '1.7'],
    treatment: treatment({ l1: 'touch', l2: 'touch' }),
    namedMove: 'flip it around',
  },
  {
    chapter: '01-logic',
    slug: '09-if-and-only-if',
    id: '1.9',
    order: 9,
    titles: titles({
      l1: 'Both promises',
      l2: 'Two promises in one',
      l3: 'If and only if',
      default: 'If and only if',
    }),
    kernel:
      'p ⇔ q means both p ⇒ q and q ⇒ p. Proving it means writing two proofs.',
    objectives: [
      'Split a biconditional into its two halves',
      'Prove both directions, using a contrapositive for one where useful',
    ],
    sourceRef: 'Math 0 §1.2.4',
    vocabulary: ['biconditional', 'if and only if'],
    prerequisites: ['1.5', '1.8'],
    treatment: treatment({ l1: 'touch' }),
    namedMove: 'check both boxes',
  },
  {
    chapter: '01-logic',
    slug: '10-for-all-there-exists',
    id: '1.10',
    order: 10,
    titles: titles({
      l1: 'Every and some',
      l2: 'All, some, exactly one',
      l3: 'For all, there exists',
      default: 'For all, there exists',
    }),
    kernel:
      '"For all" claims something about every case; "there exists" claims at least one case. "There exists exactly one" claims existence and uniqueness.',
    objectives: [
      'Classify a claim as universal or existential',
      'State what evidence each demands',
    ],
    sourceRef: 'Math 0 §1.3.1, §1.3.2',
    vocabulary: ['for all', 'there exists', 'unique', 'quantifier'],
    prerequisites: ['1.1'],
    treatment: treatment({}),
    namedMove: null,
  },
  {
    chapter: '01-logic',
    slug: '11-negating-quantifiers',
    id: '1.11',
    order: 11,
    titles: titles({
      l1: 'One bad apple',
      l2: 'Finding one that breaks the rule',
      l3: 'Negating quantifiers and counterexamples',
      default: 'Negating quantifiers and counterexamples',
    }),
    kernel:
      '¬(∀x p(x)) is the same as ∃x ¬p(x), and ¬(∃x p(x)) is the same as ∀x ¬p(x). A single counterexample destroys a universal claim.',
    objectives: [
      'Negate quantified statements',
      'Produce a counterexample to a false universal claim',
    ],
    sourceRef: 'Math 0 §1.3.3',
    vocabulary: ['counterexample'],
    prerequisites: ['1.10'],
    treatment: treatment({}),
    namedMove: 'one bad apple',
  },
  {
    chapter: '01-logic',
    slug: '12-proving-quantified-statements',
    id: '1.12',
    order: 12,
    titles: titles({
      l1: 'Four ways to be right or wrong',
      l2: 'The four cases',
      l3: 'Proving and disproving quantified statements',
      default: 'Proving and disproving quantified statements',
    }),
    kernel:
      'Prove ∀ by arguing about an arbitrary element; disprove ∀ with one counterexample. Prove ∃ by exhibiting a witness; disprove ∃ by proving the universal negation. Prove ∃! by exhibiting and then showing any two candidates coincide.',
    objectives: [
      'Choose the right strategy for each of four cases',
      'Write an arbitrary-element proof',
      'Write a uniqueness argument',
    ],
    sourceRef: 'Math 0 §1.3.4',
    vocabulary: ['proof by cases', 'arbitrary element', 'witness'],
    prerequisites: ['1.10', '1.11'],
    treatment: treatment({ l1: 'touch' }),
    namedMove: 'split into cases',
  },

  // ---- Chapter 2 : Sets ----
  {
    chapter: '02-sets',
    slug: '01-what-is-a-set',
    id: '2.1',
    order: 1,
    titles: titles({
      l1: 'The toy box',
      l2: 'Boxes of things',
      l3: 'What is a set?',
      default: 'What is a set?',
    }),
    kernel:
      'A set is a well-defined collection; x ∈ S says x belongs. Sets are unordered and repetition is irrelevant. The empty set is a set. ℕ, ℤ, ℝ are the standard number sets.',
    objectives: [
      'Decide whether a collection is well-defined',
      'Use ∈ and ∉',
      'State that {a,b,c} = {b,c,a}',
      'Name ℕ, ℤ, ℝ',
    ],
    sourceRef: 'Math 0 §2.1, §2.1.1',
    vocabulary: ['set', 'element', 'empty set', 'well-defined'],
    prerequisites: [],
    treatment: treatment({}),
    namedMove: null,
  },
  {
    chapter: '02-sets',
    slug: '02-set-builder',
    id: '2.2',
    order: 2,
    titles: titles({
      l1: 'A box by a rule',
      l2: 'Rule-boxes and list-boxes',
      l3: 'Set-builder notation',
      default: 'Set-builder notation',
    }),
    kernel:
      '{x | p(x)} is the set of all x making p(x) true — a set defined by a condition rather than a list.',
    objectives: [
      'Read and write set-builder notation',
      'Translate between listed sets, conditions, and intervals',
    ],
    sourceRef: 'Math 0 §2.1.2',
    vocabulary: ['set-builder', 'interval'],
    prerequisites: ['2.1', '1.1'],
    treatment: treatment({ l1: 'touch' }),
    namedMove: null,
  },
  {
    chapter: '02-sets',
    slug: '03-subsets',
    id: '2.3',
    order: 3,
    titles: titles({
      l1: 'A box inside a box',
      l2: 'Part of a box',
      l3: 'Subsets',
      default: 'Subsets',
    }),
    kernel:
      'A ⊆ S means every element of A is in S. To prove it, take an arbitrary x ∈ A and show x ∈ S. ∅ is a subset of everything (vacuously). Subset is transitive.',
    objectives: [
      'Decide subset relations',
      'Write an element-chasing subset proof',
      'Explain why ∅ ⊆ S',
    ],
    sourceRef: 'Math 0 §2.1.3, §2.1.4',
    vocabulary: ['subset', 'proper subset', 'transitive'],
    prerequisites: ['2.1'],
    treatment: treatment({}),
    namedMove: 'take any one and follow it',
  },
  {
    chapter: '02-sets',
    slug: '04-union-intersection',
    id: '2.4',
    order: 4,
    titles: titles({
      l1: 'Two hoops',
      l2: 'Venn diagrams',
      l3: 'Union and intersection',
      default: 'Union and intersection',
    }),
    kernel:
      'S ∪ T holds anything in at least one; S ∩ T holds things in both. S ⊆ S∪T and S∩T ⊆ S always. Disjoint means empty intersection.',
    objectives: [
      'Compute unions and intersections',
      'Connect ∪/∩ to or/and',
      'Recognize gcd and lcm as intersection phenomena',
    ],
    sourceRef: 'Math 0 §2.1.5',
    vocabulary: ['union', 'intersection', 'disjoint'],
    prerequisites: ['2.1', '1.3'],
    treatment: treatment({}),
    namedMove: null,
  },
  {
    chapter: '02-sets',
    slug: '05-complements',
    id: '2.5',
    order: 5,
    titles: titles({
      l1: 'Not in the box',
      l2: 'Everything else',
      l3: 'Complements and suppose not',
      default: 'Complements and "suppose not"',
    }),
    kernel:
      'The complement of A in S is everything in S not in A — so it depends on S. Proof by contradiction: assume the negation of what you want, derive an impossibility, conclude.',
    objectives: [
      'Compute complements relative to a stated universe',
      'Write a short proof by contradiction',
      'Prove A ⊆ B implies B̄ ⊆ Ā',
    ],
    sourceRef: 'Math 0 §2.1.6',
    vocabulary: ['complement', 'proof by contradiction'],
    prerequisites: ['2.3', '1.2'],
    treatment: treatment({}),
    namedMove: 'suppose not',
  },
  {
    chapter: '02-sets',
    slug: '06-set-equality',
    id: '2.6',
    order: 6,
    titles: titles({
      l1: 'Same stuff',
      l2: 'When two boxes are the same',
      l3: 'Set equality by double inclusion',
      default: 'What it means for two sets to be equal',
    }),
    kernel:
      'S = T is defined as S ⊆ T and T ⊆ S. Every set-equality proof is therefore two proofs. When a hypothesis is an or, split into cases.',
    objectives: [
      'Prove set equality by double inclusion',
      'Use proof by cases inside such a proof',
    ],
    sourceRef: 'Math 0 §2.2',
    vocabulary: ['double inclusion'],
    prerequisites: ['2.3', '1.12'],
    treatment: treatment({ l1: 'touch' }),
    namedMove: 'check both boxes',
  },
  {
    chapter: '02-sets',
    slug: '07-de-morgan-sets',
    id: '2.7',
    order: 7,
    titles: titles({
      l1: 'Outside both hoops',
      l2: 'The outside of overlapping hoops',
      l3: "De Morgan's set laws",
      default: "De Morgan's set laws",
    }),
    kernel:
      'S ∩ T = S̄ ∪ T̄ and S ∪ T = S̄ ∩ T̄. These are the logic laws of 1.4 with ¬ ↔ complement, ∧ ↔ ∩, ∨ ↔ ∪.',
    objectives: [
      'State both laws',
      'Prove one by double inclusion',
      'Articulate the logic/set correspondence',
    ],
    sourceRef: 'Math 0 §2.2.1',
    vocabulary: [],
    prerequisites: ['2.4', '2.5', '2.6', '1.4'],
    treatment: treatment({ l1: 'touch' }),
    namedMove: null,
  },
  {
    chapter: '02-sets',
    slug: '08-distributive-laws',
    id: '2.8',
    order: 8,
    titles: titles({
      l1: 'Three hoops',
      l2: 'Sharing across hoops',
      l3: 'Distributive laws',
      default: 'Distributive laws',
    }),
    kernel:
      'S ∪ (T ∩ R) = (S∪T) ∩ (S∪R) and S ∩ (T ∪ R) = (S∩T) ∪ (S∩R). Unlike arithmetic, distribution works both ways.',
    objectives: [
      'State both laws',
      'Prove one by double inclusion with cases',
      'Contrast with the single distributive law of arithmetic',
    ],
    sourceRef: 'Math 0 §2.2.2',
    vocabulary: ['distributive law'],
    prerequisites: ['2.4', '2.6'],
    treatment: treatment({ l1: 'touch', l2: 'touch' }),
    namedMove: null,
  },
  {
    chapter: '02-sets',
    slug: '09-product-sets',
    id: '2.9',
    order: 9,
    titles: titles({
      l1: 'Outfits',
      l2: 'A grid of choices',
      l3: 'Product sets',
      default: 'Product sets',
    }),
    kernel:
      'S × T is the set of ordered pairs (s,t) with s ∈ S and t ∈ T. Order matters, so S × T ≠ T × S in general. Anything × ∅ is ∅. Products interact cleanly with intersection.',
    objectives: [
      'List a small product',
      'Explain why order matters',
      'Prove (A∩B)×(C∩D) = (A×C)∩(B×D)',
    ],
    sourceRef: 'Math 0 §2.3, §2.3.1, §2.3.2',
    vocabulary: ['ordered pair', 'product set'],
    prerequisites: ['2.1'],
    treatment: treatment({}),
    namedMove: null,
  },

  // ---- Chapter 3 : Functions ----
  {
    chapter: '03-functions',
    slug: '01-what-is-a-function',
    id: '3.1',
    order: 1,
    titles: titles({
      l1: 'The cubby machine',
      l2: 'Arrows from list to list',
      l3: 'What is a function?',
      default: 'What is a function?',
    }),
    kernel:
      'f: S → T assigns to every s ∈ S exactly one f(s) ∈ T. Three conditions: totality (everything gets sent), well-definedness (one output each), and codomain (outputs land in T). S is the domain, T the codomain.',
    objectives: [
      'Test a rule against the three conditions',
      'Identify domain and codomain',
      'Give a non-example of each failure',
    ],
    sourceRef: 'Math 0 §3.1.1',
    vocabulary: ['function', 'domain', 'codomain', 'input', 'output'],
    prerequisites: ['2.2', '2.3'],
    treatment: treatment({}),
    namedMove: null,
  },
  {
    chapter: '03-functions',
    slug: '02-zoo-of-functions',
    id: '3.2',
    order: 2,
    titles: titles({
      l1: 'Different machines',
      l2: 'More than one kind of machine',
      l3: 'A zoo of functions',
      default: 'A zoo of functions',
    }),
    kernel:
      'Functions need not be formulas or numeric. The floor function, Euler\'s totient φ, multiplication ℤ×ℤ → ℤ, and letter-to-position are all functions.',
    objectives: [
      'Evaluate the floor function',
      'Evaluate φ on small inputs',
      'State that a function is a rule, not necessarily an expression',
    ],
    sourceRef: 'Math 0 §3.1.2',
    vocabulary: ['floor', 'totient'],
    prerequisites: ['3.1'],
    treatment: treatment({ l1: 'touch' }),
    namedMove: null,
  },
  {
    chapter: '03-functions',
    slug: '03-images-preimages',
    id: '3.3',
    order: 3,
    titles: titles({
      l1: 'Which cubbies got used?',
      l2: 'Circling and tracing back',
      l3: 'Images and pre-images',
      default: 'Images and pre-images',
    }),
    kernel:
      'Im(f) ⊆ T is the set of outputs actually hit. f⁻¹(U) is the set of inputs landing in U; it may be empty. f⁻¹({t}) ≠ ∅ exactly when t ∈ Im(f). Pre-images exist for any function, invertible or not.',
    objectives: [
      'Compute images and pre-images for given functions',
      'Distinguish codomain from image',
    ],
    sourceRef: 'Math 0 §3.1.3',
    vocabulary: ['image', 'pre-image'],
    prerequisites: ['3.1'],
    treatment: treatment({}),
    namedMove: null,
  },
  {
    chapter: '03-functions',
    slug: '04-preimages-respect-set-ops',
    id: '3.4',
    order: 4,
    titles: titles({
      l1: 'Tracing back two groups',
      l2: 'Tracing back respects the hoops',
      l3: 'Pre-images respect set operations',
      default: 'Pre-images respect set operations',
    }),
    kernel:
      'f⁻¹(Ū) = f⁻¹(U)‾, f⁻¹(U ∪ V) = f⁻¹(U) ∪ f⁻¹(V), and f⁻¹(U ∩ V) = f⁻¹(U) ∩ f⁻¹(V). The pivot in every proof is x ∈ f⁻¹(U) ⇔ f(x) ∈ U.',
    objectives: [
      'Prove one of the three identities by double inclusion',
      'State the pivot equivalence',
    ],
    sourceRef: 'Math 0 §3.1.4',
    vocabulary: [],
    prerequisites: ['3.3', '2.6'],
    treatment: treatment({ l1: 'touch', l2: 'touch' }),
    namedMove: 'take any one and follow it',
  },
  {
    chapter: '03-functions',
    slug: '05-injections',
    id: '3.5',
    order: 5,
    titles: titles({
      l1: 'Nobody shares a cubby',
      l2: 'Arrows that never land together',
      l3: 'One-to-one (injections)',
      default: 'One-to-one (injections)',
    }),
    kernel:
      'f is injective when distinct inputs give distinct outputs; equivalently (contrapositive), f(s₁) = f(s₂) ⇒ s₁ = s₂. Every element of T has at most one pre-image.',
    objectives: [
      'Test a function for injectivity',
      'Write an injectivity proof',
      'Give a counterexample for a non-injective function',
    ],
    sourceRef: 'Math 0 §3.2.1',
    vocabulary: ['injective', 'one-to-one'],
    prerequisites: ['3.1', '1.7'],
    treatment: treatment({}),
    namedMove: null,
  },
  {
    chapter: '03-functions',
    slug: '06-surjections',
    id: '3.6',
    order: 6,
    titles: titles({
      l1: 'Every cubby used',
      l2: 'No arrow lands nowhere',
      l3: 'Onto (surjections)',
      default: 'Onto (surjections)',
    }),
    kernel:
      'f is surjective when Im(f) = T: every t ∈ T has at least one pre-image. Surjectivity depends on the declared codomain.',
    objectives: [
      'Test for surjectivity',
      'Prove a function surjective by producing a pre-image for an arbitrary target',
      'Explain how changing the codomain changes the answer',
    ],
    sourceRef: 'Math 0 §3.2.1',
    vocabulary: ['surjective', 'onto'],
    prerequisites: ['3.1', '3.3'],
    treatment: treatment({}),
    namedMove: null,
  },
  {
    chapter: '03-functions',
    slug: '07-composition',
    id: '3.7',
    order: 7,
    titles: titles({
      l1: 'Two machines in a row',
      l2: 'Machine chains',
      l3: 'Composition',
      default: 'Composition',
    }),
    kernel:
      '(g∘f)(s) = g(f(s)) is defined when f\'s codomain is g\'s domain. Composition preserves injectivity and preserves surjectivity.',
    objectives: [
      'Compose two functions',
      'Prove that the composition of injections is an injection',
      'Prove the same for surjections',
    ],
    sourceRef: 'Math 0 §3.2.2',
    vocabulary: ['composition'],
    prerequisites: ['3.5', '3.6'],
    treatment: treatment({ l1: 'touch' }),
    namedMove: null,
  },
  {
    chapter: '03-functions',
    slug: '08-bijections',
    id: '3.8',
    order: 8,
    titles: titles({
      l1: 'One cubby each, one child each',
      l2: 'Pairing up',
      l3: 'Bijections and size',
      default: 'Bijections and size',
    }),
    kernel:
      'A bijection is both injective and surjective: every t has exactly one pre-image. For finite sets, injection ⇒ |S| ≤ |T|, surjection ⇒ |S| ≥ |T|, bijection ⇒ |S| = |T|. Bijections are how mathematicians compare infinite sets.',
    objectives: [
      'Verify a bijection',
      'Use bijections to compare sizes',
      'State the identity function\'s properties',
    ],
    sourceRef: 'Math 0 §3.3',
    vocabulary: ['bijection', 'identity function'],
    prerequisites: ['3.5', '3.6'],
    treatment: treatment({}),
    namedMove: null,
  },
  {
    chapter: '03-functions',
    slug: '09-inverses',
    id: '3.9',
    order: 9,
    titles: titles({
      l1: 'Putting things back',
      l2: 'Undo-machines',
      l3: 'Inverses',
      default: 'Inverses',
    }),
    kernel:
      'f⁻¹ exists exactly when f is a bijection: surjectivity makes it total, injectivity makes it well-defined. The inverse of a bijection is a bijection, and its inverse is f again.',
    objectives: [
      'Explain why bijectivity is exactly the condition for invertibility',
      'Prove the inverse of a bijection is a bijection',
      'Distinguish the two f⁻¹ notations',
    ],
    sourceRef: 'Math 0 §3.3.1',
    vocabulary: ['inverse function'],
    prerequisites: ['3.8'],
    treatment: treatment({ l1: 'touch' }),
    namedMove: null,
  },

  // ---- Chapter 4 : Numbers ----
  {
    chapter: '04-numbers',
    slug: '01-integers-can-do',
    id: '4.1',
    order: 1,
    titles: titles({
      l1: 'Whole piles stay whole',
      l2: 'Closed',
      l3: 'What the integers can do',
      default: 'What the integers can do',
    }),
    kernel:
      'ℤ is closed under addition, additive inverses, and multiplication, and satisfies the distributive law — this makes it a ring. It is not closed under multiplicative inverses: only 1 and −1 have integer reciprocals.',
    objectives: [
      'State the four closure properties',
      'Demonstrate that 1/3 ∉ ℤ',
      'Explain what "closed" means',
    ],
    sourceRef: 'Math 0 §4.1.1',
    vocabulary: ['closed', 'ring', 'distributive law'],
    prerequisites: ['2.1'],
    treatment: treatment({}),
    namedMove: null,
  },
  {
    chapter: '04-numbers',
    slug: '02-even-odd-divides',
    id: '4.2',
    order: 2,
    titles: titles({
      l1: 'Sharing with a partner',
      l2: 'Even and odd',
      l3: 'Even, odd, and divides',
      default: 'Even, odd, and divides',
    }),
    kernel:
      'n is even iff n = 2k for some integer k; odd iff n = 2k+1. Generalizing: m | n iff n = mk for some k ∈ ℤ. Divisibility is an existence statement, so proving it means producing the k.',
    objectives: [
      'Use the algebraic definitions of even and odd',
      'State the definition of divides',
      'Recognize divisibility claims as ∃-statements',
    ],
    sourceRef: 'Math 0 §4.1.2',
    vocabulary: ['even', 'odd', 'divides'],
    prerequisites: ['4.1', '1.10'],
    treatment: treatment({}),
    namedMove: null,
  },
  {
    chapter: '04-numbers',
    slug: '03-proving-divisibility',
    id: '4.3',
    order: 3,
    titles: titles({
      l1: 'Sharing then sharing again',
      l2: 'Divide, then divide again',
      l3: 'Proving divisibility facts',
      default: 'Proving divisibility facts',
    }),
    kernel:
      'Divisibility proofs follow one template: unpack each hypothesis into an equation with a named integer, do algebra, factor out the divisor, and confirm the cofactor is an integer using closure.',
    objectives: [
      'Prove transitivity of divisibility',
      'Prove a | bx + cy',
      'Give the 4 | 2·6 counterexample',
    ],
    sourceRef: 'Math 0 §4.1.2, §4.1.3',
    vocabulary: ['without loss of generality'],
    prerequisites: ['4.2', '1.6'],
    treatment: treatment({ l1: 'touch' }),
    namedMove: "start from what you're given",
  },
  {
    chapter: '04-numbers',
    slug: '04-remainders-and-cases',
    id: '4.4',
    order: 4,
    titles: titles({
      l1: 'Leftovers',
      l2: 'What is left over',
      l3: 'Remainders and proof by cases',
      default: 'Remainders and proof by cases',
    }),
    kernel:
      'If n ∤ m then m = nk + r for some r with 1 ≤ r ≤ n − 1 — so "not divisible" splits into n − 1 cases. This makes proof by cases the standard tool for divisibility.',
    objectives: [
      'Enumerate the cases for n ∤ m',
      'Complete a two-case divisibility proof',
      'State the converse use (writing m = 3k+1 proves 3 ∤ m)',
    ],
    sourceRef: 'Math 0 §4.1.3',
    vocabulary: ['remainder'],
    prerequisites: ['4.2', '1.12'],
    treatment: treatment({ l1: 'touch' }),
    namedMove: 'split into cases',
  },
  {
    chapter: '04-numbers',
    slug: '05-rationals-are-a-field',
    id: '4.5',
    order: 5,
    titles: titles({
      l1: 'Pieces are numbers too',
      l2: 'Fractions',
      l3: 'The rationals are a field',
      default: 'The rationals are a field',
    }),
    kernel:
      'ℚ is closed under addition, additive inverses, multiplication, and multiplicative inverses of nonzero elements — this makes it a field. The closure proofs are just fraction arithmetic checked against the definition.',
    objectives: [
      'Verify each closure property with the standard fraction formulas',
      'State the difference between a ring and a field',
    ],
    sourceRef: 'Math 0 §4.2.1',
    vocabulary: ['field', 'rational number'],
    prerequisites: ['4.1'],
    treatment: treatment({ l1: 'touch' }),
    namedMove: null,
  },
  {
    chapter: '04-numbers',
    slug: '06-between-rationals',
    id: '4.6',
    order: 6,
    titles: titles({
      l1: 'A spot between two spots',
      l2: 'Halfway between',
      l3: 'Between any two rationals',
      default: 'Between any two rationals',
    }),
    kernel:
      'Given rationals a < b, the midpoint (a+b)/2 is rational and lies strictly between them — so there are infinitely many rationals between any two. Density is proved, not asserted.',
    objectives: [
      'Prove the midpoint is rational using closure',
      'Prove both inequalities',
      'Explain the "repeat forever" consequence',
    ],
    sourceRef: 'Math 0 §4.2.1',
    vocabulary: ['density', 'midpoint'],
    prerequisites: ['4.5'],
    treatment: treatment({ l1: 'touch' }),
    namedMove: null,
  },
  {
    chapter: '04-numbers',
    slug: '07-irrational-sqrt2',
    id: '4.7',
    order: 7,
    titles: titles({
      l1: 'A length no fraction fits',
      l2: 'The diagonal you cannot write',
      l3: 'Irrational numbers and √2',
      default: 'Irrational numbers and √2',
    }),
    kernel:
      'Some real numbers are not rational. √2 is one: assuming √2 = p/q in lowest terms forces p and q both even, contradicting lowest terms. Uses "n² even ⇒ n even" from 1.9.',
    objectives: [
      'Reproduce the √2 proof',
      'Identify each earlier tool it uses',
      'State that √m is rational iff m is a perfect square',
    ],
    sourceRef: 'Math 0 §4.2.2',
    vocabulary: ['irrational'],
    prerequisites: ['4.5', '1.9', '2.5'],
    treatment: treatment({ l1: 'touch' }),
    namedMove: 'suppose not',
  },
  {
    chapter: '04-numbers',
    slug: '08-shape-of-irrationals',
    id: '4.8',
    order: 8,
    titles: titles({
      l1: 'Two strange numbers, one ordinary',
      l2: 'Adding two √2s',
      l3: 'The shape of the irrationals',
      default: 'The shape of the irrationals',
    }),
    kernel:
      'The irrationals are not closed under addition or multiplication and contain neither 0 nor 1 — they are not a field. But: if a is irrational so are −a and 1/a, and a nonzero rational times an irrational is irrational.',
    objectives: [
      'Give counterexamples to closure',
      'Prove rational × irrational is irrational',
      'See the −a result as a special case',
    ],
    sourceRef: 'Math 0 §4.2.2',
    vocabulary: [],
    prerequisites: ['4.7', '2.5'],
    treatment: treatment({ l1: 'touch' }),
    namedMove: 'suppose not',
  },

  // ---- Chapter 5 : Complex ----
  {
    chapter: '05-complex',
    slug: '01-why-a-new-number',
    id: '5.1',
    order: 1,
    titles: titles({
      l1: 'A place nothing lands',
      l2: 'The gap in the squares',
      l3: 'Why we needed a new number',
      default: 'Why we needed a new number',
    }),
    kernel:
      'x² ≥ 0 for every real x, so x² + 1 = 0 has no real solution and the polynomial x² + 1 has no real root. Roots of polynomials matter enough that mathematicians extended the number system rather than accept the gap.',
    objectives: [
      'Explain why x² + 1 has no real root',
      'Describe the historical move as invention-with-verification',
    ],
    sourceRef: 'Math 0 §5.1',
    vocabulary: [],
    prerequisites: ['4.1', '1.12'],
    treatment: treatment({}),
    namedMove: null,
  },
  {
    chapter: '05-complex',
    slug: '02-what-is-a-complex-number',
    id: '5.2',
    order: 2,
    titles: titles({
      l1: 'Across and turn',
      l2: 'A pair of instructions',
      l3: 'What a complex number is',
      default: 'What a complex number is',
    }),
    kernel:
      'ℂ = {a + bi | a,b ∈ ℝ} with i² = −1. Re(z) = a, Im(z) = b, and both are real. ℝ ⊆ ℂ via a = a + 0i, giving ℕ ⊆ ℤ ⊆ ℚ ⊆ ℝ ⊆ ℂ.',
    objectives: [
      'Identify real and imaginary parts',
      'Prove ℝ ⊆ ℂ',
      'Place all five number systems in order',
    ],
    sourceRef: 'Math 0 §5.1.1, §5.1.2',
    vocabulary: ['complex number', 'real part', 'imaginary part'],
    prerequisites: ['5.1', '2.3'],
    treatment: treatment({}),
    namedMove: null,
  },
  {
    chapter: '05-complex',
    slug: '03-complex-arithmetic',
    id: '5.3',
    order: 3,
    titles: titles({
      l1: 'Doing two instructions',
      l2: 'Adding moves',
      l3: 'Complex arithmetic',
      default: 'Complex arithmetic',
    }),
    kernel:
      'Add componentwise; multiply by FOIL with i² = −1, giving (ac − bd) + (ad + bc)i; invert by multiplying by the conjugate over itself; divide as z · (1/w). ℂ is a field.',
    objectives: [
      'Add, multiply, invert, and divide complex numbers',
      'Verify a² + b² ≠ 0 for z ≠ 0',
      'State that ℂ is a field',
    ],
    sourceRef: 'Math 0 §5.2',
    vocabulary: [],
    prerequisites: ['5.2', '4.5'],
    treatment: treatment({ l1: 'touch' }),
    namedMove: null,
  },
  {
    chapter: '05-complex',
    slug: '04-conjugation',
    id: '5.4',
    order: 4,
    titles: titles({
      l1: 'The mirror',
      l2: 'Flip across the middle',
      l3: 'Conjugation',
      default: 'Conjugation',
    }),
    kernel:
      'z̄ = a − bi. Conjugation is an involution; Re(z) = (z + z̄)/2; Im(z) = (z − z̄)/(2i); z·z̄ = a² + b² is real and ≥ 0. z is real iff z = z̄.',
    objectives: [
      'Compute conjugates',
      'Verify the Re/Im formulas',
      'Prove the biconditional z real ⇔ z = z̄',
    ],
    sourceRef: 'Math 0 §5.2.1',
    vocabulary: ['conjugate', 'involution'],
    prerequisites: ['5.3', '1.9'],
    treatment: treatment({ l1: 'touch' }),
    namedMove: null,
  },
  {
    chapter: '05-complex',
    slug: '05-complex-plane',
    id: '5.5',
    order: 5,
    titles: titles({
      l1: 'Across then up',
      l2: 'Plotting a walk',
      l3: 'The complex plane',
      default: 'The complex plane',
    }),
    kernel:
      'a + bi is plotted at (a,b) on a plane with a real horizontal axis and imaginary vertical axis. Addition is the parallelogram rule; conjugation is reflection in the real axis.',
    objectives: [
      'Plot complex numbers',
      'Add geometrically',
      'Explain why real numbers are fixed by conjugation',
    ],
    sourceRef: 'Math 0 §5.3.1',
    vocabulary: ['complex plane'],
    prerequisites: ['5.4'],
    treatment: treatment({}),
    namedMove: null,
  },
  {
    chapter: '05-complex',
    slug: '06-modulus',
    id: '5.6',
    order: 6,
    titles: titles({
      l1: 'How far from home',
      l2: 'Measuring how far',
      l3: 'Modulus',
      default: 'Modulus',
    }),
    kernel:
      '|z| = √(a² + b²) is the distance from 0; |z| = √(z·z̄); it extends absolute value; |z − w| is the distance between z and w; |z − w| = r describes a circle.',
    objectives: [
      'Compute modulus',
      'Connect to Pythagoras and to absolute value',
      'Sketch the locus |z − w| = r',
    ],
    sourceRef: 'Math 0 §5.3.2',
    vocabulary: ['modulus', 'absolute value'],
    prerequisites: ['5.5'],
    treatment: treatment({ l1: 'touch' }),
    namedMove: null,
  },
  {
    chapter: '05-complex',
    slug: '07-euler-formula',
    id: '5.7',
    order: 7,
    titles: titles({
      l1: 'Four quarter turns',
      l2: 'The i-cycle',
      l3: "Euler's formula",
      default: "Euler's formula",
    }),
    kernel:
      'Substituting iθ into the series for eˣ and using the cycle i, −1, −i, 1 separates into the cosine and sine series, giving e^{iθ} = cos θ + i sin θ.',
    objectives: [
      'State the powers of i cycle',
      'Describe how the series split',
      "State Euler's formula",
    ],
    sourceRef: 'Math 0 §5.4.1',
    vocabulary: [],
    prerequisites: ['5.6'],
    treatment: treatment({ l1: 'touch', l2: 'touch', l3: 'touch' }),
    namedMove: null,
  },
  {
    chapter: '05-complex',
    slug: '08-polar-form',
    id: '5.8',
    order: 8,
    titles: titles({
      l1: 'How far and which way',
      l2: 'Direction and distance',
      l3: 'Polar form',
      default: 'Polar form',
    }),
    kernel:
      're^{iθ} is the point at distance r from the origin at counterclockwise angle θ. Polar form is non-unique: re^{iθ} = re^{i(θ+2πk)}. Special values: i = e^{iπ/2}, −1 = e^{iπ}, and e^{iπ} + 1 = 0.',
    objectives: [
      'Convert between a + bi and re^{iθ}',
      'Explain non-uniqueness',
      'Evaluate the special cases',
    ],
    sourceRef: 'Math 0 §5.4.2',
    vocabulary: ['polar form', 'radians'],
    prerequisites: ['5.7'],
    treatment: treatment({ l1: 'touch' }),
    namedMove: null,
  },
  {
    chapter: '05-complex',
    slug: '09-multiplication-is-rotation',
    id: '5.9',
    order: 9,
    titles: titles({
      l1: 'Turning twice',
      l2: 'Adding turns',
      l3: 'Multiplication is rotation',
      default: 'Multiplication is rotation',
    }),
    kernel:
      'r₁e^{iθ₁} · r₂e^{iθ₂} = (r₁r₂)e^{i(θ₁+θ₂)}: multiply lengths, add angles. Comparing e^{i(2θ)} with (e^{iθ})² yields the double-angle formulas; the general version is De Moivre\'s formula.',
    objectives: [
      'Multiply in polar form',
      'Derive the double-angle identities',
      "State De Moivre's formula",
    ],
    sourceRef: 'Math 0 §5.4.3',
    vocabulary: ["De Moivre's formula"],
    prerequisites: ['5.8'],
    treatment: treatment({ l1: 'touch' }),
    namedMove: null,
  },

  // ---- Chapter 6 : Induction ----
  {
    chapter: '06-induction',
    slug: '01-domino-idea',
    id: '6.1',
    order: 1,
    titles: titles({
      l1: 'Dominoes',
      l2: 'A row of dominoes',
      l3: 'The domino idea',
      default: 'The domino idea',
    }),
    kernel:
      'If the first domino falls, and every domino knocks over the next, then all of them fall. Pattern-spotting suggests a claim; induction is what turns the guess into knowledge.',
    objectives: [
      'Explain the two conditions in the domino picture',
      'Identify what goes wrong if either fails',
    ],
    sourceRef: 'Math 0 §6.1.1',
    vocabulary: ['induction'],
    prerequisites: [],
    treatment: treatment({}),
    namedMove: 'dominoes',
  },
  {
    chapter: '06-induction',
    slug: '02-three-steps',
    id: '6.2',
    order: 2,
    titles: titles({
      l1: 'Two jobs',
      l2: 'Push, then chain',
      l3: 'The three steps',
      default: 'The three steps',
    }),
    kernel:
      '(1) State A(n) and the starting value n₀. (2) Prove the base case A(n₀). (3) Prove the inductive step: assume A(k) for some k ≥ n₀, deduce A(k+1). The inductive step is a conditional, so assuming A(k) is not circular.',
    objectives: [
      'Write the three steps for a given claim',
      'Explain why the step is not begging the question',
      'Identify the base case',
    ],
    sourceRef: 'Math 0 §6.1.2',
    vocabulary: ['base case', 'inductive step', 'inductive hypothesis'],
    prerequisites: ['6.1', '1.5'],
    treatment: treatment({ l1: 'touch' }),
    namedMove: 'dominoes',
  },
  {
    chapter: '06-induction',
    slug: '03-classic-proof',
    id: '6.3',
    order: 3,
    titles: titles({
      l1: 'Odd L-shells',
      l2: 'Building a square with odd numbers',
      l3: 'The classic proof',
      default: 'The classic proof',
    }),
    kernel:
      'Σ from j = 1 to n of (2j − 1) equals n², proved by induction, written in the house style. The algebra k² + 2k + 1 = (k+1)² is the entire inductive step.',
    objectives: [
      'Write a complete induction proof',
      'Avoid the backwards-reasoning error',
    ],
    sourceRef: 'Math 0 §6.1.2',
    vocabulary: [],
    prerequisites: ['6.2'],
    treatment: treatment({ l1: 'touch', l2: 'touch' }),
    namedMove: 'dominoes',
  },
  {
    chapter: '06-induction',
    slug: '04-when-does-induction-apply',
    id: '6.4',
    order: 4,
    titles: titles({
      l1: 'Dominoes need a line',
      l2: 'Some things are not in a line',
      l3: 'When does induction apply?',
      default: 'When does induction apply?',
    }),
    kernel:
      'Induction needs a statement indexed by integers n ≥ n₀ and a way to connect case k+1 back to case k. Statements about all real numbers are not candidates.',
    objectives: [
      'Judge whether a claim is a candidate for induction',
      'Articulate the linkage requirement',
    ],
    sourceRef: 'Math 0 §6.1.3',
    vocabulary: [],
    prerequisites: ['6.2'],
    treatment: treatment({ l1: 'touch' }),
    namedMove: null,
  },
  {
    chapter: '06-induction',
    slug: '05-induction-in-number-theory',
    id: '6.5',
    order: 5,
    titles: titles({
      l1: 'Dominoes with sharing',
      l2: 'Sharing evenly, always',
      l3: 'Induction in number theory',
      default: 'Induction in number theory',
    }),
    kernel:
      '3 | (2^{2n} − 1) for all n ≥ 0. The step: write 2^{2k} − 1 = 3x, so 2^{2k} = 3x + 1, then 2^{2(k+1)} − 1 = 4(3x+1) − 1 = 3(4x+1). Naming the unknown factor x (not k) matters, because k is taken.',
    objectives: [
      'Combine the divisibility template with induction',
      'Manage variable naming',
    ],
    sourceRef: 'Math 0 §6.2.1',
    vocabulary: [],
    prerequisites: ['6.2', '4.2'],
    treatment: treatment({ l1: 'touch', l2: 'touch' }),
    namedMove: 'dominoes',
  },
  {
    chapter: '06-induction',
    slug: '06-induction-in-calculus',
    id: '6.6',
    order: 6,
    titles: titles({
      l1: 'Doubling and doubling',
      l2: 'Repeating a step',
      l3: 'Induction with repeated steps',
      l7: 'Induction in calculus',
      l8: 'Induction in calculus',
      default: 'Induction with repeated steps',
    }),
    kernel:
      'For f(x) = 1/x, f^{(n)}(x) = (−1)ⁿ n! x^{−(n+1)}. Found by computing the first few derivatives and spotting three patterns (sign, factorial, exponent); proved by induction using (k+1)! = (k+1)·k!.',
    objectives: [
      'Conjecture a general formula from data',
      'Prove it by induction',
      'Handle the base case',
    ],
    sourceRef: 'Math 0 §6.2.2',
    vocabulary: [],
    prerequisites: ['6.2'],
    treatment: treatment({ l1: 'touch', l2: 'touch', l3: 'touch' }),
    namedMove: 'dominoes',
  },
  {
    chapter: '06-induction',
    slug: '07-induction-in-set-theory',
    id: '6.7',
    order: 7,
    titles: titles({
      l1: 'How many bags',
      l2: 'Every new toy doubles it',
      l3: 'Induction in set theory',
      default: 'Induction in set theory',
    }),
    kernel:
      'A set with n elements has 2ⁿ subsets. The step: pick a ∈ S, split subsets into those containing a and those not; each group is in bijection with the subsets of the k-element set S \\ {a}, giving 2ᵏ + 2ᵏ = 2^{k+1}.',
    objectives: [
      'Enumerate subsets of small sets',
      'Give the doubling argument',
      'Write the proof',
    ],
    sourceRef: 'Math 0 §6.2.3',
    vocabulary: ['power set'],
    prerequisites: ['6.2', '2.1', '2.9'],
    treatment: treatment({}),
    namedMove: 'dominoes',
  },

  // ---- Chapter 7 : Peano ----
  {
    chapter: '07-peano',
    slug: '01-what-is-an-axiom',
    id: '7.1',
    order: 1,
    titles: titles({
      l1: 'The rules we start with',
      l2: 'Rules of the game',
      l3: 'What is an axiom?',
      default: 'What is an axiom?',
    }),
    kernel:
      'Tracing proofs backwards must terminate. Axioms are the statements taken as true without proof; a mathematical theory is its axioms plus everything derivable from them.',
    objectives: [
      'Explain why axioms are necessary',
      'Distinguish axiom from theorem',
      'Describe axioms as choices with consequences',
    ],
    sourceRef: 'Math 0 §7.1',
    vocabulary: ['axiom', 'theorem'],
    prerequisites: [],
    treatment: treatment({}),
    namedMove: null,
  },
  {
    chapter: '07-peano',
    slug: '02-equality',
    id: '7.2',
    order: 2,
    titles: titles({
      l1: 'Same as',
      l2: 'The rules for same',
      l3: 'The rules for equality',
      default: 'The rules for equality',
    }),
    kernel:
      'Axioms 1–4: reflexivity (x = x), symmetry, transitivity, and closure of equality (if x ∈ ℕ and x = y then y ∈ ℕ). Reflexive + symmetric + transitive = an equivalence relation.',
    objectives: [
      'State the three properties',
      'Recognize them elsewhere (same age, same color, same remainder)',
      'Explain closure of equality',
    ],
    sourceRef: 'Math 0 §7.2.1',
    vocabulary: ['reflexive', 'symmetric', 'transitive', 'equivalence relation'],
    prerequisites: ['7.1'],
    treatment: treatment({}),
    namedMove: null,
  },
  {
    chapter: '07-peano',
    slug: '03-zero-and-successor',
    id: '7.3',
    order: 3,
    titles: titles({
      l1: 'The what-comes-next machine',
      l2: 'Naming what comes next',
      l3: 'Zero and the successor',
      default: 'Zero and the successor',
    }),
    kernel:
      'Axiom 5: 0 ∈ ℕ. Axiom 6: if x ∈ ℕ then S(x) ∈ ℕ. S is the "next" function. We cannot yet call S(x) "x + 1" because + is not defined.',
    objectives: [
      'State both axioms',
      'Explain why S(x) cannot yet be written x + 1',
      'Recognize S as a function ℕ → ℕ',
    ],
    sourceRef: 'Math 0 §7.2.2 (Axioms 5, 6)',
    vocabulary: ['successor'],
    prerequisites: ['7.2', '3.1'],
    treatment: treatment({}),
    namedMove: null,
  },
  {
    chapter: '07-peano',
    slug: '04-no-loops-no-merges',
    id: '7.4',
    order: 4,
    titles: titles({
      l1: 'No coming home',
      l2: 'Two rules for real counting',
      l3: 'Two axioms that stop the numbers looping',
      default: 'Two axioms that stop the numbers looping',
    }),
    kernel:
      'Axiom 7: 0 is not the successor of anything, so counting never returns to the start. Axiom 8: S is injective, so counting never merges two numbers into one.',
    objectives: [
      'Construct the bad models the axioms rule out',
      'Restate Axiom 7 as "the pre-image of 0 is empty" and Axiom 8 as "S is injective"',
    ],
    sourceRef: 'Math 0 §7.2.2 (Axioms 7, 8)',
    vocabulary: [],
    prerequisites: ['7.3', '3.5'],
    treatment: treatment({}),
    namedMove: null,
  },
  {
    chapter: '07-peano',
    slug: '05-inductive-sets',
    id: '7.5',
    order: 5,
    titles: titles({
      l1: 'Only the counting numbers',
      l2: 'No extras allowed',
      l3: 'Inductive sets and the last axiom',
      default: 'Inductive sets and the last axiom',
    }),
    kernel:
      'V is inductive if 0 ∈ V and x ∈ V ⇒ S(x) ∈ V. Axiom 9: if V is inductive then ℕ ⊆ V. This rules out "too big" models and, combined with axioms 1–8, gives ℕ = {0,1,2,…} exactly. It is the same principle as Chapter 6.',
    objectives: [
      'Test a set for inductiveness',
      'Construct the {a,b} rogue model and see how Axiom 9 kills it',
      'Connect Axiom 9 to the domino argument',
    ],
    sourceRef: 'Math 0 §7.2.2 (Axiom 9)',
    vocabulary: ['inductive set'],
    prerequisites: ['7.4', '6.2', '2.6'],
    treatment: treatment({ l1: 'touch' }),
    namedMove: 'dominoes',
  },
  {
    chapter: '07-peano',
    slug: '06-defining-addition',
    id: '7.6',
    order: 6,
    titles: titles({
      l1: 'Adding is pressing next',
      l2: 'How addition works',
      l3: 'Defining addition',
      default: 'Defining addition',
    }),
    kernel:
      'a + 0 = a and a + S(b) = S(a + b). Every sum is computed by unwinding to the base case. 1 + 1 = 2 becomes a derivation, not a fact.',
    objectives: [
      'Compute 1+1, 1+2, 2+3 from the definition',
      'Explain what recursive definition means',
    ],
    sourceRef: 'Math 0 §7.3.1',
    vocabulary: ['recursive definition'],
    prerequisites: ['7.3'],
    treatment: treatment({}),
    namedMove: null,
  },
  {
    chapter: '07-peano',
    slug: '07-defining-multiplication',
    id: '7.7',
    order: 7,
    titles: titles({
      l1: 'Groups of things',
      l2: 'Adding again and again',
      l3: 'Defining multiplication',
      default: 'Defining multiplication',
    }),
    kernel:
      'a · 0 = 0 and a · S(b) = a + (a · b). Multiplication is built on addition exactly as addition was built on the successor. a · 1 = a is a small theorem; 3 · 2 = 6 is a derivation.',
    objectives: [
      'Compute a·1 and 3·2 from the definition',
      'Describe the tower successor → addition → multiplication',
    ],
    sourceRef: 'Math 0 §7.3.2',
    vocabulary: [],
    prerequisites: ['7.6'],
    treatment: treatment({}),
    namedMove: null,
  },
];

// ----------------- write files -----------------
let count = 0;
for (const m of MODULES) {
  const dir = path.join(CHAPTERS, m.chapter, m.slug);
  fs.mkdirSync(dir, { recursive: true });

  const record = {
    id: m.id,
    slug: m.slug.replace(/^\d+-/, ''), // clean slug for the schema
    chapter: m.chapter,
    order: m.order,
    titles: m.titles,
    kernel: m.kernel,
    objectives: m.objectives,
    sourceRef: m.sourceRef,
    vocabulary: m.vocabulary,
    prerequisites: m.prerequisites,
    treatment: m.treatment,
    namedMove: m.namedMove,
    anchorExample: m.anchorExample ?? CHAPTER_ANCHOR[m.chapter],
  };

  fs.writeFileSync(
    path.join(dir, '_module.json'),
    JSON.stringify(record, null, 2) + '\n',
  );
  count++;
}
console.log(`Seeded ${count} modules.`);
