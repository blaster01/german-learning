/* eslint-disable */
/**
 * scripts/generate-content.ts
 * Content generation pipeline: content/german_words_all.csv → per-module/tier TS files
 * Run with: npm run content:generate
 *
 * Skipped (need external morphology/valency data):
 *   case-picker, verb-government, v2-slot-machine, plural drills, declension drills
 */

import { parse } from "csv-parse/sync";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

// ============================================================
// Types
// ============================================================

interface CsvRow {
  index: string;
  rank: string;
  book: string;
  german: string;
  english: string;
  gender: string;
  german_sentence: string;
  english_sentence: string;
}

interface Lexeme {
  lemma: string; // bare lemma (e.g. "Weg" for "der Weg"; "sein" for verbs)
  article: string; // "der"/"die"/"das" for nouns; "" for others
  gloss: string;
  rank: number;
  book: string;
  pos: string; // M/F/N/vb/adj/adv/prn/prp/con/art/prt/phr/num
  deSentence: string;
  enSentence: string;
}

interface Sentence {
  de: string;
  en: string;
  targetLemma: string;
  targetPos: string;
  rank: number;
  book: string;
}

type TierBand = "t1" | "t2" | "t3";
type Tier = 1 | 2 | 3;

interface Indices {
  byPos: Map<string, Lexeme[]>;
  byRankBand: Map<TierBand, Lexeme[]>;
  sentByRankBand: Map<TierBand, Sentence[]>;
  nounsByGender: Map<string, Lexeme[]>;
  sentsByLemma: Map<string, Sentence[]>;
  deTokens: Map<string, string[]>; // de sentence → tokens
}

interface MinedData {
  connectorSub: Sentence[];
  connectorMain: Sentence[];
  temporal: Sentence[];
  negation: Sentence[];
  reflexive: Sentence[];
  pronouns: Sentence[];
}

// Partial exercise (before final ID assignment)
type PartialExercise = {
  engine: string;
  prompt: string;
  stimulus?: string;
  options?: string[];
  answer?: string | number; // omitted for builder (uses solution instead)
  acceptableAnswers?: string[];
  tokens?: string[];
  solution?: string[];
  solutionAlternates?: string[][];
  feedback?: {
    correct?: string;
    common?: Record<string, string>;
  };
  metadata: {
    cefr: "B1" | "B2";
    system: string;
    module: string;
    tier: Tier;
    tags: string[];
    groupId?: string;
  };
};

// ============================================================
// Authored per-module feedback
// ============================================================
//
// Hand-written short explanations, keyed by module slug, applied to every
// generated item in that module at emission time. Content is machine-
// generated at scale, so we can't hand-author feedback per item — but the
// error *tags* an item can produce are a small, closed set per module/engine,
// so a per-module dictionary gives every learner a grammar-relevant hint
// (rather than the generic engine-level fallback in lib/validators/feedback.ts).
const MODULE_FEEDBACK: Record<
  string,
  { correct: string; common: Record<string, string> }
> = {
  "gender-bundle": {
    correct: "Right gender — that association is sticking.",
    common: {
      "match:any":
        "Der/die/das doesn't depend on meaning or spelling — it has to be memorized per noun. Try learning this noun together with its article as one chunk.",
      "mc:wrong":
        "Eliminate the two articles you're confident are wrong first, then decide between the remaining two.",
    },
  },
  pronouns: {
    correct: "Correct pronoun and case.",
    common: {
      "match:any":
        "Check who/what the pronoun replaces and which case the verb or preposition assigns (nominative, accusative, or dative).",
    },
  },
  reflexives: {
    correct:
      "That reflexive verb needs a pronoun matching its subject — you got it.",
    common: {
      "mc:wrong":
        "Reflexive pronouns must agree with the subject of the verb (ich → mich, du → dich, er/sie/es/wir/sie(pl) → sich/uns, ihr → euch).",
    },
  },
  "sentence-builder": {
    correct: "Correct word order.",
    common: {
      "order:token":
        "In German main clauses the finite verb is always in position 2. Subordinate/time/manner/place elements usually follow the TeKaMoLo order (time, cause, manner, place).",
      "order:length":
        "Every tile must be used exactly once — check you haven't dropped or duplicated one.",
    },
  },
  "negation-lab": {
    correct: "Correct negation form.",
    common: {
      "match:any":
        'Use "kein" to negate a noun that would otherwise take "ein"/no article; use "nicht" to negate verbs, adjectives, adverbs, or a noun that already has a definite article.',
      "fixit:wrong":
        '"kein" negates a bare noun phrase; "nicht" cannot directly precede one. Check what\'s being negated.',
    },
  },
  connectors: {
    correct:
      "That connector fits the logical relationship between the clauses.",
    common: {
      "match:any":
        "Subordinating connectors (weil, dass, wenn, obwohl...) send the verb to the end of the clause. Coordinating/adverbial connectors (deshalb, trotzdem, denn...) don't change word order the same way — make sure the connector matches both the meaning and the clause type.",
      "mc:wrong":
        "Think about the logical relationship (cause, contrast, condition, time) before picking a connector.",
    },
  },
  "core-vocab": {
    correct: "Correct meaning.",
    common: {
      "mc:wrong":
        "If unsure, look for a false friend or a similar-looking distractor and rule it out first.",
    },
  },
  "sentence-cloze": {
    correct: "Correct word in context.",
    common: {
      "match:any":
        "Use the surrounding sentence for meaning and grammatical gender/case clues, not just the isolated word.",
    },
  },
  "error-clinic": {
    correct: "Found and fixed the error.",
    common: {
      "fixit:wrong":
        "There is exactly one error in the sentence — re-read it clause by clause (pronoun case, verb position, negation) rather than rewriting the whole sentence.",
    },
  },
};

function withModuleFeedback(
  moduleSlug: string,
  item: PartialExercise,
): PartialExercise {
  const fb = MODULE_FEEDBACK[moduleSlug];
  if (!fb) return item;
  return {
    ...item,
    feedback: { correct: fb.correct, common: { ...fb.common } },
  };
}

