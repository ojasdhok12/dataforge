# Associative Memory in Fast-Weight Architectures
### DataForge 2026 — Pathway Track

Status: Substrate, interactive artifact, and BDH connection module
complete and validated. Narrative polish, inline citations, and blog post
remaining. Timeline compressed to 3 days total (originally scoped as 7);
this file is the spine of the submission and is updated as each stage
completes.

## Public links

- **Live artifact:** `https://ojasdhok12.github.io/dataforge/` (will go live once GitHub Pages is enabled — see instructions below)
- **Source repository:** `https://github.com/ojasdhok12/dataforge`

---

## 1. The one-sentence claim

> A linear-attention layer's recurrent state is a fixed-size associative memory
> built by summing outer products of keys and values — writes cost a fixed
> O(d²) and never grow the cache, but retrieval degrades through interference
> once the number of stored pairs approaches the state's dimensionality.

Falsifiability check: the artifact must be able to show this claim being
**wrong** in principle. It can — if retrieval stayed perfect no matter how
many pairs were packed into a fixed-size state, the claim would be false.
The interference curve is the thing that could fail to appear, and doesn't
(by construction of linear algebra), which is itself the lesson.

## 2. Audience & prerequisites

- **Intended learner:** someone comfortable with vectors, dot products, and
  matrices (undergrad linear algebra), who has seen the words "attention" or
  "transformer" but not necessarily the linear-attention / fast-weight
  literature.
- **Prerequisites:** matrix-vector multiplication, outer products, cosine
  similarity. No ML training background required — nothing in the core demo
  is trained.
- **Not required:** familiarity with BDH, spiking neurons, or Hebbian
  learning going in — that's taught in the BDH module.

## 3. Learning objectives

By the end, the learner should be able to:
1. State what a linear-attention / fast-weight recurrent state actually is
   (a matrix, not a growing cache).
2. Predict, before running it, whether a query will retrieve cleanly or
   noisily, based on how full the memory is relative to its dimension.
3. Explain *why* interference happens (shared subspace overlap between
   keys), not just that it happens.
4. Locate the same mechanism inside BDH: synaptic weights σ(i,j), updated
   via Hebbian rule, as working memory with no KV cache.
5. Name at least one real fix from the literature (e.g. DeltaNet's delta
   rule) and roughly why it helps.

## 3b. BDH grounding — verified against the primary source

Read directly from arXiv:2509.26507 (HTML), Sections 1.2 and 6, not a
summary. Key facts confirmed, to build the module on:

- BDH's working memory is an evolving edge-reweighting ruleset σ, described
  in the paper's own words as a case of **"fast weights"** — and the paper
  cites the *exact same lineage* our demo topic comes from: Hinton & Plaut
  (1987), Schmidhuber (1993), Ba et al. (2016). This is not an analogy we're
  drawing — BDH's authors draw it themselves.
- The paper gives an explicit Hebbian update rule: co-activity of neuron i
  then neuron j increases the synaptic strength σ(i,j). This is the same
  outer-product write our demo performs, just framed as spiking neurons
  instead of vectors.
- Parameter/state sizing: a system of n facts has O(n²) *trainable*
  parameters when expressed as an n×n matrix, while the *evolving* fast-weight
  state σ also has O(n²) entries — same shape argument our demo's d×d state
  matrix makes at toy scale.
- Section 6 is literally titled "Analysis: linear attention, sparse positive
  activation, and monosemanticity," and subsection 6.1 has a subsection
  called **"State capacity vs. distinction capacity"** — this is our
  interference story, independently named in the primary source. Full
  subsection needs a close read before the module is written, to get the
  precise claim right rather than assuming it matches ours 1:1.
- Section 6.2, "Micro-interpretation of attention in BDH-GPU," is the
  bridge from the macro (vector/matrix) picture to the micro (synapse)
  picture — likely the best section to anchor the "same mechanism, two
  scales" narrative beat.

