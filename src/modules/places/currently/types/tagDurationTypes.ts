export enum TAG_DURATION_OPTIONS {
  END_OF_DAY = 'until end of day',
  FOUR_HOURS = '4 hours',
  ONE_HOUR = '1 hour',
  DONT_CLEAR = 'until i change this again',
}

export const getShortDuration = (duration: TAG_DURATION_OPTIONS): string => {
  switch (duration) {
    case TAG_DURATION_OPTIONS.END_OF_DAY:
      return 'EoD'
    case TAG_DURATION_OPTIONS.FOUR_HOURS:
      return '4H'
    case TAG_DURATION_OPTIONS.ONE_HOUR:
      return '1H'
    case TAG_DURATION_OPTIONS.DONT_CLEAR:
      return '∞'
    default:
      return duration
  }
}

export const ACTIVE_TAG_DURATION_OPTIONS = [
  TAG_DURATION_OPTIONS.END_OF_DAY,
  TAG_DURATION_OPTIONS.FOUR_HOURS,
  TAG_DURATION_OPTIONS.ONE_HOUR,
  TAG_DURATION_OPTIONS.DONT_CLEAR,
]

export interface TagWithDuration {
  text: string
  duration: TAG_DURATION_OPTIONS
} 