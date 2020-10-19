const i18n = require('i18n');

i18n.configure({
    locales: [ 'fa', 'en' ],
    defaultLocale: 'fa',
    directory: 'src/infrastructure/internationalization/locales',
    objectNotation: true,
});

module.exports = i18n;
