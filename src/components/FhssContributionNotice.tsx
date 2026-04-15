import { useMemo } from "react";
import {
  FHSS_ANNUAL_ELIGIBLE_CONTRIBUTIONS_CAP,
  FHSS_ATO_SCHEME_URL,
  FHSS_TOTAL_ELIGIBLE_CONTRIBUTIONS_CAP,
  exceedsFhssAnnualEligibleCapModel,
  fhssAnnualEligibleOverByModel,
  getVoluntaryConcessionalModelTotal
} from "../calculator/fhssCaps";
import type { SuperInputs } from "../calculator/types";

const dollars = (value: number): string =>
  value.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

interface FhssContributionNoticeProps {
  values: SuperInputs;
  concessionalOverCapBy: number;
}

export const FhssContributionNotice = ({ values, concessionalOverCapBy }: FhssContributionNoticeProps) => {
  const voluntaryCcTotal = useMemo(() => getVoluntaryConcessionalModelTotal(values), [values]);
  const exceedsFhssAnnual = useMemo(() => exceedsFhssAnnualEligibleCapModel(values), [values]);
  const fhssOverBy = useMemo(() => fhssAnnualEligibleOverByModel(values), [values]);
  const concessionalBreached = concessionalOverCapBy > 0;

  const panelClass =
    exceedsFhssAnnual || concessionalBreached ? "note-panel note-panel--caution" : "note-panel";

  return (
    <div className={panelClass}>
      <p>
        <strong>First Home Super Saver (FHSS):</strong> if you want voluntary contributions to count
        toward the FHSS scheme, the Australian Taxation Office applies a cap of about{" "}
        <strong>{dollars(FHSS_ANNUAL_ELIGIBLE_CONTRIBUTIONS_CAP)}</strong> of{" "}
        <em>eligible</em> contributions per financial year that can count toward FHSS, and about{" "}
        <strong>{dollars(FHSS_TOTAL_ELIGIBLE_CONTRIBUTIONS_CAP)}</strong> in total from 1 July 2017.
        Those limits are separate from your general concessional contributions cap. This calculator
        does not decide which amounts are FHSS-eligible or how they are ordered against the caps.
      </p>
      <p>
        <a href={FHSS_ATO_SCHEME_URL} target="_blank" rel="noopener noreferrer">
          ATO: First home super saver scheme
        </a>
      </p>
      <p>
        For a rough check only, the voluntary concessional fields in this app (salary sacrifice
        already arranged + total new salary sacrifice planned + planned lump sum) add up to{" "}
        <strong>{dollars(voluntaryCcTotal)}</strong>. If you treated that whole amount as eligible
        concessional contributions for FHSS in one year, it would{" "}
        {exceedsFhssAnnual ? (
          <>
            would <strong>exceed</strong> the per-year FHSS eligible figure by about{" "}
            <strong>{dollars(fhssOverBy)}</strong> (confirm eligibility and caps with the ATO and your
            fund).
          </>
        ) : (
          <>not exceed that per-year FHSS eligible figure on its own in this simplified comparison.</>
        )}
      </p>
      {concessionalBreached ? (
        <p>
          Separately, this model shows you are over the <strong>general concessional cap</strong> by
          about <strong>{dollars(concessionalOverCapBy)}</strong>. That excess is a different issue
          from FHSS limits, but both depend on your actual contributions and notices to your fund.
        </p>
      ) : null}
    </div>
  );
};
