/**
 * Vercel / Node Serverless SMTP Email Dispatcher
 * Uses Gmail SMTP with standard TLS/SSL
 * 
 * Environment Variables required:
 * GMAIL_USER=thilacramesh@gmail.com
 * GMAIL_APP_PASS=aviipmjoxbytvnwh (without spaces)
 */

const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  // Enable CORS if requested across domains
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields (name, email, message)" });
  }

  const gmailUser = process.env.GMAIL_USER || "thilacramesh@gmail.com";
  // The app password can be provided via environment variable
  const gmailPass = (process.env.GMAIL_APP_PASS || process.env.SMTP_PASS || "").replace(/\s+/g, "");

  if (!gmailPass) {
    return res.status(500).json({ error: "SMTP server password is not configured in environment variables." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // SSL
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    });

    await transporter.sendMail({
      from: `"Portfolio Dispatch" <${gmailUser}>`,
      to: gmailUser,
      replyTo: email,
      subject: `⚡ Portfolio Contact Dispatch from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
          <h2 style="color: #0284c7; margin-top: 0;">⚡ New Portfolio Dispatch</h2>
          <p style="margin: 6px 0;"><strong>Sender Name:</strong> ${name}</p>
          <p style="margin: 6px 0;"><strong>Sender Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 16px 0;" />
          <h3 style="font-size: 0.95rem; color: #475569; text-transform: uppercase; margin-bottom: 8px;">Message Content:</h3>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #0284c7; white-space: pre-wrap; line-height: 1.6; color: #1e293b;">${message}</div>
          <p style="font-size: 0.75rem; color: #94a3b8; margin-top: 20px;">Sent via Portfolio Contact Transmission System.</p>
        </div>
      `
    });

    return res.status(200).json({ success: true, message: "Transmission dispatched successfully via SMTP." });
  } catch (err) {
    console.error("SMTP Transmission Error:", err);
    return res.status(500).json({ error: "Failed to dispatch email via SMTP", details: err.message });
  }
};
