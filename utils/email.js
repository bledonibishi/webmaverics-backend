const nodemailer = require('nodemailer');
const fs = require('fs');
const pug = require('pug');
const htmlToText = require('html-to-text');
const cheerio = require('cheerio');

// new Email(user, url).sendWelcome();
function htmlToPlainText(html) {
  const $ = cheerio.load(html);
  return $.text();
}
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Bledon Ibishi <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    console.log('process.env.ENVIRONMENT', process.env.ENVIRONMENT);
    if (process.env.ENVIRONMENT === 'production') {
      console.log('true');
    } else {
      console.log('false', false);
    }

    if (process.env.ENVIRONMENT === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = fs.readFileSync(
      `${__dirname}/../views/emails/${template}.html`,
      'utf-8'
    );

    const replacedHtml = html
      .replace(/{firstName}/g, this.firstName)
      .replace(/{url}/g, this.url)
      .replace(/{subject}/g, subject);
    console.log('this.from', this.from);

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: replacedHtml,
      text: htmlToPlainText(replacedHtml),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Web Maverics!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};
