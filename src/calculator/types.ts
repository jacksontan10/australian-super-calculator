export type SgPaymentFrequency = "weekly" | "fortnightly" | "monthly" | "quarterly";

export interface SuperInputs {
  annualIncome: number;
  employerSgContributions: number;
  sgPaymentFrequency: SgPaymentFrequency;
  sgPaymentAmount: number;
  existingSalarySacrifice: number;
  plannedSalarySacrifice: number;
  /** Pay cycle for the “fill remaining cap” salary sacrifice calculator (independent of super guarantee frequency). */
  salarySacrificeProjectionFrequency: SgPaymentFrequency;
  plannedLumpSumDeductible: number;
  carryForwardAvailable: number;
  totalSuperBalanceLast30June: number;
  useAutoMarginalTaxRate: boolean;
  manualMarginalTaxRate: number;
  includeDivision293: boolean;
}

export interface ContributionRoomResult {
  capYearLabel: string;
  capSourceUrl: string;
  capDataLastVerifiedDate: string;
  effectiveConcessionalCap: number;
  totalConcessionalUsed: number;
  capRemaining: number;
  overCapBy: number;
}

export interface TaxImpactResult {
  marginalTaxRateUsed: number;
  taxableIncomeReduction: number;
  fundContributionsTax: number;
  division293Tax: number;
  totalContributionTax: number;
  estimatedPersonalTaxSaved: number;
  netTaxBenefit: number;
  /** Income threshold from ATO snapshot for the selected year (Division 293 context). */
  division293IncomeThreshold: number;
  /** Planned salary sacrifice plus planned lump sum used for tax estimates in this app. */
  plannedConcessionalForTax: number;
}

export interface SgProjectionResult {
  enabled: boolean;
  eofyDateIso: string;
  paymentsRemainingToEofy: number;
  projectedAdditionalEmployerSg: number;
  projectedEmployerSgTotal: number;
}

export interface SalarySacrificeCapFillResult {
  eofyDateIso: string;
  paymentsRemaining: number;
  frequency: SgPaymentFrequency;
  /** Same as cap remaining: headroom under effective cap with current projections and planned amounts. */
  remainingConcessionalDollars: number;
  /** Largest per-payment salary sacrifice (rounded down to cents) so payments × count does not exceed headroom. */
  maxSalarySacrificePerPayment: number;
  impliedTotalSalarySacrifice: number;
  shortfallDueToRounding: number;
}

export interface SuperCalculationResult {
  dataDisclaimer?: string;
  contributionRoom: ContributionRoomResult;
  sgProjection: SgProjectionResult;
  salarySacrificeCapFill: SalarySacrificeCapFillResult;
  taxImpact: TaxImpactResult;
  warnings: string[];
}
