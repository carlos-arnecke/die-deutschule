/* die deutSCHule — "View test logic" panel.
 *
 * The teachers' review document, readable from inside the prototype: what
 * the test is, what we need from the teachers, how the level is decided,
 * and the full question bank with answers marked.
 *
 * Content mirrors for-teachers-review.md. The questions are rendered live
 * from ITEM_BANK, so this stays in step with what the test actually asks.
 * Loads after items.js and recommend.js (needs ITEM_BANK and LEVELS).
 * Opens as an overlay so the test state underneath is untouched.
 */

(function () {
  'use strict';

  var panel = document.getElementById('logic');
  var openBtn = document.getElementById('logic-open');
  if (!panel || !openBtn) return;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function nl2br(s) { return esc(s).replace(/\n/g, '<br>'); }

  var built = false;

  function open() {
    if (!built) { panel.innerHTML = build(); built = true; wire(); }
    panel.hidden = false;
    document.body.classList.add('logic-open');
    panel.scrollTop = 0;
  }
  function close() {
    panel.hidden = true;
    document.body.classList.remove('logic-open');
  }

  openBtn.addEventListener('click', open);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) close(); });

  function wire() {
    var c = panel.querySelector('#logic-close');
    if (c) c.addEventListener('click', close);
    var c2 = panel.querySelector('#logic-close-bottom');
    if (c2) c2.addEventListener('click', close);
    // In-page links
    [].forEach.call(panel.querySelectorAll('a[href^="#logic-"]'), function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var t = panel.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ block: 'start' });
      });
    });
  }

  /* ------------------------------------------------------------ content */

  /* Same blurbs as tools/build-teacher-doc.js — keep the two in step. */
  var LEVEL_BLURB = {
    A1: 'present tense, sein/haben, articles, W-questions, verb-second word order, accusative',
    A2: 'Perfekt, modal verbs, dative, separable verbs, comparatives, weil/wenn clauses',
    B1: 'Konjunktiv II, relative clauses, present passive, adjective endings, genitive prepositions, purpose clauses',
    B2: 'concessive connectors, modal passive, je/desto, genitive relative pronouns, als ob, participial attributes, precise collocation',
    C1: 'idiom, Konjunktiv I, nominal style, conditional inversion, register, formal discourse markers'
  };

  function questionBank() {
    return LEVELS.map(function (lvl) {
      var pool = ITEM_BANK[lvl] || [];
      return '<details class="lg-level" open><summary>' + lvl + ' — ' + pool.length + ' questions</summary>' +
        '<p class="muted"><em>Meant to test: ' + esc(LEVEL_BLURB[lvl]) + '.</em></p>' +
        pool.map(function (it) {
          return '<div class="lg-item">' +
            '<div class="lg-item-head"><code>' + esc(it.id) + '</code> <span class="muted">' + esc(it.skill) + ' · ' + esc(it.tag) + '</span></div>' +
            (it.passage ? '<blockquote class="passage">' + nl2br(it.passage) + '</blockquote>' : '') +
            '<p class="lg-stem">' + esc(it.prompt) + '</p>' +
            '<ul class="lg-opts">' + it.options.map(function (o, i) {
              return '<li class="' + (i === it.answer ? 'right' : '') + '">' + (i === it.answer ? '✅ ' : '') + esc(o) + '</li>';
            }).join('') + '</ul>' +
            (it.note ? '<p class="small lg-note"><em>Note for you: ' + esc(it.note) + '</em></p>' : '') +
            '</div>';
        }).join('') +
        '</details>';
    }).join('');
  }

  function build() {
    var total = LEVELS.reduce(function (n, l) { return n + (ITEM_BANK[l] || []).length; }, 0);
    return '' +
'<div class="lg-wrap">' +
'<div class="lg-top"><h2>The German level test — a review by our teachers</h2><button type="button" class="ghost" id="logic-close">Close</button></div>' +
'<p class="sub"><em>Generated from the live question bank. Please do not edit this by hand — tell us what to change and we will update the test itself.</em></p>' +

'<nav class="lg-nav"><strong>Contents</strong> ' +
'<a href="#logic-1">What this is</a> · <a href="#logic-2">What we need from you</a> · <a href="#logic-3">How to tell us</a> · ' +
'<a href="#logic-4">How the test decides someone\'s level</a> · <a href="#logic-5">The questions</a></nav>' +

/* ---------------------------------------------------------------- 1 */
'<h3 id="logic-1">What this is</h3>' +
'<p>A short online test that tells a person which level they should join: A1, A2, B1, B2 or C1. It sits on our website to bring in new students, and we will also use it on a tablet at the front desk when someone walks in.</p>' +
'<p><strong>It is not an exam.</strong> It does not replace what you do in the classroom, and it does not decide anything on its own — we always confirm the level with the student before they start. Its job is to get people close enough to the right course that the conversation starts well.</p>' +
'<p>It tests <strong>reading, grammar and vocabulary only.</strong> There is no speaking, writing or listening in it. The result page says so plainly.</p>' +

/* ---------------------------------------------------------------- 2 */
'<h3 id="logic-2">What we need from you</h3>' +
'<p>Four questions, for each of the ' + total + ' items below. It should take about 45 minutes.</p>' +
'<ol>' +
'<li><strong>Is it at the right level?</strong> Would a student at this level get it right, and a student one level below get it wrong?</li>' +
'<li><strong>Is there exactly one right answer?</strong> <em>This is the one that matters most.</em> If a native speaker could defend one of the other options, the question is broken and has to go.</li>' +
'<li><strong>Is the German natural?</strong> Something a person would actually say or write.</li>' +
'<li><strong>Is anything important missing?</strong> If a level tests something we always teach and it is not here, tell us.</li>' +
'</ol>' +

/* ---------------------------------------------------------------- 3 */
'<h3 id="logic-3">How to tell us</h3>' +
'<p>Every question has a code — <code>B1-06</code>, <code>A2-03</code>. Write the code and what is wrong with it. That is enough. Print this and mark it up, or send the list by email. You do not need to suggest a replacement, though we will take one gladly.</p>' +

/* ---------------------------------------------------------------- 4 */
'<h3 id="logic-4">How the test decides someone\'s level</h3>' +
'<p><strong>The test is in sets of 6 questions.</strong> One set per level.</p>' +
'<p>It starts by asking the person how much German they already know, and begins at roughly that level. Then it moves:</p>' +
'<table class="lg-table"><thead><tr><th>Out of 6 questions</th><th>What the test does</th></tr></thead><tbody>' +
'<tr><td>5 or 6 right</td><td>They know this level — go <strong>up</strong> a set</td></tr>' +
'<tr><td>3 or 4 right</td><td>They are in the middle of this level — <strong>stop here</strong></td></tr>' +
'<tr><td>0, 1 or 2 right</td><td>Too hard — go <strong>down</strong> a set</td></tr>' +
'</tbody></table>' +
'<p>Most people answer 2 or 3 sets, so 12 to 18 questions in total.</p>' +
'<p><strong>The level we report is the level they should join</strong> — the first level they have <em>not</em> mastered. Someone who gets all the A2 questions right and half the B1 questions right is told <strong>B1</strong>, because B1 is what they still need to learn.</p>' +

'<h4>An example</h4>' +
'<p>Someone says they can hold a conversation, so the test starts at B1.</p>' +
'<ul class="plain">' +
'<li><strong>B1 set:</strong> 6 out of 6. They know B1 — go up.</li>' +
'<li><strong>B2 set:</strong> 3 out of 6. They are part-way through B2 — stop.</li>' +
'<li><strong>Result: B2.</strong> They join a B2 course.</li>' +
'</ul>' +
'<p>Had they scored 1 out of 6 on that first B1 set, the test would have gone <em>down</em> to A2 instead. It corrects itself in both directions, so it does not matter much if someone misjudges themselves at the start — it only changes how many questions they answer.</p>' +

'<h4>One thing this means for your review</h4>' +
'<p>There are <strong>10 questions per level in this document, but each person only sees 6 of them</strong>, picked at random. We do that so two people sitting next to each other do not get the same test.</p>' +
'<p>So the ten questions at a level need to be <strong>about equally hard</strong>. If one of them is much harder than the rest, some students get an unfairly difficult set purely by luck. If you spot an odd one out, that is exactly the kind of thing we need to hear.</p>' +

/* ---------------------------------------------------------------- 5 */
'<h3 id="logic-5">The questions</h3>' +
'<p>✅ marks the correct answer.</p>' +
questionBank() +

/* ---------------------------------------------------------------- 6 */
'<h3 id="logic-6">Thank you</h3>' +
'<p>Once we have your notes we will fix the questions and send this back for a second look. Any question the two of you disagree about, we will drop rather than argue over — a question teachers cannot agree on is not one we should be asking students.</p>' +

'<p class="lg-bottom"><button type="button" class="primary" id="logic-close-bottom">Back to the test</button></p>' +
'</div>';
  }
})();
