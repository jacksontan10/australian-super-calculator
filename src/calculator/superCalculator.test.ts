import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { APP_FINANCIAL_YEAR } from "./atoCapData";
import { calculateSuperContribution } from "./superCalculator";
import type { SuperInputs } from "./types";

const baseInputs: SuperInputs = {
  annualIncome: 100000,
  employerSgContributions: 11000,
  sgPaymentFrequency: "fortnightly",
  sgPaymentAmount: 1000,
  existingSalarySacrifice: 2000,
  plannedSalarySacrifice: 4000,
  salarySacrificeProjectionFrequency: "fortnightly",
  plannedLumpSumDeductible: 3000,
  carryForwardAvailable: 0,
  totalSuperBalanceLast30June: 200000,
  useAutoMarginalTaxRate: true,
  manualMarginalTaxRate: 32,
  includeDivision293: false
};

describe("calculateSuperContribution", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2027-07-01T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calculates cap remaining when under cap", () => {
    const result = calculateSuperContribution(baseInputs);
    expect(result.contributionRoom.capYearLabel).toBe(APP_FINANCIAL_YEAR);
    expect(result.contributionRoom.totalConcessionalUsed).toBe(20000);
    expect(result.contributionRoom.effectiveConcessionalCap).toBe(30000);
    expect(result.contributionRoom.capRemaining).toBe(10000);
    expect(result.contributionRoom.overCapBy).toBe(0);
  });

  it("calculates over cap amount when exceeded", () => {
    const result = calculateSuperContribution({
      ...baseInputs,
      plannedSalarySacrifice: 15000,
      plannedLumpSumDeductible: 8000
    });
    expect(result.contributionRoom.overCapBy).toBe(6000);
  });

  it("applies division 293 estimate when enabled", () => {
    const result = calculateSuperContribution({
      ...baseInputs,
      includeDivision293: true
    });
    expect(result.taxImpact.division293Tax).toBe(1050);
    expect(result.taxImpact.totalContributionTax).toBe(2100);
  });

  it("uses carry-forward cap when eligible by balance", () => {
    const result = calculateSuperContribution({
      ...baseInputs,
      carryForwardAvailable: 12000
    });
    expect(result.contributionRoom.effectiveConcessionalCap).toBe(42000);
    expect(result.contributionRoom.capRemaining).toBe(22000);
  });

  it("auto-calculates marginal tax rate from income", () => {
    const result = calculateSuperContribution({
      ...baseInputs,
      annualIncome: 130000,
      useAutoMarginalTaxRate: true,
      manualMarginalTaxRate: 10
    });
    expect(result.taxImpact.marginalTaxRateUsed).toBe(30);
  });

  it("adds carry-forward on top of the fixed financial year concessional cap", () => {
    const result = calculateSuperContribution({
      ...baseInputs,
      carryForwardAvailable: 10000
    });
    expect(result.contributionRoom.effectiveConcessionalCap).toBe(40000);
  });

  it("computes salary sacrifice per payment to use remaining concessional cap", () => {
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    const result = calculateSuperContribution({
      ...baseInputs,
      salarySacrificeProjectionFrequency: "fortnightly"
    });

    expect(result.salarySacrificeCapFill.paymentsRemaining).toBe(13);
    expect(result.salarySacrificeCapFill.remainingConcessionalDollars).toBe(0);
    expect(result.salarySacrificeCapFill.maxSalarySacrificePerPayment).toBe(0);
    expect(result.salarySacrificeCapFill.impliedTotalSalarySacrifice).toBe(0);
    expect(result.salarySacrificeCapFill.shortfallDueToRounding).toBe(0);
  });

  it("projects employer SG to EOFY from payment schedule", () => {
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    const result = calculateSuperContribution({
      ...baseInputs,
      sgPaymentFrequency: "fortnightly",
      sgPaymentAmount: 1000
    });

    expect(result.sgProjection.enabled).toBe(true);
    expect(result.sgProjection.paymentsRemainingToEofy).toBe(13);
    expect(result.sgProjection.projectedAdditionalEmployerSg).toBe(13000);
    expect(result.sgProjection.projectedEmployerSgTotal).toBe(24000);
    expect(result.contributionRoom.totalConcessionalUsed).toBe(33000);
    expect(result.contributionRoom.overCapBy).toBe(3000);
  });
});