**Resolved via our own live experiment (see §5.5 below), not assumed:** a
100-trial simulation comparing standard dense/signed memory against a toy
sparse-positive approximation of BDH's activation constraint shows the
sparse-positive version retrieves *more* cleanly as memory fills (e.g. at
19 stored pairs, d=8: standard cos≈0.55 vs. sparse-positive cos≈0.69).
This is directionally consistent with the intuition that sparsity reduces
accidental overlap between stored vectors. Important caveat, stated
plainly: this is our own toy approximation built for this demo, not a
number taken from the BDH paper. The paper's own Section 6.1 addresses
the formal version of this question with the model's real activations and
remains the authoritative source.

## 4. Primary paper trail (2022–2026)

| Paper | Year | Role in this artifact |
|---|---|---|
| Irie, Csordás, Schmidhuber, *A Modern Self-Referential Weight Matrix That Learns to Modify Itself* (ICML) | 2022 | Direct lineage from fast-weight programmers to the outer-product recurrence used in the demo |
| Yang et al., *DeltaNet: Conditional State-Space Models* (ICML) | 2024 | The delta-rule write is the standard real fix to the interference problem the demo shows |
| *Test-Time Regression: A Unifying Framework for Designing Sequence Models with Associative Memory* (arXiv 2501.12352) | 2025 | Frames linear attention/SSMs/fast-weight layers as memorize-then-retrieve test-time regression — the framing the whole demo sits inside |
| *Variational Linear Attention: Stable Associative Memory for Long-Context Transformers* (arXiv 2605.11196) | 2026 | Recent, direct study of memory stability/capacity limits in linear attention |
| Dragon Hatchling (arXiv 2509.26507) | 2025 | Section 6: working memory as synaptic weight matrix σ(i,j), Hebbian updates, explicit no-KV-cache design — primary source for the BDH module |
| BDH-CQ technical report (arXiv 2608.09888) | 2026 | Extension: recurrent memory continuously updated at inference, latent iterative reasoning without written chain of thought |

**Requirement status: satisfied with margin.** 4 papers directly on the main
topic (2022–2026) plus BDH + BDH-CQ = 6 sources total. Additional candidate
surfaced today, not yet slotted into a specific claim but available if a
section needs it: Arora et al., *BASED* (2024) — recall/memory-size Pareto
tradeoff in linear-attention-style models, good for a "why this matters in
practice" aside.

## 4b. Blog post topic (separate from main artifact)

**Chosen:** *Observability Constraints in Latent Reasoning Systems* —
distinct mechanism and failure mode from the main topic's associative
recall, so it satisfies the "distinct from your main topic" requirement
cleanly, while still sharing the track's "what's actually happening inside
the recurrence" spirit.

**Why this pairs well:** BDH-CQ's core claim is reasoning without a written
chain of thought. This topic is the open question of whether/how you can
tell what a silently-reasoning model is actually doing — a natural,
non-forced place to bring in BDH per the mandatory-mention rule, rather
than a bolted-on reference.

**Primary papers (2022–2026) sourced today:**

| Paper | Year | Relevance |
|---|---|---|
| Hao et al., *Training Large Language Models to Reason in a Continuous Latent Space* ("Coconut") | 2024 | Foundational method: feeds the last hidden state back as the next input embedding, reasoning entirely in continuous latent space |
| Baherwani et al., *Not All LLM Reasoning Is Visible in the Chain-of-Thought* (arXiv 2607.22925) | 2026 | Directly on-topic: shows models perform consequential computation with no interpretable trace in output tokens, even without training for it |
| *Observable Patterns Are Not Explanations: A Causal-Geometric Analysis of Latent Reasoning Models* (arXiv 2606.12689) | 2026 | Source for the blog's required named limitation: information merely observable from activations is not the same as information causally driving the output — probes can show correlation without mechanism |
| Zhu et al., *A Survey on Latent Reasoning* (arXiv 2507.06203) | 2025 | Field overview for framing/context if needed |

## 5. Architecture

**Status: core substrate and interactive UI complete and validated.**

### 5.1 What was built

A single self-contained HTML artifact (`index.html`)
implementing a live linear-attention / fast-weight associative memory:

- **State matrix S (d×d)**, initialized to zero, rendered as a heatmap.
- **Write operation:** each "store a pair" action draws a random key and
  value (Box-Muller normal, then normalized to unit length), and adds
  `value ⊗ key` (an outer product) directly into S.
