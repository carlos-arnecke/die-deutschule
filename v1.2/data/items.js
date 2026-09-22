/* die deutSCHule — level test item bank (v1.1)
 *
 * 10 items per CEFR level, A1-C1. Six are sampled per set at runtime.
 * Every item has FOUR options and exactly ONE defensible answer — see
 * data/README-items.md before editing, and keep both of those properties.
 *
 * answer = index into options, BEFORE shuffling. The app shuffles at render.
 *
 * basis = the framework reference the item's level was checked against.
 *   A1/A2: the telc "Start Deutsch 1·2 Prüfungsziele" grammar inventory
 *          ("SD1" = un-starred A1 entry, "SD2*" = starred A2 entry).
 *   B1:    Profile deutsch B1 / Zertifikat Deutsch tradition, Netzwerk neu B1.
 *   B2/C1: no official inventory exists (telc B2 Handbuch §4, Goethe C1 §4.4);
 *          anchored to the CEFR descriptor named.
 * Full reasoning: 01-theory-and-framework.md.
 *
 * B1-03 and B1-04 sit on the A2/B1 boundary and are flagged for the teachers.
 */

var ITEM_BANK = {

  /* ---------------------------------------------------------------- A1 --
   * Present tense, sein/haben, articles, W-questions, basic word order,
   * accusative, everyday vocabulary.
   */
  A1: [
    { id: 'A1-01', skill: 'grammar', tag: 'sein-conjugation',
      basis: 'telc SD1: Verb — Tempus (Präsens von sein)',
      prompt: 'Hallo! Wie ___ dein Name?',
      options: ['ist', 'bin', 'bist', 'sind'], answer: 0,
      note: 'Was a "heißen" item, but heißen has only three distinct present forms — no room for a fourth option.' },

    { id: 'A1-02', skill: 'grammar', tag: 'article-gender',
      basis: 'telc SD1: Nomen — Genus; Artikel indefinit',
      prompt: 'Das ist ___ Tasche.',
      options: ['eine', 'ein', 'einen', 'einem'], answer: 0 },

    { id: 'A1-03', skill: 'grammar', tag: 'verb-conjugation',
      basis: 'telc SD1: Verb — Präsens aller Verben der Wortliste',
      prompt: 'Ich ___ aus Brasilien.',
      options: ['komme', 'kommst', 'kommt', 'kommen'], answer: 0 },

    { id: 'A1-04', skill: 'grammar', tag: 'w-question',
      basis: 'telc SD1: Syntax — Ergänzungsfrage (Fragepronomen)',
      prompt: '___ wohnst du? — In Berlin.',
      options: ['Wo', 'Was', 'Wer', 'Wann'], answer: 0 },

    { id: 'A1-05', skill: 'grammar', tag: 'haben-conjugation',
      basis: 'telc SD1: Verb — Präsens von haben',
      prompt: 'Wir ___ am Montag keine Zeit.',
      options: ['haben', 'hat', 'habt', 'hast'], answer: 0 },

    { id: 'A1-06', skill: 'grammar', tag: 'accusative',
      basis: 'telc SD1: Nomen — Kasus Akkusativ; Artikel indefinit',
      prompt: 'Ich trinke ___ Kaffee.',
      options: ['einen', 'ein', 'eine', 'einem'], answer: 0 },

    { id: 'A1-07', skill: 'grammar', tag: 'word-order-v2',
      basis: 'telc SD1: Syntax — Verbzweitstellung („Morgen fahre ich …“)',
      prompt: 'Am Sonntag ___ lange.',
      options: ['schlafe ich', 'ich schlafe', 'ich schlafen', 'schlafen ich'], answer: 0 },

    { id: 'A1-08', skill: 'vocab', tag: 'everyday',
      basis: 'telc SD1: Wortliste (kosten); Sprachintention „nach dem Preis fragen“',
      prompt: 'Entschuldigung, wie viel ___ das Ticket?',
      options: ['kostet', 'kauft', 'bezahlt', 'zahlt'], answer: 0 },

    { id: 'A1-09', skill: 'grammar', tag: 'sein-haben',
      basis: 'telc SD1: Verb — Präsens von sein; Qualitativergänzung',
      prompt: 'Ich kann heute nicht kommen. Ich ___ krank.',
      options: ['bin', 'habe', 'ist', 'sind'], answer: 0 },

    { id: 'A1-10', skill: 'grammar', tag: 'preposition-place',
      basis: 'telc SD1: Präposition lokal (in + Dativ)',
      prompt: 'Meine Familie wohnt ___ Spanien.',
      options: ['in', 'an', 'auf', 'bei'], answer: 0 }
  ],

  /* ---------------------------------------------------------------- A2 --
   * Perfekt, modal verbs, dative, separable verbs, comparatives,
   * weil/wenn subordinate clauses, fixed prepositions.
   */
  A2: [
    { id: 'A2-01', skill: 'grammar', tag: 'perfekt-auxiliary',
      basis: 'telc SD2*: Perfekt aller Verben (verlieren is not on the A1 Perfekt list)',
      prompt: 'Gestern ___ ich leider meinen Schlüssel verloren.',
      options: ['habe', 'bin', 'war', 'werde'], answer: 0,
      note: 'The verb is verlieren rather than a common one like sehen, because sehen is on the telc A1 Perfekt list and would not separate A2 from A1. "hatte" was rejected as a fourth option — it makes a correct Plusquamperfekt.' },

    { id: 'A2-02', skill: 'grammar', tag: 'dative-preposition',
      basis: 'telc SD2*: Kasus Dativ; Präposition mit + Dativ',
      prompt: 'Ich fahre jeden Tag ___ Bus zur Arbeit.',
      options: ['mit dem', 'mit der', 'mit den', 'mit das'], answer: 0,
      note: '"mit einem Bus" was rejected as a fourth option — it is correct German.' },

    { id: 'A2-03', skill: 'grammar', tag: 'dative-object',
      basis: 'telc SD2*: Dativergänzung bei helfen; Possessivartikel im Dativ',
      prompt: 'Am Wochenende helfe ich ___ Bruder.',
      options: ['meinem', 'meinen', 'mein', 'meines'], answer: 0 },

    { id: 'A2-04', skill: 'grammar', tag: 'subordinate-clause',
      basis: 'telc SD2*: Satzverbindung weil (Nebensatz, Verbendstellung)',
      prompt: 'Ich komme heute nicht, ___ ich keine Zeit habe.',
      options: ['weil', 'denn', 'aber', 'und'], answer: 0,
      note: 'Verb-final word order rules out denn, aber and und.' },

    { id: 'A2-05', skill: 'grammar', tag: 'comparative',
      basis: 'telc SD2*: Adjektiv — Komparation',
      prompt: 'Berlin ist ___ als Hamburg.',
      options: ['größer', 'groß', 'am größten', 'die größte'], answer: 0 },

    { id: 'A2-06', skill: 'grammar', tag: 'perfekt-sein-auxiliary',
      basis: 'telc SD2*: Perfekt aller Verben — Hilfsverb sein bei Bewegungsverben',
      prompt: 'Wir ___ am Wochenende nach Hamburg gefahren.',
      options: ['sind', 'haben', 'hat', 'ist'], answer: 0,
      note: 'Tests the sein-auxiliary with a verb of movement — Perfekt of all verbs is A2*, whereas separable verbs on their own are already A1. "waren" was rejected as a fourth option — it makes a correct Plusquamperfekt.' },

    { id: 'A2-07', skill: 'grammar', tag: 'perfekt-participle',
      basis: 'telc SD2*: Perfekt aller Verben — Partizip II (kommen is not on the A1 list)',
      prompt: 'Wann bist du nach Deutschland ___?',
      options: ['gekommen', 'gekommt', 'kommen', 'kam'], answer: 0 },

    { id: 'A2-08', skill: 'vocab', tag: 'fixed-preposition',
      basis: 'telc SD2*: Reflexivpronomen; Verb mit fester Präposition (Profile deutsch A2)',
      prompt: 'Ich interessiere mich sehr ___ Musik.',
      options: ['für', 'an', 'auf', 'über'], answer: 0 },

    { id: 'A2-09', skill: 'grammar', tag: 'wenn-clause',
      basis: 'telc SD2*: Satzverbindung wenn; Inversion nach vorangestelltem Nebensatz',
      prompt: 'Wenn das Wetter schön ist, ___ wir im Park spazieren.',
      options: ['gehen', 'wir gehen', 'gehe', 'geht'], answer: 0 },

    { id: 'A2-10', skill: 'grammar', tag: 'modal-verb-praeteritum',
      basis: 'telc SD2*: Präteritum der Modalverben',
      prompt: 'Früher ___ ich nicht gern Gemüse essen.',
      options: ['wollte', 'will', 'wollen', 'gewollt'], answer: 0,
      note: 'Tests the Präteritum of a modal verb, which is A2*; the Präsens of all six modals is already A1 per telc, so a Präsens item would not separate the levels.' }
  ],

  /* ---------------------------------------------------------------- B1 --
   * Konjunktiv II, relative clauses, present passive, adjective endings,
   * genitive prepositions, purpose clauses, admin vocabulary.
   */
  B1: [
    { id: 'B1-01', skill: 'grammar', tag: 'konjunktiv-2',
      basis: 'Profile deutsch B1: Konjunktiv II — irreale Bedingung (systematic KII; A1/A2 has only lexical chunks)',
      prompt: '___ ich mehr Zeit hätte, würde ich öfter ins Museum gehen.',
      options: ['Wenn', 'Als', 'Ob', 'Dass'], answer: 0 },

    { id: 'B1-02', skill: 'grammar', tag: 'relative-clause',
      basis: 'Profile deutsch B1 / Zertifikat Deutsch: Relativsatz, Relativpronomen im Akkusativ',
      prompt: 'Der Mann, ___ ich gestern getroffen habe, ist Arzt.',
      options: ['den', 'der', 'dem', 'dessen'], answer: 0 },

    { id: 'B1-03', skill: 'grammar', tag: 'passive',
      basis: 'Profile deutsch B1 / Netzwerk neu B1: Vorgangspassiv Präsens. BOUNDARY — telc lists passive as A2* receptive',
      prompt: 'Das Formular ___ von der Behörde geprüft.',
      options: ['wird', 'ist', 'hat', 'werden'], answer: 0,
      note: 'Teachers, two things: (1) is "ist" defensible? With a von-agent the Vorgangspassiv is wanted, but say so if you disagree. (2) telc lists the passive as A2* receptively; Netzwerk neu teaches it at B1. Should this stay at B1?' },

    { id: 'B1-04', skill: 'grammar', tag: 'adjective-ending',
      basis: 'Profile deutsch B1 (consolidation): Adjektivdeklination nach indefinitem Artikel. BOUNDARY — telc lists as A2*',
      prompt: 'Ich habe endlich einen ___ Job gefunden.',
      options: ['interessanten', 'interessante', 'interessanter', 'interessantes'], answer: 0,
      note: 'Teachers: telc lists attributive adjective endings as A2*, but every B1 exam scores them and they are consolidated through B1. Keep at B1, or move down?' },

    { id: 'B1-05', skill: 'grammar', tag: 'word-order-inversion',
      basis: 'Profile deutsch B1: Konzessivsatz obwohl; Inversion nach vorangestelltem Nebensatz',
      prompt: 'Obwohl er sehr müde war, ___ weiter.',
      options: ['arbeitete er', 'er arbeitete', 'er arbeitet', 'arbeitete'], answer: 0 },

    { id: 'B1-06', skill: 'vocab', tag: 'fixed-preposition',
      basis: 'Profile deutsch B1: Verben mit Präposition — sich freuen auf vs. über (Bedeutungsunterschied)',
      prompt: 'Ich freue mich schon ___ das lange Wochenende.',
      options: ['auf', 'über', 'für', 'an'], answer: 0,
      note: '"auf" = looking forward; "über" would mean it already happened.' },

    { id: 'B1-07', skill: 'grammar', tag: 'genitive-preposition',
      basis: 'Profile deutsch B1: Genitiv; Präposition trotz + Genitiv (Genitiv is A1 names-only / A2 receptive)',
      prompt: 'Trotz ___ Regens sind wir spazieren gegangen.',
      options: ['des', 'dem', 'der', 'den'], answer: 0 },

    { id: 'B1-08', skill: 'grammar', tag: 'purpose-clause',
      basis: 'Profile deutsch B1: Finalsatz damit vs. um … zu',
      prompt: 'Ich lerne Deutsch, ___ ich hier studieren kann.',
      options: ['damit', 'um', 'obwohl', 'indem'], answer: 0 },

    { id: 'B1-09', skill: 'vocab', tag: 'admin-german',
      basis: 'Profile deutsch B1 / Zertifikat Deutsch: Wortschatz Behörde/Formular (ausfüllen), Imperativ Sie-Form',
      prompt: 'Bitte ___ Sie das Formular vollständig ___.',
      options: ['füllen … aus', 'machen … aus', 'schreiben … aus', 'geben … aus'], answer: 0 },

    { id: 'B1-10', skill: 'reading', tag: 'gist',
      basis: 'CEFR B1 reading: „kann Texte verstehen, in denen sehr gebräuchliche Alltags- oder Berufssprache vorkommt“ (Aushang)',
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
      basis: 'CEFR B2 range: konzessive Präposition trotz vs. kausale wegen/aufgrund/infolge — precision of connectors',
      prompt: '___ der schlechten Vorbereitung hat das Team gewonnen.',
      options: ['Trotz', 'Wegen', 'Aufgrund', 'Infolge'], answer: 0 },

    { id: 'B2-02', skill: 'grammar', tag: 'modal-passive',
      basis: 'CEFR B2 range: Passiv mit Modalverb (Infinitiv Passiv) — complex verb clusters',
      prompt: 'Die Arbeit muss bis Freitag ___.',
      options: ['erledigt werden', 'erledigen werden', 'geworden erledigt', 'werden erledigt'], answer: 0,
      note: '"erledigt sein" was rejected as a fourth option — it is correct German (Zustandspassiv).' },

    { id: 'B2-03', skill: 'grammar', tag: 'je-desto',
      basis: 'CEFR B2 range: Proportionalsatz je … desto',
      prompt: 'Je mehr ich übe, ___ sicherer fühle ich mich.',
      options: ['desto', 'dann', 'so', 'als'], answer: 0,
      note: '"umso" is equally correct, so it is deliberately not offered.' },

    { id: 'B2-04', skill: 'grammar', tag: 'relative-genitive',
      basis: 'CEFR B2 range: Relativpronomen im Genitiv (dessen/deren) — agreement with a neuter antecedent',
      prompt: 'Das Gesetz, ___ Auswirkungen umstritten sind, tritt bald in Kraft.',
      options: ['dessen', 'deren', 'dem', 'welches'], answer: 0 },

    { id: 'B2-05', skill: 'grammar', tag: 'irrealis-comparison',
      basis: 'CEFR B2 range: Irrealer Vergleichssatz als ob + Konjunktiv II',
      prompt: 'Er tut so, ___ er alles besser wüsste.',
      options: ['als ob', 'wenn', 'obwohl', 'damit'], answer: 0 },

    { id: 'B2-06', skill: 'grammar', tag: 'participial-attribute',
      basis: 'CEFR B2 range: Partizipialattribut (Partizip II als Linksattribut, Adjektivendung)',
      prompt: 'Die gestern ___ Studie sorgt für heftige Diskussionen.',
      options: ['veröffentlichte', 'veröffentlichende', 'veröffentlicht', 'veröffentlichten'], answer: 0 },

    { id: 'B2-07', skill: 'vocab', tag: 'connector',
      basis: 'CEFR B2 accuracy: Textkonnektoren — konzessiv dennoch vs. kausal/additiv/konsekutiv',
      prompt: 'Der Kurs war teuer. ___ hat er sich gelohnt.',
      options: ['Dennoch', 'Deswegen', 'Außerdem', 'Demnach'], answer: 0 },

    { id: 'B2-08', skill: 'vocab', tag: 'verb-precision',
      basis: 'CEFR B2 vocabulary control: steigen (intransitiv) vs. steigern/erhöhen/anheben (transitiv)',
      prompt: 'Es ist damit zu rechnen, dass die Mieten weiter ___.',
      options: ['steigen', 'steigern', 'erhöhen', 'anheben'], answer: 0,
      note: 'The three distractors are all transitive and need an object.' },

    { id: 'B2-09', skill: 'vocab', tag: 'collocation',
      basis: 'CEFR B2 vocabulary control: Nomen-Verb-Verbindung „Wert legen auf“',
      prompt: 'Der Betrieb legt großen Wert ___ Pünktlichkeit.',
      options: ['auf', 'an', 'für', 'in'], answer: 0 },

    { id: 'B2-10', skill: 'reading', tag: 'inference',
      basis: 'CEFR B2 reading: „kann Artikel und Berichte über aktuelle Fragen lesen, in denen bestimmte Haltungen oder Standpunkte vertreten werden“',
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
      basis: 'CEFR C1 (Goethe C1 §3.1): „breites Spektrum idiomatischer Wendungen“ — auf taube Ohren stoßen',
      prompt: 'Die Warnungen der Fachleute ___ bei der Politik auf taube Ohren.',
      options: ['stießen', 'trafen', 'fielen', 'gerieten'], answer: 0 },

    { id: 'C1-02', skill: 'vocab', tag: 'formal-preposition',
      basis: 'CEFR C1 register: formal-schriftsprachliche Präpositionen (ungeachtet + Genitiv)',
      prompt: '___ der Tatsache, dass er kaum Erfahrung hatte, wurde er eingestellt.',
      options: ['Ungeachtet', 'Anstelle', 'Infolge', 'Zwecks'], answer: 0,
      note: '"Angesichts" was rejected as a fourth option — it is arguably defensible here.' },

    { id: 'C1-03', skill: 'grammar', tag: 'konjunktiv-1',
      basis: 'CEFR C1 register: Konjunktiv I in der indirekten Rede (Pressesprache)',
      prompt: 'Der Sprecher betonte, die Regierung ___ an ihrer Position fest.',
      options: ['halte', 'hält', 'hielte', 'haltet'], answer: 0,
      note: 'Indirect speech in formal register takes Konjunktiv I.' },

    { id: 'C1-04', skill: 'grammar', tag: 'nominal-style',
      basis: 'CEFR C1 register: Nominalstil („nach Auswertung der Ergebnisse“) — Goethe C1 §4.5 „größere Bandbreite syntaktischer Strukturen“',
      prompt: 'Nach ___ der Ergebnisse wurde die Studie überarbeitet.',
      options: ['Auswertung', 'Auswerten', 'Ausgewertet', 'Auswertens'], answer: 0 },

    { id: 'C1-05', skill: 'vocab', tag: 'fixed-expression',
      basis: 'CEFR C1 idiom: Funktionsverbgefüge „in Kauf nehmen“',
      prompt: 'Sie hat die längere Anfahrt bewusst ___ Kauf genommen.',
      options: ['in', 'auf', 'zum', 'im'], answer: 0 },

    { id: 'C1-06', skill: 'grammar', tag: 'conditional-inversion',
      basis: 'CEFR C1 range: uneingeleiteter Konditionalsatz mit Verberststellung (Sollte es …)',
      prompt: '___ es zu Verzögerungen kommen, informieren wir Sie umgehend.',
      options: ['Sollte', 'Würde', 'Hätte', 'Wäre'], answer: 0 },

    { id: 'C1-07', skill: 'vocab', tag: 'precision',
      basis: 'CEFR C1 vocabulary control: near-synonym discrimination (zielführend / zielstrebig / zielsicher / zielbewusst)',
      prompt: 'Die Maßnahme hat sich als wenig ___ erwiesen.',
      options: ['zielführend', 'zielstrebig', 'zielsicher', 'zielbewusst'], answer: 0,
      note: 'The distractors all describe people, not measures. "zielgerichtet" was rejected — it is idiomatic here.' },

    { id: 'C1-08', skill: 'vocab', tag: 'verb-precision',
      basis: 'CEFR C1 vocabulary control: prefix verbs (beirren / irren / verirren / abirren)',
      prompt: 'Von der scharfen Kritik ließ sie sich nicht ___.',
      options: ['beirren', 'irren', 'verirren', 'abirren'], answer: 0 },

    { id: 'C1-09', skill: 'vocab', tag: 'discourse-marker',
      basis: 'CEFR C1 register: schriftsprachliche Konnektoren — gleichwohl vs. demnach/insofern/folglich',
      prompt: 'Die Datenlage ist eindeutig. ___ bleiben zentrale Fragen offen.',
      options: ['Gleichwohl', 'Demnach', 'Insofern', 'Folglich'], answer: 0 },

    { id: 'C1-10', skill: 'reading', tag: 'stance',
      basis: 'CEFR C1 reading (Goethe C1 §3.1): „feinere Nuancen auch von explizit oder implizit angesprochenen Einstellungen und Meinungen erfassen“',
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
