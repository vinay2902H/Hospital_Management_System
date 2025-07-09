import nodemailer from 'nodemailer';
import expressAsyncHandler from 'express-async-handler';


import dotenv from 'dotenv';
dotenv.config();


console.log(process.env.SMTP_HOST, process.env.SMTP_PORT, process.env.SMTP_MAIL);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "vinaykumarkothapalli73@gmail.com",
    pass: "poitbwzfljojnajh", 
  },
});

export const sendEmail = expressAsyncHandler(async (req, res) => {
  const { email, subject, message } = req.body;

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    text: message,
  };
  console.log("hello");

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to send email" });
    } else {
      console.log("Email sent successfully!");
      res.status(200).json({ message: "Email sent successfully" });
    }
  });
});
