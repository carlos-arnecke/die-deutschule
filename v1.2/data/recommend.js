/* die deutSCHule — course data + recommendation engine (v2)
 *
 * All prices, fees, course content and rules come from the Brain folder:
 *   02-courses-and-services.md, 02b-course-levels-detail.md, 03-pricing.md,
 *   05-exams.md, 08-student-resources.md
 * Update them HERE and nowhere else.
 *
 * Deliberately NOT in this file: course start dates and exam dates.
 * Per 04-schedules.md those go stale; we link to the schedules page instead.
 *
 * v2 change: whole CEFR levels only (A1-C1). No sub-levels are shown anywhere.
 * We still keep an internal `position` ("start" / "middle") because the front
 * desk finds it useful, but it never appears on the public result.
 */

var SCHOOL = {
  name: 'die deutSCHule',
  address: 'Karl-Marx-Straße 107, 12043 Berlin-Neukölln',
  email: 'info@die-deutschule.de',
  phone: '+49 (0)30 6808 5223',
  registrationUrl: 'https://www.die-deutschule.de/en/online-registration',
  schedulesUrl: 'https://www.die-deutschule.de/en/courses/course-schedules',
  privacyUrl: 'https://www.die-deutschule.de/en/privacy',   // TODO: confirm real URL
  maxClassSize: 18
};

var LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];

/* Course length per level — 02-courses-and-services.md */
var LEVEL_WEEKS = { A1: 8, A2: 8, B1: 8, B2: 12, C1: 12 };

/* What each level actually gives you. Written from 02b-course-levels-detail.md.
 * This is the material the result page uses to sell the journey, so keep it
 * concrete and keep the legal claims hedged. */
var LEVEL_INFO = {
  A1: {
    title: 'A1 — first steps',
    learn: 'Introduce yourself, ask for directions, make an appointment, go shopping, and talk about ' +
           'family and work in simple sentences. Present tense and basic sentence structure.',
    useFor: 'The foundation. Enough German to handle simple, predictable situations on your own.',
    book: 'Netzwerk neu A1'
  },
  A2: {
    title: 'A2 — everyday German',
    learn: 'Cope with familiar everyday situations — groceries, directions, small talk. Talk about ' +
           'yourself, ask for precise information, say how you feel. Past tense and modal verbs.',
    useFor: 'Daily life stops being a struggle. This is also where the free trial lesson becomes available.',
    book: 'Netzwerk neu A2'
  },
  B1: {
    title: 'B1 — standing on your own',
    learn: 'Handle most situations you meet living here, follow and join a general conversation on ' +
           'familiar topics, and use longer sentences and more tenses. Topics run from relationships ' +
           'and the environment to what is happening in Berlin right now.',
    useFor: 'The level most often asked for in residence and citizenship procedures — check what your ' +
            'own case requires. It is also where most people start actually using German at work.',
    book: 'Netzwerk neu B1'
  },
  B2: {
    title: 'B2 — independent use',
    learn: 'Talk to native speakers without much difficulty, express yourself on abstract and complex ' +
           'topics, and understand demanding texts in full. Science, history, art and culture.',
    useFor: 'The working level. Usually the minimum for a German-speaking job, and the entry point for TestDaF.',
    book: 'Kontext B2'
  },
  C1: {
    title: 'C1 — full command',
    learn: 'Catch implied and nuanced meaning, move between registers, handle demanding texts, and write ' +
           'accurate, varied German. Writing is the main emphasis, alongside longer spoken presentations.',
    useFor: 'University admission and demanding professional work. telc C1 Hochschule can exempt you from ' +
            'proving your German to a university — confirm it with your institution.',
    book: 'Kontext C1'
  }
};

/* Intensive course packages — 03-pricing.md */
var PACKAGES = [
  { weeks: 1,  standard: 103,  visa: null },
  { weeks: 2,  standard: 187,  visa: null },
  { weeks: 3,  standard: 268,  visa: null },
  { weeks: 4,  standard: 318,  visa: null },
  { weeks: 8,  standard: 636,  visa: null },
  { weeks: 12, standard: 954,  visa: 1062 },
  { weeks: 16, standard: 1272, visa: null },
  { weeks: 24, standard: 1839, visa: 2039 },
  { weeks: 36, standard: 2758, visa: 3058 },
  { weeks: 48, standard: 3677, visa: 4077 }
];

var FEES = {
  registrationStandard: 0,
  registrationVisa: 30,
  certificateOfAttendance: 10,
  courseChange: 10
};

var ADDONS = {
  blueMonday4:  { name: 'Blue Monday (4 Mondays)', price: 36, lessons: 2 },
  blueMonday2m: { name: 'Blue Monday (2 months)',  price: 70, lessons: 2 },
  formatD:      { name: 'Format D — conversation course', price: 298, weeks: 4 }
};

