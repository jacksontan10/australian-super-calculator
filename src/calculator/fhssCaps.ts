import type { SuperInputs } from "./types";

/**
 * ATO First Home Super Saver scheme limits on eligible contributions (verify annually).
 * @see https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/first-home-super-saver-scheme
 */
export const FHSS_ANNUAL_ELIGIBLE_CONTRIBUTIONS_CAP = 15_000;
export const FHSS_TOTAL_ELIGIBLE_CONTRIBUTIONS_CAP = 50_000;

export const FHSS_ATO_SCHEME_URL =
  "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/first-home-super-saver-scheme";

/**
 * Voluntary concessional amounts captured in this app (salary sacrifice and personal deductible).
 * Used only for an educational comparison to the FHSS per-year eligible cap—not eligibility logic.
 */
export const getVoluntaryConcessionalModelTotal = (inputs: SuperInputs): number =>
  Math.max(0, inputs.existingSalarySacrifice + inputs.plannedLumpSumDeductible);

export const exceedsFhssAnnualEligibleCapModel = (inputs: SuperInputs): boolean =>
  getVoluntaryConcessionalModelTotal(inputs) > FHSS_ANNUAL_ELIGIBLE_CONTRIBUTIONS_CAP;

export const fhssAnnualEligibleOverByModel = (inputs: SuperInputs): number =>
  Math.max(0, getVoluntaryConcessionalModelTotal(inputs) - FHSS_ANNUAL_ELIGIBLE_CONTRIBUTIONS_CAP);
