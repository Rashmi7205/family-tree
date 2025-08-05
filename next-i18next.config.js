module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'hi', 'gu'],
    localeDetection: false, // We'll handle this manually with localStorage
  },
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}