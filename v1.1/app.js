/* die deutSCHule — level test + lead capture (v2)
 * Flow, state and the adaptive ladder. No dependencies, no build step.
 * See 00-spec.md for why the flow is ordered the way it is.
 */

(function () {
  'use strict';

  var MODE = new URLSearchParams(location.search).get('mode') === 'staff' ? 'staff' : 'public';
  var BLOCK_SIZE = 6;

  function freshState() { return {
    mode: MODE,
    startedAt: new Date().toISOString(),
    prior: null,
    blocks: [],          // completed blocks
    currentBlock: null,
    direction: null,     // 'up' | 'down' | null
    placement: null,
    self: { speaking: null, writing: null, listening: null },
    selfAssessGap: false,
    goals: [],
    targetLevel: null,
    exams: [],
    visa: null,
    format: null,
    timeSlot: null,
    weeksAvailable: null,
    startWhen: null,
    firstName: '', lastName: '', email: '', phone: '',
    ageBand: '', countryResidence: '', nationality: '', contactLanguage: 'en',
    contactConsent: false, marketingConsent: false,
    contactSkipped: false
  }; }

  var S = freshState();
  var app = document.getElementById('app');

  /* Wipes everything and returns to the intro. Optionally switches mode —
   * the two versions ask for contact details at different points, so a mode
   * change has to start over. */
  function restart(mode) {
    if (mode) MODE = mode;
    S = freshState();
    intro();
  }

  var protoRestart = document.getElementById('proto-restart');
  if (protoRestart) protoRestart.addEventListener('click', function () { restart(); });

  /* ---------------------------------------------------------------- utils */

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function sample(arr, n) { return shuffle(arr.slice()).slice(0, n); }
  function nl2br(s) { return esc(s).replace(/\n/g, '<br>'); }
  function eur(n) { return '€' + Number(n).toLocaleString('de-DE'); }

  function screen(title, sub, bodyHtml, footerHtml) {
    app.innerHTML =
      '<div class="screen">' +
        '<h2>' + title + '</h2>' +
        (sub ? '<p class="sub">' + sub + '</p>' : '') +
        '<div class="body">' + bodyHtml + '</div>' +
        '<div class="footer">' + (footerHtml || '') + '</div>' +
      '</div>';
    window.scrollTo(0, 0);
  }

  function progress(step, total, label) {
    return '<div class="progress">Step ' + step + ' of ' + total + (label ? ' — ' + label : '') + '</div>';
  }

  function radios(name, items, current) {
    return items.map(function (o) {
      var id = name + '_' + o.value;
      return '<label class="opt" for="' + id + '">' +
        '<input type="radio" name="' + name + '" id="' + id + '" value="' + esc(o.value) + '"' +
        (current === o.value ? ' checked' : '') + '>' +
        '<span><strong>' + esc(o.label) + '</strong>' +
        (o.hint ? '<em>' + esc(o.hint) + '</em>' : '') + '</span></label>';
    }).join('');
  }

  function checks(name, items, current) {
    return items.map(function (o) {
      var id = name + '_' + o.value;
      return '<label class="opt" for="' + id + '">' +
        '<input type="checkbox" name="' + name + '" id="' + id + '" value="' + esc(o.value) + '"' +
        (current.indexOf(o.value) > -1 ? ' checked' : '') + '>' +
        '<span><strong>' + esc(o.label) + '</strong>' +
        (o.hint ? '<em>' + esc(o.hint) + '</em>' : '') + '</span></label>';
    }).join('');
  }

  function picked(name) { var n = document.querySelector('input[name="' + name + '"]:checked'); return n ? n.value : null; }
  function pickedAll(name) { return [].slice.call(document.querySelectorAll('input[name="' + name + '"]:checked')).map(function (n) { return n.value; }); }
  function val(id) { var n = document.getElementById(id); return n ? n.value.trim() : ''; }
  function on(sel, fn) { var n = document.querySelector(sel); if (n) n.addEventListener('click', fn); }

  function warn(msg) {
    var f = document.querySelector('.footer');
    var old = document.querySelector('.warn');
    if (old) old.remove();
    f.insertAdjacentHTML('afterbegin', '<p class="warn">' + esc(msg) + '</p>');
  }

  function findItem(id) {
    var lvl = id.slice(0, 2);
    return (ITEM_BANK[lvl] || []).filter(function (i) { return i.id === id; })[0];
  }

  /* ------------------------------------------------------------- 1. intro */

  function intro() {
    screen('How good is your German?',
      'A short test that gives you a rough idea of your level and which course to start in.',
      '<div class="notice">' +
        '<p><strong>This is a rough guide, not an official test.</strong> It is not an exam, it is not a formal ' +
        'placement, and it gives you nothing you can show an employer or an authority. Think of it as a ' +
        'starting point for the conversation.</p>' +
        '<p>It looks at grammar, vocabulary and reading only — it cannot hear you speak. We always confirm ' +
        'your real level with you before you start a course.</p>' +
      '</div>' +
      '<ul class="plain">' +
        '<li><strong>About 8 minutes.</strong> The test adapts — it stops as soon as it has a good idea of where you are.</li>' +
        '<li><strong>You get a level and a plan:</strong> which course to join, how long it takes to reach your goal, what it costs.</li>' +
        '<li><strong>Nothing to prepare.</strong> Answer honestly — guessing well only lands you in a class that is too hard.</li>' +
      '</ul>' +
      (MODE === 'staff' ? '<p class="staffbar">Front-desk version — contact details are optional, and you get a summary to copy at the end.</p>' : ''),
      '<button class="primary" id="go">Start the test</button>');
    on('#go', prior);

    document.querySelector('.body').insertAdjacentHTML('beforeend',
      '<p class="modelink"><a href="#" id="modeswap">' +
      (MODE === 'staff' ? 'Switch to the website version' : 'Open the front-desk version') +
      '</a> — for the team, not for visitors.</p>');
    on('#modeswap', function (e) {
      e.preventDefault();
      restart(MODE === 'staff' ? 'public' : 'staff');
    });
  }

  /* -------------------------------------------------------- 2. prior German */

  var PRIOR = [
    { value: 'none', label: 'None at all — I am starting from zero', hint: 'We will skip the test' },
    { value: 'A1',   label: 'A few words, or I have just started' },
    { value: 'A2',   label: 'I can handle simple everyday situations' },
    { value: 'B1',   label: 'I can hold a conversation on familiar topics' },
    { value: 'B2',   label: 'I am comfortable with complex and abstract topics' }
  ];

  function prior() {
    screen('How much German do you already know?',
      'Be honest — this only decides where the test starts. It corrects itself either way.',
      progress(1, 6, 'about you') + radios('prior', PRIOR, S.prior),
      '<button class="primary" id="next">Continue</button>');
    on('#next', function () {
      var v = picked('prior');
      if (!v) return warn('Pick one to continue.');
      S.prior = v;
      if (v === 'none') {
        S.placement = { level: 'A1', index: 0, position: 'start', mastered: [], atCeiling: false,
          note: 'No prior German, so you start at the beginning — A1. No test needed.' };
        return goals();
      }
      startBlock(v);
      testScreen();
    });
  }

  /* ----------------------------------------------------------- 3. the test */

  function prepItem(it) {
    var opts = it.options.map(function (text, i) { return { text: text, correct: i === it.answer }; });
    shuffle(opts);
    return { id: it.id, skill: it.skill, tag: it.tag, passage: it.passage || null, prompt: it.prompt, options: opts };
  }

  function startBlock(level) {
    S.currentBlock = {
      level: level,
      items: sample(ITEM_BANK[level], BLOCK_SIZE).map(prepItem),
      idx: 0, correct: 0, answers: []
    };
  }

  function testScreen() {
    var b = S.currentBlock;
    var it = b.items[b.idx];
    var setNo = S.blocks.length + 1;
    var prev = b.answers[b.idx];

    var dots = b.items.map(function (_, i) {
      var cls = i === b.idx ? 'here' : (b.answers[i] ? 'done' : '');
      return '<span class="dot ' + cls + '"></span>';
    }).join('');

    screen('Question ' + (b.idx + 1) + ' of ' + b.items.length,
      'Choose the option that fits.',
      '<div class="progress">Set ' + setNo + '</div>' +
      '<div class="dots">' + dots + '</div>' +
      (it.passage ? '<blockquote class="passage">' + nl2br(it.passage) + '</blockquote>' : '') +
      '<p class="stem">' + esc(it.prompt) + '</p>' +
      it.options.map(function (o, i) {
        return '<label class="opt" for="o' + i + '"><input type="radio" name="ans" id="o' + i + '" value="' + i + '"' +
               (prev && prev.chosen === i ? ' checked' : '') + '>' +
               '<span><strong>' + esc(o.text) + '</strong></span></label>';
      }).join('') +
      '<p class="muted">Most people finish after two or three sets — the test stops as soon as it knows your level. ' +
      'A set is always ' + BLOCK_SIZE + ' questions.</p>',

      (b.idx > 0 ? '<button class="ghost" id="back">Back</button> ' : '') +
      '<button class="primary" id="next">' + (prev ? 'Save and continue' : 'Next') + '</button> ' +
      '<button class="ghost" id="dunno">I don\'t know</button>');

    on('#next', function () {
      var v = picked('ans');
      if (v === null) return warn('Pick an answer, or use "I don\'t know".');
      answer(Number(v));
    });
    on('#dunno', function () { answer(-1); });
    on('#back', function () { b.idx--; testScreen(); });
  }

  /** optIdx = index into the shuffled options, or -1 for "I don't know". */
  function answer(optIdx) {
    var b = S.currentBlock;
    var it = b.items[b.idx];
    var chosen = optIdx >= 0 ? it.options[optIdx] : null;

    b.answers[b.idx] = {
      id: it.id, level: b.level, skill: it.skill, tag: it.tag,
      chosen: optIdx,
      given: chosen ? chosen.text : '(skipped)',
      correctAnswer: it.options.filter(function (o) { return o.correct; })[0].text,
      correct: !!(chosen && chosen.correct)
    };
    b.correct = b.answers.filter(function (a) { return a && a.correct; }).length;

    b.idx++;
    if (b.idx < b.items.length) return testScreen();
    finishBlock();
  }

  function finishBlock() {
    var b = S.currentBlock;
    S.blocks.push({ level: b.level, correct: b.correct, total: b.items.length, answers: b.answers });

    var i = LEVELS.indexOf(b.level);
    var done = S.blocks.map(function (x) { return x.level; });

    // Mastered — climb, unless we are already on the way down or at the top.
    if (b.correct >= 5) {
      if (S.direction !== 'down' && i < LEVELS.length - 1 && done.indexOf(LEVELS[i + 1]) < 0) {
        S.direction = 'up';
        startBlock(LEVELS[i + 1]);
        return testScreen();
      }
      return endTest();
    }
    // Failed badly — drop down, unless we climbed here or we are at the bottom.
    if (b.correct <= 2) {
      if (S.direction !== 'up' && i > 0 && done.indexOf(LEVELS[i - 1]) < 0) {
        S.direction = 'down';
        startBlock(LEVELS[i - 1]);
        return testScreen();
      }
      return endTest();
    }
    return endTest();   // partial — this is the level they are working at
  }

  function endTest() {
    S.currentBlock = null;
    S.placement = placeFromBlocks(S.blocks);
    selfCheck();
  }

  /* ------------------------------------------------------- 4. self-check */

  var CANDO = [
    { key: 'speaking',  q: 'I can speak German in everyday situations without preparing first.' },
    { key: 'writing',   q: 'I can write emails or messages in German without help.' },
    { key: 'listening', q: 'I can follow German speakers when they talk at normal speed.' }
  ];
  var SCALE = [
    { value: '0', label: 'Not at all' },
    { value: '1', label: 'With difficulty' },
    { value: '2', label: 'Fairly well' },
    { value: '3', label: 'Easily' }
  ];

  function selfCheck() {
    screen('Three quick questions about yourself',
      'The test measured reading and grammar. This tells us about the rest.',
      progress(3, 6, 'self-check') +
      CANDO.map(function (c) {
        return '<fieldset><legend>' + esc(c.q) + '</legend>' + radios('self_' + c.key, SCALE, null) + '</fieldset>';
      }).join(''),
      '<button class="primary" id="next">Continue</button>');

    on('#next', function () {
      for (var i = 0; i < CANDO.length; i++) {
        var v = picked('self_' + CANDO[i].key);
        if (v === null) return warn('Please answer all three.');
        S.self[CANDO[i].key] = Number(v);
      }
      var idx = S.placement.index;
      S.selfAssessGap = (idx >= LEVELS.indexOf('B1') && S.self.speaking <= 1) ||
                        (idx >= LEVELS.indexOf('C1') && S.self.speaking <= 2);
      goals();
    });
  }

  /* ------------------------------------------------------------ 5. goals */

  var GOALS = [
    { value: 'visa',         label: 'A visa or residence permit' },
    { value: 'university',   label: 'Studying at a German university' },
    { value: 'work',         label: 'Work or my career' },
    { value: 'everyday',     label: 'Everyday life in Germany' },
    { value: 'citizenship',  label: 'Citizenship' },
    { value: 'conversation', label: 'Speaking more confidently' },
    { value: 'interest',     label: 'Personal interest' }
  ];
  var TARGETS = [
    { value: 'unsure', label: 'I am not sure — recommend something' },
    { value: 'A2', label: 'A2 — basic everyday German' },
    { value: 'B1', label: 'B1 — independent everyday use', hint: 'Commonly asked for in residence and citizenship procedures' },
    { value: 'B2', label: 'B2 — confident at work' },
    { value: 'C1', label: 'C1 — university and professional level' }
  ];
  var EXAMS = [
    { value: 'telc',       label: 'telc', hint: 'Widely accepted for visa, residence and citizenship' },
    { value: 'testdaf',    label: 'TestDaF', hint: 'For university admission' },
    { value: 'zertifikat', label: 'Zertifikat Deutsch — our in-house exam', hint: 'A1–C1, results in about a week' },
    { value: 'unsure',     label: 'I need a certificate but do not know which' },
    { value: 'none',       label: 'No certificate — I just want to learn' }
  ];

  function goals() {
    screen('What do you need German for?',
      'Pick everything that applies.',
      progress(4, 6, 'your goal') +
      '<fieldset><legend>Why are you learning German?</legend>' + checks('goals', GOALS, S.goals) + '</fieldset>' +
      '<fieldset><legend>Which level do you want to reach?</legend>' + radios('target', TARGETS, S.targetLevel) + '</fieldset>' +
      '<fieldset><legend>Do you need an official certificate? <span class="hintlabel">Pick as many as apply</span></legend>' +
        checks('exams', EXAMS, S.exams) + '</fieldset>',
      '<button class="primary" id="next">Continue</button>');

    on('#next', function () {
      S.goals = pickedAll('goals');
      S.targetLevel = picked('target');
      S.exams = pickedAll('exams');
      if (!S.goals.length) return warn('Pick at least one reason.');
      if (!S.targetLevel) return warn('Tell us which level you are aiming for.');
      if (!S.exams.length) return warn('Let us know about certificates — pick "No certificate" if none apply.');
      if (S.exams.length > 1 && S.exams.indexOf('none') > -1) {
        S.exams = S.exams.filter(function (e) { return e !== 'none'; });
      }
      situation();
    });
  }

  /* -------------------------------------------------------- 6. situation */

  var VISA = [
    { value: 'applying', label: 'Yes — I need a language visa', hint: 'Changes the contract, the price and the lessons per week' },
    { value: 'have',     label: 'No — I already live in Germany' },
    { value: 'exempt',   label: 'No — I do not need a visa (EU or visa-free nationality)' },
    { value: 'unsure',   label: 'I am not sure' }
  ];
  var FORMAT = [
    { value: 'inperson', label: 'In person in Berlin-Neukölln' },
    { value: 'online',   label: 'Live online', hint: 'Same teachers, same course, same price' },
    { value: 'unsure',   label: 'Either works' }
  ];
  var SLOTS = [
    { value: 'morning',   label: 'Morning — 09:15 to 12:30' },
    { value: 'afternoon', label: 'Afternoon — 13:15 to 16:30', hint: 'In person only' },
    { value: 'evening',   label: 'Evening — 17:00 to 20:15' },
    { value: 'flexible',  label: 'Flexible' }
  ];
  var WEEKS = [
    { value: '4',  label: 'About a month' },
    { value: '8',  label: 'About two months' },
    { value: '12', label: 'About three months' },
    { value: '24', label: 'About six months' },
    { value: '48', label: 'A year or more' },
    { value: '',   label: 'Not sure yet' }
  ];
  var START = [
    { value: 'asap',    label: 'As soon as possible' },
    { value: '1month',  label: 'Within a month' },
    { value: '3months', label: 'In two or three months' },
    { value: 'later',   label: 'Later than that' },
    { value: 'unsure',  label: 'Not sure' }
  ];

  function situation() {
    screen('How would you like to study?', '',
      progress(5, 6, 'your situation') +
      '<fieldset><legend>Do you need a visa to study here?</legend>' + radios('visa', VISA, S.visa) + '</fieldset>' +
      '<fieldset><legend>In person or online?</legend>' + radios('format', FORMAT, S.format) + '</fieldset>' +
      '<fieldset><legend>Which time of day suits you?</legend>' + radios('slot', SLOTS, S.timeSlot) + '</fieldset>' +
      '<fieldset><legend>How long can you study for?</legend>' + radios('weeks', WEEKS, S.weeksAvailable) + '</fieldset>' +
      '<fieldset><legend>When do you want to start?</legend>' + radios('start', START, S.startWhen) + '</fieldset>',
      '<button class="ghost" id="back">Back</button> <button class="primary" id="next">Continue</button>');

    on('#next', function () {
      S.visa = picked('visa'); S.format = picked('format'); S.timeSlot = picked('slot');
      S.weeksAvailable = picked('weeks'); S.startWhen = picked('start');
      if (!S.visa || !S.format || !S.timeSlot || S.weeksAvailable === null || !S.startWhen) {
        return warn('Please answer all five.');
      }
      contact();
    });
    on('#back', goals);
  }

  /* ---------------------------------------------------------- 7. contact */

  var AGES = ['under16', '16-17', '18-24', '25-34', '35-49', '50+'];

  function contact() {
    var countries = VISA_EXEMPT.concat(['Brazil', 'Colombia', 'Mexico', 'Argentina', 'Chile', 'Peru',
      'Turkey', 'Ukraine', 'Russia', 'India', 'Pakistan', 'Bangladesh', 'China', 'Vietnam', 'Indonesia',
      'Philippines', 'Thailand', 'Iran', 'Iraq', 'Syria', 'Lebanon', 'Egypt', 'Morocco', 'Tunisia',
      'Algeria', 'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Ethiopia', 'United Kingdom', 'Serbia',
      'Bosnia and Herzegovina', 'Albania', 'Kosovo', 'North Macedonia', 'Georgia', 'Armenia', 'Kazakhstan']).sort();

    screen(MODE === 'staff' ? 'Visitor details' : 'Where should we send your plan?',
      MODE === 'staff'
        ? 'Fill in what the visitor is happy to give. You can skip this entirely.'
        : 'Your level is ready. We will show it either way — these details let us put a real course, a timeline and a price next to it.',
      progress(6, 6, 'your details') +
      '<div class="grid">' +
        field('firstName', 'First name', 'text', true) +
        field('lastName', 'Last name', 'text', false) +
        field('email', 'Email', 'email', true) +
        field('phone', 'Phone (optional)', 'tel', false) +
      '</div>' +
      '<fieldset><legend>Age</legend>' +
        radios('age', AGES.map(function (a) { return { value: a, label: a.replace('under16', 'Under 16').replace('50+', '50 or over') }; }), S.ageBand) +
      '</fieldset>' +
      '<div class="grid">' +
        '<label class="fld"><span>Country you live in</span><input id="countryResidence" list="countries" value="' + esc(S.countryResidence) + '"></label>' +
        '<label class="fld"><span>Nationality</span><input id="nationality" list="countries" value="' + esc(S.nationality) + '"></label>' +
      '</div>' +
      '<datalist id="countries">' + countries.map(function (c) { return '<option value="' + esc(c) + '">'; }).join('') + '</datalist>' +
      '<fieldset><legend>Which language should we reply in?</legend>' +
        radios('lang', [{ value: 'en', label: 'English' }, { value: 'de', label: 'Deutsch' }], S.contactLanguage) +
      '</fieldset>' +
      '<label class="opt"><input type="checkbox" id="consent"><span><strong>Yes, contact me about my result and the courses that fit.</strong>' +
        '<em>Required so we can reply. See our <a href="' + SCHOOL.privacyUrl + '" target="_blank" rel="noopener">privacy policy</a>.</em></span></label>' +
      '<label class="opt"><input type="checkbox" id="marketing"><span><strong>Send me course news and start dates too.</strong>' +
        '<em>Optional. You can unsubscribe any time.</em></span></label>',
      '<button class="ghost" id="back">Back</button> ' +
      '<button class="primary" id="next">See my result</button>' +
      (MODE === 'staff' ? ' <button class="ghost" id="skip">Skip — walk-in</button>' : ''));

    on('#next', function () {
      readContact();
      if (MODE !== 'staff') {
        if (!S.firstName) return warn('We need a first name.');
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(S.email)) return warn('That email address does not look right.');
        if (!S.ageBand) return warn('Please pick an age range — some courses have a minimum age.');
        if (!S.contactConsent) return warn('We need your permission to reply before we can send anything.');
      }
      result();
    });
    on('#skip', function () { readContact(); S.contactSkipped = true; result(); });
    on('#back', function () { readContact(); situation(); });
  }

  function readContact() {
    S.firstName = val('firstName'); S.lastName = val('lastName');
    S.email = val('email'); S.phone = val('phone');
    S.ageBand = picked('age') || ''; S.contactLanguage = picked('lang') || 'en';
    S.countryResidence = val('countryResidence'); S.nationality = val('nationality');
    var c = document.getElementById('consent'), m = document.getElementById('marketing');
    S.contactConsent = !!(c && c.checked); S.marketingConsent = !!(m && m.checked);
  }

  function field(id, label, type, required) {
    return '<label class="fld"><span>' + esc(label) + (required ? ' *' : '') + '</span>' +
      '<input id="' + id + '" type="' + type + '" value="' + esc(S[id] || '') + '"></label>';
  }

  /* ----------------------------------------------------------- 8. result */

  function result() {
    var r = recommend(S);
    var p = S.placement;
    var html = '';

    /* --- the level --- */
    html += '<div class="result-level">' +
      '<div class="big">' + esc(p.level) + '</div>' +
      '<p class="levelname">' + esc(r.levelInfo.title) + '</p>' +
      '<p>' + (p.atCeiling
        ? 'You are at C1 — the top of what this test can measure.'
        : 'This is the level you should join, not the level you have finished.') + '</p>' +
      (p.note ? '<p class="muted">' + esc(p.note) + '</p>' : '') +
      '</div>';

    html += '<div class="notice"><p><strong>An estimate, not an official placement.</strong> ' +
      'This was a short online test of grammar, vocabulary and reading — no speaking, no writing, no ' +
      'listening. It is a rough guideline to start your journey, not a qualification, and it is not the ' +
      'same as an exam result. Your teacher confirms your level on day one, and we move you if it is wrong.</p></div>';

    html += howWeGotThere();

    /* --- the journey to their goal — the heart of the page --- */
    if (r.journey) {
      var j = r.journey;
      html += '<section class="journey"><h3>Getting to ' + esc(j.to) + '</h3>' +
        '<p class="lead">' + j.steps.length + (j.steps.length === 1 ? ' level' : ' levels') +
        ' · about ' + j.totalWeeks + ' weeks of intensive study</p>' +
        '<p class="path">' + j.steps.map(function (s) {
          return '<span class="rung' + (s.isStart ? ' now' : '') + (s.isGoal ? ' goal' : '') + '">' + s.level + '</span>';
        }).join(' → ') + '</p>' +
        j.steps.map(function (s) {
          return '<div class="card step' + (s.isStart ? ' start' : '') + (s.isGoal ? ' goal' : '') + '">' +
            '<div class="steptag">' +
              (s.isStart ? 'You start here' : '') +
              (s.isStart && s.isGoal ? ' · ' : '') +
              (s.isGoal ? 'Your goal' : '') +
              (!s.isStart && !s.isGoal ? 'Then' : '') +
            '</div>' +
            '<strong>' + esc(s.info.title) + '</strong> <span class="muted">· ' + s.weeks + ' weeks · ' + esc(s.info.book) + '</span>' +
            '<p><em>What you learn:</em> ' + esc(s.info.learn) + '</p>' +
            (s.isGoal ? '<p><em>What ' + esc(s.level) + ' is good for:</em> ' + esc(s.info.useFor) + '</p>' : '') +
            '</div>';
        }).join('') +
        '</section>';
    }

    /* --- the course they join now --- */
    if (r.course) {
      html += '<section><h3>Your first course</h3>' +
        '<p class="lead">' + esc(r.course.name) + '</p>' +
        '<ul class="plain">' +
          '<li>' + r.course.lessonsPerWeek + ' lessons a week, ' + r.course.days +
            (r.course.slot && r.course.slot !== 'flexible' ? ', ' + esc(r.course.slot) + ' slot' : '') + '</li>' +
          '<li>' + r.course.weeks + ' weeks — ' + eur(r.course.price) + '</li>' +
          '<li>Maximum ' + r.course.maxClassSize + ' students, in person and online alike</li>' +
          '<li>Taught entirely in German from A1 up</li>' +
        '</ul></section>';
    }

    /* --- what the whole journey costs --- */
    if (r.price) {
      html += '<section><h3>What it costs</h3><ul class="plain">' +
        '<li>Closest package we sell to the full journey: <strong>' + r.price.packageWeeks + ' weeks — ' +
          eur(r.price.price) + '</strong>' + (r.price.contract === 'visa' ? ' (visa contract)' : '') + '</li>' +
        '<li>' + (r.price.registrationFee ? 'Registration: ' + eur(r.price.registrationFee) : 'Registration is free') + '</li>' +
        '<li>You do not have to book it all at once — we sell blocks from one week up, and you can book level by level.</li>' +
        '</ul></section>';
    }

    if (r.addons.length) {
      html += '<section><h3>Worth adding</h3>' + r.addons.map(function (a) {
        return '<div class="card"><strong>' + esc(a.name) + ' — ' + eur(a.price) + '</strong><p>' + esc(a.why) + '</p></div>';
      }).join('') + '</section>';
    }

    if (r.exams.length) {
      html += '<section><h3>' + (r.exams.length > 1 ? 'Your exams' : 'Your exam') + '</h3>' +
        r.exams.map(function (e) {
          var fee = '';
          if (e.fee) {
            var parts = (e.feeLabel || 'internal / external').split(' / ');
            var a = e.fee.internal !== undefined ? e.fee.internal : e.fee.digital;
            var b = e.fee.external !== undefined ? e.fee.external : e.fee.paper;
            fee = '<p>Exam fee: ' + eur(a) + ' ' + esc(parts[0]) + ', ' + eur(b) + ' ' + esc(parts[1]) + '.</p>';
          }
          return '<div class="card"><strong>' + esc(e.name) + '</strong>' + fee +
            (e.prep ? '<p>Preparation: ' + esc(e.prep.name) + ' — ' + e.prep.weeks + ' weeks, ' + eur(e.prep.price) + '.</p>' : '') +
            '<p>' + esc(e.note) + '</p></div>';
        }).join('') +
        '<p class="muted">Finishing a course does not give you a certificate. Only passing an exam does.</p></section>';
    }

    if (r.flags.length) {
      html += '<section><h3>Read this before you book</h3>' +
        r.flags.map(function (f) { return '<div class="card flag"><p>' + esc(f.text) + '</p></div>'; }).join('') +
        '</section>';
    }

    html += '<section><h3>Next steps</h3><ol>' +
      r.nextSteps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>' +
      '<p>' + (S.firstName ? esc(S.firstName) + ', we' : 'We') + ' will be in touch — or reach us first: ' +
      '<a href="' + SCHOOL.schedulesUrl + '" target="_blank" rel="noopener">current start dates</a> · ' +
      '<a href="' + SCHOOL.registrationUrl + '" target="_blank" rel="noopener">register</a> · ' +
      esc(SCHOOL.email) + ' · ' + esc(SCHOOL.phone) + '</p></section>';

    html += '<p class="muted disclaimer">' + esc(r.disclaimer) + '</p>';

    if (MODE === 'staff') {
      html += '<section class="staffbox"><h3>Front desk summary</h3>' +
        '<textarea rows="14" readonly id="staffsum">' + esc(staffSummary(r)) + '</textarea>' +
        '<button class="ghost" id="copysum">Copy summary</button></section>';
    }

    html += '<details class="devbox"><summary>Lead data (internal — this is what would go to Jotform / the CRM)</summary>' +
      '<textarea rows="16" readonly>' + esc(JSON.stringify(buildLead(r), null, 2)) + '</textarea></details>';

    screen('Your German level', '', html, '<button class="ghost" id="restart">Start again</button>');
    on('#restart', function () { restart(); });
    on('#copysum', function (e) {
      var t = document.getElementById('staffsum');
      var done = function () { e.target.textContent = 'Copied'; setTimeout(function () { e.target.textContent = 'Copy summary'; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t.value).then(done, function () { t.select(); });
      } else { t.select(); try { document.execCommand('copy'); done(); } catch (err) { /* leave it selected */ } }
    });
  }

  /** The two "how did we decide this" dropdowns. The per-question one is
   *  internal — see 00-spec.md §9 before launch. */
  function howWeGotThere() {
    if (!S.blocks.length) return '';
    var html = '<details><summary>How we got there</summary><ul class="plain">' +
      S.blocks.map(function (b) {
        return '<li>' + b.level + ' questions: <strong>' + b.correct + ' of ' + b.total + '</strong> correct' +
          (b.correct >= 5 ? ' — solid, so we moved up' : b.correct <= 2 ? ' — not yet, so we moved down' : ' — about half, so we stopped here') + '</li>';
      }).join('') +
      '</ul><p class="muted">The test starts where you told us and moves up or down until it settles. ' +
      'It stopped after ' + S.blocks.length + ' set' + (S.blocks.length === 1 ? '' : 's') + '.</p></details>';

    var all = S.blocks.reduce(function (a, b) { return a.concat(b.answers); }, []);
    html += '<details class="devbox"><summary>Question by question (internal review)</summary>' +
      '<p class="muted">Internal only — this is here so we can check the item bank. It comes out before launch.</p>' +
      '<ol class="qreview">' + all.map(function (a) {
        var item = findItem(a.id);
        return '<li class="' + (a.correct ? 'ok' : 'no') + '">' +
          '<span class="mark">' + (a.correct ? '✓' : '✗') + '</span> ' +
          '<code>' + esc(a.id) + '</code> <span class="muted">' + esc(a.skill) + ' · ' + esc(a.tag) + '</span>' +
          (item && item.passage ? '<div class="muted small">[reading text]</div>' : '') +
          '<div class="q">' + esc(a.given === '(skipped)' ? (item ? item.prompt : '') : (item ? item.prompt : '')) + '</div>' +
          '<div class="small">Answered: <strong>' + esc(a.given) + '</strong>' +
          (a.correct ? '' : ' · Correct: <strong>' + esc(a.correctAnswer) + '</strong>') + '</div>' +
          '</li>';
      }).join('') + '</ol></details>';
    return html;
  }

  /* -------------------------------------------------------------- output */

  function buildLead(r) {
    return {
      meta: { mode: S.mode, startedAt: S.startedAt, completedAt: new Date().toISOString(), version: 'v2' },
      contact: {
        firstName: S.firstName, lastName: S.lastName, email: S.email, phone: S.phone,
        ageBand: S.ageBand, countryOfResidence: S.countryResidence, nationality: S.nationality,
        contactLanguage: S.contactLanguage, skipped: S.contactSkipped
      },
      consent: { contact: S.contactConsent, marketing: S.marketingConsent },
      test: {
        priorSelfDeclared: S.prior,
        blocks: S.blocks.map(function (b) { return { level: b.level, correct: b.correct, total: b.total }; }),
        itemsAnswered: S.blocks.reduce(function (n, b) { return n + b.total; }, 0),
        answers: S.blocks.reduce(function (a, b) { return a.concat(b.answers); }, []),
        placement: S.placement.level,
        positionInLevel: S.placement.position,   // internal: 'start' | 'middle' | 'complete'
        atCeiling: S.placement.atCeiling
      },
      selfAssessment: { speaking: S.self.speaking, writing: S.self.writing, listening: S.self.listening, gapFlag: S.selfAssessGap },
      needs: {
        goals: S.goals, targetLevel: S.targetLevel, exams: S.exams, visa: S.visa,
        format: S.format, timeSlot: S.timeSlot, weeksAvailable: S.weeksAvailable, startWhen: S.startWhen
      },
      recommendation: {
        firstCourse: r.course ? r.course.name : null,
        journey: r.journey ? { from: r.journey.from, to: r.journey.to, weeks: r.journey.totalWeeks,
                               path: r.journey.steps.map(function (s) { return s.level; }) } : null,
        price: r.price,
        addons: r.addons.map(function (a) { return a.key; }),
        exams: r.exams.map(function (e) { return e.name; }),
        flags: r.flags.map(function (f) { return f.type; })
      }
    };
  }

  function staffSummary(r) {
    var L = [];
    var scores = S.blocks.map(function (b) { return b.level + ' ' + b.correct + '/' + b.total; }).join(', ');
    L.push('LEVEL: ' + S.placement.level + '   (' + (scores || 'no test — declared zero German') + ')');
    if (S.placement.position && !S.placement.atCeiling) {
      L.push('       ' + (S.placement.position === 'middle'
        ? 'already part-way through ' + S.placement.level
        : 'at the beginning of ' + S.placement.level));
    }

    var who = (S.firstName + ' ' + S.lastName).trim();
    if (who || S.email || S.phone) L.push('NAME:  ' + [who, S.email, S.phone].filter(Boolean).join('   '));
    var where = [S.ageBand && 'age ' + S.ageBand, S.countryResidence && 'lives ' + S.countryResidence,
                 S.nationality && 'national ' + S.nationality].filter(Boolean).join('   ');
    if (where) L.push('WHO:   ' + where);
    if (S.contactSkipped) L.push('NAME:  (walk-in, no details taken)');
    L.push('');
    L.push('WANTS: ' + S.goals.join(', ') + '  -> target ' + S.targetLevel + ', exams: ' + S.exams.join('+'));
    L.push('VISA:  ' + S.visa);
    L.push('FIT:   ' + S.format + ', ' + S.timeSlot + ', ' + (S.weeksAvailable || '?') + ' weeks, start ' + S.startWhen);
    if (S.self.speaking !== null) {
      L.push('SELF:  speaking ' + S.self.speaking + '/3, writing ' + S.self.writing + '/3, listening ' + S.self.listening + '/3' +
        (S.selfAssessGap ? '  << SPEAKING GAP' : ''));
    }
    L.push('');
    L.push('START:   ' + (r.course ? r.course.name : 'already at C1 — Format D / exam route'));
    if (r.journey) L.push('JOURNEY: ' + r.journey.steps.map(function (s) { return s.level; }).join(' -> ') +
      ', ' + r.journey.totalWeeks + ' weeks');
    if (r.price) L.push('PRICE:   closest package ' + r.price.packageWeeks + ' wks EUR ' + r.price.price +
      ' (' + r.price.contract + '), registration EUR ' + r.price.registrationFee);
    if (r.addons.length) L.push('ADD-ONS: ' + r.addons.map(function (a) { return a.name; }).join(' | '));
    if (r.exams.length) L.push('EXAMS:   ' + r.exams.map(function (e) { return e.name; }).join(' | '));
    if (r.flags.length) L.push('FLAGS:   ' + r.flags.map(function (f) { return f.type; }).join(', '));
    return L.join('\n');
  }

  intro();
})();
