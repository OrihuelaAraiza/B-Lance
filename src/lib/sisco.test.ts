import { describe, expect, it } from "vitest";
import { siscoItems } from "../data/sisco";
import { clinicalProtocol } from "./clinicalProtocol";
import { summarizeSisco, type SiscoAnswers } from "./sisco";

const complete: SiscoAnswers = Object.fromEntries(
  siscoItems.map((item) => [
    item.id,
    item.dimension === "coping" ? 5 : item.dimension === "symptoms" ? 2 : 0,
  ]),
);
describe("SISCO descriptive preview", () => {
  it("keeps coping separate and never assigns a clinical classification", () => {
    expect(summarizeSisco(complete)).toEqual({
      stressors: 0,
      symptoms: 2,
      coping: 5,
      answered: 21,
      clinicalClassification: null,
    });
    expect(clinicalProtocol).toMatchObject({
      clinical_referral_rule: null,
      yellow_cutoffs: null,
      clinical_triage_enabled: false,
    });
  });
  it("never scores missing answers, including the final item", () => {
    expect(summarizeSisco({})).toBeNull();
    expect(summarizeSisco({ ...complete, A7: undefined })).toBeNull();
  });
  it.each([-1, 6, 2.5, NaN, Infinity])(
    "rejects invalid value %s without imputation",
    (value) => {
      expect(summarizeSisco({ ...complete, E1: value })).toBeNull();
    },
  );
});
