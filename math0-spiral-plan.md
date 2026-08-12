# Proof Ladder — Build Plan & Syllabus

**A spiral curriculum website that teaches the whole of Caltech's Math 0 (*Transition to Mathematical Proofs*) at eight reading levels, from kindergarten to college.**

This document is the specification. It is written to be handed to Claude Code as the source of truth for building the site: Part A sets the pedagogy and level system, Part B is the complete syllabus (every module, every level), Part C is the technical build, Part D is the content-generation workflow, and Part E covers deployment, attribution, and later phases.

---

## Part A — The project

### A1. The premise

The US sequence runs arithmetic → geometry → algebra → trig → precalculus → calculus. Deductive reasoning appears once, in 9th-grade geometry, as a two-column ritual that arrives without motivation and then disappears again. The result is that students meet proof as a genre they have to imitate rather than a tool they needed. The existence of Math 0 — a course Caltech built because incoming freshmen who can integrate by parts have never been asked to justify anything — is the evidence.

Geometric reasoning is not taught once. Shapes appear in kindergarten, again with measurement in grade 3, again with coordinates in grade 5, again with congruence in grade 8, again with formal proof in grade 10. Nobody finds this strange. The claim behind this project is that logic, sets, functions, and induction can be spiraled the same way, and that the Math 0 syllabus is the right spine to spiral along, because it is a complete and honest list of what a person needs before real mathematics starts.

### A2. What the site is

One course, taught eight times. A reader picks a level and gets the entire Math 0 content — all seven chapters, all 61 modules — written for that level. Switching level mid-course keeps you on the same idea and re-explains it. Nothing is hidden at any level: kindergarten gets a real (short, concrete) treatment of Peano's successor function, not a "come back in twelve years" placeholder.

**Phase 1 scope (this build): content only.** No exercises, no accounts, no backend. Static site, runs locally with one command, deployable to GitHub Pages.

### A3. Design principles for the content

These are binding constraints on every piece of writing generated for this site.

1. **No lies-to-children.** Every simplification must be *true but incomplete*, never something the reader has to unlearn. Banned: "you can't subtract a bigger number from a smaller one," "negative numbers don't have square roots," "a function is a formula," "or means one or the other." Preferred shape: "with the numbers we have so far, there's nothing that works — so mathematicians made a new number, and here's how."
2. **The kernel is a level-adapted restatement of a fixed idea.** Each module has a *kernel idea* — the mathematical content that must survive at every level. The idea is fixed; each level carries its own *kernel sentence*, worded so a reader at that level can actually read it. A kindergartner should never see college wording on the invariant band, and a college reader should not see baby wording. What is invariant is the *thing being pointed at*, not the pointing. If a level's page doesn't carry the kernel idea, it's wrong; if a level's kernel sentence uses vocabulary or notation the reader hasn't met, it's also wrong.
3. **Vertical alignment.** A grade-2 reader who later reads the grade-8 page should recognize the same idea, ideally with the same running example. Keep the examples consistent down the ladder wherever the mathematics allows (see A6, "anchor examples").
4. **Motivation precedes formalizm at every level.** Each module opens with the question the idea answers. The Math 0 notes already do this; preserve it.
5. **Proof is a kind of talking, not a format.** Never present two-column proofs. Math 0's own convention — a **Discussion** section (what we know / what we want / what we'll do) followed by a **Proof** in full English sentences — is the house style and scales down beautifully. At kindergarten, "what we know / what we want / what we'll do" becomes "What's true already? What do we want to be true? How do we get there?"
6. **Name the move.** Every proof technique gets a name the reader can use out loud: *flip it around* (contrapositive), *suppose not* (contradiction), *check both boxes* (double inclusion), *one bad apple* (counterexample), *dominoes* (induction). Names carry across levels; the formal term is introduced alongside the informal one from grade 5 up.
7. **Honesty about difficulty.** Say when something is hard. Math 0 does this ("this proof is slightly out of the scope of these notes"). Keep it.

### A4. The eight levels

The reader picks one of these. Each level has a fixed voice, notation budget, and length budget. Levels 1–2 are read *to* a child by an adult; levels 3+ are read independently.

**These profiles are calibrated against the Common Core State Standards for Mathematics and against Lexile grade bands, not against intuition.** §A4.1 records the calibration and its sources; §A4.2 is the binding notation gate. A page that uses notation or arithmetic the reader has not met is wrong even if the mathematics is correct, because the reader will stall on the notation and never reach the idea.

| ID | Label (shown) | Age / grade | Lexile band | Words / module | Sentence length |
|----|---------------|-------------|-------------|----------------|-----------------|
| `l1` | Kindergarten | 5–6 | read aloud |  110–130 | 6–12 words |
| `l2` | 2nd grade | 7–8 | 420–650L |  280–380 | 8–12 words |
| `l3` | 5th grade | 10–11 | 830–1010L |  550–700 | 12–16 words |
| `l4` | 8th grade | 13–14 | 1010–1185L |  590–750 | 14–18 words |
| `l5` | 9th grade | 14–15 | 1050–1260L |  800–1200 | 15–20 words |
| `l6` | 10th grade | 15–16 | 1080–1305L |  870–970 | 15–20 words |
| `l7` | 12th grade | 17–18 | 1180–1380L |  1070–1190 | 16–22 words |
| `l8` | College | 18+ | 1300L+ |  1200–2000 | 16–24 words |

**Word budgets are derived, not decreed.** The figures above are the interquartile
range of the written corpus at each level, rounded — the middle half of pages
defines the norm, and the lint's ±20% tolerance then flags genuine outliers. They
were originally a-priori estimates, and checking them against the corpus showed the
estimates were wrong in both directions: `l2` and `l3` medians sat *above* their
ceilings while `l6` and `l7` medians sat *below* their floors. The claimed
`readingTimeMin` values imply roughly 100 words per minute at every level, which is
a reasonable rate for mathematical prose, and the corpus is consistent with it.
`l5` and `l8` are left at their estimates until enough pages exist to calibrate.

**A note on the level count.** Eight levels × 61 modules = 488 pages, which is a lot to author and a lot to keep aligned. **Build `l2`, `l3`, `l4`, `l6`, `l7` first** — these are the five grades where a reader is most likely to arrive (2nd, 5th, 8th, 10th, 12th), and they are far enough apart that each is a genuinely different page rather than a reworded neighbor. Then add `l1` (K) for the read-aloud audience, and finally `l5` and `l8`, which are the closest neighbors of `l4`/`l6` and `l7` respectively.

#### A4.1 Grade calibration — what the reader has actually met

Compiled from the Common Core State Standards for Mathematics. The right-hand column is the one that matters most: **what the reader has *not* met yet is what will break the page.**

| Grade | Has met, per CCSSM | Has **not** met yet |
|---|---|---|
| **2** | Add/subtract within 100 (fluent within 20); numbers to 1000; place value to hundreds; **even/odd by pairing** (2.OA.C.3); arrays as *repeated addition* (2.OA.C.4); partitioning shapes into halves, thirds, fourths (2.G.A.3); `>`, `=`, `<`; money and clock; triangle/quadrilateral/pentagon/hexagon/cube | **Multiplication as an operation** (grade 3); **fractions as numbers** (grade 3); division; negative numbers; variables; decimals |
| **5** | Fraction +, −, × and ÷ by unit fractions; decimals to thousandths; **numerical expressions with parentheses** (5.OA.A.1–2); volume; coordinate plane **first quadrant only** (5.G.A.2); **classifying 2-D figures in a hierarchy by properties** (5.G.B.3–4); factors, multiples, prime/composite (grade 4) | **Variables/letters** (6.EE.A.2); **negative numbers** (6.NS.C.5); all four quadrants; exponents; ratios |
| **8** | Integer exponents; scientific notation; `√` and `∛`; **irrational numbers, and that √2 is irrational** (8.NS.A.1, 8.EE.A.2); linear equations and systems; `y = mx + b`; **function as "a rule assigning each input exactly one output"** (8.F.A.1); congruence via rigid motions; Pythagoras and *explaining* its proof (8.G.B.6) | **Function notation `f(x)`** (high school, HSF-IF.A.2); formal proof; quantifiers; logarithms; trigonometry |
| **10** | **Formal proof — the geometry year.** Two-column and paragraph proofs; congruence from rigid motions; ASA/SAS/SSS; proving theorems about lines, angles, triangles, parallelograms; precise definitions as load-bearing; `f(x)`, domain/range; quadratics; similarity | Trigonometric identities beyond basics; series; limits; matrices |
| **12** | Precalculus: complex numbers **including polar form and De Moivre**; sequences and series with **Σ**; informal limits; trig identities and inverse trig; vectors and matrices; conics; parametric and polar curves; exponentials and logarithms | Formal ε–δ; abstract algebra; topology; measure theory |

