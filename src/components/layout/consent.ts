/**
 * The consent contract, in one place (2026-08-28). Three things agree on
 * these names: the banner (CookieConsent), the withdrawal control on
 * /cookies (CookiePreferences), and the inline gtag bootstrap
 * (GoogleAnalytics — which cannot import, so it repeats the KEY string;
 * keep them identical).
 */

/** localStorage key holding 'accepted' | 'declined' */
export const CONSENT_KEY = 'konaverse_cookie_consent'

/** fired on window when the stored choice is forgotten — the banner returns */
export const CONSENT_RESET_EVENT = 'konaverse:cookie-reset'

/** fired on window when a choice is made — anything showing it re-reads */
export const CONSENT_CHOICE_EVENT = 'konaverse:cookie-choice'

export type Consent = 'accepted' | 'declined'

/** Push the choice to Google Consent Mode v2, if gtag is on the page. */
export function applyConsent(value: Consent) {
  const granted = value === 'accepted' ? 'granted' : 'denied'
  const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag
  gtag?.('consent', 'update', {
    ad_storage: granted,
    ad_user_data: granted,
    ad_personalization: granted,
    analytics_storage: granted,
  })
}
