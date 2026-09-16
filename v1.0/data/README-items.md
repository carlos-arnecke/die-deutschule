# Editing the item bank

`items.js` holds 50 test items, 10 per level (A1–C1). Six are drawn at random from each level's pool when someone takes the test, and the answer options are shuffled.

## Item format

```js
{ id: 'B1-06', skill: 'vocab', tag: 'fixed-preposition',
  passage: null,                       // optional — a short text shown above the question
  prompt: 'Ich freue mich schon ___ das lange Wochenende.',
  options: ['auf', 'über', 'für'],
  answer: 0,                           // index into options, BEFORE shuffling
  note: 'Why the others are wrong.' }  // optional, for reviewers only — never shown
```

- `id` — level prefix plus a number. Keep it unique; it goes into the lead data, so we can see which items people get wrong.
- `skill` — `grammar`, `vocab` or `reading`.
- `tag` — the grammar point or word type. Free text, used for reporting later.
- `answer` — the index in `options`. It is always `0` in the current bank because the app shuffles anyway; keep whatever index is right if you reorder.

## Rules for new items

1. **Exactly one defensible answer.** The most common failure is a distractor that a native speaker would also accept — `desto`/`umso`, `wirksam`/`wirkungsvoll`, `weil`/`denn` in the wrong word order. If two teachers argue about it, the item is broken.
2. **Test the level, not the vocabulary.** An item fails its level if the person could get it right or wrong purely because of one unusual noun.
3. **Three options.** Four is not more accurate here and takes longer to read on a phone.
4. **Keep the pool balanced.** All ten items at a level must be roughly equally hard — six are drawn at random, so a lopsided pool makes the result depend on luck.
5. **Context, not isolated forms.** A full sentence someone might actually say.
6. **Keep pools at ten or more.** Fewer than ten and the sampling stops protecting against the test leaking.

## Difficulty anchors used in this bank

| Level | What it tests |
|---|---|
| A1 | present tense, sein/haben, articles, W-questions, verb-second word order, accusative |
| A2 | Perfekt, modal verbs, dative, separable verbs, comparatives, weil/wenn clauses |
| B1 | Konjunktiv II, relative clauses, present passive, adjective endings, genitive prepositions, purpose clauses |
| B2 | concessive connectors, modal passive, je/desto, genitive relative pronouns, als ob, participial attributes, precise collocation |
| C1 | idiom, Konjunktiv I, nominal style, conditional inversion, register, formal discourse markers |

## Before this goes live

A DaF teacher needs to review all 50 items. They are linguistically sound but have never been sat by a real student, so the difficulty boundaries are judgement, not data. Once the test is running, the per-item data in the lead payload tells us which items to replace: anything a placed-at-level student gets right or wrong at close to chance is doing no work.
