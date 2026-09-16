# Level Test + Lead Capture — Spec (v1.1)

**Status:** working prototype, logic-first. No visual design yet (deliberate — see §9).
**Location:** `W:\Active Projects\Die Deutschule\2026\German Test\v1.1\` — `v1.0\` is the frozen baseline.
**Replaces / upgrades:** the existing `/en/discover-your-german-level` self-assessment.

**Changed in v1.1** (16 Sep 2026): the theoretical basis is now written up in **`01-theory-and-framework.md`** — CEFR, Reference Level Descriptions (*Profile deutsch*), the telc/Goethe exam specifications, multistage testing, and the self-assessment evidence. Every question carries a `basis` reference. Three A2 questions that turned out to be A1-level against telc's published inventory were replaced; two B1 questions at the A2/B1 boundary are flagged for the teachers.

**Changed in v2** (from Carlos's first review): whole CEFR levels only, no decimals · a Back button in the test · a visible progress indicator · a question-by-question review for internal use · certificates are multi-select · the result page is built around the person's goal rather than around the course catalogue.

---

## 1. What this thing is

One tool, two contexts:

| | Public (web) | Staff (front desk) |
|---|---|---|
| URL | `index.html` | `index.html?mode=staff` |
| Who fills it in | The lead, alone | A visitor on a tablet, or staff with the visitor |
| Contact details | Required to see the plan | Optional / can be skipped |
| Extra output | — | Copyable summary block for the front desk |

Same questions, same engine, same result. Only the framing and the contact gate differ.

## 2. The flow

```
1  Intro          What this is, how long (~8 min), what you get. One button.
2  Prior German   "How much German do you already know?"  <- routes the test
                  -> "None at all" skips the test entirely and places at A1
