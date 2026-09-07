export type Intensity = 0 | 1 | 2 | 3 | 4;
export type SafetyAnswer = "no" | "sometimes" | "now";
export type SupportAnswer = "yes" | "unsure" | "no";

export type ScreeningAnswers = {
  immediateDanger: boolean;
  intensity: Intensity;
  impact: Intensity;
  safety: SafetyAnswer;
  support: SupportAnswer;
};

export type ScreeningOutcome = "steady" | "support" | "urgent";

export function getScreeningOutcome(answers: ScreeningAnswers): ScreeningOutcome {
  if (answers.immediateDanger || answers.safety === "now") {
    return "urgent";
  }

  const safetyWeight = answers.safety === "sometimes" ? 4 : 0;
  const isolationWeight = answers.support === "no" ? 2 : answers.support === "unsure" ? 1 : 0;
  const score = answers.intensity + answers.impact + safetyWeight + isolationWeight;

  return score >= 7 ? "support" : "steady";
}

export const defaultAnswers: ScreeningAnswers = {
  immediateDanger: false,
  intensity: 0,
  impact: 0,
  safety: "no",
  support: "yes",
};
