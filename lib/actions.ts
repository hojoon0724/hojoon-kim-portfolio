"use server";
import nodemailer from "nodemailer";

export async function emailForm({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  // Validate the form data
  if (!name || !email || !message) {
    return { success: false, message: "All fields are required." };
  }

  // Send the email using the SMTP server
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `hojoonkim.com <contact@hojoonkim.com>`,
    to: "contact@hojoonkim.com",
    subject: "New Contact Form Submission",
    text: message,
    replyTo: `${name} <${email}>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email sent successfully." };
  } catch (error) {
    return { success: false, message: `Failed to send email. Error: ${error}` };
  }
}
