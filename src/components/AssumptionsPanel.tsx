interface AssumptionsPanelProps {
  capSourceUrl: string;
  capDataLastVerifiedDate: string;
}

export const AssumptionsPanel = ({ capSourceUrl, capDataLastVerifiedDate }: AssumptionsPanelProps) => {
  return (
    <section className="card print-muted">
      <h2>Assumptions and Notes</h2>
      <ul>
        <li>This calculator is an educational estimate, not personal financial advice.</li>
        <li>
          Concessional contributions generally include employer super guarantee, salary sacrifice,
          and personal deductible contributions.
        </li>
        <li>
          This calculator does not estimate personal income tax, contributions tax, or Division 293;
          it focuses on concessional cap headroom and payment timing.
        </li>
        <li>
          Carry-forward concessional cap is entered by you and only applied when total super balance
          on the prior 30 June is below five hundred thousand dollars (simple check only).
        </li>
        <li>
          For lump-sum deductible contributions, ensure your fund accepts your notice of intent to
          claim a deduction before you lodge your tax return.
        </li>
        <li>
          If you plan to use voluntary contributions toward the First Home Super Saver scheme, the
          ATO applies additional caps (about fifteen thousand dollars of eligible contributions per
          financial year and about fifty thousand dollars in total from 1 July 2017) on top of the
          general concessional cap. This app only compares your entered salary sacrifice and lump-sum
          amounts to those FHSS figures as a rough educational check.
        </li>
        <li>
          FHSS eligibility, ordering between concessional and non-concessional amounts, and what
          counts as releasable are not modelled here—use the ATO and your fund for definitive rules.
        </li>
      </ul>
      <p>
        Australian Taxation Office cap data source:{" "}
        <a href={capSourceUrl} target="_blank" rel="noreferrer">
          key superannuation rates and thresholds
        </a>{" "}
        (last verified {capDataLastVerifiedDate}).
      </p>
    </section>
  );
};
