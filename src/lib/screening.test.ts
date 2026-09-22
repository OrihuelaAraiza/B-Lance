import { describe, expect, it } from "vitest";
import { defaultAnswers, getScreeningOutcome } from "./screening";

describe("getScreeningOutcome", () => {
  it("never leaves immediate danger in a non-urgent outcome", () => {
    expect(getScreeningOutcome({ ...defaultAnswers, immediateDanger: true })).toBe("urgent");
  });

  it("treats current thoughts of self-harm as urgent", () => {
    expect(getScreeningOutcome({ ...defaultAnswers, safety: "now" })).toBe("urgent");
  });

  it("shows support when the person has no one to talk to", () => {
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

  it("offers general resources without a clinical classification", () => {
    expect(getScreeningOutcome({ ...defaultAnswers, intensity: 2, impact: 1 })).toBe("general");
  });
});

// Technical checks of explicit support routing, not clinical validation.
describe("demonstration rule boundaries", () => {
  it("does not create a clinical cutoff from intensity or impact", () => {
    expect(getScreeningOutcome({ ...defaultAnswers, intensity: 3, impact: 3 })).toBe("general");
    expect(getScreeningOutcome({ ...defaultAnswers, intensity: 4, impact: 4 })).toBe("general");
  });

  it("shows human support for any explicitly stated past safety concern", () => {
    expect(getScreeningOutcome({ ...defaultAnswers, safety: "sometimes" })).toBe("support");
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
