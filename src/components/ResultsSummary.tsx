import { exceedsFhssAnnualEligibleCapModel, getVoluntaryConcessionalModelTotal } from "../calculator/fhssCaps";
import type { SuperCalculationResult, SuperInputs } from "../calculator/types";
import { InfoTooltip } from "./InfoTooltip";

interface ResultsSummaryProps {
  result: SuperCalculationResult;
  inputs: SuperInputs;
}

const dollars = (value: number): string =>
  value.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 2 });

export const ResultsSummary = ({ result, inputs }: ResultsSummaryProps) => {
  const { contributionRoom, sgProjection } = result;
  const voluntaryCcModel = getVoluntaryConcessionalModelTotal(inputs);
  const fhssAnnualRisk = exceedsFhssAnnualEligibleCapModel(inputs);
  const concessionalBreached = contributionRoom.overCapBy > 0;

  return (
    <section className="card">
      <h2>Contribution summary</h2>
      <div className="stats">
        <div>
          <span className="stat-label">
            Cap year
            <InfoTooltip label="Cap year">
              <p>
                The financial year label for the concessional cap row taken from this app’s
                Australian Taxation Office snapshot table.
              </p>
            </InfoTooltip>
          </span>
          <strong>{contributionRoom.capYearLabel}</strong>
        </div>
        <div>
          <span className="stat-label">
            Effective concessional cap
            <InfoTooltip label="Effective concessional cap">
              <p>
                Base concessional cap for <strong>{contributionRoom.capYearLabel}</strong> from this app&apos;s snapshot,
                plus carry-forward you entered only when prior-30 June TSB is above zero and under{" "}
                <strong>$500,000</strong>; otherwise carry-forward is ignored here.
              </p>
              <span className="info-tooltip__formula">
                {`effective cap = base cap (${contributionRoom.capYearLabel})\n`}
                {`+ carry-forward if 0 < TSB (prior 30 June) < $500k\n`}
                {`else base cap only`}
              </span>
            </InfoTooltip>
          </span>
          <strong>{dollars(contributionRoom.effectiveConcessionalCap)}</strong>
        </div>
        <div>
          <span className="stat-label">
            Total projected concessional contributions to end of financial year
            <InfoTooltip label="Total projected concessional contributions">
              <p>
                Sum of projected employer super guarantee to 30 June, total salary sacrifice already
                arranged, and planned lump-sum deductible contributions.
              </p>
              <span className="info-tooltip__formula">
                total = projected employer super total + salary sacrifice already arranged{"\n"}
                + planned lump sum
              </span>
            </InfoTooltip>
          </span>
          <strong>{dollars(contributionRoom.totalConcessionalUsed)}</strong>
        </div>
        <div>
          <span className="stat-label">
            Projected employer super guarantee to end of financial year
            <InfoTooltip label="Projected employer super guarantee" align="start">
              <p>
                Employer super guarantee counted toward the cap: your year-to-date amount plus any
                projected remaining payments before 30 June from your payment frequency and amount
                per payment in the inputs.
              </p>
              <span className="info-tooltip__formula">
                projected total = year to date + (payments left × amount per payment){"\n"}
                or year to date only if the year has already ended in this model
              </span>
            </InfoTooltip>
          </span>
          <strong>{dollars(sgProjection.projectedEmployerSgTotal)}</strong>
        </div>
        <div>
          <span className="stat-label">
            Cap remaining
            <InfoTooltip label="Cap remaining">
              <p>
                Headroom under the effective concessional cap after all projected concessional
                amounts in this model.
              </p>
              <span className="info-tooltip__formula">
                cap remaining = max(0, effective cap − total projected concessional)
              </span>
            </InfoTooltip>
          </span>
          <strong>{dollars(contributionRoom.capRemaining)}</strong>
        </div>
        <div>
          <span className="stat-label">
            Over cap estimate
            <InfoTooltip label="Over cap estimate">
              <p>How much projected concessional contributions exceed the effective cap (zero if under).</p>
              <span className="info-tooltip__formula">
                over cap = max(0, total projected concessional − effective cap)
              </span>
            </InfoTooltip>
          </span>
          <strong>{dollars(contributionRoom.overCapBy)}</strong>
        </div>
      </div>
      {fhssAnnualRisk || concessionalBreached ? (
        <div className="note-panel note-panel--caution" role="status">
          <p>
            <strong>FHSS / cap cross-check:</strong>{" "}
            {voluntaryCcModel > 0 ? (
              <>
                Voluntary concessional entries in this model total{" "}
                <strong>{dollars(voluntaryCcModel)}</strong>
                {fhssAnnualRisk ? (
                  <>
                    , which is above the usual <strong>$15,000</strong> per financial year that can count
                    toward FHSS eligible contributions if you intend to use the scheme that way (confirm
                    eligibility with the ATO).
                  </>
                ) : (
                  <>
                    , at or below that simplified FHSS per-year comparison if those amounts were fully
                    eligible and counted that way.
                  </>
                )}
              </>
            ) : (
              <>
                You have no salary sacrifice or planned lump sum in the inputs; FHSS still has its own
                annual and total eligible caps if you add voluntary contributions for the scheme.
              </>
            )}
            {concessionalBreached ? (
              <>
                {" "}
                This run is over the <strong>general concessional cap</strong> by about{" "}
                <strong>{dollars(contributionRoom.overCapBy)}</strong>, which is separate from FHSS
                limits.
              </>
            ) : null}
          </p>
        </div>
      ) : null}
      {result.warnings.length > 0 ? (
        <ul className="warnings" role="status">
          {result.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      ) : null}
      {sgProjection.eofyDateIso ? (
        <p className="projection-note">
          {sgProjection.paymentsRemainingToEofy > 0 ? (
            <>
              Projection uses {sgProjection.paymentsRemainingToEofy} remaining employer super
              guarantee payments before 30 June ({sgProjection.eofyDateIso}), adding{" "}
              {dollars(sgProjection.projectedAdditionalEmployerSg)}.
            </>
          ) : (
            <>
              No further employer super guarantee payments fall before 30 June ({sgProjection.eofyDateIso}) in
              this model—only your year-to-date amount is counted toward the cap.
            </>
          )}
        </p>
      ) : null}
      {result.dataDisclaimer ? <p className="data-disclaimer">{result.dataDisclaimer}</p> : null}
    </section>
  );
};
