import { FINANCING_PRESETS, RENOVATION_RANGES, renovationMidpoint } from '../constants'
import type { Deal, FinancingType, RenovationCategory } from '../types'
import { Card, NumberField, SelectField, TextField } from './Field'

export function DealForm({ deal, onChange }: { deal: Deal; onChange: (deal: Deal) => void }) {
  function update<K extends keyof Deal>(key: K, value: Deal[K]) {
    onChange({ ...deal, [key]: value })
  }

  function handleFinancingType(type: FinancingType) {
    const preset = FINANCING_PRESETS[type]
    onChange({
      ...deal,
      financing: {
        type,
        downPaymentPct: preset.downPaymentPct,
        interestRatePct: preset.interestRatePct,
        pointsPct: preset.pointsPct,
      },
    })
  }

  const renoRange = RENOVATION_RANGES[deal.renovation.category]
  const effectiveCostPerSqft = deal.renovation.customCostPerSqft ?? renovationMidpoint(deal.renovation.category)

  return (
    <div className="flex flex-col gap-5">
      <Card title="פרטי הנכס והתקציב" subtitle="כמה כסף אתה מוכן להשקיע מהכיס שלך, ומה מחיר הרכישה והגודל.">
        <TextField label="שם העסקה" value={deal.name} onChange={(v) => update('name', v)} placeholder="לדוגמה: רחוב מייפל 123" />
        <NumberField label="מחיר רכישה" value={deal.purchasePrice} onChange={(v) => update('purchasePrice', v)} suffix="$" step={1000} />
        <NumberField label="שטח הנכס" value={deal.sqft} onChange={(v) => update('sqft', v)} suffix="sqft" step={10} />
        <NumberField
          label="תקציב זמין מהכיס שלך"
          value={deal.cashAvailable}
          onChange={(v) => update('cashAvailable', v)}
          suffix="$"
          step={1000}
          hint="כמה מזומן אתה מוכן/יכול להכניס לעסקה הזו"
        />
        <NumberField
          label="עלויות סגירת רכישה"
          value={deal.purchaseClosingCostsPct}
          onChange={(v) => update('purchaseClosingCostsPct', v)}
          suffix="%"
          step={0.1}
          hint="עורך דין, ביטוח בעלות, אגרות רישום וכו׳"
        />
        <NumberField
          label="שווי מכירה משוער ידני (ARV) — אופציונלי"
          value={deal.arvOverride ?? 0}
          onChange={(v) => update('arvOverride', v || null)}
          suffix="$"
          step={1000}
          hint="השאר 0 כדי לחשב אוטומטית מממוצע ה-Comps"
        />
      </Card>

      <Card title="אפשרויות מימון" subtitle="בחר סוג מימון — הערכים יתמלאו אוטומטית עם נתונים טיפוסיים לשוק וניתנים לעריכה.">
        <SelectField
          label="סוג מימון"
          value={deal.financing.type}
          onChange={handleFinancingType}
          options={Object.entries(FINANCING_PRESETS).map(([value, p]) => ({ value: value as FinancingType, label: p.label }))}
          hint={FINANCING_PRESETS[deal.financing.type].description}
        />
        <NumberField
          label="הון עצמי נדרש"
          value={deal.financing.downPaymentPct}
          onChange={(v) => update('financing', { ...deal.financing, downPaymentPct: v })}
          suffix="%"
          step={1}
        />
        <NumberField
          label="ריבית שנתית"
          value={deal.financing.interestRatePct}
          onChange={(v) => update('financing', { ...deal.financing, interestRatePct: v })}
          suffix="%"
          step={0.1}
        />
        <NumberField
          label="נקודות הלוואה (Points)"
          value={deal.financing.pointsPct}
          onChange={(v) => update('financing', { ...deal.financing, pointsPct: v })}
          suffix="%"
          step={0.1}
        />
      </Card>

      <Card title="עלות שיפוץ" subtitle="בחר קטגוריית שיפוץ — כל קטגוריה מגיעה עם טווח עלות ל-מ״ר אופייני בארה״ב.">
        <SelectField
          label="קטגוריית שיפוץ"
          value={deal.renovation.category}
          onChange={(category: RenovationCategory) => update('renovation', { ...deal.renovation, category })}
          options={Object.entries(RENOVATION_RANGES).map(([value, r]) => ({ value: value as RenovationCategory, label: r.label }))}
          hint={`${renoRange.description} · $${renoRange.low}–$${renoRange.high} למ״ר`}
        />
        <NumberField
          label="עלות ל-מ״ר בפועל"
          value={effectiveCostPerSqft}
          onChange={(v) => update('renovation', { ...deal.renovation, customCostPerSqft: v })}
          suffix="$/sqft"
          step={1}
          hint="ניתן לדרוס את ברירת המחדל בהתאם להצעת מחיר אמיתית מקבלן"
        />
      </Card>

      <Card title="עלויות החזקה (Holding Costs)" subtitle="הוצאות חודשיות בזמן שהנכס בבעלותך ועד למכירה.">
        <NumberField label="משך החזקה" value={deal.holding.months} onChange={(v) => update('holding', { ...deal.holding, months: v })} suffix="חודשים" step={1} />
        <NumberField
          label="שיעור מס רכוש שנתי"
          value={deal.holding.propertyTaxRatePct}
          onChange={(v) => update('holding', { ...deal.holding, propertyTaxRatePct: v })}
          suffix="%"
          step={0.05}
          hint="אחוז ממחיר הרכישה, לשנה"
        />
        <NumberField label="ביטוח חודשי" value={deal.holding.insuranceMonthly} onChange={(v) => update('holding', { ...deal.holding, insuranceMonthly: v })} suffix="$" step={10} />
        <NumberField label="חשמל/מים/גז חודשי" value={deal.holding.utilitiesMonthly} onChange={(v) => update('holding', { ...deal.holding, utilitiesMonthly: v })} suffix="$" step={10} />
        <NumberField label="הוצאות שוטפות נוספות" value={deal.holding.otherMonthly} onChange={(v) => update('holding', { ...deal.holding, otherMonthly: v })} suffix="$" step={10} />
      </Card>

      <Card title="עלויות מכירה ומיסים" subtitle="הוצאות בעת המכירה, והערכת מס על הרווח (יש להתייעץ עם רו״ח).">
        <NumberField label="עמלת מתווך" value={deal.selling.agentCommissionPct} onChange={(v) => update('selling', { ...deal.selling, agentCommissionPct: v })} suffix="%" step={0.1} />
        <NumberField label="עלויות סגירת מכירה" value={deal.selling.closingCostsPct} onChange={(v) => update('selling', { ...deal.selling, closingCostsPct: v })} suffix="%" step={0.1} />
        <NumberField label="מס העברת בעלות" value={deal.selling.transferTaxPct} onChange={(v) => update('selling', { ...deal.selling, transferTaxPct: v })} suffix="%" step={0.1} />
        <NumberField
          label="שיעור מס משוער על הרווח"
          value={deal.taxes.estimatedTaxRatePct}
          onChange={(v) => update('taxes', { estimatedTaxRatePct: v })}
          suffix="%"
          step={1}
          hint="פליפים לרוב ממוסים כהכנסה רגילה/short-term capital gains — בדוק מול רו״ח"
        />
      </Card>
    </div>
  )
}
