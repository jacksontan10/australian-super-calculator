import { useEffect, useMemo, useState } from "react";
import { calculateSuperContribution } from "./calculator/superCalculator";
import type { SgPaymentFrequency, SuperInputs } from "./calculator/types";
import { AssumptionsPanel } from "./components/AssumptionsPanel";
import { InputForm } from "./components/InputForm";
import { ResultsSummary } from "./components/ResultsSummary";
import { SalarySacrificeCapFill } from "./components/SalarySacrificeCapFill";

const DEFAULT_INPUTS: SuperInputs = {
  employerSgContributions: 11500,
  sgPaymentFrequency: "fortnightly",
  sgPaymentAmount: 1000,
  existingSalarySacrifice: 0,
  plannedLumpSumDeductible: 0,
  carryForwardAvailable: 0,
  totalSuperBalanceLast30June: 200000
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
        plannedSalarySacrifice?: number;
        annualIncome?: number;
        useAutoMarginalTaxRate?: boolean;
        manualMarginalTaxRate?: number;
        includeDivision293?: boolean;
        salarySacrificeProjectionFrequency?: SgPaymentFrequency;
      }
    >;
    const {
      selectedFinancialYear: _removed,
      fhssVoluntaryConcessionalThisYear: _fhCc,
      fhssVoluntaryNonConcessionalThisYear: _fhNcc,
      fhssEligibleContributionsPriorYearsToward50k: _fhPrior,
      useProjectedEmployerSg: _legacyProjection,
      plannedSalarySacrifice: _legacyPlannedSs,
      salarySacrificeProjectionFrequency: _legacySsProjFreq,
      annualIncome: _legacyIncome,
      useAutoMarginalTaxRate: _legacyAutoMtr,
      manualMarginalTaxRate: _legacyManualMtr,
      includeDivision293: _legacyDiv293,
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
  const result = useMemo(() => calculateSuperContribution(inputs), [inputs]);
  const plannedTotal = inputs.plannedLumpSumDeductible;
  const inputValidationMessage =
    plannedTotal > result.contributionRoom.effectiveConcessionalCap
      ? "Your planned additional contributions exceed the annual cap on their own."
      : null;

  useEffect(() => {
    window.localStorage.setItem(INPUT_STORAGE_KEY, JSON.stringify(inputs));
  }, [inputs]);

  const handleReset = () => {
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
        onChange={setInputs}
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
