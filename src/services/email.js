const path = require('path');
const fs = require('fs-extra');
const mailgunJs = require('mailgun-js');
const handlebars = require('handlebars');

const config = require('../common/config');
const logger = require('../common/logger');
const i18n = require('../services/i18n');

let mailgun;
if (config.EMAIL_MAILGUN_API_KEY && config.EMAIL_MAILGUN_DOMAIN) {
  mailgun = mailgunJs({
    apiKey: config.EMAIL_MAILGUN_API_KEY,
    domain: config.EMAIL_MAILGUN_DOMAIN,
  });
  logger.info('Mailgun setup successful');
} else {
  logger.warn('Mailgun settings missing, emails will be saved to the temp folder');
}

const EMAIL_TEMPLATES_FOLDER_PATH = path.join(__dirname, '../templates/email');

class Email {
  async sendEmailVerification (to, linkHref, locale = config.DEFAULT_LOCALE) {
    const content = await this._fetchTemplateContent('general', {
      locale,
      content: i18n.get(locale, 'emails.emailVerification.content', { linkHref }),
    });
    const subject = i18n.get(locale, 'emails.emailVerification.subject');
    await this.send(to, subject, content);
  }

  async sendPasswordReset (to, linkHref, locale = config.DEFAULT_LOCALE) {
    const content = await this._fetchTemplateContent('general', {
      locale,
      content: i18n.get(locale, 'emails.passwordReset.content', { linkHref }),
    });
    const subject = i18n.get(locale, 'emails.passwordReset.subject');
    await this.send(to, subject, content);
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

  async _fetchTemplateContent (templateName, templateData = {}) {
    try {
      const source = await fs.readFile(path.join(EMAIL_TEMPLATES_FOLDER_PATH, `${templateName}.hbs`), 'utf-8');
      const template = handlebars.compile(source);
      const content = template(templateData);
      return content;
    } catch (error) {
      throw new Error(`Template with name "${templateName}" was not found`);
    }
  }

  _encodeFileName (source) {
    return source.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  }
}

module.exports = new Email();
