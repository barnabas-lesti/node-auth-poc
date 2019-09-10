const templateNames = {
  PASSWORD_RESET: 'passwordReset',
  EMAIL_VERIFICATION: 'emailVerification',
};

const templates = {
  'en': {
    [templateNames.EMAIL_VERIFICATION]: ({ link }) => ({
      subject: 'Finish your registration to Daisy',
      content: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
          </head>
          <body>
            Hi there,<br>
            <br>
            To finish your registration click <a href="${link}" target="_blank">here</a>.<br>
            <br>
            Best regards,<br>
            <strong>The Daisy Team</strong>
          </body>
        </html>
      `,
    }),
    [templateNames.PASSWORD_RESET]: ({ link }) => ({
      subject: 'Reset your password for Daisy',
      content: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
        </head>
        <body>
          Hi there,<br>
          <br>
          To reset your password, click <a href="${link}" target="_blank">here</a><br>
          <br>
          Best regards,<br>
          <strong>The Daisy Team</strong>
        </body>
      </html>
      `,
    }),
  },

  'hu': {
    [templateNames.REGISTRATION]: () => ({
      subject: 'TODO: Finish your registration to Daisy',
      content: `
        <!DOCTYPE html>
        <html lang="hu">
        </html>
      `,
    }),
    [templateNames.PASSWORD_RESET]: () => ({
      subject: 'TODO: Reset your password for Daisy',
      content: `
        <!DOCTYPE html>
        <html lang="hu">
        </html>
      `,
    }),
  },
};

module.exports = {
  templateNames,
  templates,
};