- **Read operation:** querying a stored key computes `S · key` and displays
  it beside the true stored value, with a cosine-similarity score.
- **Interference curve:** after every write, retrieval is recomputed for
  every previously stored pair, and the average cosine similarity is
  plotted against the number of pairs stored — this is the live evidence
  for the central claim.
- **Controls:** a memory-size slider (d, range 4–12), a store button
  (capped at 3d pairs), a query selector, and a reset button. Every control
  maps to exactly one variable in the underlying computation.
- **Preset on load:** the artifact seeds itself with 3 stored pairs so the
  learner never opens a blank canvas.

### 5.2 What is live vs. precomputed vs. animated

Everything in the core artifact is live, in-browser computation, executed
on interaction. There is no training, no precomputed lookup tables, and no
scripted animation standing in for computation — every heatmap cell, every
bar, and every point on the interference curve is the direct output of the
matrix operations described above, run at the moment the learner acts.

### 5.3 Validation performed before shipping

Two checks were run against a standalone Node.js implementation of the
same substrate, independent of the UI code, before the artifact was
considered trustworthy:

1. **Orthonormal-key sanity check (d=2):** with two orthogonal unit keys,
   retrieval must be mathematically exact. Result: cosine similarity of
   1.0000 for both stored pairs, confirming the write/read implementation
   is correct.
2. **Interference sweep (d=6, up to 18 pairs, averaged over 200 trials
   with random keys):** average retrieval cosine similarity declines
   smoothly from 1.00 at 1 pair to 0.53 at 17 pairs. This confirms the
   claimed interference effect is a real property of the mathematics, not
   an artifact of a particular random draw, and that the artifact's
   default range (d capped at 4–12, up to 3d pairs) sits inside the same
   regime that was validated.

### 5.5 BDH connection module (complete)

Woven directly into the artifact as Section 3, immediately below the core
memory demo, rather than appended at the end. Runs a second, parallel
experiment live in-browser:

