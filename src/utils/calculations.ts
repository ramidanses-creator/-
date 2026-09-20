import { renovationMidpoint } from '../constants'
import type { Deal } from '../types'

export interface DealResults {
  arv: number
  arvSource: 'comps' | 'override' | 'none'
  compsAvgPricePerSqft: number | null
  renovationCostPerSqft: number
  renovationCost: number
  totalProjectCost: number
  financedAmount: number
  downPaymentAmount: number
  loanPoints: number
  purchaseClosingCosts: number
  monthlyLoanInterest: number
  totalLoanInterest: number
  propertyTaxMonthly: number
  totalHoldingCosts: number
  totalSellingCosts: number
  netProfitBeforeTax: number
  estimatedTax: number
  netProfitAfterTax: number
  cashRequiredAtClosing: number
  totalCashInvested: number
  cashOnCashReturnPct: number | null
  roiOnTotalCostPct: number | null
  overBudget: boolean
  budgetShortfall: number
}

export function computeCompsAvgPricePerSqft(comps: Deal['comps']): number | null {
  const valid = comps.filter((c) => c.soldPrice > 0 && c.sqft > 0)
  if (valid.length === 0) return null
  const total = valid.reduce((sum, c) => sum + c.soldPrice / c.sqft, 0)
  return total / valid.length
}

export function calculateDeal(deal: Deal): DealResults {
  const compsAvgPricePerSqft = computeCompsAvgPricePerSqft(deal.comps)

  let arv = 0
  let arvSource: DealResults['arvSource'] = 'none'
  if (deal.arvOverride && deal.arvOverride > 0) {
    arv = deal.arvOverride
    arvSource = 'override'
  } else if (compsAvgPricePerSqft) {
    arv = compsAvgPricePerSqft * deal.sqft
    arvSource = 'comps'
  }

  const renovationCostPerSqft =
    deal.renovation.customCostPerSqft ?? renovationMidpoint(deal.renovation.category)
  const renovationCost = renovationCostPerSqft * deal.sqft

  const totalProjectCost = deal.purchasePrice + renovationCost

  const financedAmount = totalProjectCost * (1 - deal.financing.downPaymentPct / 100)
  const downPaymentAmount = totalProjectCost - financedAmount
  const loanPoints = financedAmount * (deal.financing.pointsPct / 100)
  const purchaseClosingCosts = deal.purchasePrice * (deal.purchaseClosingCostsPct / 100)

  const monthlyLoanInterest = financedAmount * (deal.financing.interestRatePct / 100 / 12)
  const totalLoanInterest = monthlyLoanInterest * deal.holding.months

  const propertyTaxMonthly = (deal.purchasePrice * (deal.holding.propertyTaxRatePct / 100)) / 12
  const totalHoldingCosts =
    deal.holding.months *
      (propertyTaxMonthly +
        deal.holding.insuranceMonthly +
        deal.holding.utilitiesMonthly +
        deal.holding.otherMonthly) +
    totalLoanInterest

  const totalSellingCosts =
    arv *
    ((deal.selling.agentCommissionPct + deal.selling.closingCostsPct + deal.selling.transferTaxPct) / 100)

  const netProfitBeforeTax =
    arv - totalSellingCosts - totalProjectCost - loanPoints - purchaseClosingCosts - totalHoldingCosts

  const estimatedTax = Math.max(0, netProfitBeforeTax) * (deal.taxes.estimatedTaxRatePct / 100)
  const netProfitAfterTax = netProfitBeforeTax - estimatedTax

  const cashRequiredAtClosing = downPaymentAmount + loanPoints + purchaseClosingCosts
  const totalCashInvested = cashRequiredAtClosing + totalHoldingCosts

  const cashOnCashReturnPct =
    totalCashInvested > 0 ? (netProfitAfterTax / totalCashInvested) * 100 : null
  const roiOnTotalCostPct = totalProjectCost > 0 ? (netProfitAfterTax / totalProjectCost) * 100 : null

  const overBudget = totalCashInvested > deal.cashAvailable
  const budgetShortfall = overBudget ? totalCashInvested - deal.cashAvailable : 0

  return {
    arv,
    arvSource,
    compsAvgPricePerSqft,
    renovationCostPerSqft,
    renovationCost,
    totalProjectCost,
    financedAmount,
    downPaymentAmount,
    loanPoints,
    purchaseClosingCosts,
    monthlyLoanInterest,
    totalLoanInterest,
    propertyTaxMonthly,
    totalHoldingCosts,
    totalSellingCosts,
    netProfitBeforeTax,
    estimatedTax,
    netProfitAfterTax,
    cashRequiredAtClosing,
    totalCashInvested,
    cashOnCashReturnPct,
    roiOnTotalCostPct,
    overBudget,
    budgetShortfall,
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercent(value: number | null): string {
  if (value === null) return '—'
  return `${value.toFixed(1)}%`
}
