/* die deutSCHule — "View test logic" panel.
 *
 * A self-contained explanation of how the test works, what it is built on,
 * and the full question bank with answers and framework references — so the
 * teaching team can review everything from inside the prototype.
 *
 * Content mirrors 01-theory-and-framework.md. Loads after items.js and
 * recommend.js (needs ITEM_BANK and LEVELS). Opens as an overlay so the test
 * state underneath is untouched.
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

  var LEVEL_SUMMARY = {
    A1: {
      basis: 'Checked against the un-starred (A1) entries of the telc <em>Start Deutsch 1·2</em> grammar inventory.',
      tests: 'Präsens of sein, haben and regular verbs · article gender · accusative indefinite article · W-questions · Verbzweitstellung · local preposition <em>in</em> · everyday vocabulary from the A1 word list.'
    },
    A2: {
      basis: 'Checked against the starred (A2*) entries of the telc <em>Start Deutsch 1·2</em> grammar inventory — structures required at A2 beyond A1.',
      tests: 'Perfekt of all verbs, including the <em>sein</em> auxiliary with verbs of movement · Präteritum of modal verbs · Dativ after prepositions and with <em>helfen</em> · Komparativ · reflexive verb with fixed preposition · <em>weil</em> and <em>wenn</em> clauses with verb-final order and inversion.'
    },
    B1: {
      basis: '<em>Profile deutsch</em> B1 and the Zertifikat Deutsch tradition; consistent with the school\'s own <em>Netzwerk neu B1</em> syllabus. Two questions sit on the A2/B1 boundary and are flagged for your judgement.',
      tests: 'Systematic Konjunktiv II (irreal conditions — A1/A2 only has the fixed chunks <em>hätte gern, könnten Sie</em>) · relative clauses · present passive · adjective endings · genitive prepositions · <em>damit</em> vs. <em>um … zu</em> · inversion after a fronted <em>obwohl</em>-clause · verbs with prepositions where the preposition changes meaning · a gist-reading item.'
    },
    B2: {
      basis: 'No official grammar inventory exists above B1 (see §3). Each question is anchored to a CEFR B2 descriptor for <strong>range</strong> or <strong>accuracy</strong>.',
      tests: 'Passive with modal verbs · <em>je … desto</em> · genitive relative pronouns <em>dessen/deren</em> · <em>als ob</em> + Konjunktiv II · participial attributes · precise choice between connectors (<em>trotz/wegen</em>, <em>dennoch/deswegen</em>) · transitive vs. intransitive verb pairs (<em>steigen/steigern</em>) · noun–verb collocations · reading for the position a text takes.'
    },
    C1: {
      basis: 'No official inventory exists (Goethe says so explicitly for C1, see §3). Each question is anchored to a CEFR C1 descriptor for <strong>register</strong>, <strong>idiom</strong> or <strong>nuance</strong>.',
      tests: 'Konjunktiv I in reported speech · Nominalstil · uneingeleitete Konditionalsätze (<em>Sollte es …</em>) · formal prepositions (<em>ungeachtet</em>) · idioms and Funktionsverbgefüge (<em>auf taube Ohren stoßen</em>, <em>in Kauf nehmen</em>) · near-synonym discrimination · formal connectors (<em>gleichwohl</em>) · reading for implicit stance.'
    }
  };

  function questionBank() {
    return LEVELS.map(function (lvl) {
      var pool = ITEM_BANK[lvl] || [];
      var s = LEVEL_SUMMARY[lvl];
      return '<details class="lg-level"><summary>' + lvl + ' — ' + pool.length + ' questions</summary>' +
        '<p class="muted">' + s.basis + '</p>' +
        pool.map(function (it) {
          return '<div class="lg-item">' +
            '<div class="lg-item-head"><code>' + esc(it.id) + '</code> <span class="muted">' + esc(it.skill) + ' · ' + esc(it.tag) + '</span></div>' +
            (it.passage ? '<blockquote class="passage">' + nl2br(it.passage) + '</blockquote>' : '') +
            '<p class="lg-stem">' + esc(it.prompt) + '</p>' +
            '<ul class="lg-opts">' + it.options.map(function (o, i) {
              return '<li class="' + (i === it.answer ? 'right' : '') + '">' + (i === it.answer ? '✅ ' : '') + esc(o) + '</li>';
            }).join('') + '</ul>' +
            (it.basis ? '<p class="small"><strong>Basis:</strong> ' + esc(it.basis) + '</p>' : '') +
            (it.note ? '<p class="small lg-note"><strong>Note for reviewers:</strong> ' + esc(it.note) + '</p>' : '') +
            '</div>';
        }).join('') +
        '</details>';
    }).join('');
  }

  function build() {
    return '' +
'<div class="lg-wrap">' +
'<div class="lg-top"><h2>How this test works</h2><button type="button" class="ghost" id="logic-close">Close</button></div>' +
'<p class="sub">What the test is built on, how it decides a level, where every question\'s level comes from, and what it honestly is not. Written for the teaching team.</p>' +

'<nav class="lg-nav"><strong>Contents</strong> ' +
'<a href="#logic-1">1 What it is</a> · <a href="#logic-2">2 How it decides a level</a> · <a href="#logic-3">3 Where the levels come from</a> · ' +
'<a href="#logic-4">4 What each level tests</a> · <a href="#logic-5">5 Self-assessment</a> · <a href="#logic-6">6 Four options</a> · ' +
'<a href="#logic-7">7 Alignment status</a> · <a href="#logic-8">8 What would make it better</a> · <a href="#logic-9">9 The questions</a> · <a href="#logic-10">Sources</a></nav>' +

/* ---------------------------------------------------------------- 1 */
'<h3 id="logic-1">1. What this test is — and is not</h3>' +
'<p>A short online test that estimates which level a person should <strong>join</strong> — A1, A2, B1, B2 or C1 — from their grammar, vocabulary and reading. It sits on the website to bring in new students, and on a tablet at the front desk.</p>' +
'<ul class="plain">' +
'<li><strong>It is not an exam.</strong> It does not replace the classroom, and it decides nothing on its own — the teacher confirms the level on day one.</li>' +
'<li><strong>It measures recognition, not production.</strong> Choosing the right form from four is a different, easier skill than producing it in speech. Receptive control runs ahead of productive control at every level.</li>' +
'<li><strong>It does not test speaking, writing or listening at all.</strong> The three self-assessment statements after the test are a signal, not a substitute.</li>' +
'<li><strong>It has not been formally validated</strong> against independent CEFR-level judgements (see §7). The copy says "estimate" at the start and the end, and never "official".</li>' +
'</ul>' +

