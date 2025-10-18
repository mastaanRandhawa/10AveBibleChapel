import nodemailer from "nodemailer";
import { config } from "@/config";
import { logger } from "@/config/logger";
import { EmailData, EmailTemplate } from "@/types";

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465, // true for 465, false for other ports
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  // ============================================================================
  // EMAIL TEMPLATES
  // ============================================================================

  private getWelcomeEmailTemplate(name: string): EmailTemplate {
    return {
      subject: "Welcome to 10th Avenue Bible Chapel",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to 10th Avenue Bible Chapel</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #8B4513; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 10px 20px; background-color: #8B4513; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to 10th Avenue Bible Chapel</h1>
            </div>
            <div class="content">
              <h2>Dear ${name},</h2>
              <p>Welcome to our church family! We're delighted that you've joined our community.</p>
              <p>At 10th Avenue Bible Chapel, we believe in:</p>
              <ul>
                <li>Building meaningful relationships with God and each other</li>
                <li>Growing in faith through Bible study and prayer</li>
                <li>Serving our community with love and compassion</li>
              </ul>
              <p>We invite you to join us for our weekly services:</p>
              <ul>
                <li><strong>Breaking of Bread:</strong> Sundays at 9:30 AM</li>
                <li><strong>Family Bible Hour:</strong> Sundays at 11:00 AM</li>
                <li><strong>Estudio Bíblico:</strong> Sundays at 12:30 PM</li>
              </ul>
              <p>If you have any questions or need prayer, please don't hesitate to reach out to us.</p>
              <p>Blessings,<br>The 10th Avenue Bible Chapel Team</p>
            </div>
            <div class="footer">
              <p>10th Avenue Bible Chapel<br>
              7103 - 10th Ave., Burnaby, BC V3N 2R5<br>
              Phone: (604) 222-7777<br>
              Email: info@10thavebiblechapel.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to 10th Avenue Bible Chapel
        
        Dear ${name},
        
        Welcome to our church family! We're delighted that you've joined our community.
        
        At 10th Avenue Bible Chapel, we believe in:
        - Building meaningful relationships with God and each other
        - Growing in faith through Bible study and prayer
        - Serving our community with love and compassion
        
        We invite you to join us for our weekly services:
        - Breaking of Bread: Sundays at 9:30 AM
        - Family Bible Hour: Sundays at 11:00 AM
        - Estudio Bíblico: Sundays at 12:30 PM
        
        If you have any questions or need prayer, please don't hesitate to reach out to us.
        
        Blessings,
        The 10th Avenue Bible Chapel Team
        
        10th Avenue Bible Chapel
        7103 - 10th Ave., Burnaby, BC V3N 2R5
        Phone: (604) 222-7777
        Email: info@10thavebiblechapel.com
      `,
    };
  }

  private getPasswordResetEmailTemplate(
    name: string,
    resetToken: string
  ): EmailTemplate {
    const resetUrl = `${config.cors.origin}/reset-password?token=${resetToken}`;

    return {
      subject: "Password Reset Request - 10th Avenue Bible Chapel",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset Request</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #8B4513; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 10px 20px; background-color: #8B4513; color: white; text-decoration: none; border-radius: 5px; }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Dear ${name},</h2>
              <p>We received a request to reset your password for your 10th Avenue Bible Chapel account.</p>
              <p>Click the button below to reset your password:</p>
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background-color: #f0f0f0; padding: 10px; border-radius: 3px;">
                ${resetUrl}
              </p>
              <div class="warning">
                <strong>Important:</strong> This link will expire in 1 hour for security reasons.
              </div>
              <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
              <p>Blessings,<br>The 10th Avenue Bible Chapel Team</p>
            </div>
            <div class="footer">
              <p>10th Avenue Bible Chapel<br>
              7103 - 10th Ave., Burnaby, BC V3N 2R5<br>
              Phone: (604) 222-7777<br>
              Email: info@10thavebiblechapel.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request - 10th Avenue Bible Chapel
        
        Dear ${name},
        
        We received a request to reset your password for your 10th Avenue Bible Chapel account.
        
        To reset your password, please visit the following link:
        ${resetUrl}
        
        Important: This link will expire in 1 hour for security reasons.
        
        If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
        
        Blessings,
        The 10th Avenue Bible Chapel Team
        
        10th Avenue Bible Chapel
        7103 - 10th Ave., Burnaby, BC V3N 2R5
        Phone: (604) 222-7777
        Email: info@10thavebiblechapel.com
      `,
    };
  }

  private getEmailVerificationTemplate(
    name: string,
    verificationToken: string
  ): EmailTemplate {
    const verificationUrl = `${config.cors.origin}/verify-email?token=${verificationToken}`;

    return {
      subject: "Verify Your Email - 10th Avenue Bible Chapel",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #8B4513; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 10px 20px; background-color: #8B4513; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verify Your Email Address</h1>
            </div>
            <div class="content">
              <h2>Dear ${name},</h2>
              <p>Thank you for registering with 10th Avenue Bible Chapel! To complete your registration, please verify your email address.</p>
              <p>Click the button below to verify your email:</p>
              <p style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background-color: #f0f0f0; padding: 10px; border-radius: 3px;">
                ${verificationUrl}
              </p>
              <p>Once verified, you'll have full access to all features of our website.</p>
              <p>Blessings,<br>The 10th Avenue Bible Chapel Team</p>
            </div>
            <div class="footer">
              <p>10th Avenue Bible Chapel<br>
              7103 - 10th Ave., Burnaby, BC V3N 2R5<br>
              Phone: (604) 222-7777<br>
              Email: info@10thavebiblechapel.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Verify Your Email Address - 10th Avenue Bible Chapel
        
        Dear ${name},
        
        Thank you for registering with 10th Avenue Bible Chapel! To complete your registration, please verify your email address.
        
        To verify your email, please visit the following link:
        ${verificationUrl}
        
        Once verified, you'll have full access to all features of our website.
        
        Blessings,
        The 10th Avenue Bible Chapel Team
        
        10th Avenue Bible Chapel
        7103 - 10th Ave., Burnaby, BC V3N 2R5
        Phone: (604) 222-7777
        Email: info@10thavebiblechapel.com
      `,
    };
  }

  private getPrayerRequestNotificationTemplate(
    requester: string,
    title: string
  ): EmailTemplate {
    return {
      subject: "New Prayer Request - 10th Avenue Bible Chapel",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Prayer Request</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #8B4513; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .prayer-box { background-color: #fff; border-left: 4px solid #8B4513; padding: 15px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Prayer Request</h1>
            </div>
            <div class="content">
              <h2>Dear Church Leadership,</h2>
              <p>A new prayer request has been submitted through our website.</p>
              <div class="prayer-box">
                <h3>Prayer Request Details:</h3>
                <p><strong>Requester:</strong> ${requester || "Anonymous"}</p>
                <p><strong>Title:</strong> ${title}</p>
              </div>
              <p>Please log in to the admin panel to review and manage this prayer request.</p>
              <p>Blessings,<br>10th Avenue Bible Chapel System</p>
            </div>
            <div class="footer">
              <p>10th Avenue Bible Chapel<br>
              7103 - 10th Ave., Burnaby, BC V3N 2R5<br>
              Phone: (604) 222-7777<br>
              Email: info@10thavebiblechapel.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        New Prayer Request - 10th Avenue Bible Chapel
        
        Dear Church Leadership,
        
        A new prayer request has been submitted through our website.
        
        Prayer Request Details:
        - Requester: ${requester || "Anonymous"}
        - Title: ${title}
        
        Please log in to the admin panel to review and manage this prayer request.
        
        Blessings,
        10th Avenue Bible Chapel System
        
        10th Avenue Bible Chapel
        7103 - 10th Ave., Burnaby, BC V3N 2R5
        Phone: (604) 222-7777
        Email: info@10thavebiblechapel.com
      `,
    };
  }

  // ============================================================================
  // EMAIL SENDING METHODS
  // ============================================================================

  async sendEmail(emailData: EmailData): Promise<void> {
    try {
      const mailOptions = {
        from: config.email.from,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to: ${emailData.to}`);
    } catch (error) {
      logger.error("Email sending failed:", error);
      throw new Error("Failed to send email");
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const template = this.getWelcomeEmailTemplate(name);
    await this.sendEmail({
      to: email,
      ...template,
    });
  }

  async sendPasswordResetEmail(
    email: string,
    name: string,
    resetToken: string
  ): Promise<void> {
    const template = this.getPasswordResetEmailTemplate(name, resetToken);
    await this.sendEmail({
      to: email,
      ...template,
    });
  }

  async sendEmailVerification(
    email: string,
    name: string,
    verificationToken: string
  ): Promise<void> {
    const template = this.getEmailVerificationTemplate(name, verificationToken);
    await this.sendEmail({
      to: email,
      ...template,
    });
  }

  async sendPrayerRequestNotification(
    email: string,
    requester: string,
    title: string
  ): Promise<void> {
    const template = this.getPrayerRequestNotificationTemplate(
      requester,
      title
    );
    await this.sendEmail({
      to: email,
      ...template,
    });
  }

  // ============================================================================
  // EMAIL VERIFICATION
  // ============================================================================

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info("Email service connection verified");
      return true;
    } catch (error) {
      logger.error("Email service connection failed:", error);
      return false;
    }
  }
}

export const emailService = new EmailService();
