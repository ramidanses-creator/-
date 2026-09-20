import type { FinancingPreset, FinancingType, RenovationCategory } from './types'

export const FINANCING_PRESETS: Record<FinancingType, FinancingPreset> = {
  cash: {
    label: 'מזומן מלא',
    description: 'אין הלוואה — כל הרכישה והשיפוץ ממומנים מהכיס שלך.',
    downPaymentPct: 100,
    interestRatePct: 0,
    pointsPct: 0,
  },
  hardMoney: {
    label: 'הלוואת Hard Money',
    description: 'הלוואה קצרת טווח לפליפים, ריבית גבוהה ואישור מהיר.',
    downPaymentPct: 15,
    interestRatePct: 11,
    pointsPct: 2.5,
  },
  conventional: {
    label: 'הלוואת השקעה (DSCR / קונבנציונלית)',
    description: 'הלוואה בנקאית סטנדרטית לנכס השקעה, ריבית נמוכה יותר אך דורשת הון עצמי גבוה.',
    downPaymentPct: 25,
    interestRatePct: 7.5,
    pointsPct: 1,
  },
  heloc: {
    label: 'קו אשראי על נכס קיים (HELOC)',
    description: 'שימוש בהון עצמי מנכס אחר שבבעלותך למימון העסקה.',
    downPaymentPct: 10,
    interestRatePct: 9,
    pointsPct: 0.5,
  },
}

export const RENOVATION_RANGES: Record<RenovationCategory, { low: number; high: number; label: string; description: string }> = {
  basic: {
    low: 15,
    high: 30,
    label: 'בסיסי',
    description: 'צבע, רצפות, תיקוני קוסמטיקה, מטבח/אמבטיה קלים',
  },
  advanced: {
    low: 30,
    high: 60,
    label: 'מתקדם',
    description: 'שיפוץ מטבח ואמבטיות, חשמל/אינסטלציה חלקי, שינויים קלים בתכנון',
  },
  premium: {
    low: 60,
    high: 120,
    label: 'פרימיום',
    description: 'שיפוץ מלא עד לשלד, גימורים יוקרתיים, שינוי תכנון מהותי',
  },
}

export function renovationMidpoint(category: RenovationCategory): number {
  const r = RENOVATION_RANGES[category]
  return (r.low + r.high) / 2
}