/* ---------------------------------------------------------------- 2 */
'<h3 id="logic-2">2. How it decides a level</h3>' +
'<p>The test runs in <strong>sets of six questions</strong>, one set per level. It starts at the level the person says they are at, then moves:</p>' +
'<table class="lg-table"><thead><tr><th>Right out of 6</th><th>What happens</th></tr></thead><tbody>' +
'<tr><td>5 or 6</td><td>They know this level — <strong>go up</strong> a set</td></tr>' +
'<tr><td>3 or 4</td><td>They are working at this level — <strong>stop</strong></td></tr>' +
'<tr><td>0, 1 or 2</td><td>Too hard — <strong>go down</strong> a set</td></tr>' +
'</tbody></table>' +
'<p>Most people answer two or three sets — 12 to 18 questions. The level reported is <strong>the first level they have not mastered</strong>, i.e. the course they should join. Someone who gets all the A2 questions right and half of the B1 questions is told <strong>B1</strong>, because B1 is what they still need.</p>' +
'<p><strong>An example.</strong> Someone says they can hold a conversation, so the test starts at B1. B1 set: 6 of 6 — go up. B2 set: 3 of 6 — stop. <strong>Result: B2.</strong> Had they scored 1 of 6 on that first set, the test would have gone <em>down</em> to A2 instead.</p>' +
'<p>Because it corrects in both directions, a bad self-estimate at the start costs time, not accuracy. We verified this by simulation: for every combination of starting set and true ability, the test arrives at the same level.</p>' +
'<p><strong>The design has a name.</strong> In the measurement literature this is a <em>multistage test</em> with number-correct routing (Hendrickson 2007; Yan, von Davier &amp; Lewis 2014): sets are scored as a unit and route the examinee to the next set. Two things the literature specifically endorses are things this test does — letting people <strong>go back and change answers within a set</strong> (which is why Back does not cross a set boundary: once a set has routed you, re-opening it would let you walk the test upward by trial and error), and descending as well as climbing to recover from a bad start.</p>' +
'<p><strong>Where it is thinner than the literature would like:</strong> six items per set is few. It is a deliberate trade for completion rate — this runs on a phone, and every extra question loses people — and the strict 5-of-6 bar to climb partly compensates. If real data shows people being placed too high, the first lever is eight items per set.</p>' +
'<p><strong>Six from ten.</strong> Each level has ten questions in the bank, and each person sees six of them at random, in a random order with the options shuffled. So two people side by side get different papers. It also means the ten at a level need to be about equally hard — if one is much harder than the rest, some people get an unfairly hard set by luck. That is one of the things we ask you to look for.</p>' +

