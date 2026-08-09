import { allExerciseItems } from "../content/registry";
import { exerciseItemSchema } from "../lib/content/schema";
import type { ExerciseItem } from "../lib/content/schema";
import { validateItem } from "../lib/engines/registry";

function canonicalAnswer(item: ExerciseItem): unknown {
  switch (item.engine) {
    case "mc":
      return item.answer;
    case "cloze":
    case "fixit":
    case "transform":
    case "timed":
      return item.answer;
    case "builder":
      return item.solution;
    default: {
      const _x: never = item;
      return _x;
    }
  }
}

let errors = 0;
const seenIds = new Set<string>();

for (const item of allExerciseItems) {
  try {
    exerciseItemSchema.parse(item);
  } catch (e) {
    console.error(`Schema failed: ${item.id}`, e);
    errors++;
    continue;
  }
  const r = validateItem(item, canonicalAnswer(item));
  if (!r.ok) {
    console.error(`Self-check failed: ${item.id}`, r);
    errors++;
  }

  // Duplicate ID across the whole content set.
  if (seenIds.has(item.id)) {
    console.error(`Duplicate id: ${item.id}`);
    errors++;
  } else {
    seenIds.add(item.id);
  }

  // MC items must not offer two options with identical text — otherwise
  // there can be more than one "correct" choice on screen.
  if (item.engine === "mc") {
    const normalized = item.options.map((o) => o.trim().toLowerCase());
    const dupes = normalized.filter((o, i) => normalized.indexOf(o) !== i);
    if (dupes.length > 0) {
      console.error(`Duplicate MC options: ${item.id} (${dupes.join(", ")})`);
      errors++;
    }
  }

  // "always" visibility exists to disambiguate/translate up front — an item
  // that sets it without an actual translation string is a no-op that would
  // silently leave the item ambiguous.
  if (item.translationVisibility === "always" && !item.translation?.trim()) {
    console.error(
      `translationVisibility "always" without a translation: ${item.id}`,
    );
    errors++;
  }
}

if (errors > 0) {
  console.error(`content:lint failed with ${errors} error(s).`);
  process.exit(1);
}
console.log(
  `content:lint OK (${allExerciseItems.length} items, ${seenIds.size} unique ids).`,
);
