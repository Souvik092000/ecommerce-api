const generateVerificationEmail = (email, token) => {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${encodeURIComponent(
      token
    )}`;
  
    return `
      <h1>Verify Your Email</h1>
      <p>Thank you for signing up. Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>If you did not request this, please ignore this email.</p>
    `;
  };
  
  module.exports = generateVerificationEmail;
  