import nodemailer from "nodemailer";

// Uses Brevo's SMTP relay to send contact form notification emails.
// Requires these environment variables, both locally in .env and on Render:
//   BREVO_SMTP_USER  -> your Brevo account login email
//   BREVO_SMTP_KEY   -> your Brevo SMTP key (Settings -> SMTP & API -> SMTP tab)
export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // Brevo uses STARTTLS on port 587, not implicit TLS
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});