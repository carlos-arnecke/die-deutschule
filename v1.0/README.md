# German Level Test — working prototype

A single tool that estimates someone's German level (A1–C1), captures their details, and puts a concrete course, timeline and price in front of them. Used two ways: as a lead magnet on the website, and on a tablet at the front desk.

## Run it

```bash
python -m http.server 8099
```

Then open <http://localhost:8099/index.html> — or `?mode=staff` for the front-desk version.

(It also works by double-clicking `index.html`; the server is only needed if your browser blocks local scripts.)

## Files

| File | What it is |
|---|---|
| `00-spec.md` | **Read this first.** Flow, why the steps are in that order, the placement algorithm, what we capture, the open questions for Carlos |
| `index.html` | Shell and the (deliberately plain) CSS |
| `app.js` | Flow, state, the adaptive ladder, rendering, lead payload |
| `data/items.js` | The 50-item test bank |
| `data/recommend.js` | Prices, courses, fees, and the recommendation engine |
| `data/README-items.md` | How to write and review items |
| `for-teachers-review.md` | **Send this to the teachers.** The whole question bank in plain language, with answers marked. Generated — run `node tools/build-teacher-doc.js` after any change to `items.js` |

## How the level is worked out

Sets of six questions, one set per CEFR level. You start where your own answer to "how much German do you know?" puts you, and the test climbs or drops until it settles — 12–18 questions for most people.

- 5 or 6 right → climb a level
- 3 or 4 right → stop, you are working at this level
- 0–2 right → drop a level

Whole levels only: A1, A2, B1, B2, C1. The level it reports is the **course you should join**, not the level you have finished. Verified: from any of the five starting points, a given ability lands on the same result — the self-declaration only changes how long the test takes.

You can go **Back** within a set to change an answer; the set is re-scored before the test decides anything. Back does not cross a set boundary, or someone could walk the test upward by trial and error.

## What still needs a decision

1. **The teachers' review.** `for-teachers-review.md` is ready to send. The German is sound, but the difficulty boundaries are judgement, not student data.
2. **The question-by-question dropdown on the result page is internal.** It shows the right answers. It has to come out, or be gated to staff mode, before this is public.
3. Confirm the privacy-policy URL in `data/recommend.js`.
4. Jotform is the lead destination — not connected yet, internal testing only.
5. Design, and the German version of the interface, come after the flow is signed off.

Full list in `00-spec.md` §9 and §10.

## Where the numbers come from

Everything — prices, packages, fees, course lengths, exam rules, the visa process — is from the Brain folder (`03-pricing.md`, `02-courses-and-services.md`, `05-exams.md`, `08-student-resources.md`). It all lives at the top of `data/recommend.js` so there is one place to update.

Course start dates and exam dates are deliberately **not** in here. Per `04-schedules.md` they go stale and the live calendar does not exist yet, so the result links to the schedules page instead.
