/* die deutSCHule — level test item bank (v3)
 *
 * 10 items per CEFR level, A1-C1. Six are sampled per set at runtime.
 * Every item has FOUR options and exactly ONE defensible answer — see
 * data/README-items.md before editing, and keep both of those properties.
 *
 * answer = index into options, BEFORE shuffling. The app shuffles at render.
 *
 * v3: went from three options to four. A fourth option only helps if it is
 * genuinely plausible — a filler fourth looks like four and works like three.
 * Several distractors that were nearly right are noted inline.
 */

var ITEM_BANK = {

  /* ---------------------------------------------------------------- A1 --
   * Present tense, sein/haben, articles, W-questions, basic word order,
   * accusative, everyday vocabulary.
   */
  A1: [
    { id: 'A1-01', skill: 'grammar', tag: 'sein-conjugation',
      prompt: 'Hallo! Wie ___ dein Name?',
      options: ['ist', 'bin', 'bist', 'sind'], answer: 0,
      note: 'Was a "heißen" item, but heißen has only three distinct present forms — no room for a fourth option.' },

    { id: 'A1-02', skill: 'grammar', tag: 'article-gender',
      prompt: 'Das ist ___ Tasche.',
      options: ['eine', 'ein', 'einen', 'einem'], answer: 0 },

    { id: 'A1-03', skill: 'grammar', tag: 'verb-conjugation',
      prompt: 'Ich ___ aus Brasilien.',
      options: ['komme', 'kommst', 'kommt', 'kommen'], answer: 0 },

    { id: 'A1-04', skill: 'grammar', tag: 'w-question',
      prompt: '___ wohnst du? — In Berlin.',
      options: ['Wo', 'Was', 'Wer', 'Wann'], answer: 0 },

    { id: 'A1-05', skill: 'grammar', tag: 'haben-conjugation',
      prompt: 'Wir ___ am Montag keine Zeit.',
      options: ['haben', 'hat', 'habt', 'hast'], answer: 0 },

    { id: 'A1-06', skill: 'grammar', tag: 'accusative',
      prompt: 'Ich trinke ___ Kaffee.',
      options: ['einen', 'ein', 'eine', 'einem'], answer: 0 },

    { id: 'A1-07', skill: 'grammar', tag: 'word-order-v2',
      prompt: 'Am Sonntag ___ lange.',
      options: ['schlafe ich', 'ich schlafe', 'ich schlafen', 'schlafen ich'], answer: 0 },

    { id: 'A1-08', skill: 'vocab', tag: 'everyday',
      prompt: 'Entschuldigung, wie viel ___ das Ticket?',
      options: ['kostet', 'kauft', 'bezahlt', 'zahlt'], answer: 0 },

    { id: 'A1-09', skill: 'grammar', tag: 'sein-haben',
      prompt: 'Ich kann heute nicht kommen. Ich ___ krank.',
      options: ['bin', 'habe', 'ist', 'sind'], answer: 0 },

    { id: 'A1-10', skill: 'grammar', tag: 'preposition-place',
      prompt: 'Meine Familie wohnt ___ Spanien.',
      options: ['in', 'an', 'auf', 'bei'], answer: 0 }
  ],

  /* ---------------------------------------------------------------- A2 --
   * Perfekt, modal verbs, dative, separable verbs, comparatives,
   * weil/wenn subordinate clauses, fixed prepositions.
   */
  A2: [
    { id: 'A2-01', skill: 'grammar', tag: 'perfekt-auxiliary',
      prompt: 'Gestern ___ ich einen guten Film gesehen.',
      options: ['habe', 'bin', 'war', 'werde'], answer: 0,
      note: '"hatte" was rejected as a fourth option — it makes a correct Plusquamperfekt.' },

    { id: 'A2-02', skill: 'grammar', tag: 'dative-preposition',
      prompt: 'Ich fahre jeden Tag ___ Bus zur Arbeit.',
      options: ['mit dem', 'mit der', 'mit den', 'mit das'], answer: 0,
      note: '"mit einem Bus" was rejected as a fourth option — it is correct German.' },

    { id: 'A2-03', skill: 'grammar', tag: 'dative-object',
      prompt: 'Am Wochenende helfe ich ___ Bruder.',
      options: ['meinem', 'meinen', 'mein', 'meines'], answer: 0 },

    { id: 'A2-04', skill: 'grammar', tag: 'subordinate-clause',
      prompt: 'Ich komme heute nicht, ___ ich keine Zeit habe.',
      options: ['weil', 'denn', 'aber', 'und'], answer: 0,
      note: 'Verb-final word order rules out denn, aber and und.' },

    { id: 'A2-05', skill: 'grammar', tag: 'comparative',
      prompt: 'Berlin ist ___ als Hamburg.',
      options: ['größer', 'groß', 'am größten', 'die größte'], answer: 0 },

    { id: 'A2-06', skill: 'grammar', tag: 'separable-verb',
      prompt: 'Der Zug ___ um acht Uhr ab.',
      options: ['fährt', 'abfährt', 'fahrt', 'fahren'], answer: 0 },

    { id: 'A2-07', skill: 'grammar', tag: 'perfekt-participle',
      prompt: 'Wann bist du nach Deutschland ___?',
      options: ['gekommen', 'gekommt', 'kommen', 'kam'], answer: 0 },

    { id: 'A2-08', skill: 'vocab', tag: 'fixed-preposition',
      prompt: 'Ich interessiere mich sehr ___ Musik.',
      options: ['für', 'an', 'auf', 'über'], answer: 0 },

    { id: 'A2-09', skill: 'grammar', tag: 'wenn-clause',
      prompt: 'Wenn das Wetter schön ist, ___ wir im Park spazieren.',
      options: ['gehen', 'wir gehen', 'gehe', 'geht'], answer: 0 },

    { id: 'A2-10', skill: 'grammar', tag: 'modal-verb',
      prompt: 'Heute Abend muss ich leider noch ___.',
      options: ['arbeiten', 'arbeite', 'gearbeitet', 'zu arbeiten'], answer: 0 }
  ],

  /* ---------------------------------------------------------------- B1 --
   * Konjunktiv II, relative clauses, present passive, adjective endings,
   * genitive prepositions, purpose clauses, admin vocabulary.
   */
  B1: [
    { id: 'B1-01', skill: 'grammar', tag: 'konjunktiv-2',
      prompt: '___ ich mehr Zeit hätte, würde ich öfter ins Museum gehen.',
      options: ['Wenn', 'Als', 'Ob', 'Dass'], answer: 0 },

    { id: 'B1-02', skill: 'grammar', tag: 'relative-clause',
      prompt: 'Der Mann, ___ ich gestern getroffen habe, ist Arzt.',
      options: ['den', 'der', 'dem', 'dessen'], answer: 0 },

    { id: 'B1-03', skill: 'grammar', tag: 'passive',
      prompt: 'Das Formular ___ von der Behörde geprüft.',
      options: ['wird', 'ist', 'hat', 'werden'], answer: 0,
      note: 'Teachers: please check "ist". With a von-agent the Vorgangspassiv is what is wanted, but flag it if you find "ist" defensible.' },

    { id: 'B1-04', skill: 'grammar', tag: 'adjective-ending',
      prompt: 'Ich habe endlich einen ___ Job gefunden.',
      options: ['interessanten', 'interessante', 'interessanter', 'interessantes'], answer: 0 },

    { id: 'B1-05', skill: 'grammar', tag: 'word-order-inversion',
      prompt: 'Obwohl er sehr müde war, ___ weiter.',
      options: ['arbeitete er', 'er arbeitete', 'er arbeitet', 'arbeitete'], answer: 0 },

    { id: 'B1-06', skill: 'vocab', tag: 'fixed-preposition',
      prompt: 'Ich freue mich schon ___ das lange Wochenende.',
      options: ['auf', 'über', 'für', 'an'], answer: 0,
      note: '"auf" = looking forward; "über" would mean it already happened.' },

    { id: 'B1-07', skill: 'grammar', tag: 'genitive-preposition',
      prompt: 'Trotz ___ Regens sind wir spazieren gegangen.',
      options: ['des', 'dem', 'der', 'den'], answer: 0 },

    { id: 'B1-08', skill: 'grammar', tag: 'purpose-clause',
      prompt: 'Ich lerne Deutsch, ___ ich hier studieren kann.',
      options: ['damit', 'um', 'obwohl', 'indem'], answer: 0 },

    { id: 'B1-09', skill: 'vocab', tag: 'admin-german',
      prompt: 'Bitte ___ Sie das Formular vollständig ___.',
      options: ['füllen … aus', 'machen … aus', 'schreiben … aus', 'geben … aus'], answer: 0 },

    { id: 'B1-10', skill: 'reading', tag: 'gist',
      passage: 'Liebe Nachbarinnen und Nachbarn,\n\nam Samstag renovieren wir das Treppenhaus. Von 9 bis 16 Uhr ist der Aufzug außer Betrieb. Wer Möbel transportieren möchte, sollte das bitte vorher oder an einem anderen Tag tun.\n\nVielen Dank für Ihr Verständnis!',
      prompt: 'Was sollen die Nachbarn am Samstag beachten?',
      options: [
        'Der Aufzug kann tagsüber nicht benutzt werden.',
        'Das Treppenhaus ist den ganzen Tag gesperrt.',
        'Möbeltransporte sind am Samstag günstiger.',
        'Der Aufzug wird am Samstag repariert.'
      ], answer: 0 }
  ],

  /* ---------------------------------------------------------------- B2 --
   * Concessive connectors, modal passive, je/desto, relative pronouns in
   * the genitive, als ob, participial attributes, precise collocation.
   */
  B2: [
    { id: 'B2-01', skill: 'grammar', tag: 'concessive-preposition',
      prompt: '___ der schlechten Vorbereitung hat das Team gewonnen.',
      options: ['Trotz', 'Wegen', 'Aufgrund', 'Infolge'], answer: 0 },

    { id: 'B2-02', skill: 'grammar', tag: 'modal-passive',
      prompt: 'Die Arbeit muss bis Freitag ___.',
      options: ['erledigt werden', 'erledigen werden', 'geworden erledigt', 'werden erledigt'], answer: 0,
      note: '"erledigt sein" was rejected as a fourth option — it is correct German (Zustandspassiv).' },

    { id: 'B2-03', skill: 'grammar', tag: 'je-desto',
      prompt: 'Je mehr ich übe, ___ sicherer fühle ich mich.',
      options: ['desto', 'dann', 'so', 'als'], answer: 0,
      note: '"umso" is equally correct, so it is deliberately not offered.' },

    { id: 'B2-04', skill: 'grammar', tag: 'relative-genitive',
      prompt: 'Das Gesetz, ___ Auswirkungen umstritten sind, tritt bald in Kraft.',
      options: ['dessen', 'deren', 'dem', 'welches'], answer: 0 },

    { id: 'B2-05', skill: 'grammar', tag: 'irrealis-comparison',
      prompt: 'Er tut so, ___ er alles besser wüsste.',
      options: ['als ob', 'wenn', 'obwohl', 'damit'], answer: 0 },

    { id: 'B2-06', skill: 'grammar', tag: 'participial-attribute',
      prompt: 'Die gestern ___ Studie sorgt für heftige Diskussionen.',
      options: ['veröffentlichte', 'veröffentlichende', 'veröffentlicht', 'veröffentlichten'], answer: 0 },

    { id: 'B2-07', skill: 'vocab', tag: 'connector',
      prompt: 'Der Kurs war teuer. ___ hat er sich gelohnt.',
      options: ['Dennoch', 'Deswegen', 'Außerdem', 'Demnach'], answer: 0 },

    { id: 'B2-08', skill: 'vocab', tag: 'verb-precision',
      prompt: 'Es ist damit zu rechnen, dass die Mieten weiter ___.',
      options: ['steigen', 'steigern', 'erhöhen', 'anheben'], answer: 0,
      note: 'The three distractors are all transitive and need an object.' },

    { id: 'B2-09', skill: 'vocab', tag: 'collocation',
      prompt: 'Der Betrieb legt großen Wert ___ Pünktlichkeit.',
      options: ['auf', 'an', 'für', 'in'], answer: 0 },

    { id: 'B2-10', skill: 'reading', tag: 'inference',
      passage: 'Dass Homeoffice die Produktivität steigert, gilt inzwischen als gut belegt. Weniger eindeutig ist jedoch, wie sich die dauerhafte Abwesenheit vom Büro auf den Zusammenhalt in Teams auswirkt. Erste Langzeitstudien deuten darauf hin, dass der informelle Austausch – und damit womöglich auch die Innovationskraft – darunter leidet.',
      prompt: 'Was lässt sich dem Text entnehmen?',
      options: [
        'Die Wirkung auf den Teamzusammenhalt ist noch nicht abschließend geklärt.',
        'Homeoffice senkt nachweislich die Produktivität.',
        'Langzeitstudien belegen, dass die Innovationskraft zunimmt.',
        'Der informelle Austausch im Büro gilt inzwischen als überschätzt.'
      ], answer: 0 }
  ],

  /* ---------------------------------------------------------------- C1 --
   * Idiom, Konjunktiv I, nominal style, conditional inversion, precise
   * register, formal discourse markers, argumentative reading.
   */
  C1: [
    { id: 'C1-01', skill: 'vocab', tag: 'idiom',
      prompt: 'Die Warnungen der Fachleute ___ bei der Politik auf taube Ohren.',
      options: ['stießen', 'trafen', 'fielen', 'gerieten'], answer: 0 },

    { id: 'C1-02', skill: 'vocab', tag: 'formal-preposition',
      prompt: '___ der Tatsache, dass er kaum Erfahrung hatte, wurde er eingestellt.',
      options: ['Ungeachtet', 'Anstelle', 'Infolge', 'Zwecks'], answer: 0,
      note: '"Angesichts" was rejected as a fourth option — it is arguably defensible here.' },

    { id: 'C1-03', skill: 'grammar', tag: 'konjunktiv-1',
      prompt: 'Der Sprecher betonte, die Regierung ___ an ihrer Position fest.',
      options: ['halte', 'hält', 'hielte', 'haltet'], answer: 0,
      note: 'Indirect speech in formal register takes Konjunktiv I.' },

    { id: 'C1-04', skill: 'grammar', tag: 'nominal-style',
      prompt: 'Nach ___ der Ergebnisse wurde die Studie überarbeitet.',
      options: ['Auswertung', 'Auswerten', 'Ausgewertet', 'Auswertens'], answer: 0 },

    { id: 'C1-05', skill: 'vocab', tag: 'fixed-expression',
      prompt: 'Sie hat die längere Anfahrt bewusst ___ Kauf genommen.',
      options: ['in', 'auf', 'zum', 'im'], answer: 0 },

    { id: 'C1-06', skill: 'grammar', tag: 'conditional-inversion',
      prompt: '___ es zu Verzögerungen kommen, informieren wir Sie umgehend.',
      options: ['Sollte', 'Würde', 'Hätte', 'Wäre'], answer: 0 },

    { id: 'C1-07', skill: 'vocab', tag: 'precision',
      prompt: 'Die Maßnahme hat sich als wenig ___ erwiesen.',
      options: ['zielführend', 'zielstrebig', 'zielsicher', 'zielbewusst'], answer: 0,
      note: 'The distractors all describe people, not measures. "zielgerichtet" was rejected — it is idiomatic here.' },

    { id: 'C1-08', skill: 'vocab', tag: 'verb-precision',
      prompt: 'Von der scharfen Kritik ließ sie sich nicht ___.',
      options: ['beirren', 'irren', 'verirren', 'abirren'], answer: 0 },

    { id: 'C1-09', skill: 'vocab', tag: 'discourse-marker',
      prompt: 'Die Datenlage ist eindeutig. ___ bleiben zentrale Fragen offen.',
      options: ['Gleichwohl', 'Demnach', 'Insofern', 'Folglich'], answer: 0 },

    { id: 'C1-10', skill: 'reading', tag: 'stance',
      passage: 'Die Debatte um die Reform wird mit einer Vehemenz geführt, die in keinem Verhältnis zu ihrer tatsächlichen Tragweite steht. Wer sich die Mühe macht, die Gesetzestexte zu lesen, findet vor allem Präzisierungen des Bestehenden. Von dem Paradigmenwechsel, den beide Lager beschwören, kann keine Rede sein.',
      prompt: 'Welche Haltung vertritt die Autorin?',
      options: [
        'Die Aufregung um die Reform steht in keinem Verhältnis zu ihrem Inhalt.',
        'Die Reform bedeutet einen grundlegenden Wandel des Systems.',
        'Beide Lager unterschätzen die Folgen der Reform erheblich.',
        'Die Gesetzestexte sind für Laien kaum verständlich formuliert.'
      ], answer: 0 }
  ]
};

/* The level order lives in recommend.js as LEVELS — single source of truth. */
