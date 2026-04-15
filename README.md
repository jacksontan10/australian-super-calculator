# Australian Super Contribution Calculator

A React + TypeScript calculator for comparing salary sacrifice and lump-sum deductible super contributions.

## Run Locally

- `npm install`
- `npm run dev`
- `npm run test`
- `npm run build`

## ATO Cap Data Maintenance

This app uses a local versioned dataset in `src/calculator/atoCapData.ts` for concessional cap values by financial year. The running calculator is fixed to **`APP_FINANCIAL_YEAR`** in that file (currently **2025-26**); change that constant when you ship a build for a new year.

### Update Process (once per financial year)

1. Open `src/calculator/atoCapData.ts`.
2. Set `APP_FINANCIAL_YEAR` to the label you are shipping (for example `2026-27`).
3. Add a matching year entry to the `ATO_CAP_HISTORY` array if it is not already present.
4. Set:
   - `fyLabel`
   - `concessionalCap`
   - `division293Threshold` (if still applicable)
   - `sourceUrl` (ATO reference page)
   - `lastVerifiedDate` (ISO date when you verified values)
5. Keep entries sorted oldest to newest.
6. Run:
   - `npm run test`
   - `npm run build`

### Verification Source

Verify against the ATO "Key superannuation rates and thresholds" page before updating data:

- <https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/contributions-caps>

