import nodemailer from 'nodemailer';

// Send Mail Function
const sendMail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "makwanashivam1709@gmail.com", // Your Gmail address
        pass: "pljkizoywskopsyc", // Your 16-character App Password (No Spaces)
      },
    });

    const mailOptions = {
      from: "makwanashivam1709@gmail.com",
      to: to,
      subject: subject,
      text: text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true;
  } catch (error) {
    console.log("Error sending email:", error);
    return false;
  }
};

export default sendMail;
