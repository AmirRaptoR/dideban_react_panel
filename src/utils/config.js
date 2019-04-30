module.exports = {
  siteName: 'Dideban',
  copyright: 'Ant Design Admin  © 2018 zuiidea',
  logoPath: '/logo.svg',
  apiPrefix: 'http://localhost:8080',
  fixedHeader: true, // sticky primary layout header

  /* Layout configuration, specify which layout to use for route. */
  layouts: [
    {
      name: 'primary',
      include: [/.*/],
      exclude: [/(\/(en|zh))*\/login/],
    },
  ],

  /* I18n configuration, `languages` and `defaultLanguage` are required currently. */
  i18n: {
    /* Countrys flags: https://www.flaticon.com/packs/countrys-flags */
    languages: [
      {
        key: 'fa',
        title: 'فارسی',
        flag: '/iran.svg',
      },
      {
        key: 'en',
        title: 'English',
        flag: '/america.svg',
      }
    ],
    defaultLanguage: 'en',
  },
}
