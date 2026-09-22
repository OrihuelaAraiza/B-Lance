import { siscoItems } from "../data/sisco";
export type SiscoAnswers = Partial<
  Record<(typeof siscoItems)[number]["id"], number>
>;

// Descriptive arithmetic only; no severity, referral, or clinical interpretation.
// Require all 21 responses. Never impute a declined or incomplete questionnaire.
export function summarizeSisco(answers: SiscoAnswers) {
  if (
    !siscoItems.every(
      ({ id }) =>
        Number.isInteger(answers[id]) && answers[id]! >= 0 && answers[id]! <= 5,
    )
  )
    return null;
  const mean = (ids: readonly string[]) =>
    ids.reduce((sum, id) => sum + answers[id as keyof SiscoAnswers]!, 0) /
    ids.length;
  return {
    stressors: mean(
      siscoItems
        .filter((item) => item.dimension === "stressors")
        .map((item) => item.id),
    ),
    symptoms: mean(
      siscoItems
        .filter((item) => item.dimension === "symptoms")
        .map((item) => item.id),
    ),
    coping: mean(
      siscoItems
        .filter((item) => item.dimension === "coping")
        .map((item) => item.id),
    ),
    answered: 21,
    clinicalClassification: null,
  };
}
