
const i18nProvider = require('config/i18n');



module.exports = class LocaleService {
    constructor({ locale }) {
        this.locale = locale;
    }

    translate(string, args = undefined) {

        if (this.locale) {

            if (i18nProvider.getLocales().indexOf(this.locale) !== -1) {
                return i18nProvider.__({ phrase: string, locale: this.locale }, args);
            }

        }

        return i18nProvider.__(string, args);
    }

};
