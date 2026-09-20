import { FINANCING_PRESETS } from './constants'
import type { Deal } from './types'

export function createDefaultDeal(): Deal {
  const preset = FINANCING_PRESETS.hardMoney
  return {
    id: crypto.randomUUID(),
    name: 'עסקה חדשה',
    purchasePrice: 250000,
    sqft: 1500,
    cashAvailable: 60000,
    purchaseClosingCostsPct: 3,
    arvOverride: null,
    financing: {
      type: 'hardMoney',
      downPaymentPct: preset.downPaymentPct,
      interestRatePct: preset.interestRatePct,
      pointsPct: preset.pointsPct,
    },
    renovation: {
      category: 'advanced',
      customCostPerSqft: null,
    },
    holding: {
      months: 6,
      propertyTaxRatePct: 1.2,
      insuranceMonthly: 120,
      utilitiesMonthly: 150,
      otherMonthly: 100,
    },
    selling: {
      agentCommissionPct: 5,
      closingCostsPct: 1.5,
      transferTaxPct: 0.5,
    },
    taxes: {
      estimatedTaxRatePct: 25,
    },
    comps: [],
  }
}
