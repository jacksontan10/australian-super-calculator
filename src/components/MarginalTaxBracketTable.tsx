import { RESIDENT_MARGINAL_RATE_TABLE } from "../calculator/marginalTaxBrackets";

export const MarginalTaxBracketTable = () => (
  <table className="info-tooltip__table">
    <caption className="info-tooltip__table-caption">
      Simplified rates used in this calculator for personal tax saved (not full income tax)
    </caption>
    <thead>
      <tr>
        <th scope="col">Taxable income (approximate)</th>
        <th scope="col">Rate applied</th>
      </tr>
    </thead>
    <tbody>
      {RESIDENT_MARGINAL_RATE_TABLE.map((row) => (
        <tr key={row.incomeRange}>
          <td>{row.incomeRange}</td>
          <td>{row.rateLabel}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