/* ---------------------------------------------------------------- 3 */
'<h3 id="logic-3">3. Where the levels come from</h3>' +
'<p><strong>The levels are the CEFR\'s.</strong> A1–C1 mean what the Council of Europe\'s <em>Common European Framework of Reference for Languages</em> (2001; Companion Volume 2020) says they mean. But the CEFR describes what a learner <em>can do</em>; it is deliberately language-neutral and contains no list of German grammar. It says a B1 learner "can deal with most situations likely to arise whilst travelling" — not that a B1 learner knows the Konjunktiv II.</p>' +
'<p><strong>The German grammar-per-level mapping comes from the official implementations.</strong> The Council of Europe commissioned language-specific <em>Reference Level Descriptions</em> that "identify the forms of a given language (words, grammar and so on), mastery of which corresponds to the competences defined by the CEFR". For German that is <strong><em>Profile deutsch</em></strong> (Glaboniat, Müller, Rusch, Schmitz &amp; Wertenschlag, Langenscheidt 2005) — can-do statements, vocabulary and grammar for A1–C2, each assigned to a level. Both German exam providers cite it as their basis: the Goethe-Institut aligns its exams against "die Kannbeschreibungen … in Profile deutsch", and telc lists it alongside the CEFR in its exam specifications.</p>' +
'<p>So the chain of authority is <strong>CEFR → Profile deutsch → telc / Goethe exam specifications → this test.</strong> We did not invent the levels; we inherited them from the people whose exams our students go on to sit.</p>' +

'<h4>The A1/A2 inventory every question was checked against</h4>' +
'<p>telc publishes a full grammar inventory for A1 and A2 in <em>Start Deutsch 1·2 — Prüfungsziele, Testbeschreibung</em>, chapter 6. Entries without an asterisk are A1; entries marked * are additionally required at A2. The relevant lines:</p>' +
'<div class="lg-scroll"><table class="lg-table"><thead><tr><th>Structure</th><th>telc level</th></tr></thead><tbody>' +
'<tr><td>Präsens of all verbs; all six modal verbs in the Präsens</td><td>A1</td></tr>' +
'<tr><td>Perfekt of a short list of verbs (arbeiten, bleiben, essen, fahren, fragen, glauben, haben, lesen, lernen, machen, schlafen, sehen, passieren, trinken, verstehen)</td><td>A1</td></tr>' +
'<tr><td>Perfekt of all verbs</td><td>A2*</td></tr>' +
'<tr><td>Präteritum: haben / sein</td><td>A1</td></tr>' +
'<tr><td>Präteritum: kommen, sagen, modal verbs</td><td>A2*</td></tr>' +
'<tr><td>Konjunktiv II — as fixed chunks only (hätte gern, könnten Sie, ich möchte, ich würde gern), "noch nicht systematisch"</td><td>A1/A2</td></tr>' +
'<tr><td>Passiv (receptive: "Das Auto wird repariert")</td><td>A2*</td></tr>' +
'<tr><td>Separable verbs ("Kommst du mit?", "Wann fängt der Kurs an?")</td><td>A1</td></tr>' +
'<tr><td>Kasus: Nominativ, Akkusativ</td><td>A1</td></tr>' +
'<tr><td>Kasus: Dativ</td><td>A2*</td></tr>' +
'<tr><td>Genitiv: proper names only ("Karls Freunde"); otherwise receptive</td><td>A1 / A2*</td></tr>' +
'<tr><td>Attributive adjective endings after definite / indefinite article</td><td>A2*</td></tr>' +
'<tr><td>Komparation</td><td>A2*</td></tr>' +
'<tr><td>Reflexive pronouns</td><td>A2*</td></tr>' +
'<tr><td>Verbzweitstellung, Satzklammer, Negation, Fragesatz</td><td>A1</td></tr>' +
'<tr><td>Connectors: und, oder, aber, denn, dann</td><td>A1</td></tr>' +
'<tr><td>Connectors: deshalb, weil, wenn</td><td>A2*</td></tr>' +
'</tbody></table></div>' +
'<p>One sentence from that chapter describes this test\'s limits exactly: the inventory "bezieht sich … in erster Linie auf die Aufgabenstellung im Bereich der rezeptiven Fertigkeiten"; for speaking and writing "ist die Grammatik-Liste dagegen von untergeordneter Bedeutung." A recognition test measures receptive control, and receptive control runs ahead of productive control.</p>' +

