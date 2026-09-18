import { describe, expect, it } from "vitest";
import { defaultAnswers, getScreeningOutcome } from "./screening";

describe("getScreeningOutcome", () => {
  it("never leaves immediate danger in a non-urgent outcome", () => {
    expect(getScreeningOutcome({ ...defaultAnswers, immediateDanger: true })).toBe("urgent");
  });

  it("treats current thoughts of self-harm as urgent", () => {
    expect(getScreeningOutcome({ ...defaultAnswers, safety: "now" })).toBe("urgent");
  });

  it("routes sustained high distress to human support", () => {
    expect(
      getScreeningOutcome({
        ...defaultAnswers,
        intensity: 4,
        impact: 4,
        support: "no",
      }),
    ).toBe("support");
  });

  it("routes intermittent safety concerns to human support", () => {
    expect(
      getScreeningOutcome({
        ...defaultAnswers,
        intensity: 2,
        impact: 1,
        safety: "sometimes",
      }),
    ).toBe("support");
  });

  it("keeps low distress in the self-regulation path", () => {
    expect(getScreeningOutcome({ ...defaultAnswers, intensity: 2, impact: 1 })).toBe("steady");
  });
});

// Characterization of the existing demonstration rules, not clinical validation.
describe("demonstration rule boundaries", () => {
  it("preserves the score boundary between six and seven", () => {
    expect(getScreeningOutcome({ ...defaultAnswers, intensity: 3, impact: 3 })).toBe("steady");
    expect(getScreeningOutcome({ ...defaultAnswers, intensity: 3, impact: 4 })).toBe("support");
  });

  it("documents low-intensity sometimes as steady pending clinical review", () => {
    expect(getScreeningOutcome({ ...defaultAnswers, safety: "sometimes" })).toBe("steady");
  });

  it("always prioritizes immediate danger or current thoughts across all valid answers", () => {
    const intensities = [0, 1, 2, 3, 4] as const;
    for (const intensity of intensities) for (const impact of intensities) {
      for (const support of ["yes", "unsure", "no"] as const) {
        for (const safety of ["no", "sometimes", "now"] as const) {
          expect(getScreeningOutcome({ immediateDanger: true, intensity, impact, support, safety })).toBe("urgent");
        }
        expect(getScreeningOutcome({ immediateDanger: false, intensity, impact, support, safety: "now" })).toBe("urgent");
      }
    }
  });
});
