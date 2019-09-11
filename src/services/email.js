const path = require('path');
const fs = require('fs-extra');
const mailgunJs = require('mailgun-js');
const handlebars = require('handlebars');

const { config, logger } = require('../common');
const { i18n } = require('../services');

let mailgun;
if (config.EMAIL_MAILGUN_API_KEY && config.EMAIL_MAILGUN_DOMAIN) {
  mailgun = mailgunJs({
    apiKey: config.EMAIL_MAILGUN_API_KEY,
    domain: config.EMAIL_MAILGUN_DOMAIN,
  });
  logger.info('EMAIL_MAILGUN setup successful');
} else {
  logger.info('EMAIL_MAILGUN settings missing, mails will be saved to the TEMP folder');
}

const EMAIL_TEMPLATES_FOLDER_PATH = path.join(__dirname, '../templates/email');

class Email {
  async sendEmailVerification (to, verificationLink, locale = config.DEFAULT_LOCALE) {
    const data = {
      locale,
      greeting: i18n.get(locale, 'emails.emailVerification.greeting'),
      content: i18n.get(locale, 'emails.emailVerification.content', { href: verificationLink }),
      farewell: i18n.get(locale, 'emails.emailVerification.farewell'),
      sender: i18n.get(locale, 'emails.emailVerification.sender'),
    };
    const template = await this._fetchTemplate('email-verification');
    const content = template(data);
    console.log(content);
  }

  async send (to, subject, content) {
    const data = {
      from: config.EMAIL_FROM_ADDRESS,
      html: content,
      to,
      subject,
    };

    if (mailgun) return await mailgun.messages().send(data);

    const emailFilePath = path.join(config.TEMP_FOLDER_PATH, `./emails/${to}`, `${this._encodeFileName(subject)}.html`);
    return await fs.outputFile(emailFilePath, data.html);
  }

  async _fetchTemplate (templateName) {
    try {
      const source = await fs.readFile(path.join(EMAIL_TEMPLATES_FOLDER_PATH, `${templateName}.hbs`), 'utf-8');
      const template = handlebars.compile(source);
      return template;
    } catch (error) {
      throw new Error(`Template with name "${templateName}" not found`);
    }
  }

  _encodeFileName (source) {
    return source.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  }
}

const email = new Email();

(async () => {
  await email.sendEmailVerification('barnabas.lesti@gmail.com', 'www.facebook.com');
})();

module.exports = new Email();
