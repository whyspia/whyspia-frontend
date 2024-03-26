import { isServerSide } from 'utils/randomUtils'

export const DEFAULT_TITLE = 'The credibility layer of the internet'
export const DEFAULT_TITLE_TEMPLATE = 'Ideamarket | %s'
export const DEFAULT_DESCRIPTION =
  'A Post-to-Earn knowledge graph for building credibility without institutions.'
export const DEFAULT_CANONICAL = 'https://ideamarket.io'
export const SITE_NAME = 'Ideamarket'
export const DEFAULT_OG_IMAGE = `${DEFAULT_CANONICAL}/og-image.jpg`
export const TWITTER_HANDLE = '@ideamarket_io'
export const TWITTER_CARD_TYPE = 'summary_large_image'
export const FAVICON_LINK = '/logo.png'

export const getURL = (): string => {
  // If server side, we can use env vars. If client side, cannot use env vars, so use window.location.host
  const url = isServerSide()
    ? process.env.NODE_ENV === 'production'
      ? `https://${process.env.VERCEL_URL}`
      : process.env.VERCEL_URL ?? 'http://localhost:3000'
    : window.location.host

  return url
}