'<h4>Why there is no inventory for B2 and C1</h4>' +
'<p>Both major providers say, in writing, that they deliberately do not list grammar above B1:</p>' +
'<blockquote class="passage">"Auf den Versuch einer Erweiterung der Inventare von Wortschatz und Grammatik durch ergänzende Listen wurde bewusst verzichtet, da auf diesem Niveau … jegliche Festlegung über das für B1 definierte Niveau hinaus gleichermaßen beliebig wie unvollständig wäre."<br><span class="muted">— telc, Handbuch telc Deutsch B2 (2019), §4</span></blockquote>' +
'<blockquote class="passage">"Wortschatz- und Grammatikinventare zum Goethe-Zertifikat C1 gibt es aus folgenden Gründen nicht: Auf dieser Stufe läßt sich keine verbindliche Eingrenzung des Wortschatzes vornehmen, da authentische Texte verwendet werden."<br><span class="muted">— Goethe-Institut, Goethe-Zertifikat C1 Prüfungsziele, §4.4</span></blockquote>' +
'<p>What <em>is</em> specified at those levels is the quality of language use: for B2, "gute Beherrschung der Grammatik; gelegentliche Ausrutscher oder nichtsystematische Fehler"; for C1, "ein breites Spektrum idiomatischer Wendungen und umgangssprachlicher Ausdrucksformen verstehen und Registerwechsel richtig beurteilen", and "eine größere Bandbreite syntaktischer Strukturen". That is why the B2 and C1 questions look different from the A1–B1 ones. They are not "harder grammar rules"; they test <strong>range</strong>, <strong>precision</strong>, <strong>register</strong>, <strong>idiom</strong> and <strong>stance in reading</strong>, and each is anchored to one of those descriptors rather than to a list.</p>' +

/* ---------------------------------------------------------------- 4 */
'<h3 id="logic-4">4. What each level tests</h3>' +
LEVELS.map(function (l) {
  return '<div class="card"><strong>' + l + '</strong><p>' + LEVEL_SUMMARY[l].tests + '</p><p class="muted">' + LEVEL_SUMMARY[l].basis + '</p></div>';
}).join('') +
'<p><strong>Two B1 questions we want your judgement on</strong>, because the inventory and the exam tradition disagree:</p>' +
'<ul class="plain">' +
'<li><strong>B1-03, Passiv Präsens</strong> — telc lists the passive as A2* <em>receptively</em>; <em>Netzwerk neu</em> and the Zertifikat Deutsch tradition teach it at B1. Our question asks the learner to select the auxiliary, which is closer to productive knowledge. Kept at B1.</li>' +
'<li><strong>B1-04, adjective endings</strong> — telc lists attributive endings as A2*; in practice they are consolidated through B1 and every B1 exam scores them. Kept at B1.</li>' +
'</ul>' +

/* ---------------------------------------------------------------- 5 */
'<h3 id="logic-5">5. Self-assessment: it routes, it never places</h3>' +
'<p>Ross (1998) meta-analysed 60 correlations between learners\' self-assessment and their tested ability and found an average of about 0.6 — meaningful, with wide variation, and consistently higher for receptive skills than for speaking and writing. Li &amp; Zhang (2021), with a larger set of studies, found a moderate overall correlation of roughly 0.5. The practical reading: self-assessment predicts level well enough to be <em>useful</em> and not well enough to be <em>decisive</em>.</p>' +
'<p>This test uses it accordingly. The "how much German do you already know?" question decides which set you see first — nothing else. This is the same division of labour DIALANG makes: the Council of Europe–aligned diagnostic system uses a vocabulary-size test and CEFR self-assessment statements to decide which level of test to administer, not to report a result.</p>' +
'<p>The three can-do statements after the test (speaking, writing, listening) never move the level either. They exist because this test cannot measure speaking, and a learner whose grammar tests at B1 but who says they cannot hold a conversation needs to hear "come to a trial lesson", not just "you are B1".</p>' +

