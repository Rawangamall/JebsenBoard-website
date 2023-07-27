const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
try{
    const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.Email, 
      pass: process.env.Email_password,
    },
    debug: true, // Enable debugging
  });

  const mailOptions = {
    from: "orderdispatching4@gmail.com", 
    to: options.to, 
    subject: options.subject, 
    html: options.message, 
  };

  await transporter.sendMail(mailOptions);
} catch (error) {
  console.error("Error sending email:", error);
}
};


  module.exports = sendEmail;