// ============================================================
// Constants
// ============================================================

// No cap — emit everything the CSV supports. The per-tier cap is removed.
// Kept as a named constant so it's easy to restore if needed.
const TIER_CAP = Infinity;

const TIER_BANDS: Array<[TierBand, number, number]> = [
  ["t1", 0, 1500],
  ["t2", 1501, 3000],
  ["t3", 3001, Infinity],
];

const CEFR_FOR_TIER: Record<Tier, "B1" | "B2"> = { 1: "B1", 2: "B1", 3: "B2" };

const NOUN_POS = new Set(["M", "F", "N"]);

// POS tags used for content words (used in vocab drills)
const CONTENT_POS = new Set(["M", "F", "N", "vb", "adj", "adv"]);

// Articles that appear as prefixes in the `german` field for nouns
const ARTICLE_PREFIXES: Record<string, string> = {
  der: "M",
  die: "F",
  das: "N",
};

const CONNECTORS_SUB = [
  "weil",
  "obwohl",
  "dass",
  "wenn",
  "als",
  "bevor",
  "nachdem",
  "während",
  "sobald",
  "seitdem",
  "falls",
  "damit",
];

const CONNECTORS_MAIN = [
  "deshalb",
  "daher",
  "trotzdem",
  "dennoch",
  "außerdem",
  "hingegen",
  "stattdessen",
  "denn",
  "jedoch",
  "sondern",
];

const ALL_CONNECTORS = [...CONNECTORS_SUB, ...CONNECTORS_MAIN];

const TEMPORAL_WORDS = [
  "vor",
  "nach",
  "danach",
  "zuerst",
  "später",
  "seit",
  "bis",
  "schon",
  "noch",
  "erst",
  "gerade",
  "sofort",
  "bereits",
  "manchmal",
  "oft",
  "selten",
];

const NEGATION_WORDS = [
  "nicht",
  "kein",
  "keine",
  "keinen",
  "keinem",
  "keiner",
  "keines",
  "nie",
  "nichts",
  "niemand",
  "niemals",
];

const REFLEXIVE_PRON = ["mich", "dich", "sich", "uns", "euch"];

// Stems of common true reflexive verbs (echte reflexive Verben). Used to gate
// reflexive-pronoun mining so we don't blank plain accusative/dative objects
// that happen to be one of mich/dich/sich/uns/euch (e.g. "über mich reden").
// Matching by stem (not full lemma) so conjugated/participle forms still hit.
const REFLEXIVE_VERB_STEMS = [
  "freu",
  "interessier",
  "erinner",
  "fühl",
  "setz",
  "beeil",
  "entscheid",
  "verlieb",
  "änder",
  "entspann",
  "konzentrier",
  "beweg",
  "verhalt",
  "kümmer",
  "wunder",
  "ärger",
  "langweil",
  "verabschied",
  "vorstell",
  "anzieh",
  "auszieh",
  "wasch",
  "rasier",
  "erhol",
  "verabred",
  "verlass",
  "entschuldig",
  "unterhalt",
  "verlauf",
  "befind",
  "bedank",
  "beschwer",
  "bewerb",
  "erkält",
  "gewöhn",
  "irr",
  "verspät",
  "melde",
  "treff",
  "verabschied",
  "verändern",
  "informier",
];

function hasReflexiveVerbNearby(de: string): boolean {
  const lower = de.toLowerCase();
  return REFLEXIVE_VERB_STEMS.some((stem) => lower.includes(stem));
}

// Pronouns safe to blank (avoid highly ambiguous ones like "sie"/"ihr")
const SAFE_PRONOUNS = [
  "ich",
  "du",
  "er",
  "wir",
  "mich",
  "mir",
  "dich",
  "dir",
  "ihn",
  "ihm",
  "uns",
  "euch",
  "ihnen",
];

// ============================================================
// 1. Load and clean CSV
// ============================================================

