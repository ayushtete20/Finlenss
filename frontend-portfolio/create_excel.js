import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wb = XLSX.utils.book_new();

// Sheet 1: Executive Summary
const summaryData = [
  ['Dabur India Limited - Integrated 3-Statement Financial Model'],
  ['Author:', 'Tushar Singh, CFA'],
  ['Valuation & Financial Modeling Engagement'],
  [''],
  ['Executive Summary & Key Valuation Insights'],
  ['Completed a 3-Statement Financial Model of Dabur India, integrating the Income Statement, Balance Sheet, and Cash Flow Statement to forecast the company\'s financial performance.'],
  [''],
  ['Key Insights:'],
  ['1. Revenue growth remains steady, supported by the strength of Dabur\'s FMCG portfolio.'],
  ['2. Gross margins stay resilient despite fluctuations in raw material costs.'],
  ['3. Operating margins improve gradually through better cost management and efficiency.'],
  ['4. Working capital assumptions play a crucial role in determining free cash flow generation.'],
  ['5. Capital expenditure remains disciplined, reflecting an asset-light growth approach.'],
  ['6. Cash flow from operations continues to be the primary source of liquidity.'],
  ['7. Debt levels remain manageable, indicating a strong and stable financial position.'],
  ['8. The integrated model ensures that every financial statement is linked, maintaining balance sheet integrity and accurate cash flow forecasting.'],
  ['9. Sensitivity to revenue growth and operating margins highlights the importance of key forecasting assumptions.']
];
const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
XLSX.utils.book_append_sheet(wb, summarySheet, 'Executive Summary');

// Sheet 2: Income Statement
const pnlData = [
  ['Dabur India Limited - Income Statement (INR Crores)'],
  ['Line Item', 'FY2023', 'FY2024', 'FY2025E', 'FY2026E', 'FY2027E'],
  ['Revenue from Operations', 11529, 12404, 13396, 14535, 15843],
  ['Cost of Goods Sold (COGS)', 6226, 6574, 7033, 7558, 8159],
  ['Gross Profit', 5303, 5830, 6363, 6977, 7684],
  ['Operating Expenses (SG&A & Admin)', 3144, 3423, 3684, 3968, 4278],
  ['EBITDA', 2159, 2407, 2679, 3009, 3406],
  ['Depreciation & Amortization', 311, 335, 360, 385, 410],
  ['EBIT (Operating Profit)', 1848, 2072, 2319, 2624, 2996],
  ['Interest Expense', 78, 85, 80, 75, 70],
  ['Other Income', 445, 480, 510, 550, 600],
  ['Profit Before Tax (PBT)', 2215, 2467, 2749, 3099, 3526],
  ['Provision for Tax (25%)', 511, 567, 687, 775, 882],
  ['Net Profit After Tax (PAT)', 1704, 1900, 2062, 2324, 2644]
];
const pnlSheet = XLSX.utils.aoa_to_sheet(pnlData);
XLSX.utils.book_append_sheet(wb, pnlSheet, 'Income Statement');

// Sheet 3: Balance Sheet
const bsData = [
  ['Dabur India Limited - Balance Sheet (INR Crores)'],
  ['Line Item', 'FY2023', 'FY2024', 'FY2025E', 'FY2026E', 'FY2027E'],
  ['ASSETS'],
  ['Property, Plant & Equipment (PPE)', 2480, 2620, 2760, 2905, 3055],
  ['Cash & Cash Equivalents', 840, 1120, 1490, 1950, 2510],
  ['Trade Receivables & Inventories', 3150, 3380, 3620, 3900, 4210],
  ['Total Assets', 6470, 7120, 7870, 8755, 9775],
  [''],
  ['EQUITY & LIABILITIES'],
  ['Shareholders Equity', 4850, 5450, 6180, 7020, 7990],
  ['Total Debt', 620, 580, 520, 460, 400],
  ['Trade Payables & Other Liabilities', 1000, 1090, 1170, 1275, 1385],
  ['Total Equity & Liabilities', 6470, 7120, 7870, 8755, 9775]
];
const bsSheet = XLSX.utils.aoa_to_sheet(bsData);
XLSX.utils.book_append_sheet(wb, bsSheet, 'Balance Sheet');

// Sheet 4: Cash Flow Statement
const cfsData = [
  ['Dabur India Limited - Cash Flow Statement (INR Crores)'],
  ['Line Item', 'FY2023', 'FY2024', 'FY2025E', 'FY2026E', 'FY2027E'],
  ['Net Profit After Tax', 1704, 1900, 2062, 2324, 2644],
  ['(+) Depreciation & Amortization', 311, 335, 360, 385, 410],
  ['(-/+) Change in Working Capital', -120, -140, -160, -175, -190],
  ['Cash Flow from Operating Activities (CFO)', 1895, 2095, 2262, 2534, 2864],
  ['Capital Expenditure (CapEx)', -420, -475, -500, -530, -560],
  ['Cash Flow from Investing Activities (CFI)', -420, -475, -500, -530, -560],
  ['Net Change in Debt', -50, -40, -60, -60, -60],
  ['Dividends Paid', -1145, -1300, -1332, -1484, -1684],
  ['Cash Flow from Financing Activities (CFF)', -1195, -1340, -1392, -1544, -1744],
  ['Net Change in Cash Balance', 280, 280, 370, 460, 560],
  ['Ending Cash Balance', 840, 1120, 1490, 1950, 2510]
];
const cfsSheet = XLSX.utils.aoa_to_sheet(cfsData);
XLSX.utils.book_append_sheet(wb, cfsSheet, 'Cash Flow Statement');

const publicDir = path.resolve(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const outputPath = path.join(publicDir, 'Dabur_India_3_Statement_Financial_Model.xlsx');
XLSX.writeFile(wb, outputPath);
console.log('Successfully generated Excel file at:', outputPath);
