import { useEffect, useMemo, useRef, useState } from "react";
import { APP_FINANCIAL_YEAR, getCapForYear } from "./calculator/atoCapData";
import { calculateSuperContribution, getAutoMarginalTaxRate } from "./calculator/superCalculator";
import type { SuperInputs } from "./calculator/types";
import { AssumptionsPanel } from "./components/AssumptionsPanel";
import { InputForm } from "./components/InputForm";
import { ResultsSummary } from "./components/ResultsSummary";
import { SalarySacrificeCapFill } from "./components/SalarySacrificeCapFill";

const recommendedDivision293 = (annualIncome: number): boolean => {
  const threshold = getCapForYear(APP_FINANCIAL_YEAR)?.division293Threshold ?? 250000;
  return annualIncome >= threshold;
};

const DEFAULT_INCOME = 100000;

const DEFAULT_INPUTS: SuperInputs = {
  annualIncome: DEFAULT_INCOME,
  employerSgContributions: 11500,
  sgPaymentFrequency: "fortnightly",
  sgPaymentAmount: 1000,
  existingSalarySacrifice: 0,
  plannedSalarySacrifice: 5000,
  salarySacrificeProjectionFrequency: "fortnightly",
  plannedLumpSumDeductible: 0,
  carryForwardAvailable: 0,
  totalSuperBalanceLast30June: 200000,
  useAutoMarginalTaxRate: true,
  manualMarginalTaxRate: getAutoMarginalTaxRate(DEFAULT_INCOME),
  includeDivision293: recommendedDivision293(DEFAULT_INCOME)
};

const INPUT_STORAGE_KEY = "super-calculator-inputs-v1";

const getInitialInputs = (): SuperInputs => {
  if (typeof window === "undefined") {
    return DEFAULT_INPUTS;
  }

  const stored = window.localStorage.getItem(INPUT_STORAGE_KEY);
  if (!stored) {
    return DEFAULT_INPUTS;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<
      SuperInputs & {
        selectedFinancialYear?: string;
        fhssVoluntaryConcessionalThisYear?: number;
        fhssVoluntaryNonConcessionalThisYear?: number;
        fhssEligibleContributionsPriorYearsToward50k?: number;
        useProjectedEmployerSg?: boolean;
      }
    >;
    const {
      selectedFinancialYear: _removed,
      fhssVoluntaryConcessionalThisYear: _fhCc,
      fhssVoluntaryNonConcessionalThisYear: _fhNcc,
      fhssEligibleContributionsPriorYearsToward50k: _fhPrior,
      useProjectedEmployerSg: _legacyProjection,
      ...rest
    } = parsed;
    return { ...DEFAULT_INPUTS, ...rest };
  } catch {
    return DEFAULT_INPUTS;
  }
};

interface AppProps {
  onBackHome?: () => void;
}

const App = ({ onBackHome }: AppProps) => {
  const [inputs, setInputs] = useState<SuperInputs>(getInitialInputs);
  const division293UserTouchedRef = useRef(false);
  const result = useMemo(() => calculateSuperContribution(inputs), [inputs]);
  const plannedTotal = inputs.plannedSalarySacrifice + inputs.plannedLumpSumDeductible;
  const inputValidationMessage =
    !inputs.useAutoMarginalTaxRate && inputs.manualMarginalTaxRate > 47
      ? "Marginal tax rate is above typical individual ranges; please confirm your input."
      : plannedTotal > result.contributionRoom.effectiveConcessionalCap
        ? "Your planned additional contributions exceed the annual cap on their own."
        : null;

  useEffect(() => {
    division293UserTouchedRef.current = false;
  }, [inputs.annualIncome]);

  useEffect(() => {
    const autoRate = getAutoMarginalTaxRate(inputs.annualIncome);
    const recommendedDiv293 = recommendedDivision293(inputs.annualIncome);
    setInputs((prev) => {
      const nextDiv293 = division293UserTouchedRef.current
        ? prev.includeDivision293
        : recommendedDiv293;
      if (prev.manualMarginalTaxRate === autoRate && prev.includeDivision293 === nextDiv293) {
        return prev;
      }
      return { ...prev, manualMarginalTaxRate: autoRate, includeDivision293: nextDiv293 };
    });
  }, [inputs.annualIncome]);

  useEffect(() => {
    window.localStorage.setItem(INPUT_STORAGE_KEY, JSON.stringify(inputs));
  }, [inputs]);

  const handleInputsChange = (next: SuperInputs) => {
    if (next.includeDivision293 !== inputs.includeDivision293) {
      division293UserTouchedRef.current = true;
    }
    setInputs(next);
  };

  const handleReset = () => {
    division293UserTouchedRef.current = false;
    setInputs(DEFAULT_INPUTS);
    window.localStorage.removeItem(INPUT_STORAGE_KEY);
  };

  return (
    <main className="container calculator-skin">
      <header className="hero">
        {onBackHome ? (
          <div className="hero__back-row">
            <button type="button" className="hero-back-button" onClick={onBackHome}>
              ← Back to welcome
            </button>
          </div>
        ) : null}
        <h1>Australian Super Contribution Calculator</h1>
        <div className="header-actions">
          <button className="secondary-button" type="button" onClick={handleReset}>
            Reset Inputs
          </button>
        </div>
        <p className="save-note">Inputs auto-save in this browser.</p>
      </header>
      {inputValidationMessage ? <p className="inline-warning">{inputValidationMessage}</p> : null}
      <InputForm
        values={inputs}
        onChange={handleInputsChange}
        concessionalOverCapBy={result.contributionRoom.overCapBy}
      />
      <ResultsSummary result={result} inputs={inputs} />
      <SalarySacrificeCapFill fill={result.salarySacrificeCapFill} />
      <AssumptionsPanel
        capSourceUrl={result.contributionRoom.capSourceUrl}
        capDataLastVerifiedDate={result.contributionRoom.capDataLastVerifiedDate}
      />
    </main>
  );
};

export default App;