/* ---------------------------------------------------------------- 6 */
'<h3 id="logic-6">6. Why four options — and the condition attached</h3>' +
'<p>The best evidence favours <strong>three</strong>. Rodriguez (2005) meta-analysed 80 years of research and concluded that three options are optimal: additional distractors are rarely functional, and the time they cost is better spent on more items. telc\'s own grammar section uses three-option multiple choice.</p>' +
'<p>This test uses <strong>four</strong>, for a reason specific to its design. With only six items per set and a 5-of-6 bar to climb, a learner who can eliminate one option and guess between the rest clears the bar about 11% of the time with three options and under 2% with four. In a long test that washes out; in a six-item routing set it is the difference between a placement and a coin toss.</p>' +
'<p><strong>The condition:</strong> a fourth option only does this work if it is a genuine distractor. A filler fourth looks like four options and functions as three. So when you review the bank, the fourth option is the one to be hardest on — and if you find many weak, the right response is to drop back to three, not to keep a fake fourth.</p>' +

/* ---------------------------------------------------------------- 7 */
'<h3 id="logic-7">7. What "aligned to the CEFR" formally requires — and where this stands</h3>' +
'<p>The Council of Europe\'s <em>Manual for Relating Language Examinations to the CEFR</em> (2009) sets out four stages:</p>' +
'<div class="lg-scroll"><table class="lg-table"><thead><tr><th>Stage</th><th>Meaning</th><th>This test</th></tr></thead><tbody>' +
'<tr><td><strong>Familiarisation</strong></td><td>The people building the test know the CEFR levels well</td><td>Yes</td></tr>' +
'<tr><td><strong>Specification</strong></td><td>The test\'s content is mapped to the levels, with evidence</td><td>Yes — §3–4, and every question\'s Basis line</td></tr>' +
'<tr><td><strong>Standardisation</strong></td><td>Trained judges rate items against calibrated CEFR samples; cut-scores set by a formal procedure</td><td><strong>No</strong></td></tr>' +
'<tr><td><strong>Validation</strong></td><td>Empirical evidence that results agree with independent CEFR-level judgements</td><td><strong>No</strong></td></tr>' +
'</tbody></table></div>' +
'<p>The product is honest about this: "estimate" and "not an official placement" at the start and the end, never "CEFR-certified". The gap is closable (§8) but has not been closed.</p>' +
'<p><strong>The alternative we considered.</strong> The design the German placement research actually favours is the <em>C-test</em>: gapped texts where the learner completes half-words. onSET (formerly onDaF), used by German university language centres, is one; Eckes &amp; Grotjahn\'s validation shows C-tests fit a Rasch scale and correlate 0.5–0.7 with all four skills. It was not used here because it needs typed input, which is slow and error-prone on a phone and unfriendly to a first contact. It remains the strongest candidate for an in-school placement module later.</p>' +

/* ---------------------------------------------------------------- 8 */
'<h3 id="logic-8">8. What would make it better — in order</h3>' +
'<ol>' +
'<li><strong>Your review of the bank</strong> (§9) — with particular attention to the fourth options, to whether the ten questions at each level are equally hard, and to the two boundary items in §4.</li>' +
'<li><strong>Collect the data.</strong> The test records every answer. Once about a hundred real people have taken it, we can see which items behave: an item that B1-placed students get right at the same rate as A2-placed students is doing nothing and should be replaced.</li>' +
'<li><strong>Compare against you.</strong> For every student who takes the test and then starts a course, record the level the teacher confirms on day one. Agreement between the two is the single number that says whether the test works — and it is the validation stage in §7.</li>' +
'<li><strong>Eight items per set</strong> if step 3 shows over-placement.</li>' +
'<li><strong>A C-test module</strong> for in-school use, where typing is fine and a more precise instrument is worth ten more minutes.</li>' +
'</ol>' +

/* ---------------------------------------------------------------- 9 */
'<h3 id="logic-9">9. The questions</h3>' +
'<p>All fifty, with the correct answer marked and the <strong>Basis</strong> each was checked against. Four things to look at for each: Is it at the right level? Is there exactly one right answer — could a native speaker defend any other option? Is the German natural? Is the fourth option a real temptation? Write the code (e.g. <code>B1-06</code>) and what is wrong; that is enough.</p>' +
questionBank() +