var EXAM_PREP = {
  telcB1:   { name: 'telc B1 preparation',          price: 377, weeks: 4 },
  telcB2C1: { name: 'telc B2 / C1 Hochschule prep', price: 389, weeks: 4 },
  testdaf:  { name: 'TestDaF preparation',          price: 398, weeks: 5 }
};

var EXAM_FEES = {
  zertifikatDeutsch: { internal: 118, external: 149 },
  telcB1:  { internal: 185, external: 195 },
  telcB2:  { internal: 185, external: 195 },
  telcC1H: { internal: 195, external: 205 },
  testdaf: { digital: 210, paper: 215 }
};

/* 08-student-resources.md — typically visa-exempt for a language stay.
 * Indicative only; the copy always tells people to verify with their embassy. */
var VISA_EXEMPT = [
  'Austria','Belgium','Bulgaria','Croatia','Cyprus','Czechia','Denmark','Estonia',
  'Finland','France','Germany','Greece','Hungary','Ireland','Italy','Latvia',
  'Lithuania','Luxembourg','Malta','Netherlands','Poland','Portugal','Romania',
  'Slovakia','Slovenia','Spain','Sweden','Iceland','Liechtenstein','Norway',
  'Switzerland','Australia','Israel','Japan','South Korea','Canada','New Zealand',
  'United States'
];

/* ------------------------------------------------------------------ *
 * Placement: block results -> a level
 * ------------------------------------------------------------------ */

/** blocks: [{ level:'A1', correct:5, total:6 }, ...] in the order administered.
 *  Returns the level the person should JOIN, not the one they have finished. */
function placeFromBlocks(blocks) {
  var MASTERY = 5;   // out of 6
  var PARTIAL = 3;

  var byLevel = {};
  blocks.forEach(function (b) { byLevel[b.level] = b; });

  var mastered = [];
  var stopLevel = null;
  var stopScore = 0;

  for (var i = 0; i < LEVELS.length; i++) {
    var b = byLevel[LEVELS[i]];
    // Never administered: the ladder only skips blocks it had good reason to.
    if (!b) continue;
    if (b.correct >= MASTERY) { mastered.push(LEVELS[i]); continue; }
    stopLevel = LEVELS[i];
    stopScore = b.correct;
    break;
  }

  if (!stopLevel) {
    return {
      level: 'C1', index: LEVELS.indexOf('C1'), position: 'complete',
      mastered: mastered, atCeiling: true,
      note: 'You answered everything up to C1 correctly. This test cannot measure above C1.'
    };
  }

  return {
    level: stopLevel,
    index: LEVELS.indexOf(stopLevel),
    position: stopScore >= PARTIAL ? 'middle' : 'start',  // internal only
    mastered: mastered,
    atCeiling: false,
    note: null
  };
}

/* ------------------------------------------------------------------ *
 * Recommendation
 * ------------------------------------------------------------------ */

function targetIndexFor(state) {
  if (state.targetLevel && state.targetLevel !== 'unsure') {
    var i = LEVELS.indexOf(state.targetLevel);
    if (i > -1) return i;
  }
  var goals = state.goals || [];
  if (goals.indexOf('university') > -1)  return LEVELS.indexOf('C1');
  if (goals.indexOf('work') > -1)        return LEVELS.indexOf('B2');
  if (goals.indexOf('visa') > -1)        return LEVELS.indexOf('B1');
  if (goals.indexOf('citizenship') > -1) return LEVELS.indexOf('B1');
  return LEVELS.indexOf('B1');
}

function snapToPackage(weeks, visa) {
  var pool = PACKAGES.filter(function (p) { return !visa || p.visa !== null || p.weeks <= 8; });
  var pick = pool[0];
  for (var i = 0; i < pool.length; i++) {
    pick = pool[i];
    if (pool[i].weeks >= weeks) break;
  }
  return pick;
}

function priceOf(pkg, visa) {
  if (visa && pkg.visa) return { price: pkg.visa, contract: 'visa' };
  return { price: pkg.standard, contract: 'standard' };
}

/** Format D needs B1.2 per the Brain. Without sub-levels we approximate:
 *  above B1, or placed in B1 having already answered half the B1 items right. */
function qualifiesForFormatD(p) {
  return p.index > LEVELS.indexOf('B1') ||
         (p.index === LEVELS.indexOf('B1') && p.position === 'middle');
}

/** state = the whole answer object from app.js. Returns plain data;
 *  app.js decides how to render it. */
