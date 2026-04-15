import { useId } from "react";
import type { SuperInputs } from "../calculator/types";
import { APP_FINANCIAL_YEAR, getCapForYear } from "../calculator/atoCapData";
import { CurrencyField } from "./CurrencyField";
import { InfoTooltip } from "./InfoTooltip";
import { FhssContributionNotice } from "./FhssContributionNotice";

interface InputFormProps {
  values: SuperInputs;
  onChange: (next: SuperInputs) => void;
  concessionalOverCapBy: number;
}

const MYGOV_URL = "https://my.gov.au/";
const ATO_URL = "https://www.ato.gov.au/";

export const InputForm = ({ values, onChange, concessionalOverCapBy }: InputFormProps) => {
  const id = useId().replace(/:/g, "");
  const selectedCapEntry = getCapForYear(APP_FINANCIAL_YEAR);

  const updateField = <K extends keyof SuperInputs>(field: K, value: SuperInputs[K]) => {
    onChange({ ...values, [field]: value });
  };

  return (
    <section className="card">
      <h2>Your Inputs</h2>

      <div className="input-cluster">
        <h3 className="input-cluster__title">Your super fund (website or app)</h3>
        <p className="input-cluster__source">
          Use your fund&apos;s member portal or app to see employer contributions received so far this
          financial year, how often deposits arrive, and typical amounts per deposit—then match those
          to the fields here. Your pay advice can also help with amounts per pay cycle.
        </p>
        <div className="grid">
          <div className="field">
            <span className="label-row">
              <label className="field-label" htmlFor={`${id}-employer-sg-ytd`}>
                Employer super guarantee paid to date
              </label>
              <InfoTooltip label="Employer super guarantee paid to date">
                <p>
                  Enter what your employer has <strong>already paid</strong> into super for you this
                  financial year (year-to-date). For the cap, this app also projects a{" "}
                  <strong>total employer super guarantee to 30 June</strong> using the payment frequency
                  and amount per payment below.
                </p>
                <span className="info-tooltip__formula">
                  total to 30 June = year-to-date paid + (remaining payments × amount per payment)
                </span>
              </InfoTooltip>
            </span>
            <CurrencyField
              id={`${id}-employer-sg-ytd`}
              value={values.employerSgContributions}
              onChange={(next) => updateField("employerSgContributions", next)}
            />
          </div>
          <div className="field">
            <span className="label-row">
              <label className="field-label" htmlFor={`${id}-sg-frequency`}>
                Super guarantee payment frequency
              </label>
              <InfoTooltip label="Super guarantee payment frequency" align="start">
                <p>
                  How often your employer pays super guarantee into your fund. Together with the amount
                  per payment, the calculator estimates how many payments are still due before 30 June
                  and adds them on top of your year-to-date amount.
                </p>
                <span className="info-tooltip__formula">
                  days left = end of financial year − today{"\n"}
                  payments left = floor(days left ÷ days between payments) + 1{"\n"}
                  extra super guarantee = payments left × amount per payment{"\n"}
                  projected total = year to date + extra super guarantee
                </span>
                <span className="info-tooltip__muted">
                  Uses average days per interval: weekly 7, fortnightly 14, monthly about 30.44,
                  quarterly about 91.31.
                </span>
                <p>
                  The same interval is used to estimate how many <strong>salary sacrifice</strong> pay
                  dates remain for the &quot;Salary sacrifice to use remaining cap&quot; section (this
                  calculator assumes salary sacrifice runs on the same cycle as your super guarantee
                  payments).
                </p>
              </InfoTooltip>
            </span>
            <select
              id={`${id}-sg-frequency`}
              value={values.sgPaymentFrequency}
              onChange={(event) =>
                updateField("sgPaymentFrequency", event.target.value as SuperInputs["sgPaymentFrequency"])
              }
            >
              <option value="weekly">Weekly</option>
              <option value="fortnightly">Fortnightly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
          <div className="field">
            <span className="label-row">
              <label className="field-label" htmlFor={`${id}-sg-amount`}>
                Super guarantee amount per payment
              </label>
              <InfoTooltip label="Super guarantee amount per payment">
                <p>
                  The amount your employer pays into super each pay cycle (as shown on your pay
                  advice). It is multiplied by the number of remaining payments in the projection.
                </p>
                <span className="info-tooltip__formula">
                  extra super guarantee = payments left × amount per payment
                </span>
              </InfoTooltip>
            </span>
            <CurrencyField
              id={`${id}-sg-amount`}
              value={values.sgPaymentAmount}
              onChange={(next) => updateField("sgPaymentAmount", next)}
            />
          </div>
        </div>
      </div>

      <div className="input-cluster">
        <h3 className="input-cluster__title">Your employer (agreement or payroll)</h3>
        <p className="input-cluster__source">
          Check your salary sacrifice agreement with your employer and your payslips for amounts already
          committed or deducted for this financial year.
        </p>
        <div className="grid">
          <div className="field">
            <span className="label-row">
              <label className="field-label" htmlFor={`${id}-existing-salary-sacrifice`}>
                Total salary sacrifice already arranged
              </label>
              <InfoTooltip label="Total salary sacrifice already arranged">
                <p>
                  Total dollars for salary sacrifice you have <strong>already arranged</strong> with
                  payroll toward this financial year&apos;s concessional cap (for example year-to-date
                  deducted on payslips plus any later pay runs you have already locked in). Unlike
                  employer super guarantee, this app does <strong>not</strong> project this line to 30
                  June—include future committed pays in the figure yourself.
                </p>
                <span className="info-tooltip__formula">
                  total used = projected employer super + this field + planned lump sum
                </span>
              </InfoTooltip>
            </span>
            <CurrencyField
              id={`${id}-existing-salary-sacrifice`}
              value={values.existingSalarySacrifice}
              onChange={(next) => updateField("existingSalarySacrifice", next)}
            />
          </div>
        </div>
      </div>

      <div className="input-cluster">
        <h3 className="input-cluster__title">Your own plans</h3>
        <p className="input-cluster__source">
          Personal contributions you intend to make and claim as a tax deduction—confirm rules, caps,
          and notices with your super fund and the ATO before acting.
        </p>
        <div className="grid">
          <div className="field">
            <span className="label-row">
              <label className="field-label" htmlFor={`${id}-lump-sum`}>
                Lump-sum deductible contribution (planned)
              </label>
              <InfoTooltip label="Planned lump-sum deductible contribution">
                <p>
                  A personal contribution you plan to claim as a tax deduction. Your fund must accept
                  a valid notice of intent before you lodge your tax return (Australian Taxation Office
                  rules).
                </p>
                <span className="info-tooltip__formula">
                  Counts toward your concessional cap in this calculator together with projected employer
                  super and salary sacrifice already arranged.
                </span>
              </InfoTooltip>
            </span>
            <CurrencyField
              id={`${id}-lump-sum`}
              value={values.plannedLumpSumDeductible}
              onChange={(next) => updateField("plannedLumpSumDeductible", next)}
            />
          </div>
        </div>
      </div>

      <div className="input-cluster">
        <FhssContributionNotice values={values} concessionalOverCapBy={concessionalOverCapBy} />
      </div>

      <div className="input-cluster">
        <h3 className="input-cluster__title">Australian Taxation Office (e.g. via myGov)</h3>
        <p className="input-cluster__source">
          Unused carry-forward concessional cap and your total super balance on the prior 30 June are on
          ATO Online—open{" "}
          <a href={MYGOV_URL} target="_blank" rel="noopener noreferrer">
            myGov
          </a>{" "}
          and the linked ATO service, or browse{" "}
          <a href={ATO_URL} target="_blank" rel="noopener noreferrer">
            ato.gov.au
          </a>
          . Your tax agent can provide the same figures.
        </p>
        <div className="grid">
          <div className="field">
            <span className="label-row">
              <label className="field-label" htmlFor={`${id}-carry-forward`}>
                Carry-forward concessional cap available
              </label>
              <InfoTooltip label="Carry-forward concessional cap">
                <p>
                  Unused concessional cap you may carry forward from earlier years (Australian Taxation
                  Office eligibility applies). The amount you can use is held in your tax records.
                </p>
                <p>
                  You can check unused concessional cap amounts through{" "}
                  <a href={MYGOV_URL} target="_blank" rel="noopener noreferrer">
                    myGov
                  </a>{" "}
                  (linked to the Australian Taxation Office) or your tax agent.
                </p>
                <span className="info-tooltip__formula">
                  {`If 0 < total super balance (last 30 June) < $500,000:\n`}
                  {`effective cap = base cap + carry-forward entered\n`}
                  {`Otherwise carry-forward is not applied (warning shown)`}
                </span>
              </InfoTooltip>
            </span>
            <CurrencyField
              id={`${id}-carry-forward`}
              value={values.carryForwardAvailable}
              onChange={(next) => updateField("carryForwardAvailable", next)}
            />
          </div>
          <div className="field">
            <span className="label-row">
              <label className="field-label" htmlFor={`${id}-total-super-balance`}>
                Total super balance (last 30 June)
              </label>
              <InfoTooltip label="Total super balance">
                <p>
                  <strong>Total super balance</strong> is the total value of your super interests at a
                  point in time, as defined by the Australian Taxation Office. Here it is only used for
                  a simple check on whether carry-forward concessional cap is applied in this
                  calculator.
                </p>
                <span className="info-tooltip__formula">
                  Carry-forward is added only if total super balance is greater than zero and below
                  five hundred thousand dollars on the prior 30 June.
                </span>
              </InfoTooltip>
            </span>
            <CurrencyField
              id={`${id}-total-super-balance`}
              value={values.totalSuperBalanceLast30June}
              onChange={(next) => updateField("totalSuperBalanceLast30June", next)}
            />
          </div>
        </div>
      </div>

      <div className="input-cluster">
        <h3 className="input-cluster__title">Fixed in this calculator</h3>
        <p className="input-cluster__source">
          The financial year and concessional cap figure below come from this app&apos;s in-built ATO
          snapshot, not from your fund or the live ATO website.
        </p>
        <div className="grid">
          <div className="field">
            <span className="label-row">
              <label className="field-label" htmlFor={`${id}-financial-year`}>
                Financial year
              </label>
              <InfoTooltip label="Financial year">
                <p>
                  This calculator is fixed to the {APP_FINANCIAL_YEAR} financial year for the
                  in-app Australian Taxation Office snapshot (concessional cap, Division 293 threshold,
                  and projection to 30 June of the second calendar year in the label).
                </p>
              </InfoTooltip>
            </span>
            <input
              id={`${id}-financial-year`}
              type="text"
              readOnly
              tabIndex={-1}
              aria-readonly="true"
              value={APP_FINANCIAL_YEAR}
            />
            <small className="field-help">
              Concessional cap for {APP_FINANCIAL_YEAR}:{" "}
              {selectedCapEntry
                ? selectedCapEntry.concessionalCap.toLocaleString("en-AU", {
                    style: "currency",
                    currency: "AUD",
                    maximumFractionDigits: 0
                  })
                : "Not found"}
            </small>
          </div>
        </div>
      </div>
    </section>
  );
};
