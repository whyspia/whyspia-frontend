export enum DURATION_OPTIONS {
  END_OF_DAY = 'until end of day',
  FOUR_HOURS = '4 hours',
  ONE_HOUR = '1 hour',
  DONT_CLEAR = 'until i change this again',
}

// Helper to get milliseconds until end of day
const getMsUntilEndOfDay = (): number => {
  const now = new Date()
  const endOfDay = new Date(now)
  endOfDay.setHours(23, 59, 59, 999)
  return endOfDay.getTime() - now.getTime()
}

// TODO: END_OF_DAY and default dont really work bc not based on passed in Currently
export const getDurationMs = (duration: DURATION_OPTIONS): number => {
  switch (duration) {
    case DURATION_OPTIONS.END_OF_DAY:
      return getMsUntilEndOfDay()
    case DURATION_OPTIONS.FOUR_HOURS:
      return 4 * 60 * 60 * 1000 // 4 hours in ms
    case DURATION_OPTIONS.ONE_HOUR:
      return 60 * 60 * 1000 // 1 hour in ms
    case DURATION_OPTIONS.DONT_CLEAR:
      return 365 * 24 * 60 * 60 * 1000 // 1 year in ms (effectively forever)
    default:
      return getMsUntilEndOfDay() // default to end of day
  }
}

export const getShortDurationOptionName = (duration: DURATION_OPTIONS): string => {
  switch (duration) {
    case DURATION_OPTIONS.END_OF_DAY:
      return 'EoD'
    case DURATION_OPTIONS.FOUR_HOURS:
      return '4H'
    case DURATION_OPTIONS.ONE_HOUR:
      return '1H'
    case DURATION_OPTIONS.DONT_CLEAR:
      return '∞'
    default:
      return duration
  }
}

export const ACTIVE_DURATION_OPTIONS = [
  DURATION_OPTIONS.END_OF_DAY,
  DURATION_OPTIONS.FOUR_HOURS,
  DURATION_OPTIONS.ONE_HOUR,
  DURATION_OPTIONS.DONT_CLEAR,
]

export interface TagWithDuration {
  text: string
  duration: DURATION_OPTIONS
  updatedDurationAt?: Date
}

export interface PlaceWithDuration {
  text: string
  duration: DURATION_OPTIONS
  updatedDurationAt?: Date
}

export interface StatusWithDuration {
  text: string
  duration: DURATION_OPTIONS
  updatedDurationAt?: Date
}

export const getDurationOption = (duration: number): DURATION_OPTIONS => {
  // DONT_CLEAR is exactly 365 * 24 * 60 * 60 * 1000
  if (duration === 365 * 24 * 60 * 60 * 1000) {
    return DURATION_OPTIONS.DONT_CLEAR
  }
  
  // FOUR_HOURS is exactly 4 * 60 * 60 * 1000
  if (duration === 4 * 60 * 60 * 1000) {
    return DURATION_OPTIONS.FOUR_HOURS
  }
  
  // ONE_HOUR is exactly 60 * 60 * 1000
  if (duration === 60 * 60 * 1000) {
    return DURATION_OPTIONS.ONE_HOUR
  }

  // Everything else must be END_OF_DAY
  // (since getDurationMs uses getMsUntilEndOfDay() for this case)
  return DURATION_OPTIONS.END_OF_DAY
}

export const getDisplayTimeLeft = (duration: number, updatedDurationAt: Date): string => {
  const now = new Date()
  const updateTime = new Date(updatedDurationAt)
  const remainingMs = duration - (now.getTime() - updateTime.getTime())

  // If expired (remaining time is negative or zero), show EXPIRED
  if (remainingMs <= 0) {
    return 'EXPIRED'
  }

  // If more than 24 hours remaining, show infinity
  if (remainingMs > 24 * 60 * 60 * 1000) {
    return '∞'
  }

  // If more than 1 hour remaining, show hours
  if (remainingMs > 60 * 60 * 1000) {
    const hoursLeft = Math.ceil(remainingMs / (60 * 60 * 1000))
    return `${hoursLeft}H`
  }

  // If less than 1 hour, show minutes
  const minutesLeft = Math.max(1, Math.ceil(remainingMs / (60 * 1000)))
  return `${minutesLeft}m`
} 