Sources: [CCSSM Grade 2](https://www.thecorestandards.org/Math/Content/2/introduction/) · [Grade 5](https://www.thecorestandards.org/Math/Content/5/introduction/) · [Grade 6 (negatives, variables)](https://www.thecorestandards.org/Math/Content/6/EE/) · [Grade 8](https://www.thecorestandards.org/Math/Content/8/introduction/) · [HS Geometry: Congruence](https://www.thecorestandards.org/Math/Content/HSG/CO/) · [HS Functions: Interpreting Functions](https://www.thecorestandards.org/Math/Content/HSF/IF/) · [Lexile bands by grade](https://lexile.com/educators/understanding-lexile-measures/)

#### A4.1a Section length and jargon (binding)

Two rules that the word-per-module budget does not capture, both added after a
review found `l7` reading as college-level despite being inside its Lexile band.

**Section cap — on running prose only.** The unit that reads as a wall of text is
a run of unbroken prose, *not* total section length. A `<Proof>`, `<Discussion>`
or `<Warning>` block is visually distinct on the page and does not read as one.

This distinction matters more than it sounds. Measured on total section words,
121 sections looked over-long; measuring running prose instead, **zero** were —
a median of **79%** of a long section's words turn out to sit inside components.
Counting them as prose overstates the problem badly and prescribes the wrong fix
(adding subheadings to prose that was never dense).

Caps on running prose between components, set just above each level's 97th
percentile so the check flags genuine outliers rather than firing constantly:

| `l1` | `l2` | `l3` | `l4` | `l5` | `l6` | `l7` | `l8` |
|---|---|---|---|---|---|---|---|
| 70 | 150 | 160 | 175 | 190 | 190 | 210 | 210 |

Running prose medians sit at 70–104 words across every level, so a page that
*feels* long is usually packing many components rather than running on. Whether
that is a fault is a judgement call; the cap only polices the prose.

**"Component" means any capitalised JSX element, matched generically.** The
check originally stripped a hardcoded list — `Proof`, `Warning`, `Aside`,
`Discussion`, `Figure`, `TruthTable`, `WhereThisGoes` — and counted every other
component's *attributes* as running prose. A `<ThingBox>` with its items spelled
out added roughly 30 "words" to its section, so a page could breach the cap for
the crime of carrying a picture. That is the same measurement artifact this
section was written to fix, reintroduced through a list that stopped being
exhaustive the moment a component was added. Self-closing tags are stripped
before paired ones, or the paired pattern runs from a self-closing tag to a
later closing tag of the same name.

After the fix the caps still sit above each level's 97th percentile with 19–46
words of headroom, and no page in the corpus exceeds one — so the check still
flags genuine outliers rather than firing on ordinary pages.

**Gloss rule, made checkable.** §A4.2 already requires that anything introduced
at a level be glossed on first use in every module that uses it. The check
applies to a curated list of genuinely opaque proof-course jargon —
*well-defined*, *vacuously*, *witness*, *contrapositive*, *canonical*,
*trichotomy*, *involution*, *element chasing*, *excluded middle*, and similar.
A module that **declares** a term in its `newTerms` defines it and needs no
gloss; a module that **borrows** one must reintroduce it or cross-reference the
module that defines it (`§2.5`, `module 1.7`). Ordinary declared vocabulary —
*set*, *union*, *even* — is deliberately out of scope.

**Destination vocabulary — one sanctioned slot per level.** Abstract algebra,
topology and measure-theory terms (*lattice*, *Boolean algebra*, *homomorphism*,
*automorphism*, *monoid*, *group*, *well-founded*, …) are not met by grade 12,
so they may be **named and glossed as a glimpse ahead**, never used as working
vocabulary. Each level has exactly one slot for that:

| Level | Sanctioned slot | Everything else |
|---|---|---|
| `l7` | `<WhereThisGoes>` | held strictly |
| `l6` | `<Aside>` — `l6` has no `<WhereThisGoes>` component, so its Aside does that job | held strictly |

Kernels get **no** exemption at any level. A kernel is the one-sentence takeaway
a reader meets first, so a destination term there is not a glimpse — it is the
headline.

**Jargon density (binding).** Matching the lexical level is not enough. Three
abstract proof-course terms in one paragraph is hard going even when each one is
individually permitted, so a paragraph may carry at most two *borrowed* heavy
terms. Terms belonging to the chapter's own declared vocabulary do not count —
Chapter 3 may say *injective, surjective, bijective* wherever it likes, because
that is its subject. The three arithmetic properties (*commutative*,
*associative*, *distributive*) are not on the list at all: CCSSM names them from
grade 3 (3.OA.B.5), so they are not proof-course vocabulary at any level here.

The two passages this caught were `l7` §2.8 ("a commutative ring in which every
element is idempotent, a *Boolean ring*") and `l7` §4.2 ("a **preorder** … not a
partial order … antisymmetry fails by units") — five order- and algebra-theory
terms, none of them in any K–12 standard, in two sentences.

**Named results (binding).** A result no American school course teaches may be
*mentioned*, but never *assumed*: every level's first mention must say what the
result actually claims. "By well-ordering" and "proved by Wiles in 1994" are
both failures — the first cites an unknown, the second is biography. The gated
list is well-ordering, Gödel, Bézout, Twin Primes, Goldbach, Fermat's Last
Theorem, Euclid's lemma, Cantor's theorem, Russell's paradox, Pólya's
conjecture, Zorn's lemma, Chinese Remainder.

Results that *are* taught are governed by §A5.0 rule 1 instead, which is
stricter: the Pythagorean theorem is grade 8 (8.G.B) and so unavailable at `l4`; the Mean
Value Theorem, IVT and the Fundamental Theorem of Calculus are Calculus, so at
`l7` they belong in `<WhereThisGoes>` as the course the reader is starting, not
in the body as known facts. Taylor series is later still — late BC — and was
removed from the `l7` §6.6 body for that reason.

**Function notation.** `f(x)` is F-IF.A.2, an Algebra I standard, and grade 8
explicitly does not require it (8.F.A.1). So `l5` and up may use it freely;
`l3` and `l4` must introduce it before use. Inside Chapter 3 the notation is the
subject, so §3.1 earns it and the next two modules re-gloss it; outside Chapter 3
every page that reaches for it has to earn it again.

**Trigonometry, base `e` and logarithms.** Trigonometry is barred **by name and
by symbol below `l7`.** Right-triangle trig is G-SRT.C.6 (Geometry, grade 9) and
the unit circle, radians and sine-of-any-angle are F-TF (Algebra II, grade 10),
which is the course `l6` is *taking*; the angle-sum identities are further out
still (F-TF.C.9 is a `(+)` standard, i.e. Precalculus). So no level below `l7`
may print `\cos`, `\sin` or `\tan`, name the subject, or rest an argument on any
of it. Chapter 5 needs angles and gets them from **degrees and pictures**: turns
readable off a drawing, with the two missing rules deferred by description
rather than by name. Base `e` and logarithms are F-LE.A.4, Algebra II again, and
so available only from `l7`.

Naming trig as a coming attraction is also out. "You'll meet this in
trigonometry" reads to a reader as a warning that the page is above them, and it
dates the page against a curriculum that varies by school; "a tool this course
does not assume" says the same thing without either problem.

This is why §5.7 at `l6` proves *multiplying adds the turns* from **SSS
similarity** rather than from the angle-sum identities: similar triangles are
grade 9, the identities are grade 11. The identities then come out of that
theorem in §5.9 as a payoff — which is the right way round, and was not the case
while §5.7 assumed them.

**Chapter 5 is the standing exception**, because the complex plane, modulus,
polar form and Euler's formula cannot be written without them and Part B assigns
those modules at every level. There they are named and glossed as destinations —
the way §5.6 now teaches the right-triangle rule at `l3` instead of citing
the Pythagorean theorem by name, and the way §5.7 now says what $\theta$, $\cos$, $\sin$ and $e$ are
before using them. Everywhere else they were a convenience with an easy
substitute, and the substitute is now in place: Chapter 3's running example at
`l4` is doubling on $\mathbb{Z}$ (injective, surjective onto the evens, a
bijection there, inverted by halving) rather than $e^x$ and $\ln$, and §2.6's
worked proposition is a zero-product argument rather than a trigonometric one.

**Matrices and calculus** are treated differently again, because they are genuine
*destinations* rather than school mathematics a year early. Both are gated to
`l7`, and below it they may be named in a body sentence provided the sentence
says what they are ("square grids of numbers, called *matrices* in Algebra II"),
or used freely inside the sanctioned glimpse slot. §6.6 *Induction in calculus*
is its own subject and so is exempt **at `l7` only** (revised 2026-08-12). The
exemption used to apply at every level, which let calculus sit in a module the
lower grades read too. Below `l7` the module makes its point without calculus
at all — repeated substitution, factorials, the polygon angle-sum — and at
`l7` it may borrow **provided it explains what it borrows**: §6.6 now opens
with a paragraph saying what a derivative is and granting the power rule
outright, because the module is about the induction, not about where the rule
comes from. A bare
"in matrix terms, multiplication by $i$ is …" at `l4` is the failure this
catches.

**Negative numbers and squaring.** Negatives are 6.NS.C.5 (grade 6) for position
and 7.NS.A.2 (grade 7) for arithmetic; whole-number exponents are 6.EE.A.1. So
`l1`, `l2` and `l3` may assume none of them. Chapter 5 is again the standing
exception, since $i \times i = -1$ is its whole content: §5.3 introduces
below-zero numbers in words — *walk left past zero and the places take the same
names with a dash in front* — and later modules re-gloss it. `l1` §5.1 was
rebuilt on turning alone, with no arrays and no negatives, because its previous
version opened on $-2$ folded onto itself, which needs grade 7. Everywhere else
at `l1`–`l3` the squaring examples were replaced by ones inside the ceiling:
Chapter 3 at `l3` now uses *round to the nearest ten* for a non-injective rule
and divisors for a rule that fails to be a function.

**Headings carry no notation, ever.** A heading is read *before* the body that
introduces the symbol, and `anchorExample` appears on navigation cards outside
the reading flow altogether, so the positional introduction rule cannot protect
either. Headings, callout titles and card captions say it in words: *The complex
numbers form a field*, not *ℂ is a field*.

**Vocabulary follows reading order.** No proof-course term may be used before the
module that defines it unless the use is signposted (`§1.10 will call these
quantifiers`, `when you meet injective`) or glosses itself on the spot. Ordinary
school words are exempt: prime and factor are 4.OA.B.4, rational and irrational
are 8.NS.A.1, and *two lines intersect* is plain geometry.

**Prefer the plainer word.** The audience is every student, not only those
already drawn to mathematics, so a Latin or Greek name earns its place only when
it is the declared vocabulary of a module. *Universal quantifier* became *the
for-all quantifier*; *trichotomy*, *canonical*, *antecedent*, *consequent* and
*metalanguage* went to plain English. Naming the heavier word beside the plain
one is still fine — "the hypothesis, or antecedent" teaches it rather than
leaning on it. The Pythagorean theorem is called that, never "Pythagoras".

**The blackboard-bold letters are taught nowhere.** CCSSM names *the real number
system* (N-RN) and *rational numbers*, but no US school course writes $\mathbb{R}$,
$\mathbb{Z}$, $\mathbb{Q}$, $\mathbb{N}$ or $\mathbb{C}$ — they are proof-writing
shorthand, exactly like $\forall$ and $\exists$. They are worth teaching, since
every university text uses them, so §1.1 introduces all five explicitly at `l7`
and Chapter 4 owns them lower down. What they may not do is turn up in Chapter 1
as if the reader had met them: at `l4` that chapter carried 126 of them, and now
carries 23, with the rest written as *an integer $k$* and *a real number $x$*.

**Notation density (binding).** Explaining a symbol repeatedly is necessary but
not sufficient — a page can be unreadable while every symbol on it has been
glossed three times. Chapters are capped near each level's 95th percentile:
`l4` 110, `l5` 95, `l6` 90, `l7` 105, `l8` 130 symbols per 1000 words.
`<Proof>` blocks are excluded, because inside a proof the symbols *are* the
medium and element-chasing cannot be de-symbolized without becoming worse; what
the cap measures is the exposition a reader must get through before the argument
even starts. Two earlier designs were tried and discarded: exempting a chapter's
"own" symbols let §2.8 sit at 179 per 1000 on the grounds that $\cup$ and $\cap$
were Chapter 2's business, and a cross-chapter rule excused a De Morgan module
for the connectives it is about. Thickness is thickness.

**The connectives are gated by module position, not only by level.** §1.2 was
writing $p \wedge \neg p$ and $p \vee \neg p$ a full module before §1.3
introduces *and* and *or*; the positional check had let a bolded word anywhere
nearby count as an introduction, so a bolded **contradiction** was excusing the
$\wedge$ beside it. Those two facts are now stated in words in §1.2 — *a claim
and its denial can never both hold*, *one of the two always holds* — and §1.3
names them once the symbols exist.

**Variables are fine from `l4`.** 6.EE.A.2 introduces them in grade 6, below
`l4`'s grade-7 ceiling. `l3` is a different matter and is gated: at grade 5 a
letter doing arithmetic is off-grade, though a letter used as an element label
is not.

**Part B still outranks this list.** *ring* is deliberately **not** gated: §4.1
introduces the term at `l5`–`l6` as "a label for a number system with these
rules", and §4.5 makes ring-vs-field an objective. A sweep that added a pattern
for it would have put the gate back into conflict with Part B — the exact
failure §A4.2 had to be rescued from. Check Part B before gating a term.

This rule exists because the `l6` kernels were found reading as *more advanced
than `l7`'s*: `l6` said "making P(X) a distributive lattice", "negation is an
anti-homomorphism", "a field automorphism of ℂ", where `l7` said the same things
in words. Six kernels and three body passages were rewritten. A level inversion
in the kernel is the worst place to have one, since the kernel is what a reader
uses to decide whether they are on the right rung.

#### A4.1b Register, and terms that were "already taught" (binding)

Added 2026-08-11, after a read-through of the finished K–12 levels found the
same complaint in four disguises. In every case the rule already existed in this
document and the lint had a guard for it with a hole in exactly the place the
complaint landed. Pages were being fixed one at a time and the problem regrew,
because nothing stopped it.

**1. Register is separate from vocabulary.** Passing the Lexile band is not the
test. *Hence*, *thus*, *precisely*, *yields*, *asserts*, *establishes*,
*suffices*, *vacuously*, *obligation*, *machinery*, *acquires* are words a
12th grader knows and never writes. They are banned outright below `l7` and
capped at `l7`. Measured before the ban: 3.2 hits per 1000 words at `l4`, 6.2 at
`l7` — *hence* alone ran 69 times at `l7` and 36 at `l4`. The proof idiom
*"let x be arbitrary"* is barred separately; the bare adjective is fine.

**2. A term met once is not a term the reader has.** §A4.2 has always said a
borrowing module must reintroduce a term or cross-reference the module that
defines it. The lint only enforced it when *three* borrowed terms stacked in one
paragraph, so a single casual *"by the excluded middle"* or *"this is a
tautology"* passed. It is now enforced per use, at `l4`–`l7`. The reader has
done no proofs between meeting the word and meeting it again; chapters of
distance is not familiarity. A cross-reference counts, because it sends the
reader somewhere real; an em dash does not.

**3. Famous results have one home.** A named result may be named only in the
module that works its argument in full — Russell's paradox at §2.1, the diagonal
argument at §3.8, computability nowhere below `l8`. The failure is never the
first telling; it is the casual reuse afterwards, where a name stands in for an
argument the reader was never given. **The story survives, the machinery does
not:** a 12th grader can be told there is no set of everything and why that is
worth knowing, without Zermelo–Fraenkel, separation, unrestricted
comprehension, Frege, or von Neumann. Those are now in `COLLEGE_TERMS`, which
had listed `cardinals`, `ordinals` and `Zorn` but none of the foundations
vocabulary the `l7` pages had actually grown.

**4. "Translated everywhere" was true of the spec and false of the pages.**
`GLOSS_THROUGH_CHAPTER` is unchanged and was always right — every chapter at
`l4`, tapering to Chapter 5 at `l7`. The *check* tested whether a paragraph
**started with** `$$`, so a display inside a list, inside a callout, or
following text on the same line was invisible: at `l7`, 89 of 140 displays went
unexamined. It now matches whole `$$…$$` blocks wherever they sit, and the
phrases that certify a reading were tightened — a nearby "that is" or "means"
used to certify one. Inline `$…$` is not required to carry a reading (1512
spans at `l7`, most of them a bare `$x \in S$` the sentence already reads out),
but an inline span carrying three or more proof marks is a display that lost its
nerve, and is flagged.

**5. Forward-looking blocks may not spend vocabulary the reader lacks.**
`<WhereThisGoes>` used to be *exempt* from `COLLEGE_TERMS`, on the reasoning
that naming a destination is the box's whole purpose. That was backwards.
Pointing forward is the purpose; spending unexplained vocabulary is not, and a
box saying *"this opens into ring theory"* has told a 12th grader nothing
except that a thing called ring theory exists. **Name the question the next
course asks, not the noun it answers with** — *"the first question linear
algebra asks is what the scalars are allowed to be"*, not *"vector spaces are
defined over a field"*; *"the real line has no gaps"*, not *"the unique
complete ordered field"*.

**6. Rare English is its own failure mode.** Distinct from both lists above:
`OFF_REGISTER` holds technical terms, `PROSE_REGISTER` holds ordinary words in
a textbook cadence, and `OBSCURE` holds words that are simply uncommon. *"The
regress, and its two termini"* was a section heading — neither word is
mathematical, both are unknown to essentially every 17-year-old, and the
section under it says that explanations have to stop somewhere. The test for
each entry: **would a US high schooler use this word in conversation, or meet
it in a novel, a news story, or another subject's textbook?** Course
vocabulary the syllabus teaches on purpose is exempt and stays.

**7. A dense inline span is a display that lost its nerve.** Requiring a
reading on every inline `$…$` would mean glossing 1500 spans at `l7`, most of
them a bare `$x \in S$` the sentence already reads out. What earns a flag is
three or more *different* proof marks between two dollar signs mid-sentence —
a whole statement dropped into a sentence that never says what it claims.
Three exclusions, all on the same ground the density cap already excludes
proofs: inside a proof the symbols are the medium; a table of correspondences
is the object under discussion; and a span that is nothing but marks and
separators (`$\wedge, \vee, \neg$`) is a list of names, not a claim.

#### A4.1c The CCSSM arithmetic gate at `l1` and `l2` (binding)

Added 2026-08-12. §A4.2 bans fractions at `l2`, but it bans the **notation**,
and the prose walked straight past it. §4.5 at `l2` added a half to a quarter,
multiplied a half by a half, divided a half by a quarter and took a reciprocal
— 4.NF, 5.NF and 6.NS content — while calling every fraction a *piece*.
**Renaming the object does not lower the operation**, and that is the failure
this gate exists to catch.

What each grade actually has:

| Grade | Has | Does not have |
|---|---|---|
| K (`l1`) | K.CC counting to 100; K.OA adding and subtracting **within 10**; K.NBT composing 11–19 | fractions of any kind (1.G.A.3 is a year later); multiplication |
| 2 (`l2`) | 2.G.A.3 partitioning shapes into halves, thirds, fourths and **naming** them; 2.NBT to 1000; 2.OA.C.4 equal groups as groundwork | arithmetic **on** fractions (4.NF, 5.NF); multiplication and division as operations (3.OA) |

Two calibrations inside that:

- **Naming a half is allowed at `l1`**, though CCSSM places it in grade 1.
  "One cookie, two friends, snap" introduces it concretely and with a picture,
  it is everyday language a five-year-old already uses, and it is §4.5's whole
  kernel at K. What is banned is arithmetic on them — *"two quarters make a
  half"* was fraction addition at Kindergarten and is gone.
- **Chapter 5 and §7.6–§7.7 stay exempt**, as the plan already grants: their
  subject *is* the operation, and they present it concretely. A quarter turn
  followed by a quarter turn making a half turn is spatial reasoning a
  seven-year-old does when told to face west, not fraction arithmetic.

Counting is not arithmetic: "get 12 counters", "16 tiles" are fine at K, since
K.CC counts to 100 and K.NBT covers 11–19. The bound is on what is *computed*.

#### A4.1d Talking down is a defect too (binding)

Added 2026-08-12. Every other rule in §A4 points one way: is the page too hard
for its reader. This one points the other way, and the corpus needed it.

A grade-5 reader has had **factor, multiple, prime and composite** by name
since 4.OA.B.4, and multiplication and division since 3.OA. Writing *"a pile
of 6s"* and *"6 goes into 12"* for that reader is not kindness — it is another
page's vocabulary left in place. §4.2 at `l3` had gone further and coined
*"goes into"* as its own `newTerm`, while admitting one line later that the
reader already had *factor* and *multiple*; meanwhile `l4`–`l7` all said
*divides*, so a single idea carried two names down the ladder and broke the
vertical continuity §B-3 requires.

Fixed: 50 occurrences of *goes into* became *divides*, 20 of *a pile of Ns*
became *a multiple of N*, and §1.6's proof at `l3` now regroups a multiple of
$6$ into a multiple of $2$ using $6 = 3\times2$ — a factor argument, which is
what a fifth grader actually has — instead of splitting a pile into matching
pairs.

The guard is `TALKING_DOWN`, and it applies from `l3` up; `l1` and `l2` own
that vocabulary and keep it. Watch for the substitution failure it invites: a
blanket *pile of 4s → multiple of 4* produced "Being a multiple of $4$ means
it is a multiple of $4$", which is a tautology and passed every other check.

#### A4.1e The kernel may not reach forward (binding)

Added 2026-08-12. The kernel renders as **"The big idea, said for you"** above
everything else on the page, so every word in it has to be one the reader
already has. Not one the module is about to define, and certainly not one a
later module defines.

Found by checking each kernel against the position of every `newTerm`: §1.6's
kernel at `l6` cited *axiom*, which §7.1 introduces six chapters later; §3.3's
contrasted the pre-image with an *inverse function*, which arrives at §3.9;
§5.3's divided using the *conjugate*, which is §5.4; §6.1's named the *base
case* and *inductive step*, which are §6.2's terms; §1.12's leaned on *domain*,
which is §3.1. Seventeen kernels rewritten.

**No school-word exemption here** (revised 2026-08-12). §A4.1d exempts
*theorem*, *proof*, *hypothesis* and *axiom* from the forward-reference rule,
on the grounds that a geometry student has them already. That exemption was
carried into this rule too, and it was wrong: a kernel is the one place with
no room to lean on *they probably met it in geometry*. If §7.1 is where the
course says what an axiom **is**, then §1.6's kernel cannot spend the word six
chapters earlier. Seven more kernels were rewritten once the exemption came
out, including §1.6 at `l6`, which had cited both *axiom* and *theorem*.

The check also needed its own map. `declaredAt` is filtered to `COURSE_TERMS`
— the vocabulary this course is responsible for teaching — which excludes the
school words by design, so the kernel rule was reusing a map that could never
contain the terms it most needed to catch.

A kernel that **defines** its own term in the same breath is right, not wrong
— *"A statement is a sentence that is either true or false"* is exactly what a
kernel is for. What the guard catches is a kernel that *uses* a word it has
not earned.

#### A4.2 Notation gate (binding, and **derived** — do not author directly)

This table is not an independent source. It is **generated from Part B**, filtered
through §A4.1. When it disagreed with Part B it was patched six separate times
before anyone noticed the two had never been reconciled, so the ordering is now
recorded explicitly:

1. **§A4.1** (CCSSM grade calibration) is the authority on what a reader *has met*.
   Nothing may appear at a level the standards put later, whatever Part B says.
2. **Part B** is the authority on which module *introduces* each symbol, subject to 1.
3. **§A4.2** is derived from 1 and 2. If it conflicts with Part B, Part B is right
   and this table is stale — fix it here, and re-run `scripts/lint-content.mjs`.

Deriving it caught errors in Part B too: §4.8 used `√` and negatives at `l2`, §6.7
used `∅` at `l1`, and §6.2 forbade `Σ` at `l4` while §6.3 required it. All three are
now fixed in Part B. The lesson is that neither document is self-checking; the lint
is what keeps them honest.

**Three rules govern use, not just level:**

- **Not before.** A symbol introduced in module X.Y is available from X.Y onward —
  the course is read in order. Using it earlier is permitted only as a **signposted
  preview** (`§1.10`, "previewed"), because §1.1 must show what closes an open
  statement and §1.5 must state a quantified theorem.
- **Glossed on first use.** Anything introduced at a level is glossed in words, in
  every module that uses it. A module that *borrows* a term must reintroduce it or
  cross-reference the module that defines it.
- **Translated, not just keyed.** At `l4`, **every** notated display in **every**
  chapter carries a plain-English reading — the sentence a teacher would say out
  loud — introduced by "So the line reads:". A symbol key on its own is a
  dictionary, and a dictionary is not a translation: a reader handed "∈ is *is
  in*, ∧ is *and*" under a line still does not know what the line said. The
  requirement tapers above `l4` (`GLOSS_THROUGH_CHAPTER` in the lint).

**How much notation a level may carry.** Permission is not the same as density: a
page may use only allowed symbols and still be unreadable because it is *solid*
with them. The lint measures marks per 1000 words of exposition (proofs excluded,
since inside a proof the symbols are the medium) and enforces a ramp:

| Level | Grade | Marks per 1000 words | What the page looks like |
|---|---|---|---|
| `l3` | 5 | ~0 | words throughout; each symbol *shown* once in the module that introduces it, then dropped |
| `l4` | 8 | ≤ 45 | statements notated and fully translated; **proofs in words** |
| `l5` | 9 | ≤ 70 | notation in statements and in short steps; longer arguments still in words |
| `l6` | 10 | ≤ 85 | symbolic argument normal; glossed through Chapter 6 |
| `l7` | 12 | ≤ 105 | reads like a textbook; glossed through Chapter 5 |
| `l8` | college | ≤ 130 | unrestricted |

The earlier caps were each level's own 90th percentile, which ratified whatever
the level happened to look like — and left `l4` (110) heavier than `l6` (90),
which is backwards. These are a deliberate ramp, and the gap between a level's
current density and its cap is the remaining worklist.

| Level | Newly permitted | Introduced at | Explicitly banned |
|---|---|---|---|
| `l1` | numerals 0–10; the mapping arrow `→` in prose (`name → first letter`) | §3.2 | every other symbol, including `+` |
| `l2` | `+`, `−`, `=`, `>`, `<`, numerals to 1000 | — | `×`, `÷`, fractions, negatives, letters-as-numbers, `∈`, `√`, `∅` |
| `l3` | `×`, `·`, `÷`, fractions, decimals, `{ }`, `∈`, `∉`, `⊆`, `∪`, `∩`, `≠`, `≤`, `≥`, the complement bar, set-builder `{x \| …}` with the bound letter as a **slot**; and in Chapter 3, `f(x)`, `f : S → T` (§3.1) and `g ∘ f` (§3.7); in Chapter 5, a letter naming a complex number and `√` for the modulus (§5.4, §5.6) | §2.1–2.4, §3.1, §3.7 | letters standing for *numbers* in general algebra; negatives; `ℕ ℤ ℝ`; four-quadrant grids |
| `l4` | letters as numbers, `√`, `¬`, `∧`, `∨`, `⇒`, `∅`, `ℕ ℤ ℚ ℝ`, truth tables, negatives, exponents; `≡` (§1.4), `⇔` (§1.9), `∀ ∃ ∃!` (§1.10), intervals and `∞` (§2.2), `f⁻¹` as the **pre-image operator** (§3.3) | §1.2–1.10, §2.2, §3.3 | `Σ`, `∏` |
| `l5` | `f(x)` outside Chapter 3, `∣` (divides), `↦` | §4.2 | `Σ`, `∏` |
| `l6` | `f⁻¹` as an **inverse function** (§3.9), `⊕`, subscripted families | §3.9 | `Σ`, `∏`, limits |
| `l7` | `Σ`, `∏`, `ℂ`, `e^{iθ}`, factorials, informal limits | §5.2, §6.3 | — |
| `l8` | full Math 0 notation plus forward references | — | — |

**The `l3` rule deserves emphasis.** A fifth grader has met *numerical* expressions
with parentheses (5.OA.A.1–2) and no variables at all (6.EE.A.2 is grade 6). The
carve-outs above are the ones Part B explicitly requires — you cannot teach §3.1
without `f(x)`, or §3.7 without `∘` — and each is confined to the chapter that needs
it. A letter doing *arithmetic*, or compared against a *numeral*, is still banned.

### A5. Voice and treatment per level

Generation of content must follow these profiles exactly. Each names the **reader's current maths class**, because the strongest thing a page can do is connect to what the reader is doing this week.

**`l1` Kindergarten.** Second person, present tense, **6–12 word sentences**, median 8. One clause per sentence. Everything is a physical object or a person: blocks, animals, a toy box, Sam, Noodle the cat, the reader themselves. Nothing above 10; no negatives, no fractions, no symbols at all. **No jargon** — *promise*, *rule*, *the one that breaks it* carry the same load. Every module ends with **one thing to do**, a 30-second physical activity. One new word per module, repeated three times. If a passage reads awkwardly aloud it is wrong; the ear is the editor.

**`l2` 2nd grade.** *Reader's class: adding and subtracting within 100, place value to hundreds, telling time, naming shapes.* Same warmth, longer chains — can hold a two-step argument ("we know this, so that, so this"). Sentences 8–12 words. **Counting and repeated adding only: no `×`, no `÷`, no fractions-as-numbers, no negatives.** Where an argument would want multiplication, use equal groups and repeated addition, which is exactly how 2.OA.C.4 frames arrays. Where it would want a fraction, use *half of the shape* or *one of the three equal pieces* — the 2.G.A.3 framing. Even/odd is available and should be used freely, because pairing is on-grade (2.OA.C.3) and is the perfect concrete model for a proof. Formal vocabulary still avoided: *promise*, *the bad case*, *the one that breaks it*. Pictures carry the argument; words carry the reason. Ends with `<TryIt>`.

**`l3` 5th grade.** *Reader's class: fraction arithmetic, decimals, volume, plotting points in the first quadrant, sorting shapes into a hierarchy.* The turn to *why*. Full sentences, 12–16 words, and a real argument that ends in "so it has to be true." Introduces the Discussion/Proof shape explicitly and the `□`. **No letters standing for numbers and no negative numbers** — see §A4.2. The arbitrary-element move is done in words: *take any one of them and follow it*. Set names as labels (`A`, `B`) are fine and are the first symbols the reader meets; gloss each on first use. Lean on **5.G.B.3–4**, classifying shapes into a hierarchy — every square is a rectangle is a genuine, on-grade example of a subset and of a conditional, and it should be the workhorse example of Chapters 1 and 2. Other examples: factors and multiples, fraction arithmetic, area, patterns in tables.

**`l4` 8th grade.** *Reader's class: linear equations and systems, `y = mx + b`, exponents and scientific notation, irrational numbers, congruence by rigid motions, Pythagoras.* Pre-algebra fluency assumed: letters as numbers, negatives, exponents, the full coordinate plane. Proofs are real proofs, in paragraphs of 3–8 sentences. Formal vocabulary lands here: hypothesis, conclusion, converse, contrapositive, counterexample, set, subset, function, domain, codomain. Truth tables appear. **Function notation `f(x)` is *not* on-grade** (it is HSF-IF.A.2) — Chapter 3 may introduce it, but must do so explicitly as new notation with a gloss, and Chapters 1–2 should avoid it. Two on-grade anchors are worth using hard: the reader **already knows √2 is irrational** (8.EE.A.2) but has never seen why, which makes module 4.7 a genuine payoff; and the reader **already has the exact definition of a function** (8.F.A.1), which makes module 3.1 a formalization of something familiar rather than a new idea.

**`l5` 9th grade.** *Reader's courses: **Algebra I complete**, and **Geometry just started**.* Quantifiers introduced. Proofs a paragraph or two, with the Discussion doing real planning work. Function notation is familiar and can be used freely.

Two supplies, and the division between them is what fixes this rung:

- **From Algebra I, everything.** Quadratics, factoring, systems, inequalities, exponent rules, radicals, absolute value, exponential growth, arithmetic and geometric sequences. These carry the worked examples.
- **From Geometry, only the opening weeks.** Undefined terms; definitions as biconditionals; segment and angle addition; midpoint and bisector; vertical angles and linear pairs; and — the important one — **the two-column proof, met for the first time and still unfamiliar.**

**Where Part B was overridden at `l5`.** Part B was written against the traditional pathway, so four of its `l5` treatment lines assume material this reader has not met. §A4.1 outranks Part B (see §A4.2's authority note), so these were substituted rather than followed:

| Module | Part B says | `l5` does instead |
|---|---|---|
| §2.4 | roots of `sin x` and `cos x` | solution sets of a **system of equations** — a better anchor anyway, since intersecting two lines *is* an intersection of sets |
| §3.2, §3.8 | `eˣ`, `ln x` | `2ˣ`, `1/x`, `√x` — Algebra I exponentials; `ln` is Algebra II |
| §5.7–§5.9 | core | **`touch`** — Euler's formula, polar form and De Moivre all need trigonometry and series. The geometric content (arc length on the unit circle, "multiply the distances and add the angles") is reachable and is what those pages give; the derivations are named as what later tools will deliver |
| Chapter 6 | — | sums written longhand (`1 + 3 + ⋯ + (2n−1)`), since §A4.2 gates `Σ` to `l7` |

**What `l5` may not use is the rest of the geometry course.** Triangle congruence criteria (SAS/ASA/SSS), similarity, circle theorems, the polygon angle-sum and the parallel postulate all arrive later in the year, and they are `l6`'s working toolkit. Reserving them is what keeps the two rungs apart, and it gives the pair a clean division of labor: **`l5` is meeting the two-column proof; `l6` has the whole theorem set and is ready to be shown why mathematicians abandon the two-column format.** Where `l5` wants a geometric example it should reach for a definition or a segment/angle computation, not a theorem.

**`l6` 10th grade.** *Reader's course: Geometry — the proof course.* This is the most important connection in the whole ladder: the reader has met two-column proofs, and geometry is where they met them.

#### A5.0 Two rules that override every profile below

**1. A level may assume only what was taught *before* its own year.** A reader is
taking this year's course now; they have not finished it. So the 8th grader
taking Algebra I knows grade 7, the 9th grader taking Geometry knows Algebra I,
the 12th grader taking Calculus knows Precalculus. Writing to the course a
reader is *in* assumes knowledge they are in the middle of acquiring.

| Level | Grade | Course they are taking | May assume up to |
|---|---|---|---|
| `l1` | K | — | counting to 10 |
| `l2` | 2 | grade 2 | grade 1 |
| `l3` | 5 | grade 5 | grade 4 |
| `l4` | 8 | **Algebra I** | grade 7 |
| `l5` | 9 | **Geometry** | Algebra I |
| `l6` | 10 | Algebra II | Geometry |
| `l7` | 12 | Calculus | Precalculus |
| `l8` | college | — | — |

**2. No proof notation may be used before it is introduced, at any level.**
`∀ ∃ ⇒ ⇔ ¬ ∧ ∨ ∈ ⊆ ∪ ∩ ∅ ≡ ∘ ↦ ∤` and the blackboard-bold sets are **not
taught anywhere in the American K–12 curriculum** — they belong to college
discrete mathematics. Lexile-appropriate prose around an unexplained `∀` is
still unreadable. Every symbol must be introduced in words at its first
appearance *in reading order for that level* (§1.1 first, then §1.2, …), and
that includes symbols appearing only inside a worked example.

The order to fix in is `l7` downward, because the higher levels lean on notation
hardest and the vocabulary decisions there set the ceiling for everything below.

**A note on tracking.** The grade labels straddle two real sequences. The CCSSM *traditional pathway* puts Algebra I in 9th, Geometry in 10th, Precalculus in 12th, and it is the modal US sequence: roughly 69% of Algebra I students take it in grade 9 or 10, against 25% in grade 7 or 8. The accelerated track (Algebra I in 8th, Geometry in 9th, Calculus in 12th) is common and is the *norm* in high-achieving districts.

`l5` is written to the **accelerated** track — Algebra I finished, Geometry just beginning — and `l6` to a reader with the geometry course **in hand**. Those two descriptions are what the pages are calibrated to, and they order correctly under either pathway: a traditional-track 10th grader finishing Geometry and an accelerated-track 9th grader finishing it are the same reader for our purposes. The grade numbers are a label on the rung, not a claim about the reader's timetable, and the rung is defined by the course. So a meaningful minority of `l6` readers took Geometry last year, and a meaningful minority of `l7` readers are already in Calculus rather than about to start it.

**Write to the course, not to the enrolment.** Phrase geometry hooks so they land whether the reader is in the course now or finished it a year ago: *"your geometry course defines…"*, *"the two-column format taught in geometry…"* — never *"you are being taught right now"* or *"this year you have been writing."* The connection is to material the reader has met, and present-tense enrolment claims are the only part that breaks under an off-by-one-year reader. The same applies at `l7`: `<WhereThisGoes>` may say calculus and linear algebra are where this goes without asserting the reader has not started them.

Every module should be explicit about the correspondence — a two-column proof's *statement* column is the chain of assertions and its *reason* column is what paragraph proofs carry in the words *since*, *because*, and *therefore*. Show at least one argument both ways in Chapter 1, then explain why working mathematicians write paragraphs. Use the reader's own theorems as examples: vertical angles, the isosceles base-angle theorem, the triangle angle sum, ASA/SAS/SSS, and the definition of congruence via rigid motions. Adds function composition, inverses, and the first genuinely abstract arguments (sets of sets, functions between arbitrary sets).

**`l7` 12th grade.** *Reader's course: Precalculus — trig identities, sequences and series with Σ, complex numbers in polar form, informal limits, vectors, conics.* On the accelerated track this reader is in Calculus instead, so assume precalculus as the **floor** rather than the ceiling: draw examples from it, and let calculus references land as either preview or reinforcement. Very close to the Math 0 text in rigor; differs by explaining the moves the notes leave implicit. **Draw examples from precalculus, not from later subjects.** The double-angle identities falling out of De Moivre (module 5.9), telescoping sums (6.3), and the exponential series (5.7) are on-grade and land hard. Forward references to abstract algebra, topology, and analysis belong at `l8`, not here — at `l7`, a `<WhereThisGoes>` should point at calculus and linear algebra, the courses this reader is at or near. Phrase those blocks so they work for a reader who has already started calculus — *"the chain rule is a theorem about composition"* rather than *"when you get to calculus you will meet…"*. Complete proofs with full Discussion sections.

**`l8` College.** The Math 0 experience as intended: complete, unhedged, with a **"Where this goes"** closer naming the field each module opens (rings and fields → abstract algebra; pre-images → topology; equivalence relations → quotient constructions; Peano → logic and foundations).

### A6. Anchor examples

To keep the ladder vertically aligned, each chapter has a running example that appears at every level in age-appropriate dress. **Each cell below is checked against §A4.1** — the `l3` column uses no variables and no negatives, and the `l2` column uses no multiplication and no fractions.

| Chapter | `l1`–`l2` form | `l3` form (no variables, no negatives) | `l4` form | `l6`–`l7` form |
|---|---|---|---|---|
| 1 Logic | Sam's dog; if it rains, we take an umbrella | If a shape is a square, it is a rectangle (5.G.B.3) | If x > 1 then x² > 1 | Same, plus contrapositive of a conjunctive hypothesis |
| 2 Sets | The toy box; sorting hoops | The shape hierarchy: squares ⊆ rectangles ⊆ quadrilaterals | Intervals in ℝ; divisors of 20 and 24 | Roots of sin x and cos x |
| 3 Functions | Each kid to their cubby | Letter → position in the alphabet | The rule "input → exactly one output" (8.F.A.1) | f: ℝ → ℝ₊, f(x) = eˣ |
| 4 Numbers | Even/odd by pairing; leftovers when sharing | Factors, multiples, remainders | Divisibility as ∃k; √2 irrational (8.EE.A.2) | ℤ as a ring, ℚ as a field |
| 5 Complex | Quarter turns; compass directions | Rotating a card a quarter turn on a grid | The number that turns; a + bi | e^{iθ} = cos θ + i sin θ; De Moivre |
| 6 Induction | Dominoes; stacking blocks | 1+3+5+… as L-shaped shells building squares | Σ notation deferred; write the sum out | Σ, telescoping, nth derivatives |
| 7 Peano | "What comes next?" machine | Counting as pressing *next*; naming what comes next | Defining + from S by recursion | Successor function, Axiom of Induction |

**Chapter 1's `l3` anchor changed** from "multiple of 6 is even" to **the shape hierarchy**, because 5.G.B.3–4 puts exactly this reasoning on-grade in fifth grade: *attributes belonging to a category also belong to all subcategories.* That is a conditional, a subset claim, and a counterexample generator (a rectangle that is not a square) in one on-grade package. Divisibility examples remain available at `l3` — factors and multiples are grade-4 content — but must be phrased without variables.

### A7. Content model

Every module has one entry per level. Directory layout:

```
content/
  chapters/
    01-logic/
      _chapter.json          # chapter meta, shared across levels
      01-what-is-a-claim/
        _module.json         # kernel, objectives, vocab, prerequisites
        l1.mdx  l2.mdx  l3.mdx  l4.mdx  l5.mdx  l6.mdx  l7.mdx  l8.mdx
      02-not/
        ...
  glossary/
    glossary.json            # term → per-level definition
  levels/
    levels.json              # level profiles (labels, budgets, notation)
```

**`_module.json` schema:**

```json
{
  "id": "1.2",
  "slug": "not",
  "chapter": "01-logic",
  "order": 2,
  "titles": {
    "l1": "The opposite",
    "l2": "Saying the opposite",
    "l3": "Opposites: negation",
    "l4": "Negation",
    "l5": "Negation", "l6": "Negation", "l7": "Negation", "l8": "Negation"
  },
  "kernelIdea": "Negating a statement always flips its truth value; the negation of a true statement is false and vice versa.",
  "kernels": {
    "l1": "The opposite of a true telling is a not-true telling. They can't both be right.",
    "l2": "Every telling has an opposite. If the telling is true, its opposite is false. If the telling is false, its opposite is true.",
    "l3": "The negation of a statement flips its truth value: the negation of a true statement is false, and the negation of a false one is true.",
    "l4": "For a statement p, the negation ¬p is true exactly when p is false. p and ¬p are never both true and never both false.",
    "l5": "Negating a statement flips its truth value; ¬p is true iff p is false.",
    "l6": "For any statement p, ¬p has truth value opposite to p's. Consequently p ∧ ¬p is a contradiction and p ∨ ¬p is a tautology.",
    "l7": "Negation is the unary connective ¬ that inverts truth value; p and ¬p partition the truth-value assignments.",
    "l8": "Negation is the involution on the two-element Boolean algebra: ¬¬p = p, and p ⊕ ¬p is identically true."
  },
  "objectives": [
    "State the negation of a given claim",
    "Recognize that a claim and its negation cannot both be true"
  ],
  "sourceRef": "Math 0 §1.1.1",
  "vocabulary": ["negation", "opposite", "truth value"],
  "prerequisites": ["1.1"],
  "treatment": { "l1": "touch", "l2": "core", "l3": "core", "l4": "core",
                 "l5": "core", "l6": "core", "l7": "core", "l8": "core" },
  "namedMove": null
}
```

**`kernelIdea` vs `kernels`.** `kernelIdea` is a single sentence that fixes the mathematical thing every level must carry — used by authors, linters, and reviewers as the invariant to check against. It is *not* displayed. `kernels` is a per-level object: each level's entry is the sentence that will be rendered on that level's invariant band. Every level's kernel must be a faithful restatement of `kernelIdea` in vocabulary and notation the reader has met (see §A4), and every level's kernel must be present — no level is exempt. A `touch` treatment still gets a kernel; touch changes body length, not the band.

`treatment` is `core` (full module) or `touch` (a short, honest, intuitive encounter — used at `l1`/`l2` for the hardest material like Taylor series or the Axiom of Induction). **No module is ever absent at any level.** A `touch` page still carries the kernel; it just carries it in 80 words and a picture.

**`lN.mdx` frontmatter:**

```yaml
---
level: l3
title: "Opposites: negation"
readingTimeMin: 4
newTerms: ["negation"]
anchorExample: "multiples of 6"
readAloud: false
---
```

MDX body uses a small set of custom components (defined in Part C6): `<BigIdea>`, `<Discussion>`, `<Proof>`, `<TryIt>`, `<Aside>`, `<Warning>`, `<WhereThisGoes>`, `<TruthTable>`, `<Figure>`.

---

## Part B — The syllabus

61 modules across 7 chapters, covering every concept in the Math 0 notes. Each entry gives the **kernel** (fixed across levels), **objectives**, **source reference**, and a **ladder** describing the treatment at each level. Ladder rows group levels where the treatment differs only in polish.

Legend: ● = core treatment, ○ = touch treatment.

### Chapter 1 — Logic: how to say true things

*Chapter question: how do you know when you actually know?*

---

**1.1 What is a claim?** — Math 0 §1.1
**Kernel:** A statement is a sentence that is either true or false; questions, commands, and fragments are not. You don't need to know which it is for it to be a statement.
**Objectives:** Sort sentences into statements/non-statements · give an example of each · recognize that some statements have unknown truth value (conjectures).
- `l1` ● "Is that true or is that silly?" Sort spoken sentences: *the cat has four legs* (true), *the cat has nine legs* (false), *pick up the cat* (not a telling — it's an asking). One thing to do: say three tellings, one silly.
- `l2` ● Adds: some tellings you can check right now, some you'd have to go look. Introduce "we don't know yet, but it's still a telling."
- `l3` ● Term *statement*. Non-examples matter: `x + 1` is not a statement (no verb, nothing to be true about); "Factor x²+2x+1" is a command. Introduce open statements with a variable (`x ≥ 1`) whose truth depends on x. Introduce *conjecture* via Twin Primes, framed as "a question nobody has been able to close in 200 years."
- `l4` ● Full Math 0 example list. Truth value as a formal notion (T/F). The job of mathematics framed as assigning truth values via proof.
- `l5`–`l6` ● Adds: statements about infinitely many cases can't be checked by example. Goldbach and Twin Primes as live conjectures; Fermat's Last Theorem as a conjecture that became a theorem.
- `l7`–`l8` ● Math 0 text in full. `l8` adds: decidability and the existence of statements neither provable nor disprovable (Gödel, named only).

---

**1.2 Not** — Math 0 §1.1.1
**Kernel:** Negation flips truth value. A statement and its negation are never both true and never both false.
**Named move:** *the opposite*.
**Objectives:** Produce the negation of a claim · state that exactly one of p, ¬p is true.
- `l1` ● Opposite game: *the door is open* / *the door is not open*. Physical: point at things, say the opposite. Establish that both can't be true at once.
- `l2` ● Negating carefully: the opposite of *all the blocks are red* is not *all the blocks are blue* — this misconception is worth catching this early.
- `l3` ● Term *negation*. Negating inequalities: the opposite of `x ≥ 1` is `x < 1`, not `x ≤ 1`. Negating "infinitely many" → "finitely many."
- `l4` ● Symbol `¬p`. Truth table for negation. Double negation.
- `l5`–`l6` ● Negation of compound and quantified language previewed. Common error drill: negation vs. opposite-extreme.
- `l7`–`l8` ● Math 0 examples including negating Twin Primes.

---

**1.3 And, or** — Math 0 §1.1.2
**Kernel:** *p and q* is true only when both are; *p or q* is true when at least one is (inclusive or). A statement always false is a contradiction; always true, a tautology.
**Objectives:** Evaluate compound claims · state that mathematical *or* includes both · give an example of a contradiction and a tautology.
- `l1` ● Sorting with two hoops. "Red AND round" vs "red OR round" — the child physically places the object. Establish that "or" lets you take things that are both.
- `l2` ● Same, in sentences. Introduce "it's raining and it's cold" checking. Contradiction as "a telling that can never be true" (*the door is open and the door is not open*); tautology as "a telling that can never be false."
- `l3` ● Terms *and*/*or* as connectives; the inclusive-or point made explicitly against everyday English ("soup or salad"). Terms *contradiction*, *tautology*, via `p ∧ ¬p` and `p ∨ ¬p` in words.
- `l4` ● Symbols `∧`, `∨`. Full truth tables for both. Contradiction/tautology defined by their truth-table columns.
- `l5`–`l6` ● Compound truth tables with three variables; logical equivalence introduced as "same final column."
- `l7`–`l8` ● Math 0 text; `l8` notes the correspondence to intersection/union (forward ref to Ch. 2) and to Boolean algebra.

---

**1.4 De Morgan's logic laws** — Math 0 §1.1.3
**Kernel:** ¬(p ∧ q) ≡ ¬p ∨ ¬q and ¬(p ∨ q) ≡ ¬p ∧ ¬q. Negation swaps *and* with *or*.
**Objectives:** Negate a compound statement correctly · explain why the connective flips.
- `l1` ○ One picture: "It is NOT true that I have a hat and a coat" — act it out, discover you might have just the hat. Conclusion in child words: *no hat, or no coat*.
- `l2` ● Same with a checklist. Introduce the flip as a rule to remember: crossing out an AND makes an OR.
- `l3` ● Both laws in words with worked examples (Math 0's "21 is not a multiple of 4 or 5").
- `l4` ● Symbolic statement, verified by truth table. Term *logically equivalent*, symbol `≡`.
- `l5`–`l6` ● Applied to negating real hypotheses; sets up contrapositives of conjunctive hypotheses.
- `l7`–`l8` ● Math 0 text; the rational/irrational contrapositive example (§1.2.2) is previewed here.

---

**1.5 If–then** — Math 0 §1.1.4
**Kernel:** *If p then q* claims only that q holds whenever p does. It is false only when p is true and q is false — so it is automatically true when p is false (vacuous truth).
**Objectives:** Identify hypothesis and conclusion · determine the truth of a conditional in all four cases · explain vacuous truth without discomfort.
- `l1` ● Promises. "If it rains, I'll bring the umbrella." When did I break my promise? Only rain-and-no-umbrella. If it doesn't rain, I kept my promise no matter what — this is the whole vacuous-truth idea and five-year-olds get it.
- `l2` ● Same, with a chart of the four cases drawn as weather + umbrella pictures.
- `l3` ● Terms *if–then / conditional*, *hypothesis*, *conclusion*. Worked with divisibility ("if a number is a multiple of 6, it is even"). Emphasize: the conditional says nothing about numbers that aren't multiples of 6.
- `l4` ● Symbol `p ⇒ q`, full truth table, term *vacuously true*. Math 0's three worked examples with 25.
- `l5`–`l6` ● Conditionals with variables; the difference between "this conditional is true" and "the hypothesis is true."
- `l7`–`l8` ● Math 0 text; `l8` adds material conditional vs. implication in natural language.

---

**1.6 Your first proof** — Math 0 §1.1.5
**Kernel:** To prove *if p then q*, assume p and reason to q using facts already established. A proof is written in full sentences.
**Named move:** *start from what you're given*.
**Objectives:** Recognize the Discussion/Proof structure · write a two-to-three step direct argument · recognize the end-of-proof marker.
- `l1` ○ "Show me how you know." Child explains why the block tower will fall — an argument, out loud, with a because in it. Name it: *a reason chain*.
- `l2` ● Written reason chains: *We know Sam has 4 apples. We know Sam gets 2 more. So Sam has 6.* Introduce What we know / What we want / What we'll do.
- `l3` ● First real proof. Suggested statement: *if a number is a multiple of 6, it is even* (uses only "multiple"). Full Discussion + Proof, in English sentences. Introduce □.
- `l4` ● Math 0's proposition: if x > 1 then x² > 1, with the multiplication-of-inequalities rule stated as the tool used. Emphasize proof-as-essay, not calculation.
- `l5`–`l6` ● Same, plus a second worked direct proof (e.g. sum of two evens is even) and a checklist for what a finished proof must contain.
- `l7`–`l8` ● Math 0 text verbatim in substance, plus commentary on why Discussion sections exist and disappear from published mathematics.

---

**1.7 Converse, inverse, contrapositive** — Math 0 §1.2, §1.2.1, §1.2.2
**Kernel:** From p ⇒ q you can form q ⇒ p (converse), ¬p ⇒ ¬q (inverse), ¬q ⇒ ¬p (contrapositive). Only the contrapositive is logically equivalent to the original.
**Named move:** *flip it around*.
**Objectives:** Build all three from a given conditional · give a counterexample showing converse/inverse can fail · state the equivalence of contrapositive.
- `l1` ○ Umbrella promise, reversed: "If I have the umbrella, is it raining?" Not necessarily — maybe I just like it. One picture, one conclusion: *flipping a promise around doesn't give you the same promise.*
- `l2` ● Same with two or three examples, including one where the flip happens to be true too, so "sometimes true" is distinguished from "always true."
- `l3` ● All three named. Worked with "if a polygon is a square it is a rectangle." Show the contrapositive is the one that survives.
- `l4` ● Symbolic. Math 0's x > 1 / x² > 1 example with x = −3 as the counterexample killing both converse and inverse. Truth-table verification of `p ⇒ q ≡ ¬q ⇒ ¬p`.
- `l5`–`l6` ● Contrapositive of a conjunctive hypothesis using De Morgan (Math 0's rational + irrational example) — this is the module where 1.4 pays off.
- `l7`–`l8` ● Math 0 text in full.

---

**1.8 Proof by contrapositive** — Math 0 §1.2.3
**Kernel:** Proving ¬q ⇒ ¬p proves p ⇒ q. Choose it when the hypothesis you're handed is awkward to compute with.
**Objectives:** Decide when the contrapositive is easier · write a proof that announces the switch and completes it.
- `l1` ○ Not attempted as proof; framed as: sometimes the easiest way to show a promise is kept is to check the promise *backwards*.
- `l2` ○ One worked backwards-check in words.
- `l3` ● First contrapositive proof, in words: *if n² is odd then n is odd*, proved as *if n is even then n² is even* using multiples of 2 without algebra.
- `l4` ● Math 0's proposition: if x³ < 0 then x < 0, with the Discussion explaining *why* direct proof is painful here.
- `l5`–`l6` ● Two worked examples plus a decision rule: if the hypothesis is a negative statement or is about a composite quantity, try the contrapositive.
- `l7`–`l8` ● Math 0 text in full.

---

**1.9 If and only if** — Math 0 §1.2.4
**Kernel:** p ⇔ q means both p ⇒ q and q ⇒ p. Proving it means writing two proofs.
**Objectives:** Split a biconditional into its two halves · prove both directions, using a contrapositive for one where useful.
- `l1` ○ "You get dessert exactly when you eat your peas" — two promises in one, discovered by asking both questions.
- `l2` ● Same, made explicit as two separate promises to check.
- `l3` ● Term *if and only if*. Worked: a number is even if and only if its last digit is 0,2,4,6,8 — both directions in words.
- `l4` ● Symbol `⇔`. Math 0's theorem: *n is even iff n² is even*, both directions, with the second done by contrapositive. Definitions of even/odd as `n = 2k`, `n = 2k+1` land here.
- `l5`–`l6` ● Same proof at full rigor, plus discussion of why definitions are usually biconditionals.
- `l7`–`l8` ● Math 0 text in full; `l8` notes iff-chains and the risk of reversible-step "proofs."

---

**1.10 For all, there exists** — Math 0 §1.3.1, §1.3.2
**Kernel:** *For all* claims something about every case; *there exists* claims at least one case. *There exists exactly one* claims existence and uniqueness.
**Objectives:** Classify a claim as universal or existential · state what evidence each demands.
- `l1` ● Two shapes of claim, physically: *every block in this box is red* (check them all) vs *there is a red block in this box* (find one). One thing to do: make each kind of claim about a real pile.
- `l2` ● Adds "there is exactly one" — the only red block. Introduce the asymmetry: proving *every* is hard, proving *some* is easy.
- `l3` ● Terms *for all*, *there exists*, *unique*. Examples: every square number is ≥ 0; there is a number whose double is 7.
- `l4` ● Symbols `∀`, `∃`, `∃!`, and set membership in the quantifier (`∀x ∈ ℝ`). Math 0's `3x − 1 = 0` example.
- `l5`–`l6` ● Nested quantifiers introduced lightly (for every x there is a y…), and order-matters demonstrated with one example.
- `l7`–`l8` ● Math 0 text; `l8` adds quantifier order as the source of the ε–δ definition's difficulty (forward ref to analysis).

---

**1.11 Negating quantifiers and counterexamples** — Math 0 §1.3.3
**Kernel:** ¬(∀x p(x)) ≡ ∃x ¬p(x) and ¬(∃x p(x)) ≡ ∀x ¬p(x). A single counterexample destroys a universal claim.
**Named move:** *one bad apple*.
**Objectives:** Negate quantified statements · produce a counterexample to a false universal claim.
- `l1` ● The one-bad-apple game: I claim every animal in the picture has four legs; the child finds the bird. Establish that finding one is enough, and that this feels good.
- `l2` ● Adds the other direction: to knock down "there is a purple block," you have to check all of them.
- `l3` ● Term *counterexample*. Both negation rules in words. Worked: "every prime is odd" → 2.
- `l4` ● Symbolic negation rules. Math 0's examples (`∃x, x² = −1`; "for all x, x is positive or negative" with x = 0, using De Morgan).
- `l5`–`l6` ● Negating nested quantifiers; negating statements with both quantifiers and connectives.
- `l7`–`l8` ● Math 0 text in full.

---

**1.12 Proving and disproving quantified statements** — Math 0 §1.3.4
**Kernel:** Prove ∀ by arguing about an arbitrary element; disprove ∀ with one counterexample. Prove ∃ by exhibiting a witness; disprove ∃ by proving the universal negation. Prove ∃! by exhibiting and then showing any two candidates coincide.
**Objectives:** Choose the right strategy for each of four cases · write an arbitrary-element proof · write a uniqueness argument.
- `l1` ○ Two ways to be right, two ways to be wrong — a picture chart, no proof.
- `l2` ● The four cases as a chart, with a story for each.
- `l3` ● Arbitrary-element proof in words: every number of the form n² − 1 with n ≥ 3 can be split into two factors (using Math 0's factoring, arithmetic only).
- `l4` ● Math 0's four worked items: n² − 1 composite; primes-are-odd disproof; unique solution to 3x − 1 = 0; no real x with x² < 0 (proof by cases). Introduces *proof by cases* as a named move.
- `l5`–`l6` ● Same, with the uniqueness pattern ("suppose x and y both work; show x = y") drilled as a reusable template.
- `l7`–`l8` ● Math 0 text in full; `l8` adds "arbitrary but fixed" as the subtle point in universal proofs.

---

### Chapter 2 — Sets: the boxes everything lives in

*Chapter question: what is a mathematical object made of?*

---

**2.1 What is a set?** — Math 0 §2.1, §2.1.1
**Kernel:** A set is a well-defined collection; `x ∈ S` says x belongs. Sets are unordered and repetition is irrelevant. The empty set is a set. ℕ, ℤ, ℝ are the standard number sets.
**Objectives:** Decide whether a collection is well-defined · use ∈ and ∉ · state that {a,b,c} = {b,c,a} · name ℕ, ℤ, ℝ.
- `l1` ● The toy box. Things that are in, things that are out. "Is a shoe in the toy box?" Well-defined: the rule must be one everyone agrees on ("all the red things" works; "all the nice things" doesn't).
- `l2` ● Naming boxes with letters. Empty box is still a box. Order doesn't matter: the same three animals in a different order is the same group.
- `l3` ● Terms *set*, *element*, symbols `∈`, `∉`, `{ }`, `∅`. Sets of numbers: counting numbers, whole numbers including negatives. Notation ℕ, ℤ, ℝ introduced with the caution that ℕ's inclusion of 0 is a convention.
- `l4` ● Formal listing notation, the well-defined requirement, and the ℕ/ℤ/ℝ tower.
- `l5`–`l6` ● Adds ℚ and the observation that "set" is left undefined on purpose (naive vs axiomatic).
- `l7`–`l8` ● Math 0 text; `l8` adds Russell's paradox in a sentence, motivating why "well-defined" is doing real work.

---

**2.2 Set-builder notation** — Math 0 §2.1.2
**Kernel:** `{x | p(x)}` is the set of all x making p(x) true — a set defined by a condition rather than a list. This is where Chapter 1 gets used.
**Objectives:** Read and write set-builder notation · translate between listed sets, conditions, and intervals.
- `l1` ○ "The box of all the round things" — a box made by a rule instead of by putting things in one at a time.
- `l2` ● Rule-boxes vs list-boxes, with the same box described both ways.
- `l3` ● Notation `{x | condition}` read aloud as "the set of all x such that…". Examples: `{n | n is a whole number between −2 and 5}` unpacked to a list.
- `l4` ● Restricting a bigger set: `ℕ = {x ∈ ℤ | x ≥ 0}`. ℚ in set-builder form with the q ≠ 0 condition and the equality convention `p₁q₂ = p₂q₁`. Interval notation.
- `l5`–`l6` ● Adds ℂ = `{a + bi | a,b ∈ ℝ}` as a forward reference, and sets defined by equations (`{x ∈ ℝ | x² − 1 = 0}`).
- `l7`–`l8` ● Math 0 text in full.

---

**2.3 Subsets** — Math 0 §2.1.3, §2.1.4
**Kernel:** A ⊆ S means every element of A is in S. To prove it, take an arbitrary x ∈ A and show x ∈ S. ∅ is a subset of everything (vacuously). Subset is transitive.
**Named move:** *take any one and follow it*.
**Objectives:** Decide subset relations · write an element-chasing subset proof · explain why ∅ ⊆ S.
- `l1` ● A little box inside a big box: all the red blocks are inside all the blocks. Check by taking each red block and finding it in the big box.
- `l2` ● Term *part of*. The empty box counts as a part of every box — tie back to promises with nothing to check (1.5).
- `l3` ● Symbol `⊆`. First subset proof in words with intervals or number sets. Transitivity proved: if every A is a B and every B is a C, then every A is a C.
- `l4` ● Math 0's interval proposition (S = (−3,5) ⊆ T = (−6,5]) with full Discussion/Proof, and the abstract transitivity proposition. Element-chasing named as *the* technique of set theory.
- `l5`–`l6` ● Adds proper subsets, and ℤ ⊆ ℚ, ℝ ⊆ ℂ as proofs rather than assertions.
- `l7`–`l8` ● Math 0 text in full; `l8` notes ⊂ vs ⊆ conventions.

---

**2.4 Union and intersection** — Math 0 §2.1.5
**Kernel:** S ∪ T holds anything in at least one; S ∩ T holds things in both. S ⊆ S∪T and S∩T ⊆ S always. Disjoint means empty intersection.
**Objectives:** Compute unions/intersections · connect ∪/∩ to or/and · recognize gcd and lcm as intersection phenomena.
- `l1` ● Two hoops on the floor, overlapping. Put the toys where they belong. Union = everything in either hoop; intersection = the overlap.
- `l2` ● Venn diagrams drawn by the reader. Disjoint = hoops that don't overlap.
- `l3` ● Symbols `∪`, `∩`, and the explicit link: union is *or*, intersection is *and*. Math 0's divisor example (D₂₀ ∩ D₂₄ = {1,2,4}) with the observation that the largest element is the gcd — a genuine payoff at this age.
- `l4` ● Adds multiples (M₁₂ ∩ M₁₈ and lcm), the containment facts, and disjointness.
- `l5`–`l6` ● Math 0's trig example: roots of sin x and roots of cos x, their union and their disjointness.
- `l7`–`l8` ● Math 0 text; `l8` adds indexed unions/intersections over arbitrary families.

---

**2.5 Complements and "suppose not"** — Math 0 §2.1.6
**Kernel:** The complement of A in S is everything in S not in A — so it depends on S. Proof by contradiction: assume the negation of what you want, derive an impossibility, conclude.
**Named move:** *suppose not*.
**Objectives:** Compute complements relative to a stated universe · write a short proof by contradiction · prove A ⊆ B implies B̄ ⊆ Ā.
- `l1` ● "Everything that's NOT in the box." Physically gather them. Notice: it depends what room you're in.
- `l2` ● Complement relative to a stated whole. First *suppose not* story: prove that if all the red things are in the box, then anything outside the box isn't red — by imagining otherwise and hitting a wall.
- `l3` ● Notation Ā with the universe named every time. Math 0's caution: {0,1} complemented in ℕ vs in ℝ. Term *proof by contradiction* introduced.
- `l4` ● Math 0's proposition (A ⊆ B ⇒ B̄ ⊆ Ā) with the full Discussion showing why contradiction is natural for negative goals. The irrationals as ℚ̄ in ℝ.
- `l5`–`l6` ● Adds the structure of a contradiction proof as a template and the warning against using it when a direct proof exists.
- `l7`–`l8` ● Math 0 text in full; `l8` notes constructive vs classical objections in one line.

---

**2.6 What it means for two sets to be equal** — Math 0 §2.2
**Kernel:** S = T is *defined* as S ⊆ T and T ⊆ S. Every set-equality proof is therefore two proofs. When a hypothesis is an *or*, split into cases.
**Named move:** *check both boxes*.
**Objectives:** Prove set equality by double inclusion · use proof by cases inside such a proof.
- `l1` ○ Two boxes have the same stuff if nothing in one is missing from the other, and the other way round. Physically check both directions.
- `l2` ● Same, formalized as a two-step checklist.
- `l3` ● Double inclusion as a definition, with a worked example on divisor/multiple sets.
- `l4` ● Math 0's sin/cos proposition (S ∪ T = R) with cases, showing the *or ⇒ cases* rule that recurs all chapter.
- `l5`–`l6` ● Same at full rigor plus a second example; explicit statement that "obviously equal" is not a proof.
- `l7`–`l8` ● Math 0 text in full.

---

**2.7 De Morgan's set laws** — Math 0 §2.2.1
**Kernel:** `S ∩ T = S̄ ∪ T̄` and `S ∪ T = S̄ ∩ T̄`. These are the logic laws of 1.4 with ¬→complement, ∧→∩, ∨→∪.
**Objectives:** State both laws · prove one by double inclusion · articulate the logic/set correspondence.
- `l1` ○ Picture only: shade the outside of two overlapping hoops, discover it's the overlap of the two outsides.
- `l2` ● Same with the reader doing the shading, and the sentence that names the pattern.
- `l3` ● Both laws stated with Venn diagrams as evidence, plus the explicit table mapping ¬↔complement, and↔∩, or↔∪.
- `l4` ● Proof of `S ∪ T = S̄ ∩ T̄` by double inclusion, using the logic law at the pivot — the first proof where Chapter 1 is a *tool*.
- `l5`–`l6` ● Both proved; reader asked to notice that the set proof is the logic proof wearing different clothes.
- `l7`–`l8` ● Math 0 text in full; `l8` names the structure (Boolean algebra) and points to lattices.

---

**2.8 Distributive laws** — Math 0 §2.2.2
**Kernel:** S ∪ (T ∩ R) = (S∪T) ∩ (S∪R) and S ∩ (T ∪ R) = (S∩T) ∪ (S∩R). Unlike arithmetic, distribution works both ways.
**Objectives:** State both laws · prove one by double inclusion with cases · contrast with the single distributive law of arithmetic.
- `l1` ○ Three hoops, one shading exercise, one sentence.
- `l2` ○ Venn picture with the two sides shaded side by side and declared the same.
- `l3` ● Both laws with diagrams, and the comparison to `a(b + c) = ab + ac` — including the striking fact that in sets, the *other* direction also holds.
- `l4` ● Proof of the first law by double inclusion, with the case split in the forward direction and the "if not in S, then it must be in both" step in the reverse.
- `l5`–`l6` ● Full proof with the Discussion doing the planning explicitly.
- `l7`–`l8` ● Math 0 text in full.

---

**2.9 Product sets** — Math 0 §2.3, §2.3.1, §2.3.2
**Kernel:** S × T is the set of ordered pairs (s,t) with s ∈ S, t ∈ T. Order matters, so S × T ≠ T × S in general. Anything × ∅ is ∅. Products interact cleanly with intersection.
**Objectives:** List a small product · explain why order matters · prove (A∩B)×(C∩D) = (A×C)∩(B×D).
- `l1` ● Outfits: 2 shirts and 3 hats make 6 pictures. Draw the grid.
- `l2` ● The grid formalized; count without listing. First encounter with "a thing made of two things."
- `l3` ● Term *ordered pair*, notation `(s,t)`, `S × T`. Coordinates on graph paper as ℤ × ℤ. Why (a,x) and (x,a) are different objects.
- `l4` ● ℝ × ℝ = ℝ², the integer lattice, S × ∅ = ∅, triple products.
- `l5`–`l6` ● The intersection/product proposition proved, with the key habit: an arbitrary element of a product is a *pair*, so name it (x,y) immediately.
- `l7`–`l8` ● Math 0 text in full; `l8` adds n-fold and infinite products, and a forward ref to relations as subsets of S × S.

### Chapter 3 — Functions: machines that turn one thing into another

*Chapter question: what does it mean to send every thing somewhere?*

---

**3.1 What is a function?** — Math 0 §3.1.1
**Kernel:** f: S → T assigns to *every* s ∈ S exactly one f(s) ∈ T. Three conditions: totality (everything gets sent), well-definedness (one output each), and codomain (outputs land in T). S is the domain, T the codomain.
**Objectives:** Test a rule against the three conditions · identify domain and codomain · give a non-example of each failure.
- `l1` ● The cubby machine: every child has exactly one cubby. What breaks it? A child with no cubby; a child with two cubbies. (A cubby with two children is fine — plant this now; it becomes injectivity.)
- `l2` ● Same, drawn as arrows from one list to another. Reader draws a good machine and two broken ones.
- `l3` ● Terms *function*, *input*, *output*, *domain*, *codomain*, notation `f(x)` and `f: S → T`. Arrow diagrams as the primary representation. Machines whose inputs aren't numbers (child → cubby, letter → position).
- `l4` ● The three conditions stated formally, including "if f(s) = t₁ and f(s) = t₂ then t₁ = t₂." Non-examples: √ on ℝ if you allow both signs; 1/x on all of ℝ.
- `l5`–`l6` ● Adds functions of two variables as functions on a product set (ℤ × ℤ → ℤ), tying back to 2.9. Vertical line test explained as a special case, not the definition.
- `l7`–`l8` ● Math 0 text in full; `l8` adds functions as subsets of S × T (the graph definition) and why "range" is ambiguous.

---

**3.2 A zoo of functions** — Math 0 §3.1.2
**Kernel:** Functions need not be formulas or numeric. The floor function, Euler's totient φ, multiplication ℤ×ℤ → ℤ, and letter-position are all functions.
**Objectives:** Evaluate the floor function · evaluate φ on small inputs · state that a function is a rule, not necessarily an expression.
- `l1` ○ Three machines shown as pictures: name → first letter; child → cubby; toy → color.
- `l2` ● Adds "chop off the bit after the decimal" (floor, informally, with money).
- `l3` ● Floor function properly with number-line pictures. Letter → position. Term *well-defined* revisited.
- `l4` ● Adds φ(n) computed for n ≤ 12 by hand, with the observation φ(p) = p − 1 for prime p. Multiplication as a function on pairs.
- `l5`–`l6` ● Adds eˣ, ln x, 1/x with domain restrictions justified rather than asserted.
- `l7`–`l8` ● Math 0 text in full; `l8` notes φ's role in RSA in one sentence.

---

**3.3 Images and pre-images** — Math 0 §3.1.3
**Kernel:** Im(f) ⊆ T is the set of outputs actually hit. f⁻¹(U) is the set of inputs landing in U; it may be empty. f⁻¹({t}) ≠ ∅ exactly when t ∈ Im(f). Pre-images exist for any function, invertible or not.
**Objectives:** Compute images and pre-images for given functions · distinguish codomain from image.
- `l1` ● "Which cubbies got used?" and "who's in this cubby?" Both questions, physically.
- `l2` ● Same on arrow diagrams: circle the arrowheads (image), trace back from one arrowhead (pre-image).
- `l3` ● Terms *image*, *pre-image*. Worked with letter→position: image is 1…26, pre-image of 27 is nothing at all.
- `l4` ● Set-builder definitions. Math 0's examples: f(x) = x² with f⁻¹({3}) = {−√3, √3}, f⁻¹({−5}) = ∅, f⁻¹((−2,6)) = (−√6, √6); floor with f⁻¹({4}) = [4,5).
- `l5`–`l6` ● Pre-image of a *set* emphasized as the main object; the empty pre-image treated as normal, not an error.
- `l7`–`l8` ● Math 0 text; `l8` flags that f⁻¹ as a pre-image operator always exists while f⁻¹ as an inverse function usually doesn't — the notational trap resolved in 3.9.

---

**3.4 Pre-images respect set operations** — Math 0 §3.1.4
**Kernel:** f⁻¹(Ū) = f⁻¹(U)‾, f⁻¹(U ∪ V) = f⁻¹(U) ∪ f⁻¹(V), f⁻¹(U ∩ V) = f⁻¹(U) ∩ f⁻¹(V). The pivot in every proof is `x ∈ f⁻¹(U) ⇔ f(x) ∈ U`.
**Objectives:** Prove one of the three identities by double inclusion · state the pivot equivalence.
- `l1` ○ Skipped as proof; one picture showing that tracing back from two cubbies gives you the two groups of children combined.
- `l2` ○ Same, with the sentence that names the rule.
- `l3` ● Union version demonstrated concretely on a finite arrow diagram; stated as a rule, not proved.
- `l4` ● Union version proved by double inclusion with cases. The pivot equivalence highlighted as the only fact used.
- `l5`–`l6` ● Complement and union versions both proved (Math 0's two propositions).
- `l7`–`l8` ● Math 0 text in full; `l8` notes that images do *not* respect intersection (f(A∩B) ⊆ f(A)∩f(B) only), with a counterexample — an important asymmetry the notes leave implicit — and points to the topological definition of continuity.

---

**3.5 One-to-one (injections)** — Math 0 §3.2.1
**Kernel:** f is injective when distinct inputs give distinct outputs; equivalently (contrapositive), f(s₁) = f(s₂) ⇒ s₁ = s₂. Every element of T has at most one pre-image.
**Objectives:** Test a function for injectivity · write an injectivity proof · give a counterexample for a non-injective function.
- `l1` ● Cubbies again: does anyone have to *share*? A machine where nobody shares is a special, tidy machine.
- `l2` ● Arrow diagrams: no two arrows landing in the same place. Reader spots sharers.
- `l3` ● Term *one-to-one*. x² is not one-to-one because 3 and −3 collide; the alphabet map is. Horizontal-line test as a picture, not a definition.
- `l4` ● The formal definition *and* its contrapositive, with the explicit note (from Math 0) that the contrapositive form is what you actually use in proofs. Proof that eˣ is injective.
- `l5`–`l6` ● Adds 1/x on ℝ≠0; non-injectivity of multiplication ℤ×ℤ → ℤ via (6,4) and (2,12).
- `l7`–`l8` ● Math 0 text in full.

---

**3.6 Onto (surjections)** — Math 0 §3.2.1
**Kernel:** f is surjective when Im(f) = T: every t ∈ T has at least one pre-image. Surjectivity depends on the declared codomain.
**Objectives:** Test for surjectivity · prove a function surjective by producing a pre-image for an arbitrary target · explain how changing the codomain changes the answer.
- `l1` ● Did every cubby get used? A machine that fills every cubby is another kind of tidy.
- `l2` ● Arrow diagrams with unused targets circled.
- `l3` ● Term *onto*. The alphabet map is not onto ℕ (27 is unused). Floor is onto ℤ.
- `l4` ● Formal definition. Proof that eˣ: ℝ → ℝ₊ is onto, by exhibiting ln t. The crucial point that eˣ: ℝ → ℝ is *not* onto — same rule, different answer.
- `l5`–`l6` ● Adds 1/x onto ℝ≠0 but not onto ℝ, and multiplication ℤ×ℤ → ℤ onto via (n,1).
- `l7`–`l8` ● Math 0 text in full.

---

**3.7 Composition** — Math 0 §3.2.2
**Kernel:** (g∘f)(s) = g(f(s)) is defined when f's codomain is g's domain. Composition preserves injectivity and preserves surjectivity.
**Objectives:** Compose two functions · prove that the composition of injections is an injection · same for surjections.
- `l1` ○ Two machines in a row: name → cubby → cubby color. One picture.
- `l2` ● Machine chains drawn and traced. Notice the middle has to match.
- `l3` ● Notation `g ∘ f` with the right-to-left reading called out as the usual stumbling block. Worked on small finite sets.
- `l4` ● Both preservation proofs (Math 0's two propositions), with the Discussion sections showing how the hypotheses get used one after the other.
- `l5`–`l6` ● Same, plus the partial converses as a question to sit with (if g∘f is injective, what must f be?).
- `l7`–`l8` ● Math 0 text in full; `l8` proves the partial converses.

---

**3.8 Bijections and size** — Math 0 §3.3
**Kernel:** A bijection is both injective and surjective: every t has exactly one pre-image. For finite sets, injection ⇒ |S| ≤ |T|, surjection ⇒ |S| ≥ |T|, bijection ⇒ |S| = |T|. Bijections are how mathematicians compare infinite sets. The identity map is a bijection; compositions of bijections are bijections.
**Objectives:** Verify a bijection · use bijections to compare sizes · state the identity function's properties.
- `l1` ● Everyone has exactly one cubby and every cubby has exactly one child — so there are the same number of children as cubbies, *without counting*. This is the whole idea and it is age-appropriate.
- `l2` ● Pairing up to compare two piles without counting. Extend to a big pile you couldn't count.
- `l3` ● Term *bijection* (or "perfect matching"). Both conditions checked on finite examples. First taste of infinity: match the counting numbers with the even numbers and notice something strange.
- `l4` ● Formal definition, the three cardinality facts, the identity function, and the theorem that compositions of bijections are bijections.
- `l5`–`l6` ● eˣ, ln x, 1/x on ℝ≠0 as worked bijections; explicit discussion of why fixing the codomain matters.
- `l7`–`l8` ● Math 0 text in full; `l8` adds countable vs uncountable, ℕ ↔ ℚ, and Cantor's diagonal argument named (proved if space allows).

---

**3.9 Inverses** — Math 0 §3.3.1
**Kernel:** f⁻¹ exists exactly when f is a bijection: surjectivity makes it total, injectivity makes it well-defined. The inverse of a bijection is a bijection, and its inverse is f again. `f⁻¹(t) = s` (a function) and `f⁻¹({t}) = {s}` (a set) are different statements.
**Objectives:** Explain why bijectivity is exactly the condition for invertibility · prove the inverse of a bijection is a bijection · distinguish the two f⁻¹ notations.
- `l1` ○ Undoing: put the toys back where they came from. Only works if nothing got mixed up.
- `l2` ● Undo-machines; a machine can only be undone if it never shared and never skipped — this is the bijection condition in child language.
- `l3` ● Term *inverse*. Worked on finite examples; the two failure modes shown as broken undo-machines.
- `l4` ● The two-part argument (Math 0's discussion before the proposition) written as the reason the definition works, then eˣ/ln x and 1/x as examples.
- `l5`–`l6` ● Full proof that f⁻¹ is a bijection, and the identity function's self-inverse property.
- `l7`–`l8` ● Math 0 text in full, including the notation caveat at the end of §3.3.1.

---

### Chapter 4 — Number systems and divisibility

*Chapter question: what are the rules the integers actually obey, and what can't they do?*

---

**4.1 What the integers can do** — Math 0 §4.1.1
**Kernel:** ℤ is closed under addition, additive inverses, and multiplication, and satisfies the distributive law — this makes it a *ring*. It is not closed under multiplicative inverses: only 1 and −1 have integer reciprocals.
**Objectives:** State the four closure properties · demonstrate that 1/3 ∉ ℤ · explain what "closed" means.
- `l1` ● Adding two whole piles gives a whole pile. Sharing 7 cookies between 2 people doesn't. Physically discover the gap.
- `l2` ● Term *closed*: you can't get out of the whole numbers by adding or multiplying, but dividing can throw you out.
- `l3` ● Closure listed as four rules, with negative numbers included. Distributive law verified on examples and stated in letters.
- `l4` ● Formal statements with variables. The multiplicative-inverse failure investigated: which integers have integer reciprocals, and why only ±1.
- `l5`–`l6` ● Term *ring* introduced as a label for "a number system with these rules," with the note that the same rules govern polynomials and matrices.
- `l7`–`l8` ● Math 0 text in full; `l8` gives the full ring axioms and names units, integral domains, and the forward path to abstract algebra.

---

**4.2 Even, odd, and divides** — Math 0 §4.1.2
**Kernel:** n is even iff n = 2k for some *integer* k; odd iff n = 2k+1. Generalizing: m | n iff n = mk for some k ∈ ℤ. Divisibility is an existence statement, so proving it means producing the k.
**Objectives:** Use the algebraic definitions of even and odd · state the definition of divides · recognize divisibility claims as ∃-statements.
- `l1` ● Sharing between two people: sometimes it comes out even, sometimes there's one left over. Pair up the counters.
- `l2` ● Even and odd by pairing, then by the pattern in the last digit — but with pairing as the *reason*.
- `l3` ● The algebraic definition `n = 2k` introduced as the version you can compute with, and "k must be a whole number" stressed. Term *divides*, symbol `|`, with the direction-confusion warning (3 | 12 means 3 goes into 12).
- `l4` ● Full definition of divisibility as an existence claim; restating earlier results in divisibility language (2 | n iff 2 | n²).
- `l5`–`l6` ● Adds ∤ and the restatement of "if mn is odd then m and n are odd" in divisibility notation.
- `l7`–`l8` ● Math 0 text in full.

---

**4.3 Proving divisibility facts** — Math 0 §4.1.2 (examples), §4.1.3
**Kernel:** Divisibility proofs follow one template: unpack each hypothesis into an equation with a named integer, do algebra, factor out the divisor, and confirm the cofactor is an integer using closure. Some plausible statements are false — e.g. a | bc does not imply a | b or a | c.
**Objectives:** Prove transitivity of divisibility · prove a | bx + cy · give the 4 | 2·6 counterexample.
- `l1` ○ Not attempted. One story: if you can share into 2 groups and each of those into 3, you can share into 6.
- `l2` ● Same idea with counters, concretely.
- `l3` ● Transitivity proved in words with a concrete pattern (if 3 goes into a number and that number goes into another…). Introduce naming the unknown factor.
- `l4` ● The full template, then three proofs: a|b ∧ b|c ⇒ a|c; a|c ∧ b|d ⇒ ab|cd; a|b ∨ a|c ⇒ a|bc (including the phrase *without loss of generality*, explained).
- `l5`–`l6` ● Adds a | bx + cy for all integers x,y and the corollary a | b+c; then the false converse with the 4 | 12 counterexample and the note that it *is* true for prime a.
- `l7`–`l8` ● Math 0 text in full; `l8` states Euclid's lemma and points at unique factorization.

---

**4.4 Remainders and proof by cases** — Math 0 §4.1.3
**Kernel:** If n ∤ m, then m = nk + r for some r with 1 ≤ r ≤ n−1 — so "not divisible" splits into n−1 cases. This makes proof by cases the standard tool for divisibility.
**Named move:** *split into cases*.
**Objectives:** Enumerate the cases for n ∤ m · complete a two-case divisibility proof · state the converse use (writing m = 3k+1 proves 3 ∤ m).
- `l1` ○ Leftovers: sharing among 3, you have 0, 1, or 2 left over — never more. Do it with counters.
- `l2` ● The leftovers rule discovered by trying many numbers; stated as "you always have fewer left over than the number of groups."
- `l3` ● Remainders written as `m = 3k + r`. Every whole number is one of three kinds. Reader classifies a list.
- `l4` ● Math 0's proposition: if 3 ∤ a² − 1 then 3 | a, done by contrapositive and two cases. This is the chapter's showcase proof — it uses contrapositive (1.8), cases (1.12), and closure (4.1) at once.
- `l5`–`l6` ● Same, plus a second cases proof (every square is 3k or 3k+1) and the converse direction noted at the end of §4.1.3.
- `l7`–`l8` ● Math 0 text in full; `l8` states the Division Algorithm properly and introduces mod-n language.

---

**4.5 The rationals are a field** — Math 0 §4.2.1
**Kernel:** ℚ is closed under addition, additive inverses, multiplication, *and* multiplicative inverses of nonzero elements — this makes it a *field*. The closure proofs are just fraction arithmetic checked against the definition.
**Objectives:** Verify each closure property with the standard fraction formulas · state the difference between a ring and a field.
- `l1` ○ Half a cookie is still a real amount. Pieces are numbers too.
- `l2` ● Fractions as answers to sharing problems; adding halves and quarters.
- `l3` ● Fraction arithmetic re-read as closure statements: adding two fractions gives a fraction, and here's the formula that proves it. The reciprocal as the missing piece ℤ lacked.
- `l4` ● All four properties stated and verified symbolically, with the q ≠ 0 conditions tracked. Term *field*.
- `l5`–`l6` ● Ring vs field compared in a table; ℤ, ℚ, ℝ classified.
- `l7`–`l8` ● Math 0 text in full; `l8` adds ℤ/pℤ as a finite field in one paragraph.

---

**4.6 Between any two rationals** — Math 0 §4.2.1
**Kernel:** Given rationals a < b, the midpoint (a+b)/2 is rational and lies strictly between them — so there are infinitely many rationals between any two. Density is proved, not asserted.
**Objectives:** Prove the midpoint is rational using closure · prove both inequalities · explain the "repeat forever" consequence.
- `l1` ○ There's always a spot between two spots on the ruler.
- `l2` ● Halfway between: find it for whole numbers, then notice you can keep halving forever.
- `l3` ● Midpoint formula, checked to be a fraction, and both inequalities argued from a < b. The infinite-repetition consequence stated.
- `l4` ● Math 0's proposition with the full Discussion, including *why* closure of ℚ is what makes the midpoint legal.
- `l5`–`l6` ● Same, with the observation that this makes ℚ feel like it fills the line — setting the trap that 4.7 springs.
- `l7`–`l8` ● Math 0 text in full; `l8` adds that ℚ is dense yet measure zero, and previews completeness.

---

**4.7 Irrational numbers and √2** — Math 0 §4.2.2
**Kernel:** Some real numbers are not rational. √2 is one: assuming √2 = p/q in lowest terms forces p and q both even, contradicting lowest terms. Uses "n² even ⇒ n even" from 1.9.
**Objectives:** Reproduce the √2 proof · identify each earlier tool it uses · state that √m is rational iff m is a perfect square.
- `l1` ○ Some lengths can't be written as a piece-of-a-whole. One sentence, one picture of a square's diagonal.
- `l2` ● The diagonal of a 1×1 square: measure it, notice no fraction ever fits exactly. Honest framing: grown-ups can *prove* no fraction works.
- `l3` ● Term *irrational*. The proof told as a story: suppose you had the simplest fraction; discover both top and bottom are even; but then it wasn't the simplest. Contradiction, in words, no algebra.
- `l4` ● The full proof with algebra, with the lowest-terms assumption flagged as the load-bearing step and the even-square lemma cited from Chapter 1.
- `l5`–`l6` ● Same; adds √p irrational for prime p, and √m rational iff m is a perfect square (stated, sketched).
- `l7`–`l8` ● Math 0 text in full; `l8` notes e and π are irrational and transcendental, and that the proofs are genuinely harder.

---

**4.8 The shape of the irrationals** — Math 0 §4.2.2
**Kernel:** The irrationals are not closed under addition or multiplication and contain neither 0 nor 1 — they are not a field. But: if a is irrational so are −a and 1/a, and a nonzero rational times an irrational is irrational. Each is proved by contradiction using closure of ℚ.
**Objectives:** Give counterexamples to closure · prove rational × irrational is irrational · see the −a result as a special case.
- `l1` ○ Skipped; one line: two strange numbers can add up to a perfectly ordinary one.
- `l2` ● Two lengths that are each "not a fraction" can add to a whole number, and one multiplied by itself can give a whole number. Shown with the square diagonal from 4.7, in words and pictures — no root sign, no negatives (both are later grades).
- `l3` ● The two failures of closure stated with those examples, and the "suppose not" proof that −a is irrational told in words.
- `l4` ● Full proofs of −a and 1/a irrational.
- `l5`–`l6` ● Math 0's proposition on a·b for nonzero rational a, with the observation that it generalizes the −a case.
- `l7`–`l8` ● Math 0 text in full; `l8` notes irrational^irrational can be rational (the √2^√2 argument) as a famous nonconstructive proof.

### Chapter 5 — Complex numbers: the number that turns

*Chapter question: what do you do when the numbers you have aren't enough?*

**Framing note for all levels.** Never say "imaginary numbers aren't real" or "you can't take the square root of a negative." The honest frame, usable from kindergarten: *mathematicians kept running into a question their numbers couldn't answer, so they invented a new number and checked carefully that it didn't break anything.* From `l3` up, the geometric reading — multiplying by i is a quarter turn — is introduced early and used as the spine, because it makes every later fact (conjugation, modulus, Euler, De Moivre) visual rather than symbolic.

---

**5.1 Why we needed a new number** — Math 0 §5.1
**Kernel:** x² ≥ 0 for every real x, so x² + 1 = 0 has no real solution and the polynomial x² + 1 has no real root. Roots of polynomials matter enough that mathematicians extended the number system rather than accept the gap.
**Objectives:** Explain why x² + 1 has no real root · describe the historical move as invention-with-verification.
- `l1` ● Story: every time you fold a number onto itself (multiply it by itself) you land on the plus side, whether you started plus or minus. So nothing lands on −1. One thing to do: try it with counters.
- `l2` ● Squares of positives and negatives tabulated; the gap noticed by the reader.
- `l3` ● The equation x² = −1 stated and shown unsolvable with the two-case argument from 1.12. The invention framed honestly.
- `l4` ● Adds the polynomial-root motivation and the parallel to earlier extensions (ℕ→ℤ to subtract, ℤ→ℚ to divide).
- `l5`–`l6` ● Adds the quadratic formula's discriminant as the everyday place this gap shows up.
- `l7`–`l8` ● Math 0 text; `l8` states the Fundamental Theorem of Algebra as the payoff.

---

**5.2 What a complex number is** — Math 0 §5.1.1, §5.1.2
**Kernel:** ℂ = {a + bi | a,b ∈ ℝ} with i² = −1. Re(z) = a, Im(z) = b, and both are *real*. ℝ ⊆ ℂ via a = a + 0i, giving ℕ ⊆ ℤ ⊆ ℚ ⊆ ℝ ⊆ ℂ.
**Objectives:** Identify real and imaginary parts · prove ℝ ⊆ ℂ · place all five number systems in order.
- `l1` ● A complex number as a pair of instructions: go across, then turn. Draw one.
- `l2` ● The number tower as nested boxes, drawn, with one example living in each.
- `l3` ● `a + bi` notation, Re and Im, and the emphatic point that Im(3 + 4i) is 4, not 4i.
- `l4` ● The subset proof ℝ ⊆ ℂ done properly; the full tower proved link by link (each link is a one-line subset proof from Ch. 2).
- `l5`–`l6` ● Adds "purely imaginary" and the fact that ℂ has no order compatible with its arithmetic (stated, not proved).
- `l7`–`l8` ● Math 0 text in full.

---

**5.3 Complex arithmetic** — Math 0 §5.2
**Kernel:** Add componentwise; multiply by FOIL with i² = −1, giving (ac − bd) + (ad + bc)i; invert by multiplying by the conjugate over itself; divide as z · (1/w). ℂ is a field.
**Objectives:** Add, multiply, invert, and divide complex numbers · verify a²+b² ≠ 0 for z ≠ 0 · state that ℂ is a field.
- `l1` ○ Adding two "across and turn" instructions by doing one then the other.
- `l2` ● Addition only, on a grid, as combining moves.
- `l3` ● Addition and multiplication by a real number on the grid; then i·i = −1 discovered as a double quarter turn.
- `l4` ● Full arithmetic including the FOIL derivation; inversion by the conjugate trick with the nonzero-denominator check.
- `l5`–`l6` ● Division worked; ℂ verified against the field checklist from 4.5.
- `l7`–`l8` ● Math 0 text in full.

---

**5.4 Conjugation** — Math 0 §5.2.1
**Kernel:** z̄ = a − bi. Conjugation is an involution; Re(z) = (z + z̄)/2; Im(z) = (z − z̄)/(2i); z·z̄ = a² + b² is real and ≥ 0. z is real iff z = z̄.
**Objectives:** Compute conjugates · verify the Re/Im formulas · prove the biconditional z real ⇔ z = z̄.
- `l1` ○ The mirror: flip the point across the middle line.
- `l2` ● Reflection drawn on a grid; doing it twice gets you home.
- `l3` ● Term *conjugate*; the involution property and z·z̄ computed on examples and noticed to be real.
- `l4` ● All four properties verified algebraically; the biconditional proved in both directions (Math 0's proposition) — a clean payoff for 1.9.
- `l5`–`l6` ● Adds conjugation distributing over sums and products (stated, one proved).
- `l7`–`l8` ● Math 0 text in full; `l8` notes conjugation as a field automorphism and the conjugate-root theorem.

---

**5.5 The complex plane** — Math 0 §5.3.1
**Kernel:** a + bi is plotted at (a,b) on a plane with a real horizontal axis and imaginary vertical axis. Addition is the parallelogram rule; conjugation is reflection in the real axis.
**Objectives:** Plot complex numbers · add geometrically · explain why real numbers are fixed by conjugation.
- `l1` ● Grid game: walk across, then walk up. Mark the spot.
- `l2` ● Plotting and adding as combining walks; the mirror line identified.
- `l3` ● Full plotting, addition as vectors, conjugation as reflection, with the observation that reals sit *on* the mirror so they don't move — geometry explaining 5.4's theorem.
- `l4`–`l6` ● Same with the parallelogram made precise, plus multiplication by i shown to be a 90° rotation (verified algebraically).
- `l7`–`l8` ● Math 0 text in full.

---

**5.6 Modulus** — Math 0 §5.3.2
**Kernel:** |z| = √(a² + b²) is the distance from 0; |z| = √(z·z̄); it extends absolute value; |z − w| is the distance between z and w; |z − w| = r describes a circle.
**Objectives:** Compute modulus · connect to the Pythagorean theorem and to absolute value · sketch the locus |z − w| = r.
- `l1` ○ "How far from home?" measured with string.
- `l2` ● Distance on a grid via right triangles (informally).
- `l3` ● the Pythagorean theorem applied on the complex plane; |z| defined; the absolute-value connection for real z.
- `l4` ● |z| = √(z z̄); distance between two complex numbers; the circle equation derived by squaring.
- `l5`–`l6` ● Circles centered anywhere; regions like |z| < 1 sketched; the triangle inequality stated.
- `l7`–`l8` ● Math 0 text in full; `l8` proves |zw| = |z||w| and points to normed spaces.

---

**5.7 Euler's formula** — Math 0 §5.4.1
**Kernel:** Substituting iθ into the series for eˣ and using the cycle i, −1, −i, 1 separates into the cosine and sine series, giving e^{iθ} = cos θ + i sin θ. The rearrangement is legal because the series converge absolutely.
**Objectives:** State the powers of i cycle · describe how the series split · state Euler's formula.
- `l1` ○ One idea only: turning a quarter turn four times brings you back where you started. Do it physically. (No series.)
- `l2` ○ The i-cycle as a rotation pattern: i, −1, −i, 1, repeating. Named honestly as the thing that makes the grown-up formula work.
- `l3` ○ The i-cycle computed. Euler's formula stated as a fact with the geometric meaning (going θ around the unit circle), explicitly labeled as something proved later with calculus.
- `l4` ● Same, plus a numerical demonstration: partial sums of the series approach cos θ and sin θ (given as a table, not derived).
- `l5`–`l6` ● Series introduced as infinite sums with a plausibility argument; the derivation carried out with the absolute-convergence caveat stated.
- `l7`–`l8` ● Math 0 text in full, including the warning about rearranging infinitely many terms; `l8` adds the ODE proof as an alternative.

---

**5.8 Polar form** — Math 0 §5.4.2
**Kernel:** re^{iθ} is the point at distance r from the origin at counterclockwise angle θ. Polar form is non-unique: re^{iθ} = re^{i(θ+2πk)}. Special values: i = e^{iπ/2}, −1 = e^{iπ}, and e^{iπ} + 1 = 0.
**Objectives:** Convert between a + bi and re^{iθ} · explain non-uniqueness · evaluate the special cases.
- `l1` ○ Two ways to say where something is: *across and up*, or *how far and which way*. Act both out.
- `l2` ● Distance-and-direction described with compass directions; the same point named two ways.
- `l3` ● Polar description with angles in degrees, converting simple cases; non-uniqueness as "turning all the way around gets you back."
- `l4` ● Radians introduced; re^{iθ} notation; the special cases including Euler's identity, with the five constants called out.
- `l5`–`l6` ● Conversions both directions with trig; 3e^{iπ/3} worked as in the notes.
- `l7`–`l8` ● Math 0 text in full; `l8` adds arguments, principal values, and why complex log is multivalued.

---

**5.9 Multiplication is rotation** — Math 0 §5.4.3
**Kernel:** r₁e^{iθ₁} · r₂e^{iθ₂} = (r₁r₂)e^{i(θ₁+θ₂)}: multiply lengths, add angles. |re^{iθ}| = r. The conjugate of re^{iθ} is re^{−iθ}. e^{a+bi} = e^a e^{ib}. Comparing e^{i(2θ)} with (e^{iθ})² yields the double-angle formulas; the general version is De Moivre's formula.
**Objectives:** Multiply in polar form · derive the double-angle identities · state De Moivre's formula.
- `l1` ○ Turning twice adds up the turns. Physical only.
- `l2` ● Turn-then-turn on a compass; angles add.
- `l3` ● Multiplying by i as a quarter turn, generalized: multiplying rotates. Verified on examples with degrees.
- `l4` ● The polar multiplication rule stated and checked against a FOIL computation; modulus of re^{iθ} verified with the Pythagorean identity.
- `l5`–`l6` ● Double-angle formulas derived by equating real and imaginary parts — the moment where complex numbers *pay off* in a course they've already taken. De Moivre stated.
- `l7`–`l8` ● Math 0 text in full; `l8` adds nth roots of unity and their geometry.

---

### Chapter 6 — Induction: proving infinitely many things at once

*Chapter question: how can a finite argument settle infinitely many cases?*

---

**6.1 The domino idea** — Math 0 §6.1.1
**Kernel:** If the first domino falls, and every domino knocks over the next, then all of them fall. Pattern-spotting suggests a claim; induction is what turns the guess into knowledge.
**Named move:** *dominoes*.
**Objectives:** Explain the two conditions in the domino picture · identify what goes wrong if either fails.
- `l1` ● Actual dominoes (or blocks in a row). Knock the first. Then: what if one domino is too far from the next? What if nobody pushes the first? Both failures acted out.
- `l2` ● Same, then applied to a claim: "every number of blocks I can build, I can build one bigger."
- `l3` ● The odd-number pattern discovered: 1, 1+3, 1+3+5, … giving squares. Reader computes several, guesses, then is asked *how would you ever be sure?*
- `l4` ● The pattern plus the incremental insight: knowing the k-case, you get the (k+1)-case by adding one new term. Stated informally before formalizing.
- `l5`–`l6` ● Adds a cautionary example where a pattern holds for many cases and then fails (e.g. n² + n + 41 producing primes until n = 40), to prove that pattern-spotting is not enough.
- `l7`–`l8` ● Math 0 §6.1.1 in full, with the same caution.

---

**6.2 The three steps** — Math 0 §6.1.2
**Kernel:** (1) State A(n) and the starting value n₀. (2) Prove the base case A(n₀). (3) Prove the inductive step: assume A(k) for some k ≥ n₀, deduce A(k+1). The inductive step is a *conditional*, so assuming A(k) is not circular.
**Objectives:** Write the three steps for a given claim · explain why the step is not begging the question · identify the base case.
- `l1` ○ Two jobs: push the first one, and make sure each one touches the next.
- `l2` ● The two jobs named and checked on a concrete claim.
- `l3` ● All three steps written out for the odd-number sum, in words with a little notation. The circularity worry raised and answered at this level ("we're not saying it's true for k — we're saying *if* it were, then it'd be true for k+1").
- `l4` ● Formal statement with A(n), n₀, base case, inductive hypothesis, inductive step. **Sums are written out longhand — `1 + 3 + 5 + ⋯ + (2n−1)` — not with Σ.** Σ is high-school notation (HSA-SSE.B.4) and is introduced at `l5`; writing the sum out costs nothing and keeps grade 8 readable.
- `l5`–`l6` ● Adds the well-ordering intuition for *why* induction is valid, and the common error of starting from A(k+1) and working backwards (Math 0's warning).
- `l7`–`l8` ● Math 0 text in full, including the direction-of-proof warning and the recommendation to start from the left-hand side of A(k+1).

---

**6.3 The classic proof** — Math 0 §6.1.2
**Kernel:** Σⱼ₌₁ⁿ (2j − 1) = n², proved by induction, written in the house style. The algebra k² + 2k + 1 = (k+1)² is the entire inductive step.
**Objectives:** Write a complete induction proof · avoid the backwards-reasoning error.
- `l1`–`l2` ○ The picture proof instead: odd numbers as L-shaped shells that build a square. Physically build 1, then 4, then 9 with tiles. (This is honest and it is the same theorem.)
- `l3` ● The L-shell picture plus the domino argument in words: adding the next odd number adds the next shell.
- `l4` ● Full symbolic proof with the sum written out longhand as in 6.2 — `1 + 3 + 5 + ⋯ + (2n−1)` — since Σ is not available until l7; the L-shell picture retained alongside as the intuition.
- `l5`–`l6` ● Full proof plus a second one (Σ j = n(n+1)/2) done by the reader's-eye-view.
- `l7`–`l8` ● Math 0 text in full.

---

**6.4 When does induction apply?** — Math 0 §6.1.3
**Kernel:** Induction needs a statement indexed by integers n ≥ n₀ *and* a way to connect case k+1 back to case k. Statements about all real numbers are not candidates.
**Objectives:** Judge whether a claim is a candidate for induction · articulate the linkage requirement.
- `l1` ○ Dominoes need to be in a line. Some things aren't in a line.
- `l2` ● Claims about "every number, one after another" vs claims about everything at once.
- `l3` ● Two example claims, one suitable and one not (x² ≥ 0 for all real x), with the reason.
- `l4`–`l6` ● Adds the second requirement: the (k+1) case must be reachable from the k case. Sums, products, and recursive definitions are the natural fits.
- `l7`–`l8` ● Math 0 text in full; `l8` adds strong induction and structural induction, each in a short paragraph with one example.

---

**6.5 Induction in number theory** — Math 0 §6.2.1
**Kernel:** 3 | (2^{2n} − 1) for all n ≥ 0. The step: write 2^{2k} − 1 = 3x, so 2^{2k} = 3x + 1, then 2^{2(k+1)} − 1 = 4(3x+1) − 1 = 3(4x+1). Naming the unknown factor `x` (not `k`) matters, because `k` is taken.
**Objectives:** Combine the divisibility template with induction · manage variable naming.
- `l1`–`l2` ○ Skipped as proof; one line: dominoes also work for questions about sharing evenly.
- `l3` ● Compute 2^{2n} − 1 for n = 0..4 (0, 3, 15, 63, 255), notice all are multiples of 3, then get the domino argument in words for why it keeps happening.
- `l4` ● Full proof with the exponent algebra spelled out.
- `l5`–`l6` ● Full proof plus one more (e.g. 6 | n³ − n) for the reader to see the template twice.
- `l7`–`l8` ● Math 0 text in full.

---

**6.6 Induction in calculus** — Math 0 §6.2.2
**Kernel:** For f(x) = 1/x, f⁽ⁿ⁾(x) = (−1)ⁿ n! x^{−(n+1)}. Found by computing the first few derivatives and spotting three patterns (sign, factorial, exponent); proved by differentiating the k-th derivative and using (k+1)! = (k+1)·k!.
**Objectives:** Conjecture a general formula from data · prove it by induction · handle the base case f⁽⁰⁾ = f.
- `l1`–`l3` ○ Replaced with an age-appropriate pattern-then-prove exercise on repeated halving or repeated doubling, so the *method* is present even though calculus is not. Clearly labeled: "the grown-up version of this module uses calculus."
- `l4` ● Replaced with repeated-application patterns on functions the reader knows (repeated doubling; iterated squaring), same three-pattern conjecturing discipline.
- `l5`–`l6` ● Same substitution, or the derivative version if the reader has seen derivatives — the page states the prerequisite plainly.
- `l7`–`l8` ● Math 0 text in full, including the factorial manipulation.

---

**6.7 Induction in set theory** — Math 0 §6.2.3
**Kernel:** A set with n elements has 2ⁿ subsets. The step: pick a ∈ S, split subsets into those containing a and those not; each group is in bijection with the subsets of the k-element set S \ {a}, giving 2ᵏ + 2ᵏ = 2^{k+1}.
**Objectives:** Enumerate subsets of small sets · give the doubling argument · write the proof.
- `l1` ● With two toys, how many different bags could you pack? (the empty bag, one, the other, both — four.) Do it physically with 1, 2, and 3 toys.
- `l2` ● Tabulate 0, 1, 2, 3 elements → 1, 2, 4, 8. Notice doubling and say why: each new toy is in or out.
- `l3` ● The doubling reason made into an argument; connects to 2.1 (∅ counts) and 2.9 (in-or-out is a choice per element).
- `l4` ● Full induction proof following Math 0, with the split-by-membership case analysis.
- `l5`–`l6` ● Same, plus the alternative counting argument (one binary choice per element) as a second proof, and the term *power set*.
- `l7`–`l8` ● Math 0 text in full; `l8` adds |P(S)| > |S| for infinite sets (Cantor), stated.

---

### Chapter 7 — The Peano axioms: building the numbers from nothing

*Chapter question: if every proof rests on earlier facts, what do the earliest facts rest on?*

---

**7.1 What is an axiom?** — Math 0 §7.1
**Kernel:** Tracing proofs backwards must terminate. Axioms are the statements taken as true without proof; a mathematical theory is its axioms plus everything derivable from them.
**Objectives:** Explain why axioms are necessary · distinguish axiom from theorem · describe axioms as choices with consequences.
- `l1` ● The *why* game: keep asking why until you reach something you both just agree on. Play it once. Name those agreements: *the rules we start with*.
- `l2` ● Rules of a game as axioms: change a rule, get a different game — but the game is still fair.
- `l3` ● Term *axiom*. The backwards chain drawn as a diagram that must stop somewhere. Different axiom sets → different mathematics (mentioned, e.g. geometry without the parallel postulate).
- `l4`–`l6` ● Adds the criteria for a good axiom system: few, independent, consistent, and enough to generate what you want.
- `l7`–`l8` ● Math 0 text; `l8` adds consistency and completeness as questions, with Gödel named.

---

**7.2 The rules for equality** — Math 0 §7.2.1
**Kernel:** Axioms 1–4: reflexivity (x = x), symmetry, transitivity, and closure of equality (if x ∈ ℕ and x = y then y ∈ ℕ). Reflexive + symmetric + transitive = an *equivalence relation*.
**Objectives:** State the three properties · recognize them elsewhere (same age, same color, same remainder) · explain closure of equality.
- `l1` ● "Same as" games. A thing is the same as itself. If mine is the same as yours, yours is the same as mine. If mine matches yours and yours matches Sam's, mine matches Sam's. Act all three out.
- `l2` ● The three rules named and checked on several "same as" relations, including one that fails (e.g. "is a friend of" — not always transitive).
- `l3` ● Formal statement with variables; term *equivalence relation* introduced with three examples and one non-example.
- `l4`–`l6` ● Adds the closure axiom and its purpose, plus congruence mod n as an equivalence relation (ties to 4.4).
- `l7`–`l8` ● Math 0 text in full; `l8` adds equivalence classes and quotient sets, and notes that many Peano presentations omit these axioms as logic.

---

**7.3 Zero and the successor** — Math 0 §7.2.2 (Axioms 5, 6)
**Kernel:** Axiom 5: 0 ∈ ℕ. Axiom 6: if x ∈ ℕ then S(x) ∈ ℕ. S is the "next" function. We cannot yet call S(x) "x + 1" because + is not defined.
**Objectives:** State both axioms · explain why S(x) can't yet be written x + 1 · recognize S as a function ℕ → ℕ.
- `l1` ● The "what comes next?" machine. Start at 0. Press the button. Keep pressing. That's all counting is.
- `l2` ● Same, plus naming: the number after 0 we call 1, after 1 we call 2. The names are labels we chose; the machine is the real thing.
- `l3` ● Terms *axiom*, *successor*. The careful point that we are *defining* 1 as S(0), 2 as S(1), and that we may not use addition yet.
- `l4`–`l6` ● S treated as a function with domain and codomain ℕ (ties to Ch. 3). The self-discipline of assuming nothing made explicit.
- `l7`–`l8` ● Math 0 text in full, including the 0-vs-1 convention note.

---

**7.4 Two axioms that stop the numbers looping** — Math 0 §7.2.2 (Axioms 7, 8)
**Kernel:** Axiom 7: 0 is not the successor of anything, so counting never returns to the start. Axiom 8: S is injective, so counting never merges two numbers into one. Without them, ℕ = {0} or ℕ = {0,1} would satisfy everything so far.
**Objectives:** Construct the bad models the axioms rule out · restate Axiom 7 as "the pre-image of 0 is empty" and Axiom 8 as "S is injective."
- `l1` ● A counting machine that loops: 0, 1, 0, 1, 0… Act it out and notice it's *wrong* — real counting never comes home. Then a machine where two different numbers have the same next; also wrong.
- `l2` ● Both broken machines drawn as arrow diagrams; the reader states the rule that forbids each.
- `l3` ● Axioms stated; the two broken models built explicitly and rejected.
- `l4`–`l6` ● Restated in Chapter 3 language: f⁻¹({0}) = ∅ and S is injective — a genuinely satisfying reuse. Shows that {0,1,2,3,…} ⊆ ℕ follows.
- `l7`–`l8` ● Math 0 text in full.

---

**7.5 Inductive sets and the last axiom** — Math 0 §7.2.2 (Axiom 9)
**Kernel:** V is *inductive* if 0 ∈ V and x ∈ V ⇒ S(x) ∈ V. Axiom 9: if V is inductive then ℕ ⊆ V. This rules out "too big" models like ℕ ∪ {a,b}, and combined with axioms 1–8 gives ℕ = {0,1,2,…} exactly. It is the same principle as Chapter 6's induction.
**Objectives:** Test a set for inductiveness · construct the {a,b} rogue model and see how Axiom 9 kills it · connect Axiom 9 to the domino argument.
- `l1` ○ A picture: two extra creatures sneak into the counting line, pointing at each other forever. The last rule says: nothing but the counting numbers gets in.
- `l2` ● The rogue model drawn; the rule that excludes it stated in child words ("if a box has 0 and always has the next one, the box has all the counting numbers").
- `l3` ● Term *inductive set*; the rogue model built and excluded; the final set equality ℕ = {0,1,2,…} obtained by double inclusion (payoff for 2.6).
- `l4`–`l6` ● Explicit identification of Axiom 9 with mathematical induction: base case = 0 ∈ V, inductive step = closure under S.
- `l7`–`l8` ● Math 0 text in full; `l8` notes first-order vs second-order Peano arithmetic and nonstandard models in a short aside.

---

**7.6 Defining addition** — Math 0 §7.3.1
**Kernel:** a + 0 = a and a + S(b) = S(a + b). Every sum is computed by unwinding to the base case. 1 + 1 = 2 becomes a derivation, not a fact.
**Objectives:** Compute 1+1, 1+2, 2+3 from the definition · explain what "recursive definition" means.
- `l1` ● Adding as pressing the next-button. "Three plus two" = start at three, press twice. Do it on a number line taped to the floor.
- `l2` ● Same, then the derivation of 1 + 1 = 2 written as a chain of steps. Reader does 2 + 2.
- `l3` ● The two defining rules stated symbolically; two full derivations shown; term *recursive*.
- `l4`–`l6` ● Adds: commutativity is *not* obvious here — a + b = b + a has to be *proved* by induction. State it, sketch it. This is the most surprising thing in the chapter and it should be foregrounded.
- `l7`–`l8` ● Math 0 text in full, plus the induction proof of associativity or commutativity worked out (`l8`).

---

**7.7 Defining multiplication** — Math 0 §7.3.2
**Kernel:** a · 0 = 0 and a · S(b) = a + (a · b). Multiplication is built on addition exactly as addition was built on the successor. a · 1 = a is a small theorem; 3 · 2 = 6 is a derivation.
**Objectives:** Compute a·1 and 3·2 from the definition · describe the tower successor → addition → multiplication.
- `l1` ● Multiplying as repeated grouping, done with counters; three groups of two.
- `l2` ● Same, then the observation that multiplying is just adding again and again — which is exactly what the rule says.
- `l3` ● Both rules stated; a · 1 = a derived; 3 · 2 = 6 derived step by step.
- `l4`–`l6` ● Adds the layered picture of the whole chapter (nothing → 0 and next → addition → multiplication) and notes that the distributive law of 4.1, assumed all course, is provable from here by induction.
- `l7`–`l8` ● Math 0 text in full; `l8` closes the course by pointing back: every result in Chapters 1–6 about ℕ now rests on nine axioms and two recursive definitions.

---

### B-2. Dependency map (for sequencing and prerequisite links)

Each module's `prerequisites` array should encode these. The site should render a "you'll need" line at the top of each module linking to prerequisites *at the same level*.

- 1.1 → 1.2 → 1.3 → 1.4; 1.3 → 1.5 → 1.6 → 1.7 → 1.8; 1.5 + 1.8 → 1.9; 1.1 → 1.10 → 1.11 → 1.12
- 2.1 → 2.2 → 2.3 → 2.4 → 2.5 → 2.6 → {2.7, 2.8}; 2.1 → 2.9
- 1.4 → 2.7 · 1.12 (cases) → 2.6 · 1.8 → 2.5
- 2.2 + 2.3 → 3.1 → 3.2 → 3.3 → 3.4; 3.1 → 3.5, 3.6 → 3.7 → 3.8 → 3.9
- 2.6 → 3.4 (double inclusion) · 1.7 → 3.5 (contrapositive form of injectivity)
- 4.1 → 4.2 → 4.3 → 4.4; 4.1 → 4.5 → 4.6 → 4.7 → 4.8
- 1.9 → 4.7 (even-square lemma) · 2.5 → 4.7, 4.8 (contradiction) · 1.12 → 4.4 (cases)
- 4.1 → 5.1 → 5.2 → 5.3 → 5.4 → 5.5 → 5.6 → 5.7 → 5.8 → 5.9
- 2.3 → 5.2 (subset proofs) · 1.9 → 5.4 (biconditional)
- 6.1 → 6.2 → 6.3 → 6.4 → {6.5, 6.6, 6.7}; 4.2 → 6.5; 2.1 + 2.9 → 6.7
- 7.1 → 7.2 → 7.3 → 7.4 → 7.5 → 7.6 → 7.7; 3.5 → 7.4; 6.2 → 7.5; 2.6 → 7.5

### B-3. Cross-level continuity requirements

For each module, the generated pages must satisfy:
- The **kernel idea** (a single sentence in `_module.json.kernelIdea` used only by authors and reviewers) is recognizably present at all eight levels.
- Each level has its own **kernel sentence** in `_module.json.kernels[level]`, rendered on the invariant band. The kernel sentence must be a faithful restatement of the kernel idea, worded in the vocabulary and notation the reader has met (see A4). No level is exempt; touch treatments still get a kernel sentence.
- The l1 kernel sentence must be readable aloud in one breath and use no term the child has not met earlier in the l1 ladder.
- The **anchor example** (A6) appears at every level unless the module's kernel forbids it.
- **Named moves** (A3.6) use identical names at all levels; formal terms are added from `l3` up, never replacing the informal name.
- Terms marked `newTerms` in frontmatter must appear in `glossary.json` with a definition written for that level.
---

## Part C — The build

### C1. Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Astro 5**, `output: 'static'` | Content-collection-first, ships zero JS by default, prerenders 488 pages fast, deploys to GitHub Pages unchanged. |
| Content | **MDX** via `@astrojs/mdx` + content collections with Zod schemas | Prose stays readable and editable; schema catches malformed frontmatter at build time. |
| Math | `remark-math` + `rehype-katex`, KaTeX with `output: 'htmlAndMathml'` | Server-rendered math, no client JS, screen-reader-accessible via MathML. |
| Styling | **Tailwind 4** with tokens declared in `@theme` | Tokens in one place; level-responsive type scale via a `data-level` attribute on `<html>`. |
| Interactivity | Vanilla TypeScript + the **View Transitions API** (`@astrojs/view-transitions`) | The only interactive needs are the level switcher, progress marks, and glossary pop-ins. No framework needed. |
| Search (phase 5) | **Pagefind** | Static index, no server, filterable by level. |
| Diagrams | Inline SVG components, hand-authored per figure | Venn diagrams, arrow diagrams, number lines, the complex plane, and domino strips are the recurring figure types; build them as parameterized components rather than one-off images. |

Node 20+, `pnpm`. `pnpm dev` for local, `pnpm build` for static output into `dist/`.

### C2. Routes

```
/                                   landing + level picker
/[level]/                           course home for that level (7 chapters, progress)
/[level]/[chapter]/                 chapter overview + module list
/[level]/[chapter]/[module]/        the module page
/[level]/glossary/                  every term, defined at this level
/[level]/notation/                  symbol reference card (only symbols this level uses)
/about/                             the premise, the source, attribution, how to use it
/teachers/                          how to use the ladder in a classroom (phase 5)
```

The level is in the URL, so any page is linkable at a specific level. The level switcher navigates to the same module at the new level; if that module is `touch` at the target level, it still exists — never a 404, never a redirect to the chapter index.

### C3. Design direction

**Subject:** the same true thing, said eight ways. The design's job is to make the *invariant* visible while everything around it changes.

**Palette** (declared once in `@theme`, semantic names only — never raw hex in components):

```
--color-ink:     #14182B   /* text, rules */
--color-paper:   #EEF0EA   /* page */
--color-card:    #F8F9F5   /* raised surfaces */
--color-rule:    #C6CBC0   /* hairlines, dividers */
--color-signal:  #4436C7   /* the level rail, links, focus rings */
--color-true:    #2F6F4E   /* T in truth tables, proved statements, ✓ */
--color-false:   #A8324A   /* F, counterexamples, broken machines */
--color-shade:   #E3E7DD   /* figure fills, table zebra */
```

`--color-true` and `--color-false` are not decoration: they are used consistently from kindergarten (the true/silly game) through truth tables through counterexamples, so the reader builds a color intuition for truth value across twelve years of the ladder. Nothing else in the site is allowed to use them.

**Type:**
- Display: **Bricolage Grotesque** (variable) — headings, level labels, chapter numbers. Slightly odd proportions; keeps the site from reading as a textbook PDF.
- Body: **Literata** — designed for long reading and holds up at the 22px sizes level 1 needs.
- Utility: **Spline Sans Mono** — symbol names, level codes, notation cards, the "you'll need" line.
- Math: KaTeX default (Computer Modern). Its otherness is useful: symbolic mathematics should look like symbolic mathematics.

**Level-responsive type scale.** `<html data-level="l1">` drives the scale. This is the design carrying the pedagogy: the page physically feels younger or older.

| | l1 | l2 | l3 | l4 | l5–l6 | l7–l8 |
|---|---|---|---|---|---|---|
| body size | 22px | 21px | 19px | 18px | 17.5px | 17px |
| line-height | 1.75 | 1.7 | 1.65 | 1.6 | 1.6 | 1.55 |
| measure | 46ch | 50ch | 58ch | 62ch | 66ch | 68ch |
| paragraph gap | 1.4em | 1.3em | 1.1em | 1em | 1em | 0.9em |

**Layout.** Three columns on desktop: the level rail (fixed, left, 88px), the reading column (centered, measure per table above), and a margin column (right, 260px) for glossary pop-ins, "where this goes," and figure captions. Below 900px: rail collapses to a sticky horizontal pill strip at the top, margin notes inline as disclosure blocks.

```
┌────┬──────────────────────────────────┬─────────────┐
│ K  │  Ch 1 · Module 5                 │             │
│ 2  │  ── THE IDEA ────────────────    │             │
│ 5  │  If–then claims only promise      │  margin     │
│▓8▓ │  something about the cases        │  notes,     │
│ 9  │  where the "if" part holds.       │  glossary,  │
│10  │  ──────────────────────────────  │  figures    │
│12  │  [body, rewritten per level]      │             │
│ C  │                                   │             │
└────┴──────────────────────────────────┴─────────────┘
```

**Signature: the invariant band.** Directly under the module title, in a fixed slot with a hairline above and below, sits the module's **kernel sentence for the current level** — set in the display face at the same size on every level. The *wording* changes with the level (a kindergartner reads a K-appropriate sentence there; a college reader reads a college one), but each level's sentence points at the same underlying mathematical idea. A short caption above the band reads *"The big idea, said for you"* so the invariance is unambiguous — especially at l1–l2, where the reader can't read the l7 sentence to compare. When the reader moves the rail, a view transition cross-fades the band together with the body, so the reader feels the wording shift while the pointed-at idea stays put. That soft morph is the whole thesis of the site in one interaction, and it is the only place motion is spent.

Do not display the level-invariant *kernel idea* string; it is an author-side contract, not reader-facing content.

**Restraint.** No gradients, no shadows deeper than a 1px rule, no icon set beyond ✓ and a small rail marker, no illustrations except the mathematical figures. Full keyboard operation of the rail (↑/↓ move level, Enter commits). `prefers-reduced-motion` disables the morph and swaps in an instant change.

### C4. Level switching behavior

- Level lives in the URL; `localStorage.proofladder.level` records the last used level and drives the redirect from `/`.
- The rail shows all eight rungs with the current one filled. Hovering a rung shows that level's label and reading age.
- Switching preserves the module and, where possible, scroll position anchored to the nearest heading.
- A dismissible one-time hint on first visit: "Same idea, eight ways. Move the rail any time."
- If a reader lands on a `touch` page, a line under the invariant band reads: *This idea gets a short, honest first look here. It's told in full from grade 5 up →* linking to the same module at `l3`. Never phrased as "too hard for you."

### C5. Progress

`localStorage.proofladder.progress` = `{ [levelId]: string[] }` of visited module ids. Renders as ✓ marks in chapter lists and a thin completion bar per chapter. Per level, so the same reader can be 60% through `l4` and 10% through `l7`. A "clear progress" control on the course home. No accounts, no analytics, no cookies.

### C6. MDX components

Each takes no props that duplicate frontmatter, and each has a defined visual treatment at every level.

| Component | Purpose | Notes |
|---|---|---|
| `<BigIdea>` | The invariant band. | Auto-populated from `_module.json.kernels[currentLevel]` — authors do not retype it. Renders the caption *"The big idea, said for you"* above the sentence. Exactly one per page, rendered by the layout, not the MDX. A missing per-level kernel is a build error. |
| `<Discussion>` | Math 0's planning section. | Renders "What we know / What we want / What we'll do" as a labeled three-part block. At `l1`–`l2` the labels become "What's true already / What we want to be true / How we get there." |
| `<Proof>` | The proof itself. | Ends with □, automatically. At `l1`–`l2` titled "How we know." |
| `<TryIt>` | The 30-second activity. | Required at `l1` and `l2`, optional above. Phase 1: not interactive, just an instruction. |
| `<Aside>` | Margin note. | Desktop: right column. Mobile: inline disclosure. |
| `<Warning>` | A common mistake, named. | Uses `--color-false` sparingly. |
| `<WhereThisGoes>` | `l8` closer naming the field this opens. | Only rendered at `l7`/`l8`. |
| `<TruthTable>` | Truth table. | Takes variables and expressions; renders T/F in `--color-true`/`--color-false`. Available `l4`+. |
| `<Figure>` | Wrapper for SVG figures with caption + alt text. | Alt text is required by the schema. |
| `<Term>` | Inline glossary term. | Pulls the definition for the current level; renders as a dotted underline with a margin pop-in. |
| `<Needs>` | The prerequisite line. | Auto-generated from `_module.json.prerequisites`, links at the current level. |

### C7. Figure component library

Parameterized, reused everywhere. **All built** — this is a description of `src/components/`, not a backlog:

| Component | Does | Key props |
|---|---|---|
| `<VennTwo>` | two circles, shadeable | `labelS` `labelT` `shade[]` `disjoint` `universe` |
| `<VennThree>` | three circles, all seven regions shadeable | `labelS` `labelT` `labelR` `shade[]` `universe` |
| `<ArrowDiagram>` | two labeled sets and arrows | `left[]` `right[]` `edges[][]` `broken[]` |
| `<NumberLine>` | ticks, points, intervals, and a `gapAt` hole for §4.6/§4.7 | `from` `to` `ticks` `points[]` `intervals[]` `gapAt` |
| `<ComplexPlane>` | points, vectors | `points[]` `vectors[]` `range` |
| `<DominoRow>` | the induction picture, with `gapAfter` for the step-fails counter-picture | `count` `fallen` `gapAfter` `pushed` `trailing` |
| `<GridPairs>` | product sets as a grid of ordered pairs | `rows[]` `cols[]` `highlight[][]` `showPairs` |
| `<LShells>` | odd numbers building a square (§6.3) | `n` `upto` `showCounts` |
| `<SuccessorChain>` | `0 → S(0) → …`, with `loop`/`merge`/`rogue` variants for §7.4–§7.5's broken models | `mode` `count` `labels` |
| `<TruthGrid>` | 2×2 case chart for `l1`–`l3`, before `<TruthTable>` arrives at `l4` | `rows` `cols` `cells[][]` `okWord` `badWord` |
| `<UmbrellaCases>` | the §1.5 promise chart — a hardcoded `<TruthGrid>` predating it | — |

Every figure must render legibly at 320px wide and must have alt text carrying the mathematical content, not just "a diagram." The generic components build their own alt text from the props, so callers get a content-bearing description for free.

**The lint enforces this list.** `scripts/lint-content.mjs` errors on a component that is used without an import or imported without existing on disk, and warns on an unused import. That check exists because this section used to read as a backlog, and reaching for an unbuilt `<SuccessorChain>` from it broke `astro build` with an error that never named the offending page.

### C8. Accessibility floor

WCAG 2.2 AA. MathML output for KaTeX. All figures alt-texted with content. Rail fully keyboard-navigable with visible focus. Color never the sole carrier of meaning (truth tables also use the letters T/F). Reduced motion respected. Target contrast ≥ 7:1 for body text at `l1`–`l3` where readers are earliest. Language attribute set. A dyslexia-friendly font toggle is a phase-5 nice-to-have, not a phase-1 requirement.

---

## Part D — Generating the content

488 pages is the bulk of the work. It must be generated systematically or the ladder will drift.

### D1. The unit of generation is the module, not the page

**Generate all eight levels of one module in a single pass.** This is the single most important process rule: vertical consistency (same kernel, same anchor example, same named move, same progression of terminology) is impossible to enforce if levels are written independently and stitched together later.

### D2. Order of work

1. Write `_module.json` for all 61 modules first, from Part B. This is the contract.
2. Write `glossary.json` entries for every term, all levels, before prose generation — so terms are consistent from the start.
3. Vertical slice: generate module **1.5 (If–then)** at all eight levels, build it, read all eight, and tune the voice profiles in `levels.json` against what you see. Do not proceed until this feels right.
4. Generate the remaining 60 modules chapter by chapter, in syllabus order. **Level order: `l2`, `l3`, `l4`, `l6`, `l7` first** (2nd, 5th, 8th, 10th, 12th — the five most distinct grades), then `l1`, then `l5` and `l8`.
5. After each chapter, run a **vertical review pass**: read one module at all eight levels back to back and check the continuity requirements in B-3.
6. After each chapter, run a **horizontal review pass**: read one level across the whole chapter and check that vocabulary is introduced before use and that the reading level never spikes.

### D3. Generation prompt template

```
Write module {id} — "{title}" — at ALL EIGHT levels.

CONTRACT (from _module.json):
  kernel idea (fixed, author-side): {kernelIdea}
  per-level kernels (rendered on band): {kernels}
  objectives:    {objectives}
  anchor example: {anchor for this chapter, per A6}
  named move:    {namedMove or none}
  new terms:     {vocabulary}
  prerequisites: {prereq ids and titles}
  treatment:     {per-level core/touch}
  source:        Math 0 {sourceRef} — for content reference only.
                 Write original prose. Do not reproduce the source's wording.

LEVEL PROFILES: {paste the relevant rows of A4 and the paragraph from A5}
LADDER: {paste this module's ladder from Part B}

FIRST, if kernels[level] is missing for any level, propose one for review.
Every level must have a kernel that:
  - restates the fixed kernel idea faithfully,
  - uses only the vocabulary and notation in that level's budget (A4),
  - at l1, is readable aloud in one breath.

THEN FOR EACH LEVEL produce lN.mdx with valid frontmatter and a body that:
  - builds toward the kernel sentence for that level (the sentence itself is
    rendered separately by the layout — do not restate it verbatim, build
    toward it in the reader's own voice)
  - opens with the question this module answers, in that level's voice
  - uses the anchor example unless the ladder specifies otherwise
  - uses the named move by name
  - stays inside the word budget and the notation budget for that level
  - introduces each new term in bold on first use with an inline definition
  - at l1/l2 ends with <TryIt>; at l7/l8 ends with <WhereThisGoes>
  - contains no statement that a later level will have to contradict

Then output a CONTINUITY CHECK: one line per level confirming the kernel
idea is carried and the kernel sentence stays inside the level's vocabulary
budget, plus a note on anything you had to change between levels and why.
```

### D4. Content lint (`pnpm lint:content`)

A Node script, run in CI and before every commit, that fails the build on:

- a module missing any of its eight level files, or a file whose `level` frontmatter doesn't match its filename
- a module missing `kernelIdea` or missing any of the eight `kernels[level]` entries
- a `kernels[level]` sentence that uses vocabulary or notation outside that level's budget (same regex/word check as the body)
- an l1 kernel that is longer than ~20 words or introduces a term not in that level's vocabulary
- word count outside the level's budget by more than 20%
- a symbol used that is outside the level's notation budget (regex per level against the allowed list in A4.2 — this catches `∀` sneaking into an `l3` page)
- **grade-calibration violations, per §A4.1 — these are the ones intuition gets wrong:**
  - `l2`: any `×`, `÷`, `\frac`, `\tfrac`, a `/` between numerals, or a minus sign used as *negation* rather than subtraction. Second grade has no multiplication, no division, no fractions-as-numbers, and no negatives.
  - `l3`: a single letter used as a *number* (`let n`, `for any x`, `a + b` with `a`,`b` numeric), any `ℕ ℤ ℚ ℝ`, any negative numeral, or a coordinate pair with a negative entry. Fifth grade has neither variables nor negatives. Set names as labels (`A`, `S`, `T`) are permitted and must be excluded from this check.
  - `l4`: `f(x)`, `∀`, `∃`, `∘`, `Σ`. Function notation is high school; the other three are `l5`+.
  - `l6`: `Σ`, `∏`, limit notation.
  - `l7`: forward references to abstract algebra, topology, or measure theory in `<WhereThisGoes>` — those belong at `l8`. At `l7` the closer points at calculus and linear algebra.
- a `newTerms` entry with no matching `glossary.json` definition at that level
- a `prerequisites` id that doesn't resolve
- a `<Figure>` without alt text
- a `<WhereThisGoes>` outside `l7`/`l8`
- a missing `<TryIt>` at `l1`/`l2`
- banned phrasings, from a maintained list: "you can't take the square root of a negative", "imaginary numbers aren't real", "a function is a formula", "or means one or the other", "you'll learn why later", "too advanced for", "don't worry about"

Also report (warn, don't fail): Flesch–Kincaid grade estimate per page against the level target, and average sentence length.

### D5. Review checklist per module

- [ ] Kernel *idea* recognizable at all eight levels
- [ ] Each level's kernel *sentence* uses only that level's vocabulary and notation
- [ ] The `l1` kernel sentence is readable aloud in one breath, uses only words a kindergartner has met earlier in the ladder, and does not use any symbols
- [ ] The `l2` kernel sentence stays inside grade-2 vocabulary and uses at most `=`, `+`, `−`, and numerals
- [ ] Anchor example consistent down the ladder
- [ ] Named move used with the same name at every level
- [ ] Each level's opening question is *the same question*, asked age-appropriately
- [ ] Nothing said at a lower level is contradicted at a higher one
- [ ] `l1`/`l2` activity is genuinely doable in 30 seconds with household objects
- [ ] `l7`/`l8` is mathematically complete — a Caltech freshman would not be shortchanged
- [ ] Figures render at 320px and have content-bearing alt text

---

## Part E — Ship, attribute, extend

### E1. Build phases

| Phase | Deliverable | Done when |
|---|---|---|
| **0. Scaffold** | Astro project, tokens, layout, rail, KaTeX, content schemas, lint script, all 61 `_module.json` files, `levels.json`, `glossary.json` skeleton | `pnpm dev` shows the rail and one stub module at eight levels |
| **1. Vertical slice** | Module 1.5 at all eight levels, fully designed, figures included | You'd be happy to show a teacher |
| **2. Chapter 1** | 12 modules × 8 levels | Lint passes; vertical + horizontal review done |
| **3. Chapters 2–3** | 18 modules × 8 | Same |
| **4. Chapters 4–5** | 17 modules × 8 | Same |
| **5. Chapters 6–7** | 14 modules × 8 | Same |
| **6. Wrap** | Glossary pages, notation cards, `/about`, print stylesheet, Pagefind search, GitHub Pages deploy | Live URL, lighthouse ≥ 95 on all four axes |
| **7. Exercises** | See E4 | Later |

If time is short, the honest reduction is **levels before chapters**: build `l1`, `l2`, `l3`, `l4`, `l7` across all 61 modules and add the rest later. A complete course at five levels is far more useful than three chapters at eight.

### E2. Deployment

- `astro.config.mjs`: `site: 'https://<user>.github.io'`, `base: '/<repo>'`, `trailingSlash: 'always'`.
- GitHub Actions workflow on push to `main`: install, `pnpm lint:content`, `pnpm build`, upload `dist/` as a Pages artifact, deploy.
- All internal links must go through Astro's `<a href={import.meta.env.BASE_URL + ...}>` or a small `href()` helper, or the site works locally and 404s on Pages. Add a lint rule for hardcoded leading-slash links.
- No environment variables, no secrets, no analytics.

### E3. Attribution and licensing — read before publishing

The Math 0 notes and the introduction are the work of Bob Pelayo and Caltech, and they are copyrighted. The site is a derivative *curriculum adaptation*, and it needs to be clean about that:

- **Write original prose everywhere, including at `l7` and `l8`.** Those levels match the notes in *rigor and coverage*, not in wording. Do not paste, do not lightly reword. The syllabus in Part B deliberately gives kernels and objectives rather than source text so generation has nothing to copy from.
- Mathematical statements themselves (De Morgan's laws, the √2 proof, the Peano axioms) are not copyrightable and the standard proofs are common property. The *expression* in the notes is not.
- `/about` credits the source explicitly: course name, author, institution, and a description of what this site is (an independent adaptation, not affiliated, not endorsed).
- **Before public hosting, email Dr. Pelayo.** Describe the project, ask permission to build on the syllabus, and offer to link to the original. Most authors say yes to this and are pleased; a few have constraints worth knowing about in advance. Keep the site private or local until you hear back.
- License your own contributions (prose, code, figures) — CC BY-SA 4.0 for content and MIT for code is a reasonable pair for something you want teachers to reuse.

### E4. Phase 2: exercises (schema now, build later)

Design the content schema so exercises can be added without restructuring. Proposed `exercises.json` per module:

```json
{
  "moduleId": "1.5",
  "items": [{
    "id": "1.5-e1",
    "levels": ["l3","l4","l5"],
    "type": "sort | multiple-choice | fill-the-blank | order-the-steps | free-proof | find-the-flaw",
    "prompt": "...",
    "data": { },
    "answer": { },
    "hint": "...",
    "solution": "..."
  }]
}
```

Exercise types worth building, in order of value:
1. **Order the steps** — a scrambled proof to reassemble. Works from `l3` up and teaches proof structure better than anything else.
2. **Find the flaw** — a proof with one bad step. The single best exercise type for this subject.
3. **Sort** — statements vs non-statements; true vs false; injective vs not. Works at `l1`.
4. **Counterexample hunt** — given a false universal claim, find the bad apple.
5. **Free proof with a rubric** — `l5`+, self-assessed against a checklist rather than auto-graded.

### E5. Other later work, roughly in value order

- **Teacher pages** — one per chapter: what the chapter is for, which standards it touches, how to run the `l1`–`l3` activities in a classroom, what students usually get wrong.
- **Parallel view** — show two levels side by side. Powerful for parents and teachers; also the best possible demo of the site's premise.
- **Print/PDF per level per chapter** — teachers will want paper.
- **Audio for `l1`–`l2`** — these levels are meant to be read aloud; recorded or synthesized narration makes them usable by a non-confident adult reader.
- **Translations** — the `lN.mdx` structure already supports adding a locale dimension; do this only after the English ladder is stable.
- **A "what changed?" diff view** between adjacent levels, for the curious.

---

## Appendix — quick reference for the builder

- **61 modules**: Ch1 ×12, Ch2 ×9, Ch3 ×9, Ch4 ×8, Ch5 ×9, Ch6 ×7, Ch7 ×7. Eight levels each = **488 pages**. Part B is authoritative if anything disagrees.
- **8 levels**: l1 K · l2 G2 · l3 G5 · l4 G8 · l5 G9 · l6 G10 · l7 G12 · l8 College.
- **9 named moves**, used verbatim at every level: the opposite · flip it around · suppose not · check both boxes · one bad apple · dominoes · split into cases · start from what you're given · take any one and follow it.
- **The one rule**: no lies-to-children. Every simplification true but incomplete.