function recommend(state) {
  var p = state.placement;
  var idx = p.index;
  var isVisa = state.visa === 'applying';
  var online = state.format === 'online';
  var exams = state.exams || [];

  var r = {
    level: p.level,
    levelInfo: LEVEL_INFO[p.level],
    journey: null,
    course: null,
    price: null,
    addons: [],
    exams: [],
    flags: [],
    nextSteps: []
  };

  /* --- 1. the course to join now ------------------------------------ */
  if (!p.atCeiling) {
    r.course = {
      level: p.level,
      name: 'Intensive course ' + p.level + (online ? ' — online' : ' — in person, Berlin-Neukölln'),
      lessonsPerWeek: 16,
      days: 'Tuesday–Friday',
      slot: state.timeSlot || null,
      weeks: LEVEL_WEEKS[p.level],
      price: (PACKAGES.filter(function (x) { return x.weeks === LEVEL_WEEKS[p.level]; })[0] || {}).standard,
      maxClassSize: SCHOOL.maxClassSize
    };
  } else {
    r.flags.push({
      type: 'ceiling',
      text: 'You are already at C1. Rather than starting a new level, look at Format D, the telc C1 ' +
            'Hochschule exam or TestDaF — or talk to us about joining a C1 group to keep it sharp.'
    });
  }

  /* --- 2. the journey to their goal --------------------------------- */
  var target = targetIndexFor(state);

  if (p.atCeiling || target < idx) {
    r.journey = null;
    if (!p.atCeiling && target < idx) {
      r.flags.push({
        type: 'already-there',
        text: 'You aimed for ' + LEVELS[target] + ' and you are already past it — you tested into ' +
              p.level + '. Aim higher, or use ' + p.level + ' to sit the exam you need.'
      });
    }
  } else {
    var path = LEVELS.slice(idx, target + 1);
    var weeks = path.reduce(function (n, L) { return n + LEVEL_WEEKS[L]; }, 0);
    var pkg = snapToPackage(weeks, isVisa);
    var pr = priceOf(pkg, isVisa);

    r.journey = {
      from: p.level,
      to: LEVELS[target],
      steps: path.map(function (L, i) {
        return {
          level: L,
          weeks: LEVEL_WEEKS[L],
          isStart: i === 0,
          isGoal: i === path.length - 1,
          info: LEVEL_INFO[L]
        };
      }),
      totalWeeks: weeks
    };
    r.price = {
      packageWeeks: pkg.weeks,
      price: pr.price,
      contract: pr.contract,
      registrationFee: isVisa ? FEES.registrationVisa : FEES.registrationStandard,
      coversWholeJourney: pkg.weeks >= weeks
    };

    if (isVisa && pr.contract !== 'visa') {
      r.flags.push({
        type: 'visa-contract',
        text: 'Visa contracts start at 12 weeks. The package above is shorter, so it would be a standard ' +
              'contract — tell us what your visa requires and we will put the right one together.'
      });
    }
  }

  /* --- 4. visa ------------------------------------------------------ */
  if (isVisa) {
    var visaContract = r.price && r.price.contract === 'visa';
    r.addons.push({
      key: 'blueMonday',
      name: 'Blue Monday',
      price: visaContract ? 0 : ADDONS.blueMonday4.price,
      included: visaContract,
      why: visaContract
        ? 'Intensive courses are 16 lessons a week; many language visas require 18. Blue Monday adds the ' +
          'missing 2 — and it is included in every visa contract at no extra cost.'
        : 'Intensive courses are 16 lessons a week; many language visas require 18. Blue Monday adds the ' +
          'missing 2. It is free inside a visa contract (12 weeks or more); on a shorter, standard contract ' +
          'it is €' + ADDONS.blueMonday4.price + ' for four Mondays.'
    });
    r.flags.push({
      type: 'visa',
      text: 'Language visa: apply early — the process can take up to 4 months. You register and pay for ' +
            'the course first, then we post you an official registration confirmation to submit with your ' +
            'application. Registration for a visa contract costs €' + FEES.registrationVisa + '. ' +
            'If the visa is refused you are refunded, minus the registration fee and a 19% admin fee.'
    });
  } else if (state.visa === 'unsure') {
    var likelyExempt = VISA_EXEMPT.indexOf(state.nationality) > -1;
    r.flags.push({
      type: 'visa',
      text: likelyExempt
        ? 'Based on your nationality you most likely do not need a visa for a language stay — but confirm ' +
          'with the German Federal Foreign Office or your embassy.'
        : 'You may need a language visa. Check with your German embassy, and tell us early if you do — ' +
          'the paperwork takes time and a visa contract works differently.'
    });
  }

  /* --- 5. conversation --------------------------------------------- */
  if ((state.goals || []).indexOf('conversation') > -1 && qualifiesForFormatD(p)) {
    r.addons.push({
      key: 'formatD',
      name: ADDONS.formatD.name,
      price: ADDONS.formatD.price,
      why: 'Four weeks of conversation built around real excursions in Berlin. Designed for B2 and C1, ' +
           'open from the second half of B1 — you qualify.' +
           (state.timeSlot === 'afternoon'
             ? ' One catch: it runs Tue–Thu 13:15–16:30, the same slot as the afternoon intensive course, ' +
               'so one of the two would need a different time.'
             : ' It runs Tue–Thu 13:15–16:30.')
    });
  }

  /* --- 6. exams (multi-select) -------------------------------------- */
  var wants = exams.filter(function (e) { return e !== 'none'; });
  var iB1 = LEVELS.indexOf('B1'), iB2 = LEVELS.indexOf('B2');

  function addExam(e) { r.exams.push(e); }

  if (wants.indexOf('telc') > -1) {
    if (idx >= iB2) {
      addExam({ name: 'telc B2 or C1 Hochschule', prep: EXAM_PREP.telcB2C1, fee: EXAM_FEES.telcB2,
        feeLabel: 'with a prep course / without',
        note: 'Booking the prep course takes €10 off the exam fee. Results come from telc GmbH in 4–6 weeks. ' +
              'If you fail one part you retake only that part.' });
    } else if (idx >= iB1) {
      addExam({ name: 'telc B1', prep: EXAM_PREP.telcB1, fee: EXAM_FEES.telcB1,
        feeLabel: 'with a prep course / without',
        note: 'Booking the prep course takes €10 off the exam fee. Results take 4–6 weeks. ' +
              'If you fail one part you retake only that part.' });
    } else {
      var weeksToB1 = LEVELS.slice(idx, iB1).reduce(function (n, L) { return n + LEVEL_WEEKS[L]; }, 0);
      addExam({ name: 'telc B1', prep: null, fee: EXAM_FEES.telcB1,
        feeLabel: 'with a prep course / without',
        note: 'You need to reach B1 first — about ' + weeksToB1 + ' weeks of intensive course from where ' +
              'you are now. The prep course opens up once you get there.' });
    }
  }

  if (wants.indexOf('testdaf') > -1) {
    addExam({ name: 'TestDaF', prep: idx >= iB2 ? EXAM_PREP.testdaf : null, fee: EXAM_FEES.testdaf,
      feeLabel: 'digital / paper-based',
      note: 'You need TDN 4 in all four sections, and sections cannot be retaken on their own — failing one ' +
            'means resitting the whole exam. B2 is the minimum, C1 is what we recommend. telc C1 Hochschule ' +
            'is the alternative and does allow partial retakes.' });
  }

  if (wants.indexOf('zertifikat') > -1) {
    addExam({ name: 'Zertifikat Deutsch (our in-house exam)', prep: null, fee: EXAM_FEES.zertifikatDeutsch,
      feeLabel: 'if you study with us / if you do not',
      note: 'A1 to C1, set and marked here, so results come back in about a week instead of 4–6. Individual ' +
            'dates are possible. There is no prep course for it — sample exams for A1–B1 are on our website. ' +
            'It is recognised wherever a specific other exam is not explicitly required.' });
  }

  if (wants.indexOf('unsure') > -1 && !r.exams.length) {
    addExam({ name: 'Which exam? Let us help you choose', prep: null, fee: null,
      note: 'telc is the usual choice for visa, residence and citizenship. TestDaF or telc C1 Hochschule are ' +
            'for university. Our own Zertifikat Deutsch is fastest if you just need proof of progress. ' +
            'Tell us what the certificate is for and we will point you at the right one.' });
  }

  /* --- 7. trial lesson, age, next steps ----------------------------- */
  if (p.level === 'A1' && !p.atCeiling) {
    r.nextSteps.push('The free trial lesson runs from A2 upwards, so it is not available at A1 — but come to ' +
      'the office anyway and see the school before you decide.');
  } else {
    r.nextSteps.push('Book a free trial lesson. Come to the office at least 30 minutes before the class starts.');
  }

  if (state.ageBand === 'under18') {
    r.flags.push({ type: 'age', text: 'Our courses are for adults. From 16 it is possible after a conversation with us — get in touch and we will talk it through.' });
  }

  r.nextSteps.push('Check current start dates on the schedules page — they change every few weeks.');
  r.nextSteps.push('Register online, by email, or in person at Karl-Marx-Straße 107.');

  r.disclaimer = 'One more time, because it matters: this is a rough guideline, not an official test. ' +
    'It estimated your level from a handful of grammar, vocabulary and reading questions — it did not test ' +
    'your speaking, writing or listening, it is not an exam, and it is not proof of anything to an employer, ' +
    'a university or an authority. The prices and timings above are what we normally charge and how long ' +
    'courses normally take; we will confirm everything with you properly. And a course on its own does not ' +
    'produce a certificate — only passing an exam does.';

  return r;
}