function loadAndClean(csvPath: string): CsvRow[] {
  const raw = readFileSync(csvPath, "utf8");
  let rows: CsvRow[] = parse(raw, {
    columns: true,
    trim: true,
    skip_empty_lines: true,
    relax_column_count: true,
  });

  // Drop rows missing essential fields
  rows = rows.filter(
    (r) =>
      r.german &&
      r.german.trim() &&
      r.german_sentence &&
      r.german_sentence.trim(),
  );

  // Normalize gender/pos field
  rows = rows.map((r) => ({
    ...r,
    german: r.german.trim(),
    english: r.english.trim(),
    gender: r.gender.trim(),
    german_sentence: r.german_sentence.trim(),
    english_sentence: r.english_sentence.trim(),
  }));

  // Dedupe by (german, gender, german_sentence) — keep first
  const seen = new Set<string>();
  const deduped: CsvRow[] = [];
  for (const r of rows) {
    const key = `${r.german}|${r.gender}|${r.german_sentence}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(r);
    }
  }

  return deduped;
}

// ============================================================
// 2. Build lexemes and sentence bank
// ============================================================

function buildLexemes(rows: CsvRow[]): Lexeme[] {
  return rows.map((r): Lexeme => {
    // Nouns in CSV are "article lemma" (e.g. "der Weg", "die Zeit", "das Leben")
    const parts = r.german.split(/\s+/);
    const firstWord = parts[0]!.toLowerCase();
    let lemma = r.german;
    let article = "";
    if (parts.length >= 2 && firstWord in ARTICLE_PREFIXES) {
      article = firstWord;
      lemma = parts.slice(1).join(" ");
    }
    return {
      lemma,
      article,
      gloss: r.english,
      rank: parseInt(r.rank, 10) || 9999,
      book: r.book,
      pos: r.gender,
      deSentence: r.german_sentence,
      enSentence: r.english_sentence,
    };
  });
}

function buildSentenceBank(rows: CsvRow[]): Sentence[] {
  return rows.map((r): Sentence => {
    const parts = r.german.split(/\s+/);
    const firstWord = parts[0]!.toLowerCase();
    let targetLemma = r.german;
    if (parts.length >= 2 && firstWord in ARTICLE_PREFIXES) {
      targetLemma = parts.slice(1).join(" ");
    }
    return {
      de: r.german_sentence,
      en: r.english_sentence,
      targetLemma,
      targetPos: r.gender,
      rank: parseInt(r.rank, 10) || 9999,
      book: r.book,
    };
  });
}

// ============================================================
// 3. Utilities
// ============================================================

function rankToBand(rank: number): TierBand {
  for (const [band, lo, hi] of TIER_BANDS) {
    if (rank >= lo && rank <= hi) return band;
  }
  return "t3";
}

function bandToTier(band: TierBand): Tier {
  return band === "t1" ? 1 : band === "t2" ? 2 : 3;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const GERMAN_WORD_CHAR = "[a-zA-ZäöüÄÖÜß]";

function containsWholeWord(sentence: string, word: string): boolean {
  const re = new RegExp(
    `(?<!${GERMAN_WORD_CHAR})${escapeRegex(word)}(?!${GERMAN_WORD_CHAR})`,
    "i",
  );
  return re.test(sentence);
}

function replaceWholeWordFirst(
  sentence: string,
  word: string,
  replacement: string,
): string {
  const re = new RegExp(
    `(?<!${GERMAN_WORD_CHAR})${escapeRegex(word)}(?!${GERMAN_WORD_CHAR})`,
  );
  return sentence.replace(re, replacement);
}

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

/** Simple whitespace tokenizer preserving punctuation attached to words */
function tokenize(s: string): string[] {
  return s.trim().split(/\s+/).filter(Boolean);
}

// ============================================================
// 4. Build indices
// ============================================================

function buildIndices(lexemes: Lexeme[], sentences: Sentence[]): Indices {
  const byPos = new Map<string, Lexeme[]>();
  const byRankBand = new Map<TierBand, Lexeme[]>(
    TIER_BANDS.map(([b]) => [b, []]),
  );
  const nounsByGender = new Map<string, Lexeme[]>([
    ["M", []],
    ["F", []],
    ["N", []],
  ]);
  const sentByRankBand = new Map<TierBand, Sentence[]>(
    TIER_BANDS.map(([b]) => [b, []]),
  );
  const sentsByLemma = new Map<string, Sentence[]>();
  const deTokens = new Map<string, string[]>();

  for (const lex of lexemes) {
    // byPos
    if (!byPos.has(lex.pos)) byPos.set(lex.pos, []);
    byPos.get(lex.pos)!.push(lex);

    // byRankBand
    byRankBand.get(rankToBand(lex.rank))!.push(lex);

    // nounsByGender
    if (NOUN_POS.has(lex.pos)) {
      nounsByGender.get(lex.pos)!.push(lex);
    }
  }

  for (const sent of sentences) {
    // sentByRankBand
    sentByRankBand.get(rankToBand(sent.rank))!.push(sent);

    // sentsByLemma
    if (!sentsByLemma.has(sent.targetLemma)) {
      sentsByLemma.set(sent.targetLemma, []);
    }
    sentsByLemma.get(sent.targetLemma)!.push(sent);

    // deTokens
    if (!deTokens.has(sent.de)) {
      deTokens.set(sent.de, tokenize(sent.de));
    }
  }

  return {
    byPos,
    byRankBand,
    sentByRankBand,
    nounsByGender,
    sentsByLemma,
    deTokens,
  };
}

// ============================================================
// 5. Mine sentences for specific patterns
// ============================================================

function sentenceContainsAny(de: string, words: string[]): string | null {
  const lower = de.toLowerCase();
  for (const w of words) {
    // whole-word match (case-insensitive)
    const re = new RegExp(
      `(?<![a-zA-ZäöüÄÖÜß])${escapeRegex(w)}(?![a-zA-ZäöüÄÖÜß])`,
      "i",
    );
    if (re.test(de)) return w;
  }
  return null;
}

function mineFromSentences(sentences: Sentence[], idx: Indices): MinedData {
  const connectorSub: Sentence[] = [];
  const connectorMain: Sentence[] = [];
  const temporal: Sentence[] = [];
  const negation: Sentence[] = [];
  const reflexive: Sentence[] = [];
  const pronouns: Sentence[] = [];

  for (const s of sentences) {
    const sub = sentenceContainsAny(s.de, CONNECTORS_SUB);
    const main = sentenceContainsAny(s.de, CONNECTORS_MAIN);
    const temp = sentenceContainsAny(s.de, TEMPORAL_WORDS);
    const neg = sentenceContainsAny(s.de, NEGATION_WORDS);
    const ref = sentenceContainsAny(s.de, REFLEXIVE_PRON);
    const prn = sentenceContainsAny(s.de, SAFE_PRONOUNS);

    if (sub) connectorSub.push(s);
    if (main) connectorMain.push(s);
    if (temp) temporal.push(s);
    if (neg) negation.push(s);
    if (ref) reflexive.push(s);
    if (prn && wordCount(s.de) <= 15) pronouns.push(s);
  }

  return {
    connectorSub,
    connectorMain,
    temporal,
    negation,
    reflexive,
    pronouns,
  };
}

// ============================================================
// 6. Seeded PRNG (mulberry32) — deterministic shuffles
// ============================================================

function hashStr(s: string): number {
  let h = 0x9e3779b9;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 0x9e3779b9);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let z = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    z ^= z + Math.imul(z ^ (z >>> 7), 61 | z);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed<T>(arr: T[], seed: string): T[] {
  const rng = mulberry32(hashStr(seed));
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i]!, out[j]!] = [out[j]!, out[i]!];
  }
  return out;
}

/**
 * Pick k items from pool excluding any whose key() matches excludeKey.
 * Uses seeded shuffle for determinism.
 */
function pickNSeeded<T>(
  pool: T[],
  k: number,
  excludeKey: string,
  keyFn: (t: T) => string,
  seed: string,
): T[] {
  const candidates = pool.filter((t) => keyFn(t) !== excludeKey);
  const shuffled = shuffleWithSeed(candidates, seed);
  return shuffled.slice(0, k);
}

/**
 * Shuffle options and return {options, answer} where answer is the index of `correct`.
 */
function makeOptions(
  correct: string,
  distractors: string[],
  seed: string,
): { options: string[]; answer: number } {
  const all = shuffleWithSeed([correct, ...distractors], seed);
  const answer = all.indexOf(correct);
  return { options: all, answer };
}

// ============================================================
// 7. Generator helper
// ============================================================

function meta(
  system: string,
  module: string,
  tier: Tier,
  tags: string[],
  groupId?: string,
): PartialExercise["metadata"] {
  return {
    cefr: CEFR_FOR_TIER[tier],
    system,
    module,
    tier,
    tags,
    ...(groupId ? { groupId } : {}),
  };
}

function articleFor(pos: string): string {
  if (pos === "M") return "der";
  if (pos === "F") return "die";
  if (pos === "N") return "das";
  return "";
}

function otherArticles(correctArticle: string): string[] {
  return ["der", "die", "das"].filter((a) => a !== correctArticle);
}

// ============================================================
// 8. genGenderBundle
// ============================================================

function genGenderBundle(
  lexemes: Lexeme[],
  sentences: Sentence[],
  idx: Indices,
): PartialExercise[] {
  const out: PartialExercise[] = [];
  const nouns = lexemes.filter((l) => NOUN_POS.has(l.pos));

  for (const n of nouns) {
    const band = rankToBand(n.rank);
    const tier = bandToTier(band);
    const correct = articleFor(n.pos);
    if (!correct) continue;
    const seed = `gb-${n.lemma}-${n.rank}`;

    const gid = `gb:${n.lemma}`;

    // MC: choose the article
    const { options: mcOpts, answer: mcAns } = makeOptions(
      correct,
      otherArticles(correct),
      seed + "-mc",
    );
    out.push({
      engine: "mc",
      prompt: `Choose the correct article for: "${n.lemma}"`,
      options: mcOpts,
      answer: mcAns,
      metadata: meta("nominal", "gender-bundle", tier, ["grammar:gender"], gid),
    });

    // Cloze: "___ [lemma]"
    out.push({
      engine: "cloze",
      prompt: "Fill in the missing article:",
      stimulus: `___ ${n.lemma}`,
      answer: correct,
      acceptableAnswers: [correct.charAt(0).toUpperCase() + correct.slice(1)],
      metadata: meta(
        "nominal",
        "gender-bundle",
        tier,
        ["grammar:gender", "grammar:article"],
        gid,
      ),
    });

    // Sentence cloze: blank the noun in the CSV sentence
    if (containsWholeWord(n.deSentence, n.lemma)) {
      const blanked = replaceWholeWordFirst(n.deSentence, n.lemma, "____");
      if (blanked !== n.deSentence) {
        out.push({
          engine: "cloze",
          prompt: "Fill in the missing noun:",
          stimulus: blanked,
          answer: n.lemma,
          metadata: meta(
            "nominal",
            "gender-bundle",
            tier,
            ["grammar:gender", "cloze:noun"],
            gid,
          ),
        });
      }
    }
  }

  return out;
}

// ============================================================
// 9. genCoreVocab
// ============================================================

function genCoreVocab(lexemes: Lexeme[], idx: Indices): PartialExercise[] {
  const out: PartialExercise[] = [];
  const contentWords = lexemes.filter((l) => CONTENT_POS.has(l.pos));

  for (const lex of contentWords) {
    const band = rankToBand(lex.rank);
    const tier = bandToTier(band);
    const seed = `cv-${lex.lemma}-${lex.rank}`;

    // Need at least 3 same-POS distractors, deduped by both lemma and gloss so
    // the resulting MC options never contain two entries with the same text.
    const seenGlosses = new Set<string>([lex.gloss]);
    const seenLemmas = new Set<string>([lex.lemma]);
    const posPool = (idx.byPos.get(lex.pos) ?? []).filter((l) => {
      if (l.lemma === lex.lemma || l.gloss === lex.gloss) return false;
      if (seenGlosses.has(l.gloss) || seenLemmas.has(l.lemma)) return false;
      seenGlosses.add(l.gloss);
      seenLemmas.add(l.lemma);
      return true;
    });
    if (posPool.length < 3) continue;

    const distractors3 = pickNSeeded(
      posPool,
      3,
      lex.lemma,
      (l) => l.lemma,
      seed + "-dist",
    );
    const distGlosses = distractors3.map((d) => d.gloss);
    const distLemmas = distractors3.map((d) => d.lemma);

    const gid = `cv:${lex.lemma}`;

    // MC DE → EN: "What does [german] mean?"
    const { options: deOpts, answer: deAns } = makeOptions(
      lex.gloss,
      distGlosses,
      seed + "-de",
    );
    out.push({
      engine: "mc",
      prompt: `What does "${lex.lemma}" mean?`,
      options: deOpts,
      answer: deAns,
      metadata: meta("vocab", "core-vocab", tier, ["meaning:de-en"], gid),
    });

    // MC EN → DE: "Choose the German for: [english]"
    const { options: enOpts, answer: enAns } = makeOptions(
      lex.lemma,
      distLemmas,
      seed + "-en",
    );
    out.push({
      engine: "mc",
      prompt: `Choose the best German word for: "${lex.gloss}"`,
      options: enOpts,
      answer: enAns,
      metadata: meta("vocab", "core-vocab", tier, ["meaning:en-de"], gid),
    });
  }

  return out;
}

// ============================================================
// 10. genSentenceCloze
// ============================================================

function genSentenceCloze(
  sentences: Sentence[],
  idx: Indices,
): PartialExercise[] {
  const out: PartialExercise[] = [];

  for (const s of sentences) {
    if (!CONTENT_POS.has(s.targetPos)) continue;
    if (!containsWholeWord(s.de, s.targetLemma)) continue;
    if (wordCount(s.de) > 18) continue;

    const blanked = replaceWholeWordFirst(s.de, s.targetLemma, "____");
    if (blanked === s.de) continue;

    const tier = bandToTier(rankToBand(s.rank));
    const gid = `sc:${hashStr(s.de) >>> 0}`;

    out.push({
      engine: "cloze",
      prompt: "Fill in the missing word:",
      stimulus: blanked,
      answer: s.targetLemma,
      metadata: meta(
        "vocab",
        "sentence-cloze",
        tier,
        ["cloze:in-context", `pos:${s.targetPos}`],
        gid,
      ),
    });
  }

  return out;
}

// ============================================================
// 11. genSentenceBuilder
// ============================================================

// Nominative-only pronouns (never also an accusative/dative object form),
// so seeing one in token position 0 reliably means "this is a subject-
// initial declarative main clause", not a fronted object.
const SAFE_FRONTING_SUBJECTS = new Set(["ich", "du", "er", "wir", "ihr"]);

// Single-token adverbial connectors that German allows to front to the
// Vorfeld with subject-verb inversion (a standard, always-grammatical V2
// reordering). Deliberately NOT the full TEMPORAL_WORDS/CONNECTORS_MAIN
// lists: "vor"/"nach"/"seit"/"bis" are prepositions that need a complement
// (fronting just "vor" out of "vor drei Jahren" is ungrammatical), and
// "denn"/"sondern" are true coordinating conjunctions that do NOT trigger
// inversion when fronted (unlike these adverbial connectors). Restricting
// to this short, unambiguous list keeps every generated alternate
// mechanically guaranteed to be grammatical.
const FRONTABLE_ADVERBS = new Set([
  "deshalb",
  "daher",
  "trotzdem",
  "dennoch",
  "außerdem",
  "hingegen",
  "stattdessen",
  "jedoch",
]);

/**
 * For a simple subject-initial main clause "Subject Verb ... Adverb ...",
 * German also always permits fronting that adverb with subject-verb
 * inversion: "Adverb Verb Subject ...". Returns that alternate token order
 * when we can identify the pattern unambiguously, else undefined.
 *
 * Deliberately conservative: only fires for a single, punctuation-free
 * adverb occurrence and a single-token nominative-only subject pronoun, so
 * we never emit an alternate that isn't actually grammatical.
 */
function computeFrontingAlternate(toks: string[]): string[] | undefined {
  if (toks.length < 5) return undefined;
  if (toks.some((t) => t.includes(","))) return undefined; // keep to simple main clauses

  const subject = toks[0]!.toLowerCase();
  if (!SAFE_FRONTING_SUBJECTS.has(subject)) return undefined;

  let advIdx = -1;
  for (let i = 2; i < toks.length; i++) {
    const clean = toks[i]!.toLowerCase();
    if (!/^[a-zäöü]+$/.test(clean)) continue; // skip tokens carrying punctuation (usually sentence-final)
    if (FRONTABLE_ADVERBS.has(clean)) {
      if (advIdx !== -1) return undefined; // more than one candidate — ambiguous, skip
      advIdx = i;
    }
  }
  if (advIdx === -1) return undefined;

  const verb = toks[1]!;
  const subjectTok = toks[0]!;
  const adverbTok = toks[advIdx]!;
  const rest = toks.filter((_, i) => i !== 0 && i !== 1 && i !== advIdx);
  return [adverbTok, verb, subjectTok, ...rest];
}

function genSentenceBuilder(
  sentences: Sentence[],
  idx: Indices,
): PartialExercise[] {
  const out: PartialExercise[] = [];

  for (const s of sentences) {
    const toks = tokenize(s.de);
    if (toks.length < 4 || toks.length > 14) continue;

    const seed = `sb-${s.rank}-${s.de.length}`;
    let shuffled = shuffleWithSeed(toks, seed);

    // Ensure shuffled differs from solution (retry once if needed)
    if (shuffled.join(" ") === toks.join(" ")) {
      shuffled = shuffleWithSeed(toks, seed + "-alt");
    }
    if (shuffled.join(" ") === toks.join(" ")) continue; // truly trivial, skip

    const tier = bandToTier(rankToBand(s.rank));
    const gid = `sb:${hashStr(s.de) >>> 0}`;
    const alt = computeFrontingAlternate(toks);

    out.push({
      engine: "builder",
      prompt: "Put the words in the correct order:",
      stimulus: s.en,
      tokens: shuffled,
      solution: toks,
      ...(alt ? { solutionAlternates: [alt] } : {}),
      // No `answer` field — builder engine validates against `solution`
      metadata: meta(
        "syntax",
        "sentence-builder",
        tier,
        ["syntax:word-order", "builder"],
        gid,
      ),
    });
  }

  return out;
}

// ============================================================
// 12. genConnectors
// ============================================================

function genConnectors(mined: MinedData, idx: Indices): PartialExercise[] {
  const out: PartialExercise[] = [];

  // Subordinating connectors → cloze + MC
  for (const s of mined.connectorSub) {
    const connector = sentenceContainsAny(s.de, CONNECTORS_SUB);
    if (!connector) continue;
    if (wordCount(s.de) > 18) continue;

    const blanked = replaceWholeWordFirst(s.de, connector, "____");
    if (blanked === s.de) continue;

    const tier = bandToTier(rankToBand(s.rank));
    const seed = `con-sub-${connector}-${s.rank}`;
    const gid = `con:${hashStr(s.de) >>> 0}`;

    // Cloze: fill in the connector
    out.push({
      engine: "cloze",
      prompt: "Fill in the correct connector:",
      stimulus: blanked,
      answer: connector,
      metadata: meta(
        "flow",
        "connectors",
        tier,
        ["connector:subordinate"],
        gid,
      ),
    });

    // MC: choose the connector from a short list of similar ones
    const distractors = shuffleWithSeed(
      CONNECTORS_SUB.filter((c) => c !== connector),
      seed + "-mc",
    ).slice(0, 3);
    const { options, answer } = makeOptions(
      connector,
      distractors,
      seed + "-opts",
    );
    out.push({
      engine: "mc",
      prompt: "Choose the correct connector:",
      stimulus: blanked,
      options,
      answer,
      metadata: meta(
        "flow",
        "connectors",
        tier,
        ["connector:subordinate", "mc"],
        gid,
      ),
    });
  }

  // Coordinating/adverbial connectors → cloze only
  for (const s of mined.connectorMain) {
    const connector = sentenceContainsAny(s.de, CONNECTORS_MAIN);
    if (!connector) continue;
    if (wordCount(s.de) > 18) continue;

    const blanked = replaceWholeWordFirst(s.de, connector, "____");
    if (blanked === s.de) continue;

    const tier = bandToTier(rankToBand(s.rank));
    const seed = `con-main-${connector}-${s.rank}`;
    const gid = `con:${hashStr(s.de) >>> 0}`;

    out.push({
      engine: "cloze",
      prompt: "Fill in the correct connector:",
      stimulus: blanked,
      answer: connector,
      metadata: meta("flow", "connectors", tier, ["connector:main"], gid),
    });

    const distractors = shuffleWithSeed(
      CONNECTORS_MAIN.filter((c) => c !== connector),
      seed + "-mc",
    ).slice(0, 3);
    if (distractors.length >= 2) {
      const { options, answer } = makeOptions(
        connector,
        distractors,
        seed + "-opts",
      );
      out.push({
        engine: "mc",
        prompt: "Choose the correct connector:",
        stimulus: blanked,
        options,
        answer,
        metadata: meta(
          "flow",
          "connectors",
          tier,
          ["connector:main", "mc"],
          gid,
        ),
      });
    }
  }

  return out;
}

// ============================================================
// 13. genPronouns
// ============================================================

function genPronouns(mined: MinedData, idx: Indices): PartialExercise[] {
  const out: PartialExercise[] = [];

  for (const s of mined.pronouns) {
    const prn = sentenceContainsAny(s.de, SAFE_PRONOUNS);
    if (!prn) continue;
    if (wordCount(s.de) > 15) continue;

    // Skip if the pronoun appears more than once (ambiguous which to blank)
    const re = new RegExp(
      `(?<![a-zA-ZäöüÄÖÜß])${escapeRegex(prn)}(?![a-zA-ZäöüÄÖÜß])`,
      "gi",
    );
    const matches = [...s.de.matchAll(re)];
    if (matches.length !== 1) continue;

    const blanked = replaceWholeWordFirst(s.de, prn, "____");
    if (blanked === s.de) continue;

    const tier = bandToTier(rankToBand(s.rank));
    const gid = `pro:${hashStr(s.de) >>> 0}`;

    out.push({
      engine: "cloze",
      prompt: "Fill in the correct pronoun:",
      stimulus: blanked,
      answer: prn,
      metadata: meta(
        "nominal",
        "pronouns",
        tier,
        ["grammar:pronoun", "cloze"],
        gid,
      ),
    });
  }

  return out;
}

// ============================================================
// 14. genReflexives
// ============================================================

function genReflexives(mined: MinedData, idx: Indices): PartialExercise[] {
  const out: PartialExercise[] = [];

  for (const s of mined.reflexive) {
    const ref = sentenceContainsAny(s.de, REFLEXIVE_PRON);
    if (!ref) continue;
    if (wordCount(s.de) > 15) continue;

    // Guard against plain accusative/dative objects that happen to match one
    // of the reflexive-pronoun forms (e.g. "über mich reden" is not reflexive).
    // Require a known reflexive-verb stem in the sentence...
    if (!hasReflexiveVerbNearby(s.de)) continue;

    // ...and require the candidate pronoun to appear exactly once, so the
    // blank is unambiguous.
    const occurrences = [
      ...s.de.matchAll(
        new RegExp(
          `(?<![a-zA-ZäöüÄÖÜß])${escapeRegex(ref)}(?![a-zA-ZäöüÄÖÜß])`,
          "gi",
        ),
      ),
    ];
    if (occurrences.length !== 1) continue;

    const blanked = replaceWholeWordFirst(s.de, ref, "____");
    if (blanked === s.de) continue;

    const tier = bandToTier(rankToBand(s.rank));
    const seed = `ref-${ref}-${s.rank}`;
    const gid = `ref:${hashStr(s.de) >>> 0}`;

    const distractors = shuffleWithSeed(
      REFLEXIVE_PRON.filter((r) => r !== ref),
      seed,
    ).slice(0, 3);
    const { options, answer } = makeOptions(ref, distractors, seed + "-opts");

    out.push({
      engine: "mc",
      prompt: "Choose the correct reflexive pronoun:",
      stimulus: blanked,
      options,
      answer,
      metadata: meta(
        "verb",
        "reflexives",
        tier,
        ["grammar:reflexive", "mc"],
        gid,
      ),
    });
  }

  return out;
}

// ============================================================
// 15. genNegationLab
// ============================================================

function genNegationLab(mined: MinedData, idx: Indices): PartialExercise[] {
  const out: PartialExercise[] = [];

  const KEIN_FORMS = ["kein", "keine", "keinen", "keinem", "keiner", "keines"];

  for (const s of mined.negation) {
    const neg = sentenceContainsAny(s.de, NEGATION_WORDS);
    if (!neg) continue;
    if (wordCount(s.de) > 16) continue;

    const blanked = replaceWholeWordFirst(s.de, neg, "____");
    if (blanked === s.de) continue;

    const tier = bandToTier(rankToBand(s.rank));
    const gid = `neg:${hashStr(s.de) >>> 0}`;

    // Cloze: fill in the negation word
    out.push({
      engine: "cloze",
      prompt: "Fill in the correct negation:",
      stimulus: blanked,
      answer: neg,
      metadata: meta(
        "syntax",
        "negation-lab",
        tier,
        ["syntax:negation", "cloze"],
        gid,
      ),
    });

    // Fix-it: corrupt kein-form → "nicht" and ask the learner to restore it.
    // Only the kein→nicht direction is used: "kein/keine/..." is (almost)
    // always immediately followed by a bare noun phrase (capitalized noun),
    // and "nicht" cannot correctly negate a bare indefinite noun phrase there,
    // so the corrupted sentence has exactly one valid fix. The reverse
    // direction (nicht→kein) was dropped because "nicht" mostly negates
    // verbs/adjectives/adverbs, where swapping in "kein" often produces an
    // ungrammatical sentence with no clean unique correction.
    if (KEIN_FORMS.includes(neg)) {
      const idxOfNeg = s.de
        .toLowerCase()
        .search(
          new RegExp(
            `(?<![a-zA-ZäöüÄÖÜß])${escapeRegex(neg)}(?![a-zA-ZäöüÄÖÜß])`,
            "i",
          ),
        );
      const after =
        idxOfNeg >= 0 ? s.de.slice(idxOfNeg + neg.length).trim() : "";
      const nextWord = after.split(/\s+/)[0] ?? "";
      const nextIsCapitalizedNoun = /^[A-ZÄÖÜ][a-zäöüß]/.test(nextWord);

      if (nextIsCapitalizedNoun) {
        const corrupted = replaceWholeWordFirst(s.de, neg, "nicht");
        if (corrupted && corrupted !== s.de) {
          out.push({
            engine: "fixit",
            prompt: "Fix the negation in this sentence:",
            stimulus: corrupted,
            answer: s.de,
            metadata: meta(
              "syntax",
              "negation-lab",
              tier,
              ["syntax:negation", "fixit"],
              gid,
            ),
          });
        }
      }
    }
  }

  return out;
}

// ============================================================
// 16. genErrorClinic
// ============================================================

type Mutator = {
  name: string;
  fn: (de: string, tokens: string[]) => string | null;
};

const PRONOUN_SWAP_PAIRS: [string, string][] = [
  ["mich", "mir"],
  ["dich", "dir"],
  ["ihn", "ihm"],
];

function mutatePronouns(de: string): string | null {
  for (const [a, b] of PRONOUN_SWAP_PAIRS) {
    if (containsWholeWord(de, a)) {
      return replaceWholeWordFirst(de, a, b);
    }
    if (containsWholeWord(de, b)) {
      return replaceWholeWordFirst(de, b, a);
    }
  }
  return null;
}

// Words that legitimately front a main clause (adverb/connector in position 1),
// which forces the finite verb into position 2 and the subject into position 3
// (e.g. "Heute geht er ..."). Swapping positions 2/3 in exactly this context
// produces a genuine, unambiguous V2 violation ("Heute er geht ...") whose
// only clean fix is restoring verb-second order — unlike swapping arbitrary
// tokens in a subject-initial sentence, which usually just produces nonsense
// rather than a single gradable error.
const FRONTING_WORDS = new Set(
  [...TEMPORAL_WORDS, ...CONNECTORS_MAIN].map((w) => w.toLowerCase()),
);

function mutateV2(de: string, tokens: string[]): string | null {
  if (tokens.length < 5) return null;
  const first = (tokens[0] ?? "").toLowerCase().replace(/[.,!?;:]+$/, "");
  if (!FRONTING_WORDS.has(first)) return null;
  const swapped = [...tokens];
  [swapped[1]!, swapped[2]!] = [swapped[2]!, swapped[1]!];
  const result = swapped.join(" ");
  return result !== de ? result : null;
}

function mutateNegation(de: string): string | null {
  const KEIN_FORMS = ["kein", "keine", "keinen", "keinem", "keiner", "keines"];
  if (containsWholeWord(de, "nicht")) {
    return replaceWholeWordFirst(de, "nicht", "kein");
  }
  for (const kf of KEIN_FORMS) {
    if (containsWholeWord(de, kf)) {
      return replaceWholeWordFirst(de, kf, "nicht");
    }
  }
  return null;
}

function genErrorClinic(
  sentences: Sentence[],
  idx: Indices,
): PartialExercise[] {
  const out: PartialExercise[] = [];

  const mutators: Mutator[] = [
    {
      name: "pronoun-case",
      fn: (de) => mutatePronouns(de),
    },
    {
      name: "v2-word-order",
      fn: (de, toks) => mutateV2(de, toks),
    },
    {
      name: "negation-swap",
      fn: (de) => mutateNegation(de),
    },
  ];

  // Use seeded deterministic sample (take every Nth sentence to spread across bands)
  const shuffledSents = shuffleWithSeed(sentences, "error-clinic-seed");
  const sample = shuffledSents.slice(0, 4000);

  for (const s of sample) {
    if (wordCount(s.de) < 4 || wordCount(s.de) > 16) continue;
    const toks = tokenize(s.de);

    for (const mut of mutators) {
      const corrupted = mut.fn(s.de, toks);
      if (!corrupted || corrupted === s.de) continue;

      const tier = bandToTier(rankToBand(s.rank));
      const gid = `ec:${hashStr(s.de) >>> 0}:${mut.name}`;

      out.push({
        engine: "fixit",
        prompt: "Correct the error in this sentence:",
        stimulus: corrupted,
        answer: s.de,
        metadata: meta(
          "performance",
          "error-clinic",
          tier,
          ["fixit", `mutator:${mut.name}`],
          gid,
        ),
      });
    }
  }

  return out;
}

// ============================================================
// 17. Quality filters
// ============================================================

function qualityFilters(items: PartialExercise[]): PartialExercise[] {
  const seen = new Set<string>();
  const out: PartialExercise[] = [];

  for (const item of items) {
    // Length checks
    const stimulus = item.stimulus ?? "";
    if (item.engine === "mc" || item.engine === "cloze") {
      if (wordCount(stimulus) > 18) continue;
    }
    if (item.engine === "builder") {
      if (!item.tokens || item.tokens.length < 4 || item.tokens.length > 14)
        continue;
    }

    // Answer must be non-empty (builder uses solution instead)
    let ansKey: string;
    if (item.engine === "builder") {
      if (!item.solution || item.solution.length < 2) continue;
      ansKey = item.solution.join(" ");
    } else {
      const ans = item.answer;
      if (ans === undefined) continue;
      if (typeof ans === "string" && !ans.trim()) continue;
      ansKey = String(ans);
    }

    // MC must have at least 2 options
    if (item.engine === "mc" && (!item.options || item.options.length < 2))
      continue;

    // Deduplicate by (engine + prompt + stimulus + answer)
    const sig = `${item.engine}|${item.prompt}|${stimulus}|${ansKey}`;
    if (seen.has(sig)) continue;
    seen.add(sig);

    out.push(item);
  }

  return out;
}

// ============================================================
// 18. Emit TS file
// ============================================================

function slugToCamel(slug: string): string {
  return slug.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

function serializeItems(items: object[]): string {
  const json = JSON.stringify(items, null, 2);
  // Restore Unicode characters from \uXXXX escapes so files are readable
  return json.replace(/\\u([0-9a-fA-F]{4})/g, (_, code: string) =>
    String.fromCharCode(parseInt(code, 16)),
  );
}

function emitTierFile(
  systemId: string,
  moduleSlug: string,
  exportBase: string,
  tier: Tier,
  items: object[],
): void {
  const dir = resolve(
    process.cwd(),
    "content",
    "systems",
    systemId,
    moduleSlug,
  );
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const exportName = `${slugToCamel(exportBase)}Tier${tier}`;
  const body =
    `/* eslint-disable */\n` +
    `// Auto-generated by scripts/generate-content.ts — do not edit by hand.\n` +
    `import type { ExerciseItem } from "@/lib/content/schema";\n\n` +
    `export const ${exportName}: ExerciseItem[] = ${serializeItems(items)};\n`;

  writeFileSync(join(dir, `tier${tier}.ts`), body, "utf8");
}

// ============================================================
// 19. Main
// ============================================================

interface ModuleDef {
  systemId: string;
  slug: string;
  exportBase: string;
  idPrefix: string;
  gen: () => PartialExercise[];
}

function main(): void {
  const csvPath = resolve(process.cwd(), "content", "german_words_all.csv");
  console.log("Loading CSV...");
  const rows = loadAndClean(csvPath);
  console.log(`  ${rows.length} rows after clean+dedupe`);

  const lexemes = buildLexemes(rows);
  const sentences = buildSentenceBank(rows);
  const idx = buildIndices(lexemes, sentences);
  const mined = mineFromSentences(sentences, idx);

  console.log(`  Lexemes: ${lexemes.length}  Sentences: ${sentences.length}`);
  console.log(
    `  Mined: connSub=${mined.connectorSub.length} connMain=${mined.connectorMain.length} ` +
      `temporal=${mined.temporal.length} neg=${mined.negation.length} ` +
      `ref=${mined.reflexive.length} prn=${mined.pronouns.length}`,
  );

  const modules: ModuleDef[] = [
    {
      systemId: "nominal",
      slug: "gender-bundle",
      exportBase: "genderBundle",
      idPrefix: "nom-gb",
      gen: () => genGenderBundle(lexemes, sentences, idx),
    },
    {
      systemId: "nominal",
      slug: "pronouns",
      exportBase: "pronouns",
      idPrefix: "nom-pro",
      gen: () => genPronouns(mined, idx),
    },
    {
      systemId: "verb",
      slug: "reflexives",
      exportBase: "reflexives",
      idPrefix: "vb-ref",
      gen: () => genReflexives(mined, idx),
    },
    {
      systemId: "syntax",
      slug: "sentence-builder",
      exportBase: "sentenceBuilder",
      idPrefix: "syn-sb",
      gen: () => genSentenceBuilder(sentences, idx),
    },
    {
      systemId: "syntax",
      slug: "negation-lab",
      exportBase: "negationLab",
      idPrefix: "syn-neg",
      gen: () => genNegationLab(mined, idx),
    },
    {
      systemId: "flow",
      slug: "connectors",
      exportBase: "connectors",
      idPrefix: "flow-con",
      gen: () => genConnectors(mined, idx),
    },
    {
      systemId: "vocab",
      slug: "core-vocab",
      exportBase: "coreVocab",
      idPrefix: "voc-cv",
      gen: () => genCoreVocab(lexemes, idx),
    },
    {
      systemId: "vocab",
      slug: "sentence-cloze",
      exportBase: "sentenceCloze",
      idPrefix: "voc-sc",
      gen: () => genSentenceCloze(sentences, idx),
    },
    {
      systemId: "performance",
      slug: "error-clinic",
      exportBase: "errorClinic",
      idPrefix: "perf-ec",
      gen: () => genErrorClinic(sentences, idx),
    },
  ];

  console.log("\nGenerating exercises...");

  for (const mod of modules) {
    process.stdout.write(`  ${mod.systemId}/${mod.slug}: `);

    const raw = mod.gen();
    const filtered = qualityFilters(raw);

    for (const tier of [1, 2, 3] as const) {
      const tierItems = filtered
        .filter((i) => i.metadata.tier === tier)
        .slice(0, TIER_CAP === Infinity ? undefined : TIER_CAP);

      // Assign final stable sequential IDs
      const finalItems = tierItems.map((item, seq) => ({
        id: `${mod.idPrefix}-t${tier}-${String(seq + 1).padStart(3, "0")}`,
        ...withModuleFeedback(mod.slug, item),
      }));

      emitTierFile(mod.systemId, mod.slug, mod.exportBase, tier, finalItems);
      process.stdout.write(`t${tier}:${finalItems.length} `);
    }

    console.log();
  }

  console.log(
    "\nContent generation complete. Run npm run content:lint to validate.",
  );
}

main();
