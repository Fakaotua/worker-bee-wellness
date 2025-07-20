export interface CommissionTier {
  tier: number
  rate: number
  minEarnings: number
}

export const COMMISSION_TIERS: CommissionTier[] = [
  { tier: 1, rate: 0.60, minEarnings: 0 },
  { tier: 2, rate: 0.65, minEarnings: 1000 },
  { tier: 3, rate: 0.70, minEarnings: 2500 },
  { tier: 4, rate: 0.75, minEarnings: 5000 },
  { tier: 5, rate: 0.80, minEarnings: 10000 }
]

export function calculateCommissionTier(totalEarnings: number): CommissionTier {
  for (let i = COMMISSION_TIERS.length - 1; i >= 0; i--) {
    if (totalEarnings >= COMMISSION_TIERS[i].minEarnings) {
      return COMMISSION_TIERS[i]
    }
  }
  return COMMISSION_TIERS[0]
}

export function calculateCommission(amount: number, totalEarnings: number): number {
  const tier = calculateCommissionTier(totalEarnings)
  return amount * tier.rate
}

export function getNextTierProgress(totalEarnings: number): {
  currentTier: CommissionTier
  nextTier: CommissionTier | null
  progress: number
} {
  const currentTier = calculateCommissionTier(totalEarnings)
  const currentTierIndex = COMMISSION_TIERS.findIndex(t => t.tier === currentTier.tier)
  const nextTier = currentTierIndex < COMMISSION_TIERS.length - 1 
    ? COMMISSION_TIERS[currentTierIndex + 1] 
    : null

  let progress = 1
  if (nextTier) {
    const tierRange = nextTier.minEarnings - currentTier.minEarnings
    const currentProgress = totalEarnings - currentTier.minEarnings
    progress = Math.min(currentProgress / tierRange, 1)
  }

  return { currentTier, nextTier, progress }
}
