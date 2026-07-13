import nodemailer from "nodemailer";

// Requires EMAIL_USER (your Gmail address) and EMAIL_APP_PASSWORD (16-char Google App Password)
// to be set as environment variables, both locally in .env and on Render.
//
// Using explicit host/port (instead of service: "gmail") with family: 4 forces an IPv4
// connection — some hosts (like Render) can't route outbound IPv6 to Gmail's SMTP servers,
// which causes an ENETUNREACH error otherwise.
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
  family: 4,
});