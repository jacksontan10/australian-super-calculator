import type {
  SgPaymentFrequency,
  SalarySacrificeCapFillResult,
  SuperCalculationResult,
  SuperInputs
} from "./types";
import { APP_FINANCIAL_YEAR, getCapForYear, getDefaultYear } from "./atoCapData";

const CARRY_FORWARD_BALANCE_THRESHOLD = 500000;

const roundCurrency = (value: number): number => Math.round(value * 100) / 100;

const clampNonNegative = (value: number): number => Math.max(0, value);

const FREQUENCY_DAYS: Record<SgPaymentFrequency, number> = {
  weekly: 7,
  fortnightly: 14,
  monthly: 30.4375,
  quarterly: 91.3125
};

const getEofyDateFromLabel = (fyLabel: string): Date | null => {
  const match = /^(\d{4})-(\d{2})$/.exec(fyLabel);
  if (!match) {
    return null;
  }
  const endYear = Number(`20${match[2]}`);
  if (!Number.isFinite(endYear)) {
    return null;
  }
  return new Date(Date.UTC(endYear, 5, 30, 23, 59, 59, 999));
};

const getPaymentsRemainingForYear = (
  fyLabel: string,
  frequency: SgPaymentFrequency
): { payments: number; eofyDateIso: string } => {
  const eofyDate = getEofyDateFromLabel(fyLabel);
  if (!eofyDate) {
    return { payments: 0, eofyDateIso: "" };
  }
  const eofyDateIso = eofyDate.toISOString().slice(0, 10);
  const now = new Date();
  if (now > eofyDate) {
    return { payments: 0, eofyDateIso };
  }
  const daysRemaining = (eofyDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  const intervalDays = FREQUENCY_DAYS[frequency];
  const payments = Math.max(0, Math.floor(daysRemaining / intervalDays) + 1);
  return { payments, eofyDateIso };
};

const calculateSgProjection = (inputs: SuperInputs) => {
  const eofyDate = getEofyDateFromLabel(APP_FINANCIAL_YEAR);
  if (!eofyDate) {
    return {
      enabled: false,
      eofyDateIso: "",
      paymentsRemainingToEofy: 0,
      projectedAdditionalEmployerSg: 0,
      projectedEmployerSgTotal: clampNonNegative(inputs.employerSgContributions)
    };
  }

  const { payments: paymentsRemainingToEofy, eofyDateIso } = getPaymentsRemainingForYear(
    APP_FINANCIAL_YEAR,
    inputs.sgPaymentFrequency
  );

  if (paymentsRemainingToEofy === 0) {
    return {
      enabled: true,
      eofyDateIso,
      paymentsRemainingToEofy: 0,
      projectedAdditionalEmployerSg: 0,
      projectedEmployerSgTotal: clampNonNegative(inputs.employerSgContributions)
    };
  }

  const projectedAdditionalEmployerSg =
    paymentsRemainingToEofy * clampNonNegative(inputs.sgPaymentAmount);

  return {
    enabled: true,
    eofyDateIso,
    paymentsRemainingToEofy,
    projectedAdditionalEmployerSg,
    projectedEmployerSgTotal:
      clampNonNegative(inputs.employerSgContributions) + projectedAdditionalEmployerSg
  };
};

const computeSalarySacrificeCapFill = (
  fyLabel: string,
  frequency: SgPaymentFrequency,
  capRemaining: number
): SalarySacrificeCapFillResult => {
  const { payments, eofyDateIso } = getPaymentsRemainingForYear(fyLabel, frequency);
  const room = clampNonNegative(capRemaining);
  const maxPer =
    payments > 0 ? Math.floor((room * 100) / payments) / 100 : 0;
  const impliedTotal = roundCurrency(maxPer * payments);
  const shortfall = roundCurrency(room - impliedTotal);

  return {
    eofyDateIso,
    paymentsRemaining: payments,
    frequency,
    remainingConcessionalDollars: roundCurrency(room),
    maxSalarySacrificePerPayment: maxPer,
    impliedTotalSalarySacrifice: impliedTotal,
    shortfallDueToRounding: shortfall
  };
};

export const calculateSuperContribution = (inputs: SuperInputs): SuperCalculationResult => {
  const defaultYear = getDefaultYear();
  const selectedYearEntry = getCapForYear(APP_FINANCIAL_YEAR);
  const activeYearEntry = selectedYearEntry ?? getCapForYear(defaultYear);
  const baseConcessionalCap = clampNonNegative(activeYearEntry?.concessionalCap ?? 0);
  const sgProjection = calculateSgProjection(inputs);

  const carryForwardEligible =
    inputs.totalSuperBalanceLast30June > 0 &&
    inputs.totalSuperBalanceLast30June < CARRY_FORWARD_BALANCE_THRESHOLD;
  const effectiveConcessionalCap = baseConcessionalCap +
    (carryForwardEligible ? clampNonNegative(inputs.carryForwardAvailable) : 0);
  const plannedConcessional = clampNonNegative(inputs.plannedLumpSumDeductible);
  const totalConcessionalUsed =
    clampNonNegative(sgProjection.projectedEmployerSgTotal) +
    clampNonNegative(inputs.existingSalarySacrifice) +
    plannedConcessional;
  const capRemaining = clampNonNegative(effectiveConcessionalCap - totalConcessionalUsed);
  const overCapBy = clampNonNegative(totalConcessionalUsed - effectiveConcessionalCap);
  const salarySacrificeCapFill = computeSalarySacrificeCapFill(
    APP_FINANCIAL_YEAR,
    inputs.sgPaymentFrequency,
    capRemaining
  );

  const warnings: string[] = [];
  if (overCapBy > 0) {
    warnings.push(
      `You are estimated to exceed your concessional cap by $${roundCurrency(overCapBy).toLocaleString()}.`
    );
  }
  if (inputs.plannedLumpSumDeductible > 0) {
    warnings.push(
      "Lump-sum deductible contributions require a valid Notice of Intent accepted by your super fund."
    );
  }
  if (!carryForwardEligible && inputs.carryForwardAvailable > 0) {
    warnings.push(
      "Carry-forward cap amount entered but total super balance appears ineligible for carry-forward usage."
    );
  }
  if (inputs.sgPaymentAmount <= 0 && sgProjection.paymentsRemainingToEofy > 0) {
    warnings.push(
      "Super guarantee projection uses your payment schedule but the amount per payment is zero."
    );
  }
  if (sgProjection.eofyDateIso === "") {
    warnings.push(
      "Unable to project super guarantee payments because the selected financial year could not be parsed."
    );
  }
  if (sgProjection.enabled && sgProjection.paymentsRemainingToEofy === 0 && sgProjection.eofyDateIso !== "") {
    warnings.push(
      "No remaining super guarantee payments were projected to the end of financial year for the selected year."
    );
  }
  if (!selectedYearEntry) {
    warnings.push(
      `Cap data for ${APP_FINANCIAL_YEAR} was not found. Using ${defaultYear} cap data instead.`
    );
  }

  return {
    dataDisclaimer: selectedYearEntry
      ? undefined
      : `Financial year ${APP_FINANCIAL_YEAR} not found in local ATO dataset; fallback year ${defaultYear} applied.`,
    contributionRoom: {
      capYearLabel: activeYearEntry?.fyLabel ?? defaultYear,
      capSourceUrl: activeYearEntry?.sourceUrl ?? "",
      capDataLastVerifiedDate: activeYearEntry?.lastVerifiedDate ?? "",
      effectiveConcessionalCap: roundCurrency(effectiveConcessionalCap),
      totalConcessionalUsed: roundCurrency(totalConcessionalUsed),
      capRemaining: roundCurrency(capRemaining),
      overCapBy: roundCurrency(overCapBy)
    },
    sgProjection: {
      enabled: sgProjection.enabled,
      eofyDateIso: sgProjection.eofyDateIso,
      paymentsRemainingToEofy: sgProjection.paymentsRemainingToEofy,
      projectedAdditionalEmployerSg: roundCurrency(sgProjection.projectedAdditionalEmployerSg),
      projectedEmployerSgTotal: roundCurrency(sgProjection.projectedEmployerSgTotal)
    },
    salarySacrificeCapFill,
    warnings
  };
};
