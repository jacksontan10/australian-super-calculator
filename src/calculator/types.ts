export type SgPaymentFrequency = "weekly" | "fortnightly" | "monthly" | "quarterly";

export interface SuperInputs {
  employerSgContributions: number;
  sgPaymentFrequency: SgPaymentFrequency;
  sgPaymentAmount: number;
  existingSalarySacrifice: number;
  plannedLumpSumDeductible: number;
  carryForwardAvailable: number;
  totalSuperBalanceLast30June: number;
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
  warnings: string[];
}
