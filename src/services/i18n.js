const path = require('path');
const requireYml = require('require-yml');
const LocalizedStrings = require('localized-strings').default;

const { config } = require('../common');

const LOCALES_FOLDER_PATH = path.join(__dirname, '../locales');

class I18n {
  constructor () {
    this._localizedStrings = this._getLocalizedStrings();
  }

  get (locale, key, data = {}) {
    this._localizedStrings.setLanguage(locale);
    return this._localizedStrings.formatString(key, data);
  }

  _getLocalizedStrings () {
    const rawStrings = requireYml(LOCALES_FOLDER_PATH);
    const localizedStrings = new LocalizedStrings(rawStrings);
    localizedStrings.setLanguage(config.DEFAULT_LOCALE);
    return localizedStrings;
  }
}

module.exports = new I18n();