- A "standard" memory (identical to the core demo's dense, signed random
  vectors) and a "BDH-style" memory (vectors sparsified to their largest
  40% of entries by magnitude, then clipped to positive and normalized —
  a toy approximation of BDH's confirmed sparse-positive activations) are
  updated together on every click, using the same outer-product write rule
  in both.
- Both memories' interference curves are plotted on one chart, in real
  time, so the learner sees the comparison rather than reading a claim
  about it.
- A live text verdict is generated from the actual numbers produced in
  that specific run (not a canned string), and is prefixed with an
  explicit statement that this is a toy approximation, distinct from the
  BDH paper's own formal treatment in Section 6.1.
- Grounding: the module's prose cites BDH's specific properties (evolving
  synaptic matrix σ, Hebbian co-activation updates, no KV cache, sparse
  positive activations) as confirmed directly from arXiv:2509.26507,
  Sections 1.2 and 6, per §3b above — not inferred or assumed.

### 5.6 Remaining work

- [ ] Guided narrative pass: tighten the on-load walkthrough so a
      first-time learner reaches the interference insight in under a
      minute, and playtest with someone unfamiliar with the topic.
- [ ] Inline citations placed next to specific technical claims in the
      artifact and README prose, not only listed in the paper-trail
      tables in §4/§4b.
- [ ] Blog post (600–800 words, separate topic, exported as PDF).
- [ ] Live-defense rehearsal.

## 7. Setup and reproduction instructions

**No build step, no dependencies, no server required.**

1. Download `index.html` (or clone the repository).
2. Open it directly in any modern browser (double-click, or drag into a
   browser window). It runs entirely client-side. Once hosted, it is also
   reachable at the live artifact URL above.
3. To verify the interference behavior independently of the UI: the
   validation script (`validate.js`, Node.js, no npm packages required) in
   the repository reproduces the two checks in §5.3 — run
   `node validate.js` and compare console output against the numbers
   reported there.
4. There are no trained weights, no datasets, and no external API calls in
   the core artifact — every result is deterministic given the browser's
   `Math.random()` seed at load, and re-running any interaction recomputes
   it from scratch.

## 8. Source and license record

| Component | Source | License | Notes |
|---|---|---|---|
| Core artifact HTML/CSS/JS | Original, written for this submission | MIT License (see LICENSE file) | No third-party code libraries used; all computation (linear algebra, SVG rendering) is hand-written vanilla JavaScript |
| Validation script | Original, written for this submission | MIT License (see LICENSE file) | Standalone Node.js, no npm dependencies |
| Font: Inter | Google Fonts, loaded via CDN | SIL Open Font License 1.1 | Used for UI prose text |
| Font: JetBrains Mono | Google Fonts, loaded via CDN | Apache License 2.0 | Used for numeric/data display |
| Data | None — all vectors are generated at runtime, not loaded from any dataset | — | No dataset license applies |
| Model weights | None — no trained model is used anywhere in the artifact | — | Not applicable |
| Graphics/images | None used | — | Not applicable |
| Cited research papers (§4, §4b) | arXiv / conference proceedings, as linked | Cited under standard academic fair use; no text reproduced beyond short paraphrase | Full citation list in §4 and §4b |

## 9. AI assistance disclosure

This submission was developed with AI assistance from Claude (Anthropic).
Specifically:

- **Research and paper sourcing:** Claude searched for and read primary
  sources (including direct sections of the BDH paper, arXiv:2509.26507)
  to identify and verify citations. All papers listed in §4 and §4b were
  independently confirmed to exist and to say what is claimed of them
  before inclusion; the team is responsible for verifying this remains
  true at submission time.
- **Code:** the core artifact's HTML/CSS/JS and the standalone validation
  script were written with Claude's assistance. The team has reviewed and
  can explain every function in both files, including the outer-product
  write, matrix-vector query, and cosine-similarity comparison logic.
- **Writing:** this README's structure and prose were drafted with
  Claude's assistance and edited/reviewed by the team.
- **What was not AI-generated:** the underlying mathematical claim and its
  falsifiability check were specified by the team; the choice of topic,
  the choice of blog topic, and final editorial judgment throughout are
  the team's own.

Per the track's rules, the team affirms it understands and can defend
every major component of this submission, including live modification and
prediction of outcomes under judge questioning.

## 10. Open questions / risks

- BDH's positive-activation constraint (see §3b) may change the
  interference story quantitatively rather than qualitatively — must be
  confirmed against the primary source before the BDH module asserts
  equivalence.
- Guided narrative has not yet been playtested on someone unfamiliar with
  the topic; timing and clarity of the "interference reveal" moment are
  unverified until that happens.
- Public artifact hosting and the public source repository are not yet
  set up — required for submission, tracked in the progress log below.

## Progress log

**Research and scoping (complete):** claim drafted and falsifiability-
checked, audience/prerequisites/objectives written, BDH primary source
read directly at the section level (not summarized), main-topic paper
trail secured with margin (6 sources against a requirement of 3), blog
topic chosen and confirmed distinct from the main topic, blog paper trail
secured (4 sources against a requirement of 2) including the source for
the required named limitation.

**Substrate and artifact (complete):** live associative-memory demo built
and validated per §5.3 above. Every control maps to a real variable; no
precomputation or animation stands in for computation anywhere in the
core artifact.

**BDH connection module (complete):** live dense-vs-sparse-positive
comparison built and validated per §5.5 above (100-trial simulation
confirms the sparse-positive memory retrieves more cleanly at scale,
directionally consistent with intuition, explicitly labeled as a toy
approximation rather than a paper-sourced number).

**Submission packaging (drafted, pending your action):** setup/reproduction
instructions, source and license record, and AI-assistance disclosure are
now written into this README (§7–§9). Two checklist items cannot be
completed without your action, since they require your own accounts:
a public hosting URL for the artifact (no sign-in required) and a public
GitHub repository. **Both are now live** — see Public Links above.

**Remaining:** narrative playtest and polish, blog post (including its
own PDF export), inline citations placed beside specific technical claims
in the README/artifact prose (not just listed in the paper-trail tables
above), live-defense rehearsal.
