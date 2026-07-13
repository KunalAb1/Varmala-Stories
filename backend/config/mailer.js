import nodemailer from "nodemailer";

// Requires EMAIL_USER (your Gmail address) and EMAIL_APP_PASSWORD (16-char Google App Password)
// to be set as environment variables, both locally in .env and on Render.
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});