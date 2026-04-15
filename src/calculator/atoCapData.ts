export interface AtoCapYearEntry {
  fyLabel: string;
  concessionalCap: number;
  division293Threshold: number;
  sourceUrl: string;
  lastVerifiedDate: string;
}

const ATO_SUPER_CAPS_SOURCE_URL =
  "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/contributions-caps";

const LAST_VERIFIED_DATE = "2026-04-15";

/** Financial year this build of the calculator uses for caps, projections, and tax thresholds. */
export const APP_FINANCIAL_YEAR = "2025-26" as const;

const ATO_CAP_HISTORY: AtoCapYearEntry[] = [
  {
    fyLabel: "2020-21",
    concessionalCap: 25000,
    division293Threshold: 250000,
    sourceUrl: ATO_SUPER_CAPS_SOURCE_URL,
    lastVerifiedDate: LAST_VERIFIED_DATE
  },
  {
    fyLabel: "2021-22",
    concessionalCap: 27500,
    division293Threshold: 250000,
    sourceUrl: ATO_SUPER_CAPS_SOURCE_URL,
    lastVerifiedDate: LAST_VERIFIED_DATE
  },
  {
    fyLabel: "2022-23",
    concessionalCap: 27500,
    division293Threshold: 250000,
    sourceUrl: ATO_SUPER_CAPS_SOURCE_URL,
    lastVerifiedDate: LAST_VERIFIED_DATE
  },
  {
    fyLabel: "2023-24",
    concessionalCap: 27500,
    division293Threshold: 250000,
    sourceUrl: ATO_SUPER_CAPS_SOURCE_URL,
    lastVerifiedDate: LAST_VERIFIED_DATE
  },
  {
    fyLabel: "2024-25",
    concessionalCap: 30000,
    division293Threshold: 250000,
    sourceUrl: ATO_SUPER_CAPS_SOURCE_URL,
    lastVerifiedDate: LAST_VERIFIED_DATE
  },
  {
    fyLabel: "2025-26",
    concessionalCap: 30000,
    division293Threshold: 250000,
    sourceUrl: ATO_SUPER_CAPS_SOURCE_URL,
    lastVerifiedDate: LAST_VERIFIED_DATE
  }
];

export const getSupportedYears = (): string[] => ATO_CAP_HISTORY.map((entry) => entry.fyLabel);

export const getDefaultYear = (): string => ATO_CAP_HISTORY[ATO_CAP_HISTORY.length - 1].fyLabel;

export const getCapForYear = (fyLabel: string): AtoCapYearEntry | undefined =>
  ATO_CAP_HISTORY.find((entry) => entry.fyLabel === fyLabel);

