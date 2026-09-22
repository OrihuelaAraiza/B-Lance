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

export type ScreeningOutcome = "general" | "support" | "urgent";

export function getScreeningOutcome(
  answers: ScreeningAnswers,
): ScreeningOutcome {
  if (answers.immediateDanger || answers.safety === "now") {
    return "urgent";
  }

  // Directly stated support needs only. No score or clinical referral threshold.
  if (answers.safety === "sometimes" || answers.support !== "yes")
    return "support";
  return "general";
}

export const defaultAnswers: ScreeningAnswers = {
  immediateDanger: false,
  intensity: 0,
  impact: 0,
  safety: "no",
  support: "yes",
};
