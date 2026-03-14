import { Request, Response } from "express";
import nodemailer from "nodemailer";

interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

// POST /api/contact - Send contact form email
export const sendContactEmail = async (req: Request, res: Response) => {
  try {
    const { name, email, message }: ContactRequest = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Name, email, and message are required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email address",
      });
    }

    // Get email configuration from environment variables
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_EMAIL } =
      process.env;

    // Check if email is configured
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_EMAIL) {
      console.error(
        "Email configuration missing. Please set SMTP_HOST, SMTP_USER, SMTP_PASS, and CONTACT_EMAIL in .env"
      );
      return res.status(500).json({
        error: "Email service not configured",
        message: "Please contact the administrator",
      });
    }

    // Create transporter for InterServer mail service
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST || "mail.interserver.net",
      port: parseInt(SMTP_PORT || "587"),
      secure: SMTP_PORT === "465", // true for 465 (SSL), false for 587 (TLS)
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      tls: {
        // Do not fail on invalid certs (some servers may have self-signed certs)
        rejectUnauthorized: false,
      },
    });

    // Verify transporter configuration
    await transporter.verify();

    // Email content
    const mailOptions = {
      from: `"${name}" <${SMTP_USER}>`,
      replyTo: email,
      to: CONTACT_EMAIL,
      subject: `Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B4513;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background-color: white; padding: 15px; border-radius: 3px; margin-top: 10px;">${message}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This email was sent from the contact form on the Tenth Avenue Bible Chapel website.
          </p>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}

Message:
${message}

---
This email was sent from the contact form on the Tenth Avenue Bible Chapel website.
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message:
        "Your message has been sent successfully. We'll get back to you soon!",
    });
  } catch (error: any) {
    console.error("Error sending contact email:", error);

    // Handle specific nodemailer errors
    if (error.code === "EAUTH") {
      return res.status(500).json({
        error: "Email authentication failed",
        message: "Please check your email configuration",
      });
    }

    res.status(500).json({
      error: "Failed to send email",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "An error occurred while sending your message. Please try again later.",
    });
  }
};
