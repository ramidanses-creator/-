export type FinancingType = 'cash' | 'hardMoney' | 'conventional' | 'heloc'
export type RenovationCategory = 'basic' | 'advanced' | 'premium'

export interface FinancingPreset {
  label: string
  description: string
  downPaymentPct: number
  interestRatePct: number
  pointsPct: number
  financeRenovation: boolean
  renovationFinancedPct: number
}

export interface Comp {
  id: string
  address: string
  soldPrice: number
  sqft: number
  soldDate: string
  notes: string
}

export interface Financing {
  type: FinancingType
  downPaymentPct: number
  interestRatePct: number
  pointsPct: number
  financeRenovation: boolean
  renovationFinancedPct: number
}

export interface Renovation {
  category: RenovationCategory
  customCostPerSqft: number | null
}

export interface Holding {
  months: number
  propertyTaxRatePct: number
  insuranceMonthly: number
  utilitiesMonthly: number
  otherMonthly: number
}

export interface Selling {
  agentCommissionPct: number
  closingCostsPct: number
  transferTaxPct: number
}

export interface Taxes {
  estimatedTaxRatePct: number
}

export interface Deal {
  id: string
  name: string
  purchasePrice: number
  sqft: number
  cashAvailable: number
  purchaseClosingCostsPct: number
  arvOverride: number | null
  financing: Financing
  renovation: Renovation
  holding: Holding
  selling: Selling
  taxes: Taxes
  comps: Comp[]
}
