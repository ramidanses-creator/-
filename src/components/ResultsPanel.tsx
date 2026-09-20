import type { DealResults } from '../utils/calculations'
import { formatCurrency, formatPercent } from '../utils/calculations'

function Row({ label, value, strong, negative }: { label: string; value: string; strong?: boolean; negative?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${strong ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
      <span>{label}</span>
      <span className={negative ? 'text-red-600' : ''}>{value}</span>
    </div>
  )
}

export function ResultsPanel({ results, cashAvailable }: { results: DealResults; cashAvailable: number }) {
  const profitPositive = results.netProfitAfterTax >= 0

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800">סיכום העסקה</h2>

      <div className="mt-3 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-400">שווי ועלויות</h3>
          <Row
            label={`שווי מכירה משוער (ARV)${results.arvSource === 'comps' ? ' — לפי Comps' : results.arvSource === 'override' ? ' — ידני' : ''}`}
            value={formatCurrency(results.arv)}
          />
          {results.compsAvgPricePerSqft && (
            <Row label="ממוצע $/מ״ר מעסקאות דומות" value={`$${results.compsAvgPricePerSqft.toFixed(0)}`} />
          )}
          <Row label="עלות שיפוץ" value={formatCurrency(results.renovationCost)} />
          {results.renovationFinanced > 0 && (
            <>
              <Row label="מתוכה ממומן בהלוואה" value={formatCurrency(results.renovationFinanced)} />
              <Row label="מתוכה מהכיס שלך" value={formatCurrency(results.renovationCash)} />
            </>
          )}
          <Row label="סה״כ עלות פרויקט (רכישה + שיפוץ)" value={formatCurrency(results.totalProjectCost)} />
          <Row label="עלויות מכירה (עמלת מתווך, סגירה, מס העברה)" value={formatCurrency(results.totalSellingCosts)} />
          <Row label="עלויות החזקה (ריבית, מיסים, ביטוח, שוטף)" value={formatCurrency(results.totalHoldingCosts)} />
        </div>

        <div>
          <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-400">מימון ומזומן נדרש</h3>
          <Row label="סכום מומן (הלוואה)" value={formatCurrency(results.financedAmount)} />
          <Row label="הון עצמי (מקדמה)" value={formatCurrency(results.downPaymentAmount)} />
          <Row label="נקודות הלוואה" value={formatCurrency(results.loanPoints)} />
          <Row label="עלויות סגירת רכישה" value={formatCurrency(results.purchaseClosingCosts)} />
          <Row label="מזומן נדרש בסגירה" value={formatCurrency(results.cashRequiredAtClosing)} strong />
          <Row label="סה״כ מזומן מושקע (כולל תקופת החזקה)" value={formatCurrency(results.totalCashInvested)} strong />
        </div>
      </div>

      <div className="mt-4 border-t border-slate-200 pt-4">
        <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-400">רווח ומיסים</h3>
        <Row label="רווח לפני מס" value={formatCurrency(results.netProfitBeforeTax)} />
        <Row label="מס משוער" value={formatCurrency(results.estimatedTax)} negative />
        <Row
          label="רווח נקי לאחר מס"
          value={formatCurrency(results.netProfitAfterTax)}
          strong
          negative={!profitPositive}
        />
        <Row label="תשואה על מזומן שהושקע (Cash-on-Cash)" value={formatPercent(results.cashOnCashReturnPct)} strong />
        <Row label="תשואה על סה״כ עלות הפרויקט" value={formatPercent(results.roiOnTotalCostPct)} />
      </div>

      {results.overBudget && (
        <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          התקציב שהגדרת ({formatCurrency(cashAvailable)}) אינו מספיק — נדרשים עוד{' '}
          <strong>{formatCurrency(results.budgetShortfall)}</strong> מהכיס כדי לבצע ולהחזיק את העסקה עד למכירה.
        </div>
      )}

      {!results.overBudget && (
        <div className="mt-4 rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800">
          העסקה בגבולות התקציב שהגדרת. נותרים {formatCurrency(cashAvailable - results.totalCashInvested)} כרזרבה.
        </div>
      )}

      <p className="mt-4 text-xs text-slate-400">
        * ההערכות (כולל מיסים) הן כלליות ולצורך תכנון בלבד ואינן ייעוץ מס, משפטי או פיננסי. יש להתייעץ עם רו״ח/עו״ד מקומי לפני קבלת החלטה.
      </p>
    </section>
  )
}
