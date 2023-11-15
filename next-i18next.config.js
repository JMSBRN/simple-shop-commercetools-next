// @ts-check

/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  // https://www.i18next.com/overview/configuration-options#logging
  debug: false, // process.env.NODE_ENV === 'development',
  i18n: {
    defaultLocale: 'en-GB',
    locales: ['en-GB', 'de-DE', 'fr-FR', 'he-IL'],
    localeDetection: false, // false === when browser language not change locale
  },
  /** To avoid issues when deploying to some paas (vercel...) */
  localePath:
    typeof window === 'undefined'
      ? require('path').resolve('./public/locales')
      : '/locales',

  reloadOnPrerender: process.env.NODE_ENV === 'development',

  /**
   * @link https://github.com/i18next/next-i18next#6-advanced-configuration
   */
  // saveMissing: false,
  // strictMode: true,
  // serializeConfig: false,
  // react: { useSuspense: false }
  interpolation: {
    prefix: '{{',
    suffix: '}}',
  },
  
};
