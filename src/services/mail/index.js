const path = require('path');
const fs = require('fs-extra');
const mailgunJs = require('mailgun-js');

const {
  MAILGUN_API_KEY,
  MAILGUN_DOMAIN,
  EMAIL_FROM_ADDRESS,
  TEMP_DIR_PATH,
} = require('../../../../config/env');
const Logger = require('../logger');
const { templateNames, templates } = require('./templates');

let mailgun;
if (MAILGUN_API_KEY && MAILGUN_DOMAIN) {
  mailgun = mailgunJs({
    apiKey: MAILGUN_API_KEY,
    domain: MAILGUN_DOMAIN,
  });
  Logger.success('MAILGUN setup successful');
} else {
  Logger.info('MAILGUN settings missing, mails will be saved to the TEMP folder');
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
      from: EMAIL_FROM_ADDRESS,
      to: this.to,
      subject: this.subject,
      html: this.content,
    };

    if (mailgun) {
      await mailgun.messages().send(data);
    } else {
      const emailFilePath = path.join(TEMP_DIR_PATH, './email', `${this.to}_${this.template}_${this.locale}.html`);
      await fs.outputFile(emailFilePath, data.html);
    }
    return this.content;
  }
}

Mail.Templates = templateNames;

module.exports = Mail;
