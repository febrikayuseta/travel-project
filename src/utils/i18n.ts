// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { ensurePrefix } from '@/utils/string'

// Check if the url is missing the locale
export const isUrlMissingLocale = (url: string) => {
  return i18n.locales.every(locale => !(url.startsWith(`/${locale}/`) || url === `/${locale}`))
}

// Get the localized url
export const getLocalizedUrl = (url: string, languageCode: string): string => {
  if (!url) return ''
  if (!languageCode) return url

  return isUrlMissingLocale(url) ? `/${languageCode}${ensurePrefix(url, '/')}` : url
}
