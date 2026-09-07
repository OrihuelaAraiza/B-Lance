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
