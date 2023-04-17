const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log('options', options);

  //   const transporter = nodemailer.createTransport({
  //     host: process.env.EMAIL_HOST,
  //     port: process.env.PORT,
  //     auth: {
  //       user: process.env.EMAIL_USERNAME,
  //       pass: process.env.EMAIL_PASSWORD,
  //     },
  //     // active in gmail "les secure app" option
  //   });

  var transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '5a465913f18431',
      pass: '2985ce76c704e8',
    },
  });

  const mailOptions = {
    from: 'Bledon ibishi <test@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

// const nodemailer = require('nodemailer');
// const pug = require('pug');
// const htmlToText = require('html-to-text');

// module.exports = class Email {
//   constructor(user, url) {
//     this.to = user.email;
//     this.firstName = usre.name.split(' ')[0];
//     this.url = url;
//     this.from = `Bledon Ibishi <${process.env.EMAIL_FROM}>`;
//   }

//   newTransport() {
//     if (process.env.NODE_ENV === 'production') {
//       return nodemailer.createTransport({
//         service: 'SendGrid',
//         auth: {
//           user: process.env.SENDGRID_USERNAME,
//           pass: process.env.SENDGRID_PASSWORD,
//         },
//       });
//     }
//     return nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });
//   }
//   async send(template, subject) {
//     const html = pug.renderFile(
//       `${__dirname}/../views/emails/${template}.pug`,
//       {
//         firstName: this.firstName,
//         url: this.url,
//         subject,
//       }
//     );

//     const mailOptions = {
//       from: this.from,
//       to: this.to,
//       subject,
//       html,
//       text: htmlToText.fromString(html),
//     };
//     this.newTransport().sendMail(mailOptions);
//   }

//   async sendWelcome() {
//     await this.send('welcome', 'Welcome to the Web Maverics!');
//   }
//   async sendPasswordReset() {
//     await this.send(
//       'passwordReset',
//       'Your password reset token (valid for only 10 minutes)'
//     );
//   }
// };

// // 1.Create a trasnporter

// //   2.Define the email options
// const mailOptions = {
//   from: 'Bledon ibishi <test@gmail.com>',
//   to: options.email,
//   subject: options.subject,
//   text: options.message,
//   // html:
// };
