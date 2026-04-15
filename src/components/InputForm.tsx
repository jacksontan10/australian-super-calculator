import { useId } from "react";
import type { SuperInputs } from "../calculator/types";
import { APP_FINANCIAL_YEAR, getCapForYear } from "../calculator/atoCapData";
import { CurrencyField } from "./CurrencyField";
import { InfoTooltip } from "./InfoTooltip";
import { MarginalTaxBracketTable } from "./MarginalTaxBracketTable";
import { FhssContributionNotice } from "./FhssContributionNotice";

interface InputFormProps {
  values: SuperInputs;
  onChange: (next: SuperInputs) => void;
  concessionalOverCapBy: number;
}

const toNumber = (raw: string): number => {
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
};

const MYGOV_URL = "https://my.gov.au/";

export const InputForm = ({ values, onChange, concessionalOverCapBy }: InputFormProps) => {
  const id = useId().replace(/:/g, "");
  const selectedCapEntry = getCapForYear(APP_FINANCIAL_YEAR);
  const division293Threshold =
    selectedCapEntry?.division293Threshold ?? 250000;
  const division293ThresholdDisplay = division293Threshold.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0
  });

  const updateField = <K extends keyof SuperInputs>(field: K, value: SuperInputs[K]) => {
    onChange({ ...values, [field]: value });
  };

  return (
    <section className="card">
      <h2>Your Inputs</h2>
      <div className="grid">
        <div className="field">
          <span className="label-row">
            <label className="field-label" htmlFor={`${id}-annual-income`}>
              Annual taxable income
            </label>
            <InfoTooltip label="Annual taxable income">
              <p>
                Your estimated taxable income for the financial year. This drives the optional
                automatic marginal rate and whether Division 293 is suggested by default.
              </p>
              <span className="info-tooltip__muted">
                Educational estimate only; not personal tax advice.
              </span>
            </InfoTooltip>
          </span>
          <CurrencyField
            id={`${id}-annual-income`}
            value={values.annualIncome}
            onChange={(next) => updateField("annualIncome", next)}
          />
        </div>
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
        <div className="field">
          <span className="label-row">
            <label className="field-label" htmlFor={`${id}-existing-salary-sacrifice`}>
              Total salary sacrifice already arranged
            </label>
            <InfoTooltip label="Total salary sacrifice already arranged">
              <p>
                Total dollars for salary sacrifice you have <strong>already arranged</strong> with
                payroll toward this financial year&apos;s concessional cap (for example year-to-date
                deducted on payslips plus any later pay runs you have already locked in),{" "}
                <strong>not</strong> including the separate &quot;total new&quot; field below. Unlike
                employer super guarantee, this app does <strong>not</strong> project this line to 30
                June—include future committed pays in the figure yourself.
              </p>
              <span className="info-tooltip__formula">
                total used = projected employer super + this field + planned salary sacrifice + planned
                lump sum
              </span>
            </InfoTooltip>
          </span>
          <CurrencyField
            id={`${id}-existing-salary-sacrifice`}
            value={values.existingSalarySacrifice}
            onChange={(next) => updateField("existingSalarySacrifice", next)}
          />
          <small className="field-help">
            Not auto-projected to 30 June—enter the full total you treat as already arranged for the year.
          </small>
        </div>
        <div className="field">
          <span className="label-row">
            <label className="field-label" htmlFor={`${id}-planned-salary-sacrifice`}>
              Total new salary sacrifice planned (this financial year)
            </label>
            <InfoTooltip label="Total new salary sacrifice planned">
              <p>
                Total additional pre-tax salary sacrifice you intend for this financial year on top of
                what you counted as already arranged above (for example the full-year extra amount you
                plan to ask payroll for).
              </p>
              <span className="info-tooltip__formula">
                planned concessional (for tax estimate) = this field + planned lump sum{"\n"}
                cap usage includes this plus projected employer super and salary sacrifice already arranged
              </span>
            </InfoTooltip>
          </span>
          <CurrencyField
            id={`${id}-planned-salary-sacrifice`}
            value={values.plannedSalarySacrifice}
            onChange={(next) => updateField("plannedSalarySacrifice", next)}
          />
        </div>
        <div className="field">
          <span className="label-row">
            <label className="field-label" htmlFor={`${id}-salary-sacrifice-proj-frequency`}>
              Salary sacrifice payment frequency (for “fill cap” calculator)
            </label>
            <InfoTooltip label="Salary sacrifice payment frequency for cap fill">
              <p>
                How often you would run salary sacrifice through payroll for the rest of the
                financial year. The “Salary sacrifice to use remaining cap” section divides your{" "}
                <strong>remaining concessional room</strong> by the number of pay dates left before{" "}
                <strong>30 June</strong> at this frequency.
              </p>
              <p>
                This is separate from super guarantee frequency—it should match how often you can
                change salary sacrifice with your employer.
              </p>
            </InfoTooltip>
          </span>
          <select
            id={`${id}-salary-sacrifice-proj-frequency`}
            value={values.salarySacrificeProjectionFrequency}
            onChange={(event) =>
              updateField(
                "salarySacrificeProjectionFrequency",
                event.target.value as SuperInputs["salarySacrificeProjectionFrequency"]
              )
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
                Counts in the same “planned concessional” bucket as salary sacrifice for the tax
                estimate.
              </span>
            </InfoTooltip>
          </span>
          <CurrencyField
            id={`${id}-lump-sum`}
            value={values.plannedLumpSumDeductible}
            onChange={(next) => updateField("plannedLumpSumDeductible", next)}
          />
        </div>
        <FhssContributionNotice values={values} concessionalOverCapBy={concessionalOverCapBy} />
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
        <label className="checkbox">
          <input
            type="checkbox"
            checked={values.useAutoMarginalTaxRate}
            onChange={(event) => updateField("useAutoMarginalTaxRate", event.target.checked)}
          />
          <span className="checkbox__main">
            <span>Auto-calculate marginal tax rate from income</span>
            <InfoTooltip label="Automatic marginal tax rate">
              <p>
                Uses simplified resident brackets to pick one percentage for estimating personal
                income tax saved on planned concessional contributions.
              </p>
              <MarginalTaxBracketTable />
              <span className="info-tooltip__formula">
                personal tax saved ≈ planned salary sacrifice plus planned lump sum × (marginal
                percentage ÷ 100)
              </span>
              <span className="info-tooltip__muted">
                The manual percentage field is updated whenever taxable income changes so it stays
                aligned with this table if you turn auto off.
              </span>
              <span className="info-tooltip__muted">
                Does not include Medicare levy, offsets, or other personal tax rules.
              </span>
            </InfoTooltip>
          </span>
        </label>
        {!values.useAutoMarginalTaxRate ? (
          <div className="field">
            <span className="label-row">
              <label className="field-label" htmlFor={`${id}-manual-marginal`}>
                Manual marginal tax rate (%)
              </label>
              <InfoTooltip label="Manual marginal tax rate">
                <p>Your chosen marginal percentage for the personal tax saved estimate.</p>
                <MarginalTaxBracketTable />
                <span className="info-tooltip__formula">
                  personal tax saved ≈ planned salary sacrifice plus planned lump sum × (manual
                  percentage ÷ 100)
                </span>
              </InfoTooltip>
            </span>
            <input
              id={`${id}-manual-marginal`}
              type="number"
              min={0}
              step={0.5}
              value={values.manualMarginalTaxRate}
              onChange={(event) =>
                updateField("manualMarginalTaxRate", toNumber(event.target.value))
              }
            />
          </div>
        ) : null}
        <label className="checkbox">
          <input
            type="checkbox"
            checked={values.includeDivision293}
            onChange={(event) => updateField("includeDivision293", event.target.checked)}
          />
          <span className="checkbox__main">
            <span>Include Division 293 estimate</span>
            <InfoTooltip label="Division 293 estimate">
              <p>
                <strong>Division 293</strong> is an extra tax that can apply when your income for
                Division 293 purposes and certain concessional contributions together exceed a
                threshold set by the Australian Taxation Office. The real rules are broader than
                this screen; confirm your position with the Australian Taxation Office or a tax
                agent.
              </p>
              <p>
                For the selected financial year, this app uses an income threshold of about{" "}
                <strong>{division293ThresholdDisplay}</strong> from its snapshot table. When this
                option is on, the calculator adds an <strong>extra 15%</strong> of your{" "}
                <em>planned salary sacrifice plus planned lump sum</em> (the same slice already used
                for the 15% contributions tax estimate).
              </p>
              <span className="info-tooltip__formula">
                extra Division 293 tax in this app = 15% × (planned salary sacrifice + planned lump
                sum){"\n"}
                when the toggle is on (in addition to the usual 15% contributions tax on that slice)
              </span>
              <span className="info-tooltip__muted">
                Defaults on when taxable income is at or above that threshold. If you change the
                toggle yourself, it stays until you change income or financial year.
              </span>
            </InfoTooltip>
          </span>
        </label>
      </div>
    </section>
  );
};
