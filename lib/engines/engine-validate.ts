import type { ExerciseItem } from "@/lib/content/schema";
import type { ValidationResult } from "@/lib/validators/types";
import { failure, success } from "@/lib/validators/types";
import { matchAny } from "@/lib/validators/exact";
import { validateTokenOrder } from "@/lib/validators/token-order";

export function validateExerciseItem(item: ExerciseItem, attempt: unknown): ValidationResult {
  switch (item.engine) {
    case "mc": {
      if (typeof attempt !== "number" || !Number.isInteger(attempt)) {
        return failure(["mc:invalid"], "Choose an option.");
      }
      if (attempt < 0 || attempt >= item.options.length) {
        return failure(["mc:invalid"], "Invalid option.");
      }
      if (attempt !== item.answer) return failure(["mc:wrong"], "Not the best choice.");
      return success();
    }
    case "cloze": {
      if (typeof attempt !== "string") return failure(["match:any"], "Type your answer.");
      const extra = item.acceptableAnswers ?? [];
      return matchAny([item.answer, ...extra], attempt);
    }
    case "builder":
      return validateTokenOrder(item.solution, attempt);
    case "fixit":
    case "transform":
    case "timed": {
      if (typeof attempt !== "string") return failure(["match:any"], "Type your answer.");
      const extra = item.acceptableAnswers ?? [];
      return matchAny([item.answer, ...extra], attempt);
    }
  }
}
