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
}

if (errors > 0) {
  console.error(`content:lint failed with ${errors} error(s).`);
  process.exit(1);
}
console.log(`content:lint OK (${allExerciseItems.length} items).`);
