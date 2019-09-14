const path = require('path');
const requireYml = require('require-yml');
const LocalizedStrings = require('localized-strings').default;

const config = require('../common/config');

const MESSAGES_FOLDER_PATH = path.join(config.APP_ROOT_PATH, './src/messages');

class I18n {
  constructor () {
    this._localizedMessages = this._getLocalizedMessages();
  }

  get (locale, key, data = {}) {
    this._localizedMessages.setLanguage(locale);
    return this._localizedMessages.formatString(key, data);
  }

  _getLocalizedMessages () {
    const messages = requireYml(MESSAGES_FOLDER_PATH);
    const localizedMessages = new LocalizedStrings(messages);
    localizedMessages.setLanguage(config.DEFAULT_LOCALE);
    return localizedMessages;
  }
}

module.exports = new I18n();
