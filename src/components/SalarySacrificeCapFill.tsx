import {
  FHSS_ANNUAL_ELIGIBLE_CONTRIBUTIONS_CAP,
  FHSS_ATO_SCHEME_URL,
  FHSS_TOTAL_ELIGIBLE_CONTRIBUTIONS_CAP
} from "../calculator/fhssCaps";
import type { SalarySacrificeCapFillResult, SgPaymentFrequency } from "../calculator/types";
import { InfoTooltip } from "./InfoTooltip";

interface SalarySacrificeCapFillProps {
  fill: SalarySacrificeCapFillResult;
}

const dollars = (value: number): string =>
  value.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 2 });

const frequencyLabel = (f: SgPaymentFrequency): string => {
  switch (f) {
    case "weekly":
      return "Weekly";
    case "fortnightly":
      return "Fortnightly";
    case "monthly":
      return "Monthly";
    case "quarterly":
      return "Quarterly";
    default:
      return f;
  }
};

export const SalarySacrificeCapFill = ({ fill }: SalarySacrificeCapFillProps) => {
  return (
    <section className="card">
      <h2 className="label-row">
        <span>Salary sacrifice to use remaining cap</span>
        <InfoTooltip label="Salary sacrifice cap fill">
          <p>
            Uses the same <strong>cap remaining</strong> as the summary above (effective concessional
            cap minus projected employer super guarantee, total salary sacrifice already arranged, and
            planned lump sum).
          </p>
          <p>
            It divides that headroom across the number of <strong>salary sacrifice payment dates</strong>{" "}
            still expected before <strong>30 June</strong> for the selected financial year, using the
            same <strong>super guarantee payment frequency</strong> from your inputs (this model
            assumes salary sacrifice aligns with that pay cycle).
          </p>
          <span className="info-tooltip__formula">
            per payment = floor(100 × cap remaining ÷ payments left) ÷ 100{"\n"}
            projected total = per payment × payments left{"\n"}
            (per payment is rounded down so the total never exceeds cap remaining)
          </span>
          <p>
            This section only uses your <strong>concessional</strong> headroom. It does not test the
            First Home Super Saver (FHSS) caps; if you use FHSS, read the note under{" "}
            <strong>Your Inputs</strong> as well.
          </p>
        </InfoTooltip>
      </h2>
      <div className="stats">
        <div>
          <span className="stat-label">Remaining concessional room (same as summary)</span>
          <strong>{dollars(fill.remainingConcessionalDollars)}</strong>
        </div>
        <div>
          <span className="stat-label">Payment frequency used</span>
          <strong>{frequencyLabel(fill.frequency)}</strong>
        </div>
        <div>
          <span className="stat-label">Payments left before 30 June</span>
          <strong>{fill.paymentsRemaining}</strong>
        </div>
        <div>
          <span className="stat-label">End of financial year date</span>
          <strong>{fill.eofyDateIso || "—"}</strong>
        </div>
        <div>
          <span className="stat-label">Maximum salary sacrifice per payment</span>
          <strong>{dollars(fill.maxSalarySacrificePerPayment)}</strong>
        </div>
        <div>
          <span className="stat-label">If every payment is that amount</span>
          <strong>{dollars(fill.impliedTotalSalarySacrifice)}</strong>
        </div>
        {fill.shortfallDueToRounding > 0 ? (
          <div>
            <span className="stat-label">Left unused due to rounding to cents</span>
            <strong>{dollars(fill.shortfallDueToRounding)}</strong>
          </div>
        ) : null}
      </div>
      {fill.paymentsRemaining === 0 ? (
        <p className="projection-note">
          No salary sacrifice pay dates remain before the end of the selected financial year (or the
          year could not be read). Try another financial year or check your system date.
        </p>
      ) : fill.remainingConcessionalDollars <= 0 ? (
        <p className="projection-note">
          There is no concessional headroom left under your current numbers. Reduce other
          concessional amounts or raise the effective cap (for example carry-forward) to see a
          non-zero per-payment salary sacrifice here.
        </p>
      ) : (
        <p className="projection-note">
          If you salary sacrifice <strong>{dollars(fill.maxSalarySacrificePerPayment)}</strong> on each
          of the <strong>{fill.paymentsRemaining}</strong> remaining pay dates at{" "}
          <strong>{frequencyLabel(fill.frequency)}</strong> frequency, you would add about{" "}
          <strong>{dollars(fill.impliedTotalSalarySacrifice)}</strong> toward the cap—staying within the
          remaining room shown (small rounding differences may apply).
        </p>
      )}
      <div className="note-panel note-panel--cap-fill-fhss">
        <p>
          <strong>FHSS:</strong> filling concessional room here does not mean those amounts automatically
          fit the FHSS scheme. The ATO also caps <em>eligible</em> FHSS contributions (about{" "}
          {FHSS_ANNUAL_ELIGIBLE_CONTRIBUTIONS_CAP.toLocaleString("en-AU", {
            style: "currency",
            currency: "AUD",
            maximumFractionDigits: 0
          })}{" "}
          per financial year and about{" "}
          {FHSS_TOTAL_ELIGIBLE_CONTRIBUTIONS_CAP.toLocaleString("en-AU", {
            style: "currency",
            currency: "AUD",
            maximumFractionDigits: 0
          })}{" "}
          in total from 1 July 2017), separate from your concessional cap. See the fuller disclaimer
          under <strong>Your Inputs</strong> and the{" "}
          <a href={FHSS_ATO_SCHEME_URL} target="_blank" rel="noopener noreferrer">
            ATO: First home super saver scheme
          </a>
          .
        </p>
      </div>
    </section>
  );
};
