const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465, // true for port 465, false for others like 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  family: 4,
});

const sendEmail = async ({ to, subject, text, html }) => {
  await transporter.sendMail({
  from: `"${process.env.APP_NAME || 'Marketplace'}" <${process.env.SMTP_USER}>`,
  to,
  subject,
  text,
  html,
  });
};

module.exports = { sendEmail };