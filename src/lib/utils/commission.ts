import { COMMISSION_TIERS } from './constants'

export interface CommissionTier {
  level: number
  name: string
  minBookings: number
  rate: number
}

const COMMISSION_TIERS_ARRAY: CommissionTier[] = [
  COMMISSION_TIERS.BRONZE,
  COMMISSION_TIERS.SILVER,
  COMMISSION_TIERS.GOLD
]

export function calculateCommissionTier(monthlyBookings: number): CommissionTier {
  let qualifiedTier = COMMISSION_TIERS_ARRAY[0] // Default to Bronze
  
  for (const tier of COMMISSION_TIERS_ARRAY) {
    if (monthlyBookings >= tier.minBookings) {
      qualifiedTier = tier
    } else {
      break
    }
  }
  
  return qualifiedTier
}

export function calculateCommission(
  serviceFeeInCents: number,
  commissionRate: number
): {
  commissionCents: number
  platformFeeCents: number
  therapistEarnings: number
} {
  const commissionCents = Math.round(serviceFeeInCents * (commissionRate / 100))
  const platformFeeCents = serviceFeeInCents - commissionCents
  const therapistEarnings = commissionCents / 100 // Convert to dollars
  
  return {
    commissionCents,
    platformFeeCents,
    therapistEarnings
  }
}

export function getNextTierProgress(currentBookings: number): {
  currentTier: CommissionTier
  nextTier: CommissionTier | null
  bookingsNeeded: number
  progressPercentage: number
} {
  const currentTier = calculateCommissionTier(currentBookings)
  const nextTierIndex = COMMISSION_TIERS_ARRAY.findIndex((tier: CommissionTier) => tier.level === currentTier.level) + 1
  const nextTier = nextTierIndex < COMMISSION_TIERS_ARRAY.length ? COMMISSION_TIERS_ARRAY[nextTierIndex] : null
  
  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      bookingsNeeded: 0,
      progressPercentage: 100
    }
  }
  
  const bookingsNeeded = nextTier.minBookings - currentBookings
  const progressPercentage = Math.min(
    100,
    (currentBookings / nextTier.minBookings) * 100
  )
  
  return {
    currentTier,
    nextTier,
    bookingsNeeded: Math.max(0, bookingsNeeded),
    progressPercentage
  }
}
