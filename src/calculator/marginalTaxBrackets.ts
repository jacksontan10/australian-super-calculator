/** Simplified resident rates used by this app for tax saved estimates (not official tax tables). */
export const RESIDENT_MARGINAL_RATE_TABLE: { incomeRange: string; rateLabel: string }[] = [
  { incomeRange: "$0 – $18,200", rateLabel: "0%" },
  { incomeRange: "$18,201 – $45,000", rateLabel: "16%" },
  { incomeRange: "$45,001 – $135,000", rateLabel: "30%" },
  { incomeRange: "$135,001 – $190,000", rateLabel: "37%" },
  { incomeRange: "$190,001 and above", rateLabel: "45%" }
];
