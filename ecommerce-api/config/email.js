const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (userEmail, token) => {
  const emailContent = require('../utils/emailTemplates')(userEmail, token);

  await transporter.sendMail({
    from: `"Your App Name" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: 'Email Verification - Your App Name',
    html: emailContent,
  });
};

module.exports = sendVerificationEmail;
