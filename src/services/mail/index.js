const path = require('path');
const fs = require('fs-extra');
const mailgunJs = require('mailgun-js');

const { config, logger } = require('../../common');
const { templateNames, templates } = require('./templates');

let mailgun;
if (config.EMAIL_MAILGUN_API_KEY && config.EMAIL_MAILGUN_DOMAIN) {
  mailgun = mailgunJs({
    apiKey: config.EMAIL_MAILGUN_API_KEY,
    domain: config.EMAIL_MAILGUN_DOMAIN,
  });
  logger.success('EMAIL_MAILGUN setup successful.');
} else {
  logger.info('EMAIL_MAILGUN settings missing, mails will be saved to the TEMP folder.');
}

class Mail {
  constructor (to, locale, template, templateArgs) {
    const { subject, content } = templates[locale][template](templateArgs);
    this.to = to;
    this.subject = subject;
    this.content = content;
    this.locale = locale;
    this.template = template;
  }

  async send () {
    const data = {
      from: config.EMAIL_FROM_ADDRESS,
      to: this.to,
      subject: this.subject,
      html: this.content,
    };

    if (mailgun) {
      await mailgun.messages().send(data);
    } else {
      const emailFilePath = path.join(config.TEMP_FOLDER_PATH, './email', `${this.to}_${this.template}_${this.locale}.html`);
      await fs.outputFile(emailFilePath, data.html);
    }
    return this.content;
  }
}

Mail.Templates = templateNames;

module.exports = Mail;