3  TEST           Adaptive ladder, sets of 6, 2-3 sets typical (12-18 questions)
4  Self-check     3 can-do statements (speaking / writing / listening) — sanity check
5  Goals          Why you're learning, target level, which certificates (multi-select)
6  Situation      Visa, in-person vs online, time slot, how many weeks, start date
7  You            Name, email, age band, country of residence, nationality, consent
8  RESULT         Level -> the journey to your goal -> first course -> price -> next step
```

**Order rationale**

- The test comes **before** any form. Lowest possible friction to start; sunk cost makes people finish. Asking for an email on screen 1 is the single biggest killer of quiz completion.
- Goals/situation come **after** the test but **before** the form, so by the time we ask for an email the person has invested ~10 minutes and is being asked for it in exchange for something concrete.
- The **level itself is never held hostage.** The result screen always shows the level. The *plan* — the journey, the course, the price — is what the contact form unlocks. Holding a test result ransom reads as bait-and-switch and contradicts the brand voice.
- Staff mode drops the gate — at the front desk the visitor is already talking to a human.

Back navigation exists from step 5 onwards and inside a test set (see §3.3).

## 3. The test

### 3.1 Design: multistage test with number-correct routing

In the measurement literature this is a **multistage test** (Hendrickson 2007; Yan, von Davier & Lewis 2014) — sets scored as a unit, routing on the number correct, with review allowed inside a set. See `01-theory-and-framework.md` §4.

Five sets — A1, A2, B1, B2, C1 — of 6 questions each, sampled from a pool of 10 per level, options shuffled. Sampling from a pool means two people sitting side by side don't get the same paper, and the test doesn't fully leak.

The entry set comes from the self-declared prior-German answer (step 2). It only sets the **starting rung** — the ladder corrects in both directions, so a bad self-estimate costs time, not accuracy.

```
score >= 5/6  -> mastered  -> climb one set
score 3-4/6   -> partial   -> stop
score <= 2/6  -> failed    -> climb DOWN one set (if we haven't already gone up)
                             otherwise stop
```

Typical path: 2-3 sets = 12-18 questions, about 8 minutes. Worst case 5 sets = 30 questions.

**Verified:** simulated across all 30 combinations of starting set × true ability, every case lands on the same level. Self-declaration changes how long the test takes, never the answer.

### 3.2 From score to a level

`S` = the first set **not** mastered, and that is the level reported — **whole levels only, A1 / A2 / B1 / B2 / C1.**

The reported level is the level they would **join**, not the level they have finished. Someone who aces A2 and gets half of B1 is told **B1**, because B1 is what they still need.

If all five sets are mastered, the result is C1 with a ceiling note, and the recommendation pivots to Format D or an exam rather than another intensive course.

**Internal only:** we still record `positionInLevel` — `start` (scored 0–2 on that set) or `middle` (scored 3–4). It never appears on the public result. It appears in the front-desk summary, in the lead payload, and it is what decides Format D eligibility, since the Brain puts that course's floor at B1.2.

### 3.3 Progress and going back

The number of questions is genuinely dynamic, so we don't pretend otherwise. Each screen shows **"Set N · question X of 6"**, a six-dot progress row for the current set, and a line explaining that most people finish after two or three sets and that the test stops as soon as it knows.

**Back** works within the current set. Going back restores the previous choice, and changing it re-scores the set before the ladder decides anything. Back does **not** cross a set boundary — a finished set has already moved the ladder, and unwinding that would let someone walk the test up by trial and error.

### 3.4 What this test does and does not measure

Measures: grammar in context, vocabulary and collocation, reading comprehension. Text-only, multiple choice.
Does **not** measure: speaking, writing, listening. Stated plainly on the result screen.

The 3 can-do statements in step 4 exist to catch the classic mismatch — strong grammar, no speaking. If the self-report sits well below the test result, the result flags it and pushes the **free trial lesson** (A2 up) or a call with the office. It never changes the level; it changes the recommendation.

### 3.5 Known limitation

Nothing stops someone pasting questions into a translator. Accepted for v1 — this is a lead magnet, not an exam, and inflating your own placement mostly hurts the person who does it. If it becomes a problem: a soft per-question timer, plus a note that the office confirms the level on day one. **Ceiling on the claim:** the copy says "estimate", never "official placement".

## 4. Item bank

`data/items.js` — 50 questions, 10 per level, tagged by level, skill, grammar point and **basis** (the framework reference the level was checked against). Format and editing rules in `data/README-items.md`; the reasoning behind the level assignments in `01-theory-and-framework.md`.

**Teacher review:** `for-teachers-review.md` is the reviewers' copy — plain language, the whole bank printed with answers marked, and no code. It is **generated** from the item bank by `node tools/build-teacher-doc.js`, so it can never drift. Re-run it after any change to `items.js`.

The bank is linguistically sound but has never been sat by a real student, so the difficulty boundaries are judgement, not data. It needs the teachers' pass before launch.

## 5. What we capture

**Identity** — first name, last name, email, phone (optional), age band, country of residence, nationality, preferred contact language.
**Intent** — reasons for learning (multi), target level, **certificates needed (multi — someone may need both telc and TestDaF)**, deadline.
**Fit** — in-person vs online, time slot, weeks available, desired start.
**Result** — level, position in level, per-set scores, every individual answer, self-assessment, mismatch flag.
**Consent** — contact consent (required) and marketing consent (optional), separate. GDPR: two checkboxes, neither pre-ticked, privacy-policy link.

Everything lands in one flat JSON object (`buildLead()`), shown at the bottom of the result page. Destination is **Jotform**, but nothing is wired up — internal testing only for now.

## 6. The result page

Built around the person's goal, not the course catalogue. Order:

1. **The level** — big, with the level's name ("B1 — standing on your own").
2. **How we got there** — per-set scores in plain language. Plus a second, internal-only dropdown listing every question with what they answered and the right answer.
3. **Getting to `<their goal>`** — the heart of the page. Each level between here and their target, as a card: how many weeks, the textbook, what they will learn, and for the goal level, what that level is actually good for. Cards are marked "You start here" and "Your goal".
4. **Your first course** — the concrete thing to book: level, format, slot, weeks, price, max 18.
5. **What it costs** — closest package to the whole journey, registration fee, and the reassurance that it doesn't have to be booked all at once.
6. **Worth adding** — Blue Monday, Format D.
7. **Your exam(s)** — one card per certificate they picked, each with its own fee wording, prep course if their level allows it, and the honest caveats (TestDaF has no partial retakes; telc takes 4–6 weeks; a course is not a certificate).
8. **Read this before you book** — visa, timeline, speaking gap, age.
9. **Next steps** — trial lesson, start dates, how to register.

### Recommendation logic

All in `data/recommend.js`:

1. **First course** — intensive at the placed level. A1–B1 = 8 weeks, B2–C1 = 12 weeks. In-person or online, same price.
2. **Target level** — from the stated goal when given, else: visa/citizenship → B1 · university → C1 · work → B2 · default B1.
3. **The journey** — every level from here to the target, summed to a week count, snapped to a sold package and priced. If they already test above their stated target, we say so instead of inventing a journey.
4. **Visa** — visa-contract pricing, €30 registration, **Blue Monday to reach 18 lessons/week**, the 4-month lead time, the posted registration confirmation, refund terms on refusal, and a note that visa contracts start at 12 weeks.
5. **Add-ons** — Blue Monday (weak self-reported speaking, a conversation goal, or the 18h visa rule; reasons merge rather than compete) · Format D (from the second half of B1, conversation goal).
6. **Exams** — multi-select. telc routes to B1 or B2/C1 Hochschule by level, and tells them how many weeks away the prep course is if they're below B1. TestDaF and Zertifikat Deutsch each get their own card. "Not sure" gets a card that explains the choice instead of a price.
7. **Trial lesson** — from A2 up; at A1 the result says plainly it isn't available there.
8. **Age** — under 16 cannot enrol; 16–17 needs a conversation first. Both surface as a flag, not a dead end.

Prices, packages, fees and the level descriptions come from the Brain and live at the top of `recommend.js` — one place to update.

**Deliberately not hardcoded:** course start dates and exam dates. Per `04-schedules.md` they go stale and the live calendar doesn't exist yet. The result links to the schedules page instead.

## 7. Brand rules the copy follows

- "du"/"you", direct. Answer first, detail after.
- Class size: **maximum 18**. Never the minimum.
- A course does not produce a certificate — an exam does. Said explicitly wherever a certificate appears.
- No early-bird discount. No group, corporate or referral discounts.
- Trial lesson is free **from A2 up**, arrive 30 min early.
- Immigration claims are hedged: B1 is "commonly asked for in residence and citizenship procedures — check what your own case requires", never a promise.

## 8. Files

```
01-theory-and-framework.md the theory: CEFR, RLDs, MST, self-assessment, sources
index.html                 shell
styles.css                 the (plain) CSS
app.js                     flow, state, the ladder, rendering, lead payload
data/items.js              the 50-question bank
data/recommend.js          prices, courses, level descriptions, the engine
data/README-items.md       how to write and review questions
tools/build-teacher-doc.js regenerates the teachers' copy from the bank
tools/build-artifact.js    builds dist/level-test.html for publishing
for-teachers-review.md     GENERATED — the teachers' review copy
```

Plain files, no build step, no dependencies.

## 9. Not done yet (on purpose)

- **Design.** Unstyled by intent: enough CSS to be usable, none to be pretty.
- **Backend.** Nothing submits. Jotform is the destination; wiring it up is a small change once we're past internal testing.
- **The internal question-by-question dropdown must come out (or be gated behind `?mode=staff`) before this is public.** It is there so we can check the item bank; it shows students the answers.
- **German UI.** Interface is English-only; the questions are German. Full DE version once EN is signed off.
- **Item calibration.** Needs the teacher review in §4.
- **Legal.** Privacy-policy URL is a placeholder.

## 10. Open questions

1. ✅ **Where do leads go** — Jotform. Not connected yet; internal testing only.
2. ✅ **Who reviews the items** — our teachers. `for-teachers-review.md` is ready to send.
3. Does a result email go out automatically, and who owns that template?
4. Do we replace `/en/discover-your-german-level` or run this alongside it?
5. Front desk: tablet in the entrance, or staff-operated on the office machine? Changes how hard we push the contact form in staff mode.
6. By when do we want the teachers' notes back?