/* --------------------------------------------------------------- 10 */
'<h3 id="logic-10">Sources</h3>' +
'<ul class="plain small">' +
'<li>Council of Europe (2001). <em>Common European Framework of Reference for Languages</em>; (2020) <em>Companion Volume</em>. <a href="https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions" target="_blank" rel="noopener">coe.int — the levels</a></li>' +
'<li>Council of Europe. <em>Reference Level Descriptions</em>. <a href="https://www.coe.int/en/web/common-european-framework-reference-languages/reference-level-descriptions" target="_blank" rel="noopener">coe.int — RLDs</a></li>' +
'<li>Glaboniat, Müller, Rusch, Schmitz &amp; Wertenschlag (2005). <em>Profile deutsch</em>, Version 2.0. Langenscheidt.</li>' +
'<li>Council of Europe (2009). <em>Relating Language Examinations to the CEFR: A Manual</em>. <a href="https://www.coe.int/en/web/common-european-framework-reference-languages/relating-examinations-to-the-cefr" target="_blank" rel="noopener">coe.int</a></li>' +
'<li>telc (2003). <em>Start Deutsch 1·2 — Prüfungsziele, Testbeschreibung</em>, ch. 6 Inventare: Grammatik. <a href="https://www.dsh-germany.com/_downloads/certificates/telc/pdf/telc-deutsch-1+2-lernzielbeschreibung.pdf" target="_blank" rel="noopener">PDF</a></li>' +
'<li>telc (2019). <em>Handbuch telc Deutsch B2</em>. <a href="https://www.telc.net/fileadmin/user_upload/pdfs/Handbuch_und_Tipps_fuer_Pruefungsvorbereitung/Deutsch_B2_Handbuch.pdf" target="_blank" rel="noopener">PDF</a></li>' +
'<li>Goethe-Institut (2008). <em>Goethe-Zertifikat C1 — Prüfungsziele, Testbeschreibung</em>. <a href="https://www.goethe.de/resources/files/pdf62/Pruefungsziele_Testbeschreibung_C1.pdf" target="_blank" rel="noopener">PDF</a></li>' +
'<li>Hendrickson, A. (2007). An NCME Instructional Module on Multistage Testing. <em>Educational Measurement: Issues and Practice</em>, 26(2). <a href="https://ncme.org/wp-content/uploads/2025/10/Module-25-Multi-stage-Testing-Hendrickson-Summer-1.pdf" target="_blank" rel="noopener">PDF</a></li>' +
'<li>Yan, von Davier &amp; Lewis (eds.) (2014). <em>Computerized Multistage Testing: Theory and Applications</em>. CRC Press.</li>' +
'<li>Alderson, J. C. (2005). <em>Diagnosing Foreign Language Proficiency</em> (DIALANG). Continuum.</li>' +
'<li>Rodriguez, M. C. (2005). Three Options Are Optimal for Multiple-Choice Items. <em>Educational Measurement: Issues and Practice</em>, 24(2). <a href="https://onlinelibrary.wiley.com/doi/10.1111/j.1745-3992.2005.00006.x" target="_blank" rel="noopener">Wiley</a></li>' +
'<li>Ross, S. (1998). Self-assessment in second language testing: a meta-analysis. <em>Language Testing</em>, 15(1). <a href="https://journals.sagepub.com/doi/10.1177/026553229801500101" target="_blank" rel="noopener">SAGE</a></li>' +
'<li>Li, M. &amp; Zhang, X. (2021). A meta-analysis of self-assessment and language performance. <em>Language Testing</em>, 38(2). <a href="https://journals.sagepub.com/doi/abs/10.1177/0265532220932481" target="_blank" rel="noopener">SAGE</a></li>' +
'<li>Eckes, T. &amp; Grotjahn, R. (2006). Der Online-Einstufungstest Deutsch als Fremdsprache (onDaF). <a href="https://www.onset.de/en/language-placement-test-english-onset/research/" target="_blank" rel="noopener">onSET research</a></li>' +
'</ul>' +

'<p class="lg-bottom"><button type="button" class="primary" id="logic-close-bottom">Back to the test</button></p>' +
'</div>';
  }
})();
