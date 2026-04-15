import { describe, expect, it } from "vitest";
import {
  FHSS_ANNUAL_ELIGIBLE_CONTRIBUTIONS_CAP,
  exceedsFhssAnnualEligibleCapModel,
  fhssAnnualEligibleOverByModel,
  getVoluntaryConcessionalModelTotal
} from "./fhssCaps";
import type { SuperInputs } from "./types";

const minimal = (overrides: Partial<SuperInputs> = {}): SuperInputs => ({
  annualIncome: 80000,
  employerSgContributions: 10000,
  sgPaymentFrequency: "fortnightly",
  sgPaymentAmount: 1000,
  existingSalarySacrifice: 0,
  plannedSalarySacrifice: 0,
  salarySacrificeProjectionFrequency: "fortnightly",
  plannedLumpSumDeductible: 0,
  carryForwardAvailable: 0,
  totalSuperBalanceLast30June: 100000,
  useAutoMarginalTaxRate: true,
  manualMarginalTaxRate: 32,
  includeDivision293: false,
  ...overrides
});

describe("fhssCaps model helpers", () => {
  it("sums salary sacrifice already arranged, planned salary sacrifice, and lump sum", () => {
    expect(
      getVoluntaryConcessionalModelTotal(
        minimal({
          existingSalarySacrifice: 2000,
          plannedSalarySacrifice: 5000,
          plannedLumpSumDeductible: 1000
        })
      )
    ).toBe(8000);
  });

  it("does not exceed annual FHSS cap when total is at cap", () => {
    const inputs = minimal({
      plannedSalarySacrifice: FHSS_ANNUAL_ELIGIBLE_CONTRIBUTIONS_CAP
    });
    expect(exceedsFhssAnnualEligibleCapModel(inputs)).toBe(false);
    expect(fhssAnnualEligibleOverByModel(inputs)).toBe(0);
  });

  it("flags when voluntary concessional model total is above FHSS annual eligible cap", () => {
    const inputs = minimal({
      plannedSalarySacrifice: 10_000,
      plannedLumpSumDeductible: 10_000
    });
    expect(exceedsFhssAnnualEligibleCapModel(inputs)).toBe(true);
    expect(fhssAnnualEligibleOverByModel(inputs)).toBe(5000);
  });
});
