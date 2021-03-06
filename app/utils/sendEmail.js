// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');

module.exports = (to, subject, text, link) => {
  process.stdout.write(`Sending email to ${to}... `);
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: to,
    from: process.env.EMAIL_FROM || 'test@example.com',
    subject: subject,
    text: text,
    html: `<p>${text}</p><a href="${link}">${link}</a>`
  };
  sgMail.send(msg);
  console.log(`Email sent!`);
};
