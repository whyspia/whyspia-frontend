import { isServerSide } from 'utils/randomUtils'

export const DEFAULT_TITLE = 'send and map symbols'
export const DEFAULT_TITLE_TEMPLATE = 'whyspia | %s'
export const DEFAULT_DESCRIPTION =
  'send and map symbols'
export const DEFAULT_CANONICAL = 'https://whyspia.com'
export const SITE_NAME = 'whyspia'
export const DEFAULT_OG_IMAGE = `${DEFAULT_CANONICAL}/og-image.jpg`
export const TWITTER_HANDLE = '@whyspia'
export const TWITTER_CARD_TYPE = 'summary_large_image'
export const FAVICON_LINK = '/logo.png'

// Helper function to normalize URLs by removing www. if present
export function normalizeURL(url: string): string {
  return url.replace(/^(https?:\/\/)(?:www\.)/, '$1')
}

export const getFrontendURL = (): string => {
  // If server side, we can use env vars. If client side, cannot use env vars, so use window.location.host
  const rawUrl = isServerSide()
    ? process.env.NODE_ENV === 'production'
      ? `https://${process.env.VERCEL_URL}`
      : process.env.VERCEL_URL ?? 'http://localhost:3000'
    : window.location.origin

  return normalizeURL(rawUrl)
}
